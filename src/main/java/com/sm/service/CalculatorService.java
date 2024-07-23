package com.sm.service;

import static com.sm.domain.operation.OperationType.CHILDREN_PRODUCT;
import static com.sm.domain.operation.OperationType.CHILDREN_SUM;
import static com.sm.domain.operation.OperationType.COMPARISON;
import static com.sm.domain.operation.OperationType.CONSO_SUM;
import static com.sm.domain.operation.OperationType.CONSTANT;
import static com.sm.domain.operation.OperationType.IF_THEN_ELSE;
import static com.sm.domain.operation.OperationType.PRODUCT;
import static com.sm.domain.operation.OperationType.REF;
import static com.sm.domain.operation.OperationType.SUM;
import static com.sm.domain.operation.OperationType.TAG;
import static com.sm.domain.operation.TagOperationType.CONTAINS;
import static com.sm.service.AttributeKeyUtils.createReferenced;
import static com.sm.service.AttributeKeyUtils.fromString;
import static com.sm.service.AttributeKeyUtils.objToString;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.*;
import com.sm.domain.operation.*;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.*;
import java.util.stream.Collectors;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

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

    public CalculationResult calculateAttribute(String orgaId, Attribute attribute, Set<String> impacterIds, AttributeConfig config)
        throws IsDirtyValueException {
        if (attribute.getHasConfigError()) {
            return CalculationResult
                .builder()
                .resultValue(ErrorValue.builder().value(attribute.getConfigError()).build())
                .success(true)
                .build();
        }
        if (config == null) {
            return CalculationResult
                .builder()
                .resultValue(ErrorValue.builder().value("Attribute config was not found : " + attribute.getConfigId()).build())
                .success(true)
                .build();
        }
        if (config.getIsWritable()) {
            throw new RuntimeException("cannot have a writable here " + attribute.getId() + " " + config);
        }
        // Handle Novalue NotResolvable Errors

        if (CONSTANT.equals(config.getOperationType())) {
            ConstantOperation op = (ConstantOperation) config.getOperation();
            if (op.getConstantType().equals(AggInfo.AttributeType.BOOLEAN)) {
                return CalculationResult
                    .builder()
                    .resultValue(BooleanValue.builder().value(op.getBooleanValue()).build())
                    .success(true)
                    .build();
            } else if (op.getConstantType().equals(AggInfo.AttributeType.DOUBLE)) {
                return CalculationResult
                    .builder()
                    .resultValue(DoubleValue.builder().value(op.getDoubleValue()).build())
                    .success(true)
                    .build();
            } else if (op.getConstantType().equals(AggInfo.AttributeType.LONG)) {
                return CalculationResult.builder().resultValue(LongValue.builder().value(op.getLongValue()).build()).success(true).build();
            } else {
                throw new RuntimeException("to be implemented here 44");
            }
        } else if (TAG.equals(config.getOperationType())) {
            TagOperation op = (TagOperation) config.getOperation();
            if (CONTAINS.equals(op.getTagOperationType())) {
                return CalculationResult
                    .builder()
                    .resultValue(BooleanValue.builder().value(op.getTag() == null || attribute.getTags().contains(op.getTag())).build())
                    .success(true)
                    .build();
            } else {
                throw new RuntimeException("to implement tagOp " + op.getTagOperationType());
            }
        } else if (CONSO_SUM.equals(config.getConsoOperationType())) {
            if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                if (config.getConsoParameterKey() == null) {
                    throw new RuntimeException("pas possible ici 56");
                }
                List<Attribute> attributes = attributeService.getAttributesForSiteChildrenAndConfig(
                    attribute.getId(),
                    config.getKey(),
                    orgaId
                );
                if (attributes.stream().anyMatch(att -> att == null)) {
                    throw new RuntimeException("pas possible ici 56");
                }
                if (attributes.stream().anyMatch(att -> att.getDirty())) {
                    throw new IsDirtyValueException();
                }
                impacterIds.addAll(attributes.stream().map(att -> att.getId()).collect(Collectors.toList()));

                AttributeKeyAsObj attIdAsObj = fromString(attribute.getId());
                String consolidatedId = objToString(
                    createReferenced(attIdAsObj, RefOperation.builder().useCurrentSite(true).key(config.getConsoParameterKey()).build())
                );
                impacterIds.add(consolidatedId);
                Optional<Attribute> consolidated = attributeService.findByIdAndOrgaId(consolidatedId, orgaId);
                if (consolidated.isPresent() && consolidated.get().getDirty()) {
                    throw new IsDirtyValueException();
                }

                return doubleCalculator.calculateConsolidatedAttribute(
                    attribute.getId(),
                    impacterIds,
                    attributes,
                    consolidated,
                    config,
                    DoubleValue.builder().build(),
                    UtilsValue::mapToDouble,
                    0.,
                    Double::sum
                );
                //                    return
                //                            calculateConsolidatedAttribute(attId, impacterIds, config, 0., Double::sum);
                //                } else {
                //                    throw new RuntimeException("to implement 999");
                //                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (SUM.equals(config.getOperationType()) || PRODUCT.equals(config.getOperationType())) {
            HasItems op = (HasItems) config.getOperation();
            if (config.getAttributeType() == AggInfo.AttributeType.LONG) {
                throw new RuntimeException("to be implemented here 66");
            } else if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                List<CalculationResult> results = new ArrayList<>();
                int i = 0;
                while (i < op.getItems().size()) {
                    results.add(
                        calculateAttribute(
                            orgaId,
                            attribute,
                            new HashSet<>(),
                            AttributeConfig
                                .builder()
                                .id("fakeConfig")
                                .orgaId(orgaId)
                                .isConsolidable(false)
                                .operation(op.getItems().get(i))
                                .isWritable(false)
                                .tags(attribute.getTags())
                                .build()
                        )
                    );
                    i++;
                }
                results
                    .stream()
                    .forEach(result -> {
                        if (!CollectionUtils.isEmpty(result.getImpacterIds())) {
                            impacterIds.addAll(result.getImpacterIds());
                        }
                    });
                List<AttributeValue> vals = results.stream().map(CalculationResult::getResultValue).collect(Collectors.toList());

                if (SUM.equals(config.getOperationType())) {
                    return CalculationResult
                        .builder()
                        .resultValue(
                            doubleCalculator.calculateMultiVals(
                                attribute.getId(),
                                vals,
                                config,
                                DoubleValue.builder().build(),
                                UtilsValue::mapToDouble,
                                0.,
                                Double::sum
                            )
                        )
                        .impacterIds(impacterIds)
                        .success(true)
                        .build();
                } else if (PRODUCT.equals(config.getOperationType())) {
                    return CalculationResult
                        .builder()
                        .resultValue(
                            doubleCalculator.calculateMultiVals(
                                attribute.getId(),
                                vals,
                                config,
                                DoubleValue.builder().build(),
                                UtilsValue::mapToDouble,
                                1.,
                                (a, b) -> a * b
                            )
                        )
                        .impacterIds(impacterIds)
                        .success(true)
                        .build();
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (CHILDREN_SUM.equals(config.getOperationType()) || CHILDREN_PRODUCT.equals(config.getOperationType())) {
            if (config.getAttributeType() == AggInfo.AttributeType.DOUBLE) {
                HasItemsKey op = (HasItemsKey) config.getOperation();
                List<Attribute> attributes = attributeService.getAttributesForSiteChildrenAndConfig(
                    attribute.getId(),
                    op.getItemsKey(),
                    orgaId
                );
                if (attributes.stream().anyMatch(att -> att.getDirty())) {
                    throw new IsDirtyValueException();
                }
                //                List<Attribute> attributes = attributeService.getAttributesFromKeys(impacterIds, orgaId);
                if (CHILDREN_SUM.equals(config.getOperationType())) {
                    Pair<AttributeValue, AggInfo> res = doubleCalculator.calculateMultiValuesAttribute(
                        attribute.getId(),
                        attributes,
                        config,
                        DoubleValue.builder().build(),
                        UtilsValue::mapToDouble,
                        0.,
                        Double::sum
                    );
                    impacterIds.addAll(attributes.stream().map(Attribute::getId).collect(Collectors.toList()));
                    return CalculationResult
                        .builder()
                        .resultValue(res.getLeft())
                        .success(true)
                        .impacterIds(impacterIds)
                        .aggInfo(res.getRight())
                        .build();
                    //                    return
                    //                            Pair.of(calculateMultiOperandsAttribute(attId, impacterIds, config, 0., Double::sum), null);
                } else if (CHILDREN_PRODUCT.equals(config.getOperationType())) {
                    Pair<AttributeValue, AggInfo> res = doubleCalculator.calculateMultiValuesAttribute(
                        attribute.getId(),
                        attributes,
                        config,
                        DoubleValue.builder().build(),
                        UtilsValue::mapToDouble,
                        1.,
                        (a, b) -> a * b
                    );
                    impacterIds.addAll(attributes.stream().map(Attribute::getId).collect(Collectors.toList()));
                    return CalculationResult
                        .builder()
                        .resultValue(res.getLeft())
                        .success(true)
                        .impacterIds(impacterIds)
                        .aggInfo(res.getRight())
                        .build();
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else if (AggInfo.AttributeType.LONG.equals(config.getAttributeType())) {
                List<Attribute> attributes = attributeService.getAttributesFromKeys(impacterIds, orgaId);
                if (CHILDREN_SUM.equals(config.getOperationType())) {
                    Pair<AttributeValue, AggInfo> res = longCalculator.calculateMultiValuesAttribute(
                        attribute.getId(),
                        attributes,
                        config,
                        LongValue.builder().build(),
                        UtilsValue::mapToLong,
                        0l,
                        Long::sum
                    );
                    return CalculationResult
                        .builder()
                        .resultValue(res.getLeft())
                        .success(true)
                        .impacterIds(impacterIds)
                        .aggInfo(res.getRight())
                        .build();
                    //                    return
                    //                            Pair.of(calculateMultiOperandsAttribute(attId, impacterIds, config, 0., Double::sum), null);
                } else if (CHILDREN_PRODUCT.equals(config.getOperationType())) {
                    Pair<AttributeValue, AggInfo> res = longCalculator.calculateMultiValuesAttribute(
                        attribute.getId(),
                        attributes,
                        config,
                        LongValue.builder().build(),
                        UtilsValue::mapToLong,
                        1l,
                        (a, b) -> a * b
                    );
                    return CalculationResult
                        .builder()
                        .resultValue(res.getLeft())
                        .success(true)
                        .impacterIds(impacterIds)
                        .aggInfo(res.getRight())
                        .build();
                } else {
                    throw new RuntimeException("to implement 555");
                }
            } else {
                throw new RuntimeException("to implement 555");
            }
        } else if (REF.equals(config.getOperationType())) {
            RefOperation op = (RefOperation) config.getOperation();
            String attKey = createReferencedKey(attribute.getId(), op);
            AttributeValue res = getValueFromReferenced(attKey, orgaId);
            impacterIds.add(attKey);
            return CalculationResult.builder().resultValue(res).success(true).impacterIds(impacterIds).aggInfo(null).build();
        } else if (IF_THEN_ELSE.equals(config.getOperationType())) {
            IfThenElseOperation op = (IfThenElseOperation) config.getOperation();
            return calculateIfThenElse(orgaId, attribute, impacterIds, op);
        } else if (COMPARISON.equals(config.getOperationType())) {
            ComparisonOperation op = (ComparisonOperation) config.getOperation();
            return calculateComparison(orgaId, attribute, impacterIds, op);
        }
        throw new RuntimeException("to implement operation " + config.getOperationType());
    }

    private CalculationResult calculateComparison(String orgaId, Attribute attribute, Set<String> impacterIds, ComparisonOperation op)
        throws IsDirtyValueException {
        if (op.getFirst() == null) {
            return CalculationResult
                .builder()
                .resultValue(NotResolvableValue.builder().value("Cannot do comparison, missing first operand").build())
                .success(true)
                .impacterIds(impacterIds)
                .build();
        }
        if (op.getSecond() == null) {
            return CalculationResult
                .builder()
                .resultValue(NotResolvableValue.builder().value("Cannot do comparison, missing second operand").build())
                .success(true)
                .impacterIds(impacterIds)
                .build();
        }
        AttributeConfig firstFakeConfig = AttributeConfig
            .builder()
            .id("firstFakeConfig")
            .orgaId(orgaId)
            .isConsolidable(false)
            .operation(op.getFirst())
            .isWritable(false)
            .tags(attribute.getTags())
            .build();
        AttributeConfig secondFakeConfig = AttributeConfig
            .builder()
            .id("secondFakeConfig")
            .orgaId(orgaId)
            .isConsolidable(false)
            .operation(op.getSecond())
            .isWritable(false)
            .tags(attribute.getTags())
            .build();
        CalculationResult first = calculateAttribute(orgaId, attribute, impacterIds, firstFakeConfig);
        CalculationResult second = calculateAttribute(orgaId, attribute, impacterIds, secondFakeConfig);
        if (first.getResultValue().isNotResolvable() || first.getResultValue().isError()) {
            return CalculationResult
                .builder()
                .resultValue(NotResolvableValue.builder().value("Cannot do comparison, first operand is error or not resolvable").build())
                .success(true)
                .impacterIds(impacterIds)
                .build();
        }
        if (second.getResultValue().isNotResolvable() || second.getResultValue().isError()) {
            return CalculationResult
                .builder()
                .resultValue(NotResolvableValue.builder().value("Cannot do comparison, second operand is error or not resolvable").build())
                .success(true)
                .impacterIds(impacterIds)
                .build();
        }
        Double firstDouble = Double.valueOf(first.getResultValue().getValue().toString());
        Double secondDouble = Double.valueOf(second.getResultValue().getValue().toString());
        return CalculationResult
            .builder()
            .resultValue(BooleanValue.builder().value(firstDouble > secondDouble).build())
            .success(true)
            .impacterIds(impacterIds)
            .build();
    }

    private CalculationResult calculateIfThenElse(String orgaId, Attribute attribute, Set<String> impacterIds, IfThenElseOperation op)
        throws IsDirtyValueException {
        int i = 0;
        Set<String> impacters = new HashSet<>();
        while (i < op.getIfThens().size()) {
            IfThen ifThen = op.getIfThens().get(i);
            i++;
            if (ifThen.getIfOp() == null) {
                return createNotResolvable(impacterIds, null, "Cannot check if of if/then because it is null");
            }
            CalculationResult ifResult = calculateAttribute(orgaId, attribute, impacters, fakeConfig(orgaId, attribute, ifThen.getIfOp()));
            Boolean ifValue;
            if (ifResult.getResultValue() instanceof BooleanValue) {
                ifValue = ((BooleanValue) ifResult.getResultValue()).getValue();
            } else if (ifResult.getResultValue() instanceof DoubleValue) {
                ifValue = ((DoubleValue) ifResult.getResultValue()).getValue() != 0;
            } else {
                return createNotResolvable(impacterIds, ifResult.getImpacterIds(), "Cannot resolve if statement");
            }
            if (!ifValue) {
                continue;
            }
            if (ifThen.getThenOp() == null) {
                return createNotResolvable(impacterIds, null, "Cannot check then of if/then because it is null");
            }
            CalculationResult thenResult = calculateAttribute(
                orgaId,
                attribute,
                impacters,
                fakeConfig(orgaId, attribute, ifThen.getThenOp())
            );
            if (thenResult.getImpacterIds() != null) {
                impacterIds.addAll(thenResult.getImpacterIds());
            }
            return thenResult;
        }
        Operation elseOp = op.getElseOp();
        if (elseOp == null) {
            return createNotResolvable(impacterIds, null, "Cannot calculate else of if/then because it is null");
        }
        CalculationResult elseResult = calculateAttribute(orgaId, attribute, impacters, fakeConfig(orgaId, attribute, elseOp));
        if (elseResult.getImpacterIds() != null) {
            impacterIds.addAll(elseResult.getImpacterIds());
        }
        return elseResult;
    }

    private CalculationResult createNotResolvable(Set<String> impacterIds, Set<String> impacterIdsToAdd, String message) {
        if (impacterIdsToAdd != null) {
            impacterIds.addAll(impacterIdsToAdd);
        }
        return CalculationResult
            .builder()
            .resultValue(NotResolvableValue.builder().value(message).build())
            .success(true)
            .impacterIds(impacterIds)
            .build();
    }

    private AttributeConfig fakeConfig(String orgaId, Attribute attribute, Operation op) {
        return AttributeConfig
            .builder()
            .id("fakeConfig")
            .orgaId(orgaId)
            .isConsolidable(false)
            .operation(op)
            .isWritable(false)
            .tags(attribute.getTags())
            .build();
    }

    private String createReferencedKey(String attributeKey, RefOperation op) {
        return createReferencedKey(fromString(attributeKey), op);
    }

    private String createReferencedKey(AttributeKeyAsObj attributeKeyAsObj, RefOperation op) {
        return objToString(createReferenced(attributeKeyAsObj, op));
    }

    private AttributeValue getValueFromReferenced(String attKey, @NonNull String orgaId) throws IsDirtyValueException {
        Optional<Attribute> attOpt = attributeService.findByIdAndOrgaId(attKey, orgaId);
        if (attOpt.isPresent()) {
            Attribute att = attOpt.get();
            if (att.getDirty()) {
                throw new IsDirtyValueException();
            } else if (att.getAttributeValue() != null) {
                return att.getAttributeValue();
            } else {
                return NotResolvableValue.builder().value("referenced attribute has no value").build();
            }
        }
        return NotResolvableValue.builder().value("referenced attribute cannot be found").build();
    }
}
