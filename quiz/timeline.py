# -*- coding: utf-8 -*-
import urllib2
import json
from random import randint, shuffle

sets = [
    { 'date': 1909, 'id': 72881643, },
    { 'date': 1959, 'id': 97521542, },
    { 'date': 1962, 'id': 91632944, },
    { 'date': 1961, 'id': 80479218, },
    { 'date': 1960, 'id': 143487318, },
    { 'date': 1960, 'id': 81048476, },
    { 'date': 1792, 'id': 144359382, },
    { 'date': 1960, 'id': 94634266, },
    { 'date': 1954, 'id': 74473879, },
    { 'date': 1930, 'id': 118113358, },
    { 'date': 1934, 'id': 118113394, },
    { 'date': 1744, 'id': 98932352, },
    { 'date': 1937, 'id': 97579288, },
    { 'date': 1960, 'id': 97520674, },
    { 'date': 1888, 'id': 80737266, },
    { 'date': 1877, 'id': 114355620, },
    { 'date': 1777, 'id': 74946464, },
    { 'date': 1836, 'id': 348944161, },
]

def timeline():
    set = []
    dates = []
    for i in range(4):
        t = None
        good = False
        while good == False:
            t = sets[randint(0, len(sets) - 1)]
            good = True
            for j in range(len(set)):
                if set[j]['date'] == t['date']:
                    good = False
                    break
        set.append(t)
    tracks = []
    for s in set:
        data = json.loads(urllib2.urlopen('https://api.deezer.com/track/' + str(s['id'])).read())
        tracks.append({
            'id': s['id'],
            'title': data['title'],
            'artist': data['artist']['name'],
            'media': data['preview'],
        })
        pass
    shuffle(tracks)
    res = {
        'type': 'timeline',
        'question': 'Réordonner ces morceaux dans l\'ordre croissant de leurs dates de sortie.',
        'tracks': tracks,
        'good': set,
    }
    return json.dumps(res)
