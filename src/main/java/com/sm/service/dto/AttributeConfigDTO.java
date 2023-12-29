package com.sm.service.dto;

import com.sm.domain.attribute.AggInfo;
import com.sm.domain.operation.OperationType;
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

    private String label;

    private Boolean applyOnChildren;

    private Boolean isConsolidable;

    private String relatedConfigId;

    private AggInfo.AttributeType attributeType;

    private Boolean isWritable;

    private String consoParameterKey;

    private OperationType consoOperationType;

    private OrganisationDTO orga;

    private SiteDTO site;

    @Builder.Default
    private Set<TagDTO> tags = new HashSet<>();
}
