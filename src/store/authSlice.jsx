import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    userId: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.userId = action.payload.userId;
            localStorage.setItem("token", action.payload.token);
        },
        logout(state) {
            state.token = null;
            state.isLoggedIn = false;
            state.userId = null;
            localStorage.removeItem("token");
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;