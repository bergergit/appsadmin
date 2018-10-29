package com.bergermobile.rest.domain;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * This is the transient object that handles mapping of frontend Content screen
 * @author fabioberger
 *
 */
@Data
@EqualsAndHashCode
public class ContentRest {
	
	private String contentIds;
	private List<String> contents;
	private String fieldIds;
	private String ftd;
	private String locales;
	private String menuIds;
	private String uniqueId;
	private String filesPosition;
	public void addContent(int contentIndex, String string) {
		contents.add(contentIndex, string);
	}

}
