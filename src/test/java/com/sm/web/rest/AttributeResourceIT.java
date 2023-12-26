package com.sm.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sm.IntegrationTest;
import com.sm.domain.attribute.Attribute;
import com.sm.repository.AttributeRepository;
import com.sm.service.AttributeService;
import com.sm.service.dto.attribute.AttributeDTO;
import com.sm.service.mapper.AttributeMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link AttributeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AttributeResourceIT {

    private static final Boolean DEFAULT_IS_AGG = false;
    private static final Boolean UPDATED_IS_AGG = true;

    private static final Boolean DEFAULT_HAS_CONFIG_ERROR = false;
    private static final Boolean UPDATED_HAS_CONFIG_ERROR = true;

    private static final String DEFAULT_CONFIG_ERROR = "AAAAAAAAAA";
    private static final String UPDATED_CONFIG_ERROR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/attributes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private AttributeRepository attributeRepository;

    @Mock
    private AttributeRepository attributeRepositoryMock;

    @Autowired
    private AttributeMapper attributeMapper;

    @Mock
    private AttributeService attributeServiceMock;

    @Autowired
    private MockMvc restAttributeMockMvc;

    private Attribute attribute;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attribute createEntity() {
        Attribute attribute = new Attribute()
            .isAgg(DEFAULT_IS_AGG)
            .hasConfigError(DEFAULT_HAS_CONFIG_ERROR)
            .configError(DEFAULT_CONFIG_ERROR);
        return attribute;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attribute createUpdatedEntity() {
        Attribute attribute = new Attribute()
            .isAgg(UPDATED_IS_AGG)
            .hasConfigError(UPDATED_HAS_CONFIG_ERROR)
            .configError(UPDATED_CONFIG_ERROR);
        return attribute;
    }

    @BeforeEach
    public void initTest() {
        attributeRepository.deleteAll();
        attribute = createEntity();
    }

    @Test
    void createAttribute() throws Exception {
        int databaseSizeBeforeCreate = attributeRepository.findAll().size();
        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);
        restAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeDTO)))
            .andExpect(status().isCreated());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeCreate + 1);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getIsAgg()).isEqualTo(DEFAULT_IS_AGG);
        assertThat(testAttribute.getHasConfigError()).isEqualTo(DEFAULT_HAS_CONFIG_ERROR);
        assertThat(testAttribute.getConfigError()).isEqualTo(DEFAULT_CONFIG_ERROR);
    }

    @Test
    void createAttributeWithExistingId() throws Exception {
        // Create the Attribute with an existing ID
        attribute.setId("existing_id");
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        int databaseSizeBeforeCreate = attributeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAttributes() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        // Get all the attributeList
        restAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attribute.getId())))
            .andExpect(jsonPath("$.[*].isAgg").value(hasItem(DEFAULT_IS_AGG.booleanValue())))
            .andExpect(jsonPath("$.[*].hasConfigError").value(hasItem(DEFAULT_HAS_CONFIG_ERROR.booleanValue())))
            .andExpect(jsonPath("$.[*].configError").value(hasItem(DEFAULT_CONFIG_ERROR)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttributesWithEagerRelationshipsIsEnabled() throws Exception {
        when(attributeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttributeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(attributeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttributesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(attributeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttributeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(attributeRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getAttribute() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        // Get the attribute
        restAttributeMockMvc
            .perform(get(ENTITY_API_URL_ID, attribute.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attribute.getId()))
            .andExpect(jsonPath("$.isAgg").value(DEFAULT_IS_AGG.booleanValue()))
            .andExpect(jsonPath("$.hasConfigError").value(DEFAULT_HAS_CONFIG_ERROR.booleanValue()))
            .andExpect(jsonPath("$.configError").value(DEFAULT_CONFIG_ERROR));
    }

    @Test
    void getNonExistingAttribute() throws Exception {
        // Get the attribute
        restAttributeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingAttribute() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute
        Attribute updatedAttribute = attributeRepository.findById(attribute.getId()).orElseThrow();
        updatedAttribute.isAgg(UPDATED_IS_AGG).hasConfigError(UPDATED_HAS_CONFIG_ERROR).configError(UPDATED_CONFIG_ERROR);
        AttributeDTO attributeDTO = attributeMapper.toDto(updatedAttribute);

        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getIsAgg()).isEqualTo(UPDATED_IS_AGG);
        assertThat(testAttribute.getHasConfigError()).isEqualTo(UPDATED_HAS_CONFIG_ERROR);
        assertThat(testAttribute.getConfigError()).isEqualTo(UPDATED_CONFIG_ERROR);
    }

    @Test
    void putNonExistingAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAttributeWithPatch() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute using partial update
        Attribute partialUpdatedAttribute = new Attribute();
        partialUpdatedAttribute.setId(attribute.getId());

        partialUpdatedAttribute.configError(UPDATED_CONFIG_ERROR);

        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttribute))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getIsAgg()).isEqualTo(DEFAULT_IS_AGG);
        assertThat(testAttribute.getHasConfigError()).isEqualTo(DEFAULT_HAS_CONFIG_ERROR);
        assertThat(testAttribute.getConfigError()).isEqualTo(UPDATED_CONFIG_ERROR);
    }

    @Test
    void fullUpdateAttributeWithPatch() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute using partial update
        Attribute partialUpdatedAttribute = new Attribute();
        partialUpdatedAttribute.setId(attribute.getId());

        partialUpdatedAttribute.isAgg(UPDATED_IS_AGG).hasConfigError(UPDATED_HAS_CONFIG_ERROR).configError(UPDATED_CONFIG_ERROR);

        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttribute))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getIsAgg()).isEqualTo(UPDATED_IS_AGG);
        assertThat(testAttribute.getHasConfigError()).isEqualTo(UPDATED_HAS_CONFIG_ERROR);
        assertThat(testAttribute.getConfigError()).isEqualTo(UPDATED_CONFIG_ERROR);
    }

    @Test
    void patchNonExistingAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attributeDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID().toString());

        // Create the Attribute
        AttributeDTO attributeDTO = attributeMapper.toDto(attribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(attributeDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAttribute() throws Exception {
        // Initialize the database
        attributeRepository.save(attribute);

        int databaseSizeBeforeDelete = attributeRepository.findAll().size();

        // Delete the attribute
        restAttributeMockMvc
            .perform(delete(ENTITY_API_URL_ID, attribute.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
