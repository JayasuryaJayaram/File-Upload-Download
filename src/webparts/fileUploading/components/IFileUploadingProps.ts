import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFileUploadingProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
}
