import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAttribute, setAction, setInCorrectState, setInLocalState } from './rendering.reducer';
import SiteList from '../site/site-list';
import { AttValue } from '../attribute-value/attribute-value';
import {
  calculateTargetLocalContextPath,
  handleParameterDefinitions,
  SmRefToResource,
  useConstantDatasetFilter,
  useConstantValue,
  useRefToLocalContext,
  useRefToLocalContextValue,
  useRefToPageContextValue,
} from './resource-content';
import { buildAttributeIdFormExploded, SmAttributeField, SmForm } from './render-form';
import { SmLayoutElement, SmMenu, SmPage, usePageContext } from './layout';
import { IAttributeWithValue } from 'app/shared/model/attribute.model';
import { DataSet } from './dataset';
import { existsAndHasAValue, isError, isLoading } from './render-resource-page';

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

export function buildPath(props): string {
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
  } else if (!pathToApply) {
    return path;
  } else {
    return path + PATH_SEPARATOR + pathToApply;
  }
};

// export const PATH_KEY = 'path';
// export const OUTPUT_KEY = 'output';
// export const RESOURCE_ID_KEY = 'resourceId';
// export const ATT_CONFIG_KEY = 'attConfig';
// export const CAMPAIGN_ID_KEY = 'campaignId';
// export const REF_TO_PATH_KEY = 'refToPath';
// export const REF_TO_PAGE_CONTEXT_KEY = 'refToPageContext';
// export const REF_TO_LC_KEY = 'refToLocalContext';
// export const REF_TO_LC_PARAMETER_KEY_KEY = 'parameterKey';
// export const REF_TO_LC_PROPERTY_KEY = 'property';
// export const CONST_KEY = 'const';
// export const CONST_VALUE_KEY = 'constValue';
// export const SITE_VALUE_KEY = 'siteValue';
// export const ENTITY_KEY = 'entity';
// export const ENTITY_IDS_KEY = 'entityIds';
// export const RESOURCE_NAME_KEY = 'name';
// export const FIELDS_ATTRIBUTES_KEY = 'fieldsAttributes';
// export const UPDATED_ATTRIBUTE_IDS_KEY = 'updatedAttributeIds';
// export const LAYOUT_RESOURCE_ID_KEY = 'layoutResourceId';
// export const LAYOUT_ELEMENTS_KEY = 'layoutElements';
// export const LAYOUT_ELEMENT_ID = 'layoutElementId';
// export const LAYOUT_ELEMENT_RESOURCE_ID = 'resourceId';
// export const RESOURCE_CONTENT_KEY = 'content';
// export const RESOURCE_PARAMETERS_KEY = 'parameters';
// export const RESOURCE_PARAMETER_KEY = 'parameterKey';
// export const RESOURCE_PARAMETER_TYPE_KEY = 'parameterType';
// export const RESOURCE_PARAMETER_SOURCES_KEY = 'parameterSources';
// export const RESOURCE_PARAMETER_SOURCE_KEY = 'source';
// export const RESOURCE_PARAMETER_SOURCE_PARAMETER_KEY_KEY = 'sourceParameterKey';

// export const COMPONENT_TYPE = 'componentType';
// export const PARAMS_KEY = 'params';
// export const PARAMS_RESOURCE_ID_KEY = 'resourceId';

// export const PARAMS_SITE_LIST_SELECTED_SITE_KEY = 'selectedSiteKeyInLocalContext';

// export const PARAMS_INPUT_OUTPUT_KEY = 'outputParameterKey';
// export const PARAMS_INPUT_DEFAULT_VALUE_KEY = 'defaultValue';

// export const PARAMS_CONST_TEXT_VALUE_KEY = 'textValue';

// export const PARAMS_FORM_ATTRIBUTE_CONTEXT_KEY = 'attributeContext';
// export const PARAMS_FORM_ATTRIBUTE_CONTEXT_RESOURCE_ID_KEY = 'resourceId';
// export const PARAMS_FORM_ATTRIBUTE_CONTEXT_CAMPAIGN_ID_KEY = 'campaignId';
// export const PARAMS_FORM_FIELDS_KEY = 'fields';
// export const PARAMS_FORM_FIELDS_FIELD_TYPE_KEY = 'fieldType';
// export const PARAMS_FORM_FIELDS_FIELD_ID_KEY = 'fieldId';
// export const PARAMS_FORM_FIELDS_ATTRIBUTE_CONFIG_ID_KEY = 'attributeConfigId';
// export const PARAMS_FORM_FIELDS_CAMPAIGN_ID_KEY = 'campaignId';
// export const PARAMS_FORM_FIELDS_USE_CURRENT_KEY = 'useCurrent';

// export const PARAMS_FORM_FORM_CONTENT_KEY = 'formContent';

// export const RESOURCE_CONTENT_PROPERTY = 'content';

// export const STATE_RS_PARAMETERS_KEY = 'parameters';
// export const STATE_RS_OUTPUTS_KEY = 'outputs';
// export const STATE_RS_SELF_KEY = 'self';
// export const STATE_RS_LOCAL_CONTEXT_KEY = 'localContext';

