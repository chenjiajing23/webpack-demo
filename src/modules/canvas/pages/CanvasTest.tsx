import React, { useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { BorderOutlined, DragOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';
import { IDrawType, IOptList, IReactPointInfo } from '../type';

// 操作列表
const operateList: IOptList[] = [
  {
    type: 'drag',
    name: '拖动',
    icon: <DragOutlined />
  },
  {
    type: 'line',
    name: '画直线',
    icon: <BorderOutlined />
  },
  {
    type: 'circle',
    name: '画圆',
    icon: <Loading3QuartersOutlined />
  }
];

const CanvasTest = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMoving, setMoving] = useState(false); // 是否在移动
  const [optType, setOptType] = useState<IDrawType | null>(null); // 操作类型
  const [reactList, setRectList] = useState<IReactPointInfo[]>([]); // 矩形坐标列表
  const curAddPoint = useRef<null | IReactPointInfo>(null); // 当前新增的坐标

  // init drag
  useEffect(() => {
    console.log(9999);
  }, []);

  // 画图
  const toBeCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pointList: IReactPointInfo[]) => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printImg(canvas, imgRef.current as HTMLImageElement, ctx);
    pointList.forEach(item => {
      drawRect(ctx, item);
    });
  };

  // 画图
  const printImg = (canvas: HTMLCanvasElement, img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const xRate = canvas.width / img.width;
    const yRate = canvas.height / img.height;
    ctx.drawImage(img, 0, 0, img.width * xRate, img.height * yRate);
  };

  // 图片加载成功
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const node = canvasRef.current;
    const ctx = node?.getContext('2d');
    if (node && ctx) {
      const img = e.target as HTMLImageElement;
      printImg(node, img, ctx);
    }
  };

  // 获取相对于画布的坐标
  const getPointOnCanvas = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: x - rect.left * (canvas.width / rect.width),
      y: y - rect.top * (canvas.height / rect.height)
    };
  };

  /**
   * @param curPoint 当前坐标
   * @param startPoint 开始坐标
   * @return {IReactPointInfo} 返回正确的坐标信息
   */
  const getRectParam = (curPoint: { x: number; y: number }, startPoint: { x: number; y: number }): IReactPointInfo => {
    const w = curPoint.x - startPoint.x;
    const h = curPoint.y - startPoint.y;

    const newStartPoint = w < 0 || h < 0 ? curPoint : startPoint;

    return {
      ...newStartPoint,
      w: Math.abs(w),
      h: Math.abs(h)
    };
  };

  // 画矩形
  const drawRect = (ctx: CanvasRenderingContext2D, point: IReactPointInfo) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.rect(point.x, point.y, point.w, point.h);
    ctx.stroke();
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(true);
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node?.getContext('2d') as CanvasRenderingContext2D;

    const x = e.pageX;
    const y = e.pageY;

    switch (optType) {
      case 'line':
        console.log('line');
        break;
      case 'circle':
        console.log('circle');
        break;
      case 'drag':
        console.log('drag');
        break;
      default:
        void message.info('请选择操作类型');
    }
    curAddPoint.current = { ...getPointOnCanvas(node, x, y), w: 0, h: 0 };

    reactList.forEach(item => {
      drawRect(ctx, item);
    });
  };

  // 移动鼠标
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMoving) {
      return;
    }

    // 直线
    if (optType === 'line') {
      const node = canvasRef.current;
      const ctx = node?.getContext('2d');

      if (node && ctx) {
        const endPoint = getPointOnCanvas(node, e.pageX, e.pageY);

        if (curAddPoint.current) {
          curAddPoint.current = getRectParam(endPoint, { x: curAddPoint.current.x, y: curAddPoint.current.y });
          toBeCanvas(node, ctx, reactList.concat(curAddPoint.current));
        } else {
          toBeCanvas(node, ctx, reactList);
        }
      }
    }
  };

  // 松开鼠标(保存坐标)
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(false);
    const node = canvasRef.current as HTMLCanvasElement;

    if (optType === 'line') {
      if (curAddPoint.current) {
        const endPoint = getPointOnCanvas(node, e.pageX, e.pageY);
        curAddPoint.current = getRectParam(endPoint, { x: curAddPoint.current?.x, y: curAddPoint.current?.y });
        setRectList(reactList.concat(curAddPoint.current));
        curAddPoint.current = null;
      }
    }
  };

  // 导出图片
  const exportImage = () => {
    const node = canvasRef.current as HTMLCanvasElement;
    const dataURL = node.toDataURL('image/png', 1);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = 'canvas-test';
    a.href = dataURL;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  };

  return (
    <section styleName="canvas-test">
      <ul className="opt">
        {operateList.map(item => (
          <li
            key={item.type}
            className={classNames('opt-item', { 'opt-item-active': item.type === optType })}
            onClick={() => setOptType(item.type)}
          >
            {item.icon}
          </li>
        ))}
      </ul>
      <div className="content">
        <img ref={imgRef} className="image" src={imgSrc} alt="" onLoad={onLoad} />
        <canvas
          width={1200}
          height={700}
          className="canvas"
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={exportImage}>
          导出图片
        </Button>
      </div>
    </section>
  );
};

export default CanvasTest;
