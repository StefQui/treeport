import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import {
  applyPath,
  buildPath,
  MyElem,
  OUTPUT_KEY,
  PATH_SEPARATOR,
  RESOURCE_FROM_REF_KEY,
  ROOT_PATH_SEPARATOR,
  updateRenderingState,
  useRenderingState,
} from './rendering';
import { getResource } from './rendering.reducer';

export const ZZZResourceContent = props => {
  const dispatch = useAppDispatch();
  const siteEntity = useAppSelector(state => state.site.entity);
  // const rendering = useAppSelector(state => state.rendering);
  const [value] = useState('mmmmmm');
  const initialState = {
    resource: null,
  };
  const [resourceContent, setResourceContent] = useState();

  const resource = useAppSelector(state => {
    const aaa = state.rendering.renderingState[props.path];
    return aaa ? (aaa.resource ? aaa.resource : null) : null;
  });

  useEffect(() => {
    if (props.refTo) {
      dispatch(
        getResource({
          resourceId: props.refTo,
          path: props.path,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (resource) {
      setResourceContent(resource.content);
    } else {
      setResourceContent(null);
    }
  }, [resource]);

  if (resourceContent) {
    return <MyRend content={resourceContent} params={props.params}></MyRend>;
  }
  return (
    <div>
      <span>no val</span>
    </div>
  );
};

export const SmRefToResource = props => {
  const dispatch = useAppDispatch();

  if (!props.params || !props.params.resourceId) {
    return <span>resourceId param is mandatory</span>;
  }
  const resourceId = props.params.resourceId;

  const builtPath = buildPath(props);
  const resource = useRenderingState(builtPath, RESOURCE_FROM_REF_KEY);

  const [resourceContent, setResourceContent] = useState();

  // const [enrichedContext, setEnrichedContext] = useState({});

  // const resource = useAppSelector(state => {
  //   const aaa = state.rendering.renderingState[props.path];
  //   return aaa ? (aaa.resource ? aaa.resource : null) : null;
  // });

  // console.log('arguments', props.params.arguments);
  if (props.params.arguments) {
    Object.entries(props.params.arguments).forEach(([argKey, argValue]: [string, { refToPath: string; property?: string }]) => {
      // console.log('argKey', argKey, argValue, builtPath, argValue.refToPath);
      // const calculatedPath = applyPath(builtPath, argValue.refToPath);
      const referencedValue = useRenderingState(argValue.refToPath);
      useEffect(() => {
        // console.log('changed', referencedValue, argValue.property);
        if (referencedValue) {
          // const aaa = referencedValue[argValue.property ?? OUTPUT_KEY];
          // console.log('changedeebefore', aaa, enrichedContext);
          // setEnrichedContext(previous => ({ ...previous, ...{ toto: aaa } }));
          updateRenderingState(dispatch, builtPath, { [argKey]: referencedValue[argValue.property ?? OUTPUT_KEY] });
          // console.log('changedeeafter', referencedValue[argValue.property ?? OUTPUT_KEY], enrichedContext);
        }
      }, [referencedValue]);
    });
  }

  // const [toto, setToto] = useState('mm');

  // useEffect(() => {
  //   console.log('changedeeafter2', enrichedContext);
  //   setToto('mmm');
  //   // setEnrichedContext({ ...enrichedContext });
  // }, [enrichedContext]);

  useEffect(() => {
    dispatch(
      getResource({
        resourceId,
        path: builtPath,
      }),
    );
  }, []);

  useEffect(() => {
    if (resource) {
      setResourceContent(resource.content);
    } else {
      setResourceContent(null);
    }
  }, [resource]);

  // console.log('SmRefToResource', props.currentPath, props.path);

  if (resourceContent) {
    // console.log('resourceContent', resourceContent);
    return <MyRend content={resourceContent} params={props.params} currentPath={builtPath} localContextPath={builtPath}></MyRend>;
  }
  return (
    <div>
      <span>no val</span>
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
          params={props.params ? props.params.params : null}
          currentPath={props.currentPath}
          localContextPath={props.localContextPath}
          layoutElements={input.layoutElements ? input.layoutElements : props.layoutElements}
        ></MyElem>
      ) : (
        <p>Loading...</p>
      )}
    </Row>
  );
};
