
/**
 * ---------1----------
 */
type BackendUser = { // id
  id: number,
  // name
  name: string,
  // true 
  disabled: boolean
  }
  //
  type FrontendUser = { 
    value: number,
   label: string
  }
  
  function transform(users: BackendUser[]): FrontendUser[] { // todo
    return users.filter(item => {
      item.disabled === false
    }).map(v => ({
      value: v.id,
      label: v.name
    }))
  }

  /**
 * ---------2----------
 */
getRawData       (...args: any[]) => Promise<any>
import { getRawData } from './services'

async function getData() { 
  const data = await new Promise((resolve, reject) => {
    setTimeout(async() => {
      const res = await getRawData
      return res ? resolve(res) : reject(new Error("time抛出错误"))
    }, 10000);
  })
  return data
}

  /**
 * ---------3----------
 */

import { useState, useEffect, useCallback } from 'react';

const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count) {
      console.log('开始计数');
    }
  }, [count]);

  const onClick = useCallback(() => {
    console.log(count);
    setCount(count + 1);
  }, [count]);

  return (
    <>
      <span>{count}</span>
      <button onClick={onClick}>+1</button>
    </>
  );
};
export default Component;


  /**
 * ---------4----------
 */


function validate(input?: string | number) { 
  // todo
  // todo
  if(Number(input) % 1 === 0) {
    return input
  }else {
    throw new Error("只能输入整数")
  }

}

// 1
try { 
  validate('12.9')
} catch (e) { 
  console.log(e.message) // 只能输入整数
}

