package com.sm.service.dto.filter;

public enum FilterPropertyType {
    RESOURCE_PROPERTY("RESOURCE_PROPERTY"),
    RESOURCE_ATTRIBUTE("RESOURCE_ATTRIBUTE");

    private String name;

    FilterPropertyType(String name) {
        this.name = name;
    }

    public static FilterPropertyType fromString(String type) {
        return switch (type) {
            case "RESOURCE_PROPERTY" -> RESOURCE_PROPERTY;
            case "RESOURCE_ATTRIBUTE" -> RESOURCE_ATTRIBUTE;
            default -> throw new RuntimeException("pb ici4 for type " + type);
        };
    }

    public String toDTO() {
        return name;
    }
}
