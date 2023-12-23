import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './attribute-config.reducer';

export const AttributeConfig = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const attributeConfigList = useAppSelector(state => state.attributeConfig.entities);
  const loading = useAppSelector(state => state.attributeConfig.loading);
  const totalItems = useAppSelector(state => state.attributeConfig.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="attribute-config-heading" data-cy="AttributeConfigHeading">
        <Translate contentKey="treeportApp.attributeConfig.home.title">Attribute Configs</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="treeportApp.attributeConfig.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/attribute-config/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="treeportApp.attributeConfig.home.createLabel">Create new Attribute Config</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {attributeConfigList && attributeConfigList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="treeportApp.attributeConfig.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('applyOnChildren')}>
                  <Translate contentKey="treeportApp.attributeConfig.applyOnChildren">Apply On Children</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('applyOnChildren')} />
                </th>
                <th className="hand" onClick={sort('isConsolidable')}>
                  <Translate contentKey="treeportApp.attributeConfig.isConsolidable">Is Consolidable</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isConsolidable')} />
                </th>
                <th className="hand" onClick={sort('relatedConfigId')}>
                  <Translate contentKey="treeportApp.attributeConfig.relatedConfigId">Related Config Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('relatedConfigId')} />
                </th>
                <th className="hand" onClick={sort('attributeType')}>
                  <Translate contentKey="treeportApp.attributeConfig.attributeType">Attribute Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('attributeType')} />
                </th>
                <th className="hand" onClick={sort('isWritable')}>
                  <Translate contentKey="treeportApp.attributeConfig.isWritable">Is Writable</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isWritable')} />
                </th>
                <th className="hand" onClick={sort('consoParameterKey')}>
                  <Translate contentKey="treeportApp.attributeConfig.consoParameterKey">Conso Parameter Key</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('consoParameterKey')} />
                </th>
                <th className="hand" onClick={sort('consoOperationType')}>
                  <Translate contentKey="treeportApp.attributeConfig.consoOperationType">Conso Operation Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('consoOperationType')} />
                </th>
                <th>
                  <Translate contentKey="treeportApp.attributeConfig.orga">Orga</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="treeportApp.attributeConfig.site">Site</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {attributeConfigList.map((attributeConfig, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/attribute-config/${attributeConfig.id}`} color="link" size="sm">
                      {attributeConfig.id}
                    </Button>
                  </td>
                  <td>{attributeConfig.applyOnChildren ? 'true' : 'false'}</td>
                  <td>{attributeConfig.isConsolidable ? 'true' : 'false'}</td>
                  <td>{attributeConfig.relatedConfigId}</td>
                  <td>
                    <Translate contentKey={`treeportApp.AttributeType.${attributeConfig.attributeType}`} />
                  </td>
                  <td>{attributeConfig.isWritable ? 'true' : 'false'}</td>
                  <td>{attributeConfig.consoParameterKey}</td>
                  <td>
                    <Translate contentKey={`treeportApp.OperationType.${attributeConfig.consoOperationType}`} />
                  </td>
                  <td>
                    {attributeConfig.orga ? <Link to={`/organisation/${attributeConfig.orga.id}`}>{attributeConfig.orga.id}</Link> : ''}
                  </td>
                  <td>{attributeConfig.site ? <Link to={`/asset/${attributeConfig.site.id}`}>{attributeConfig.site.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/attribute-config/${attributeConfig.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/attribute-config/${attributeConfig.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (location.href = `/attribute-config/${attributeConfig.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="treeportApp.attributeConfig.home.notFound">No Attribute Configs found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={attributeConfigList && attributeConfigList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default AttributeConfig;
