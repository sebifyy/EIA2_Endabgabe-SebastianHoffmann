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
        console.log("Moin");
        let response = await fetch(serverPage + "?" + "command=getTitels");
        let listOfTitels = await response.text();
        let titelList = JSON.parse(listOfTitels);
        Firework.generateContent(titelList);
        canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Firework.crc2 = canvas.getContext("2d");
        let fireworkSaveButton = document.querySelector("button#fireworkSaveButton");
        let inputParticleQuantity = document.querySelector("input#particleQuantity");
        let fireworkLoadButton = document.querySelector("button#fireworkLoadButton");
        form = document.querySelector("form#userConfiguration");
        canvas.addEventListener("mouseup", createObject);
        fireworkSaveButton.addEventListener("click", sendDataToServer);
        inputParticleQuantity.addEventListener("change", startMeter);
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
        console.log(type);
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
    function createParticle(_particleQuantity, _particleSize, _mousePositionX, _mousePositionY, _color, _glowColor, _particleLifetime, _type) {
        let origin = new Firework.Vector(_mousePositionX, _mousePositionY);
        let color = _color;
        for (let i = 0; i < _particleQuantity; i++) {
            let radian = (Math.PI * 2) / _particleQuantity;
            let px = Math.cos(radian * i) * 110 * Math.random() * 2;
            let py = Math.sin(radian * i) * 110 * Math.random() * 2;
            let velocity = new Firework.Vector(px, py);
            let particle = new Firework.Particle(particleSize, origin, velocity, color, luminance, particleLifetime, type);
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
    function startMeter(_event) {
        let target = _event.target;
        let meter = document.querySelector("meter");
        meter.value = parseFloat(target.value);
    }
})(Firework || (Firework = {}));
//# sourceMappingURL=Main.js.map