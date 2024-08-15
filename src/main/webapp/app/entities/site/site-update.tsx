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
import { ISite } from 'app/shared/model/site.model';
import { getEntity, updateEntity, createEntity, reset } from './site.reducer';

export const SiteUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;
  const { orgaId } = useParams<'orgaId'>();

  const organisations = useAppSelector(state => state.organisation.entities);
  const sites = useAppSelector(state => state.site.entities);
  const siteEntity = useAppSelector(state => state.site.entity);
  const loading = useAppSelector(state => state.site.loading);
  const updating = useAppSelector(state => state.site.updating);
  const updateSuccess = useAppSelector(state => state.site.updateSuccess);

  const handleClose = () => {
    navigate('/site' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity({ id, orgaId }));
    }

    dispatch(getOrganisations({}));
    dispatch(getSites({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    const entity = {
      ...siteEntity,
      ...values,
      childrens: mapIdList(values.childrens),
      orga: values.orga ? organisations.find(it => (it.id && it.id.toString()) === values.orga.toString()) : null,
      parent: values.parent ? sites.find(it => (it.id && it.id.toString()) === values.parent.toString()) : null,
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
          ...siteEntity,
          orga: siteEntity?.orga?.id,
          parent: siteEntity?.parent?.id,
          childrens: siteEntity?.childrens?.map(e => e.id.toString()),
        };

  return (
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
                readOnly={!isNew}
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
              <ValidatedField
                id="site-orga"
                name="orga"
                required
                data-cy="orga"
                label={`${translate('treeportApp.site.orga')} (required)`}
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
              <ValidatedField id="site-parent" name="parent" data-cy="parent" label={translate('treeportApp.site.parent')} type="select">
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
                label={translate('treeportApp.site.childrens')}
                id="site-childrens"
                data-cy="childrens"
                type="select"
                multiple
                name="childrens"
              >
                <option value="" key="0" />
                {sites
                  ? sites.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
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
    </div>
  );
};

export default SiteUpdate;
