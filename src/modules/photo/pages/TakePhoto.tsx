import React, { PropsWithChildren, useRef, useState } from 'react';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import '../style/regex.less';
interface IProps {
  [key: string]: any;
}

const Regex = (props: PropsWithChildren<IProps & RouteComponentProps>) => {
  const {} = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStreamTrack, setMediaStreamTrack] = useState<MediaStream | null>(null);

  // 开启摄像头
  const onOpenCamera = () => {
    /**
     * todo 注意 新版Chrome可以通过本地地址访问摄像头，比如localhost/video.html。
     * 但是不能通过IP地址访问，比如 192.168.1.99/video.html。
     * 而其它低版本的chrome工作都是正常的，想要访问摄像头，麦克风等必须使用https
     * 参考 https://juejin.cn/post/6844903672044847117
     * 解决方案： https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins
     */
    if (navigator.mediaDevices?.getUserMedia) {
      // 默认使用前摄像头，强制使用后置摄像头如下设置
      // let constraints = {video: { facingMode: { exact: "environment" } }};
      const constraints = { video: true, audio: false };
      void navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          setMediaStreamTrack(stream);
          const videoBox = videoRef.current;
          if (videoBox) {
            // 旧的浏览器可能没有srcObject
            if ('srcObject' in videoBox) {
              videoBox.srcObject = stream;
            } else {
              // 防止在新的浏览器里使用它，应为它已经不再支持了
              (videoBox as any).src = window.URL.createObjectURL(stream);
            }
            videoBox.onloadedmetadata = () => {
              void videoBox.play();
            };
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.error('getUserMedia is not implemented in this browser');
      window.alert('getUserMedia is not implemented in this browser');
    }
  };

  // 关闭摄像头
  const onCloseCamera = () => {
    if (mediaStreamTrack) {
      mediaStreamTrack.getTracks().forEach(track => {
        track.stop();
      });
    }
  };

  const onCapture = () => {
    const context = canvasRef.current?.getContext('2d');
    // 绘制画面
    if (context && videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, 640, 480);
    }
  };

  return (
    <section styleName="take-photo">
      <video ref={videoRef} className="video" id="video" width="640" height="480" autoPlay />
      <div className="center">
        {/* 移动端使用 */}
        <input className="input" type="file" accept="image/*" capture="user" />
        <Button type="primary" onClick={onOpenCamera}>
          开启摄像头
        </Button>
        <Button type="primary" danger onClick={onCloseCamera} style={{ margin: '0 20px' }}>
          关闭摄像头
        </Button>
        <Button type="primary" onClick={onCapture}>
          拍照
        </Button>
      </div>
      {/* 渲染图片 */}
      <canvas ref={canvasRef} id="canvas" width="640" height="480" />
    </section>
  );
};

export default Regex;
