// ════════════════════════════════════════════
// tasks/ai-engine.js
// 通用 AI 调用引擎 —— 所有任务共用
// ════════════════════════════════════════════

/**
 * 睡眠工具
 * @param {number} ms 毫秒
 */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * 通用 AI 调用（OpenAI 接口 / 兼容接口）
 * @param {object} cfg  - loadAI() 返回的配置对象
 * @param {string} prompt - 完整 Prompt 字符串
 * @param {number} [maxTokens=1200] - 最大输出 token
 * @returns {Promise<string>} - AI 返回的原始文本
 */
async function callAI(cfg, prompt, maxTokens = 1200) {
  const endpoint = cfg.provider === 'compatible'
    ? cfg.endpoint
    : 'https://api.openai.com/v1/chat/completions';
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cfg.apiKey
    },
    body: JSON.stringify({
      model: cfg.model || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });
  if (!resp.ok) throw new Error('AI 请求失败: ' + resp.status);
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}
