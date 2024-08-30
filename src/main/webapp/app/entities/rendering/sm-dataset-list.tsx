import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useResourceList } from './dataset';

export const SmDatasetList = (props: {
  params: DataSetListParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const builtPath = buildPath(props);

  const data: RuleDefinition = props.params.data;
  const resourceIdForDetail: string = props.params.resourceIdForDetail;

  const resourceListProp = useResourceList(props, data);

  const resourceList: IResourceWithValue[] =
    resourceListProp && !resourceListProp.loading && resourceListProp.value ? resourceListProp.value.entities : null;

  const loading = useAppSelector((state: RenderingSliceState) =>
    state.rendering.componentsState[builtPath] &&
    state.rendering.componentsState[builtPath].self &&
    state.rendering.componentsState[builtPath].self.listState
      ? state.rendering.componentsState[builtPath].self.listState.loading
      : false,
  );

  const totalItems = resourceListProp && !resourceListProp.loading && resourceListProp.value ? resourceListProp.value.totalItems : null;
  console.log('totalItems', totalItems);

  // const refToContextRuleDefinition: RefToLocalContextRuleDefinition = data as RefToLocalContextRuleDefinition;

  const renderItems = resourceList => {
    return resourceList.map((resource, i) => renderItem(resource, i));
  };

  const renderItem = (resource, i) => {
    return resourceIdForDetail ? (
      <SmRefToResource
        currentPath=""
        path=""
        params={{ resourceId: 'resourceDetail' }}
        itemParam={resource}
        localContextPath=""
        depth="0"
      ></SmRefToResource>
    ) : (
      <p>
        {resource.id} - {resource.name}
      </p>
    );

    // return <SmRefToResource props= {props} key={'item-' + i}>{resource.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{resource.name}</h1>;
  };

  return <div>{resourceList ? renderItems(resourceList) : '----'}</div>;
};
