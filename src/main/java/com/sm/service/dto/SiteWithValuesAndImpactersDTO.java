package com.sm.service.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@Data
@Builder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SiteWithValuesAndImpactersDTO implements Serializable {

    private SiteWithValuesDTO site;

    @Builder.Default
    private Set<String> impactedIds = new HashSet<>();
}
