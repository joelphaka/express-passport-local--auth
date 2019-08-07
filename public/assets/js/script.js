$(function () {

    searchControl();

    function searchControl() {

        var navHeader = $('.navbar .navbar-header');

        navHeader.find('.nav-search')
            .on('focusout blur',function () {
                $(this).css({ 'display': 'none' });
                navHeader.find('.navbar-brand').css({
                    'display' : 'block'
                });
            });
        navHeader.find('.search-toggle')
            .click(function () {
                navHeader.find('.navbar-brand').css({
                    'display' : 'none'
                });
                navHeader.find('.nav-search').css({
                    'display' : 'block'
                }).find('input[type=text]').focus()
            });
    }
});