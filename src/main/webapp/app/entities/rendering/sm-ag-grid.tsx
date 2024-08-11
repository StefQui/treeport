import React, { useCallback, useMemo, useRef, useState } from 'react';

import { handleParameterDefinitions } from './parameter-definition';
import { useCalculatedValueState } from './shared';
import { ColumnDefinition, SmTextProps, TextParams, ValueInState } from './type';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ColGroupDef, GetDataPath, GridApi, GridOptions, createGrid } from 'ag-grid-community';
import 'ag-grid-charts-enterprise';
import { getData } from './data-aggrid';

export const SmAgGrid = (props: SmTextProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '800px', width: '100%' }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    // we're using the auto group column by default!
    { field: 'jobTitle' },
    { field: 'employmentType' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: 'Organisation Hierarchy',
      minWidth: 300,
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);
  const getDataPath = useCallback((data: any) => {
    return data.orgHierarchy;
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption('quickFilterText', (document.getElementById('filter-text-box') as any).value);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: '5px' }}>
          <input type="text" id="filter-text-box" placeholder="Filter..." onInput={onFilterTextBoxChanged} />
        </div>

        <div style={gridStyle} className={'ag-theme-quartz'}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            treeData={true}
            groupDefaultExpanded={-1}
            getDataPath={getDataPath}
          />
        </div>
      </div>
    </div>
  );
};
