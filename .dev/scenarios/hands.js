// Hands: moves the camera-attached desktop hand model closer and turned so the glove reads, then screenshots to .dev/out/hands.png.
// Only the scenario moves the model; the game's own transform is untouched.
module.exports = async ({ HM, step, log, assert, shot }) => {
  await HM(`(()=>{const h=HM.hands[1];h.model.position.set(.06,-.12,-.32);h.model.rotation.set(.35,-1.1,0);h.model.scale.set(2.6,2.6,2.6);})()`);
  await step(.3);
  await shot('hands');
  assert(await HM('!!HM.hands[1].model.geometry'), 'desktop hand model present');
  log('hand triangles', await HM('HM.hands[1].model.geometry.attributes.position.count/3'));
};
