import React, { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { ComponentResource, ComponentResourceContent } from '../type';

export const UiElem = ({ componentResource }) => {
  // const [componentResource, setComponentResource] = useState(null);

  // console.log('UiElemUiElemStart', componentResource);

  // useEffect(() => {
  //   console.log('UiElemUiElem', props.componentResource);
  //   if (props.componentResource) {
  //     setComponentResource(componentResource);
  //   }
  // }, [componentResource]);

  return (
    componentResource && (
      <ListGroup>
        <UiElemComponent componentResource={componentResource} key={0}></UiElemComponent>
      </ListGroup>
    )
  );
};

export const UiElemComponent = ({ componentResource, key }: { componentResource: ComponentResourceContent; key?: number }) => {
  // console.log('UiElemComponent', componentResource);
  const componentType = componentResource.componentType;

  const renderCompItems = (items, key) =>
    items.map((item, index) => (
      <ListGroupItem>
        <UiElemComponent componentResource={item} key={key + index + 1}></UiElemComponent>
      </ListGroupItem>
    ));

  if (componentType === 'page') {
    return <span>Page (path={componentResource.path})</span>;
  } else if (componentType === 'SmText') {
    return <span>SmText (path={componentResource.path})</span>;
  } else if (componentType === 'SmInput') {
    return <span>SmInput (path={componentResource.path})</span>;
  } else if (componentType === 'dataSetTable') {
    return <span>dataSetTable (path={componentResource.path})</span>;
  } else if (componentType === 'SmAttRef') {
    return <span>SmAttRef (path={componentResource.path})</span>;
  } else if (componentType === 'menu') {
    return <span>Menu (path={componentResource.path})</span>;
  } else if (componentType === 'layoutElement') {
    return <span>layoutElement (path={componentResource.path})</span>;
  } else if (componentType === 'SmRefToResource') {
    return (
      <span>
        Ref to {componentResource.params.resourceId} (path={componentResource.path})
      </span>
    );
  } else if (componentType === 'verticalPanel') {
    return (
      <React.Fragment key={key}>
        <p>VerticalPanel (path={componentResource.path})</p>
        {renderCompItems(componentResource.items, key)}
      </React.Fragment>
    );
  }
  return (
    <span>
      Unknown {componentType} (path={componentResource.path})
    </span>
  );
};
