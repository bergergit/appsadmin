package com.bergermobile.persistence.domain.projection;

import java.util.List;

import org.springframework.data.rest.core.config.Projection;

import com.bergermobile.persistence.domain.Field;
import com.bergermobile.persistence.domain.Menu;

@Projection(name="menuProjection", types = {Menu.class})
public interface MenuProjection {
	
	public Integer getMenuId();

	public String getName();

	public String getRestName();
	
	public String getDescription();
	
	public Integer getMenuOrder();
	
	public Integer getMenuParentId();
	
	public List<Field> getFields();

}
