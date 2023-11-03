import { FC, useCallback } from 'react';

const Home: FC = () => {

    const handleLogout = useCallback(async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                console.error('Токен не найден');
                return;
            }

            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                credentials: 'include',
            });

            if (response.ok) {
                // localStorage.removeItem('authToken');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                console.error('Ошибка выхода из системы:', errorData.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Ошибка при запросе на выход из системы:', error);
        }
    }, []);

    return (
        <div>
            <div>HOME</div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
