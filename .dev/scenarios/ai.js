// Enemy AI: tier scaling, attacks land, archer spacing, wraith blink, blade-intercept guard.
module.exports = async ({ HM, step, log, assert }) => {
  await HM('HM.startChapter(1)');
  await step(1);
  // No story waves: we spawn our own enemies. Tank the player so death never resets the area.
  await HM('(HM.state.pendingWave=null,HM.state.queue=[],HM.player.maxHp=HM.player.hp=5000,1)');
  const clear = () => HM('(HM.enemies.forEach(e=>{if(!e.dead){e.die(null,new HM.V3(),null);}}),1)');
  const spawn = (type, dx, dz) => HM(`(()=>{const h=HM.headPos,f=new HM.V3(),e=null;HM.camera.getWorldDirection(f);f.y=0;f.normalize();const r=new HM.V3(-f.z,0,f.x);
    const en=new HM.Enemy('${type}',new HM.V3(h.x+f.x*${dz}+r.x*${dx},0,h.z+f.z*${dz}+r.z*${dx}),null);return HM.enemies.indexOf(en);})()`);

  // Tier scaling at construction
  const stats = {};
  for (const tier of [1, 5]) {
    await HM(`(HM.state.tier=${tier},1)`);
    const i = await spawn('bandit', 0, 3);
    stats[tier] = await HM(`(()=>{const e=HM.enemies[${i}];return {hp:e.maxHp,tok:e.tokenCap,poise:e.poise,guard:e.guardP,tier:e.tier};})()`);
    await clear(); await step(.5);
  }
  log('tier1', JSON.stringify(stats[1]), 'tier5', JSON.stringify(stats[5]));
  assert(stats[5].hp > stats[1].hp * 2, 'tier 5 HP higher than tier 1');
  assert(stats[5].tok > stats[1].tok, 'tier 5 has more attack tokens than tier 1');

  // Fight at tier 1 and tier 5: player stands still, enemies must land hits
  for (const tier of [1, 5]) {
    await HM(`(HM.state.tier=${tier},HM.player.hp=5000,1)`);
    for (const [t, dx, dz] of [['bandit', -1, 3], ['knight', 1, 3.5], ['skeleton', 0, 4], ['brute', 2, 4]]) await spawn(t, dx, dz);
    const hp0 = await HM('HM.player.hp');
    await step(20);
    const hp1 = await HM('HM.player.hp');
    const st = await HM('HM.enemies.filter(e=>!e.dead).map(e=>e.type+":"+JSON.stringify(e.st)).join(" ")');
    log(`tier ${tier} damage taken in 20s:`, Math.round(hp0 - hp1), st);
    assert(hp1 < hp0, `tier ${tier} enemies attack and hurt the player`);
    await clear(); await step(.5);
  }

  // Archer spacing + wraith blink
  await HM('(HM.state.tier=3,HM.player.hp=5000,1)');
  const ai = await spawn('archer', 0, 5), wi = await spawn('wraith', 3, 7);
  await HM(`(HM._a=HM.enemies[${ai}],HM._wr=HM.enemies[${wi}],1)`);
  let sum = 0, n = 0;
  for (let k = 0; k < 20; k++) {
    await step(1);
    sum += await HM(`(()=>{const e=HM._a;return Math.hypot(e.pos.x-HM.headPos.x,e.pos.z-HM.headPos.z);})()`); n++;
  }
  const blinks = await HM(`HM._wr.st.blink`), shots = await HM(`HM._a.st`);
  log('archer avg distance', (sum / n).toFixed(2), 'wraith blinks', blinks, 'archer', JSON.stringify(shots));
  assert(sum / n >= 4, 'archer keeps >= 4 m on average');
  assert(blinks >= 1, 'wraith blinks at least once in 20 s');
  await clear(); await step(.5);

  // Blade swing: fling a free player longsword at a knight's head, count guard raises (tier 5 guard chance)
  await HM('(HM.state.tier=5,1)');
  const ki = await spawn('knight', 0, 2.2);
  await HM(`(HM._k=HM.enemies[${ki}],1)`);
  await step(2);
  let guards = 0;
  for (let k = 0; k < 6; k++) {
    await HM(`(()=>{const e=HM._k;e.blockCD=0;e.state='engage';e.cool=9;const h=e.parts[0].mid,w=HM.spawnWeapon('longsword');const from=new HM.V3(HM.headPos.x,h.y,HM.headPos.z);
      w.obj.position.copy(from).lerp(h,.35);w.obj.quaternion.setFromUnitVectors(new HM.V3(0,1,0),new HM.V3().subVectors(h,from).normalize());w.seg();w.pa.copy(w.a);w.pb.copy(w.b);
      w.vel.subVectors(h,w.obj.position).setLength(7);w.ang.set(0,0,0);w.fresh=0;HM._w=w;return 1;})()`);
    let blocked = false;
    for (let f = 0; f < 8 && !blocked; f++) { await step(1 / 30); blocked = await HM(`HM._k.state==='block'`); }
    if (blocked) guards++;
    await HM('(HM._w.remove(),1)'); await step(.8);
  }
  log(`knight raised guard against ${guards}/6 flung blades (guardP ${await HM('HM._k.guardP.toFixed(2)')})`);
  await clear(); await step(.5);
  await HM('(HM.player.maxHp=HM.player.hp=100,HM.state.tier=undefined,1)');
};
