// Baseline: hub loads, a combat area can be entered and enemies spawn and fight.
module.exports = async ({ page, HM, step, log, assert }) => {
  assert(await HM('HM.state.mode') === 'play', 'game reaches play mode');
  await HM('HM.travelTo("2,2","W")');
  await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  // stand near the first camp so its group wakes
  await HM('(()=>{const c=HM.regionState["2,2"].camps[0];HM.teleportRig(c.x*0.7,c.z*0.7,0);})()');
  await step(16);
  const n = await HM('HM.enemies.filter(e=>!e.dead).length');
  log('live enemies after 16s:', n);
  assert(n > 0, 'enemies spawn in a combat area');
  await HM('HM.enterHub()');
  await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  await step(3);
  assert(await HM('HM.state.inHub') === true, 'can return to hub');
};
