import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { getEntities as getAttributeConfigs } from 'app/entities/attribute-config/attribute-config.reducer';
import { getEntities as getOrganisations } from 'app/entities/organisation/organisation.reducer';

import { IAttribute } from 'app/shared/model/attribute.model';
import { getEntities as getAttributes } from 'app/entities/attribute/attribute.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntity, updateEntity, createEntity, reset } from './tag.reducer';

export const TagUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const organisations = useAppSelector(state => state.organisation.entities);
  const attributeConfigs = useAppSelector(state => state.attributeConfig.entities);
  const attributes = useAppSelector(state => state.attribute.entities);
  const tagEntity = useAppSelector(state => state.tag.entity);
  const loading = useAppSelector(state => state.tag.loading);
  const updating = useAppSelector(state => state.tag.updating);
  const updateSuccess = useAppSelector(state => state.tag.updateSuccess);

  const handleClose = () => {
    navigate('/tag' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getAttributeConfigs({}));
    dispatch(getAttributes({}));
    dispatch(getOrganisations({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...tagEntity,
      ...values,
      orga: organisations.find(it => it.id.toString() === values.orga.toString()),
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
          ...tagEntity,
          orga: tagEntity?.orga?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="treeportApp.tag.home.createOrEditLabel" data-cy="TagCreateUpdateHeading">
            <Translate contentKey="treeportApp.tag.home.createOrEditLabel">Create or edit a Tag</Translate>
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
                id="tag-id"
                readOnly={!isNew}
                label={translate('global.field.id')}
                validate={{ required: true }}
              />
              <ValidatedField label={translate('treeportApp.tag.name')} id="tag-name" name="name" data-cy="name" type="text" />
              <ValidatedField id="tag-orga" name="orga" data-cy="orga" label={translate('treeportApp.tag.orga')} type="select">
                <option value="" key="0" />
                {organisations
                  ? organisations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/tag" replace color="info">
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

export default TagUpdate;
