import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  ValueInState,
  RenderingSliceState,
  RuleDefinition,
  ItemParamPropertyRuleDefinition,
  AttributePropertyDefinition,
  ConstantRuleDefinition,
  PaginationStateRuleDefinition,
  ParameterDefinition,
  ParameterTarget,
  RefToLocalContextRuleDefinition,
  RefToPageContextRuleDefinition,
} from './type';
import { generateLabel } from './sm-dataset-table';
import { useRefToLocalContextValue, useRefToPageContextValue, useConstantValue } from './parameter-definition';
import { setAnyInCorrectState } from './rendering.reducer';
import { enrichToMainTarget } from './datatree';

export const PATH_SEPARATOR = '/';
export const ROOT_PATH_SEPARATOR = '/';

export function buildPath(props): string {
  const path = props.path;
  if (!path) {
    return props.currentPath;
  }
  const currentPath = props.currentPath;
  if (getRootPath() === currentPath) {
    return currentPath + props.path;
  }

  return props.currentPath + PATH_SEPARATOR + props.path;
}

export function getRootPath() {
  return PATH_SEPARATOR;
}

export const applyPath = (path, pathToApply) => {
  if (pathToApply.startsWith(ROOT_PATH_SEPARATOR)) {
    return pathToApply;
  } else if (pathToApply.startsWith('..')) {
    const originaPath: string[] = path.substring('/'.length).split(PATH_SEPARATOR);
    const splited: string[] = pathToApply.split(PATH_SEPARATOR);

    const result = originaPath;
    splited.forEach(fragment => {
      if (fragment === '..') {
        result.pop();
      } else {
        result.push(fragment);
      }
    });
    return ROOT_PATH_SEPARATOR + result.join(PATH_SEPARATOR);
  } else if (pathToApply.startsWith('.' + PATH_SEPARATOR)) {
    return path + PATH_SEPARATOR + pathToApply.substring('.'.length);
  } else if (!pathToApply) {
    console.log('no path to apply');
    return path;
  } else if (path === getRootPath()) {
    return path + pathToApply;
  } else {
    return path + PATH_SEPARATOR + pathToApply;
  }
};

export const buildValue = (val: string): ValueInState => {
  return {
    loading: false,
    value: val,
  };
};

export const getValueForPathInObject = (obj, path?) => {
  try {
    if (!path) {
      return obj;
    }
    const splited = path.split('.');
    return splited.reduce((acc, current) => acc[current], obj);
  } catch (ex) {
    return null;
  }
};

export const useCalculatedValueStateIfNotNull = (props, resourceId) => {
  const [result, setResult] = useState();
  const value = useCalculatedValueState(props, resourceId);
  useEffect(() => {
    const val = value && value.value ? value.value : null;
    if (val !== result) {
      console.log('useCalculatedValueStateIfNotNull', val, result);
      setResult(value && value.value ? value.value : null);
    }
  }, [value]);
  return result;
};

export const useFoundValueInLocalContext = (localContextPath: string, sourceParameterKey: string) => {
  return useAppSelector((state: RenderingSliceState) => {
    const contextForLocalContextPath = state.rendering.localContextsState ? state.rendering.localContextsState[localContextPath] : null;
    if (!contextForLocalContextPath || !contextForLocalContextPath.parameters) {
      return null;
    }
    return contextForLocalContextPath.parameters[sourceParameterKey];
  });
};

export const useFoundValue = (props, ruleDefinition: RuleDefinition): any => {
  const ruleType = ruleDefinition.ruleType;
  if (ruleType === 'refToLocalContext') {
    const refToContextRuleDefinition: RefToLocalContextRuleDefinition = ruleDefinition as RefToLocalContextRuleDefinition;
    return useFoundValueInLocalContext(props.localContextPath, refToContextRuleDefinition.sourceParameterKey);
  } else if (ruleType === 'refToPageContext') {
    throw new Error('to implement hereA ' + ruleType);
  } else if (ruleType === 'constant') {
    throw new Error('to implement hereB ' + ruleType);
  }
  throw new Error('to implement hereC ' + ruleType);
};

