import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { AppThunk } from 'app/config/store';
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { ISite } from 'app/shared/model/site.model';
import { IAttribute, IAttributeWithValue } from 'app/shared/model/attribute.model';
import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';
import { IResource } from 'app/shared/model/resource.model';
import {
  FIELDS_ATTRIBUTES_KEY,
  RESOURCE_FROM_REF_KEY,
  SITE_FROM_REF_KEY,
  STATE_PAGE_CONTEXT_KEY,
  STATE_PAGE_RESOURCES_KEY,
  STATE_PAGE_RESOURCE_KEY,
  // STATE_RS_LOCAL_CONTEXT_KEY,
  STATE_RS_SELF_KEY,
  STATE_RS_OUTPUTS_KEY,
  STATE_RS_PARAMETERS_KEY,
  UPDATED_ATTRIBUTE_IDS_KEY,
  STATE_CURRENT_PAGE_ID_KEY,
  RENDERING_CONTEXT,
  RESOURCE_STATE,
  STATE_RENDERING_STATE_KEY,
  RENDERING_SLICE_KEY,
} from './rendering';
import { stubbedResources } from './fake-resource';

const initialState = {
  // context: {},
  // renderingLayout: [],
  [STATE_RENDERING_STATE_KEY]: {},
  [STATE_PAGE_RESOURCES_KEY]: {},
  [STATE_PAGE_CONTEXT_KEY]: {},
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

// export const setRendering = (path, value) => dispatch => {
//   dispatch(setRenderingForPath({ path, value }));
// };

export const RenderingSlice = createSlice({
  name: RENDERING_SLICE_KEY,
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
    setRenderingPageContext(state, action: { payload: RENDERING_CONTEXT }) {
      return {
        ...state,
        [STATE_PAGE_CONTEXT_KEY]: action.payload,
      };
    },
    setRenderingPageResources(state, action) {
      return {
        ...state,
        [STATE_PAGE_RESOURCES_KEY]: action.payload,
      };
    },
    // setRenderingLayoutElements(state, action) {
    //   return {
    //     ...state,
    //     [STATE_LAYOUT_ELEMENTS_KEY]: action.payload,
    //   };
    // },
    setRenderingCurrentPageId(state, action) {
      return {
        ...state,
        [STATE_CURRENT_PAGE_ID_KEY]: action.payload,
      };
    },
    setInRenderingStateParameters(state, action: { payload: { path: string; value: RENDERING_CONTEXT } }) {
      return setInRenderingState(state, action.payload.path, action.payload.value, STATE_RS_PARAMETERS_KEY);
    },
    setInRenderingStateOutputs(state, action) {
      return setInRenderingState(state, action.payload.path, action.payload.value, STATE_RS_OUTPUTS_KEY);
    },
    setInRenderingStateSelf(state, action) {
      return setInRenderingState(state, action.payload.path, action.payload.value, STATE_RS_SELF_KEY);
    },
    setInLocalState(state, action: { payload: { localContextPath: string; parameterKey: string; value: RESOURCE_STATE } }) {
      return setInLocalContextState(state, action.payload.localContextPath, action.payload.parameterKey, action.payload.value);
    },
    // setInRenderingStateLocalContext(state, action) {
    //   return setInRenderingState(state, action.payload.path, action.payload.value, STATE_RS_LOCAL_CONTEXT_KEY);
    // },
    // setRenderingForPath(state, action) {
    //   return {
    //     ...state,
    //     renderingState: {
    //       ...state.renderingState,
    //       ...{
    //         [action.payload.path]: {
    //           ...state.renderingState[action.payload.path],
    //           ...action.payload.value,
    //         },
    //       },
    //     },
    //   };
    // },
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

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.renderingState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            loading: false,
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        });
      })
      .addMatcher(isPending(getSites), (state, action) => {
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.renderingState[path][STATE_RS_SELF_KEY].paginationState,
          },
          listState: {
            errorMessage: null,
            updateSuccess: false,
            loading: true,
          },
        });
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
      .addMatcher(isPending(getResourceForPageResources), (state, action) => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: true,
          },
        });
      })
      .addMatcher(isFulfilled(getResourceForPageResources), (state, action) => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: false,
            value: getStubbedOrNot(action.meta.arg.resourceId, action.payload.data),
          },
        });
      })
      .addMatcher(isRejected(getResourceForPageResources), (state, action) => {
        return putRenderingPageResources(state, {
          [action.meta.arg.resourceId]: {
            loading: false,
            error: 'error when fetch ing resource',
          },
        });
      })
      .addMatcher(isFulfilled(getSiteForRenderingStateParameters), (state, action) => {
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
      .addMatcher(isPending(getSiteForRenderingStateParameters), (state, action) => {
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
      .addMatcher(isRejected(getSiteForRenderingStateParameters), (state, action) => {
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
      .addMatcher(isFulfilled(getFieldAttributesAndConfig), (state, action) => {
        return putInRenderingStateOutputs(state, action.meta.arg.path, { [FIELDS_ATTRIBUTES_KEY]: action.payload.data });
      })
      .addMatcher(isFulfilled(saveAttributes), (state, action) => {
        return putInRenderingStateOutputs(state, action.meta.arg.path, { [UPDATED_ATTRIBUTE_IDS_KEY]: action.payload.data });
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

// export const setInRenderingState = (state, path, value: any) => {
//   return {
//     ...state,
//     renderingState: {
//       ...state.renderingState,
//       ...{
//         [path]: {
//           ...state.renderingState[path],
//           ...value,
//         },
//       },
//     },
//   };
// };

const putRenderingPageResources = (state, value: { [key: string]: RESOURCE_STATE }) => {
  return setInState(state, STATE_PAGE_RESOURCES_KEY, value);
};

const putInRenderingStateParameters = (state, path, value: { [key: string]: RESOURCE_STATE }) => {
  return setInRenderingState(state, path, value, STATE_RS_PARAMETERS_KEY);
};

const putInRenderingStateOutputs = (state, path, value: any) => {
  return setInRenderingState(state, path, value, STATE_RS_OUTPUTS_KEY);
};

const putInRenderingStateSelf = (state, path, value: any) => {
  return setInRenderingState(state, path, value, STATE_RS_SELF_KEY);
};

// const putInRenderingStateLocalContext = (state, path, value: any) => {
//   return setInRenderingState(state, path, value, STATE_RS_LOCAL_CONTEXT_KEY);
// };

export const setInLocalContextState = (state, localContextPath, parameterKey: string, value: RESOURCE_STATE) => {
  // console.log('setInLocalContextState', parameterKey);
  return {
    ...state,
    [STATE_RENDERING_STATE_KEY]: {
      ...state[STATE_RENDERING_STATE_KEY],
      ...{
        [localContextPath]: {
          ...state[STATE_RENDERING_STATE_KEY][localContextPath],
          ...{
            [STATE_RS_PARAMETERS_KEY]: {
              ...(state[STATE_RENDERING_STATE_KEY][localContextPath]
                ? {
                    ...state[STATE_RENDERING_STATE_KEY][localContextPath][STATE_RS_PARAMETERS_KEY],
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

export const setInPageContextState = (state, parameterKey: string, value: RESOURCE_STATE) => {
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

export const setInRenderingState = (state, path, value: any, key: string) => {
  return {
    ...state,
    renderingState: {
      ...state.renderingState,
      ...{
        [path]: {
          ...state.renderingState[path],
          ...{
            [key]: {
              ...(state.renderingState[path] ? state.renderingState[path][key] : null),
              ...value,
            },
          },
        },
      },
    },
  };
};

export const setInState = (state, path, value: any) => {
  return {
    ...state,
    ...{
      [path]: {
        ...state[path],
        ...value,
      },
    },
  };
};

export const {
  reset,
  setRenderingContext,
  setRenderingPageContext,
  setRenderingPageResources,
  // setRenderingLayoutElements,
  setRenderingCurrentPageId,
  setInRenderingStateParameters,
  setInRenderingStateOutputs,
  setInLocalState,
  setInRenderingStateSelf,
  // setInRenderingStateLocalContext,
  setActivePage,
  setAction,
} = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
