# 打造你的第一個 AI 助理：兩日實作工作坊

東吳大學 115-1 自主學習微課程「打造你的第一個 AI 助理－從一個想法開始，做出你能拿來展示的 AI 助理」教材。

- 日期：2026/11/7（六）–11/8（日）09:00–16:00
- 地點：
  - 11/7（六）：城中校區第六大樓 6401 大教室
  - 11/8（日）：城中校區菁英講堂
- 課程網站：https://web-ch.scu.edu.tw/ctl/web_page/16701
- 完課條件：全程參與兩天，並填寫教學資源中心的官方前測與後測表單（不是教材內的自我檢核頁）

---

## 🎯 工作坊定位與核心目標

- **工作坊定位**：本工作坊旨在帶領東吳學生熟悉 **OpenClaw Agent、LLM 提示工程、Skills/MCP、資料分析與目標使用者回饋測試** 實戰技術，將校園觀察轉化為可行的最小可行方案（MVP）與專案企劃。
- **選題靈感**：🌿 永續校園 ｜ 🚀 新服務點子 ｜ ⚡ 流程改善 ｜ 🧭 校園資源導讀，或自訂題目
- **核心產出**：每位學員建立 1 個本機唯讀 Skill、1 個個人 Telegram 測試 Bot；每人把自己題目的 3–5 條虛構問答加入 FAQ 副本，完成「Telegram ➔ Skill／資料 ➔ 有來源草稿 ➔ 人工審閱與執行」的可驗證 MVP，並可於課後回顧頁面一鍵匯出**「AI 助理專案企劃書 (.md)」**（含 Skills、Telegram、同儕測試與修正證據）。

---

## 🚀 快速開始

### 1. 下載並啟動教材網頁
教材下載：https://github.com/jlwustudio/openclaw-workshop-scu-2026 ，按綠色「Code」➔「Download ZIP」（請下載整個資料夾）。

直接以瀏覽器開啟 `index.html`，依序進入課前自我檢核、Day 1、Day 2 與課後回顧。所有頁面皆支援離線閱讀。

### 2. 啟動 OpenClaw 實作環境
依 [安裝手冊](openclaw-install-guide.html)（Day 1 S01 會帶著做）逐步操作：先執行 `npm install -g openclaw@2026.10.2 --allow-scripts=@google/genai,esbuild,koffi,protobufjs,openclaw`，再執行 `openclaw onboard`（選 Google、貼上 AI Studio 金鑰），以 `openclaw models set google/gemini-3.5-flash-lite` 指定模型，並以 `openclaw dashboard` 開啟 Dashboard（`http://localhost:18789`）；`openclaw health` 通過才算 Gateway 啟動完成。

頁面頂部有「我的電腦」切換器（預設自動偵測、選擇會記住；「全部」供講師投影用）。新增依系統而異的內容時，在外層容器加 `data-os="mac"`（macOS／Linux）或 `data-os="win"`（Windows）；不要直接標在 `.code` 上。

---

## 📁 教材結構

- `index.html`：活動首頁、選題靈感、學習地圖與課前準備
- `day1-foundations.html`：Day 1 講義（下載與帳號準備、啟動 OpenClaw、任務交代、除錯與整合練習）
- `day1-concepts-slides.html`：Day 1 S02 概念課投影片（LLM ➔ Agent ➔ Agentic AI、教室守則、隨堂 Quiz）
- `day2-applications.html`：Day 2 進階應用（網頁擷取、CSV 使用者回饋量化分析、Skills/MCP、Telegram 閘門與專案展示演練）
- `survey-pre.html`：課前自我檢核（只存在瀏覽器，不取代官方前測）
- `survey-post.html`：課後回顧與**「AI 助理專案企劃書 (Markdown)」**匯出（不取代官方後測）
- `start-workshop.command`、`start-workshop.bat`：舊版啟動檔，課堂已改用手動指令，暫時保留；講義與學員教材不再引用
- `assets/workshop.css`：共用視覺樣式、微動畫、深色模式與 ToC 側邊欄
- `assets/workshop.js`：進度儲存、作業系統切換器（macOS／Linux、Windows）、專案企劃書導出引擎
- `instructor/`：講師專用（試跑檢查清單、備援包參考答案、課前提醒信範本與報到分流、S12–S14 三種上下文示範）；**已列入 `.gitignore`，不放進公開 repo**，講師請在本機另外保存
- `sample-data/`：校園實戰練習資料夾
  - `選題靈感案例庫.md`：永續校園、新服務點子、流程改善、校園資源導讀之 MVP 與 Prompt 範例
  - `使用者測試回饋範例.csv`：10 筆虛構的使用者測試回饋，只用來練習分析方法
  - `成果展示簡報骨架.md`：10 頁成果展示簡報架構
  - `校園 FAQ.md`：東吳選課與活動問答資料庫
  - `校園活動摘要需求.md`：Day 2 上午網頁擷取練習的需求規格
  - `學生社團調查.csv`：社團調查範例
  - `本機最小Skill範本.md`：每位學員建立唯讀 Skill 的規格、提示詞與三個必測案例
  - `Telegram測試Bot檢核單.md`：個人 Bot 的 Token 保護、白名單、草稿與停用驗收

