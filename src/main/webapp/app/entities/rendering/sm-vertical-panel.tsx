import React from 'react';
import { Row } from 'reactstrap';

import { PATH_SEPARATOR } from './shared';
import { MyElem, increment } from './rendering';

export const SmVerticalPanel = props => {
  // const shouldDisplay = useShouldDisplay(props);
  // if (!shouldDisplay) return hidden();
  console.log('MyVerticalPanel', props);

  const renderItems = items =>
    items.map((item, index) => (
      <p>kh</p>
      // <MyElem
      //   key={index}
      //   depth={increment(props.depth)}
      //   input={{ ...item }}
      //   currentPath={props.currentPath + PATH_SEPARATOR + props.path}
      //   form={props.form}
      //   itemParam={props.itemParam}
      //   localContextPath={props.localContextPath}
      // ></MyElem>
    ));

  return <Row className="border-blue padding-4">{renderItems(props.items)}</Row>;
};
