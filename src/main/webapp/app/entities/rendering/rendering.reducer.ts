import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IAttribute, IAttributeWithValue } from 'app/shared/model/attribute.model';
import { IAttributeIdExploded } from 'app/shared/model/attribute-id-exploded';
import { IResource } from 'app/shared/model/resource.model';
import { stubbedResources } from './fake/fake-resource';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { applyPath } from './shared';
import {
  RenderingState,
  ResourceSearchModel,
  TargetInfo,
  RENDERING_SLICE_KEY,
  RENDERING_CONTEXT,
  ParameterTarget,
  ValueInState,
  ActionState,
  CurrentLocalContextPathTarget,
  ChildLocalContextPathTarget,
  PageContextPathTarget,
  SpecificLocalContextPathTarget,
  FetchResourceRequestModel,
} from './type';
import { handleDataTree } from './datatree';

const initialState: RenderingState = {
  componentsState: {},
  localContextsState: {},
  pageResources: {},
  pageContext: {},
  action: null,
  currentPageId: null,
  orgaId: null,
};

// const resourceApiUrlzzzz = `api/resources${ff}`;
const attributeApiUrl = 'api/attributes';
export const resourceApiUrl = 'api/resources';
const computeApiUrl = 'api/compute';

// Actions

export const getResources = createAsyncThunk(`rendering/fetch_resource_list`, async ({ page, size, sort, orgaId }: IQueryParams) => {
  const requestUrl = `api/orga/${orgaId}/resources?type=RESOURCE&${
    sort ? `page=${page}&size=${size}&sort=${sort}&` : ''
  }cacheBuster=${new Date().getTime()}`;
  return axios.get<IResource[]>(requestUrl);
});

export const searchResources = createAsyncThunk(
  `rendering/search`,
  async ({ searchModel, orgaId }: { searchModel: ResourceSearchModel; orgaId: string } & TargetInfo) => {
    const requestUrl = `api/orga/${orgaId}/resources/search`;
    return axios.post<IResourceWithValue[]>(requestUrl, searchModel);
  },
);

export const getResourceForPageResources = createAsyncThunk(
  `renderingForPage/fetch_resource`,
  async ({ resourceId, orgaId }: { resourceId: string; orgaId: string }) => {
    const requestUrl = `api/orga/${orgaId}/resources/${resourceId}`;
    return axios.get<IResourceWithValue[]>(requestUrl);
  },
);

