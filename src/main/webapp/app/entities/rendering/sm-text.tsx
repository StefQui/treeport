import React from 'react';
import { handleInputParameters } from './input-parameters';

import { handleParameterDefinitions } from './parameter-definition';
import { useCalculatedValueState } from './shared';
import { SmTextProps, TextParams, ValueInState } from './type';

export const SmText = (props: SmTextProps) => {
  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmText</i>
      </span>
    );
  }

  const textValue = props.params.textValue;
  if (!textValue) {
    return (
      <span>
        <i>textValue param is mandatory in SmText</i>
      </span>
    );
  }

  // console.log('inputParametersss', props.inputParameters);
  const params: TextParams = props.params;

  handleParameterDefinitions(params, props);
  // handleInputParameters(params.textValue, props);
  console.log('smtext...', props.inputParameters, props.localContextPath);

  const calculatedValue: ValueInState = useCalculatedValueState(props, textValue);

  if (calculatedValue) {
    if (calculatedValue.loading) {
      return <span>Loading...</span>;
    } else if (calculatedValue.error) {
      return <span>Error: {calculatedValue.error}</span>;
    } else if (calculatedValue.value) return <span>{calculatedValue.value}</span>;
  }
  return (
    <span>
      <i>No value for SmText</i>
    </span>
  );
};
