import { Floor } from "./floor";

export class Building {
  buildingArea!: number;
  totalFloorArea!: number;
  buildingCoverageRatio!: number;
  floorAreaRatio!: number;
  heightOfBuilding!: number;
  numberOfFloors!: number;
  floors: Array<Floor> = [];
}
