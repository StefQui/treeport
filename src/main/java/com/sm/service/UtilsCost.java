package com.sm.service;

import com.sm.domain.attribute.CostLine;
import com.sm.domain.attribute.CostValue;
import com.sm.domain.attribute.Unit;
import com.sm.service.exception.NotHomogenousException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UtilsCost {

    public static CostValue applyConversion(CostValue costValue, Map<String, Unit> preferredUnits) throws NotHomogenousException {
        List<String> keys = preferredUnits.keySet().stream().collect(Collectors.toList());
        Map<String, CostLine> result = new HashMap<>();
        int i = 0;
        while (i < keys.size()) {
            CostLine cl = costValue.getValue().get(keys.get(i));
            if (cl == null) {
                result.put(keys.get(i), CostLine.builder().quantity(0.).unit(preferredUnits.get(keys.get(i))).build());
            } else {
                Unit preferredUnit = preferredUnits.get(keys.get(i));
                Unit initialUnit = cl.getUnit();
                Double converion = UtilsUnit.calculateConversion(initialUnit, preferredUnit);
                result.put(
                    keys.get(i),
                    CostLine.builder().quantity(cl.getQuantity() * converion).unit(preferredUnits.get(keys.get(i))).build()
                );
            }
            i++;
        }
        return CostValue.builder().value(result).build();
    }
}
