import React ,{useState, useEffect, useRef} from 'react';
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
    region: REGION,
    bucket: S3_BUCKET
});
var s3 = new AWS.S3();

const Dashboard = () => {
    var re = /(?:\.([^.]+))?$/;
    
    const folderNameRef = useRef()
    const closeModalBtnRef = useRef()

    const [progress , setProgress] = useState(0);
    const [prefix , setPrefix] = useState('');
    const [filesAndFolders , setFilesAndFolders] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadFilesAndFolders();
    }, [])

    useEffect(() => {
        loadFilesAndFolders()
    }, [prefix])

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: prefix + file.name
        };

        s3.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)

                loadFilesAndFolders();
            });
    }

    const createFolder = () => {
        const folderName = folderNameRef.current.value;

        const params = {
            ACL: 'public-read',
            Body: '',
            Bucket: S3_BUCKET,
            Key: prefix.concat(folderName.concat('/'))
        };

        s3.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)

                loadFilesAndFolders();
                
                closeModalBtnRef.current.click();
            });
    }

    function loadFilesAndFolders(){
        var params = { 
            Bucket: S3_BUCKET,
            Delimiter: '',
            Prefix: prefix
        }
           
        s3.listObjects(params, function (err, data) {
            if(err)throw err;

            setFilesAndFolders(data.Contents);
        });
    }

    const openFolder = (folderPath) => {
        setPrefix(prefix.concat(folderPath));
    }

    return (
    <div className="container">
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Create folder</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <input ref={folderNameRef} type="text" className="form-control" placeholder="Folder name" />
                </div>
                <div className="modal-footer">
                    <button ref={closeModalBtnRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => createFolder()}>Create folder</button>
                </div>
                </div>
            </div>
        </div>





        <div>Native SDK File Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>

        <button onClick={() => loadFilesAndFolders()}>Load files</button>

        <h3>{prefix}</h3>
        
        <h1>Folders</h1>
        <div className="row gx-4 gy-4">
            {
                // Folders
                filesAndFolders.map((file)=>{
                    if(file.Key.replace(prefix,'').split('/').length == 2 && !file.Key.replace(prefix,'').includes('.')){
                        return (
                            <div className="col-2" key={uuidv4()} onClick={()=>{openFolder(file.Key)}}>
                                <FileIcon extension="Folder" fold={false} />
                                <p className="p-2 overflow_word_break">{file.Key.replace(prefix, '')}</p>
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
                    if(!file.Key.replace(prefix,'').includes('/') && file.Key.includes('.')){
                        const fileAWSLink = "https://storo.s3.eu-west-3.amazonaws.com/" + file.Key;
                        return (
                            <div className="col-2" key={uuidv4()}>
                                <a href={fileAWSLink}>
                                    <FileIcon extension={re.exec(file.Key)[1]} color="#f542d4" />
                                    <p className="p-2 overflow_word_break">{file.Key.replace(prefix, '')}</p>
                                </a>
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