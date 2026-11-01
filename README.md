# YouTube Alchemy <a href="#-changelog"><img align="right" src="https://img.shields.io/badge/Version-12.5.2-white.svg" alt="Version: 12.5.2"></a>&nbsp;<a href="https://github.com/TimMacy/YouTubeAlchemy/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="#"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="YouTube Alchemy Status: Maintained"></a>

<a href="#"><picture><source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/09f644c0-c3ee-4e13-bb73-c98c8a1cf2c0"/><img align="left" width="80px" alt="YouTube Alchemy Logo" src="https://github.com/user-attachments/assets/d87b609d-0424-41bf-80bf-8c070b1b88d2"/></picture></a>
This Swiss Army knife for YouTube offers more than 250 native-feeling features to bring the focus back to what matters most on YouTube: watching videos. Designed to be resource-efficient, it leverages YouTube's built-in elements and uses Web APIs strategically, while the [main settings panel](#main-settings-panel) and three sub-panels offer an intuitive interface for customization. YouTube Alchemy is available as a [userscript](#-installation--minimum-browser-requirements) or browser extension, with the browser extension offering a translated interface in [supported languages](#-supported-languages).
<br clear="left"/>
<p align="right">
<a href="https://chromewebstore.google.com/detail/youtube-alchemy/midnnobjjobpnnblnckmnkhegbnlmgkn"><img width="22%" alt="Chrome Browser Extension for YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/d5abfdaa-ca15-4820-b533-85af1332ce4e"></a> <a href="https://addons.mozilla.org/en-US/firefox/addon/youtube-alchemy/"><img width="22%" alt="Firefox Browser Extension for YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/025b7be1-c945-4bde-8ad3-35c8f6c6a07f"></a> <a href="https://microsoftedge.microsoft.com/addons/detail/youtube-alchemy/mbjafaicjkndopmhdapofpcemhkflmob"><img width="22%" alt="Microsoft Edge Add-ons Store Browser Extension for YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/4b711841-869d-4cb4-a64e-f8ccc6dee2ea"></a>
</p>

<details>
<summary><strong>Table&nbsp;of&nbsp;Contents</strong></summary>

