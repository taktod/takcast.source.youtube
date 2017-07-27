import * as React from "react";

import {IBasePlugin} from "takcast.interface";
import {IPlugin} from "takcast.interface";
import {ISourcePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";

import {Source} from "./source";
import {pickupComponent} from "./ui/pickupComponent";

export class Youtube implements ISourcePlugin {
  public name = "youtube";
  public type = "source";
  private basePlugin:IBasePlugin;
  private youtubeId:string;
  constructor() {
    this.youtubeId = null;
    var script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);
  }
  public setPlugins(plugins:{[type:string]:Array<IPlugin>}):void {
    // シングルトン参照で必要なbasePluginを保持
    this.basePlugin = plugins["base"][0] as IBasePlugin;
  }
  public refPickupComponent():React.ComponentClass<{}> {
    return pickupComponent(this);
  }
  public _setYoutubeId(id:string):void {
    this.youtubeId = id;
  }
  public createNewSource():ISource {
    if(this.youtubeId == null) {
      // 保持データがない場合は新規作成しない
      return null;
    }
    return new Source(this.basePlugin, this.youtubeId);
  }
}

export var _ = new Youtube();