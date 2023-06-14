# Version 0.3

This update brings the first draft of a mobile interface, so you aren't bound to your PC anymore and can take the fun anywhere. You can create your flows using the web-app on a PC as usual and then transfer them to your mobile device using an exported json file or by simply pressing a button to Export it to [litterbox.catbox.moe](https://litterbox.catbox.moe).
You can choose which nodes, buttons or sliders to show in the mobile interface by clicking the small "mobile"-icon in the top right of some nodes.
A new tab was introduced in the right sidebar to preview what your flow will look like on your mobile device.
Using the E621-node, you can view images of a search and integrate a slideshow into your flow - this is especially useful with the Mobile View.
To support the newer versions of [Intiface Central](https://intiface.com/central/) (which come with support for more toys, yay) with an update of "buttplug-js" I had to remove the "Embedded Server" as the library no longer supports it. But fear not! The Intiface Central software runs on every mayor operating system and even your smartphone.

# Version 0.2a

Quick fix to allow build and install under NodeJs 18.13.0 and npm 9.3.1

# Version 0.2

To make beadi a bit more accessible to new users, there is now a welcome message, which should present an easy starting point.

Also I have made initial efforts into the direction of typed connections - especially signals! The Button node now features a way to send a signal to other nodes, e.g the Toggle node, this allows you to create more sophisticated control flows, and you don't have to fiddle around with numeric values, while you're at it.
The new Curve node allows you to draw custom curves that will be played back when plugging in an input.

# Version 0.1

This is the very first version of Beadi, so there's a lot of stuff - just see for yourself
