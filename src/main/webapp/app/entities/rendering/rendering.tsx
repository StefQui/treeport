import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAttribute, getResource, setAction, setRenderingForPath } from './rendering.reducer';
import SiteList from '../site/site-list';
import { AttValue } from '../attribute-value/attribute-value';
import { ResourceContent, SmRefToResource } from './resource-content';

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

const applyPath = (path, pathToApply) => {
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

export const SmTextRefToPath = props => {
  const builtPath = buildPath(props);
  const calculatedPath = applyPath(builtPath, props.params.input.refToPath);
  const referencedValue = useRenderingState(calculatedPath);
  if (referencedValue) {
    return <span>{referencedValue.output}</span>;
  }
  return <span>No value for {calculatedPath}</span>;
};

export const SmText = props => {
  if (!props.params || !props.params.input) {
    return <span>input param is mandatory</span>;
  }
  const input = props.params.input;
  if (input.refToPath) {
    return <SmTextRefToPath {...props}></SmTextRefToPath>;
  }
  return <SmTextConst {...props}></SmTextConst>;
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

function updateRenderingState(dispatch, path: string, value) {
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
        output: props.params.defaultValue.const,
      });
    }
  }, []);

  const handleChange = event => {
    setValue(event.target.value);
    updateRenderingState(dispatch, builtPath, {
      output: event.target.value,
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
      setValue(action.entity.entity.id + ' - ' + action.entity.entity.name);
    } else {
      setValue('----');
    }
  }, [action]);

  return <span>{value}</span>;
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
            siteId: action.entity.entity.id,
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
  const rendering = useAppSelector(state => state.rendering.renderingState[props.path]);
  const handleChange = event => {
    setValue(event.target.value);
    dispatch(setRenderingForPath({ path: props.path, value: event.target.value }));

    dispatch(setAction({ source: props.path, actionType: 'textChanged', value: event.target.value }));

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
      case 'attRef':
        return <AttRef {...params}></AttRef>;
      case 'input':
        return <MyInput {...params}></MyInput>;
      case 'siteList':
        return <TheSiteList {...params}></TheSiteList>;
      case 'resourceContent':
        return <ResourceContent {...params}></ResourceContent>;
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

export const MyRend = props => {
  const [input, setInput] = useState({ type: 'notype', text: 'kkk' });
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

  console.log('......', props.currentPath, props.params);
  return (
    <Row md="8">
      {props.content ? (
        <MyElem input={input} params={props.params ? props.params.params : null} currentPath={props.currentPath}></MyElem>
      ) : (
        <p>Loading...</p>
      )}
    </Row>
  );
};
