export interface Province {
  id: number;
  name: string;
  type: string;
  alias: string;
  citys:City[];
} 
export interface City {
  id: number;
  name: string;
  provinceId:number;
}