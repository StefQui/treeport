package com.sm.service;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import com.sm.service.exception.ComputationErrorException;
import com.sm.service.exception.ComputationNotResolvableException;
import java.util.List;
import java.util.Optional;

public class UtilsValue {

    public static final String ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR =
        "error:cannot do multi-op of doubles, at least one item is in error";
    public static final String CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE =
        "cannot do multi-op of doubles, at least one item is not resolvable";

    public static Double mapToDouble(AttributeValue av) {
        if (av == null) {
            return null;
        }
        if (av instanceof BooleanValue) {
            BooleanValue v = (BooleanValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici2?");
            }
            if (v.getValue()) {
                return 1.;
            }
            return 0.;
        } else if (av instanceof DoubleValue) {
            DoubleValue v = (DoubleValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici3?");
            }
            return v.getValue();
        } else if (av instanceof LongValue) {
            LongValue v = (LongValue) av;
            if (v.getValue() == null) {
                throw new RuntimeException("valeur null ici4?");
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

    public static AttributeValue handleErrorsAndNotResolvable(List<AttributeValue> attValues) {
        Optional<AttributeValue> error = attValues.stream().filter(ErrorValue.class::isInstance).findAny();
        if (error.isPresent()) {
            return UtilsValue.generateErrorValue(ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR);
        }
        Optional<AttributeValue> notResolvable = attValues.stream().filter(NotResolvableValue.class::isInstance).findAny();
        if (notResolvable.isPresent()) {
            return UtilsValue.generateNotResolvableValue(CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE);
        }
        return null;
    }

    public static AttributeValue generateErrorValue(String context, ComputationErrorException e) {
        return generateErrorValue(context + " -- " + e.getMessage());
    }

    public static AttributeValue generateErrorValue(String context) {
        return ErrorValue.builder().value(context).build();
    }

    public static AttributeValue generateNotResolvableValue(String context, ComputationNotResolvableException e) {
        return generateNotResolvableValue(context + " -- " + e.getMessage());
    }

    public static AttributeValue generateNotResolvableValue(String context) {
        return NotResolvableValue.builder().value(context).build();
    }

    public static AttributeValue generateOtherErrorValue(String context, Exception e) {
        return ErrorValue.builder().value(context + " -- Other -- " + e.getMessage()).build();
    }

    public static AttributeValue throwNotResolvableIfAnyDoubleIsNull(List<Double> val) {
        if (val.stream().anyMatch(item -> item == null)) {
            return UtilsValue.generateNotResolvableValue("one double value is null");
        }
        return null;
    }

    public static void handleNotResolvableOrDefaultValueForDouble(
        String message,
        Attribute attribute,
        AttributeConfig config,
        ComputationNotResolvableException e
    ) {
        if (config.getDefaultValue() != null) {
            if (!(config.getDefaultValue() instanceof Double)) {
                attribute.setAttributeValue(
                    UtilsValue.generateNotResolvableValue(message + " | default value should be a Double for config " + config.getId())
                );
            }
            attribute.setAttributeValue(DoubleValue.builder().value(Double.valueOf(config.getDefaultValue().toString())).build());
            return;
        }
        attribute.setAttributeValue(UtilsValue.generateNotResolvableValue(message, e));
    }

    public static AttributeValue defaultValueForDoubleNotResolvableItem(AttributeValue attVal, AttributeConfig config) {
        if (attVal instanceof NotResolvableValue) {
            if (config.getDefaultValueForNotResolvableItem() != null) {
                if (config.getDefaultValueForNotResolvableItem() instanceof Double) {
                    final Double defaultValueForNotResolvableItem = (Double) config.getDefaultValueForNotResolvableItem();
                    return DoubleValue.builder().value(defaultValueForNotResolvableItem).build();
                }
                return generateNotResolvableValue("cannot apply getDefaultValueForNotResolvableItem because it is not a double");
            }
        }
        return attVal;
    }
}
