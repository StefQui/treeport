import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { buildPath } from './shared';
import {
  ActionState,
  AttributeColumnDefinition,
  ColumnDefinition,
  DataSetListParams,
  DataSetTreeParams,
  DataSetTreeParams2,
  RenderingSliceState,
  ResourceSearchModel,
  RuleDefinition,
  SearchResourceRequestModel,
  UpdatedResourceAction,
} from './type';
// import { useSiteTree } from './datatree';
import { resourceApiUrl, setAction, setInLocalState, TreeNode, TreeNodeWrapper } from './rendering.reducer';
import { Button, Collapse, ListGroup, ListGroupItem } from 'reactstrap';

import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ColDef,
  ColGroupDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  RowModelType,
  createGrid,
  ITextCellEditorParams,
  GetRowIdParams,
  IRowNode,
} from 'ag-grid-community';
import 'ag-grid-charts-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import axios from 'axios';
import { IAttributeValue } from 'app/shared/model/attribute.model';
import { actionsRenderer } from './aggrid/ActionsCellRenderer';
import ResourceDeleteDialog from '../resource/resource-delete-dialog';
import ResourceUpdateDialog from '../resource/resource-update-dialog';
import { handleParameterDefinition } from './parameter-definition';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tagReducer, { TagSlice } from '../tag/tag.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { IResourceAndImpacters } from 'app/shared/model/resource-and-impacters.model';
import {
  CreatedResourceEvent,
  publishEditResourceForAddEvent,
  publishEditResourceForUpdateEvent,
  subscribeToCreatedResource,
  subscribeToUpdatedResource,
} from './action.utils';

export const SITE_TYPE = 'site';

