import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { translate, Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch } from 'app/config/store';
import { ColumnDefinition } from '../rendering/type';
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
  subscribeToEditResourceForAdd,
  subscribeToEditResourceForUpdate,
  subscribeToEditUiResourceForUpdate,
} from '../rendering/action.utils';
import { usePageResourceContentFromResourceId, useResourceWithKey } from '../rendering/render-resource-page';

type updateAction = 'update';
type addAction = 'add';
type ActionType = updateAction | addAction;

export const UiResourceUpdateDialog = props => {
  const dispatch = useAppDispatch();

  const { orgaId } = useParams<'orgaId'>();
  const apiUrl = `api/orga/${orgaId}/resources`;
  const [showDialog, setShowDialog] = useState(true);

  const [resourceId, setResourceId] = useState(null);

  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, 'content');

  subscribeToEditUiResourceForUpdate((data: { detail: EditUiResourceForUpdateEvent }) => {
    setResourceId(data.detail.resourceIdToEdit);

    setShowDialog(true);
  });

  useEffect(() => {
    setShowDialog(true);
  }, [resourceId]);

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    resourceId && (
      <Modal isOpen={showDialog} toggle={handleClose} size="xl">
        <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
          Operation
        </ModalHeader>
        <ModalBody id="treeportApp.resource.delete.question">
          <div>
            <Row className="justify-content-center"></Row>
            <Row className="justify-content-center">
              <Col md="12">Resource: {resourceId}</Col>
              <Col md="12">
                <pre>{JSON.stringify(resourceContent ? resourceContent : {}, null, 2)}</pre>
              </Col>
            </Row>
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

export default UiResourceUpdateDialog;
