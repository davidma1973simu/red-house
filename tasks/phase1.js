// ════════════════════════════════════════════
// tasks/phase1.js
// 环节 1：洞察定义 — 全部任务实现
//   · 1·1·1 预先研究（renderPreResearch + runPreResearchAI + fallback）
//   · 1·1·2 调研洞察（renderSurveyInsight + runSurveyInsightAI + fallback）
//   · 1·1·3 ~ 1·3·3（后续任务在此文件末尾追加）
// ════════════════════════════════════════════

// ────────────────────────────────────────────
// 恢复已保存的预先研究结果到 UI
// ────────────────────────────────────────────
function restorePreResearchResult() {
  const result = loadPrResult();
  if (!result || (!result.dims && !result.whys && !result.priorities)) return;

  const { dims, whys, priorities } = result;

  // 恢复三维分析
  if (dims && dims.length) {
    dims.forEach((text, i) => {
      const el = document.getElementById(`pr-dim-body-${i}`);
      if (el) el.innerHTML = text;
      const card = document.getElementById(`pr-dim-${i}`);
      if (card) card.classList.add('lit');
    });
  }

  // 恢复 3 WHYs
  if (whys && whys.length) {
    whys.forEach((text, i) => {
      const el = document.getElementById(`pr-why-a-${i}`);
      if (el) el.innerHTML = text;
      const card = document.getElementById(`pr-why-${i}`);
      if (card) card.classList.add('lit');
    });
  }

  // 恢复优先排序
  if (priorities && priorities.length) {
    renderPriorityTable(priorities, false);
    const sec = document.getElementById('pr-output-section');
    if (sec) sec.classList.add('lit');
  }

  // 恢复按钮文案
  const runBtn = document.getElementById('pr-run-btn');
  if (runBtn && result.savedAt) {
    runBtn.querySelector('.btn-label').textContent = '✓ 重新分析';
  }
}

// ────────────────────────────────────────────
// 任务 1·1·1 预先研究
// ────────────────────────────────────────────
function renderPreResearch() {
  // 读取已保存的数据
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('rh_pr_data_v1') || '{}'); } catch(e) { return {}; }
  })();

  return `
<!-- ① 需求采集区 -->
<div class="ws-section">
  <div class="ws-section-title">① 需求采集</div>
  <div class="ws-section-desc">输入四个维度的信息，SS 将基于此进行综合分析，生成结构化洞察。</div>
  <div class="pr-input-grid">
    <div class="pr-input-card">
      <div class="pr-input-label"><span class="pr-input-num">1</span>行业 &amp; 公司</div>
      <input id="pr-industry" type="text"
        placeholder="例：物业管理 · 世茂物业"
        value="${esc(saved.industry||'')}"/>
    </div>
    <div class="pr-input-card">
      <div class="pr-input-label"><span class="pr-input-num">2</span>业务战略目标</div>
      <input id="pr-goal" type="text"
        placeholder="例：2026 年新客签约量提升 30%"
        value="${esc(saved.goal||'')}"/>
    </div>
    <div class="pr-input-card">
      <div class="pr-input-label"><span class="pr-input-num">3</span>高层期待</div>
      <textarea id="pr-expect"
        placeholder="领导层希望看到什么样的改变？&#10;例：项目经理能主动发现增值服务机会，主动跟进…">${esc(saved.expect||'')}</textarea>
    </div>
    <div class="pr-input-card">
      <div class="pr-input-label"><span class="pr-input-num">4</span>核心担忧</div>
      <textarea id="pr-concern"
        placeholder="领导层目前最担心什么风险？&#10;例：团队缺乏经营意识，忙于救火而非创造价值…">${esc(saved.concern||'')}</textarea>
    </div>
  </div>
</div>

<!-- ② AI 分析引擎 -->
<div class="ws-section">
  <div class="ws-section-title">② AI 分析引擎</div>
  <div class="pr-analyze-bar">
    <div class="pr-analyze-hint">
      <b>SS 将自动完成三维推演：</b>&nbsp; 内部研究 · 外部研究 · 人才研究<br/>
      <span style="font-size:11.5px;color:var(--slate-600)">请先完善上方四个输入项，再点击启动分析</span>
    </div>
    <button class="pr-analyze-btn" id="pr-run-btn" onclick="runPreResearchAI()">
      <span class="btn-spinner"></span>
      <span class="btn-label">✦ SS 启动分析</span>
    </button>
  </div>
  <!-- 进度条 -->
  <div class="pr-progress-bar" id="pr-progress">
    <div class="pr-progress-track"><div class="pr-progress-fill" id="pr-fill"></div></div>
    <span class="pr-progress-text" id="pr-progress-text">SS 正在调取数据进行综合分析…</span>
  </div>
  <!-- 三维分析卡 + 编辑控制条 -->
  <div class="pr-block-ctrl">
    <span class="ctrl-saved-hint" id="dims-saved-hint">✓ 已保存</span>
    <button class="pr-cancel-btn" id="dims-cancel-btn" onclick="cancelEditDims()">取消</button>
    <button class="pr-save-btn" id="dims-save-btn" onclick="saveEditDims()">💾 保存修订</button>
    <button class="pr-edit-btn" id="dims-edit-btn" onclick="startEditDims()">✏️ 编辑</button>
  </div>
  <div class="pr-dims">
    <div class="pr-dim-card" id="pr-dim-0">
      <div class="pr-dim-icon">🏢</div>
      <div class="pr-dim-title">内部研究</div>
      <div class="pr-dim-body" id="pr-dim-body-0">业务战略与经营现状分析将在此呈现</div>
      <textarea class="pr-dim-edit-area" id="pr-dim-edit-0" placeholder="编辑内部研究内容…"></textarea>
    </div>
    <div class="pr-dim-card" id="pr-dim-1">
      <div class="pr-dim-icon">🌐</div>
      <div class="pr-dim-title">外部研究</div>
      <div class="pr-dim-body" id="pr-dim-body-1">行业趋势与竞争环境分析将在此呈现</div>
      <textarea class="pr-dim-edit-area" id="pr-dim-edit-1" placeholder="编辑外部研究内容…"></textarea>
    </div>
    <div class="pr-dim-card" id="pr-dim-2">
      <div class="pr-dim-icon">👥</div>
      <div class="pr-dim-title">人才研究</div>
      <div class="pr-dim-body" id="pr-dim-body-2">目标群体技能知识与绩效现状将在此呈现</div>
      <textarea class="pr-dim-edit-area" id="pr-dim-edit-2" placeholder="编辑人才研究内容…"></textarea>
    </div>
  </div>
</div>

<!-- ③ AI 洞察决策区（3 WHYs）-->
<div class="ws-section">
  <div class="ws-section-title">③ 核心洞察 · The 3 WHYs</div>
  <div class="ws-section-desc">AI 自动回答三个关键决策问题，确保赋能设计锚定业务价值。</div>
  <div class="pr-block-ctrl">
    <span class="ctrl-saved-hint" id="whys-saved-hint">✓ 已保存</span>
    <button class="pr-cancel-btn" id="whys-cancel-btn" onclick="cancelEditWhys()">取消</button>
    <button class="pr-save-btn" id="whys-save-btn" onclick="saveEditWhys()">💾 保存修订</button>
    <button class="pr-edit-btn" id="whys-edit-btn" onclick="startEditWhys()">✏️ 编辑</button>
  </div>
  <div class="pr-whys">
    <div class="pr-why-card" id="pr-why-0">
      <div class="pr-why-badge">WHY<span>1</span></div>
      <div style="flex:1">
        <div class="pr-why-q">为什么是这些人？ — 锁定关键受众</div>
        <div class="pr-why-a" id="pr-why-a-0">AI 分析后将自动填充……</div>
        <textarea class="pr-why-edit-area" id="pr-why-edit-0" placeholder="编辑 WHY1 内容…"></textarea>
      </div>
    </div>
    <div class="pr-why-card" id="pr-why-1">
      <div class="pr-why-badge">WHY<span>2</span></div>
      <div style="flex:1">
        <div class="pr-why-q">为什么是这个主题？ — 明确赋能核心</div>
        <div class="pr-why-a" id="pr-why-a-1">AI 分析后将自动填充……</div>
        <textarea class="pr-why-edit-area" id="pr-why-edit-1" placeholder="编辑 WHY2 内容…"></textarea>
      </div>
    </div>
    <div class="pr-why-card" id="pr-why-2">
      <div class="pr-why-badge">WHY<span>3</span></div>
      <div style="flex:1">
        <div class="pr-why-q">为什么现在是合适时机？ — 识别业务紧迫性</div>
        <div class="pr-why-a" id="pr-why-a-2">AI 分析后将自动填充……</div>
        <textarea class="pr-why-edit-area" id="pr-why-edit-2" placeholder="编辑 WHY3 内容…"></textarea>
      </div>
    </div>
  </div>
</div>

<!-- ④ 最终价值产出区 -->
<div class="ws-section pr-output-section" id="pr-output-section">
  <div class="ws-section-title">④ 业务赋能目标优先排序</div>
  <div class="ws-section-desc">基于三维分析与 3 WHYs 洞察，SS 综合生成以下优先排序建议。</div>
  <div class="pr-block-ctrl">
    <span class="ctrl-saved-hint" id="prio-saved-hint">✓ 已保存</span>
    <button class="pr-cancel-btn" id="prio-cancel-btn" onclick="cancelEditPrio()">取消</button>
    <button class="pr-save-btn" id="prio-save-btn" onclick="saveEditPrio()">💾 保存修订</button>
    <button class="pr-edit-btn" id="prio-edit-btn" onclick="startEditPrio()">✏️ 编辑</button>
  </div>
  <table class="pr-priority-table" id="pr-priority-table">
    <thead>
      <tr>
        <th style="width:52px">优先级</th>
        <th>业务赋能目标重点</th>
        <th style="width:220px">对标 KPI 价值（逗号分隔）</th>
      </tr>
    </thead>
    <tbody id="pr-table-body">
      <tr><td colspan="3" style="text-align:center;color:var(--slate-700);padding:24px">
        AI 分析完成后自动生成 →
      </td></tr>
    </tbody>
  </table>
  <div class="pr-action-row">
    <button class="pr-action-btn download" onclick="downloadPreResearchReport()">
      ⬇ 下载完整报告
    </button>
    <button class="pr-action-btn next" onclick="saveWorkspace(); setTimeout(()=>openTask(0,0,1), 300)">
      跳转下一步：调研洞察 →
    </button>
  </div>
</div>`;
}

// ════════════════════════════════════════════
// 任务 1·1·2  调研洞察
// ════════════════════════════════════════════

// ── 存储 ─────────────────────────────────────
function loadSiData() {
  try { return JSON.parse(localStorage.getItem('rh_si_data_v1') || '{}'); } catch(e) { return {}; }
}
function saveSiData(d) { localStorage.setItem('rh_si_data_v1', JSON.stringify(d)); }
function loadSiResult() {
  try { return JSON.parse(localStorage.getItem('rh_si_result_v1') || 'null'); } catch(e) { return null; }
}
function saveSiResult(r) { localStorage.setItem('rh_si_result_v1', JSON.stringify(r)); }