---

## 💡 模型與雲端額度設計

- **模型策略**：2026/11/5 起改用 Google AI Studio 免費方案（個人 Gmail、免綁卡）的 `google/gemini-3.5-flash-lite` 為主模型、`google/gemini-3.1-flash-lite` 為備援，各有每天 500 次、每分鐘 15 次／25 萬 token 的額度，額度以每人自己的專案計算。原用的 Ollama Cloud `gemma4:31b-cloud` 已改為付費方案，不再使用；一般 Flash 版免費每天只有 20 次，不適用。模型名稱固定版本號，不用 `-latest`。
- **實機任務精簡化**：Day 1 有 8 個單元（S01–S08）、Day 2 有 10 個單元（S09–S18）；標示〔實機〕的關鍵雲端任務 Day 1 三次、Day 2 四次；Gemini 免費額度足夠每人實機操作，卡關時才改結對。
- **安全防線**：嚴格實踐 Human-in-the-loop 人工審核防線與《行政院生成式 AI 參考指引》，外送訊息一律先產出草稿，經由人工核准後方可送出。

## 課堂版本與 Day 2 驗收

- OpenClaw 課堂固定版本：**2026.10.2**（2026-10-12 釋出，2026-10-13 依官方 release notes 查核）。講義與安裝手冊的安裝指令都指定此版本，避免學員自動裝到未試跑的新版。2026.10.5 已於 2026-10-18 發布為正式版（GitHub 標為 Latest，2026-10-21 查核），但其發布頁註明 Telegram 端對端測試結果未提供；課堂維持 2026.10.2，升級須另行完整試跑。換版本前須重新完成 Mac／Windows 試跑，並同步修改各講義與安裝手冊中的版本字樣。
- Node.js 檢查基準：24.16+（24.x）或 26.1+（26.x），官方建議 Node 26，依 2026-10-13 官方文件；需升級 Node 時，先升級 Node 再安裝或更新 OpenClaw。其他版本先交由助教確認。這是文件相容性基準，不是已完成跨平台實測的版本組合。
- 學員需下載整份教材（包含 `assets/check-runtime.cjs` 與 `sample-data`）。學員需先用個人 Gmail 在 Google AI Studio 建立專案與 API 金鑰（學校帳號可能無法建立專案）。
- 講師課前記錄 `node --version`、`npm --version`、`openclaw --version` 與 `openclaw models list --provider google` 的 default 模型，完成 Mac／Windows 試跑後才固定課堂版本；勿把示範介面版本當作成功條件。
- Day 2 使用 [課堂唯讀設定](workshop-config/README.md) 與 [可載入 Skill](skills/scu-campus-faq-helper/SKILL.md)，搭配 [Skill 驗收](sample-data/本機最小Skill範本.md) 與 [Telegram 驗收](sample-data/Telegram測試Bot檢核單.md)。
- 課後回顧逐項記錄「實機完成／模擬演練／尚未完成」及證據；只有實機且附證據的自評項目才匯出為勾選，講師仍需核對。模擬演練不能替代安裝、連線與工具權限實測。
- Day 2 唯讀設定的 deny 使用官方工具群組（`group:*`），新版新增的同類工具也會被擋下；套用後以 `openclaw config get tools --json` 確認沒有殘留 `tools.profile: "full"`。講師需在固定版本上實跑一次 `openclaw config validate`。
- 官方依據：[Node.js](https://docs.openclaw.ai/install/node)、[Google AI Studio](https://aistudio.google.com)、[2026.10.2 release notes](https://github.com/openclaw/openclaw/releases/tag/v2026.10.2)、[Tool policy](https://docs.openclaw.ai/gateway/config-tools/tool-policy)。
