import numpy as np
import sys
import string

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"
pathJake = "/Applications/MAMP/htdocs"

if __name__ == '__main__':
    # Read in WordList
    _list = np.loadtxt(
        pathJack + "/WordleAI/resources/solutions.txt", dtype='str').tolist()

    # Create lists to hold context of letters
    greens = [None, None, None, None, None]
    yellows = []
    grays = []

    # Get guess history and context from system args
    guessHistory = sys.argv[1].strip("[]").split(",")
    context = sys.argv[2].strip("[]").split(",")

    # For each letter in each word
    for i in range(len(context)):
        for j in range(5):
            currWord = (guessHistory[i])
            currLetter = currWord[j]

            # If we recieve 0, add letter to gray list
            if (context[i])[j] == '0':
                grays.append(currLetter)

            # If we recieve 1, add letter to yellow list
            elif (context[i])[j] == '1':
                yellows.append(currLetter)

            # If we recieve 2, add letter to green list in correct position
            else:
                greens[j] = currLetter
    
    for letter in grays:
        if letter in yellows:
            grays.remove(letter)

    # Remove all previous guesses from guess list
    # for prevGuess in guessHistory:
    #     _list.remove(prevGuess)

    # If word in guess list doesn't have green letter in correct position, remove word from guess list
    for word in _list:
        removeWord = False
        for i in range(5):
            if greens[i] != None:
                if greens[i] != word[i]:
                    removeWord = True
        if removeWord:
            _list.remove(word)

    # If word in guess list doesn't have yellow letter in word, remove word from guess list
    for word in _list:
        for letter in yellows:
            if letter not in word:
                _list.remove(word)

    # If word in guess list has gray letter in word, remove word from guess list
    for word in _list:
        for letter in grays:
            if letter in word:
                _list.remove(word)

    # Choose random word from remaining (valid) words
    guess = np.random.choice(_list)
    print(guess)

    sys.stdout.flush()
