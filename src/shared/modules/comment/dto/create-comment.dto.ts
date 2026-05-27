import { IsString, Min, Max, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  public text!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  public rating!: number;

  @IsString()
  public offerId!: string;

  @IsString()
  public userId!: string;
}
