package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.attribute.AggInfo.AttributeType.LONG;
import static com.sm.domain.operation.TagOperationType.CONTAINS;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.sm.domain.AttributeConfig;
import com.sm.domain.Tag;
import com.sm.domain.attribute.AggInfo;
import com.sm.domain.attribute.AttributeValue;
import com.sm.domain.operation.ConstantOperation;
import com.sm.domain.operation.Operation;
import com.sm.domain.operation.SumOperation;
import com.sm.domain.operation.TagOperation;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.List;
import java.util.Set;
import org.apache.commons.lang3.tuple.Pair;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CalculatorServiceTest {

    @InjectMocks
    CalculatorService calculatorService;

    @Mock
    SiteService siteService;

    @Mock
    CampaignService campaignService;

    @Mock
    AttributeConfigService attributeConfigService;

    @Mock
    AttributeValueMapper attributeValueMapper;

    @Mock
    AttributeService attributeService;

    public static final Tag SITE_TAG = Tag.builder().id("site").build();
    public static final Tag WORK_TAG = Tag.builder().id("work").build();

    public static final AttributeConfig READABLE_CONFIG = AttributeConfig.builder().id("readableConfig").isWritable(true).build();

    public static final AttributeConfig CONST_CONFIG_TRUE = AttributeConfig
        .builder()
        .id("constConfigTrue")
        .isWritable(false)
        .operation(constant(BOOLEAN, true))
        .build();

    public static final AttributeConfig CONST_CONFIG_FALSE = AttributeConfig
        .builder()
        .id("constConfigFalse")
        .isWritable(false)
        .operation(constant(BOOLEAN, false))
        .build();

    public static final AttributeConfig CONST_CONFIG_15L = AttributeConfig
        .builder()
        .id("constConfig15l")
        .isWritable(false)
        .operation(constant(LONG, 15l))
        .build();

    public static final AttributeConfig CONST_CONFIG_DOUBLE = AttributeConfig
        .builder()
        .id("constConfigDouble")
        .isWritable(false)
        .operation(constant(DOUBLE, 2.36))
        .build();

    public static final AttributeConfig CONFIG_TAG_SITE_WORK = AttributeConfig
        .builder()
        .id("configTagSiteWork")
        .isWritable(false)
        .operation(TagOperation.builder().tagOperationType(CONTAINS).tag(SITE_TAG).build())
        .build();

    public static final AttributeConfig CONFIG_NO_TAG = AttributeConfig
        .builder()
        .id("configNoTag")
        .isWritable(false)
        .operation(TagOperation.builder().tagOperationType(CONTAINS).build())
        .build();

    @Test
    public void testConfigWritable() {
        Exception exception = assertThrows(
            RuntimeException.class,
            () -> calculatorService.calculateAttribute("coca", "att1", Set.of(Tag.builder().build()), Set.of(""), READABLE_CONFIG)
        );
    }

    @Test
    public void testConstConfigTrue() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute("coca", "att1", Set.of(), Set.of(""), CONST_CONFIG_TRUE);
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(true);
    }

    @Test
    public void testConstConfigFalse() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute("coca", "att1", Set.of(), Set.of(""), CONST_CONFIG_FALSE);
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(false);
    }

    @Test
    public void testConstConfig15l() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute("coca", "att1", Set.of(), Set.of(""), CONST_CONFIG_15L);
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(15l);
    }

    @Test
    public void testConstConfigDouble() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(),
            Set.of(""),
            CONST_CONFIG_DOUBLE
        );
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(2.36);
    }

    @Test
    public void testConfigTag() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(SITE_TAG, WORK_TAG),
            Set.of(""),
            CONFIG_TAG_SITE_WORK
        );
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(true);

        Pair<AttributeValue, AggInfo> calc2 = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(WORK_TAG),
            Set.of(""),
            CONFIG_TAG_SITE_WORK
        );
        Assertions.assertThat(calc2.getLeft().getValue()).isEqualTo(false);

        Pair<AttributeValue, AggInfo> calc3 = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(),
            Set.of(""),
            CONFIG_TAG_SITE_WORK
        );
        Assertions.assertThat(calc3.getLeft().getValue()).isEqualTo(false);

        Pair<AttributeValue, AggInfo> calc4 = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(WORK_TAG),
            Set.of(""),
            CONFIG_NO_TAG
        );
        Assertions.assertThat(calc4.getLeft().getValue()).isEqualTo(true);
    }

    @Test
    public void testConfigConsoSum() {
        Pair<AttributeValue, AggInfo> calc = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(),
            Set.of(),
            sumConfig(constant(DOUBLE, 20.), constant(DOUBLE, 15.))
        );
        Assertions.assertThat(calc.getLeft().getValue()).isEqualTo(35.);

        Pair<AttributeValue, AggInfo> calc2 = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(),
            Set.of(),
            sumConfig(constant(DOUBLE, 20.), constant(LONG, 14l))
        );
        Assertions.assertThat(calc2.getLeft().getValue()).isEqualTo(34.);

        Pair<AttributeValue, AggInfo> calc3 = calculatorService.calculateAttribute(
            "coca",
            "att1",
            Set.of(),
            Set.of(),
            sumConfig(constant(BOOLEAN, true), constant(LONG, 10), constant(BOOLEAN, false))
        );
        Assertions.assertThat(calc2.getLeft().getValue()).isEqualTo(11.);
    }

    private AttributeConfig sumConfig(Operation... operations) {
        return AttributeConfig
            .builder()
            .id("configSum")
            .isWritable(false)
            .attributeType(DOUBLE)
            .operation(SumOperation.builder().items(List.of(operations)).build())
            .build();
    }

    private static ConstantOperation constant(AggInfo.AttributeType type, Object val) {
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
}
