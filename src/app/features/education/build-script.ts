import { EducationEntry } from '../../core/content/education-entry';

/** Cadencia con la que la pipeline teclea cada línea del guion. */
export const BUILD_LINE_TICK_MS = 300;

/** Rama de estudio en kebab-case: sin acentos, símbolos ni guiones sobrantes (R97). */
export function studyBranchOf(entry: EducationEntry): string {
  const slug = entry.institution
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `study/${slug}`;
}

/**
 * Guion de build que la pipeline teclea línea a línea por cada título (R97).
 * Los logs van en inglés, como en una terminal real; la UI alrededor es la que se traduce.
 */
export function buildStudyScript(entry: EducationEntry): string[] {
  const branch = studyBranchOf(entry);
  return [
    `$ git checkout -b ${branch}`,
    `  Switched to a new branch '${branch}'`,
    `$ npm run learn -- "${entry.degree}"`,
    '  syllabus compiled ✓',
    '  credits earned ✓',
    '$ npm test -- --exams',
    '  all exams passed ✓',
    `$ git merge ${branch} --into career`,
    `● MERGED → ${entry.institution} (${entry.period})`,
  ];
}
