import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useEffect, useState } from 'react';
import { handleDataSet } from './dataset';
import { usePageContext } from './sm-layout';
import {
  applyPath,
  buildValue,
  getRootPath,
  getValueForPathInObject,
  PATH_SEPARATOR,
  useCalculatedValueState,
  useChangingCalculatedValueState,
} from './shared';
import { getResourceForRenderingStateParameters, setAnyInCorrectState } from './rendering.reducer';
import {
  ValueInState,
  Parameters,
  RenderingSliceState,
  emptyValue,
  RENDERING_CONTEXT,
  PaginationState,
  ActionState,
  SetCurrentPageAction,
  ParameterDefinition,
  RefToResourceDefinition,
  DatasetDefinition,
  ParameterTarget,
  RefToPageContextRuleDefinition,
  DatatreeDefinition,
} from './type';
import { enrichToMainTarget, handleDataTree } from './datatree';
import { useParams } from 'react-router';
import { useOrgaId } from './render-resource-page';

export const useRefToLocalContextValue = (currentLocalContextPath, localContextPath, parameterKey, parameterProperty): ValueInState => {
  return useAppSelector((state: RenderingSliceState) => {
    const contextForLocalContextPath = state.rendering.localContextsState
      ? state.rendering.localContextsState[applyPath(currentLocalContextPath, localContextPath)]
      : null;
    console.log(
      'useRefToLocalContextValuedd',
      currentLocalContextPath,
      localContextPath,
      parameterKey,
      parameterProperty,
      contextForLocalContextPath,
    );
    if (!contextForLocalContextPath) {
      return null;
    }
    const contextForLocalContextPathParameters = contextForLocalContextPath.parameters;
    if (!contextForLocalContextPathParameters) {
      return null;
    }
    const valForKey = contextForLocalContextPathParameters[parameterKey];
    if (!valForKey) {
      return emptyValue;
    }
    console.log('zzzzz2222', parameterProperty);
    if (!parameterProperty) {
      // console.log('useRefToLocalContextValue2', valForKey);
      return valForKey;
    }
    console.log('zzzzz3333', valForKey, parameterProperty);
    if (!valForKey.value) {
      return emptyValue;
    }
    console.log('zzzzz44444', parameterProperty);
    return buildValue(getValueForPathInObject(valForKey.value, parameterProperty));
  });
};

export const useRefToLocalContext = (targetLocalContextPath): Parameters => {
  return useAppSelector((state: RenderingSliceState) => {
    // console.log('useRefToLocalContext--------------------', localContextPath, state[RENDERING_SLICE_KEY][STATE_RENDERING_STATE_KEY]);
    const contextForLocalContextPath = state.rendering.localContextsState
      ? state.rendering.localContextsState[targetLocalContextPath]
      : null;
    if (!contextForLocalContextPath) {
      return null;
    }
    return contextForLocalContextPath.parameters;
  });
};

export const useRefToPageContextValue = (props, ruleDefinition: RefToPageContextRuleDefinition): ValueInState => {
  const [contextValue, setContextValue] = useState({ loading: false });

  // console.log('useRefToPageContextValu--------', definition);

  const pageContext: RENDERING_CONTEXT = usePageContext();
  useEffect(() => {
    setContextValue(pageContext[ruleDefinition.sourceParameterKey]);
  }, [pageContext]);

  return contextValue;
  // return { loading: false, value: 'tatassss' };
};

export const useConstantValue = (props, initialValue: PaginationState | string | number): ValueInState => {
  const [val, setVal] = useState({ loading: false, value: initialValue });
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'setCurrentPage' && (val.value as PaginationState).activePage) {
      const action1: SetCurrentPageAction = action;
      console.log('action1', action1, val);
      setVal({ loading: false, value: { ...(val.value as PaginationState), activePage: action1.currentPage } });
      // } else if (action && action.actionType === 'refreshDataset') {
      //   console.log('action2', action);
      //   setVal({ loading: false, value: initialValue });
    }
  }, [action]);

  return val;
};

// export const useConstantDatasetFilter = (props, definition: DatasetFilterRuleDefinition): ValueInState => {
//   console.log('useConstantDatasetFilter', definition.valueFilter);
//   const [val, setVal] = useState(initialFilter);
//   useEffect(() => {
//     console.log('First useConstantDatasetFilter');
//     setVal({ loading: false, value: definition.valueFilter });
//   }, []);
//   return val;
// };

