import getStore from 'app/config/store';
import ErrorBoundary from 'app/shared/error/error-boundary';
import React, { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { MyElem } from './rendering';
import { buildPath } from './shared';
import { ComponentResourceContent, ItemMap, MarkupParams, SmMarkupProps, SmTextProps } from './type';
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
  const params: MarkupParams = props.params;
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
  const myRef = useRef(null);
  const [previousParams, setPreviousParams] = useState(null);
  const [roots, setRoots] = useState({});
  const [root, setRoot] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [creation, setCreation] = useState(new Date());

  // const exitMarkup = () => {
  //   console.log('smmm-exitMarkup exiting---', Object.keys(roots), params);
  //   Object.keys(roots).forEach(elemKey => {
  //     if (roots[elemKey]) {
  //       // setTimeout(() => {
  //       //   if (roots[elemKey]) {
  //       //     console.log('smmm-exitMarkup component unmount', elemKey);
  //       //     try {
  //       //       roots[elemKey].unmount();
  //       //     } catch (e) {
  //       //       console.error('smmm--------ERROR', e);
  //       //     } finally {
  //       //       delete roots[elemKey];
  //       //     }
  //       //   }
  //       // });
  //     }
  //   });
  // };

  // const buildElemKey = (key: string, creation: Date): string => {
  //   return key + '-' + creation.getTime();
  // };

  // const renderNewElem = (elemKey: string, newDate: number, element: Element, resourceContent: ComponentResourceContent) => {
  //   console.log('smmm-mukey-renderNewElem', Object.keys(roots), roots[elemKey]);

  //   Object.keys(roots).forEach(elemKey => {
  //     if (!elemKey.endsWith(newDate + '')) {
  //       setTimeout(() => {
  //         if (roots[elemKey]) {
  //           console.log('smmm-mukey-unmount', elemKey);
  //           roots[elemKey].unmount();
  //         }
  //         delete roots[elemKey];
  //       });
  //     }
  //     // if (roots[elemKey]) {
  //     //   setTimeout(() => {
  //     //     if (roots[elemKey]) {
  //     //       console.log('smmm-exitMarkup component unmount', elemKey);
  //     //       try {
  //     //         roots[elemKey].unmount();
  //     //       } catch (e) {
  //     //         console.error('smmm--------ERROR', e);
  //     //       } finally {
  //     //         delete roots[elemKey];
  //     //       }
  //     //     }
  //     //   });
  //     // }
  //   });

  //   if (!roots[elemKey]) {
  //     console.log('smmm-mukey-renderNewElemcreate', elemKey);
  //     roots[elemKey] = createRoot(element);
  //     setRoots(roots);
  //   }

  //   roots[elemKey].render(
  //     <ErrorBoundary>
  //       <BrowserRouter basename={baseHref}>
  //         <Provider store={store}>
  //           {/* <p>{creation.getTime()}s</p> */}
  //           <MyElem
  //             input={resourceContent}
  //             depth={props.depth}
  //             params={props.params ? params : null}
  //             itemParam={props.itemParam}
  //             form={props.form}
  //             currentPath={props.currentPath}
  //             localContextPath={props.localContextPath}
  //           ></MyElem>
  //         </Provider>
  //       </BrowserRouter>
  //       ,
  //     </ErrorBoundary>,
  //   );
  // };

  // console.log('mukey-----outside=', previousParams, params);

  // useEffect(() => {
  //   return () => exitMarkup();
  // }, [params]);

  const buildOptions = (itemMap: ItemMap) => ({
    replace(domNode) {
      const keys: string[] = Object.keys(itemMap);
      let result;
      keys.forEach(key => {
        if (domNode.attribs && domNode.name && domNode.name === 'sm-item' && domNode.attribs.key === key) {
          // return options[key];
          const newCurrentPath = props.currentPath === '/' ? props.currentPath + key : props.currentPath + '/' + key;
          // console.log('root=====a', key);
          const newDate = new Date();
          console.log('mukey---INPUT=', { ...props.inputParameters, ...itemMap[key].inputParameters });
          result = (
            <BrowserRouter basename={baseHref}>
              <Provider store={store}>
                {/* <p>{creation.getTime()}s</p> */}
                <MyElem
                  input={itemMap[key]}
                  depth={props.depth}
                  // params={props.params ? params : null}
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
        // console.log('root=====b');
        return result;
      }
      // return <h2>dddd1</h2>;
    },
  });

  // console.log('mukey-----', props.currentPath, initialized);

  useEffect(() => {
    const doc: Element = myRef.current;
    console.log('mukey-----params=', previousParams, params);
    let paramsHasChanged = false;
    if (!previousParams || previousParams !== params) {
      console.log('mukey-----changed=', previousParams, params);
      paramsHasChanged = true;
    }
    let r = root;
    // console.log('root=====beforecreating', props.currentPath, initialized);
    if (!initialized) {
      // console.log('root=====creating', props.currentPath);
      r = createRoot(document.getElementById(`${props.currentPath}-muRoot`));
      setRoot(r);
      setInitialized(true);
    }
    // console.log('mukey-useEffectkey-layoutHasChanged-----', paramsHasChanged);

    setPreviousParams(params);

    if (!paramsHasChanged) {
      return;
    }
    const html = params.markup;
    const options = buildOptions(params.itemMap);

    // Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
    //   const map = params.itemMap;
    //   const key = element.getAttribute('key');
    //   console.log('mukey-----', key);
    //   const resourceContent = map[key];
    //   if (resourceContent) {
    //     setCreation(newDate);
    //     const builtPath = buildPath(props);
    //     console.log('smmm-mukey----render-', key, resourceContent);
    //     // renderNewElem(buildElemKey(key, newDate), newDate.getTime(), element, resourceContent);
    //   }
    // });

    if (params.itemMap) {
      console.log('root=====rendering', props.currentPath);
      r.render(
        <>
          {parse(
            html,
            options,
            // {
            //   replace(domNode) {
            //     const keys: string[] = Object.keys(options);
            //     console.log('root=====key', keys);
            //     if ((domNode as any).attribs && (domNode as any).attribs.id === 'aaa') {
            //       // console.log('root===sssss==i', keys[i]);
            //       // console.log('root=====buildOptions', key, options1[key]);
            //       return <h1>hjg</h1>;
            //       // return <h2>dddd</h2>;
            //     }
            //   },
            // },
          )}
        </>,
      );
      // console.log('root=====aFTER');
    }
    const newDate = new Date();
  }, [params]);

  const data = params.markup;
  // return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
  return <div id={`${props.currentPath}-muRoot`} />;
};