// ── 渲染工作区 ────────────────────────────────
function renderSurveyInsight() {
  const saved = loadSiData();
  const ins = getProjectInsights(); // 从预先研究读取已有目标
  const goalHint = ins?.priorities?.[0]?.objective || '';

  return `
<!-- ① 四维度输入 -->
<div class="ws-section">
  <div class="ws-section-title">① 四维度调研输入</div>
  <div class="ws-section-desc">针对四类关键人群收集结构化视角，以务虚为主。可直接填写，也可粘贴访谈记录。
    ${goalHint ? `<br/><span style="color:var(--red-400);font-size:12px">📌 基于预先研究目标：${goalHint.slice(0,40)}…</span>` : ''}</div>

  <div class="si-input-grid">

    <!-- 高层领导 -->
    <div class="si-input-card">
      <div class="si-input-header">
        <span class="si-role-icon">👔</span>
        <div>
          <div class="si-role-name">高层领导</div>
          <div class="si-role-sub">Senior Leadership</div>
        </div>
      </div>
      <div class="si-input-label">战略期待与 KPI 定性要求</div>
      <textarea id="si-senior" class="si-textarea" placeholder="例：希望项目经理具备经营意识，能主动识别增值机会，而不只是执行命令。KPI 核心看续签率和客户满意度…">${esc(saved.senior||'')}</textarea>
      <label class="si-file-label">📎 上传访谈记录
        <input type="file" accept=".txt,.md,.pdf,.docx" class="si-file-input" onchange="handleSiFile(this,'si-senior')" />
      </label>
    </div>

    <!-- 业务专家 -->
    <div class="si-input-card">
      <div class="si-input-header">
        <span class="si-role-icon">🔧</span>
        <div>
          <div class="si-role-name">业务专家</div>
          <div class="si-role-sub">Business Experts</div>
        </div>
      </div>
      <div class="si-input-label">技术难点、高频场景与复杂挑战</div>
      <textarea id="si-expert" class="si-textarea" placeholder="例：渠道决策周期长，信息不透明；新品上市时跨部门协作卡点多；客户异议处理缺乏系统方法…">${esc(saved.expert||'')}</textarea>
      <label class="si-file-label">📎 上传访谈记录
        <input type="file" accept=".txt,.md,.pdf,.docx" class="si-file-input" onchange="handleSiFile(this,'si-expert')" />
      </label>
    </div>

    <!-- HRBP/TD -->
    <div class="si-input-card">
      <div class="si-input-header">
        <span class="si-role-icon">📊</span>
        <div>
          <div class="si-role-name">人才发展专家</div>
          <div class="si-role-sub">HRBP / TD</div>
        </div>
      </div>
      <div class="si-input-label">能力现状、技能差距与绩效数据</div>
      <textarea id="si-hrbp" class="si-textarea" placeholder="例：胜任力模型显示 65% 学员在「客户价值挖掘」维度处于初级水平；头部与尾部绩效差距约 3 倍；过去 6 个月培训覆盖率 40%…">${esc(saved.hrbp||'')}</textarea>
      <label class="si-file-label">📎 上传访谈记录
        <input type="file" accept=".txt,.md,.pdf,.docx" class="si-file-input" onchange="handleSiFile(this,'si-hrbp')" />
      </label>
    </div>

    <!-- 高绩效员工 -->
    <div class="si-input-card">
      <div class="si-input-header">
        <span class="si-role-icon">⭐</span>
        <div>
          <div class="si-role-name">高绩效员工</div>
          <div class="si-role-sub">High-Performance Employees</div>
        </div>
      </div>
      <div class="si-input-label">成功场景、实践行为与关键动作</div>
      <textarea id="si-hiper" class="si-textarea" placeholder="例：每次客户拜访前会研究对方最新财报，用数据切入；遇到预算卡点会主动联系决策人而非等待；拿单后立刻制定 90 天服务计划…">${esc(saved.hiper||'')}</textarea>
      <label class="si-file-label">📎 上传访谈记录
        <input type="file" accept=".txt,.md,.pdf,.docx" class="si-file-input" onchange="handleSiFile(this,'si-hiper')" />
      </label>
    </div>

  </div>
</div>

<!-- ② AI 四层推导 -->
<div class="ws-section">
  <div class="ws-section-title">② AI 四层推导 · 从现象到本质</div>
  <div class="pr-analyze-bar">
    <div class="pr-analyze-hint">
      <b>SS 将对四个维度输入进行深度线形推演：</b><br/>
      <span style="font-size:11.5px;color:var(--slate-600)">现象事实 → 共性规律 → 结构要素 → 价值信念，请先完善上方输入再启动</span>
    </div>
    <button class="pr-analyze-btn" id="si-run-btn" onclick="runSurveyInsightAI()">
      <span class="btn-spinner"></span>
      <span class="btn-label">✦ SS 启动洞察</span>
    </button>
  </div>
  <div class="pr-progress-bar" id="si-progress">
    <div class="pr-progress-track"><div class="pr-progress-fill" id="si-fill"></div></div>
    <span class="pr-progress-text" id="si-progress-text">SS 正在汇总四维度信息…</span>
  </div>

  <!-- 四层推导卡 -->
  <div class="pr-block-ctrl">
    <span class="ctrl-saved-hint" id="si-layers-hint">✓ 已保存</span>
    <button class="pr-cancel-btn" id="si-layers-cancel" onclick="cancelEditSiLayers()">取消</button>
    <button class="pr-save-btn"   id="si-layers-save"   onclick="saveEditSiLayers()">💾 保存修订</button>
    <button class="pr-edit-btn"   id="si-layers-edit"   onclick="startEditSiLayers()">✏️ 编辑</button>
  </div>
  <div class="si-layers">

    <div class="si-layer-card" id="si-layer-0">
      <div class="si-layer-badge" style="background:rgba(99,102,241,0.15);color:#a5b4fc">L1</div>
      <div style="flex:1">
        <div class="si-layer-title">现象 <span class="si-layer-sub">Observable Symptoms · 能观察到什么？</span></div>
        <div class="si-layer-body" id="si-layer-body-0">AI 将从四个维度提炼可观察到的具体行为症状或业务表现……</div>
        <textarea class="pr-dim-edit-area" id="si-layer-edit-0" placeholder="描述可观察到的具体行为症状或业务表现……"></textarea>
      </div>
    </div>

    <div class="si-layer-card" id="si-layer-1">
      <div class="si-layer-badge" style="background:rgba(16,185,129,0.15);color:#6ee7b7">L2</div>
      <div style="flex:1">
        <div class="si-layer-title">共性 <span class="si-layer-sub">Cross-Role Patterns · 为什么不是偶然？</span></div>
        <div class="si-layer-body" id="si-layer-body-1">AI 将识别哪几个角色均有反映，它们共同指向了什么规律性问题……</div>
        <textarea class="pr-dim-edit-area" id="si-layer-edit-1" placeholder="描述跨角色、跨维度的共性规律——说明哪些角色均有反映……"></textarea>
      </div>
    </div>

    <div class="si-layer-card" id="si-layer-2">
      <div class="si-layer-badge" style="background:rgba(245,158,11,0.15);color:#fcd34d">L3</div>
      <div style="flex:1">
        <div class="si-layer-title">结构 <span class="si-layer-sub">Structural Root Cause · 为什么这个规律会持续存在？</span></div>
        <div class="si-layer-body" id="si-layer-body-2">AI 将指出什么组织机制/能力/流程缺失，导致了 L2 的共性问题……</div>
        <textarea class="pr-dim-edit-area" id="si-layer-edit-2" placeholder="用「X 缺失/不足，导致 Y」的因果句式描述结构根因……"></textarea>
      </div>
    </div>

    <div class="si-layer-card" id="si-layer-3">
      <div class="si-layer-badge" style="background:rgba(239,68,68,0.15);color:#fca5a5">L4</div>
      <div style="flex:1">
        <div class="si-layer-title">价值与文化 <span class="si-layer-sub">Beliefs &amp; Culture · 为什么结构问题难以被改变？</span></div>
        <div class="si-layer-body" id="si-layer-body-3">AI 将揭示什么深层信念或文化假设，让 L3 的结构问题得以长期存在……</div>
        <textarea class="pr-dim-edit-area" id="si-layer-edit-3" placeholder="描述隐含的组织假设或文化障碍，如「控制=安全」「经验不可复制」……"></textarea>
      </div>
    </div>

  </div>
</div>

<!-- ③ 三项核心产出 -->
<div class="ws-section si-output-section" id="si-output-section">
  <div class="ws-section-title">③ 三项核心产出</div>
  <div class="ws-section-desc">基于四层推导，SS 自动生成结构化产出，为后续「任务 1·1·3 分解目标」提供精准输入。</div>

  <!-- 产出 A：多维需求矩阵 -->
  <div class="si-output-block" id="si-out-a">
    <div class="si-out-block-title">
      <span class="si-out-idx">A</span> 各层级需求汇总 · 多维需求矩阵
    </div>
    <div class="pr-block-ctrl" style="margin-top:4px">
      <span class="ctrl-saved-hint" id="si-matrix-hint">✓ 已保存</span>
      <button class="pr-cancel-btn" id="si-matrix-cancel" onclick="cancelEditSiMatrix()">取消</button>
      <button class="pr-save-btn"   id="si-matrix-save"   onclick="saveEditSiMatrix()">💾 保存修订</button>
      <button class="pr-edit-btn"   id="si-matrix-edit"   onclick="startEditSiMatrix()">✏️ 编辑</button>
    </div>
    <div id="si-matrix-body">
      <table class="si-matrix-table">
        <thead><tr>
          <th>维度</th><th>核心期待</th><th>主要担心</th><th>关键输入要点</th>
        </tr></thead>
        <tbody id="si-matrix-tbody">
          <tr><td colspan="4" style="text-align:center;color:var(--slate-700);padding:20px">AI 分析后自动生成 →</td></tr>
        </tbody>
      </table>
    </div>
    <textarea class="pr-dim-edit-area" id="si-matrix-edit-area" placeholder="编辑需求矩阵（JSON 格式）……" style="min-height:100px"></textarea>
  </div>

  <!-- 产出 B：核心需求类别 -->
  <div class="si-output-block" id="si-out-b">
    <div class="si-out-block-title">
      <span class="si-out-idx">B</span> 核心需求类别 · 分类分级
    </div>
    <div class="pr-block-ctrl" style="margin-top:4px">
      <span class="ctrl-saved-hint" id="si-cats-hint">✓ 已保存</span>
      <button class="pr-cancel-btn" id="si-cats-cancel" onclick="cancelEditSiCats()">取消</button>
      <button class="pr-save-btn"   id="si-cats-save"   onclick="saveEditSiCats()">💾 保存修订</button>
      <button class="pr-edit-btn"   id="si-cats-edit"   onclick="startEditSiCats()">✏️ 编辑</button>
    </div>
    <div class="si-cats-grid" id="si-cats-body">
      <div class="si-cats-empty">AI 分析后自动生成 →</div>
    </div>
    <textarea class="pr-dim-edit-area" id="si-cats-edit-area" placeholder="编辑核心需求类别……" style="min-height:80px"></textarea>
  </div>

  <!-- 产出 C：核心赋能命题 -->
  <div class="si-output-block" id="si-out-c">
    <div class="si-out-block-title">
      <span class="si-out-idx">C</span> 核心赋能命题 · Enabling Proposition
    </div>
    <div class="pr-block-ctrl" style="margin-top:4px">
      <span class="ctrl-saved-hint" id="si-essence-hint">✓ 已保存</span>
      <button class="pr-cancel-btn" id="si-essence-cancel" onclick="cancelEditSiEssence()">取消</button>
      <button class="pr-save-btn"   id="si-essence-save"   onclick="saveEditSiEssence()">💾 保存修订</button>
      <button class="pr-edit-btn"   id="si-essence-edit"   onclick="startEditSiEssence()">✏️ 编辑</button>
    </div>
    <div class="si-essence-body" id="si-essence-body">AI 分析后将生成核心赋能命题：打破什么假设 → 建立什么体验 → 项目核心价值命题……</div>
    <textarea class="pr-dim-edit-area" id="si-essence-edit-area" placeholder="描述这次赋能要打破什么假设、建立什么体验、核心价值命题是什么……" style="min-height:100px"></textarea>
  </div>

  <!-- 行动按钮 -->
  <div class="pr-action-row">
    <button class="pr-action-btn download" onclick="downloadSurveyInsightReport()">⬇ 下载洞察报告</button>
    <button class="pr-action-btn next" onclick="saveWorkspace(); setTimeout(()=>openTask(0,0,2), 300)">跳转下一步：分解目标 →</button>
  </div>
</div>`;
}

// ── 文件上传处理（读取文本内容追加到对应 textarea）──────
function handleSiFile(input, targetId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const ta = document.getElementById(targetId);
    if (ta) {
      ta.value = (ta.value ? ta.value + '\n\n--- 上传文件内容 ---\n' : '') + e.target.result;
    }
    showToast(`已读入「${file.name}」`, 'success');
  };
  reader.readAsText(file, 'utf-8');
}

// ── 恢复已保存结果 ───────────────────────────────────────
function restoreSurveyInsightResult() {
  const result = loadSiResult();
  if (!result) return;
  const { layers, matrix, categories, essence } = result;

  if (layers?.length) {
    layers.forEach((text, i) => {
      const el = document.getElementById(`si-layer-body-${i}`);
      if (el) el.innerHTML = text;
      const card = document.getElementById(`si-layer-${i}`);
      if (card) card.classList.add('lit');
    });
  }
  if (matrix?.length) renderSiMatrix(matrix, false);
  if (categories?.length) renderSiCategories(categories, false);
  if (essence) {
    const el = document.getElementById('si-essence-body');
    if (el) el.innerHTML = essence;
    document.getElementById('si-out-c')?.classList.add('lit');
  }
  const runBtn = document.getElementById('si-run-btn');
  if (runBtn && result.savedAt) runBtn.querySelector('.btn-label').textContent = '✓ 重新洞察';
}

// ── 渲染需求矩阵表格 ─────────────────────────────────────
function renderSiMatrix(data, animate = true) {
  const tbody = document.getElementById('si-matrix-tbody');
  if (!tbody) return;
  const roles = ['高层领导','业务专家','HRBP/TD','高绩效员工'];
  tbody.innerHTML = (data || []).map((row, i) => `
    <tr>
      <td><b>${roles[i] || row.role || `维度${i+1}`}</b></td>
      <td>${row.expect || '—'}</td>
      <td>${row.concern || '—'}</td>
      <td>${row.key || '—'}</td>
    </tr>`).join('');
  if (animate) {
    document.getElementById('si-out-a')?.classList.add('lit');
  }
}

// ── 渲染核心需求类别 ─────────────────────────────────────
function renderSiCategories(data, animate = true) {
  const el = document.getElementById('si-cats-body');
  if (!el || !data?.length) return;
  el.innerHTML = data.map(cat => `
    <div class="si-cat-tag">
      <span class="si-cat-label">${cat.label}</span>
      <span class="si-cat-domain">${cat.domain || ''}</span>
    </div>`).join('');
  if (animate) document.getElementById('si-out-b')?.classList.add('lit');
}

// ── 编辑控制：四层推导 ────────────────────────────────────
function startEditSiLayers() {
  for (let i=0; i<4; i++) {
    const body = document.getElementById(`si-layer-body-${i}`);
    const edit = document.getElementById(`si-layer-edit-${i}`);
    if (body && edit) { edit.value = body.innerText || body.textContent; edit.style.display='block'; body.style.display='none'; }
  }
  toggleSiCtrl('layers', 'edit');
}
function cancelEditSiLayers() {
  for (let i=0; i<4; i++) {
    const body = document.getElementById(`si-layer-body-${i}`);
    const edit = document.getElementById(`si-layer-edit-${i}`);
    if (body && edit) { edit.style.display='none'; body.style.display=''; }
  }
  toggleSiCtrl('layers', 'view');
}
function saveEditSiLayers() {
  const layers = [];
  for (let i=0; i<4; i++) {
    const body = document.getElementById(`si-layer-body-${i}`);
    const edit = document.getElementById(`si-layer-edit-${i}`);
    if (body && edit) { body.textContent = edit.value; edit.style.display='none'; body.style.display=''; }
    layers.push(body?.innerHTML || '');
  }
  const result = loadSiResult() || {};
  result.layers = layers; result.savedAt = Date.now();
  saveSiResult(result);
  toggleSiCtrl('layers', 'saved');
  showToast('四层推导已保存', 'success');
  syncSiToProject();
}

// ── 编辑控制：需求矩阵 ────────────────────────────────────
function startEditSiMatrix() {
  const result = loadSiResult() || {};
  const ta = document.getElementById('si-matrix-edit-area');
  const body = document.getElementById('si-matrix-body');
  if (ta) { ta.value = JSON.stringify(result.matrix||[], null, 2); ta.style.display='block'; }
  if (body) body.style.display='none';
  toggleSiCtrl('matrix', 'edit');
}
function cancelEditSiMatrix() {
  const ta = document.getElementById('si-matrix-edit-area');
  const body = document.getElementById('si-matrix-body');
  if (ta) ta.style.display='none';
  if (body) body.style.display='';
  toggleSiCtrl('matrix', 'view');
}
function saveEditSiMatrix() {
  const ta = document.getElementById('si-matrix-edit-area');
  const body = document.getElementById('si-matrix-body');
  try {
    const data = JSON.parse(ta?.value || '[]');
    renderSiMatrix(data, false);
    const result = loadSiResult() || {};
    result.matrix = data; result.savedAt = Date.now();
    saveSiResult(result);
    if (ta) ta.style.display='none';
    if (body) body.style.display='';
    toggleSiCtrl('matrix', 'saved');
    showToast('需求矩阵已保存', 'success');
    syncSiToProject();
  } catch(e) { showToast('JSON 格式有误，请检查', 'error'); }
}

