# Rammonav
Easy as pie priority nav

#### Example

HTML
```
<div class="nav" id="rammonav">
  <ul class="nav__inner">
    <li class="nav__item">
      <a href="#">Donatello</a>
    </li>
    <li class="nav__item">
      <a href="#">Leonardo</a>
    </li>
    <li class="nav__item">
      <a href="#">Michelagelo</a>
    </li>
    <li class="nav__item">
      <a href="#">Raphael</a>
    </li>
    <li class="nav__item">
      <a href="#">Splinter</a>
    </li>
    <li class="nav__item">
      <a href="#">Shredder</a>
    </li>
  </ul>
</div>
<div id="rammonav-sub"></div>
```

CSS
```
body {
  display: flex;
  align-items: flex-start;
}

.nav {
  border: 2px solid blue;
  width: 50%;
  display: flex;
  overflow: hidden;
  margin-right: 20px;
}

.nav__inner {
  border: 2px solid red;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  #priority-subnav & {
    flex-direction: column;
  }
}

.nav__item {
  padding: 10px 30px;
}
```

JS
```
import rammonav from 'rammonav'

const nav = document.querySelector('#rammonav')
const subnav = document.querySelector('#rammonav-sub')

rammonav(nav, subnav)
```