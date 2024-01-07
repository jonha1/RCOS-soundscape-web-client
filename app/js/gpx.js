// Copyright (c) Daniel W. Steinbrook.
// with many thanks to ChatGPT

import { createSpatialPlayer } from './audio/sound.js'
import { createCalloutAnnouncer } from './audio/callout.js';
import { createLocationProvider } from './spatial/location.js'
import { HeadingCalculator } from './spatial/heading.js'
import { createMap } from './spatial/map.js'

const radiusMeters = 80;
const headingWindowSize = 5;  // number of recent points to use for estimating heading

function replayGPX(file, map, callbacks) {
  const {
    loadedCallback = () => {},
    finishedCallback = () => {},
    pointCallback = () => {},
    errorCallback = () => {}
  } = callbacks;
  let intervalId;
  let currentIndex = 0;
  let sliderValue = 0;

  const headingCalculator = new HeadingCalculator(headingWindowSize);

  let gpxPlayer = {
    speedUpFactor: 1,
    trackPoints: [],

    getPointAtIndex: function(index) {
      const point = this.trackPoints[index];
      const lat = parseFloat(point.getAttribute("lat"));
      const lon = parseFloat(point.getAttribute("lon"));
      return { lat, lon };
    },

    getHeadingAtIndex: function(index) {
      // When seeking, compute heading by looking back, rather than using the running window.
      headingCalculator.resetPoints()
      let minIdx = Math.max(0, index - headingWindowSize);
      let maxIdx = Math.min(index, this.trackPoints.length - 1);
      for (let idx = minIdx; idx <= maxIdx; idx++) {
        let point = this.getPointAtIndex(idx);
        headingCalculator.addPoint(point.lat, point.lon);
      }
      return headingCalculator.computeHeading();
    }
  };

  const reader = new FileReader();
  reader.onload = function (e) {
    const gpxContent = e.target.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxContent, "text/xml");

    // Assuming that the GPX file structure follows a standard format
    gpxPlayer.trackPoints = xmlDoc.querySelectorAll("trkpt");

    // Trigger loadded callback with first point
    const firstPoint = gpxPlayer.getPointAtIndex(0);
    loadedCallback(firstPoint);
  };

  reader.onerror = function (e) {
    errorCallback(e.target.error);
  };

  reader.readAsText(file);

  gpxPlayer.play = function() {
    intervalId = setInterval(() => {
      if (currentIndex < gpxPlayer.trackPoints.length) {
        const point = gpxPlayer.trackPoints[currentIndex];
        const lat = parseFloat(point.getAttribute("lat"));
        const lon = parseFloat(point.getAttribute("lon"));

        headingCalculator.addPoint(lat, lon);
        const heading = headingCalculator.computeHeading();

        map.setView([lat, lon], 16);

        pointCallback({ lat, lon, heading });
        currentIndex++;
      } else {
        this.pause(); // Stop playing when all points are processed
        finishedCallback();
      }
    }, 1000 / this.speedUpFactor // Delay between points in milliseconds
    );
  };

  gpxPlayer.pause = function() {
    clearInterval(intervalId);
  };

  gpxPlayer.seekTo = function(index) {
    currentIndex = index;
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= this.trackPoints.length) {
      currentIndex = this,trackPoints.length - 1;
    }

    let jumpPoint = this.getPointAtIndex(currentIndex);
    jumpPoint.heading = this.getHeadingAtIndex(currentIndex);
    pointCallback(jumpPoint);
  };

  gpxPlayer.updateSlider = function() {
    // Update the slider's value based on the current index
    const totalPoints = this.trackPoints.length - 1;
    sliderValue = (currentIndex / totalPoints) * 100;
    document.getElementById("pointSlider").value = sliderValue;
  };

  return gpxPlayer;
}

// Actions to take when page is rendered in full
document.addEventListener('DOMContentLoaded', function () {
  const locationProvider = createLocationProvider();
  const audioQueue = createSpatialPlayer(locationProvider);
  const announcer = createCalloutAnnouncer(audioQueue, radiusMeters, false);
  const map = createMap('map');
  let gpxPlayer = null;  // to be initialized on file selection

  // Register for updates to location
  // (no need to separately watch heading changes in GPX simulation)
  locationProvider.location.watch((latitude, longitude) => {
    // Map should follow current point
    map.setView([latitude, longitude], 16);
    map.plotMyLocation(locationProvider, radiusMeters);
  });

  const inputElement = document.getElementById("gpxFileInput");
  const playPauseButton = document.getElementById("playPauseButton");
  const pointSlider = document.getElementById("pointSlider");
  let playing = false;

  inputElement.addEventListener("change", function (event) {
    const file = event.target.files[0];
  
    if (file) {
      if (gpxPlayer && playing) {
        // Clear current playing file before loading new one
        playPauseButton.click();
      }

      // Reset seek bar
      pointSlider.value = 0;

      gpxPlayer = replayGPX(file, map, {
        // When GPX file has been loadedm trigger draw map at first point
        loadedCallback: (firstPoint) => locationProvider.location.update(firstPoint.lat, firstPoint.lon),
        // When GPX finishes playing, toggle to paused state
        finishedCallback: () => playPauseButton.click(),
        pointCallback: (point) => {
          locationProvider.orientation.update(point.heading);
          locationProvider.location.update(point.lat, point.lon);

          // Update the slider when a new point is parsed
          gpxPlayer.updateSlider();
        },
        errorCallback: (error) => console.error("Error parsing GPX file:", error),
      });
    }
  });

  playPauseButton.addEventListener("click", function () {
    if (gpxPlayer) {
      // Read speed setting, and speed up speech proportionally
      gpxPlayer.speedUpFactor = document.getElementById("speed").value;
      audioQueue.setRate(gpxPlayer.speedUpFactor);

      // Toggle play/pause
      if (!playing) {
        playPauseButton.textContent = "Pause";
        // Start triggering audio callouts
        locationProvider.location.watch(announcer.locationChanged)
        gpxPlayer.play();
        playing = true;
      } else {
        playPauseButton.textContent = "Play";
        // Strop triggering audio callouts
        locationProvider.location.unwatch(announcer.locationChanged);
        audioQueue.stopAndClear();
        gpxPlayer.pause();
        playing = false;
      }
    }
  });

  pointSlider.addEventListener("input", function () {
    if (gpxPlayer) {
      // Calculate the index based on the slider value
      const totalPoints = gpxPlayer.trackPoints.length - 1;
      const newIndex = Math.round((pointSlider.value / 100) * totalPoints);
      gpxPlayer.seekTo(newIndex);
    }
  });
});
