// ==UserScript==
// @name        HTML5 Video Control
// @namespace   HTML5VideoControl
// @description Add keyboard shortcuts to adjust speed and control playback.
// @version     1.3.0
// @author      maoqiu & Sketch
// @include     http://*/*
// @include     https://*/*
// @grant       none
// ==/UserScript==

(function () {
    var $tip = document.createElement('p');
    $tip.id = 'h5-video-control-tip';
    $tip.style.backgroundColor = '#0000007f';
    $tip.style.boxSizing = 'border-box';
    $tip.style.borderRadius = '4px';
    $tip.style.color = 'white';
    $tip.style.fontSize = '28px';
    $tip.style.padding = '2px 8px 2px 8px';
    $tip.style.position = 'fixed';
    $tip.style.textShadow =
        '1px 1px black, -1px 1px black, 1px -1px black, -1px -1px black';
    $tip.style.verticalAlign = 'center';
    $tip.style.zIndex = '9999999999';

    var defaultFastForwardRate = 3.0;
    var defaultFastForwardStep = 0.1;

    var scriptEnabled = true;
    var toggleTimeout;

    var toggleTipView = function () {
        document.body.appendChild($tip);
        if (toggleTimeout) {
            clearTimeout(toggleTimeout);
            toggleTimeout = null;
            $tip.innerText = '';
        }
        toggleTimeout = setTimeout(function () {
            $tip.innerText = '';
            toggleTimeout = null;
            document.body.removeChild($tip);
        }, 1000);
    };

    var initTipViewPosition = function ($ref) {
        var offset = $ref.getBoundingClientRect();
        $tip.style.top = offset.top + 15 + 'px';
        $tip.style.left = offset.left + 15 + 'px';
    };

    addEventListener('keydown', function (ev) {
        var $ele = document.querySelector('VIDEO');
        if ($ele) {
            var activeElement = document.activeElement;
            var tagName = activeElement.tagName;
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;

            // Block on combination key
            if (ev.altKey || ev.shiftKey || ev.ctrlKey) {
                // releaseFastForward($ele);
                // ev.preventDefault();
                return;
            }

            toggleTipView();
            initTipViewPosition($ele);
            switch (ev.key) {
                case 'q':
                    if (scriptEnabled) {
                        scriptEnabled = false;
                        $tip.innerText = 'HTML5 Video Control Disabled';
                    } else {
                        scriptEnabled = true;
                        $tip.innerText = 'HTML5 Video Control Enabled';
                    }
                    break;
                case 'x':
                    if (!scriptEnabled) return;
                    if ($ele.playbackRate > defaultFastForwardStep) {
                        $ele.playbackRate = (
                            $ele.playbackRate - defaultFastForwardStep
                        ).toFixed(1);
                    }
                    $tip.innerText = 'Speed: ' + $ele.playbackRate.toFixed(1);
                    break;
                case 'c':
                    if (!scriptEnabled) return;
                    $ele.playbackRate = (
                        $ele.playbackRate + defaultFastForwardStep
                    ).toFixed(1);
                    $tip.innerText = 'Speed: ' + $ele.playbackRate.toFixed(1);
                    break;
                case 'z':
                    if (!scriptEnabled) return;
                    if ($ele.playbackRate === 1) {
                        $ele.playbackRate = defaultFastForwardRate;
                    } else {
                        $ele.playbackRate = 1;
                    }
                    $tip.innerText = 'Speed: ' + $ele.playbackRate.toFixed(1);
                    break;
                case 'd':
                    if (!scriptEnabled) return;
                    !$ele.paused && $ele.pause();
                    if ($ele.currentTime > 1) {
                        $ele.currentTime -= Number(1 / 30);
                    }
                    $tip.innerText =
                        'Frame: ' + (30 * $ele.currentTime).toFixed(0);
                    break;
                case 'f':
                case 'g':
                    if (!scriptEnabled) return;
                    !$ele.paused && $ele.pause();
                    $ele.currentTime += Number(1 / 30);
                    $tip.innerText =
                        'Frame: ' + (30 * $ele.currentTime).toFixed(0);
                    break;
                default:
                    break;
            }
            ev.preventDefault();
        }
    });
})();
