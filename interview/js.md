# 前端面试总结-JS篇

## 基础

### 数据类型

#### 两大数据类型
* 原始类型：Boolean, Null, Undefined, String, Number, Symbol(ES6新增)
* Object类型：Object

#### 扩展：
* null与undefined区别：null表示变量值为空，undefined说明变量未定义。
* Boolean类型在进行判断的时候设置为 0、-0、null、""、false、undefined 或 NaN，则该对象设置为 false。否则设置为 true（即使 value 参数是字符串 "false"）

#### 闭包
* 闭包定义:
> 「闭包」，是指那些能够访问独立(自由)变量的函数 (变量在本地使用，但定义在一个封闭的作用域中)。换句话说，这些函数可以“记忆”它被创建时候的环境。
> * 特性：
> 1. 函数嵌套函数
> 2. 函数内部可以引用外部的参数和变量
> 3. 参数和变量不会被垃圾回收机制回收
* 闭包的作用：



