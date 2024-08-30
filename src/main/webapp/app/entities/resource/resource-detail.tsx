import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

// import { getEntity } from './resource.reducer';
import { MyRend } from '../rendering/sm-resource-content';

export const ResourceDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    // dispatch(getEntity(id));
  }, []);

  const resourceEntity = useAppSelector(state => state.resource.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="resourceDetailsHeading">
          <Translate contentKey="treeportApp.resource.detail.title">Resource</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{resourceEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="treeportApp.resource.name">Name</Translate>
            </span>
          </dt>
          <dd>{resourceEntity.name}</dd>
          <dt>
            <span>Testing component</span>
          </dt>
          <dd>
            <MyRend content={resourceEntity.content}></MyRend>
          </dd>

          <dt>
            <span id="content">
              <Translate contentKey="treeportApp.resource.content">Content</Translate>
            </span>
          </dt>
          <dd>
            <pre>{resourceEntity.content}</pre>
          </dd>
          <dt>
            <Translate contentKey="treeportApp.resource.orga">Orga</Translate>
          </dt>
          <dd>{resourceEntity.orga ? resourceEntity.orga.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.resource.parent">Parent</Translate>
          </dt>
          <dd>{resourceEntity.parent ? resourceEntity.parent.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.resource.childrens">Childrens</Translate>
          </dt>
          <dd>
            {resourceEntity.childrens
              ? resourceEntity.childrens.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {resourceEntity.childrens && i === resourceEntity.childrens.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/resource" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/resource/${resourceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ResourceDetail;
