// @ts-nocheck
import './index.css'
import Data from './data.xml';
import icon from './assets/good.png'
import printMe from './print'


function component() {
  var element = document.createElement('div');
  element.innerHTML = '我是你大爷';
  element.classList.add('hello');

  let btn = document.createElement('button')
  btn.innerHTML = 'click me ant check the console'
  btn.onclick = printMe

  element.appendChild(btn)

  let myIcon = new Image()
  myIcon.src = icon
  element.appendChild(myIcon);
  console.log(Data)

  return element;
}

document.body.appendChild(component());