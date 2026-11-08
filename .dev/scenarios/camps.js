// Camps: regions are populated by tier-scaled enemy camps that wake, clear, respawn; patrols; region death; world map.
module.exports = async ({ page, HM, step, log, assert, shot }) => {
  const idle = () => page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  const put = (x, z, yaw = 0) => HM(`(()=>{const r=HM.rig,c=new HM.V3();r.rotation.y=${yaw};r.updateMatrixWorld(true);HM.camera.getWorldPosition(c);r.position.x+=(${x})-c.x;r.position.z+=(${z})-c.z;r.position.y=HM.floorY(${x},${z});})()`);
  const camps = id => HM(`HM.regionState["${id}"].camps.map(c=>({x:c.x,z:c.z,kind:c.kind,m:c.members.slice(),cleared:c.cleared,t:c.t,elite:c.elite||null}))`);
  const alive = () => HM('HM.enemies.filter(e=>!e.dead&&!e.dummy).length');
  // stand 7 m from a camp, on the side toward the region centre
  const near = c => { const r = Math.hypot(c.x, c.z), k = (r - 7) / r; return put(c.x * k, c.z * k, Math.atan2(c.x, c.z) + Math.PI); };
  await idle();
  await HM('HM.PROG.reset()');
  await HM('HM.travelTo("2,2","W")'); await idle();
  let cs = await camps('2,2');
  log('Edgewood camps:', cs.map(c => `${c.kind}@${c.x.toFixed(0)},${c.z.toFixed(0)}[${c.m.join('/')}]`).join(' '));
  assert(cs.length >= 3 && cs.length <= 5, 'Edgewood has 3-5 camps');
  assert(cs.every(c => c.m.length >= 2 && c.m.length <= 3 && c.m.every(t => t === 'bandit' || t === 'archer')), 'tier-1 camps hold 2-3 bandits/archers');
  assert(cs.every(c => c.m.filter(t => t === 'archer').length <= 1), 'at most one archer in a small camp');
  assert(cs.every(c => { const r = Math.hypot(c.x, c.z); return r >= 14 && r <= 36; }), 'camps sit 14-36 m from the centre');
  assert(await HM('HM.regionState["2,2"].camps.every(c=>HM.roadD(c.x,c.z)>=6&&HM.W.gates.every(g=>Math.hypot(c.x-g.x,c.z-g.z)>=10))'), 'camps are off the roads and away from gates');
  assert(cs.every(c => !c.elite), 'no elite camp at tier 1');
  const regen = await HM('JSON.stringify(HM.genCamps(HM.REGION_AT["2,2"]).map(c=>[c.x,c.z,c.kind,c.members]))');
  assert(regen === JSON.stringify(cs.map(c => [c.x, c.z, c.kind, c.m])), 'camp layout is deterministic for the region seed');

  const c0 = cs[0];
  await near(c0); await step(3);
  const woke = await HM(`HM.enemies.filter(e=>!e.dead&&!e.dummy&&Math.hypot(e.pos.x-(${c0.x}),e.pos.z-(${c0.z}))<10).length`);
  log('woke near camp 0:', woke, 'of', c0.m.length);
  assert(woke === c0.m.length, 'walking near a camp raises its group around it');
  await shot('camp');
  const xp0 = await HM('HM.SAVE.prog.xp+HM.SAVE.prog.level*1e6');
  await HM('HM.enemies.filter(e=>!e.dead&&!e.dummy).forEach(e=>e.die(null,new HM.V3(),null))');
  await step(1);
  cs = await camps('2,2');
  assert(cs[0].cleared, 'killing every member clears the camp');
  assert(await HM('HM.SAVE.prog.xp+HM.SAVE.prog.level*1e6') > xp0, 'camp kills grant XP');
  await step(3);
  assert(await alive() === 0, 'a cleared camp stays cleared');

  // respawn rule: cleared >180 s ago comes back on re-entry, a fresh clear does not
  await HM('(()=>{const c=HM.regionState["2,2"].camps;c[1].cleared=true;c[1].t=HM.clockNow();c[0].t=HM.clockNow()-200;})()');
  await HM('HM.travelTo("1,2","E")'); await idle();
  await HM('HM.travelTo("2,2","W")'); await idle();
  cs = await camps('2,2');
  assert(!cs[0].cleared && cs[1].cleared, 'on re-entry a camp cleared >180 s ago respawns, a recent clear stays');

  // patrol: timer elapses -> a pair comes up a road from a gate
  await put(0, 0, 0);
  await HM('HM.patrol.t=0.05'); await step(0.5);
  const pat = await HM('HM.enemies.filter(e=>!e.dead&&e.patrol).map(e=>Math.hypot(e.pos.x,e.pos.z))');
  log('patrol spawned at r =', pat.map(r => r.toFixed(1)).join(','));
  assert(pat.length === 2 && pat.every(r => r > 30), 'a patrol pair appears near a gate');
  const pt = await HM('HM.patrol.t');
  assert(pt >= 40 && pt <= 80, 'next patrol in 40-80 s');

  // Frostfang (tier 3): tier-3 types, an elite with a boss bar
  await HM('HM.travelTo("2,1","S")'); await idle();
  cs = await camps('2,1');
  log('Frostfang camps:', cs.map(c => `${c.kind}[${c.m.join('/')}]${c.elite ? ' elite=' + c.elite : ''}`).join(' '));
  assert(cs.length >= 3 && cs.length <= 5 && cs.every(c => c.m.length >= 3 && c.m.length <= 4), 'tier-3 camps hold 3-4');
  assert(cs.some(c => c.m.some(t => t === 'knight' || t === 'wraith')), 'tier-3 camps include knights or wraiths');
  assert(cs.every(c => c.m.filter(t => t === 'archer' || t === 'wraith').length <= 2), 'at most two ranged per camp');
  const ei = cs.findIndex(c => c.elite);
  assert(ei >= 0 && cs.filter(c => c.elite).length === 1, 'exactly one elite camp');
  await near(cs[ei]); await step(3);
  const el = await HM('(()=>{const e=HM.enemies.find(e=>!e.dead&&e.elite);return e&&{name:e.bossName,boss:e.boss,tier:e.tier,bar:HM.bossPanel.mesh.visible}})()');
  log('elite:', JSON.stringify(el));
  assert(el && el.name === cs[ei].elite && el.boss && el.bar, 'elite leader spawns with its name and the boss bar');
  const ex = await HM("(()=>{const e=HM.enemies.find(e=>!e.dead&&e.elite);return [HM.grantKillXP({type:e.type,tier:e.tier,boss:e.bossName}),HM.grantKillXP({type:e.type,tier:e.tier,boss:e.bossName,elite:true})]})()");
  log('boss xp vs elite xp:', ex.join(' / '));
  assert(ex[1] > 0 && ex[1] < ex[0], 'elite XP uses the elite bonus, not the chapter-boss bonus');

  // death in a region: back at the arrival gate, gold -10%, camps reset
  await HM('HM.SAVE.prog.gold=200');
  await HM('HM.onPlayerDeath()');
  await step(.1);
  const head = await HM('[HM.headPos.x,HM.headPos.z,HM.player.hp,HM.player.maxHp,HM.player.dead]');
  log('after death:', head.map(v => typeof v === 'number' ? v.toFixed(1) : v).join(','));
  assert(head[1] > 30 && Math.abs(head[0]) < 6, 'respawn at the south (arrival) gate');
  assert(head[2] === head[3] && head[4] === false, 'respawn at full health');
  assert(await HM('HM.SAVE.prog.gold') === 180, 'death costs 10% of the gold');
  assert(await alive() === 0 && !(await HM('HM.bossPanel.mesh.visible')), 'live enemies despawn and the boss bar hides');
  assert(!(await camps('2,1'))[ei].cleared, 'the elite camp is still uncleared');
  await near(cs[ei]); await step(3);
  assert(await HM('HM.enemies.some(e=>!e.dead&&e.elite)'), 'the reset camp rises again when approached');

  // world map: desktop M panel and the hub board
  await HM('HM.toggleMap()'); await step(.3);
  assert(await HM('HM.mapPanel.mesh.visible'), 'M toggles the map panel');
  await shot('mappanel');
  await HM('HM.toggleMap()');
  await HM('HM.travelTo(HM.HUB_ID,null)'); await idle();
  await put(-4, -7.4, 0); await step(.3);
  assert(await HM('HM.menu.buttons.every(b=>!/^ch/.test(b.id))'), 'hub board has no chapter buttons');
  await shot('worldmap');
};
