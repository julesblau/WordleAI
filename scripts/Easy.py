import numpy as np
import sys

if __name__ == '__main__':

    # Read in WordList
    wordListFile = open("resources/solutions.txt", "r")
    wordList = wordListFile.read().split("\n")

    f = open("scripts/outputtext.txt", "w")
    # Create lists to hold context of letters
    greens = [None, None, None, None, None]

    # Get guess history and context from system args
    guessHistory = sys.argv[1].strip("[]").split(",")
    context = sys.argv[2].strip("[]").split(",")

    # For each letter in each word
    for i in range(len(context)):
        f.write(guessHistory[i])
        f.write("\n")
        for j in range(5):
            currLetter = (guessHistory[i])[j]
            # If we recieve 2, add letter to green list in correct position
            if (context[i])[j] == '2':
                greens[j] = currLetter

    possibleGuesses = wordList.copy()

    for word in guessHistory:
        possibleGuesses.remove(word)

    wordList = possibleGuesses.copy()

    # If word in guess list doesn't have green letter in correct position, remove word from guess list
    for word in wordList:
        for i in range(5):
            if greens[i] != None:
                if greens[i] != word[i]:
                    possibleGuesses.remove(word)
                    break
    
    f.write("Possible Guesses: ")
    f.write(str(possibleGuesses))
    f.write("\n")

    # Choose random word from remaining (valid) words
    guess = np.random.choice(possibleGuesses)
    f.write("Guess: ")
    f.write(guess)
    f.write("\n")
    print(guess)
    wordList = wordListFile.read().split("\n")
    wordListFile.close()
    possibleGuesses = wordList.copy()
    f.close()
    sys.stdout.flush()
