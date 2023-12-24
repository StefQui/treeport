package com.sm.repository;

import com.sm.domain.Asset;
import com.sm.domain.Site;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Asset entity.
 */
@Repository
public interface AssetRepository extends MongoRepository<Asset, String> {
    Page<Asset> findAll(Pageable pageable);

    @Query("{ 'type' : ?0 }")
    Page<Asset> findAssetsByType(String type, Pageable pageable);

    List<Asset> findAll();

    Optional<Asset> getById(String id);

    @Query("{'id': ?0}")
    Optional<Asset> findByAssetId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByAssetId(String id);

    List<Site> findByAssetTypeAndOrgaIdAndParentId(String assetType, String orgaId, String parentId);

    List<Site> findByAssetTypeAndIdAndOrgaId(String assetType, String id, String orgaId);
}
