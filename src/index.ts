//imports
//npm modules
import express from 'express';
import cors from 'cors';
import path from 'path';
//routes
import routes from './routes';

//create an instance of express
const app = express();

//enable the ability to parse the body of requests
app.use(express.json());
//enables our API to be accessible from other domains
app.use(cors());

//handlebars specific configurations
app.use(express.urlencoded({extended: false}));
//declare where the Handlebars views files are located
app.set('views', path.join(__dirname, 'views')); //where it is
app.set('view engine', 'hbs');    //how are we rendering views - handlebars  how to render it
app.use(express.static(path.join(__dirname, 'public')));

//declare the port that our server will be listening on
const port = 3000;

//add routes to the express application
app.use('/', routes);

//start the server
app.listen(port, () => {
    console.log(`server running; listening on port ${port}`);
})