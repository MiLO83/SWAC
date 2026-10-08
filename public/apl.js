(()=>{'use strict';
const $=id=>document.getElementById(id);
const local={format:'SWAC-APL/1',device:'SWAC-browser',protocols:[
{id:'morse-basic',modulation:'MORSE',frequency:750,dotMs:120,alphabet:'ITU-LATIN',framing:'SW-CRC16'},
{id:'fsk4-basic',modulation:'4FSK',frequencies:[900,1200,1500,1800],symbolRate:5,bitsPerSymbol:2},
{id:'fsk4-fast',modulation:'4FSK',frequencies:[900,1200,1500,1800],symbolRate:10,bitsPerSymbol:2}
]};
const key='swac-apl-peers-v1';
let peers={};try{peers=JSON.parse(localStorage.getItem(key)||'{}');if(!peers||typeof peers!=='object'||Array.isArray(peers))peers={}}catch{peers={}}
const setStatus=s=>$('aplStatus').textContent=s;
function validProfile(p){
 if(!p||p.format!=='SWAC-APL/1'||typeof p.device!=='string'||p.device.length<1||p.device.length>64||!Array.isArray(p.protocols)||p.protocols.length>32)throw Error('Invalid APL/1 capability document');
 const protocols=p.protocols.map(q=>{
 if(q?.modulation==='MORSE'){if(q.id!=='morse-basic'||q.frequency!==750||q.dotMs!==120||q.alphabet!=='ITU-LATIN'||q.framing!=='SW-CRC16')throw Error('Unsupported Morse mode');return {id:'morse-basic',modulation:'MORSE',frequency:750,dotMs:120,alphabet:'ITU-LATIN',framing:'SW-CRC16'};}
 if(!q||typeof q.id!=='string'||!/^[a-z0-9-]{1,40}$/.test(q.id)||q.modulation!=='4FSK'||!Array.isArray(q.frequencies)||q.frequencies.length!==4||!q.frequencies.every(f=>Number.isFinite(f)&&f>=200&&f<=10000)||!Number.isFinite(q.symbolRate)||q.symbolRate<1||q.symbolRate>100||q.bitsPerSymbol!==2)throw Error('Unsupported or unsafe protocol description');
 return {id:q.id,modulation:'4FSK',frequencies:q.frequencies.slice(),symbolRate:q.symbolRate,bitsPerSymbol:2};
 });
 return {format:'SWAC-APL/1',device:p.device,protocols};
}
function compatible(a,b){if(a.modulation!==b.modulation)return false;if(a.modulation==='MORSE')return a.frequency===b.frequency&&a.dotMs===b.dotMs&&a.alphabet===b.alphabet&&a.framing===b.framing;return a.symbolRate===b.symbolRate&&a.frequencies.every((v,i)=>v===b.frequencies[i])}
function select(peer){
 const matches=local.protocols.flatMap(a=>peer.protocols.filter(b=>compatible(a,b)).map(()=>a));
 return matches.sort((a,b)=>(b.symbolRate||0)-(a.symbolRate||0))[0]||null;
}
$('aplExport').onclick=()=>{
 $('aplDocument').value=JSON.stringify(local,null,2);setStatus('Local capabilities ready to copy or exchange. No audio packet sent.');
};
$('aplImport').onclick=()=>{
 try{
 const input=$('aplDocument').value;
 if(input.length>12000)throw Error('Capability document too large');
 const peer=validProfile(JSON.parse(input));const best=select(peer);
 if(peer.device===local.device)setStatus('This is the local example profile. Exchange profiles from another device to discover its capabilities.');
 else{
 peers[peer.device]={profile:peer,selected:best?.id||null,verified:false,seen:new Date().toISOString()};
 localStorage.setItem(key,JSON.stringify(peers));
 setStatus(best?'Peer '+peer.device+': compatible '+best.id+(best.modulation==='MORSE'?' (Morse timing profile)':' at '+(best.symbolRate*2)+' raw bit/s')+'. Not verified with this peer.':'Peer '+peer.device+': no supported common protocol; retain bootstrap.');
 }
 renderPeers();
 }catch(e){setStatus('Import rejected: '+e.message)}
};
function renderPeers(){
 const names=Object.keys(peers).slice(0,30);
 $('aplPeers').textContent=names.length?names.map(n=>n+': '+(peers[n].selected||'no common mode')+' (unverified)').join(' | '):'No peer profiles saved';
}
$('aplForget').onclick=()=>{peers={};localStorage.removeItem(key);renderPeers();setStatus('Saved peer profiles cleared; bootstrap remains available.')};
renderPeers();
})();
