import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ATT_CONFIG_KEY,
  buildPath,
  CAMPAIGN_ID_KEY,
  displayWarning,
  MyElem,
  PATH_SEPARATOR,
  RESOURCE_ID_KEY,
  ROOT_PATH_SEPARATOR,
  useCalculatedValueState,
} from './rendering';
import { setRenderingContext } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

export const SmForm = props => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, unregister } = useForm({
    defaultValues: {
      'site:s1:toSite:period:2023': 'hhh',
    },
  });
  const onSubmit = a => alert(JSON.stringify(a));

  const formId = props.formId;
  const formContent = props.formContent;

  if (!formContent) {
    return <span>formContent param is mandatory in Form</span>;
  }

  if (!formId) {
    return <span>formId param is mandatory in Form</span>;
  }

  // useEffect(() => {
  //   // console.log('SmForm - formState');
  // }, []);

  useEffect(() => {
    console.log('afterwatch', props);
  });

  const doWatch = a => {
    console.log('watch', a);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <MyElem
        input={{ ...formContent }}
        form={{ register, unregister, doWatch }}
        currentPath={props.currentPath + PATH_SEPARATOR + props.path}
        localContextPath={props.localContextPath}
      ></MyElem>
      <input type="submit" value="submit"></input>
    </form>
  );
};

export const SmAttributeField = props => {
  const form = props.form;

  if (!form) {
    return <span>form is mandatory in AttributeField</span>;
  }

  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmAttributeField</i>
      </span>
    );
  }

  const resourceId = props.params[RESOURCE_ID_KEY];
  const campaignId = props.params[CAMPAIGN_ID_KEY];
  const attConfig = props.params[ATT_CONFIG_KEY];

  if (!resourceId || !campaignId || !attConfig) {
    return displayWarning(resourceId, campaignId, attConfig);
  }

  const resourceIdVal = useCalculatedValueState(props, resourceId);
  const campaignIdVal = useCalculatedValueState(props, campaignId);
  const attConfigVal = useCalculatedValueState(props, attConfig);

  const [attributeId, setAttributeId] = useState('');
  useEffect(() => {
    // console.log('SmAttributeField has changed', resourceIdVal, attConfigVal, campaignIdVal);
    if (resourceIdVal && campaignIdVal && attConfigVal) {
      if (attributeId) {
        props.form.unregister(attributeId);
        props.form.doWatch('-------unregister:   ' + attributeId);
      }
      console.log('-----', props);
      setAttributeId(buildAttributeIdFormExploded(resourceIdVal, attConfigVal, campaignIdVal));
      props.form.doWatch('--------register:   ' + buildAttributeIdFormExploded(resourceIdVal, attConfigVal, campaignIdVal));
    }
    console.log('SmAttributeField has changed===', props);
  }, [resourceIdVal, campaignIdVal, attConfigVal]);

  useEffect(() => {
    props.form.doWatch('mmm');
  }, []);
  if (!attributeId) {
    return <span>Missing attributeId</span>;
  }
  return (
    <label>
      {attributeId}
      <input {...props.form.register(attributeId)}></input>
    </label>
  );
};

export const buildAttributeIdFormExploded = (resourceIdVal, attConfigVal, campaignIdVal) => {
  return `site:${resourceIdVal}:${attConfigVal}:period:${campaignIdVal}`;
};
