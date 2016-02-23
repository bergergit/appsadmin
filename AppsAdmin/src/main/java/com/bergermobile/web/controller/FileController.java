package com.bergermobile.web.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.bergermobile.rest.domain.ContentRest;
import com.bergermobile.rest.service.ContentService;
import com.bergermobile.rest.service.ContentServiceImpl;

@Controller
@RequestMapping
public class FileController {
	
	static Log LOG = LogFactory.getLog(FileController.class);
	
	@Autowired
	ContentService contentService;
	
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
    public @ResponseBody void upload(MultipartHttpServletRequest request, HttpServletResponse response) {
        LOG.debug("uploadPost called");
        
        contentService.saveFile(request);
        
        //Map<String, Object> files = new HashMap<>();
        //files.put("files", list);
        //return files;
    }

}
