package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.attribute.AggInfo.AttributeType.LONG;

import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.AggInfo;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.attribute.DoubleValue;
import com.sm.domain.operation.*;
import java.util.List;

public class ComputeTestUtils {

    public static AttributeConfig sumConfig(Operation... operations) {
        return AttributeConfig
            .builder()
            .id("configSum")
            .isWritable(false)
            .attributeType(DOUBLE)
            .operation(SumOperation.builder().items(List.of(operations)).build())
            .build();
    }

    public static AttributeConfig childrenSumConfig(String itemsKey) {
        return AttributeConfig
            .builder()
            .id("configChildrenSum")
            .isWritable(false)
            .attributeType(DOUBLE)
            .operation(ChildrenSumOperation.builder().itemsKey(itemsKey).build())
            .build();
    }

    public static AttributeConfig consoSumConfig(String itemsKey) {
        return AttributeConfig
            .builder()
            .id("configConsoSum")
            .isWritable(false)
            .attributeType(DOUBLE)
            .isConsolidable(true)
            .consoParameterKey(itemsKey)
            .consoOperationType(OperationType.CONSO_SUM)
            .build();
    }

    public static ConstantOperation constant(AggInfo.AttributeType type, Object val) {
        if (type.equals(DOUBLE)) {
            return ConstantOperation.builder().constantType(type).doubleValue((Double) val).build();
        }
        if (type.equals(LONG)) {
            return ConstantOperation.builder().constantType(type).longValue((Long) val).build();
        }
        if (type.equals(BOOLEAN)) {
            return ConstantOperation.builder().constantType(type).booleanValue((Boolean) val).build();
        }
        return null;
    }

    public static Attribute dirtyValue() {
        return Attribute.builder().dirty(true).build();
    }

    public static Attribute doubleValueAttribute(Double d) {
        return Attribute.builder().attributeValue(DoubleValue.builder().value(d).build()).build();
    }

    public static RefOperation refOp(String key, boolean useCurrentSite, String fixedSite) {
        return RefOperation.builder().key(key).useCurrentSite(useCurrentSite).fixedSite(fixedSite).build();
    }

    public static RefOperation refOp(String key) {
        return RefOperation.builder().key(key).useCurrentSite(true).build();
    }

    public static RefOperation refOp(String key, boolean useCurrentSite, String fixedSite, Integer dateOffset) {
        return RefOperation.builder().key(key).useCurrentSite(useCurrentSite).dateOffset(dateOffset).fixedSite(fixedSite).build();
    }

    public static AttributeConfig ifThenElseConfig(List<IfThen> ifThens, Operation elseOp) {
        return AttributeConfig
            .builder()
            .id("iteSum")
            .isWritable(false)
            .attributeType(DOUBLE)
            .operation(ifThenElse(ifThens, elseOp))
            .build();
    }

    public static IfThenElseOperation ifThenElse(List<IfThen> ifThens, Operation elseOp) {
        return IfThenElseOperation.builder().ifThens(ifThens).elseOp(elseOp).build();
    }

    public static IfThen ifThen(Operation ifOp, Operation thenOp) {
        return IfThen.builder().ifOp(ifOp).thenOp(thenOp).build();
    }
}
