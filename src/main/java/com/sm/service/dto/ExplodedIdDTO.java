package com.sm.service.dto;

import com.sm.domain.attribute.Attribute;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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
public class AttributeDTO implements Serializable {

    private String id;

    private Boolean isAgg;

    private Boolean hasConfigError;

    private String configError;

    private OrganisationDTO orga;

    private SiteDTO site;

    private AttributeConfigDTO config;

    private Set<TagDTO> tags = new HashSet<>();
}
