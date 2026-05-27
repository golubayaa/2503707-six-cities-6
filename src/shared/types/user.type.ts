export type User = {
  email: string;
  avatarPath?: string | undefined;
  name: string;
  type: 'ordinary' | 'pro';
}
