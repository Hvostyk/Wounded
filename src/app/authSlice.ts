import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    login: string | null;
    token: string | null;
}

const stored = localStorage.getItem("wounded_auth");
const initialState: AuthState = stored ? (JSON.parse(stored) as AuthState) : { isAuthenticated: false, login: null, token: null };

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ login: string; token: string }>) => {
            state.isAuthenticated = true;
            state.login = action.payload.login;
            state.token = action.payload.token;
            localStorage.setItem("wounded_auth", JSON.stringify({ isAuthenticated: true, login: action.payload.login, token: action.payload.token }));
        },
        logout: state => {
            state.isAuthenticated = false;
            state.login = null;
            state.token = null;
            localStorage.removeItem("wounded_auth");
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
