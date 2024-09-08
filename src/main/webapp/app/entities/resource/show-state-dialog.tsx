import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { translate, Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnDefinition, RenderingSliceState } from '../rendering/type';
import axios from 'axios';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IResourceAndImpacters } from 'app/shared/model/resource-and-impacters.model';
import {
  EditResourceForAddEvent,
  EditResourceForUpdateEvent,
  EditUiResourceForUpdateEvent,
  publishCreatedResourceEvent,
  publishUpdatedResourceEvent,
  ShowStatevent,
  subscribeToEditResourceForAdd,
  subscribeToEditResourceForUpdate,
  subscribeToEditUiResourceForUpdate,
  subscribeToShowState,
} from '../rendering/action.utils';
import { usePageResourceContentFromResourceId, useResourceWithKey } from '../rendering/render-resource-page';

type updateAction = 'update';
type addAction = 'add';
type ActionType = updateAction | addAction;

export const UiShowStateDialog = props => {
  const dispatch = useAppDispatch();

  const { orgaId } = useParams<'orgaId'>();
  const apiUrl = `api/orga/${orgaId}/resources`;
  const [showDialog, setShowDialog] = useState(true);

  const [stateId, setStateId] = useState(null);
  const [currentContext, setCurrentContext] = useState(null);

  const localContextsState = useAppSelector((state: RenderingSliceState) => state.rendering.localContextsState);
  const pageContext = useAppSelector((state: RenderingSliceState) => state.rendering.pageContext);

  subscribeToShowState((data: { detail: ShowStatevent }) => {
    setStateId(data.detail.stateId);

    setShowDialog(true);
  });

  useEffect(() => {
    if (stateId === 'localContextsState') {
      setCurrentContext(localContextsState);
    } else if (stateId === 'pageContext') {
      setCurrentContext(pageContext);
    }
    setShowDialog(true);
  }, [stateId]);

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    stateId && (
      <Modal isOpen={showDialog} toggle={handleClose} size="xl">
        <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
          State
        </ModalHeader>
        <ModalBody id="treeportApp.resource.delete.question">
          <div>
            <Row className="justify-content-center"></Row>
            <Row className="justify-content-center">
              <Col md="12">StateId: {stateId}</Col>
            </Row>

            <Col md="12">{currentContext ? <pre>{JSON.stringify(currentContext ? currentContext : {}, null, 2)}</pre> : ''}</Col>
          </div>{' '}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp;
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          {/* <Button id="jhi-confirm-delete-resource" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button> */}
        </ModalFooter>
      </Modal>
    )
  );
};

export default UiShowStateDialog;
