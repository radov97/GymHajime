// Custom UI Components
export const ButtonType = {
  Submit: 'submit',
  Button: 'button',
  Reset: 'reset',
} as const;

export type ButtonTypeValue = (typeof ButtonType)[keyof typeof ButtonType];

export const ButtonRank = {
  Primary: 'primary',
  Secondary: 'secondary',
  Danger: 'danger',
  Link: 'link',
} as const;

export type ButtonRankValue = (typeof ButtonRank)[keyof typeof ButtonRank];

export const InputType = {
  Text: 'text',
  Password: 'password',
  Email: 'email',
} as const;

export type InputTypeValue = (typeof InputType)[keyof typeof InputType];

export const LoginFailureCodes = {
  EmailNotConfirmed: 'email_not_confirmed',
  InvalidCredentials: 'invalid_credentials',
} as const;

export const HajimeInfoSection = {
  DailyTraining: 'daily-training',
  Plan: 'plan',
  Train: 'train',
  Progress: 'progress',
  Discover: 'discover',
} as const;

export type HajimeInfoSectionValue = (typeof HajimeInfoSection)[keyof typeof HajimeInfoSection];
