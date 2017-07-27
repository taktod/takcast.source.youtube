import {IBasePlugin} from "takcast.interface";
import {ISource} from "takcast.interface";
import {IMediaPlugin} from "takcast.interface";
import {ISourceInfo} from "takcast.interface";

declare var YT:any;

export class Source implements ISource {
  public name:string;
  public type:string[];
  private id:string;

  // 処理情報保持オブジェクト
  private info:{};
  private media:HTMLVideoElement;
  private video:HTMLVideoElement;

  private node:AudioNode;
  private gainNode:GainNode;
  private iframe:HTMLIFrameElement;

  private player:any; // youtubeのapiのplayer
  // そのままyoutubeのplayerをreactの部分に設置すると、リロードが何度も走り扱いにくいので
  // canvasに映像を一度書いてそれをvideoタグにもっていく
  // これで映像だけ、paletteの部分にもっていく。
  // この方法だとリロードしたり戻す方法がないけど・・・まぁいまのところは目を瞑っておく
  private canvas:HTMLCanvasElement;
  private requestId:number;
  
  constructor(basePlugin:IBasePlugin, youtubeId:string) {
    this.name = youtubeId; // 本当はyoutubeの動画の名称とりたいけど、面倒なので、やらない
    this.id = youtubeId;
    this.info = {};
    this.gainNode = basePlugin.refAudioContext().createGain();
    this.gainNode.gain.value = 1.0;
    this.gainNode.connect(basePlugin.refDevnullNode());

    // 同じidのデータがすでにある場合は動作しない方がいいと思う
    // あとで考える

    // youtubeのデータの表示部分はかくしておく
    var div = document.createElement("div");
    div.id = youtubeId;
    div.style["display"] = "none";
    document.body.appendChild(div);
    var done = false;
    this.player = new YT.Player(youtubeId, {
      videoId: youtubeId,
      events: {
        "onReady": () => {
          // 一瞬再生してとめとく。
          this.player.playVideo();
          this.media.play();
        },
        "onStateChange": (event) => {
          if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(() => {
              // 即止める
              this.media.pause();
              this.player.pauseVideo();
              this.video = (document.getElementById(youtubeId) as HTMLIFrameElement).contentWindow.document.getElementsByTagName("video")[0];
              // あとはこのvideoからnodeをつくっておかないといけない。
              this.node = basePlugin.refAudioContext().createMediaElementSource(this.video);
              this.node.connect(this.gainNode);
            }, 500);
            done = true;
          }
        }
      }
    });
    // canvasは見えなくなってると動作しないみたい。なので、見えない位置に描画することにする
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.canvas.style["position"] = "absolute";
    this.canvas.style["top"] = "-9999px";
    // canvasの内容を再生として表示するvideoタグ
    this.media = document.createElement("video");
    this.media.srcObject = (this.canvas as any).captureStream();
    this.media.controls = true;
    this.media.onplay = () => {
      this.player.playVideo();
    }
    this.media.onpause = () => {
      this.player.pauseVideo();
    }
    // あとはrequest animation frameでyoutubeの映像の部分だけ、あっちにコピーする
    var draw = () => {
      if(this.video) {
        var width = this.video.videoWidth;
        var height = this.video.videoHeight;
        if(width != 0 && height != 0) {
          // とりあえず2dでコピー webgl使うまでもないでしょう
          this.canvas.width = width;
          this.canvas.height = height;
          var ctx = this.canvas.getContext("2d");
          ctx.drawImage(this.video, 0, 0, width, height);
        }
      }
      this.requestId = requestAnimationFrame(draw);
    }
    draw();
  }
  public release():void {
    // 必要なくなったら、いろいろ解放する
    // animation frame止める
    cancelAnimationFrame(this.requestId);
    // 保持オブジェクト消す
    Object.keys(this.info).forEach((key) => {
      var info = this.info[key] as ISourceInfo;
      info.plugin.onRemoveSource(this);
    });
    // いろいろ断ち切る
    this.media.pause();
    this.node.disconnect();
    this.gainNode.disconnect();
    this.video = null;
    this.media = null;
    this.node = null;
    this.gainNode = null;
    this.canvas = null;
    this.player.pauseVideo();
    this.player = null;
    document.body.removeChild(document.getElementById(this.id));
  }
  public refInfo(mediaPlugin:IMediaPlugin):ISourceInfo {
    if(typeof(this.info[mediaPlugin.name]) == "undefined") {
      this.info[mediaPlugin.name] = {
        plugin:mediaPlugin,
        data: {}
      };
    }
    return this.info[mediaPlugin.name] as ISourceInfo;
  }
  public refAudioNode():AudioNode {
    return this.gainNode;
  }
  public refVideoImage():HTMLVideoElement {
    return this.video;
  }
  public refDisplayElement():HTMLElement {
    return this.media;
  }
  public setVolume(value:number):void {
    this.gainNode.gain.value = value / 100;
  }
  public getVolume():number {
    return this.gainNode.gain.value * 100;
  }
}