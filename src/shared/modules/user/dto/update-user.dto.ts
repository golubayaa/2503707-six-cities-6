export class UpdateUserDto {
  public name: string;
  public email: string;
  public avatarPath?: string;
  public type: 'ordinary' | 'pro';
  public password: string;
}
