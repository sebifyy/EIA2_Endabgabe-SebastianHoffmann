"use strict";
var Firework;
(function (Firework) {
    let imageGME = new Image();
    imageGME.src = "./images/gme_moon.png";
    let audioGME = new Audio();
    audioGME.src = "./audio/wsb_discord.mp3";
    class Particle extends Firework.MoveableObject {
        constructor(_particleSize, _position, _velocity, _color, _glowColor, _particleLifetime, _type) {
            super(_position);
            this.particleSize = _particleSize * Math.random();
            this.color = _color;
            this.glowColor = _glowColor;
            this.velocity = _velocity.copy();
            this.particleLifetime = _particleLifetime + Math.random();
            this.type = _type;
        }
        move(_timeslice) {
            super.move(_timeslice);
            this.velocity.y += Particle.gravity;
            this.particleLifetime -= _timeslice;
            if (this.particleLifetime < 0)
                this.expendable = true;
        }
        draw() {
            switch (this.type) {
                case "circle":
                    Firework.crc2.save();
                    Firework.crc2.beginPath();
                    Firework.crc2.translate(this.position.x, this.position.y);
                    Firework.crc2.arc(0, 0, 7 * this.particleSize / 100, 0, 2 * Math.PI);
                    Firework.crc2.closePath();
                    Firework.crc2.fillStyle = this.color;
                    Firework.crc2.shadowColor = this.glowColor;
                    Firework.crc2.shadowBlur = 15 * this.particleSize / 100 + Math.random() * 150;
                    Firework.crc2.fill();
                    Firework.crc2.restore();
                    console.log(this.type);
                    break;
                case "triangle":
                    Firework.crc2.save();
                    Firework.crc2.beginPath();
                    Firework.crc2.translate(this.position.x, this.position.y);
                    Firework.crc2.scale(0.04 * this.particleSize, 0.04 * this.particleSize);
                    Firework.crc2.lineTo(0, -2);
                    Firework.crc2.lineTo(-2, 2);
                    Firework.crc2.lineTo(2, 2);
                    Firework.crc2.closePath();
                    Firework.crc2.fillStyle = this.color;
                    Firework.crc2.shadowColor = this.glowColor;
                    Firework.crc2.shadowBlur = 15 * this.particleSize / 100 + Math.random() * 150;
                    Firework.crc2.fill();
                    Firework.crc2.restore();
                    console.log(this.type);
                    break;
                case "square":
                    Firework.crc2.save();
                    Firework.crc2.beginPath();
                    Firework.crc2.translate(this.position.x, this.position.y);
                    Firework.crc2.scale(0.1 * this.particleSize, 0.1 * this.particleSize);
                    Firework.crc2.rect(-1, -1, 1, 1);
                    Firework.crc2.closePath();
                    Firework.crc2.fillStyle = this.color;
                    Firework.crc2.shadowColor = this.glowColor;
                    Firework.crc2.shadowBlur = 15 * this.particleSize / 100 + Math.random() * 150;
                    Firework.crc2.fill();
                    Firework.crc2.restore();
                    console.log(this.type);
                    break;
                case "square":
                    Firework.crc2.save();
                    Firework.crc2.beginPath();
                    Firework.crc2.translate(this.position.x, this.position.y);
                    Firework.crc2.scale(0.1 * this.particleSize, 0.1 * this.particleSize);
                    Firework.crc2.setLineDash([5, 5]);
                    Firework.crc2.moveTo(0, 200);
                    Firework.crc2.lineTo(200, 0);
                    Firework.crc2.closePath();
                    Firework.crc2.fillStyle = this.color;
                    Firework.crc2.shadowColor = this.glowColor;
                    Firework.crc2.shadowBlur = 15 * this.particleSize / 100 + Math.random() * 150;
                    Firework.crc2.fill();
                    Firework.crc2.restore();
                    console.log(this.type);
                    break;
                case "gme":
                    Firework.crc2.save();
                    Firework.crc2.translate(this.position.x, this.position.y);
                    Firework.crc2.beginPath();
                    Firework.crc2.ellipse(-21 * this.particleSize / 100, 21 * this.particleSize / 100, 7 * this.particleSize / 100, 35 * this.particleSize / 100, Math.PI / 4, 0, 2 * Math.PI);
                    Firework.crc2.fillStyle = this.color;
                    Firework.crc2.shadowColor = this.glowColor;
                    Firework.crc2.shadowBlur = 25 * this.particleSize / 100 + Math.random() * 150;
                    Firework.crc2.closePath();
                    Firework.crc2.fill();
                    Firework.crc2.drawImage(imageGME, -50 * this.particleSize / 100, -50 * this.particleSize / 100, this.particleSize, this.particleSize);
                    audioGME.play();
                    Firework.crc2.restore();
                    console.log(this.type);
                    break;
            }
        }
    }
    Particle.gravity = 1;
    Firework.Particle = Particle;
})(Firework || (Firework = {}));
//# sourceMappingURL=Particle.js.map