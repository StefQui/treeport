package com.sm.service.mapper;

import com.sm.domain.attribute.AttributeValue;
import com.sm.service.dto.attribute.AttributeValueDTO;

public interface TypedAttributeValueMapper {
    AttributeValueDTO toModel(final AttributeValue entity);

    AttributeValue toEntity(final AttributeValueDTO model);
}
