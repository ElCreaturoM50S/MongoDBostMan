const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const myDatabase = "cats";
const url = `mongodb://127.0.0.1:27017/${myDatabase}`;

mongoose.connect(url);
const db = mongoose.connection;

app.get("/", (req, res)=>{
    res.send("Heja w expresie ula");
})

app.get("/api/cats", async (req, res)=>{
    try{
        const collection = db.collection("home") ;
        const queryResult = collection.find({}); // Returns a collection
        const allCats = await queryResult.toArray();
        res.send(allCats) ;

    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.get("/api/cats/:id", async (req, res)=>{
    try{
        const catId = parseInt(req.params.id)
        if(isNan(catId)){
            return res.status(400).json({message: "Invalid ID format"})
        }

        const document = await collection.findOne({id: catId});

        if(!document) {
            res.status(404).json({message: "Document not found"})
        }
        res.json(document)
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})
    } 
})

app.delete("api/cats/:id", async (req,res)=>{
    try{
        const catId = parseInt(req.params.id)
        if(isNan(catId)){
            return res.status(400).json({message: "Invalid ID format"})
        }

        const collection = db.collection("home")
        const catToDelete = await collection.deleteOne({id:catId});
        if(catToDelete.deletedCount === 0) {
            return res.status(404).json({message: "Document not found"})
        }
        res.json({messag: "Hurra uda sie skasowac dane"})

    } catch(err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.post("api/cats", async (req, res)=>{
    try{
        console.log("LMSLDMSALDMSALD")
        const newCat = req.body
        if(!isValidDocument(newCat)){
            return res.status(400).json({message: "Invalid document format"})
        }
        const collection = db.collection("home")
        const result = await collection.insertOne(newCat)
        if(!result.acknowledged) {
            return res.status(500).json({message:"Fail to add document"})
        }
        res.status(201).json({message:"Doc added successfully"})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.put("/api/cats/:id", async (req,res)=>{
    try {
        const catId = parseInt(req.params.id)
        if(isNan(catId)){
            return res.status(400).json({message: "Invalid ID format"})
        }

        const catBodyUpdate = req.body
        if(!isValidDocument(catBodyUpdate)){
            return res.status(400).json({message: "Invalid document format"})
        }

        const collection = db.collection("home")
        const catToUpdate = await collection.replaceOne({id:catId},catBodyUpdate);
        
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})        
    }
})

app.patch("/api/cats/:id", async (req,res)=>{
    try {
        const catId = parseInt(req.params.id)
        if(isNan(catId)){
            return res.status(400).json({message: "Invalid ID format"})
        }

        const catBodyUpdate = req.body
        if(!isValidDocument(catBodyUpdate)){
            return res.status(400).json({message: "Invalid document format"})
        }

        const collection = db.collection("home")
        const catToUpdate = await collection.replaceOne({id:catId},catBodyUpdate);
        
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "Internal Server Error"})        
    }
})
app.listen(2137, ()=>console.log("Server is running on 2137")) ;

process.on('SIGINT', ()=>{
    console.log("Zamykanie połączenia") ;
    db.disconnect( ()=>{
        process.exit();
    })
})

function isValidDocument(doc){
    return doc && typeof(doc) === 'object' && Object.keys(doc).length > 0; 
}