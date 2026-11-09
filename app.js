const form=document.getElementById('chatForm');
const input=document.getElementById('prompt');
const send=document.getElementById('send');
const messagesEl=document.getElementById('messages');
const welcome=document.getElementById('welcome');
let history=[];

function addMessage(role, content, isError=false){
  const el=document.createElement('div');
  el.className='message '+role;
  if(role==='assistant'){
    const avatar=document.createElement('div'); avatar.className='avatar'; avatar.textContent='B';
    const body=document.createElement('div'); body.className='answer'+(isError?' error':''); body.textContent=content;
    el.append(avatar,body);
  } else { el.textContent=content; }
  messagesEl.appendChild(el);
  el.scrollIntoView({behavior:'smooth',block:'end'});
  return el;
}
async function ask(text){
  if(!text.trim()||send.disabled)return;
  welcome.style.display='none';
  addMessage('user',text);
  history.push({role:'user',content:text});
  input.value=''; input.style.height='auto'; send.disabled=true; send.textContent='…';
  const pending=addMessage('assistant','Thinking…');
  try{
    const response=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'Request failed');
    pending.querySelector('.answer').textContent=data.answer;
    history.push({role:'assistant',content:data.answer});
  }catch(err){
    pending.querySelector('.answer').textContent=err.message;
    pending.querySelector('.answer').classList.add('error');
    history.pop();
  }finally{send.disabled=false;send.textContent='↑';input.focus();}
}
form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px';});
document.querySelectorAll('.suggestion').forEach(btn=>btn.addEventListener('click',()=>ask(btn.dataset.prompt)));
function reset(){history=[];messagesEl.innerHTML='';welcome.style.display='block';input.value='';input.focus();}
document.getElementById('newChat').addEventListener('click',reset);
document.getElementById('mobileNew').addEventListener('click',reset);
