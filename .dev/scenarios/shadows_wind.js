module.exports = async ({ page, HM, step, log, assert, shot }) => {
  await page.waitForTimeout(5000);
  const r = await HM(`({wind:!!HM.AU.wind,f:HM.AU.wind&&HM.AU.wind.f.type,g:HM.AU.wind&&+HM.AU.wind.g.gain.value.toFixed(3),sh:!!HM.W.shadows,tris:HM.W.shadows?HM.W.shadows.geometry.index.count/3:0})`);
  log(JSON.stringify(r));
  assert(r.wind && r.f === 'lowpass' && r.g <= 0.12, 'wind bed is a quiet lowpass bed');
  assert(r.sh && r.tris > 50, 'hub has one merged shadow mesh');
  await HM(`(HM.teleportRig(-2,10,Math.PI),HM.camera.rotation.set(-.35,0,0),1)`); await step(.2); await shot('shadows-a');
  await HM(`(HM.teleportRig(6,-2,-2.2),HM.camera.rotation.set(-.3,0,0),1)`); await step(.2); await shot('shadows-b');
  await HM('HM.travelTo("2,2","W")'); await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  assert(!(await HM('!!(HM.W.shadows&&HM.W.shadows.parent)')), 'no village shadows outside the hub');
};
