import getStore from 'app/config/store';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { usePageResourceContentFromResourceId, useResourceWithKey } from './render-resource-page';
import { SmLayoutProps, SmMarkupResourceContent, ComponentResourceContent, SmLayoutResourceContent, MarkupLayoutParams } from './type';
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
  const params: MarkupLayoutParams = props.params;

  const builtPath = buildPath(props);
  const layoutResource = usePageResourceContentFromResourceId(layoutId);
  const layoutResourceContent: SmMarkupResourceContent = useResourceWithKey(layoutResource, 'content');

  console.log('layoutresourceContent', layoutResourceContent);

  const [previousLayout, setPreviousLayout] = useState(null);
  const [roots, setRoots] = useState({});
  const [mu, setMu] = useState(null);

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
    const newItemMap = { ...layoutResourceContent.params.itemMap, ...params.itemMap };
    // newItemMap['content'] = layoutResource.content;
    const mu = { params: { ...layoutResourceContent.params, itemMap: newItemMap } };
    setMu({ content: { componentType: 'SmMarkup', path: 'hhh', ...mu } });
    console.log('mu-----', { content: { componentType: 'SmMarkup', path: 'hhh', ...mu } });

    const layoutParams = layoutResourceContent.params;
    const doc: Element = myRef.current;
    console.log('useEffectkey-----', layoutParams);

    let layoutHasChanged = false;
    if (!previousLayout || previousLayout !== layoutParams.itemMap) {
      layoutHasChanged = true;
    }
    console.log('useEffectkey-layoutHasChanged-----', layoutHasChanged);

    setPreviousLayout(layoutParams.itemMap);

    // const mu =
    // return (
    //   <MyElem
    //     input={mu}
    //     depth={props.depth}
    //     params={props.params ? params : null}
    //     itemParam={props.itemParam}
    //     form={props.form}
    //     currentPath={newCurrentPath}
    //     localContextPath={props.localContextPath}
    //   ></MyElem>
    // );

    // const renderNewElem = (key: string, element: Element, resourceContent: ComponentResourceContent) => {
    //   console.log('la-key---resourcerenderNewElem', key);
    //   if (!roots[key]) {
    //     console.log('la-key---resourcecreate', key);
    //     roots[key] = createRoot(element);
    //     setRoots(roots);
    //   }
    //   roots[key].render(
    //     <BrowserRouter basename={baseHref}>
    //       <Provider store={store}>
    //         <ErrorBoundary>
    //           <MyElem
    //             input={resourceContent}
    //             depth={props.depth}
    //             params={layoutParams ? layoutParams : null}
    //             itemParam={props.itemParam}
    //             currentPath={props.currentPath}
    //             localContextPath={props.localContextPath}
    //           ></MyElem>
    //         </ErrorBoundary>
    //       </Provider>
    //     </BrowserRouter>,
    //   );
    // };

    // let i = 0;
    // Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
    //   const layoutMap = layoutParams.itemMap;
    //   const key = element.getAttribute('key');
    //   // console.log('la-key-----', key, i++);
    //   const resourceContent = props.params.itemMap[key];
    //   const layoutResourceContent = layoutMap[key];
    //   if (layoutResourceContent && layoutHasChanged && !resourceContent) {
    //     // console.log('la-key---layout--', key, i++);
    //     const builtPath = buildPath(props);
    //     renderNewElem(key, element, layoutResourceContent);
    //   }
    //   if (resourceContent) {
    //     console.log('la-key---resource--', key, i++);
    //     const builtPath = buildPath(props);
    //     renderNewElem(key, element, resourceContent);
    //   }
    // });
    // return () => exitMarkup();
  }, [layoutResourceContent, props.params.itemMap]);

  // useEffect(() => {
  //   return () => exitMarkup();
  // }, []);

  if (!layoutResourceContent || !mu) {
    return <div>Layout........</div>;
  }

  return (
    <MyElem
      input={mu.content}
      depth={props.depth}
      // params={props.params}
      inputs={props.inputs}
      itemParam={props.itemParam}
      form={props.form}
      currentPath={props.currentPath}
      localContextPath={props.localContextPath}
    ></MyElem>
  );

  // const data = layoutResourceContent.params.markup;
  // return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};
