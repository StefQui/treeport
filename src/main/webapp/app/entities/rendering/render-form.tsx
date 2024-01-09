import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import { IAttribute, IAttributeValue, IAttributeWithValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Input } from 'reactstrap';
import { DoubleValue } from '../attribute-value/attribute-value';
import { existsAndHasAValue } from './render-resource-page';
import {
  ATT_CONFIG_KEY,
  buildPath,
  CAMPAIGN_ID_KEY,
  displayWarning,
  ENTITY_IDS_KEY,
  ENTITY_KEY,
  FIELDS_ATTRIBUTES_KEY,
  increment,
  MyElem,
  PATH_SEPARATOR,
  RESOURCE_ID_KEY,
  RESOURCE_STATE,
  ROOT_PATH_SEPARATOR,
  STATE_RS_SELF_KEY,
  UPDATED_ATTRIBUTE_IDS_KEY,
  useCalculatedValueState,
  useCalculatedValueStateIfNotNull,
  useRenderingState,
} from './rendering';
import { getFieldAttributesAndConfig, saveAttributes, setAction, setRenderingContext } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

export const SmForm = props => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, unregister } = useForm({
    defaultValues: {
      'site:s1:toSite:period:2023': 'hhh',
    },
  });
  const onSubmit = values => {
    const fieldsIdsToSave = Object.keys(fieldAttributes).filter(fieldId => fieldAttributes[fieldId].config.isWritable);
    const toSave: IAttributeWithValue[] = fieldsIdsToSave.map(
      fieldId =>
        ({
          id: fieldAttributes[fieldId].id,
          attributeValue: getValueFromField(fieldId, fieldAttributes[fieldId], values[fieldId]),
        }) as IAttributeWithValue,
    );
    // alert(JSON.stringify(toSave));
    dispatch(
      saveAttributes({
        attributesToSave: toSave,
        orgaId: 'coca',
        path: buildPath(props),
      }),
    );
  };

  const updatedAttributeIds = useRenderingState(buildPath(props), UPDATED_ATTRIBUTE_IDS_KEY);

  useEffect(() => {
    console.log('updatedAttributeIds', updatedAttributeIds);
    if (updatedAttributeIds) {
      dispatch(
        setAction({
          source: buildPath(props),
          actionType: 'updateAttributes',
          [ENTITY_KEY]: { entityType: 'ATTRIBUTES', [ENTITY_IDS_KEY]: updatedAttributeIds },
        }),
      );
    }
  }, [updatedAttributeIds]);

  const getValueFromField = (fieldId: string, att: IAttributeWithValue, value): IAttributeValue => {
    const type = att.config.attributeType;

    if (type === 'DOUBLE') {
      const res: IDoubleValue = { attributeValueType: 'DOUBLE_VT', value };
      return res;
    } else if (type === 'BOOLEAN') {
      const res: IBooleanValue = { attributeValueType: 'BOOLEAN_VT', value };
      return res;
    }
  };

  const attributeContext = props.attributeContext;
  const fields = props.fields;
  const formContent = props.formContent;

  if (!attributeContext) {
    return <span>attributeContext param is mandatory in Form</span>;
  }

  if (!formContent) {
    return <span>formContent param is mandatory in Form</span>;
  }

  if (!fields) {
    return <span>fields param is mandatory in Form</span>;
  }

  const resourceId = attributeContext[RESOURCE_ID_KEY];
  const campaignId = attributeContext[CAMPAIGN_ID_KEY];

  if (!resourceId || !campaignId) {
    return <span>missing resourceId or campaignId</span>;
  }

  // const resourceId1 = useCalculatedValueState(props, resourceId);

  const resourceIdValue = useCalculatedValueStateIfNotNull(props, resourceId);
  const campaignIdValue = useCalculatedValueStateIfNotNull(props, campaignId);

  const [previousResourceIdValue, setPreviousResourceIdValue] = useState();
  const [previousCampaignIdValue, setPreviousCampaignIdValue] = useState();

  // // const [attributeIdsMap, setAttributeIdsMap] = useState({});

  // console.log('the form...', resourceId, campaignId);

  useEffect(() => {
    console.log('useEffect...', resourceIdValue, campaignIdValue);
    if (resourceIdValue !== previousResourceIdValue || campaignIdValue !== previousCampaignIdValue) {
      // if (false) {
      const newMap = fields
        .filter(field => field.fieldType === 'Field')
        .reduce((acc, field) => {
          acc[field.fieldId] = buildAttributeIdFormExploded(resourceIdValue, field.attributeConfigId, campaignIdValue);
          return acc;
        }, {});
      console.log('newMap', newMap);
      if (newMap) {
        // eslint-disable-next-line guard-for-in
        for (const k in newMap) {
          unregister(newMap[k]);
        }
      }
      // setAttributeIdsMap(newMap);
      dispatch(
        getFieldAttributesAndConfig({
          attributeIdsMap: newMap,
          orgaId: 'coca',
          path: buildPath(props),
        }),
      );

      setPreviousResourceIdValue(resourceIdValue);
      setPreviousCampaignIdValue(campaignIdValue);
    }
  }, [resourceIdValue, campaignIdValue]);

  const fieldAttributes: { [key: string]: IAttributeWithValue } = useAppSelector(state => {
    const formFieldsMap = state.rendering.renderingState[buildPath(props)];

    if (!formFieldsMap || !formFieldsMap[STATE_RS_SELF_KEY]) {
      return null;
    }
    console.log('formFieldsMap', formFieldsMap[STATE_RS_SELF_KEY][FIELDS_ATTRIBUTES_KEY]);
    return formFieldsMap[STATE_RS_SELF_KEY][FIELDS_ATTRIBUTES_KEY];
  });

  useEffect(() => {
    if (fieldAttributes) {
      console.log('changedAtt', fieldAttributes);
      const keys = Object.keys(fieldAttributes);
      const values = {};
      keys.forEach(key => {
        const att = fieldAttributes[key];
        values[key] = att ? getValueFromAttribute(att) : null;
      });
      console.log('reseting', values);
      reset(values);
    }
  }, [fieldAttributes]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <MyElem
        input={{ ...formContent }}
        depth={increment(props.depth)}
        form={{ register, unregister, formPath: buildPath(props) }}
        currentPath={props.currentPath + PATH_SEPARATOR + props.path}
        localContextPath={props.localContextPath}
      ></MyElem>
      <input type="submit" value="submit"></input>
    </form>
  );
};

