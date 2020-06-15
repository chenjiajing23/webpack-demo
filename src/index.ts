import './index.less'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!', process.env.NODE_ENV);
} else {
  alert(process.env.NODE_ENV)
}

function component() {
  var element = document.createElement('pre');
  element.innerHTML = [3333, 99999999].join('\n\n');
  return element;
}

document.body.appendChild(component());