package com.sm.service.dto.attribute;

public enum AttributeValueType {
    BOOLEAN_VT,
    DOUBLE_VT,
    ERROR_VT;

    public static AttributeValueType fromString(String type) {
        return switch (type) {
            case "BOOLEAN_VT" -> BOOLEAN_VT;
            case "DOUBLE_VT" -> DOUBLE_VT;
            case "ERROR_VT" -> ERROR_VT;
            default -> throw new RuntimeException("pb ici for type " + type);
        };
    }
}
