"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[408],{6408:(e,n,t)=>{t.r(n),t.d(n,{default:()=>i});const i=function(e){var n=document.getElementById("voice"),t=document.getElementById("rate");function i(){e.voices=window.speechSynthesis.getVoices().filter((function(e){return e.lang.startsWith("en")})),e.voices.forEach((function(e,t){var i=document.createElement("option");i.value=t,i.textContent="🗣 "+e.name,n.appendChild(i)}))}i();var a=e.voices.find((function(e){return e.default}));a&&(n.value=e.voices.indexOf(a)),window.speechSynthesis.onvoiceschanged=function(){n.innerHTML="",i()},t.addEventListener("input",(function(n){e.setRate(parseFloat(t.value))})),n.addEventListener("change",(function(){e.setVoice(n.value)})),e.setRate(parseFloat(t.value)),e.setVoice(n.value)}}}]);