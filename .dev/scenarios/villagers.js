// Villagers: hub population + wandering, bark bubbles, kill/fetch quest flow, merchant shop, dialogue shot.
module.exports = async ({ page, HM, step, log, assert, shot }) => {
  if (await HM('HM.state.region') !== '1,2') { await HM('HM.travelTo(HM.HUB_ID||"1,2")'); await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 }); await step(1); }
  await HM('HM.narrQ.length=0');
  const n = await HM('HM.VIL.list.length');
  assert(n >= 11, `hub has >=11 villagers (${n})`);
  const p0 = await HM('HM.VIL.list.map(v=>[v.pos.x,v.pos.z])');
  await HM('HM.teleportRig(0,30,0)'); // out of the way so nobody stops to face us
  await step(20);
  const p1 = await HM('HM.VIL.list.map(v=>[v.pos.x,v.pos.z])');
  const moved = p0.filter((p, i) => Math.hypot(p[0] - p1[i][0], p[1] - p1[i][1]) >= 2).length;
  log('moved >=2m in 20s:', moved, '/', n);
  assert(moved >= Math.ceil(n / 2), 'at least half the villagers wander >=2 m in 20 s');
  // stand next to a wanderer -> bark bubble
  const vi = await HM("HM.VIL.list.findIndex(v=>v.kind==='wander')");
  await HM(`(()=>{const v=HM.VIL.list[${vi}];v.barkCD=0;HM.teleportRig(v.pos.x+1.5,v.pos.z+1.5,Math.atan2(-1.5,-1.5));})()`);
  await step(1);
  assert(await HM('HM.VBUB.some(b=>b.v&&b.p.mesh.visible)'), 'standing next to a villager shows a bark bubble');
  assert(await HM(`HM.VIL.list[${vi}].face===true`), 'villager stops and faces the player within 2.5 m');
  // kill quest: Aldous' wraith hunt (requires sq_doubt1 done)
  await HM("HM.PROG.reset(),HM.SAVE.quests={active:{},done:['sq_doubt1']},HM.SAVE.prog.level=5");
  assert(await HM("HM.acceptQuest('sq_doubt2')"), 'kill quest accepted');
  for (let i = 0; i < 6; i++) await HM("HM.questOnKill({type:'wraith',tier:2})");
  assert(await HM("HM.qReady(HM.SQ_AT.sq_doubt2)"), 'six wraith kills make the quest ready');
  await step(1);
  assert(await HM("HM.VIL.list.find(v=>v.d.id==='aldous').markK==='?'"), 'giver shows ? marker');
  const g0 = await HM('HM.SAVE.prog.gold'), x0 = await HM('HM.SAVE.prog.xp+HM.SAVE.prog.level*1e5');
  await HM("HM.talkTo('aldous')");
  assert(await HM("HM.VD.end==='done'"), 'talking to the giver opens the turn-in lines');
  for (let i = 0; i < 6 && await HM('!!HM.VD.v'); i++) await HM("HM.vDlgClick(HM.VD.i>=HM.VD.lines.length-1?'bye':'next')");
  log('turn-in:', await HM("JSON.stringify([HM.SAVE.quests.done,HM.SAVE.prog.gold,HM.SAVE.prog.xp,HM.SAVE.prog.level,!!HM.VD.v])"), g0, x0);
  assert(await HM("HM.SAVE.quests.done.includes('sq_doubt2')") && await HM('HM.SAVE.prog.gold') > g0 && await HM('HM.SAVE.prog.xp+HM.SAVE.prog.level*1e5') > x0, 'turn-in grants gold and xp');
  // offer dialogue shot: Nell offers Tam's carved fox
  await HM("(()=>{const v=HM.VIL.list.find(v=>v.d.id==='nell');v.pos.set(2,0,4);v.st='idle';v.t=99;HM.teleportRig(2,5.8,0);})()");
  await step(0.5);
  await HM("HM.talkTo('nell')");
  assert(await HM("HM.VD.end==='offer'&&HM.VDLG.mesh.visible"), 'quest giver opens an offer dialogue');
  await step(0.3);
  await shot('dialogue');
  while (await HM("HM.VD.i<HM.VD.lines.length-1")) await HM("HM.vDlgClick('next')");
  await HM("HM.vDlgClick('accept')");
  assert(await HM("!!HM.SAVE.quests.active.sq_tam1"), 'fetch quest accepted via the dialogue');
  assert(/Carved Fox|carved fox|Edgewood/i.test(await HM('HM.questLine()')), 'quest line tracks the fetch quest: ' + await HM('HM.questLine()'));
  // fetch: travel to Edgewood, questOnRegion spawns the pickup, walking onto it collects it
  await HM("HM.travelTo('2,2',null)");
  await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  await HM("HM.questOnRegion(HM.REGIONS.find(r=>r.id==='2,2'))");
  assert(await HM('HM.VIL.pickups.length') === 1, 'fetch pickup spawned in the region');
  await HM('(()=>{const p=HM.VIL.pickups[0].pos;HM.teleportRig(p.x+.3,p.z,0);})()');
  await step(0.5);
  assert(await HM('HM.SAVE.quests.active.sq_tam1.got===true') && await HM('HM.VIL.pickups.length') === 0, 'walking onto the pickup collects it');
  await HM('HM.enterHub()');
  await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  assert(await HM('HM.VIL.list.length') >= 11, 'villagers respawn on returning to the hub');
  // merchant: buy without and with gold
  await HM("HM.SAVE.prog.gold=0,HM.talkTo('odo')");
  assert(await HM("HM.VD.mode==='shop'"), 'merchant opens the shop');
  const it = await HM("HM.PROG.shop.find(s=>!s.minLevel&&!HM.SAVE.weapons.includes(s.id))");
  await HM(`HM.vDlgClick('buy:${it.id}')`);
  assert(/not enough gold/.test(await HM('HM.VD.msg')) && !(await HM(`HM.SAVE.weapons.includes('${it.id}')`)), 'buying without gold is refused');
  await HM(`HM.SAVE.prog.gold=5000,HM.vDlgClick('buy:${it.id}')`);
  assert(await HM(`HM.SAVE.weapons.includes('${it.id}')`) && await HM('HM.SAVE.prog.gold') === 5000 - it.price, `buying ${it.id} with gold succeeds and deducts the price`);
  await HM("HM.vDlgClick('bye')");
  // villagers close-up shot
  await HM("(()=>{const L=HM.VIL.list;L.slice(0,6).forEach((v,i)=>{v.pos.set(-3+i*1.2,0,3+(i%2)*.6);v.st='idle';v.t=99;v.yaw=0;v.face=false;});HM.teleportRig(0,7.5,0);HM.VIL.list.forEach(v=>v.barkCD=99);})()");
  await step(0.2);
  await HM("HM.VIL.list.slice(0,6).forEach(v=>{v.face=false;v.yaw=0;})");
  await shot('villagers');
};
