import { FC } from "react";
import { Toolbar, Tooltip, IconButton } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import Brightness1Icon from "@mui/icons-material/Brightness1";

const TableToolbar: FC = () => {
  return (
    <Toolbar>
      <div style={{ display: "inline-block", width: "150px" }}>
        <Tooltip title="Block">
          <IconButton>
            <BlockIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unblock">
          <IconButton>
            <Brightness1Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton>
      {/*      <DeleteIcon onClick={()=>{store.deleteUsers(users)}}/> */}
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

export default TableToolbar;
