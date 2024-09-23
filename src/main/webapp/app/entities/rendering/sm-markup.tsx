import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import React, { useEffect, useRef } from 'react';
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

  const renderNewElem = (key: string, element: Element, resourceContent: ComponentResourceContent) => {
    const root = createRoot(element);
    root.render(
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

  useEffect(() => {
    const doc: Element = myRef.current;
    Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
      console.log('key-----', element);
      const map = params.itemMap;
      const key = element.getAttribute('key');
      const resourceContent = map[key];
      if (resourceContent) {
        const builtPath = buildPath(props);
        renderNewElem(key, element, resourceContent);
      }
    });
  }, [params]);

  const data = params.markup;
  return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};
