import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAttribute, setAction, setInLocalState, setInRenderingStateOutputs } from './rendering.reducer';
import SiteList from '../site/site-list';
import { AttValue } from '../attribute-value/attribute-value';
import {
  calculateLocalContextPath,
  SmRefToResource,
  useConstantValue,
  useRefToLocalContext,
  useRefToLocalContextValue,
  useRefToPageContextValue,
  // ZZZResourceContent,
} from './resource-content';
import { buildAttributeIdFormExploded, SmAttributeField, SmForm } from './render-form';
import { SmLayoutElement, SmMenu, SmPage, usePageContext } from './layout';
import { IAttribute, IAttributeWithValue } from 'app/shared/model/attribute.model';

// export const TextBasic = props => {
//   const siteEntity = useAppSelector(state => state.site.entity);
//   // const rendering = useAppSelector(state => state.rendering);
//   const [value] = useState(props.text);

//   return <span>{value}</span>;
// };

// export const SmTextConst = props => {
//   if (props.params.input.const) {
//     return (
//       <span>
//         {props.params.input.const} - ({buildPath(props)})
//       </span>
//     );
//   }
//   return <span>const is required in SmText</span>;
// };

export function buildPath(props) {
  const path = props.path;
  if (!path) {
    return props.currentPath;
  }
  const currentPath = props.currentPath;
  if (getRootPath() === currentPath) {
    return currentPath + props.path;
  }

  return props.currentPath + PATH_SEPARATOR + props.path;
}

export function getRootPath() {
  return PATH_SEPARATOR;
}

export const applyPath = (path, pathToApply) => {
  if (pathToApply.startsWith(ROOT_PATH_SEPARATOR)) {
    return pathToApply;
  } else if (pathToApply.startsWith('..')) {
    const originaPath: string[] = path.substring('/'.length).split(PATH_SEPARATOR);
    const splited: string[] = pathToApply.split(PATH_SEPARATOR);

    const result = originaPath;
    splited.forEach(fragment => {
      if (fragment === '..') {
        result.pop();
      } else {
        result.push(fragment);
      }
    });
    return ROOT_PATH_SEPARATOR + result.join(PATH_SEPARATOR);
  } else if (pathToApply.startsWith('.' + PATH_SEPARATOR)) {
    return path + PATH_SEPARATOR + pathToApply.substring('.'.length);
  } else {
    return path + PATH_SEPARATOR + pathToApply;
  }
};

export const PATH_KEY = 'path';
export const OUTPUT_KEY = 'output';
export const RESOURCE_ID_KEY = 'resourceId';
export const ATT_CONFIG_KEY = 'attConfig';
export const CAMPAIGN_ID_KEY = 'campaignId';
export const REF_TO_PATH_KEY = 'refToPath';
export const REF_TO_PAGE_CONTEXT_KEY = 'refToPageContext';
export const REF_TO_LC_KEY = 'refToLocalContext';
export const REF_TO_LC_PARAMETER_KEY_KEY = 'parameterKey';
export const REF_TO_LC_PROPERTY_KEY = 'property';
export const CONST_KEY = 'const';
export const CONST_VALUE_KEY = 'constValue';
export const SITE_VALUE_KEY = 'siteValue';
export const ENTITY_KEY = 'entity';
export const ENTITY_IDS_KEY = 'entityIds';
export const RESOURCE_NAME_KEY = 'name';
export const FIELDS_ATTRIBUTES_KEY = 'fieldsAttributes';
export const UPDATED_ATTRIBUTE_IDS_KEY = 'updatedAttributeIds';
export const LAYOUT_RESOURCE_ID_KEY = 'layoutResourceId';
export const LAYOUT_ELEMENTS_KEY = 'layoutElements';
export const LAYOUT_ELEMENT_ID = 'layoutElementId';
export const LAYOUT_ELEMENT_RESOURCE_ID = 'resourceId';
export const RESOURCE_FROM_REF_KEY = 'resource';
export const SITE_FROM_REF_KEY = 'site';
export const RESOURCE_CONTENT_KEY = 'content';
export const RESOURCE_PARAMETERS_KEY = 'parameters';
export const RESOURCE_PARAMETER_KEY = 'parameterKey';
export const RESOURCE_PARAMETER_TYPE_KEY = 'parameterType';
export const RESOURCE_PARAMETER_SOURCES_KEY = 'parameterSources';
export const RESOURCE_PARAMETER_SOURCE_KEY = 'source';
export const RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY = 'sourceParameterKey';