// ── 编辑控制：核心需求类别 ───────────────────────────────
function startEditSiCats() {
  const result = loadSiResult() || {};
  const ta = document.getElementById('si-cats-edit-area');
  const body = document.getElementById('si-cats-body');
  if (ta) { ta.value = (result.categories||[]).map(c=>`${c.label}${c.domain?'|'+c.domain:''}`).join('\n'); ta.style.display='block'; }
  if (body) body.style.display='none';
  toggleSiCtrl('cats', 'edit');
}
function cancelEditSiCats() {
  const ta = document.getElementById('si-cats-edit-area');
  const body = document.getElementById('si-cats-body');
  if (ta) ta.style.display='none';
  if (body) body.style.display='';
  toggleSiCtrl('cats', 'view');
}
function saveEditSiCats() {
  const ta = document.getElementById('si-cats-edit-area');
  const body = document.getElementById('si-cats-body');
  const lines = (ta?.value||'').split('\n').filter(l=>l.trim());
  const data = lines.map(l => { const parts = l.split('|'); return {label: parts[0].trim(), domain: parts[1]?.trim()||''}; });
  renderSiCategories(data, false);
  const result = loadSiResult() || {};
  result.categories = data; result.savedAt = Date.now();
  saveSiResult(result);
  if (ta) ta.style.display='none';
  if (body) body.style.display='';
  toggleSiCtrl('cats', 'saved');
  showToast('需求类别已保存', 'success');
  syncSiToProject();
}

// ── 编辑控制：需求要素与本质 ─────────────────────────────
function startEditSiEssence() {
  const body = document.getElementById('si-essence-body');
  const ta = document.getElementById('si-essence-edit-area');
  if (ta && body) { ta.value = body.innerText || body.textContent; ta.style.display='block'; body.style.display='none'; }
  toggleSiCtrl('essence', 'edit');
}
function cancelEditSiEssence() {
  const body = document.getElementById('si-essence-body');
  const ta = document.getElementById('si-essence-edit-area');
  if (ta) ta.style.display='none';
  if (body) body.style.display='';
  toggleSiCtrl('essence', 'view');
}
function saveEditSiEssence() {
  const body = document.getElementById('si-essence-body');
  const ta = document.getElementById('si-essence-edit-area');
  if (body && ta) { body.textContent = ta.value; ta.style.display='none'; body.style.display=''; }
  const result = loadSiResult() || {};
  result.essence = body?.innerHTML; result.savedAt = Date.now();
  saveSiResult(result);
  toggleSiCtrl('essence', 'saved');
  showToast('需求本质报告已保存', 'success');
  syncSiToProject();
}

// ── 辅助：切换编辑控制条状态 ─────────────────────────────
function toggleSiCtrl(block, state) {
  const hint   = document.getElementById(`si-${block}-hint`);
  const cancel = document.getElementById(`si-${block}-cancel`);
  const save   = document.getElementById(`si-${block}-save`);
  const edit   = document.getElementById(`si-${block}-edit`);
  if (!hint) return;
  if (state === 'edit') {
    if (hint) hint.style.display='none';
    if (cancel) cancel.style.display='inline-flex';
    if (save)   save.style.display='inline-flex';
    if (edit)   edit.style.display='none';
  } else if (state === 'saved') {
    if (hint) { hint.style.display='inline-flex'; hint.textContent='✓ 已保存'; hint.style.opacity='1'; setTimeout(()=>{hint.style.opacity='0';},2500); }
    if (cancel) cancel.style.display='none';
    if (save)   save.style.display='none';
    if (edit)   edit.style.display='inline-flex';
  } else {
    if (hint) hint.style.display='none';
    if (cancel) cancel.style.display='none';
    if (save)   save.style.display='none';
    if (edit)   edit.style.display='inline-flex';
  }
}

// ── 将调研洞察产出同步写入 project.surveyInsight ─────────
function syncSiToProject() {
  if (!currentId) return;
  const result = loadSiResult();
  if (!result) return;
  const idx = projects.findIndex(p => p.id === currentId);
  if (idx < 0) return;
  projects[idx].surveyInsight = result;
  projects[idx].updatedAt = Date.now();
  saveProjects(projects);
}

// ── 下载调研洞察报告 ─────────────────────────────────────
function downloadSurveyInsightReport() {
  const result = loadSiResult();
  if (!result || (!result.layers && !result.matrix)) {
    showToast('请先启动 AI 洞察分析并保存产出', 'error'); return;
  }
  const p = projects.find(x => x.id === currentId);
  const title = p?.name || '项目';
  const layerNames = ['现象和事实','共性和规律','结构要素和驱动力','价值、文化和信念'];
  let md = `# ${title} · 调研洞察报告\n\n_生成时间：${new Date().toLocaleString('zh-CN')}_\n\n---\n\n`;
  md += `## 一、四层推导洞察\n\n`;
  (result.layers||[]).forEach((t,i)=>{
    const clean = t.replace(/<[^>]+>/g,'');
    md += `### L${i+1} ${layerNames[i]}\n${clean}\n\n`;
  });
  md += `## 二、各层级需求矩阵\n\n| 维度 | 核心期待 | 主要担心 | 关键输入要点 |\n|---|---|---|---|\n`;
  const roles = ['高层领导','业务专家','HRBP/TD','高绩效员工'];
  (result.matrix||[]).forEach((row,i)=>{
    md += `| ${roles[i]||row.role||''} | ${row.expect||''} | ${row.concern||''} | ${row.key||''} |\n`;
  });
  md += `\n## 三、核心需求类别\n\n`;
  (result.categories||[]).forEach(c => { md += `- **${c.label}**${c.domain?'（'+c.domain+'）':''}\n`; });
  md += `\n## 四、核心赋能命题\n\n${(result.essence||'').replace(/<[^>]+>/g,'')}\n`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title}_调研洞察报告_${new Date().toISOString().slice(0,10)}.md`;
  a.click();
  showToast('报告已下载', 'success');
}

// ── AI 核心：调研洞察分析 ────────────────────────────────
async function runSurveyInsightAI() {
  const senior = document.getElementById('si-senior')?.value?.trim();
  const expert = document.getElementById('si-expert')?.value?.trim();
  const hrbp   = document.getElementById('si-hrbp')?.value?.trim();
  const hiper  = document.getElementById('si-hiper')?.value?.trim();

  if (!senior && !expert && !hrbp && !hiper) {
    alert('请至少填写一个维度的调研内容后再启动洞察分析。'); return;
  }
  saveSiData({ senior, expert, hrbp, hiper });

  const btn = document.getElementById('si-run-btn');
  btn.classList.add('running'); btn.disabled = true;

  const progressBar = document.getElementById('si-progress');
  const fill = document.getElementById('si-fill');
  const progressText = document.getElementById('si-progress-text');
  progressBar.classList.add('visible');

  let pct = 0;
  const setProgress = (p, txt) => {
    pct = p; fill.style.width = p + '%';
    if (txt) progressText.textContent = txt;
  };

  try {
    const aiCfg = loadAI();
    const useAI = aiCfg.enabled && aiCfg.apiKey;

    setProgress(10, 'SS 正在汇总四个维度的原始信息…');
    await sleep(800);
    setProgress(28, 'SS 正在识别跨层级共性规律…');
    await sleep(800);
    setProgress(48, 'SS 正在剖析结构要素与驱动力…');
    await sleep(800);
    setProgress(65, 'SS 正在触达价值文化与信念本质…');

    let layers, matrix, categories, essence;

    // ── 输出质量校验：检测 AI 输出是否真实引用了输入内容 ──────
    function _siQualityCheck(parsed, senior, expert, hrbp, hiper) {
      // 从输入中提取关键实体词（3字以上名词/数字片段）
      const inputText = [senior, expert, hrbp, hiper].join(' ');
      const inputTokens = [...inputText.matchAll(/[\u4e00-\u9fa5a-zA-Z0-9%]{3,}/g)]
        .map(m => m[0]).filter(t => !['的是有在和与了也都被让使该这那其由从到为对但或等中上下以及而已又还可能将要会并'].includes(t));

      // 禁止出现的空话词汇黑名单
      const vacuousPatterns = [
        /战略落地与关键KPI达成/, /培训与业务脱节，投入产出比低/,
        /解决实际业务中的技术难点/, /场景太复杂，通用方案不适用/,
        /可量化的行为改变与能力提升/, /学习转化率低，效果难评估/,
        /最佳实践被认可并系统化传承/, /被占用太多时间，干扰正常工作/,
        /战略落地与关键/, /跨维度分析发现共同规律：高层期待与业务实际执行之间存在认知断层/,
        /本次业务赋能的本质，是在组织「结果导向」/, /本次业务赋能的底层问题是：战略目标与个人行为之间缺乏有效的转化路径/
      ];

      const outputText = JSON.stringify(parsed);

      // 如果输出包含任何黑名单套话，视为质量不合格
      const hasVacuous = vacuousPatterns.some(p => p.test(outputText));
      if (hasVacuous) {
        console.warn('[SurveyInsight] AI output contains vacuous template phrases, downgrading to input-anchored fallback');
        return false;
      }

      // 检查输出是否至少包含3个来自输入的关键词
      if (inputTokens.length > 0) {
        const matchCount = inputTokens.filter(t => outputText.includes(t)).length;
        if (matchCount < Math.min(3, inputTokens.length)) {
          console.warn(`[SurveyInsight] AI output matched only ${matchCount}/${inputTokens.length} input tokens, quality insufficient`);
          return false;
        }
      }

      return true;
    }

    if (useAI) {
      const ins = getProjectInsights();
      const prompt = buildSurveyInsightPrompt(senior, expert, hrbp, hiper, ins);
      setProgress(72, 'SS 正在进行 AI 深度推演…  预计还需 15 秒');
      const raw = await callAI(aiCfg, prompt);
      setProgress(90, 'SS 正在生成结构化产出…');
      await sleep(500);
      try {
        const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
        // 质量校验：若 AI 输出与输入无关则降级
        const qualityOk = _siQualityCheck(parsed, senior, expert, hrbp, hiper);
        layers     = (qualityOk && parsed.layers)     || fallbackSiLayers(senior, expert, hrbp, hiper);
        matrix     = (qualityOk && parsed.matrix)     || fallbackSiMatrix(senior, expert, hrbp, hiper);
        categories = (qualityOk && parsed.categories) || fallbackSiCategories(senior, expert, hrbp, hiper);
        essence    = (qualityOk && parsed.essence)    || fallbackSiEssence(senior, expert, hrbp, hiper);
        if (!qualityOk) {
          showToast('⚠️ AI 输出质量不足（与输入脱节），已使用输入锚定模式', 'warning');
        }
      } catch(e) {
        layers     = fallbackSiLayers(senior, expert, hrbp, hiper);
        matrix     = fallbackSiMatrix(senior, expert, hrbp, hiper);
        categories = fallbackSiCategories(senior, expert, hrbp, hiper);
        essence    = fallbackSiEssence(senior, expert, hrbp, hiper);
      }
    } else {
      layers     = fallbackSiLayers(senior, expert, hrbp, hiper);
      matrix     = fallbackSiMatrix(senior, expert, hrbp, hiper);
      categories = fallbackSiCategories(senior, expert, hrbp, hiper);
      essence    = fallbackSiEssence(senior, expert, hrbp, hiper);
      await sleep(600);
    }

    setProgress(100, '✅ 洞察分析完成！');
    await sleep(500);
    progressBar.classList.remove('visible');

    // 渲染四层推导
    layers.forEach((text, i) => {
      const el = document.getElementById(`si-layer-body-${i}`);
      if (el) el.innerHTML = text;
      const card = document.getElementById(`si-layer-${i}`);
      if (card) card.classList.add('lit');
    });

    // 渲染三项产出
    renderSiMatrix(matrix);
    renderSiCategories(categories);
    const essenceEl = document.getElementById('si-essence-body');
    if (essenceEl) essenceEl.innerHTML = essence;
    document.getElementById('si-out-c')?.classList.add('lit');
    document.getElementById('si-output-section')?.classList.add('lit');

    // 保存
    const result = { layers, matrix, categories, essence, savedAt: Date.now() };
    saveSiResult(result);
    syncSiToProject();

    btn.classList.remove('running'); btn.disabled = false;
    btn.querySelector('.btn-label').textContent = '✓ 重新洞察';
    showToast('调研洞察完成并已自动保存', 'success');

  } catch(err) {
    progressBar.classList.remove('visible');
    btn.classList.remove('running'); btn.disabled = false;
    console.error('SI AI error:', err);
    showToast('分析失败：' + err.message, 'error');
  }
}

// ── AI Prompt ────────────────────────────────────────────
function buildSurveyInsightPrompt(senior, expert, hrbp, hiper, prInsights) {
  // 收集所有来自预先研究的具体优先事项
  const priorities = prInsights?.priorities || [];
  const prGoals = priorities.map((p,i) => `  ${i+1}. ${p.objective || ''} （KPI: ${p.kpi || ''}）`).join('\n') || '  （未提供业务赋能优先目标）';
  const prDims   = prInsights?.dims   || '（未提供）';
  const prWhys   = prInsights?.whys   || '（未提供）';

  return `你是一名企业人才发展与业务赋能专家，擅长将调研原始资料转化为具有因果链条的洞察结论。

## 你的分析任务

基于四个维度的调研原文，完成一次完整的**因果推导分析**。分析分为五层，每一层都是对上一层的**因果解释**，而不是重复或拼接：

- **L1 现象**：从原文中提炼出可观察到的具体表现和行为症状（是什么）
- **L2 共性**：找出跨维度、跨角色普遍出现的规律性问题（不只是某个人的个别现象）
- **L3 结构**：指出造成以上共性问题的组织机制、流程或能力层面的根因（为什么存在）
- **L4 价值与信念**：揭示支撑这些结构问题存在的深层文化假设或信念障碍（为什么难以改变）
- **定义（essence）**：基于以上分析，明确这次业务赋能需要解决的核心命题（要做什么）

---

## 分析范式示例（你必须遵循此逻辑结构）

假设调研中多方提到"员工自主性不够"，正确分析如下：
- **现象**：员工在日常决策中习惯等待上级指令，创新提案极少来自一线员工（引自原文具体表述）
- **共性**：跨部门访谈均反映决策链条长、审批流程繁琐，不同角色都感受到"做事很被动"
- **结构**：组织层级过于复杂，缺乏授权机制——从原文可以判断，员工无法在职责范围内独立拍板
- **价值与信念**：组织文化倾向于控制和审核，管理者默认"不授权=减少风险"，信任文化缺失
- **定义**：本次赋能核心是打破"控制=安全"的管理假设，设计更加自主的工作环境，让员工真实体验"被授权后结果更好"

---

## 质量要求

