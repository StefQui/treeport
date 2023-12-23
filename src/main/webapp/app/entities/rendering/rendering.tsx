import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Input } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setAction, setRenderingForPath } from '../asset/rendering.reducer';
import AssetList from '../asset/asset-list';

export const renderText = (col: any, value: any) => {
  if (col) {
    return (
      <Col md={col}>
        <span>{value}</span>
      </Col>
    );
  }
  return <span>{value}</span>;
};

export const TextBasic = props => {
  const assetEntity = useAppSelector(state => state.asset.entity);
  // const rendering = useAppSelector(state => state.rendering);
  const [value] = useState(props.text);

  return renderText(props.col, value);
};

export const SiteList = props => {
  return <AssetList {...props}></AssetList>;
};

// export const getRenderingStateForPath = (rendering: any, refTo: any) => {
//   return rendering.renderingState.find(i => i.path === refTo);
// };

export const TextRef = (props: { refTo: string | number; col: any }) => {
  const assetEntity = useAppSelector(state => state.asset.entity);
  const action = useAppSelector(state => state.rendering.action);

  // const dispatch = useAppDispatch();
  // dispatch(setRenderingForPath({ path: props.path, value: 'mmmmm' }));
  console.log('aaaaaaaaaaaaaa', props.refTo);

  // const rendering = useAppSelector(state => state.rendering.renderingState[props.refTo]);
  // console.log('in app selector', state.rendering.renderingState, ddd);
  // return ddd;
  // });
  const [value, setValue] = useState('?');

  // useEffect(() => {
  //   setValue(rendering ? rendering : '----');
  //   // if (rendering.renderingState) {
  //   //   const renderingState = getRenderingStateForPath(rendering, props.refTo);
  //   //   const found = rendering.renderingState.find(i => i.path === props.refTo);
  //   //   setValue(rendering ? rendering : '----');
  //   // }
  // }, [rendering]);

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

  return renderText(props.col, value);
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

  return renderText(props.col, value);
};

export const MyVerticalPanel = props => {
  const renderItems = items =>
    items.map((item, index) => <MyElem key={index} input={{ ...item, path: props.path + '.' + item.path }}></MyElem>);

  return <Row>{renderItems(props.items)}</Row>;
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
    switch (params.type) {
      case 'textBasic':
        return <TextBasic {...params}></TextBasic>;
      case 'textRef':
        return <TextRef {...params}></TextRef>;
      case 'siteRef':
        return <SiteRef {...params}></SiteRef>;
      case 'input':
        return <MyInput {...params}></MyInput>;
      case 'siteList':
        return <SiteList {...params}></SiteList>;
      case 'verticalPanel':
        return <MyVerticalPanel {...params}></MyVerticalPanel>;
      default:
        return <p>Not implemented...{params.type}</p>;
    }
  };

  return renderSwitch(props.input);
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
  return <Row md="8">{props.content ? <MyElem input={input}></MyElem> : <p>Loading...</p>}</Row>;
};
