package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.attribute.AggInfo.AttributeType.LONG;
import static com.sm.domain.operation.TagOperationType.CONTAINS;
import static com.sm.service.ComputeTestUtils.childrenSumConfig;
import static com.sm.service.ComputeTestUtils.consoSumConfig;
import static com.sm.service.ComputeTestUtils.constant;
import static com.sm.service.ComputeTestUtils.dirtyValue;
import static com.sm.service.ComputeTestUtils.doubleValueAttribute;
import static com.sm.service.ComputeTestUtils.ifThen;
import static com.sm.service.ComputeTestUtils.ifThenElseConfig;
import static com.sm.service.ComputeTestUtils.refOp;
import static com.sm.service.ComputeTestUtils.sumConfig;
import static com.sm.service.InitialLoadService.COCA;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.sm.domain.AttributeConfig;
import com.sm.domain.Tag;
import com.sm.domain.attribute.Attribute;
import com.sm.domain.attribute.BooleanValue;
import com.sm.domain.attribute.DoubleValue;
import com.sm.domain.attribute.NotResolvableValue;
import com.sm.domain.operation.TagOperation;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Nested;
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

    public static final AttributeConfig CONFIG_TAG_SITE = AttributeConfig
        .builder()
        .id("configTagSite")
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
    @SneakyThrows
    public void testConfigWritable() {
        Exception exception = assertThrows(
            RuntimeException.class,
            () -> calculatorService.calculateAttribute(COCA, Attribute.builder().build(), Set.of(""), READABLE_CONFIG)
        );
    }

    @Test
    @SneakyThrows
    public void testConstConfigTrue() {
        CalculationResult calc = calculatorService.calculateAttribute(COCA, Attribute.builder().build(), Set.of(""), CONST_CONFIG_TRUE);
        assertThat(calc.getResultValue().getValue()).isEqualTo(true);
    }

    @Test
    @SneakyThrows
    public void testConstConfigFalse() {
        CalculationResult calc = calculatorService.calculateAttribute(COCA, Attribute.builder().build(), Set.of(""), CONST_CONFIG_FALSE);
        assertThat(calc.getResultValue().getValue()).isEqualTo(false);
    }

    @Test
    @SneakyThrows
    public void testConstConfig15l() {
        CalculationResult calc = calculatorService.calculateAttribute(COCA, Attribute.builder().build(), Set.of(""), CONST_CONFIG_15L);
        assertThat(calc.getResultValue().getValue()).isEqualTo(15l);
    }

    @Test
    @SneakyThrows
    public void testConstConfigDouble() {
        CalculationResult calc = calculatorService.calculateAttribute(COCA, Attribute.builder().build(), Set.of(""), CONST_CONFIG_DOUBLE);
        assertThat(calc.getResultValue().getValue()).isEqualTo(2.36);
    }

    @Test
    @SneakyThrows
    public void testConfigTag() {
        CalculationResult calc = calculatorService.calculateAttribute(
            COCA,
            Attribute.builder().tags(Set.of(SITE_TAG, WORK_TAG)).build(),
            new HashSet<>(List.of("")),
            CONFIG_TAG_SITE
        );
        assertThat(calc.getResultValue().getValue()).isEqualTo(true);

        CalculationResult calc2 = calculatorService.calculateAttribute(
            COCA,
            Attribute.builder().tags(Set.of(WORK_TAG)).build(),
            new HashSet<>(List.of("")),
            CONFIG_TAG_SITE
        );

        assertThat(calc2.getResultValue().getValue()).isEqualTo(false);

        CalculationResult calc3 = calculatorService.calculateAttribute(
            COCA,
            Attribute.builder().tags(Set.of()).build(),
            new HashSet<>(List.of("")),
            CONFIG_TAG_SITE
        );
        assertThat(calc3.getResultValue().getValue()).isEqualTo(false);

        CalculationResult calc4 = calculatorService.calculateAttribute(
            COCA,
            Attribute.builder().tags(Set.of(WORK_TAG)).build(),
            new HashSet<>(List.of("")),
            CONFIG_NO_TAG
        );

        assertThat(calc4.getResultValue().getValue()).isEqualTo(true);
    }

    @Nested
    class SumOperation {

        @Test
        @SneakyThrows
        public void sumOperation_happyflow() {
            CalculationResult calc = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(DOUBLE, 20.), constant(DOUBLE, 15.))
            );

            assertThat(calc.getResultValue().getValue()).isEqualTo(35.);
            assertThat(calc.getImpacterIds()).isEmpty();

            CalculationResult calc2 = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(DOUBLE, 20.), constant(LONG, 14l))
            );

            assertThat(calc2.getResultValue().getValue()).isEqualTo(34.);
            assertThat(calc2.getImpacterIds()).isEmpty();

            CalculationResult calc3 = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(BOOLEAN, true), constant(LONG, 10l), constant(BOOLEAN, false))
            );

            assertThat(calc3.getResultValue().getValue()).isEqualTo(11.);
            assertThat(calc3.getImpacterIds()).isEmpty();
        }

        @Test
        @SneakyThrows
        public void sumOperation_withRef() {
            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA)).thenReturn(Optional.of(doubleValueAttribute(10.)));

            CalculationResult calc4 = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(DOUBLE, 4.2), refOp("toSite"), constant(BOOLEAN, false))
            );

            assertThat(calc4.getResultValue().getValue()).isEqualTo(14.2);
            assertThat(calc4.getImpacterIds()).containsExactlyInAnyOrder("site:s1:toSite:period:2023");
        }

        @Test
        @SneakyThrows
        public void sumOperation_withDirty() {
            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().dirty(true).build()));

            assertThrows(
                IsDirtyValueException.class,
                () ->
                    doCalculateAttribute(
                        "site:s1:toSum:period:2023",
                        sumConfig(constant(DOUBLE, 4.2), refOp("toSite"), constant(BOOLEAN, false))
                    )
            );
        }
    }

    @Nested
    class ChildrenSumOperation {

        @Test
        @SneakyThrows
        public void childrenSumOperation_happyflow() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toSum:period:2023", "toSite", COCA))
                .thenReturn(
                    List.of(
                        doubleValueAttribute(5.).toBuilder().id("site:s1-1:toSite:period:2023").build(),
                        doubleValueAttribute(7.).toBuilder().id("site:s1-2:toSite:period:2023").build()
                    )
                );

            CalculationResult calc = doCalculateAttribute("site:s1:toSum:period:2023", childrenSumConfig("toSite"));
            assertThat(calc.getResultValue().getValue()).isEqualTo(12.);
            assertThat(calc.getImpacterIds()).containsExactlyInAnyOrder("site:s1-1:toSite:period:2023", "site:s1-2:toSite:period:2023");
        }

        @Test
        @SneakyThrows
        public void childrenSumOperation_dirtyValue() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toSum:period:2023", "toSite", COCA))
                .thenReturn(List.of(doubleValueAttribute(5.), dirtyValue()));

            assertThrows(IsDirtyValueException.class, () -> doCalculateAttribute("site:s1:toSum:period:2023", childrenSumConfig("toSite")));
        }
    }

    @Nested
    class ConsoSumOperation {

        @Test
        @SneakyThrows
        public void consoSumOperation_happyflow() {
            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumConfig("toSite"));
            assertThat(calc.getResultValue().getValue()).isEqualTo(12.);
            assertThat(calc.getImpacterIds()).containsExactlyInAnyOrder("site:s1-1:toSite:period:2023", "site:s1-2:toSite:period:2023");
        }
    }

    @Nested
    class IfThenElse {

        @Test
        @SneakyThrows
        public void ifThenElse() {
            CalculationResult calc = doCalculateAttribute(
                "site:s2:toTra:period:2023",
                ifThenElseConfig(
                    List.of(ifThen(constant(BOOLEAN, false), constant(DOUBLE, 2.8)), ifThen(constant(BOOLEAN, true), refOp("k1"))),
                    constant(DOUBLE, 3.5)
                )
            );

            assertThat(calc.getResultValue()).isInstanceOf(NotResolvableValue.class);
            assertThat(calc.getImpacterIds()).containsExactlyInAnyOrder("site:s2:k1:period:2023");
        }

        @Test
        @SneakyThrows
        public void ifThenElse_WithThen() {
            when(attributeService.findByIdAndOrgaId("site:s2:ifCond1False:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().attributeValue(BooleanValue.builder().value(false).build()).build()));
            when(attributeService.findByIdAndOrgaId("site:s2:ifCond2True:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().attributeValue(BooleanValue.builder().value(true).build()).build()));

            CalculationResult calc = doCalculateAttribute(
                "site:s2:toTra:period:2023",
                ifThenElseConfig(
                    List.of(
                        ifThen(constant(BOOLEAN, false), constant(DOUBLE, 2.8)),
                        ifThen(refOp("ifCond1False"), refOp("thenCond1")),
                        ifThen(refOp("ifCond2True"), refOp("thenCond2"))
                    ),
                    constant(DOUBLE, 3.5)
                )
            );

            assertThat(calc.getSuccess()).isTrue();
            assertThat(calc.getResultValue()).isInstanceOf(NotResolvableValue.class);
            assertThat(calc.getImpacterIds())
                .containsExactlyInAnyOrder(
                    "site:s2:ifCond1False:period:2023",
                    "site:s2:ifCond2True:period:2023",
                    "site:s2:thenCond2:period:2023"
                );
        }

        @Test
        @SneakyThrows
        public void ifThenElse_WithElse() {
            when(attributeService.findByIdAndOrgaId("site:s2:ifCond1False:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().attributeValue(BooleanValue.builder().value(false).build()).build()));
            when(attributeService.findByIdAndOrgaId("site:s2:elseCond:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().attributeValue(DoubleValue.builder().value(2.4).build()).build()));
            CalculationResult calc = doCalculateAttribute(
                "site:s2:toTra:period:2023",
                ifThenElseConfig(List.of(ifThen(refOp("ifCond1False"), refOp("thenCond1"))), refOp("elseCond"))
            );
            assertThat(calc.getSuccess()).isTrue();
            assertThat(calc.getResultValue()).isInstanceOf(DoubleValue.class);
            assertThat(calc.getResultValue().getValue()).isEqualTo(2.4);
            assertThat(calc.getImpacterIds()).containsExactlyInAnyOrder("site:s2:ifCond1False:period:2023", "site:s2:elseCond:period:2023");
        }

        @SneakyThrows
        @Test
        public void ifThenElse_WithIfDirty() {
            when(attributeService.findByIdAndOrgaId("site:s2:ifCond1False:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().dirty(true).build()));
            assertThrows(
                IsDirtyValueException.class,
                () ->
                    doCalculateAttribute(
                        "site:s2:toTra:period:2023",
                        ifThenElseConfig(
                            List.of(
                                ifThen(constant(BOOLEAN, false), constant(DOUBLE, 2.8)),
                                ifThen(refOp("ifCond1False"), refOp("thenCond1"))
                            ),
                            constant(DOUBLE, 3.5)
                        )
                    )
            );
        }

        @Test
        public void ifThenElse_WithThenDirty() {
            when(attributeService.findByIdAndOrgaId("site:s2:ifCond1False:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().attributeValue(BooleanValue.builder().value(false).build()).build()));
            when(attributeService.findByIdAndOrgaId("site:s2:elseCond:period:2023", COCA))
                .thenReturn(Optional.of(Attribute.builder().dirty(true).build()));
            assertThrows(
                IsDirtyValueException.class,
                () ->
                    doCalculateAttribute(
                        "site:s2:toTra:period:2023",
                        ifThenElseConfig(
                            List.of(
                                ifThen(constant(BOOLEAN, false), constant(DOUBLE, 2.8)),
                                ifThen(refOp("ifCond1False"), refOp("thenCond1"))
                            ),
                            refOp("elseCond")
                        )
                    )
            );
        }
    }

    private CalculationResult doCalculateAttribute(String attId, AttributeConfig config) throws IsDirtyValueException {
        return calculatorService.calculateAttribute(COCA, Attribute.builder().id(attId).build(), new HashSet<>(), config);
    }
}
