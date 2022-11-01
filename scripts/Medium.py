import numpy as np
import sys
import string
# from django.http import HttpResponse 

pathJack = "/Users/jmayrides/git"
pathJules = "/Users/julesblau/Desktop"
pathJake = "/Applications/MAMP/htdocs"

if __name__ == '__main__':
    #Read in WordList
    _list = np.loadtxt(pathJules + "/WordleAI/resources/solutions.txt", dtype='str') 
    # Map is {Letter Position(0-4): A-Z}
    possible_letters = dict.fromkeys(range(5), list(string.ascii_lowercase))
    