App.controller("signUpController", ['$scope', 'serverCommunication', function ($scope, serverCommunication) {
    $scope.username = ""
    $scope.password = ""
    $scope.passwordRepeat = ""

    let closeSignUpForm = function () {
        let form = document.getElementById("signUp")
        form.style.display = "none"
        $scope.username = ""
        $scope.password = ""
    }

    $scope.signUp = function () {
        if ($scope.passwordRepeat !== $scope.password) {
            alert("Passwords are not equal! Sign Up failed.")
            return
        }

        serverCommunication
            .serverSignUp($scope.username, $scope.password)
            .then(function (_) {
                alert("Successful! You can sign in.")
                closeSignUpForm()
            }, function (_) {
                closeSignUpForm()
            })

    }
}])
