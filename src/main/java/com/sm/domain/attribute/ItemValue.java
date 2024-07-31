package com.sm.domain.attribute;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemValue extends AttributeValue<String> {

    private String value;
}
