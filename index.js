const bool = true

const a = new Promise((resolve, reject) => {
  if(bool){
     return resolve(1)
  }else {
    return reject()
  }
})

const fn = async() => {
  const d = await new Promise((resolve, reject) => {
    setTimeout(async() => {
      const res = await a 
      console.log(res ? res : "error")
      return res ? resolve(res) : reject("time抛出错误")
    }, 3000);
  })
  console.log(d)
  return d
}

function validate(input) { 
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
