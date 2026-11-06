# Day 2 課堂唯讀設定

查核日期：2026-10-13（OpenClaw 2026.10.2）。這是設定片段，不是完整的 OpenClaw 設定檔。不要直接覆蓋原設定或把 Token 放進本資料夾。

## 套用順序

1. 完成 Day 1 安裝，並以 `openclaw --version` 確認是課堂固定版本 2026.10.2；版本不同先交由助教處理，不要自行 `openclaw update`。先執行 `openclaw gateway stop`。在 `openclaw config file` 顯示的位置備份原設定，備份可能含密鑰，留在自己電腦上。
2. 在 Day 2 的 S12 開始時（上午 S10–S11 仍使用 Day 1 workspace），於教材根目錄執行以下複製指令，建立獨立的 Day 2 workspace。該目錄只能放練習 FAQ、選題規劃參考用的選題靈感案例庫、自己建立的 Skill 與無敏感資訊的啟動文件，不得連結其他目錄。S17 學員會手動在這裡的 FAQ 副本末尾加入自己題目的 3–5 條虛構問答；不得放入個資或真實未公開資料。若目錄已有其他資料，先交由助教檢查。

macOS：
```bash
mkdir -p "$HOME/.openclaw/workspace-scu-readonly/sample-data" "$HOME/.openclaw/workspace-scu-readonly/skills/scu-campus-faq-helper"
cp "sample-data/校園 FAQ.md" "$HOME/.openclaw/workspace-scu-readonly/sample-data/"
cp "sample-data/選題靈感案例庫.md" "$HOME/.openclaw/workspace-scu-readonly/sample-data/"
touch "$HOME/.openclaw/workspace-scu-readonly/skills/scu-campus-faq-helper/SKILL.md"
open -e "$HOME/.openclaw/workspace-scu-readonly/skills/scu-campus-faq-helper/SKILL.md"
openclaw config set agents.defaults.workspace "$HOME/.openclaw/workspace-scu-readonly"
```

Windows PowerShell：
```powershell
$scuWorkspace = Join-Path $HOME '.openclaw/workspace-scu-readonly'
New-Item -ItemType Directory -Force "$scuWorkspace/sample-data", "$scuWorkspace/skills/scu-campus-faq-helper"
Copy-Item 'sample-data/校園 FAQ.md' "$scuWorkspace/sample-data/"
Copy-Item 'sample-data/選題靈感案例庫.md' "$scuWorkspace/sample-data/"
New-Item -ItemType File -Force "$scuWorkspace/skills/scu-campus-faq-helper/SKILL.md"
notepad "$scuWorkspace/skills/scu-campus-faq-helper/SKILL.md"
openclaw config set agents.defaults.workspace "$scuWorkspace"
```

   上面的指令會建立一個空白的 `SKILL.md` 並用文字編輯器打開。照 [本機最小 Skill 範本](../sample-data/本機最小Skill範本.md) 第 0 節，把 Skill 內容貼進去後存檔、關閉編輯器。檔名一定要是 `SKILL.md`（全大寫），資料夾名稱要和檔案裡的 `name` 一樣是 `scu-campus-faq-helper`。

3. 將 `read-only.json` 的 `tools` 物件合併到目前設定，取代原先的整個 tools 設定；保留模型、驗證與 channel 設定。本機安裝流程常會寫入 `tools.profile: "full"`，取代後不得殘留。此課堂設定只允許 `read`，關閉提權，限制檔案工具在 workspace 內；deny 使用官方工具群組（`group:runtime`、`group:web`、`group:sessions` 等），新版本新增的同類工具也會一併封鎖。依官方文件，`read` 授權也涵蓋讀取 Skill 全文的 `skills_read`，因此不需另開其他工具。若有個別 agent 的 workspace、tools、工具 profile 或其他覆寫，由助教先檢查有效設定；不可直接視為完成。
4. 執行以下檢查。`config get tools` 的輸出應只有本課堂設定、沒有 `profile`。任何指令不支援、群組名稱被拒、設定無效或工具限制未生效，都先停止實機驗收，由助教處理或標記為模擬演練，不能放寬權限繼續。
```bash
openclaw config get tools --json
openclaw config validate
openclaw security audit
openclaw skills list --eligible
openclaw skills info scu-campus-faq-helper
openclaw gateway start
```
5. 開啟新對話，確認 Skill 可用，執行範本中的測試並保存工具紀錄。必須確認只有 read 可用，寫入、執行、瀏覽及傳訊工具不可用；單看模型口頭拒絕不算權限驗收。

## 邊界與人工核准

- 技術限制是「workspace 內唯讀」，不是單一檔案 ACL。FAQ（含學員自己加入的虛構問答）是唯一業務資料，選題靈感案例庫只供選題規劃參考；Skill 與 OpenClaw 啟動文件仍可能被讀取。不要把 Token、私密文件放進 workspace。
- 這個最小設定使用工具限制，沒有宣稱啟用 OS sandbox。講師若要加 Docker 隔離，須事先安裝並驗證 sandbox，設定 `agents.defaults.sandbox.mode: "all"`、`workspaceAccess: "ro"` 與 `docker.network: "none"`；不能在課堂上把安裝失敗降級成已隔離。
- 「無網路工具」不等於完全離線：雲端模型及 Telegram 的 Gateway 傳輸仍使用網路。只使用虛構資料。
- 禁用 message 工具不會阻止 Gateway 把最終答覆送回原 Telegram 對話。只允許自己的私人測試帳號，停用群組；詳見 Telegram 檢核單。
- 草稿即使核准，也由人手動送出到外部系統。本課堂不開啟 Agent 自動發送、寫檔或報名功能。
- 結束時執行 `openclaw gateway stop`。若要恢復 Day 1 功能，在 Gateway 停止時還原備份、驗證設定，再啟動；不要把私人 Bot 帶入較寬鬆的權限設定。

## 官方依據

- https://docs.openclaw.ai/tools/creating-skills
- https://docs.openclaw.ai/gateway/security/tool-permissions
- https://docs.openclaw.ai/gateway/config-tools/tool-policy
- https://docs.openclaw.ai/tools/skills
- https://docs.openclaw.ai/gateway/sandboxing/workspace-access
- https://docs.openclaw.ai/cli/config
