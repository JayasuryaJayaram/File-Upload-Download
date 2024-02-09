import * as React from "react";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import { IFileUploadingProps } from "./IFileUploadingProps";
import styles from "./FileUploading.module.scss";
// import { Card } from "antd";

const FileUploading = (props: IFileUploadingProps) => {
  const getFileBuffer = async (file: File): Promise<ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(event.target?.error);
      };

      fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as ArrayBuffer);
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  const uploadFile = async (
    fileData: ArrayBuffer | null,
    fileName: string
  ): Promise<void> => {
    if (!fileData) {
      throw new Error("No file data found");
    }

    const endpoint = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('File Uploads')/RootFolder/Files/add(overwrite=true,url='${fileName}')`;

    const options: ISPHttpClientOptions = {
      headers: { "CONTENT-LENGTH": fileData.byteLength.toString() },
      body: fileData,
    };

    const response = await props.context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      options
    );

    if (response.status === 200) {
      alert("File uploaded successfully");
    } else {
      throw new Error(`Error uploading file: ${response.statusText}`);
    }
  };

  const handleUpload = async () => {
    const inputFileElement = document.querySelector(
      `.${styles.fileUpload}-fileUpload`
    ) as HTMLInputElement;

    if (
      inputFileElement &&
      inputFileElement.files &&
      inputFileElement.files.length > 0
    ) {
      const file = inputFileElement.files[0];
      const filePathParts = file.name.split("\\");
      const fileName = filePathParts[filePathParts.length - 1];

      const fileData = await getFileBuffer(file);

      if (fileData) {
        await uploadFile(fileData, fileName);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerBox}>
        <div>File Upload</div>
        <div>
          <input
            className={`${styles.fileUpload}-uploadButton`}
            type="button"
            value="Upload File"
            onClick={handleUpload}
            style={{
              padding: "6px",
              width: "85px",
              fontSize: "15px",
              color: "#000",
              backgroundColor: "rgb(231 231 231)",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <div className={styles.contentBox}>
        <img
          src={require("../assets/server.png")}
          alt="Upload Img"
          className={styles.uploadImg}
        />
        <p className={styles.text}>
          upload your{" "}
          <span style={{ fontWeight: "600", textDecoration: "underline" }}>
            files
          </span>{" "}
          to cloud
        </p>
      </div>
      <div className={styles.inputs}>
        <input
          className={`${styles.fileUpload}-fileUpload`}
          type="file"
          style={{
            width: "200px",
            fontSize: "15px",
            margin: "10px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default FileUploading;
