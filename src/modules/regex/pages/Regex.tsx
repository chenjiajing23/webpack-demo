import React, { PropsWithChildren, useState, useRef } from 'react';
import { Button, Input } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import '../style/regex.less';

interface IProps {
  [key: string]: any;
}

const Regex = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props;
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [regexText, setRegexText] = useState(''); // 正则表达式
  const [testText, setTestText] = useState(''); // 测试文本

  // 点击事件
  const onTestRegex = () => {
    const errorBox = errorRef.current;
    const resultBox = resultRef.current;

    if (errorBox && resultBox) {
      // 清除错误和结果
      errorBox.innerHTML = '';
      resultBox.innerHTML = '';

      if (regexText === '') {
        errorBox.innerHTML = '请输入正则表达式';
      } else if (testText === '') {
        errorBox.innerHTML = '请输入测试文本';
      } else {
        const regex = createRegex(regexText);
        if (!regex) {
          return;
        } else {
          let result: null | RegExpExecArray = null;
          const resultList: (RegExpExecArray | null)[] = [];

          // 没有修饰符g的话，会死循环
          if (regex.global) {
            while ((result = regex.exec(testText))) {
              resultList.push(result);
            }
          } else {
            resultList.push(regex.exec(testText));
          }

          // 结果
          if (resultList[0] === null || resultList[0] === undefined) {
            resultBox.innerHTML = '匹配到0个结果';
            return;
          }
          let htmlText = testText;
          console.log('匹配结果：', resultList);
          // 渲染结果
          for (let i = resultList.length - 1; i >= 0; i--) {
            const result = resultList[i] as RegExpExecArray;
            const match = result[0];
            const prefix = htmlText.substring(0, result.index);
            const suffix = htmlText.substring(result.index + match.length);

            htmlText = prefix + '<span class="info">' + match + '</span>' + suffix;
            console.log('第', resultList.length - i, '轮拼接字符', htmlText);
          }
          resultBox.innerHTML = `匹配到 ${resultList.length}个结果：<br />${htmlText}`;
        }
      }
    }
  };

  // 生成正则表达式（核心函数）
  const createRegex = (regex: string) => {
    try {
      if (regex[0] === '/') {
        const regexList = regex.split('/');
        regexList.shift();
        const flags = regexList.pop();
        const regexText = regexList.join('/');
        return new RegExp(regexText, flags);
      } else {
        return new RegExp(regex, 'g');
      }
    } catch (e) {
      console.error(e);
      const node = errorRef.current;
      if (node) {
        node.innerHTML = '无效的正则表达式!';
      }
      return false;
    }
  };

  return (
    <section styleName="regex">
      <div className="header">
        <span>Regex Test</span>
      </div>
      <div className="error" ref={errorRef} />
      <Input
        value={regexText}
        className="expression"
        size="large"
        placeholder="请输入正则表达式"
        onChange={e => setRegexText(e.target.value.trim())}
      />
      <Input
        value={testText}
        className="text"
        size="large"
        placeholder="请输入测试文本"
        onChange={e => setTestText(e.target.value)}
      />
      <div styleName="footer">
        <Button type="primary" size="large" onClick={onTestRegex}>
          测试一下
        </Button>
      </div>
      <div ref={resultRef} id="result" />
    </section>
  );
};

export default Regex;
