# YouTube Alchemy <a href="#changelog"><img align="right" src="https://img.shields.io/badge/Version-7.5-white.svg" alt="Version: 7.5"></a><a href="https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="https://github.com/TimMacy/YouTubeAlchemy"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="YouTube Alchemy Status: Maintained"></a>

This toolkit enhances YouTube by customizing the layout and adding seamless, native-feeling features. Designed to be resource-efficient, it primarily relies on event listeners while using timeouts and mutation observers strategically to minimize overhead. Furthermore, a main settings panel, along with three  sub-panels, provide an intuitive interface for easy customization of YouTube Alchemy.
### Settings Panels
- **Main Panel**: To manage YouTube Transcript Exporter and export, import, or reset all settings to default.
  - **Links in Header Panel**: Add links to any URL next to the YouTube logo and hide the navigation bar.
  - **Features & CSS Panel**: Access top features like preventing autoplay, hiding Shorts, disabling play on hover, enabling a square design, auto-theater mode, auto-closing chat windows, adjusting the number of videos per row, and modifying or hiding various UI elements.
  - **Color Code Videos Panel**: Adds a customizable border to videos on the home page, reflecting their age and status.

<p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/75c8de5b-ddf2-4717-8494-304bacfd764c" /></p>

<p align="center">
  <img width="49%" alt="Youtube Default" title="Youtube Default" src="https://github.com/user-attachments/assets/2a7eaf1e-2e9d-46a5-8c23-411f4e9c1eb7" />
  <img width="49%" alt="YouTube Alchemy by Tim Macy" title="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/09c0ed29-5f73-409f-9b73-52259951fa9c" />
</p>

<br><br>

## YouTube Transcript Exporter
Adds buttons to the YouTube header to export a video's transcript to LLMs, with and without a prompt, or to download it as a text file.

  - **Buttons with Color-Coded Interface in the Main Settings Panel**
    - **Button One | Green** 🎧: Copies the transcript and opens NotebookLM.
    - **Button Two | Blue** 💬: Copies the transcript with a prompt for summarizing before opening ChatGPT.
    - **Button Three | Red** ↓: Downloads the transcript as a text file.
    - **Button Four | White** ⋮ Opens the main settings panel.
  - **Transcript Formatting**: Includes timestamps, chapter headers, video title, channel name, upload date, and URL.
  - **Text File Naming Format**
    - Title - Channel.txt (default)
    - Channel - Title.txt
    - uploadDate - Title - Channel.txt
    - uploadDate - Channel - Title.txt

> [!TIP]
> The URLs for button one and two can be freele choosen as can the button icons. If a button field is empty, the button won't be added into the YouTube header. The settings button reverts back to default in case its field is empty.

> [!IMPORTANT]
> Due to the Same-Origin Policy (SOP) in web development, JavaScript cannot directly interact across different websites: i.e. while the script can copy the transcript to the clipboard from YouTube and open a link (e.g. ChatGPT or NotebookLM), the copied transcript must be pasted manually into the text field via CTRL+V (Windows/Linux) or CMD+V (macOS).

> [!NOTE]
> Additional messages are displayed at the button's location in the YouTube header to indicate the status of the Transcript Exporter.
> <table align="center">
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/c3d37e84-3d0d-48ae-a7a5-cd8aaee4d571" alt="Transcript Is Loading"></td>
>         <td align="left">The transcript has to be loaded into the HTML before it can be used. This can take between a few milliseconds up to a couple of seconds—depending on the length of the video.</td>
>     </tr>
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/e5911ba3-6039-4dd5-ab22-ffdaf02244e2" alt="Live Video, No Transcript"></td>
>         <td align="left">YouTube live streams don't have transcripts. Wait until the stream has finished and YouTube's API has processed the video.</td>
>     </tr>
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/c0096353-dade-4e33-b728-136ea6c5e774" alt="Transcript Not Available"></td>
>         <td align="left">YouTube's API needs a few minutes to process a new video and generate its transcript.</td>
>     </tr>
>     <tr>
>       <td align="center"><img src="https://github.com/user-attachments/assets/31e963fa-414c-476a-bf1c-94adf7cf9f9e" alt="Transcript Failed to Load"></td>
>       <td align="left">If the transcript fails to load, the Transcript Exporter will terminate. Reload the page to try again.</td>
>     </tr>
> </table>

<p align="center"><img width="50%" alt="Main Settings Panel" src="https://github.com/user-attachments/assets/4e01e361-de8c-4855-8f3e-a015d2611ea9" /></p>

<br><br>

