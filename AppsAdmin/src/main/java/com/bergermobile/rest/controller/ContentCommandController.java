package com.bergermobile.rest.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.rest.domain.ContentRest;
import com.bergermobile.rest.domain.SwapRest;
import com.bergermobile.rest.service.ContentService;

@RepositoryRestController
//@RestController
public class ContentCommandController {
	
	static Log LOG = LogFactory.getLog(ContentCommandController.class);
	
	@Autowired
	ContentService contentService;
		
	@RequestMapping(value = "/contents", method = RequestMethod.POST)
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	ResponseEntity<?> save(@RequestBody ContentRest contentRest) {
		if (!contentService.isAuthorized(contentRest)) {
			throw new AccessDeniedException("User not authorized to save this content");
		}
		
		contentService.save(contentRest);
		contentService.removeFilesToDelete(contentRest);
		
		Menu menu = contentService.getMenuFromContent(contentRest);
		
		Resource<Menu> resource = new Resource<>(menu);
		resource.add(linkTo(methodOn(ContentCommandController.class).save(contentRest)).withSelfRel());
		
		return ResponseEntity.ok(resource);
	}
	
	@RequestMapping(value = "/contents/groupId/{groupId}", method = RequestMethod.DELETE)
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	ResponseEntity<?> deleteByGroupId(@PathVariable String groupId) {
		if (!contentService.isAuthorized(groupId)) {
			throw new AccessDeniedException("User not authorized to delete this content");
		}
		Menu menu = contentService.getMenuFromGroupId(groupId);
		
		// invoke an asynchronous method to remove unused files
		contentService.removeUnusedFiles();
		
		Resource<Menu> resource = new Resource<>(menu);
		resource.add(linkTo(methodOn(ContentCommandController.class).deleteByGroupId(groupId)).withSelfRel()); 
		
		contentService.deleteByGroupId(groupId);
		return ResponseEntity.ok(resource);
	}
	
	/**
	 * Swaps 2 groupIds, so we can change content order
	 * @param groupIds
	 */
	@RequestMapping(value = "/contents/swap", method = RequestMethod.POST)
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	ResponseEntity<?> swapGroupIds(@RequestBody SwapRest swapRest) {
		contentService.swapGroupIds(swapRest);
		return ResponseEntity.ok(null);
	}
	

}
