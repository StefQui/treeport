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
  getSites,
  searchResources,
  setAction,
  setActivePage,
  setAnyInCorrectState,
  setInCorrectState,
  setInLocalState,
  setInRenderingStateOutputs,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import {
  ActionState,
  AndFilter,
  applyPath,
  AttributeColumnDefinition,
  buildPath,
  ColumnDefinition,
  ColumnDefinitions,
  DatasetDefinition,
  DataSetListParams,
  DataSetParams,
  OrFilter,
  PaginationState,
  ParameterTarget,
  PropertyFilter,
  RefreshDataSetAction,
  RefToContextRuleDefinition,
  // ENTITY_KEY,
  RenderingSliceState,
  ResourceFilter,
  ResourceFilterValue,
  RuleDefinition,
  SetCurrentPageAction,
  SiteListParams,
  TextContainsFilterRule,
  UpdateAttributeAction,
  useCalculatedValueState,
  useFoundValue,
  ValueInState,
} from './rendering';
import { handleParameterDefinitions, SmRefToResource } from './resource-content';
import { isError, isLoading } from './render-resource-page';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { IAttributeValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import { useSiteList } from './dataset';

export const DataSetList = (props: {
  params: DataSetListParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();

  const builtPath = buildPath(props);

  const data: RuleDefinition = props.params.data;

  const siteListProp = useSiteList(props, data);

  const siteList: IResourceWithValue[] = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.entities : null;

  const loading = useAppSelector((state: RenderingSliceState) =>
    state.rendering.componentsState[builtPath] &&
    state.rendering.componentsState[builtPath].self &&
    state.rendering.componentsState[builtPath].self.listState
      ? state.rendering.componentsState[builtPath].self.listState.loading
      : false,
  );

  const totalItems = siteListProp && !siteListProp.loading && siteListProp.value ? siteListProp.value.totalItems : null;
  console.log('totalItems', totalItems);

  const refToContextRuleDefinition: RefToContextRuleDefinition = data as RefToContextRuleDefinition;

  const renderItems = siteList => {
    return siteList.map((site, i) => renderItem(site, i));
  };

  const renderItem = (site, i) => {
    return (
      <SmRefToResource
        currentPath=""
        path=""
        params={{ resourceId: 'siteDetail' }}
        itemParam={site}
        localContextPath=""
        depth="0"
      ></SmRefToResource>
    );
    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  return <div>{siteList ? renderItems(siteList) : '----'}</div>;
};
