const express= require('express')
const bcrypt = require('bcrypt');
const router = express.Router()

const authenticationRoutes = (db) => {

    router.post('/login', async (req,res) => {
        const {email,password} = req.body

        try{
            const checkUserQuery = `select * from users where email = ?`;
            const userPresent = await db.get(checkUserQuery,[email]);

            if(userPresent === undefined){
                return res.status(400).send('User not found');
            }
            else{
                const isMatch = await bcrypt.compare(password,userPresent.password);
                if (isMatch) {
                    res.status(200).json({message:"Login successful",userId: userPresent.id});
                    
                } else {
                    res.status(400).send("Invalid credentials");
                }
            }
        }catch (error) {
            console.error(error);
            res.status(500).send("Error logging in");
        }

    })


    router.post('/signup', async(req,res) => {
        const {name,email,password} = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try{
            const query = `select * from users where email = ?`;
            const userPresent = await db.get(query,[email]);

            if(userPresent === undefined){
                const newUserQuery = `INSERT INTO USERS (name,email,password)
                values ('${name}','${email}','${hashedPassword}')`;
                const response = await db.run(newUserQuery);
                res.status(200).json({
                    message: "User registered successfully",
                    userId: response.lastID,
                });
    
            }
            else{
                res.status(400).send("User already exists");
            }
            
        }catch(error){
            res.status(500).send(`DB Error: ${error.message}`);
        }
    })


    router.get('/getUserId/:userId', async (req,res) => {
        const {userId} = req.params

        const getUserNameQuery = `select name from users where id = ?`
        try{
            const response = await db.get(getUserNameQuery,[userId]);
            if (response) {
                res.status(200).json({ userName: response.name });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }catch(error){
            res.status(500).send(`DB Error: ${error.message}`);
        }
    })

    return router

}


module.exports= authenticationRoutes