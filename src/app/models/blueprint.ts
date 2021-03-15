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
  numberOfAboveGroundFloors: number = 1;
  numberOfBasementFloors!: number;
  files: Array<string> = [];
  fileMetaInfos: Array<Array<FileMeta>> = [];
  floorAreas: Array<number> =[];
  dummyFixtureImgURL: string = "https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//floor_plan_fixture_symbol_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=RxgSmUlwYw4rIErTQtcfmJuU9V0%3D&Expires=1615562504";
  dummyExternalImgURL: string = "https://husky-ai-data.s3.amazonaws.com/building_blueprint_analysis/result_files/JngjndfjhBfj/eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJLb3VyeXUiLCJsYXN0TmFtZSI6IktpbiIsInJvbGVOYW1lIjoiUk9MRV9VU0VSIiwidXNlcm5hbWUiOiJrb211Z2kiLCJzdWIiOiJrb211Z2kiLCJpc3MiOiJadWx1IiwiZXhwIjoxNjQ2Mjk0NTk2LCJpYXQiOjE2MTQ3NTg1OTZ9.BuiFLXY0HzaiV4V2FHzoxJpPIPJlXjWbWcsSgEeipdw//area_table_external_shape_drawn_img_0.png?AWSAccessKeyId=AKIAIAGWIZNVODLSWWMQ&Signature=h3hHC3pPDML%2BllOQkButT73f8Mc%3D&Expires=1615562505";
}
