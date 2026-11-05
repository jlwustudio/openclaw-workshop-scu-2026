# 打造你的第一個 AI 助理：兩日實作工作坊

東吳大學 115-1 自主學習微課程「打造你的第一個 AI 助理－從一個想法開始，做出你能拿來展示的 AI 助理」教材。

- 日期：2026/11/7（六）–11/8（日）09:00–16:00
- 地點：
  - 11/7（六）：城中校區第六大樓 6401 大教室
  - 11/8（日）：城中校區菁英講堂
- 🌐 **教材網頁（線上閱讀）**：https://jlwustudio.github.io/openclaw-workshop-scu-2026/
- 課程網站：https://web-ch.scu.edu.tw/ctl/web_page/16701
- 完課條件：全程參與兩天，並填寫教學資源中心的官方前測與後測表單（不是教材內的自我檢核頁）

---

## 🎯 工作坊定位與核心目標

- **工作坊定位**：本工作坊旨在帶領東吳學生熟悉 **OpenClaw Agent、LLM 提示工程、Skills/MCP、資料分析與目標使用者回饋測試** 實戰技術，將校園觀察轉化為可行的最小可行方案（MVP）與專案企劃。
- **選題靈感**：🌿 永續校園 ｜ 🚀 新服務點子 ｜ ⚡ 流程改善 ｜ 🧭 校園資源導讀，或自訂題目
- **核心產出**：每位學員建立 1 個本機唯讀 Skill、1 個個人 Telegram 測試 Bot；每人把自己題目的 3–5 條虛構問答加入 FAQ 副本，完成「Telegram ➔ Skill／資料 ➔ 有來源草稿 ➔ 人工審閱與執行」的可驗證 MVP，並可於課後回顧頁面一鍵匯出**「AI 助理專案企劃書 (.md)」**（含 Skills、Telegram、同儕測試與修正證據）。

---

## 🚀 快速開始

### 1. 開啟教材網頁

**線上閱讀**：直接開啟 https://jlwustudio.github.io/openclaw-workshop-scu-2026/ ，依序進入課前自我檢核、Day 1、Day 2 與課後回顧。

| 頁面 | 網址 |
| --- | --- |
| 活動首頁 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/ |
| 安裝手冊 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/openclaw-install-guide.html |
| Day 1 講義 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/day1-foundations.html |
| Day 1 概念課投影片 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/day1-concepts-slides.html |
| Day 2 講義 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/day2-applications.html |
| 課前自我檢核 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/survey-pre.html |
| 課後回顧與企劃書匯出 | https://jlwustudio.github.io/openclaw-workshop-scu-2026/survey-post.html |

**下載整份教材（實作必做）**：實作時 OpenClaw 需要讀取本機的 `sample-data/`、`skills/` 等檔案，所以仍要下載整個資料夾。到 https://github.com/jlwustudio/openclaw-workshop-scu-2026 ，按綠色「Code」➔「Download ZIP」，解壓縮後也可以直接用瀏覽器開啟 `index.html` 離線閱讀。

> 自我檢核與課後回顧的填答只存在你目前使用的瀏覽器。線上版和下載後開啟的本機版是不同網址，紀錄不會互通，請固定用同一個版本填寫。

### 2. 啟動 OpenClaw 實作環境
依 [安裝手冊](openclaw-install-guide.html)（Day 1 S01 會帶著做）逐步操作：先執行 `npm install -g openclaw@2026.10.2 --allow-scripts=@google/genai,esbuild,koffi,protobufjs,openclaw`，再執行 `openclaw onboard`（選 Google、貼上 AI Studio 金鑰），以 `openclaw models set google/gemini-3.5-flash-lite` 指定模型，並以 `openclaw dashboard` 開啟 Dashboard（`http://localhost:18789`）；`openclaw health` 通過才算 Gateway 啟動完成。

頁面頂部有「我的電腦」切換器（預設自動偵測、選擇會記住；「全部」供講師投影用），會依你的作業系統顯示對應的指令與說明。

---

## 📁 教材結構

