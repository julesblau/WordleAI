import numpy as np
import sys #so we can access arguments when passed. i.e. sys.argv[1], etc.

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"

if __name__ == '__main__':
    #Read in WordList
    _list = np.loadtxt(pathJules + "/WordleAI/resources/solutions.txt", dtype='str') #we're going to want to change this path when putting this is done.
    #Select random guess from solutions
    guess = np.random.choice(_list)
    #Return guess to server.js
    print(guess)
    sys.stdout.flush()

   