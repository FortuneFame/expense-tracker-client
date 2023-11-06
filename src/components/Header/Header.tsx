import { FC, lazy, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import useAuth from "../../Context/authContext";

export const UserDrawer = lazy(() => import('./UserDrawer'));

const Header: FC = () => {
    const authToken = useAuth();
    
    const [open, setOpen] = useState(false);

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