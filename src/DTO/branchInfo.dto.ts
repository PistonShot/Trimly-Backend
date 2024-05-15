import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

// Firebase (UserModule > docs)
export class BranchInfo{
    @ApiProperty()
    city : String;
    @ApiProperty()
    phoneNo : String;
    @ApiProperty()
    postCode : String;
    @ApiProperty()
    state: String;
    @ApiProperty()
    street : String;
    @ApiProperty()
    branchId : String

    constructor(branch : any){
        this.city = branch.city;
        this.phoneNo = branch.phoneNo
        this.postCode = branch.postCode
        this.state = branch.state
        this.street = branch.street
    }
}