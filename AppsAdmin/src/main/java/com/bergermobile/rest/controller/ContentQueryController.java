package com.bergermobile.rest.controller;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bergermobile.rest.service.ContentService;

//@RepositoryRestController
@RestController
@RequestMapping(value="/mobileapps", method=RequestMethod.GET)
public class ContentQueryController {
	
	static Log LOG = LogFactory.getLog(ContentQueryController.class);
	
	@Autowired
	ContentService contentService;
		
	/**
	 * @param appId
	 * @param inLocale
	 */
	/*
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	@RequestMapping(value = "/contents/full/app/{appId}", method = RequestMethod.GET)
	@ResponseBody ResponseEntity<?> getContentsFull(@PathVariable String appId) {
		LOG.debug("ContentController - full");
		
		List<Content> contents = new ArrayList<Content>();
		Resources<Content> resources = new Resources<Content>(contents);
		resources.add(linkTo(methodOn(ContentQueryController.class).getContentsFull(appId)).withSelfRel()); 

		return ResponseEntity.ok(resources);
	}
	*/
	
	/**
	 * This is the content query method used by mobile applications
	 * Will retrieve contents for a single menu
	 */
	@RequestMapping("/contents/app/{appRestName}/menu/{menuRestName}/inlocale/{inlocale}")
	public Map<String, Object> getContentsForMenu(@PathVariable String appRestName, 
			@PathVariable String menuRestName, @PathVariable String inlocale) {
		//LOG.debug("ContentController - full");
		
		return contentService.getContents(appRestName, menuRestName, inlocale);
		
	}
	
	/**
	 * This is the content query method used by mobile applications
	 * Will retrieve all contents for all menus
	 */
	@RequestMapping("/contents/app/{appRestName}/inlocale/{inlocale}")
	public Map<String, Object> getContents(@PathVariable String appRestName, @PathVariable String inlocale) {
		//LOG.debug("ContentController - full");
		
		return contentService.getContents(appRestName, null, inlocale);
		
	}
}
