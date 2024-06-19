var baseUrl = "https://localhost:7205/api";
var app = angular.module("app", []);
app.controller("controller", function ($scope, $http, $interval) {
    $scope.nbPlayer = 0;
    $scope.selectPlayerNumber = [2, 3, 4, 5];
    $scope.listNumber = [];
    $scope.Number = 0;
    $scope.listPlayer = [];
    $scope.listPlayerValide = [];
    $scope.listPlayerAutomatic = [];
    $scope.validation = "";
    $scope.valiny = -1;
    $scope.gameResult = "";
    $scope.order = 0;
    $scope.combination = "";
    $scope.playerNumber = [];

    $scope.startGame = function (nbPlayer) {
        if (nbPlayer != "") {
            document.querySelector(".bt-restart").style.display = "block";
            document.querySelector(".form-nbPlayer").style.display = "none";
            document.querySelector(".form-combinaison").style.display = "none";
            resetCountdown();
            $http.get(`${baseUrl}/game/StartGame/${nbPlayer}`).then(function (response) {
                $scope.nbPlayer = nbPlayer;
                $scope.listPlayer = response.data.players;
                console.log($scope.listPlayer);
            }).catch(function (error) {
                console.error("Error : ", error);
            });

            /*$http.get(`${baseUrl}/game/NumberResult`).then(function (response) {
                $scope.Number = response.data.randomNumber;
                console.log($scope.Number);
            }).catch(function (error) {
                console.error("Error : ", error);
            });

            $http.get(`${baseUrl}/game/Game`).then(function (response) {
                $scope.listNumber = response.data.randomTable;
                console.log($scope.listNumber);
            }).catch(function (error) {
                console.error("Error : ", error);
            });*/
            addNumber(8);
            getClosestNumber();
            startCountdown();
        }

    };

    $scope.verifNumber = function (init, limit, id) {
        var input = document.querySelector(".number" + id);
        if (input.value != "") {
            if (input.value > limit || input.value < init) {
                input.value = "";
            }
        }
    }

    function addNumber(compt) {
        for (let i = 0; i < compt; i++) {
            var input = document.querySelector(".number" + (i + 1));
            if (input.value != "") {
                if (i < compt - 1) {
                    $scope.listNumber.push(input.value);
                }
                if (i == compt - 1) {
                    $scope.Number = input.value;
                }
            }

        }
    }

    // If player click on Confirm button
    $scope.addReponse = function (name, idPlayer) {
        var input = document.querySelector("." + name);
        var btn = document.querySelector(".bt-" + name);
        for (let i = 0; i < $scope.listPlayer.length; i++) {
            if ($scope.listPlayer[i].id == idPlayer) {
                $scope.listPlayer[i].number = input.value;
                input.style.display = "none";
                btn.style.display = "none";
                if ($scope.validation != "") {
                    $scope.validation += "&";
                }
                $scope.validation += "" + idPlayer + "_" + $scope.listPlayer[i].number;
                break;
            }
        }
        isEnd();
    }

    function isEnd() {
        let compt = $scope.validation.split("&").length;
        if (compt == $scope.listPlayer.length) {
            sendResult();
        }
    }

    // If timer end
    $scope.addByOrder = function (player) {
        let rep = 0;
        for (let i = 0; i < $scope.listPlayerAutomatic.length; i++) {
            if ($scope.listPlayerAutomatic[i].id == player.id) {
                rep = 1;
                break;
            }
        }
        if (rep == 0) {
            $scope.listPlayerAutomatic.push(player);
        }
    }

    function addReponseAutomatic() {
        if ($scope.validation == "") {
            for (let i = 0; i < $scope.listPlayerAutomatic.length; i++) {
                var input = document.querySelector("." + $scope.listPlayerAutomatic[i].name);
                var btn = document.querySelector(".bt-" + $scope.listPlayerAutomatic[i].name);
                input.style.display = "none";
                btn.style.display = "none";
                if (input.value != "") {
                    $scope.listPlayerAutomatic[i].number = input.value;
                    if ($scope.validation != "") {
                        $scope.validation += "&";
                    }
                    $scope.validation += "" + $scope.listPlayerAutomatic[i].id + "_" + $scope.listPlayerAutomatic[i].number;
                }
            }
        }
    }

    // Send guessing number to AI
    function getClosestNumber() {
        $http.get(`${baseUrl}/game/getClosestNumber/`, { params: { guessNumber: $scope.Number, listNumber: JSON.stringify($scope.listNumber) } }).then(function (response) {
            $scope.playerNumber.push(response.data.number);
            console.log("AI Number : ", $scope.playerNumber[0]);
            $scope.listPlayer[0].number = $scope.playerNumber[0];
            $scope.validation += "" + $scope.listPlayer[0].id + "_" + $scope.listPlayer[0].number;
            document.querySelector("." + $scope.listPlayer[0].name).style.display = "none";
            document.querySelector(".bt-" + $scope.listPlayer[0].name).style.display = "none";
        }).catch(function (error) {
            console.error("Error : ", error);
        });
    }

    function sendResult() {
        // If player give number proposition
        if ($scope.validation != "") {
            $http.get(`${baseUrl}/game/GetPlayer/${$scope.validation}/${$scope.Number}`).then(function (response) {
                $scope.listPlayer = response.data.players;
                document.querySelector(".form-combinaison").style.display = "block";
                console.log($scope.listPlayer);
                resetCountdown();
            }).catch(function (error) {
                console.error("Error : ", error);
            });
        }
        else {
            $scope.gameResult = "Draw! No player has sent or written a proposal ";
        }
    }

    // send Result to AI and get AI Result
    $scope.sendResultAI = function () {
        $http.get(`${baseUrl}/game/sendToAI/`, { params: { nearPlayer: JSON.stringify($scope.listPlayer[0]), listNumber: JSON.stringify($scope.listNumber) } }).then(function (response) {
            var combination = response.data.combination;
            document.querySelector(".input-combinaison").value = combination ? combination : "0";
            console.log("AI Combination : ", combination);
        }).catch(function (error) {
            console.error("Error : ", error);
        });
    }

    // Combination checker
    $scope.correctionAutomatic = function (content) {
        var input = document.querySelector(".input-combinaison");
        if (content.length > 0) {
            var nbcaractere = content.length - 1;
            var tab_caractere = content.split("");
            var dernier_caractere = tab_caractere[nbcaractere];
            console.log("last : " + dernier_caractere);
            if (isNaN(parseInt(dernier_caractere)) && dernier_caractere != "(" && dernier_caractere != ")" && dernier_caractere != "+" && dernier_caractere != "-" && dernier_caractere != "*" && dernier_caractere != "/") {
                console.log("erreur : " + dernier_caractere)
                input.value = content.slice(0, nbcaractere);
            }
        }
    }

    $scope.sendCombinaison = function () {
        $scope.combination = document.querySelector(".input-combinaison").value;
        console.log($scope.combination);
        // Verify combination
        $http.get(`${baseUrl}/game/verifCombinaison/`, { params: { combinaison: $scope.combination, listNumber: JSON.stringify($scope.listNumber) } }).then(function (response) {
            var reponse_verification = 0;
            reponse_verification = response.data.valiny;
            console.log("repons : " + reponse_verification);
            if (reponse_verification == 1) {
                // Get combination answer
                $http.get(`${baseUrl}/game/getResultCombinaison/`, { params: { combinaison: $scope.combination } }).then(function (response) {
                    $scope.valiny = response.data.valiny;
                    // Final result
                    verdicte();
                    console.log($scope.valiny);
                }).catch(function (error) {
                    console.error("Error : ", error);
                });
            }
            if (reponse_verification == 0) {
                $scope.gameResult = "There is an error in the combination or you used a number several times!";
            }

        }).catch(function (error) {
            console.error("Error : ", error);
        });
    }

    function verdicte() {
        document.querySelector(".bt-combinaison").style.display = "none";
        document.querySelector(".bt-combinaisonAI").style.display = "none";
        console.log("hide-bt");
        if ($scope.valiny == $scope.listPlayer[0].number) {
            $scope.gameResult = $scope.listPlayer[0].name + " wins because "
                + $scope.listPlayer[0].name + " combination's answer is " + $scope.valiny + " = " + $scope.listPlayer[0].number;
        }
        else {
            if ($scope.listPlayer.length >= 2) {
                $scope.gameResult = $scope.listPlayer[1].name + " wins because "
                    + $scope.listPlayer[0].name + " combination's answer is " + $scope.valiny + " != " + $scope.listPlayer[0].number;
            }
            if ($scope.listPlayer.length < 2) {
                $scope.gameResult = "The opposing wins because "
                    + $scope.listPlayer[0].name + " combination's answer is " + $scope.valiny + " != " + $scope.listPlayer[0].number;
            }
        }
    }

    function convert_listNumber() {
        var result = "";
        for (let i = 0; i < $scope.listNumber.length; i++) {
            if (i != 0) {
                result += "_";
            }
            result += $scope.listNumber[i];
        }
        return result;
    }

    // Timer function
    $scope.minutes = '00';
    $scope.seconds = '00';
    $scope.milliseconds = '000';
    var countdownInterval;
    var initialMilliseconds = 60000; // Initial time for chrono in milliseconds
    var totalMilliseconds = initialMilliseconds;

    function updateDisplay(time) {
        var minutes = Math.floor(time / 60000);
        var seconds = Math.floor((time % 60000) / 1000);
        var milliseconds = time % 1000;

        $scope.minutes = minutes < 10 ? '0' + minutes : minutes;
        $scope.seconds = seconds < 10 ? '0' + seconds : seconds;
        $scope.milliseconds = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;

        // If timer end
        if ($scope.minutes == "00" && $scope.seconds == "00" && $scope.milliseconds == "000") {
            addReponseAutomatic();
            sendResult();
        }
    }
    function startCountdown() {
        if (angular.isDefined(countdownInterval)) {
            $interval.cancel(countdownInterval); // Stop the existing countdown
        }

        countdownInterval = $interval(function () {
            if (totalMilliseconds > 0) {
                totalMilliseconds -= 10;
                updateDisplay(totalMilliseconds);
            } else {
                $scope.stopCountdown();
            }
        }, 10);
    }
    $scope.stopCountdown = function () {
        if (angular.isDefined(countdownInterval)) {
            $interval.cancel(countdownInterval);
            countdownInterval = undefined;
        }
    };
    updateDisplay(totalMilliseconds);

    function resetCountdown() {
        totalMilliseconds = initialMilliseconds;
        updateDisplay(totalMilliseconds);
        $scope.stopCountdown();
    }
});