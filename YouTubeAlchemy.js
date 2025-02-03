// ==UserScript==
// @name         YouTube Alchemy
// @description  Toolkit for YouTube. Settings panels for easy customization. Features include: export transcripts to LLMs or download it as text files, prevent autoplay, hide shorts, disable play on hover, square design, auto theater mode, auto close chat window, adjust number of videos per row, display remaining time under a video adjusted for playback speed, persistent progress bar with chapter markers and SponsorBlock support, links in the header, and change or hide various ui elements.
// @author       Tim Macy
// @license      GNU AFFERO GENERAL PUBLIC LICENSE-3.0
// @version      7.5
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

(async function() {
    'use strict';
    // CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* main CSS */
        .overlay {
            position: fixed;
            z-index: 2053;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
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

        .header {
            margin: 0 20px 20px 0;
            padding: 0;
            border: 0;
            text-align:center;
            text-decoration: none;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 2.5em;
            line-height: 1em;
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

        .label-style-settings {
            display: block;
            margin-bottom: 5px;
            font-family: "Roboto","Arial",sans-serif;
            font-size: 1.4em;
            line-height: 1.5em;
            font-weight: 500;
        }

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
            margin: 10px 0 -5px 0;
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
            max-height: 200px;
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

        .chrome-info {
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
            transition: all .5s ease-in-out;
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
            height: 450px;
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

        .remaining-time-container {
            position: relative;
            display: block;
            height: 0;
            top: 4px;
            text-align: right;
            font-family: "Roboto", "Arial", sans-serif;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1em;
            color: ghostwhite;
            pointer-events: auto;
            cursor: auto;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .remaining-time-container.live,
        #movie_player .remaining-time-container.live {
            display: none;
            pointer-events: none;
            cursor: default;
        }

        #movie_player .remaining-time-container {
            position: absolute;
            z-index: 2053;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 800 !important;
            font-size: 109%;
            display: inline-block;
            vertical-align: top;
            white-space: nowrap;
            line-height: 53px;
            color: #ddd;
            text-shadow: black 0 0 3px !important;
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
            z-index: 2077;
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

        #links-in-header-form .chrome-info {
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
            max-width: calc(53% - 5px);
            margin: 0;
            align-content: center;
            flex: 0 0 auto;
        }

        #custom-css-form .playback-speed-container .number-input-container {
            max-width: calc(47% - 5px);
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
        #color-code-videos-form .chrome-info { margin: -10px 80px 20px 0px; }
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

        .videos-age-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 50px;
        }

        .videos-age-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            gap: 20px;
            margin: 0;
        }

        .videos-age-row span {
            text-align: right;
            flex: 1;
            max-width: 50%;
        }

        .videos-age-row input {
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


        #custom-css-form .videos-age-row span {
            text-align: left;
            flex: initial;
        }

        #custom-css-form .videos-age-row input {
            margin: 0 0 0 -3px;
        }

        #custom-css-form .videos-age-row {
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

        /* progress bar css */
        .CentAnni-progress-bar {
            #progress-bar-bar {
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                position: absolute;
                bottom: 0;
                opacity: 0;
                z-index: 50;
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

        .ytp-cairo-refresh-signature-moments .ytp-play-progress, .ytp-swatch-background-color {
            background: var(--progressBarColor) !important;
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
            .ytp-gradient-bottom {
                display: none !important;
            }
        }

        .CentAnni-style-hide-endscreen {
            .html5-video-player .html5-endscreen.videowall-endscreen {
                display: none !important;
            }
        }

        .ytd-page-manager[page-subtype="home"],
        .ytd-page-manager[page-subtype="channels"],
        .ytd-page-manager[page-subtype="subscriptions"] {
            .style-scope.ytd-two-column-browse-results-renderer {
                --ytd-rich-grid-items-per-row: var(--itemsPerRow) !important;
                --ytd-rich-grid-posts-per-row: var(--itemsPerRow) !important;
                --ytd-rich-grid-slim-items-per-row: var(--itemsPerRowCalc) !important;
                --ytd-rich-grid-game-cards-per-row: var(--itemsPerRowCalc) !important;
                --ytd-rich-grid-mini-game-cards-per-row: var(--itemsPerRowCalc) !important;
            }

            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: var(--itemsPerRow) !important;
            }
        }

        .CentAnni-style-hide-voice-search {
            #voice-search-button.ytd-masthead {
                display: none;
            }
        }

        .CentAnni-style-hide-create-button {
            ytd-button-renderer.ytd-masthead[button-renderer][button-next]:has(button[aria-label="Create"]) {
                display: none !important;
            }
        }

        .CentAnni-style-hide-brand-text {
            #country-code.ytd-topbar-logo-renderer,
            #logo-icon [id^="youtube-paths_yt"] {
                display: none;
            }

            #logo.ytd-masthead {
                width: 50px;
                overflow: hidden;
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
        }

        .ytd-page-manager[page-subtype="home"] {
            #avatar-container.ytd-rich-grid-media {
                margin: 12px 12px 0 6px;
            }
        }

        .CentAnni-style-square-design {
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus,
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active,
            #chip-container.yt-chip-cloud-chip-renderer {
                border-radius: 2px;
            }

            tp-yt-paper-dialog[modern],
            yt-dropdown-menu {
                border-radius: 2px;
            }

            #thumbnail,
            .CentAnni-player-tabview,
            .yt-thumbnail-view-model--medium,
            #related.style-scope.ytd-watch-flexy,
            .collections-stack-wiz__collection-stack2,
            .collections-stack-wiz__collection-stack1--medium,
            .CentAnni-player-tabview:has(.CentAnni-player-tabview-tab.active[data-tab="tab-2"]),
            ytd-live-chat-frame[theater-watch-while][rounded-container],
            ytd-live-chat-frame[rounded-container] iframe.ytd-live-chat-frame,
            ytd-watch-flexy[flexy][js-panel-height_]:not([fixed-panels]) #chat.ytd-watch-flexy:not([collapsed]),
            ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
                border-radius: 0 !important;
            }

            .CentAnni-player-tabView-tab {
                border-radius: 2px;
            }

            ytd-watch-flexy[theater] .CentAnni-player-tabView-tab {
                border-radius: 0;
            }

            .badge-shape-wiz--thumbnail-badge {
                border-radius: 2px;
            }

            .ytd-page-manager[page-subtype="home"] {
                yt-chip-cloud-chip-renderer {
                    border-radius: 2px;
                }

                .CentAnni-style-live-video, .CentAnni-style-upcoming-video, .CentAnni-style-newly-video, .CentAnni-style-recent-video, .CentAnni-style-lately-video, .CentAnni-style-old-video { border-radius: 0; }
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

            ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
            .immersive-header-container.ytd-playlist-header-renderer,
            .ytVideoMetadataCarouselViewModelHost,
            .yt-spec-button-shape-next--size-s,
            .yt-spec-button-shape-next--size-m,
            #description.ytd-watch-metadata,
            ytd-multi-page-menu-renderer,
            yt-chip-cloud-chip-renderer,
            .ytChipShapeChip {
                border-radius: 2px;
            }

            ytd-menu-popup-renderer {
                border-radius: 0 0 5px 5px;
            }

            ytd-macro-markers-list-item-renderer[rounded] #thumbnail.ytd-macro-markers-list-item-renderer,
            ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before,
            ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before,
            ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy,
            ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) {
                border-radius: 0 !important;
            }
        }

        .CentAnni-style-remove-scrubber {
            .ytp-scrubber-container {
                display: none;
                pointer-events: none;
            }
        }

        .CentAnni-style-compact-layout {
            ytd-rich-section-renderer:has(.grid-subheader.ytd-shelf-renderer) {
                display: none;
            }

            #page-manager.ytd-app {
                --ytd-toolbar-offset: 0 !important;
            }

            .ytd-page-manager[page-subtype="home"],
            .ytd-page-manager[page-subtype="channels"],
            .ytd-page-manager[page-subtype="subscriptions"] {
                #contents.ytd-rich-grid-renderer {
                    width: 100%;
                    max-width: 100%;
                    padding-top: 0;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                }

                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-item-max-width: 100vw;
                    --ytd-rich-grid-item-min-width: 310px;
                    --ytd-rich-grid-item-margin: 1px !important;
                    --ytd-rich-grid-content-offset-top: 56px;
                }

                ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
                    margin-left: 5px !important;
                }

                ytd-rich-item-renderer[rendered-from-rich-grid] {
                    margin: 5px 0 20px 5px !important;
                }

                #meta.ytd-rich-grid-media {
                    overflow-x: hidden;
                    padding-right: 6px;
                }

                #avatar-container.ytd-rich-grid-media {
                    margin:7px 6px 0px 6px;
                }

                h3.ytd-rich-grid-media {
                    margin: 7px 0 4px 0;
                }
            }

            .ytd-page-manager[page-subtype="home"] {
                ytd-menu-renderer.ytd-rich-grid-media {
                    position: absolute;
                    height: 36px;
                    width: 36px;
                    top: 48px;
                    right: auto;
                    left: 6px;
                    align-items: center;
                    transform: rotate(90deg);
                    background-color: rgba(255,255,255,.1);
                    border-radius: 50%;
                }

                .title-badge.ytd-rich-grid-media, .video-badge.ytd-rich-grid-media {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    margin: 10px 10%;
                }

                ytd-rich-item-renderer[rendered-from-rich-grid] {
                    margin: 5px 5px 20px 5px !important;
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
                    transform: translateX(800px) translateY(-40px);
                    z-index: 2000;
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
                    top: 2.5em;
                    right: 0;
                    left: auto;
                    align-items: center;
                    transform: rotate(90deg);
                    background-color: rgba(255,255,255,.1);
                    border-radius: 50%;
                }

                .yt-tab-group-shape-wiz__slider,.yt-tab-shape-wiz__tab-bar {
                    display:none;
                }

                .yt-tab-shape-wiz__tab--tab-selected,.yt-tab-shape-wiz__tab:hover {
                    color:white;
                }

                #tabsContent > yt-tab-group-shape > div.yt-tab-group-shape-wiz__tabs > yt-tab-shape:nth-child(3) {
                    display:none!important;
                }

                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-item-margin: .5% !important;
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
                    transform: rotate(90deg);
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

            #description {
                margin-top: 0;
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
        }

        .ytd-page-manager[page-subtype="home"] {
            .CentAnni-style-live-video, .CentAnni-style-upcoming-video, .CentAnni-style-newly-video, .CentAnni-style-recent-video, .CentAnni-style-lately-video { outline: 2px solid; border-radius: 12px; }
            .CentAnni-style-old-video { outline: none;}

            .CentAnni-style-live-video { outline-color: var(--liveVideo);}
            .CentAnni-style-streamed-text { color: var(--streamedText);}
            .CentAnni-style-upcoming-video { outline-color: var(--upComingVideo);}
            .CentAnni-style-newly-video { outline-color: var(--newlyVideo);}
            .CentAnni-style-recent-video { outline-color: var(--recentVideo);}
            .CentAnni-style-lately-video { outline-color: var(--latelyVideo);}
            .CentAnni-style-old-video { opacity: var(--oldVideo);}
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

        .CentAnni-style-hide-join-button {
            #sponsor-button.ytd-video-owner-renderer:not(:empty),
            ytd-browse[page-subtype="channels"] ytd-recognition-shelf-renderer,
            ytd-browse[page-subtype="channels"] yt-page-header-view-model yt-flexible-actions-view-model button-view-model {
                display: none !important;
            }
        }

        .CentAnni-style-hide-playnext-button {
            a.ytp-next-button {
                display: none;
            }
        }

        .CentAnni-style-small-subscribe-button {
            .ytd-page-manager:not([page-subtype="channels"]) .yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                overflow: hidden;
                width: 36px;
                padding: 0 12px;
            }
        }

        .CentAnni-style-hide-share-button {
            yt-button-view-model.ytd-menu-renderer:has(button.yt-spec-button-shape-next[aria-label="Share"]) {
                display: none;
            }
        }

        .CentAnni-style-hide-add-comment {
            ytd-comments ytd-comments-header-renderer #simple-box {
                display: none;
            }

            #title.ytd-comments-header-renderer {
                margin-bottom: 0;
            }
        }

        .CentAnni-style-hide-news-home {
            ytd-rich-grid-renderer ytd-rich-section-renderer:has(yt-icon:empty) {
                display: none;
            }
        }

        .CentAnni-style-hide-playlists-home {
            ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer:has(a[href*="list="]) {
                display: none;
            }
        }

        .CentAnni-style-hide-reply-button {
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
            ytd-watch-metadata #description ytd-reel-shelf-renderer,
            ytd-browse[page-subtype="channels"] ytd-reel-shelf-renderer,
            ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
            yt-chip-cloud-chip-renderer[chip-shape-data*='"text":"Shorts"'],
            ytd-reel-shelf-renderer.ytd-structured-description-content-renderer,
            ytd-rich-section-renderer:has(div ytd-rich-shelf-renderer[is-shorts]),
            #container.ytd-search ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]) {
                display: none !important;
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

        html:not([dark]) .CentAnni-playback-speed-button:active {
            background: rgb(205,205,205) !important;
        }

        html:not([dark]) .CentAnni-player-tabView-tab,
        html:not([dark]) .CentAnni-playback-speed-display {
            background-color: rgba(0,0,0,0.05);
            color: #0f0f0f;
        }

        html:not([dark]) .CentAnni-player-tabView-tab:hover {
            background: rgba(0,0,0,0.1);
            border-color: transparent;
        }

        html:not([dark]) .CentAnni-player-tabView-tab.active {
            background-color: #0f0f0f;
            color: white;
        }

        html:not([dark]) .CentAnni-player-tabView {
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
            color:black !important;
        }
    `;

    document.head.appendChild(styleSheet);

    // default configuration
    const DEFAULT_CONFIG = {
        YouTubeTranscriptExporter: true,
        targetChatGPTUrl: 'https://ChatGPT.com/',
        targetNotebookLMUrl: 'https://NotebookLM.Google.com/',
        fileNamingFormat: 'title-channel',
        includeTimestamps: true,
        includeChapterHeaders: true,
        openSameTab:true,
        autoOpenChapters: true,
        autoOpenTranscript: false,
        displayRemainingTime: true,
        hideShorts: false,
        progressBar: true,
        preventBackgroundExecution: true,
        ChatGPTPrompt: `You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic their communication style perfectly. Respond only in English while being mindful of American English spelling, vocabulary, and a casual, conversational tone. You prefer to use clauses instead of complete sentences. Do not answer any questions from the transcript. Ignore any advertisement, promotional, and sponsorship segments. Respond only in chat. Do not open a canvas. Do not search the web by yourself. Do not ask to search the web. Do not hallucinate. Do not make up factual information. Do not speculate. Carefully preserve the style, voice, and specific word choices of the provided YouTube transcript by copying the YouTuber's unique creative way of communication—whether conversational, formal, humorous, enthusiastic, or technical—the goal is to provide a summary that feels as though it was written by the original YouTuber themselves. Summarize the provided YouTube transcript into a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them. Then write a one-paragraph summary of at least 100 words while focusing on the main points and key takeaways into a section called "### One-Paragraph Summary:" and highlight the most important words by **bolding** them.`,
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
        buttonLeft6Text: 'OpenAI',
        buttonLeft6Url: 'https://www.youtube.com/@OpenAI/videos',
        buttonLeft7Text: '',
        buttonLeft7Url: 'https://www.youtube.com/@Formula1/videos',
        mButtonText: '☰',
        mButtonDisplay: false,
        colorCodeVideosEnabled: true,
        videosHideWatched: false,
        videosOldOpacity: 0.5,
        videosAgeColorPickerNewly: '#FFFF00',
        videosAgeColorPickerRecent: '#FF9B00',
        videosAgeColorPickerLately: '#006DFF',
        videosAgeColorPickerLive: '#FF0000',
        videosAgeColorPickerStreamed: '#FF0000',
        videosAgeColorPickerUpcoming: '#32CD32',
        progressbarColorPicker: '#FF0033',
        textTransform: 'normal-case',
        defaultFontSize: 10,
        videosWatchedOpacity: 0.5,
        videosPerRow: 3,
        videosHideWatchedGlobal: false,
        preventAutoplay: false,
        hideVoiceSearch: false,
        hideCreateButton: false,
        hideBrandText: false,
        hideJoinButton: false,
        hidePlayNextButton: false,
        hideShareButton: false,
        hideRightSidebarSearch: false,
        hideAddComment: false,
        hideReplyButton: false,
        hidePlaylistsHome: false,
        hideNewsHome: false,
        hideEndCards: false,
        hideEndscreen: false,
        smallSubscribeButton: false,
        removeScrubber: false,
        disablePlayOnHover: false,
        hideMiniPlayer: false,
        closeChatWindow: true,
        displayFullTitle: true,
        autoTheaterMode: false,
        squareSearchBar: true,
        squareDesign: false,
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
    function loadCSSsettings() {
        const body = document.querySelector('body');

        // features css
        if (USER_CONFIG.progressBar) { body.classList.add('CentAnni-progress-bar'); } else { body.classList.remove('CentAnni-progress-bar'); }
        if (USER_CONFIG.mButtonDisplay) { body.classList.add('CentAnni-style-hide-default-sidebar'); } else { body.classList.remove('CentAnni-style-hide-default-sidebar'); }

        // custom css
        document.documentElement.style.setProperty('--progressBarColor', USER_CONFIG.progressbarColorPicker);
        document.documentElement.style.setProperty('--textTransform', USER_CONFIG.textTransform);
        document.documentElement.style.setProperty('--fontSize', `${USER_CONFIG.defaultFontSize}px`);
        document.documentElement.style.setProperty('--watchedOpacity', USER_CONFIG.videosWatchedOpacity);
        document.documentElement.style.setProperty('--itemsPerRow', USER_CONFIG.videosPerRow);
        document.documentElement.style.setProperty('--itemsPerRowCalc', USER_CONFIG.videosPerRow + 2);
        if (USER_CONFIG.videosHideWatchedGlobal) { body.classList.add('CentAnni-style-hide-watched-videos-global'); } else { body.classList.remove('CentAnni-style-hide-watched-videos-global'); }
        if (USER_CONFIG.hideVoiceSearch) { body.classList.add('CentAnni-style-hide-voice-search'); } else { body.classList.remove('CentAnni-style-hide-voice-search'); }
        if (USER_CONFIG.hideCreateButton) { body.classList.add('CentAnni-style-hide-create-button'); } else { body.classList.remove('CentAnni-style-hide-create-button'); }
        if (USER_CONFIG.hideBrandText) { body.classList.add('CentAnni-style-hide-brand-text'); } else { body.classList.remove('CentAnni-style-hide-brand-text'); }
        if (USER_CONFIG.hideMiniPlayer) { body.classList.add('CentAnni-style-hide-miniplayer'); } else { body.classList.remove('CentAnni-style-hide-miniplayer'); }
        if (USER_CONFIG.disablePlayOnHover) { body.classList.add('CentAnni-style-disable-play-on-hover'); } else { body.classList.remove('CentAnni-style-disable-play-on-hover'); }
        if (USER_CONFIG.smallSubscribeButton) { body.classList.add('CentAnni-style-small-subscribe-button'); } else { body.classList.remove('CentAnni-style-small-subscribe-button'); }
        if (USER_CONFIG.hideShareButton) { body.classList.add('CentAnni-style-hide-share-button'); } else { body.classList.remove('CentAnni-style-hide-share-button'); }
        if (USER_CONFIG.hideAddComment) { body.classList.add('CentAnni-style-hide-add-comment'); } else { body.classList.remove('CentAnni-style-hide-add-comment'); }
        if (USER_CONFIG.hideReplyButton) { body.classList.add('CentAnni-style-hide-reply-button'); } else { body.classList.remove('CentAnni-style-hide-reply-button'); }
        if (USER_CONFIG.hidePlaylistsHome) { body.classList.add('CentAnni-style-hide-playlists-home'); } else { body.classList.remove('CentAnni-style-hide-playlists-home'); }
        if (USER_CONFIG.hideNewsHome) { body.classList.add('CentAnni-style-hide-news-home'); } else { body.classList.remove('CentAnni-style-hide-news-home'); }
        if (USER_CONFIG.hideRightSidebarSearch) { body.classList.add('CentAnni-style-search-hide-right-sidebar'); } else { body.classList.remove('CentAnni-style-search-hide-right-sidebar'); }
        if (USER_CONFIG.hideShorts) { body.classList.add('CentAnni-style-hide-shorts'); } else { body.classList.remove('CentAnni-style-hide-shorts'); }
        if (USER_CONFIG.hideEndCards) { body.classList.add('CentAnni-style-hide-end-cards'); } else { body.classList.remove('CentAnni-style-hide-end-cards'); }
        if (USER_CONFIG.hideEndscreen) { body.classList.add('CentAnni-style-hide-endscreen'); } else { body.classList.remove('CentAnni-style-hide-endscreen'); }
        if (USER_CONFIG.displayFullTitle) { body.classList.add('CentAnni-style-full-title'); } else { body.classList.remove('CentAnni-style-full-title'); }
        if (USER_CONFIG.hideJoinButton) { body.classList.add('CentAnni-style-hide-join-button'); } else { body.classList.remove('CentAnni-style-hide-join-button'); }
        if (USER_CONFIG.hidePlayNextButton) { body.classList.add('CentAnni-style-hide-playnext-button'); } else { body.classList.remove('CentAnni-style-hide-playnext-button'); }
        if (USER_CONFIG.squareSearchBar) { body.classList.add('CentAnni-style-square-search-bar'); } else { body.classList.remove('CentAnni-style-square-search-bar'); }
        if (USER_CONFIG.squareDesign) { body.classList.add('CentAnni-style-square-design'); } else { body.classList.remove('CentAnni-style-square-design'); }
        if (USER_CONFIG.removeScrubber) { body.classList.add('CentAnni-style-remove-scrubber'); } else { body.classList.remove('CentAnni-style-remove-scrubber'); }
        if (USER_CONFIG.compactLayout) { body.classList.add('CentAnni-style-compact-layout'); } else { body.classList.remove('CentAnni-style-compact-layout'); }
        if (USER_CONFIG.closeChatWindow) { body.classList.add('CentAnni-close-live-chat'); } else { body.classList.remove('CentAnni-close-live-chat'); }

        // color code videos
        if (USER_CONFIG.videosHideWatched) { body.classList.add('CentAnni-style-hide-watched-videos'); } else { body.classList.remove('CentAnni-style-hide-watched-videos'); }
        document.documentElement.style.setProperty('--liveVideo', USER_CONFIG.videosAgeColorPickerLive);
        document.documentElement.style.setProperty('--streamedText', USER_CONFIG.videosAgeColorPickerStreamed);
        document.documentElement.style.setProperty('--upComingVideo', USER_CONFIG.videosAgeColorPickerUpcoming);
        document.documentElement.style.setProperty('--newlyVideo', USER_CONFIG.videosAgeColorPickerNewly);
        document.documentElement.style.setProperty('--recentVideo', USER_CONFIG.videosAgeColorPickerRecent);
        document.documentElement.style.setProperty('--latelyVideo', USER_CONFIG.videosAgeColorPickerLately);
        document.documentElement.style.setProperty('--oldVideo', USER_CONFIG.videosOldOpacity);
    }

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
        modal.classList.add('overlay');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // modal header
        const header = document.createElement('a');
        header.href = 'https://github.com/TimMacy/YouTubeAlchemy';
        header.target = '_blank';
        header.innerText = 'YouTube Alchemy';
        header.title = 'GitHub Repository for YouTube Alchemy';
        header.classList.add('header');
        modalContent.appendChild(header);

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

        // YouTube Transcript Exporter
        form.appendChild(createCheckboxField('Enable YouTube Transcript Exporter (default: yes)', 'YouTubeTranscriptExporter', USER_CONFIG.YouTubeTranscriptExporter));

        // include Timestamps
        form.appendChild(createCheckboxField('Include Timestamps in the Transcript (default: yes)', 'includeTimestamps', USER_CONFIG.includeTimestamps));

        // include Chapter Headers
        form.appendChild(createCheckboxField('Include Chapter Headers in the Transcript (default: yes)', 'includeChapterHeaders', USER_CONFIG.includeChapterHeaders));

        // open in Same Tab
        form.appendChild(createCheckboxField('Open Links in the Same Tab (default: yes)', 'openSameTab', USER_CONFIG.openSameTab));

        // prevent Execution in Background Tabs
        form.appendChild(createCheckboxField('Important for Chrome! (default: yes)', 'preventBackgroundExecution', USER_CONFIG.preventBackgroundExecution));

        // info for Chrome
        const description = document.createElement('small');
        description.innerText = 'Prevents early script execution in background tabs.\nWhile this feature is superfluous in Safari, it is essential for Chrome.';
        description.classList.add('chrome-info');
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

        extraSettings.appendChild(buttonsLeft);
        extraSettings.appendChild(customCSSButton);
        extraSettings.appendChild(colorCodeVideos);

        form.appendChild(extraSettings);

        // ChatGPT Prompt
        form.appendChild(createTextareaField('ChatGPT Prompt:', 'ChatGPTPrompt', USER_CONFIG.ChatGPTPrompt, 'label-ChatGPT'));

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
            const endHeight = 450;
            const duration = 500;

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
        document.addEventListener('click', (event) => {
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
          });

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
            infoLinksHeader.innerText = "Up to seven links can be added next to the YouTube logo. An empty 'Link Text' field won't insert the link into the header.\nIf the navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.";
            infoLinksHeader.classList.add('chrome-info');
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
            for (let i = 1; i <= 7; i++) {
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

            // font size
            const defaultFontSizeField = createNumberInputField('Font Size (default: 10)', 'defaultFontSize', USER_CONFIG.defaultFontSize);
            form.appendChild(defaultFontSizeField);

            // videos per row
            const videosPerRow = createNumberInputField('Number of Videos per Row (default: 3)', 'videosPerRow', USER_CONFIG.videosPerRow);
            form.appendChild(videosPerRow);

            // features text
            const featuresText = document.createElement('label');
            featuresText.innerText = 'Features';
            featuresText.classList.add('button-icons', 'features-text');
            form.appendChild(featuresText);

            // prevent autoplay
            const preventAutoplay = createCheckboxField('Prevent Autoplay (default: no)', 'preventAutoplay', USER_CONFIG.preventAutoplay);
            form.appendChild(preventAutoplay);

            // auto open chapter panel
            const autoOpenChapters = createCheckboxField('Automatically Open Chapter Panels (default: yes)', 'autoOpenChapters', USER_CONFIG.autoOpenChapters);
            form.appendChild(autoOpenChapters);

            // auto open transcript panel
            const autoOpenTranscript = createCheckboxField('Automatically Open Transcript Panels (default: no)', 'autoOpenTranscript', USER_CONFIG.autoOpenTranscript);
            form.appendChild(autoOpenTranscript);

            // close chat window
            const closeChatWindow = createCheckboxField('Auto Close Initial Chat Windows (default: yes)', 'closeChatWindow', USER_CONFIG.closeChatWindow);
            form.appendChild(closeChatWindow);

            // auto theater mode
            const autoTheaterMode = createCheckboxField('Auto Theater Mode (default: no)', 'autoTheaterMode', USER_CONFIG.autoTheaterMode);
            form.appendChild(autoTheaterMode);

            // display remaining time
            const displayRemainingTime = createCheckboxField('Display Remaining Time Under a Video, Adjusted for Playback Speed (default: yes)', 'displayRemainingTime', USER_CONFIG.displayRemainingTime);
            form.appendChild(displayRemainingTime);

            // persistent progress bar
            const progressBar = createCheckboxField('Persistent Progress Bar with Chapter Markers and SponsorBlock Support (default: yes)', 'progressBar', USER_CONFIG.progressBar);
            form.appendChild(progressBar);

            // hide shorts
            const hideShorts = createCheckboxField('Hide Shorts (default: no)', 'hideShorts', USER_CONFIG.hideShorts);
            form.appendChild(hideShorts);

            // features text
            const featuresTextMain = document.createElement('label');
            featuresTextMain.innerText = 'Layout Changes';
            featuresTextMain.classList.add('button-icons', 'features-text');
            form.appendChild(featuresTextMain);

            // disable play on hover
            const disablePlayOnHover = createCheckboxField('Disable Play on Hover (default: yes)', 'disablePlayOnHover', USER_CONFIG.disablePlayOnHover);
            form.appendChild(disablePlayOnHover);

            // square and compact search bar
            const squareSearchBar = createCheckboxField('Square and Compact Search Bar (default: yes)', 'squareSearchBar', USER_CONFIG.squareSearchBar);
            form.appendChild(squareSearchBar);

            // square design
            const squareDesign = createCheckboxField('Square Design (default: no)', 'squareDesign', USER_CONFIG.squareDesign);
            form.appendChild(squareDesign);

            // compact layout
            const compactLayout = createCheckboxField('Compact Layout (default: no)', 'compactLayout', USER_CONFIG.compactLayout);
            form.appendChild(compactLayout);

            // features text
            const featuresCSS = document.createElement('label');
            featuresCSS.innerText = 'CSS to Change or Hide UI Elements';
            featuresCSS.classList.add('button-icons', 'features-text');
            form.appendChild(featuresCSS);

            // hide voice search button
            const hideVoiceSearch = createCheckboxField('Hide Voice Search Button in the Header (default: no)', 'hideVoiceSearch', USER_CONFIG.hideVoiceSearch);
            form.appendChild(hideVoiceSearch);

            // hide create button
            const hideCreateButton = createCheckboxField('Hide Create Button in the Header (default: no)', 'hideCreateButton', USER_CONFIG.hideCreateButton);
            form.appendChild(hideCreateButton);

            // hide YouTube brand text within the header
            const hideBrandText = createCheckboxField('Hide YouTube Brand Text in the Header (default: no)', 'hideBrandText', USER_CONFIG.hideBrandText);
            form.appendChild(hideBrandText);

            // small subscribed button
            const smallSubscribeButton = createCheckboxField('Small Subscribed Button under a Video (default: no)', 'smallSubscribeButton', USER_CONFIG.smallSubscribeButton);
            form.appendChild(smallSubscribeButton);

            // hide join button
            const hideJoinButton = createCheckboxField('Hide Join Button under a Video and on Channel Page (default: no)', 'hideJoinButton', USER_CONFIG.hideJoinButton);
            form.appendChild(hideJoinButton);

            // display full title
            const displayFullTitle = createCheckboxField('Display Full Titles (default: yes)', 'displayFullTitle', USER_CONFIG.displayFullTitle);
            form.appendChild(displayFullTitle);

            // color picker progress bar
            const progressbarColorContainer = document.createElement('div');
            progressbarColorContainer.classList.add('videos-age-container');

            function createLabelColorPair(labelText, configKey) {
                const row = document.createElement('div');
                row.classList.add('videos-age-row');

                const colorPicker = document.createElement('input');
                colorPicker.type = 'color';
                colorPicker.value = USER_CONFIG[configKey];
                colorPicker.name = configKey;
                row.appendChild(colorPicker);

                const label = document.createElement('span');
                label.classList.add('label-style-settings');
                label.innerText = labelText;
                row.appendChild(label);

                progressbarColorContainer.appendChild(row);
            }

            createLabelColorPair('Progress Bar Color', 'progressbarColorPicker');

            form.appendChild(progressbarColorContainer);

            // hide video scrubber
            const removeScrubber = createCheckboxField('Hide Video Scrubber (default: no)', 'removeScrubber', USER_CONFIG.removeScrubber);
            form.appendChild(removeScrubber);

            // hide video end cards
            const hideEndCards = createCheckboxField('Hide Video End Cards (default: no)', 'hideEndCards', USER_CONFIG.hideEndCards);
            form.appendChild(hideEndCards);

            // hide end screen
            const hideEndscreen = createCheckboxField('Hide End Screens (suggestions at video end) (default: no)', 'hideEndscreen', USER_CONFIG.hideEndscreen);
            form.appendChild(hideEndscreen);

            // hide play next button
            const hidePlayNextButton = createCheckboxField('Hide "Play Next" Button (default: no)', 'hidePlayNextButton', USER_CONFIG.hidePlayNextButton);
            form.appendChild(hidePlayNextButton);

            // hide share button
            const hideShareButton = createCheckboxField('Hide Share Button under a Video (default: no)', 'hideShareButton', USER_CONFIG.hideShareButton);
            form.appendChild(hideShareButton);

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

            // hide mini player
            const hideMiniPlayer = createCheckboxField('Hide Mini Player (default: no)', 'hideMiniPlayer', USER_CONFIG.hideMiniPlayer);
            form.appendChild(hideMiniPlayer);

            // hide right sidebar search
            const hideRightSidebarSearch = createCheckboxField('Hide Right Sidebar on Search Page (default: no)', 'hideRightSidebarSearch', USER_CONFIG.hideRightSidebarSearch);
            form.appendChild(hideRightSidebarSearch);

            // hide watched videos globally
            const videosHideWatchedGlobal = createCheckboxField('Hide Watched Videos Globally (default: no)', 'videosHideWatchedGlobal', USER_CONFIG.videosHideWatchedGlobal);
            form.appendChild(videosHideWatchedGlobal);

            return form;
        }

        // color code videos
        function createColorCodeVideosContent() {
            const form = document.createElement('form');
            form.id = 'color-code-videos-form';

            const subPanelHeader = document.createElement('div');
            subPanelHeader.classList.add('sub-panel-header');
            subPanelHeader.textContent = 'Configure Color Codes for Videos on Home';
            form.appendChild(subPanelHeader);

            const infoColorCodeVideos = document.createElement('small');
            infoColorCodeVideos.innerText = "These settings only apply to the Home Page: YouTube.com.";
            infoColorCodeVideos.classList.add('chrome-info');
            form.appendChild(infoColorCodeVideos);

            // activate color code videos
            const checkboxField = createCheckboxField('Activate Color Code Videos (default: yes)', 'colorCodeVideosEnabled', USER_CONFIG.colorCodeVideosEnabled );
            form.appendChild(checkboxField);

            const checkboxFieldWatched = createCheckboxField('Hide Watched Videos (Only on Home) (default: no)', 'videosHideWatched', USER_CONFIG.videosHideWatched );
            form.appendChild(checkboxFieldWatched);

            // opacity picker for old videos
            const videosOldContainer = createSliderInputField( 'Change opacity of videos uploaded more than 6 months ago:', 'videosOldOpacity', USER_CONFIG.videosOldOpacity, '0', '1', '0.1' );
            form.appendChild(videosOldContainer);

            // color pickers for different video ages
            const videosAgeContainer = document.createElement('div');
            videosAgeContainer.classList.add('videos-age-container');

            function createLabelColorPair(labelText, configKey) {
                const row = document.createElement('div');
                row.classList.add('videos-age-row');

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

            createLabelColorPair('Videos uploaded within the last 24 hours:', 'videosAgeColorPickerNewly');
            createLabelColorPair('Videos uploaded within the past week:', 'videosAgeColorPickerRecent');
            createLabelColorPair('Videos uploaded within the past month:', 'videosAgeColorPickerLately');
            createLabelColorPair('Videos currently live:', 'videosAgeColorPickerLive');
            createLabelColorPair('The word "streamed" from Videos that were live:', 'videosAgeColorPickerStreamed');
            createLabelColorPair('Scheduled videos and upcoming live streams:', 'videosAgeColorPickerUpcoming');

            form.appendChild(videosAgeContainer);

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
            USER_CONFIG.displayRemainingTime = subPanelCustomCSS.elements.displayRemainingTime.checked;
            USER_CONFIG.progressBar = subPanelCustomCSS.elements.progressBar.checked;
            USER_CONFIG.hideShorts = subPanelCustomCSS.elements.hideShorts.checked;
            USER_CONFIG.hideVoiceSearch = subPanelCustomCSS.elements.hideVoiceSearch.checked;
            USER_CONFIG.hideCreateButton = subPanelCustomCSS.elements.hideCreateButton.checked;
            USER_CONFIG.hideRightSidebarSearch = subPanelCustomCSS.elements.hideRightSidebarSearch.checked;
            USER_CONFIG.hideBrandText = subPanelCustomCSS.elements.hideBrandText.checked;
            USER_CONFIG.disablePlayOnHover = subPanelCustomCSS.elements.disablePlayOnHover.checked;
            USER_CONFIG.preventAutoplay = subPanelCustomCSS.elements.preventAutoplay.checked;
            USER_CONFIG.hideEndCards = subPanelCustomCSS.elements.hideEndCards.checked;
            USER_CONFIG.hideEndscreen = subPanelCustomCSS.elements.hideEndscreen.checked;
            USER_CONFIG.hideJoinButton = subPanelCustomCSS.elements.hideJoinButton.checked;
            USER_CONFIG.hidePlayNextButton = subPanelCustomCSS.elements.hidePlayNextButton.checked;
            USER_CONFIG.smallSubscribeButton = subPanelCustomCSS.elements.smallSubscribeButton.checked;
            USER_CONFIG.hideShareButton = subPanelCustomCSS.elements.hideShareButton.checked;
            USER_CONFIG.hideAddComment = subPanelCustomCSS.elements.hideAddComment.checked;
            USER_CONFIG.hideReplyButton = subPanelCustomCSS.elements.hideReplyButton.checked;
            USER_CONFIG.hidePlaylistsHome = subPanelCustomCSS.elements.hidePlaylistsHome.checked;
            USER_CONFIG.hideNewsHome = subPanelCustomCSS.elements.hideNewsHome.checked;
            USER_CONFIG.progressbarColorPicker = subPanelCustomCSS.elements.progressbarColorPicker.value;
            USER_CONFIG.removeScrubber = subPanelCustomCSS.elements.removeScrubber.checked;
            USER_CONFIG.autoTheaterMode = subPanelCustomCSS.elements.autoTheaterMode.checked;
            USER_CONFIG.hideMiniPlayer = subPanelCustomCSS.elements.hideMiniPlayer.checked;
            USER_CONFIG.closeChatWindow = subPanelCustomCSS.elements.closeChatWindow.checked;
            USER_CONFIG.displayFullTitle = subPanelCustomCSS.elements.displayFullTitle.checked;
            USER_CONFIG.squareSearchBar = subPanelCustomCSS.elements.squareSearchBar.checked;
            USER_CONFIG.squareDesign = subPanelCustomCSS.elements.squareDesign.checked;
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
        overlay.classList.add('overlay');

        const modal = document.createElement('div');
        modal.classList.add('notification');
        modal.innerText = message;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        setTimeout(() => { overlay.remove(); }, 1000);
    }

    // function to add the YouTube Transcript Exporter buttons
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
        if (document.querySelector('.button-wrapper')) return;

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
        if (document.querySelector('.button-wrapper')) return;

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
                console.log("YouTubeAlchemy: Transcript button not found. Subtitles/closed captions unavailable or language unsupported. Reload this page to try again.");
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

            if (!USER_CONFIG.autoOpenTranscript) transcriptPanel.classList.add("transcript-preload");
            if (!USER_CONFIG.autoOpenTranscript) transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");

            let loaded = false;

            const observer = new MutationObserver(() => {
                const transcriptItems = transcriptPanel.querySelectorAll("ytd-transcript-segment-renderer");
                if (transcriptItems.length > 0) {
                loaded = true;
                cleanup(false);
                clearTimeout(fallbackTimer);
                observer.disconnect();
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
            }, 6000);

            function cleanup(failed) {
                notification.remove();
                if (!USER_CONFIG.autoOpenTranscript) transcriptPanel.classList.remove("transcript-preload");
                if (!USER_CONFIG.autoOpenTranscript) transcriptPanel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
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

    // function to display the remaining time based on playback speed
    function remainingTime() {
        const STREAM_SELECTOR = '.video-stream.html5-main-video';
        const CONTAINER_SELECTOR = '#columns #primary #below';
        const FULLSCREEN_CONTAINER_SELECTOR = '#movie_player > div.ytp-chrome-bottom';

        // function to format seconds
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
        element.classList.add('remaining-time-container');

        const textNode = document.createTextNode('');
        element.appendChild(textNode);

        const initialContainer = document.querySelector(CONTAINER_SELECTOR);
        if (initialContainer) { initialContainer.prepend(element); }

        // hide for live stream
        if (isLiveVideo) {
            element.classList.add('live');
        } else {
            element.classList.remove('live');
        }

        // dynamic placement based on fullscreen mode
        const updateContainer = () => {
            const container = document.querySelector(CONTAINER_SELECTOR);
            const fullscreenContainer = document.querySelector(FULLSCREEN_CONTAINER_SELECTOR);
            const remainingTimeContainer = document.querySelector('.remaining-time-container');

            if (document.fullscreenElement && fullscreenContainer) {
                if (remainingTimeContainer && remainingTimeContainer.parentNode !== fullscreenContainer) {
                    fullscreenContainer.appendChild(remainingTimeContainer);
                }
            } else if (container) {
                if (getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                if (remainingTimeContainer && remainingTimeContainer.parentNode !== container) {
                    container.prepend(remainingTimeContainer);
                }
            }
        };

        document.addEventListener('fullscreenchange', () => { setTimeout(updateContainer, 250); });
        updateContainer();

        // time updates
        const video = document.querySelector(STREAM_SELECTOR);
        if (video) {
            video.ontimeupdate = () => {
                const duration = video.duration;
                const currentTime = video.currentTime;
                const playbackRate = video.playbackRate || 1;
                const remaining = (duration - currentTime) / playbackRate;
                const watchedPercent = duration ? Math.round((currentTime / duration) * 100) + '%' : '0%';
                const totalFormatted = formatTime(duration);
                const elapsedFormatted = formatTime(currentTime);
                const remainingFormatted = formatTime(remaining);

                textNode.data = `total: ${totalFormatted} | elapsed: ${elapsedFormatted} — watched: ${watchedPercent} — remaining: ${remainingFormatted} (${playbackRate}x)`;
            };
        }
    }

    // function to keep the progress bar visible with chapters container
    function keepProgressBarVisible() {
        document.documentElement.classList.add('progressBar');

        const player = document.querySelector('.html5-video-player');
        const video = document.querySelector('video[src]');
        const chaptersContainer = player && player.querySelector('.ytp-chapters-container');
        const progressBarContainer = player && player.querySelector('.ytp-progress-bar-container');

        if (!player || !video ) { console.error("YouTubeAlchemy: ProgressBar: A Required querySelector Not Found."); return; }
        if (!progressBarContainer) { console.error("YouTubeAlchemy: ProgressBar: Progress Bar Container Not Found."); return; }

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

        function animateProgress() {
            const fraction = video.currentTime / video.duration;
            progress.style.transform = `scaleX(${fraction})`;
            requestAnimationFrame(animateProgress);
        }

        requestAnimationFrame(animateProgress);

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

                        bar.style.maskImage = cachedMaskImage;
                        bar.style.webkitMaskImage = cachedMaskImage;
                        bar.style.maskRepeat = 'no-repeat';
                        bar.style.webkitMaskRepeat = 'no-repeat';
                        bar.style.maskSize = '100% 100%';
                        bar.style.webkitMaskSize = '100% 100%';
                    } else {
                        if (cachedMaskImage) {
                            bar.style.maskImage = '';
                            bar.style.webkitMaskImage = '';
                            cachedMaskImage = null;
                        }
                    }
                }
            });
        }

        // handle layout changes
        document.addEventListener('yt-set-theater-mode-enabled', () => { updateLayout(); });
        window.addEventListener('resize', () => { updateLayout(); });

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
                    document.body.classList.remove('CentAnni-close-live-chat');
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
                    document.body.classList.remove('CentAnni-close-live-chat');
                    initialRun = false;
                }
                return;
            }

            button.click();
            setTimeout(() => { document.body.classList.remove('CentAnni-close-live-chat'); }, 250);
            initialRun = false;
        }

        tryCloseChat();
    }

    // function to automatically open the chapter panel
    function openChapters() {
        if (hasChapterPanel)
            chapterPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
    }

    // function to automatically open the transcript panel
    function openTranscript() {
        if (hasTranscriptPanel)
            transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
    }

    // sidebar and links in header
    function buttonsLeftHeader() {
        function openSidebar() {
            const guideButton = document.querySelector('#guide-button button');
            if (guideButton) {
                guideButton.click();
            }
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

        if (container.querySelector('.buttons-left')) { return; }

        // adding the buttons
        const buttonsConfig = [
            { type: 'button', text: USER_CONFIG.mButtonText, onClick: openSidebar },
            { type: 'link', text: USER_CONFIG.buttonLeft1Text, url: USER_CONFIG.buttonLeft1Url },
            { type: 'link', text: USER_CONFIG.buttonLeft2Text, url: USER_CONFIG.buttonLeft2Url },
            { type: 'link', text: USER_CONFIG.buttonLeft3Text, url: USER_CONFIG.buttonLeft3Url },
            { type: 'link', text: USER_CONFIG.buttonLeft4Text, url: USER_CONFIG.buttonLeft4Url },
            { type: 'link', text: USER_CONFIG.buttonLeft5Text, url: USER_CONFIG.buttonLeft5Url },
            { type: 'link', text: USER_CONFIG.buttonLeft6Text, url: USER_CONFIG.buttonLeft6Url },
            { type: 'link', text: USER_CONFIG.buttonLeft7Text, url: USER_CONFIG.buttonLeft7Url },
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
                } else if (config.type === 'link') {
                    element = createLink(config.text, config.url);
                }
                if (element) {
                    container.appendChild(element);
                }
            }
        });
    }

    // color code videos on home
    function homeColorCodeVideos() {
        // define age categories
        const categories = {
            live: ['watching'],
            streamed: ['Streamed'],
            upcoming: ['waiting', 'scheduled for'],
            newly: ['1 day ago', 'hours ago', 'hour ago', 'minutes ago', 'minute ago', 'seconds ago', 'second ago'],
            recent: ['1 week ago', '7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago'],
            lately: ['1 month ago', 'weeks ago', '14 days ago', '13 days ago', '12 days ago', '11 days ago', '10 days ago', '9 days ago', '8 days ago'],
            old: ['years ago', '1 year ago', '12 months ago', '11 months ago', '10 months ago', '9 months ago', '8 months ago', '7 months ago']
        };

        function processVideos() {
            document.querySelectorAll('[class*="ytd-video-meta-block"]').forEach(el => {
                const textContent = el.textContent.trim().toLowerCase();
                for (const [className, ages] of Object.entries(categories)) {
                    if (ages.some(age => textContent.includes(age.toLowerCase()))) {
                        const videoContainer = el.closest('ytd-rich-item-renderer');
                        if (videoContainer && !videoContainer.classList.contains(`CentAnni-style-${className}-video`)) {
                            videoContainer.classList.add(`CentAnni-style-${className}-video`);
                        }
                    }
                }
            });

            document.querySelectorAll('span.ytd-video-meta-block').forEach(el => {
                const text = el.textContent;
                const videoContainer = el.closest('ytd-rich-item-renderer');
                if (!videoContainer) return;

                if (/Scheduled for/i.test(text) && !videoContainer.classList.contains('CentAnni-style-upcoming-video')) {
                    videoContainer.classList.add('CentAnni-style-upcoming-video');
                }

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
        }

        processVideos();

        document.addEventListener('yt-service-request-sent', () => {
            setTimeout(() => { processVideos(); }, 2000);
        });
    }

    // initiate the script
    let ultimoURL = null;
    let lastVideoURL = null;
    let lastVideoID = null;
    let videoURL = null;
    let videoID = null;
    let isVideoPage = null;
    let isLiveVideo = null;
    let isLiveStream = null;
    let isChannelHome = null;
    let initialRun = null;
    let chatEnabled = null;
    let isTheaterMode = null;
    let hasChapterPanel = null;
    let chapterPanel = null;
    let hasTranscriptPanel = null;
    let transcriptPanel = null;
    let hasChatPanel = null;
    let isFullscreen = null;

    async function initializeAlchemy() {
        if (USER_CONFIG.preventBackgroundExecution) { await chromeUserWait(); }
        if (isChannelHome) channelRedirect();
        buttonsLeftHeader();

        if (isVideoPage || isLiveStream) {
            liveVideoCheck();
            fullscreenCheck();
            theaterModeCheck();
            chapterPanelCheck();
            transcriptPanelCheck();
            if (USER_CONFIG.closeChatWindow) setTimeout(() => { chatWindowCheck(); }, 500);
            if (USER_CONFIG.autoTheaterMode && !isTheaterMode) toggleTheaterMode();
            if (USER_CONFIG.displayRemainingTime && !isLiveVideo &&!isLiveStream) remainingTime();
            if (USER_CONFIG.progressBar && !isLiveVideo &&!isLiveStream) keepProgressBarVisible();
            if (USER_CONFIG.autoOpenChapters && hasChapterPanel) openChapters();
            if (USER_CONFIG.autoOpenTranscript && hasTranscriptPanel) openTranscript();

            //YouTube Transcript Exporter
            let transcriptLoaded = false;
            if (USER_CONFIG.YouTubeTranscriptExporter) {
                try { await preLoadTranscript(); transcriptLoaded = true; }
                catch (error) { setTimeout(() => { addSettingsButton(); }, 3000); }
                if (transcriptLoaded) { addButton(); }
            } else { addSettingsButton(); }
            //console.log("YouTubeAlchemy: YouTube Alchemy Initialized: On Video Page.");
        } else {
            addSettingsButton();
            //console.log("YouTubeAlchemy: YouTube Alchemy Initialized: On Other Page.");
            if (window.location.href !== "https://www.youtube.com/") return;
            if (USER_CONFIG.colorCodeVideosEnabled) { homeColorCodeVideos(); }
        }
    }

    // YouTube navigation handler
    function handleYouTubeNavigation() {
        //console.log("YouTubeAlchemy: Event Listner Arrived");
        const currentVideoURL = window.location.href;
        if (currentVideoURL !== ultimoURL) {
            ultimoURL = currentVideoURL;
            //console.log("YouTubeAlchemy: Only One Survived");
            loadCSSsettings();
            initialRun = true;
            isVideoPage = /^https:\/\/.*\.youtube\.com\/watch\?v=/.test(currentVideoURL);
            isLiveStream = /^https:\/\/.*\.youtube\.com\/live\/[a-zA-Z0-9_-]+/.test(currentVideoURL);
            isChannelHome = /^https:\/\/.*\.youtube\.com\/@[a-zA-Z0-9_-]+$/.test(currentVideoURL);

            if (isVideoPage || isLiveStream) {
                lastVideoURL = videoURL;
                lastVideoID = videoID;

                videoURL = window.location.href;
                const urlParams = new URLSearchParams(window.location.search);
                videoID = urlParams.get('v');
            }

            setTimeout(() => { initializeAlchemy(); }, 500);
        }
    }

    // theater mode check
    function theaterModeCheck() {
      const watchFlexy = document.querySelector('ytd-watch-flexy');

      if (watchFlexy?.hasAttribute('theater')) {
        isTheaterMode = true;
        } else if (watchFlexy?.hasAttribute('default-layout')) {
            isTheaterMode = false;
        }
    }

    // fullscreen check
    function fullscreenCheck() {
        const player = document.getElementById('movie_player');
        if (player && player.classList.contains('ytp-fullscreen')) {
            isFullscreen = true;
        } else {
            isFullscreen = false;
        }
    }

    // live stream check
    function liveVideoCheck() {
        const timeDisplay = document.querySelector('.ytp-time-display');
        isLiveVideo = !!timeDisplay?.classList.contains('ytp-live');
    }

    // chapter panel check
    function chapterPanelCheck() {
        chapterPanel = document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]' ) || document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]' );
        hasChapterPanel = !!chapterPanel;
    }

    // transcript panel check
    function transcriptPanelCheck() {
        transcriptPanel = document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]' );
        hasTranscriptPanel = !!transcriptPanel;
    }

    // check and close chat window
    function chatWindowCheck() {
        hasChatPanel = !!(document.querySelector('#chat') || document.querySelector('iframe#chatframe'));
        const chatMessageElement = document.querySelector('#chat-container ytd-live-chat-frame #message');

        if (chatMessageElement) {
            const messageText = chatMessageElement.textContent.trim();
            if (messageText === 'Chat is disabled for this live stream.') chatEnabled = false;
        } else chatEnabled = true;

        if (USER_CONFIG.closeChatWindow && initialRun && hasChatPanel && chatEnabled) closeLiveChat();
        else document.body.classList.remove('CentAnni-close-live-chat');
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
            toggleTheaterMode();
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

            if (thumbnailOverlayImage && thumbnailOverlay && lastVideoID !== vinteo) {
                thumbnailOverlay.style.cssText = 'display: block';
                void thumbnailOverlayImage.offsetHeight;
                thumbnailOverlayImage.style.cssText = `
                display: block;
                z-index: 10;
                background-image: url("https://i.ytimg.com/vi/${vinteo}/maxresdefault.jpg");
            `;}
        }
    }

    // channel page redirect to videos
    function channelRedirect() {
        window.location.href = window.location.href.replace(/\/$/, '') + '/videos';
    }

    // reset function
    function handleYTNavigation() {
        if (USER_CONFIG.preventAutoplay) document.addEventListener('yt-player-updated', pauseYouTubeVideo);

        document.querySelectorAll('.button-wrapper, .remaining-time-container, #progress-bar-bar, #progress-bar-start, #progress-bar-end, #yt-transcript-settings-modal, .sub-panel-overlay').forEach(el => el.remove());
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
    document.addEventListener('fullscreenchange', fullscreenCheck); // fullscreen check
    if (USER_CONFIG.preventAutoplay) document.addEventListener('yt-player-updated', pauseYouTubeVideo); // prevent autoplay
    document.addEventListener('yt-set-theater-mode-enabled', theaterModeCheck); // theater mode check
    document.addEventListener('yt-service-request-completed', handleYouTubeNavigation); // for chrome
})();
