import React ,{useState} from 'react';
import AWS from 'aws-sdk'

const S3_BUCKET ='storo';
const REGION ='eu-west-3';
const ACCESS_KEY ='AKIA3PCFA2NHZ3DIQNY3';
const SECRET_ACCESS_KEY ='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';

AWS.config.update({
    accessKeyId: ACCESS_KEY, 
    secretAccessKey: SECRET_ACCESS_KEY, 
    region: 'eu-west-3',
    bucket: S3_BUCKET
});
var s3 = new AWS.S3();

const Dashboard = () => {
    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        s3.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }

    function loadFiles(){
        var params = { 
            Bucket: S3_BUCKET,
            Delimiter: '/',
            Prefix: ''
        }
           
        s3.listObjects(params, function (err, data) {
            if(err)throw err;
            console.log(data);
        });
    }

    return <div>
        <div>Native SDK File Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>

        <button onClick={() => loadFiles()}>Load files</button>
    </div>
}

export default Dashboard;