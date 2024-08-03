package com.sm.domain.attribute;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitCostValue extends AttributeValue<Map<String, UnitCostLine>> {

    private Map<String, UnitCostLine> value;
}