export const useCalculatedValueState = (props, ruleDefinition: RuleDefinition): ValueInState => {
  const ruleType = ruleDefinition.ruleType;
  if (ruleType === 'refToLocalContext') {
    const refToContextRuleDefinition: RefToLocalContextRuleDefinition = ruleDefinition as RefToLocalContextRuleDefinition;
    // console.log('refToContextRuleDefinition...', refToContextRuleDefinition.sourceParameterKey, props.localContextPath);
    // const contextState = useLocalContextPath(props.localContextPath, refToContextRuleDefinition.sourceParameterKey);
    // return
    return useRefToLocalContextValue(
      props.localContextPath,
      refToContextRuleDefinition.path,
      refToContextRuleDefinition.sourceParameterKey,
      refToContextRuleDefinition.sourceParameterProperty,
    );
  } else if (ruleType === 'refToPageContext') {
    return useRefToPageContextValue(props, ruleDefinition as RefToPageContextRuleDefinition);
  } else if (ruleType === 'itemParamProperty') {
    const def: ItemParamPropertyRuleDefinition = ruleDefinition as ItemParamPropertyRuleDefinition;
    const propDef = def.propertyDefinition;
    let str = '--';
    if (def.propertyDefinition.type === 'ID') {
      str = props.itemParam.id;
    } else if (def.propertyDefinition.type === 'NAME') {
      str = props.itemParam.name;
    } else if (def.propertyDefinition.type === 'PARENT_ID') {
      str = props.itemParam.parentId;
    } else if (def.propertyDefinition.type === 'ATTRIBUTE') {
      console.log('filterbbb.......changed', props.itemParam);
      if (!props.itemParam.attributeValues) {
        return { loading: false, value: '--' };
      }
      const keys = Object.keys(props.itemParam.attributeValues);
      // const values = props.itemParam.attributeValues;
      // console.log('filterbbb.......changed', values);
      const attDef: AttributePropertyDefinition = def.propertyDefinition;
      if (!keys) {
        str = '-';
      } else {
        const found = keys.find(val => val === generateLabel(attDef));
        str = found ? props.itemParam.attributeValues[found].value : '---';
      }
    }
    return { loading: false, value: str };
  } else if (ruleType === 'constant') {
    return useConstantValue(props, (ruleDefinition as ConstantRuleDefinition).constValue);
    // } else if (ruleType === 'datasetFilter') {
    //   return useConstantDatasetFilter(props, ruleDefinition as DatasetFilterRuleDefinition);
  } else if (ruleType === 'paginationState') {
    return useConstantValue(props, (ruleDefinition as PaginationStateRuleDefinition).initialValue);
  } else {
    return {
      loading: false,
      error: 'Not implemented : ' + ruleType,
    };
  }
};

export const initialFilter: ValueInState = { loading: true, value: null };

export const useChangingCalculatedValueState = (props, ruleDefinition: ParameterDefinition, target: ParameterTarget): ValueInState => {
  const dispatch = useAppDispatch();
  const [previousResult, setPreviousResult] = useState(initialFilter);
  const result = useCalculatedValueState(props, ruleDefinition.definition);
  const [changing, setChanging] = useState(initialFilter);
  console.log('filteraaa.......other', ruleDefinition, result, previousResult);
  useEffect(() => {
    console.log('filter.......5', previousResult, result, valHasChanged(previousResult, result));
    if (!valHasChanged(previousResult, result)) {
      return;
    }
    // pkeys.forEach(paramKey => {
    console.log('filterbbb.......changed', result);
    setPreviousResult(result);
    setChanging(result);

    // dispatch(
    //   setInCorrectState({
    //     destinationKey: ruleDefinition.target.parameterKey,
    //     localContextPath: props.localContextPath,
    //     target,
    //     childPath: props.path,
    //     value: result,
    //   }),
    // );
    console.log(
      'applyPath(props.localContextPath, props.path)',
      props.localContextPath,
      props.path,
      applyPath(props.localContextPath, props.path),
    );
    dispatch(
      setAnyInCorrectState({
        mainTarget: enrichToMainTarget(ruleDefinition.target, applyPath(props.localContextPath, props.path)),
        secondaryTarget: {
          secondaryTargetType: 'anyValueInTarget',
        },
        value: result,
      }),
    );
    // });
  }, [result]);

  return changing;
};

const valHasChanged = (previous, result): boolean => {
  if (!previous && result) {
    return true;
  } else if (!previous && !result) {
    return false;
  } else if (previous && !result) {
    return true;
  }
  return JSON.stringify(previous) !== JSON.stringify(result);
};
