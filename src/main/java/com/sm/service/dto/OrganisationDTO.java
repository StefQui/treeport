package com.sm.service.dto;

import java.io.Serializable;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Organisation} entity.
 */
@Value
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrganisationDTO implements Serializable {

    private String id;

    private String name;
}
