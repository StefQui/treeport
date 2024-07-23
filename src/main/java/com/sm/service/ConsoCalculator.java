package com.sm.service;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.Pair;

public class ConsoCalculator<T> {

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
        Set<String> inmpacterIds,
        List<Attribute> atts,
        AttributeConfig config,
        AttributeValue<T> builderValue,
        Function<AttributeValue, T> attributeValueTFunction,
        T startValue,
        BinaryOperator<T> reducer
    ) {
        try {
            if (atts.stream().anyMatch(att -> att.getDirty())) {
                throw new IsDirtyValueException();
                //                return CalculationResult.builder().success(false).build();
            }

            AggInfo aggInfo = AggInfo.builder().build();
            Optional<Attribute> consolidatedOpt = atts.stream().filter(att -> !att.getIsAgg()).findAny();
            Boolean consolidatedValueIsMissing = false;
            Boolean consolidatedValueIsNotResolvable = false;
            Attribute consolidatedAttribute = null;
            AtomicBoolean atLeastOnChildValueIsNotResolvable = new AtomicBoolean(false);
            if (consolidatedOpt.isPresent()) {
                consolidatedAttribute = consolidatedOpt.get();
                if (consolidatedAttribute.getAttributeValue() == null) {
                    aggInfo.getNotResolvables().add(consolidatedAttribute.getId());
                    consolidatedValueIsMissing = true;
                } else if (consolidatedAttribute.getAttributeValue().isError()) {
                    aggInfo.getErrors().add(consolidatedAttribute.getId());
                } else if (consolidatedAttribute.getAttributeValue().isNotResolvable()) {
                    aggInfo.getNotResolvables().add(consolidatedAttribute.getId());
                    consolidatedValueIsNotResolvable = true;
                } else {
                    aggInfo.setWithValues(aggInfo.getWithValues() + 1);
                }
            }
            List<AttributeValue> attVals = atts
                .stream()
                .filter(att -> att.getIsAgg())
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
                        .resultValue(UtilsValue.generateNotResolvableValue("value to consolidate is null or not resolvable"))
                        .impacterIds(inmpacterIds)
                        .aggInfo(aggInfo)
                        .build();
                }
            }

            if (consolidatedAttribute != null && consolidatedAttribute.getAttributeValue() != null) {
                attVals.add(consolidatedAttribute.getAttributeValue());
            }

            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(attVals);
            if (errorOrNotResolvable != null) {
                return CalculationResult
                    .builder()
                    .success(true)
                    .resultValue(UtilsValue.handleErrorsAndNotResolvable(attVals))
                    .impacterIds(inmpacterIds)
                    .aggInfo(aggInfo)
                    .build();
            }

            return CalculationResult
                .builder()
                .success(true)
                .resultValue(calculate(builderValue, attVals, attributeValueTFunction, startValue, reducer))
                .impacterIds(inmpacterIds)
                .aggInfo(aggInfo)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("should not arrive here " + attId);
        }
    }
}
