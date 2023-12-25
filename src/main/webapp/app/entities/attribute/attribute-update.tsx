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
import { getEntities as getSites } from 'app/entities/site/site.reducer';
import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { getEntities as getAttributeConfigs } from 'app/entities/attribute-config/attribute-config.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { IAttribute } from 'app/shared/model/attribute.model';
import { getEntity, updateEntity, createEntity, reset } from './attribute.reducer';

export const AttributeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const organisations = useAppSelector(state => state.organisation.entities);
  const sites = useAppSelector(state => state.site.entities);
  const attributeConfigs = useAppSelector(state => state.attributeConfig.entities);
  const tags = useAppSelector(state => state.tag.entities);
  const attributeEntity = useAppSelector(state => state.attribute.entity);
  const loading = useAppSelector(state => state.attribute.loading);
  const updating = useAppSelector(state => state.attribute.updating);
  const updateSuccess = useAppSelector(state => state.attribute.updateSuccess);

  const handleClose = () => {
    navigate('/attribute' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getOrganisations({}));
    dispatch(getSites({}));
    dispatch(getAttributeConfigs({}));
    dispatch(getTags({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...attributeEntity,
      ...values,
      tags: mapIdList(values.tags),
      orga: organisations.find(it => it.id.toString() === values.orga.toString()),
      site: sites.find(it => it.id.toString() === values.site.toString()),
      config: attributeConfigs.find(it => it.id.toString() === values.config.toString()),
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
          ...attributeEntity,
          orga: attributeEntity?.orga?.id,
          site: attributeEntity?.site?.id,
          config: attributeEntity?.config?.id,
          tags: attributeEntity?.tags?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="treeportApp.attribute.home.createOrEditLabel" data-cy="AttributeCreateUpdateHeading">
            <Translate contentKey="treeportApp.attribute.home.createOrEditLabel">Create or edit a Attribute</Translate>
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
                id="attribute-id"
                readOnly={!isNew}
                label={translate('global.field.id')}
                validate={{ required: true }}
              />
              <ValidatedField
                label={translate('treeportApp.attribute.isAgg')}
                id="attribute-isAgg"
                name="isAgg"
                data-cy="isAgg"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('treeportApp.attribute.hasConfigError')}
                id="attribute-hasConfigError"
                name="hasConfigError"
                data-cy="hasConfigError"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('treeportApp.attribute.configError')}
                id="attribute-configError"
                name="configError"
                data-cy="configError"
                type="text"
              />
              <ValidatedField id="attribute-orga" name="orga" data-cy="orga" label={translate('treeportApp.attribute.orga')} type="select">
                <option value="" key="0" />
                {organisations
                  ? organisations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="attribute-site" name="site" data-cy="site" label={translate('treeportApp.attribute.site')} type="select">
                <option value="" key="0" />
                {sites
                  ? sites.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="attribute-config"
                name="config"
                data-cy="config"
                label={translate('treeportApp.attribute.config')}
                type="select"
              >
                <option value="" key="0" />
                {attributeConfigs
                  ? attributeConfigs.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('treeportApp.attribute.tags')}
                id="attribute-tags"
                data-cy="tags"
                type="select"
                multiple
                name="tags"
              >
                <option value="" key="0" />
                {tags
                  ? tags.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/attribute" replace color="info">
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

export default AttributeUpdate;
