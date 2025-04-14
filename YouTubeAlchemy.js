// ==UserScript==
// @name         YouTube Alchemy
// @description  Toolkit for YouTube with 130+ options accessible via settings panels. Features include: tab view, playback speed control, set video quality, set transcript language, export transcripts, prevent autoplay, hide shorts, hide ad slots, disable play on hover, square design, auto theater mode, number of videos per row, display remaining time—adjusted for playback speed and SponsorBlock segments, persistent progress bar with chapter markers and SponsorBlock support, modify or hide various UI elements, and much more.
// @author       Tim Macy
// @license      GNU AFFERO GENERAL PUBLIC LICENSE-3.0
// @version      7.7.2.1
// @namespace    TimMacy.YouTubeAlchemy
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @noframes
// @homepageURL  https://github.com/TimMacy/YouTubeAlchemy
// @supportURL   https://github.com/TimMacy/YouTubeAlchemy/issues
// @updateURL    https://raw.githubusercontent.com/TimMacy/YouTubeAlchemy/refs/heads/main/YouTubeAlchemy.js
// @downloadURL  https://raw.githubusercontent.com/TimMacy/YouTubeAlchemy/refs/heads/main/YouTubeAlchemy.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2025 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 7.7.2.1 - YouTube Alchemy                 *
*                    All Rights Reserved.                               *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(async function() {
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
                background-color: rgba(0,0,0,0.5);
                backdrop-filter: blur(5px);
            }

            .modal-content {
                z-index: 2077;
                background-color: rgba(17, 17, 17, 0.8);
                padding: 20px 0 20px 20px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 8px;
                width: 420px;
                max-height: 90vh;
                font-family: "Roboto","Arial",sans-serif;
                font-size: 9px;
                line-height: 1.2;
                color: white;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            #yt-transcript-settings-form {
                max-height: calc(90vh - 40px);
                overflow-y: auto;
                padding-right: 20px;
            }

            .notification {
                background:hsl(0,0%,7%);
                padding: 20px 30px;
                border-radius: 8px;
                border: 1px solid hsl(0,0%,18.82%);
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

            .header-wrapper {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                align-items: baseline;
                justify-content: center;
                margin: 0 20px 20px 0;
                width: calc(100% - 20px);
            }

            .header {
                margin: 0;
                padding: 0;
                border: 0;
                grid-column: 2;
                text-align:center;
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

            .header:hover { color: white; }

            .version-label {
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

            .header:hover + .version-label {
                opacity: 1;
            }

            .label-style-settings {
                display: block;
                margin-bottom: 5px;
                font-family: "Roboto","Arial",sans-serif;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 500;
            }

            .reset-prompt-text {
                display: inline-block;
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
            .label-download { color: hsl(359, 88%, 57%); }
            .label-settings { color: hsl(0, 0%, 100%); }
            .input-field-targetNotebookLMUrl:focus { border: 1px solid hsl(134, 61%, 40%); }
            .input-field-targetChatGPTUrl:focus { border: 1px solid hsl(217, 91%, 59%); }
            .buttonIconNotebookLM-input-field:focus { border: 1px solid hsl(134, 61%, 40%); }
            .buttonIconChatGPT-input-field:focus { border: 1px solid hsl(217, 91%, 59%); }
            .buttonIconDownload-input-field:focus { border: 1px solid hsl(359, 88%, 57%); }

            .buttonIconSettings-input-field:focus,
            .links-header-container input:focus,
            .sidebar-container input:focus,
            #custom-css-form .select-file-naming:focus,
            #custom-css-form .dropdown-list {
                border: 1px solid hsl(0, 0%, 100%);
            }

            .input-field-targetNotebookLMUrl:hover,
            .input-field-targetChatGPTUrl:hover,
            .buttonIconNotebookLM-input-field:hover,
            .buttonIconChatGPT-input-field:hover,
            .buttonIconDownload-input-field:hover,
            .buttonIconSettings-input-field:hover,
            .select-file-naming:hover,
            .input-field-url:hover,
            .chatgpt-prompt-textarea:hover
            { background-color: hsl(0, 0%, 10.37%); }

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
                transition: all 0.2s ease-out;
            }

            .btn-style-settings:hover { color: white; background-color: hsl(0, 0%, 25%); border-color: transparent; }
            .btn-style-settings:active { color: white; background-color: hsl(0, 0%, 35%); border-color: hsl(0, 0%, 45%); }
            .button-icons { display: block; font-family: "Roboto","Arial",sans-serif; font-size: 1.4em; line-height: 1.5em; font-weight: 500; }
            .icons-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .container-button { display: flex; flex-direction: column; align-items: center; margin: 5px 0 0 0; }

            .button-icons.features-text {
                margin: 20px 0 -5px 0;
                font-size: 1.7em;
                display: flex;
                justify-content: center;
            }

            .container-button-input {
                width: 80px;
                padding: 8px;
                text-align: center;
                color: ghostwhite;
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
                font-size: 2em;
                line-height: 1.5em;
                font-weight: 400;
                transition: all .5s ease-in-out;
                outline: none;
                background-color: hsl(0,0%,7%);
                border: 1px solid hsl(0,0%,18.82%);
                border-radius: 1px;
                box-sizing: border-box;
            }

            .container-button-label {
                margin-top: 5px;
                text-align: center;
                font-family: "Roboto","Arial",sans-serif;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 500;
            }

            .container-button-input:focus { color: white; background-color: hsl(0, 0%, 10.37%); border-radius: 2px; }
            .spacer-5 { height: 5px; }
            .spacer-10 { height: 10px; }
            .spacer-15 { height: 15px; }
            .spacer-20 { height: 20px; }

            .copyright {
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 500;
                color: white;
                text-decoration: none;
                transition: color 0.2s ease-in-out;
            }

            .copyright:hover { color: #369eff; }
            .url-container { margin-bottom: 10px; }

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
                background-color:hsl(0,0%,7%);
                border: 1px solid hsl(0,0%,18.82%);
                border-radius: 1px;
                box-sizing: border-box;
            }

            .input-field-url:focus { color: white; background-color: hsl(0, 0%, 10.37%); border-radius: 2px; }
            .file-naming-container { position: relative; margin-bottom: 20px; }

            .select-file-naming {
                width: 100%;
                padding: 8px;
                cursor:pointer;
                color: ghostwhite;
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 400;
                transition: all .5s ease-in-out;
                outline: none;
                appearance: none;
                -webkit-appearance: none;
                background-color:hsl(0,0%,7%);
                border: 1px solid hsl(0,0%,18.82%);
                border-radius: 1px;
                box-sizing: border-box;

                background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;" fill="ghostwhite"%3E%3Cpath d="m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z"%3E%3C/path%3E%3C/svg%3E');
                background-repeat: no-repeat;
                background-position: right 10px center;
                background-size: 20px;

                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;]
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
                max-height: 60vh;
                overflow-y: auto;
                background-color:hsl(0,0%,7%);
                border: 1px solid hsl(359,88%,57%);
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
                color: hsl(359,88%,57%);
                font-weight: 600;
            }

            .dropdown-item-selected::before {
                content: '✓';
                position: absolute;
                left: 6px;
                color: hsl(359,88%,57%);
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
                font-family: "Roboto","Arial",sans-serif;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .checkbox-container { margin-bottom: 5px; }
            .checkbox-label:hover { text-decoration: underline; }
            .checkbox-field { margin-right: 10px; }

            .CentAnni-info-text {
                color: rgba(175, 175, 175, .9);
                font-family: "Roboto","Arial",sans-serif;
                font-size: 1.2em;
                line-height: 1.5em;
                font-weight: 400;
                display: block;
                margin:-5px 0px 5px 24px;
                pointer-events: none;
                cursor: default;
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
                background-color:hsl(0,0%,7%);
                border: 1px solid hsl(0,0%,18.82%);
                border-radius: 1px;
                box-sizing: border-box;
            }

            .chatgpt-prompt-textarea:focus {
                height: 569px;
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

            #masthead-skeleton-icons {
                display: none !important;
            }

            .button-wrapper {
                position: relative;
                margin-right: 8px;
                display: flex;
                background-color: transparent;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            .button-wrapper:not(:has(.button-style-settings)):hover { background-color: rgba(255, 255, 255, 0.1); border-radius: 24px; }
            .button-wrapper:not(:has(.button-style-settings)):active { background-color: rgba(255, 255, 255, 0.2); border-radius: 24px; }

            .button-style {
                width: 40px;
                height: 40px;
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
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
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                -webkit-tap-highlight-color: transparent;
            }

            .button-style-settings { width: 10px; color: rgb(170, 170, 170); }
            .button-style-settings:hover { color: white; }

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
                cursor: default;
            }

            #movie_player .CentAnni-remaining-time-container {
                position: absolute;
                display: none;
                z-index: 2053;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: 800 !important;
                font-size: 109%;
                vertical-align: top;
                white-space: nowrap;
                line-height: 53px;
                color: ghostwhite;
                text-shadow: black 0 0 3px !important;
            }

            .ytp-autohide .ytp-chrome-bottom .CentAnni-remaining-time-container {
                display: inline-block !important;
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

            .notification-error {
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
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
                font-weight: 500;
                font-size: 14px;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            #CentAnni-playback-speed-popup {
                position: fixed;
                top: var(--ytd-masthead-height,var(--ytd-toolbar-height));
                left: 50%;
                transform: translateX(-50%);
                padding: 8px 16px;
                background:hsl(0,0%,7%);
                border-radius: 2px;
                border: 1px solid hsl(0,0%,18.82%);
                color: whitesmoke;
                font-family: -apple-system, "Roboto", "Arial", sans-serif;
                font-size: 2.3rem;
                font-weight: 600;
                text-align: center;
                z-index: 2500;
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
                0% { opacity: 0; }
                50% { opacity: .71; }
                100% { opacity: 0; }
            }

            @keyframes pulse {
                0% { opacity: 0; }
                50% { opacity: .71; }
                100% { opacity: 0; }
            }

            .buttons-left {
                font-family: "Roboto", "Arial", sans-serif;
                font-size: 14px;
                font-weight: 500;
                line-height: 1em;
                display: inline-block;
                position: relative;
                color: ghostwhite;
                text-decoration: none;
                cursor: pointer;
                margin: 0 8px;
                outline: none;
                background: transparent;
                border: none;
                text-align: center;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            .buttons-left:hover { color: #ff0000 !important; }
            .buttons-left:active { color:rgb(200, 25, 25) !important; }

            .sub-panel-overlay {
                position: fixed;
                z-index: 2100;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: none;
                background-color: rgba(0,0,0,0.5);
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(1px);
            }

            .sub-panel-overlay.active {
                display: flex;
            }

            .sub-panel {
                z-index: 2177;
                background-color: rgba(17, 17, 17, 0.8);
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 8px;
                width: 50vw;
                max-width: 70vw;
                max-height: 90vh;
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

            #custom-css-form .playback-speed-container .number-input-container .number-input-field {
                width: 5ch;
            }

            #custom-css-form .playback-speed-container .number-input-label {
                display: flex;
            }

            #color-code-videos-form .checkbox-container { margin: 20px 0 0 0; }
            #color-code-videos-form .label-style-settings {margin: 0; }
            #color-code-videos-form > div.videos-old-container > span { margin: 0; }
            #color-code-videos-form .CentAnni-info-text { margin: 5px 80px 20px 0px; }
            #custom-css-form .checkbox-container { margin: 10px 0; }

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

            #custom-css-form .dropdown-item-selected,
            #custom-css-form .dropdown-item-selected::before {
                color: hsl(0, 0%, 100%);
            }

            input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 6px;
                background: #ccc;
                border-radius: 5px;
                outline: none;
            }

            input[type="range"]::-moz-range-thumb,
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: #007bff;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #ffffff;
            }

            input[type="range"]::-moz-range-track,
            input[type="range"]::-webkit-slider-runnable-track {
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

            .slider-container input[type="range"] {
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

            input[type="color"]::-webkit-color-swatch-wrapper {
                border: none;
                padding: 0;
            }

            input[type="color"]::-webkit-color-swatch {
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

            .number-input-container {
                margin: 10px 0;
            }

            .number-input-field {
                width: 5ch;
                margin: 0 10px 0 0;
                align-items: center;
                font-size: 1.4em;
                line-height: 1.5em;
                font-weight: 700;
                cursor: auto;
                text-decoration: none;
                text-align: center;
                display: inline-block;

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
                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"],
                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]
            ))) :is(.CentAnni-tabView-tab[data-tab="tab-4"], .CentAnni-chapter-title, #movie_player .CentAnni-chapter-title),
            :root:not(:has(ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"])) .CentAnni-tabView-tab[data-tab="tab-5"] {
                display: none !important;
            }

            :root:has(ytd-watch-flexy ytd-playlist-panel-renderer[hidden]) .CentAnni-tabView-tab[data-tab="tab-6"] {
                display: none;
            }

            /* progress bar css */
            .CentAnni-progress-bar {
                #progress-bar-bar {
                    width: 100%;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.2);
                    position: absolute;
                    bottom: 0;
                    opacity: 0;
                    z-index: 58;
                    pointer-events: none;
                }

                #progress-bar-progress, #progress-bar-buffer {
                    width: 100%;
                    height: 3px;
                    transform-origin: 0 0;
                    position: absolute;
                }

                #progress-bar-progress {
                    background: var(--progressBarColor);
                    filter: none;
                    z-index: 1;
                }

                .ytp-autohide .ytp-chrome-bottom .ytp-load-progress, .ytp-autohide .ytp-chrome-bottom .ytp-play-progress { display: none !important; }
                .ytp-autohide .ytp-chrome-bottom { opacity: 1 !important; display: block !important; }
                .ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls { opacity: 0 !important; }
                .ad-interrupting #progress-bar-progress { background: transparent; }
                .ytp-ad-persistent-progress-bar-container { display: none; }
                #progress-bar-buffer { background: rgba(255, 255, 255, 0.4); }

                .ytp-autohide #progress-bar-start.active,
                .ytp-autohide #progress-bar-bar.active,
                .ytp-autohide #progress-bar-end.active
                { opacity: 1; }

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

                #progress-bar-start, #progress-bar-end {
                    position: absolute;
                    height: 3px;
                    width: 12px;
                    bottom: 0;
                    z-index: 2077;
                    opacity: 0;
                    pointer-events: none;
                }

                :fullscreen #progress-bar-start, :fullscreen #progress-bar-end { width: 24px; }
                :-webkit-full-screen #progress-bar-start, :-webkit-full-screen #progress-bar-end { width: 24px; }
                .html5-video-player.ytp-fullscreen #progress-bar-start, .html5-video-player.ytp-fullscreen #progress-bar-end { width: 24px !important; }

                #progress-bar-start {
                    left: 0;
                    background: var(--progressBarColor);
                }

                #progress-bar-end {
                    right: 0;
                    background: rgba(255, 255, 255, 0.2);
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

                ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer {
                    margin-left: 0 !important;
                }

                ytd-menu-renderer[has-flexible-items][safe-area] .top-level-buttons.ytd-menu-renderer {
                    margin-bottom: 0;
                }

                #top-level-buttons-computed > yt-button-view-model > button-view-model > button {
                    padding: 0 0 0 12px;
                }

                .CentAnni-playback-control {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    margin: 0 8px;
                }

                .CentAnni-playback-speed-icon {
                    height: 24px;
                    width: 24px;
                    padding: 0 4px 0 0;
                    opacity: .9;
                }

                .CentAnni-playback-speed-display {
                    background: rgba(255,255,255,0.1);
                    height: 36px;
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
                    background: rgb(72,72,72) !important;
                }

                .CentAnni-playback-speed-display::before {
                    content: "";
                    background: rgba(255,255,255,0.2);
                    position: initial;
                    right: 0;
                    top: 6px;
                    height: 24px;
                    width: 1px;
                    margin-right: 10px;
                }

                .CentAnni-playback-speed-display::after {
                    content: "";
                    background: rgba(255,255,255,0.2);
                    position: initial;
                    right: 0;
                    top: 6px;
                    height: 24px;
                    width: 1px;
                    margin-left: 10px;
                }

                ytd-watch-metadata[flex-menu-enabled] #actions-inner.ytd-watch-metadata {
                    width: 17%;
                }
            }

            /* video tab view css */
            .CentAnni-video-tabView {
                .CentAnni-tabView {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: var(--ytd-watch-flexy-sidebar-width);
                    min-width: var(--ytd-watch-flexy-tabView-min-width);
                    font-family: "Roboto", "Arial", sans-serif;
                    margin: 0;
                    padding: 0;
                    border-radius: 12px 12px 0 0;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                    box-sizing: border-box;
                    background-color: transparent;
                    z-index: 10;
                }

                .CentAnni-tabView:has(.CentAnni-tabView-tab.active[data-tab="tab-2"]) {
                    border-radius: 12px;
                }

                .CentAnni-tabView:not(:has(.CentAnni-tabView-tab[data-tab="tab-2"])) ytd-comments#comments {
                    display: none;
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
                    font-family: "Roboto","Arial",sans-serif;
                    font-size: 1.4em;
                    line-height: 2em;
                    font-weight: 500;
                    margin: 0;
                    background-color: rgba(255,255,255,0.1);
                    color: #f1f1f1;
                    text-decoration: none;
                    padding: 0 12px;
                    z-index: 10;
                }

                .CentAnni-tabView-tab:hover {
                    background: rgba(255,255,255,0.2);
                    border-color: transparent;
                }

                .CentAnni-tabView-tab.active {
                    background-color: #f1f1f1;
                    color: #0f0f0f;
                }

                .CentAnni-tabView-content {
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 0;
                    margin: 0;
                    max-height: 83vh;
                }

                .CentAnni-tabView-content {
                    display: none;
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

                .CentAnni-tabView-content-none {
                    display: none;
                }

                ytd-watch-flexy ytd-channel-renderer {
                    display: none;
                }

                #tab-2 {
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }

                #related.style-scope.ytd-watch-flexy {
                    position: absolute;
                    max-height: 83vh;
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
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-top: none;
                    box-sizing: border-box;
                    border-radius: 0 0 12px 12px;
                }

                ytd-watch-metadata.ytd-watch-flexy {
                    margin: 12px 10px 0 10px;
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

                ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) {
                    border-radius: 0 0 12px 12px;
                }

                #related.style-scope.ytd-watch-flexy[full-bleed-player] {
                    top: 30px;
                }

                ytd-watch-flexy  #header.style-scope.ytd-engagement-panel-section-list-renderer {
                    display: none;
                }

                ytd-engagement-panel-section-list-renderer {
                    box-sizing: content-box;
                    display: flexbox;
                    display: flex;
                    flex-direction: column;
                }

                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"],
                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"] {
                    position: absolute;
                    max-height: 83vh;
                    width: var(--ytd-watch-flexy-sidebar-width);
                    top: 76px;
                    left: 0;
                    margin: 0;
                    padding: 0;
                    overflow-y: auto;
                    overflow-x: hidden;
                    z-index: 5;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-top: none;
                    box-sizing: border-box;
                }

                ytd-watch-flexy #description.ytd-expandable-video-description-body-renderer {
                    padding-right: 10px !important;
                }

                ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy {
                    max-height: 83vh;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-top: none;
                    box-sizing: border-box;
                }

                ytd-watch-flexy ytd-structured-description-content-renderer[engagement-panel] ytd-video-description-header-renderer.ytd-structured-description-content-renderer {
                    display: none;
                }

                ytd-engagement-panel-section-list-renderer ytd-merch-shelf-renderer {
                    display: none;
                }

                ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"] {
                    position: absolute;
                    max-height: 83vh;
                    width: var(--ytd-watch-flexy-sidebar-width);
                    top: 76px;
                    left: 0;
                    margin: 0;
                    padding: 10px 0 0 10px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    z-index: 5;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-top: none;
                    box-sizing: border-box;
                }

                ytd-watch-flexy ytd-engagement-panel-section-list-renderer[target-id^="shopping_panel_for_entry_point_"] {
                    display: none;
                }

                ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[target-id="engagement-panel-structured-description"] {
                    max-height: 83vh;
                    background-color: black;
                }

                ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] {
                    position: absolute;
                    top: 0;
                    left: 0;
                    max-height: 83vh;
                    width: var(--ytd-watch-flexy-sidebar-width);
                    top: 76px;
                    margin: 0;
                    padding: 0;
                    z-index: 5;
                    border: none;
                    box-sizing: border-box;
                }

                #body.ytd-transcript-renderer {
                    display: none;
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

                ytd-text-inline-expander,
                #navigation-button.ytd-rich-list-header-renderer,
                ytd-expandable-video-description-body-renderer > ytd-expander > tp-yt-paper-button#more.ytd-expander {
                    display: none;
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
                    color:var(--yt-endpoint-visited-color);
                }

                ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata a:hover {
                    color: var(--yt-spec-call-to-action);
                }

                #description > #description-inner > #ytd-watch-info-text > tp-yt-paper-tooltip {
                    display: none;
                }

                #description > #description-interaction {
                    display: none;
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

                #view-count.ytd-watch-info-text, #date-text.ytd-watch-info-text {
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
                    height: 100%;
                    margin-bottom: 24px;
                    gap: 20px;
                    align-items: center;
                }

                .ytVideoMetadataCarouselViewModelCarouselContainer {
                    margin-top: 0;
                }

                /* live chat adjustments */
                ytd-live-chat-frame[modern-buttons][collapsed] {
                    display: none;
                }

                #columns > #secondary > #secondary-inner > #chat-container {
                    top: 24px;
                    position: absolute;
                    width: var(--ytd-watch-flexy-sidebar-width);
                    min-width: var(--ytd-watch-flexy-tabView-min-width);
                }

                ytd-watch-flexy[flexy][js-panel-height_]:not([fixed-panels]):not([theater]) #chat.ytd-watch-flexy:not([collapsed]) {
                    height: calc(90vh - 10px);
                    border: 1px solid rgb(51, 51, 51);
                }

                #chat.ytd-watch-flexy {
                    margin-bottom: 0;
                }

                /* theater mode active */
                ytd-watch-flexy[theater] #playlist,
                ytd-watch-flexy[theater] ytd-comments,
                ytd-watch-flexy[theater] #related.style-scope.ytd-watch-flexy,
                ytd-watch-flexy[theater] ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer,
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

                ytd-watch-flexy[theater][flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[target-id="engagement-panel-clip-create"] {
                    display: none;
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
                    margin-top: 34.5px !important;
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
                    max-height: calc(100vh - 56.25vw - var(--ytd-masthead-height,var(--ytd-toolbar-height)));
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
                        max-height: 83vh;
                        overflow-y: auto;
                }

                ytd-donation-shelf-renderer[modern-panels] {
                    border-radius: 0px 0px 12px 12px;
                }

                ytd-donation-shelf-renderer {
                    border-top: none;
                }

                #collapse-controls-section {
                    display: none;
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
                }

                ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
                    border-radius: 0 0 12px 12px;
                }

                #playlist.ytd-watch-flexy {
                    max-height: 83vh !important;
                    margin-bottom: 0;
                }

                ytd-playlist-panel-renderer[js-panel-height] #container.ytd-playlist-panel-renderer,
                ytd-watch-flexy[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #secondary.ytd-watch-flexy {
                    max-height: 83vh;
                }

                #container.ytd-playlist-panel-renderer {
                    border-top: none;
                }

                ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer {
                    padding: 12px 0 0 25px;
                    margin-right: 0;
                }

                #trailing-button.ytd-playlist-panel-renderer {
                    display: none;
                }

                .playlist-items.ytd-playlist-panel-renderer {
                    padding: 0;
                }

                /* single columns */
                ytd-watch-flexy:not([is-two-columns_]) #columns.ytd-watch-flexy {
                    flex-direction: column;
                }

                ytd-watch-flexy:not([is-two-columns_])[flexy] #primary.ytd-watch-flexy {
                    flex-basis: auto;
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
                    margin-top: 24px;
                    width: 90vw;
                }

                ytd-watch-flexy:not([is-two-columns_])[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[target-id="engagement-panel-structured-description"] {
                    max-height: 50vh;
                    width: 90vw;
                    top: 171px;
                    margin: 0;
                    background-color: black;
                }

                ytd-watch-flexy:not([is-two-columns_]) ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"] {
                    align-self: center;
                    left: initial;
                }

                ytd-watch-flexy:not([is-two-columns_]) .CentAnni-tabView-content {
                    max-height: 50vh;
                }

                ytd-watch-flexy:not([is-two-columns_]) #related.style-scope.ytd-watch-flexy {
                    max-height: 50vh;
                    width: 90vw;
                    top: 171px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                ytd-watch-flexy:not([is-two-columns_])[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #secondary.ytd-watch-flexy {
                    padding: 0;
                }

                ytd-watch-flexy:not([is-two-columns_])[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy {
                    max-height: 50vh;
                    width: 90vw;
                    top: 147px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                ytd-watch-flexy #columns #below > ytd-watch-metadata #title > ytd-badge-supported-renderer {
                    bottom: 0px;
                    right: 10px;
                    position: absolute;
                    cursor: default;
                }
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
                    line-height: 59px;
                }

                .CentAnni-chapter-title {
                    position: absolute;
                    display: flex;
                    flex-direction: row;
                    z-index: 2025;
                    top: 0;
                    right: 0;
                    max-width: calc(50% - 26px);
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
                    display: none;
                    flex-direction: row;
                    max-width: 50vw;
                    overflow: hidden;
                    z-index: 2053;
                    bottom: 0;
                    left: 50%;
                    font-weight: 500 !important;
                    font-size: 109%;
                    vertical-align: top;
                    white-space: nowrap;
                    line-height: 59px;
                    color: ghostwhite !important;
                    text-shadow: black 0 0 3px !important;
                }

                .ytp-autohide .ytp-chrome-bottom .CentAnni-chapter-title {
                    display: flex !important;
                }

                .CentAnni-chapter-title .ytp-chapter-container.sponsorblock-chapter-visible {
                    display: block !important;
                }

                .CentAnni-chapter-title:has(.ytp-chapter-title-content:empty):not(:has(.sponsorChapterText:not(:empty))) {
                    display: none;
                }

                :is(
                    :has(ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]),
                    :has(ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"])
                ) {
                    & ytd-watch-flexy #description > #description-inner {
                        width: calc(50% - 26px);
                    }

                    & ytd-watch-flexy #description > #description-inner #info-container {
                        height: 41px;
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

            .CentAnni-style-hide-yt-settings .ytp-settings-menu, .CentAnni-style-hide-yt-settings .ytp-overflow-panel {
                opacity: 0 !important;
                pointer-events: none !important;
            }

            /* customCSS CSS */
            html {
                font-size: var(--fontSize) !important;
                font-family: "Roboto", Arial, sans-serif;
            }

            .CentAnni-style-hide-default-sidebar {
                ytd-mini-guide-renderer.ytd-app { display: none !important; }
                ytd-app[mini-guide-visible] ytd-page-manager.ytd-app { margin-left: 0 !important; }
                #guide-button.ytd-masthead { display: none !important; }
                #contents.ytd-rich-grid-renderer { justify-content: center !important; }
                ytd-browse[mini-guide-visible] ytd-playlist-header-renderer.ytd-browse, ytd-browse[mini-guide-visible] ytd-playlist-sidebar-renderer.ytd-browse, ytd-browse[mini-guide-visible] .page-header-sidebar.ytd-browse {
                    left: 0;
                }
            }

            html #above-the-fold h1,
            h1.ytd-watch-metadata,
            #video-title {
                text-transform: var(--textTransform) !important;
            }

            .CentAnni-style-full-title {
                #video-title.ytd-rich-grid-media {
                    white-space: normal;
                    text-overflow: unset;
                    overflow: unset;
                    display: inline-block;
                }

                #video-title {
                    max-height: unset !important;
                    -webkit-line-clamp: unset !important;
                }
            }

            ytd-compact-video-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
            ytd-rich-item-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
            ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                opacity: var(--watchedOpacity);
            }

            ytd-search ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                opacity: .8;
            }

            .ytd-page-manager[page-subtype="history"] {
                ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                    opacity: 1;
                }
            }

            .CentAnni-style-hide-watched-videos-global {
                ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer),
                ytd-grid-video-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                    display: none !important;
                }
            }

            .CentAnni-style-remove-scrubber {
                .ytp-scrubber-container {
                    display: none;
                    pointer-events: none;
                }
            }

            .CentAnni-style-play-progress-color {
                .ytp-play-progress, .ytp-swatch-background-color {
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
                .ytp-ce-element {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-endscreen {
                .html5-video-player .html5-endscreen.videowall-endscreen {
                    display: none !important;
                }
    
                .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) {
                    display: block !important;
                    cursor: default !important;
                }
    
                .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) button {
                    display: none;
                }
    
                .ended-mode .ytp-cued-thumbnail-overlay:not([aria-hidden="true"]) .ytp-cued-thumbnail-overlay-image {
                    display: block !important;
                    background-image: var(--video-url);
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
            }

            .CentAnni-style-hide-voice-search {
                #voice-search-button.ytd-masthead {
                    display: none;
                }
            }

            .CentAnni-style-hide-create-btn {
                ytd-button-renderer.ytd-masthead[button-renderer][button-next]:has(button[aria-label="Create"]) {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-queue-btn {
                ytd-thumbnail-overlay-toggle-button-renderer[aria-label="Add to queue"] {
                    display: none;
                }
            }

            .CentAnni-style-hide-notification-btn {
                #masthead-container #end #buttons ytd-notification-topbar-button-renderer {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-notification-badge {
                #masthead-container #end #buttons ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__badge {
                    display: none;
                }
            }

            .CentAnni-style-hide-own-avatar {
                #avatar-btn {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-brand-text {
                ytd-topbar-logo-renderer > #logo > ytd-yoodle-renderer > picture,
                #country-code.ytd-topbar-logo-renderer,
                #logo-icon [id^="youtube-paths_yt"] {
                    display: none;
                }

                #logo.ytd-masthead {
                    width: 45px;
                    overflow: hidden;
                }

                ytd-topbar-logo-renderer > #logo > ytd-yoodle-renderer > ytd-logo {
                    display: block !important;
                }
            }

            .CentAnni-style-hide-fundraiser {
                #donation-shelf, ytd-badge-supported-renderer:has([aria-label="Fundraiser"]) {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-miniplayer {
                ytd-miniplayer {
                    display: none !important;
                }

                #ytd-player .ytp-miniplayer-button {
                    display: none !important;
                }
            }

            .CentAnni-style-square-search-bar {
                #center.ytd-masthead { flex: 0 1 500px; }
                .YtSearchboxComponentInputBox { border: 1px solid hsl(0,0%,18.82%); border-radius: 0; }
                .YtSearchboxComponentSuggestionsContainer { border-radius: 0 0 10px 10px; }
                .YtSearchboxComponentSearchButton, .YtSearchboxComponentSearchButtonDark { display: none; }
                .YtSearchboxComponentHost { margin: 0; }

                .ytSearchboxComponentInputBox { border: 1px solid hsl(0,0%,18.82%); border-radius: 0; }
                .ytSearchboxComponentSuggestionsContainer { border-radius: 0 0 10px 10px; }
                .ytSearchboxComponentSearchButton, .ytSearchboxComponentSearchButtonDark { display: none; }
                .ytSearchboxComponentHost { margin: 0; }

                .ytSearchboxComponentDesktop .ytSearchboxComponentClearButton {
                    border-radius: 0;
                    height: 38px;
                    width: 38px;
                    margin-right: 6px;
                }
            }

            .ytd-page-manager[page-subtype="home"] {
                #avatar-container.ytd-rich-grid-media {
                    margin: 12px 12px 0 6px;
                }
            }

            .CentAnni-style-square-design {
                #thumbnail,
                .CentAnni-tabView,
                #card.ytd-miniplayer,
                .smartimation__border,
                .ytp-tooltip-text-wrapper,
                ytd-playlist-video-renderer,
                .ytOfficialCardViewModelHost,
                #dismissed.ytd-rich-grid-media,
                ytd-info-panel-content-renderer,
                ytd-expandable-metadata-renderer,
                .yt-thumbnail-view-model--medium,
                .badge.ytd-badge-supported-renderer,
                .yt-spec-button-shape-next--size-xs,
                #related.style-scope.ytd-watch-flexy,
                .animated-action__background-container,
                .ytp-player-minimized .html5-main-video,
                .ytProgressBarLineProgressBarLineRounded,
                .ytp-tooltip.ytp-text-detail.ytp-preview,
                .collections-stack-wiz__collection-stack2,
                ytd-donation-shelf-renderer[modern-panels],
                .ytp-player-minimized .ytp-miniplayer-scrim,
                yt-interaction.circular .fill.yt-interaction,
                .yt-spec-button-shape-next--icon-only-default,
                yt-interaction.circular .stroke.yt-interaction,
                ytd-watch-flexy[theater] .CentAnni-tabView-tab,
                tp-yt-paper-toast.yt-notification-action-renderer,
                .collections-stack-wiz__collection-stack1--medium,
                .metadata-container.ytd-reel-player-overlay-renderer,
                ytd-shorts .player-container.ytd-reel-video-renderer,
                ytd-compact-link-renderer.ytd-settings-sidebar-renderer,
                .ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg,
                ytd-live-chat-frame[theater-watch-while][rounded-container],
                ytd-shorts[enable-anchored-panel] .anchored-panel.ytd-shorts,
                ytd-live-chat-frame[rounded-container] iframe.ytd-live-chat-frame,
                .html5-video-player:not(.ytp-touch-mode) ::-webkit-scrollbar-thumb,
                .CentAnni-tabView:has(.CentAnni-tabView-tab.active[data-tab="tab-2"]),
                ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before,
                ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy,
                ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before,
                ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
                ytd-macro-markers-list-item-renderer[rounded] #thumbnail.ytd-macro-markers-list-item-renderer,
                ytd-expandable-metadata-renderer:not([is-expanded]) #header.ytd-expandable-metadata-renderer:hover,
                ytd-watch-flexy[flexy][js-panel-height_]:not([fixed-panels]) #chat.ytd-watch-flexy:not([collapsed]),
                ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
                    border-radius: 0 !important;
                }

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
                yt-chip-cloud-chip-renderer,
                ytd-multi-page-menu-renderer,
                #description.ytd-watch-metadata,
                .badge-shape-wiz--thumbnail-badge,
                ytd-author-comment-badge-renderer,
                .yt-spec-button-shape-next--size-s,
                .yt-spec-button-shape-next--size-m,
                ytd-rich-metadata-renderer[rounded],
                .yt-sheet-view-model-wiz--contextual,
                .ytVideoMetadataCarouselViewModelHost,
                yt-interaction.ytd-guide-entry-renderer,
                .dropdown-content.tp-yt-paper-menu-button,
                .tp-yt-paper-tooltip[style-target=tooltip],
                #chip-container.yt-chip-cloud-chip-renderer,
                .image-wrapper.ytd-hero-playlist-thumbnail-renderer,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
                .immersive-header-container.ytd-playlist-header-renderer,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
                #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active,
                ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) {
                    border-radius: 2px;
                }

                ytd-rich-item-renderer yt-interaction.circular .fill.yt-interaction,
                ytd-rich-item-renderer yt-interaction.circular .stroke.yt-interaction,
                #masthead-container yt-interaction.circular .fill.yt-interaction,
                #masthead-container yt-interaction.circular .stroke.yt-interaction {
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

                    .CentAnni-style-live-video, .CentAnni-style-upcoming-video, .CentAnni-style-newly-video, .CentAnni-style-recent-video, .CentAnni-style-lately-video, .CentAnni-style-old-video { border-radius: 0; }
                }

                .ytd-page-manager[page-subtype="subscriptions"] {
                    .CentAnni-style-last-seen { border-radius: 0; }
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
                font-family: "YouTube Sans","Roboto",sans-serif;
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

            .CentAnni-playlist-direction-btn {
                color: var(--yt-spec-text-secondary) !important;
            }

            .CentAnni-playlist-direction-btn.active {
                color: var(--yt-spec-text-primary) !important;
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

                    button.yt-icon-button>yt-icon {
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
                        --ytd-rich-grid-item-max-width: 100vw;
                        --ytd-rich-grid-item-min-width: 310px;
                        --ytd-rich-grid-item-margin: 0px !important;
                        --ytd-rich-grid-content-offset-top: 56px;
                    }

                    ytd-rich-item-renderer[rendered-from-rich-grid] {
                        margin: 0 !important;
                    }

                    #meta.ytd-rich-grid-media {
                        overflow-x: hidden;
                        padding-right: 6px;
                    }

                    #avatar-container.ytd-rich-grid-media {
                        margin:7px 6px 50px 6px;
                    }

                    h3.ytd-rich-grid-media {
                        margin: 7px 0 4px 0;
                    }

                    .yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after {
                        inset: -2px;
                    }
                }

                .ytd-page-manager[page-subtype="home"] {
                    ytd-menu-renderer.ytd-rich-grid-media {
                        position: absolute;
                        height: 36px;
                        width: 36px;
                        top: 50px;
                        right: auto;
                        left: 6px;
                        align-items: center;
                        background-color: rgba(255,255,255,.1);
                        border-radius: 50%;
                    }

                    .title-badge.ytd-rich-grid-media, .video-badge.ytd-rich-grid-media {
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
                }

                .ytd-page-manager[page-subtype="channels"] {
                    ytd-tabbed-page-header.grid-5-columns #page-header.ytd-tabbed-page-header, ytd-tabbed-page-header.grid-5-columns[has-inset-banner] #page-header-banner.ytd-tabbed-page-header {
                        padding: 0 !important;
                    }

                    ytd-two-column-browse-results-renderer.grid-5-columns, .grid-5-columns.ytd-two-column-browse-results-renderer {
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

                    .yt-tab-group-shape-wiz__slider,.yt-tab-shape-wiz__tab-bar {
                        display: none;
                    }

                    .yt-tab-shape-wiz__tab--tab-selected,.yt-tab-shape-wiz__tab:hover {
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
                        width: 80vw;
                        align-self: center;
                    }

                    #items.ytd-grid-renderer {
                        justify-content: center;
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
                    ytd-menu-renderer.ytd-rich-grid-media {
                        position: absolute;
                        height: 36px;
                        width: 36px;
                        top: 50px;
                        right: auto;
                        left: 3px;
                        align-items: center;
                        background-color: rgba(255,255,255,.1);
                        border-radius: 50%;
                    }

                    .title-badge.ytd-rich-grid-media, .video-badge.ytd-rich-grid-media {
                        position: absolute;
                        margin: 0px 10% 0 0;
                        right: 0;
                        top: 6em;
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

                #visibility-button.ytd-engagement-panel-title-header-renderer, #information-button.ytd-engagement-panel-title-header-renderer {
                    z-index: 1;
                }

                .ytChipShapeChip:hover  {
                    background: rgba(255,255,255,0.2);
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
            }

            ytd-watch-flexy #expandable-metadata #content.ytd-expandable-metadata-renderer {
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
                .CentAnni-style-live-video, .CentAnni-style-upcoming-video, .CentAnni-style-newly-video, .CentAnni-style-recent-video, .CentAnni-style-lately-video { outline: 2px solid; border-radius: 12px; }
                .CentAnni-style-old-video { outline: none;}

                .CentAnni-style-live-video { outline-color: var(--liveVideo); }
                .CentAnni-style-streamed-text { color: var(--streamedText); }
                .CentAnni-style-upcoming-video { outline-color: var(--upComingVideo); }
                .CentAnni-style-newly-video { outline-color: var(--newlyVideo); }
                .CentAnni-style-recent-video { outline-color: var(--recentVideo); }
                .CentAnni-style-lately-video { outline-color: var(--latelyVideo); }
                .CentAnni-style-old-video { opacity: var(--oldVideo); }
                ytd-rich-item-renderer:has(a#video-title-link[aria-label*="From your Watch later playlist"]) { background-color: var(--WatchLater); }
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
                    border: 1px dashed red;
                    background: transparent;
                    cursor: pointer;
                    margin: 10px 20px 0px 10px;
                    padding: 15px;
                    transition: background 0.2s, filter 0.2s, transform 0.15s;
                    font-size: 2rem;
                    position: relative;
                    z-index: 1000;
                    border-radius: 2px;
                }

                .CentAnni-style-playlist-remove-btn:hover {
                    background: darkred;
                }

                .CentAnni-style-playlist-remove-btn:active {
                    background: darkred;
                    transform: scale(0.9);
                }
            }

            .CentAnni-style-playlist-hide-menu {
                display: none !important;
            }

            .CentAnni-style-hide-watched-videos {
                .ytd-page-manager[page-subtype="home"] {
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
                button[aria-label="Join this channel"],
                #sponsor-button.ytd-video-owner-renderer:not(:empty),
                ytd-browse[page-subtype="channels"] ytd-recognition-shelf-renderer,
                ytd-browse[page-subtype="channels"] yt-page-header-view-model yt-flexible-actions-view-model button-view-model {
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
                yt-button-view-model.ytd-menu-renderer:has(button.yt-spec-button-shape-next[aria-label="Share"]) {
                    display: none;
                }
            }

            .CentAnni-style-hide-hashtags {
                    ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata a {
                            display: none !important;
                    }

                    ytd-watch-flexy #description > #description-inner #info-container {
                        height: 18px !important;
                    }

                    .CentAnni-chapter-title {
                        max-width: 60% !important;
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
                ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
                yt-chip-cloud-chip-renderer[chip-shape-data*='"text":"Shorts"'],
                ytd-reel-shelf-renderer.ytd-structured-description-content-renderer,
                ytd-rich-section-renderer:has(div ytd-rich-shelf-renderer[is-shorts]),
                #container.ytd-search ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
                ytd-browse[page-subtype="hashtag-landing-page"] tp-yt-app-toolbar.ytd-tabbed-page-header,
                #tabsContent > yt-tab-group-shape > div.yt-tab-group-shape-wiz__tabs > yt-tab-shape[tab-title="Shorts"] {
                    display: none !important;
                }
            }

            .CentAnni-style-hide-ad-slots {
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
                ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
                ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer),
                ytd-rich-item-renderer:has(.badge-style-type-simple[aria-label="YouTube featured"])
                ytd-compact-video-renderer:has(.badge-style-type-simple[aria-label="YouTube featured"]) {
                    display: none!important;
                }
            }

            .CentAnni-style-hide-members-only {
                ytd-compact-video-renderer:has(.badge-style-type-members-only),
                ytd-rich-item-renderer:has(.badge-style-type-members-only) {
                    display: none;
                }
            }

            .CentAnni-style-hide-pay-to-watch {
                ytd-compact-video-renderer:has(.badge[aria-label="Pay to watch"]),
                ytd-rich-item-renderer:has(.badge[aria-label="Pay to watch"]) {
                    display: none;
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
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Home"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-subscriptions-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Subscriptions"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-history-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="History"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-playlists-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Playlists"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-videos-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Your videos"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-courses-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Your courses"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-your-podcasts-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Your podcasts"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-wl-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Watch later"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-liked-videos-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Liked videos"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-you-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="You"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-subscriptions-section {
                #sections ytd-guide-section-renderer:has(#expander-item) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-subscriptions-title {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/@"]) #guide-section-title {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-more-btn {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/@"]) #expander-item {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-explore-section {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="feed/trending"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-explore-title {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="feed/trending"]) #guide-section-title {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-trending-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Trending"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-music-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Music"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-movies-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Movies & TV"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-live-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Live"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-gaming-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Gaming"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-news-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="News"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-sports-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Sports"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-learning-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Learning"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-fashion-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Fashion & Beauty"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-podcasts-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Podcasts"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-more-section {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/premium"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-more-title {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="youtubekids"]) #guide-section-title {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-yt-premium-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="YouTube Premium"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-yt-studio-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="YouTube Studio"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-yt-music-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="YouTube Music"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-yt-kids-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="YouTube Kids"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-penultimate-section {
                tp-yt-app-drawer#guide[role="navigation"] #sections ytd-guide-section-renderer:has(a[href*="/account"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-settings-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Settings"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-report-history-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Report history"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-help-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Help"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-feedback-btn {
                #sections ytd-guide-section-renderer ytd-guide-entry-renderer:has(a[title="Send feedback"]) {
                    display: none;
                }
            }

            .CentAnni-style-lnb-hide-footer {
                tp-yt-app-drawer#guide[role="navigation"] #footer {
                    display: none;
                }
            }

            /* hide main scrollbar in safari */
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

            ytd-masthead:not([dark]):not([page-dark-theme]) .button-wrapper:not(:has(.button-style-settings)):hover {
                background-color: rgba(0, 0, 0, 0.1); border-radius: 24px;
            }

            ytd-masthead:not([dark]):not([page-dark-theme]) .button-wrapper:not(:has(.button-style-settings)):active {
                background-color: rgba(0, 0, 0, 0.2); border-radius: 24px;
            }


            ytd-masthead:not([dark]):not([page-dark-theme]) .notification-error {
                background-color: white;
                border: 1px solid black;
                color: #030303;
            }

            html:not([dark]) .CentAnni-playback-speed-button:active {
                background: rgb(205,205,205) !important;
            }

            html:not([dark]) .CentAnni-tabView-tab,
            html:not([dark]) .CentAnni-playback-speed-display {
                background-color: rgba(0,0,0,0.05);
                color: #0f0f0f;
            }

            html:not([dark]) .CentAnni-tabView-tab:hover {
                background: rgba(0,0,0,0.1);
                border-color: transparent;
            }

            html:not([dark]) .CentAnni-tabView-tab.active {
                background-color: #0f0f0f;
                color: white;
            }

            html:not([dark]) .CentAnni-tabView {
                border: 1px solid var(--yt-spec-10-percent-layer);
            }

            html:not([dark]) ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy[target-id="engagement-panel-structured-description"] {
                background-color: var(--yt-spec-badge-chip-background);
            }

            html:not([dark]) #CentAnni-playback-speed-control > div > svg > path {
                fill: black;
            }

            html:not([dark]) ytd-watch-flexy[flexy][js-panel-height_] #panels.ytd-watch-flexy ytd-engagement-panel-section-list-renderer.ytd-watch-flexy,
            html:not([dark]) #related.style-scope.ytd-watch-flexy {
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

            .CentAnni-style-selection-color {
                --selection-color: var(--darkSelectionColor);
                --selection-text-color: white;
            }

            html:not([dark]) .CentAnni-style-selection-color {
                --selection-color: var(--lightSelectionColor);
                --selection-text-color: var(--light-theme-background-color);
            }

            .CentAnni-style-selection-color ::selection {
                background: var(--selection-color);
                color: var(--selection-text-color);
            }
        `;
    // (document.documentElement || document).appendChild(styleSheet);
    if (document.head) document.head.appendChild(styleSheet);
    else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(styleSheet);
        });
    }

    // default configuration
    const DEFAULT_CONFIG = {
        YouTubeTranscriptExporter: true,
        targetChatGPTUrl: 'https://ChatGPT.com/',
        targetNotebookLMUrl: 'https://NotebookLM.Google.com/',
        fileNamingFormat: 'title-channel',
        includeTimestamps: true,
        includeChapterHeaders: true,
        openSameTab:true,
        transcriptTimestamps: false,
        preventBackgroundExecution: true,
        ChatGPTPrompt: `You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic their communication style perfectly. Respond only in English while being mindful of American English spelling, vocabulary, and a casual, conversational tone. You prefer to use clauses instead of complete sentences while avoiding self-referential discourse signals like "I explain" or "I will show." Ignore advertisement, promotional, and sponsorship segments. Respond only in chat. Do not open a canvas. In your initial response, do not answer any question from the transcript, do not use the web tool, and avoid using colons. Do not hallucinate. Do not make up factual information. Do not speculate. Before you write your initial answer, take a moment to think about how you have to adopt your own writing to capture the YouTuber's specific word choices and communication style—study the provided transcript and utilize it as a style guide. Write as if you are the YouTuber speaking directly to your audience. Avoid any narrator-like phrases such as "the transcript" or "this video." Summarize the provided YouTube transcript into two distinct sections. The first section is a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them—only for this first section maintain a neutral tone. Then write the second section, a one-paragraph summary of at least 100 words while focusing on the main points and key takeaways into a section called "### One-Paragraph Summary:" and **bold** multiple phrases within the paragraph that together form an encapsulated, abridged version, that allows for quick identification and understanding of the core message.`,
        buttonIcons: {
            settings: '⋮',
            download: '↓',
            ChatGPT: '💬',
            NotebookLM: '🎧'
        },
        buttonLeft1Text: 'ABC News',
        buttonLeft1Url: 'https://www.youtube.com/@ABCNews/videos',
        buttonLeft2Text: 'CNN',
        buttonLeft2Url: 'https://www.youtube.com/@CNN/videos',
        buttonLeft3Text: '',
        buttonLeft3Url: 'https://www.youtube.com/@BBCNews/videos',
        buttonLeft4Text: '',
        buttonLeft4Url: 'https://www.youtube.com/@FoxNews/videos',
        buttonLeft5Text: '',
        buttonLeft5Url: 'https://www.youtube.com/@NBCNews/videos',
        buttonLeft6Text: '',
        buttonLeft6Url: 'https://www.youtube.com/@kcalnews/videos',
        buttonLeft7Text: '',
        buttonLeft7Url: 'https://www.youtube.com/foxla/videos',
        buttonLeft8Text: '',
        buttonLeft8Url: 'https://www.youtube.com/@earthcam/streams',
        buttonLeft9Text: '',
        buttonLeft9Url: 'https://www.youtube.com/@Formula1/videos',
        buttonLeft10Text: '',
        buttonLeft10Url: 'https://www.youtube.com/@OpenAI/videos',
        mButtonText: '☰',
        mButtonDisplay: false,
        colorCodeVideosEnabled: true,
        videosHideWatchedGlobal: false,
        videosHideWatched: false,
        videosOldOpacity: 0.5,
        videosAgeColorPickerNewly: '#FFFF00',
        videosAgeColorPickerRecent: '#FF9B00',
        videosAgeColorPickerLately: '#006DFF',
        videosAgeColorPickerLive: '#FF0000',
        videosAgeColorPickerStreamed: '#FF0000',
        videosAgeColorPickerUpcoming: '#32CD32',
        WatchLaterColor: '#313131',
        progressbarColorPicker: '#FF0033',
        lightModeSelectionColor: '#000000',
        darkModeSelectionColor: '#007CC3',
        textTransform: 'normal-case',
        defaultFontSize: 10,
        videosWatchedOpacity: 0.5,
        videosPerRow: 0,
        playProgressColor: false,
        videoTabView: true,
        tabViewChapters: true,
        progressBar: true,
        playbackSpeed: true,
        playbackSpeedValue: 1,
        VerifiedArtist: false,
        defaultQuality: 'auto',
        defaultQualityPremium: false,
        lastSeenVideo: true,
        lastSeenVideoScroll: false,
        lastSeenVideoColor: '#9400D3',
        playlistLinks: false,
        playlistTrashCan: false,
        commentsNewFirst: false,
        defaultTranscriptLanguage: 'auto',
        autoOpenChapters: true,
        autoOpenTranscript: false,
        displayRemainingTime: true,
        preventAutoplay: false,
        hideVoiceSearch: false,
        selectionColor: true,
        hideCreateButton: false,
        hideNotificationBtn: false,
        hideNotificationBadge: false,
        hideOwnAvatar: false,
        hideBrandText: false,
        hideJoinButton: false,
        hidePlayNextButton: false,
        hideAirplayButton: false,
        hideShorts: false,
        hideCommentsSection: false,
        hideVideosSection: false,
        redirectShorts: false,
        hideAdSlots: false,
        hidePayToWatch: false,
        hideFreeWithAds: false,
        hideMembersOnly: false,
        hideLatestPosts: false,
        hideShareButton: false,
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
        removeScrubber: false,
        disablePlayOnHover: false,
        hideFundraiser: false,
        hideMiniPlayer: false,
        hideQueueBtn: false,
        closeChatWindow: false,
        displayFullTitle: true,
        autoTheaterMode: false,
        channelReindirizzare: false,
        channelRSSBtn: false,
        channelPlaylistBtn: true,
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
        compactLayout: false
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

    // ensure CSS settings load immediately
    let cssSettingsApplied = false;
    function loadCSSsettings() {
        const html = document.documentElement;
        if (!html) return;

        // features css
        if (USER_CONFIG.progressBar) { html.classList.add('CentAnni-progress-bar'); } else { html.classList.remove('CentAnni-progress-bar'); }
        if (USER_CONFIG.videoTabView) { html.classList.add('CentAnni-video-tabView'); } else { html.classList.remove('CentAnni-video-tabView'); }
        if (USER_CONFIG.playbackSpeed) { html.classList.add('CentAnni-playback-speed'); } else { html.classList.remove('CentAnni-playback-speed'); }
        if (USER_CONFIG.mButtonDisplay) { html.classList.add('CentAnni-style-hide-default-sidebar'); } else { html.classList.remove('CentAnni-style-hide-default-sidebar'); }
        if (USER_CONFIG.videoTabView && USER_CONFIG.tabViewChapters) { html.classList.add('CentAnni-tabView-chapters'); } else { html.classList.remove('CentAnni-tabView-chapters'); }

        // custom css
        document.documentElement.style.setProperty('--itemsPerRow', USER_CONFIG.videosPerRow);
        document.documentElement.style.setProperty('--textTransform', USER_CONFIG.textTransform);
        document.documentElement.style.setProperty('--fontSize', `${USER_CONFIG.defaultFontSize}px`);
        document.documentElement.style.setProperty('--watchedOpacity', USER_CONFIG.videosWatchedOpacity);
        document.documentElement.style.setProperty('--progressBarColor', USER_CONFIG.progressbarColorPicker);
        document.documentElement.style.setProperty('--lightSelectionColor', USER_CONFIG.lightModeSelectionColor);
        document.documentElement.style.setProperty('--darkSelectionColor', USER_CONFIG.darkModeSelectionColor);

        if (USER_CONFIG.hideShorts) { html.classList.add('CentAnni-style-hide-shorts'); } else { html.classList.remove('CentAnni-style-hide-shorts'); }
        if (USER_CONFIG.closeChatWindow) { html.classList.add('CentAnni-close-live-chat'); } else { html.classList.remove('CentAnni-close-live-chat'); }
        if (USER_CONFIG.videosPerRow !== 0) { html.classList.add('CentAnni-style-video-row'); } else { html.classList.remove('CentAnni-style-video-row'); }
        if (USER_CONFIG.displayFullTitle) { html.classList.add('CentAnni-style-full-title'); } else { html.classList.remove('CentAnni-style-full-title'); }
        if (USER_CONFIG.hideAdSlots) { html.classList.add('CentAnni-style-hide-ad-slots'); } else { html.classList.remove('CentAnni-style-hide-ad-slots'); }
        if (USER_CONFIG.hideHashtags) { html.classList.add('CentAnni-style-hide-hashtags'); } else { html.classList.remove('CentAnni-style-hide-hashtags'); }
        if (USER_CONFIG.squareDesign) { html.classList.add('CentAnni-style-square-design'); } else { html.classList.remove('CentAnni-style-square-design'); }
        if (USER_CONFIG.hideQueueBtn) { html.classList.add('CentAnni-style-hide-queue-btn'); } else { html.classList.remove('CentAnni-style-hide-queue-btn'); }
        if (USER_CONFIG.hideJoinButton) { html.classList.add('CentAnni-style-hide-join-btn'); } else { html.classList.remove('CentAnni-style-hide-join-btn'); }
        if (USER_CONFIG.hideNewsHome) { html.classList.add('CentAnni-style-hide-news-home'); } else { html.classList.remove('CentAnni-style-hide-news-home'); }
        if (USER_CONFIG.hideEndCards) { html.classList.add('CentAnni-style-hide-end-cards'); } else { html.classList.remove('CentAnni-style-hide-end-cards'); }
        if (USER_CONFIG.squareAvatars) { html.classList.add('CentAnni-style-square-avatars'); } else { html.classList.remove('CentAnni-style-square-avatars'); }
        if (USER_CONFIG.compactLayout) { html.classList.add('CentAnni-style-compact-layout'); } else { html.classList.remove('CentAnni-style-compact-layout'); }
        if (USER_CONFIG.hideEndscreen) { html.classList.add('CentAnni-style-hide-endscreen'); } else { html.classList.remove('CentAnni-style-hide-endscreen'); }
        if (USER_CONFIG.lnbHideWlBtn) { html.classList.add('CentAnni-style-lnb-hide-wl-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-wl-btn'); }
        if (USER_CONFIG.hideOwnAvatar) { html.classList.add('CentAnni-style-hide-own-avatar'); } else { html.classList.remove('CentAnni-style-hide-own-avatar'); }
        if (USER_CONFIG.hideShareButton) { html.classList.add('CentAnni-style-hide-share-btn'); } else { html.classList.remove('CentAnni-style-hide-share-btn'); }
        if (USER_CONFIG.hideReplyButton) { html.classList.add('CentAnni-style-hide-reply-btn'); } else { html.classList.remove('CentAnni-style-hide-reply-btn'); }
        if (USER_CONFIG.lnbHideFooter) { html.classList.add('CentAnni-style-lnb-hide-footer'); } else { html.classList.remove('CentAnni-style-lnb-hide-footer'); }
        if (USER_CONFIG.hideInfoPanel) { html.classList.add('CentAnni-style-hide-info-panel'); } else { html.classList.remove('CentAnni-style-hide-info-panel'); }
        if (USER_CONFIG.hideBrandText) { html.classList.add('CentAnni-style-hide-brand-text'); } else { html.classList.remove('CentAnni-style-hide-brand-text'); }
        if (USER_CONFIG.selectionColor) { html.classList.add('CentAnni-style-selection-color'); } else { html.classList.remove('CentAnni-style-selection-color'); }
        if (USER_CONFIG.removeScrubber) { html.classList.add('CentAnni-style-remove-scrubber'); } else { html.classList.remove('CentAnni-style-remove-scrubber'); }
        if (USER_CONFIG.hideFundraiser) { html.classList.add('CentAnni-style-hide-fundraiser'); } else { html.classList.remove('CentAnni-style-hide-fundraiser'); }
        if (USER_CONFIG.hideMiniPlayer) { html.classList.add('CentAnni-style-hide-miniplayer'); } else { html.classList.remove('CentAnni-style-hide-miniplayer'); }
        if (USER_CONFIG.lnbHideYouBtn) { html.classList.add('CentAnni-style-lnb-hide-you-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-you-btn'); }
        if (USER_CONFIG.hideAddComment) { html.classList.add('CentAnni-style-hide-add-comment'); } else { html.classList.remove('CentAnni-style-hide-add-comment'); }
        if (USER_CONFIG.hideCreateButton) { html.classList.add('CentAnni-style-hide-create-btn'); } else { html.classList.remove('CentAnni-style-hide-create-btn'); }
        if (USER_CONFIG.hideVideosSection) { html.classList.add('CentAnni-style-hide-videos-btn'); } else { html.classList.remove('CentAnni-style-hide-videos-btn'); }
        if (USER_CONFIG.gradientBottom) { html.classList.add('CentAnni-style-gradient-bottom'); } else { html.classList.remove('CentAnni-style-gradient-bottom'); }
        if (USER_CONFIG.hidePayToWatch) { html.classList.add('CentAnni-style-hide-pay-to-watch'); } else { html.classList.remove('CentAnni-style-hide-pay-to-watch'); }
        if (USER_CONFIG.lnbHideLiveBtn) { html.classList.add('CentAnni-style-lnb-hide-live-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-live-btn'); }
        if (USER_CONFIG.lnbHideNewsBtn) { html.classList.add('CentAnni-style-lnb-hide-news-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-news-btn'); }
        if (USER_CONFIG.lnbHideMoreBtn) { html.classList.add('CentAnni-style-lnb-hide-more-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-more-btn'); }
        if (USER_CONFIG.lnbHideHomeBtn) { html.classList.add('CentAnni-style-lnb-hide-home-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-home-btn'); }
        if (USER_CONFIG.lnbHideHelpBtn) { html.classList.add('CentAnni-style-lnb-hide-help-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-help-btn'); }
        if (USER_CONFIG.hideAirplayButton) { html.classList.add('CentAnni-style-hide-airplay-btn'); } else { html.classList.remove('CentAnni-style-hide-airplay-btn'); }
        if (USER_CONFIG.hideMembersOnly) { html.classList.add('CentAnni-style-hide-members-only'); } else { html.classList.remove('CentAnni-style-hide-members-only'); }
        if (USER_CONFIG.hideLatestPosts) { html.classList.add('CentAnni-style-hide-latest-posts'); } else { html.classList.remove('CentAnni-style-hide-latest-posts'); }
        if (USER_CONFIG.hideVoiceSearch) { html.classList.add('CentAnni-style-hide-voice-search'); } else { html.classList.remove('CentAnni-style-hide-voice-search'); }
        if (USER_CONFIG.squareSearchBar) { html.classList.add('CentAnni-style-square-search-bar'); } else { html.classList.remove('CentAnni-style-square-search-bar'); }
        if (USER_CONFIG.hideFreeWithAds) { html.classList.add('CentAnni-style-hide-free-with-ads'); } else { html.classList.remove('CentAnni-style-hide-free-with-ads'); }
        if (USER_CONFIG.lnbHideMusicBtn) { html.classList.add('CentAnni-style-lnb-hide-music-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-music-btn'); }
        if (USER_CONFIG.hidePlayNextButton) { html.classList.add('CentAnni-style-hide-playnext-btn'); } else { html.classList.remove('CentAnni-style-hide-playnext-btn'); }
        if (USER_CONFIG.hideCommentsSection) { html.classList.add('CentAnni-style-hide-comments-btn'); } else { html.classList.remove('CentAnni-style-hide-comments-btn'); }
        if (USER_CONFIG.lnbHideMoviesBtn) { html.classList.add('CentAnni-style-lnb-hide-movies-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-movies-btn'); }
        if (USER_CONFIG.lnbHideGamingBtn) { html.classList.add('CentAnni-style-lnb-hide-gaming-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-gaming-btn'); }
        if (USER_CONFIG.lnbHideSportsBtn) { html.classList.add('CentAnni-style-lnb-hide-sports-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-sports-btn'); }
        if (USER_CONFIG.lnbHideMoreTitle) { html.classList.add('CentAnni-style-lnb-hide-more-title'); } else { html.classList.remove('CentAnni-style-lnb-hide-more-title'); }
        if (USER_CONFIG.lnbHideVideosBtn) { html.classList.add('CentAnni-style-lnb-hide-videos-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-videos-btn'); }
        if (USER_CONFIG.playProgressColor) { html.classList.add('CentAnni-style-play-progress-color'); } else { html.classList.remove('CentAnni-style-play-progress-color'); }
        if (USER_CONFIG.hidePlaylistsHome) { html.classList.add('CentAnni-style-hide-playlists-home'); } else { html.classList.remove('CentAnni-style-hide-playlists-home'); }
        if (USER_CONFIG.lnbHideYtKidsBtn) { html.classList.add('CentAnni-style-lnb-hide-yt-kids-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-yt-kids-btn'); }
        if (USER_CONFIG.lnbHideFashionBtn) { html.classList.add('CentAnni-style-lnb-hide-fashion-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-fashion-btn'); }
        if (USER_CONFIG.lnbHideCoursesBtn) { html.classList.add('CentAnni-style-lnb-hide-courses-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-courses-btn'); }
        if (USER_CONFIG.lnbHideHistoryBtn) { html.classList.add('CentAnni-style-lnb-hide-history-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-history-btn'); }
        if (USER_CONFIG.smallSubscribeButton) { html.classList.add('CentAnni-style-small-subscribe-btn'); } else { html.classList.remove('CentAnni-style-small-subscribe-btn'); }
        if (USER_CONFIG.lnbHideYtMusicBtn) { html.classList.add('CentAnni-style-lnb-hide-yt-music-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-yt-music-btn'); }
        if (USER_CONFIG.lnbHideTrendingBtn) { html.classList.add('CentAnni-style-lnb-hide-trending-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-trending-btn'); }
        if (USER_CONFIG.disablePlayOnHover) { html.classList.add('CentAnni-style-disable-play-on-hover'); } else { html.classList.remove('CentAnni-style-disable-play-on-hover'); }
        if (USER_CONFIG.lnbHideLearningBtn) { html.classList.add('CentAnni-style-lnb-hide-learning-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-learning-btn'); }
        if (USER_CONFIG.lnbHidePodcastsBtn) { html.classList.add('CentAnni-style-lnb-hide-podcasts-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-podcasts-btn'); }
        if (USER_CONFIG.lnbHideMoreSection) { html.classList.add('CentAnni-style-lnb-hide-more-section'); } else { html.classList.remove('CentAnni-style-lnb-hide-more-section'); }
        if (USER_CONFIG.lnbHideSettingsBtn) { html.classList.add('CentAnni-style-lnb-hide-settings-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-settings-btn'); }
        if (USER_CONFIG.lnbHideFeedbackBtn) { html.classList.add('CentAnni-style-lnb-hide-feedback-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-feedback-btn'); }
        if (USER_CONFIG.hideNotificationBtn) { html.classList.add('CentAnni-style-hide-notification-btn'); } else { html.classList.remove('CentAnni-style-hide-notification-btn'); }
        if (USER_CONFIG.lnbHideYtStudioBtn) { html.classList.add('CentAnni-style-lnb-hide-yt-studio-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-yt-studio-btn'); }
        if (USER_CONFIG.lnbHidePlaylistsBtn) { html.classList.add('CentAnni-style-lnb-hide-playlists-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-playlists-btn'); }
        if (USER_CONFIG.lnbHideExploreTitle) { html.classList.add('CentAnni-style-lnb-hide-explore-title'); } else { html.classList.remove('CentAnni-style-lnb-hide-explore-title'); }
        if (USER_CONFIG.lnbHideYtPremiumBtn) { html.classList.add('CentAnni-style-lnb-hide-yt-premium-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-yt-premium-btn'); }
        if (USER_CONFIG.hideNotificationBadge) { html.classList.add('CentAnni-style-hide-notification-badge'); } else { html.classList.remove('CentAnni-style-hide-notification-badge'); }
        if (USER_CONFIG.lnbHideExploreSection) { html.classList.add('CentAnni-style-lnb-hide-explore-section'); } else { html.classList.remove('CentAnni-style-lnb-hide-explore-section'); }
        if (USER_CONFIG.lnbHideLikedVideosBtn) { html.classList.add('CentAnni-style-lnb-hide-liked-videos-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-liked-videos-btn'); }
        if (USER_CONFIG.lnbHideYPodcastsBtn) { html.classList.add('CentAnni-style-lnb-hide-your-podcasts-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-your-podcasts-btn'); }
        if (USER_CONFIG.hideRightSidebarSearch) { html.classList.add('CentAnni-style-search-hide-right-sidebar'); } else { html.classList.remove('CentAnni-style-search-hide-right-sidebar'); }
        if (USER_CONFIG.videosHideWatchedGlobal) { html.classList.add('CentAnni-style-hide-watched-videos-global'); } else { html.classList.remove('CentAnni-style-hide-watched-videos-global'); }
        if (USER_CONFIG.lnbHideSubscriptionsBtn) { html.classList.add('CentAnni-style-lnb-hide-subscriptions-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-subscriptions-btn'); }
        if (USER_CONFIG.lnbHideReportHistoryBtn) { html.classList.add('CentAnni-style-lnb-hide-report-history-btn'); } else { html.classList.remove('CentAnni-style-lnb-hide-report-history-btn'); }
        if (USER_CONFIG.lnbHideSubscriptionsTitle) { html.classList.add('CentAnni-style-lnb-hide-subscriptions-title'); } else { html.classList.remove('CentAnni-style-lnb-hide-subscriptions-title'); }
        if (USER_CONFIG.lnbHidePenultimateSection) { html.classList.add('CentAnni-style-lnb-hide-penultimate-section'); } else { html.classList.remove('CentAnni-style-lnb-hide-penultimate-section'); }
        if (USER_CONFIG.lnbHideSubscriptionsSection) { html.classList.add('CentAnni-style-lnb-hide-subscriptions-section'); } else { html.classList.remove('CentAnni-style-lnb-hide-subscriptions-section'); }

        // color code videos
        if (USER_CONFIG.videosHideWatched) { html.classList.add('CentAnni-style-hide-watched-videos'); } else { html.classList.remove('CentAnni-style-hide-watched-videos'); }
        document.documentElement.style.setProperty('--liveVideo', USER_CONFIG.videosAgeColorPickerLive);
        document.documentElement.style.setProperty('--streamedText', USER_CONFIG.videosAgeColorPickerStreamed);
        document.documentElement.style.setProperty('--upComingVideo', USER_CONFIG.videosAgeColorPickerUpcoming);
        document.documentElement.style.setProperty('--newlyVideo', USER_CONFIG.videosAgeColorPickerNewly);
        document.documentElement.style.setProperty('--recentVideo', USER_CONFIG.videosAgeColorPickerRecent);
        document.documentElement.style.setProperty('--latelyVideo', USER_CONFIG.videosAgeColorPickerLately);
        document.documentElement.style.setProperty('--oldVideo', USER_CONFIG.videosOldOpacity);
        if (USER_CONFIG.colorCodeVideosEnabled) document.documentElement.style.setProperty('--WatchLater', USER_CONFIG.WatchLaterColor);
        document.documentElement.style.setProperty('--lastSeenVideoColor', USER_CONFIG.lastSeenVideoColor);

        cssSettingsApplied = true;
    } loadCSSsettings();

    // create and show the settings modal
    function showSettingsModal() {
        const existingModal = document.getElementById('yt-transcript-settings-modal');
        if (existingModal) {
            existingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            return;
        }

        // create modal elements
        const modal = document.createElement('div');
        modal.id = 'yt-transcript-settings-modal';
        modal.classList.add('CentAnni-overlay');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // create header container
        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('header-wrapper');

        // header
        const header = document.createElement('a');
        header.href = 'https://github.com/TimMacy/YouTubeAlchemy';
        header.target = '_blank';
        header.innerText = 'YouTube Alchemy';
        header.title = 'GitHub Repository for YouTube Alchemy';
        header.classList.add('header');
        headerWrapper.appendChild(header);

        // version
        const versionSpan = document.createElement('span');
        const scriptVersion = GM.info.script.version;
        versionSpan.innerText = `v${scriptVersion}`;
        versionSpan.classList.add('version-label');
        headerWrapper.appendChild(versionSpan);

        modalContent.appendChild(headerWrapper);

        // create form elements for each setting
        const form = document.createElement('form');
        form.id = 'yt-transcript-settings-form';

        // Button Icons
        const iconsHeader = document.createElement('label');
        iconsHeader.innerText = 'Button Icons:';
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
            label.innerText = labelText;
            label.className = labelClass;
            label.classList.add('container-button-label');

            container.appendChild(input);
            container.appendChild(label);

            return container;
        }

        iconsContainer.appendChild(createIconInputField('NotebookLM', 'buttonIconNotebookLM', USER_CONFIG.buttonIcons.NotebookLM, 'label-NotebookLM'));
        iconsContainer.appendChild(createIconInputField('ChatGPT', 'buttonIconChatGPT', USER_CONFIG.buttonIcons.ChatGPT, 'label-ChatGPT'));
        iconsContainer.appendChild(createIconInputField('Download', 'buttonIconDownload', USER_CONFIG.buttonIcons.download, 'label-download'));
        iconsContainer.appendChild(createIconInputField('Settings', 'buttonIconSettings', USER_CONFIG.buttonIcons.settings, 'label-settings'));

        form.appendChild(iconsContainer);

        // NotebookLM URL
        form.appendChild(createInputField('NotebookLM URL (Copy transcript, then open the website):', 'targetNotebookLMUrl', USER_CONFIG.targetNotebookLMUrl, 'label-NotebookLM'));

        // ChatGPT URL
        form.appendChild(createInputField('ChatGPT URL (Copy transcript with the prompt, then open the website):', 'targetChatGPTUrl', USER_CONFIG.targetChatGPTUrl, 'label-ChatGPT'));

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
        description.innerText = 'Ensures compatibility and prevents early script execution in background tabs.\nWhile this feature is superfluous in Safari, it is essential for Chrome.';
        description.classList.add('CentAnni-info-text');
        form.appendChild(description);

        // extra settings buttons
        const extraSettings = document.createElement('div');
        extraSettings.classList.add('extra-button-container');

        const buttonsLeft = document.createElement('button');
        buttonsLeft.type = 'button';
        buttonsLeft.innerText = 'Links in Header';
        buttonsLeft.classList.add('btn-style-settings');
        buttonsLeft.onclick = () => showSubPanel(createLinksInHeaderContent(), 'linksInHeader');

        const customCSSButton = document.createElement('button');
        customCSSButton.type = 'button';
        customCSSButton.innerText = 'Features & CSS';
        customCSSButton.classList.add('btn-style-settings');
        customCSSButton.onclick = () => showSubPanel(createCustomCSSContent(), 'createcustomCSS');

        const colorCodeVideos = document.createElement('button');
        colorCodeVideos.type = 'button';
        colorCodeVideos.innerText = 'Color Code Videos';
        colorCodeVideos.classList.add('btn-style-settings');
        colorCodeVideos.onclick = () => showSubPanel(createColorCodeVideosContent(), 'colorCodeVideos');

        extraSettings.appendChild(buttonsLeft)
        extraSettings.appendChild(customCSSButton);
        extraSettings.appendChild(colorCodeVideos);

        form.appendChild(extraSettings);

        // ChatGPT prompt
        const promptContainer = createTextareaField('ChatGPT Prompt:', 'ChatGPTPrompt', USER_CONFIG.ChatGPTPrompt, 'label-ChatGPT');

        // reset ChatGPT prompt
        const resetText = document.createElement('span');
        resetText.innerText = 'Reset Prompt';
        resetText.className = 'reset-prompt-text';
        resetText.addEventListener('click', function() {
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
        exportButton.innerText = 'Export Settings';
        exportButton.classList.add('btn-style-settings');
        exportButton.onclick = exportSettings;

        const importButton = document.createElement('button');
        importButton.type = 'button';
        importButton.innerText = 'Import Settings';
        importButton.classList.add('btn-style-settings');
        importButton.onclick = importSettings;

        // Copyright
        const copyright = document.createElement('a');
        copyright.href = 'https://github.com/TimMacy';
        copyright.target = '_blank';
        copyright.innerText = '© 2024 Tim Macy';
        copyright.title = 'Copyright by Tim Macy';
        copyright.classList.add('copyright');

        const spacer = document.createElement('div');
        spacer.style = 'flex: 1;';

        // Save, Reset, and Cancel Buttons
        const buttonContainerSettings = document.createElement('div');
        buttonContainerSettings.classList.add('button-container-settings');

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerText = 'Save';
        saveButton.classList.add('btn-style-settings');
        saveButton.onclick = saveSettings;

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.innerText = 'Reset to Default';
        resetButton.classList.add('btn-style-settings');
        resetButton.onclick = async () => {
            const userConfirmed = window.confirm("All settings will be reset to their default values.");
            if (!userConfirmed) { return; }

            try {
                USER_CONFIG = { ...DEFAULT_CONFIG };
                await GM.setValue('USER_CONFIG', USER_CONFIG);
                showNotification('Settings have been reset to default!');
                document.getElementById('yt-transcript-settings-modal').style.display = 'none';
                setTimeout(() => { location.reload(); }, 1000);
            } catch (error) {
                showNotification('Error resetting settings to default!');
                console.error("YouTubeAlchemy: Error resetting settings to default:", error);
            }
        };

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerText = 'Cancel';
        cancelButton.classList.add('btn-style-settings');
        cancelButton.onclick = () => { modal.style.display = 'none'; document.body.style.overflow = ''; };

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
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // text area scroll on click
        let animationTriggered = false;

        document.querySelector('.chatgpt-prompt-textarea').addEventListener('click', function () {
            if (animationTriggered) return;
            animationTriggered = true;

            const modalContent = this.closest('#yt-transcript-settings-form');
            if (!modalContent) { animationTriggered = false; return; }

            const textArea = this;
            const buttons = modalContent.querySelector('.button-container-end');
            const startHeight = 65;
            const endHeight = 569;
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

            if (contentWillFit) { desiredScrollTop = contentHeightAfterExpansion - modalVisibleHeight;
            } else { desiredScrollTop = buttonsBottom + (endHeight - startHeight) - modalVisibleHeight; }

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

                if (progress < 1) { requestAnimationFrame(animateScroll);
                } else { animationTriggered = false; }
            }

            requestAnimationFrame(animateScroll);
        });

        // close modal on overlay click
        function closeModalOverlayClickHandler(event) {
            const mainModal = document.getElementById('yt-transcript-settings-modal');
            const openSubPanel = document.querySelector('.sub-panel-overlay.active');

            if (openSubPanel && event.target === openSubPanel) {
              openSubPanel.classList.remove('active');
              return;
            }

            if (mainModal && event.target === mainModal) {
              mainModal.style.display = 'none';
              document.body.style.overflow = '';
              return;
            }
        }
        document.addEventListener('click', closeModalOverlayClickHandler);

        // close modal with ESC key
        const escKeyListener = function(event) {
            if (event.key === 'Escape' && event.type === 'keydown') {
                const openSubPanel = document.querySelector('.sub-panel-overlay.active');

                if (openSubPanel) {
                    openSubPanel.classList.remove('active');
                } else {
                    const modal = document.getElementById('yt-transcript-settings-modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                }
            }
        };

        window.addEventListener('keydown', escKeyListener);

        document.addEventListener('yt-navigate-start', () => {
            window.removeEventListener('keydown', escKeyListener);
            document.removeEventListener('click', closeModalOverlayClickHandler);
        });

        // sub-panels
        function showSubPanel(panelContent, panelId) {
            let subPanelOverlay = document.querySelector(`.sub-panel-overlay[data-panel-id="${panelId}"]`);

            if (!subPanelOverlay){
                subPanelOverlay = document.createElement('div');
                subPanelOverlay.classList.add('sub-panel-overlay');
                subPanelOverlay.setAttribute('data-panel-id', panelId);

                const subPanel = document.createElement('div');
                subPanel.classList.add('sub-panel');

                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.innerText = 'Close';
                closeButton.classList.add('btn-style-settings');
                closeButton.onclick = () => { subPanelOverlay.classList.remove('active'); };
                subPanel.appendChild(closeButton);

                if (panelContent) { subPanel.appendChild(panelContent); }

                subPanelOverlay.appendChild(subPanel);
                document.body.appendChild(subPanelOverlay);
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
            infoLinksHeader.innerText = "Up to ten links can be added next to the YouTube logo. An empty 'Link Text' field won't insert the link into the header.\nIf the navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.";
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
            general.innerText = 'General';
            general.classList.add('button-icons', 'features-text');
            form.appendChild(general);

            // dim watched videos
            const videosWatchedContainer = createSliderInputField( 'Change Opacity of Watched Videos (default 0.5):', 'videosWatchedOpacity', USER_CONFIG.videosWatchedOpacity, '0', '1', '0.1' );
            form.appendChild(videosWatchedContainer);

            // title text transform
            form.appendChild(createSelectField('Title Case:', 'label-Text-Transform', 'textTransform', USER_CONFIG.textTransform, {
                'uppercase': 'uppercase - THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.',
                'lowercase': 'lowercase - the quick brown fox jumps over the lazy dog.',
                'capitalize': 'capitalize - The Quick Brown Fox Jumps Over The Lazy Dog.',
                'normal-case': 'normal-case (default) - The quick brown fox jumps over the lazy dog.',
            }));

            // default video quality
            form.appendChild(createSelectField( 'Video Quality:', 'label-Video-Quality', 'defaultQuality', USER_CONFIG.defaultQuality, {
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

            // default transcript language
            form.appendChild(createSelectField( 'Transcript Language:', 'label-Transcript-Language', 'defaultTranscriptLanguage', USER_CONFIG.defaultTranscriptLanguage, {
                    'auto': 'Auto  (default)',
                    'english': 'English',
                    'spanish': 'Spanish - Español',
                    'hindi': 'Hindi - हिन्दी',
                    'portuguese': 'Portuguese - Português',
                    'german': 'German - Deutsch',
                    'french': 'French - Français',
                    'italian': 'Italian - Italiano',
                    'dutch': 'Dutch - Nederlands',
                    'polish': 'Polish - Polski',
                    'hebrew': 'Hebrew - עברית'
            }));

            // font size
            const defaultFontSizeField = createNumberInputField('Set Font Size (default: 10)', 'defaultFontSize', USER_CONFIG.defaultFontSize);
            form.appendChild(defaultFontSizeField);

            // videos per row
            const videosPerRow = createNumberInputField("Number of Videos per Row (default: 0 | dynamic based on available space)", 'videosPerRow', USER_CONFIG.videosPerRow);
            form.appendChild(videosPerRow);

            // playback speed
            const playbackSpeedContainer = document.createElement('div');
            playbackSpeedContainer.className = 'playback-speed-container';

            const playbackSpeed = createCheckboxField('Enabled (default: yes)\nkey toggles: A: -0.25x | S: toggle 1x/set speed | D: +0.25x', 'playbackSpeed', USER_CONFIG.playbackSpeed);
            const playbackSpeedValue = createNumberInputField('Set Playback Speed for VODs\n(defaults to 1x for live videos)', 'playbackSpeedValue', USER_CONFIG.playbackSpeedValue);

            playbackSpeedContainer.appendChild(playbackSpeedValue);
            playbackSpeedContainer.appendChild(playbackSpeed);
            form.appendChild(playbackSpeedContainer);

            // features
            const features = document.createElement('label');
            features.innerText = 'Features';
            features.classList.add('button-icons', 'features-text');
            form.appendChild(features);

            // auto theater mode
            const autoTheaterMode = createCheckboxField('Auto Theater Mode (default: no)', 'autoTheaterMode', USER_CONFIG.autoTheaterMode);
            form.appendChild(autoTheaterMode);

            // prevent autoplay
            const preventAutoplay = createCheckboxField('Prevent Autoplay (default: no)', 'preventAutoplay', USER_CONFIG.preventAutoplay);
            form.appendChild(preventAutoplay);

            // disable play on hover
            const disablePlayOnHover = createCheckboxField('Disable Play on Hover (default: no)', 'disablePlayOnHover', USER_CONFIG.disablePlayOnHover);
            form.appendChild(disablePlayOnHover);

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
            const channelPlaylistBtn = createCheckboxField('Add Playlist Buttons to Channel Pages (default: yes)', 'channelPlaylistBtn', USER_CONFIG.channelPlaylistBtn);
            form.appendChild(channelPlaylistBtn);

            // playlist direction buttons in playlist panel
            const playlistDirectionBtns = createCheckboxField('Add Direction Buttons to Playlist Panels (default: yes)', 'playlistDirectionBtns', USER_CONFIG.playlistDirectionBtns);
            form.appendChild(playlistDirectionBtns);

            // open playlist videos without being in a playlist
            const playlistLinks = createCheckboxField('Open Playlist Videos Without Being in a Playlist When Clicking the Thumbnail or Title (default: no)', 'playlistLinks', USER_CONFIG.playlistLinks);
            form.appendChild(playlistLinks);

            // channel default videos page
            const playlistTrashCan = createCheckboxField('Show Trash Can Icon on Owned Playlists to Quickly Remove Videos (default: no)', 'playlistTrashCan', USER_CONFIG.playlistTrashCan);
            form.appendChild(playlistTrashCan);

            // sort comments new first
            const commentsNewFirst = createCheckboxField('Sort Comments to "Newest First" (default: no)', 'commentsNewFirst', USER_CONFIG.commentsNewFirst);
            form.appendChild(commentsNewFirst);

            // auto open chapter panel
            const autoOpenChapters = createCheckboxField('Automatically Open Chapter Panels (default: yes)', 'autoOpenChapters', USER_CONFIG.autoOpenChapters);
            form.appendChild(autoOpenChapters);

            // auto open transcript panel
            const autoOpenTranscript = createCheckboxField('Automatically Open Transcript Panels (default: no)', 'autoOpenTranscript', USER_CONFIG.autoOpenTranscript);
            form.appendChild(autoOpenTranscript);

            // enable transcript timestamps
            const transcriptTimestamps = createCheckboxField('Automatically Enable Timestamps in Transcript Panels (default: no)', 'transcriptTimestamps', USER_CONFIG.transcriptTimestamps);
            form.appendChild(transcriptTimestamps);

            // 1x playback speed for music videos
            const VerifiedArtist = createCheckboxField('Maintain 1x Playback Speed for Verified Artist Music Videos (default: no)', 'VerifiedArtist', USER_CONFIG.VerifiedArtist);
            form.appendChild(VerifiedArtist);

            // 1080p enhanced bitrate
            const defaultQualityPremium = createCheckboxField('Use Enhanced Bitrate for 1080p Videos | Premium Required (default: no)', 'defaultQualityPremium', USER_CONFIG.defaultQualityPremium);
            form.appendChild(defaultQualityPremium);

            // persistent progress bar
            const progressBar = createCheckboxField('Persistent Progress Bar with Chapter Markers and SponsorBlock Support (default: yes)', 'progressBar', USER_CONFIG.progressBar);
            form.appendChild(progressBar);

            // display remaining time minus SponsorBlock segments
            const displayRemainingTime = createCheckboxField('Display Remaining Time Under Videos Adjusted for Playback Speed (default: yes)', 'displayRemainingTime', USER_CONFIG.displayRemainingTime);
            form.appendChild(displayRemainingTime);

            // info for remaining time minus segments beta
            const descriptionRemainingTimeBeta = document.createElement('small');
            descriptionRemainingTimeBeta.innerText = 'To also include Skipped SponsorBlock Segments, ensure "Show time with skips removed" is enabled in SponsorBlock Settings under "Interface."';
            descriptionRemainingTimeBeta.classList.add('CentAnni-info-text');
            form.appendChild(descriptionRemainingTimeBeta);

            // layout changes
            const layoutChanges = document.createElement('label');
            layoutChanges.innerText = 'Layout Changes';
            layoutChanges.classList.add('button-icons', 'features-text');
            form.appendChild(layoutChanges);

            // tab view on video page
            const videoTabView = createCheckboxField('Tab View on Video Page (default: yes)', 'videoTabView', USER_CONFIG.videoTabView);
            form.appendChild(videoTabView);

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

            // hide shorts
            const hideShorts = createCheckboxField('Hide Shorts (default: no)', 'hideShorts', USER_CONFIG.hideShorts);
            form.appendChild(hideShorts);

            // redirect shorts
            const redirectShorts = createCheckboxField('Redirect Shorts to the Standard Video Page (default: no)', 'redirectShorts', USER_CONFIG.redirectShorts);
            form.appendChild(redirectShorts);

            // hide ad slot
            const hideAdSlots = createCheckboxField('Hide Ad Slots on the Home Page (default: no)', 'hideAdSlots', USER_CONFIG.hideAdSlots);
            form.appendChild(hideAdSlots);

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
            uielements.innerText = 'Modify or Hide UI Elements';
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

            // small subscribed button
            const smallSubscribeButton = createCheckboxField('Small Subscribed Button Under a Video—Displays Only the Notification Icon (default: no)', 'smallSubscribeButton', USER_CONFIG.smallSubscribeButton);
            form.appendChild(smallSubscribeButton);

            // hide join button
            const hideJoinButton = createCheckboxField('Hide Join Button under a Videos and on Channel Pages (default: no)', 'hideJoinButton', USER_CONFIG.hideJoinButton);
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

            // hide share button
            const hideShareButton = createCheckboxField('Hide Share Button Under a Videos (default: no)', 'hideShareButton', USER_CONFIG.hideShareButton);
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

            // hide news on home
            const hideNewsHome = createCheckboxField('Hide Breaking News on Home (default: no)', 'hideNewsHome', USER_CONFIG.hideNewsHome);
            form.appendChild(hideNewsHome);

            // hide playlists on home
            const hidePlaylistsHome = createCheckboxField('Hide Playlists on Home (default: no)', 'hidePlaylistsHome', USER_CONFIG.hidePlaylistsHome);
            form.appendChild(hidePlaylistsHome);

            // hide fundraiser
            const hideFundraiser = createCheckboxField('Hide Fundraiser Icons and Panels (default: no)', 'hideFundraiser', USER_CONFIG.hideFundraiser);
            form.appendChild(hideFundraiser);

            // hide mini player
            const hideMiniPlayer = createCheckboxField('Hide Mini Player (default: no)', 'hideMiniPlayer', USER_CONFIG.hideMiniPlayer);
            form.appendChild(hideMiniPlayer);

            // hide queue button
            const hideQueueBtn = createCheckboxField('Hide "Add to queue" Button on Hover (default: no)', 'hideQueueBtn', USER_CONFIG.hideQueueBtn);
            form.appendChild(hideQueueBtn);

            // hide right sidebar search
            const hideRightSidebarSearch = createCheckboxField('Hide Right Sidebar on Search Page (default: no)', 'hideRightSidebarSearch', USER_CONFIG.hideRightSidebarSearch);
            form.appendChild(hideRightSidebarSearch);

            // hide watched videos globally
            const videosHideWatchedGlobal = createCheckboxField('Hide Watched Videos Globally (default: no)', 'videosHideWatchedGlobal', USER_CONFIG.videosHideWatchedGlobal);
            form.appendChild(videosHideWatchedGlobal);

            // left navigation bar
            const leftnavbar = document.createElement('label');
            leftnavbar.innerText = 'Hide UI Elements in the Left Navigation Bar';
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
            colorCodeVideosOnHome.innerText = 'Home Page';
            colorCodeVideosOnHome.classList.add('button-icons', 'features-text');
            form.appendChild(colorCodeVideosOnHome);

            const infoColorCodeVideosHome = document.createElement('small');
            infoColorCodeVideosHome.innerText = "These settings apply only to the Home page.";
            infoColorCodeVideosHome.classList.add('CentAnni-info-text');
            form.appendChild(infoColorCodeVideosHome);

            // activate color code videos on home
            const checkboxField = createCheckboxField('Color Code Videos Based on Age and Status (default: yes)', 'colorCodeVideosEnabled', USER_CONFIG.colorCodeVideosEnabled );
            form.appendChild(checkboxField);

            const checkboxFieldWatched = createCheckboxField('Hide Watched Videos—Only on Home (default: no)', 'videosHideWatched', USER_CONFIG.videosHideWatched );
            form.appendChild(checkboxFieldWatched);

            // opacity picker for old videos
            const videosOldContainer = createSliderInputField( 'Change Opacity of Videos Uploaded More than 6 Months Ago:', 'videosOldOpacity', USER_CONFIG.videosOldOpacity, '0', '1', '0.1' );
            form.appendChild(videosOldContainer);

            // color pickers for different video ages
            const videosAgeContainer = document.createElement('div');
            videosAgeContainer.classList.add('videos-colorpicker-container');

            function createLabelColorPair(labelText, configKey) {
                const row = document.createElement('div');
                row.classList.add('videos-colorpicker-row');

                const label = document.createElement('span');
                label.classList.add('label-style-settings');
                label.innerText = labelText;
                row.appendChild(label);

                const colorPicker = document.createElement('input');
                colorPicker.type = 'color';
                colorPicker.value = USER_CONFIG[configKey];
                colorPicker.name = configKey;
                row.appendChild(colorPicker);

                videosAgeContainer.appendChild(row);
            }

            createLabelColorPair('Videos Uploaded Within the Last 24 Hours:', 'videosAgeColorPickerNewly');
            createLabelColorPair('Videos Uploaded Within the Past Week:', 'videosAgeColorPickerRecent');
            createLabelColorPair('Videos Uploaded Within the Past Month:', 'videosAgeColorPickerLately');
            createLabelColorPair('Videos Currently Live:', 'videosAgeColorPickerLive');
            createLabelColorPair('The Word “Streamed” from Videos That Were Live:', 'videosAgeColorPickerStreamed');
            createLabelColorPair('Scheduled Videos and Upcoming Live Streams:', 'videosAgeColorPickerUpcoming');
            createLabelColorPair('Details Sections of Watch Later Videos:', 'WatchLaterColor');

            form.appendChild(videosAgeContainer);

            // on subscriptions page
            const colorCodeVideosOnSubscriptions = document.createElement('label');
            colorCodeVideosOnSubscriptions.innerText = 'Subscriptions Page';
            colorCodeVideosOnSubscriptions.classList.add('button-icons', 'features-text');
            form.appendChild(colorCodeVideosOnSubscriptions);

            const infoColorCodeVideosSubscriptions = document.createElement('small');
            infoColorCodeVideosSubscriptions.innerText = "These settings apply only to the Subscriptions page.\nOn each visit, the newest uploaded video is saved, allowing subsequent visits to highlight and optionally auto-scroll to that video. On first page load, YouTube loads about 84 videos, so highlighting and scrolling apply within this limit.";
            infoColorCodeVideosSubscriptions.classList.add('CentAnni-info-text');
            form.appendChild(infoColorCodeVideosSubscriptions);

            // color picker last seen video
            const lastSeenVideoColor = document.createElement('div');
            lastSeenVideoColor.classList.add('videos-colorpicker-container');

            function createLabelLVColor(labelText, configKey) {
                const row = document.createElement('div');
                row.classList.add('videos-colorpicker-row');

                const label = document.createElement('span');
                label.classList.add('label-style-settings');
                label.innerText = labelText;
                row.appendChild(label);

                const colorPicker = document.createElement('input');
                colorPicker.type = 'color';
                colorPicker.value = USER_CONFIG[configKey];
                colorPicker.name = configKey;
                row.appendChild(colorPicker);

                lastSeenVideoColor.appendChild(row);
            }

            createLabelLVColor('Last Uploaded Video:', 'lastSeenVideoColor');

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
        label.innerText = labelText;
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
        label.innerText = labelText;
        label.className = labelClass;
        label.classList.add('label-style-settings');
        container.appendChild(label);

        const select = document.createElement('div');
        select.classList.add('select-file-naming');
        select.innerText = options[settingValue];
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
            item.innerText = text;
            item.dataset.value = value;

            if (value === settingValue) { item.classList.add('dropdown-item-selected'); }

            item.addEventListener('click', () => {
                const previouslySelected = dropdownList.querySelector('.dropdown-item-selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('dropdown-item-selected');
                }

                item.classList.add('dropdown-item-selected');
                select.innerText = text;
                hiddenSelect.value = value;
                dropdownList.classList.remove('show');
            });

            dropdownList.appendChild(item);
        }

        // open dropdown
        select.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown-list.show').forEach(list => { if (list !== dropdownList) list.classList.remove('show'); });
            dropdownList.classList.toggle('show');
        });

        // close dropdown
        document.addEventListener('click', () => {
            dropdownList.classList.remove('show');
        });

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
        span.innerText = labelText;
        label.appendChild(span);

        container.appendChild(label);
        return container;
    }

    // helper function to create a number input fields
    function createNumberInputField(labelText, settingKey, settingValue) {
        const container = document.createElement('div');
        container.classList.add('number-input-container');

        const label = document.createElement('label');
        label.classList.add('number-input-label');

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.name = settingKey;
        numberInput.value = settingValue;
        numberInput.min = 1;
        numberInput.max = 20;
        numberInput.step = 1;
        numberInput.classList.add('number-input-field');
        label.appendChild(numberInput);

        const span = document.createElement('span');
        span.innerText = labelText;
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
        label.innerText = labelText;
        container.appendChild(label);

        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');

        const leftLabel = document.createElement('span');
        leftLabel.innerText = min;
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
        rightLabel.innerText = max;
        sliderContainer.appendChild(rightLabel);

        const currentValue = document.createElement('span');
        currentValue.innerText = `(${parseFloat(slider.value).toFixed(1)})`;
        sliderContainer.appendChild(currentValue);

        container.appendChild(sliderContainer);

        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value).toFixed(1);
            currentValue.innerText = `(${value})`;
        });

        return container;
    }

    // helper function to create a textarea fields
    function createTextareaField(labelText, settingKey, settingValue, labelClass) {
        const container = document.createElement('chatgpt-prompt');

        const label = document.createElement('label');
        label.innerText = labelText;
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
        label.innerText = labelText;
        row.appendChild(label);

        return row;
    }

    // function to save settings
    async function saveSettings() {
        const form = document.getElementById('yt-transcript-settings-form');
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

        // validate ChatGPT URL
        let targetChatGPTUrl = form.elements.targetChatGPTUrl.value.trim();
        if (targetChatGPTUrl !== '') {
            USER_CONFIG.targetChatGPTUrl = normalizeUrl(targetChatGPTUrl);
        } else { delete USER_CONFIG.targetChatGPTUrl; }

        // validate NotebookLM URL
        let targetNotebookLMUrl = form.elements.targetNotebookLMUrl.value.trim();
        if (targetNotebookLMUrl !== '') {
            USER_CONFIG.targetNotebookLMUrl = normalizeUrl(targetNotebookLMUrl);
        } else { delete USER_CONFIG.targetNotebookLMUrl; }

        // save other settings
        USER_CONFIG.YouTubeTranscriptExporter = form.elements.YouTubeTranscriptExporter.checked;
        USER_CONFIG.fileNamingFormat = form.elements.fileNamingFormat.value;
        USER_CONFIG.includeTimestamps = form.elements.includeTimestamps.checked;
        USER_CONFIG.includeChapterHeaders = form.elements.includeChapterHeaders.checked;
        USER_CONFIG.openSameTab = form.elements.openSameTab.checked;
        USER_CONFIG.preventBackgroundExecution = form.elements.preventBackgroundExecution.checked;
        USER_CONFIG.ChatGPTPrompt = form.elements.ChatGPTPrompt.value;

        // initialize buttonIcons if not already
        USER_CONFIG.buttonIcons = USER_CONFIG.buttonIcons || {};

        // save button icons, removing empty values to use defaults
        const buttonIconDownload = form.elements.buttonIconDownload.value.trim();
        const buttonIconChatGPT = form.elements.buttonIconChatGPT.value.trim();
        const buttonIconNotebookLM = form.elements.buttonIconNotebookLM.value.trim();
        const buttonIconSettings = form.elements.buttonIconSettings.value.trim();

        USER_CONFIG.buttonIcons.download = buttonIconDownload;
        USER_CONFIG.buttonIcons.ChatGPT = buttonIconChatGPT;
        USER_CONFIG.buttonIcons.NotebookLM = buttonIconNotebookLM;
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
            USER_CONFIG.textTransform = subPanelCustomCSS.elements.textTransform.value;
            USER_CONFIG.defaultFontSize = parseFloat(subPanelCustomCSS.elements.defaultFontSize.value);
            USER_CONFIG.videosWatchedOpacity = parseFloat(subPanelCustomCSS.elements.videosWatchedOpacity.value);
            USER_CONFIG.videosHideWatchedGlobal = subPanelCustomCSS.elements.videosHideWatchedGlobal.checked;
            USER_CONFIG.videosPerRow = parseInt(subPanelCustomCSS.elements.videosPerRow.value);
            USER_CONFIG.autoOpenChapters = subPanelCustomCSS.elements.autoOpenChapters.checked;
            USER_CONFIG.autoOpenTranscript = subPanelCustomCSS.elements.autoOpenTranscript.checked;
            USER_CONFIG.transcriptTimestamps = subPanelCustomCSS.elements.transcriptTimestamps.checked;
            USER_CONFIG.displayRemainingTime = subPanelCustomCSS.elements.displayRemainingTime.checked;
            USER_CONFIG.progressBar = subPanelCustomCSS.elements.progressBar.checked;
            USER_CONFIG.hideShorts = subPanelCustomCSS.elements.hideShorts.checked;
            USER_CONFIG.redirectShorts = subPanelCustomCSS.elements.redirectShorts.checked;
            USER_CONFIG.hideAdSlots = subPanelCustomCSS.elements.hideAdSlots.checked;
            USER_CONFIG.hidePayToWatch = subPanelCustomCSS.elements.hidePayToWatch.checked;
            USER_CONFIG.hideFreeWithAds = subPanelCustomCSS.elements.hideFreeWithAds.checked;
            USER_CONFIG.hideMembersOnly = subPanelCustomCSS.elements.hideMembersOnly.checked;
            USER_CONFIG.hideLatestPosts = subPanelCustomCSS.elements.hideLatestPosts.checked;
            USER_CONFIG.videoTabView = subPanelCustomCSS.elements.videoTabView.checked;
            USER_CONFIG.tabViewChapters = subPanelCustomCSS.elements.tabViewChapters.checked;
            USER_CONFIG.hideCommentsSection = subPanelCustomCSS.elements.hideCommentsSection.checked;
            USER_CONFIG.hideVideosSection = subPanelCustomCSS.elements.hideVideosSection.checked;
            USER_CONFIG.playbackSpeed = subPanelCustomCSS.elements.playbackSpeed.checked;
            USER_CONFIG.playbackSpeedValue = parseInt(subPanelCustomCSS.elements.playbackSpeedValue.value);
            USER_CONFIG.defaultQuality = subPanelCustomCSS.elements.defaultQuality.value;
            USER_CONFIG.defaultTranscriptLanguage = subPanelCustomCSS.elements.defaultTranscriptLanguage.value;
            USER_CONFIG.hideVoiceSearch = subPanelCustomCSS.elements.hideVoiceSearch.checked;
            USER_CONFIG.selectionColor = subPanelCustomCSS.elements.selectionColor.checked;
            USER_CONFIG.hideCreateButton = subPanelCustomCSS.elements.hideCreateButton.checked;
            USER_CONFIG.hideNotificationBtn = subPanelCustomCSS.elements.hideNotificationBtn.checked;
            USER_CONFIG.hideNotificationBadge = subPanelCustomCSS.elements.hideNotificationBadge.checked;
            USER_CONFIG.hideOwnAvatar = subPanelCustomCSS.elements.hideOwnAvatar.checked;
            USER_CONFIG.hideRightSidebarSearch = subPanelCustomCSS.elements.hideRightSidebarSearch.checked;
            USER_CONFIG.hideBrandText = subPanelCustomCSS.elements.hideBrandText.checked;
            USER_CONFIG.disablePlayOnHover = subPanelCustomCSS.elements.disablePlayOnHover.checked;
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
            USER_CONFIG.removeScrubber = subPanelCustomCSS.elements.removeScrubber.checked;
            USER_CONFIG.autoTheaterMode = subPanelCustomCSS.elements.autoTheaterMode.checked;
            USER_CONFIG.channelReindirizzare = subPanelCustomCSS.elements.channelReindirizzare.checked;
            USER_CONFIG.channelRSSBtn = subPanelCustomCSS.elements.channelRSSBtn.checked;
            USER_CONFIG.channelPlaylistBtn = subPanelCustomCSS.elements.channelPlaylistBtn.checked;
            USER_CONFIG.playlistDirectionBtns = subPanelCustomCSS.elements.playlistDirectionBtns.checked;
            USER_CONFIG.playlistLinks = subPanelCustomCSS.elements.playlistLinks.checked;
            USER_CONFIG.playlistTrashCan = subPanelCustomCSS.elements.playlistTrashCan.checked;
            USER_CONFIG.commentsNewFirst = subPanelCustomCSS.elements.commentsNewFirst.checked;
            USER_CONFIG.hideFundraiser = subPanelCustomCSS.elements.hideFundraiser.checked;
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
        }

        // save sub panels - color code videos
        if (subPanelColor) {
            USER_CONFIG.colorCodeVideosEnabled = subPanelColor.elements.colorCodeVideosEnabled.checked;
            USER_CONFIG.videosHideWatched = subPanelColor.elements.videosHideWatched.checked;
            USER_CONFIG.videosOldOpacity = parseFloat(subPanelColor.elements.videosOldOpacity.value);
            USER_CONFIG.videosAgeColorPickerNewly = subPanelColor.elements.videosAgeColorPickerNewly.value;
            USER_CONFIG.videosAgeColorPickerRecent = subPanelColor.elements.videosAgeColorPickerRecent.value;
            USER_CONFIG.videosAgeColorPickerLately = subPanelColor.elements.videosAgeColorPickerLately.value;
            USER_CONFIG.videosAgeColorPickerLive = subPanelColor.elements.videosAgeColorPickerLive.value;
            USER_CONFIG.videosAgeColorPickerStreamed = subPanelColor.elements.videosAgeColorPickerStreamed.value;
            USER_CONFIG.videosAgeColorPickerUpcoming = subPanelColor.elements.videosAgeColorPickerUpcoming.value;
            USER_CONFIG.WatchLaterColor = subPanelColor.elements.WatchLaterColor.value;
            USER_CONFIG.lastSeenVideo = subPanelColor.elements.lastSeenVideo.checked;
            USER_CONFIG.lastSeenVideoScroll = subPanelColor.elements.lastSeenVideoScroll.checked;
            USER_CONFIG.lastSeenVideoColor = subPanelColor.elements.lastSeenVideoColor.value;
        }

        // save updated config
        try {
            await GM.setValue('USER_CONFIG', USER_CONFIG);

            // close modal
            document.getElementById('yt-transcript-settings-modal').style.display = 'none';
            showNotification('Settings have been updated!');
            setTimeout(() => { location.reload(); }, 1000);
        } catch (error) {
            showNotification('Error saving new user config!');
            console.error("YouTubeAlchemy: Error saving user configuration:", error);
        }
    }

    // export and import settings
    async function exportSettings() {
        try {
            const scriptVersion = GM.info.script.version;
            const settingsString = JSON.stringify(USER_CONFIG, null, 2);
            const blob = new Blob([settingsString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `YouTube-Alchemy_v${scriptVersion}_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('Settings have been exported.');
            } catch (error) {
                showNotification("Error exporting settings!");
                console.error("YouTubeAlchemy: Error exporting user settings:", error);
            }
    }

    let fileInputSettings;
    async function importSettings() {
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
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        showNotification('Invalid JSON format!');
                    }
                } catch (error) {
                    showNotification('Invalid JSON format!');
                }
            };
            reader.readAsText(file);
        };

        const createOrResetFileInput = () => {
            if (!fileInputSettings) {
            fileInputSettings = document.createElement('input');
            fileInputSettings.type = 'file';
            fileInputSettings.accept = 'application/json';
            fileInputSettings.id = 'fileInputSettings';
            fileInputSettings.style.display = 'none';
            fileInputSettings.addEventListener('change', handleFile);
            document.body.appendChild(fileInputSettings);
            } else {
                fileInputSettings.value = '';
            }
        };

        createOrResetFileInput();
        fileInputSettings.click();
    }

    // function to display a notification for settings change or reset
    function showNotification(message) {
        const overlay = document.createElement('div');
        overlay.classList.add('CentAnni-overlay');

        const modal = document.createElement('div');
        modal.classList.add('notification');
        modal.innerText = message;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        setTimeout(() => { overlay.remove(); }, 1000);
    }

    // function to add the transcript exporter buttons
    function buttonLocation(buttons, callback) {
        const masthead = document.querySelector('#end');
        if (masthead) {
            buttons.forEach(({ id, text, clickHandler, tooltip }) => {

                // button wrapper
                const buttonWrapper = document.createElement('div');
                buttonWrapper.classList.add('button-wrapper');

                // buttons
                const button = document.createElement('button');
                button.id = id;
                button.innerText = text;
                button.classList.add('button-style');
                if (id === 'transcript-settings-button') {
                    button.classList.add('button-style-settings'); }

                button.addEventListener('click', clickHandler);

                // tooltip div
                const tooltipDiv = document.createElement('div');
                tooltipDiv.innerText = tooltip;
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
                masthead.prepend(buttonWrapper);
            });
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const masthead = document.querySelector('#end');
                if (masthead) {
                    obs.disconnect();
                    if (callback) callback();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function addButton() {
        document.querySelectorAll('.button-wrapper').forEach(el => el.remove());

        const buttons = [
            { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Alchemy Settings', ariaLabel: 'YouTube Alchemy Settings.' },
            { id: 'transcript-download-button', text: USER_CONFIG.buttonIcons.download, clickHandler: handleDownloadClick, tooltip: 'Download Transcript as a Text File', ariaLabel: 'Download Transcript as a Text File.' },
            { id: 'transcript-ChatGPT-button', text: USER_CONFIG.buttonIcons.ChatGPT, clickHandler: handleChatGPTClick, tooltip: 'Copy Transcript with a Prompt and Open ChatGPT', ariaLabel: 'Copy Transcript to Clipboard with a Prompt and Open ChatGPT.' },
            { id: 'transcript-NotebookLM-button', text: USER_CONFIG.buttonIcons.NotebookLM, clickHandler: handleNotebookLMClick, tooltip: 'Copy Transcript and Open NotebookLM', ariaLabel: 'Copy Transcript to Clipboard and Open NotebookLM.' }
        ];

        const buttonsToAdd = buttons.filter(button => button.id === 'transcript-settings-button' || (button.text && button.text.trim() !== ''));
        buttonLocation(buttonsToAdd, addButton);
    }

    function addSettingsButton() {
        document.querySelectorAll('.button-wrapper').forEach(el => el.remove());
        const buttons = [ { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Alchemy Settings', ariaLabel: 'YouTube Alchemy Settings.' }, ];
        buttonLocation(buttons, addSettingsButton);
    }

    // functions to handle the button clicks
    function handleChatGPTClick() { handleTranscriptAction(function() { selectAndCopyTranscript('ChatGPT'); }); }
    function handleNotebookLMClick() { handleTranscriptAction(function() { selectAndCopyTranscript('NotebookLM'); }); }
    function handleDownloadClick() { handleTranscriptAction(downloadTranscriptAsText); }

    // function to check for a transcript
    function handleTranscriptAction(callback) {

        // check if the transcript button exists or at least the div
        const transcriptButton = document.querySelector('#button-container button[aria-label="Show transcript"]');
        if (transcriptButton) {
        } else {
            const transcriptSection = document.querySelector('ytd-video-description-transcript-section-renderer');
            if (transcriptSection) {
            } else {
                alert('Transcript unavailable or cannot be found.\nEnsure the "Show transcript" button exists.\nReload this page to try again.');
                console.log("YouTubeAlchemy: Transcript button not found. Subtitles or closed captions are unavailable or language is unsupported. Reload this page to try again.");
                return;
            }
        }

        // check if the transcript has loaded
        const transcriptItems = document.querySelectorAll('ytd-transcript-segment-list-renderer ytd-transcript-segment-renderer');
        if (transcriptItems.length > 0) {
            callback();
        } else {
            alert('Transcript has not loaded successfully.\nReload this page to try again.');
            console.log("YouTubeAlchemy: Transcript has not loaded.");
            return;
        }
    }

    // function to get video information
    function getVideoInfo() {
        //const ytTitle = document.querySelector('#title yt-formatted-string')?.textContent.trim() || 'N/A';
        const ytTitle = document.querySelector('div#title h1 > yt-formatted-string')?.textContent.trim() || 'N/A';
        //const channelName = document.querySelector('ytd-channel-name#channel-name yt-formatted-string#text a')?.textContent.trim() || 'N/A';
        const channelName = document.querySelector( 'ytd-video-owner-renderer ytd-channel-name#channel-name yt-formatted-string#text a' )?.textContent.trim() || 'N/A';
        const uploadDate = document.querySelector('ytd-video-primary-info-renderer #info-strings yt-formatted-string')?.textContent.trim() || 'N/A';
        const videoURL = window.location.href;

        return { ytTitle, channelName, uploadDate, videoURL };
    }

    // function to get the transcript text
    function getTranscriptText() {
        const transcriptContainer = document.querySelector('ytd-transcript-segment-list-renderer #segments-container');
        if (!transcriptContainer) {
            //console.error("YouTubeAlchemy: Transcript container not found.");
            return '';
        }

        const transcriptElements = transcriptContainer.children;
        let transcriptLines = [];

        Array.from(transcriptElements).forEach(element => {
            if (element.tagName === 'YTD-TRANSCRIPT-SECTION-HEADER-RENDERER') {

                // chapter header segment
                if (USER_CONFIG.includeChapterHeaders) {
                    const chapterTitleElement = element.querySelector('h2 > span');
                    if (chapterTitleElement) {
                        const chapterTitle = chapterTitleElement.textContent.trim();
                        transcriptLines.push(`\nChapter: ${chapterTitle}`);
                    }
                }
            } else if (element.tagName === 'YTD-TRANSCRIPT-SEGMENT-RENDERER') {

                // transcript segment
                const timeElement = element.querySelector('.segment-timestamp');
                const textElement = element.querySelector('.segment-text');
                if (timeElement && textElement) {
                    const time = timeElement.textContent.trim();
                    const text = textElement.innerText.trim();
                    if (USER_CONFIG.includeTimestamps) {
                        transcriptLines.push(`${time} ${text}`);
                    } else { transcriptLines.push(`${text}`); }
                }
            }
        });

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
        } else if (target === 'NotebookLM') {
            finalText = `Information about the YouTube Video:\nTitle: ${ytTitle}\nChannel: ${channelName}\nUpload Date: ${uploadDate}\nURL: ${videoURL}\n\n\nYouTube Transcript:\n${transcriptText.trimStart()}`;
            targetUrl = USER_CONFIG.targetNotebookLMUrl;
        }

        navigator.clipboard.writeText(finalText).then(() => {
            showNotification('Transcript copied. Opening website . . .');
            if (USER_CONFIG.openSameTab) { window.open(targetUrl, '_self');
            } else { window.open(targetUrl, '_blank'); }
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
        document.body.appendChild(a);
        a.click();

        // clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('File has been downloaded.');
    }

    // function to preload the transcript
    function preLoadTranscript() {
        return new Promise((resolve, reject) => {
            document.querySelectorAll('.button-wrapper').forEach(el => el.remove());
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
            notification.classList.add("notification-error", "loading");
            const textSpan = document.createElement("span");
            textSpan.textContent = "Transcript Is Loading";
            notification.appendChild(textSpan);
            masthead.prepend(notification);

            if (!USER_CONFIG.autoOpenTranscript) {
                transcriptPanel.classList.add("transcript-preload");
                transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
            }

            let loaded = false;

            const observer = new MutationObserver(() => {
                const transcriptItems = transcriptPanel.querySelectorAll("ytd-transcript-segment-renderer");
                if (transcriptItems.length > 0) {
                    loaded = true;
                    cleanup(false);
                    clearTimeout(fallbackTimer);
                    observer.disconnect();
                    if (USER_CONFIG.transcriptTimestamps) enableTimestamps();
                    if (USER_CONFIG.defaultTranscriptLanguage !== 'auto') setTimeout(() => { setTranscriptLanguage(); }, 250);
                    resolve();
                }
            });

            observer.observe(transcriptPanel, { childList: true, subtree: true });

            const fallbackTimer = setTimeout(() => {
                if (!loaded) {
                    console.error("YouTubeAlchemy: The transcript took too long to load. Reload this page to try again.");
                    observer.disconnect();
                    cleanup(true);
                    reject();
                }
            }, 10000);

            function cleanup(failed) {
                notification.remove();
                if (!USER_CONFIG.autoOpenTranscript) {
                    transcriptPanel.classList.remove("transcript-preload");
                    transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
                }
                if (failed) { showNotificationError("Transcript Failed to Load"); }
            }
        });
    }

    // function to display a notification if transcript cannot be found
    function showNotificationError(message) {
        const masthead = document.querySelector('#end');
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('notification-error');

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

    // set default transcript language
    function setTranscriptLanguage() {
        // define language mapping
        const languageMap = {
            'english': { english: 'English', native: 'English', englishTranslation: 'English' },
            'spanish': { english: 'Spanish', native: 'Español', englishTranslation: 'Inglés' },
            'hindi': { english: 'Hindi', native: 'हिन्दी', englishTranslation: 'अंग्रेज़ी' },
            'portuguese': { english: 'Portuguese', native: 'Português', englishTranslation: 'Inglês' },
            'german': { english: 'German', native: 'Deutsch', englishTranslation: 'Englisch' },
            'french': { english: 'French', native: 'Français', englishTranslation: 'Anglais' },
            'italian': { english: 'Italian', native: 'Italiano', englishTranslation: 'Inglese' },
            'dutch': { english: 'Dutch', native: 'Nederlands', englishTranslation: 'Engels' },
            'polish': { english: 'Polish', native: 'Polski', englishTranslation: 'Angielski' },
            'hebrew': { english: 'Hebrew', native: 'עברית', englishTranslation: 'אנגלית' }
        };

        // find the menu trigger that displays the current language and check for active language
        const menuTrigger = document.querySelector('tp-yt-paper-button#label');
        const labelTextEl = document.querySelector('#label-text');
        if (!menuTrigger || !labelTextEl) return;

        const preferredEnglish = languageMap[USER_CONFIG.defaultTranscriptLanguage].english;
        const preferredNative = languageMap[USER_CONFIG.defaultTranscriptLanguage].native;
        const currentText = labelTextEl.textContent.trim();
        if (currentText.includes(preferredEnglish) || currentText.includes(preferredNative)) return;

        // gather all language options and run it against preferred with english as a fallback
        const itemsArray = Array.from(document.querySelectorAll('tp-yt-paper-item'));
        const preferredOptionEnglish = itemsArray.find(item => item.textContent.includes(preferredEnglish));
        const preferredOptionNative = itemsArray.find(item => item.textContent.includes(preferredNative));
        const englishTranslations = Object.values(languageMap).map(lang => lang.englishTranslation);
        const englishFallback = itemsArray.find(item => englishTranslations.some(translation => item.textContent.includes(translation)) );

        // select first non-null option in order of preference
        const optionToClick = preferredOptionNative || preferredOptionEnglish || englishFallback;
        if (optionToClick) optionToClick.click();
    }

    // function tab view on video page
    function tabView() {
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (!watchFlexy) return;

        let timestampsEnabled = false;
        let lastActiveTab = null;
        let currentActiveTab = null;
        let isFirstRun = true;
        let tabElements = [];
        let subheaderDiv;

        // helper function to determine the default tab
        // priority: transcript > chapters > info
        function determineActiveTab() {
            let activeTabId = 'tab-1';
            if (USER_CONFIG.autoOpenTranscript) { const tab5 = document.querySelector('[data-tab="tab-5"]'); if (tab5) return 'tab-5'; }
            if (USER_CONFIG.autoOpenChapters) { const tab4 = document.querySelector('[data-tab="tab-4"]'); if (tab4) return 'tab-4'; }
            return activeTabId;
        }

        // helper function active tab
        function activateTab(tabId) {
            const tab = document.querySelector(`[data-tab="${tabId}"]`);
            if (tab) tab.classList.add('active');
            currentActiveTab = tabId;
        }

        // function to update tabView based on player layout
        function updateTabView() {
            const isTheater = watchFlexy.hasAttribute('theater');
            const isDefault = watchFlexy.hasAttribute('default-layout');

            // if no mode change do nothing
            if ((isTheater && isTheaterMode === true) || (isDefault && isTheaterMode === false)) {
                if (isFirstRun && isTheaterMode) {
                    if (subheaderDiv) subheaderDiv.addEventListener('click', handleTabViewTabClick);
                    isFirstRun = false;
                } else if (isFirstRun && !isTheaterMode) isFirstRun = false;
            }

            if (isTheater) {
                isTheaterMode = true;

                const activeTab = document.querySelector('.CentAnni-tabView-tab.active');
                if (activeTab) lastActiveTab = activeTab.dataset.tab;

                const tabs = document.querySelectorAll('.CentAnni-tabView-tab');
                tabs.forEach(tab => tab.classList.remove('active'));
                currentActiveTab = null;

                if (subheaderDiv) subheaderDiv.addEventListener('click', handleTabViewTabClick);
            } else if (isDefault) {
                isTheaterMode = false;
                if (lastActiveTab) activateTab(lastActiveTab);
                else activateTab(determineActiveTab());

                subheaderDiv.removeEventListener('click', handleTabViewTabClick);
            }
        }

        // mode change, navigation, and clean up
        document.addEventListener('yt-set-theater-mode-enabled', updateTabView);
        document.addEventListener('yt-navigate-start', () => {
            tabElements = [];
            subheaderDiv.removeEventListener('click', handleTabViewTabClick);
            document.removeEventListener('yt-set-theater-mode-enabled', updateTabView);
            tabElements.forEach(tab => { tab.element.removeEventListener('click', tab.handler); });
            if (videoInfoTimeoutId) { clearTimeout(videoInfoTimeoutId); videoInfoTimeoutId = null; }
            document.querySelectorAll('.CentAnni-tabView-tab').forEach(tab => tab.classList.remove('active') );
            if (hasTranscriptPanel) transcriptPanel.remove();
            if (hasChapterPanel) chapterPanel.remove();
        });

        // click listener for tabView buttons
        function handleTabViewTabClick(event) {
            const tab = event.target.closest('.CentAnni-tabView-tab');
            if (!tab || !isTheaterMode) return;
            lastActiveTab = tab.dataset.tab;
            toggleTheaterMode();
        }

        // include date in info text under videos unless live
        const infoContainer = document.querySelector('#info-container');
        const infoTime = infoContainer?.querySelector('yt-formatted-string span.bold:nth-child(3)');

        if (!isLiveVideo) {
            if (infoTime) {
                if (!infoTime.parentNode?.querySelector('.CentAnni-info-date')) {
                    const dateStringElement = document.querySelector('#info-strings yt-formatted-string');
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
        const secondaryElement = watchFlexy.querySelector('#secondary');
        if (!secondaryElement) return;

        // grab the info, chapter, and transcript panels and open one by default
        const selector = 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]';
        let videoInfo = document.querySelector(selector);
        let videoInfoTimeoutId;
        if (!videoInfo) {
            videoInfoTimeoutId = setTimeout(() => {
                videoInfo = document.querySelector(selector);
                videoInfoTimeoutId = null;
            }, 2000);
        }

        if (USER_CONFIG.autoOpenTranscript && transcriptPanel) {
            transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
            if (!USER_CONFIG.YouTubeTranscriptExporter && !timestampsEnabled && USER_CONFIG.transcriptTimestamps) { waitForTranscriptWithoutYTE(enableTimestamps); timestampsEnabled = true; }
            if (USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); });
        }
        else if (USER_CONFIG.autoOpenChapters && chapterPanel) chapterPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
        else if (videoInfo) videoInfo.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');

        const clipPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-clip-create"]');
        if (clipPanel && clipPanel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
            clipPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
        }

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
            ...(document.querySelector('ytd-donation-shelf-renderer') && !USER_CONFIG.hideFundraiser ? ['Donation'] : []),
            'Videos',
            ...((!isLiveVideo && hasChapterPanel) ? ['Chapters'] : []),
            ...((!isLiveVideo && hasTranscriptPanel) ? ['Transcript'] : []),
        ];

        // define the IDs
        const tabIds = {
            'Info': 'tab-1',
            'Comments': 'tab-2',
            'Playlist': 'tab-6',
            'Donation': 'tab-9',
            'Videos': 'tab-3',
            'Chapters': 'tab-4',
            'Transcript': 'tab-5'
        };

        // create content sections tabs
        const contentSections = [];
        tabs.forEach((tabText, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('CentAnni-tabView-content');
            contentDiv.id = tabIds[tabText];
            if (index === 0) {
                contentDiv.classList.add('active');
                currentActiveTab = tabIds[tabText];
            }
            contentSections.push(contentDiv);
        });

        // populate the comments sections
        const videoComments = document.querySelector('ytd-comments#comments');
        if (videoComments && contentSections[1]) contentSections[1].appendChild(videoComments);

        // create each tab link and add click behavior
        tabs.forEach((tabText, index) => {
            const tabLink = document.createElement('a');
            tabLink.classList.add('CentAnni-tabView-tab');
            tabLink.textContent = tabText;
            tabLink.href = `#${tabIds[tabText]}`;
            tabLink.dataset.tab = tabIds[tabText];

            const tabClickHandler = (event) => {
                event.preventDefault();

                // if clicked tab is active enter theater mode
                if (currentActiveTab === tabIds[tabText] && !isTheaterMode) {
                    event.stopPropagation();
                    toggleTheaterMode();
                    return;
                } else currentActiveTab = tabIds[tabText];

                // remove 'active' from all tabs
                document.querySelectorAll('.CentAnni-tabView-tab').forEach(tab => tab.classList.remove('active'));

                // mark clicked one as active
                tabLink.classList.add('active');

                // hide all content sections
                document.querySelectorAll('.CentAnni-tabView-content').forEach(content => {
                    content.classList.remove('active');
                });

                // show the target content section
                const targetDiv = document.querySelector(`#${tabIds[tabText]}`);
                if (targetDiv) targetDiv.classList.add('active');

                // info panel
                if (videoInfo) videoInfo.setAttribute('visibility', tabText === 'Info' ? 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' : 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');

                // playlist container
                if (hasPlaylistPanel) {
                    if (tabText === 'Playlist') {
                        playlistPanel.classList.add('CentAnni-tabView-content-active');
                        playlistPanel.classList.remove('CentAnni-tabView-content-hidden');
                        if (playlistSelectedVideo) setTimeout(() => { playlistSelectedVideo.scrollIntoView({ behavior: 'instant', block: 'center' }); },25);
                    } else {
                        playlistPanel.classList.add('CentAnni-tabView-content-hidden');
                        playlistPanel.classList.remove('CentAnni-tabView-content-active');
                    }
                }

                // donation-shelf
                const donationShelf = watchFlexy.querySelector('#donation-shelf');
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
                const videoMore = document.querySelector('#related.style-scope.ytd-watch-flexy');
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
                if (chapterPanel) chapterPanel.setAttribute('visibility', tabText === 'Chapters' ? 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED' : 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');

                // transcript panel
                if (transcriptPanel) {
                    if (tabText === 'Transcript') {
                        transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
                        if (!USER_CONFIG.YouTubeTranscriptExporter && !timestampsEnabled && USER_CONFIG.transcriptTimestamps) { waitForTranscriptWithoutYTE(enableTimestamps); timestampsEnabled = true; }
                        if (USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); });
                    } else transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
                }
            };

            tabElements.push({ element: tabLink, handler: tabClickHandler });
            tabLink.addEventListener('click', tabClickHandler);
            subheaderDiv.appendChild(tabLink);
        });

        headerDiv.appendChild(subheaderDiv);
        newDiv.appendChild(headerDiv);
        contentSections.forEach(section => newDiv.appendChild(section));

        const oldDiv = document.querySelector(".CentAnni-tabView");
        if (oldDiv) oldDiv.replaceWith(newDiv);
        else secondaryElement.insertBefore(newDiv, secondaryElement.firstChild);

        // add chapter titles under videos
        function chapterTitles() {
            const fullscreenContainer = document.querySelector('#movie_player > div.ytp-chrome-bottom');
            const titleElement = document.querySelector('ytd-watch-flexy .ytp-chapter-container');
            const normalContainer = document.querySelector('ytd-watch-flexy #description');
            if (!fullscreenContainer || !titleElement || !normalContainer) return;

            const parent = titleElement.parentNode;
            parent.removeChild(titleElement);

            const containerChapterTitle = document.createElement('div');
            containerChapterTitle.classList.add('CentAnni-chapter-title', 'bold', 'style-scope', 'yt-formatted-string');

            const label = document.createElement('span');
            label.textContent = 'Chapter:';

            containerChapterTitle.appendChild(label);
            containerChapterTitle.appendChild(titleElement);

            const existingContainerChapterTitle = document.querySelector('.CentAnni-chapter-title');
            if (existingContainerChapterTitle) existingContainerChapterTitle.replaceWith(containerChapterTitle);
            else normalContainer.appendChild(containerChapterTitle);

            const updateContainer = () => {
                const currentContainer = document.querySelector('.CentAnni-chapter-title');
                const targetContainer = document.getElementById('movie_player')?.classList.contains('ytp-fullscreen')
                    ? fullscreenContainer
                    : normalContainer;

                if (currentContainer) targetContainer.appendChild(currentContainer);
                else targetContainer.appendChild(containerChapterTitle);
            };

            function handleFullscreenChangeCT() { updateContainer(); }
            document.removeEventListener('fullscreenchange', handleFullscreenChangeCT);
            document.addEventListener('fullscreenchange', handleFullscreenChangeCT);
        }

        updateTabView();
        if (USER_CONFIG.tabViewChapters) chapterTitles();
    }

    // function to hide the 'X Products' span
    function hideProductsSpan() {
        const spans = document.querySelectorAll('yt-formatted-string#info > span');
        spans.forEach(span => {
            if (span.textContent.includes('products')) {
                span.style.display = 'none';
            }
        });
    }

    // playback speed functions
    function initialSpeed() {
        document.removeEventListener('yt-player-updated', initialSpeed);

        const video = document.querySelector('video.html5-main-video[style]');
        if (!video) return;

        if (USER_CONFIG.VerifiedArtist) {
            const isMusicMeta = document.querySelector('meta[itemprop="genre"][content="Music"]');
            const isMusicVideoTag = document.querySelector('ytd-badge-supported-renderer .badge-style-type-verified-artist');
            if (isMusicMeta && isMusicVideoTag) { video.playbackRate = 1; return; }
        }

        if (new URL(window.location.href).pathname.startsWith('/shorts/')) video.playbackRate = lastUserRate !== null ? lastUserRate : defaultSpeed;
        else if (document.querySelector('.ytp-time-display')?.classList.contains('ytp-live')) video.playbackRate = 1;
        else video.playbackRate = defaultSpeed;
    }

    // controller
    function createPlaybackSpeedController(options = {}) {
        const { videoSelector = 'video.html5-main-video[style]' } = options;
        const MIN_SPEED = 0.25;
        const MAX_SPEED = 17;
        const STEP_SIZE = 0.25;

        const video = document.querySelector(videoSelector);
        if (!video) return null;

        function updateSpeedDisplay() {
            const speedDisplay = document.getElementById("CentAnni-speed-display");
            if (speedDisplay && video) speedDisplay.textContent = `${video.playbackRate}x`;
        }

        // set playback speed and update display
        function setSpeed() {
            ignoreRateChange = true;
            const clamped = Math.max(MIN_SPEED, Math.min(MAX_SPEED, video.playbackRate));
            video.playbackRate = clamped;
            video.mozPreservesPitch = video.webkitPreservesPitch = video.preservePitch = true;

            updateSpeedDisplay();
            lastUserRate = video.playbackRate;
            if (speedNotification) showSpeedNotification(video.playbackRate);
        }

        // initial speed setting
        function initializeSpeed() {
            if (isShortPage) { video.playbackRate = lastUserRate !== null ? lastUserRate : defaultSpeed; }
            else if ((USER_CONFIG.VerifiedArtist && isMusicVideo) || isLiveVideo || isLiveStream) video.playbackRate = 1;
            else video.playbackRate = defaultSpeed;

            video.addEventListener('ratechange', updateSpeedDisplay);
            setSpeed();
            speedNotification = true;
        }

        // handle rate change events
        function onRateChange() {
            if (ignoreRateChange) { ignoreRateChange = false; return; }
            else video.playbackRate = lastUserRate;
        }

        // keyboard control handler
        function playbackSpeedKeyListener(event) {
            const key = event.key.toLowerCase();
            const isValidKey = ['a', 's', 'd'].includes(key);
            const isTextInput = [
                'input',
                'textarea',
                'select',
                'contenteditable'
            ].includes(event.target.tagName.toLowerCase()) || event.target.isContentEditable;

            if (!video || !isValidKey || isTextInput) return;

            switch (key) {
                case 's':
                    video.playbackRate = (video.playbackRate !== 1 ? 1 : defaultSpeed);
                    setSpeed();
                    break;
                case 'a':
                    video.playbackRate = video.playbackRate - STEP_SIZE;
                    setSpeed();
                    break;
                case 'd':
                    video.playbackRate = video.playbackRate + STEP_SIZE;
                    setSpeed();
                    break;
            }
        }

        // setup event listeners
        function setupEventListeners() {
            video.addEventListener('ratechange', onRateChange);
            window.addEventListener('keydown', playbackSpeedKeyListener);

            // clean up event listeners on navigation
            document.addEventListener('yt-navigate-start', () => {
                window.removeEventListener('keydown', playbackSpeedKeyListener);
                video.removeEventListener('ratechange', updateSpeedDisplay);
                video.removeEventListener('ratechange', onRateChange);
                speedNotification = false;
            });
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
        // wait for menu renderer
        const menuRendererSelector = 'ytd-watch-flexy #primary #top-row #top-level-buttons-computed';
        let menuRenderer = document.querySelector(menuRendererSelector);

        if (!menuRenderer) {
            await new Promise((resolve) => {
                const observer = new MutationObserver((mutations, obs) => {
                    if ((menuRenderer = document.querySelector(menuRendererSelector))) {
                        clearTimeout(timeout);
                        obs.disconnect();
                        resolve();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                const timeout = setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 5000);
            });

            if (!menuRenderer) return;
        }

        // create controller
        const controller = createPlaybackSpeedController();
        if (!controller) return;
        const { video, setSpeed, STEP_SIZE } = controller;

        // create container for buttons, display speed, and icon
        const oldControlDiv = document.getElementById("CentAnni-playback-speed-control");
        if (menuRenderer) {
            const controlDiv = document.createElement("div");
            controlDiv.id = "CentAnni-playback-speed-control";
            controlDiv.classList.add(
                "CentAnni-playback-control",
                "top-level-buttons",
                "style-scope",
                "ytd-menu-renderer"
            );

            // create the SVG icon
            const iconDiv = document.createElement("div");
            iconDiv.className = "CentAnni-playback-speed-icon";

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("fill", "none");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "24");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z");
            path.setAttribute("fill", "whitesmoke");

            svg.appendChild(path);
            iconDiv.appendChild(svg);
            controlDiv.appendChild(iconDiv);

            // display the speed
            const speedDisplay = document.createElement("span");
            speedDisplay.id = "CentAnni-speed-display";
            speedDisplay.classList.add(
                "CentAnni-playback-speed-display",
                "animated-rolling-number-wiz"
            );
            speedDisplay.textContent = video ? `${video.playbackRate}x` : `${defaultSpeed}x`;

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

            if (oldControlDiv) oldControlDiv.replaceWith(controlDiv);
            else menuRenderer.children[0].after(controlDiv);
        }
    }

    // playback speed notification
    function showSpeedNotification(speed) {
        if (!isVideoPage && !isShortPage) return;
        const fullscreenContainer = document.querySelector('#movie_player');
        let notification = document.getElementById('CentAnni-playback-speed-popup');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'CentAnni-playback-speed-popup';
            if (!isFullscreen) document.body.appendChild(notification);
            else fullscreenContainer.appendChild(notification);
        }

        notification.textContent = `${speed}x`;
        notification.classList.add('active');

        if (hideNotificationTimeout) clearTimeout(hideNotificationTimeout);
        hideNotificationTimeout = setTimeout(() => {
            notification.classList.remove('active');
        }, 1000);

        if (isFullscreen) fullscreenContainer.appendChild(notification);
        else document.body.appendChild(notification);
    }

    // function to display the remaining time based on playback speed minus SponsorBlock segments
    function remainingTime() {
        const fullscreenContainer = document.querySelector('#movie_player > div.ytp-chrome-bottom');
        const normalContainer = document.querySelector('#columns #primary #below');
        const STREAM_SELECTOR = '.video-stream.html5-main-video';

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

        const updateContainer = () => {
            const currentContainer = document.querySelector('.CentAnni-remaining-time-container');
            const targetContainer = document.getElementById('movie_player')?.classList.contains('ytp-fullscreen')
                ? fullscreenContainer
                : normalContainer;

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
        const video = document.querySelector(STREAM_SELECTOR);
        if (video) {
            if (!video.paused && !video.ended && video.readyState > 2) remainingTimeMinusSponsorBlockSegments();
            else video.addEventListener('playing', remainingTimeMinusSponsorBlockSegments, { once: true });
        }

        // calculates and displays remaining time while accounting for SponsorBlock segments
        function remainingTimeMinusSponsorBlockSegments() {
            let baseEffective = NaN;
            let cachedSegments = null;
            let lastVideoTime = -1;
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

            function computeAddedTime(segments, currentTime) {
                let sum = 0;
                segments.forEach(seg => {
                    if (currentTime >= seg.start - 0.001) {
                        sum += seg.duration;
                    }
                });
                return Math.round(sum * 1000) / 1000;
            }

            // debounce the update to prevent excessive updates
            let animationFrameId = null;
            video.ontimeupdate = () => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);

                animationFrameId = requestAnimationFrame(() => {
                    ensureBaseEffectiveIsValid();
                    if (isNaN(baseEffective)) return;

                    const rawDuration = video.duration;
                    const currentTime = video.currentTime;

                    if (Math.abs(currentTime - lastVideoTime) < 0.2) {
                        animationFrameId = null;
                        return;
                    }

                    lastVideoTime = currentTime;

                    const playbackRate = video.playbackRate;
                    const rawSegments = getSegments(rawDuration);
                    const segments = mergeSegments(rawSegments);
                    const addedTime = computeAddedTime(segments, currentTime);
                    const effectiveTotal = baseEffective + addedTime;
                    const remaining = (effectiveTotal - currentTime) / playbackRate;
                    const watchedPercent = rawDuration ? Math.round((currentTime / rawDuration) * 100) + '%' : '0%';
                    const totalFormatted = formatTime(baseEffective);
                    const elapsedFormatted = formatTime(currentTime);
                    const remainingFormatted = formatTime(remaining);

                    textNode.data = `total: ${totalFormatted} | elapsed: ${elapsedFormatted} — watched: ${watchedPercent} — remaining: ${remainingFormatted} (${playbackRate}x)`;

                    animationFrameId = null;
                });
            };
        }
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
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        const player = watchFlexy?.querySelector('.html5-video-player');
        const video = player?.querySelector('video[src]');
        const chaptersContainer = player && player.querySelector('.ytp-chapters-container');
        const progressBarContainer = player && player.querySelector('.ytp-progress-bar-container');

        if (!player || !video || !progressBarContainer ) { console.error("YouTubeAlchemy: ProgressBar: A Required querySelector Not Found."); return; }

        document.documentElement.classList.add('progressBar');

        const bar = document.createElement('div');
        bar.id = 'progress-bar-bar';

        const progress = document.createElement('div');
        progress.id = 'progress-bar-progress';

        const buffer = document.createElement('div');
        buffer.id = 'progress-bar-buffer';

        const startDiv = document.createElement('div');
        startDiv.id = 'progress-bar-start';

        const endDiv = document.createElement('div');
        endDiv.id = 'progress-bar-end';

        player.appendChild(bar);
        bar.appendChild(buffer);
        bar.appendChild(progress);
        player.appendChild(startDiv);
        player.appendChild(endDiv);

        progress.style.transform = 'scaleX(0)';

        // live stream check
        if (isLiveVideo) {
            bar.classList.remove('active');
            startDiv.classList.remove('active');
            endDiv.classList.remove('active');
        } else {
            bar.classList.add('active');
            startDiv.classList.add('active');
            endDiv.classList.add('active');
        }

        let animationFrameId;
        function animateProgress() {
            const fraction = video.currentTime / video.duration;
            progress.style.transform = `scaleX(${fraction})`;
            animationFrameId = requestAnimationFrame(animateProgress);
        }
        animationFrameId = requestAnimationFrame(animateProgress);

        function renderBuffer() {
            for (let i = video.buffered.length - 1; i >= 0; i--) {
                if (video.currentTime < video.buffered.start(i)) continue;
                buffer.style.transform = `scaleX(${video.buffered.end(i) / video.duration})`;
                break;
            }
        }

        video.addEventListener('progress', renderBuffer);
        video.addEventListener('seeking', renderBuffer);

        // chapters container
        let previousChaptersLength = 0;
        let cachedMaskImage = null;

        function updateLayout() {
            const initialWidth = progressBarContainer.getBoundingClientRect().width;

            let attempts = 0;
            const maxAttempts = 6;

            const waitForSizeChange = new Promise((resolve) => {
                const intervalId = setInterval(() => {
                    const currentWidth = progressBarContainer.getBoundingClientRect().width;

                    if (currentWidth !== initialWidth) { clearInterval(intervalId); resolve(); }
                    else if (++attempts >= maxAttempts) { clearInterval(intervalId); resolve(); }
                }, 250);
            });

            waitForSizeChange.then(() => {
                const playerRect = player.getBoundingClientRect();
                const progressBarRect = progressBarContainer.getBoundingClientRect();
                const progressBarWidth = progressBarRect.width;

                bar.style.position = 'absolute';
                bar.style.left = (progressBarRect.left - playerRect.left) + 'px';
                bar.style.width = progressBarWidth + 'px';

                if (chaptersContainer) {
                    const chapters = chaptersContainer.querySelectorAll('.ytp-chapter-hover-container');

                    // Only regenerate SVG if chapters changed
                    if (chapters.length !== previousChaptersLength || !cachedMaskImage) {
                        previousChaptersLength = chapters.length;

                        if (chapters.length) {
                            const svgWidth = 100;
                            const svgHeight = 10;
                            let rects = '';

                            chapters.forEach((chapter) => {
                                const rect = chapter.getBoundingClientRect();
                                const startPx = rect.left - progressBarRect.left;
                                const chapterWidth = rect.width;

                                const startPerc = (startPx / progressBarWidth) * svgWidth;
                                const widthPerc = (chapterWidth / progressBarWidth) * svgWidth;

                                rects += `<rect x="${startPerc}" y="0" width="${widthPerc}" height="${svgHeight}" fill="white"/>`;
                            });

                            const svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
                            const encoded = encodeURIComponent(svg).replace(/%20/g, ' ');
                            cachedMaskImage = `url("data:image/svg+xml;utf8,${encoded}")`;
                        } else {
                            cachedMaskImage = null;
                        }
                    }

                    // Apply mask based on current state
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
            });
        }

        // handle layout changes
        function handleTheaterMode() { updateLayout(); }
        function handleResize() { updateLayout(); }
        document.addEventListener('yt-set-theater-mode-enabled', handleTheaterMode);
        window.addEventListener('resize', handleResize);

        // handle cleanup
        function cleanupProgressBar() {
            document.removeEventListener('yt-set-theater-mode-enabled', handleTheaterMode);
            video.removeEventListener('progress', renderBuffer);
            video.removeEventListener('seeking', renderBuffer);
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationFrameId);
        }
        document.addEventListener('yt-navigate-start', cleanupProgressBar);

        // initialization
        renderBuffer();
        updateLayout();
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
                    document.documentElement.classList.remove('CentAnni-close-live-chat');
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
                    document.documentElement.classList.remove('CentAnni-close-live-chat');
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
                setTimeout(() => { document.documentElement.classList.remove('CentAnni-close-live-chat'); }, 250);
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
        if ( availableQualities.includes('hd1440') || availableQualities.includes('hd2160') || availableQualities.includes('highres') ) qualityUHD = true;

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

        function setVideoQualityPremium() {
            // helper function to handle cleanup and style to hide the settings menu
            function cleanup() {
                document.body.click();
                document.documentElement.classList.remove('CentAnni-style-hide-yt-settings');
            }
            document.documentElement.classList.add('CentAnni-style-hide-yt-settings');

            // recursive function to ensure the quality menu is visible
            function qualityMenuVisible(retryCount = 0) {
                const qualityMenu = document.querySelector('.ytp-settings-menu');
                const isQualityMenuVisible = qualityMenu && window.getComputedStyle(qualityMenu).display !== 'none';

                if (!isQualityMenuVisible) {
                    const settingsButton = document.querySelector('.ytp-settings-button');
                    if (settingsButton) {
                        settingsButton.click();
                        setTimeout(() => {
                            const qualityItem = Array.from(document.querySelectorAll('.ytp-menuitem'))
                                .find(item => item.textContent.includes('Quality'));
                            if (qualityItem) {
                                qualityItem.click();
                                if (retryCount < 5) setTimeout(() => qualityMenuVisible(retryCount + 1), 300);
                                else cleanup();
                            } else cleanup();
                        }, 150);
                    } else cleanup();
                    return;
                }

                // pick 1080p premium with enhanced bitrate
                const enhancedBitrateOption = Array.from(qualityMenu.querySelectorAll('.ytp-menuitem'))
                    .find(item => {
                        const labelEl = item.querySelector('.ytp-menuitem-label');
                        return labelEl && labelEl.innerText.includes('1080p Premium') && labelEl.innerText.includes('Enhanced bitrate');
                    });
                if (enhancedBitrateOption) enhancedBitrateOption.click();
                cleanup();
            }

            qualityMenuVisible();
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
                            element.style.margin = '0';
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
        let processedAllVideos = false;
        // define age categories
        const categories = {
            live: ['watching'],
            // streamed: ['Streamed'],
            upcoming: ['waiting', 'scheduled for'],
            newly: ['1 day ago', 'hours ago', 'hour ago', 'minutes ago', 'minute ago', 'seconds ago', 'second ago'],
            recent: ['1 week ago', '7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago'],
            lately: ['1 month ago', 'weeks ago', '14 days ago', '13 days ago', '12 days ago', '11 days ago', '10 days ago', '9 days ago', '8 days ago'],
            old: ['years ago', '1 year ago', '12 months ago', '11 months ago', '10 months ago', '9 months ago', '8 months ago', '7 months ago']
        };

        const homePage = document.querySelector('ytd-browse[page-subtype="home"]:not([hidden])');
        if (!homePage) return;

        function processVideos() {
            const unprocessedVideos = Array.from(homePage.querySelectorAll('ytd-rich-item-renderer:not([data-centanni-video-processed])'));
            if (unprocessedVideos.length === 0) { processedAllVideos = true; return; }

            unprocessedVideos.forEach(videoContainer => {
                videoContainer.setAttribute('data-centanni-video-processed', 'true');
                const metaBlock = videoContainer.querySelector('#metadata-line');
                if (!metaBlock) return;

                const textContent = metaBlock.textContent.trim().toLowerCase();
                for (const [className, ages] of Object.entries(categories)) {
                    if (ages.some(age => textContent.includes(age.toLowerCase()))) {
                        videoContainer.classList.add(`CentAnni-style-${className}-video`);
                        break;
                    }
                }

                const spanElements = videoContainer.querySelectorAll('span.ytd-video-meta-block');
                spanElements.forEach(el => {
                    const text = el.textContent;

                    if (/Scheduled for/i.test(text) && !videoContainer.classList.contains('CentAnni-style-upcoming-video'))
                        videoContainer.classList.add('CentAnni-style-upcoming-video');

                    if (/Streamed/i.test(text) && !el.querySelector('.CentAnni-style-streamed-text')) {
                        el.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE && /Streamed/i.test(node.nodeValue)) {
                                const span = document.createElement('span');
                                span.className = 'CentAnni-style-streamed-text';
                                span.textContent = node.nodeValue.match(/Streamed/i)[0];
                                const rest = document.createTextNode(node.nodeValue.replace(/Streamed/i, ''));
                                el.replaceChild(rest, node);
                                el.insertBefore(span, rest);
                            }
                        });
                    }
                });
            });
        }

        function runProcessVideos(times, initialDelay, interval, callback) {
            let count = 0;

            function runProcess() {
                processVideos();
                count++;
                if (count < times && !processedAllVideos) setTimeout(runProcess, interval);
                else if (callback) callback();
            }

            setTimeout(runProcess, initialDelay);
        }

        // handle navigation
        const serviceRequestSentHandler = () => { runProcessVideos(3, 1000, 1000, null); };
        const navigateFinishHandler = () => { setTimeout(cleanupAndReprocessVideos, 300); };
        const pageTypeChangedHandler = function() {
            document.removeEventListener('yt-service-request-sent', serviceRequestSentHandler);
            document.removeEventListener('yt-service-request-completed', cleanupAndReprocessVideos);
            document.removeEventListener('yt-navigate-finish', navigateFinishHandler);
            document.removeEventListener('yt-page-type-changed', pageTypeChangedHandler);
        };

        runProcessVideos(6, 250, 500, function() {
            document.addEventListener('yt-service-request-sent', serviceRequestSentHandler);
            document.addEventListener('yt-service-request-completed', cleanupAndReprocessVideos);
            document.addEventListener('yt-navigate-finish', navigateFinishHandler);
            setTimeout(checkProcessVideos, 1250);
        });

        document.addEventListener('yt-page-type-changed', pageTypeChangedHandler);

        // ensure correct categories
        function checkProcessVideos() {
            const processedVideos = Array.from(homePage.querySelectorAll('ytd-rich-item-renderer[data-centanni-video-processed]')).slice(0, 8);
            if (processedVideos.length === 0) return;

            let allCorrect = true;
            for (const video of processedVideos) {
                const metaBlock = video.querySelector('#metadata-line');
                if (!metaBlock) continue;

                const textContent = metaBlock.textContent.trim().toLowerCase();
                let expectedCategory = null;

                for (const [className, ages] of Object.entries(categories)) {
                    if (ages.some(age => textContent.includes(age.toLowerCase()))) {
                        expectedCategory = className;
                        break;
                    }
                }

                const spanElements = video.querySelectorAll('span.ytd-video-meta-block');
                for (const el of spanElements) {
                    if (/Scheduled for/i.test(el.textContent)) {
                        expectedCategory = 'upcoming';
                        break;
                    }
                }

                if (expectedCategory && !video.classList.contains(`CentAnni-style-${expectedCategory}-video`)) {
                    allCorrect = false;
                    break;
                }
            }

            if (!allCorrect) cleanupAndReprocessVideos();
        }

        // handle feed filter 'All' button
        let allButtonObserver = null;
        function handleFeedFilterAll() {
            if (allButtonObserver) return;

            const allButton = document.querySelector('yt-chip-cloud-chip-renderer[chip-shape-data*="All"]');
            if (!allButton) return;

            allButtonObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class' && allButton.classList.contains('iron-selected')) {
                        checkProcessVideos();
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
                'CentAnni-style-old-video',
                'CentAnni-style-streamed-video'
                );

                video.querySelectorAll('.CentAnni-style-streamed-text').forEach(span => span.remove());
                video.removeAttribute('data-centanni-video-processed');
            });

            processVideos();
            handleFeedFilterAll();
            addSettingsButton();
        }
    }

    // mark last seen video on subscription page
    async function markLastSeenVideo() {
        const subscriptionPage = document.querySelector('ytd-browse[page-subtype="subscriptions"]:not([hidden])');
        if (!subscriptionPage) return;

        const videoContainers = subscriptionPage.querySelectorAll('ytd-rich-item-renderer');
        if (!videoContainers.length) return;

        // helper function to check if a video is live or upcoming
        const isSpecialVideo = (container) => {
            if (container.querySelector('.badge-style-type-live-now-alternate') !== null) return true;
            if (container.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]') !== null) return true;

            // backup checks
            const metadataItems = container.querySelectorAll('.inline-metadata-item');
            for (const item of metadataItems) {
                if (item.textContent.includes('Scheduled for') || item.textContent.includes('watching')) {
                    return true;
                }
            }
            return false;
        };

        // helper function to extract video ID
        const extractVideoID = (container) => {
            const mainThumbnail = container.querySelector('ytd-thumbnail a#thumbnail[href*="/watch?v="]');
            if (!mainThumbnail) return null;

            const href = mainThumbnail.getAttribute('href');
            if (!href) return null;

            return new URLSearchParams(href.split('?')[1]).get("v");
        };

        // helper function to find first valid video
        const findFirstValidVideo = (callback) => {
            for (const container of videoContainers) {
                if (isSpecialVideo(container)) continue;
                const videoID = extractVideoID(container);
                if (!videoID) continue;

                const result = callback(container, videoID);
                if (result) return result;
            }
            return null;
        };

        const lastSeenID = localStorage.getItem("CentAnni_lastSeenVideoID");
        let targetElement = null;

        // find last seen video
        const newLastSeenID = findFirstValidVideo((container, videoID) => videoID);
        if (newLastSeenID) localStorage.setItem("CentAnni_lastSeenVideoID", newLastSeenID);

        // find previous seen video
        if (lastSeenID) {
            targetElement = findFirstValidVideo((container, videoID) => {
                if (videoID === lastSeenID) {
                    container.classList.add("CentAnni-style-last-seen");
                    return container;
                }
                return null;
            });
        }

        // scroll to the last seen video
        if (USER_CONFIG.lastSeenVideoScroll && targetElement) {
            requestAnimationFrame(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    // add trashcan icon to playlists to easily remove videos
    function playlistRemovalButtons() {
        const sortButton = document.querySelector('#filter, #filter-menu');
        if (!sortButton) return;

        const playlistPage = document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden])');
        if (!playlistPage) return;

        const playlistContainer = playlistPage.querySelector('#primary > ytd-section-list-renderer > #contents > ytd-item-section-renderer #contents');
        if (!playlistContainer) return;

        // watch for playlist changes
        const playlistObserver = new MutationObserver(() => {
            const videoElements = playlistPage.querySelectorAll('ytd-playlist-video-renderer:not([data-centanni-playlist-video-processed])');
            if (videoElements.length > 0) videoElements.forEach(attachRemoveButtonToVideo);
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
            document.removeEventListener('yt-navigate-start', navigateHandler);
        };
        document.addEventListener('yt-navigate-start', navigateHandler);

        function attachRemoveButtonToVideo(videoEl) {
            if (videoEl.hasAttribute('data-centanni-playlist-video-processed')) return;
            videoEl.setAttribute('data-centanni-playlist-video-processed', 'true');

            const metaContainer = videoEl.querySelector('#meta');
            if (!metaContainer) return;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'CentAnni-style-playlist-remove-btn';
            removeBtn.title = 'Remove from Playlist';
            removeBtn.innerText = '🗑️';
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (removeBtn.classList.contains('removing')) return;
                removeBtn.classList.add('removing');
                simulateVideoRemoval(videoEl)
                    .finally(() => { removeBtn.classList.remove('removing'); });
            });
            metaContainer.appendChild(removeBtn);
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
                        const menuItems = Array.from(document.querySelectorAll('#items > ytd-menu-service-item-renderer'));
                        let removeOption = null;

                        for (const item of menuItems) {
                            const formattedString = item.querySelector('yt-formatted-string');
                            if (formattedString && formattedString.textContent.includes('Remove from')) {
                                removeOption = item;
                                break;
                            }
                        }

                        if (!removeOption) {
                            document.body.click();
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
                        try { document.body.click(); } catch (e) {}
                        if (popupContainer) popupContainer.classList.remove('CentAnni-style-playlist-hide-menu');
                        resolve();
                    });
            });
        }

        function waitForElement(selector, timeout = 700) {
            return new Promise((resolve) => {
                const element = playlistPage.querySelector(selector);
                if (element) return resolve(element);

                const observer = new MutationObserver(() => {
                    const element = playlistPage.querySelector(selector);
                    if (element) {
                        clearTimeout(timer);
                        observer.disconnect();
                        resolve(element);
                    }
                });

                const timer = setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, timeout);

                observer.observe(playlistPage, { childList: true, subtree: true });
            });
        }
    }

    // open playlist videos without being in a playlist
    function handlePlaylistLinks() {
        let processedAllListVideos = false;

        function chromeClickHandler(event) {
            if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                event.stopImmediatePropagation();
                event.preventDefault();
                const cleanUrl = event.currentTarget.getAttribute('CentAnni-chrome-pl-url');
                window.open(cleanUrl, '_self');
            }
        }

        const playlistPage = document.querySelector('ytd-browse[page-subtype="playlist"]:not([hidden])');
        if (!playlistPage) return;

        function processVideos() {
            const unprocessedVideos = Array.from( playlistPage.querySelectorAll('#contents > ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer:not([data-centanni-list-video-processed])'));
            if (unprocessedVideos.length === 0) { processedAllListVideos = true; return; }

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
                                if (!USER_CONFIG.preventBackgroundExecution) link.setAttribute('onclick',`if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey){event.stopPropagation();event.preventDefault();window.location='${cleanUrl}';return!1}return!0`);
                                else {
                                    link.setAttribute('CentAnni-chrome-pl-url', cleanUrl);
                                    link.addEventListener('click', chromeClickHandler, true);
                                }
                            }
                        } catch (e) {
                            console.error('Error processing link:', e);
                        }
                    }
                });
            });
        }

        function runProcessVideos(times, initialDelay, interval, callback) {
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
        const pageTypeChangedHandler = function() {
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

        runProcessVideos(6, 250, 500, function() {
            document.addEventListener('yt-service-request-sent', serviceRequestSentHandler);
        });

        document.addEventListener('yt-navigate-start', pageTypeChangedHandler);
    }

    // RSS feed button on channel page
    function addRSSFeedButton() {
        if (document.getElementById('CentAnni-channel-btn')) return;

        const rssLinkElement = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
        if (!rssLinkElement) return;
        const rssFeedUrl = rssLinkElement.getAttribute('href');

        const actionsContainer = document.querySelector('.yt-flexible-actions-view-model-wiz');
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

        const actionsContainer = document.querySelector('.yt-flexible-actions-view-model-wiz');
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
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (!hasPlaylistPanel && !playlistPanel && !watchFlexy) return;

        let playlistItems;
        let currentVideoIndex;
        let videoAboveInfo;
        let videoBelowInfo;
        let nextButton;
        let cleanupDone = false;
        let playNextBtnStatus = false;
        let ValidDataVideoAbove = false;
        let ValidDataVideoBelow = false;
        let savedDirection = localStorage.getItem('CentAnni_playlistDirection') || 'down';
        let reverseDirection = savedDirection === 'up';

        function getPlaylistInfo() {
            function getVideoThumbnailURL(videoURL) {
                let videoID = null;
                if (videoURL) {
                    const watchMatch = videoURL.match(/[?&]v=([^&#]*)/);
                    if (watchMatch && watchMatch[1]) videoID = watchMatch[1];
                    else {
                        const shortMatch = videoURL.match(/youtu\.be\/([^?&#]*)/);
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
                const thumbnailUrl = getVideoThumbnailURL(href);

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

            playlistItems = Array.from(watchFlexy.querySelectorAll('ytd-playlist-panel-video-renderer'));
            if (!playlistItems || playlistItems.length <= 1) return null;

            currentVideoIndex = playlistItems.indexOf(playlistSelectedVideo);
            if (currentVideoIndex === -1) return null;

            nextButton = watchFlexy.querySelector('.ytp-next-button');

            if (currentVideoIndex > 0) {
                const videoAbove = playlistItems[currentVideoIndex - 1];
                const result = processVideoInfo(videoAbove);
                videoAboveInfo = result.info;
                ValidDataVideoAbove = result.isValid;
            }

            if (currentVideoIndex < playlistItems.length - 1) {
                const videoBelow = playlistItems[currentVideoIndex + 1];
                const result = processVideoInfo(videoBelow);
                videoBelowInfo = result.info;
                ValidDataVideoBelow = result.isValid;
            }

            const success = ValidDataVideoAbove && ValidDataVideoBelow;
            return success;
        }

        function createButtons(reverseDirection) {
            const playlistActionMenu = watchFlexy.querySelector('#playlist-action-menu .top-level-buttons');
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

            const existingContainer = watchFlexy.querySelector('#CentAnni-playlist-direction-container');
            if (existingContainer) existingContainer.replaceWith(directionContainer);
            else playlistActionMenu.appendChild(directionContainer);

            return { upButton, downButton };
        }

        function upNextBtn() {
            if (reverseDirection === playNextBtnStatus || !nextButton) return;
            if (reverseDirection) {
                if (videoAboveInfo) {
                    if (videoAboveInfo.href && videoAboveInfo.thumbnail && videoAboveInfo.title) {
                        nextButton.href = videoAboveInfo.href;
                        nextButton.dataset.preview = videoAboveInfo.thumbnail;
                        nextButton.dataset.tooltipText = videoAboveInfo.title;
                    }

                    nextButton.removeEventListener('click', nextButtonClickHandler, true);
                    nextButton.addEventListener('click', nextButtonClickHandler, true);
                    document.addEventListener('keydown', handleKeyboardShortcut, true);

                    playNextBtnStatus = true;
                }
            } else {
                document.removeEventListener('keydown', handleKeyboardShortcut, true);
                nextButton.removeEventListener('click', nextButtonClickHandler, true);

                if (videoBelowInfo) {
                    if (videoBelowInfo.href && videoBelowInfo.thumbnail && videoBelowInfo.title) {
                        nextButton.href = videoBelowInfo.href;
                        nextButton.dataset.preview = videoBelowInfo.thumbnail;
                        nextButton.dataset.tooltipText = videoBelowInfo.title;
                    }
                }

                playNextBtnStatus = false;
            }
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

        // Handle down button click
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

        const observer = new MutationObserver((mutations) => {
            const selectedItem = watchFlexy.querySelector('ytd-playlist-panel-video-renderer[selected]');
            const nextButton = watchFlexy.querySelector('.ytp-next-button');
            if (selectedItem && nextButton) {
                if (getPlaylistInfo()) {
                    observer.disconnect();
                    setTimeout(() => { upNextBtn(); },1000);
                    return;
                }
            }
        });

        const config = {
            childList: true,
            subtree: true,
        };

        observer.observe(watchFlexy, config);
    }

    // function to prevent autoplay
    function pauseYouTubeVideo() {
        document.removeEventListener('yt-player-updated', pauseYouTubeVideo);

        if ( !/^https:\/\/.*\.youtube\.com\/watch\?v=/.test(window.location.href) || document.querySelector('.ytp-time-display')?.classList.contains('ytp-live') ) return;

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

    // function to sort comments newest first
    function sortCommentsNewFirst() {
        let observationTimeout = null;
        let dropdownTimeout = null;

        // handler for YouTube service requests in tab view mode
        const serviceRequestHandler = function(event) {
            const commentsTab = document.querySelector('.CentAnni-tabView-tab[data-tab="tab-2"]');
            if (commentsTab && commentsTab.classList.contains('active')) {
                document.removeEventListener('yt-service-request-sent', serviceRequestHandler);
                observeCommentSection();
            }
        };

        // comment sorting detection
        function setupCommentSortingDetection() {
            if (USER_CONFIG.videoTabView) document.addEventListener('yt-service-request-sent', serviceRequestHandler);
            else observeCommentSection();
        }

        // observe comment section and detect when it's loaded
        function observeCommentSection() {
            const commentsSection = document.querySelector('ytd-comments#comments');
            if (!commentsSection) {
                if (observationTimeout) clearTimeout(observationTimeout);
                observationTimeout = setTimeout(observeCommentSection, 250);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        const commentsHeader = commentsSection.querySelector('ytd-comments-header-renderer');
                        const sortButton = commentsSection.querySelector('yt-sort-filter-sub-menu-renderer');

                        if (commentsHeader && sortButton) {
                            observer.disconnect();
                            changeSortingToNewestFirst();
                            return;
                        }
                    }
                }
            });

            observer.observe(commentsSection, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }

        // set newest first
        function changeSortingToNewestFirst() {
            const sortButton = document.querySelector('yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button');
            if (sortButton) {
                sortButton.click();

                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                dropdownTimeout = setTimeout(() => {
                    const options = document.querySelectorAll('tp-yt-paper-listbox a.yt-simple-endpoint');
                    let newestFirstOption = null;

                    for (const option of options) {
                        if (option.textContent.toLowerCase().includes('newest')) {
                            newestFirstOption = option;
                            break;
                        }
                    }

                    if (!newestFirstOption && options.length > 1) newestFirstOption = options[1];
                    if (newestFirstOption) newestFirstOption.click();
                }, 200);
            }
        }

        document.addEventListener('yt-navigate-start', () => {
            document.removeEventListener('yt-service-request-sent', serviceRequestHandler);

            if (observationTimeout) {
                clearTimeout(observationTimeout);
                observationTimeout = null;
            }

            if (dropdownTimeout) {
                clearTimeout(dropdownTimeout);
                dropdownTimeout = null;
            }
        });

        setupCommentSortingDetection();
    }

    // theater mode check
    function theaterModeCheck() {
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        isTheaterMode = watchFlexy?.hasAttribute('theater') || false;
    }

    // fullscreen check
    function fullscreenCheck() {
        isFullscreen = document.getElementById('movie_player')?.classList.contains('ytp-fullscreen') || false;
    }

    function musicVideoCheck() {
        isMusicVideo = !!( document.querySelector('meta[itemprop="genre"][content="Music"]') && document.querySelector('ytd-badge-supported-renderer .badge-style-type-verified-artist') );
    }

    // live stream check
    function liveVideoCheck() {
        isLiveVideo = document.querySelector('.ytp-time-display')?.classList.contains('ytp-live') || false;
    }

    // chapter panel check
    function chapterPanelCheck() {
        chapterPanel = document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]' ) || document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]' );
        hasChapterPanel = !!chapterPanel;
    }

    // function to automatically open the chapter panel
    function openChapters() {
        if (hasChapterPanel)
            chapterPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
    }

    // playlist panel check
    function playlistPanelCheck() {
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        const playlistVideoItem = watchFlexy ? watchFlexy.querySelector('ytd-playlist-panel-video-renderer[id="playlist-items"]') : null;
        playlistPanel = watchFlexy ? watchFlexy.querySelector('ytd-playlist-panel-renderer[id="playlist"]') : null;
        hasPlaylistPanel = !!(playlistVideoItem && playlistPanel);
        playlistSelectedVideo = document.querySelector('ytd-playlist-panel-video-renderer[selected]');
    }

    // transcript panel check
    function transcriptPanelCheck() {
        transcriptPanel = document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]' );
        hasTranscriptPanel = !!transcriptPanel;
    }

    // function to automatically open the transcript panel
    function openTranscript() {
        if (hasTranscriptPanel) {
            transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');

            if (USER_CONFIG.defaultTranscriptLanguage !== 'auto' && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(() => { setTimeout(() => { setTranscriptLanguage(); }, 250); });
            if (USER_CONFIG.transcriptTimestamps && !USER_CONFIG.YouTubeTranscriptExporter) waitForTranscriptWithoutYTE(enableTimestamps);
        }
    }

    // transcript enable timestamps
    function enableTimestamps() {
        const transcriptPanelTimestamps = document.querySelector('ytd-transcript-search-panel-renderer[hide-timestamps]');
        if (transcriptPanelTimestamps) transcriptPanelTimestamps.removeAttribute('hide-timestamps');
    }

    // transcript enable timestamps tabview
    function waitForTranscriptWithoutYTE(callback) {
        let transcriptLoadedWithoutYTE = false;

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
        }, 6000);
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
        else document.documentElement.classList.remove('CentAnni-close-live-chat');
    }

    // redirect channel page to videos
    function channelRedirect() {
        window.location.href = window.location.href.replace(/\/$/, '') + '/videos';
    }

    // redirect shorts to video page
    function redirectShortsToVideoPage() {
        window.location.href = window.location.href.replace('/shorts/', '/watch?v=');
    }

    // reset function
    function handleYTNavigation() {
        if (USER_CONFIG.playbackSpeed) document.addEventListener('yt-player-updated', initialSpeed); // set playback speed
        if (USER_CONFIG.preventAutoplay) document.addEventListener('yt-player-updated', pauseYouTubeVideo); // prevent autoplay

        if (USER_CONFIG.videoTabView) {
            document.querySelector('#related.style-scope.ytd-watch-flexy')?.classList.remove('CentAnni-tabView-content-attiva');
            document.querySelector('ytd-playlist-panel-renderer[id="playlist"].style-scope.ytd-watch-flexy')?.classList.remove('CentAnni-tabView-content-active');
        }

        document.querySelectorAll('.button-wrapper:not(:has(#transcript-settings-button)), #CentAnni-channel-btn, .CentAnni-remaining-time-container, .CentAnni-chapter-title, #progress-bar-bar, #progress-bar-start, #progress-bar-end, #yt-transcript-settings-modal').forEach(el => el.remove());
    }

    // initiate the script
    let initializeDelay;
    let ultimoURL = null;
    let lastVideoURL = null;
    let lastVideoID = null;
    let videoURL = null;
    let videoID = null;
    let isHomePage = false;
    let isVideoPage = false;
    let isLiveVideo = false;
    let isLiveStream = false;
    let isShortPage = false;
    let isSubscriptionsPage = false;
    let isPlaylistPage = false;
    let isPlaylistVideoPage = false;
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
    let ignoreRateChange = false;
    let lastUserRate = null;
    let speedNotification = false;
    let hideNotificationTimeout;
    let defaultSpeed = USER_CONFIG.playbackSpeedValue;

    async function initializeAlchemy() {
        if (USER_CONFIG.preventBackgroundExecution) { await chromeUserWait(); }
        buttonsLeftHeader();

        if (isVideoPage || isLiveStream) {
            liveVideoCheck();
            musicVideoCheck();
            fullscreenCheck();
            theaterModeCheck();
            chapterPanelCheck();
            playlistPanelCheck();
            transcriptPanelCheck();
            if (USER_CONFIG.videoTabView) tabView();
            if (USER_CONFIG.hideAdSlots) hideProductsSpan();
            if (USER_CONFIG.playbackSpeed) videoPlaybackSpeed();
            if (USER_CONFIG.commentsNewFirst) sortCommentsNewFirst();
            if (USER_CONFIG.autoTheaterMode && !isTheaterMode) toggleTheaterMode();
            if (USER_CONFIG.closeChatWindow) setTimeout(() => { chatWindowCheck(); }, 500);
            if (USER_CONFIG.playlistDirectionBtns && isPlaylistVideoPage) playlistDirection();
            if (USER_CONFIG.progressBar && !isLiveVideo && !isLiveStream) keepProgressBarVisible();
            if (USER_CONFIG.displayRemainingTime && !isLiveVideo && !isLiveStream) remainingTime();
            if (USER_CONFIG.autoOpenChapters && !USER_CONFIG.videoTabView && hasChapterPanel) openChapters();
            if (USER_CONFIG.autoOpenTranscript && !USER_CONFIG.videoTabView && hasTranscriptPanel) openTranscript();
            if (USER_CONFIG.defaultQuality !== 'auto') {try {document.documentElement.appendChild(Object.assign(document.createElement('script'),{textContent:`(${setVideoQuality.toString()})(${JSON.stringify(USER_CONFIG.defaultQuality)},${JSON.stringify(USER_CONFIG.defaultQualityPremium)});`}));} catch (error) {setVideoQuality(USER_CONFIG.defaultQuality,USER_CONFIG.defaultQualityPremium);}}

            // transcript exporter
            let transcriptLoaded = false;
            if (USER_CONFIG.YouTubeTranscriptExporter) {
                try { await preLoadTranscript(); transcriptLoaded = true; }
                catch (error) { setTimeout(() => { addSettingsButton(); }, 3000); }
                if (transcriptLoaded) addButton();
            } else addSettingsButton();
        } else {
            addSettingsButton();
            if (USER_CONFIG.channelRSSBtn && isChannelPage) addRSSFeedButton();
            if (USER_CONFIG.playlistLinks && isPlaylistPage) handlePlaylistLinks();
            if (USER_CONFIG.channelPlaylistBtn && isChannelPage) addPlaylistButtons();
            if (USER_CONFIG.lastSeenVideo && isSubscriptionsPage) markLastSeenVideo();
            if (USER_CONFIG.colorCodeVideosEnabled && isHomePage) homeColorCodeVideos();
            if (USER_CONFIG.playlistTrashCan && isPlaylistPage) playlistRemovalButtons();
            if (USER_CONFIG.playbackSpeed && isShortPage) createPlaybackSpeedController();
        }
    }

    // YouTube navigation handler
    function handleYouTubeNavigation() {
        // console.log("YouTubeAlchemy: Event Listner Arrived");
        const currentVideoURL = window.location.href;
        if (currentVideoURL !== ultimoURL) {
            ultimoURL = currentVideoURL;
            // console.log("YouTubeAlchemy: Only One Survived");
            if (!cssSettingsApplied) loadCSSsettings();
            initialRun = true;

            const urlObj = new URL(currentVideoURL);
            isHomePage = urlObj.pathname === '/';
            isVideoPage = urlObj.pathname === '/watch';
            isLiveStream = urlObj.pathname.startsWith('/live/');
            isShortPage = urlObj.pathname.startsWith('/shorts/');
            isPlaylistPage = urlObj.pathname === '/playlist';
            isPlaylistVideoPage = currentVideoURL.includes('&list=');
            isSubscriptionsPage = urlObj.pathname === '/feed/subscriptions';
            isChannelPage = /^\/@[a-zA-Z0-9._-]+/.test(urlObj.pathname);
            isChannelHome = /^(\/@[a-zA-Z0-9._-]+|\/channel\/[a-zA-Z0-9_\-=.]+)$/.test(urlObj.pathname);
            if (USER_CONFIG.channelReindirizzare && isChannelHome) { channelRedirect(); return; }
            if (USER_CONFIG.redirectShorts && isShortPage) { redirectShortsToVideoPage(); return; }

            lastVideoURL = videoURL;
            videoURL = window.location.href;

            if (isVideoPage || isLiveStream) {
                lastVideoID = videoID;
                videoID = urlObj.searchParams.get('v');

                document.documentElement.style.setProperty(
                    '--video-url',
                    `url("https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg")`
                ); 
            }

            if (lastVideoURL === null) initializeDelay = 500;
            else initializeDelay = 700;
            setTimeout(() => { initializeAlchemy(); }, initializeDelay);
        }
    }

    // pause script until tab becomes visible
    async function chromeUserWait() {
        if (document.visibilityState !== 'visible') {
            //console.log("YouTubeAlchemy: Waiting for this tab to become visible...");
            return new Promise((resolve) => {
                document.addEventListener('visibilitychange', function onVisibilityChange() {
                    if (document.visibilityState === 'visible') {
                        document.removeEventListener('visibilitychange', onVisibilityChange);
                        resolve();
                    }
                });
            });
        }
    }

    // event listeners
    document.addEventListener('yt-navigate-start', handleYTNavigation); // reset
    document.addEventListener('yt-navigate-finish', handleYouTubeNavigation); // default
    document.addEventListener('yt-page-data-updated', handleYouTubeNavigation); // backup
    document.addEventListener('yt-page-data-fetched', handleYouTubeNavigation); // redundancy
    if (USER_CONFIG.playbackSpeed) document.addEventListener('fullscreenchange', fullscreenCheck); // fullscreen change
    if (USER_CONFIG.preventAutoplay) document.addEventListener('yt-player-updated', pauseYouTubeVideo); // prevent autoplay
    if (USER_CONFIG.playbackSpeed) document.addEventListener('yt-player-updated', initialSpeed); // set playback speed
})();
