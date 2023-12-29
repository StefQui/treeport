import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';

import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { AppThunk } from 'app/config/store';
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { ISite } from 'app/shared/model/site.model';
import { IAttribute, IAttributeWithValue } from 'app/shared/model/attribute.model';
import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';
import { IResource } from 'app/shared/model/resource.model';
import { FIELDS_ATTRIBUTES_KEY, RESOURCE_FROM_REF_KEY, UPDATED_ATTRIBUTE_IDS_KEY } from './rendering';

const initialState = {
  context: {},
  renderingState: {},
};

export type RenderingState = Readonly<typeof initialState>;

const siteApiUrl = 'api/sites';
const attributeApiUrl = 'api/attributes';
const resourceApiUrl = 'api/resources';
const computeApiUrl = 'api/compute';

// Actions

export const getSites = createAsyncThunk(`rendering/fetch_site_list`, async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${siteApiUrl}?type=SITE&${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<ISite[]>(requestUrl);
});

export const getResource = createAsyncThunk(`rendering/fetch_resource`, async ({ resourceId }: { resourceId: string; path: string }) => {
  const requestUrl = `${resourceApiUrl}/${resourceId}`;
  return axios.get<IResource[]>(requestUrl);
});

export const getFieldAttributesAndConfig = createAsyncThunk(
  `rendering/fetch_fieldsAttributesAndConfigs`,
  async ({ attributeIdsMap, orgaId }: { attributeIdsMap: any; orgaId: string; path: string }) => {
    const requestUrl = `${attributeApiUrl}/${orgaId}/fieldsAttributesAndConfigs`;
    return axios.post<{ IFieldsAttributesConfigs }>(requestUrl, attributeIdsMap);
  },
);

export const saveAttributes = createAsyncThunk(
  `rendering/fetch_saveAttributes`,
  async ({ attributesToSave, orgaId }: { attributesToSave: IAttributeWithValue[]; orgaId: string; path: string }) => {
    const requestUrl = `${computeApiUrl}/${orgaId}/saveAttributes`;
    return axios.post<string[]>(requestUrl, attributesToSave);
  },
);

export const getAttribute = createAsyncThunk(
  'rendering/fetch_attribute',
  async ({ exploded }: { exploded: IAttributeIdExploded; path: string }, thunkAPI) => {
    const requestUrl = `${attributeApiUrl}/exploded`;
    return axios.post<IAttribute>(requestUrl, exploded);
  },
  { serializeError: serializeAxiosError },
);

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
    setRenderingContext(state, action) {
      return {
        ...state,
        context: action.payload,
      };
    },
    setRenderingForPath(state, action) {
      return {
        ...state,
        renderingState: {
          ...state.renderingState,
          ...{
            [action.payload.path]: {
              ...state.renderingState[action.payload.path],
              ...action.payload.value,
            },
          },
        },
      };
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
      const payload: {
        source: string;
        actionType: 'selectSite' | 'updateAttribute';
        entity: { entityType: 'SITE' | 'RESOURCE'; ([ENTITY_KEY]): any };
      } = action.payload;

      return { ...state, action: payload };
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
      })
      .addMatcher(isFulfilled(getAttribute), (state, action) => {
        const { data } = action.payload;
        const { path } = action.meta.arg;

        const aaa = {};
        aaa[path] = {
          attribute: data,
        };

        return { ...state, renderingState: { ...state.renderingState, ...aaa } };
      })
      .addMatcher(isFulfilled(getResource), (state, action) => {
        return setInState(state, action.meta.arg.path, { [RESOURCE_FROM_REF_KEY]: action.payload.data });
      })
      .addMatcher(isFulfilled(getFieldAttributesAndConfig), (state, action) => {
        return setInState(state, action.meta.arg.path, { [FIELDS_ATTRIBUTES_KEY]: action.payload.data });
      })
      .addMatcher(isFulfilled(saveAttributes), (state, action) => {
        return setInState(state, action.meta.arg.path, { [UPDATED_ATTRIBUTE_IDS_KEY]: action.payload.data });
      });
  },
});

export const setInState = (state, path, value: any) => {
  return {
    ...state,
    renderingState: {
      ...state.renderingState,
      ...{
        [path]: {
          ...state.renderingState[path],
          ...value,
        },
      },
    },
  };
};

export const { reset, setRenderingForPath, setRenderingContext, setActivePage, setAction } = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
