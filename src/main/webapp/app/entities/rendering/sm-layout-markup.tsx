import getStore from 'app/config/store';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import { SmMarkupLayoutProps, SmMarkupResourceContent, ComponentResourceContent } from './type';
import { MyElem } from './rendering';
import { buildPath } from './shared';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ErrorBoundary from 'app/shared/error/error-boundary';

export const SmMarkupLayout = (props: SmMarkupLayoutProps) => {
  const { layoutId } = props.params;
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
  const myRef = useRef(null);

  const builtPath = buildPath(props);
  const layoutResource = usePageResourceContentFromResourceId(layoutId);
  const layoutResourceContent: SmMarkupResourceContent = useResourceWithKey(layoutResource, 'content');

  console.log('layoutresourceContent', layoutResourceContent);

  const [previousLayout, setPreviousLayout] = useState(null);

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
      const root = createRoot(element);
      root.render(
        <React.StrictMode key={key}>
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
          </BrowserRouter>
        </React.StrictMode>,
      );
    };

    Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
      console.log('key-----', element);
      const layoutMap = layoutParams.itemMap;
      const key = element.getAttribute('key');
      const resourceContent = props.params.itemMap[key];
      const layoutResourceContent = layoutMap[key];
      if (layoutResourceContent && layoutHasChanged && !resourceContent) {
        const builtPath = buildPath(props);
        renderNewElem(key, element, layoutResourceContent);
      }
      if (resourceContent) {
        const builtPath = buildPath(props);
        renderNewElem(key, element, resourceContent);
      }
    });
  }, [layoutResourceContent, props.params.itemMap]);

  if (!layoutResourceContent) {
    return <div>Layout........</div>;
  }

  const data = layoutResourceContent.params.markup;
  return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};