const getValueFromAttribute = (att: IAttributeWithValue) => {
  const val = att.attributeValue;
  if (!val) {
    return null;
  }
  if (att.config.attributeType === 'DOUBLE') {
    return att.attributeValue.value;
  } else if (att.config.attributeType === 'BOOLEAN') {
    return att.attributeValue.value;
  }
  return 'not implemented for ' + att.config.attributeType;
};

export const extractAttributeId = (props, params) => {
  const resourceId = params[RESOURCE_ID_KEY];
  const campaignId = params[CAMPAIGN_ID_KEY];
  const attConfig = params[ATT_CONFIG_KEY];

  if (!resourceId || !campaignId || !attConfig) {
    return null;
  }

  return [
    useCalculatedValueState(props, resourceId),
    useCalculatedValueState(props, campaignId),
    useCalculatedValueState(props, attConfig),
  ];
};

export const SmAttributeField = props => {
  const form = props.form;
  console.log('SmAttributeField', props);

  if (!form) {
    return <span>form is mandatory in AttributeField</span>;
  }

  const attribute = useAppSelector(state => {
    const formFieldsMap = state.rendering.renderingState[props.form.formPath];
    if (!formFieldsMap || !formFieldsMap[STATE_RS_SELF_KEY]) {
      return null;
    }
    return formFieldsMap[STATE_RS_SELF_KEY][FIELDS_ATTRIBUTES_KEY]
      ? formFieldsMap[STATE_RS_SELF_KEY][FIELDS_ATTRIBUTES_KEY][props.fieldId]
      : null;
  });

  if (!attribute) {
    return <span>Missing attribute</span>;
  }
  return renderFormAttributeField(props, attribute);
};

const renderFormAttributeField = (props, attribute: IAttributeWithValue) => {
  if (attribute.config.attributeType === 'DOUBLE') {
    return (
      <label>
        {attribute.config.isWritable ? <span>{attribute.config.label}</span> : <i>{attribute.config.label}</i>}
        <input readOnly={!attribute.config.isWritable} {...props.form.register(props.fieldId)}></input>
      </label>
    );
  } else if (attribute.config.attributeType === 'BOOLEAN') {
    return (
      <label>
        {attribute.config.isWritable ? <span>{attribute.config.label}</span> : <i>{attribute.config.label}</i>}
        <input readOnly={!attribute.config.isWritable} type="checkbox" {...props.form.register(props.fieldId)}></input>
      </label>
    );
  }
  return <span>Not implemented yet : {attribute.config.attributeType}</span>;
};

export const buildAttributeIdFormExploded = (resourceIdVal, attConfigVal, campaignIdVal) => {
  return `site:${resourceIdVal}:${attConfigVal}:period:${campaignIdVal}`;
};
