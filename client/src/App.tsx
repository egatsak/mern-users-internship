import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import UserTable from "./components/UserTable";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

import "react-toastify/dist/ReactToastify.css";
import { Typography, Button } from "@mui/material";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const notify = (text: string) => toast(text);
  const [, updateState] = useState<string>("");
  const forceUpdate = useCallback(() => updateState(""), []);

  const getUsers = async (
    setter: React.Dispatch<React.SetStateAction<IUser[]>>
  ) => {
    console.log("works");
    try {
      const response = await UserService.fetchUsers();
      setter(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store.isAuth, store]);

  useEffect(() => {
    if (store.isAuth) {
      //getUsers(setUsers);
      //getUsersMobX();
      store.getUsers().then((res) => {
        if (res) setUsers(res);
        forceUpdate();
      });
    }
  }, [forceUpdate, store]);

  useEffect(() => {
    if (store.error) {
      notify(store.error);
    }
  }, [store.error]);

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
      </>
    );
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar setUsers={setUsers} />
      <Typography variant="h5">
        {store.isAuth
          ? `User ${store.user.email} is authorized.`
          : `Please log in!`}
      </Typography>
      <Typography variant="h5">
        {" "}
        {store.user.isActivated
          ? "Your account is activated."
          : "Please activate your account!"}
      </Typography>

      <Button variant="contained" onClick={() => getUsers(setUsers)}>
        update users
      </Button>
      <UserTable
        users={users}
        setUsers={setUsers}
        getUsers={getUsers}
        forceUpdate={forceUpdate}
      />
    </div>
  );
};

export default observer(App);
