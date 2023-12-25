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
public class RefOperation implements Operation {

    @Builder.Default
    private OperationType operationType = OperationType.REF;

    private Boolean useCurrentSite;
    private String fixedSite;
    private String key;
    private Integer dateOffset;

    @Override
    public Set<RefOperation> extractAllRefs() {
        Set<RefOperation> result = new HashSet<>();
        result.add(this);
        return result;
    }

    @Override
    public void validate() {}
}
