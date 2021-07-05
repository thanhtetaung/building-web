import { BlueprintAnalysisResponse } from "./blueprint-analysis-response";
import { FileMeta } from "./file-meta";
import { UploadResponse } from "./upload-response";

export class BlueprintBuilding {
  id!: string;
  name!: string;
  siteArea!: number;
  totalFloorArea!: number;
  fireZone!: string;
  floorAreaRatio!: number;
  buildingCoverageRatio!: number;
  buildingArea!: number;
  frontalRoadWidth!: number;
  floor!: number;
  specialRoadExistence!: boolean;
  heightOfBuilding!: number;
  distanceToSpecialRoad!: number;
  useDistricts!: string;
  buildingCoverageRatioDeregulation!: boolean;
  numberOfAboveGroundFloors: number = 1;
  numberOfBasementFloors!: number;
  files: Array<string> = [];
  fileMetaInfos: Array<Array<FileMeta>> = [];
  floorAreas: Array<number> =[];
  result!: BlueprintAnalysisResponse;
  processingStatus!: string
  imageMetaInfos: Array<UploadResponse> = [];
  executionArn!: string;
  startDate!: number;
}
