//
// jQuery FormMonitoring Plugin 0.1b
//
// Copyright (c) 2010 Thiago Moretto
//
$(function() {
	$.fn.undo = function() {
		field  = $(this)
		parent = field.data('parent');
		if(parent != null) {
			options = parent.data('options');
			type = field.attr('type')
			if(type == 'checkbox' || type == 'radio') {
				field.attr('checked', field.attr(options.originalAttr) == 'true' ? 'checked' : '')
			} else {
				field.val(field.attr(options.originalAttr))
			}
			options.unchanged(parent, field)
		}
	}
	
	$.fn.isChanged = function() {
		field  = $(this)
		parent = field.data('parent');
		if(parent != null) { 
			options = parent.data('options');
			type = field.attr('type')
			if(type == 'checkbox' || type == 'radio') {
				return field.attr(options.originalAttr).toString() != field.is(':checked').toString()
			} else {
				return field.attr(options.originalAttr) != field.val()
			}
		} else return false;
	}
	
	$.fn.addToMonitor = function(newField) {
		parent = $(this)
		newField.monitField(parent)
		extendForm(parent);
	}
	
	$.fn.monitField = function(parent) {
		field = $(this)
		type  = field.attr('type')
		options = parent.data('options');
		if(type == 'checkbox' || type == 'radio') {
			eventsToBind = 'blur change'
			field.attr(options.originalAttr, $(this).is(':checked'))
		}
		else { // everything else...
			eventsToBind = 'blur keydown keyup change'
			field.attr(options.originalAttr, $(this).val())
		}
		field.bind(eventsToBind, function() {
			monit(options, parent, $(this))
		})
		field.data('parent', parent)
	}
	
	$.fn.reMonitor = function() {
		return this.each(function() {
			var $this = $(this)
			var currentOptions = parent.data('options')
			$this.monitor(currentOptions)
		});
	}
	
	$.fn.monitor = function(options) {
		var opts = $.extend({}, $.fn.monitor.defaults, options);
		return this.each(function() {
			var $this = $(this)
			if(!$this.is('form')) return;
			
			$this.data('options', opts)

			extendForm($this);
			monitChildren(opts, $this);
		});
	}

	$.fn.monitor.defaults = {
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
	
	var monit = function(options, parent, field) {
		if (changed(options, field)) {
			options.changed(parent, field)
		} else {
			options.unchanged(parent, field)
		}
	}
	
	var monitChildren = function(options, parent) {
		parent.elegibleChildren().each(function() {
			$(this).monitField(parent)
		});	
	}
})