import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAttribute, getResource, setAction, setRenderingForPath } from './rendering.reducer';
import SiteList from '../site/site-list';
import { AttValue } from '../attribute-value/attribute-value';
import { SmRefToResource, ZZZResourceContent } from './resource-content';

export const TextBasic = props => {
  const siteEntity = useAppSelector(state => state.site.entity);
  // const rendering = useAppSelector(state => state.rendering);
  const [value] = useState(props.text);

  return <span>{value}</span>;
};

export const SmTextConst = props => {
  if (props.params.input.const) {
    return (
      <span>
        {props.params.input.const} - ({buildPath(props)})
      </span>
    );
  }
  return <span>const is required in SmText</span>;
};

export function buildPath(props) {
  return props.path ? props.currentPath + PATH_SEPARATOR + props.path : props.currentPath;
}

export const applyPath = (path, pathToApply) => {
  if (pathToApply.startsWith(ROOT_PATH_SEPARATOR)) {
    return pathToApply;
  } else if (pathToApply.startsWith('..')) {
    const originaPath: string[] = path.substring('/'.length).split(PATH_SEPARATOR);
    const splited: string[] = pathToApply.split(PATH_SEPARATOR);

    const result = originaPath;
    splited.forEach(fragment => {
      if (fragment === '..') {
        result.pop();
      } else {
        result.push(fragment);
      }
    });
    return ROOT_PATH_SEPARATOR + result.join(PATH_SEPARATOR);
  } else if (pathToApply.startsWith('.' + PATH_SEPARATOR)) {
    return path + PATH_SEPARATOR + pathToApply.substring('.'.length);
  } else {
    return path + PATH_SEPARATOR + pathToApply;
  }
};

export const OUTPUT_KEY = 'output';
export const TEXT_VALUE_KEY = 'textValue';
export const REF_TO_PATH_KEY = 'refToPath';
export const REF_TO_CONTEXT_KEY = 'refToContext';
export const CONST_KEY = 'const';
export const SITE_VALUE_KEY = 'siteValue';
export const ENTITY_KEY = 'entity';
export const RESOURCE_NAME_KEY = 'name';

export const SmTextRefToPath = props => {
  const builtPath = buildPath(props);
  const refToPath = props.params[TEXT_VALUE_KEY][REF_TO_PATH_KEY];
  const calculatedPath = applyPath(builtPath, refToPath.path);
  const referencedValue = useRenderingState(calculatedPath);
  // console.log('aaaa', referencedValue, props.params.input.property);
  if (referencedValue) {
    return <span>{getValueForPathInObject(referencedValue, refToPath.property ?? OUTPUT_KEY)}</span>;
    // return <span>{referencedValue[props.params.input.property ?? OUTPUT_KEY]}</span>;
  }
  return <span>No value found for {calculatedPath} for SmTextRefToPath</span>;
};

export const SmTextRefToContext = props => {
  const refToContext = props.params[TEXT_VALUE_KEY][REF_TO_CONTEXT_KEY];
  const value = useRenderingContextState(refToContext.property);
  if (value) {
    return <span>{value}</span>;
  }
  return <span>No value found in context for SmTextRefToPath</span>;
};

export const getValueForPathInObject = (obj, path) => {
  console.log('getValueForPathInObject', obj, path);
  try {
    const splited = path.split('.');
    return splited.reduce((acc, current) => acc[current], obj);
  } catch (ex) {
    return null;
  }
};

export const SmText = props => {
  if (!props.params) {
    return <span>input param is mandatory</span>;
  }

  const textValue = props.params[TEXT_VALUE_KEY];
  if (!textValue) {
    return <span>{TEXT_VALUE_KEY} param is mandatory</span>;
  }

  if (textValue[REF_TO_PATH_KEY]) {
    return <SmTextRefToPath {...props}></SmTextRefToPath>;
  } else if (textValue[REF_TO_CONTEXT_KEY]) {
    return <SmTextRefToContext {...props}></SmTextRefToContext>;
  } else if (textValue[CONST_KEY]) {
    return <SmTextConst {...props}></SmTextConst>;
  }
  return <span>You should have at least refToPath or refToContext or const in SmText</span>;
};

