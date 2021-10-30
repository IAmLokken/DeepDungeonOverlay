# Setup For Streamers

If you stream using 'Display Capture' then you do not need to take any additional steps for the overlay to appear on stream.

If you stream using 'Game Capture' and want to display the overlay on stream please do the following:
* In ACT, go to the 'Plugins' tab and select the 'OverlayPlugin WSServer' tab.
* Select the 'Stream/Local Overlay' tab.
* Leave all options on their default settings and press 'Start'.
* You should see a 'Running' status as depicted below:
 
![Streamer1](StreamerSetup01.png?raw=true)
* In your streaming software add a 'Browser Source'.
* Set the 'URL' to https://iamlokken.github.io/DeepDungeonOverlay/overlay/?OVERLAY_WS=ws://127.0.0.1:10501/ws (DDO)
* Set the 'URL' to https://iamlokken.github.io/DeepDungeonOverlay/overlay/targetinfo/?OVERLAY_WS=ws://127.0.0.1:10501/ws (DDOTI) 
* Example below is from OBS:

![Streamer1](StreamerSetup02.png?raw=true)

Setup complete.

Return to [README](../../README.md).
