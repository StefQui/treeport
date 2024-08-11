import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { handleParameterDefinitions } from './parameter-definition';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import { MyElem, increment } from './rendering';
import { getRootPath, PATH_SEPARATOR, buildPath } from './shared';
import { SmRefToResourceProps, RefToResourceParams } from './type';

export const calculateTargetLocalContextPath = (childResource = true, props) => {
  if (!props.localContextPath && !props.path) {
    return getRootPath();
  } else if (props.localContextPath === getRootPath()) {
    if (childResource) {
      return props.localContextPath + props.path;
    } else {
      return props.localContextPath;
    }
  }
  if (childResource) {
    return props.localContextPath + PATH_SEPARATOR + props.path;
  } else {
    return props.localContextPath;
  }
};

export const SmRefToResource = (props: SmRefToResourceProps) => {
  console.log('TheSmRefToResource', props);

  const params: RefToResourceParams = props.params;

  if (!params || !params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const { resourceId } = params;

  const builtPath = buildPath(props);
  const resource = usePageResourceContentFromResourceId(resourceId);
  const resourceContent = useResourceWithKey(resource, 'content');

  handleParameterDefinitions(params, props);

  console.log('resourceContentresourceContentresourceContentresourceContent', resource);

  if (resourceContent) {
    console.log('resourceContent', props.itemParam);
    return (
      <MyElem
        input={resourceContent}
        depth={increment(props.depth)}
        params={props.params ? params : null}
        itemParam={props.itemParam}
        currentPath={builtPath}
        localContextPath={calculateTargetLocalContextPath(true, props)}
      ></MyElem>
    );
  }
  return (
    <div>
      <span>no val for SmRefToResource {JSON.stringify(props)}</span>
    </div>
  );
};

export const MyRend = props => {
  const [input, setInput] = useState({ type: 'notype', text: 'kkk', layoutElements: {} });
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      setError('');
      setInput(props.content ? JSON.parse(props.content) : {});
    } catch (ex) {
      setError('pb while parsing json');
    }
  }, [props.content]);

  if (error) {
    return <Row md="8">{error}</Row>;
  }

  // console.log('......', props.currentPath, props.params);
  return (
    <Row md="8">
      {props.content ? (
        <MyElem
          input={input}
          depth={increment(props.depth)}
          params={props.params ? props.params.params : null}
          currentPath={props.currentPath}
          localContextPath={props.localContextPath}
        ></MyElem>
      ) : (
        <p>Loading...</p>
      )}
    </Row>
  );
};
