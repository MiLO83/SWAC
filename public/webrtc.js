(()=>{'use strict';
const $=id=>document.getElementById(id);let pc=null,channel=null,received=0,pending=new Map(),sequence=0;
const status=s=>$('rtcStatus').textContent=s;
const profile={format:'SWAC-PEER/1',protocols:['morse-basic','fsk4-basic','fsk4-fast','webrtc-json-v1'],capabilities:['text','ping','ack'],execution:false};
const log=s=>{$('rtcLog').textContent=(new Date().toLocaleTimeString()+' '+s+'\n'+$('rtcLog').textContent).slice(0,5000)};
function cleanup(){for(const item of pending.values())clearTimeout(item.timer);pending.clear();if(channel){channel.close();channel=null}if(pc){pc.close();pc=null}status('Disconnected.')}
function setup(ch){channel=ch;ch.onopen=()=>{status('Data channel open; exchanging descriptions.');send({type:'DESCRIBE',profile});log('Channel open')};ch.onclose=()=>status('Channel closed');ch.onerror=()=>status('Data channel error');ch.onmessage=e=>{if(typeof e.data!=='string'||e.data.length>4096)return;let m;try{m=JSON.parse(e.data)}catch{return}if(!m||m.v!==1||typeof m.type!=='string')return;
 if(m.type==='DESCRIBE'&&m.profile?.format==='SWAC-PEER/1'&&Array.isArray(m.profile.protocols)){log('Peer protocols: '+m.profile.protocols.filter(x=>typeof x==='string').slice(0,12).join(', '));send({type:'HELLO',id:++sequence,challenge:randomChallenge()})}
 else if(m.type==='HELLO'&&Number.isSafeInteger(m.id)&&typeof m.challenge==='string'&&/^[0-9a-f]{16}$/.test(m.challenge)){send({type:'NOD',id:m.id,challenge:m.challenge});log('HELLO received; NOD sent')}
 else if(m.type==='NOD'&&Number.isSafeInteger(m.id)&&typeof m.challenge==='string'){const item=pending.get(m.id);if(item&&item.challenge===m.challenge){clearTimeout(item.timer);pending.delete(m.id);send({type:'ACK',id:m.id});log('NOD challenge verified; ACK sent');status('HELLO → NOD → ACK complete over WebRTC (not authenticated).')}}
 else if(m.type==='ACK')log('ACK received for '+m.id);
 else if(m.type==='TEXT'&&typeof m.body==='string'&&m.body.length<=200){received++;log('Peer says: '+m.body);send({type:'RECEIPT',id:m.id})}
 else if(m.type==='RECEIPT'){const item=pending.get(m.id);if(item){clearTimeout(item.timer);pending.delete(m.id);log('Delivery receipt for '+m.id)}}
 }; }
function send(data){if(!channel||channel.readyState!=='open')throw Error('Channel is not open');channel.send(JSON.stringify({v:1,...data}))}
function randomChallenge(){const a=new Uint8Array(8);crypto.getRandomValues(a);return [...a].map(n=>n.toString(16).padStart(2,'0')).join('')}
function track(id,packet,challenge){let attempts=0;const retry=()=>{if(!pending.has(id))return;if(attempts>=3){pending.delete(id);log('No response for '+id+' after 3 attempts');return}attempts++;try{send(packet)}catch(e){pending.delete(id);log(e.message);return}const item=pending.get(id);item.timer=setTimeout(retry,1800)};pending.set(id,{challenge,timer:null});retry()}
function newPc(){cleanup();pc=new RTCPeerConnection({iceServers:[]});pc.ondatachannel=e=>setup(e.channel);pc.onconnectionstatechange=()=>{status('WebRTC: '+pc.connectionState);if(pc.connectionState==='failed')log('Connection failed; no relay or public STUN configured.')};}
async function gather(){if(pc.iceGatheringState==='complete')return;await new Promise(resolve=>{const t=setTimeout(resolve,8000);const fn=()=>{if(pc?.iceGatheringState==='complete'){clearTimeout(t);pc.removeEventListener('icegatheringstatechange',fn);resolve()}};pc.addEventListener('icegatheringstatechange',fn);fn()})}
$('rtcOffer').onclick=async()=>{try{newPc();setup(pc.createDataChannel('swac'));await pc.setLocalDescription(await pc.createOffer());await gather();$('rtcLocal').value=JSON.stringify(pc.localDescription);status('Offer ready. Copy to other device; no server contacted.')}catch(e){status('Offer failed: '+e.message)}};
$('rtcAnswer').onclick=async()=>{try{const remote=parse($('rtcRemote').value,'offer');newPc();await pc.setRemoteDescription(remote);await pc.setLocalDescription(await pc.createAnswer());await gather();$('rtcLocal').value=JSON.stringify(pc.localDescription);status('Answer ready. Copy back to offer device.')}catch(e){status('Answer failed: '+e.message)}};
$('rtcAccept').onclick=async()=>{try{if(!pc)throw Error('Create offer first');await pc.setRemoteDescription(parse($('rtcRemote').value,'answer'));status('Answer accepted; attempting direct peer connection.')}catch(e){status('Accept failed: '+e.message)}};
function parse(raw,type){if(raw.length>20000)throw Error('Signal too large');const o=JSON.parse(raw);if(o?.type!==type||typeof o.sdp!=='string'||o.sdp.length>19000)throw Error('Expected '+type+' SDP');return {type:o.type,sdp:o.sdp}}
$('rtcHello').onclick=()=>{try{const id=++sequence,challenge=randomChallenge();track(id,{type:'HELLO',id,challenge},challenge);status('HELLO sent; waiting for NOD challenge echo.')}catch(e){status(e.message)}};
$('rtcSend').onclick=()=>{try{const body=$('rtcText').value.trim();if(!body||body.length>200)throw Error('Enter 1–200 characters');const id=++sequence;track(id,{type:'TEXT',id,body});log('Sent: '+body)}catch(e){status(e.message)}};
$('rtcClose').onclick=cleanup;
window.addEventListener('pagehide',cleanup);
})();