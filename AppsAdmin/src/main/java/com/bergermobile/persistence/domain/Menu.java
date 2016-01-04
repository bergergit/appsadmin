package com.bergermobile.persistence.domain;

import java.io.Serializable;

import javax.persistence.*;

import org.springframework.data.rest.core.annotation.RestResource;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the menu database table.
 * 
 */
@Entity
public class Menu implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="menu_id")
	private Integer menuId;

	private String description;

	private String name;

	private int menuOrder;

	@Column(name="rest_name")
	private String restName;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="menu")
	private List<Field> fields;

	//bi-directional many-to-one association to Application
	@ManyToOne
	@RestResource(exported=false)
	private Application application;

	//bi-directional many-to-one association to Menu
	@ManyToOne
	@JoinColumn(name="parent_menu_id")
	@RestResource(exported=false)
	private Menu parentMenu;

	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="parentMenu")
	@RestResource(exported=false)
	private List<Menu> menus;

	public Menu() {
	}

	public Integer getMenuId() {
		return this.menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getMenuOrder() {
		return this.menuOrder;
	}

	public void setMenuOrder(int menuOrder) {
		this.menuOrder = menuOrder;
	}

	public String getRestName() {
		return this.restName;
	}

	public void setRestName(String restName) {
		this.restName = restName;
	}

	public List<Field> getFields() {
		return this.fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public Field addField(Field field) {
		getFields().add(field);
		field.setMenu(this);

		return field;
	}

	public Field removeField(Field field) {
		getFields().remove(field);
		field.setMenu(null);

		return field;
	}

	@JsonBackReference
	@JsonIgnore
	public Application getApplication() {
		return this.application;
	}

	public void setApplication(Application application) {
		this.application = application;
	}

	@JsonIgnore
	public Menu getParentMenu() {
		return this.parentMenu;
	}

	public void setParentMenu(Menu parentMenu) {
		this.parentMenu = parentMenu;
	}

	@JsonIgnore
	public List<Menu> getMenus() {
		return this.menus;
	}

	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}

	public Menu addMenus(Menu menus) {
		getMenus().add(menus);
		menus.setParentMenu(this);

		return menus;
	}

	public Menu removeMenus(Menu menus) {
		getMenus().remove(menus);
		menus.setParentMenu(null);

		return menus;
	}

}