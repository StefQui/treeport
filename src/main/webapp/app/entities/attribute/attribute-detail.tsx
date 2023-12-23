import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './attribute.reducer';

export const AttributeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const attributeEntity = useAppSelector(state => state.attribute.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="attributeDetailsHeading">
          <Translate contentKey="treeportApp.attribute.detail.title">Attribute</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{attributeEntity.id}</dd>
          <dt>
            <span id="isAgg">
              <Translate contentKey="treeportApp.attribute.isAgg">Is Agg</Translate>
            </span>
          </dt>
          <dd>{attributeEntity.isAgg ? 'true' : 'false'}</dd>
          <dt>
            <span id="hasConfigError">
              <Translate contentKey="treeportApp.attribute.hasConfigError">Has Config Error</Translate>
            </span>
          </dt>
          <dd>{attributeEntity.hasConfigError ? 'true' : 'false'}</dd>
          <dt>
            <span id="configError">
              <Translate contentKey="treeportApp.attribute.configError">Config Error</Translate>
            </span>
          </dt>
          <dd>{attributeEntity.configError}</dd>
          <dt>
            <Translate contentKey="treeportApp.attribute.orga">Orga</Translate>
          </dt>
          <dd>{attributeEntity.orga ? attributeEntity.orga.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.attribute.site">Site</Translate>
          </dt>
          <dd>{attributeEntity.site ? attributeEntity.site.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.attribute.config">Config</Translate>
          </dt>
          <dd>{attributeEntity.config ? attributeEntity.config.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.attribute.tags">Tags</Translate>
          </dt>
          <dd>
            {attributeEntity.tags
              ? attributeEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {attributeEntity.tags && i === attributeEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/attribute" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/attribute/${attributeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AttributeDetail;
