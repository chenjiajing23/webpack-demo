import React, { PropsWithChildren, useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';

import '../style/demo.less';
import demeImage from '../assets/good.png';
import { decrementCount, incrementCount } from '@/store/demo/action';
import { IDemoState } from '@/store/demo/type';
import { RouteComponentProps } from 'react-router-dom';
import { IStoreState } from '@/store/type';

interface IProps {
  [key: string]: any;
}

const Demo1 = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props;
  const { language } = useParams<RouterParams>();
  const [isShow, setShow] = useState(false);
  const dispatch = useDispatch();
  const demo = useSelector<IStoreState, IDemoState>(state => state.demo);

  useEffect(() => {
    (window.apis as any).getUserInfo({ params: { id: 333 } }).then((res: any) => {
      console.log(res);
    });
  }, []);

  const increment = () => {
    dispatch(incrementCount(1));
    setShow(!isShow);
  };

  const decrement = () => {
    dispatch(decrementCount(-1));
    setShow(!isShow);
  };
  if (demo.count === 6) {
    throw new Error('测试错误遮罩层！');
  }

  const onNextPage = () => {
    window.router.push({
      pathname: `/${language}/demo-2`,
      state: { name: window.router.location.pathname }
    });
  };

  return (
    <div styleName="demo" className={classnames({ chenjiajing: isShow })}>
      <div styleName="content">
        <h1>{demo.count}</h1>
        <p styleName="title">无敌是多么寂寞-888888</p>
        <Button type="primary" onClick={increment}>
          +
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button type="primary" onClick={decrement}>
          -
        </Button>
      </div>
      <img src={demeImage} alt="" />
      <div styleName="cover" />
      <hr />
      <Button type="primary" onClick={onNextPage}>
        到 DEMO-2
      </Button>
    </div>
  );
};

export default memo(Demo1);
