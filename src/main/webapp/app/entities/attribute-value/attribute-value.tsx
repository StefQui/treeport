import React, { ReactNode, useEffect, useState } from 'react';

export const BooleanValue = props => {
  return <span>{props.value}</span>;
};

export const DoubleValue = props => {
  return <span>{props.value}</span>;
};

export const NotResolvableValue = props => {
  return <span>{props.value}</span>;
};

export const AttValue = props => {
  const renderAttValue = params => {
    switch (params.attributeValueType) {
      case 'BOOLEAN_VT':
        return <BooleanValue {...params}></BooleanValue>;
      case 'DOUBLE_VT':
        return <DoubleValue {...params}></DoubleValue>;
      case 'NOT_RESOLVABLE_VT':
        return <NotResolvableValue {...params}></NotResolvableValue>;
      default:
        return <p>Not implemented...{params.attributeValueType}</p>;
    }
  };

  if (props.attValue && props.attValue.attributeValue) {
    return renderAttValue(props.attValue.attributeValue);
  }
  return <div>No value yet</div>;
};
