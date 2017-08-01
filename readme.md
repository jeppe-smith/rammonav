# Rammonav
The easy priority navigation plugin

## Usage
Rammonav can be used in a variety of ways because you have the freedom to decide the destination of the moved items. It copies the navigation, appends it to the target and adds or removes classes depending on whether or not there's room for it in the navigtion.

At the moment only horizontal navigations are supported.

Below is an example of how Rammonav can be used. The example uses flex to position navigation and items but any case where the container can't overflow its parent and the navigation can overflow the container should work.

#### Markup
```
<nav class="rammonav">
  <ul class="nav">
    <li class="nav__item"><a href="#" class="nav__link">Donatello</a></li>
    <li class="nav__item"><a href="#" class="nav__link">Leonardo</a></li>
    <li class="nav__item"><a href="#" class="nav__link">Michelangelo</a></li>
    <li class="nav__item"><a href="#" class="nav__link">Raphael</a></li>
    <li class="nav__item"><a href="#" class="nav__link">Splinter</a></li>
    <li class="nav__item"><a href="#" class="nav__link">Shredder</a></li>
    <li class="subnav"></li> <!-- Navigation items will be move to here -->
  </ul>
</nav>
```

#### Styling
```
.rammonav {
  display: flex;
  width: 100%; }

.nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; }

.nav.rammo-clone {
  flex-direction: column; } // Stack the items in the cloned navigation

.rammo-hidden, .rammo-empty {
  display: none; }
```

#### Javascript
```
import Rammonav from 'rammonav'

const rammonav = Rammonav(
  document.querySelector('.rammonav'),
  document.querySelector('.subnav')
)
```

## API
Rammonav returns an object that you can use in your application to manually remove items or see which items are removed.

* __check()__ Checks the navigation and adds or removes items if necessary.
* __movedItems__ Array of moved items.
* __onmove__ Callback that is called everytime an item is moved with the Rammonav instance as its only argument.