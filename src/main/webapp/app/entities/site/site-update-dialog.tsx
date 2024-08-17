import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { translate, Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntities as getOrganisations } from 'app/entities/organisation/organisation.reducer';
import { getEntities as getSites } from 'app/entities/site/site.reducer';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, updateEntity, createEntity, reset } from './site.reducer';
import { is } from 'immer/dist/internal';

export const SiteUpdateDialog = ({ showModal, setShowModal, siteId, onSuccessUpdate, onSuccessAdd, onCancelEdit, parentSiteId }) => {
  const dispatch = useAppDispatch();

  const organisations = useAppSelector(state => state.organisation.entities);
  const sites = useAppSelector(state => state.site.entities);
  const siteEntity = useAppSelector(state => state.site.entity);
  const updateSuccess = useAppSelector(state => state.site.updateSuccess);

  const loading = useAppSelector(state => state.site.loading);
  const updating = useAppSelector(state => state.site.updating);

  const [isNew, setIsNew] = useState(false);

  const [loadModal, setLoadModal] = useState(false);
  const { orgaId } = useParams<'orgaId'>();

  // useEffect(() => {
  //   console.log('updating site', siteId);
  //   dispatch(getEntity(siteId));
  //   setLoadModal(true);
  // }, []);

  useEffect(() => {
    if (!siteId) {
      dispatch(reset());
    } else {
      dispatch(getEntity({ id: siteId, orgaId }));
    }
  }, [siteId]);

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (updateSuccess) {
      // handleClose();
      // setLoadModal(false);
      console.log('useEffect', isNew, siteEntity, siteId);
      setShowModal(false);
      if (!isNew && siteEntity.id === siteId) {
        onSuccessUpdate(siteEntity);
      } else if (isNew && siteEntity.id) {
        onSuccessAdd(siteEntity);
      }
    }
  }, [updateSuccess]);

  const defaultValues = () =>
    !siteId
      ? {
          parent: { id: parentSiteId },
          orga: { orga: orgaId },
          childrens: [],
          tags: [],
        }
      : {
          ...siteEntity,
          // orga: siteEntity?.orga?.id,
          // parent: siteEntity?.parent?.id,
          // childrens: siteEntity?.childrens?.map(e => e.id.toString()),
        };

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...siteEntity,
      ...values,
    };

    if (!siteId) {
      setIsNew(true);
      dispatch(createEntity({ entity, orgaId }));
    } else {
      setIsNew(false);
      dispatch(updateEntity({ entity, orgaId }));
    }
  };

  return (
    <Modal isOpen={showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="siteDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="treeportApp.site.delete.question">
        <div>
          <Row className="justify-content-center">
            <Col md="8">
              <h2 id="treeportApp.site.home.createOrEditLabel" data-cy="SiteCreateUpdateHeading">
                <Translate contentKey="treeportApp.site.home.createOrEditLabel">Create or edit a Site</Translate>
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
                    id="site-id"
                    readOnly={siteId}
                    label={translate('global.field.id')}
                    validate={{ required: true }}
                  />
                  <ValidatedField label={translate('treeportApp.site.name')} id="site-name" name="name" data-cy="name" type="text" />
                  <ValidatedField
                    label={translate('treeportApp.site.content')}
                    id="site-content"
                    name="content"
                    data-cy="content"
                    type="textarea"
                  />
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/site" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.back">Back</Translate>
                    </span>
                  </Button>
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
        {/* <Button id="jhi-confirm-delete-site" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button> */}
      </ModalFooter>
    </Modal>
  );
};

export default SiteUpdateDialog;
