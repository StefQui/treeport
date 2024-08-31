import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { MainTarget, searchResources, setAnyInCorrectState } from 'app/entities/rendering/rendering.reducer';
import { useChangingCalculatedFilterState } from './filter';
import {
  ParameterTarget,
  ResourceFilter,
  ValueInState,
  DatatreeDefinition,
  ActionState,
  RenderingSliceState,
  OpenNodeAction,
  CloseNodeAction,
  TargetInfo,
  ResourceSearchModel,
  CurrentLocalContextPathTarget,
  SearchResourceRequestModel,
} from './type';
import { useFoundValue } from './shared';

export const useSiteTree = (props, data) => {
  const dataProp = useFoundValue(props, data);
  const [siteTree, setSiteTree] = useState(null);
  useEffect(() => {
    // console.log('siteListProp has changed', siteListProp);
    if (dataProp) {
      setSiteTree(dataProp);
    }
  }, [dataProp]);
  return siteTree;
};

const useOpenNodeAction = props => {
  const [open, setOpen] = useState(null);
  const [close, setClose] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action) {
      if (action.actionType === 'openNode') {
        const action1: OpenNodeAction = action;
        setOpen(action);
      } else if (action.actionType === 'closeNode') {
        const action1: CloseNodeAction = action;
        // console.log('actionOpenNode', action1, val);
        setClose(action1.treeNodePath);
      }
    }
  }, [action]);

  return { open, close };
};

export const handleDataTree = (target: ParameterTarget, refToSiteDefinition: DatatreeDefinition, props) => {
  const dispatch = useAppDispatch();
  const initialPaginationState = refToSiteDefinition.initialPaginationState;

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;

  const { open, close } = useOpenNodeAction(props);

  useEffect(() => {
    console.log('initialFetchTree');
    dispatch(searchResources(getChildrenSite([])));
  }, []);

  useEffect(() => {
    if (open) {
      console.log('openNodeAction2', open);
      const openAction: OpenNodeAction = open;
      if (openAction.childrenAreLoaded && !openAction.forced) {
        dispatch(
          setAnyInCorrectState({
            mainTarget: enrichToMainTarget(target, props.localContextPath),
            secondaryTarget: {
              secondaryTargetType: 'anyValueTreeInTarget',
              treePath: openAction.treeNodePath,
            },
            value: 'open',
          }),
        );
      } else {
        dispatch(searchResources(getChildrenSite(openAction.treeNodePath)));
      }
    }
  }, [open]);

  useEffect(() => {
    if (close) {
      dispatch(
        setAnyInCorrectState({
          mainTarget: enrichToMainTarget(target, props.localContextPath),
          secondaryTarget: {
            secondaryTargetType: 'anyValueTreeInTarget',
            treePath: close,
          },
          value: 'close',
        }),
      );
    }
  }, [close]);

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

  const getChildrenSite = (treePath: string[]): SearchResourceRequestModel => {
    return {
      searchModel: {
        resourceType: 'site',
        columnDefinitions: refToSiteDefinition.columnDefinitions,
        filter: {
          filterType: 'AND',
          items: [
            {
              filterType: 'PROPERTY_FILTER',
              property: {
                filterPropertyType: 'RESOURCE_PROPERTY',
                property: 'parentId',
              },
              filterRule: {
                filterRuleType: 'TEXT_EQUALS',
                terms: treePath.length === 0 ? null : treePath[treePath.length - 1],
              },
            },
          ],
        },
        page: initialPaginationState.activePage - 1,
        size: initialPaginationState.itemsPerPage,
        sort: `${initialPaginationState.sort},${initialPaginationState.order}`,
      },
      orgaId: 'coca',
      mainTarget: enrichToMainTarget(target, props.localContextPath),
      secondaryTarget: {
        secondaryTargetType: 'anyValueTreeInTarget',
        treePath,
      },
    };
  };
};
export function enrichToMainTarget(target: ParameterTarget, localContextPath?: any): MainTarget {
  if (target.targetType === 'currentLocalContextPath') {
    return {
      mainTargetType: 'currentLocalContextPath',
      target: target as CurrentLocalContextPathTarget,
      localContextPath: localContextPath,
    };
  }
  throw new Error('to implement HHHHH');
}
