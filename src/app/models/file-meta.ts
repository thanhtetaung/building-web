export class FileMeta {
  include: boolean = true;
  blueprintType!: string
  floors: Array<number> = [];
  area!: string;
  imageUrl!: string;
  direction: Array<string> = [];
  numberOfRoom!: number;
}
