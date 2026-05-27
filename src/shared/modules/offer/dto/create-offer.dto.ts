import {
  IsString, Length, IsDateString, IsEnum, IsBoolean, IsArray, ArrayMinSize, ArrayMaxSize, IsInt, Min, Max, IsNumber, IsOptional, ValidateNested, IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
  title!: string;

  @IsString()
  @Length(20, 1024)
  description!: string;

  @IsDateString()
  postDate!: string;

  @IsString()
  city!: string;

  @IsString()
  previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  images!: string[];

  @IsBoolean()
  isPremium!: boolean;

  @IsBoolean()
  isFavorite!: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsEnum(OfferType)
  type!: OfferType;

  @IsInt()
  @Min(1)
  @Max(8)
  rooms!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  guests!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  price!: number;

  @IsArray()
  @IsString({ each: true })
  goods!: string[];

  @IsMongoId()
  authorId!: string;

  @IsArray()
  @IsString({ each: true })
  categories!: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}

export class LocationDto {
  @IsNumber()
  latitude!: number;
  @IsNumber()
  longitude!: number;
}