package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BooleanValue extends AttributeValue<Boolean> {

    private Boolean value;
}
