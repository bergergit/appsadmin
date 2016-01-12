package com.bergermobile.persistence.domain.projection;

import java.util.List;

import org.springframework.data.rest.core.config.Projection;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.ApplicationUser;

@Projection(name="applicationProjection", types = {Application.class})
public interface ApplicationProjection {
	
	public Integer getApplicationId();

	public String getName();

	public String getRestName();
	
	public List<ApplicationUser> getApplicationUsers();

}
