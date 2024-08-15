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

    // const requestUrl = `${resourceApiUrl}/coca/search`;
    const data = await axios.post<IResourceWithValue[]>(apiUrl, getChildrenSite(request.groupKeys));

    // var request = params.request;
    // var doingInfinite = request.startRow != null && request.endRow != null;
    // var result = doingInfinite
    //   ? {
    //       rowData: allRows.slice(request.startRow, request.endRow),
    //       rowCount: allRows.length,
    //     }
    //   : { rowData: allRows };

    params.success({ rowData: data.data.map(a => ({ ...a, group: a.childrenCount > 0 })) });
  };

  const createServerSideDatasource = () => {
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        console.log('ServerSideDatasource.getRows: params = ', params);
        getSitesForPath(params);
        // var request = params.request;
        // var doingInfinite = request.startRow != null && request.endRow != null;
        // var result = doingInfinite
        //   ? {
        //       rowData: allRows.slice(request.startRow, request.endRow),
        //       rowCount: allRows.length,
        //     }
        //   : { rowData: allRows };
        // console.log('getRows: result = ', result);
        // setTimeout(() => {
        //   params.success(result);
        // }, 200);
      },
    };
    return dataSource;
  };

  const onCloseEdit = siteId => {
    setShowModal(false);
    if (siteId) {
      console.log('onCloseEdit', siteId, updatingNode, siteEntity);
      updatingNode.updateData(siteEntity);
      // updatingNode.setData(siteEntity);
    } else if (parentSiteId) {
      console.log('onCloseEdit parentSiteId', siteEntity);
      gridParams.api.applyServerSideTransaction({
        route: ['root', 's1'],
        update: [siteEntity],
      });

      // dispatch(getEntity({ id: parentSiteId, orgaId }));
      // updatingNode.setData(siteEntity);
    }
  };

  useEffect(() => {
    if (siteEntity && updatingNode) {
      console.log('useEffect parentSiteId', siteEntity);
      // updatingNode.setData(siteEntity);
      // gridParams.api.applyServerSideTransaction({
      //   route: ['root', 's1'],
      //   update: [siteEntity],
      // });
    }
  }, [siteEntity]);

  const handleEdit = (node: any) => {
    console.log('handleEdit', node.data.id);
    setSiteId(node.data.id);
    setUpdatingNode(node);
    setShowModal(true);
    // alert('site: ' + site.id);
  };

  const handleAdd = (node: any) => {
    // console.log('handleAdd', node.data.id);
    setParentSiteId(node?.data.id);
    setSiteId(null);
    setUpdatingNode(node);
    setShowModal(true);
    // alert('site: ' + site.id);
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '800px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [showModal, setShowModal] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [parentSiteId, setParentSiteId] = useState(null);

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
      cellRenderer: actionsRenderer({ editAction: handleEdit, addAction: handleAdd }),
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
      field: 'name',
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
    return dataItem.group;
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
        showModal={showModal}
        setShowModal={setShowModal}
        onCloseEdit={onCloseEdit}
        siteId={siteId}
        parentSiteId={parentSiteId}
      ></SiteUpdateDialog>
    </div>
  );
};
