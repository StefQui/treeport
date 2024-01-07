import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './site.reducer';
import {
  getSites,
  setAction,
  setActivePage,
  setInLocalState,
  setInRenderingStateOutputs,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import {
  buildPath,
  ENTITY_KEY,
  PARAMS_SITE_LIST_SELECTED_SITE_KEY,
  SiteListParams,
  STATE_RS_OUTPUTS_KEY,
  STATE_RS_SELF_KEY,
} from '../rendering/rendering';

export const SiteList = (props: { params: SiteListParams; depth: string; currentPath: string; path: string; localContextPath: string }) => {
  const dispatch = useAppDispatch();

  const initialState = {
    paginationState: {
      activePage: 1,
      itemsPerPage: 10,
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
  // console.log('start', props.path);
  // const listState = useAppSelector(state => {
  //   console.log('start-listState', state.rendering.renderingState[props.path]);
  //   return state.rendering.renderingState[props.path] ? state.rendering.renderingState[props.path].listState : null;
  // });
  const builtPath = buildPath(props);
  const paginationState = useAppSelector(state => {
    return state.rendering.renderingState[builtPath] ? state.rendering.renderingState[builtPath][STATE_RS_SELF_KEY].paginationState : null;
  });

  const siteList = useAppSelector(state =>
    state.rendering.renderingState[builtPath] ? state.rendering.renderingState[builtPath][STATE_RS_SELF_KEY].listState.entities : null,
  );

  const loading = useAppSelector(state =>
    state.rendering.renderingState[builtPath] ? state.rendering.renderingState[builtPath][STATE_RS_SELF_KEY].listState.loading : false,
  );

  const totalItems = useAppSelector(state =>
    state.rendering.renderingState[builtPath] ? state.rendering.renderingState[builtPath][STATE_RS_SELF_KEY].listState.totalItems : null,
  );

  const activePage = useAppSelector(state =>
    state.rendering.renderingState[builtPath]
      ? state.rendering.renderingState[builtPath][STATE_RS_SELF_KEY].paginationState.activePage
      : null,
  );

  useEffect(() => {
    // console.log('useEffect1');
    dispatch(setInRenderingStateSelf({ path: builtPath, value: initialState }));
    // console.log('vvvvvvvvvvvv', loading);
    if (!loading) {
      sortEntities();
    }
  }, []);

  useEffect(() => {
    // console.log('useEffect22', paginationState);
    // dispatch(setRenderingForPath({ path: props.path, value: initialState }));
    // console.log('tttttttttttt', loading);

    if (activePage && !loading) {
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

  // const siteList = useAppSelector(state => state.site.entities);
  // const loading = useAppSelector(state => state.site.loading);
  // const totalItems = useAppSelector(state => state.site.totalItems);

  const getAllSites = () => {
    // console.log('getAllSites', builtPath);
    // const rendering = useAppSelector(state => state.rendering.renderingState[props.refTo]);

    // const listState = getRenderingStateForPath(rendering, props.path);
    // console.log('getAllSites2', rendering);
    const ps = paginationState ? paginationState : initialState.paginationState;
    dispatch(
      getSites({
        page: ps.activePage - 1,
        size: ps.itemsPerPage,
        sort: `${ps.sort},${ps.order}`,
        path: builtPath,
      }),
    );
    // setRs(listState);
  };

  const sortEntities = () => {
    // console.log('sortEntities', builtPath);
    getAllSites();
    // const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    // if (pageLocation.search !== endURL) {
    //   navigate(`${pageLocation.pathname}${endURL}`);
    // }
  };
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
    // console.log('sort', builtPath);
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

  const handleSelect = selected => () => {
    console.log('handleSelect', props.localContextPath, props.params[PARAMS_SITE_LIST_SELECTED_SITE_KEY], selected);
    // dispatch(setInLocalState({ localContextPath: props.localContextPath,       parameterKey: props.params[PARAMS_SITE_LIST_SELECTED_SITE_KEY],value: { value: { entityType: 'SITE', [ENTITY_KEY]: selected } , loading: false} }));
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params[PARAMS_SITE_LIST_SELECTED_SITE_KEY],
        value: { value: selected.id, loading: false },
      }),
    );
    dispatch(setAction({ source: builtPath, actionType: 'selectSite', entity: { entityType: 'SITE', [ENTITY_KEY]: selected } }));
  };

  const handlePagination = currentPage => {
    // console.log('handlePagination', currentPage);
    dispatch(setActivePage({ path: builtPath, value: currentPage }));

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
      {paginationState && siteList ? (
        <div>
          <h2 id="site-heading" data-cy="SiteHeading">
            <Translate contentKey="treeportApp.site.home.title">Sites</Translate>
            <div className="d-flex justify-content-end">
              <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
                <FontAwesomeIcon icon="sync" spin={loading} />{' '}
                <Translate contentKey="treeportApp.site.home.refreshListLabel">Refresh List</Translate>
              </Button>
              <Link to="/site/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
                <FontAwesomeIcon icon="plus" />
                &nbsp;
                <Translate contentKey="treeportApp.site.home.createLabel">Create new Site</Translate>
              </Link>
            </div>
          </h2>
          <div className="table-responsive">
            {siteList && siteList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand" onClick={sort('id')}>
                      <Translate contentKey="treeportApp.site.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                    </th>
                    <th className="hand" onClick={sort('name')}>
                      <Translate contentKey="treeportApp.site.name">Name</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.site.content">Content</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.site.orga">Orga</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th>
                      <Translate contentKey="treeportApp.site.parent">Parent</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {siteList.map((site, i) => (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      <td>
                        <Button tag={Link} to={`/site/${site.id}`} color="link" size="sm">
                          {site.id}
                        </Button>
                      </td>
                      <td>{site.name}</td>
                      <td>{site.content}</td>
                      <td>{site.orga ? <Link to={`/organisation/${site.orga.id}`}>{site.orga.id}</Link> : ''}</td>
                      <td>{site.parent ? <Link to={`/site/${site.parent.id}`}>{site.parent.id}</Link> : ''}</td>
                      <td className="text-end">
                        <div className="btn-group flex-btn-group-container">
                          <Button onClick={handleSelect(site)} color="info" size="sm" data-cy="entitySelectButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.select">Select</Translate>
                            </span>
                          </Button>
                          <Button tag={Link} to={`/coca/render/rpage2?sid=${site.id}`} color="info" size="sm" data-cy="entitySelectButton">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open </span>
                          </Button>
                          <Button tag={Link} to={`/site/${site.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/site/${site.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                              (location.href = `/site/${site.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
                  <Translate contentKey="treeportApp.site.home.notFound">No Sites found</Translate>
                </div>
              )
            )}
          </div>
          {totalItems ? (
            <div className={siteList && siteList.length > 0 ? '' : 'd-none'}>
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

export default SiteList;
