package com.sm.service;

import static com.sm.domain.enumeration.AssetType.SITE;

import com.sm.domain.Asset;
import com.sm.domain.Site;
import com.sm.repository.AssetRepository;
import com.sm.service.dto.AssetDTO;
import com.sm.service.mapper.AssetMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.sm.domain.Asset}.
 */
@Service
public class AssetService {

    private final Logger log = LoggerFactory.getLogger(AssetService.class);

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;
    SiteRepository siteRepository;
    ResourceRepository resourceRepository;

    public AssetService(AssetRepository assetRepository, AssetMapper assetMapper) {
        this.assetRepository = assetRepository;
        this.assetMapper = assetMapper;
    }

    /**
     * Save a asset.
     *
     * @param assetDTO the entity to save.
     * @return the persisted entity.
     */
    public AssetDTO save(AssetDTO assetDTO) {
        log.debug("Request to save Asset : {}", assetDTO);
        Asset asset = assetMapper.toEntity(assetDTO);
        asset = assetRepository.save(asset);
        return assetMapper.toDto(asset);
    }

    /**
     * Update a asset.
     *
     * @param assetDTO the entity to save.
     * @return the persisted entity.
     */
    public AssetDTO update(AssetDTO assetDTO) {
        log.debug("Request to update Asset : {}", assetDTO);
        Asset asset = assetMapper.toEntity(assetDTO);
        Optional<Asset> existing = assetRepository.findByAssetId(assetDTO.getId());
        asset.setObjectId(existing.get().getObjectId());
        asset = assetRepository.save(asset);
        return assetMapper.toDto(asset);
    }

    /**
     * Partially update a asset.
     *
     * @param assetDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AssetDTO> partialUpdate(AssetDTO assetDTO) {
        log.debug("Request to partially update Asset : {}", assetDTO);

        return assetRepository
            .findByAssetId(assetDTO.getId())
            .map(existingAsset -> {
                assetMapper.partialUpdate(existingAsset, assetDTO);

                return existingAsset;
            })
            .map(assetRepository::save)
            .map(assetMapper::toDto);
    }

    /**
     * Get all the assets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<AssetDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Assets");
        return assetRepository.findAll(pageable).map(assetMapper::toDto);
    }

    public Page<AssetDTO> findAllByType(String type, Pageable pageable) {
        log.debug("Request to get all Assets by type");
        return assetRepository.findAssetsByType(type, pageable).map(assetMapper::toDto);
    }

    public Optional<AssetDTO> findById(String id) {
        log.debug("Request to get Asset : {}", id);
        return assetRepository.findByAssetId(id).map(assetMapper::toDto);
    }

    /**
     * Delete the asset by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Asset : {}", id);
        Optional<Asset> existing = assetRepository.findByAssetId(id);
        assetRepository.deleteByAssetId(existing.get().getId());
    }

    public List<Site> findAllRootSites(String orgaId) {
        return assetRepository.findByAssetTypeAndOrgaIdAndParentId(SITE.name(), orgaId, null);
    }

    public List<Site> getChildren(Site site, String orgaId) {
        return site
            .getChildrenIds()
            .stream()
            .map(id -> this.getSiteById(id, orgaId).orElseThrow(() -> new RuntimeException("Children site not found!")))
            .collect(Collectors.toList());
    }

    private Optional<Site> getSiteById(String id, String orgaId) {
        List<Site> r = assetRepository.findByAssetTypeAndIdAndOrgaId(SITE.name(), id, orgaId);
        if (r.size() > 1) {
            throw new RuntimeException("pb 12345");
        }
        if (r.size() == 0) {
            return null;
        }
        return Optional.of(r.get(0));
    }
}
