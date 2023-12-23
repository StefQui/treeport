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
import { IAsset } from 'app/shared/model/asset.model';
import { getEntities as getAssets } from 'app/entities/asset/asset.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { AttributeType } from 'app/shared/model/enumerations/attribute-type.model';
import { OperationType } from 'app/shared/model/enumerations/operation-type.model';
import { getEntity, updateEntity, createEntity, reset } from './attribute-config.reducer';

export const AttributeConfigUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const organisations = useAppSelector(state => state.organisation.entities);
  const assets = useAppSelector(state => state.asset.entities);
  const tags = useAppSelector(state => state.tag.entities);
  const attributeConfigEntity = useAppSelector(state => state.attributeConfig.entity);
  const loading = useAppSelector(state => state.attributeConfig.loading);
  const updating = useAppSelector(state => state.attributeConfig.updating);
  const updateSuccess = useAppSelector(state => state.attributeConfig.updateSuccess);
  const attributeTypeValues = Object.keys(AttributeType);
  const operationTypeValues = Object.keys(OperationType);

  const handleClose = () => {
    navigate('/attribute-config' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getOrganisations({}));
    dispatch(getAssets({}));
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
      ...attributeConfigEntity,
      ...values,
      tags: mapIdList(values.tags),
      orga: organisations.find(it => it.id.toString() === values.orga.toString()),
      site: assets.find(it => it.id.toString() === values.site.toString()),
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
          attributeType: 'LONG',
          consoOperationType: 'CHILDREN_SUM',
          ...attributeConfigEntity,
          orga: attributeConfigEntity?.orga?.id,
          site: attributeConfigEntity?.site?.id,
          tags: attributeConfigEntity?.tags?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="treeportApp.attributeConfig.home.createOrEditLabel" data-cy="AttributeConfigCreateUpdateHeading">
            <Translate contentKey="treeportApp.attributeConfig.home.createOrEditLabel">Create or edit a AttributeConfig</Translate>
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
                id="attribute-config-id"
                readOnly={!isNew}
                label={translate('global.field.id')}
                validate={{ required: true }}
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.applyOnChildren')}
                id="attribute-config-applyOnChildren"
                name="applyOnChildren"
                data-cy="applyOnChildren"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.isConsolidable')}
                id="attribute-config-isConsolidable"
                name="isConsolidable"
                data-cy="isConsolidable"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.relatedConfigId')}
                id="attribute-config-relatedConfigId"
                name="relatedConfigId"
                data-cy="relatedConfigId"
                type="text"
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.attributeType')}
                id="attribute-config-attributeType"
                name="attributeType"
                data-cy="attributeType"
                type="select"
              >
                {attributeTypeValues.map(attributeType => (
                  <option value={attributeType} key={attributeType}>
                    {translate('treeportApp.AttributeType.' + attributeType)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('treeportApp.attributeConfig.isWritable')}
                id="attribute-config-isWritable"
                name="isWritable"
                data-cy="isWritable"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.consoParameterKey')}
                id="attribute-config-consoParameterKey"
                name="consoParameterKey"
                data-cy="consoParameterKey"
                type="text"
              />
              <ValidatedField
                label={translate('treeportApp.attributeConfig.consoOperationType')}
                id="attribute-config-consoOperationType"
                name="consoOperationType"
                data-cy="consoOperationType"
                type="select"
              >
                {operationTypeValues.map(operationType => (
                  <option value={operationType} key={operationType}>
                    {translate('treeportApp.OperationType.' + operationType)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="attribute-config-orga"
                name="orga"
                data-cy="orga"
                label={translate('treeportApp.attributeConfig.orga')}
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
                id="attribute-config-site"
                name="site"
                data-cy="site"
                label={translate('treeportApp.attributeConfig.site')}
                type="select"
              >
                <option value="" key="0" />
                {assets
                  ? assets.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('treeportApp.attributeConfig.tags')}
                id="attribute-config-tags"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/attribute-config" replace color="info">
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

export default AttributeConfigUpdate;
