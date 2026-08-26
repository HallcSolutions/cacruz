import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationPage } from './education-page';

const PROFILE = {
  experience: [],
  education: [
    {
      institution: 'UNAD Colombia',
      degree: 'Ingeniería de Sistemas',
      period: '2016 — 2019',
      location: 'Colombia',
    },
  ],
  courses: ['Scrum Master — UniversiK'],
  tech: [],
  projects: [],
  githubProfileUrl: 'https://github.com/cacruz',
};

describe('EducationPage', () => {
  let fixture: ComponentFixture<EducationPage>;

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [EducationPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(EducationPage);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  // R96 — la página presenta la pipeline con la formación del perfil
  it('renders the build pipeline with the loaded education (R96)', async () => {
    TestBed.tick();
    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.startsWith('content/profile.es.json'))
      .flush(PROFILE);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Formación');
    expect(host.querySelector('app-build-pipeline')).toBeTruthy();
    expect(host.textContent).toContain('Ingeniería de Sistemas');
  });
});
