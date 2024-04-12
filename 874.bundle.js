"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[874],{2874:(t,e,n)=>{function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function o(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,r(i.key),i)}}function r(t){var e=function(t,e){if("object"!=i(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,"string");if("object"!=i(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==i(e)?e:String(e)}function a(t){if(window.DeviceOrientationEvent){var e=function(e){if(e.absolute&&null!=e.alpha&&null!=e.beta&&null!=e.gamma){var i=-(e.alpha+e.beta*e.gamma/90);i-=360*Math.floor(i/360),window.removeEventListener("deviceorientation",n),t(i)}},n=function(n){var i=n.webkitCompassHeading;null==i||isNaN(i)||(t(i),window.removeEventListener("deviceorientationabsolute",e))};"function"==typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then((function(t){"granted"==t?i():console.warn("Permission for DeviceMotionEvent not granted")})):i()}else console.warn("DeviceOrientation API not available");function i(){window.addEventListener("deviceorientationabsolute",e),window.addEventListener("deviceorientation",n)}}n.r(e),n.d(e,{HeadingCalculator:()=>s,startCompassListener:()=>a});var s=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.windowSize=e,this.points=[]}var e,n;return e=t,(n=[{key:"addPoint",value:function(t,e){this.points.push({latitude:t,longitude:e}),this.points.length>this.windowSize&&this.points.shift()}},{key:"resetPoints",value:function(){this.points=[]}},{key:"computeHeading",value:function(){if(this.points.length<2)return null;for(var t=this.points.length,e=0,n=0;n<t-1;n++){var i=this.points[n],o=this.points[n+1],r=this.degreesToRadians(i.latitude),a=this.degreesToRadians(i.longitude),s=this.degreesToRadians(o.latitude),u=this.degreesToRadians(o.longitude)-a,l=Math.sin(u)*Math.cos(s),c=Math.cos(r)*Math.sin(s)-Math.sin(r)*Math.cos(s)*Math.cos(u),f=Math.atan2(l,c);e+=f=((f=this.radiansToDegrees(f))+360)%360}return e/(t-1)}},{key:"degreesToRadians",value:function(t){return t*(Math.PI/180)}},{key:"radiansToDegrees",value:function(t){return t*(180/Math.PI)}}])&&o(e.prototype,n),Object.defineProperty(e,"prototype",{writable:!1}),t}()}}]);