package com.sm.service.dto.filter;

public enum FilterRuleType {
    TEXT_CONTAINS("TEXT_CONTAINS"),
    TEXT_EQUALS("TEXT_EQUALS"),
    NUMBER_GT("NUMBER_GT"),
    NUMBER_GTE("NUMBER_GTE"),
    NUMBER_LT("NUMBER_LT"),
    NUMBER_LTE("NUMBER_LTE");

    private String name;

    FilterRuleType(String name) {
        this.name = name;
    }

    public static FilterRuleType fromString(String type) {
        return switch (type) {
            case "TEXT_CONTAINS" -> TEXT_CONTAINS;
            case "TEXT_EQUALS" -> TEXT_EQUALS;
            case "NUMBER_GT" -> NUMBER_GT;
            case "NUMBER_GTE" -> NUMBER_GTE;
            case "NUMBER_LT" -> NUMBER_LT;
            case "NUMBER_LTE" -> NUMBER_LTE;
            default -> throw new RuntimeException("pb ici5 for type " + type);
        };
    }

    public String toDTO() {
        return name;
    }
}
