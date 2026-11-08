// Story: the STORY2 main quest runs through the open world. Every trigger type (enter, clearRegion, boss, talk) along the whole chain,
// rewards, the Hollow Throne seal lifting on its unlock step, the ending card, and the hub after the ending.
module.exports = async ({ page, HM, step, log, assert, shot }) => {
  const idle = () => page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  const tank = () => HM('(HM.player.maxHp=HM.player.hp=1e5,1)');
  const go = async (id) => { await HM(`HM.travelTo("${id}",null)`); await idle(); await tank(); await step(.3); };
  const cur = () => HM('HM.mainCur()&&HM.mainCur().id');
  const killAll = () => HM('(HM.enemies.forEach(e=>{if(!e.dead&&!e.dummy)e.die(null,new HM.V3(),null);}),1)');
  const score = () => HM('[HM.SAVE.prog.gold,HM.SAVE.prog.level*1e6+HM.SAVE.prog.xp]');
  await idle();
  await HM('(HM.mainReset(),HM.PROG.reset(),HM.SAVE.quests={active:{},done:[]},1)');
  await HM('HM.enterHub()'); await idle(); await step(1);
  assert(await cur() === 'm1_edgewood', 'fresh state: step 1 (The Edge of the Wood) is active');
  const obj = await HM('HM.mainLine()');
  log('objective:', obj);
  assert(/Edgewood/.test(obj), 'step 1 has an objective');
  assert(await HM('HM.narrQ.length') <= 6 && await HM('HM.MQ.pend.length') >= 2, 'prologue is paced: queued in chunks, not dumped');
  assert(/Edgewood/.test(await HM('HM.VIL.hq&&HM.VIL.hq.textContent')), 'desktop HUD shows the main objective');
  await step(2);
  await shot('story-hud');
  await HM('HM.toggleMap()'); await step(.3); await shot('story-map'); await HM('HM.toggleMap()');
  assert(await HM('HM.regionSealed(HM.REGION_AT["2,0"])'), 'Hollow Throne is sealed at the start');
  const s0 = await score();
  const seen = new Set();
  for (let guard = 0; guard < 14; guard++) {
    const id = await cur(); if (!id) break;
    const m = await HM(`(()=>{const m=HM.MAIN.find(x=>x.id==="${id}");return {region:m.region,t:m.trigger,unlocks:m.unlocks||null};})()`);
    seen.add(m.t.type);
    if (m.unlocks) assert(await HM(`HM.regionSealed(HM.REGION_AT["${m.unlocks}"])`), `${m.unlocks} is sealed before ${id}`);
    if (m.t.type === 'enter') {
      await go(m.t.region);
    } else if (m.t.type === 'clearRegion') {
      if (await HM('HM.state.region') !== m.t.region) await go(m.t.region);
      const n = await HM(`HM.regionState["${m.t.region}"].camps.length`);
      for (let i = 0; i < n; i++) {
        if (await HM(`HM.regionState["${m.t.region}"].camps[${i}].cleared`)) continue;
        await HM(`(()=>{const c=HM.regionState["${m.t.region}"].camps[${i}],r=Math.hypot(c.x,c.z),k=(r-7)/r;HM.teleportRig(c.x*k,c.z*k,0);})()`);
        await tank(); await step(3); await killAll(); await step(1);
      }
    } else if (m.t.type === 'boss') {
      if (await HM('HM.state.region') !== m.t.region) await go(m.t.region);
      else { await HM('HM.mainFlush()'); await step(1); await HM('HM.mainFlush()'); await step(1); }
      await HM('HM.teleportRig(0,7,0)'); await tank(); await step(1);
      const b = await HM(`(()=>{const e=HM.enemies.find(e=>!e.dead&&e.bossName===${JSON.stringify(m.t.boss.name)});return e?{boss:e.boss,bar:HM.bossPanel.mesh.visible}:null;})()`);
      assert(b && b.boss && b.bar, `${m.t.boss.name} rises in ${m.t.region} with a boss bar`);
      await HM(`HM.enemies.find(e=>!e.dead&&e.bossName===${JSON.stringify(m.t.boss.name)}).die(null,new HM.V3(),null)`);
      await step(1);
    } else if (m.t.type === 'talk') {
      if (await HM('HM.state.region') !== m.region) await go(m.region);
      // stand next to the villager: dialogues close when the player is more than 4 m away
      await HM(`(()=>{const v=HM.VIL.list.find(u=>u.d.id==="${m.t.npc}");if(v)HM.teleportRig(v.pos.x+1.2,v.pos.z+1.2,0);return 1;})()`);
      await HM(`HM.talkTo("${m.t.npc}")`);
      assert(await HM("HM.VD.end==='main'&&HM.VDLG.mesh.visible"), `talking to ${m.t.npc} opens the main-quest page`);
      for (let i = 0; i < 10 && await HM('!!HM.VD.v'); i++) await HM("HM.vDlgClick(HM.VD.i>=HM.VD.lines.length-1?'bye':'next')");
    }
    assert(await HM(`HM.SAVE.main.includes("${id}")`), `${id} (${m.t.type}) completes`);
    if (m.unlocks) {
      assert(!(await HM(`HM.regionSealed(HM.REGION_AT["${m.unlocks}"])`)), `${m.unlocks} opens after ${id}`);
      assert(await HM(`HM.W.gates.filter(g=>g.target==="${m.unlocks}").every(g=>!g.sealed)`), 'the gate into it thaws in place');
    }
  }
  const total = await HM('HM.MAIN.length');
  assert(await HM('HM.SAVE.main.length') === total && await cur() === null, `full main chain completes (${total} steps)`);
  assert(['enter', 'clearRegion', 'boss', 'talk'].every(t => seen.has(t)), 'all four trigger types exercised');
  const s1 = await score();
  log('gold', s0[0], '->', s1[0], ' level*1e6+xp', s0[1], '->', s1[1]);
  assert(s1[0] > s0[0] && s1[1] > s0[1], 'gold and xp rose along the chain');
  for (let i = 0; i < 30 && !(await HM('HM.endPanel.mesh.visible')); i++) { await HM('HM.mainFlush()'); await step(1); }
  assert(await HM('HM.endPanel.mesh.visible'), 'ending card shown after the ending lines');
  await shot('story-end');
  await HM('HM.endPanel.onClick("cont")');
  assert(!(await HM('HM.endPanel.mesh.visible')), 'Continue exploring closes the card');
  await go('1,2');
  assert(!(await HM("HM.VIL.list.some(v=>v.d.id==='idris')")) && await HM("HM.VIL.list.some(v=>v.d.id==='wren')"), 'after the ending Idris is gone from the yard, Wren remains');
  await go('2,2');
  assert(await HM('HM.regionState["2,2"].camps.length') > 0, 'the world stays open after the ending');
};
