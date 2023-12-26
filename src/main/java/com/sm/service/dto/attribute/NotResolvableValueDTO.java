package com.sm.service.dto.attribute;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@Jacksonized
public class NotResolvableValueDTO extends AttributeValueDTO {

    @Builder.Default
    private AttributeValueType attributeValueType = AttributeValueType.NOT_RESOLVABLE_VT;

    private String value;
}
