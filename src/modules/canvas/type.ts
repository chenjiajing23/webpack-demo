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
