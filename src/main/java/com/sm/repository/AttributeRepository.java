package com.sm.repository;

import com.sm.domain.attribute.Attribute;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Attribute entity.
 */
@Repository
public interface AttributeRepository extends MongoRepository<Attribute, String> {
    @Query("{}")
    Page<Attribute> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Attribute> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Attribute> findOneWithEagerRelationships(String id);

    @Query("{'id': ?0}")
    Optional<Attribute> findByAttributeId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByAttributeId(String id);

    List<Attribute> findByOrgaId(String orgaId);

    List<Attribute> findByIdAndOrgaId(String id, String orgaId);

    List<Attribute> findByDirtyAndOrgaId(Boolean dirty, String orgaId);
}
