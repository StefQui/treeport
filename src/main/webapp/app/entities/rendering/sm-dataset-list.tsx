import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useSiteList } from './dataset';

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

  // const refToContextRuleDefinition: RefToLocalContextRuleDefinition = data as RefToLocalContextRuleDefinition;

  const renderItems = siteList => {
    return siteList.map((site, i) => renderItem(site, i));
  };

  const renderItem = (site, i) => {
    return resourceIdForDetail ? (
      <SmRefToResource
        currentPath=""
        path=""
        params={{ resourceId: 'siteDetail' }}
        itemParam={site}
        localContextPath=""
        depth="0"
      ></SmRefToResource>
    ) : (
      <p>
        {site.id} - {site.name}
      </p>
    );

    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  return <div>{siteList ? renderItems(siteList) : '----'}</div>;
};
