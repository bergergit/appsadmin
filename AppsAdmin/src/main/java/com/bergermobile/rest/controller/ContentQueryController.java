package com.bergermobile.rest.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bergermobile.persistence.domain.Content;
import com.bergermobile.rest.service.ContentService;

@RepositoryRestController
//@RestController
public class ContentQueryController {
	
	static Log LOG = LogFactory.getLog(ContentQueryController.class);
	
	@Autowired
	ContentService contentService;
		
	/**
	 * @param appId
	 * @param inLocale
	 */
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	@RequestMapping(value = "/contents/full/app/{appId}", method = RequestMethod.GET)
	@ResponseBody ResponseEntity<?> getContentsFull(@PathVariable String appId) {
		LOG.debug("ContentController - full");
		
		List<Content> contents = new ArrayList<Content>();
		Resources<Content> resources = new Resources<Content>(contents);
		resources.add(linkTo(methodOn(ContentQueryController.class).getContentsFull(appId)).withSelfRel()); 

		return ResponseEntity.ok(resources);
	}
}
