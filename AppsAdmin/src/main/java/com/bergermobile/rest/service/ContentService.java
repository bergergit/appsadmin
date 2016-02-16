package com.bergermobile.rest.service;

import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.rest.domain.ContentRest;

public interface ContentService {

	void save(ContentRest contentRest);

	Menu getMenuFromContent(ContentRest contentRest);

	void deleteByGroupId(String groupId);

	Menu getMenuFromGroupId(String groupId);

}
