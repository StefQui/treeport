import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './attribute-config.reducer';

export const AttributeConfigDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const attributeConfigEntity = useAppSelector(state => state.attributeConfig.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="attributeConfigDetailsHeading">
          <Translate contentKey="treeportApp.attributeConfig.detail.title">AttributeConfig</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.id}</dd>
          <dt>
            <span id="id">
              <Translate contentKey="global.field.label">Label</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.label}</dd>
          <dt>
            <span id="applyOnChildren">
              <Translate contentKey="treeportApp.attributeConfig.applyOnChildren">Apply On Children</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.applyOnChildren ? 'true' : 'false'}</dd>
          <dt>
            <span id="isConsolidable">
              <Translate contentKey="treeportApp.attributeConfig.isConsolidable">Is Consolidable</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.isConsolidable ? 'true' : 'false'}</dd>
          <dt>
            <span id="relatedConfigId">
              <Translate contentKey="treeportApp.attributeConfig.relatedConfigId">Related Config Id</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.relatedConfigId}</dd>
          <dt>
            <span id="attributeType">
              <Translate contentKey="treeportApp.attributeConfig.attributeType">Attribute Type</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.attributeType}</dd>
          <dt>
            <span id="isWritable">
              <Translate contentKey="treeportApp.attributeConfig.isWritable">Is Writable</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.isWritable ? 'true' : 'false'}</dd>
          <dt>
            <span id="consoParameterKey">
              <Translate contentKey="treeportApp.attributeConfig.consoParameterKey">Conso Parameter Key</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.consoParameterKey}</dd>
          <dt>
            <span id="consoOperationType">
              <Translate contentKey="treeportApp.attributeConfig.consoOperationType">Conso Operation Type</Translate>
            </span>
          </dt>
          <dd>{attributeConfigEntity.consoOperationType}</dd>
          <dt>
            <Translate contentKey="treeportApp.attributeConfig.orga">Orga</Translate>
          </dt>
          <dd>{attributeConfigEntity.orga ? attributeConfigEntity.orga.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.attributeConfig.site">Site</Translate>
          </dt>
          <dd>{attributeConfigEntity.site ? attributeConfigEntity.site.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.attributeConfig.tags">Tags</Translate>
          </dt>
          <dd>
            {attributeConfigEntity.tags
              ? attributeConfigEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {attributeConfigEntity.tags && i === attributeConfigEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/attribute-config" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/attribute-config/${attributeConfigEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AttributeConfigDetail;
