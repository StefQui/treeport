import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';

import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { AppThunk } from 'app/config/store';
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { IAsset } from 'app/shared/model/asset.model';

const initialState = {
  loading: false,
  toto: 'starval',
  renderingState: {},
};

export type RenderingState = Readonly<typeof initialState>;

const apiUrl = 'api/assets';

// Actions

export const getSites = createAsyncThunk(`rendering/fetch_site_list`, async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?type=SITE&${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IAsset[]>(requestUrl);
});

export const setRendering = (path, value) => dispatch => {
  dispatch(setRenderingForPath({ path, value }));
};

export const RenderingSlice = createSlice({
  name: 'rendering',
  initialState: initialState as RenderingState,
  reducers: {
    reset() {
      return initialState;
    },
    setRenderingForPath(state, action) {
      const aaa = {};
      aaa[action.payload.path] = action.payload.value;
      return { ...state, renderingState: { ...state.renderingState, ...aaa } };
    },
    setActivePage(state, action) {
      const aaa = {};
      aaa[action.payload.path] = {
        paginationState: {
          ...state.renderingState[action.payload.path].paginationState,
          activePage: action.payload.value,
        },
        listState: {
          ...state.renderingState[action.payload.path].listState,
        },
      };
      return { ...state, renderingState: { ...state.renderingState, ...aaa } };
    },
    // setAction(action: { source: any; actionType: string; entity: { entityType: string; entity: any; }; }): any {
    setAction(state, action) {
      return { ...state, action: action.payload };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getSites), (state, action) => {
        const { data, headers } = action.payload;
        const { path } = action.meta.arg;

        const aaa = {};
        aaa[path] = {
          paginationState: {
            ...state.renderingState[path].paginationState,
          },
          listState: {
            loading: false,
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        };

        return { ...state, renderingState: { ...state.renderingState, ...aaa } };
      })
      .addMatcher(isPending(getSites), (state, action) => {
        const { path } = action.meta.arg;
        const aaa = {};
        aaa[path] = {
          paginationState: {
            ...state.renderingState[path].paginationState,
          },
          listState: {
            errorMessage: null,
            updateSuccess: false,
            loading: true,
          },
        };
        return { ...state, renderingState: { ...state.renderingState, ...aaa } };
      });
  },
});

export const { reset, setRenderingForPath, setActivePage, setAction } = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
