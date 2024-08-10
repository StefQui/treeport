package com.sm.service;

import static java.lang.String.format;

import com.sm.domain.attribute.*;
import com.sm.service.exception.ComputationErrorException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class UtilsValue {

    public static final String ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR =
        "error:cannot do multi-op of doubles, at least one item is in error : [%s]";
    public static final String CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE =
        "cannot do multi-op of doubles, at least one item is not resolvable";

    public static Double mapToDouble(AttributeValue av) {
        if (av == null) {
            return null;
        }
        if (av instanceof BooleanValue) {
            BooleanValue v = (BooleanValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("cannot mapToDouble Boolean " + v);
            }
            if (v.getValue()) {
                return 1.;
            }
            return 0.;
        } else if (av instanceof DoubleValue) {
            DoubleValue v = (DoubleValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("cannot mapToDouble Double " + v);
            }
            return v.getValue();
        } else if (av instanceof LongValue) {
            LongValue v = (LongValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("cannot mapToDouble Long " + v);
            }
            return Double.valueOf(v.getValue());
        }
        throw new RuntimeException("this should be implemented here : " + av);
    }

    public static Long mapToLong(AttributeValue av) {
        if (av == null) {
            return null;
        }
        if (av instanceof BooleanValue) {
            BooleanValue v = (BooleanValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici2?");
            }
            if (v.getValue()) {
                return 1l;
            }
            return 0l;
        } else if (av instanceof DoubleValue) {
            DoubleValue v = (DoubleValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici3?");
            }
            return Long.parseLong(v.getValue().toString());
        } else if (av instanceof LongValue) {
            LongValue v = (LongValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici4?");
            }
            return v.getValue();
        }
        throw new RuntimeException("this should be implemented here : " + av);
    }

    public static Map<String, CostLine> mapToCost(AttributeValue av) {
        if (av == null) {
            return null;
        }
        if (av instanceof CostValue) {
            CostValue v = (CostValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici3?");
            }
            return v.getValue();
        }
        throw new RuntimeException("this should be implemented here : " + av);
    }

    public static ErrorValue handleErrors(List<AttributeValue> attValues) {
        List<ErrorValue> errors = attValues
            .stream()
            .filter(ErrorValue.class::isInstance)
            .map(ErrorValue.class::cast)
            .collect(Collectors.toList());
        if (!errors.isEmpty()) {
            return UtilsValue.generateErrorValues(errors);
        }
        return null;
    }

    //    private static AttributeValue generateNotResolvableValues(List<NotResolvableValue> notResolvables) {
    //        String notResolvablesAsString = notResolvables.stream().map(NotResolvableValue::getValue).collect(Collectors.joining(","));
    //        return generateNotResolvableValue(notResolvablesAsString);
    //    }

    public static ErrorValue generateErrorValues(List<ErrorValue> errors) {
        String errorsAsString = errors.stream().map(ErrorValue::getValue).collect(Collectors.joining(","));
        return generateErrorValue(errorsAsString);
    }

    public static AttributeValue generateErrorValue(String context, ComputationErrorException e) {
        return generateErrorValue(context + " -- " + e.getMessage());
    }

    public static ErrorValue generateErrorValue(String context) {
        return ErrorValue.builder().value(context).build();
    }

    //    public static AttributeValue generateNotResolvableValue(String context, ComputationNotResolvableException e) {
    //        return generateNotResolvableValue(context + " -- " + e.getMessage());
    //    }
    //
    //    public static AttributeValue generateNotResolvableValue(String context) {
    //        return NotResolvableValue.builder().value(context).build();
    //    }
    //
    //    public static AttributeValue generateOtherErrorValue(String context, Exception e) {
    //        return ErrorValue.builder().value(context + " -- Other -- " + e.getMessage()).build();
    //    }
    //
    //    public static AttributeValue throwNotResolvableIfAnyDoubleIsNull(List<Double> val) {
    //        if (val.stream().anyMatch(item -> item == null)) {
    //            return UtilsValue.generateNotResolvableValue("one double value is null");
    //        }
    //        return null;
    //    }

    //    public static void handleNotResolvableOrDefaultValueForDouble(
    //        String message,
    //        Attribute attribute,
    //        AttributeConfig config,
    //        ComputationNotResolvableException e
    //    ) {
    //        if (config.getDefaultValue() != null) {
    //            if (!(config.getDefaultValue() instanceof Double)) {
    //                attribute.setAttributeValue(
    //                    UtilsValue.generateNotResolvableValue(message + " | default value should be a Double for config " + config.getId())
    //                );
    //            }
    //            attribute.setAttributeValue(DoubleValue.builder().value(Double.valueOf(config.getDefaultValue().toString())).build());
    //            return;
    //        }
    //        attribute.setAttributeValue(UtilsValue.generateNotResolvableValue(message, e));
    //    }

    //    public static AttributeValue defaultValueForDoubleNotResolvableItem(AttributeValue attVal, AttributeConfig config) {
    //        if (attVal instanceof NotResolvableValue) {
    //            if (config.getConsoDefaultValueForNotResolvableItem() != null) {
    //                if (config.getConsoDefaultValueForNotResolvableItem() instanceof Double) {
    //                    final Double defaultValueForNotResolvableItem = (Double) config.getConsoDefaultValueForNotResolvableItem();
    //                    return DoubleValue.builder().value(defaultValueForNotResolvableItem).build();
    //                }
    //                return generateNotResolvableValue("cannot apply getDefaultValueForNotResolvableItem because it is not a double");
    //            }
    //        }
    //        return attVal;
    //    }

    public static CalculationResult buildResult(Set<String> impacterIds, AttributeValue av) {
        return CalculationResult.builder().resultValue(av).impacterIds(impacterIds).success(true).build();
    }

    public static AttributeValue buildReferencedAttributeHasNoValue(String attId) {
        return ErrorValue.builder().isRefToNull(true).value(format("Referenced attribute has no value: %s", attId)).build();
    }

    public static AttributeValue buildReferencedAttributeCannotBeFound(String attKey) {
        return ErrorValue.builder().isRefToNull(true).value(format("Referenced attribute cannot be found for key: %s", attKey)).build();
    }

    public static CalculationResult buildCannotCalculateSumResult(Set<String> impacterIds, ErrorValue error) {
        return CalculationResult
            .builder()
            .impacterIds(impacterIds)
            .resultValue(ErrorValue.builder().value(format("Cannot calculate sum : [%s]", error.getValue())).build())
            .build();
    }

    public static CalculationResult buildValueToConsolidateIsNotResolvableResult(
        Set<String> impacterIds,
        AggInfo aggInfo,
        ErrorValue error
    ) {
        return CalculationResult
            .builder()
            .impacterIds(impacterIds)
            .aggInfo(aggInfo)
            .resultValue(ErrorValue.builder().value(format("Value to consolidate is not resolvable : [%s]", error.getValue())).build())
            .build();
    }

    public static CalculationResult buildCannotResolveThenStatementResult(Set<String> impacterIds, AttributeValue av) {
        return buildResultWithMessage(impacterIds, format("Cannot resolve THEN statement : [%s]", av.getValue()));
    }

    public static CalculationResult buildCannotResolveIfBecauseIsNullResult(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve THEN statement");
    }

    public static CalculationResult buildCannotResolveIfStatementAsBoolean(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve IF statement as boolean");
    }

    public static CalculationResult buildCannotResolveThenStatementBecauseIsNull(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve THEN statement because is null");
    }

    public static CalculationResult buildCannotResolveElseStatementResult(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve ELSE statement because is null");
    }

    private static CalculationResult buildResultWithMessage(Set<String> impacterIds, String s) {
        return CalculationResult.builder().impacterIds(impacterIds).resultValue(ErrorValue.builder().value(s).build()).build();
    }

    private static CalculationResult buildResultWithMessage(Set<String> impacterIds, AggInfo aggInfo, String s) {
        return CalculationResult
            .builder()
            .impacterIds(impacterIds)
            .aggInfo(aggInfo)
            .resultValue(ErrorValue.builder().value(s).build())
            .build();
    }

    public static CalculationResult buildCannotResolveFirstOperandOfComparison(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve first operand of comparison");
    }

    public static CalculationResult buildCannotResolveSecondOperandOfComparison(Set<String> impacterIds) {
        return buildResultWithMessage(impacterIds, "Cannot resolve second operand of comparison");
    }

    public static CalculationResult buildValueToConsolidateIsNullOrInError(Set<String> impacterIds, AggInfo aggInfo) {
        return buildResultWithMessage(impacterIds, aggInfo, "Value to consolidate is null or in error");
    }

    public static AttributeValue buildOneItemIsNullWhenConsolidating() {
        return ErrorValue.builder().value("one item value is null when consolidating").build();
    }
}
