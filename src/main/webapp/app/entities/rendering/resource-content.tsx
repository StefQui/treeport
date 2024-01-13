import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import { usePageContext } from './layout';
import { doesntExist, usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
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
  increment,
  LOCAL_CONTEXT,
  MyElem,
  OUTPUT_KEY,
  PARAMETER,
  ParameterDefinition,
  ParameterDefinitions,
  Parameters,
  PARAMETERS_TYPE,
  PARAMETER_DEFINITIONS,
  PARAMETER_KEY,
  PARAMETER_SOURCE,
  PARAMETER_SOURCES_TYPE,
  PARAMETER_SOURCE_TYPE,
  PATH_SEPARATOR,
  RefToContextRuleDefinition,
  RefToResourceParams,
  RefToSiteDefinition,
  Rendering,
  RENDERING_CONTEXT,
  RENDERING_SLICE_KEY,
  RESOURCE_CONTENT_KEY,
  RESOURCE_FROM_REF_KEY,
  RESOURCE_PARAMETERS_KEY,
  RESOURCE_PARAMETER_KEY,
  RESOURCE_PARAMETER_SOURCES_KEY,
  RESOURCE_PARAMETER_SOURCE_KEY,
  RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY,
  RESOURCE_PARAMETER_TYPE_KEY,
  RESOURCE_STATE,
  ROOT_PATH_SEPARATOR,
  RuleDefinition,
  RULE_SOURCE_SITE_ID_VALUE,
  RULE_TYPE,
  STATE_RENDERING_STATE_KEY,
  STATE_RS_PARAMETERS_KEY,
  useCalculatedValueState,
  // useRenderingState,
} from './rendering';
import { getResourceForPageResources, getSiteForRenderingStateParameters, setInRenderingStateParameters } from './rendering.reducer';

// export const ZZZResourceContent = props => {
//   const dispatch = useAppDispatch();
//   const siteEntity = useAppSelector((state => state.site.entity);
//   // const rendering = useAppSelector(state => state.rendering);
//   const [value] = useState('mmmmmm');
//   const initialState = {
//     resource: null,
//   };
//   const [resourceContent, setResourceContent] = useState();

//   const resource = useAppSelector(state => {
//     const aaa = state.rendering.renderingState[props.path];
//     return aaa ? (aaa.resource ? aaa.resource : null) : null;
//   });