export const COMPONENT_TYPE = 'componentType';
export const PARAMS_KEY = 'params';
export const PARAMS_RESOURCE_ID_KEY = 'resourceId';

export const PARAMS_SITE_LIST_SELECTED_SITE_KEY = 'selectedSiteKeyInLocalContext';

export const PARAMS_INPUT_OUTPUT_KEY = 'outputParameterKey';
export const PARAMS_INPUT_DEFAULT_VALUE_KEY = 'defaultValue';

export const PARAMS_CONST_TEXT_VALUE_KEY = 'textValue';

export const PARAMS_FORM_ATTRIBUTE_CONTEXT_KEY = 'attributeContext';
export const PARAMS_FORM_ATTRIBUTE_CONTEXT_RESOURCE_ID_KEY = 'resourceId';
export const PARAMS_FORM_ATTRIBUTE_CONTEXT_CAMPAIGN_ID_KEY = 'campaignId';
export const PARAMS_FORM_FIELDS_KEY = 'fields';
export const PARAMS_FORM_FIELDS_FIELD_TYPE_KEY = 'fieldType';
export const PARAMS_FORM_FIELDS_FIELD_ID_KEY = 'fieldId';
export const PARAMS_FORM_FIELDS_ATTRIBUTE_CONFIG_ID_KEY = 'attributeConfigId';
export const PARAMS_FORM_FIELDS_CAMPAIGN_ID_KEY = 'campaignId';
export const PARAMS_FORM_FIELDS_USE_CURRENT_KEY = 'useCurrent';

export const PARAMS_FORM_FORM_CONTENT_KEY = 'formContent';

export const RESOURCE_CONTENT_PROPERTY = 'content';

export const STATE_RS_PARAMETERS_KEY = 'parameters';
export const STATE_RS_OUTPUTS_KEY = 'outputs';
export const STATE_RS_SELF_KEY = 'self';
// export const STATE_RS_LOCAL_CONTEXT_KEY = 'localContext';

export const RENDERING_SLICE_KEY = 'rendering';
export const STATE_CURRENT_PAGE_ID_KEY = 'currentPageId';
export const STATE_PAGE_RESOURCE_KEY = 'pageResource';
export const STATE_PAGE_RESOURCES_KEY = 'pageResources';
export const STATE_PAGE_CONTEXT_KEY = 'pageContext';
export const STATE_RENDERING_STATE_KEY = 'renderingState';
// export const STATE_LAYOUT_ELEMENTS_KEY = 'layoutElements';

export type PARAMETER_SOURCE_TYPE = 'pageContext' | 'localContext';
export type PARAMETER_TYPE = 'site' | 'string';
export type PARAMETER_SOURCE = {
  [RESOURCE_PARAMETER_SOURCE_KEY]: PARAMETER_SOURCE_TYPE;
  [RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY]: string;
};
export type PARAMETER = {
  [RESOURCE_PARAMETER_KEY]: string;
  [RESOURCE_PARAMETER_TYPE_KEY]: PARAMETER_TYPE;
  [RESOURCE_PARAMETER_SOURCES_KEY]?: PARAMETER_SOURCE[];
};
export type PARAMETER_SOURCES_TYPE = PARAMETER_SOURCE[];
export type PARAMETERS_TYPE = PARAMETER[];

export type RESOURCE_STATE = {
  loading: boolean;
  error?: any;
  value?: any;
  usedId?: string;
};
export type RENDERING_CONTEXT = { [key: string]: RESOURCE_STATE };

export const ELEM_LAYOUT_ELEMENT = 'layoutElement';
export const ELEM_REF_TO_RESOURCE_ELEMENT = 'SmRefToResource';

export const PARAMETER_DEFINITIONS = 'parameterDefinitions';
export const PARAMETER_KEY = 'parameterKey';
export const DEFINITION = 'definition';
export const RULE_TYPE = 'ruleType';
export const DEFINITIONS = 'definitions';
export const CONST_VALUE = 'constValue';
export const RULE_SOURCE_SITE_ID_VALUE = 'sourceSiteId';

export const LOCAL_CONTEXT = 'localContext';

