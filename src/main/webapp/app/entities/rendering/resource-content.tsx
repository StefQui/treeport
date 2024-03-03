import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction } from 'app/modules/account/activate/activate.reducer';
import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { usePageContext } from './layout';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import {
  applyPath,
  buildPath,
  buildValue,
  ConstantRuleDefinition,
  // CONST_VALUE,
  // DEFINITION,
  emptyValue,
  getRootPath,
  getValueForPathInObject,
  MyElem,
  ParameterDefinition,
  Parameters,
  PATH_SEPARATOR,
  RefToContextRuleDefinition,
  RefToResourceParams,
  RefToSiteDefinition,
  RenderingSliceState,
  RENDERING_CONTEXT,
  ValueInState,
  // RULE_SOURCE_SITE_ID_VALUE,
  // RULE_TYPE,
  useCalculatedValueState,
  SmRefToResourceProps,
  increment,
  ParameterTarget,
  DatasetDefinition,
  useChangingCalculatedValueState,
  initialFilter,
  DatasetFilterRuleDefinition,
  useChangingCalculatedFilterValueState,
  PaginationState,
  ActionState,
  SetCurrentPageAction,
} from './rendering';
import { getSiteForRenderingStateParameters, searchResources, setInCorrectState, setInLocalState } from './rendering.reducer';

export const useRefToLocalContextValue = (currentLocalContextPath, localContextPath, parameterKey, parameterProperty): ValueInState => {
  return useAppSelector((state: RenderingSliceState) => {
    const contextForLocalContextPath = state.rendering.localContextsState
      ? state.rendering.localContextsState[applyPath(currentLocalContextPath, localContextPath)]
      : null;
    // console.log('useRefToLocalContextValue', parameterKey, contextForLocalContextPath);
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

export const useRefToPageContextValue = (props, ruleDefinition: RefToContextRuleDefinition): ValueInState => {
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
    }
  }, [action]);

  return val;
};

export const useConstantDatasetFilter = (props, definition: DatasetFilterRuleDefinition): ValueInState => {
  console.log('useConstantDatasetFilter', definition.valueFilter);
  const [val, setVal] = useState(initialFilter);
  useEffect(() => {
    console.log('First useConstantDatasetFilter');
    setVal({ loading: false, value: definition.valueFilter });
  }, []);
  return val;
};

export const initLocalContext = (parameterDefinitions: ParameterDefinition[], props, targetLocalContextPath) => {
  // const localContextPath = calculateLocalContextPath(props);

  if (parameterDefinitions) {
    parameterDefinitions.forEach(pdef => {
      const key = pdef.parameterKey;

      console.log('initLocalContext for ' + pdef.definition.ruleType);
      handleParameterDefinition(pdef, props);
    });
  }
};

