// ==UserScript==
// @name         YouTube Transcript Exporter
// @description  Export a YouTube video transcript to LLMs or download it as a text file; easy customization via a settings panel; additional features: persistent progress bar with chapter markers, display remaining time based on playback speed, auto-open chapter panel, links in header, customize css, color code videos on home.
// @author       Tim Macy
// @license      GNU AFFERO GENERAL PUBLIC LICENSE-3.0
// @version      7.3.1
// @namespace    TimMacy.YouTubeTranscriptExporter
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @noframes
// @homepageURL  https://github.com/TimMacy/YouTubeTranscriptExporter
// @supportURL   https://github.com/TimMacy/YouTubeTranscriptExporter/issues
// @updateURL    https://raw.githubusercontent.com/TimMacy/YouTubeTranscriptExporter/refs/heads/main/YouTubeTranscriptExporter.js
// @downloadURL  https://raw.githubusercontent.com/TimMacy/YouTubeTranscriptExporter/refs/heads/main/YouTubeTranscriptExporter.js
// ==/UserScript==

(async function() {
    'use strict';
    // CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
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
            font-family: "Roboto","Arial",sans-serif;
            font-size: 16px;
            color: white;
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
        .buttonIconSettings-input-field:focus, .links-header-container input:focus, .sidebar-container input:focus { border: 1px solid hsl(0, 0%, 100%); }

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
            border-radius: 3px;
            transition: all 0.2s ease-out;
        }

        .btn-style-settings:hover { color: white; background-color: rgba(255,255,255,0.2); border-color: transparent; }
        .button-icons { display: block; font-family: "Roboto","Arial",sans-serif; font-size: 1.4em; line-height: 1.5em; font-weight: 500; }
        .icons-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .container-button { display: flex; flex-direction: column; align-items: center; margin: 5px 0 0 0; }

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

        .container-button-input:focus { color: white; background-color: hsl(0, 0%, 10.37%); border-radius: 3px; }
        .spacer-top { height: 10px; }

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
                
        .input-field-url:focus { color: white; background-color: hsl(0, 0%, 10.37%); border-radius: 3px; }
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
            border-radius: 3px;
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
            margin: 10px 0;
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
            height: 432px;
            color: white;
            background-color: hsl(0, 0%, 10.37%);
            border: 1px solid hsl(217, 91%, 59%);
            border-radius: 3px;
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
            border-radius: 3px;
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

        .buttons-left:hover { color: #ff0000; }
        .buttons-left:active { color:rgb(200, 25, 25); }

        .sub-panel-overlay {
            position: fixed;
            z-index: 2100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(1px);
        }

        .sub-panel {
            z-index: 2177;
            background-color: rgba(17, 17, 17, 0.8);
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 8px;
            width: 50vw;
            max-width: 70vw;
            max-height: 80vh;
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
            z-index: 2078;
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

        #color-code-videos-form .checkbox-container { margin: 20px 0 0 0; }
        #color-code-videos-form .label-style-settings { margin: 20px 0 10px 0; }
        #color-code-videos-form > div.videos-old-container > span { margin: 0; }
        #custom-css-form .checkbox-container { margin: 20px 0; }

        #custom-css-form .file-naming-container {
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

        input[type="range"] {
            -webkit-appearance: none; /* Remove default styling */
            appearance: none;
            width: 100%; /* Full width */
            height: 6px; /* Height of the track */
            background: #ccc; /* Track color */
            border-radius: 5px; /* Rounded corners for the track */
            outline: none; /* Remove outline */
        }

        input[type="range"]::-moz-range-thumb,
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; /* Remove default styling */
            appearance: none;
            width: 16px; /* Width of the thumb */
            height: 16px; /* Height of the thumb */
            background: #007bff; /* Thumb color */
            border-radius: 50%; /* Make the thumb round */
            cursor: pointer; /* Add a pointer cursor */
            border: 2px solid #ffffff; /* Add a white border for visibility */
        }

        input[type="range"]::-moz-range-track,
        input[type="range"]::-webkit-slider-runnable-track {
            background: #007bff; /* Track color */
            height: 6px; /* Height of the track */
            border-radius: 5px; /* Rounded corners */
        }

        .videos-old-container {
            display: flex;
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
            gap: 25px; 
        }

        .videos-age-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            gap: 10px;
        }

        .videos-age-row span {
            text-align: right;
            flex: 1;
            max-width: 50%;
        }

        .videos-age-row input {
            flex: 1; 
            margin: 0 0 0 10px;
            max-width: 70px;
            height: 35px;
            cursor: pointer;
        }

        .number-input-container {
            margin: 20px 0;
        }

        .number-input-field {
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
    `;

    document.head.appendChild(styleSheet);

    // CSS Progress Bar
    function ProgressBarCSS() {
        const progressBarCSS = document.createElement('style');
        progressBarCSS.textContent = `
            #ProgressBar-bar {
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                position: absolute;
                bottom: 0;
                opacity: 0;
                z-index: 50;
            }

            #ProgressBar-progress, #ProgressBar-buffer {
                width: 100%;
                height: 3px;
                transform-origin: 0 0;
                position: absolute;
            }

            #ProgressBar-progress {
                background: #f00;
                filter: none;
                z-index: 1;
            }

            .ytp-autohide .ytp-chrome-bottom .ytp-load-progress, .ytp-autohide .ytp-chrome-bottom .ytp-play-progress { display: none !important; }
            .ytp-autohide .ytp-chrome-bottom { opacity: 1 !important; display: block !important; }
            .ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls { opacity: 0 !important; }
            .ad-interrupting #ProgressBar-progress { background: transparent; }
            .ytp-ad-persistent-progress-bar-container { display: none; }
            #ProgressBar-buffer { background: rgba(255, 255, 255, 0.4); }

            .ytp-autohide #ProgressBar-start.active, 
            .ytp-autohide #ProgressBar-bar.active, 
            .ytp-autohide #ProgressBar-end.active 
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

            #ProgressBar-start, #ProgressBar-end {
                position: absolute;
                height: 3px;
                width: 12px;
                bottom: 0;
                z-index: 2077;
                opacity: 0;
                pointer-events: none;
            }

            :fullscreen #ProgressBar-start, :fullscreen #ProgressBar-end { width: 24px; }
            :-webkit-full-screen #ProgressBar-start, :-webkit-full-screen #ProgressBar-end { width: 24px; }

            #ProgressBar-start {
                left: 0;
                background: #f00;
            }

            #ProgressBar-end {
                right: 0;
                background: rgba(255, 255, 255, 0.2);
            }
        `;

        document.head.appendChild(progressBarCSS);
    }

    // customCSS
    function customCSS() {
        const customCSS = document.createElement('style');
        customCSS.textContent = `
            .yte-style-hide-default-sidebar {
                ytd-mini-guide-renderer.ytd-app { display: none !important; }
                ytd-app[mini-guide-visible] ytd-page-manager.ytd-app { margin-left: 0 !important; }
                #guide-button.ytd-masthead { display: none !important; }
                #contents.ytd-rich-grid-renderer { justify-content: center !important; }
            }

            html {
                font-size: var(--fontSize) !important;
                font-family: "Roboto", Arial, sans-serif;
            }

            #video-title.ytd-rich-grid-media {
                text-transform: var(--textTransform);
            }

            ytd-compact-video-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer),
            ytd-rich-item-renderer ytd-thumbnail:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                opacity: var(--watchedOpacity);
            }

            .yte-style-hide-watched-videos-global {
                ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                    display: none;
                }
            }

            .ytd-page-manager[page-subtype="home"],
            .ytd-page-manager[page-subtype="channels"],
            .ytd-page-manager[page-subtype="subscriptions"] {
                .style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-items-per-row: var(--itemsPerRow) !important;
                    --ytd-rich-grid-posts-per-row: var(--itemsPerRow) !important;
                    --ytd-rich-grid-slim-items-per-row: var(--itemsPerRowCalc);
                    --ytd-rich-grid-game-cards-per-row: var(--itemsPerRowCalc);
                    --ytd-rich-grid-mini-game-cards-per-row: var(--itemsPerRowCalc);
                }
            }

            .yte-style-hide-voice-search {
                #voice-search-button.ytd-masthead { display: none; }
            }

            .yte-style-hide-create-button {
                #buttons.ytd-masthead > .ytd-masthead:first-child { display: none; }
            }

            .yte-style-hide-miniplayer {
                .miniplayer.ytd-miniplayer { display: none; }
                ytd-miniplayer { display: none; }
            }

            .yte-style-sqaure-search-bar {
                #center.ytd-masthead { flex: 0 1 500px; }
                .YtSearchboxComponentInputBox { border: 1px solid hsl(0,0%,18.82%); border-radius: 0; }
                .YtSearchboxComponentSuggestionsContainer { border-radius: 0 0 10px 10px; }
                .YtSearchboxComponentSearchButtonDark { display: none; }
                .YtSearchboxComponentHost { margin: 0; }

                .ytSearchboxComponentInputBox { border: 1px solid hsl(0,0%,18.82%); border-radius: 0; }
                .ytSearchboxComponentSuggestionsContainer { border-radius: 0 0 10px 10px; }
                .ytSearchboxComponentSearchButtonDark { display: none; }
                .ytSearchboxComponentHost { margin: 0; }
            }

            .yte-style-sqaure-design {
                .ytd-page-manager[page-subtype="home"] {
                    yt-chip-cloud-chip-renderer { 
                        border-radius: 3px; 
                    }
                }

                .ytd-page-manager[page-subtype="channels"] {
                    .yt-image-banner-view-model-wiz--inset,
                    yt-chip-cloud-chip-renderer { 
                        border-radius: 0 !important; 
                    }

                    .yt-spec-button-shape-next--size-m {
                        border-radius: 3px;
                    }
                }

                .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start { border-radius: 3px 0 0 3px; }
                .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end { border-radius: 0 3px 3px 0; }

                ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]),
                .yt-spec-button-shape-next--size-s,
                .yt-spec-button-shape-next--size-m,
                #description.ytd-watch-metadata,
                ytd-multi-page-menu-renderer,
                yt-chip-cloud-chip-renderer,
                .ytChipShapeChip {
                    border-radius: 3px;
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

            .yte-style-compact-layout {
                .ytd-page-manager[page-subtype="home"],
                .ytd-page-manager[page-subtype="channels"],
                .ytd-page-manager[page-subtype="subscriptions"] {
                    ytd-rich-section-renderer { display: none; }
                
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
                        top: 50px; 
                        right: auto; 
                        left: 3px; 
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
                
                    ytd-rich-section-renderer { 
                        display: none; 
                    }
                
                    ytd-menu-renderer.ytd-rich-grid-media { 
                        position: absolute; 
                        top: 4em; 
                        right: 5%; 
                        left:-auto; 
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
                
                ytd-browse[page-subtype="channels"] #contentContainer {
                    padding-top: 0 !important;
                }
                
                ytd-browse[page-subtype="channels"] tp-yt-app-header {
                    position: static !important;
                    transform: none !important;
                    transition: none !important;
                }
                
                ytd-browse[page-subtype="channels"] tp-yt-app-header[fixed] {
                    position: static !important;
                    transform: none !important;
                    transition: none !important;
                }
                
                ytd-browse[page-subtype="channels"] tp-yt-app-header #page-header {
                position: static !important;
                    transform: none !important;
                }
                
                .ytd-page-manager[page-subtype="subscriptions"] {
                    ytd-menu-renderer.ytd-rich-grid-media { 
                        position: absolute; 
                        top: 50px; 
                        right: auto; 
                        left: 3px; 
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
                .yte-style-live-video, .yte-style-upcoming-video, .yte-style-newly-video, .yte-style-recent-video, .yte-style-lately-video, .yte-style-old-video { outline: 2px solid; }

                .yte-style-live-video { outline-color: var(--liveVideo);}
                .yte-style-streamed-text { color: var(--streamedText);}
                .yte-style-upcoming-video { outline-color: var(--upComingVideo);}
                .yte-style-newly-video { outline-color: var(--newlyVideo);}
                .yte-style-recent-video { outline-color: var(--recentVideo);}
                .yte-style-lately-video { outline-color: var(--latelyVideo);}
                .yte-style-old-video { opacity: var(--oldVideo);}
            }

            .yte-style-hide-watched-videos {
                .ytd-page-manager[page-subtype="home"] {
                    ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                        display: none;
                    }
                }
            }
        `;

        document.head.appendChild(customCSS);
    }

    // default configuration
    const DEFAULT_CONFIG = {
        targetChatGPTUrl: 'https://ChatGPT.com/',
        targetNotebookLMUrl: 'https://NotebookLM.Google.com/',
        fileNamingFormat: 'title-channel',
        includeTimestamps: true,
        includeChapterHeaders: true,
        openSameTab:true,
        autoOpenChapters: true,
        DisplayRemainingTime: true,
        ProgressBar: true,
        preventBackgroundExecution: true,
        ChatGPTPrompt: `You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic the YouTuber's communication style perfectly. Respond only in English while being mindful of American English spelling, vocabulary, and a casual, conversational tone. You prefer to use clauses instead of complete sentences. Do not answer any question from the transcript. Respond only in chat. Do not open a canvas. Ask for permission to search the web. Do not hallucinate. Do not make up factual information. Do not speculate. Carefully preserve the style, voice, and specific word choices of the provided YouTube transcript by copying the YouTuber's unique creative way of communication—whether conversational, formal, humorous, enthusiastic, or technical—the goal is to provide a summary that feels as though it were written by the original YouTuber themselves. Summarize the provided YouTube transcript into a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them. Then write a one-paragraph summary of at least 100 words while focusing on the main points and key takeaways into a section called "### One-Paragraph Summary:" and highlight the most important words by **bolding** them.`,
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
        buttonLeft6Url: 'https://www.youtube.com/@Formula1/videos',
        buttonLeft7Text: '',
        buttonLeft7Url: 'https://www.youtube.com/@SkySportsF1/videos',
        mButtonText: '☰',
        mButtonDisplay: false,
        colorCodeVideosEnabled: true,
        videosHideWatched: false,
        videosOldOpacity: 0.5,
        videosAgeColorPickerNewly: '#FFFF00', 
        videosAgeColorPickerRecent: '#FFA500', 
        videosAgeColorPickerLately: '#0000FF', 
        videosAgeColorPickerLive: '#FF0000',
        videosAgeColorPickerStreamed: '#FF0000',
        videosAgeColorPickerUpcoming: '#32CD32',
        textTransform: 'normal-case',
        defaultFontSize: 10,
        videosWatchedOpacity: 0.5,
        videosPerRow: 3,
        videosHideWatchedGlobal: false,
        hideVoiceSearch: false,
        hideCreateButton: false,
        hideMiniPlayer: false,
        squareSearchBar: true,
        squareDesign: false,
        compactLayout: false,
    };

    // load user configuration or use defaults
    let storedConfig = {};
    try {
        storedConfig = await GM.getValue('USER_CONFIG', {});
    } catch (error) {
        showNotification('Error loading user save!');
        console.error("YTE: Error loading user configuration:", error);
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

        // buttonsLeft - sidebar visibility
        if (USER_CONFIG.mButtonDisplay) { body.classList.add('yte-style-hide-default-sidebar'); } else { body.classList.remove('yte-style-hide-default-sidebar'); }

        // custom css
        document.documentElement.style.setProperty('--textTransform', USER_CONFIG.textTransform);
        document.documentElement.style.setProperty('--fontSize', `${USER_CONFIG.defaultFontSize}px`);
        document.documentElement.style.setProperty('--watchedOpacity', USER_CONFIG.videosWatchedOpacity);
        document.documentElement.style.setProperty('--itemsPerRow', USER_CONFIG.videosPerRow);
        document.documentElement.style.setProperty('--itemsPerRowCalc', USER_CONFIG.videosPerRow + 2);
        if (USER_CONFIG.videosHideWatchedGlobal) { body.classList.add('yte-style-hide-watched-videos-global'); } else { body.classList.remove('yte-style-hide-watched-videos-global'); }
        if (USER_CONFIG.hideVoiceSearch) { body.classList.add('yte-style-hide-voice-search'); } else { body.classList.remove('yte-style-hide-voice-search'); }
        if (USER_CONFIG.hideCreateButton) { body.classList.add('yte-style-hide-create-button'); } else { body.classList.remove('yte-style-hide-create-button'); }
        if (USER_CONFIG.hideMiniPlayer) { body.classList.add('yte-style-hide-miniplayer'); } else { body.classList.remove('yte-style-hide-miniplayer'); }
        if (USER_CONFIG.squareSearchBar) { body.classList.add('yte-style-sqaure-search-bar'); } else { body.classList.remove('yte-style-sqaure-search-bar'); }
        if (USER_CONFIG.squareDesign) { body.classList.add('yte-style-sqaure-design'); } else { body.classList.remove('yte-style-sqaure-design'); }
        if (USER_CONFIG.compactLayout) { body.classList.add('yte-style-compact-layout'); } else { body.classList.remove('yte-style-compact-layout'); }

        // color code videos
        if (USER_CONFIG.videosHideWatched) { body.classList.add('yte-style-hide-watched-videos'); } else { body.classList.remove('yte-style-hide-watched-videos'); }
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
        header.href = 'https://github.com/TimMacy/YouTubeTranscriptExporter';
        header.target = '_blank';
        header.innerText = 'YouTube Transcript Exporter';
        header.title = 'GitHub Repository for YouTube Transcript Exporter';
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

        // Spacer-Top
        const spacerTop = document.createElement('div');
        spacerTop.classList.add('spacer-top');
        form.appendChild(spacerTop);

        // File Naming Format
        form.appendChild(createSelectField('Text File Naming Format:', 'label-download', 'fileNamingFormat', USER_CONFIG.fileNamingFormat, {
            'title-channel': 'Title - Channel.txt (default)',
            'channel-title': 'Channel - Title.txt',
            'date-title-channel': 'uploadDate - Title - Channel.txt',
            'date-channel-title': 'uploadDate - Channel - Title.txt',
        }));

        // include Timestamps
        form.appendChild(createCheckboxField('Include Timestamps in the Transcript (default: yes)', 'includeTimestamps', USER_CONFIG.includeTimestamps));

        // include Chapter Headers
        form.appendChild(createCheckboxField('Include Chapter Headers in the Transcript (default: yes)', 'includeChapterHeaders', USER_CONFIG.includeChapterHeaders));

        // open in Same Tab
        form.appendChild(createCheckboxField('Open Links in the Same Tab (default: yes)', 'openSameTab', USER_CONFIG.openSameTab));

        // Auto Open Chapter Panel
        form.appendChild(createCheckboxField('Automatically Open the Chapter Panel (default: yes)', 'autoOpenChapters', USER_CONFIG.autoOpenChapters));

        // Display Remaining Time
        form.appendChild(createCheckboxField('Display Remaining Time Under the Video (default: yes)', 'DisplayRemainingTime', USER_CONFIG.DisplayRemainingTime));

        // keep Progress Bar Visible
        form.appendChild(createCheckboxField('Keep the Progress Bar Visible (default: yes)', 'ProgressBar', USER_CONFIG.ProgressBar));

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
        customCSSButton.innerText = 'Customize CSS';
        customCSSButton.classList.add('btn-style-settings');
        customCSSButton.onclick = () => showSubPanel(createCustomCSSContent(), 'createcustomCSS');

        const ColorCodeVideos = document.createElement('button');
        ColorCodeVideos.type = 'button';
        ColorCodeVideos.innerText = 'Color Code Videos';
        ColorCodeVideos.classList.add('btn-style-settings');
        ColorCodeVideos.onclick = () => showSubPanel(createColorCodeVideosContent(), 'colorCodeVideos');

        extraSettings.appendChild(buttonsLeft);
        extraSettings.appendChild(customCSSButton);
        extraSettings.appendChild(ColorCodeVideos);

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
                console.error("YTE: Error resetting settings to default:", error);
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
            const endHeight = 432;
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
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // close modal with ESC key
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            }
        });

        // sub-panels
        function showSubPanel(panelContent, panelId) {
            let subPanelOverlay = document.querySelector(`.sub-panel-overlay[data-panel-id="${panelId}"]`);

            if (subPanelOverlay) { subPanelOverlay.style.display = 'flex'; } 
            else {
                subPanelOverlay = document.createElement('div');
                subPanelOverlay.classList.add('sub-panel-overlay');
                subPanelOverlay.setAttribute('data-panel-id', panelId);

                const subPanel = document.createElement('div');
                subPanel.classList.add('sub-panel');

                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.innerText = 'Close';
                closeButton.classList.add('btn-style-settings');
                closeButton.onclick = () => { subPanelOverlay.style.display = 'none'; };
                subPanel.appendChild(closeButton);

                if (panelContent) { subPanel.appendChild(panelContent); }
            
                subPanelOverlay.appendChild(subPanel);
                document.body.appendChild(subPanelOverlay);
            }
        }

        // links in header
        function createLinksInHeaderContent() {
            const form = document.createElement('form');
            form.id = 'links-in-header-form';

            const subPanelHeader = document.createElement('div');
            subPanelHeader.classList.add('sub-panel-header');
            subPanelHeader.textContent = 'Configure the links on the left side of the YouTube header';
            form.appendChild(subPanelHeader);

            const infoLinksHeader = document.createElement('small');
            infoLinksHeader.innerText = "Up to seven links can be added next to the logo. An empty 'Link Text' field won't insert the link into the header.\nIf the left navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.";
            infoLinksHeader.classList.add('chrome-info');
            form.appendChild(infoLinksHeader);

            const sidebarContainer = document.createElement('div');
            sidebarContainer.classList.add('sidebar-container'); 

            // hide left navigation bar and replacement icon
            const checkboxField = createCheckboxField('Hide Left Navigation Bar', 'mButtonDisplay', USER_CONFIG.mButtonDisplay);
            sidebarContainer.appendChild(checkboxField);

            const inputField = createInputField('Left Navigation Bar Replacement Icon', 'mButtonText', USER_CONFIG.mButtonText, 'label-mButtonText');
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
            subPanelHeader.textContent = 'Customize YouTube Appearance';
            form.appendChild(subPanelHeader);

            // dim watched videos
            const videosWatchedContainer = createSliderInputField( 'Change Opacity of Watched Videos (default 0.5):', 'videosWatchedOpacity', USER_CONFIG.videosWatchedOpacity, '0', '1', '0.1' );
            form.appendChild(videosWatchedContainer);

            // text transform
            form.appendChild(createSelectField('Text Transform:', 'label-Text-Transform', 'textTransform', USER_CONFIG.textTransform, {
                'uppercase': 'uppercase - THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.',
                'lowercase': 'lowercase - the quick brown fox jumps over the lazy dog.',
                'capitalize': 'capitalize - The Quick Brown Fox Jumps Over The Lazy Dog.',
                'normal-case': 'normal-case (default) - The quick brown fox jumps over the lazy dog.',
            }));

            // font size
            const defaultFontSizeField = createNumberInputField('Font Size (default: 10px)', 'defaultFontSize', USER_CONFIG.defaultFontSize);
            form.appendChild(defaultFontSizeField);

            // videos per row
            const videosPerRow = createNumberInputField('Number of Videos per Row (default: 3)', 'videosPerRow', USER_CONFIG.videosPerRow);
            form.appendChild(videosPerRow);

            // hide voice search button
            const hideVoiceSearch = createCheckboxField('Hide Voice Search Button in the Header (default: no)', 'hideVoiceSearch', USER_CONFIG.hideVoiceSearch);
            form.appendChild(hideVoiceSearch);

            // hide create button
            const hideCreateButton = createCheckboxField('Hide Create Button in the Header (default: no)', 'hideCreateButton', USER_CONFIG.hideCreateButton);
            form.appendChild(hideCreateButton);

            // hide watched videos globally
            const videosHideWatchedGlobal = createCheckboxField('Hide Watched Videos Globally (default: no)', 'videosHideWatchedGlobal', USER_CONFIG.videosHideWatchedGlobal);
            form.appendChild(videosHideWatchedGlobal);

            // hide miniplayer
            const hideMiniplayer = createCheckboxField('Hide Miniplayer (default: no)', 'hideMiniplayer', USER_CONFIG.hideMiniplayer);
            form.appendChild(hideMiniplayer);

            // square and compact search bar
            const squareSearchBar = createCheckboxField('Square and Compact Search Bar (default: yes)', 'squareSearchBar', USER_CONFIG.squareSearchBar);
            form.appendChild(squareSearchBar);

            // square design
            const squareDesign = createCheckboxField('Square Design (default: no)', 'squareDesign', USER_CONFIG.squareDesign);
            form.appendChild(squareDesign);

            // compact layout
            const compactLayout = createCheckboxField('Compact Layout (default: no)', 'compactLayout', USER_CONFIG.compactLayout);
            form.appendChild(compactLayout);

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
        USER_CONFIG.fileNamingFormat = form.elements.fileNamingFormat.value;
        USER_CONFIG.includeTimestamps = form.elements.includeTimestamps.checked;
        USER_CONFIG.includeChapterHeaders = form.elements.includeChapterHeaders.checked;
        USER_CONFIG.openSameTab = form.elements.openSameTab.checked;
        USER_CONFIG.autoOpenChapters = form.elements.autoOpenChapters.checked;
        USER_CONFIG.DisplayRemainingTime = form.elements.DisplayRemainingTime.checked;
        USER_CONFIG.ProgressBar = form.elements.ProgressBar.checked;
        USER_CONFIG.preventBackgroundExecution = form.elements.preventBackgroundExecution.checked;
        USER_CONFIG.ChatGPTPrompt = form.elements.ChatGPTPrompt.value;
    
        // initialize buttonIcons if not already
        USER_CONFIG.buttonIcons = USER_CONFIG.buttonIcons || {};
    
        // save button icons, removing empty values to use defaults
        const buttonIconDownload = form.elements.buttonIconDownload.value.trim();
        const buttonIconChatGPT = form.elements.buttonIconChatGPT.value.trim();
        const buttonIconNotebookLM = form.elements.buttonIconNotebookLM.value.trim();
        const buttonIconSettings = form.elements.buttonIconSettings.value.trim();
    
        if (buttonIconDownload !== '') { USER_CONFIG.buttonIcons.download = buttonIconDownload; } else { delete USER_CONFIG.buttonIcons.download; }
        if (buttonIconChatGPT !== '') { USER_CONFIG.buttonIcons.ChatGPT = buttonIconChatGPT; } else { delete USER_CONFIG.buttonIcons.ChatGPT; }
        if (buttonIconNotebookLM !== '') { USER_CONFIG.buttonIcons.NotebookLM = buttonIconNotebookLM; } else { delete USER_CONFIG.buttonIcons.NotebookLM; }
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
            USER_CONFIG.hideVoiceSearch = subPanelCustomCSS.elements.hideVoiceSearch.checked;
            USER_CONFIG.hideCreateButton = subPanelCustomCSS.elements.hideCreateButton.checked;
            USER_CONFIG.hideMiniplayer = subPanelCustomCSS.elements.hideMiniplayer.checked;
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
            console.error("YTE: Error saving user configuration:", error);
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
            a.download = `YouTube-Transcript-Exporter_v${scriptVersion}_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('Settings have been exported.');
            } catch (error) {
                showNotification("Error exporting settings!");
                console.error("YTE: Error exporting user settings:", error);
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
            { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Transcript Exporter Settings', ariaLabel: 'YouTube Transcript Exporter Settings.' },
            { id: 'transcript-download-button', text:USER_CONFIG.buttonIcons.download, clickHandler: handleDownloadClick, tooltip: 'Download Transcript as a Text File', ariaLabel: 'Download Transcript as a Text File.' },
            { id: 'transcript-ChatGPT-button', text:USER_CONFIG.buttonIcons.ChatGPT, clickHandler: handleChatGPTClick, tooltip: 'Copy Transcript with a Prompt and Open ChatGPT', ariaLabel: 'Copy Transcript to Clipboard with a Prompt and Open ChatGPT.' },
            { id: 'transcript-NotebookLM-button', text:USER_CONFIG.buttonIcons.NotebookLM, clickHandler: handleNotebookLMClick, tooltip: 'Copy Transcript and Open NotebookLM', ariaLabel: 'Copy Transcript to Clipboard and Open NotebookLM.' }
        ];
    
        buttonLocation(buttons, addButton);
    }

    function addSettingsButton() {

        if (document.querySelector('.button-wrapper')) return;

        const buttons = [ { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Transcript Exporter Settings', ariaLabel: 'YouTube Transcript Exporter Settings.' }, ];

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
                alert('Transcript unavailable or cannot be found.\nPlease ensure the "Show transcript" button exists.');
                console.log("YTE: Transcript button not found. Subtitles/closed captions unavailable or language unsupported.");
                return;
            }
        }

        // check if the transcript has loaded
        const transcriptItems = document.querySelectorAll('ytd-transcript-segment-list-renderer ytd-transcript-segment-renderer');
        if (transcriptItems.length > 0) {
            callback();
        } else {
            alert('Transcript has not loaded successfully.\nPlease reload this page.');
            console.log("YTE: Transcript has not loaded.");
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
            //console.error("YTE: Transcript container not found.");
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
          const panel = document.querySelector( 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]' );
          if (!panel) {
            console.log('YTE: Transcript panel not found. Reload the page to try again.');
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

          panel.classList.add("transcript-preload");
          panel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");

          let loaded = false;

          const observer = new MutationObserver(() => {
            const transcriptItems = panel.querySelectorAll("ytd-transcript-segment-renderer");
            if (transcriptItems.length > 0) {
              loaded = true;
              cleanup(false);
              clearTimeout(fallbackTimer);
              observer.disconnect();
              resolve();
            }
          });

          observer.observe(panel, { childList: true, subtree: true });

          const fallbackTimer = setTimeout(() => {
            if (!loaded) {
              console.error( "YTE: The transcript took too long to load. Reload the page to try again." );
              observer.disconnect();
              cleanup(true);
              reject();
            }
          }, 6000);

          function cleanup(failed) {
            notification.remove();
            panel.classList.remove("transcript-preload");
            panel.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
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

    // function to automatically open the chapter panel
    function openChapters() {
        const panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]') ||
                    document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-auto-chapters"]');
        
        if (panel) {
            panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
        } //else { console.log("YTE: Chapter panel not found or does not exist."); }
    }

    // function to display the remaining time based on playback speed
    function RemainingTime() {
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
    
        // hide for live video
        const timeDisplay = document.querySelector('.ytp-time-display');
        if (!timeDisplay) { console.error("YTE: RemainingTime: Required querySelector not found."); return; }
    
        const detectLive = () => {
            if (timeDisplay.classList.contains('ytp-live')) {
                element.classList.add('live');
            } else { element.classList.remove('live'); }
        };
    
        detectLive();
        new MutationObserver(detectLive).observe(timeDisplay, { attributes: true });
    
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
        document.documentElement.classList.add('ProgressBar');
    
        const player = document.querySelector('.html5-video-player');
        const video = document.querySelector('video[src]');
        const timeDisplay = document.querySelector('.ytp-time-display');
        const chaptersContainer = player && player.querySelector('.ytp-chapters-container');
        const progressBarContainer = player && player.querySelector('.ytp-progress-bar-container');
    
        if (!player || !video || !timeDisplay) { console.error("YTE: ProgressBar: A Required querySelector Not Found."); return; }
        if (!progressBarContainer) { console.error("YTE: ProgressBar: Progress Bar Container Not Found."); return; }
    
        const bar = document.createElement('div');
        bar.id = 'ProgressBar-bar';
    
        const progress = document.createElement('div');
        progress.id = 'ProgressBar-progress';
    
        const buffer = document.createElement('div');
        buffer.id = 'ProgressBar-buffer';
    
        const startDiv = document.createElement('div');
        startDiv.id = 'ProgressBar-start';
    
        const endDiv = document.createElement('div');
        endDiv.id = 'ProgressBar-end';
    
        player.appendChild(bar);
        bar.appendChild(buffer);
        bar.appendChild(progress);
        player.appendChild(startDiv);
        player.appendChild(endDiv);
    
        progress.style.transform = 'scaleX(0)';
    
        // live video check
        let isLive = null;
    
        const detectLive = () => {
            const live = timeDisplay.classList.contains('ytp-live');
            if (live !== isLive) {
                isLive = live;
                if (isLive) {
                    bar.classList.remove('active');
                    startDiv.classList.remove('active');
                    endDiv.classList.remove('active');
                } else {
                    bar.classList.add('active');
                    startDiv.classList.add('active');
                    endDiv.classList.add('active');
                }
            }
        };
        
        detectLive();

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

    // sidebar and left header links
    function buttonsLeft() {
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
    function ColorCodeVideos() { 
console.log("ColorCodeVideos: Initializing and attaching event listener.");
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
console.log("ColorCodeVideos processVideos: Called.");
            document.querySelectorAll('[class*="ytd-video-meta-block"]').forEach(el => {
                const textContent = el.textContent.trim().toLowerCase();
                for (const [className, ages] of Object.entries(categories)) {
                    if (ages.some(age => textContent.includes(age.toLowerCase()))) {
                        const videoContainer = el.closest('ytd-rich-item-renderer');
                        if (videoContainer && !videoContainer.classList.contains(`yte-style-${className}-video`)) {
                            videoContainer.classList.add(`yte-style-${className}-video`);
                        }
                    }
                }
            });
        
            document.querySelectorAll('span.ytd-video-meta-block').forEach(el => {
                const text = el.textContent;
                const videoContainer = el.closest('ytd-rich-item-renderer');
                if (!videoContainer) return;
        
                if (/Scheduled for/i.test(text) && !videoContainer.classList.contains('yte-style-upcoming-video')) {
                    videoContainer.classList.add('yte-style-upcoming-video');
                }
        
                if (/Streamed/i.test(text) && !el.querySelector('.yte-style-streamed-text')) {
                    el.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && /Streamed/i.test(node.nodeValue)) {
                            const span = document.createElement('span');
                            span.className = 'yte-style-streamed-text';
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
            setTimeout(() => { 
                processVideos(); 
            }, 2000); 
        });
    }

    // initiate the script
    let lastVideoURL = null;

    async function initializeTranscript(currentVideoURL) {
        if (USER_CONFIG.preventBackgroundExecution) { await ChromeUserWait(); }
        buttonsLeft();

        const isVideoPage = /^https:\/\/.*\.youtube\.com\/watch\?v=/.test(currentVideoURL);
        if (isVideoPage) {
            if (USER_CONFIG.autoOpenChapters) { openChapters(); }
            if (USER_CONFIG.DisplayRemainingTime) { RemainingTime(); }
            if (USER_CONFIG.ProgressBar) { ProgressBarCSS(); keepProgressBarVisible(); }

            let transcriptLoaded = false;
            try { await preLoadTranscript(); transcriptLoaded = true; } 
            catch (error) { setTimeout(() => { addSettingsButton(); }, 3000); }
            if (transcriptLoaded) { addButton(); }
            //console.log("YTE: YouTube Transcript Exporter Initialized: On Video Page.");
        } else { 
            addSettingsButton();
            //console.log("YTE: YouTube Transcript Exporter Initialized: On Normal Page."); 
            if (window.location.href !== "https://www.youtube.com/") { return; }
            if (USER_CONFIG.colorCodeVideosEnabled) { ColorCodeVideos(); }
        }
    }

    // YouTube navigation handler
    function handleYouTubeNavigation() {
        //console.log("YTE: Event Listner Arrived");
        const currentVideoURL = window.location.href;
        if (currentVideoURL !== lastVideoURL) {
            lastVideoURL = currentVideoURL;
            //console.log("YTE: Only One Survived");
            loadCSSsettings();
            customCSS();
            setTimeout(() => { initializeTranscript(currentVideoURL); }, 500);
        }
    }

    // reset
    function handleYTNavigation() {
        document.querySelectorAll(
          '.button-wrapper, .remaining-time-container, #yt-transcript-settings-modal, .sub-panel-overlay, #ProgressBar-bar, #ProgressBar-start, #ProgressBar-end, ProgressBar-progress, ProgressBar-buffer'
        ).forEach(el => el.remove());
    }

    // function due to the inadequacy of Chrome
    async function ChromeUserWait() {
        if (document.visibilityState !== 'visible') {
            //console.log("YTE: Waiting for this tab to become visible...");
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
    //document.addEventListener('yt-player-updated', handleYouTubeNavigation);
    //document.addEventListener('yt-update-title', handleYouTubeNavigation);
    //document.addEventListener('yt-page-type-changed', handleYouTubeNavigation);
    document.addEventListener('yt-service-request-completed', handleYouTubeNavigation); // for chrome
})();
