import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { handleParameterDefinitions } from './parameter-definition';
import { useCalculatedValueState } from './shared';
import { navTo } from './sm-markup';
import { SmLinkProps, SmTextProps, TextParams, ValueInState } from './type';

export const SmLink = (props: SmLinkProps) => {
  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmLink</i>
      </span>
    );
  }

  const url = props.params.url;
  if (!url) {
    return (
      <span>
        <i>url param is mandatory in SmLink</i>
      </span>
    );
  }

  const urlLabel = props.params.urlLabel;
  if (!urlLabel) {
    return (
      <span>
        <i>urlLabel param is mandatory in SmLink</i>
      </span>
    );
  }

  const nav = e => {
    e.preventDefault();
    navTo(url);
  };

  return (
    // <Link to={url}>
    //   {urlLabel}
    //   {url}
    // </Link>
    <Link onClick={e => nav(e)} to={''}>
      {urlLabel}
    </Link>
  );
};
