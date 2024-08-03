package com.sm.service;

import java.util.List;
import lombok.Data;

@Data
public class InfiniteLoopException extends Exception {

    List<String> infiniteLoopAttributeIds;

    public InfiniteLoopException(List<String> infiniteLoopAttributeIds) {
        this.infiniteLoopAttributeIds = infiniteLoopAttributeIds;
    }
}
