import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { IResourceWithValue } from 'app/shared/model/resourcewithvalues.model';
import { buildPath } from './shared';
import { DataSetListParams, RuleDefinition, RenderingSliceState } from './type';
import { useSiteList } from './dataset';
import { useSiteTree } from './datatree';
import { setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
import { Button, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MyTree from './mytree';

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

  const handleOpen = (tn: TreeNode, treePath: string[], forced: boolean) => () => {
    dispatch(
      setAction({
        source: builtPath,
        actionType: 'openNode',
        entity: { entityType: 'SITE', entity: 'mmmm' },
        treeNodePath: treePath,
        childrenAreLoaded: tn.childrenAreLoaded,
        forced,
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
      <Row md="12" key={i}>
        <Col md="8">
          {!tn.isRoot && (
            <p>
              {'---'.repeat(treePath.length + 1)}
              {'> '}
              <SmRefToResource
                currentPath=""
                path=""
                params={{ resourceId: 'siteDetail' }}
                itemParam={tn.content}
                localContextPath=""
                depth="0"
              ></SmRefToResource>
            </p>
          )}
        </Col>
        <Col md="4">
          <div className="d-flex justify-content-end">
            {tn.isOpened && (
              <Button onClick={handleClose(tn, nextTreePath)} color="danger" size="sm">
                <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Close</span>
              </Button>
            )}
            {!tn.isOpened && (
              <Button onClick={handleOpen(tn, nextTreePath, false)} color="info" size="sm">
                <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open</span>
              </Button>
            )}
            {tn.childrenAreLoaded && (
              <div>
                <Button onClick={handleOpen(tn, nextTreePath, true)} color="info" size="sm">
                  <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Force reload</span>
                </Button>
              </div>
            )}
          </div>
        </Col>
        <Col md="12">
          {tn.isLoading && <span>Children are loading...</span>}
          {tn.isOpened && <Row>{renderItems(tn.children, nextTreePath)}</Row>}
        </Col>
      </Row>
    );
    // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
    // return <h1 key={'item-' + i}>{site.name}</h1>;
  };

  const renderItems = (siteTree, treePath: string[]) => {
    return Object.keys(siteTree).map((key, i) => renderItem(siteTree[key], treePath, i));
  };

  // return <Row className="border-blue">{siteTree ? renderItem(siteTree, [], 0) : '----'}</Row>;
  return <MyTree></MyTree>;
};
