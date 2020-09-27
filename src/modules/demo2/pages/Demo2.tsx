import React, { PropsWithChildren, useEffect, useReducer } from 'react'
import { Button } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { useImmer } from 'use-immer'

import '../style/deme-2.less'

interface IProps {
  [key: string]: any
}

function reducer(state: { count: number }) {
  return { count: state.count + 1 }
}

const Demo2 = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props

  const [state, dispatch] = useReducer(reducer, { count: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch()
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const [person, updatePerson] = useImmer({
    name: 'Michel',
    age: 33
  })

  const updateName = (name: string) => {
    updatePerson(draft => {
      draft.name = name
    })
  }

  const becomeOlder = () => {
    updatePerson(draft => {
      draft.age++
    })
  }

  useEffect(() => {
    console.log('demo-2：', window.router.location)
  }, [])

  const onNextPage = () => {
    window.router.push({
      pathname: '/demo',
      state: { name: window.router.location.pathname }
    })
  }

  return (
    <section styleName="deme-2">
      <Button type="primary" onClick={onNextPage}>
        回到DEMO-1
      </Button>
      <div className="App">
        <h1>
          Hello {person.name} ({person.age})
        </h1>
        <input
          onChange={e => {
            updateName(e.target.value)
          }}
          value={person.name}
        />
        <br />
        <button onClick={becomeOlder}>Older</button>
      </div>
      <div>
        <span>计时开始：{state.count}</span>
      </div>
    </section>
  )
}

export default Demo2
