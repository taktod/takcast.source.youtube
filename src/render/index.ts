import * as React from "react";

import {IBasePlugin} from "takcast.interface";
import {IPlugin} from "takcast.interface";
import {ISourcePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";

import {pickupComponent} from "./ui/pickupComponent";

export class Youtube implements ISourcePlugin {
  public name = "youtube";
  public type = "source";
  private basePlugin:IBasePlugin;
  constructor() {
  }
  public setPlugins(plugins:{[type:string]:Array<IPlugin>}):void {
    // シングルトン参照で必要なbasePluginを保持
    this.basePlugin = plugins["base"][0] as IBasePlugin;
  }
  public refPickupComponent():React.ComponentClass<{}> {
    return pickupComponent();
  }
  public createNewSource():ISource {
    return null;
  }
}

export var _ = new Youtube();