package com.sm.service;

import static com.sm.domain.attribute.AggInfo.AttributeType.BOOLEAN;
import static com.sm.domain.attribute.AggInfo.AttributeType.COMPO;
import static com.sm.domain.attribute.AggInfo.AttributeType.COST_TYPE;
import static com.sm.domain.attribute.AggInfo.AttributeType.DOUBLE;
import static com.sm.domain.attribute.AggInfo.AttributeType.LONG;
import static com.sm.domain.attribute.Unit.kg;
import static com.sm.domain.attribute.Unit.kgCo2;
import static com.sm.domain.attribute.Unit.kgNox;
import static com.sm.domain.attribute.Unit.kj;
import static com.sm.domain.attribute.Unit.mj;
import static com.sm.domain.attribute.Unit.tCo2;
import static com.sm.domain.attribute.Unit.tNox;
import static com.sm.domain.attribute.Unit.to;
import static com.sm.domain.operation.TagOperationType.CONTAINS;
import static com.sm.service.ComputeTestUtils.childrenSumConfig;
import static com.sm.service.ComputeTestUtils.consoSumBykeyConfig;
import static com.sm.service.ComputeTestUtils.consoSumConfig;
import static com.sm.service.ComputeTestUtils.constant;
import static com.sm.service.ComputeTestUtils.costConfig;
import static com.sm.service.ComputeTestUtils.dirtyValue;
import static com.sm.service.ComputeTestUtils.doubleValueAttribute;
import static com.sm.service.ComputeTestUtils.ifThen;
import static com.sm.service.ComputeTestUtils.ifThenElseConfig;
import static com.sm.service.ComputeTestUtils.refOp;
import static com.sm.service.ComputeTestUtils.sumConfig;
import static com.sm.service.ComputeTestUtils.sumCostRefConfig;
import static com.sm.service.ConsoCalculator.VALUE_TO_CONSOLIDATE_IS_NULL_OR_NOT_RESOLVABLE;
import static com.sm.service.InitialLoadService.COCA;
import static com.sm.service.UtilsValue.CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE;
import static com.sm.service.UtilsValue.ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR;
import static com.sm.service.UtilsValue.generateErrorValue;
import static com.sm.service.UtilsValue.generateNotResolvableValue;
import static java.util.Optional.of;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.sm.domain.AttributeConfig;
import com.sm.domain.Tag;
import com.sm.domain.attribute.*;
import com.sm.domain.operation.ConstantOperation;
import com.sm.domain.operation.TagOperation;
import com.sm.service.mapper.AttributeValueMapper;
import java.util.*;
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

            assertAttValueIsLike(calc, 35., DoubleValue.class, null);
            assertThat(calc.getImpacterIds()).isEmpty();

            CalculationResult calc2 = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(DOUBLE, 20.), constant(LONG, 14l))
            );

            assertAttValueIsLike(calc2, 34., DoubleValue.class, null);
            assertThat(calc2.getImpacterIds()).isEmpty();

            CalculationResult calc3 = doCalculateAttribute(
                "site:s1:toSum:period:2023",
                sumConfig(constant(BOOLEAN, true), constant(LONG, 10l), constant(BOOLEAN, false))
            );

            assertAttValueIsLike(calc3, 11., DoubleValue.class, null);
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

            assertAttValueIsLike(calc4, 14.2, DoubleValue.class, null);
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
            assertAttValueIsLike(calc, 12., DoubleValue.class, null);
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
    class ConsoSumByKeyOperation {

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_happyflow() {
            givenSomeChildrenValues();

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(Optional.of(doubleValueAttribute(2.).toBuilder().id("site:s1:toSite:period:2023").build()));

            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumBykeyConfig("toSite"));
            assertAttValueIsLike(
                calc,
                14.,
                DoubleValue.class,
                AggInfo.builder().withValues(6).notResolvables(List.of("nr1", "nr2", "nr3")).errors(List.of("err1", "err2", "err3")).build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_toSiteIsInError() {
            givenSomeChildrenValues();

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(
                    of(
                        Attribute
                            .builder()
                            .attributeValue(UtilsValue.generateErrorValue("errToSite"))
                            .id("site:s1:toSite:period:2023")
                            .build()
                    )
                );

            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumBykeyConfig("toSite"));
            assertAttValueIsLike(
                calc,
                ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR,
                ErrorValue.class,
                AggInfo
                    .builder()
                    .withValues(5)
                    .notResolvables(List.of("nr1", "nr2", "nr3"))
                    .errors(List.of("site:s1:toConso:period:2023", "err1", "err2", "err3"))
                    .build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_toSiteIsNotResolvable() {
            givenSomeChildrenValues();

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(
                    of(
                        Attribute
                            .builder()
                            .attributeValue(UtilsValue.generateNotResolvableValue("nrToSite"))
                            .id("site:s1:toSite:period:2023")
                            .build()
                    )
                );

            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumBykeyConfig("toSite"));
            assertAttValueIsLike(
                calc,
                VALUE_TO_CONSOLIDATE_IS_NULL_OR_NOT_RESOLVABLE,
                NotResolvableValue.class,
                AggInfo
                    .builder()
                    .withValues(5)
                    .notResolvables(List.of("site:s1:toConso:period:2023", "nr1", "nr2", "nr3"))
                    .errors(List.of("err1", "err2", "err3"))
                    .build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_toSiteIsNotResolvable_withDefaultValueForNotResolvable() {
            givenSomeChildrenValues();

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(
                    of(
                        Attribute
                            .builder()
                            .attributeValue(UtilsValue.generateNotResolvableValue("nrToSite"))
                            .id("site:s1:toSite:period:2023")
                            .build()
                    )
                );

            CalculationResult calc = doCalculateAttribute(
                "site:s1:toConso:period:2023",
                consoSumBykeyConfig("toSite").toBuilder().defaultValueForNotResolvableItem(0.).build()
            );
            assertAttValueIsLike(
                calc,
                12.,
                DoubleValue.class,
                AggInfo
                    .builder()
                    .withValues(5)
                    .notResolvables(List.of("site:s1:toConso:period:2023", "nr1", "nr2", "nr3"))
                    .errors(List.of("err1", "err2", "err3"))
                    .build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_oneChildrenValueIsInError() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toConso:period:2023", "toConso", COCA))
                .thenReturn(
                    List.of(
                        doubleValueAttribute(5.)
                            .toBuilder()
                            .id("site:s1-1:toConso:period:2023")
                            .aggInfo(AggInfo.builder().withValues(3).errors(List.of("err1")).notResolvables(List.of("nr1", "nr2")).build())
                            .build(),
                        Attribute
                            .builder()
                            .id("site:s1-2:toConso:period:2023")
                            .attributeValue(generateErrorValue("err4"))
                            .aggInfo(AggInfo.builder().withValues(2).errors(List.of("err2", "err3")).notResolvables(List.of("nr3")).build())
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(Optional.of(doubleValueAttribute(2.).toBuilder().id("site:s1:toSite:period:2023").build()));

            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumBykeyConfig("toSite"));
            assertAttValueIsLike(
                calc,
                ERROR_CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_IN_ERROR,
                ErrorValue.class,
                AggInfo.builder().withValues(6).notResolvables(List.of("nr1", "nr2", "nr3")).errors(List.of("err1", "err2", "err3")).build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_oneChildrenValueIsNotResolvable() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toConso:period:2023", "toConso", COCA))
                .thenReturn(
                    List.of(
                        doubleValueAttribute(5.)
                            .toBuilder()
                            .id("site:s1-1:toConso:period:2023")
                            .aggInfo(AggInfo.builder().withValues(3).errors(List.of("err1")).notResolvables(List.of("nr1", "nr2")).build())
                            .build(),
                        Attribute
                            .builder()
                            .id("site:s1-2:toConso:period:2023")
                            .attributeValue(generateNotResolvableValue("nr4"))
                            .aggInfo(AggInfo.builder().withValues(2).errors(List.of("err2", "err3")).notResolvables(List.of("nr3")).build())
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(Optional.of(doubleValueAttribute(2.).toBuilder().id("site:s1:toSite:period:2023").build()));

            CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumBykeyConfig("toSite"));
            assertAttValueIsLike(
                calc,
                CANNOT_DO_MULTI_OP_OF_DOUBLES_AT_LEAST_ONE_ITEM_IS_NOT_RESOLVABLE,
                NotResolvableValue.class,
                AggInfo.builder().withValues(6).notResolvables(List.of("nr1", "nr2", "nr3")).errors(List.of("err1", "err2", "err3")).build()
            );
            assertImpactersAreOk(calc);
        }

        @Test
        @SneakyThrows
        public void consoSumByKeyOperation_oneChildrenValueIsNotResolvable_withDefaultValueForNotResolvable() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toConso:period:2023", "toConso", COCA))
                .thenReturn(
                    List.of(
                        doubleValueAttribute(5.)
                            .toBuilder()
                            .id("site:s1-1:toConso:period:2023")
                            .aggInfo(AggInfo.builder().withValues(3).errors(List.of("err1")).notResolvables(List.of("nr1", "nr2")).build())
                            .build(),
                        Attribute
                            .builder()
                            .id("site:s1-2:toConso:period:2023")
                            .attributeValue(generateNotResolvableValue("nr4"))
                            .aggInfo(AggInfo.builder().withValues(2).errors(List.of("err2", "err3")).notResolvables(List.of("nr3")).build())
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                .thenReturn(Optional.of(doubleValueAttribute(2.).toBuilder().id("site:s1:toSite:period:2023").build()));

            CalculationResult calc = doCalculateAttribute(
                "site:s1:toConso:period:2023",
                consoSumBykeyConfig("toSite").toBuilder().defaultValueForNotResolvableItem(0.).build()
            );
            assertAttValueIsLike(
                calc,
                7.,
                DoubleValue.class,
                AggInfo.builder().withValues(6).notResolvables(List.of("nr1", "nr2", "nr3")).errors(List.of("err1", "err2", "err3")).build()
            );
            assertImpactersAreOk(calc);
        }

        @Nested
        class ConsoSumOperation {

            @Test
            @SneakyThrows
            public void consoSumOperation_happyflow() {
                givenSomeChildrenValues();

                when(attributeService.findByIdAndOrgaId("site:s1:toSite:period:2023", COCA))
                    .thenReturn(Optional.of(doubleValueAttribute(2.).toBuilder().id("site:s1:toSite:period:2023").build()));

                CalculationResult calc = doCalculateAttribute("site:s1:toConso:period:2023", consoSumConfig(refOp("toSite")));
                assertAttValueIsLike(
                    calc,
                    14.,
                    DoubleValue.class,
                    AggInfo
                        .builder()
                        .withValues(6)
                        .notResolvables(List.of("nr1", "nr2", "nr3"))
                        .errors(List.of("err1", "err2", "err3"))
                        .build()
                );
                assertImpactersAreOk(calc);
            }
        }

        private void assertImpactersAreOk(CalculationResult calc) {
            assertThat(calc.getImpacterIds())
                .containsExactlyInAnyOrder("site:s1:toSite:period:2023", "site:s1-1:toConso:period:2023", "site:s1-2:toConso:period:2023");
        }

        private void givenSomeChildrenValues() {
            when(attributeService.getAttributesForSiteChildrenAndConfig("site:s1:toConso:period:2023", "toConso", COCA))
                .thenReturn(
                    List.of(
                        doubleValueAttribute(5.)
                            .toBuilder()
                            .id("site:s1-1:toConso:period:2023")
                            .aggInfo(AggInfo.builder().withValues(3).errors(List.of("err1")).notResolvables(List.of("nr1", "nr2")).build())
                            .build(),
                        doubleValueAttribute(7.)
                            .toBuilder()
                            .id("site:s1-2:toConso:period:2023")
                            .aggInfo(AggInfo.builder().withValues(2).errors(List.of("err2", "err3")).notResolvables(List.of("nr3")).build())
                            .build()
                    )
                );
        }
    }

    private void assertAttValueIsLike(CalculationResult calc, Object v, Class calcClass, AggInfo info) {
        assertThat(calc.getResultValue().getValue()).isEqualTo(v);
        assertThat(calc.getResultValue().getClass()).isEqualTo(calcClass);
        if (info != null) {
            assertThat(calc.getAggInfo().getWithValues()).isEqualTo(info.getWithValues());
            assertThat(calc.getAggInfo().getErrors()).containsExactlyElementsOf(info.getErrors());
            assertThat(calc.getAggInfo().getNotResolvables()).containsExactlyElementsOf(info.getNotResolvables());
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

    @Nested
    class CostValueOp {

        @Test
        @SneakyThrows
        public void costValue() {
            when(attributeService.findByIdAndOrgaId("site:r1:coutEnv:period:2023", COCA))
                .thenReturn(
                    Optional.of(
                        Attribute
                            .builder()
                            .attributeValue(
                                UnitCostValue
                                    .builder()
                                    .value(
                                        Map.of(
                                            "co2",
                                            UnitCostLine.builder().cost(12.).costUnit(tCo2).resourceUnit(to).build(),
                                            "nox",
                                            UnitCostLine.builder().cost(15000.).costUnit(kgNox).resourceUnit(to).build(),
                                            "ene",
                                            UnitCostLine.builder().cost(8.).costUnit(kj).resourceUnit(to).build()
                                        )
                                    )
                                    .build()
                            )
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:r2:coutEnv:period:2023", COCA))
                .thenReturn(
                    Optional.of(
                        Attribute
                            .builder()
                            .attributeValue(
                                UnitCostValue
                                    .builder()
                                    .value(
                                        Map.of(
                                            "co2",
                                            UnitCostLine.builder().cost(10000.).costUnit(kgCo2).resourceUnit(to).build(),
                                            "nox",
                                            UnitCostLine.builder().cost(0.025).costUnit(tNox).resourceUnit(kg).build(),
                                            "ene",
                                            UnitCostLine.builder().cost(.001).costUnit(mj).resourceUnit(to).build()
                                        )
                                    )
                                    .build()
                            )
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:r:comp:period:2023", COCA))
                .thenReturn(
                    Optional.of(
                        Attribute
                            .builder()
                            .attributeValue(
                                CompoValue
                                    .builder()
                                    .value(
                                        List.of(
                                            CompoLine.builder().resourceId("r1").quantity(2.).unit(kg).build(),
                                            CompoLine.builder().resourceId("r2").quantity(0.003).unit(to).build()
                                        )
                                    )
                                    .build()
                            )
                            .build()
                    )
                );

            CalculationResult calc = doCalculateAttribute(
                "site:r:refCost:period:2023",
                costConfig(refOp("comp"), "coutEnv", Map.of("nox", kgNox, "co2", tCo2, "ene", Unit.j))
            );

            assertThat(calc.getResultValue()).isInstanceOf(CostValue.class);
            CostValue cv = (CostValue) calc.getResultValue();
            assertCostLineValue(cv, "co2", 0.054, tCo2);
            assertCostLineValue(cv, "nox", 105., kgNox);
            assertCostLineValue(cv, "ene", 19., Unit.j);
        }

        @Test
        @SneakyThrows
        public void sumCostRefValue() {
            CalculationResult calc = doCalculateAttribute(
                "site:r:refCost:period:2023",
                sumCostRefConfig(
                    "coutEnv",
                    Map.of("nox", kgNox, "co2", tCo2, "ene", Unit.j),
                    ConstantOperation
                        .builder()
                        .constantType(COST_TYPE)
                        .costValue(
                            CostValue
                                .builder()
                                .value(
                                    Map.of(
                                        "co2",
                                        CostLine.builder().unit(tCo2).quantity(2.).build(),
                                        "nox",
                                        CostLine.builder().unit(tNox).quantity(3.).build(),
                                        "ene",
                                        CostLine.builder().unit(mj).quantity(0.004).build()
                                    )
                                )
                                .build()
                        )
                        .build(),
                    ConstantOperation
                        .builder()
                        .constantType(COST_TYPE)
                        .costValue(
                            CostValue
                                .builder()
                                .value(
                                    Map.of(
                                        "co2",
                                        CostLine.builder().unit(tCo2).quantity(3.).build(),
                                        "nox",
                                        CostLine.builder().unit(kgNox).quantity(8000.).build(),
                                        "ene",
                                        CostLine.builder().unit(kj).quantity(11.).build()
                                    )
                                )
                                .build()
                        )
                        .build()
                )
            );

            assertThat(calc.getResultValue()).isInstanceOf(CostValue.class);
            CostValue cv = (CostValue) calc.getResultValue();
            assertCostLineValue(cv, "co2", 5., tCo2);
            assertCostLineValue(cv, "nox", 11000., kgNox);
            assertCostLineValue(cv, "ene", 15000., Unit.j);
        }

        @Test
        @SneakyThrows
        public void costValueWithCostConstAndCompoConst() {
            when(attributeService.findByIdAndOrgaId("site:r1:coutEnv:period:2023", COCA))
                .thenReturn(
                    Optional.of(
                        Attribute
                            .builder()
                            .attributeValue(
                                UnitCostValue
                                    .builder()
                                    .value(
                                        Map.of(
                                            "co2",
                                            UnitCostLine.builder().cost(12.).costUnit(tCo2).resourceUnit(to).build(),
                                            "nox",
                                            UnitCostLine.builder().cost(15000.).costUnit(kgNox).resourceUnit(to).build(),
                                            "ene",
                                            UnitCostLine.builder().cost(8.).costUnit(kj).resourceUnit(to).build()
                                        )
                                    )
                                    .build()
                            )
                            .build()
                    )
                );

            when(attributeService.findByIdAndOrgaId("site:r2:coutEnv:period:2023", COCA))
                .thenReturn(
                    Optional.of(
                        Attribute
                            .builder()
                            .attributeValue(
                                UnitCostValue
                                    .builder()
                                    .value(
                                        Map.of(
                                            "co2",
                                            UnitCostLine.builder().cost(10000.).costUnit(kgCo2).resourceUnit(to).build(),
                                            "nox",
                                            UnitCostLine.builder().cost(0.025).costUnit(tNox).resourceUnit(kg).build(),
                                            "ene",
                                            UnitCostLine.builder().cost(.001).costUnit(mj).resourceUnit(to).build()
                                        )
                                    )
                                    .build()
                            )
                            .build()
                    )
                );

            CalculationResult calc = doCalculateAttribute(
                "site:r:refCost:period:2023",
                sumCostRefConfig(
                    "coutEnv",
                    Map.of("nox", kgNox, "co2", tCo2, "ene", Unit.j),
                    ConstantOperation
                        .builder()
                        .constantType(COST_TYPE)
                        .costValue(
                            CostValue
                                .builder()
                                .value(
                                    Map.of(
                                        "co2",
                                        CostLine.builder().unit(tCo2).quantity(2.).build(),
                                        "nox",
                                        CostLine.builder().unit(tNox).quantity(3.).build(),
                                        "ene",
                                        CostLine.builder().unit(mj).quantity(0.004).build()
                                    )
                                )
                                .build()
                        )
                        .build(),
                    ConstantOperation
                        .builder()
                        .constantType(COST_TYPE)
                        .costValue(
                            CostValue
                                .builder()
                                .value(
                                    Map.of(
                                        "co2",
                                        CostLine.builder().unit(tCo2).quantity(3.).build(),
                                        "nox",
                                        CostLine.builder().unit(kgNox).quantity(8000.).build(),
                                        "ene",
                                        CostLine.builder().unit(kj).quantity(11.).build()
                                    )
                                )
                                .build()
                        )
                        .build(),
                    ConstantOperation
                        .builder()
                        .constantType(COMPO)
                        .compoValue(
                            CompoValue
                                .builder()
                                .value(
                                    List.of(
                                        CompoLine.builder().resourceId("r1").quantity(2.).unit(kg).build(),
                                        CompoLine.builder().resourceId("r2").quantity(0.003).unit(to).build()
                                    )
                                )
                                .build()
                        )
                        .build()
                )
            );

            assertThat(calc.getResultValue()).isInstanceOf(CostValue.class);
            CostValue cv = (CostValue) calc.getResultValue();
            assertCostLineValue(cv, "co2", 5.054, tCo2);
            assertCostLineValue(cv, "nox", 11105., kgNox);
            assertCostLineValue(cv, "ene", 15019., Unit.j);
        }
    }

    private void assertCostLineValue(CostValue cv, String key, double v, Unit unit) {
        assertThat(cv.getValue().get(key).getQuantity()).isEqualTo(v);
        assertThat(cv.getValue().get(key).getUnit()).isEqualTo(unit);
    }

    private CalculationResult doCalculateAttribute(String attId, AttributeConfig config) throws IsDirtyValueException {
        AttributeKeyAsObj obj = AttributeKeyUtils.fromString(attId);
        return calculatorService.calculateAttribute(
            COCA,
            Attribute.builder().id(attId).build(),
            new HashSet<>(),
            config.toBuilder().key(obj.getAttributeId()).build()
        );
    }
}
