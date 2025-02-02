// ==UserScript==
// @name         HTML5 Video Control
// @namespace    https://github.com/zhxie/HTML5-Video-Control
// @version      1.5.0
// @author       maoqiu & Sketch
// @description  Add keyboard shortcuts to adjust speed and control playback.
// @homepage     https://github.com/zhxie/HTML5-Video-Control
// @include      http://*/*
// @include      https://*/*
// @grant        none
// ==/UserScript==

const DefaultFastForwardRate = 3.0;
const DefaultFastForwardStep = 0.1;

(function () {
    "use strict";

    let activeVideo = null;
    addEventListener("click", function (e) {
        const video = e.target.closest("video");
        if (video) {
            activeVideo = video;
        }
    });

    let enabled = true;
    addEventListener("keydown", (ev) => {
        // Block on inputs.
        const tagName = document.activeElement.tagName;
        if (tagName === "INPUT" || tagName === "TEXTAREA") {
            return;
        }

        // Block on combination keys.
        if (ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey) {
            return;
        }

        // Select video.
        let ele = activeVideo;
        if (!ele) {
            ele = document.querySelector("VIDEO");
        }

        if (ele) {
            if (ev.key === "q") {
                if (enabled) {
                    enabled = false;
                    showOverlay(ele, "HTML5 Video Control Disabled");
                } else {
                    enabled = true;
                    showOverlay(ele, "HTML5 Video Control Enabled");
                }
                ev.preventDefault();
                return;
            }
            if (!enabled) {
                return;
            }

            switch (ev.key) {
                case "x":
                    if (ele.playbackRate > DefaultFastForwardStep) {
                        ele.playbackRate = (ele.playbackRate - DefaultFastForwardStep).toFixed(1);
                    }
                    showOverlay(ele, `Speed: ${ele.playbackRate.toFixed(1)}`);
                    break;
                case "c":
                    ele.playbackRate = (ele.playbackRate + DefaultFastForwardStep).toFixed(1);
                    showOverlay(ele, `Speed: ${ele.playbackRate.toFixed(1)}`);
                    break;
                case "z":
                    if (ele.playbackRate === 1) {
                        ele.playbackRate = DefaultFastForwardRate;
                    } else {
                        ele.playbackRate = 1;
                    }
                    showOverlay(ele, `Speed: ${ele.playbackRate.toFixed(1)}`);
                    break;
                case "d":
                    if (!ele.paused) {
                        ele.pause();
                    }
                    if (ele.currentTime > 1) {
                        ele.currentTime -= Number(1 / 30);
                    }
                    showOverlay(ele, "Frame: " + (30 * ele.currentTime).toFixed(0));
                    break;
                case "f":
                case "g":
                    if (!ele.paused) {
                        ele.pause();
                    }
                    ele.currentTime += Number(1 / 30);
                    showOverlay(ele, "Frame: " + (30 * ele.currentTime).toFixed(0));
                    break;
                default:
                    break;
            }
            ev.preventDefault();
        }
    });

    const showOverlay = (ele, text) => {
        const overlay = document.createElement("div");
        overlay.textContent = text;
        overlay.style.position = "absolute";
        overlay.style.top = "15px";
        overlay.style.left = "15px";
        overlay.style.padding = "2px 8px";
        overlay.style.background = "#0000007f";
        overlay.style.color = "white";
        overlay.style.fontSize = "28px";
        overlay.style.borderRadius = "4px";
        overlay.style.zIndex = "9999999999";

        ele.parentElement.style.position = "relative";
        ele.parentElement.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 1000);
    };
})();
