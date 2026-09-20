(function(){
  'use strict';
  var API='/api/queenie-ai';
  var MAX_HISTORY=8;
  var knowledge={
    profile:'Queenie（曲晶蕊）是一名拥有 10 年以上 UI/UE、数据可视化与复杂 B 端产品经验的设计师，近年重点把 AI 与产品设计经验结合，关注 AI 产品化、B2B SaaS、复杂业务产品架构、交通信控、数据可视化、设计系统与研发协同落地。',
    role:'在 AI 自适应信控 SaaS 项目中，她负责业务需求梳理、产品架构、核心流程、功能定义、UX/UI、设计系统、研发协同与项目落地推进。核心贡献是把独立的 AI 感知能力与信控算法，转化为可进入真实城市交通业务的 SaaS 产品闭环。',
    signal:'AI 自适应信控 SaaS 平台已进入南宁市实际实施场景。产品流程是：AI 感知 → 异常诊断 → 优化触发 → 方案生成 → 自动/人工下发 → 效果评价。系统把分钟级交通状态、异常优先级、定时/状态驱动优化、可选仿真、人工复核与效果复盘串在一起。',
    ai:'她更关注“AI 能不能进入真实工作流”，而不是只做一个 AI 按钮。常用思路包括：明确模型输入与输出、让 AI 在合适环节参与判断或生成、设置 Human in the Loop 人工复核节点、限制自动化边界，并用可追溯的记录和评价闭环验证效果。',
    b2b:'她长期做 B 端、SaaS 和复杂行业产品，擅长把复杂需求拆成角色、流程、数据和系统结构，再通过 UX/UI、数据可视化和设计系统转成可执行、可协作的产品方案。',
    contact:'可以通过邮箱 qujingrui77@outlook.com 联系 Queenie；微信号是 513888090。',
    career:'工作经历包括：2022–2026 北京博研智通科技有限公司，负责 20+ 城市交通信控、全息与 SaaS 项目；2017–2022 北京中交简石科技有限公司（北京德胜天成），聚焦 B 端与政务产品；2015–2017 网易河北，负责移动端与 H5 设计。'
  };
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]})}
  function localAnswer(q){
    var s=(q||'').toLowerCase();
    if(/联系|邮箱|微信|合作|contact|email/.test(s)) return knowledge.contact;
    if(/南宁|信控|交通|saas|拥堵|配时|路口|项目/.test(s)) return knowledge.signal+'\n\n'+knowledge.role;
    if(/负责|角色|职责|贡献|做了什么/.test(s)) return knowledge.role;
    if(/ai|agent|智能|人工复核|human|prompt|工作流/.test(s)) return knowledge.ai;
    if(/b端|b2b|复杂|架构|产品能力|擅长|能力/.test(s)) return knowledge.b2b;
    if(/经历|公司|工作|职业|网易|博研|简石/.test(s)) return knowledge.career;
    if(/queenie|曲晶蕊|介绍|是谁|背景/.test(s)) return knowledge.profile;
    return '我主要介绍 Queenie 的作品、项目经历、AI / 产品设计能力和合作方式。你可以问我：她在南宁 AI 信控 SaaS 里负责什么、她怎么把 AI 放进产品流程、她擅长哪些 B 端产品，或者怎么联系她。';
  }
  function create(){
    if(document.querySelector('.queenie-ai')) return;
    var root=document.createElement('aside');root.className='queenie-ai';root.setAttribute('aria-label','Queenie AI 作品助手');
    root.innerHTML='<button class="queenie-ai__launcher" type="button" aria-label="打开 Queenie AI" aria-expanded="false"><span class="queenie-ai__launcher-mark">Q·AI</span></button><section class="queenie-ai__panel" role="dialog" aria-modal="false" aria-label="Queenie AI"><header class="queenie-ai__head"><div class="queenie-ai__avatar">Q</div><div class="queenie-ai__head-copy"><p class="queenie-ai__title">Queenie AI</p><p class="queenie-ai__status">作品集助手 · 只回答与 Queenie 有关的问题</p></div><button class="queenie-ai__close" type="button" aria-label="关闭">×</button></header><div class="queenie-ai__messages" aria-live="polite"></div><form class="queenie-ai__form"><textarea class="queenie-ai__input" rows="1" maxlength="500" placeholder="问我关于项目、能力或合作…"></textarea><button class="queenie-ai__send" type="submit" aria-label="发送">↑</button></form><p class="queenie-ai__footnote">AI 可能有误，请以作品集页面中的公开信息为准。</p></section>';
    document.body.appendChild(root);
    var launcher=root.querySelector('.queenie-ai__launcher'),close=root.querySelector('.queenie-ai__close'),messages=root.querySelector('.queenie-ai__messages'),form=root.querySelector('.queenie-ai__form'),input=root.querySelector('.queenie-ai__input'),send=root.querySelector('.queenie-ai__send');
    var history=[];
    function add(text,type,raw){var b=document.createElement('div');b.className='queenie-ai__bubble queenie-ai__bubble--'+type;b.innerHTML=raw?text:esc(text);messages.appendChild(b);messages.scrollTop=messages.scrollHeight;return b}
    function addQuick(){var q=document.createElement('div');q.className='queenie-ai__quick';['她在 AI 信控项目里负责什么？','她怎么把 AI 放进产品流程？','她擅长哪些 B 端产品？','怎么联系她？'].forEach(function(t){var x=document.createElement('button');x.type='button';x.textContent=t;x.addEventListener('click',function(){input.value=t;form.requestSubmit()});q.appendChild(x)});messages.appendChild(q)}
    add('Hi，我是 Queenie 的 AI 作品助手。你可以问我她的项目、AI 产品方法、B 端经验，或者合作方式。','ai');addQuick();
    function setOpen(v){root.classList.toggle('is-open',v);launcher.setAttribute('aria-expanded',String(v));if(v)setTimeout(function(){input.focus()},120)}
    launcher.addEventListener('click',function(){setOpen(!root.classList.contains('is-open'))});close.addEventListener('click',function(){setOpen(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false)});
    input.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,96)+'px'});input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
    form.addEventListener('submit',async function(e){e.preventDefault();var q=input.value.trim();if(!q||send.disabled)return;input.value='';input.style.height='auto';add(q,'user');history.push({role:'user',content:q});history=history.slice(-MAX_HISTORY);send.disabled=true;var typing=add('<span class="queenie-ai__typing"><i></i><i></i><i></i></span>','ai',true);
      var answer='';try{var r=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:q,history:history})});if(!r.ok)throw new Error('api');var d=await r.json();answer=d&&d.answer?d.answer:'';if(!answer)throw new Error('empty')}catch(_){answer=localAnswer(q)}typing.remove();add(answer,'ai');history.push({role:'assistant',content:answer});history=history.slice(-MAX_HISTORY);send.disabled=false;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',create);else create();
})();