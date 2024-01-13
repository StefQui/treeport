import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/resource/resource.reducer';
import { IAttribute, IAttributeValue, IAttributeWithValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm, UseFormReset } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Input } from 'reactstrap';
import { DoubleValue } from '../attribute-value/attribute-value';
import { existsAndHasAValue } from './render-resource-page';
import {
  ActionState,
  // ATT_CONFIG_KEY,
  buildPath,
  // CAMPAIGN_ID_KEY,
  displayWarning,
  ENTITY_IDS_KEY,
  ENTITY_KEY,
  FIELDS_ATTRIBUTES_KEY,
  FormAttributeContextParam,
  FormFieldParam,
  increment,
  MyElem,
  PARAMS_FORM_ATTRIBUTE_CONTEXT_KEY,
  PARAMS_FORM_FIELDS_ATTRIBUTE_CONFIG_ID_KEY,
  PARAMS_FORM_FIELDS_FIELD_ID_KEY,
  PARAMS_FORM_FIELDS_FIELD_TYPE_KEY,
  PARAMS_FORM_FIELDS_KEY,
  PARAMS_FORM_FORM_CONTENT_KEY,
  PATH_SEPARATOR,
  RenderingSliceState,
  // RESOURCE_ID_KEY,
  ValueInState,
  ROOT_PATH_SEPARATOR,
  STATE_RS_SELF_KEY,
  UPDATED_ATTRIBUTE_IDS_KEY,
  useCalculatedValueState,
  useCalculatedValueStateIfNotNull,
  // useRenderingState,
} from './rendering';
import { getFieldAttributesAndConfig, saveAttributes, setAction } from './rendering.reducer';
import { SmRefToResource } from './resource-content';

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
const sendUpdateAttributesActionOnSave = (builtPath: string, updatedAttributeIds: string[], mapOfFields) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('updatedAttributeIds!!!!', updatedAttributeIds);
    if (updatedAttributeIds) {
      const action: ActionState = {
        source: builtPath,
        actionType: 'updateAttribute',
        [ENTITY_KEY]: { entityType: 'ATTRIBUTES', entityIds: updatedAttributeIds },
      };
      dispatch(setAction(action));
      fetchAttributes(dispatch, builtPath, mapOfFields);
    }
  }, [updatedAttributeIds]);
};

export const SmForm = props => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, unregister } = useForm({ defaultValues: {} });
  const builtPath = buildPath(props);

  const onSubmit = values => {
    const fieldsIdsToSave = Object.keys(fieldAttributes).filter(fieldId => fieldAttributes[fieldId].config.isWritable);
    const toSave: IAttributeWithValue[] = fieldsIdsToSave.map(
      fieldId =>
        ({
          id: fieldAttributes[fieldId].id,
          attributeValue: getValueFromField(fieldId, fieldAttributes[fieldId], values[fieldId]),
        }) as IAttributeWithValue,
    );
    dispatch(
      saveAttributes({
        attributesToSave: toSave,
        orgaId: 'coca',
        path: buildPath(props),
      }),
    );
  };

  const fieldAttributes: { [key: string]: IAttributeWithValue } = useStateInSelf(builtPath, FIELDS_ATTRIBUTES_KEY);

  const updatedAttributeIds: string[] = useStateInSelf(builtPath, UPDATED_ATTRIBUTE_IDS_KEY);

  const [mapOfFields, setMapOfFields] = useState({});

  sendUpdateAttributesActionOnSave(builtPath, updatedAttributeIds, mapOfFields);

  const attributeContext: FormAttributeContextParam = props[PARAMS_FORM_ATTRIBUTE_CONTEXT_KEY];
  const fields: FormFieldParam[] = props[PARAMS_FORM_FIELDS_KEY];
  const formContent = props[PARAMS_FORM_FORM_CONTENT_KEY];

  if (!attributeContext) {
    return <span>attributeContext param is mandatory in Form</span>;
  }

  if (!formContent) {
    return <span>formContent param is mandatory in Form</span>;
  }

  if (!fields) {
    return <span>fields param is mandatory in Form</span>;
  }

  const resourceId = attributeContext.resourceId;
  const campaignId = attributeContext.campaignId;

  if (!resourceId || !campaignId) {
    return <span>missing resourceId or campaignId</span>;
  }

  const resourceIdValue = useCalculatedValueStateIfNotNull(props, resourceId);
  const campaignIdValue = useCalculatedValueStateIfNotNull(props, campaignId);

  const [previousResourceIdValue, setPreviousResourceIdValue] = useState();
  const [previousCampaignIdValue, setPreviousCampaignIdValue] = useState();

  useEffect(() => {
    if (resourceIdValue !== previousResourceIdValue || campaignIdValue !== previousCampaignIdValue) {
      const newMap = fields
        .filter(field => field[PARAMS_FORM_FIELDS_FIELD_TYPE_KEY] === 'Field')
        .reduce((acc, field) => {
          acc[field[PARAMS_FORM_FIELDS_FIELD_ID_KEY]] = buildAttributeIdFormExploded(
            resourceIdValue,
            field[PARAMS_FORM_FIELDS_ATTRIBUTE_CONFIG_ID_KEY],
            campaignIdValue,
          );
          return acc;
        }, {});
      if (newMap) {
        setMapOfFields(newMap);
        // eslint-disable-next-line guard-for-in
        for (const k in newMap) {
          unregister(newMap[k]);
        }
      }
      fetchAttributes(dispatch, buildPath(props), newMap);
      // dispatch(
      //   getFieldAttributesAndConfig({
      //     attributeIdsMap: newMap,
      //     orgaId: 'coca',
      //     path: buildPath(props),
      //   }),
      // );

      setPreviousResourceIdValue(resourceIdValue);
      setPreviousCampaignIdValue(campaignIdValue);
    }
  }, [resourceIdValue, campaignIdValue]);

  updateFormWithFieldAttributes(fieldAttributes, reset);

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

