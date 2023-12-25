package com.sm.domain.operation;

import java.util.ArrayList;
import java.util.HashSet;
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
public class ProductOperation implements Operation, HasItems {

    @Builder.Default
    private OperationType operationType = OperationType.PRODUCT;

    @Builder.Default
    private List<Operation> items = new ArrayList<>();

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        items.stream().map(Operation::extractAllRefs).forEach(refs -> result.addAll(refs));
        return result;
    }

    @Override
    public void validate() {}
}
