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
public class CostRefOperation implements Operation {

    @Builder.Default
    private OperationType operationType = OperationType.COST_REF;

    private RefOperation refOperation;
    private String costKey;

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        result.add(this.refOperation);
        return result;
    }

    @Override
    public void validate() {}
}