✅ 每一层必须是对上一层的**推进和解释**，不是并列关系
✅ L1 中必须保留原文中的具体词汇、数字、场景词——这是分析的事实依据
✅ L2 必须跨维度总结（说明哪些角色均有反映），而非单个维度的重复
✅ L3 必须是**归纳出的一个根因命题**，格式："……机制/能力/流程 缺失/不足"——而不是罗列原文片段
✅ L4 必须是**信念障碍或文化假设**（如"控制=安全"、"培训没有用"），不是表层抱怨
✅ essence（定义）必须是**可执行的赋能核心命题**，包含"打破什么假设"和"建立什么新体验"
✅ 需求矩阵的每格必须从对应维度原文中提炼，不可用固定模板
✅ 需求类别必须根据原文实际内容命名，禁止固定使用「战略认同/业务增长/流程协同/能力建设」

❌ 禁止使用与输入无关的套话：「战略落地」「业务脱节」「学习转化率低」「投入产出比」「刻意练习」「突破天花板」「系统性缺失」

---

## 上下文

**业务赋能优先目标（来自任务 1.1.1 预先研究）：**
${prGoals}
三维分析摘要：${prDims}
赋能背景（WHY）：${prWhys}

---

## 四维度调研原文

【高层领导原文】：
${senior || '（未填写）'}

【业务专家原文】：
${expert || '（未填写）'}

【HRBP/TD 原文】：
${hrbp || '（未填写）'}

【高绩效员工原文】：
${hiper || '（未填写）'}

---

## 输出格式（严格 JSON，零多余文字）

