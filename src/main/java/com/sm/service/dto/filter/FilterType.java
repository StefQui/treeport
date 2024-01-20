package com.sm.service.dto.filter;

public enum FilterType {
    AND("AND"),
    OR("OR"),
    SEARCH_NAME("SEARCH_NAME");

    private String name;

    FilterType(String name) {
        this.name = name;
    }

    public static FilterType fromString(String type) {
        return switch (type) {
            case "AND" -> AND;
            case "OR" -> OR;
            case "SEARCH_NAME" -> SEARCH_NAME;
            default -> throw new RuntimeException("pb ici3 for type " + type);
        };
    }

    public String toDTO() {
        return name;
    }
}
