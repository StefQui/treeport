package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoubleValue extends AttributeValue<Double> {

    private Double value;
}
