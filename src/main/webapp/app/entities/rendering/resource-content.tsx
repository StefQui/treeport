import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import { usePageContext } from './layout';
import { doesntExist, existsAndIsOk, usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import {
  applyPath,
  buildPath,
  getRootPath,
  getValueForPathInObject,
  increment,
  MyElem,
  OUTPUT_KEY,
  PARAMETER,
  PARAMETERS_TYPE,
  PARAMETER_SOURCE,
  PARAMETER_SOURCES_TYPE,
  PARAMETER_SOURCE_TYPE,
  PATH_SEPARATOR,
  RENDERING_CONTEXT,
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
  useCalculatedValueState,
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
        // console.log('resourcesToFetch', element);
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
        // console.log('resourceParameter', parameterKey);
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
  const pageContext: RENDERING_CONTEXT = usePageContext();
  const nullableLocalContext: RENDERING_CONTEXT = useResourceParametersFromState(builtPath);

  const [paramIdsToFetch, setParamIdsToFetch] = useState([]);

  useEffect(() => {
    // console.log('useParamsIdsToFetch1...', builtPath, resourceParameters, pageContext, localContext);

    const localContext = nullableLocalContext ?? {};

    if (resourceParameters && pageContext) {
      const theParamIdsToFetch = [];
      // console.log('useParamsIdsToFetch2', resourceParameters);
      resourceParameters.forEach((parameter: PARAMETER) => {
        if (parameter[RESOURCE_PARAMETER_TYPE_KEY] === 'site') {
          const sources: PARAMETER_SOURCES_TYPE = parameter[RESOURCE_PARAMETER_SOURCES_KEY];
          const parameterKey = parameter[RESOURCE_PARAMETER_KEY]; // site1
          for (const source of sources) {
            const paramSource = source[RESOURCE_PARAMETER_SOURCE_KEY]; // pageContext | localContext
            const sourceParamKey = source[RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY]; // sid

            // const resourceNotExistingOrExistsWithOtherId =
            //   !localContext[parameterKey] || localContext[parameterKey].id !== localContext[sourceParamKey];
            console.log('---------------------------------------');

            if (paramSource === 'localContext') {
              const sourceParamaterExistsInLocalContext = existsAndIsOk(localContext[sourceParamKey]);
              const parameterDoesntExistOnLocalContext = doesntExist(localContext[parameterKey]);
              const parameterExistOnLocalContextButWithAWrongId =
                existsAndIsOk(localContext[parameterKey]) &&
                existsAndIsOk(localContext[sourceParamKey]) &&
                localContext[parameterKey].usedId !== localContext[sourceParamKey].value;
              // console.log('localContext--------------');
              if (
                sourceParamaterExistsInLocalContext &&
                (parameterDoesntExistOnLocalContext || parameterExistOnLocalContextButWithAWrongId)
              ) {
                theParamIdsToFetch.push({
                  targetParamId: parameterKey,
                  siteIdTofetch: localContext[sourceParamKey].value,
                });
                break;
              }
            } else if (paramSource === 'pageContext') {
              const sourceParamaterExistsInPageContext = existsAndIsOk(pageContext[sourceParamKey]);
              const parameterDoesntExistOnLocalContext = doesntExist(localContext[parameterKey]);
              const parameterExistOnPageContextButWithAWrongId =
                existsAndIsOk(localContext[parameterKey]) &&
                existsAndIsOk(pageContext[sourceParamKey]) &&
                localContext[parameterKey].usedId !== pageContext[sourceParamKey].value;
              console.log(
                'pageContext--------------',
                localContext[parameterKey],
                pageContext[sourceParamKey],
                sourceParamaterExistsInPageContext,
                parameterDoesntExistOnLocalContext,
                parameterExistOnPageContextButWithAWrongId,
                sourceParamaterExistsInPageContext && (parameterDoesntExistOnLocalContext || parameterExistOnPageContextButWithAWrongId),
              );

              // const resourceNotExistingOrExistsWithOtherId =
              // !localContext[parameterKey] || localContext[parameterKey].id !== pageContext[sourceParamKey];
              if (
                sourceParamaterExistsInPageContext &&
                (parameterDoesntExistOnLocalContext || parameterExistOnPageContextButWithAWrongId)
              ) {
                theParamIdsToFetch.push({
                  targetParamId: parameterKey,
                  siteIdTofetch: pageContext[sourceParamKey].value,
                });
                break;
              }
            }
          }
        }
      });
      // console.log('useParamsIdsToFetch3', theParamIdsToFetch);

      if (theParamIdsToFetch.length > 0) {
        setParamIdsToFetch(theParamIdsToFetch);
      }
    }
  }, [resourceParameters, pageContext, nullableLocalContext]);

  return paramIdsToFetch;
};

export const enrichLocalContext = (resourceParameters: PARAMETERS_TYPE, builtPath) => {
  const dispatch = useAppDispatch();
  const paramIdsToFetch = useParamsIdsToFetch(resourceParameters, builtPath);

  useEffect(() => {
    if (paramIdsToFetch) {
      console.log('enrichLocalContext', paramIdsToFetch, builtPath);
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

const initLocalContext = (sourceResourceParameters, targetResourceParameters, props, builtPath) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sourceResourceParameters && targetResourceParameters) {
      const targetParameterKeys = targetResourceParameters.map((trp: PARAMETER) => trp[RESOURCE_PARAMETER_KEY]);
      const sourceParameterKeys = Object.keys(sourceResourceParameters);
      const toBeIncluded = targetParameterKeys.filter(value => sourceParameterKeys.includes(value));

      toBeIncluded.forEach(parameterKey => {
        const calculatedValue = useCalculatedValueState(props, sourceResourceParameters[parameterKey]);

        console.log('parameterKey', parameterKey, sourceResourceParameters[parameterKey], calculatedValue);
        dispatch(
          setInRenderingStateParameters({
            path: builtPath,
            value: {
              [parameterKey]: {
                loading: false,
                value: calculatedValue,
              },
            },
          }),
        );
      });
    }
  }, [targetResourceParameters]);
};

const useResourceParametersFromState = builtPath =>
  useAppSelector(state => {
    const aaa = state.rendering.renderingState[builtPath];
    return aaa ? aaa[STATE_RS_PARAMETERS_KEY] : null;
  });

export const calculateLocalContextPath = props => {
  if (!props.localContextPath && !props.path) {
    return getRootPath();
  } else if (props.localContextPath === getRootPath()) {
    return props.localContextPath + props.path;
  }
  return props.localContextPath + PATH_SEPARATOR + props.path;
};

export const SmRefToResource = props => {
  const dispatch = useAppDispatch();

  if (!props.params || !props.params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const resourceId = props.params.resourceId;

  const builtPath = buildPath(props);
  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, RESOURCE_CONTENT_KEY);
  const targetResourceParameters = useResourceWithKey(resource, RESOURCE_PARAMETERS_KEY);
  const sourceResourceParameters = props.params[RESOURCE_PARAMETERS_KEY];

  // const resource = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  // console.log('SmRefToResource', resourceParameters);

  // const resourcesToFetch = useResourceToFetch(resourceParameters, pageContext, builtPath);

  initLocalContext(sourceResourceParameters, targetResourceParameters, props, builtPath);
  enrichLocalContext(targetResourceParameters, builtPath);
  // const [resourceContent, setResourceContent] = useState();

  // const [enrichedContext, setEnrichedContext] = useState({});

  // const resource = useAppSelector(state => {
  //   const aaa = state.rendering.renderingState[props.path];
  //   return aaa ? (aaa.resource ? aaa.resource : null) : null;
  // });

  // console.log('arguments', props.params.arguments);
  // if (sourceResourceParameters) {
  //   const parameterKeys = Object.keys(sourceResourceParameters);
  //   Object.entries(props.params[RESOURCE_PARAMETERS_KEY]).forEach(
  //     ([argKey, argValue]: [string, { refToPath: string; property?: string }]) => {
  //       const calculatedValue = useCalculatedValueState(props, textValue);

  //       const referencedValue = useRenderingState(argValue.refToPath);
  //       useEffect(() => {
  //         if (referencedValue) {
  //           // updateRenderingState(dispatch, builtPath, { [argKey]: referencedValue[argValue.property ?? OUTPUT_KEY] });
  //         }
  //       }, [referencedValue]);
  //     },
  //   );
  // }

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
        depth={increment(props.depth)}
        params={props.params ? props.params.params : null}
        currentPath={builtPath}
        localContextPath={calculateLocalContextPath(props)}
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
