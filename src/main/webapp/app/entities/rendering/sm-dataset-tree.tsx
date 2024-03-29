import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useSiteList } from './dataset';
import { useSiteTree } from './datatree';
import { setAction, setInCorrectState, TreeNode, TreeNodeWrapper } from './rendering.reducer';
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

  const siteTree: TreeNode = useSiteTree(props, data);

  const handleOpen = (tn: TreeNode, treePath: string[]) => () => {
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

  const handleClose = (tn: TreeNode, treePath: string[]) => () => {
    dispatch(
      setAction({
        source: builtPath,
        actionType: 'closeNode',
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
    let nextTreePath = [...treePath];
    if (!tn.isRoot) {
      nextTreePath = [...treePath, tn.content.id];
    }
    return (
      <div key={i}>
        {!tn.isRoot ? (
          <p>
            {tn.content.id} - {tn.content.name}
          </p>
        ) : (
          <span>Nothing</span>
        )}
        {tn.childrenAreLoaded ? (
          <div>
            <Button onClick={handleClose(tn, nextTreePath)} color="warn" size="sm">
              <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Close</span>
            </Button>
            <Button onClick={handleOpen(tn, nextTreePath)} color="info" size="sm">
              <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Force reload</span>
            </Button>
          </div>
        ) : (
          <Button onClick={handleOpen(tn, nextTreePath)} color="info" size="sm">
            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open</span>
          </Button>
        )}

        <Row className="border-green padding-4">{renderItems(tn.children, nextTreePath)}</Row>
      </div>
    );
    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  const renderItems = (siteTree, treePath: string[]) => {
    return Object.keys(siteTree).map((key, i) => renderItem(siteTree[key], treePath, i));
  };

  return <Row className="border-blue padding-4">{siteTree ? renderItem(siteTree, [], 0) : '----'}</Row>;
};
