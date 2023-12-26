package com.sm.service.mapper;

import com.sm.domain.attribute.AttributeValue;
import com.sm.service.dto.attribute.AttributeValueDTO;

public class BooleanAttributeValueMapper implements TypedAttributeValueMapper {

    @Override
    public AttributeValueDTO toModel(AttributeValue entity) {
        return null;
    }

    @Override
    public AttributeValue toEntity(AttributeValueDTO model) {
        return null;
    }
}
