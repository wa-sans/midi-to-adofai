var MIDIFile=require('midifile');
function conv(file,BPM,track,ar,na)
{
var midi=file;
var midiFile=new MIDIFile(midi);

var tpb=midiFile.header.getTicksPerBeat();

var oneTickSecond=(60/BPM)/tpb;

function nHz(n)
{
  return 55*Math.pow(2,(n-9-12*5)/12);
}

function s2b(s,d)
{
  return (60/s)*(d/180);
}

var tileDir=30;

var map=
{
  "pathData":"R",
  "settings":
	{
		"version": 2, 
		"artist": ar,
		"song": na,
		"author": "", 
		"hitsound": "Kick", 
		"hitsoundVolume": 100, 
		"separateCountdownTime": "Enabled",
		"songFilename": "", 
		"bpm": 100, 
		"volume": 100, 
		"offset": 0, 
		"pitch": 100,
		"trackColorType": "Single", 
		"trackColor": "debb7b", 
		"secondaryTrackColor": "ffffff", 
		"trackColorAnimDuration": 2, 
		"trackColorPulse": "None", 
		"trackPulseLength": 10, 
		"trackStyle": "Standard", 
		"trackAnimation": "None", 
		"beatsAhead": 3, 
		"trackDisappearAnimation": "None", 
		"beatsBehind": 4,
		"backgroundColor": "000000", 
		"bgImage": "", 
		"bgImageColor": "ffffff", 
		"parallax": [100, 100], 
		"bgDisplayMode": "FitToScreen", 
		"loopBG": "Disabled", 
		"unscaledSize": 100,
		"relativeTo": "Player", 
		"position": [0, 0], 
		"rotation": 0, 
		"zoom": 100
	},
  "actions":[]
};
var events = midiFile.getTrackEvents(track);
for(var i=0,timeC=0;i<events.length;i++)
{
  if(events[i].type==8)
  {
    var hz=nHz(events[i].param1);
    var bpm=hz*60*(tileDir/180);
    if(map.pathData.length==0)
    {
      var wait=events[i].delta*oneTickSecond;
      var bpm=s2b(wait,tileDir);
      map.settings.bpm=bpm;
    }
    var length=0;
    if(i+1<events.length)
    {
      length=events[i+1].delta*oneTickSecond;
    }
    var volume=events[i].param2;
    if(volume==0||events[i].subtype==8)
    {
      var wait=length;
      if(wait>0)
      {
        var bpm=s2b(wait+timeC,tileDir);
        var lw=map.pathData[map.pathData.length-1];
        map.pathData+=(lw!='R'?'R':'H');
        map.actions.push({ "floor": map.pathData.length-1, "eventType": "SetSpeed", "beatsPerMinute": bpm });
        map.actions.push({ "floor": map.pathData.length-1, "eventType": "Twirl"});
        timeC=0;
      }
    }
    else
    {
      var tilecount=(length+timeC)*hz;
      var realTilecount=Math.floor(tilecount);
      timeC=(tilecount-realTilecount)/hz;
      if(map.pathData.length!=0)
      {
        map.actions.push({ "floor": map.pathData.length, "eventType": "SetSpeed", "beatsPerMinute": bpm });
      }
      //realTilecount++;
      //console.log(length-realTilecount/hz)
      while(realTilecount--)
      {
        var lw=map.pathData[map.pathData.length-1];
        map.pathData+=(lw!='R'?'R':'H');
        if(map.pathData.length>2)
        {
          map.actions.push({ "floor": map.pathData.length-1, "eventType": "Twirl"});
        }
      }
    }
    //console.log(`hz:${hz}\nlength:${length}\nvolume:${volume}\n`);
  }
  else
  {
    var hz=nHz(events[i].param1);
    var bpm=hz*60*(tileDir/180);
  }
}
map.pathData+=(map.pathData[map.pathData.length-1]!='R'?'R':'H');
map.actions.push({ "floor": map.pathData.length-1, "eventType": "SetSpeed", "beatsPerMinute": 0 });
console.log(map.pathData.length)
return map;
}
exports.conv=conv;