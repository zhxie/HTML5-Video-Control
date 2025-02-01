// ==UserScript==
// @name         HTML5 Video Control
// @namespace    https://github.com/zhxie/HTML5-Video-Control
// @version      1.4.0
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
    const tip = document.createElement("p");
    tip.id = "h5-video-control-tip";
    tip.style.backgroundColor = "#0000007f";
    tip.style.boxSizing = "border-box";
    tip.style.borderRadius = "4px";
    tip.style.color = "white";
    tip.style.fontSize = "28px";
    tip.style.padding = "2px 8px 2px 8px";
    tip.style.position = "fixed";
    tip.style.textShadow = "1px 1px black, -1px 1px black, 1px -1px black, -1px -1px black";
    tip.style.verticalAlign = "center";
    tip.style.zIndex = "9999999999";

    let scriptEnabled = true;

    let toggleTimeout;
    const toggleTipView = () => {
        document.body.appendChild(tip);
        if (toggleTimeout) {
            clearTimeout(toggleTimeout);
            toggleTimeout = null;
            tip.innerText = "";
        }
        toggleTimeout = setTimeout(function () {
            tip.innerText = "";
            toggleTimeout = null;
            document.body.removeChild(tip);
        }, 1000);
    };

    const initTipViewPosition = (ele) => {
        const offset = ele.getBoundingClientRect();
        tip.style.top = offset.top + 15 + "px";
        tip.style.left = offset.left + 15 + "px";
    };

    addEventListener("keydown", (ev) => {
        const ele = document.querySelector("VIDEO");
        if (ele) {
            // Block on inputs.
            const tagName = document.activeElement.tagName;
            if (tagName === "INPUT" || tagName === "TEXTAREA") {
                return;
            }

            // Block on combination keys.
            if (ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                return;
            }

            if (ev.key === "q" || scriptEnabled) {
                toggleTipView();
                initTipViewPosition(ele);
            }
            if (ev.key === "q") {
                if (scriptEnabled) {
                    scriptEnabled = false;
                    tip.innerText = "HTML5 Video Control Disabled";
                } else {
                    scriptEnabled = true;
                    tip.innerText = "HTML5 Video Control Enabled";
                }
                ev.preventDefault();
                return;
            }
            if (!scriptEnabled) {
                return;
            }

            switch (ev.key) {
                case "x":
                    if (ele.playbackRate > DefaultFastForwardStep) {
                        ele.playbackRate = (ele.playbackRate - DefaultFastForwardStep).toFixed(1);
                    }
                    tip.innerText = `Speed: ${ele.playbackRate.toFixed(1)}`;
                    break;
                case "c":
                    ele.playbackRate = (ele.playbackRate + DefaultFastForwardStep).toFixed(1);
                    tip.innerText = `Speed: ${ele.playbackRate.toFixed(1)}`;
                    break;
                case "z":
                    if (ele.playbackRate === 1) {
                        ele.playbackRate = DefaultFastForwardRate;
                    } else {
                        ele.playbackRate = 1;
                    }
                    tip.innerText = `Speed: ${ele.playbackRate.toFixed(1)}`;
                    break;
                case "d":
                    if (!ele.paused) {
                        ele.pause();
                    }
                    if (ele.currentTime > 1) {
                        ele.currentTime -= Number(1 / 30);
                    }
                    tip.innerText = "Frame: " + (30 * ele.currentTime).toFixed(0);
                    break;
                case "f":
                case "g":
                    if (!ele.paused) {
                        ele.pause();
                    }
                    ele.currentTime += Number(1 / 30);
                    tip.innerText = "Frame: " + (30 * ele.currentTime).toFixed(0);
                    break;
                default:
                    break;
            }
            ev.preventDefault();
        }
    });
})();
