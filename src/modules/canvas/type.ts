export type IDrawType = 'drag' | 'line' | 'circle';

export interface IOptList {
  type: IDrawType;
  name: string;
  icon: JSX.Element;
}

// 矩形坐标信息
export interface IReactPointInfo {
  x: number;
  y: number;
  w: number;
  h: number;
}

// 拖曳坐标
export interface IDragPointInfo {
  index?: number; // 拖动的下标
  x: number;
  y: number;
}

// 矩形的
export interface IRectOption {
  lineWidth?: number;
  color?: string;
}
