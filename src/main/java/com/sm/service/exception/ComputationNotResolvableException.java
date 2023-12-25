package com.sm.service.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComputationNotResolvableException extends Throwable {

    private String message;
}
