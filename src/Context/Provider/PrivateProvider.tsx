import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { PrivateRouteProps } from '../../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const authToken = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/auth');
        }
    }, [authToken, navigate]);

    if (!authToken) return null;

    return <>{children}</>;
}

export default PrivateRoute;
