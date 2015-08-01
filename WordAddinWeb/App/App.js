/* Common app functionality */
window.config = {
    tenant: '<tenant>.onmicrosoft.com',
    clientId: '<Azure App Client ID>',
    postLogoutRedirectUri: window.location.origin,
    endpoints: {
         officeGraph: 'https://graph.microsoft.com',
    },
    cacheLocation: 'localStorage'
};

var app = (function () {
    "use strict";

    var app = {};

    // Common initialization function (to be called from each page)
    app.initialize = function () {
        var authContext = new AuthenticationContext(config);

        var $userDisplay = $(".app-user");
        var $signInButton = $(".app-login");
        var $signOutButton = $(".app-logout");

        // Check For & Handle Redirect From AAD After Login
        var isCallback = authContext.isCallback(window.location.hash);
        authContext.handleWindowCallback();

        if (isCallback && !authContext.getLoginError()) {
            window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
        }

        // Check Login Status, Update UI
        var user = authContext.getCachedUser();
        if (user) {
            $userDisplay.html(user.userName);
            $userDisplay.show();
            $signInButton.hide();
            $signOutButton.show();
        } else {
            $userDisplay.empty();
            $userDisplay.hide();
            $signInButton.show();
            $signOutButton.hide();
        }

        // Register NavBar Click Handlers
        $signOutButton.click(function () {
            authContext.logOut();
        });
        $signInButton.click(function () {
            authContext.login();
        });

        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });


        // After initialization, expose a common notification function
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };
    };

    return app;
})();