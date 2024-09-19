const express = require('express');
const bodyparser = require('body-parser');
const cors=require('cors');
const mongodb =require('mongoose');





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



mongodb.connect('mongodb://localhost:27017/express_db',{
useNewUrlParser:true,
useUnifiedTopology:true,

}).then(()=>{
    console.log("mongo DB is connnected")
}).catch((err)=>{

    console.error("Failed to connect to db",err);
});


const employeeSchema=new mongodb.Schema({
empId:Number,
empName:String,
experience:Number,


})

const Employee =mongodb.model('Employee',employeeSchema)



app.get('/', function (req, res) {
   res.send('we are at the root route of our server');
})

// GET /users - Retrieve all users 
app.get('/getallemployee', async (req, res) => {
//if we r not using async loop gets circular //check concept for async

try{
  const employees=await Employee.find();
res.status(200).json(employees);
}
catch(err){
    res.status(500).json({message:err.message})
}
     });
// POST /users - Create a new user 
app.post('/addEmployee', (req, res) => {
    try{
    console.log(req.body)
  const employee= new Employee(req.body);
  console.log(employee.empId+ "+*"+ employee.empName);
   employee.save();
  res.status(201).json(employee);

    }catch(err){
        res.status(400).json({message:err.message})
    }
   console.log(req.body);
   //const newEmployee = { empId:  req.body.empId, empName: req.body.empName, experience: req.body.experience };
  // res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

   
   })
  
   
   
// GET /users/:id - Retrieve a user by ID
app.get('/employee/:id',async (req, res) => {
  try{
    const empId=req.params.id;
   console.log(req.params.id)
//    if(mongodb.Types.ObjectId.isValid(empId)){
   const employee=await Employee.findOne({empId:empId})
                        if(!employee){
                            return res.status(400).json({message:"User not found"})
                        }
                        res.status(200).json(employee);
   
  }catch(err){
    res.status(400).json({message:err.message})
  
};
});
// PUT /users/:id - Update a user by ID 
app.put('/employee/:id',async(req, res) => {
    try{
   console.log(req.params.empId +" **"+req.params.id);
   const updatedEmployee = await Employee.findOneAndUpdate({empId:req.params.id},req.body,{new:true,runValidators:true})
   res.status(200).json(updatedEmployee);
if(!updatedEmployee){
    res.status(400).json({message:"Employee with this"+req.params.id +"not found"})
}

    }catch (err)
        {
        res.status(500).json({message:err.message})
        }
      })


app.delete('/employees/:id', async (req, res) => { 
 

    const empId=req.params.id;


const employee= await Employee.findOneAndDelete({empId:empId})
if(!employee){
    res.status(400).json({message:`Employee with ${empId} Not found`})
}
res.status(200).json({message:`Employee with ${empId} is deleted Successfully`})

 
     });

