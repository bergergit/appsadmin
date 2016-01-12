package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

/**
 * The persistent class for the application database table.
 * 
 */
@Entity
@Data
public class Application implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer applicationId;

	private String description;

	private String mainLocale;

	private String name;

	private String restName;

	private String supportedLocales;
	
	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application")
	private List<Menu> menus;
	
	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application")
	private List<ApplicationUser> applicationUsers;

}