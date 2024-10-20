import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { buildPath } from './shared';
import { AttributeColumnDefinition, ColumnDefinition, DataSetTreeParams2, RenderingSliceState, ResourceSearchModel } from './type';
// import { useSiteTree } from './datatree';
import { setInLocalState } from './rendering.reducer';
import { Button } from 'reactstrap';

import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ITextCellEditorParams,
  GetRowIdParams,
  IRowNode,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  SizeColumnsToContentStrategy,
} from 'ag-grid-community';
import 'ag-grid-charts-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import axios from 'axios';
import { IAttributeValue } from 'app/shared/model/attribute.model';
import { actionsRenderer } from './aggrid/ActionsCellRenderer';
import { useLocation, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITag } from 'app/shared/model/tag.model';
import {
  CreatedResourceEvent,
  DeletedResourceEvent,
  publishDeleteResourceEvent,
  publishEditResourceForAddEvent,
  publishEditResourceForUpdateEvent,
  subscribeToCreatedResource,
  subscribeToDeletedResource,
  subscribeToUpdatedResource,
  UpdatedResourceEvent,
} from './action.utils';
import { generateCols } from './columns.utils';
import { useOrgaId } from './render-resource-page';

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
  const columnDefinitions: ColumnDefinition[] = props.params.columnDefinitions;
  const resourceEntity = useAppSelector(state => state.resource.entity);

  const [gridParams, setGridParams] = useState(null);

  const [updatingNode, setUpdatingNode] = useState(null);
  const [paramsMap, setParamsMap] = useState(null);
  const orgaId = useOrgaId();
  const apiUrl = `api/orga/${orgaId}/resources`;

  // const location = useLocation();

  // console.log('orgaId===', location);

  const setResourceToUpdate = (arg0?: { resource: IResourceWithValue[]; route: string[] }) => {
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: 'resourceToUpdate',
        value: { value: arg0, loading: false },
      }),
    );
  };

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
    // console.log('paramsparams=', params, request.groupKeys, paramsMap);
    // console.log('props.params=', props.params);

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
      if (!rowNode.data) {
        console.log('one rownode is null', rowNode);
      }

      if (rowNode.data && matchingResourceIds.has(rowNode.data.id)) {
        rowNode.updateData({ ...rowNode.data, childrenCount: 100 });
        console.log('updaterowNode', rowNode.data.id);
      }
    });
  };

  const [updatedResource, setUpdatedResource] = useState<UpdatedResourceEvent | null>(null);

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

  subscribeToUpdatedResource((data: { detail: UpdatedResourceEvent }) => {
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
      }
      checkUpdates(ri.impactedIds);
    }
  }, [createdResource]);

  subscribeToCreatedResource((data: { detail: CreatedResourceEvent }) => {
    setCreatedResource(data.detail);
  });

  const [deletedResource, setDeletedResource] = useState<DeletedResourceEvent | null>(null);

  useEffect(() => {
    if (deletedResource) {
      console.log('deletedResourcett', deletedResource);
      const id = deletedResource.resourceId;

      gridParams.api.applyServerSideTransaction({
        route: deletedResource.route,
        remove: [{ id: resourceIdToRemove }],
      });
    }
  }, [deletedResource]);

  subscribeToDeletedResource((data: { detail: DeletedResourceEvent }) => {
    setDeletedResource(data.detail);
  });

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

  const handleSelect = async (node: any) => {
    const data = await axios.get<IResourceWithValue>(`${apiUrl}/${node.data.id}`);
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params.selectedResourceKeyInLocalContext,
        value: { value: node.data, loading: false },
      }),
    );

    // publishEditResourceForUpdateEvent({
    //   source: builtPath,
    //   resourceToEdit: data.data,
    //   columnDefinitions,
    // });
  };

  const handleRemove = (node: any) => {
    const route = getRouteToNode(node);
    publishDeleteResourceEvent({
      source: builtPath,
      resourceToDeleteId: node?.data.id,
      route,
    });
  };

  const handleAddChildren = (node: any) => {
    const route = getRouteToNode(node);
    console.log('handleAdd', route);
    publishEditResourceForAddEvent({
      source: builtPath,
      resourceToAddParentId: node?.data.id,
      route,
      columnDefinitions,
    });
  };

  const handleCreateRoot = () => {
    const route = [];
    console.log('handleCreateRoot', route);
    publishEditResourceForAddEvent({
      source: builtPath,
      resourceToAddParentId: null,
      route,
      columnDefinitions,
    });
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '800px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [resourceIdToRemove, setResourceIdToRemove] = useState(null);

  const gridOptions: GridOptions = {
    getRowId: (row: GetRowIdParams) => String(row.data.id),
  };

  const generatedCols = generateCols(props.params, handleSelect, handleEdit, handleAddChildren, handleRemove);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(generatedCols);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      sortable: false,
      editable: true,
      enableCellChangeFlash: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: 'id',
      minWidth: 200,
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

  const autoSizeStrategy = useMemo<
    SizeColumnsToFitGridStrategy | SizeColumnsToFitProvidedWidthStrategy | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: 'fitGridWidth',
      defaultMinWidth: 100,
    };
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
          autoSizeStrategy={autoSizeStrategy}
          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
