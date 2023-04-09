import { ThemeMode } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ThemeState {
  themeMode: ThemeMode | null;
}

const initialState: ThemeState = {
  themeMode: null,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    switchTheme: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, switchTheme } = themeSlice.actions;
export const selectThemeMode = (state: RootState) => state.theme;

export default themeSlice.reducer;
