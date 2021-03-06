/**
 * 子集包含父级元素
 * @param target
 * @returns {Promise<any>}
 */
export function recursionChild(target) {
  return new Promise((resolve, reject) => {
    let fun = `
      onmessage = function (e) {
          function recursionChild(target) {
            if(target instanceof Array && target.length > 0){
              target.forEach(data => {
                recursionChild(data);
              });
            }else{
              let list = target.children;
              if (list && list.length > 0) {
                list.forEach(data => {
                  data.parent = target;
                  recursionChild(data);
                });
              }
            }
          }
          recursionChild(e.data)
          postMessage(e.data);
      }
    `;
    const blob = new Blob([fun], {type: 'application/javascript'});
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    worker.postMessage(target);
    worker.onmessage = (e) => {
      resolve(e.data);
    };
  });
}

/**
 * 同步子集和父级的状态
 * 递归
 * @param target
 */
export function recursionChildCheck(target) {
  let list = target.children;
  if (!target.checked) {
    target.checkState = 0;
  }
  if (list && list.length > 0) {
    list.forEach(data => {
      let checked = data.parent.checked;
      data.checked = checked;
      if (checked) {
        data.checkState = 1;
        data.checked = true;
      } else {
        data.checkState = 0;
        data.checked = false;
      }
      recursionChildCheck(data);
    });
  }
}

/**
 * 判断当前对象的父级中的子集被选中的个数
 * @param data
 */
export function recursionParentCheck(data) {
  let parent = data.parent;
  if (parent) {
    let l = parent.children;
    let length = l.reduce((previousValue, currentValue) => { // 有几个全选
      return previousValue + ((currentValue.checked) ? 1 : 0);
    }, 0);
    let length2 = l.reduce((previousValue, currentValue) => {  // 有几个全选
      return previousValue + ((currentValue.checkState == 2) ? 1 : 0);
    }, 0);
    if (length == l.length) {
      parent.checkState = 1;
      parent.checked = true;
    } else if (length == 0 && length2 == 0) {
      parent.checkState = 0;
      parent.checked = false;
    } else {
      parent.checkState = 2;
      parent.checked = false;
    }
    recursionParentCheck(parent);
  }
}

/**
 * 子集全部选中不考虑子集数据
 * @param list
 * @param {any[]} result
 * @param {number} type
 * @returns {any[]}
 */
export function recursionResult(list, result = []) {
  if (list && list.length > 0) {
    list.forEach(data => {
      // 全部选中
      if (data.checked) {
        result.push(data);
      } else {
        let child = data.children;
        if (child && child.length > 0) {
          recursionResult(child, result);
        }
      }
    });
  }
  return result;
}

/**
 * 只获取最后一层的值
 * @param list
 * @param {any[]} result
 * @param {number} type
 */
export function recursionResult2(list, result = []) {
  if (list && list.length > 0) {
    list.forEach(data => {
      let child = data.children;
      if (child && child.length > 0) {
        recursionResult2(child, result);
      } else if (data.checked) {
        result.push(data);
      }
    });
  }
  return result;
}

/**
 * 数据回显
 * @param target [0,2 一组id]
 * @param list
 * @param {string} key
 */
export function recursionFilter(target, list, key = 'id') {
  if (!(target instanceof Array) || !(list instanceof Array)) return;
  list.forEach((data) => {
    let bo = target.find((d => d == data[key]));
    if (bo != undefined) {
      data.checked = true;
      data.checkState = 1;
      recursionChildCheck(data);
      recursionParentCheck(data);
    }
    let child = data.children;
    if (child instanceof Array && child.length > 0) {
      recursionFilter(target, child);
    }
  });
}

/**
 * 只考虑最后一级的赋值情况
 * @param target
 * @param list
 * @param {string} key
 */
export function recursionFilter2(target, list, key = 'id') {
  if (!(target instanceof Array) || !(list instanceof Array)) return;
  list.forEach((data) => {
    let child = data.children;
    if (child instanceof Array && child.length > 0) {
      recursionFilter2(target, child);
    } else {
      let bo = target.find((d => d == data[key]));
      if (bo != undefined) {
        data.checked = true;
        data.checkState = 1;
        recursionChildCheck(data);
        recursionParentCheck(data);
      }
    }
  });
}

/**
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
export function image(url: string) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
}

/**
 * 数组分割
 * @param array
 * @param {number} size
 * @returns {any[]}
 */
export function splitArray(array, size = 500) {
  let result = [];
  for (let x = 0; x < Math.ceil(array.length / size); x++) {
    let start = x * size;
    let end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}

/**
 * 定时器
 * @param time
 * @returns {Promise<any>}
 */
export function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function prefixInteger(num, length) {
  return ('0000000000000000' + num).substr(-length);
}


/**
 *
 * @param list
 * @returns {any[]}
 */
export function hoursFormat(list) {
  let result = [];
  let li = [];
  for (let i = 0; i < list.length; i++) {
    let b = list[i];
    if (b) {
      li.push(i);
    } else {
      if (li.length) {
        result.push(`${prefixInteger(li[0], 2)}:00~${prefixInteger(li[li.length - 1], 2)}:59`);
        li.length = 0;
      }
    }
  }
  if (li.length) {
    result.push(`${prefixInteger(li[0], 2)}:00~${prefixInteger(li[li.length - 1], 2)}:59`);
    li.length = 0;
  }
  return result;
}

/**
 * 深度拷贝
 * @param target
 * @returns {any}
 */
export function codyDepth(target) {
  return JSON.parse(JSON.stringify(target));
}

/**
 * 异步加载js
 */
export function loadScript(url, callback?) {
  return new Promise((resolve, reject) => {
    let jsapi = window.document.createElement('script');
    if (callback) {
      window[callback] = function () {
        resolve();
      };
    } else {
      jsapi.onload = () => {
        resolve();
      };
    }
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  });
}

/** Coerces a data-bound value (typically a string) to a boolean. */
export function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}
