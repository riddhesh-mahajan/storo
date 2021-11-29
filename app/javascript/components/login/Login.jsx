import React, {useRef} from 'react'
import axios from 'axios';

export default function Login() {
    const emailRef = useRef('')
    const passwordRef = useRef('')

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
            }
        });
    }

    return (
        <div>
            <h1>Login</h1>
            
            <input ref={emailRef} type="text" placeholder="Email" />

            <input ref={passwordRef} type="text" placeholder="Password" />
            
            <button onClick={login}>Login</button>
        </div>
    )
}