//   useEffect(() => {
//     if (props.refTo) {
//       dispatch(
//         getResourceForPageResources({
//           resourceId: props.refTo,
//         }),
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (resource) {
//       setResourceContent(resource.content);
//     } else {
//       setResourceContent(null);
//     }
//   }, [resource]);

//   if (resourceContent) {
//     return <MyRend content={resourceContent} params={props.params}></MyRend>;
//   }
//   return (
//     <div>
//       <span>no val</span>
//     </div>
//   );
// };

export const updateLocalContext = (resourceParameters, pageContext, localContext, builtPath) => {
  const dispatch = useAppDispatch();
  const resourcesToFetch = useResourceToFetch(resourceParameters, pageContext, builtPath);

  // useEffect(() => {
  //   if (resourcesToFetch) {
  //     resourcesToFetch.forEach(element => {
  //       // console.log('resourcesToFetch', element);
  //       dispatch(
  //         getSiteForRenderingStateParameters({
  //           siteId: element.siteId,
  //           destinationSiteKey: element.parameterKey,
  //           ...{ path: builtPath },
  //         }),
  //       );

  //       // const aaa = useRenderingResourceContentFromResourceId(element.siteId, builtPath);
  //     });
  //   }
  // }, [resourcesToFetch]);
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

// export const useParamsIdsToFetch = (resourceParameters: PARAMETERS_TYPE, builtPath) => {
//   const pageContext: RENDERING_CONTEXT = usePageContext();
//   const nullableLocalContext: RENDERING_CONTEXT = useResourceParametersFromState(builtPath);

//   const [paramIdsToFetch, setParamIdsToFetch] = useState([]);

//   useEffect(() => {
//     // console.log('useParamsIdsToFetch1...', builtPath, resourceParameters, pageContext, localContext);

//     const localContext = nullableLocalContext ?? {};

//     if (resourceParameters && pageContext) {
//       const theParamIdsToFetch = [];
//       // console.log('useParamsIdsToFetch2', resourceParameters);
//       resourceParameters.forEach((parameter: PARAMETER) => {
//         if (parameter[RESOURCE_PARAMETER_TYPE_KEY] === 'site') {
//           const sources: PARAMETER_SOURCES_TYPE = parameter[RESOURCE_PARAMETER_SOURCES_KEY];
//           const parameterKey = parameter[RESOURCE_PARAMETER_KEY]; // site1
//           for (const source of sources) {
//             const paramSource = source[RESOURCE_PARAMETER_SOURCE_KEY]; // pageContext | localContext
//             const sourceParamKey = source[RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY]; // sid

//             // const resourceNotExistingOrExistsWithOtherId =
//             //   !localContext[parameterKey] || localContext[parameterKey].id !== localContext[sourceParamKey];
//             console.log('---------------------------------------');

//             if (paramSource === 'localContext') {
//               const sourceParameterExistsInLocalContext = existsAndIsOk(localContext[sourceParamKey]);
//               const parameterDoesntExistOnLocalContext = doesntExist(localContext[parameterKey]);
//               const parameterExistOnLocalContextButWithAWrongId =
//                 existsAndIsOk(localContext[parameterKey]) &&
//                 existsAndIsOk(localContext[sourceParamKey]) &&
//                 localContext[parameterKey].usedId !== localContext[sourceParamKey].value;
//               // console.log('localContext--------------');
//               if (
//                 sourceParameterExistsInLocalContext &&
//                 (parameterDoesntExistOnLocalContext || parameterExistOnLocalContextButWithAWrongId)
//               ) {
//                 theParamIdsToFetch.push({
//                   targetParamId: parameterKey,
//                   siteIdTofetch: localContext[sourceParamKey].value,
//                 });
//                 break;
//               }
//             } else if (paramSource === 'pageContext') {
//               const sourceParameterExistsInPageContext = existsAndIsOk(pageContext[sourceParamKey]);
//               const parameterDoesntExistOnLocalContext = doesntExist(localContext[parameterKey]);
//               const parameterExistOnPageContextButWithAWrongId =
//                 existsAndIsOk(localContext[parameterKey]) &&
//                 existsAndIsOk(pageContext[sourceParamKey]) &&
//                 localContext[parameterKey].usedId !== pageContext[sourceParamKey].value;
//               console.log(
//                 'pageContext--------------',
//                 localContext[parameterKey],
//                 pageContext[sourceParamKey],
//                 sourceParameterExistsInPageContext,
//                 parameterDoesntExistOnLocalContext,
//                 parameterExistOnPageContextButWithAWrongId,
//                 sourceParameterExistsInPageContext && (parameterDoesntExistOnLocalContext || parameterExistOnPageContextButWithAWrongId),
//               );

//               // const resourceNotExistingOrExistsWithOtherId =
//               // !localContext[parameterKey] || localContext[parameterKey].id !== pageContext[sourceParamKey];
//               if (
//                 sourceParameterExistsInPageContext &&
//                 (parameterDoesntExistOnLocalContext || parameterExistOnPageContextButWithAWrongId)
//               ) {
//                 theParamIdsToFetch.push({
//                   targetParamId: parameterKey,
//                   siteIdTofetch: pageContext[sourceParamKey].value,
//                 });
//                 break;
//               }
//             }
//           }
//         }
//       });
//       // console.log('useParamsIdsToFetch3', theParamIdsToFetch);

//       if (theParamIdsToFetch.length > 0) {
//         setParamIdsToFetch(theParamIdsToFetch);
//       }
//     }
//   }, [resourceParameters, pageContext, nullableLocalContext]);

//   return paramIdsToFetch;
// };

export const enrichLocalContext = builtPath => {
  const dispatch = useAppDispatch();
  // const paramIdsToFetch = useParamsIdsToFetch(resourceParameters, builtPath);

  // useEffect(() => {
  //   if (paramIdsToFetch) {
  //     console.log('enrichLocalContext', paramIdsToFetch, builtPath);
  //     paramIdsToFetch.forEach(paramIdToFetch => {
  //       console.log('enrichLocalContext a specific', paramIdsToFetch);
  //       dispatch(
  //         getSiteForRenderingStateParameters({
  //           siteId: paramIdToFetch.siteIdTofetch,
  //           destinationSiteKey: paramIdToFetch.targetParamId,
  //           path: builtPath,
  //         }),
  //       );
  //     });
  //   }
  // }, [paramIdsToFetch]);
};

const useLocalContextDefinitions = (
  callingParameterDefinitions: ParameterDefinition[],
  targetParameterDefinitions: ParameterDefinition[],
) => {
  const [localContextDefinitions, setLocalContextDefinitions] = useState([]);

  useEffect(() => {
    console.log('useLocalContextDefinitions', targetParameterDefinitions, callingParameterDefinitions);

    if (targetParameterDefinitions && callingParameterDefinitions) {
      const callingKeys = callingParameterDefinitions.map((trp: ParameterDefinition) => trp[PARAMETER_KEY]);
      const res: ParameterDefinition[] = callingParameterDefinitions;
      res.concat(targetParameterDefinitions.filter(pdef => callingKeys.indexOf(pdef[PARAMETER_KEY]) === -1));
      if (res && res.length > 0) {
        setLocalContextDefinitions(res);
      }
    }
  }, [targetParameterDefinitions]);

  return localContextDefinitions;
};

export const useRefToLocalContextValue = (currentLocalContextPath, localContextPath, parameterKey, parameterProperty): RESOURCE_STATE => {
  return useAppSelector((state: Rendering) => {
    const contextForLocalContextPath = state.rendering.renderingState
      ? state.rendering.renderingState[applyPath(currentLocalContextPath, localContextPath)]
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
  return useAppSelector((state: Rendering) => {
    // console.log('useRefToLocalContext--------------------', localContextPath, state[RENDERING_SLICE_KEY][STATE_RENDERING_STATE_KEY]);
    const contextForLocalContextPath = state.rendering.renderingState
      ? state.rendering.renderingState[applyPath(currentLocalContextPath, localContextPath)]
      : null;
    if (!contextForLocalContextPath) {
      return null;
    }
    return contextForLocalContextPath.parameters;
  });
};

export const useRefToPageContextValue = (props, ruleDefinition: RefToContextRuleDefinition): RESOURCE_STATE => {
  const [contextValue, setContextValue] = useState({ loading: false });

  // console.log('useRefToPageContextValu--------', definition);

  const pageContext: RENDERING_CONTEXT = usePageContext();
  useEffect(() => {
    setContextValue(pageContext[ruleDefinition.sourceParameterKey]);
  }, [pageContext]);

  return contextValue;
  // return { loading: false, value: 'tatassss' };
};

export const useConstantValue = (props, definition: ConstantRuleDefinition): RESOURCE_STATE => {
  return { loading: false, value: definition[CONST_VALUE] };
};

// const useParameterMapValues = (
//   callingParameterDefinitions: ParameterDefinition[],
//   targetParameterDefinitions: ParameterDefinition[],
//   props,
// ) => {
//   const localContextDefinitions: ParameterDefinition[] = useLocalContextDefinitions(
//     callingParameterDefinitions,
//     targetParameterDefinitions,
//   );
//   console.log('aaaauseParameterMapValues', localContextDefinitions);

//   // const [ParameterMapValues, setParameterMapValues] = useState({});

//   if (localContextDefinitions) {
//     localContextDefinitions.forEach(pdef => {
//       const key = pdef[PARAMETER_KEY];
//       if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'refToLocalContext') {
//         const refToContextRuleDefinition: RefToContextRuleDefinition = pdef[DEFINITION] as RefToContextRuleDefinition;
//         const aa = useRefToLocalContextValue(props, refToContextRuleDefinition.path, refToContextRuleDefinition.sourceParameterKey);
//       } else if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'refToPageContext') {
//         const aa = useRefToPageContextValue(props, pdef);
//       } else if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'constant') {
//         const aa = useConstantValue(props, pdef);
//       } else {
//         const aa = {
//           loading: false,
//           error: 'Not implemented yet2',
//         };
//       }
//     });
//   }
//   // useEffect(() => {
//   //   if (localContextDefinitions) {
//   //     const result: { [ParameterKey: string]: RESOURCE_STATE } = {};
//   //     localContextDefinitions.forEach(pdef => {
//   //       const key = pdef[PARAMETER_KEY];
//   //       if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'refToLocalContext') {
//   //         result[key] = useRefToLocalContextValue(props, pdef);
//   //       } else if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'refToPageContext') {
//   //         result[key] = useRefToPageContextValue(props, pdef);
//   //       } else if (pdef[DEFINITION] && pdef[DEFINITION][RULE_TYPE] === 'constant') {
//   //         result[key] = useConstantValue(props, pdef);
//   //       } else {
//   //         result[key] = {
//   //           loading: false,
//   //           error: 'Not implemented yet2',
//   //         };
//   //       }
//   //     });
//   //     // setParameterMapValues(result);
//   //   }
//   // }, [localContextDefinitions]);
//   // }
//   // return ParameterMapValues;
// };

const initLocalContext = (parameterDefinitions: ParameterDefinition[], props, builtPath) => {
  const dispatch = useAppDispatch();
  // console.log('initLocalContext', callingParameterDefinitions, targetParameterDefinitions);
  // const ParameterMapValues: { [ParameterKey: string]: RESOURCE_STATE } = useParameterMapValues(
  //   callingParameterDefinitions,
  //   targetParameterDefinitions,
  //   props,
  // );
  const localContextPath = calculateLocalContextPath(props);

  if (parameterDefinitions) {
    parameterDefinitions.forEach(pdef => {
      const key = pdef[PARAMETER_KEY];
      // useEffect(() => {
      //   if (ParameterMapValues[paramKey]) {
      //     // pkeys.forEach(paramKey => {
      //     dispatch(
      //       setInRenderingStateParameters({
      //         path: localContextPath,
      //         value: {
      //           [paramKey]: ParameterMapValues[paramKey],
      //         },
      //       }),
      //     );
      //     // });
      //   }
      // }, [Object.values(ParameterMapValues)]);

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
              setInRenderingStateParameters({
                path: localContextPath,
                value: {
                  [pdef[PARAMETER_KEY]]: result,
                },
              }),
            );
            // });
          }
        }, [result]);
      }
    });
  }

  // useParameterMapValues(callingParameterDefinitions, targetParameterDefinitions, props);
  // const dispatch = useAppDispatch();
  // const localContextPath = calculateLocalContextPath(props);

  // const pkeys = Object.keys(parameterDefinitions);
  // console.log('ParameterMapValues22222', ParameterMapValues);

  // pkeys.forEach(paramKey => {
  //   console.log('inloop', paramKey);
  //   useEffect(() => {
  //     if (ParameterMapValues[paramKey]) {
  //       // pkeys.forEach(paramKey => {
  //       dispatch(
  //         setInRenderingStateParameters({
  //           path: localContextPath,
  //           value: {
  //             [paramKey]: ParameterMapValues[paramKey],
  //           },
  //         }),
  //       );
  //       // });
  //     }
  //   }, [Object.values(ParameterMapValues)]);
  //   dispatch(
  //     setInRenderingStateParameters({
  //       path: localContextPath,
  //       value: {
  //         [paramKey]: ParameterMapValues[paramKey],
  //       },
  //     }),
  //   );
  // });
  // useEffect(() => {
  //   if (ParameterMapValues) {
  //     console.log('ParameterMapValues in effect', ParameterMapValues);

  //     const pkeys = Object.keys(ParameterMapValues);
  //     pkeys.forEach(paramKey => {
  //       dispatch(
  //         setInRenderingStateParameters({
  //           path: localContextPath,
  //           value: {
  //             [paramKey]: ParameterMapValues[paramKey],
  //           },
  //         }),
  //       );
  //     });
  //   }
  // }, [Object.values(ParameterMapValues)]);
};