{
  "layers": [
    "L1 现象：【一句话总结：从以上原文可以观察到什么具体行为症状或业务表现——保留原文中的具体词汇/数字/场景，但要归纳成一个完整陈述，而不是拼接原文碎片】",
    "L2 共性：【一句话总结：上述现象为什么不是偶然的——哪几个维度/角色均有反映，它们共同指向了什么规律性问题（必须跨维度，指出具体是哪些角色）】",
    "L3 结构要素：【一句话总结：什么组织层面的机制/能力/流程缺失，导致了以上共性问题——用「X 缺失/不足，导致 Y」的因果句式，X 是根因，Y 是 L2 的规律】",
    "L4 价值与文化：【一句话总结：什么深层信念或文化假设，让 L3 的结构问题得以持续存在并难以改变——不是表层抱怨，而是隐含的组织假设，如「控制=安全」「经验不可复制」】"
  ],
  "matrix": [
    {"role":"高层领导","expect":"高层最想通过这次赋能实现什么（15字内，源自原文）","concern":"高层最担心这次赋能出现什么问题（15字内，源自原文）","key":"高层原文中最能代表其诉求的具体表达（20字内，含场景或数字）"},
    {"role":"业务专家","expect":"业务专家期待解决什么具体问题（15字内，源自原文）","concern":"业务专家的主要顾虑是什么（15字内，源自原文）","key":"业务专家原文中最有价值的一个具体描述（20字内）"},
    {"role":"HRBP/TD","expect":"HRBP/TD 最希望看到什么结果（15字内，源自原文）","concern":"HRBP/TD 担心什么阻碍（15字内，源自原文）","key":"HRBP/TD 原文中最关键的数据或判断（20字内）"},
    {"role":"高绩效员工","expect":"高绩效员工希望得到什么支持（15字内，源自原文）","concern":"高绩效员工的主要顾虑（15字内，源自原文）","key":"高绩效员工原文中最有参考价值的观察（20字内）"}
  ],
  "categories": [
    {"label":"从原文实际需求提炼的类型名称（4-6字）","domain":"该类需求对应的最具体业务场景（15字内，非抽象描述）"},
    {"label":"第2类需求名称","domain":"对应场景"},
    {"label":"第3类需求名称","domain":"对应场景"},
    {"label":"第4类需求名称","domain":"对应场景"}
  ],
  "essence": "核心赋能命题（2-3句）：第1句说明这次赋能核心要打破的组织假设或信念障碍（对应 L4）；第2句说明通过赋能要建立的新体验或新行为模式；第3句明确这次项目的核心价值命题——以「[具体业务目标] + 通过 [赋能方式] + 实现 [行为改变]」的句式表达，与预先研究优先目标呼应"
}`;
}

// ── Fallback：离线模板（基于输入语义提取，不允许通用套话）───────────
function _extractSnippet(text, maxLen) {
  if (!text) return null;
  // 优先提取含有数字、百分比、具体名词的句子
  const sentences = text.split(/[。；;！!？?\n]+/).map(s => s.trim()).filter(s => s.length > 4);
  const richSentence = sentences.find(s => /\d+%?|万|亿|倍|场|次|个/.test(s));
  const candidate = richSentence || sentences[0] || '';
  return candidate.length > maxLen ? candidate.slice(0, maxLen) + '……' : candidate;
}

function _extractKeywords(text) {
  if (!text) return [];
  // 提取名词短语：排除停用词，保留2-6字的实体
  const stopWords = /的|是|有|在|和|与|了|也|都|被|让|使|该|这|那|其|由|从|到|为|对|但|或|等|中|上|下|以|及|而|已|又|还|可|能|将|要|会|并/;
  return [...text.matchAll(/[\u4e00-\u9fa5a-zA-Z0-9]{2,8}/g)]
    .map(m => m[0])
    .filter(w => !stopWords.test(w))
    .slice(0, 6);
}

function _detectPainPoints(text) {
  // 从文本中检测具体问题/障碍关键词
  const patterns = [
    { re: /没有|缺乏|缺少|不足|欠缺/, label: '缺乏' },
    { re: /难以|难|困难|不容易/, label: '困难' },
    { re: /不一致|参差|差距|不均/, label: '不均' },
    { re: /脱离|脱节|不匹配|不对齐/, label: '脱节' },
    { re: /低|下降|不达标|不够/, label: '低效' },
    { re: /复杂|繁琐|混乱/, label: '复杂' },
  ];
  return patterns.filter(p => p.re.test(text||'')).map(p => p.label);
}

function fallbackSiLayers(senior, expert, hrbp, hiper) {
  const inputs = [
    { dim: '高层领导', text: senior || '' },
    { dim: '业务专家', text: expert || '' },
    { dim: 'HRBP/TD', text: hrbp   || '' },
    { dim: '高绩效员工', text: hiper || '' },
  ];
  const filled = inputs.filter(i => i.text.length > 5);
  const allText = inputs.map(i => i.text).join(' ');

  // === L1 现象：归纳"能观察到什么症状"，而非拼接原文 ===
  // 从各维度提取最具代表性的表述，然后归纳成一个现象陈述
  let l1 = '';
  if (filled.length === 0) {
    l1 = '（请填写四维度调研内容后运行分析）';
  } else {
    // 找出出现频率最高的业务行为症状
    const symptomCues = [
      { re: /不会|不懂|不知道怎么|没有能力|能力不足/, symptom: '员工在关键场景下能力不足，不知道如何应对' },
      { re: /没人教|靠老带新|靠经验|个人悟性/, symptom: '新员工或普通员工只能靠个人摸索，缺乏系统支撑' },
      { re: /参差不齐|不一致|差距大|有的好有的差/, symptom: '同岗位人员表现差异悬殊，结果难以预期' },
      { re: /推荐.*不准|选品.*错|货品.*问题|卖不动/, symptom: '业务关键动作（如推荐/选品）准确率低，影响直接结果' },
      { re: /流程.*乱|不知道.*步骤|没有.*流程|操作.*混乱/, symptom: '关键工作流程缺乏标准，员工执行依赖主观判断' },
      { re: /没有目标|不知道.*做什么|方向不清|目标不明/, symptom: '员工缺乏清晰的业务目标指引，行动方向模糊' },
    ];
    const matchedSymptoms = symptomCues
      .filter(c => c.re.test(allText))
      .map(c => c.symptom);

    const snippets = filled.map(i => {
      const s = _extractSnippet(i.text, 30);
      return s ? `（${i.dim}：${s}）` : null;
    }).filter(Boolean);

    if (matchedSymptoms.length > 0) {
      l1 = matchedSymptoms[0];
      if (snippets.length > 0) l1 += `——${snippets[0]}`;
    } else {
      // fallback：直接用最具体的一个原文片段描述现象
      const anchor = _extractSnippet(allText, 40);
      l1 = anchor
        ? `调研原文显示：${anchor}，反映出业务执行层面存在具体障碍`
        : `${filled.length}个维度的访谈均反映了不同程度的执行困难，具体现象见各维度输入`;
    }
  }

  // === L2 共性：解释"为什么这是规律而非偶然"——跨维度归纳 ===
  let l2 = '';
  const pains = inputs.map(i => ({ dim: i.dim, pains: _detectPainPoints(i.text) })).filter(i => i.pains.length > 0);
  if (pains.length >= 2) {
    const allPainLabels = pains.flatMap(p => p.pains);
    const freq = {};
    allPainLabels.forEach(p => freq[p] = (freq[p]||0) + 1);
    const topPain = Object.entries(freq).sort((a,b) => b[1]-a[1])[0];
    const affectedDims = pains.filter(p => p.pains.includes(topPain?.[0])).map(p => p.dim);
    if (affectedDims.length >= 2) {
      l2 = `这不是个别人的问题——「${affectedDims.join('」「')}」均反映了"${topPain[0]}"的特征，说明这是组织性的共性障碍，而非个体能力差异。`;
    } else {
      const d1kw = _extractKeywords(filled[0]?.text || '').slice(0,2).join('/') || '执行困难';
      const d2kw = _extractKeywords(filled[1]?.text || '').slice(0,2).join('/') || '能力不足';
      l2 = `「${pains[0].dim}」和「${pains[1].dim}」虽然描述的细节不同，但共同指向同一个组织层面的障碍——分别体现为"${d1kw}"和"${d2kw}"，说明根因在组织机制而非个人。`;
    }
  } else if (filled.length >= 2) {
    l2 = `${filled.map(i=>i.dim).join('、')}等多个视角的描述都指向同一业务执行层面的困难，说明这不是偶发问题，而是系统性障碍。`;
  } else {
    l2 = '（至少需要2个维度的调研内容才能归纳共性规律，请补充其他维度输入）';
  }

  // === L3 结构：解释"什么机制性缺口导致了L2的共性" ===
  let l3 = '';
  // 按照调研内容推断最可能的结构根因
  const structureGaps = [
    { re: /没有.*标准|无.*标准|标准.*不统一|没有规范/, gap: '标准化作业规范缺失', consequence: '导致员工只能依赖个人经验，水平参差不齐' },
    { re: /没有.*机制|机制.*缺|缺.*流程|流程.*不清/, gap: '执行机制与反馈流程缺位', consequence: '导致问题无法被及时识别和纠正' },
    { re: /没人.*教|没有.*辅导|缺少.*支持|单打独斗|只能自己摸索/, gap: '在岗辅导与支持体系缺失', consequence: '导致能力成长依赖个人摸索，效率极低' },
    { re: /培训.*没用|学了.*用不上|理论.*实际|课堂.*脱节/, gap: '学习场景与真实业务情境脱钩', consequence: '导致知识无法转化为业务行为' },
    { re: /经验.*复制|无法.*推广|靠个人|个人悟性|老带新/, gap: '高绩效经验萃取与传播机制空白', consequence: '导致优秀行为无法被系统复制和传承' },
    { re: /目标.*不清|不知道.*为什么|方向.*混乱|不明白.*重要/, gap: '业务目标向个人行动的转化机制缺失', consequence: '导致员工无法将组织目标转化为自身的行动指南' },
  ];

  const matchedGaps = structureGaps.filter(g => g.re.test(allText));
  if (matchedGaps.length > 0) {
    const topGap = matchedGaps[0];
    l3 = `根本原因在于「${topGap.gap}」——${topGap.consequence}。`;
    if (matchedGaps.length > 1) {
      l3 += `同时「${matchedGaps[1].gap}」也加剧了这一问题。`;
    }
  } else {
    // 基于 L2 类型推断结构根因
    const generalSnip = _extractSnippet(expert || senior || hrbp || '', 25);
    l3 = generalSnip
      ? `从原文"${generalSnip}"可以判断，相关能力培养或执行支撑机制存在缺口——具体结构根因建议通过 AI 深度分析进一步确认。`
      : '（请填写更详细的调研内容，以便准确识别结构层面的根因）';
  }

  // === L4 价值与文化：解释"什么信念假设让L3的问题得以持续" ===
  let l4 = '';
  const beliefMap = [
    { re: /不重要|没必要|用不着|不需要培训|又不是不懂/, belief: '"这件事不需要专门培训，做着做着就会了"', challenge: '打破「经验自然习得」的假设，让员工看到系统训练与随机摸索的结果差距' },
    { re: /没时间|太忙|做业务才是正事|培训耽误时间/, belief: '"培训和做业务是互相竞争的，忙的时候业务优先"', challenge: '建立「训练本身就是高质量业务实践」的体验，消除学与用之间的人为割裂' },
    { re: /看不到效果|没有用|学了也没变化|做不到/, belief: '"培训没有用，结果还是靠个人"', challenge: '让参与者在真实业务场景中体验到"训练后行为改变带来可见结果"' },
    { re: /天生的|天赋|悟性|有些人就是厉害/, belief: '"业绩好是天赋和悟性，不是可以教出来的"', challenge: '让员工亲眼看到：高绩效行为是可被识别、萃取和复制的，而非不可解释的天赋' },
    { re: /领导.*不支持|高层.*不重视|没有资源|没有预算/, belief: '"这是 TD 的责任，业务领导不必深度介入赋能"', challenge: '建立业务领导对赋能共识：业务结果与人才赋能是一体的' },
  ];

  const matchedBelief = beliefMap.find(b => b.re.test(allText));
  if (matchedBelief) {
    l4 = `深层障碍是一个隐含假设：${matchedBelief.belief}。这让 L3 的结构缺口得以长期存在。这次赋能需要${matchedBelief.challenge}。`;
  } else {
    // 基于 L3 根因推断信念障碍
    if (/标准化.*缺失|规范.*缺/.test(l3)) {
      l4 = `深层假设是"各凭本事，结果不同是正常的"——组织没有建立"标准化行为创造可预期结果"的文化共识。这次赋能需要让管理者看到：设定行为标准是提升整体产出的最有效杠杆。`;
    } else if (/经验.*传播|萃取.*空白/.test(l3)) {
      l4 = `深层假设是"好的做法不可复制，每个人都得自己悟"——组织没有形成"优秀经验是组织资产"的共识。这次赋能需要打破这一假设，让高绩效员工的行为变成可传播的组织知识。`;
    } else {
      const hiperSnip = _extractSnippet(hiper || '', 20);
      l4 = hiperSnip
        ? `高绩效员工描述的"${hiperSnip}"说明有效方法已经存在，但组织层面缺乏传播的文化动力。这次赋能需要在体验层面打破"这只是个别人的经验"的偏见。`
        : '（建议补充更多维度的调研内容，以准确识别深层的文化假设）';
    }
  }

  return [l1, l2, l3, l4];
}

function fallbackSiMatrix(senior, expert, hrbp, hiper) {
  // 从每个维度原文中提取具体内容，而非使用固定模板
  function extractExpect(text, dimName) {
    if (!text || text.length < 5) return `（${dimName}内容待填写）`;
    // 找期望/目标相关句子
    const expectSentences = text.split(/[。；;！!？?\n]+/).find(s =>
      /希望|期待|目标|要求|需要|想要|应该|应当|必须/.test(s)
    );
    if (expectSentences) return expectSentences.trim().slice(0, 18);
    // fallback：取第一句
    return _extractSnippet(text, 18) || `${dimName}期待待提炼`;
  }
  function extractConcern(text, dimName) {
    if (!text || text.length < 5) return `（${dimName}内容待填写）`;
    const concernSentences = text.split(/[。；;！!？?\n]+/).find(s =>
      /担心|顾虑|担忧|怕|害怕|风险|问题|困难|挑战|但是|不过|然而/.test(s)
    );
    if (concernSentences) return concernSentences.trim().slice(0, 18);
    const pains = _detectPainPoints(text);
    if (pains.length > 0) return `${pains[0]}的实际障碍`;
    return _extractSnippet(text, 18) || `${dimName}顾虑待提炼`;
  }
  return [
    {
      role: '高层领导',
      expect: extractExpect(senior, '高层领导'),
      concern: extractConcern(senior, '高层领导'),
      key: _extractSnippet(senior, 28) || '（未填写）'
    },
    {
      role: '业务专家',
      expect: extractExpect(expert, '业务专家'),
      concern: extractConcern(expert, '业务专家'),
      key: _extractSnippet(expert, 28) || '（未填写）'
    },
    {
      role: 'HRBP/TD',
      expect: extractExpect(hrbp, 'HRBP/TD'),
      concern: extractConcern(hrbp, 'HRBP/TD'),
      key: _extractSnippet(hrbp, 28) || '（未填写）'
    },
    {
      role: '高绩效员工',
      expect: extractExpect(hiper, '高绩效员工'),
      concern: extractConcern(hiper, '高绩效员工'),
      key: _extractSnippet(hiper, 28) || '（未填写）'
    }
  ];
}

function fallbackSiCategories(senior, expert, hrbp, hiper) {
  const all = [senior, expert, hrbp, hiper].join(' ');
  // 基于原文检测实际需求类型
  const cats = [];
  // 策略/目标类
  if (/战略|目标|转型|变革|方向|对齐|布局/.test(all)) {
    const kw = _extractKeywords(all.match(/[\u4e00-\u9fa5]{2,10}(?:战略|目标|转型|变革)/g)?.[0] || all).slice(0,2).join('');
    cats.push({ label: kw ? `${kw}落地类` : '战略目标落地类', domain: _extractSnippet(senior||expert, 15) || '战略目标达成与对齐' });
  }
  // 技能/能力类
  if (/能力|技能|方法|工具|技巧|掌握|学会|不会|差距/.test(all)) {
    const sceneSentence = [expert, hiper].join(' ').split(/[。；;！!？?\n]+/).find(s => /能力|技能|差距/.test(s));
    cats.push({ label: '核心能力提升类', domain: sceneSentence ? sceneSentence.trim().slice(0, 15) : '岗位核心技能补差' });
  }
  // 场景/实操类
  if (/场景|案例|实战|演练|练习|模拟|操作|实际|真实/.test(all)) {
    cats.push({ label: '场景化实战类', domain: _extractSnippet(expert||hiper, 15) || '真实业务场景演练' });
  }
  // 经验/知识沉淀类
  if (/经验|总结|复制|传承|萃取|知识|沉淀|标准化/.test(all)) {
    cats.push({ label: '经验萃取传播类', domain: _extractSnippet(hiper||expert, 15) || '高绩效经验复制推广' });
  }
  // 协同/机制类
  if (/协作|机制|流程|沟通|配合|跨部门|协同/.test(all)) {
    cats.push({ label: '协同机制优化类', domain: _extractSnippet(hrbp||expert, 15) || '跨角色协作机制建设' });
  }
  // 如果检测到少于4个，补充通用兜底
  const defaultFallbacks = [
    { label: '综合能力建设类', domain: '覆盖输入中识别的主要差距' }
  ];
  while (cats.length < 4) cats.push(defaultFallbacks[0]);
  return cats.slice(0, 4);
}

function fallbackSiEssence(senior, expert, hrbp, hiper) {
  const allText = [senior, expert, hrbp, hiper].filter(Boolean).join(' ');

  if (!allText || allText.trim().length < 10) {
    return '（请填写四维度调研内容后重新运行分析，以获得基于真实输入的赋能核心命题。）';
  }

  // ── 第1句：打破什么假设（对应 L4 信念障碍）──
  let breakBelief = '';
  if (/不重要|没必要|用不着|做着做着就会/.test(allText)) {
    breakBelief = '打破"做着做着就会了"的自然习得假设';
  } else if (/没时间|太忙|培训耽误时间|正事/.test(allText)) {
    breakBelief = '打破"培训与业务相互竞争"的时间认知偏见';
  } else if (/看不到效果|没用|靠个人天赋|悟性/.test(allText)) {
    breakBelief = '打破"业绩好坏靠个人悟性，无法系统培养"的归因假设';
  } else if (/老带新|个人经验|不可复制/.test(allText)) {
    breakBelief = '打破"优秀经验只属于个人，无法系统化传播"的隐性信念';
  } else {
    // 从 L3 推导：缺什么就打破什么的反面假设
    if (/标准|规范/.test(allText)) {
      breakBelief = '打破"各凭本事是正常的，标准化行为不可能实现"的惯性认知';
    } else {
      breakBelief = '打破现有组织内对业务赋能效果的惯性质疑';
    }
  }

  // ── 第2句：建立什么新体验（L3 根因的反面）──
  let buildExperience = '';
  if (/标准化.*缺失|规范.*缺|没有.*标准/.test(allText)) {
    buildExperience = '让员工在真实场景模拟中体验到"标准行为→可预期结果"的直接关联';
  } else if (/经验.*传播|萃取|复制/.test(allText)) {
    buildExperience = '让高绩效行为在组织内被看见、被理解、被系统化复制';
  } else if (/培训.*脱离|学.*无法用|场景.*脱节/.test(allText)) {
    buildExperience = '让学习直接发生在业务情境中，让"练习本身就是高质量的业务实践"';
  } else if (/不会|不知道怎么|没人教/.test(allText)) {
    buildExperience = '为员工建立在真实工作场景中练习关键技能的机会，并配套即时反馈';
  } else {
    const anchor = _extractSnippet(allText, 20);
    buildExperience = anchor
      ? `围绕"${anchor}"等真实业务挑战，设计可以产生行为改变的学习体验`
      : '为员工创造在真实业务情境中产生有意义改变的学习体验';
  }

  // ── 第3句：核心赋能命题（与预先研究目标呼应）──
  // 提取关键业务动词/目标词
  const businessGoals = [];
  if (/推荐|选品|货品|销售/.test(allText)) businessGoals.push('提升推荐准确率与客户转化');
  if (/签约|客户开发|成交|获客/.test(allText)) businessGoals.push('提升客户开发与签约能力');
  if (/服务|满意度|体验|投诉/.test(allText)) businessGoals.push('提升客户服务质量与满意度');
  if (/管理|带团队|梯队|传帮带/.test(allText)) businessGoals.push('提升管理者在岗辅导与梯队培养能力');
  if (/数据|分析|决策|判断/.test(allText)) businessGoals.push('提升数据驱动决策的能力');

  const businessGoal = businessGoals[0] || '实现具体业务目标';
  const coreProposition = `核心赋能命题：以真实业务场景为训练载体，通过「${businessGoal}」的系统练习，将分散的个人经验转化为可复制的组织能力，打通学习与业务结果之间的转化断层。`;

  return `这次赋能项目的关键是：${breakBelief}。${buildExperience}。${coreProposition}`;
}

// ── 供后继任务 1.1.3 调用的接口 ──────────────────────────
function getSurveyInsightResult(projId) {
  const id = projId || currentId;
  if (!id) return null;
  const p = projects.find(x => x.id === id);
  return p?.surveyInsight || null;
}

// ════════════════════════════════════════════
// 预先研究：洞察数据访问（供后继任务调用）
// ════════════════════════════════════════════
function getProjectInsights(projId) {
  const id = projId || currentId;
  if (!id) return null;
  const p = projects.find(x => x.id === id);
  return p?.insights || null;
}

// ────────────────────────────────────────────
// 预先研究 AI 分析核心
// ────────────────────────────────────────────
async function runPreResearchAI() {
  const industry = document.getElementById('pr-industry')?.value?.trim();
  const goal     = document.getElementById('pr-goal')?.value?.trim();
  const expect_  = document.getElementById('pr-expect')?.value?.trim();
  const concern  = document.getElementById('pr-concern')?.value?.trim();

  if (!industry && !goal) {
    alert('请至少填写「行业 & 公司」和「业务战略目标」后再启动分析。');
    return;
  }

  // 保存用户输入
  localStorage.setItem('rh_pr_data_v1', JSON.stringify({ industry, goal, expect: expect_, concern }));
  // 实时刷新项目标题
  const companyRaw2 = industry.split(/[·\-\/，,]+/).pop().trim();
  const titleEl = document.getElementById('proj-title');
  if (titleEl && companyRaw2) {
    titleEl.innerHTML =
      `<span style="color:var(--red-400);font-weight:900">${esc(companyRaw2)}</span>` +
      `<span style="color:var(--slate-500);font-weight:500;font-size:15px;margin-left:8px">定制场景化业务赋能训战项目</span>`;
  }

  const btn = document.getElementById('pr-run-btn');
  btn.classList.add('running');
  btn.disabled = true;

  // 显示进度条
  const progressBar = document.getElementById('pr-progress');
  const fill = document.getElementById('pr-fill');
  const progressText = document.getElementById('pr-progress-text');
  progressBar.classList.add('visible');

  // 进度动画工具
  let pct = 0;
  const setProgress = (p, txt) => {
    pct = p; fill.style.width = p + '%';
    if (txt) progressText.textContent = txt;
  };

  try {
    const aiCfg = loadAI();
    const useAI = aiCfg.enabled && aiCfg.apiKey;

    setProgress(8, 'SS 正在调取内部战略数据与经营现状…  预计需要 20 秒');
    await sleep(900);
    setProgress(22, 'SS 正在扫描外部行业趋势与竞争格局…');
    await sleep(900);
    setProgress(38, 'SS 正在比对人才绩效现状与行业对标…');

    let dims, whys, priorities;

    if (useAI) {
      // ─── 真实 AI 调用 ─────────────────────────────
      const prompt = buildPreResearchPrompt(industry, goal, expect_, concern);
      setProgress(50, 'SS 正在进行 AI 语义推演与综合分析…  预计还需 10 秒');
      const raw = await callAI(aiCfg, prompt);
      setProgress(82, 'SS 正在生成洞察报告与优先排序…');
      await sleep(600);
      try {
        const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
        dims       = parsed.dims       || fallbackDims(industry, goal);
        whys       = parsed.whys       || fallbackWhys(industry, goal, expect_, concern);
        priorities = parsed.priorities || fallbackPriorities(industry, goal, dims, whys);
      } catch(e) {
        dims       = fallbackDims(industry, goal);
        whys       = fallbackWhys(industry, goal, expect_, concern);
        priorities = fallbackPriorities(industry, goal, dims, whys);
      }
    } else {
      // ─── 模板降级 ──────────────────────────────────
      setProgress(55, 'SS 基于模板引擎进行结构化推演…（未配置 AI）');
      await sleep(1200);
      setProgress(78, 'SS 正在生成洞察报告…');
      await sleep(600);
      dims       = fallbackDims(industry, goal);
      whys       = fallbackWhys(industry, goal, expect_, concern);
      priorities = fallbackPriorities(industry, goal, dims, whys);
    }

    setProgress(100, '分析完成！');
    await sleep(500);

    // ─── 渲染三维分析 ──────────────────────────────
    dims.forEach((text, i) => {
      document.getElementById(`pr-dim-body-${i}`).innerHTML = text;
      document.getElementById(`pr-dim-${i}`).classList.add('lit');
    });

    await sleep(300);

    // ─── 渲染 3 WHYs ───────────────────────────────
    whys.forEach((text, i) => {
      document.getElementById(`pr-why-a-${i}`).innerHTML = text;
      document.getElementById(`pr-why-${i}`).classList.add('lit');
    });

    await sleep(400);

    // ─── 渲染优先排序表 ────────────────────────────
    renderPriorityTable(priorities, false);

    document.getElementById('pr-output-section').classList.add('lit');

    // ─── 保存完整结果（localStorage + project.insights）──
    const insightsPayload = { dims, whys, priorities,
      input: { industry, goal, expect: expect_, concern },
      savedAt: Date.now() };
    localStorage.setItem('rh_pr_result_v1', JSON.stringify(insightsPayload));
    // 同步写入当前项目
    if (currentId) {
      const idx = projects.findIndex(p => p.id === currentId);
      if (idx >= 0) {
        projects[idx].insights = insightsPayload;
        projects[idx].updatedAt = Date.now();
        saveProjects(projects);
      }
    }

    progressBar.classList.remove('visible');

  } catch(err) {
    console.error(err);
    setProgress(100, '⚠ 分析出错，已切换至模板引擎');
    await sleep(1000);
    progressBar.classList.remove('visible');
  } finally {
    btn.classList.remove('running');
    btn.disabled = false;
    btn.querySelector('.btn-label').textContent = '✓ 重新分析';
  }
}

// ────────────────────────────────────────────
// AI prompt 构建
// ────────────────────────────────────────────
function buildPreResearchPrompt(industry, goal, expect_, concern) {
  return `你是企业人才发展与业务赋能专家（SS 方法论顾问）。
请基于以下信息，以 JSON 格式输出"预先研究"分析报告，字数适中，语言专业精炼，中文。

【用户输入】
- 行业/公司：${industry}
- 业务战略目标：${goal}
- 高层期待：${expect_ || '未填写'}
- 核心担忧：${concern || '未填写'}

