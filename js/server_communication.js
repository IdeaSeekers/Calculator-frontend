'use strict'

App.factory('serverCommunication', ['$http', '$q', function ($http, $q) {
    $http.defaults.headers.common.Accept = 'application/json, text/plain, */*'
    $http.defaults.headers.post['Content-Type'] = 'application/json'

    return {
        serverCalculate: function (query, token) {
            let body = {
                calculation: query
            }
            if (token != null) {
                body.authToken = token
            }

            return $http.post(baseUrl + '/calculate', body)
                .then(
                    function (response) {
                        return response.data
                    },
                    function (errResponse) {
                        console.error('Error while calculation');
                        return $q.reject(errResponse)
                    }
                );
        },

        serverSignIn: function (login, password) {
            let data = {
                login: login,
                password: password
            }
            return $http.post(baseUrl + '/signin', data)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while sign in');
                        return $q.reject(errResponse);
                    }
                );
        },

        serverSignUp: function (login, password) {
            let data = {
                login: login,
                password: password
            }
            return $http.post(baseUrl + '/signup', data)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while updating user');
                        return $q.reject(errResponse);
                    }
                );
        },

        serverHistory: function (token) {
            let data = {
                authToken: token
            }
            return $http.post(baseUrl + '/history', data)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        console.error('Error while deleting user');
                        return $q.reject(errResponse);
                    }
                );
        }

    };

}]);