export const initLocalContext = (parameterDefinitions: ParameterDefinition[], props, targetLocalContextPath) => {
  // const localContextPath = calculateLocalContextPath(props);

  if (parameterDefinitions) {
    parameterDefinitions.forEach(pdef => {
      const key = pdef.target.parameterKey;

      console.log('initLocalContext for ' + pdef.definition.ruleType);
      handleParameterDefinition(pdef, props);
    });
  }
};

export const handleParameterDefinition = (pdef: ParameterDefinition, props) => {
  const dispatch = useAppDispatch();
  const target = pdef.target;
  if (pdef.definition.ruleType === 'refToResource') {
    handleRefToResource(target, pdef.definition as RefToResourceDefinition, props);
    // } else if (pdef.definition.ruleType === 'datasetFilter') {
    //   handleDatasetFilter(key, target, pdef.definition as DatasetFilterDefinition, props);
  } else if (pdef.definition.ruleType === 'dataset') {
    const dsDef = pdef.definition as DatasetDefinition;
    handleDataSet(target, dsDef, props);
  } else if (pdef.definition.ruleType === 'datatree') {
    const dsDef = pdef.definition as DatatreeDefinition;
    handleDataTree(target, dsDef, props);
    // } else if (pdef.definition.ruleType === 'itemParamProperty') {
    //   const dsDef = pdef.definition as ItemParamPropertyRuleDefinition;
    //   handleDataSet(pdef.parameterKey, target, dsDef, props);

    // } else if (pdef.definition.ruleType === 'datasetFilter') {
    //   const dsfDef = pdef.definition as DatasetFilterRuleDefinition;
    //   dsfDef.valueFilter;
    //   const changingFilter = useChangingCalculatedFilterValueState(props, dsfDef, target);
    //   // const changing = useChangingCalculatedValueState(props, pdef, target);
    //   useEffect(() => {
    //     console.log('filter.......changed2');
    //     dispatch(
    //       setInCorrectState({
    //         destinationKey: pdef.parameterKey,
    //         localContextPath: props.localContextPath,
    //         target,
    //         childPath: props.path,
    //         value: changingFilter,
    //       }),
    //     );
    //     // });
    //   }, [changingFilter]);
  } else {
    // const [previousResult, setPreviousResult] = useState(null);
    // const result = useCalculatedValueState(props, pdef.definition);
    const changing = useChangingCalculatedValueState(props, pdef, target);
    // console.log('filter.......other', pdef.definition, result, previousResult);
    useEffect(() => {
      // console.log('filter.......4', previousResult, result, valHasChanged(previousResult, result));
      // if (!valHasChanged(previousResult, result)) {
      //   return;
      // }
      // pkeys.forEach(paramKey => {
      console.log('filter.......changed');
      // setPreviousResult(result);

      // dispatch(
      //   setInCorrectState({
      //     destinationKey: target.parameterKey,
      //     localContextPath: props.localContextPath,
      //     target,
      //     childPath: props.path,
      //     value: changing,
      //   }),
      // );
      dispatch(
        setAnyInCorrectState({
          mainTarget: enrichToMainTarget(target, applyPath(props.localContextPath, props.path)),
          secondaryTarget: {
            secondaryTargetType: 'anyValueInTarget',
          },
          value: changing,
        }),
      );
      // });
    }, [changing]);
  }
};

// const valHasChanged = (previous, result): boolean => {
//   if (!previous && result) {
//     return true;
//   } else if (!previous && !result) {
//     return false;
//   } else if (previous && !result) {
//     return true;
//   }
//   return JSON.stringify(previous) === JSON.stringify(result);
// };

// const useSetCurrentPageAction = (props, initialValue: PaginationState | string | number) => {
//   const [val, setVal] = useState(null);
//   const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
//   useEffect(() => {
//     if (action && action.actionType === 'setCurrentPage') {
//       const action1: SetCurrentPageAction = action;
//       console.log('action1', action1, val);
//       setVal(action1.currentPage);
//     }
//   }, [action]);

//   return val;
// };

// const setPaginationTo = (pagination: PaginationState, props, key, dispatch) => {
//   dispatch(
//     setAnyInCorrectState({
//       localContextPath: props.localContextPath,
//       destinationKey: key,
//       targetType: 'currentLocalContextPath',
//       value: pagination,
//       additionnalPath: 'paginationState',
//     }),
//   );
// };

// const handleDataSet = (key: string, target: ParameterTarget, refToResourceDefinition: DatasetDefinition, props) => {
//   const dispatch = useAppDispatch();
//   const filter = useCalculatedValueState(props, refToResourceDefinition.filter);
//   const initialPaginationState = refToResourceDefinition.initialPaginationState;
//   const setCurrentPageAction = useSetCurrentPageAction(props, initialPaginationState);

