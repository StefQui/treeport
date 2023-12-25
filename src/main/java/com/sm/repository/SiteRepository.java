package com.sm.repository;

import com.sm.domain.Site;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Site entity.
 */
@Repository
public interface SiteRepository extends MongoRepository<Site, String> {
    Page<Site> findAll(Pageable pageable);

    @Query("{ 'type' : ?0 }")
    Page<Site> findSitesByType(String type, Pageable pageable);

    List<Site> findAll();

    Optional<Site> getById(String id);

    @Query("{'id': ?0}")
    Optional<Site> findBySiteId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteBySiteId(String id);

    List<Site> findByOrgaIdAndParentId(String orgaId, String parentId);

    List<Site> findByIdAndOrgaId(String id, String orgaId);
}