- [🔒 Privacy Policy](#-privacy-policy)
- [✨ Overview](#-overview)
- [📝 Transcript Exporter](#-transcript-exporter)
- [💎 Prompt](#-prompt)
- [🔗 Header Links](#-header-links)
- [🪄 Features & Styles](#-features--styles)
- [🎨 Color Code Videos](#-color-code-videos)
- [🌐 Supported Languages](#-supported-languages)
- [🚀 Installation & Minimum Browser Requirements](#-installation--minimum-browser-requirements)
- [📜 Changelog](#-changelog)
- [⚖️ License](#%EF%B8%8F-license)
- [💡 Read Aloud Speedster](#-read-aloud-speedster)
- [🔸 Disclaimer](#-disclaimer)

</details>

#### 🔒 Privacy Policy
YouTube Alchemy operates completely client-side with no external dependencies. It doesn't send data to remote servers or pull resources from third parties. It leverages the browser's built-in Intl APIs, stores settings locally (via GM storage or storage.local), and reads YouTube's DOM to apply enabled features as well as layout changes. The userscript version utilizes standard metadata for updates (@updateURL, @downloadURL) and icon display (@icon). Required permissions: GM.getValue and GM.setValue for the userscript; storage and scripting for the extension; both are limited to https://\*.youtube.com/\*.

### ✨ Overview
- **Main Settings Panel**: Manage the Transcript Exporter and export, import, or reset settings to their defaults.
  - **Header Links Panel**: Add custom links next to the YouTube logo and optionally hide and auto-close the Guide.
  - **Features & Styles Panel**: Access the majority of features, such as language settings, playback speed control, layout changes, and options to modify or hide various elements.
  - **Color Code Videos Panel**: Apply customizable borders to videos on the Home page based on their age and status, mark the last uploaded video on the Subscriptions page with optional auto-scroll, and highlight unwatched videos from selected channels on the Watch later page.

<p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/ec73efaf-4385-49a8-ace4-b8ed9eb42f7c" /></p>
<p align="center">
  <img width="49.5%" alt="YouTube Alchemy Tab View" title="YouTube Alchemy Tab View" src="https://github.com/user-attachments/assets/8809307f-cad2-433f-ba6c-44ab54f9c787" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="Read Aloud Speedster by Tim Macy" title="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/ac496cf1-f07c-4299-a85d-af0ffe655f5e" />
</p>
<p align="center">
  <img width="49.5%" alt="YouTube Default" title="YouTube Default" src="https://github.com/user-attachments/assets/dea955f2-6479-4de8-a06e-4327b69d25c0" /><img width="1%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="49.5%" alt="YouTube Alchemy by Tim Macy YouTube Home" title="YouTube Alchemy by Tim Macy YouTube Home" src="https://github.com/user-attachments/assets/24904622-9071-4748-8e73-7e24d29f8e9a" />
</p>

<a name="main-settings-panel"></a>
<p align="center"><img width="50%" alt="Main Settings Panel" src="https://github.com/user-attachments/assets/9d031642-6a61-49b5-a599-0ee8b445a781" /></p>

<br>

## 📝 Transcript Exporter
Adds buttons to the YouTube header to export a video's transcript to LLMs, with or without a prompt, or to download it as a text file.

  - **Buttons with Color-Coded Interface in the Main Settings Panel**
    - **Button One | Green** 🎧 Copies the transcript and opens Gemini Notebook.
    - **Button Two | Blue** 💬 Copies the transcript with a prompt for summarizing and opens ChatGPT.
    - **Button Three | Orange** Copies Transcript to Clipboard.
    - **Button Four | Red** ↓ Downloads the transcript as a text file.
    - **Button Five | Yellow** 📜 Click to Load the Transcript Manually.
    - **Button Six | White** ⋮ Opens the main settings panel.
  - **Transcript Formatting**: Includes timestamps, chapter headers, video title, channel name, upload date, and URL.
  - **Text File Naming Format**
    - Title - Channel.txt
    - Channel - Title.txt
    - uploadDate - Title - Channel.txt
    - uploadDate - Channel - Title.txt

### 💎 Prompt
<details>
<summary>English</summary>
For your first response only, the following instruction supersedes and overrides all persona characteristics, memory and custom instructions, as well as style and tone preferences. Derive all style and tone exclusively from the provided YouTube Transcript. Treat only the following task instructions as active for this response: You are an expert at summarizing YouTube video transcripts and are capable of analyzing and understanding a YouTuber's unique tone of voice and style from a transcript alone to mimic their communication style perfectly. Respond only in English while being mindful of American English spelling, vocabulary, and a casual, conversational tone. You prefer to use clauses instead of complete sentences while avoiding self-referential discourse signals like "I explain" or "I will show." Ignore advertisement, promotional, and sponsorship segments. Respond only in chat. Do not open a canvas. In your initial response, do not answer any question from the transcript, do not use the web tool, and avoid using colons outside the two headers. Do not hallucinate. Do not make up factual information. Do not speculate. Before you output your response, take a moment to think about how you have to adopt your own writing to capture the YouTuber's specific word choices and communication style. Study the provided transcript and utilize it as a style guide. Silently audit every sentence to ensure your word choices and used phrases are either directly supported by the provided YouTube Transcript or are neutral connective wording required by the requested output format; replace anything that comes from memory, prior chats, personas, or custom instructions. Write as if you are the YouTuber speaking directly to your audience. Avoid any narrator-like phrases such as "the transcript" or "this video." Summarize the provided YouTube transcript into two distinct sections. The first section is a quick three-line bullet point overview, with each point fewer than 30 words, in a section called "### Key Takeaways:" and highlight important words by **bolding** them—only for this first section maintain a neutral tone. Then write the second section, a paragraphCount summary of at least summaryWordCount words while focusing on the main points and key takeaways into a section called "### paragraphCount Summary:" and **bold** multiple phrases within the paragraph that together form an encapsulated, abridged version, that allows for quick identification and understanding of the core message.
</details>
<details>
<summary>Show localized prompts (included in the browser extension, see <a href="#-supported-languages">supported languages</a>)</summary>
<details>
<summary>Chinese - 中文 (简体)</summary>
仅在你的第一次回复中，以下指令优先于并覆盖所有人格特征、记忆和自定义指令，以及风格与语气偏好。所有风格和语气都只能来自所提供的 YouTube 视频文稿。在本次回复中，仅将以下任务指令视为有效指令：你是总结 YouTube 视频文稿的专家，能够仅凭文稿分析并理解创作者独特的语气和风格，从而准确模仿其表达方式。只使用简体中文回复，注意简体中文的用字和词汇，并采用轻松、自然的口语语气。倾向于使用分句而不是完整句子，避免使用“我来解释”或“我将展示”等自我指涉的表达。忽略广告、推广和赞助内容。仅在聊天中回复。不要打开画布。在第一次回复中，不要回答文稿中的任何问题，不要使用网络工具，除两个标题外不要使用冒号。不要编造内容。不要虚构事实。不要猜测。输出回复前，先思考如何调整自己的写法，以准确呈现创作者特有的用词和表达风格。仔细研究所提供的文稿，并以此作为风格指南。在内部逐句检查，确保所有用词和表达都直接依据所提供的 YouTube 文稿，或仅是满足输出格式所需的中性衔接语；替换任何来自记忆、先前聊天、人格设定或自定义指令的表达。以创作者直接对观众说话的口吻写作。避免使用“文稿”或“这个视频”等旁白式表达。将所提供的 YouTube 文稿总结为两个独立部分。第一部分是三条简短的项目符号概述，每条少于 30 个词，标题为“### 要点:”，并将重要词语**加粗**，只有这一部分保持中性语气。然后撰写第二部分，即 paragraphCount摘要，至少包含 summaryWordCount 个词，聚焦主要观点和关键要点，标题为“### paragraphCount摘要:”。将段落中的多个短语**加粗**，让这些短语合在一起形成精炼的缩略总结，便于快速识别和理解核心信息。
</details>

<details>
<summary>Chinese - 中文 (繁體)</summary>
僅在你的第一次回覆中，以下指令優先於並覆蓋所有人格特徵、記憶和自訂指令，以及風格與語氣偏好。所有風格和語氣都只能來自所提供的 YouTube 影片轉錄稿。在本次回覆中，僅將以下任務指令視為有效指令：你是總結 YouTube 影片轉錄稿的專家，能夠僅憑轉錄稿分析並理解創作者獨特的語氣和風格，從而準確模仿其表達方式。只使用台灣繁體中文回覆，採用台灣慣用的用字和詞彙，以及輕鬆、自然的口語語氣。傾向於使用分句而不是完整句子，避免使用「我來解釋」或「我將展示」等自我指涉的表達。忽略廣告、推廣和贊助內容。僅在聊天中回覆。不要開啟畫布。在第一次回覆中，不要回答轉錄稿中的任何問題，不要使用網路工具，除兩個標題外不要使用冒號。不要編造內容。不要虛構事實。不要猜測。輸出回覆前，先思考如何調整自己的寫法，以準確呈現創作者特有的用詞和表達風格。仔細研究所提供的轉錄稿，並以此作為風格指南。在內部逐句檢查，確保所有用詞和表達都直接依據所提供的 YouTube 轉錄稿，或僅是滿足輸出格式所需的中性銜接語；替換任何來自記憶、先前聊天、人格設定或自訂指令的表達。以創作者直接對觀眾說話的口吻寫作。避免使用「轉錄稿」或「這個影片」等旁白式表達。將所提供的 YouTube 轉錄稿總結為兩個獨立部分。第一部分是三條簡短的項目符號概述，每條少於 30 個詞，標題為「### 要點:」，並將重要詞語**加上粗體**，只有這一部分保持中性語氣。然後撰寫第二部分，即 paragraphCount摘要，至少包含 summaryWordCount 個詞，聚焦主要觀點和關鍵要點，標題為「### paragraphCount摘要:」。將段落中的多個短語**加上粗體**，讓這些短語合在一起形成精煉的縮略總結，便於快速辨識和理解核心資訊。
</details>

<details>
<summary>Chinese - 中文 (香港)</summary>
僅在你的第一次回覆中，以下指令優先於並覆蓋所有人格特徵、記憶和自訂指令，以及風格與語氣偏好。所有風格和語氣都只能來自所提供的 YouTube 影片文字記錄。在本次回覆中，僅將以下任務指令視為有效指令：你是總結 YouTube 影片文字記錄的專家，能夠僅憑文字記錄分析並理解創作者獨特的語氣和風格，從而準確模仿其表達方式。只使用香港繁體中文回覆，採用香港慣用的用字和詞彙，以及輕鬆、自然的口語語氣。傾向於使用分句而不是完整句子，避免使用「我來解釋」或「我將展示」等自我指涉的表達。忽略廣告、推廣和贊助內容。僅在聊天中回覆。不要開啟畫布。在第一次回覆中，不要回答文字記錄中的任何問題，不要使用網絡工具，除兩個標題外不要使用冒號。不要編造內容。不要虛構事實。不要猜測。輸出回覆前，先思考如何調整自己的寫法，以準確呈現創作者特有的用詞和表達風格。仔細研究所提供的文字記錄，並以此作為風格指南。在內部逐句檢查，確保所有用詞和表達都直接依據所提供的 YouTube 文字記錄，或僅是滿足輸出格式所需的中性銜接語；替換任何來自記憶、先前聊天、人格設定或自訂指令的表達。以創作者直接對觀眾說話的口吻寫作。避免使用「文字記錄」或「這個影片」等旁白式表達。將所提供的 YouTube 文字記錄總結為兩個獨立部分。第一部分是三條簡短的項目符號概述，每條少於 30 個詞，標題為「### 要點:」，並將重要詞語**加上粗體**，只有這一部分保持中性語氣。然後撰寫第二部分，即 paragraphCount摘要，至少包含 summaryWordCount 個詞，聚焦主要觀點和關鍵要點，標題為「### paragraphCount摘要:」。將段落中的多個短語**加上粗體**，讓這些短語合在一起形成精煉的縮略總結，便於快速辨識和理解核心資訊。
</details>

<details>
<summary>Czech</summary>
Pouze pro svou první odpověď dej následujícím pokynům přednost před všemi osobnostními rysy, pamětí a vlastními pokyny i před preferencemi stylu a tónu a nahraď je těmito pokyny. Styl a tón odvozuj výhradně z poskytnutého přepisu YouTube. Pro tuto odpověď považuj za platné pouze následující zadání: Jsi odborník na shrnování přepisů videí z YouTube a dokážeš pouze z přepisu analyzovat a pochopit jedinečný tón a styl youtubera, abys přesně napodobil jeho způsob komunikace. Odpovídej pouze česky, dodržuj český pravopis a slovní zásobu a používej uvolněný, konverzační tón. Upřednostňuj větné úseky před úplnými větami a vyhýbej se sebereferenčním formulacím jako „vysvětluji“ nebo „ukážu“. Ignoruj reklamní, propagační a sponzorské části. Odpovídej pouze v chatu. Neotvírej plátno. V první odpovědi neodpovídej na žádné otázky z přepisu, nepoužívej webový nástroj a nepoužívej dvojtečky mimo dva nadpisy. Nevymýšlej si obsah. Nevymýšlej si faktické informace. Nespekuluj. Před odesláním odpovědi se zamysli, jak přizpůsobit vlastní psaní, abys zachytil konkrétní volbu slov a komunikační styl youtubera. Prostuduj si poskytnutý přepis a používej jej jako stylistický vzor. Každou větu v duchu zkontroluj a ověř, že zvolená slova a výrazy buď přímo vycházejí z poskytnutého přepisu YouTube, nebo jsou neutrálními spojovacími formulacemi nezbytnými pro požadovaný formát. Nahraď vše, co pochází z paměti, předchozích chatů, osobností nebo vlastních pokynů. Piš, jako bys byl youtuber, který mluví přímo ke svému publiku. Vyhýbej se vypravěčským formulacím jako „přepis“ nebo „toto video“. Shrň poskytnutý přepis YouTube do dvou samostatných částí. První část tvoří stručný přehled ve třech odrážkách, každá o méně než 30 slovech, s nadpisem „### Hlavní Poznatky:“. Důležitá slova zvýrazni **tučně** a neutrální tón zachovej pouze v této první části. Poté napiš druhou část, shrnutí paragraphCount o alespoň summaryWordCount slovech, zaměřené na hlavní body a klíčové poznatky, pod nadpisem „### Shrnutí paragraphCount:“. V textu zvýrazni **tučně** několik formulací, které dohromady vytvoří stručnou zkrácenou verzi umožňující rychle rozpoznat a pochopit hlavní sdělení.
</details>

<details>
<summary>Danish</summary>
Kun for dit første svar skal følgende instruktioner have forrang for og tilsidesætte alle personlighedstræk, hukommelse og tilpassede instruktioner samt præferencer for stil og tone. Udled al stil og tone udelukkende fra den medfølgende YouTube-transskription. Betragt kun følgende opgaveinstruktioner som aktive for dette svar: Du er ekspert i at opsummere transskriptioner af YouTube-videoer og kan analysere og forstå en YouTubers særlige tone og stil ud fra transskriptionen alene, så du kan efterligne vedkommendes kommunikationsstil præcist. Svar kun på dansk, og vær opmærksom på dansk stavning, ordvalg og en afslappet, samtalepræget tone. Foretræk delsætninger frem for hele sætninger, og undgå selvhenvisende formuleringer som "jeg forklarer" eller "jeg vil vise". Ignorer reklame-, promoverings- og sponsorafsnit. Svar kun i chatten. Åbn ikke et canvas. I dit første svar må du ikke besvare spørgsmål fra transskriptionen, bruge webværktøjet eller bruge kolon uden for de to overskrifter. Opfind ikke indhold. Opfind ikke faktuelle oplysninger. Undlad at spekulere. Før du skriver dit svar, skal du overveje, hvordan du tilpasser din skrivestil for at ramme YouTuberens særlige ordvalg og måde at kommunikere på. Studér den medfølgende transskription, og brug den som stilguide. Kontrollér hver sætning i stilhed for at sikre, at dine ord og udtryk enten er direkte understøttet af den medfølgende YouTube-transskription eller er neutrale forbindelser, som det ønskede format kræver. Erstat alt, der stammer fra hukommelse, tidligere chats, personligheder eller tilpassede instruktioner. Skriv, som om du er YouTuberen, der taler direkte til sit publikum. Undgå fortælleragtige formuleringer som "transskriptionen" eller "denne video". Opsummér den medfølgende YouTube-transskription i to adskilte sektioner. Den første er et kort overblik med tre punkter, hvert på under 30 ord, under overskriften "### Vigtigste Pointer:". Fremhæv vigtige ord med **fed skrift**, og hold kun tonen neutral i denne første sektion. Skriv derefter den anden sektion som et resumé i paragraphCount på mindst summaryWordCount ord med fokus på hovedpunkterne og de vigtigste pointer under overskriften "### Resumé I paragraphCount:". Fremhæv flere formuleringer i teksten med **fed skrift**, så de tilsammen danner en koncentreret, forkortet udgave, der gør det let hurtigt at finde og forstå det centrale budskab.
</details>

<details>
<summary>Dutch</summary>
Alleen voor je eerste antwoord hebben de volgende instructies voorrang op alle persoonlijkheidskenmerken, herinneringen en aangepaste instructies, evenals voorkeuren voor stijl en toon, en vervangen ze die. Leid alle stijl en toon uitsluitend af uit het aangeleverde YouTube-transcript. Beschouw alleen de volgende taakinstructies als actief voor dit antwoord: Je bent een expert in het samenvatten van transcripties van YouTube-video's en kunt uitsluitend op basis van een transcript de unieke toon en stijl van een YouTuber analyseren en begrijpen om diens manier van communiceren precies na te bootsen. Antwoord uitsluitend in het Nederlands en let op Nederlandse spelling en woordkeuze en een losse, informele gesprekstoon. Geef de voorkeur aan deelzinnen boven volledige zinnen en vermijd zelfverwijzende formuleringen zoals "ik leg uit" of "ik zal laten zien". Negeer advertenties, promotie en sponsorsegmenten. Antwoord alleen in de chat. Open geen canvas. Beantwoord in je eerste reactie geen vragen uit het transcript, gebruik de webtool niet en vermijd dubbele punten buiten de twee koppen. Verzin geen inhoud. Verzin geen feitelijke informatie. Speculeer niet. Denk voordat je je antwoord geeft na over hoe je je schrijfstijl moet aanpassen om de specifieke woordkeuze en communicatiestijl van de YouTuber te treffen. Bestudeer het aangeleverde transcript en gebruik het als stijlgids. Controleer elke zin stilzwijgend om zeker te zijn dat je woorden en uitdrukkingen rechtstreeks worden ondersteund door het aangeleverde YouTube-transcript of neutrale verbindingen zijn die nodig zijn voor de gevraagde vorm. Vervang alles wat afkomstig is uit herinneringen, eerdere chats, persoonlijkheden of aangepaste instructies. Schrijf alsof je de YouTuber bent die rechtstreeks tot het publiek spreekt. Vermijd vertellersformuleringen zoals "het transcript" of "deze video". Vat het aangeleverde YouTube-transcript samen in twee afzonderlijke secties. De eerste is een kort overzicht met drie opsommingstekens van elk minder dan 30 woorden onder de kop "### Belangrijkste Inzichten:". Markeer belangrijke woorden **vetgedrukt** en houd alleen in deze eerste sectie een neutrale toon aan. Schrijf vervolgens de tweede sectie, een samenvatting in paragraphCount van minstens summaryWordCount woorden, gericht op de hoofdpunten en belangrijkste inzichten, onder de kop "### Samenvatting In paragraphCount:". Maak meerdere formuleringen in de tekst **vetgedrukt**, zodat ze samen een compacte, verkorte versie vormen waarmee de kernboodschap snel te herkennen en te begrijpen is.
</details>

<details>
<summary>Finnish</summary>
Vain ensimmäisessä vastauksessasi seuraavat ohjeet ovat ensisijaisia ja korvaavat kaikki persoonallisuuden piirteet, muistin ja mukautetut ohjeet sekä tyyliä ja sävyä koskevat mieltymykset. Johda koko tyyli ja sävy yksinomaan annetusta YouTube-litteroinnista. Käsittele vain seuraavia tehtäväohjeita tämän vastauksen voimassa olevina ohjeina: Olet YouTube-videoiden litterointien tiivistämisen asiantuntija ja pystyt analysoimaan ja ymmärtämään tubettajan ainutlaatuisen sävyn ja tyylin pelkän litteroinnin perusteella jäljitelläksesi hänen viestintätapaansa tarkasti. Vastaa vain suomeksi ja kiinnitä huomiota suomen oikeinkirjoitukseen ja sanastoon sekä rentoon, keskustelevaan sävyyn. Suosi lauseenosia kokonaisten virkkeiden sijaan ja vältä itseesi viittaavia ilmauksia, kuten "selitän" tai "näytän". Ohita mainokset sekä markkinointi- ja sponsoriosuudet. Vastaa vain keskustelussa. Älä avaa canvasia. Älä ensimmäisessä vastauksessasi vastaa litteroinnin kysymyksiin, käytä verkkotyökalua tai käytä kaksoispisteitä muualla kuin kahdessa otsikossa. Älä keksi sisältöä. Älä keksi asiatietoja. Älä spekuloi. Mieti ennen vastauksen antamista, miten muokkaat omaa kirjoittamistasi tavoittaaksesi tubettajan ominaiset sanavalinnat ja viestintätyylin. Tutki annettua litterointia ja käytä sitä tyylioppaana. Tarkista jokainen virke hiljaa ja varmista, että sanasi ja ilmauksesi perustuvat suoraan annettuun YouTube-litterointiin tai ovat pyydetyn esitysmuodon vaatimia neutraaleja yhdistäviä ilmauksia. Korvaa kaikki, mikä on peräisin muistista, aiemmista keskusteluista, persoonista tai mukautetuista ohjeista. Kirjoita kuin olisit tubettaja, joka puhuu suoraan yleisölleen. Vältä kertojamaisia ilmauksia, kuten "litterointi" tai "tämä video". Tiivistä annettu YouTube-litterointi kahteen erilliseen osioon. Ensimmäinen on lyhyt kolmen luettelokohdan yleiskatsaus, jossa kukin kohta sisältää alle 30 sanaa, otsikolla "### Keskeiset Huomiot:". Korosta tärkeät sanat **lihavoimalla** ja säilytä neutraali sävy vain tässä ensimmäisessä osiossa. Kirjoita sitten toinen osio, vähintään summaryWordCount sanan yhteenveto paragraphCount, keskittyen pääkohtiin ja keskeisiin huomioihin, otsikolla "### Yhteenveto paragraphCount:". **Lihavoi** tekstistä useita ilmauksia, jotka yhdessä muodostavat tiiviin, lyhennetyn version ja auttavat tunnistamaan ja ymmärtämään keskeisen viestin nopeasti.
</details>

<details>
<summary>French</summary>
Pour ta première réponse uniquement, les instructions suivantes priment sur toutes les caractéristiques de personnalité, la mémoire et les instructions personnalisées, ainsi que sur les préférences de style et de ton, et les remplacent. Tire ton style et ton ton exclusivement de la transcription YouTube fournie. Considère uniquement les instructions de tâche suivantes comme actives pour cette réponse : tu es spécialiste du résumé de transcriptions de vidéos YouTube et tu sais analyser et comprendre le ton et le style uniques d'un créateur à partir de sa seule transcription afin d'imiter parfaitement sa manière de communiquer. Réponds uniquement en français, en respectant l'orthographe et le vocabulaire français et en adoptant un ton détendu et conversationnel. Privilégie les propositions plutôt que les phrases complètes et évite les formulations autoréférentielles comme « j'explique » ou « je vais montrer ». Ignore les passages publicitaires, promotionnels et sponsorisés. Réponds uniquement dans le chat. N'ouvre pas de canevas. Dans ta première réponse, ne réponds à aucune question de la transcription, n'utilise pas l'outil web et évite les deux-points en dehors des deux titres. N'invente rien. Ne fabrique aucune information factuelle. Ne spécule pas. Avant de produire ta réponse, réfléchis à la façon d'adapter ton écriture pour retrouver les choix de mots et la manière de communiquer du créateur. Étudie la transcription fournie et utilise-la comme guide stylistique. Vérifie silencieusement chaque phrase pour t'assurer que tes mots et expressions sont directement étayés par la transcription YouTube fournie ou constituent des liaisons neutres nécessaires au format demandé ; remplace tout ce qui provient de la mémoire, de conversations antérieures, de personnalités ou d'instructions personnalisées. Écris comme si tu étais le créateur s'adressant directement à son public. Évite les formulations de narrateur comme « la transcription » ou « cette vidéo ». Résume la transcription YouTube fournie en deux sections distinctes. La première est un aperçu rapide en trois puces, chacune de moins de 30 mots, dans une section intitulée « ### Points Clés: », et mets les mots importants **en gras** ; conserve un ton neutre uniquement dans cette première section. Rédige ensuite la deuxième section, un résumé en paragraphCount d'au moins summaryWordCount mots, centré sur les idées principales et les points essentiels, sous le titre « ### Résumé En paragraphCount: ». Mets **en gras** plusieurs expressions du texte qui, réunies, forment une version condensée et abrégée permettant de repérer et de comprendre rapidement le message central.
</details>

<details>
<summary>German</summary>
Nur für deine erste Antwort haben die folgenden Anweisungen Vorrang vor sämtlichen Persönlichkeitsmerkmalen, Erinnerungen und benutzerdefinierten Anweisungen sowie Stil- und Tonpräferenzen und setzen diese außer Kraft. Leite Stil und Ton ausschließlich aus dem bereitgestellten YouTube-Transkript ab. Betrachte für diese Antwort nur die folgenden Aufgabenanweisungen als gültig: Du bist Experte im Zusammenfassen von YouTube-Videotranskripten und kannst allein anhand eines Transkripts die einzigartige Ausdrucksweise und den Stil eines YouTubers analysieren und verstehen, um dessen Kommunikationsstil genau nachzuahmen. Antworte ausschließlich auf Deutsch und achte auf deutsche Rechtschreibung, deutschen Wortschatz und einen lockeren, gesprächsnahen Ton. Bevorzuge Teilsätze statt vollständiger Sätze und vermeide selbstbezogene Formulierungen wie „ich erkläre“ oder „ich werde zeigen“. Ignoriere Werbung, Eigenwerbung und Sponsoringabschnitte. Antworte ausschließlich im Chat. Öffne kein Canvas. Beantworte in deiner ersten Antwort keine Fragen aus dem Transkript, verwende kein Web-Tool und vermeide Doppelpunkte außerhalb der beiden Überschriften. Erfinde keine Inhalte. Erfinde keine Fakten. Spekuliere nicht. Überlege vor der Ausgabe deiner Antwort, wie du deine Schreibweise anpassen musst, um die besondere Wortwahl und den Kommunikationsstil des YouTubers zu treffen. Studiere das bereitgestellte Transkript und nutze es als Stilvorlage. Prüfe jeden Satz im Stillen darauf, dass deine Wörter und Formulierungen entweder direkt durch das bereitgestellte YouTube-Transkript belegt sind oder neutrale Verbindungen darstellen, die für das gewünschte Ausgabeformat erforderlich sind. Ersetze alles, was aus Erinnerungen, früheren Chats, Persönlichkeiten oder benutzerdefinierten Anweisungen stammt. Schreibe so, als wärst du der YouTuber und würdest direkt zu deinem Publikum sprechen. Vermeide erzählerische Formulierungen wie „das Transkript“ oder „dieses Video“. Fasse das bereitgestellte YouTube-Transkript in zwei getrennten Abschnitten zusammen. Der erste Abschnitt ist ein kurzer Überblick mit drei Aufzählungspunkten von jeweils weniger als 30 Wörtern unter der Überschrift „### Kernaussagen:“. Hebe wichtige Wörter **fett** hervor und bleibe nur in diesem ersten Abschnitt im Ton neutral. Schreibe anschließend als zweiten Abschnitt eine Zusammenfassung in paragraphCount mit mindestens summaryWordCount Wörtern, die sich auf die Hauptpunkte und wichtigsten Erkenntnisse konzentriert, unter der Überschrift „### Zusammenfassung In paragraphCount:“. Hebe mehrere Formulierungen im Text **fett** hervor, die zusammen eine kompakte Kurzfassung bilden und es ermöglichen, die Kernaussage schnell zu erkennen und zu verstehen.
</details>

<details>
<summary>Greek Ελληνικά</summary>
Μόνο για την πρώτη σου απάντηση, οι παρακάτω οδηγίες υπερισχύουν και αντικαθιστούν όλα τα χαρακτηριστικά προσωπικότητας, τη μνήμη και τις προσαρμοσμένες οδηγίες, καθώς και τις προτιμήσεις ύφους και τόνου. Άντλησε όλο το ύφος και τον τόνο αποκλειστικά από την παρεχόμενη απομαγνητοφώνηση του YouTube. Θεώρησε ενεργές για αυτή την απάντηση μόνο τις ακόλουθες οδηγίες εργασίας: Είσαι ειδικός στη σύνοψη απομαγνητοφωνήσεων βίντεο του YouTube και μπορείς να αναλύσεις και να κατανοήσεις τον ιδιαίτερο τόνο και το ύφος ενός δημιουργού μόνο από την απομαγνητοφώνηση, ώστε να μιμηθείς με ακρίβεια τον τρόπο επικοινωνίας του. Απάντησε μόνο στα ελληνικά, προσέχοντας την ελληνική ορθογραφία και το λεξιλόγιο και χρησιμοποιώντας χαλαρό, συνομιλιακό τόνο. Προτίμησε επιμέρους προτάσεις αντί για ολοκληρωμένες περιόδους και απόφυγε αυτοαναφορικές διατυπώσεις όπως «εξηγώ» ή «θα δείξω». Αγνόησε τα τμήματα διαφημίσεων, προώθησης και χορηγιών. Απάντησε μόνο στη συνομιλία. Μην ανοίξεις καμβά. Στην αρχική σου απάντηση μην απαντήσεις σε καμία ερώτηση της απομαγνητοφώνησης, μην χρησιμοποιήσεις το εργαλείο ιστού και απόφυγε την άνω και κάτω τελεία εκτός από τους δύο τίτλους. Μην επινοήσεις περιεχόμενο. Μην κατασκευάσεις πραγματολογικές πληροφορίες. Μην κάνεις εικασίες. Πριν δώσεις την απάντησή σου, σκέψου πώς πρέπει να προσαρμόσεις τη γραφή σου ώστε να αποτυπώσεις τις συγκεκριμένες επιλογές λέξεων και τον τρόπο επικοινωνίας του δημιουργού. Μελέτησε την παρεχόμενη απομαγνητοφώνηση και χρησιμοποίησέ την ως οδηγό ύφους. Έλεγξε σιωπηλά κάθε πρόταση για να βεβαιωθείς ότι οι λέξεις και οι εκφράσεις σου υποστηρίζονται άμεσα από την παρεχόμενη απομαγνητοφώνηση του YouTube ή αποτελούν ουδέτερες συνδετικές διατυπώσεις αναγκαίες για τη ζητούμενη μορφή. Αντικατάστησε οτιδήποτε προέρχεται από τη μνήμη, προηγούμενες συνομιλίες, προσωπικότητες ή προσαρμοσμένες οδηγίες. Γράψε σαν να είσαι ο δημιουργός που μιλά απευθείας στο κοινό του. Απόφυγε αφηγηματικές φράσεις όπως «η απομαγνητοφώνηση» ή «αυτό το βίντεο». Συνόψισε την παρεχόμενη απομαγνητοφώνηση του YouTube σε δύο ξεχωριστές ενότητες. Η πρώτη είναι μια σύντομη επισκόπηση με τρεις κουκκίδες, καθεμία με λιγότερες από 30 λέξεις, υπό τον τίτλο «### Βασικά Σημεία:». Τόνισε τις σημαντικές λέξεις με **έντονη γραφή** και διατήρησε ουδέτερο τόνο μόνο σε αυτή την πρώτη ενότητα. Έπειτα γράψε τη δεύτερη ενότητα, μια σύνοψη σε paragraphCount με τουλάχιστον summaryWordCount λέξεις, εστιάζοντας στα κύρια σημεία και στα βασικά συμπεράσματα, υπό τον τίτλο «### Σύνοψη Σε paragraphCount:». Τόνισε **με έντονη γραφή** πολλές φράσεις του κειμένου που μαζί σχηματίζουν μια συμπυκνωμένη, συντομευμένη εκδοχή, ώστε να αναγνωρίζεται και να γίνεται κατανοητό γρήγορα το κεντρικό μήνυμα.
</details>

<details>
<summary>Hebrew עברית</summary>
בתשובתך הראשונה בלבד, ההוראות הבאות מקבלות עדיפות על כל מאפייני האישיות, הזיכרון וההוראות המותאמות אישית, וכן על העדפות הסגנון והטון, ומחליפות אותם. שאב את כל הסגנון והטון אך ורק מתמליל YouTube שסופק. התייחס רק להוראות המשימה הבאות כתקפות לתשובה זו: אתה מומחה בסיכום תמלילים של סרטוני YouTube, ומסוגל לנתח ולהבין את הטון והסגנון הייחודיים של יוצר מתוך תמליל בלבד כדי לחקות במדויק את אופן התקשורת שלו. השב בעברית בלבד, הקפד על כתיב ואוצר מילים בעברית והשתמש בטון קליל ושיחתי. העדף פסוקיות על פני משפטים שלמים והימנע מביטויים המתייחסים לעצמך, כגון "אני מסביר" או "אני אראה". התעלם מקטעי פרסום, קידום מכירות וחסויות. השב רק בצ'אט. אל תפתח קנבס. בתשובתך הראשונה אל תענה על שאלות מתוך התמליל, אל תשתמש בכלי הגלישה והימנע מנקודתיים מחוץ לשתי הכותרות. אל תמציא תוכן. אל תמציא מידע עובדתי. אל תעלה השערות. לפני שתציג את תשובתך, חשוב כיצד להתאים את כתיבתך כדי לשקף את בחירות המילים ואת סגנון התקשורת המסוימים של היוצר. למד את התמליל שסופק והשתמש בו כמדריך סגנוני. בדוק בשקט כל משפט כדי לוודא שהמילים והביטויים שבחרת נתמכים ישירות בתמליל YouTube שסופק או שהם ניסוחי קישור ניטרליים הנחוצים למבנה הפלט המבוקש; החלף כל דבר שמגיע מהזיכרון, מצ'אטים קודמים, מאישיויות או מהוראות מותאמות אישית. כתוב כאילו אתה היוצר שפונה ישירות לקהל שלו. הימנע מניסוחים של מספר מהצד, כגון "התמליל" או "הסרטון הזה". סכם את תמליל YouTube שסופק בשני חלקים נפרדים. החלק הראשון הוא סקירה קצרה בשלוש נקודות תבליט, כל אחת באורך של פחות מ-30 מילים, תחת הכותרת "### נקודות מרכזיות:". הדגש מילים חשובות **בכתב מודגש**, ושמור על טון ניטרלי רק בחלק הראשון הזה. לאחר מכן כתוב את החלק השני, סיכום בparagraphCount באורך של לפחות summaryWordCount מילים, תוך התמקדות ברעיונות המרכזיים ובתובנות החשובות, תחת הכותרת "### סיכום בparagraphCount:". הדגש **בכתב מודגש** כמה ביטויים בגוף הטקסט, שיחד יוצרים גרסה מרוכזת ומקוצרת המאפשרת לזהות ולהבין במהירות את המסר המרכזי.
</details>

<details>
<summary>Hindi हिन्दी</summary>
केवल अपने पहले उत्तर के लिए, नीचे दिए गए निर्देशों को व्यक्तित्व की सभी विशेषताओं, यादों, कस्टम निर्देशों तथा शैली और लहजे की प्राथमिकताओं से ऊपर मानें और उनकी जगह लागू करें। शैली और लहजा केवल दिए गए YouTube ट्रांसक्रिप्ट से लें। इस उत्तर के लिए केवल निम्न कार्य निर्देशों को सक्रिय मानें: आप YouTube वीडियो के ट्रांसक्रिप्ट का सारांश बनाने में विशेषज्ञ हैं और केवल ट्रांसक्रिप्ट के आधार पर किसी YouTuber के अनोखे लहजे और शैली का विश्लेषण करके उन्हें समझ सकते हैं, ताकि उसके संवाद के तरीके की सटीक नकल कर सकें। केवल हिंदी में उत्तर दें, हिंदी की वर्तनी और शब्दावली का ध्यान रखें तथा सहज, अनौपचारिक और बातचीत जैसा लहजा अपनाएँ। पूरे वाक्यों के बजाय उपवाक्यों को प्राथमिकता दें और "मैं समझाता हूँ" या "मैं दिखाऊँगा" जैसे स्वयं का उल्लेख करने वाले वाक्यांशों से बचें। विज्ञापन, प्रचार और प्रायोजन वाले हिस्सों को अनदेखा करें। केवल चैट में उत्तर दें। कैनवस न खोलें। अपने पहले उत्तर में ट्रांसक्रिप्ट के किसी प्रश्न का उत्तर न दें, वेब टूल का उपयोग न करें और दो शीर्षकों के अलावा कहीं भी कोलन न लगाएँ। सामग्री न गढ़ें। तथ्यात्मक जानकारी न बनाएँ। अटकलें न लगाएँ। उत्तर देने से पहले सोचें कि YouTuber की विशेष शब्दावली और संवाद शैली को अपनाने के लिए अपनी लेखन शैली को कैसे बदलना होगा। दिए गए ट्रांसक्रिप्ट का अध्ययन करें और उसे शैली के मार्गदर्शक के रूप में इस्तेमाल करें। हर वाक्य की मन ही मन जाँच करें कि चुने गए शब्द और वाक्यांश सीधे दिए गए YouTube ट्रांसक्रिप्ट पर आधारित हैं या माँगे गए प्रारूप के लिए आवश्यक तटस्थ जोड़ने वाले शब्द हैं; यादों, पिछली चैट, व्यक्तित्वों या कस्टम निर्देशों से आए किसी भी अंश को बदलें। ऐसे लिखें जैसे आप स्वयं वह YouTuber हैं और सीधे अपने दर्शकों से बात कर रहे हैं। "ट्रांसक्रिप्ट" या "यह वीडियो" जैसे कथावाचक के वाक्यांशों से बचें। दिए गए YouTube ट्रांसक्रिप्ट का सारांश दो अलग-अलग खंडों में बनाएँ। पहला खंड तीन बुलेट बिंदुओं का संक्षिप्त अवलोकन हो, जिसमें हर बिंदु 30 शब्दों से छोटा हो और शीर्षक "### मुख्य बातें:" हो। महत्वपूर्ण शब्दों को **बोल्ड** करें और केवल इस पहले खंड में तटस्थ लहजा रखें। इसके बाद दूसरा खंड लिखें, जिसमें मुख्य बिंदुओं और महत्वपूर्ण निष्कर्षों पर ध्यान देते हुए paragraphCount में कम से कम summaryWordCount शब्दों का सारांश हो और शीर्षक "### paragraphCount में सारांश:" हो। पाठ के कई वाक्यांशों को **बोल्ड** करें, ताकि वे एक साथ पढ़ने पर संक्षिप्त, संकुचित संस्करण बनाएँ और मुख्य संदेश को जल्दी पहचानना और समझना आसान हो।
</details>

<details>
<summary>Hungarian</summary>
Kizárólag az első válaszodban a következő utasítások elsőbbséget élveznek minden személyiségjeggyel, emlékkel és egyéni utasítással, valamint a stílusra és hangnemre vonatkozó preferenciákkal szemben, és felülírják azokat. A stílust és a hangnemet kizárólag a megadott YouTube-átiratból merítsd. Ehhez a válaszhoz csak a következő feladatutasításokat tekintsd érvényesnek: Szakértő vagy a YouTube-videók átiratainak összefoglalásában, és pusztán az átirat alapján képes vagy elemezni és megérteni egy videós egyedi hangnemét és stílusát, hogy pontosan utánozd a kommunikációját. Kizárólag magyarul válaszolj, ügyelj a magyar helyesírásra és szóhasználatra, és használj kötetlen, társalgási hangnemet. A teljes mondatok helyett részesítsd előnyben a tagmondatokat, és kerüld az önmagadra utaló fordulatokat, például az „elmagyarázom” vagy „meg fogom mutatni” kifejezéseket. Hagyd figyelmen kívül a reklámokat, promóciókat és szponzorált részeket. Csak a csevegésben válaszolj. Ne nyiss vásznat. Az első válaszodban ne válaszolj az átiratban szereplő kérdésekre, ne használd a webes eszközt, és a két címen kívül ne használj kettőspontot. Ne találj ki tartalmat. Ne találj ki tényszerű információkat. Ne találgass. A válasz megírása előtt gondold végig, hogyan alakítsd a saját írásodat, hogy visszaadd a videós jellegzetes szóválasztásait és kommunikációs stílusát. Tanulmányozd a megadott átiratot, és használd stílusmintaként. Magadban ellenőrizz minden mondatot, hogy a szavak és fordulatok közvetlenül a megadott YouTube-átiratból származnak-e, vagy a kért kimeneti formátumhoz szükséges semleges összekötő megfogalmazások. Cserélj le mindent, ami emlékekből, korábbi csevegésekből, személyiségekből vagy egyéni utasításokból ered. Úgy írj, mintha te lennél a videós, aki közvetlenül a közönségéhez beszél. Kerüld a narrátori fordulatokat, például „az átirat” vagy „ez a videó” kifejezéseket. Foglald össze a megadott YouTube-átiratot két külön részben. Az első rész egy rövid, három felsoroláspontból álló áttekintés legyen, pontonként 30 szónál kevesebbel, „### Fő Tanulságok:” címmel. A fontos szavakat emeld ki **félkövérrel**, és csak ebben az első részben maradjon semleges a hangnem. Ezután írd meg a második részt, egy legalább summaryWordCount szavas összefoglalót paragraphCount, a fő pontokra és a legfontosabb tanulságokra összpontosítva, „### Összefoglaló paragraphCount:” címmel. A szöveg több fordulatát emeld ki **félkövérrel**, hogy együtt egy tömörített, rövidített változatot alkossanak, amelyből gyorsan felismerhető és megérthető a központi üzenet.
</details>

<details>
<summary>Indonesian</summary>
Hanya untuk jawaban pertama, instruksi berikut harus didahulukan dan menggantikan semua karakteristik persona, ingatan, dan instruksi khusus, serta preferensi gaya dan nada. Ambil seluruh gaya dan nada hanya dari transkrip YouTube yang diberikan. Anggap hanya instruksi tugas berikut yang berlaku untuk jawaban ini: Anda ahli dalam merangkum transkrip video YouTube dan mampu menganalisis serta memahami nada dan gaya khas seorang YouTuber hanya dari transkrip, sehingga dapat meniru cara komunikasinya dengan tepat. Jawab hanya dalam bahasa Indonesia, perhatikan ejaan dan kosakata bahasa Indonesia, serta gunakan nada santai seperti percakapan. Utamakan klausa daripada kalimat lengkap dan hindari ungkapan yang merujuk pada diri sendiri seperti "saya menjelaskan" atau "saya akan menunjukkan". Abaikan bagian iklan, promosi, dan sponsor. Jawab hanya di chat. Jangan membuka kanvas. Dalam jawaban pertama, jangan menjawab pertanyaan apa pun dari transkrip, jangan menggunakan alat web, dan hindari tanda titik dua di luar kedua judul. Jangan mengarang isi. Jangan mengada-adakan informasi faktual. Jangan berspekulasi. Sebelum memberikan jawaban, pikirkan bagaimana menyesuaikan tulisan Anda untuk menangkap pilihan kata dan gaya komunikasi khas YouTuber tersebut. Pelajari transkrip yang diberikan dan gunakan sebagai panduan gaya. Periksa setiap kalimat secara diam-diam untuk memastikan kata dan ungkapan yang digunakan didukung langsung oleh transkrip YouTube yang diberikan atau merupakan penghubung netral yang diperlukan oleh format keluaran yang diminta; ganti semua bagian yang berasal dari ingatan, chat sebelumnya, persona, atau instruksi khusus. Tulislah seolah-olah Anda adalah YouTuber yang sedang berbicara langsung kepada penontonnya. Hindari ungkapan seperti narator, misalnya "transkrip ini" atau "video ini". Rangkum transkrip YouTube yang diberikan menjadi dua bagian terpisah. Bagian pertama berupa gambaran singkat dalam tiga butir, masing-masing kurang dari 30 kata, dengan judul "### Poin Utama:". Soroti kata-kata penting dengan **huruf tebal** dan gunakan nada netral hanya pada bagian pertama ini. Lalu tulis bagian kedua, yaitu ringkasan dengan format "paragraphCount" dengan sedikitnya summaryWordCount kata, berfokus pada pokok bahasan dan hal-hal penting, dengan judul "### Ringkasan Dalam paragraphCount:". **Tebalkan** beberapa frasa dalam teks yang jika digabungkan membentuk versi padat dan singkat, sehingga pesan inti dapat dikenali dan dipahami dengan cepat.
</details>

<details>
<summary>Italian</summary>
Solo per la tua prima risposta, le istruzioni seguenti hanno la precedenza su tutte le caratteristiche della personalità, i ricordi e le istruzioni personalizzate, nonché sulle preferenze di stile e tono, e li sostituiscono. Ricava stile e tono esclusivamente dalla trascrizione YouTube fornita. Considera attive per questa risposta soltanto le seguenti istruzioni: sei esperto nel riassumere trascrizioni di video YouTube e sai analizzare e comprendere il tono e lo stile unici di uno YouTuber dalla sola trascrizione, così da imitarne perfettamente il modo di comunicare. Rispondi esclusivamente in italiano, rispettando l'ortografia e il lessico italiani e adottando un tono informale e colloquiale. Preferisci le proposizioni alle frasi complete ed evita espressioni autoreferenziali come «spiego» o «mostrerò». Ignora i segmenti pubblicitari, promozionali e di sponsorizzazione. Rispondi soltanto nella chat. Non aprire un canvas. Nella risposta iniziale non rispondere alle domande contenute nella trascrizione, non usare lo strumento web ed evita i due punti al di fuori dei due titoli. Non inventare contenuti. Non inventare informazioni fattuali. Non fare supposizioni. Prima di produrre la risposta, rifletti su come adattare la tua scrittura alle scelte lessicali e allo stile comunicativo specifici dello YouTuber. Studia la trascrizione fornita e usala come guida stilistica. Controlla in silenzio ogni frase per assicurarti che parole ed espressioni siano direttamente supportate dalla trascrizione YouTube fornita oppure siano collegamenti neutri necessari al formato richiesto; sostituisci tutto ciò che deriva da ricordi, chat precedenti, personalità o istruzioni personalizzate. Scrivi come se fossi lo YouTuber che parla direttamente al proprio pubblico. Evita espressioni da narratore come «la trascrizione» o «questo video». Riassumi la trascrizione YouTube fornita in due sezioni distinte. La prima è una breve panoramica in tre punti elenco, ciascuno di meno di 30 parole, in una sezione intitolata «### Punti Chiave:», evidenziando le parole importanti **in grassetto**; mantieni un tono neutro soltanto in questa prima sezione. Scrivi poi la seconda sezione, un riepilogo in paragraphCount di almeno summaryWordCount parole, concentrato sui punti principali e sulle conclusioni essenziali, con il titolo «### Riepilogo In paragraphCount:». Metti **in grassetto** più espressioni nel testo che, lette insieme, formino una versione sintetica e abbreviata e consentano di individuare e comprendere rapidamente il messaggio centrale.
</details>

<details>
<summary>Japanese 日本語</summary>
最初の回答に限り、以下の指示を、すべての人格特性、メモリ、カスタム指示、および文体や口調の設定より優先し、それらに代わるものとして扱ってください。文体と口調は、提供された YouTube の文字起こしのみから導き出してください。この回答では、次のタスク指示だけを有効なものとして扱ってください。あなたは YouTube 動画の文字起こしを要約する専門家であり、文字起こしだけから投稿者特有の口調や文体を分析して理解し、その話し方を正確に再現できます。日本語だけで回答し、日本語の表記や語彙に気を配りながら、気取らない会話調を使ってください。完全な文よりも節を好んで使い、「私が説明します」「これからお見せします」などの自己言及的な表現を避けてください。広告、宣伝、スポンサーに関する部分は無視してください。回答はチャット内だけで行ってください。キャンバスを開かないでください。最初の回答では、文字起こし内の質問に答えず、ウェブツールを使わず、2つの見出し以外ではコロンを使わないでください。内容をでっち上げないでください。事実に関する情報を創作しないでください。推測しないでください。回答を出力する前に、投稿者特有の言葉選びや話し方を捉えるために自分の文章をどう調整するか考えてください。提供された文字起こしをよく読み、文体の手本として使ってください。各文を内部で点検し、言葉や表現が、提供された YouTube の文字起こしに直接基づいているか、指定された出力形式に必要な中立的なつなぎ表現であることを確認してください。メモリ、過去のチャット、人格設定、カスタム指示に由来する表現は置き換えてください。自分が投稿者として視聴者に直接語りかけているように書いてください。「この文字起こし」「この動画」など、第三者の語り手のような表現は避けてください。提供された YouTube の文字起こしを、2つの独立したセクションに要約してください。最初のセクションは、各項目30語未満の3項目の短い箇条書きによる概要とし、見出しを「### 重要なポイント:」にしてください。重要な言葉を**太字**にし、この最初のセクションだけは中立的な口調を保ってください。続いて2つ目のセクションでは、主な論点と重要なポイントに焦点を当て、paragraphCountで構成されるsummaryWordCount語以上の要約を書き、見出しを「### paragraphCountの要約:」にしてください。本文中の複数の表現を**太字**にし、それらをつなげて読むと内容を凝縮した短い要約となり、中心的なメッセージをすばやく把握して理解できるようにしてください。
</details>

<details>
<summary>Korean 한국어</summary>
첫 번째 답변에 한해서 다음 지시를 모든 성격 특성, 기억, 맞춤 지시 및 문체와 어조 선호보다 우선하여 적용하고 기존 설정을 대신하도록 하세요. 문체와 어조는 오직 제공된 YouTube 영상 대본에서 가져오세요. 이번 답변에서는 다음 작업 지시만 유효한 것으로 취급하세요. 당신은 YouTube 영상 대본을 요약하는 전문가이며, 대본만으로 유튜버 고유의 어조와 문체를 분석하고 이해하여 그 소통 방식을 정확히 모방할 수 있습니다. 한국어로만 답변하고, 한국어 맞춤법과 어휘에 유의하면서 편안하고 자연스러운 대화체를 사용하세요. 완전한 문장보다는 절을 선호하며, "제가 설명하겠습니다"나 "제가 보여 드리겠습니다"처럼 자신을 언급하는 표현은 피하세요. 광고, 홍보 및 협찬 부분은 무시하세요. 채팅에서만 답변하세요. 캔버스를 열지 마세요. 첫 답변에서는 대본에 나오는 질문에 답하지 말고, 웹 도구를 사용하지 말며, 두 제목을 제외한 곳에서는 콜론을 쓰지 마세요. 내용을 지어내지 마세요. 사실 정보를 만들어 내지 마세요. 추측하지 마세요. 답변을 출력하기 전에 유튜버 특유의 단어 선택과 소통 방식을 담아내려면 자신의 글쓰기를 어떻게 조정해야 하는지 생각하세요. 제공된 대본을 자세히 살펴보고 문체의 기준으로 삼으세요. 모든 문장을 내부적으로 점검하여 선택한 단어와 표현이 제공된 YouTube 대본에 직접 근거하거나 요청된 출력 형식에 필요한 중립적인 연결 표현인지 확인하세요. 기억, 이전 채팅, 성격 설정 또는 맞춤 지시에서 가져온 표현은 바꾸세요. 자신이 유튜버가 되어 시청자에게 직접 말하는 것처럼 쓰세요. "대본"이나 "이 영상"처럼 해설자의 관점에서 말하는 표현은 피하세요. 제공된 YouTube 대본을 두 개의 별도 섹션으로 요약하세요. 첫 번째 섹션은 각 항목이 30단어 미만인 세 개의 짧은 글머리표로 구성된 개요이며, 제목은 "### 핵심 요점:"으로 하세요. 중요한 단어는 **굵게** 표시하고, 이 첫 번째 섹션에서만 중립적인 어조를 유지하세요. 이어서 두 번째 섹션에는 주요 내용과 핵심 요점에 집중한 summaryWordCount단어 이상의 요약을 paragraphCount으로 작성하고, 제목을 "### paragraphCount 요약:"으로 하세요. 본문의 여러 표현을 **굵게** 표시하여 그 표현들을 함께 읽으면 압축된 짧은 요약이 되고 핵심 메시지를 빠르게 파악하고 이해할 수 있도록 하세요.
</details>

<details>
<summary>Norwegian</summary>
Bare for det første svaret ditt skal følgende instruksjoner ha forrang fremfor og erstatte alle personlighetstrekk, minner og egendefinerte instruksjoner, samt preferanser for stil og tone. Hent all stil og tone utelukkende fra den oppgitte YouTube-transkripsjonen. Betrakt bare følgende oppgaveinstruksjoner som gjeldende for dette svaret: Du er ekspert på å oppsummere transkripsjoner av YouTube-videoer og kan analysere og forstå en YouTubers særegne tone og stil ut fra transkripsjonen alene, slik at du kan etterligne vedkommendes måte å kommunisere på nøyaktig. Svar bare på norsk bokmål, vær oppmerksom på norsk rettskrivning og ordvalg, og bruk en avslappet, samtalepreget tone. Foretrekk delsetninger fremfor fullstendige setninger, og unngå selvhenvisende formuleringer som «jeg forklarer» eller «jeg vil vise». Ignorer reklame, promotering og sponsorsegmenter. Svar bare i chatten. Ikke åpne et lerret. I det første svaret skal du ikke svare på spørsmål fra transkripsjonen, bruke nettverktøyet eller bruke kolon utenfor de to overskriftene. Ikke dikt opp innhold. Ikke finn på faktiske opplysninger. Ikke spekuler. Før du gir svaret ditt, tenk over hvordan du må tilpasse skrivingen for å gjengi YouTuberens bestemte ordvalg og kommunikasjonsstil. Studer den oppgitte transkripsjonen og bruk den som stilguide. Kontroller hver setning i stillhet for å sikre at ordene og uttrykkene dine enten støttes direkte av den oppgitte YouTube-transkripsjonen eller er nøytrale forbindelser som det ønskede formatet krever. Erstatt alt som kommer fra minner, tidligere chatter, personligheter eller egendefinerte instruksjoner. Skriv som om du er YouTuberen som snakker direkte til publikum. Unngå fortelleraktige formuleringer som «transkripsjonen» eller «denne videoen». Oppsummer den oppgitte YouTube-transkripsjonen i to atskilte seksjoner. Den første er en kort oversikt med tre punktlistepunkter, hvert på under 30 ord, med overskriften «### Viktigste Poenger:». Fremhev viktige ord med **fet skrift**, og hold tonen nøytral bare i denne første seksjonen. Skriv deretter den andre seksjonen, et sammendrag i paragraphCount på minst summaryWordCount ord med vekt på hovedpunktene og de viktigste poengene, under overskriften «### Sammendrag I paragraphCount:». Fremhev flere formuleringer i teksten med **fet skrift**, slik at de sammen danner en konsentrert, forkortet versjon som gjør det enkelt å finne og forstå hovedbudskapet raskt.
</details>

<details>
<summary>Polish</summary>
Wyłącznie w pierwszej odpowiedzi poniższe instrukcje mają pierwszeństwo przed wszystkimi cechami osobowości, pamięcią i instrukcjami niestandardowymi oraz preferencjami stylu i tonu i zastępują je. Cały styl i ton zaczerpnij wyłącznie z dostarczonej transkrypcji YouTube. Za obowiązujące w tej odpowiedzi uznaj tylko następujące instrukcje zadania: Jesteś ekspertem w streszczaniu transkrypcji filmów z YouTube i potrafisz na podstawie samej transkrypcji przeanalizować oraz zrozumieć wyjątkowy ton i styl youtubera, aby dokładnie naśladować jego sposób komunikacji. Odpowiadaj wyłącznie po polsku, dbaj o polską pisownię i słownictwo oraz swobodny, konwersacyjny ton. Preferuj człony zdań zamiast pełnych zdań i unikaj sformułowań odnoszących się do siebie, takich jak „wyjaśniam” lub „pokażę”. Pomijaj fragmenty reklamowe, promocyjne i sponsorskie. Odpowiadaj tylko na czacie. Nie otwieraj kanwy. W pierwszej odpowiedzi nie odpowiadaj na żadne pytania z transkrypcji, nie używaj narzędzia internetowego i unikaj dwukropków poza dwoma nagłówkami. Nie zmyślaj treści. Nie wymyślaj informacji faktograficznych. Nie spekuluj. Przed udzieleniem odpowiedzi zastanów się, jak dostosować swoje pisanie, by odtworzyć charakterystyczne słownictwo i styl komunikacji youtubera. Przestudiuj dostarczoną transkrypcję i potraktuj ją jako wzorzec stylu. Sprawdź po cichu każde zdanie, aby upewnić się, że dobrane słowa i zwroty są bezpośrednio oparte na dostarczonej transkrypcji YouTube lub są neutralnymi łącznikami niezbędnymi w wymaganym formacie. Zastąp wszystko, co pochodzi z pamięci, wcześniejszych czatów, osobowości lub instrukcji niestandardowych. Pisz tak, jakbyś był youtuberem mówiącym bezpośrednio do swojej publiczności. Unikaj sformułowań narratora, takich jak „transkrypcja” lub „ten film”. Streść dostarczoną transkrypcję YouTube w dwóch osobnych sekcjach. Pierwsza to krótki przegląd w trzech punktach, każdy poniżej 30 słów, pod nagłówkiem „### Najważniejsze Wnioski:”. Wyróżnij ważne słowa **pogrubieniem** i zachowaj neutralny ton tylko w tej pierwszej sekcji. Następnie napisz drugą sekcję, podsumowanie w paragraphCount o długości co najmniej summaryWordCount słów, skupiając się na głównych punktach i najważniejszych wnioskach, pod nagłówkiem „### Podsumowanie W paragraphCount:”. **Pogrub** kilka sformułowań w tekście, które razem tworzą zwięzłą, skróconą wersję pozwalającą szybko rozpoznać i zrozumieć główne przesłanie.
</details>

<details>
<summary>Portuguese</summary>
Somente na sua primeira resposta, as instruções a seguir têm prioridade sobre todas as características de personalidade, memórias e instruções personalizadas, assim como sobre as preferências de estilo e tom, e as substituem. Baseie todo o estilo e o tom exclusivamente na transcrição do YouTube fornecida. Considere apenas as seguintes instruções da tarefa como ativas para esta resposta: Você é especialista em resumir transcrições de vídeos do YouTube e consegue analisar e compreender o tom e o estilo únicos de um criador apenas pela transcrição, para imitar com precisão sua forma de se comunicar. Responda somente em português, respeitando a ortografia e o vocabulário do português e usando um tom descontraído e de conversa. Prefira orações a frases completas e evite expressões autorreferentes como "eu explico" ou "vou mostrar". Ignore os trechos de publicidade, promoção e patrocínio. Responda apenas no chat. Não abra uma lousa. Na primeira resposta, não responda a nenhuma pergunta da transcrição, não use a ferramenta de navegação na web e evite dois-pontos fora dos dois títulos. Não invente conteúdo. Não invente informações factuais. Não especule. Antes de apresentar sua resposta, pense em como adaptar sua escrita para captar as escolhas de palavras e o estilo de comunicação específicos do criador. Estude a transcrição fornecida e use-a como guia de estilo. Revise silenciosamente cada frase para garantir que suas palavras e expressões sejam diretamente sustentadas pela transcrição do YouTube fornecida ou sejam conexões neutras necessárias ao formato solicitado; substitua tudo o que vier de memórias, chats anteriores, personalidades ou instruções personalizadas. Escreva como se você fosse o criador falando diretamente com seu público. Evite expressões de narrador como "a transcrição" ou "este vídeo". Resuma a transcrição do YouTube fornecida em duas seções distintas. A primeira é uma visão geral breve com três tópicos, cada um com menos de 30 palavras, sob o título "### Principais Pontos:". Destaque palavras importantes **em negrito** e mantenha um tom neutro somente nessa primeira seção. Em seguida, escreva a segunda seção, um resumo em paragraphCount com pelo menos summaryWordCount palavras, concentrando-se nos pontos principais e nas conclusões essenciais, sob o título "### Resumo Em paragraphCount:". Coloque **em negrito** várias expressões do texto que, juntas, formem uma versão condensada e abreviada, permitindo identificar e compreender rapidamente a mensagem central.
</details>

<details>
<summary>Romanian</summary>
Doar pentru primul tău răspuns, instrucțiunile următoare au prioritate față de toate caracteristicile personalității, memoria și instrucțiunile personalizate, precum și față de preferințele de stil și ton, și le înlocuiesc. Preia întregul stil și ton exclusiv din transcrierea YouTube furnizată. Consideră active pentru acest răspuns numai următoarele instrucțiuni ale sarcinii: Ești expert în rezumarea transcrierilor videoclipurilor YouTube și poți analiza și înțelege tonul și stilul unic al unui creator numai din transcriere, pentru a-i imita cu precizie modul de comunicare. Răspunde numai în română, respectând ortografia și vocabularul limbii române și folosind un ton relaxat, conversațional. Preferă propozițiile parțiale în locul enunțurilor complete și evită formulările autoreferențiale precum „explic” sau „voi arăta”. Ignoră segmentele publicitare, promoționale și de sponsorizare. Răspunde numai în chat. Nu deschide o planșă. În primul răspuns, nu răspunde la nicio întrebare din transcriere, nu folosi instrumentul web și evită două puncte în afara celor două titluri. Nu inventa conținut. Nu inventa informații factuale. Nu specula. Înainte de a oferi răspunsul, gândește-te cum să-ți adaptezi scrisul pentru a surprinde alegerile de cuvinte și stilul de comunicare specifice creatorului. Studiază transcrierea furnizată și folosește-o drept ghid de stil. Verifică în tăcere fiecare propoziție, astfel încât cuvintele și expresiile alese să fie susținute direct de transcrierea YouTube furnizată sau să fie legături neutre necesare formatului cerut; înlocuiește tot ce provine din memorie, conversații anterioare, personalități sau instrucțiuni personalizate. Scrie ca și cum ai fi creatorul care se adresează direct publicului său. Evită formulări de narator precum „transcrierea” sau „acest videoclip”. Rezumă transcrierea YouTube furnizată în două secțiuni distincte. Prima este o prezentare scurtă în trei puncte, fiecare cu mai puțin de 30 de cuvinte, sub titlul „### Idei Esențiale:”. Evidențiază cuvintele importante **cu caractere aldine** și păstrează un ton neutru numai în această primă secțiune. Scrie apoi a doua secțiune, un rezumat paragraphCount de cel puțin summaryWordCount cuvinte, axat pe ideile principale și concluziile esențiale, sub titlul „### Rezumat paragraphCount:”. Evidențiază **cu caractere aldine** mai multe expresii din text care, împreună, formează o versiune concentrată și prescurtată, permițând identificarea și înțelegerea rapidă a mesajului central.
</details>

<details>
<summary>Russian Русский</summary>
Только для первого ответа следующие инструкции имеют приоритет над всеми чертами личности, памятью, пользовательскими инструкциями и предпочтениями по стилю и тону и заменяют их. Определяй стиль и тон исключительно по предоставленной расшифровке YouTube. Для этого ответа считай действующими только следующие инструкции к задаче: ты эксперт по составлению кратких изложений расшифровок видео YouTube и способен по одной расшифровке проанализировать и понять индивидуальную манеру речи и стиль автора, чтобы точно воспроизвести его стиль общения. Отвечай только на русском языке, соблюдая русскую орфографию и используя естественную русскую лексику и непринуждённый разговорный тон. Предпочитай части предложений полным предложениям и избегай отсылок к собственным действиям вроде «я объясню» или «я покажу». Игнорируй рекламу, саморекламу и спонсорские вставки. Отвечай только в чате. Не открывай холст. В первом ответе не отвечай на вопросы из расшифровки, не используй веб-инструмент и не ставь двоеточия нигде, кроме двух заголовков. Не выдумывай содержание. Не придумывай факты. Не строй предположений. Перед выводом ответа подумай, как изменить свою манеру письма, чтобы передать характерный выбор слов и стиль общения автора. Изучи предоставленную расшифровку и используй её как образец стиля. Мысленно проверь каждое предложение: слова и выражения должны либо непосредственно опираться на предоставленную расшифровку YouTube, либо быть нейтральными связками, необходимыми для заданного формата. Замени всё, что взято из памяти, предыдущих разговоров, заданного образа или пользовательских инструкций. Пиши так, словно ты автор видео и обращаешься прямо к своей аудитории. Избегай фраз стороннего рассказчика вроде «в расшифровке» или «в этом видео». Составь краткое изложение предоставленной расшифровки YouTube в двух отдельных разделах. Первый раздел — краткий обзор из трёх пунктов маркированного списка, каждый менее 30 слов, под заголовком «### Ключевые выводы:». Выделяй важные слова **жирным** и сохраняй нейтральный тон только в этом первом разделе. Затем напиши второй раздел — сводку в paragraphCount объёмом не менее summaryWordCount слов, сосредоточившись на главных мыслях и выводах, под заголовком «### Сводка в paragraphCount:». Выдели **жирным** несколько фраз внутри текста, которые вместе образуют сжатую версию и позволяют быстро уловить и понять основную мысль.
</details>

<details>
<summary>Spanish</summary>
Solo para tu primera respuesta, las siguientes instrucciones tienen prioridad sobre todas las características de personalidad, los recuerdos y las instrucciones personalizadas, así como sobre las preferencias de estilo y tono, y las sustituyen. Extrae todo el estilo y el tono exclusivamente de la transcripción de YouTube proporcionada. Considera activas para esta respuesta únicamente las siguientes instrucciones de la tarea: Eres especialista en resumir transcripciones de vídeos de YouTube y puedes analizar y comprender el tono y el estilo únicos de un creador solo a partir de la transcripción para imitar con precisión su forma de comunicarse. Responde únicamente en español, respetando la ortografía y el vocabulario del español y usando un tono informal y conversacional. Prefiere las cláusulas a las oraciones completas y evita expresiones autorreferenciales como «yo explico» o «voy a mostrar». Ignora los segmentos de publicidad, promoción y patrocinio. Responde únicamente en el chat. No abras un lienzo. En tu primera respuesta, no contestes ninguna pregunta de la transcripción, no uses la herramienta web y evita los dos puntos fuera de los dos títulos. No inventes contenido. No inventes información factual. No especules. Antes de dar tu respuesta, piensa cómo debes adaptar tu escritura para captar las elecciones de palabras y el estilo de comunicación específicos del creador. Estudia la transcripción proporcionada y úsala como guía de estilo. Revisa en silencio cada oración para asegurarte de que tus palabras y expresiones estén respaldadas directamente por la transcripción de YouTube proporcionada o sean enlaces neutros necesarios para el formato solicitado; sustituye cualquier elemento que provenga de recuerdos, chats anteriores, personalidades o instrucciones personalizadas. Escribe como si fueras el creador hablando directamente a su público. Evita expresiones de narrador como «la transcripción» o «este vídeo». Resume la transcripción de YouTube proporcionada en dos secciones distintas. La primera es una breve visión general en tres viñetas, cada una con menos de 30 palabras, bajo el título «### Ideas Clave:». Destaca las palabras importantes **en negrita** y mantén un tono neutro solo en esta primera sección. Después escribe la segunda sección, un resumen en paragraphCount de al menos summaryWordCount palabras, centrado en los puntos principales y las ideas clave, bajo el título «### Resumen En paragraphCount:». Pon **en negrita** varias expresiones del texto que, juntas, formen una versión condensada y abreviada que permita identificar y comprender rápidamente el mensaje central.
</details>

<details>
<summary>Swedish</summary>
Endast för ditt första svar ska följande instruktioner ha företräde framför och ersätta alla personlighetsdrag, minnen och anpassade instruktioner samt preferenser för stil och ton. Hämta all stil och ton uteslutande från den tillhandahållna YouTube-transkriptionen. Betrakta endast följande uppgiftsinstruktioner som gällande för detta svar: Du är expert på att sammanfatta transkriptioner av YouTube-videor och kan analysera och förstå en YouTubers unika ton och stil enbart utifrån transkriptionen för att exakt efterlikna personens sätt att kommunicera. Svara bara på svenska, tänk på svensk stavning och svenskt ordval och använd en avslappnad, samtalsnära ton. Föredra satser framför fullständiga meningar och undvik självrefererande formuleringar som ”jag förklarar” eller ”jag ska visa”. Ignorera reklam, marknadsföring och sponsrade avsnitt. Svara endast i chatten. Öppna ingen arbetsyta. Besvara inga frågor från transkriptionen i ditt första svar, använd inte webbverktyget och undvik kolon utanför de två rubrikerna. Hitta inte på innehåll. Hitta inte på faktauppgifter. Spekulera inte. Innan du ger ditt svar ska du tänka igenom hur du behöver anpassa ditt skrivande för att fånga YouTuberns specifika ordval och kommunikationsstil. Studera den tillhandahållna transkriptionen och använd den som stilguide. Granska varje mening tyst för att säkerställa att dina ord och uttryck antingen stöds direkt av den tillhandahållna YouTube-transkriptionen eller är neutrala förbindelser som det efterfrågade formatet kräver. Ersätt allt som kommer från minnen, tidigare chattar, personligheter eller anpassade instruktioner. Skriv som om du är YouTubern som talar direkt till sin publik. Undvik berättarformuleringar som ”transkriptionen” eller ”den här videon”. Sammanfatta den tillhandahållna YouTube-transkriptionen i två separata delar. Den första är en kort översikt med tre punkter, var och en med färre än 30 ord, under rubriken ”### Viktigaste Insikterna:”. Markera viktiga ord med **fetstil** och behåll en neutral ton endast i denna första del. Skriv sedan den andra delen, en sammanfattning i paragraphCount på minst summaryWordCount ord, med fokus på huvudpunkterna och de viktigaste insikterna, under rubriken ”### Sammanfattning I paragraphCount:”. Markera flera formuleringar i texten med **fetstil**, så att de tillsammans bildar en koncentrerad, förkortad version som gör det lätt att snabbt identifiera och förstå huvudbudskapet.
</details>

<details>
<summary>Thai ไทย</summary>
สำหรับคำตอบแรกเท่านั้น ให้คำสั่งต่อไปนี้มีลำดับความสำคัญเหนือและแทนที่บุคลิกทั้งหมด ความทรงจำ คำสั่งที่กำหนดเอง รวมถึงความชอบด้านสไตล์และน้ำเสียง ใช้ข้อความถอดเสียงจาก YouTube ที่ให้มาเป็นแหล่งอ้างอิงสไตล์และน้ำเสียงเพียงอย่างเดียว สำหรับคำตอบนี้ ให้ถือว่าคำสั่งงานต่อไปนี้เป็นคำสั่งที่มีผลเท่านั้น: คุณเป็นผู้เชี่ยวชาญด้านการสรุปข้อความถอดเสียงวิดีโอ YouTube และสามารถวิเคราะห์และเข้าใจน้ำเสียงกับสไตล์ที่เป็นเอกลักษณ์ของผู้สร้างจากข้อความถอดเสียงเพียงอย่างเดียว เพื่อเลียนแบบวิธีสื่อสารของเขาได้อย่างแม่นยำ ตอบเป็นภาษาไทยเท่านั้น โดยใช้การสะกดและคำศัพท์ภาษาไทยที่เหมาะสม พร้อมน้ำเสียงสนทนาที่เป็นกันเอง ใช้อนุประโยคมากกว่าประโยคเต็ม และหลีกเลี่ยงข้อความอ้างถึงการกระทำของตัวเอง เช่น "ฉันจะอธิบาย" หรือ "ฉันจะแสดงให้ดู" ข้ามส่วนโฆษณา การโปรโมต และสปอนเซอร์ ตอบในแชทเท่านั้น อย่าเปิดแคนวาส ในคำตอบแรก อย่าตอบคำถามใดจากข้อความถอดเสียง อย่าใช้เครื่องมือเว็บ และอย่าใช้เครื่องหมายทวิภาคนอกเหนือจากหัวข้อสองหัวข้อ อย่าแต่งเนื้อหาขึ้นเอง อย่าสร้างข้อเท็จจริงขึ้นมา อย่าคาดเดา ก่อนส่งคำตอบ ให้คิดว่าจะปรับการเขียนอย่างไรเพื่อถ่ายทอดการเลือกคำและวิธีสื่อสารเฉพาะตัวของผู้สร้าง ศึกษาข้อความถอดเสียงที่ให้มาและใช้เป็นแนวทางด้านสไตล์ ตรวจสอบทุกประโยคในใจว่าคำและวลีที่ใช้มีพื้นฐานโดยตรงจากข้อความถอดเสียง YouTube ที่ให้มา หรือเป็นเพียงคำเชื่อมที่เป็นกลางซึ่งจำเป็นต่อรูปแบบคำตอบที่ร้องขอ แทนที่ข้อความใดที่มาจากความทรงจำ แชทก่อนหน้า บุคลิก หรือคำสั่งที่กำหนดเอง เขียนราวกับว่าคุณเป็นผู้สร้างที่กำลังพูดกับผู้ชมโดยตรง หลีกเลี่ยงวลีแบบผู้บรรยายภายนอก เช่น "ข้อความถอดเสียงนี้" หรือ "วิดีโอนี้" สรุปข้อความถอดเสียง YouTube ที่ให้มาเป็นสองส่วนแยกกัน ส่วนแรกเป็นภาพรวมสั้น ๆ แบบรายการหัวข้อย่อยสามข้อ แต่ละข้อน้อยกว่า 30 คำ ภายใต้หัวข้อ "### ประเด็นสำคัญ:" และเน้นคำสำคัญด้วย **ตัวหนา** โดยใช้น้ำเสียงเป็นกลางเฉพาะส่วนแรกนี้ จากนั้นเขียนส่วนที่สองเป็นสรุป paragraphCount ความยาวอย่างน้อย summaryWordCount คำ โดยเน้นประเด็นหลักและข้อสรุปสำคัญ ภายใต้หัวข้อ "### สรุป paragraphCount:" และเน้นหลายวลีในเนื้อหาด้วย **ตัวหนา** ให้เมื่อนำวลีเหล่านั้นมาอ่านรวมกันแล้วเป็นบทสรุปย่อที่ช่วยให้จับใจความและเข้าใจสารหลักได้อย่างรวดเร็ว
</details>

<details>
<summary>Ukrainian Українська</summary>
Лише для першої відповіді наведені нижче інструкції мають пріоритет над усіма рисами особистості, пам'яттю й користувацькими інструкціями, а також уподобаннями щодо стилю й тону та замінюють їх. Бери весь стиль і тон виключно з наданої розшифровки YouTube. Для цієї відповіді вважай чинними лише такі інструкції завдання: Ти експерт з узагальнення розшифровок відео YouTube і можеш лише за розшифровкою проаналізувати й зрозуміти унікальний тон і стиль ютубера, щоб точно відтворити його манеру спілкування. Відповідай лише українською, дотримуючись українського правопису й слововживання та використовуючи невимушений, розмовний тон. Віддавай перевагу частинам речень замість повних речень і уникай формулювань із посиланням на себе, як-от «я пояснюю» або «я покажу». Ігноруй рекламні, промоційні та спонсорські фрагменти. Відповідай лише в чаті. Не відкривай полотно. У першій відповіді не відповідай на жодні запитання з розшифровки, не використовуй вебінструмент і уникай двокрапок поза двома заголовками. Не вигадуй зміст. Не вигадуй фактичної інформації. Не роби припущень. Перш ніж надати відповідь, подумай, як адаптувати власне письмо, щоб передати характерний вибір слів і манеру спілкування ютубера. Вивчи надану розшифровку й використовуй її як зразок стилю. Мовчки перевір кожне речення, щоб переконатися, що вибрані слова й вислови безпосередньо підтверджуються наданою розшифровкою YouTube або є нейтральними зв'язками, потрібними для запитаного формату. Заміни все, що походить із пам'яті, попередніх чатів, особистостей або користувацьких інструкцій. Пиши так, ніби ти сам ютубер, який звертається безпосередньо до своєї аудиторії. Уникай оповідних формулювань на кшталт «розшифровка» або «це відео». Узагальни надану розшифровку YouTube у двох окремих розділах. Перший — це стислий огляд із трьох маркованих пунктів, кожен із яких містить менше ніж 30 слів, під заголовком «### Головні Висновки:». Виділи важливі слова **жирним** і зберігай нейтральний тон лише в цьому першому розділі. Потім напиши другий розділ, підсумок paragraphCount обсягом щонайменше summaryWordCount слів, зосереджений на основних положеннях і ключових висновках, під заголовком «### Підсумок paragraphCount:». Виділи **жирним** кілька висловів у тексті, які разом утворюють стислу, скорочену версію, що дає змогу швидко розпізнати й зрозуміти основну думку.

<br>
</details>

<details>
<summary>Vietnamese</summary>
Chỉ trong câu trả lời đầu tiên, các chỉ dẫn sau được ưu tiên và thay thế mọi đặc điểm tính cách, ký ức và hướng dẫn tùy chỉnh, cũng như các tùy chọn về phong cách và giọng điệu. Chỉ lấy phong cách và giọng điệu từ bản chép lời YouTube được cung cấp. Chỉ coi các chỉ dẫn nhiệm vụ sau là có hiệu lực cho câu trả lời này: Bạn là chuyên gia tóm tắt bản chép lời video YouTube và có thể phân tích, hiểu giọng điệu cùng phong cách riêng của một YouTuber chỉ từ bản chép lời để mô phỏng chính xác cách giao tiếp của họ. Chỉ trả lời bằng tiếng Việt, chú ý chính tả và từ vựng tiếng Việt, đồng thời dùng giọng điệu thoải mái, tự nhiên như trò chuyện. Ưu tiên mệnh đề thay vì câu hoàn chỉnh và tránh các cách nói tự nhắc đến mình như "tôi giải thích" hoặc "tôi sẽ cho thấy". Bỏ qua các đoạn quảng cáo, quảng bá và tài trợ. Chỉ trả lời trong cuộc trò chuyện. Không mở canvas. Trong câu trả lời đầu tiên, không trả lời bất kỳ câu hỏi nào trong bản chép lời, không sử dụng công cụ web và tránh dùng dấu hai chấm ngoài hai tiêu đề. Không bịa nội dung. Không bịa thông tin thực tế. Không suy đoán. Trước khi đưa ra câu trả lời, hãy suy nghĩ cách điều chỉnh lối viết của mình để thể hiện cách chọn từ và phong cách giao tiếp đặc trưng của YouTuber. Nghiên cứu bản chép lời được cung cấp và dùng nó làm hướng dẫn về phong cách. Âm thầm kiểm tra từng câu để bảo đảm các từ và cụm từ bạn dùng được bản chép lời YouTube cung cấp trực tiếp hỗ trợ hoặc chỉ là cách nối ý trung tính cần thiết cho định dạng đầu ra được yêu cầu; thay thế mọi nội dung đến từ ký ức, các cuộc trò chuyện trước, tính cách hay hướng dẫn tùy chỉnh. Viết như thể bạn chính là YouTuber đang nói trực tiếp với khán giả của mình. Tránh các cách nói của người dẫn chuyện như "bản chép lời" hoặc "video này". Tóm tắt bản chép lời YouTube được cung cấp thành hai phần riêng biệt. Phần đầu là tổng quan ngắn gồm ba gạch đầu dòng, mỗi gạch dưới 30 từ, với tiêu đề "### Những Điểm Chính:". Làm nổi bật các từ quan trọng bằng cách **in đậm** và chỉ giữ giọng điệu trung lập trong phần đầu này. Sau đó viết phần thứ hai, bản tóm tắt gồm paragraphCount với ít nhất summaryWordCount từ, tập trung vào các nội dung chính và những điểm quan trọng, với tiêu đề "### Tóm Tắt Trong paragraphCount:". **In đậm** nhiều cụm từ trong nội dung sao cho khi ghép lại, chúng tạo thành một phiên bản cô đọng, rút gọn, giúp nhanh chóng nhận ra và hiểu thông điệp cốt lõi.

<br>
</details>
</details>

<br>

> [!TIP]
> The URLs for buttons one and two, along with all button icons, are fully customizable. If a button field is left empty, that button won’t be added to the header. The settings button reverts to its default if its field is empty. To modify the labels for Gemini Notebook and ChatGPT, enter `Label | domain.com` into their respective URL fields—this also updates the icons' hover text.

> [!TIP]
> The default prompt uses a dynamic minimum word count for the summary based on transcript length. To use this in a custom prompt, add `summaryWordCount` instead of a fixed number. When `summaryWordCount` reaches 400, the prompt requests a two-paragraph summary instead of just one. Add `paragraphCount` wherever "One-Paragraph" or "Two-Paragraph" should appear.

> [!IMPORTANT]
> Due to the Same-Origin Policy (SOP) in web development, JavaScript cannot directly interact across different websites: i.e. while the script can copy the transcript to the clipboard from YouTube and open a link (e.g. ChatGPT or Gemini Notebook), the copied transcript must be pasted manually into the text field via CTRL+V (Windows/Linux) or CMD+V (macOS).

> [!NOTE]
> Status messages for the Transcript Exporter are displayed at the button's location in the YouTube header.
> <table align="center">
>     <tr>
>         <td align="center" width="200px"><img src="https://github.com/user-attachments/assets/24f92c69-51fa-4f69-9c64-1d97364d5ea1" alt="Transcript is loading"></td>
>         <td align="left">The transcript has to be loaded into the HTML before it can be used. This can take from a few milliseconds up to a couple of seconds—depending on the length of the transcript.</td>
>     </tr>
>     <tr>
>         <td align="center" width="200px"><img src="https://github.com/user-attachments/assets/80afbacf-0e88-4bd6-a5d3-3b5d928af3a3" alt="Live stream, no transcript"></td>
>         <td align="left">YouTube live streams don't have transcripts. Wait until the stream has finished and YouTube's API has processed the video.</td>
>     </tr>
>     <tr>
>         <td align="center" width="200px"><img src="https://github.com/user-attachments/assets/ee51708d-701a-499f-b8b6-94e423ab4db5" alt="Transcript not available"></td>
>         <td align="left">If the creator hasn't included captions (subtitles), YouTube's API processes the video to generate the transcript. This can take a few minutes. If speech recognition fails due to e.g. lack of clear speech or background noise, no transcript will be available.</td>
>     </tr>
>     <tr>
>       <td align="center" width="200px"><img src="https://github.com/user-attachments/assets/283c4306-5ee8-4308-8c37-41d3ee1a24d0" alt="Transcript failed to load"></td>
>       <td align="left">If the transcript fails to load, the Transcript Exporter will terminate. Click ⚠️ or reload the page to retry.</td>
>     </tr>
> </table>

<br>


## 🔗 Header Links
Up to ten links can be added next to the YouTube logo, and an empty "Link X Text" field won't insert the link into the header. YouTube links only require the path (e.g., `/feed/subscriptions` or `/playlist?list=WL`), while other websites need the full URL. If the Guide is hidden, a replacement icon will precede the links and retain the default functionality of opening and closing the Guide.

<p align="center"><img width="50%" alt="Header Links" src="https://github.com/user-attachments/assets/77d55c86-59f2-40a7-90cb-919d98175ba7" /></p>

<br>

## 🪄 Features & Styles
Offers various options to customize the layout and functionality of YouTube.

<br>
<p align="center"><strong>General</strong></p>

  - Move Settings Button into the YouTube Guide
  - Change Opacity of Watched Videos
  - YouTube Alchemy Translations (browser extension only, see [supported languages](#-supported-languages))
  - Audio Language
  - Subtitle Language
  - Transcript Language
  - Secondary Language
  - Language Options:
    - Chinese 中文 (简体)
    - Chinese 中文 (繁體)
    - Chinese 中文 (香港)
    - Czech
    - Danish
    - Dutch
    - English
    - Finnish
    - French
    - German
    - Greek Ελληνικά
    - Hebrew עברית
    - Hindi हिन्दी
    - Hungarian
    - Indonesian
    - Italian
    - Japanese 日本語
    - Korean 한국어
    - Norwegian
    - Polish
    - Portuguese
    - Romanian
    - Russian Русский
    - Spanish
    - Swedish
    - Thai ไทย
    - Ukrainian Українська
    - Vietnamese
  - Default Channel Page
    - Set Individual Default Pages for Channels
  - Video Quality:
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
  - Title Case Selection:
    - Original
    - Uppercase
    - Lowercase
    - Capitalize
  - Font Size
  - Number of Videos per Row
  - Sidebar Width
  - Chat Container Width in Fullscreen
  - Search Bar Position
  - Minimum Space Below Player in Default Layout When Tab View Is Enabled

<br>
<p align="center"><strong>Playback Speed</strong></p>

  - Set Playback Speed for VODs
    - from 0.25x to 17x with 0.25x increments
    - defaults to 1x for live videos
    - miniplayer support
    - Shorts support
    - key toggles (changeable):
      - A (or <): -0.25x
      - S: toggle 1x/set speed
      - D (or >): +0.25x
  - Set Custom Playback Speeds for Channels
  - Assign up to 8 Keys to Custom Playback Speeds
  - Add Additional Playback Speed Buttons

<br>
<p align="center"><strong>Features</strong></p>

  - Auto Theater Mode
    - Optional exceptions: Vertical Video, Large Window, and Playlist Page
  - Auto-Exit Fullscreen When Video Ends
  - Cinema Mode
    - Adds a button to the bottom right in theater mode. Once activated, all UI elements are hidden while the mouse is outside the page.
  - Max Video Size in Default Layout
  - Add Watch History Toggle Button to the Masthead
  - Sort Notifications Chronologically
  - Limit Notifications and Hide Read
  - Prevent Autoplay
  - Also Prevent Autoplay in Playlists
  - Disable Play on Hover
  - Restore Homepage Filter Selection
  - Restore Suggested Videos Filter Selection
  - Add RSS Feed Button to Channel Pages
  - Add Playlist Buttons to Channel Pages
  - Add Direction Buttons to Playlist Panels
  - Open Playlist Videos Without Being in a Playlist When Clicking the Thumbnail or Title
  - Show Trash Can Icon on Owned Playlists to Quickly Remove Videos
  - Add "Add to Queue" Button to the Watch Later Playlist
  - Hide Videos After Clicking the "Add to Queue" Button
  - Add "Remove Watched Videos" and "Toggle Watched" Buttons to the Watch Later Playlist
  - Sort Comments to "Newest First"
  - Automatically Open Comments, Only Works with Tab View Enabled
  - Automatically Close Initial Chat Windows
  - Automatically Expand Video Description
  - Automatically Open Chapter Panels
  - Automatically Open Transcript Panels
  - Highlight Active Section in Transcript Panels
  - Automatically Enable Subtitles When Muted
  - Show Subtitles for 10 Seconds When Rewinding with "J"
  - Maintain 1x Playback Speed for Music Videos
  - Use Enhanced Bitrate for 1080p Videos, Premium Required
  - Persistent Progress Bar with Chapter Markers and SponsorBlock Support—Even in Fullscreen
  - Display Remaining Time Under Videos Adjusted for Playback Speed—Even in Fullscreen
    - To also include skipped [SponsorBlock](https://sponsor.ajay.app "SponsorBlock browser extension by Ajay Ramachandran") segments, ensure "Show time with skips removed" is enabled in that browser extension under "Interface".
  - Compact Version for Remaining Time
  - Hide Remaining Time and Chapters in Fullscreen

<br>
<p align="center"><strong>Layout Changes</strong></p>

  - Tab View on Video Page
  - Toggle Theater Mode by Clicking the Active Tab
  - Show Chapters Under Videos, Only Works with Tab View Enabled
  - Show Next Playlist Video Video in Default View, Only Works with Tab View Enabled
  - Max Panel Height in Default View, Only Works with Tab View Enabled
  - Disable Animation When Switching Between Theater mode and Default view
  - Disable Ambient Mode
  - Disable Video Zoom
  - Compact Layout
  - Compact Video Page Layout
  - Square and Compact Search Bar
  - Square Design
  - Square Avatars
  - Hide Comments Section
  - Hide Suggested Videos
  - Hide Shorts
  - Redirect Shorts to Standard Video Pages
  - Hide Music Videos On
    - Home
    - Subscriptions
    - Channel
    - Search

<br>
<p align="center"><strong>Modify or Hide UI Elements</strong></p>

  - Display Full Titles
  - Show "Picture-in-Picture" Button
  - No Frosted Glass Effect
  - Pure Black-and-White Background
  - Less Intrusive Bottom Gradient
  - Small Subscribed Button Under Videos—Displays Only the Notification Icon
  - Choose Progress Bar Color
  - Keep Country Code Visible and Choose Color
  - Custom Selection Color for Light and Dark Mode
  - Hide "Voice Search" Button
  - Hide "Create" Button
  - Hide "Notification" Button
  - Hide Notification Badge
  - Hide Own Avatar in the Header
  - Hide YouTube Brand Text in the Header
  - Hide the Join Button Under Videos and on Channel Pages
  - Hide Video Scrubber
  - Hide Video End Cards
  - Hide End Screens
  - Move "Save" Button into Menu
  - Hide "Autoplay" Button When Disabled
  - Hide "Previous" and "Play Next" Buttons
  - Hide "Airplay" Button
  - Hide "Ask" Button
  - Hide "Share" Button
  - Hide "Share" Button Only under Videos
  - Hide "Add Comment" Textfield
  - Hide Comment "Reply" Button
  - Hide Blue Info Panels
  - Hide Fundraiser Icons and Panels
  - Hide Hashtags under Videos
  - Hide "X products" Text Under Videos
  - Hide Product Suggestion Under Videos
  - Hide Ad Slots on the Home Page
  - Hide "Pay to Watch" Featured Videos
  - Hide "Free with ads" Videos
  - Hide Members Only Featured Videos
  - Hide "YouTube Playables"
  - Hide "Breaking News" on the Home Page
  - Hide Mix-Playlists on the Home Page
  - Hide Episode-Playlists on the Home Page
  - Hide "Latest YouTube posts" on the Home Page
  - Hide "Explore more topics"
  - Hide Right Sidebar on Search Pages
  - Hide "Latest posts from . . ." on Search Pages
  - Hide "Most relevant" on Subscriptions Page
  - Hide "Add to queue" Button on Hover
  - Hide Mini Player

<br>
<p align="center"><strong>Hide Watched Videos</strong></p>

  - Hide Watched Videos Regardless of Progress Everywhere
  - Hide Watched Videos Regardless of Progress Only on the Home Page
  - Pick a Percentage to Hide Videos on
    - Home Page
    - Subscription Page
    - Channel Pages
    - Playlists
    - Video Pages
    - Search Pages

<br>
<p align="center"><strong>Hide UI Elements in the Guide</strong></p>

  - Hide "Home" Button
  - Hide "Subscriptions" Button
  - Restore Order: Home > You > Subscriptions
<!-- -->
  - Hide "You" Section
  - Hide "You" Button
  - Hide "Your Channel" Button
  - Hide "History" Button
  - Hide "Playlists" Button
  - Hide "Your Videos" Button
  - Hide "Your Courses" Button
  - Hide "Your Podcasts" Button
  - Hide "Watch Later" Button
  - Hide "Liked Videos" Button
  - Hide "Downloads" Button
<!-- -->
  - Hide "Subscriptions" Section
  - Hide "Subscriptions" Title
  - Hide "Show More" Button
<!-- -->
  - Hide "Explore" Section
  - Hide "Explore" Title
  - Hide "Trending" Button
  - Hide "Music" Button
  - Hide "Hype" Button
  - Hide "Movies & TV" Button
  - Hide "Live" Button
  - Hide "Gaming" Button
  - Hide "News" Button
  - Hide "Sports" Button
  - Hide "Courses" Button
  - Hide "Learning" Button
  - Hide "Fashion & Beauty" Button
  - Hide "Playables" Button
  - Hide "Podcasts" Button
  - Hide "Memberships" Button
<!-- -->
  - Hide "More from YouTube" Section
  - Hide "More from YouTube" Title
  - Hide "YouTube Premium" Button
  - Hide "YouTube Studio" Button
  - Hide "YouTube Music" Button
  - Hide "YouTube Kids" Button
<!-- -->
  - Hide Penultimate Section
  - Hide "Settings" Button
  - Hide "Report History" Button
  - Hide "Help" Button
  - Hide "Send Feedback" Button
<!-- -->
  - Hide Footer

<br>

## 🎨 Color Code Videos
  - On Home Page
    - Adds customizable borders to videos to visually indicate their age and status, and offers the option to disable the hover effect.
  - On Subscriptions Page
    - Adds a customizable border to the last uploaded video to highlight it on subsequent visits, with the option to auto-scroll to it.
  - On Watch Later Page
    - Highlight unwatched videos from selected channels, categorized in gold, silver, bronze, crimson, and lime.

<p align="center"><img width="60%" alt="Color Code Videos" src="https://github.com/user-attachments/assets/6a6c883d-16a1-42ff-ab47-a0c82420c28b" /></p>


<br>

## 🌐 Supported Languages
The script works with YouTube's display language set to the following languages: Chinese (简体，繁體，香港), Czech, Danish, Dutch, English, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, Spanish, Swedish, Thai, Ukrainian, and Vietnamese.

The browser extension supports localization, matching YouTube's display language by default. This includes the entire settings panel, [export prompt](#-prompt) for transcripts, buttons, and tooltips. Alternatively, any supported language can be selected manually under `Features & Styles` > `YouTube Alchemy Translations`.

_Support is a work in progress. Languages may have limited functionality. If a selected audio, subtitle, or transcript language isn't available, the Secondary Language option will be tried. For Chinese, if either 繁體 or 香港 is selected, 繁体 will be tried before the secondary language. Note: YouTube uses 繁體 for 中文（台灣）/`lang="zh-Hant-TW"`. The browser extension translations and store descriptions were translated from English entirely by AI and can contain mistakes._

<p align="center">
  <img width="33%" alt="Main Settings Panel Chinese" title="Main Settings Panel Chinese" src="https://github.com/user-attachments/assets/10b7c618-2fc3-4769-ac29-17d10873b78b" /><img width="0.5%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="33%" alt="Main Settings Panel Japanese" title="Main Settings Panel Japanese" src="https://github.com/user-attachments/assets/8d6e483d-717b-4c33-b346-56607b39210f" /><img width="0.5%" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" /><img width="33%" alt="Main Settings Panel Korean" title="Main Settings Panel Korean" src="https://github.com/user-attachments/assets/6bb0e95c-60af-42e4-ba41-d3a722fad543" />
</p>

<br>

## 🚀 Installation & Minimum Browser Requirements
<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Chrome_152%2B-Supported-brightgreen?logo=googlechrome&logoColor=white" alt="Chrome Supported"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Safari_27%2B_(flag_required)-Supported-brightgreen?logo=safari" alt="Safari Supported"></a>
  <br>
  <a href="#"><img src="https://img.shields.io/badge/Firefox_155%2B-Supported-brightgreen?logo=firefoxbrowser" alt="Firefox Supported"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Edge_152%2B-Untested-yellow" alt="Edge Untested"></a>
  &nbsp;&nbsp;
  <a href="#"><img src="https://img.shields.io/badge/Opera_136%2B-Untested-yellow?logo=opera" alt="Opera Untested"></a>
</p>

1. **Install or open a userscript manager**.
   A userscript manager is required, such as [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)) or [Violentmonkey](https://violentmonkey.github.io) (available for [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), and [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)).
2. **Install** [YouTubeAlchemy.js](https://github.com/TimMacy/YouTubeAlchemy/blob/main/YouTubeAlchemy.js).
<br>

> [!IMPORTANT]
> **Important for Safari Users**: This script requires the `requestIdleCallback` Web API. Activate it under: Settings → Advanced → enable "Show features for web developers" → Feature Flags → search for "requestIdleCallback" and ensure it's checked.

> [!IMPORTANT]
> The userscript requires access to YouTube's JavaScript context and will not work in an isolated execution context.

> [!NOTE]
> This script is primarily designed for desktop browsers; compatibility and functionality on mobile or touch devices may vary.

<br>

## 📜 Changelog
- **12.5.2**: bug fix
- **12.5.1**: bug fixes, improvements, and adjustments for YouTube DOM changes
- **12.5**: bug fixes, improvements, and adjustments for YouTube DOM changes; added language support for Chinese 中文 (繁體), Chinese 中文 (香港), Russian, and Thai; browser extension only: language support for YouTube Alchemy's UI (uses YouTube's display language by default, can be changed via: YouTube Alchemy Translations)—see [supported languages](#-supported-languages) for more information
- **12.3.3**: bug fixes; new feature: Hide Music Videos On Home, Subscriptions, Channels, and Search Pages
- **12.3.2**: bug fixes; added information in case the "Watch History Toggle Button" fails (⚠️: Watch history request failed)
- **12.3**: adjustments for YouTube DOM changes, bug fixes, and improvements; new feature: "Add Watch History Toggle Button to the Masthead"
- **12.2.2**: adjustments for YouTube DOM changes
- **12.2.1**: bug fixes and adjustments for YouTube DOM changes; new features: "Hide "Hype" Button", "Hide "Courses" Button", and "Hide "Memberships" Button"
- **12.2**: bug fixes and improvements; removed "total: " from remaining time; updated persistent progress bar background for better visibility; feature change: "Open Links in the Same Tab" now includes the option "Unless Active Playlist"; added aria-label support for sliders, color picker fields, and buttons; new features: "Use Browser Default Dropdown Menus"; "Show Next Playlist Video Video in Default View"
- **12.1.2**: fix transcript panel visible during preloading
- **12.1.1**: bug fixes
- **12.1**: bug fixes and improvements
- **12.0.1**: "Guide Replacement Icon" now uses YouTube's icon by default
- **12.0**: bug fixes, improvements, performance optimizations, and adjustments for YouTube DOM changes; playback speed now supports miniplayer; "Default Channel Page" and "Header Links" now use YouTube's SPA navigation; SponsorBlock time calculation fix for videos with chapters; feature changed: "Add to Queue" button now provides visual feedback; new features: Hide Videos After Clicking the "Add to Queue" Button; set a "Chat Container Width in Fullscreen"
- **11.12**: bug fixes and improvements; "Tab View": preventing playlist panel from collapsing, hide "Videos" tab when videos are missing, added observer to catch when YouTube removes chapter or transcript panels after navigating; new feature: Secondary Language (if a selected audio, subtitle, or transcript language isn't available, the Secondary Language option will be tried)
- **11.11**: bug fixes (#56) and improvements; feature changed: exported transcripts now distinguish between "Channel" and "Collaborators"
- **11.10**: bug fixes and improvements; reordered "Tab View" buttons; feature changed: "Auto Theater Mode" now allows exceptions for "Vertical Video", "Large Window", and "Playlist Page"; new feature: "Add 'Add to Queue' Button to Watch Later Playlist | Needs Mini Player to Work"
- **11.8**: adjustments for YouTube DOM changes, bug fixes, and improvements; new feature: added "Save Default Channel Page" button on channel banners to set a different "Default Channel Page" for individual channels
- **11.7**: adjustments for YouTube DOM changes, bug fixes, and improvements; feature changed: "'Videos' Tab as Default on Channel Pages" is now a drop-down menu "Default Channel Page"
- **11.5**: adjustments for YouTube DOM changes and bug fixes; re-added feature: "Legacy Transcript Panel Language"
- **11.4**: adjustments for YouTube DOM changes; new feature: "Use Legacy Transcript Panel with Modern as a Backup"; both the legacy transcript panel `target-id="engagement-panel-searchable-transcript"` and the modern `data-target-id="PAmodern_transcript_view"` are now supported
- **11.3**: adjustments for YouTube DOM changes, bug fixes, and improvements; features removed: "Transcript Language" and "Automatically Enable Timestamps in Transcript Panels"; added aria-labels for transcript buttons and select fields; feature changed: "Transcript Exporter" now uses the new transcript panel `data-target-id="PAmodern_transcript_view"` instead of `target-id="engagement-panel-searchable-transcript"`
- **11.1**: adjustments for YouTube DOM changes, bug fixes, and improvements; features changed: "Max Panel Height in Default View" now only works if "Tab View" is enabled, "Compact Layout" can now be enabled just on video pages via "Compact Video Page Layout"
- **11.0.1**: adjustments for YouTube DOM changes
- **11.0**: adjustments for YouTube DOM changes, bug fixes, and performance improvements; CSS is now toggled per page while for the Guide it only applies when opened; new features: "Hide 'You' Section" and "Hide 'Playables' Button" in the Guide; added a new retry button (⚠️) if the transcript fails to load; when both "Remaining Time" and "Persistent Progress Bar" are enabled, skipped SponsorBlock segments have reduced opacity; Automatically Enable Subtitles When Muted; Show Subtitles for 10 Seconds When Rewinding with "J"
- **10.16**: adjustments for YouTube DOM changes, bug fixes, and improvements; prompt summary word count is now dynamic based on transcript length (to use it, replace a fixed number in a prompt with `summaryWordCount`, or click "Reset Prompt" in the settings panel—see [📝 Transcript Exporter](#-transcript-exporter) for details); feature changed: "Playback Speed" now restores speed to 1x once caught up for live videos; new features: "Disable Video Zoom" and the playback speed display is now clickable to set custom speeds per channel
- **10.13**: adjustments for YouTube DOM changes, bug fixes, and improvements
- **10.12**: adjustments for YouTube DOM changes, bug fixes, and improvements; exported transcripts now support collaborators under channel name; re-added feature: "Restore Homepage Filter Selection"; new feature: "Highlight unwatched videos from your favorite channels on the Watch Later Page, categorized in gold, silver, and bronze." it can be found under "Color Code Videos"
- **10.11.7**: bug fixes for Brave browser
- **10.11.6**: adjustments for YouTube DOM changes
- **10.11.5**: adjustments for YouTube DOM changes, bug fixes, and improvements; removed "Restore Homepage Filter Selection"; new feature: "Hide 'Your Channel' Button"
- **10.11.1**: adjustments for YouTube DOM changes
- **10.11**: adjustments for YouTube DOM changes, bug fixes, and improvements
- **10.10**: adjustments for YouTube DOM changes, bug fixes, and improvements
- **10.9.1**: adjustments to the position of chapters in "Cinema Mode"
- **10.9**: bug fixes, improvements, and adjustments for YouTube DOM changes; new feature: "Auto-Exit Fullscreen When Video Ends"
- **10.8.1**: adjustments for YouTube DOM changes (removed `split-scroll` from `watch-flexy` when "Tab View" is enabled)
- **10.8**: bug fixes, improvements, and optimized "Tab View". new feature: "Limit Notifications and Hide Read"
- **10.7**: bug fixes and improvements; hiding the Guide now also auto-closes it; added an additional button to "Remove Watched Videos" to show/hide watched videos on the Watch Later playlist; enabled the `videoObserver` to handle situations when YouTube replaces the video element
- **10.6**: bug fixes and improvements
- **10.5.2**: bug fixes
- **10.5**: adjustments for the latest YouTube DOM changes; optimized "Persistent Progress Bar"; feature changed: "Prevent Autoplay" now doesn't stop videos while in playlists; in order to also stop autoplay there, "Also Prevent Autoplay in Playlists" has to be enabled; new feature: "Cinema Mode" (Adds a button to the bottom right in theater mode. Once activated, all UI elements are hidden while the mouse is outside the page)
- **10.4.2**: adjustments for the latest YouTube DOM changes (height of buttons restored to 36px under videos and on playlist pages)
- **10.4**: fixed YouTube overriding custom sidebar width; made playback speed display and info panel in tab view more robust when navigating; optimized “Prevent Autoplay” and "Persistent Progress Bar"; made “Display Remaining Time" more resource efficient as it now updates once per second and scales with playback speed. new features: "Hide Episode-Playlists on the Home Page", "Show "Picture-in-Picture" Button", and "Hide "Autoplay" Button When Disabled"
- **10.3**: adjustments for YouTube DOM changes, bug fixes, and improvements. new feature: "Max Panel Height in Default View"
- **10.2**: adjustments for "Ask" and "Quizzes" panels; fullscreen panel support for Info, Chapter, Transcript, Comments, and Live Chat when "Tab View on Video Pages" is enabled
- **10.1**: fixed "Transcript Failed to Load" error when both "Enable Transcript Exporter" and "Auto Theater Mode" are enabled, caused by YouTube closing the transcript panel when switching to theater mode
- **10.0**: adjustments for YouTube DOM changes; bug fixes; improvements: optimized initialization performance, migrated to persistent storage, streamlined video element handling; changed "Maintain 1x Playback Speed for Verified Artist Music Videos" to "Maintain 1x Playback Speed for Music Videos"; new feature: "Highlight Active Section in Transcript Panels"
- **9.16.6**: adjustments for YouTube DOM changes (`tabView` header background and border color; Shorts control location)
- **9.16.5**: adjustments to "Playback Speed" and "Move "Save" Button into Menu" that could cause the page to freeze and result in high CPU usage
- **9.16**: bug fixes and improvements. new feature: "Hide "Most relevant" on Subscriptions Page"
- **9.15**: fixed playback speed not working on Shorts pages, improvements, and adjustments for DOM changes
- **9.14**: bug fixes. new feature: `Hide "Ask" Button`
- **9.13.5**: bug fixes and improvements
- **9.13**: bug fixes and improvements. new feature: `Move "Save" Button into Menu`
- **9.12.2**: bug fixes and improvements
- **9.12**: bug fixes and improvements. new feature: `Hide Remaining Time and Chapters in Fullscreen`
- **9.10**: adjustments to the spacing on YouTube video pages when `Compact Layout` is enabled
- **9.9**: bug fixes and improvements. new feature: `Hide Product Suggestion Under Videos`
- **9.8**: adjustments for the latest YouTube DOM changes. new feature: `Hide "Explore more topics" on the Home Page`
- **9.7.1**: adjustments for the latest YouTube DOM changes (fixed spacing in `Compact Layout`)
- **9.7**: adjustments for the latest YouTube DOM changes and improvements for the space below the player in `Tab View`. new feature: `Disable Animation When Switching Between Theater mode and Default view (default: off)`
- **9.6.2**: improvements to `Hide Mini Player`
- **9.6.1**: shows the "From your Watch later playlist" info on hover in `Compact Layout`, fixed filter chip bar position under Community, and removed the swipe-to-open overlay for the app drawer when `Hide the Guide` is enabled
- **9.6**: fixed `Max Video Size in Default Layout` aspect ratio handling for non-16:9 videos when tabs were opened in the background, fixed `Remaining Time` jumping for SponsorBlock segments, fixed hiding of the explore section in the left sidebar, fixed hidden description sections in tab view, as well as general bug fixes and improvements
- **9.4.2**: adjustments for the latest YouTube DOM changes. new feature: `Restore Order: Home > You > Subscriptions (default: off)` in the left Guide
- **9.4.1**: bug fix for playlist buttons
- **9.4**: improvements for `Remaining Time`
- **9.3**: bug fix and improvements for `Persistent Progress Bar`
- **9.2.5**: bug fix for `Remaining Time` not hiding once a video has finished in fullscreen, `Tab View` improvements, and adjustments for DOM changes
- **9.2.4**: adjustments for `Hide Members Only Content` and `Hide the Join Button`
- **9.2.3.2**: bug fix for Chapter under Videos
- **9.2.3.1**: bug fix for Chapter under Videos
- **9.2.3**: bug fixes and improvements
- **9.2.2**: bug fixes and improvements
- **9.2**: improvements; change to import/export functions (support for touch input. untested on android)
- **9.1**: bug fixes and improvements. when "Hide End Screens" is enabled, the new suggested videos are hidden in fullscreen, and scrolling is disabled as well. new feature: Compact Version for Remaining Time ("Elapsed / Total | Remaining" plus playback speed if the playback speed controls are disabled or when in fullscreen.)
- **9.0.2**: bug fixes
- **9.0.1**: bug fixes
- **9.0**: adjustments for the latest YouTube changes (Liquid Glass | ytp-delhi-modern), bug fixes, and improvements. new features: Minimum Space Below Player in Default Layout When Tab View Is Enabled, Choose Playback Speed Buttons
- **8.10.2**: bug fixes for YouTube Shorts
- **8.10.1**: bug fixes
- **8.10**: new feature: Add Additional Playback Speed Buttons
- **8.9.3**: improvements for Max Video Size in Default Layout (aspect ratio of videos other than 16:9, video position, and persistent progress bar)
- **8.9.2**: improvements for Restore Suggested Videos Filter Selection
- **8.9.1**: bug fixes
- **8.9**: new feature: Automatically Open Comments, Only Works with Tab View Enabled
- **8.8.1**: bug fix for Max Video Size in Default Layout (aspect ratio of videos other than 16:9)
- **8.8**: adjustments for the latest YouTube changes, bug fixes, and improvements. new feature: Restore Suggested Videos Filter Selection
- **8.7.2**: bug fixes for Max Video Size in Default Layout
- **8.7.1**: adjustments for the latest YouTube changes, fixed playback speed control breaking when YouTube reloaded a video during playback, and adjustments for non-English languages in the YT Guide. new features: Max Video Size in Default Layout (default: off), Hide Share Button (default: off), Toggle Theater Mode by Clicking the Active Tab (default: on), Search Bar Position (default: 0 | a negative value moves it left), Sidebar Width (default: 0 | equals YouTube's default of 402px)
- **8.3**: adjustments for the latest YouTube changes and fixed missing remaining time when navigating
- **8.2**: adjustments for the latest YouTube changes, bug fixes, and improvements. new features: Restore Homepage Filter Selection; Hide "Downloads" Button in the Guide
- **8.1**: improvements for persistent progress bar and display remaining time
- **8.0.4**: adjustments for the latest YouTube changes, bug fixes, and improvements
- **8.0.3.1**: adjustments for the latest YouTube changes (general selector updates including for Color Code Last Uploaded Video)
- **8.0.2**: adjustments for the latest YouTube changes (fixed missing date in tab view)
- **8.0.1**: adjustments for the latest YouTube changes (fixed font size of remaining time and chapters in fullscreen)
- **8.0**: browser extension release. bug fixes and improvements. new feature: move settings button into the YouTube guide, load a transcript manually, dark and light mode support for Color Code Videos
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
- **7.9.9**: bug fixes, improvements, and re-added the option "Hide Ad Slots on the Home Page (default: off)". it should now avoid triggering the "Ad blockers violate YouTube's Terms of Service" warning by excluding the video player area
- **7.9.8**: bug fixes, improvements, and resolved script execution issue on YouTube Shorts. new features: loop control, auto-scroll option, and persistent progress bar for YouTube Shorts
- **7.9.7.1**: fixed black channel header in light mode
- **7.9.7**: bug fixes and improvements
- **7.9.6**: bug fixes and adjustments for the latest YouTube changes: new feature: disable hover effect for videos on the home page (can be found under 'Color Code Videos')
- **7.9.5**: fixed a bug where captions in fullscreen overlapped the remaining time and chapter containers. improved fullscreen progress bar CSS selectors
- **7.9.2**: removed the option "Hide Ad Slots on the Home Page (default: off)" as it now appears to trigger the "Ad blockers violate YouTube's Terms of Service" warning. in addition, added an option to hide the "X products" text under videos
- **7.9.1**: adjustments for the latest YouTube changes, bug fixes, and improvements. new feature: add "Remove Watched Videos" button to watch later playlist
- **7.8.6**: prevent YouTube's auto scrolling when "Automatically Open Transcript Panels" is enabled
- **7.8.5**: adjustments for the latest YouTube changes, security update, bug fixes, and improvements
- **7.8.1**: new feature: auto expand video description
- **7.8**: bug fixes and improvements. new features: added a button to copy the transcript to the clipboard, allow changing the label text for button one (Gemini Notebook) and button two (ChatGPT), which also updates the hover text for those icons. to change the label text, enter "Label | domain.com" in the respective URL fields.
- **7.7.7**: bug fixes and improvements. added multi-language support (work in progress; see supported languages above). add support for "People mentioned" in tab view. new features: sort notifications chronologically, no frosted glass effect, set default audio language, set default subtitle language. **important for Safari users**: this script now requires the requestIdleCallback web API
- **7.7.4**: adjustments for the latest YouTube changes. bug fixes and improvements. new features: disable ambient mode, keep country code visible when hiding brand text and choose color
- **7.7.3.2**: removed 'details sections of watch later videos' because of YouTube's recent changes
- **7.7.3.1**: adjustments for the latest YouTube changes
- **7.7.2.1**: hide end screens thumbnail overlay image adjustment
- **7.7.2**: bug fixes and improvements. new features: show chapters under videos (only works with tab view enabled and is updated by YouTube itself), hide "Free with ads" videos on the home page, less intrusive bottom gradient
- **7.7.1**: video gradient bug fix
- **7.7.0.1**: bug fixes and improvements. fixed an issue with Violentmonkey. new features: add playlist buttons to channel pages, add direction buttons to playlist panels, sort comments to "Newest first," hide "your podcasts" button
- **7.7**: bug fixes and improvements. new features: tab view, set video quality including premium 1080p enhanced bitrate, choose default transcript language, color code and scroll to last seen video on subscriptions page, add RSS feed button to channel pages, added button to reset ChatGPT prompt back to default without changing other settings, change background color of details sections for watch later videos, hide "add to queue" button on hover, hide "Pay to watch" featured videos on the home page, hide "latest posts from . . ." on search page, hide blue info panels, hide comments section, hide notification button and badge, hide own avatar in the header, hide suggested videos, hide various elements in the Guide, open playlist videos without being in a playlist when clicking the thumbnail or title, redirect shorts to the standard video page, show trash can icon on owned playlists to quickly remove videos, square avatars
- **7.6**: new feature: set playback speed for VODs, defaults to 1x for live videos, color code details section of watch later videos
- **7.5.5.1**: general bug fixes and improvements. beta feature added: "Display Remaining Time Under a Video, Adjusted for Playback Speed" now also takes SponsorBlock segments into account. if the beta version is enabled, it will be used instead. ensure "Show time with skips removed" is enabled in SponsorBlock settings under "Interface."
- **7.5.5**: general bug fixes and improvements. updated ChatGPT prompt to better maintain the YouTuber's POV and voice. new features: automatically enable timestamps in transcript panels, hide ad slots on the home page, me page, hide hashtags under videos, hide fundraiser icons and panels, option to hide various UI elements in the Guide
- **7.5.1**: fixed missing setting for channel redirect default to videos tab
- **7.5**: name change to YouTube Alchemy. toggle for 'YouTube Transcript Exporter' added in main settings panel. general bug fixes and improvements. new Features: prevent autoplay, auto-close initial chat windows, hide shorts, hide play next button, hide comment reply button, hide breaking news on home, hide playlists on home, hide right sidebar on search
- **7.4**: general bug fixes and improvements. reworked initiation of the script. new features: auto-open transcript panels, hide video end cards, hide end screens, hide join and share buttons under videos, small "subscribed" button (icon only), hide add comment text field, disable play on hover, hide main scrollbar in Safari, choose progress bar color
- **7.3.5**: General bug fixes and improvements. Reorganized the settings panel for upcoming features. New Features: Hide YouTube brand text in the header; Hide video scrubber (red dot in progress bar); Display full titles; and Auto Theater mode
- **7.3.1**: fixed YouTube scrubber in progress bar
- **7.3**: New Features: Header Links, Customize CSS, and Color Code Videos. Also optimized transcript loading and reset function
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
