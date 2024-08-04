package com.sm.domain.operation;

import com.sm.domain.attribute.Unit;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CostOperation implements Operation {

    @Builder.Default
    private OperationType operationType = OperationType.COST_OP;

    private Operation operation;
    private String costKey;
    private Map<String, Unit> preferredUnits;

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        //        result.add(this.refOperation);
        return result;
    }

    @Override
    public void validate() {}
}
