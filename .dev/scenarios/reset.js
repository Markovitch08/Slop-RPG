// Reset progress: learning everything, then the title-screen reset wipes spells/skills/level/gold/weapons/story but keeps settings.
module.exports = async ({ page, HM, step, log, assert }) => {
  await HM(`(HM.SAVE.spells=['fire','lightning','push','slow'],HM.SAVE.prog.level=9,HM.SAVE.prog.gold=999,HM.SAVE.prog.skills=['S1','S2','S4'],HM.SAVE.weapons.push('greatsword'),HM.SAVE.main=['m1','m2'],HM.SAVE.turn='smooth',localStorage.setItem('hollowmere-vr-v1',JSON.stringify(HM.SAVE)),1)`);
  page.once('dialog', d => d.accept());
  await page.evaluate(() => { document.querySelector('#ui').classList.remove('hide'); document.querySelector('#b-reset').click(); });
  await page.waitForLoadState('load');
  await page.waitForFunction(() => window.HM && window.HM.SAVE && window.HM.PROG, null, { timeout: 60000 });
  const s = await HM(`({spells:HM.SAVE.spells.length,slow:HM.spellKnown('slow'),lvl:HM.SAVE.prog.level,gold:HM.SAVE.prog.gold,skills:HM.SAVE.prog.skills.length,w:HM.SAVE.weapons.join(),main:HM.SAVE.main.length,turn:HM.SAVE.turn})`);
  log(JSON.stringify(s));
  assert(s.spells === 0 && !s.slow && s.lvl === 1 && s.gold === 0 && s.skills === 0 && s.main === 0, 'reset wipes spells, slow time, skills, level, gold and story');
  assert(!s.w.includes('greatsword'), 'reset removes earned weapons');
  assert(s.turn === 'smooth', 'reset keeps the turning setting');
};
