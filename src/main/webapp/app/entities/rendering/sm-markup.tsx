import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { MyElem } from './rendering';
import { buildPath } from './shared';
import { ComponentResourceContent, SmMarkupProps, SmTextProps } from './type';
import './../../app.scss';
import { publishNavigateToEvent } from './action.utils';

export const SmInserted = ({ props }: { props: SmTextProps }) => {
  return <span>Inserted {props.currentPath}</span>;
};

export const navTo = (to: string) => {
  publishNavigateToEvent({
    to,
  });
};

export const SmMarkup = (props: SmMarkupProps) => {
  const params = props.params;
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
  const myRef = useRef(null);
  const [previousParams, setPreviousParams] = useState(null);
  const [roots, setRoots] = useState({});

  const exitMarkup = () => {
    console.log('exiting---', Object.keys(roots));
    Object.keys(roots).forEach(key => {
      try {
        if (roots[key]) {
          setTimeout(() => {
            console.log('component unmount');
            roots[key].unmount();
            roots[key] = undefined;
          });
        }
      } catch (e) {}
    });
  };

  const renderNewElem = (key: string, element: Element, resourceContent: ComponentResourceContent) => {
    if (!roots[key]) {
      roots[key] = createRoot(element);
      setRoots(roots);
    }
    roots[key].render(
      <BrowserRouter basename={baseHref}>
        <Provider store={store}>
          <ErrorBoundary>
            <MyElem
              input={resourceContent}
              depth={props.depth}
              params={props.params ? params : null}
              itemParam={props.itemParam}
              form={props.form}
              currentPath={props.currentPath}
              localContextPath={props.localContextPath}
            ></MyElem>
          </ErrorBoundary>
        </Provider>
      </BrowserRouter>,
    );
  };

  // console.log('mukey-----outside=', previousParams, params);

  useEffect(() => {
    const doc: Element = myRef.current;
    // console.log('mukey-----params=', previousParams, params);
    let paramsHasChanged = false;
    if (!previousParams || previousParams !== params) {
      paramsHasChanged = true;
    }
    // console.log('mukey-useEffectkey-layoutHasChanged-----', paramsHasChanged);

    setPreviousParams(params);

    if (!paramsHasChanged) {
      return;
    }
    Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
      const map = params.itemMap;
      const key = element.getAttribute('key');
      console.log('mukey-----', key);
      const resourceContent = map[key];
      if (resourceContent) {
        const builtPath = buildPath(props);
        console.log('mukey----render-', key);
        renderNewElem(key, element, resourceContent);
      }
    });
    return () => exitMarkup();
  }, [params]);

  const data = params.markup;
  return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};
