package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.springframework.data.rest.core.annotation.RestResource;

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
	@RestResource(exported=true)
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
	
	public Map<Integer, Boolean> getApplicationUserIds() {
		Map<Integer, Boolean> userIds = new HashMap<>();
		for (ApplicationUser applicationUser : applicationUsers) {
			userIds.put(applicationUser.getUserId(), true);
		}
		return userIds;
	}

}