export type RuleType = 'constant' | 'refToLocalContext' | 'refToPageContext' | 'refToSite';
export type TransformTo = 'site';
export type ConstantRuleDefinition = { [RULE_TYPE]: RuleType; [CONST_VALUE]: any };
export type RefToSiteDefinition = { [RULE_TYPE]: RuleType; [RULE_SOURCE_SITE_ID_VALUE]: RuleDefinition };
export type RefToContextRuleDefinition = {
  ruleType: RuleType;
  path: string;
  sourceParameterKey: string;
  sourceParameterProperty?: string;
  transformTo?: TransformTo;
  siteIdSourceParameterKey?: string; // if transformTo is 'site'
  siteIdSourceParameterProperty?: string; // if transformTo is 'site'
};
export type RuleDefinition = RefToContextRuleDefinition | ConstantRuleDefinition | RefToSiteDefinition;
export type ParameterDefinition = { [PARAMETER_KEY]: string; [DEFINITION]?: RuleDefinition; [DEFINITIONS]?: RuleDefinition[] };
export type ParameterDefinitions = { [PARAMETER_DEFINITIONS]: ParameterDefinition[] };
export type LocalContext = { [LOCAL_CONTEXT]: ParameterDefinition[] };

export type SiteListParams = { [PARAMS_SITE_LIST_SELECTED_SITE_KEY]: string };
export type InputParams = { [PARAMS_INPUT_OUTPUT_KEY]: string; [PARAMS_INPUT_DEFAULT_VALUE_KEY]?: RuleDefinition };
export type TextParams = { [PARAMS_CONST_TEXT_VALUE_KEY]: RuleDefinition };

export type FormFieldParam = {
  [PARAMS_FORM_FIELDS_FIELD_TYPE_KEY]: string;
  [PARAMS_FORM_FIELDS_FIELD_ID_KEY]: string;
  [PARAMS_FORM_FIELDS_ATTRIBUTE_CONFIG_ID_KEY]: string;
  [PARAMS_FORM_FIELDS_CAMPAIGN_ID_KEY]: {
    [PARAMS_FORM_FIELDS_USE_CURRENT_KEY]: boolean;
  };
};

export type FormAttributeContextParam = {
  [PARAMS_FORM_ATTRIBUTE_CONTEXT_RESOURCE_ID_KEY]: RuleDefinition;
  [PARAMS_FORM_ATTRIBUTE_CONTEXT_CAMPAIGN_ID_KEY]: RuleDefinition;
};

export type FormParams = {
  [PARAMS_FORM_ATTRIBUTE_CONTEXT_KEY]: FormAttributeContextParam;
  [PARAMS_FORM_FIELDS_KEY]: FormFieldParam;
  [PARAMS_FORM_FORM_CONTENT_KEY]: any;
};
export type RefToResourceParams = { [PARAMS_RESOURCE_ID_KEY]: string; [PARAMETER_DEFINITIONS]: ParameterDefinition[] };
export type Params = RefToResourceParams | SiteListParams | TextParams | InputParams;

export type Parameters = { [path: string]: RESOURCE_STATE };
export type RenderingState = {
  [path: string]: { self?: any; parameters?: Parameters; paginationState?: any; listState?: any; attribute?: IAttributeWithValue };
};
export type PageContextState = { [path: string]: any };
export type PageResourcesState = { [path: string]: any };
export type CurrentPageIdState = string | null;
export type ActionState = {
  source: string;
  actionType: 'selectSite' | 'updateAttribute';
  entity: { entityType: 'SITE' | 'RESOURCE' | 'ATTRIBUTES'; entity?: any; entityIds?: any };
} | null;
export type RenderingSt = {
  renderingState: RenderingState;
  pageContext: PageContextState;
  pageResources: PageResourcesState;
  currentPageId: CurrentPageIdState;
  action: ActionState;
};
export type Rendering = {
  rendering: RenderingSt;
};
export const emptyValue: RESOURCE_STATE = {
  loading: false,
};

export const buildValue = (val: string): RESOURCE_STATE => {
  return {
    loading: false,
    value: val,
  };
};
// export const SmTextRefToPath = props => {
//   const builtPath = buildPath(props);
//   const refToPath = props.params[TEXT_VALUE_KEY][REF_TO_PATH_KEY];
//   const calculatedPath = applyPath(builtPath, refToPath.path);
//   const referencedValue = useRenderingState(calculatedPath);
//   // console.log('aaaa', referencedValue, props.params.input.property);
//   if (referencedValue) {
//     return <span>{getValueForPathInObject(referencedValue, refToPath.property ?? OUTPUT_KEY)}</span>;
//     // return <span>{referencedValue[props.params.input.property ?? OUTPUT_KEY]}</span>;
//   }
//   return <span>No value found for {calculatedPath} for SmTextRefToPath</span>;
// };

// export const SmTextRefToContext = props => {
//   const refToContext = props.params[TEXT_VALUE_KEY][REF_TO_CONTEXT_KEY];
//   const value = useRenderingContextState(refToContext.property);
//   if (value) {
//     return <span>{value}</span>;
//   }
//   return <span>No value found in context for SmTextRefToPath</span>;
// };

