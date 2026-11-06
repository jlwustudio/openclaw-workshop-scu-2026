@echo off
chcp 65001 >nul
setlocal DisableDelayedExpansion
set "SCRIPT_DIR=%~dp0"
set "WORKSPACE_DIR=%USERPROFILE%\.openclaw\workspace"
rem 課堂固定版本：2026-10-13 依 v2026.10.2 查核；改版本前須重新完成 Mac／Windows 試跑。
set "OPENCLAW_VERSION=2026.10.2"
echo 打造你的第一個 AI 助理：環境檢查與啟動
where node >nul 2>nul
if errorlevel 1 goto missing
where npm >nul 2>nul
if errorlevel 1 goto missing
node "%SCRIPT_DIR%assets\check-runtime.cjs"
if errorlevel 1 goto failed
call npm --version
if errorlevel 1 goto failed
if not exist "%SCRIPT_DIR%sample-data\" goto missing_data
if not exist "%WORKSPACE_DIR%\sample-data\" mkdir "%WORKSPACE_DIR%\sample-data"
if errorlevel 1 goto failed
xcopy /E /I /Y "%SCRIPT_DIR%sample-data\*" "%WORKSPACE_DIR%\sample-data\" >nul
if errorlevel 1 goto failed
echo Day 1 資料已複製。Day 2 請另依 workshop-config/README.md 建立唯讀工作區。
start "" "%SCRIPT_DIR%index.html"
where openclaw >nul 2>nul
if errorlevel 1 goto install_openclaw
openclaw --version 2>nul | findstr /C:"%OPENCLAW_VERSION%" >nul
if not errorlevel 1 goto openclaw_ready
call openclaw gateway stop >nul 2>nul
:install_openclaw
echo 安裝課堂固定版本 openclaw@%OPENCLAW_VERSION%（避免自動裝到未試跑的新版）…
call npm install -g openclaw@%OPENCLAW_VERSION% --allow-scripts=@google/genai,esbuild,koffi,protobufjs,openclaw
if errorlevel 1 goto install_failed
:openclaw_ready
where openclaw >nul 2>nul
if errorlevel 1 goto failed
call openclaw --version
if errorlevel 1 goto failed
openclaw --version 2>nul | findstr /C:"%OPENCLAW_VERSION%" >nul
if errorlevel 1 goto version_mismatch
call openclaw models list --provider google 2>nul | findstr /R /C:"gemini-3\.5-flash-lite.*default" >nul
if not errorlevel 1 goto model_ready
echo 尚未設定課堂模型：執行 openclaw onboard，依安裝手冊 Part B 步驟 3 選 Google 並貼上 AI Studio 金鑰。
call openclaw onboard
call openclaw models set google/gemini-3.5-flash-lite
if errorlevel 1 goto failed
call openclaw models fallbacks add google/gemini-3.1-flash-lite
if errorlevel 1 echo [提醒] 備援模型未加入；請照安裝手冊手動執行。
:model_ready
call openclaw health
if not errorlevel 1 goto health_ok
echo 安裝背景服務：openclaw gateway install
call openclaw gateway install
if errorlevel 1 goto gateway_failed
call openclaw gateway start
if errorlevel 1 goto gateway_failed
call openclaw health
if errorlevel 1 goto gateway_failed
:health_ok
echo [完成] Gateway 健康檢查通過；模型回覆、Skill 與權限仍須各自驗收。
echo 開啟控制台：openclaw dashboard；停止服務：openclaw gateway stop
echo 第一次使用請執行 openclaw，自己輸入開場白幫助理取名（見安裝手冊 Part B 步驟 3）。
pause
exit /b 0
:missing
echo [失敗] 缺少 Node.js 或 npm。雲端模型仍需本機執行環境；安裝後重開終端機。
goto failed
:missing_data
echo [失敗] 缺少 sample-data，請下載完整教材資料夾。
goto failed
:install_failed
echo [失敗] openclaw@%OPENCLAW_VERSION% 安裝失敗；請交由助教處理。
goto failed
:version_mismatch
echo [失敗] OpenClaw 版本不是課堂固定版本 %OPENCLAW_VERSION%；請交由助教處理，勿自行更新。
goto failed
:gateway_failed
echo [失敗] Gateway 無法啟動；請照安裝手冊 Part E Q8 重建，或改用 Q11 雙視窗前台執行。
:failed
echo [未完成] 請保留上方錯誤交由助教檢查。可使用模擬演練，實機驗收仍未完成。
pause
exit /b 1
