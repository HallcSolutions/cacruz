import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';

@Directive({ selector: '[appRevealOnScroll]' })
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  readonly revealDelay = input(0);

  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.host.classList.add('reveal');
    if (this.revealDelay() > 0) {
      this.host.style.transitionDelay = `${this.revealDelay()}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries, observer) => this.onIntersect(entries, observer),
      { threshold: 0.15 },
    );
    this.observer.observe(this.host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    if (entries.some((entry) => entry.isIntersecting)) {
      this.host.classList.add('is-visible');
      observer.disconnect();
    }
  }
}
