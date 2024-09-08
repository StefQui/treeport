package com.sm.service.dto.filter;

public enum ColumnType {
    ID,
    NAME,
    TAGS,
    ATTRIBUTE,
    BUTTON;

    public static ColumnType fromString(String type) {
        return switch (type) {
            case "ID" -> ID;
            case "NAME" -> NAME;
            case "TAGS" -> TAGS;
            case "ATTRIBUTE" -> ATTRIBUTE;
            case "BUTTON" -> BUTTON;
            default -> throw new RuntimeException("pb ici2 for type " + type);
        };
    }
}
