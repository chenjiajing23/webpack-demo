import { Button } from 'antd';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import '../style/regex.less';
interface IProps {
  [key: string]: any;
}

const Regex = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props;

  const imageRef = useRef<HTMLImageElement>(null);
  const [base64, setBase64] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; url: string }>({
    name: '',
    size: '',
    url: ''
  });

  useEffect(
    () => () => {
      window.URL.revokeObjectURL(fileInfo.url);
    },
    [fileInfo.url]
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      const fileSize = Math.round(file.size / 1024).toFixed(2); // KB
      const url = window.URL.createObjectURL(file);
      setFileInfo({ name: file.name, size: fileSize, url });

      // 转bold 方法一
      // void fetch(url)
      //   .then(res => res.blob())
      //   .then(blod => {
      //     console.log('blod= ', blod);
      //   });

      // 转bold 方法二
      const reader2 = new FileReader();
      reader2.readAsArrayBuffer(file);
      reader2.onload = e => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result]);
          console.log('blob=', blob);
        }
      };

      // 转 base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64 = reader.result;
        if (typeof base64 === 'string') {
          setBase64(base64);
          console.log(base64);
        }
      };
    }
  };

  // 下载
  const onDownLoadImg = () => {
    try {
      const a = document.createElement('a');
      a.setAttribute('href', fileInfo.url);
      a.setAttribute('download', fileInfo.name);
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section styleName="take-photo">
      <div className="input-wrap">
        <span className="input-inner">+</span>
        <input className="input" type="file" accept="image/*" capture="user" onChange={onChange} />
      </div>
      <div className="image">{fileInfo.url && <img ref={imageRef} src={fileInfo.url || base64} alt="" />}</div>
      <div>
        {/* <a
          href="https://pic4.zhimg.com/v2-4bba972a094eb1bdc8cbbc55e2bd4ddf_r.jpg?source=172ae18b"
          download="1.jpg"
          rel="noopener"
        >
          下载图片
        </a> */}
        &nbsp;&nbsp;
        {fileInfo.url && (
          <Button type="primary" onClick={onDownLoadImg}>
            下载图片
          </Button>
        )}
      </div>
    </section>
  );
};

export default Regex;
