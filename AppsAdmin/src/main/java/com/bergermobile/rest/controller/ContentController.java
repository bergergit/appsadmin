package com.bergermobile.rest.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bergermobile.persistence.domain.Content;

@RepositoryRestController
public class ContentController {
	
	static Log LOG = LogFactory.getLog(ContentController.class);
		
	/**
	 * @param appId
	 * @param inLocale
	 */
	@RequestMapping(value = "/contents/full/app/{appId}", method = RequestMethod.GET)
	public @ResponseBody ResponseEntity<?> getContentsFull(@PathVariable String appId) {
		LOG.debug("ContentController - full");
		
		List<Content> contents = new ArrayList<Content>();
		Resources<Content> resources = new Resources<Content>(contents);
		resources.add(linkTo(methodOn(ContentController.class).getContentsFull(appId)).withSelfRel()); 

		return ResponseEntity.ok(resources);
	}

}
