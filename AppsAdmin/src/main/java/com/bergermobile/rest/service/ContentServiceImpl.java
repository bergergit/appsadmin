package com.bergermobile.rest.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.bergermobile.persistence.domain.Application;
import com.bergermobile.persistence.domain.Content;
import com.bergermobile.persistence.domain.Field;
import com.bergermobile.persistence.domain.Menu;
import com.bergermobile.persistence.repository.ApplicationRepository;
import com.bergermobile.persistence.repository.ContentRepository;
import com.bergermobile.persistence.repository.FieldRepository;
import com.bergermobile.persistence.repository.MenuRepository;
import com.bergermobile.rest.domain.ContentRest;
import com.bergermobile.security.SecurityUser;

@Service
public class ContentServiceImpl implements ContentService {
	
	static Log LOG = LogFactory.getLog(ContentServiceImpl.class);
	
	@Value("${file.upload.directory}")
	private String fileUploadDirectory;
	
	@Autowired
	ContentRepository contentRepository;
	
	@Autowired
	FieldRepository fieldRepository;
	
	@Autowired
	MenuRepository menuRepository;
	
	@Autowired
	ApplicationRepository applicationRepository;

	/**
	 * Main save method for Content
	 * Will iterate over all the comma-separated list of field Ids and locales and will save them one by one
	 */
	@Override
	@Transactional
	public void save(ContentRest contentRest) {
		// getting array of comma-separated values
		Content content;
		//String uniqueIdStr = UUID.randomUUID().toString();

		int contentIndex = 0;
		String[] contentIds = contentRest.getContentIds().split(",", -1);
		String[] locales = contentRest.getLocales().split(",");
		String[] fieldIds = contentRest.getFieldIds().split(",");
		
		//List<String> filesPosition = new ArrayList<String>(Arrays.asList(contentRest.getFilesPosition().split(",")));
		List<String> filesPosition = Arrays.asList(contentRest.getFilesPosition().split(","));
		// iterate over locales
		for (int i = 0; i < locales.length; i++) {
			// iterate over fields
			for (int j = 0; j < fieldIds.length; j++) {
				// ignore file fields
				if (filesPosition.contains("" + contentIndex)) {
					//filesPosition.remove("" + contentIndex);
					contentRest.addContent(contentIndex, "");
					contentIndex++;
					// adding blank content just to not screw up with the logic
					
					
					continue;
				}
				
				String contentIdStr = contentIds[contentIndex];
				if (!contentIdStr.isEmpty()) {
					content = contentRepository.findOne(Integer.parseInt(contentIdStr));
				} else {
					content = new Content(); 
					content.setField(fieldRepository.findOne(Integer.parseInt(fieldIds[j])));
					content.setLocale(locales[i]);
					//content.setGroupId(uniqueIdStr);
				}
				//content.setGroupId(uniqueIdStr);
				content.setGroupId(contentRest.getUniqueId());
				content.setContent(contentRest.getContents().get(contentIndex));
				setBaseFields(content);
				contentIndex++;
				
				// we wont save empty contents
				if (content.getContent() == null || content.getContent().trim().isEmpty()) continue;
				
				contentRepository.save(content);
			}
		}
		
	}

	@Override
	public Menu getMenuFromContent(ContentRest contentRest) {
		return menuRepository.findOne(Integer.parseInt(contentRest.getMenuIds().split(",")[0]));
	}

	@Override
	@Transactional
	public void deleteByGroupId(String groupId) {
		LOG.debug("Will delete by groupId: " + groupId);
		contentRepository.deleteByGroupId(groupId);
	}

	@Override
	public Menu getMenuFromGroupId(String groupId) {
		return menuRepository.findOne(contentRepository.findByGroupId(groupId).get(0).getField().getMenu().getMenuId());
	}
	
