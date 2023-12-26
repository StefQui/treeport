package com.sm.service.dto.attribute;

import com.sm.domain.attribute.Attribute;
import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode
@Getter
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BaseAttributeDTO implements Serializable {

    AttributeValueType attributeValueType;
}
