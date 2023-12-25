package com.sm.domain.operation;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ChildrenProductOperation implements Operation, HasItemsKey {

    @Builder.Default
    private OperationType operationType = OperationType.CHILDREN_PRODUCT;

    private String itemsKey;

    @Override
    public Set<RefOperation> extractAllRefs() {
        return null;
    }

    @Override
    public void validate() {
        if (itemsKey == null) {
            throw new RuntimeException("ChildrenProductOperation must have a itemsKey");
        }
    }
}
