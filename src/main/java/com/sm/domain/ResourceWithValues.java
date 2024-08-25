package com.sm.domain;

import com.sm.domain.attribute.AttributeValue;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class ResourceWithValues extends Resource {

    private Map<String, AttributeValue> attributeValues;
}
