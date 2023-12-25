package com.sm.service.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComputationErrorException extends Throwable {

    private String message;
}
