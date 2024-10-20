package com.sm.service.dto;

import com.sm.domain.attribute.Attribute;
import java.io.Serializable;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@Value
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExplodedIdDTO implements Serializable {

    private String resourceId;

    private String campaignId;

    private String key;
}
