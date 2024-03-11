import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import {
  getSites,
  searchResources,
  setAction,
  setActivePage,
  setAnyInCorrectState,
  setInCorrectState,
  setInLocalState,
  setInRenderingStateOutputs,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import {
  ActionState,
  AndFilter,
  applyPath,
  AttributeColumnDefinition,
  buildPath,
  ColumnDefinition,
  ColumnDefinitions,
  DatasetDefinition,
  DataSetParams,
  OrFilter,
  PaginationState,
  ParameterTarget,
  PropertyFilter,
  RefreshDataSetAction,
  RefToContextRuleDefinition,
  // ENTITY_KEY,
  RenderingSliceState,
  ResourceFilter,
  ResourceFilterValue,
  RuleDefinition,
  SetCurrentPageAction,
  SiteListParams,
  TextContainsFilterRule,
  UpdateAttributeAction,
  useCalculatedValueState,
  useFoundValue,
  ValueInState,
} from './rendering';
import { handleParameterDefinitions } from './resource-content';
import { isError, isLoading } from './render-resource-page';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { IAttributeValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';

export const useSiteList = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [siteList, setSiteList] = useState(null);
  useEffect(() => {
    // console.log('siteListProp has changed', siteListProp);
    if (dataProp && dataProp.listState) {
      setSiteList(dataProp.listState);
    }
  }, [dataProp]);
  return siteList;
};

export const usePaginationProp = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [pagination, setPagination] = useState(null);
  useEffect(() => {
    // console.log('siteListProp has changed', siteListProp);
    if (dataProp && dataProp.paginationState) {
      setPagination(dataProp.paginationState);
    }
  }, [dataProp]);
  return pagination;
};

const useSetCurrentPageAction = (props, initialValue: PaginationState | string | number) => {
  const [val, setVal] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'setCurrentPage') {
      const action1: SetCurrentPageAction = action;
      console.log('action1', action1, val);
      setVal(action1.currentPage);
    }
  }, [action]);

  return val;
};

const useRefreshDatasetAction = props => {
  const [val, setVal] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'refreshDataset') {
      setVal((action as RefreshDataSetAction).timestamp);
    } else if (action && action.actionType === 'updateAttribute') {
      setVal((action as UpdateAttributeAction).timestamp);
    }
  }, [action]);

  return val;
};

const setPaginationTo = (pagination: PaginationState, props, key, dispatch) => {
  dispatch(
    setAnyInCorrectState({
      localContextPath: props.localContextPath,
      destinationKey: key,
      targetType: 'currentLocalContextPath',
      value: pagination,
      additionnalPath: 'paginationState',
    }),
  );
};

