package com.sm.service.dto;

import java.io.Serializable;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Tag} entity.
 */
@Value
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TagDTO implements Serializable {

    private String id;

    private String name;
}
