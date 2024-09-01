import React, { useEffect, useState } from 'react';

import { useAppDispatch } from 'app/config/store';
import { setAction, setInLocalState } from './rendering.reducer';
import { useCalculatedValueState, buildPath } from './shared';
import { InputParams, RuleDefinition, ValueInState } from './type';

export const SmInput = (props: { params: InputParams; depth: string; currentPath: string; path: string; localContextPath: string }) => {
  // const defaultValue: RESOURCE_STATE = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY]
  //   ? { loading: false, value: props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY] }
  //   : { loading: false };

  const outputKey = props.params.outputParameterKey;
  if (!outputKey) {
    return (
      <span>
        <i>outputParameterKey param is mandatory in SmInput</i>
      </span>
    );
  }

  const defaultValueKey: RuleDefinition = props.params.defaultValue;
  const defaultValue: ValueInState = defaultValueKey ? useCalculatedValueState(props, defaultValueKey) : { loading: false };
  const [value, setValue] = useState(defaultValue);
  const dispatch = useAppDispatch();
  const builtPath = buildPath(props);

  // const defaultValue: RuleDefinition = props.params[PARAMS_INPUT_DEFAULT_VALUE_KEY];

  useEffect(() => {
    if (defaultValue) {
      dispatch(
        setInLocalState({
          localContextPath: props.localContextPath,
          parameterKey: props.params.outputParameterKey,
          value: defaultValue,
        }),
      );

      // dispatch(
      //   setInRenderingStateOutputs({
      //     path: builtPath,
      //     value: {
      //       [OUTPUT_KEY]: props.params.defaultValue.const,
      //     },
      //   }),
      // );
    }
  }, []);

  const handleChange = event => {
    setValue(event.target.value);
    dispatch(
      setInLocalState({
        localContextPath: props.localContextPath,
        parameterKey: props.params.outputParameterKey,
        value: { value: event.target.value, loading: false },
      }),
    );
    // dispatch(
    //     setInRenderingStateOutputs({
    //       path: builtPath,
    //       value: {
    //         [OUTPUT_KEY]: event.target.value,
    //       },
    //     }),
    //   );
    // dispatch(setAction({ source: builtPath, actionType: 'textChanged', value: event.target.value }));
  };

  return (
    <div>
      <input value={value ? value.value : null} onChange={handleChange}></input>
    </div>
  );
};
