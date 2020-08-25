/*
 *自定义promise函数:IIFE
 */

(function (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  /**
   * Promise构造函数
   * excutor：执行器函数（同步）
   */
  function Promise(excutor) {

    // 将当前promise对象保存起来
    const self = this
    self.status = PENDING // 给promise对象指定status属性，初始值为pending
    self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
    self.callbacks = [] // 每个元素的结构：{ onResolved() {}, onRejected() {} }
    function resolve(value) {
      // 判断当前状态是否为pending
      if (self.status !== PENDING) {
        return
      }
      // 修改状态为resolve
      self.status = RESOLVED
      // 保存value数据
      self.data = value
      // 如果有待执行的callback函数,立即异步执行回调函数
      if (self.callbacks.length > 0) {
        setTimeout(() => {
          self.callbacks.forEach(callback => {
            callback.onResolved(value)
          })
        })
      }
    }

    function reject(reason) {
      if (self.status !== PENDING) {
        return
      }
      self.status = REJECTED
      self.data = reason
      if (self.callbacks.length > 0) {
        setTimeout(() => {
          self.callbacks.forEach(callback => {
            callback.onRejected(reason)
          })
        })
      }
    }
    // 立即同步执行excutor1,如果有异常则直接onRejected
    try {
      excutor(resolve, reject)
    } catch (error) { // 如果执行器抛出异常，promise对象变为rejected状态
      reject(error)
    }
  }

  /**
   * Promise原型对象的then()方法
   * 指定成功和失败的回调函数，函数的返回值为新的promise对象
   */
  Promise.prototype.then = function (onResolved, onRejected) {
    // 向后传递成功的value
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    // 指定默认的失败回调（实现错误/异常传透的关键点），向后传递失败的reason
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason
    }

    const self = this

    // 返回一个promise对象
    return new Promise((resolve, reject) => {

      /** 
       * 调用指定回调函数处理，根据执行的结果，改变return的promise的状态
       */
      function handle(callback) {
        /**
         * 1、如果抛出异常，return的promise就会失败，reason就是error
         * 2、如果执行返回不是promise。return的promise就会成功，value就是返回值
         * 3、如果执行返回是promise。return的promise结果根据该promise的结果来确定
         */
        try {
          const result = callback(self.data)
          if (result instanceof Promise) {
            // 3、如果执行返回是promise。return的promise结果根据该promise的结果来确定
            // result.then(
            //   value => resolve(value), // 当result成功时，让return的promise也成功
            //   reason => reject(reason) // 当result失败时，让return的promise也失败
            // )
            result.then(resolve, reject)
          } else {
            // 2、如果执行返回不是promise。return的promise就会成功，value就是返回值
            resolve(result)
          }
        } catch (error) {
          // 1、如果抛出异常，return的promise就会失败，reason就是error
          reject(error)
        }
      }

      // 当前状态还是pending状态，将回调函数保存起来
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved(value) {
            handle(onResolved)
          },
          onRejected() {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {
        // 当前是resolved状态，异步执行onResolved并改变return的promise状态
        setTimeout(() => {
          handle(onResolved)
        })
      } else {
        // 当前状态是rejected状态，异步执行onResolved并改变return的promise状态
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })

  }
  /**
   * Promise原型对象的catch()方法
   * 指定失败的回调函数，函数的返回值为新的promise对象
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }
  /**
   * Promise函数对象resolve方法
   * 返回一个指定结果的成功的promise
   */
  Promise.resolve = function (value) {
    // 返回一个成功/事变的promise
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        // value是promise，promise状态根据value来决定成功失败，数据是value
        value.then(resolve, reject)
      } else {
        // value不是promise，promise变为成功，数据是value
        resolve(value)
      }
    })
  }
  /**
   * Promise函数对象reject方法
   * 返回一个指定结果的失败的promise
   */
  Promise.reject = function (reason) {
    // 返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  /**
   * Promise函数对象all方法
   * 返回一个promise，只有当所有promise都成功时才成功。否则失败
   */
  Promise.all = function (promises) {
    // 用来保存所有成功的value的数组
    const values = new Array(promises.length)
    // 定义计数器，用来保存promise的数量
    let resolvedCount = 0
    // 返回一个新的promise
    return new Promise((resolve, reject) => {
      // 遍历获取每个promise的结果
      promises.forEach((p, index) => {
        // Promise.resolve(p) 包裹一层成功的promise的意思是：
        // 当遍历参数为非promise时，按成功来调用
        // 当遍历参数为promise时，根据p的成功失败判定该promise的状态
        Promise.resolve(p).then(
          value => {
            resolvedCount++ // 成功的数量加 1
            // 成功的值，保存到values
            values[index] = value // 为了保准顺序，不能实用push

            // 如果全部成功了，将return的promise改为成功
            if (resolvedCount === promises.length) {
              resolve(values)
            }
          },
          reason => {
            // 只要有一个失败，return的promise就失败了
            reject(reason)
          }
        )
      })
    })
  }
  /**
   * Promise函数对象race方法
   * 返回一个最先执行完成的promise，无论成功与失败
   */
  Promise.race = function (promises) {
    // 返回一个promise
    return new Promise((resolve, reject) => {
      // 遍历获取每个promise的结果
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          value => {
            // 一旦有成功的，将return变为成功
            resolve(value)
          },
          reason => {
            // 一旦有失败的，将return变为失败
            reject(reason)
          }
        )

      })
    })
  }

  /**
   * 返回一个promise对象，它在指定的时间后才确定结果
   */

  Promise.resolveDelay = function (value, time) {
    // 返回一个成功/事变的promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) {
          // value是promise，promise状态根据value来决定成功失败，数据是value
          value.then(resolve, reject)
        } else {
          // value不是promise，promise变为成功，数据是value
          resolve(value)
        }
      }, time)
    })
  }


  /**
   * 返回一个promise对象，它在指定的时间后才失败
   */

  Promise.rejectDelay = function (reason, time) {
    // 返回一个失败的promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(reason)
      }, time)
    })
  }



  // 将自定义promise抛出
  window.Promise = Promise
})(window)
