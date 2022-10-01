# 紹介

日本語の翻訳とサポートは[Chiela](https://twitter.com/hurricanechiela)さんが担当してくれています。Chielaさんも [Twitchでライブ配信しています！](https://www.twitch.tv/hurricanechiela)

ディープダンジョンのOverlay(DDO)とディープダンジョンターゲット情報(DDOTI)はソロディープダンジョンを到達しながらリアルタイムの情報を示すOverlayPluginのスキン(開発中)です。

|![DDOTI](../../docs/en/DDOTI.png?raw=true) | ![DDOTI](../../docs/en/DDOTI_Dark.png?raw=true) |
| :-: | :-: |
|![DDO](DetailsFull01.png?raw=true) | ![DDO](DetailsFull01_Dark.png?raw=true) |

# DDO/DDOTIを使うための条件

DDOはAdvanced Combat Tracker ([ACT](https://advancedcombattracker.com/))のソフトが必要です。さらに[FFXIV_ACT_Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin)と[OverlayPlugin](https://github.com/OverlayPlugin/OverlayPlugin)を両方ACTでインストールしなければなりません。

ACTのインストール方法とFFXIV_ACT_Pluginはここに書かれています: [Install ACT](https://github.com/FFXIV-ACT/setup-guide)

さらにここにDesperiusFFXIVが作った役に立つ情報が入っているチュートリアルがあります。 (2021年4月から): [Video Guide](https://www.youtube.com/watch?v=urZTrF864x8&t=0s)

# ローカライズ

DDOは現在英語とフランス語と日本語のバージョンがあります。敵に関する情報はまだ入っていません。(今英語のみです)

_注意_: サポートされている言語を使用するには、ゲームクライアントとFFXIVプラグインの設定「Game Language」の両方が適切な言語に設定されている必要があります。

# DDO/DDOTIのインストール方法

インストールマニュアルを参考にしてください。[DDOのインストール方法](INSTALL.md).  

# ストリーマーの設定

ストリーマーの設定をご覧ください。[手順](STREAMER.md)

# 現在の機能

* スコア (推定)
	* オーバーレイでは、現在のスコアの推定値がリアルタイムで表示されます。 詳しくは、[スコアの詳細](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/ja/README.MD#%E3%82%B9%E3%82%B3%E3%82%A2%E3%81%AE%E8%A9%B3%E7%B4%B0)をご覧ください。
	* 採点アルゴリズムは、Alphaさんの採点テストから構築されています。[スコアの説明](https://docs.google.com/document/d/1MnR2Xtj2lol1LESgscI6yi_1xcAeP3FBwJecbD-EiwE/edit)
	 
* 魔土器:
	* 呪印解除　(現在のフロアで使用されている場合は有効)
	* サイトロ　(現在のフロアで使用されている場合は有効)
	* 宝箱増加　(前のフロアで使用されていて、現在もアクティブな場合は有効）
	* 敵変化　(前のフロアで使用されていて、現在もアクティブな場合は有効）
	* 敵排除　(前のフロアで使用されていて、現在もアクティブな場合は有効）

* 統計：
	* 討伐数
	* ミミック　(コリガン)　討伐数
	* 起動した罠 
	* 開けた宝箱
	* 魔法効果発動   (魔法効果解除を使ったら、効果が下がる)
	* レアなモンスター　(死者の宮殿のみ）
	* 階層セット全体を30分以内に完了
	
* 魔物情報：
    * 敵の名前
	* 敵の現在のHP％
	* 敵の危険度：
		簡単 | 注意 | 怖い | 無理
		:-: | :-: | :-: | :-: 
		<img src="../../img/Easy.png" alt="drawing" width="40"/> | <img src="../../img/Caution.png" alt="drawing" width="40"/> | <img src="../../img/Scary.png" alt="drawing" width="40"/> | <img src="../../img/Impossible.png" alt="drawing" width="40"/>
	* 敵の感知方法のタイプ：	
		視覚 | 音感 | 間近
		:-: | :-: | :-:
		![Sight](../../img/Sight.png) | ![Sound](../../img/Sound.png) | ![Proximity](../../img/Proximity.png)
	* 敵の情報　(関係があれば、知るべき情報）
	* __全部の魔物の情報はMaygiiさんのディープダンジョンガイドから許可を得て引用しています。__
	 	* 是非Maygiiさんをフォローしてください！ [Twitch](https://www.twitch.tv/maygii)、[Twitter](https://twitter.com/MaybeMaygi)、[Youtube](https://www.youtube.com/c/Maygi).
		* [死者の宮殿攻略本](https://docs.google.com/document/d/e/2PACX-1vQpzFuhmSwTXuZSmtnKLNgQ0nRhumCFaB8NvCXFXSjrBHPRT5lXY8jMR4RaCK1aNfcl_G5ph5DNNwfl/pub)
		* [アメノミハシラ攻略本](https://docs.google.com/document/d/1YVBSTOgJO-xOAB6YyKZEZRikjXFPle6Ihf_E7VdmQnI/edit)
		* Cloudburstのステータススプレッドシートを利用してテストした追加の感知方法 [PotD](https://docs.google.com/spreadsheets/d/1nKI0-AApj-aiuUimrPkuQUJaa4DU8Ox7KqdC_ibme8E/edit#gid=12879293), [HoH](https://docs.google.com/spreadsheets/d/1aDlsiN3At6Fvfj_gg5weucDYqjQawQxGHFhJvzEUrek/edit#gid=375717345)
	* **注意** 魔物の情報は、グループラン中に利用可能な唯一のセクションです。
	* **注意**　もし、魔物の情報が間違っていたり、不十分だったりしたら、リンクを押して報告してください。[open an issue](https://github.com/IAmLokken/DeepDungeonOverlay/issues)

スコア、魔土器、統計、魔物のセクションはオーバーレイのタイトルバーにあるチェックボックスを使って非表示/表示にすることができます。例：

![DDOS01](DetailsSimple01.png?raw=true) ![DDOS02](DetailsSimple02.png?raw=true)

# セーブファイル

DDOは、現在の実行に関する関連情報をOverlayPluginの設定ファイルに保存しています。

DDを進めるにあたって、追跡して保存したい情報がある場合の注意点：
* DDOは、プレイヤーがディープダンジョンを出た後(フロアやフロア間のエリア)、FFXIVやACTを閉じた後は、同一のセーブファイルを識別することができません。
* 以下のような場合は二つのセーブファイルが同一になります：
	* どちらも同じディープダンジョン用。
	* どちらも同じキャラクター用。
	* どちらも同じジョブ用。
	* どちらも同じフロア用。

例：同じフロアに２つのセーブファイルを作りたい場合（例：同じキャラクターで赤魔導士の171階に2つのセーブファイルを作る）などです。
ゲーム内でセーブスロットを選択する際、オーバーレイはどのセーブファイルをクリックしたのかを知る方法がなく、ダンジョン、キャラクター、ジョブ、フロアが一致する最初のセーブファイルを選択してしまいます。 2つのセーブファイルがあるので、正しいものを選べず、追跡データは不正確になります。
これは、両方のセーブスロットが同じフロアにある状態でダンジョンインスタンスを出た場合にのみ問題となります。 片方のセーブスロットを次の階に先に進めれば、オーバーレイに問題が起こりません。

オーバーレイは、ゲーム内でセーブファイルを削除したことを知らないので、ディープダンジョンにいないときにセーブファイルを消去するための2つのボタンがあります。これは自分の行動が確実に追跡されているかどうかを確認したいときに有効です。

![DDOSM](SaveManager.png?raw=true)

# スコアの詳細

新しい到達を開始した時に表示されるスコア推定値は、表示されるスコアをできるだけ正確に保つために、いくつかの点を想定しています：
* 最大限の魔器装備（99/99）
* 最大限のレベル（60/70）
* 次のスコアカード（30/100/200）に向けて、現在の到達を成功させます。
	
30分以内の階層セットボーナスはフロアセット開始時に加算され、「残り時間30分」のメッセージが検出されると削除されます。フロア全てを発見した時の満点は、フロアの開始時に加算されます。（「スコアの計算に関して、完全現れたマップスコアを数えたかったら、ここを押してください。」オプションが有効な場合）

フロア全てを発見した時の満点は、フロアの開始時に加算されます。（「スコアの計算に関して、完全現れたマップスコアを数えたかったら、ここを押してください。」オプションが有効な場合）

部屋が明らかになるごとに、ダンジョンやフロアセットに応じた推定ポイントが加算されます。（「フルマップクリアを前提とする」オプションを無効にしている場合）
* サイトロの魔土器を使いました。満点ポイントが付与されます。
* 示された部屋の総数は、現在のダンジョンの最大可能部屋数と同じです。満点ポイントが付与されます。
* 示された部屋の総数は、現在のダンジョンの最小可能部屋数未満です。ポイントが付与されません。

魔石は、プレイヤーのコンピュータに読み込まれていないほど遠くにいるモンスターを倒すことができます。そのため、モンスターが死んでも死亡通知が届きません。そのため、キルカウントは正確ではありません

1階、21階（アメノミハシラ）、51階（死者の宮殿）で到達が開始されなかった場合、スコアには「414」と表示されます。
