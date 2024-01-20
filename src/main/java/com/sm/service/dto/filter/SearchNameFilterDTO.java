package com.sm.service.dto.filter;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@Jacksonized
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SearchNameFilterDTO extends ResourceFilterDTO {

    @Builder.Default
    private FilterType filterType = FilterType.SEARCH_NAME;

    private String textSearch;
}
