// Review fixes: borrowed enemy weapons, travel that survives a bad save, clear quests after acceptance, no death during the travel fade.
module.exports = async ({ page, HM, step, log, assert }) => {
  const idle = () => page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  const travel = async (id, dir) => { const r = await HM(`HM.travelTo(${JSON.stringify(id)},${dir ? JSON.stringify(dir) : 'null'}).then(()=>'ok',e=>'threw: '+e.message)`); await idle(); return r; };
  await idle();
  await HM('HM.PROG.reset()');

  // 1. an enemy's weapon is usable in the fight but is never kept
  await travel('0,2', 'E');
  const own0 = await HM('HM.SAVE.weapons.join()');
  const got = await HM(`(()=>{const h=HM.hands[0];h.held=null;const e=new HM.Enemy('bandit',new HM.V3(HM.headPos.x+2,0,HM.headPos.z),null);
    const w=e.weapon;e.die(null,new HM.V3(),null);if(!w||w.owner!=='loot')return 'no loot weapon';
    w.obj.position.copy(h.pos);w.obj.updateMatrixWorld(true);HM.tryGrab(h);if(h.held!==w)return 'grab missed';
    window.__loot=w;return w.id;})()`);
  log('grabbed enemy weapon:', got);
  assert(['longsword', 'axe', 'mace'].includes(got), 'a dead bandit\'s weapon can be picked up');
  const hol = await HM('(()=>{const w=window.__loot;const r=HM.holster(w,2);return {r,state:w.state,toast:HM.PROG.toast};})()');
  assert(hol.r === false && hol.state === 'held', 'holstering an enemy weapon is refused');
  assert(/Not yours to keep/.test(hol.toast), 'refusal says "Not yours to keep"');
  await travel('1,2', 'W');
  const after = await HM('({gone:!HM.weapons.includes(window.__loot),loot:HM.weapons.filter(w=>w.loot).length,own:HM.SAVE.weapons.join(),held:!!HM.hands[0].held&&HM.hands[0].held===window.__loot})');
  log('after travel:', JSON.stringify(after));
  assert(after.gone && after.loot === 0 && !after.held, 'the borrowed weapon dissolves on travel');
  assert(after.own === own0, 'SAVE.weapons is unchanged');

  // 2. an unknown active quest id does not strand the loading screen
  await HM('HM.SAVE.quests.active={bogus:{n:0}}');
  const r2 = await travel('0,2', 'E');
  const m2 = await HM('({mode:HM.state.mode,load:HM.loadPanel.mesh.visible,region:HM.state.region})');
  log('travel with a bogus quest:', r2, JSON.stringify(m2));
  assert(m2.mode === 'play' && !m2.load, 'travel with an unknown quest id ends in play');
  await HM('(()=>{HM.SAVE.quests.active={};if(HM.state.mode!=="play"){HM.loadPanel.mesh.visible=false;HM.state.mode="play";HM.fadeTo(0);}})()');

  // 3. a clear quest needs the camps cleared after it was accepted
  await travel('1,1', 'S');
  await HM(`(()=>{const q=HM.SQ_AT.sq_hermit,s=HM.SAVE.quests;delete s.active[q.id];s.done=s.done.filter(i=>i!==q.id);if(q.requires&&!s.done.includes(q.requires))s.done.push(q.requires);
    window.__lv=HM.SAVE.prog.level;HM.SAVE.prog.level=Math.max(HM.SAVE.prog.level,q.minLevel);
    for(const c of HM.regionState["1,1"].camps){c.cleared=true;c.t=HM.clockNow();}})()`);
  await step(.2);
  const q = await HM('HM.acceptQuest("sq_hermit")');
  assert(q === true, 'the hermit\'s clear quest is accepted');
  assert(await HM('HM.qReady(HM.SQ_AT.sq_hermit)') === false, 'camps cleared before accepting do not complete it');
  await step(.2);
  await HM('(()=>{for(const c of HM.regionState["1,1"].camps){c.cleared=true;c.t=HM.clockNow();}})()');
  assert(await HM('HM.qReady(HM.SQ_AT.sq_hermit)') === true, 'camps cleared after accepting complete it');
  await HM('(()=>{delete HM.SAVE.quests.active.sq_hermit;HM.SAVE.prog.level=window.__lv;})()');

  // 4. a lethal hit during the travel fade does nothing
  await HM('(()=>{HM.SAVE.prog.gold=100;HM.player.hp=HM.player.maxHp;HM.player.invuln=0;})()');
  const deaths = await HM('HM.state.deaths');
  await HM('(HM.travelTo("2,2","W"),0)');
  await HM('(HM.player.invuln=0,HM.hurtPlayer(99999,null),0)');
  const dead = await HM('HM.player.dead');
  await idle();
  await page.waitForTimeout(3600);
  const r4 = await HM('({gold:HM.SAVE.prog.gold,region:HM.state.region,deaths:HM.state.deaths,dead:HM.player.dead,mode:HM.state.mode})');
  log('after a hit during the fade:', dead, JSON.stringify(r4));
  assert(!dead && r4.gold === 100 && r4.region === '2,2' && r4.deaths === deaths && !r4.dead && r4.mode === 'play', 'no death, gold penalty or respawn from a hit during travel');
};
