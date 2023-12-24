package com.sm.service;

import com.sm.poctreeport.model.attribute.*;
import com.sm.poctreeport.model.attributeConfig.AttributeConfig;
import java.util.List;
import java.util.Optional;
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
            //            List<Attribute> atts = operands.stream()
            //                    .map(impacterId -> attributeService.getById(impacterId))
            //                    .filter(Optional::isPresent)
            //                    .map(Optional::get).collect(Collectors.toList());
            //            List<AttributeValue> attVals = attributes.stream()
            //                    .map(Attribute::getAttributeValue)
            //                    .map(attValue -> {
            //                        if (attValue == null) {
            //                            return NotResolvableValue.builder().value("one item value is missing").build();
            //                            //                            atLeastOnChildValueIsNotResolvable.set(true);
            //                        }
            //                        return attValue;
            //                    })
            //                    .collect(Collectors.toList());

            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(vals);
            if (errorOrNotResolvable != null) {
                return errorOrNotResolvable;
            }

            return calculate(builderValue, vals, attributeValueTFunction, startValue, reducer);
            //            if (AttributeType.DOUBLE.equals(config.getType())) {
            //                return calculate((AttributeValue<T>) DoubleValue.builder().build(),
            //                        vals, av -> mapToT(av), startValue, reducer);
            //            } else if (AttributeType.LONG.equals(config.getType())) {
            //                ConsoCalculator<Long> consoCalculator = new ConsoCalculator();
            //                return consoCalculator.calculate(LongValue.builder().build(),
            //                        vals, UtilsValue::mapToLong, startValue, reducer);
            //                Double initialValueDouble = Double.valueOf(identity.toString());
            //                List<Double> doubleVals = attVals.stream().map(UtilsValue::mapToDouble).collect(Collectors.toList());
            //                attribute.setAttributeValue(DoubleValue.builder()
            //                        .value(doubleVals.stream()
            //                                .reduce(initialValueDouble, sum)
            //                        )
            //                        .build());
            //            } else {
            //                throw new RuntimeException("Should be implemented here " + config.getType());
            //            }
            //            AttributeValue ifAnyDoubleNull = UtilsValue.throwNotResolvableIfAnyDoubleIsNull(doubleVals);
            //            if (ifAnyDoubleNull != null) {
            //                attribute.setAttributeValue(ifAnyDoubleNull);
            //                return;
            //            }
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

    public Pair<AttributeValue, AggInfo> calculateConsolidatedAttribute(
        String attId,
        List<Attribute> atts,
        AttributeConfig config,
        AttributeValue<T> builderValue,
        Function<AttributeValue, T> attributeValueTFunction,
        T startValue,
        BinaryOperator<T> reducer
    ) {
        try {
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
                    return Pair.of(UtilsValue.generateNotResolvableValue("value to consolidate is null or not resolvable"), aggInfo);
                }
            }

            if (consolidatedAttribute != null && consolidatedAttribute.getAttributeValue() != null) {
                attVals.add(consolidatedAttribute.getAttributeValue());
            }

            //            if (atLeastOnChildValueIsNotResolvable.get()) {
            //                attribute.setAttributeValue(UtilsValue
            //                        .generateNotResolvableValue("at least one child value is not resolvable"));
            //                return;
            //            }
            AttributeValue errorOrNotResolvable = UtilsValue.handleErrorsAndNotResolvable(attVals);
            if (errorOrNotResolvable != null) {
                return Pair.of(errorOrNotResolvable, aggInfo);
            }

            return Pair.of(calculate(builderValue, attVals, attributeValueTFunction, startValue, reducer), aggInfo);
            //            if (AttributeType.DOUBLE.equals(config.getType())) {
            ////                ConsoCalculator<Double> consoCalculator = new ConsoCalculator<Double>();
            //                return Pair.of(calculate(builderValue,
            //                                attVals, attributeValueTFunction, startValue, reducer),
            //                        aggInfo);
            ////                Double initialValueDouble = Double.valueOf(identity.toString());
            ////                List<Double> doubleVals = attVals.stream().map(UtilsValue::mapToDouble).collect(Collectors.toList());
            ////                attribute.setAttributeValue(DoubleValue.builder()
            ////                        .value(doubleVals.stream()
            ////                                .reduce(initialValueDouble, sum)
            ////                        )
            ////                        .build());
            //            } else {
            //                throw new RuntimeException("Should be implemented here " + config.getType());
            //            }
            //            AttributeValue ifAnyDoubleNull = UtilsValue.throwNotResolvableIfAnyDoubleIsNull(doubleVals);
            //            if (ifAnyDoubleNull != null) {
            //                attribute.setAttributeValue(ifAnyDoubleNull);
            //                return;
            //            }
        } catch (Exception e) {
            throw new RuntimeException("should not arrive here " + attId);
            //            attribute.setAttributeValue(UtilsValue.generateOtherErrorValue("cannot do sum of doubles", e));
        }
    }
}
