import random

import telegram
import requests

from telegram import KeyboardButton

from telegram.ext import Updater
from telegram.ext import CommandHandler
from telegram.ext import MessageHandler, Filters

updater = Updater(token='500505428:AAGt_4LU0GOFSFjWj4AoSKZIIIcYeFyH4VM')
dispatcher = updater.dispatcher

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def quizz():

    # random album
    album_api = "https://api.deezer.com/search/album?q=bnf"

    results = requests.get(album_api)

    album = random.choice(results.json()['data'])
    
    # print album["title"]

    # random track
    url = album["link"].replace("www", "api") 
    # print url
    album = requests.get(url).json()
    track = random.choice(album["tracks"]["data"])

    # print "chanson : " + track["title"] 
    # print "artiste : "+track["artist"]["name"] 

    correct = track["artist"]["name"]

    # print track["preview"]

    # print album['genres'] 

    similars = requests.get("https://api.deezer.com/genre/"+str(random.choice(album['genres']['data'])['id'])+"/artists")
 
    propositions = [ correct ] + [ x['name']  for x in random.sample(similars.json()['data'] , 3) ]


    return {
            "track" : track['preview'],
            "propositions": propositions,
            "correct": correct
        }

def start(bot, update):
    bot.send_message(chat_id=update.message.chat_id, text="I'm a bot, please talk to me!")

def echo(bot, update):

    q = quizz()

    kb = telegram.InlineKeyboardMarkup([ random.shuffle([telegram.InlineKeyboardButton(p, callback_data=int(p == q['correct'])) ] for p in q["propositions"]) ])
    
    bot.send_audio(chat_id=update.message.chat_id, audio=q['track'], reply_markup=kb)
    
    # bot.send_message(chat_id=update.message.chat_id, text="propositions", reply_markup=telegram.ReplyKeyboardMarkup(answers))

def button(bot, update):
    
    query = update.callback_query

    print query.data

    if (query.data == str(1)):
        bot.send_document(document=open('yes.gif', 'rb'), chat_id=query.message.chat_id)
        #bot.send_message(text="Bien joue petit gars", chat_id=query.message.chat_id)
    else:
        bot.send_document(document=open('no.gif', 'rb'), chat_id=query.message.chat_id)
        #bot.send_message(text="Hahahaha B.O.L.L.O.S.S !", chat_id=query.message.chat_id)

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

echo_handler = MessageHandler(Filters.text, echo)
dispatcher.add_handler(echo_handler)
dispatcher.add_handler(telegram.ext.CallbackQueryHandler(button))

updater.start_polling()
updater.idle()
