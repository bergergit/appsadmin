package com.bergermobile.rest.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * This is the transient object that handles mapping of frontend Content screen
 * @author fabioberger
 *
 */
@Data
@EqualsAndHashCode
public class SwapRest {
	
	private String originalIds;
	private String changedIds;

}
