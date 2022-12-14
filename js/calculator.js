'use strict'

App
.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self', baseUrl
    ])
}])
.controller("calculatorController", [
    '$scope',
    '$cookies',
    'serverCommunication',
    function ($scope, $cookies, serverCommunication) {
        $scope.curOperand = ""
        $scope.prevOperand = ""
        $scope.calculationHistoryList = []
        var token = $cookies[authTokenCookie]

        let updateHistory = function () {
            if (token != null) {
                serverCommunication
                    .serverHistory(token)
                    .then(function (response) {
                        if (response.history != null) {
                            $scope.calculationHistoryList = transformHistory(response.history)
                        }
                    })
            }
        }

        updateHistory()

        let updateToken = function (newToken) {
            token = newToken
            $cookies[authTokenCookie] = newToken
            updateHistory()
        }

        $scope.addSymbol = function (symbol) {
            $scope.curOperand += symbol
        }

        $scope.delSymbol = function () {
            $scope.curOperand = $scope.curOperand.slice(0, -1)
            if ($scope.curOperand === "") {
                $scope.prevOperand = ""
            }
        }

        $scope.clear = function () {
            $scope.curOperand = ""
            $scope.prevOperand = ""
        }

        $scope.addPrevCalculation = function (calc) {
            let prevOperand, curOperand
            [prevOperand, curOperand] = calc.split("=")
            $scope.prevOperand = prevOperand + "="
            $scope.curOperand = curOperand
        }

        // Mock calculation of operand TO BE REPLACED BY USING SERVER
        let mockEval = function (operand) {
            return eval(operand
                .replace("ln", "Math.log")
                .replace("log", "Math.log10")
                .replace("√", "Math.sqrt")
                .replace("×", "*")
                .replace("÷", "/"))
        }

        $scope.calculate = function () {
            $scope.prevOperand = $scope.curOperand + "="

            let operand = $scope.curOperand
                .replace("√", "sqrt")
                .replace("×", "*")
                .replace("÷", "/")

            $scope.curOperand = "Calculating..."

            serverCommunication
                .serverCalculate(operand, token)
                .then(function (response) {
                    if (response.result != null) {
                        $scope.curOperand = response.result
                        if (response.history != null) {
                            $scope.calculationHistoryList = transformHistory(response.history)
                        } else {
                            $scope.calculationHistoryList.push($scope.prevOperand + $scope.curOperand)
                        }
                    } else {
                        $scope.curOperand = response.comment
                    }
                }, function (_) {
                    $scope.curOperand = 'Connection error'
                })

            // $scope.curOperand = mockEval($scope.curOperand)
            // $scope.calculationHistoryList.push($scope.prevOperand + $scope.curOperand)
        }

        $scope.sign_in_username = ""
        $scope.sign_in_password = ""

        let closeSignInForm = function () {
            let form = document.getElementById("signIn")
            form.style.display = "none"
            $scope.sign_in_username = ""
            $scope.sign_in_password = ""
        }

        $scope.signIn = function () {

            serverCommunication
                .serverSignIn($scope.sign_in_username, $scope.sign_in_password)
                .then(function (response) {
                    updateToken(response.authToken)
                    closeSignInForm()
                }, function (_) {
                    closeSignInForm()
                })

        }
    }
])

function transformHistory(history) {
    return history.map(function (item) {
        item.expression + '=' + item.result
    })
}
