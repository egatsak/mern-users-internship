import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Store from "./store/store";
import { ToastContainer } from "react-toastify";

interface IStore {
  store: Store;
}

const store = new Store();
export const Context = createContext<IStore>({ store });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider value={{ store }}>
      <App />
      <ToastContainer />
    </Context.Provider>
  </React.StrictMode>
);
