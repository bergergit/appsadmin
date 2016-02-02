/**
 * Old javascript, simply converted to an angular module
 */
angular.module('appsadmin.typesjs', ['appsadmin.utils'])

.factory('typesjs', ['$compile','$translate','$cookies','utils','auth', 
                     function($compile, $translate, $cookies, utils, auth) { return function() {	

 utils.includeCsrf();
                    	 
 /** jqGrid table **/
 jQuery("#types_list").jqGrid({
    url: utils.restPrefix + '/types',
 	datatype: "json",
 	postData: "",
 	mtype: 'GET',
 	//caption:"Tipos",
    	colNames:['Tipo',' ', 'mime_type','input','description',''],
    	colModel:[
    		{name:'typeId', index:'typeId', width:300, align:'left', resizable: false, sortable:true, formatter:linkFormatter},
    		{name:'delete', width:50, resizable: false, sortable: false, align:'center', formatter:deleteFormatter},
    		{name:'mimeType', hidden: true},
    		{name:'input', hidden: true},
    		{name:'description', hidden: true},
    		{name:'removable', hidden: true}
    	],
    sortname: "id",
     sortorder: "asc",   
     sortable: false,
     rowTotal: 50,
     loadonce: true,
     hidegrid: false,
     //width: 350,
 	height: "100%",
 	hoverrows: true,	
 	beforeSelectRow: function(rowid, e) {
     	return false;
 	},
 	gridComplete: function() {
 		jQuery( ".gridlink" ).off().click(function() {
			openAndPopulateForm(jQuery(this).data('id'));
		});
 		
 		// buttons - remove   
 		jQuery( ".delete" ).button({
 			icons: {
 	        	primary: "ui-icon-trash"
 	    	},
 	    	text: false    
 		}).off().click(function() {
			utils.openRemoveDialog(jQuery(this).data('id'));
		});
 	},
     jsonReader : {
     	repeatitems : false,
     	root: "_embedded.types"
     }
 });


 jQuery(function() {
 	// hidding non used divs
 	jQuery(".messageTips").hide();
 		
 	// form fields
 	var type = jQuery( "#type" ),
     	mime_type = jQuery( "#mime_type" ),
     	input = jQuery( "#input" ),        
     	description = jQuery( "#description" ),
     	removable = jQuery( "#removable" ),
        allFields = jQuery( [] ).add( type ).add( mime_type ).add(input).add ( description ),
        tips = jQuery( ".validateTips" );
 	
 	// dialog - remove
 	jQuery( ".dialog" ).hide();	
     jQuery( "#dialog-confirm-type" ).dialog({
    	 title: $translate.instant('admin.dialog.title.remove'),
         resizable: false,
         height:200,
         width: 360,
         modal: true,
         autoOpen: false,
         draggable: false,
         buttons:  [{
            text: $translate.instant('btn.delete'),       
        	click: function() {             	
                 // deletes for data via DELETE       
 				jQuery.ajax({  
 					type: 'DELETE',  
					url: utils.restPrefix + '/types/' + mainID, 
 					//data: jQuery("#editFormType").serialize(),  
 					success: function() {
 						utils.updateTipsFixed($translate.instant('admin.msg.registry.deleted'), jQuery( "#messageText"))
 						jQuery('#types_list').jqGrid('setGridParam', {datatype:'json'});
 						jQuery('#types_list').trigger('reloadGrid');												
 						jQuery( "#dialog-confirm-type" ).dialog( "close" );
 					},
 					error: function(errorObj) {
 						utils.updateTipsError($translate.instant('admin.msg.registry.delete.error'), jQuery( "#dialog-confirm-type .validateTips"))
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
 	
 	// dialog - add new type
 	jQuery( "#dialog-form-type" ).dialog({
 		 	closeOnEscape: false,
			open: function(event, ui) { 
				//jQuery(".ui-dialog-titlebar-close", ui.dialog || ui).hide(); 
				jQuery( "#dialog-form-type .validateTips").text('').removeClass("ui-state-error");;
			},
    		 title: $translate.instant('admin.dialog.type.title'),
             autoOpen: false,
             resizable: false,
             height: 560,
             width: 350,
             modal: true,
             buttons: [{
            	text: $translate.instant('btn.save'),
            	click: function() {
                     var bValid = true;
                     allFields.removeClass( "ui-state-error" );
  
                     //bValid = bValid && checkLength( type, "<?php echo JText::sprintf( 'MOBILEAPPS_ERROR_FORM_LENGTH', JText::_( 'MOBILEAPPS_VIEW_TYPES_FORM_LABEL_TYPE' ), 2, 40 )?>", 2, 40 );
                     bValid = bValid && utils.checkLength( type, $translate.instant('form.error.length', {name: $translate.instant('admin.dialog.type.label.type'), min: 2, max: 40}), 2, 40 );
                                                            
  					if ( bValid ) {
  						// submits for data via POST
  						jQuery.ajax({  
 							type: 'POST',  
 							url: utils.restPrefix + '/types',
 							contentType: "application/json",
 							data: jQuery("#editFormType").serializeJSON(),  
 							success: function() {
 								jQuery(".messageTips").show();
 								// if it's an insert, display created message, else display updated message
 								if (type.prop('readonly')) {
 									utils.updateTipsFixed($translate.instant('admin.msg.registry.updated'), jQuery( "#messageText"));
 								} else {
 									utils.updateTipsFixed($translate.instant('admin.msg.registry.created'), jQuery( "#messageText"));
 								}
 								
 								jQuery('#types_list').jqGrid('setGridParam', {datatype:'json'});
 								jQuery('#types_list').trigger('reloadGrid');												
 								jQuery( "#dialog-form-type" ).dialog( "close" );
 							},
 							error: function(errorObj) {
 								if (xhr.status == 409) {	// conflict
									utils.updateTipsError($translate.instant('admin.msg.registry.duplicate.error'), jQuery( "#dialog-form-type .validateTips"))
								} else { // generic error
									utils.updateTipsError($translate.instant('admin.msg.registry.create.error'), jQuery( "#dialog-form-type .validateTips"))
								}
 							}  
 						});
 						
  						//jQuery( this ).dialog( "close" );
   					}
                 },
             },{
            	text:  $translate.instant('btn.cancel'),
                click: function() {
                    jQuery( this ).dialog( "close" );
                }
             }],
             close: function() {
                 allFields.val( "" ).removeClass( "ui-state-error" );
             }
         });
    
 	// button - add new type	
 	jQuery( "#addButtonType" )
 		.button({
 			label: $translate.instant('admin.button.addType'),
 			icons: { primary: "ui-icon-plusthick" }
 		})
 		.click(function() {
 			type.prop('readonly', false);
 			type.removeClass('ui-state-disabled');
 			removable.val(true);
         	jQuery( "#dialog-form-type" ).dialog( "open" );        	
     	});    	
   
 });

 function openAndPopulateForm(index) {
 	var row = jQuery("#types_list").jqGrid('getGridParam', 'data')[index];
 	
 	jQuery("#type")
 		.val(row.typeId)
 		.prop('readonly', true)
 		.addClass('ui-state-disabled');
 	jQuery("#mime_type").val(row.mimeType);
 	jQuery("#input").val(row.input);
 	jQuery("#description").val(row.description);
 	jQuery("#removable").val(row.removable);
 	
 	jQuery( "#dialog-form-type" ).dialog( "open" );
 }



 /**
  * Formats the Type to be an Edit link 
  */
 function linkFormatter(cellvalue, options, rowObject) {	
 	return '<a href="#" class="gridlink" data-id="' + (options.rowId - 1) + '" style="display: block">' + cellvalue + '</a>';
 }

 /**
  * Formats the Delete icon 
  */
 function deleteFormatter(cellvalue, options, rowObject) {
 	if (rowObject.removable) {
 		return "<button class=\"delete\" data-id=\"" + rowObject.typeId + "\">" + $translate.instant('btn.delete') + "</button>";
 	}
 	return "";
 }
 
 
}}]);


