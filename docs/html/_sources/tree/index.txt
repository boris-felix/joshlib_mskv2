Tree items
==========

Properties reference
--------------------

A tree item is a Javascript object with the following possible properties


id {String}
***********

String identifier, unique in the children of the same parent

type {String}
*************

list, video

label {String}
**************

Label for this menu item

url {String|Function}
*********************

URL of the content, can be a function that returns an URL asynchronously 

mime {String}
*************

video/mp4, video/flv

image {String}
**************

URL of an image for the item

playlistNext {Array}
********************

Array of moves that should be performed when the item has finished playing to go to the next element in the automatic playlist
Default is ["next"]

children {Array}
****************

List of children

getChildren {Function}
**********************

Function that returns the list of children asynchronously
