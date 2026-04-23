import { message } from "antd";
import { useNavigate } from "react-router";
import { setAuth } from "../../app/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation, useRegisterMutation } from "../../services/woundedApi";
import { MyForm } from "../../shared/HvostykUI/form";
import { FormMode, MyFormValues } from "../../shared/HvostykUI/form/types";
import "./style.scss";

export const AuthPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const handleFinish = async (values: MyFormValues, mode: FormMode) => {
        try {
            const mutation = mode === "login" ? login : register;
            const result = await mutation({ login: values.login, password: values.password }).unwrap();
            dispatch(setAuth({ login: result.login, token: result.token }));
            navigate("/");
        } catch {
            message.error(mode === "login" ? "Неверный логин или пароль" : "Ошибка регистрации");
        }
    };

    return (
        <div className="auth-page">
            <MyForm testId="auth-form" onFinish={handleFinish} isLoading={isLoginLoading || isRegisterLoading} />
        </div>
    );
};
