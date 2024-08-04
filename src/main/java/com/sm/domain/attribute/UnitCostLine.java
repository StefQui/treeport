package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitCostLine {

    private Double cost;
    private Unit costUnit;
    private Unit resourceUnit;
    //    private String resourceId;
}
