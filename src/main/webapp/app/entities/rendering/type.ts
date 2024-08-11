import { IAttributeWithValue } from 'app/shared/model/attribute.model';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { MainTarget, SecondaryTarget } from './rendering.reducer';

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

export type SmAgGridResourceContent = CommonContent & {
  componentType: 'SmAgGrid';
  params: TextParams;
};

export type DataSetTableType = 'dataSetTable';
export type DataSetResourceContent = CommonContent & {
  componentType: DataSetTableType;
  params: DataSetParams;
};

export type DataSetListType = 'dataSetList';
export type DataSetListResourceContent = CommonContent & {
  componentType: DataSetListType;
  params: DataSetListParams;
};

export type DataSetTreeType = 'dataSetTree';
export type DataSetTreeResourceContent = CommonContent & {
  componentType: DataSetTreeType;
  params: DataSetTreeParams;
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
  | SmAgGridResourceContent
  | DataSetResourceContent
  | DataSetListResourceContent
  | DataSetTreeResourceContent
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

export type TargetInfo = { mainTarget: MainTarget; secondaryTarget: SecondaryTarget };

export type SearchResourceRequestModel = { searchModel: ResourceSearchModel; orgaId: string } & TargetInfo;
export type FetchSiteRequestModel = { siteId: string } & TargetInfo;

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

export type RuleType = 'constant' | 'refToLocalContext' | 'refToPageContext' | 'refToSite' | 'dataset' | 'itemParamProperty' | 'datatree';
export type TransformTo = 'site';
export type ConstantRuleDefinition = { ruleType: 'constant'; constValue: any };
export type RefToSiteDefinition = { ruleType: 'refToSite'; sourceSiteId: RuleDefinition };
export type DatasetDefinition = {
  ruleType: 'dataset';
  columnDefinitions: ColumnDefinition[];
  // filter: RuleDefinition;
  initialPaginationState: PaginationState;
  valueFilter: ResourceFilter;
};
export type DatatreeDefinition = {
  ruleType: 'datatree';
  columnDefinitions: ColumnDefinition[];
  // filter: RuleDefinition;
  initialPaginationState: PaginationState;
  valueFilter: ResourceFilter;
};
export type PaginationState = {
  activePage: number;
  itemsPerPage: number;
  sort: string;
  order: string;
};

export type PropertyDefinition = IdPropertyDefinition | NamePropertyDefinition | ParentIdPropertyDefinition | AttributePropertyDefinition;

export type IdPropertyDefinition = {
  type: 'ID';
};

export type NamePropertyDefinition = {
  type: 'NAME';
};

export type ParentIdPropertyDefinition = {
  type: 'PARENT_ID';
};

export type AttributePropertyDefinition = {
  type: 'ATTRIBUTE';
  attributeConfigId: string;
  campaignId: string;
};
// export type DatasetFilterRuleDefinition = { ruleType: 'datasetFilter'; valueFilter: ResourceFilter };
export type PaginationStateRuleDefinition = { ruleType: 'paginationState'; initialValue: PaginationState };
export type ItemParamPropertyRuleDefinition = {
  ruleType: 'itemParamProperty';
  propertyDefinition: PropertyDefinition;
};
export type RefToLocalContextRuleDefinition = {
  ruleType: 'refToLocalContext';
  path: string;
  sourceParameterKey: string;
  sourceParameterProperty?: string;
  // transformTo?: TransformTo;
  // siteIdSourceParameterKey?: string; // if transformTo is 'site'
  // siteIdSourceParameterProperty?: string; // if transformTo is 'site'
};
export type RefToPageContextRuleDefinition = {
  ruleType: 'refToPageContext';
  path: string;
  sourceParameterKey: string;
  sourceParameterProperty?: string;
  // transformTo?: TransformTo;
  // siteIdSourceParameterKey?: string; // if transformTo is 'site'
  // siteIdSourceParameterProperty?: string; // if transformTo is 'site'
};
export type RuleDefinition =
  | RefToLocalContextRuleDefinition
  | RefToPageContextRuleDefinition
  | ConstantRuleDefinition
  | RefToSiteDefinition
  | DatasetDefinition
  | DatatreeDefinition
  | ItemParamPropertyRuleDefinition
  | PaginationStateRuleDefinition;

export type CurrentLocalContextPathTarget = {
  parameterKey: string;
  targetType: 'currentLocalContextPath';
};

export type ChildLocalContextPathTarget = {
  parameterKey: string;
  targetType: 'childLocalContextPath';
};

export type PageContextPathTarget = {
  parameterKey: string;
  targetType: 'pageContextPath';
};

export type SpecificLocalContextPathTarget = {
  parameterKey: string;
  targetType: 'specificLocalContextPath';
  targetPath: string;
};

export type ParameterTarget =
  | CurrentLocalContextPathTarget
  | ChildLocalContextPathTarget
  | PageContextPathTarget
  | SpecificLocalContextPathTarget;

export type ParameterDefinition = {
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
  selectedSiteKeyInLocalContext?: string;
};

export type DataSetListParams = {
  data: RuleDefinition;
  resourceIdForDetail?: string;
};

export type DataSetTreeParams = {
  data: RuleDefinition;
  resourceIdForDetail?: string;
};

export type ResourcePropertyFilterTargetType = 'name' | 'id' | 'parentId';

export type ResourcePropertyFilterTarget = {
  filterPropertyType: 'RESOURCE_PROPERTY';
  property: ResourcePropertyFilterTargetType;
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
  filter?: ResourceFilterValue;
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
  itemParam?: IResourceWithValue;
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
export type ActionState = SetCurrentPageAction | UpdateAttributeAction | RefreshDataSetAction | OpenNodeAction | CloseNodeAction;
// export type EntityAction = {
//   source: string;
//   actionType: 'selectSite' | 'updateAttribute' | 'refreshDataset';
//   entity: { entityType: 'SITE' | 'RESOURCE' | 'ATTRIBUTES'; entity?: any; entityIds?: any };
// } | null;
export type SetCurrentPageAction = {
  source: string;
  actionType: 'setCurrentPage';
  currentPage: number;
  targetDataset: string;
} | null;
export type OpenNodeAction = {
  source: string;
  actionType: 'openNode';
  treeNodePath: string[];
  forced: boolean;
  childrenAreLoaded: boolean;
  targetDataset: string;
} | null;
export type CloseNodeAction = {
  source: string;
  actionType: 'closeNode';
  treeNodePath: string[];
  targetDataset: string;
} | null;
export type UpdateAttributeAction = {
  source: string;
  actionType: 'updateAttribute';
  timestamp: Date;
  entity: { entityType: 'SITE' | 'RESOURCE' | 'ATTRIBUTES'; entity?: any; entityIds?: any };
} | null;
export type RefreshDataSetAction = {
  source: string;
  actionType: 'refreshDataset';
  timestamp: Date;
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
