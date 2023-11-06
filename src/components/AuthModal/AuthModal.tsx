import { FC, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { URL_API } from '../../constants/constantsApp';
import { FormValues } from '../../types';

const AuthModal: FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const validationSchema = Yup.object().shape({
        name: mode === 'register' ? Yup.string().required('Обязательное поле') : Yup.mixed().notRequired(),
        email: Yup.string().email('Неверный email').required('Обязательное поле'),
        password: Yup.string().min(4, 'Минимум 4 символов').required('Обязательное поле'),
        confirmPassword: mode === 'register' ? Yup.string().oneOf([Yup.ref('password'), undefined], 'Пароли должны совпадать').required('Обязательное поле') : Yup.mixed().notRequired(),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const url = mode === 'login' ? `${URL_API}/login` : `${URL_API}/register`;

            let payload = { ...values };

            if (mode === 'login') {
                payload = {
                    email: values.email,
                    password: values.password
                };
            }

            if (mode === 'register') {
                delete payload.confirmPassword;
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.status) {
                    localStorage.setItem('authToken', data.data.token);
                    if (mode === 'login') {
                        window.location.href = '/home';
                    } else {
                        setMode('login');
                    }
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error('Ошибка сети:', err);
            }
        },

    });
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                mt: 8,
                boxShadow: ' 0px 4px 30px -10px rgba(0, 0, 0, 1)',
                borderRadius: '4px'
            }}
        >
            <Typography component="h1" variant="h5">
                {mode === 'login' ? 'Вход' : 'Регистрация'}
            </Typography>

            <Box sx={{ mt: 2 }}>
                <Button variant={mode === 'login' ? 'contained' : 'outlined'} onClick={() => setMode('login')} sx={{ mr: 1 }}>
                    Вход
                </Button>
                <Button variant={mode === 'register' ? 'contained' : 'outlined'} onClick={() => setMode('register')}>
                    Регистрация
                </Button>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                {mode === 'register' && (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Имя"
                        name="name"
                        value={formik.values.name || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                {mode === 'register' && (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Подтверждение пароля"
                        type="password"
                        id="confirmPassword"
                        value={formik.values.confirmPassword || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </Button>
            </Box>
        </Box>
    )
}
    
    export default AuthModal;