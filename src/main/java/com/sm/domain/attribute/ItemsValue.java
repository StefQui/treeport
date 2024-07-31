package com.sm.domain.attribute;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemsValue extends AttributeValue<List<String>> {

    private List<String> value;
}
