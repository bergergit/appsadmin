package com.bergermobile.persistence.domain.projection;

import org.springframework.data.rest.core.config.Projection;

import com.bergermobile.persistence.domain.Menu;

@Projection(name="menuProjection", types = {Menu.class})
public interface MenuProjection {
	
	public Integer getMenuId();

	public String getName();

	public String getRestName();
	
	public String getDescription();
	
	public Integer getMenuOrder();
	
	public Integer getMenuParentId();

}