export function useRenderingState(renderingPath, path1?) {
  if (path1) {
    return useAppSelector(state => {
      const a = state.rendering.renderingState[renderingPath];
      return a ? a[path1] : null;
    });
  }
  return useAppSelector(state => state.rendering.renderingState[renderingPath]);
}

export function useRenderingContextState(property) {
  return useAppSelector(state => getValueForPathInObject(state.rendering.context, property));
}

export function updateRenderingState(dispatch, path: string, value) {
  dispatch(
    setRenderingForPath({
      path,
      value,
    }),
  );
}

export const SmInput = props => {
  const [value, setValue] = useState(props.params.defaultValue.const);
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);

  useEffect(() => {
    if (props.params.defaultValue.const) {
      updateRenderingState(dispatch, builtPath, {
        [OUTPUT_KEY]: props.params.defaultValue.const,
      });
    }
  }, []);

  const handleChange = event => {
    setValue(event.target.value);
    updateRenderingState(dispatch, builtPath, {
      [OUTPUT_KEY]: event.target.value,
    });
    dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));
  };

  return (
    <div>
      <input value={value} onChange={handleChange}></input>
    </div>
  );
};

export const TheSiteList = props => {
  return <SiteList {...props}></SiteList>;
};

export const TextRef = (props: { refTo: string | number; col: any }) => {
  const siteEntity = useAppSelector(state => state.site.entity);
  const action = useAppSelector(state => state.rendering.action);

  const [value, setValue] = useState('?');

  useEffect(() => {
    if (!action || action.source !== props.refTo) {
      return;
    }
    if (action.actionType === 'textChanged') {
      setValue(action.value);
    } else {
      setValue('----');
    }
  }, [action]);

  return <span>{value}</span>;
};

export const SiteRef = (props: { refTo: string; col: any }) => {
  const action = useAppSelector(state => state.rendering.action);
  // console.log('in app selector', state.rendering.renderingState, ddd);
  // return ddd;
  // });
  const [value, setValue] = useState('?');

  useEffect(() => {
    if (!action || action.source !== props.refTo) {
      return;
    }
    if (action.actionType === 'selectSite') {
      setValue(action.entity[ENTITY_KEY].id + ' - ' + action.entity[ENTITY_KEY].name);
    } else {
      setValue('----');
    }
  }, [action]);

  return <span>{value}</span>;
};

export const SmSiteRef = props => {
  const builtPath = buildPath(props);
  const siteValue = props.params[SITE_VALUE_KEY];
  if (!siteValue) {
    return <span>Missing param {SITE_VALUE_KEY} in SmSiteRef</span>;
  }
  if (!siteValue.refToPath) {
    return <span>Missing param {SITE_VALUE_KEY}.refToPath in SmSiteRef</span>;
  }
  const calculatedPath = applyPath(builtPath, siteValue.refToPath.path);
  const referencedValue = useRenderingState(calculatedPath);
  if (referencedValue) {
    const foundValue = getValueForPathInObject(referencedValue, siteValue.refToPath.property ?? OUTPUT_KEY);
    if (foundValue) {
      return (
        <span>
          <u>Site:</u> {foundValue[ENTITY_KEY][RESOURCE_NAME_KEY]}
        </span>
      );
    }
  }
  return <span>No Site for {calculatedPath}</span>;
};

