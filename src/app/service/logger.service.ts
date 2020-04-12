import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  constructor() {}
  private MessageString(message: any) {
    if (message instanceof String || message instanceof Number) return message;
    return JSON.stringify(message);
  }
  public LogDebug(message: any) {
    if (!environment.production)
      console.log("Debug:" + this.MessageString(message));
  }
  public LogInfo(message: any) {
    console.log("Info" + this.MessageString(message));
  }
  public LogError(error:Error) {
    console.error(
      "error:" + error.name + "\n" + error.message + "\n" + error.stack
    );
    
  }
}
