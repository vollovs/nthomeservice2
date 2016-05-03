'use strict';

angular.module('main')

.factory('ValidateService', function () {
    var data = {};

    data.isEmpty = function (val) {
        return val == null || val == '';
    }

    data.min = function (val, count) {
        return val.length < count;
    }
    data.max = function (val, count) {
        return val.length > count;
    }
    data.isValidEmail = function (val) {
        // contributed by: http://projects.scottsplayground.com/email_address_validation/
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val);
    }

    // You can not use following chars '\/\\:\*\?\"<>\|'
    data.hasInvalidChar = function(val) {
        var patt = /[\/\\:\*\?\"<>\|]/g;
        return patt.test(val);
    }

    data.invalidPhoneNumber = function (val) {
        var n = val.replace(/-/g, '');
        return isNaN(n) || n.length != 10;
    }

    data.invalidNumber = function (n) {
        return isNaN(n);
    }

    // valid date format dd/mm/yyyy
    data.invalidDateFormat = function (dateString) {
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
            return true;
        }

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return true;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return !(day > 0 && day <= monthLength[month - 1]);
    }

    data.invalidRenewDate = function (dateString) {
        if (!/^\d{1,2}\-\d{1,2}$/.test(dateString)) {
            return true;
        }

        var parts = dateString.split("-");
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        
        // Check the ranges of month and year
        if (month == 0 || month > 12)
            return true;

        var monthLength = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return !(day > 0 && day <= monthLength[month - 1]);
    }


    return data;
});