export const RENDERING_SLICE_KEY = 'rendering';
// export const STATE_CURRENT_PAGE_ID_KEY = 'currentPageId';
// export const STATE_PAGE_RESOURCES_KEY = 'pageResources';
// export const STATE_PAGE_CONTEXT_KEY = 'pageContext';
// export const STATE_LAYOUT_ELEMENTS_KEY = 'layoutElements';

export type PARAMETER_SOURCE_TYPE = 'pageContext' | 'localContext';
export type PARAMETER_TYPE = 'site' | 'string';
export type PARAMETER_SOURCE = {
  source: PARAMETER_SOURCE_TYPE;
  sourceParameterKey: string;
};
export type PARAMETER = {
  parameterKey: string;
  parameterType: PARAMETER_TYPE;
  source?: PARAMETER_SOURCE[];
};
export type PARAMETER_SOURCES_TYPE = PARAMETER_SOURCE[];
export type PARAMETERS_TYPE = PARAMETER[];

export type SmInputParams = {
  outputParameterKey: string;
  defaultValue: RuleDefinition;
};

export type PageResourceParams = {
  layoutResourceId: string;
  layoutElements: PageLayoutElement[];
};

export type MenuResourceParams = {
  menuItems: MenuItem[];
};

export type SmLayoutElementParams = {
  layoutElementId: string;
};

export type PageLayoutElement = {
  layoutElementId: string;
  resourceId: string;
};
export type MenuItem = {
  label: string;
  path: string;
  pageId: string;
};
export type Display = {
  valueExists?: RuleDefinition;
  valueDoesNotExist?: RuleDefinition;
};
export type CommonContent = {
  path: string;
  col?: number;
  display?: Display;
  border?: boolean;
  parameterDefinitions?: ParameterDefinition[];
};

export type SmTextResourceContent = CommonContent & {
  componentType: 'SmText';
  params: TextParams;
};

export type DataSetTableType = 'dataSetTable';
export type DataSetResourceContent = CommonContent & {
  componentType: DataSetTableType;
  params: DataSetParams;
};

export type SmInputResourceContent = CommonContent & {
  componentType: 'SmInput';
  params: SmInputParams;
};

export type SmRefToResourceResourceContent = CommonContent & {
  componentType: 'SmRefToResource';
  params: RefToResourceParams;
};

export type FormResourceContent = CommonContent & {
  componentType: 'Form';
  params: FormParams;
};

export type SmAttRefResourceContent = CommonContent & {
  componentType: 'SmAttRef';
  params: AttRefParams;
};

export type SiteListResourceContent = CommonContent & {
  componentType: 'siteList';
  params: SiteListParams;
};

export type PageResourceContent = CommonContent & {
  componentType: 'page';
  params: PageResourceParams;
};

export type MenuResourceContent = CommonContent & {
  componentType: 'menu';
  params: MenuResourceParams;
};

export type LayoutElementResourceContent = CommonContent & {
  componentType: 'layoutElement';
  params: SmLayoutElementParams;
};

export type VerticalPanelResourceElement = CommonContent & {
  componentType: 'verticalPanel';
  items: ComponentResourceContent[];
};

export type ComponentResourceContent =
  | SmTextResourceContent
  | DataSetResourceContent
  | SmInputResourceContent
  | SmRefToResourceResourceContent
  | FormResourceContent
  | SmAttRefResourceContent
  | SiteListResourceContent
  | PageResourceContent
  | MenuResourceContent
  | LayoutElementResourceContent
  | VerticalPanelResourceElement;

export type ComponentResourceParameters = {};

export type LayoutElementComponentResource = {
  content: LayoutElementResourceContent;
  parameters?: ComponentResourceParameters;
};

export type ComponentResourceProperties = 'content' | 'parameters';

export type ComponentResource = {
  content: ComponentResourceContent;
  parameters?: ComponentResourceParameters;
};

export type PageComponentResource = {
  content: PageResourceContent;
  parameters?: ComponentResourceParameters;
};

export type ValueInState = {
  loading: boolean;
  error?: any;
  value?: any;
  usedId?: string;
};
export type RENDERING_CONTEXT = { [key: string]: ValueInState };

export type TargetInfo = { destinationKey: string; localContextPath: string; target: ParameterTarget; childPath?: string };

// export const ELEM_LAYOUT_ELEMENT = 'layoutElement';
// export const ELEM_REF_TO_RESOURCE_ELEMENT = 'SmRefToResource';

// export const PARAMETER_DEFINITIONS = 'parameterDefinitions';
// export const PARAMETER_KEY = 'parameterKey';
// export const DEFINITION = 'definition';
// export const RULE_TYPE = 'ruleType';
// export const DEFINITIONS = 'definitions';
// export const CONST_VALUE = 'constValue';
// export const RULE_SOURCE_SITE_ID_VALUE = 'sourceSiteId';

export const LOCAL_CONTEXT = 'localContext';

