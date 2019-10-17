#!/usr/bin/python

import sys
import random
from random import randint
from random import uniform
import time

objects = ["People","Platform","RR","GG","YY","RG","RY","GY","SpeedSign","SpeedRegulator"]
numObjects = 9
epochTime = 0
lastValue = True

while lastValue == True:
    randNum = randint(0,numObjects)
    if int(epochTime) % 120 < 10:
        print("{\"detected\": \"" + objects[randint(0,numObjects)] + "\", \"epoch\": " + str(epochTime) + "}")
    else:
        print("{\"detected\": \"" + objects[randint(0,numObjects)] + "\", \"epoch\": " + str(epochTime) + "}")
        
    timeNum = randint(1, 10)
    time.sleep(timeNum / 10)

    epochTime = epochTime + timeNum/100.0
