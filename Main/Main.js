"use strict";
var Firework;
(function (Firework) {
    window.addEventListener("load", handleLoad);
    //let serverPage: string = "http://localhost:5001";
    //let serverPage: string = "https://eia2-2020-2021.herokuapp.com/"; //JOHANNES SERVER
    let serverPage = "https://eia2-endabgabe-sh.herokuapp.com/";
    let form;
    let particleQuantity;
    let particleSize;
    let color;
    let particleLifetime;
    let luminance;
    let type;
    let moveables = [];
    let canvas;
    let backgroundImage = new Image();
    async function handleLoad(_event) {
        console.log("SEITE GELADEN, TO THE MOON!");
        let response = await fetch(serverPage + "?" + "command=getTitels");
        let listOfTitels = await response.text();
        let titelList = JSON.parse(listOfTitels);
        Firework.generateContent(titelList);
        canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Firework.crc2 = canvas.getContext("2d");
        let fireworkSaveButton = document.querySelector("button#fireworkSaveButton");
        let fireworkLoadButton = document.querySelector("button#fireworkLoadButton");
        form = document.querySelector("form#userConfiguration");
        canvas.addEventListener("mouseup", createObject);
        fireworkSaveButton.addEventListener("click", sendDataToServer);
        fireworkLoadButton.addEventListener("click", getDataFromServer);
        window.setInterval(update, 20);
        backgroundImage.src = "./images/wsb_logo_bearbeitet.png";
    }
    function createObject(_event) {
        let mousePositionX = _event.clientX - Firework.crc2.canvas.offsetLeft;
        let mousepositionY = _event.clientY - Firework.crc2.canvas.offsetTop;
        let formData = new FormData(document.forms[0]);
        for (let entry of formData) {
            particleQuantity = Number(formData.get("particleQuantity"));
            particleSize = Number(formData.get("particleSize"));
            particleLifetime = Number(formData.get("particleLifetime"));
            color = String(formData.get("particleColor"));
            luminance = String(formData.get("luminance"));
            console.log(entry[1]);
            switch (entry[1]) {
                case "circle":
                    type = "circle";
                    break;
                case "triangle":
                    type = "triangle";
                    break;
                case "square":
                    type = "square";
                    break;
                case "gme":
                    type = "gme";
                    break;
            }
        }
        createParticle(particleQuantity, particleSize, mousePositionX, mousepositionY, color, luminance, particleLifetime, type);
    }
    async function getDataFromServer(_event) {
        console.log("Datein wurden geladen");
        let target = document.getElementById("LodedTitels");
        let userValue;
        userValue = target.value;
        let response = await fetch(serverPage + "?" + "command=getAllDatas");
        let responseContent = await response.text();
        let allDatas = JSON.parse(responseContent);
        let result = allDatas.find(item => item.fireworkName === userValue);
        console.log(result);
        createUserRocket(result);
    }
    Firework.getDataFromServer = getDataFromServer;
    function createUserRocket(_result) {
        let color = _result?.particleColor;
        let particleLifetime = _result?.particleLifetime;
        let type = _result?.particleShape;
        console.log(color, particleLifetime, type);
        let form = document.getElementsByTagName("form");
        for (let i = 0; i < form[0].elements.length; i++) {
            if (form[0].elements[i].id == "particleQuantity") {
                let particleQuantity = document.getElementById("particleQuantity");
                particleQuantity.value = color;
            }
            if (form[0].elements[i].id == "particleSize") {
                let particleSize = document.getElementById("particleSize");
                particleSize.value = color;
            }
            if (form[0].elements[i].id == "particleLifetime") {
                let particleLifetime = document.getElementById("particleLifetime");
                particleLifetime.value = color;
            }
            if (form[0].elements[i].id == "particleShape") {
                let particleShape = document.getElementById("particleShape");
                particleShape.value = color;
            }
            if (form[0].elements[i].id == "particleColor") {
                let particleColor = document.getElementById("particleColor");
                particleColor.value = color;
            }
            if (form[0].elements[i].id == "luminance") {
                let luminance = document.getElementById("luminance");
                luminance.value = color;
            }
        }
    }
    async function sendDataToServer(_event) {
        let userConfigurationData = new FormData(form);
        let fireworkSave = document.querySelector("input#fireworkSave");
        let fireworkName;
        fireworkName = fireworkSave.value;
        let query = new URLSearchParams(userConfigurationData);
        console.log(fireworkName);
        // query.append("fireworkName", fireworkName);
        let response = await fetch(serverPage + "?" + query.toString());
        let responseText = await response.text();
        alert("Deine Daten wurden gespeichert");
        console.log("Daten geschickt: ", responseText);
        fireworkSave.value = "";
    }
    function createParticle(_particleQuantity, _particleSize, _mousePositionX, _mousePositionY, _color, _luminance, _particleLifetime, _type) {
        let origin = new Firework.Vector(_mousePositionX, _mousePositionY);
        let color = _color;
        let radian = (Math.PI * 2) / _particleQuantity;
        for (let i = 0; i < _particleQuantity; i++) {
            let px;
            let py;
            let velocity;
            let particle;
            if (i % 2 == 0) {
                px = Math.cos(radian * i) * 150 + Math.random() * 20;
                py = Math.sin(radian * i) * 150 + Math.random() * 20;
            }
            else {
                px = Math.cos(radian * i) * 110 * Math.random() * 2;
                py = Math.sin(radian * i) * 110 * Math.random() * 2;
            }
            velocity = new Firework.Vector(px, py);
            particle = new Firework.Particle(particleSize, origin, velocity, color, luminance, particleLifetime, type);
            moveables.push(particle);
        }
    }
    function update() {
        Firework.crc2.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        for (let moveable of moveables) {
            moveable.move(1 / 50);
            moveable.draw();
        }
        deleteExpandables();
    }
    function deleteExpandables() {
        for (let index = 0; index <= moveables.length - 1; index++) {
            if (moveables[index].expendable)
                moveables.splice(index, 1);
        }
    }
})(Firework || (Firework = {}));
//# sourceMappingURL=Main.js.map