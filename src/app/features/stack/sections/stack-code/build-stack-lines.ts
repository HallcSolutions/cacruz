import { TechCategory } from '../../../../core/content/tech-category';
import { StackLine } from './stack-line';

export function buildStackLines(categories: TechCategory[]): StackLine[] {
  const lines: StackLine[] = [{ text: 'const stack = {', indent: 0, kind: 'open' }];

  for (const category of categories) {
    lines.push({ text: `'${category.name}': [`, indent: 1, kind: 'key' });
    for (const item of category.items) {
      lines.push({ text: `'${item}',`, indent: 2, kind: 'item' });
    }
    lines.push({ text: '],', indent: 1, kind: 'close' });
  }

  lines.push({ text: '};', indent: 0, kind: 'end' });
  return lines;
}
