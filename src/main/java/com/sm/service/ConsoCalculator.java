package com.sm.service;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import java.util.List;
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
            return NotResolvableValue.builder().value("Initial value for conso should not be null").build();
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
            return NotResolvableValue.builder().value("Cannot calculate").build();
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
            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(vals);
            if (errorOrNotResolvable != null) {
                return errorOrNotResolvable;
            }

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
                    return NotResolvableValue.builder().value("one item value is missing").build();
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
        try {
            AggInfo aggInfo = AggInfo.builder().build();
            Boolean consolidatedValueIsMissing = false;
            Boolean consolidatedValueIsNotResolvable = false;
            AttributeValue consolidatedAttributeValueToApply = consolidatedAttributeValue;
            AtomicBoolean atLeastOnChildValueIsNotResolvable = new AtomicBoolean(false);
            if (consolidatedAttributeValue == null) {
                aggInfo.getNotResolvables().add(attId);
                consolidatedValueIsMissing = true;
            } else if (consolidatedAttributeValue.isError()) {
                aggInfo.getErrors().add(attId);
            } else if (consolidatedAttributeValue.isNotResolvable()) {
                aggInfo.getNotResolvables().add(attId);
                consolidatedAttributeValueToApply = applyDefaultValue(config, consolidatedAttributeValue);
                consolidatedValueIsNotResolvable = true;
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
                    aggInfo.getNotResolvables().addAll(att.getAggInfo().getNotResolvables());
                    aggInfo.setWithValues(aggInfo.getWithValues() + att.getAggInfo().getWithValues());
                    if (att.getAttributeValue() == null) {
                        aggInfo.getNotResolvables().add(att.getId());
                        //                            atLeastOnChildValueIsNotResolvable.set(true);
                    }
                })
                .map(Attribute::getAttributeValue)
                .map(attValue -> {
                    if (attValue == null) {
                        return NotResolvableValue
                            .builder()
                            .value("one item value is missing, check your tags on consoConfig and consolidateConfig")
                            .build();
                        //                            atLeastOnChildValueIsNotResolvable.set(true);
                    }
                    return attValue;
                })
                .map(attValue -> applyDefaultValue(config, attValue))
                .collect(Collectors.toList());

            //            attribute.setAggInfo(aggInfo);
            //            if (consolidatedAttributeIsMissing) {
            //                attribute.setAttributeValue(UtilsValue
            //                        .generateErrorValue("attribute to consolidate is null, check your config"));
            //                return;
            //            }
            if (consolidatedValueIsMissing || consolidatedValueIsNotResolvable) {
                //                attribute.getAggInfo().getNotResolvables().add(consolidatedAttribute.getId());
                if (config.getDefaultValueForNotResolvableItem() != null) {
                    attVals.add(
                        DoubleValue.builder().value(Double.valueOf(config.getDefaultValueForNotResolvableItem().toString())).build()
                    );
                } else {
                    return CalculationResult
                        .builder()
                        .success(true)
                        .resultValue(UtilsValue.generateNotResolvableValue(VALUE_TO_CONSOLIDATE_IS_NULL_OR_NOT_RESOLVABLE))
                        .impacterIds(impacterIds)
                        .aggInfo(aggInfo)
                        .build();
                }
            }

            //            if (consolidatedAttribute != null && consolidatedAttribute.getAttributeValue() != null) {
            attVals.add(consolidatedAttributeValueToApply);
            //          }

            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(attVals);
            if (errorOrNotResolvable != null) {
                return CalculationResult
                    .builder()
                    .success(true)
                    .resultValue(UtilsValue.handleErrorsAndNotResolvable(attVals))
                    .impacterIds(impacterIds)
                    .aggInfo(aggInfo)
                    .build();
            }

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

    private AttributeValue applyDefaultValue(AttributeConfig config, AttributeValue attValue) {
        if (!(attValue instanceof NotResolvableValue) || config.getDefaultValueForNotResolvableItem() == null) {
            return attValue;
        }
        T defaultValue = (T) config.getDefaultValueForNotResolvableItem();
        if (!(defaultValue instanceof Double)) {
            throw new RuntimeException("should be implemented for type " + defaultValue.getClass());
        }
        return DoubleValue.builder().value((Double) defaultValue).build();
    }
}
