(function () {
  const STORAGE_PREFIX = 'scu-ai-workshop-2026:';

  // 1. Checkboxes progress tracking
  document.querySelectorAll('[data-check]').forEach((box) => {
    const key = STORAGE_PREFIX + 'check:' + box.dataset.check;
    box.checked = localStorage.getItem(key) === 'true';
    box.addEventListener('change', () => localStorage.setItem(key, String(box.checked)));
  });

  // 2. Code block and Terminal copy buttons & macOS window decoration
  const COPY_SVG = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/></svg>`;
  const CHECK_SVG = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

  function setupCopyableBlock(targetEl, isTerminal = false) {
    if (targetEl.closest('.code-wrap')) return;

    const rawText = targetEl.innerText.trim();
    let typeLabel = 'BASH / CLI';
    let typeClass = 'cli';
    let isPrompt = false;

    if (!isTerminal) {
      if (rawText.startsWith('請') || rawText.includes('我想') || rawText.includes('你剛剛') || rawText.includes('我執行時') || rawText.includes('先不要執行')) {
        typeLabel = 'PROMPT 提示詞';
        typeClass = 'prompt';
        isPrompt = true;
      } else if (rawText.includes('Set-ExecutionPolicy') || rawText.includes('Get-ChildItem') || rawText.includes('Copy-Item')) {
        typeLabel = 'POWERSHELL';
        typeClass = 'cli';
      } else if (rawText.startsWith('{') || rawText.includes('": "')) {
        typeLabel = 'JSON CONFIG';
        typeClass = 'config';
      } else if (rawText.startsWith('#') || rawText.includes('brew ') || rawText.includes('npm ') || rawText.includes('openclaw ') || rawText.includes('mkdir ') || rawText.includes('cp ')) {
        typeLabel = 'BASH / TERMINAL';
        typeClass = 'cli';
      } else {
        typeLabel = 'COMMAND / CODE';
        typeClass = 'cli';
      }
    } else {
      typeLabel = 'TERMINAL INTERACTIVE';
      typeClass = 'cli';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrap' + (isPrompt ? ' is-prompt' : '');
    // 系統標記要跟著外層走，否則隱藏後會殘留空的標題列
    if (targetEl.dataset.os) {
      wrapper.dataset.os = targetEl.dataset.os;
      delete targetEl.dataset.os;
    }
    targetEl.parentNode.insertBefore(wrapper, targetEl);

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <div class="code-dots">
        <span class="code-dot red"></span>
        <span class="code-dot yellow"></span>
        <span class="code-dot green"></span>
      </div>
      <div class="code-title">
        <span class="code-type-chip ${typeClass}">${typeLabel}</span>
      </div>
    `;

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.innerHTML = `${COPY_SVG} <span>複製</span>`;
    button.setAttribute('aria-label', isPrompt ? '複製提示詞' : '複製指令');
    
    button.addEventListener('click', async () => {
      const textToCopy = targetEl.innerText;
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch {
        const area = document.createElement('textarea');
        area.value = textToCopy;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      button.classList.add('copied');
      button.innerHTML = `${CHECK_SVG} <span>已複製 ✓</span>`;
      window.setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = `${COPY_SVG} <span>複製</span>`;
      }, 1800);
    });

    header.appendChild(button);
    wrapper.appendChild(header);
    wrapper.appendChild(targetEl);
  }

  document.querySelectorAll('.code').forEach((block) => setupCopyableBlock(block, false));

  // 2a. 資料夾路徑框：學員複製後貼到 Finder／檔案總管，不是終端機指令，用淺色樣式與獨立的複製按鈕
  document.querySelectorAll('.path-box').forEach((box) => {
    if (box.querySelector('.path-copy')) return;
    const pathEl = box.querySelector('code');
    const button = document.createElement('button');
    button.className = 'path-copy';
    button.type = 'button';
    button.innerHTML = `${COPY_SVG} <span>複製路徑</span>`;
    button.setAttribute('aria-label', '複製資料夾路徑');
    button.addEventListener('click', async () => {
      const textToCopy = pathEl.innerText.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch {
        const area = document.createElement('textarea');
        area.value = textToCopy;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      button.innerHTML = `${CHECK_SVG} <span>已複製 ✓</span>`;
      window.setTimeout(() => { button.innerHTML = `${COPY_SVG} <span>複製路徑</span>`; }, 1800);
    });
    box.appendChild(button);
  });

  // 2b. Terminal mock window decorator
  document.querySelectorAll('.terminal-mock').forEach((term) => {
    if (term.querySelector('.terminal-mock-header')) return;
    const bodyContent = term.innerHTML;
    term.innerHTML = '';
    
    const header = document.createElement('div');
    header.className = 'code-header terminal-mock-header';
    header.innerHTML = `
      <div class="code-dots">
        <span class="code-dot red"></span>
        <span class="code-dot yellow"></span>
        <span class="code-dot green"></span>
      </div>
      <div class="code-title">
        <span class="code-type-chip cli">${term.dataset.title || 'TERMINAL · INTERACTIVE SETUP'}</span>
      </div>
    `;

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.innerHTML = `${COPY_SVG} <span>複製內容</span>`;
    button.addEventListener('click', async () => {
      const textToCopy = bodyContent.replace(/<[^>]*>/g, '').trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch {
        const area = document.createElement('textarea');
        area.value = textToCopy;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      button.classList.add('copied');
      button.innerHTML = `${CHECK_SVG} <span>已複製 ✓</span>`;
      window.setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = `${COPY_SVG} <span>複製內容</span>`;
      }, 1800);
    });
    header.appendChild(button);

    const body = document.createElement('div');
    body.className = 'terminal-mock-body';
    body.innerHTML = bodyContent.trim();

    term.appendChild(header);
    term.appendChild(body);
  });

  // 2c. Dynamic Badges & Chips enhancement (Live task pulse, Backup, HITL)
  document.querySelectorAll('.topic, .schedule-row, .lesson h2, .lesson-meta, h3, h4, p').forEach((el) => {
    if (el.innerHTML.includes('〔實機〕')) {
      el.innerHTML = el.innerHTML.replace(/〔實機〕/g, ' <span class="tag tag-live"><span class="live-pulse-dot"></span>實機任務</span>');
    }
  });

  document.querySelectorAll('.tag').forEach((tag) => {
    const text = tag.textContent.trim();
    if (text.includes('實機') && !tag.querySelector('.live-pulse-dot')) {
      tag.classList.add('tag-live');
      tag.innerHTML = `<span class="live-pulse-dot"></span> ` + tag.innerHTML;
    } else if (text.includes('HITL') || text.includes('審核') || text.includes('防線') || text.includes('守則')) {
      tag.classList.add('tag-hitl');
    } else if (text.includes('Skill') || text.includes('MCP') || text.includes('觀念 2')) {
      tag.classList.add('tag-mcp');
    }
  });
  // 作業系統切換：html[data-os-view] 為 mac / win / all；沒有屬性時 CSS 不隱藏任何內容
  function detectOs() {
    const hint = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '';
    if (/win/i.test(hint)) return 'win';
    if (/mac|linux|x11|cros/i.test(hint)) return 'mac';
    return 'all';
  }

  function initOsSwitcher(bar) {
    const key = STORAGE_PREFIX + 'os';
    const valid = ['mac', 'win', 'all'];
    let saved = null;
    try { saved = localStorage.getItem(key); } catch { /* 隱私模式下略過 */ }
    const buttons = bar.querySelectorAll('[data-os-choice]');

    function apply(choice) {
      document.documentElement.dataset.osView = choice;
      buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.osChoice === choice)));
    }

    apply(valid.includes(saved) ? saved : detectOs());
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      apply(btn.dataset.osChoice);
      try { localStorage.setItem(key, btn.dataset.osChoice); } catch { /* 同上 */ }
    }));
  }

  function initTopBar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const bar = document.createElement('div');
    bar.className = 'gateway-bar';
    bar.innerHTML = `
      <div class="download-btn-group">
        <div class="os-switch" role="group" aria-label="選擇你的作業系統">
          <span class="os-switch-label">我的電腦：</span>
          <div class="os-switch-group">
            <button type="button" class="os-switch-btn" data-os-choice="mac" aria-pressed="false">macOS / Linux</button>
            <button type="button" class="os-switch-btn" data-os-choice="win" aria-pressed="false">Windows</button>
            <button type="button" class="os-switch-btn" data-os-choice="all" aria-pressed="false">全部</button>
          </div>
        </div>
      </div>
    `;
    header.parentNode.insertBefore(bar, header.nextSibling);
    initOsSwitcher(bar);
    // 頂部列固定在導覽列下方，並把兩者高度交給 CSS（目錄側欄要避開）
    const syncHeights = () => {
      const root = document.documentElement.style;
      root.setProperty('--site-header-h', header.offsetHeight + 'px');
      root.setProperty('--gateway-bar-h', bar.offsetHeight + 'px');
    };
    syncHeights();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(syncHeights);
      ro.observe(header);
      ro.observe(bar);
    }

  }


  // 4. Forms & Self-Assessment Export
  document.querySelectorAll('form[data-survey]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem(STORAGE_PREFIX + 'survey:' + form.dataset.survey, JSON.stringify({ submittedAt: new Date().toISOString(), data }));
      const result = form.querySelector('.result');
      if (result) result.style.display = 'block';
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
    });
  });

  // Export comprehensive proposal package in survey-post.html
  const exportBtn = document.getElementById('btn-export-proposal');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const title = document.getElementById('proposal-title')?.value || '未命名校園 AI 助理專案';
      const theme = document.getElementById('proposal-theme')?.value || '未指定主題';
      const team = document.getElementById('proposal-team')?.value || '未填寫隊員資訊';
      const problem = document.getElementById('proposal-problem')?.value || '未填寫問題痛點';
      const solution = document.getElementById('proposal-solution')?.value || '未填寫 AI 解決方案架構';
      const skill = document.getElementById('proposal-skill')?.value || '未填寫本機最小 Skill 規格';
      const telegram = document.getElementById('proposal-telegram')?.value || '未填寫 Telegram 安全驗收紀錄';
      const dataSrc = document.getElementById('proposal-datasrc')?.value || '未填寫資料來源';
      const userTest = document.getElementById('proposal-usertest')?.value || '未填寫使用者測試數據與回饋';
      const iteration = document.getElementById('proposal-iteration')?.value || '未填寫三筆測試與修正紀錄';
      const humanCheck = document.getElementById('proposal-humancheck')?.value || '未填寫人工核對關卡';
      const risk = document.getElementById('proposal-risk')?.value || '未填寫安全與風險控制';

      const assessment = window.WorkshopAssessment.renderAssessment((id) => ({
        status: document.getElementById('assessment-' + id)?.value,
        evidence: document.getElementById('evidence-' + id)?.value
      }));

      const markdown = `# AI 助理專案企劃書

> **選題方向**：${theme}
> **專案名稱**：${title}
> **專案成員**：${team}
> **匯出時間**：${new Date().toLocaleString('zh-TW')}

---

## 📊 第一部分：專案簡報標準 10 頁骨架

### Page 1：封面
- **選題方向**：${theme}
- **專案名稱**：${title}
- **專案成員**：${team}

### Page 2：校園觀察與問題痛點
- **目標受眾**：明確受影響之校園學生、教師或行政同仁
- **痛點情境**：
${problem}

### Page 3：AI 助理系統架構與技術選型
- **技術工具**：OpenClaw Agent、LLM 模型、本機唯讀 Skill、個人 Telegram 測試 Bot
- **核心架構說明**：
${solution}

### Page 3A：本機最小 Skill（個人必過）
${skill}

### Page 3B：Telegram 測試 Bot（個人必過）
${telegram}

### Page 4：資料來源與 Context 邊界設計
- **允許讀取之校園資料來源**：
${dataSrc}
- **存取限制**：採唯讀約束、嚴禁存取帳號/密碼/個人隱私。

### Page 5：關鍵功能與互動流程
- **核心功能演示**：精準事實擷取、動態草稿生成、人工核准流程
- **展示紀錄（待提供）**：請附 OpenClaw 操作紀錄或註明模擬演練

### Page 6：目標使用者測試與回饋數據
- **測試規模**：請在下方據實填寫人數、任務數與實機／模擬方式，未填不得視為完成
- **量化與質化測試成果**：
${userTest}

### Page 7：基於回饋之功能與流程優化歷程
- **發現之問題/盲點**：受試者操作遭遇之邊界案例或幻覺
- **具體優化動作**：調整 Prompt 限制條件、增加 Context 欄位拆解、強化出處標記
${iteration}

### Page 8：安全防線與 Human-in-the-loop 閘門機制
- **人工核准條件 (HITL)**：
${humanCheck}
- **風險防護與隱私控制**：
${risk}

### Page 9：校園推廣效益與後續延伸潛力
- **預期效益**：預計節省學生/行政工時、減少資訊落差
- **後續展望**：擴充資料範圍、找更多目標使用者實測並持續修正

### Page 10：團隊分工與推進時程
- **成員分工**：需求訪談、提示工程、流程設計、測試數據分析
- **後續計畫**：完善實機 Live Demo 與使用者推廣

---

## 🛡️ 第二部分：AI 專案倫理與安全自主檢核清單

以下為學員自行填寫的驗收紀錄，尚需講師核對。模擬演練不代表實機完成；未提供證據不勾選。

${assessment}
`;

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `東吳校園AI助理專案企劃_${new Date().toISOString().slice(0,10)}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // 5. Interactive Problem Breakdown Worksheet
  function initWorksheet() {
    const fields = ['ws-problem', 'ws-datasrc', 'ws-humancheck', 'ws-risk', 'ws-flow'];
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const key = STORAGE_PREFIX + 'worksheet:' + id;
      el.value = localStorage.getItem(key) || '';
      el.addEventListener('input', () => {
        localStorage.setItem(key, el.value);
      });
    });

    const presets = {
      club: {
        problem: '社團幹部每學期需統計 50+ 位社員的課表空堂以安排社課，傳統透過表單收集後人工交叉比對耗費 4 小時以上，且易因時間看錯造成活動衝突。',
        datasrc: '社員課表意願 CSV 表格 (`sample-data/學生社團調查.csv`)、活動場地開放時間表。',
        humancheck: '最終社課時段定案、場地借用線上簽核確認、涉及個人隱私之電話與學號保護。',
        risk: '嚴禁未經授權修改社員原始填答；助理產出之建議時段必須隨附各時段出席人數之數據支持依據。'
      },
      course: {
        problem: '東吳雙溪與城中雙校區學生跨校區選課時，常因忽略通勤交通時間 (40-50分鐘) 導致課堂衝突或遲到，且不清楚各系擋修與體育選課規則。',
        datasrc: '東吳校車時刻表、開課課表時間與校區欄位、校園選課 FAQ (`sample-data/校園 FAQ.md`)。',
        humancheck: '體育課與跨院必修衝堂判定、加退選截止精確時間、畢業學分抵免審查。',
        risk: '嚴禁存取學生選課密碼；助理僅提供排課衝突診斷與建議，不可代為自動送出選課清單。'
      },
      study: {
        problem: '期中考週圖書館研討室搶手，各組同學常因不清楚最新借用要點與最低人數門檻而白跑一趟。',
        datasrc: '圖書館研討室借用管理要點、各樓層開放時段公告。',
        humancheck: '特殊時段專案借用審核、違規記點與借用資格復權核定。',
        risk: '不儲存或外洩借用人之學生證號與密碼，遵守校園隱私界線。'
      }
    };

    document.querySelectorAll('.btn-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.preset;
        const data = presets[type];
        if (!data) return;

        const probEl = document.getElementById('ws-problem');
        const dataEl = document.getElementById('ws-datasrc');
        const humanEl = document.getElementById('ws-humancheck');
        const riskEl = document.getElementById('ws-risk');
        const flowEl = document.getElementById('ws-flow');

        if (probEl) { probEl.value = data.problem; localStorage.setItem(STORAGE_PREFIX + 'worksheet:ws-problem', data.problem); }
        if (dataEl) { dataEl.value = data.datasrc; localStorage.setItem(STORAGE_PREFIX + 'worksheet:ws-datasrc', data.datasrc); }
        if (humanEl) { humanEl.value = data.humancheck; localStorage.setItem(STORAGE_PREFIX + 'worksheet:ws-humancheck', data.humancheck); }
        if (riskEl) { riskEl.value = data.risk; localStorage.setItem(STORAGE_PREFIX + 'worksheet:ws-risk', data.risk); }
        if (flowEl) { flowEl.value = 'Telegram 無個資提問 → 唯讀資料查詢 → 附來源的待核准草稿 → 人工確認；用三個測試問題驗收。'; localStorage.setItem(STORAGE_PREFIX + 'worksheet:ws-flow', flowEl.value); }

        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    const exportWsBtn = document.getElementById('btn-export-worksheet');
    if (exportWsBtn) {
      exportWsBtn.addEventListener('click', () => {
        const problem = document.getElementById('ws-problem')?.value || '未填寫';
        const dataSrc = document.getElementById('ws-datasrc')?.value || '未填寫';
        const humanCheck = document.getElementById('ws-humancheck')?.value || '未填寫';
        const risk = document.getElementById('ws-risk')?.value || '未填寫';
        const flow = document.getElementById('ws-flow')?.value || '未填寫';

        const markdown = `# 東吳校園痛點拆解與 AI 助理需求規格單

