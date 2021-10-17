# Einrichtung für Streamer

Falls du eine Bildschirmaufnahme überträgst, musst du nichts weiter machen, damit das Overlay im Stream zu sehen ist.

Falls du eine Spielaufnahme überträgst und du das Overlay im Stream einblenden möchtest, musst du folgendes tun:
* In ACT, navigiere zum "Plugins"-Tab und dann zum "OverlayPlugin WSServer"-Tab.
* Navigiere zum "Stream/Local Overlay"-Tab.
* Belasse alle Optionen auf den Standardwerten und klicke auf "Start".
* Du solltest nun einen "Running"-Status sehen können, wie folgend dargestellt:
 
![Streamer1](StreamerSetup01.png?raw=true)
* In deinem Streamprogramm füge eine "Browser"-Quelle hinzu.
* Füge in 'URL' folgendes ein: https://iamlokken.github.io/DeepDungeonOverlay/overlay/?OVERLAY_WS=ws://127.0.0.1:10501/ws
* Das folgende Beispiel ist von OBS:

![Streamer1](StreamerSetup02.png?raw=true)

Einrichtung abgeschlossen.

Zurück zur [README](README_DE.md).
