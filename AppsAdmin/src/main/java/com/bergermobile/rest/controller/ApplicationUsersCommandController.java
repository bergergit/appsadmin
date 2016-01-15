package com.bergermobile.rest.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bergermobile.persistence.domain.ApplicationUser;
import com.bergermobile.persistence.repository.ApplicationUserRepository;

@RestController
@RequestMapping(value = "/rest")
public class ApplicationUsersCommandController {
	
	static Log LOG = LogFactory.getLog(ApplicationUsersCommandController.class);
	
	@Autowired
	private ApplicationUserRepository applicationUserRepository;
	
	@RequestMapping(value = "/applicationUsers", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	@Transactional
	public void saveUser(@Valid @RequestBody List<ApplicationUser> applicationUsers, BindingResult result, HttpServletRequest request) {
		LOG.debug("Saving list of users");
		// this one is simple, so no service layer needed
		
		// since this is a single-shot save, we first delete all ApplicationUser
		applicationUserRepository.deleteAll();
		applicationUserRepository.save(applicationUsers);
	}

}
