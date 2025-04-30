# YouTube Alchemy <a href="#-changelog"><img align="right" src="https://img.shields.io/badge/Version-7.7.7-white.svg" alt="Version: 7.7.7"></a>&nbsp;<a href="https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="#"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="YouTube Alchemy Status: Maintained"></a>

<a href="https://github.com/TimMacy/YouTubeAlchemy"><img align="left" width="70px" alt="YouTube Alchemy Logo" src="https://github.com/user-attachments/assets/d87b609d-0424-41bf-80bf-8c070b1b88d2"/></a>
This toolkit enhances YouTube by customizing the layout and adding more than 130 seamless, native-feeling features. Designed to be resource-efficient, it leverages YouTube's built-in elements and event listeners while using timeouts and mutation observers strategically to minimize overhead. Additionally, a main settings panel and three sub-panels offer an intuitive interface for customization.
<br clear="left"/>

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [🔒 Privacy & Security](#-privacy--security)
- [✨ Overview](#-overview)
- [📝 Transcript Exporter](#-transcript-exporter)
- [🔗 Links in Header](#-links-in-header)
- [🪄 Features & CSS](#-features--css)
- [🎨 Color Code Videos](#-color-code-videos)
- [🌐 Supported Languages](#-supported-languages)
- [🚀 Installation & Minimum Browser Requirements](#-installation--minimum-browser-requirements)
- [📜 Changelog](#-changelog)
- [⚖️ License](#%EF%B8%8F-license)
- [💡 Read Aloud Speedster](#-read-aloud-speedster)
- [⚠️ Disclaimer](#%EF%B8%8F-disclaimer)

</details>

#### 🔒 Privacy & Security
YouTube Alchemy operates completely client-side with no external dependencies. The script doesn't send any data to remote servers or pull resources from third-party sources beyond the standard userscript metadata for update checks (@updateURL, @downloadURL) and icon display (@icon). It leverages browser’s built-in Intl APIs while storing all settings and preferences locally via GM storage or browser localStorage.

### ✨ Overview
- **Main Settings Panel**: Manage the Transcript Exporter and export, import, or reset settings to their defaults.
  - **Links in Header Panel**: Add custom links next to the YouTube logo and hide the navigation bar.
  - **Features & CSS Panel**: Access key features like **tab view**, **playback speed**, **remove 'Important' section and sort all notifications chronologically**, **video quality**, **direction buttons for playlists**, prevent autoplay, hide Shorts, **set default audio, subtitle, and transcript languages**, **disable play on hover**, **square design**, **auto-theater mode**, auto-close chat windows, number of videos per row, modify or hide various UI elements, and much more.
  - **Color Code Videos Panel**: Apply customizable borders to videos on the Home page, reflecting their age and status, and highlight the last uploaded video on the Subscriptions page with optional auto-scroll.

<p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/f2df120a-973b-4634-9b41-cd5e0870b502" /></p>
<p align="center">
  <img width="49.5%" alt="YouTube Alchemy Tab View" title="YouTube Alchemy Tab View" src="https://github.com/user-attachments/assets/fadcc498-8028-4fbf-9020-c7be35b38f82" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="Read Aloud Speedster by Tim Macy" title="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/bde52bec-1149-4d68-8440-dcdb56b40b76" />
</p>
<p align="center">
  <img width="49.5%" alt="Youtube Default" title="Youtube Default" src="https://github.com/user-attachments/assets/2a7eaf1e-2e9d-46a5-8c23-411f4e9c1eb7" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="YouTube Alchemy by Tim Macy" title="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/c58af4b5-3859-4cf0-b80c-b2037ae53e96" />
</p>

<br>

## 📝 Transcript Exporter
Adds buttons to the YouTube header to export a video's transcript to LLMs, with or without a prompt, or to download it as a text file.

  - **Buttons with Color-Coded Interface in the Main Settings Panel**
    - **Button One | Green** 🎧 Copies the transcript and opens NotebookLM.
    - **Button Two | Blue** 💬 Copies the transcript with a prompt for summarizing and opens ChatGPT.
    - **Button Three | Red** ↓ Downloads the transcript as a text file.
    - **Button Four | White** ⋮ Opens the main settings panel.
  - **Transcript Formatting**: Includes timestamps, chapter headers, video title, channel name, upload date, and URL.
  - **Text File Naming Format**
    - Title - Channel.txt (default)
    - Channel - Title.txt
    - uploadDate - Title - Channel.txt
    - uploadDate - Channel - Title.txt

> [!TIP]
> The URLs for button one and two can be freely chosen, as can all button icons. If a button field is empty, the button won't be added to the YouTube header. The settings button reverts to default if its field is empty.

> [!IMPORTANT]
> Due to the Same-Origin Policy (SOP) in web development, JavaScript cannot directly interact across different websites: i.e. while the script can copy the transcript to the clipboard from YouTube and open a link (e.g. ChatGPT or NotebookLM), the copied transcript must be pasted manually into the text field via CTRL+V (Windows/Linux) or CMD+V (macOS).

> [!NOTE]
> Status messages for the Transcript Exporter are displayed at the button's location in the YouTube header.
> <table align="center">
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/c3d37e84-3d0d-48ae-a7a5-cd8aaee4d571" alt="Transcript Is Loading"></td>
>         <td align="left">The transcript has to be loaded into the HTML before it can be used. This can take from a few milliseconds up to a couple of seconds—depending on the length of the video.</td>
>     </tr>
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/e5911ba3-6039-4dd5-ab22-ffdaf02244e2" alt="Live Video, No Transcript"></td>
>         <td align="left">YouTube live streams don't have transcripts. Wait until the stream has finished and YouTube's API has processed the video.</td>
>     </tr>
>     <tr>
>         <td align="center"><img src="https://github.com/user-attachments/assets/c0096353-dade-4e33-b728-136ea6c5e774" alt="Transcript Not Available"></td>
>         <td align="left">If the creator hasn't included captions (subtitles), YouTube's API processes the video to generate the transcript. This can take a few minutes. If speech recognition fails due to e.g. lack of clear speech or background noise, no transcript will be available.</td>
>     </tr>
>     <tr>
>       <td align="center"><img src="https://github.com/user-attachments/assets/31e963fa-414c-476a-bf1c-94adf7cf9f9e" alt="Transcript Failed to Load"></td>
>       <td align="left">If the transcript fails to load, the Transcript Exporter will terminate. Reload the page to retry.</td>
>     </tr>
> </table>

<p align="center"><img width="50%" alt="Main Settings Panel" src="https://github.com/user-attachments/assets/92f7dbf6-cae4-447e-8265-8fc57043ba9a" /></p>

<br>

## 🔗 Links in Header
Up to ten links can be added next to the YouTube logo. An empty "Link Text" field won't insert the link into the header.
If the left navigation bar is hidden, a replacement icon will prepend the links, while retaining the default functionality of opening and closing the sidebar.

<p align="center"><img width="50%" alt="Links in Header" src="https://github.com/user-attachments/assets/f8be4335-2d6e-4e73-9c17-ad308bc7e362" /></p>

<br>

## 🪄 Features & CSS
Offers various options to customize the layout and functionality of YouTube.

**General**
  - Change Opacity of Watched Videos
  - Title Case Selection:
    - uppercase
    - lowercase
    - capitalize
    - normal-case (default)
  - Video Quality:
    - Auto (default)
    - Highest Available
    - 4320p - 8K
    - 2160p - 4K
    - 1440p - QHD
    - 1080p - FHD
    - 720p - HD
    - 480p
    - 360p
    - 240p
    - 144p
- Audio Language
- Subtitle Language
- Transcript Language
- Language Options:
    - Auto (default)
    - English
    - Spanish
    - Hindi
    - Portuguese
    - German
    - French
    - Italian
    - Dutch
    - Polish
    - Hebrew
    - Japanese
    - Korean
    - Chinese
    - Indonesian
    - Swedish
    - Norwegian
    - Danish
    - Finnish
    - Czech
    - Greek
    - Hungarian
    - Romanian
    - Ukrainian
  - Set Font Size
  - Adjust Number of Videos per Row
  - Set Playback Speed for VODs
    - from 0.25x to 17x with 0.25x increments
    - defaults to 1x for live videos
    - works with Shorts
    - key toggles:
      - A: -0.25x
      - S: toggle 1x/set speed
      - D: +0.25x

**Features**
  - Auto Theater Mode
  - Prevent Autoplay
  - Disable Play on Hover
  - Sort Notifications Chronologically
  - Auto Close Initial Chat Windows
  - "Videos" Tab as Default on Channel Page
  - Add RSS Feed Button to Channel Pages
  - Add Playlist Buttons to Channel Pages
  - Add Direction Buttons to Playlist Panels
  - Open Playlist Videos Without Being in a Playlist When Clicking the Thumbnail or Title
  - Show Trash Can Icon on Owned Playlists to Quickly Remove Videos
  - Sort Comments to "Newest First"
  - Automatically Open Chapter Panels
  - Automatically Open Transcript Panels
  - Automatically Enable Timestamps in Transcript Panels
  - Maintain 1x Playback Speed for Verified Artist Music Videos
  - Use Enhanced Bitrate for 1080p Videos, Premium Required
  - Persistent Progress Bar with Chapter Markers and SponsorBlock Support—Even in Fullscreen
  - Display Remaining Time Under Videos Adjusted for Playback Speed—Even in Fullscreen
    - To also include Skipped SponsorBlock Segments, ensure "Show time with skips removed" is enabled in SponsorBlock Settings under "Interface."

**Layout Changes**
  - Tab View on Video Page
  - Show Chapters Under Videos
  - Hide Comments Section
  - Hide Suggested Videos
  - Square and Compact Search Bar
  - Square Design
  - Square Avatars
  - Compact Layout
  - Disable Ambient Mode
  - Hide Shorts
  - Redirect Shorts to Standard Video Pages
  - Hide Ad Slots on the Home Page
  - Hide "Pay to Watch" Featured Videos on the Home Page
  - Hide "Free with ads" Videos on the Home Page
  - Hide Members Only Featured Videos on the Home Page
  - Hide "Latest posts from . . ." on Search Page

**Modify or Hide UI Elements**
  - Hide "Voice Search" Button
  - Hide "Create" Button
  - Hide "Notification" Button
  - Hide Notification Badge
  - Hide Own Avatar in the Header
  - Hide YouTube Brand Text in the Header
  - Keep Country Code Visible and Choose Color
  - Small Subscribed Button Under a Video—Displays Only the Notification Icon
  - Hide Join Button under a Videos and on Channel Pages
  - Display Full Titles
  - Custom Selection Color for Light and Dark Mode
  - Choose Progress Bar Color
  - Pure Black-and-White Background
  - No Frosted Glass Effect
  - Hide Video Scrubber
  - Hide Video End Cards
  - Hide End Screens
  - Less Intrusive Bottom Gradient
  - Hide "Play Next" Button
  - Hide "Airplay" Button
  - Hide Share Button under a Videos
  - Hide Hashtags under Videos
  - Hide Blue Info Panels
  - Hide "Add Comment" Textfield
  - Hide Comment "Reply" Button
  - Hide Breaking News on Home
  - Hide Playlists on Home
  - Hide Fundraiser Icons and Panels
  - Hide Mini Player
  - Hide "Add to queue" Button on Hover
  - Hide Right Sidebar on Search Page
  - Hide Watched Videos Globally

**Hide UI Elements in the Left Navigation Bar**
  - Hide "Home" Button
  - Hide "Subscriptions" Button
  - Hide "You" Button
  - Hide "History" Button
  - Hide "Playlists" Button
  - Hide "Your Videos" Button
  - Hide "Your Courses" Button
  - Hide "Your Podcasts" Button
  - Hide "Watch Later" Button
  - Hide "Liked Videos" Button
  - Hide "Subscriptions" Section
  - Hide "Subscriptions" Title
  - Hide "Show More" Button
  - Hide "Explore" Section
  - Hide "Explore" Title
  - Hide "Trending" Button
  - Hide "Music" Button
  - Hide "Movies & TV" Button
  - Hide "Live" Button
  - Hide "Gaming" Button
  - Hide "News" Button
  - Hide "Sports" Button
  - Hide "Learning" Button
  - Hide "Fashion & Beauty" Button
  - Hide "Podcasts" Button
  - Hide "More from YouTube" Section
  - Hide "More from YouTube" Title
  - Hide "YouTube Premium" Button
  - Hide "YouTube Studio" Button
  - Hide "YouTube Music" Button
  - Hide "YouTube Kids" Button
  - Hide Penultimate Section
  - Hide "Settings" Button
  - Hide "Report History" Button
  - Hide "Help" Button
  - Hide "Send Feedback" Button
  - Hide Footer

<br>

## 🎨 Color Code Videos
  - On Home Page
    - Adds customizable borders to videos to visually indicate their age and status, and offers the option to hide watched videos.
  - On Subscriptions Page
    - Adds a customizable border to the last uploaded video to highlight it on subsequent visits, with the option to auto-scroll to it.

<p align="center"><img width="50%" alt="Color Code Videos" src="https://github.com/user-attachments/assets/6e6964f1-55e3-45c8-9900-2e112a2dc78c" /></p>

<br>

## 🌐 Supported Languages
The script works with YouTube UI set to the following languages: English, Spanish, Hindi, Portuguese, German, French, Italian, Dutch, Polish, Hebrew, Japanese, Korean, Chinese, Indonesian, Swedish, Norwegian, Danish, Finnish, Czech, Greek, Hungarian, Romanian, and Ukrainian.<br>
_Support is a work in progress. Other languages may have limited functionality._

<br>

## 🚀 Installation & Minimum Browser Requirements
<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Safari_18%2B_(flag_required)-Supported-brightgreen?logo=safari" alt="Safari Supported"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Chrome_105%2B-Supported-brightgreen?logo=googlechrome&logoColor=white" alt="Chrome Supported"></a>
  <br>
  <a href="#"><img src="https://img.shields.io/badge/Firefox_121%2B-Supported-brightgreen?logo=firefoxbrowser" alt="Firefox Supported"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Edge_105%2B-Supported-brightgreen" alt="Edge Supported"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Opera_91%2B-Supported-brightgreen?logo=opera" alt="Opera Supported"></a>
</p>

1. **Install or open a userscript manager**.
   A userscript manager is required, such as [Userscripts for Safari](https://itunes.apple.com/us/app/userscripts/id1463298887), [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)), or [Violentmonkey](https://violentmonkey.github.io) (available for [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), and [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)).
2. **Install** [YouTubeAlchemy.js](https://github.com/TimMacy/YouTubeAlchemy/blob/main/YouTubeAlchemy.js).
<br>

**Important for Safari Users**: This script requires the requestIdleCallback Web API. Activate it under: Settings → Advanced → enable 'Show features for web developers' → Feature Flags → search for 'requestIdleCallback' and ensure it's checked.

<br>

## 📜 Changelog
- **7.7.7**: bug fixes and improvements. added multi-language support (work in progress; see supported languages above). add support for "People mentioned" in tab view. new features: sort notifications chronologically, no frosted glass effect, set default audio language, set default subtitle language. **important for Safari users**: this script now requires the requestIdleCallback web API
- **7.7.4**: adjustments for the latest YouTube changes. bug fixes and improvements. new features: disable ambient mode, keep country code visible when hiding brand text and choose color
- **7.7.3.2**: removed 'details sections of watch later videos' because of YouTube's recent changes
- **7.7.3.1**: adjustments for the latest YouTube changes
- **7.7.2.1**: hide end screens thumbnail overlay image adjustment
- **7.7.2**: bug fixes and improvements. new features: show chapters under videos (only works with tab view enabled and is updated by YouTube itself), hide "Free with ads" videos on the home page, less intrusive bottom gradient
- **7.7.1**: video gradient bug fix
- **7.7.0.1**: bug fixes and improvements. fixed an issue with Violentmonkey. new features: add playlist buttons to channel pages, add direction buttons to playlist panels, sort comments to "Newest first," hide "your podcasts" button
- **7.7**: bug fixes and improvements. new features: tab view, set video quality including premium 1080p enhanced bitrate, choose default transcript language, color code and scroll to last seen video on subscriptions page, add rss feed button to channel pages, added button to reset ChatGPT prompt back to default without changing other settings, change background color of details sections for watch later videos, hide "add to queue" button on hover, hide "Pay to watch" featured videos on the home page, hide "latest posts from . . ." on search page, hide blue info panels, hide comments section, hide notification button and badge, hide own avatar in the header, hide suggested videos, hide various elements in the left navigation bar, open playlist videos without being in a playlist when clicking the thumbnail or title, redirect shorts to the standard video page, show trash can icon on owned playlists to quickly remove videos, square avatars
- **7.6**: new feature: set playback speed for VODs, defaults to 1x for live videos, color code details section of watch later videos
- **7.5.5.1**: general bug fixes and improvements. beta feature added: "Display Remaining Time Under a Video, Adjusted for Playback Speed" now also takes SponsorBlock segments into account. if the beta version is enabled, it will be used instead. ensure "Show time with skips removed" is enabled in SponsorBlock settings under "Interface."
- **7.5.5**: general bug fixes and improvements. updated ChatGPT prompt to better maintain the YouTuber's POV and voice. new features: automatically enable timestamps in transcript panels, hide ad slots on the home page, hide members only featured videos on the home page, hide hashtags under videos, hide fundraiser icons and panels, option to hide various UI elements in the left navigation bar
- **7.5.1**: fixed missing setting for channel redirect default to videos tab
- **7.5**: name change to YouTube Alchemy. toggle for 'YouTube Transcript Exporter' added in main settings panel. general bug fixes and improvements. new Features: prevent autoplay, auto-close initial chat windows, hide shorts, hide play next button, hide comment reply button, hide breaking news on home, hide playlists on home, hide right sidebar on search
- **7.4**: general bug fixes and improvements. reworked initiation of the script. new features: auto-open transcript panels, hide video end cards, hide end screens, hide join and share button under videos, small "subscribed" button (icon only), hide add comment text field, disable play on hover, hide main scrollbar in Safari, choose progress bar color
- **7.3.5**: General bug fixes and improvements. Reorganized the settings panel for upcoming features. New Features: Hide YouTube brand text in the header; Hide video scrubber (red dot in progress bar); Display full titles; and Auto Theater mode
- **7.3.1**: fixed YouTube scrubber in progress bar
- **7.3**: New Features: Links in Header, Customize CSS, and Color Code Videos. Also optimized transcript loading and reset function
- **7.1**: general bug fixes and improvements
- **7.0**: initial public release

<br>

## ⚖️ License
This project is licensed under the AGPL-3.0 License. See the [LICENSE](https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE) file for details.

<br><br>

> [!TIP]
> # 💡 Read Aloud Speedster
> This script integrates intuitive playback speed controls into the chatbox interface. Clicking the speed display opens a popup menu to set a preferred default playback speed and the option to toggle the square design. Furthermore, the icons under Chat's responses are color-coded, and bold text is highlighted in color.
>
> <br>
>
> **Install It from the Official Repository: [https://github.com/TimMacy/ReadAloudSpeedster](https://github.com/TimMacy/ReadAloudSpeedster)**
>
> <br>
> <p align="center"><img width="100%" alt="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/bfb1a08e-3124-47ca-be49-cc08f09303db" /></p>
<br>

## ⚠️ Disclaimer
*YouTube Alchemy* is an independent, private project. It's not affiliated with, endorsed by, sponsored by, or in any way officially connected to YouTube, Google LLC, or Alphabet Inc. "YouTube" and the YouTube logo are trademarks of Google LLC; all other trademarks are the property of their respective owners.
