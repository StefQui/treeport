import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { usePageContext } from './layout';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import {
  applyPath,
  buildPath,
  buildValue,
  ConstantRuleDefinition,
  CONST_VALUE,
  DEFINITION,
  emptyValue,
  getRootPath,
  getValueForPathInObject,
  MyElem,
  ParameterDefinition,
  Parameters,
  PARAMETER_KEY,
  PATH_SEPARATOR,
  RefToContextRuleDefinition,
  RefToResourceParams,
  RefToSiteDefinition,
  RenderingSliceState,
  RENDERING_CONTEXT,
  RESOURCE_CONTENT_KEY,
  ValueInState,
  RULE_SOURCE_SITE_ID_VALUE,
  RULE_TYPE,
  useCalculatedValueState,
  SmRefToResourceProps,
  increment,
} from './rendering';
import { getSiteForRenderingStateParameters, setInLocalState } from './rendering.reducer';

export const useRefToLocalContextValue = (currentLocalContextPath, localContextPath, parameterKey, parameterProperty): ValueInState => {
  return useAppSelector((state: RenderingSliceState) => {
    const contextForLocalContextPath = state.rendering.localContextsState
      ? state.rendering.localContextsState[applyPath(currentLocalContextPath, localContextPath)]
      : null;
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
    if (!parameterProperty) {
      return valForKey;
    }
    if (!valForKey.value) {
      return emptyValue;
    }
    return buildValue(getValueForPathInObject(valForKey.value, parameterProperty));
  });
};

export const useRefToLocalContext = (currentLocalContextPath, localContextPath): Parameters => {
  return useAppSelector((state: RenderingSliceState) => {
    // console.log('useRefToLocalContext--------------------', localContextPath, state[RENDERING_SLICE_KEY][STATE_RENDERING_STATE_KEY]);
    const contextForLocalContextPath = state.rendering.localContextsState
      ? state.rendering.localContextsState[applyPath(currentLocalContextPath, localContextPath)]
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

export const useConstantValue = (props, definition: ConstantRuleDefinition): ValueInState => {
  return { loading: false, value: definition[CONST_VALUE] };
};

const initLocalContext = (parameterDefinitions: ParameterDefinition[], props, builtPath) => {
  const dispatch = useAppDispatch();

  const localContextPath = calculateLocalContextPath(props);

  if (parameterDefinitions) {
    parameterDefinitions.forEach(pdef => {
      const key = pdef[PARAMETER_KEY];

      const result = useCalculatedValueState(props, pdef[DEFINITION]);

      if (pdef[DEFINITION][RULE_TYPE] === 'refToSite') {
        const refToSiteDefinition: RefToSiteDefinition = pdef[DEFINITION] as RefToSiteDefinition;
        const siteIdRef = refToSiteDefinition[RULE_SOURCE_SITE_ID_VALUE];
        if (!siteIdRef) {
          return {
            loading: false,
            error: `${RULE_SOURCE_SITE_ID_VALUE} must be defined for refToSite ruleDefinition`,
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
              }),
            );
            // });
          }
        }, [siteId]);

        // return useRefToLocalContextValue(props, refToContextRuleDefinition.path, refToContextRuleDefinition.sourceParameterKey);
      } else {
        useEffect(() => {
          if (result) {
            // pkeys.forEach(paramKey => {
            dispatch(
              setInLocalState({
                localContextPath,
                parameterKey: pdef[PARAMETER_KEY],
                value: result,
              }),
            );
            // });
          }
        }, [result]);
      }
    });
  }
};

export const calculateLocalContextPath = props => {
  if (!props.localContextPath && !props.path) {
    return getRootPath();
  } else if (props.localContextPath === getRootPath()) {
    return props.localContextPath + props.path;
  }
  return props.localContextPath + PATH_SEPARATOR + props.path;
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
  const resourceContent = useResourceWithKey(resource, RESOURCE_CONTENT_KEY);
  // const targetParameterDefinitions = useResourceWithKey(resource, LOCAL_CONTEXT);
  const callingParameterDefinitions = params.parameterDefinitions;

  initLocalContext(callingParameterDefinitions, props, builtPath);

  if (resourceContent) {
    // console.log('resourceContent', resourceContent);
    return (
      <MyElem
        input={resourceContent}
        depth={increment(props.depth)}
        // params={props.params ? params.params : null}
        currentPath={builtPath}
        localContextPath={calculateLocalContextPath(props)}
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
