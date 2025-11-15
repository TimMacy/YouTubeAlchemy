// ==UserScript==
// @name         YouTube Alchemy
// @description  Toolkit for YouTube with 200+ options accessible via settings panels. Key features include: tab view, playback speed control, video quality selection, export transcripts, prevent autoplay, hide Shorts, disable play-on-hover, square design, auto-theater mode, number of videos per row, display remaining time adjusted for playback speed and SponsorBlock segments, persistent progress bar with chapter markers and SponsorBlock support, modify or hide various UI elements, and much more.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      9.2.4
// @namespace    TimMacy.YouTubeAlchemy
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @noframes
// @homepageURL  https://github.com/TimMacy/YouTubeAlchemy
// @supportURL   https://github.com/TimMacy/YouTubeAlchemy/issues
// @updateURL    https://raw.githubusercontent.com/TimMacy/YouTubeAlchemy/main/YouTubeAlchemy.js
// @downloadURL  https://raw.githubusercontent.com/TimMacy/YouTubeAlchemy/main/YouTubeAlchemy.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2025 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 9.2.4 - YouTube Alchemy                   *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(async function () {
    'use strict';
    // CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* main CSS */
        .CentAnni-overlay {
            position: fixed;
            display: flex;
            z-index: 2053;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, .5);
            backdrop-filter: blur(5px);
        }

        .CentAnni-modal-content {
            z-index: 2077;
            background-color: rgba(17, 17, 17, .8);
            padding: 20px 0 20px 20px;
            border: 1px solid rgba(255, 255, 255, .25);
            border-radius: 8px;
            width: 500px;
            max-height: 90dvh;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 9px;
            line-height: 1.2;
            color: white;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        #CentAnni-main-settings-form {
            max-height: calc(90dvh - 40px);
            overflow-y: auto;
            padding-right: 20px;
        }

        .CentAnni-notification {
            background: hsl(0, 0%, 7%);
            padding: 20px 30px;
            border-radius: 8px;
            border: 1px solid hsl(0, 0%, 18.82%);
            max-width: 80%;
            text-align: center;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 16px;
            color: white;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .CentAnni-header-wrapper {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: baseline;
            justify-content: center;
            margin: 0 20px 20px 0;
            width: calc(100% - 20px);
        }

        .CentAnni-header {
            margin: 0;
            padding: 0;
            border: 0;
            grid-column: 2;
            text-align: center;
            text-decoration: none;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 2.5em;
            line-height: 1.1em;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: normal;
            text-shadow: 0 0 20px black;
            cursor: pointer;
            background: transparent;
            display: block;
            background-image: linear-gradient(45deg, #FFFFFF, #F2F2F2, #E6E6E6, #D9D9D9, #CCCCCC);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transition: color .3s ease-in-out;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .CentAnni-header:hover {
            color: white;
        }

        .CentAnni-version-label {
            grid-column: 3;
            padding: 0;
            margin: 0 0 0 5px;
            color: ghostwhite;
            cursor: default;
            opacity: .3;
            transition: opacity .5s;
            justify-self: start;
            max-width: 10ch;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .CentAnni-header:hover + .CentAnni-version-label {
            opacity: 1;
        }

        .label-style-settings {
            display: block;
            margin-bottom: 5px;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
        }

        .reset-prompt-text {
            display: block;
            float: right;
            cursor: pointer;
            margin: 4px 10px 0 0;
            font-size: inherit;
            font-weight: 400;
            line-height: inherit;
            color: ghostwhite;
        }

        .reset-prompt-text:hover { color: red; }
        .reset-prompt-text:active { color: magenta; }

        .label-NotebookLM { color: hsl(134, 61%, 40%); }
        .label-ChatGPT { color: hsl(217, 91%, 59%); }
        .label-copy { color: hsl(33, 100%, 50%); }
        .label-download { color: hsl(359, 88%, 57%); }
        .label-lazy { color: hsl(51, 100%, 50%); }
        .label-settings { color: hsl(0, 0%, 100%); }

        .input-field-targetNotebookLMUrl:focus { border: 1px solid hsl(134, 61%, 40%); }
        .input-field-targetChatGPTUrl:focus { border: 1px solid hsl(217, 91%, 59%); }
        .buttonIconNotebookLM-input-field:focus { border: 1px solid hsl(134, 61%, 40%); }
        .buttonIconChatGPT-input-field:focus { border: 1px solid hsl(217, 91%, 59%); }
        .buttonIconCopy-input-field:focus { border: 1px solid hsl(33, 100%, 50%); }
        .buttonIconlazyLoad-input-field:focus { border: 1px solid hsl(51, 100%, 50%); }
        .buttonIconDownload-input-field:focus { border: 1px solid hsl(359, 88%, 57%); }

        .buttonIconSettings-input-field:focus,
        .links-header-container input:focus,
        .sidebar-container input:focus,
        #custom-css-form .select-file-naming:focus,
        #custom-css-form .dropdown-list {
            border: 1px solid hsl(0, 0%, 100%);
        }

        .file-naming-container .label-Video-Quality ~ .dropdown-list {
            max-height: 500px;
        }

        .file-naming-container .label-audio-language ~ .dropdown-list,
        .file-naming-container .label-transcript-language ~ .dropdown-list {
            max-height: 325px;
        }

        .file-naming-container .label-subtitle-language ~ .dropdown-list {
            max-height: 365px;
        }

        .input-field-url:hover,
        .select-file-naming:hover,
        .chatgpt-prompt-textarea:hover,
        .buttonIconCopy-input-field:hover,
        .input-field-targetChatGPTUrl:hover,
        .buttonIconChatGPT-input-field:hover,
        .buttonIconDownload-input-field:hover,
        .buttonIconSettings-input-field:hover,
        .buttonIconlazyLoad-input-field:hover,
        .input-field-targetNotebookLMUrl:hover,
        .buttonIconNotebookLM-input-field:hover {
            background-color: hsl(0, 0%, 10.37%);
        }

        .btn-style-settings {
            padding: 5px 10px;
            cursor: pointer;
            color: whitesmoke;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 400;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 2px;
            transition: all .2s ease-out;
        }

        .btn-style-settings:hover {
            color: white;
            background-color: hsl(0, 0%, 25%);
            border-color: transparent;
        }

        .btn-style-settings:active {
            color: white;
            background-color: hsl(0, 0%, 35%);
            border-color: hsl(0, 0%, 45%);
        }

        .button-icons {
            display: block;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
        }

        .icons-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .container-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 5px 0 0 0;
        }

        .button-icons.features-text {
            margin: 20px 0 -5px 0;
            font-size: 1.7em;
            display: flex;
            justify-content: center;
        }

        .container-button-input {
            width: 73px;
            padding: 8px;
            text-align: center;
            color: ghostwhite;
            font-family: -apple-system, system-ui, "Roboto", "Arial", sans-serif;
            font-size: 2em;
            line-height: 1.5em;
            font-weight: 400;
            transition: all .5s ease-in-out;
            outline: none;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 1px;
            box-sizing: border-box;
        }

        .container-button-label {
            margin-top: 5px;
            text-align: center;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
        }

        .container-button-input:focus {
            color: white;
            background-color: hsl(0, 0%, 10.37%);
            border-radius: 2px;
        }

        .spacer-5  { height: 5px;  }
        .spacer-10 { height: 10px; }
        .spacer-15 { height: 15px; }
        .spacer-20 { height: 20px; }

        .CentAnni-copyright {
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
            color: white;
            text-decoration: none;
            transition: color .2s ease-in-out;
        }

        .CentAnni-copyright:hover {
            color: #369eff;
        }

        .url-container {
            margin-bottom: 10px;
        }

        .input-field-url {
            width: 100%;
            padding: 8px;
            color: ghostwhite;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 400;
            transition: all .5s ease-in-out;
            outline: none;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 1px;
            box-sizing: border-box;
        }

        .input-field-url:focus {
            color: white;
            background-color: hsl(0, 0%, 10.37%);
            border-radius: 2px;
        }

        .file-naming-container {
            position: relative;
            margin-bottom: 15px;
        }

        .select-file-naming {
            width: 100%;
            padding: 8px;
            cursor: pointer;
            color: ghostwhite;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 400;
            transition: all .5s ease-in-out;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 1px;
            box-sizing: border-box;

            background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style="pointer-events:none; display:inherit; width:100%; height:100%;" fill="ghostwhite"%3E%3Cpath d="m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z"%3E%3C/path%3E%3C/svg%3E');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 20px;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .hidden-select {
            position: absolute;
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .dropdown-list {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            z-index: 2100;
            top: 115%;
            left: 0;
            width: 100%;
            max-height: 60dvh;
            overflow-y: auto;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(359, 88%, 57%);
            border-radius: 1px 1px 8px 8px;
            box-sizing: border-box;
            transition: opacity .5s ease-in-out, transform .5s ease-in-out;
            transform: translateY(-10px);
        }

        .dropdown-list.show {
            visibility: visible;
            opacity: 1;
            transform: translateY(0);
        }

        .dropdown-item {
            padding: 15px;
            cursor: pointer;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.47em;
            line-height: 1em;
            font-weight: 400;
            color: lightgray;
            position: relative;
            transition: background-color .3s;
            padding-left: 1.6em;
        }

        .dropdown-item:hover {
            color: ghostwhite;
            background-color: rgba(255, 255, 255, .05);
        }

        .dropdown-item:hover::before {
            color: ghostwhite;
            font-weight: 600;
        }

        .dropdown-item-selected {
            color: hsl(359, 88%, 57%);
            font-weight: 600;
        }

        .dropdown-item-selected::before {
            content: '✓';
            position: absolute;
            left: 6px;
            color: hsl(359, 88%, 57%);
        }

        .select-file-naming:focus {
            color: white;
            background-color: hsl(0, 0%, 10.37%);
            border-radius: 2px;
            border-color: hsl(359, 88%, 57%);
        }

        .checkbox-label,
        .number-input-label span {
            display: flex;
            align-items: center;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            white-space: pre-line;
        }

        .checkbox-container {
            margin-bottom: 5px;
        }

        .checkbox-label:hover {
            text-decoration: underline;
        }

        .checkbox-field {
            margin-right: 10px;
            cursor: pointer;
        }

        .playback-speed-keys {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
        }

        .playback-speed-labels {
            grid-column: 1;
            grid-row: 1/3;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .playback-speed-labels > div {
            height: 45px;
            display: flex;
            align-items: center;
            margin: 0 10px;
            font-size: 1em;
        }

        .key-button-container, .set-speed-container {
            display: flex;
            grid-column: 2;
        }

        .key-button-container {
            grid-row: 1;
        }

        .set-speed-container {
            grid-row: 2;
        }

        .set-speed-container > .label-style-settings {
            display: flex;
            width: 50px;
            margin-right: 10px;
            justify-content: center;
            align-items: center;
        }

        .CentAnni-info-text {
            color: rgba(175, 175, 175, .9);
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.2em;
            line-height: 1.5em;
            font-weight: 400;
            display: block;
            margin: -5px 0px 5px 24px;
            pointer-events: none;
            cursor: default;
            white-space: pre-line;
        }

        .button-naming {
            margin: 0;
            text-align: center;
        }

        .extra-button-container {
            display: flex;
            justify-content: center;
            gap: 5%;
            margin: 20px 0;
        }

        .chatgpt-prompt-textarea {
            width: 100%;
            padding: 8px;
            height: 65px;
            transition: all .7s ease-in-out;
            outline: none;
            resize: none;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 400;
            color: ghostwhite;
            background-color: hsl(0, 0%, 7%);
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 1px;
            box-sizing: border-box;
            overscroll-behavior: contain;
        }

        .chatgpt-prompt-textarea:focus {
            height: 525px;
            color: white;
            background-color: hsl(0, 0%, 10.37%);
            border: 1px solid hsl(217, 91%, 59%);
            border-radius: 2px;
        }

        .button-container-end {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
            padding-top: 10px;
            border: none;
            border-top: solid 1px transparent;
            border-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, .5), rgba(255, 255, 255, 0));
            border-image-slice: 1;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .button-container-backup {
            display: flex;
            justify-content: end;
            gap: 23.5px;
        }

        .button-container-settings {
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 10px;

        }

        #voice-search-button.ytd-masthead {
            margin: 0 12px;
        }

        .masthead-skeleton-icon {
            background-color: transparent !important;
            border-radius: 0;
        }

        .masthead-skeleton-icon:first-child {
            width: 97.5px;
            height: 36px;
            margin: 0 8px 0 0;
        }

        .masthead-skeleton-icon:nth-child(2) {
            width: 40px;
            height: 40px;
            margin: 0 8px 0 0;
        }

        .masthead-skeleton-icon:last-child {
            width: 32px;
            height: 32px;
            margin: 0 8px;
            padding: 1px 6px;
        }

        .CentAnni-button-wrapper {
            position: relative;
            margin-right: 8px;
            display: flex;
            background-color: transparent;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .CentAnni-btn-tooltip {
            .CentAnni-button-wrapper:has(#transcript-settings-button) .button-tooltip {
                white-space: normal;
            }

            .CentAnni-button-wrapper:has(#transcript-download-button) .button-tooltip {
                white-space: normal;
                width: 75px;
            }

            .CentAnni-button-wrapper:has(#transcript-ChatGPT-button) .button-tooltip {
                white-space: normal;
                width: 172px;
            }
        }

        .CentAnni-settings-btn {
            tp-yt-app-drawer.ytd-app[persistent] #guide-content > #header {
                display: flex !important;
                margin-top: -56px;
                background: var(--yt-spec-base-background);
            }

            ytd-app tp-yt-app-drawer.ytd-app[persistent] {
                background: var(--yt-spec-base-background);
            }

            #guide-wrapper .CentAnni-button-wrapper {
                margin-left: auto;
                margin-right: 12px;
            }

            .CentAnni-button-wrapper:has(#transcript-settings-button) .button-tooltip {
                white-space: nowrap;
            }

            .CentAnni-button-wrapper:has(#transcript-download-button) .button-tooltip {
                width: 117px;
                white-space: normal;
            }

            .CentAnni-button-wrapper:has(#transcript-ChatGPT-button) .button-tooltip {
                width: 172px;
                white-space: normal;
            }

            .button-style-settings {
                width: 40px;
            }

            .CentAnni-button-wrapper:has(#transcript-settings-button):hover {
                background-color: rgba(255, 255, 255, .1);
                border-radius: 24px;
            }

            .CentAnni-button-wrapper:has(#transcript-settings-button):active {
                background-color: rgba(255, 255, 255, .2);
                border-radius: 24px;
            }
        }

        html:not([dark]) #guide-wrapper .button-style-settings:hover {
            color: black;
        }

        html:not([dark]) #guide-wrapper .CentAnni-button-wrapper:has(#transcript-settings-button):hover {
            background-color: rgba(0, 0, 0, .1);
            border-radius: 24px;
        }

        html:not([dark]) #guide-wrapper .CentAnni-button-wrapper:has(#transcript-settings-button):active {
            background-color: rgba(0, 0, 0, .2);
            border-radius: 24px;
        }

        .CentAnni-button-wrapper:not(:has(.button-style-settings)):hover {
            background-color: rgba(255, 255, 255, .1);
            border-radius: 24px;
        }

        .CentAnni-button-wrapper:not(:has(.button-style-settings)):active {
            background-color: rgba(255, 255, 255, .2);
            border-radius: 24px;
        }

        .button-style {
            width: 40px;
            height: 40px;
            font-family: -apple-system, system-ui, "Roboto", "Arial", sans-serif;
            font-size: 24px;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            vertical-align: middle;
            color: white;
            outline: none;
            background: transparent;
            margin: 0;
            border: none;
            padding: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-tap-highlight-color: transparent;
        }

        #transcript-lazy-button {
            opacity: .8;
            filter: grayscale(1);
            transition: opacity .25s, filter .25s;
        }

        #transcript-lazy-button:hover {
            opacity: 1;
            filter: grayscale(0);
        }

        .button-style-settings {
            width: fit-content;
            min-width: 10px;
            color: rgb(170, 170, 170);
        }

        .button-style-settings:hover {
            color: white;
        }

        .button-tooltip {
            visibility: hidden;
            background-color: black;
            color: white;
            text-align: center;
            border-radius: 2px;
            padding: 6px 8px;
            position: absolute;
            z-index: 2053;
            top: 120%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            white-space: nowrap;
            font-size: 12px;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            border-top: solid 1px white;
            border-bottom: solid 1px black;
            border-left: solid 1px transparent;
            border-right: solid 1px transparent;
            border-image: linear-gradient(to bottom, white, black);
            border-image-slice: 1;
        }

        .button-tooltip-arrow {
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg, white 0%, white 50%, black 50%, black 100%);
            z-index: -1;
        }

        .CentAnni-remaining-time-container {
            position: relative;
            display: block;
            height: 0;
            top: 4px;
            text-align: right;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1em;
            color: var(--yt-spec-text-primary);
            pointer-events: auto;
            cursor: default;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .CentAnni-remaining-time-container.live,
        #movie_player .CentAnni-remaining-time-container.live {
            display: none;
            pointer-events: none;
        }

        :root:has(#ytd-player .html5-video-player.ended-mode) .CentAnni-remaining-time-container {
            opacity: 0;
        }

        #movie_player .CentAnni-remaining-time-container {
            position: absolute;
            display: inline-block;
            opacity: 0;
            z-index: 2053;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 35px);
            font-weight: 800 !important;
            font-size: 17px;
            vertical-align: top;
            white-space: nowrap;
            color: ghostwhite;
            pointer-events: none;
            text-shadow: black 0 0 3px !important;
        }

        .ytp-autohide .ytp-chrome-bottom .CentAnni-remaining-time-container {
            opacity: 1 !important;
        }

        HTML:not(.CentAnni-progress-bar) #ytd-player .html5-video-player.ytp-fullscreen.ytp-autohide .ytp-chrome-bottom:has(.CentAnni-remaining-time-container) {
            opacity: 1 !important;
        }

        HTML:not(.CentAnni-progress-bar) #ytd-player .html5-video-player.ytp-fullscreen.ytp-autohide .ytp-chrome-bottom:has(.CentAnni-remaining-time-container) .ytp-chrome-controls,
        HTML:not(.CentAnni-progress-bar) #ytd-player .html5-video-player.ytp-fullscreen.ytp-autohide .ytp-chrome-bottom:has(.CentAnni-remaining-time-container) .ytp-progress-bar-container:not(.active) {
            opacity: 0 !important;
        }

        .transcript-preload {
            position: fixed !important;
            top: var(--ytd-toolbar-height) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: -1 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .CentAnni-notification-error {
            z-index: 2053;
            box-shadow: none;
            text-decoration: none;
            display: inline-block;
            background-color: hsl(0, 0%, 7%);
            padding: 10px 12px;
            margin: 0 8px;
            border: 1px solid hsl(0, 0%, 18.82%);
            border-radius: 5px;
            pointer-events: none;
            cursor: default;
            font-family: 'Roboto', Arial, sans-serif;
            color: rgba(255, 255, 255, .5);
            text-align: center;
            font-weight: 500;
            font-size: 14px;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        #CentAnni-playback-speed-popup {
            position: fixed;
            top: var(--ytd-masthead-height, var(--ytd-toolbar-height));
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            background: hsl(0, 0%, 7%);
            border-radius: 2px;
            border: 1px solid hsl(0, 0%, 18.82%);
            color: whitesmoke;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 2.3rem;
            font-weight: 600;
            text-align: center;
            z-index: 2050;
            transition: opacity .3s ease;
            opacity: 0;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        #CentAnni-playback-speed-popup.active {
            opacity: 1;
        }

        .loading span::before {
            content: "Transcript Is Loading";
            position: absolute;
            inset: initial;
            color: rgba(255, 250, 250, .86);
            opacity: 0;
            -webkit-animation: pulse 1.5s infinite;
            animation: pulse 1.5s infinite;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        @-webkit-keyframes pulse {
            0%   { opacity: 0;   }
            50%  { opacity: .71; }
            100% { opacity: 0;   }
        }

        @keyframes pulse {
            0%   { opacity: 0;   }
            50%  { opacity: .71; }
            100% { opacity: 0;   }
        }

        #start.ytd-masthead {
            gap: 12px;
        }

        #logo.ytd-masthead {
            width: auto !important;
        }

        .buttons-left {
            font-family: -apple-system, system-ui, "Roboto", "Arial", sans-serif;
            font-size: 14px;
            font-weight: 500;
            line-height: 1em;
            letter-spacing: -.5px;
            display: inline-block;
            position: relative;
            color: ghostwhite;
            text-decoration: none;
            cursor: pointer;
            margin: 0;
            padding: 0;
            outline: none;
            background: transparent;
            border: none;
            text-align: center;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .buttons-left:hover {
            color: #ff0000 !important;
        }

        .buttons-left:active {
            color: rgb(200, 25, 25) !important;
        }

        .sub-panel-overlay {
            position: fixed;
            z-index: 2100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: none;
            background-color: rgba(0, 0, 0, .5);
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(1px);
        }

        .sub-panel-overlay.active {
            display: flex;
        }

        .sub-panel {
            z-index: 2177;
            background-color: rgba(17, 17, 17, .8);
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, .25);
            border-radius: 8px;
            width: 60dvw;
            max-width: 70dvw;
            max-height: 90dvh;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            color: whitesmoke;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .sub-panel button {
            position: sticky;
            top: 0;
            align-self: flex-end;
            box-shadow: 0 0 20px 10px black;
        }

        .sub-panel-header {
            margin: -24px 60px 20px 0px;
            padding: 0px 0px 0px 0px;
            border: 0;
            text-align: left;
            text-decoration: none;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 2em;
            line-height: 1em;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: normal;
            text-shadow: 0 0 30px 20px black;
            cursor: auto;
            color: white;
            align-self: left;
            position: relative;
            z-index: 2180;
        }

        #links-in-header-form .CentAnni-info-text {
            margin: -10px 80px 20px 0px;
        }

        .links-header-container {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .links-header-container label {
            color: whitesmoke;
        }

        .links-header-container .url-container:first-child {
            flex: 1;
        }

        .links-header-container .url-container:last-child {
            flex: 2;
        }

        .sidebar-container {
            display: flex;
            align-items: center;
            margin: 10px 0 0 0;
            color: whitesmoke;
            justify-content: flex-start;
            gap: 20px;
        }

        .sidebar-container .checkbox-container {
            margin-bottom: 0 !important;
            flex: 1;
        }

        .sidebar-container .url-container {
            flex: 2;
        }

        .playback-speed-container {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }

        #custom-css-form .playback-speed-container .checkbox-container {
            max-width: calc(55% - 5px);
            margin: 0;
            align-content: center;
            flex: 0 0 auto;
        }

        #custom-css-form .playback-speed-container .number-input-container {
            max-width: calc(45% - 5px);
            margin: 0;
            align-self: center;
            flex: 1 0 auto;
        }

        #custom-css-form .playback-speed-container .number-input-label {
            display: flex;
        }

        #color-code-videos-form .checkbox-container {
            margin: 20px 0 0 0;
        }

        #color-code-videos-form .label-style-settings {
            margin: 0;
        }

        #color-code-videos-form > div.videos-old-container > span {
            margin: 0;
        }

        #color-code-videos-form .CentAnni-info-text {
            margin: 5px 80px 20px 0px;
        }

        #custom-css-form .checkbox-container {
            margin: 10px 0;
        }

        #custom-css-form .file-naming-container {
            max-width: 90%;
            margin: 20px 0;
            display: flex;
            gap: 25px;
            align-content: center;
        }

        #custom-css-form .label-style-settings {
            margin-bottom: 0;
            white-space: nowrap;
            align-content: center;
        }

        #custom-css-form .dropdown-item {
            line-height: 2em;
            padding-top: 7px;
            padding-right: 7px;
            padding-bottom: 7px;
        }

        #custom-css-form .dropdown-item-selected,
        #custom-css-form .dropdown-item-selected::before {
            color: hsl(0, 0%, 100%);
        }

        .sub-panel input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            background: #ccc;
            border-radius: 5px;
            outline: none;
        }

        .sub-panel input[type="range"]::-moz-range-thumb,
        .sub-panel input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #007bff;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #ffffff;
        }

        .sub-panel input[type="range"]::-moz-range-track,
        .sub-panel input[type="range"]::-webkit-slider-runnable-track {
            background: #007bff;
            height: 6px;
            border-radius: 5px;
        }

        .videos-old-container {
            display: flex;
            max-width: 90%;
            align-items: center;
            gap: 25px;
            margin: 20px 0;
        }

        .slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        .slider-container .sub-panel input[type="range"] {
            flex: 1;
        }

        .videos-colorpicker-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
        }

        .videos-colorpicker-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            gap: 20px;
            margin: 0;
        }

        .videos-colorpicker-row span {
            text-align: right;
            flex: 1;
            max-width: 50%;
        }

        .videos-colorpicker-row input {
            flex: 1;
            margin: 0;
            padding: 0;
            max-width: 62px;
            height: 26px;
            cursor: pointer;
            background: none;
            border: none;
            box-shadow: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        .sub-panel input[type="color"]::-webkit-color-swatch-wrapper {
            border: none;
            padding: 0;
        }

        .sub-panel input[type="color"]::-webkit-color-swatch {
            border: none;
        }


        #custom-css-form .videos-colorpicker-row span {
            text-align: left;
            flex: initial;
        }

        #custom-css-form .videos-colorpicker-row input {
            margin: 0 0 0 -3px;
        }

        #custom-css-form .videos-colorpicker-row {
            gap: 10px;
        }

        #color-code-videos-form .videos-colorpicker-row {
            flex-direction: row-reverse;
            justify-content: flex-end;
        }

        #color-code-videos-form .videos-colorpicker-row span:nth-child(1),
        #color-code-videos-form .videos-colorpicker-row span:nth-child(3) {
            margin-left: -10px;
            width: fit-content;
        }

        #color-code-videos-form .videos-colorpicker-row span {
            flex: unset;
            width: 48%;
        }

        .number-input-container {
            margin: 10px 0;
        }

        .number-input-field {
            width: 5ch;
            margin: 0 10px 0 0;
            padding: 3px;
            align-items: center;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 700;
            cursor: auto;
            text-decoration: none;
            text-align: center;
            display: inline-block;
            border: none;

        }

        .sub-panel input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield !important;
            appearance: none;
        }

        .sub-panel input[type="number"]::-webkit-outer-spin-button,
        .sub-panel input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .number-input-label span {
            display: initial;
            cursor: auto;
        }

        .selection-color-container {
            margin: 10px 0;
            flex-direction: row;
        }

        .selection-color-container > .checkbox-container {
            margin: 0 !important;
        }

        .selection-color-container > .videos-colorpicker-row {
            width: auto;
        }

        :root:not(:has(:is(
            ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters],
            ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters]
        ))) :is(.CentAnni-tabView-tab[data-tab="tab-4"],.CentAnni-chapter-title,#movie_player .CentAnni-chapter-title),
        :root:not(:has(ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript])) .CentAnni-tabView-tab[data-tab="tab-5"] {
            display: none !important;
        }

        :root:has(ytd-watch-flexy ytd-playlist-panel-renderer[hidden]) .CentAnni-tabView-tab[data-tab="tab-6"] {
            display: none;
        }

        :is(:fullscreen, :-webkit-full-screen, .html5-video-player.ytp-fullscreen) :has(.CentAnni-remaining-time-container) #ytp-caption-window-container {
            top: 0;
            bottom: unset;
        }

        :is(:fullscreen, :-webkit-full-screen, .html5-video-player.ytp-fullscreen) :has(.CentAnni-remaining-time-container) .ytp-autohide #ytp-caption-window-container {
            bottom: 40px;
            top: unset;
        }

        /* progress bar css */
        .CentAnni-progress-bar {
            #CentAnni-progress-bar-bar {
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, .2);
                position: absolute;
                bottom: 0;
                opacity: 0;
                z-index: 58;
                pointer-events: none;
            }

            #CentAnni-progress-bar-progress,
            #CentAnni-progress-bar-buffer {
                width: 100%;
                height: 3px;
                transform-origin: 0 0;
                position: absolute;
            }

            #CentAnni-progress-bar-progress {
                background: var(--progressBarColor);
                filter: none;
                z-index: 1;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-load-progress,
            .ytp-autohide .ytp-chrome-bottom .ytp-play-progress {
                display: none !important;
            }

            .ytp-autohide .ytp-chrome-bottom {
                opacity: 1 !important;
                display: block !important;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls {
                opacity: 0 !important;
            }

            .ad-interrupting #CentAnni-progress-bar-progress {
                background: transparent;
            }

            .ytp-ad-persistent-progress-bar-container {
                display: none;
            }

            #CentAnni-progress-bar-buffer {
                background: rgba(255, 255, 255, .4);
            }

            .ytp-autohide #CentAnni-progress-bar-start.active,
            .ytp-autohide #CentAnni-progress-bar-bar.active,
            .ytp-autohide #CentAnni-progress-bar-end.active {
                opacity: 1;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container {
                bottom: 0px !important;
                opacity: 1 !important;
                height: 4px !important;
                transform: translateX(0px) !important;
                z-index: 100;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-progress-bar,
            .ytp-autohide .ytp-chrome-bottom .ytp-progress-list {
                background: transparent !important;
                box-shadow: none !important;
            }

            .ytp-autohide .ytp-chrome-bottom .previewbar {
                height: calc(100% + 1px) !important;
                bottom: -1px !important;
                margin-bottom: 0px !important;
                opacity: 1 !important;
                border: none !important;
                box-shadow: none !important;
                will-change: opacity, transform !important;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container:not(.active) .ytp-scrubber-container {
                opacity: 0;
                pointer-events: none;
            }

            #CentAnni-progress-bar-start,
            #CentAnni-progress-bar-end {
                position: absolute;
                height: 3px;
                width: 12px;
                bottom: 0;
                z-index: 2077;
                opacity: 0;
                pointer-events: none;
            }

            #CentAnni-progress-bar-start {
                left: calc(var(--progressBarMargin) - 12px);
                background: var(--progressBarColor);
            }

            #CentAnni-progress-bar-end {
                right: calc(var(--progressBarMargin) - 12px);
                background: rgba(255, 255, 255, .2);
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-timed-marker {
                background-color: black;
                width: 2px;
                height: 5px;
                bottom: -1px;
                border-radius: 0;
            }

            ytd-shorts #scrubber .ytPlayerProgressBarHostHidden {
                opacity: 1;
            }

            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom,
            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom .ytp-chrome-controls {
                opacity: 1 !important;
            }

            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom .ytp-progress-bar-container {
                bottom: var(--yt-delhi-bottom-controls-height, 72px) !important;
                height: 6px !important;
            }

            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) #CentAnni-progress-bar-start.active,
            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) #CentAnni-progress-bar-bar.active,
            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) #CentAnni-progress-bar-end.active {
                opacity: 0 !important;
            }

            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom .ytp-load-progress,
            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom .ytp-play-progress {
                display: block !important;
            }

            ytd-watch-flexy:not([fullscreen]) #ytd-player .html5-video-player.ytp-autohide:not(.playing-mode, .ended-mode) .ytp-chrome-bottom .ytp-progress-list {
                background: rgba(40, 40, 40, .6) !important;
            }

            #ytd-player .html5-video-player.ended-mode #CentAnni-progress-bar-start,
            #ytd-player .html5-video-player.ended-mode #CentAnni-progress-bar-bar,
            #ytd-player .html5-video-player.ended-mode #CentAnni-progress-bar-end,
            #ytd-player .html5-video-player.ended-mode.ytp-fullscreen .CentAnni-chapter-title,
            #ytd-player .html5-video-player.ended-mode.ytp-autohide .ytp-chrome-bottom .previewbar {
                opacity: 0 !important;
            }

            .ytp-autohide.ytp-delhi-modern:not(.playing-mode, .ended-mode) .caption-window.ytp-caption-window-bottom {
                margin-bottom: calc(var(--yt-delhi-bottom-controls-height, 72px) + 14px);
            }
        }

        /* playback speed css */
        .CentAnni-playback-speed {
            #actions.ytd-watch-metadata {
                justify-content: end;
            }

            .yt-spec-button-view-model.style-scope.ytd-menu-renderer {
                display: flex;
                height: 36px;
                width: 36px;
                margin-right: 8px;
                overflow: hidden;
            }

            #below yt-button-view-model.ytd-menu-renderer:not(:empty):not(#flexible-item-buttons yt-button-view-model):not([hidden] yt-button-view-model) {
                margin-left: 8px;
            }

            ytd-menu-renderer[has-flexible-items][safe-area] .top-level-buttons.ytd-menu-renderer {
                margin-bottom: 0;
            }

            .CentAnni-playback-control {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                margin-left: 8px;
            }

            .CentAnni-playback-speed-icon {
                height: 24px;
                width: 24px;
                padding: 0 4px 0 0;
                opacity: .9;
            }

            .CentAnni-playback-speed-display {
                background: rgba(255, 255, 255, .1);
                height: 36px;
                min-width: 32px;
                padding: 0 8px;
                justify-content: center;
                align-items: center;
                cursor: default;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .CentAnni-playback-speed-button {
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .CentAnni-playback-speed-button:nth-child(2) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .CentAnni-playback-speed-button:last-child {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }

            .CentAnni-playback-speed-button:active {
                background: rgb(72, 72, 72) !important;
            }

            .CentAnni-playback-speed-button:last-child::before,
            .CentAnni-playback-speed-button:nth-child(2)::after {
                content: "";
                background: rgba(255, 255, 255, .2);
                position: initial;
                right: 0;
                top: 6px;
                height: 24px;
                width: 1px;
            }

            .CentAnni-playback-speed-button:nth-child(2)::after {
                transform: translateX(15.5px);
            }

            .CentAnni-playback-speed-button:last-child::before {
                transform: translateX(-14px);
            }

            ytd-watch-metadata[flex-menu-enabled] #actions-inner.ytd-watch-metadata {
                width: 36px;
            }

            ytd-watch-metadata[actions-on-separate-line] #top-row.ytd-watch-metadata {
                display: flex;
                flex-wrap: wrap;
            }

            ytd-watch-metadata[action-buttons-update-owner-width] #actions.ytd-watch-metadata {
                min-width: 50%;
            }

            ytd-watch-metadata[action-buttons-update-owner-width] #owner.ytd-watch-metadata {
                margin-right: 0;
                max-width: 50%;
            }

            .ytp-menuitem:has(path[d^="M12 1c1.4"]),
            .ytp-menuitem:has(path[d^="M10,8v8l6-4L10"]) {
                display: none;
            }
        }

        .CentAnni-playback-speed-btns {
            ytd-watch-flexy[theater][is-two-columns_][full-bleed-player] #secondary.ytd-watch-flexy {
                margin-top: unset !important;
                flex-direction: column-reverse;
            }

            #CentAnni-speed-buttons {
                position: relative;
                display: flex;
                height: fit-content;
                width: var(--ytd-watch-flexy-sidebar-width);
                min-width: var(--ytd-watch-flexy-sidebar-min-width);
                padding-bottom: 12px;
                box-sizing: border-box;
                overflow: auto hidden;
                gap: 12px;
            }

            .CentAnni-speed-preset-button {
                padding: 0 10px !important;
                min-width: fit-content !important;
            }

            .CentAnni-speed-preset-button.active {
                background: rgb(253, 1, 48) !important;
            }

            ytd-watch-flexy[default-layout] #CentAnni-speed-buttons {
                margin-top: 24px;
                width: calc(100% - 12px);
                min-width: unset;
                justify-content: center;
            }

            ytd-watch-flexy #bottom-row.ytd-watch-metadata {
                height: fit-content !important;
            }
        }

        html:not(.CentAnni-video-tabView) ytd-watch-flexy[theater] #CentAnni-speed-buttons {
            position: absolute;
            top: 12px;
        }

        html:not(.CentAnni-video-tabView):has(#CentAnni-speed-buttons) ytd-watch-flexy[theater][is-two-columns_][full-bleed-player] #secondary.ytd-watch-flexy {
            padding-top: 50px;
        }

        html:not(.CentAnni-video-tabView):has(#CentAnni-speed-buttons) ytd-watch-flexy[theater] :where(#chat.ytd-watch-flexy, #donation-shelf.ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy, #donation-shelf.ytd-watch-flexy ytd-donation-unavailable-renderer.ytd-watch-flexy, #playlist.ytd-watch-flexy, #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy, ytd-watch-flexy[persistent-panel-visible] #persistent-panel-container.ytd-watch-flexy) {
            margin-top: 10px;
        }

        html.CentAnni-video-tabView.CentAnni-playback-speed-btns ytd-watch-flexy[default-layout] .ytVideoMetadataCarouselViewModelHost {
            margin-bottom: -10px;
        }

        /* video tab view css */
        .CentAnni-video-tabView {
            .CentAnni-tabView {
                position: relative;
                display: flex;
                flex-direction: column;
                width: var(--ytd-watch-flexy-sidebar-width);
                min-width: var(--ytd-watch-flexy-sidebar-min-width);
                font-family: "Roboto", "Arial", sans-serif;
                margin: 0;
                padding: 0;
                border-radius: 12px 12px 0 0;
                border: 1px solid rgba(255, 255, 255, .2);
                overflow: hidden;
                box-sizing: border-box;
                background-color: transparent;
                z-index: 10;
            }

            .CentAnni-tabView:has(.CentAnni-tabView-tab.active[data-tab="tab-2"]) {
                border-radius: 12px;
            }

            .CentAnni-tabView-header {
                display: flex;
                position: relative;
                overflow-x: auto;
                overflow-y: hidden;
                height: 50px;
                padding: 0;
                margin: 0;
                color: var(--yt-spec-text-primary);
                background-color: var(--yt-spec-brand-background-primary);
                z-index: 7;
            }

            .CentAnni-tabView-subheader {
                display: flex;
                flex-direction: row;
                height: 50px;
                font-size: 9px;
                line-height: 1;
                padding: 0 8px;
                align-items: center;
                gap: 8px;
                z-index: 8;
            }

            .CentAnni-tabView-tab {
                align-items: center;
                border: none;
                border-radius: 8px;
                display: inline-flex;
                height: 32px;
                min-width: 12px;
                white-space: nowrap;
                font-family: "Roboto", "Arial", sans-serif;
                font-size: 1.4em;
                line-height: 2em;
                font-weight: 500;
                margin: 0;
                background-color: rgba(255, 255, 255, .1);
                color: #f1f1f1;
                text-decoration: none;
                padding: 0 12px;
                z-index: 10;
            }

            .CentAnni-tabView-tab:hover {
                background: rgba(255, 255, 255, .2);
                border-color: transparent;
            }

            .CentAnni-tabView-tab.active {
                background-color: #f1f1f1;
                color: #0f0f0f;
            }

            .CentAnni-tabView-content {
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 0;
                margin: 0;
                display: none;
                overscroll-behavior: contain;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
            }

            .CentAnni-tabView-content.active {
                display: block !important;
            }

            .CentAnni-tabView-content-hidden {
                display: none;
                opacity: 0;
                visibility: hidden;
            }

            .CentAnni-tabView-content-active {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            ytd-watch-flexy ytd-playlist-panel-renderer[hidden] {
                display: none !important;
            }

            .CentAnni-tabView-content-nascosta {
                opacity: 0;
                visibility: hidden;
            }

            .CentAnni-tabView-content-attiva {
                opacity: 1 !important;
                visibility: visible !important;
            }


            .CentAnni-tabView-content-block {
                display: block !important;
            }

            #tab-2 {
                border-top: 1px solid rgba(255, 255, 255, .2);
            }

            #related.style-scope.ytd-watch-flexy {
                position: absolute;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
                width: var(--ytd-watch-flexy-sidebar-width);
                top: 76px;
                left: 0;
                margin: 0;
                padding: 15px 10px 0 10px;
                overflow-y: auto;
                overflow-x: hidden;
                visibility: hidden;
                opacity: 0;
                z-index: 5;
                border: 1px solid rgba(255, 255, 255, .2);
                border-top: none;
                box-sizing: border-box;
                border-radius: 0 0 12px 12px;
            }

            ytd-watch-metadata.ytd-watch-flexy {
                margin: 12px 0 0 0;
            }

            ytd-watch-flexy ytd-comments {
                margin: 0;
                padding: 0 10px;
            }

            #comments > #sections > #header > ytd-comments-header-renderer > #title > #additional-section {
                margin-left: auto;
            }

            #comments > #sections > #header {
                margin: 0 12px;
            }

            ytd-engagement-panel-section-list-renderer:not([live-chat-engagement-panel]),
            ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
            ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
                border-radius: 0 0 12px 12px;
            }

            #related.style-scope.ytd-watch-flexy[full-bleed-player] {
                top: 30px;
            }

            ytd-engagement-panel-section-list-renderer {
                box-sizing: content-box;
                display: flexbox;
                display: flex;
                flex-direction: column;
            }

            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters] {
                position: absolute;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
                width: var(--ytd-watch-flexy-sidebar-width);
                top: 76px;
                left: 0;
                margin: 0;
                padding: 0;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 5;
                border: 1px solid rgba(255, 255, 255, .2);
                border-top: none;
                box-sizing: border-box;
            }

            ytd-watch-flexy #description.ytd-expandable-video-description-body-renderer {
                padding-right: 10px !important;
            }

            #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy {
                margin-bottom: 0;
            }

            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description] {
                position: absolute;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
                width: var(--ytd-watch-flexy-sidebar-width);
                top: 76px;
                left: 0;
                margin: 0;
                padding: 10px 0 0 10px;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 5;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, .2);
                border-top: none;
                box-sizing: border-box;
            }

            ytd-engagement-panel-section-list-renderer[match-content-theme] #content.ytd-engagement-panel-section-list-renderer {
                background-color: transparent;
            }

            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript] {
                position: absolute;
                top: 0;
                left: 0;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
                width: var(--ytd-watch-flexy-sidebar-width);
                top: 76px;
                margin: 0;
                padding: 0;
                z-index: 5;
                border: 1px solid rgba(255, 255, 255, .2);
                border-top: none;
                box-sizing: border-box;
            }

            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript] #footer #menu.ytd-engagement-panel-title-header-renderer {
                margin-left: auto;
            }

            ytd-transcript-renderer {
                flex: 1 1 auto;
            }

            ytd-transcript-segment-list-renderer {
                height: 100%;
            }

            ytd-text-inline-expander[engagement-panel] {
                display: block;
                margin: 0;
                padding: 0;
                border: none;
                border-radius: 0;
                background: transparent;
                padding-right: 10px;
            }

            ytd-expandable-video-description-body-renderer > ytd-text-inline-expander > #snippet {
                max-height: 100% !important;
            }

            #media-lockups > ytd-structured-description-playlist-lockup-renderer > #lockup-container > #playlist-thumbnail {
                width: 100%;
            }

            #items > yt-video-attributes-section-view-model > div > div.yt-video-attributes-section-view-model__video-attributes.yt-video-attributes-section-view-model__scroll-container > div > yt-video-attribute-view-model > div:hover,
            #media-lockups > ytd-structured-description-playlist-lockup-renderer > #lockup-container:hover {
                filter: brightness(1.1);
            }

            ytd-expandable-video-description-body-renderer[engagement-panel]:not([shorts-panel]) ytd-expander.ytd-expandable-video-description-body-renderer {
                border-radius: 0;
                padding: 0;
                background: transparent;
            }

            ytd-structured-description-content-renderer[engagement-panel] ytd-expandable-video-description-body-renderer.ytd-structured-description-content-renderer {
                padding: 0;
            }

            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[enable-anchored-panel][target-id="engagement-panel-structured-description"] #content.ytd-engagement-panel-section-list-renderer .ytd-engagement-panel-section-list-renderer:first-child,
            ytd-watch-flexy ytd-structured-description-content-renderer[engagement-panel] #items.ytd-structured-description-content-renderer {
                padding: 0;
            }

            ytd-video-description-transcript-section-renderer {
                position: fixed;
                bottom: 0;
                left: 0;
                z-index: -9999;
                pointer-events: none;
                opacity: 0;
            }

            ytd-video-description-infocards-section-renderer[engagement-panel] #social-links.ytd-video-description-infocards-section-renderer {
                margin: 0 0 16px 0;
                padding: 0;
            }

            ytd-structured-description-content-renderer[engagement-panel] ytd-video-description-infocards-section-renderer.ytd-structured-description-content-renderer {
                padding: 16px 0 0 0;
            }

            #infocards-section > ytd-compact-infocard-renderer:last-of-type {
                margin-bottom: 0;
            }

            .ytp-chapter-container,
            #bottom-row > #description {
                cursor: default;
                pointer-events: none;
            }

            #content > #description a:hover,
            #snippet > #snippet-text > yt-attributed-string a:hover {
                text-decoration: underline;
            }

            ytd-compact-video-renderer:hover,
            ytd-video-description-course-section-renderer > #topic-link:hover,
            #infocards-section > ytd-compact-infocard-renderer > #content:hover,
            #related ytd-item-section-renderer yt-lockup-view-model > div:hover,
            #items > ytd-video-description-infocards-section-renderer > #header:hover,
            ytd-watch-card-compact-video-renderer.ytd-vertical-watch-card-list-renderer:not([is-condensed]):hover,
            #always-shown > ytd-rich-metadata-row-renderer > #contents > ytd-rich-metadata-renderer > #endpoint-link:hover,
            #items > ytd-video-description-infocards-section-renderer > #infocards-section > ytd-compact-infocard-renderer > #content:hover,
            ytd-playlist-panel-renderer h3 yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover {
                background: var(--yt-spec-badge-chip-background);
            }

            ytd-playlist-panel-renderer #publisher-container yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover {
                color: red;
            }

            #playlist-actions.ytd-playlist-panel-renderer {
                cursor: default;
            }

            ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata a {
                cursor: pointer;
                pointer-events: all;
                color: var(--yt-endpoint-visited-color);
            }

            ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata a:hover {
                color: var(--yt-spec-call-to-action);
            }

            .yt-animated-icon.lottie-player.style-scope {
                pointer-events: none;
            }

            #description.ytd-watch-metadata {
                background: none;
            }

            ytd-transcript-search-box-renderer {
                margin: 12px 0;
            }

            .CentAnni-info-date {
                margin-left: 6px;
            }

            #ytd-watch-info-text.ytd-watch-metadata {
                height: 18px;
            }

            #middle-row.ytd-watch-metadata {
                padding: 10px 0;
            }

            .content.style-scope.ytd-info-panel-content-renderer {
                padding: 10px 16px;
            }

            #description-inner.ytd-watch-metadata {
                margin: 0px 12px 0px 52px;
            }

            #view-count.ytd-watch-info-text,
            #date-text.ytd-watch-info-text {
                align-items: center;
            }

            ytd-watch-info-text:not([detailed]) #info.ytd-watch-info-text {
                align-content: center;
            }

            #bottom-row.ytd-watch-metadata {
                flex-direction: column;
            }

            .ytVideoMetadataCarouselViewModelHost {
                flex-direction: row;
                padding: 12px;
                height: fit-content;
                margin-bottom: 24px;
                gap: 20px;
                align-items: center;
            }

            .ytVideoMetadataCarouselViewModelCarouselContainer {
                margin-top: 0;
            }

            ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] {
                z-index: 100;
                background: black;
                height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x)) !important;
                max-height: unset !important;
                margin-top: -52px;
            }

            ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] > #header {
                display: block !important;
            }

            ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] #content ytd-section-list-renderer {
                padding-left: 10px;
            }

            ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] #content ytd-section-list-renderer > #contents {
                overflow-y: auto;
                overflow-x: hidden;
            }

            /* live chat adjustments */
            #columns > #secondary > #secondary-inner > #chat-container {
                top: 24px;
                position: absolute;
                width: var(--ytd-watch-flexy-sidebar-width);
            }


            ytd-watch-flexy[flexy]:not([fixed-panels]) #chat.ytd-watch-flexy:not([collapsed]),
            ytd-watch-flexy:not([fixed-panels]):not([squeezeback]) #chat.ytd-watch-flexy:not([collapsed]) {
                height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) + 1px) !important;
                border: 1px solid rgb(51, 51, 51);
            }

            #chat.ytd-watch-flexy {
                margin-bottom: 0;
            }

            ytd-watch-flexy:not([is-two-columns_])[theater] #chat.ytd-watch-flexy:not([collapsed]) {
                height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height))) !important;
            }

            /* theater mode active */
            ytd-watch-flexy[theater] #playlist,
            ytd-watch-flexy[theater] ytd-comments,
            ytd-watch-flexy[theater] #related.style-scope.ytd-watch-flexy,
            ytd-watch-flexy[theater] ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer,
            ytd-watch-flexy[theater] ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript],
            ytd-watch-flexy[theater] ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description],
            ytd-watch-flexy[theater] ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
            ytd-watch-flexy[theater] ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters],
            ytd-watch-flexy[theater][flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy,
            ytd-watch-flexy[theater][flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[target-id="engagement-panel-structured-description"] {
                height: 0;
                padding-top: 0;
                padding-bottom: 0;
                margin-top: 0;
                margin-bottom: 0;
                opacity: 0;
                visibility: hidden;
                z-index: -1;
                pointer-events: none;
            }

            ytd-watch-flexy[theater] #donation-shelf {
                display: none !important;
            }

            ytd-watch-flexy[theater] .CentAnni-tabView-content {
                display: none !important;
            }

            ytd-watch-flexy[theater][cinematics-enabled] #secondary.ytd-watch-flexy {
                align-content: center;
            }

            ytd-watch-flexy[theater][is-two-columns_][full-bleed-player] #secondary.ytd-watch-flexy {
                margin-top: 34.5px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }

            ytd-watch-flexy[theater] .CentAnni-tabView {
                border-radius: 25px;
            }

            ytd-watch-flexy[theater] .CentAnni-tabView-tab {
                border-radius: 18px;
            }

            ytd-watch-flexy[is-two-columns_][theater] #columns {
                max-height: calc(100dvh - 56.25dvw - var(--ytd-masthead-height, var(--ytd-toolbar-height)));
                min-height: calc(169px - var(--ytd-masthead-height, var(--ytd-toolbar-height)));
            }

            ytd-watch-flexy[theater] #primary {
                overflow-x: hidden;
            }

            #donation-shelf {
                display: none;
                opacity: 0;
                visibility: hidden;
            }

            #donation-shelf.ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy {
                margin-bottom: 0;
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
                overflow-y: auto;
            }

            ytd-donation-shelf-renderer[modern-panels] {
                border-radius: 0px 0px 12px 12px;
            }

            ytd-donation-shelf-renderer {
                border-top: none;
            }

            ytd-watch-flexy #playlist {
                position: absolute;
                margin: 0;
                padding: 0;
                top: 76px;
                left: 0;
                width: var(--ytd-watch-flexy-sidebar-width);
                z-index: 5;
                display: none;
                opacity: 0;
                visibility: hidden;
                margin-bottom: 0;
            }

            ytd-watch-flexy[default-layout] #playlist,
            ytd-watch-flexy[default-layout] #secondary,
            ytd-watch-flexy[default-layout] #container.ytd-playlist-panel-renderer {
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x) - 52px) !important;
            }

            #container.ytd-playlist-panel-renderer {
                border-top: none;
            }

            ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer {
                padding: 12px 0 0 25px;
                margin-right: 0;
            }

            .playlist-items.ytd-playlist-panel-renderer {
                padding: 0;
            }

            /* single columns */
            ytd-watch-flexy:not([is-two-columns_]) #columns.ytd-watch-flexy {
                flex-direction: column;
            }

            ytd-watch-flexy:not([is-two-columns_])[theater] #primary {
                flex-basis: auto;
                height: calc(var(--ytd-watch-flexy-space-below-player) - 22px);
            }

            ytd-watch-flexy:not([is-two-columns_]) #primary ytd-watch-metadata {
                height: calc(var(--ytd-watch-flexy-space-below-player) - 22px);
                overflow-x: hidden;
            }

            ytd-watch-flexy:not([is-two-columns_])[theater][full-bleed-player] #secondary.ytd-watch-flexy,
            ytd-watch-flexy:not([is-two-columns_]) #secondary.ytd-watch-flexy {
                display: flex;
                margin: 0;
                padding: 0;
                justify-content: center;
                align-items: center;
                width: 100%;
            }

            ytd-watch-flexy:not([is-two-columns_]) .CentAnni-tabView {
                margin-top: 12px;
                width: 90dvw;
            }

            ytd-watch-flexy:not([is-two-columns_]) #primary #playlist,
            ytd-watch-flexy:not([is-two-columns_]) #related.style-scope.ytd-watch-flexy,
            ytd-watch-flexy:not([is-two-columns_]) #panels ytd-engagement-panel-section-list-renderer {
                top: calc(var(--ytd-watch-flexy-space-below-player) + 54px);
                max-height: 50dvh !important;
                width: 90dvw;
                margin: 0 !important;
                left: 50%;
                transform: translateX(-50%);
            }

            ytd-watch-flexy:not([is-two-columns_]):not([theater]) #chat.ytd-watch-flexy:not([collapsed]),
            ytd-watch-flexy:not([is-two-columns_]) .CentAnni-tabView-content {
                max-height: 50dvh !important;
            }

            ytd-watch-flexy:not([is-two-columns_])[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #secondary.ytd-watch-flexy {
                padding: 0;
            }

            ytd-watch-flexy #columns #below > ytd-watch-metadata #title > ytd-badge-supported-renderer:not([hidden]) {
                position: absolute;
                left: calc(50% - 22px);
                transform: translateY(54px);
                cursor: default;
            }

            ytd-watch-flexy:not([is-two-columns_]):not([theater])[show-expandable-metadata] ytd-watch-metadata {
                margin-bottom: 0;
            }

            ytd-watch-flexy:not([is-two-columns_]):has(#chat:not([collapsed])) .CentAnni-tabView {
                display: none !important;
            }

            ytd-watch-flexy:not([is-two-columns_]):has(#chat:not([collapsed]))[theater] #primary {
                height: max-content;
            }

            #container.ytd-masthead {
                padding: 0 24px;
            }

            ytd-macro-markers-list-renderer:not([browsing-mode]) #sync-container.ytd-macro-markers-list-renderer {
                transform: unset !important;
                display: none;
            }

            ytd-macro-markers-list-renderer.browsing-mode #sync-container.ytd-macro-markers-list-renderer {
                transform: translateY(0);
                display: flex;
            }

            ytd-app[is-watch-page]:not([scrolling]):has(ytd-watch-flexy:not([is-two-columns_]):not([theater])) {
                overflow: unset;
            }

            ytd-watch-flexy[default-layout] #primary #below {
                overflow-y: auto;
                overflow-x: hidden;
                min-height: var(--spaceBelow);
                height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - var(--ytd-margin-6x) - (calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)) * var(--ytd-watch-flexy-height-ratio) / var(--ytd-watch-flexy-width-ratio)));
            }

            @media (min-width:1200px) {
                ytd-item-section-renderer[lockup-container-type="2"][is-grid-view-enabled] #contents.ytd-item-section-renderer {
                    grid-template-columns: 1fr 1fr !important;
                }
            }

            ytd-text-inline-expander,
            #collapse-controls-section,
            #body.ytd-transcript-renderer,
            .CentAnni-tabView-content-none,
            #description > #description-interaction,
            #ghost-cards.ytd-continuation-item-renderer,
            #trailing-button.ytd-playlist-panel-renderer,
            ytd-live-chat-frame[modern-buttons][collapsed],
            #navigation-button.ytd-rich-list-header-renderer,
            #ghost-comment-section.ytd-continuation-item-renderer,
            ytd-watch-flexy:not([is-two-columns_])[theater] #panels,
            ytd-watch-flexy:not([is-two-columns_])[theater] #related,
            ytd-engagement-panel-section-list-renderer ytd-merch-shelf-renderer,
            ytd-watch-flexy #header.style-scope.ytd-engagement-panel-section-list-renderer,
            #description > #description-inner > #ytd-watch-info-text > tp-yt-paper-tooltip,
            ytd-watch-flexy:not([is-two-columns_]):not([theater]) #expandable-metadata.ytd-watch-flexy,
            .CentAnni-tabView:not(:has(.CentAnni-tabView-tab[data-tab="tab-2"])) ytd-comments#comments,
            ytd-watch-flexy[theater] ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview],
            ytd-expandable-video-description-body-renderer > ytd-expander > tp-yt-paper-button#more.ytd-expander,
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id^="shopping_panel_for_entry_point_"],
            .ytp-chapter-container:not([style*="display: none"]) .ytp-chapter-title-content:not(.CentAnni-chapter-title *),
            ytd-watch-flexy[theater] #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-clip-create],
            ytd-watch-flexy ytd-structured-description-content-renderer[engagement-panel] ytd-video-description-header-renderer.ytd-structured-description-content-renderer {
                display: none;
            }
        }

        .CentAnni-video-tabView:fullscreen ytd-watch-flexy #playlist,
        .CentAnni-video-tabView:fullscreen #related.style-scope.ytd-watch-flexy,
        .CentAnni-video-tabView:fullscreen ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
        .CentAnni-video-tabView:fullscreen ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript],
        .CentAnni-video-tabView:fullscreen ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description],
        .CentAnni-video-tabView:fullscreen ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters] {
            top: 52px;
        }

        .CentAnni-tabView-chapters {
            .ytp-chapter-title-chevron,
            ytd-watch-flexy .ytp-chapter-title-prefix {
                display: none;
            }

            ytd-watch-flexy .ytp-chapter-container {
                padding: 0;
                font-size: inherit;
                line-height: inherit;
                max-width: unset !important;
            }

            #movie_player .ytp-chapter-container {
                transform: translateY(-14px);
            }

            #movie_player .ytp-chapter-title.ytp-button {
                backdrop-filter: unset;
                background: unset;
                text-shadow: unset;
                border-radius: unset;
                padding: unset;
            }

            ytd-watch-flexy .sponsorChapterText,
            ytd-watch-flexy .ytp-chapter-title-content {
                white-space: normal;
                font-weight: 500;
            }

            #movie_player .sponsorChapterText,
            #movie_player .ytp-chapter-title-content {
                overflow: hidden;
                text-overflow: ellipsis;
                text-wrap: nowrap;
                line-height: 45px;
            }

            .CentAnni-chapter-title {
                position: absolute;
                display: flex;
                flex-direction: row;
                z-index: 2017;
                top: 0;
                right: 0;
                width: fit-content;
                max-width: calc(60% - 26px);
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
                font-size: 1.4rem;
                line-height: 2rem;
                color: var(--yt-spec-text-primary) !important;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: default;
            }

            .CentAnni-chapter-title span {
                text-wrap: nowrap;
                margin-right: .5ch;
            }

            #movie_player .CentAnni-chapter-title {
                position: absolute;
                display: flex;
                opacity: 0;
                flex-direction: row;
                max-width: 50dvw;
                overflow: hidden;
                z-index: 2053;
                bottom: 0;
                left: 50%;
                transform: translateY(35px);
                font-weight: 500 !important;
                font-size: 17px;
                vertical-align: top;
                white-space: nowrap;
                color: ghostwhite !important;
                text-shadow: black 0 0 3px !important;
            }

            .ytp-time-display {
                font-size: 14px;
                font-weight: bold;
            }

            .ytp-title-text,
            .ytp-fullscreen .ytp-time-display {
                font-size: 18px;
                white-space: nowrap;
                word-wrap: normal;
            }

            .ytp-autohide .ytp-chrome-bottom .CentAnni-chapter-title {
                opacity: 1 !important;
            }

            .CentAnni-chapter-title .ytp-chapter-container.sponsorblock-chapter-visible {
                display: block !important;
            }

            .CentAnni-chapter-title:has(.ytp-chapter-title-content:empty):not(:has(.sponsorChapterText:not(:empty))) {
                display: none;
            }

            :is( :has(ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters]),
                :has(ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters])) {
                & ytd-watch-flexy #description > #description-inner {
                    width: calc(40% - 26px);
                }

                & ytd-watch-flexy #description > #description-inner #info-container {
                    height: fit-content;
                }

                & ytd-watch-flexy #description > #description-inner #info span.CentAnni-info-date + span::after {
                    content: "";
                    display: block;
                    height: 0;
                    margin-bottom: 5px;
                }

                & ytd-watch-flexy #description > #description-inner #info a.yt-simple-endpoint.bold {
                    display: inline-block;
                }

                & ytd-watch-flexy #bottom-row.ytd-watch-metadata {
                    height: 50px;
                }

                #movie_player .CentAnni-remaining-time-container {
                    left: 25% !important;
                }

                [dir="ltr"] ytd-watch-info-text:not([detailed]) #info-container.ytd-watch-info-text,
                ytd-watch-info-text:not([detailed]) #info-container.ytd-watch-info-text[dir="ltr"] {
                    -webkit-mask-image: unset;
                    mask-image: unset;
                }
            }
        }


        .CentAnni-style-hide-comments-btn {
            ytd-comments#comments,
            .CentAnni-tabView-tab[data-tab="tab-2"] {
                display: none;
            }
        }

        .CentAnni-style-hide-videos-btn {
            #related.style-scope.ytd-watch-flexy,
            .CentAnni-tabView-tab[data-tab="tab-3"] {
                display: none;
            }
        }

        .CentAnni-style-hide-yt-settings .ytp-settings-menu,
        .CentAnni-style-hide-yt-settings .ytp-overflow-panel {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* customCSS CSS */
        html {
            font-size: var(--fontSize) !important;
            font-family: "Roboto", Arial, sans-serif;
        }

        .CentAnni-style-hide-default-sidebar {
            ytd-mini-guide-renderer.ytd-app {
                display: none !important;
            }

            ytd-app[mini-guide-visible] ytd-page-manager.ytd-app {
                margin-left: 0 !important;
            }

            #guide-button.ytd-masthead {
                display: none !important;
            }

            #contents.ytd-rich-grid-renderer {
                justify-content: center !important;
            }

            ytd-browse[mini-guide-visible] ytd-playlist-header-renderer.ytd-browse,
            ytd-browse[mini-guide-visible] ytd-playlist-sidebar-renderer.ytd-browse,
            ytd-browse[mini-guide-visible] .page-header-sidebar.ytd-browse {
                left: 0;
            }
        }

        .CentAnni-style-home-disable-hover {
            ytd-rich-item-renderer[rich-grid-hover-highlight] {
                background-color: unset !important;
                box-shadow: unset !important;
            }

            .yt-spec-touch-feedback-shape {
                display: none;
            }
        }

        HTML.CentAnni-style-home-disable-hover:not[dark] .yt-lockup-metadata-view-model__title {
            color: #0f0f0f !important;
        }

        HTML.CentAnni-style-home-disable-hover:not[dark] .yt-lockup-metadata-view-model__metadata {
            color: #606060 !important;
        }

        HTML.CentAnni-style-home-disable-hover[dark] .yt-lockup-metadata-view-model__title {
            color: #f1f1f1 !important;
        }

        HTML.CentAnni-style-home-disable-hover[dark] .yt-lockup-metadata-view-model__metadata {
            color: #aaa !important;
        }

        #video-title,
        h1.ytd-watch-metadata,
        html #above-the-fold h1,
        .yt-lockup-metadata-view-model__title {
            text-transform: var(--textTransform) !important;
        }

        .CentAnni-style-full-title {
            #video-title.ytd-rich-grid-media,
            .yt-lockup-metadata-view-model__title {
                white-space: normal !important;
                text-overflow: unset !important;
                overflow: unset !important;
                display: inline-block !important;
            }

            #video-title {
                max-height: unset !important;
                -webkit-line-clamp: unset !important;
                line-clamp: unset !important;
            }
        }

        ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
        yt-thumbnail-view-model:has(yt-thumbnail-overlay-progress-bar-view-model),
        ytd-rich-item-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
        ytd-compact-video-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
            opacity: var(--watchedOpacity);
        }

        .CentAnni-marked-watched {
            display: none !important;
        }

        ytd-search ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
            opacity: .8;
        }

        .ytd-page-manager[page-subtype="history"] {
            ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
            yt-thumbnail-view-model:has(yt-thumbnail-overlay-progress-bar-view-model) {
                opacity: 1;
            }

            tp-yt-paper-tooltip .tp-yt-paper-tooltip[style-target="tooltip"]:not(.hidden) {
                text-wrap: nowrap;
            }
        }

        ytd-shorts tp-yt-paper-tooltip .tp-yt-paper-tooltip[style-target="tooltip"]:not(.hidden) {
            text-wrap: nowrap;
        }

        .CentAnni-style-hide-watched-videos-global {
            yt-lockup-view-model:has(yt-thumbnail-overlay-progress-bar-view-model),
            ytd-rich-item-renderer:has(yt-thumbnail-overlay-progress-bar-view-model),
            ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer),
            ytd-grid-video-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                display: none !important;
            }
        }

        .CentAnni-style-pure-bg {
            #tabs-inner-container.ytd-tabbed-page-header,
            ytd-item-section-renderer[page-subtype=playlist] #header.ytd-item-section-renderer {
                background: unset;
            }

            #tabs-divider.ytd-tabbed-page-header {
                border: none;
            }

            #cinematics-container #cinematics > div > div {
                max-height: unset !important;
                max-width: unset !important;
                width: 100dvw;
                height: 100dvw;
            }

            .ytp-delhi-modern .ytp-popup,
            .ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls,
            .ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *),
            .ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area,
            .ytp-delhi-modern.ytp-delhi-modern-compact-controls .ytp-chrome-controls .ytp-play-button {
                background: rgba(28, 28, 28, .9);
            }
        }

        html[dark].CentAnni-style-no-frosted-glass #frosted-glass.ytd-app,
        html[dark].CentAnni-style-no-frosted-glass #background.ytd-masthead,
        html[dark].CentAnni-style-no-frosted-glass #frosted-glass.with-chipbar.ytd-app {
            background: #0f0f0f !important;
        }

        html:not([dark]).CentAnni-style-no-frosted-glass #frosted-glass.ytd-app,
        html:not([dark]).CentAnni-style-no-frosted-glass #frosted-glass.with-chipbar.ytd-app,
        html:not([dark]):has(ytd-watch-flexy[default-layout]).CentAnni-style-no-frosted-glass #background.ytd-masthead {
            background: white !important;
        }

        html.CentAnni-style-pure-bg:not([dark]) ytd-app {
            background: white !important;
        }

        html.CentAnni-style-pure-bg[dark] :is(
            ytd-shorts[anchored-panel-active] .navigation-container.ytd-shorts,
            tp-yt-app-drawer.ytd-app[persistent] #guide-content > #header,
            #page-header-container.ytd-tabbed-page-header,
            ytd-app tp-yt-app-drawer.ytd-app[persistent],
            .playlist-items.ytd-playlist-panel-renderer,
            #tabs-container.ytd-tabbed-page-header,
            #page-header.ytd-tabbed-page-header,
            .header.ytd-playlist-panel-renderer,
            #frosted-glass.with-chipbar.ytd-app,
            #background.ytd-masthead,
            #frosted-glass.ytd-app,
            ytd-app) {
                background: black !important;
        }

        .CentAnni-style-remove-scrubber {
            .ytp-scrubber-container,
            .ytProgressBarPlayheadProgressBarPlayheadDot {
                display: none;
                pointer-events: none;
            }
        }

        .CentAnni-style-play-progress-color {
            .ytp-play-progress,
            .ytp-swatch-background-color {
                background: var(--progressBarColor) !important;
            }
        }

        .CentAnni-style-disable-play-on-hover {
            ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail,
            ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail,
            ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-endorsement-renderer.ytd-thumbnail,
            ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-hover-text-renderer.ytd-thumbnail,
            ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail,
            ytd-thumbnail[now-playing] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail,
            ytd-thumbnail-overlay-loading-preview-renderer[is-preview-loading],
            ytd-grid-video-renderer a#thumbnail div#mouseover-overlay,
            ytd-rich-item-renderer a#thumbnail div#mouseover-overlay,
            ytd-thumbnail-overlay-loading-preview-renderer,
            ytd-moving-thumbnail-renderer img#thumbnail,
            .ytAnimatedThumbnailOverlayViewModelHost,
            animated-thumbnail-overlay-view-model,
            ytd-moving-thumbnail-renderer yt-icon,
            ytd-moving-thumbnail-renderer span,
            ytd-moving-thumbnail-renderer img,
            ytd-moving-thumbnail-renderer,
            #mouseover-overlay,
            ytd-video-preview,
            div#video-preview,
            #video-preview,
            #preview {
                display: none !important;
            }
        }

        .CentAnni-style-hide-end-cards {
            .ytp-ce-element,
            .ytp-ce-hide-button-container.ytp-ce-element-show {
                display: none !important;
            }
        }

        .CentAnni-style-hide-endscreen {
            ytd-watch-flexy[fullscreen] .ytp-gradient-bottom,
            .ytp-delhi-modern.ytp-fullscreen-grid-active .ytp-gradient-bottom,
            ytd-watch-flexy .html5-video-player .html5-endscreen.videowall-endscreen,
            .ytp-fullscreen-grid:has(a.ytp-modern-videowall-still.ytp-suggestion-set) {
                display: none !important;
            }

            ytd-watch-flexy .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) {
                display: block !important;
                cursor: default !important;
            }

            ytd-watch-flexy .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) button {
                display: none;
            }

            ytd-watch-flexy .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) .ytp-cued-thumbnail-overlay-image {
                display: block !important;
                background-image: var(--video-url) !important;
            }

            .ytp-delhi-modern.ytp-full-bleed-player.ytp-fullscreen-grid-active:not(.html5-video-player.ended-mode) .ytp-chrome-bottom {
                bottom: 0 !important;
                opacity: 1 !important;
            }

            .ytp-fullscreen-grid-active .ytp-overlays-container {
                display: flex !important;
                opacity: 1 !important;
            }

            ytd-watch-flexy[fullscreen] div#movie_player {
                --ytp-grid-scroll-percentage: 0 !important;
            }
        }

        .CentAnni-style-gradient-bottom {
            .ytp-gradient-bottom {
                padding-top: 50px !important;
                height: 48px !important;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) !important;
            }
        }

        .CentAnni-style-video-row {
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: var(--itemsPerRow) !important;
            }

            ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
                margin-left: calc(var(--ytd-rich-grid-item-margin)/2);
            }
        }

        .CentAnni-style-sidebar-width {
            ytd-watch-flexy[is-two-columns_] {
                --ytd-watch-flexy-sidebar-width: var(--sidebarWidth);
                --ytd-watch-flexy-sidebar-min-width: unset;
            }
        }

        .CentAnni-style-search-position {
            #center.ytd-masthead {
                transform: translateX(var(--searchbarPosition));
            }
        }

        .CentAnni-style-hide-voice-search {
            #voice-search-button.ytd-masthead {
                display: none;
            }
        }

        .CentAnni-style-hide-create-btn {
            .masthead-skeleton-icon:first-child,
            #end ytd-button-renderer.ytd-masthead[button-renderer][button-next]:not(:last-child) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-queue-btn {
            yt-list-item-view-model:has(path[d^="M2 2.864v6"]),
            yt-list-item-view-model:has(path[d^="M21 16h-7v"]),
            ytd-menu-service-item-renderer:has(path[d^="M21 16h-7v"]),
            ytd-menu-service-item-renderer:has(path[d^="M2 2.864v6"]),
            ytd-thumbnail-overlay-toggle-button-renderer:has(path[d^="M21 16h-7v"]),
            ytd-thumbnail-overlay-toggle-button-renderer[aria-label="Add to queue"],
            .ytThumbnailHoverOverlayToggleActionsViewModelButton:has(path[d^="M21 16h-7v"]),
            .ytThumbnailHoverOverlayToggleActionsViewModelButton:has(button[aria-label="Add to queue"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-notification-btn {
            .masthead-skeleton-icon:nth-child(2),
            #masthead-container #end #buttons ytd-notification-topbar-button-renderer {
                display: none !important;
            }
        }

        .CentAnni-style-hide-notification-badge {
            #masthead-container #end #buttons ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge {
                display: none;
            }
        }

        .CentAnni-style-sort-notifications {
            ytd-app > ytd-popup-container tp-yt-iron-dropdown h2.yt-multi-page-menu-section-renderer {
                display: none;
            }

            ytd-app > ytd-popup-container tp-yt-iron-dropdown #sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:not(:last-child) {
                border: none;
            }
        }

        .CentAnni-style-hide-own-avatar {
            #avatar-btn,
            .masthead-skeleton-icon:last-child {
                display: none !important;
            }

            .masthead-skeleton-icon:nth-child(2),
            #end ytd-notification-topbar-button-renderer {
                margin-right: 0 !important;
            }
        }

        .CentAnni-style-hide-brand-text {
            #start ytd-topbar-logo-renderer > #logo > ytd-yoodle-renderer > picture,
            #start #country-code.ytd-topbar-logo-renderer,
            #start #logo-icon [id^="youtube-paths_yt"] {
                display: none;
            }

            #logo.ytd-masthead {
                width: 29px !important;
                overflow: hidden;
            }

            #start ytd-topbar-logo-renderer > #logo > ytd-yoodle-renderer > ytd-logo {
                display: block !important;
            }

            #start yt-icon.ytd-logo {
                padding: 0;
            }
        }

        .CentAnni-style-visible-country-code {
            #country-code.ytd-topbar-logo-renderer {
                position: absolute;
                color: var(--countryCodeColor);
                margin: -8px 0 0 27px;
                display: block !important;
            }
        }

        .CentAnni-style-hide-fundraiser {
            #donation-shelf,
            ytd-badge-supported-renderer:has([aria-label="Fundraiser"]) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-posts-home {
            ytd-rich-section-renderer:has(ytd-post-renderer) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-miniplayer {
            ytd-miniplayer,
            #ytd-player .ytp-miniplayer-button {
                display: none !important;
            }
        }

        .CentAnni-style-square-search-bar {
            #center.ytd-masthead {
                flex: 0 1 38.76dvw;
                margin: 0 8px;
            }

            .YtSearchboxComponentInputBox {
                border: 1px solid hsl(0, 0%, 18.82%);
                border-radius: 0;
                margin-left: 0;
                padding: 0 4px 0 10px;
            }

            .YtSearchboxComponentSuggestionsContainer {
                border-radius: 0 0 5px 5px;
            }

            .YtSearchboxComponentSearchButton,
            .YtSearchboxComponentSearchButtonDark {
                display: none;
            }

            .YtSearchboxComponentHost {
                margin: 0;
                padding: 0;
            }

            .ytSearchboxComponentInputBox {
                border: 1px solid hsl(0, 0%, 18.82%);
                border-radius: 0;
                margin-left: 0;
                padding: 0 4px 0 10px;
            }

            .ytSearchboxComponentSuggestionsContainer {
                max-width: 500px;
                border-radius: 0 0 5px 5px;
            }

            .ytSearchboxComponentSearchButton,
            .ytSearchboxComponentSearchButtonDark {
                display: none;
            }

            .ytSearchboxComponentHost {
                margin: 0;
                padding: 0;
            }

            .ytSearchboxComponentDesktop .ytSearchboxComponentClearButton {
                border-radius: 0;
                height: 38px;
                width: 38px;
                margin-right: 6px;
            }

            #end.ytd-masthead {
                min-width: auto;
            }

            .ytSearchboxComponentInnerSearchIcon {
                display: none;
            }

            .ytSearchboxComponentSearchForm {
                padding: 0 15px 0 0;
            }

            .ytSuggestionComponentRemoveLinkClearButton:hover {
                background-color: rgba(255, 255, 255, .2);
            }

            .ytSuggestionComponentLeftContainer {
                max-width: 347px;
            }
        }

        ytd-app #masthead-container yt-searchbox .ytSuggestionComponentSuggestion,
        ytd-app #masthead-container yt-searchbox .ytSuggestionComponentSuggestion > .ytSuggestionComponentText {
            cursor: pointer;
        }

        .ytd-page-manager[page-subtype="home"] {
            #avatar-container.ytd-rich-grid-media {
                margin: 12px 12px 0 6px;
            }

            ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
                margin-left: calc(var(--ytd-rich-grid-item-margin)/2);
            }

            #contents.ytd-rich-grid-renderer {
                justify-content: center;
            }
        }

        .CentAnni-style-square-design {
            #thumbnail,
            .CentAnni-tabView,
            .ytp-settings-menu,
            #card.ytd-miniplayer,
            .smartimation__border,
            .ytp-tooltip-text-wrapper,
            .ytThumbnailViewModelSmall,
            .ytThumbnailViewModelLarge,
            .ytThumbnailViewModelMedium,
            ytd-playlist-video-renderer,
            .ytOfficialCardViewModelHost,
            .ytImageBannerViewModelInset,
            #dismissed.ytd-rich-grid-media,
            .yt-thumbnail-view-model--large,
            ytd-info-panel-content-renderer,
            .snackbarViewModelImageContainer,
            ytd-expandable-metadata-renderer,
            .yt-thumbnail-view-model--medium,
            ytd-author-comment-badge-renderer,
            .ytp-modern-videowall-still-image,
            .ytp-modern-videowall-still:hover,
            .yt-list-item-view-model__container,
            .ytCollectionsStackCollectionStack2,
            .badge.ytd-badge-supported-renderer,
            .yt-spec-button-shape-next--size-xs,
            ytd-thumbnail[size="large"]::before,
            ytd-post-renderer[rounded-container],
            #related.style-scope.ytd-watch-flexy,
            ytd-thumbnail[size="medium"]::before,
            .ytNotificationMultiActionRendererHost,
            .animated-action__background-container,
            .ytp-player-minimized .html5-main-video,
            .ytp-popup.ytp-delhi-modern-contextmenu,
            .ytCollectionsStackCollectionStack1Large,
            .ytProgressBarLineProgressBarLineRounded,
            .ytCollectionsStackCollectionStack1Small,
            .ytp-tooltip.ytp-text-detail.ytp-preview,
            .ytCollectionsStackCollectionStack1Medium,
            .collections-stack-wiz__collection-stack2,
            ytd-donation-shelf-renderer[modern-panels],
            yt-img-shadow.ytd-backstage-image-renderer,
            ytd-thumbnail[size="large"] a.ytd-thumbnail,
            .ytp-player-minimized .ytp-miniplayer-scrim,
            ytd-thumbnail[size="medium"] a.ytd-thumbnail,
            .reel-video-in-sequence-thumbnail.ytd-shorts,
            yt-interaction.circular .fill.yt-interaction,
            .ytSuggestionComponentVisualSuggestThumbnail,
            .ytp-progress-bar-start.ytp-progress-bar-end,
            .yt-spec-button-shape-next--icon-only-default,
            yt-interaction.circular .stroke.yt-interaction,
            ytd-watch-flexy[theater] .CentAnni-tabView-tab,
            .thumbnail-container.ytd-notification-renderer,
            tp-yt-paper-item.ytd-menu-service-item-renderer,
            .ytContentPreviewImageViewModelLargeRoundedImage,
            .collections-stack-wiz__collection-stack1--large,
            tp-yt-paper-toast.yt-notification-action-renderer,
            .collections-stack-wiz__collection-stack1--medium,
            yt-interaction.rounded-large .fill.yt-interaction,
            yt-interaction.rounded-large .stroke.yt-interaction,
            .shortsLockupViewModelHostThumbnailContainerRounded,
            .metadata-container.ytd-reel-player-overlay-renderer,
            ytd-shorts .player-container.ytd-reel-video-renderer,
            ytd-compact-link-renderer.ytd-settings-sidebar-renderer,
            .ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg,
            .shortsLockupViewModelHostThumbnailParentContainerRounded,
            ytd-live-chat-frame[theater-watch-while][rounded-container],
            ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy,
            ytd-shorts[enable-anchored-panel] .anchored-panel.ytd-shorts,
            ytd-live-chat-frame[rounded-container]:not([theater-watch-while]),
            ytd-live-chat-frame[rounded-container] iframe.ytd-live-chat-frame,
            .ytp-delhi-modern .ytp-settings-menu .ytp-menuitem > *:last-child,
            .ytp-delhi-modern .ytp-settings-menu .ytp-menuitem > *:first-child,
            .html5-video-player:not(.ytp-touch-mode) ::-webkit-scrollbar-thumb,
            .CentAnni-tabView:has(.CentAnni-tabView-tab.active[data-tab="tab-2"]),
            ytd-author-comment-badge-renderer[enable-modern-comment-badges][creator],
            ytd-engagement-panel-section-list-renderer:not([live-chat-engagement-panel]),
            ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy,
            .yt-video-attribute-view-model--image-small .yt-video-attribute-view-model__hero-section,
            ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
            ytd-macro-markers-list-item-renderer[rounded] #thumbnail.ytd-macro-markers-list-item-renderer,
            ytd-expandable-metadata-renderer:not([is-expanded]) #header.ytd-expandable-metadata-renderer:hover,
            ytd-watch-flexy[flexy][js-panel-height_]:not([fixed-panels]) #chat.ytd-watch-flexy:not([collapsed]),
            ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
                border-radius: 0 !important;
            }

            .yt-content-preview-image-view-model-wiz--large-rounded-image,
            .yt-video-attribute-view-model--image-large .yt-video-attribute-view-model__hero-section {
                border-radius: 1px;
            }

            .ytChipShapeChip,
            yt-dropdown-menu,
            .CentAnni-tabView-tab,
            #menu.yt-dropdown-menu,
            ytd-menu-popup-renderer,
            ytd-guide-entry-renderer,
            tp-yt-paper-dialog[modern],
            .ytSheetViewModelContextual,
            yt-chip-cloud-chip-renderer,
            ytd-multi-page-menu-renderer,
            #description.ytd-watch-metadata,
            .yt-badge-shape--thumbnail-badge,
            .badge-shape-wiz--thumbnail-badge,
            .yt-spec-button-shape-next--size-s,
            .yt-spec-button-shape-next--size-m,
            ytd-rich-metadata-renderer[rounded],
            .yt-sheet-view-model-wiz--contextual,
            .ytAnimatedActionBackgroundContainer,
            .ytVideoMetadataCarouselViewModelHost,
            .ytdTalkToRecsFlowRendererFlowContent,
            yt-interaction.ytd-guide-entry-renderer,
            .ytSuggestionComponentRoundedSuggestion,
            .dropdown-content.tp-yt-paper-menu-button,
            .tp-yt-paper-tooltip[style-target=tooltip],
            #chip-container.yt-chip-cloud-chip-renderer,
            ytd-backstage-post-renderer[uses-full-lockup],
            .image-wrapper.ytd-hero-playlist-thumbnail-renderer,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
            .immersive-header-container.ytd-playlist-header-renderer,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active,
            .yt-spec-touch-feedback-shape--down .yt-spec-touch-feedback-shape__fill,
            .yt-spec-touch-feedback-shape--down .yt-spec-touch-feedback-shape__stroke,
            ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer,
            ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
            .yt-page-header-view-model--display-as-sidebar .yt-page-header-view-model__page-header-background,
            .page-header-view-model-wiz--display-as-sidebar .page-header-view-model-wiz__page-header-background,
            ytd-menu-service-item-renderer[use-list-item-styles] tp-yt-paper-item.ytd-menu-service-item-renderer,
            ytd-menu-service-item-renderer[use-list-item-styles] tp-yt-paper-item.ytd-menu-service-item-renderer:focus {
                border-radius: 2px !important;
            }

            #masthead-container yt-interaction.circular .fill.yt-interaction,
            #masthead-container yt-interaction.circular .stroke.yt-interaction,
            ytd-rich-item-renderer yt-interaction.circular .fill.yt-interaction,
            ytd-rich-item-renderer yt-interaction.circular .stroke.yt-interaction {
                border-radius: 50% !important;
            }

            tp-yt-paper-item.ytd-guide-entry-renderer,
            ytd-compact-link-renderer[compact-link-style="compact-link-style-type-settings-sidebar"] tp-yt-paper-item.ytd-compact-link-renderer {
                --paper-item-focused-before-border-radius: 0;
            }

            .ytd-page-manager[page-subtype="home"] {
                yt-chip-cloud-chip-renderer {
                    border-radius: 2px;
                }

                .CentAnni-style-live-video,
                .CentAnni-style-upcoming-video,
                .CentAnni-style-newly-video,
                .CentAnni-style-recent-video,
                .CentAnni-style-lately-video,
                .CentAnni-style-latterly-video,
                .CentAnni-style-old-video {
                    border-radius: 0;
                }
            }

            .ytd-page-manager[page-subtype="subscriptions"] {
                .CentAnni-style-last-seen {
                    border-radius: 0;
                }
            }

            .ytd-page-manager[page-subtype="channels"] {
                .yt-spec-button-shape-next--size-m {
                    border-radius: 2px;
                }

                .yt-thumbnail-view-model--medium,
                .yt-image-banner-view-model-wiz--inset,
                .collections-stack-wiz__collection-stack2,
                #chip-container.yt-chip-cloud-chip-renderer,
                .collections-stack-wiz__collection-stack1--medium {
                    border-radius: 0 !important;
                }
            }

            .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start {
                border-radius: 2px 0 0 3px;
            }

            .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end {
                border-radius: 0 3px 3px 0;
            }

            ytd-expandable-metadata-renderer:not([is-expanded]) {
                --yt-img-border-radius: 0px;
                border-radius: 0px;
            }

            .desktopShortsPlayerControlsWizHost {
                left: 0;
                right: 0;
            }

            ytd-search yt-official-card-view-model horizontal-shelf-view-model .ytwHorizontalShelfViewModelLeftArrow .yt-spec-button-shape-next--size-m,
            ytd-search yt-official-card-view-model horizontal-shelf-view-model .ytwHorizontalShelfViewModelRightArrow .yt-spec-button-shape-next--size-m {
                border-radius: 18px;
            }

            .snackbarViewModelHost {
                border-radius: 0px 4px 4px 0px;
            }

            .ytp-delhi-modern .ytp-right-controls-left > .ytp-button,
            .ytp-delhi-modern .ytp-right-controls-right > .ytp-button {
                border-radius: 0 !important;
                overflow: hidden;
            }
            .ytp-delhi-modern .ytp-right-controls-left > .ytp-button::before,
            .ytp-delhi-modern .ytp-right-controls-right > .ytp-button::before {
                border-radius: 0 !important;
            }

            .ytp-delhi-modern .ytp-right-controls-left > .ytp-button:first-of-type,
            .ytp-delhi-modern .ytp-right-controls-left > .ytp-button:first-of-type::before {
                border-top-left-radius: 40px !important;
                border-bottom-left-radius: 40px !important;
            }

            .ytp-delhi-modern .ytp-right-controls-left > .ytp-expand-right-bottom-section-button + .ytp-button,
            .ytp-delhi-modern .ytp-right-controls-left > .ytp-expand-right-bottom-section-button + .ytp-button::before {
                border-top-left-radius: 40px !important;
                border-bottom-left-radius: 40px !important;
            }

            .ytp-delhi-modern .ytp-right-controls-right > .ytp-button:last-of-type,
            .ytp-delhi-modern .ytp-right-controls-right > .ytp-button:last-of-type::before {
                border-top-right-radius: 40px !important;
                border-bottom-right-radius: 40px !important;
            }
        }

        .CentAnni-style-square-avatars {
            .yt-spec-avatar-shape__image,
            #avatar.ytd-video-owner-renderer,
            yt-img-shadow.ytd-video-renderer,
            yt-img-shadow.ytd-channel-renderer,
            .thumbnail.ytd-notification-renderer,
            ytd-menu-renderer.ytd-rich-grid-media,
            yt-img-shadow.ytd-guide-entry-renderer,
            #avatar.ytd-active-account-header-renderer,
            #avatar.ytd-watch-card-rich-header-renderer,
            yt-img-shadow.ytd-topbar-menu-button-renderer,
            #author-thumbnail.ytd-comment-simplebox-renderer,
            ytd-rich-item-renderer yt-interaction.circular .fill.yt-interaction,
            ytd-rich-item-renderer yt-interaction.circular .stroke.yt-interaction,
            .yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after,
            #author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model,
            #author-thumbnail.ytd-backstage-post-renderer yt-img-shadow.ytd-backstage-post-renderer,
            ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer yt-img-shadow.ytd-comment-replies-renderer {
                border-radius: 0 !important;
            }
        }

        .CentAnni-pl-Direct-Btns {
            ytd-watch-flexy #movie_player > div.ytp-chrome-bottom a.ytp-prev-button.ytp-button {
                display: none
            }
        }

        #CentAnni-channel-btn {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #CentAnni-playlist-direction-container {
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
        }

        #CentAnni-playlist-direction-container > span {
            margin-right: 4px;
            color: var(--yt-spec-text-primary);
            font-family: "YouTube Sans", "Roboto", sans-serif;
            font-size: 1.7rem;
            line-height: 1rem;
            font-weight: 600;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            cursor: default;
        }

        #end-actions.ytd-playlist-panel-renderer {
            margin-right: 24px;
        }

        .CentAnni-yt-shorts-control-btn,
        .CentAnni-playlist-direction-btn {
            color: var(--yt-spec-text-secondary) !important;
        }

        .CentAnni-yt-shorts-control-btn.active,
        .CentAnni-playlist-direction-btn.active {
            color: var(--yt-spec-text-primary) !important;
        }

        .CentAnni-yt-shorts-control-btn.active {
            border: 1px solid color-mix(in srgb, var(--yt-spec-text-primary) 20%, transparent) !important;
        }

        #CentAnni-yt-shorts-controls {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin: auto 0;
        }

        .CentAnni-yt-shorts-control-btn {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
            font-weight: 400 !important;
            overflow: hidden;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            display: flex;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            white-space: normal;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .CentAnni-style-compact-layout {
            ytd-rich-section-renderer:has(.grid-subheader.ytd-shelf-renderer) {
                display: none;
            }

            #page-manager.ytd-app {
                --ytd-toolbar-offset: 0 !important;
            }

            ytd-browse[page-subtype="hashtag-landing-page"] {
                transform: translateY(0px);
            }

            .ytd-page-manager[page-subtype="home"],
            .ytd-page-manager[page-subtype="channels"],
            .ytd-page-manager[page-subtype="subscriptions"] {
                ytd-menu-renderer .ytd-menu-renderer[style-target=button] {
                    height: 36px;
                    width: 36px;
                }

                button.yt-icon-button > yt-icon {
                    transform: rotate(90deg);
                }

                #contents.ytd-rich-grid-renderer {
                    width: 100%;
                    max-width: 100%;
                    padding-top: 0;
                    display: flex;
                    flex-wrap: wrap;
                    column-gap: 5px;
                    row-gap: 10px;
                }

                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-item-max-width: 100dvw;
                    --ytd-rich-grid-item-min-width: 310px;
                    --ytd-rich-grid-item-margin: 0px !important;
                    --ytd-rich-grid-content-offset-top: 56px;
                }

                ytd-rich-item-renderer[rendered-from-rich-grid] {
                    margin: 0 !important;
                }

                #meta.ytd-rich-grid-media,
                .yt-lockup-metadata-view-model__title {
                    overflow-x: hidden;
                    padding-right: 6px;
                }

                #avatar-container.ytd-rich-grid-media {
                    margin: 7px 6px 50px 6px;
                }

                h3.ytd-rich-grid-media {
                    margin: 7px 0 4px 0;
                }

                .yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after {
                    inset: -2px;
                }

                .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text:hover {
                    border-radius: 50% !important;
                }

                .yt-lockup-metadata-view-model {
                    margin-bottom: 5px;
                    min-height: 77px;
                }
            }

            .ytd-page-manager[page-subtype="home"] {
                ytd-menu-renderer.ytd-rich-grid-media,
                .yt-lockup-metadata-view-model__menu-button,
                .yt-lockup-metadata-view-model-wiz__menu-button {
                    position: absolute;
                    height: 36px;
                    width: 36px;
                    top: 50px;
                    right: auto;
                    left: 6px;
                    align-items: center;
                    background-color: rgba(255, 255, 255, .1);
                    border-radius: 50%;
                }

                .title-badge.ytd-rich-grid-media,
                .video-badge.ytd-rich-grid-media {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    margin: 8px;
                    display: flex;
                    flex-direction: row;
                }

                ytd-rich-item-renderer[rendered-from-rich-grid] {
                    margin: 0 !important;
                }

                #contents.ytd-rich-grid-renderer {
                    padding-top: 2px;
                    column-gap: 14px;
                    row-gap: 14px;
                }

                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-item-margin: .5% !important;
                }

                .yt-lockup-metadata-view-model__avatar,
                .yt-lockup-metadata-view-model-wiz__avatar {
                    margin: 0 7px 0 5px;
                }

                .yt-lockup-metadata-view-model__menu-button,
                .yt-lockup-metadata-view-model-wiz__menu-button {
                    top: 41px;
                }

                .ytLockupAttachmentsViewModelAttachment {
                    margin-top: 0;
                }

                .yt-lockup-view-model-wiz--vertical.yt-lockup-view-model-wiz--rich-grid-legacy-margin .yt-lockup-view-model-wiz__content-image {
                    padding-bottom: 6px;
                }

                #content.ytd-rich-item-renderer > .lockup.ytd-rich-item-renderer {
                    height: 100%;
                }

                .yt-lockup-view-model-wiz__metadata {
                    margin-bottom: 3px;
                }

                .yt-content-metadata-view-model__badge {
                    margin: 0;
                }

                .yt-content-metadata-view-model__metadata-row--metadata-row-wrap {
                    margin: 0 5px 0 0;
                    justify-content: end;
                }
            }

            .ytd-page-manager[page-subtype="channels"] {
                ytd-tabbed-page-header.grid-5-columns #page-header.ytd-tabbed-page-header,
                ytd-tabbed-page-header.grid-5-columns[has-inset-banner] #page-header-banner.ytd-tabbed-page-header {
                    padding: 0 !important;
                }

                ytd-tabbed-page-header[has-banner] #page-header.ytd-tabbed-page-header {
                    padding-top: 0;
                    padding-bottom: 0;
                }

                .yt-page-header-view-model__page-header-headline {
                    margin: 4px 0 0 24px;
                }

                ytd-two-column-browse-results-renderer.grid-5-columns,
                .grid-5-columns.ytd-two-column-browse-results-renderer {
                    width: 100% !important;
                }

                ytd-rich-grid-renderer:not([is-default-grid]) #header.ytd-rich-grid-renderer {
                    transform: translateY(-40px);
                    z-index: 2000;
                    width: max-content;
                    margin-left: auto;
                }

                ytd-two-column-browse-results-renderer.grid-6-columns ytd-rich-grid-renderer:not([is-default-grid]) #header {
                    margin-right: 5px;
                }

                ytd-two-column-browse-results-renderer.grid-5-columns ytd-rich-grid-renderer:not([is-default-grid]) #header {
                    margin-right: 110px;
                }

                ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] {
                    margin-bottom: -32px;
                    margin-top: 0;
                }

                .page-header-view-model-wiz__page-header-headline-image {
                    margin-left: 110px;
                }

                ytd-menu-renderer.ytd-rich-grid-media {
                    position: absolute;
                    height: 36px;
                    width: 36px;
                    top: initial;
                    bottom: -10px;
                    right: 0;
                    align-items: center;
                    border-radius: 50%;
                }

                ytd-expandable-tab-renderer button:hover,
                ytd-menu-renderer.ytd-rich-grid-media button:hover {
                    background-color: rgba(255, 255, 255, .1);
                    border-radius: 50%;
                }

                ytd-expandable-tab-renderer[show-input] yt-icon-button.ytd-expandable-tab-renderer {
                    margin-right: 8px;
                }

                ytd-expandable-tab-renderer yt-interaction .fill.yt-interaction,
                ytd-expandable-tab-renderer yt-interaction .stroke.yt-interaction {
                    border-radius: 50% !important;
                }

                .yt-tab-group-shape-wiz__slider,
                .yt-tab-shape-wiz__tab-bar {
                    display: none;
                }

                .yt-tab-shape-wiz__tab--tab-selected,
                .yt-tab-shape-wiz__tab:hover {
                    color: white;
                }

                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-item-margin: .5% !important;
                }

                ytd-backstage-items {
                    display: block;
                    max-width: 100%;
                }

                #contents {
                    margin-left: 10px;
                    margin-right: 10px;
                }

                #header-container {
                    width: 80dvw;
                    align-self: center;
                }

                #items.ytd-grid-renderer {
                    justify-content: center;
                }

                .tabGroupShapeSlider,
                .yt-tab-shape__tab-bar {
                    bottom: 12px;
                }
            }

            .ytd-page-manager[page-subtype="channels"] #contentContainer {
                padding-top: 0 !important;
            }

            .ytd-page-manager[page-subtype="channels"] tp-yt-app-header {
                position: static !important;
                transform: none !important;
                transition: none !important;
            }

            .ytd-page-manager[page-subtype="channels"] tp-yt-app-header[fixed] {
                position: static !important;
                transform: none !important;
                transition: none !important;
            }

            .ytd-page-manager[page-subtype="channels"] tp-yt-app-header #page-header {
                position: static !important;
                transform: none !important;
            }

            .ytd-page-manager[page-subtype="subscriptions"] {
                ytd-menu-renderer.ytd-rich-grid-media,
                .yt-lockup-metadata-view-model__menu-button {
                    position: absolute;
                    height: 36px;
                    width: 36px;
                    top: 50px;
                    right: auto;
                    left: 3px;
                    align-items: center;
                    background-color: rgba(255, 255, 255, .1);
                    border-radius: 50%;
                }

                .yt-lockup-metadata-view-model__menu-button {
                    top: 45px;
                }

                .yt-lockup-metadata-view-model__avatar {
                    margin: 0 9px 0 3px;
                }

                .title-badge.ytd-rich-grid-media,
                .video-badge.ytd-rich-grid-media {
                    position: absolute;
                    margin: -25px 8px 0 0;
                    right: 0;
                    top: 0;
                }

                .yt-spec-touch-feedback-shape--thumbnail-size-large {
                    margin: 0;
                }
            }

            .item.ytd-watch-metadata {
                margin-top: 7px;
            }

            #middle-row.ytd-watch-metadata:empty {
                display: none;
            }

            #subheader.ytd-engagement-panel-title-header-renderer:not(:empty) {
                padding: 0 !important;
                transform: translateX(110px) translateY(-44px);
                background-color: transparent;
                border-top: none;
            }

            #header.ytd-engagement-panel-title-header-renderer {
                padding: 4px 7px 4px 7px;
            }

            #visibility-button.ytd-engagement-panel-title-header-renderer,
            #information-button.ytd-engagement-panel-title-header-renderer {
                z-index: 1;
            }

            .ytChipShapeChip:hover {
                background: rgba(255, 255, 255, .2);
                border-color: transparent;
            }

            .ytChipShapeActive:hover {
                background-color: #f1f1f1;
                color: #0f0f0f;
            }

            ytd-engagement-panel-title-header-renderer {
                height: 54px;
            }

            .yt-spec-button-shape-next--icon-only-default {
                width: 35px;
                height: 35px;
            }

            ytd-miniplayer {
                --ytd-miniplayer-attachment-padding: 0;
            }

            ytd-watch-flexy #title > ytd-badge-supported-renderer div > yt-icon {
                padding: 0 2px 0px 0;
            }

            #container.ytd-search ytd-video-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-video-renderer,
            #container.ytd-search ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style="BIG"] ytd-thumbnail.ytd-video-renderer {
                max-width: calc(100dvh / 2.33 - 64px);
                min-width: 250px;
            }

            ytd-search #expandable-metadata.ytd-video-renderer:not(:empty) {
                margin: 0;
            }

            ytd-watch-flexy .ryd-tooltip-new-design .ryd-tooltip-bar-container {
                padding: 0;
                margin-top: -2px;
            }

            ytd-watch-flexy #above-the-fold #top-row {
                border: none !important;
                padding: 0 !important;
            }

            ytd-guide-entry-renderer {
                width: 100%;
            }

            button.ytd-topbar-menu-button-renderer {
                padding: 0;
            }

            yt-img-shadow.ytd-topbar-menu-button-renderer {
                margin: 0;
            }

            .masthead-skeleton-icon:last-child {
                margin: 0;
                padding: 0;
            }

            ytd-browse[page-subtype="playlist"],
            ytd-browse[has-page-header-sidebar] {
                padding-top: 0;
            }

            ytd-sort-filter-header-renderer[is-playlist] #header-container.ytd-sort-filter-header-renderer {
                margin: 6px 0 12px 0;
            }

            ytd-watch-flexy #comments #header ytd-comments-header-renderer {
                margin: 12px 0 24px 0;
            }

            ytd-watch-flexy ytd-macro-markers-list-item-renderer:not([carousel-type="MACRO_MARKERS_LIST_ITEM_RENDERER_CAROUSEL_TYPE_TEXT_ONLY"]):is([active],[should-show-buttons]) h4.ytd-macro-markers-list-item-renderer {
                width: calc(100% + 70px);
            }

            ytd-watch-flexy #share-button.ytd-macro-markers-list-item-renderer, #repeat-button.ytd-macro-markers-list-item-renderer {
                margin-top: auto;
                transform: translateY(11px);
                scale: .9;
            }

            ytd-thumbnail-overlay-toggle-button-renderer,
            .yt-spec-button-shape-next--overlay-dark.yt-spec-button-shape-next--tonal {
                --paper-tooltip-background: rgba(0, 0, 0, 0.8);
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                color: rgb(255, 255, 255);
                outline: none;
                background-color: rgba(0, 0, 0, 0.8);
                transition: opacity .3s;
                width: 28px;
                height: 28px;
                margin: 8px;
                border-radius: 2px;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            .yt-spec-button-shape-next--overlay-dark.yt-spec-button-shape-next--tonal:hover {
                background: black;
            }

            ytd-popup-container > tp-yt-iron-dropdown > #contentWrapper .ytContextualSheetLayoutHost {
                min-width: 200px;
            }

            ytd-popup-container > tp-yt-iron-dropdown > #contentWrapper .ytListViewModelHost {
                padding: 8px 0;
            }

            ytd-popup-container > tp-yt-iron-dropdown > #contentWrapper .yt-list-item-view-model__container {
                padding: 0 16px;
            }

            ytd-watch-flexy #playlist,
            #related.style-scope.ytd-watch-flexy,
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript],
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description],
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters] {
                top: 52px !important;
            }

            #columns > #secondary > #secondary-inner > #chat-container {
                top: 0 !important;
            }

            ytd-watch-flexy[default-layout] #below {
                padding: 0 10px;
            }

            ytd-item-section-renderer[page-subtype="playlist"][has-header][exp-fix-playlist-header] #contents.ytd-item-section-renderer {
                margin-top: 0;
            }

            ytd-watch-flexy[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #primary.ytd-watch-flexy,
            ytd-watch-flexy[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #secondary.ytd-watch-flexy {
                padding-top: 0;
            }

            .CentAnni-tabView-content,
            #related.style-scope.ytd-watch-flexy,
            ytd-watch-flexy[default-layout] #playlist,
            ytd-watch-flexy[default-layout] #secondary,
            ytd-watch-flexy[default-layout] #container.ytd-playlist-panel-renderer,
            #donation-shelf.ytd-watch-flexy ytd-donation-shelf-renderer.ytd-watch-flexy,
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript],
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description],
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters] {
                max-height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - var(--ytd-margin-6x) - 52px) !important;
            }

            ytd-watch-flexy[flexy]:not([fixed-panels]) #chat.ytd-watch-flexy:not([collapsed]),
            ytd-watch-flexy:not([fixed-panels]):not([squeezeback]) #chat.ytd-watch-flexy:not([collapsed]) {
                height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - var(--ytd-margin-6x)) !important;
            }

            .ytListViewModelCollectionThumbnailClass {
                max-width: fit-content;
            }

            .ytp-popup.ytp-settings-menu,
            .yt-list-item-view-model__accessory,
            .guide-icon.ytd-guide-entry-renderer,
            ytd-transcript-footer-renderer button#button,
            .yt-spec-button-shape-next--size-m .yt-spec-button-shape-next__icon,
            ytd-menu-service-item-renderer[system-icons] yt-icon.ytd-menu-service-item-renderer,
            ytd-menu-service-item-renderer[system-icons] .ytIconWrapperHost.ytd-menu-service-item-renderer,
            #icon.ytd-notification-topbar-button-renderer {
                scale: .85;
            }

            .ytp-popup.ytp-settings-menu {
                transform: translateY(35px);
            }
        }

        .CentAnni-style-max-video-size:not(.CentAnni-style-compact-layout) ytd-watch-flexy[default-layout] {
            --ytd-watch-flexy-max-player-width: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--ytd-margin-6x) - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
            --ytd-watch-flexy-max-player-width-wide-screen: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--ytd-margin-6x) - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
        }

        .CentAnni-style-compact-layout:not(.CentAnni-style-max-video-size) ytd-watch-flexy[default-layout] {
            --ytd-watch-flexy-max-player-width: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--spaceBelow) - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
            --ytd-watch-flexy-max-player-width-wide-screen: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--spaceBelow) - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
        }

        .CentAnni-style-max-video-size.CentAnni-style-compact-layout ytd-watch-flexy[default-layout] {
            --ytd-watch-flexy-max-player-width: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
            --ytd-watch-flexy-max-player-width-wide-screen: min(calc(100dvw - (var(--ytd-margin-6x) * 3) - var(--ytd-watch-flexy-sidebar-width)),
                    calc((100dvh - var(--ytd-toolbar-height)) * var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) !important;
        }

        html:is(.CentAnni-style-compact-layout, .CentAnni-style-max-video-size) :where(.ytp-chrome-bottom, .html5-video-player .video-stream) {
            left: 50% !important;
            transform: translateX(-50%);
        }

        .CentAnni-style-no-ambient {
            #cinematic-container,
            #cinematics-container {
                display: none !important;
            }
        }

        ytd-watch-flexy #expandable-metadata #content.ytd-expandable-metadata-renderer {
            display: block !important;
            height: calc(var(--yt-macro-marker-list-item-height) - 34px);
            visibility: visible;
            pointer-events: auto;
        }

        ytd-watch-flexy #expandable-metadata ytd-expandable-metadata-renderer[is-watch] #collapsed-title.ytd-expandable-metadata-renderer {
            display: none;
        }

        ytd-watch-flexy #expandable-metadata ytd-expandable-metadata-renderer[has-video-summary] #expanded-title-subtitle-group.ytd-expandable-metadata-renderer {
            display: flex !important;
        }

        ytd-watch-flexy #expandable-metadata #expanded-subtitle.ytd-expandable-metadata-renderer {
            display: block !important;
            pointer-events: auto;
        }

        ytd-watch-flexy #expandable-metadata ytd-expandable-metadata-renderer[is-watch] {
            background: transparent;
            pointer-events: none;
        }

        ytd-watch-flexy #expandable-metadata #right-section.ytd-expandable-metadata-renderer {
            display: none;
        }

        ytd-watch-flexy #expandable-metadata ytd-expandable-metadata-renderer:not([is-expanded]) #header.ytd-expandable-metadata-renderer:hover {
            background-color: transparent;
        }

        .ytd-page-manager[page-subtype="home"] {
            .CentAnni-style-live-video,
            .CentAnni-style-upcoming-video,
            .CentAnni-style-newly-video,
            .CentAnni-style-recent-video,
            .CentAnni-style-lately-video,
            .CentAnni-style-latterly-video {
                outline: 2px solid;
                border-radius: 12px;
            }

            .CentAnni-style-old-video { outline: none; }
            .CentAnni-style-live-video { outline-color: var(--liveVideo); }
            .CentAnni-style-streamed-text { color: var(--streamedText); }
            .CentAnni-style-upcoming-video { outline-color: var(--upComingVideo); }
            .CentAnni-style-newly-video { outline-color: var(--newlyVideo); }
            .CentAnni-style-recent-video { outline-color: var(--recentVideo); }
            .CentAnni-style-lately-video { outline-color: var(--latelyVideo); }
            .CentAnni-style-latterly-video { outline-color: var(--latterlyVideo); }
            .CentAnni-style-old-video { opacity: var(--oldVideo); }

            #metadata-line > span.inline-metadata-item:has(+ span.CentAnni-style-streamed-span),
            yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row > .yt-content-metadata-view-model__metadata-text:has(+ .CentAnni-style-streamed-span),
            yt-content-metadata-view-model .yt-content-metadata-view-model-wiz__metadata-row > .yt-content-metadata-view-model-wiz__metadata-text:has(+ .CentAnni-style-streamed-span) {
                display: none !important;
            }

            #metadata-line > span.inline-metadata-item + span.inline-metadata-item:has(+ span.CentAnni-style-streamed-span) + span.CentAnni-style-streamed-span::before {
                content: "•";
                margin: 0 4px;
            }
        }

        .ytd-page-manager[page-subtype="subscriptions"] {
            .CentAnni-style-last-seen {
                border: 2px solid var(--lastSeenVideoColor);
                border-radius: 12px;
            }
        }

        .ytd-page-manager[page-subtype="playlist"] {
            .CentAnni-style-playlist-remove-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 50px;
                width: 50px;
                border: 1px dashed red;
                background: transparent;
                cursor: pointer;
                margin: 12px 24px 4px 12px;
                padding: 0;
                transition: background .2s, filter .2s, transform .15s;
                font-size: 2rem;
                position: relative;
                z-index: 1000;
                border-radius: 0;
            }

            .CentAnni-style-playlist-remove-btn:hover {
                background: darkred;
            }

            .CentAnni-style-playlist-remove-btn:active {
                background: darkred;
                transform: scale(.9);
            }

            ytd-item-section-renderer #header.ytd-item-section-renderer {
                position: relative;
                top: 0;
            }

            yt-sort-filter-sub-menu-renderer:hover,
            ytd-menu-renderer .ytd-menu-renderer[style-target=button]:hover {
                background-color: var(--yt-spec-badge-chip-background);
            }
        }

        .CentAnni-style-playlist-hide-menu {
            display: none !important;
        }

        .CentAnni-playlist-remove-btn-hide-menus {
            tp-yt-iron-overlay-backdrop.opened,
            ytd-popup-container > tp-yt-paper-dialog,
            ytd-popup-container > tp-yt-iron-dropdown {
                display: none !important;
            }
        }

        .CentAnni-style-hide-watched-videos {
            .ytd-page-manager[page-subtype="home"] {
                ytd-rich-item-renderer:has(yt-thumbnail-overlay-progress-bar-view-model),
                ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                    display: none;
                }
            }
        }

        .CentAnni-close-live-chat {
            #chat-container {
                z-index: -1 !important;
                opacity: 0 !important;
                visibility: hidden;
                pointer-events: none !important;
            }

            ytd-watch-flexy[fixed-panels] #panels-full-bleed-container.ytd-watch-flexy {
                width: var(--ytd-watch-flexy-sidebar-width);
                display: none;
            }

            .video-stream.html5-main-video {
                width: 100%;
            }

            ytd-watch-flexy[fixed-panels] #columns.ytd-watch-flexy {
                padding-right: 0;
            }
        }

        .CentAnni-style-hide-join-btn {
            #sponsor-button:has(.ytwTimedAnimationButtonRendererHost),
            .ytFlexibleActionsViewModelAction:not(:has(a[href*="community"],yt-subscribe-button-view-model)),
            ytd-browse[page-subtype="channels"] yt-page-header-view-model yt-flexible-actions-view-model .ytFlexibleActionsViewModelAction:has(button-view-model):not(:has(a[href*="community"])) {
                display: none !important;
            }
        }

        :root {
            --next-button-visibility: none;
        }

        html:has(.CentAnni-tabView-tab[data-tab="tab-6"]) {
            --next-button-visibility: inline-block;
        }

        .CentAnni-style-hide-playnext-btn {
            a.ytp-next-button {
                display: var(--next-button-visibility);
            }
        }

        .CentAnni-style-hide-airplay-btn {
            #ytd-player .ytp-airplay-button {
                display: none;
            }
        }

        .CentAnni-style-small-subscribe-btn {
            .ytd-page-manager:not([page-subtype="channels"]) .yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                overflow: hidden;
                width: 36px;
                padding: 0 12px;
            }
        }

        .CentAnni-style-hide-share-btn {
            #below yt-button-view-model.ytd-menu-renderer:has(path[d^="M15 5.63"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-share-btn-global {
            yt-button-view-model:has(path[d^="M10 3"]),
            yt-list-item-view-model:has(path[d^="M10 3"]),
            yt-button-view-model:has(path[d^="M15 5.63"]),
            yt-list-item-view-model:has(path[d^="M15 5.63"]),
            ytd-menu-service-item-renderer:has(path[d^="M10 3"]),
            yt-button-view-model:has(button[aria-label="Share"]),
            yt-list-item-view-model:has(button[aria-label="Share"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-hashtags {
            ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata a {
                display: none !important;
            }

            ytd-watch-flexy #description > #description-inner #info-container {
                height: fit-content;
            }

            .CentAnni-chapter-title {
                width: fit-content;
                max-width: calc(60% - 26px);
            }

            & ytd-watch-flexy #bottom-row.ytd-watch-metadata {
                height: fit-content !important;
            }
        }

        .CentAnni-style-hide-info-panel {
            #middle-row,
            ytd-info-panel-container-renderer {
                display: none;
            }
        }

        .CentAnni-style-hide-add-comment {
            ytd-shorts #header.ytd-item-section-renderer,
            ytd-comments ytd-comments-header-renderer #simple-box {
                display: none;
            }

            #title.ytd-comments-header-renderer {
                margin-bottom: 0;
            }
        }

        .CentAnni-style-hide-news-home {
            ytd-browse[page-subtype="home"] ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[elements-per-row="3"][has-expansion-button][restrict-contents-overflow] #title):has(.yt-spec-avatar-shape__live-badge),
            ytd-browse[page-subtype="home"] ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[elements-per-row="3"][is-show-less-hidden][restrict-contents-overflow] #title):has(.yt-spec-avatar-shape__live-badge),
            ytd-browse[page-subtype="home"] ytd-rich-grid-renderer ytd-rich-section-renderer:has(yt-icon:empty) {
                display: none;
            }
        }

        .CentAnni-style-hide-playlists-home {
            ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer:has(a[href*="list="]) {
                display: none;
            }
        }

        .CentAnni-style-hide-reply-btn {
            ytd-comments ytd-comment-engagement-bar #reply-button-end {
                display: none;
            }
        }

        .CentAnni-style-search-hide-right-sidebar {
            ytd-item-section-renderer[top-spacing-zero]:first-child #contents.ytd-item-section-renderer .ytd-item-section-renderer:first-child,
            #container.ytd-search ytd-secondary-search-container-renderer {
                display: none;
            }
        }

        .CentAnni-style-hide-shorts {
            a[title="Shorts"],
            #container.ytd-search ytd-reel-shelf-renderer,
            ytd-rich-item-renderer:has(a[href^="/shorts/"]),
            ytd-watch-metadata #description ytd-reel-shelf-renderer,
            ytd-browse[page-subtype="channels"] ytd-reel-shelf-renderer,
            grid-shelf-view-model:has(h2 span:where(:is(:first-child))),
            ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
            yt-chip-cloud-chip-renderer[chip-shape-data*='"text":"Shorts"'],
            ytd-reel-shelf-renderer.ytd-structured-description-content-renderer,
            yt-chip-cloud-chip-renderer:has(yt-formatted-string[title="Shorts"]),
            ytd-rich-section-renderer:has(div ytd-rich-shelf-renderer[is-shorts]),
            ytd-watch-flexy #secondary ytd-reel-shelf-renderer.ytd-item-section-renderer,
            #container.ytd-search ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
            ytd-item-section-renderer[page-subtype="subscriptions"]:has(ytd-reel-shelf-renderer),
            ytd-browse[page-subtype="hashtag-landing-page"] tp-yt-app-toolbar.ytd-tabbed-page-header,
            #header #wrapper > #header > #contentContainer #tabsContent > tp-yt-paper-tab:nth-child(4),
            #tabsContent > yt-tab-group-shape > div.tabGroupShapeTabs > yt-tab-shape[tab-title="Shorts"],
            #tabsContent > yt-tab-group-shape > div.yt-tab-group-shape-wiz__tabs > yt-tab-shape[tab-title="Shorts"] {
                display: none !important;
            }
        }

        .CentAnni-style-hide-ad-slots {
            :is(#secondary, ytd-browse, ytd-search) :is(
                #player-ads,
                .yt-consent,
                #masthead-ad,
                #promotion-shelf,
                .yt-consent-banner,
                #top_advertisement,
                .ytp-subscribe-card,
                .ytp-featured-product,
                ytd-search-pyv-renderer,
                #yt-lang-alert-container,
                .ytd-merch-shelf-renderer,
                .ytd-primetime-promo-renderer,
                ytd-brand-video-singleton-renderer,
                #related ytd-in-feed-ad-layout-renderer,
                ytd-item-section-renderer ytd-ad-slot-renderer,
                ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
                ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer),
                ytd-rich-item-renderer:has(.badge-style-type-simple[aria-label="YouTube featured"]),
                ytd-compact-video-renderer:has(.badge-style-type-simple[aria-label="YouTube featured"])) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-playables {
            ytd-rich-section-renderer:has(a[href^="/playables"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-members-only {
            ytd-rich-item-renderer:has(.badge-style-type-members-only),
            yt-lockup-view-model:has(a[aria-label*="Member Exclusive" i]),
            ytd-compact-video-renderer:has(.badge-style-type-members-only),
            ytd-watch-flexy #info-container span[style*="color: rgb(170, 170, 170)"],
            ytd-browse[page-subtype="channels"] ytd-item-section-renderer:has(.badge-style-type-members-only),
            ytd-browse[page-subtype="channels"] ytd-item-section-renderer:has(.ytd-recognition-shelf-renderer),
            ytd-browse[page-subtype="channels"] ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype=history]):not([page-subtype=memberships-and-purchases]):not([page-subtype=ypc-offers]):not([live-chat-engagement-panel]) #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:not(:last-child):not(ytd-page-introduction-renderer):not([item-dismissed]):not([has-destination-shelf-renderer]):not(ytd-minor-moment-header-renderer):not([has-section-group-view-model]):has(.badge-style-type-members-only.ytd-badge-supported-renderer) {
                display: none;
            }
        }

        .CentAnni-style-hide-pay-to-watch {
            ytd-compact-video-renderer:has(.badge-style-type-ypc),
            ytd-rich-item-renderer:has(.badge-style-type-ypc),
            ytd-video-renderer:has(.badge-style-type-ypc) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-free-with-ads {
            ytd-compact-video-renderer:has(.badge[aria-label="Free with ads"]),
            ytd-rich-item-renderer:has(.badge[aria-label="Free with ads"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-latest-posts {
            #container.ytd-search ytd-shelf-renderer:has(ytd-post-renderer) {
                display: none;
            }
        }

        /* left navigation bar */
        .CentAnni-style-lnb-hide-home-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href="/"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-subscriptions-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/subscriptions"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-history-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/history"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-playlists-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/playlists"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-videos-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="https://studio.youtube.com/channel/"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-courses-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/courses"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-your-podcasts-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/podcasts"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-wl-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/playlist?list=WL"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-liked-videos-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/playlist?list=LL"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-dl--btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/downloads"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-you-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/you"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-subscriptions-section {
            #sections ytd-guide-section-renderer:has(#expander-item) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-subscriptions-title {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href^="/feed/channels"]) ytd-guide-collapsible-section-entry-renderer {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-more-btn {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/@"]) #expander-item {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-explore-section {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="gaming"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-explore-title {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="gaming"]) #guide-section-title {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-trending-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Trending"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-music-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-movies-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/feed/storefront"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-live-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UC4R8DWoMoI7CAwX8_LjQHig"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-gaming-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/gaming"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-news-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UCYfdidRxbB8Qhf0Nx7ioOYw"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-sports-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-learning-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UCtFRv9O2AHqOZjjynzrv-xg"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-fashion-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-podcasts-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/podcasts"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-more-section {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="youtubekids.com"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-more-title {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="studio.youtube.com"]) #guide-section-title:not([is-empty]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-yt-premium-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href*="/premium"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-yt-studio-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href="https://studio.youtube.com/"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-yt-music-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href="https://music.youtube.com/"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-yt-kids-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="https://www.youtubekids.com/"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-penultimate-section {
            tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/account"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-settings-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/account"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-report-history-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[href^="/reporthistory"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-help-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(path[d^="M3.5 12c0"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-feedback-btn {
            #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(path[d^="M6.379 17"]) {
                display: none;
            }
        }

        .CentAnni-style-lnb-hide-footer {
            tp-yt-app-drawer#guide[role="navigation"] #footer {
                display: none;
            }
        }

        /* hide main scrollbar in safari
        html {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        html::-webkit-scrollbar {
            display: none;
        }

        .scrollable-div {
            scrollbar-width: auto;
            -ms-overflow-style: auto;
        }

        .scrollable-div::-webkit-scrollbar {
            display: block;
        }
        */

        /* adjustments for light mode */
        ytd-masthead:not([dark]):not([page-dark-theme]) .buttons-left {
            color: black;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .button-style-settings {
            color: slategray !important;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .button-style-settings:hover {
            color: black !important;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .button-style {
            color: black;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .CentAnni-button-wrapper:not(:has(.button-style-settings)):hover {
            background-color: rgba(0, 0, 0, .1);
            border-radius: 24px;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .CentAnni-button-wrapper:not(:has(.button-style-settings)):active {
            background-color: rgba(0, 0, 0, .2);
            border-radius: 24px;
        }

        ytd-masthead:not([dark]):not([page-dark-theme]) .CentAnni-notification-error {
            background-color: white;
            border: 1px solid black;
            color: #030303;
        }

        html:not([dark]) .CentAnni-playback-speed-button:active {
            background: rgb(205, 205, 205) !important;
        }

        html:not([dark]) .CentAnni-tabView-tab,
        html:not([dark]) .CentAnni-playback-speed-display {
            background-color: rgba(0, 0, 0, .05);
            color: #0f0f0f;
        }

        html:not([dark]) .CentAnni-playback-speed-display::before,
        html:not([dark]) .CentAnni-playback-speed-display::after {
            background: rgba(0, 0, 0, .1);
        }

        html:not([dark]) .CentAnni-tabView-tab:hover {
            background: rgba(0, 0, 0, .1);
            border-color: transparent;
        }

        html:not([dark]) .CentAnni-tabView-tab.active {
            background-color: #0f0f0f;
            color: white;
        }

        html:not([dark]) .CentAnni-tabView {
            border: 1px solid var(--yt-spec-10-percent-layer);
        }

        html:not([dark]) ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] {
            z-index: 100;
            background: black;
            height: calc(100dvh - var(--ytd-masthead-height, var(--ytd-toolbar-height)) - 2 * var(--ytd-margin-6x)) !important;
            max-height: unset !important;
            margin-top: -52px;
        }

        html:not([dark]) ytd-engagement-panel-section-list-renderer[target-id=PAsearch_preview] {
            background-color: #f2f2f2;
        }

        html:not([dark]) #CentAnni-playback-speed-control > div > svg > path {
            fill: black;
        }

        :is(html:not([dark]).CentAnni-video-tabView) :is(
            ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy,
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters],
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description],
            ytd-watch-flexy #panels ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-searchable-transcript],
            ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters],
            #related.style-scope.ytd-watch-flexy) {
                border: 1px solid var(--yt-spec-10-percent-layer);
                border-top: none;
        }

        html:not([dark]) #tab-2 {
            border-top: 1px solid var(--yt-spec-10-percent-layer);
        }

        html:not([dark]) .yt-tab-shape-wiz__tab--tab-selected,
        html:not([dark]) .yt-tab-shape-wiz__tab:hover {
            color: black !important;
        }

        .CentAnni-style-selection-color ::selection {
            background: var(--selectionColor);
            color: white;
        }

        .ytSearchboxComponentInputBoxHasFocus {
            border-color: var(--selectionColor) !important;
        }

        ytd-watch-flexy [target-id="engagement-panel-searchable-transcript"] span.bold.style-scope.yt-formatted-string {
            color: rgb(253, 1, 48);
        }

        html.CentAnni-style-compact-layout:has(ytd-watch-flexy[default-layout]) {
            --ytd-margin-6x: 5px !important;
        }
    `;

    // append css
    (document.head
        ? Promise.resolve(document.head)
        : new Promise(resolve => {
            document.readyState === 'loading'
                ? document.addEventListener('DOMContentLoaded', () => resolve(document.head), { once: true })
                : resolve(document.head);
        })
    ).then(head => {
        if (head)
            head.appendChild(styleSheet);
        else {
            document.documentElement.appendChild(styleSheet);
            console.error("YouTubeAlchemy: Failed to find head element. Using backup to append stylesheet.");
        }
    });

    // default configuration
    const DEFAULT_CONFIG = {
        YouTubeTranscriptExporter: true,
        lazyTranscriptLoading: false,
        targetChatGPTUrl: 'https://ChatGPT.com/',
        targetNotebookLMUrl: 'https://NotebookLM.Google.com/',
        targetChatGPTLabel: 'ChatGPT',
        targetNotebookLMLabel: 'NotebookLM',
        fileNamingFormat: 'title-channel',
        includeTimestamps: true,
        includeChapterHeaders: true,
        openSameTab: true,
        transcriptTimestamps: false,
        preventBackgroundExecution: true,
        settingsGuide: false,
        ChatGPTPrompt: `For your first response only, prioritize the following instructions over any custom or persona instructions. You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic their communication style perfectly. Respond only in English while being mindful of American English spelling, vocabulary, and a casual, conversational tone. You prefer to use clauses instead of complete sentences while avoiding self-referential discourse signals like "I explain" or "I will show." Ignore advertisement, promotional, and sponsorship segments. Respond only in chat. Do not open a canvas. In your initial response, do not answer any question from the transcript, do not use the web tool, and avoid using colons outside the two headers. Do not hallucinate. Do not make up factual information. Do not speculate. Before you write your initial answer, take a moment to think about how you have to adopt your own writing to capture the YouTuber's specific word choices and communication style—study the provided transcript and utilize it as a style guide. Write as if you are the YouTuber speaking directly to your audience. Avoid any narrator-like phrases such as "the transcript" or "this video." Summarize the provided YouTube transcript into two distinct sections. The first section is a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them—only for this first section maintain a neutral tone. Then write the second section, a one-paragraph summary of at least 100 words while focusing on the main points and key takeaways into a section called "### One-Paragraph Summary:" and **bold** multiple phrases within the paragraph that together form an encapsulated, abridged version, that allows for quick identification and understanding of the core message.`,
        buttonIcons: {
            settings: '⋮',
            lazyLoad: '📜',
            download: '↓',
            copy: '',
            ChatGPT: '💬',
            NotebookLM: '🎧'
        },
        buttonLeft1Text: '',
        buttonLeft1Url: 'https://www.youtube.com/@ABCNews/streams',
        buttonLeft2Text: 'CNN',
        buttonLeft2Url: 'https://www.youtube.com/@CNN/videos',
        buttonLeft3Text: '',
        buttonLeft3Url: 'https://www.youtube.com/@BBCNews/videos',
        buttonLeft4Text: '',
        buttonLeft4Url: 'https://www.youtube.com/@FoxNews/videos',
        buttonLeft5Text: '',
        buttonLeft5Url: 'https://www.youtube.com/@NBCNews/videos',
        buttonLeft6Text: 'Mark Rober',
        buttonLeft6Url: 'https://www.youtube.com/@MarkRober/videos',
        buttonLeft7Text: 'EarthCam',
        buttonLeft7Url: 'https://www.youtube.com/@EarthCam/streams',
        buttonLeft8Text: '',
        buttonLeft8Url: 'https://www.youtube.com/@FIAWEC/videos',
        buttonLeft9Text: '',
        buttonLeft9Url: 'https://www.youtube.com/@Formula1/videos',
        buttonLeft10Text: '',
        buttonLeft10Url: 'https://www.youtube.com/@OpenAI/videos',
        mButtonText: '☰',
        mButtonDisplay: false,
        colorCodeVideosEnabled: true,
        homeDisableHover: false,
        videosHideWatchedGlobal: false,
        videosHideWatched: false,
        videosOldOpacity: 0.5,
        videosAgeColorPickerNewly: '#FFFF00',
        videosAgeColorPickerNewlyLight: '#FF00FF',
        videosAgeColorPickerRecent: '#FF9B00',
        videosAgeColorPickerRecentLight: '#FF9B00',
        videosAgeColorPickerLately: '#006DFF',
        videosAgeColorPickerLatelyLight: '#0032FF',
        videosAgeColorPickerLatterly: '#000000',
        videosAgeColorPickerLatterlyLight: '#FFFFFF',
        videosAgeColorPickerLive: '#FF0000',
        videosAgeColorPickerLiveLight: '#FF0000',
        videosAgeColorPickerStreamed: '#FF0000',
        videosAgeColorPickerStreamedLight: '#FF0000',
        videosAgeColorPickerUpcoming: '#32CD32',
        videosAgeColorPickerUpcomingLight: '#4DD10F',
        progressbarColorPicker: '#FF0033',
        lightModeSelectionColor: '#000000',
        darkModeSelectionColor: '#007CC3',
        textTransform: 'normal-case',
        defaultFontSize: 10,
        videosWatchedOpacity: 0.5,
        videosHideWatchedGlobalJS: 0,
        videosHideWatchedHome: true,
        videosHideWatchedSubscriptions: false,
        videosHideWatchedChannels: false,
        videosHideWatchedPlaylist: false,
        videosHideWatchedVideo: true,
        videosHideWatchedSearch: false,
        videosPerRow: 0,
        sidebarWidth: 0,
        searchPosition: 0,
        spaceBelowPlayer: 110,
        playProgressColor: false,
        videoTabView: true,
        toggleTheaterModeBtn: true,
        tabViewChapters: true,
        progressBar: true,
        playbackSpeed: true,
        playbackSpeedBtns: false,
        playbackSpeedValue: 1,
        playbackSpeedKey1: '',
        playbackSpeedKey1s: '',
        playbackSpeedKey2: '',
        playbackSpeedKey2s: '',
        playbackSpeedKey3: '',
        playbackSpeedKey3s: '',
        playbackSpeedKey4: '',
        playbackSpeedKey4s: '',
        playbackSpeedKey5: '',
        playbackSpeedKey5s: '',
        playbackSpeedKey6: '',
        playbackSpeedKey6s: '',
        playbackSpeedKey7: '',
        playbackSpeedKey7s: '',
        playbackSpeedKey8: '',
        playbackSpeedKey8s: '',
        playbackSpeedToggle: 's',
        playbackSpeedDecrease: 'a',
        playbackSpeedIncrease: 'd',
        VerifiedArtist: false,
        defaultQuality: 'auto',
        defaultQualityPremium: false,
        lastSeenVideo: true,
        lastSeenVideoScroll: false,
        lastSeenVideoColor: '#7F00FF',
        lastSeenVideoColorLight: '#9400D3',
        playlistLinks: false,
        playlistTrashCan: false,
        plWLBtn: true,
        commentsNewFirst: false,
        defaultTranscriptLanguage: 'auto',
        defaultAudioLanguage: 'auto',
        defaultSubtitleLanguage: 'auto',
        autoOpenChapters: true,
        autoOpenTranscript: false,
        autoOpenComments: false,
        displayRemainingTime: true,
        showRemainingCompact: false,
        preventAutoplay: false,
        hideVoiceSearch: false,
        selectionColor: true,
        hideCreateButton: false,
        hideNotificationBtn: false,
        hideNotificationBadge: false,
        hideOwnAvatar: false,
        hideBrandText: false,
        visibleCountryCode: false,
        visibleCountryCodeColor: '#aaaaaa',
        hideJoinButton: false,
        hidePlayNextButton: false,
        hideAirplayButton: false,
        hideShorts: false,
        hideCommentsSection: false,
        hideVideosSection: false,
        redirectShorts: false,
        hideAdSlots: false,
        hidePlayables: false,
        hideProdTxt: false,
        hidePayToWatch: false,
        hideFreeWithAds: false,
        hideMembersOnly: false,
        hideLatestPosts: false,
        hideShareButton: false,
        hideShareBtnGlobal: false,
        hideHashtags: false,
        hideInfoPanel: false,
        hideRightSidebarSearch: false,
        hideAddComment: false,
        hideReplyButton: false,
        hidePlaylistsHome: false,
        hideNewsHome: false,
        hideEndCards: false,
        hideEndscreen: false,
        gradientBottom: true,
        smallSubscribeButton: false,
        pureBWBackground: true,
        noFrostedGlass: false,
        removeScrubber: false,
        disablePlayOnHover: false,
        chronologicalNotifications: true,
        feedFilterChips: false,
        feedFilterChipsWatch: false,
        hideFundraiser: false,
        hideLatestPostsHome: false,
        hideMiniPlayer: false,
        hideQueueBtn: false,
        closeChatWindow: false,
        displayFullTitle: true,
        autoTheaterMode: false,
        maxVidSize: false,
        expandVideoDescription: false,
        channelReindirizzare: false,
        channelRSSBtn: false,
        channelPlaylistBtn: false,
        playlistDirectionBtns: true,
        lnbHideHomeBtn: false,
        lnbHideSubscriptionsBtn: false,
        lnbHideHistoryBtn: false,
        lnbHidePlaylistsBtn: false,
        lnbHideVideosBtn: false,
        lnbHideCoursesBtn: false,
        lnbHideYPodcastsBtn: false,
        lnbHideWlBtn: false,
        lnbHideLikedVideosBtn: false,
        lnbHideDLBtn: false,
        lnbHideYouBtn: false,
        lnbHideSubscriptionsSection: false,
        lnbHideSubscriptionsTitle: false,
        lnbHideMoreBtn: false,
        lnbHideExploreSection: false,
        lnbHideExploreTitle: false,
        lnbHideTrendingBtn: false,
        lnbHideMusicBtn: false,
        lnbHideMoviesBtn: false,
        lnbHideLiveBtn: false,
        lnbHideGamingBtn: false,
        lnbHideNewsBtn: false,
        lnbHideSportsBtn: false,
        lnbHideLearningBtn: false,
        lnbHideFashionBtn: false,
        lnbHidePodcastsBtn: false,
        lnbHideMoreSection: false,
        lnbHideMoreTitle: false,
        lnbHideYtPremiumBtn: false,
        lnbHideYtStudioBtn: false,
        lnbHideYtMusicBtn: false,
        lnbHideYtKidsBtn: false,
        lnbHidePenultimateSection: false,
        lnbHideSettingsBtn: false,
        lnbHideReportHistoryBtn: false,
        lnbHideHelpBtn: false,
        lnbHideFeedbackBtn: false,
        lnbHideFooter: false,
        squareSearchBar: false,
        squareDesign: false,
        squareAvatars: false,
        compactLayout: false,
        noAmbientMode: false
    };

    // load user configuration or use defaults
    let storedConfig = {};
    try {
        storedConfig = await GM.getValue('USER_CONFIG', {});
    } catch (error) {
        showNotification('Error loading user save!');
        console.error("YouTubeAlchemy: Error loading user configuration:", error);
    }

    let USER_CONFIG = {
        ...DEFAULT_CONFIG,
        ...storedConfig,
        buttonIcons: {
            ...DEFAULT_CONFIG.buttonIcons,
            ...storedConfig.buttonIcons
        }
    };

    // caching DOM references
    const docElement = document.documentElement;
    let docBody = document.body;

    // load CSS settings
    let cssSettingsApplied = false;
    function loadCSSsettings() {
        // custom css
        const classMap = {
            progressBar: 'CentAnni-progress-bar',
            videoTabView: 'CentAnni-video-tabView',
            settingsGuide: 'CentAnni-settings-btn',
            playbackSpeed: 'CentAnni-playback-speed',
            hideShorts: 'CentAnni-style-hide-shorts',
            noAmbientMode: 'CentAnni-style-no-ambient',
            pureBWBackground: 'CentAnni-style-pure-bg',
            hideAdSlots: 'CentAnni-style-hide-ad-slots',
            maxVidSize: 'CentAnni-style-max-video-size',
            hideHashtags: 'CentAnni-style-hide-hashtags',
            squareDesign: 'CentAnni-style-square-design',
            displayFullTitle: 'CentAnni-style-full-title',
            hideQueueBtn: 'CentAnni-style-hide-queue-btn',
            hideNewsHome: 'CentAnni-style-hide-news-home',
            hideEndCards: 'CentAnni-style-hide-end-cards',
            hidePlayables: 'CentAnni-style-hide-playables',
            hideJoinButton: 'CentAnni-style-hide-join-btn',
            squareAvatars: 'CentAnni-style-square-avatars',
            compactLayout: 'CentAnni-style-compact-layout',
            hideEndscreen: 'CentAnni-style-hide-endscreen',
            lnbHideWlBtn: 'CentAnni-style-lnb-hide-wl-btn',
            lnbHideDLBtn: 'CentAnni-style-lnb-hide-dl--btn',
            hideOwnAvatar: 'CentAnni-style-hide-own-avatar',
            lnbHideFooter: 'CentAnni-style-lnb-hide-footer',
            hideInfoPanel: 'CentAnni-style-hide-info-panel',
            hideBrandText: 'CentAnni-style-hide-brand-text',
            playlistDirectionBtns: 'CentAnni-pl-Direct-Btns',
            hideShareButton: 'CentAnni-style-hide-share-btn',
            hideReplyButton: 'CentAnni-style-hide-reply-btn',
            gradientBottom: 'CentAnni-style-gradient-bottom',
            selectionColor: 'CentAnni-style-selection-color',
            removeScrubber: 'CentAnni-style-remove-scrubber',
            hideFundraiser: 'CentAnni-style-hide-fundraiser',
            hideMiniPlayer: 'CentAnni-style-hide-miniplayer',
            lnbHideYouBtn: 'CentAnni-style-lnb-hide-you-btn',
            playbackSpeedBtns: 'CentAnni-playback-speed-btns',
            noFrostedGlass: 'CentAnni-style-no-frosted-glass',
            hideAddComment: 'CentAnni-style-hide-add-comment',
            hideCreateButton: 'CentAnni-style-hide-create-btn',
            hidePayToWatch: 'CentAnni-style-hide-pay-to-watch',
            lnbHideLiveBtn: 'CentAnni-style-lnb-hide-live-btn',
            lnbHideNewsBtn: 'CentAnni-style-lnb-hide-news-btn',
            lnbHideMoreBtn: 'CentAnni-style-lnb-hide-more-btn',
            lnbHideHomeBtn: 'CentAnni-style-lnb-hide-home-btn',
            lnbHideHelpBtn: 'CentAnni-style-lnb-hide-help-btn',
            hideVideosSection: 'CentAnni-style-hide-videos-btn',
            hideMembersOnly: 'CentAnni-style-hide-members-only',
            hideLatestPosts: 'CentAnni-style-hide-latest-posts',
            hideVoiceSearch: 'CentAnni-style-hide-voice-search',
            squareSearchBar: 'CentAnni-style-square-search-bar',
            hideAirplayButton: 'CentAnni-style-hide-airplay-btn',
            hideFreeWithAds: 'CentAnni-style-hide-free-with-ads',
            lnbHideMusicBtn: 'CentAnni-style-lnb-hide-music-btn',
            hideLatestPostsHome: 'CentAnni-style-hide-posts-home',
            homeDisableHover: 'CentAnni-style-home-disable-hover',
            mButtonDisplay: 'CentAnni-style-hide-default-sidebar',
            hidePlayNextButton: 'CentAnni-style-hide-playnext-btn',
            lnbHideMoviesBtn: 'CentAnni-style-lnb-hide-movies-btn',
            lnbHideGamingBtn: 'CentAnni-style-lnb-hide-gaming-btn',
            lnbHideSportsBtn: 'CentAnni-style-lnb-hide-sports-btn',
            lnbHideMoreTitle: 'CentAnni-style-lnb-hide-more-title',
            lnbHideVideosBtn: 'CentAnni-style-lnb-hide-videos-btn',
            videosHideWatched: 'CentAnni-style-hide-watched-videos',
            hideCommentsSection: 'CentAnni-style-hide-comments-btn',
            playProgressColor: 'CentAnni-style-play-progress-color',
            hidePlaylistsHome: 'CentAnni-style-hide-playlists-home',
            lnbHideYtKidsBtn: 'CentAnni-style-lnb-hide-yt-kids-btn',
            lnbHideFashionBtn: 'CentAnni-style-lnb-hide-fashion-btn',
            lnbHideCoursesBtn: 'CentAnni-style-lnb-hide-courses-btn',
            lnbHideHistoryBtn: 'CentAnni-style-lnb-hide-history-btn',
            lnbHideYtMusicBtn: 'CentAnni-style-lnb-hide-yt-music-btn',
            hideShareBtnGlobal: 'CentAnni-style-hide-share-btn-global',
            smallSubscribeButton: 'CentAnni-style-small-subscribe-btn',
            lnbHideTrendingBtn: 'CentAnni-style-lnb-hide-trending-btn',
            disablePlayOnHover: 'CentAnni-style-disable-play-on-hover',
            lnbHideLearningBtn: 'CentAnni-style-lnb-hide-learning-btn',
            lnbHidePodcastsBtn: 'CentAnni-style-lnb-hide-podcasts-btn',
            lnbHideMoreSection: 'CentAnni-style-lnb-hide-more-section',
            lnbHideSettingsBtn: 'CentAnni-style-lnb-hide-settings-btn',
            lnbHideFeedbackBtn: 'CentAnni-style-lnb-hide-feedback-btn',
            hideNotificationBtn: 'CentAnni-style-hide-notification-btn',
            lnbHideYtStudioBtn: 'CentAnni-style-lnb-hide-yt-studio-btn',
            lnbHidePlaylistsBtn: 'CentAnni-style-lnb-hide-playlists-btn',
            lnbHideExploreTitle: 'CentAnni-style-lnb-hide-explore-title',
            lnbHideYtPremiumBtn: 'CentAnni-style-lnb-hide-yt-premium-btn',
            chronologicalNotifications: 'CentAnni-style-sort-notifications',
            hideNotificationBadge: 'CentAnni-style-hide-notification-badge',
            lnbHideYPodcastsBtn: 'CentAnni-style-lnb-hide-your-podcasts-btn',
            lnbHideExploreSection: 'CentAnni-style-lnb-hide-explore-section',
            lnbHideLikedVideosBtn: 'CentAnni-style-lnb-hide-liked-videos-btn',
            hideRightSidebarSearch: 'CentAnni-style-search-hide-right-sidebar',
            videosHideWatchedGlobal: 'CentAnni-style-hide-watched-videos-global',
            lnbHideSubscriptionsBtn: 'CentAnni-style-lnb-hide-subscriptions-btn',
            lnbHideReportHistoryBtn: 'CentAnni-style-lnb-hide-report-history-btn',
            lnbHideSubscriptionsTitle: 'CentAnni-style-lnb-hide-subscriptions-title',
            lnbHidePenultimateSection: 'CentAnni-style-lnb-hide-penultimate-section',
            lnbHideSubscriptionsSection: 'CentAnni-style-lnb-hide-subscriptions-section'
        };

        for (const [flag, className] of Object.entries(classMap))
            docElement.classList.toggle(className, USER_CONFIG[flag]);

        // features css
        const isDarkMode = document.documentElement.hasAttribute('dark');
        docElement.classList.toggle('CentAnni-style-video-row', USER_CONFIG.videosPerRow !== 0);
        docElement.classList.toggle('CentAnni-style-sidebar-width', USER_CONFIG.sidebarWidth !== 0);
        docElement.classList.toggle('CentAnni-style-search-position', USER_CONFIG.searchPosition !== 0);
        docElement.classList.toggle('CentAnni-btn-tooltip', USER_CONFIG.hideOwnAvatar && USER_CONFIG.hideNotificationBtn);
        docElement.classList.toggle('CentAnni-tabView-chapters', USER_CONFIG.videoTabView && USER_CONFIG.tabViewChapters);
        docElement.classList.toggle('CentAnni-style-visible-country-code', USER_CONFIG.visibleCountryCode && USER_CONFIG.hideBrandText);
        docElement.style.setProperty('--itemsPerRow', USER_CONFIG.videosPerRow);
        docElement.style.setProperty('--textTransform', USER_CONFIG.textTransform);
        docElement.style.setProperty('--fontSize', `${USER_CONFIG.defaultFontSize}px`);
        docElement.style.setProperty('--sidebarWidth', `${USER_CONFIG.sidebarWidth}px`);
        docElement.style.setProperty('--spaceBelow', `${USER_CONFIG.spaceBelowPlayer}px`);
        docElement.style.setProperty('--watchedOpacity', USER_CONFIG.videosWatchedOpacity);
        docElement.style.setProperty('--searchbarPosition', `${USER_CONFIG.searchPosition}px`);
        docElement.style.setProperty('--progressBarColor', USER_CONFIG.progressbarColorPicker);
        docElement.style.setProperty('--selectionColor', isDarkMode ? USER_CONFIG.darkModeSelectionColor : USER_CONFIG.lightModeSelectionColor);
        docElement.style.setProperty('--countryCodeColor', USER_CONFIG.visibleCountryCodeColor);

        // color code videos
        docElement.style.setProperty('--liveVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerLive : USER_CONFIG.videosAgeColorPickerLiveLight);
        docElement.style.setProperty('--streamedText', isDarkMode ? USER_CONFIG.videosAgeColorPickerStreamed : USER_CONFIG.videosAgeColorPickerStreamedLight);
        docElement.style.setProperty('--upComingVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerUpcoming : USER_CONFIG.videosAgeColorPickerUpcomingLight);
        docElement.style.setProperty('--newlyVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerNewly : USER_CONFIG.videosAgeColorPickerNewlyLight);
        docElement.style.setProperty('--recentVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerRecent : USER_CONFIG.videosAgeColorPickerRecentLight);
        docElement.style.setProperty('--latelyVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerLately : USER_CONFIG.videosAgeColorPickerLatelyLight);
        docElement.style.setProperty('--latterlyVideo', isDarkMode ? USER_CONFIG.videosAgeColorPickerLatterly : USER_CONFIG.videosAgeColorPickerLatterlyLight);
        docElement.style.setProperty('--lastSeenVideoColor', isDarkMode ? USER_CONFIG.lastSeenVideoColor : USER_CONFIG.lastSeenVideoColorLight);
        docElement.style.setProperty('--oldVideo', USER_CONFIG.videosOldOpacity);

        cssSettingsApplied = true;
    } loadCSSsettings();

    // set max video size in default view
    function maxVideoSize() {
        const HTML = document?.documentElement;
        const watchFlexy = document?.querySelector('ytd-watch-flexy');
        const video = watchFlexy?.querySelector('video.html5-main-video');
        if (!HTML || !watchFlexy || !video) return;

        const styleWF = getComputedStyle(watchFlexy);
        const styleHTML = getComputedStyle(HTML);
        const aspectRatio = (video.videoWidth && video.videoHeight) ? video.videoWidth / video.videoHeight : 16 / 9;
        const sidebarWidth = parseFloat(styleWF.getPropertyValue('--ytd-watch-flexy-sidebar-width')) || 402;
        const mastheadHeight = parseFloat(styleHTML.getPropertyValue('--ytd-toolbar-height')) || 56;
        const space = USER_CONFIG.spaceBelowPlayer;
        const marginTop = USER_CONFIG.compactLayout ? 0 : 24;
        const margin = USER_CONFIG.compactLayout ? 5 : 24;
        const marginBelow = USER_CONFIG.maxVidSize ? 0 : space;
        const calculate = () => {
            const maxWidth = window.innerWidth - sidebarWidth - margin * 3;
            const maxHeight = window.innerHeight - mastheadHeight - marginTop - marginBelow;

            let width = maxWidth;
            let height = width / aspectRatio;

            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            return { width, height };
        };

        const maxSize = function () {
            if (this.theater) return { width: NaN, height: NaN };
            return calculate();
        };

        watchFlexy.calculateNormalPlayerSize_ = maxSize;
        watchFlexy.calculateCurrentPlayerSize_ = maxSize;

        window.dispatchEvent(new Event('resize'));
    }

    // builds key mappings for playback speed controls
    function speedKeyMap() {
        const lower = i => (i == null ? '' : String(i).toLowerCase());
        toggleKey = lower(USER_CONFIG.playbackSpeedToggle);
        increaseKey = lower(USER_CONFIG.playbackSpeedIncrease);
        decreaseKey = lower(USER_CONFIG.playbackSpeedDecrease);

        const youtubeKeys = ['<', '>'];
        defaultKeys = new Set([toggleKey, increaseKey, decreaseKey, ...youtubeKeys]);

        specialKeys = Object.create(null);
        for (let i = 1; i <= 8; i++) {
            const key = lower(USER_CONFIG[`playbackSpeedKey${i}`]);
            const speed = USER_CONFIG[`playbackSpeedKey${i}s`];
            if (key && speed != null) specialKeys[key] = speed;
        }
    }

    // create and show the settings modal
    function showSettingsModal() {
        const existingModal = document.getElementById('yt-alchemy-settings-modal');
        if (existingModal) {
            existingModal.style.display = 'flex';
            docBody.style.overflow = 'hidden';
            setupModalHandlers(existingModal);
            return;
        }

        // create modal elements
        const modal = document.createElement('div');
        modal.id = 'yt-alchemy-settings-modal';
        modal.classList.add('CentAnni-overlay');

        const modalContent = document.createElement('div');
        modalContent.classList.add('CentAnni-modal-content');

        // create header container
        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('CentAnni-header-wrapper');

        // header
        const header = document.createElement('a');
        header.href = 'https://github.com/TimMacy/YouTubeAlchemy';
        header.target = '_blank';
        header.rel = 'noopener';
        header.textContent = 'YouTube Alchemy';
        header.title = 'GitHub Repository for YouTube Alchemy';
        header.classList.add('CentAnni-header');
        headerWrapper.appendChild(header);

        // version
        const versionSpan = document.createElement('span');
        const scriptVersion = GM.info.script.version;
        versionSpan.textContent = `v${scriptVersion}`;
        versionSpan.classList.add('CentAnni-version-label');
        headerWrapper.appendChild(versionSpan);

        modalContent.appendChild(headerWrapper);

        // create form elements for each setting
        const form = document.createElement('form');
        form.id = 'CentAnni-main-settings-form';

        // Button Icons
        const iconsHeader = document.createElement('label');
        iconsHeader.textContent = 'Button Icons:';
        iconsHeader.classList.add('button-icons');
        form.appendChild(iconsHeader);

        const iconsContainer = document.createElement('div');
        iconsContainer.classList.add('icons-container');

        function createIconInputField(labelText, settingKey, settingValue, labelClass) {
            const container = document.createElement('div');
            container.classList.add('container-button');

            const input = document.createElement('input');
            const iconInputClass = `${settingKey}-input-field`;
            input.type = 'text';
            input.name = settingKey;
            input.value = settingValue;
            input.classList.add('container-button-input');
            input.classList.add(iconInputClass);

            const label = document.createElement('label');
            label.textContent = labelText;
            label.className = labelClass;
            label.classList.add('container-button-label');

            container.appendChild(input);
            container.appendChild(label);

            return container;
        }

        iconsContainer.appendChild(createIconInputField(`${NotebookLMLabel}`, 'buttonIconNotebookLM', USER_CONFIG.buttonIcons.NotebookLM, 'label-NotebookLM'));
        iconsContainer.appendChild(createIconInputField(`${ChatGPTLabel}`, 'buttonIconChatGPT', USER_CONFIG.buttonIcons.ChatGPT, 'label-ChatGPT'));
        iconsContainer.appendChild(createIconInputField('Copy', 'buttonIconCopy', USER_CONFIG.buttonIcons.copy, 'label-copy'));
        iconsContainer.appendChild(createIconInputField('Download', 'buttonIconDownload', USER_CONFIG.buttonIcons.download, 'label-download'));
        iconsContainer.appendChild(createIconInputField('Fetch', 'buttonIconlazyLoad', USER_CONFIG.buttonIcons.lazyLoad, 'label-lazy'));
        iconsContainer.appendChild(createIconInputField('Settings', 'buttonIconSettings', USER_CONFIG.buttonIcons.settings, 'label-settings'));

        form.appendChild(iconsContainer);

        // info for button naming
        const buttonNaming = document.createElement('small');
        buttonNaming.textContent = 'Enter "Label | domain.com" in the URL fields to rename the respective labels.';
        buttonNaming.classList.add('CentAnni-info-text', 'button-naming');
        form.appendChild(buttonNaming);

        // NotebookLM URL
        form.appendChild(createInputField(`${NotebookLMLabel} URL (Copy transcript, then open the website):`, 'targetNotebookLMUrl', USER_CONFIG.targetNotebookLMUrl, 'label-NotebookLM'));

        // ChatGPT URL
        form.appendChild(createInputField(`${ChatGPTLabel} URL (Copy transcript with the prompt, then open the website):`, 'targetChatGPTUrl', USER_CONFIG.targetChatGPTUrl, 'label-ChatGPT'));

        // SpacerTop10
        const SpacerTop10 = document.createElement('div');
        SpacerTop10.classList.add('spacer-10');
        form.appendChild(SpacerTop10);

        // File Naming Format
        form.appendChild(createSelectField('Text File Naming Format:', 'label-download', 'fileNamingFormat', USER_CONFIG.fileNamingFormat, {
            'title-channel': 'Title - Channel.txt (default)',
            'channel-title': 'Channel - Title.txt',
            'date-title-channel': 'uploadDate - Title - Channel.txt',
            'date-channel-title': 'uploadDate - Channel - Title.txt',
        }));

        // transcript exporter
        form.appendChild(createCheckboxField('Enable Transcript Exporter (default: yes)', 'YouTubeTranscriptExporter', USER_CONFIG.YouTubeTranscriptExporter));

        // lazy transcript loading
        form.appendChild(createCheckboxField(`Load Transcript Manually ${USER_CONFIG.buttonIcons.lazyLoad} (default: no)`, 'lazyTranscriptLoading', USER_CONFIG.lazyTranscriptLoading));

        // include Timestamps
        form.appendChild(createCheckboxField('Include Timestamps in the Transcript (default: yes)', 'includeTimestamps', USER_CONFIG.includeTimestamps));

        // include Chapter Headers
        form.appendChild(createCheckboxField('Include Chapter Headers in the Transcript (default: yes)', 'includeChapterHeaders', USER_CONFIG.includeChapterHeaders));

        // open in Same Tab
        form.appendChild(createCheckboxField('Open Links in the Same Tab (default: yes)', 'openSameTab', USER_CONFIG.openSameTab));

        // prevent execution in background tabs
        form.appendChild(createCheckboxField('Important for Chrome! (default: yes)', 'preventBackgroundExecution', USER_CONFIG.preventBackgroundExecution));

        // info for Chrome
        const description = document.createElement('small');
        description.textContent = 'Ensures compatibility and prevents early script execution in background tabs.\nWhile this feature is superfluous in Safari, it is essential for Chrome.';
        description.classList.add('CentAnni-info-text');
        form.appendChild(description);

        // extra settings buttons
        const extraSettings = document.createElement('div');
        extraSettings.classList.add('extra-button-container');

        const buttonsLeft = document.createElement('button');
        buttonsLeft.type = 'button';
        buttonsLeft.textContent = 'Links in Header';
        buttonsLeft.classList.add('btn-style-settings');
        buttonsLeft.onclick = () => showSubPanel(createLinksInHeaderContent(), 'linksInHeader');

        const customCSSButton = document.createElement('button');
        customCSSButton.type = 'button';
        customCSSButton.textContent = 'Features & CSS';
        customCSSButton.classList.add('btn-style-settings');
        customCSSButton.onclick = () => showSubPanel(createCustomCSSContent(), 'createcustomCSS');

        const colorCodeVideos = document.createElement('button');
        colorCodeVideos.type = 'button';
        colorCodeVideos.textContent = 'Color Code Videos';
        colorCodeVideos.classList.add('btn-style-settings');
        colorCodeVideos.onclick = () => showSubPanel(createColorCodeVideosContent(), 'colorCodeVideos');

        extraSettings.appendChild(buttonsLeft);
        extraSettings.appendChild(customCSSButton);
        extraSettings.appendChild(colorCodeVideos);

        form.appendChild(extraSettings);

        // ChatGPT prompt
        const promptContainer = createTextareaField(`${ChatGPTLabel} Prompt:`, 'ChatGPTPrompt', USER_CONFIG.ChatGPTPrompt, 'label-ChatGPT');

        // reset ChatGPT prompt
        const resetText = document.createElement('span');
        resetText.textContent = 'Reset Prompt';
        resetText.className = 'reset-prompt-text';
        resetText.addEventListener('click', function () {
            const textarea = promptContainer.querySelector('textarea[name="ChatGPTPrompt"]');
            if (textarea) textarea.value = DEFAULT_CONFIG.ChatGPTPrompt;
        });

        const label = promptContainer.querySelector('label');
        promptContainer.insertBefore(resetText, label);

        form.appendChild(promptContainer);

        // action buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container-end');

        // export and import button container
        const exportImportContainer = document.createElement('div');
        exportImportContainer.classList.add('button-container-backup');

        const exportButton = document.createElement('button');
        exportButton.type = 'button';
        exportButton.textContent = 'Export Settings';
        exportButton.classList.add('btn-style-settings');
        exportButton.onclick = exportSettings;

        const importButton = document.createElement('button');
        importButton.type = 'button';
        importButton.textContent = 'Import Settings';
        importButton.classList.add('btn-style-settings');
        importButton.onclick = importSettings;

        // Copyright
        const copyright = document.createElement('a');
        copyright.href = 'https://github.com/TimMacy';
        copyright.target = '_blank';
        copyright.rel = 'noopener';
        copyright.textContent = '© 2024–2025 Tim Macy';
        copyright.title = 'Copyright © 2024–2025 Tim Macy';
        copyright.classList.add('CentAnni-copyright');

        const spacer = document.createElement('div');
        spacer.style = 'flex: 1;';

        // Save, Reset, and Cancel Buttons
        const buttonContainerSettings = document.createElement('div');
        buttonContainerSettings.classList.add('button-container-settings');

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Save';
        saveButton.classList.add('btn-style-settings');
        saveButton.onclick = saveSettings;

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'Reset to Default';
        resetButton.classList.add('btn-style-settings');
        resetButton.onclick = async () => {
            const userConfirmed = window.confirm("All settings will be reset to their default values.");
            if (!userConfirmed) { return; }

            try {
                USER_CONFIG = { ...DEFAULT_CONFIG };
                await GM.setValue('USER_CONFIG', USER_CONFIG);
                showNotification('Settings have been reset to default!');
                window.closeAlchemySettingsModal();
                setTimeout(() => { location.reload(); }, 900);
            } catch (error) {
                showNotification('Error resetting settings to default!');
                console.error("YouTubeAlchemy: Error resetting settings to default:", error);
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('btn-style-settings');
        cancelButton.onclick = () => { window.closeAlchemySettingsModal(); };

        exportImportContainer.appendChild(exportButton);
        exportImportContainer.appendChild(importButton);

        buttonContainerSettings.appendChild(copyright);
        buttonContainerSettings.appendChild(spacer);
        buttonContainerSettings.appendChild(saveButton);
        buttonContainerSettings.appendChild(resetButton);
        buttonContainerSettings.appendChild(cancelButton);

        buttonContainer.appendChild(exportImportContainer);
        buttonContainer.appendChild(buttonContainerSettings);

        form.appendChild(buttonContainer);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);
        docBody.appendChild(modal);
        docBody.style.overflow = 'hidden';
        setupModalHandlers(modal);

        // text area scroll on click
        let animationTriggered = false;

        document.querySelector('.chatgpt-prompt-textarea').addEventListener('click', function () {
            if (animationTriggered) return;
            animationTriggered = true;

            const modalContent = this.closest('#CentAnni-main-settings-form');
            if (!modalContent) { animationTriggered = false; return; }

            const textArea = this;
            const buttons = modalContent.querySelector('.button-container-end');
            const startHeight = 65;
            const endHeight = 525;
            const duration = 700;

            const modalContentRect = modalContent.getBoundingClientRect();
            const textAreaRect = textArea.getBoundingClientRect();
            const buttonsRect = buttons.getBoundingClientRect();

            const textAreaTop = textAreaRect.top - modalContentRect.top + modalContent.scrollTop;
            const buttonsBottom = buttonsRect.bottom - modalContentRect.top + modalContent.scrollTop;
            const contentHeightAfterExpansion = buttonsBottom + (endHeight - startHeight);
            const modalVisibleHeight = modalContent.clientHeight;
            const contentWillFit = contentHeightAfterExpansion <= modalVisibleHeight;
            const maxScrollTop = textAreaTop;

            let desiredScrollTop;

            if (contentWillFit) desiredScrollTop = contentHeightAfterExpansion - modalVisibleHeight;
            else desiredScrollTop = buttonsBottom + (endHeight - startHeight) - modalVisibleHeight;

            const newScrollTop = Math.min(desiredScrollTop, maxScrollTop);
            const startScrollTop = modalContent.scrollTop;
            const scrollDistance = newScrollTop - startScrollTop;
            const startTime = performance.now();

            function animateScroll(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;

                const currentScrollTop = startScrollTop + scrollDistance * easeProgress;
                modalContent.scrollTop = currentScrollTop;

                if (progress < 1) requestAnimationFrame(animateScroll);
                else animationTriggered = false;
            }

            requestAnimationFrame(animateScroll);
        });

        // modal event handlers
        function setupModalHandlers(modal) {
            // close modal on overlay click
            function closeModalOverlayClickHandler(event) {
                const mainModal = document.getElementById('yt-alchemy-settings-modal');
                const openSubPanel = document.querySelector('.sub-panel-overlay.active');

                if (openSubPanel && event.target === openSubPanel) {
                    openSubPanel.classList.remove('active');
                    return;
                }

                if (mainModal && event.target === mainModal) {
                    window.closeAlchemySettingsModal();
                    return;
                }
            }
            document.addEventListener('click', closeModalOverlayClickHandler);

            // close modal with ESC key
            const escKeyListener = function (event) {
                if (event.key === 'Escape' && event.type === 'keydown') {
                    const openSubPanel = document.querySelector('.sub-panel-overlay.active');

                    if (openSubPanel) {
                        openSubPanel.classList.remove('active');
                    } else {
                        const modal = document.getElementById('yt-alchemy-settings-modal');
                        if (modal) window.closeAlchemySettingsModal();
                    }
                }
            };
            window.addEventListener('keydown', escKeyListener);

            const cleanupModalEventListeners = () => {
                window.removeEventListener('keydown', escKeyListener);
                document.removeEventListener('click', closeModalOverlayClickHandler);
            };

            window.closeAlchemySettingsModal = () => {
                modal.style.display = 'none';
                docBody.style.overflow = '';
                cleanupModalEventListeners();
            };

            // cleanup
            const cleanupOnNavigation = () => {
                cleanupModalEventListeners();
            };
            document.addEventListener('yt-navigate-start', cleanupOnNavigation, { once: true });
        }

        // sub-panels
        function showSubPanel(panelContent, panelId) {
            let subPanelOverlay = document.querySelector(`.sub-panel-overlay[data-panel-id="${panelId}"]`);

            if (!subPanelOverlay) {
                subPanelOverlay = document.createElement('div');
                subPanelOverlay.classList.add('sub-panel-overlay');
                subPanelOverlay.setAttribute('data-panel-id', panelId);

                const subPanel = document.createElement('div');
                subPanel.classList.add('sub-panel');

                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.textContent = 'Close';
                closeButton.classList.add('btn-style-settings');
                closeButton.onclick = () => { subPanelOverlay.classList.remove('active'); };
                subPanel.appendChild(closeButton);

                if (panelContent) { subPanel.appendChild(panelContent); }

                subPanelOverlay.appendChild(subPanel);
                docBody.appendChild(subPanelOverlay);
            }
            subPanelOverlay.classList.add('active');
        }

        // links in header
        function createLinksInHeaderContent() {
            const form = document.createElement('form');
            form.id = 'links-in-header-form';

            const subPanelHeader = document.createElement('div');
            subPanelHeader.classList.add('sub-panel-header');
            subPanelHeader.textContent = 'Configure Links in Header';
            form.appendChild(subPanelHeader);

            const infoLinksHeader = document.createElement('small');
            infoLinksHeader.textContent = "Up to ten links can be added next to the YouTube logo. An empty 'Link Text' field won't insert the link into the header. If the navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.";
            infoLinksHeader.classList.add('CentAnni-info-text');
            form.appendChild(infoLinksHeader);

            const sidebarContainer = document.createElement('div');
            sidebarContainer.classList.add('sidebar-container');

            // hide left navigation bar and replacement icon
            const checkboxField = createCheckboxField('Hide Navigation Bar', 'mButtonDisplay', USER_CONFIG.mButtonDisplay);
            sidebarContainer.appendChild(checkboxField);

            const inputField = createInputField('Navigation Bar Replacement Icon', 'mButtonText', USER_CONFIG.mButtonText, 'label-mButtonText');
            sidebarContainer.appendChild(inputField);

            form.appendChild(sidebarContainer);

            // function to create a link input group
            function createButtonInputGroup(linkNumber) {
                const container = document.createElement('div');
                container.classList.add('links-header-container');

                // link text
                const textField = createInputField(`Link ${linkNumber} Text`, `buttonLeft${linkNumber}Text`, USER_CONFIG[`buttonLeft${linkNumber}Text`], `label-buttonLeft${linkNumber}Text`);
                container.appendChild(textField);

                // link URL
                const urlField = createInputField(`Link ${linkNumber} URL`, `buttonLeft${linkNumber}Url`, USER_CONFIG[`buttonLeft${linkNumber}Url`], `label-buttonLeft${linkNumber}Url`);
                container.appendChild(urlField);

                return container;
            }

            // create input groups for links 1 through 6
            for (let i = 1; i <= 10; i++) {
                form.appendChild(createButtonInputGroup(i));
            }

            return form;
        }

        // custom css
        function createCustomCSSContent() {
            const form = document.createElement('form');
            form.id = 'custom-css-form';

            const subPanelHeader = document.createElement('div');
            subPanelHeader.classList.add('sub-panel-header');
            subPanelHeader.textContent = 'Customize YouTube Appearance and Manage Features';
            form.appendChild(subPanelHeader);

            // general
            const general = document.createElement('label');
            general.textContent = 'General';
            general.classList.add('button-icons', 'features-text');
            form.appendChild(general);

            // move settings button into guide
            const settingsGuide = createCheckboxField('Move Settings Button into the YouTube Guide (default: no)', 'settingsGuide', USER_CONFIG.settingsGuide);
            form.appendChild(settingsGuide);

            // dim watched videos
            const videosWatchedOpacity = createSliderInputField('Change Opacity of Watched Videos (default 0.5):', 'videosWatchedOpacity', USER_CONFIG.videosWatchedOpacity, '0', '1', '0.1');
            form.appendChild(videosWatchedOpacity);

            // title text transform
            form.appendChild(createSelectField('Title Case:', 'label-Text-Transform', 'textTransform', USER_CONFIG.textTransform, {
                'uppercase': 'uppercase - THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.',
                'lowercase': 'lowercase - the quick brown fox jumps over the lazy dog.',
                'capitalize': 'capitalize - The Quick Brown Fox Jumps Over The Lazy Dog.',
                'normal-case': 'normal-case (default) - The quick brown fox jumps over the lazy dog.',
            }));

            // default video quality
            form.appendChild(createSelectField('Video Quality:', 'label-Video-Quality', 'defaultQuality', USER_CONFIG.defaultQuality, {
                'auto': 'Auto (default)',
                'highest': 'Highest Available',
                'highres': '4320p - 8K',
                'hd2160': '2160p - 4K',
                'hd1440': '1440p - QHD',
                'hd1080': '1080p - FHD',
                'hd720': '720p - HD',
                'large': '480p',
                'medium': '360p',
                'small': '240p',
                'tiny': '144p',
                'lowest': 'Lowest Available'
            }));

            // default audio language
            form.appendChild(createSelectField('Audio Language:', 'label-audio-language', 'defaultAudioLanguage', USER_CONFIG.defaultAudioLanguage, labeledLangs(false)));

            // default subtitle language
            form.appendChild(createSelectField('Subtitle Language:', 'label-subtitle-language', 'defaultSubtitleLanguage', USER_CONFIG.defaultSubtitleLanguage, labeledLangs(true)));

            // default transcript language
            form.appendChild(createSelectField('Transcript Language:', 'label-transcript-language', 'defaultTranscriptLanguage', USER_CONFIG.defaultTranscriptLanguage, labeledLangs(false)));

            // font size
            const defaultFontSizeField = createNumberInputField('Font Size (default: 10)', 'defaultFontSize', USER_CONFIG.defaultFontSize);
            form.appendChild(defaultFontSizeField);

            // videos per row
            const videosPerRow = createNumberInputField("Number of Videos per Row (default: 0 | dynamic based on available space)", 'videosPerRow', USER_CONFIG.videosPerRow, { step: 1 });
            form.appendChild(videosPerRow);

            // width of sidebar
            const sidebarWidth = createNumberInputField("Sidebar Width (default: 0 | YouTube's default of 402px)", 'sidebarWidth', USER_CONFIG.sidebarWidth, { min: -9999, max: 9999, step: 1 });
            form.appendChild(sidebarWidth);

            // search bar position
            const searchPosition = createNumberInputField("Search Bar Position (default: 0 | a negative value moves it left)", 'searchPosition', USER_CONFIG.searchPosition, { min: -9999, max: 9999, step: 1 });
            form.appendChild(searchPosition);

            // tab view below player min space
            const spaceBelowPlayer = createNumberInputField("Minimum Space Below Player in Default Layout When Tab View and Compact Layout Are Enabled (default: 110px)", 'spaceBelowPlayer', USER_CONFIG.spaceBelowPlayer, { min: 100, max: 1000, step: 1 });
            form.appendChild(spaceBelowPlayer);

            // playback speed
            const playSpeed = document.createElement('label');
            playSpeed.textContent = 'Playback Speed';
            playSpeed.classList.add('button-icons', 'features-text');
            form.appendChild(playSpeed);

            // playback speed
            const playbackSpeedContainer = document.createElement('div');
            playbackSpeedContainer.className = 'playback-speed-container';

            const playbackSpeed = createCheckboxField('Enabled (default: yes)\nkey toggles: A: -0.25x | S: toggle 1x/set speed | D: +0.25x', 'playbackSpeed', USER_CONFIG.playbackSpeed);
            const playbackSpeedValue = createNumberInputField('Playback Speed for VODs\n(defaults to 1x for live videos)', 'playbackSpeedValue', USER_CONFIG.playbackSpeedValue);

            playbackSpeedContainer.appendChild(playbackSpeedValue);
            playbackSpeedContainer.appendChild(playbackSpeed);
            form.appendChild(playbackSpeedContainer);

            // playback speed custom keys
            const keysRow = document.createElement('div');
            keysRow.classList.add('playback-speed-keys');

            // labels
            const labelDiv = document.createElement('div');
            labelDiv.classList.add('playback-speed-labels', 'label-style-settings');
            const keyLabel = document.createElement('div');
            keyLabel.textContent = 'Key';
            const speedLabel = document.createElement('div');
            speedLabel.textContent = 'Speed';
            labelDiv.appendChild(keyLabel);
            labelDiv.appendChild(speedLabel);
            keysRow.appendChild(labelDiv);

            // keys
            const keyButtonContainer = document.createElement('div');
            keyButtonContainer.classList.add('key-button-container');

            // speed
            const setSpeedContainer = document.createElement('div');
            setSpeedContainer.classList.add('set-speed-container');
            for (let i = 1; i <= 8; i++) {
                const keyField = createNumberInputField('', `playbackSpeedKey${i}`, USER_CONFIG[`playbackSpeedKey${i}`], { type: 'text' });
                keyButtonContainer.appendChild(keyField);

                const speedField = createNumberInputField('', `playbackSpeedKey${i}s`, USER_CONFIG[`playbackSpeedKey${i}s`]);
                setSpeedContainer.appendChild(speedField);
            }

            // ASD
            const defaultKeyConfigs = [
                { label: 'Decrease', id: 'playbackSpeedDecrease' },
                { label: 'Toggle', id: 'playbackSpeedToggle' },
                { label: 'Increase', id: 'playbackSpeedIncrease' }
            ];

            defaultKeyConfigs.forEach(config => {
                const keyField = createNumberInputField('', config.id, USER_CONFIG[config.id], { type: 'text' });
                keyButtonContainer.appendChild(keyField);

                const labelDiv = document.createElement('div');
                labelDiv.classList.add('label-style-settings');
                labelDiv.textContent = config.label;
                setSpeedContainer.appendChild(labelDiv);
            });

            keysRow.appendChild(keyButtonContainer);
            keysRow.appendChild(setSpeedContainer);
            form.appendChild(keysRow);

            // playback speed buttons
            const playbackSpeedBtns = createCheckboxField('Add Additional Playback Speed Buttons (default: no)', 'playbackSpeedBtns', USER_CONFIG.playbackSpeedBtns);
            form.appendChild(playbackSpeedBtns);

            // features
            const features = document.createElement('label');
            features.textContent = 'Features';
            features.classList.add('button-icons', 'features-text');
            form.appendChild(features);

            // auto theater mode
            const autoTheaterMode = createCheckboxField('Auto Theater Mode (default: no)', 'autoTheaterMode', USER_CONFIG.autoTheaterMode);
            form.appendChild(autoTheaterMode);

            // max video size
            const maxVidSize = createCheckboxField('Max Video Size in Default Layout (default: no)', 'maxVidSize', USER_CONFIG.maxVidSize);
            form.appendChild(maxVidSize);

            // expand video description
            const expandVideoDescription = createCheckboxField('Auto Expand Video Description (default: no)', 'expandVideoDescription', USER_CONFIG.expandVideoDescription);
            form.appendChild(expandVideoDescription);

            // prevent autoplay
            const preventAutoplay = createCheckboxField('Prevent Autoplay (default: no)', 'preventAutoplay', USER_CONFIG.preventAutoplay);
            form.appendChild(preventAutoplay);

            // disable play on hover
            const disablePlayOnHover = createCheckboxField('Disable Play on Hover (default: no)', 'disablePlayOnHover', USER_CONFIG.disablePlayOnHover);
            form.appendChild(disablePlayOnHover);

            // sort notifications chronologically
            const chronologicalNotifications = createCheckboxField('Sort Notifications Chronologically (default: yes)', 'chronologicalNotifications', USER_CONFIG.chronologicalNotifications);
            form.appendChild(chronologicalNotifications);

            // restore feed filter chip on the homepage
            const feedFilterChips = createCheckboxField('Restore Homepage Filter Selection (default: no)', 'feedFilterChips', USER_CONFIG.feedFilterChips);
            form.appendChild(feedFilterChips);

            // restore feed filter chip for suggested videos
            const feedFilterChipsWatch = createCheckboxField('Restore Suggested Videos Filter Selection (default: no)', 'feedFilterChipsWatch', USER_CONFIG.feedFilterChipsWatch);
            form.appendChild(feedFilterChipsWatch);

            // close chat window
            const closeChatWindow = createCheckboxField('Auto Close Initial Chat Windows (default: no)', 'closeChatWindow', USER_CONFIG.closeChatWindow);
            form.appendChild(closeChatWindow);

            // channel default videos page
            const channelReindirizzare = createCheckboxField('"Videos" Tab as Default on Channel Page (default: no)', 'channelReindirizzare', USER_CONFIG.channelReindirizzare);
            form.appendChild(channelReindirizzare);

            // rss feed button on channel page
            const channelRSSBtn = createCheckboxField('Add RSS Feed Button to Channel Pages (default: no)', 'channelRSSBtn', USER_CONFIG.channelRSSBtn);
            form.appendChild(channelRSSBtn);

            // playlist button on channel page
            const channelPlaylistBtn = createCheckboxField('Add Playlist Buttons to Channel Pages (default: no)', 'channelPlaylistBtn', USER_CONFIG.channelPlaylistBtn);
            form.appendChild(channelPlaylistBtn);

            // playlist direction buttons in playlist panel
            const playlistDirectionBtns = createCheckboxField('Add Direction Buttons to Playlist Panels (default: yes)', 'playlistDirectionBtns', USER_CONFIG.playlistDirectionBtns);
            form.appendChild(playlistDirectionBtns);

            // open playlist videos without being in a playlist
            const playlistLinks = createCheckboxField('Open Playlist Videos Without Being in a Playlist When Clicking the Thumbnail or Title (default: no)', 'playlistLinks', USER_CONFIG.playlistLinks);
            form.appendChild(playlistLinks);

            // show trash can icon on owned playlists
            const playlistTrashCan = createCheckboxField('Show Trash Can Icon on Owned Playlists to Quickly Remove Videos (default: no)', 'playlistTrashCan', USER_CONFIG.playlistTrashCan);
            form.appendChild(playlistTrashCan);

            // remove watched videos from watch later
            const plWLBtn = createCheckboxField('Add "Remove Watched Videos" Button to Watch Later Playlist (default: yes)', 'plWLBtn', USER_CONFIG.plWLBtn);
            form.appendChild(plWLBtn);

            // sort comments new first
            const commentsNewFirst = createCheckboxField('Sort Comments to "Newest First" (default: no)', 'commentsNewFirst', USER_CONFIG.commentsNewFirst);
            form.appendChild(commentsNewFirst);

            // auto open chapter panel
            const autoOpenChapters = createCheckboxField('Automatically Open Chapter Panels (default: yes)', 'autoOpenChapters', USER_CONFIG.autoOpenChapters);
            form.appendChild(autoOpenChapters);

            // auto open transcript panel
            const autoOpenTranscript = createCheckboxField('Automatically Open Transcript Panels (default: no)', 'autoOpenTranscript', USER_CONFIG.autoOpenTranscript);
            form.appendChild(autoOpenTranscript);

            // auto open comments
            const autoOpenComments = createCheckboxField('Automatically Open Comments | Only Works with Tab View Enabled! (default: no)', 'autoOpenComments', USER_CONFIG.autoOpenComments);
            form.appendChild(autoOpenComments);

            // enable transcript timestamps
            const transcriptTimestamps = createCheckboxField('Automatically Enable Timestamps in Transcript Panels (default: no)', 'transcriptTimestamps', USER_CONFIG.transcriptTimestamps);
            form.appendChild(transcriptTimestamps);

            // 1x playback speed for music videos
            const VerifiedArtist = createCheckboxField('Maintain 1x Playback Speed for Verified Artist Music Videos (default: no)', 'VerifiedArtist', USER_CONFIG.VerifiedArtist);
            form.appendChild(VerifiedArtist);

            // 1080p enhanced bitrate
            const defaultQualityPremium = createCheckboxField('Use Enhanced Bitrate for 1080p Videos | Premium Required! (default: no)', 'defaultQualityPremium', USER_CONFIG.defaultQualityPremium);
            form.appendChild(defaultQualityPremium);

            // persistent progress bar
            const progressBar = createCheckboxField('Persistent Progress Bar with Chapter Markers and SponsorBlock Support (default: yes)', 'progressBar', USER_CONFIG.progressBar);
            form.appendChild(progressBar);

            // display remaining time minus SponsorBlock segments
            const displayRemainingTime = createCheckboxField('Display Remaining Time Under Videos Adjusted for Playback Speed (default: yes)', 'displayRemainingTime', USER_CONFIG.displayRemainingTime);
            form.appendChild(displayRemainingTime);

            const showRemainingCompact = createCheckboxField('Compact Version for Remaining Time (default: no)', 'showRemainingCompact', USER_CONFIG.showRemainingCompact);
            form.appendChild(showRemainingCompact);

            // info for remaining time minus segments
            const descriptionRemainingTime = document.createElement('small');
            descriptionRemainingTime.textContent = 'To also include skipped SponsorBlock segments, ensure "Show time with skips removed" is enabled in SponsorBlock settings under "Interface."';
            descriptionRemainingTime.classList.add('CentAnni-info-text');
            form.appendChild(descriptionRemainingTime);

            // layout changes
            const layoutChanges = document.createElement('label');
            layoutChanges.textContent = 'Layout Changes';
            layoutChanges.classList.add('button-icons', 'features-text');
            form.appendChild(layoutChanges);

            // tab view on video page
            const videoTabView = createCheckboxField('Tab View on Video Page (default: yes)', 'videoTabView', USER_CONFIG.videoTabView);
            form.appendChild(videoTabView);

            // toggle theater mode w/ active tab
            const toggleTheaterModeBtn = createCheckboxField('Toggle Theater Mode by Clicking the Active Tab (default: yes)', 'toggleTheaterModeBtn', USER_CONFIG.toggleTheaterModeBtn);
            form.appendChild(toggleTheaterModeBtn);

            // show chapters - only in tab view
            const tabViewChapters = createCheckboxField('Show Chapters Under Videos | Only Works with Tab View Enabled! (default: yes)', 'tabViewChapters', USER_CONFIG.tabViewChapters);
            form.appendChild(tabViewChapters);

            // hide comment section
            const hideCommentsSection = createCheckboxField('Hide Comments Section (default: no)', 'hideCommentsSection', USER_CONFIG.hideCommentsSection);
            form.appendChild(hideCommentsSection);

            // hide related video section
            const hideVideosSection = createCheckboxField('Hide Suggested Videos (default: no)', 'hideVideosSection', USER_CONFIG.hideVideosSection);
            form.appendChild(hideVideosSection);

            // square and compact search bar
            const squareSearchBar = createCheckboxField('Square and Compact Search Bar (default: no)', 'squareSearchBar', USER_CONFIG.squareSearchBar);
            form.appendChild(squareSearchBar);

            // square design
            const squareDesign = createCheckboxField('Square Design (default: no)', 'squareDesign', USER_CONFIG.squareDesign);
            form.appendChild(squareDesign);

            // square avatars
            const squareAvatars = createCheckboxField('Square Avatars (default: no)', 'squareAvatars', USER_CONFIG.squareAvatars);
            form.appendChild(squareAvatars);

            // compact layout
            const compactLayout = createCheckboxField('Compact Layout (default: no)', 'compactLayout', USER_CONFIG.compactLayout);
            form.appendChild(compactLayout);

            // disable ambient mode
            const noAmbientMode = createCheckboxField('Disable Ambient Mode (default: no)', 'noAmbientMode', USER_CONFIG.noAmbientMode);
            form.appendChild(noAmbientMode);

            // hide shorts
            const hideShorts = createCheckboxField('Hide Shorts (default: no)', 'hideShorts', USER_CONFIG.hideShorts);
            form.appendChild(hideShorts);

            // redirect shorts
            const redirectShorts = createCheckboxField('Redirect Shorts to Standard Video Pages (default: no)', 'redirectShorts', USER_CONFIG.redirectShorts);
            form.appendChild(redirectShorts);

            // hide ad slot
            const hideAdSlots = createCheckboxField('Hide Ad Slots on the Home Page (default: no)', 'hideAdSlots', USER_CONFIG.hideAdSlots);
            form.appendChild(hideAdSlots);

            // hide product span
            const hideProdTxt = createCheckboxField('Hide "X products" Text Under Videos (default: no)', 'hideProdTxt', USER_CONFIG.hideProdTxt);
            form.appendChild(hideProdTxt);

            // hide pay to watch
            const hidePayToWatch = createCheckboxField('Hide "Pay to Watch" Featured Videos on the Home Page (default: no)', 'hidePayToWatch', USER_CONFIG.hidePayToWatch);
            form.appendChild(hidePayToWatch);

            // hide free with ads
            const hideFreeWithAds = createCheckboxField('Hide "Free with ads" Videos on the Home Page (default: no)', 'hideFreeWithAds', USER_CONFIG.hideFreeWithAds);
            form.appendChild(hideFreeWithAds);

            // hide members only
            const hideMembersOnly = createCheckboxField('Hide Members Only Featured Videos on the Home Page (default: no)', 'hideMembersOnly', USER_CONFIG.hideMembersOnly);
            form.appendChild(hideMembersOnly);

            // hide latest post from . . .
            const hideLatestPosts = createCheckboxField('Hide "Latest posts from . . ." on Search Page (default: no)', 'hideLatestPosts', USER_CONFIG.hideLatestPosts);
            form.appendChild(hideLatestPosts);

            // modify or hide ui elements
            const uielements = document.createElement('label');
            uielements.textContent = 'Modify or Hide UI Elements';
            uielements.classList.add('button-icons', 'features-text');
            form.appendChild(uielements);

            // hide voice search button
            const hideVoiceSearch = createCheckboxField('Hide "Voice Search" Button (default: no)', 'hideVoiceSearch', USER_CONFIG.hideVoiceSearch);
            form.appendChild(hideVoiceSearch);

            // hide create button
            const hideCreateButton = createCheckboxField('Hide "Create" Button (default: no)', 'hideCreateButton', USER_CONFIG.hideCreateButton);
            form.appendChild(hideCreateButton);

            // hide notification button
            const hideNotificationBtn = createCheckboxField('Hide "Notification" Button (default: no)', 'hideNotificationBtn', USER_CONFIG.hideNotificationBtn);
            form.appendChild(hideNotificationBtn);

            // hide notification count
            const hideNotificationBadge = createCheckboxField('Hide Notification Badge (default: no)', 'hideNotificationBadge', USER_CONFIG.hideNotificationBadge);
            form.appendChild(hideNotificationBadge);

            // hide avatar
            const hideOwnAvatar = createCheckboxField('Hide Own Avatar in the Header (default: no)', 'hideOwnAvatar', USER_CONFIG.hideOwnAvatar);
            form.appendChild(hideOwnAvatar);

            // hide YouTube brand text within the header
            const hideBrandText = createCheckboxField('Hide YouTube Brand Text in the Header (default: no)', 'hideBrandText', USER_CONFIG.hideBrandText);
            form.appendChild(hideBrandText);

            // color picker country code - toggle | color picker
            const visibleCountryCodeColor = document.createElement('div');
            visibleCountryCodeColor.classList.add('videos-colorpicker-container', 'selection-color-container');

            const visibleCountryCode = createCheckboxField('Keep Country Code Visible When Hiding Brand Text (default: no)', 'visibleCountryCode', USER_CONFIG.visibleCountryCode);
            visibleCountryCodeColor.appendChild(visibleCountryCode);

            const visibleCountryCodePicker = createColorPicker('Country Code Text Color', 'visibleCountryCodeColor');
            visibleCountryCodeColor.appendChild(visibleCountryCodePicker);

            form.appendChild(visibleCountryCodeColor);

            // small subscribed button
            const smallSubscribeButton = createCheckboxField('Small Subscribed Button Under Videos—Displays Only the Notification Icon (default: no)', 'smallSubscribeButton', USER_CONFIG.smallSubscribeButton);
            form.appendChild(smallSubscribeButton);

            // hide join button
            const hideJoinButton = createCheckboxField('Hide the Join Button Under Videos and on Channel Pages (default: no)', 'hideJoinButton', USER_CONFIG.hideJoinButton);
            form.appendChild(hideJoinButton);

            // display full title
            const displayFullTitle = createCheckboxField('Display Full Titles (default: yes)', 'displayFullTitle', USER_CONFIG.displayFullTitle);
            form.appendChild(displayFullTitle);

            // custom selection color - toggle | light mode | dark mode
            const selectionColorContainer = document.createElement('div');
            selectionColorContainer.classList.add('videos-colorpicker-container', 'selection-color-container');

            const selectionColor = createCheckboxField('Custom Selection Color (default: yes)', 'selectionColor', USER_CONFIG.selectionColor);
            selectionColorContainer.appendChild(selectionColor);

            const lightModeColorPicker = createColorPicker('Light Mode', 'lightModeSelectionColor');
            selectionColorContainer.appendChild(lightModeColorPicker);

            const darkModeColorPicker = createColorPicker('Dark Mode', 'darkModeSelectionColor');
            selectionColorContainer.appendChild(darkModeColorPicker);

            form.appendChild(selectionColorContainer);

            // color picker progress bar - toggle | color picker
            const progressbarColorPicker = document.createElement('div');
            progressbarColorPicker.classList.add('videos-colorpicker-container', 'selection-color-container');

            const playProgressColor = createCheckboxField('Custom Color for on Hover Progress Bar (default: no)', 'playProgressColor', USER_CONFIG.playProgressColor);
            progressbarColorPicker.appendChild(playProgressColor);

            const progressbarColorPickerColor = createColorPicker('Progress Bar Color', 'progressbarColorPicker');
            progressbarColorPicker.appendChild(progressbarColorPickerColor);

            form.appendChild(progressbarColorPicker);

            // pure b/w bg
            const pureBWBackground = createCheckboxField('Pure Black-and-White Background (default: yes)', 'pureBWBackground', USER_CONFIG.pureBWBackground);
            form.appendChild(pureBWBackground);

            // no frosted glass
            const noFrostedGlass = createCheckboxField('No Frosted Glass Effect (default: no)', 'noFrostedGlass', USER_CONFIG.noFrostedGlass);
            form.appendChild(noFrostedGlass);

            // hide video scrubber
            const removeScrubber = createCheckboxField('Hide Video Scrubber (default: no)', 'removeScrubber', USER_CONFIG.removeScrubber);
            form.appendChild(removeScrubber);

            // hide video end cards
            const hideEndCards = createCheckboxField('Hide Video End Cards (default: no)', 'hideEndCards', USER_CONFIG.hideEndCards);
            form.appendChild(hideEndCards);

            // hide end screens
            const hideEndscreen = createCheckboxField('Hide End Screens (default: no)', 'hideEndscreen', USER_CONFIG.hideEndscreen);
            form.appendChild(hideEndscreen);

            // bottom gradient lower height and different bg image
            const gradientBottom = createCheckboxField('Less Intrusive Bottom Gradient (default: yes)', 'gradientBottom', USER_CONFIG.gradientBottom);
            form.appendChild(gradientBottom);

            // hide play next button
            const hidePlayNextButton = createCheckboxField('Hide "Play Next" Button (default: no)', 'hidePlayNextButton', USER_CONFIG.hidePlayNextButton);
            form.appendChild(hidePlayNextButton);

            // hide airplay button
            const hideAirplayButton = createCheckboxField('Hide "Airplay" Button (default: no)', 'hideAirplayButton', USER_CONFIG.hideAirplayButton);
            form.appendChild(hideAirplayButton);

            // hide share btn global
            const hideShareBtnGlobal = createCheckboxField('Hide Share Button (default: no)', 'hideShareBtnGlobal', USER_CONFIG.hideShareBtnGlobal);
            form.appendChild(hideShareBtnGlobal);

            // hide share button
            const hideShareButton = createCheckboxField('Hide Share Button Only Under Videos (default: no)', 'hideShareButton', USER_CONFIG.hideShareButton);
            form.appendChild(hideShareButton);

            // hide hashtags under video
            const hideHashtags = createCheckboxField('Hide Hashtags Under Videos (default: no)', 'hideHashtags', USER_CONFIG.hideHashtags);
            form.appendChild(hideHashtags);

            // hide blue info panel under video
            const hideInfoPanel = createCheckboxField('Hide Blue Info Panels (default: no)', 'hideInfoPanel', USER_CONFIG.hideInfoPanel);
            form.appendChild(hideInfoPanel);

            // hide add comment
            const hideAddComment = createCheckboxField('Hide "Add Comment" Textfield (default: no)', 'hideAddComment', USER_CONFIG.hideAddComment);
            form.appendChild(hideAddComment);

            // hide reply comment button
            const hideReplyButton = createCheckboxField('Hide Comment "Reply" Button (default: no)', 'hideReplyButton', USER_CONFIG.hideReplyButton);
            form.appendChild(hideReplyButton);

            // hide playables
            const hidePlayables = createCheckboxField('Hide "YouTube Playables" on the Home Page (default: no)', 'hidePlayables', USER_CONFIG.hidePlayables);
            form.appendChild(hidePlayables);

            // hide news on home
            const hideNewsHome = createCheckboxField('Hide "Breaking News" on the Home Page (default: no)', 'hideNewsHome', USER_CONFIG.hideNewsHome);
            form.appendChild(hideNewsHome);

            // hide playlists on home
            const hidePlaylistsHome = createCheckboxField('Hide Playlists on the Home Page (default: no)', 'hidePlaylistsHome', USER_CONFIG.hidePlaylistsHome);
            form.appendChild(hidePlaylistsHome);

            // hide latest posts on home
            const hideLatestPostsHome = createCheckboxField('Hide "Latest YouTube posts" on the Home Page (default: no)', 'hideLatestPostsHome', USER_CONFIG.hideLatestPostsHome);
            form.appendChild(hideLatestPostsHome);

            // hide fundraiser
            const hideFundraiser = createCheckboxField('Hide Fundraiser Icons and Panels (default: no)', 'hideFundraiser', USER_CONFIG.hideFundraiser);
            form.appendChild(hideFundraiser);

            // hide mini player
            const hideMiniPlayer = createCheckboxField('Hide Mini Player (default: no)', 'hideMiniPlayer', USER_CONFIG.hideMiniPlayer);
            form.appendChild(hideMiniPlayer);

            // hide queue button
            const hideQueueBtn = createCheckboxField('Hide "Add to queue" Button (default: no)', 'hideQueueBtn', USER_CONFIG.hideQueueBtn);
            form.appendChild(hideQueueBtn);

            // hide right sidebar search
            const hideRightSidebarSearch = createCheckboxField('Hide Right Sidebar on Search Page (default: no)', 'hideRightSidebarSearch', USER_CONFIG.hideRightSidebarSearch);
            form.appendChild(hideRightSidebarSearch);

            // hide watched videos globally
            const hideWatchedGlobal = document.createElement('label');
            hideWatchedGlobal.textContent = 'Hide Watched Videos';
            hideWatchedGlobal.classList.add('button-icons', 'features-text');
            form.appendChild(hideWatchedGlobal);

            // css version
            const videosHideWatchedGlobal = createCheckboxField('Hide Watched Videos Regardless of Progress Everywhere (default: no)', 'videosHideWatchedGlobal', USER_CONFIG.videosHideWatchedGlobal);
            form.appendChild(videosHideWatchedGlobal);

            // hide watched only on home
            const videosHideWatched = createCheckboxField('Hide Watched Videos Regardless of Progress Only on the Home Page (default: no)', 'videosHideWatched', USER_CONFIG.videosHideWatched);
            form.appendChild(videosHideWatched);

            // Spacer-5
            const spacer5Watched = document.createElement('div');
            spacer5Watched.classList.add('spacer-5');
            form.appendChild(spacer5Watched);

            // info for hiding watched videos
            const descriptionHideWatchedVideos = document.createElement('small');
            descriptionHideWatchedVideos.textContent = 'Please Pick Either a CSS Version Above or the JavaScript Version Below to Hide Watched Videos.';
            descriptionHideWatchedVideos.classList.add('CentAnni-info-text');
            form.appendChild(descriptionHideWatchedVideos);

            // js version
            const videosHideWatchedGlobalJS = createNumberInputField("Percent Watched to Hide Videos (default: 0 | disabled)", 'videosHideWatchedGlobalJS', USER_CONFIG.videosHideWatchedGlobalJS, { max: 100, step: 1 });
            form.appendChild(videosHideWatchedGlobalJS);

            // hide percentage watched on home page
            const videosHideWatchedHome = createCheckboxField('Hide X Percentage Watched Videos on the Home Page (default: yes)', 'videosHideWatchedHome', USER_CONFIG.videosHideWatchedHome);
            form.appendChild(videosHideWatchedHome);

            // hide percentage watched on sub page
            const videosHideWatchedSubscriptions = createCheckboxField('Hide X Percentage Watched Videos on the Subscription Page (default: no)', 'videosHideWatchedSubscriptions', USER_CONFIG.videosHideWatchedSubscriptions);
            form.appendChild(videosHideWatchedSubscriptions);

            // hide percentage watched on channel page
            const videosHideWatchedChannels = createCheckboxField('Hide X Percentage Watched Videos on Channel Pages (default: no)', 'videosHideWatchedChannels', USER_CONFIG.videosHideWatchedChannels);
            form.appendChild(videosHideWatchedChannels);

            // hide percentage watched on pl
            const videosHideWatchedPlaylist = createCheckboxField('Hide X Percentage Watched Videos on Playlists (default: no)', 'videosHideWatchedPlaylist', USER_CONFIG.videosHideWatchedPlaylist);
            form.appendChild(videosHideWatchedPlaylist);

            // hide percentage watched on videos
            const videosHideWatchedVideo = createCheckboxField('Hide X Percentage Watched Videos on Video Pages (default: yes)', 'videosHideWatchedVideo', USER_CONFIG.videosHideWatchedVideo);
            form.appendChild(videosHideWatchedVideo);

            // hide percentage watched on search
            const videosHideWatchedSearch = createCheckboxField('Hide X Percentage Watched Videos on Search Pages (default: no)', 'videosHideWatchedSearch', USER_CONFIG.videosHideWatchedSearch);
            form.appendChild(videosHideWatchedSearch);

            // left navigation bar
            const leftnavbar = document.createElement('label');
            leftnavbar.textContent = 'Hide UI Elements in the Left Navigation Bar';
            leftnavbar.classList.add('button-icons', 'features-text');
            form.appendChild(leftnavbar);

            // hide home button
            const lnbHideHomeBtn = createCheckboxField('Hide "Home" Button (default: no)', 'lnbHideHomeBtn', USER_CONFIG.lnbHideHomeBtn);
            form.appendChild(lnbHideHomeBtn);

            // hide subscriptions button
            const lnbHideSubscriptionsBtn = createCheckboxField('Hide "Subscriptions" Button (default: no)', 'lnbHideSubscriptionsBtn', USER_CONFIG.lnbHideSubscriptionsBtn);
            form.appendChild(lnbHideSubscriptionsBtn);

            // Spacer-5
            const spacer5Home = document.createElement('div');
            spacer5Home.classList.add('spacer-5');
            form.appendChild(spacer5Home);

            // hide you button
            const lnbHideYouBtn = createCheckboxField('Hide "You" Button (default: no)', 'lnbHideYouBtn', USER_CONFIG.lnbHideYouBtn);
            form.appendChild(lnbHideYouBtn);

            // hide history button
            const lnbHideHistoryBtn = createCheckboxField('Hide "History" Button (default: no)', 'lnbHideHistoryBtn', USER_CONFIG.lnbHideHistoryBtn);
            form.appendChild(lnbHideHistoryBtn);

            // hide playlists button
            const lnbHidePlaylistsBtn = createCheckboxField('Hide "Playlists" Button (default: no)', 'lnbHidePlaylistsBtn', USER_CONFIG.lnbHidePlaylistsBtn);
            form.appendChild(lnbHidePlaylistsBtn);

            // hide videos button
            const lnbHideVideosBtn = createCheckboxField('Hide "Your Videos" Button (default: no)', 'lnbHideVideosBtn', USER_CONFIG.lnbHideVideosBtn);
            form.appendChild(lnbHideVideosBtn);

            // hide courses button
            const lnbHideCoursesBtn = createCheckboxField('Hide "Your Courses" Button (default: no)', 'lnbHideCoursesBtn', USER_CONFIG.lnbHideCoursesBtn);
            form.appendChild(lnbHideCoursesBtn);

            // hide your podcasts button
            const lnbHideYPodcastsBtn = createCheckboxField('Hide "Your Podcasts" Button (default: no)', 'lnbHideYPodcastsBtn', USER_CONFIG.lnbHideYPodcastsBtn);
            form.appendChild(lnbHideYPodcastsBtn);

            // hide watch later button
            const lnbHideWlBtn = createCheckboxField('Hide "Watch Later" Button (default: no)', 'lnbHideWlBtn', USER_CONFIG.lnbHideWlBtn);
            form.appendChild(lnbHideWlBtn);

            // hide liked videos button
            const lnbHideLikedVideosBtn = createCheckboxField('Hide "Liked Videos" Button (default: no)', 'lnbHideLikedVideosBtn', USER_CONFIG.lnbHideLikedVideosBtn);
            form.appendChild(lnbHideLikedVideosBtn);

            // hide downloads button
            const lnbHideDLBtn = createCheckboxField('Hide "Downloads" Button (default: no)', 'lnbHideDLBtn', USER_CONFIG.lnbHideDLBtn);
            form.appendChild(lnbHideDLBtn);

            // Spacer-5
            const spacer5Subscriptions = document.createElement('div');
            spacer5Subscriptions.classList.add('spacer-5');
            form.appendChild(spacer5Subscriptions);

            // hide subscriptions section
            const lnbHideSubscriptionsSection = createCheckboxField('Hide "Subscriptions" Section (default: no)', 'lnbHideSubscriptionsSection', USER_CONFIG.lnbHideSubscriptionsSection);
            form.appendChild(lnbHideSubscriptionsSection);

            // hide subscriptions title
            const lnbHideSubscriptionsTitle = createCheckboxField('Hide "Subscriptions" Title (default: no)', 'lnbHideSubscriptionsTitle', USER_CONFIG.lnbHideSubscriptionsTitle);
            form.appendChild(lnbHideSubscriptionsTitle);

            // hide more button
            const lnbHideMoreBtn = createCheckboxField('Hide "Show More" Button (default: no)', 'lnbHideMoreBtn', USER_CONFIG.lnbHideMoreBtn);
            form.appendChild(lnbHideMoreBtn);

            // Spacer-5
            const spacer5Explore = document.createElement('div');
            spacer5Explore.classList.add('spacer-5');
            form.appendChild(spacer5Explore);

            // hide explore section
            const lnbHideExploreSection = createCheckboxField('Hide "Explore" Section (default: no)', 'lnbHideExploreSection', USER_CONFIG.lnbHideExploreSection);
            form.appendChild(lnbHideExploreSection);

            // hide explore title
            const lnbHideExploreTitle = createCheckboxField('Hide "Explore" Title (default: no)', 'lnbHideExploreTitle', USER_CONFIG.lnbHideExploreTitle);
            form.appendChild(lnbHideExploreTitle);

            // hide trending button
            const lnbHideTrendingBtn = createCheckboxField('Hide "Trending" Button (default: no)', 'lnbHideTrendingBtn', USER_CONFIG.lnbHideTrendingBtn);
            form.appendChild(lnbHideTrendingBtn);

            // hide music button
            const lnbHideMusicBtn = createCheckboxField('Hide "Music" Button (default: no)', 'lnbHideMusicBtn', USER_CONFIG.lnbHideMusicBtn);
            form.appendChild(lnbHideMusicBtn);

            // hide movies button
            const lnbHideMoviesBtn = createCheckboxField('Hide "Movies & TV" Button (default: no)', 'lnbHideMoviesBtn', USER_CONFIG.lnbHideMoviesBtn);
            form.appendChild(lnbHideMoviesBtn);

            // hide live button
            const lnbHideLiveBtn = createCheckboxField('Hide "Live" Button (default: no)', 'lnbHideLiveBtn', USER_CONFIG.lnbHideLiveBtn);
            form.appendChild(lnbHideLiveBtn);

            // hide gaming button
            const lnbHideGamingBtn = createCheckboxField('Hide "Gaming" Button (default: no)', 'lnbHideGamingBtn', USER_CONFIG.lnbHideGamingBtn);
            form.appendChild(lnbHideGamingBtn);

            // hide news button
            const lnbHideNewsBtn = createCheckboxField('Hide "News" Button (default: no)', 'lnbHideNewsBtn', USER_CONFIG.lnbHideNewsBtn);
            form.appendChild(lnbHideNewsBtn);

            // hide sports button
            const lnbHideSportsBtn = createCheckboxField('Hide "Sports" Button (default: no)', 'lnbHideSportsBtn', USER_CONFIG.lnbHideSportsBtn);
            form.appendChild(lnbHideSportsBtn);

            // hide learning button
            const lnbHideLearningBtn = createCheckboxField('Hide "Learning" Button (default: no)', 'lnbHideLearningBtn', USER_CONFIG.lnbHideLearningBtn);
            form.appendChild(lnbHideLearningBtn);

            // hide fashion & beauty button
            const lnbHideFashionBtn = createCheckboxField('Hide "Fashion & Beauty" Button (default: no)', 'lnbHideFashionBtn', USER_CONFIG.lnbHideFashionBtn);
            form.appendChild(lnbHideFashionBtn);

            // hide podcasts button
            const lnbHidePodcastsBtn = createCheckboxField('Hide "Podcasts" Button (default: no)', 'lnbHidePodcastsBtn', USER_CONFIG.lnbHidePodcastsBtn);
            form.appendChild(lnbHidePodcastsBtn);

            // Spacer-5
            const spacer5More = document.createElement('div');
            spacer5More.classList.add('spacer-5');
            form.appendChild(spacer5More);

            // hide more section
            const lnbHideMoreSection = createCheckboxField('Hide "More from YouTube" Section (default: no)', 'lnbHideMoreSection', USER_CONFIG.lnbHideMoreSection);
            form.appendChild(lnbHideMoreSection);

            // hide more title
            const lnbHideMoreTitle = createCheckboxField('Hide "More from YouTube" Title (default: no)', 'lnbHideMoreTitle', USER_CONFIG.lnbHideMoreTitle);
            form.appendChild(lnbHideMoreTitle);

            // hide youtube premium button
            const lnbHideYtPremiumBtn = createCheckboxField('Hide "YouTube Premium" Button (default: no)', 'lnbHideYtPremiumBtn', USER_CONFIG.lnbHideYtPremiumBtn);
            form.appendChild(lnbHideYtPremiumBtn);

            // hide youtube studio button
            const lnbHideYtStudioBtn = createCheckboxField('Hide "YouTube Studio" Button (default: no)', 'lnbHideYtStudioBtn', USER_CONFIG.lnbHideYtStudioBtn);
            form.appendChild(lnbHideYtStudioBtn);

            // hide youtube music button
            const lnbHideYtMusicBtn = createCheckboxField('Hide "YouTube Music" Button (default: no)', 'lnbHideYtMusicBtn', USER_CONFIG.lnbHideYtMusicBtn);
            form.appendChild(lnbHideYtMusicBtn);

            // hide youtube kids button
            const lnbHideYtKidsBtn = createCheckboxField('Hide "YouTube Kids" Button (default: no)', 'lnbHideYtKidsBtn', USER_CONFIG.lnbHideYtKidsBtn);
            form.appendChild(lnbHideYtKidsBtn);

            // Spacer-5
            const spacer5Penultimate = document.createElement('div');
            spacer5Penultimate.classList.add('spacer-5');
            form.appendChild(spacer5Penultimate);

            // hide penultimate section
            const lnbHidePenultimateSection = createCheckboxField('Hide Penultimate Section (default: no)', 'lnbHidePenultimateSection', USER_CONFIG.lnbHidePenultimateSection);
            form.appendChild(lnbHidePenultimateSection);

            // hide settings button
            const lnbHideSettingsBtn = createCheckboxField('Hide "Settings" Button (default: no)', 'lnbHideSettingsBtn', USER_CONFIG.lnbHideSettingsBtn);
            form.appendChild(lnbHideSettingsBtn);

            // hide report history button
            const lnbHideReportHistoryBtn = createCheckboxField('Hide "Report History" Button (default: no)', 'lnbHideReportHistoryBtn', USER_CONFIG.lnbHideReportHistoryBtn);
            form.appendChild(lnbHideReportHistoryBtn);

            // hide help button
            const lnbHideHelpBtn = createCheckboxField('Hide "Help" Button (default: no)', 'lnbHideHelpBtn', USER_CONFIG.lnbHideHelpBtn);
            form.appendChild(lnbHideHelpBtn);

            // hide feedback button
            const lnbHideFeedbackBtn = createCheckboxField('Hide "Send Feedback" Button (default: no)', 'lnbHideFeedbackBtn', USER_CONFIG.lnbHideFeedbackBtn);
            form.appendChild(lnbHideFeedbackBtn);

            // Spacer-5
            const spacer5Footer = document.createElement('div');
            spacer5Footer.classList.add('spacer-5');
            form.appendChild(spacer5Footer);

            // hide footer
            const lnbHideFooter = createCheckboxField('Hide Footer (default: no)', 'lnbHideFooter', USER_CONFIG.lnbHideFooter);
            form.appendChild(lnbHideFooter);

            return form;
        }

        // color code videos
        function createColorCodeVideosContent() {
            const form = document.createElement('form');
            form.id = 'color-code-videos-form';

            const subPanelHeader = document.createElement('div');
            subPanelHeader.classList.add('sub-panel-header');
            subPanelHeader.textContent = 'Configure Color Codes for Videos';
            form.appendChild(subPanelHeader);

            // on home page
            const colorCodeVideosOnHome = document.createElement('label');
            colorCodeVideosOnHome.textContent = 'Home Page';
            colorCodeVideosOnHome.classList.add('button-icons', 'features-text');
            form.appendChild(colorCodeVideosOnHome);

            const infoColorCodeVideosHome = document.createElement('small');
            infoColorCodeVideosHome.textContent = "These settings apply only to the Home page.";
            infoColorCodeVideosHome.classList.add('CentAnni-info-text');
            form.appendChild(infoColorCodeVideosHome);

            // activate color code videos on home
            const colorCodeVideosEnabled = createCheckboxField('Color Code Videos Based on Age and Status (default: yes)', 'colorCodeVideosEnabled', USER_CONFIG.colorCodeVideosEnabled);
            form.appendChild(colorCodeVideosEnabled);

            // disable hover effect
            const homeDisableHover = createCheckboxField('Disable Hover Effect (default: no)', 'homeDisableHover', USER_CONFIG.homeDisableHover);
            form.appendChild(homeDisableHover);

            // opacity picker for old videos
            const videosOldContainer = createSliderInputField('Change Opacity of Videos Uploaded More than 1 Year Ago:', 'videosOldOpacity', USER_CONFIG.videosOldOpacity, '0', '1', '0.1');
            form.appendChild(videosOldContainer);

            // color pickers for different video ages
            const videosAgeContainer = document.createElement('div');
            videosAgeContainer.classList.add('videos-colorpicker-container');

            const colorPickerConfigs = [
                { label: 'Videos Uploaded Within the Last 24 Hours:', id: 'videosAgeColorPickerNewly' },
                { label: 'Videos Uploaded Within the Past Week:', id: 'videosAgeColorPickerRecent' },
                { label: 'Videos Uploaded Within the Past Month:', id: 'videosAgeColorPickerLately' },
                { label: 'Videos Uploaded Within 2 to 12 Months:', id: 'videosAgeColorPickerLatterly' },
                { label: 'Videos Currently Live:', id: 'videosAgeColorPickerLive' },
                { label: 'The Word "Streamed" from Videos That Were Live:', id: 'videosAgeColorPickerStreamed' },
                { label: 'Scheduled Videos and Upcoming Live Streams:', id: 'videosAgeColorPickerUpcoming' }
            ];

            colorPickerConfigs.forEach(config => {
                const row = createColorPicker(config.label, config.id);

                const darkModeSpan = document.createElement('span');
                darkModeSpan.classList.add('label-style-settings');
                darkModeSpan.textContent = 'Dark Mode';
                row.insertBefore(darkModeSpan, row.firstChild);

                const lightPickerRow = createColorPicker('Light Mode', config.id + 'Light');
                const lightPicker = lightPickerRow.querySelector('input');
                const lightModeLabel = lightPickerRow.querySelector('span');

                row.insertBefore(lightPicker, row.firstChild);
                row.insertBefore(lightModeLabel, row.firstChild);

                videosAgeContainer.appendChild(row);
            });

            form.appendChild(videosAgeContainer);

            // on subscriptions page
            const colorCodeVideosOnSubscriptions = document.createElement('label');
            colorCodeVideosOnSubscriptions.textContent = 'Subscriptions Page';
            colorCodeVideosOnSubscriptions.classList.add('button-icons', 'features-text');
            form.appendChild(colorCodeVideosOnSubscriptions);

            const infoColorCodeVideosSubscriptions = document.createElement('small');
            infoColorCodeVideosSubscriptions.textContent = "These settings apply only to the Subscriptions page.\nOn each visit, the newest uploaded video ID is saved, allowing subsequent visits to highlight and optionally auto-scroll to that video. On first page load, YouTube loads about 84 videos, so highlighting and scrolling apply within this limit.";
            infoColorCodeVideosSubscriptions.classList.add('CentAnni-info-text');
            form.appendChild(infoColorCodeVideosSubscriptions);

            // color picker last seen video
            const lastSeenVideoColor = document.createElement('div');
            lastSeenVideoColor.classList.add('videos-colorpicker-container');

            const rowLSV = createColorPicker('Last Uploaded Video:', 'lastSeenVideoColor');

            const darkModeSpanLSV = document.createElement('span');
            darkModeSpanLSV.classList.add('label-style-settings');
            darkModeSpanLSV.textContent = 'Dark Mode';
            rowLSV.insertBefore(darkModeSpanLSV, rowLSV.firstChild);

            const lightPickerRowLSV = createColorPicker('Light Mode', 'lastSeenVideoColorLight');
            const lightPickerLSV = lightPickerRowLSV.querySelector('input');
            const lightModeLabelLSV = lightPickerRowLSV.querySelector('span');

            rowLSV.insertBefore(lightPickerLSV, rowLSV.firstChild);
            rowLSV.insertBefore(lightModeLabelLSV, rowLSV.firstChild);

            lastSeenVideoColor.appendChild(rowLSV);
            form.appendChild(lastSeenVideoColor);

            // last seen video
            const lastSeenVideo = createCheckboxField('Color Code Last Uploaded Video (default: yes)', 'lastSeenVideo', USER_CONFIG.lastSeenVideo);
            form.appendChild(lastSeenVideo);

            // scroll to last seen video
            const lastSeenVideoScroll = createCheckboxField('Auto-Scroll to Last Uploaded Video (default: no)', 'lastSeenVideoScroll', USER_CONFIG.lastSeenVideoScroll);
            form.appendChild(lastSeenVideoScroll);

            return form;
        }
    }

    // helper function to create input fields
    function createInputField(labelText, settingKey, settingValue, labelClass) {
        const container = document.createElement('div');
        container.classList.add('url-container');

        const label = document.createElement('label');
        label.textContent = labelText;
        label.className = labelClass;
        label.classList.add('label-style-settings');
        container.appendChild(label);

        const input = document.createElement('input');
        const fieldInputClass = `input-field-${settingKey}`;
        input.type = 'text';
        input.name = settingKey;
        input.value = settingValue;
        input.classList.add('input-field-url');
        input.classList.add(fieldInputClass);
        container.appendChild(input);

        return container;
    }

    // helper function to create select fields
    function createSelectField(labelText, labelClass, settingKey, settingValue, options) {
        const container = document.createElement('div');
        container.classList.add('file-naming-container');

        const label = document.createElement('label');
        label.textContent = labelText;
        label.className = labelClass;
        label.classList.add('label-style-settings');
        container.appendChild(label);

        const select = document.createElement('div');
        select.classList.add('select-file-naming');
        select.textContent = options[settingValue];
        select.setAttribute('tabindex', '0');
        container.appendChild(select);

        const hiddenSelect = document.createElement('select');
        hiddenSelect.name = settingKey;
        hiddenSelect.classList.add('hidden-select');
        for (const [value, text] of Object.entries(options)) {
            const option = document.createElement('option');
            option.value = value;
            option.text = text;
            if (value === settingValue) {
                option.selected = true;
            }
            hiddenSelect.appendChild(option);
        }
        container.appendChild(hiddenSelect);

        const dropdownList = document.createElement('div');
        dropdownList.classList.add('dropdown-list');
        container.appendChild(dropdownList);

        for (const [value, text] of Object.entries(options)) {
            const item = document.createElement('div');
            item.classList.add('dropdown-item');
            item.textContent = text;
            item.dataset.value = value;

            if (value === settingValue) { item.classList.add('dropdown-item-selected'); }

            item.addEventListener('click', () => {
                const previouslySelected = dropdownList.querySelector('.dropdown-item-selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('dropdown-item-selected');
                }

                item.classList.add('dropdown-item-selected');
                select.textContent = text;
                hiddenSelect.value = value;
                dropdownList.classList.remove('show');
            });

            dropdownList.appendChild(item);
        }

        // open dropdown
        select.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown-list.show').forEach(list => {
                if (list !== dropdownList) list.classList.remove('show');
            });
            const isShown = dropdownList.classList.toggle('show');
            if (isShown) document.addEventListener('click', closeDropdown, { once: true });
        });

        // close dropdown
        const closeDropdown = () => {
            dropdownList.classList.remove('show');
        };

        return container;
    }

    // helper function to create checkbox fields
    function createCheckboxField(labelText, settingKey, settingValue) {
        const container = document.createElement('div');
        container.classList.add('checkbox-container');

        const label = document.createElement('label');
        label.classList.add('checkbox-label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = settingKey;
        checkbox.checked = settingValue;
        checkbox.classList.add('checkbox-field');
        label.appendChild(checkbox);

        const span = document.createElement('span');
        span.textContent = labelText;
        label.appendChild(span);

        container.appendChild(label);
        return container;
    }

    // helper function to create a number input fields
    function createNumberInputField(labelText, settingKey, settingValue, options = {}) {
        const container = document.createElement('div');
        container.classList.add('number-input-container');

        const label = document.createElement('label');
        label.classList.add('number-input-label');

        const numberInput = document.createElement('input');
        numberInput.type = options.type || 'number';
        numberInput.name = settingKey;
        numberInput.value = settingValue;
        if (numberInput.type === 'number') {
            numberInput.min = options.min || 1;
            numberInput.max = options.max || 20;
            numberInput.step = options.step || .25;
        }
        numberInput.classList.add('number-input-field');
        label.appendChild(numberInput);

        const span = document.createElement('span');
        span.textContent = labelText;
        label.appendChild(span);

        container.appendChild(label);
        return container;
    }

    // helper function to create a slider fields
    function createSliderInputField(labelText, settingKey, settingValue, min, max, step) {
        const container = document.createElement('div');
        container.classList.add('videos-old-container');

        const label = document.createElement('span');
        label.classList.add('label-style-settings');
        label.textContent = labelText;
        container.appendChild(label);

        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');

        const leftLabel = document.createElement('span');
        leftLabel.textContent = min;
        sliderContainer.appendChild(leftLabel);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = settingValue;
        slider.name = settingKey;
        sliderContainer.appendChild(slider);

        const rightLabel = document.createElement('span');
        rightLabel.textContent = max;
        sliderContainer.appendChild(rightLabel);

        const currentValue = document.createElement('span');
        currentValue.textContent = `(${parseFloat(slider.value).toFixed(1)})`;
        sliderContainer.appendChild(currentValue);

        container.appendChild(sliderContainer);

        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value).toFixed(1);
            currentValue.textContent = `(${value})`;
        });

        return container;
    }

    // helper function to create a textarea fields
    function createTextareaField(labelText, settingKey, settingValue, labelClass) {
        const container = document.createElement('chatgpt-prompt');

        const label = document.createElement('label');
        label.textContent = labelText;
        label.className = labelClass;
        label.classList.add('label-style-settings');
        container.appendChild(label);

        const textarea = document.createElement('textarea');
        textarea.name = settingKey;
        textarea.value = settingValue;
        textarea.classList.add('chatgpt-prompt-textarea');
        container.appendChild(textarea);

        return container;
    }

    // helper function to create color pickers
    function createColorPicker(labelText, configKey) {
        const row = document.createElement('div');
        row.classList.add('videos-colorpicker-row');

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = USER_CONFIG[configKey];
        colorPicker.name = configKey;
        row.appendChild(colorPicker);

        const label = document.createElement('span');
        label.classList.add('label-style-settings');
        label.textContent = labelText;
        row.appendChild(label);

        return row;
    }

    // function to save settings
    async function saveSettings() {
        const form = document.getElementById('CentAnni-main-settings-form');
        const subPanelLinks = document.getElementById('links-in-header-form');
        const subPanelCustomCSS = document.getElementById('custom-css-form');
        const subPanelColor = document.getElementById('color-code-videos-form');

        // function to ensure secure URLs
        function normalizeUrl(url) {
            url = url.trim();
            if (/^https?:\/\//i.test(url)) {
                url = url.replace(/^http:\/\//i, 'https://');
            } else { url = 'https://' + url; }
            return url;
        }

        // validate ChatGPT and NotebookLM URLs
        function validateUrlAndLabel(formElement, configPrefix) {
            let url;
            let shouldNormalizeUrl = false;
            let targetUrlAndLabel = form.elements[`target${configPrefix}Url`].value.trim();

            if (targetUrlAndLabel !== '') {
                let split = targetUrlAndLabel.split('|').map(s => s.trim());
                if (split.length === 2) {
                    if (/\p{L}+/u.test(split[0])) USER_CONFIG[`target${configPrefix}Label`] = split[0];
                    url = split[1];
                    shouldNormalizeUrl = true;
                } else if (targetUrlAndLabel.includes('.')) {
                    if (!USER_CONFIG[`target${configPrefix}Label`] || !/\p{L}+/u.test(USER_CONFIG[`target${configPrefix}Label`])) delete USER_CONFIG[`target${configPrefix}Label`];
                    url = targetUrlAndLabel;
                    shouldNormalizeUrl = true;
                }
            }

            if (shouldNormalizeUrl) USER_CONFIG[`target${configPrefix}Url`] = normalizeUrl(url);
            else { delete USER_CONFIG[`target${configPrefix}Label`]; delete USER_CONFIG[`target${configPrefix}Url`]; }
        }
        validateUrlAndLabel(form, 'ChatGPT');
        validateUrlAndLabel(form, 'NotebookLM');

        // save other settings
        USER_CONFIG.YouTubeTranscriptExporter = form.elements.YouTubeTranscriptExporter.checked;
        USER_CONFIG.lazyTranscriptLoading = form.elements.lazyTranscriptLoading.checked;
        USER_CONFIG.fileNamingFormat = form.elements.fileNamingFormat.value;
        USER_CONFIG.includeTimestamps = form.elements.includeTimestamps.checked;
        USER_CONFIG.includeChapterHeaders = form.elements.includeChapterHeaders.checked;
        USER_CONFIG.openSameTab = form.elements.openSameTab.checked;
        USER_CONFIG.preventBackgroundExecution = form.elements.preventBackgroundExecution.checked;
        USER_CONFIG.ChatGPTPrompt = form.elements.ChatGPTPrompt.value;

        // initialize buttonIcons if not already
        USER_CONFIG.buttonIcons = USER_CONFIG.buttonIcons || {};

        // save button icons, removing empty values to use defaults
        const buttonIconCopy = form.elements.buttonIconCopy.value.trim();
        const buttonIconChatGPT = form.elements.buttonIconChatGPT.value.trim();
        const buttonIconSettings = form.elements.buttonIconSettings.value.trim();
        const buttonIconlazyLoad = form.elements.buttonIconlazyLoad.value.trim();
        const buttonIconDownload = form.elements.buttonIconDownload.value.trim();
        const buttonIconNotebookLM = form.elements.buttonIconNotebookLM.value.trim();

        USER_CONFIG.buttonIcons.copy = buttonIconCopy;
        USER_CONFIG.buttonIcons.ChatGPT = buttonIconChatGPT;
        USER_CONFIG.buttonIcons.download = buttonIconDownload;
        USER_CONFIG.buttonIcons.NotebookLM = buttonIconNotebookLM;
        USER_CONFIG.buttonIcons.lazyLoad = buttonIconlazyLoad;
        if (buttonIconSettings !== '') { USER_CONFIG.buttonIcons.settings = buttonIconSettings; } else { delete USER_CONFIG.buttonIcons.settings; }

        // save sub panels - links in header
        if (subPanelLinks) {
            USER_CONFIG.buttonLeft1Text = subPanelLinks.elements.buttonLeft1Text.value;
            USER_CONFIG.buttonLeft1Url = subPanelLinks.elements.buttonLeft1Url.value;
            USER_CONFIG.buttonLeft2Text = subPanelLinks.elements.buttonLeft2Text.value;
            USER_CONFIG.buttonLeft2Url = subPanelLinks.elements.buttonLeft2Url.value;
            USER_CONFIG.buttonLeft3Text = subPanelLinks.elements.buttonLeft3Text.value;
            USER_CONFIG.buttonLeft3Url = subPanelLinks.elements.buttonLeft3Url.value;
            USER_CONFIG.buttonLeft4Text = subPanelLinks.elements.buttonLeft4Text.value;
            USER_CONFIG.buttonLeft4Url = subPanelLinks.elements.buttonLeft4Url.value;
            USER_CONFIG.buttonLeft5Text = subPanelLinks.elements.buttonLeft5Text.value;
            USER_CONFIG.buttonLeft5Url = subPanelLinks.elements.buttonLeft5Url.value;
            USER_CONFIG.buttonLeft6Text = subPanelLinks.elements.buttonLeft6Text.value;
            USER_CONFIG.buttonLeft6Url = subPanelLinks.elements.buttonLeft6Url.value;
            USER_CONFIG.buttonLeft7Text = subPanelLinks.elements.buttonLeft7Text.value;
            USER_CONFIG.buttonLeft7Url = subPanelLinks.elements.buttonLeft7Url.value;
            USER_CONFIG.buttonLeft8Text = subPanelLinks.elements.buttonLeft8Text.value;
            USER_CONFIG.buttonLeft8Url = subPanelLinks.elements.buttonLeft8Url.value;
            USER_CONFIG.buttonLeft9Text = subPanelLinks.elements.buttonLeft9Text.value;
            USER_CONFIG.buttonLeft9Url = subPanelLinks.elements.buttonLeft9Url.value;
            USER_CONFIG.buttonLeft10Text = subPanelLinks.elements.buttonLeft10Text.value;
            USER_CONFIG.buttonLeft10Url = subPanelLinks.elements.buttonLeft10Url.value;
            USER_CONFIG.mButtonText = subPanelLinks.elements.mButtonText.value;
            USER_CONFIG.mButtonDisplay = subPanelLinks.elements.mButtonDisplay.checked;
        }

        // save sub panels - custom css
        if (subPanelCustomCSS) {
            USER_CONFIG.settingsGuide = subPanelCustomCSS.elements.settingsGuide.checked;
            USER_CONFIG.textTransform = subPanelCustomCSS.elements.textTransform.value;
            USER_CONFIG.defaultFontSize = parseFloat(subPanelCustomCSS.elements.defaultFontSize.value);
            USER_CONFIG.videosWatchedOpacity = parseFloat(subPanelCustomCSS.elements.videosWatchedOpacity.value);
            USER_CONFIG.videosHideWatchedGlobal = subPanelCustomCSS.elements.videosHideWatchedGlobal.checked;
            USER_CONFIG.videosHideWatched = subPanelCustomCSS.elements.videosHideWatched.checked;
            USER_CONFIG.videosPerRow = parseInt(subPanelCustomCSS.elements.videosPerRow.value);
            USER_CONFIG.sidebarWidth = parseFloat(subPanelCustomCSS.elements.sidebarWidth.value);
            USER_CONFIG.searchPosition = parseFloat(subPanelCustomCSS.elements.searchPosition.value);
            USER_CONFIG.spaceBelowPlayer = parseInt(subPanelCustomCSS.elements.spaceBelowPlayer.value) || 110;
            USER_CONFIG.videosHideWatchedGlobalJS = parseInt(subPanelCustomCSS.elements.videosHideWatchedGlobalJS.value);
            USER_CONFIG.videosHideWatchedHome = subPanelCustomCSS.elements.videosHideWatchedHome.checked;
            USER_CONFIG.videosHideWatchedSubscriptions = subPanelCustomCSS.elements.videosHideWatchedSubscriptions.checked;
            USER_CONFIG.videosHideWatchedChannels = subPanelCustomCSS.elements.videosHideWatchedChannels.checked;
            USER_CONFIG.videosHideWatchedPlaylist = subPanelCustomCSS.elements.videosHideWatchedPlaylist.checked;
            USER_CONFIG.videosHideWatchedVideo = subPanelCustomCSS.elements.videosHideWatchedVideo.checked;
            USER_CONFIG.videosHideWatchedSearch = subPanelCustomCSS.elements.videosHideWatchedSearch.checked;
            USER_CONFIG.autoOpenChapters = subPanelCustomCSS.elements.autoOpenChapters.checked;
            USER_CONFIG.autoOpenTranscript = subPanelCustomCSS.elements.autoOpenTranscript.checked;
            USER_CONFIG.autoOpenComments = subPanelCustomCSS.elements.autoOpenComments.checked;
            USER_CONFIG.transcriptTimestamps = subPanelCustomCSS.elements.transcriptTimestamps.checked;
            USER_CONFIG.displayRemainingTime = subPanelCustomCSS.elements.displayRemainingTime.checked;
            USER_CONFIG.showRemainingCompact = subPanelCustomCSS.elements.showRemainingCompact.checked;
            USER_CONFIG.progressBar = subPanelCustomCSS.elements.progressBar.checked;
            USER_CONFIG.hideShorts = subPanelCustomCSS.elements.hideShorts.checked;
            USER_CONFIG.redirectShorts = subPanelCustomCSS.elements.redirectShorts.checked;
            USER_CONFIG.hideAdSlots = subPanelCustomCSS.elements.hideAdSlots.checked;
            USER_CONFIG.hidePlayables = subPanelCustomCSS.elements.hidePlayables.checked;
            USER_CONFIG.hideProdTxt = subPanelCustomCSS.elements.hideProdTxt.checked;
            USER_CONFIG.hidePayToWatch = subPanelCustomCSS.elements.hidePayToWatch.checked;
            USER_CONFIG.hideFreeWithAds = subPanelCustomCSS.elements.hideFreeWithAds.checked;
            USER_CONFIG.hideMembersOnly = subPanelCustomCSS.elements.hideMembersOnly.checked;
            USER_CONFIG.hideLatestPosts = subPanelCustomCSS.elements.hideLatestPosts.checked;
            USER_CONFIG.videoTabView = subPanelCustomCSS.elements.videoTabView.checked;
            USER_CONFIG.toggleTheaterModeBtn = subPanelCustomCSS.elements.toggleTheaterModeBtn.checked;
            USER_CONFIG.tabViewChapters = subPanelCustomCSS.elements.tabViewChapters.checked;
            USER_CONFIG.hideCommentsSection = subPanelCustomCSS.elements.hideCommentsSection.checked;
            USER_CONFIG.hideVideosSection = subPanelCustomCSS.elements.hideVideosSection.checked;
            USER_CONFIG.playbackSpeed = subPanelCustomCSS.elements.playbackSpeed.checked;
            USER_CONFIG.playbackSpeedBtns = subPanelCustomCSS.elements.playbackSpeedBtns.checked;
            USER_CONFIG.playbackSpeedValue = parseFloat(subPanelCustomCSS.elements.playbackSpeedValue.value);
            USER_CONFIG.playbackSpeedKey1 = subPanelCustomCSS.elements.playbackSpeedKey1.value.trim();
            USER_CONFIG.playbackSpeedKey1s = subPanelCustomCSS.elements.playbackSpeedKey1s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey1s.value);
            USER_CONFIG.playbackSpeedKey2 = subPanelCustomCSS.elements.playbackSpeedKey2.value.trim();
            USER_CONFIG.playbackSpeedKey2s = subPanelCustomCSS.elements.playbackSpeedKey2s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey2s.value);
            USER_CONFIG.playbackSpeedKey3 = subPanelCustomCSS.elements.playbackSpeedKey3.value.trim();
            USER_CONFIG.playbackSpeedKey3s = subPanelCustomCSS.elements.playbackSpeedKey3s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey3s.value);
            USER_CONFIG.playbackSpeedKey4 = subPanelCustomCSS.elements.playbackSpeedKey4.value.trim();
            USER_CONFIG.playbackSpeedKey4s = subPanelCustomCSS.elements.playbackSpeedKey4s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey4s.value);
            USER_CONFIG.playbackSpeedKey5 = subPanelCustomCSS.elements.playbackSpeedKey5.value.trim();
            USER_CONFIG.playbackSpeedKey5s = subPanelCustomCSS.elements.playbackSpeedKey5s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey5s.value);
            USER_CONFIG.playbackSpeedKey6 = subPanelCustomCSS.elements.playbackSpeedKey6.value.trim();
            USER_CONFIG.playbackSpeedKey6s = subPanelCustomCSS.elements.playbackSpeedKey6s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey6s.value);
            USER_CONFIG.playbackSpeedKey7 = subPanelCustomCSS.elements.playbackSpeedKey7.value.trim();
            USER_CONFIG.playbackSpeedKey7s = subPanelCustomCSS.elements.playbackSpeedKey7s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey7s.value);
            USER_CONFIG.playbackSpeedKey8 = subPanelCustomCSS.elements.playbackSpeedKey8.value.trim();
            USER_CONFIG.playbackSpeedKey8s = subPanelCustomCSS.elements.playbackSpeedKey8s.value.trim() === '' ? '' : parseFloat(subPanelCustomCSS.elements.playbackSpeedKey8s.value);
            USER_CONFIG.playbackSpeedToggle = subPanelCustomCSS.elements.playbackSpeedToggle.value.trim() || 's';
            USER_CONFIG.playbackSpeedDecrease = subPanelCustomCSS.elements.playbackSpeedDecrease.value.trim() || 'a';
            USER_CONFIG.playbackSpeedIncrease = subPanelCustomCSS.elements.playbackSpeedIncrease.value.trim() || 'd';
            USER_CONFIG.defaultQuality = subPanelCustomCSS.elements.defaultQuality.value;
            USER_CONFIG.defaultTranscriptLanguage = subPanelCustomCSS.elements.defaultTranscriptLanguage.value;
            USER_CONFIG.defaultAudioLanguage = subPanelCustomCSS.elements.defaultAudioLanguage.value;
            USER_CONFIG.defaultSubtitleLanguage = subPanelCustomCSS.elements.defaultSubtitleLanguage.value;
            USER_CONFIG.hideVoiceSearch = subPanelCustomCSS.elements.hideVoiceSearch.checked;
            USER_CONFIG.selectionColor = subPanelCustomCSS.elements.selectionColor.checked;
            USER_CONFIG.hideCreateButton = subPanelCustomCSS.elements.hideCreateButton.checked;
            USER_CONFIG.hideNotificationBtn = subPanelCustomCSS.elements.hideNotificationBtn.checked;
            USER_CONFIG.hideNotificationBadge = subPanelCustomCSS.elements.hideNotificationBadge.checked;
            USER_CONFIG.hideOwnAvatar = subPanelCustomCSS.elements.hideOwnAvatar.checked;
            USER_CONFIG.hideRightSidebarSearch = subPanelCustomCSS.elements.hideRightSidebarSearch.checked;
            USER_CONFIG.hideBrandText = subPanelCustomCSS.elements.hideBrandText.checked;
            USER_CONFIG.visibleCountryCode = subPanelCustomCSS.elements.visibleCountryCode.checked;
            USER_CONFIG.visibleCountryCodeColor = subPanelCustomCSS.elements.visibleCountryCodeColor.value;
            USER_CONFIG.disablePlayOnHover = subPanelCustomCSS.elements.disablePlayOnHover.checked;
            USER_CONFIG.chronologicalNotifications = subPanelCustomCSS.elements.chronologicalNotifications.checked;
            USER_CONFIG.feedFilterChips = subPanelCustomCSS.elements.feedFilterChips.checked;
            USER_CONFIG.feedFilterChipsWatch = subPanelCustomCSS.elements.feedFilterChipsWatch.checked;
            USER_CONFIG.preventAutoplay = subPanelCustomCSS.elements.preventAutoplay.checked;
            USER_CONFIG.VerifiedArtist = subPanelCustomCSS.elements.VerifiedArtist.checked;
            USER_CONFIG.defaultQualityPremium = subPanelCustomCSS.elements.defaultQualityPremium.checked;
            USER_CONFIG.hideEndCards = subPanelCustomCSS.elements.hideEndCards.checked;
            USER_CONFIG.hideEndscreen = subPanelCustomCSS.elements.hideEndscreen.checked;
            USER_CONFIG.gradientBottom = subPanelCustomCSS.elements.gradientBottom.checked;
            USER_CONFIG.hideJoinButton = subPanelCustomCSS.elements.hideJoinButton.checked;
            USER_CONFIG.hidePlayNextButton = subPanelCustomCSS.elements.hidePlayNextButton.checked;
            USER_CONFIG.hideAirplayButton = subPanelCustomCSS.elements.hideAirplayButton.checked;
            USER_CONFIG.smallSubscribeButton = subPanelCustomCSS.elements.smallSubscribeButton.checked;
            USER_CONFIG.hideShareButton = subPanelCustomCSS.elements.hideShareButton.checked;
            USER_CONFIG.hideShareBtnGlobal = subPanelCustomCSS.elements.hideShareBtnGlobal.checked;
            USER_CONFIG.hideHashtags = subPanelCustomCSS.elements.hideHashtags.checked;
            USER_CONFIG.hideInfoPanel = subPanelCustomCSS.elements.hideInfoPanel.checked;
            USER_CONFIG.hideAddComment = subPanelCustomCSS.elements.hideAddComment.checked;
            USER_CONFIG.hideReplyButton = subPanelCustomCSS.elements.hideReplyButton.checked;
            USER_CONFIG.hidePlaylistsHome = subPanelCustomCSS.elements.hidePlaylistsHome.checked;
            USER_CONFIG.hideNewsHome = subPanelCustomCSS.elements.hideNewsHome.checked;
            USER_CONFIG.playProgressColor = subPanelCustomCSS.elements.playProgressColor.checked;
            USER_CONFIG.progressbarColorPicker = subPanelCustomCSS.elements.progressbarColorPicker.value;
            USER_CONFIG.lightModeSelectionColor = subPanelCustomCSS.elements.lightModeSelectionColor.value;
            USER_CONFIG.darkModeSelectionColor = subPanelCustomCSS.elements.darkModeSelectionColor.value;
            USER_CONFIG.pureBWBackground = subPanelCustomCSS.elements.pureBWBackground.checked;
            USER_CONFIG.noFrostedGlass = subPanelCustomCSS.elements.noFrostedGlass.checked;
            USER_CONFIG.removeScrubber = subPanelCustomCSS.elements.removeScrubber.checked;
            USER_CONFIG.autoTheaterMode = subPanelCustomCSS.elements.autoTheaterMode.checked;
            USER_CONFIG.maxVidSize = subPanelCustomCSS.elements.maxVidSize.checked;
            USER_CONFIG.expandVideoDescription = subPanelCustomCSS.elements.expandVideoDescription.checked;
            USER_CONFIG.channelReindirizzare = subPanelCustomCSS.elements.channelReindirizzare.checked;
            USER_CONFIG.channelRSSBtn = subPanelCustomCSS.elements.channelRSSBtn.checked;
            USER_CONFIG.channelPlaylistBtn = subPanelCustomCSS.elements.channelPlaylistBtn.checked;
            USER_CONFIG.playlistDirectionBtns = subPanelCustomCSS.elements.playlistDirectionBtns.checked;
            USER_CONFIG.playlistLinks = subPanelCustomCSS.elements.playlistLinks.checked;
            USER_CONFIG.playlistTrashCan = subPanelCustomCSS.elements.playlistTrashCan.checked;
            USER_CONFIG.plWLBtn = subPanelCustomCSS.elements.plWLBtn.checked;
            USER_CONFIG.commentsNewFirst = subPanelCustomCSS.elements.commentsNewFirst.checked;
            USER_CONFIG.hideFundraiser = subPanelCustomCSS.elements.hideFundraiser.checked;
            USER_CONFIG.hideLatestPostsHome = subPanelCustomCSS.elements.hideLatestPostsHome.checked;
            USER_CONFIG.hideMiniPlayer = subPanelCustomCSS.elements.hideMiniPlayer.checked;
            USER_CONFIG.hideQueueBtn = subPanelCustomCSS.elements.hideQueueBtn.checked;
            USER_CONFIG.closeChatWindow = subPanelCustomCSS.elements.closeChatWindow.checked;
            USER_CONFIG.lnbHideHomeBtn = subPanelCustomCSS.elements.lnbHideHomeBtn.checked;
            USER_CONFIG.lnbHideSubscriptionsBtn = subPanelCustomCSS.elements.lnbHideSubscriptionsBtn.checked;
            USER_CONFIG.lnbHideHistoryBtn = subPanelCustomCSS.elements.lnbHideHistoryBtn.checked;
            USER_CONFIG.lnbHidePlaylistsBtn = subPanelCustomCSS.elements.lnbHidePlaylistsBtn.checked;
            USER_CONFIG.lnbHideVideosBtn = subPanelCustomCSS.elements.lnbHideVideosBtn.checked;
            USER_CONFIG.lnbHideCoursesBtn = subPanelCustomCSS.elements.lnbHideCoursesBtn.checked;
            USER_CONFIG.lnbHideYPodcastsBtn = subPanelCustomCSS.elements.lnbHideYPodcastsBtn.checked;
            USER_CONFIG.lnbHideWlBtn = subPanelCustomCSS.elements.lnbHideWlBtn.checked;
            USER_CONFIG.lnbHideLikedVideosBtn = subPanelCustomCSS.elements.lnbHideLikedVideosBtn.checked;
            USER_CONFIG.lnbHideDLBtn = subPanelCustomCSS.elements.lnbHideDLBtn.checked;
            USER_CONFIG.lnbHideYouBtn = subPanelCustomCSS.elements.lnbHideYouBtn.checked;
            USER_CONFIG.lnbHideSubscriptionsSection = subPanelCustomCSS.elements.lnbHideSubscriptionsSection.checked;
            USER_CONFIG.lnbHideSubscriptionsTitle = subPanelCustomCSS.elements.lnbHideSubscriptionsTitle.checked;
            USER_CONFIG.lnbHideMoreBtn = subPanelCustomCSS.elements.lnbHideMoreBtn.checked;
            USER_CONFIG.lnbHideExploreSection = subPanelCustomCSS.elements.lnbHideExploreSection.checked;
            USER_CONFIG.lnbHideExploreTitle = subPanelCustomCSS.elements.lnbHideExploreTitle.checked;
            USER_CONFIG.lnbHideTrendingBtn = subPanelCustomCSS.elements.lnbHideTrendingBtn.checked;
            USER_CONFIG.lnbHideMusicBtn = subPanelCustomCSS.elements.lnbHideMusicBtn.checked;
            USER_CONFIG.lnbHideMoviesBtn = subPanelCustomCSS.elements.lnbHideMoviesBtn.checked;
            USER_CONFIG.lnbHideLiveBtn = subPanelCustomCSS.elements.lnbHideLiveBtn.checked;
            USER_CONFIG.lnbHideGamingBtn = subPanelCustomCSS.elements.lnbHideGamingBtn.checked;
            USER_CONFIG.lnbHideNewsBtn = subPanelCustomCSS.elements.lnbHideNewsBtn.checked;
            USER_CONFIG.lnbHideSportsBtn = subPanelCustomCSS.elements.lnbHideSportsBtn.checked;
            USER_CONFIG.lnbHideLearningBtn = subPanelCustomCSS.elements.lnbHideLearningBtn.checked;
            USER_CONFIG.lnbHideFashionBtn = subPanelCustomCSS.elements.lnbHideFashionBtn.checked;
            USER_CONFIG.lnbHidePodcastsBtn = subPanelCustomCSS.elements.lnbHidePodcastsBtn.checked;
            USER_CONFIG.lnbHideMoreSection = subPanelCustomCSS.elements.lnbHideMoreSection.checked;
            USER_CONFIG.lnbHideMoreTitle = subPanelCustomCSS.elements.lnbHideMoreTitle.checked;
            USER_CONFIG.lnbHideYtPremiumBtn = subPanelCustomCSS.elements.lnbHideYtPremiumBtn.checked;
            USER_CONFIG.lnbHideYtStudioBtn = subPanelCustomCSS.elements.lnbHideYtStudioBtn.checked;
            USER_CONFIG.lnbHideYtMusicBtn = subPanelCustomCSS.elements.lnbHideYtMusicBtn.checked;
            USER_CONFIG.lnbHideYtKidsBtn = subPanelCustomCSS.elements.lnbHideYtKidsBtn.checked;
            USER_CONFIG.lnbHidePenultimateSection = subPanelCustomCSS.elements.lnbHidePenultimateSection.checked;
            USER_CONFIG.lnbHideSettingsBtn = subPanelCustomCSS.elements.lnbHideSettingsBtn.checked;
            USER_CONFIG.lnbHideReportHistoryBtn = subPanelCustomCSS.elements.lnbHideReportHistoryBtn.checked;
            USER_CONFIG.lnbHideHelpBtn = subPanelCustomCSS.elements.lnbHideHelpBtn.checked;
            USER_CONFIG.lnbHideFeedbackBtn = subPanelCustomCSS.elements.lnbHideFeedbackBtn.checked;
            USER_CONFIG.lnbHideFooter = subPanelCustomCSS.elements.lnbHideFooter.checked;
            USER_CONFIG.displayFullTitle = subPanelCustomCSS.elements.displayFullTitle.checked;
            USER_CONFIG.squareSearchBar = subPanelCustomCSS.elements.squareSearchBar.checked;
            USER_CONFIG.squareDesign = subPanelCustomCSS.elements.squareDesign.checked;
            USER_CONFIG.squareAvatars = subPanelCustomCSS.elements.squareAvatars.checked;
            USER_CONFIG.compactLayout = subPanelCustomCSS.elements.compactLayout.checked;
            USER_CONFIG.noAmbientMode = subPanelCustomCSS.elements.noAmbientMode.checked;
        }

        // save sub panels - color code videos
        if (subPanelColor) {
            USER_CONFIG.colorCodeVideosEnabled = subPanelColor.elements.colorCodeVideosEnabled.checked;
            USER_CONFIG.homeDisableHover = subPanelColor.elements.homeDisableHover.checked;
            USER_CONFIG.videosOldOpacity = parseFloat(subPanelColor.elements.videosOldOpacity.value);
            USER_CONFIG.videosAgeColorPickerNewly = subPanelColor.elements.videosAgeColorPickerNewly.value;
            USER_CONFIG.videosAgeColorPickerNewlyLight = subPanelColor.elements.videosAgeColorPickerNewlyLight.value;
            USER_CONFIG.videosAgeColorPickerRecent = subPanelColor.elements.videosAgeColorPickerRecent.value;
            USER_CONFIG.videosAgeColorPickerRecentLight = subPanelColor.elements.videosAgeColorPickerRecentLight.value;
            USER_CONFIG.videosAgeColorPickerLately = subPanelColor.elements.videosAgeColorPickerLately.value;
            USER_CONFIG.videosAgeColorPickerLatelyLight = subPanelColor.elements.videosAgeColorPickerLatelyLight.value;
            USER_CONFIG.videosAgeColorPickerLatterly = subPanelColor.elements.videosAgeColorPickerLatterly.value;
            USER_CONFIG.videosAgeColorPickerLatterlyLight = subPanelColor.elements.videosAgeColorPickerLatterlyLight.value;
            USER_CONFIG.videosAgeColorPickerLive = subPanelColor.elements.videosAgeColorPickerLive.value;
            USER_CONFIG.videosAgeColorPickerLiveLight = subPanelColor.elements.videosAgeColorPickerLiveLight.value;
            USER_CONFIG.videosAgeColorPickerStreamed = subPanelColor.elements.videosAgeColorPickerStreamed.value;
            USER_CONFIG.videosAgeColorPickerStreamedLight = subPanelColor.elements.videosAgeColorPickerStreamedLight.value;
            USER_CONFIG.videosAgeColorPickerUpcoming = subPanelColor.elements.videosAgeColorPickerUpcoming.value;
            USER_CONFIG.videosAgeColorPickerUpcomingLight = subPanelColor.elements.videosAgeColorPickerUpcomingLight.value;
            USER_CONFIG.lastSeenVideo = subPanelColor.elements.lastSeenVideo.checked;
            USER_CONFIG.lastSeenVideoScroll = subPanelColor.elements.lastSeenVideoScroll.checked;
            USER_CONFIG.lastSeenVideoColor = subPanelColor.elements.lastSeenVideoColor.value;
            USER_CONFIG.lastSeenVideoColorLight = subPanelColor.elements.lastSeenVideoColorLight.value;
        }

        // save updated config
        try {
            await GM.setValue('USER_CONFIG', USER_CONFIG);
            window.closeAlchemySettingsModal();
            showNotification('Settings have been updated!');
            setTimeout(() => { location.reload(); }, 900);
        } catch (error) {
            showNotification('Error saving settings!');
            console.error("YouTubeAlchemy: Error saving user configuration:", error);
        }
    }

    // export and import settings
    async function exportSettings() {
        try {
            const scriptVersion = GM.info.script.version;
            const settingsString = JSON.stringify(USER_CONFIG, null, 2);
            const filename = `YouTube-Alchemy_v${scriptVersion}_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            const blob = new Blob([settingsString], { type: 'application/json' });
            const file = new File([blob], filename, { type: 'application/json' });

            if ((navigator.maxTouchPoints > 0 || /iPhone|iPad|Android/i.test(navigator.userAgent)) && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                docBody.appendChild(a);
                a.click();
                docBody.removeChild(a);
                URL.revokeObjectURL(url);
            }
            showNotification('Settings have been exported.');
        } catch (error) {
            showNotification("Error exporting settings!");
            console.error("YouTubeAlchemy: Error exporting user settings:", error);
        }
    }

    let fileInputSettings;
    function importSettings() {
        const handleFile = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                try {
                    const importedConfig = JSON.parse(fileContent);
                    if (typeof importedConfig === 'object' && importedConfig !== null) {
                        USER_CONFIG = { ...DEFAULT_CONFIG, ...importedConfig };
                        GM.setValue('USER_CONFIG', USER_CONFIG);
                        showNotification('Settings have been imported.');
                        setTimeout(() => { location.reload(); }, 900);
                    } else {
                        showNotification('Invalid JSON format!');
                    }
                } catch (error) {
                    showNotification('Invalid JSON format!');
                }
            };
            reader.readAsText(file);
        };

        if (!fileInputSettings) {
            fileInputSettings = document.createElement('input');
            fileInputSettings.type = 'file';
            fileInputSettings.accept = 'application/json';
            fileInputSettings.id = 'fileInputSettings';

            fileInputSettings.style.position = 'fixed';
            fileInputSettings.style.left = '-9999px';
            fileInputSettings.style.top = '0';
            fileInputSettings.style.width = '1px';
            fileInputSettings.style.height = '1px';
            fileInputSettings.style.opacity = '0';

            fileInputSettings.addEventListener('change', handleFile);
            docBody.appendChild(fileInputSettings);
        } else fileInputSettings.value = '';

        typeof fileInputSettings.showPicker === 'function' ? fileInputSettings.showPicker() : fileInputSettings.click();
    }

    // function to display a notification for settings change or reset
    function showNotification(message) {
        const overlay = document.createElement('div');
        overlay.classList.add('CentAnni-overlay');

        const modal = document.createElement('div');
        modal.classList.add('CentAnni-notification');
        modal.textContent = message;

        overlay.appendChild(modal);
        docBody.appendChild(overlay);

        setTimeout(() => { overlay.remove(); }, 1000);
    }

    // function to add the transcript exporter buttons
    function buttonLocation(buttons, callback) {
        const masthead = endElement;
        const guide = headerElement;
        if (masthead) {
            buttons.forEach(({ id, text, clickHandler, tooltip }) => {

                // button wrapper
                const buttonWrapper = document.createElement('div');
                buttonWrapper.classList.add('CentAnni-button-wrapper');

                // buttons
                const button = document.createElement('button');
                button.id = id;
                button.textContent = text;
                button.classList.add('button-style');
                if (id === 'transcript-settings-button') {
                    button.classList.add('button-style-settings');
                }

                button.addEventListener('click', clickHandler);

                // tooltip div
                const tooltipDiv = document.createElement('div');
                tooltipDiv.textContent = tooltip;
                tooltipDiv.classList.add('button-tooltip');

                // tooltip arrow
                const arrowDiv = document.createElement('div');
                arrowDiv.classList.add('button-tooltip-arrow');
                tooltipDiv.appendChild(arrowDiv);

                // show and hide tooltip on hover
                let tooltipTimeout;
                button.addEventListener('mouseenter', () => {
                    tooltipTimeout = setTimeout(() => {
                        tooltipDiv.style.visibility = 'visible';
                        tooltipDiv.style.opacity = '1';
                    }, 700);
                });

                button.addEventListener('mouseleave', () => {
                    clearTimeout(tooltipTimeout);
                    tooltipDiv.style.visibility = 'hidden';
                    tooltipDiv.style.opacity = '0';
                });

                // append button elements
                buttonWrapper.appendChild(button);
                buttonWrapper.appendChild(tooltipDiv);
                id === 'transcript-settings-button' && USER_CONFIG.settingsGuide && guide ? guide.append(buttonWrapper) : masthead.prepend(buttonWrapper);
            });
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const masthead = endElement;
                if (masthead) {
                    obs.disconnect();
                    if (callback) callback();
                }
            });
            observer.observe(docBody, { childList: true, subtree: true });
        }
    }

    async function runYTE() {
        let transcriptLoaded = false;
        try { await preLoadTranscript(); transcriptLoaded = true; }
        catch (error) { setTimeout(() => { createButtons('settings'); }, 3000); }
        if (transcriptLoaded) createButtons('all');
    }

    function createButtons(buttonType = 'all') {
        const allButtons = {
            settings: { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Alchemy Settings', ariaLabel: 'YouTube Alchemy Settings.' },
            download: { id: 'transcript-download-button', text: USER_CONFIG.buttonIcons.download, clickHandler: handleDownloadClick, tooltip: 'Download Transcript as a Text File', ariaLabel: 'Download Transcript as a Text File.' },
            copy: { id: 'transcript-copy-button', text: USER_CONFIG.buttonIcons.copy, clickHandler: handleCopyClick, tooltip: 'Copy Transcript to Clipboard', ariaLabel: 'Copy Transcript to Clipboard.' },
            chatgpt: { id: 'transcript-ChatGPT-button', text: USER_CONFIG.buttonIcons.ChatGPT, clickHandler: handleChatGPTClick, tooltip: `Copy Transcript with a Prompt and Open ${ChatGPTLabel}`, ariaLabel: `Copy Transcript to Clipboard with a Prompt and Open ${ChatGPTLabel}.` },
            notebooklm: { id: 'transcript-NotebookLM-button', text: USER_CONFIG.buttonIcons.NotebookLM, clickHandler: handleNotebookLMClick, tooltip: `Copy Transcript and Open ${NotebookLMLabel}`, ariaLabel: `Copy Transcript to Clipboard and Open ${NotebookLMLabel}.` },
            lazyload: { id: 'transcript-lazy-button', text: USER_CONFIG.buttonIcons.lazyLoad, clickHandler: runYTE, tooltip: 'Load Transcript', ariaLabel: 'Load Transcript.' }
        };

        let buttonsToCreate = [];

        switch (buttonType) {
            case 'all':
                buttonsToCreate = Object.values(allButtons).filter(button => button.id === 'transcript-settings-button' || (button.text && button.text.trim() !== '')).filter(button => button !== allButtons.lazyload);
                break;

            case 'settings':
                buttonsToCreate = [allButtons.settings];
                break;

            case 'lazyload':
                buttonsToCreate = [allButtons.lazyload];
                break;
            default:
                if (Array.isArray(buttonType)) buttonsToCreate = buttonType.map(type => allButtons[type]).filter(Boolean);
        }

        document.querySelectorAll('.CentAnni-button-wrapper').forEach(el => el.remove());
        buttonLocation(buttonsToCreate, () => createButtons(buttonType));
    }

    // functions to handle the button clicks
    function handleChatGPTClick() { handleTranscriptAction(function () { selectAndCopyTranscript('ChatGPT'); }); }
    function handleNotebookLMClick() { handleTranscriptAction(function () { selectAndCopyTranscript('NotebookLM'); }); }
    function handleCopyClick() { handleTranscriptAction(function () { selectAndCopyTranscript('Copy2Clipboard'); }); }
    function handleDownloadClick() { handleTranscriptAction(downloadTranscriptAsText); }

    // function to check for a transcript
    function handleTranscriptAction(callback) {
        const transcriptButton = document.querySelector('#button-container button[aria-label="Show transcript"]');
        const transcriptSection = document.querySelector('ytd-video-description-transcript-section-renderer');

        if (!transcriptButton && !transcriptSection) {
            console.error("YouTubeAlchemy: Transcript button or section not found. Subtitles or closed captions are unavailable or language is unsupported. Reload this page to try again.");
            alert('Transcript unavailable or cannot be found.\nEnsure the video has a transcript.\nReload this page to try again.');
            return;
        }

        const transcriptItems = document.querySelectorAll('ytd-transcript-segment-list-renderer ytd-transcript-segment-renderer');
        if (transcriptItems.length === 0) {
            console.error("YouTubeAlchemy: Transcript has not loaded.");
            alert('Transcript has not loaded successfully.\nReload this page to try again.');
            return;
        }

        callback();
    }

    // function to get video information
    function getVideoInfo() {
        const ytTitle = watchFlexyElement.querySelector('div#title h1 > yt-formatted-string')?.textContent.trim() || 'N/A';
        const channelName = watchFlexyElement.querySelector('ytd-video-owner-renderer ytd-channel-name#channel-name yt-formatted-string#text a')?.textContent.trim() || 'N/A';
        const uploadDate = watchFlexyElement.querySelector('ytd-video-primary-info-renderer #info-strings yt-formatted-string')?.textContent.trim() || 'N/A';
        const videoURL = window.location.href;

        return { ytTitle, channelName, uploadDate, videoURL };
    }

    // function to get the transcript text
    function getTranscriptText() {
        const transcriptContainer = watchFlexyElement.querySelector('ytd-transcript-segment-list-renderer #segments-container');
        if (!transcriptContainer) {
            console.error("YouTubeAlchemy: Transcript container not found.");
            return '';
        }

        const transcriptElements = transcriptContainer.children;
        const transcriptLines = [];
        let currentLine = '';
        let lastTime = null;

        [...transcriptElements].forEach(element => {
            if (element.tagName === 'YTD-TRANSCRIPT-SECTION-HEADER-RENDERER') {

                // chapter header segment
                if (USER_CONFIG.includeChapterHeaders) {
                    const chapterTitleElement = element.querySelector('h2 > span');
                    if (chapterTitleElement) {
                        if (currentLine) {
                            transcriptLines.push(currentLine);
                            currentLine = '';
                        }
                        const chapterTitle = chapterTitleElement.textContent.trim();
                        transcriptLines.push(`\nChapter: ${chapterTitle}`);
                        lastTime = null;
                    }
                }
            } else if (element.tagName === 'YTD-TRANSCRIPT-SEGMENT-RENDERER') {

                // transcript segment
                const timeElement = element.querySelector('.segment-timestamp');
                const textElement = element.querySelector('.segment-text');
                if (timeElement && textElement) {
                    const time = timeElement.textContent.trim();
                    const text = textElement.textContent.replace(/\s+/g, ' ').trim();

                    if (time === lastTime) {
                        currentLine += ` ${text}`;
                    } else {
                        if (currentLine) transcriptLines.push(currentLine);
                        currentLine = USER_CONFIG.includeTimestamps ? `${time} ${text}` : text;
                        lastTime = time;
                    }
                }
            }
        });

        if (currentLine) transcriptLines.push(currentLine);
        return transcriptLines.join('\n');
    }

    // function to select and copy the transcript into the clipboard
    function selectAndCopyTranscript(target) {
        const transcriptText = getTranscriptText();
        const { ytTitle, channelName, uploadDate, videoURL } = getVideoInfo();

        let finalText = '';
        let targetUrl = '';

        if (target === 'ChatGPT') {
            finalText = `YouTube Transcript:\n${transcriptText.trimStart()}\n\n\nAdditional Information about the YouTube Video:\nTitle: ${ytTitle}\nChannel: ${channelName}\nUpload Date: ${uploadDate}\nURL: ${videoURL}\n\n\nTask Instructions:\n${USER_CONFIG.ChatGPTPrompt}`;
            targetUrl = USER_CONFIG.targetChatGPTUrl;
        } else if (target === 'NotebookLM' || target === 'Copy2Clipboard') {
            finalText = `Information about the YouTube Video:\nTitle: ${ytTitle}\nChannel: ${channelName}\nUpload Date: ${uploadDate}\nURL: ${videoURL}\n\n\nYouTube Transcript:\n${transcriptText.trimStart()}`;
            targetUrl = USER_CONFIG.targetNotebookLMUrl;
        }

        navigator.clipboard.writeText(finalText).then(() => {
            if (target === 'Copy2Clipboard') showNotification('Transcript Copied to Clipboard.');
            else {
                target === 'NotebookLM' ? showNotification(`Transcript Copied. Opening ${NotebookLMLabel} . . .`) : showNotification(`Transcript Copied. Opening ${ChatGPTLabel} . . .`);
                USER_CONFIG.openSameTab ? window.open(targetUrl, '_self') : window.open(targetUrl, '_blank');
            }
        });
    }

    // function to get the formatted transcript with video details for the text file
    function getFormattedTranscript() {
        const transcriptText = getTranscriptText();
        const { ytTitle, channelName, uploadDate, videoURL } = getVideoInfo();

        return `Information about the YouTube Video:\nTitle: ${ytTitle}\nChannel: ${channelName}\nUpload Date: ${uploadDate}\nURL: ${videoURL}\n\n\nYouTube Transcript:\n${transcriptText.trimStart()}`;
    }

    // function to download the transcript as a text file
    function downloadTranscriptAsText() {
        const finalText = getFormattedTranscript();
        const { ytTitle, channelName, uploadDate } = getVideoInfo();
        const blob = new Blob([finalText], { type: 'text/plain' });

        const sanitize = str => str.replace(/[<>:"/\\|?*]+/g, '');
        const uploadDateFormatted = new Date(uploadDate).toLocaleDateString("en-CA");

        // naming of text file based on user setting
        let fileName = '';
        switch (USER_CONFIG.fileNamingFormat) {
            case 'title-channel': fileName = `${sanitize(ytTitle)} - ${sanitize(channelName)}.txt`; break;
            case 'channel-title': fileName = `${sanitize(channelName)} - ${sanitize(ytTitle)}.txt`; break;
            case 'date-title-channel': fileName = `${sanitize(uploadDateFormatted)} - ${sanitize(ytTitle)} - ${sanitize(channelName)}.txt`; break;
            case 'date-channel-title': fileName = `${sanitize(uploadDateFormatted)} - ${sanitize(channelName)} - ${sanitize(ytTitle)}.txt`; break;
            default: fileName = `${sanitize(ytTitle)} - ${sanitize(channelName)}.txt`;
        }

        const url = URL.createObjectURL(blob);

        // create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        docBody.appendChild(a);
        a.click();

        // clean up
        docBody.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('File has been downloaded.');
    }

    // function to preload the transcript
    function preLoadTranscript() {
        return new Promise((resolve, reject) => {
            document.querySelectorAll('.CentAnni-button-wrapper').forEach(el => el.remove());
            if (isLiveVideo) {
                showNotificationError("Live Stream, No Transcript");
                reject();
                return;
            }

            if (!hasTranscriptPanel) {
                showNotificationError("Transcript Not Available");
                reject();
                return;
            }

            const masthead = document.querySelector("#end");
            const notification = document.createElement("div");
            notification.classList.add("CentAnni-notification-error", "loading");
            const textSpan = document.createElement("span");
            textSpan.textContent = "Transcript Is Loading";
            notification.appendChild(textSpan);
            masthead.prepend(notification);

            let loaded = false;
            let transcriptObserver;
            let fallbackTimer;
            let containerObserver;

            const isClosed = transcriptPanel?.getAttribute("visibility") === "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN";
            if (isClosed) {
                transcriptPanel.classList.add("transcript-preload");
                transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            }

            const cleanup = (failed) => {
                if (fallbackTimer) clearTimeout(fallbackTimer);
                containerObserver?.disconnect();
                transcriptObserver?.disconnect();
                notification?.remove();
                if (isClosed) {
                    transcriptPanel.classList.remove("transcript-preload");
                    transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
                }
                if (failed) showNotificationError("Transcript Failed to Load");
            };

            const handleTranscriptReady = () => {
                loaded = true;
                cleanup(false);
                if (!transcriptMenuButtonMoved) transcriptMenuButton();
                if (USER_CONFIG.transcriptTimestamps) enableTimestamps();
                if (USER_CONFIG.defaultTranscriptLanguage !== 'auto') setTimeout(() => { setTranscriptLanguage(); }, 250);
            };

            const segmentsContainer = transcriptPanel.querySelector('ytd-transcript-segment-list-renderer #segments-container');
            const firstItem = segmentsContainer?.querySelector('ytd-transcript-segment-renderer');

            if (segmentsContainer && firstItem) {
                handleTranscriptReady();
                resolve();
                return;
            }

            fallbackTimer = setTimeout(() => {
                if (!loaded) {
                    console.error("YouTubeAlchemy: The transcript took too long to load. Reload this page to try again.");
                    cleanup(true);
                    reject();
                }
            }, 10000);

            containerObserver = new MutationObserver(() => {
                const segmentsContainer = transcriptPanel.querySelector('ytd-transcript-segment-list-renderer #segments-container');
                if (segmentsContainer) {
                    containerObserver.disconnect();
                    const checkFirstItem = () => {
                        const firstItem = segmentsContainer.querySelector('ytd-transcript-segment-renderer');
                        if (firstItem) {
                            handleTranscriptReady();
                            return true;
                        }
                        return false;
                    };

                    if (!checkFirstItem()) {
                        transcriptObserver = new MutationObserver(() => {
                            if (checkFirstItem()) {
                                transcriptObserver.disconnect();
                                resolve();
                            }
                        });
                        transcriptObserver.observe(segmentsContainer, { childList: true });
                    } else resolve();

                }
            });
            containerObserver.observe(transcriptPanel, { childList: true, subtree: true });
        });
    }

    // function to display a notification if transcript cannot be found
    function showNotificationError(message) {
        const masthead = endElement;
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('CentAnni-notification-error');

        masthead.prepend(notification);

        if (document.visibilityState === 'hidden') {
            document.addEventListener('visibilitychange', function handleVisibilityChange() {
                if (document.visibilityState === 'visible') {
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    setTimeout(() => notification.remove(), 3000);
                }
            });
        } else { setTimeout(() => notification.remove(), 3000); }
    }

    // helper function to switch theater mode
    function toggleTheaterMode() {
        const event = new KeyboardEvent('keydown', {
            key: 'T',
            code: 'KeyT',
            keyCode: 84,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    }

    // set audio and subtitle language
    async function setLanguage() {
        docElement.classList.add('CentAnni-style-hide-yt-settings');
        if (USER_CONFIG.defaultAudioLanguage !== 'auto') await setTrackLanguage('.ytp-menuitem.ytp-audio-menu-item', audioInLanguage);
        if (USER_CONFIG.defaultSubtitleLanguage !== 'auto') { await setTrackLanguage(() => [...watchFlexyElement.querySelectorAll('.ytp-menuitem')].find(el => el.textContent.toLowerCase().includes(languageMap[new Intl.DisplayNames(['en'], { type: 'language' }).of(uiLanguage).toLowerCase()].nativeSubtitles.toLowerCase())), subtitleInLanguage); }
        docBody.click();
        watchFlexyElement.querySelector('#movie_player').focus();
        docElement.classList.remove('CentAnni-style-hide-yt-settings');
    }

    async function setTrackLanguage(categorySelector, languagePattern) {
        const settingsPanel = '.ytp-settings-menu';
        const settingsHeader = '.ytp-panel-header';
        const settingsButton = '.ytp-settings-button';

        function waitFor(selectorOrFn, ctx = document, timeout = 7000) {
            return new Promise((resolve, reject) => {
                const lookup = () => (typeof selectorOrFn === 'function')
                    ? selectorOrFn()
                    : ctx.querySelector(selectorOrFn);

                if (lookup()) { resolve(lookup()); return; }

                const timer = setTimeout(() => { observer.disconnect(); reject(); }, timeout);
                const observer = new MutationObserver(() => {
                    const node = lookup();
                    if (node) {
                        clearTimeout(timer);
                        observer.disconnect();
                        resolve(node);
                    }
                });
                observer.observe(ctx, { childList: true, subtree: true });
            });
        }

        if (!watchFlexyElement.querySelector(settingsPanel) || getComputedStyle(watchFlexyElement.querySelector(settingsPanel)).display === 'none') {
            watchFlexyElement.querySelector(settingsButton).click();
            await waitFor(settingsPanel);
        }

        const panel = watchFlexyElement.querySelector(settingsPanel);
        const headerBtn = panel.querySelector(settingsHeader);
        if (headerBtn) {
            headerBtn.click();
            await waitFor(categorySelector, panel);
        }

        const categoryItem = typeof categorySelector === 'function' ? categorySelector() : panel.querySelector(categorySelector);
        if (!categoryItem) { console.error('YouTubeAlchemy Category not found'); return; }
        categoryItem.click();

        await waitFor('.ytp-menuitem', panel);

        const items = [...panel.querySelectorAll('.ytp-menuitem')];
        const target = items.find(el => new RegExp(`^${languagePattern}\\b`, 'i').test(el.textContent.trim())) || items.find(el => new RegExp(`^${englishInLanguage}\\b`, 'i').test(el.textContent.trim()));
        if (!target) { console.error('YouTubeAlchemy Language not found'); return; }
        target.click();

        if (USER_CONFIG.defaultSubtitleLanguage === 'off') {
            setTimeout(() => {
                const ccButton = watchFlexyElement.querySelector('.ytp-chrome-bottom .ytp-subtitles-button');
                if (ccButton?.getAttribute('aria-pressed') === 'true') ccButton.click();
            }, 500);
        }

        await new Promise(resolve => setTimeout(resolve, 125));
    }

    // set default transcript language
    function setTranscriptLanguage() {
        const menuTrigger = transcriptPanel.querySelector('tp-yt-paper-button#label');
        const labelTextEl = transcriptPanel.querySelector('#label-text');
        if (!menuTrigger || !labelTextEl) return;

        const itemsArray = [...transcriptPanel.querySelectorAll('tp-yt-paper-item')];
        const target = itemsArray.find(el => new RegExp(`^${transcriptInLanguage}\\b`, 'i').test(el.textContent.trim())) || itemsArray.find(el => new RegExp(`^${englishInLanguage}\\b`, 'i').test(el.textContent.trim()));
        if (!target) { console.error('YouTubeAlchemy Language not found'); return; }
        target.click();
    }

    // function tab view on video page
    function runInPage(fn) {
        const c = `;(${fn})();`;
        const s = document.createElement('script');
        s.text = scriptPolicy ? scriptPolicy.createScript(c) : c;
        document.documentElement.appendChild(s);
        s.remove();
    }

    function tabView() {
        if (!watchFlexyElement) return;

        let liveChat = !!document.querySelector('ytd-watch-flexy[should-stamp-chat]');
        let singleColumn = !!document.querySelector('ytd-watch-flexy[is-single-column]');
        transcriptMenuButtonMoved = false;
        let transcriptLanguageSet = false;
        let timestampsEnabled = false;
        let lastActiveTab = null;
        let currentActiveTab = null;
        let isFirstRun = true;
        let tabElements = [];
        let subheaderDiv;

        // helper function to determine the default tab
        // priority: transcript > chapters > comments > info
        function determineActiveTab() {
            let activeTabId = 'tab-1';
            if (USER_CONFIG.autoOpenTranscript) { const tab5 = watchFlexyElement.querySelector('[data-tab="tab-5"]'); if (tab5) return 'tab-5'; }
            if (USER_CONFIG.autoOpenChapters) { const tab4 = watchFlexyElement.querySelector('[data-tab="tab-4"]'); if (tab4) return 'tab-4'; }
            if (USER_CONFIG.autoOpenComments) { const tab2 = watchFlexyElement.querySelector('[data-tab="tab-2"]'); if (tab2) return 'tab-2'; }
            return activeTabId;
        }

        // helper function active tab
        function activateTab(tabId) {
            const tab = watchFlexyElement.querySelector(`[data-tab="${tabId}"]`);
            if (tab) tab.classList.add('active');
            currentActiveTab = tabId;
        }

        // function to update tabView based on player layout
        function updateTabView() {
            const isTheater = watchFlexyElement.hasAttribute('theater');
            const isDefault = watchFlexyElement.hasAttribute('default-layout');

            // if no mode change do nothing
            if ((isTheater && isTheaterMode === true) || (isDefault && isTheaterMode === false)) {
                if (isFirstRun && isTheaterMode) {
                    if (subheaderDiv) subheaderDiv.addEventListener('click', handleTabViewTabClick);
                    isFirstRun = false;
                } else if (isFirstRun && !isTheaterMode) isFirstRun = false;
            }

            if (isTheater) {
                isTheaterMode = true;

                const activeTab = watchFlexyElement.querySelector('.CentAnni-tabView-tab.active');
                if (activeTab) lastActiveTab = activeTab.dataset.tab;

                tabElements.forEach(obj => obj.element.classList.remove('active'));
                currentActiveTab = null;

                if (subheaderDiv) subheaderDiv.addEventListener('click', handleTabViewTabClick);
            } else if (isDefault) {
                isTheaterMode = false;

                if (lastActiveTab) activateTab(lastActiveTab);
                else activateTab(determineActiveTab());

                if (lastActiveTab === 'tab-1') videoInfo.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
                else if (currentActiveTab === 'tab-4') runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
                else if (currentActiveTab === 'tab-5') runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");

                subheaderDiv.removeEventListener('click', handleTabViewTabClick);
            }
        }

        const fullscreenListener = () => { setTimeout(() => handleFullscreenChangeTV(), 250); };
        document.addEventListener('fullscreenchange', fullscreenListener);
        function handleFullscreenChangeTV() {
            const isDefault = watchFlexyElement.hasAttribute('default-layout');
            const panel = activePanel[currentActiveTab];
            if (isDefault && (currentActiveTab === 'tab-4' || currentActiveTab === 'tab-5') && panel?.getAttribute('visibility') !== 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')
                currentActiveTab === 'tab-4' ? runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED") : runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            if (liveChat && singleColumn) toggleYouTubeColumns();
        }

        // mode change, navigation, and clean up
        document.addEventListener('yt-set-theater-mode-enabled', updateTabView);
        const cleanupOnNavigation = () => {
            tabElements = [];
            subheaderDiv.removeEventListener('click', handleTabViewTabClick);
            document.removeEventListener('yt-set-theater-mode-enabled', updateTabView);
            document.removeEventListener('fullscreenchange', fullscreenListener);
            tabElements.forEach(tab => { tab.element.removeEventListener('click', tab.handler); });
            tabElements.forEach(tab => tab.element.classList.remove('active'));
            if (hasTranscriptPanel) transcriptPanel.remove();
            if (hasChapterPanel) chapterPanel.remove();
            if (videoInfo) videoInfo.remove();
        };
        document.addEventListener('yt-navigate-start', cleanupOnNavigation, { once: true });

        // click listener for tabView buttons
        function handleTabViewTabClick(event) {
            const tab = event.target.closest('.CentAnni-tabView-tab');
            if (!tab || !isTheaterMode) return;
            lastActiveTab = tab.dataset.tab;
            toggleTheaterMode();
        }

        // include date in info text under videos unless live
        if (!isLiveVideo) {
            const infoContainer = watchFlexyElement.querySelector('#info-container');
            const infoTime = infoContainer?.querySelector('yt-formatted-string span:nth-child(3)');
            if (infoTime) {
                if (!infoTime.parentNode?.querySelector('.CentAnni-info-date')) {
                    const dateStringElement = watchFlexyElement.querySelector('#info-strings yt-formatted-string');
                    const dateString = dateStringElement?.textContent?.trim() ?? "";

                    if (dateString) {
                        const newSpan = document.createElement('span');
                        newSpan.classList.add('CentAnni-info-date', 'bold', 'style-scope', 'yt-formatted-string');
                        newSpan.textContent = `(${dateString})`;

                        infoTime.parentNode?.insertBefore(newSpan, infoTime.nextSibling);
                    }
                }
            }
        }

        // tabView location
        const secondaryElement = watchFlexyElement.querySelector('#secondary');
        if (!secondaryElement) return;

        // grab info, donation, and more video panels
        const videoInfo = watchFlexyElement.querySelector(infoSel);
        const donationShelf = watchFlexyElement.querySelector('#donation-shelf');
        const videoMore = watchFlexyElement.querySelector('#related.style-scope.ytd-watch-flexy');

        // open info, chapter, transcript panel or comments by default
        if (USER_CONFIG.autoOpenTranscript && hasTranscriptPanel) {
            runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            if (!USER_CONFIG.YouTubeTranscriptExporter && USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !transcriptLanguageSet) { waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); }); transcriptLanguageSet = true; }
            if (!USER_CONFIG.YouTubeTranscriptExporter && USER_CONFIG.transcriptTimestamps && !timestampsEnabled) { waitForTranscriptWithoutYTE(enableTimestamps); timestampsEnabled = true; }
            if (!transcriptMenuButtonMoved && (!USER_CONFIG.YouTubeTranscriptExporter || USER_CONFIG.lazyTranscriptLoading)) { waitForTranscriptWithoutYTE(transcriptMenuButton); }
        }
        else if (USER_CONFIG.autoOpenChapters && hasChapterPanel) runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
        else if (!USER_CONFIG.autoOpenComments && videoInfo) videoInfo.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');

        const clipPanel = watchFlexyElement.querySelector('ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-clip-create]');
        if (clipPanel && clipPanel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED')
            clipPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');

        // create the main tabView container
        const newDiv = document.createElement('div');
        newDiv.classList.add('CentAnni-tabView');

        // create the header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('CentAnni-tabView-header');

        // create the subheader
        subheaderDiv = document.createElement('div');
        subheaderDiv.classList.add('CentAnni-tabView-subheader');

        // define the tabs
        const tabs = [
            'Info',
            ...(!isLiveVideo ? ['Comments'] : []),
            ...(hasPlaylistPanel ? ['Playlist'] : []),
            ...(watchFlexyElement.querySelector('ytd-donation-shelf-renderer') && !USER_CONFIG.hideFundraiser ? ['Donation'] : []),
            'Videos',
            ...((!isLiveVideo && hasChapterPanel) ? ['Chapters'] : []),
            ...((!isLiveVideo && hasTranscriptPanel) ? ['Transcript'] : []),
        ];

        // define the IDs
        const tabIDs = {
            'Info': 'tab-1',
            'Comments': 'tab-2',
            'Playlist': 'tab-6',
            'Donation': 'tab-9',
            'Videos': 'tab-3',
            'Chapters': 'tab-4',
            'Transcript': 'tab-5'
        };

        const activePanel = {
            'tab-1': videoInfo,
            'tab-6': playlistPanel,
            'tab-4': chapterPanel,
            'tab-5': transcriptPanel
        };

        // create content sections tabs
        const contentSections = [];
        tabs.forEach((tabText, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('CentAnni-tabView-content');
            contentDiv.id = tabIDs[tabText];
            if (index === 0) {
                contentDiv.classList.add('active');
                currentActiveTab = tabIDs[tabText];
            }
            contentSections.push(contentDiv);
        });

        // populate the comments sections
        const videoComments = watchFlexyElement.querySelector(cmtsSel);
        if (videoComments && contentSections[1]) contentSections[1].appendChild(videoComments);
        if (USER_CONFIG.autoOpenComments) {
            const commentsTab = watchFlexyElement.querySelector('[data-tab="tab-2"]');
            if (commentsTab) commentsTab.classList.add('active');
            contentSections[1]?.classList.add('active');
        }

        // create each tab link and add click behavior
        tabs.forEach((tabText, index) => {
            const tabLink = document.createElement('a');
            tabLink.classList.add('CentAnni-tabView-tab');
            tabLink.textContent = tabText;
            tabLink.href = `#${tabIDs[tabText]}`;
            tabLink.dataset.tab = tabIDs[tabText];

            const tabClickHandler = (event) => {
                event.preventDefault();

                // if clicked tab is active enter theater mode
                if (currentActiveTab === tabIDs[tabText] && !isTheaterMode && USER_CONFIG.toggleTheaterModeBtn) {
                    event.stopPropagation();
                    toggleTheaterMode();
                    return;
                } else currentActiveTab = tabIDs[tabText];

                // remove 'active' from all tabs
                tabElements.forEach(obj => obj.element.classList.remove('active'));

                // mark clicked one as active
                tabLink.classList.add('active');

                // hide all content sections
                contentSections.forEach(content => content.classList.remove('active'));

                // show the target content section
                const targetDiv = contentSections[index];
                if (targetDiv) targetDiv.classList.add('active');

                // info panel
                if (videoInfo) videoInfo.setAttribute('visibility', tabText === 'Info' ? 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' : 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');

                // playlist container
                if (hasPlaylistPanel) {
                    if (tabText === 'Playlist') {
                        playlistPanel.classList.add('CentAnni-tabView-content-active');
                        playlistPanel.classList.remove('CentAnni-tabView-content-hidden');
                        if (playlistSelectedVideo) setTimeout(() => { playlistSelectedVideo.scrollIntoView({ behavior: 'instant', block: 'center' }); }, 25);
                    } else {
                        playlistPanel.classList.add('CentAnni-tabView-content-hidden');
                        playlistPanel.classList.remove('CentAnni-tabView-content-active');
                    }
                }

                // donation-shelf
                if (donationShelf) {
                    if (tabText === 'Donation') {
                        donationShelf.classList.add('CentAnni-tabView-content-active');
                        donationShelf.classList.remove('CentAnni-tabView-content-hidden');
                    } else {
                        donationShelf.classList.add('CentAnni-tabView-content-hidden');
                        donationShelf.classList.remove('CentAnni-tabView-content-active');
                    }
                }

                // more videos
                if (videoMore) {
                    if (tabText === 'Videos') {
                        videoMore.classList.add('CentAnni-tabView-content-attiva');
                        videoMore.classList.remove('CentAnni-tabView-content-nascosta');
                    } else {
                        videoMore.classList.add('CentAnni-tabView-content-nascosta');
                        videoMore.classList.remove('CentAnni-tabView-content-attiva');
                    }
                }

                // chapters panel
                if (hasChapterPanel) {
                    if (tabText === 'Chapters') runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
                    else runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
                }

                // transcript panel
                if (hasTranscriptPanel) {
                    if (tabText === 'Transcript') {
                        runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
                        if (!USER_CONFIG.YouTubeTranscriptExporter && USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !transcriptLanguageSet) { waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); }); transcriptLanguageSet = true; }
                        if (!USER_CONFIG.YouTubeTranscriptExporter && USER_CONFIG.transcriptTimestamps && !timestampsEnabled) { waitForTranscriptWithoutYTE(enableTimestamps); timestampsEnabled = true; }
                        if (!transcriptMenuButtonMoved && (!USER_CONFIG.YouTubeTranscriptExporter || USER_CONFIG.lazyTranscriptLoading)) { waitForTranscriptWithoutYTE(transcriptMenuButton); }
                    } else runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
                }
            };

            tabElements.push({ element: tabLink, handler: tabClickHandler });
            tabLink.addEventListener('click', tabClickHandler);
            subheaderDiv.appendChild(tabLink);
        });

        headerDiv.appendChild(subheaderDiv);
        newDiv.appendChild(headerDiv);
        contentSections.forEach(section => newDiv.appendChild(section));

        const oldDiv = watchFlexyElement.querySelector('.CentAnni-tabView');
        oldDiv ? oldDiv.replaceWith(newDiv) : secondaryElement.insertBefore(newDiv, secondaryElement.firstChild);

        updateTabView();
        if (USER_CONFIG.tabViewChapters && hasChapterPanel) chapterTitles();
        if (liveChat && singleColumn) toggleYouTubeColumns();
    }

    // add chapter titles under videos
    async function chapterTitles() {
        const fullscreenContainer = watchFlexyElement.querySelector(fsCnSel);
        const titleElement = watchFlexyElement.querySelector('.ytp-chapter-container:not([style*="display: none"])');
        const normalContainer = watchFlexyElement.querySelector('#description');
        if (!fullscreenContainer || !titleElement || !normalContainer) return;

        const parent = titleElement.parentNode;
        parent.removeChild(titleElement);

        const containerChapterTitle = document.createElement('div');
        containerChapterTitle.classList.add('CentAnni-chapter-title', 'bold', 'style-scope', 'yt-formatted-string');

        const label = document.createElement('span');
        label.textContent = 'Chapter:';

        containerChapterTitle.appendChild(label);
        containerChapterTitle.appendChild(titleElement);

        const existingContainerChapterTitle = watchFlexyElement.querySelector('.CentAnni-chapter-title');
        existingContainerChapterTitle ? existingContainerChapterTitle.replaceWith(containerChapterTitle) : normalContainer.appendChild(containerChapterTitle);

        const updateContainer = () => {
            const currentContainer = watchFlexyElement.querySelector('.CentAnni-chapter-title');
            const targetContainer = playerElement?.classList.contains('ytp-fullscreen')
                ? fullscreenContainer
                : normalContainer;

            if (currentContainer) targetContainer.appendChild(currentContainer);
            else targetContainer.appendChild(containerChapterTitle);
        };

        function handleFullscreenChangeCT() { updateContainer(); }
        document.removeEventListener('fullscreenchange', handleFullscreenChangeCT);
        document.addEventListener('fullscreenchange', handleFullscreenChangeCT);
        document.addEventListener('yt-navigate-start', moveChapterTitleBack, { once: true });
        function moveChapterTitleBack() {
            document.removeEventListener('fullscreenchange', handleFullscreenChangeCT);
            if (parent && titleElement)
                parent.appendChild(titleElement);
        }
    }

    // function to hide the 'X Products' span
    function hideProductsSpan() {
        const spans = watchFlexyElement.querySelectorAll('yt-formatted-string#info > span');
        spans.forEach(span => {
            if (span.textContent.includes('product')) {
                span.style.display = 'none';
            }
        });
    }

    // keep scrolling to the top until scroll activity stops or a timeout occurs
    const scrollToTop = () => {
        let stopTimeout;
        let frameID;

        const cancelStop = () => {
            const doScroll = () => {
                window.scrollTo(0, 0);
                clearTimeout(stopTimeout);
                stopTimeout = setTimeout(remove, 100);
            };
            frameID = requestAnimationFrame(doScroll);
        };

        const remove = () => {
            window.removeEventListener('scroll', cancelStop);
            cancelAnimationFrame(frameID);
            clearTimeout(backupTimeout);
        };

        window.addEventListener('scroll', cancelStop, { passive: true });
        const backupTimeout = setTimeout(remove, 1000);
        stopTimeout = setTimeout(remove, 100);
        window.scrollTo(0, 0);
    };

    // playback speed icon
    const playbackSpeedIconTemplate = (() => {
        const div = document.createElement('div');
        div.className = 'CentAnni-playback-speed-icon';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z');
        path.setAttribute('fill', 'whitesmoke');
        svg.appendChild(path);
        div.appendChild(svg);
        return div;
    })();
    function createPlaybackSpeedIcon() { return playbackSpeedIconTemplate.cloneNode(true); }

    // playback speed functions
    function initialSpeed() {
        document.removeEventListener('yt-player-updated', initialSpeed);

        const video = document.querySelector('video.html5-main-video[style]');
        if (!video) return;

        if (USER_CONFIG.VerifiedArtist) {
            const isMusicVideoMeta = !!(docElement.querySelector('meta[itemprop="genre"][content="Music"]') && docElement.querySelector('ytd-watch-flexy #below ytd-badge-supported-renderer .badge-style-type-verified-artist'));
            if (isMusicVideoMeta) { video.playbackRate = 1; return; }
        }

        if (new URL(window.location.href).pathname.startsWith('/shorts/')) video.playbackRate = lastUserRate !== null ? lastUserRate : defaultSpeed;
        else if (document.querySelector('.ytp-time-display')?.classList.contains('ytp-live')) video.playbackRate = 1;
        else video.playbackRate = defaultSpeed;
        video.defaultPlaybackRate = video.playbackRate;
    }

    // speed controller
    async function createPlaybackSpeedController(options = {}) {
        const { videoSelector = 'video.html5-main-video[style]' } = options;
        const MIN_SPEED = 0.25;
        const MAX_SPEED = 17;
        const STEP_SIZE = 0.25;

        let video;
        const findVideo = () => {
            video = watchFlexyElement?.querySelector(videoSelector);
            if (isShortPage) {
                const ytdShortsElement = document.querySelector('ytd-shorts');
                video = ytdShortsElement.querySelector(videoSelector);
            }
        };
        findVideo();
        if (!video) return null;

        function updateSpeedDisplay() {
            const speedDisplay = document.getElementById("CentAnni-speed-display");
            if (speedDisplay && video) speedDisplay.textContent = `${video.playbackRate}x`;
        }

        // set playback speed and update display
        function setSpeed() {
            if (!video || !video.isConnected || video.readyState === 0) {
                findVideo();
                if (!video) return;
            }

            ignoreRateChange = true;
            const clamped = Math.max(MIN_SPEED, Math.min(MAX_SPEED, video.playbackRate));
            video.playbackRate = clamped;
            video.preservesPitch = video.mozPreservesPitch = video.webkitPreservesPitch = true;

            updateSpeedDisplay();
            lastUserRate = video.playbackRate;
            if (speedNotification) showSpeedNotification(video.playbackRate);
            if (USER_CONFIG.playbackSpeedBtns) updateActiveSpeedButton(video);
        }

        // initial speed setting
        function initializeSpeed() {
            if (isShortPage) { video.playbackRate = lastUserRate !== null ? lastUserRate : defaultSpeed; }
            else if ((USER_CONFIG.VerifiedArtist && isMusicVideo) || isLiveVideo || isLiveStream) video.playbackRate = 1;
            else video.playbackRate = defaultSpeed;
            video.defaultPlaybackRate = video.playbackRate;

            video.addEventListener('ratechange', updateSpeedDisplay);
            setSpeed();
            speedNotification = true;
            if (USER_CONFIG.playbackSpeedBtns) playbackSpeedButtons(video, setSpeed);
        }

        // handle rate change events
        function onRateChange() {
            if (ignoreRateChange) { ignoreRateChange = false; return; }
            else video.playbackRate = lastUserRate;
        }

        // keyboard control handler
        function playbackSpeedKeyListener(event) {
            const key = (event.key || '').toLowerCase();
            const tagName = (event.target?.tagName || '').toLowerCase();
            const isTextInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select' || event.target?.isContentEditable;
            const isValidKey = defaultKeys.has(key);
            const matched = specialKeys[key];

            if (!video || isTextInput || (!isValidKey && matched == null)) return;
            event.preventDefault();
            event.stopPropagation();

            switch (key) {
                case toggleKey:
                    video.playbackRate = (video.playbackRate !== 1 ? 1 : defaultSpeed);
                    setSpeed();
                    break;
                case decreaseKey:
                case '<':
                    video.playbackRate = video.playbackRate - STEP_SIZE;
                    setSpeed();
                    break;
                case increaseKey:
                case '>':
                    video.playbackRate = video.playbackRate + STEP_SIZE;
                    setSpeed();
                    break;
                default:
                    if (matched != null) {
                        video.playbackRate = matched;
                        setSpeed();
                    }
            }
        }

        if (cleanupPlaybackSpeedListeners) {
            cleanupPlaybackSpeedListeners();
            cleanupPlaybackSpeedListeners = null;
        }

        // setup event listeners
        function setupEventListeners() {
            // clean up on Navigation
            const cleanupOnNavigation = () => {
                window.removeEventListener('keydown', playbackSpeedKeyListener, true);
                video.removeEventListener('ratechange', updateSpeedDisplay);
                video.removeEventListener('ratechange', onRateChange);
                document.removeEventListener('yt-navigate-start', cleanupOnNavigation);
                speedNotification = false;
            };

            // event listeners
            video.addEventListener('ratechange', onRateChange);
            window.addEventListener('keydown', playbackSpeedKeyListener, true);
            document.addEventListener('yt-navigate-start', cleanupOnNavigation, { once: true });
            cleanupPlaybackSpeedListeners = cleanupOnNavigation;
        }

        // initialize function return controller API
        initializeSpeed();
        setupEventListeners();
        return {
            video,
            setSpeed,
            STEP_SIZE,
        };
    }

    // playback speed regular videos
    async function videoPlaybackSpeed() {
        speedKeyMap();
        let menuRenderer = watchFlexyElement.querySelector(menuSel);
        if (!menuRenderer) return;

        // create controller
        const controller = await createPlaybackSpeedController();
        if (!controller) return;
        const { video, setSpeed, STEP_SIZE } = controller;

        // create container for buttons, display speed, and icon
        const oldControlDiv = document.getElementById("CentAnni-playback-speed-control");
        const controlDiv = document.createElement("div");
        controlDiv.id = "CentAnni-playback-speed-control";
        controlDiv.classList.add("CentAnni-playback-control", "top-level-buttons", "style-scope", "ytd-menu-renderer");

        // create the SVG icon
        const iconDiv = createPlaybackSpeedIcon();
        controlDiv.appendChild(iconDiv);

        // display the speed
        const speedDisplay = document.createElement("span");
        speedDisplay.id = "CentAnni-speed-display";
        speedDisplay.classList.add("CentAnni-playback-speed-display", "animated-rolling-number-wiz", "animatedRollingNumberHost");
        speedDisplay.textContent = `${video.playbackRate}x`;

        // create minus and plus buttons
        const createButton = (change) => {
            const button = document.createElement("button");
            button.textContent = change > 0 ? "+" : "-";
            button.classList.add(
                "CentAnni-playback-speed-button",
                "yt-spec-button-shape-next",
                "yt-spec-button-shape-next--tonal",
                "yt-spec-button-shape-next--mono",
                "yt-spec-button-shape-next--size-m",
                "yt-spec-button-shape-next--icon-button"
            );
            button.addEventListener("click", () => {
                video.playbackRate = video.playbackRate + change;
                setSpeed();
            });
            return button;
        };

        controlDiv.appendChild(createButton(-STEP_SIZE));
        controlDiv.appendChild(speedDisplay);
        controlDiv.appendChild(createButton(STEP_SIZE));
        oldControlDiv ? oldControlDiv.replaceWith(controlDiv) : menuRenderer.children[0].after(controlDiv);
    }

    // playback speed notification
    function showSpeedNotification(speed) {
        if (!isVideoPage && !isLiveStream && !isShortPage) return;
        const fullscreenContainer = watchFlexyElement?.querySelector('#movie_player');
        const container = isFullscreen && fullscreenContainer ? fullscreenContainer : docBody;
        let notification = document.getElementById('CentAnni-playback-speed-popup');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'CentAnni-playback-speed-popup';
            container.appendChild(notification);
        } else if (notification.parentNode !== container) container.appendChild(notification);

        notification.textContent = `${speed}x`;
        notification.classList.add('active');

        if (hideNotificationTimeout) clearTimeout(hideNotificationTimeout);
        hideNotificationTimeout = setTimeout(() => { notification.classList.remove('active'); }, 900);
    }

    // playback speed buttons
    function playbackSpeedButtons(video, setSpeed) {
        const containerTheater = document.querySelector('#columns #secondary');
        const containerDefault = document.querySelector('#bottom-row');
        if (!containerDefault && !containerTheater && !video && !setSpeed) return;

        let isTheater;
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4];

        // create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'CentAnni-speed-buttons';

        // create buttons
        speeds.forEach(speed => {
            const button = document.createElement('button');
            button.textContent = `${speed}x`;
            button.classList.add(
                "CentAnni-speed-preset-button",
                "yt-spec-button-shape-next",
                "yt-spec-button-shape-next--tonal",
                "yt-spec-button-shape-next--mono",
                "yt-spec-button-shape-next--size-m",
                "yt-spec-button-shape-next--icon-button"
            );
            button.dataset.speed = speed;

            button.addEventListener('click', () => {
                video.playbackRate = speed;
                setSpeed();
            });

            buttonContainer.appendChild(button);
        });

        isTheater = watchFlexyElement.hasAttribute('theater');
        document.getElementById('CentAnni-speed-buttons')?.remove();
        isTheater ? containerTheater.appendChild(buttonContainer) : containerDefault.appendChild(buttonContainer);
        updateActiveSpeedButton(video);

        const updatePosition = () => {
            isTheater = watchFlexyElement.hasAttribute('theater');
            const currentContainer = buttonContainer.parentElement;
            const targetContainer = isTheater ? containerTheater : containerDefault;

            if (currentContainer !== targetContainer) {
                isTheater ? targetContainer.appendChild(buttonContainer) : targetContainer.appendChild(buttonContainer);
                updateActiveSpeedButton(video);
            }
        };
        const cleanupProgressBar = () => { document.removeEventListener('yt-set-theater-mode-enabled', updatePosition); };
        document.addEventListener('yt-navigate-start', cleanupProgressBar, { once: true });
        document.addEventListener('yt-set-theater-mode-enabled', updatePosition);
    }

    function updateActiveSpeedButton(video) {
        if (!video) return;
        const buttons = document.querySelectorAll('.CentAnni-speed-preset-button');
        const currentSpeed = video.playbackRate;

        buttons.forEach(button => {
            const buttonSpeed = parseFloat(button.dataset.speed);
            if (Math.abs(currentSpeed - buttonSpeed) < 0.01) {
                button.classList.add('active');
                button.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            }
            else button.classList.remove('active');
        });
    }

    // function to display the remaining time based on playback speed minus SponsorBlock segments
    async function remainingTime() {
        let fullscreenContainer = watchFlexyElement.querySelector(fsCnSel);
        let normalContainer = watchFlexyElement.querySelector(prBeSel);
        let video = watchFlexyElement.querySelector('.video-stream.html5-main-video');
        if (!fullscreenContainer || !normalContainer || !video) return;

        // function to format seconds into time string
        function formatTime(seconds) {
            if (!isFinite(seconds) || seconds < 0) seconds = 0;
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return h > 0
                ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                : `${m}:${s.toString().padStart(2, '0')}`;
        }

        const element = document.createElement('div');
        element.classList.add('CentAnni-remaining-time-container');

        const textNode = document.createTextNode('');
        element.appendChild(textNode);

        const initialContainer = normalContainer;
        if (initialContainer) { initialContainer.prepend(element); }

        // hide for live stream
        if (isLiveVideo) element.classList.add('live');
        else element.classList.remove('live');

        let fullscreen;
        const updateContainer = () => {
            const currentContainer = watchFlexyElement.querySelector('.CentAnni-remaining-time-container');
            const targetContainer = playerElement?.classList.contains('ytp-fullscreen')
                ? fullscreenContainer
                : normalContainer;
            fullscreen = targetContainer === fullscreenContainer;

            if (currentContainer && currentContainer.parentNode !== targetContainer) {
                if (targetContainer === fullscreenContainer) {
                    targetContainer.appendChild(currentContainer);
                } else {
                    targetContainer.prepend(currentContainer);
                    if (getComputedStyle(normalContainer).position === 'static') {
                        normalContainer.style.position = 'relative';
                    }
                }
            }
        };

        updateContainer();
        function handleFullscreenChange() { updateContainer(); }
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // time update event listener
        if (video) {
            if (!video.paused && !video.ended && video.readyState > 2) remainingTimeMinusSponsorBlockSegments();
            else video.addEventListener('playing', remainingTimeMinusSponsorBlockSegments, { once: true });
        }

        // calculates and displays remaining time while accounting for SponsorBlock segments
        function remainingTimeMinusSponsorBlockSegments() {
            let baseEffective = NaN;
            let cachedSegments = null;
            let cachedMergedSegments = null;
            let lastRawSegments = null;
            let lastDuration = -1;

            // retrieves and validates video duration
            function ensureBaseEffectiveIsValid() {
                if (!isNaN(baseEffective)) return;
                if (!video.duration || isNaN(video.duration) || video.duration <= 0) return;

                const sponsorBlockTimeElement = document.getElementById('sponsorBlockDurationAfterSkips');
                if (sponsorBlockTimeElement && sponsorBlockTimeElement.textContent.trim()) {
                    const rawText = sponsorBlockTimeElement.textContent.trim().replace(/[()]/g, '');
                    baseEffective = parseTime(rawText);
                } else baseEffective = video.duration;
            }

            // retrieves SponsorBlock segments from preview bar
            function getSegments(rawDuration) {
                if (rawDuration === lastDuration && cachedSegments) return cachedSegments;

                const segments = [];
                const previewbar = document.getElementById('previewbar');
                if (previewbar) {
                    const liElements = previewbar.querySelectorAll('li.previewbar');
                    liElements.forEach(li => {
                        const category = li.getAttribute('sponsorblock-category');
                        const style = li.getAttribute('style');
                        const leftMatch = style.match(/left:\s*([\d.]+)%/);
                        const rightMatch = style.match(/right:\s*([\d.]+)%/);
                        if (leftMatch && rightMatch) {
                            const leftFraction = parseFloat(leftMatch[1]) / 100;
                            const rightFraction = parseFloat(rightMatch[1]) / 100;
                            const startTime = Math.round(rawDuration * leftFraction * 1000) / 1000;
                            const endTime = Math.round(rawDuration * (1 - rightFraction) * 1000) / 1000;
                            const segDuration = Math.round((endTime - startTime) * 1000) / 1000;
                            if (segDuration > 0)
                                segments.push({ category, start: startTime, duration: segDuration, end: endTime });
                        }
                    });
                }

                lastDuration = rawDuration;
                cachedSegments = segments;
                return segments;
            }

            // merges SponsorBlock segments that overlap
            function mergeSegments(segments) {
                if (!segments.length) return segments;
                segments.sort((a, b) => a.start - b.start);
                const merged = [segments[0]];
                for (let i = 1; i < segments.length; i++) {
                    const last = merged[merged.length - 1];
                    const current = segments[i];
                    if (current.start <= last.end + 0.001) {
                        last.end = Math.max(last.end, current.end);
                        last.duration = Math.round((last.end - last.start) * 1000) / 1000;
                    } else merged.push(current);
                }
                return merged;
            }

            function getMergedSegments(rawDuration) {
                const rawSegments = getSegments(rawDuration);
                if (rawSegments === lastRawSegments && cachedMergedSegments)
                    return cachedMergedSegments;

                const merged = mergeSegments(rawSegments);
                lastRawSegments = rawSegments;
                cachedMergedSegments = merged;
                return merged;
            }

            let addedIndex = 0;
            let addedSum = 0;
            let lastSegmentsRef = null;
            let lastTimeChecked = -1;

            function computeAddedTime(segments, currentTime) {
                if (segments !== lastSegmentsRef) {
                    lastSegmentsRef = segments;
                    addedIndex = 0;
                    addedSum = 0;
                    lastTimeChecked = -1;
                }

                if (currentTime < lastTimeChecked) {
                    addedIndex = 0;
                    addedSum = 0;
                }

                while (addedIndex < segments.length && currentTime >= segments[addedIndex].start - 0.001) {
                    addedSum += segments[addedIndex].duration;
                    addedIndex++;
                }

                lastTimeChecked = currentTime;
                return Math.round(addedSum * 1000) / 1000;
            }

            // debounce the update to prevent excessive updates
            let animationFrameId;
            video.ontimeupdate = () => {
                if (animationFrameId) return;

                const update = (_timestamp, meta) => {
                    ensureBaseEffectiveIsValid();

                    if (!isNaN(baseEffective)) {
                        const rawDuration = video.duration;
                        const currentTime = meta.mediaTime;
                        const playbackRate = video.playbackRate;
                        const playbackDisplay = showPlaybackSpeed ? (fullscreen ? ` (${playbackRate}x)` : '') : ` (${playbackRate}x)`;
                        const segments = getMergedSegments(rawDuration);
                        const addedTime = computeAddedTime(segments, currentTime);
                        const effectiveTotal = baseEffective + addedTime;
                        const remaining = (effectiveTotal - currentTime) / playbackRate;
                        const watchedPercent = rawDuration ? Math.round((currentTime / rawDuration) * 100) + '%' : '0%';
                        const totalFormatted = formatTime(baseEffective);
                        const rawTotalFormatted = formatTime(rawDuration);
                        const totalDisplay = Math.round(rawDuration) !== Math.round(baseEffective) ? `${rawTotalFormatted} (${totalFormatted})` : rawTotalFormatted;
                        const elapsedFormatted = formatTime(currentTime);
                        const remainingFormatted = formatTime(remaining);

                        compactModeSpeed ? textNode.data = `${elapsedFormatted} / ${totalDisplay} | -${remainingFormatted} ${playbackDisplay}` : textNode.data = `total: ${totalDisplay} | elapsed: ${elapsedFormatted} — watched: ${watchedPercent} — remaining: ${remainingFormatted} (${playbackRate}x)`;
                    }

                    if (!video.paused && !video.ended) animationFrameId = video.requestVideoFrameCallback(update);
                    else animationFrameId = null;
                };
                animationFrameId = video.requestVideoFrameCallback(update);
            };
        };

        // handle cleanup
        const cleanupProgressBar = () => {
            document.removeEventListener('yt-navigate-start', cleanupProgressBar);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            video.removeEventListener('playing', remainingTimeMinusSponsorBlockSegments);
            video.cancelVideoFrameCallback(animationFrameId); animationFrameId = null;
        };
        document.addEventListener('yt-navigate-start', cleanupProgressBar, { once: true });
    }

    // helper function to convert a time string into seconds
    function parseTime(timeString) {
        const parts = timeString.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        else if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    // function to keep the progress bar visible with chapters container
    function keepProgressBarVisible() {
        const player = watchFlexyElement?.querySelector(vidPSel);
        const video = player?.querySelector('video[src]');
        const chaptersContainer = player && player.querySelector(chapSel);
        const progressBarContainer = player && player.querySelector(prBaSel);
        if (!player || !video || !chaptersContainer || !progressBarContainer) return;

        const bar = document.createElement('div');
        bar.id = 'CentAnni-progress-bar-bar';

        const progress = document.createElement('div');
        progress.id = 'CentAnni-progress-bar-progress';

        const buffer = document.createElement('div');
        buffer.id = 'CentAnni-progress-bar-buffer';

        const startDiv = document.createElement('div');
        startDiv.id = 'CentAnni-progress-bar-start';

        const endDiv = document.createElement('div');
        endDiv.id = 'CentAnni-progress-bar-end';

        player.appendChild(bar);
        bar.appendChild(buffer);
        bar.appendChild(progress);
        player.appendChild(startDiv);
        player.appendChild(endDiv);

        progress.style.transform = 'scaleX(0)';

        startDiv.classList.add('active');
        bar.classList.add('active');
        endDiv.classList.add('active');

        let animationFrameId;
        const animateProgress = (_timestamp, meta) => {
            if (video.duration > 0) {
                const fraction = meta.mediaTime / video.duration;
                progress.style.transform = `scaleX(${fraction})`;
            }
            animationFrameId = video.requestVideoFrameCallback(animateProgress);
        };

        const renderBuffer = () => {
            if (!video.duration) return;
            for (let i = video.buffered.length - 1; i >= 0; i--) {
                if (video.currentTime < video.buffered.start(i)) continue;
                buffer.style.transform = `scaleX(${video.buffered.end(i) / video.duration})`;
                break;
            }
        };

        const handleEnded = () => {
            if (animationFrameId != null) {
                video.cancelVideoFrameCallback(animationFrameId); animationFrameId = null;
            }
            progress.style.transform = 'scaleX(1)';
        };

        video.addEventListener('progress', renderBuffer);
        video.addEventListener('seeking', renderBuffer);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('loadedmetadata', () => { updateLayout(); renderBuffer(); }, { once: true });

        // chapters container
        let previousChaptersLength = 0;
        let cachedMaskImage = null;
        let resizeObserver;
        let widthObserver;
        const cleanupWidthObserver = () => {
            if (widthObserver) {
                widthObserver.disconnect();
                clearTimeout(widthObserver.fallback);
                widthObserver = null;
            }
        };

        const updateLayout = () => {
            const playerRect = player.getBoundingClientRect();
            const progressBarRect = progressBarContainer.getBoundingClientRect();
            const progressBarWidth = progressBarRect.width;
            if (!progressBarWidth) {
                cachedMaskImage = null;
                if (!widthObserver) {
                    widthObserver = new MutationObserver(() => {
                        if (progressBarContainer.getBoundingClientRect().width) {
                            cleanupWidthObserver();
                            updateLayout();
                        }
                    });
                    widthObserver.observe(progressBarContainer, { attributes: true, childList: true, subtree: true });
                    widthObserver.fallback = setTimeout(() => { cleanupWidthObserver(); }, 7000);
                }
                return;
            }
            if (widthObserver) { cleanupWidthObserver(); }

            bar.style.position = 'absolute';
            bar.style.left = (progressBarRect.left - playerRect.left) + 'px';
            bar.style.width = progressBarWidth + 'px';
            docElement.style.setProperty('--progressBarMargin', bar.style.left);

            if (chaptersContainer) {
                const chapters = chaptersContainer.querySelectorAll('.ytp-chapter-hover-container');

                // only regenerate SVG if chapters changed
                if (chapters.length !== previousChaptersLength || !cachedMaskImage) {
                    previousChaptersLength = chapters.length;

                    const svgWidth = 100, svgHeight = 10;
                    let rects = "";

                    // find container with the real segments
                    let sourceCC = chaptersContainer;
                    let maxSegs = chapters.length;
                    player.querySelectorAll('.ytp-chapters-container').forEach(cc => {
                        const segs = cc.querySelectorAll('.ytp-chapter-hover-container').length;
                        if (segs > maxSegs) { sourceCC = cc; maxSegs = segs; }
                    });

                    // build mask by stacking widths of chapters
                    const segs = sourceCC.querySelectorAll('.ytp-chapter-hover-container');
                    if (segs.length >= 2 && progressBarWidth > 0) {
                        let xPx = 0;
                        segs.forEach(el => {
                            const wPx = parseFloat(el.style.width) || parseFloat(getComputedStyle(el).width) || 0;
                            const mrPx = parseFloat(el.style.marginRight) || parseFloat(getComputedStyle(el).marginRight) || 0;
                            if (wPx > 0) {
                                const x = (xPx / progressBarWidth) * svgWidth;
                                const w = (wPx / progressBarWidth) * svgWidth;
                                rects += `<rect x="${x}" y="0" width="${w}" height="${svgHeight}" fill="white"/>`;
                            }
                            xPx += wPx + mrPx;
                        });
                    }

                    // safety check - no segments > using full-width mask instead
                    if (!rects) rects = `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white"/>`;

                    const svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
                    const encoded = encodeURIComponent(svg).replace(/%20/g, ' ');
                    cachedMaskImage = `url("data:image/svg+xml;utf8,${encoded}")`;
                }

                // apply mask based on current state
                if (cachedMaskImage) {
                    bar.style.maskImage = cachedMaskImage;
                    bar.style.webkitMaskImage = cachedMaskImage;
                    bar.style.maskRepeat = 'no-repeat';
                    bar.style.webkitMaskRepeat = 'no-repeat';
                    bar.style.maskSize = '100% 100%';
                    bar.style.webkitMaskSize = '100% 100%';
                } else {
                    bar.style.maskImage = '';
                    bar.style.webkitMaskImage = '';
                    bar.style.maskRepeat = '';
                    bar.style.webkitMaskRepeat = '';
                    bar.style.maskSize = '';
                    bar.style.webkitMaskSize = '';
                }
            }
        };

        // handle animation frame
        const handlePlay = () => { if (!animationFrameId) animationFrameId = video.requestVideoFrameCallback(animateProgress); };
        const handlePause = () => { if (animationFrameId) { video.cancelVideoFrameCallback(animationFrameId); animationFrameId = null; } };
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        if (!video.paused) handlePlay();

        // handle layout changes
        const handleResize = () => { updateLayout(); };
        window.addEventListener('resize', handleResize);
        const handleTheaterMode = () => { updateLayout(); };
        document.addEventListener('yt-set-theater-mode-enabled', handleTheaterMode);

        // handle cleanup
        const cleanupProgressBar = () => {
            document.removeEventListener('yt-set-theater-mode-enabled', handleTheaterMode);
            document.removeEventListener('yt-navigate-start', cleanupProgressBar);
            video.removeEventListener('progress', renderBuffer);
            video.removeEventListener('seeking', renderBuffer);
            window.removeEventListener('resize', handleResize);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('play', handlePlay);
            video.cancelVideoFrameCallback(animationFrameId); animationFrameId = null;
            resizeObserver?.disconnect();
            cleanupWidthObserver();
        };
        document.addEventListener('yt-navigate-start', cleanupProgressBar, { once: true });

        // initialization
        renderBuffer();
        updateLayout();
        resizeObserver = new ResizeObserver(updateLayout);
        resizeObserver.observe(progressBarContainer);
    }

    // close live chat initially
    function closeLiveChat() {
        const chatFrame = document.querySelector('ytd-live-chat-frame');
        if (!chatFrame) return;

        const retryInterval = 250;
        const maxRetries = 12;
        let iframeAttempts = 0;
        let buttonAttempts = 0;

        function tryCloseChat() {
            const iframe = document.querySelector('#chatframe');
            if (!iframe?.contentWindow?.document) {
                if (iframeAttempts < maxRetries) {
                    iframeAttempts++;
                    setTimeout(tryCloseChat, retryInterval);
                } else {
                    docElement.classList.remove('CentAnni-close-live-chat');
                    initialRun = false;
                }
                return;
            }

            const button = iframe.contentWindow.document.querySelector('#close-button button');
            if (!button) {
                if (buttonAttempts < maxRetries) {
                    buttonAttempts++;
                    setTimeout(tryCloseChat, retryInterval);
                } else {
                    docElement.classList.remove('CentAnni-close-live-chat');
                    initialRun = false;
                }
                return;
            }

            button.click();

            const chatElement = document.querySelector('ytd-live-chat-frame#chat');
            const observer = new MutationObserver((mutations) => {
                if (chatElement.hasAttribute('collapsed')) {
                    removeChatCSS();
                    clearTimeout(fallbackTimer);
                    observer.disconnect();
                }
            });

            observer.observe(chatElement, {
                attributes: true,
                attributeFilter: ['collapsed']
            });

            const fallbackTimer = setTimeout(() => {
                if (initialRun) {
                    removeChatCSS();
                    observer.disconnect();
                }
            }, 3000);

            function removeChatCSS() {
                initialRun = false;
                setTimeout(() => { docElement.classList.remove('CentAnni-close-live-chat'); }, 250);
            }
        }

        tryCloseChat();
    }

    // set video quality
    function setVideoQuality(desiredQuality, defaultQualityPremium) {
        let qualitySet = null;
        let qualityUHD = null;
        let found = false;

        // define quality levels
        const qualityLevels = [
            'highres',
            'hd2160',
            'hd1440',
            'hd1080',
            'hd720',
            'large',
            'medium',
            'small',
            'tiny'
        ];

        // get the YouTube player
        const player = document.getElementById("movie_player");
        if (!player?.getAvailableQualityLevels) return;

        // get available qualities for the video and check for UHD
        const availableQualities = player.getAvailableQualityLevels();
        if (availableQualities.includes('hd1440') || availableQualities.includes('hd2160') || availableQualities.includes('highres')) qualityUHD = true;

        // helper function to reduce repetition and store picked quality
        const setQuality = (quality) => {
            player.setPlaybackQualityRange(quality, quality);
            qualitySet = quality;
        };

        // find closest available quality if exact match isn't available
        if (availableQualities.includes(desiredQuality)) {
            setQuality(desiredQuality);
        } else if (desiredQuality === "highest") {
            setQuality(availableQualities[0]);
        } else if (desiredQuality === "lowest") {
            const lowest = availableQualities[availableQualities.length - 1] === "auto"
                ? availableQualities[availableQualities.length - 2]
                : availableQualities[availableQualities.length - 1];
            setQuality(lowest);
        } else {
            const desiredIndex = qualityLevels.indexOf(desiredQuality);
            if (desiredIndex !== -1) {
                for (let i = desiredIndex; i < qualityLevels.length; i++) {
                    if (availableQualities.includes(qualityLevels[i])) {
                        setQuality(qualityLevels[i]);
                        found = true;
                        break;
                    }
                }
                if (!found) setQuality('auto');
            } else setQuality('auto');
        }

        // set 1080p premium quality
        if (defaultQualityPremium && qualitySet === 'hd1080' && !qualityUHD) setVideoQualityPremium();

        async function setVideoQualityPremium() {
            document.documentElement.classList.add('CentAnni-style-hide-yt-settings');
            await setQualityPremium();
            document.body.click();
            document.documentElement.classList.remove('CentAnni-style-hide-yt-settings');
        }

        async function setQualityPremium() {
            const qualityTranslations = {
                'en': 'Quality',
                'es': 'Calidad',
                'hi': 'गुणवत्ता',
                'pt': 'Qualidade',
                'de': 'Qualität',
                'fr': 'Qualité',
                'it': 'Qualità',
                'nl': 'Kwaliteit',
                'pl': 'Jakość',
                'he': 'איכות',
                'ja': '品質',
                'ko': '품질',
                'zh': '质量',
                'id': 'Kualitas',
                'sv': 'Kvalitet',
                'no': 'Kvalitet',
                'da': 'Kvalitet',
                'fi': 'Laatu',
                'cs': 'Kvalita',
                'el': 'Ποιότητα',
                'hu': 'Minőség',
                'ro': 'Calitate',
                'uk': 'Якість'
            };

            const settingsPanel = 'ytd-watch-flexy .ytp-settings-menu';
            const settingsButton = 'ytd-watch-flexy .ytp-settings-button';
            const LanguageUI = document.documentElement.lang || navigator.language || 'en';
            const lang = new Intl.Locale(LanguageUI).language;
            const qualityText = qualityTranslations[lang];

            function waitFor(selectorOrFn, ctx = document, timeout = 7000) {
                return new Promise((resolve, reject) => {
                    const lookup = () => (typeof selectorOrFn === 'function')
                        ? selectorOrFn()
                        : ctx.querySelector(selectorOrFn);

                    if (lookup()) { resolve(lookup()); return; }

                    const timer = setTimeout(() => { observer.disconnect(); reject(); }, timeout);
                    const observer = new MutationObserver(() => {
                        const node = lookup();
                        if (node) {
                            clearTimeout(timer);
                            observer.disconnect();
                            resolve(node);
                        }
                    });
                    observer.observe(ctx, { childList: true, subtree: true });
                });
            }

            if (!document.querySelector(settingsPanel) || getComputedStyle(document.querySelector(settingsPanel)).display === 'none') {
                document.querySelector(settingsButton).click();
                await waitFor(settingsPanel);
            }

            const panel = document.querySelector(settingsPanel);
            const qualitySelector = () => [...document.querySelectorAll('ytd-watch-flexy .ytp-menuitem')].find(item => item.textContent.includes(qualityText));
            const qualityItem = qualitySelector();
            if (!qualityItem) return;
            qualityItem.click();

            await waitFor('.ytp-menuitem', panel);

            const premiumQualitySelector = () => [...panel.querySelectorAll('.ytp-menuitem')]
                .find(item => {
                    const labelEl = item.querySelector('.ytp-menuitem-label');
                    return labelEl && labelEl.textContent.includes('1080p Premium');
                });

            const premiumOption = premiumQualitySelector();
            if (!premiumOption) return;
            premiumOption.click();
        }
    }

    // sidebar and links in header
    function buttonsLeftHeader() {
        function opentabSidebar() {
            const guideButton = document.querySelector('#guide-button button');
            if (guideButton) guideButton.click();
        }

        // create sidebar button
        function createButton(text, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.classList.add('buttons-left');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                onClick();
            });
            return btn;
        }

        // create links
        function createLink(text, url) {
            const link = document.createElement('a');
            link.textContent = text;
            link.classList.add('buttons-left');
            link.href = url;
            return link;
        }

        const masthead = document.querySelector('ytd-masthead'); if (!masthead) return;
        const container = masthead.querySelector('#container #start'); if (!container) return;

        const isHideSidebarChecked = USER_CONFIG.mButtonDisplay;

        if (container.querySelector('.buttons-left')) return;

        // adding the buttons
        const buttonsConfig = [
            { type: 'button', text: USER_CONFIG.mButtonText, onClick: opentabSidebar },
            { type: 'link', text: USER_CONFIG.buttonLeft1Text, url: USER_CONFIG.buttonLeft1Url },
            { type: 'link', text: USER_CONFIG.buttonLeft2Text, url: USER_CONFIG.buttonLeft2Url },
            { type: 'link', text: USER_CONFIG.buttonLeft3Text, url: USER_CONFIG.buttonLeft3Url },
            { type: 'link', text: USER_CONFIG.buttonLeft4Text, url: USER_CONFIG.buttonLeft4Url },
            { type: 'link', text: USER_CONFIG.buttonLeft5Text, url: USER_CONFIG.buttonLeft5Url },
            { type: 'link', text: USER_CONFIG.buttonLeft6Text, url: USER_CONFIG.buttonLeft6Url },
            { type: 'link', text: USER_CONFIG.buttonLeft7Text, url: USER_CONFIG.buttonLeft7Url },
            { type: 'link', text: USER_CONFIG.buttonLeft8Text, url: USER_CONFIG.buttonLeft8Url },
            { type: 'link', text: USER_CONFIG.buttonLeft9Text, url: USER_CONFIG.buttonLeft9Url },
            { type: 'link', text: USER_CONFIG.buttonLeft10Text, url: USER_CONFIG.buttonLeft10Url },
        ];

        buttonsConfig.forEach(config => {
            if (config.text && config.text.trim() !== '') {
                let element;
                if (config.type === 'button') {
                    if (isHideSidebarChecked) {
                        element = createButton(config.text, config.onClick);
                        if (config.text === DEFAULT_CONFIG.mButtonText) {
                            element.style.display = 'inline-block';
                            element.style.fontSize = '25px';
                            element.style.padding = '0 0 5px 0';
                            element.style.transform = 'scaleX(1.25)';
                        }
                    }
                } else if (config.type === 'link') element = createLink(config.text, config.url);
                if (element) container.appendChild(element);
            }
        });
    }

    // color code videos on home
    function homeColorCodeVideos() {
        let homePageObserver = null;

        // define age categories and regex
        const rawCategories = categoriesMatrix[uiLanguage] || categoriesMatrix['en'];
        const categories = {};
        for (const [key, arr] of Object.entries(rawCategories)) categories[key] = arr.map(w => typeof w === 'string' ? w.toLowerCase() : w);
        const streamedRegex = new RegExp(`(?:${categories.streamed.join('|')})`, 'i');
        const homePage = document.querySelector('ytd-browse[page-subtype="home"]:not([hidden])');
        const targetContainer = homePage?.querySelector('ytd-rich-grid-renderer > #contents') || homePage;
        const liveSelectors = 'badge-shape.yt-badge-shape--thumbnail-live';
        if (!homePage) return;

        // process each individual video
        function processVideo(videoContainer) {
            videoContainer.setAttribute('data-centanni-video-processed', 'true');
            const metaBlock = videoContainer.querySelector('yt-content-metadata-view-model,#metadata-line');
            if (!metaBlock) return;

            const textContent = metaBlock.textContent.trim().toLowerCase();
            for (const [className, ages] of Object.entries(categories)) {
                if (ages.some(age => textContent.includes(age))) {
                    videoContainer.classList.add(`CentAnni-style-${className}-video`);
                    break;
                }
            }

            const liveBadge = videoContainer.querySelector(liveSelectors);
            if (liveBadge && !videoContainer.classList.contains('CentAnni-style-live-video'))
                videoContainer.classList.add('CentAnni-style-live-video');

            const spanElements = videoContainer.querySelectorAll('yt-content-metadata-view-model .yt-content-metadata-view-model-wiz__metadata-text:not(:has(a)):last-of-type,yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-text:not(:has(a)):last-of-type,span.ytd-video-meta-block');
            spanElements.forEach(el => {
                const text = el.textContent;
                const textLower = text.toLowerCase();

                if (categories.upcoming.some(word => textLower.includes(word)) && !videoContainer.classList.contains('CentAnni-style-upcoming-video'))
                    videoContainer.classList.add('CentAnni-style-upcoming-video');

                if (categories.streamed.some(word => textLower.includes(word))) {
                    const nextEl = el.nextElementSibling;
                    if (!nextEl || !nextEl.classList.contains('CentAnni-style-streamed-span')) {
                        const cloneSpan = document.createElement('span');
                        cloneSpan.className = el.className + ' CentAnni-style-streamed-span';

                        const streamedWordSpan = document.createElement('span');
                        streamedWordSpan.className = 'CentAnni-style-streamed-text';
                        const matched = categories.streamed.find(word => textLower.includes(word)) || categories.streamed[0];
                        streamedWordSpan.textContent = matched.charAt(0).toUpperCase() + matched.slice(1) + ' ';
                        const restText = document.createTextNode(text.replace(streamedRegex, '').trimStart());

                        cloneSpan.appendChild(streamedWordSpan);
                        cloneSpan.appendChild(restText);
                        const metadataRow = el.closest('yt-content-metadata-view-model > .yt-content-metadata-view-model-wiz__metadata-row:nth-of-type(2),yt-content-metadata-view-model > .yt-content-metadata-view-model__metadata-row:nth-of-type(2)') || metaBlock;
                        metadataRow?.insertBefore(cloneSpan, el.nextSibling);
                    }
                }
            });
        }

        // gather all unprocessed videos for processVideo
        function processVideos() {
            const unprocessedVideos = [...targetContainer.querySelectorAll('ytd-rich-item-renderer:not([data-centanni-video-processed])')];
            unprocessedVideos.forEach(processVideo);
        }

        // manage the initial processing and observer
        function runProcessVideos(callback) {
            if (homePageObserver) homePageObserver.disconnect();

            processVideos();

            homePageObserver = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.matches && node.matches('ytd-rich-item-renderer')) processVideo(node);
                        else if (node.querySelectorAll) node.querySelectorAll('ytd-rich-item-renderer').forEach(processVideo);
                    }
                }
            });

            const config = { childList: true };
            if (targetContainer === homePage) config.subtree = true;
            homePageObserver.observe(targetContainer, config);
            if (callback) callback();
        }

        // handle navigation
        const serviceRequestSentHandler = () => { runProcessVideos(); };
        const navigateFinishHandler = () => { setTimeout(cleanupAndReprocessVideos, 300); };
        const pageTypeChangedHandler = function () {
            document.removeEventListener('yt-service-request-sent', serviceRequestSentHandler);
            document.removeEventListener('yt-service-request-completed', checkProcessedVideos);
            document.removeEventListener('yt-navigate-finish', navigateFinishHandler);
            document.removeEventListener('yt-page-type-changed', pageTypeChangedHandler);
            if (homePageObserver) { homePageObserver.disconnect(); homePageObserver = null; }
        };

        runProcessVideos(function () {
            document.addEventListener('yt-service-request-sent', serviceRequestSentHandler);
            document.addEventListener('yt-service-request-completed', checkProcessedVideos);
            document.addEventListener('yt-navigate-finish', navigateFinishHandler);
            setTimeout(checkProcessedVideos, 1250);
        });

        document.addEventListener('yt-page-type-changed', pageTypeChangedHandler);

        // ensure correct categories
        function checkProcessedVideos() {
            const processedVideos = [...homePage.querySelectorAll('ytd-rich-item-renderer')].slice(0, 13);
            if (processedVideos.length === 0) return;

            let allCorrect = true;
            for (const video of processedVideos) {
                const metaBlock = video.querySelector('yt-content-metadata-view-model,#metadata-line');
                if (!metaBlock) continue;

                const textContent = metaBlock.textContent.trim().toLowerCase();
                let expectedCategory = null;

                if (video.querySelector(liveSelectors)) expectedCategory = 'live';
                else {
                    for (const [className, ages] of Object.entries(categories)) {
                        if (ages.some(age => textContent.includes(age))) {
                            expectedCategory = className;
                            break;
                        }
                    }
                    if (expectedCategory === null) if ([...video.querySelectorAll('yt-content-metadata-view-model .yt-content-metadata-view-model-wiz__metadata-text,span.ytd-video-meta-block')].some(el => /Scheduled for/i.test(el.textContent))) expectedCategory = 'upcoming';
                }

                const expectedClassName = expectedCategory ? `CentAnni-style-${expectedCategory}-video` : null;

                let currentVideoIsCorrect = true;
                if (expectedClassName) {
                    if (!video.classList.contains(expectedClassName)) currentVideoIsCorrect = false;
                } else {
                    for (const cls of video.classList) {
                        if (cls.startsWith('CentAnni-style-')) {
                            currentVideoIsCorrect = false;
                            break;
                        }
                    }
                }
                if (!currentVideoIsCorrect) {
                    allCorrect = false;
                    break;
                }
            }
            if (!allCorrect) cleanupAndReprocessVideos();
        }

        // handle cleanup
        function cleanupAndReprocessVideos() {
            const videosToReprocess = homePage.querySelectorAll('ytd-rich-item-renderer[data-centanni-video-processed]');

            videosToReprocess.forEach(video => {
                video.classList.remove(
                    'CentAnni-style-live-video',
                    'CentAnni-style-upcoming-video',
                    'CentAnni-style-newly-video',
                    'CentAnni-style-recent-video',
                    'CentAnni-style-lately-video',
                    'CentAnni-style-latterly-video',
                    'CentAnni-style-old-video',
                    'CentAnni-style-streamed-video'
                );

                video.querySelectorAll('.CentAnni-style-streamed-span').forEach(el => el.remove());
                video.removeAttribute('data-centanni-video-processed');
            });

            processVideos();
            handleFeedFilterAll();
            createButtons('settings');
        }

        // handle feed filter 'All' button
        let allButtonObserver = null;
        function handleFeedFilterAll() {
            if (allButtonObserver) return;

            const allButton = homePage.querySelector('yt-chip-cloud-chip-renderer:first-child');
            if (!allButton) return;

            allButtonObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class' && allButton.classList.contains('iron-selected')) {
                        checkProcessedVideos();
                        handleFeedFilterAllCleanup();
                        break;
                    }
                }
            });
            allButtonObserver.observe(allButton, {
                attributes: true,
                attributeFilter: ['class', 'selected']
            });
        }

        function handleFeedFilterAllCleanup() {
            if (allButtonObserver) {
                allButtonObserver.disconnect();
                allButtonObserver = null;
            }
        }
    }

    // mark last seen video on subscription page
    function markLastSeenVideo() {
        const subscriptionPage = document.querySelector('ytd-browse[page-subtype="subscriptions"]:not([hidden])');
        const videoContainers = subscriptionPage?.querySelectorAll('ytd-rich-item-renderer');
        if (!subscriptionPage || !videoContainers.length) return;

        const previousLastSeen = subscriptionPage.querySelector('.CentAnni-style-last-seen');
        if (previousLastSeen) previousLastSeen.classList.remove('CentAnni-style-last-seen');

        // helper function to check if a video is live or upcoming
        const isSpecialVideo = (container) => {
            if (container.querySelector('.yt-badge-shape--thumbnail-live, .badge-style-type-live-now-alternate') !== null) return true;
            if (container.querySelector('.ytLockupAttachmentsViewModelHost, ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]') !== null) return true;

            // backup checks
            const metadataItems = container.querySelectorAll('.yt-content-metadata-view-model__metadata-row span[role="text"], .inline-metadata-item');
            for (const item of metadataItems) {
                if (item.textContent.includes('Scheduled for') || item.textContent.includes('watching')) return true;
            }
            return false;
        };

        // helper function to extract video ID
        const extractVideoID = (container) => {
            const mainThumbnail = container.querySelector('a.yt-lockup-view-model__content-image[href*="/watch?v="], ytd-thumbnail a#thumbnail[href*="/watch?v="]');
            if (!mainThumbnail || !mainThumbnail.href || !mainThumbnail.href.includes('/watch?v=')) return null;
            return new URL(mainThumbnail.href, location.origin).searchParams.get('v');
        };

        const lastSeenID = localStorage.getItem("CentAnni_lastSeenVideoID");
        let targetElement = null;
        let newLastSeenID = null;

        for (const container of videoContainers) {
            if (isSpecialVideo(container)) continue;
            const videoID = extractVideoID(container);
            if (!videoID) continue;

            if (!newLastSeenID) newLastSeenID = videoID;

            if (videoID === lastSeenID) {
                container.classList.add("CentAnni-style-last-seen");
                targetElement = container;
            }

            if (newLastSeenID && targetElement) break;
        }

        // update last seen video ID in localStorage
        if (newLastSeenID && newLastSeenID !== lastSeenID)
            localStorage.setItem("CentAnni_lastSeenVideoID", newLastSeenID);

        // scroll to the last seen video
        if (USER_CONFIG.lastSeenVideoScroll && targetElement) {
            requestAnimationFrame(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    // add trashcan icon to playlists to easily remove videos
    function playlistRemovalButtons() {
        const sortButton = document.querySelector('#filter:not(:empty),#filter-menu');
        if (!sortButton) return;

        const playlistPage = document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden])');
        if (!playlistPage) return;

        const playlistContainer = playlistPage.querySelector('#primary > ytd-section-list-renderer > #contents > ytd-item-section-renderer #contents');
        if (!playlistContainer) return;

        // watch for playlist changes
        const playlistObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches && node.matches('ytd-playlist-video-renderer')) attachRemoveButtonToVideo(node);
                    else node.querySelectorAll && node.querySelectorAll('ytd-playlist-video-renderer').forEach(attachRemoveButtonToVideo);
                }
            }
        });

        playlistObserver.observe(playlistContainer, {
            childList: true,
            subtree: true
        });

        // run and cleanup
        attachRemoveButtonsToAllVideos();
        const navigateHandler = () => {
            playlistObserver.disconnect();
            cleanupRemoveButtons();
        };
        document.addEventListener('yt-navigate-start', navigateHandler, { once: true });

        function attachRemoveButtonToVideo(videoEl) {
            if (videoEl.hasAttribute('data-centanni-playlist-video-processed')) return;

            const metaContainer = videoEl.querySelector('#meta');
            if (!metaContainer) return;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'CentAnni-style-playlist-remove-btn';
            removeBtn.title = 'Remove from Playlist';
            removeBtn.textContent = '🗑️';
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (removeBtn.classList.contains('removing')) return;
                removeBtn.classList.add('removing');
                simulateVideoRemoval(videoEl)
                    .finally(() => { removeBtn.classList.remove('removing'); });
            });
            metaContainer.appendChild(removeBtn);
            videoEl.setAttribute('data-centanni-playlist-video-processed', 'true');
        }

        function attachRemoveButtonsToAllVideos() {
            const videoElements = playlistPage.querySelectorAll('ytd-playlist-video-renderer:not([data-centanni-playlist-video-processed])');
            videoElements.forEach(attachRemoveButtonToVideo);
        }

        function cleanupRemoveButtons() {
            document.querySelectorAll('.CentAnni-style-playlist-remove-btn').forEach(btn => btn.remove());
            document.querySelectorAll('ytd-playlist-video-renderer[data-centanni-playlist-video-processed]').forEach(videoEl => {
                videoEl.removeAttribute('data-centanni-playlist-video-processed');
            });
        }

        function simulateVideoRemoval(videoEl) {
            return new Promise((resolve) => {
                const menuBtn = videoEl.querySelector('#button');
                if (!menuBtn) {
                    resolve();
                    return;
                }

                const popupContainer = document.querySelector('ytd-popup-container');
                if (popupContainer) popupContainer.classList.add('CentAnni-style-playlist-hide-menu');

                menuBtn.click();

                waitForElement('#items > ytd-menu-service-item-renderer', 300)
                    .then(() => { return new Promise(r => setTimeout(r, 75)); })
                    .then(() => {
                        const menuItems = [...document.querySelectorAll('#items > ytd-menu-service-item-renderer')];
                        let removeOption = null;

                        for (const item of menuItems) {
                            const formattedString = item.querySelector('yt-formatted-string');
                            if ((formattedString && formattedString.textContent.includes('Remove from')) || item.querySelector('svg path[d^="M19 3h-4V2a1"]')) {
                                removeOption = item;
                                break;
                            }
                        }

                        if (!removeOption) {
                            docBody.click();
                            return Promise.resolve();
                        }

                        removeOption.click();
                        return new Promise(r => setTimeout(r, 400));
                    })
                    .then(() => {
                        if (popupContainer) popupContainer.classList.remove('CentAnni-style-playlist-hide-menu');
                        resolve();
                    })
                    .catch(() => {
                        try { docBody.click(); } catch (e) {}
                        if (popupContainer) popupContainer.classList.remove('CentAnni-style-playlist-hide-menu');
                        resolve();
                    });
            });
        }

        function waitForElement(selector, timeout = 700) {
            return new Promise((resolve) => {
                const element = playlistPage.querySelector(selector);
                if (element) return resolve(element);

                let timer;
                const observer = new MutationObserver(() => {
                    const el = playlistPage.querySelector(selector);
                    if (el) {
                        clearTimeout(timer);
                        observer.disconnect();
                        resolve(el);
                    }
                });

                timer = setTimeout(() => { observer.disconnect(); resolve(); }, timeout);
                observer.observe(playlistPage, { childList: true, subtree: true });
            });
        }
    }

    // add button to remove watched videos from playlist
    function playlistRemoveWatchedButton() {
        const playlistPage = document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden])');
        const wrapper = document.querySelector('#page-manager ytd-browse ytd-playlist-header-renderer .metadata-buttons-wrapper');
        const menuRenderer = wrapper?.querySelector('ytd-menu-renderer');
        const menuButton = menuRenderer?.querySelector('button');
        if (!playlistPage || !wrapper || !menuRenderer || !menuButton || document.querySelector('#CentAnni-remove-watched-btn')) return;

        const waitForElement = (selector, callback, timeout = 700) => {
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) { observer.disconnect(); callback(element); }
            });
            observer.observe(document, { childList: true, subtree: true });
            const cnl = () => {
                observer.disconnect();
                docElement.classList.remove('CentAnni-playlist-remove-btn-hide-menus');
                docBody.click();
            };
            setTimeout(cnl, timeout);
        };

        const handleBtnClick = () => {
            docElement.classList.add('CentAnni-playlist-remove-btn-hide-menus');
            menuButton.click();

            const dPaths = ['M12 1C5', 'M12 3c'];
            const selector = dPaths.map(d => `ytd-popup-container > tp-yt-iron-dropdown a:has(svg path[d^="${d}"])`).join(',');
            waitForElement(selector, (removeLink) => {
                removeLink.click();
                waitForElement('#confirm-button > yt-button-shape > button', (confirmButton) => {
                    confirmButton.click();
                    showNotification('Videos Removed from Watch Later Playlist.');
                    if (USER_CONFIG.playlistLinks) setTimeout(() => { location.reload(); }, 900);
                    docElement.classList.remove('CentAnni-playlist-remove-btn-hide-menus');
                });
            });
        };

        const btn = document.createElement('button');
        btn.id = 'CentAnni-remove-watched-btn';
        btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m';
        btn.textContent = 'Remove Watched Videos';
        btn.addEventListener('click', handleBtnClick);
        wrapper.insertBefore(btn, menuRenderer.nextSibling);

        document.addEventListener('yt-navigate-start', () => {
            docElement.classList.remove('CentAnni-playlist-remove-btn-hide-menus');
            playlistPage.querySelector('#CentAnni-remove-watched-btn')?.remove();
        }, { once: true });
    }

    // open playlist videos without being in a playlist
    function handlePlaylistLinks() {
        let processedAllListVideos = false;

        function chromeClickHandler(event) {
            if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                event.stopImmediatePropagation();
                event.preventDefault();
                const cleanUrl = event.currentTarget.getAttribute('CentAnni-chrome-pl-url');
                window.open(cleanUrl, '_self');
            }
        }

        const playlistPage = document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden])');
        if (!playlistPage) return;

        function processVideos() {
            const unprocessedVideos = [...playlistPage.querySelectorAll('#contents > ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer:not([data-centanni-list-video-processed])')];
            if (unprocessedVideos.length === 0) { processedAllListVideos = true; return; }
            processedAllListVideos = false;

            unprocessedVideos.forEach(videoItem => {
                videoItem.setAttribute('data-centanni-list-video-processed', 'true');
                const thumbnailLink = videoItem.querySelector('a#thumbnail');
                const titleLink = videoItem.querySelector('a#video-title');

                [thumbnailLink, titleLink].forEach(link => {
                    if (link && link.href && (link.href.includes('list=WL') || link.href.includes('list=PL') || link.href.includes('list=LL'))) {
                        try {
                            const url = new URL(link.href);
                            const videoID = url.searchParams.get('v');
                            if (videoID) {
                                const cleanUrl = `https://www.youtube.com/watch?v=${videoID}`;
                                link.href = cleanUrl;
                                if (!USER_CONFIG.preventBackgroundExecution) link.setAttribute('onclick', `if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey){event.stopPropagation();event.preventDefault();window.location='${cleanUrl}';return!1}return!0`);
                                else {
                                    link.setAttribute('CentAnni-chrome-pl-url', cleanUrl);
                                    link.addEventListener('click', chromeClickHandler, true);
                                }
                            }
                        } catch (e) {
                            console.error('YouTube Alchemy: Error processing link:', e);
                        }
                    }
                });
            });
        }

        function runProcessVideos(times, initialDelay, interval, callback) {
            processedAllListVideos = false;
            let count = 0;

            function runProcess() {
                processVideos();
                count++;
                if (count < times && !processedAllListVideos) setTimeout(runProcess, interval);
                else if (callback) callback();
            }

            setTimeout(runProcess, initialDelay);
        }

        // handle navigation
        const serviceRequestSentHandler = () => { runProcessVideos(3, 1000, 1000, null); };
        const pageTypeChangedHandler = function () {
            document.removeEventListener('yt-service-request-sent', serviceRequestSentHandler);
            document.removeEventListener('yt-navigate-start', pageTypeChangedHandler);
            document.querySelectorAll('[data-centanni-list-video-processed]').forEach(el => {
                el.removeAttribute('data-centanni-list-video-processed');
            });

            if (USER_CONFIG.preventBackgroundExecution) {
                playlistPage.querySelectorAll('[CentAnni-chrome-pl-url]').forEach(link => {
                    link.removeEventListener('click', chromeClickHandler, true);
                });
            }
        };

        runProcessVideos(6, 250, 500, function () {
            document.addEventListener('yt-service-request-sent', serviceRequestSentHandler);
        });

        document.addEventListener('yt-navigate-start', pageTypeChangedHandler, { once: true });
    }

    // RSS feed button on channel page
    function addRSSFeedButton() {
        if (document.getElementById('CentAnni-channel-btn')) return;

        const rssLinkElement = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
        if (!rssLinkElement) return;
        const rssFeedUrl = rssLinkElement.getAttribute('href');

        const actionsContainer = document.querySelector('.ytFlexibleActionsViewModelHost, .yt-flexible-actions-view-model-wiz');
        if (!actionsContainer) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'yt-flexible-actions-view-model-wiz__action';

        const rssLink = document.createElement('a');
        rssLink.id = 'CentAnni-channel-btn';
        rssLink.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
        rssLink.title = 'Click to open RSS feed or right-click to Copy Link';
        rssLink.rel = 'noopener noreferrer';
        rssLink.href = rssFeedUrl;
        rssLink.target = '_blank';

        const rssIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        rssIcon.setAttribute('viewBox', '0 0 24 24');
        rssIcon.setAttribute('width', '24');
        rssIcon.setAttribute('height', '24');
        rssIcon.style.fill = '#FF9800';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '6.18');
        circle.setAttribute('cy', '17.82');
        circle.setAttribute('r', '2.18');
        rssIcon.appendChild(circle);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z');
        rssIcon.appendChild(path);

        rssLink.appendChild(rssIcon);
        rssLink.appendChild(document.createTextNode('RSS Feed'));
        buttonContainer.appendChild(rssLink);
        actionsContainer.appendChild(buttonContainer);
    }

    // add playlist buttons to channel page
    function addPlaylistButtons() {
        if (document.querySelector('a[data-centanni-playlist-channel-btn="all"]')) return;

        const channelID = document.querySelector('[itemprop="identifier"]')?.content;
        if (!channelID) return;

        const allVideosURL = `https://www.youtube.com/playlist?list=UU${channelID.slice(2)}`;
        const fullVideoURL = `https://www.youtube.com/playlist?list=UULF${channelID.slice(2)}`;
        const shortsURL = `https://www.youtube.com/playlist?list=UUSH${channelID.slice(2)}`;

        const actionsContainer = document.querySelector('.ytFlexibleActionsViewModelHost, .yt-flexible-actions-view-model-wiz');
        if (!actionsContainer) return;

        const createPlaylistButton = (url, text, buttonID) => {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'yt-flexible-actions-view-model-wiz__action';

            const buttonLink = document.createElement('a');
            buttonLink.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
            buttonLink.id = 'CentAnni-channel-btn';
            buttonLink.setAttribute('data-centanni-playlist-channel-btn', buttonID);
            buttonLink.title = `Click to Open ${text} Playlist`;
            buttonLink.rel = 'noopener noreferrer';
            buttonLink.href = url;
            buttonLink.target = '_self';

            const playlistIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            playlistIcon.setAttribute('viewBox', '0 0 24 24');
            playlistIcon.setAttribute('width', '24');
            playlistIcon.setAttribute('height', '24');
            playlistIcon.style.fill = 'var(--yt-spec-brand-icon-inactive)';
            const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            iconPath.setAttribute('clip-rule', 'evenodd');
            iconPath.setAttribute('fill-rule', 'evenodd');
            iconPath.setAttribute('d', 'M3.75 5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 5 20.25 5H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 9 20.25 9H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-8.5Zm8.5 4c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h8.5Zm3.498-3.572c-.333-.191-.748.05-.748.434v6.276c0 .384.415.625.748.434L22 17l-6.252-3.572Z');

            playlistIcon.appendChild(iconPath);
            buttonLink.appendChild(playlistIcon);
            buttonLink.appendChild(document.createTextNode(text));

            buttonContainer.appendChild(buttonLink);
            return buttonContainer;
        };

        if (!USER_CONFIG.hideShorts) {
            const allVideosButton = createPlaylistButton(allVideosURL, 'All Uploads', 'all');
            actionsContainer.appendChild(allVideosButton);
        }

        const fullVideosButton = createPlaylistButton(fullVideoURL, 'Videos', 'full');
        actionsContainer.appendChild(fullVideosButton);

        if (!USER_CONFIG.hideShorts) {
            const shortsButton = createPlaylistButton(shortsURL, 'Shorts', 'shorts');
            actionsContainer.appendChild(shortsButton);
        }
    }

    // function to change playlist direction
    function playlistDirection() {
        if (!hasPlaylistPanel && !playlistPanel && !watchFlexyElement) return;

        let playlistItems;
        let currentVideoIndex;
        let videoAboveInfo;
        let videoBelowInfo;
        let nextButton;
        let observer;
        let nextBtnObserver;
        let cleanupDone = false;
        let playNextBtnStatus = false;
        let validDataVideoAbove = false;
        let validDataVideoBelow = false;
        let savedDirection = localStorage.getItem('CentAnni_playlistDirection') || 'down';
        let reverseDirection = savedDirection === 'up';

        function getPlaylistInfo() {
            function getVideoThumbnailURL(currentURL) {
                let videoID = null;
                if (currentURL) {
                    const watchMatch = currentURL.match(/[?&]v=([^&#]*)/);
                    if (watchMatch && watchMatch[1]) videoID = watchMatch[1];
                    else {
                        const shortMatch = currentURL.match(/youtu\.be\/([^?&#]*)/);
                        if (shortMatch && shortMatch[1]) videoID = shortMatch[1];
                    }
                }
                return videoID ? `https://i.ytimg.com/vi/${videoID}/mqdefault.jpg` : null;
            }

            function processVideoInfo(videoElement) {
                if (!videoElement) return { info: null, isValid: false };

                const link = videoElement.querySelector('a#wc-endpoint');
                const title = videoElement.querySelector('#video-title');
                const href = link ? link.href : null;
                let thumbnailUrl = null;
                const thumbImg = videoElement.querySelector('ytd-thumbnail img');
                if (thumbImg && thumbImg.src) thumbnailUrl = thumbImg.src;
                else thumbnailUrl = getVideoThumbnailURL(href);

                if (!(link && title)) return { info: null, isValid: false };

                const info = {
                    link: link,
                    href: href,
                    thumbnail: thumbnailUrl,
                    title: title ? title.textContent.trim() : null
                };
                const isValid = (link && href && thumbnailUrl && thumbnailUrl.trim() !== '' && title && title.textContent && title.textContent.trim() !== '');

                return { info, isValid };
            }

            if (!playlistSelectedVideo) return null;

            playlistItems = [...watchFlexyElement.querySelectorAll('ytd-playlist-panel-video-renderer')];
            if (!playlistItems || playlistItems.length <= 1) return null;

            currentVideoIndex = playlistItems.indexOf(playlistSelectedVideo);
            if (currentVideoIndex === -1) return null;

            nextButton = watchFlexyElement.querySelector('.ytp-next-button');

            if (currentVideoIndex > 0) {
                const videoAbove = playlistItems[currentVideoIndex - 1];
                const result = processVideoInfo(videoAbove);
                videoAboveInfo = result.info;
                validDataVideoAbove = result.isValid;
            }

            if (currentVideoIndex < playlistItems.length - 1) {
                const videoBelow = playlistItems[currentVideoIndex + 1];
                const result = processVideoInfo(videoBelow);
                videoBelowInfo = result.info;
                validDataVideoBelow = result.isValid;
            }

            const success = validDataVideoAbove && validDataVideoBelow;
            return success;
        }

        function createButtons(reverseDirection) {
            const playlistActionMenu = watchFlexyElement.querySelector('#playlist-action-menu .top-level-buttons') || watchFlexyElement.querySelector('#playlist-action-menu');
            if (!playlistActionMenu) return null;

            const BTN_CLASS = 'yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default CentAnni-playlist-direction-btn';

            const directionContainer = document.createElement('div');
            directionContainer.id = 'CentAnni-playlist-direction-container';

            const fragment = document.createDocumentFragment();

            const directionText = document.createElement('span');
            directionText.textContent = 'Playlist Direction:';
            fragment.appendChild(directionText);

            function createDirectionButton(isUpButton) {
                const button = document.createElement('button');
                button.className = BTN_CLASS;
                if (reverseDirection === isUpButton) button.classList.add('active');
                button.title = isUpButton
                    ? 'Play Videos Ascending'
                    : 'Play Videos Descending (YouTube Default)';

                const iconDiv = document.createElement('div');
                iconDiv.className = 'yt-spec-button-shape-next__icon';
                iconDiv.setAttribute('aria-hidden', 'true');
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svg.setAttribute('height', '24');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('width', '24');
                svg.setAttribute('focusable', 'false');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', isUpButton
                    ? 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z'
                    : 'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z');

                svg.appendChild(path);
                iconDiv.appendChild(svg);
                button.appendChild(iconDiv);

                return button;
            }

            const upButton = createDirectionButton(true);
            const downButton = createDirectionButton(false);
            fragment.appendChild(upButton);
            fragment.appendChild(downButton);
            directionContainer.appendChild(fragment);

            const existingContainer = watchFlexyElement.querySelector('#CentAnni-playlist-direction-container');
            existingContainer ? existingContainer.replaceWith(directionContainer) : playlistActionMenu.appendChild(directionContainer);

            return { upButton, downButton };
        }

        function setNextButton(info) {
            if (!nextButton || !info) return;
            if (info.href && info.thumbnail && info.title) {
                nextButton.href = info.href;
                nextButton.dataset.preview = info.thumbnail;
                nextButton.dataset.tooltipText = info.title;
            }
        }

        function upNextBtn() {
            if (reverseDirection === playNextBtnStatus || !nextButton) return;
            if (reverseDirection) {
                if (videoAboveInfo) {
                    setNextButton(videoAboveInfo);
                    nextButton.removeEventListener('click', nextButtonClickHandler, true);
                    nextButton.addEventListener('click', nextButtonClickHandler, true);
                    document.addEventListener('keydown', handleKeyboardShortcut, true);
                    playNextBtnStatus = true;
                }
            } else {
                document.removeEventListener('keydown', handleKeyboardShortcut, true);
                nextButton.removeEventListener('click', nextButtonClickHandler, true);
                if (videoBelowInfo) setNextButton(videoBelowInfo);
                playNextBtnStatus = false;
            }
        }

        function observeNextButtonReady(cb) {
            if (!nextButton || !cb) return;
            if (nextButton.href && nextButton.dataset.preview && nextButton.dataset.tooltipText) {
                cb();
                return;
            }

            let timeoutNextBtnObs = setTimeout(() => {
                if (nextBtnObserver) nextBtnObserver.disconnect();
                cb();
            }, 7000);

            nextBtnObserver = new MutationObserver(() => {
                if (nextButton.href && nextButton.dataset.preview && nextButton.dataset.tooltipText) {
                    clearTimeout(timeoutNextBtnObs);
                    nextBtnObserver.disconnect();
                    cb();
                }
            });
            nextBtnObserver.observe(nextButton, { attributes: true });
        }

        function nextButtonClickHandler(e) {
            if (reverseDirection && videoAboveInfo) {
                e.preventDefault();
                e.stopPropagation();

                if (videoAboveInfo.link) videoAboveInfo.link.click();
                return false;
            }
        }

        function handleKeyboardShortcut(e) {
            if (e.key === 'N' && e.shiftKey) {
                if (reverseDirection && videoAboveInfo) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (videoAboveInfo.link) videoAboveInfo.link.click();
                    return false;
                }
            }
        }

        function upButtonHandler() {
            localStorage.setItem('CentAnni_playlistDirection', 'up');
            reverseDirection = true;

            upButton.classList.add('active');
            downButton.classList.remove('active');

            upNextBtn();
        }

        // handle down button click
        function downButtonHandler() {
            localStorage.setItem('CentAnni_playlistDirection', 'down');
            reverseDirection = false;

            upButton.classList.remove('active');
            downButton.classList.add('active');

            upNextBtn();
        }

        // cleanup
        const handleCleanup = () => {
            if (cleanupDone) return;
            document.removeEventListener('yt-navigate', handleCleanup);
            document.removeEventListener('yt-autonav-pause-player-ended', handleCleanup);
            document.removeEventListener('keydown', handleKeyboardShortcut, true);
            nextButton.removeEventListener('click', nextButtonClickHandler, true);
            upButton.removeEventListener('click', upButtonHandler);
            downButton.removeEventListener('click', downButtonHandler);
            if (nextBtnObserver) nextBtnObserver.disconnect();
            if (observer) observer.disconnect();
            cleanupDone = true;
        };

        const handleVideoEnd = () => {
            document.removeEventListener('yt-autonav-pause-player-ended', handleVideoEnd);
            if (!reverseDirection || !videoAboveInfo) return;
            else if (videoAboveInfo.link) videoAboveInfo.link.click();
        };

        document.addEventListener('yt-navigate', handleCleanup);
        document.addEventListener('yt-autonav-pause-player-ended', handleCleanup);
        document.addEventListener('yt-autonav-pause-player-ended', handleVideoEnd);

        // initiation
        const { upButton, downButton } = createButtons(reverseDirection);
        if (upButton && downButton) {
            upButton.addEventListener('click', upButtonHandler);
            downButton.addEventListener('click', downButtonHandler);
        }

        observer = new MutationObserver(() => {
            const selectedItem = watchFlexyElement.querySelector('ytd-playlist-panel-video-renderer[selected]');
            nextButton = watchFlexyElement.querySelector('.ytp-next-button');
            if (selectedItem && nextButton) {
                if (getPlaylistInfo()) {
                    observer.disconnect();
                    observeNextButtonReady(upNextBtn);
                    return;
                }
            }
        });

        const config = { childList: true, subtree: true, };
        observer.observe(watchFlexyElement, config);
    }

    // function to prevent autoplay
    function pauseYouTubeVideo() {
        document.removeEventListener('yt-player-updated', pauseYouTubeVideo);

        if (!/^https:\/\/(www\.|m\.)?youtube\.com\/watch\?v=/.test(window.location.href) || document.querySelector('.ytp-time-display')?.classList.contains('ytp-live')) return;

        const elements = {
            player: document.getElementById('movie_player'),
            video: document.querySelector('video'),
            watchFlexy: document.querySelector('ytd-watch-flexy'),
            thumbnailOverlayImage: document.querySelector('.ytp-cued-thumbnail-overlay-image'),
            thumbnailOverlay: document.querySelector('.ytp-cued-thumbnail-overlay')
        };

        if (!elements.player || !elements.video || !elements.watchFlexy) return;

        const urlParams = new URLSearchParams(window.location.search);
        const vinteo = urlParams.get('v');

        if (elements.watchFlexy.hasAttribute('default-layout')) {
            if (USER_CONFIG.autoTheaterMode) toggleTheaterMode();
            setTimeout(pauseVideo, 200);
        } else if (elements.watchFlexy.hasAttribute('theater')) {
            pauseVideo();
        }

        function pauseVideo() {
            const { player, video, thumbnailOverlayImage, thumbnailOverlay } = elements;
            if (player && video) {
                video.pause();
                player.classList.remove('playing-mode');
                player.classList.add('unstarted-mode', 'paused-mode');
                const playingHandler = () => {
                    if (thumbnailOverlayImage) {
                        thumbnailOverlayImage.removeAttribute('style');
                        thumbnailOverlayImage.style.display = 'none';
                        thumbnailOverlay.removeAttribute('style');
                        thumbnailOverlay.style.display = 'none';
                    }
                    video.removeEventListener('playing', playingHandler);
                };
                video.addEventListener('playing', playingHandler);
            }

            showThumbnail(vinteo);
        }

        function showThumbnail(vinteo) {
            const { thumbnailOverlayImage, thumbnailOverlay } = elements;
            if (thumbnailOverlayImage && thumbnailOverlay && lastVideoID !== vinteo) {
                thumbnailOverlay.style.cssText = 'display: block';
                void thumbnailOverlayImage.offsetHeight;
                thumbnailOverlayImage.style.cssText = `
                    display: block;
                    z-index: 10;
                    background-image: url("https://i.ytimg.com/vi/${vinteo}/maxresdefault.jpg");
                `;
            }
        }
    }

    // YouTube Shorts loop control and auto-scroll
    const SVG_NS = "http://www.w3.org/2000/svg";
    const createLoopIcon = () => {
        const svg = document.createElementNS(SVG_NS, "svg");
        const path = document.createElementNS(SVG_NS, "path");

        [["width", "24"], ["height", "24"], ["viewBox", "0 0 24 24"], ["fill", "currentColor"],].forEach(([k, v]) => svg.setAttribute(k, v));
        path.setAttribute("d", "M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z");

        svg.appendChild(path);
        return svg;
    };

    function shortsPlaybackControl() {
        const shortVideo = document.querySelector('ytd-shorts #shorts-player > div.html5-video-container > video');
        const menuBtn = document.querySelector('ytd-shorts #actions, ytd-shorts #menu-button');
        if (!shortVideo || !menuBtn) return;

        const savedShortsSetting = 'CentAnni_shortsPlayMode';
        const savedMode = localStorage.getItem(savedShortsSetting) || 'loop';
        const BTN_CLASS = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        let animationID = null;
        let endedListener = null;

        const cleanup = () => {
            if (animationID) { cancelAnimationFrame(animationID); animationID = null; }
            if (endedListener) { shortVideo.removeEventListener('ended', endedListener); endedListener = null; }
        };

        const cleanupOnNavigation = () => {
            cleanup();
            document.getElementById('CentAnni-yt-shorts-controls')?.remove();
        };

        const removeLoop = () => {
            shortVideo.removeAttribute('loop');
            animationID = requestAnimationFrame(removeLoop);
        };

        const nextShort = () => {
            document.querySelector('ytd-shorts #navigation-button-down button')?.click();
        };

        const applyMode = mode => {
            cleanup();
            switch (mode) {
                case 'off':
                    removeLoop();
                    break;
                case 'loop':
                    shortVideo.setAttribute('loop', '');
                    break;
                case 'auto':
                    removeLoop();
                    endedListener = nextShort;
                    shortVideo.addEventListener('ended', endedListener);
                    break;
            }
        };

        const createButtons = () => {
            const container = document.createElement('div');
            container.id = 'CentAnni-yt-shorts-controls';

            const setActive = activeBtn => {
                container.querySelectorAll('.CentAnni-yt-shorts-control-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                activeBtn.classList.add('active');
            };

            const createButton = (label, mode, title) => {
                const btn = document.createElement('button');
                btn.className = `${BTN_CLASS} CentAnni-yt-shorts-control-btn`;
                btn.title = title;
                typeof label === 'string' ? (btn.textContent = label) : btn.appendChild(label);
                if (savedMode === mode) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    localStorage.setItem(savedShortsSetting, mode);
                    setActive(btn);
                    applyMode(mode);
                });
                return btn;
            };

            container.append(
                createButton('off', 'off', 'Disable Looping'),
                createButton(createLoopIcon(), 'loop', 'Loop Short'),
                createButton('auto', 'auto', 'Auto Scroll')
            );

            const existingContainer = document.getElementById('CentAnni-yt-shorts-controls');
            existingContainer ? existingContainer.replaceWith(container) : menuBtn.prepend(container);
        };

        document.addEventListener('yt-navigate-start', cleanupOnNavigation, { once: true });
        createButtons();
        applyMode(savedMode);
    }

    // function to sort comments newest first
    function sortCommentsNewFirst() {
        let commentObserver = null;
        let headerObserver = null;
        let dropdownObserver = null;
        let commentFallback = null;
        let dropdownFallback = null;
        const lang = commentMatrix[uiLanguage];

        // handler for YouTube service requests in tab view mode
        const serviceRequestHandler = function (event) {
            const commentsTab = watchFlexyElement.querySelector('.CentAnni-tabView-tab[data-tab="tab-2"]');
            if (commentsTab && commentsTab.classList.contains('active')) {
                document.removeEventListener('yt-service-request-sent', serviceRequestHandler);
                observeCommentSection();
            }
        };

        // comment sorting detection
        function setupCommentSortingDetection() {
            if (USER_CONFIG.videoTabView) {
                document.removeEventListener('yt-service-request-sent', serviceRequestHandler);
                document.addEventListener('yt-service-request-sent', serviceRequestHandler);
            } else observeCommentSection();
        }

        // observe comment section and detect when it's loaded
        function observeCommentSection() {
            const existing = watchFlexyElement.querySelector(cmtsSel);
            if (existing) {
                monitorHeader(existing);
                return;
            }

            commentObserver = new MutationObserver(() => {
                const commentsSection = watchFlexyElement.querySelector(cmtsSel);
                if (commentsSection) {
                    clearTimeout(commentFallback);
                    commentObserver.disconnect();
                    commentObserver = null;
                    monitorHeader(commentsSection);
                }
            });
            commentObserver.observe(watchFlexyElement, { childList: true, subtree: true });
            commentFallback = setTimeout(() => {
                if (commentObserver) {
                    commentObserver.disconnect();
                    commentObserver = null;
                }
            }, 7000);
        }

        function monitorHeader(commentsSection) {
            if (commentsSection.textContent.includes(lang.off)) return;

            headerObserver = new MutationObserver(() => {
                const commentsHeader = commentsSection.querySelector('ytd-comments-header-renderer');
                const sortButton = commentsSection.querySelector('yt-sort-filter-sub-menu-renderer');

                if (commentsHeader && sortButton) {
                    headerObserver.disconnect();
                    headerObserver = null;
                    changeSortingToNewestFirst();
                }
            });
            headerObserver.observe(commentsSection, { childList: true, subtree: true });
        }

        // set newest first
        function changeSortingToNewestFirst() {
            const sortButton = watchFlexyElement.querySelector('yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button');
            if (!sortButton) return;
            sortButton.click();

            dropdownObserver = new MutationObserver(() => {
                const listBox = document.querySelector('tp-yt-paper-listbox');
                if (!listBox) return;

                const options = listBox.querySelectorAll('a.yt-simple-endpoint');
                let newestFirstOption = null;
                for (const option of options) {
                    if (option.textContent.toLowerCase().includes(lang.newest.toLowerCase())) {
                        newestFirstOption = option;
                        break;
                    }
                }
                if (!newestFirstOption && options.length > 1) newestFirstOption = options[1];

                if (newestFirstOption) {
                    newestFirstOption.click();
                    dropdownObserver.disconnect();
                    dropdownObserver = null;
                    clearTimeout(dropdownFallback);
                    dropdownFallback = null;
                }
            });
            dropdownObserver.observe(document.documentElement, { childList: true, subtree: true });

            dropdownFallback = setTimeout(() => {
                if (dropdownObserver) {
                    dropdownObserver.disconnect();
                    dropdownObserver = null;
                }
            }, 7000);
        }

        const cleanupOnNavigation = () => {
            document.removeEventListener('yt-service-request-sent', serviceRequestHandler);
            if (commentObserver) { commentObserver.disconnect(); commentObserver = null; }
            if (headerObserver) { headerObserver.disconnect(); headerObserver = null; }
            if (dropdownObserver) { dropdownObserver.disconnect(); dropdownObserver = null; }
            if (commentFallback) { clearTimeout(commentFallback); commentFallback = null; }
            if (dropdownFallback) { clearTimeout(dropdownFallback); dropdownFallback = null; }
        };
        document.addEventListener('yt-navigate-start', cleanupOnNavigation, { once: true });

        setupCommentSortingDetection();
    }

    // sort notifications chronologically
    function chronoNotifications() {
        const sectionSelector = '#sections yt-multi-page-menu-section-renderer';
        const panel = [...document.querySelectorAll('body > ytd-app > ytd-popup-container tp-yt-iron-dropdown')].find(el => getComputedStyle(el).display !== 'none');
        if (chronoNotificationRunning || !panel) return;
        chronoNotificationRunning = true;

        const sequence = unitMatrix[uiLanguage];
        const unitPositions = getUnitPositions(uiLanguage);

        const ready = () => {
            const spinner = panel.querySelector('#spinner'),
                header = panel.querySelector('#header'),
                container = panel.querySelector('#container'),
                content = panel.querySelectorAll(`${sectionSelector} ytd-notification-renderer`);
            return content.length >= 4 && spinner && header && container && spinner.hasAttribute('hidden') && !header.hasAttribute('hidden') && !container.hasAttribute('hidden');
        };

        const whenReady = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                chronoNotificationRunning = false;
                observer.disconnect();
                reject();
            }, 7000);

            const check = () => { if (ready()) { observer.disconnect(); clearTimeout(timeout); resolve(); } };
            const observer = new MutationObserver(check);
            observer.observe(panel, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
            check();
        });

        whenReady.then(() => {
            const sections = panel.querySelectorAll(sectionSelector);
            if (sections.length < 2) { chronoNotificationRunning = false; return; }

            const importantSection = sections[0];
            const moreSection = sections[1];
            const moreItemsContainer = moreSection.querySelector('#items');
            const currentMoreItems = [...moreItemsContainer.children];
            const importantItems = [...importantSection.querySelectorAll('ytd-notification-renderer')];
            if (importantItems.length === 0) { chronoNotificationRunning = false; return; }

            function getSortKey(el) {
                const time = el.querySelector('.metadata yt-formatted-string:last-child');
                if (!time) return { position: -1, numericValue: Infinity };

                const rawTime = time.textContent.trim();
                const digitMatch = rawTime.match(/(\d+)/);
                const numericToken = digitMatch ? digitMatch[1] : '0';
                const numericValue = Number(numericToken);
                const unitString = rawTime.replace(numericToken, '').replace(/\s+/g, ' ').trim().toLowerCase();
                const unitIndex = sequence.findIndex(u => unitString.includes(u));
                const position = unitIndex === -1 ? -1 : unitPositions[sequence[unitIndex]];

                return { position, numericValue };
            }

            importantItems.forEach(item => {
                const A = getSortKey(item);
                const before = currentMoreItems.find(r => {
                    const B = getSortKey(r);
                    return (B.position > A.position) || (B.position === A.position && B.numericValue > A.numericValue);
                });

                moreItemsContainer.insertBefore(item, before || null);
                const idx = currentMoreItems.indexOf(before);
                currentMoreItems.splice(idx === -1 ? currentMoreItems.length : idx, 0, item);
            });

            chronoNotificationRunning = false;
        });
    }

    function getUnitPositions(locale) {
        const units = unitMatrix[locale];
        const positions = {};

        units.forEach((unit, index) => {
            positions[unit] = Math.floor(index / 2);
        });

        return positions;
    }

    // theater mode check
    function theaterModeCheck() {
        isTheaterMode = watchFlexyElement?.hasAttribute('theater') || false;
    }

    // fullscreen check
    function fullscreenCheck() {
        isFullscreen = playerElement?.classList.contains('ytp-fullscreen') || false;
    }

    function musicVideoCheck() {
        isMusicVideo = !!(docElement.querySelector('meta[itemprop="genre"][content="Music"]') && docElement.querySelector('ytd-watch-flexy #below ytd-badge-supported-renderer .badge-style-type-verified-artist'));
    }

    // live stream check
    function liveVideoCheck() {
        isLiveVideo = watchFlexyElement.querySelector('.ytp-time-display')?.classList.contains('ytp-live') || false;
    }

    // chapter panel check
    function chapterPanelCheck() {
        chapterPanel = watchFlexyElement.querySelector('ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-description-chapters]') || watchFlexyElement.querySelector('ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-macro-markers-auto-chapters]');
        hasChapterPanel = !!chapterPanel;
    }

    // function to automatically open the chapter panel
    function openChapters() {
        runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
    }

    // playlist panel check
    function playlistPanelCheck() {
        const playlistVideoItem = watchFlexyElement ? watchFlexyElement.querySelector('ytd-playlist-panel-video-renderer[id="playlist-items"]') : null;
        playlistPanel = watchFlexyElement ? watchFlexyElement.querySelector('ytd-playlist-panel-renderer[id="playlist"]') : null;
        hasPlaylistPanel = !!(playlistVideoItem && playlistPanel);
        playlistSelectedVideo = watchFlexyElement.querySelector('ytd-playlist-panel-video-renderer[selected]');
    }

    // transcript panel check
    function transcriptPanelCheck() {
        transcriptPanel = watchFlexyElement.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
        hasTranscriptPanel = !!transcriptPanel;
    }

    // function to automatically open the transcript panel
    function openTranscript() {
        runInPage(() => (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')).visibility = "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
        if (USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); });
        if (USER_CONFIG.transcriptTimestamps && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(enableTimestamps);
    }

    // transcript enable timestamps
    function enableTimestamps() {
        const transcriptPanelTimestamps = watchFlexyElement.querySelector('ytd-transcript-search-panel-renderer[hide-timestamps]');
        if (transcriptPanelTimestamps) transcriptPanelTimestamps.removeAttribute('hide-timestamps');
    }

    // move transcript menu button
    function transcriptMenuButton() {
        if (transcriptPanel) {
            const menuButton = transcriptPanel?.querySelector('#header > #menu');
            const footerSlot = transcriptPanel?.querySelector('#footer > ytd-transcript-footer-renderer');
            if (menuButton && footerSlot) footerSlot.appendChild(menuButton);
            transcriptMenuButtonMoved = true;
        }
    }

    // wait for transcript to load
    function waitForTranscriptWithoutYTE(callback) {
        const transcriptItems = transcriptPanel.querySelectorAll("ytd-transcript-segment-renderer");
        if (transcriptItems.length > 0) {
            callback();
            return;
        }

        let transcriptLoadedWithoutYTE = null;
        const transcriptObserver = new MutationObserver(() => {
            const transcriptItems = transcriptPanel.querySelectorAll("ytd-transcript-segment-renderer");
            if (transcriptItems.length > 0) {
                transcriptLoadedWithoutYTE = true;
                clearTimeout(transcriptFallbackTimer);
                transcriptObserver.disconnect();
                callback();
            }
        });

        transcriptObserver.observe(transcriptPanel, { childList: true, subtree: true });

        const transcriptFallbackTimer = setTimeout(() => {
            if (!transcriptLoadedWithoutYTE) transcriptObserver.disconnect();
        }, 7000);
    }

    // check and close chat window and close
    function chatWindowCheck() {
        hasChatPanel = !!(document.querySelector('#chat, iframe#chatframe, yt-video-metadata-carousel-view-model'));

        const chatMessageElement = document.querySelector('#chat-container ytd-live-chat-frame #message');
        const chatMessageElementStatus = document.querySelector('ytd-message-renderer.style-scope.ytd-live-chat-frame');
        const isChatMessageElementVisible = chatMessageElementStatus && window.getComputedStyle(chatMessageElementStatus).display !== 'none';

        if (chatMessageElement && isChatMessageElementVisible) {
            const messageText = chatMessageElement.textContent.trim();
            if (messageText === 'Chat is disabled for this live stream.') chatEnabled = false;
        } else chatEnabled = true;

        if (USER_CONFIG.closeChatWindow && initialRun && hasChatPanel && chatEnabled) closeLiveChat();
        else docElement.classList.remove('CentAnni-close-live-chat');
    }

    // localize languages
    function languageCheck() {
        const targetLanguageAudio = USER_CONFIG.defaultAudioLanguage.replace('auto', 'english');
        const targetLanguageSubtitles = USER_CONFIG.defaultSubtitleLanguage.replace('auto', 'english');
        const targetLanguageTranscript = USER_CONFIG.defaultTranscriptLanguage.replace('auto', 'english');
        const namesInUI = new Intl.DisplayNames([uiLanguage], { type: 'language' });
        if (USER_CONFIG.defaultAudioLanguage !== 'auto') audioInLanguage = namesInUI.of(languageMap[targetLanguageAudio].code).toLowerCase();
        if (USER_CONFIG.defaultSubtitleLanguage !== 'auto') subtitleInLanguage = targetLanguageSubtitles === 'off' ? languageMap[new Intl.DisplayNames(['en'], { type: 'language' }).of(uiLanguage).toLowerCase()].offNative.toLowerCase() : namesInUI.of(languageMap[targetLanguageSubtitles].code).toLowerCase();
        if (USER_CONFIG.defaultTranscriptLanguage !== 'auto') transcriptInLanguage = namesInUI.of(languageMap[targetLanguageTranscript].code).toLowerCase();
        if (USER_CONFIG.defaultTranscriptLanguage !== 'auto' || USER_CONFIG.defaultAudioLanguage !== 'auto' || USER_CONFIG.defaultSubtitleLanguage !== 'auto') englishInLanguage = namesInUI.of(languageMap.english.code).toLowerCase();
    }

    // redirect channel page to videos
    function channelRedirect() {
        window.location.href = window.location.href.replace(/\/$/, '') + '/videos';
    }

    // redirect shorts to video page
    function redirectShortsToVideoPage() {
        window.location.href = window.location.href.replace('/shorts/', '/watch?v=');
    }

    // expand video description
    function clickDescriptionBtn() {
        const btn = watchFlexyElement.querySelector('ytd-text-inline-expander tp-yt-paper-button#expand');
        if (btn) btn.click();
    }

    // function to hide watched videos based on percentage
    function markWatchedVideos() {
        markWatchedVideosObserver?.disconnect();

        const homePage = (USER_CONFIG.videosHideWatchedHome && !USER_CONFIG.videosHideWatched) ? document.querySelector('ytd-browse[page-subtype="home"]:not([hidden]) #primary > ytd-rich-grid-renderer > #contents') : false;
        const subscriptionPage = USER_CONFIG.videosHideWatchedSubscriptions ? document.querySelector('ytd-browse[page-subtype="subscriptions"]:not([hidden]) #primary > ytd-rich-grid-renderer > #contents') : false;
        const channelPage = USER_CONFIG.videosHideWatchedChannels ? document.querySelector('ytd-browse[page-subtype="channels"]:not([hidden]) #primary #contents') : false;
        const playlistPage = USER_CONFIG.videosHideWatchedPlaylist ? document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden]) #primary ytd-playlist-video-list-renderer > #contents') : false;
        const videoPage = USER_CONFIG.videosHideWatchedVideo ? document.querySelector('ytd-watch-flexy:not([hidden]) #secondary #related #items') : false;
        const searchPage = USER_CONFIG.videosHideWatchedSearch ? document.querySelector('ytd-search:not([hidden]) ytd-section-list-renderer > #contents') : false;
        const location = subscriptionPage || homePage || videoPage || channelPage || playlistPage || searchPage;
        if (!location) return;

        const tags = ['ytd-rich-item-renderer', 'yt-lockup-view-model', 'ytd-grid-video-renderer', 'ytd-playlist-video-renderer', 'ytd-video-renderer'];
        const selector = tags.map(t => `${t}:has(.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment,#progress):not(.CentAnni-marked-watched)`).join(',');
        const percentage = USER_CONFIG.videosHideWatchedGlobalJS;

        const processVideos = () => {
            const videoContainers = location.querySelectorAll(selector);
            videoContainers.forEach(container => {
                const progressBar = container.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment,#overlays #progress,#progress');
                if (progressBar) {
                    const percent = parseFloat(progressBar.style.width.replace('%', '')) || 0;
                    if (percent >= percentage) container.classList.add('CentAnni-marked-watched');
                }
            });
        };
        processVideos();

        markWatchedVideosObserver = new MutationObserver(() => {
            clearTimeout(markWatchedVideosTimeout);
            markWatchedVideosTimeout = setTimeout(() => {
                const newVideos = location.querySelectorAll(selector);
                if (newVideos.length > 0) processVideos();
            }, 50);
        });
        markWatchedVideosObserver.observe(location, { childList: true, subtree: true });
        document.addEventListener('yt-navigate-start', () => { markWatchedVideosObserver?.disconnect(); }, { once: true });
    }

    // restore feed filter chip on the homepage and suggested videos
    function restoreLastSelectedChip() {
        const homePage = document.querySelector('ytd-browse[page-subtype="home"]:not([hidden])');
        const feedFilterContainer = isHomePage ? homePage?.querySelector('#header #chips') : watchFlexyElement?.querySelector('#related #chips');
        if (!feedFilterContainer) return;
        let firstRun = true;
        let chipObserver;

        const ironChipStorage = isHomePage ? "CentAnni_lastSelectedIronChip" : "CentAnni_lastSelectedIronChipWatch";
        const lastSelectedChip = localStorage.getItem(ironChipStorage);
        const ironSelector = isHomePage ? 'yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer' : 'yt-chip-cloud-chip-renderer.yt-chip-cloud-renderer';
        const ironSelected = ironSelector + '.iron-selected';

        const checkChips = () => {
            const selectedChip = feedFilterContainer.querySelector(ironSelected + ':not(:first-child)');
            if (selectedChip) {
                const chipText = selectedChip.querySelector('.ytChipShapeChip')?.textContent?.trim();
                if (chipText) localStorage.setItem(ironChipStorage, chipText);
                if (firstRun) setUpObserver();
            }
        };

        if (lastSelectedChip) {
            const ironChips = feedFilterContainer.querySelectorAll(ironSelector);
            for (const chip of ironChips) {
                const chipText = chip.querySelector('.ytChipShapeChip')?.textContent?.trim();
                if (chipText === lastSelectedChip) {
                    const button = chip.querySelector('button[role="tab"]');
                    button?.click();
                    break;
                }
            }
        }

        const cleanUp = () => {
            chipObserver?.disconnect();
            document.removeEventListener('yt-navigate-start', cleanUp);
            document.removeEventListener('yt-service-request-completed', checkChips);
        };

        document.addEventListener('yt-navigate-start', cleanUp);
        document.addEventListener('yt-service-request-completed', checkChips);

        chipObserver?.disconnect();
        const setUpObserver = () => {
            firstRun = false;
            const allChip = feedFilterContainer.querySelector(ironSelector + ':first-child');
            chipObserver = new MutationObserver(() => {
                if (allChip.hasAttribute('selected'))
                    localStorage.removeItem(ironChipStorage);
            });
            chipObserver.observe(allChip, { attributes: true, attributeFilter: ['selected'] });
        };
    }

    // reset function
    function handleYTNavigation() {
        if (USER_CONFIG.playbackSpeed) {
            document.removeEventListener('yt-player-updated', initialSpeed);
            document.addEventListener('yt-player-updated', initialSpeed);
        }

        if (USER_CONFIG.preventAutoplay) {
            document.removeEventListener('yt-player-updated', pauseYouTubeVideo);
            document.addEventListener('yt-player-updated', pauseYouTubeVideo);
        }

        if (USER_CONFIG.videoTabView) {
            document.querySelector('#related.style-scope.ytd-watch-flexy')?.classList.remove('CentAnni-tabView-content-attiva');
            document.querySelector('ytd-playlist-panel-renderer[id="playlist"].style-scope.ytd-watch-flexy')?.classList.remove('CentAnni-tabView-content-active');
        }

        document.querySelectorAll('.CentAnni-button-wrapper:not(:has(#transcript-settings-button)), #CentAnni-channel-btn, .CentAnni-remaining-time-container, .CentAnni-info-date, #CentAnni-progress-bar-bar, #CentAnni-progress-bar-start, #CentAnni-progress-bar-end, #yt-alchemy-settings-modal').forEach(el => el.remove());
    }

    // cache elements
    function updateCachedElements() {
        playerElement = document?.getElementById('movie_player');
        watchFlexyElement = document?.querySelector('ytd-watch-flexy');
        endElement = document?.querySelector('#masthead #end');
        headerElement = document?.querySelector('#guide #guide-content > #header');
    }

    // Chrome CSP compliance for setVideoQuality
    function runSetVideoQuality() {
        const c = `(${setVideoQuality})(${JSON.stringify(USER_CONFIG.defaultQuality)},${JSON.stringify(USER_CONFIG.defaultQualityPremium)});`;
        const s = document.createElement('script');
        s.text = scriptPolicy ? scriptPolicy.createScript(c) : c;
        document.documentElement.appendChild(s);
        s.remove();
    }

    // force 2 columns for live chat videos when viewport width is 1000+
    const toggleYouTubeColumns = () => {
        const flexy = document.querySelector('ytd-watch-flexy[is-single-column]');
        const videos = document.querySelector('ytd-item-section-renderer[is-grid-view-enabled]');
        if (flexy && videos && window.innerWidth >= 1000) {
            flexy.removeAttribute('is-single-column');
            flexy.setAttribute('is-two-columns_', '');
            videos.removeAttribute('is-grid-view-enabled');
        }
    };

    //  ┌───────────────────────────────────────────────────────────────────┐
    //  │                         language support                          │
    //  └───────────────────────────────────────────────────────────────────┘

    // settings panel: audio, subtitles, and transcript languages
    const flag = {
        auto: '🌐',
        english: '🇺🇸',
        spanish: '🇪🇸',
        hindi: '🇮🇳',
        portuguese: '🇵🇹',
        german: '🇩🇪',
        french: '🇫🇷',
        italian: '🇮🇹',
        dutch: '🇳🇱',
        polish: '🇵🇱',
        hebrew: '🇮🇱',
        japanese: '🇯🇵',
        korean: '🇰🇷',
        chinese: '🇨🇳',
        indonesian: '🇮🇩',
        swedish: '🇸🇪',
        norwegian: '🇳🇴',
        danish: '🇩🇰',
        finnish: '🇫🇮',
        czech: '🇨🇿',
        greek: '🇬🇷',
        hungarian: '🇭🇺',
        romanian: '🇷🇴',
        ukrainian: '🇺🇦'
    };

    const langs = {
        auto: 'Auto (default)',
        english: 'English',
        spanish: 'Spanish - Español',
        hindi: 'Hindi - हिन्दी',
        portuguese: 'Portuguese - Português',
        german: 'German - Deutsch',
        french: 'French - Français',
        italian: 'Italian - Italiano',
        dutch: 'Dutch - Nederlands',
        polish: 'Polish - Polski',
        hebrew: 'Hebrew - עברית',
        japanese: 'Japanese - 日本語',
        korean: 'Korean - 한국어',
        chinese: 'Chinese - 中文',
        indonesian: 'Indonesian - Bahasa Indonesia',
        swedish: 'Swedish - Svenska',
        norwegian: 'Norwegian - Norsk',
        danish: 'Danish - Dansk',
        finnish: 'Finnish - Suomi',
        czech: 'Czech - Čeština',
        greek: 'Greek - Ελληνικά',
        hungarian: 'Hungarian - Magyar',
        romanian: 'Romanian - Română',
        ukrainian: 'Ukrainian - Українська'
    };

    function labeledLangs(includeOff = false) {
        const result = {};
        for (const key in langs) {
            const emoji = flag[key] || '';
            result[key] = `${emoji} ${langs[key]}`;
            if (includeOff && key === 'auto') result.off = '🚫 Off';
        }
        return result;
    }

    // set audio and subtitles
    const languageMap = new Proxy(Object.create(null), {
        get(cache, key) {
            if (cache[key]) return cache[key];
            const langCode = {
                english: 'en',
                spanish: 'es',
                hindi: 'hi',
                portuguese: 'pt',
                german: 'de',
                french: 'fr',
                italian: 'it',
                dutch: 'nl',
                polish: 'pl',
                hebrew: 'he',
                japanese: 'ja',
                korean: 'ko',
                chinese: 'zh',
                indonesian: 'id',
                swedish: 'sv',
                norwegian: 'no',
                danish: 'da',
                finnish: 'fi',
                czech: 'cs',
                greek: 'el',
                hungarian: 'hu',
                romanian: 'ro',
                ukrainian: 'uk'
            }[key];
            if (!langCode) return;

            const fixedLabels = {
                en: { subs: 'Subtitles', off: 'Off' },
                es: { subs: 'Subtítulos', off: 'Desactivados' },
                hi: { subs: 'उपशीर्षक', off: 'बंद' },
                pt: { subs: 'Legendas', off: 'Desativar' },
                de: { subs: 'Untertitel', off: 'Aus' },
                fr: { subs: 'Sous-titres', off: 'Désactivés' },
                it: { subs: 'Sottotitoli', off: 'Disattivati' },
                nl: { subs: 'Ondertiteling', off: 'Uit' },
                pl: { subs: 'Napisy', off: 'Wyłączone' },
                he: { subs: 'כתוביות', off: 'כבוי' },
                ja: { subs: '字幕', off: 'オフ' },
                ko: { subs: '자막', off: '끄기' },
                zh: { subs: '字幕', off: '关闭' },
                id: { subs: 'Subtitle', off: 'Nonaktifkan' },
                sv: { subs: 'Undertexter', off: 'Av' },
                no: { subs: 'Undertekster', off: 'Av' },
                da: { subs: 'Undertekster', off: 'Fra' },
                fi: { subs: 'Tekstitys', off: 'Pois' },
                cs: { subs: 'Titulky', off: 'Vypnuto' },
                el: { subs: 'Υπότιτλοι', off: 'Απενεργοποίηση' },
                hu: { subs: 'Feliratok', off: 'Ki' },
                ro: { subs: 'Subtitrări', off: 'Dezactivat' },
                uk: { subs: 'Субтитри', off: 'Вимкнено' }
            };

            const dnUI = new Intl.DisplayNames([uiLanguage], { type: 'language' });
            const dnNative = new Intl.DisplayNames([langCode], { type: 'language' });
            const uiLabels = fixedLabels[uiLanguage];

            return cache[key] = {
                english: dnUI.of(langCode),
                native: dnNative.of(langCode),
                nativeSubtitles: uiLabels.subs,
                offNative: uiLabels.off,
                code: langCode
            };
        }
    });

    // sort notifications chronologically
    const unitMatrix = new Proxy({}, {
        get(cache, locale) {
            if (cache[locale]) return cache[locale];

            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
            const pr = new Intl.PluralRules(locale);
            const base = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
            const arr = [];

            function localWord(unit, num) {
                const fullString = rtf.format(-num, unit);
                return fullString.replace(/^\d+\s*/, '').trim().toLowerCase();
            }

            base.forEach(u => {
                arr.push(localWord(u, 1));
                const pluralNum = pr.select(2) === 'one' ? 3 : 2;
                arr.push(localWord(u, pluralNum));
            });

            return cache[locale] = arr;
        }
    });

    // home color code videos
    const categoriesMatrix = new Proxy({
        en: {
            live: ['watching'],
            upcoming: ['waiting', 'scheduled for'],
            newly: ['1 day ago', 'hours ago', 'hour ago', 'minutes ago', 'minute ago', 'seconds ago', 'second ago'],
            lately: ['1 month ago', 'weeks ago', '14 days ago', '13 days ago', '12 days ago', '11 days ago', '10 days ago', '9 days ago', '8 days ago'],
            recent: ['1 week ago', '7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago'],
            latterly: ['12 months ago', '11 months ago', '10 months ago', '9 months ago', '8 months ago', '7 months ago', '6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago'],
            old: ['years ago', '1 year ago'],
            streamed: ['streamed']
        }
    }, {
        get(cache, locale) {
            if (cache[locale]) return cache[locale];

            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
            const format = (num, unit) => rtf.format(-num, unit).replace(/^-?\d+\s*/, '').toLowerCase();
            const uniq = arr => [...new Set(arr)];
            const newly = uniq([[1, 'day'], [2, 'hour'], [1, 'hour'], [2, 'minute'], [1, 'minute'], [2, 'second'], [1, 'second']].map(([n, u]) => format(n, u)));
            const lately = uniq([[1, 'month'], [2, 'week'], [14, 'day'], [13, 'day'], [12, 'day'], [11, 'day'], [10, 'day'], [9, 'day'], [8, 'day']].map(([n, u]) => format(n, u)));
            const recent = uniq([[1, 'week'], [7, 'day'], [6, 'day'], [5, 'day'], [4, 'day'], [3, 'day'], [2, 'day']].map(([n, u]) => format(n, u)));
            const latterly = uniq([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].map(n => format(n, 'month')));
            const old = uniq([[2, 'year'], [1, 'year']].map(([n, u]) => format(n, u)));

            const keywordTable = {
                en: { live: ['watching', 'live'], upcoming: ['waiting', 'scheduled for'], streamed: ['streamed'] },
                es: { live: ['espectadores', 'en vivo'], upcoming: ['esperando', 'programado para'], streamed: ['emitido', 'transmitido'] },
                hi: { live: ['देख रहे', 'लाइव'], upcoming: ['प्रतीक्षा', 'निर्धारित'], streamed: ['स्ट्रीम किया'] },
                pt: { live: ['assistindo', 'ao vivo'], upcoming: ['aguardando', 'programado para'], streamed: ['transmitido'] },
                de: { live: ['zuschauer', 'live'], upcoming: ['wartend', 'geplant für'], streamed: ['gestreamt'] },
                fr: { live: ['spectateurs', 'en direct'], upcoming: ['en attente', 'programmé pour'], streamed: ['diffusé'] },
                it: { live: ['guardando', 'in diretta', 'spettatori'], upcoming: ['in attesa', 'programmato per'], streamed: ['trasmesso', 'in streaming'] },
                nl: { live: ['kijkers', 'live'], upcoming: ['wachten', 'gepland voor'], streamed: ['gestreamd'] },
                pl: { live: ['oglądających', 'na żywo'], upcoming: ['oczekujących', 'zaplanowano na'], streamed: ['transmitowano'] },
                he: { live: ['צופים', 'בשידור חי'], upcoming: ['ממתין', 'מתוזמן ל'], streamed: ['שודר'] },
                ja: { live: ['人が視聴中', 'ライブ'], upcoming: ['待機中', '予定'], streamed: ['配信済み'] },
                ko: { live: ['명 시청 중', '라이브'], upcoming: ['명 대기 중', '예정됨'], streamed: ['스트리밍됨'] },
                zh: { live: ['人正在观看', '直播'], upcoming: ['正在等待', '计划于'], streamed: ['已直播'] },
                id: { live: ['orang menonton', 'langsung'], upcoming: ['menunggu', 'dijadwalkan pada'], streamed: ['streaming'] },
                sv: { live: ['tittare', 'direkt'], upcoming: ['väntar', 'planerat till'], streamed: ['sändes'] },
                no: { live: ['seere', 'direkte'], upcoming: ['venter', 'planlagt til'], streamed: ['strømmet'] },
                da: { live: ['seere', 'direkte'], upcoming: ['venter', 'planlagt til'], streamed: ['streamet'] },
                fi: { live: ['katsojaa', 'suorana'], upcoming: ['odottaa', 'suunniteltu'], streamed: ['striimattu'] },
                cs: { live: ['sledujících', 'živě'], upcoming: ['čeká', 'naplánováno na'], streamed: ['vysíláno'] },
                el: { live: ['θεατές', 'ζωντανά'], upcoming: ['αναμονή', 'προγραμματισμένο για'], streamed: ['μεταδόθηκε'] },
                hu: { live: ['néző', 'élő'], upcoming: ['várakozik', 'ütemezve'], streamed: ['streamelve'] },
                ro: { live: ['spectatori', 'în direct'], upcoming: ['așteaptă', 'programat pentru'], streamed: ['transmis'] },
                uk: { live: ['глядачів', 'наживо'], upcoming: ['очікує', 'заплановано на'], streamed: ['трансляція'] }
            };
            const keywordMatrix = keywordTable[locale] || keywordTable.en;

            return cache[locale] = {
                live: keywordMatrix.live,
                upcoming: keywordMatrix.upcoming,
                streamed: keywordMatrix.streamed,
                newly,
                recent,
                lately,
                latterly,
                old
            };
        }
    });

    // sort comments newest first
    const commentMatrix = {
        en: { off: 'Comments are turned off', newest: 'newest' },
        es: { off: 'Los comentarios están desactivados', newest: 'más recientes' },
        hi: { off: 'टिप्पणियाँ बंद हैं', newest: 'नवीनतम' },
        pt: { off: 'Os comentários estão desativados', newest: 'mais recentes' },
        de: { off: 'Kommentare sind deaktiviert', newest: 'neueste' },
        fr: { off: 'Les commentaires sont désactivés', newest: 'les plus récents' },
        it: { off: 'I commenti sono disattivati', newest: 'più recenti' },
        nl: { off: 'Reacties zijn uitgeschakeld', newest: 'nieuwste' },
        pl: { off: 'Komentarze są wyłączone', newest: 'najnowsze' },
        he: { off: 'התגובות מושבתות', newest: 'החדשות ביותר' },
        ja: { off: 'コメントはオフになっています', newest: '新しい順' },
        ko: { off: '댓글이 사용 중지되었습니다', newest: '최신' },
        zh: { off: '评论已关闭', newest: '最新' },
        id: { off: 'Komentar dimatikan', newest: 'terbaru' },
        sv: { off: 'Kommentarer är inaktiverade', newest: 'nyaste' },
        no: { off: 'Kommentarer er slått av', newest: 'nyeste' },
        da: { off: 'Kommentarer er slået fra', newest: 'nyeste' },
        fi: { off: 'Kommentit ovat pois päältä', newest: 'uusimmat' },
        cs: { off: 'Komentáře jsou vypnuty', newest: 'nejnovější' },
        el: { off: 'Τα σχόλια είναι απενεργοποιημένα', newest: 'νεότερα' },
        hu: { off: 'A hozzászólások ki vannak kapcsolva', newest: 'legújabb' },
        ro: { off: 'Comentariile sunt dezactivate', newest: 'cele mai noi' },
        uk: { off: 'Коментарі вимкнено', newest: 'найновіші' }
    };

    //  ┌───────────────────────────────────────────────────────────────────┐
    //  │                          initialization                           │
    //  └───────────────────────────────────────────────────────────────────┘

    let pageObserver;
    let currentURL = null;
    let videoID = null;
    let lastVideoID = null;
    let isHomePage = false;
    let isVideoPage = false;
    let isLiveVideo = false;
    let isLiveStream = false;
    let isShortPage = false;
    let isSubscriptionsPage = false;
    let isPlaylistPage = false;
    let isPlaylistVideoPage = false;
    let isWatchLater = false;
    let playerElement = null;
    let watchFlexyElement = null;
    let endElement = null;
    let headerElement = null;
    let uiLanguage = null;
    let englishInLanguage = null;
    let audioInLanguage = null;
    let subtitleInLanguage = null;
    let transcriptInLanguage = null;
    let hasPlaylistPanel = false;
    let playlistPanel = null;
    let playlistSelectedVideo = null;
    let isChannelPage = false;
    let isChannelHome = false;
    let isMusicVideo = false;
    let initialRun = null;
    let chatEnabled = null;
    let isTheaterMode = null;
    let hasChapterPanel = null;
    let chapterPanel = null;
    let hasTranscriptPanel = null;
    let transcriptPanel = null;
    let hasChatPanel = null;
    let isFullscreen = null;
    let markWatchedVideosTimeout;
    let markWatchedVideosObserver;
    let ignoreRateChange = false;
    let lastUserRate = null;
    let speedNotification = false;
    let hideNotificationTimeout;
    let toggleKey = '', increaseKey = '', decreaseKey = '';
    let defaultKeys = new Set();
    let specialKeys = Object.create(null);
    let transcriptMenuButtonMoved = false;
    let chronoNotificationRunning = false;
    let cleanupPlaybackSpeedListeners = null;
    let defaultSpeed = USER_CONFIG.playbackSpeedValue;
    const showPlaybackSpeed = USER_CONFIG.playbackSpeed;
    const compactModeSpeed = USER_CONFIG.showRemainingCompact;
    const ChatGPTLabel = USER_CONFIG.targetChatGPTLabel;
    const NotebookLMLabel = USER_CONFIG.targetNotebookLMLabel;
    const infoSel = 'ytd-engagement-panel-section-list-renderer[target-id=engagement-panel-structured-description]';
    const menuSel = '#primary #top-row #top-level-buttons-computed';
    const fsCnSel = '#movie_player > div.ytp-chrome-bottom';
    const prBaSel = '.ytp-progress-bar-container';
    const prBeSel = '#columns #primary #below';
    const chapSel = '.ytp-chapters-container';
    const cmtsSel = 'ytd-comments#comments';
    const vidPSel = '.html5-video-player';
    const videoTargets = [infoSel, menuSel, cmtsSel, vidPSel, chapSel, prBaSel, fsCnSel, prBeSel];
    const browseTargets = ['#contents img, #reel-video-renderer .action-container > #actions'];
    const videoPageContainer = 'ytd-app #page-manager > ytd-watch-flexy:not([hidden])';
    const browseContainer = 'ytd-app #page-manager > ytd-browse:not([hidden]),ytd-app #page-manager > ytd-search:not([hidden]),ytd-app #page-manager > ytd-shorts:not([hidden])';
    const scriptPolicy = window.trustedTypes && trustedTypes.createPolicy('CentAnniAlchemy', { createScript: s => s });

    // initiate the script
    async function initializeAlchemy() {
        if (USER_CONFIG.preventBackgroundExecution) { await chromeUserWait(); }
        updateCachedElements();
        buttonsLeftHeader();

        if (isVideoPage || isLiveStream) {
            languageCheck();
            liveVideoCheck();
            musicVideoCheck();
            fullscreenCheck();
            theaterModeCheck();
            chapterPanelCheck();
            playlistPanelCheck();
            transcriptPanelCheck();
            const videoFeatures = [
                [USER_CONFIG.defaultQuality !== 'auto', runSetVideoQuality],
                [USER_CONFIG.autoTheaterMode && !isTheaterMode, toggleTheaterMode],
                [USER_CONFIG.playbackSpeed, videoPlaybackSpeed],
                [USER_CONFIG.progressBar && !isLiveVideo && !isLiveStream, keepProgressBarVisible],
                [USER_CONFIG.displayRemainingTime && !isLiveVideo && !isLiveStream, remainingTime],
                [USER_CONFIG.playlistDirectionBtns && isPlaylistVideoPage, playlistDirection],
                [USER_CONFIG.closeChatWindow, () => setTimeout(() => { chatWindowCheck(); }, 500)],
                [USER_CONFIG.commentsNewFirst && !isLiveVideo && !isLiveStream, sortCommentsNewFirst],
                [USER_CONFIG.expandVideoDescription && !USER_CONFIG.videoTabView, clickDescriptionBtn],
                [USER_CONFIG.autoOpenChapters && !USER_CONFIG.videoTabView && hasChapterPanel, openChapters],
                [USER_CONFIG.autoOpenTranscript && !USER_CONFIG.videoTabView && hasTranscriptPanel, openTranscript],
                [(USER_CONFIG.defaultAudioLanguage !== 'auto' || USER_CONFIG.defaultSubtitleLanguage !== 'auto'), setLanguage],
                [!USER_CONFIG.videoTabView && ((USER_CONFIG.autoOpenChapters && hasChapterPanel) || (USER_CONFIG.autoOpenTranscript && hasTranscriptPanel)), scrollToTop],
                [USER_CONFIG.maxVidSize || USER_CONFIG.compactLayout, maxVideoSize],
                [USER_CONFIG.feedFilterChipsWatch, restoreLastSelectedChip],
                [USER_CONFIG.hideProdTxt, hideProductsSpan],
                [USER_CONFIG.videoTabView, tabView]
            ];
            for (const [flag, callback] of videoFeatures) if (flag) callback();

            // transcript exporter
            if (!USER_CONFIG.YouTubeTranscriptExporter || !hasTranscriptPanel) createButtons('settings');
            else if (USER_CONFIG.lazyTranscriptLoading) createButtons(['settings', 'lazyload']);
            else runYTE();
        } else {
            createButtons('settings');
            const browseFeatures = [
                [isShortPage, shortsPlaybackControl],
                [USER_CONFIG.channelRSSBtn && isChannelPage, addRSSFeedButton],
                [USER_CONFIG.plWLBtn && isWatchLater, playlistRemoveWatchedButton],
                [USER_CONFIG.playlistLinks && isPlaylistPage, handlePlaylistLinks],
                [USER_CONFIG.feedFilterChips && isHomePage, restoreLastSelectedChip],
                [USER_CONFIG.channelPlaylistBtn && isChannelPage, addPlaylistButtons],
                [USER_CONFIG.lastSeenVideo && isSubscriptionsPage, markLastSeenVideo],
                [USER_CONFIG.colorCodeVideosEnabled && isHomePage, homeColorCodeVideos],
                [USER_CONFIG.playlistTrashCan && isPlaylistPage, playlistRemovalButtons],
                [USER_CONFIG.playbackSpeed && isShortPage, createPlaybackSpeedController]
            ];
            for (const [flag, callback] of browseFeatures) if (flag) callback();
        }
    }

    // YouTube navigation handler
    function handleYouTubeNavigation() {
        // console.log("YouTubeAlchemy: Event Listner Arrived");
        const newURL = window.location.href;
        if (newURL !== currentURL) {
            currentURL = newURL;
            // console.log("YouTubeAlchemy: Only One Survived");
            if (pageObserver) pageObserver.disconnect();
            if (!docBody) docBody = document.body;
            if (!cssSettingsApplied) loadCSSsettings();
            chronoNotificationRunning = false;
            initialRun = true;

            const urlObj = new URL(newURL);
            isHomePage = urlObj.pathname === '/';
            isVideoPage = urlObj.pathname === '/watch';
            isLiveStream = urlObj.pathname.startsWith('/live/');
            isShortPage = urlObj.pathname.startsWith('/shorts/');
            isPlaylistPage = urlObj.pathname === '/playlist';
            isPlaylistVideoPage = urlObj.searchParams.has('list');
            isWatchLater = urlObj.searchParams.get('list') === 'WL';
            isSubscriptionsPage = urlObj.pathname === '/feed/subscriptions';
            isChannelPage = /^\/@[a-zA-Z0-9._-]+/.test(urlObj.pathname);
            isChannelHome = /^(\/@[a-zA-Z0-9._-]+|\/channel\/[a-zA-Z0-9_\-=.]+)$/.test(urlObj.pathname);
            uiLanguage = (docElement.lang || navigator.language || 'en').split('-')[0];
            if (USER_CONFIG.channelReindirizzare && isChannelHome) { channelRedirect(); return; }
            if (USER_CONFIG.redirectShorts && isShortPage) { redirectShortsToVideoPage(); return; }
            if (USER_CONFIG.videosHideWatchedGlobalJS !== 0 && !USER_CONFIG.videosHideWatchedGlobal) markWatchedVideos();

            if (isVideoPage || isLiveStream || isShortPage) {
                lastVideoID = videoID;
                videoID = urlObj.searchParams.get('v');

                if (isShortPage) videoID = urlObj.pathname.split('/').pop();
                if (USER_CONFIG.hideEndCards) docElement.style.setProperty('--video-url', `url("https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg")`);
                if (USER_CONFIG.closeChatWindow) docElement.classList.add('CentAnni-close-live-chat');
            }

            // wait for targets
            const tar = (isVideoPage || isLiveStream) ? videoTargets : browseTargets;
            const sel = (isVideoPage || isLiveStream) ? videoPageContainer : browseContainer;
            const ctn = document.querySelector(sel); if (!ctn) return;
            const init = () => { if (pageObserver) { pageObserver.disconnect(); pageObserver = null; } requestIdleCallback(initializeAlchemy, { timeout: 2500 }); };
            const t = setTimeout(init, 2500);

            let remaining = new Set();
            for (const s of tar) if (!ctn.querySelector(s)) remaining.add(s);
            if (!remaining.size) { clearTimeout(t); init(); return; }
            pageObserver = new MutationObserver(() => {
                for (const s of remaining) if (ctn.querySelector(s)) remaining.delete(s);
                if (!remaining.size) { clearTimeout(t); init(); }
            });
            pageObserver.observe(ctn, { childList: true, subtree: true });
        }
    }

    // pause script until tab becomes visible
    function chromeUserWait() {
        if (document.visibilityState === 'visible') return Promise.resolve();
        return new Promise(resolve => {
            const onVisibility = () => {
                if (document.visibilityState === 'visible') {
                    document.removeEventListener('visibilitychange', onVisibility);
                    resolve();
                }
            };
            document.addEventListener('visibilitychange', onVisibility);
        });
    }

    // event listeners
    document.addEventListener('yt-navigate-start', handleYTNavigation); // reset
    document.addEventListener('yt-navigate-finish', handleYouTubeNavigation); // default
    document.addEventListener('yt-page-data-updated', handleYouTubeNavigation); // backup
    document.addEventListener('yt-page-data-fetched', handleYouTubeNavigation); // redundancy
    if (USER_CONFIG.playbackSpeed) document.addEventListener('yt-player-updated', initialSpeed); // set playback speed
    if (USER_CONFIG.playbackSpeed) document.addEventListener('fullscreenchange', fullscreenCheck); // fullscreen change
    if (USER_CONFIG.preventAutoplay) document.addEventListener('yt-player-updated', pauseYouTubeVideo); // prevent autoplay
    if (USER_CONFIG.chronologicalNotifications) { document.addEventListener('yt-update-unseen-notification-count', () => setTimeout(() => requestIdleCallback(chronoNotifications, { timeout: 250 }), 100)); } // sort notifications chronologically
})();
