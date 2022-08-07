import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { FC, useContext} from "react";
import { Context } from "..";
import { IUser } from "../models/IUser";

interface INavbarProps {
    setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const Navbar: FC<INavbarProps> = ({setUsers}) => {
  const { store } = useContext(Context);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#C0C0C0" }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h5">MERN UserService </Typography>
          <Box display="flex" sx={{ ml: "auto" }}></Box>
          <Typography
            variant="h5"
            sx={{ mr: 5 }}
          >{`Hello ${store.user.email.slice(
            0,
            store.user.email.indexOf("@")
          )}!`}</Typography>
          <Button
           variant="contained"
            onClick={() => {
              store.logout();
              setUsers([]);
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
