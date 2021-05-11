var fs=require('fs');
var {conv}=require('./convter.js');

function midiToAdofai(midiFile,BPM,track,saveFileName=midiFile+'.adofai',artist='',song='')
{
  fs.writeFileSync('./'+saveFileName,JSON.stringify(conv(fs.readFileSync('./'+midiFile),BPM,track,artist,song)));
}