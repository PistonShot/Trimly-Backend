import { ApiProperty } from "@nestjs/swagger";
import {BranchInfo} from "../branchInfo.dto";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";
// Firebase (UserModule > docs)
export class OwnerDto{
    
    @ApiProperty()
    branchInfo? : Array<BranchInfo>;
    @ApiProperty()
    businessName? : string;

    @ApiProperty()
    @IsEmail()
    email : string;
    @ApiProperty()
    @IsString()
    name : string;
    @ApiProperty()
    @IsPhoneNumber()
    phoneNum : string;

    constructor(data: any) {
        this.businessName = data.businessName;
        this.email = data.email;
        this.name = data.name;
        this.phoneNum = data.phoneNum;
        this.branchInfo = [];
        data.branchInfo.forEach((branch: any) => {
            this.branchInfo.push(new BranchInfo(branch));
        });
    }

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