(function (root) {
  const items = [
    ['sources', '資料來源可追溯'],
    ['privacy', '測試資料與紀錄已檢查個資'],
    ['human', '人工審閱與手動外送流程'],
    ['tools', '工作區及工具權限限制（含越界與提示注入測試）'],
    ['skill', 'Skill 載入與三個案例'],
    ['telegram', 'Telegram 白名單、拒絕未授權帳號與停用'],
    ['mvp', '個人 MVP 與測試後修正']
  ];
  function renderAssessment(getRecord) {
    return items.map(([id, label]) => {
      const record = getRecord(id) || {};
      const evidence = String(record.evidence || '').trim();
      const live = record.status === 'live' && evidence.length > 0;
      const status = live ? '實機完成（學員自評，附證據）'
        : record.status === 'simulated' ? '模擬演練（不代表實機通過）'
        : record.status === 'live' ? '尚未完成（缺少證據）' : '尚未完成';
      return `- [${live ? 'x' : ' '}] **${label}**：${status}\n  證據／紀錄：${evidence ? evidence.replace(/\r?\n/g, '\n  ') : '未提供'}`;
    }).join('\n');
  }
  const api = { items, renderAssessment };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WorkshopAssessment = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
