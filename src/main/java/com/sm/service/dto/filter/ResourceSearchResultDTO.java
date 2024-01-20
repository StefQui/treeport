package com.sm.service.dto.filter;

import com.sm.domain.attribute.Attribute;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@Getter
@Builder(toBuilder = true)
@EqualsAndHashCode
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourceSearchResultDTO {}
