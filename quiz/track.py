# -*- coding: utf-8 -*-
import urllib2
import json
from random import randint, shuffle


def track_map(t):
    return {
        'id': t['id'],
        'title': t['title'],
        'artist': t['artist']['name'],
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
        'title': d['title'],
        'question': 'Quel est le titre de l\'œuvre dont voici un extrait?',
        'media': tracks[0]['preview'],
        'good': track_map(tracks[0]),
    }
    shuffle(tracks)
    res['tracks'] = map(track_map, tracks)
    return json.dumps(res)
