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
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { IAttributeValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import { useChangingCalculatedFilterState } from './filter';
import { handleParameterDefinitions } from './parameter-definition';
import { useFoundValue, useCalculatedValueState, applyPath, buildPath } from './shared';
import {
  PaginationState,
  ActionState,
  RenderingSliceState,
  SetCurrentPageAction,
  RefreshDataSetAction,
  UpdateAttributeAction,
  ParameterTarget,
  DatasetDefinition,
  ResourceFilter,
  ValueInState,
  DataSetParams,
  RuleDefinition,
  ColumnDefinition,
  AttributeColumnDefinition,
  RefToLocalContextRuleDefinition,
} from './type';
import { useResourceList } from './dataset';

export const usePaginationProp = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [pagination, setPagination] = useState(null);
  useEffect(() => {
    // console.log('resourceListProp has changed', resourceListProp);
    if (dataProp && dataProp.paginationState) {
      setPagination(dataProp.paginationState);
    }
  }, [dataProp]);
  return pagination;
};

export const generateLabel = (colDef: { attributeConfigId: string; campaignId: string }) => {
  return colDef.attributeConfigId + ':period:' + colDef.campaignId;
};

export const SmDatasetTable = (props: {
  params: DataSetParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();

  const columnDefinitions = props.params.columnDefinitions;

  const builtPath = buildPath(props);

  handleParameterDefinitions(props.params, props);

  const data: RuleDefinition = props.params.data;

  const resourceListProp = useResourceList(props, data);

  const paginationProp = usePaginationProp(props, data);

  const resourceList: IResourceWithValue[] =
    resourceListProp && !resourceListProp.loading && resourceListProp.value ? resourceListProp.value.entities : null;

  const loading = useAppSelector((state: RenderingSliceState) =>
    state.rendering.componentsState[builtPath] &&
    state.rendering.componentsState[builtPath].self &&
    state.rendering.componentsState[builtPath].self.listState
      ? state.rendering.componentsState[builtPath].self.listState.loading
      : false,
  );

  const totalItems = resourceListProp && !resourceListProp.loading && resourceListProp.value ? resourceListProp.value.totalItems : null;
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
    console.log('handleSelect', props.localContextPath, props.params.selectedResourceKeyInLocalContext, selected);
    // dispatch(setInLocalState({ localContextPath: props.localContextPath,       parameterKey: props.params[PARAMS_SITE_LIST_SELECTED_SITE_KEY],value: { value: { entityType: 'SITE', [ENTITY_KEY]: selected } , loading: false} }));
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params.selectedResourceKeyInLocalContext,
        value: { value: selected.id, loading: false },
      }),
    );
    dispatch(
      setAction({
        source: builtPath,
        actionType: 'selectResource',
        entity: { entityType: 'SITE', entity: selected },
        timestamp: new Date(),
      }),
    );
  };

  const refToContextRuleDefinition: RefToLocalContextRuleDefinition = data as RefToLocalContextRuleDefinition;

  const handlePagination = currentPage => {
    const action: SetCurrentPageAction = {
      source: builtPath,
      actionType: 'setCurrentPage',
      currentPage,
      targetDataset: refToContextRuleDefinition.sourceParameterKey,
    };

    dispatch(setAction({ ...action, timestamp: new Date() }));
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
        parameterKey: props.params.selectedResourceKeyInLocalContext,
        value: { value: null, loading: false },
      }),
    );
    // dispatch(setAction({ source: builtPath, actionType: 'selectResource', entity: { entityType: 'SITE', entity: selected } }));
  };

  return (
    <div>
      {paginationProp && resourceList ? (
        <div>
          <h2 id="resource-heading" data-cy="ResourceHeading">
            DataSet
            <div className="d-flex justify-content-end">
              <Button className="me-2" color="info" onClick={handleCancelSelection} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} /> Cancel selection
              </Button>
              <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                <Translate contentKey="treeportApp.resource.home.refreshListLabel">Refresh List</Translate>
              </Button>
              <Link to="/resource/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
                <FontAwesomeIcon icon="plus" />
                &nbsp;
                <Translate contentKey="treeportApp.resource.home.createLabel">Create new Resource</Translate>
              </Link>
            </div>
          </h2>
          <div className="table-responsive">
            {resourceList && resourceList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    {displayColumnHeaders(columnDefinitions)}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {resourceList.map((resource, i) => (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      {displayColumns(columnDefinitions, resource)}
                      <td className="text-end">
                        <div className="btn-group flex-btn-group-container">
                          <Button onClick={handleSelect(resource)} color="info" size="sm" data-cy="entitySelectButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.select">Select</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/coca/render/rpage2?sid=${resource.id}`}
                            color="info"
                            size="sm"
                            data-cy="entitySelectButton"
                          >
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open </span>
                          </Button>
                          <Button tag={Link} to={`/resource/${resource.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/resource/${resource.id}/edit?page=${paginationProp.activePage}&sort=${paginationProp.sort},${paginationProp.order}`}
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
                              (location.href = `/resource/${resource.id}/delete?page=${paginationProp.activePage}&sort=${paginationProp.sort},${paginationProp.order}`)
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
                  <Translate contentKey="treeportApp.resource.home.notFound">No Resources found</Translate>
                </div>
              )
            )}
          </div>
          {totalItems ? (
            <div className={resourceList && resourceList.length > 0 ? '' : 'd-none'}>
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
const displayColumns = (columnDefinitions: ColumnDefinition[], resource: IResourceWithValue) => {
  return columnDefinitions.map((colDef, i) => {
    const key = 'colkey' + i;
    if (colDef.columnType === 'ATTRIBUTE') {
      return displayAttributeColumn(colDef as AttributeColumnDefinition, resource, key);
    } else if (colDef.columnType === 'ID') {
      return <td key={key}>{resource.id}</td>;
    } else if (colDef.columnType === 'NAME') {
      return <td key={key}>{resource.name}</td>;
    } else if (colDef.columnType === 'BUTTON') {
      return <td key={key}>Button...</td>;
    } else {
      return <td key={key}>?????</td>;
    }
  });
};

const displayAttributeColumn = (colDef: AttributeColumnDefinition, resource: IResourceWithValue, key) => {
  if (!resource.attributeValues) {
    return <td key={key}>-</td>;
  }
  const val: IAttributeValue = resource.attributeValues[generateLabel(colDef)];
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
