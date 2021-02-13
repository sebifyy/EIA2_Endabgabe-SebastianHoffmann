"use strict";
var Firework;
(function (Firework) {
    window.addEventListener("load", handleLoad);
    //let serverPage: string = "https://eia2-2020-2021.herokuapp.com/"; JOHANNES ERVER; FUNKTIONIERT
    let serverPage = "https://eia2-endabgabe-sh.herokuapp.com/"; //EIGENER HEROKULINK - FUNKTIONIERT NICHT
    //let serverPage: string = "http://localhost:5001/"; //FUNKTIONIERT
    let form;
    let particleAmount;
    let particleSize;
    let color;
    let glowColor;
    let particleLifetime;
    let type;
    let moveables = [];
    let canvas;
    let backgroundImage = new Image();
    async function handleLoad(_event) {
        console.log("---PAGE LOADED---");
        let response = await fetch(serverPage + "?" + "command=getTitels");
        let listOfTitels = await response.text();
        let titelList = JSON.parse(listOfTitels);
        Firework.generateContent(titelList);
        canvas = document.querySelector("canvas");
        if (!canvas)
            return;
        Firework.crc2 = canvas.getContext("2d");
        let fireworkSaveButton = document.querySelector("button#fireworkSaveButton");
        let inputParticleAmount = document.querySelector("input#particleAmount");
        let fireworkLoadButton = document.querySelector("button#fireworkLoadButton");
        form = document.querySelector("form#userConfiguration");
        canvas.addEventListener("mouseup", createObject);
        fireworkSaveButton.addEventListener("click", sendDataToServer);
        inputParticleAmount.addEventListener("change", startMeter);
        fireworkLoadButton.addEventListener("click", getDataFromServer);
        window.setInterval(update, 20);
        backgroundImage.src = "./images/wsb_logo_bearbeitet.png";
    }
    function createObject(_event) {
        let mousePositionX = _event.clientX - Firework.crc2.canvas.offsetLeft;
        let mousepositionY = _event.clientY - Firework.crc2.canvas.offsetTop;
        let formData = new FormData(document.forms[0]);
        for (let entry of formData) {
            particleAmount = Number(formData.get("particleAmount"));
            particleSize = Number(formData.get("particleSize"));
            particleLifetime = Number(formData.get("particleLifetime"));
            color = String(formData.get("particleColor"));
            glowColor = String(formData.get("glowColor"));
            switch (entry[1]) {
                case "dot":
                    type = "dot";
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
                default:
                    console.log("Nichts im case");
                    break;
            }
        }
        createParticle(particleAmount, particleSize, mousePositionX, mousepositionY, color, glowColor, particleLifetime, type);
        console.log(type);
    }
    async function getDataFromServer(_event) {
        console.log("---DATA LOADED FROM SERVER---");
        let target = document.getElementById("LoadedTitels");
        let userValue;
        userValue = target.value;
        let response = await fetch(serverPage + "?" + "command=getAllDatas");
        let responseContent = await response.text();
        let allDatas = JSON.parse(responseContent);
        let result = allDatas.find(item => item.fireworkName === userValue);
        console.log(result);
        createUserRocket(result);
    }
    function createUserRocket(_result) {
        let color = _result?.particleColor;
        let particleLifetime = _result?.particleLifetime;
        let type = _result?.particleShape;
        console.log(color, particleLifetime, type);
        let form = document.getElementsByTagName("form");
        for (let i = 0; i < form[0].elements.length; i++) {
            if (form[0].elements[i].id == "particleColor") {
                let particleColor = document.getElementById("particleColor");
                particleColor.value = color;
            }
            if (form[0].elements[i].id == "particleLifeTime") {
                let particleColor = document.getElementById("particleColor");
                particleColor.value = color;
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
        //query.append("fireworkName", fireworkName);
        let response = await fetch(serverPage + "?" + query.toString());
        let responseText = await response.text();
        alert("Deine Daten wurden gespeichert");
        console.log("Daten geschickt: ", responseText);
        fireworkSave.value = "";
    }
    function createParticle(_particleAmount, _particleSize, _mousePositionX, _mousePositionY, _color, _glowColor, _lifetime, _type) {
        let origin = new Firework.Vector(_mousePositionX, _mousePositionY);
        let color = _color;
        for (let i = 0; i < _particleAmount; i++) {
            let radian = (Math.PI * 2) / _particleAmount;
            let px = Math.cos(radian * i) * 110 * Math.random() * 2;
            let py = Math.sin(radian * i) * 110 * Math.random() * 2;
            let velocity = new Firework.Vector(px, py);
            let particle = new Firework.Particle(particleSize, origin, velocity, color, glowColor, particleLifetime, type);
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