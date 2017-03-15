"use strict";

/**
 * 节点类
 */
class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
/**
 * 二叉树
 */
class BinarySearchTree {
  /** 根节点 */
  constructor() {
    this.root = null;
  }
  /**
   * 插入：
   *  1.从根节点root开始
   *  2.如果root为空，则root为该插入值
   *  3.root不为空，插值小于当前节点，查找左子树，大于当前节点查找右子树；
   * @param {*Number} data 
   */
  insert(data) {
    let newNode = new Node(data, null, null);
    if(!this.root) {
      return this.root = newNode;
    }
    let currentNode = this.root;
    let parentNode = null;
    while(true) {
      parentNode = currentNode;
      if(data < currentNode.data) {
        currentNode = currentNode.left;
        if(currentNode === null) {
          parentNode.left = newNode;
          break;
        }
      }else if(data > currentNode.data) {
        currentNode = currentNode.right;
        if(currentNode === null) {
          parentNode.right = newNode;
          break;
        }
      }
    }
  }
  /**
   * 查找节点
   * @param {*} data 
   */
  search(data) {
    let currentNode = this.root;

    while(currentNode !== null){
      if(currentNode.data == data){
        break;
      }else if(data < currentNode.data){
        currentNode = currentNode.left;
      }else{
        currentNode = currentNode.right;
      }
    }
    return currentNode;
  }
  /**
   * 删除节点
   *  1.找到删除节点
   *  2.如果删除节点左节点为空 , 右节点也为空;
   *  3.如果删除节点只有一个子节点 右节点 或者 左节点
   *  4.如果删除节点左右子节点都不为空
   * @param data
   */
  remove(data) {
    let currentNode = this.root;
    let parentNode = this.root;
    let isLeftChild = false;

    /** 找到删除节点 */
    while(data != currentNode.data){
      parentNode = currentNode;
      if(data < currentNode.data){
        isLeftChild = true;
        currentNode = currentNode.left;
      }else if(data > currentNode.data){
        isLeftChild = false;
        currentNode = currentNode.right;
      }
    }
    /** 左右节点皆为空 */
    if(currentNode.left===null && currentNode.right===null){
      if(currentNode == this.root){
        this.root = null;
      }
      if(isLeftChild){
        parentNode.left = null;
      }else{
        parentNode.right = null;
      }
    }/** 左或右一节点为空 */
    else if(currentNode.left === null){
      if(currentNode == this.root){
        this.root = currentNode.right;
      }else if(isLeftChild){
        parentNode.left = currentNode.right;
      }else{
        parentNode.right = currentNode.right;
      }
    }else if(currentNode.right === null){
      if(currentNode == this.root){
        this.root = currentNode.left;
      }else if(isLeftChild){
        parentNode.left = currentNode.left;
      }else{
        parentNode.right = currentNode.left;
      }
    }else{/** 左右节点都不为空 */
      let parent = currentNode;
      let successor = currentNode.right;
      while(successor.left){
        parent = successor;
        successor = successor.left;
      }
      currentNode.data = successor.data;
      if(parent.left === successor){
        parent.left = successor.right;
      }else{
        parent.right = successor.right;
      }
    }
  }

  print(node) {
    if(node){
      this.print(node.left);
      console.log(node.data);
      this.print(node.right);
    }
  }
}

let bst = new BinarySearchTree();
bst.insert(8);
bst.insert(3);
bst.insert(10);
bst.insert(1);
bst.insert(6);
bst.insert(4);
bst.insert(7);
bst.insert(14);
bst.insert(13);

let root = bst.search(8);
bst.print(root);
bst.remove(3);
console.log("========");
bst.print(root);