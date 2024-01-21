package com.sm.service.dto.filter;

public enum FilterType {
    AND("AND"),
    OR("OR"),
    PROPERTY_FILTER("PROPERTY_FILTER");

    private String name;

    FilterType(String name) {
        this.name = name;
    }

    public static FilterType fromString(String type) {
        return switch (type) {
            case "AND" -> AND;
            case "OR" -> OR;
            case "PROPERTY_FILTER" -> PROPERTY_FILTER;
            default -> throw new RuntimeException("pb ici3 for type " + type);
        };
    }

    public String toDTO() {
        return name;
    }
}