export type RuleType = 'constant' | 'refToLocalContext' | 'refToPageContext' | 'refToSite' | 'dataset' | 'datasetFilter';
export type TransformTo = 'site';
export type ConstantRuleDefinition = { ruleType: RuleType; constValue: any };
export type RefToSiteDefinition = { ruleType: RuleType; sourceSiteId: RuleDefinition };
export type DatasetDefinition = {
  ruleType: RuleType;
  columnDefinitions: ColumnDefinition[];
  filter: RuleDefinition;
  initialPaginationState: PaginationState;
};
export type PaginationState = {
  activePage: number;
  itemsPerPage: number;
  sort: string;
  order: string;
};
export type DatasetFilterRuleDefinition = { ruleType: 'datasetFilter'; valueFilter: ResourceFilter };
export type PaginationStateRuleDefinition = { ruleType: 'paginationState'; initialValue: PaginationState };
export type RefToContextRuleDefinition = {
  ruleType: RuleType;
  path: string;
  sourceParameterKey: string;
  sourceParameterProperty?: string;
  transformTo?: TransformTo;
  siteIdSourceParameterKey?: string; // if transformTo is 'site'
  siteIdSourceParameterProperty?: string; // if transformTo is 'site'
};
export type RuleDefinition =
  | RefToContextRuleDefinition
  | ConstantRuleDefinition
  | RefToSiteDefinition
  | DatasetDefinition
  | DatasetFilterRuleDefinition
  | PaginationStateRuleDefinition;

export type CurrentLocalContextPathTarget = {
  targetType: 'currentLocalContextPath';
};

export type ChildLocalContextPathTarget = {
  targetType: 'childLocalContextPath';
};

export type PageContextPathTarget = {
  targetType: 'pageContextPath';
};

export type SpecificLocalContextPathTarget = {
  targetType: 'specificLocalContextPath';
  targetPath: string;
};

export type ParameterTarget =
  | CurrentLocalContextPathTarget
  | ChildLocalContextPathTarget
  | PageContextPathTarget
  | SpecificLocalContextPathTarget;

export type ParameterDefinition = {
  parameterKey: string;
  target: ParameterTarget;
  definition?: RuleDefinition;
  definitions?: RuleDefinition[];
};
export type ParameterDefinitions = { parameterDefinitions: ParameterDefinition[] };
export type LocalContext = { [LOCAL_CONTEXT]: ParameterDefinition[] };

export type SiteListParams = { selectedSiteKeyInLocalContext: string };
export type InputParams = { outputParameterKey: string; defaultValue?: RuleDefinition };
// export type HasParameterDefinitions = { parameterDefinitions?: ParameterDefinition[] };
export type TextParams = { textValue: RuleDefinition };
export type ColumnDefinitions = {
  columnType: 'ID' | 'NAME' | 'ATTRIBUTE' | 'BUTTON';
};
export type IdColumnDefinition = {
  columnType: 'ID';
};
export type NameColumnDefinition = {
  columnType: 'NAME';
};
export type AttributeColumnDefinition = {
  columnType: 'ATTRIBUTE';
  attributeConfigId: string;
  campaignId: string;
};
export type ButtonColumnDefinition = {
  columnType: 'BUTTON';
  action: 'select' | 'edit';
};
export type ColumnDefinition = IdColumnDefinition | NameColumnDefinition | AttributeColumnDefinition | ButtonColumnDefinition;

export type DataSetParams = {
  columnDefinitions: ColumnDefinition[];
  data: RuleDefinition;
  // paginationState: RuleDefinition;
  selectedSiteKeyInLocalContext?: string;
};

export type ResourcePropertyFilterTarget = {
  filterPropertyType: 'RESOURCE_PROPERTY';
  property: string;
};
export type AttributePropertyFilterTarget = {
  filterPropertyType: 'RESOURCE_ATTRIBUTE';
  attributeConfigId: string;
  campaignId: string;
};
export type PropertyFilterTarget = ResourcePropertyFilterTarget | AttributePropertyFilterTarget;

export type TextContainsFilterRule = {
  filterRuleType: 'TEXT_CONTAINS';
  terms: RuleDefinition;
};

export type TextContainsFilterValue = {
  filterRuleType: 'TEXT_CONTAINS';
  terms?: string;
};

export type TextEqualsFilterRule = {
  filterRuleType: 'TEXT_EQUALS';
  terms: RuleDefinition;
};

export type TextEqualsFilterValue = {
  filterRuleType: 'TEXT_EQUALS';
  terms: string;
};

export type NumberGtFilterRule = {
  filterRuleType: 'NUMBER_GT';
  compareValue: number;
};

export type NumberGteFilterRule = {
  filterRuleType: 'NUMBER_GTE';
  compareValue: number;
};

export type NumberLtFilterRule = {
  filterRuleType: 'NUMBER_LT';
  compareValue: number;
};

export type NumberLteFilterRule = {
  filterRuleType: 'NUMBER_LTE';
  compareValue: number;
};

export type FilterRule =
  | TextContainsFilterRule
  | TextEqualsFilterRule
  | NumberGtFilterRule
  | NumberGteFilterRule
  | NumberLtFilterRule
  | NumberLteFilterRule;

export type FilterRuleValue = TextContainsFilterValue | TextEqualsFilterValue;

