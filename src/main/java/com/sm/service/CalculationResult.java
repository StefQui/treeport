package com.sm.service;

import com.sm.domain.attribute.AggInfo;
import com.sm.domain.attribute.AttributeValue;
import java.util.HashSet;
import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class CalculationResult {

    AttributeValue resultValue;

    @Builder.Default
    Boolean success = false;

    @Builder.Default
    Set<String> impacterIds = new HashSet<>();

    AggInfo aggInfo;
}
