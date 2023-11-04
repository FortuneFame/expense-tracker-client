import { FC, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Props, UserData, useUserActions } from '../../hooks/useUserActions';

import { Drawer, Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const UserDrawer: FC<Props> = ({ open, onClose, authToken }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [dialogAction, setDialogAction] = useState<null | 'logout' | 'delete' | 'save'>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUserData, setTempUserData] = useState<UserData | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        handleLogout,
        handleDeleteAccount,
        handleSave,
        setTempPassword,
        setTempConfirmPassword,
        resetState,
        tempPassword,
        tempConfirmPassword,
    } = useUserActions({
        authToken,
        userData,
        setUserData,
        setIsEditing,
        setTempUserData,
        setShowPassword,
        setDialogOpen,
        setDialogAction
    });
    
    const handleClose = () => {
        resetState();
        onClose();
    };

    useEffect(() => {
        if (open && authToken && !userData) {
            const fetchUserData = async () => {
                if (!authToken || userData) return;
    
                try {
                    const response = await axios.get('http://localhost:8000/api/current-user', {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    setUserData(response.data.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [open, authToken, userData]);

    const closeDialog = () => {
        setDialogOpen(false);
        setDialogAction(null);
    };
    
    const promptLogout = useCallback(() => {
        setDialogAction('logout');
        setDialogOpen(true);
    }, []);

    const promptDeleteAccount = useCallback(() => {
        setDialogAction('delete');
        setDialogOpen(true);
    }, []);

    const promptSave = useCallback(() => {
        if (tempUserData) {
            setDialogAction('save');
            setDialogOpen(true);
        }
    }, [tempUserData]);

    const confirmAction = async () => {
        closeDialog();
        if (dialogAction === 'logout') {
            await handleLogout();
        } else if (dialogAction === 'delete') {
            await handleDeleteAccount();
        } else if (dialogAction === 'save' && tempUserData) {
            await handleSave(tempUserData);
        }
    };

    
    const handleEdit = () => {
        setTempUserData(userData);
        setIsEditing(true);
    };

    const handleChangePasswordClick = () => {
        setIsChangingPassword(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevShow => !prevShow);
    };

    return (
        <div>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle textAlign='center' sx={{ fontWeight: 'bold' }}>{"Подтверждение"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogAction === 'logout' && "Вы уверены, что хотите выйти?"}
                        {dialogAction === 'delete' && "Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо."}
                        {dialogAction === 'save' && "Вы уверены, что хотите сохранить изменения?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button sx={{ display: 'flex', alignItems: 'normal', justifyContent: 'center' }} onClick={closeDialog} color="error" variant="contained">
                        <CloseIcon />
                        Отмена
                    </Button>
                    <Button sx={{ display: 'flex', alignItems: 'normal', justifyContent: 'center' }} onClick={confirmAction} color="success" variant="contained" autoFocus>
                        <DoneIcon />
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer anchor="right" open={open} onClose={handleClose}>
                {isEditing ? (
                    <Box padding={2} display="flex" flexDirection="column" justifyContent='center' marginTop='70px'>
                        <Typography sx={{ fontWeight: 'bold', marginBottom: '30px' }} variant="h6" marginBottom={2}>Редактировать профиль</Typography>
                        <Box sx={{ marginBottom: '50px' }}>
                            <Box marginY={2}>
                                <TextField
                                    label="Имя"
                                    variant="outlined"
                                    fullWidth
                                    value={tempUserData?.name || ''}
                                    onChange={e => setTempUserData(prev => prev ? { ...prev, name: e.target.value } : null)}
                                />
                            </Box>

                            <Box marginY={2}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    fullWidth
                                    value={tempUserData?.email || ''}
                                    onChange={e => setTempUserData(prev => prev ? { ...prev, email: e.target.value } : null)}
                                />
                            </Box>

                            {isChangingPassword && (
                                <>
                                    <Box marginY={2}>
                                        <TextField
                                            label="Новый пароль"
                                            variant="outlined"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            value={tempPassword || ''}
                                            onChange={e => setTempPassword(e.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton edge="end" onClick={togglePasswordVisibility}>
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    <Box marginY={2}>
                                        <TextField
                                            label="Подтвердите пароль"
                                            variant="outlined"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            value={tempConfirmPassword || ''}
                                            onChange={e => setTempConfirmPassword(e.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton edge="end" onClick={togglePasswordVisibility}>
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </>
                            )}
                            {!isChangingPassword && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}
                                    onClick={handleChangePasswordClick}
                                >
                                    <PublishedWithChangesIcon />
                                    Изменить пароль
                                </Button>
                            )}
                        </Box>



                        <Button sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '50px' }} color="error" variant="outlined" fullWidth onClick={promptDeleteAccount}>
                            <DeleteForeverIcon />
                            Удалить аккаунт
                        </Button>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button sx={{ marginRight: '5px' }} color="error" variant="contained" onClick={() => {
                                setIsEditing(false);
                                setTempUserData(null);
                            }}>
                                <CloseIcon />
                                Отмена
                            </Button>
                            <Button color="success" variant="contained" onClick={promptSave}>
                                <DoneIcon />
                                Сохранить
                            </Button>

                        </Box>
                    </Box>
                ) : userData && (
                    <Box marginTop='90px' padding={2} display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
                        <Typography
                            width='100%'
                            display="flex"
                            alignItems='center'
                            fontWeight='bold'
                            justifyContent='space-between'
                            variant="h6"
                        >
                            {userData.name}
                            <PersonIcon color='primary' />
                        </Typography>
                        <Typography
                            width='100%'
                            display="flex"
                            alignItems='center'
                            justifyContent='space-between'
                            variant="body1"
                        >
                            {userData.email}
                            <LocalPostOfficeIcon color="primary" />
                        </Typography>

                        <Box mt={6} width={250}>
                            <Button sx={{ display: 'flex', alignItems: 'normal', justifyContent: 'space-evenly', marginBottom: '50px' }} variant="contained" color="primary" fullWidth onClick={handleEdit}>
                                <SettingsIcon />
                                Настройки профиля
                            </Button>
                            <Box mt={2}>
                                <Button sx={{ display: 'flex', alignItems: 'normal', justifyContent: 'center' }} variant="contained" color="error" fullWidth onClick={promptLogout}>
                                    <PowerSettingsNewIcon sx={{ marginRight: '15px' }} />
                                    Выйти
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </div>
    );
};

export default UserDrawer;
