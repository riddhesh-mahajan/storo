import React, {useRef, useState} from 'react'
import axios from 'axios';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '../aws/config'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from "react-router-dom";

AWS.config.update({
    accessKeyId: ACCESS_KEY, 
    secretAccessKey: SECRET_ACCESS_KEY, 
    region: REGION,
    bucket: S3_BUCKET
});

var s3 = new AWS.S3();

export default function Signup() {
    const firstNameRef = useRef('')
    const lastNameRef = useRef('')
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const confirmPasswordRef = useRef('')

    const [errorMessages, setErrorMessages] = useState([])
    const navigate = useNavigate();

    function createFolder(folderName) {
        const params = {
            ACL: 'public-read',
            Body: '',
            Bucket: S3_BUCKET,
            Key: folderName.concat('/')
        };

        s3.putObject(params)
            .send((err) => {
                if (err) console.log(err)
            });
    }

    function setupStorage(userId){
        createFolder(userId);
    }

    function signup(){
        const data = {
            'first_name': firstNameRef.current.value,
            'last_name': lastNameRef.current.value,
            'email': emailRef.current.value,
            'password': passwordRef.current.value,
        }

        axios.post('api/v1/user/create', data)
        .then((response) => {
            console.log(response)
            if(response.status == 201) {
                setupStorage(response.data.id.toString())
                navigate('/login')
            };
            
        }).catch(function (error) {
            console.log('AAA')
            console.log(error.response.data)
            const keys = Object.keys(error.response.data);
            console.log(keys);
            const tempErrorMessages = [];

            keys.forEach(key => {
                tempErrorMessages.push(key + ' ' + error.response.data[key])
                
            });

            setErrorMessages(tempErrorMessages);
            console.log(tempErrorMessages)
        });
    }

    return (
        <div className="d-flex align-items-center flex-column" style={{minHeight: '100vh'}}>
            <div className="col-md-3 col-11 mt-5">
                <p className="display-5 text-center mb-4 fw-bold">Signup</p>

                <input ref={firstNameRef} type="text" placeholder="First name" className="form-control mb-1" />
                
                <input ref={lastNameRef} type="text" placeholder="Last name" className="form-control mb-1"/>

                <input ref={emailRef} type="text" placeholder="Email" className="form-control mb-1"/>

                <input ref={passwordRef} type="password" placeholder="Password" className="form-control mb-1"/>
                <input ref={confirmPasswordRef} type="password" placeholder="Confirm password" className="form-control mb-1"/>

                
                {
                    errorMessages.map((error)=>{
                        return (<p key={uuidv4()} className="mb-1 text-danger">{error}</p>)
                    })
                }
                
                <button onClick={signup} className="btn btn-primary col-12 mt-3">Signup</button>
            </div>
        </div>
    )
}
