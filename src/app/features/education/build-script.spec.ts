import { EducationEntry } from '../../core/content/education-entry';
import { buildStudyScript, studyBranchOf } from './build-script';

const MASTER: EducationEntry = {
  institution: 'Universidad Isabel I',
  degree: 'Máster en Desarrollo con IA',
  period: 'En curso',
  location: 'España · Online',
};

describe('buildStudyScript', () => {
  // R97 — rama de estudio en kebab-case, sin acentos ni símbolos
  it('derives a kebab-case branch name from the institution (R97)', () => {
    expect(studyBranchOf(MASTER)).toBe('study/universidad-isabel-i');
    expect(
      studyBranchOf({ ...MASTER, institution: 'Founderz — Escuela de Negocios Digitales' }),
    ).toBe('study/founderz-escuela-de-negocios-digitales');
    expect(studyBranchOf({ ...MASTER, institution: ' Ñandú École ' })).toBe('study/nandu-ecole');
  });

  it('types the exact build log, in order (R97)', () => {
    expect(buildStudyScript(MASTER)).toEqual([
      '$ git checkout -b study/universidad-isabel-i',
      "  Switched to a new branch 'study/universidad-isabel-i'",
      '$ npm run learn -- "Máster en Desarrollo con IA"',
      '  syllabus compiled ✓',
      '  credits earned ✓',
      '$ npm test -- --exams',
      '  all exams passed ✓',
      '$ git merge study/universidad-isabel-i --into career',
      '● MERGED → Universidad Isabel I (En curso)',
    ]);
  });

  it('starts by checking out the study branch and learning the degree (R97)', () => {
    const script = buildStudyScript(MASTER);
    expect(script[0]).toBe('$ git checkout -b study/universidad-isabel-i');
    expect(script).toContain('$ npm run learn -- "Máster en Desarrollo con IA"');
    expect(script).toContain('$ npm test -- --exams');
    expect(script).toContain('$ git merge study/universidad-isabel-i --into career');
  });

  it('ends merged into the career with institution and period (R97)', () => {
    const script = buildStudyScript(MASTER);
    expect(script[script.length - 1]).toBe('● MERGED → Universidad Isabel I (En curso)');
  });

  it('produces the same script for the same entry', () => {
    expect(buildStudyScript(MASTER)).toEqual(buildStudyScript(MASTER));
  });
});
