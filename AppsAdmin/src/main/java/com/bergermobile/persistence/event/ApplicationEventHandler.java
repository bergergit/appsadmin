package com.bergermobile.persistence.event;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

import com.bergermobile.persistence.domain.ApplicationUser;
import com.bergermobile.persistence.repository.ApplicationUserRepository;

@RepositoryEventHandler(ApplicationUser.class)
@Component
public class ApplicationEventHandler {
	
	static Log LOG = LogFactory.getLog(ApplicationEventHandler.class);
	
	@Autowired
	ApplicationUserRepository applicationUserRepository;
	
	@HandleBeforeCreate
	@Transactional
	public void handleApplicationUserSave(ApplicationUser applicationUser) {
		// since this is a single-shot save, we first delete all ApplicationUser
		applicationUserRepository.deleteAll();
	}

}
