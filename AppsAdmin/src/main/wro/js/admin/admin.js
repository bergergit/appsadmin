/**
 * Old javascript, simply converted to an angular module
 */
angular.module('appsadmin.adminjs', ['appsadmin.utils'])

.factory('adminjs', ['$compile','$translate','$cookies','utils','auth', 
                     function($compile, $translate, $cookies, utils, auth) { return function() {	
	
	/**************************************
	* Script to control Applications View *
	***************************************/
	var AJAX_MAX_TRIES = 3;
	var AJAX_TIMEOUT = 5000;
	
	var menuIsBuilt = false,
		maxMenuOrder = 0,
		ajaxCurrentTry = 0,
		menuID, 
		fieldID;	
	
	
	/** Including CSRF token in all ajax requests **/
	var token = $("meta[name='_csrf']").attr("content");
	var header = $("meta[name='_csrf_header']").attr("content");
	$(document).ajaxSend(function(e, xhr, options) {
		// reseting csrf header
		if ($cookies.get(header)) {
			$("meta[name='_csrf']").attr("content", $cookies.get("XSRF-TOKEN"));
			token = $("meta[name='_csrf']").attr("content");
		}
		xhr.setRequestHeader(header, token);
	});
	
	/** Intercepting 302 redirect - meaning session is out **/
	$(document).ajaxComplete(function(e, xhr, options) {
		if (xhr.status === 401 || xhr.status === 403) {
			auth.showFlash = true;
			auth.clear();
		}
	});
	
	/** jqGrid table **/
	jQuery("#mobileApplications_list").jqGrid({
	   	url: utils.restPrefix + '/applications',
		datatype: "json",
		jsonReader : {
			root: "_embedded.applications",
			repeatitems : false
		},
		postData: "",
		mtype: 'GET',
	   	colNames:['Aplicativo',' ', ' ', ' ', '_mobileapps_application_id', '_rest_name', '_description', '_main_locale', '_supported_locales'],
	   	colModel:[
	   		{name:'name', index:'name', width:350, align:'left', resizable: false, sortable:true, formatter:linkFormatter},
	   		{name:'edit', width:50, resizable: false, sortable: false, align:'center', formatter:editFormatter},
	   		{name:'clone', width:50, resizable: false, sortable: false, align:'center', formatter:cloneFormatter},
	   		{name:'delete', width:50, resizable: false, sortable: false, align:'center', formatter:deleteFormatter},
	   		{name:'applicationId', hidden: true},
	   		{name:'restName', hidden: true},
	   		{name:'description', hidden: true},
	   		{name:'mainLocale', hidden: true},
	   		{name:'supportedLocales', hidden: true}
	   	],
	   	sortname: 'id',
	    sortorder: 'asc',   
	    sortable: false,
	    rowTotal: 500,
	    loadonce: true,
	    hidegrid: false,
		height: '100%',
		hoverrows: true,	
		beforeSelectRow: function(rowid, e) {
	    	return false;
		},
		gridComplete: function() {
			jQuery( ".gridlink" ).off().click(function() {
				openAndPopulateForm(jQuery(this).data('id'));
			});
			
			// buttons - edit   
			jQuery( ".edit" ).button({
				icons: {
		        	primary: "ui-icon-pencil"
		    	}, 	text: false    
			}).off().click(function() {
				editMenus(jQuery(this).data('id'));
			});;
			
			// buttons - clone   
			jQuery( ".clone" ).button({
				icons: {
		        	primary: "ui-icon-copy"
		    	}, 	text: false    
			});		
			
			// buttons - remove   
			jQuery( ".delete" ).button({
				icons: {
		        	primary: "ui-icon-trash"
		    	}, 	text: false    
			}).off().click(function() {
				utils.openRemoveDialog(jQuery(this).data('id'));
			});
		}
	    
	});
	
	
	jQuery(function() {
		// hidding non used divs
		jQuery(".messageTips").hide();
		jQuery("#menus").hide();
		
		// dialog - remove application
		jQuery( ".dialog" ).hide();	
		
	    jQuery( "#dialog-confirm" ).dialog({
	        resizable: false,
	        height:220,
	        width: 390,
	        modal: true,
	        autoOpen: false,
	        draggable: false,
	        title: $translate.instant('admin.dialog.title.remove'),
	        buttons: [{
	            text: $translate.instant('btn.delete'),       
	        	click: function() {            	
	                // deletes for data via DELETE       
					jQuery.ajax({  
						timeout: AJAX_TIMEOUT,
						type: 'DELETE',  
						url: utils.restPrefix + '/applications/' + mainID, 
						//data: jQuery("#editForm").serialize(),  
						success: function() {
							ajaxCurrentTry = 0;
							utils.updateTipsFixed($translate.instant('admin.msg.registry.deleted'), jQuery( "#messageText"))
							jQuery('#mobileApplications_list').jqGrid('setGridParam', {datatype:'json'});
							jQuery('#mobileApplications_list').trigger('reloadGrid');												
							jQuery( "#dialog-confirm" ).dialog( "close" );
						},					
						error: function(xhr, textStatus, errorThrown) {
					    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
					        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
					        		//try again
					                jQuery.ajax(this);
					                return;
					        	}
					       }
					       utils.updateTipsError($translate.instant('msg.registry.delete.error'), jQuery( "#dialog-form .validateTips"))
				        }
					});
	            }
	        },{
	            text: $translate.instant('btn.cancel'),
	            click: function() {
	                jQuery( this ).dialog( "close" );
	            }
	        }]
		});	
		
		// dialog - remove menu		
	    jQuery( "#dialog-confirm-menu" ).dialog({
	        resizable: false,
	        height:150,
	        width: 360,
	        modal: true,
	        autoOpen: false,
	        draggable: false,
	        title: $translate.instant('admin.dialog.title.remove'),
	        buttons: [{
	        	text: $translate.instant('btn.delete'),
	        	click: function() {            	
	                // deletes for data via DELETE
					jQuery.ajax({  
						timeout: AJAX_TIMEOUT,
						type: 'DELETE',  
						url: utils.restPrefix + '/menus/' + menuID,
						//type: 'POST',  
						//url: '<?php echo $this->restPrefix ?>/menus/d/appid/' + mainID + '/menuid/' + menuID,					  
						success: function() {
							ajaxCurrentTry = 0;
							utils.updateTipsFixed($translate.instant('admin.msg.registry.deleted'), jQuery( "#messageText"))
							rebuildMenus();
							jQuery( "#dialog-confirm-menu" ).dialog( "close" );
						},
						error: function(xhr, textStatus, errorThrown) {
					    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
					        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
					        		//try again
					                jQuery.ajax(this);
					                return;
					        	}
					       }
					       //utils.updateTipsError("<?php echo JText::_( 'MOBILEAPPS_ERROR_REGISTRY_DELETE' ) ?>", jQuery( "#dialog-form-menu .validateTips"));
					       utils.updateTipsError($translate.instant('msg.registry.delete.error'), jQuery( "#dialog-form-menu .validateTips"))
				        }  
					});
	            },
	        },{
	        	text: $translate.instant('btn.cancel'),
	            click: function() {
	                jQuery( this ).dialog( "close" );
	            }
	        }]
		});
		
		// dialog - remove field
	    jQuery( "#dialog-confirm-field" ).dialog({
	        resizable: false,
	        height:150,
	        width: 360,
	        modal: true,
	        autoOpen: false,
	        draggable: false,
	        buttons: {
	            "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_DELETE' ) ?>": function() {            	
	                // deletes for data via DELETE
					jQuery.ajax({  
						timeout: AJAX_TIMEOUT,
						type: 'POST',  
						url: '<?php echo $this->restPrefix ?>/fields/d/' + fieldID,					  
						success: function() {
							ajaxCurrentTry=0;
							utils.updateTipsFixed("<?php echo JText::_( 'MOBILESAPPS_SUCCESS_REGISTRY_DELETED' ) ?>", jQuery( "#messageText"))
							rebuildFieldGrid();						
							jQuery( "#dialog-confirm-field" ).dialog( "close" );
						},
						error: function(xhr, textStatus, errorThrown) {
					    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
					        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
					        		//try again
					                jQuery.ajax(this);
					                return;
					        	}
					       }
					       utils.updateTipsError("<?php echo JText::_( 'MOBILEAPPS_ERROR_REGISTRY_DELETE' ) ?>", jQuery( "#dialog-form-field .validateTips"))
				        } 
					});
	            },
	            "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_CANCEL' ) ?>": function() {
	                jQuery( this ).dialog( "close" );
	            }
	        }
		});
		
		// application form fields
		var applicationId = jQuery( "#mobileApplicationId" ),
			restName = jQuery( "#restName" ),
	    	name = jQuery( "#name" ),
	    	description = jQuery( "#description" ),
	    	mainLocale = jQuery( "#main_locale" ),    
	    	supportedLocales = jQuery("#h_supported_locales"),
	        allFields = jQuery( [] ).add( applicationId ).add( restName ).add( name ).add( description ).add ( mainLocale ).add( supportedLocales );
		
		// dialog - add new application
		jQuery( "#dialog-form" ).dialog({
			 	closeOnEscape: true,
			 	title: $translate.instant('admin.dialog.application.title'),
	   			open: function(event, ui) {   				 
	   				jQuery( "#dialog-form .validateTips").text('').removeClass("ui-state-error");   				
	   			},
	            autoOpen: false,
	            resizable: false,
	            height: 500,
	            width: 450,
	            modal: true,
	            buttons: [{
	            	text: $translate.instant('btn.save'),
	            	click: function() {
	                    var bValid = true;
	                    allFields.removeClass( "ui-state-error" );
	 
	                    bValid = bValid && utils.checkLength( restName, $translate.instant('form.error.length', {name: $translate.instant('admin.dialog.application.label.restName'), min: 2, max: 40}), 2, 40 );
	                    bValid = bValid && utils.checkLength( name, $translate.instant('form.error.length', {name: $translate.instant('admin.dialog.application.label.name'), min: 2, max: 40}), 2, 40 );
	                    bValid = bValid && utils.checkEmpty( mainLocale, $translate.instant('form.error.empty', {name: $translate.instant('admin.dialog.application.label.mainLocale')}));
	                                       
	 					if ( bValid ) {
	 						// builds the hidden supported_locales field
	 						supportedLocales.val("");
	 						var separator = "";
	 						jQuery(".scroll-content").each(function(index) {
	 							supportedLocales.val(supportedLocales.val() + separator + jQuery(this).data("locale"));
	 							separator = ",";
	 						}); 						
	 						
	 						// submits for data via POST
	 						jQuery.ajax({  
								url: utils.restPrefix + '/applications',
	 							timeout: AJAX_TIMEOUT,
								type: 'POST',  
								contentType: "application/json",
								data: jQuery("#editForm").serializeJSON(),  
								success: function() {
									ajaxCurrentTry = 0;
									jQuery(".messageTips").show();
									// if it's an insert, display created message, else display updated message
									if (applicationId.val() != "") {
										utils.updateTipsFixed($translate.instant('admin.msg.registry.updated'), jQuery( "#messageText"));
									} else {
										utils.updateTipsFixed($translate.instant('admin.msg.registry.created'), jQuery( "#messageText"));
									}
									jQuery('#mobileApplications_list').jqGrid('setGridParam', {datatype:'json'});
									jQuery('#mobileApplications_list').trigger('reloadGrid');												
									jQuery( "#dialog-form" ).dialog( "close" );
								},
								error: function(xhr, textStatus, errorThrown) {
									if (xhr.statusText == "error" || xhr.statusText == "timeout") {
							        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
							        		//try again
							                jQuery.ajax(this);
							                return;
							        	}
									} else if (xhr.status == 409) {	// conflict
										utils.updateTipsError($translate.instant('admin.msg.registry.duplicate.error'), jQuery( "#dialog-form .validateTips"))
									} else { // generic error
										utils.updateTipsError($translate.instant('admin.msg.registry.create.error'), jQuery( "#dialog-form .validateTips"))
									}
						        }
							});
	  					}
	                }
	            },{
	            	text:  $translate.instant('btn.cancel'),
	                click: function() {
	                    jQuery( this ).dialog( "close" );
	                }
	            }],
	            close: function() {
	                allFields.val( "" ).removeClass( "ui-state-error" );
	                removeAllLocales();                
	            }
	        });       
		
		// menu form fields
		var menuId = jQuery( "#menuId" ),
			menuRestName = jQuery( "#menuRestName" ),
	    	menuName = jQuery( "#menuName" ),
	    	menuDescription = jQuery( "#menuDescription" ),
	    	menuAppId = jQuery( "#menuAppId" ),
	    	menuParentId = jQuery( "#menuParentId" ),
	    	menuOrder = jQuery( "#menuOrder" ),
	        allMenuFields = jQuery( [] ).add( menuId ).add( menuParentId ).add( menuRestName ).add( menuName ).add( menuDescription ).add( menuOrder ).add( menuAppId );
	        tips = jQuery( ".validateTips" );        
	    
	    //dialog - new menu / submenu
	    jQuery( "#dialog-form-menu" ).dialog({
			 	closeOnEscape: true,
			 	title: $translate.instant('admin.dialog.menu.title'),
	   			open: function(event, ui) {   				 
	   				jQuery( "#dialog-form-menu .validateTips").text('').removeClass("ui-state-error");   	
	   				if (menuParentId.val() == "") {			
	   					jQuery( "#dialog-form-menu" ).dialog("option", "title", $translate.instant('admin.dialog.menu.title'));
	   				} else {
	   					parentDataNode = jQuery("#menu_" + menuParentId.val() + ".sortable-accordion");	
	   					jQuery( "#dialog-form-menu" ).dialog("option", "title", $translate.instant('admin.dialog.subMenu.title', {menu: parentDataNode.data("name")}));  
	   				}
	   			},
	            autoOpen: false,
	            resizable: false,
	            height: 420,
	            width: 450,
	            modal: true,
	            buttons: [{
	            	text: $translate.instant('btn.save'),
	                click: function() {
	                    var bValid = true;
	                    allMenuFields.removeClass( "ui-state-error" );
	 
	                    bValid = bValid && utils.checkLength( menuRestName, $translate.instant('form.error.length', {name: $translate.instant('admin.dialog.menu.label.restName'), min: 2, max: 40}), 2, 40 );
	                    bValid = bValid && utils.checkLength( menuName, $translate.instant('form.error.length', {name: $translate.instant('admin.dialog.menu.label.name'), min: 2, max: 40}), 2, 40 );
	                                                           
	 					if ( bValid ) {
	 						// builds the hidden application ID, parent and order fields
	 						//menuAppId.val(mainID);
	 						menuAppId.val(utils.restPrefix + '/applications/' + mainID);
	 						
	 						// submits for data via POST
	 						jQuery.ajax({  
	 							timeout: AJAX_TIMEOUT,
								type: 'POST',  
								url: utils.restPrefix + '/menus', 
								contentType: "application/json",
								data: jQuery("#editFormMenu").serializeJSON(),  
								success: function() {
									ajaxCurrentTry = 0;
									jQuery(".messageTips").show();
									// if it's an insert, display created message, else display updated message
									if (menuId.val() != "") {
										utils.updateTipsFixed($translate.instant('admin.msg.registry.updated'), jQuery( "#messageText"));
									} else {
										utils.updateTipsFixed($translate.instant('admin.msg.registry.created'), jQuery( "#messageText"));
									}
									rebuildMenus();											
									jQuery( "#dialog-form-menu" ).dialog( "close" );
								},
								error: function(xhr, textStatus, errorThrown) {
							    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
							        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
							        		//try again
							                jQuery.ajax(this);
							                return;
							        	}
							       } else if (xhr.status == 409) {	// conflict
										utils.updateTipsError($translate.instant('admin.msg.registry.duplicate.error'), jQuery( "#dialog-form-menu .validateTips"))
							       } else { // generic error
										utils.updateTipsError($translate.instant('admin.msg.registry.create.error'), jQuery( "#dialog-form-menu .validateTips"))
							       }
						        }							
							});
	  					}
	                }
	            },{
	            	text: $translate.instant('btn.cancel'),
	                click: function() {
	                    jQuery( this ).dialog( "close" );
	                }
	            }],
	            close: function() {
	                allMenuFields.val("").removeClass( "ui-state-error" );
	                
	                //fixing jquery bug   
	                menuId.val("");
					menuRestName.val("");
			    	menuName.val("");
			    	menuDescription.val("");
			    	menuAppId.val("");
			    	menuParentId.val("");
			    	menuOrder.val("");
			        menuName.val("");                            
	            }
	        });
	        
	        
		// Fields form fields	
		var fieldId = jQuery( "#fieldId" ),
			fieldRestName = jQuery( "#fieldRestName" ),
	    	fieldName = jQuery( "#fieldName" ),
	    	fieldLevel = jQuery( "#fieldLevel" ),
	    	fieldDescription = jQuery( "#fieldDescription" ),
	    	fieldExtras = jQuery( "#fieldExtras" ),
	    	fieldOrder = jQuery( "#fieldOrder" ),
	    	fieldFrontpage = jQuery( "#fieldFrontpage" ),
	    	fieldMenuId = jQuery( "#fieldMenuId" ),
	    	fieldType = jQuery( "#fieldType" ),
	    	
	        allMenuFields = jQuery( [] ).add( fieldId ).add( fieldRestName ).add( fieldName ).add( fieldLevel ).add( fieldDescription ).add( fieldExtras ).add( fieldOrder ).add( fieldFrontpage ).add( fieldMenuId ).add( fieldType );
	        tips = jQuery( ".validateTips" );
	         
	    
	    //dialog - new Field    
	    jQuery( "#dialog-form-field" ).dialog({
			 	closeOnEscape: true,
	   			open: function(event, ui) {   				 
	   				jQuery( "#dialog-form-field .validateTips").text('').removeClass("ui-state-error");   
	   				//menuID = fieldMenuId.val();	
	   			},
	            autoOpen: false,
	            resizable: false,
	            height: 650,
	            width: 450,
	            modal: true,
	            buttons: {
	                "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_SAVE' ) ?>": function() {
	                    var bValid = true;
	                    allMenuFields.removeClass( "ui-state-error" );
	 
	                    bValid = bValid && checkLength( fieldRestName, "<?php echo JText::sprintf( 'MOBILEAPPS_ERROR_FORM_LENGTH', JText::_( 'MOBILEAPPS_VIEW_MOBILEAPPLICATIONS_FORM_LABEL_ID' ), 2, 40 )?>", 2, 40 );
	                    bValid = bValid && checkLength( fieldName, "<?php echo JText::sprintf( 'MOBILEAPPS_ERROR_FORM_LENGTH', JText::_( 'MOBILEAPPS_VIEW_MOBILEAPPLICATIONS_FORM_LABEL_NAME' ), 2, 40 )?>", 2, 40 );
	                                                           
	 					if ( bValid ) {
	 						// submits for data via POST
	 						jQuery.ajax({  
	 							timeout: AJAX_TIMEOUT,
								type: 'POST',  
								url: '<?php echo $this->restPrefix ?>/fields', 
								data: jQuery("#editFormField").serialize(),  
								success: function() {
									ajaxCurrentTry=0;
									jQuery(".messageTips").show();
									// if it's an insert, display created message, else display updated message
									if (fieldId.val() != "") {
										utils.updateTipsFixed("<?php echo JText::_( 'MOBILESAPPS_SUCCESS_REGISTRY_UPDATED' ) ?>", jQuery( "#messageText"));
									} else {
										utils.updateTipsFixed("<?php echo JText::_( 'MOBILESAPPS_SUCCESS_REGISTRY_CREATED' ) ?>", jQuery( "#messageText"));
									}
									//rebuildMenus();
									rebuildFieldGrid();									
									jQuery( "#dialog-form-field" ).dialog( "close" );
								},
								error: function(xhr, textStatus, errorThrown) {
							    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
							        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
							        		//try again
							                jQuery.ajax(this);
							                return;
							        	}
							       }
							    	utils.updateTipsError("<?php echo JText::_( 'MOBILEAPPS_ERROR_REGISTRY_DUPLICATE' ) ?>", jQuery( "#dialog-form-field .validateTips"));
						        }	 
							});
	  					}
	                },
	                "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_CANCEL' ) ?>": function() {
	                    jQuery( this ).dialog( "close" );
	                }
	            },
	            close: function() {
	                allMenuFields.val( "" ).removeClass( "ui-state-error" );                               
	            }
	        });        
	   
		// button - add new application
		jQuery( "#addButton" )
			.button({
				icons: { primary: "ui-icon-plusthick" },
				label: $translate.instant('admin.button.addApp')
			})
			.click(function() {
				applicationId.prop('readonly', false);
				applicationId.removeClass('ui-state-disabled');	
				// default locale support
				addSupportedLocale("pt-br");
						
	        	jQuery( "#dialog-form" ).dialog( "open" );        	
	    	}); 
	    	
	    // button - add locale  
		jQuery( "#addLocale" ).button({ label: $translate.instant('btn.add')}).off()		
			.click(function(event) {
				event.preventDefault();
				addSupportedLocale();							        	
	    	});
	    	
		// button - add menu
		jQuery( "#addMenuButton" )
			.button({
				icons: { primary: "ui-icon-plusthick" },
				label: $translate.instant('admin.button.addMenu')
			})
			.click(function() {	
				//menuId.prop('readonly', false);
				//menuId.removeClass('ui-state-disabled');	
				menuOrder.val(maxMenuOrder);
								
	        	jQuery( "#dialog-form-menu" ).dialog( "open" );        	
	    	});
	});
	
	/**
	 * Adds the selected locale to the list of supported locales and removes it from the select box list
	 */
	function addSupportedLocale(locale) {
		if (locale != null) {
			jQuery("#supported_locales").val(locale);
			// will not add a locale that is already there
			if (jQuery("#supported_locales").val() != locale) {
				return;
			}
		}
		
		// appending to main locale
		jQuery("#main_locale").append(jQuery("#supported_locales option:selected").clone());
		
		var removeNode = jQuery('<span class="ui-icon ui-icon-closethick remove-locale" title="Remover"></span>')
			.click(function() {
				 removeLocale(this);
			});
		
		// adding to supported locales list
		var supportedNode = jQuery('<div class="scroll-content">')
			.append('<div class="ui-widget-content" style="width: 90%">' + jQuery("#supported_locales option:selected").text()) 
			.append(removeNode)
			.data("locale", jQuery("#supported_locales").val());
		jQuery(".scroll-pane").append(supportedNode);
			
		// removing from supported locales select
		jQuery("#supported_locales option:selected").remove();
		
		// disable button if supported locales select is empty
		if (jQuery("#supported_locales option").length == 0) {
			jQuery( "#addLocale" ).prop("disabled", true);
		}
	}
	
	function removeLocale(obj) {	
		// adds element back to suppported locales	
		jQuery("<option value=\"" + jQuery(obj).parent().data("locale") + "\">" + 
			jQuery(obj).parent().children(".ui-widget-content").text() + "</option>").appendTo("#supported_locales");
			
		// removes element from main locale
		jQuery("#main_locale option[value='" + jQuery(obj).parent().data("locale") + "']").remove();
		
		// removes DIV element
		jQuery(obj).parent().remove();
	}
	
	function removeAllLocales() {
		jQuery(".remove-locale").each(function(index) {
			removeLocale(this);
		});
	}
	
	/**
	 * Populates the Application Form and show the dialog  
	 */
	function openAndPopulateForm(index) {
		var row = jQuery("#mobileApplications_list").jqGrid('getGridParam', 'data')[index];
		
		jQuery("#mobileApplicationId").val(row.applicationId)
		
		jQuery("#restName").val(row.restName);
			
		jQuery("#name").val(row.name);
		jQuery("#description").val(row.description);
			
		var supportedLocales = jQuery("#h_supported_locales");
		supportedLocales.val(row.supportedLocales);
		
		// adding supported locales	
		jQuery.each(supportedLocales.val().split(","), function(index, value) {
			addSupportedLocale(value);
		});
		
		jQuery("#main_locale").val(row.mainLocale);
		
		jQuery( "#dialog-form" ).dialog( "open" );
	}
	
	function openAndPopulateFormMenu(obj) {
		var dataNode = obj.parents(".sortable-accordion");
		
		//jQuery("#menuAppId").val(dataNode.data("application"));
		jQuery("#menuId").val(dataNode.data("menuId"));
		jQuery("#menuParentId").val(dataNode.data("menuParentId"));
		
		jQuery("#menuRestName").val(dataNode.data("restName"));
			
		jQuery("#menuName").val(dataNode.data("name"));
		jQuery("#menuDescription").val(dataNode.data("description"));
		jQuery("#menuOrder").val(dataNode.data("menuOrder"));
		
		jQuery( "#dialog-form-menu" ).dialog( "open" );
	}
	
	function openAndPopulateFormField(index, menu_id) {		
		var row = jQuery(".fieldGrid#grid_" + menu_id).jqGrid('getGridParam', 'data')[index];
		menuID = menu_id;
		
		//node = jQuery("#menu_" + menu_id + ".sortable-accordion");	
		//addField(node);
		
		setMaxFieldLevel(jQuery("#grid_" + row.mobileapps_menu_menu_id), jQuery("#fieldLevel"));
		
		jQuery("#fieldId").val(row.mobileapps_field_id);
		jQuery("#fieldMenuId").val(row.mobileapps_menu_menu_id);
		jQuery("#fieldType").val(row.mobileapps_type_type_id);	
		jQuery("#fieldName").val(row.name);
		jQuery("#fieldRestName").val(row.rest_name);
		jQuery("#fieldOrder").val(row.order);	
		jQuery("#fieldLevel").val(row.level);
		jQuery("#fieldFrontpage").prop('checked', row.frontpage);	
		jQuery("#fieldFrontpage").val('true');
		jQuery("#fieldExtras").val(row.extras);
		jQuery("#fieldDescription").val(row.description);
		
		jQuery( "#dialog-form-field" ).dialog( "open" );
	}
	
	
	function addField(obj) {
		var dataNode = obj.parents(".sortable-accordion");	
		menuID = dataNode.data("menu_id");
		var fieldGrid = jQuery("#grid_" + dataNode.data("menu_id"));
		
		setMaxFieldLevel(fieldGrid, jQuery("#fieldLevel"));
		
		jQuery("#fieldMenuId").val(dataNode.data("menu_id"));
		jQuery("#fieldOrder").val(fieldGrid.jqGrid('getGridParam', 'records'));
		jQuery("#fieldFrontpage").prop('checked', true);
		jQuery("#fieldFrontpage").val('true');
		
		jQuery( "#dialog-form-field" ).dialog( "open" );
	}
	
	
	/**
	 * Sets the maximum level for Fields 
	 */
	function setMaxFieldLevel(grid, obj) {
		var maxLevel = -1;
		obj.html("").append('<option value="0">0</option>');
		grid.getDataIDs().each(function (value, index) {		
			var level = grid.jqGrid('getGridParam', 'data')[index].level;
			if (level > maxLevel) {
				maxLevel = level;
				obj.append('<option value="' + (parseInt(level) + 1) + '">' + (parseInt(level) + 1) + '</option>');
			}		
		});
	}
	
	function addSubmenu(obj) {
		//openAndPopulateFormMenu(obj);
		var dataNode = obj.parents(".sortable-accordion");
		jQuery("#menuParentId").val(dataNode.data("menu_id"));
		jQuery("#menuOrder").val(dataNode.children(".wrapper").children(".sortable-accordion").length);
		
		jQuery( "#dialog-form-menu" ).dialog( "open" );
	}
	
	/**
	 *Shows the Menus section and builds the accordion 
	 */
	function editMenus(appid) {
		mainID = appid;
		jQuery("#main").hide();	
		jQuery("#accordion").html("");
		
		//if (!menuIsBuilt) {
			maxMenuOrder = 0;
			menuIsBuilt = true;
			jQuery("#menus").spin({
				top: '20px',
				left: '200px'
			});	
			jQuery.ajax({
		        type: 'GET',
		        //url: '<?php echo $this->restPrefix ?>/menus/appid/' + appid + '/withfields',
		        url: utils.restPrefix + '/applications/' + appid + '/menus',
		        dataType: "json",
		        timeout: AJAX_TIMEOUT,
		        success: function(data) {
		        	ajaxCurrentTry = 0;
		        	jQuery("#menus").spin(false);
		            buildAccordion(data);          
		        }, 
		        error: function(xhr, textStatus, errorThrown) {
			        if (xhr.statusText == "error" || xhr.statusText == "timeout") {
			        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
			        		//try again
			        		//console.debug("Ajax Error. Trying again", xhr);
			                jQuery.ajax(this);
			                return;
			        	}
			       }
		        }
		    });
		//}
		
		populateType();
		jQuery('#editApplications').off().click(editApplications);
		jQuery("#menus").show();	
		
	}
	
	/**
	 *Rebuilds the menu with new json data 
	 */
	function rebuildMenus() {
		menuIsBuilt = false;
		jQuery("#accordion").html("");
		editMenus(mainID);
	}
	
	/**
	 * Shows the Applications section 
	 */
	function editApplications() {
		jQuery(".messageTips").hide();	
		jQuery("#menus").hide();	
		jQuery("#main").show();	
	}
	
	/**
	 *Builds the entire DOM of accordion based on the received data 
	 */
	function buildAccordion(data) {	
		// builds the accordion structure
		jQuery.each(data._embedded.menus, function(index, row) {
			var node = getAccordionNode();
			
			// adding menu_id and parent_id data
			node.data({
				//"application": row._links.application.href,
				"menuId": row.menuId,
				"restName": row.restName,
				"menuParentId": row.menuParentId,
				"name": row.name,
				"description": row.description,
				"menuOrder": row.menuOrder,
				"expanded": false
			})		
				
			node.attr("id", "menu_" + row.menuId);
			jQuery("#title", node).text(row.name + " (" + row.restName + ")");
			jQuery("#accordion").append(node);
			buildFieldGrid(row);
		});		
	
		// rearange submenus	
		jQuery.each(data._embedded.menus, function(index, row) {	
			if (row.menuParentId != null) {
				node = jQuery("#menu_" + row.menuId + ".sortable-accordion");			
				contentWrapper = jQuery("#menu_" + row.menuParentId + ".sortable-accordion").children(".wrapper");			
				
				// if no children, indent
				if (contentWrapper.find("h3").length == 0) {
					var indent = contentWrapper.data("indent") == null ? 20 : contentWrapper.data("indent") + 20;
					contentWrapper.data("indent", indent)				
					contentWrapper.css("margin-left", indent + "px");
				}			
	
				// appends menu to other menu (submenu)
				contentWrapper.append(node);			
				makeSortable(contentWrapper);
			} else {
				maxMenuOrder++;
			}
		});	
		    	
	    // Accordion function
	    utils.makeAccordion(jQuery('#accordion .head'));
	   		
		// Sortable function
		makeSortable(jQuery('#accordion'));
		
		// adds empty message to empty nodes
		addEmptyMessage("<?php echo JText::_( 'MOBILESAPPS_INFO_EMPTY' ) ?>");	
		
		// Accordion link - edit menu
		jQuery( ".editMenu" ).click(function() {
			openAndPopulateFormMenu(jQuery(this));
		});	
		
		// Accordion button - remove menu
		jQuery( ".removeMenu" )
			.button({
				icons: { primary: "ui-icon-trash" }, text: false
			})
			.click(function(event) {
				menuID = jQuery(event.target).parents(".sortable-accordion").data("menuId");		
	        	jQuery( "#dialog-confirm-menu" ).dialog( "open" );        	
	    	}); 
		
		// Accordion button - add field
		jQuery( ".addField" )
			.button({
				icons: { primary: "ui-icon-circle-plus" }, 	text: false
			})
			.click(function() {					
	        	addField(jQuery(this));        	
	    	}); 
	    	
	    // Accordion button - add submenu
		jQuery( ".addSubmenu" )
			.button({
				icons: { primary: "ui-icon-newwin" }, text: false
			})
			.click(function() {				
				addSubmenu(jQuery(this));        	        	
	    	});    	
	}
	
	/**
	 * Make a node sortable 
	 */
	function makeSortable(node) {
		node.sortable({
			delay: 50,
			distance: 5,
			opacity: 0.8,
			items: "> div",
			connectWith: ".sortable-accordion",
			
			update: function(event, ui) {			
				// updates order of each element
				var delimiter = "", menuIds = "", menuOrders = "";
				jQuery(ui.item.parent().children(".sortable-accordion")).each(function(index) {
					jQuery(this).data("order", index);
					
					menuIds += delimiter + jQuery(this).data("menu_id");
					menuOrders += delimiter + jQuery(this).data("order");
					delimiter = ",";
				});					
				
				// send order update to server
				jQuery.ajax("<?php echo $this->restPrefix ?>/menus/updateorder/" + menuIds + "/orders/" + menuOrders,
					{type: 'PUT'}
				);			
			},
		});
		node.disableSelection();	
	}
	
	function addEmptyMessage() {
		jQuery('.sortable-accordion .wrapper:empty').html("<div class='emptyMessage'><?php echo JText::_( 'MOBILESAPPS_INFO_EMPTY' ) ?></div>");
	}
	
	/**
	 * Creates the Accordion Node 
	 */
	function getAccordionNode(data) {
		return jQuery('<div class="sortable-accordion">' +
				'<h3 class="head ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-corner-all" role="tab">' +  	
		    	'<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>' +	    		
		    	'<a href="#" id="title" class="editMenu"></a>' +  
		    	'<button class="removeMenu accordion-button">Remover Menu</button>' +
		    	'<button class="addSubmenu accordion-button">Adicionar Submenu</button>' +  	
		    	'<button class="addField accordion-button">Adicionar Campo</button>' +	    	
		    	'</h3>' +
		   		'<div class="wrapper"></div></div>');
	}
	
	/** 
	 * Populates Type select box 
	 */
	function populateType() {
	   jQuery.ajax({  
			timeout: AJAX_TIMEOUT,
			type: 'GET',  
			url: utils.restPrefix + '/types', 
			success: function(data) {
				ajaxCurrentTry=0;
				var options = [];
				//jQuery.each(data.response, function(index, val) {
				jQuery.each(data, function(index, val) {
					options.push('<option value="' + val.mobileapps_type_id + '">' + val.mobileapps_type_id + '</option>');
				});
				jQuery("#fieldType").html(options);
			},
			error: function(xhr, textStatus, errorThrown) {
		    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
		        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
		        		//try again
		                jQuery.ajax(this);
		                return;
		        	}
		       }
	        }	 
		});
	}
	
	function buildFieldGrid(data) {
		if (data.fields.length > 0) {	
			// removes empty word if exists
			jQuery("#menu_" + data.mobileapps_menu_id + " .wrapper .emptyMessage").first().remove();
			
			/** jqGrid fields table **/
			var tableGrid = jQuery("<table class='fieldGrid' id=grid_" + data.mobileapps_menu_id + "></table>");
			jQuery("#menu_" + data.mobileapps_menu_id + " .wrapper").first().prepend(tableGrid);
			jQuery(".fieldGrid#grid_" + data.mobileapps_menu_id)
			.jqGrid({	   	
				datatype: "local",		
				data: data.fieldSet,
			   	//colNames:['Nome',' '],
			   	colModel:[
			   		{name:'name', index:'name', width:350, align:'left', resizable: false, sortable:true, formatter:editFieldFormatter},		   		
			   		{name:'deleteField', width:35, resizable: false, sortable: false, fixed: true, align:'center', formatter:deleteFieldFormatter},
			   		{name:'mobileapps_field_id', hidden: true},
			   		{name:'mobileapps_menu_menu_id', hidden: true},
			   		{name:'rest_name', hidden: true},
			   		{name:'level', hidden: true},
			   		{name:'order', hidden: true},
			   		{name:'frontpage', hidden: true},
			   		{name:'extras', hidden: true},
			   		{name:'description', hidden: true}
			   	],
			    sortable: false,
			    autowidth: true,
			    rowTotal: 150,		    
			    loadonce: true,
			    hidegrid: false,	    
				height: "100%",			
				hoverrows: true,	
				beforeSelectRow: function(rowid, e) {
			    	return false;
				},
				gridComplete: function() {
					jQuery(this).parents("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();		
					// buttons - remove   
					jQuery( ".deleteField" ).button({
						icons: {
				        	primary: "ui-icon-trash"
				    	}, 	text: false    
					});	
					jQuery(this).jqGrid('setGridHeight', jQuery(this).height());				
				}			
			});
			
			jQuery(".fieldGrid#grid_" + data.mobileapps_menu_id).sortableRows({
				delay: 50,
				update: function(event, ui) {
					// updates order of each element
					var delimiter = "", fieldIds = "", fieldOrders = "";
					thisMenuId = ui.item.parents(".sortable-accordion").data("menu_id");
					thisGrid = jQuery(".fieldGrid#grid_" + thisMenuId);
					
					thisGrid.jqGrid('getDataIDs').each(function(row, index) {
						fieldIds += delimiter + thisGrid.jqGrid('getRowData', row).mobileapps_field_id;
						fieldOrders += delimiter + index;
						delimiter = ",";
					});	
					
					//console.debug("fieldIds", fieldIds)
					
					// sends order update to server
					jQuery.ajax("<?php echo $this->restPrefix ?>/fields/updateorder/" + fieldIds + "/orders/" + fieldOrders,
						{type: 'PUT'}
					);	        	
		        }
			});
		} 
	}
	
	/**
	 *Rebuilds the Field Grid for the received Menu 
	 */
	function rebuildFieldGrid() {
	   jQuery.ajax({  
			timeout: AJAX_TIMEOUT,
			type: 'GET',  
			url: '<?php echo $this->restPrefix ?>/menus/' + menuID, 
			success: function(data) {
				ajaxCurrentTry=0;
				jQuery(".fieldGrid#grid_" + data.response.mobileapps_menu_id).jqGrid('GridDestroy');
				addEmptyMessage("<?php echo JText::_( 'MOBILESAPPS_INFO_EMPTY' ) ?>");		
				buildFieldGrid(data.response);
			},
			error: function(xhr, textStatus, errorThrown) {
		    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
		        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
		        		//try again
		                jQuery.ajax(this);
		                return;
		        	}
		       }
	        }	 
		});
	}
	
	/**
	 * Opens delete field dialog
	 */
	function openRemoveFieldDialog(field_id, menu_id) {
		fieldID = field_id;
		menuID = menu_id;		
		jQuery("#dialog-confirm-field").show().dialog("open");
	}
	
	/**
	 * Formats the Application Name to be an Edit link 
	 */
	function linkFormatter(cellvalue, options, rowObject) {	
		return '<a class="gridlink" href="#" data-id="' + (options.rowId - 1) + '" style="display: block">' + cellvalue + ' (' + rowObject.restName + ')</a>';
	}
	
	/**
	 * Formats the Edit icon 
	 */
	function editFormatter(cellvalue, options, rowObject) {
		return "<button class=\"edit\" data-id=\"" + rowObject.applicationId + "\">" + $translate.instant('admin.applications.button.edit') + "</button>";
	}
	
	/**
	 * Formats the Clone icon 
	 */
	function cloneFormatter(cellvalue, options, rowObject) {
		return "<button class=\"clone\" onclick=\"openRemoveDialog('" + rowObject.applicationId + "')\">" + $translate.instant('admin.applications.button.clone') + "</button>";
	}
	
	/**
	 * Formats the Delete icon 
	 */
	function deleteFormatter(cellvalue, options, rowObject) {
		return "<button class=\"delete\" data-id=\"" + rowObject.applicationId + "\">" + $translate.instant('btn.delete') + "</button>";
	}
	
	/**
	 * Formats the Delete Field Icon 
	 */
	function deleteFieldFormatter(cellvalue, options, rowObject) {
		return "<button class=\"deleteField\" onclick=\"openRemoveFieldDialog('" + rowObject.mobileapps_field_id + "','" + rowObject.mobileapps_menu_menu_id + "')\"><?php echo JText::_( 'MOBILEAPPS_VIEW_FIELD_IMAGE_TITLE_REMOVE_FIELD' ) ?></button>";
	}
	
	/**
	 * Formats the Field Name to be an Edit link 
	 */
	function editFieldFormatter(cellvalue, options, rowObject) {
		editFieldLink = "";
		if (rowObject.level > 0) {
			editFieldLink += '<span class="level-icon ui-icon ui-icon-arrowreturn-1-e"  style="margin-left: ' + ((rowObject.level - 1)* 20) + 'px"></span>';
		}	
		editFieldLink += '<a href="#" onclick="openAndPopulateFormField(' + (options.rowId - 1) + ',' + rowObject.mobileapps_menu_menu_id + ')" style="display: block; margin-left: ' + (rowObject.level * 20) + 'px">' + cellvalue + ' (' + rowObject.rest_name + ')</a>';
		return editFieldLink;
	}

}}]);


