package com.sm.service;

import static com.sm.service.InitialLoadService.CAR;
import static com.sm.service.InitialLoadService.COCA;
import static com.sm.service.InitialLoadService.TRA;
import static org.assertj.core.api.Assertions.assertThat;

import com.sm.domain.Tag;
import com.sm.domain.attribute.Attribute;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

class ComputeServiceApplyCampaignTest extends AbstractComputeServiceTest {

    @Test
    public void testWithChildrenTagsOneOf() {
        //        loadAttributeConfig_TO_SITE();
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("toTra")
                .key("toTra")
                .configOrder(0)
                .childrenTagsOneOf(createTags(TRA))
                .campaignId("2023")
                .build()
        );
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("toCar")
                .key("toCar")
                .configOrder(0)
                .childrenTagsOneOf(createTags(CAR))
                .campaignId("2022")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2022", "2023"));
        assertThat(mapByConfigIdAndIds())
            .containsAllEntriesOf(
                Map.of(
                    "toTra",
                    Set.of("site:root:toTra:period:2023", "site:s2:toTra:period:2023", "site:s2-2:toTra:period:2023"),
                    "toCar",
                    Set.of(
                        "site:root:toCar:period:2022",
                        "site:s1-1:toCar:period:2022",
                        "site:s1:toCar:period:2022",
                        "site:s2:toCar:period:2022",
                        "site:s2-1:toCar:period:2022",
                        "site:s1-2:toCar:period:2022"
                    )
                )
            );
        //        computeService.reCalculateAllAttributes(COCA);
        //        this.setSomeValues();

    }

    @Test
    public void testWithParentSiteIds() {
        //        loadAttributeConfig_TO_SITE();
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .configOrder(0)
                .parentSiteIds(List.of("s1"))
                .campaignId("2023")
                .build()
        );
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to2")
                .key("to2")
                .configOrder(0)
                .parentSiteIds(List.of("root"))
                .campaignId("2022")
                .build()
        );
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to3")
                .key("to3")
                .configOrder(0)
                .parentSiteIds(List.of("s1", "s2"))
                .campaignId("2022")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2022", "2023"));
        assertThat(mapByConfigIdAndIds())
            .containsAllEntriesOf(
                Map.of(
                    "to1",
                    Set.of("site:s1:to1:period:2023", "site:s1-2:to1:period:2023", "site:s1-1:to1:period:2023"),
                    "to2",
                    Set.of(
                        "site:root:to2:period:2022",
                        "site:s1:to2:period:2022",
                        "site:s1-1:to2:period:2022",
                        "site:s1-2:to2:period:2022",
                        "site:s2:to2:period:2022",
                        "site:s2-1:to2:period:2022",
                        "site:s2-2:to2:period:2022"
                    ),
                    "to3",
                    Set.of(
                        "site:s1:to3:period:2022",
                        "site:s1-1:to3:period:2022",
                        "site:s1-2:to3:period:2022",
                        "site:s2:to3:period:2022",
                        "site:s2-1:to3:period:2022",
                        "site:s2-2:to3:period:2022"
                    )
                )
            );
    }

    @Test
    public void testWithSiteIds() {
        // we do a AND between parentSiteIds,siteIds,childrenTagsOneOf
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to1")
                .key("to1")
                .configOrder(0)
                .parentSiteIds(List.of("s1"))
                .siteIds(List.of("s2-1")) // Not in s1
                .campaignId("2023")
                .build()
        );
        attributeConfigService.save(
            notWritableAttributeConfigWithNoScope()
                .id("to2")
                .key("to2")
                .configOrder(0)
                .siteIds(List.of("s1", "s2-1"))
                .campaignId("2022")
                .build()
        );
        computeService.applyCampaigns(COCA, List.of("2022", "2023"));
        assertThat(mapByConfigIdAndIds())
            .containsAllEntriesOf(Map.of("to2", Set.of("site:s1:to2:period:2022", "site:s2-1:to2:period:2022")));
    }

    private Map<String, Set<String>> mapByConfigIdAndIds() {
        List<Attribute> allAtts = attributeService.findAllAttributes(COCA);
        Map<String, List<Attribute>> mapByConfigId = allAtts.stream().collect(Collectors.groupingBy(Attribute::getConfigId));
        return mapByConfigId
            .entrySet()
            .stream()
            .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue().stream().map(Attribute::getId).collect(Collectors.toSet())));
    }

    private List<Tag> createTags(String... tagIds) {
        return Arrays.stream(tagIds).map(tagId -> Tag.builder().id(tagId).build()).collect(Collectors.toList());
    }
}
