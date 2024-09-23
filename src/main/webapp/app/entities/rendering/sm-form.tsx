import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IAttribute, IAttributeValue, IAttributeWithValue, IBooleanValue, IDoubleValue } from 'app/shared/model/attribute.model';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm, UseFormReset } from 'react-hook-form';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Col, FormGroup, FormProps, Input, Label } from 'reactstrap';
import { DoubleValue } from '../attribute-value/attribute-value';
import { existsAndHasAValue } from './render-resource-page';
import { MyElem, increment } from './rendering';
import { getFieldAttributesAndConfig, saveAttributes, setAction } from './rendering.reducer';
import { SmRefToResource } from './sm-resource-content';
import { buildPath, useCalculatedValueStateIfNotNull, PATH_SEPARATOR, useCalculatedValueState } from './shared';
import {
  UpdateAttributeAction,
  FormAttributeContextParam,
  FormFieldParam,
  RenderingSliceState,
  SmFormProps,
  SmFormButtonProps,
} from './type';

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
      const action: UpdateAttributeAction = {
        source: builtPath,
        actionType: 'updateAttribute',
        timestamp: new Date(),
        entity: { entityType: 'ATTRIBUTES', entityIds: updatedAttributeIds },
      };
      dispatch(setAction(action));
      fetchAttributes(dispatch, builtPath, mapOfFields);
    }
  }, [updatedAttributeIds]);
};

export const SmForm = (props: SmFormProps) => {
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

  const fieldAttributes: { [key: string]: IAttributeWithValue } = useStateInSelf(builtPath, 'fieldAttributes');

  const updatedAttributeIds: string[] = useStateInSelf(builtPath, 'updatedAttributeIds');

  const [mapOfFields, setMapOfFields] = useState({});

  sendUpdateAttributesActionOnSave(builtPath, updatedAttributeIds, mapOfFields);

  const attributeContext: FormAttributeContextParam = props.params.attributeContext;
  const fields: FormFieldParam[] = props.params.fields;
  const formContent = props.params.formContent;

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
        .filter(field => field.fieldType === 'Field')
        .reduce((acc, field) => {
          acc[field.fieldId] = buildAttributeIdFormExploded(resourceIdValue, field.attributeConfigId, campaignIdValue);
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

export const SmFormButton = (props: SmFormButtonProps) => {
  const form = props.form;
  return (
    <Button color={props.params.color} type="button" value="submit">
      {props.params.label}
    </Button>
  );
};

export const SmAttributeField = props => {
  const form = props.form;
  // const action = useAppSelector(state => state.rendering.action);
  // const dispatch = useAppDispatch();

  const fieldId = props.params.fieldId;
  console.log('SmAttributeField...', props.form.formPath, fieldId);
  const attribute: IAttributeWithValue = useStateInSelfWithKey(props.form.formPath, 'fieldAttributes', fieldId);

  if (!form) {
    return <span>form is mandatory in AttributeField</span>;
  }

  if (!attribute) {
    return <span></span>;
  }
  return renderFormAttributeField(props, attribute);
};

const FormInput = ({ register, name, ...rest }) => {
  const { ref, ...registerField } = register(name);

  return <Input innerRef={ref} {...registerField} {...rest} />;
};

const renderFormAttributeField = (props, attribute: IAttributeWithValue) => {
  console.log('AAAAAAAA', attribute.config.attributeType, props);
  const fieldId = props.params.fieldId;

  if (attribute.config.attributeType === 'DOUBLE') {
    return (
      <FormGroup row>
        <Label for="exampleEmail" sm={6}>
          {attribute.config.label}
        </Label>
        <Col sm={6}>
          <FormInput readOnly={!attribute.config.isWritable} name={fieldId} register={props.form.register} />
        </Col>
      </FormGroup>
    );
  } else if (attribute.config.attributeType === 'BOOLEAN') {
    return (
      <FormGroup row>
        <Label for="exampleEmail" sm={6}>
          {attribute.config.label}
        </Label>
        <Col sm={6}>
          <FormInput type="checkbox" readOnly={!attribute.config.isWritable} name={fieldId} register={props.form.register} />
        </Col>
      </FormGroup>
      // <label>
      //   {attribute.config.isWritable ? <span>{attribute.config.label}</span> : <i>{attribute.config.label}</i>}
      //   &nbsp;&nbsp;
      //   <input readOnly={!attribute.config.isWritable} type="checkbox" {...props.form.register(fieldId)}></input>
      // </label>
    );
  }
  return <span>Not implemented yet : {attribute.config.attributeType}</span>;
};

export const buildAttributeIdFormExploded = (resourceIdVal, attConfigVal, campaignIdVal): string => {
  return `resource:${resourceIdVal}:${attConfigVal}:period:${campaignIdVal}`;
};