export type AndFilter = { filterType: 'AND'; items: ResourceFilter[] };
export type AndFilterValue = { filterType: 'AND'; items: ResourceFilterValue[] };
export type OrFilter = { filterType: 'OR'; items: ResourceFilter[] };
export type OrFilterValue = { filterType: 'OR'; items: ResourceFilterValue[] };

export type PropertyFilter = {
  filterType: 'PROPERTY_FILTER';
  property: PropertyFilterTarget;
  filterRule: FilterRule;
};

export type PropertyFilterValue = {
  filterType: 'PROPERTY_FILTER';
  property: PropertyFilterTarget;
  filterRule: FilterRuleValue;
};
export type ResourceFilter = AndFilter | OrFilter | PropertyFilter;
export type ResourceFilterValue = AndFilterValue | OrFilterValue | PropertyFilterValue;
export type ResourceSearchModel = {
  resourceType: 'SITE' | 'RESOURCE';
  columnDefinitions: ColumnDefinition[];
  filter?: ResourceFilter;
  page?: number;
  size?: number;
  sort?: string;
  path?: string;
};

export type AttRefParams = { resourceId: RuleDefinition; campaignId: RuleDefinition; attConfig: RuleDefinition };

export type FormFieldParam = {
  fieldType: string;
  fieldId: string;
  attributeConfigId: string;
  campaignId: {
    useCurrent: boolean;
  };
};

export type FormAttributeContextParam = {
  resourceId: RuleDefinition;
  campaignId: RuleDefinition;
};

export type FormParams = {
  attributeContext: FormAttributeContextParam;
  fields: FormFieldParam[];
  formContent: any;
};
export type HasTargetChildrenResource = { resourceId: string };
export type RefToResourceParams = HasTargetChildrenResource;
export type Params = RefToResourceParams | SiteListParams | TextParams | InputParams | AttRefParams | FormParams;

export type CommonProps = {
  depth: string;
  currentPath: string;
  path: string;
  display?: Display;
  localContextPath: string;
  parameterDefinitions?: ParameterDefinition[];
};
export type SmTextProps = CommonProps & { params: TextParams };
export type AttRefProps = CommonProps & { params: AttRefParams };
export type SmRefToResourceProps = CommonProps & { params: RefToResourceParams };
export type SmPageProps = CommonProps & { params: PageResourceParams };
export type SmLayoutElementProps = CommonProps & { params: SmLayoutElementParams };
export type FormProps = CommonProps & { params: FormParams };

export type Parameters = { [path: string]: ValueInState };
export type ComponentsState = {
  [path: string]: { self?: any; paginationState?: any; listState?: any; attribute?: IAttributeWithValue };
};
export type LocalContextsState = {
  [path: string]: { parameters?: Parameters };
};
export type PageContextState = { [path: string]: any };
export type PageResourcesState = { [path: string]: any };
export type CurrentPageIdState = string | null;
export type ActionState = EntityAction | SetCurrentPageAction;
export type EntityAction = {
  source: string;
  actionType: 'selectSite' | 'updateAttribute';
  entity: { entityType: 'SITE' | 'RESOURCE' | 'ATTRIBUTES'; entity?: any; entityIds?: any };
} | null;
export type SetCurrentPageAction = {
  source: string;
  actionType: 'setCurrentPage';
  currentPage: number;
  targetDataset: string;
} | null;
export type RenderingState = {
  componentsState: ComponentsState;
  localContextsState: LocalContextsState;
  pageContext: PageContextState;
  pageResources: PageResourcesState;
  currentPageId: CurrentPageIdState;
  action: ActionState;
};
export type RenderingSliceState = {
  rendering: RenderingState;
};
export const emptyValue: ValueInState = {
  loading: false,
};

export const buildValue = (val: string): ValueInState => {
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

export const SmText = (props: SmTextProps) => {
  // console.log('SmText', props);
  // if (props.input && display) {
  //   console.log('SmText', props);
  // }
  // const shouldDisplay = useShouldDisplay(props);

  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmText</i>
      </span>
    );
  }

  const textValue = props.params.textValue;
  if (!textValue) {
    return (
      <span>
        <i>textValue param is mandatory in SmText</i>
      </span>
    );
  }
  const params: TextParams = props.params;

  handleParameterDefinitions(params, props);
  // const callingParameterDefinitions = params.parameterDefinitions;

  // const builtPath = buildPath(props);

  // initLocalContext(callingParameterDefinitions, props, builtPath);

  const calculatedValue: ValueInState = useCalculatedValueState(props, textValue);
  // console.log('SmText', textValue, calculatedValue);
  // if (!shouldDisplay) return hidden();

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

