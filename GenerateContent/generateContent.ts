namespace Firework {
    export interface Rocket {
        fireworkName: string;
        particleLifetime: number;
        particleColor: string;
        particleShape: string;
       }

    export function generateContent(_titelList: Rocket[]): void {
        let group: HTMLElement | null = null;
        let fieldset: HTMLFieldSetElement | null = document.querySelector("fieldset#fireworkLoad");
        group = createSelect(_titelList);
        if (fieldset && group)
            fieldset.appendChild(group);
    }

    function createSelect(_titelList: Rocket[]): HTMLElement | null {
        let selection: HTMLSelectElement = document.createElement("select");
        selection.name = "LoadedTitels";
        selection.addEventListener("change", getDataFromServer);

        for (let titel of _titelList) {
            let option: HTMLOptionElement = document.createElement("option");
            option.setAttribute("name", titel.fireworkName);
            option.value = option.textContent = titel.fireworkName;
            selection.appendChild(option);
        }
        return selection;
    }
}















































