import getStore from 'app/config/store';
import AppRoutes from 'app/routes';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

import { calculateTargetLocalContextPath, handleParameterDefinitions } from './parameter-definition';
import { increment, MyElem } from './rendering';
import { buildPath, useCalculatedValueState } from './shared';
import { UiOpener } from './sm-resource-content';
import { SmText } from './sm-text';
import { SmMarkupProps, SmTextProps, TextParams, ValueInState } from './type';
import './../../app.scss';
import { Button } from 'reactstrap';
import { publishNavigateToEvent } from './action.utils';

export const SmInserted = ({ props }: { props: SmTextProps }) => {
  return <span>Inserted {props.currentPath}</span>;
};

export const navTo = (to: string) => {
  publishNavigateToEvent({
    to,
  });
};

export const Aaa = () => {
  const navigate = useNavigate();
  console.log('zzzzzzzzzzzzzzzz');

  return (
    <div>
      <Button className="me-2" color="info" onClick={() => navTo('/coca/render/rpageAgGridServer')}>
        STEF
      </Button>
    </div>
  );
};

export const SmMarkup = (props: SmMarkupProps) => {
  const params = props.params;
  const store = getStore();
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
  const myRef = useRef(null);

  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route path="/" element={<Root />}>
  //       <Route path="dashboard" element={<Dashboard />} />
  //       {/* ... etc. */}
  //     </Route>,
  //   ),
  // );
  const navigate = useNavigate();

  useEffect(() => {
    const doc: Element = myRef.current;
    Array.from(doc.getElementsByTagName('sm-item')).forEach(element => {
      console.log('key-----', element.getAttribute('key'));
      const map = params.itemMap;
      const key = element.getAttribute('key');
      const resourceContent = map[key];
      if (resourceContent) {
        const builtPath = buildPath(props);
        const root = createRoot(element);
        root.render(
          <React.StrictMode key={key}>
            <BrowserRouter basename={baseHref}>
              <Provider store={store}>
                <ErrorBoundary>
                  {/* <div>
                  <Aaa></Aaa>
                  <button onClick={() => navigate('/coca/render/rpageAgGridServer')}>Loginaaa</button>
                </div> */}

                  <UiOpener resourceContent={resourceContent} source={'markup: ' + key}></UiOpener>
                  <MyElem
                    input={resourceContent}
                    depth={props.depth}
                    params={props.params ? params : null}
                    itemParam={props.itemParam}
                    currentPath={props.currentPath}
                    localContextPath={props.localContextPath}
                  ></MyElem>
                </ErrorBoundary>
              </Provider>
            </BrowserRouter>
          </React.StrictMode>,
        );
      }

      // ReactDOM.render(
      //   <Provider store={store}>
      //     <SmText
      //       params={params}
      //       currentPath={props.currentPath}
      //       depth={props.depth}
      //       localContextPath={props.localContextPath}
      //       path={props.path}
      //     />
      //   </Provider>,
      //   element,
      // );
      // ReactDOM.render(<SmInserted props={props} />, element);
    });
  }, []);

  const data = params.markup;
  return <div ref={myRef} dangerouslySetInnerHTML={{ __html: data }} />;
};

// export const SmText = (props: SmTextProps) => {
//   if (!props.params) {
//     return (
//       <span>
//         <i>params is mandatory in SmText</i>
//       </span>
//     );
//   }

//   const textValue = props.params.textValue;
//   if (!textValue) {
//     return (
//       <span>
//         <i>textValue param is mandatory in SmText</i>
//       </span>
//     );
//   }
//   const params: TextParams = props.params;

//   handleParameterDefinitions(params, props);

//   const calculatedValue: ValueInState = useCalculatedValueState(props, textValue);

//   const data = '<tata><span>aaa</span></tata>';

//   // if (calculatedValue) {
//   //   if (calculatedValue.loading) {
//   //     return <span>Loading...</span>;
//   //   } else if (calculatedValue.error) {
//   //     return <span>Error: {calculatedValue.error}</span>;
//   //   } else if (calculatedValue.value)
//   //     return (
//   //       <div>
//   //         <span>{calculatedValue.value}</span>
//   //         <div dangerouslySetInnerHTML={{ __html: data }} />
//   //       </div>
//   //     );
//   // }
//   return (
//     <div>
//       <span>Avant</span>
//       <div dangerouslySetInnerHTML={{ __html: data }} />
//       <span>Apres</span>
//     </div>
//   );
// };
