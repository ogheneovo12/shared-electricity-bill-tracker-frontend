import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface LayoutState {
  mode: "light" | "dark";
  sidebarCollapsed: boolean;
  showProjectNameForm: boolean;
}

const initialState: LayoutState = {
  mode: "light",
  sidebarCollapsed: false,
  showProjectNameForm: true,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSideBarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleShowProjectNameForm(state) {
      state.showProjectNameForm = !state.showProjectNameForm;
    },
    setMode(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { toggleSideBarCollapsed, setMode, toggleShowProjectNameForm } =
  layoutSlice.actions;
export default layoutSlice.reducer;
