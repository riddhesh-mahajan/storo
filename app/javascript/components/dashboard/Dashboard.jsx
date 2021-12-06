import React ,{useState, useEffect, useRef} from 'react';
import AWS from 'aws-sdk'
import { FileIcon, defaultStyles } from 'react-file-icon';
import { v4 as uuidv4 } from 'uuid';
import {S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY} from '../aws/config'


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
    const fileInputRef = useRef()

    var foldersExist = 0;
    var filesExist = 0;

    const [progress , setProgress] = useState([]);
    const [prefix , setPrefix] = useState(localStorage.getItem('user_id') + '/');
    const [filesAndFolders , setFilesAndFolders] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        loadFilesAndFolders();
    }, [])

    useEffect(() => {
        loadFilesAndFolders()
    }, [prefix])

    const handleFileInput = (e) => {
        const selectedFiles = e.target.files;
        setSelectedFiles(selectedFiles);
        
        const tempProgress = [];
        for (var i = 0; i < selectedFiles.length; i++) {
            tempProgress.push(0);
        }
        setProgress(tempProgress)
    }

    const uploadFile = (files) => {
        for (var i=0; i < files.length; i++) {
            const params = {
                ACL: 'public-read',
                Body: files[i],
                Bucket: S3_BUCKET,
                Key: prefix + files[i].name
            };
    
            const tempIndex = i;

            s3.putObject(params)
                .on('httpUploadProgress', (evt) => {
                    setProgress(prevProgress=>{
                        prevProgress[tempIndex] = Math.round((evt.loaded / evt.total) * 100)
                        return prevProgress
                    })
                })
                .send((err) => {
                    if (err) console.log(err)
    
                    loadFilesAndFolders();
                }); 
        };
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
            foldersExist = 0;
            filesExist = 0;
            setFilesAndFolders(data.Contents);
        });
    }

    const openFolder = (folderPath) => {
        setFilesAndFolders([])
        setPrefix(prefix.concat(folderPath));
    }

    return (
    <div className="container col-md-6 col-11">
        <p className="text-center fw-bold display-3 p-3">Storo</p>

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


        {
            progress.map((indivisualFileProgress, index)=>{
                const fileName = selectedFiles[index].name;
                if(indivisualFileProgress != 100){
                    return (
                        <div key={uuidv4()} className="shadow-sm bg-white p-2 rounded border mb-3">
                            <p className="mb-1">{fileName}</p>

                            <div className="d-flex align-items-center">
                                <div className="progress mb-2 flex-fill">
                                    <div className="progress-bar" role="progressbar" style={{width: indivisualFileProgress + '%'}}></div>
                                </div>
                                <p className="fs-6 ms-2">{indivisualFileProgress}%</p>
                            </div>
                            
                        </div>
                    )
                }
            })
        }
        

        <input ref={fileInputRef} type="file" multiple="multiple" onChange={handleFileInput} className="d-none"/>


        <button className="btn btn-primary col-12 mb-2" onClick={()=>{fileInputRef.current.click();}}>Select file</button>
        <button className="btn btn-primary col-12" onClick={() => uploadFile(selectedFiles)}> Upload to S3</button>

        
        <br />
        <br />

        <div className="d-flex align-items-center mb-4">
            <p className="me-4 mb-0 pb-0 fs-2 fw-bold">Folders</p>
            <button type="button" className="btn btn-primary" style={{borderRadius: '100px'}} data-bs-toggle="modal" data-bs-target="#exampleModal">
            <span className="fw-bold">+</span>
            </button>
        </div>
        
        <div className="row gx-4 gy-4">
            {
                // Folders
                filesAndFolders.map((file)=>{
                    if(file.Key.replace(prefix,'').split('/').length == 2 && !file.Key.replace(prefix,'').includes('.')){
                        foldersExist = 1;
                        
                        return (
                            <div className="col-md-2 col-4" key={uuidv4()} onClick={()=>{openFolder(file.Key)}}>
                                <FileIcon extension={file.Key.replace(prefix, '').replace('/', '')} fold={false} />
                            </div>
                        )
                    }
                })
            }

        {(() => {          
            if(foldersExist == 0){
                return (
                    <div className="ms-2 border rounded col-12">
                        <p className="m-2 text-center">No Folders Found</p>
                    </div>
                )
            }   
         })()}

        </div>

        <br />

        <div className="row gx-4 gy-4">
            <p className="me-4 mb-0 pb-0 fs-2 fw-bold">Files</p>

            {
                // Files
                filesAndFolders.map((file)=>{
                    if(!file.Key.replace(prefix,'').includes('/') && file.Key.includes('.')){
                        const fileAWSLink = "https://storo.s3.eu-west-3.amazonaws.com/" + file.Key;
                        filesExist = 1;

                        return (
                            <div className="col-md-2 col-4" key={uuidv4()}>
                                <a href={fileAWSLink}>
                                    <FileIcon extension={re.exec(file.Key)[1]} color="#f542d4" />
                                    <p className="p-2 overflow_word_break">{file.Key.replace(prefix, '')}</p>
                                </a>
                            </div>
                        )
                    }
                })
            }

        {(() => {          
            if(filesExist == 0){
                return (
                    <div className="ms-2 border rounded col-12">
                        <p className="m-2 text-center">No Files Found</p>
                    </div>
                )
            }   
         })()}
        </div>

        <br /><br />
    </div>
    )
}

export default Dashboard;