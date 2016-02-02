package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

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

	@Column(unique=true)
	private String restName;

	private String supportedLocales;
	
	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application")
	@OrderBy("menuOrder")
	private List<Menu> menus;
	
	//bi-directional many-to-one association to Menu
	@OneToMany(mappedBy="application", cascade={ CascadeType.REMOVE }, orphanRemoval=true)
	private List<ApplicationUser> applicationUsers;
	
	public Map<Integer, Boolean> getApplicationUserIds() {
		Map<Integer, Boolean> userIds = new HashMap<>();
		for (ApplicationUser applicationUser : applicationUsers) {
			userIds.put(applicationUser.getUserId(), true);
		}
		return userIds;
	}

}