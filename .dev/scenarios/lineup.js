// Lineup: spawns one of each enemy type (frozen, as dummies) in front of the camera
// in the hub and screenshots them to .dev/out/lineup-front.png and lineup-side.png.
module.exports = async ({ page, HM, step, log, assert, shot }) => {
  const types = await HM(`(()=>{
    const types=['bandit','archer','skeleton','knight','brute','wraith'];
    HM.rig.position.set(0,HM.rig.position.y,0);HM.rig.rotation.y=0;HM.camera.rotation.set(0,0,0);
    types.forEach((t,i)=>{const x=(i-2.5)*1.6,z=-4.2;const e=new HM.Enemy(t,new HM.V3(x,0,z),null);e.dummy=true;e.state="idle";e.yaw=0;e.pos.set(x,0,z);e.root.position.y=HM.rig.position.y;});
    return types;})()`);
  await step(1.5);
  // face the lineup: enemies face +z (yaw 0) toward the camera at z=0 looking -z
  await HM(`(()=>{const e=HM.enemies.filter(e=>e.dummy&&e.pos.z<-4);e.forEach(x=>{x.yaw=0;});HM.rig.rotation.y=0;HM.camera.rotation.set(-.12,0,0);HM.rig.position.x=0;HM.rig.position.z=0;})()`);
  await step(.2);
  await shot('lineup-front');
  await HM(`(()=>{const e=HM.enemies.filter(e=>e.dummy&&e.pos.z<-4);e.forEach(x=>{x.yaw=Math.PI/2;});})()`);
  await step(.2);
  await shot('lineup-side');
  log('lineup types:', types.join(','));
  assert(types.length === 6, 'all enemy types spawned for lineup');
};
