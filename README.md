# OdinCalculator
The Odin Project Foundations Course Calculator Project.

Project flow
1) create digitsSet() containing all digits pressed from UI and KeyBoard
2) create operatorsSet() containing all operators pressed from UI and KeyBoard
3) create EventListeners for keydown and buttonClick
4) if buttonClicked or keyPressed is operator add it to calc-expression
    except for "ac", "=", etc.
5) perform operation upon clicking of "=" or enter button and 
    put the result in calc-answer.