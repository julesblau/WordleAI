import numpy as np
import sys

if __name__ == '__main__':

    # Read in WordList
    wordListFile = open("resources/solutions.txt", "r")
    wordList = wordListFile.read().split("\n")

    output = open("scripts/outputtext.txt", "w")

    # Create lists to hold context of letters
    greens = [None, None, None, None, None]
    yellows = [[], [], [], [], []]
    grays = []
    duplicates = []

    # Get guess history and context from system args
    guessHistory = sys.argv[1].strip("[]").split(",")
    context = sys.argv[2].strip("[]").split(",")

    # For each letter in each word
    for i in range(len(context)):
        for j in range(5):
            currLetter = (guessHistory[i])[j]

            # If context is 2, add letter to green list in correct position
            if (context[i])[j] == '2':
                greens[j] = currLetter
                for k in range(5):
                    if currLetter in yellows[k]:
                        yellows[k].remove(currLetter)
                if currLetter in grays:
                    grays.remove(currLetter)
                    duplicates.append(currLetter)

            # If context is 1, add letter to yellow list in known incorrect position if not already there
            elif (context[i])[j] == '1' and currLetter not in yellows[j] and currLetter not in greens:
                yellows[j].append(currLetter)
                if currLetter in grays:
                    grays.remove(currLetter)
                    duplicates.append(currLetter)

            # If context is 0, add letter to gray list if not already there
            elif (context[i])[j] == '0' and currLetter not in grays and currLetter not in greens:
                add = True
                for k in range(5):
                    if currLetter in yellows[k]:
                        duplicates.append(currLetter)
                        add = False
                if add:
                    grays.append(currLetter)
            elif (context[i])[j] == '0' and currLetter in greens:
                duplicates.append(currLetter)

    output.write(','.join(duplicates))
    output.write('\n')

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
        _continue = True
        for i in range(5):
            if yellows[i] != []:
                for letter in yellows[i]:
                    if (letter not in word or letter == word[i]) and _continue:
                        possibleGuesses.remove(word)
                        _continue = False
                        break
    
    wordList = possibleGuesses.copy()

    # If word in guess list has gray letter in word, remove word from guess list
    for word in wordList:
        for letter in grays:
            if letter in word:
                possibleGuesses.remove(word)
                break

    wordList = possibleGuesses.copy()

    for word in wordList:
        for letter in duplicates:
            if word.count(letter) > 1:
                possibleGuesses.remove(word)
                output.write(word)
                output.write('\n')
                break

    output.write(','.join(possibleGuesses))

    # Choose random word from remaining (valid) words
    guess = np.random.choice(possibleGuesses)
    print(guess)

    wordList = wordListFile.read().split("\n")
    wordListFile.close()
    output.close()
    possibleGuesses = wordList.copy()
    
    sys.stdout.flush()