export const getValueForPathInObject = (obj, path?) => {
  try {
    if (!path) {
      return obj;
    }
    const splited = path.split('.');
    return splited.reduce((acc, current) => acc[current], obj);
  } catch (ex) {
    return null;
  }
};

export const SmText = (props: { params: TextParams; depth: string; currentPath: string; path: string; localContextPath: string }) => {
  // console.log('SmText', props);
  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmText</i>
      </span>
    );
  }

  const textValue = props.params[PARAMS_CONST_TEXT_VALUE_KEY];
  if (!textValue) {
    return (
      <span>
        <i>{PARAMS_CONST_TEXT_VALUE_KEY} param is mandatory in SmText</i>
      </span>
    );
  }

  const calculatedValue: RESOURCE_STATE = useCalculatedValueState(props, textValue);
  // console.log('SmText', textValue, calculatedValue);

  if (calculatedValue) {
    if (calculatedValue.loading) {
      return <span>Loading...</span>;
    } else if (calculatedValue.error) {
      return <span>Error: {calculatedValue.error}</span>;
    } else if (calculatedValue.value) return <span>{calculatedValue.value}</span>;
  }
  return (
    <span>
      <i>No value for SmText</i>
    </span>
  );

  // if (textValue[REF_TO_PATH_KEY]) {
  //   return <SmTextRefToPath {...props}></SmTextRefToPath>;
  // } else if (textValue[REF_TO_CONTEXT_KEY]) {
  //   return <SmTextRefToContext {...props}></SmTextRefToContext>;
  // } else if (textValue[CONST_KEY]) {
  //   return <SmTextConst {...props}></SmTextConst>;
  // }
  // return <span>You should have at least refToPath or refToContext or const in SmText</span>;
};

// export const useCalculatedValue = (props, elem) => {
//   if (elem[REF_TO_PATH_KEY]) {
//     const builtPath = buildPath(props);
//     const refToPath = elem[REF_TO_PATH_KEY];
//     const calculatedPath = applyPath(builtPath, refToPath.path);
//     const referencedValue = useRenderingState(calculatedPath);
//     if (referencedValue) {
//       return getValueForPathInObject(referencedValue, refToPath.property ?? OUTPUT_KEY);
//     }
//     return null;
//   } else if (elem[REF_TO_CONTEXT_KEY]) {
//     const refToContext = elem[REF_TO_CONTEXT_KEY];
//     return useRenderingContextState(refToContext.property);
//   } else if (elem[CONST_KEY]) {
//     return elem[CONST_KEY][CONST_VALUE_KEY];
//   }
//   return null;
// };

export const useCalculatedValueStateIfNotNull = (props, resourceId) => {
  const [result, setResult] = useState();
  const value = useCalculatedValueState(props, resourceId);
  useEffect(() => {
    const val = value && value.value ? value.value : null;
    if (val !== result) {
      console.log('useCalculatedValueStateIfNotNull', val, result);
      setResult(value && value.value ? value.value : null);
    }
  }, [value]);
  return result;
};

export const useCalculatedValueState = (props, ruleDefinition: RuleDefinition): RESOURCE_STATE => {
  const ruleType = ruleDefinition[RULE_TYPE];
  if (ruleType === 'refToLocalContext') {
    const refToContextRuleDefinition: RefToContextRuleDefinition = ruleDefinition as RefToContextRuleDefinition;
    return useRefToLocalContextValue(
      props.localContextPath,
      refToContextRuleDefinition.path,
      refToContextRuleDefinition.sourceParameterKey,
      refToContextRuleDefinition.sourceParameterProperty,
    );
  } else if (ruleType === 'refToPageContext') {
    return useRefToPageContextValue(props, ruleDefinition as RefToContextRuleDefinition);
    // } else if (ruleType === 'refToSite') {
    //   const refToSiteDefinition: RefToSiteDefinition = ruleDefinition as RefToSiteDefinition;
    //   const siteIdRef = refToSiteDefinition[RULE_SOURCE_SITE_ID_VALUE];
    //   if (!siteIdRef) {
    //     return {
    //       loading: false,
    //       error: `${RULE_SOURCE_SITE_ID_VALUE} must be defined for refToSite ruleDefinition`,
    //     };
    //   }
    //   const siteId = useCalculatedValueState(props, siteIdRef);
    //   return useRefToLocalContextValue(props, refToContextRuleDefinition.path, refToContextRuleDefinition.sourceParameterKey);
  } else if (ruleType === 'constant') {
    return useConstantValue(props, ruleDefinition as ConstantRuleDefinition);
  } else {
    return {
      loading: false,
      error: 'Not implemented : ' + ruleType,
    };
  }
};
// export const useCalculatedValueStateOld = (props, elem) => {
//   if (!elem) {
//     return null;
//   }
//   if (elem[REF_TO_PATH_KEY]) {
//     const builtPath = buildPath(props);
//     const refToPath = elem[REF_TO_PATH_KEY];
//     const calculatedPath = applyPath(builtPath, refToPath.path);
//     return useAppSelector(state => {
//       const aaa = state.rendering.renderingState[calculatedPath];
//       return aaa ? getValueForPathInObject(aaa, refToPath.property ?? OUTPUT_KEY) : null;
//     });
//     // const [aaa, setAaa] = useState();

