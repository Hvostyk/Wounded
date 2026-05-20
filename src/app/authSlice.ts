import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthSession } from "../services/types";

interface AuthState {
    isAuthenticated: boolean;
    login: string | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const getInitialState = (): AuthState => {
    const storedValue = localStorage.getItem("wounded_auth");

    if (!storedValue) {
        return {
            isAuthenticated: false,
            login: null,
            accessToken: null,
            refreshToken: null,
        };
    }

    try {
        return JSON.parse(storedValue) as AuthState;
    } catch {
        localStorage.removeItem("wounded_auth");

        return {
            isAuthenticated: false,
            login: null,
            accessToken: null,
            refreshToken: null,
        };
    }
};

const persistAuthState = (state: AuthState): void => {
    localStorage.setItem("wounded_auth", JSON.stringify(state));
};

const initialState = getInitialState();

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthSession>) => {
            state.isAuthenticated = true;
            state.login = action.payload.login;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            persistAuthState(state);
        },
        logout: state => {
            state.isAuthenticated = false;
            state.login = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("wounded_auth");
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
