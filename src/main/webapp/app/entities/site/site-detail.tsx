import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './site.reducer';
import { MyRend } from 'app/entities/rendering/rendering';

export const SiteDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const siteEntity = useAppSelector(state => state.site.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="siteDetailsHeading">
          <Translate contentKey="treeportApp.site.detail.title">Site</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{siteEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="treeportApp.site.name">Name</Translate>
            </span>
          </dt>
          <dd>{siteEntity.name}</dd>
          <dt>
            <span>Testing component</span>
          </dt>
          <dd>
            <MyRend content={siteEntity.content}></MyRend>
          </dd>

          <dt>
            <span id="content">
              <Translate contentKey="treeportApp.site.content">Content</Translate>
            </span>
          </dt>
          <dd>
            <pre>{siteEntity.content}</pre>
          </dd>
          <dt>
            <Translate contentKey="treeportApp.site.orga">Orga</Translate>
          </dt>
          <dd>{siteEntity.orga ? siteEntity.orga.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.site.parent">Parent</Translate>
          </dt>
          <dd>{siteEntity.parent ? siteEntity.parent.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.site.childrens">Childrens</Translate>
          </dt>
          <dd>
            {siteEntity.childrens
              ? siteEntity.childrens.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {siteEntity.childrens && i === siteEntity.childrens.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/site" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/site/${siteEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SiteDetail;
