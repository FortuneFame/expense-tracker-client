import { Container } from "@mui/material";
import { FC } from "react";
import AuthModal from "../../components/AuthModal";

const AuthPage: FC = () => {
    
    return (
        <Container component="main" maxWidth="xs">
            <AuthModal/>
        </Container>
    );
};

export default AuthPage;
