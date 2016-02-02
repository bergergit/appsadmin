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

import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.persistence.repository.MenuRepository;

@RepositoryRestController
public class MenusController {
	
	static Log LOG = LogFactory.getLog(MenusController.class);
	
	@Autowired
	private MenuRepository menuRepository;
	
	/**
	 * Updates the order of the menus
	 * 
	 * @param menuIds a comma-separated list of ids of the menus to be updated
	 * @param menuOrders a comma-separated list of orders. Size needs to match menuIds array
	 */
	@RequestMapping(value = "/menus/updateorder/{menuIds}/orders/{menuOrders}", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	@Transactional
	public void updateMenus(@PathVariable String menuIds, @PathVariable String menuOrders) {
		LOG.debug("Updating menu orders");
		
		String[] menuIdsArray = menuIds.split(",");
		String[] ordersArray = menuOrders.split(",");
		
		for (int i = 0; i < menuIdsArray.length; i++) {
			try {
				Menu menu = menuRepository.findOne(Integer.parseInt(menuIdsArray[i]));
				menu.setMenuOrder(Integer.parseInt(ordersArray[i]));
				menuRepository.save(menu);
			} catch (NumberFormatException _nfe) {
				_nfe.printStackTrace();
			}
		}
	}

}
