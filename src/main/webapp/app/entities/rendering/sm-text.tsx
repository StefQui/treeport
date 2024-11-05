import React, { useEffect } from 'react';

import { handleParameterDefinitions } from './parameter-definition';
import { useCalculatedValueState } from './shared';
import { RefToLocalContextRuleDefinition, SmTextProps, TextParams, ValueInState } from './type';

export const SmText = (props: SmTextProps) => {
  if (!props.params) {
    return (
      <span>
        <i>params is mandatory in SmText</i>
      </span>
    );
  }

  useEffect(() => {
    return () => {
      if (props.params.textValue.ruleType === 'refToLocalContext') {
        console.log(
          'cleaning sm-text refToLocalContext...',
          props.params,
          (props.params.textValue as RefToLocalContextRuleDefinition).sourceParameterKey,
        );
        return;
      }
      console.log('cleaning sm-text...', props.params, props.params.textValue.ruleType);
    };
  }, []);

  const textValue = props.params.textValue;
  if (!textValue) {
    return (
      <span>
        <i>textValue param is mandatory in SmText</i>
      </span>
    );
  }
  const params: TextParams = props.params;

  handleParameterDefinitions(params, props);

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
