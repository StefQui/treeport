import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './site.reducer';

export const SiteDeleteDialog = ({ showModal, setShowModal, siteId, onSuccessDelete, onCancelDelete }) => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const { orgaId } = useParams<'orgaId'>();

  const [loadModal, setLoadModal] = useState(false);
  const siteEntity = useAppSelector(state => state.site.entity);

  // useEffect(() => {
  //   dispatch(getEntity({ id, orgaId }));
  //   setLoadModal(true);
  // }, []);

  // const siteEntity = useAppSelector(state => state.site.entity);
  const updateSuccess = useAppSelector(state => state.site.updateSuccess);

  const handleClose = () => {
    setShowModal(false);
    // onCloseDelete(siteId);
  };

  useEffect(() => {
    if (updateSuccess) {
      console.log('');
      if (siteEntity.id) {
        return;
      }

      setShowModal(false);
      onSuccessDelete();
      // setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity({ id: siteId, orgaId }));
  };

  return (
    <Modal isOpen={showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="siteDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="treeportApp.site.delete.question">
        <Translate contentKey="treeportApp.site.delete.question" interpolate={{ id: siteId }}>
          Are you sure you want to delete this Site?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-site" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SiteDeleteDialog;
