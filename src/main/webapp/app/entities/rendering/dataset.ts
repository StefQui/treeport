import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { searchResources, setAnyInCorrectState } from 'app/entities/rendering/rendering.reducer';
import { useChangingCalculatedFilterState } from './filter';
import { useFoundValue, useCalculatedValueState, applyPath } from './shared';
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
  SearchResourceRequestModel,
} from './type';
import { enrichToMainTarget } from './datatree';

export const useResourceList = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [resourceList, setResourceList] = useState(null);
  useEffect(() => {
    // console.log('resourceListProp has changed', resourceListProp);
    if (dataProp && dataProp.listState) {
      setResourceList(dataProp.listState);
    }
  }, [dataProp]);
  return resourceList;
};

export const usePaginationProp = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [pagination, setPagination] = useState(null);
  useEffect(() => {
    // console.log('resourceListProp has changed', resourceListProp);
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

const setPaginationTo = (pagination: PaginationState, props, target: ParameterTarget, dispatch) => {
  dispatch(
    // setAnyInCorrectState({
    //   localContextPath: props.localContextPath,
    //   destinationKey: key,
    //   targetType: 'currentLocalContextPath',
    //   value: pagination,
    //   additionnalPath: 'paginationState',
    // }),
    setAnyInCorrectState({
      mainTarget: enrichToMainTarget(target, props.localContextPath),
      secondaryTarget: {
        secondaryTargetType: 'anyValueFirstLevelInTarget',
        firstLevelPath: 'paginationState',
      },
      value: pagination,
    }),
  );
};

export const handleDataSet = (target: ParameterTarget, refToResourceDefinition: DatasetDefinition, props) => {
  const dispatch = useAppDispatch();
  // const filter = useCalculatedValueState(props, refToResourceDefinition.filter);
  const initialPaginationState = refToResourceDefinition.initialPaginationState;
  const setCurrentPageAction = useSetCurrentPageAction(props, initialPaginationState);
  const refreshDatasetAction = useRefreshDatasetAction(props);

  const dsfDef = refToResourceDefinition.valueFilter as ResourceFilter;

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

  useEffect(() => {
    if (setCurrentPageAction) {
      setPaginationTo({ ...paginationProp, activePage: setCurrentPageAction }, props, target, dispatch);
    }
  }, [setCurrentPageAction]);

  useEffect(() => {
    setPaginationTo(initialPaginationState, props, target, dispatch);
  }, []);

  // console.log(
  //   'handleDataSet.......handleDataSet',
  //   props.localContextPath,
  //   applyPath(props.localContextPath, ''),
  //   refToResourceDefinition.filter,
  // );

  const [previousFilter, setPreviousFilter] = useState({ loading: true });

  const paginationProp = usePaginationProp(props, {
    ruleType: 'refToLocalContext',
    path: '',
    sourceParameterKey: target.parameterKey,
  });

  useEffect(() => {
    console.log('filter.......handleDataSet', changingFilter, refreshDatasetAction);
    if (!changingFilter || !changingFilter.value || changingFilter.value.loading || !paginationProp) {
      return;
    }

    const request: SearchResourceRequestModel = {
      searchModel: {
        resourceType: 'RESOURCE',
        columnDefinitions: refToResourceDefinition.columnDefinitions,
        filter: changingFilter ? changingFilter.value : null,
        page: paginationProp.activePage - 1,
        size: paginationProp.itemsPerPage,
        sort: `${paginationProp.sort},${paginationProp.order}`,
      },
      orgaId: 'coca',
      mainTarget: enrichToMainTarget(target, props.localContextPath),
      secondaryTarget: {
        secondaryTargetType: 'anyValueFirstLevelInTarget',
        firstLevelPath: 'listState',
      },
    };

    dispatch(searchResources(request));
  }, [paginationProp, changingFilter, refreshDatasetAction]);
};
