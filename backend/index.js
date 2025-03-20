const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');
const authenticationRoutes = require('./Routes/authenticationRoutes')
const PostsRoutes =  require('./Routes/postsRoutes')



const {open} = require('sqlite');
const sqlite3 = require('sqlite3')
const dbPath = path.join(__dirname,"media.db");

const Port = process.env.PORT || 5000

let db = null;
const initializeDBandServer = async () => {
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        })
    }catch(error){
        console.log(`DB Error : ${error.message}`);
        process.exit(1);
    }
}

const startServer = () => {
    app.use(bodyParser.json());
    app.use(cors());

    app.use('/auth',authenticationRoutes(db));
    app.use('/post',PostsRoutes(db));

    app.listen(Port, () => {
        console.log(`DB and Server is Connected Successfully and the port is http://localhost:${Port}`);
    })
}

initializeDBandServer()
  .then(() => {
    startServer()
  })
  .catch((error) => {
    console.log(`Failed to Initialize the DB and the message is ${error.message}`);
    process.exit(1);
  });


app.get('/',(req,res) => {
    res.send('Hey Vineeth the Port is Connected Successfully and do the dream work and live in')
})