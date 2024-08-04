package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class CostLine {

    private Double quantity;
    private Unit unit;
}
