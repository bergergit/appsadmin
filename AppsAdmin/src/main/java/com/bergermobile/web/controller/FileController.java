package com.bergermobile.web.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.bergermobile.rest.service.ContentService;

@Controller
@RequestMapping
public class FileController {
	
	static Log LOG = LogFactory.getLog(FileController.class);
	
	@Autowired
	ContentService contentService;
	
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
    public void upload(MultipartHttpServletRequest request, HttpServletResponse response) {
        LOG.debug("uploadPost called");
        
        contentService.saveFile(request);
    }

}
