package com.sm.service.dto.filter;

import java.util.ArrayList;
import java.util.List;
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
public class ResourcePropertyFilterTargetDTO extends PropertyFilterTargetDTO {

    @Builder.Default
    private FilterPropertyType filterPropertyType = FilterPropertyType.RESOURCE_PROPERTY;

    private String property;
}
