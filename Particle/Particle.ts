namespace Firework {
    let imageGME: HTMLImageElement = new Image();
    imageGME.src = "./images/gme_moon.png";

    let audioGME: HTMLAudioElement = new Audio();
    audioGME.src = "./audio/wsb_discord.mp3";

    export class Particle extends MoveableObject {
        private static gravity: number = 1;
        public position: Vector;
        public velocity: Vector;
        private type: string;
        private lifetime: number;
        private color: string;
        private glowColor: string;
        private particleSize: number;

        constructor(_size: number, _position: Vector, _velocity: Vector, _color: string, _glowColor: string, _lifetime: number, _type: string) {
            super(_position);
            this.particleSize = _size * Math.random();
            this.color = _color;
            this.glowColor = _glowColor;
            this.velocity = _velocity.copy();
            this.lifetime = _lifetime + Math.random();
            this.type = _type;
        }

        public move(_timeslice: number): void {
            super.move(_timeslice);
            this.velocity.y += Particle.gravity;
            this.lifetime -= _timeslice;
            if (this.lifetime < 0)
                this.expendable = true;
        }

        public draw(): void {
            switch (this.type) {
                case "dot":
                    crc2.save();
                    crc2.beginPath();
                    crc2.translate(this.position.x, this.position.y);
                    crc2.arc(0, 0, 7 * this.particleSize / 100, 0, 2 * Math.PI);
                    crc2.closePath();
                    crc2.fillStyle = this.color;
                    crc2.shadowColor = this.glowColor;
                    crc2.shadowBlur = 15 * this.particleSize / 100 * Math.random() * 150;
                    crc2.fill();
                    crc2.restore();
                    console.log(this.type);
                    break;
                case "triangle":
                    crc2.save();
                    crc2.beginPath();
                    crc2.translate(this.position.x, this.position.y);
                    crc2.scale(0.0035 * this.particleSize, 0.0035 * this.particleSize);
                    crc2.lineTo(0, -25);
                    crc2.lineTo(-25, 25);
                    crc2.lineTo(25, 25);
                    crc2.closePath();
                    crc2.fillStyle = this.color;
                    crc2.shadowColor = this.glowColor;
                    crc2.shadowBlur = 15 * this.particleSize / 100 * Math.random() * 150;
                    crc2.fill();
                    crc2.restore();
                    console.log(this.type);
                    break;
                case "square":
                        crc2.save();
                        crc2.beginPath();
                        crc2.translate(this.position.x, this.position.y);
                        crc2.scale(0.0015 * this.particleSize, 0.0015 * this.particleSize);
                        crc2.rect(-100, -100, 100, 100);
                        crc2.closePath();
                        crc2.fillStyle = this.color;
                        crc2.shadowColor = this.glowColor;
                        crc2.shadowBlur = 15 * this.particleSize / 100 * Math.random() * 150;
                        crc2.fill();
                        crc2.restore();
                        console.log(this.type);
                        break;
                case "gme":
                    crc2.save();
                    audioGME.play();
                    crc2.translate(this.position.x, this.position.y);
                    crc2.beginPath();
                    crc2.ellipse(-23 * this.particleSize / 100, 23 * this.particleSize / 100, 7 * this.particleSize / 100, 35 * this.particleSize / 100, Math.PI / 4, 0, 2 * Math.PI);
                    crc2.fillStyle = this.color;
                    crc2.shadowColor = this.glowColor;
                    crc2.shadowBlur = 500 * this.particleSize / 100 * Math.random() * 150;
                    crc2.closePath();
                    crc2.fill();
                    crc2.drawImage(imageGME, -50 * this.particleSize / 100, -50 * this.particleSize / 100, this.particleSize, this.particleSize)
                    crc2.restore();
                    console.log(this.type);
                    break;
            }
        }
    }
}