package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompoLine {

    private Double quantity;
    private Unit unit;
    private String resourceId;
}
