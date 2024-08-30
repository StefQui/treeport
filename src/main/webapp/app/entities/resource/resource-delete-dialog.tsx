import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { deleteEntity } from './resource.reducer';

export const ResourceDeleteDialog = ({ showModal, setShowModal, resourceId, onSuccessDelete, onCancelDelete }) => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const { orgaId } = useParams<'orgaId'>();

  const [loadModal, setLoadModal] = useState(false);
  const resourceEntity = useAppSelector(state => state.resource.entity);

  // useEffect(() => {
  //   dispatch(getEntity({ id, orgaId }));
  //   setLoadModal(true);
  // }, []);

  // const resourceEntity = useAppSelector(state => state.resource.entity);
  const updateSuccess = useAppSelector(state => state.resource.updateSuccess);

  const handleClose = () => {
    setShowModal(false);
    // onCloseDelete(resourceId);
  };

  useEffect(() => {
    if (updateSuccess) {
      console.log('');
      if (resourceEntity.id) {
        return;
      }

      setShowModal(false);
      onSuccessDelete();
      // setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    // dispatch(deleteEntity({ id: resourceId, orgaId }));
  };

  return (
    <Modal isOpen={showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="treeportApp.resource.delete.question">
        <Translate contentKey="treeportApp.resource.delete.question" interpolate={{ id: resourceId }}>
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
