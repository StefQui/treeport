package com.sm.domain.operation;

import com.sm.domain.attribute.AggInfo;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ConstantOperation implements Operation {

    @Builder.Default
    private OperationType operationType = OperationType.CONSTANT;

    private AggInfo.AttributeType constantType;

    private Boolean booleanValue;
    private String stringValue;
    private Long longValue;
    private Double doubleValue;

    @Override
    public Set<RefOperation> extractAllRefs() {
        return new HashSet<>();
    }

    @Override
    public void validate() {}
}
