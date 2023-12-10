package com.sm.repository;

import com.sm.domain.Asset;
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

    List<Asset> findAll();

    Optional<Asset> getById(String id);
}