【输出格式】（严格 JSON，不要额外说明）
{
  "dims": [
    "内部研究：……（2-3句，聚焦战略与经营现状，结合业务战略目标与高层期待）",
    "外部研究：……（2-3句，聚焦行业趋势与竞争环境，结合行业特点）",
    "人才研究：……（2-3句，必须明确指出目标群体在哪2-3项具体能力上存在差距，结合核心担忧，差距描述要具体，不要泛泛而谈）"
  ],
  "whys": [
    "WHY1：……（1-2句，说明为什么是这些人，必须关联「${goal}」目标的达成路径，点明这群人处于价值链的哪个关键节点）",
    "WHY2：……（1-2句，必须直接引用 dims 人才研究中识别的2-3个具体能力差距，说明这些差距为什么是赋能主题的核心，语言要精准，禁止用'能力不足'等宽泛表述）",
    "WHY3：……（1-2句，说明为什么现在是最佳时机，必须关联核心担忧「${concern || '组织能力与业务脱节'}」，指出当前窗口期的具体表现）"
  ],
  "priorities": [
    严格规则：每条优先排序目标必须从上方 dims 和 whys 中直接提炼，以「${goal}」为北极星，目标描述必须具体（含动词+场景+预期结果），15-25字，KPI 必须可量化，按业务影响力由高到低排序，禁止出现「提升能力」「加强学习」等空洞表述。
    { "objective": "第1优先：直接对应 WHY2 核心差距的赋能目标，必须含具体行为动词", "kpi": ["关联 dims/whys 的可量化业务指标", "行为层面可观察指标"] },
    { "objective": "第2优先：人才研究中绩效差距最显著的能力培育目标", "kpi": ["可量化指标", "可观察指标"] },
    { "objective": "第3优先：支撑「${goal}」达成的次级关键能力", "kpi": ["可量化指标"] },
    { "objective": "第4优先：协同配套的跨职能或流程能力", "kpi": ["可量化指标"] },
    { "objective": "第5优先：长效机制建立与知识体系沉淀", "kpi": ["可量化指标"] }
  ]
}`;
}

// ────────────────────────────────────────────
// 优先排序表渲染（viewMode=true 显示只读，false 显示编辑态）
// ────────────────────────────────────────────
function renderPriorityTable(priorities, editMode) {
  const tbody = document.getElementById('pr-table-body');
  const rankClasses = ['r1','r2','r3','r4','r5'];
  if (editMode) {
    tbody.innerHTML = priorities.map((row, i) => `
      <tr data-idx="${i}">
        <td style="text-align:center"><span class="pr-rank ${rankClasses[i]||'r5'}">${i+1}</span></td>
        <td><input class="pr-row-edit" id="prio-obj-${i}" value="${esc(row.objective)}" placeholder="赋能目标描述" /></td>
        <td><input class="pr-row-edit" id="prio-kpi-${i}" value="${esc(row.kpi.join(', '))}" placeholder="KPI1, KPI2…" /></td>
      </tr>`).join('');
  } else {
    tbody.innerHTML = priorities.map((row, i) => `
      <tr>
        <td style="text-align:center"><span class="pr-rank ${rankClasses[i]||'r5'}">${i+1}</span></td>
        <td>${esc(row.objective)}</td>
        <td>${row.kpi.map(k=>`<span class="pr-kpi-tag">${esc(k)}</span>`).join('')}</td>
      </tr>`).join('');
  }
}

// ────────────────────────────────────────────
// 区块编辑：三维分析
// ────────────────────────────────────────────
let _dimsBak = [];
function startEditDims() {
  const result = loadPrResult();
  _dimsBak = result.dims ? [...result.dims] : [];
  [0,1,2].forEach(i => {
    const body = document.getElementById(`pr-dim-body-${i}`);
    const area  = document.getElementById(`pr-dim-edit-${i}`);
    // 把 HTML 内容去标签后填入 textarea
    area.value = (body.innerHTML || '').replace(/<[^>]+>/g, '');
    document.getElementById(`pr-dim-${i}`).classList.add('editing');
  });
  document.getElementById('dims-edit-btn').style.display   = 'none';
  document.getElementById('dims-save-btn').style.display   = 'inline-flex';
  document.getElementById('dims-cancel-btn').style.display = 'inline-flex';
}
function saveEditDims() {
  const dims = [0,1,2].map(i => document.getElementById(`pr-dim-edit-${i}`).value.trim());
  dims.forEach((text, i) => {
    document.getElementById(`pr-dim-body-${i}`).innerHTML = text;
    document.getElementById(`pr-dim-${i}`).classList.remove('editing');
  });
  // 更新存储
  const result = loadPrResult();
  result.dims = dims; result.savedAt = Date.now();
  savePrResult(result);
  document.getElementById('dims-edit-btn').style.display   = 'inline-flex';
  document.getElementById('dims-save-btn').style.display   = 'none';
  document.getElementById('dims-cancel-btn').style.display = 'none';
  flashHint('dims-saved-hint');
}
function cancelEditDims() {
  [0,1,2].forEach(i => {
    document.getElementById(`pr-dim-${i}`).classList.remove('editing');
  });
  document.getElementById('dims-edit-btn').style.display   = 'inline-flex';
  document.getElementById('dims-save-btn').style.display   = 'none';
  document.getElementById('dims-cancel-btn').style.display = 'none';
}

// ────────────────────────────────────────────
// 区块编辑：3 WHYs
// ────────────────────────────────────────────
function startEditWhys() {
  [0,1,2].forEach(i => {
    const a    = document.getElementById(`pr-why-a-${i}`);
    const area = document.getElementById(`pr-why-edit-${i}`);
    area.value = (a.innerHTML || '').replace(/<[^>]+>/g, '');
    document.getElementById(`pr-why-${i}`).classList.add('editing');
  });
  document.getElementById('whys-edit-btn').style.display   = 'none';
  document.getElementById('whys-save-btn').style.display   = 'inline-flex';
  document.getElementById('whys-cancel-btn').style.display = 'inline-flex';
}
function saveEditWhys() {
  const whys = [0,1,2].map(i => document.getElementById(`pr-why-edit-${i}`).value.trim());
  whys.forEach((text, i) => {
    document.getElementById(`pr-why-a-${i}`).innerHTML = text;
    document.getElementById(`pr-why-${i}`).classList.remove('editing');
  });
  const result = loadPrResult();
  result.whys = whys; result.savedAt = Date.now();
  savePrResult(result);
  document.getElementById('whys-edit-btn').style.display   = 'inline-flex';
  document.getElementById('whys-save-btn').style.display   = 'none';
  document.getElementById('whys-cancel-btn').style.display = 'none';
  flashHint('whys-saved-hint');
}
function cancelEditWhys() {
  [0,1,2].forEach(i => document.getElementById(`pr-why-${i}`).classList.remove('editing'));
  document.getElementById('whys-edit-btn').style.display   = 'inline-flex';
  document.getElementById('whys-save-btn').style.display   = 'none';
  document.getElementById('whys-cancel-btn').style.display = 'none';
}

// ────────────────────────────────────────────
// 区块编辑：优先排序
// ────────────────────────────────────────────
let _prioBak = [];
function startEditPrio() {
  const result = loadPrResult();
  _prioBak = result.priorities ? JSON.parse(JSON.stringify(result.priorities)) : [];
  renderPriorityTable(result.priorities || [], true);
  document.getElementById('prio-edit-btn').style.display   = 'none';
  document.getElementById('prio-save-btn').style.display   = 'inline-flex';
  document.getElementById('prio-cancel-btn').style.display = 'inline-flex';
}
function saveEditPrio() {
  const result = loadPrResult();
  const count = (result.priorities || []).length;
  const priorities = Array.from({length: count}, (_, i) => ({
    objective: (document.getElementById(`prio-obj-${i}`)?.value || '').trim(),
    kpi: (document.getElementById(`prio-kpi-${i}`)?.value || '').split(/[,，]+/).map(s=>s.trim()).filter(Boolean)
  }));
  result.priorities = priorities; result.savedAt = Date.now();
  savePrResult(result);
  renderPriorityTable(priorities, false);
  document.getElementById('prio-edit-btn').style.display   = 'inline-flex';
  document.getElementById('prio-save-btn').style.display   = 'none';
  document.getElementById('prio-cancel-btn').style.display = 'none';
  flashHint('prio-saved-hint');
}
function cancelEditPrio() {
  const result = loadPrResult();
  renderPriorityTable(result.priorities || [], false);
  document.getElementById('prio-edit-btn').style.display   = 'inline-flex';
  document.getElementById('prio-save-btn').style.display   = 'none';
  document.getElementById('prio-cancel-btn').style.display = 'none';
}

// ────────────────────────────────────────────
// 存储辅助（优先从 project.insights，再 fallback localStorage）
// ────────────────────────────────────────────
function loadPrResult() {
  if (currentId) {
    const p = projects.find(x => x.id === currentId);
    if (p?.insights) return JSON.parse(JSON.stringify(p.insights));
  }
  try { return JSON.parse(localStorage.getItem('rh_pr_result_v1') || '{}'); }
  catch { return {}; }
}
function savePrResult(result) {
  localStorage.setItem('rh_pr_result_v1', JSON.stringify(result));
  if (currentId) {
    const idx = projects.findIndex(p => p.id === currentId);
    if (idx >= 0) {
      projects[idx].insights = result;
      projects[idx].updatedAt = Date.now();
      saveProjects(projects);
    }
  }
}
function flashHint(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// ────────────────────────────────────────────
// 模板降级引擎
// ────────────────────────────────────────────
function fallbackDims(industry, goal) {
  const ind = industry || '该行业';
  const g   = goal     || '战略目标';
  return [
    `<b>内部研究：</b>针对「${ind}」的战略方向，当前组织正面临从职能驱动向经营驱动的转型，业务目标「${g}」的达成需要关键岗位人员具备更强的经营意识与跨职能协作能力。`,
    `<b>外部研究：</b>行业竞争加剧，头部企业正加速构建以数字化与服务质量为核心的差异化壁垒；人才赋能已成为获取竞争优势的核心杠杆，而非传统培训项目的补充。`,
    `<b>人才研究：</b>目标群体在专业知识方面有一定积累，但在战略转化、客户经营与场景化决策能力上存在显著差距，现有绩效表现呈现明显的个体差异，头部与尾部人员能力差距较大。`
  ];
}
function fallbackWhys(industry, goal, expect_, concern) {
  const ind = industry || '该行业';
  const g   = goal     || '战略目标';
  const ex  = expect_  || '看到组织能力提升';
  const con = concern  || '能力建设与业务脱节';
  return [
    `聚焦直接承接「${g}」的关键岗位群体——他们处于业务价值链的核心节点，其行为改变对目标达成具有最高杠杆效应。高层期待"${ex.slice(0,30)}"的实现路径，必须从这群人的行为转变出发。`,
    `当前${ind}竞争格局下，"${g}"的核心障碍并非资源不足，而是关键人员的经营意识、场景决策与客户价值创造能力的缺失。赋能主题需直指这一行为能力缺口。`,
    `高层担忧"${con.slice(0,30)}"正在窗口期内积累风险。当前是组织注意力高度聚焦战略目标的关键时间节点，此时启动赋能项目，最易获得资源支持与学员投入，转化效率最高。`
  ];
}
function fallbackPriorities(industry, goal, dims, whys) {
  /* ──────────────────────────────────────────────────────────────
   * 策略：先从 dims（三维分析）和 whys（3WHYs）文本中提取
   * 具体的差距关键词，再以业务战略目标为锚，
   * 生成 5 条高度对应的赋能目标+KPI。
   * ────────────────────────────────────────────────────────────── */
  const g   = (goal || '战略目标').trim();
  const gShort = g.slice(0, 22);

  // 清洗文本
  const clean = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const dimInternal = clean(dims?.[0] || '');
  const dimExternal = clean(dims?.[1] || '');
  const dimTalent   = clean(dims?.[2] || '');
  const why1 = clean(whys?.[0] || '');
  const why2 = clean(whys?.[1] || '');
  const why3 = clean(whys?.[2] || '');
  const allText = [dimInternal, dimExternal, dimTalent, why1, why2, why3].join(' ');

  /* ── 语义特征检测 ── */
  const has = pattern => pattern.test(allText);
  // 业务方向
  const isGrowth   = has(/增长|提升|扩大|签约|新客|营收|业绩|销售/);
  const isCustomer = has(/客户|服务|满意|体验|NPS|增值|关系/);
  const isCost     = has(/降本|成本|效率|优化|减少|浪费|资源/);
  const isTech     = has(/数字|智能|数据|系统|技术|平台|AI/);
  const isLead     = has(/管理|领导|梯队|团队|培育|人才|教练/);
  const isProc     = has(/流程|标准|规范|合规|SOP|操作|制度/);
  const isInno     = has(/创新|转型|变革|探索|新模式|突破/);
  // 能力差距关键词（来自 dimTalent + why2）
  const gapText = [dimTalent, why2].join(' ');
  const hasGap = pattern => pattern.test(gapText);
  const gapLead    = hasGap(/经营意识|管理|决策|领导|跨层|目标承接/);
  const gapScene   = hasGap(/场景|实战|应用|落地|行为转化|执行/);
  const gapComm    = hasGap(/沟通|表达|协作|跨部门|对齐|说服/);
  const gapData    = hasGap(/数据|分析|复盘|量化|可视化|指标/);
  const gapCust    = hasGap(/客户|服务|体验|增值|续签|留存/);

  /* ── 从 WHY2 中提取核心能力差距短语 ── */
  // 尝试提取 why2 中「能力差距」的核心描述（取第一个关键动词短语）
  const coreCapGap = (() => {
    const m = why2.match(/([^，。,]{4,16}(?:能力|意识|技能|水平|差距|不足|缺失)[^，。,]{0,10})/);
    return m ? m[1].trim() : `直接对标「${gShort}」的关键能力`;
  })();

  /* ── 从 dimTalent 提取绩效差距短语 ── */
  const perfGap = (() => {
    const m = dimTalent.match(/([^，。,]{4,18}(?:差距|不足|缺乏|薄弱|不均|偏低|不足)[^，。,]{0,8})/);
    return m ? m[1].trim() : `关键绩效差距弥合`;
  })();

  /* ── 动态生成目标池（按相关性打分排序） ── */
  const pool = [
    // P1：永远第一——核心能力差距，直接对应 WHY2 + 业务目标
    {
      score: 100,
      obj: `${coreCapGap}，直接驱动「${gShort}」达成`,
      kpi: [
        isGrowth ? '业务目标达成率' : isCustomer ? '客户满意度提升幅度' : '核心指标达成率',
        `关键行为转化率`
      ]
    },
    // P2：从 dimTalent 提取的绩效差距
    {
      score: 90,
      obj: `${perfGap}——缩小高绩效与平均绩效的能力差距`,
      kpi: ['头尾部绩效差距缩小率', '高绩效行为复制率']
    },
    // P3：依据业务目标类型动态选择
    {
      score: isGrowth ? 85 : isCustomer ? 85 : 70,
      obj: isGrowth   ? `客户价值挖掘与${isCustomer?'增值服务':'商机识别'}能力` :
           isCustomer ? `客户关系深耕与高价值场景经营能力` :
           isCost     ? `流程优化与资源高效配置决策能力` :
           `业务场景化问题诊断与应对能力`,
      kpi: isGrowth   ? ['增值场景转化率', '客户签约贡献额'] :
           isCustomer ? ['NPS净推荐值', '客户留存率'] :
           isCost     ? ['资源利用率提升', '关键流程缩短率'] :
           ['场景问题解决率', '方案质量评分']
    },
    // P4：从 why1（受众特征）和 why3（时机）提取的战略承接
    {
      score: 80,
      obj: `跨层级目标承接与一线行动转化——${why3.slice(0,18)}`,
      kpi: ['目标层层对齐率', '一线行动计划完成率']
    },
    // P5：长效机制
    {
      score: isTech ? 75 : isLead ? 78 : 65,
      obj: isTech ? `数据驱动复盘与智能化工具赋能` :
           isLead  ? `管理者教练文化与人才加速培育机制` :
           isProc  ? `标准化操作与合规风险防控能力` :
           isInno  ? `创新思维与业务转型应变能力` :
           `经验沉淀与可复制最佳实践体系建设`,
      kpi: isTech ? ['数字工具使用率', '数据驱动决策比例'] :
           isLead  ? ['核心人才留存率', '高潜人才提拔周期'] :
           ['最佳实践案例数', '能力可迁移率']
    }
  ];

  // 按 score 降序取前5
  return pool
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => ({ objective: item.obj, kpi: item.kpi }));
}

// ────────────────────────────────────────────
// 下载预研报告模板
// ────────────────────────────────────────────
function downloadPreResearchReport() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('rh_pr_data_v1') || '{}'); } catch(e) { return {}; }
  })();
  const result = (() => {
    try { return JSON.parse(localStorage.getItem('rh_pr_result_v1') || '{}'); } catch(e) { return {}; }
  })();

  const now = new Date().toLocaleDateString('zh-CN');
  const priorities = result.priorities || [];
  const whys = result.whys || [];
  const dims = result.dims || [];

  const md = `# 预先研究报告
