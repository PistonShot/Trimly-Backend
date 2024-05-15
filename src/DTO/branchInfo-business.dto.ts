import { BranchInfo } from "./branchInfo.dto";

export class BranchInfoBusiness{
    branchInfo? : Array<BranchInfo>;
    businessName : String;

    constructor(data:any){
        this.branchInfo = data.branchInfo;
        this.businessName = data.businessName;
    }
}