//   const dsfDef = refToResourceDefinition.valueFilter as ResourceFilter;
//   const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);
//   // const changing = useChangingCalculatedValueState(props, pdef, target);
//   // useEffect(() => {
//   //   console.log('filter.......changed2');
//   //   dispatch(
//   //     setInCorrectState({
//   //       destinationKey: pdef.parameterKey,
//   //       localContextPath: props.localContextPath,
//   //       target,
//   //       childPath: props.path,
//   //       value: changingFilter,
//   //     }),
//   //   );
//   //   // });
//   // }, [changingFilter]);

//   useEffect(() => {
//     if (setCurrentPageAction) {
//       setPaginationTo({ ...paginationProp, activePage: setCurrentPageAction }, props, key, dispatch);
//     }
//   }, [setCurrentPageAction]);

//   useEffect(() => {
//     setPaginationTo(initialPaginationState, props, key, dispatch);
//   }, []);

//   console.log(
//     'handleDataSet.......handleDataSet',
//     props.localContextPath,
//     applyPath(props.localContextPath, ''),
//     refToResourceDefinition.filter,
//   );

//   // const activePage = useCalculatedValueState(props, refToResourceDefinition.paginationState);
//   // const paginationState = useCalculatedValueState(props, refToResourceDefinition.paginationState);
//   // const ps = {
//   //   activePage: 1,
//   //   itemsPerPage: 10,
//   //   sort: 'id',
//   //   order: 'asc',
//   // };
//   const [previousFilter, setPreviousFilter] = useState({ loading: true });

//   const paginationProp = usePaginationProp(props, {
//     ruleType: 'refToLocalContext',
//     path: '',
//     sourceParameterKey: key,
//   });

//   useEffect(() => {
//     console.log('filter.......handleDataSet', changingFilter);
//     if (!changingFilter || !changingFilter.value || changingFilter.value.loading || !paginationProp) {
//       return;
//     }
//     // const ps = {
//     //   activePage: 1,
//     //   itemsPerPage: 10,
//     //   sort: 'id',
//     //   order: 'asc',
//     // };
//     // const ps = paginationState.value;

//     dispatch(
//       searchResources({
//         searchModel: {
//           resourceType: 'SITE',
//           columnDefinitions: refToResourceDefinition.columnDefinitions,
//           filter: changingFilter ? changingFilter.value : null,
//           page: paginationProp.activePage - 1,
//           size: paginationProp.itemsPerPage,
//           sort: `${paginationProp.sort},${paginationProp.order}`,
//         },
//         orgaId: 'coca',
//         destinationKey: key,
//         localContextPath: props.localContextPath,
//         target,
//         childPath: props.path,
//       }),
//     );
//   }, [paginationProp, changingFilter]);
// };

const handleRefToResource = (target: ParameterTarget, refToResourceDefinition: RefToResourceDefinition, props) => {
  const dispatch = useAppDispatch();
  const orgaId = useOrgaId();
  const resourceIdRef = refToResourceDefinition.sourceResourceId;
  if (!resourceIdRef) {
    return {
      loading: false,
      error: `sourceResourceId must be defined for refToResource ruleDefinition`,
    };
  }
  const resourceId = useCalculatedValueState(props, resourceIdRef);
  useEffect(() => {
    if (resourceId && resourceId.value) {
      // pkeys.forEach(paramKey => {
      console.log('enrichToMainTarget(target, props.localContextPath)', resourceId, enrichToMainTarget(target, props.localContextPath));
      dispatch(
        getResourceForRenderingStateParameters({
          resourceId: resourceId.value,
          mainTarget: enrichToMainTarget(target, props.localContextPath),
          secondaryTarget: {
            secondaryTargetType: 'anyValueInTarget',
          },
          orgaId,
        }),
      );
      // });
    }
  }, [resourceId]);
};

export const calculateTargetLocalContextPath = (childResource = true, props) => {
  if (!props.localContextPath && !props.path) {
    return getRootPath();
  } else if (props.localContextPath === getRootPath()) {
    if (childResource) {
      return props.localContextPath + props.path;
    } else {
      return props.localContextPath;
    }
  }
  if (childResource) {
    return props.localContextPath + PATH_SEPARATOR + props.path;
  } else {
    return props.localContextPath;
  }
};

export const handleParameterDefinitions = (params, props) => {
  const targetLocalContextPath = calculateTargetLocalContextPath(params.target === 'childResource', props);
  const callingParameterDefinitions = props.parameterDefinitions;
  console.log('targetLocalContextPath', targetLocalContextPath);

  initLocalContext(callingParameterDefinitions, props, targetLocalContextPath);
};
