package com.bergermobile.persistence.domain.projection;

import org.springframework.data.rest.core.config.Projection;

import com.bergermobile.persistence.domain.Application;

@Projection(name="simple", types = {Application.class})
public interface SimpleApplicationProjection {
	
	public Integer getApplicationId();

	public String getName();

}
