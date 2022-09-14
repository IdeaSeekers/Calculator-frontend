angular.module("calculatorApp", [])
.controller("calculatorController", function ($scope) {
    $scope.curOperand = ""
    $scope.prevOperand = ""
    $scope.calculationHistoryList = []

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
        // TODO: send request to server
        $scope.curOperand = mockEval($scope.curOperand)
        // TODO: update calculation history from server
        $scope.calculationHistoryList.push($scope.prevOperand + $scope.curOperand)
    }
})