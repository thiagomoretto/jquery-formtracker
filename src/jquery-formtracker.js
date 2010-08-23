//
// jQuery FormTracker Plugin
//
// Usage:
// $("#myform").trackable()
//
// Copyright (c) 2010 Thiago Moretto
//
$(function() {
	$.fn.undo = function() {
		field  = $(this)
		tag	   = field.get(0).tagName.toLowerCase()
		parent = field.data('parent');
		if(parent != null) {
			options = parent.data('options');
			type = field.attr('type')
			if(type == 'checkbox' || type == 'radio') {
				field.attr('checked', field.attr(options.originalAttr) == 'true' ? 'checked' : '')
			} else {
				if(tag == 'select') {
					strVal = field.attr(options.originalAttr)
					vals   = strVal.split(",")
					field.val(vals)
				} else {
					field.val(field.attr(options.originalAttr))
				}
			}
			options.unchanged(parent, field)
		}
	}
	
	$.fn.isChanged = function() {
		field  = $(this)
		tag	   = field.get(0).tagName.toLowerCase()
		parent = field.data('parent');
		if(parent != null) { 
			options = parent.data('options');
			type = field.attr('type')
			if(type == 'checkbox' || type == 'radio') {
				return field.attr(options.originalAttr).toString() != field.is(':checked').toString()
			} else {
				if(tag == 'select') {
					original = field.attr(options.originalAttr)
					return original.toString() != field.val().toString()
				} else {
					return field.attr(options.originalAttr) != field.val()
				}
			}
		} else return false;
	}
	
	$.fn.hasDirtyFields = function() {
 		form = $(this)
		extendForm(form)
		return form.hasDirtyFields()
	}
	
	var trackField = function(parent, newField) {
		field = newField
		tag	  = newField.get(0).tagName.toLowerCase()
		type  = field.attr('type')
		options = parent.data('options');
		if(type == 'checkbox' || type == 'radio') {
			eventsToBind = 'blur change'
			field.attr(options.originalAttr, newField.is(':checked'))
		}
		else { // everything else...
			if(tag == 'select') {
				eventsToBind = "change"
				if(field.attr('multiple')) {
					var currVal = newField.map(function() { return $(this).val(); }).get();
					field.attr(options.originalAttr, currVal)
				} else {
					field.attr(options.originalAttr, newField.val())
				}
			}
			else { // input, textarea
				eventsToBind = 'blur keydown keyup change'
				field.attr(options.originalAttr,newField.val())
			}
		}
		field.bind(eventsToBind, function() {
			track(options, parent, newField)
		})
		field.data('parent', parent)
	}
	
	$.fn.addToTracker = function(newField) {
		parent = $(this)
		trackField(parent, newField)
		extendForm(parent);
	}
	
	$.fn.trackable = function(options) {
		var opts = $.extend({}, $.fn.trackable.defaults, options);
		return this.each(function() {
			var $this = $(this)
			if(!$this.is('form')) return;
			
			$this.data('options', opts)

			extendForm($this);
			trackChildren(opts, $this);
		});
	}

	$.fn.trackable.defaults = {
		originalAttr: 'original-data', 
		selector: 	"input[type='text']:visible:enabled," +
					"input[type='password']:visible:enabled," +
					"input[type='checkbox']:visible:enabled," +
					"input[type='radio']:visible:enabled," +
					"textarea:visible:enabled," +
					"select:visible:enabled",
		// called when the original value is not equal to current value
		changed: function(parent, field) { },
		// called when the original value is equal to the current value
		unchanged: function(parent, field) { }
	}
	
	var extendForm = function(form) {
		opts = form.data('options')
		$.extend(form, {
			// Return elegible children
			elegibleChildren: function() {
			 	return form.children().find(opts.selector)
			},
			// Return how many field are dirty
			howManyDirtyFields: function() {
				dirtyCount = 0
				form.elegibleChildren().each(function() {
					if ($(this).isChanged()) dirtyCount ++;
				});	
				return dirtyCount;
			},
			// Return true if has dirty fields
			hasDirtyFields: function() { 
				return form.howManyDirtyFields() > 0
			}
		})
	}
	
	var changed = function(options, field) {
		return field.isChanged()
	}
	
	var track = function(options, parent, field) {
		if (changed(options, field)) {
			options.changed(parent, field)
		} else {
			options.unchanged(parent, field)
		}
	}
	
	var trackChildren = function(options, parent) {
		parent.elegibleChildren().each(function() {
			trackField(parent, $(this))
		});	
	}
})