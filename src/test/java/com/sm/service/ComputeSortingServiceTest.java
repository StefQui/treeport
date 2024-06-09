package com.sm.service;

import static com.sm.service.ComputeSortingService.sortImpacteds;

import com.sm.domain.attribute.Attribute;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class ComputeSortingServiceTest {

    Attribute a1 = Attribute.builder().id("a1").impacterIds(Set.of("a1-1", "a1-2")).build();
    Attribute a1_1 = Attribute.builder().id("a1-1").impacterIds(Set.of("a1-1-1", "a1-1-2")).build();
    Attribute a1_1_2 = Attribute.builder().id("a1-1-2").impacterIds(Set.of()).build();
    Attribute a1_2 = Attribute.builder().id("a1-2").impacterIds(Set.of("a1-2-1", "a1-2-2")).build();

    @Test
    public void testSorted() {
        assertThatOrderIsCorrect(sortImpacteds(new HashSet<>(Set.of(a1, a1_1, a1_1_2, a1_2))));
        assertThatOrderIsCorrect(sortImpacteds(new HashSet<>(Set.of(a1_1_2, a1_1, a1_2, a1))));
        assertThatOrderIsCorrect(sortImpacteds(new HashSet<>(Set.of(a1_2, a1_1, a1, a1_1_2))));
        assertThatOrderIsCorrect(sortImpacteds(new HashSet<>(Set.of(a1, a1_1_2, a1_2, a1_1))));
        assertThatOrderIsCorrect(sortImpacteds(new HashSet<>(Set.of(a1_1, a1_2, a1, a1_1_2))));
    }

    @Test
    public void testEmptySorted() {
        List<Attribute> sorted = sortImpacteds(new HashSet<>());
        Assertions.assertThat(sorted.size()).isEqualTo(0);
    }

    private void assertThatOrderIsCorrect(List<Attribute> sorted) {
        Assertions.assertThat(sorted.size()).isEqualTo(4);
        Assertions.assertThat(sorted.get(2).getId()).isEqualTo(a1_1.getId());
        Assertions.assertThat(sorted.get(3).getId()).isEqualTo(a1.getId());
    }
}
