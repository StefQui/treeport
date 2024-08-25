package com.sm.service;

import static com.sm.domain.attribute.AssetKey.resource;
import static com.sm.domain.attribute.AssetKey.resourceResource;
import static com.sm.domain.attribute.AssetKey.resourceUser;
import static com.sm.domain.attribute.AssetKey.site;
import static com.sm.domain.attribute.AssetKey.siteResource;

import com.sm.domain.Resource;
import com.sm.domain.Site;
import com.sm.domain.attribute.AssetKey;
import com.sm.domain.attribute.Attribute;
import com.sm.service.dto.attribute.AttributeDTO;

public class AssetKeyUtils {

    public static String extractSite(Attribute a) {
        if (site.equals(a.getAssetKey()) || (siteResource.equals(a.getAssetKey()))) {
            return a.getSiteId();
        } else if (resourceResource.equals(a.getAssetKey()) || resourceUser.equals(a.getAssetKey())) {
            return null;
        }
        throw new RuntimeException("to implement extractSite " + a.getAssetKey());
    }

    public static String extractResource(Attribute a) {
        if (site.equals(a.getAssetKey()) || (siteResource.equals(a.getAssetKey()))) {
            return null;
        } else if (resourceResource.equals(a.getAssetKey()) || resourceUser.equals(a.getAssetKey())) {
            return a.getResourceId();
        }
        throw new RuntimeException("to implement extractResource " + a.getAssetKey());
    }

    public static String extractResourceFromDTO(AttributeDTO aDTO) {
        if (site.equals(aDTO.getAssetKey()) || (siteResource.equals(aDTO.getAssetKey()))) {
            return null;
        } else if (resourceResource.equals(aDTO.getAssetKey()) || resourceUser.equals(aDTO.getAssetKey())) {
            return aDTO.getResource().getId();
        }
        throw new RuntimeException("to implement extractAssetFromDTO " + aDTO.getAssetKey());
    }

    public static String extractSiteFromDTO(AttributeDTO aDTO) {
        if (site.equals(aDTO.getAssetKey()) || (siteResource.equals(aDTO.getAssetKey()))) {
            return aDTO.getSite().getId();
        } else if (resourceResource.equals(aDTO.getAssetKey()) || resourceUser.equals(aDTO.getAssetKey())) {
            return null;
        }
        throw new RuntimeException("to implement extractAssetFromDTO " + aDTO.getAssetKey());
    }

    public static String extractResource2FromDTO(AttributeDTO aDTO) {
        if (resourceResource.equals(aDTO.getAssetKey()) || (siteResource.equals(aDTO.getAssetKey()))) {
            return aDTO.getResource2().getId();
        } else if (site.equals(aDTO.getAssetKey()) || resourceUser.equals(aDTO.getAssetKey())) {
            return null;
        }
        throw new RuntimeException("to implement extractAsset2FromDTO " + aDTO.getAssetKey());
    }

    public static String getSite(AssetKey assetKey, Site s) {
        if (site.equals(assetKey) || (siteResource.equals(assetKey))) {
            return s.getId();
        } else if (resourceResource.equals(assetKey) || resource.equals(assetKey) || resourceUser.equals(assetKey)) {
            return null;
        }
        throw new RuntimeException("to implement getSite " + assetKey);
    }

    public static String getResource(AssetKey assetKey, Resource resource) {
        if (site.equals(assetKey) || (siteResource.equals(assetKey))) {
            return null;
        } else if (resourceResource.equals(assetKey) || resourceUser.equals(assetKey) || AssetKey.resource.equals(assetKey)) {
            return resource.getId();
        }
        throw new RuntimeException("to implement getResource " + assetKey);
    }

    public static String getResource2(AssetKey assetKey, Resource resource2) {
        if (resourceResource.equals(assetKey) || (siteResource.equals(assetKey))) {
            return resource2.getId();
        } else if (site.equals(assetKey) || resourceUser.equals(assetKey) || resource.equals(assetKey)) {
            return null;
        }
        throw new RuntimeException("to implement getResource2 " + assetKey);
    }
}
