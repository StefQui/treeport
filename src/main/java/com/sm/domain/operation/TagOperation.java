package com.sm.domain.operation;

import com.sm.domain.Tag;
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
public class TagOperation implements Operation {

    @Builder.Default
    private OperationType operationType = OperationType.TAG;

    private TagOperationType tagOperationType;

    private Tag tag;

    @Override
    public Set<RefOperation> extractAllRefs() {
        return new HashSet<>();
    }

    @Override
    public void validate() {}
}
