import { ColDef, ITextCellEditorParams } from 'ag-grid-community';
import { IAttributeValue } from 'app/shared/model/attribute.model';
import { ITag } from 'app/shared/model/tag.model';
import { actionsRenderer } from './aggrid/ActionsCellRenderer';
import { ButtonColumnDefinition, ColumnDefinition, DataSetTreeParams2 } from './type';

export const generateCols = (
  params: DataSetTreeParams2,
  handleSelect: (node: any) => void,
  handleEdit: (node: any) => void,
  handleAddChildren: (node: any) => void,
  handleRemove: (node: any) => void,
): ColDef[] => {
  const buttonActions = params.columnDefinitions.filter(cd => cd.columnType === 'BUTTON').map(cd => (cd as ButtonColumnDefinition).action);

  return [
    {
      field: 'childrenCount',
    },
    // {
    //   field: 'actions2',
    //   headerName: 'Actions2',
    //   minWidth: 180,
    //   cellRenderer: actionsRenderer({
    //     editAction: handleEdit,
    //     addChildrenAction: handleAddChildren,
    //     removeAction: handleRemove,
    //   }),
    // },
  ]
    .concat(generateColsFromParams(params.columnDefinitions, handleSelect, handleEdit, handleAddChildren, handleRemove) as any[])
    .concat(generateButtons(buttonActions, handleSelect, handleEdit, handleAddChildren, handleRemove) as any[]);
};

const generateButtons = (
  buttonActions: ButtonColumnDefinition['action'][],
  handleSelect,
  handleEdit,
  handleAddChildren,
  handleRemove,
): ColDef[] => {
  if (buttonActions.length === 0) {
    return [];
  }
  return [
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 300,
      cellRenderer: actionsRenderer({
        buttonActions,
        selectAction: buttonActions.indexOf('select') !== -1 && handleSelect,
        editAction: buttonActions.indexOf('edit') !== -1 && handleEdit,
        addChildrenAction: buttonActions.indexOf('addChildren') !== -1 && handleAddChildren,
        removeAction: buttonActions.indexOf('remove') !== -1 && handleRemove,
      }),
    },
  ];
};

export const generateColsFromParams = (
  columnDefinitions: ColumnDefinition[],
  handleSelect: (node: any) => void,
  handleEdit: (node: any) => void,
  handleAdd: (node: any) => void,
  handleRemove: (node: any) => void,
): ColDef[] => {
  return columnDefinitions
    .map(colDef => {
      if (colDef.columnType === 'ID') {
        return {
          field: 'id',
        };
      } else if (colDef.columnType === 'NAME') {
        return {
          field: 'name',
        };
      } else if (colDef.columnType === 'TAGS') {
        return {
          field: 'tags',
          valueGetter: params => {
            if (params.data.tags) {
              const val: ITag[] = params.data.tags;
              return val.map(tag => tag.id).join(',');
            }
            return '--';
          },
        };
      } else if (colDef.columnType === 'ATTRIBUTE') {
        return {
          field: `${colDef.attributeConfigId} - ${colDef.campaignId}`,
          valueGetter: params => {
            if (params.data.attributeValues) {
              const val: IAttributeValue = params.data.attributeValues[`${colDef.attributeConfigId}:period:${colDef.campaignId}`];
              return val ? val.value : '-';
            }
            return '--';
          },
        };
      }
    })
    .filter(c => !!c);
};