**網頁講義**
- `index.html`：活動首頁、選題靈感、學習地圖與課前準備
- `openclaw-install-guide.html`：OpenClaw 安裝手冊（macOS／Windows）
- `day1-foundations.html`：Day 1 講義（下載與帳號準備、啟動 OpenClaw、任務交代、除錯與整合練習）
- `day1-concepts-slides.html`：Day 1 S02 概念課投影片（LLM ➔ Agent ➔ Agentic AI、教室守則、隨堂 Quiz）
- `day2-applications.html`：Day 2 進階應用（網頁擷取、CSV 使用者回饋量化分析、Skills/MCP、Telegram 閘門與專案展示演練）
- `survey-pre.html`：課前自我檢核（只存在瀏覽器，不取代官方前測）
- `survey-post.html`：課後回顧與**「AI 助理專案企劃書 (Markdown)」**匯出（不取代官方後測）

**練習資料 `sample-data/`**（全部為虛構資料，只供課堂練習）
- `README.md`：練習資料使用說明
- `選題靈感案例庫.md`：永續校園、新服務點子、流程改善、校園資源導讀之 MVP 與 Prompt 範例
- `校園 FAQ.md`：東吳選課與活動問答資料庫
- `校園活動摘要需求.md`：Day 2 上午網頁擷取練習的需求規格
- `網頁練習網址.txt`：網頁擷取練習可用的公開網址
- `使用者測試回饋範例.csv`：10 筆虛構的使用者測試回饋，只用來練習分析方法
- `學生社團調查.csv`：社團調查範例
- `工作坊宣傳文案庫.md`：宣傳文案改寫練習素材
- `成果展示簡報骨架.md`：10 頁成果展示簡報架構
- `本機最小Skill範本.md`：每位學員建立唯讀 Skill 的規格、提示詞與三個必測案例
- `Telegram測試Bot檢核單.md`：個人 Bot 的 Token 保護、白名單、草稿與停用驗收
- `雲端額度備援包.md`：模型額度用盡或網路不穩時的備援練習內容
- `待整理/`：檔案整理練習用的雜亂檔案

**Day 2 設定與 Skill**
- `skills/scu-campus-faq-helper/SKILL.md`：課堂用的唯讀校園 FAQ Skill
- `workshop-config/`：Day 2 課堂唯讀設定片段與套用說明

**共用資源 `assets/`**
- `workshop.css`：共用視覺樣式、深色模式與目錄側邊欄
- `workshop.js`：進度儲存、作業系統切換器（macOS／Linux、Windows）、專案企劃書匯出
- `assessment.js`：課後回顧的驗收檢核項目
- `check-runtime.cjs`：檢查 Node.js 版本的小工具
- 圖片：`favicon.svg`、`onboard-provider-google.png`、`windows-firewall-nodejs.png`

**其他**
- `start-workshop.command`、`start-workshop.bat`：舊版啟動檔，課堂已改用手動指令，暫時保留

---

## 💡 模型與雲端額度設計

- **模型策略**：2026/11/5 起改用 Google AI Studio 免費方案（個人 Gmail、免綁卡）的 `google/gemini-3.5-flash-lite` 為主模型、`google/gemini-3.1-flash-lite` 為備援，各有每天 500 次、每分鐘 15 次／25 萬 token 的額度，額度以每人自己的專案計算。原用的 Ollama Cloud `gemma4:31b-cloud` 已改為付費方案，不再使用；一般 Flash 版免費每天只有 20 次，不適用。模型名稱固定版本號，不用 `-latest`。
- **實機任務精簡化**：Day 1 有 8 個單元（S01–S08）、Day 2 有 10 個單元（S09–S18）；標示〔實機〕的關鍵雲端任務 Day 1 三次、Day 2 四次；Gemini 免費額度足夠每人實機操作，卡關時才改結對。
- **安全防線**：嚴格實踐 Human-in-the-loop 人工審核防線與《行政院生成式 AI 參考指引》，外送訊息一律先產出草稿，經由人工核准後方可送出。
