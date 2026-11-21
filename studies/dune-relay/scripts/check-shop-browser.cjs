const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const url=process.env.DUNE_TEST_URL || 'http://127.0.0.1:3101/dune-relay/?playtest=1';
const publicUrl=process.env.DUNE_PUBLIC_URL || 'http://127.0.0.1:3102/dune-relay/';

async function openShop(browser,coins,viewport={width:844,height:390}) {
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  await context.addInitScript(value=>localStorage.setItem('dune-relay-playtest-wallet-v1',JSON.stringify({version:1,coins:value})),coins);
  const page=await context.newPage();
  await page.goto(url);
  await page.getByRole('button',{name:/Enter the oasis/}).click();
  await page.getByRole('button',{name:'Settings'}).click();
  await page.getByRole('button',{name:'Replay PUMP HOUSE',exact:true}).click();
  return {context,page};
}

async function boardReady(page) {
  const lesson=page.getByRole('button',{name:'Skip lesson'});
  if(await lesson.isVisible().catch(()=>false)) await lesson.click();
  await page.locator('canvas[data-play-ready="true"]').waitFor({timeout:30000});
}

async function main() {
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    const poor=await openShop(browser,65,{width:667,height:375});
    const card=poor.page.getByRole('button',{name:/Water Jet.*300 coins/});
    assert.equal(await card.isDisabled(),true,'65 coins cannot select a 300 coin Jet');
    assert.match(await card.innerText(),/Need 235 more/);
    assert.equal(await poor.page.getByRole('button',{name:/Start level · Free/}).isEnabled(),true);
    const poorBox=await poor.page.locator('.booster-shop').boundingBox();
    assert.ok(poorBox && poorBox.y>=0 && poorBox.y+poorBox.height<=375,'small landscape shop fits vertically');
    await poor.page.getByRole('button',{name:/Start level · Free/}).click();
    await boardReady(poor.page);
    assert.equal(await poor.page.locator('.coin-pill').innerText(),'65','free start does not charge');
    await poor.context.close();

    const free=await openShop(browser,600);
    await free.page.getByRole('button',{name:/Water Jet.*300 coins/}).click();
    assert.equal(await free.page.getByRole('button',{name:/Prism.*500 coins/}).isDisabled(),true,'combined 800 coin loadout blocked');
    assert.equal(await free.page.getByRole('button',{name:/Flywheel.*300 coins/}).isEnabled(),true);
    await free.page.getByRole('button',{name:/Play without boosters/}).click();
    await boardReady(free.page);
    assert.equal(await free.page.locator('.coin-pill').innerText(),'600','explicit free path ignores previously selected Jet');
    await free.context.close();

    const paid=await openShop(browser,600,{width:1280,height:720});
    await paid.page.getByRole('button',{name:/Water Jet.*300 coins/}).click();
    await paid.page.getByRole('button',{name:/Start level · 300 coins/}).click();
    await boardReady(paid.page);
    assert.equal(await paid.page.locator('.coin-pill').innerText(),'300','one paid Jet charges once');
    await paid.context.close();
    const story=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
    await story.addInitScript(()=>localStorage.setItem('dune-relay-campaign-v5',JSON.stringify({version:5,completed:['pumpHouse'],coins:65,region:'oasis',companions:['keeper'],oasisTransition:'locked',transition:null,gatehouseReady:false,farmlandReady:false,demoEnding:'locked',farmlandEnding:'locked'})));
    const map=await story.newPage(); await map.goto(publicUrl); await map.getByRole('button',{name:/Enter the oasis/}).click();
    const tapPump=async()=>{const box=await map.locator('canvas').boundingBox();const scale=box.width/960,top=540-box.height/scale;await map.mouse.click(box.x+730*scale,box.y+(310-top)*scale);};
    await map.locator('.awning-wipe').waitFor({state:'detached'});await tapPump();
    await map.getByRole('button',{name:'Back to story'}).waitFor({timeout:15000});
    await map.getByRole('button',{name:/Start level/}).click();
    await map.getByRole('button',{name:'Back',exact:true}).click();
    await map.getByRole('button',{name:'Back to story'}).click();
    assert.equal(await map.locator('.dialog-card').count(),0,'briefing exits to map');
    await tapPump();await map.getByRole('button',{name:'Back to story'}).waitFor({timeout:15000});
    await story.close();
    console.log('Shop browser checks passed: low-balance choices, free bypass, cumulative affordability, paid charge, mobile and desktop; briefing exits and reopens.');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
