package com.sm.service.dto;

import com.sm.domain.enumeration.AttributeType;
import com.sm.domain.enumeration.OperationType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.AttributeConfig} entity.
 */
@Value
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AttributeConfigDTO implements Serializable {

    private String id;

    private Boolean applyOnChildren;

    private Boolean isConsolidable;

    private String relatedConfigId;

    private AttributeType attributeType;

    private Boolean isWritable;

    private String consoParameterKey;

    private OperationType consoOperationType;

    private OrganisationDTO orga;

    private AssetDTO site;

    @Builder.Default
    private Set<TagDTO> tags = new HashSet<>();
}