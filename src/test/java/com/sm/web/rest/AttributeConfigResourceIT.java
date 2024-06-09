package com.sm.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sm.IntegrationTest;
import com.sm.domain.AttributeConfig;
import com.sm.domain.attribute.AggInfo;
import com.sm.domain.operation.OperationType;
import com.sm.repository.AttributeConfigRepository;
import com.sm.service.AttributeConfigService;
import com.sm.service.dto.AttributeConfigDTO;
import com.sm.service.mapper.AttributeConfigMapper;
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
 * Integration tests for the {@link AttributeConfigResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AttributeConfigResourceIT {

    private static final Boolean DEFAULT_APPLY_ON_CHILDREN = false;
    private static final Boolean UPDATED_APPLY_ON_CHILDREN = true;

    private static final Boolean DEFAULT_IS_CONSOLIDABLE = false;
    private static final Boolean UPDATED_IS_CONSOLIDABLE = true;

    private static final String DEFAULT_RELATED_CONFIG_ID = "AAAAAAAAAA";
    private static final String UPDATED_RELATED_CONFIG_ID = "BBBBBBBBBB";

    private static final AggInfo.AttributeType DEFAULT_ATTRIBUTE_TYPE = AggInfo.AttributeType.LONG;
    private static final AggInfo.AttributeType UPDATED_ATTRIBUTE_TYPE = AggInfo.AttributeType.BOOLEAN;

    private static final Boolean DEFAULT_IS_WRITABLE = false;
    private static final Boolean UPDATED_IS_WRITABLE = true;

    private static final String DEFAULT_CONSO_PARAMETER_KEY = "AAAAAAAAAA";
    private static final String UPDATED_CONSO_PARAMETER_KEY = "BBBBBBBBBB";

    private static final OperationType DEFAULT_CONSO_OPERATION_TYPE = OperationType.CHILDREN_SUM;
    private static final OperationType UPDATED_CONSO_OPERATION_TYPE = OperationType.CONSO_SUM;

    private static final String ENTITY_API_URL = "/api/attribute-configs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private AttributeConfigRepository attributeConfigRepository;

    @Mock
    private AttributeConfigRepository attributeConfigRepositoryMock;

    @Autowired
    private AttributeConfigMapper attributeConfigMapper;

    @Mock
    private AttributeConfigService attributeConfigServiceMock;

    @Autowired
    private MockMvc restAttributeConfigMockMvc;

    private AttributeConfig attributeConfig;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttributeConfig createEntity() {
        AttributeConfig attributeConfig = AttributeConfig
            .builder()
            .applyOnChildren(DEFAULT_APPLY_ON_CHILDREN)
            .isConsolidable(DEFAULT_IS_CONSOLIDABLE)
            .relatedConfigId(DEFAULT_RELATED_CONFIG_ID)
            .attributeType(DEFAULT_ATTRIBUTE_TYPE)
            .isWritable(DEFAULT_IS_WRITABLE)
            .consoParameterKey(DEFAULT_CONSO_PARAMETER_KEY)
            .consoOperationType(DEFAULT_CONSO_OPERATION_TYPE)
            .build();
        return attributeConfig;
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttributeConfig createUpdatedEntity() {
        AttributeConfig attributeConfig = AttributeConfig
            .builder()
            .applyOnChildren(UPDATED_APPLY_ON_CHILDREN)
            .isConsolidable(UPDATED_IS_CONSOLIDABLE)
            .relatedConfigId(UPDATED_RELATED_CONFIG_ID)
            .attributeType(UPDATED_ATTRIBUTE_TYPE)
            .isWritable(UPDATED_IS_WRITABLE)
            .consoParameterKey(UPDATED_CONSO_PARAMETER_KEY)
            .consoOperationType(UPDATED_CONSO_OPERATION_TYPE)
            .build();
        return attributeConfig;
    }

    @BeforeEach
    public void initTest() {
        attributeConfigRepository.deleteAll();
        attributeConfig = createEntity();
    }

    @Test
    void createAttributeConfig() throws Exception {
        int databaseSizeBeforeCreate = attributeConfigRepository.findAll().size();
        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);
        restAttributeConfigMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isCreated());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeCreate + 1);
        AttributeConfig testAttributeConfig = attributeConfigList.get(attributeConfigList.size() - 1);
        assertThat(testAttributeConfig.getApplyOnChildren()).isEqualTo(DEFAULT_APPLY_ON_CHILDREN);
        assertThat(testAttributeConfig.getIsConsolidable()).isEqualTo(DEFAULT_IS_CONSOLIDABLE);
        assertThat(testAttributeConfig.getRelatedConfigId()).isEqualTo(DEFAULT_RELATED_CONFIG_ID);
        assertThat(testAttributeConfig.getAttributeType()).isEqualTo(DEFAULT_ATTRIBUTE_TYPE);
        assertThat(testAttributeConfig.getIsWritable()).isEqualTo(DEFAULT_IS_WRITABLE);
        assertThat(testAttributeConfig.getConsoParameterKey()).isEqualTo(DEFAULT_CONSO_PARAMETER_KEY);
        assertThat(testAttributeConfig.getConsoOperationType()).isEqualTo(DEFAULT_CONSO_OPERATION_TYPE);
    }

    @Test
    void createAttributeConfigWithExistingId() throws Exception {
        // Create the AttributeConfig with an existing ID
        attributeConfig.setId("existing_id");
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        int databaseSizeBeforeCreate = attributeConfigRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttributeConfigMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAttributeConfigs() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        // Get all the attributeConfigList
        restAttributeConfigMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attributeConfig.getId())))
            .andExpect(jsonPath("$.[*].applyOnChildren").value(hasItem(DEFAULT_APPLY_ON_CHILDREN.booleanValue())))
            .andExpect(jsonPath("$.[*].isConsolidable").value(hasItem(DEFAULT_IS_CONSOLIDABLE.booleanValue())))
            .andExpect(jsonPath("$.[*].relatedConfigId").value(hasItem(DEFAULT_RELATED_CONFIG_ID)))
            .andExpect(jsonPath("$.[*].attributeType").value(hasItem(DEFAULT_ATTRIBUTE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].isWritable").value(hasItem(DEFAULT_IS_WRITABLE.booleanValue())))
            .andExpect(jsonPath("$.[*].consoParameterKey").value(hasItem(DEFAULT_CONSO_PARAMETER_KEY)))
            .andExpect(jsonPath("$.[*].consoOperationType").value(hasItem(DEFAULT_CONSO_OPERATION_TYPE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttributeConfigsWithEagerRelationshipsIsEnabled() throws Exception {
        when(attributeConfigServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttributeConfigMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(attributeConfigServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAttributeConfigsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(attributeConfigServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAttributeConfigMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(attributeConfigRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getAttributeConfig() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        // Get the attributeConfig
        restAttributeConfigMockMvc
            .perform(get(ENTITY_API_URL_ID, attributeConfig.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attributeConfig.getId()))
            .andExpect(jsonPath("$.applyOnChildren").value(DEFAULT_APPLY_ON_CHILDREN.booleanValue()))
            .andExpect(jsonPath("$.isConsolidable").value(DEFAULT_IS_CONSOLIDABLE.booleanValue()))
            .andExpect(jsonPath("$.relatedConfigId").value(DEFAULT_RELATED_CONFIG_ID))
            .andExpect(jsonPath("$.attributeType").value(DEFAULT_ATTRIBUTE_TYPE.toString()))
            .andExpect(jsonPath("$.isWritable").value(DEFAULT_IS_WRITABLE.booleanValue()))
            .andExpect(jsonPath("$.consoParameterKey").value(DEFAULT_CONSO_PARAMETER_KEY))
            .andExpect(jsonPath("$.consoOperationType").value(DEFAULT_CONSO_OPERATION_TYPE.toString()));
    }

    @Test
    void getNonExistingAttributeConfig() throws Exception {
        // Get the attributeConfig
        restAttributeConfigMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingAttributeConfig() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();

        // Update the attributeConfig
        AttributeConfig updatedAttributeConfig = attributeConfigRepository.findById(attributeConfig.getId()).orElseThrow();
        updatedAttributeConfig
            .toBuilder()
            .applyOnChildren(UPDATED_APPLY_ON_CHILDREN)
            .isConsolidable(UPDATED_IS_CONSOLIDABLE)
            .relatedConfigId(UPDATED_RELATED_CONFIG_ID)
            .attributeType(UPDATED_ATTRIBUTE_TYPE)
            .isWritable(UPDATED_IS_WRITABLE)
            .consoParameterKey(UPDATED_CONSO_PARAMETER_KEY)
            .consoOperationType(UPDATED_CONSO_OPERATION_TYPE);
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(updatedAttributeConfig);

        restAttributeConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeConfigDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isOk());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
        AttributeConfig testAttributeConfig = attributeConfigList.get(attributeConfigList.size() - 1);
        assertThat(testAttributeConfig.getApplyOnChildren()).isEqualTo(UPDATED_APPLY_ON_CHILDREN);
        assertThat(testAttributeConfig.getIsConsolidable()).isEqualTo(UPDATED_IS_CONSOLIDABLE);
        assertThat(testAttributeConfig.getRelatedConfigId()).isEqualTo(UPDATED_RELATED_CONFIG_ID);
        assertThat(testAttributeConfig.getAttributeType()).isEqualTo(UPDATED_ATTRIBUTE_TYPE);
        assertThat(testAttributeConfig.getIsWritable()).isEqualTo(UPDATED_IS_WRITABLE);
        assertThat(testAttributeConfig.getConsoParameterKey()).isEqualTo(UPDATED_CONSO_PARAMETER_KEY);
        assertThat(testAttributeConfig.getConsoOperationType()).isEqualTo(UPDATED_CONSO_OPERATION_TYPE);
    }

    @Test
    void putNonExistingAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeConfigDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAttributeConfigWithPatch() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();

        // Update the attributeConfig using partial update
        AttributeConfig partialUpdatedAttributeConfig = new AttributeConfig();
        partialUpdatedAttributeConfig.setId(attributeConfig.getId());

        //        partialUpdatedAttributeConfig
        //            .applyOnChildren(UPDATED_APPLY_ON_CHILDREN)
        //            .isConsolidable(UPDATED_IS_CONSOLIDABLE)
        //            .isWritable(UPDATED_IS_WRITABLE);

        restAttributeConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttributeConfig))
            )
            .andExpect(status().isOk());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
        AttributeConfig testAttributeConfig = attributeConfigList.get(attributeConfigList.size() - 1);
        assertThat(testAttributeConfig.getApplyOnChildren()).isEqualTo(UPDATED_APPLY_ON_CHILDREN);
        assertThat(testAttributeConfig.getIsConsolidable()).isEqualTo(UPDATED_IS_CONSOLIDABLE);
        assertThat(testAttributeConfig.getRelatedConfigId()).isEqualTo(DEFAULT_RELATED_CONFIG_ID);
        assertThat(testAttributeConfig.getAttributeType()).isEqualTo(DEFAULT_ATTRIBUTE_TYPE);
        assertThat(testAttributeConfig.getIsWritable()).isEqualTo(UPDATED_IS_WRITABLE);
        assertThat(testAttributeConfig.getConsoParameterKey()).isEqualTo(DEFAULT_CONSO_PARAMETER_KEY);
        assertThat(testAttributeConfig.getConsoOperationType()).isEqualTo(DEFAULT_CONSO_OPERATION_TYPE);
    }

    @Test
    void fullUpdateAttributeConfigWithPatch() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();

        // Update the attributeConfig using partial update
        AttributeConfig partialUpdatedAttributeConfig = new AttributeConfig();
        partialUpdatedAttributeConfig.setId(attributeConfig.getId());

        //        partialUpdatedAttributeConfig
        //            .applyOnChildren(UPDATED_APPLY_ON_CHILDREN)
        //            .isConsolidable(UPDATED_IS_CONSOLIDABLE)
        //            .relatedConfigId(UPDATED_RELATED_CONFIG_ID)
        //            .attributeType(UPDATED_ATTRIBUTE_TYPE)
        //            .isWritable(UPDATED_IS_WRITABLE)
        //            .consoParameterKey(UPDATED_CONSO_PARAMETER_KEY)
        //            .consoOperationType(UPDATED_CONSO_OPERATION_TYPE);

        restAttributeConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeConfig.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttributeConfig))
            )
            .andExpect(status().isOk());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
        AttributeConfig testAttributeConfig = attributeConfigList.get(attributeConfigList.size() - 1);
        assertThat(testAttributeConfig.getApplyOnChildren()).isEqualTo(UPDATED_APPLY_ON_CHILDREN);
        assertThat(testAttributeConfig.getIsConsolidable()).isEqualTo(UPDATED_IS_CONSOLIDABLE);
        assertThat(testAttributeConfig.getRelatedConfigId()).isEqualTo(UPDATED_RELATED_CONFIG_ID);
        assertThat(testAttributeConfig.getAttributeType()).isEqualTo(UPDATED_ATTRIBUTE_TYPE);
        assertThat(testAttributeConfig.getIsWritable()).isEqualTo(UPDATED_IS_WRITABLE);
        assertThat(testAttributeConfig.getConsoParameterKey()).isEqualTo(UPDATED_CONSO_PARAMETER_KEY);
        assertThat(testAttributeConfig.getConsoOperationType()).isEqualTo(UPDATED_CONSO_OPERATION_TYPE);
    }

    @Test
    void patchNonExistingAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attributeConfigDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAttributeConfig() throws Exception {
        int databaseSizeBeforeUpdate = attributeConfigRepository.findAll().size();
        attributeConfig.setId(UUID.randomUUID().toString());

        // Create the AttributeConfig
        AttributeConfigDTO attributeConfigDTO = attributeConfigMapper.toDto(attributeConfig);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeConfigMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attributeConfigDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeConfig in the database
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAttributeConfig() throws Exception {
        // Initialize the database
        attributeConfigRepository.save(attributeConfig);

        int databaseSizeBeforeDelete = attributeConfigRepository.findAll().size();

        // Delete the attributeConfig
        restAttributeConfigMockMvc
            .perform(delete(ENTITY_API_URL_ID, attributeConfig.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AttributeConfig> attributeConfigList = attributeConfigRepository.findAll();
        assertThat(attributeConfigList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
