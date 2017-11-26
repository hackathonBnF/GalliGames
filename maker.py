import quiz
from random import randint


#
# Quiz types meturn must be in JSON format and contains:
#     type: type of quiz
#     good: good answer
#


def make_question():
    types = [
        #quiz.track.track,
        quiz.timeline.timeline,
    ]
    t = types[randint(0, len(types) - 1)]
    return t()


if __name__ == "__main__":
    print make_question()
