package com.bergermobile.rest.controller;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.bergermobile.persistence.domain.Field;
import com.bergermobile.persistence.repository.FieldRepository;

@RepositoryRestController
public class FieldsController {
	
	static Log LOG = LogFactory.getLog(FieldsController.class);
	
	@Autowired
	private FieldRepository fieldRepository;
	
	/**
	 * Updates the order of the fields
	 * 
	 * @param fieldIds a comma-separated list of ids of the fields to be updated
	 * @param fieldOrders a comma-separated list of orders. Size needs to match fieldIds array
	 */
	@RequestMapping(value = "/fields/updateorder/{fieldIds}/orders/{fieldOrders}", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	@Transactional
	public void updateMenus(@PathVariable String fieldIds, @PathVariable String fieldOrders) {
		LOG.debug("Updating field orders");
		
		String[] fieldIdsArray = fieldIds.split(",");
		String[] ordersArray = fieldOrders.split(",");
		
		for (int i = 0; i < fieldIdsArray.length; i++) {
			try {
				Field field = fieldRepository.findOne(Integer.parseInt(fieldIdsArray[i]));
				field.setFieldOrder(Integer.parseInt(ordersArray[i]));
				fieldRepository.save(field);
			} catch (NumberFormatException _nfe) {
				_nfe.printStackTrace();
			}
		}
	}

}
