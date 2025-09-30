# YouTube Alchemy <a href="#-changelog"><img align="right" src="https://img.shields.io/badge/Version-8.2-white.svg" alt="Version: 8.2"></a>&nbsp;<a href="https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="#"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="YouTube Alchemy Status: Maintained"></a>

<a href="#"><picture><source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/09f644c0-c3ee-4e13-bb73-c98c8a1cf2c0"/><img align="left" width="80px" alt="YouTube Alchemy Logo" src="https://github.com/user-attachments/assets/d87b609d-0424-41bf-80bf-8c070b1b88d2"/></picture></a>
This toolkit enhances YouTube by customizing the layout and adding more than 190 native-feeling features. Designed to be resource-efficient, it leverages YouTube's built-in elements while using event listeners, timeouts, requestAnimationFrame, requestVideoFrameCallback, requestIdleCallback, and mutation observers strategically to minimize overhead. Additionally, a main settings panel and three sub-panels offer an intuitive interface for customization. YouTube Alchemy is available as a userscript or a browser extension.
<br clear="left"/>
<p align="right">
<a href="https://chromewebstore.google.com/detail/youtube-alchemy/midnnobjjobpnnblnckmnkhegbnlmgkn"><img width="22%" alt="Chrome Browser Extension for YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/d5abfdaa-ca15-4820-b533-85af1332ce4e"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/youtube-alchemy/"><img width="22%" alt="Firefox Browser Extension for YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/025b7be1-c945-4bde-8ad3-35c8f6c6a07f"></a>
</p>

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [🔒 Privacy Policy](#-privacy-policy)
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
- [🔸 Disclaimer](#-disclaimer)

</details>

#### 🔒 Privacy Policy
YouTube Alchemy operates completely client-side with no external dependencies. It doesn't send data to remote servers or pull resources from third parties. It leverages the browser's built-in Intl APIs, stores settings locally (via GM storage/storage.local plus browser localStorage), and reads YouTube's DOM to apply enabled features as well as layout changes. The userscript version utilizes standard metadata for updates (@updateURL, @downloadURL) and icon display (@icon). Required permissions: GM.getValue and GM.setValue for the userscript; storage and scripting for the extension; both are limited to https://\*.youtube.com/\*.

### ✨ Overview
- **Main Settings Panel**: Manage the Transcript Exporter and export, import, or reset settings to their defaults.
  - **Links in Header Panel**: Add custom links next to the YouTube logo and hide the navigation bar.
  - **Features & CSS Panel**: Access key features like **tab view**, **playback speed**, **remove 'Important' section and sort all notifications chronologically**, **video quality**, **direction buttons for playlists**, prevent autoplay, hide Shorts, **set default audio, subtitle, and transcript languages**, **disable play on hover**, **square design**, **auto-theater mode**, auto-close chat windows, number of videos per row, modify or hide various UI elements, and much more.
  - **Color Code Videos Panel**: Apply customizable borders to videos on the Home page, reflecting their age and status, and highlight the last uploaded video on the Subscriptions page with optional auto-scroll.

<p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/a94da93a-2014-45c0-96b7-4e70b623a4d5" /></p>
<p align="center">
  <img width="49.5%" alt="YouTube Alchemy Tab View" title="YouTube Alchemy Tab View" src="https://github.com/user-attachments/assets/e2991d15-93f4-4ee7-9122-1cacd935b1af" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="Read Aloud Speedster by Tim Macy" title="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/ac496cf1-f07c-4299-a85d-af0ffe655f5e" />
</p>
<p align="center">
  <img width="49.5%" alt="YouTube Default" title="YouTube Default" src="https://github.com/user-attachments/assets/dea955f2-6479-4de8-a06e-4327b69d25c0" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="YouTube Alchemy by Tim Macy YouTube Home" title="YouTube Alchemy by Tim Macy YouTube Home" src="https://github.com/user-attachments/assets/24904622-9071-4748-8e73-7e24d29f8e9a" />
</p>

<br>

## 📝 Transcript Exporter
Adds buttons to the YouTube header to export a video's transcript to LLMs, with or without a prompt, or to download it as a text file.

  - **Buttons with Color-Coded Interface in the Main Settings Panel**
    - **Button One | Green** 🎧 Copies the transcript and opens NotebookLM.
    - **Button Two | Blue** 💬 Copies the transcript with a prompt for summarizing and opens ChatGPT.
    - **Button Three | Orange** Copies Transcript to Clipboard.
    - **Button Four | Red** ↓ Downloads the transcript as a text file.
    - **Button Five | Yellow** 📜 Click to Load the Transcript Manually.
    - **Button Six | White** ⋮ Opens the main settings panel.
  - **Transcript Formatting**: Includes timestamps, chapter headers, video title, channel name, upload date, and URL.
  - **Text File Naming Format**
    - Title - Channel.txt (default)
    - Channel - Title.txt
    - uploadDate - Title - Channel.txt
    - uploadDate - Channel - Title.txt

> [!TIP]
> The URLs for buttons one and two, along with all button icons, are fully customizable. If a button field is left empty, that button won’t be added to the header. The settings button reverts to its default if its field is empty. To modify the labels for NotebookLM and ChatGPT, enter "Label | domain.com" into their respective URL fields—this also updates the icons' hover text.

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

<p align="center"><img width="50%" alt="Main Settings Panel" src="https://github.com/user-attachments/assets/14733b83-677d-4689-8d4a-33ff6c08ae4d" /></p>

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
- Choose Font Size
- Adjust Number of Videos per Row
- Set Playback Speed for VODs
  - from 0.25x to 17x with 0.25x increments
  - defaults to 1x for live videos
  - works with Shorts
  - key toggles:
    - A (or <): -0.25x
    - S: toggle 1x/set speed
    - D (or >): +0.25x

**Features**
  - Auto Theater Mode
  - Auto Expand Video Description
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
  - Add "Remove Watched Videos" Button to Watch Later Playlist
  - Sort Comments to "Newest First"
  - Automatically Open Chapter Panels
  - Automatically Open Transcript Panels
  - Automatically Enable Timestamps in Transcript Panels
  - Maintain 1x Playback Speed for Verified Artist Music Videos
  - Use Enhanced Bitrate for 1080p Videos, Premium Required
  - Persistent Progress Bar with Chapter Markers and SponsorBlock Support—Even in Fullscreen
  - Display Remaining Time Under Videos Adjusted for Playback Speed—Even in Fullscreen
    - To also include skipped SponsorBlock segments, ensure "Show time with skips removed" is enabled in SponsorBlock settings under "Interface."

**Layout Changes**
  - Tab View on Video Page
  - Show Chapters Under Videos, Only Works with Tab View Enabled
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

**Hide Watched Videos**
  - Hide Watched Videos Regardless of Progress Everywhere
  - Hide Watched Videos Regardless of Progress Only on the Home Page
  - Pick a Percentage to Hide Videos on
    - Home Page
    - Subscription Page
    - Channel Pages
    - Playlists
    - Video Pages
    - Search Pages

**Modify or Hide UI Elements**
  - Hide "Voice Search" Button
  - Hide "Create" Button
  - Hide "Notification" Button
  - Hide Notification Badge
  - Hide Own Avatar in the Header
  - Hide YouTube Brand Text in the Header
  - Keep Country Code Visible and Choose Color
  - Small Subscribed Button Under Videos—Displays Only the Notification Icon
  - Hide the Join Button Under Videos and on Channel Pages
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
  - Hide Share Button under Videos
  - Hide Hashtags under Videos
  - Hide Blue Info Panels
  - Hide "Add Comment" Textfield
  - Hide Comment "Reply" Button
  - Hide "YouTube Playables" on the Home Page
  - Hide "Breaking News" on the Home Page
  - Hide "YouTube Playlists" on the Home Page
  - Hide "Latest YouTube posts" on the Home Page
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

<p align="center"><img width="50%" alt="Color Code Videos" src="https://github.com/user-attachments/assets/e391fb3c-0be1-4305-a598-08f0b7dbe079" /></p>

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

> [!IMPORTANT]
> **Important for Safari Users**: This script requires the requestIdleCallback Web API. Activate it under: Settings → Advanced → enable 'Show features for web developers' → Feature Flags → search for 'requestIdleCallback' and ensure it's checked.

> [!NOTE]
> This script is designed primarily for desktop browsers; compatibility and functionality on mobile devices may vary.

<br>

## 📜 Changelog
- **8.2**: adjustments for the latest YouTube changes, bug fixes, and improvements. new features: Restore Homepage Filter Selection; Hide "Downloads" Button in the Left Navigation Bar
- **8.1**: improvements for persistent progress bar and display remaining time
- **8.0.4**: adjustments for the latest YouTube changes, bug fixes, and improvements
- **8.0.3.1**: adjustments for the latest YouTube changes (general selector updates including for Color Code Last Uploaded Video)
- **8.0.2**: adjustments for the latest YouTube changes (fixed missing date in tab view)
- **8.0.1**: adjustments for the latest YouTube changes (fixed font size of remaining time and chapters in fullscreen)
- **8.0**: browser extension release. bug fixes and improvements. new feature: move settings button into the YouTube guide, load transcript manually, dark and light mode support for Color Code Videos
- **7.2**: adjustments for the latest YouTube changes
- **7.19**: adjustments for the latest YouTube changes
- **7.18**: adjustments for the latest YouTube changes; new feature: Hide "Latest YouTube posts" on the Home Page
- **7.17**: adjustments for the latest YouTube changes; new feature: Hide "YouTube Playables" on the Home Page
- **7.15**: adjustments for the latest YouTube changes; fixed persistent progress bar crash when chapters were auto-generated
- **7.12.1**: adjustments for the latest YouTube changes (fixed playback speed display)
- **7.12**: bug fixes and improvements
- **7.11**: bug fixes and adjustments for the latest YouTube changes. new feature: hide watched videos based on watch percentage on selected pages
- **7.10.4**: bug fixes and adjustments for the latest YouTube changes
- **7.10.1**: adjustments for the latest YouTube changes
- **7.10**: adjustments for the latest YouTube changes
- **7.9.9.4**: bug fixes
- **7.9.9.3**: bug fixes
- **7.9.9.2**: bug fixes
- **7.9.9**: bug fixes, improvements, and re-added the option "Hide Ad Slots on the Home Page (default: no)". it should now avoid triggering the "Ad blockers violate YouTube's Terms of Service" warning by excluding the video player area
- **7.9.8**: bug fixes, improvements, and resolved script execution issue on YouTube Shorts. new features: loop control, auto-scroll option, and persistent progress bar for YouTube Shorts
- **7.9.7.1**: fixed black channel header in light mode
- **7.9.7**: bug fixes and improvements
- **7.9.6**: bug fixes and adjustments for the latest YouTube changes: new feature: disable hover effect for videos on the home page (can be found under 'Color Code Videos')
- **7.9.5**: fixed a bug where captions in fullscreen overlapped the remaining time and chapter containers. improved fullscreen progress bar CSS selectors
- **7.9.2**: removed the option "Hide Ad Slots on the Home Page (default: no)" as it now appears to trigger the "Ad blockers violate YouTube's Terms of Service" warning. in addition, added an option to hide the "X products" text under videos
- **7.9.1**: adjustments for the latest YouTube changes, bug fixes, and improvements. new feature: add "Remove Watched Videos" button to watch later playlist
- **7.8.6**: prevent YouTube's auto scrolling when "Automatically Open Transcript Panels" is enabled
- **7.8.5**: adjustments for the latest YouTube changes, security update, bug fixes, and improvements
- **7.8.1**: new feature: auto expand video description
- **7.8**: bug fixes and improvements. new features: added a button to copy the transcript to the clipboard, allow changing the label text for button one (NotebookLM) and button two (ChatGPT), which also updates the hover text for those icons. to change the label text, enter "Label | domain.com" in the respective URL fields.
- **7.7.7**: bug fixes and improvements. added multi-language support (work in progress; see supported languages above). add support for "People mentioned" in tab view. new features: sort notifications chronologically, no frosted glass effect, set default audio language, set default subtitle language. **important for Safari users**: this script now requires the requestIdleCallback web API
- **7.7.4**: adjustments for the latest YouTube changes. bug fixes and improvements. new features: disable ambient mode, keep country code visible when hiding brand text and choose color
- **7.7.3.2**: removed 'details sections of watch later videos' because of YouTube's recent changes
- **7.7.3.1**: adjustments for the latest YouTube changes
- **7.7.2.1**: hide end screens thumbnail overlay image adjustment
- **7.7.2**: bug fixes and improvements. new features: show chapters under videos (only works with tab view enabled and is updated by YouTube itself), hide "Free with ads" videos on the home page, less intrusive bottom gradient
- **7.7.1**: video gradient bug fix
- **7.7.0.1**: bug fixes and improvements. fixed an issue with Violentmonkey. new features: add playlist buttons to channel pages, add direction buttons to playlist panels, sort comments to "Newest first," hide "your podcasts" button
- **7.7**: bug fixes and improvements. new features: tab view, set video quality including premium 1080p enhanced bitrate, choose default transcript language, color code and scroll to last seen video on subscriptions page, add RSS feed button to channel pages, added button to reset ChatGPT prompt back to default without changing other settings, change background color of details sections for watch later videos, hide "add to queue" button on hover, hide "Pay to watch" featured videos on the home page, hide "latest posts from . . ." on search page, hide blue info panels, hide comments section, hide notification button and badge, hide own avatar in the header, hide suggested videos, hide various elements in the left navigation bar, open playlist videos without being in a playlist when clicking the thumbnail or title, redirect shorts to the standard video page, show trash can icon on owned playlists to quickly remove videos, square avatars
- **7.6**: new feature: set playback speed for VODs, defaults to 1x for live videos, color code details section of watch later videos
- **7.5.5.1**: general bug fixes and improvements. beta feature added: "Display Remaining Time Under a Video, Adjusted for Playback Speed" now also takes SponsorBlock segments into account. if the beta version is enabled, it will be used instead. ensure "Show time with skips removed" is enabled in SponsorBlock settings under "Interface."
- **7.5.5**: general bug fixes and improvements. updated ChatGPT prompt to better maintain the YouTuber's POV and voice. new features: automatically enable timestamps in transcript panels, hide ad slots on the home page, hide members only featured videos on the home page, hide hashtags under videos, hide fundraiser icons and panels, option to hide various UI elements in the left navigation bar
- **7.5.1**: fixed missing setting for channel redirect default to videos tab
- **7.5**: name change to YouTube Alchemy. toggle for 'YouTube Transcript Exporter' added in main settings panel. general bug fixes and improvements. new Features: prevent autoplay, auto-close initial chat windows, hide shorts, hide play next button, hide comment reply button, hide breaking news on home, hide playlists on home, hide right sidebar on search
- **7.4**: general bug fixes and improvements. reworked initiation of the script. new features: auto-open transcript panels, hide video end cards, hide end screens, hide join and share buttons under videos, small "subscribed" button (icon only), hide add comment text field, disable play on hover, hide main scrollbar in Safari, choose progress bar color
- **7.3.5**: General bug fixes and improvements. Reorganized the settings panel for upcoming features. New Features: Hide YouTube brand text in the header; Hide video scrubber (red dot in progress bar); Display full titles; and Auto Theater mode
- **7.3.1**: fixed YouTube scrubber in progress bar
- **7.3**: New Features: Links in Header, Customize CSS, and Color Code Videos. Also optimized transcript loading and reset function
- **7.1**: general bug fixes and improvements
- **7.0**: initial public release

<br>

## ⚖️ License
The code in `YouTubeAlchemy.js` is licensed under the GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later). See the [LICENSE](https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE) file for details. Not licensed under the AGPL are the `README.md`, the "YouTube Alchemy" logo, and all images. Copyright © 2025 Tim Macy. All rights reserved.

<br><br>

> [!TIP]
> # 💡 Read Aloud Speedster
> This script integrates intuitive playback speed controls into the chatbox interface. Clicking the speed display opens a popup menu to set a preferred default playback speed and the option to toggle the square design. Additionally, the icons under Chat's responses are color-coded, and bold text is highlighted in color.
>
> <br>
>
> **Install It from the Official Repository: [https://github.com/TimMacy/ReadAloudSpeedster](https://github.com/TimMacy/ReadAloudSpeedster)**
>
> <br>
> <p align="center"><img width="100%" alt="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/66c28cae-0653-47e4-b614-56f1a4a3f9d8" /></p>
<br>

## 🔸 Disclaimer
*YouTube Alchemy* is an independent, private project. It's not affiliated with, endorsed by, sponsored by, or in any way officially connected to YouTube, Google LLC, or Alphabet Inc. "YouTube" and the YouTube logo are trademarks of Google LLC; all other trademarks are the property of their respective owners.
