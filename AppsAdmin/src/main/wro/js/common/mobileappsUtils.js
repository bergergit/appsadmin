/**
 * Old javascript, simply converted to an angular module
 */
angular.module('appsadmin.utils', [])

.factory('utils', ['$translate', function($translate) { 

var utils = {

	/**
	 * Basic Javascript functions for Mobile Apps component
	 */
	restPrefix: 'rest',
	mainID: null,
	
	/**
	 * Update tips fields with the highlight message
	 */
	updateTips: function(t, tips) {
		tips.removeClass("ui-state-error");
		tips.text(t).addClass("ui-state-highlight");
		setTimeout(function() {
			tips.removeClass("ui-state-highlight", 1500);
		}, 2000);
	},
	
	/**
	 * Update tips fields with the error message
	 */
	updateTipsError: function(t, tips) {
		tips.text(t).addClass("ui-state-error");
		tips.show();
		/*
		setTimeout(function() {
			tips.removeClass("ui-state-error");
			tips.hide('fade', 500);
		}, 3000);
		*/
	},
	
	/**
	 * Update tips fields with the highlight message
	 */
	updateTipsFixed: function(t, tips) {
		tips.removeClass("ui-state-error");
		jQuery(".messageTips").animate({opacity: 1.0});
		jQuery(".messageTips").show();
		tips.text(t);
		setTimeout(function() {
			//jQuery(".messageTips").hide('highlight', 2000);
			jQuery(".messageTips").animate({opacity: 0.0}, 2000);
		}, 3000);
	},
	
	
	/**
	 * Checks the minimum and maximum length of a field
	 * @param o the field object
	 * @param n the error message
	 * @param min the minimum length
	 * @param max the maximum lentgh
	 */
	checkLength: function(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass("ui-state-error");
			utils.updateTipsError(n, jQuery( ".dialog-form .validateTips" ));
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * Checks to see if the form is not empty
	 * @param o the field object
	 * @param n the error message 
	 */
	checkEmpty: function(o, n) {
		if (o.is("textarea") || o.is("input") || o.is("select")) { 
			if (o.attr("type") == "file") {
				if (!o.hasClass("hasFile")) {
					o.addClass("ui-state-error");
					utils.updateTipsError(n, jQuery( ".dialog-form .validateTips" ));
					return false;
				}
			} else if (o.val() == null || o.val() == "") {
				o.addClass("ui-state-error");
				utils.updateTipsError(n, jQuery( ".dialog-form .validateTips" ));
				return false;
			} else {
				return true;
			}
		}
		return true;
	},
	
	/**
	 * Checks the field for a specific Regular Expression
	 * @param o the field object
	 * @param n the error messsage
	 * @param regexp the regular expression  
	 */
	checkRegexp: function( o, regexp, n ) {
	    if ( !( regexp.test( o.val() ) ) ) {
	        o.addClass( "ui-state-error" );
	        utils.updateTips(n, jQuery( ".dialog-form .validateTips"));
	        return false;
	    } else {
	        return true;
	    }
	},
	
	/**
	 * Checks for the email format
	 * @param o the field object
	 * @param n the error message
	 */
	checkRegexpEmail: function( o, n ) {
		var regexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
		return checkRegexp(o, regexp, n);
	},
	
	/**
	 * Opens delete dialog
	 */
	openRemoveDialog: function(id) {
		mainID = id;	
		jQuery("#dialog-confirm").show().dialog("open");
	},
	
	makeAccordion: function(obj) {
		obj.click(function(event) {   		
	   		if (utils.canToggle(event)) {
				jQuery(this).next().toggle("normal");
				if (jQuery(this).data("expanded")) {
					jQuery("span", this).removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
				} else {
					jQuery("span", this).removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
				}
				jQuery(this).data("expanded", !jQuery(this).data("expanded"));
			}
			return false;
		}).hover(function() {
			jQuery(this).addClass("ui-state-hover");
		}, function() {
			jQuery(this).removeClass("ui-state-hover");
		}).next().hide();
	},
	
	addEmptyMessage: function(msg) {
		jQuery('.sortable-accordion .wrapper:empty').html("<div class='emptyMessage'>" + msg + "</div>");
	},
	
	
	canToggle: function(event) {
		return jQuery(event.target).parent()[0].tagName != "BUTTON" && jQuery(event.target)[0].tagName != "A";
	}
	
}

return utils;
	
}]);



