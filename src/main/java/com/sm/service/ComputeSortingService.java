package com.sm.service;

import com.sm.domain.attribute.Attribute;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

@UtilityClass
@Slf4j
public class ComputeSortingService {

    /**
     * Sort Impacted attributes so that we can calculate them in the correct order
     *
     * @param impactedAttributes
     * @return
     */
    public static List<Attribute> sortImpacteds(Set<Attribute> impactedAttributes) {
        List<Attribute> impactedAttributesAsList = impactedAttributes.stream().collect(Collectors.toList());
        Set<String> impactedAttributeKeys = impactedAttributesAsList.stream().map(Attribute::getId).collect(Collectors.toSet());
        List<Attribute> orderedAttributes = new ArrayList<>();
        Integer impactSize = -1;
        while (!impactedAttributesAsList.isEmpty()) {
            findAndReorderResolvableImpacted2(orderedAttributes, impactedAttributesAsList, impactedAttributeKeys);
            if (impactSize != -1 && impactedAttributesAsList.size() == impactSize) {
                throw new RuntimeException("pb de boucle infinie");
            }
            impactSize = impactedAttributesAsList.size();
        }

        return orderedAttributes;
    }

    private void findAndReorderResolvableImpacted2(
        List<Attribute> orderedImpacts,
        List<Attribute> impactedAttributes,
        Set<String> impactedAttributeKeys
    ) {
        int i = 0;
        int count = impactedAttributes.size();
        while (i < count) {
            Set<String> impacters = impactedAttributes.get(i).getImpacterIds();
            if (!impacters.stream().anyMatch(impacterId -> impactedAttributeKeys.contains(impacterId))) {
                impactedAttributeKeys.remove(impactedAttributes.get(i).getId());
                Attribute removed = impactedAttributes.remove(i);
                orderedImpacts.add(removed);
                break;
            }
            i++;
        }
    }
}
