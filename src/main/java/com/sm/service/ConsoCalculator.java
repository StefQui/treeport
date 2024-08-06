package com.sm.service;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;

@Slf4j
public class ConsoCalculator<T> {

    public static final String VALUE_TO_CONSOLIDATE_IS_NULL_OR_NOT_RESOLVABLE = "value to consolidate is null or not resolvable";

    public AttributeValue calculate(
        AttributeValue<T> value,
        List<AttributeValue> attVals,
        Function<AttributeValue, T> mapToClass,
        Object initial,
        BiFunction<T, T, T> function
    ) {
        if (initial == null) {
            return UtilsValue.generateErrorValue("Initial value for conso should not be null");
        }
        try {
            T initialValueDouble = (T) initial;

            List<T> vals = attVals.stream().map(mapToClass).collect(Collectors.toList());
            value.setValue(vals.stream().reduce(initialValueDouble, (a, b) -> function.apply(a, b)));
            return value;
            //            return DoubleValue.builder()
            //                    .value(vals.stream()
            //                            .reduce(initialValueDouble, sum)
            //                    )
            //                    .build()
        } catch (Exception e) {
            return UtilsValue.generateErrorValue("Cannot calculate" + e.getLocalizedMessage());
        }
    }

    public AttributeValue<T> calculateMultiVals(
        String attId,
        List<AttributeValue> vals,
        AttributeConfig config,
        AttributeValue<T> builderValue,
        Function<AttributeValue, T> attributeValueTFunction,
        T startValue,
        BinaryOperator<T> reducer
    ) {
        try {
            //            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(vals);
            //            if (errorOrNotResolvable != null) {
            //                return errorOrNotResolvable;
            //            }

            return calculate(builderValue, vals, attributeValueTFunction, startValue, reducer);
        } catch (Exception e) {
            throw new RuntimeException("should not arrive here");
            //            attribute.setAttributeValue(UtilsValue.generateOtherErrorValue("cannot do sum of doubles", e));
        }
    }

    public Pair<AttributeValue, AggInfo> calculateMultiValuesAttribute(
        String attId,
        List<Attribute> attributes,
        AttributeConfig config,
        AttributeValue<T> builderValue,
        Function<AttributeValue, T> attributeValueTFunction,
        T startValue,
        BinaryOperator<T> reducer
    ) {
        List<AttributeValue> attVals = attributes
            .stream()
            .map(Attribute::getAttributeValue)
            .map(attValue -> {
                if (attValue == null) {
                    return ErrorValue.builder().value("one item value is missing").build();
                    //                            atLeastOnChildValueIsNotResolvable.set(true);
                }
                return attValue;
            })
            .collect(Collectors.toList());

        return Pair.of(calculateMultiVals(attId, attVals, config, builderValue, attributeValueTFunction, startValue, reducer), null);
    }

