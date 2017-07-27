/// <reference types="react" />
import * as React from "react";
import { IPlugin } from "takcast.interface";
import { ISourcePlugin } from "takcast.interface";
import { ISource } from "takcast.interface";
export declare class Youtube implements ISourcePlugin {
    name: string;
    type: string;
    private basePlugin;
    constructor();
    setPlugins(plugins: {
        [type: string]: Array<IPlugin>;
    }): void;
    refPickupComponent(): React.ComponentClass<{}>;
    createNewSource(): ISource;
}
export declare var _: Youtube;
