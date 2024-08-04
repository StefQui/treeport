package com.sm.domain.attribute;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CostValue extends AttributeValue<Map<String, CostLine>> {

    private Map<String, CostLine> value;

    public static Map<String, CostLine> sum(Map<String, CostLine> a, Map<String, CostLine> b) {
        if (a == null || b == null) {
            throw new RuntimeException("shouldn't be possible 23232");
        }
        if (!a.keySet().equals(b.keySet())) {
            throw new RuntimeException("shouldn't be possible 6576");
        }

        HashMap<String, CostLine> map = new HashMap<>();
        List<String> keyset = a.keySet().stream().collect(Collectors.toList());
        int i = 0;
        while (i < keyset.size()) {
            String key = keyset.get(i);
            map.put(keyset.get(i), sumCostLines(a.get(key), b.get(key)));
            i++;
        }
        return map;
    }

    private static CostLine sumCostLines(CostLine cl1, CostLine cl2) {
        return cl1.toBuilder().quantity(cl1.getQuantity() + cl2.getQuantity()).build();
    }
}
