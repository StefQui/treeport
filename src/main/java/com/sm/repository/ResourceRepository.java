package com.sm.repository;

import com.sm.domain.Resource;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Resource entity.
 */
@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    Page<Resource> findAll(Pageable pageable);

    @Query("{ 'type' : ?0 }")
    Page<Resource> findResourcesByType(String type, Pageable pageable);

    List<Resource> findAll();

    Optional<Resource> getById(String id);

    @Query("{'id': ?0}")
    Optional<Resource> findByResourceId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByResourceId(String id);

    List<Resource> findByOrgaIdAndParentId(String orgaId, String parentId);

    List<Resource> findByIdAndOrgaId(String id, String orgaId);
}