    public CalculationResult calculateConsolidatedAttribute(
        String attId,
        Set<String> impacterIds,
        List<Attribute> atts,
        AttributeValue consolidatedAttributeValue,
        AttributeConfig config,
        AttributeValue<T> builderValue,
        Function<AttributeValue, T> attributeValueTFunction,
        T startValue,
        BinaryOperator<T> reducer
    ) {
        //        AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(atts.stream().map(Attribute::getAttributeValue).collect(Collectors.toList()));
        //        if (errorOrNotResolvable != null) {
        //            return UtilsValue.buildResult(impacterIds, errorOrNotResolvable);
        //        }

        try {
            AggInfo aggInfo = AggInfo.builder().build();
            Boolean consolidatedValueIsMissing = false;
            Boolean consolidatedValueIsInError = false;
            AttributeValue consolidatedAttributeValueToApply = consolidatedAttributeValue;
            AtomicBoolean atLeastOnChildValueIsNotResolvable = new AtomicBoolean(false);
            if (consolidatedAttributeValue == null) {
                aggInfo.getErrors().add(attId);
                consolidatedValueIsMissing = true;
            } else if (consolidatedAttributeValue.isError()) {
                aggInfo.getErrors().add(attId);
                consolidatedValueIsInError = true;
            } else if (consolidatedAttributeValue.getValue() == null) {
                aggInfo.getErrors().add(attId);
                consolidatedValueIsInError = true;
            } else {
                aggInfo.setWithValues(aggInfo.getWithValues() + 1);
            }
            List<AttributeValue> attVals = atts
                .stream()
                .peek(att -> {
                    impacterIds.add(att.getId());
                })
                .peek(att -> {
                    aggInfo.getErrors().addAll(att.getAggInfo().getErrors());
                    aggInfo.setWithValues(aggInfo.getWithValues() + att.getAggInfo().getWithValues());
                })
                .map(Attribute::getAttributeValue)
                .map(attValue -> {
                    if (attValue == null) {
                        return UtilsValue.buildOneItemIsNullWhenConsolidating();
                    }
                    return attValue;
                })
                .map(attValue -> {
                    if (!(attValue instanceof ErrorValue) || config.getConsoDefaultValueForNotResolvableItem() == null) {
                        return attValue;
                    }
                    return buildDefaultValue(config.getConsoDefaultValueForNotResolvableItem());
                })
                .collect(Collectors.toList());

            ErrorValue error = UtilsValue.handleErrors(attVals);
            if (error != null) {
                return UtilsValue.buildValueToConsolidateIsNotResolvableResult(impacterIds, aggInfo, error);
            }

            //            attribute.setAggInfo(aggInfo);
            //            if (consolidatedAttributeIsMissing) {
            //                attribute.setAttributeValue(UtilsValue
            //                        .generateErrorValue("attribute to consolidate is null, check your config"));
            //                return;
            //            }
            if (consolidatedValueIsMissing || consolidatedValueIsInError) {
                //                attribute.getAggInfo().getNotResolvables().add(consolidatedAttribute.getId());
                if (config.getConsoDefaultValueForNotResolvableItem() != null) {
                    attVals.add(buildDefaultValue(config.getConsoDefaultValueForNotResolvableItem()));
                } else {
                    return UtilsValue.buildValueToConsolidateIsNullOrInError(impacterIds, aggInfo);
                }
            } else {
                attVals.add(consolidatedAttributeValueToApply);
            }

            //            if (consolidatedAttribute != null && consolidatedAttribute.getAttributeValue() != null) {
            //            attVals.add(consolidatedAttributeValueToApply);
            //          }

            //            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(attVals);
            //            if (errorOrNotResolvable != null) {
            //                return CalculationResult
            //                    .builder()
            //                    .success(true)
            //                    .resultValue(UtilsValue.handleErrorsAndNotResolvable(attVals))
            //                    .impacterIds(impacterIds)
            //                    .aggInfo(aggInfo)
            //                    .build();
            //            }

            return CalculationResult
                .builder()
                .success(true)
                .resultValue(calculate(builderValue, attVals, attributeValueTFunction, startValue, reducer))
                .impacterIds(impacterIds)
                .aggInfo(aggInfo)
                .build();
        } catch (Exception e) {
            log.error("errur 2344 " + e.getMessage());
            throw new RuntimeException("should not arrive here " + attId);
        }
    }

    private AttributeValue buildDefaultValue(Object defaultValueForNotResolvableItem) {
        if (defaultValueForNotResolvableItem instanceof Double) {
            return DoubleValue.builder().value((Double) defaultValueForNotResolvableItem).build();
        } else if (defaultValueForNotResolvableItem instanceof Map) {
            CostValue a = CostValue.builder().value((Map<String, CostLine>) defaultValueForNotResolvableItem).build();
            return a;
        }
        return UtilsValue.generateErrorValue("Cannot generate default value for " + defaultValueForNotResolvableItem);
    }
    //    private AttributeValue applyDefaultValue(AttributeConfig config, AttributeValue attValue) {
    //        if (!(attValue instanceof NotResolvableValue) || config.getDefaultValueForNotResolvableItem() == null) {
    //            return attValue;
    //        }
    //        T defaultValue = (T) config.getDefaultValueForNotResolvableItem();
    //        if (defaultValue instanceof Double) {
    //            return DoubleValue.builder().value((Double) defaultValue).build();
    //        } else if (defaultValue instanceof Map) {
    //            CostValue a = CostValue.builder().value((Map<String, CostLine>) defaultValue).build();
    //            return a;
    //        }
    //        throw new RuntimeException("should be implemented for type " + defaultValue.getClass());
    //    }
}
