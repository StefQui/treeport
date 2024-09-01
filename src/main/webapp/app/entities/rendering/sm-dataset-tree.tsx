import React from 'react';
import { useAppDispatch } from 'app/config/store';

import { SmRefToResource } from './sm-resource-content';
import { buildPath } from './shared';
import { DataSetListParams, DataSetTreeParams, RuleDefinition } from './type';
import { useSiteTree } from './datatree';
import { setAction, TreeNode, TreeNodeWrapper } from './rendering.reducer';
import { Button, Collapse, ListGroup, ListGroupItem } from 'reactstrap';

export const SmDatasetTree = (props: {
  params: DataSetTreeParams;
  depth: string;
  currentPath: string;
  path: string;
  localContextPath: string;
}) => {
  const dispatch = useAppDispatch();

  const builtPath = buildPath(props);

  const data: RuleDefinition = props.params.data;
  const resourceIdForDetail: string = props.params.resourceIdForDetail;

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
        timestamp: new Date(),
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
        timestamp: new Date(),
      }),
    );
  };

  // const renderChildren = (children: TreeNodeWrapper) => Object.keys(children).map((key, index) => renderItem(children[key], index));

  // const renderItem = (tn: TreeNode, treePath: string[], i) => {
  //   console.log('renderItemppp', tn, treePath);
  //   if (!tn.content) {
  //     console.log('renderItemppp- Loadingggg');
  //     return <span key={i}>Loadingggg.....</span>;
  //   }
  //   let nextTreePath = [...treePath];
  //   if (!tn.isRoot) {
  //     nextTreePath = [...treePath, tn.content.id];
  //   }
  //   return (
  //     <Row md="12" key={i}>
  //       <Col md="8">
  //         {!tn.isRoot && (
  //           <p>
  //             {'---'.repeat(treePath.length + 1)}
  //             {'> '}
  //             <SmRefToResource
  //               currentPath=""
  //               path=""
  //               params={{ resourceId: 'siteDetail' }}
  //               itemParam={tn.content}
  //               localContextPath=""
  //               depth="0"
  //             ></SmRefToResource>
  //           </p>
  //         )}
  //       </Col>
  //       <Col md="4">
  //         <div className="d-flex justify-content-end">
  //           {tn.isOpened && (
  //             <Button onClick={handleClose(tn, nextTreePath)} color="danger" size="sm">
  //               <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Close</span>
  //             </Button>
  //           )}
  //           {!tn.isOpened && (
  //             <Button onClick={handleOpen(tn, nextTreePath, false)} color="info" size="sm">
  //               <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Open</span>
  //             </Button>
  //           )}
  //           {tn.childrenAreLoaded && (
  //             <div>
  //               <Button onClick={handleOpen(tn, nextTreePath, true)} color="info" size="sm">
  //                 <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Force reload</span>
  //               </Button>
  //             </div>
  //           )}
  //         </div>
  //       </Col>
  //       <Col md="12">
  //         {tn.isLoading && <span>Children are loading...</span>}
  //         {tn.isOpened && <Row>{renderItems(tn.children, nextTreePath)}</Row>}
  //       </Col>
  //     </Row>
  //   );
  //   // return <SmRefToResource props= {props} key={'item-' + i}>{site.name}</SmRefToResource>;
  //   // return <h1 key={'item-' + i}>{site.name}</h1>;
  // };

  // const renderItems = (siteTree, treePath: string[]) => {
  //   return Object.keys(siteTree).map((key, i) => renderItem(siteTree[key], treePath, i));
  // };

  // const mapper = (nodes, parentId?, lvl?) => {
  const renderNodes = (wrapper: TreeNodeWrapper, treePath: string[], depth) => {
    return Object.keys(wrapper).map((key, i) => {
      const node: TreeNode = wrapper[key];
      return renderNode(node, treePath, i);
    });
  };

  const renderNode = (tn: TreeNode, treePath: string[], i) => {
    // return Object.keys(nodes).map((nodeKey, index) => {
    //   const node = nodes[nodeKey];
    let nextTreePath = [...treePath];
    if (!tn.isRoot) {
      nextTreePath = [...treePath, tn.content.id];
    }
    const depth = treePath.length;
    //   const id = `${node.content.id}`;
    const item = (
      <React.Fragment key={i}>
        {tn.isRoot && (
          <Button className="pl-0" color="link" onClick={handleOpen(tn, nextTreePath, true)}>
            {'Reload roots'}
          </Button>
        )}
        {!tn.isRoot && (
          <ListGroupItem style={{ zIndex: 0 }} className={`${treePath.length > 0 ? `rounded-0 ${depth ? 'border-bottom-0' : ''}` : ''}`}>
            {
              <div style={{ paddingLeft: `${25 * depth}px` }}>
                {!tn.isOpened && (
                  <Button className="pl-0" color="link" onClick={handleOpen(tn, nextTreePath, false)}>
                    {'+'}
                  </Button>
                )}
                {tn.isOpened && (
                  <Button className="pl-0" color="link" onClick={handleClose(tn, nextTreePath)}>
                    {'-'}
                  </Button>
                )}
                {tn.content.id} - {tn.content.name}
                {tn.childrenAreLoaded && (
                  <Button className="pl-0" color="link" onClick={handleOpen(tn, nextTreePath, true)}>
                    {'(force reload node)'}
                  </Button>
                )}
                {resourceIdForDetail && (
                  <SmRefToResource
                    currentPath=""
                    path=""
                    params={{ resourceId: resourceIdForDetail }}
                    itemParam={tn.content}
                    localContextPath=""
                    depth="0"
                  ></SmRefToResource>
                )}
              </div>
            }
          </ListGroupItem>
        )}
        {tn.isLoading && <span>Children are loading...</span>}
        {tn.children && <Collapse isOpen={tn.isOpened}>{renderNodes(tn.children, nextTreePath, depth + 1)}</Collapse>}
      </React.Fragment>
    );

    return item;
    // });
  };

  // return <Row className="border-blue">{siteTree ? renderItem(siteTree, [], 0) : '----'}</Row>;
  return <ListGroup>{siteTree ? renderNode(siteTree, [], 0) : '---'}</ListGroup>;
};
