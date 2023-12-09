package com.sm.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sm.domain.enumeration.AssetType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Asset.
 */
@Document(collection = "asset")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Asset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("type")
    private AssetType type;

    @DBRef
    @Field("orga")
    private Organisation orga;

    @DBRef
    @Field("parent")
    @JsonIgnoreProperties(value = { "orga", "parent", "childrens", "assets" }, allowSetters = true)
    private Asset parent;

    @DBRef
    @Field("childrens")
    @JsonIgnoreProperties(value = { "orga", "parent", "childrens", "assets" }, allowSetters = true)
    private Set<Asset> childrens = new HashSet<>();

    @DBRef
    @Field("assets")
    @JsonIgnoreProperties(value = { "orga", "parent", "childrens", "assets" }, allowSetters = true)
    private Set<Asset> assets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Asset id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Asset name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AssetType getType() {
        return this.type;
    }

    public Asset type(AssetType type) {
        this.setType(type);
        return this;
    }

    public void setType(AssetType type) {
        this.type = type;
    }

    public Organisation getOrga() {
        return this.orga;
    }

    public void setOrga(Organisation organisation) {
        this.orga = organisation;
    }

    public Asset orga(Organisation organisation) {
        this.setOrga(organisation);
        return this;
    }

    public Asset getParent() {
        return this.parent;
    }

    public void setParent(Asset asset) {
        this.parent = asset;
    }

    public Asset parent(Asset asset) {
        this.setParent(asset);
        return this;
    }

    public Set<Asset> getChildrens() {
        return this.childrens;
    }

    public void setChildrens(Set<Asset> assets) {
        this.childrens = assets;
    }

    public Asset childrens(Set<Asset> assets) {
        this.setChildrens(assets);
        return this;
    }

    public Asset addChildrens(Asset asset) {
        this.childrens.add(asset);
        return this;
    }

    public Asset removeChildrens(Asset asset) {
        this.childrens.remove(asset);
        return this;
    }

    public Set<Asset> getAssets() {
        return this.assets;
    }

    public void setAssets(Set<Asset> assets) {
        if (this.assets != null) {
            this.assets.forEach(i -> i.removeChildrens(this));
        }
        if (assets != null) {
            assets.forEach(i -> i.addChildrens(this));
        }
        this.assets = assets;
    }

    public Asset assets(Set<Asset> assets) {
        this.setAssets(assets);
        return this;
    }

    public Asset addAsset(Asset asset) {
        this.assets.add(asset);
        asset.getChildrens().add(this);
        return this;
    }

    public Asset removeAsset(Asset asset) {
        this.assets.remove(asset);
        asset.getChildrens().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Asset)) {
            return false;
        }
        return getId() != null && getId().equals(((Asset) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Asset{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
