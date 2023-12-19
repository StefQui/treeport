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

// interface IRendering {
//   toto: string;
// }
const apiUrl = 'api/assets';

// Actions

export const getSites = createAsyncThunk(`rendering/fetch_site_list`, async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?type=SITE&${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IAsset[]>(requestUrl);
});

// export const doSetToto = val => dispatch => {
//   dispatch(setStateForPath(val));
// };

export const setRendering = (path, value) => dispatch => {
  dispatch(setRenderingForPath({ path, value }));
};

// export function setStateForPath(state, action) {
//   const renderingState1 = state.renderingState;
//   renderingState1[action.payload.path] = action.payload.value;

//   return {
//     ...state,
//     renderingState: renderingState1,
//   };
// }

export const RenderingSlice = createSlice({
  name: 'rendering',
  initialState: initialState as RenderingState,
  reducers: {
    reset() {
      return initialState;
    },
    // tata() {
    //   return { ...initialState, toto: 'tata', 'vp.vp2.inp2': 'mmmm', 'vp.inp1': 'iii' };
    // },
    setRenderingForPath(state, action) {
      console.log('setRenderingForPath', action.payload.path, action.payload.value);
      const aaa = {};
      aaa[action.payload.path] = action.payload.value;
      // console.log('setRenderingForPath', aaa, { ...{ renderingState: aaa }, ...state }, action);
      return { ...state, renderingState: { ...state.renderingState, ...aaa } };
    },
    setActivePage(state, action) {
      console.log('setActivePage', action.payload.path, action.payload.value);

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
    // setStateForPath(state, action) {
    //   console.log('setStateForPath1', action.payload.path, action.payload.value);
    //   // const renderingState1 = { ...state.renderingState };
    //   // renderingState1[action.payload.path] = action.payload.value;

    //   // console.log('setStateForPath2', renderingState1);

    //   const found = state.renderingState.find(i => i.path === action.payload.path);
    //   const foundIndex = state.renderingState.findIndex(i => i.path === action.payload.path);
    //   if (foundIndex !== -1) {
    //     let renderingState = state.renderingState;
    //     renderingState = renderingState.map(u => (u.path === action.payload.path ? { ...u, value: action.payload.value } : u));

    //     // state.renderingState[foundIndex].value = action.payload.value;
    //     console.log('setStateForPath1 -A', action.payload.path, action.payload.value);
    //     return {
    //       ...state,
    //       renderingState,
    //     };
    //   }
    //   console.log('setStateForPath1 -B', {
    //     ...state,
    //     renderingState: [...state.renderingState, { path: action.payload.path, value: action.payload.value }],
    //   });

    //   return {
    //     ...state,
    //     renderingState: [...state.renderingState, { path: action.payload.path, value: action.payload.value }],
    //   };
    // },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getSites), (state, action) => {
        const { data, headers } = action.payload;
        const { path } = action.meta.arg;

        console.log('isFulfilled', action, data);
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
        console.log('setRenderingForPataaaa1', aaa);

        console.log('setRenderingForPataaaa2', { ...state, renderingState: { ...state.renderingState, ...aaa } });
        return { ...state, renderingState: { ...state.renderingState, ...aaa } };
      })
      .addMatcher(isPending(getSites), (state, action) => {
        const { path } = action.meta.arg;

        console.log('action.meta.arg', action.meta);

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
        console.log('setRenderingForPathbbbb', { ...state, renderingState: { ...state.renderingState, ...aaa } });
        return { ...state, renderingState: { ...state.renderingState, ...aaa } };
      });
  },
});

export const { reset, setRenderingForPath, setActivePage } = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