// export const useCalculatedPropertyState = (props, ruleDefinition: RuleDefinition) => {
//   const ruleType = ruleDefinition.ruleType;
//   if (ruleType === 'refToLocalContext') {
//     const refToContextRuleDefinition: RefToContextRuleDefinition = ruleDefinition as RefToContextRuleDefinition;
//     return useRefToLocalContextValue(
//       props.localContextPath,
//       refToContextRuleDefinition.path,
//       refToContextRuleDefinition.sourceParameterKey,
//       refToContextRuleDefinition.sourceParameterProperty,
//     );
//   } else if (ruleType === 'refToPageContext') {
//     return useRefToPageContextValue(props, ruleDefinition as RefToContextRuleDefinition);
//   } else if (ruleType === 'constant') {
//     return useConstantValue(props, (ruleDefinition as ConstantRuleDefinition).constValue);
//   } else if (ruleType === 'datasetFilter') {
//     return useConstantDatasetFilter(props, ruleDefinition as DatasetFilterRuleDefinition);
//   } else if (ruleType === 'paginationState') {
//     return useConstantValue(props, (ruleDefinition as PaginationStateRuleDefinition).initialValue);
//   } else {
//     return {
//       loading: false,
//       error: 'Not implemented : ' + ruleType,
//     };
//   }
// };
export const useFoundValueInLocalContext = (localContextPath: string, sourceParameterKey: string) => {
  return useAppSelector((state: RenderingSliceState) => {
    const contextForLocalContextPath = state.rendering.localContextsState ? state.rendering.localContextsState[localContextPath] : null;
    if (!contextForLocalContextPath || !contextForLocalContextPath.parameters) {
      return null;
    }
    return contextForLocalContextPath.parameters[sourceParameterKey];
  });
};

export const useFoundValue = (props, ruleDefinition: RuleDefinition): any => {
  const ruleType = ruleDefinition.ruleType;
  if (ruleType === 'refToLocalContext') {
    const refToContextRuleDefinition: RefToContextRuleDefinition = ruleDefinition as RefToContextRuleDefinition;
    return useFoundValueInLocalContext(props.localContextPath, refToContextRuleDefinition.sourceParameterKey);
  } else if (ruleType === 'refToPageContext') {
    throw new Error('to implement hereA ' + ruleType);
  } else if (ruleType === 'constant') {
    throw new Error('to implement hereB ' + ruleType);
  }
  throw new Error('to implement hereC ' + ruleType);
};

export const useCalculatedValueState = (props, ruleDefinition: RuleDefinition): ValueInState => {
  const ruleType = ruleDefinition.ruleType;
  if (ruleType === 'refToLocalContext') {
    const refToContextRuleDefinition: RefToContextRuleDefinition = ruleDefinition as RefToContextRuleDefinition;
    // const contextState = useLocalContextPath(props.localContextPath, refToContextRuleDefinition.sourceParameterKey);
    // return
    return useRefToLocalContextValue(
      props.localContextPath,
      refToContextRuleDefinition.path,
      refToContextRuleDefinition.sourceParameterKey,
      refToContextRuleDefinition.sourceParameterProperty,
    );
  } else if (ruleType === 'refToPageContext') {
    return useRefToPageContextValue(props, ruleDefinition as RefToContextRuleDefinition);
  } else if (ruleType === 'constant') {
    return useConstantValue(props, (ruleDefinition as ConstantRuleDefinition).constValue);
  } else if (ruleType === 'datasetFilter') {
    return useConstantDatasetFilter(props, ruleDefinition as DatasetFilterRuleDefinition);
  } else if (ruleType === 'paginationState') {
    return useConstantValue(props, (ruleDefinition as PaginationStateRuleDefinition).initialValue);
  } else {
    return {
      loading: false,
      error: 'Not implemented : ' + ruleType,
    };
  }
};

export const initialFilter: ValueInState = { loading: true, value: null };

export const useChangingCalculatedFilterValueState = (
  props,
  dsfDef: DatasetFilterRuleDefinition,
  target: ParameterTarget,
): ValueInState => {
  // console.log('filterbbb.......changed', result);

  const initialResult = { loading: false };
  const filterValues = useChangedFilterValues(dsfDef.valueFilter, props);
  // console.log('calculateFilter', calculateFilter(dsfDef.valueFilter, {}));
  const [result, setResult] = useState({ loading: true });
  useEffect(() => {
    setResult(calculateFilter(dsfDef.valueFilter, filterValues));
  }, [filterValues]);
  return result;
};

const useChangedFilterValues = (filter: ResourceFilter, props): Object => {
  const [result, setResult] = useState({});
  console.log('azzzzz1', result);
  // const val = useCalculatedValueState(props, { ruleType: 'refToLocalContext', path: '', sourceParameterKey: 'theTerm' });

  useChangedFilterValuesForItem(0, filter, result, setResult, props);
  return result;
};

const useChangedFilterValuesForItem = (index: number, filter: ResourceFilter, result, setResult, props): number => {
  console.log('azzzzz');
  if (filter.filterType === 'AND') {
    console.log('azzzzz AND');
    const and: AndFilter = filter;
    let newIndex = index;
    and.items.forEach(item => {
      const index2 = useChangedFilterValuesForItem(newIndex, item, result, setResult, props);
      newIndex = newIndex + index2;
    });
    return newIndex;
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    let newIndex = index;
    or.items.forEach(item => {
      const index2 = useChangedFilterValuesForItem(newIndex, item, result, setResult, props);
      newIndex = newIndex + index2;
    });
    return newIndex;
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    console.log('azzzzz PROPERTY_FILTER');
    const propFilter: PropertyFilter = filter;
    if (propFilter.filterRule.filterRuleType === 'TEXT_CONTAINS') {
      const textContains: TextContainsFilterRule = propFilter.filterRule;
      console.log('azzzzz TEXT_CONTAINS', textContains.terms, props.localContextPath);
      const val = useCalculatedValueState(props, textContains.terms);
      useEffect(() => {
        if (val && !isLoading(val) && !isError(val)) {
          setResult({ ...result, ...{ [PROP + index]: val.value } });
        }
      }, [val]);
    }
    return 1;
  }
};

