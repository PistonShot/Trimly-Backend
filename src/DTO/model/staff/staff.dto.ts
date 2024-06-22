import {
  IsEmail,
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialMediaDto {
  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  tiktok?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
}

export class StaffDto {
  @IsEmail()
  email: string;

  @IsString()
  expertise: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  quote: string;

  @IsString()
  rating: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia: SocialMediaDto;

  @IsString()
  status: string;
}
