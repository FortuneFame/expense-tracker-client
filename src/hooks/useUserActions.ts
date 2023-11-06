import { useCallback, useState } from 'react';
import axios from 'axios';
import { URL_API } from '../constants/constantsApp';
import { useNavigate } from 'react-router-dom';
import { UseUserActionsProps, UserData } from '../types';

export const useUserActions = ({
    authToken,
    userData,
    setUserData,
    setIsEditing,
    setTempUserData,
    setDialogAction,
    setShowPassword,
    setDialogOpen,
    setIsChangingPassword
}: UseUserActionsProps) => {
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [tempConfirmPassword, setTempConfirmPassword] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        if (!authToken) {
            console.error('Token not found');
            return;
        }

        try {
            const response = await axios.post(`${URL_API}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('authToken');
                navigate('/');
            } else {
                console.error('Logout failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }, [authToken, navigate]);

    const handleDeleteAccount = useCallback(async () => {
        if (!authToken || !userData) {
            console.error('Token not found or userData is null');
            return;
        }

        try {
            const response = await axios.delete(`${URL_API}/users/${userData.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('authToken');
                navigate('/');
            } else {
                console.error('Account deletion failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
        }
    }, [authToken, userData, navigate]);

    const handleSave = async (updatedData: UserData) => {
        if (!authToken) return;

        const dataToUpdate: UserData = {
            id: updatedData.id,
            name: updatedData.name,
            email: updatedData.email
        };

        if (tempPassword && tempConfirmPassword) {
            dataToUpdate.password = tempPassword;
            dataToUpdate.confirmPassword = tempConfirmPassword;
        }

        try {
            const response = await axios.patch(`${URL_API}/users`, dataToUpdate, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.data.status) {
                setUserData(response.data.data);
                setIsEditing(false);
            } else {
                console.error('Update failed:', response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
        setTempUserData(null);
        setTempPassword(null);
        setTempConfirmPassword(null);
        setIsChangingPassword(false);
    };

    const resetState = () => {
        setUserData(null);
        setIsEditing(false);
        setTempUserData(null);
        setShowPassword(false);
        setTempPassword(null);
        setTempConfirmPassword(null);
        setDialogOpen(false);
        setDialogAction(null);
        setIsChangingPassword(false);
    };

    return {
        handleLogout,
        handleDeleteAccount,
        handleSave,
        setTempPassword,
        setTempConfirmPassword,
        tempConfirmPassword,
        tempPassword,
        resetState,
        setIsChangingPassword
    };
};