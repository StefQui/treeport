package com.sm.service.dto.filter;

import com.sm.domain.attribute.Attribute;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * A DTO for the {@link Attribute} entity.
 */
@Getter
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode
@Jacksonized
@ToString
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ResourceSearchDTO {

    private String resourceType;
    private List<ColumnDefinitionDTO> columnDefinitions;
    private ResourceFilterDTO filter;
    private Long page;
    private Long size;
    private String sort;

    private String path;
}
