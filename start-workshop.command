#!/bin/bash
set -u
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || exit 1
# 課堂固定版本：2026-10-13 依 v2026.10.2 查核；改版本前須重新完成 Mac／Windows 試跑。
OPENCLAW_VERSION='2026.10.2'
has_pinned_openclaw() { openclaw --version 2>/dev/null | grep -Eq "(^|[^0-9.])${OPENCLAW_VERSION//./\\.}([^0-9.-]|$)"; }
fail() { echo "[失敗] $*" >&2; echo "可先開啟 index.html 使用模擬演練；實機驗收仍未完成。" >&2; exit 1; }
echo '打造你的第一個 AI 助理：環境檢查與啟動'
for dependency in node npm; do
    command -v "$dependency" >/dev/null 2>&1 || fail "缺少 $dependency。雲端模型仍需本機 Node.js / npm / OpenClaw 執行環境。"
done
node "$SCRIPT_DIR/assets/check-runtime.cjs" || fail 'Node.js 版本不相容。'
npm --version || fail 'npm 無法執行。'
WORKSPACE_DIR="$HOME/.openclaw/workspace"
[ -d "$SCRIPT_DIR/sample-data" ] || fail '缺少 sample-data；請下載完整教材資料夾。'
mkdir -p "$WORKSPACE_DIR/sample-data" || fail '無法建立工作區。'
cp -R "$SCRIPT_DIR/sample-data/." "$WORKSPACE_DIR/sample-data/" || fail '練習資料複製失敗。'
echo "Day 1 練習資料已複製：$WORKSPACE_DIR/sample-data"
echo 'Day 2 請另依 workshop-config/README.md 建立唯讀工作區與工具權限。'
open "$SCRIPT_DIR/index.html" 2>/dev/null || true
if ! has_pinned_openclaw; then
    if command -v openclaw >/dev/null 2>&1; then openclaw gateway stop >/dev/null 2>&1 || true; fi
    echo "安裝課堂固定版本 openclaw@${OPENCLAW_VERSION}（避免自動裝到未試跑的新版）…"
    npm install -g "openclaw@${OPENCLAW_VERSION}" --allow-scripts=@google/genai,esbuild,koffi,protobufjs,openclaw || fail "openclaw@${OPENCLAW_VERSION} 安裝失敗（常見為權限不足）；請交由助教處理。"
fi
command -v openclaw >/dev/null 2>&1 || fail '無法找到 openclaw；安裝後請重開終端機，不能據此宣告啟動成功。'
openclaw --version || fail 'OpenClaw CLI 無法執行。'
has_pinned_openclaw || fail "OpenClaw 版本不是課堂固定版本 ${OPENCLAW_VERSION}；請交由助教處理，勿自行更新。"
if ! openclaw models list --provider google 2>/dev/null | grep -Eq "gemini-3\.5-flash-lite.*default"; then
    echo '尚未設定課堂模型：執行 openclaw onboard，依安裝手冊 Part B 步驟 3 選 Google 並貼上 AI Studio 金鑰。'
    openclaw onboard || echo '[提醒] 設定精靈未正常結束；若畫面顯示 Credentials saved 可繼續。'
    openclaw models set google/gemini-3.5-flash-lite || fail '無法指定模型 google/gemini-3.5-flash-lite；請交由助教檢查。'
    openclaw models fallbacks add google/gemini-3.1-flash-lite || echo '[提醒] 備援模型未加入；請照安裝手冊手動執行。'
fi
if ! openclaw health; then
    echo '安裝背景服務：openclaw gateway install'
    openclaw gateway install || fail 'Gateway 安裝失敗；請照安裝手冊 Part E Q8 重建，或改用 Q11 雙視窗前台執行。'
    openclaw gateway start || fail 'Gateway 啟動失敗；請照安裝手冊 Part E Q8 重建，或改用 Q11 雙視窗前台執行。'
    openclaw health || fail 'Gateway 健康檢查未通過；請照安裝手冊 Part E Q8 重建，或改用 Q11 雙視窗前台執行。'
fi
echo '[完成] Gateway 健康檢查通過；模型回覆、Skill 與權限仍須各自驗收。'
echo '第一次使用請執行 openclaw，自己輸入開場白幫助理取名（見安裝手冊 Part B 步驟 3）。'
echo '開啟控制台：openclaw dashboard；停止服務：openclaw gateway stop'