//     // useEffect(() => {
//     //   console.log('SmAttributeField has changed');
//     //   setAaa(getValueForPathInObject(referencedValue, refToPath.property ?? OUTPUT_KEY));
//     // }, [referencedValue]);
//     // return aaa;
//   } else if (elem[REF_TO_PAGE_CONTEXT_KEY]) {
//     const refToContext = elem[REF_TO_PAGE_CONTEXT_KEY];

//     return useAppSelector(state => getValueForPathInObject(state.rendering.context, refToContext.property));
//   } else if (elem[REF_TO_LC_KEY]) {
//     const refToLocalContext = elem[REF_TO_LC_KEY];
//     const ParameterKey = refToLocalContext[REF_TO_LC_PARAMETER_KEY_KEY];
//     const property = refToLocalContext[REF_TO_LC_PROPERTY_KEY];

//     // console.log('REF_TO_LC_KEY ========> TO INVESTIGATE HERE on rpage1');

//     return useAppSelector(state => {
//       const aaa = state.rendering.renderingState[props.localContextPath];
//       if (!aaa) {
//         return null;
//       }
//       // console.log('useAppSelector', props.localContextPath, aaa);
//       const localContext = aaa[STATE_RS_PARAMETERS_KEY];
//       if (!localContext) {
//         return null;
//       }
//       const value: RESOURCE_STATE = localContext[ParameterKey];
//       if (value && value.value) {
//         return getValueForPathInObject(value.value, property);
//       }
//       if (value && value.loading) {
//         return 'Text is loading...';
//       }
//     });
//     // return useRenderingContextState(refToContext.property);
//     // const [aaa, setAaa] = useState();

//     // useEffect(() => {
//     //   console.log('SmAttributeField has changed');
//     //   setAaa(getValueForPathInObject(referencedValue, refToPath.property ?? OUTPUT_KEY));
//     // }, [referencedValue]);
//     // return aaa;
//   } else if (elem[CONST_KEY]) {
//     console.log('isConst', elem);

//     return elem[CONST_KEY][CONST_VALUE_KEY];
//   }
//   return null;
// };

// export function useRenderingState(renderingPath, path1?) {
//   if (path1) {
//     return useAppSelector(state => {
//       const a = state.rendering.renderingState[renderingPath];
//       return a ? a[path1] : null;
//     });
//   }
//   return useAppSelector(state => state.rendering.renderingState[renderingPath]);
// }

// export function useRenderingContextState(property) {
//   return useAppSelector(state => getValueForPathInObject(state.rendering.context, property));
// }

// export function updateRenderingStatezzz(dispatch, path: string, value) {
//   dispatch(
//     setRenderingForPath({
//       path,
//       value,
//     }),
//   );
// }

export const SmInput = (props: { params: InputParams; depth: string; currentPath: string; path: string; localContextPath: string }) => {
  // const defaultValue: RESOURCE_STATE = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY]
  //   ? { loading: false, value: props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY] }
  //   : { loading: false };

  const outputKey = props.params[PARAMS_INPUT_OUTPUT_KEY];
  if (!outputKey) {
    return (
      <span>
        <i>{PARAMS_INPUT_OUTPUT_KEY} param is mandatory in SmInput</i>
      </span>
    );
  }

  const defaultValueKey: RuleDefinition = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY];
  const defaultValue: RESOURCE_STATE = defaultValueKey ? useCalculatedValueState(props, defaultValueKey) : { loading: false };
  const [value, setValue] = useState(defaultValue);
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);

  // const defaultValue: RuleDefinition = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY];

  useEffect(() => {
    if (defaultValue) {
      dispatch(
        setInLocalState({
          localContextPath: props.localContextPath,
          parameterKey: props.params[PARAMS_INPUT_OUTPUT_KEY],
          value: defaultValue,
        }),
      );

      // dispatch(
      //   setInRenderingStateOutputs({
      //     path: builtPath,
      //     value: {
      //       [OUTPUT_KEY]: props.params.defaultValue.const,
      //     },
      //   }),
      // );
    }
  }, []);

  const handleChange = event => {
    setValue(event.target.value);
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params[PARAMS_INPUT_OUTPUT_KEY],
        value: { value: event.target.value, loading: false },
      }),
    );
    // dispatch(
    //     setInRenderingStateOutputs({
    //       path: builtPath,
    //       value: {
    //         [OUTPUT_KEY]: event.target.value,
    //       },
    //     }),
    //   );
    dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));
  };

  return (
    <div>
      <input value={value ? value.value : null} onChange={handleChange}></input>
    </div>
  );
};

