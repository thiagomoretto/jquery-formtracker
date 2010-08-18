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
			options = $.data(parent, 'options');
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
			options = $.data(parent, 'options');
			type = field.attr('type')
			if(type == 'checkbox' || type == 'radio') {
				return field.attr(options.originalAttr).toString() != field.is(':checked').toString()
			} else {
				return field.attr(options.originalAttr) != field.val()
			}
		} else return false;
	}
	
	$.fn.monitor = function(options) {
		var opts = $.extend({}, $.fn.monitor.defaults, options);
		return this.each(function() {
			var $this = $(this)
			if(!$this.is('form')) return;
			
			$.data($this, 'options', opts)

			$.extend($this, {
				// Return elegible children
				elegibleChildren: function() {
				 	return $(this).children().find(opts.selector)
				},
				// Return how many field are dirty
				howManyDirtyFields: function() {
					dirtyCount = 0
					$this.elegibleChildren().each(function() {
						if ($(this).isChanged()) dirtyCount ++;
					});	
					return dirtyCount;
				},
				// Return true if has dirty fields
				hasDirtyFields: function() { 
					return $this.howManyDirtyFields() > 0
				}
			})
			
			saveOriginals(opts, $this);
		});
	}
	
	// $.fn.monitor.elegibleChildren = function() { }

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
	
	var saveOriginals = function(options, parent) {
		parent.elegibleChildren().each(function() {
			field = $(this)
			type  = field.attr('type')
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
		});	
	}
})