export const AttRef = (props: { refTo: string; attributeKey: string; campaignId: string; path: string; col: any }) => {
  const action = useAppSelector(state => state.rendering.action);
  const dispatch = useAppDispatch();
  // console.log('in app selector', state.rendering.renderingState, ddd);
  // return ddd;
  // });
  const initialState = {
    attribute: null,
  };

  const [attValue, setAttValue] = useState('??');

  const attribute = useAppSelector(state => {
    const aaa = state.rendering.renderingState[props.path];
    return aaa ? (aaa.attribute ? aaa.attribute : null) : null;
  });

  useEffect(() => {
    dispatch(setRenderingForPath({ path: props.path, value: initialState }));
  }, []);

  useEffect(() => {
    if (!action || action.source !== props.refTo) {
      return;
    }
    if (action.actionType === 'selectSite') {
      dispatch(
        getAttribute({
          exploded: {
            siteId: action.entity[ENTITY_KEY].id,
            campaignId: props.campaignId,
            key: props.attributeKey,
          },
          path: props.path,
        }),
      );
    }
  }, [action]);

  useEffect(() => {
    if (attribute) {
      setAttValue(attribute);
    } else {
      setAttValue(null);
    }
  }, [attribute]);

  return <AttValue attValue={attValue}></AttValue>;
};

export const PATH_SEPARATOR = '/';
export const ROOT_PATH_SEPARATOR = '/';

export const MyVerticalPanel = props => {
  const renderItems = items =>
    items.map((item, index) => (
      <MyElem key={index} input={{ ...item }} currentPath={props.currentPath + PATH_SEPARATOR + props.path}></MyElem>
    ));

  return <Row className="border-blue padding-4">{renderItems(props.items)}</Row>;
};

export const MyInput = props => {
  const [value, setValue] = useState(props.value);
  const dispatch = useAppDispatch();
  // console.log('bbbb', props.path);
  // dispatch(tata());
  const builtPath = buildPath(props);
  const rendering = useAppSelector(state => state.rendering.renderingState[builtPath]);

  const handleChange = event => {
    setValue(event.target.value);
    dispatch(setRenderingForPath({ path: builtPath, value: event.target.value }));

    dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));

    // setRendering(event.target.value);
    // dispatch(setStateForPath({ path: props.path, value: event.target.value }));
  };
  useEffect(() => {
    // dispatch(setRenderingForPath({ path: props.path, value: props.value }));
    // if (setRendering) {
    //   setRendering(props.value);
    // }
    // dispatch(setStateForPath({ path: props.path, value: props.value }));
  }, []);

  return (
    <div>
      <input value={value} onChange={handleChange}></input>
      {props.path}
    </div>
  );
};

export const MyElem = props => {
  const renderSwitch = params => {
    switch (params.componentType) {
      case 'textBasic':
        return <TextBasic {...params}></TextBasic>;
      case 'SmText':
        return <SmText {...params}></SmText>;
      case 'SmInput':
        return <SmInput {...params}></SmInput>;
      case 'SmRefToResource':
        return <SmRefToResource {...params}></SmRefToResource>;
      case 'textRef':
        return <TextRef {...params}></TextRef>;
      case 'siteRef':
        return <SiteRef {...params}></SiteRef>;
      case 'SmSiteRef':
        return <SmSiteRef {...params}></SmSiteRef>;
      case 'attRef':
        return <AttRef {...params}></AttRef>;
      case 'input':
        return <MyInput {...params}></MyInput>;
      case 'siteList':
        return <TheSiteList {...params}></TheSiteList>;
      case 'resourceContent':
        return <ZZZResourceContent {...params}></ZZZResourceContent>;
      case 'verticalPanel':
        return <MyVerticalPanel {...params}></MyVerticalPanel>;
      default:
        return <p>Not implemented...{params.componentType}</p>;
    }
  };

  return <MyWrapper {...props.input}>{renderSwitch({ ...props.input, currentPath: props.currentPath })}</MyWrapper>;
};

export const MyWrapper = ({ children, ...props }) => {
  let cn = '';
  if (props.border) {
    cn += ' border-2';
  }
  return (
    <Col md={props.col ?? 12} className={cn}>
      {children}
    </Col>
  );
};
