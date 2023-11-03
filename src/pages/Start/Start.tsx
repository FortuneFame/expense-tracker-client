import { FC } from 'react';
import { Typography, Container, Button, Grid } from '@mui/material';

const handleButtonClick = () => {
    window.location.href = '/auth';
  };

const Start: FC = () => {
    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Добро пожаловать в наше финансовое приложение!
            </Typography>
      
            <Typography variant="h5" gutterBottom>
                Основные возможности:
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">1. Регистрация и аутентификация пользователей</Typography>
                    <Typography>Регистрируйтесь и авторизуйтесь, используя свой email и пароль.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">2. Управление пользователями</Typography>
                    <Typography>Настройте свой профиль и управляйте своими данными.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">3. Управление финансовыми счетами</Typography>
                    <Typography>Создавайте и отслеживайте свои финансовые счета и транзакции.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">4. Управление категориями и регулярными платежами</Typography>
                    <Typography>Организуйте свои расходы с помощью категорий и регулярных платежей.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">5. Управление целями</Typography>
                    <Typography>Установите финансовые цели и отслеживайте их выполнение.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">6. Управление напоминаниями</Typography>
                    <Typography>Создавайте напоминания и получайте уведомления о них.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">7. Генерация и анализ графиков</Typography>
                    <Typography>Анализируйте свои финансы с помощью различных видов графиков.</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">8. Переводы между счетами</Typography>
                    <Typography>Осуществляйте переводы между своими финансовыми счетами.</Typography>
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleButtonClick}>
                Начать использование 
            </Button>
        </Container>
    );
};

export default Start;