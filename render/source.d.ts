import { IBasePlugin } from "takcast.interface";
import { ISource } from "takcast.interface";
import { IMediaPlugin } from "takcast.interface";
import { ISourceInfo } from "takcast.interface";
export declare class Source implements ISource {
    name: string;
    type: string[];
    private id;
    private info;
    private media;
    private video;
    private node;
    private gainNode;
    private iframe;
    private player;
    private canvas;
    private requestId;
    constructor(basePlugin: IBasePlugin, youtubeId: string);
    release(): void;
    refInfo(mediaPlugin: IMediaPlugin): ISourceInfo;
    refAudioNode(): AudioNode;
    refVideoImage(): HTMLVideoElement;
    refDisplayElement(): HTMLElement;
    setVolume(value: number): void;
    getVolume(): number;
}
