package com.bergermobile.rest.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.bergermobile.persistence.domain.Content;
import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.rest.domain.ContentRest;
import com.bergermobile.rest.service.ContentService;

@RepositoryRestController
//@RestController
public class ContentController {
	
	static Log LOG = LogFactory.getLog(ContentController.class);
	
	@Autowired
	ContentService contentService;
		
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
	
	@RequestMapping(value = "/contents", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Menu save(@RequestBody ContentRest contentRest) {
		contentService.save(contentRest);
		//return menuRepository.findOne(content.getField().getMenu().getMenuId());
		return contentService.getMenuFromContent(contentRest);
	}
	
	@RequestMapping(value = "/contents/groupId/{groupId}", method = RequestMethod.DELETE)
	//@ResponseStatus(HttpStatus.OK)
	ResponseEntity<?> deleteByGroupId(@PathVariable String groupId) {
		Menu menu = contentService.getMenuFromGroupId(groupId);
		
		Resource<Menu> resource = new Resource<>(menu);
		resource.add(linkTo(methodOn(ContentController.class).deleteByGroupId(groupId)).withSelfRel()); 
		
		contentService.deleteByGroupId(groupId);
		return ResponseEntity.ok(resource);
		//return null;
		
		//Menu menu = menuRepository.findOne(contentRepository.findByGroupId(groupId).get(0).getField().getMenu().getMenuId());
		//contentRepository.deleteByGroupId(groupId);
		//return menu;
	}

}
