import { FileMeta } from "./file-meta";

export class Blueprint {
  siteArea!: number;
  totalFloorArea!: number;
  fireZone!: string;
  floorAreaRatio!: number;
  buildingArea!: number;
  frontalRoadWidth!: number;
  floor!: number;
  specialRoadExistence!: boolean;
  heightOfBuilding!: number;
  distanceToSpecialRoad!: number;
  useDistricts!: string;
  buildingCoverageRatioDeregulation!: boolean;
  numberOfAboveGroundFloors!: number;
  numberOfBasementFloors!: number;
  files: Array<string> = [];
  fileMetas: Array<Array<FileMeta>> = [];
}
