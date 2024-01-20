package com.sm.service.dto.filter;

import static com.sm.service.dto.filter.ColumnType.ID;

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
public class IdColumnDTO extends ColumnDefinitionDTO {

    @Builder.Default
    private ColumnType columnType = ID;
}
