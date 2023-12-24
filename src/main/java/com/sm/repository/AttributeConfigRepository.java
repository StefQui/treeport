package com.sm.repository;

import com.sm.domain.AttributeConfig;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the AttributeConfig entity.
 */
@Repository
public interface AttributeConfigRepository extends MongoRepository<AttributeConfig, String> {
    @Query("{}")
    Page<AttributeConfig> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<AttributeConfig> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<AttributeConfig> findOneWithEagerRelationships(String id);

    @Query("{'id': ?0}")
    Optional<AttributeConfig> findByAttributeConfigId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByAttributeConfigId(String id);

    List<AttributeConfig> findAllByOrgaId(String orgaId);

    Optional<AttributeConfig> findAllByOrgaIdAndId(String orgaId, String id);
}
