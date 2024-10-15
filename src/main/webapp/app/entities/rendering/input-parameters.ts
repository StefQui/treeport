import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useEffect, useState } from 'react';
import { handleDataSet } from './dataset';
import { usePageContext } from './sm-layout-old';
import {
  applyPath,
  buildValue,
  getRootPath,
  getValueForPathInObject,
  PATH_SEPARATOR,
  useCalculatedValueState,
  useChangingCalculatedValueState,
} from './shared';
import { getResourceForRenderingStateParameters, setAnyInCorrectState } from './rendering.reducer';
import {
  ValueInState,
  Parameters,
  RenderingSliceState,
  emptyValue,
  RENDERING_CONTEXT,
  PaginationState,
  ActionState,
  SetCurrentPageAction,
  ParameterDefinition,
  RefToResourceDefinition,
  DatasetDefinition,
  ParameterTarget,
  RefToPageContextRuleDefinition,
  DatatreeDefinition,
  RuleDefinition,
  RefToInputParameter,
} from './type';
import { enrichToMainTarget, handleDataTree } from './datatree';
import { useParams } from 'react-router';
import { useOrgaId } from './render-resource-page';

export const handleInputParameters = (rule: RuleDefinition, props) => {
  // const targetLocalContextPath = calculateTargetLocalContextPath(params.target === 'childResource', props);
  // const callingParameterDefinitions = props.parameterDefinitions;
  if (!rule) {
    return;
  }
  console.log('handleInputParameters', rule, props);

  if (rule.ruleType === 'refToInputParameter') {
    const ref: RefToInputParameter = rule as RefToInputParameter;
    if (rule.inputParameterKey && props.inputParameters) {
    }
  }

  // console.log('targetLocalContextPath', targetLocalContextPath);
  // initLocalContext(callingParameterDefinitions, props, targetLocalContextPath);
};
