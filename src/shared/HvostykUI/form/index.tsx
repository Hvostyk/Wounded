import { Button, Form, Input } from "antd";
import { useState } from "react";
import "./style.scss";
import { FormMode, MyFormProps, MyFormValues } from "./types";

export const MyForm = ({ layout = "vertical", variant = "outlined", form: externalForm, testId, onFinish, isLoading = false }: MyFormProps) => {
    const [internalForm] = Form.useForm<MyFormValues>();
    const form = externalForm ?? internalForm;
    const [mode, setMode] = useState<FormMode>("login");

    const isRegister = mode === "register";

    const toggleMode = () => {
        form.resetFields();
        setMode(isRegister ? "login" : "register");
    };

    return (
        <div className="wounded-form-wrapper">
            <Form
                layout={layout}
                variant={variant}
                form={form}
                name="account-form"
                onFinish={values => onFinish?.(values, mode)}
                data-testid={testId}
                className="wounded-registration-form"
            >
                <div className="wounded-form-header">
                    <div className="wounded-form-logo">W</div>
                    <h2 className="wounded-form-title">{isRegister ? "Регистрация" : "Вход"}</h2>
                </div>

                <Form.Item
                    name="login"
                    label="Login"
                    rules={[
                        { required: true, message: "Введите логин" },
                        { min: 5, max: 22, message: "Логин должен быть от 5 до 22 символов" },
                    ]}
                >
                    <Input />
                </Form.Item>

                {isRegister && (
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Введите имя профиля" },
                            { min: 4, max: 20, message: "Имя профиля должно быть от 4 до 20 символов" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: "Введите пароль" },
                        { min: 6, max: 32, message: "Пароль должен быть от 6 до 32 символов" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {isRegister && (
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Подтвердите пароль" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error("Пароли не совпадают"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        {isRegister ? "Зарегистрироваться" : "Войти"}
                    </Button>
                </Form.Item>

                <div className="wounded-form-toggle">
                    {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}
                    <Button type="link" onClick={toggleMode}>
                        {isRegister ? "Войти" : "Зарегистрироваться"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};
