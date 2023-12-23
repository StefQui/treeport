package com.sm.repository;

import com.sm.domain.Tag;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Tag entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagRepository extends MongoRepository<Tag, String> {
    @Query("{'id': ?0}")
    Optional<Tag> findByTagId(String id);

    @Query(value = "{'id': ?0}", delete = true)
    void deleteByTagId(String id);
}
