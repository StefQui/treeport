import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'reactstrap';

import SiteList from '../site/site-list';
import { calculateTargetLocalContextPath, SmRefToResource } from './sm-resource-content';
import { SmAttributeField, SmForm, SmFormButton } from './sm-form';
import { SmOldLayout, SmMenu, SmPage, usePageContext } from './sm-layout-old';
import { SmDatasetList } from './sm-dataset-list';
import { SmText } from './sm-text';
import { SmInput } from './sm-input';
import { SmAttRef } from './att-ref';
import { ValueInState, RENDERING_CONTEXT, ComponentResourceContent, InputParameters, SmFormParam } from './type';
import { buildPath, useCalculatedValueState } from './shared';
import { SmDatasetTable } from './sm-dataset-table';
import { SmVerticalPanel } from './sm-vertical-panel';
import { useRefToLocalContext } from './parameter-definition';
import { SmDatasetTree } from './sm-dataset-tree';
import { SmAgGrid } from './sm-ag-grid';
import { SmAggridTree } from './sm-aggrid-tree';
import { UpdateResourceDialog } from '../resource/resource-update-dialog';
import { SmMarkup } from './sm-markup';
import { useNavigate } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import getStore from 'app/config/store';
import { SmLink } from './sm-link';
import { SmLayout } from './sm-layout';
import { SmOldAttributeField, SmOldForm } from './sm-old-form';
import { UseFormReturn } from 'react-hook-form';

export const initialFilter: ValueInState = { loading: true, value: null };

export const TheSiteList = props => {
  return <SiteList {...props}></SiteList>;
};

export const hidden = () => {
  return <span>Hidden...</span>;
};

export const MyElem = (props: {
  input: ComponentResourceContent;
  currentPath: string;
  depth: string;
  localContextPath: string;
  inputs: InputParameters;
  form?: any & { formPath?: string };
  itemParam?: any;
}) => {
  if (props.input && props.input.display) {
    // console.log('MyElem ----Display', props.input);
  }
  // const shouldDisplay = useShouldDisplay(props.input);

  const renderSwitch = params => {
    // console.log('renderSwitch', params.componentType, props);

    switch (params.componentType) {
      case 'SmText':
        return <SmText {...params}></SmText>;
      case 'SmLink':
        return <SmLink {...params}></SmLink>;
      case 'SmMarkup':
        return <SmMarkup {...params}></SmMarkup>;
      case 'SmLayout':
        return <SmLayout {...params}></SmLayout>;
      case 'SmAgGrid':
        return <SmAgGrid {...params}></SmAgGrid>;
      case 'SmInput':
        return <SmInput {...params}></SmInput>;
      case 'SmRefToResource':
        return <SmRefToResource {...params}></SmRefToResource>;
      case 'SmAttRef':
        return <SmAttRef {...params}></SmAttRef>;
      case 'siteList':
        return <TheSiteList {...params}></TheSiteList>;
      case 'dataSetTable':
        return <SmDatasetTable {...params}></SmDatasetTable>;
      case 'dataSetList':
        return <SmDatasetList {...params}></SmDatasetList>;
      case 'dataSetTree':
        return <SmDatasetTree {...params}></SmDatasetTree>;
      case 'aggridTree':
        return <SmAggridTree {...params}></SmAggridTree>;
      case 'OldForm':
        return <SmOldForm {...params}></SmOldForm>;
      case 'form':
        return <SmForm {...params}></SmForm>;
      case 'formButton':
        return <SmFormButton {...params}></SmFormButton>;
      case 'attributeField':
        return <SmAttributeField {...params}></SmAttributeField>;
      case 'OldAttributeField':
        return <SmOldAttributeField {...params}></SmOldAttributeField>;
      case 'page':
        return <SmPage {...params}></SmPage>;
      case 'menu':
        return <SmMenu {...params}></SmMenu>;
      case 'layoutElement':
        return <SmOldLayout {...params}></SmOldLayout>;
      case 'verticalPanel':
        return <SmVerticalPanel {...params}></SmVerticalPanel>;
      default:
        return <p>Not implemented...{params.componentType}</p>;
    }
  };
  if (props.input && props.input.display) {
    const shouldDisplay = useShouldDisplay(props.input);

    if (!shouldDisplay) return;
  }

  return (
    <MyWrapper
      {...{
        ...props.input,
        currentPath: props.currentPath,
        depth: props.depth,
        localContextPath: props.localContextPath,
      }}
      // key={props.currentPath}
    >
      {renderSwitch({
        ...props.input,
        currentPath: props.currentPath,
        depth: props.depth,
        form: props.form,
        itemParam: props.itemParam,
        inputs: props.inputs,
        localContextPath: props.localContextPath,
      })}
    </MyWrapper>
  );
};

