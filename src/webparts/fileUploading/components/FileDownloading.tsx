import * as React from "react";
import { useState, useEffect } from "react";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { IFileUploadingProps } from "./IFileUploadingProps";
import styles from "./FileDownloading.module.scss";

const FileUploading: React.FunctionComponent<IFileUploadingProps> = (
  props: IFileUploadingProps
) => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const endpoint = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Documents')/items?$select=FileLeafRef,FileRef`;
      const response: SPHttpClientResponse =
        await props.context.spHttpClient.get(
          endpoint,
          SPHttpClient.configurations.v1
        );
      if (response.ok) {
        const data = await response.json();
        setFiles(data.value);
      } else {
        console.error("Error fetching files:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const downloadFile = async (file: any) => {
    try {
      const endpoint = `${props.context.pageContext.web.absoluteUrl}${file.FileRef}`;
      const options: ISPHttpClientOptions = {
        headers: {
          Accept: "application/octet-stream", // Set the response type to blob
        },
      };
      const response: SPHttpClientResponse =
        await props.context.spHttpClient.get(
          endpoint,
          SPHttpClient.configurations.v1,
          options
        );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.FileLeafRef;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  console.log(files);

  return (
    <div className={styles.card}>
      <div className={styles.headerBox}>
        <div>File Download</div>
      </div>
      <div className={styles.contentBox}>
        <img
          src={require("../assets/download.png")}
          alt="Upload Img"
          className={styles.downloadImg}
        />
        <p className={styles.text}>
          download <span style={{ fontWeight: "600" }}>files</span> from
          document library
        </p>
      </div>
      <div className={styles.contentBox}>
        <table style={{ margin: "auto" }}>
          {files.map((file: any) => (
            <tr key={file.Id} className={styles.fileItem}>
              <td className={styles.file}>{file.FileLeafRef}</td>
              <td>
                <button
                  className={styles.downloadButton}
                  onClick={() => downloadFile(file)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default FileUploading;
