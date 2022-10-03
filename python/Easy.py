import numpy as np

#Make random guess
def randomGuess(_list):
    guess = np.random.choice(_list)
    return guess

if __name__ == '__main__':
    #Read in WordList
    _list = np.loadtxt("/Users/julesblau/Desktop/WordleAI/resources/possible_solutions.txt", dtype='str')
    
    guess = randomGuess(_list)
    print("Random Guess: ", guess)