## Links in Header
Up to seven links can be added next to the YouTube logo. An empty 'Link Text' field won't insert the link into the header.
If the left navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.

<p align="center"><img width="50%" alt="Links in Header" src="https://github.com/user-attachments/assets/b806fce8-66d6-4005-8b19-74930e27fb88" /></p>

<br><br>

## Features & CSS
Offers various options to customize the layout and functionality of YouTube.

**Features**
  - Change Opacity of Watched Videos
  - Title Case
    - normal-case
    - lowercase
    - uppercase
    - capitalize
  - Font Size
  - Adjust Number of Videos per Row
    - Home Page
    - Subscriptions Page
    - Channel Page
  - Prevent Autoplay
  - Automatically Open Chapter Panels
  - Automatically Open Transcript Panels
  - Auto Close Initial Chat Windows
  - Auto Theater Mode
  - Display Remaining Time Under a Video, Adjusted for Playback Speed—Even in Fullscreen
  - Persistent Progress Bar with Chapter Markers and SponsorBlock Support—Even in Fullscreen
  - Hide YouTube Shorts

**Layout Changes**
  - Disable Play on Hover
  - Square and Compact Search Bar
  - Square Design
  - Compact Layout

**Modify or Hide UI Elements**
  - Hide Voice Search Button in the Header
  - Hide Create Button in the Header
  - Hide YouTube Brand Text in the Header
  - Small Subscribed Button under a Video
  - Hide Join Button under a Video and on Channel Page
  - Display Full Titles
  - Choose Progress Bar Color
  - Hide Video Scrubber
  - Hide Video End Cards
  - Hide End Screens
  - Hide "Play Next" Button
  - Hide Share Button under a Video
  - Hide "Add Comment" Textfield
  - Hide Comment "Reply" Button
  - Hide Breaking News on Home
  - Hide Playlists on Home
  - Hide Mini Player
  - Hide Right Sidebar on Search Page
  - Hide Watched Videos Globally

<br><br>

## Color Code Videos
Adds a customizable border to videos on the home page to visualy indicate their age and status, with an option to hide watched videos.

<p align="center"><img width="50%" alt="Color Code Videos" src="https://github.com/user-attachments/assets/636ea195-6c15-48fc-9c02-cc1dbe7a79c9" /></p>

<br><br>

## Installation <a href="https://www.opera.com"><img align="right" src="https://img.shields.io/badge/Opera-Untested-yellow.svg" alt="Opera Untested"></a><a href="https://www.microsoft.com/edge"><img align="right" src="https://img.shields.io/badge/Edge-Untested-yellow.svg" alt="Edge Untested"></a><a href="https://www.mozilla.org/firefox"><img align="right" src="https://img.shields.io/badge/Firefox-Partially Tested-orange.svg" alt="Firefox Partially Tested"></a><a href="https://www.google.com/chrome"><img align="right" src="https://img.shields.io/badge/Chrome-Supported-brightgreen.svg" alt="Chrome Support"></a><a href="https://www.apple.com/safari"><img align="right" src="https://img.shields.io/badge/Safari-Supported-brightgreen.svg" alt="Safari Support"></a>

1. **Install or open a userscript manager**.  
   A userscript manager is required, such as [Userscripts for Safari](https://itunes.apple.com/us/app/userscripts/id1463298887) or [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
2. **Install** [YouTubeAlchemy.js](https://github.com/TimMacy/YouTubeAlchemy/blob/main/YouTubeAlchemy.js)

## Changelog
- **7.5**: name change to YouTube Alchemy. toggle for 'YouTube Transcript Exporter' added in main settings panel. general bug fixes and improvements. new Features: prevent autoplay, auto close initial chat windows, hide shorts, hide play next button, hide comment reply button, hide breaking news on home, hide playlists on home, hide right side bar on search.
- **7.4**: general bug fixes and improvements. reworked initiation of the script. new features: auto-open transcript panels, hide video end cards, hide end screens, hide join and share button under videos, small "subscribed" button (icon only), hide add comment text field, disable play on hover, hide main scrollbar in Safari, choose progress bar color
- **7.3.5**: General bug fixes and improvements. Reorganized the settings panel for upcoming features. New Features: Hide YouTube brand text in the header; Hide video scrubber (red dot in progress bar); Display full titles; and Auto Theater mode.
- **7.3.1**: fixed YouTube scrubber in progress bar
- **7.3**: New Features: Links in Header, Customize CSS, and Color Code Videos. Also optimized transcript loading and reset function.
- **7.1**: general bug fixes and improvements
- **7.0**: initial public release

## License
This project is licensed under the AGPL-3.0 License. See the [LICENSE](https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE) file for details.
