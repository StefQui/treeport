package com.sm.service;

import com.sm.domain.attribute.Unit;
import com.sm.service.exception.NotHomogenousException;

public class UtilsUnit {

    public static Double calculateConversion(Unit from, Unit to) throws NotHomogenousException {
        if (!from.getUnitFamily().equals(to.getUnitFamily())) {
            throw new NotHomogenousException();
        }
        return to.getWeight() / from.getWeight();
    }
}
