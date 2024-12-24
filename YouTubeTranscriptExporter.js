// ==UserScript==
// @name         YouTube - Transcript Exporter
// @description  Export a YouTube video transcript to LLMs or download it as a text file; easy customization via a settings panel; additional features: persistent progress bar with chapter markers, display remaining time based on playback speed, auto-open chapter panel.
// @author       Tim Macy
// @license      GNU AFFERO GENERAL PUBLIC LICENSE-3.0
// @version      7.0
// @published    2024-12-24
// @namespace    TimMacy.YouTubeTranscriptExporter
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @noframes
// @homepageURL  https://github.com/TimMacy/YouTubeTranscriptExporter
// @supportURL   https://github.com/TimMacy/YouTubeTranscriptExporter/issues
// @updateURL    URL
// @downloadURL  URL
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
        .buttonIconSettings-input-field:focus { border: 1px solid hsl(0, 0%, 100%); }

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
            margin-left: 10px; 
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
        /* .btn-style-settings:first-child { margin: 0 12px 0 0; } */
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

        .checkbox-label { 
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
            margin:-5px 0px 20px 24px; 
            pointer-events: none; 
            cursor: default; 
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
            margin-top: 30px;
            padding-top: 15px;
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
            gap: 13.5px;
        }

        .button-container-settings { 
            display: flex; 
            align-items: center; 
            
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
            visibility: hidden !important;
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
            margin: 0 10px;
            outline: none;
            background: transparent;
            border: none;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }

        .buttons-left:hover { color: #ff0000; }
        .buttons-left:active { color: #282828; }
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

    // CustomCSS function CustomCSS() {}

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
        ChatGPTPrompt: `You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic the YouTuber's communication style perfectly. Respond only in English while being mindful of American English spelling and vocabulary. You prefer to use clauses instead of complete sentences. Do not answer any question from the transcript. Respond only in chat. Do not open a canvas. Ask for permission to search the web. Do not hallucinate. Do not make up factual information. Do not speculate. Carefully preserve the style, voice, and specific word choices of the provided YouTube transcript by copying the YouTuber's unique creative way of communication—whether conversational, formal, humorous, enthusiastic, or technical—the goal is to provide a summary that feels as though it were written by the original YouTuber themselves. Summarize the provided YouTube transcript into a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them. Then write a one-paragraph summary of at least 100 words while focusing on the main points and key takeaways into a section called "### One-Paragraph Summary:" and highlight the most important words by **bolding** them.`,
        //ChatGPTPromptAlternative: ``,
        //activePrompt: "ChatGPTPrompt",
        buttonIcons: {
            settings: '⋮',
            download: '↓',
            ChatGPT: '💬',
            NotebookLM: '🎧'
        }
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

    // create and show the settings modal
    function showSettingsModal() {
        // check if the modal already exists
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

        // close modal on overlay click
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

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

        // Include Timestamps
        form.appendChild(createCheckboxField('Include Timestamps in the Transcript (default: yes)', 'includeTimestamps', USER_CONFIG.includeTimestamps));

        // Include Chapter Headers
        form.appendChild(createCheckboxField('Include Chapter Headers in the Transcript (default: yes)', 'includeChapterHeaders', USER_CONFIG.includeChapterHeaders));

        // Open in Same Tab
        form.appendChild(createCheckboxField('Open Links in the Same Tab (default: yes)', 'openSameTab', USER_CONFIG.openSameTab));

        // Auto Open Chapter Panel
        form.appendChild(createCheckboxField('Automatically Open the Chapter Panel (default: yes)', 'autoOpenChapters', USER_CONFIG.autoOpenChapters));

        // Display Remaining Time
        form.appendChild(createCheckboxField('Display Remaining Time Under the Video (default: yes)', 'DisplayRemainingTime', USER_CONFIG.DisplayRemainingTime));

        // Keep Progress Bar Visible
        form.appendChild(createCheckboxField('Keep the Progress Bar Visible (default: yes)', 'ProgressBar', USER_CONFIG.ProgressBar));

        // Prevent Execution in Background Tabs
        form.appendChild(createCheckboxField('Important for Chrome! (default: yes)', 'preventBackgroundExecution', USER_CONFIG.preventBackgroundExecution));

        // Info for Chrome
        const description = document.createElement('small');
        description.innerText = 'Prevents element duplication and early script execution in background tabs.\nWhile this feature is superfluous in Safari, it is essential for Chrome.';
        description.classList.add('chrome-info');
        form.appendChild(description);

        // ChatGPT Prompt
        form.appendChild(createTextareaField('ChatGPT Prompt:', 'ChatGPTPrompt', USER_CONFIG.ChatGPTPrompt, 'label-ChatGPT'));  
        
        // action buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container-end');

        // export and import button container
        const exportImportContainer = document.createElement('div');
        exportImportContainer.classList.add('button-container-backup');

        // const customCSSButton = document.createElement('button');
        // customCSSButton.type = 'button';
        // customCSSButton.innerText = 'Customize CSS';
        // customCSSButton.classList.add('btn-style-settings');
        // customCSSButton.onclick = CustomizeCSS;

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

        //exportImportContainer.appendChild(customCSSButton);
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

        // close modal with ESC key
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            }
        });
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

    // helper function to create a textarea field
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
        if (
            document.getElementById('transcript-ChatGPT-button') || 
            document.getElementById('transcript-NotebookLM-button') || 
            document.getElementById('transcript-download-button') || 
            document.getElementById('transcript-settings-button')
        ) return;
    
        const buttons = [
            { id: 'transcript-settings-button', text: USER_CONFIG.buttonIcons.settings, clickHandler: showSettingsModal, tooltip: 'YouTube Transcript Exporter Settings', ariaLabel: 'YouTube Transcript Exporter Settings.' },
            { id: 'transcript-download-button', text:USER_CONFIG.buttonIcons.download, clickHandler: handleDownloadClick, tooltip: 'Download Transcript as a Text File', ariaLabel: 'Download Transcript as a Text File.' },
            { id: 'transcript-ChatGPT-button', text:USER_CONFIG.buttonIcons.ChatGPT, clickHandler: handleChatGPTClick, tooltip: 'Copy Transcript with a Prompt and Open ChatGPT', ariaLabel: 'Copy Transcript to Clipboard with a Prompt and Open ChatGPT.' },
            { id: 'transcript-NotebookLM-button', text:USER_CONFIG.buttonIcons.NotebookLM, clickHandler: handleNotebookLMClick, tooltip: 'Copy Transcript and Open NotebookLM', ariaLabel: 'Copy Transcript to Clipboard and Open NotebookLM.' }
        ];
    
        buttonLocation(buttons, addButton);
    }

    function addSettingsButton() {
        if (
            document.getElementById('transcript-ChatGPT-button') || 
            document.getElementById('transcript-NotebookLM-button') || 
            document.getElementById('transcript-download-button') || 
            document.getElementById('transcript-settings-button')
        ) return;
    
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
            const panel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
            if (panel) {
                const masthead = document.querySelector('#end');
                const notification = document.createElement('div');
                notification.classList.add('notification-error');
                notification.classList.add('loading');
                const textSpan = document.createElement('span');
                textSpan.textContent = "Transcript Is Loading";
                notification.appendChild(textSpan);
                masthead.prepend(notification);

                panel.classList.add('transcript-preload');
                panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');

                let attempts = 0;
                const maxAttempts = 25;

                const intervalId = setInterval(() => {
                    const transcriptItems = panel.querySelectorAll('ytd-transcript-segment-renderer');
                    console.log(`YTE: Transcript Attempts ${attempts + 1}`);
                    if (transcriptItems.length > 0) {
                        panel.classList.remove('transcript-preload');
                        panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
                        clearInterval(intervalId);
                        notification.remove();
                        resolve();
                    } else if (++attempts >= maxAttempts) {
                        notification.remove();
                        panel.classList.remove('transcript-preload');
                        panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
                        console.error("YTE: The transcript took longer than six seconds to load. YouTube Transcript Exporter has been terminated. Reload the page to try again.");
                        showNotificationError("Transcript Failed to Load");
                        clearInterval(intervalId);
                        reject();
                    }
                }, 250);
            } else {
                console.log("YTE: Transcript panel not found or does not exist. YouTube Transcript Exporter has been terminated. Reload the page to try again.");
                showNotificationError("Transcript Not Available");
                reject();
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
        } else {
            //console.log("YTE: Chapter panel not found or does not exist.");
        }
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
        
            if (document.fullscreenElement && fullscreenContainer) { fullscreenContainer.appendChild(element);
            } else if (container) { 
                if (getComputedStyle(container).position === 'static') { container.style.position = 'relative'; }
                if (!element.parentNode || element.parentNode !== container) { container.prepend(element); }
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

    // buttonsLeft function buttonsLeft() {}

    // color code videos on home function ColorCodeVideos() {}

    // initiate the script
    let lastVideoURL = null;

    async function initializeTranscript(currentVideoURL) {
        if (USER_CONFIG.preventBackgroundExecution) { await ChromeUserWait(); }
        //buttonsLeft();

        const isVideoPage = /^https:\/\/.*\.youtube\.com\/watch\?v=/.test(currentVideoURL);
        if (isVideoPage) {
            const wrappers = document.querySelectorAll('.button-wrapper');
            wrappers.forEach(wrapper => wrapper.remove());

            let transcriptLoaded = false;
            try { await preLoadTranscript(); transcriptLoaded = true; } 
            catch (error) { setTimeout(() => { addSettingsButton(); }, 3000); }

            if (USER_CONFIG.autoOpenChapters) { openChapters(); }
            if (USER_CONFIG.DisplayRemainingTime) { RemainingTime(); }
            if (USER_CONFIG.ProgressBar) { ProgressBarCSS(); keepProgressBarVisible(); }
            if (transcriptLoaded) { addButton(); }
            //console.log("YTE: YouTube Transcript Exporter Initialized: On Video Page.");
        } else { 
            addSettingsButton();
            //console.log("YTE: YouTube Transcript Exporter Initialized: On Normal Page."); 
            //if (window.location.href !== "https://www.youtube.com/") { return; }
            //ColorCodeVideos();
        }
    }

    // YouTube navigation handler
    function handleYouTubeNavigation() {
        //console.log("YTE: Event Listner Arrived");
        const currentVideoURL = window.location.href;
        if (currentVideoURL !== lastVideoURL) {
            lastVideoURL = currentVideoURL;
            //console.log("YTE: Only One Survived");
            if (USER_CONFIG.preventBackgroundExecution) { ChromeReset(); }
            //CustomCSS();
            setTimeout(() => { initializeTranscript(currentVideoURL); }, 300);
        }
    }

    // reset function for Chrome
    function ChromeReset() {
        const wrappers = document.querySelectorAll('.button-wrapper');
        wrappers.forEach(wrapper => wrapper.remove());

        const timeContainer = document.querySelector('.remaining-time-container');
        if (timeContainer) { timeContainer.remove(); }

        const settingsModal = document.getElementById('yt-transcript-settings-modal');
        if (settingsModal) { settingsModal.remove(); }
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
    document.addEventListener('yt-navigate-finish', handleYouTubeNavigation); // default
    document.addEventListener('yt-page-data-updated', handleYouTubeNavigation); // backup
    document.addEventListener('yt-page-data-fetched', handleYouTubeNavigation); // redundancy
    //document.addEventListener('yt-player-updated', handleYouTubeNavigation);
    //document.addEventListener('yt-update-title', handleYouTubeNavigation);
    //document.addEventListener('yt-page-type-changed', handleYouTubeNavigation);
    document.addEventListener('yt-service-request-completed', handleYouTubeNavigation); // for chrome
})();