export const increment = (depth: string) => {
  const depthAsNumber = Number(depth);
  return '' + (depthAsNumber + 1);
};

export const MyWrapper = ({ children, ...props }) => {
  let cn = '';
  const pageContext: RENDERING_CONTEXT = usePageContext();
  if (props.border) {
    cn += ' border-2';
  }

  const targetLocalContextPath = calculateTargetLocalContextPath(true, props);

  const lc = useRefToLocalContext(targetLocalContextPath);

  const displayPath = false;

  if (displayPath) {
    return (
      <Col md={props.col ?? 12} className={cn}>
        <Col md="12">
          <i className="wrapper-text">
            (path={buildPath(props)})({props.componentType}, depth:{props.depth}, local={props.localContextPath})
          </i>
        </Col>{' '}
        <Col md="12">
          {/* {props.componentType === ELEM_LAYOUT_ELEMENT || props.componentType === ELEM_REF_TO_RESOURCE_ELEMENT
        ? (<pre>{JSON.stringify(pageContext ? pageContext : {}, null, 2)}</pre>) : ""} */}
          {props.componentType === 'layoutElement' || props.componentType === 'SmRefToResource' ? (
            <div>
              <b>LocalContext: {targetLocalContextPath}</b>
              <pre>{JSON.stringify(lc ? lc : {}, null, 2)}</pre>
            </div>
          ) : (
            ''
          )}
        </Col>
        {children}
      </Col>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export const hasChanged = (previous?: ValueInState, next?: ValueInState) => {
  if (!previous) {
    return !!next;
  }
  if (!next) {
    return true;
  }
  return (
    previous.error !== next.error || previous.loading !== next.loading || previous.value !== next.value || previous.usedId !== next.usedId
  );
};

const useShouldDisplay = (props): boolean => {
  const display = props.display;
  const [previous, setPrevious] = useState(null);
  if (display && display.valueExists) {
    const valueExists: ValueInState = useCalculatedValueState(props, display.valueExists);
    const [shouldDisplay, setShouldDisplay] = useState(null);
    useEffect(() => {
      if (valueExists && hasChanged(previous, valueExists)) {
        setShouldDisplay(evaluateValueExistsShouldDisplay(valueExists));
        setPrevious(valueExists);
      }
    }, [valueExists]);
    return shouldDisplay;
  } else if (display && display.valueDoesNotExist) {
    const valueDoesNotExist: ValueInState = useCalculatedValueState(props, display.valueDoesNotExist);
    const [shouldDisplay, setShouldDisplay] = useState(null);
    useEffect(() => {
      if (valueDoesNotExist && hasChanged(previous, valueDoesNotExist)) {
        setShouldDisplay(evaluateValueDoesNotExistShouldDisplay(valueDoesNotExist));
        setPrevious(valueDoesNotExist);
      }
    }, [valueDoesNotExist]);
    return shouldDisplay;
  }
};

export const evaluateValueExistsShouldDisplay = valueExists => {
  if (valueExists) {
    if (valueExists.loading) {
      return false;
    } else if (valueExists.error) {
      return false;
    } else {
      return !!valueExists.value;
    }
  }
  return true;
};
const evaluateValueDoesNotExistShouldDisplay = valueDoesNotExist => {
  if (valueDoesNotExist) {
    if (valueDoesNotExist) {
      if (valueDoesNotExist.loading) {
        return false;
      } else if (valueDoesNotExist.error) {
        return false;
      } else {
        return !valueDoesNotExist.value;
      }
    }
  }
  return true;
};
