package com.bergermobile.rest.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.rest.domain.ContentRest;

public interface ContentService {

	void save(ContentRest contentRest);

	Menu getMenuFromContent(ContentRest contentRest);

	void deleteByGroupId(String groupId);

	Menu getMenuFromGroupId(String groupId);
	
	void saveFile(MultipartHttpServletRequest request);

	void removeFilesToDelete(ContentRest contentRest);

	void removeUnusedFiles();

	boolean isAuthorized(ContentRest contentRest);

	boolean isAuthorized(String groupId);

	Map<String, Object> getContents(String appRestName, String menuRestName, String inlocale);

}
