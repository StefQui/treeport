package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitCostLine {

    private Double quantity;
    private Unit unit;
    //    private String resourceId;
}
