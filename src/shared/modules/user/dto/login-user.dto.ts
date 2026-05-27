import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(5, 40)
  email!: string;

  @IsString()
  @Length(6, 32)
  password!: string;
}