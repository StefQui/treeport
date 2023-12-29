import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import { IAttribute, IAttributeValue, IAttributeWithValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Input } from 'reactstrap';
import { DoubleValue } from '../attribute-value/attribute-value';
import {
  ATT_CONFIG_KEY,
  buildPath,
  CAMPAIGN_ID_KEY,
  displayWarning,
  ENTITY_IDS_KEY,
  ENTITY_KEY,
  FIELDS_ATTRIBUTES_KEY,
  MyElem,
  PATH_SEPARATOR,
  RESOURCE_ID_KEY,
  ROOT_PATH_SEPARATOR,
  UPDATED_ATTRIBUTE_IDS_KEY,
  useCalculatedValueState,
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

  const resourceIdVal = useCalculatedValueState(props, resourceId);
  const campaignIdVal = useCalculatedValueState(props, campaignId);

  const [attributeIdsMap, setAttributeIdsMap] = useState({});

  useEffect(() => {
    if (resourceIdVal && campaignIdVal) {
      const newMap = fields
        .filter(field => field.fieldType === 'Field')
        .reduce((acc, field) => {
          acc[field.fieldId] = buildAttributeIdFormExploded(resourceIdVal, field.attributeConfigId, campaignIdVal);
          return acc;
        }, {});
      // console.log('newMap', newMap);
      if (attributeIdsMap) {
        // eslint-disable-next-line guard-for-in
        for (const k in attributeIdsMap) {
          unregister(attributeIdsMap[k]);
        }
      }
      setAttributeIdsMap(newMap);
      dispatch(
        getFieldAttributesAndConfig({
          attributeIdsMap: newMap,
          orgaId: 'coca',
          path: buildPath(props),
        }),
      );
    }
  }, [resourceIdVal, campaignIdVal]);

  const fieldAttributes: { [key: string]: IAttributeWithValue } = useAppSelector(state => {
    const formFieldsMap = state.rendering.renderingState[buildPath(props)];
    if (formFieldsMap == null) {
      return null;
    }
    return formFieldsMap[FIELDS_ATTRIBUTES_KEY];
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
      reset(values);
    }
  }, [fieldAttributes]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <MyElem
        input={{ ...formContent }}
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

  // const resourceIdVal = useCalculatedValueState(props, resourceId);
  // const campaignIdVal = useCalculatedValueState(props, campaignId);
  // const attConfigVal = useCalculatedValueState(props, attConfig);
};

export const SmAttributeField = props => {
  const form = props.form;

  console.log('props.form.formPath', props.form.formPath);

  if (!form) {
    return <span>form is mandatory in AttributeField</span>;
  }

  // if (!props.params) {
  //   return (
  //     <span>
  //       <i>params is mandatory in SmAttributeField</i>
  //     </span>
  //   );
  // }

  const attribute = useAppSelector(state => {
    const formFieldsMap = state.rendering.renderingState[props.form.formPath];
    if (formFieldsMap == null) {
      return null;
    }
    console.log('useAppSelector', formFieldsMap[FIELDS_ATTRIBUTES_KEY] ? formFieldsMap[FIELDS_ATTRIBUTES_KEY][props.fieldId] : null);
    return formFieldsMap[FIELDS_ATTRIBUTES_KEY] ? formFieldsMap[FIELDS_ATTRIBUTES_KEY][props.fieldId] : null;
  });

  // const resourceId = props.params[RESOURCE_ID_KEY];
  // const campaignId = props.params[CAMPAIGN_ID_KEY];
  // const attConfig = props.params[ATT_CONFIG_KEY];

  // if (!resourceId || !campaignId || !attConfig) {
  //   return displayWarning(resourceId, campaignId, attConfig);
  // }

  // const resourceIdVal = useCalculatedValueState(props, resourceId);
  // const campaignIdVal = useCalculatedValueState(props, campaignId);
  // const attConfigVal = useCalculatedValueState(props, attConfig);

  // const [attributeId, setAttributeId] = useState('');
  useEffect(() => {
    // console.log('SmAttributeField has changed', resourceIdVal, attConfigVal, campaignIdVal);
    if (attribute) {
      // if (attributeId) {
      //   props.form.unregister(attributeId);
      //   props.form.doWatch('-------unregister:   ' + attributeId);
      // }
      console.log('-----', attribute);
      // setAttributeId(buildAttributeIdFormExploded(resourceIdVal, attConfigVal, campaignIdVal));
      // props.form.doWatch('--------register:   ' + buildAttributeIdFormExploded(resourceIdVal, attConfigVal, campaignIdVal));
    }
    console.log('SmAttributeField has changed===', props);
  }, [attribute]);

  // useEffect(() => {
  //   props.form.doWatch('mmm');
  // }, []);
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