> 生成日期：${now}  |  SS 捷迈训战设计平台

---

## 基本信息
- **行业 / 公司**：${saved.industry || '—'}
- **业务战略目标**：${saved.goal || '—'}
- **高层期待**：${saved.expect || '—'}
- **核心担忧**：${saved.concern || '—'}

---

## 三维研究分析

${dims.map((d,i) => `### ${['内部研究','外部研究','人才研究'][i]}\n${d.replace(/<[^>]+>/g,'')}`).join('\n\n') || '（分析内容待生成）'}

---

## 核心洞察 · The 3 WHYs

**WHY 1 — 为什么是这些人？**
${whys[0]?.replace(/<[^>]+>/g,'') || '—'}

**WHY 2 — 为什么是这个主题？**
${whys[1]?.replace(/<[^>]+>/g,'') || '—'}

**WHY 3 — 为什么现在是合适时机？**
${whys[2]?.replace(/<[^>]+>/g,'') || '—'}

---

## 业务赋能目标优先排序

| 优先级 | 业务赋能目标重点 | 对标 KPI 价值 |
|:---:|---|---|
${priorities.map((r,i) => `| ${i+1} | ${r.objective} | ${r.kpi.join(' · ')} |`).join('\n') || '| — | 请先运行 AI 分析 | — |'}

---

