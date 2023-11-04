import { useCallback, useState } from 'react';
import axios from 'axios';

export type Props = {
  open: boolean;
  onClose: () => void;
  authToken: string | null;
};

export type UserData = {
    id: number;
  name: string;
    email: string;
   password?: string;
    confirmPassword?: string;
};

type UseUserActionsProps = {
    authToken: string | null;
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
    setIsEditing: (value: boolean) => void;
    setTempUserData: (data: UserData | null) => void;
    setShowPassword: (value: boolean) => void; 
    setDialogOpen: (value: boolean) => void;   
    setDialogAction: (value: 'logout' | 'delete' | 'save' | null) => void; 
};

export const useUserActions = ({
    authToken,
    userData,
    setUserData,
    setIsEditing,
    setTempUserData,
    setDialogAction,
    setShowPassword,
    setDialogOpen
}: UseUserActionsProps) => {
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [tempConfirmPassword, setTempConfirmPassword] = useState<string | null>(null);
    

    const handleLogout = useCallback(async () => {
        if (!authToken) {
            console.error('Token not found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('authToken');
                window.location.href = '/';
            } else {
                console.error('Logout failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }, [authToken]);

    const handleDeleteAccount = useCallback(async () => {
        if (!authToken || !userData) {
            console.error('Token not found or userData is null');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/api/users/${userData.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('authToken');
                window.location.href = '/';
            } else {
                console.error('Account deletion failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
        }
    }, [authToken, userData]);

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
            const response = await axios.patch('http://localhost:8000/api/users', dataToUpdate, {
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
};

    return {
        handleLogout,
        handleDeleteAccount,
        handleSave,
        setTempPassword,
        setTempConfirmPassword,
        tempConfirmPassword,
        tempPassword,
        resetState 
    };
};