import midi
import json
from collections import defaultdict

# pattern = midi.read_midifile("midi/test.mid")
#pattern = midi.read_midifile("midi/LetItGo.mid")
pattern = midi.read_midifile("midi/NeverGonnaGiveYouUp.mid")

level = []
t = 0

# keep only notes
notes = [ { 'type': note.name, "pitch": note.data[0], 'channel': c, 'tick': note.tick } for c, p in enumerate(pattern) for note in p if note.name == "Note Off" or note.name == "Note On" ]

notes2 = defaultdict(list)

for note in notes:
    notes2[str(note['channel'])].append(note)

for p in pattern:
    print pattern.text

    for track in p:
        print track
        #print track.channel
        print track.name
        print track.data
        if (len(track.data) == 2):
            t = t + track.tick
            # print t 

            data = {
                'x' : t,
                'y' : track.data[0],
                'length': track.length,
                'raw' : [ track.tick , track.length ] + track.data
            }
            
            level.append(data)

# print notes

meta = {
    'resolution': pattern.resolution
}

with open('level.json', 'w') as outfile:
    json.dump(notes, outfile)


with open('level2.json', 'w') as outfile:
    json.dump(notes2, outfile)

with open('metadata.json', 'w') as outfile:
    json.dump(meta, outfile)
