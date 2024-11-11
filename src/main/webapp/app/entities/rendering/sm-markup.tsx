import getStore from 'app/config/store';
import React, { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { MyElem } from './rendering';
import { ItemMap, SmMarkupProps, SmTextProps } from './type';
import './../../app.scss';
import { publishNavigateToEvent } from './action.utils';
import parse from 'html-react-parser';

export const SmInserted = ({ props }: { props: SmTextProps }) => {
  return <span>Inserted {props.currentPath}</span>;
};

export const navTo = (to: string) => {
  publishNavigateToEvent({
    to,
  });
};

export const SmMarkup = (props: SmMarkupProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ReactDOM.Root>();
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  const buildOptions = (itemMap: ItemMap) => ({
    replace(domNode) {
      const keys: string[] = Object.keys(itemMap);
      let result;
      keys.forEach(key => {
        if (domNode.attribs && domNode.name && domNode.name === 'sm-item' && domNode.attribs.key === key) {
          const newCurrentPath = props.currentPath === '/' ? props.currentPath + key : props.currentPath + '/' + key;
          result = (
            <BrowserRouter basename={baseHref}>
              <Provider store={store}>
                <MyElem
                  input={itemMap[key]}
                  depth={props.depth}
                  itemParam={props.itemParam}
                  form={props.form}
                  currentPath={newCurrentPath}
                  localContextPath={props.localContextPath}
                  inputs={props.inputs}
                ></MyElem>
              </Provider>
            </BrowserRouter>
          );
        }
      });
      if (result) {
        return result;
      }
    },
  });

  useEffect(() => {
    const renderTimeout = setTimeout(() => {
      if (containerRef.current) {
        console.log('create root');
        rootRef.current = rootRef.current ?? ReactDOM.createRoot(containerRef.current);
      }
      const options = buildOptions(props.params.itemMap);
      const html = props.params.markup;
      if (containerRef.current && rootRef.current) {
        console.log('component parse render', props.currentPath);
        rootRef.current.render(parse(html, options));
      }
    });

    return () => {
      clearTimeout(renderTimeout);
      console.log('unmount');
      const root = rootRef.current;
      rootRef.current = undefined;

      setTimeout(() => {
        console.log('component unmount');
        root?.unmount();
      });
    };
  }, [rootRef, props.params]);

  return <div ref={containerRef}></div>;
};
