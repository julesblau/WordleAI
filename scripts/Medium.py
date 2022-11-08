import numpy as np
import sys
import string

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"
pathJake = "/Applications/MAMP/htdocs"

if __name__ == '__main__':
    #Read in WordList
    _list = np.loadtxt(pathJules + "/WordleAI/resources/solutions.txt", dtype='str') 
    # Create Map to store possible letters
    possible_letters = dict.fromkeys(range(1,6), list(string.ascii_lowercase))
    # print(sys.argv[1])
    # print(sys.argv[2])

    guess = np.random.choice(_list)
    print(guess)

    sys.stdout.flush()
    #If we recieve gray, remove that letter from all positions in map
    # for i in range(len(context)):
    #     if context[i] == '0':
    #         del possible_letters[i+1]
    #     # elif context == '1':
            
    #     else:
    #         letters_in_solution.add(guess[i])
    #         possible_letters[i+1] = guess[i]


    #If we recieve yellow, remove that letter from that position in map
    #If we recieve green, remove all other letters from that position in map

    # Receive information as letter --> 0,1,2 (gray, yellow, green) or two arrays matching [row,col]

    #CASE TO CONSIDER:
    #Guess is "guess" and one 's' is yellow and one is gray
    #Solution: Remove from those positions, leave in the other positions


    # print(sys.argv[1]) argv 1 is word. argv 2 is 0,1,2 context
    sys.stdout.flush()


    
    