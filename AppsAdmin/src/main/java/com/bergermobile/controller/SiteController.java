package com.bergermobile.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(method = RequestMethod.GET)
public class SiteController {
	
	static Log LOG = LogFactory.getLog(SiteController.class);

	@RequestMapping(value = "/")
	public String home() {
		return "index";
	}

	/**
	 * Matches to forwards to the single page angular application, so that we
	 * can use natural routes.
	 */
	@RequestMapping(value = { "", "login", "logout", "admin", "users/**" })
	public String redirect() {
		// Forward to home page so that route is preserved.
		return "forward:/";
	}
}