// const calculateFilterArray = (props, start: ResourceFilter[], filter: ResourceFilter): ResourceFilter[] => {
//   if (filter.filterType === 'AND') {
//     const and: AndFilter = filter;
//     and.items.forEach(item => start.concat(calculateFilterArray(props, [], item)));
//   } else if (filter.filterType === 'OR') {
//     const or: OrFilter = filter;
//     or.items.forEach(item => start.concat(calculateFilterArray(props, [], item)));
//   } else if (filter.filterType === 'PROPERTY_FILTER') {
//     const propFilter: PropertyFilter = filter;
//     if (propFilter.filterRule.filterRuleType === 'TEXT_CONTAINS') {
//       const textContains: TextContainsFilterRule = propFilter.filterRule;
//       const val = useCalculatedValueState(props, textContains.terms);
//       useEffect(() => {
//         setResult(calculateFilter(dsfDef.valueFilter, filterValues));
//       }, [val]);
//     }
//   }
// };

const calculateFilter = (filter: ResourceFilter, filterValues: Object): ValueInState => {
  const filterCount = calculateFilterCount(0, filter);
  console.log('calculateInitialFilter.......', filter, filterCount);
  const values = Object.values(filterValues);
  if (values.length !== filterCount || values.findIndex(val => !!val.loading) !== -1) {
    return { loading: true };
  }
  console.log('calculateInitialFilter.......continue');
  return { loading: false, value: calculateFilterItem(0, filter, filterValues).value };
};

const PROP = 'prop';

const calculateFilterItem = (
  pointer: number,
  filter: ResourceFilter,
  filterValues: Object,
): { pointer: number; value: ResourceFilterValue } => {
  if (filter.filterType === 'AND') {
    const and: AndFilter = filter;
    const values = [];
    let pointerIndex = pointer;
    and.items.forEach(item => {
      const res = calculateFilterItem(pointerIndex, item, filterValues);
      pointerIndex = pointerIndex + res.pointer;
      values.push(res.value);
    });
    return {
      pointer: pointerIndex,
      value: { filterType: 'AND', items: values },
    };
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    const values = [];
    let pointerIndex = pointer;
    or.items.forEach(item => {
      const res = calculateFilterItem(pointerIndex, item, filterValues);
      pointerIndex = pointerIndex + res.pointer;
      values.push(res.value);
    });
    return {
      pointer: pointerIndex,
      value: { filterType: 'AND', items: values },
    };
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    const propFilter: PropertyFilter = filter;
    if (propFilter.filterRule.filterRuleType === 'TEXT_CONTAINS') {
      const textContains: TextContainsFilterRule = propFilter.filterRule;
      // return {
      //   pointer: pointer + 1,
      //   value: { ...textContains, ...{ filterRuleValue: filterValues[PROP + pointer] } },
      // };
      return {
        pointer: pointer + 1,
        value: {
          ...propFilter,
          filterRule: { ...textContains, ...{ terms: filterValues[PROP + pointer] } },
        },
      };
    }
    // export type PropertyFilterValue = {
    //   filterType: 'PROPERTY_FILTER';
    //   property: PropertyFilterTarget;
    //   filterRuleValue: FilterRuleValue;
    // };
  }
  throw new Error('to be implemented here2.....' + filter);
};

const calculateFilterCount = (count: number, filter: ResourceFilter): number => {
  if (filter.filterType === 'AND') {
    const and: AndFilter = filter;
    return and.items.reduce((acc, current) => acc + calculateFilterCount(0, current), 0);
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    return or.items.reduce((acc, current) => acc + calculateFilterCount(0, current), 0);
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    const propFlter: PropertyFilter = filter;
    return 1;
  }
  throw new Error('to be implemented here.....' + filter);
};

export const useChangingCalculatedValueState = (props, ruleDefinition: ParameterDefinition, target: ParameterTarget): ValueInState => {
  const dispatch = useAppDispatch();
  const [previousResult, setPreviousResult] = useState(initialFilter);
  const result = useCalculatedValueState(props, ruleDefinition.definition);
  const [changing, setChanging] = useState(initialFilter);
  console.log('filteraaa.......other', ruleDefinition, result, previousResult);
  useEffect(() => {
    console.log('filter.......5', previousResult, result, valHasChanged(previousResult, result));
    if (!valHasChanged(previousResult, result)) {
      return;
    }
    // pkeys.forEach(paramKey => {
    console.log('filterbbb.......changed', result);
    setPreviousResult(result);
    setChanging(result);

    dispatch(
      setInCorrectState({
        destinationKey: ruleDefinition.parameterKey,
        localContextPath: props.localContextPath,
        target,
        childPath: props.path,
        value: result,
      }),
    );
    // });
  }, [result]);

  return changing;
};

