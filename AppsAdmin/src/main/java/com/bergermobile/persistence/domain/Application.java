package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference;


/**
 * The persistent class for the application database table.
 * 
 */
@Entity
public class Application implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="application_id")
	private Integer applicationId;

	private String description;

	@Column(name="main_locale")
	private String mainLocale;

	private String name;

	@Column(name="rest_name")
	private String restName;

	@Column(name="supported_locales")
	private String supportedLocales;

	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application")
	private List<Menu> menus;

	public Application() {
	}

	public Integer getApplicationId() {
		return this.applicationId;
	}

	public void setApplicationId(Integer applicationId) {
		this.applicationId = applicationId;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMainLocale() {
		return this.mainLocale;
	}

	public void setMainLocale(String mainLocale) {
		this.mainLocale = mainLocale;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRestName() {
		return this.restName;
	}

	public void setRestName(String restName) {
		this.restName = restName;
	}

	public String getSupportedLocales() {
		return this.supportedLocales;
	}

	public void setSupportedLocales(String supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

	@JsonManagedReference
	public List<Menu> getMenus() {
		return this.menus;
	}

	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}

	public Menu addMenus(Menu menus) {
		getMenus().add(menus);
		menus.setApplication(this);

		return menus;
	}

	public Menu removeMenus(Menu menus) {
		getMenus().remove(menus);
		menus.setApplication(null);

		return menus;
	}

}