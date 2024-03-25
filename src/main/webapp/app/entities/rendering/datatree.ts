import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/config/store';

import { searchResources } from 'app/entities/rendering/rendering.reducer';
import { useChangingCalculatedFilterState } from './filter';
import { ParameterTarget, ResourceFilter, ValueInState, DatatreeDefinition } from './type';

export const handleDataTree = (key: string, target: ParameterTarget, refToSiteDefinition: DatatreeDefinition, props) => {
  const dispatch = useAppDispatch();
  const initialPaginationState = refToSiteDefinition.initialPaginationState;

  const dsfDef = refToSiteDefinition.valueFilter as ResourceFilter;

  const changingFilter: ValueInState = useChangingCalculatedFilterState(props, dsfDef, target);

  const getChildrenSite = (parentId: string | null): any => {
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
                terms: parentId,
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
      treePath: ['/'],
    };
  };

  useEffect(() => {
    dispatch(searchResources(getChildrenSite(null)));
  }, []);
};
