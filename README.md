# YouTube Transcript Exporter
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
- **Customizable**
  - The settings panel allows for easy modification of the script and its functionality.
    - Includes buttons to export and import preferences for backup.
    - **Color-Coded Interface** to visually group related elements together
      - **Green**: Button One - NotebookLM
      - **Blue**: Button Two - ChatGPT
      - **Red**: Button Three - Download
      - **White**: Button Four - General Settings<br><br>

![YouTube Transcript Exporter by Tim Macy](https://github.com/user-attachments/assets/188fba1e-1f37-400f-9c03-1236885d75a4 "YouTube Transcript Exporter by Tim Macy")
<br><br>
![Settings Panel](https://github.com/user-attachments/assets/f916d714-fda6-4b18-beb5-a4f5c4dbce30 "Settings Panel")  

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

## License
This project is licensed under the AGPL-3.0 License. See the [LICENSE](https://github.com/TimMacy/YouTubeTranscriptExporter/blob/main/LICENSE) file for details.
