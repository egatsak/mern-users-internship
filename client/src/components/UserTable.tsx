import { FC, useContext, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IUser } from "../models/IUser";
import { Context } from "..";
import { Toolbar, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";

const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 230 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "isBlocked", headerName: "Blocked?", width: 80 },
  { field: "isActivated", headerName: "Activated?", width: 80 },
];

interface IUserTableProps {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  getUsers: any;
  forceUpdate: any;
}

const UserTable: FC<IUserTableProps> = ({
  users,
  setUsers,
  getUsers,
  forceUpdate,
}) => {
  const { store } = useContext(Context);
  const rows = [...users];
  const notify = (text: string) => toast(text);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  return (
    <>
      <Toolbar>
        <div style={{ display: "inline-block", width: "150px" }}>
          <Tooltip title="Block">
            <IconButton
              onClick={async () => {
                const userDb = await store.blockUsers(selectedUsers);
                console.log(userDb);
                if (
                  selectedUsers.some(
                    (userItem) => userItem.email === store.user.email
                  )
                ) {
                  store.logout();
                }
                notify("Users successfully blocked");
                store.getUsers().then((res) => {
                  if (res) setUsers(res);
                });
                forceUpdate();
              }}
            >
              <BlockIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unblock">
            <IconButton
              onClick={() => {
                store.unblockUsers(selectedUsers);
                notify("Users successfully unblocked");
                getUsers(setUsers);
                store.getUsers().then((res) => {
                  if (res) setUsers(res);
                });
                forceUpdate();
              }}
            >
              <Brightness1Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                store.deleteUsers(selectedUsers);
                if (
                  selectedUsers.some(
                    (userItem) => userItem.email === store.user.email
                  )
                ) {
                  store.logout();
                }
                store.getUsers().then((res) => {
                  if (res) setUsers(res);
                });
                notify("Users successfully deleted");
                forceUpdate();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div style={{ height: 600, width: "80%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          getRowId={(row) => row._id}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows: IUser[] = rows.filter((row) =>
              selectedIDs.has(row._id)
            );
            setSelectedUsers(selectedRows);
          }}
        />
      </div>
    </>
  );
};

export default observer(UserTable);