const fetchAttributes = (dispatch, builtPath, newMap) => {
  dispatch(
    getFieldAttributesAndConfig({
      attributeIdsMap: newMap,
      orgaId: 'coca',
      path: builtPath,
    }),
  );
};

const updateFormWithFieldAttributes = (fieldAttributes: { [key: string]: IAttributeWithValue }, reset) => {
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
  const { resourceId, campaignId, attConfig } = params;

  if (!resourceId || !campaignId || !attConfig) {
    return null;
  }

  return [
    useCalculatedValueState(props, resourceId),
    useCalculatedValueState(props, campaignId),
    useCalculatedValueState(props, attConfig),
  ];
};

export const useStateInSelf = (formPath: string, key: string) => {
  return useAppSelector((state: RenderingSliceState) => {
    const rs = state.rendering.componentsState[formPath];
    // console.log('zzzzzzz',  key, self);
    if (!rs || !rs.self) {
      return null;
    }
    return rs.self[key];
  });
};

export const useStateInSelfWithKey = (formPath: string, key1: string, key2: string) => {
  const key1State = useStateInSelf(formPath, key1);
  const [key2State, setKey2State] = useState();

  useEffect(() => {
    // console.log('aaaaaaaa', key1, key2, key1State);
    if (key1State) {
      setKey2State(key1State[key2]);
    }
  }, [key1State]);

  return key2State;
};

export const SmAttributeField = props => {
  const form = props.form;
  // const action = useAppSelector(state => state.rendering.action);
  // const dispatch = useAppDispatch();

  if (!form) {
    return <span>form is mandatory in AttributeField</span>;
  }

  const attribute: IAttributeWithValue = useStateInSelfWithKey(props.form.formPath, FIELDS_ATTRIBUTES_KEY, props.fieldId);

  // useEffect(() => {
  //   if (action && action.actionType === 'updateAttributes') {
  //     // if (!hasChanged()) {
  //     //   // IMPLEMENT HERE COMPARAISON WITH PREVIOUS EXPLODED VALUE   ??????????
  //     //   return;
  //     // }

  //     if (attribute && attribute.id) {
  //       console.log('action...', action, attribute.id);
  //       if (action[ENTITY_KEY][ENTITY_IDS_KEY].indexOf(attId) !== -1) {
  //         dispatch(loadAttribute(props, resourceIdVal.value, attConfigVal.value, campaignIdVal.value));
  //       }
  //     }
  //   }
  // }, [action]);

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
        &nbsp;&nbsp;
        <input readOnly={!attribute.config.isWritable} {...props.form.register(props.fieldId)}></input>
      </label>
    );
  } else if (attribute.config.attributeType === 'BOOLEAN') {
    return (
      <label>
        {attribute.config.isWritable ? <span>{attribute.config.label}</span> : <i>{attribute.config.label}</i>}
        &nbsp;&nbsp;
        <input readOnly={!attribute.config.isWritable} type="checkbox" {...props.form.register(props.fieldId)}></input>
      </label>
    );
  }
  return <span>Not implemented yet : {attribute.config.attributeType}</span>;
};

export const buildAttributeIdFormExploded = (resourceIdVal, attConfigVal, campaignIdVal): string => {
  return `site:${resourceIdVal}:${attConfigVal}:period:${campaignIdVal}`;
};
