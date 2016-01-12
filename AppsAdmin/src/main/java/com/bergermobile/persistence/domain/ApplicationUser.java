package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;

/**
 * Relationship with BMAuth users with AppsAdmin created applications
 * 
 */
@Entity
@Data
public class ApplicationUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer applicationUserId;
	
	private Integer userId;
	
	@ManyToOne
	private Application application;
	
	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application")
	private List<Menu> menus;

}