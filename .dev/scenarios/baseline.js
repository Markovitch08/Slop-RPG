// Baseline: hub loads, a combat area can be entered and enemies spawn and fight.
module.exports = async ({ page, HM, step, log, assert }) => {
  assert(await HM('HM.state.mode') === 'play', 'game reaches play mode');
  await HM('HM.startChapter(1)');
  await step(16);
  const n = await HM('HM.enemies.filter(e=>!e.dead).length');
  log('live enemies after 16s:', n);
  assert(n > 0, 'enemies spawn in a combat area');
  await HM('HM.enterHub()');
  await page.waitForFunction(() => !window.HM.state.traveling, null, { timeout: 60000 });
  await step(3);
  assert(await HM('HM.state.inHub') === true, 'can return to hub');
};
