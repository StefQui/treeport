package com.sm.service.dto.attribute;

public enum AttributeValueType {
    BOOLEAN_VT,
    DOUBLE_VT,
    NOT_RESOLVABLE_VT;

    public static AttributeValueType fromString(String type) {
        return switch (type) {
            case "BOOLEAN_VT" -> BOOLEAN_VT;
            case "DOUBLE_VT" -> DOUBLE_VT;
            case "NOT_RESOLVABLE_VT" -> NOT_RESOLVABLE_VT;
            default -> throw new RuntimeException("pb ici for type " + type);
        };
    }
}
