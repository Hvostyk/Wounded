import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { message } from "antd";
import { useNavigate } from "react-router";
import { setAuth } from "../../app/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation, useRegisterMutation } from "../../services/woundedApi";
import { MyForm } from "../../shared/HvostykUI/form";
import { FormMode, MyFormValues } from "../../shared/HvostykUI/form/types";
import "./style.scss";

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
    typeof error === "object" && error !== null && ("message" in error || "code" in error);

const getAuthErrorMessage = (error: unknown, mode: FormMode): string => {
    if (isFetchBaseQueryError(error)) {
        if (error.status === 401) {
            return "Неверный логин или пароль";
        }

        if (error.status === 409) {
            return mode === "register" ? "Пользователь с таким логином уже существует" : "Конфликт данных";
        }

        if (error.status === 400) {
            return "Данные не прошли валидацию";
        }
    }

    if (isSerializedError(error) && error.message) {
        return error.message;
    }

    return mode === "login" ? "Не удалось выполнить вход" : "Не удалось завершить регистрацию";
};

export const AuthPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const handleFinish = async (values: MyFormValues, mode: FormMode) => {
        try {
            const result =
                mode === "login"
                    ? await login({ login: values.login, password: values.password }).unwrap()
                    : await register({
                          login: values.login,
                          username: values.username ?? values.login,
                          password: values.password,
                      }).unwrap();

            dispatch(setAuth(result));
            navigate("/");
        } catch (error) {
            message.error(getAuthErrorMessage(error, mode));
        }
    };

    return (
        <div className="auth-page">
            <MyForm testId="auth-form" onFinish={handleFinish} isLoading={isLoginLoading || isRegisterLoading} />
        </div>
    );
};
