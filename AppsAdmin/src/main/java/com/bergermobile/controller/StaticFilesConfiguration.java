package com.bergermobile.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Configure to serves static uploaded files under /files/** path 
 * @author fabioberger
 *
 */
@Configuration
public class StaticFilesConfiguration extends WebMvcConfigurerAdapter {
	
	@Value("${file.upload.directory}")
	private String fileUploadDirectory;
    
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**").addResourceLocations("file:" + fileUploadDirectory);
    }

}
