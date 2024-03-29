import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useSiteList } from './dataset';
import { useSiteTree } from './datatree';
import { setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
import { Button, Row } from 'reactstrap';
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

  const handleOpen = (tn: TreeNode, treePath: string[]) => () => {
    console.log('kkkkk', tn.content.id, treePath);
    dispatch(
      setAction({
        source: builtPath,
        actionType: 'openNode',
        entity: { entityType: 'SITE', entity: 'mmmm' },
        treeNodePath: treePath,
        targetDataset: 'mydt',
      }),
    );
  };

  // const renderChildren = (children: TreeNodeWrapper) => Object.keys(children).map((key, index) => renderItem(children[key], index));

  const renderItem = (tn: TreeNode, treePath: string[], i) => {
    console.log('renderItemppp', tn, treePath);
    if (!tn.content) {
      console.log('renderItemppp- Loadingggg');
      return <span key={i}>Loadingggg.....</span>;
    }
    const nextTreePath = [...treePath, tn.content.id];
    return (
      <div key={i}>
        <p>
          {tn.content.id} - {tn.content.name}
          <Button onClick={handleOpen(tn, nextTreePath)} color="info" size="sm">
            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open</span>
          </Button>
        </p>
        <Row className="border-green padding-4">{renderItems(tn.children, nextTreePath)}</Row>
      </div>
    );
    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  const renderItems = (siteTree, treePath: string[]) => {
    return Object.keys(siteTree).map((key, i) => renderItem(siteTree[key], treePath, i));
  };

  return <Row className="border-blue padding-4">{siteTree ? renderItems(siteTree, []) : '----'}</Row>;
};
