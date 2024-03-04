import express from "express";
import {AppDataSource} from "./data-source";
import router from "./router";
import initUsers from "./initUsers";

AppDataSource.initialize().then((data) => {
    initUsers();
})
    .catch(error => console.log('ERROR: ', error));

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.text());

app.use('/api/', router);


app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});