import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { ISite } from 'app/shared/model/site.model';
import { IAttribute, IAttributeWithValue } from 'app/shared/model/attribute.model';
import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';
import { IResource } from 'app/shared/model/resource.model';
import {
  // FIELDS_ATTRIBUTES_KEY,
  STATE_PAGE_CONTEXT_KEY,
  STATE_RS_SELF_KEY,
  STATE_RS_OUTPUTS_KEY,
  // UPDATED_ATTRIBUTE_IDS_KEY,
  RENDERING_CONTEXT,
  ValueInState,
  RENDERING_SLICE_KEY,
  ActionState,
  RenderingState,
  ResourceSearchModel,
} from './rendering';
import { stubbedResources } from './fake-resource';

const initialState: RenderingState = {
  componentsState: {},
  localContextsState: {},
  pageResources: {},
  pageContext: {},
  action: null,
  currentPageId: null,
};

const siteApiUrl = 'api/sites';
const attributeApiUrl = 'api/attributes';
const resourceApiUrl = 'api/resources';
const computeApiUrl = 'api/compute';

// Actions

export const getSites = createAsyncThunk(`rendering/fetch_site_list`, async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${siteApiUrl}?type=SITE&${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<ISite[]>(requestUrl);
});

export const searchResources = createAsyncThunk(
  `rendering/search`,
  async ({ searchModel, orgaId }: { searchModel: ResourceSearchModel; orgaId: string; path: string }) => {
    const requestUrl = `${resourceApiUrl}/${orgaId}/search`;
    return axios.post<IResource[]>(requestUrl, searchModel);
  },
);

export const getResourceForPageResources = createAsyncThunk(`rendering/fetch_resource`, async ({ resourceId }: { resourceId: string }) => {
  const requestUrl = `${resourceApiUrl}/${resourceId}`;
  return axios.get<IResource[]>(requestUrl);
});

export const getSiteForRenderingStateParameters = createAsyncThunk(
  `rendering/fetch_site`,
  async ({ siteId }: { siteId: string; destinationKey: string; localContextPath: string; inPageContext?: boolean }) => {
    const requestUrl = `${siteApiUrl}/${siteId}`;
    return axios.get<ISite[]>(requestUrl);
  },
);

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

export const RenderingSlice = createSlice({
  name: RENDERING_SLICE_KEY,
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setRenderingPageContext(state: RenderingState, action: { payload: RENDERING_CONTEXT }): RenderingState {
      return {
        ...state,
        pageContext: action.payload,
      };
    },
    setRenderingPageResources(state: RenderingState, action): RenderingState {
      return {
        ...state,
        pageResources: action.payload,
      };
    },
    setRenderingCurrentPageId(state: RenderingState, action): RenderingState {
      return {
        ...state,
        currentPageId: action.payload,
      };
    },
    setInRenderingStateOutputs(state: RenderingState, action): RenderingState {
      return setInComponentsState(state, action.payload.path, action.payload.value, STATE_RS_OUTPUTS_KEY);
    },
    setInRenderingStateSelf(state: RenderingState, action): RenderingState {
      return setInComponentsState(state, action.payload.path, action.payload.value, STATE_RS_SELF_KEY);
    },
    setInLocalState(
      state: RenderingState,
      action: { payload: { localContextPath: string; parameterKey: string; value: ValueInState } },
    ): RenderingState {
      return setInLocalContextState(state, action.payload.localContextPath, action.payload.parameterKey, action.payload.value);
    },
    setActivePage(state: RenderingState, action): RenderingState {
      const aaa = {};
      aaa[action.payload.path] = {
        paginationState: {
          ...state.componentsState[action.payload.path].paginationState,
          activePage: action.payload.value,
        },
        listState: {
          ...state.componentsState[action.payload.path].listState,
        },
      };
      return { ...state, componentsState: { ...state.componentsState, ...aaa } };
    },
    // setAction(action: { source: any; actionType: string; entity: { entityType: string; entity: any; }; }): any {
    setAction(state: RenderingState, action): RenderingState {
      const payload: ActionState = action.payload;

      return { ...state, action: payload };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(searchResources), (state: RenderingState, action): RenderingState => {
        const { data, headers } = action.payload;
        const { searchModel, orgaId, path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            loading: false,
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        });
      })
      .addMatcher(isPending(searchResources), (state: RenderingState, action): RenderingState => {
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            errorMessage: null,
            updateSuccess: false,
            loading: true,
          },
        });
      })
      .addMatcher(isFulfilled(getSites), (state: RenderingState, action): RenderingState => {
        const { data, headers } = action.payload;
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            loading: false,
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        });
      })
      .addMatcher(isPending(getSites), (state: RenderingState, action): RenderingState => {
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            errorMessage: null,
            updateSuccess: false,
            loading: true,
          },
        });
      })
      .addMatcher(isFulfilled(getAttribute), (state: RenderingState, action): RenderingState => {
        const { data } = action.payload;
        const { path } = action.meta.arg;

        const aaa = {};
        aaa[path] = {
          attribute: data,
        };

        return { ...state, componentsState: { ...state.componentsState, ...aaa } };
      })
      .addMatcher(isPending(getResourceForPageResources), (state: RenderingState, action): RenderingState => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: true,
          },
        });
      })
      .addMatcher(isFulfilled(getResourceForPageResources), (state: RenderingState, action): RenderingState => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: false,
            value: getStubbedOrNot(action.meta.arg.resourceId, action.payload.data),
          },
        });
      })
      .addMatcher(isRejected(getResourceForPageResources), (state: RenderingState, action): RenderingState => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: false,
            error: 'error when fetch ing resource',
          },
        });
      })
      .addMatcher(isFulfilled(getSiteForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        if (action.meta.arg.localContextPath) {
          return setInLocalContextState(state, action.meta.arg.localContextPath, action.meta.arg.destinationKey, {
            value: action.payload.data,
            loading: false,
          });
        } else if (action.meta.arg.inPageContext) {
          return setInPageContextState(state, action.meta.arg.destinationKey, {
            value: action.payload.data,
            loading: false,
          });
        }
      })
      .addMatcher(isPending(getSiteForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        if (action.meta.arg.localContextPath) {
          return setInLocalContextState(state, action.meta.arg.localContextPath, action.meta.arg.destinationKey, {
            loading: true,
          });
        } else if (action.meta.arg.inPageContext) {
          return setInPageContextState(state, action.meta.arg.destinationKey, {
            loading: true,
          });
        }
      })
      .addMatcher(isRejected(getSiteForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        if (action.meta.arg.localContextPath) {
          return setInLocalContextState(state, action.meta.arg.localContextPath, action.meta.arg.destinationKey, {
            loading: false,
            error: 'Cannot load site...',
          });
        } else if (action.meta.arg.inPageContext) {
          return setInPageContextState(state, action.meta.arg.destinationKey, {
            loading: false,
            error: 'Cannot load site...',
          });
        }
      })
      .addMatcher(isFulfilled(getFieldAttributesAndConfig), (state: RenderingState, action): RenderingState => {
        return putInRenderingStateSelf(state, action.meta.arg.path, { fieldAttributes: action.payload.data });
        // return putInRenderingStateOutputs(state, action.meta.arg.path, { [FIELDS_ATTRIBUTES_KEY]: action.payload.data });
      })
      .addMatcher(isFulfilled(saveAttributes), (state: RenderingState, action): RenderingState => {
        return putInRenderingStateSelf(state, action.meta.arg.path, { updatedAttributeIds: action.payload.data });
      });
  },
});