export const SmAggridTree = (props: {
  params: DataSetTreeParams2;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);
  // const data: RuleDefinition = props.params.data;
  // const resourceTree: TreeNode = useResourceTree(props, data);
  const columnDefinitions: ColumnDefinition[] = props.params.columnDefinitions;
  const resourceEntity = useAppSelector(state => state.resource.entity);

  const [gridParams, setGridParams] = useState(null);

  const [updatingNode, setUpdatingNode] = useState(null);
  const [paramsMap, setParamsMap] = useState(null);
  const [rootsParam, setRootsParam] = useState<IServerSideGetRowsParams>();
  const { orgaId } = useParams<'orgaId'>();
  const apiUrl = `api/orga/${orgaId}/resources`;
  const [currentAction, setCurrentAction] = useState('init');
  const [first, setFirst] = useState(true);
  // const updatedResourceAction = useUpdatedResourceAction(props);

  const setResourceToUpdate = (arg0?: { resource: IResourceWithValue[]; route: string[] }) => {
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: 'resourceToUpdate',
        value: { value: arg0, loading: false },
      }),
    );
  };

  // useEffect(() => {
  //   subscribeUpdatedResourceEvent(updatedResourceListener);
  //   return () => {
  //     unsubscribeUpdatedResourceEvent(updatedResourceListener);
  //   };
  // }, []);

  if (first) {
    setResourceToUpdate();
    setFirst(false);
  }

  // useEffect(() => {
  //   console.log('firsttree', first);
  //   if (first) {
  //     setResourceToUpdate(undefined);
  //     setFirst(false);
  //   }
  // }, [first]);
  // const resourceTree: TreeNode = useResourceTree(props, data);
  const getChildrenResource = (treePath: string[]): ResourceSearchModel => {
    return {
      resourceType: SITE_TYPE, // TODO CONVERT to parameter
      columnDefinitions,
      filter: {
        filterType: 'AND',
        items: [
          {
            filterType: 'PROPERTY_FILTER',
            property: {
              filterPropertyType: 'RESOURCE_PROPERTY',
              property: 'parentId',
            },
            filterRule: {
              filterRuleType: 'TEXT_EQUALS',
              terms: treePath.length === 0 ? null : treePath[treePath.length - 1],
            },
          },
        ],
      },
      page: 0,
      size: 20,
      sort: `id`,
    };
  };

  const getResourcesForPath: (params: IServerSideGetRowsParams) => Promise<any> = async (params: IServerSideGetRowsParams) => {
    var request = params.request;
    console.log('paramsparams=', params, request.groupKeys, paramsMap);
    console.log('props.params=', props.params);

    const data = await axios.post<IResourceWithValue[]>(`${apiUrl}/search`, getChildrenResource(request.groupKeys));

    params.success({ rowData: data.data.map(a => ({ ...a, group: a.childrenCount > 0 })) });
  };

  const createServerSideDatasource = () => {
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        console.log('ServerSideDatasource.getRows: params = ', params);
        getResourcesForPath(params);
      },
    };
    return dataSource;
  };

  // const onCloseEdit = (resourceId, isNew) => {
  //   // console.log('onCloseEdit... ')
  //   setShowUpdateModal(false);
  //   // if (isNew) {
  //   //   setCurrentAction('add');
  //   // } else {
  //   //   setCurrentAction('update');
  //   // }
  //   // if (resourceId && currentAction == 'update') {
  //   //   console.log('onCloseEdit', resourceId, updatingNode, resourceEntity);
  //   //   updatingNode.updateData(resourceEntity);
  //   //   // updatingNode.setData(resourceEntity);
  //   // } else if (parentResourceId && currentAction == 'add') {
  //   //   console.log('onCloseEdit parentResourceId', resourceEntity);
  //   //   gridParams.api.applyServerSideTransaction({
  //   //     route: parentRoute,
  //   //     add: [resourceEntity],
  //   //   });

  //   //   // dispatch(getEntity({ id: parentResourceId, orgaId }));
  //   //   // updatingNode.setData(resourceEntity);
  //   // }
  // };
  const onSuccessDelete = () => {
    setShowDeleteModal(false);
    console.log('onSuccessDelete', resourceIdToRemove, currentAction, parentRoute);
    if (resourceIdToRemove && currentAction == 'remove') {
      // console.log('onCloseEdit', resourceId, updatingNode, resourceEntity);
      gridParams.api.applyServerSideTransaction({
        route: parentRoute,
        remove: [{ id: resourceIdToRemove }],
      });
      setCurrentAction('none');
      setParentResourceId(null);

      // updatingNode.updateData(resourceEntity);
      // updatingNode.setData(resourceEntity);
    }
  };
  const onCancelDelete = () => {
    console.log('onCancelDelete', resourceId, updatingNode, resourceEntity);
    // updatingNode.setData(updatedResource);
    setCurrentAction('none');
  };

  // useEffect(() => {
  //    if (resourceEntity && currentAction == 'update' && resourceId) {
  //     console.log('onCloseEdit', resourceId, updatingNode, resourceEntity);
  //     updatingNode.setData(resourceEntity);
  //     setCurrentAction('none');

  //     // updatingNode.setData(resourceEntity);
  //   } else if (parentResourceId && resourceEntity && currentAction == 'add' && !resourceId && !resourceIdToRemove) {
  //     console.log('onCloseEdit parentResourceId', parentRoute, resourceEntity);
  //     gridParams.api.applyServerSideTransaction({
  //       route: parentRoute,
  //       add: [resourceEntity],
  //     });
  //     setCurrentAction('none');
  //     setParentResourceId(null);
  //   }

  // }, [resourceEntity]);

  const checkUpdates = (impactedIds: string[]) => {
    const attColDefs: AttributeColumnDefinition[] = columnDefinitions
      .filter(colDef => colDef.columnType === 'ATTRIBUTE')
      .map(colDef => colDef as AttributeColumnDefinition);
    const attPosts = attColDefs.map(colDef => `:${colDef.attributeConfigId}:period:${colDef.campaignId}`);
    const pre = 'resource:'.length;
    const matchingResourceIds = new Set<string>();
    attPosts.forEach(attPost => {
      impactedIds
        .filter(impacted => impacted.endsWith(attPost))
        .forEach(impacted => matchingResourceIds.add(impacted.substring(pre, impacted.length - attPost.length)));
    });
    console.log('matchingResourceIds', matchingResourceIds);
    gridParams.api.forEachNode(rowNode => {
      if (matchingResourceIds.has(rowNode.data.id)) {
        rowNode.updateData({ ...rowNode.data, childrenCount: 100 });
        console.log('updaterowNode', rowNode.data.id);
      }
    });
  };

  const [updatedResource, setUpdatedResource] = useState<UpdatedResourceAction | null>(null);

  useEffect(() => {
    if (updatedResource) {
      const resourceAndImpacters = updatedResource.resourceAndImpacters;
      gridParams.api.forEachNode(rowNode => {
        if (rowNode.data.id === resourceAndImpacters.resource.id) {
          rowNode.setData(resourceAndImpacters.resource);
        }
      });
      checkUpdates(resourceAndImpacters.impactedIds);
    }
  }, [updatedResource]);

  subscribeToUpdatedResource((data: { detail: UpdatedResourceAction }) => {
    setUpdatedResource(data.detail);
  });

  const [createdResource, setCreatedResource] = useState<CreatedResourceEvent | null>(null);

  useEffect(() => {
    if (createdResource) {
      console.log('justaddded', createdResource);
      const ri = createdResource.resourceAndImpacters;
      if (createdResource.resourceParentId) {
        gridParams.api.forEachNode(rowNode => {
          if (rowNode.data.id === createdResource.resourceParentId) {
            rowNode.updateData({ ...rowNode.data, group: true });
          }
        });
        gridParams.api.applyServerSideTransaction({
          route: createdResource.route,
          add: [ri.resource],
        });
      } else {
        gridParams.api.applyServerSideTransaction({
          route: [],
          add: [ri.resource],
        });
        setCurrentAction('none');
      }

      // gridParams.api.forEachNode(rowNode => {
      //   if (rowNode.data.id === resourceAndImpacters.resource.id) {
      //     rowNode.setData(resourceAndImpacters.resource);
      //   }
      // });
      checkUpdates(ri.impactedIds);
    }
  }, [createdResource]);

  subscribeToCreatedResource((data: { detail: CreatedResourceEvent }) => {
    setCreatedResource(data.detail);
  });

  // const onSuccessUpdate = (entityAndImpacters: IResourceAndImpacters) => {
  //   console.log('onSuccessUpdate', entityAndImpacters.resource, updatingNode, resourceEntity);
  //   updatingNode.setData(entityAndImpacters.resource);
  //   checkUpdates(entityAndImpacters.impactedIds);
  //   setCurrentAction('none');
  //   setResourceId(null);
  // };

  // useEffect(() => {
  //   if (updatedResourceAction) {
  //     if (!first) {
  //       console.log('updatedResourceAction', updatedResourceAction);
  //     }
  //   }
  // }, [updatedResourceAction[0]]);

  const onSuccessAdd = (entityAndImpacters: IResourceAndImpacters) => {
    console.log('onSuccessAdd', updatingNode);
    if (updatingNode) {
      updatingNode.updateData({ ...updatingNode.data, group: true });
      console.log('onSuccessAdd 2', entityAndImpacters, parentRoute, { ...updatingNode.data, group: true, childrenCount: 10 });
      gridParams.api.applyServerSideTransaction({
        route: parentRoute,
        add: [entityAndImpacters.resource],
      });
      setCurrentAction('none');
    } else {
      gridParams.api.applyServerSideTransaction({
        route: [],
        add: [entityAndImpacters.resource],
      });
      setCurrentAction('none');
    }
    setResourceId(null);
  };
  const onCancelEdit = () => {
    console.log('onCancelEdit', resourceId, updatingNode, resourceEntity);
    // updatingNode.setData(updatedResource);
    setCurrentAction('none');
  };

  const getRouteToNode = (rowNode: IRowNode): string[] => {
    if (!rowNode.parent) {
      return [];
    }
    return [...getRouteToNode(rowNode.parent), rowNode.key ? rowNode.key : rowNode.data.id];
  };

  const handleEdit = async (node: any) => {
    const data = await axios.get<IResourceWithValue>(`${apiUrl}/${node.data.id}`);
    publishEditResourceForUpdateEvent({
      source: builtPath,
      resourceToEdit: data.data,
      columnDefinitions,
    });
  };

  const handleRemove = (node: any) => {
    console.log('handleRemove', node.data.id, node.key);
    setCurrentAction('remove');
    setResourceIdToRemove(node.data.id);
    setResourceId(null);
    setUpdatingNode(null);
    const route = getRouteToNode(node);
    setParentRoute(route.slice(0, route.length - 1));
    setShowDeleteModal(true);
  };

  const handleAdd = (node: any) => {
    const route = getRouteToNode(node);
    console.log('handleAdd', route);
    publishEditResourceForAddEvent({
      source: builtPath,
      resourceToAddParentId: node?.data.id,
      route,
      columnDefinitions,
    });
    // setCurrentAction('add');
    // setUpdatingNode(node);
    // setParentRoute(route);

    // setParentResourceId(node?.data.id);
    // setResourceId(null);
    // setResourceIdToRemove(null);
    // setUpdatingNode(node);
    // setShowUpdateModal(true);
    // alert('resource: ' + resource.id);
  };

  const handleCreateRoot = () => {
    setCurrentAction('add');
    setUpdatingNode(null);
    setParentRoute([]);

    setParentResourceId(null);
    setResourceId(null);
    setResourceIdToRemove(null);
    setUpdatingNode(null);
    setShowUpdateModal(true);
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '800px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceId, setResourceId] = useState(null);
  const [resourceIdToRemove, setResourceIdToRemove] = useState(null);
  const [parentResourceId, setParentResourceId] = useState(null);
  const [parentRoute, setParentRoute] = useState(null);

  const gridOptions: GridOptions = {
    getRowId: (row: GetRowIdParams) => String(row.data.id),
  };

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'id',
    },
    {
      field: 'childrenCount',
    },
    {
      field: 'tags',
      valueGetter: params => {
        if (params.data.tags) {
          const val: ITag[] = params.data.tags;
          return val.map(tag => tag.id).join(',');
        }
        return '--';
      },
    },
    // {
    //   field: 'id',
    //   cellEditor: 'agTextCellEditor',
    //   cellEditorParams: {
    //     maxLength: 20,
    //   } as ITextCellEditorParams,
    //   valueSetter: params => {
    //     params.data.id = params.newValue;
    //     return true;
    //   },
    // },
    {
      field: 'ToConso 2023',
      valueGetter: params => {
        if (params.data.attributeValues) {
          const val: IAttributeValue = params.data.attributeValues['toConso:period:2023'];
          return val ? val.value : '-';
        }
        return '--';
      },
    },
    {
      field: 'ToSite 2023',
      valueGetter: params => {
        if (params.data.attributeValues) {
          const val: IAttributeValue = params.data.attributeValues['toSite:period:2023'];
          return val ? val.value : '-';
        }
        return '--';
      },
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      field: 'actions2',
      headerName: 'Actions2',
      cellRenderer: actionsRenderer({
        editAction: handleEdit,
        addAction: handleAdd,
        removeAction: handleRemove,
      }),
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
      editable: true,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: 'id',
      cellRendererParams: {
        innerRenderer: (params: ICellRendererParams) => {
          // display employeeName rather than group key (employeeId)
          return params.data.name;
        },
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params: IsServerSideGroupOpenByDefaultParams) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  }, []);
  const isServerSideGroup = useCallback((dataItem: any) => {
    // indicate if node is a group
    // return dataItem.group;
    return true;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem: any) => {
    // specify which group key to use
    return dataItem.id;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    var datasource = createServerSideDatasource();
    params.api!.setGridOption('serverSideDatasource', datasource);
    setGridParams(params);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={'ag-theme-quartz'}>
        <Button color="info" onClick={() => handleCreateRoot()} size="sm" data-cy="entitySelectButton">
          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Create new root</span>
        </Button>

        <AgGridReact
          gridOptions={gridOptions}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={'serverSide'}
          treeData={true}
          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
          onGridReady={onGridReady}
        />
      </div>
      {/* <ResourceUpdateDialog
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        onSuccessUpdate={onSuccessUpdate}
        onSuccessAdd={onSuccessAdd}
        onCancelEdit={onCancelEdit}
        columnDefinitions={columnDefinitions}
        resourceId={resourceId}
        parentResourceId={parentResourceId}
        props={props}
      ></ResourceUpdateDialog> */}
      <ResourceDeleteDialog
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onSuccessDelete={onSuccessDelete}
        onCancelDelete={onCancelDelete}
        resourceId={resourceIdToRemove}
      ></ResourceDeleteDialog>
    </div>
  );
};
