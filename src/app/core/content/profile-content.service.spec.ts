import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../i18n/translation.service';
import { ProfileContent } from './profile-content';
import { ProfileContentService } from './profile-content.service';

const FAKE_CONTENT: ProfileContent = {
  experience: [],
  education: [],
  courses: [],
  tech: [],
  projects: [],
  githubProfileUrl: 'https://github.com/ChristianCruzArango',
};

describe('ProfileContentService', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  it('loads the profile for the active language (R3, R5, R6)', async () => {
    const service = TestBed.inject(ProfileContentService);
    const http = TestBed.inject(HttpTestingController);

    TestBed.tick();
    http.expectOne('content/profile.es.json').flush(FAKE_CONTENT);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.content.value()).toEqual(FAKE_CONTENT);
  });

  it('reloads the profile when the language changes (R13)', async () => {
    const service = TestBed.inject(ProfileContentService);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();
    http.expectOne('content/profile.es.json').flush(FAKE_CONTENT);
    await TestBed.inject(ApplicationRef).whenStable();

    TestBed.inject(TranslationService).setLanguage('en');
    TestBed.tick();

    http.expectOne('content/profile.en.json').flush(FAKE_CONTENT);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(service.content.value()).toEqual(FAKE_CONTENT);
  });
});
