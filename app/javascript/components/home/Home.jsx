import React from 'react'
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    function navigateToLogin(){
        navigate('/login')
    }

    function navigateToSignup(){
        navigate('/signup')
    }

    return (
        <>
            <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src="https://riddhesh-mahajan-dev.s3.eu-west-3.amazonaws.com/illustrations/storo+icon.svg" alt="" width="30" height="24" className="d-inline-block align-text-top" />
                    <span className="ms-2 fs-4 fw-bold">Storo</span>
                </a>

                <div className="d-flex">
                <button className="btn btn-primary me-4" onClick={navigateToLogin}>Log in</button>
                </div>
            </div>
            </nav>

            <div style={{minHeight: '80vh'}} className="row">
                <div className="col-md-6 col-11 d-flex flex-column align-items-center justify-content-center">
                    <div className="col-9">
                        <p className="display-2 fw-bold">Easy, Secure and Scalable storage</p>
                        <p>Store, share, and collaborate on files and folders from any mobile device, tablet, or computer</p>
                        <button className="btn btn-lg btn-primary" onClick={navigateToSignup}>Get started</button>
                    </div>
                </div>

                <div className="col-md-6 d-none d-md-block">
                    <img src="https://riddhesh-mahajan-dev.s3.eu-west-3.amazonaws.com/illustrations/Data+maintenance_Two+Color.svg" alt="" className="col-12" />
                </div>
            </div>
        </>
    )
}