export const TheSiteList = props => {
  return <SiteList {...props}></SiteList>;
};

// export const TextRef = (props: { refTo: string | number; col: any }) => {
//   const siteEntity = useAppSelector(state => state.site.entity);
//   const action = useAppSelector(state => state.rendering.action);

//   const [value, setValue] = useState('?');

//   useEffect(() => {
//     if (!action || action.source !== props.refTo) {
//       return;
//     }
//     if (action.actionType === 'textChanged') {
//       setValue(action.value);
//     } else {
//       setValue('----');
//     }
//   }, [action]);

//   return <span>{value}</span>;
// };

// export const SiteRef = (props: { refTo: string; col: any }) => {
//   const action = useAppSelector(state => state.rendering.action);
//   // console.log('in app selector', state.rendering.renderingState, ddd);
//   // return ddd;
//   // });
//   const [value, setValue] = useState('?');

//   useEffect(() => {
//     if (!action || action.source !== props.refTo) {
//       return;
//     }
//     if (action.actionType === 'selectSite') {
//       setValue(action.entity[ENTITY_KEY].id + ' - ' + action.entity[ENTITY_KEY].name);
//     } else {
//       setValue('----');
//     }
//   }, [action]);

//   return <span>{value}</span>;
// };

// export const SmSiteRef = props => {
//   const builtPath = buildPath(props);
//   const siteValue = props.params[SITE_VALUE_KEY];
//   if (!siteValue) {
//     return <span>Missing param {SITE_VALUE_KEY} in SmSiteRef</span>;
//   }

//   const calculatedValue = useCalculatedValueState(props, siteValue);
//   if (calculatedValue) {
//     return (
//       <span>
//         <u>Site:</u> {calculatedValue[ENTITY_KEY][RESOURCE_NAME_KEY]}
//       </span>
//     );
//   }

//   return (
//     <span>
//       <i>No site for SmSiteRef</i>
//     </span>
//   );
// };

// export const ZZZZZZZZZAttRef = (props: { refTo: string; attributeKey: string; campaignId: string; path: string; col: any }) => {
//   const action = useAppSelector(state => state.rendering.action);
//   const dispatch = useAppDispatch();

//   // console.log('in app selector', state.rendering.renderingState, ddd);
//   // return ddd;
//   // });
//   const initialState = {
//     attribute: null,
//   };

//   const [attValue, setAttValue] = useState('??');

//   const attribute = useAppSelector(state => {
//     const aaa = state.rendering.renderingState[props.path];
//     return aaa ? (aaa.attribute ? aaa.attribute : null) : null;
//   });

//   useEffect(() => {
//     dispatch(setRenderingForPath({ path: props.path, value: initialState }));
//   }, []);

//   useEffect(() => {
//     if (!action || action.source !== props.refTo) {
//       return;
//     }
//     if (action.actionType === 'selectSite') {
//       dispatch(
//         getAttribute({
//           exploded: {
//             siteId: action.entity[ENTITY_KEY].id,
//             campaignId: props.campaignId,
//             key: props.attributeKey,
//           },
//           path: props.path,
//         }),
//       );
//     }
//   }, [action]);

//   useEffect(() => {
//     if (attribute) {
//       setAttValue(attribute);
//     } else {
//       setAttValue(null);
//     }
//   }, [attribute]);

//   return <AttValue attValue={attValue}></AttValue>;
// };

