import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from './reducer.utils';

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isOpenAPIEnabled: false,
  showUiOpener: true,
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export const getProfile = createAsyncThunk('applicationProfile/get_profile', async () => axios.get<any>('management/info'), {
  serializeError: serializeAxiosError,
});

export const ApplicationProfileSlice = createSlice({
  name: 'applicationProfile',
  initialState: initialState as ApplicationProfileState,
  reducers: {
    updateShowUiOpener(state, action) {
      const showUiOpener = action.payload;
      state.showUiOpener = showUiOpener;
    },
  },
  extraReducers(builder) {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.ribbonEnv = data['display-ribbon-on-profiles'];
      state.inProduction = data.activeProfiles.includes('prod');
      state.isOpenAPIEnabled = data.activeProfiles.includes('api-docs');
    });
  },
});

export const { updateShowUiOpener } = ApplicationProfileSlice.actions;

// Reducer
export default ApplicationProfileSlice.reducer;