export const useChangingCalculatedFilterState = (props, filter: ResourceFilter, target: ParameterTarget): ValueInState => {
  // console.log('filterbbb.......changed', result);

  const initialResult = { loading: false };
  const filterValues = useChangedFilterValues(filter, props);
  // console.log('calculateFilter', calculateFilter(dsfDef.valueFilter, {}));
  const [result, setResult] = useState({ loading: true });
  useEffect(() => {
    setResult(calculateFilter(filter, filterValues));
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

const calculateFilter = (filter: ResourceFilter, filterValues: Object): ValueInState => {
  const filterCount = calculateFilterCount(0, filter);
  console.log('calculateInitialFilter.......', filter, filterCount, filterValues);
  const values = Object.values(filterValues);
  if (values.length !== filterCount || values.findIndex(val => val && !!val.loading) !== -1) {
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
          filterRule: { ...textContains, ...{ terms: filterValues[PROP + pointer] ?? '' } },
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

export const handleDataSet = (key: string, target: ParameterTarget, refToSiteDefinition: DatasetDefinition, props) => {
  const dispatch = useAppDispatch();
  const filter = useCalculatedValueState(props, refToSiteDefinition.filter);
  const initialPaginationState = refToSiteDefinition.initialPaginationState;
  const setCurrentPageAction = useSetCurrentPageAction(props, initialPaginationState);
  const refreshDatasetAction = useRefreshDatasetAction(props);

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;
  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);
  // const changing = useChangingCalculatedValueState(props, pdef, target);
  // useEffect(() => {
  //   console.log('filter.......changed2');
  //   dispatch(
  //     setInCorrectState({
  //       destinationKey: pdef.parameterKey,
  //       localContextPath: props.localContextPath,
  //       target,
  //       childPath: props.path,
  //       value: changingFilter,
  //     }),
  //   );
  //   // });
  // }, [changingFilter]);

  // useEffect(() => {
  //   if (refreshDatasetAction) {
  //     console.log('refreshDatasetAction');
  //   }
  // }, [refreshDatasetAction]);

  useEffect(() => {
    if (setCurrentPageAction) {
      setPaginationTo({ ...paginationProp, activePage: setCurrentPageAction }, props, key, dispatch);
    }
  }, [setCurrentPageAction]);

  useEffect(() => {
    setPaginationTo(initialPaginationState, props, key, dispatch);
  }, []);

  console.log(
    'handleDataSet.......handleDataSet',
    props.localContextPath,
    applyPath(props.localContextPath, ''),
    refToSiteDefinition.filter,
  );

  // const activePage = useCalculatedValueState(props, refToSiteDefinition.paginationState);
  // const paginationState = useCalculatedValueState(props, refToSiteDefinition.paginationState);
  // const ps = {
  //   activePage: 1,
  //   itemsPerPage: 10,
  //   sort: 'id',
  //   order: 'asc',
  // };
  const [previousFilter, setPreviousFilter] = useState({ loading: true });

  const paginationProp = usePaginationProp(props, {
    ruleType: 'refToLocalContext',
    path: '',
    sourceParameterKey: key,
  });

  useEffect(() => {
    console.log('filter.......handleDataSet', changingFilter, refreshDatasetAction);
    if (!changingFilter || !changingFilter.value || changingFilter.value.loading || !paginationProp) {
      return;
    }
    // const ps = {
    //   activePage: 1,
    //   itemsPerPage: 10,
    //   sort: 'id',
    //   order: 'asc',
    // };
    // const ps = paginationState.value;

    dispatch(
      searchResources({
        searchModel: {
          resourceType: 'SITE',
          columnDefinitions: refToSiteDefinition.columnDefinitions,
          filter: changingFilter ? changingFilter.value : null,
          page: paginationProp.activePage - 1,
          size: paginationProp.itemsPerPage,
          sort: `${paginationProp.sort},${paginationProp.order}`,
        },
        orgaId: 'coca',
        destinationKey: key,
        localContextPath: props.localContextPath,
        target,
        childPath: props.path,
      }),
    );
  }, [paginationProp, changingFilter, refreshDatasetAction]);
};

export const generateLabel = (colDef: { attributeConfigId: string; campaignId: string }) => {
  return colDef.attributeConfigId + ':period:' + colDef.campaignId;
};

export const DataSet = (props: { params: DataSetParams; depth: string; currentPath: string; path: string; localContextPath: string }) => {
  const dispatch = useAppDispatch();

  // const initialState = {
  //   paginationState: {
  //     activePage: 1,
  //     itemsPerPage: 5,
  //     sort: 'id',
  //     order: 'asc',
  //   },
  //   listState: {
  //     loading: false,
  //     errorMessage: null,
  //     entities: [],
  //     entity: null,
  //     updating: false,
  //     totalItems: 0,
  //     updateSuccess: false,
  //   },
  // };
  const columnDefinitions = props.params.columnDefinitions;

  const builtPath = buildPath(props);
  // const paginationState = useAppSelector((state: RenderingSliceState) => {
  //   return state.rendering.componentsState[builtPath]
  //     ? state.rendering.componentsState[builtPath][STATE_RS_SELF_KEY].paginationState
  //     : null;
  // });
  // const paginationState = useAppSelector((state: RenderingSliceState) => {
  //   return state.rendering.componentsState[builtPath]
  //     ? state.rendering.componentsState[builtPath][STATE_RS_SELF_KEY].paginationState
  //     : null;
  // });

  handleParameterDefinitions(props.params, props);

  const data: RuleDefinition = props.params.data;

  // const paginationState = props.params.paginationState;

  // const siteListProp: ValueInState = useCalculatedValueState(props, data);
  const siteListProp = useSiteList(props, data);

  // console.log('12345', data, siteListProp, props.localContextPath);

  const paginationProp = usePaginationProp(props, data);
  // const paginationStateProp: ValueInState = useCalculatedValueState(props, paginationState);

  // if (!paginationStateProp) {
  //   return <span>Missing paginationState</span>;
  // }

  const siteList: IResourceWithValue[] = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.entities : null;
  // console.log('aaaazzzzzzzzzzzzzzzz', siteListProp, siteList);

  // const siteList = [];
  // const siteList = useAppSelector((state: RenderingSliceState) =>
  //   state.rendering.componentsState[builtPath] ? state.rendering.componentsState[builtPath][STATE_RS_SELF_KEY].listState.entities : null,
  // );

  const loading = useAppSelector((state: RenderingSliceState) =>
    state.rendering.componentsState[builtPath] &&
    state.rendering.componentsState[builtPath].self &&
    state.rendering.componentsState[builtPath].self.listState
      ? state.rendering.componentsState[builtPath].self.listState.loading
      : false,
  );

  const totalItems = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.totalItems : null;
  console.log(
    'totalItems',
    totalItems,
    paginationProp ? paginationProp.activePage : '---',
    paginationProp ? paginationProp.itemsPerPage : '-----',
  );
  // const totalItems = useAppSelector((state: RenderingSliceState) =>
  //   state.rendering.componentsState[builtPath] ? state.rendering.componentsState[builtPath][STATE_RS_SELF_KEY].listState.totalItems : null,
  // );

  // const activePage = useAppSelector((state: RenderingSliceState) =>
  //   state.rendering.componentsState[builtPath]
  //     ? state.rendering.componentsState[builtPath][STATE_RS_SELF_KEY].paginationState.activePage
  //     : null,
  // );

  const activePage = paginationProp ? paginationProp.activePage : 1;

  useEffect(() => {
    console.log('useEffect1111', paginationProp);
    if (!paginationProp) {
      return;
    }
    dispatch(setInRenderingStateSelf({ path: builtPath }));
    // console.log('vvvvvvvvvvvv', loading);
    if (!loading) {
      sortEntities();
    }
  }, []);

  useEffect(() => {
    // console.log('useEffect22', paginationState);
    // dispatch(setRenderingForPath({ path: props.path, value: initialState }));
    // console.log('tttttttttttt', loading);

    if (activePage && !loading) {
      sortEntities();
    }
  }, [activePage]);

  // const [paginationState, setPaginationState] = useState(
  //   {
  //     activePage: 0,
  //     itemsPerPage: 4,
  //     sort: 'id',
  //     order: 'asc',
  //   },
  //   // overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  // );

  // const siteList = useAppSelector(state => state.site.entities);
  // const loading = useAppSelector(state => state.site.loading);
  // const totalItems = useAppSelector(state => state.site.totalItems);

  // const doSearchResources = () => {
  // console.log('getAllSites', builtPath);
  // const rendering = useAppSelector(state => state.rendering.renderingState[props.refTo]);

  // const listState = getRenderingStateForPath(rendering, props.path);
  // console.log('getAllSites2', rendering);
  // const ps = paginationState ? paginationState : initialState.paginationState;
  // dispatch(
  //   searchResources({
  //     searchModel: {
  //       resourceType: 'SITE',
  //       columnDefinitions: props.params.columnDefinitions,
  //       filter: {
  //         filterType: 'AND',
  //         items: [
  //           // {
  //           //   filterType: 'PROPERTY_FILTER',
  //           //   property: {
  //           //     filterPropertyType: 'RESOURCE_PROPERTY',
  //           //     property: 'name',
  //           //   },
  //           //   filterRule: {
  //           //     filterRuleType: 'TEXT_EQUALS',
  //           //     terms: 'Site S1',
  //           //   },
  //           // },
  //           {
  //             filterType: 'PROPERTY_FILTER',
  //             property: {
  //               filterPropertyType: 'RESOURCE_PROPERTY',
  //               property: 'name',
  //             },
  //             filterRule: {
  //               filterRuleType: 'TEXT_CONTAINS',
  //               terms: '1',
  //             },
  //           },
  //           {
  //             filterType: 'PROPERTY_FILTER',
  //             property: {
  //               filterPropertyType: 'RESOURCE_ATTRIBUTE',
  //               attributeConfigId: 'toSite',
  //               campaignId: '2023',
  //             },
  //             filterRule: {
  //               filterRuleType: 'NUMBER_GT',
  //               compareValue: 30,
  //             },
  //           },
  //         ],
  //       },
  //       page: ps.activePage - 1,
  //       size: ps.itemsPerPage,
  //       sort: `${ps.sort},${ps.order}`,
  //     },
  //     orgaId: 'coca',
  //     path: builtPath,
  //   }),
  // );
  // setRs(listState);
  // };

  const sortEntities = () => {
    // console.log('sortEntities', builtPath);
    // doSearchResources();
    // const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    // if (pageLocation.search !== endURL) {
    //   navigate(`${pageLocation.pathname}${endURL}`);
    // }
  };
  // useEffect(() => {
  //   const params = new URLSearchParams(pageLocation.search);
  //   const page = params.get('page');
  //   const sort = params.get(SORT);
  //   if (page && sort) {
  //     const sortSplit = sort.split(',');
  //     setPaginationState({
  //       ...paginationState,
  //       activePage: +page,
  //       sort: sortSplit[0],
  //       order: sortSplit[1],
  //     });
  //   }
  // }, [pageLocation.search]);

  const sort = p => () => {
    // console.log('sort', builtPath);
    // const listState = getRenderingStateForPath(rendering, props.path);
    // setStateForPath({
    //   path: props.path,
    //   value: {
    //     ...listState,
    //     order: listState.order === ASC ? DESC : ASC,
    //     sort: p,
    //   },
    // });
    // setRs(listState);
    // setPaginationState({
    //   ...paginationState,
    //   order: paginationState.order === ASC ? DESC : ASC,
    //   sort: p,
    // });
  };

  const handleSelect = selected => () => {
    console.log('handleSelect', props.localContextPath, props.params.selectedSiteKeyInLocalContext, selected);
    // dispatch(setInLocalState({ localContextPath: props.localContextPath,       parameterKey: props.params[PARAMS_SITE_LIST_SELECTED_SITE_KEY],value: { value: { entityType: 'SITE', [ENTITY_KEY]: selected } , loading: false} }));
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params.selectedSiteKeyInLocalContext,
        value: { value: selected.id, loading: false },
      }),
    );
    dispatch(setAction({ source: builtPath, actionType: 'selectSite', entity: { entityType: 'SITE', entity: selected } }));
  };

  const refToContextRuleDefinition: RefToContextRuleDefinition = data as RefToContextRuleDefinition;

  const handlePagination = currentPage => {
    // console.log('handlePagination', currentPage);
    // setInLocalState({
    //   localContextPath: props.localContextPath,
    //   parameterKey: props.params.paginationState.sourceParameterKey,
    //   value: currentPage,
    // }),
    const action: SetCurrentPageAction = {
      source: builtPath,
      actionType: 'setCurrentPage',
      currentPage,
      targetDataset: refToContextRuleDefinition.sourceParameterKey,
    };

    dispatch(setAction(action));

    // dispatch(
    //   setAnyInCorrectState({
    //     localContextPath: props.localContextPath,
    //     destinationKey: refToContextRuleDefinition.sourceParameterKey,
    //     targetType: 'currentLocalContextPath',
    //     value: { ...paginationProp, activePage: currentPage },
    //     additionnalPath: 'paginationState',
    //   }),
    // );

    // dispatch(setActivePage({ path: builtPath, value: currentPage }));

    // const listState = getRenderingStateForPath(rendering, props.path);
    // setStateForPath({
    //   ...listState,
    //   activePage: currentPage,
    // });
    // setRs(listState);
  };

  // setPaginationState({
  //     ...paginationState,
  //     activePage: currentPage,
  //   });

  const handleSyncList = () => {
    const action: RefreshDataSetAction = {
      source: builtPath,
      actionType: 'refreshDataset',
      timestamp: new Date(),
      targetDataset: refToContextRuleDefinition.sourceParameterKey,
    };

    dispatch(setAction(action));
    // sortEntities();
  };

  const handleCancelSelection = () => {
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params.selectedSiteKeyInLocalContext,
        value: { value: null, loading: false },
      }),
    );
    // dispatch(setAction({ source: builtPath, actionType: 'selectSite', entity: { entityType: 'SITE', entity: selected } }));
  };

  const getSortIconByFieldName = (fieldName: string) => {
    // const renderingState = getRenderingStateForPath(rendering, props.path);
    const sortFieldName = paginationProp.sort;
    const order = paginationProp.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  const hasIDColumn = (columnDefinitions: ColumnDefinition[], colType: string) => {
    return columnDefinitions.find(colDef => colDef.columnType === colType);
  };

  const displayColumns = (columnDefinitions: ColumnDefinition[], site: IResourceWithValue) => {
    return columnDefinitions.map((colDef, i) => {
      const key = 'colkey' + i;
      if (colDef.columnType === 'ATTRIBUTE') {
        return displayAttributeColumn(colDef as AttributeColumnDefinition, site, key);
      } else if (colDef.columnType === 'ID') {
        return <td key={key}>{site.id}</td>;
      } else if (colDef.columnType === 'NAME') {
        return <td key={key}>{site.name}</td>;
      } else if (colDef.columnType === 'BUTTON') {
        return <td key={key}>Button...</td>;
      } else {
        return <td key={key}>?????</td>;
      }
    });
  };

  const displayAttributeColumn = (colDef: AttributeColumnDefinition, site: IResourceWithValue, key) => {
    if (!site.attributeValues) {
      return <td key={key}>-</td>;
    }
    const val: IAttributeValue = site.attributeValues[generateLabel(colDef)];
    if (!val) {
      return <td key={key}>--</td>;
    }
    if (val.attributeValueType === 'BOOLEAN_VT') {
      return <td key={key}>{renderBoolean(val as IBooleanValue)}</td>;
    } else if (val.attributeValueType === 'DOUBLE_VT') {
      return <td key={key}>{renderDouble(val as IDoubleValue)}</td>;
    }
    return <td key={key}>To implem... {val.attributeValueType}</td>;
  };

  const renderBoolean = (val: IBooleanValue) => {
    if (val.value === undefined || val.value === null) {
      return '---';
    } else if (!!val.value) {
      return 'True';
    } else {
      return 'False';
    }
  };

  const renderDouble = (val: IDoubleValue) => {
    if (!val.value) {
      return '---';
    } else {
      return val.value;
    }
  };

  const displayColumnHeaders = (columnDefinitions: ColumnDefinition[]) => {
    return columnDefinitions.map((colDef, i) => {
      return displayAttributeColumnHeader(colDef as AttributeColumnDefinition, i);
    });
  };

  const displayAttributeColumnHeader = (colDef: AttributeColumnDefinition, i) => {
    const key = 'header' + i;
    if (colDef.columnType === 'ATTRIBUTE') {
      return <th key={key}>{generateLabel(colDef)}</th>;
    } else if (colDef.columnType === 'ID') {
      return <th key={key}>Id</th>;
    } else if (colDef.columnType === 'NAME') {
      return <th key={key}>Name</th>;
    } else if (colDef.columnType === 'BUTTON') {
      return <td key={key}>Button...</td>;
    } else {
      return <td key={key}>?????</td>;
    }
  };

  return (
    <div>
      {paginationProp && siteList ? (
        <div>
          <h2 id="site-heading" data-cy="SiteHeading">
            DataSet
            <div className="d-flex justify-content-end">
              <Button className="me-2" color="info" onClick={handleCancelSelection} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} /> Cancel selection
              </Button>
              <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                <Translate contentKey="treeportApp.site.home.refreshListLabel">Refresh List</Translate>
              </Button>
              <Link to="/site/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
                <FontAwesomeIcon icon="plus" />
                &nbsp;
                <Translate contentKey="treeportApp.site.home.createLabel">Create new Site</Translate>
              </Link>
            </div>
          </h2>
          <div className="table-responsive">
            {siteList && siteList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    {displayColumnHeaders(columnDefinitions)}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {siteList.map((site, i) => (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      {displayColumns(columnDefinitions, site)}
                      <td className="text-end">
                        <div className="btn-group flex-btn-group-container">
                          <Button onClick={handleSelect(site)} color="info" size="sm" data-cy="entitySelectButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.select">Select</Translate>
                            </span>
                          </Button>
                          <Button tag={Link} to={`/coca/render/rpage2?sid=${site.id}`} color="info" size="sm" data-cy="entitySelectButton">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open </span>
                          </Button>
                          <Button tag={Link} to={`/site/${site.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/site/${site.id}/edit?page=${paginationProp.activePage}&sort=${paginationProp.sort},${paginationProp.order}`}
                            color="primary"
                            size="sm"
                            data-cy="entityEditButton"
                          >
                            <FontAwesomeIcon icon="pencil-alt" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.edit">Edit</Translate>
                            </span>
                          </Button>
                          <Button
                            onClick={() =>
                              (location.href = `/site/${site.id}/delete?page=${paginationProp.activePage}&sort=${paginationProp.sort},${paginationProp.order}`)
                            }
                            color="danger"
                            size="sm"
                            data-cy="entityDeleteButton"
                          >
                            <FontAwesomeIcon icon="trash" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">Delete</Translate>
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              !loading && (
                <div className="alert alert-warning">
                  <Translate contentKey="treeportApp.site.home.notFound">No Sites found</Translate>
                </div>
              )
            )}
          </div>
          {totalItems ? (
            <div className={siteList && siteList.length > 0 ? '' : 'd-none'}>
              <div className="justify-content-center d-flex">
                <JhiItemCount page={paginationProp.activePage} total={totalItems} itemsPerPage={paginationProp.itemsPerPage} i18nEnabled />
              </div>
              <div className="justify-content-center d-flex">
                <JhiPagination
                  activePage={paginationProp.activePage}
                  onSelect={handlePagination}
                  maxButtons={5}
                  itemsPerPage={paginationProp.itemsPerPage}
                  totalItems={totalItems}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div>No list state yet</div>
      )}
    </div>
  );
};
