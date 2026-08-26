import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { EducationEntry } from '../../../../core/content/education-entry';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { BUILD_LINE_TICK_MS, buildStudyScript, studyBranchOf } from '../../build-script';
import { JobState, PENDING_JOB } from './job-state';

@Component({
  selector: 'app-build-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './build-pipeline.html',
  styleUrl: './build-pipeline.css',
})
export class BuildPipeline {
  readonly entries = input.required<EducationEntry[]>();
  readonly courses = input.required<string[]>();

  /** Estado por título; el juego consiste en superar todos los jobs. */
  private readonly states = signal<Record<string, JobState>>({});

  protected readonly passedCount = computed(
    () => Object.values(this.states()).filter((state) => state.status === 'passed').length,
  );

  protected readonly allPassed = computed(
    () => this.entries().length > 0 && this.passedCount() === this.entries().length,
  );

  private timers: ReturnType<typeof setInterval>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearInterval));
  }

  protected jobId(entry: EducationEntry): string {
    return studyBranchOf(entry);
  }

  protected stateOf(entry: EducationEntry): JobState {
    return this.states()[this.jobId(entry)] ?? PENDING_JOB;
  }

  /** Pliega o reabre el log de un job superado, sin deshacerlo (R100). */
  protected toggle(entry: EducationEntry): void {
    const state = this.stateOf(entry);
    if (state.status === 'passed') {
      this.patch(this.jobId(entry), { ...state, collapsed: !state.collapsed });
    }
  }

  protected run(entry: EducationEntry): void {
    if (this.stateOf(entry).status !== 'pending') {
      return;
    }

    const id = this.jobId(entry);
    const script = buildStudyScript(entry);
    this.patch(id, { status: 'running', lines: [script[0]], collapsed: false });

    let next = 1;
    const timer = setInterval(() => {
      const state = this.states()[id];
      if (next < script.length) {
        this.patch(id, { ...state, lines: [...state.lines, script[next]] });
        next++;
        return;
      }
      clearInterval(timer);
      this.patch(id, { ...state, status: 'passed' });
    }, BUILD_LINE_TICK_MS);
    this.timers.push(timer);
  }

  private patch(id: string, state: JobState): void {
    this.states.update((all) => ({ ...all, [id]: state }));
  }
}
