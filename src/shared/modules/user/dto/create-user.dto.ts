import { IsString, Length, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 15)
    name!: string;

  @IsString()
  @Length(5, 40)
    email!: string;

  @IsOptional()
  @IsString()
    avatarPath?: string;

  @IsString()
  @IsIn(['ordinary', 'pro'])
    type!: 'ordinary' | 'pro';

  @IsString()
  @Length(6, 12)
    password!: string;
}
