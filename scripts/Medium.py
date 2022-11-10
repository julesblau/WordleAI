import numpy as np
import sys
import string

if __name__ == '__main__':

    # Read in WordList
    my_file = open("resources/solutions.txt", "r")
    wordList = my_file.read().split("\n")
    my_file.close()

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
            currLetter = (guessHistory[i])[j]

            # If we recieve 2, add letter to green list in correct position
            if (context[i])[j] == '2':
                greens[j] = currLetter
                if currLetter in yellows:
                    yellows.remove(currLetter)
                if currLetter in grays:
                    grays.remove(currLetter)

            # If we recieve 1, add letter to yellow list if not there
            elif (context[i])[j] == '1' and currLetter not in yellows and currLetter not in greens:
                yellows.append(currLetter)
                if currLetter in grays:
                    grays.remove(currLetter)

            # If we recieve 0, add letter to gray list if not there
            elif (context[i])[j] == '0' and currLetter not in grays and currLetter not in yellows and currLetter not in greens:
                grays.append(currLetter)

    possibleGuesses = wordList.copy()

    # If word in guess list doesn't have green letter in correct position, remove word from guess list
    for word in wordList:
        for i in range(5):
            if greens[i] != None:
                if greens[i] != word[i]:
                    possibleGuesses.remove(word)
                    break

    wordList = possibleGuesses.copy()

    # If word in guess list doesn't have yellow letter in word, remove word from guess list
    for word in wordList:
        for letter in yellows:
            if letter not in word:
                possibleGuesses.remove(word)
                break
    
    wordList = possibleGuesses.copy()

    # If word in guess list has gray letter in word, remove word from guess list
    for word in wordList:
        for letter in grays:
            if letter in word:
                possibleGuesses.remove(word)
                break

    # Choose random word from remaining (valid) words
    guess = np.random.choice(possibleGuesses)
    print(guess)
    sys.stdout.flush()
