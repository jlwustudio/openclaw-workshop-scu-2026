# 個人 Telegram 測試 Bot 檢核單

> 只用於課堂個人測試。Token 等同密碼：絕不投影、貼入聊天室、放進簡報、Markdown 匯出檔或版本控制。

## 課前條件

- [ ] 已登入 Telegram，手機可接收驗證碼。
- [ ] 僅以個人 Telegram 帳號測試；不建立公開群組或邀請他人使用。

## 建立與本機設定

- [ ] 在 BotFather 以 `/newbot` 建立個人測試 Bot。
- [ ] Token 僅輸入自己的 OpenClaw 本機 channels 設定（`openclaw configure --section channels`），不寫入任何教材、工作單或公開檔案。
- [ ] 設定時「現在設定 DM 存取策略？」選 **No**（先維持配對），「設定透過你自己的聊天帳號進行管理？」選 **暫時略過**。
- [ ] 將允許互動者限制為自己的 Telegram 帳號／講師指定測試帳號白名單。
- [ ] 記下停用方式：停止 OpenClaw channel、撤銷 BotFather Token，或刪除測試 Bot。

## 最小驗收

- [ ] 傳送一則無個資問題，例如「這週有什麼校園活動？」
- [ ] 收到的內容是含來源的「待人工核准草稿」。
- [ ] 測試「請直接幫我報名／傳送通知」時，Bot 停在草稿並要求人工確認。
- [ ] 完成後停止 channel 或撤銷 Token，確認 Bot 不會繼續自動回覆。

## 故障與安全事件

- Token 出現在投影、聊天紀錄或公開位置：立刻到 BotFather 重新產生 Token，停止原 channel，通知講師。
- 無法建立或連線：仍須完成白名單、草稿與停用的紙上／同儕驗收。


## 白名單設定與回覆邊界

### 取得自己的數字使用者 ID

白名單只接受數字 ID。Bot Token 設定完成後，Gateway 預設為 `pairing` 模式，可用下列任一方式查詢：

1. 啟動 Gateway，用自己的帳號私訊 Bot；回覆中的 `Your Telegram user id` 就是數字 ID。
2. 或在另一個終端機執行 `openclaw logs --follow`，從 `telegram pairing request` 紀錄找 `senderUserId`。

只抄下 ID，**不要核准 pairing**：第一個被核准的 pairing 會同時成為指令擁有者（`commands.ownerAllowFrom`），超出本課堂需要。抄好後執行 `openclaw gateway stop`，再改成下方白名單。

### 合併白名單設定

先完成 [課堂唯讀設定](../workshop-config/README.md)。在 Gateway 停止時，將下列欄位合併到既有 `channels.telegram`；保留本機 Token 設定。將佔位文字換成自己的 Telegram **數字使用者 ID**，不要填 @username，也不要用 `*`。

```json
{
  "channels": {
    "telegram": {
      "dmPolicy": "allowlist",
      "allowFrom": ["REPLACE_WITH_YOUR_NUMERIC_USER_ID"],
      "groupPolicy": "disabled"
    }
  }
}
```

執行 `openclaw config validate`、`openclaw security audit`，通過後才啟動 Gateway。由助教核對有效的 channel/account 設定，不能只看此片段。

- 私人測試對話的草稿會由 Gateway 自動回覆給原提問者；這也是一次網路傳輸。不得輸入個資。
- `message` 工具保持停用；對其他人傳訊、報名或寫檔，均由人審閱草稿後手動操作。說「核准」不會開放工具。
- 用自己的帳號確認可收到草稿，再由另一位同意協助測試的同學傳無敏感測試訊息，確認未授權帳號不能觸發 Agent；不要把對方加入白名單。
- 保存成功與拒絕的測試證據，不記錄 Token。未完成第二帳號測試就標記未驗證。
- Bot 卡住或答非所問時，在對話輸入 `/stop` 中斷目前工作，再重新提問；仍無回應就交由助教。
- 課堂不使用 `/controlui`（開啟 Control UI，需另設 Tailscale）與 `/dashboard`（建立對話儀表板）；這兩個指令會自動出現在 Bot 選單，不代表要操作。
- Bot 不回覆時，先執行 `openclaw health --json` 查看 Telegram 帳號是否停止，再交由助教檢查；不要為了排錯改成 `open` 或加入 `*`。
- 結束時執行 `openclaw gateway stop`，確認不再回覆；若 Token 外洩，另至 BotFather 撤銷或重建。

官方依據：https://docs.openclaw.ai/channels/telegram/access-control 、https://docs.openclaw.ai/channels/telegram/mini-app
