package com.sm.repository;

import com.sm.domain.Organisation;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Organisation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganisationRepository extends MongoRepository<Organisation, String> {
    @Query("{'id': ?0}")
    Optional<Organisation> findByOrganisationId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByOrganisationId(String id);
}
