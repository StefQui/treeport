package com.sm.domain.operation;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class IfThenElseOperation implements Operation, WithDynamicImpactors {

    @Builder.Default
    private OperationType operationType = OperationType.IF_THEN_ELSE;

    @Builder.Default
    private List<IfThen> ifThens = new ArrayList<>();

    private Operation elseOp;

    @Override
    public Set<RefOperation> extractAllRefs() {
        throw new UnsupportedOperationException("to handle here  aaa");
    }

    @Override
    public void validate() {}
}
