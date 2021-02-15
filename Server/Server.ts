import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

export namespace Firework {

    export interface Rocket {
        [type: string]: string | string[] | undefined;
    }

    let fireworkCollection: Mongo.Collection;
    let databaseUrl: string = "mongodb+srv://DerPapa:asdfyxcv@eia2-2020-2021-endabgab.a47ra.mongodb.net/EIA2-2020-2021-Endabgabe?retryWrites=true&w=majority";
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
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
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
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
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
        _response.write(listOfTitels);
        _response.end();

    }

    async function getAllDatas(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {

        let result: Mongo.Cursor<any> = fireworkCollection.find();
      
        let arrayResult: string[] = await result.toArray();
        let jsonResult: string = JSON.stringify(arrayResult);
        _response.write(jsonResult);
        _response.end();
    }

    function storeRocket(_userRocket: Rocket, _response: Http.ServerResponse): void {
        fireworkCollection.insertOne(_userRocket);
        _response.end();
    }
}