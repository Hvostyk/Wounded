import { Variant } from "antd/es/config-provider";
import { FormInstance, FormLayout } from "antd/es/form/Form";

export type FormMode = "login" | "register";

export interface MyFormValues {
    login: string;
    username?: string;
    password: string;
    confirmPassword?: string;
}

export interface MyFormProps {
    layout?: FormLayout;
    variant?: Variant;
    form?: FormInstance;
    testId?: string;
    isLoading?: boolean;
    onFinish?: (values: MyFormValues, mode: FormMode) => void;
}
