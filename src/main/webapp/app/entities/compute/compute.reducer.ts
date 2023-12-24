import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Storage } from 'react-jhipster';
import { getSession } from 'app/shared/reducers/authentication';
import { AppThunk } from 'app/config/store';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loadingOrganisations: false,
  loadingTags: false,
  loadingCampaigns: false,
  loadingAssets: false,
  loadingAttributeConfigs: false,
  isComputing: false,
};

export type ComputeState = Readonly<typeof initialState>;

// Actions
const apiUrl = 'api/compute';

export const compute = createAsyncThunk('compute/doCompute', async () => {
  const requestUrl = `${apiUrl}/doCompute`;
  return axios.post<void>(requestUrl);
});

export const reloadOrganisations = createAsyncThunk('compute/reloadOrganisations', async () => {
  const requestUrl = `${apiUrl}/reloadOrganisations`;
  return axios.post<void>(requestUrl);
});

export const reloadTags = createAsyncThunk('compute/reloadTags', async () => {
  const requestUrl = `${apiUrl}/reloadTags`;
  return axios.post<void>(requestUrl);
});

export const reloadCampaigns = createAsyncThunk('compute/reloadCampaigns', async () => {
  const requestUrl = `${apiUrl}/reloadCampaigns`;
  return axios.post<void>(requestUrl);
});

export const reloadAssets = createAsyncThunk('compute/reloadAssets', async () => {
  const requestUrl = `${apiUrl}/reloadAssets`;
  return axios.post<void>(requestUrl);
});

export const reloadAttributeConfigs = createAsyncThunk('compute/reloadAttributeConfigs', async () => {
  const requestUrl = `${apiUrl}/reloadAttributeConfigs`;
  return axios.post<void>(requestUrl);
});

export const ComputeSlice = createSlice({
  name: 'compute',
  initialState: initialState as ComputeState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(compute.pending, state => {
        state.isComputing = true;
      })
      .addCase(compute.rejected, state => {
        state.isComputing = false;
      })
      .addCase(compute.fulfilled, state => {
        state.isComputing = false;
      })
      .addCase(reloadOrganisations.pending, state => {
        state.loadingOrganisations = true;
      })
      .addCase(reloadOrganisations.rejected, state => {
        state.loadingOrganisations = false;
      })
      .addCase(reloadOrganisations.fulfilled, state => {
        state.loadingOrganisations = false;
      })
      .addCase(reloadTags.pending, state => {
        state.loadingTags = true;
      })
      .addCase(reloadTags.rejected, state => {
        state.loadingTags = false;
      })
      .addCase(reloadTags.fulfilled, state => {
        state.loadingTags = false;
      })
      .addCase(reloadCampaigns.pending, state => {
        state.loadingCampaigns = true;
      })
      .addCase(reloadCampaigns.rejected, state => {
        state.loadingCampaigns = false;
      })
      .addCase(reloadCampaigns.fulfilled, state => {
        state.loadingCampaigns = false;
      })
      .addCase(reloadAssets.pending, state => {
        state.loadingAssets = true;
      })
      .addCase(reloadAssets.rejected, state => {
        state.loadingAssets = false;
      })
      .addCase(reloadAssets.fulfilled, state => {
        state.loadingAssets = false;
      })
      .addCase(reloadAttributeConfigs.pending, state => {
        state.loadingAttributeConfigs = true;
      })
      .addCase(reloadAttributeConfigs.rejected, state => {
        state.loadingAttributeConfigs = false;
      })
      .addCase(reloadAttributeConfigs.fulfilled, state => {
        state.loadingAttributeConfigs = false;
      });
  },
});

export const { reset } = ComputeSlice.actions;

// Reducer
export default ComputeSlice.reducer;
