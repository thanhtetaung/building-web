import { FileMeta } from "./file-meta";

export class Blueprint {
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
}
