package com.sm.domain.operation;

import java.util.Set;

//@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "_class")
public interface Operation {
    Set<RefOperation> extractAllRefs();

    void validate();

    OperationType getOperationType();
}
