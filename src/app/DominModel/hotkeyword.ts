export interface Hotkeyword {
    first:string;
    second:number;
    third:any;
    iconType:number;
}
export interface HotkeywordResult{
    hots:Hotkeyword[];
}
export interface HotkeywordResultRoot{
    code:number;
    result:HotkeywordResult;
}