import React ,{useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  let navigate = useNavigate();
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  let location = useLocation();
  useEffect(()=>{
  },[location]);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-secondary" >
        <div className = "container-fluid">
            <Link className = "navbar-brand" to="#">iNotebook</Link>
            <button className = "navbar-toggler" data-bs-toggle = "collapse" data-bs-target = "#navbarNav" aria-controls = "navbarNav" aria-expanded = "false" aria-label = "Toggle navigation">
                <span className= "navbar-toggler-icon"></span>
            </button>
            <div className= "collapse navbar-collapse" id = "navbarNav">
                <ul className= "navbar-nav">
                    <li className= "nav-item"><Link className= {`nav-link ${location.pathname ==="/"? "active" : ""}`} to = "/">Home</Link></li>
                    <li className= "nav-item"><Link className= {`nav-link ${location.pathname ==="/"? "active" : ""}`} to = "/about">About</Link></li>
                </ul>
            </div>
            {!localStorage.getItem("token")?<div className="d-flex">
                  <Link className="btn btn-secondary mx-2" to="/login" role="button">Login</Link>
                  <Link className="btn btn-secondary mx-2" to="/signup" role="button">SignUp</Link>
            </div>:<button onClick={handleLogout} className="btn btn-secondary">Logout</button>}
        </div>
      </nav>
    </>
  )
}

export default Navbar