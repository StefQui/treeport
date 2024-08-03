package com.sm.domain.attribute;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CostValue extends AttributeValue<Map<String, CostLine>> {

    private Map<String, CostLine> value;
}
