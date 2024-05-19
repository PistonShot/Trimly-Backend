import { ApiProperty } from "@nestjs/swagger";
import {BranchInfo} from "../branchInfo.dto";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from "class-validator";
// Firebase (UserModule > docs)
export class OwnerDto{
    
    @ApiProperty()
    @IsNotEmpty()
    branchInfo? : Array<BranchInfo>;

    @ApiProperty()
    @IsNotEmpty()
    businessName? : string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name : string;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phoneNum : string;
    
    @ApiProperty()
    @IsOptional()
    profileImgUrl: string;

    // constructor(data: any) {
    //     this.businessName = data.businessName;
    //     this.email = data.email;
    //     this.name = data.name;
    //     this.phoneNum = data.phoneNum;
    //     this.branchInfo = [];
    //     data.branchInfo.forEach((branch: any) => {
    //         this.branchInfo.push(new BranchInfo(branch));
    //     });
    //     this.profileImgUrl = data.profileImgUrl as string;
    // }

    // serialize(): any {
    //     return {
    //         businessName: this.businessName,
    //         email: this.email,
    //         name: this.name,
    //         phoneNum: this.phoneNum,
    //         branch: this.branch.map(branch => branch.serialize()) // Assuming branchInfo has a serialize method
    //     };
    // }
}