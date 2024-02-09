import * as React from "react";
import { IFileUploadingProps } from "./IFileUploadingProps";
import FileUploading from "./FileUploading";
import FileDownloading from "./FileDownloading";

const UploadDownload = (props: IFileUploadingProps) => {
  return (
    <>
      <div>
        <FileUploading
          description={props.description}
          isDarkTheme={props.isDarkTheme}
          environmentMessage={props.environmentMessage}
          hasTeamsContext={props.hasTeamsContext}
          userDisplayName={props.userDisplayName}
          context={props.context}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <FileDownloading
          description={props.description}
          isDarkTheme={props.isDarkTheme}
          environmentMessage={props.environmentMessage}
          hasTeamsContext={props.hasTeamsContext}
          userDisplayName={props.userDisplayName}
          context={props.context}
        />
      </div>
    </>
  );
};

export default UploadDownload;
