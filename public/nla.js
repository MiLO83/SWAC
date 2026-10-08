(()=>{'use strict';
const $=id=>document.getElementById(id);
const targets={
 'z80':{name:'Z80 / ColecoVision example',architecture:'z80',answerFormat:'z80-hex',memoryBytes:1024,capabilities:['store-byte','return']},
 'avr':{name:'AVR microcontroller example',architecture:'avr8',answerFormat:'structured-steps',memoryBytes:2048,capabilities:['gpio','delay']},
 'browser':{name:'Browser / JavaScript example',architecture:'web',answerFormat:'json-data',memoryBytes:65536,capabilities:['display','store-data']}
};
const tasks={
 'identify':{label:'Identify yourself',answers:{
 z80:{kind:'data',message:'SWAC peer: Z80-compatible example. No hardware connection.'},
 avr:{kind:'data',message:'SWAC peer: AVR-compatible example. No hardware connection.'},
 browser:{kind:'data',message:'SWAC peer: browser-compatible example. No hardware connection.'}}},
 'store':{label:'Store a value',answers:{
 z80:{kind:'machine-code',assembly:['LD A, 42','LD (0x7000), A','RET'],hex:'3E 2A 32 00 70 C9',note:'Example assumes 0x7000 is writable RAM and a compatible loader invokes the subroutine.'},
 avr:{kind:'structured-steps',steps:[{operation:'allocate',bytes:1},{operation:'write',offset:0,value:42}],note:'Instructions for a trusted adapter, not executable AVR machine code.'},
 browser:{kind:'json-data',key:'answer',value:42,note:'Plain data; no script execution.'}}},
 'greet':{label:'Request a greeting',answers:{
 z80:{kind:'machine-code',assembly:['LD A, 1','LD (0x7000), A','RET'],hex:'3E 01 32 00 70 C9',note:'Stores greeting identifier; separate receiver software must interpret it.'},
 avr:{kind:'structured-steps',steps:[{operation:'signal',channel:'status',value:1}],note:'Requires an adapter that defines a status channel.'},
 browser:{kind:'json-data',text:'Hello from SWAC!',note:'Plain text, not executable code.'}}}
};
const key='swac-nla-history-v1';
let history=[];try{const h=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(h))history=h.filter(x=>typeof x==='string').slice(-10)}catch{}
const status=s=>$('nlaStatus').textContent=s;
function describe(){const id=$('nlaTarget').value;const p=targets[id];return {format:'SWAC-DESCRIBE/1',device:p.name,architecture:p.architecture,answerFormat:p.answerFormat,memoryBytes:p.memoryBytes,capabilities:p.capabilities};}
function request(){const target=$('nlaTarget').value,task=$('nlaTask').value;return {format:'SWAC-ASK/1',target,task,description:describe(),maxReplyBytes:2048};}
function answer(q){if(!q||q.format!=='SWAC-ASK/1'||!Object.hasOwn(targets,q.target)||!Object.hasOwn(tasks,q.task))throw Error('Unsupported request');const expected=targets[q.target];if(!q.description||q.description.architecture!==expected.architecture||q.description.answerFormat!==expected.answerFormat||q.description.memoryBytes!==expected.memoryBytes)throw Error('Device profile mismatch');if(q.maxReplyBytes!==2048)throw Error('Unsupported reply budget');const response={format:'SWAC-ANSWER/1',target:q.target,task:q.task,verified:true,verification:'Known template and target profile matched; not tested on physical hardware',payload:tasks[q.task].answers[q.target]};if(JSON.stringify(response).length>q.maxReplyBytes)throw Error('Reply too large');return response;}
$('nlaDescribe').onclick=()=>{$('nlaDocument').value=JSON.stringify(describe(),null,2);status('Device profile prepared. Example profile only; no hardware probed.');};
$('nlaAsk').onclick=()=>{try{const q=request();const a=answer(q);$('nlaDocument').value=JSON.stringify({request:q,response:a},null,2);history.push(q.target+' / '+q.task);history=history.slice(-10);try{localStorage.setItem(key,JSON.stringify(history))}catch{}$('nlaHistory').textContent=history.join(' → ');status('ANSWER generated and template-verified locally. No peer contacted, code executed, or hardware tested.');}catch(e){status('Request rejected: '+e.message)}};
$('nlaVerify').onclick=()=>{try{const raw=$('nlaDocument').value;if(raw.length>8192)throw Error('Document too large');const o=JSON.parse(raw);if(!o||!o.request||!o.response)throw Error('Expected request and response');const expected=answer(o.request);if(JSON.stringify(expected)!==JSON.stringify(o.response))throw Error('Response differs from approved template');status('Verified: exact target-specific response matches approved local template. Hardware execution remains unverified.');}catch(e){status('Verification failed: '+e.message)}};
$('nlaHistory').textContent=history.length?history.join(' → '):'No local requests yet.';
})();