## 1. 校園觀察與問題痛點
${problem}

## 2. 允許存取的公開校園資料源
${dataSrc}

## 3. 必須由人工核對的關鍵關卡 (Human-in-the-loop)
${humanCheck}

## 4. 安全界線與風險控制機制
${risk}

## 5. MVP 最小流程與完成條件
${flow}

---
*導出時間：${new Date().toLocaleString('zh-TW')}*
`;
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `東吳校園痛點拆解工作單_${new Date().toISOString().slice(0,10)}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  // 6. Interactive Quiz System
  function initQuizHandlers() {
    document.querySelectorAll('.quiz-card').forEach((card) => {
      const answerIndex = parseInt(card.dataset.answer, 10);
      const buttons = card.querySelectorAll('.quiz-opt-btn');
      const explanation = card.querySelector('.quiz-explanation');

      buttons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => {
            b.disabled = true;
            b.classList.remove('selected', 'correct', 'wrong');
          });

          btn.classList.add('selected');
          if (idx === answerIndex) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
            if (buttons[answerIndex]) {
              buttons[answerIndex].classList.add('correct');
            }
          }

          if (explanation) {
            explanation.style.display = 'block';
          }
        });
      });
    });
  }

  // 7. Modal System
  function initModalSystem() {
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title"></h3>
            <button type="button" class="modal-close" aria-label="關閉視窗">&times;</button>
          </div>
          <div class="modal-body" id="modal-content"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    const closeBtn = backdrop.querySelector('.modal-close');
    const modalTitle = backdrop.querySelector('#modal-title');
    const modalContent = backdrop.querySelector('#modal-content');

    function closeModal() {
      backdrop.classList.remove('is-active', 'active');
      document.body.classList.remove('modal-open');
    }

    function openModal(title, htmlContent) {
      modalTitle.innerHTML = title;
      modalContent.innerHTML = htmlContent;
      backdrop.classList.add('is-active', 'active');
      document.body.classList.add('modal-open');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-active')) closeModal();
    });

    // Event Delegation for all modal triggers (robust across dynamic DOM / ToC moves)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-modal-trigger');
      if (!trigger) return;
      e.preventDefault();

      const targetSelector = trigger.dataset.modalTarget;
      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          const title = trigger.dataset.modalTitle || targetEl.dataset.title || '💡 觀念補充說明';
          openModal(title, targetEl.innerHTML);
          return;
        }
      }

      const targetId = trigger.dataset.modalId;
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const title = trigger.dataset.modalTitle || targetEl.dataset.title || '💡 觀念補充說明';
          openModal(title, targetEl.innerHTML);
          return;
        }
      }

      if (trigger.dataset.modalTitle && trigger.dataset.modalContent) {
        openModal(trigger.dataset.modalTitle, trigger.dataset.modalContent);
      }
    });
  }

  // 8. Dark Mode Toggle

  // 9. Table of Contents (ToC) Sidebar
  function initToC() {
    const mainWrap = document.querySelector('main.wrap');
    if (!mainWrap || (!window.location.pathname.includes('day1') && !window.location.pathname.includes('day2'))) return;
    
    const children = Array.from(mainWrap.childNodes);
    const layout = document.createElement('div');
    layout.className = 'layout-with-sidebar';
    
    const sidebar = document.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.innerHTML = '<h4>頁面導覽</h4><div class="toc-links"></div>';
    
    const contentBox = document.createElement('div');
    contentBox.className = 'toc-content';
    
    children.forEach(child => contentBox.appendChild(child));
    
    layout.appendChild(sidebar);
    layout.appendChild(contentBox);
    mainWrap.appendChild(layout);
    
    const tocLinksContainer = sidebar.querySelector('.toc-links');
    const sections = contentBox.querySelectorAll('section');
    const links = [];
    
    sections.forEach(sec => {
      const heading = sec.querySelector('h2');
      if (!heading || !sec.id) return;
      const a = document.createElement('a');
      a.href = '#' + sec.id;
      a.className = 'toc-link';
      
      let linkText = heading.innerText;
      const metaNum = sec.querySelector('.lesson-number');
      if (metaNum) {
        const sessionCode = metaNum.innerText.split('/')[0].trim();
        a.innerHTML = `<span class="toc-session-num">${sessionCode}</span> ${linkText}`;
      } else {
        a.textContent = linkText;
      }
      
      tocLinksContainer.appendChild(a);
      links.push({ sec, a });
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.a.classList.remove('active'));
          const activeLink = links.find(l => l.sec.id === entry.target.id);
          if (activeLink) activeLink.a.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    
    sections.forEach(sec => observer.observe(sec));
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTopBar();
      initWorksheet();
      initQuizHandlers();
      initModalSystem();
      initToC();
    });
  } else {
    initTopBar();
    initWorksheet();
    initQuizHandlers();
    initModalSystem();
    initToC();
  }
})();
