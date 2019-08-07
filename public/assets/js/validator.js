

function validator(_options) {
    'use strict';

    return {
        rules: _options.rules || {},
        messages: _options.messages || {},
        errorElement: 'div',
        errorPlacement: _options.placement || function (error, element) {
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent('label').find('span'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            var parent = $(element).parent(".form-group");
            parent.addClass("has-error");
        },
        unhighlight: function (element) {
            var parent = $(element).parent(".form-group");
            parent.removeClass("has-error");
        }
    };
}

$(function () {
    jQuery.validator.addMethod('notEmpty', function (value, element) {
        return this.optional(element) || value.toString().trim().length !== 0;
    }, "The field cannot be empty");

    jQuery.validator.addMethod('minAge', function (value, element, param) {
        if (isNaN(Date.parse(value)) || isNaN(param)) {
            return false;
        }
        if (param < 0) return false;

        var age = new Date().getFullYear() -  new Date(Date.parse(value)).getFullYear();

        return age >= param;

    }, $.validator.format("You must be at least {0} year(s) old"));

    jQuery.validator.addMethod('pattern', function (value, element, param) {
        return param.test(value);
    }, "Please enter value in the requested format");

    jQuery.validator.addMethod('maxFileSize', function (value, element, param) {
        if (element.type !== 'file') {
            return true;
        } else if (!element.files[0]) {
            return true;
        }

        return element.files[0].size/1024 <= parseInt(param);

    }, $.validator.format('The file size must be less than or equal to {0} kilobytes'));

    jQuery.validator.addMethod('fileExtensions', function (value, element, param) {
        if (element.type !== 'file' || !element.files[0]) {
            return true;
        }

        if (!param) return true;

        var extensions = param instanceof Array ? param : [ param.toString() ];

        extensions = extensions.map(function (ext) {
            return ext.toString().trim().replace('.','');
        });

        var _name = element.files[0].name;
        var hasDot = _name.indexOf('.') > -1;
        
        if (!hasDot) return false;

        var fileExt = _name.substring(_name.indexOf('.') + 1);

        return extensions.indexOf(fileExt) > - 1;

    }, 'Invalid file type');

    jQuery.validator.addMethod('alphaNumeric', function (value, element, param) {
        if (!param) return true;

        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }, $.validator.format('The field may only contain letters and numbers.'));
});

