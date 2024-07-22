package com.sm.service;

import com.sm.domain.attribute.Attribute;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DirtierService {

    @Autowired
    AttributeService attributeService;

    public void dirtyTrees(Set<Attribute> attributes, String orgaId) {
        attributes.stream().forEach(attribute -> dirtyTree(attribute, orgaId));
    }

    private void dirtyTree(Attribute attribute, String orgaId) {
        attributeService.save(attribute.toBuilder().dirty(true).build());
        dirtyTrees(attributeService.findImpacted(attribute.getId(), orgaId), orgaId);
    }
}
