import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private _http: HttpClient) { }

  baseUrl = environment.baseUrl;

  // CryptoJS Encryption
  secretKey = "~!@#$%^&*(){}[]_+-";
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
  // CryptoJS Encryption End
  
  addPost(data, functionName) {
    return this._http.post(`${this.baseUrl}${functionName}`, data);
  }

  getPosts(functionName) {
    // ?_sort=id&_order=desc&_embed=Comments
    return this._http.get(`${this.baseUrl}${functionName}?_embed=Comments`);
  }

  getPostsById(id) {
    return this._http.get(`${this.baseUrl}Posts/${id}?_embed=Comments`);
  }
  
  updatePostById(id, data) {
    return this._http.put(`${this.baseUrl}Posts/${id}`, data);
    
  }
  deleteUser(id){
    // this._http.delete(`${this.baseUrl}Comments?UserId=${id}`)
    return this._http.delete(`${this.baseUrl}Posts/${id}`);
  }
  
  getPostsByUserId(functionName, id) {
    return this._http.get(`${this.baseUrl}${functionName}?PostedBy=${id}`);
  }
  
  getAllUser() {
    return this._http.get(`${this.baseUrl}Users/?_sort=id&_order=desc`);
  }
  
  getUser(functionName, id) {
    return this._http.get(`${this.baseUrl}${functionName}/${id}`);
  }
  
  addComment(functionName, data) {
    return this._http.post(`${this.baseUrl}${functionName}`, data);
  }
  
  updateUser(id, data) {
    return this._http.put(`${this.baseUrl}Users/${id}`, data);
  }
  
  follow(id, data) {
    return this._http.put(`${this.baseUrl}Users/${id}`, data, this.httpOption);
  }
  
}
// pop()	Removes the last element of the array and return that element
// push()	Adds new elements to the array and returns the new array length
// sort()	Sorts all the elements of the array
// concat()	Joins two arrays and returns the combined result
// indexOf()	Returns the index of the first match of a value in the array (-1 if not found)
// copyWithin()	Copies a sequence of elements within the array
// fill()	Fills the array with a static value from the provided start index to the end index
// shift()	Removes and returns the first element of the array
// splice()	Adds or removes elements from the array
// unshift()	Adds one or more elements to the beginning of the array
// includes()	Checks whether the array contains a certain element
// join()	Joins all elements of the array into a string
// lastIndexOf()	Returns the last index of an element in the array
// slice()	Extracts a section of the array and returns the new array
// toString()	Returns a string representation of the array
// toLocaleString()	Returns a localized string representing the array