*本报告由 SS 捷迈训战设计平台自动生成，供内部使用*
`;

  const blob = new Blob([md], {type:'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `预先研究报告_${now.replace(/\//g,'-')}.md`;
  a.click(); URL.revokeObjectURL(url);
}

// ════════════════════════════════════════════
// 任务 1·1·3  Business Impact Map (BIM)
// 商业影响图：业务/战略/变革目标 → KRA → 团队 KPI → 个人赋能改善绩效目标
// 四列横向流程图，无 TBPS，无权重滑块
// ════════════════════════════════════════════

// ── BIM 存储 ────────────────────────────────
const BIM_DATA_KEY   = 'rh_bim_data_v1';
const BIM_RESULT_KEY = 'rh_bim_result_v1';

function loadBIMData() {
  try { return JSON.parse(localStorage.getItem(BIM_DATA_KEY) || '{}'); } catch(e) { return {}; }
}
function saveBIMData(d) {
  localStorage.setItem(BIM_DATA_KEY, JSON.stringify(d));
}
function loadBIMResult() {
  try { return JSON.parse(localStorage.getItem(BIM_RESULT_KEY) || 'null'); } catch(e) { return null; }
}
function saveBIMResult(r) {
  r.savedAt = new Date().toISOString();
  localStorage.setItem(BIM_RESULT_KEY, JSON.stringify(r));
  // 同步到 project
  const p = projects.find(x => x.id === currentId);
  if (p) { p.bim = r; saveProjects(); }
}

// ── 获取上游结论（供 AI Prompt 调用）──────────
function getBIMContext() {
  // 从 1.1.1 取 priorities + whys
  const pr = (() => {
    try { return JSON.parse(localStorage.getItem('rh_pr_result_v1') || '{}'); } catch(e) { return {}; }
  })();
  // 从 1.1.2 取核心洞察
  const si = (() => {
    try { return JSON.parse(localStorage.getItem('rh_si_result_v1') || '{}'); } catch(e) { return {}; }
  })();
  // 从项目基本信息取受众
  const p = projects.find(x => x.id === currentId) || {};
  return {
    goal:       p.goal || '',
    audience:   p.audience || '',
    industry:   p.industry || '',
    priorities: pr.priorities || [],
    whys:       pr.whys || [],
    essence:    si.outputC || ''   // 核心赋能命题
  };
}

// ── renderBIM：主渲染 ─────────────────────────
function renderBIM() {
  const ctx  = getBIMContext();
  const contextHtml = buildBIMContextBadges(ctx);

  return `
<div class="bim-workspace">

  <!-- ① 上游输入摘要条 -->
  <div class="bim-context-bar">
    <div class="bim-ctx-title">⬆ 上游输入（自动调取 1·1·1 & 1·1·2）</div>
    <div class="bim-ctx-badges">${contextHtml}</div>
  </div>

  <!-- ② BIM 主画布（四列横向流程图） -->
  <div class="bim-canvas" id="bim-canvas">
    <div class="bim-empty-hint" id="bim-empty">
      <div class="bim-empty-icon">🗺</div>
      <p>点击「AI 生成商业影响图」，AI 将自动推导<br>业务目标 → KRA → 团队 KPI → 个人赋能改善目标</p>
    </div>
  </div>

  <!-- ③ 操作栏 -->
  <div class="bim-action-bar">
    <div class="bim-action-left">
      <button class="bim-run-btn" id="bim-run-btn" onclick="runBIMAI()">
        <span class="btn-icon">✨</span>
        <span class="btn-label">AI 生成商业影响图</span>
      </button>
      <button class="bim-save-btn" id="bim-save-btn" onclick="saveBIMCurrent()" style="display:none">
        💾 保存结果
      </button>
      <button class="bim-dl-btn" onclick="downloadBIMReport()" id="bim-dl-btn" style="display:none">
        ⬇ 下载报告
      </button>
    </div>
    <div class="bim-action-right">
      <span class="bim-hint-text" id="bim-hint">AI 将根据业务目标自动推演四层因果链</span>
    </div>
  </div>

  <!-- ④ AI 加载遮罩 -->
  <div class="bim-loading" id="bim-loading" style="display:none">
    <div class="bim-loading-inner">
      <div class="bim-spinner"></div>
      <div class="bim-loading-steps" id="bim-loading-steps">
        <div class="bim-step" id="bstep-0">🎯 解析业务目标与上游洞察…</div>
        <div class="bim-step" id="bstep-1">🗂 识别关键结果领域（KRA）…</div>
        <div class="bim-step" id="bstep-2">📐 拆解团队 KPI 指标…</div>
        <div class="bim-step" id="bstep-3">🏃 推演个人赋能改善目标…</div>
      </div>
    </div>
  </div>

</div>

<style>
/* ── BIM 工作区样式 ────────────────────────── */
.bim-workspace { position:relative; display:flex; flex-direction:column; gap:18px; padding:4px 0 24px; }

/* 上游摘要条 */
.bim-context-bar { background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.18); border-radius:10px; padding:12px 16px; }
.bim-ctx-title { font-size:11px; color:var(--slate-400); letter-spacing:.5px; margin-bottom:8px; text-transform:uppercase; }
.bim-ctx-badges { display:flex; flex-wrap:wrap; gap:8px; }
.bim-ctx-badge { background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-radius:20px; padding:4px 12px; font-size:12px; color:#93c5fd; max-width:360px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.bim-ctx-badge .bim-ctx-badge-key { color:var(--slate-500); margin-right:4px; }
.bim-ctx-empty { font-size:12px; color:var(--slate-600); font-style:italic; }

/* 画布 */
.bim-canvas { min-height:360px; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px; overflow-x:auto; }
.bim-empty-hint { display:flex; flex-direction:column; align-items:center; justify-content:center; height:300px; gap:12px; color:var(--slate-600); text-align:center; }
.bim-empty-icon { font-size:40px; opacity:.4; }
.bim-empty-hint p { font-size:13px; line-height:1.7; }

/* ── 四列横向流程图 ── */
.bim-flow-header { display:grid; grid-template-columns:200px 24px 1fr 24px 1fr 24px 1fr; align-items:center; gap:0; margin-bottom:12px; }
.bim-col-header { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; padding:6px 10px; border-radius:6px; text-align:center; }
.bim-col-header.col-goal   { background:rgba(239,68,68,.15); color:rgba(239,68,68,.9); }
.bim-col-header.col-kra    { background:rgba(99,102,241,.15); color:#a5b4fc; }
.bim-col-header.col-kpi    { background:rgba(234,179,8,.12); color:#fde68a; }
.bim-col-header.col-person { background:rgba(34,197,94,.12); color:#86efac; }
.bim-col-arrow { font-size:14px; color:rgba(255,255,255,.2); text-align:center; }

/* KRA 行 */
.bim-kra-rows { display:flex; flex-direction:column; gap:14px; min-width:700px; }
.bim-kra-row  { display:grid; grid-template-columns:200px 24px 1fr 24px 1fr 24px 1fr; align-items:stretch; gap:0; }

/* 业务目标 (第1列，跨行居中，仅第一行显示) */
.bim-goal-cell { grid-row:span 1; background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.04)); border:1px solid rgba(239,68,68,.25); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; justify-content:center; }
.bim-goal-cell-placeholder { border:none; background:none; }
.bim-goal-tag  { font-size:10px; color:rgba(239,68,68,.6); text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
.bim-goal-name { font-size:13px; color:#fca5a5; font-weight:700; line-height:1.5; }

/* 箭头列 */
.bim-row-arrow { display:flex; align-items:center; justify-content:center; font-size:16px; color:rgba(255,255,255,.18); padding:0 4px; }

/* KRA 单元格 */
.bim-kra-cell { background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.2); border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; justify-content:center; }
.bim-kra-tag   { font-size:10px; color:rgba(99,102,241,.7); text-transform:uppercase; letter-spacing:.4px; margin-bottom:4px; }
.bim-kra-name  { font-size:13px; font-weight:700; color:#a5b4fc; line-height:1.4; }
.bim-kra-weight { font-size:11px; color:rgba(99,102,241,.6); margin-top:4px; }

/* KPI 单元格 */
.bim-kpi-cell { background:rgba(234,179,8,.07); border:1px solid rgba(234,179,8,.18); border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; gap:6px; justify-content:center; }
.bim-kpi-tag   { font-size:10px; color:rgba(234,179,8,.6); text-transform:uppercase; letter-spacing:.4px; }
.bim-kpi-item  { font-size:12px; color:#fde68a; line-height:1.5; display:flex; align-items:flex-start; gap:6px; }
.bim-kpi-dot   { width:5px; height:5px; border-radius:50%; background:rgba(234,179,8,.6); margin-top:5px; flex-shrink:0; }

/* 个人目标单元格 */
.bim-person-cell { background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.18); border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; justify-content:center; }
.bim-person-tag  { font-size:10px; color:rgba(34,197,94,.6); text-transform:uppercase; letter-spacing:.4px; margin-bottom:6px; }
.bim-person-text { font-size:12px; color:#86efac; line-height:1.6; }

/* 操作栏 */
.bim-action-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.bim-action-left { display:flex; gap:10px; align-items:center; }
.bim-run-btn  { display:flex; align-items:center; gap:8px; background:linear-gradient(135deg,#ef4444,#dc2626); border:none; border-radius:8px; padding:10px 20px; font-size:13px; font-weight:600; color:#fff; cursor:pointer; transition:opacity .2s; }
.bim-run-btn:hover { opacity:.88; }
.bim-run-btn:disabled { opacity:.45; cursor:not-allowed; }
.bim-save-btn { background:rgba(34,197,94,.15); border:1px solid rgba(34,197,94,.35); border-radius:8px; padding:9px 18px; font-size:13px; color:#86efac; cursor:pointer; }
.bim-save-btn:hover { background:rgba(34,197,94,.25); }
.bim-dl-btn   { background:rgba(99,102,241,.15); border:1px solid rgba(99,102,241,.35); border-radius:8px; padding:9px 18px; font-size:13px; color:#a5b4fc; cursor:pointer; }
.bim-dl-btn:hover { background:rgba(99,102,241,.25); }
.bim-hint-text { font-size:12px; color:var(--slate-600); }

/* loading */
.bim-loading { position:absolute; inset:0; background:rgba(8,12,23,.88); border-radius:12px; display:flex; align-items:center; justify-content:center; z-index:20; }
.bim-loading-inner { display:flex; flex-direction:column; align-items:center; gap:20px; }
.bim-spinner { width:36px; height:36px; border:3px solid rgba(255,255,255,.1); border-top-color:#ef4444; border-radius:50%; animation:spin .8s linear infinite; }
.bim-loading-steps { display:flex; flex-direction:column; gap:8px; }
.bim-step { font-size:13px; color:var(--slate-600); transition:color .4s; }
.bim-step.active { color:#fca5a5; }
.bim-step.done   { color:rgba(34,197,94,.7); }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
`;
}

// ── 上游摘要徽章 HTML ─────────────────────────
function buildBIMContextBadges(ctx) {
  const badges = [];
  if (ctx.goal)      badges.push(`<span class="bim-ctx-badge"><span class="bim-ctx-badge-key">业务目标</span>${esc(ctx.goal.slice(0,60))}</span>`);
  if (ctx.audience)  badges.push(`<span class="bim-ctx-badge"><span class="bim-ctx-badge-key">受众</span>${esc(ctx.audience.slice(0,40))}</span>`);
  if (ctx.priorities && ctx.priorities.length) {
    const top = ctx.priorities.slice(0,2).map(p => p.objective || '').filter(Boolean).join(' · ');
    if (top) badges.push(`<span class="bim-ctx-badge"><span class="bim-ctx-badge-key">赋能优先级</span>${esc(top.slice(0,80))}</span>`);
  }
  if (ctx.essence)   badges.push(`<span class="bim-ctx-badge"><span class="bim-ctx-badge-key">核心命题</span>${esc(ctx.essence.slice(0,80))}</span>`);
  return badges.length ? badges.join('') : '<span class="bim-ctx-empty">（尚无上游数据，可先填写基本信息并完成任务 1·1·1）</span>';
}

// ── AI 调用入口 ───────────────────────────────
async function runBIMAI() {
  const btn = document.getElementById('bim-run-btn');
  const loading = document.getElementById('bim-loading');
  if (!btn || !loading) return;

  btn.disabled = true;
  loading.style.display = 'flex';

  // 动画步骤
  const steps = [0,1,2,3];
  let stepIdx = 0;
  const stepTimer = setInterval(() => {
    steps.forEach((s,i) => {
      const el = document.getElementById(`bstep-${s}`);
      if (!el) return;
      if (i < stepIdx) el.className = 'bim-step done';
      else if (i === stepIdx) el.className = 'bim-step active';
      else el.className = 'bim-step';
    });
    stepIdx++;
    if (stepIdx > steps.length) clearInterval(stepTimer);
  }, 900);

  try {
    const ctx = getBIMContext();
    const prompt = buildBIMPrompt(ctx);
    const cfg = (() => {
      try { return JSON.parse(localStorage.getItem('rh_ai_config_v1') || '{}'); } catch(e) { return {}; }
    })();

    let result = null;
    if (cfg.enabled && cfg.apiKey) {
      try {
        const raw = await callAI(prompt, cfg);
        const jsonStr = raw.match(/```json\s*([\s\S]*?)```/)?.[1] || raw.match(/\{[\s\S]*\}/)?.[0] || '';
        result = JSON.parse(jsonStr);
      } catch(e) {
        console.warn('BIM AI 解析失败，降级 fallback:', e);
        result = null;
      }
    }
    if (!result) result = fallbackBIM(ctx);

    clearInterval(stepTimer);
    steps.forEach(s => {
      const el = document.getElementById(`bstep-${s}`);
      if (el) el.className = 'bim-step done';
    });
    await sleep(300);

    renderBIMResult(result);
    saveBIMResult(result);

  } catch(e) {
    clearInterval(stepTimer);
    console.error('BIM 生成失败:', e);
    const result = fallbackBIM(getBIMContext());
    renderBIMResult(result);
    saveBIMResult(result);
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
    btn.querySelector('.btn-label').textContent = '✓ 重新生成';
    const saveBtn = document.getElementById('bim-save-btn');
    const dlBtn   = document.getElementById('bim-dl-btn');
    if (saveBtn) saveBtn.style.display = '';
    if (dlBtn)   dlBtn.style.display   = '';
  }
}

// ── 渲染 BIM 结果（四列横向流程图）─────────────
function renderBIMResult(result) {
  const canvas = document.getElementById('bim-canvas');
  if (!canvas) return;

  const { businessGoal, kras = [] } = result;

  // 列头行
  const headerHtml = `
    <div class="bim-flow-header">
      <div class="bim-col-header col-goal">业务/战略目标</div>
      <div class="bim-col-arrow">→</div>
      <div class="bim-col-header col-kra">关键结果领域 KRA</div>
      <div class="bim-col-arrow">→</div>
      <div class="bim-col-header col-kpi">团队 KPI 指标</div>
      <div class="bim-col-arrow">→</div>
      <div class="bim-col-header col-person">个人赋能改善目标</div>
    </div>`;

  // 每条 KRA 行
  const rowsHtml = kras.map((kra, kidx) => {
    const kpiItemsHtml = kra.kpis.map(kpi => `
      <div class="bim-kpi-item">
        <span class="bim-kpi-dot"></span>
        <span>${esc(kpi.name)}</span>
      </div>
    `).join('');

    const goalCellHtml = kidx === 0
      ? `<div class="bim-goal-cell">
           <div class="bim-goal-tag">🎯 业务目标</div>
           <div class="bim-goal-name" id="bim-goal-text">${esc(businessGoal)}</div>
         </div>`
      : `<div class="bim-goal-cell-placeholder"></div>`;

    return `
      <div class="bim-kra-row">
        ${goalCellHtml}
        <div class="bim-row-arrow">→</div>
        <div class="bim-kra-cell">
          <div class="bim-kra-tag">KRA${kidx + 1}</div>
          <div class="bim-kra-name">${esc(kra.name)}</div>
          ${kra.weight ? `<div class="bim-kra-weight">权重 ${kra.weight}%</div>` : ''}
        </div>
        <div class="bim-row-arrow">→</div>
        <div class="bim-kpi-cell">
          <div class="bim-kpi-tag">KPI 指标</div>
          ${kpiItemsHtml}
        </div>
        <div class="bim-row-arrow">→</div>
        <div class="bim-person-cell">
          <div class="bim-person-tag">🏃 个人改善目标</div>
          <div class="bim-person-text" id="bim-personal-${kidx}">${esc(kra.personalGoal)}</div>
        </div>
      </div>`;
  }).join('');

  canvas.innerHTML = `
    ${headerHtml}
    <div class="bim-kra-rows">${rowsHtml}</div>
  `;

  // 保存当前结果引用
  window._bimCurrentResult = result;
  const hintEl = document.getElementById('bim-hint');
  if (hintEl) hintEl.textContent = '✅ 已生成商业影响图 · 点击「保存结果」纳入项目';
}

// ── 保存当前结果 ──────────────────────────────
function saveBIMCurrent() {
  if (!window._bimCurrentResult) return;
  saveBIMResult(window._bimCurrentResult);
  showToast('BIM 已保存 ✓');
  const btn = document.getElementById('bim-save-btn');
  if (btn) { btn.textContent = '✓ 已保存'; setTimeout(() => { if(btn) btn.textContent = '💾 保存结果'; }, 2000); }
}

// ── 恢复已保存结果 ─────────────────────────────
function restoreBIMResult() {
  const result = loadBIMResult();
  if (!result || !result.kras) return;
  renderBIMResult(result);
  window._bimCurrentResult = result;
  const runBtn  = document.getElementById('bim-run-btn');
  const saveBtn = document.getElementById('bim-save-btn');
  const dlBtn   = document.getElementById('bim-dl-btn');
  if (runBtn)  runBtn.querySelector('.btn-label').textContent = '✓ 重新生成';
  if (saveBtn) saveBtn.style.display = '';
  if (dlBtn)   dlBtn.style.display   = '';
}

// ── AI Prompt 构建 ────────────────────────────
function buildBIMPrompt(ctx) {
  const priText = ctx.priorities.length
    ? ctx.priorities.slice(0,3).map((p,i) => `  ${i+1}. ${p.objective || ''}`).join('\n')
    : '  （暂无优先排序数据）';
  const whyText = ctx.whys.length
    ? ctx.whys.map((w,i) => `  WHY${i+1}: ${(w||'').replace(/<[^>]+>/g,'').slice(0,120)}`).join('\n')
    : '  （暂无 WHY 数据）';

  return `你是一位资深绩效咨询专家。请根据以下信息，构建一张「商业影响图（BIM）」。

## 输入上下文
- 所在行业：${ctx.industry || '未知'}
- 业务赋能目标：${ctx.goal || '（未填写，请根据行业合理推断）'}
- 目标受众：${ctx.audience || '（未填写）'}
- 赋能优先排序：
${priText}
- 核心洞察（3 WHYs）：
${whyText}
- 核心赋能命题：${ctx.essence ? (ctx.essence+'').replace(/<[^>]+>/g,'').slice(0,200) : '（暂无）'}

## BIM 结构说明
Business Impact Map 是四列因果链：
业务/战略目标 → 关键结果领域（KRA）→ 团队 KPI 指标 → 个人赋能改善目标

## 输出要求
必须严格返回如下 JSON，不添加任何说明文字：

\`\`\`json
{
  "businessGoal": "一句话描述核心业务/战略/变革目标（30字以内）",
  "kras": [
    {
      "name": "关键结果领域名称（8字以内）",
      "weight": 35,
      "kpis": [
        { "name": "具体可量化的 KPI 指标名称（含比率/数量/分值）" },
        { "name": "第二个 KPI（可选，如无则省略此项）" }
      ],
      "personalGoal": "目标受众岗位人员必须达成的具体行为改变目标，含：能够…在…天内/场景下…产出/达到…（40字以内）"
    }
  ]
}
\`\`\`

## 约束条件
1. KRA 数量：3-4 个，weight 权重之和 = 100%
2. 每个 KRA 下 1-2 个 KPI，KPI 名称必须含可量化描述
3. personalGoal 必须是具体行为目标，含动词+场景+时限+结果，禁止空话套话
4. 所有字段用中文
5. 不需要 TBPS 字段，不要输出任何公式`;
}

// ── fallback 模板引擎 ─────────────────────────
function fallbackBIM(ctx) {
  const goal = ctx.goal || '提升核心业务团队综合绩效与市场竞争力';

  // 根据行业/目标关键词动态生成 KRA
  const goalLower = (goal + (ctx.essence || '')).toLowerCase();

  // 场景检测
  const isSales    = /销售|客户|商机|中标|成交|营收|收入|渠道|拓客/.test(goalLower);
  const isService  = /服务|体验|满意|客服|售后|响应/.test(goalLower);
  const isOps      = /运营|效率|流程|成本|交付|产能|合规/.test(goalLower);
  const isLeader   = /管理|领导|团队|协作|辅导|人才/.test(goalLower);

  // 构造 3-4 个 KRA
  const kras = [];

  if (isSales) {
    kras.push({
      name:'市场拓展', weight:35,
      kpis:[{name:'新客户开发成功率（%）'},{name:'商机转化率（%）'}],
      personalGoal:`能够在 14 天内完成目标客户画像分析并制定差异化拜访策略，推动商机转化率提升 15%`
    });
    kras.push({
      name:'销售执行', weight:25,
      kpis:[{name:'销售漏斗推进周期（天）'},{name:'季度签约达成率（%）'}],
      personalGoal:`能够在客户接触的 3 个关键场景中运用结构化洽谈框架，将平均成交周期压缩 20%`
    });
  }

  if (isService) {
    kras.push({
      name:'服务质量', weight:30,
      kpis:[{name:'客户满意度评分（NPS/CSI）'}],
      personalGoal:`能够在每次客户投诉后 4 小时内完成根因分析并提出书面改善方案，投诉重复率降至 5% 以下`
    });
  }

  if (isOps) {
    kras.push({
      name:'运营效率', weight:25,
      kpis:[{name:'关键流程节点准时完成率（%）'},{name:'返工率（%）'}],
      personalGoal:`能够识别本岗位 TOP3 流程瓶颈并在 21 天内产出标准化操作手册，减少返工率 20%`
    });
  }

  if (isLeader) {
    kras.push({
      name:'团队能力', weight:20,
      kpis:[{name:'下属绩效达标率（%）'}],
      personalGoal:`能够在月度 1-on-1 中运用 GROW 辅导模型，为下属制定可衡量的 30 天行动计划，团队达标率提升 10%`
    });
  }

  // 如果关键词不足，补充通用 KRA
  if (kras.length < 3) {
    const defaults = [
      { name:'核心技能应用', weight:35,
        kpis:[{name:'技能实战应用频率（次/月）'},{name:'案例完成质量评分（分）'}],
        personalGoal:`能够在岗位高频场景中应用培训工具，30 天内独立完成 3 个完整业务案例并提交复盘报告` },
      { name:'绩效目标达成', weight:30,
        kpis:[{name:'季度 KPI 达成率（%）'}],
        personalGoal:`能够将训战所学方法工具落地到日常工作，季度绩效评分较基线提升 1 个等级` },
      { name:'协同创新', weight:20,
        kpis:[{name:'跨部门协作项目完成率（%）'}],
        personalGoal:`能够主导至少 1 个跨部门改善课题，产出可复用的最佳实践案例并完成内部分享` }
    ];
    for (const d of defaults) {
      if (kras.length < 3) kras.push(d);
    }
  }

  // 限制最多 4 个
  while (kras.length > 4) kras.pop();

  // 重新归一化权重
  const totalW = kras.reduce((s,k) => s+k.weight, 0);
  kras.forEach(k => k.weight = Math.round(k.weight / totalW * 100));
  // 修正尾差
  const diff = 100 - kras.reduce((s,k) => s+k.weight, 0);
  kras[0].weight += diff;

  return {
    businessGoal: goal.slice(0, 40),
    kras
  };
}

// ── 下载 BIM 报告 ─────────────────────────────
function downloadBIMReport() {
  const result = window._bimCurrentResult || loadBIMResult();
  if (!result) { showToast('请先生成 BIM 报告'); return; }
  const p   = projects.find(x => x.id === currentId) || {};
  const now = new Date().toLocaleDateString('zh-CN');

  const kraTable = result.kras.map((kra, i) => {
    const kpiLines = kra.kpis.map(k => `    - ${k.name}`).join('\n');
    return `### KRA${i+1}：${kra.name}（权重 ${kra.weight}%）\n\n**团队 KPI 指标：**\n${kpiLines}\n\n**个人赋能改善目标：**\n> ${kra.personalGoal}`;
  }).join('\n\n---\n\n');

  const md = `# 商业影响图（BIM）报告
> 生成日期：${now}  |  Red House 训战设计平台

---

## 业务/战略目标
**${result.businessGoal}**

---

## BIM 因果链：KRA → 团队 KPI → 个人赋能改善目标

${kraTable}

---

*本报告由 Red House 训战设计平台自动生成，供内部使用*
`;

  const blob = new Blob([md], {type:'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `BIM报告_${now.replace(/\//g,'-')}.md`;
  a.click(); URL.revokeObjectURL(url);
}

// ────────────────────────────────────────────
// 工具函数
// ────────────────────────────────────────────
