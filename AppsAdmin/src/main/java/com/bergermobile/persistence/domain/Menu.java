package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.springframework.data.rest.core.annotation.RestResource;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


/**
 * The persistent class for the menu database table.
 * 
 */
@Entity
@Data
@EqualsAndHashCode(of={"menuId"})
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
	@OrderBy("fieldOrder")
	@JsonManagedReference 
	@RestResource(exported = false)
	private List<Field> fields;

	//bi-directional many-to-one association to Application
	@ManyToOne
	//@RestResource(exported = false)
	private Application application;

	//bi-directional many-to-one association to Menu
	@ManyToOne
	@JoinColumn(name="parent_menu_id")
	@JsonBackReference
	private Menu parentMenu;

	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="parentMenu", cascade={ CascadeType.REMOVE })
	@OrderBy("menuOrder")
	@JsonManagedReference 
	private List<Menu> menus;
	
	/**
	 * Retrieves the ID of te parent menu, if exists
	 * @return
	 */
	public Integer getMenuParentId() {
		if (getParentMenu() != null) {
			return getParentMenu().getMenuId();
		}
		return null;
	}
}