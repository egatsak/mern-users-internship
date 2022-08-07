import $api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../models/IUser";

export default class UserService {
  static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>("/users");
  }
  static deleteUsers(users: IUser[])/* : Promise<AxiosResponse<IUser[]>> */ {
    return $api.post("/deleteMany", users);
  }
  static blockUsers(users: IUser[])/* : Promise<AxiosResponse<IUser[]>> */ {
    return $api.post("/blockMany", users);
  }
  static unblockUsers(users: IUser[])/* : Promise<AxiosResponse<IUser[]>> */ {
    return $api.post("/unblockMany", users);
  }
}
