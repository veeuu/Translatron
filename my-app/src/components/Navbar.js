import React from 'react';
import '../App.css';
import img from '../images/logo.png';
import { Link } from "react-router-dom";

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><h3>{props.title}</h3></Link>
                <img className="App-logo" src={img} alt="Logo" />
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/home"><h5>{props.val1}</h5></Link>
                        <Link className="nav-link" to="/form"><h5>{props.val3}</h5></Link>
                        <Link className="nav-link" to="/convert"><h5>{props.val2}</h5></Link>
                        <Link className="nav-link" to="/about"><h5>{props.val4}</h5></Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
