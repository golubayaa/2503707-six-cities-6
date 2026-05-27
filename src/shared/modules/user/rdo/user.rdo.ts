import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
    name!: string;

  @Expose()
    email!: string;

  @Expose()
    avatarPath?: string;

  @Expose()
    type!: 'ordinary' | 'pro';
}
