import numpy as np
import sys
import string

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"
pathJake = "/Applications/MAMP/htdocs"

if __name__ == '__main__':
    # Read in WordList

    my_file = open("resources/solutions.txt", "r")
    data = my_file.read()
    possibleGuesses = data.split("\n")
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

            # If we recieve 0, add letter to gray list
            if (context[i])[j] == '0' and currLetter not in grays:
                grays.append(currLetter)

            # If we recieve 1, add letter to yellow list
            elif (context[i])[j] == '1' and currLetter not in yellows:
                yellows.append(currLetter)

            # If we recieve 2, add letter to green list in correct position
            else:
                greens[j] = currLetter
    
    for letter in grays:
        if letter in yellows:
            grays.remove(letter)

    # Remove all previous guesses from guess list
    for prevGuess in guessHistory:
        possibleGuesses.remove(prevGuess)

    # If word in guess list doesn't have green letter in correct position, remove word from guess list
    for word in possibleGuesses:
        for i in range(5):
            if greens[i] != None:
                if greens[i] != word[i]:
                    possibleGuesses.remove(word)
                    break

    # If word in guess list doesn't have yellow letter in word, remove word from guess list
    for word in possibleGuesses:
        for letter in yellows:
            if letter not in word:
                possibleGuesses.remove(word)
                break

    # If word in guess list has gray letter in word, remove word from guess list
    for word in possibleGuesses:
        for letter in grays:
            if letter in word:
                possibleGuesses.remove(word)
                break

    # Choose random word from remaining (valid) words
    guess = np.random.choice(possibleGuesses)
    print(guess)

    sys.stdout.flush()
