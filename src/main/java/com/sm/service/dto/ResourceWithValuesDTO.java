package com.sm.service.dto;

import com.sm.service.dto.attribute.AttributeValueDTO;
import java.util.Map;
import lombok.Value;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@Value
@SuperBuilder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourceWithValuesDTO extends ResourceDTO {

    private Map<String, AttributeValueDTO> attributeValues;
}
