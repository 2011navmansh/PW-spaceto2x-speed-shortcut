// ==UserScript==
// @name         PW Live - Spacebar Hold 2x Speed (Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hold Spacebar = 2x speed, Release = original speed (PW Live)
// @match        https://www.pw.live/watch*
// @match        https://www.pw.live/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let originalRate = 1;
    let isHolding = false;
    let holdTimer = null;
    const HOLD_DELAY = 150;

    function getVideo() {
        return document.querySelector('video');
    }

    // ─── KEYDOWN ───
    document.addEventListener('keydown', function (e) {
        if (e.code !== 'Space') return;

        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        const video = getVideo();
        if (!video) return;

        // ★ FIX: HAMESHA block karo — repeat ho ya na ho
        // Taaki PW ka player repeat events pe play/pause na kare
        e.preventDefault();
        e.stopImmediatePropagation();

        if (e.repeat) return; // repeat pe bas block karo, logic mat chalao

        // Pehli baar press — timer start
        holdTimer = setTimeout(() => {
            originalRate = video.playbackRate;
            video.playbackRate = 2;
            isHolding = true;
        }, HOLD_DELAY);

    }, true);

    // ─── KEYUP ───
    document.addEventListener('keyup', function (e) {
        if (e.code !== 'Space') return;

        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        const video = getVideo();
        if (!video) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        if (isHolding) {
            // Hold kiya tha → original speed wapas
            video.playbackRate = originalRate;
            isHolding = false;
        } else {
            // Quick tap → Play / Pause
            clearTimeout(holdTimer);
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }

    }, true);

})();
