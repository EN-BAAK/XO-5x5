let submitButton = document.querySelector(".login .submit .submit-button"),
    choices = document.querySelectorAll(".login .player-number input"),
    inputFirstPlayerName = document.querySelector(".login .first-player input"),
    inputSecondPlayerName = document.querySelector(
        ".login .second-player input"
    ),
    dataGame = {
        VS: "bot",
        playerOneName: "Player 1",
        playerTwoName: "Bot",
    };
//! Select The Enemy
choices.forEach((e) => {
    e.onclick = function () {
        if (e.value === "other") {
            inputSecondPlayerName.classList.remove("dis");
        } else {
            inputSecondPlayerName.classList.add("dis");
        }
        dataGame.VS = e.value;
    };
});

submitButton.onclick = function () {
    dataGame.playerOneName = !inputFirstPlayerName.value
        ? "Player 1"
        : inputFirstPlayerName.value;
    dataGame.playerTwoName = !inputSecondPlayerName.value
        ? "Bot"
        : inputSecondPlayerName.value;
    window.localStorage.setItem("XOGameData", JSON.stringify(dataGame));
    window.location.href = "./game.html";
};