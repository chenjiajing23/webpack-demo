import React, { memo, PropsWithChildren } from 'react';

import './index.less';

interface IProps {
  text?: string;
}

const PageLoading = (props: PropsWithChildren<IProps>) => (
  <div styleName="loader">{props.text}</div>
);

PageLoading.defaultProps = { text: 'Loading...' } as Partial<IProps>;
export default memo(PageLoading);
