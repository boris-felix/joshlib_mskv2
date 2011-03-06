Overview
========

Joshlib is a framework designed to build cross-platform applications using standard web technologies.

Each Joshlib application is made of several blocks :

The Application object
----------------------

Joshlib provides a default App implementation to be overloaded by the application itself. It provides
helpers for initialization and general glue.

The State Tree
--------------

Each app has an abstract tree representing all the possible states it can be in. It can loosely
be thought of as a navigation menu.

The Targets
-----------

Target files describe a device and are used to select which Joshlib features will be used and implement
device-specific behaviours

The Inputs
----------

Each device can have different input methods like keyboard, mouse, touchscreen, ... They can all mapped
to Joshlib events to control the application.

The Events
----------

Joshlib has a built-in event framework which is the primary way of interaction within the app and the framework.


The UI Elements
---------------

Basic UI elements like lists, videos, panels, are abstracted in base classes that will be mapped to device-specific
implementations. For instance a list may be displayed as a scrolling HTML video thumbnail list in a GoogleTV
application but will be converted to a native-looking list for iPhones.

