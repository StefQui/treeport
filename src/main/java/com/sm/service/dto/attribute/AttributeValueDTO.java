package com.sm.service.dto.attribute;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import com.sm.domain.attribute.Attribute;
import com.sm.service.mapper.AttributeValueIdResolver;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@Getter
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode
@JsonTypeInfo(use = JsonTypeInfo.Id.CUSTOM, include = JsonTypeInfo.As.PROPERTY, property = "attributeValueType", visible = true)
@JsonTypeIdResolver(AttributeValueIdResolver.class)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AttributeValueDTO {

    private AttributeValueType attributeValueType;
}
