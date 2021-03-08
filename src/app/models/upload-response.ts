import { FileMeta } from "./file-meta";

export class UploadResponse {
  fileName!: string;
  path!: string;
  mediaType!: string;
  imageList: Array<string> = [];
  fileMetaInfos: Array<FileMeta> = [];
}
