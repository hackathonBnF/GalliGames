import urllib2
import json
from random import randint, shuffle


def track_map(t):
    return {
        'id': t['id'],
        'title': t['title'],
    }


def track():
    data = json.loads(urllib2.urlopen('https://api.deezer.com/search/album?q=bnf').read())
    d = None
    while True:
        d = data['data'][randint(0, len(data['data']) - 1)]
        if d['nb_tracks'] >= 4:
            break
    a = json.loads(urllib2.urlopen('https://api.deezer.com/album/' + str(d['id'])).read())
    tracks = []
    for i in range(4):
        t = None
        good = False
        while good == False:
            t = a['tracks']['data'][randint(0, len(a['tracks']['data']) - 1)]
            good = True
            for j in range(len(tracks)):
                if tracks[j]['id'] == t['id']:
                    good = False
                    break
        tracks.append(t)
    res = {
        'type': 'track',
        'album': d['title'],
        'media': tracks[0]['preview'],
        'good': {
            'id': tracks[0]['id'],
            'title': tracks[0]['title'],
        },
    }
    shuffle(tracks)
    res['tracks'] = map(track_map, tracks)
    return json.dumps(res)
