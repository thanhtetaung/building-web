import { Building } from "./building";
import { BuildingSite } from "./building-site";
import { Image } from "./image";

export class BlueprintAnalysisResponse {
  imgs: Array<Image> = [];
  externalShapeDrawnImgs: Array<Image> = [];
  fixtureSymbolDrawnImgs: Array<Image> = [];
  buildingSite!: BuildingSite;
  building!: Building;
}
