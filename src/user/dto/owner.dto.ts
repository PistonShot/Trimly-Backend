import { ApiProperty } from '@nestjs/swagger';
import { BranchInfo } from '../../DTO/branchInfo.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
// Firebase (UserModule > docs)
export class OwnerDto {
  @ApiProperty()
  @IsNotEmpty()
  branchInfo?: Array<BranchInfo>;

  @ApiProperty()
  @IsNotEmpty()
  businessName?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  phoneNum: string;

  @ApiProperty()
  @IsOptional()
  profileImgUrl: string;

}
