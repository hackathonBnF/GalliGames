import midi
import json

pattern = midi.read_midifile("midi/test.mid")
#pattern = midi.read_midifile("midi/LetItGo.mid")

level = []
t = 0

for p in pattern:

    for track in p:
        print track
        print track.tick
        if (len(track.data) == 2):
            t = t + track.tick
            print t 

            data = {
                'x' : t,
                'y' : track.data[0],
                'length': track.length,
                'raw' : [ track.tick , track.length ] + track.data
            }
            
            level.append(data)
        
with open('level.json', 'w') as outfile:
    json.dump(level, outfile)
