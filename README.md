FormTracker jQuery-plugin
=========================

A jQuery-powered plugin to track changes of your html forms! Provides to user a chance to see what his is changed in your HTML form and provides a way to go back and undo changes field-by-field.

Requirements
------------

jQuery 1.4.2+
*Well tested with jQuery 1.4.2 but maybe works in previous (not so old) versions.

Getting started
---------------

Just include jquery-formtracker:
    
    <script type="text/javascript" src="src/jquery-formtracker.js"></script>

Track changes of your form:

    $("#myform").trackable();

Ok, as you can see, you can't view a difference. Then use callbacks:

    $("#myform").trackable({
      changed: function(parent, field) {
        field.addClass("changed")
      },
      unchanged: function(parent, field) {
        field.removeClass("changed")
        if(parent.hasDirtyField() == false) {
          alert("The form is as new!");
        }
      }
    })

If won't working as you expected see the demo: checkout this repository and open in your browser the file: test/functional/simple_form.html and see jquery-formtracker in action!

