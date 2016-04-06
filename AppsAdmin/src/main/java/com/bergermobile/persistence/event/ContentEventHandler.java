package com.bergermobile.persistence.event;

import java.util.Date;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.bergermobile.persistence.domain.Content;
import com.bergermobile.commons.security.SecurityUser;

@RepositoryEventHandler(Content.class)
@Component
public class ContentEventHandler {
	
	static Log LOG = LogFactory.getLog(ContentEventHandler.class);
	
	/**
	 * We need a special security treatment here: we can only allow ADMINs or Users that BELONG
	 * to that application, to insert a new content.
	 * We also need to insert the updatedBy and updatedDate
	 * @param content
	 */
	@HandleBeforeCreate
	@Transactional
	public void handleContentSave(Content content) {
		LOG.debug("On ContentEventHandler handleContentSave");
		SecurityUser securityUser = (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		content.setUpdatedBy(securityUser.getUsername());
		content.setUpdatedDate(new Date());
	}

}
