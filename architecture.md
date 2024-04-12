a universe is an array of length 512, of integers ranging from 0 to 255

for output we simplty need to send this array of integers to our e131 package.
there can be about 65K universes

a fixture is a group of several nodes:

a patch table gives starting and ending address.
the profile, gives the specific fields that the user will need to know how they can manipulate the light

the control panel sends commands in the form of strings to the select lights, groups, etc.

each control button either adds a string to a stack of commands.

a history stacks tracks the arrays of string commands that have been executed, and should be able to reverse the commands, to undo to previous states.

---

Features
Control panel button send strings to ControlClass

Ability to read fixture settings from database and display
Abiluty to update fixture settings and display

Ability to add new fixtures to a scene.

Properly go back and forth from DMX values to Percentages;
