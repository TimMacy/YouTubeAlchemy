# YouTube Transcript Exporter <a href="https://github.com/TimMacy/YouTubeTranscriptExporter"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="YouTube Transcript Exporter Status: Maintained"></a>
This script adds four buttons to the YouTube header to facilitate exporting a video's transcript to LLMs or downloading it as a text file. The first button copies the transcript to the clipboard before opening NotebookLM, ideal for quickly generating podcasts. Button two includes a prompt to summarize the video and opens ChatGPT. The third button downloads the transcript as a text file, while the last button opens the settings panel.  


**Note**: Due to the Same-Origin Policy (SOP) in web development, JavaScript cannot directly interact across different websites: i.e. while the script can copy the transcript to the clipboard from YouTube and open a link (e.g. ChatGPT or NotebookLM), the copied transcript must be pasted manually into the text field via CTRL+V (Windows/Linux) or CMD+V (macOS).

## Features
- **Core Script Functionality**
  - **Button One**: Copies the transcript and opens NotebookLM.
  - **Button Two**: Copies the transcript with a prompt for summarizing before opening ChatGPT.
  - **Button Three**: Downloads the transcript as a text file.
  - **Button Four**: Opens the settings panel.
  - **Transcript Formatting**: Includes timestamps, chapter headers, video title, channel name, upload date, and URL.
- **Additional Features**
  - **Display Remaining Time**: Shows the remaining playback time below the video, adjusted for playback speed.
  - **Persistent Progress Bar**: Keeps the progress bar with chapter markers visible below the video—even in fullscreen.
  - **Auto Open Chapters**: Automatically opens the chapter panel if available.
  - **Links in Header**: Up to seven links can be added next to the logo and the Left Navigation Bar can be hidden.
  - **Customize CSS**: Square Design, Compact Layout, Videos per Row, Dim or Hide Watched Videos are just some options.
  - **Color Code Videos**: Adds a configurable border around videos on the YouTube home page, with colors indicating video age and status.
- **Customizable**
  - The settings panel allows for easy modification of the script and its functionality.
    - Includes buttons to export and import preferences for backup.
    - **Color-Coded Interface** to visually group related elements together
      - **Green**: Button One - NotebookLM
      - **Blue**: Button Two - ChatGPT
      - **Red**: Button Three - Download
      - **White**: Button Four - General Settings<br><br>

![YouTube Transcript Exporter by Tim Macy](https://github.com/user-attachments/assets/bc71b6ca-225d-4056-afe4-6ef543a352d7 "YouTube Transcript Exporter by Tim Macy")
<br>
![Settings Panel 1](https://github.com/user-attachments/assets/9975006d-0e32-42ca-af84-4bc2b09c31da "Settings Panel")
![Links in Header](https://github.com/user-attachments/assets/6c931d9c-41ee-47b0-8fa3-cde4cfaf8ab6 "Links in Header")
![Customize CSS](https://github.com/user-attachments/assets/5049caee-58c7-4398-9a74-b11f73676c5e "Customize CSS")
![Color Code Videos](https://github.com/user-attachments/assets/e281652f-2fab-4eba-b7f1-711da98a7df8 "Color Code Videos")
<br>
<p align="center">
  <img width="49%" alt="Youtube Default" title="Youtube Default" src="https://github.com/user-attachments/assets/2a7eaf1e-2e9d-46a5-8c23-411f4e9c1eb7" />
  <img width="49%" alt="YouTube Transcript Exporter by Tim Macy" title="YouTube Transcript Exporter by Tim Macy" src="https://github.com/user-attachments/assets/09c0ed29-5f73-409f-9b73-52259951fa9c" />
</p>

#### Additional messages are displayed at the button's location in the YouTube header to indicate the status of the script.
<table align="center">
    <tr>
        <td align="center"><img src="https://github.com/user-attachments/assets/c3d37e84-3d0d-48ae-a7a5-cd8aaee4d571" alt="Transcript Is Loading"></td>
        <td align="left">The transcript has to be loaded into the HTML before it can be used. This can take between a few milliseconds up to a couple of seconds—depending on the length of the video.</td>
    </tr>
    <tr>
        <td align="center"><img src="https://github.com/user-attachments/assets/c0096353-dade-4e33-b728-136ea6c5e774" alt="Transcript Not Available"></td>
        <td align="left">YouTube's API needs a few minutes to process a new video and generate its transcript.<br>Live videos don't have transcripts. Ensure the "Show transcript" button is available in the description.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/31e963fa-414c-476a-bf1c-94adf7cf9f9e" alt="Transcript Failed to Load"></td>
      <td align="left">If the transcript fails to load, the script will terminate. Reload the page to try again.</td>
    </tr>
</table>

## Installation
1. **Install or open a userscript manager**.  
   A userscript manager is required, such as [Userscripts for Safari](https://itunes.apple.com/us/app/userscripts/id1463298887) or [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
2. **Install** [YouTubeTranscriptExporter.js](https://raw.githubusercontent.com/TimMacy/YouTubeTranscriptExporter/refs/heads/main/YouTubeTranscriptExporter.js)

## Changelog
- **7.3.1**: fixed YouTube scrubber in progress bar
- **7.3**: New Features: Links in Header, Customize CSS, and Color Code Videos. Also optimized transcript loading and reset function.
- **7.1**: general bug fixes and improvements
- **7.0**: initial public release

## License
This project is licensed under the AGPL-3.0 License. See the [LICENSE](https://github.com/TimMacy/YouTubeTranscriptExporter/blob/main/LICENSE) file for details.
