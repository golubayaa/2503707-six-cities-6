import { Expose } from 'class-transformer';

export class LoginResponseRdo {
  @Expose()
    token!: string;
}
