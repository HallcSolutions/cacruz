import { EducationEntry } from './education-entry';
import { ExperienceEntry } from './experience-entry';
import { Project } from './project';
import { TechCategory } from './tech-category';

export interface ProfileContent {
  experience: ExperienceEntry[];
  education: EducationEntry[];
  courses: string[];
  tech: TechCategory[];
  projects: Project[];
  githubProfileUrl: string;
}
