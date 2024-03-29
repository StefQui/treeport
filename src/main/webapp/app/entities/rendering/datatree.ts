import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { searchResources } from 'app/entities/rendering/rendering.reducer';
import { useChangingCalculatedFilterState } from './filter';
import {
  ParameterTarget,
  ResourceFilter,
  ValueInState,
  DatatreeDefinition,
  ActionState,
  RenderingSliceState,
  OpenNodeAction,
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

const useOpenNodeAction = (props, initialValue: string[]) => {
  const [val, setVal] = useState(null);
  const action: ActionState = useAppSelector((state: RenderingSliceState) => state.rendering.action);
  useEffect(() => {
    if (action && action.actionType === 'openNode') {
      const action1: OpenNodeAction = action;
      console.log('actionOpenNode', action1, val);
      setVal(action1.treeNodePath);
    }
  }, [action]);

  return val;
};

export const handleDataTree = (key: string, target: ParameterTarget, refToSiteDefinition: DatatreeDefinition, props) => {
  const dispatch = useAppDispatch();
  const initialPaginationState = refToSiteDefinition.initialPaginationState;

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;

  const openNodeAction = useOpenNodeAction(props, []);

  useEffect(() => {
    console.log('initialFetchTree');
    dispatch(searchResources(getChildrenSite([])));
  }, []);

  useEffect(() => {
    if (openNodeAction) {
      console.log('openNodeAction2', openNodeAction);
      dispatch(searchResources(getChildrenSite(openNodeAction)));
    }
  }, [openNodeAction]);

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

  const getChildrenSite = (treePath: string[]): any => {
    return {
      searchModel: {
        resourceType: 'SITE',
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
      destinationKey: key,
      localContextPath: props.localContextPath,
      target,
      childPath: props.path,
      treePath,
    };
  };
};
