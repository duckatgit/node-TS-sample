import { userModel } from "../model/index";


const findUser = async (paramObj: any) => {
    return await userModel.findOne(paramObj);
}

export default {
    findUser
}