// Travel: regions are joined by gates; walking into an open gate changes region, a sealed gate refuses.
module.exports = async ({ page, HM, step, log, assert, shot }) => {
  const idle = () => page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  const gate = (dir) => HM(`(()=>{const g=HM.W.gates.find(g=>g.dir==='${dir}');return g&&{x:g.x,z:g.z,dx:g.dx,dz:g.dz,sealed:g.sealed,target:g.target};})()`);
  const put = (x, z, yaw) => HM(`(()=>{const r=HM.rig,c=new HM.V3();r.rotation.y=${yaw};r.updateMatrixWorld(true);HM.camera.getWorldPosition(c);r.position.x+=${x}-c.x;r.position.z+=${z}-c.z;r.position.y=HM.floorY(${x},${z});})()`);
  await idle();
  assert(await HM('HM.state.region') === '1,2', 'starts in the hub (1,2)');
  assert(await HM('HM.W.gates.length') === 3, 'hub has 3 gates (N, E, W)');

  await HM('HM.travelTo("2,2","W")');
  assert(await HM('HM.state.region') === '2,2', 'travelTo moves to Edgewood (2,2)');
  const head = await HM('[HM.headPos.x,HM.headPos.z]');
  log('arrived at', head.map(v => v.toFixed(1)).join(','));
  assert(head[0] < -30, 'arrives just inside the west gate');

  const w = await gate('W');
  await put(w.x, w.z, 0);
  await step(.5); await idle();
  assert(await HM('HM.state.region') === '1,2', 'walking onto the west gate of Edgewood returns to the hub');

  const n = await gate('N');
  await put(n.x * 0.9, n.z * 0.9, 0); // ~4 m inside the north gate, facing north (-z)
  await step(.2);
  await shot('gate');
  await page.keyboard.down('KeyW'); await step(2.5); await page.keyboard.up('KeyW');
  await idle();
  assert(await HM('HM.state.region') === '1,1', 'walking north through the hub gate reaches Whisperwood (1,1)');

  await HM('HM.travelTo("2,1",null)');
  const s = await gate('N');
  assert(s && s.sealed && s.target === '2,0', 'Frostfang north gate is sealed (Hollow Throne)');
  await put(s.x, s.z, 0);
  await step(1); await idle();
  assert(await HM('HM.state.region') === '2,1', 'sealed gate does not change region');
  const r = await HM('Math.hypot(HM.headPos.x,HM.headPos.z)');
  log('distance from centre after push-back:', r.toFixed(1));
  assert(r < 40, 'sealed gate pushes the player back');

  await HM('HM.travelTo("1,2",null)');
  await put(0, 10, Math.PI * 0.75); await step(.2); await shot('clouds-a');
  await put(-40, 10, Math.PI * 0.75); await step(.2); await shot('clouds-b');
};
