const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const {body,validationResult} = require("express-validator");

const router = express.Router();

// fetching notes using : "/api/notes/getUser"

router.get("/fetchnotes",fetchUser, async(req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
    res.json(notes);
    } catch (error) {
        res.status(500).send({error:"Internal server error"});
    }
})

// Add a note using : POST "/api/notes/addnotes"
router.post("/addnotes",fetchUser,[body("title","Please enter a valid title").isLength({min : 3}),
body("description","Description must be atleast 5 characters ").isLength({min : 5})],async (req,res)=>{
try {
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const note = new Note({
        title, description, tag, user : req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote);
} catch (error) {
    res.status(500).send({error:"Internal server error"});
}
    
})

// Updting an existing note using : PUT "/api/notes/updatenote"
router.put("/updatenote/:id",fetchUser,async(req,res)=>{
    try{
        const {title,description,tag} = req.body;
    //Create newNote object
    const newNote = {};
    if(title){
        newNote.title = title
    };
    if(description){
        newNote.description = description
    };
    if(tag){
        newNote.tag = tag;
    };
    let note = await Note.findById(req.params.id);
    if(!note){
       return  res.status(404).send("Not Found");
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote},{new : true});
    res.json({note});
    }
    catch(error){
        res.status(500).send({error:"Internal server error"});
    }
    
})

// Deleting a note using : DELETE "/api/notes/deletenote"

router.delete("/deletenote/:id",fetchUser,async(req,res)=>{
    try{
        // Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if(!note){
        return res.status(401).send("Not found");
    }
    // Allow deletion
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success" : "Note has been deleted","note" : note });
    }
    catch(error){
        res.status(500).send({error:"Internal server error"});
    }
    
})

module.exports = router