// const useResourceParametersFromState = builtPath =>
//   useAppSelector((state: Rendering) => {
//     const aaa = state.rendering.renderingState[builtPath];
//     return aaa ? aaa[STATE_RS_PARAMETERS_KEY] : null;
//   });

export const calculateLocalContextPath = props => {
  if (!props.localContextPath && !props.path) {
    return getRootPath();
  } else if (props.localContextPath === getRootPath()) {
    return props.localContextPath + props.path;
  }
  return props.localContextPath + PATH_SEPARATOR + props.path;
};

export const SmRefToResource = (props: {
  params: RefToResourceParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();

  console.log('TheSmRefToResource', props);

  const params: RefToResourceParams = props.params;

  if (!params || !params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const resourceId = params.resourceId;

  const builtPath = buildPath(props);
  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, RESOURCE_CONTENT_KEY);
  // const targetParameterDefinitions = useResourceWithKey(resource, LOCAL_CONTEXT);
  const callingParameterDefinitions = params[PARAMETER_DEFINITIONS];

  // const resource = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);
  // console.log('SmRefToResource', resourceParameters);

  // const resourcesToFetch = useResourceToFetch(resourceParameters, pageContext, builtPath);

  initLocalContext(callingParameterDefinitions, props, builtPath);
  enrichLocalContext(builtPath);
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
        // params={props.params ? params.params : null}
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
