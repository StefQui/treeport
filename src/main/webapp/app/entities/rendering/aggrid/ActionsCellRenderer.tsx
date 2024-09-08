import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import { type FunctionComponent, useCallback } from 'react';
import { Translate } from 'react-jhipster';
import { Button } from 'reactstrap';
import { ButtonColumnDefinition } from '../type';

// import styles from './ActionsCellRenderer.module.scss';

export const actionsRenderer = ({
  buttonActions,
  selectAction,
  editAction,
  addChildrenAction,
  removeAction,
}: {
  buttonActions: ButtonColumnDefinition['action'][];
  selectAction: any;
  editAction: any;
  addChildrenAction: any;
  removeAction: any;
}) => {
  const handleSelect = (node: any) => {
    // alert(`click on ${site.id}`);
    selectAction(node);
  };
  const handleEdit = (node: any) => {
    // alert(`click on ${site.id}`);
    editAction(node);
  };
  console.log('actionsRenderer111111', editAction, addChildrenAction);
  const handleAddChildren = (node: any) => {
    // alert(`click on ${site.id}`);
    addChildrenAction(node);
  };
  const handleRemove = (node: any) => {
    // alert(`click on ${site.id}`);
    removeAction(node);
  };

  return ({ api, node }) => {
    const onRemoveClick = useCallback(() => {
      const rowData = node.data;
      api.applyTransaction({ remove: [rowData] });
    }, [node, api]);

    const onStopSellingClick = useCallback(() => {
      const rowData = node.data;

      const isPaused = rowData.status === 'paused';
      const isOutOfStock = rowData.available <= 0;

      // Modify the status property
      rowData.status = !isPaused ? 'paused' : !isOutOfStock ? 'active' : 'outOfStock';

      // Refresh the row to reflect the changes
      api.applyTransaction({ update: [rowData] });
    }, [node, api]);

    return (
      <div className="btn-group flex-btn-group-container">
        {buttonActions.indexOf('select') !== -1 && (
          <Button color="info" onClick={() => handleSelect(node)} size="sm" data-cy="entitySelectButton">
            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Select</span>
          </Button>
        )}
        {buttonActions.indexOf('edit') !== -1 && (
          <Button color="info" onClick={() => handleEdit(node)} size="sm" data-cy="entitySelectButton">
            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        )}
        {buttonActions.indexOf('addChildren') !== -1 && (
          <Button color="info" onClick={() => handleAddChildren(node)} size="sm" data-cy="entitySelectButton">
            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Add </span>
          </Button>
        )}
        {buttonActions.indexOf('remove') !== -1 && (
          <Button color="danger" onClick={() => handleRemove(node)} size="sm" data-cy="entitySelectButton">
            <FontAwesomeIcon icon="ban" /> <span className="d-none d-md-inline">R</span>
          </Button>
        )}
      </div>
    );
  };
};
