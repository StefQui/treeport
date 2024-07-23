package com.sm.domain;

import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class FetchImpactResult {

    Boolean isDirty;
    Boolean hasDynamicImpacters;
    Set<String> impacters;
}
