import { BlueprintAnalysisBuilding } from "./blueprint-analysis-building";
import { BlueprintAnalysisBuildingSite } from "./blueprint-analysis-building-site";
import { Image } from "./image";

export class BlueprintAnalysisResponse {
  imgs: Array<Image> = [];
  externalShapeDrawnImgs: Array<Image> = [];
  fixtureSymbolDrawnImgs: Array<Image> = [];
  buildingSite!: BlueprintAnalysisBuildingSite;
  building!: BlueprintAnalysisBuilding;
}