export const handleParameterDefinition = (pdef: ParameterDefinition, props) => {
  const dispatch = useAppDispatch();
  const target = pdef.target;
  if (pdef.definition.ruleType === 'refToSite') {
    handleRefToSite(pdef.parameterKey, target, pdef.definition as RefToSiteDefinition, props);
    // } else if (pdef.definition.ruleType === 'datasetFilter') {
    //   handleDatasetFilter(key, target, pdef.definition as DatasetFilterDefinition, props);
  } else if (pdef.definition.ruleType === 'dataset') {
    const dsDef = pdef.definition as DatasetDefinition;
    console.log('filter.......1', dsDef.filter);
    handleDataSet(pdef.parameterKey, target, dsDef, props);
  } else if (pdef.definition.ruleType === 'datasetFilter') {
    const dsfDef = pdef.definition as DatasetFilterRuleDefinition;
    dsfDef.valueFilter;
    const changingFilter = useChangingCalculatedFilterValueState(props, dsfDef, target);
    // const changing = useChangingCalculatedValueState(props, pdef, target);
    useEffect(() => {
      console.log('filter.......changed2');
      dispatch(
        setInCorrectState({
          destinationKey: pdef.parameterKey,
          localContextPath: props.localContextPath,
          target,
          childPath: props.path,
          value: changingFilter,
        }),
      );
      // });
    }, [changingFilter]);
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

      dispatch(
        setInCorrectState({
          destinationKey: pdef.parameterKey,
          localContextPath: props.localContextPath,
          target,
          childPath: props.path,
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

const handleDataSet = (key: string, target: ParameterTarget, refToSiteDefinition: DatasetDefinition, props) => {
  const dispatch = useAppDispatch();
  const filter = useCalculatedValueState(props, refToSiteDefinition.filter);
  console.log(
    'handleDataSet.......handleDataSet',
    props.localContextPath,
    applyPath(props.localContextPath, ''),
    refToSiteDefinition.filter,
  );

  const paginationState = useCalculatedValueState(props, refToSiteDefinition.paginationState);
  // const ps = {
  //   activePage: 1,
  //   itemsPerPage: 10,
  //   sort: 'id',
  //   order: 'asc',
  // };
  const [previousFilter, setPreviousFilter] = useState({ loading: true });

  useEffect(() => {
    console.log('filter.......handleDataSet', filter, paginationState);
    if (!filter || !filter.value || filter.value.loading || !paginationState || !paginationState.value) {
      return;
    }
    const ps = paginationState.value;

    dispatch(
      searchResources({
        searchModel: {
          resourceType: 'SITE',
          columnDefinitions: refToSiteDefinition.columnDefinitions,
          filter: filter ? filter.value : null,
          page: ps.activePage - 1,
          size: ps.itemsPerPage,
          sort: `${ps.sort},${ps.order}`,
        },
        orgaId: 'coca',
        destinationKey: key,
        localContextPath: props.localContextPath,
        target,
        childPath: props.path,
      }),
    );
  }, [filter, paginationState]);
};

const handleRefToSite = (key: string, target: ParameterTarget, refToSiteDefinition: RefToSiteDefinition, props) => {
  const dispatch = useAppDispatch();
  const siteIdRef = refToSiteDefinition.sourceSiteId;
  if (!siteIdRef) {
    return {
      loading: false,
      error: `sourceSiteId must be defined for refToSite ruleDefinition`,
    };
  }
  const siteId = useCalculatedValueState(props, siteIdRef);
  useEffect(() => {
    if (siteId && siteId.value) {
      // pkeys.forEach(paramKey => {
      dispatch(
        getSiteForRenderingStateParameters({
          siteId: siteId.value,
          destinationKey: key,
          localContextPath: props.localContextPath,
          target,
          childPath: props.path,
        }),
      );
      // });
    }
  }, [siteId]);
};

// export const calculateLocalContextPath = props => {
//   if (!props.localContextPath && !props.path) {
//     return getRootPath();
//   } else if (props.localContextPath === getRootPath()) {
//     return props.localContextPath + props.path;
//   }
//   return props.localContextPath + PATH_SEPARATOR + props.path;
// };

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

export const SmRefToResource = (props: SmRefToResourceProps) => {
  console.log('TheSmRefToResource', props);

  const params: RefToResourceParams = props.params;

  if (!params || !params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const { resourceId } = params;

  const builtPath = buildPath(props);
  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, 'content');
  // const targetParameterDefinitions = useResourceWithKey(resource, LOCAL_CONTEXT);
  // const callingParameterDefinitions = params.parameterDefinitions;

  // initLocalContext(callingParameterDefinitions, props, builtPath);
  handleParameterDefinitions(params, props);

  if (resourceContent) {
    // console.log('resourceContent', resourceContent);
    return (
      <MyElem
        input={resourceContent}
        depth={increment(props.depth)}
        // params={props.params ? params.params : null}
        currentPath={builtPath}
        localContextPath={calculateTargetLocalContextPath(true, props)}
      ></MyElem>
    );
  }
  return (
    <div>
      <span>no val for SmRefToResource</span>
    </div>
  );
};

export const MyRend = props => {
  const [input, setInput] = useState({ type: 'notype', text: 'kkk', layoutElements: {} });
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      setError('');
      setInput(props.content ? JSON.parse(props.content) : {});
    } catch (ex) {
      setError('pb while parsing json');
    }
  }, [props.content]);

  if (error) {
    return <Row md="8">{error}</Row>;
  }

  // console.log('......', props.currentPath, props.params);
  return (
    <Row md="8">
      {props.content ? (
        <MyElem
          input={input}
          depth={increment(props.depth)}
          params={props.params ? props.params.params : null}
          currentPath={props.currentPath}
          localContextPath={props.localContextPath}
        ></MyElem>
      ) : (
        <p>Loading...</p>
      )}
    </Row>
  );
};
