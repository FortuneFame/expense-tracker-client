import { FC, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import UserDrawer from '../UserDrawer/UserDrawer';

const Header: FC = () => {
    
    const [open, setOpen] = useState(false);
    const authToken = localStorage.getItem('authToken');

    return (
        <AppBar position="static">
            <Toolbar>
                <MonetizationOnIcon fontSize="large" />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ marginLeft: 10 }}>
                    Expense Tracker
                </Typography>
                <AccountCircleIcon onClick={() => setOpen(true)} style={{ cursor: 'pointer' }} fontSize="large" />
                <UserDrawer open={open} onClose={() => setOpen(false)} authToken={authToken} />
            </Toolbar>
        </AppBar>
    );
};

export default Header;