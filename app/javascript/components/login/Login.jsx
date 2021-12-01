import React, {useRef, useState} from 'react'
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function Login() {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState([])

    function login(){
        const data = {
            'email': emailRef.current.value,
            'password': passwordRef.current.value,
        }

        axios.get('api/v1/user/login', { params: data })
        .then((response)=>{
            console.log("Riddhesh")
            console.log(response.status);

            if(response.status == 200){
                localStorage.setItem("user_id", response.data.id);
                navigate('/dashboard')
            }
        }).catch(function (error) {
            const tempErrorMessages = [];

            if(error.response.status == 403) tempErrorMessages.push('Wrong credentials')

            setErrorMessages(tempErrorMessages);
        });;
    }

    return (
        <div className="d-flex align-items-center flex-column" style={{minHeight: '100vh'}}>
            <div className="col-4 mt-5">
                <p className="display-5 text-center mb-4 fw-bold">Login</p>

                <input ref={emailRef} type="text" placeholder="Email" className="form-control mb-1" />

                <input ref={passwordRef} type="text" placeholder="Password" className="form-control mb-1" />
                
                {
                    errorMessages.map((error)=>{
                        return (<p key={uuidv4()} className="mb-1 text-danger">{error}</p>)
                    })
                }

                <button onClick={login} className="btn btn-primary col-12 mt-3">Login</button>
            </div>
        </div>
    )
}
