import numpy as np
import sys

if __name__ == '__main__':
    #Read in WordList
    my_file = open("resources/solutions.txt", "r")
    wordList = my_file.read().split("\n")
    my_file.close()
    #Select random guess from solutions
    guess = np.random.choice(wordList)
    #Return guess to server.js
    print(guess)
    sys.stdout.flush()
