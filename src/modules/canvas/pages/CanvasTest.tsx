import React, { useRef, useState, useCallback } from 'react';
import { Button } from 'antd';
import { BorderOutlined, DragOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';
import { IDragPointInfo, IDrawType, IOptList, IReactPointInfo, IRectOption } from '../type';

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
  const [reactList, setRectList] = useState<IReactPointInfo[]>([{ x: 100, y: 100, w: 200, h: 120 }]); // 矩形坐标列表
  const curAddPoint = useRef<null | IReactPointInfo>(null); // 当前新增的坐标
  const dragPoint = useRef<IDragPointInfo | null>(null);

  // 画图
  const toBeCanvas = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pointList: IReactPointInfo[]) => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      printImg(canvas, imgRef.current as HTMLImageElement, ctx);

      pointList.forEach((item, index) => {
        // 拖动
        if (optType === 'drag') {
          // debugger;
          let moveX = 0;
          let moveY = 0;
          let color;
          if (dragPoint.current && dragPoint.current?.index === index) {
            moveX = dragPoint.current.x - dragPoint.current.startX;
            moveY = dragPoint.current.y - dragPoint.current.startY;
            color = '#ff4444';
          } else {
            color = '#000';
          }
          drawRect(ctx, { ...item, x: item.x + moveX, y: item.y + moveY }, { color });
          ctx.stroke();
        } else {
          drawRect(ctx, item);
          // 选中高亮
          if (dragPoint.current && ctx.isPointInPath(dragPoint.current.x, dragPoint.current.y)) {
            dragPoint.current = { ...dragPoint.current, index, startX: item.x, startY: item.y };
            ctx.strokeStyle = '#ff4444';
          } else {
            ctx.strokeStyle = '#000';
          }
          ctx.stroke();
        }
      });
    },
    [optType]
  );

  // 画图
  const printImg = (canvas: HTMLCanvasElement, img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const xRate = canvas.width / img.width;
    const yRate = canvas.height / img.height;
    ctx.drawImage(img, 0, 0, img.width * xRate, img.height * yRate);
  };

  // 图片加载成功
  const onLoad = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    toBeCanvas(canvas, ctx, reactList);
  };

  // 获取相对于画布的坐标
  const getCanvasPoint = (canvas: HTMLCanvasElement, x: number, y: number) => {
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
  const drawRect = (ctx: CanvasRenderingContext2D, point: IReactPointInfo, rectOption?: IRectOption) => {
    ctx.beginPath();
    ctx.lineWidth = rectOption?.lineWidth || 3;
    ctx.strokeStyle = rectOption?.color || '#000';
    ctx.rect(point.x, point.y, point.w, point.h);
    ctx.stroke();
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(true);
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;

    const startPoint = getCanvasPoint(node, e.pageX, e.pageY);
    dragPoint.current = {
      startX: dragPoint.current?.startX || 0,
      startY: dragPoint.current?.startY || 0,
      ...startPoint
    };

    curAddPoint.current = { ...startPoint, w: 0, h: 0 };
    toBeCanvas(node, ctx, reactList);

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
        console.log('请选择操作类型');
    }
  };

  // 移动鼠标
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMoving) {
      return;
    }

    if (optType !== 'drag') {
      dragPoint.current = null;
    }

    // 直线
    if (optType === 'line') {
      const node = canvasRef.current as HTMLCanvasElement;
      const ctx = node.getContext('2d') as CanvasRenderingContext2D;

      const endPoint = getCanvasPoint(node, e.pageX, e.pageY);

      if (curAddPoint.current) {
        curAddPoint.current = getRectParam(endPoint, { x: curAddPoint.current.x, y: curAddPoint.current.y });
        toBeCanvas(node, ctx, reactList.concat(curAddPoint.current));
      } else {
        toBeCanvas(node, ctx, reactList);
      }
    } else if (optType === 'drag') {
      console.log(9999);
    }
  };

  // 松开鼠标(保存坐标)
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(false);
    dragPoint.current = null;
    const node = canvasRef.current as HTMLCanvasElement;

    if (optType === 'line') {
      if (curAddPoint.current) {
        const endPoint = getCanvasPoint(node, e.pageX, e.pageY);
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
