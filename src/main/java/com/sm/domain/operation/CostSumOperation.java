package com.sm.domain.operation;

import com.sm.domain.attribute.Unit;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CostSumOperation implements Operation, HasItems {

    @Builder.Default
    private OperationType operationType = OperationType.COST_SUM;

    @Builder.Default
    private List<Operation> items = new ArrayList<>();

    private String costKey;
    private Map<String, Unit> preferredUnits;

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        items.stream().map(Operation::extractAllRefs).forEach(refs -> result.addAll(refs));
        return result;
    }

    @Override
    public void validate() {}
}