	public void setBaseFields(Content content) {
		SecurityUser securityUser = (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		content.setUpdatedBy(securityUser.getUsername());
		content.setUpdatedDate(new Date());
	}

	@Override
	public void saveFile(MultipartHttpServletRequest request) {
		Iterator<String> itr = request.getFileNames();
        MultipartFile mpf;
        //List<Image> list = new LinkedList<>();
        
        // lets get the menu associated with this file
        Menu menu = menuRepository.findOne(Integer.parseInt(request.getParameter("menuIds")));
        int filePosition = 0;
        
        while (itr.hasNext()) {
            mpf = request.getFile(itr.next());
            LOG.debug("Uploading {} " +  mpf.getOriginalFilename());
            
            String newFilenameBase = UUID.randomUUID().toString();
            
            // we set the filename with the uniqueId
            //String newFilenameBase = request.getParameter("uniqueId");
            
            String originalFileExtension = mpf.getOriginalFilename().substring(mpf.getOriginalFilename().lastIndexOf("."));
            String newFilename = newFilenameBase + originalFileExtension;
            String storageDirectory = fileUploadDirectory + "/" + menu.getApplication().getRestName();
            //String contentType = mpf.getContentType();
            
            
            try {
            	File storageDirectoryFile = new File(storageDirectory);
            	if (!storageDirectoryFile.exists()) {
            		storageDirectoryFile.mkdir();
            	}
            	
                File newFile = new File(storageDirectory + "/" + newFilename);
                mpf.transferTo(newFile);
                
                BufferedImage thumbnail = Scalr.resize(ImageIO.read(newFile), 290);
                String thumbnailFilename = newFilenameBase + "-thumbnail.png";
                File thumbnailFile = new File(storageDirectory + "/" + thumbnailFilename);
                ImageIO.write(thumbnail, "png", thumbnailFile);
                
                /*
                Image image = new Image();
                image.setName(mpf.getOriginalFilename());
                image.setThumbnailFilename(thumbnailFilename);
                image.setNewFilename(newFilename);
                image.setContentType(contentType);
                image.setSize(mpf.getSize());
                image.setThumbnailSize(thumbnailFile.length());
                //image = imageDao.create(image);
                
                image.setUrl("/picture/"+image.getId());
                image.setThumbnailUrl("/thumbnail/"+image.getId());
                image.setDeleteUrl("/delete/"+image.getId());
                image.setDeleteType("DELETE");
                
                list.add(image);
                 */
                 
                // save the file as a content
                Content content;
                
                // lets get the position of this file in the submited form
                int generalPosition = getGeneralFilePosition(filePosition, request);
                String[] contentIds = request.getParameter("contentIds").split(",", -1);
                String contentIdStr = contentIds[generalPosition];
                String[] fieldIds = request.getParameter("fieldIds").split(",");
                //String[] locales = request.getParameter("locales").split(",");
                
                if (!contentIdStr.isEmpty()) {
					content = contentRepository.findOne(Integer.parseInt(contentIdStr));
				} else {
					// ignore the entire form because here we just need the localeId and fieldId
					int normalizedIndex = generalPosition % contentIds.length;
					
					content = new Content(); 
					content.setField(fieldRepository.findOne(Integer.parseInt(fieldIds[normalizedIndex])));
					//content.setLocale(locales[(int)Math.floor(generalPosition / fieldIds.length)]);
					content.setLocale(request.getParameter("currentLocale"));
					
				}
                
                content.setGroupId(request.getParameter("uniqueId"));
				content.setContent(newFilename);
				setBaseFields(content);
				
				// we wont save empty contents
				if (content.getContent() == null || content.getContent().trim().isEmpty()) continue;
				
				contentRepository.save(content);
            } catch(IOException e) {
                LOG.error("Could not upload file "+mpf.getOriginalFilename(), e);
            }
            
            filePosition++;
        }
        
		
	}

	/**
	 * Retrieves the file form position among the entire submitted form
	 * [0] String
	 * [1] BigString
	 * [2] File <== here
	 * 
	 * @param filePosition
	 * @param request
	 * @return
	 */
	private int getGeneralFilePosition(int filePosition, MultipartHttpServletRequest request) {
		int fileTypeIndex = 0;
		int generalFormIndex = 0;
		String[] fieldIds = request.getParameter("fieldIds").split(",");
		String[] contentIds = request.getParameter("contentIds").split(",", -1);
		for (int i = 0; i < contentIds.length; i++) {
			for (int j = 0; j < fieldIds.length; j++) {
				Field field = fieldRepository.findOne(Integer.parseInt(fieldIds[j]));
				if (isFileType(field)) {
					if (fileTypeIndex == filePosition) {
						return generalFormIndex; 
					}
					fileTypeIndex++;
				} 
				generalFormIndex++;
			}
		}
		return -1;
	}
	
	private boolean isFileType(Field field) {
		return field.getType().getTypeId() != null && (
				field.getType().getTypeId().equals("Image") ||
				field.getType().getTypeId().equals("Audio") ||
				field.getType().getTypeId().equals("Video") 
				);
	}
	
	/**
	 * Asynchronous method to remove unused / ghost files from the filesystem
	 */
	@Override
	//@Async
	public void removeUnusedFiles() {
		for (Application application : applicationRepository.findAll()) {
			File restFilesDirectory = new File(fileUploadDirectory + "/" + application.getRestName());
			if (restFilesDirectory.exists()) {
				for (String fileName : restFilesDirectory.list()) {
					//if there is no content for this file, remove it
					LOG.debug("Filename listed is " + fileName);
					if (fileName.contains("thumbnail")) continue;
					if (contentRepository.findByContent(fileName) == null) {
						File fileToRemove = new File(restFilesDirectory.getPath() + "/" + fileName);
						fileToRemove.delete();
					}
				}
			}
		}
	}

	/**
	 * Remove ftd (Files To Delete)
	 */
	@Override
	@Transactional
	public void removeFilesToDelete(ContentRest contentRest) {
		for (String contentStr : contentRest.getFtd().split(",")) {
			if (!contentStr.isEmpty()) {
				Content content = contentRepository.findByContent(contentStr);
				deleteFile(content);
				contentRepository.deleteByContent(contentStr);
			}
		}
		
	}

	/**
	 * Deletes the file physically from the disk
	 * @param content
	 */
	private void deleteFile(Content content) {
		String storageDirectory = fileUploadDirectory + "/" + content.getField().getMenu().getApplication().getRestName();
		File fileToRemove = new File(storageDirectory + "/" + content.getContent());
		fileToRemove.delete();
	}
	
	/**
	 * This method checks to see if the logged in user has access to that specific field
	 */
	@Override
	public boolean isAuthorized(ContentRest contentRest) {
		SecurityUser securityUser = (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		// loops through each field to save
		for (String fieldIdStr : contentRest.getFieldIds().split(",")) {
			// if user id is not associated with this application, créu!
			if (!fieldRepository.findOne(Integer.parseInt(fieldIdStr)).getMenu().getApplication().getApplicationUserIds().containsKey(securityUser.getUserId())) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * This method checks to see if the logged in user has access to that specific field
	 */
	@Override
	public boolean isAuthorized(String groupId) {
		SecurityUser securityUser = (SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for (Content content : contentRepository.findByGroupId(groupId)) {
			if (!content.getField().getMenu().getApplication().getApplicationUserIds().containsKey(securityUser.getUserId())) {
				return false;
			}
		}
		return true;
	}
	
	
	

}
