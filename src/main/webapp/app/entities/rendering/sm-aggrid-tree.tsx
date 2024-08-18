import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { buildPath } from './shared';
import {
  ColumnDefinition,
  DataSetListParams,
  DataSetTreeParams,
  DataSetTreeParams2,
  ResourceSearchModel,
  RuleDefinition,
  SearchResourceRequestModel,
} from './type';
import { useSiteTree } from './datatree';
import { resourceApiUrl, setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
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
import SiteDeleteDialog from '../site/site-delete-dialog';
import SiteUpdateDialog from '../site/site-update-dialog';
import { handleParameterDefinition } from './parameter-definition';
import { useParams } from 'react-router';
import { getEntity } from '../site/site.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISiteAndImpacters } from 'app/shared/model/site-and-impacters.model';

export const SmAggridTree = (props: {
  params: DataSetTreeParams2;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);
  const data: RuleDefinition = props.params.data;
  const siteTree: TreeNode = useSiteTree(props, data);
  const columnDefinitions: ColumnDefinition[] = props.params.columnDefinitions;
  const siteEntity = useAppSelector(state => state.site.entity);

  const [gridParams, setGridParams] = useState(null);

  const [updatingNode, setUpdatingNode] = useState(null);
  const [paramsMap, setParamsMap] = useState(null);
  const [rootsParam, setRootsParam] = useState<IServerSideGetRowsParams>();
  const { orgaId } = useParams<'orgaId'>();
  const apiUrl = `api/resources/orga/${orgaId}/search`;
  const [currentAction, setCurrentAction] = useState('init');

  // const siteTree: TreeNode = useSiteTree(props, data);
  const getChildrenSite = (treePath: string[]): ResourceSearchModel => {
    return {
      resourceType: 'SITE',
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

  const getSitesForPath: (params: IServerSideGetRowsParams) => Promise<any> = async (params: IServerSideGetRowsParams) => {
    var request = params.request;
    console.log('paramsparams=', params, request.groupKeys, paramsMap);
    console.log('props.params=', props.params);

    const data = await axios.post<IResourceWithValue[]>(apiUrl, getChildrenSite(request.groupKeys));

    params.success({ rowData: data.data.map(a => ({ ...a, group: a.childrenCount > 0 })) });
  };

  const createServerSideDatasource = () => {
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        console.log('ServerSideDatasource.getRows: params = ', params);
        getSitesForPath(params);
      },
    };
    return dataSource;
  };

  const onCloseEdit = (siteId, isNew) => {
    // console.log('onCloseEdit... ')
    setShowUpdateModal(false);
    // if (isNew) {
    //   setCurrentAction('add');
    // } else {
    //   setCurrentAction('update');
    // }
    // if (siteId && currentAction == 'update') {
    //   console.log('onCloseEdit', siteId, updatingNode, siteEntity);
    //   updatingNode.updateData(siteEntity);
    //   // updatingNode.setData(siteEntity);
    // } else if (parentSiteId && currentAction == 'add') {
    //   console.log('onCloseEdit parentSiteId', siteEntity);
    //   gridParams.api.applyServerSideTransaction({
    //     route: parentRoute,
    //     add: [siteEntity],
    //   });

    //   // dispatch(getEntity({ id: parentSiteId, orgaId }));
    //   // updatingNode.setData(siteEntity);
    // }
  };
  const onSuccessDelete = () => {
    setShowDeleteModal(false);
    if (siteIdToRemove && currentAction == 'remove') {
      // console.log('onCloseEdit', siteId, updatingNode, siteEntity);
      gridParams.api.applyServerSideTransaction({
        route: parentRoute,
        remove: [{ id: siteIdToRemove }],
      });
      setCurrentAction('none');
      setParentSiteId(null);

      // updatingNode.updateData(siteEntity);
      // updatingNode.setData(siteEntity);
    }
  };
  const onCancelDelete = () => {
    console.log('onCancelDelete', siteId, updatingNode, siteEntity);
    // updatingNode.setData(updatedSite);
    setCurrentAction('none');
  };

  // useEffect(() => {
  //    if (siteEntity && currentAction == 'update' && siteId) {
  //     console.log('onCloseEdit', siteId, updatingNode, siteEntity);
  //     updatingNode.setData(siteEntity);
  //     setCurrentAction('none');

  //     // updatingNode.setData(siteEntity);
  //   } else if (parentSiteId && siteEntity && currentAction == 'add' && !siteId && !siteIdToRemove) {
  //     console.log('onCloseEdit parentSiteId', parentRoute, siteEntity);
  //     gridParams.api.applyServerSideTransaction({
  //       route: parentRoute,
  //       add: [siteEntity],
  //     });
  //     setCurrentAction('none');
  //     setParentSiteId(null);
  //   }

  // }, [siteEntity]);

  const onSuccessUpdate = (entityAndImpacters: ISiteAndImpacters) => {
    console.log('onSuccessUpdate', entityAndImpacters.site, updatingNode, siteEntity);
    updatingNode.setData(entityAndImpacters.site);
    setCurrentAction('none');
  };
  const onSuccessAdd = (entityAndImpacters: ISiteAndImpacters) => {
    console.log('onSuccessAdd', updatingNode);
    if (updatingNode) {
      updatingNode.updateData({ ...updatingNode.data, group: true });
      console.log('onSuccessAdd 2', entityAndImpacters, parentRoute, { ...updatingNode.data, group: true, childrenCount: 10 });
      gridParams.api.applyServerSideTransaction({
        route: parentRoute,
        add: [entityAndImpacters.site],
      });
      setCurrentAction('none');
    } else {
      gridParams.api.applyServerSideTransaction({
        route: [],
        add: [entityAndImpacters.site],
      });
      setCurrentAction('none');
    }
  };
  const onCancelEdit = () => {
    console.log('onCancelEdit', siteId, updatingNode, siteEntity);
    // updatingNode.setData(updatedSite);
    setCurrentAction('none');
  };

  const getRouteToNode = (rowNode: IRowNode): string[] => {
    if (!rowNode.parent) {
      return [];
    }
    return [...getRouteToNode(rowNode.parent), rowNode.key ? rowNode.key : rowNode.data.id];
  };

  const handleEdit = (node: any) => {
    console.log('handleEdit', node.data.id, node.key);
    setSiteId(node.data.id);
    setSiteIdToRemove(null);
    setCurrentAction('update');
    setUpdatingNode(node);
    setShowUpdateModal(true);
    // alert('site: ' + site.id);
  };

  const handleRemove = (node: any) => {
    console.log('handleRemove', node.data.id, node.key);
    setCurrentAction('remove');
    setSiteIdToRemove(node.data.id);
    setSiteId(null);
    setUpdatingNode(null);
    const route = getRouteToNode(node);
    setParentRoute(route.slice(0, route.length - 1));
    setShowDeleteModal(true);
  };

  const handleAdd = (node: any) => {
    const route = getRouteToNode(node);
    console.log('handleAdd', route);
    setCurrentAction('add');
    setUpdatingNode(node);
    setParentRoute(route);

    setParentSiteId(node?.data.id);
    setSiteId(null);
    setSiteIdToRemove(null);
    setUpdatingNode(node);
    setShowUpdateModal(true);
    // alert('site: ' + site.id);
  };

  const handleCreateRoot = () => {
    setCurrentAction('add');
    setUpdatingNode(null);
    setParentRoute([]);

    setParentSiteId(null);
    setSiteId(null);
    setSiteIdToRemove(null);
    setUpdatingNode(null);
    setShowUpdateModal(true);
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '800px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [siteIdToRemove, setSiteIdToRemove] = useState(null);
  const [parentSiteId, setParentSiteId] = useState(null);
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
      cellRenderer: actionsRenderer({ editAction: handleEdit, addAction: handleAdd, removeAction: handleRemove }),
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
    // fetch('https://www.ag-grid.com/example-assets/small-tree-data.json')
    //       .then(resp => resp.json())
    //       .then((data: any[]) => {
    //         var fakeServer = createFakeServer(data);
    //         var datasource = createServerSideDatasource(fakeServer);
    //         params.api!.setGridOption('serverSideDatasource', datasource);
    //       });
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
      <SiteUpdateDialog
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        onSuccessUpdate={onSuccessUpdate}
        onSuccessAdd={onSuccessAdd}
        onCancelEdit={onCancelEdit}
        columnDefinitions={columnDefinitions}
        siteId={siteId}
        parentSiteId={parentSiteId}
      ></SiteUpdateDialog>
      <SiteDeleteDialog
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onSuccessDelete={onSuccessDelete}
        onCancelDelete={onCancelDelete}
        siteId={siteIdToRemove}
      ></SiteDeleteDialog>
    </div>
  );
};
