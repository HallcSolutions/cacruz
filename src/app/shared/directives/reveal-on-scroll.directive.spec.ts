import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  imports: [RevealOnScrollDirective],
  template: '<section appRevealOnScroll [revealDelay]="120">contenido</section>',
})
class HostComponent {}

@Component({
  imports: [RevealOnScrollDirective],
  template: '<section appRevealOnScroll>contenido</section>',
})
class DefaultDelayHostComponent {}

type ObserverCallback = (
  entries: Partial<IntersectionObserverEntry>[],
  observer: IntersectionObserver,
) => void;

describe('RevealOnScrollDirective', () => {
  let intersectCallback: ObserverCallback | undefined;
  let fakeObserver: IntersectionObserver | undefined;
  let observerOptions: IntersectionObserverInit | undefined;
  let observed: Element[];
  let disconnected: boolean;

  beforeEach(() => {
    observed = [];
    disconnected = false;
    intersectCallback = undefined;
    fakeObserver = undefined;
    observerOptions = undefined;

    class FakeIntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        intersectCallback = callback as unknown as ObserverCallback;
        observerOptions = options;
        fakeObserver = this as unknown as IntersectionObserver;
      }
      observe(element: Element): void {
        observed.push(element);
      }
      disconnect(): void {
        disconnected = true;
      }
      unobserve(): void {}
    }
    (window as unknown as Record<string, unknown>)['IntersectionObserver'] =
      FakeIntersectionObserver;

    TestBed.configureTestingModule({ imports: [HostComponent, DefaultDelayHostComponent] });
  });

  function createHost(): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  function hostElement(fixture: ComponentFixture<HostComponent>): HTMLElement {
    return fixture.nativeElement.querySelector('section') as HTMLElement;
  }

  // R16/R38 — estado inicial oculto listo para animar, siempre
  it('marks the host as pending reveal and observes it (R16, R38)', () => {
    const fixture = createHost();
    const host = hostElement(fixture);
    expect(host.classList.contains('reveal')).toBeTrue();
    expect(host.classList.contains('is-visible')).toBeFalse();
    expect(observed).toContain(host);
  });

  // R4 / R16 — revela al entrar al viewport
  it('reveals the host when it intersects the viewport (R4, R16)', () => {
    const fixture = createHost();
    const host = hostElement(fixture);
    intersectCallback!([{ isIntersecting: true, target: host }], fakeObserver!);
    expect(host.classList.contains('is-visible')).toBeTrue();
    expect(disconnected).toBeTrue();
  });

  it('reveals when at least one of several entries intersects (R16)', () => {
    const fixture = createHost();
    const host = hostElement(fixture);
    intersectCallback!(
      [
        { isIntersecting: false, target: host },
        { isIntersecting: true, target: host },
      ],
      fakeObserver!,
    );
    expect(host.classList.contains('is-visible')).toBeTrue();
  });

  it('observes with a meaningful visibility threshold (R16)', () => {
    createHost();
    expect(observerOptions?.threshold).toBe(0.15);
  });

  it('does not reveal while the host is out of the viewport (R16)', () => {
    const fixture = createHost();
    const host = hostElement(fixture);
    intersectCallback!([{ isIntersecting: false, target: host }], fakeObserver!);
    expect(host.classList.contains('is-visible')).toBeFalse();
    expect(disconnected).toBeFalse();
  });

  it('applies the stagger delay as transition delay (R16)', () => {
    const fixture = createHost();
    expect(hostElement(fixture).style.transitionDelay).toBe('120ms');
  });

  it('applies no transition delay by default (R16)', () => {
    const fixture = TestBed.createComponent(DefaultDelayHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('section') as HTMLElement;
    expect(host.style.transitionDelay).toBe('');
  });

  it('disconnects the observer on destroy', () => {
    const fixture = createHost();
    fixture.destroy();
    expect(disconnected).toBeTrue();
  });
});
