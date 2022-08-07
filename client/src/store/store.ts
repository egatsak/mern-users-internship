import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { API_URL } from "../http";
import { IUser } from "../models/IUser";
import { IAuthResponse } from "../models/response/IAuthResponse";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  error = "";
  users = [] as IUser[];

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  setError(error: string) {
    this.error = error;
  }

  setUsers(users: IUser[]) {
    this.users = users;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e, e.response?.data?.message);
      this.setError(e.response?.data?.message);
    }
  }

  async register(email: string, password: string) {
    try {
      const response = await AuthService.register(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e, e.response?.data?.message);
      this.setError(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      console.log(response);
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async getUsers() {
    try {
      const response = await UserService.fetchUsers();
      //console.log(response.data)
      runInAction(() => {
        this.users = response.data || ([] as IUser[]);
      });
      const output = toJS(this.users);
      console.log(output);
      return output
    } catch (e: any) {
      console.log(e.response?.data?.message);
      this.setError(e.response?.data?.message);
    }
  }

  async deleteUsers(users: IUser[]) {
    try {
      const response = await UserService.deleteUsers(users);
      console.log(response);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      this.setError(e.response?.data?.message);
    }
  }

  async blockUsers(users: IUser[]) {
    try {
      const response = await UserService.blockUsers(users);
      console.log(response);
      return response?.data?.userData;
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async unblockUsers(users: IUser[]) {
    try {
      const response = await UserService.unblockUsers(users);
      console.log(response);
      return response?.data?.userData;
    } catch (e: any) {
      console.log("error", e.response?.data?.message);
    }
  }
}
