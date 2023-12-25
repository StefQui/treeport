package com.sm.domain;

import java.util.HashSet;
import java.util.Set;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder(toBuilder = true)
@EqualsAndHashCode
public class Impact {

    private String impactedId;

    @Builder.Default
    private Set<String> impacterIds = new HashSet();
}
