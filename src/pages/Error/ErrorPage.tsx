import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom'; 

const ErrorPage = () => {
  const navigate = useNavigate(); 

  const goToStart = () => {
    navigate('/'); 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />
      <Typography variant="h4" gutterBottom>
        Ошибка!
      </Typography>
      <Typography variant="subtitle1">
        К сожалению, произошла ошибка. Попробуйте обновить страницу или вернуться позже.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
        Обновить страницу
      </Button>
      <Button variant="outlined" color="secondary" onClick={goToStart}>
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default ErrorPage;
