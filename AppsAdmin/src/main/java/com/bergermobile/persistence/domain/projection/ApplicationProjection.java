package com.bergermobile.persistence.domain.projection;

import java.util.Map;

import org.springframework.data.rest.core.config.Projection;

import com.bergermobile.persistence.domain.Application;

@Projection(name="applicationProjection", types = {Application.class})
public interface ApplicationProjection {
	
	public Integer getApplicationId();

	public String getName();

	public String getRestName();
	
	public Map<Integer, Boolean> getApplicationUserIds();

}
