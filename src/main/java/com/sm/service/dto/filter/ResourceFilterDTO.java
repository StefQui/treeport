package com.sm.service.dto.filter;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import com.sm.domain.attribute.Attribute;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@Getter
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode
@JsonTypeInfo(use = JsonTypeInfo.Id.CUSTOM, include = JsonTypeInfo.As.PROPERTY, property = "filterType", visible = true)
@JsonTypeIdResolver(ResourceFilterIdResolver.class)
@ToString
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourceFilterDTO {

    private FilterType filterType;
}
