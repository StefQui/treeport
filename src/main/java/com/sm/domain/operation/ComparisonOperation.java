package com.sm.domain.operation;

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
public class ComparisonOperation implements Operation, Has2Operands {

    @Builder.Default
    private OperationType operationType = OperationType.COMPARISON;

    private ComparisonType comparisonType;

    private Operation first;
    private Operation second;

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        result.addAll(first.extractAllRefs());
        result.addAll(second.extractAllRefs());
        return result;
    }

    @Override
    public void validate() {}
}
