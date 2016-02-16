package com.bergermobile.rest.service;

import java.util.Date;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bergermobile.persistence.domain.Content;
import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.persistence.repository.ContentRepository;
import com.bergermobile.persistence.repository.FieldRepository;
import com.bergermobile.persistence.repository.MenuRepository;
import com.bergermobile.rest.domain.ContentRest;
import com.bergermobile.security.SecurityUser;

@Service
public class ContentServiceImpl implements ContentService {
	
	static Log LOG = LogFactory.getLog(ContentServiceImpl.class);
	
	@Autowired
	ContentRepository contentRepository;
	
	@Autowired
	FieldRepository fieldRepository;
	
	@Autowired
	MenuRepository menuRepository;

	/**
	 * Main save method for Content
	 * Will iterate over all the comma-separated list of field Ids and locales and will save them one by one
	 */
	@Override
	@Transactional
	public void save(ContentRest contentRest) {
		// getting array of comma-separated values
		Content content;
		String uniqueIdStr = UUID.randomUUID().toString();

		int contentIndex = 0;
		String[] contentIds = contentRest.getContentIds().split(",", -1);
		String[] locales = contentRest.getLocales().split(",");
		String[] fieldIds = contentRest.getFieldIds().split(",");

		// iterate over locales
		for (int i = 0; i < locales.length; i++) {
			// iterate over fields
			for (int j = 0; j < fieldIds.length; j++) {
				String contentIdStr = contentIds[contentIndex];
				if (!contentIdStr.isEmpty()) {
					content = contentRepository.findOne(Integer.parseInt(contentIdStr));
				} else {
					content = new Content(); 
					content.setField(fieldRepository.findOne(Integer.parseInt(fieldIds[j])));
					content.setLocale(locales[i]);
					//content.setGroupId(uniqueIdStr);
				}
				content.setGroupId(uniqueIdStr);
				content.setContent(contentRest.getContents().get(contentIndex));
				setBaseFields(content);
				contentIndex++;
				
				// we wont save empty contents
				if (content.getContent() == null || content.getContent().trim().isEmpty()) continue;
				
				contentRepository.save(content);
			}
		}
		
	}

	@Override
	public Menu getMenuFromContent(ContentRest contentRest) {
		return menuRepository.findOne(Integer.parseInt(contentRest.getMenuIds().split(",")[0]));
	}

	@Override
	@Transactional
	public void deleteByGroupId(String groupId) {
		LOG.debug("Will delete by groupId: " + groupId);
		contentRepository.deleteByGroupId(groupId);
	}

	@Override
	public Menu getMenuFromGroupId(String groupId) {
		return menuRepository.findOne(contentRepository.findByGroupId(groupId).get(0).getField().getMenu().getMenuId());
	}
	
	public void setBaseFields(Content content) {
		SecurityUser securityUser = (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		content.setUpdatedBy(securityUser.getUsername());
		content.setUpdatedDate(new Date());
	}

}