const useExplodedAttVal = (resourceIdVal, campaignIdVal, attConfigVal): string | null => {
  const [useExploded, setUseExploded] = useState(null);
  useEffect(() => {
    if (resourceIdVal && campaignIdVal && attConfigVal && resourceIdVal.value && campaignIdVal.value && attConfigVal.value) {
      const attId = buildAttributeIdFormExploded(resourceIdVal.value, attConfigVal.value, campaignIdVal.value);
      console.log('useExplodedAttVal...', attId);
      setUseExploded(attId);
    }
  }, [resourceIdVal, campaignIdVal, attConfigVal]);
  return useExploded;
};

const loadAttribute = (props, resourceIdVal, attConfigVal, campaignIdVal) =>
  getAttribute({
    exploded: {
      siteId: resourceIdVal,
      campaignId: campaignIdVal,
      key: attConfigVal,
    },
    path: buildPath(props),
  });

export const SmAttRef = props => {
  const dispatch = useAppDispatch();
  const action: ActionState = useAppSelector((state: Rendering) => state.rendering.action);

  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmAttRef</i>
      </span>
    );
  }

  const resourceId = props.params[RESOURCE_ID_KEY];
  const campaignId = props.params[CAMPAIGN_ID_KEY];
  const attConfig = props.params[ATT_CONFIG_KEY];

  if (!resourceId || !campaignId || !attConfig) {
    return displayWarning(resourceId, campaignId, attConfig);
  }

  const builtPath = buildPath(props);
  const attribute = useAppSelector((state: Rendering) => {
    const aaa = state.rendering.renderingState[builtPath];
    console.log('aaa...', aaa);
    return aaa ? (aaa.attribute ? aaa.attribute : null) : null;
  });

  const resourceIdVal: RESOURCE_STATE = useCalculatedValueState(props, resourceId);
  const campaignIdVal: RESOURCE_STATE = useCalculatedValueState(props, campaignId);
  const attConfigVal: RESOURCE_STATE = useCalculatedValueState(props, attConfig);

  const explodedAttVal: string | null = useExplodedAttVal(resourceIdVal, attConfigVal, campaignIdVal);

  const [previousExploded, setPreviousExploded] = useState(null);

  const [attValue, setAttValue] = useState(null);

  useEffect(() => {
    if (action && action.actionType === 'updateAttribute') {
      // if (!hasChanged()) {
      //   // IMPLEMENT HERE COMPARAISON WITH PREVIOUS EXPLODED VALUE   ??????????
      //   return;
      // }

      if (resourceIdVal && campaignIdVal && attConfigVal && resourceIdVal.value && campaignIdVal.value && attConfigVal.value) {
        const attId = buildAttributeIdFormExploded(resourceIdVal.value, attConfigVal.value, campaignIdVal.value);
        console.log('action...', action, attId);
        if (action.entity.entityIds.indexOf(attId) !== -1) {
          dispatch(loadAttribute(props, resourceIdVal.value, attConfigVal.value, campaignIdVal.value));
        }
      }
    }
  }, [action]);

  useEffect(() => {
    console.log('useEffect111', resourceIdVal, campaignIdVal, attConfigVal);
    if (explodedAttVal && explodedAttVal !== previousExploded) {
      setPreviousExploded(explodedAttVal);
      dispatch(loadAttribute(props, resourceIdVal.value, attConfigVal.value, campaignIdVal.value));
    }
  }, [explodedAttVal]);

  useEffect(() => {
    // console.log('useEffect222', resourceIdVal, campaignIdVal, attConfigVal);
    if (attribute) {
      setAttValue(attribute);
    } else {
      setAttValue(null);
    }
  }, [attribute]);

  return <AttValue attValue={attValue}></AttValue>;
};

export const displayWarning = (resourceId, campaignId, attConfig) => {
  if (!resourceId) {
    return (
      <span>
        <i>{RESOURCE_ID_KEY} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!campaignId) {
    return (
      <span>
        <i>{CAMPAIGN_ID_KEY} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!attConfig) {
    return (
      <span>
        <i>{ATT_CONFIG_KEY} is mandatory in SmAttRef</i>
      </span>
    );
  }
};

export const PATH_SEPARATOR = '/';
export const ROOT_PATH_SEPARATOR = '/';

export const MyVerticalPanel = props => {
  // console.log('MyVerticalPanel', props);

  const renderItems = items =>
    items.map((item, index) => (
      <MyElem
        key={index}
        depth={increment(props.depth)}
        input={{ ...item }}
        currentPath={props.currentPath + PATH_SEPARATOR + props.path}
        form={props.form}
        localContextPath={props.localContextPath}
      ></MyElem>
    ));

  return <Row className="border-blue padding-4">{renderItems(props.items)}</Row>;
};

export const MyInput = props => {
  const [value, setValue] = useState(props.value);
  const dispatch = useAppDispatch();
  // console.log('bbbb', props.path);
  // dispatch(tata());
  const builtPath = buildPath(props);
  const rendering = useAppSelector(state => state.rendering.renderingState[builtPath]);

  const handleChange = event => {
    setValue(event.target.value);
    dispatch(
      setInRenderingStateOutputs({
        path: builtPath,
        value: {
          [OUTPUT_KEY]: event.target.value,
        },
      }),
    );

    dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));

    // setRendering(event.target.value);
    // dispatch(setStateForPath({ path: props.path, value: event.target.value }));
  };
  useEffect(() => {
    // dispatch(setRenderingForPath({ path: props.path, value: props.value }));
    // if (setRendering) {
    //   setRendering(props.value);
    // }
    // dispatch(setStateForPath({ path: props.path, value: props.value }));
  }, []);

  return (
    <div>
      <input value={value} onChange={handleChange}></input>
      {props.path}
    </div>
  );
};

