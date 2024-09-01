import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import { type FunctionComponent, useCallback } from 'react';
import { Translate } from 'react-jhipster';
import { Button } from 'reactstrap';

// import styles from './ActionsCellRenderer.module.scss';

export const actionsRenderer = ({ editAction, addAction, removeAction }) => {
  const handleSelect = (node: any) => {
    // alert(`click on ${site.id}`);
    editAction(node);
  };
  const handleAdd = (node: any) => {
    // alert(`click on ${site.id}`);
    addAction(node);
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
        <Button color="info" onClick={() => handleSelect(node)} size="sm" data-cy="entitySelectButton">
          <FontAwesomeIcon icon="eye" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.select">Sel</Translate>
          </span>
        </Button>
        <Button color="info" onClick={() => handleAdd(node)} size="sm" data-cy="entitySelectButton">
          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Add </span>
        </Button>
        <Button color="danger" onClick={() => handleRemove(node)} size="sm" data-cy="entitySelectButton">
          <FontAwesomeIcon icon="ban" /> <span className="d-none d-md-inline">R</span>
        </Button>
      </div>
    );
  };
};