export const getResourceForRenderingStateParameters = createAsyncThunk(
  `rendering/fetch_resource`,
  async ({ resourceId, orgaId }: FetchResourceRequestModel) => {
    const requestUrl = `api/orga/${orgaId}/resources/${resourceId}`;
    return axios.get<IResource[]>(requestUrl);
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
    setRenderingCurrentOrgaId(state: RenderingState, action): RenderingState {
      return {
        ...state,
        orgaId: action.payload,
      };
    },
    setInRenderingStateOutputs(state: RenderingState, action): RenderingState {
      return setInComponentsState(state, action.payload.path, action.payload.value, 'outputs');
    },
    setInRenderingStateSelf(state: RenderingState, action): RenderingState {
      return setInComponentsState(state, action.payload.path, action.payload.value, 'self');
    },
    // setInCorrectState(
    //   state: RenderingState,
    //   action: {
    //     payload: { destinationKey: string; localContextPath: string; target: ParameterTarget; childPath?: string; value: ValueInState };
    //   },
    // ): RenderingState {
    //   return sendValueTo(
    //     state,
    //     action.payload.localContextPath,
    //     action.payload.destinationKey,
    //     action.payload.target,
    //     action.payload.value,
    //   );
    //   // return setInLocalContextState(state, action.payload.localContextPath, action.payload.parameterKey, action.payload.value);
    // },
    setAnyInCorrectState(
      state: RenderingState,
      action: {
        payload: {
          mainTarget: MainTarget;
          secondaryTarget: SecondaryTarget;
          value: any;
        };
      },
    ): RenderingState {
      return sendValueTo2(state, action.payload.mainTarget, action.payload.secondaryTarget, action.payload.value);
    },
    setInLocalState(
      state: RenderingState,
      action: { payload: { localContextPath: string; parameterKey: string; value: ValueInState } },
    ): RenderingState {
      return setAnyInLocalContextState2(
        state,
        action.payload.localContextPath,
        action.payload.parameterKey,
        { secondaryTargetType: 'anyValueInTarget' },
        action.payload.value,
      );
      // return setInLocalContextState(state, action.payload.localContextPath, action.payload.parameterKey, action.payload.value);
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
    setAction(state: RenderingState, action: { payload: ActionState }): RenderingState {
      const payload: ActionState = action.payload;

      return { ...state, action: payload };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(searchResources), (state: RenderingState, action): RenderingState => {
        const { data, headers } = action.payload;
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...1');
        return sendValueTo2(state, mainTarget, secondaryTarget, {
          loading: false,
          value: {
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        });
        // return sendValueTo(
        //   state,
        //   action.meta.arg.localContextPath,
        //   action.meta.arg.destinationKey, // pdef.parameterKey
        //   target,
        //   {
        //     loading: false,
        //     value: {
        //       entities: data,
        //       totalItems: parseInt(headers['x-total-count'], 10),
        //     },
        //   },
        //   treePath ? null : 'listState',
        //   treePath,
        // );
      })
      .addMatcher(isPending(searchResources), (state: RenderingState, action): RenderingState => {
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...2');
        return sendValueTo2(state, mainTarget, secondaryTarget, 'loading');

        // return putInRenderingStateSelf(state, path, {
        //   paginationState: {
        //     ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
        //   },
        //   listState: {
        //     errorMessage: null,
        //     updateSuccess: false,
        //     loading: true,
        //   },
        // });
      })
      .addMatcher(isRejected(searchResources), (state: RenderingState, action): RenderingState => {
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...3');
        return sendValueTo2(state, mainTarget, secondaryTarget, {
          errorMessage: 'Cannot get the search result',
          loading: false,
        });

        // return putInRenderingStateSelf(state, path, {
        //   paginationState: {
        //     ...state.componentsState[path][STATE_RS_SELF_KEY].paginationState,
        //   },
        //   listState: {
        //     errorMessage: null,
        //     updateSuccess: false,
        //     loading: true,
        //   },
        // });
      })
      .addMatcher(isFulfilled(getResources), (state: RenderingState, action): RenderingState => {
        const { data, headers } = action.payload;
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path].self.paginationState,
          },
          listState: {
            loading: false,
            entities: data,
            totalItems: parseInt(headers['x-total-count'], 10),
          },
        });
      })
      .addMatcher(isPending(getResources), (state: RenderingState, action): RenderingState => {
        const { path } = action.meta.arg;

        return putInRenderingStateSelf(state, path, {
          paginationState: {
            ...state.componentsState[path].self.paginationState,
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
      .addMatcher(isFulfilled(getResourceForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...4');
        return sendValueTo2(state, mainTarget, secondaryTarget, {
          value: action.payload.data,
          loading: false,
        });
      })
      .addMatcher(isPending(getResourceForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...5');
        return sendValueTo2(state, mainTarget, secondaryTarget, {
          loading: true,
        });
      })
      .addMatcher(isRejected(getResourceForRenderingStateParameters), (state: RenderingState, action): RenderingState => {
        const { mainTarget, secondaryTarget } = action.meta.arg;
        console.log('sendValueTo2...6');
        return sendValueTo2(state, mainTarget, secondaryTarget, {
          loading: false,
          error: 'Cannot load resource...',
        });
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

// const sendValueTozzz = (
//   state,
//   localContextPath,
//   destinationKey,
//   target: ParameterTarget, // currentLocalContextPath, pageContextPath,...
//   value,
//   additionnalPath?: string | null, // 'listState'
//   treePath?: string[],
// ) => {
//   if (target.targetType === 'currentLocalContextPath') {
//     return setInLocalContextState(state, localContextPath, destinationKey, value, additionnalPath, treePath);
//   } else if (target.targetType === 'specificLocalContextPath') {
//     return setInLocalContextState(state, target.targetPath, destinationKey, value, additionnalPath);
//     // } else if (target.targetType === 'childLocalContextPath') {
//     //   return setInLocalContextState(state, applyPath(localContextPath, childPath), destinationKey, value, additionnalPath);
//   } else if (target.targetType === 'pageContextPath') {
//     return setInPageContextState(state, destinationKey, value, additionnalPath);
//   }
// };

export type CurrentLocalContextPathMainTarget = {
  mainTargetType: 'currentLocalContextPath';
  target: CurrentLocalContextPathTarget;
  localContextPath: string;
};

export type ChildLocalContextPathMainTarget = {
  mainTargetType: 'childLocalContextPath';
  target: ChildLocalContextPathTarget;
  localContextPath: string;
};

export type PageContextPathMainTarget = {
  mainTargetType: 'pageContextPath';
  target: PageContextPathTarget;
};

export type SpecificLocalContextPathMainTarget = {
  mainTargetType: 'specificLocalContextPath';
  target: SpecificLocalContextPathTarget;
  targetPath: string;
};

export type MainTarget =
  | CurrentLocalContextPathMainTarget
  | ChildLocalContextPathMainTarget
  | PageContextPathMainTarget
  | SpecificLocalContextPathMainTarget;

export type ValueTarget = {
  secondaryTargetType: 'valueInTarget';
};
export type AnyValueTarget = {
  secondaryTargetType: 'anyValueInTarget';
};
export type AnyValueTreeTarget = {
  secondaryTargetType: 'anyValueTreeInTarget';
  treePath: string[];
};
export type AnyValueFirstLevelTarget = {
  secondaryTargetType: 'anyValueFirstLevelInTarget';
  firstLevelPath: string;
};
export type SecondaryTarget = ValueTarget | AnyValueTarget | AnyValueTreeTarget | AnyValueFirstLevelTarget;

const sendValueTo2 = (state, mainTarget: MainTarget, secondaryTarget: SecondaryTarget, value: any) => {
  if (mainTarget.mainTargetType === 'currentLocalContextPath') {
    return setAnyInLocalContextState2(state, mainTarget.localContextPath, mainTarget.target.parameterKey, secondaryTarget, value);
  } else if (mainTarget.mainTargetType === 'specificLocalContextPath') {
    return setAnyInLocalContextState2(state, mainTarget.targetPath, mainTarget.target.parameterKey, secondaryTarget, value);
  } else if (mainTarget.mainTargetType === 'pageContextPath') {
    return setInPageContextState2(state, mainTarget.target.parameterKey, secondaryTarget, value);
  }
};

// const sendAnyTo = (state, localContextPath, destinationKey, targetType: 'currentLocalContextPath', value, additionnalPath?: string) => {
//   if (targetType === 'currentLocalContextPath') {
//     return setAnyInLocalContextState(state, localContextPath, destinationKey, value, additionnalPath);
//   }
//   throw new Error('to implement ...AA' + targetType);
// };

const getStubbedOrNot = (resourceId, data) => {
  const stubbed = false;
  if (!stubbed) {
    // console.log('data.contentdata.content', data.content);
    return {
      id: data.id,
      content: JSON.stringify({ content: JSON.parse(data.content) }),
    };
  }
  // console.log('data.contentdata.content', JSON.stringify(stubbedResources[resourceId]));
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

export type TreeNode = {
  content: any;
  isLoading: boolean;
  isOpened: boolean;
  isRoot: boolean;
  childrenAreLoaded: boolean;
  children: TreeNodeWrapper;
};

export type TreeNodeWrapper = {
  [treePath: string]: TreeNode;
};

export type EntitiesValue = {
  loading: boolean;
  value: {
    entities: IResourceWithValue[];
    totalItems: number;
  };
};

function treeBuild(result: TreeNode, value: EntitiesValue | 'loading' | 'close' | 'open', treePath: string[], index: number): TreeNode {
  console.log('treeBuild...', result, index, treePath, value);
  if (index >= treePath.length) {
    console.log('treeBuild111', value);
    if (value === 'loading') {
      return {
        content: { ...result.content },
        isLoading: true,
        isOpened: false,
        childrenAreLoaded: false,
        isRoot: index === 0,
        children: { ...result.children },
      };
    }
    if (value === 'close') {
      return {
        content: { ...result.content },
        isLoading: result.isLoading,
        isOpened: false,
        childrenAreLoaded: result.childrenAreLoaded,
        isRoot: index === 0,
        children: { ...result.children },
      };
    }
    if (value === 'open') {
      return {
        content: { ...result.content },
        isLoading: result.isLoading,
        isOpened: true,
        childrenAreLoaded: result.childrenAreLoaded,
        isRoot: index === 0,
        children: { ...result.children },
      };
    }
    console.log('treeBuild222');
    return {
      content: { ...result.content },
      isRoot: index === 0,
      isLoading: false,
      isOpened: true,
      childrenAreLoaded: true,
      children: value.value.entities.reduce((acc: TreeNodeWrapper, ir: IResourceWithValue) => {
        return {
          ...acc,
          [ir.id]: {
            content: { id: ir.id, name: ir.name, attributeValues: ir.attributeValues },
            isLoading: false,
            isRoot: false,
            childrenAreLoaded: false,
            isOpened: false,
            children: {},
          },
        };
      }, {}),
    };
  }

  // return { content: {}, isLoading: true, isRoot: index === 0, children: {} };
  console.log('treeBuild333');

  return {
    ...result,
    children: { ...result.children, [treePath[index]]: treeBuild(result.children[treePath[index]], value, treePath, index + 1) },
  };
}

function handleTree(treeNode: TreeNode, value: EntitiesValue | 'loading' | 'open' | 'close', treePath: string[]): TreeNode {
  return treeBuild(
    treeNode ?? { content: {}, isLoading: false, isRoot: true, childrenAreLoaded: false, isOpened: false, children: {} },
    value,
    treePath,
    0,
  );
}

// function handleParameters(localContextPath: any, parameterKey: string, value: any, additionnalPath?: string | null, treePath?: string[]) {
//   console.log('handleParameters', parameterKey, value, additionnalPath, treePath);
//   if (additionnalPath) {
//     const bbb = {
//       [parameterKey]: {
//         ...(localContextPath && localContextPath.parameters[parameterKey]),
//         ...{ [additionnalPath]: value },
//       },
//     };
//     console.log('handle bbb', bbb);
//     return bbb;
//   } else if (treePath) {
//     return {
//       [parameterKey]: handleTree(localContextPath ? localContextPath.parameters[parameterKey] : {}, value, treePath),
//     };
//   } else {
//     console.log('handle ddd', { [parameterKey]: value });
//     return { [parameterKey]: value };
//   }
// }

function handleParameters2(localContextPath: any, parameterKey: string, target: SecondaryTarget, value: any) {
  console.log('handleParameters...', parameterKey, target);
  if (target.secondaryTargetType === 'anyValueFirstLevelInTarget') {
    const bbb = {
      [parameterKey]: {
        ...(localContextPath && localContextPath.parameters[parameterKey]),
        ...{ [target.firstLevelPath]: value },
      },
    };
    console.log('handle bbb', bbb);
    return bbb;
  } else if (target.secondaryTargetType === 'anyValueTreeInTarget') {
    console.log('handle anyValueTreeInTarget');
    return {
      [parameterKey]: handleTree(localContextPath ? localContextPath.parameters[parameterKey] : {}, value, target.treePath),
    };
  } else {
    console.log('handle default', { [parameterKey]: value });
    return { [parameterKey]: value };
  }
}

// export const setInLocalContextState = (
//   state: RenderingState,
//   localContextPath,
//   parameterKey: string, // pdef.parameterKey
//   value: ValueInState,
//   additionnalPath?: string | null,
//   treePath?: string[],
// ): RenderingState => {
//   // console.log('setInLocalContextState', parameterKey);
//   return setAnyInLocalContextState(state, localContextPath, parameterKey, value, additionnalPath, treePath);
// };

// export const setAnyInLocalContextState = (
//   state: RenderingState,
//   localContextPath,
//   parameterKey: string, // pdef.parameterKey
//   value: any,
//   additionnalPath?: string | null,
//   treePath?: string[],
// ): RenderingState => {
//   console.log('setInLocalContextState', parameterKey, additionnalPath, value);

//   const aaa = {
//     ...state,
//     localContextsState: {
//       ...state.localContextsState,
//       ...{
//         [localContextPath]: {
//           parameters: {
//             ...(state.localContextsState[localContextPath] && state.localContextsState[localContextPath].parameters),
//             ...handleParameters(state.localContextsState[localContextPath], parameterKey, value, additionnalPath, treePath),
//           },
//         },
//       },
//     },
//   };
//   // console.log('aaakkk', parameterKey, additionnalPath, aaa);
//   return aaa;
// };

export const setAnyInLocalContextState2 = (
  state: RenderingState,
  localContextPath,
  parameterKey: string, // pdef.parameterKey
  secondaryTarget: SecondaryTarget,
  value: any,
): RenderingState => {
  console.log('setInLocalContextState', parameterKey, secondaryTarget, value, localContextPath);

  return {
    ...state,
    localContextsState: {
      ...state.localContextsState,
      ...{
        [localContextPath]: {
          parameters: {
            ...(state.localContextsState[localContextPath] && state.localContextsState[localContextPath].parameters),
            ...handleParameters2(state.localContextsState[localContextPath], parameterKey, secondaryTarget, value),
          },
        },
      },
    },
  };
};

// export const setInPageContextState = (
//   state: RenderingState,
//   parameterKey: string,
//   value: ValueInState,
//   additionnalPath?: string,
// ): RenderingState => {
//   // console.log('setInLocalContextState', parameterKey);
//   return {
//     ...state,
//     pageContext: {
//       ...state.pageContext,
//       ...{
//         [parameterKey]: additionnalPath
//           ? {
//               ...(state.pageContext[parameterKey]
//                 ? {
//                     ...state.pageContext[parameterKey],
//                     ...{ [additionnalPath]: value },
//                   }
//                 : { [additionnalPath]: value }),
//             }
//           : value,
//       },
//     },
//   };
// };

export const setInPageContextState2 = (
  state: RenderingState,
  parameterKey: string,
  secondaryTarget: SecondaryTarget,
  value: any,
): RenderingState => {
  // console.log('setInLocalContextState', parameterKey);
  return {
    ...state,
    pageContext: {
      ...state.pageContext,
      ...{
        [parameterKey]: {
          parameters: {
            ...(state.pageContext && state.pageContext.parameters),
            ...handleParameters2(state.pageContext, parameterKey, secondaryTarget, value),
          },
        },
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
  setRenderingCurrentOrgaId,
  setInRenderingStateOutputs,
  setInLocalState,
  setAnyInCorrectState,
  // setInCorrectState,
  setInRenderingStateSelf,
  setActivePage,
  setAction,
} = RenderingSlice.actions;

// Reducer
export default RenderingSlice.reducer;
