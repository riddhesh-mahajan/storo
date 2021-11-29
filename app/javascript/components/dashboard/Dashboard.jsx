import React ,{useState, useEffect} from 'react';
import AWS from 'aws-sdk'
import { FileIcon, defaultStyles } from 'react-file-icon';
import { v4 as uuidv4 } from 'uuid';

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
    var re = /(?:\.([^.]+))?$/;

    const [progress , setProgress] = useState(0);
    const [filesAndFolders , setFilesAndFolders] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadFilesAndFolders()
    }, [])

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

    function loadFilesAndFolders(){
        var params = { 
            Bucket: S3_BUCKET,
            Delimiter: '',
            Prefix: ''
        }
           
        s3.listObjects(params, function (err, data) {
            if(err)throw err;
            console.log(data);

            setFilesAndFolders(data.Contents);
        });
    }

    return (
    <div className="container">
        <div>Native SDK File Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>

        <button onClick={() => loadFilesAndFolders()}>Load files</button>

        <h1>Folders</h1>
        <div className="row gx-4 gy-4">
            {
                // Folders
                filesAndFolders.map((file)=>{
                    if(file.Key.includes('/') && !file.Key.includes('.')){
                        return (
                            <div className="col-2" key={uuidv4()}>
                                <FileIcon extension="Folder" fold={false} />
                                <p className="p-2 overflow_word_break">{file.Key}</p>
                            </div>
                        )
                    }
                })
            }
        </div>

        <div className="row gx-4 gy-4">
            <h1>Files</h1>
            {
                // Files
                filesAndFolders.map((file)=>{
                    if(!file.Key.includes('/')){
                        return (
                            <div className="col-2" key={uuidv4()}>
                                <FileIcon extension={re.exec(file.Key)[1]} color="#f542d4" />
                                <p className="p-2 overflow_word_break">{file.Key}</p>
                            </div>
                        )
                    }
                })
            }
        </div>
    </div>
    )
}

export default Dashboard;