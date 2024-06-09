package com.sm.service;

import static com.sm.domain.operation.OperationType.CHILDREN_PRODUCT;
import static com.sm.domain.operation.OperationType.CHILDREN_SUM;
import static com.sm.domain.operation.OperationType.COMPARISON;
import static com.sm.domain.operation.OperationType.CONSO_SUM;
import static com.sm.domain.operation.OperationType.CONSTANT;
import static com.sm.domain.operation.OperationType.PRODUCT;
import static com.sm.domain.operation.OperationType.REF;
import static com.sm.domain.operation.OperationType.SUM;
import static com.sm.domain.operation.OperationType.TAG;
import static com.sm.domain.operation.TagOperationType.CONTAINS;
import static com.sm.service.AttributeKeyUtils.createReferenced;
import static com.sm.service.AttributeKeyUtils.fromString;
import static com.sm.service.AttributeKeyUtils.objToString;

import com.sm.domain.AttributeConfig;
import com.sm.domain.Tag;
import com.sm.domain.attribute.*;
import com.sm.domain.operation.*;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CalculatorService {

    @Autowired
    SiteService siteService;

    @Autowired
    CampaignService campaignService;

    @Autowired
    AttributeConfigService attributeConfigService;

    @Autowired
    AttributeValueMapper attributeValueMapper;

    @Autowired
    AttributeService attributeService;

    ConsoCalculator<Double> doubleCalculator = new ConsoCalculator();
    ConsoCalculator<Long> longCalculator = new ConsoCalculator();

    public Pair<AttributeValue, AggInfo> calculateAttribute(
        String orgaId,
        String attId,
        Set<Tag> attTags,
        Set<String> impacterIds,
        AttributeConfig config
    ) {
        if (config.getIsWritable()) {
            throw new RuntimeException("cannot have a writable here " + attId + " " + config);
        }
        if (config.getId().equals("site:a12:toConso:period:2023")) {
            log.info("kkk site:a12:toConso:period:2023");
        }
        // Handle Novalue NotResolvable Errors

        if (CONSTANT.equals(config.getOperationType())) {
            ConstantOperation op = (ConstantOperation) config.getOperation();
            if (op.getConstantType().equals(AggInfo.AttributeType.BOOLEAN)) {
                return Pair.of(BooleanValue.builder().value(op.getBooleanValue()).build(), null);
            } else if (op.getConstantType().equals(AggInfo.AttributeType.DOUBLE)) {
                return Pair.of(DoubleValue.builder().value(op.getDoubleValue()).build(), null);
            } else if (op.getConstantType().equals(AggInfo.AttributeType.LONG)) {
                return Pair.of(LongValue.builder().value(op.getLongValue()).build(), null);
            } else {
                throw new RuntimeException("to be implemented here 44");
            }
        } else if (TAG.equals(config.getOperationType())) {
            TagOperation op = (TagOperation) config.getOperation();
            if (CONTAINS.equals(op.getTagOperationType())) {
                return Pair.of(BooleanValue.builder().value(op.getTag() == null || attTags.contains(op.getTag())).build(), null);
            } else {
                throw new RuntimeException("to implement tagOp " + op.getTagOperationType());
            }
        } else if (CONSO_SUM.equals(config.getConsoOperationType())) {
            if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                if (config.getIsConsolidable()) {
                    if (
                        impacterIds
                            .stream()
                            .map(impacterId -> attributeService.findByIdAndOrgaId(impacterId, orgaId).orElse(null))
                            .anyMatch(att -> att == null)
                    ) {
                        throw new RuntimeException("pas possible ici");
                    }

                    List<Attribute> attributes = getAttributesFromKeys(impacterIds, orgaId);
                    return doubleCalculator.calculateConsolidatedAttribute(
                        attId,
                        attributes,
                        config,
                        DoubleValue.builder().build(),
                        UtilsValue::mapToDouble,
                        0.,
                        Double::sum
                    );
                    //                    return
                    //                            calculateConsolidatedAttribute(attId, impacterIds, config, 0., Double::sum);
                } else {
                    throw new RuntimeException("to implement 999");
                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (SUM.equals(config.getOperationType()) || PRODUCT.equals(config.getOperationType())) {
            HasItems op = (HasItems) config.getOperation();
            if (config.getAttributeType() == AggInfo.AttributeType.LONG) {
                throw new RuntimeException("to be implemented here 66");
            } else if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                List<AttributeValue> vals = op
                    .getItems()
                    .stream()
                    .map(item ->
                        calculateAttribute(
                            orgaId,
                            attId,
                            attTags,
                            new HashSet<>(),
                            AttributeConfig
                                .builder()
                                .id("fakeConfig")
                                .orgaId(orgaId)
                                .isConsolidable(false)
                                .operation(item)
                                .isWritable(false)
                                .tags(attTags)
                                .build()
                        )
                    )
                    .map(Pair::getLeft)
                    .collect(Collectors.toList());

                if (SUM.equals(config.getOperationType())) {
                    return Pair.of(
                        doubleCalculator.calculateMultiVals(
                            attId,
                            vals,
                            config,
                            DoubleValue.builder().build(),
                            UtilsValue::mapToDouble,
                            0.,
                            Double::sum
                        ),
                        null
                    );
                } else if (PRODUCT.equals(config.getOperationType())) {
                    return Pair.of(
                        doubleCalculator.calculateMultiVals(
                            attId,
                            vals,
                            config,
                            DoubleValue.builder().build(),
                            UtilsValue::mapToDouble,
                            1.,
                            (a, b) -> a * b
                        ),
                        null
                    );
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (CHILDREN_SUM.equals(config.getOperationType()) || CHILDREN_PRODUCT.equals(config.getOperationType())) {
            if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                List<Attribute> attributes = getAttributesFromKeys(impacterIds, orgaId);
                if (CHILDREN_SUM.equals(config.getOperationType())) {
                    return doubleCalculator.calculateMultiValuesAttribute(
                        attId,
                        attributes,
                        config,
                        DoubleValue.builder().build(),
                        UtilsValue::mapToDouble,
                        0.,
                        Double::sum
                    );
                    //                    return
                    //                            Pair.of(calculateMultiOperandsAttribute(attId, impacterIds, config, 0., Double::sum), null);
                } else if (CHILDREN_PRODUCT.equals(config.getOperationType())) {
                    return doubleCalculator.calculateMultiValuesAttribute(
                        attId,
                        attributes,
                        config,
                        DoubleValue.builder().build(),
                        UtilsValue::mapToDouble,
                        1.,
                        (a, b) -> a * b
                    );
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else if (AggInfo.AttributeType.LONG.equals(config.getAttributeType())) {
                List<Attribute> attributes = getAttributesFromKeys(impacterIds, orgaId);
                if (CHILDREN_SUM.equals(config.getOperationType())) {
                    return longCalculator.calculateMultiValuesAttribute(
                        attId,
                        attributes,
                        config,
                        LongValue.builder().build(),
                        UtilsValue::mapToLong,
                        0l,
                        Long::sum
                    );
                    //                    return
                    //                            Pair.of(calculateMultiOperandsAttribute(attId, impacterIds, config, 0., Double::sum), null);
                } else if (CHILDREN_PRODUCT.equals(config.getOperationType())) {
                    return longCalculator.calculateMultiValuesAttribute(
                        attId,
                        attributes,
                        config,
                        LongValue.builder().build(),
                        UtilsValue::mapToLong,
                        1l,
                        (a, b) -> a * b
                    );
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (REF.equals(config.getOperationType())) {
            RefOperation op = (RefOperation) config.getOperation();
            String attKey = createReferencedKey(attId, op);
            return Pair.of(getValueFromReferenced(attKey, orgaId), null);
        } else if (COMPARISON.equals(config.getOperationType())) {
            ComparisonOperation op = (ComparisonOperation) config.getOperation();
            if (op.getFirst() == null) {
                return Pair.of(NotResolvableValue.builder().value("Cannot do comparison, missing first operand").build(), null);
            }
            if (op.getSecond() == null) {
                return Pair.of(NotResolvableValue.builder().value("Cannot do comparison, missing second operand").build(), null);
            }
            AttributeConfig firstFakeConfig = AttributeConfig
                .builder()
                .id("firstFakeConfig")
                .orgaId(orgaId)
                .isConsolidable(false)
                .operation(op.getFirst())
                .isWritable(false)
                .tags(attTags)
                .build();
            AttributeConfig secondFakeConfig = AttributeConfig
                .builder()
                .id("secondFakeConfig")
                .orgaId(orgaId)
                .isConsolidable(false)
                .operation(op.getSecond())
                .isWritable(false)
                .tags(attTags)
                .build();
            Pair<AttributeValue, AggInfo> first = calculateAttribute(orgaId, attId, attTags, new HashSet<>(), firstFakeConfig);
            Pair<AttributeValue, AggInfo> second = calculateAttribute(orgaId, attId, attTags, new HashSet<>(), secondFakeConfig);
            if (first.getLeft().isNotResolvable() || first.getLeft().isError()) {
                return Pair.of(
                    NotResolvableValue.builder().value("Cannot do comparison, first operand is error or not resolvable").build(),
                    null
                );
            }
            if (second.getLeft().isNotResolvable() || second.getLeft().isError()) {
                return Pair.of(
                    NotResolvableValue.builder().value("Cannot do comparison, second operand is error or not resolvable").build(),
                    null
                );
            }
            Double firstDouble = Double.valueOf(first.getLeft().getValue().toString());
            Double secondDouble = Double.valueOf(second.getLeft().getValue().toString());
            return Pair.of(BooleanValue.builder().value(firstDouble > secondDouble).build(), null);
        }
        throw new RuntimeException("to implement operation " + config.getOperationType());
    }

    private List<Attribute> getAttributesFromKeys(Set<String> keys, @NonNull String orgaId) {
        return keys
            .stream()
            .map(impacterId -> attributeService.findByIdAndOrgaId(impacterId, orgaId))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }

    private String createReferencedKey(String attributeKey, RefOperation op) {
        return createReferencedKey(fromString(attributeKey), op);
    }

    private String createReferencedKey(AttributeKeyAsObj attributeKeyAsObj, RefOperation op) {
        return objToString(createReferenced(attributeKeyAsObj, op));
    }

    private AttributeValue getValueFromReferenced(String attKey, @NonNull String orgaId) {
        Optional<Attribute> attOpt = attributeService.findByIdAndOrgaId(attKey, orgaId);
        if (attOpt.isPresent()) {
            Attribute att = attOpt.get();
            if (att.getAttributeValue() != null) {
                return att.getAttributeValue();
            } else {
                return NotResolvableValue.builder().value("referenced attribute has no value").build();
            }
        }
        return NotResolvableValue.builder().value("referenced attribute cannot be found").build();
    }
}
