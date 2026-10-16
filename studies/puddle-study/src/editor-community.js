import {createCommunityClient,communityLink} from './community-client.js';
import {validatePublishedLevel} from './published-level-schema.js';

export function setupEditorCommunity({getDraft,exportDraft,validateDraft,importDraft,loadDraft,clearLocalLink,notify,
  client=createCommunityClient(),root=document}={}){
  const $=id=>root.getElementById(id),state={association:null,pending:null,busy:false,session:null,request:0};
  const message=text=>{$('community-status').textContent=text;notify?.(text);};
  const button=$('community-publish-button');
  const update=()=>{
    const a=state.association;
    $('community-linkage').textContent=a?`Editing ${a.title} · version ${a.version}${a.published?'':' · unpublished'}`:'New community level';
    button.textContent=a?'Publish new version':'Publish new level';button.disabled=state.busy||!state.session;
    $('community-unpublish').hidden=!a?.published;$('community-unpublish').disabled=state.busy;
    $('community-copy').hidden=!a?.published;$('community-copy').disabled=state.busy;
  };
  async function refreshSession(){const ticket=++state.request;$('community-auth').textContent='Checking Portal login…';
    try{const session=await client.session();if(ticket!==state.request)return;
      state.session=session;$('community-auth').textContent=session?`Signed in as ${session.displayName}`:
        'Guest mode · log in to portal.raidguild.org, then refresh this page or choose Refresh login.';
      update();if(session)await refreshMine();}
    catch(error){if(ticket===state.request){state.session=null;$('community-auth').textContent=error.message;update();}}
  }
  async function refreshMine(){if(!state.session)return;const ticket=state.request,list=$('community-mine-list');
    list.textContent='Loading your levels…';try{const data=await client.mine();if(ticket!==state.request)return;
      list.replaceChildren();if(!data.entries.length){list.textContent='No community levels yet.';return;}
      for(const entry of data.entries){const row=root.createElement('div');row.className='community-owned-row';
        const label=root.createElement('span');label.textContent=`${entry.title} · v${entry.version} · ${entry.published?'Published':'Hidden'}`;
        const load=root.createElement('button');load.type='button';load.textContent='Load for editing';
        load.onclick=()=>loadOwned(entry.id);row.append(label,load);list.append(row);}}
    catch(error){if(ticket===state.request)list.textContent=`Could not load levels: ${error.message}`;}
  }
  async function loadOwned(id){if(state.busy)return;state.busy=true;update();try{
    const entry=await client.owned(id),draft=importDraft(JSON.stringify(entry.document));
    loadDraft(draft);clearLocalLink();state.association={id:entry.id,version:entry.version,
      published:entry.published,title:entry.title};state.pending=null;
    $('community-description').value=entry.description;message(`Loaded your community level version ${entry.version}. Edits stay local until published.`);
  }catch(error){message(`Cannot load community level: ${error.message}`);}finally{state.busy=false;update();}}
  async function publish(){if(state.busy||!state.session)return;
    let documentValue;try{const draft=getDraft(),checks=validateDraft(draft);
      if(checks.errors.length)throw new Error(checks.errors[0]);
      documentValue=JSON.parse(exportDraft(draft));validatePublishedLevel(documentValue);
    }catch(error){message(`Cannot publish: ${error.message}`);return;}
    const description=$('community-description').value.trim(),association=state.association;
    const content=JSON.stringify({document:documentValue,description,association});
    if(state.pending?.content!==content)state.pending={content,requestId:crypto.randomUUID()};
    state.busy=true;update();message('Publishing…');
    try{const body={requestId:state.pending.requestId,document:documentValue,description};
      const result=association?await client.update(association.id,{...body,baseVersion:association.version}):await client.create(body);
      state.association={id:result.id,version:result.version,published:true,title:documentValue.draft.name};
      state.pending=null;message(`Published version ${result.version}. Share: ${communityLink(result.id,result.version)}`);
      await refreshMine();
    }catch(error){message(error.status===409?`Publish conflict: ${error.message} Your draft is safe. Refresh your owned level before retrying.`:
      `Publish failed: ${error.message} Retry will use the same request ID.`);}
    finally{state.busy=false;update();}
  }
  async function unpublish(){const association=state.association;if(!association||state.busy)return;
    state.busy=true;update();try{await client.unpublish(association.id,association.version);
      state.association={...association,published:false};message('Unpublished. Public links to every version are now unavailable.');await refreshMine();}
    catch(error){message(`Could not unpublish: ${error.message}`);}finally{state.busy=false;update();}}
  $('community-refresh').onclick=refreshSession;$('community-mine-refresh').onclick=refreshMine;
  button.onclick=publish;$('community-unpublish').onclick=unpublish;
  $('community-copy').onclick=async()=>{const a=state.association;if(!a)return;
    try{await navigator.clipboard.writeText(communityLink(a.id,a.version));message('Version link copied.');}
    catch{message(`Copy this link: ${communityLink(a.id,a.version)}`);}};
  const focus=()=>refreshSession();globalThis.addEventListener?.('focus',focus);
  update();refreshSession();
  return {clearAssociation(){state.association=null;state.pending=null;update();},
    get association(){return state.association;},dispose(){globalThis.removeEventListener?.('focus',focus);}};
}
