import './index.css'
// @ts-ignore
import Data from './data.xml';
// @ts-ignore
import icon from './assets/good.png'

function component() {
  var element = document.createElement('div');
  element.innerHTML = '我是你大爷';
  element.classList.add('hello');

  let myIcon = new Image()
  myIcon.src = icon
  element.appendChild(myIcon);
  console.log(Data)

  return element;
}

document.body.appendChild(component());