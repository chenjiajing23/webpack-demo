import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { BorderOutlined, DragOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';
import { IArcPointInfo, IDragPointInfo, IDrawType, IOptList, IPointInfo, IReactPointInfo, IRectOption } from '../type';

// 操作列表
const operateList: IOptList[] = [
  {
    type: 'drag',
    name: '拖动',
    icon: <DragOutlined />
  },
  {
    type: 'rect',
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
  const [isMouseDown, setMouseDown] = useState(false); // 是否按下键盘
  const [optType, setOptType] = useState<IDrawType | null>(null); // 操作类型
  const aLLPointList = useRef<IPointInfo[]>([]); // 坐标列表
  const curAddPoint = useRef<null | IReactPointInfo>(null); // 当前新增的坐标
  const dragPoint = useRef<IDragPointInfo | null>(null);
  const [isDragging, setDragging] = useState(false);

  useEffect(() => {
    if (dragPoint.current && optType === 'drag') {
      setDragging(true);
    } else {
      setDragging(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optType, dragPoint.current]);

  // 画图
  const toBeCanvas = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pointList: IPointInfo[]) => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      printImg(canvas, imgRef.current as HTMLImageElement, ctx);

      pointList.forEach(item => {
        const point = item.point;

        if (item.type === 'rect') {
          drawRect(ctx, point as IReactPointInfo);
        } else if (item.type === 'circle') {
          drawArc(ctx, (point as unknown) as IArcPointInfo);
        }
      });
    },
    []
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

    toBeCanvas(canvas, ctx, aLLPointList.current);
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
  const getRectParam = (
    curPoint: { x: number; y: number },
    startPoint: { x: number; y: number }
  ): Omit<IReactPointInfo, 'type'> => {
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

  // 画圆形
  const drawArc = (ctx: CanvasRenderingContext2D, point: IArcPointInfo, rectOption?: IRectOption) => {
    ctx.beginPath();
    ctx.lineWidth = rectOption?.lineWidth || 3;
    ctx.strokeStyle = rectOption?.color || '#000';
    ctx.arc(point.x, point.y, point.r, 0, 2 * Math.PI, false);
    ctx.stroke();
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!optType) {
      return;
    }

    setMouseDown(true);

    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;

    const startPoint = getCanvasPoint(node, e.pageX, e.pageY);

    curAddPoint.current = { ...startPoint, w: 0, h: 0 };

    // 高亮选中的图形
    aLLPointList.current.forEach((item, index) => {
      if (item.type === 'rect') {
        drawRect(ctx, item.point as IReactPointInfo);
      } else if (item.type === 'circle') {
        drawArc(ctx, item.point as IArcPointInfo);
      }

      // 选中高亮
      if (ctx.isPointInPath(startPoint.x, startPoint.y)) {
        dragPoint.current = { index, x: startPoint.x, y: startPoint.y };
        ctx.strokeStyle = '#ff4444';
      } else {
        ctx.strokeStyle = '#000';
      }
      ctx.stroke();
    });
  };

  // 移动鼠标
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMouseDown) {
      return;
    }

    if (curAddPoint.current) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const endPoint = getCanvasPoint(canvas, e.pageX, e.pageY);

      // 直线
      if (optType === 'rect') {
        curAddPoint.current = {
          ...getRectParam(endPoint, { x: curAddPoint.current.x, y: curAddPoint.current.y })
        };
        toBeCanvas(canvas, ctx, aLLPointList.current.concat({ type: optType, point: curAddPoint.current }));
      } else if (optType === 'circle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        printImg(canvas, imgRef.current as HTMLImageElement, ctx);

        curAddPoint.current = {
          ...getRectParam(endPoint, { x: curAddPoint.current.x, y: curAddPoint.current.y })
        };

        // 取半径
        const r = Math.sqrt(Math.pow(curAddPoint.current.w, 2) + Math.pow(curAddPoint.current.h, 2)) / 2;
        const arcPoint: IArcPointInfo = {
          x: curAddPoint.current.x + r,
          y: curAddPoint.current.y + r,
          r: Math.abs(r)
        };

        toBeCanvas(canvas, ctx, aLLPointList.current.concat({ type: optType, point: arcPoint }));
      } else if (optType === 'drag') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        printImg(canvas, imgRef.current as HTMLImageElement, ctx);

        // 画图
        aLLPointList.current.forEach((item, index) => {
          let moveX = 0;
          let moveY = 0;
          let color;
          if (index !== dragPoint.current?.index) {
            color = '#000';
          } else {
            moveX = endPoint.x - dragPoint.current.x;
            moveY = endPoint.y - dragPoint.current.y;
            color = '#ff4444';
          }
          const point = item.point;
          const newPoint = { ...point, x: point.x + moveX, y: point.y + moveY };
          if (item.type === 'rect') {
            drawRect(ctx, newPoint as IReactPointInfo, { color });
          } else if (item.type === 'circle') {
            drawArc(ctx, newPoint as IArcPointInfo, { color });
          }
        });
      }
    }
  };

  // 松开鼠标(保存数据)
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMouseDown(false);

    const node = canvasRef.current as HTMLCanvasElement;
    const endPoint = getCanvasPoint(node, e.pageX, e.pageY);

    if (curAddPoint.current) {
      if (optType === 'rect') {
        curAddPoint.current = {
          ...getRectParam(endPoint, { x: curAddPoint.current?.x, y: curAddPoint.current?.y })
        };
        aLLPointList.current.push({ type: optType, point: curAddPoint.current });
      } else if (optType === 'circle') {
        // 取半径
        const r = Math.sqrt(Math.pow(curAddPoint.current.w, 2) + Math.pow(curAddPoint.current.h, 2)) / 2;
        const arcPoint: IArcPointInfo = {
          x: curAddPoint.current.x + r,
          y: curAddPoint.current.y + r,
          r: Math.abs(r)
        };

        aLLPointList.current.push({ type: optType, point: arcPoint });
      }
      // 重置数据
      curAddPoint.current = null;
    }
    if (optType === 'drag') {
      aLLPointList.current.forEach((_, index) => {
        if (dragPoint.current && index === dragPoint.current.index) {
          aLLPointList.current[index].point.x += endPoint.x - dragPoint.current.x;
          aLLPointList.current[index].point.y += endPoint.y - dragPoint.current.y;
        }
      });
      // 重置数据
      dragPoint.current = null;
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
      <div className={classNames('content', { 'content-drag': isDragging })}>
        <img ref={imgRef} className="image" src={imgSrc} alt="" onLoad={onLoad} />
        <canvas
          width={1200}
          height={700}
          className={classNames('canvas')}
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
