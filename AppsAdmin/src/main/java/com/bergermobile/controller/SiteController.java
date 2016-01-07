package com.bergermobile.controller;

import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
	@RequestMapping(value = { "", "login", "logout", "home" })
	public String redirect() {
		// Forward to home page so that route is preserved.
		return "forward:/";
	}
}
