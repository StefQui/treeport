package com.sm.service;

import com.sm.domain.Campaign;
import com.sm.repository.CampaignRepository;
import com.sm.service.dto.CampaignDTO;
import com.sm.service.mapper.CampaignMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.sm.domain.Campaign}.
 */
@Service
public class CampaignService {

    private final Logger log = LoggerFactory.getLogger(CampaignService.class);

    private final CampaignRepository campaignRepository;

    private final CampaignMapper campaignMapper;

    public CampaignService(CampaignRepository campaignRepository, CampaignMapper campaignMapper) {
        this.campaignRepository = campaignRepository;
        this.campaignMapper = campaignMapper;
    }

    /**
     * Save a campaign.
     *
     * @param campaignDTO the entity to save.
     * @return the persisted entity.
     */
    public CampaignDTO save(CampaignDTO campaignDTO) {
        log.debug("Request to save Campaign : {}", campaignDTO);
        Campaign campaign = campaignMapper.toEntity(campaignDTO);
        campaign = campaignRepository.save(campaign);
        return campaignMapper.toDto(campaign);
    }

    /**
     * Update a campaign.
     *
     * @param campaignDTO the entity to save.
     * @return the persisted entity.
     */
    public CampaignDTO update(CampaignDTO campaignDTO) {
        log.debug("Request to update Campaign : {}", campaignDTO);
        Campaign campaign = campaignMapper.toEntity(campaignDTO);
        Optional<Campaign> existing = campaignRepository.findByCampaignId(campaignDTO.getId());
        campaign.setObjectId(existing.get().getObjectId());
        campaign = campaignRepository.save(campaign);
        return campaignMapper.toDto(campaign);
    }

    /**
     * Partially update a campaign.
     *
     * @param campaignDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CampaignDTO> partialUpdate(CampaignDTO campaignDTO) {
        log.debug("Request to partially update Campaign : {}", campaignDTO);

        return campaignRepository
            .findById(campaignDTO.getId())
            .map(existingCampaign -> {
                campaignMapper.partialUpdate(existingCampaign, campaignDTO);

                return existingCampaign;
            })
            .map(campaignRepository::save)
            .map(campaignMapper::toDto);
    }

    /**
     * Get all the campaigns.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<CampaignDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Campaigns by page");
        return campaignRepository.findAll(pageable).map(campaignMapper::toDto);
    }

    public List<CampaignDTO> findAllCampaigns() {
        log.debug("Request to get all Campaigns");
        return campaignRepository.findAll().stream().map(campaignMapper::toDto).collect(Collectors.toList());
    }

    /**
     * Get one campaign by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<CampaignDTO> findById(String id) {
        log.debug("Request to get Campaign : {}", id);
        return campaignRepository.findByCampaignId(id).map(campaignMapper::toDto);
    }

    /**
     * Delete the campaign by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Campaign : {}", id);
        campaignRepository.deleteByCampaignId(id);
    }
}
