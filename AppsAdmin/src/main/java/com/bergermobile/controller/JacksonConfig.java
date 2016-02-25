package com.bergermobile.controller;

import org.springframework.boot.autoconfigure.data.rest.SpringBootRepositoryRestMvcConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.Content;
import com.bergermobile.persistence.domain.Field;
import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.persistence.domain.Type;

@Configuration
public class JacksonConfig extends SpringBootRepositoryRestMvcConfiguration {
	/**
	 * This will export IDs for the listed classes 
	 */
    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
    	config.exposeIdsFor(Application.class);
    	config.exposeIdsFor(Menu.class);
        config.exposeIdsFor(Type.class);
        config.exposeIdsFor(Field.class);
        config.exposeIdsFor(Content.class);
    }
}
