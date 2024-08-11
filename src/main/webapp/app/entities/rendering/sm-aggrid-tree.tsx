import React, { useCallback, useMemo, useState } from 'react';
import { useAppDispatch } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { buildPath } from './shared';
import { DataSetListParams, DataSetTreeParams, RuleDefinition } from './type';
import { useSiteTree } from './datatree';
import { setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
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
} from 'ag-grid-community';
import 'ag-grid-charts-enterprise';
import { AgGridReact } from 'ag-grid-react';

export const SmAggridTree = (props: {
  params: DataSetTreeParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const createFakeServer = (fakeServerData: any[]) => {
    const fakeServer = {
      data: fakeServerData,
      getData: function (request: IServerSideGetRowsRequest) {
        const extractRowsFromData: (groupKeys: string[], data: any[]) => any = (groupKeys: string[], data: any[]) => {
          if (groupKeys.length === 0) {
            return data.map(function (d) {
              return {
                group: !!d.children,
                employeeId: d.employeeId,
                employeeName: d.employeeName,
                employmentType: d.employmentType,
                jobTitle: d.jobTitle,
              };
            });
          }
          var key = groupKeys[0];
          for (var i = 0; i < data.length; i++) {
            if (data[i].employeeId === key) {
              return extractRowsFromData(groupKeys.slice(1), data[i].children.slice());
            }
          }
        };
        return extractRowsFromData(request.groupKeys, this.data);
      },
    };
    return fakeServer;
  };

  const createServerSideDatasource = (fakeServer: any) => {
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        console.log('ServerSideDatasource.getRows: params = ', params);
        var allRows = fakeServer.getData(params.request);
        var request = params.request;
        var doingInfinite = request.startRow != null && request.endRow != null;
        var result = doingInfinite
          ? {
              rowData: allRows.slice(request.startRow, request.endRow),
              rowCount: allRows.length,
            }
          : { rowData: allRows };
        console.log('getRows: result = ', result);
        setTimeout(() => {
          params.success(result);
        }, 200);
      },
    };
    return dataSource;
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '800px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'employeeId', hide: true },
    { field: 'employeeName', hide: true },
    { field: 'jobTitle' },
    { field: 'employmentType' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      field: 'employeeName',
      cellRendererParams: {
        innerRenderer: (params: ICellRendererParams) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
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
    return dataItem.employeeId;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/small-tree-data.json')
      .then(resp => resp.json())
      .then((data: any[]) => {
        var fakeServer = createFakeServer(data);
        var datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption('serverSideDatasource', datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={'ag-theme-quartz'}>
        <AgGridReact
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
    </div>
  );
};
