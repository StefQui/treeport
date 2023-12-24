package com.sm.domain;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AggInfo {

    @Builder.Default
    private Integer withValues = 0;

    @Builder.Default
    private List<String> notResolvables = new ArrayList<>();

    @Builder.Default
    private List<String> errors = new ArrayList<>();

    public enum AttributeType {
        LONG,
        BOOLEAN,
        DOUBLE,
        COMPO,
    }
}
