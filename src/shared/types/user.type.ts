export type User = {
  email: string;
  avatar?: string | undefined;
  name: string;
  type: 'ordinary' | 'pro';
}
