export type JobStatus = 'pending' | 'running' | 'passed';

export interface JobState {
  status: JobStatus;
  lines: string[];
  collapsed: boolean;
}

export const PENDING_JOB: JobState = { status: 'pending', lines: [], collapsed: false };
