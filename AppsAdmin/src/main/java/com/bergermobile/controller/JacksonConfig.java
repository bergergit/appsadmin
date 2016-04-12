package com.bergermobile.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.Content;
import com.bergermobile.persistence.domain.Field;
import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.persistence.domain.Type;

@Configuration
public class JacksonConfig extends RepositoryRestConfigurerAdapter {
	/**
	 * This will export IDs for the listed classes
	 */
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.exposeIdsFor(
				Application.class, 
				Menu.class, 
				Type.class,
				Field.class, 
				Content.class);
	}

}
