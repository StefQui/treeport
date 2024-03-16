import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import {
  searchResources,
  setAction,
  setAnyInCorrectState,
  setInLocalState,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import {
  ActionState,
  applyPath,
  AttributeColumnDefinition,
  buildPath,
  ColumnDefinition,
  DatasetDefinition,
  DataSetParams,
  PaginationState,
  ParameterTarget,
  RefreshDataSetAction,
  RefToContextRuleDefinition,
  // ENTITY_KEY,
  RenderingSliceState,
  ResourceFilter,
  RuleDefinition,
  SetCurrentPageAction,
  UpdateAttributeAction,
  useCalculatedValueState,
  useFoundValue,
  ValueInState,
} from './rendering';
import { handleParameterDefinitions } from './resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { IAttributeValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import { useChangingCalculatedFilterState } from './filter';

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

export const handleDataSet = (key: string, target: ParameterTarget, refToSiteDefinition: DatasetDefinition, props) => {
  const dispatch = useAppDispatch();
  const filter = useCalculatedValueState(props, refToSiteDefinition.filter);
  const initialPaginationState = refToSiteDefinition.initialPaginationState;
  const setCurrentPageAction = useSetCurrentPageAction(props, initialPaginationState);
  const refreshDatasetAction = useRefreshDatasetAction(props);

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

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

  const columnDefinitions = props.params.columnDefinitions;

  const builtPath = buildPath(props);

  handleParameterDefinitions(props.params, props);

  const data: RuleDefinition = props.params.data;

  const siteListProp = useSiteList(props, data);

  const paginationProp = usePaginationProp(props, data);

  const siteList: IResourceWithValue[] = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.entities : null;

  const loading = useAppSelector((state: RenderingSliceState) =>
    state.rendering.componentsState[builtPath] &&
    state.rendering.componentsState[builtPath].self &&
    state.rendering.componentsState[builtPath].self.listState
      ? state.rendering.componentsState[builtPath].self.listState.loading
      : false,
  );

  const totalItems = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.totalItems : null;
  // console.log(
  //   'totalItems',
  //   totalItems,
  //   paginationProp ? paginationProp.activePage : '---',
  //   paginationProp ? paginationProp.itemsPerPage : '-----',
  // );

  const activePage = paginationProp ? paginationProp.activePage : 1;

  useEffect(() => {
    console.log('useEffect1111', paginationProp);
    if (!paginationProp) {
      return;
    }
    dispatch(setInRenderingStateSelf({ path: builtPath }));
  }, []);

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
    const action: SetCurrentPageAction = {
      source: builtPath,
      actionType: 'setCurrentPage',
      currentPage,
      targetDataset: refToContextRuleDefinition.sourceParameterKey,
    };

    dispatch(setAction(action));
  };

  const handleSyncList = () => {
    const action: RefreshDataSetAction = {
      source: builtPath,
      actionType: 'refreshDataset',
      timestamp: new Date(),
      targetDataset: refToContextRuleDefinition.sourceParameterKey,
    };

    dispatch(setAction(action));
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
