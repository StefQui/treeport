import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import {
  searchResources,
  setAction,
  setAnyInCorrectState,
  setInLocalState,
  setInRenderingStateSelf,
} from 'app/entities/rendering/rendering.reducer';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { IAttributeValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import { useChangingCalculatedFilterState } from './filter';
import { handleParameterDefinitions } from './parameter-definition';
import { useFoundValue, useCalculatedValueState, applyPath, buildPath } from './shared';
import {
  PaginationState,
  ActionState,
  RenderingSliceState,
  SetCurrentPageAction,
  RefreshDataSetAction,
  UpdateAttributeAction,
  ParameterTarget,
  DatasetDefinition,
  ResourceFilter,
  ValueInState,
  DataSetParams,
  RuleDefinition,
  RefToContextRuleDefinition,
  ColumnDefinition,
  AttributeColumnDefinition,
} from './type';

export const useSiteList = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [siteList, setSiteList] = useState(null);
  useEffect(() => {
    // console.log('siteListProp has changed', siteListProp);
    if (dataProp && dataProp.listState) {
      setSiteList(dataProp.listState);
    }
  }, [dataProp]);
  return siteList;
};

export const usePaginationProp = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [pagination, setPagination] = useState(null);
  useEffect(() => {
    // console.log('siteListProp has changed', siteListProp);
    if (dataProp && dataProp.paginationState) {
      setPagination(dataProp.paginationState);
    }
  }, [dataProp]);
  return pagination;
};

const useSetCurrentPageAction = (props, initialValue: PaginationState | string | number) => {
  const [val, setVal] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'setCurrentPage') {
      const action1: SetCurrentPageAction = action;
      console.log('action1', action1, val);
      setVal(action1.currentPage);
    }
  }, [action]);

  return val;
};

const useRefreshDatasetAction = props => {
  const [val, setVal] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'refreshDataset') {
      setVal((action as RefreshDataSetAction).timestamp);
    } else if (action && action.actionType === 'updateAttribute') {
      setVal((action as UpdateAttributeAction).timestamp);
    }
  }, [action]);

  return val;
};

const setPaginationTo = (pagination: PaginationState, props, key, dispatch) => {
  dispatch(
    setAnyInCorrectState({
      localContextPath: props.localContextPath,
      destinationKey: key,
      targetType: 'currentLocalContextPath',
      value: pagination,
      additionnalPath: 'paginationState',
    }),
  );
};

export const handleDataSet = (key: string, target: ParameterTarget, refToSiteDefinition: DatasetDefinition, props) => {
  const dispatch = useAppDispatch();
  const filter = useCalculatedValueState(props, refToSiteDefinition.filter);
  const initialPaginationState = refToSiteDefinition.initialPaginationState;
  const setCurrentPageAction = useSetCurrentPageAction(props, initialPaginationState);
  const refreshDatasetAction = useRefreshDatasetAction(props);

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

  useEffect(() => {
    if (setCurrentPageAction) {
      setPaginationTo({ ...paginationProp, activePage: setCurrentPageAction }, props, key, dispatch);
    }
  }, [setCurrentPageAction]);

  useEffect(() => {
    setPaginationTo(initialPaginationState, props, key, dispatch);
  }, []);

  console.log(
    'handleDataSet.......handleDataSet',
    props.localContextPath,
    applyPath(props.localContextPath, ''),
    refToSiteDefinition.filter,
  );

  const [previousFilter, setPreviousFilter] = useState({ loading: true });

  const paginationProp = usePaginationProp(props, {
    ruleType: 'refToLocalContext',
    path: '',
    sourceParameterKey: key,
  });

  useEffect(() => {
    console.log('filter.......handleDataSet', changingFilter, refreshDatasetAction);
    if (!changingFilter || !changingFilter.value || changingFilter.value.loading || !paginationProp) {
      return;
    }

    dispatch(
      searchResources({
        searchModel: {
          resourceType: 'SITE',
          columnDefinitions: refToSiteDefinition.columnDefinitions,
          filter: changingFilter ? changingFilter.value : null,
          page: paginationProp.activePage - 1,
          size: paginationProp.itemsPerPage,
          sort: `${paginationProp.sort},${paginationProp.order}`,
        },
        orgaId: 'coca',
        destinationKey: key,
        localContextPath: props.localContextPath,
        target,
        childPath: props.path,
      }),
    );
  }, [paginationProp, changingFilter, refreshDatasetAction]);
};
