namespace Firework {
  window.addEventListener("load", handleLoad);
  // let serverPage: string = "http://localhost:5001";
  let serverPage: string = "https://eia2-2020-2021.herokuapp.com/";
  let form: HTMLFormElement;
  let particleQuantity: number;
  let particleSize: number;
  let color: string;
  let particleLifetime: number;
  let glowColor: string;
  let type: string;
  let moveables: MoveableObject[] = [];
  let canvas: HTMLCanvasElement;
  let backgroundImage: HTMLImageElement = new Image();
  export let crc2: CanvasRenderingContext2D;

  async function handleLoad(_event: Event): Promise<void> {
    console.log("Moin");
    let response: Response = await fetch(serverPage + "?" + "command=getTitels");
    let listOfTitels: string = await response.text();
    let titelList: Rocket[] = JSON.parse(listOfTitels);

    generateContent(titelList);
    canvas = <HTMLCanvasElement>document.querySelector("canvas");
    if (!canvas)
      return;
    crc2 = <CanvasRenderingContext2D>canvas.getContext("2d");
    let fireworkSaveButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button#fireworkSaveButton");
    let inputParticleQuantity: HTMLButtonElement = <HTMLButtonElement>document.querySelector("input#particleQuantity");
    let fireworkLoadButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button#fireworkLoadButton");
    form = <HTMLFormElement>document.querySelector("form#userConfiguration");
    canvas.addEventListener("mouseup", createObject);
    fireworkSaveButton.addEventListener("click", sendDataToServer);
    inputParticleQuantity.addEventListener("change", startMeter);
    fireworkLoadButton.addEventListener("click", getDataFromServer);
    window.setInterval(update, 20);

    backgroundImage.src = "./images/wsb_logo_bearbeitet.png";
  }

  function createObject(_event: MouseEvent): void {
    let mousePositionX: number = _event.clientX - crc2.canvas.offsetLeft;
    let mousepositionY: number = _event.clientY - crc2.canvas.offsetTop;
    let formData: FormData = new FormData(document.forms[0]);

    for (let entry of formData) {
      particleQuantity = Number(formData.get("particleQuantity"));
      particleSize = Number(formData.get("particleSize"));
      particleLifetime = Number(formData.get("particleLifetime"));
      color = String(formData.get("particleColor"));
      glowColor = String(formData.get("glowColor"));
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
    createParticle(particleQuantity, particleSize, mousePositionX, mousepositionY, color, glowColor, particleLifetime, type);
    console.log(type);
  }

  export async function getDataFromServer(_event: Event): Promise<void> {
    console.log("Datein wurden geladen");
    let target: HTMLInputElement = <HTMLInputElement>document.getElementById("LodedTitels");
    let userValue: string;
    userValue = target.value;
    let response: Response = await fetch(serverPage + "?" + "command=getAllDatas");
    let responseContent: string = await response.text();
    let allDatas: Rocket[] = JSON.parse(responseContent);
    let result: Rocket | undefined = allDatas.find(item => item.fireworkName === userValue);
    console.log(result);
    createUserRocket(result);
  }

  function createUserRocket(_result: Rocket | undefined): void {
    let color: string | undefined = _result?.particleColor;
    let particleLifetime: number | undefined = _result?.particleLifetime;
    let type: string | undefined = _result?.particleShape;
    console.log(color, particleLifetime, type);

    let form: HTMLCollectionOf<HTMLFormElement> = document.getElementsByTagName("form");

    for (let i: number = 0; i < form[0].elements.length; i++) {
      if (form[0].elements[i].id == "particleQuantity") {
        let particleQuantity: HTMLInputElement = <HTMLInputElement>document.getElementById("particleQuantity");
        particleQuantity.value = <string>color;
      }
      if (form[0].elements[i].id == "particleSize") {
        let particleSize: HTMLInputElement = <HTMLInputElement>document.getElementById("particleSize");
        particleSize.value = <string>color;
      }
      if (form[0].elements[i].id == "particleLifetime") {
        let particleLifetime: HTMLInputElement = <HTMLInputElement>document.getElementById("particleLifetime");
        particleLifetime.value = <string>color;
      }
      if (form[0].elements[i].id == "particleShape") {
        let particleShape: HTMLInputElement = <HTMLInputElement>document.getElementById("particleShape");
        particleShape.value = <string>color;
      }
      if (form[0].elements[i].id == "particleColor") {
        let particleColor: HTMLInputElement = <HTMLInputElement>document.getElementById("particleColor");
        particleColor.value = <string>color;
      }
      if (form[0].elements[i].id == "glowColor") {
        let glowColor: HTMLInputElement = <HTMLInputElement>document.getElementById("glowColor");
        glowColor.value = <string>color;
      }
    }
  }

  async function sendDataToServer(_event: Event): Promise<void> {
    let userConfigurationData: FormData = new FormData(form);
    let fireworkSave: HTMLInputElement = <HTMLInputElement>document.querySelector("input#fireworkSave");
    let fireworkName: string;
    fireworkName = fireworkSave.value;
    let query: URLSearchParams = new URLSearchParams(<any>userConfigurationData);
    console.log(fireworkName);
    // query.append("fireworkName", fireworkName);
    let response: Response = await fetch(serverPage + "?" + query.toString());
    let responseText: string = await response.text();
    alert("Deine Daten wurden gespeichert");
    console.log("Daten geschickt: ", responseText);
    fireworkSave.value = "";
  }

  function createParticle(_particleQuantity: number, _particleSize: number, _mousePositionX: number, _mousePositionY: number, _color: string, _glowColor: string, _particleLifetime: number, _type: string): void {
    let origin: Vector = new Vector(_mousePositionX, _mousePositionY);
    let color: string = _color;
    for (let i: number = 0; i < _particleQuantity; i++) {
      let radian: number = (Math.PI * 2) / _particleQuantity;
      let px: number = Math.cos(radian * i) * 110 * Math.random() * 2;
      let py: number = Math.sin(radian * i) * 110 * Math.random() * 2;
      let velocity: Vector = new Vector(px, py);
      let particle: MoveableObject = new Particle(particleSize, origin, velocity, color, glowColor, particleLifetime, type);
      moveables.push(particle);
    }
  }

  function update(): void {
    crc2.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    for (let moveable of moveables) {
      moveable.move(1 / 50);
      moveable.draw();
    }
    deleteExpandables();
  }

  function deleteExpandables(): void {
    for (let index: number = 0; index <= moveables.length - 1; index++) {
      if (moveables[index].expendable)
        moveables.splice(index, 1);
    }
  }

  function startMeter(_event: Event): void {
    let target: HTMLInputElement = <HTMLInputElement>_event.target;
    let meter: HTMLMeterElement = <HTMLMeterElement>document.querySelector("meter");
    meter.value = parseFloat(target.value);
  }
}