import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { translate, Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntities as getOrganisations } from 'app/entities/organisation/organisation.reducer';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { is } from 'immer/dist/internal';
import { createResource, getResource, reset, updateResource } from './resource.reducer';

export const ResourceUpdateDialog = ({
  showModal,
  setShowModal,
  resourceId,
  onSuccessUpdate,
  onSuccessAdd,
  onCancelEdit,
  parentResourceId,
  columnDefinitions,
}) => {
  const dispatch = useAppDispatch();

  const organisations = useAppSelector(state => state.organisation.entities);
  const resources = useAppSelector(state => state.resource.entities);
  const resourceEntity = useAppSelector(state => state.resource.entity);
  const entityAndImpacters = useAppSelector(state => state.resource.entityAndImpacters);
  const updateSuccess = useAppSelector(state => state.resource.updateSuccess);

  const loading = useAppSelector(state => state.resource.loading);
  const updating = useAppSelector(state => state.resource.updating);

  const [isNew, setIsNew] = useState(false);

  const [loadModal, setLoadModal] = useState(false);
  const { orgaId } = useParams<'orgaId'>();

  // useEffect(() => {
  //   console.log('updating resource', resourceId);
  //   dispatch(getEntity(resourceId));
  //   setLoadModal(true);
  // }, []);

  useEffect(() => {
    if (!resourceId) {
      dispatch(reset());
    } else {
      dispatch(getResource({ id: resourceId, orgaId }));
    }
  }, [resourceId]);

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (updateSuccess) {
      // handleClose();
      // setLoadModal(false);
      console.log('useEffect', isNew, entityAndImpacters, resourceId);
      setShowModal(false);
      if (!isNew && entityAndImpacters && entityAndImpacters.resource && entityAndImpacters.resource.id === resourceId) {
        onSuccessUpdate(entityAndImpacters);
      } else if (isNew && entityAndImpacters && entityAndImpacters.resource && entityAndImpacters.resource.id) {
        onSuccessAdd(entityAndImpacters);
      }
    }
  }, [updateSuccess]);

  const defaultValues = () =>
    !resourceId
      ? {
          parent: { id: parentResourceId },
          orga: { orga: orgaId },
          childrens: [],
          tags: [],
          tagsAsString: '',
        }
      : {
          ...resourceEntity,
          tagsAsString: resourceEntity.tags ? resourceEntity.tags.map(t => t.id).join(',') : '',
          // orga: resourceEntity?.orga?.id,
          // parent: resourceEntity?.parent?.id,
          // childrens: resourceEntity?.childrens?.map(e => e.id.toString()),
        };

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...resourceEntity,
      ...values,
      tags: values.tagsAsString.split(',').length > 0 ? values.tagsAsString.split(',').map(t => ({ id: t, orga: { id: orgaId } })) : [],
      tagsAsString: undefined,
      childrenCount: undefined,
    };

    if (!resourceId) {
      setIsNew(true);
      dispatch(createResource({ entity, orgaId, columnDefinitions }));
    } else {
      setIsNew(false);
      dispatch(updateResource({ entity, orgaId, columnDefinitions }));
    }
  };

  return (
    <Modal isOpen={showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="resourceDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="treeportApp.resource.delete.question">
        <div>
          <Row className="justify-content-center">
            <Col md="8">
              <h2 id="treeportApp.resource.home.createOrEditLabel" data-cy="ResourceCreateUpdateHeading">
                <Translate contentKey="treeportApp.resource.home.createOrEditLabel">Create or edit a Resource</Translate>
              </h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  <ValidatedField
                    name="id"
                    required
                    id="resource-id"
                    readOnly={resourceId}
                    label={translate('global.field.id')}
                    validate={{ required: true }}
                  />
                  <ValidatedField label={'Type'} id="resource-type" name="type" data-cy="type" type="text" />
                  <ValidatedField
                    label={translate('treeportApp.resource.name')}
                    id="resource-name"
                    name="name"
                    data-cy="name"
                    type="text"
                  />
                  <ValidatedField label={'Tags'} id="resource-tagsAsString" name="tagsAsString" data-cy="name" type="text" />
                  <ValidatedField
                    label={translate('treeportApp.resource.content')}
                    id="resource-content"
                    name="content"
                    data-cy="content"
                    type="textarea"
                  />
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </Button>
                </ValidatedForm>
              )}
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
  );
};

export default ResourceUpdateDialog;
