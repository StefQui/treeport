import { useState, useEffect } from 'react';

import { isError, isLoading } from './render-resource-page';
import { useCalculatedValueState } from './shared';
import {
  ResourceFilter,
  ParameterTarget,
  ValueInState,
  AndFilter,
  OrFilter,
  PropertyFilter,
  TextContainsFilterRule,
  ResourceFilterValue,
} from './type';

export const useChangingCalculatedFilterState = (props, filter: ResourceFilter, target: ParameterTarget): ValueInState => {
  // console.log('filterbbb.......changed', result);

  const initialResult = { loading: false };
  const filterValues = useChangedFilterValues(filter, props);
  // console.log('calculateFilter', calculateFilter(dsfDef.valueFilter, {}));
  const [result, setResult] = useState({ loading: true });
  useEffect(() => {
    setResult(calculateFilter(filter, filterValues));
  }, [filterValues]);
  return result;
};

const useChangedFilterValues = (filter: ResourceFilter, props): Object => {
  const [result, setResult] = useState({});
  console.log('azzzzz1', result);
  // const val = useCalculatedValueState(props, { ruleType: 'refToLocalContext', path: '', sourceParameterKey: 'theTerm' });

  useChangedFilterValuesForItem(0, filter, result, setResult, props);
  return result;
};

const useChangedFilterValuesForItem = (index: number, filter: ResourceFilter, result, setResult, props): number => {
  console.log('azzzzz');
  if (filter.filterType === 'AND') {
    console.log('azzzzz AND');
    const and: AndFilter = filter;
    let newIndex = index;
    and.items.forEach(item => {
      const index2 = useChangedFilterValuesForItem(newIndex, item, result, setResult, props);
      newIndex = newIndex + index2;
    });
    return newIndex;
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    let newIndex = index;
    or.items.forEach(item => {
      const index2 = useChangedFilterValuesForItem(newIndex, item, result, setResult, props);
      newIndex = newIndex + index2;
    });
    return newIndex;
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    console.log('azzzzz PROPERTY_FILTER');
    const propFilter: PropertyFilter = filter;
    if (propFilter.filterRule.filterRuleType === 'TEXT_CONTAINS') {
      const textContains: TextContainsFilterRule = propFilter.filterRule;
      console.log('azzzzz TEXT_CONTAINS', textContains.terms, props.localContextPath);
      const val = useCalculatedValueState(props, textContains.terms);
      useEffect(() => {
        if (val && !isLoading(val) && !isError(val)) {
          setResult({ ...result, ...{ [PROP + index]: val.value } });
        }
      }, [val]);
    }
    return 1;
  }
};

const calculateFilter = (filter: ResourceFilter, filterValues: Object): ValueInState => {
  const filterCount = calculateFilterCount(0, filter);
  console.log('calculateInitialFilter.......', filter, filterCount, filterValues);
  const values = Object.values(filterValues);
  if (values.length !== filterCount || values.findIndex(val => val && !!val.loading) !== -1) {
    return { loading: true };
  }
  console.log('calculateInitialFilter.......continue');
  return { loading: false, value: calculateFilterItem(0, filter, filterValues).value };
};

const PROP = 'prop';

const calculateFilterItem = (
  pointer: number,
  filter: ResourceFilter,
  filterValues: Object,
): { pointer: number; value: ResourceFilterValue } => {
  if (filter.filterType === 'AND') {
    const and: AndFilter = filter;
    const values = [];
    let pointerIndex = pointer;
    and.items.forEach(item => {
      const res = calculateFilterItem(pointerIndex, item, filterValues);
      pointerIndex = pointerIndex + res.pointer;
      values.push(res.value);
    });
    return {
      pointer: pointerIndex,
      value: { filterType: 'AND', items: values },
    };
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    const values = [];
    let pointerIndex = pointer;
    or.items.forEach(item => {
      const res = calculateFilterItem(pointerIndex, item, filterValues);
      pointerIndex = pointerIndex + res.pointer;
      values.push(res.value);
    });
    return {
      pointer: pointerIndex,
      value: { filterType: 'AND', items: values },
    };
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    const propFilter: PropertyFilter = filter;
    if (propFilter.filterRule.filterRuleType === 'TEXT_CONTAINS') {
      const textContains: TextContainsFilterRule = propFilter.filterRule;
      // return {
      //   pointer: pointer + 1,
      //   value: { ...textContains, ...{ filterRuleValue: filterValues[PROP + pointer] } },
      // };
      return {
        pointer: pointer + 1,
        value: {
          ...propFilter,
          filterRule: { ...textContains, ...{ terms: filterValues[PROP + pointer] ?? '' } },
        },
      };
    }
  }
  throw new Error('to be implemented here2.....' + filter);
};

const calculateFilterCount = (count: number, filter: ResourceFilter): number => {
  if (filter.filterType === 'AND') {
    const and: AndFilter = filter;
    return and.items.reduce((acc, current) => acc + calculateFilterCount(0, current), 0);
  } else if (filter.filterType === 'OR') {
    const or: OrFilter = filter;
    return or.items.reduce((acc, current) => acc + calculateFilterCount(0, current), 0);
  } else if (filter.filterType === 'PROPERTY_FILTER') {
    const propFlter: PropertyFilter = filter;
    return 1;
  }
  throw new Error('to be implemented here.....' + filter);
};
