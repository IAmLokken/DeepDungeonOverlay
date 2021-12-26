# ストリーマーの設定

「ディスプレイキャプチャ」を使用してストリーミングしている場合は、オーバーレイをストリーム上に表示するための追加の操作は必要ありません。

「ゲームキャプチャー」を使用してストリーミングしていて、ストリーム上にオーバーレイを表示したい場合は、以下のようにしてください:
* ACTの中で、Pluginsのボタンを押してOverlayPlugin WSServerを選択します。
* Stream/Local Overlayを選択します。
* 全てのオプションをデフォルト設定のまま、Startを押します。
* 下記のように、Runningという状態が見えるはずです:
 
![Streamer1](../en/StreamerSetup01.png?raw=true)
* ストリーミングソフトの中に、Browser Sourceを追加します。
* URLは https://iamlokken.github.io/DeepDungeonOverlay/overlay/?OVERLAY_WS=ws://127.0.0.1:10501/ws に設定します。(DDO)
* URLは https://iamlokken.github.io/DeepDungeonOverlay/overlay/targetinfo/?OVERLAY_WS=ws://127.0.0.1:10501/w に設定します。(DDOTI)
* 下記の例はOBSからの物です。

![Streamer1](../en/StreamerSetup02.png?raw=true)

設定完了。

[README](README.md) に戻します。
