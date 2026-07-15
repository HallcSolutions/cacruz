import { TestBed } from '@angular/core/testing';
import { TechConstellation } from './tech-constellation';

const ITEMS = ['Angular', '.NET', 'NestJS', 'Flutter'];

describe('TechConstellation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TechConstellation] });
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(TechConstellation);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // R42 — constelación flotante, una pieza por tecnología (import { X } from 'stack')
  it('renders one floating star per technology (R42)', () => {
    const names = Array.from(
      render().querySelectorAll<HTMLElement>('.constellation__star .constellation__name'),
    );
    expect(names.map((s) => s.textContent?.trim())).toEqual(ITEMS);
  });

  it('staggers each star with its own rhythm index (R42)', () => {
    const stars = Array.from(render().querySelectorAll<HTMLElement>('.constellation__star'));
    expect(stars[0].style.getPropertyValue('--i')).toBe('0');
    expect(stars[3].style.getPropertyValue('--i')).toBe('3');
  });
});
