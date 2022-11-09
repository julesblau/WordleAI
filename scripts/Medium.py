import numpy as np
import sys
import string

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"
pathJake = "/Applications/MAMP/htdocs"

if __name__ == '__main__':
    #Read in WordList
    _list = np.loadtxt(pathJules + "/WordleAI/resources/solutions.txt", dtype='str').tolist()
    
    # Create Map to store possible letters
    possible_letters = dict.fromkeys(range(5), list(string.ascii_lowercase))
    greens = [None, None, None, None, None]
    yellows = []
    grays = []

    guessHistory = sys.argv[1].strip("[]").split(",")
    context = sys.argv[2].strip("[]").split(",")

    for i in range(len(context)):
        for j in range(5):
            currLetter = guessHistory[i][j]

            #If we recieve gray, remove that letter from all positions in map
            if context[i][j] == '0':
                grays.append(currLetter)

            #If we recieve yellow, remove that postion from that letter in map
            elif context[i][j] == '1':
                yellows.append(currLetter)

            #If we recieve green, remove all other letters from that position in map    
            else:
                greens[j] = currLetter
    
    # Receive information as letter --> 0,1,2 (gray, yellow, green) or two arrays matching [row,col]

    #CASE TO CONSIDER:
    #Guess is "guess" and one 's' is yellow and one is gray
    #Solution: Remove from those positions, leave in the other positions

    for word in _list:
        removeWord = False
        for i in range(5):
            if greens[i] != None:
                if greens[i] != word[i]:
                    removeWord = True
        if removeWord:
            _list.remove(word)

    for word in _list:
        for letter in yellows:
            if letter not in word:
                _list.remove(word)
            

    for word in _list:
        for letter in grays:
            if letter in word:
                _list.remove(word)
            


    guess = np.random.choice(_list)
    print(guess)

    # for prevGuess in guessHistory:
    #     print(prevGuess)
    #     _list.remove(prevGuess)

    # print(sys.argv[1]) argv 1 is word. argv 2 is 0,1,2 context
    sys.stdout.flush()


    
    