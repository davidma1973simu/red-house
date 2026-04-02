// ════════════════════════════════════════════
// tasks/core.js
// 任务路由器：TASK_META 定义 + openTask + renderTaskContent
// ════════════════════════════════════════════

// ────────────────────────────────────────────
// 任务元数据注册表
// 新增任务：在此追加一条记录，key 格式：'环节-模块-任务'（0-indexed）
// ────────────────────────────────────────────
const TASK_META = {

  // ── 环节 1：洞察定义 ──────────────────────
  // 模块 1：绩效洞察
  '0-0-0': {
    name: '预先研究',
    phase: '洞察定义', module: '绩效洞察', num: '1·1·1',
    desc: '研究高层领导的需求——在业务、战略、变革、绩效等方面的目标下对组织和人才的方向性关注、期待和担心。'
  },
  '0-0-1': {
    name: '调研洞察',
    phase: '洞察定义', module: '绩效洞察', num: '1·1·2',
    desc: '基于业务赋能目标，从四个关键维度采集多元视角，AI 推导从现象到本质的四层洞察架构，揭示影响绩效的核心驱动力。'
  },
  '0-0-2': {
    name: '目标拆解',
    phase: '洞察定义', module: '绩效洞察', num: '1·1·3',
    desc: '构建商业影响图（BIM）：将业务赋能目标拆解为关键结果领域（KRA）→ 量化 KPI（含权重）→ 岗位个人改善目标，生成 TBPS 团队综合绩效公式。'
  },

  // 模块 2：行为洞察（待实现）
  // '0-1-0': { name: '…', phase:'洞察定义', module:'行为洞察', num:'1·2·1', desc:'…' },

  // 模块 3：内容设计洞察（待实现）
  // '0-2-0': { ... },

  // ── 环节 2：方案设计（待实现）────────────
  // '1-0-0': { ... },

  // ── 环节 3：交付评估（待实现）────────────
  // '2-0-0': { ... },
};


// ────────────────────────────────────────────
// openTask：打开任务工作区
// 由卡片 onclick 调用：openTask(phase, mod, task)
// ────────────────────────────────────────────
function openTask(phase, mod, task) {
  const key  = `${phase}-${mod}-${task}`;
  const meta = TASK_META[key];
  if (!meta) return;   // 未定义的任务暂不响应

  activeTask = { phase, mod, task, key };

  document.getElementById('ws-breadcrumb').innerHTML =
    `环节${phase + 1} · <span>${meta.phase}</span> &nbsp;/&nbsp; 模块${mod + 1} · <span>${meta.module}</span>`;
  document.getElementById('ws-title').textContent    = `${meta.num}  ${meta.name}`;
  document.getElementById('ws-subtitle').textContent = meta.desc;
  document.getElementById('ws-save-status').textContent = '—';
  document.getElementById('ws-save-status').className   = 'ws-save-status';

  // 渲染工作区 HTML
  document.getElementById('ws-body').innerHTML = renderTaskContent(key);

  // 恢复各任务已保存结果
  if (key === '0-0-0') restorePreResearchResult();
  if (key === '0-0-1') restoreSurveyInsightResult();
  if (key === '0-0-2') restoreBIMResult();

  document.getElementById('workspace-overlay').classList.add('open');
}


// ────────────────────────────────────────────
// renderTaskContent：根据 key 调用对应 render 函数
// 新增任务时在此添加一行 if 判断即可
// ────────────────────────────────────────────
function renderTaskContent(key) {
  if (key === '0-0-0') return renderPreResearch();
  if (key === '0-0-1') return renderSurveyInsight();
  if (key === '0-0-2') return renderBIM();

  // 占位：未实现任务
  return `<div class="ws-placeholder">
    <div class="ph-icon">🚧</div>
    <h3>即将开放</h3>
    <p>此任务工作区内容建设中。</p>
    <span class="ws-coming-soon">⏳ 等待输入</span>
  </div>`;
}