export const MyElem = props => {
  // console.log('MyElem', props);
  const renderSwitch = params => {
    switch (params.componentType) {
      // case 'textBasic':
      //   return <TextBasic {...params}></TextBasic>;
      case 'SmText':
        return <SmText {...params}></SmText>;
      case 'SmInput':
        return <SmInput {...params}></SmInput>;
      case ELEM_REF_TO_RESOURCE_ELEMENT:
        return <SmRefToResource {...params}></SmRefToResource>;
      // case 'textRef':
      //   return <TextRef {...params}></TextRef>;
      // case 'siteRef':
      //   return <SiteRef {...params}></SiteRef>;
      // case 'SmSiteRef':
      //   return <SmSiteRef {...params}></SmSiteRef>;
      // case 'attRef':
      //   return <ZZZZZZZZZAttRef {...params}></ZZZZZZZZZAttRef>;
      case 'SmAttRef':
        return <SmAttRef {...params}></SmAttRef>;
      case 'input':
        return <MyInput {...params}></MyInput>;
      case 'siteList':
        return <TheSiteList {...params}></TheSiteList>;
      case 'Form':
        return <SmForm {...params}></SmForm>;
      case 'AttributeField':
        return <SmAttributeField {...params}></SmAttributeField>;
      case 'page':
        return <SmPage {...params}></SmPage>;
      case 'menu':
        return <SmMenu {...params}></SmMenu>;
      case ELEM_LAYOUT_ELEMENT:
        return <SmLayoutElement {...params}></SmLayoutElement>;
      // case 'resourceContent':
      //   return <ZZZResourceContent {...params}></ZZZResourceContent>;
      case 'verticalPanel':
        return <MyVerticalPanel {...params}></MyVerticalPanel>;
      default:
        return <p>Not implemented...{params.componentType}</p>;
    }
  };

  return (
    <MyWrapper {...{ ...props.input, currentPath: props.currentPath, depth: props.depth, localContextPath: props.localContextPath }}>
      {renderSwitch({
        ...props.input,
        currentPath: props.currentPath,
        depth: props.depth,
        form: props.form,
        localContextPath: props.localContextPath,
      })}
    </MyWrapper>
  );
};

export const increment = (depth: string) => {
  const depthAsNumber = Number(depth);
  return '' + (depthAsNumber + 1);
};

export const MyWrapper = ({ children, ...props }) => {
  let cn = '';
  const pageContext: RENDERING_CONTEXT = usePageContext();
  if (props.border) {
    cn += ' border-2';
  }

  const lc = useRefToLocalContext(props.localContextPath, calculateLocalContextPath(props));

  const displayPath = false;
  if (displayPath) {
    <pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre>;

    return (
      <Col md={props.col ?? 12} className={cn}>
        <Col md="12">
          <i className="wrapper-text">
            (path={buildPath(props)})({props.componentType}, depth:{props.depth}, local={props.localContextPath})
          </i>
        </Col>{' '}
        <Col md="12">
          {/* {props.componentType === ELEM_LAYOUT_ELEMENT || props.componentType === ELEM_REF_TO_RESOURCE_ELEMENT
        ? (<pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre>) : ""} */}
          {props.componentType === ELEM_LAYOUT_ELEMENT || props.componentType === ELEM_REF_TO_RESOURCE_ELEMENT ? (
            <pre>{JSON.stringify(lc ? lc : {}, null, 2)}</pre>
          ) : (
            ''
          )}
        </Col>
        {children}
      </Col>
    );
  }
  return (
    <Col md={props.col ?? 12} className={cn}>
      {children}
    </Col>
  );
};
