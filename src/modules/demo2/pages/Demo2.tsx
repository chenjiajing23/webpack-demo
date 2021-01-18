import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { Button, Calendar, Pagination } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import '../style/deme-2.less';
import moment from 'moment';
import { IStoreState } from '@/store/type';
import { ILangState } from '@/store/lang/type';
import { onSwitchLang } from '@/store/lang/action';
interface IProps {
  [key: string]: any;
}

function reducer(state: { count: number }) {
  return { count: state.count + 1 };
}

const Demo2 = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props;
  const dispatchRedux = useDispatch();
  const { t } = useTranslation();
  const lang = useSelector<IStoreState, ILangState>(state => state.lang);

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const [person, updatePerson] = useImmer({
    name: 'Michel',
    age: 33
  });

  const updateName = (name: string) => {
    updatePerson(draft => {
      draft.name = name;
    });
  };

  const becomeOlder = () => {
    updatePerson(draft => {
      draft.age++;
    });
  };

  useEffect(() => {
    console.log('demo-2：', window.router.location);
  }, []);

  const onNextPage = () => {
    window.router.push({
      pathname: '/demo',
      state: { name: window.router.location.pathname }
    });
  };

  // switch lang
  const onSetLocal = () => {
    if (lang.local === 'en') {
      dispatchRedux(onSwitchLang('zh-cn'));
    } else {
      dispatchRedux(onSwitchLang('en'));
    }
  };

  return (
    <section styleName="deme-2">
      <header styleName="header">
        <span styleName="title">Demo-2</span>
        <div>
          {/* 3种常用使用方式 */}
          <h1>{t('home')}</h1>
          {/* <h2><Trans>home</Trans></h2>
          <Translation>{t => <h3>{t('home')}</h3>}</Translation> */}
        </div>
        <Button size="small" styleName="lang" onClick={onSetLocal}>
          {lang.local === 'en' ? '中文' : 'English'}
        </Button>
      </header>
      <div styleName="content">
        <p>国际化</p>
        <div style={{ margin: '20px 0' }}>
          <Pagination defaultCurrent={1} total={50} showSizeChanger />
        </div>
        <div
          style={{ margin: '20px 0' }}
          className="site-config-provider-calendar-wrapper"
        >
          <Calendar fullscreen={false} value={moment()} />
        </div>
        <Button type="primary" onClick={onNextPage}>
          回到DEMO-1
        </Button>
        <div className="App">
          <h1>
            Hello {person.name} ({person.age})
          </h1>
          <input
            onChange={e => {
              updateName(e.target.value);
            }}
            value={person.name}
          />
          <br />
          <button onClick={becomeOlder}>Older</button>
        </div>
        <div>
          <span>计时开始：{state.count}</span>
        </div>
      </div>
    </section>
  );
};

export default Demo2;