const getStubbedOrNot = (resourceId, data) => {
  const stubbed = true;
  if (!stubbed) {
    return data;
  }
  return {
    id: resourceId,
    content: JSON.stringify(stubbedResources[resourceId]),
  };
};

const putRenderingPageResources = (state: RenderingState, value: { [key: string]: ValueInState }): RenderingState => {
  return setInPageResourcesState(state, value);
};

const putInRenderingStateSelf = (state: RenderingState, path, value: any): RenderingState => {
  return setInComponentsState(state, path, value, 'self');
};

export const setInLocalContextState = (
  state: RenderingState,
  localContextPath,
  parameterKey: string,
  value: ValueInState,
): RenderingState => {
  // console.log('setInLocalContextState', parameterKey);
  return {
    ...state,
    localContextsState: {
      ...state.localContextsState,
      ...{
        [localContextPath]: {
          ...state.localContextsState[localContextPath],
          ...{
            parameters: {
              ...(state.localContextsState[localContextPath]
                ? {
                    ...state.localContextsState[localContextPath].parameters,
                    ...{ [parameterKey]: value },
                  }
                : {
                    ...{ [parameterKey]: value },
                  }),
            },
          },
        },
      },
    },
  };
};

export const setInPageContextState = (state: RenderingState, parameterKey: string, value: ValueInState): RenderingState => {
  // console.log('setInLocalContextState', parameterKey);
  return {
    ...state,
    [STATE_PAGE_CONTEXT_KEY]: {
      ...state[STATE_PAGE_CONTEXT_KEY],
      ...{
        [parameterKey]: value,
      },
    },
  };
};

export const setInComponentsState = (state: RenderingState, path, value: any, key: 'outputs' | 'self'): RenderingState => {
  return {
    ...state,
    componentsState: {
      ...state.componentsState,
      ...{
        [path]: {
          ...state.componentsState[path],
          ...{
            [key]: {
              ...(state.componentsState[path] ? state.componentsState[path][key] : null),
              ...value,
            },
          },
        },
      },
    },
  };
};

export const setInPageResourcesState = (state: RenderingState, value: { [key: string]: ValueInState }): RenderingState => {
  return {
    ...state,
    ...{
      pageResources: {
        ...state.pageResources,
        ...value,
      },
    },
  };
};

export const {
  reset,
  setRenderingPageContext,
  setRenderingPageResources,
  setRenderingCurrentPageId,
  setInRenderingStateOutputs,
  setInLocalState,
  setInRenderingStateSelf,
  setActivePage,
  setAction,
} = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
