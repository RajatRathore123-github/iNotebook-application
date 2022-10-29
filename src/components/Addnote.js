import React,{useState,useContext} from 'react'
import noteContext from '../context/notes/noteContext'


const Addnote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title:"",description:"",tag:""})

    const handleClick = (e) =>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("Added successfully","success");

    }
    const onChange = (e)=>{
        setNote({...note,[e.target.name]: e.target.value})
    }
  return (
    <>
    <div className="container my-3">
    <h1>Add a note here</h1>
    <form action="">
      <div className="mb-3 mt-3">
        <label htmlFor="title" className='form-label'>Title</label>
        <input type="text" className='form-control' placeholder='Enter title' id="title" name='title'value={note.title} onChange={onChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="description" className='form-label'>Description</label>
        <input type="description" className='form-control' placeholder='Enter description'value={note.description} id="description" name='description' onChange={onChange}/>
      </div>
      <div className="mb-3">
        <label htmlFor="tag" className='form-label'>Tag</label>
        <input type="tag" className='form-control' placeholder='Enter tag' id="tag"value={note.tag} name='tag' onChange={onChange}/>
      </div>
      
      
      <button disabled={note.title.length < 5 && note.description.length < 5} className='btn btn-primary' onClick={handleClick}>Add note</button>
    </form>
    </div>
    </>
  )
}

export default Addnote