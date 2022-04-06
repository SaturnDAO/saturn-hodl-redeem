
import React, { useEffect, useRef, ImgHTMLAttributes } from 'react'
import { Params, hashicon, HasherType } from '@emeraldpay/hashicon'

export interface Props {
  value: string;
  size?: number;
  hasher?: HasherType;
  options?: Params;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export function getHashiconImgData (address: string, size = 64) {
  address = address.lc()
  return hashicon(address, { size }).toDataURL()
}


const Hashicon: React.FC<Props> = (props) => {
  const ref = useRef<ImgHTMLAttributes<HTMLImageElement>>();

  const generate = () => {
    if (!props.value) return
    let options = {}

    if (typeof options !== 'undefined') {
      options = { ...options, ...props.options }
    }

    if (typeof props.size === 'number') {
      options = { ...options, ...{ size: props.size } }
    }

    if (typeof props.hasher === 'string') {
      options = { ...options, ...{ hasher: props.hasher } }
    }

    const attributes: ImgHTMLAttributes<HTMLImageElement> = {
      src: hashicon(props.value.lc(), options).toDataURL(),
      alt: props.value,
    }

    if (typeof props.size === 'number') {
      attributes.width = props.size
    }

    ref.current = attributes
  }

  useEffect(() => {
    generate();
  }, [props.value])

  if (!ref.current) return <></>;

  return <img
    {...ref.current}
    onClick={props.onClick}
    className={props.className}
    style={props.style}
  />
}

export default Hashicon