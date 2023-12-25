import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IOrganisation } from 'app/shared/model/organisation.model';
import { getEntities as getOrganisations } from 'app/entities/organisation/organisation.reducer';
import { getEntities as getResources } from 'app/entities/resource/resource.reducer';
import { IResource } from 'app/shared/model/resource.model';
import { getEntity, updateEntity, createEntity, reset } from './resource.reducer';

export const ResourceUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const organisations = useAppSelector(state => state.organisation.entities);
  const resources = useAppSelector(state => state.resource.entities);
  const resourceEntity = useAppSelector(state => state.resource.entity);
  const loading = useAppSelector(state => state.resource.loading);
  const updating = useAppSelector(state => state.resource.updating);
  const updateSuccess = useAppSelector(state => state.resource.updateSuccess);

  const handleClose = () => {
    navigate('/resource' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getOrganisations({}));
    dispatch(getResources({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...resourceEntity,
      ...values,
      childrens: mapIdList(values.childrens),
      orga: values.orga ? organisations.find(it => (it.id && it.id.toString()) === values.orga.toString()) : null,
      parent: values.parent ? resources.find(it => (it.id && it.id.toString()) === values.parent.toString()) : null,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...resourceEntity,
          orga: resourceEntity?.orga?.id,
          parent: resourceEntity?.parent?.id,
          childrens: resourceEntity?.childrens?.map(e => e.id.toString()),
        };

  return (
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
                readOnly={!isNew}
                label={translate('global.field.id')}
                validate={{ required: true }}
              />
              <ValidatedField label={translate('treeportApp.resource.name')} id="resource-name" name="name" data-cy="name" type="text" />
              <ValidatedField
                label={translate('treeportApp.resource.content')}
                id="resource-content"
                name="content"
                data-cy="content"
                type="textarea"
              />
              <ValidatedField
                id="resource-orga"
                name="orga"
                required
                data-cy="orga"
                label={`${translate('treeportApp.resource.orga')} (required)`}
                type="select"
              >
                <option value="" key="0" />
                {organisations
                  ? organisations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="resource-parent"
                name="parent"
                data-cy="parent"
                label={translate('treeportApp.resource.parent')}
                type="select"
              >
                <option value="" key="0" />
                {resources
                  ? resources.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('treeportApp.resource.childrens')}
                id="resource-childrens"
                data-cy="childrens"
                type="select"
                multiple
                name="childrens"
              >
                <option value="" key="0" />
                {resources
                  ? resources.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/resource" replace color="info">
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
    </div>
  );
};

export default ResourceUpdate;