const valHasChanged = (previous, result): boolean => {
  if (!previous && result) {
    return true;
  } else if (!previous && !result) {
    return false;
  } else if (previous && !result) {
    return true;
  }
  return JSON.stringify(previous) !== JSON.stringify(result);
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

  const outputKey = props.params.outputParameterKey;
  if (!outputKey) {
    return (
      <span>
        <i>outputParameterKey param is mandatory in SmInput</i>
      </span>
    );
  }

  const defaultValueKey: RuleDefinition = props.params.defaultValue;
  const defaultValue: ValueInState = defaultValueKey ? useCalculatedValueState(props, defaultValueKey) : { loading: false };
  const [value, setValue] = useState(defaultValue);
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);

  // const defaultValue: RuleDefinition = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY];

  useEffect(() => {
    if (defaultValue) {
      dispatch(
        setInLocalState({
          localContextPath: props.localContextPath,
          parameterKey: props.params.outputParameterKey,
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
        parameterKey: props.params.outputParameterKey,
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

export const SmAttRef = (props: AttRefProps) => {
  const dispatch = useAppDispatch();
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);

  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmAttRef</i>
      </span>
    );
  }

  const { resourceId, campaignId, attConfig } = props.params;

  if (!resourceId || !campaignId || !attConfig) {
    return displayWarning(resourceId, campaignId, attConfig);
  }

  const builtPath = buildPath(props);
  const attribute = useAppSelector((state: RenderingSliceState) => {
    const aaa = state.rendering.componentsState[builtPath];
    return aaa ? (aaa.attribute ? aaa.attribute : null) : null;
  });

  const resourceIdVal: ValueInState = useCalculatedValueState(props, resourceId);
  const campaignIdVal: ValueInState = useCalculatedValueState(props, campaignId);
  const attConfigVal: ValueInState = useCalculatedValueState(props, attConfig);

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
        <i>{'resourceId'} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!campaignId) {
    return (
      <span>
        <i>{'campaignId'} is mandatory in SmAttRef</i>
      </span>
    );
  } else if (!attConfig) {
    return (
      <span>
        <i>{'attConfig'} is mandatory in SmAttRef</i>
      </span>
    );
  }
};

export const PATH_SEPARATOR = '/';
export const ROOT_PATH_SEPARATOR = '/';

export const hidden = () => {
  return <span>Hidden...</span>;
};
export const MyVerticalPanel = props => {
  // const shouldDisplay = useShouldDisplay(props);
  // if (!shouldDisplay) return hidden();

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
export const SmDisplayer = props => {
  console.log('SmDisplayer', props.params);
  const shouldDisplay = useShouldDisplay(props.params);

  if (!shouldDisplay) return hidden();

  // const renderItems = items =>
  //   items.map((item, index) => (
  //     <MyElem
  //       key={index}
  //       depth={increment(props.depth)}
  //       input={{ ...item }}
  //       currentPath={props.currentPath + PATH_SEPARATOR + props.path}
  //       form={props.form}
  //       localContextPath={props.localContextPath}
  //     ></MyElem>
  //   ));

  return (
    <MyElem
      depth={increment(props.depth)}
      input={{ ...props.wrapped }}
      currentPath={props.currentPath + PATH_SEPARATOR + props.path}
      form={props.form}
      localContextPath={props.localContextPath}
    ></MyElem>
  );
};

// export const MyInput = props => {
//   const [value, setValue] = useState(props.value);
//   const dispatch = useAppDispatch();
//   // console.log('bbbb', props.path);
//   // dispatch(tata());
//   const builtPath = buildPath(props);
//   const rendering = useAppSelector((state: Rendering) => state.rendering.renderingState[builtPath]);

//   const handleChange = event => {
//     setValue(event.target.value);
//     dispatch(
//       setInRenderingStateOutputs({
//         path: builtPath,
//         value: {
//           [OUTPUT_KEY]: event.target.value,
//         },
//       }),
//     );

//     dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));

//     // setRendering(event.target.value);
//     // dispatch(setStateForPath({ path: props.path, value: event.target.value }));
//   };
//   useEffect(() => {
//     // dispatch(setRenderingForPath({ path: props.path, value: props.value }));
//     // if (setRendering) {
//     //   setRendering(props.value);
//     // }
//     // dispatch(setStateForPath({ path: props.path, value: props.value }));
//   }, []);

//   return (
//     <div>
//       <input value={value} onChange={handleChange}></input>
//       {props.path}
//     </div>
//   );
// };

export const MyElem = props => {
  if (props.input && props.input.display) {
    console.log('MyElem ----Display', props.input);
  }
  // const shouldDisplay = useShouldDisplay(props.input);

  const renderSwitch = params => {
    // if (!shouldDisplay) {
    //   return;
    //   // <MyWrapper {...{ ...props.input, currentPath: props.currentPath, depth: props.depth, localContextPath: props.localContextPath }}>
    //   <Col md={props.col ?? 12}>Hidden</Col>;
    //   // </MyWrapper>;
    // }

    switch (params.componentType) {
      // case 'textBasic':
      //   return <TextBasic {...params}></TextBasic>;
      case 'SmText':
        return <SmText {...params}></SmText>;
      case 'SmInput':
        return <SmInput {...params}></SmInput>;
      case 'SmRefToResource':
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
      // case 'input':
      //   return <MyInput {...params}></MyInput>;
      case 'siteList':
        return <TheSiteList {...params}></TheSiteList>;
      case 'dataSetTable':
        return <DataSet {...params}></DataSet>;
      case 'Form':
        return <SmForm {...params}></SmForm>;
      case 'AttributeField':
        return <SmAttributeField {...params}></SmAttributeField>;
      case 'page':
        return <SmPage {...params}></SmPage>;
      case 'menu':
        return <SmMenu {...params}></SmMenu>;
      case 'displayer':
        return <SmDisplayer {...params}></SmDisplayer>;
      case 'layoutElement':
        return <SmLayoutElement {...params}></SmLayoutElement>;
      // case 'resourceContent':
      //   return <ZZZResourceContent {...params}></ZZZResourceContent>;
      case 'verticalPanel':
        return <MyVerticalPanel {...params}></MyVerticalPanel>;
      default:
        return <p>Not implemented...{params.componentType}</p>;
    }
  };
  if (props.input && props.input.display) {
    const shouldDisplay = useShouldDisplay(props.input);

    if (!shouldDisplay) return;
  }

  return (
    <MyWrapper
      {...{
        ...props.input,
        currentPath: props.currentPath,
        depth: props.depth,
        localContextPath: props.localContextPath,
      }}
      key={props.currentPath}
    >
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

  const targetLocalContextPath = calculateTargetLocalContextPath(true, props);

  const lc = useRefToLocalContext(targetLocalContextPath);

  const displayPath = true;
  // const shouldDisplay = useShouldDisplay(props);
  // if (!shouldDisplay) {
  //   console.log('evaluateShouldDisplay-----------', props.componentType, shouldDisplay);
  // } else {
  //   console.log('evaluateShouldDisplay', props.componentType, shouldDisplay);
  // }

  if (displayPath) {
    // <pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre>;

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
          {props.componentType === 'layoutElement' || props.componentType === 'SmRefToResource' ? (
            <div>
              <b>LocalContext: {targetLocalContextPath}</b>
              <pre>{JSON.stringify(lc ? lc : {}, null, 2)}</pre>
            </div>
          ) : (
            ''
          )}
        </Col>
        {children}
      </Col>
    );
  }
  // if (!shouldDisplay) {
  //   return (
  //     <Col md={props.col ?? 12} className={cn}>
  //       Hidden
  //     </Col>
  //   );
  // }

  return (
    <Col md={props.col ?? 12} className={cn}>
      {children}
    </Col>
  );
};

const hasChanged = (previous?: ValueInState, next?: ValueInState) => {
  if (!previous) {
    return !!next;
  }
  if (!next) {
    return true;
  }
  return (
    previous.error !== next.error || previous.loading !== next.loading || previous.value !== next.value || previous.usedId !== next.usedId
  );
};

const useShouldDisplay = (props): boolean => {
  const display = props.display;
  const [previous, setPrevious] = useState(null);
  if (display && display.valueExists) {
    const valueExists: ValueInState = useCalculatedValueState(props, display.valueExists);
    const [shouldDisplay, setShouldDisplay] = useState(null);
    useEffect(() => {
      if (valueExists && hasChanged(previous, valueExists)) {
        setShouldDisplay(evaluateValueExistsShouldDisplay(valueExists));
        setPrevious(valueExists);
      }
    }, [valueExists]);
    return shouldDisplay;
  } else if (display && display.valueDoesNotExist) {
    const valueDoesNotExist: ValueInState = useCalculatedValueState(props, display.valueDoesNotExist);
    const [shouldDisplay, setShouldDisplay] = useState(null);
    useEffect(() => {
      if (valueDoesNotExist && hasChanged(previous, valueDoesNotExist)) {
        setShouldDisplay(evaluateValueDoesNotExistShouldDisplay(valueDoesNotExist));
        setPrevious(valueDoesNotExist);
      }
    }, [valueDoesNotExist]);
    return shouldDisplay;
  }
};

const evaluateValueExistsShouldDisplay = valueExists => {
  if (valueExists) {
    if (valueExists.loading) {
      return false;
    } else if (valueExists.error) {
      return false;
    } else {
      return !!valueExists.value;
    }
  }
  return true;
};
const evaluateValueDoesNotExistShouldDisplay = valueDoesNotExist => {
  if (valueDoesNotExist) {
    if (valueDoesNotExist) {
      if (valueDoesNotExist.loading) {
        return false;
      } else if (valueDoesNotExist.error) {
        return false;
      } else {
        return !valueDoesNotExist.value;
      }
    }
  }
  return true;
};
