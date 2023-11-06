import { ValidationErrors } from "../../../types";

const MIN_PASSWORD_LENGTH = 6;

export const validateUserData = (data: {
    name?: string;
    email?: string;
    password?: string | null;
    confirmPassword?: string | null;
    validatePassword?: boolean;
}): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!data.name) {
        errors.name = "Имя обязательно";
        return errors; 
    }

    if (!data.email) {
        errors.email = "Email обязателен";
        return errors; 
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email не корректный";
        return errors; 
    }

     if (data.validatePassword) {
        if (!data.password) {
            errors.password = "Пароль обязателен";
        } else if (data.password.length < MIN_PASSWORD_LENGTH) {
            errors.password = "Пароль должен содержать не менее 6 символов";
        }

        if (!data.confirmPassword) {
            errors.confirmPassword = "Подтверждение пароля обязательно";
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "Пароли не совпадают";
        }
    }
    return errors;
};
