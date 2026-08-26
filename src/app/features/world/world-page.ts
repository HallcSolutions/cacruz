import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { ContactModal } from '../../shared/components/contact-modal/contact-modal';
import { WorldZone } from './model/world-zone';
import { WORLD_ZONES } from './logic/world-zones';
import { WorldCanvas } from './world-canvas';

/** La página del mundo no lleva el pie del sitio: el mundo ocupa la ventana entera. */
@Component({
  selector: 'app-world-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, WorldCanvas, ContactModal],
  templateUrl: './world-page.html',
  styleUrl: './world-page.css',
})
export class WorldPage {
  private readonly router = inject(Router);
  protected readonly profile = inject(ProfileContentService);

  protected readonly zones = WORLD_ZONES;
  protected readonly activeZone = signal<WorldZone | null>(null);
  protected readonly loading = signal(true);
  /** R83: sin WebGL el mundo no se monta y la capa HTML pasa a ser la página. */
  protected readonly worldFailed = signal(false);
  protected readonly aboutOpen = signal(false);
  protected readonly contactOpen = signal(false);
  protected readonly progress = signal(0);
  protected readonly hp = signal(3);
  protected readonly flashing = signal(false);
  protected readonly hearts = [0, 1, 2];

  private readonly canvas = viewChild(WorldCanvas);

  protected onReady(ok: boolean): void {
    this.loading.set(false);
    this.worldFailed.set(!ok);
  }

  /** Entra en la zona donde está parado el muñeco (R79, R80, R81). */
  protected enter(): void {
    const zone = this.activeZone();
    if (!zone) {
      return;
    }
    if (zone.route) {
      void this.router.navigate([zone.route]);
      return;
    }
    if (zone.id === 'contact') {
      this.contactOpen.set(true);
      return;
    }
    /* Quién soy: el personaje se sienta a trabajar y se abre la presentación (R81). */
    this.canvas()?.sit();
    this.aboutOpen.set(true);
  }

  protected onHit(): void {
    this.flashing.set(true);
    setTimeout(() => this.flashing.set(false), 220);
  }

  protected canvasCommand(): void {
    this.canvas()?.runCommand();
  }

  protected canvasJump(): void {
    this.canvas()?.jump();
  }

  protected closeAbout(): void {
    this.aboutOpen.set(false);
    this.canvas()?.stand();
  }
}
