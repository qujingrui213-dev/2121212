const KNOWLEDGE = `
Queenie（曲晶蕊）是一名拥有10年以上 UI/UE、数据可视化与复杂B端产品经验的设计师，当前定位为 AI 产品 / 产品设计负责人 / UI/UE设计师。她长期做 B2B SaaS、交通信控、政企数据平台、数字孪生和复杂后台产品，并把 AI 与原有产品设计经验结合。

核心能力：
1. 复杂业务与产品架构：把复杂行业需求拆为角色、流程、数据和系统结构，形成清晰的 B2B 产品架构。
2. AI 产品化：判断 AI 在真实业务中的合理位置，把模型能力转成可执行流程、自动化机制和 Human in the Loop 控制点。
3. 产品体验与复杂交互：把复杂数据和专业业务转成清晰、可决策的产品体验，并以 UX/UI、数据可视化和 Design System 推动落地。

代表项目：AI 自适应信控 SaaS 平台，已进入南宁市实际实施场景。核心流程：AI 感知 → 异常诊断 → 优化触发 → 方案生成 → 自动/人工下发 → 效果评价。
项目中 Queenie 负责：业务需求梳理、产品架构、核心流程、功能定义、UX/UI、设计系统、研发协同与项目落地推进。

职业经历：
2022–2026 北京博研智通科技有限公司：负责20+城市交通信控平台、全息平台与SaaS平台等项目设计。
2017–2022 北京中交简石科技有限公司（北京德胜天成）：聚焦B端与政务产品设计、设计规范与视觉体系建设。
2015–2017 网易河北：负责移动端与H5页面设计。

联系方式：邮箱 qujingrui77@outlook.com；微信 513888090。
`;

function fallback(q=''){
  const s=q.toLowerCase();
  if(/联系|邮箱|微信|合作|contact|email/.test(s)) return '可以通过邮箱 qujingrui77@outlook.com 联系 Queenie；微信号是 513888090。';
  if(/南宁|信控|交通|saas|拥堵|配时|路口|项目/.test(s)) return '她的代表项目是 AI 自适应信控 SaaS 平台，已进入南宁市实际实施场景。产品把 AI 感知、异常诊断、优化触发、方案生成、自动/人工下发与效果评价串成闭环。Queenie 负责业务需求梳理、产品架构、核心流程、功能定义、UX/UI、设计系统、研发协同与项目落地推进。';
  if(/ai|agent|智能|人工复核|human|prompt|工作流/.test(s)) return '她更关注 AI 是否真正进入业务工作流：先明确输入输出，再把 AI 放在合适环节参与判断或生成，同时设置 Human in the Loop 人工复核点、限制自动化边界，并通过记录和评价闭环验证效果。';
  if(/经历|公司|工作|职业|网易|博研|简石/.test(s)) return '她有 10 年以上设计经验：2022–2026 北京博研智通；2017–2022 北京中交简石（北京德胜天成）；2015–2017 网易河北。';
  if(/能力|擅长|b端|b2b|复杂|架构/.test(s)) return '她擅长复杂业务与产品架构、AI 产品化、复杂交互与数据可视化。简单说，就是能把专业业务和算法能力拆成真正能让用户使用、能让研发落地的产品流程。';
  return '我主要介绍 Queenie 的作品、项目经历、AI / 产品设计能力和合作方式。';
}

export async function onRequestPost(context){
  let body={};try{body=await context.request.json()}catch(_){return json({answer:'请输入一个问题。'},400)}
  const message=String(body.message||'').trim().slice(0,500);
  if(!message) return json({answer:'请输入一个问题。'},400);
  const key=context.env && context.env.QWEN_API_KEY;
  if(!key) return json({answer:fallback(message),mode:'fallback'});
  const history=Array.isArray(body.history)?body.history.slice(-8).map(x=>({role:x.role==='assistant'?'assistant':'user',content:String(x.content||'').slice(0,800)})):[];
  const system=`你是“Queenie AI”，是 Queenie 个人作品集网站里的简洁、友好、专业的作品助手。
严格规则：
- 只回答与 Queenie 的作品、项目、职业经历、AI/产品设计能力、合作方式和联系方式有关的问题。
- 只能根据下面公开资料回答，不确定就明确说“作品集中没有公开这项信息”。
- 不编造项目数据、客户、职位、学历、成果或量化效果。
- 不把 Queenie 描述成算法工程师；她的核心价值是把复杂业务、AI/算法能力转成可用产品并推动落地。
- 回答以中文为主，通常 80~180 字。
公开资料：
${KNOWLEDGE}`;
  try{
    const res=await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${key}`},body:JSON.stringify({model:(context.env&&context.env.QWEN_MODEL)||'qwen-flash',messages:[{role:'system',content:system},...history,{role:'user',content:message}],temperature:.25,max_tokens:320})});
    if(!res.ok) throw new Error('upstream');
    const data=await res.json();
    const answer=data&&data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content;
    return json({answer:answer||fallback(message),mode:answer?'qwen':'fallback'});
  }catch(_){return json({answer:fallback(message),mode:'fallback'});}
}
function json(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})}
