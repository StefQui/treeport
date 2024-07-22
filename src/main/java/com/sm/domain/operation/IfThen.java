package com.sm.domain.operation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class IfThen {

    Operation ifOp;
    Operation thenOp;
}
