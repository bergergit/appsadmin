package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Getter;


/**
 * The persistent class for the menu database table.
 * 
 */
@Entity
@Getter
public class Menu implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer menuId;

	private String description;

	private String name;

	private int menuOrder;

	private String restName;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="menu")
	private List<Field> fields;

	//bi-directional many-to-one association to Application
	@ManyToOne
	private Application application;

	//bi-directional many-to-one association to Menu
	@ManyToOne
	@JoinColumn(name="parent_menu_id")
	private Menu parentMenu;

	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="parentMenu")
	private List<Menu> menus;

}