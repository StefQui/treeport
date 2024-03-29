import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useSiteList } from './dataset';
import { useSiteTree } from './datatree';
import { setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SmDatasetTree = (props: {
  params: DataSetListParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();

  const builtPath = buildPath(props);

  const data: RuleDefinition = props.params.data;

  const siteTree: TreeNodeWrapper = useSiteTree(props, data);

  const renderItems = siteTree => {
    return Object.keys(siteTree).map((key, i) => renderItem(siteTree[key], i));
  };

  const handleOpen = (tn: TreeNode) => () => {
    console.log('kkkkk', tn.content.id);
    dispatch(
      setAction({
        source: builtPath,
        actionType: 'openNode',
        entity: { entityType: 'SITE', entity: 'mmmm' },
        treeNodePath: ['root'],
        targetDataset: 'mydt',
      }),
    );
  };

  const renderItem = (tn: TreeNode, i) => {
    return (
      <div>
        {tn.content ? (
          <p>
            {tn.content.id} - {tn.content.name}
            <Button onClick={handleOpen(tn)} color="info" size="sm">
              <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open</span>
            </Button>
          </p>
        ) : (
          '--'
        )}
      </div>
    );
    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  return <div>{siteTree ? renderItems(siteTree) : '----'}</div>;
};
