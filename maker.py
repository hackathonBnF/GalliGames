import quiz
from random import randint


def make_question():
    types = [
        quiz.track.track,
    ]
    t = types[randint(0, len(types) - 1)]
    return t()


if __name__ == "__main__":
    print make_question()
