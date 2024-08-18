package com.sm.service.dto;

import com.sm.service.dto.filter.ColumnDefinitionDTO;
import java.io.Serializable;
import java.util.List;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link com.sm.domain.Asset} entity.
 */
@Data
@SuperBuilder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SiteUpdateRequestDTO implements Serializable {

    private SiteDTO siteToUpdate;

    private List<ColumnDefinitionDTO> columnDefinitions;
}
