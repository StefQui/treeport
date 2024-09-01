import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteResource } from './resource.reducer';
import { DeleteResourceEvent, publishDeletedResourceEvent, subscribeToDeleteResource } from '../rendering/action.utils';
import axios from 'axios';
import { IResource } from 'app/shared/model/resource.model';
// import { deleteEntity } from './resource.reducer';
export const DeleteResourceDialog = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [resourceToDeleteId, setResourceToDeleteId] = useState(null);
  const [route, setRoute] = useState(null);
  subscribeToDeleteResource((data: { detail: DeleteResourceEvent }) => {
    setResourceToDeleteId(data.detail.resourceToDeleteId);
    setRoute(data.detail.route);
    setIsLoaded(true);
  });
  return isLoaded && <ResourceDeleteDialog resourceToDeleteId={resourceToDeleteId} route={route}></ResourceDeleteDialog>;
};

export const ResourceDeleteDialog = (props: { resourceToDeleteId: string; route: string[] | null }) => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const { orgaId } = useParams<'orgaId'>();

  const apiUrl = `api/orga/${orgaId}/resources`;
  const [showDialog, setShowDialog] = useState(true);

  const [resourceToDeleteId, setResourceToDeleteId] = useState(null);
  const [route, setRoute] = useState(null);

  // useEffect(() => {
  //   dispatch(getEntity({ id, orgaId }));
  //   setLoadModal(true);
  // }, []);
  subscribeToDeleteResource((data: { detail: DeleteResourceEvent }) => {
    setResourceToDeleteId(data.detail.resourceToDeleteId);
    setRoute(data.detail.route);
    setShowDialog(true);
  });

  useEffect(() => {
    setResourceToDeleteId(props.resourceToDeleteId);
    setRoute(props.route);
  }, []);

  const handleClose = () => {
    setShowDialog(false);
  };

  // useEffect(() => {
  //   if (updateSuccess) {
  //     console.log('');
  //     if (resourceEntity.id) {
  //       return;
  //     }

  //     setShowModal(false);
  //     onSuccessDelete();
  //     // setLoadModal(false);
  //   }
  // }, [updateSuccess]);

  const confirmDelete = async () => {
    try {
      const data = await axios.delete<IResource>(`${apiUrl}/${resourceToDeleteId}`);

      publishDeletedResourceEvent({
        source: 'noSource',
        resourceId: resourceToDeleteId,
        route,
      });
      handleClose();
    } catch (err) {
      console.log('cannoe delete', err);
    }

    // dispatch(deleteResource({ id: resourceId, orgaId }));
  };

  return (
    <Modal isOpen={showDialog} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="treeportApp.resource.delete.question">
        <Translate contentKey="treeportApp.resource.delete.question" interpolate={{ id: resourceToDeleteId }}>
          Are you sure you want to delete this Resource?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-resource" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ResourceDeleteDialog;
