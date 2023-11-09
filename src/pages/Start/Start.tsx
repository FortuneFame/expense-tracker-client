import { FC } from 'react';
import { Typography, Container, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Start: FC = () => {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/auth');
    };
    
    return (
        <Container sx={{ justifyContent: "center", alignItems:'center', height:'100vh'}}>
            <Typography variant="h2" gutterBottom marginBlock='40px'>
                Добро пожаловать в наше финансовое приложение!
            </Typography>
      
            <Typography variant="h5" gutterBottom>
                Основные возможности:
            </Typography>

    
                <Grid item xs={12} sm={6} m={3}>
                    <Typography variant="h6">1. Регистрация и аутентификация пользователей</Typography>
                    <Typography>Регистрируйтесь и авторизуйтесь, используя свой email и пароль.</Typography>
                </Grid>

                <Grid item xs={12} sm={6} m={3}>
                    <Typography variant="h6">2. Управление пользователями</Typography>
                    <Typography>Настройте свой профиль и управляйте своими данными.</Typography>
                </Grid>

                <Grid item xs={12} sm={6} m={3}>
                    <Typography variant="h6">3. Управление финансовыми счетами</Typography>
                    <Typography>Создавайте и отслеживайте свои финансовые счета и транзакции.</Typography>
                </Grid>
      
            <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleButtonClick}>
                Начать использование
            </Button>
        </Container>
    );
};

export default Start;