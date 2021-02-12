import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Firework {
    export interface Rocket {
        [type: string]: string | string[] | undefined;
    }

    let fireworkCollection: Mongo.Collection;
    //let databaseUrl: string = "mongodb+srv://DerPapa:asdfyxcv@eia2-2020-2021-endabgab.a47ra.mongodb.net/EIA2-2020-2021-Endabgabe?retryWrites=true&w=majority";
    let databaseUrl: string = "mongodb+srv://sebify:dnS28T59e9KVADSM@eia2-endabgabe-sebastia.21tky.mongodb.net/EIA2-Endabgabe-SebastianHoffmann?retryWrites=true&w=majority";
    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;
    startServer(port);
    connectToDatabase(databaseUrl);

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        console.log("Server startet auf Port " + _port);
        server.listen(_port);
        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }; //mit diesen options eine Verbindung zur DB aufbauen
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        fireworkCollection = mongoClient.db("Firework").collection("Rockets");
        console.log("Database connection", fireworkCollection != undefined);
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("handleRequest");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        if (_request.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true); // der Url.parser wandelt den UrlWithParsedQuery in ein anders Format um. Durch true wird daraus ein besser lesbares assoziatives Array. 
            let command: string | string[] | undefined = url.query["command"];
            
            console.log("Der URL", _request.url);

            if (command === "getTitels") {
                getTitels(_request, _response);
                console.log("Titel geholt");
                return;
            }
            if (command === "getAllDatas") {
                getAllDatas(_request, _response);
                console.log("Titeldaten geholt");
                return;
            }
            else {
                storeRocket(url.query, _response);
                console.log("Daten gespeichert");
            }
            return;
        }
        _response.end();
    }

    async function getTitels(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        let result: Mongo.Cursor<any> = fireworkCollection.find({}, { projection: { _id: 0, fireworkName: 1 } });
        let arrayResult: string[] = await result.toArray();
        let listOfTitels: string = JSON.stringify(arrayResult);
        console.log(listOfTitels);
        _response.write(listOfTitels); //Übergabe der Daten an den client
        _response.end();
    }

    async function getAllDatas(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        let result: Mongo.Cursor<any> = fireworkCollection.find();
        let arrayResult: string[] = await result.toArray();
        let jsonResult: string = JSON.stringify(arrayResult);
        // console.log(jsonResult);
        _response.write(jsonResult); //Übergabe der Daten an den client
        _response.end();
    }

    function storeRocket(_userRocket: Rocket, _response: Http.ServerResponse): void {
        fireworkCollection.insertOne(_userRocket);
        _response.end();
    }
    // async function getTitels(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
    //     let result: Mongo.Cursor<any> = fireworkCollection.find({}, { projection: { _id: 0, fireworkName: 1 } });
    //     let arrayResult: string[] = await result.toArray();
    //     let jsonResult: string = JSON.stringify(arrayResult);
    //     console.log(jsonResult);

    //     _response.write(jsonResult); //Übergabe der Daten an den client

    //     _response.end();
    // }
}