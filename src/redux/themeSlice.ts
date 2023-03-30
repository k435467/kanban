import { ThemeMode } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ThemeState {
  themeMode: ThemeMode;
}

const initialState: ThemeState = {
  themeMode: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
  },
});

export const { switchTheme } = themeSlice.actions;
export const selectThemeMode = (state: RootState) => state.theme;

export default themeSlice.reducer;
