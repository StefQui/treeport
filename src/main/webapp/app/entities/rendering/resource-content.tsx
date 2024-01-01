import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import { usePageContext } from './layout';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import {
  applyPath,
  buildPath,
  getValueForPathInObject,
  MyElem,
  OUTPUT_KEY,
  PARAMETER,
  PARAMETERS_TYPE,
  PARAMETER_SOURCE,
  PARAMETER_SOURCES_TYPE,
  PARAMETER_SOURCE_TYPE,
  PATH_SEPARATOR,
  RESOURCE_CONTENT_KEY,
  RESOURCE_FROM_REF_KEY,
  RESOURCE_PARAMETERS_KEY,
  RESOURCE_PARAMETER_KEY,
  RESOURCE_PARAMETER_SOURCES_KEY,
  RESOURCE_PARAMETER_SOURCE_KEY,
  RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY,
  RESOURCE_PARAMETER_TYPE_KEY,
  ROOT_PATH_SEPARATOR,
  STATE_RS_PARAMETERS_KEY,
  useRenderingState,
} from './rendering';
import { getResourceForPageResources, getSiteForRenderingStateParamaters, setInRenderingStateParameters } from './rendering.reducer';

export const ZZZResourceContent = props => {
  const dispatch = useAppDispatch();
  const siteEntity = useAppSelector(state => state.site.entity);
  // const rendering = useAppSelector(state => state.rendering);
  const [value] = useState('mmmmmm');
  const initialState = {
    resource: null,
  };
  const [resourceContent, setResourceContent] = useState();

  const resource = useAppSelector(state => {
    const aaa = state.rendering.renderingState[props.path];
    return aaa ? (aaa.resource ? aaa.resource : null) : null;
  });

  useEffect(() => {
    if (props.refTo) {
      dispatch(
        getResourceForPageResources({
          resourceId: props.refTo,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (resource) {
      setResourceContent(resource.content);
    } else {
      setResourceContent(null);
    }
  }, [resource]);

  if (resourceContent) {
    return <MyRend content={resourceContent} params={props.params}></MyRend>;
  }
  return (
    <div>
      <span>no val</span>
    </div>
  );
};

export const updateLocalContext = (resourceParameters, pageContext, localContext, builtPath) => {
  const dispatch = useAppDispatch();
  const resourcesToFetch = useResourceToFetch(resourceParameters, pageContext, builtPath);

  useEffect(() => {
    if (resourcesToFetch) {
      resourcesToFetch.forEach(element => {
        console.log('resourcesToFetch', element);
        dispatch(
          getSiteForRenderingStateParamaters({
            siteId: element.siteId,
            destinationSiteKey: element.parameterKey,
            ...{ path: builtPath },
          }),
        );

        // const aaa = useRenderingResourceContentFromResourceId(element.siteId, builtPath);
      });
    }
  }, [resourcesToFetch]);
};

export const useResourceToFetch = (resourceParameters, pageContext, builtPath) => {
  const dispatch = useAppDispatch();
  const [resourcesToFetch, setResourcesToFetch] = useState([]);

  useEffect(() => {
    if (resourceParameters && pageContext) {
      const resourcesToFetchArray = [];
      (resourceParameters as Array<any>).forEach(({ parameterKey, parameterSource, parameterType, useAs }) => {
        console.log('resourceParameter', parameterKey);
        parameterSource.forEach((source: PARAMETER_SOURCE_TYPE) => {
          if (source === 'pageContext') {
            const existing = pageContext[parameterKey];
            if (existing) {
              dispatch(setInRenderingStateParameters({ path: builtPath, value: existing }));
              if (useAs && 'siteId' === parameterType) {
                resourcesToFetchArray.push({
                  type: 'site',
                  parameterKey: useAs,
                  siteId: existing,
                });
              }
            }
          }
        });
      });
      if (resourcesToFetchArray) {
        setResourcesToFetch(resourcesToFetchArray);
      }
    }
  }, [resourceParameters, pageContext]);

  return resourcesToFetch;
};

export const useParamsIdsToFetch = (resourceParameters: PARAMETERS_TYPE, builtPath) => {
  const pageContext = usePageContext();
  const localContext = useResourceParametersFromState(builtPath);

  const [paramIdsToFetch, setParamIdsToFetch] = useState([]);

  useEffect(() => {
    console.log('useParamsIdsToFetch1...', builtPath, resourceParameters, pageContext, localContext);
    if (resourceParameters && pageContext && localContext) {
      const theParamIdsToFetch = [];
      console.log('useParamsIdsToFetch2', resourceParameters);
      resourceParameters.forEach((parameter: PARAMETER) => {
        if (parameter[RESOURCE_PARAMETER_TYPE_KEY] === 'site') {
          const sources: PARAMETER_SOURCES_TYPE = parameter[RESOURCE_PARAMETER_SOURCES_KEY];
          const parameterKey = parameter[RESOURCE_PARAMETER_KEY];
          for (const source of sources) {
            const paramSource = source[RESOURCE_PARAMETER_SOURCE_KEY];
            const sourceParamKey = source[RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY];

            // const resourceNotExistingOrExistsWithOtherId =
            //   !localContext[parameterKey] || localContext[parameterKey].id !== localContext[sourceParamKey];

            if (paramSource === 'localContext') {
              const paramaterExistsInLocalContext = localContext[sourceParamKey];
              const parameterDoesntExistOnLocalContext = !localContext[parameterKey];
              const parameterExistOnLocalContextButWithAWrongId =
                localContext[parameterKey] && localContext[parameterKey].id !== localContext[sourceParamKey];

              if (paramaterExistsInLocalContext && (parameterDoesntExistOnLocalContext || parameterExistOnLocalContextButWithAWrongId)) {
                theParamIdsToFetch.push({
                  targetParamId: parameterKey,
                  siteIdTofetch: localContext[sourceParamKey],
                });
                break;
              }
            } else if (paramSource === 'pageContext') {
              const paramaterExistsInPageContext = pageContext[sourceParamKey];
              const parameterDoesntExistOnLocalContext = !localContext[parameterKey];
              const parameterExistOnPageContextButWithAWrongId =
                localContext[parameterKey] && localContext[parameterKey].id !== pageContext[sourceParamKey];

              // const resourceNotExistingOrExistsWithOtherId =
              // !localContext[parameterKey] || localContext[parameterKey].id !== pageContext[sourceParamKey];
              if (paramaterExistsInPageContext && (parameterDoesntExistOnLocalContext || parameterExistOnPageContextButWithAWrongId)) {
                theParamIdsToFetch.push({
                  targetParamId: parameterKey,
                  siteIdTofetch: pageContext[sourceParamKey],
                });
                break;
              }
            }
          }
        }
      });
      console.log('useParamsIdsToFetch3', theParamIdsToFetch);

      if (theParamIdsToFetch.length > 0) {
        setParamIdsToFetch(theParamIdsToFetch);
      }
    }
  }, [resourceParameters, pageContext, localContext]);

  return paramIdsToFetch;
};

export const enrichLocalContext = (resourceParameters: PARAMETERS_TYPE, builtPath) => {
  const dispatch = useAppDispatch();
  const paramIdsToFetch = useParamsIdsToFetch(resourceParameters, builtPath);

  useEffect(() => {
    if (paramIdsToFetch) {
      console.log('enrichLocalContext', paramIdsToFetch);
      paramIdsToFetch.forEach(paramIdToFetch => {
        console.log('enrichLocalContext a specific', paramIdsToFetch);
        dispatch(
          getSiteForRenderingStateParamaters({
            siteId: paramIdToFetch.siteIdTofetch,
            destinationSiteKey: paramIdToFetch.targetParamId,
            path: builtPath,
          }),
        );
      });
    }
  }, [paramIdsToFetch]);
};

const useResourceParametersFromState = builtPath =>
  useAppSelector(state => {
    const aaa = state.rendering.renderingState[builtPath];
    return aaa ? getValueForPathInObject(aaa, STATE_RS_PARAMETERS_KEY) : {};
  });

export const SmRefToResource = props => {
  const dispatch = useAppDispatch();

  if (!props.params || !props.params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const resourceId = props.params.resourceId;

  const builtPath = buildPath(props);
  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, RESOURCE_CONTENT_KEY);
  const resourceParameters = useResourceWithKey(resource, RESOURCE_PARAMETERS_KEY);

  // const resource = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  console.log('SmRefToResource', resourceParameters);

  // const resourcesToFetch = useResourceToFetch(resourceParameters, pageContext, builtPath);

  enrichLocalContext(resourceParameters, builtPath);
  // const [resourceContent, setResourceContent] = useState();

  // const [enrichedContext, setEnrichedContext] = useState({});

  // const resource = useAppSelector(state => {
  //   const aaa = state.rendering.renderingState[props.path];
  //   return aaa ? (aaa.resource ? aaa.resource : null) : null;
  // });

  // console.log('arguments', props.params.arguments);
  if (props.params.arguments) {
    Object.entries(props.params.arguments).forEach(([argKey, argValue]: [string, { refToPath: string; property?: string }]) => {
      const referencedValue = useRenderingState(argValue.refToPath);
      useEffect(() => {
        if (referencedValue) {
          // updateRenderingState(dispatch, builtPath, { [argKey]: referencedValue[argValue.property ?? OUTPUT_KEY] });
        }
      }, [referencedValue]);
    });
  }

  // const [toto, setToto] = useState('mm');

  // useEffect(() => {
  //   console.log('changedeeafter2', enrichedContext);
  //   setToto('mmm');
  //   // setEnrichedContext({ ...enrichedContext });
  // }, [enrichedContext]);

  // useEffect(() => {
  //   dispatch(
  //     getResource({
  //       resourceId,
  //       path: builtPath,
  //     }),
  //   );
  // }, [resourceId]);

  // useEffect(() => {
  //   if (resource) {
  //     setResourceContent(resource.content);
  //   } else {
  //     setResourceContent(null);
  //   }
  // }, [resource]);

  // console.log('SmRefToResource', props.currentPath, props.path);

  if (resourceContent) {
    // console.log('resourceContent', resourceContent);
    return (
      <MyElem
        input={resourceContent}
        params={props.params ? props.params.params : null}
        currentPath={builtPath}
        localContextPath={props.localContextPath}
      ></MyElem>
    );

    // return <MyRend content={resourceContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
  }
  return (
    <div>
      <span>no val</span>
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
