const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const url=process.env.DUNE_TEST_URL || 'http://127.0.0.1:3000/';
const empty={version:5,completed:[],coins:0,region:'oasis',companions:[],oasisTransition:'locked',transition:null,gatehouseReady:false,demoEnding:'locked'};
const guest={...empty,completed:['pumpHouse'],coins:40,companions:['keeper']};
const profile=(campaign=empty,revision=0)=>({revision,campaign,imported:false});
const launch=async()=>chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});

async function main(){
  const browser=await launch();
  try {
    const context=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
    await context.addInitScript(save=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify(save)),guest);
    const page=await context.newPage();
    let account='101',available=true,hasCampaign=false,cloud=profile(),posts=[];
    await page.route('**/leaderboard-api/dune-relay/**',async route=>{
      const request=route.request(),path=new URL(request.url()).pathname.split('/dune-relay')[1];
      if(!available){await route.abort();return;}
      const headers=request.headers();
      if(path!=='/session')assert.equal(headers['x-dune-account-id'],account,'account-bound request header');
      if(request.method()==='POST')posts.push(path);
      const body=path==='/session'?{accountId:account,displayName:`Player ${account}`,contentVersion:'chapter-3-3'}
        :path==='/campaign'?{accountId:account,hasCampaign,profile:hasCampaign?cloud:null}
        :path==='/campaign/import'?(hasCampaign=true,cloud=profile(guest,1),{profile:cloud})
        :path==='/logout'?{ok:true}
        :path?.endsWith('/finish')?(cloud=profile({...empty,completed:['pumpHouse'],coins:35,companions:['keeper']},1),{profile:cloud,reward:35})
        :{profile:cloud};
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
    });
    await page.goto(url);
    await page.getByText('Bring this device\'s progress?').waitFor();
    assert.equal(await page.locator('.coin-pill').innerText(),'40');
    await page.getByRole('button',{name:/Continue with this progress/}).click();
    await page.getByText('Saved to Portal').waitFor();
    assert.deepEqual(posts,['/campaign/import']);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('dune-relay-campaign-v5')).coins),40,'guest save remains separate');
    await page.getByRole('button',{name:/Enter the oasis/}).click();
    await page.locator('.awning-wipe').waitFor({state:'detached'});
    await page.getByRole('button',{name:'Settings'}).click();
    await page.getByRole('button',{name:'Sign out of Portal'}).click();
    await page.getByText('Saved on this device').waitFor();
    assert.equal(await page.locator('.coin-pill').innerText(),'40');
    account='202';hasCampaign=true;cloud=profile({...empty,completed:['pumpHouse'],coins:77,companions:['keeper']},1);
    await page.reload();
    await page.getByText('Player 202 · Saved to Portal').waitFor();
    assert.equal(await page.locator('.coin-pill').innerText(),'77','second account loads its campaign');
    available=false;
    await page.reload();
    await page.getByText('Sign in again').first().waitFor();
    assert.equal(await page.getByRole('button',{name:/Enter the oasis/}).isDisabled(),true,'account unavailable blocks entry');
    await page.getByRole('button',{name:'Play as guest on this device'}).click();
    assert.equal(await page.locator('.coin-pill').innerText(),'40','explicit guest choice restores guest');
    await context.close();

    const retryContext=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
    const finishId='123e4567-e89b-42d3-a456-426614174001';
    await retryContext.addInitScript(({empty,guest,finishId})=>{
      localStorage.setItem('dune-relay-last-portal-account-v1','303');
      localStorage.setItem('dune-relay-cloud-303-v1',JSON.stringify({profile:{revision:0,campaign:empty,imported:false},localSave:{...guest,coins:35},pending:[{kind:'finish',attemptId:finishId,levelId:'pumpHouse',remainingMoves:5,contentVersion:'chapter-3-3'}]}));
    },{empty,guest,finishId});
    const retryPage=await retryContext.newPage();let finishCalls=0,deliver=false;
    await retryPage.route('**/leaderboard-api/dune-relay/**',async route=>{
      const path=new URL(route.request().url()).pathname.split('/dune-relay')[1];
      if(path==='/attempts/'+finishId+'/finish'){
        finishCalls++;if(!deliver){await route.abort();return;}
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({profile:profile({...guest,coins:35},1),reward:35})});return;
      }
      const response=path==='/session'?{accountId:'303',displayName:'Player 303',contentVersion:'chapter-3-3'}:{accountId:'303',hasCampaign:true,profile:profile()};
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(response)});
    });
    await retryPage.goto(url);
    await retryPage.locator('.cloud-pill').filter({hasText:'Waiting to sync'}).waitFor();
    assert.equal(await retryPage.locator('.coin-pill').innerText(),'35','pending win shown during outage');
    deliver=true;await retryPage.reload();
    await retryPage.getByText('Saved to Portal').waitFor();
    assert.equal(await retryPage.evaluate(()=>JSON.parse(localStorage.getItem('dune-relay-cloud-303-v1')).pending.length),0,'same queued win cleared after success');
    assert(finishCalls>=2,'pending win retried after outage');
    await retryContext.close();

    const testContext=await browser.newContext({viewport:{width:1100,height:650},reducedMotion:'reduce'});
    const testPage=await testContext.newPage();let campaignCalls=0;
    await testPage.route('**/leaderboard-api/dune-relay/**',async route=>{campaignCalls++;await route.abort();});
    const testUrl=new URL(url);testUrl.searchParams.set('playtest','1');await testPage.goto(testUrl.href);
    await testPage.getByRole('button',{name:/Enter the oasis/}).waitFor();
    assert.equal(campaignCalls,0,'playtest skips cloud API');
    await testContext.close();
    console.log('Cloud browser checks passed: import, guest isolation, account switch, offline block, explicit guest, win retry, playtest isolation.');
  } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
