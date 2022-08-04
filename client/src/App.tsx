import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
      </>
    );
  }

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      <h1>
        {store.isAuth
          ? `User ${store.user.email} is authorized`
          : `Please log in!`}
      </h1>
      <h1>
        {store.user.isActivated
          ? "Your account is activated!"
          : "PLEASE ACTIVATE YOUR ACCOUNT!"}
      </h1>
      <button onClick={() => store.logout()}>Log out</button>
      <button onClick={getUsers}>Get users</button>
      {users.map((user) => {
        return <div key={user.email}>{user.email}</div>;
      })}
    </div>
  );
};

export default observer(App);
