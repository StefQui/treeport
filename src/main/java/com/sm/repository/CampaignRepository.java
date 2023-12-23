package com.sm.repository;

import com.sm.domain.Campaign;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Campaign entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {
    @Query("{'id': ?0}")
    Optional<Campaign> findByCampaignId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByCampaignId(String id);
}
