import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProfileContentService } from './core/content/profile-content.service';
import { ProjectsPage } from './features/projects/projects-page';
import { routes } from './app.routes';
import { Home } from './features/home/home';
import { WorldPage } from './features/world/world-page';

describe('Professional entry routes', () => {
  it('opens the editorial home at the root (professional-home R1)', async () => {
    const root = routes.find((route) => route.path === '');
    const children = await (root!.loadChildren!() as Promise<Routes>);
    expect(children[0].component).toBe(Home);
  });

  it('keeps the existing game at an explicit optional route (professional-home R5)', async () => {
    const world = routes.find((route) => route.path === 'world');
    expect(world).withContext('the game must stay accessible at /world').toBeDefined();
    if (!world) return;
    const children = await (world.loadChildren!() as Promise<Routes>);
    expect(children[0].component).toBe(WorldPage);
  });
  it('navigates to the professional home and still resolves other feature paths (professional-home R1, R5)', async () => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes),
      { provide: ProfileContentService, useValue: { content: { value: signal(undefined) } } },
    ] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Home);
    expect(harness.routeNativeElement?.querySelector('app-chalc-workflow')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('app-world-canvas')).toBeNull();
    expect(await harness.navigateByUrl('/projects', ProjectsPage)).toBeTruthy();
  });
});
