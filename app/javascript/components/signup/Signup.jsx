import React, {useRef} from 'react'
import axios from 'axios';

export default function Signup() {
    const firstNameRef = useRef('')
    const lastNameRef = useRef('')
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const confirmPasswordRef = useRef('')

    function signup(){
        const data = {
            'first_name': firstNameRef.current.value,
            'last_name': lastNameRef.current.value,
            'email': emailRef.current.value,
            'passsword': passwordRef.current.value,
        }

        axios.post('api/v1/user/create', data)
        .then(response => console.log(response));
    }

    return (
        <div>
            <h1>Signup</h1>

            <input ref={firstNameRef} type="text" placeholder="First name" />
            <input ref={lastNameRef} type="text" placeholder="Last name" />
            
            <input ref={emailRef} type="text" placeholder="Email" />
            <div className="form-text d-none">Error</div>

            <input ref={passwordRef} type="password" placeholder="Password" />
            <input ref={confirmPasswordRef} type="password" placeholder="Confirm password" />

            <button onClick={signup}>Signup</button>
        </div>
    )
}
