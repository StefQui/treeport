import getStore from 'app/config/store';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import { SmLayoutProps, SmMarkupResourceContent, ComponentResourceContent } from './type';
import { MyElem } from './rendering';
import { buildPath } from './shared';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ErrorBoundary from 'app/shared/error/error-boundary';

export const SmLayout = (props: SmLayoutProps) => {
  const { layoutId } = props.params;
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
  const myRef = useRef(null);

  const builtPath = buildPath(props);
  const layoutResource = usePageResourceContentFromResourceId(layoutId);
  const layoutResourceContent: SmMarkupResourceContent = useResourceWithKey(layoutResource, 'content');

  console.log('layoutresourceContent', layoutResourceContent);

  const [previousLayout, setPreviousLayout] = useState(null);
  const [roots, setRoots] = useState({});

  const exitMarkup = () => {
    console.log('layoutexiting---', Object.keys(roots));
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

  useEffect(() => {
    if (!layoutResourceContent) {
      return;
    }
    const layoutParams = layoutResourceContent.params;
    const doc: Element = myRef.current;
    console.log('useEffectkey-----', layoutParams);

    let layoutHasChanged = false;
    if (!previousLayout || previousLayout !== layoutParams.itemMap) {
      layoutHasChanged = true;
    }
    console.log('useEffectkey-layoutHasChanged-----', layoutHasChanged);

    setPreviousLayout(layoutParams.itemMap);

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
                params={layoutParams ? layoutParams : null}
                itemParam={props.itemParam}
                currentPath={props.currentPath}
                localContextPath={props.localContextPath}
              ></MyElem>
            </ErrorBoundary>
          </Provider>
        </BrowserRouter>,
      );
    };

    let i = 0;
    Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
      const layoutMap = layoutParams.itemMap;
      const key = element.getAttribute('key');
      console.log('la-key-----', key, i++);
      const resourceContent = props.params.itemMap[key];
      const layoutResourceContent = layoutMap[key];
      if (layoutResourceContent && layoutHasChanged && !resourceContent) {
        console.log('la-key---layout--', key, i++);
        const builtPath = buildPath(props);
        renderNewElem(key, element, layoutResourceContent);
      }
      if (resourceContent) {
        console.log('la-key---resource--', key, i++);
        const builtPath = buildPath(props);
        renderNewElem(key, element, resourceContent);
      }
    });
    // return () => exitMarkup();
  }, [layoutResourceContent, props.params.itemMap]);

  useEffect(() => {
    return () => exitMarkup();
  }, []);

  if (!layoutResourceContent) {
    return <div>Layout........</div>;
  }

  const data = layoutResourceContent.params.markup;
  return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};
