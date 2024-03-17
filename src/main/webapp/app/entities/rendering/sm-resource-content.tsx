import { useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { usePageContext } from './sm-layout';
import { handleParameterDefinitions } from './parameter-definition';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import { MyElem, increment } from './rendering';
import { applyPath, buildValue, getValueForPathInObject, getRootPath, PATH_SEPARATOR, buildPath } from './shared';
import {
  ValueInState,
  RenderingSliceState,
  emptyValue,
  Parameters,
  RefToContextRuleDefinition,
  RENDERING_CONTEXT,
  PaginationState,
  ActionState,
  SetCurrentPageAction,
  SmRefToResourceProps,
  RefToResourceParams,
} from './type';

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
      // } else if (action && action.actionType === 'refreshDataset') {
      //   console.log('action2', action);
      //   setVal({ loading: false, value: initialValue });
    }
  }, [action]);

  return val;
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

  handleParameterDefinitions(params, props);

  if (resourceContent) {
    console.log('resourceContent', props.itemParam);
    return (
      <MyElem
        input={resourceContent}
        depth={increment(props.depth)}
        params={props.params ? params : null}
        itemParam={props.itemParam}
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
