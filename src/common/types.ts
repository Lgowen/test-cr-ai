import type { z } from 'zod';
import type { feedbackSchema, reviewSchema } from '../review/prompt/schemas';

export type AskAIResponse = {
  markdownReport: string;
  feedbacks: IFeedback[];
};

export type CreateFileCommentData = {
  feedback: IFeedback;
  signOff: string;
  owner: string;
  repo: string;
  pull_number: number;
  commit_id: string;
};

export type ReviewFile = {
  fileName: string;
  fileContent: string;
  changedLines: string;
};

export type PromptFile = {
  fileName: string;
  promptContent: string;
};

export type IFeedback = z.infer<typeof feedbackSchema>;
export type IReviews = z.infer<typeof reviewSchema>;

export enum PlatformOptions {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  AZDEV = 'azdev',
}

export type ReviewArgs = {
  [x: string]: unknown;
  ci: string | undefined;
  setupTarget: string;
  commentPerFile: boolean;
  model: string;
  reviewType: string;
  reviewLanguage: string | undefined;
  org: string | undefined;
  remote: string | undefined;
  provider: string;
  _: (string | number)[];
  $0: string;
};
