/**
 * Old javascript, simply converted to an angular module
 */
angular.module('appsadmin.frontendjs', ['appsadmin.utils'])

.factory('frontendjs', ['$compile','$translate','$cookies','$routeParams','utils','auth', 
                     function($compile, $translate, $cookies, $routeParams, utils, auth) { return function() {	
                    	 
	 /**************************************
	 * Script to control Applications User View *
	 ***************************************/
	 var AJAX_MAX_TRIES = 3;
	 var AJAX_TIMEOUT = 5000;
	 var MAIN_LOCALE = 'en';	// defaults to en and cab be overriden by initialize 
	 var SUPPORTED_LOCALES = 'en';
	 var jsonData;	// holds the entire content object data
	 var hasFile = false;
	 var lang = window.navigator.language || window.navigator.userLanguage; 
	 
	 utils.includeCsrf();

	 // starts when DOM is ready
	 jQuery(function() {
	 	initialize($routeParams.applicationId);
	 });

	 /**
	  * Initializes and display Menus and Contents 
	  */
	 function initialize(appid) {
	 	//console.debug("Initializing...", appid);
	 	jQuery("#accordion").html("");
	 	jQuery("#dialog-form-content").hide();
	 	jQuery("#dialog-confirm-content").hide();		
	 	jQuery(".messageTips").hide();
	 	removeDialog(); 
	 	
	 	jQuery("#main-content").spin({
	 		//top: '20px',
	 		//left: '100px'
	 	});	
	 	jQuery.ajax({
	         type: 'GET',
	         //url: '<?php echo $this->restPrefix ?>/contents/full/app/' + appid + "/inlocale/<?php echo $this->inLocale ?>",
	         //url: utils.restPrefix + '/contents/full/app/' + appid,
	         url: utils.restPrefix + '/applications/' + appid,
	         dataType: "json",
	         timeout: AJAX_TIMEOUT,
	         success: function(data) {
	        	console.debug('data', data);
	         	ajaxCurrentTry = 0;
	         	jsonData = data;
	         	jQuery("#main-content").spin(false);
	         	//jQuery("span.maintitle").text(data.name);
	         	
	             buildAccordion(data); 
	             contentDialog(data);    
	             //jQuery("#h_uniqueId").val(data.response.uniqueId);
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
	  *Builds the entire DOM of accordion based on the received data 
	  */
	 function buildAccordion(data) {	
	 	MAIN_LOCALE = data.mainLocale,
	 	SUPPORTED_LOCALES = data.supportedLocales;
	 	
	 	// builds the accordion structure
	 	if (data._embedded && data._embedded.menus) {
		 	jQuery.each(data._embedded.menus, function(index, row) {
		 		var node = getAccordionNode(row);
		 		
		 		// adding menu_id and parent_id data
		 		node.data({
		 			"menuId": row.menuId,
		 			"restName": row.restName,
		 			"menuParentId": row.menuParentId,
		 			"name": row.name,
		 			"description": row.description,
		 			"menuOrder": row.menuOrder,
		 			"expanded": false
		 		})		
		 			
		 		node.attr("id", "menu_" + row.menuId);
		 		jQuery("#title", node).text(row.name);
		 		jQuery("#accordion").append(node);
		 		buildContentGrid(row);
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
		 		} 
		 	});	
	 	}
	 	    	
	     // Accordion function
	     utils.makeAccordion(jQuery('#accordion .head'));
	     
	 	// adds empty message to empty nodes
	 	utils.addEmptyMessage($translate.instant('frontend.label.empty'));	
	 	
	 	// Accordion button - add content
	 	jQuery( ".addContent" )
	 		.button({
	 			icons: { primary: "ui-icon-document" }, text: false
	 		})
	 		.click(function() {        	
	         	addContent(jQuery(this), data);        	
	     	}); 
	     	
	 }

	 /**
	  * Creates the Accordion Node 
	  */
	 function getAccordionNode(data) {
	 	return jQuery('<div class="sortable-accordion">' +
	 			'<h3 class="head ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-corner-all" role="tab">' +  	
	 	    	'<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>' +	    		
	 	    	'<a href="#" id="title"></a>' +  
	 	    	'<button class="addContent accordion-button">'+ $translate.instant('frontend.btn.addContent') + data.name + '\"</button>' +	    	
	 	    	'</h3>' +
	 	   		'<div class="wrapper"></div></div>');
	 }

	 function canToggle(event) {
	 	return jQuery(event.target).parent()[0].tagName != "BUTTON";
	 }

	 function buildContentGrid(data) {
		 console.debug('buildContentGrid data', data)
	 	var gridId = ".fieldGrid#grid_" + data.menuId;

	 	if (data.fields.length > 0 && jQuery(gridId).length == 0) {	
	 		columns = getColumns(data);
	 		
	 		/** jqGrid fields table **/
	 		var tableGrid = jQuery("<table class='fieldGrid' id=grid_" + data.menuId + "></table>");
	 		jQuery("#menu_" + data.menuId + " .wrapper").first().prepend(tableGrid);
	 		
	 		jQuery(gridId).jqGrid({	   	
	 			datatype: "local",		
	 			//data: data.fieldSet,
	 		   	colNames: columns.colNames,
	 		   	colModel: columns.colModels,
	 		    sortable: false,
	 		    autowidth: true,
	 		    rowTotal: 150,		    
	 		    loadonce: true,
	 		    hidegrid: false,	    
	 			height: "100%",			
	 			hoverrows: true,	
	 			jsonReader : {
	     			repeatitems : false,
	     			root: "response",
	     		},
	 			beforeSelectRow: function(rowid, e) {
	 		    	return false;
	 			},
	 			gridComplete: function() {
	 				formatGridButtons() ;
	 			}			
	 		});
	 	}
	 		
	 	setContentsInGrid(data, gridId);
	 }

	 /**
	  * The funky function that sets contents into the content grid 
	  */
	 function setContentsInGrid(data, gridId) {
		console.debug('setContentsInGrid data', data);
	 	
		var hasContent = false;
	 	jQuery(gridId).jqGrid("clearGridData", true);
	 	// adding content for each field
	 	if (data.fields && data.fields.length > 0 && data.fields.contents && data.fields.contents > 0) {
		 	jQuery.each(data.fields, function(index, field) {					
		 		jQuery.each(field.contents, function(index2, content) {
		 			datarow = {};		
		 			// hidden field with content for the update option
		 			datarow[field.restName + "_" + content.locale] = content.content;
		 			datarow[field.restName + "_" + content.locale + "@id"] = content.contentId;
		 			if (content.locale == MAIN_LOCALE) {	
		 				hasContent = true;	
		 				row = jQuery(gridId).jqGrid('getRowData', content.groupId);		
		 				if (jQuery.isEmptyObject(row)) {
		 					// add edit and delete row
		 					jQuery(gridId).jqGrid('addRowData', content.groupId, {
		 						"_edit": content.groupId,
		 						"_delete": content.groupId,
		 						"group_id": content.groupId
		 					});
		 				}
		 				
		 				datarow[field.restName] = content.content;
		 			}	
		 			
		 			jQuery(gridId).jqGrid('setRowData', content.groupId, datarow);		
		 		});						
		 	});
	 	}
	 	
	 	if (hasContent) {
	 		// removes empty word if exists
	 		jQuery("#menu_" + data.menuId + " .wrapper .emptyMessage").first().remove();
	 		
	 		formatGridButtons();
	 		//jQuery(gridId).jqGrid('setGridHeight', jQuery(gridId).height());	
	 	} else {
	 		// no content for anything? destroy the grid
	 		//jQuery(gridId).jqGrid("GridDestroy");		
	 		try {
				jQuery.jgrid.gridDestroy(gridId);
			} catch (e) {}
	 	}
	 }

	 /**
	  * Returns an array of column objects, containing column Titles and Names 
	  */
	 function getColumns(data) {
	 	columns = {};
	 	
	 	colNamesArray = [];
	 	colModelsArray = [];
	 	
	 	// adding edit column 
	 	colNamesArray.push(" ");
	 	colModel = {};
	 	colModel.name = '_edit';
	 	colModel.width = 25;
	 	colModel.align = 'center';
	 	colModel.resizable = false;
	 	colModel.sortable = false;
	 	colModel.formatter = editFormatter;
	 	colModelsArray.push(colModel);
	 	
	 	// adding fields columns
	 	jQuery.each(data.fields, function(index, row) {
	 		//if (row.frontpage) {
	 			colNamesArray.push(row.name);
	 			
	 			colModel = {};
	 			colModel.name = row.restName;
	 			colModel.index = row.restName;
	 			colModel.align = 'left';
	 			colModel.resizable = false;
	 			colModel.sortable = true;
	 			colModel.cellattr = function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' };
	 			colModel.hidden = !row.frontpage;
	 			colModel.formatter = function(cellvalue, options, rowObject) {
	 				return buildFilePreview(cellvalue, row, "");
	 			}
	 			colModelsArray.push(colModel);
	 			
	 			// hidden columns with content for each language, for update
	 			jQuery.each(SUPPORTED_LOCALES.split(","), function(index, locale) {
	 				colNamesArray.push(" ");
	 				colModel = {};
	 				colModel.name = row.restName + "_" + locale;
	 				colModel.hidden = true;
	 				colModelsArray.push(colModel);
	 				
	 				colNamesArray.push(" ");
	 				colModel = {};
	 				colModel.name = row.restName + "_" + locale + "@id";
	 				colModel.hidden = true;
	 				colModelsArray.push(colModel);
	 			});
	 		//}
	 	});
	 	
	 	// adding delete column 
	 	colNamesArray.push(" ");
	 	colModel = {};
	 	colModel.name = '_delete';
	 	colModel.width = 25;
	 	colModel.align = 'center';
	 	colModel.resizable = false;
	 	colModel.sortable = false;
	 	colModel.formatter = deleteFormatter;
	 	colModelsArray.push(colModel);
	 	
	 	// group_id column
	 	colNamesArray.push(" ");
	 	colModel = {};
	 	colModel.name = 'groupId';
	 	colModel.hidden = true;
	 	colModelsArray.push(colModel);
	 	
	 	columns.colNames = colNamesArray;
	 	columns.colModels = colModelsArray;
	 	
	 	return columns;	
	 }

	 /**
	  * Builds the content dialog 
	  */
	 function contentDialog(data) {
		 console.debug('contentDialog data', data);
	 	// creates one tab for each language	
	 	jQuery("#dialog-form-content #tabs").html("").append("<ul></ul>");
	 	jQuery.each(data.supportedLocales.split(","), function(index, value) {
	 		if (value == data.mainLocale) {
	 			jQuery("#dialog-form-content #tabs ul").prepend("<li><a href='#tabs-" + value + "'><em>" + $translate.instant('frontend.label.default') + "</em> - " + $translate.instant('locales.' + value) + "</a></li>");
	 			//jQuery("#dialog-form-content #tabs ul").prepend("<li><a  data-target='#tabs-" + value + "'><em>" + $translate.instant('frontend.label.default') + "</em> - " + $translate.instant('locales.' + value) + "</a></li>");
	 		} else {
	 			jQuery("#dialog-form-content #tabs ul").append("<li><a href='#tabs-" + value + "'>" + $translate.instant('locales.' + value) + "</a></li>");
	 			//jQuery("#dialog-form-content #tabs ul").append("<li><a data-target='#tabs-" + value + "'>" + $translate.instant('locales.' + value) + "</a></li>");
	 		}
	 		jQuery("#dialog-form-content #tabs").append("<div id='tabs-" + value + "'></div>");
	 	});
	 	
	 	//jQuery('#dialog-form-content #tabs ul li a').attr('href', '#');
	 	jQuery(".dialog-form-content #tabs").tabs( {selected: 0});
	 	
	 	// dialog - add new content
	 	jQuery( "#dialog-form-content" ).dialog({
	 	 	closeOnEscape: true,
	 	 	title: $translate.instant('frontend.dialog.content.title'),
	 		open: function(event, ui) {
	 			jQuery( "#dialog-form-content .validateTips").text('');			
	 			jQuery(".dialog-form-content #tabs").tabs( {active: 0});			
	 		},
	 		show: {
	 			effect: "scale",
	 			duration: "fast"
	 		},
	 		hide: {
	 			effect: "scale",
	 			duration: "fast"
	 		},
	         autoOpen: false,
	         resizable: false,
	         //height: 620,
	         width: 650,
	         modal: true,
	         dialogClass: 'dynamic-dialog',
	         buttons: [{
	        	 text: $translate.instant('btn.save'),
	             click: function() {
	                 var bValid = true;
	                 jQuery("#dialog-form-content #tabs fieldset input, #dialog-form-content #tabs fieldset textarea").removeClass( "ui-state-error" );
	                 
	                 // since this form is dynamic, it will require only frontpage fields in the main language
	                 // iterate through tabs
	                 jQuery.each(data.supportedLocales.split(","), function(index, value) {
	                 	// iterate through fieldsset
	                 	jQuery("#dialog-form-content #tabs-" + value + " fieldset").children().each(function(index2) {
	                 		if (isFieldMandatory(this) && value == data.mainLocale) {
	                 			// TODO - validar se campo file é vazio de forma diferente.
	                 			bValid = bValid && checkEmpty( jQuery(this).children("input").first(), "<?php echo JText::_( 'MOBILEAPPS_ERROR_FORM_EMPTY' )?>".replace("%s", jQuery(this).text()));

	                 			// focus the tab
	                 			if (!bValid) {            			
	                            		jQuery("#dialog-form-content #tabs").tabs( { selected: index } );
	                            	}
	                 			return bValid;     			
	                 		}
	                 	});	
	                 	
	                 	return bValid;
	                 });
	                 
	 				if ( bValid ) {			
	 					// submits for data via POST
	 					//console.debug("serialized data", jQuery("#editFormContent").serialize());
	 					submitContent();
	 				}
	             },
	         },{
	        	 text: $translate.instant('btn.cancel'),
	             click: function() {
	                 jQuery( this ).dialog( "close" );
	             }
	         }],
	         close: function() {
	             //allFields.val( "" ).removeClass( "ui-state-error" );
	             jQuery("#dialog-form-content #tabs fieldset").children().val("").removeClass("ui-state-error");
	             jQuery( "#progressbar" ).progressbar();
	             jQuery( "#progressbar" ).progressbar("destroy");
	                             
	         }
	     });      
	 }

	 /**
	  *Submits the content 
	  */
	 function submitContent() {
	 	// waits for all files are submited
	 	if (hasFile) {
	 		jQuery("#editFormContent").find(".file").each(function(index, inputField) {
	 			data = jQuery(inputField).data();
	 			if (data) {
	 				data.submit();
	 			}
	 		});
	 		
	 		setTimeout(function() {
	 			submitContent();
	 		}, 500);
	 	} else {
	 		jQuery.ajax({  
	 			timeout: AJAX_TIMEOUT,
	 			type: 'POST',  
	 			url: '<?php echo $this->restPrefix ?>/contents', 
	 			data: jQuery("#editFormContent").serialize(),  
	 			success: function(sucessData) {
	 				ajaxCurrentTry = 0;
	 				jQuery(".messageTips").show();
	 				// if it's an insert, display created message, else display updated message
	 				//console.debug("jQuery(\"#h_contents\").val()", jQuery("#h_contents").val().replace(/,/g, "");
	 				if (jQuery("#h_contents").val().replace(/,/g, "") == "") {
	 					updateTipsFixed("<?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_CREATED' ) ?>", jQuery( "#messageText"));
	 				} else {
	 					updateTipsFixed("<?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_UPDATED' ) ?>", jQuery( "#messageText"));
	 				}
	 				
	 				buildContentGrid(sucessData.response, ".fieldGrid#grid_" + sucessData.menuId);	
	 				//jQuery("#h_uniqueId").val(sucessData.response.uniqueId);	
	 				jsonData.response.uniqueId = sucessData.response.uniqueId;										
	 				jQuery( "#dialog-form-content" ).dialog( "close" );
	 			},
	 			error: function(xhr, textStatus, errorThrown) {
	 		    	if (xhr.statusText == "error" || xhr.statusText == "timeout") {
	 		        	if (ajaxCurrentTry++ < AJAX_MAX_TRIES) {
	 		        		//try again
	 		                jQuery.ajax(this);
	 		                return;
	 		        	}
	 		       }
	 		       updateTipsError("<?php echo JText::_( 'MOBILEAPPS_ERROR_REGISTRY_CREATE' ) ?>", jQuery( "#dialog-form-content .validateTips"))
	 	        }
	 		});
	 	}
	 }

	 /**
	  *Builds the remove confirmation dialog 
	  */
	 function removeDialog() {
	 	jQuery( ".dialog" ).hide();	
	     jQuery( "#dialog-confirm-content" ).dialog({
	    	 title: $translate.instant('admin.dialog.title.remove'),
	         resizable: false,
	         height:160,
	         width: 380,
	         modal: true,
	         autoOpen: false,
	         draggable: false,
	         show: {
	 			effect: "scale",
	 			duration: 100,
	 		},
	 		hide: {
	 			effect: "scale",
	 			duration: 100
	 		},
	         buttons: {
	             "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_DELETE' ) ?>": function() {            	
	                 // deletes for data via DELETE       
	 				jQuery.ajax({  
	 					type: 'POST',  
	 					url: '<?php echo $this->restPrefix ?>/contents/d/group_id/' + mainID, 
	 					success: function(sucessData) {
	 						updateTipsFixed("<?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_SUCCESS_REGISTRY_DELETED' ) ?>", jQuery( "#messageText"))
	 						buildContentGrid(sucessData.response, ".fieldGrid#grid_" + sucessData.menuId);	
	 						utils.addEmptyMessage($translate.instant('frontend.label.empty'));											
	 						jQuery( "#dialog-confirm-content" ).dialog( "close" );
	 					},
	 					error: function(errorObj) {
	 						updateTipsError("<?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_ERROR_REGISTRY_DELETE' ) ?>", jQuery( "#dialog-confirm-content .validateTips"))
	 					}  
	 				});
	             },
	             "<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_CANCEL' ) ?>": function() {
	                 jQuery( this ).dialog( "close" );
	             }
	         }
	 	});
	 		
	 }

	 /**
	  * Builds the content form based on fields and open the dialog
	  * Obj: the clicked button, so we can retrieve dataNode
	  * data: the json data
	  * row: the contents of the row (in case of an edit) 
	  */
	 function addContent(obj, data, editRow) {	
		console.debug('addContent data', data);
	 	var dataNode = obj.parents(".sortable-accordion");	
	 	jQuery("#dialog-form-content").dialog("option", "title", $translate.instant('frontend.dialog.content.title.of') +  dataNode.data("name"));
	 	var columns = {};
	 	
	 	if (data._embedded && data._embedded.menus)
		 	// iterate over menuSet to get the right one
		 	jQuery.each(data._embedded.menus, function(index, row) {
		 		if (row.menuId == dataNode.data("menuId")) {	
		 			mainID = row.menuId;
		 			jQuery("#h_contents").val("");
		 			jQuery("#h_ftd").val("");	
		 			var aux2 = "";
		 			jQuery("#h_menu_id").val(row.menuId);
		 			// appending fieldset to each locale tab			
		 			jQuery.each(data.supportedLocales.split(","), function(index, locale) {
		 				jQuery("#h_fields").val("");
		 				jQuery("#dialog-form-content #tabs-" + locale).html("");	
		 				var aux = "";
		 				var fieldSet = jQuery("<fieldset>");
		 				
		 				// gets all the fields
		 				jQuery.each(row.fields, function(index2, field) {
		 					// pre populate form if Edit
		 					//console.debug(editRow);
		 					if (editRow != null) {
		 						jQuery("#h_uniqueId").val(editRow.groupId);
		 						content = editRow[field.restName + "_" + locale];
		 						contentId = editRow[field.restName + "_" + locale + "@id"];
		 					} else {
		 						jQuery("#h_uniqueId").val(data.uniqueId);
		 						content = "";
		 						contentId = "";
		 					}		
		 					fieldSet.append(buildInput(field, locale, content, contentId));
		 					
		 					// builds the hidden field id and conten id values
		 					jQuery("#h_contents").val(jQuery("#h_contents").val() + aux2 + contentId);
		 					jQuery("#h_fields").val(jQuery("#h_fields").val() + aux + field.fieldId);
		 					aux = ",";
		 					aux2 = ",";
		 					
		 					var clonedFieldSet = fieldSet.clone(true);					
		 					jQuery("#dialog-form-content #tabs-" + locale).html("").append(clonedFieldSet);
		 				});
		 			});	
		 			
		 			// add support for ajax file upload.
		 			makeFileUpload();
		 			
		 			// adding supported locales to hidden field
		 			jQuery("#h_locales").val(data.supportedLocales);		
		 			
		 			// adding datepicker function
		 			jQuery.datepicker.setDefaults( jQuery.datepicker.regional[ lang ] );
		 			jQuery(".input-datepicker").datepicker();
	
		 			return false;			
		 		}		
		 	});
	 		
	 	jQuery( "#dialog-form-content" ).dialog( "open" );   
	 }

	 function editContent(groupId, obj) {
	 	var dataNode = jQuery(obj).parents(".sortable-accordion");
	 	var gridId = ".fieldGrid#grid_" + dataNode.data("menuId");
	 	var row = jQuery(gridId).jqGrid('getRowData', groupId);
	 	addContent(jQuery(obj), jsonData, row);
	 }

	 /**
	  *Builds an input line, composed by a label and a form field 
	  */
	 function buildInput(field, locale, content, contentId) {
	 	var label = jQuery('<label for="' + field.restName + '">' + field.name + '</label>').data({
	 		"frontpage" : field.frontpage
	 	});
	 	
	 	inputId = field.restName + '_' + locale;
	 	inputName = 'content[' + locale + '@' + field.fieldId + '@' + contentId + ']';
	 	input = "";
	 	
	 	// retrieve the input text from DB. Neat!
	 	if (field.input != null && field.input != "") {
	 		input = jQuery(field.input);
	 	} else {
	 		// fallback in case input text is empty
	 		switch(field.typeId) {
	 			case "String":			
	 				input = jQuery('<input type="text" class="text ui-widget-content ui-corner-all"/>');
	 				break;
	 			case "BigString":
	 				input = jQuery('<textarea class="ui-widget ui-widget-content ui-corner-all"></textarea>');
	 				break;
	 			case "Date":	
	 			case "PublishedDate":		
	 				input = jQuery('<input type="text" maxlength="10" class="date ui-widget-content ui-corner-all input-datepicker"/>');
	 				break;
	 			case "Image":
	 			case "Audio":
	 			case "Video":
	 				input = jQuery('<input type="file" class="text ui-widget-content ui-corner-all"/>');
	 				break;
	 			default:
	 				input = jQuery('<input type="text">');
	 		}
	 	}
	 	
	 	label.attr("title", field.description);
	 	input.attr("id", inputId);
	 	input.attr("name", inputName);
	 	input.attr("title", field.description);
	 	
	 	// if it's a file, build a preview instead of an empty input
	 	if (input.attr("type") == "file" && content != null && content != "") {
	 		label.append(buildFilePreview(content, field, inputId));
	 		input.addClass("hasFile");
	 	} else {
	 		input.is("textarea") ? input.text(content) : input.val(content);
	 		//input.val(content);
	 	}
	 	
	 	label.append(input);

	 	return label;
	 }

	 /**
	  * Builds the preview of the file 
	  */
	 function buildFilePreview(content, field, inputId) {
	 	if (content == null || content == "" || !content) {
	 		return "";
	 	}
	 	
	 	var preview = jQuery('<div class="file-container"/>')
	 		.attr("id", "file-" + inputId)
	 		.data("file", content);
	 	switch(field.typeId) {
	 		case "Image":
	 			var link = jQuery("<a/>")
	 				.attr("href", "<?php echo $this->files ?>/" + jsonData.restName + "/" + content)
	 				.attr("rel", "lightbox")
	 				.appendTo(preview);
	 		
	 			jQuery("<img/>")
	 				.attr("src", "<?php echo $this->files ?>/" + jsonData.restName + "/thumbnail/" + content)
	 				.addClass("file-preview")
	 				.appendTo(link);
	 			break;
	 		
	 		case "Audio":
	 			jQuery("<audio controls/>")
	 				.attr("preload", "auto")
	 				.attr("width", "90%")
	 				.attr("src", "<?php echo $this->files ?>/" + jsonData.restName + "/" + content)
	 				.addClass("file-preview")
	 				.appendTo(preview);
	 			break;
	 			
	 		case "Video":
	 			jQuery("<video controls/>")
	 				.attr("preload", "auto")
	 				.attr("width", "90%")
	 				.attr("src", "<?php echo $this->files ?>/" + jsonData.restName + "/" + content)
	 				.addClass("file-preview")
	 				.appendTo(preview);
	 			break;
	 				
	 		default: 
	 			preview = content;

	 	}
	 	
	 	return preview;
	 }

	 /**
	  *Transform the file input into  
	  */
	 function makeFileUpload() {
	 	'use strict';
	 	
	 	jQuery("#editFormContent").find("input[type=file]").each(function(index, inputField) { 
	 		var $this = jQuery(this);
	 		var label = $this.parent();
	 		
	 		var buttonSpan = jQuery("<span>")
	 			.addClass("fileinput-button")
	 			.data(label.data());
	 			
	 		label.after(buttonSpan);
	 		
	 		// creating "add file" button
	 		var button = jQuery("<button/>")
	 			.text("<?php echo JText::_( 'MOBILEAPPS_BUTTON_LABEL_ADD' ) ?> " + label.text())
	 			.button({icons: { primary: "ui-icon-plusthick" }})
	 			.click(function(event) {
	 				event.preventDefault();
	 			})
	 			.appendTo(buttonSpan);

	 		$this.appendTo(buttonSpan);
	            
	         var fileDiv = jQuery("<div class='file'/>");
	             
	         // remove button
	         var removeButton = jQuery("<button/>")
	 			.button({icons: {primary: "ui-icon-trash"},text: false})
	 			.css("height", "2em")
	 			.click(function(event) {
	 				var $this = jQuery(this),
	                 data = $this.data();
	                 if (data.file) {
	                 	jQuery("#h_ftd").val(jQuery("#h_ftd").val() + "," + data.file);
	                 }
	 				// gimme my input file back!
	 				$this.removeClass("hasFile");
	 				event.preventDefault();
	 				buttonSpan.show();
	 				data.context.remove();
	 			})
	 			
	 		// adding remove button to existing files
	 		if ($this.hasClass("hasFile")) {
	 			var data = {};
	 			data.context = jQuery("#file-" + $this.attr("id"));
	 			data.file = data.context.data("file");
	 			data.context
	 				.append(jQuery('<span class="margin"/>'))
	 				.append(removeButton.clone(true).data(data));
	 			buttonSpan.hide();
	 		}
	 		
	 		jQuery(inputField).fileupload({
	 	        url: '<?php echo $this->restPrefix ?>/contents/upload/',
	 	        dataType: 'json',
	 	        autoUpload: false,
	 	        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp3|wav?e|wma|flac|ogg|mp4|mpe?g|avi|wmv|mkv)$/i,
	 	        maxFileSize: 50000000, // 50 MB
	 	        loadImageMaxFileSize: 15000000, // 15MB
	 	        disableImageResize: false,
	 	        singleFileUploads: false,
	 	        previewMaxWidth: 100,
	 	        previewMaxHeight: 100,
	 	        previewCrop: true,
	 	        forceIframeTransport: true
	 		}).on('fileuploadadd', function (e, data) {
	 	    	data.context = jQuery('<div class="file-container"/>').appendTo(label);
	 	    	jQuery(this).addClass("hasFile");
	 	    	
	 	    	jQuery.each(data.files, function (index, file) {
	 	            var node = jQuery('<p/>')
	 	                    .append(jQuery('<span class="margin"/>').text(file.name))
	 	                    .append(removeButton.clone(true).data(data));

	 	            if (!index) {
	 	            	node.append(fileDiv.clone(true).data(data));
	 	                
	 	            }
	 	            node.appendTo(data.context);
	 	        });
	 	    	
	 		}).on('fileuploadprocessalways', function (e, data) {
	 			var index = data.index,
	 	            file = data.files[index],
	 	            node = jQuery(data.context.children()[index]);
	 	            
	 	        if (file.preview) {
	 	            node
	 	                .prepend(jQuery(file.preview)
	 	                	.addClass("file-preview"));
	 	        }
	 	        if (file.error) {
	 	            node
	 	                .append('<br>')
	 	                .append(file.error);
	 	                console.debug("File error");
	 	        }
	 	        if (index + 1 === data.files.length) {
	 	        	hasFile = true;
	         	}
	 	        
	 	        buttonSpan.hide();
	 		}).on('fileuploadprogressall', function (e, data) {
	 	    	
	 	        var progress = parseInt(data.loaded / data.total * 100, 10);
	 	        jQuery( "#progressbar" ).progressbar({ value: progress });
	 	       
	 	        if (data.loaded == data.total) {
	 	       		hasFile = false;
	 	        }
	 		});
	 	});
	 }

	 /**
	  * Formats the Edit and Remove buttons in the grid with a UI 
	  */
	 function formatGridButtons() {
	 	// Adds remove / edit style button and set grid height   
	 	jQuery( ".delete" ).button({
	 		icons: {
	         	primary: "ui-icon-trash"
	     	}, 	text: false    
	 	});
	 	jQuery( ".edit" ).button({
	 		icons: {
	         	primary: "ui-icon-pencil"
	     	}, 	text: false    
	 	});
	 }

	 /**
	  * Do some checks to see if this field is mandatory
	  * So far, frontpage fields that are text (input or textarea) will be mandatory 
	  */
	 function isFieldMandatory(label) {
	 	return jQuery(label).data("frontpage");
	 }

	 /**
	  * Formats the Edit Content icon 
	  */
	 function editFormatter(cellvalue, options, rowObject) {
	 	return "<button class=\"edit\" onclick=\"editContent('" + cellvalue + "', this)\"><?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_IMAGE_TITLE_EDIT_CONTENT' ) ?></button>";
	 }

	 /**
	  * Formats the Delete icon 
	  */
	 function deleteFormatter(cellvalue, options, rowObject) {
	 	return "<button class=\"delete\" onclick=\"openRemoveDialog('" + cellvalue + "')\"><?php echo JText::_( 'MOBILEAPPS_VIEW_CONTENT_IMAGE_TITLE_REMOVE_CONTENT' ) ?></button>";
	 }

                    	 
                    	 
}}]);
                     