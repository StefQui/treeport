import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './asset.reducer';
import { getSites, setActivePage, setRenderingForPath } from './rendering.reducer';

export const AssetList = props => {
  const dispatch = useAppDispatch();

  const initialState = {
    paginationState: {
      activePage: 1,
      itemsPerPage: 2,
      sort: 'id',
      order: 'asc',
    },
    listState: {
      loading: false,
      errorMessage: null,
      entities: [],
      entity: null,
      updating: false,
      totalItems: 0,
      updateSuccess: false,
    },
  };

  // const pageLocation = useLocation();
  // const navigate = useNavigate();
  console.log('start', props.path);
  // const listState = useAppSelector(state => {
  //   console.log('start-listState', state.rendering.renderingState[props.path]);
  //   return state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].listState : null;
  // });
  const paginationState = useAppSelector(state => {
    console.log('start-paginationState', state.rendering.renderingState[props.path]);

    return state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].paginationState : null;
  });

  const assetList = useAppSelector(state =>
    state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].listState.entities : null,
  );

  const loading = useAppSelector(state =>
    state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].listState.loading : null,
  );

  const totalItems = useAppSelector(state =>
    state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].listState.totalItems : null,
  );

  const activePage = useAppSelector(state =>
    state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].paginationState.activePage : null,
  );

  useEffect(() => {
    console.log('useEffect1');
    dispatch(setRenderingForPath({ path: props.path, value: initialState }));
    sortEntities();
  }, []);

  useEffect(() => {
    console.log('useEffect22', paginationState);
    // dispatch(setRenderingForPath({ path: props.path, value: initialState }));

    if (activePage) {
      sortEntities();
    }
  }, [activePage]);

  // const [paginationState, setPaginationState] = useState(
  //   {
  //     activePage: 0,
  //     itemsPerPage: 4,
  //     sort: 'id',
  //     order: 'asc',
  //   },
  //   // overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  // );

  // const assetList = useAppSelector(state => state.asset.entities);
  // const loading = useAppSelector(state => state.asset.loading);
  // const totalItems = useAppSelector(state => state.asset.totalItems);

  const getAllSites = () => {
    console.log('getAllSites', props.path);
    // const rendering = useAppSelector(state => state.rendering.renderingState[props.refTo]);

    // const listState = getRenderingStateForPath(rendering, props.path);
    // console.log('getAllSites2', rendering);
    const ps = paginationState ? paginationState : initialState.paginationState;
    dispatch(
      getSites({
        page: ps.activePage - 1,
        size: ps.itemsPerPage,
        sort: `${ps.sort},${ps.order}`,
        path: props.path,
      }),
    );
    // setRs(listState);
  };

  const sortEntities = () => {
    console.log('sortEntities', props.path);
    getAllSites();
    // const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    // if (pageLocation.search !== endURL) {
    //   navigate(`${pageLocation.pathname}${endURL}`);
    // }
  };

  useEffect(() => {
    // console.log('useEffect2', props.path);
    // const renderingState = getRenderingStateForPath(rendering, props.path);
    // sortEntities();
    // }, [renderingState.paginationState.activePage, renderingState.paginationState.order, renderingState.paginationState.sort]);
  }, []);

  // useEffect(() => {
  //   const params = new URLSearchParams(pageLocation.search);
  //   const page = params.get('page');
  //   const sort = params.get(SORT);
  //   if (page && sort) {
  //     const sortSplit = sort.split(',');
  //     setPaginationState({
  //       ...paginationState,
  //       activePage: +page,
  //       sort: sortSplit[0],
  //       order: sortSplit[1],
  //     });
  //   }
  // }, [pageLocation.search]);

  const sort = p => () => {
    console.log('sort', props.path);
    // const listState = getRenderingStateForPath(rendering, props.path);
    // setStateForPath({
    //   path: props.path,
    //   value: {
    //     ...listState,
    //     order: listState.order === ASC ? DESC : ASC,
    //     sort: p,
    //   },
    // });
    // setRs(listState);

    // setPaginationState({
    //   ...paginationState,
    //   order: paginationState.order === ASC ? DESC : ASC,
    //   sort: p,
    // });
  };

  const handlePagination = currentPage => {
    console.log('handlePagination', currentPage);
    dispatch(setActivePage({ path: props.path, value: currentPage }));

    // const listState = getRenderingStateForPath(rendering, props.path);
    // setStateForPath({
    //   ...listState,
    //   activePage: currentPage,
    // });
    // setRs(listState);
  };

  // setPaginationState({
  //     ...paginationState,
  //     activePage: currentPage,
  //   });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    // const renderingState = getRenderingStateForPath(rendering, props.path);
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
      {paginationState && assetList ? (
        <div>
          <h2 id="asset-heading" data-cy="AssetHeading">
            <Translate contentKey="treeportApp.asset.home.title">Assets</Translate>
            <div className="d-flex justify-content-end">
              <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                <Translate contentKey="treeportApp.asset.home.refreshListLabel">Refresh List</Translate>
              </Button>
              <Link to="/asset/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
                <FontAwesomeIcon icon="plus" />
                &nbsp;
                <Translate contentKey="treeportApp.asset.home.createLabel">Create new Asset</Translate>
              </Link>
            </div>
          </h2>
          <div className="table-responsive">
            {assetList && assetList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand" onClick={sort('id')}>
                      <Translate contentKey="treeportApp.asset.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                    </th>
                    <th className="hand" onClick={sort('name')}>
                      <Translate contentKey="treeportApp.asset.name">Name</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.asset.content">Content</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand" onClick={sort('type')}>
                      <Translate contentKey="treeportApp.asset.type">Type</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('type')} />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.asset.orga">Orga</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.asset.parent">Parent</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {assetList.map((asset, i) => (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      <td>
                        <Button tag={Link} to={`/asset/${asset.id}`} color="link" size="sm">
                          {asset.id}
                        </Button>
                      </td>
                      <td>{asset.name}</td>
                      <td>{asset.content}</td>
                      <td>
                        <Translate contentKey={`treeportApp.AssetType.${asset.type}`} />
                      </td>
                      <td>{asset.orga ? <Link to={`/organisation/${asset.orga.id}`}>{asset.orga.id}</Link> : ''}</td>
                      <td>{asset.parent ? <Link to={`/asset/${asset.parent.id}`}>{asset.parent.id}</Link> : ''}</td>
                      <td className="text-end">
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`/asset/${asset.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/asset/${asset.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                              (location.href = `/asset/${asset.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
                  <Translate contentKey="treeportApp.asset.home.notFound">No Assets found</Translate>
                </div>
              )
            )}
          </div>
          {totalItems ? (
            <div className={assetList && assetList.length > 0 ? '' : 'd-none'}>
              <div className="justify-content-center d-flex">
                <JhiItemCount
                  page={paginationState.activePage}
                  total={totalItems}
                  itemsPerPage={paginationState.itemsPerPage}
                  i18nEnabled
                />
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
      ) : (
        <div>No list state yet</div>
      )}
    </div>
  );
};

export default AssetList;
