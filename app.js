const express = require('express');
const bodyparser = require('body-parser');
const cors=require('cors');
const mysql =require('mysql2');





const app = express();
app.use(express.json());
app.use(bodyparser.json())



app.use(express.urlencoded({extended:true}));
app.use(cors({
   origin:'http://localhost:4200'
}))

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
   console.log("Server Listening on PORT:", PORT);
});



const db= mysql.createConnection({
host:'localhost',
user:'root',
password:'root',
database:'express_db'

});

db.connect((err)=>{

   if(err){
      console.error('Error connecting to mysql:',err);
      return;
   }
   console.log("connected to mysql");
})

app.get('/', function (req, res) {
   res.send('we are at the root route of our server');
})
let employees = [{ empId: 232156, empName: 'Kajal Chaudhari', experience :45}, 
   { empId: 232156, empName: 'Divya Maheshwari', experience :30 }];
// GET /users - Retrieve all users 
app.get('/getallemployee', (req, res) => {
   res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
   const query='select * from employees';
   db.query(query,(err,results)=>{
      if(err){
        // console.error('Error connecting to mysql:',err);
         return res.status(500).json({error:err.message});
      }

      res.json(results);

   })
     });
// POST /users - Create a new user 
app.post('/addEmployee', (req, res) => {
  const {empId,empName,experience}=req.body;

   console.log(req.body);
   //const newEmployee = { empId:  req.body.empId, empName: req.body.empName, experience: req.body.experience };
   res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

   const query='insert into employees(empname,empid,experience) values(?,?,?)';
   db.query(query,[empName,empId,experience],(err,results)=>{
      if(err){
         console.error('Error inserting to mysql:',err);
          return res.status(500).json({error:"failed to add employee"});
       }
       const newEmployee={
         id:results.insertId,empName,empId,experience
       }

       res.status(201).json(newEmployee);
   })
  // employees.push(newEmployee); 
   
   
});
// GET /users/:id - Retrieve a user by ID
app.get('/employee/:id', (req, res) => {
   const empId=req.params.id;
   console.log(req.params.id)
   console.log(`id:${empId}`)
    const query ='select * from employees where empid=?';

    db.query(query,[empId],(err,results)=>{
      if(err){
         console.error('Error inserting to mysql:',err);
          return res.status(500).json({error:"failed to add employee"});
       }
       console.log(results + " results")
       if(results.length===0){
         return res.status(400).json({error:'employee not found'})
       }
     
        const employee =results[0]
        console.log(JSON.stringify(employee))
        res.status(200).json(employee)

    })
   

   
});
// PUT /users/:id - Update a user by ID 
app.put('/employee/:id',(req, res) => {
   console.log(req.params.empId +" **"+req.params.id);

   const {id} =req.params;
   console.log("req.body=",req.body ,req.params,)
   const {empName,experience}=req.body;
   // const employee = employees.find(e =>{
   //    return e.empId === req.params.id;
   // });
      const query='update employees set empName =?,experience=? where empid=?';
      db.query(query,[empName,experience,id],(err,result)=>{
         if(err){
            return res.status(500).json({error:'Internal Server Error'});

         }
         if(result.affectedRows === 0){
            return res.status(400).json({error:'Employee Not found'})
         }
         empId=id;
         const updatedEmployee={  empId,empName, experience};
         console.log(updatedEmployee);
  
    res.status(200).json(updatedEmployee);
      })
});

app.delete('/employees/:id', (req, res) => { 
   //const employeeIndex = employees.findIndex(u => u.id === parseInt(req.params.id));

   const empId=req.params.id;
   const query ="delete from employees where empid =?";
console.log(empId)
   db.query(query,[empId],(err,result)=>{
      if(err){
         return res.status(500).json({err:"Internal Server Error"})
      }
      if(result.affectedRows===0){
         return res.status(404).json({err:"Employee Not Found"})

      }
      res.status(200).json({message:`employee with ID ${empId} deleted successfully`})

   })
     });

