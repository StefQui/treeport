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
public class DoubleValueDTO extends AttributeValueDTO {

    @Builder.Default
    private AttributeValueType attributeValueType = AttributeValueType.DOUBLE_VT;

    private Double value;
}
