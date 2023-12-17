import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './asset.reducer';
import { MyRend } from '../rendering/rendering';

export const AssetDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const assetEntity = useAppSelector(state => state.asset.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="assetDetailsHeading">
          <Translate contentKey="treeportApp.asset.detail.title">Asset</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{assetEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="treeportApp.asset.name">Name</Translate>
            </span>
          </dt>
          <dd>{assetEntity.name}</dd>
          <dt>
            <span>Testing component</span>
          </dt>
          <dd>
            <MyRend content={assetEntity.content}></MyRend>
          </dd>

          <dt>
            <span id="content">
              <Translate contentKey="treeportApp.asset.content">Content</Translate>
            </span>
          </dt>
          <dd>
            <pre>{assetEntity.content}</pre>
          </dd>
          <dt>
            <span id="type">
              <Translate contentKey="treeportApp.asset.type">Type</Translate>
            </span>
          </dt>
          <dd>{assetEntity.type}</dd>
          <dt>
            <Translate contentKey="treeportApp.asset.orga">Orga</Translate>
          </dt>
          <dd>{assetEntity.orga ? assetEntity.orga.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.asset.parent">Parent</Translate>
          </dt>
          <dd>{assetEntity.parent ? assetEntity.parent.id : ''}</dd>
          <dt>
            <Translate contentKey="treeportApp.asset.childrens">Childrens</Translate>
          </dt>
          <dd>
            {assetEntity.childrens
              ? assetEntity.childrens.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {assetEntity.childrens && i === assetEntity.childrens.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/asset" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/asset/${assetEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AssetDetail;
