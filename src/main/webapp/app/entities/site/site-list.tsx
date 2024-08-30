import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getPaginationState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import {
  setAction,
  setActivePage,
  setInLocalState,
  setInRenderingStateOutputs,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import { buildPath } from '../rendering/shared';
import { RenderingSliceState, ResourceListParams } from '../rendering/type';

export const SiteList = (props: {
  params: ResourceListParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  return <div></div>;
};

export default SiteList;
