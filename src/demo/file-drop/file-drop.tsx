import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import bytes from 'bytes';
import styles from './file-drop.module.css';

type FlexDirection = "column" | "inherit" | "-moz-initial" | "initial" | "revert" | "unset" | "column-reverse" | "row" | "row-reverse" | undefined;
const flexDirection: FlexDirection = 'column';

const baseStyle = {
  display: 'flex',
  flexDirection,
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  transition: 'border .3s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function FileDropComponent(props: any) {
  const [files, setFiles] = useState<MyFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

  const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const docTypes = ['application/pdf', 'text/plain'];
  
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: [...imageTypes, ...docTypes] });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const thumbs = files.map(file => {
    const { name, type, size, preview } = file;
    let fileName = name;
    if (name.length > 15) {
      fileName = `${name.substr(0, 8)}....${name.substr(-6)}`
    }
    return (
      <div key={name} className={styles.preview}>
        <div className={styles.filePreview}>
          {imageTypes.includes(type) ? (
            <img
              src={preview}
              alt={name}
            />
          ) : (
            <iframe
              title={name}
              src={preview}
              frameBorder="0"
              scrolling="no"
              height="100%"
              width="100%"
            ></iframe>
          )}
        </div>
        <div className={styles.fileInfo}>
          <div><strong>File:</strong> {fileName}</div>
          <div><strong>Type:</strong> {type}</div>
          <div><strong>Size:</strong> {`${bytes(size, { unitSeparator: ' ' })}`}</div>
        </div>
      </div>
    );
  });

  // clean up to avoid memory leaks (storing the preview unnecessarily)
  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>Drag and drop your files here.</div>
      </div>
      <aside>
        {thumbs}
      </aside>
    </section>
  )
}

export default FileDropComponent;

interface MyFile extends File {
  preview: string;
}

// Ref:
// * https://www.digitalocean.com/community/tutorials/react-react-dropzone
// * https://react-dropzone.js.org/#src
