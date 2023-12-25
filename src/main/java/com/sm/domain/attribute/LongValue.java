package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LongValue extends AttributeValue<Long> {

    private Long value;
}
