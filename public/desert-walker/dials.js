/* Keep the real range inputs: keyboard, touch and scene listeners share one value. */
(function () {
  const panel=document.querySelector('.atmosphere-panel');
  const grid=document.createElement('div');grid.className='dial-grid';panel.append(grid);
  const hint=document.createElement('p');hint.className='dial-hint';hint.textContent='Press a dial, then drag up or down';panel.append(hint);
  let active=null,drag=null;
  function endDrag(){if(!drag)return;const previous=drag;drag=null;previous.button.classList.remove('dial-dragging');if(previous.button.hasPointerCapture(previous.pointerId))previous.button.releasePointerCapture(previous.pointerId);}

  function close(restore=false){endDrag();if(!active)return;const previous=active;previous.popup.hidden=true;previous.button.setAttribute('aria-expanded','false');active=null;if(restore)previous.button.focus();}
  function position(item){
    const box=item.button.querySelector('.dial-face').getBoundingClientRect();
    const vw=window.visualViewport?.width||innerWidth,vh=window.visualViewport?.height||innerHeight;
    const width=44,height=163,fraction=(Number(item.input.value)-Number(item.input.min))/(Number(item.input.max)-Number(item.input.min));
    item.popup.style.left=Math.max(8,Math.min(box.left+box.width/2-width/2,vw-width-8))+'px';
    item.popup.style.top=Math.max(8,Math.min(box.top+box.height/2-9-(1-fraction)*145,vh-height-8))+'px';
  }
  const specs=[['sandstorm','Storm','storm-value'],['day-time','Time','time-value'],['headlight-intensity','Lights','headlight-value'],['meteor-intensity','Meteors','meteor-value'],['sound-volume','Sound','volume-value'],['radio-volume','Radio','radio-volume-value'],['radio-channel','Tuner','radio-status']];
  specs.forEach(([id,name,outputId])=>{
    const input=document.getElementById(id),label=panel.querySelector(`label[for="${id}"]`),output=document.getElementById(outputId);
    const button=document.createElement('button');button.type='button';button.className='dial-button';button.dataset.control=id;
    if(id.startsWith('radio-'))button.classList.add('radio-dial');
    button.innerHTML='<span class="dial-name"></span><span class="dial-face" aria-hidden="true"><span class="dial-pointer"></span></span><span class="dial-value"></span>';
    button.querySelector('.dial-name').textContent=name;
    const popup=document.createElement('div');popup.className='dial-popup';popup.id=id+'-popup';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label',label.firstChild.textContent.trim());
    input.setAttribute('aria-label',label.firstChild.textContent.trim());
    popup.append(label,input);if(id==='radio-channel')popup.append(output);
    document.querySelector('#experience').append(popup);grid.append(button);
    button.setAttribute('aria-controls',popup.id);button.setAttribute('aria-expanded','false');button.setAttribute('aria-haspopup','dialog');
    const item={button,popup,input};
    function sync(){const fraction=(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min));button.style.setProperty('--dial-angle',(-135+fraction*270)+'deg');let text=output.textContent.trim();const compact=id==='radio-channel'?(text.includes('Static')?'Static':text.split(' · ')[0]):text.split(' · ')[0];button.querySelector('.dial-value').textContent=compact;button.setAttribute('aria-label',name+': '+text);}
    input.addEventListener('input',sync);new MutationObserver(sync).observe(output,{childList:true,subtree:true,characterData:true});sync();
    function open(){close();active=item;popup.hidden=false;button.setAttribute('aria-expanded','true');position(item);input.focus({preventScroll:true});hint.hidden=true;}
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0 || !event.isPrimary || drag)return;
      event.preventDefault();open();
      drag={button,pointerId:event.pointerId,y:event.clientY,value:Number(input.value)};
      button.setPointerCapture(event.pointerId);button.classList.add('dial-dragging');
    });
    button.addEventListener('pointermove',event=>{
      if(!drag || drag.button!==button || drag.pointerId!==event.pointerId)return;
      const min=Number(input.min),max=Number(input.max),step=Number(input.step)||1;
      const rangeHeight=input.getBoundingClientRect().height || 145;
      const raw=drag.value+(drag.y-event.clientY)/rangeHeight*(max-min);
      const value=Math.max(min,Math.min(max,min+Math.round((raw-min)/step)*step));
      if(Number(input.value)!==value){input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));}
    });
    button.addEventListener('pointerup',event=>{if(drag?.pointerId===event.pointerId){endDrag();input.dispatchEvent(new Event('change',{bubbles:true}));close(true);}});
    ['pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,event=>{if(drag?.pointerId===event.pointerId)close();}));
    input.addEventListener('pointerup',()=>close(true));
    // Enter/Space and assistive activation still open the native range control.
    button.addEventListener('click',event=>{if(event.detail!==0)return;if(active===item)close(true);else open();});
  });
  const radioRow=document.createElement('div');radioRow.className='radio-dial-row';
  grid.querySelectorAll('.radio-dial').forEach(button=>radioRow.append(button));grid.append(radioRow);
  panel.querySelector('.cockpit-radio-controls')?.remove();
  const actions=document.createElement('div');actions.className='settings-actions';['motion-toggle','walk-toggle','reset-view'].forEach(id=>actions.append(document.getElementById(id)));panel.append(actions);
  panel.querySelector('summary').textContent='Settings';
  const camera=document.getElementById('camera-toggle'),home=camera.parentNode;const mobile=matchMedia('(max-width: 600px)');
  function layout(){close();panel.open=!mobile.matches;if(mobile.matches){document.querySelector('#experience').append(camera);camera.classList.add('camera-access');}else{home.prepend(camera);camera.classList.remove('camera-access');}}
  mobile.addEventListener('change',layout);layout();
  panel.addEventListener('toggle',()=>{if(!panel.open)close();});
  document.addEventListener('pointerdown',event=>{if(active&&!active.popup.contains(event.target)&&!active.button.contains(event.target))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();close(true);}});
  document.addEventListener('focusin',event=>{if(active&&!active.popup.contains(event.target)&&event.target!==active.button)close();});
  document.addEventListener('cockpit-view-change',()=>close());
  window.addEventListener('blur',()=>close());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)close();});
  window.addEventListener('resize',()=>{if(active)position(active);});
  panel.addEventListener('scroll',()=>{if(active)position(active);});
})();
