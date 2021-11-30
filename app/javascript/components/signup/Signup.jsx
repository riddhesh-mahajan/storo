import React, {useRef} from 'react'
import axios from 'axios';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '../aws/config'
import AWS from 'aws-sdk'


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

    function createFolder(folderName) {
        const params = {
            ACL: 'public-read',
            Body: '',
            Bucket: S3_BUCKET,
            Key: folderName
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
            setupStorage(response.data.id.toString());
        });
    }

    return (
        <div>
            <h1>Signup</h1>

            <input ref={firstNameRef} type="text" placeholder="First name" />
            <input ref={lastNameRef} type="text" placeholder="Last name" />
            
            <input ref={emailRef} type="text" placeholder="Email" />

            <input ref={passwordRef} type="password" placeholder="Password" />
            <input ref={confirmPasswordRef} type="password" placeholder="Confirm password" />

            <button onClick={signup}>Signup</button>
        </div>
    )
}
