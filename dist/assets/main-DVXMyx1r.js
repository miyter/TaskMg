var h_=Object.defineProperty;var f_=(n,t,e)=>t in n?h_(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var B=(n,t,e)=>f_(n,typeof t!="symbol"?t+"":t,e);import{getAuth as g_,onAuthStateChanged as p_}from"https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";import{getFirestore as tp,collection as Pn,query as nr,orderBy as ep,onSnapshot as ta,getDocs as m_,limit as y_,serverTimestamp as np,addDoc as Sc,deleteDoc as Pc,doc as sr,setDoc as __,updateDoc as b_}from"https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var rh={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp=function(n){const t=[];let e=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?t[e++]=i:i<2048?(t[e++]=i>>6|192,t[e++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),t[e++]=i>>18|240,t[e++]=i>>12&63|128,t[e++]=i>>6&63|128,t[e++]=i&63|128):(t[e++]=i>>12|224,t[e++]=i>>6&63|128,t[e++]=i&63|128)}return t},v_=function(n){const t=[];let e=0,s=0;for(;e<n.length;){const i=n[e++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[e++];t[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[e++],o=n[e++],a=n[e++],l=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;t[s++]=String.fromCharCode(55296+(l>>10)),t[s++]=String.fromCharCode(56320+(l&1023))}else{const r=n[e++],o=n[e++];t[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return t.join("")},ip={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,a=o?n[i+1]:0,l=i+2<n.length,c=l?n[i+2]:0,d=r>>2,h=(r&3)<<4|a>>4;let g=(a&15)<<2|c>>6,m=c&63;l||(m=64,o||(g=64)),s.push(e[d],e[h],e[g],e[m])}return s.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(sp(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):v_(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=e[n.charAt(i++)],a=i<n.length?e[n.charAt(i)]:0;++i;const c=i<n.length?e[n.charAt(i)]:64;++i;const h=i<n.length?e[n.charAt(i)]:64;if(++i,r==null||a==null||c==null||h==null)throw new w_;const g=r<<2|a>>4;if(s.push(g),c!==64){const m=a<<4&240|c>>2;if(s.push(m),h!==64){const y=c<<6&192|h;s.push(y)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class w_ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const x_=function(n){const t=sp(n);return ip.encodeByteArray(t,!0)},Ao=function(n){return x_(n).replace(/\./g,"")},rp=function(n){try{return ip.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E_=()=>k_().__FIREBASE_DEFAULTS__,I_=()=>{if(typeof process>"u"||typeof rh>"u")return;const n=rh.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},T_=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&rp(n[1]);return t&&JSON.parse(t)},ea=()=>{try{return E_()||I_()||T_()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},op=n=>{var t,e;return(e=(t=ea())===null||t===void 0?void 0:t.emulatorHosts)===null||e===void 0?void 0:e[n]},A_=n=>{const t=op(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const s=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),s]:[t.substring(0,e),s]},ap=()=>{var n;return(n=ea())===null||n===void 0?void 0:n.config},lp=n=>{var t;return(t=ea())===null||t===void 0?void 0:t[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,s)=>{e?this.reject(e):this.resolve(s),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,s))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},s=t||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ao(JSON.stringify(e)),Ao(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function C_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Kt())}function R_(){var n;const t=(n=ea())===null||n===void 0?void 0:n.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function D_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function M_(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function L_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function O_(){const n=Kt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function V_(){return!R_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function N_(){try{return typeof indexedDB=="object"}catch{return!1}}function F_(){return new Promise((n,t)=>{try{let e=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),e||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{e=!1},i.onerror=()=>{var r;t(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B_="FirebaseError";class Xe extends Error{constructor(t,e,s){super(e),this.code=t,this.customData=s,this.name=B_,Object.setPrototypeOf(this,Xe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ir.prototype.create)}}class ir{constructor(t,e,s){this.service=t,this.serviceName=e,this.errors=s}create(t,...e){const s=e[0]||{},i=`${this.service}/${t}`,r=this.errors[t],o=r?j_(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new Xe(i,a,s)}}function j_(n,t){return n.replace(U_,(e,s)=>{const i=t[s];return i!=null?String(i):`<${s}?>`})}const U_=/\{\$([^}]+)}/g;function z_(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function So(n,t){if(n===t)return!0;const e=Object.keys(n),s=Object.keys(t);for(const i of e){if(!s.includes(i))return!1;const r=n[i],o=t[i];if(oh(r)&&oh(o)){if(!So(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!e.includes(i))return!1;return!0}function oh(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(n){const t=[];for(const[e,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(i))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(s));return t.length?"&"+t.join("&"):""}function gi(n){const t={};return n.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[i,r]=s.split("=");t[decodeURIComponent(i)]=decodeURIComponent(r)}}),t}function pi(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function $_(n,t){const e=new H_(n,t);return e.subscribe.bind(e)}class H_{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(s=>{this.error(s)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,s){let i;if(t===void 0&&e===void 0&&s===void 0)throw new Error("Missing Observer.");W_(t,["next","error","complete"])?i=t:i={next:t,error:e,complete:s},i.next===void 0&&(i.next=Za),i.error===void 0&&(i.error=Za),i.complete===void 0&&(i.complete=Za);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function W_(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Za(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(n){return n&&n._delegate?n._delegate:n}class Kn{constructor(t,e,s){this.name=t,this.instanceFactory=e,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const s=new S_;if(this.instancesDeferred.set(e,s),this.isInitialized(e)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:e});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const s=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),i=(e=t==null?void 0:t.optional)!==null&&e!==void 0?e:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(K_(t))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[e,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(e);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(t=jn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=jn){return this.instances.has(t)}getOptions(t=jn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,s=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:e});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(t,e){var s;const i=this.normalizeInstanceIdentifier(e),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(t),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&t(o,i),()=>{r.delete(t)}}invokeOnInitCallbacks(t,e){const s=this.onInitCallbacks.get(e);if(s)for(const i of s)try{i(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let s=this.instances.get(t);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:G_(t),options:e}),this.instances.set(t,s),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(s,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,s)}catch{}return s||null}normalizeInstanceIdentifier(t=jn){return this.component?this.component.multipleInstances?t:jn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function G_(n){return n===jn?void 0:n}function K_(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new q_(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(J||(J={}));const Q_={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},X_=J.INFO,J_={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},Z_=(n,t,...e)=>{if(t<n.logLevel)return;const s=new Date().toISOString(),i=J_[t];if(i)console[i](`[${s}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Cc{constructor(t){this.name=t,this._logLevel=X_,this._logHandler=Z_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in J))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Q_[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...t),this._logHandler(this,J.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...t),this._logHandler(this,J.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,J.INFO,...t),this._logHandler(this,J.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,J.WARN,...t),this._logHandler(this,J.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...t),this._logHandler(this,J.ERROR,...t)}}const tb=(n,t)=>t.some(e=>n instanceof e);let ah,lh;function eb(){return ah||(ah=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function nb(){return lh||(lh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const cp=new WeakMap,Rl=new WeakMap,up=new WeakMap,tl=new WeakMap,Rc=new WeakMap;function sb(n){const t=new Promise((e,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{e(mn(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return t.then(e=>{e instanceof IDBCursor&&cp.set(e,n)}).catch(()=>{}),Rc.set(t,n),t}function ib(n){if(Rl.has(n))return;const t=new Promise((e,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{e(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Rl.set(n,t)}let Dl={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return Rl.get(n);if(t==="objectStoreNames")return n.objectStoreNames||up.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return mn(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function rb(n){Dl=n(Dl)}function ob(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const s=n.call(el(this),t,...e);return up.set(s,t.sort?t.sort():[t]),mn(s)}:nb().includes(n)?function(...t){return n.apply(el(this),t),mn(cp.get(this))}:function(...t){return mn(n.apply(el(this),t))}}function ab(n){return typeof n=="function"?ob(n):(n instanceof IDBTransaction&&ib(n),tb(n,eb())?new Proxy(n,Dl):n)}function mn(n){if(n instanceof IDBRequest)return sb(n);if(tl.has(n))return tl.get(n);const t=ab(n);return t!==n&&(tl.set(n,t),Rc.set(t,n)),t}const el=n=>Rc.get(n);function lb(n,t,{blocked:e,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,t),a=mn(o);return s&&o.addEventListener("upgradeneeded",l=>{s(mn(o.result),l.oldVersion,l.newVersion,mn(o.transaction),l)}),e&&o.addEventListener("blocked",l=>e(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const cb=["get","getKey","getAll","getAllKeys","count"],ub=["put","add","delete","clear"],nl=new Map;function ch(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(nl.get(t))return nl.get(t);const e=t.replace(/FromIndex$/,""),s=t!==e,i=ub.includes(e);if(!(e in(s?IDBIndex:IDBObjectStore).prototype)||!(i||cb.includes(e)))return;const r=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let c=l.store;return s&&(c=c.index(a.shift())),(await Promise.all([c[e](...a),i&&l.done]))[0]};return nl.set(t,r),r}rb(n=>({...n,get:(t,e,s)=>ch(t,e)||n.get(t,e,s),has:(t,e)=>!!ch(t,e)||n.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class db{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(hb(e)){const s=e.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(e=>e).join(" ")}}function hb(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Ml="@firebase/app",uh="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ge=new Cc("@firebase/app"),fb="@firebase/app-compat",gb="@firebase/analytics-compat",pb="@firebase/analytics",mb="@firebase/app-check-compat",yb="@firebase/app-check",_b="@firebase/auth",bb="@firebase/auth-compat",vb="@firebase/database",wb="@firebase/data-connect",xb="@firebase/database-compat",kb="@firebase/functions",Eb="@firebase/functions-compat",Ib="@firebase/installations",Tb="@firebase/installations-compat",Ab="@firebase/messaging",Sb="@firebase/messaging-compat",Pb="@firebase/performance",Cb="@firebase/performance-compat",Rb="@firebase/remote-config",Db="@firebase/remote-config-compat",Mb="@firebase/storage",Lb="@firebase/storage-compat",Ob="@firebase/firestore",Vb="@firebase/vertexai-preview",Nb="@firebase/firestore-compat",Fb="firebase",Bb="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll="[DEFAULT]",jb={[Ml]:"fire-core",[fb]:"fire-core-compat",[pb]:"fire-analytics",[gb]:"fire-analytics-compat",[yb]:"fire-app-check",[mb]:"fire-app-check-compat",[_b]:"fire-auth",[bb]:"fire-auth-compat",[vb]:"fire-rtdb",[wb]:"fire-data-connect",[xb]:"fire-rtdb-compat",[kb]:"fire-fn",[Eb]:"fire-fn-compat",[Ib]:"fire-iid",[Tb]:"fire-iid-compat",[Ab]:"fire-fcm",[Sb]:"fire-fcm-compat",[Pb]:"fire-perf",[Cb]:"fire-perf-compat",[Rb]:"fire-rc",[Db]:"fire-rc-compat",[Mb]:"fire-gcs",[Lb]:"fire-gcs-compat",[Ob]:"fire-fst",[Nb]:"fire-fst-compat",[Vb]:"fire-vertex","fire-js":"fire-js",[Fb]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Po=new Map,Ub=new Map,Ol=new Map;function dh(n,t){try{n.container.addComponent(t)}catch(e){Ge.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Ts(n){const t=n.name;if(Ol.has(t))return Ge.debug(`There were multiple attempts to register component ${t}.`),!1;Ol.set(t,n);for(const e of Po.values())dh(e,n);for(const e of Ub.values())dh(e,n);return!0}function Dc(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function Be(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zb={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},yn=new ir("app","Firebase",zb);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $b{constructor(t,e,s){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Kn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw yn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js=Bb;function dp(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const s=Object.assign({name:Ll,automaticDataCollectionEnabled:!1},t),i=s.name;if(typeof i!="string"||!i)throw yn.create("bad-app-name",{appName:String(i)});if(e||(e=ap()),!e)throw yn.create("no-options");const r=Po.get(i);if(r){if(So(e,r.options)&&So(s,r.config))return r;throw yn.create("duplicate-app",{appName:i})}const o=new Y_(i);for(const l of Ol.values())o.addComponent(l);const a=new $b(e,s,o);return Po.set(i,a),a}function hp(n=Ll){const t=Po.get(n);if(!t&&n===Ll&&ap())return dp();if(!t)throw yn.create("no-app",{appName:n});return t}function _n(n,t,e){var s;let i=(s=jb[n])!==null&&s!==void 0?s:n;e&&(i+=`-${e}`);const r=i.match(/\s|\//),o=t.match(/\s|\//);if(r||o){const a=[`Unable to register library "${i}" with version "${t}":`];r&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Ge.warn(a.join(" "));return}Ts(new Kn(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hb="firebase-heartbeat-database",Wb=1,Fi="firebase-heartbeat-store";let sl=null;function fp(){return sl||(sl=lb(Hb,Wb,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Fi)}catch(e){console.warn(e)}}}}).catch(n=>{throw yn.create("idb-open",{originalErrorMessage:n.message})})),sl}async function qb(n){try{const e=(await fp()).transaction(Fi),s=await e.objectStore(Fi).get(gp(n));return await e.done,s}catch(t){if(t instanceof Xe)Ge.warn(t.message);else{const e=yn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Ge.warn(e.message)}}}async function hh(n,t){try{const s=(await fp()).transaction(Fi,"readwrite");await s.objectStore(Fi).put(t,gp(n)),await s.done}catch(e){if(e instanceof Xe)Ge.warn(e.message);else{const s=yn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Ge.warn(s.message)}}}function gp(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gb=1024,Kb=30*24*60*60*1e3;class Yb{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Xb(e),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var t,e;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=fh();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=Kb}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Ge.warn(s)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=fh(),{heartbeatsToSend:s,unsentEntries:i}=Qb(this._heartbeatsCache.heartbeats),r=Ao(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return Ge.warn(e),""}}}function fh(){return new Date().toISOString().substring(0,10)}function Qb(n,t=Gb){const e=[];let s=n.slice();for(const i of n){const r=e.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),gh(e)>t){r.dates.pop();break}}else if(e.push({agent:i.agent,dates:[i.date]}),gh(e)>t){e.pop();break}s=s.slice(1)}return{heartbeatsToSend:e,unsentEntries:s}}class Xb{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return N_()?F_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await qb(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const i=await this.read();return hh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:i.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const i=await this.read();return hh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...t.heartbeats]})}else return}}function gh(n){return Ao(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jb(n){Ts(new Kn("platform-logger",t=>new db(t),"PRIVATE")),Ts(new Kn("heartbeat",t=>new Yb(t),"PRIVATE")),_n(Ml,uh,n),_n(Ml,uh,"esm2017"),_n("fire-js","")}Jb("");var Zb="firebase",tv="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_n(Zb,tv,"app");function Mc(n,t){var e={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&t.indexOf(s)<0&&(e[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(n);i<s.length;i++)t.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(n,s[i])&&(e[s[i]]=n[s[i]]);return e}function pp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ev=pp,mp=new ir("auth","Firebase",pp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co=new Cc("@firebase/auth");function nv(n,...t){Co.logLevel<=J.WARN&&Co.warn(`Auth (${js}): ${n}`,...t)}function ro(n,...t){Co.logLevel<=J.ERROR&&Co.error(`Auth (${js}): ${n}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(n,...t){throw Lc(n,...t)}function ke(n,...t){return Lc(n,...t)}function yp(n,t,e){const s=Object.assign(Object.assign({},ev()),{[t]:e});return new ir("auth","Firebase",s).create(t,{appName:n.name})}function bn(n){return yp(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Lc(n,...t){if(typeof n!="string"){const e=t[0],s=[...t.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(e,...s)}return mp.create(n,...t)}function $(n,t,...e){if(!n)throw Lc(t,...e)}function je(n){const t="INTERNAL ASSERTION FAILED: "+n;throw ro(t),new Error(t)}function Ke(n,t){n||je(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function sv(){return ph()==="http:"||ph()==="https:"}function ph(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(sv()||M_()||"connection"in navigator)?navigator.onLine:!0}function rv(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(t,e){this.shortDelay=t,this.longDelay=e,Ke(e>t,"Short delay should be less than long delay!"),this.isMobile=C_()||L_()}get(){return iv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oc(n,t){Ke(n.emulator,"Emulator should always be set here");const{url:e}=n.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{static initialize(t,e,s){this.fetchImpl=t,e&&(this.headersImpl=e),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;je("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;je("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;je("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ov={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av=new or(3e4,6e4);function ts(n,t){return n.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:n.tenantId}):t}async function Je(n,t,e,s,i={}){return bp(n,i,async()=>{let r={},o={};s&&(t==="GET"?o=s:r={body:JSON.stringify(s)});const a=rr(Object.assign({key:n.config.apiKey},o)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const c=Object.assign({method:t,headers:l},r);return D_()||(c.referrerPolicy="no-referrer"),_p.fetch()(vp(n,n.config.apiHost,e,a),c)})}async function bp(n,t,e){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},ov),t);try{const i=new cv(n),r=await Promise.race([e(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Br(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const a=r.ok?o.errorMessage:o.error.message,[l,c]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Br(n,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw Br(n,"email-already-in-use",o);if(l==="USER_DISABLED")throw Br(n,"user-disabled",o);const d=s[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw yp(n,d,c);ye(n,d)}}catch(i){if(i instanceof Xe)throw i;ye(n,"network-request-failed",{message:String(i)})}}async function na(n,t,e,s,i={}){const r=await Je(n,t,e,s,i);return"mfaPendingCredential"in r&&ye(n,"multi-factor-auth-required",{_serverResponse:r}),r}function vp(n,t,e,s){const i=`${t}${e}?${s}`;return n.config.emulator?Oc(n.config,i):`${n.config.apiScheme}://${i}`}function lv(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class cv{constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,s)=>{this.timer=setTimeout(()=>s(ke(this.auth,"network-request-failed")),av.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Br(n,t,e){const s={appName:n.name};e.email&&(s.email=e.email),e.phoneNumber&&(s.phoneNumber=e.phoneNumber);const i=ke(n,t,s);return i.customData._tokenResponse=e,i}function mh(n){return n!==void 0&&n.enterprise!==void 0}class uv{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return lv(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}}async function dv(n,t){return Je(n,"GET","/v2/recaptchaConfig",ts(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hv(n,t){return Je(n,"POST","/v1/accounts:delete",t)}async function wp(n,t){return Je(n,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(n){if(n)try{const t=new Date(Number(n));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function fv(n,t=!1){const e=Pt(n),s=await e.getIdToken(t),i=Vc(s);$(i&&i.exp&&i.auth_time&&i.iat,e.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:Ai(il(i.auth_time)),issuedAtTime:Ai(il(i.iat)),expirationTime:Ai(il(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function il(n){return Number(n)*1e3}function Vc(n){const[t,e,s]=n.split(".");if(t===void 0||e===void 0||s===void 0)return ro("JWT malformed, contained fewer than 3 sections"),null;try{const i=rp(e);return i?JSON.parse(i):(ro("Failed to decode base64 JWT payload"),null)}catch(i){return ro("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function yh(n){const t=Vc(n);return $(t,"internal-error"),$(typeof t.exp<"u","internal-error"),$(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function As(n,t,e=!1){if(e)return t;try{return await t}catch(s){throw s instanceof Xe&&gv(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function gv({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pv{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const i=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ai(this.lastLoginAt),this.creationTime=Ai(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ro(n){var t;const e=n.auth,s=await n.getIdToken(),i=await As(n,wp(e,{idToken:s}));$(i==null?void 0:i.users.length,e,"internal-error");const r=i.users[0];n._notifyReloadListener(r);const o=!((t=r.providerUserInfo)===null||t===void 0)&&t.length?xp(r.providerUserInfo):[],a=yv(n.providerData,o),l=n.isAnonymous,c=!(n.email&&r.passwordHash)&&!(a!=null&&a.length),d=l?c:!1,h={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new Nl(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,h)}async function mv(n){const t=Pt(n);await Ro(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function yv(n,t){return[...n.filter(s=>!t.some(i=>i.providerId===s.providerId)),...t]}function xp(n){return n.map(t=>{var{providerId:e}=t,s=Mc(t,["providerId"]);return{providerId:e,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _v(n,t){const e=await bp(n,{},async()=>{const s=rr({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:i,apiKey:r}=n.config,o=vp(n,i,"/v1/token",`key=${r}`),a=await n._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",_p.fetch()(o,{method:"POST",headers:a,body:s})});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function bv(n,t){return Je(n,"POST","/v2/accounts:revokeToken",ts(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){$(t.idToken,"internal-error"),$(typeof t.idToken<"u","internal-error"),$(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):yh(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){$(t.length!==0,"internal-error");const e=yh(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:($(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:s,refreshToken:i,expiresIn:r}=await _v(t,e);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(t,e,s){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(t,e){const{refreshToken:s,accessToken:i,expirationTime:r}=e,o=new bs;return s&&($(typeof s=="string","internal-error",{appName:t}),o.refreshToken=s),i&&($(typeof i=="string","internal-error",{appName:t}),o.accessToken=i),r&&($(typeof r=="number","internal-error",{appName:t}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new bs,this.toJSON())}_performRefresh(){return je("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nn(n,t){$(typeof n=="string"||typeof n>"u","internal-error",{appName:t})}class Ue{constructor(t){var{uid:e,auth:s,stsTokenManager:i}=t,r=Mc(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new pv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Nl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(t){const e=await As(this,this.stsTokenManager.getToken(this.auth,t));return $(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return fv(this,t)}reload(){return mv(this)}_assign(t){this!==t&&($(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Ue(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){$(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let s=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),s=!0),e&&await Ro(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Be(this.auth.app))return Promise.reject(bn(this.auth));const t=await this.getIdToken();return await As(this,hv(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var s,i,r,o,a,l,c,d;const h=(s=e.displayName)!==null&&s!==void 0?s:void 0,g=(i=e.email)!==null&&i!==void 0?i:void 0,m=(r=e.phoneNumber)!==null&&r!==void 0?r:void 0,y=(o=e.photoURL)!==null&&o!==void 0?o:void 0,_=(a=e.tenantId)!==null&&a!==void 0?a:void 0,w=(l=e._redirectEventId)!==null&&l!==void 0?l:void 0,A=(c=e.createdAt)!==null&&c!==void 0?c:void 0,P=(d=e.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:D,emailVerified:L,isAnonymous:M,providerData:V,stsTokenManager:k}=e;$(D&&k,t,"internal-error");const v=bs.fromJSON(this.name,k);$(typeof D=="string",t,"internal-error"),nn(h,t.name),nn(g,t.name),$(typeof L=="boolean",t,"internal-error"),$(typeof M=="boolean",t,"internal-error"),nn(m,t.name),nn(y,t.name),nn(_,t.name),nn(w,t.name),nn(A,t.name),nn(P,t.name);const x=new Ue({uid:D,auth:t,email:g,emailVerified:L,displayName:h,isAnonymous:M,photoURL:y,phoneNumber:m,tenantId:_,stsTokenManager:v,createdAt:A,lastLoginAt:P});return V&&Array.isArray(V)&&(x.providerData=V.map(I=>Object.assign({},I))),w&&(x._redirectEventId=w),x}static async _fromIdTokenResponse(t,e,s=!1){const i=new bs;i.updateFromServerResponse(e);const r=new Ue({uid:e.localId,auth:t,stsTokenManager:i,isAnonymous:s});return await Ro(r),r}static async _fromGetAccountInfoResponse(t,e,s){const i=e.users[0];$(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?xp(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),a=new bs;a.updateFromIdToken(s);const l=new Ue({uid:i.localId,auth:t,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new Nl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=new Map;function ze(n){Ke(n instanceof Function,"Expected a class definition");let t=_h.get(n);return t?(Ke(t instanceof n,"Instance stored in cache mismatched with class"),t):(t=new n,_h.set(n,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}kp.type="NONE";const bh=kp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oo(n,t,e){return`firebase:${n}:${t}:${e}`}class vs{constructor(t,e,s){this.persistence=t,this.auth=e,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=oo(this.userKey,i.apiKey,r),this.fullPersistenceKey=oo("persistence",i.apiKey,r),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);return t?Ue._fromJSON(this.auth,t):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,s="authUser"){if(!e.length)return new vs(ze(bh),t,s);const i=(await Promise.all(e.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let r=i[0]||ze(bh);const o=oo(s,t.config.apiKey,t.name);let a=null;for(const c of e)try{const d=await c._get(o);if(d){const h=Ue._fromJSON(t,d);c!==r&&(a=h),r=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!r._shouldAllowMigration||!l.length?new vs(r,t,s):(r=l[0],a&&await r._set(o,a.toJSON()),await Promise.all(e.map(async c=>{if(c!==r)try{await c._remove(o)}catch{}})),new vs(r,t,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vh(n){const t=n.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ap(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Ep(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Pp(t))return"Blackberry";if(Cp(t))return"Webos";if(Ip(t))return"Safari";if((t.includes("chrome/")||Tp(t))&&!t.includes("edge/"))return"Chrome";if(Sp(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(e);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Ep(n=Kt()){return/firefox\//i.test(n)}function Ip(n=Kt()){const t=n.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Tp(n=Kt()){return/crios\//i.test(n)}function Ap(n=Kt()){return/iemobile/i.test(n)}function Sp(n=Kt()){return/android/i.test(n)}function Pp(n=Kt()){return/blackberry/i.test(n)}function Cp(n=Kt()){return/webos/i.test(n)}function Nc(n=Kt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function vv(n=Kt()){var t;return Nc(n)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function wv(){return O_()&&document.documentMode===10}function Rp(n=Kt()){return Nc(n)||Sp(n)||Cp(n)||Pp(n)||/windows phone/i.test(n)||Ap(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dp(n,t=[]){let e;switch(n){case"Browser":e=vh(Kt());break;case"Worker":e=`${vh(Kt())}-${n}`;break;default:e=n}const s=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${js}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const s=r=>new Promise((o,a)=>{try{const l=t(r);o(l)}catch(l){a(l)}});s.onAbort=e,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const s of this.queue)await s(t),s.onAbort&&e.push(s.onAbort)}catch(s){e.reverse();for(const i of e)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kv(n,t={}){return Je(n,"GET","/v2/passwordPolicy",ts(n,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ev=6;class Iv{constructor(t){var e,s,i,r;const o=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=o.minPasswordLength)!==null&&e!==void 0?e:Ev,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(s=t.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(r=t.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,s,i,r,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,l),this.validatePasswordCharacterOptions(t,l),l.isValid&&(l.isValid=(e=l.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),l.isValid&&(l.isValid=(s=l.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(r=l.containsUppercaseLetter)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(t,e){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(e.meetsMinPasswordLength=t.length>=s),i&&(e.meetsMaxPasswordLength=t.length<=i)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let s;for(let i=0;i<t.length;i++)s=t.charAt(i),this.updatePasswordCharacterOptionsStatuses(e,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(t,e,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tv{constructor(t,e,s,i){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new wh(this),this.idTokenSubscription=new wh(this),this.beforeStateQueue=new xv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=mp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=ze(e)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await vs.create(this,t),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await wp(this,{idToken:t}),s=await Ue._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(s)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(Be(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,a=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(t);(!o||o===a)&&(l!=null&&l.user)&&(i=l.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return $(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await Ro(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=rv()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Be(this.app))return Promise.reject(bn(this));const e=t?Pt(t):null;return e&&$(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&$(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Be(this.app)?Promise.reject(bn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Be(this.app)?Promise.reject(bn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ze(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await kv(this),e=new Iv(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(t){this._errorFactory=new ir("auth","Firebase",t())}onAuthStateChanged(t,e,s){return this.registerStateListener(this.authStateSubscription,t,e,s)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,s){return this.registerStateListener(this.idTokenSubscription,t,e,s)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const s=this.onAuthStateChanged(()=>{s(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(s.tenantId=this.tenantId),await bv(this,s)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const s=await this.getOrInitRedirectPersistenceManager(e);return t===null?s.removeCurrentUser():s.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&ze(t)||this._popupRedirectResolver;$(e,this,"argument-error"),this.redirectPersistenceManager=await vs.create(this,[ze(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,s;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,s,i){if(this._deleted)return()=>{};const r=typeof e=="function"?e:e.next.bind(e);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if($(a,this,"internal-error"),a.then(()=>{o||r(this.currentUser)}),typeof e=="function"){const l=t.addObserver(e,s,i);return()=>{o=!0,l()}}else{const l=t.addObserver(e);return()=>{o=!0,l()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return $(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Dp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const s=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());s&&(e["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){var t;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&nv(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Us(n){return Pt(n)}class wh{constructor(t){this.auth=t,this.observer=null,this.addObserver=$_(e=>this.observer=e)}get next(){return $(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Av(n){sa=n}function Mp(n){return sa.loadJS(n)}function Sv(){return sa.recaptchaEnterpriseScript}function Pv(){return sa.gapiScript}function Cv(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Rv="recaptcha-enterprise",Dv="NO_RECAPTCHA";class Mv{constructor(t){this.type=Rv,this.auth=Us(t)}async verify(t="verify",e=!1){async function s(r){if(!e){if(r.tenantId==null&&r._agentRecaptchaConfig!=null)return r._agentRecaptchaConfig.siteKey;if(r.tenantId!=null&&r._tenantRecaptchaConfigs[r.tenantId]!==void 0)return r._tenantRecaptchaConfigs[r.tenantId].siteKey}return new Promise(async(o,a)=>{dv(r,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const c=new uv(l);return r.tenantId==null?r._agentRecaptchaConfig=c:r._tenantRecaptchaConfigs[r.tenantId]=c,o(c.siteKey)}}).catch(l=>{a(l)})})}function i(r,o,a){const l=window.grecaptcha;mh(l)?l.enterprise.ready(()=>{l.enterprise.execute(r,{action:t}).then(c=>{o(c)}).catch(()=>{o(Dv)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((r,o)=>{s(this.auth).then(a=>{if(!e&&mh(window.grecaptcha))i(a,r,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Sv();l.length!==0&&(l+=a),Mp(l).then(()=>{i(a,r,o)}).catch(c=>{o(c)})}}).catch(a=>{o(a)})})}}async function xh(n,t,e,s=!1){const i=new Mv(n);let r;try{r=await i.verify(e)}catch{r=await i.verify(e,!0)}const o=Object.assign({},t);return s?Object.assign(o,{captchaResp:r}):Object.assign(o,{captchaResponse:r}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function kh(n,t,e,s){var i;if(!((i=n._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const r=await xh(n,t,e,e==="getOobCode");return s(n,r)}else return s(n,t).catch(async r=>{if(r.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await xh(n,t,e,e==="getOobCode");return s(n,o)}else return Promise.reject(r)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lv(n,t){const e=Dc(n,"auth");if(e.isInitialized()){const i=e.getImmediate(),r=e.getOptions();if(So(r,t??{}))return i;ye(i,"already-initialized")}return e.initialize({options:t})}function Ov(n,t){const e=(t==null?void 0:t.persistence)||[],s=(Array.isArray(e)?e:[e]).map(ze);t!=null&&t.errorMap&&n._updateErrorMap(t.errorMap),n._initializeWithPersistence(s,t==null?void 0:t.popupRedirectResolver)}function Vv(n,t,e){const s=Us(n);$(s._canInitEmulator,s,"emulator-config-failed"),$(/^https?:\/\//.test(t),s,"invalid-emulator-scheme");const i=!1,r=Lp(t),{host:o,port:a}=Nv(t),l=a===null?"":`:${a}`;s.config.emulator={url:`${r}//${o}${l}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:a,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),Fv()}function Lp(n){const t=n.indexOf(":");return t<0?"":n.substr(0,t+1)}function Nv(n){const t=Lp(n),e=/(\/\/)?([^?#/]+)/.exec(n.substr(t.length));if(!e)return{host:"",port:null};const s=e[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:Eh(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:Eh(o)}}}function Eh(n){if(!n)return null;const t=Number(n);return isNaN(t)?null:t}function Fv(){function n(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return je("not implemented")}_getIdTokenResponse(t){return je("not implemented")}_linkToIdToken(t,e){return je("not implemented")}_getReauthenticationResolver(t){return je("not implemented")}}async function Bv(n,t){return Je(n,"POST","/v1/accounts:update",t)}async function jv(n,t){return Je(n,"POST","/v1/accounts:signUp",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uv(n,t){return na(n,"POST","/v1/accounts:signInWithPassword",ts(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zv(n,t){return na(n,"POST","/v1/accounts:signInWithEmailLink",ts(n,t))}async function $v(n,t){return na(n,"POST","/v1/accounts:signInWithEmailLink",ts(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi extends Fc{constructor(t,e,s,i=null){super("password",s),this._email=t,this._password=e,this._tenantId=i}static _fromEmailAndPassword(t,e){return new Bi(t,e,"password")}static _fromEmailAndCode(t,e,s=null){return new Bi(t,e,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return kh(t,e,"signInWithPassword",Uv);case"emailLink":return zv(t,{email:this._email,oobCode:this._password});default:ye(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const s={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return kh(t,s,"signUpPassword",jv);case"emailLink":return $v(t,{idToken:e,email:this._email,oobCode:this._password});default:ye(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ws(n,t){return na(n,"POST","/v1/accounts:signInWithIdp",ts(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hv="http://localhost";class Yn extends Fc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new Yn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):ye("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:s,signInMethod:i}=e,r=Mc(e,["providerId","signInMethod"]);if(!s||!i)return null;const o=new Yn(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(t){const e=this.buildRequest();return ws(t,e)}_linkToIdToken(t,e){const s=this.buildRequest();return s.idToken=e,ws(t,s)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,ws(t,e)}buildRequest(){const t={requestUri:Hv,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=rr(e)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wv(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function qv(n){const t=gi(pi(n)).link,e=t?gi(pi(t)).deep_link_id:null,s=gi(pi(n)).deep_link_id;return(s?gi(pi(s)).link:null)||s||e||t||n}class Bc{constructor(t){var e,s,i,r,o,a;const l=gi(pi(t)),c=(e=l.apiKey)!==null&&e!==void 0?e:null,d=(s=l.oobCode)!==null&&s!==void 0?s:null,h=Wv((i=l.mode)!==null&&i!==void 0?i:null);$(c&&d&&h,"argument-error"),this.apiKey=c,this.operation=h,this.code=d,this.continueUrl=(r=l.continueUrl)!==null&&r!==void 0?r:null,this.languageCode=(o=l.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=l.tenantId)!==null&&a!==void 0?a:null}static parseLink(t){const e=qv(t);try{return new Bc(e)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(){this.providerId=zs.PROVIDER_ID}static credential(t,e){return Bi._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const s=Bc.parseLink(e);return $(s,"argument-error"),Bi._fromEmailAndCode(t,s.code,s.tenantId)}}zs.PROVIDER_ID="password";zs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";zs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar extends Op{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends ar{constructor(){super("facebook.com")}static credential(t){return Yn._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return sn.credentialFromTaggedObject(t)}static credentialFromError(t){return sn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return sn.credential(t.oauthAccessToken)}catch{return null}}}sn.FACEBOOK_SIGN_IN_METHOD="facebook.com";sn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn extends ar{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return Yn._fromParams({providerId:rn.PROVIDER_ID,signInMethod:rn.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return rn.credentialFromTaggedObject(t)}static credentialFromError(t){return rn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:s}=t;if(!e&&!s)return null;try{return rn.credential(e,s)}catch{return null}}}rn.GOOGLE_SIGN_IN_METHOD="google.com";rn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on extends ar{constructor(){super("github.com")}static credential(t){return Yn._fromParams({providerId:on.PROVIDER_ID,signInMethod:on.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return on.credentialFromTaggedObject(t)}static credentialFromError(t){return on.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return on.credential(t.oauthAccessToken)}catch{return null}}}on.GITHUB_SIGN_IN_METHOD="github.com";on.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an extends ar{constructor(){super("twitter.com")}static credential(t,e){return Yn._fromParams({providerId:an.PROVIDER_ID,signInMethod:an.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return an.credentialFromTaggedObject(t)}static credentialFromError(t){return an.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:s}=t;if(!e||!s)return null;try{return an.credential(e,s)}catch{return null}}}an.TWITTER_SIGN_IN_METHOD="twitter.com";an.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ss{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,s,i=!1){const r=await Ue._fromIdTokenResponse(t,s,i),o=Ih(s);return new Ss({user:r,providerId:o,_tokenResponse:s,operationType:e})}static async _forOperation(t,e,s){await t._updateTokensIfNecessary(s,!0);const i=Ih(s);return new Ss({user:t,providerId:i,_tokenResponse:s,operationType:e})}}function Ih(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do extends Xe{constructor(t,e,s,i){var r;super(e.code,e.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,Do.prototype),this.customData={appName:t.name,tenantId:(r=t.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:e.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(t,e,s,i){return new Do(t,e,s,i)}}function Vp(n,t,e,s){return(t==="reauthenticate"?e._getReauthenticationResolver(n):e._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Do._fromErrorAndOperation(n,r,t,s):r})}async function Gv(n,t,e=!1){const s=await As(n,t._linkToIdToken(n.auth,await n.getIdToken()),e);return Ss._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kv(n,t,e=!1){const{auth:s}=n;if(Be(s.app))return Promise.reject(bn(s));const i="reauthenticate";try{const r=await As(n,Vp(s,i,t,n),e);$(r.idToken,s,"internal-error");const o=Vc(r.idToken);$(o,s,"internal-error");const{sub:a}=o;return $(n.uid===a,s,"user-mismatch"),Ss._forOperation(n,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&ye(s,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Np(n,t,e=!1){if(Be(n.app))return Promise.reject(bn(n));const s="signIn",i=await Vp(n,s,t),r=await Ss._fromIdTokenResponse(n,s,i);return e||await n._updateCurrentUser(r.user),r}async function Yv(n,t){return Np(Us(n),t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qv(n){const t=Us(n);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}function Xv(n,t,e){return Be(n.app)?Promise.reject(bn(n)):Yv(Pt(n),zs.credential(t,e)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&Qv(n),s})}function Jv(n,t){return Zv(Pt(n),null,t)}async function Zv(n,t,e){const{auth:s}=n,r={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(r.password=e);const o=await As(n,Bv(s,r));await n._updateTokensIfNecessary(o,!0)}function tw(n,t,e,s){return Pt(n).onIdTokenChanged(t,e,s)}function ew(n,t,e){return Pt(n).beforeAuthStateChanged(t,e)}function Fp(n){return Pt(n).signOut()}const Mo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bp{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(Mo,"1"),this.storage.removeItem(Mo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nw=1e3,sw=10;class jp extends Bp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Rp(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const s=this.storage.getItem(e),i=this.localCache[e];s!==i&&t(e,i,s)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const s=t.key;e?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!e&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);wv()&&r!==t.newValue&&t.newValue!==t.oldValue?setTimeout(i,sw):i()}notifyListeners(t,e){this.localCache[t]=e;const s=this.listeners[t];if(s)for(const i of Array.from(s))i(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:s}),!0)})},nw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}jp.type="LOCAL";const iw=jp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Up extends Bp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}Up.type="SESSION";const zp=Up;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rw(n){return Promise.all(n.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(i=>i.isListeningto(t));if(e)return e;const s=new ia(t);return this.receivers.push(s),s}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:s,eventType:i,data:r}=e.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;e.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const a=Array.from(o).map(async c=>c(e.origin,r)),l=await rw(a);e.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:l})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ia.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(n="",t=10){let e="";for(let s=0;s<t;s++)e+=Math.floor(Math.random()*10);return n+e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ow{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((a,l)=>{const c=jc("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(g.data.response);break;default:clearTimeout(d),clearTimeout(r),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:t,eventId:c,data:e},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(){return window}function aw(n){Ee().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $p(){return typeof Ee().WorkerGlobalScope<"u"&&typeof Ee().importScripts=="function"}async function lw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function cw(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function uw(){return $p()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hp="firebaseLocalStorageDb",dw=1,Lo="firebaseLocalStorage",Wp="fbase_key";class lr{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function ra(n,t){return n.transaction([Lo],t?"readwrite":"readonly").objectStore(Lo)}function hw(){const n=indexedDB.deleteDatabase(Hp);return new lr(n).toPromise()}function Fl(){const n=indexedDB.open(Hp,dw);return new Promise((t,e)=>{n.addEventListener("error",()=>{e(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Lo,{keyPath:Wp})}catch(i){e(i)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Lo)?t(s):(s.close(),await hw(),t(await Fl()))})})}async function Th(n,t,e){const s=ra(n,!0).put({[Wp]:t,value:e});return new lr(s).toPromise()}async function fw(n,t){const e=ra(n,!1).get(t),s=await new lr(e).toPromise();return s===void 0?null:s.value}function Ah(n,t){const e=ra(n,!0).delete(t);return new lr(e).toPromise()}const gw=800,pw=3;class qp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Fl(),this.db)}async _withRetries(t){let e=0;for(;;)try{const s=await this._openDb();return await t(s)}catch(s){if(e++>pw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return $p()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ia._getInstance(uw()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var t,e;if(this.activeServiceWorker=await lw(),!this.activeServiceWorker)return;this.sender=new ow(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((t=s[0])===null||t===void 0)&&t.fulfilled&&!((e=s[0])===null||e===void 0)&&e.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||cw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await Fl();return await Th(t,Mo,"1"),await Ah(t,Mo),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(s=>Th(s,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(s=>fw(s,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>Ah(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(i=>{const r=ra(i,!1).getAll();return new lr(r).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],s=new Set;if(t.length!==0)for(const{fbase_key:i,value:r}of t)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),e.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),e.push(i));return e}notifyListeners(t,e){this.localCache[t]=e;const s=this.listeners[t];if(s)for(const i of Array.from(s))i(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),gw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}qp.type="LOCAL";const mw=qp;new or(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yw(n,t){return t?ze(t):($(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc extends Fc{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return ws(t,this._buildIdpRequest())}_linkToIdToken(t,e){return ws(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return ws(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function _w(n){return Np(n.auth,new Uc(n),n.bypassAuthState)}function bw(n){const{auth:t,user:e}=n;return $(e,t,"internal-error"),Kv(e,new Uc(n),n.bypassAuthState)}async function vw(n){const{auth:t,user:e}=n;return $(e,t,"internal-error"),Gv(e,new Uc(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(t,e,s,i,r=!1){this.auth=t,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:s,postBody:i,tenantId:r,error:o,type:a}=t;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:e,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(c){this.reject(c)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return _w;case"linkViaPopup":case"linkViaRedirect":return vw;case"reauthViaPopup":case"reauthViaRedirect":return bw;default:ye(this.auth,"internal-error")}}resolve(t){Ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){Ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ww=new or(2e3,1e4);class ys extends Gp{constructor(t,e,s,i,r){super(t,e,i,r),this.provider=s,this.authWindow=null,this.pollId=null,ys.currentPopupAction&&ys.currentPopupAction.cancel(),ys.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return $(t,this.auth,"internal-error"),t}async onExecution(){Ke(this.filter.length===1,"Popup operations only handle one event");const t=jc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(ke(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(ke(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ys.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,s;if(!((s=(e=this.authWindow)===null||e===void 0?void 0:e.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ke(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,ww.get())};t()}}ys.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xw="pendingRedirect",ao=new Map;class kw extends Gp{constructor(t,e,s=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,s),this.eventId=null}async execute(){let t=ao.get(this.auth._key());if(!t){try{const s=await Ew(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(s)}catch(e){t=()=>Promise.reject(e)}ao.set(this.auth._key(),t)}return this.bypassAuthState||ao.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ew(n,t){const e=Aw(t),s=Tw(n);if(!await s._isAvailable())return!1;const i=await s._get(e)==="true";return await s._remove(e),i}function Iw(n,t){ao.set(n._key(),t)}function Tw(n){return ze(n._redirectPersistence)}function Aw(n){return oo(xw,n.config.apiKey,n.name)}async function Sw(n,t,e=!1){if(Be(n.app))return Promise.reject(bn(n));const s=Us(n),i=yw(s,t),o=await new kw(s,i,e).execute();return o&&!e&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,t)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pw=10*60*1e3;class Cw{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(t,s)&&(e=!0,this.sendToConsumer(t,s),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!Rw(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var s;if(t.error&&!Kp(t)){const i=((s=t.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";e.onError(ke(this.auth,i))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const s=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&s}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=Pw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Sh(t))}saveEventToCache(t){this.cachedEventUids.add(Sh(t)),this.lastProcessedEventTime=Date.now()}}function Sh(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(t=>t).join("-")}function Kp({type:n,error:t}){return n==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function Rw(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Kp(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dw(n,t={}){return Je(n,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Lw=/^https?/;async function Ow(n){if(n.config.emulator)return;const{authorizedDomains:t}=await Dw(n);for(const e of t)try{if(Vw(e))return}catch{}ye(n,"unauthorized-domain")}function Vw(n){const t=Vl(),{protocol:e,hostname:s}=new URL(t);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&s===""?e==="chrome-extension:"&&n.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&o.hostname===s}if(!Lw.test(e))return!1;if(Mw.test(n))return s===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw=new or(3e4,6e4);function Ph(){const n=Ee().___jsl;if(n!=null&&n.H){for(const t of Object.keys(n.H))if(n.H[t].r=n.H[t].r||[],n.H[t].L=n.H[t].L||[],n.H[t].r=[...n.H[t].L],n.CP)for(let e=0;e<n.CP.length;e++)n.CP[e]=null}}function Fw(n){return new Promise((t,e)=>{var s,i,r;function o(){Ph(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Ph(),e(ke(n,"network-request-failed"))},timeout:Nw.get()})}if(!((i=(s=Ee().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)t(gapi.iframes.getContext());else if(!((r=Ee().gapi)===null||r===void 0)&&r.load)o();else{const a=Cv("iframefcb");return Ee()[a]=()=>{gapi.load?o():e(ke(n,"network-request-failed"))},Mp(`${Pv()}?onload=${a}`).catch(l=>e(l))}}).catch(t=>{throw lo=null,t})}let lo=null;function Bw(n){return lo=lo||Fw(n),lo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jw=new or(5e3,15e3),Uw="__/auth/iframe",zw="emulator/auth/iframe",$w={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Hw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ww(n){const t=n.config;$(t.authDomain,n,"auth-domain-config-required");const e=t.emulator?Oc(t,zw):`https://${n.config.authDomain}/${Uw}`,s={apiKey:t.apiKey,appName:n.name,v:js},i=Hw.get(n.config.apiHost);i&&(s.eid=i);const r=n._getFrameworks();return r.length&&(s.fw=r.join(",")),`${e}?${rr(s).slice(1)}`}async function qw(n){const t=await Bw(n),e=Ee().gapi;return $(e,n,"internal-error"),t.open({where:document.body,url:Ww(n),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:$w,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=ke(n,"network-request-failed"),a=Ee().setTimeout(()=>{r(o)},jw.get());function l(){Ee().clearTimeout(a),i(s)}s.ping(l).then(l,()=>{r(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Kw=500,Yw=600,Qw="_blank",Xw="http://localhost";class Ch{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Jw(n,t,e,s=Kw,i=Yw){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let a="";const l=Object.assign(Object.assign({},Gw),{width:s.toString(),height:i.toString(),top:r,left:o}),c=Kt().toLowerCase();e&&(a=Tp(c)?Qw:e),Ep(c)&&(t=t||Xw,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[m,y])=>`${g}${m}=${y},`,"");if(vv(c)&&a!=="_self")return Zw(t||"",a),new Ch(null);const h=window.open(t||"",a,d);$(h,n,"popup-blocked");try{h.focus()}catch{}return new Ch(h)}function Zw(n,t){const e=document.createElement("a");e.href=n,e.target=t;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tx="__/auth/handler",ex="emulator/auth/handler",nx=encodeURIComponent("fac");async function Rh(n,t,e,s,i,r){$(n.config.authDomain,n,"auth-domain-config-required"),$(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:e,redirectUrl:s,v:js,eventId:i};if(t instanceof Op){t.setDefaultLanguage(n.languageCode),o.providerId=t.providerId||"",z_(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[d,h]of Object.entries({}))o[d]=h}if(t instanceof ar){const d=t.getScopes().filter(h=>h!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const d of Object.keys(a))a[d]===void 0&&delete a[d];const l=await n._getAppCheckToken(),c=l?`#${nx}=${encodeURIComponent(l)}`:"";return`${sx(n)}?${rr(a).slice(1)}${c}`}function sx({config:n}){return n.emulator?Oc(n,ex):`https://${n.authDomain}/${tx}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl="webStorageSupport";class ix{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=zp,this._completeRedirectFn=Sw,this._overrideRedirectResult=Iw}async _openPopup(t,e,s,i){var r;Ke((r=this.eventManagers[t._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await Rh(t,e,s,Vl(),i);return Jw(t,o,jc())}async _openRedirect(t,e,s,i){await this._originValidation(t);const r=await Rh(t,e,s,Vl(),i);return aw(r),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:i,promise:r}=this.eventManagers[e];return i?Promise.resolve(i):(Ke(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(t);return this.eventManagers[e]={promise:s},s.catch(()=>{delete this.eventManagers[e]}),s}async initAndGetManager(t){const e=await qw(t),s=new Cw(t);return e.register("authEvent",i=>($(i==null?void 0:i.authEvent,t,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:s},this.iframes[t._key()]=e,s}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(rl,{type:rl},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[rl];o!==void 0&&e(!!o),ye(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=Ow(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Rp()||Ip()||Nc()}}const rx=ix;var Dh="@firebase/auth",Mh="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ox{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(s=>{t((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){$(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ax(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function lx(n){Ts(new Kn("auth",(t,{options:e})=>{const s=t.getProvider("app").getImmediate(),i=t.getProvider("heartbeat"),r=t.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=s.options;$(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const l={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Dp(n)},c=new Tv(s,i,r,l);return Ov(c,e),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,s)=>{t.getProvider("auth-internal").initialize()})),Ts(new Kn("auth-internal",t=>{const e=Us(t.getProvider("auth").getImmediate());return(s=>new ox(s))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),_n(Dh,Mh,ax(n)),_n(Dh,Mh,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cx=5*60,ux=lp("authIdTokenMaxAge")||cx;let Lh=null;const dx=n=>async t=>{const e=t&&await t.getIdTokenResult(),s=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(s&&s>ux)return;const i=e==null?void 0:e.token;Lh!==i&&(Lh=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function hx(n=hp()){const t=Dc(n,"auth");if(t.isInitialized())return t.getImmediate();const e=Lv(n,{popupRedirectResolver:rx,persistence:[mw,iw,zp]}),s=lp("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=dx(r.toString());ew(e,o,()=>o(e.currentUser)),tw(e,a=>o(a))}}const i=op("auth");return i&&Vv(e,`http://${i}`),e}function fx(){var n,t;return(t=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&t!==void 0?t:document}Av({loadJS(n){return new Promise((t,e)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=t,s.onerror=i=>{const r=ke("internal-error");r.customData=i,e(r)},s.type="text/javascript",s.charset="UTF-8",fx().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});lx("Browser");var Oh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Wn,Yp;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(k,v){function x(){}x.prototype=v.prototype,k.D=v.prototype,k.prototype=new x,k.prototype.constructor=k,k.C=function(I,T,S){for(var E=Array(arguments.length-2),mt=2;mt<arguments.length;mt++)E[mt-2]=arguments[mt];return v.prototype[T].apply(I,E)}}function e(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(s,e),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(k,v,x){x||(x=0);var I=Array(16);if(typeof v=="string")for(var T=0;16>T;++T)I[T]=v.charCodeAt(x++)|v.charCodeAt(x++)<<8|v.charCodeAt(x++)<<16|v.charCodeAt(x++)<<24;else for(T=0;16>T;++T)I[T]=v[x++]|v[x++]<<8|v[x++]<<16|v[x++]<<24;v=k.g[0],x=k.g[1],T=k.g[2];var S=k.g[3],E=v+(S^x&(T^S))+I[0]+3614090360&4294967295;v=x+(E<<7&4294967295|E>>>25),E=S+(T^v&(x^T))+I[1]+3905402710&4294967295,S=v+(E<<12&4294967295|E>>>20),E=T+(x^S&(v^x))+I[2]+606105819&4294967295,T=S+(E<<17&4294967295|E>>>15),E=x+(v^T&(S^v))+I[3]+3250441966&4294967295,x=T+(E<<22&4294967295|E>>>10),E=v+(S^x&(T^S))+I[4]+4118548399&4294967295,v=x+(E<<7&4294967295|E>>>25),E=S+(T^v&(x^T))+I[5]+1200080426&4294967295,S=v+(E<<12&4294967295|E>>>20),E=T+(x^S&(v^x))+I[6]+2821735955&4294967295,T=S+(E<<17&4294967295|E>>>15),E=x+(v^T&(S^v))+I[7]+4249261313&4294967295,x=T+(E<<22&4294967295|E>>>10),E=v+(S^x&(T^S))+I[8]+1770035416&4294967295,v=x+(E<<7&4294967295|E>>>25),E=S+(T^v&(x^T))+I[9]+2336552879&4294967295,S=v+(E<<12&4294967295|E>>>20),E=T+(x^S&(v^x))+I[10]+4294925233&4294967295,T=S+(E<<17&4294967295|E>>>15),E=x+(v^T&(S^v))+I[11]+2304563134&4294967295,x=T+(E<<22&4294967295|E>>>10),E=v+(S^x&(T^S))+I[12]+1804603682&4294967295,v=x+(E<<7&4294967295|E>>>25),E=S+(T^v&(x^T))+I[13]+4254626195&4294967295,S=v+(E<<12&4294967295|E>>>20),E=T+(x^S&(v^x))+I[14]+2792965006&4294967295,T=S+(E<<17&4294967295|E>>>15),E=x+(v^T&(S^v))+I[15]+1236535329&4294967295,x=T+(E<<22&4294967295|E>>>10),E=v+(T^S&(x^T))+I[1]+4129170786&4294967295,v=x+(E<<5&4294967295|E>>>27),E=S+(x^T&(v^x))+I[6]+3225465664&4294967295,S=v+(E<<9&4294967295|E>>>23),E=T+(v^x&(S^v))+I[11]+643717713&4294967295,T=S+(E<<14&4294967295|E>>>18),E=x+(S^v&(T^S))+I[0]+3921069994&4294967295,x=T+(E<<20&4294967295|E>>>12),E=v+(T^S&(x^T))+I[5]+3593408605&4294967295,v=x+(E<<5&4294967295|E>>>27),E=S+(x^T&(v^x))+I[10]+38016083&4294967295,S=v+(E<<9&4294967295|E>>>23),E=T+(v^x&(S^v))+I[15]+3634488961&4294967295,T=S+(E<<14&4294967295|E>>>18),E=x+(S^v&(T^S))+I[4]+3889429448&4294967295,x=T+(E<<20&4294967295|E>>>12),E=v+(T^S&(x^T))+I[9]+568446438&4294967295,v=x+(E<<5&4294967295|E>>>27),E=S+(x^T&(v^x))+I[14]+3275163606&4294967295,S=v+(E<<9&4294967295|E>>>23),E=T+(v^x&(S^v))+I[3]+4107603335&4294967295,T=S+(E<<14&4294967295|E>>>18),E=x+(S^v&(T^S))+I[8]+1163531501&4294967295,x=T+(E<<20&4294967295|E>>>12),E=v+(T^S&(x^T))+I[13]+2850285829&4294967295,v=x+(E<<5&4294967295|E>>>27),E=S+(x^T&(v^x))+I[2]+4243563512&4294967295,S=v+(E<<9&4294967295|E>>>23),E=T+(v^x&(S^v))+I[7]+1735328473&4294967295,T=S+(E<<14&4294967295|E>>>18),E=x+(S^v&(T^S))+I[12]+2368359562&4294967295,x=T+(E<<20&4294967295|E>>>12),E=v+(x^T^S)+I[5]+4294588738&4294967295,v=x+(E<<4&4294967295|E>>>28),E=S+(v^x^T)+I[8]+2272392833&4294967295,S=v+(E<<11&4294967295|E>>>21),E=T+(S^v^x)+I[11]+1839030562&4294967295,T=S+(E<<16&4294967295|E>>>16),E=x+(T^S^v)+I[14]+4259657740&4294967295,x=T+(E<<23&4294967295|E>>>9),E=v+(x^T^S)+I[1]+2763975236&4294967295,v=x+(E<<4&4294967295|E>>>28),E=S+(v^x^T)+I[4]+1272893353&4294967295,S=v+(E<<11&4294967295|E>>>21),E=T+(S^v^x)+I[7]+4139469664&4294967295,T=S+(E<<16&4294967295|E>>>16),E=x+(T^S^v)+I[10]+3200236656&4294967295,x=T+(E<<23&4294967295|E>>>9),E=v+(x^T^S)+I[13]+681279174&4294967295,v=x+(E<<4&4294967295|E>>>28),E=S+(v^x^T)+I[0]+3936430074&4294967295,S=v+(E<<11&4294967295|E>>>21),E=T+(S^v^x)+I[3]+3572445317&4294967295,T=S+(E<<16&4294967295|E>>>16),E=x+(T^S^v)+I[6]+76029189&4294967295,x=T+(E<<23&4294967295|E>>>9),E=v+(x^T^S)+I[9]+3654602809&4294967295,v=x+(E<<4&4294967295|E>>>28),E=S+(v^x^T)+I[12]+3873151461&4294967295,S=v+(E<<11&4294967295|E>>>21),E=T+(S^v^x)+I[15]+530742520&4294967295,T=S+(E<<16&4294967295|E>>>16),E=x+(T^S^v)+I[2]+3299628645&4294967295,x=T+(E<<23&4294967295|E>>>9),E=v+(T^(x|~S))+I[0]+4096336452&4294967295,v=x+(E<<6&4294967295|E>>>26),E=S+(x^(v|~T))+I[7]+1126891415&4294967295,S=v+(E<<10&4294967295|E>>>22),E=T+(v^(S|~x))+I[14]+2878612391&4294967295,T=S+(E<<15&4294967295|E>>>17),E=x+(S^(T|~v))+I[5]+4237533241&4294967295,x=T+(E<<21&4294967295|E>>>11),E=v+(T^(x|~S))+I[12]+1700485571&4294967295,v=x+(E<<6&4294967295|E>>>26),E=S+(x^(v|~T))+I[3]+2399980690&4294967295,S=v+(E<<10&4294967295|E>>>22),E=T+(v^(S|~x))+I[10]+4293915773&4294967295,T=S+(E<<15&4294967295|E>>>17),E=x+(S^(T|~v))+I[1]+2240044497&4294967295,x=T+(E<<21&4294967295|E>>>11),E=v+(T^(x|~S))+I[8]+1873313359&4294967295,v=x+(E<<6&4294967295|E>>>26),E=S+(x^(v|~T))+I[15]+4264355552&4294967295,S=v+(E<<10&4294967295|E>>>22),E=T+(v^(S|~x))+I[6]+2734768916&4294967295,T=S+(E<<15&4294967295|E>>>17),E=x+(S^(T|~v))+I[13]+1309151649&4294967295,x=T+(E<<21&4294967295|E>>>11),E=v+(T^(x|~S))+I[4]+4149444226&4294967295,v=x+(E<<6&4294967295|E>>>26),E=S+(x^(v|~T))+I[11]+3174756917&4294967295,S=v+(E<<10&4294967295|E>>>22),E=T+(v^(S|~x))+I[2]+718787259&4294967295,T=S+(E<<15&4294967295|E>>>17),E=x+(S^(T|~v))+I[9]+3951481745&4294967295,k.g[0]=k.g[0]+v&4294967295,k.g[1]=k.g[1]+(T+(E<<21&4294967295|E>>>11))&4294967295,k.g[2]=k.g[2]+T&4294967295,k.g[3]=k.g[3]+S&4294967295}s.prototype.u=function(k,v){v===void 0&&(v=k.length);for(var x=v-this.blockSize,I=this.B,T=this.h,S=0;S<v;){if(T==0)for(;S<=x;)i(this,k,S),S+=this.blockSize;if(typeof k=="string"){for(;S<v;)if(I[T++]=k.charCodeAt(S++),T==this.blockSize){i(this,I),T=0;break}}else for(;S<v;)if(I[T++]=k[S++],T==this.blockSize){i(this,I),T=0;break}}this.h=T,this.o+=v},s.prototype.v=function(){var k=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);k[0]=128;for(var v=1;v<k.length-8;++v)k[v]=0;var x=8*this.o;for(v=k.length-8;v<k.length;++v)k[v]=x&255,x/=256;for(this.u(k),k=Array(16),v=x=0;4>v;++v)for(var I=0;32>I;I+=8)k[x++]=this.g[v]>>>I&255;return k};function r(k,v){var x=a;return Object.prototype.hasOwnProperty.call(x,k)?x[k]:x[k]=v(k)}function o(k,v){this.h=v;for(var x=[],I=!0,T=k.length-1;0<=T;T--){var S=k[T]|0;I&&S==v||(x[T]=S,I=!1)}this.g=x}var a={};function l(k){return-128<=k&&128>k?r(k,function(v){return new o([v|0],0>v?-1:0)}):new o([k|0],0>k?-1:0)}function c(k){if(isNaN(k)||!isFinite(k))return h;if(0>k)return w(c(-k));for(var v=[],x=1,I=0;k>=x;I++)v[I]=k/x|0,x*=4294967296;return new o(v,0)}function d(k,v){if(k.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(k.charAt(0)=="-")return w(d(k.substring(1),v));if(0<=k.indexOf("-"))throw Error('number format error: interior "-" character');for(var x=c(Math.pow(v,8)),I=h,T=0;T<k.length;T+=8){var S=Math.min(8,k.length-T),E=parseInt(k.substring(T,T+S),v);8>S?(S=c(Math.pow(v,S)),I=I.j(S).add(c(E))):(I=I.j(x),I=I.add(c(E)))}return I}var h=l(0),g=l(1),m=l(16777216);n=o.prototype,n.m=function(){if(_(this))return-w(this).m();for(var k=0,v=1,x=0;x<this.g.length;x++){var I=this.i(x);k+=(0<=I?I:4294967296+I)*v,v*=4294967296}return k},n.toString=function(k){if(k=k||10,2>k||36<k)throw Error("radix out of range: "+k);if(y(this))return"0";if(_(this))return"-"+w(this).toString(k);for(var v=c(Math.pow(k,6)),x=this,I="";;){var T=L(x,v).g;x=A(x,T.j(v));var S=((0<x.g.length?x.g[0]:x.h)>>>0).toString(k);if(x=T,y(x))return S+I;for(;6>S.length;)S="0"+S;I=S+I}},n.i=function(k){return 0>k?0:k<this.g.length?this.g[k]:this.h};function y(k){if(k.h!=0)return!1;for(var v=0;v<k.g.length;v++)if(k.g[v]!=0)return!1;return!0}function _(k){return k.h==-1}n.l=function(k){return k=A(this,k),_(k)?-1:y(k)?0:1};function w(k){for(var v=k.g.length,x=[],I=0;I<v;I++)x[I]=~k.g[I];return new o(x,~k.h).add(g)}n.abs=function(){return _(this)?w(this):this},n.add=function(k){for(var v=Math.max(this.g.length,k.g.length),x=[],I=0,T=0;T<=v;T++){var S=I+(this.i(T)&65535)+(k.i(T)&65535),E=(S>>>16)+(this.i(T)>>>16)+(k.i(T)>>>16);I=E>>>16,S&=65535,E&=65535,x[T]=E<<16|S}return new o(x,x[x.length-1]&-2147483648?-1:0)};function A(k,v){return k.add(w(v))}n.j=function(k){if(y(this)||y(k))return h;if(_(this))return _(k)?w(this).j(w(k)):w(w(this).j(k));if(_(k))return w(this.j(w(k)));if(0>this.l(m)&&0>k.l(m))return c(this.m()*k.m());for(var v=this.g.length+k.g.length,x=[],I=0;I<2*v;I++)x[I]=0;for(I=0;I<this.g.length;I++)for(var T=0;T<k.g.length;T++){var S=this.i(I)>>>16,E=this.i(I)&65535,mt=k.i(T)>>>16,Z=k.i(T)&65535;x[2*I+2*T]+=E*Z,P(x,2*I+2*T),x[2*I+2*T+1]+=S*Z,P(x,2*I+2*T+1),x[2*I+2*T+1]+=E*mt,P(x,2*I+2*T+1),x[2*I+2*T+2]+=S*mt,P(x,2*I+2*T+2)}for(I=0;I<v;I++)x[I]=x[2*I+1]<<16|x[2*I];for(I=v;I<2*v;I++)x[I]=0;return new o(x,0)};function P(k,v){for(;(k[v]&65535)!=k[v];)k[v+1]+=k[v]>>>16,k[v]&=65535,v++}function D(k,v){this.g=k,this.h=v}function L(k,v){if(y(v))throw Error("division by zero");if(y(k))return new D(h,h);if(_(k))return v=L(w(k),v),new D(w(v.g),w(v.h));if(_(v))return v=L(k,w(v)),new D(w(v.g),v.h);if(30<k.g.length){if(_(k)||_(v))throw Error("slowDivide_ only works with positive integers.");for(var x=g,I=v;0>=I.l(k);)x=M(x),I=M(I);var T=V(x,1),S=V(I,1);for(I=V(I,2),x=V(x,2);!y(I);){var E=S.add(I);0>=E.l(k)&&(T=T.add(x),S=E),I=V(I,1),x=V(x,1)}return v=A(k,T.j(v)),new D(T,v)}for(T=h;0<=k.l(v);){for(x=Math.max(1,Math.floor(k.m()/v.m())),I=Math.ceil(Math.log(x)/Math.LN2),I=48>=I?1:Math.pow(2,I-48),S=c(x),E=S.j(v);_(E)||0<E.l(k);)x-=I,S=c(x),E=S.j(v);y(S)&&(S=g),T=T.add(S),k=A(k,E)}return new D(T,k)}n.A=function(k){return L(this,k).h},n.and=function(k){for(var v=Math.max(this.g.length,k.g.length),x=[],I=0;I<v;I++)x[I]=this.i(I)&k.i(I);return new o(x,this.h&k.h)},n.or=function(k){for(var v=Math.max(this.g.length,k.g.length),x=[],I=0;I<v;I++)x[I]=this.i(I)|k.i(I);return new o(x,this.h|k.h)},n.xor=function(k){for(var v=Math.max(this.g.length,k.g.length),x=[],I=0;I<v;I++)x[I]=this.i(I)^k.i(I);return new o(x,this.h^k.h)};function M(k){for(var v=k.g.length+1,x=[],I=0;I<v;I++)x[I]=k.i(I)<<1|k.i(I-1)>>>31;return new o(x,k.h)}function V(k,v){var x=v>>5;v%=32;for(var I=k.g.length-x,T=[],S=0;S<I;S++)T[S]=0<v?k.i(S+x)>>>v|k.i(S+x+1)<<32-v:k.i(S+x);return new o(T,k.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Yp=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=d,Wn=o}).apply(typeof Oh<"u"?Oh:typeof self<"u"?self:typeof window<"u"?window:{});var jr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Qp,mi,Xp,co,Bl,Jp,Zp,tm;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(u,f,p){return u==Array.prototype||u==Object.prototype||(u[f]=p.value),u};function e(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof jr=="object"&&jr];for(var f=0;f<u.length;++f){var p=u[f];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var s=e(this);function i(u,f){if(f)t:{var p=s;u=u.split(".");for(var b=0;b<u.length-1;b++){var C=u[b];if(!(C in p))break t;p=p[C]}u=u[u.length-1],b=p[u],f=f(b),f!=b&&f!=null&&t(p,u,{configurable:!0,writable:!0,value:f})}}function r(u,f){u instanceof String&&(u+="");var p=0,b=!1,C={next:function(){if(!b&&p<u.length){var R=p++;return{value:f(R,u[R]),done:!1}}return b=!0,{done:!0,value:void 0}}};return C[Symbol.iterator]=function(){return C},C}i("Array.prototype.values",function(u){return u||function(){return r(this,function(f,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(u){var f=typeof u;return f=f!="object"?f:u?Array.isArray(u)?"array":f:"null",f=="array"||f=="object"&&typeof u.length=="number"}function c(u){var f=typeof u;return f=="object"&&u!=null||f=="function"}function d(u,f,p){return u.call.apply(u.bind,arguments)}function h(u,f,p){if(!u)throw Error();if(2<arguments.length){var b=Array.prototype.slice.call(arguments,2);return function(){var C=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(C,b),u.apply(f,C)}}return function(){return u.apply(f,arguments)}}function g(u,f,p){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:h,g.apply(null,arguments)}function m(u,f){var p=Array.prototype.slice.call(arguments,1);return function(){var b=p.slice();return b.push.apply(b,arguments),u.apply(this,b)}}function y(u,f){function p(){}p.prototype=f.prototype,u.aa=f.prototype,u.prototype=new p,u.prototype.constructor=u,u.Qb=function(b,C,R){for(var F=Array(arguments.length-2),at=2;at<arguments.length;at++)F[at-2]=arguments[at];return f.prototype[C].apply(b,F)}}function _(u){const f=u.length;if(0<f){const p=Array(f);for(let b=0;b<f;b++)p[b]=u[b];return p}return[]}function w(u,f){for(let p=1;p<arguments.length;p++){const b=arguments[p];if(l(b)){const C=u.length||0,R=b.length||0;u.length=C+R;for(let F=0;F<R;F++)u[C+F]=b[F]}else u.push(b)}}class A{constructor(f,p){this.i=f,this.j=p,this.h=0,this.g=null}get(){let f;return 0<this.h?(this.h--,f=this.g,this.g=f.next,f.next=null):f=this.i(),f}}function P(u){return/^[\s\xa0]*$/.test(u)}function D(){var u=a.navigator;return u&&(u=u.userAgent)?u:""}function L(u){return L[" "](u),u}L[" "]=function(){};var M=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function V(u,f,p){for(const b in u)f.call(p,u[b],b,u)}function k(u,f){for(const p in u)f.call(void 0,u[p],p,u)}function v(u){const f={};for(const p in u)f[p]=u[p];return f}const x="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(u,f){let p,b;for(let C=1;C<arguments.length;C++){b=arguments[C];for(p in b)u[p]=b[p];for(let R=0;R<x.length;R++)p=x[R],Object.prototype.hasOwnProperty.call(b,p)&&(u[p]=b[p])}}function T(u){var f=1;u=u.split(":");const p=[];for(;0<f&&u.length;)p.push(u.shift()),f--;return u.length&&p.push(u.join(":")),p}function S(u){a.setTimeout(()=>{throw u},0)}function E(){var u=Et;let f=null;return u.g&&(f=u.g,u.g=u.g.next,u.g||(u.h=null),f.next=null),f}class mt{constructor(){this.h=this.g=null}add(f,p){const b=Z.get();b.set(f,p),this.h?this.h.next=b:this.g=b,this.h=b}}var Z=new A(()=>new lt,u=>u.reset());class lt{constructor(){this.next=this.g=this.h=null}set(f,p){this.h=f,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let ot,Dt=!1,Et=new mt,Pe=()=>{const u=a.Promise.resolve(void 0);ot=()=>{u.then(os)}};var os=()=>{for(var u;u=E();){try{u.h.call(u.g)}catch(p){S(p)}var f=Z;f.j(u),100>f.h&&(f.h++,u.next=f.g,f.g=u)}Dt=!1};function Qt(){this.s=this.s,this.C=this.C}Qt.prototype.s=!1,Qt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Qt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function _t(u,f){this.type=u,this.g=this.target=f,this.defaultPrevented=!1}_t.prototype.h=function(){this.defaultPrevented=!0};var Ce=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var u=!1,f=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const p=()=>{};a.addEventListener("test",p,f),a.removeEventListener("test",p,f)}catch{}return u}();function ue(u,f){if(_t.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u){var p=this.type=u.type,b=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;if(this.target=u.target||u.srcElement,this.g=f,f=u.relatedTarget){if(M){t:{try{L(f.nodeName);var C=!0;break t}catch{}C=!1}C||(f=null)}}else p=="mouseover"?f=u.fromElement:p=="mouseout"&&(f=u.toElement);this.relatedTarget=f,b?(this.clientX=b.clientX!==void 0?b.clientX:b.pageX,this.clientY=b.clientY!==void 0?b.clientY:b.pageY,this.screenX=b.screenX||0,this.screenY=b.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=typeof u.pointerType=="string"?u.pointerType:Re[u.pointerType]||"",this.state=u.state,this.i=u,u.defaultPrevented&&ue.aa.h.call(this)}}y(ue,_t);var Re={2:"touch",3:"pen",4:"mouse"};ue.prototype.h=function(){ue.aa.h.call(this);var u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var vr="closure_listenable_"+(1e6*Math.random()|0),Oy=0;function Vy(u,f,p,b,C){this.listener=u,this.proxy=null,this.src=f,this.type=p,this.capture=!!b,this.ha=C,this.key=++Oy,this.da=this.fa=!1}function wr(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function xr(u){this.src=u,this.g={},this.h=0}xr.prototype.add=function(u,f,p,b,C){var R=u.toString();u=this.g[R],u||(u=this.g[R]=[],this.h++);var F=Ra(u,f,b,C);return-1<F?(f=u[F],p||(f.fa=!1)):(f=new Vy(f,this.src,R,!!b,C),f.fa=p,u.push(f)),f};function Ca(u,f){var p=f.type;if(p in u.g){var b=u.g[p],C=Array.prototype.indexOf.call(b,f,void 0),R;(R=0<=C)&&Array.prototype.splice.call(b,C,1),R&&(wr(f),u.g[p].length==0&&(delete u.g[p],u.h--))}}function Ra(u,f,p,b){for(var C=0;C<u.length;++C){var R=u[C];if(!R.da&&R.listener==f&&R.capture==!!p&&R.ha==b)return C}return-1}var Da="closure_lm_"+(1e6*Math.random()|0),Ma={};function od(u,f,p,b,C){if(Array.isArray(f)){for(var R=0;R<f.length;R++)od(u,f[R],p,b,C);return null}return p=cd(p),u&&u[vr]?u.K(f,p,c(b)?!!b.capture:!1,C):Ny(u,f,p,!1,b,C)}function Ny(u,f,p,b,C,R){if(!f)throw Error("Invalid event type");var F=c(C)?!!C.capture:!!C,at=Oa(u);if(at||(u[Da]=at=new xr(u)),p=at.add(f,p,b,F,R),p.proxy)return p;if(b=Fy(),p.proxy=b,b.src=u,b.listener=p,u.addEventListener)Ce||(C=F),C===void 0&&(C=!1),u.addEventListener(f.toString(),b,C);else if(u.attachEvent)u.attachEvent(ld(f.toString()),b);else if(u.addListener&&u.removeListener)u.addListener(b);else throw Error("addEventListener and attachEvent are unavailable.");return p}function Fy(){function u(p){return f.call(u.src,u.listener,p)}const f=By;return u}function ad(u,f,p,b,C){if(Array.isArray(f))for(var R=0;R<f.length;R++)ad(u,f[R],p,b,C);else b=c(b)?!!b.capture:!!b,p=cd(p),u&&u[vr]?(u=u.i,f=String(f).toString(),f in u.g&&(R=u.g[f],p=Ra(R,p,b,C),-1<p&&(wr(R[p]),Array.prototype.splice.call(R,p,1),R.length==0&&(delete u.g[f],u.h--)))):u&&(u=Oa(u))&&(f=u.g[f.toString()],u=-1,f&&(u=Ra(f,p,b,C)),(p=-1<u?f[u]:null)&&La(p))}function La(u){if(typeof u!="number"&&u&&!u.da){var f=u.src;if(f&&f[vr])Ca(f.i,u);else{var p=u.type,b=u.proxy;f.removeEventListener?f.removeEventListener(p,b,u.capture):f.detachEvent?f.detachEvent(ld(p),b):f.addListener&&f.removeListener&&f.removeListener(b),(p=Oa(f))?(Ca(p,u),p.h==0&&(p.src=null,f[Da]=null)):wr(u)}}}function ld(u){return u in Ma?Ma[u]:Ma[u]="on"+u}function By(u,f){if(u.da)u=!0;else{f=new ue(f,this);var p=u.listener,b=u.ha||u.src;u.fa&&La(u),u=p.call(b,f)}return u}function Oa(u){return u=u[Da],u instanceof xr?u:null}var Va="__closure_events_fn_"+(1e9*Math.random()>>>0);function cd(u){return typeof u=="function"?u:(u[Va]||(u[Va]=function(f){return u.handleEvent(f)}),u[Va])}function Bt(){Qt.call(this),this.i=new xr(this),this.M=this,this.F=null}y(Bt,Qt),Bt.prototype[vr]=!0,Bt.prototype.removeEventListener=function(u,f,p,b){ad(this,u,f,p,b)};function Xt(u,f){var p,b=u.F;if(b)for(p=[];b;b=b.F)p.push(b);if(u=u.M,b=f.type||f,typeof f=="string")f=new _t(f,u);else if(f instanceof _t)f.target=f.target||u;else{var C=f;f=new _t(b,u),I(f,C)}if(C=!0,p)for(var R=p.length-1;0<=R;R--){var F=f.g=p[R];C=kr(F,b,!0,f)&&C}if(F=f.g=u,C=kr(F,b,!0,f)&&C,C=kr(F,b,!1,f)&&C,p)for(R=0;R<p.length;R++)F=f.g=p[R],C=kr(F,b,!1,f)&&C}Bt.prototype.N=function(){if(Bt.aa.N.call(this),this.i){var u=this.i,f;for(f in u.g){for(var p=u.g[f],b=0;b<p.length;b++)wr(p[b]);delete u.g[f],u.h--}}this.F=null},Bt.prototype.K=function(u,f,p,b){return this.i.add(String(u),f,!1,p,b)},Bt.prototype.L=function(u,f,p,b){return this.i.add(String(u),f,!0,p,b)};function kr(u,f,p,b){if(f=u.i.g[String(f)],!f)return!0;f=f.concat();for(var C=!0,R=0;R<f.length;++R){var F=f[R];if(F&&!F.da&&F.capture==p){var at=F.listener,Mt=F.ha||F.src;F.fa&&Ca(u.i,F),C=at.call(Mt,b)!==!1&&C}}return C&&!b.defaultPrevented}function ud(u,f,p){if(typeof u=="function")p&&(u=g(u,p));else if(u&&typeof u.handleEvent=="function")u=g(u.handleEvent,u);else throw Error("Invalid listener argument");return 2147483647<Number(f)?-1:a.setTimeout(u,f||0)}function dd(u){u.g=ud(()=>{u.g=null,u.i&&(u.i=!1,dd(u))},u.l);const f=u.h;u.h=null,u.m.apply(null,f)}class jy extends Qt{constructor(f,p){super(),this.m=f,this.l=p,this.h=null,this.i=!1,this.g=null}j(f){this.h=arguments,this.g?this.i=!0:dd(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Gs(u){Qt.call(this),this.h=u,this.g={}}y(Gs,Qt);var hd=[];function fd(u){V(u.g,function(f,p){this.g.hasOwnProperty(p)&&La(f)},u),u.g={}}Gs.prototype.N=function(){Gs.aa.N.call(this),fd(this)},Gs.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Na=a.JSON.stringify,Uy=a.JSON.parse,zy=class{stringify(u){return a.JSON.stringify(u,void 0)}parse(u){return a.JSON.parse(u,void 0)}};function Fa(){}Fa.prototype.h=null;function gd(u){return u.h||(u.h=u.i())}function pd(){}var Ks={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ba(){_t.call(this,"d")}y(Ba,_t);function ja(){_t.call(this,"c")}y(ja,_t);var Dn={},md=null;function Er(){return md=md||new Bt}Dn.La="serverreachability";function yd(u){_t.call(this,Dn.La,u)}y(yd,_t);function Ys(u){const f=Er();Xt(f,new yd(f))}Dn.STAT_EVENT="statevent";function _d(u,f){_t.call(this,Dn.STAT_EVENT,u),this.stat=f}y(_d,_t);function Jt(u){const f=Er();Xt(f,new _d(f,u))}Dn.Ma="timingevent";function bd(u,f){_t.call(this,Dn.Ma,u),this.size=f}y(bd,_t);function Qs(u,f){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){u()},f)}function Xs(){this.g=!0}Xs.prototype.xa=function(){this.g=!1};function $y(u,f,p,b,C,R){u.info(function(){if(u.g)if(R)for(var F="",at=R.split("&"),Mt=0;Mt<at.length;Mt++){var et=at[Mt].split("=");if(1<et.length){var jt=et[0];et=et[1];var Ut=jt.split("_");F=2<=Ut.length&&Ut[1]=="type"?F+(jt+"="+et+"&"):F+(jt+"=redacted&")}}else F=null;else F=R;return"XMLHTTP REQ ("+b+") [attempt "+C+"]: "+f+`
`+p+`
`+F})}function Hy(u,f,p,b,C,R,F){u.info(function(){return"XMLHTTP RESP ("+b+") [ attempt "+C+"]: "+f+`
`+p+`
`+R+" "+F})}function as(u,f,p,b){u.info(function(){return"XMLHTTP TEXT ("+f+"): "+qy(u,p)+(b?" "+b:"")})}function Wy(u,f){u.info(function(){return"TIMEOUT: "+f})}Xs.prototype.info=function(){};function qy(u,f){if(!u.g)return f;if(!f)return null;try{var p=JSON.parse(f);if(p){for(u=0;u<p.length;u++)if(Array.isArray(p[u])){var b=p[u];if(!(2>b.length)){var C=b[1];if(Array.isArray(C)&&!(1>C.length)){var R=C[0];if(R!="noop"&&R!="stop"&&R!="close")for(var F=1;F<C.length;F++)C[F]=""}}}}return Na(p)}catch{return f}}var Ir={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},vd={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ua;function Tr(){}y(Tr,Fa),Tr.prototype.g=function(){return new XMLHttpRequest},Tr.prototype.i=function(){return{}},Ua=new Tr;function Ze(u,f,p,b){this.j=u,this.i=f,this.l=p,this.R=b||1,this.U=new Gs(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new wd}function wd(){this.i=null,this.g="",this.h=!1}var xd={},za={};function $a(u,f,p){u.L=1,u.v=Cr(De(f)),u.m=p,u.P=!0,kd(u,null)}function kd(u,f){u.F=Date.now(),Ar(u),u.A=De(u.v);var p=u.A,b=u.R;Array.isArray(b)||(b=[String(b)]),Nd(p.i,"t",b),u.C=0,p=u.j.J,u.h=new wd,u.g=eh(u.j,p?f:null,!u.m),0<u.O&&(u.M=new jy(g(u.Y,u,u.g),u.O)),f=u.U,p=u.g,b=u.ca;var C="readystatechange";Array.isArray(C)||(C&&(hd[0]=C.toString()),C=hd);for(var R=0;R<C.length;R++){var F=od(p,C[R],b||f.handleEvent,!1,f.h||f);if(!F)break;f.g[F.key]=F}f=u.H?v(u.H):{},u.m?(u.u||(u.u="POST"),f["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.A,u.u,u.m,f)):(u.u="GET",u.g.ea(u.A,u.u,null,f)),Ys(),$y(u.i,u.u,u.A,u.l,u.R,u.m)}Ze.prototype.ca=function(u){u=u.target;const f=this.M;f&&Me(u)==3?f.j():this.Y(u)},Ze.prototype.Y=function(u){try{if(u==this.g)t:{const Ut=Me(this.g);var f=this.g.Ba();const us=this.g.Z();if(!(3>Ut)&&(Ut!=3||this.g&&(this.h.h||this.g.oa()||Hd(this.g)))){this.J||Ut!=4||f==7||(f==8||0>=us?Ys(3):Ys(2)),Ha(this);var p=this.g.Z();this.X=p;e:if(Ed(this)){var b=Hd(this.g);u="";var C=b.length,R=Me(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Mn(this),Js(this);var F="";break e}this.h.i=new a.TextDecoder}for(f=0;f<C;f++)this.h.h=!0,u+=this.h.i.decode(b[f],{stream:!(R&&f==C-1)});b.length=0,this.h.g+=u,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=p==200,Hy(this.i,this.u,this.A,this.l,this.R,Ut,p),this.o){if(this.T&&!this.K){e:{if(this.g){var at,Mt=this.g;if((at=Mt.g?Mt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!P(at)){var et=at;break e}}et=null}if(p=et)as(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Wa(this,p);else{this.o=!1,this.s=3,Jt(12),Mn(this),Js(this);break t}}if(this.P){p=!0;let de;for(;!this.J&&this.C<F.length;)if(de=Gy(this,F),de==za){Ut==4&&(this.s=4,Jt(14),p=!1),as(this.i,this.l,null,"[Incomplete Response]");break}else if(de==xd){this.s=4,Jt(15),as(this.i,this.l,F,"[Invalid Chunk]"),p=!1;break}else as(this.i,this.l,de,null),Wa(this,de);if(Ed(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ut!=4||F.length!=0||this.h.h||(this.s=1,Jt(16),p=!1),this.o=this.o&&p,!p)as(this.i,this.l,F,"[Invalid Chunked Response]"),Mn(this),Js(this);else if(0<F.length&&!this.W){this.W=!0;var jt=this.j;jt.g==this&&jt.ba&&!jt.M&&(jt.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),Xa(jt),jt.M=!0,Jt(11))}}else as(this.i,this.l,F,null),Wa(this,F);Ut==4&&Mn(this),this.o&&!this.J&&(Ut==4?Xd(this.j,this):(this.o=!1,Ar(this)))}else u_(this.g),p==400&&0<F.indexOf("Unknown SID")?(this.s=3,Jt(12)):(this.s=0,Jt(13)),Mn(this),Js(this)}}}catch{}finally{}};function Ed(u){return u.g?u.u=="GET"&&u.L!=2&&u.j.Ca:!1}function Gy(u,f){var p=u.C,b=f.indexOf(`
`,p);return b==-1?za:(p=Number(f.substring(p,b)),isNaN(p)?xd:(b+=1,b+p>f.length?za:(f=f.slice(b,b+p),u.C=b+p,f)))}Ze.prototype.cancel=function(){this.J=!0,Mn(this)};function Ar(u){u.S=Date.now()+u.I,Id(u,u.I)}function Id(u,f){if(u.B!=null)throw Error("WatchDog timer not null");u.B=Qs(g(u.ba,u),f)}function Ha(u){u.B&&(a.clearTimeout(u.B),u.B=null)}Ze.prototype.ba=function(){this.B=null;const u=Date.now();0<=u-this.S?(Wy(this.i,this.A),this.L!=2&&(Ys(),Jt(17)),Mn(this),this.s=2,Js(this)):Id(this,this.S-u)};function Js(u){u.j.G==0||u.J||Xd(u.j,u)}function Mn(u){Ha(u);var f=u.M;f&&typeof f.ma=="function"&&f.ma(),u.M=null,fd(u.U),u.g&&(f=u.g,u.g=null,f.abort(),f.ma())}function Wa(u,f){try{var p=u.j;if(p.G!=0&&(p.g==u||qa(p.h,u))){if(!u.K&&qa(p.h,u)&&p.G==3){try{var b=p.Da.g.parse(f)}catch{b=null}if(Array.isArray(b)&&b.length==3){var C=b;if(C[0]==0){t:if(!p.u){if(p.g)if(p.g.F+3e3<u.F)Vr(p),Lr(p);else break t;Qa(p),Jt(18)}}else p.za=C[1],0<p.za-p.T&&37500>C[2]&&p.F&&p.v==0&&!p.C&&(p.C=Qs(g(p.Za,p),6e3));if(1>=Sd(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else On(p,11)}else if((u.K||p.g==u)&&Vr(p),!P(f))for(C=p.Da.g.parse(f),f=0;f<C.length;f++){let et=C[f];if(p.T=et[0],et=et[1],p.G==2)if(et[0]=="c"){p.K=et[1],p.ia=et[2];const jt=et[3];jt!=null&&(p.la=jt,p.j.info("VER="+p.la));const Ut=et[4];Ut!=null&&(p.Aa=Ut,p.j.info("SVER="+p.Aa));const us=et[5];us!=null&&typeof us=="number"&&0<us&&(b=1.5*us,p.L=b,p.j.info("backChannelRequestTimeoutMs_="+b)),b=p;const de=u.g;if(de){const Fr=de.g?de.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Fr){var R=b.h;R.g||Fr.indexOf("spdy")==-1&&Fr.indexOf("quic")==-1&&Fr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Ga(R,R.h),R.h=null))}if(b.D){const Ja=de.g?de.g.getResponseHeader("X-HTTP-Session-Id"):null;Ja&&(b.ya=Ja,ut(b.I,b.D,Ja))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-u.F,p.j.info("Handshake RTT: "+p.R+"ms")),b=p;var F=u;if(b.qa=th(b,b.J?b.ia:null,b.W),F.K){Pd(b.h,F);var at=F,Mt=b.L;Mt&&(at.I=Mt),at.B&&(Ha(at),Ar(at)),b.g=F}else Yd(b);0<p.i.length&&Or(p)}else et[0]!="stop"&&et[0]!="close"||On(p,7);else p.G==3&&(et[0]=="stop"||et[0]=="close"?et[0]=="stop"?On(p,7):Ya(p):et[0]!="noop"&&p.l&&p.l.ta(et),p.v=0)}}Ys(4)}catch{}}var Ky=class{constructor(u,f){this.g=u,this.map=f}};function Td(u){this.l=u||10,a.PerformanceNavigationTiming?(u=a.performance.getEntriesByType("navigation"),u=0<u.length&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ad(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function Sd(u){return u.h?1:u.g?u.g.size:0}function qa(u,f){return u.h?u.h==f:u.g?u.g.has(f):!1}function Ga(u,f){u.g?u.g.add(f):u.h=f}function Pd(u,f){u.h&&u.h==f?u.h=null:u.g&&u.g.has(f)&&u.g.delete(f)}Td.prototype.cancel=function(){if(this.i=Cd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function Cd(u){if(u.h!=null)return u.i.concat(u.h.D);if(u.g!=null&&u.g.size!==0){let f=u.i;for(const p of u.g.values())f=f.concat(p.D);return f}return _(u.i)}function Yy(u){if(u.V&&typeof u.V=="function")return u.V();if(typeof Map<"u"&&u instanceof Map||typeof Set<"u"&&u instanceof Set)return Array.from(u.values());if(typeof u=="string")return u.split("");if(l(u)){for(var f=[],p=u.length,b=0;b<p;b++)f.push(u[b]);return f}f=[],p=0;for(b in u)f[p++]=u[b];return f}function Qy(u){if(u.na&&typeof u.na=="function")return u.na();if(!u.V||typeof u.V!="function"){if(typeof Map<"u"&&u instanceof Map)return Array.from(u.keys());if(!(typeof Set<"u"&&u instanceof Set)){if(l(u)||typeof u=="string"){var f=[];u=u.length;for(var p=0;p<u;p++)f.push(p);return f}f=[],p=0;for(const b in u)f[p++]=b;return f}}}function Rd(u,f){if(u.forEach&&typeof u.forEach=="function")u.forEach(f,void 0);else if(l(u)||typeof u=="string")Array.prototype.forEach.call(u,f,void 0);else for(var p=Qy(u),b=Yy(u),C=b.length,R=0;R<C;R++)f.call(void 0,b[R],p&&p[R],u)}var Dd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Xy(u,f){if(u){u=u.split("&");for(var p=0;p<u.length;p++){var b=u[p].indexOf("="),C=null;if(0<=b){var R=u[p].substring(0,b);C=u[p].substring(b+1)}else R=u[p];f(R,C?decodeURIComponent(C.replace(/\+/g," ")):"")}}}function Ln(u){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,u instanceof Ln){this.h=u.h,Sr(this,u.j),this.o=u.o,this.g=u.g,Pr(this,u.s),this.l=u.l;var f=u.i,p=new ei;p.i=f.i,f.g&&(p.g=new Map(f.g),p.h=f.h),Md(this,p),this.m=u.m}else u&&(f=String(u).match(Dd))?(this.h=!1,Sr(this,f[1]||"",!0),this.o=Zs(f[2]||""),this.g=Zs(f[3]||"",!0),Pr(this,f[4]),this.l=Zs(f[5]||"",!0),Md(this,f[6]||"",!0),this.m=Zs(f[7]||"")):(this.h=!1,this.i=new ei(null,this.h))}Ln.prototype.toString=function(){var u=[],f=this.j;f&&u.push(ti(f,Ld,!0),":");var p=this.g;return(p||f=="file")&&(u.push("//"),(f=this.o)&&u.push(ti(f,Ld,!0),"@"),u.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&u.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&u.push("/"),u.push(ti(p,p.charAt(0)=="/"?t_:Zy,!0))),(p=this.i.toString())&&u.push("?",p),(p=this.m)&&u.push("#",ti(p,n_)),u.join("")};function De(u){return new Ln(u)}function Sr(u,f,p){u.j=p?Zs(f,!0):f,u.j&&(u.j=u.j.replace(/:$/,""))}function Pr(u,f){if(f){if(f=Number(f),isNaN(f)||0>f)throw Error("Bad port number "+f);u.s=f}else u.s=null}function Md(u,f,p){f instanceof ei?(u.i=f,s_(u.i,u.h)):(p||(f=ti(f,e_)),u.i=new ei(f,u.h))}function ut(u,f,p){u.i.set(f,p)}function Cr(u){return ut(u,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),u}function Zs(u,f){return u?f?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function ti(u,f,p){return typeof u=="string"?(u=encodeURI(u).replace(f,Jy),p&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function Jy(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var Ld=/[#\/\?@]/g,Zy=/[#\?:]/g,t_=/[#\?]/g,e_=/[#\?@]/g,n_=/#/g;function ei(u,f){this.h=this.g=null,this.i=u||null,this.j=!!f}function tn(u){u.g||(u.g=new Map,u.h=0,u.i&&Xy(u.i,function(f,p){u.add(decodeURIComponent(f.replace(/\+/g," ")),p)}))}n=ei.prototype,n.add=function(u,f){tn(this),this.i=null,u=ls(this,u);var p=this.g.get(u);return p||this.g.set(u,p=[]),p.push(f),this.h+=1,this};function Od(u,f){tn(u),f=ls(u,f),u.g.has(f)&&(u.i=null,u.h-=u.g.get(f).length,u.g.delete(f))}function Vd(u,f){return tn(u),f=ls(u,f),u.g.has(f)}n.forEach=function(u,f){tn(this),this.g.forEach(function(p,b){p.forEach(function(C){u.call(f,C,b,this)},this)},this)},n.na=function(){tn(this);const u=Array.from(this.g.values()),f=Array.from(this.g.keys()),p=[];for(let b=0;b<f.length;b++){const C=u[b];for(let R=0;R<C.length;R++)p.push(f[b])}return p},n.V=function(u){tn(this);let f=[];if(typeof u=="string")Vd(this,u)&&(f=f.concat(this.g.get(ls(this,u))));else{u=Array.from(this.g.values());for(let p=0;p<u.length;p++)f=f.concat(u[p])}return f},n.set=function(u,f){return tn(this),this.i=null,u=ls(this,u),Vd(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[f]),this.h+=1,this},n.get=function(u,f){return u?(u=this.V(u),0<u.length?String(u[0]):f):f};function Nd(u,f,p){Od(u,f),0<p.length&&(u.i=null,u.g.set(ls(u,f),_(p)),u.h+=p.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],f=Array.from(this.g.keys());for(var p=0;p<f.length;p++){var b=f[p];const R=encodeURIComponent(String(b)),F=this.V(b);for(b=0;b<F.length;b++){var C=R;F[b]!==""&&(C+="="+encodeURIComponent(String(F[b]))),u.push(C)}}return this.i=u.join("&")};function ls(u,f){return f=String(f),u.j&&(f=f.toLowerCase()),f}function s_(u,f){f&&!u.j&&(tn(u),u.i=null,u.g.forEach(function(p,b){var C=b.toLowerCase();b!=C&&(Od(this,b),Nd(this,C,p))},u)),u.j=f}function i_(u,f){const p=new Xs;if(a.Image){const b=new Image;b.onload=m(en,p,"TestLoadImage: loaded",!0,f,b),b.onerror=m(en,p,"TestLoadImage: error",!1,f,b),b.onabort=m(en,p,"TestLoadImage: abort",!1,f,b),b.ontimeout=m(en,p,"TestLoadImage: timeout",!1,f,b),a.setTimeout(function(){b.ontimeout&&b.ontimeout()},1e4),b.src=u}else f(!1)}function r_(u,f){const p=new Xs,b=new AbortController,C=setTimeout(()=>{b.abort(),en(p,"TestPingServer: timeout",!1,f)},1e4);fetch(u,{signal:b.signal}).then(R=>{clearTimeout(C),R.ok?en(p,"TestPingServer: ok",!0,f):en(p,"TestPingServer: server error",!1,f)}).catch(()=>{clearTimeout(C),en(p,"TestPingServer: error",!1,f)})}function en(u,f,p,b,C){try{C&&(C.onload=null,C.onerror=null,C.onabort=null,C.ontimeout=null),b(p)}catch{}}function o_(){this.g=new zy}function a_(u,f,p){const b=p||"";try{Rd(u,function(C,R){let F=C;c(C)&&(F=Na(C)),f.push(b+R+"="+encodeURIComponent(F))})}catch(C){throw f.push(b+"type="+encodeURIComponent("_badmap")),C}}function Rr(u){this.l=u.Ub||null,this.j=u.eb||!1}y(Rr,Fa),Rr.prototype.g=function(){return new Dr(this.l,this.j)},Rr.prototype.i=function(u){return function(){return u}}({});function Dr(u,f){Bt.call(this),this.D=u,this.o=f,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}y(Dr,Bt),n=Dr.prototype,n.open=function(u,f){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=u,this.A=f,this.readyState=1,si(this)},n.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const f={headers:this.u,method:this.B,credentials:this.m,cache:void 0};u&&(f.body=u),(this.D||a).fetch(new Request(this.A,f)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ni(this)),this.readyState=0},n.Sa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,si(this)),this.g&&(this.readyState=3,si(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Fd(this)}else u.text().then(this.Ra.bind(this),this.ga.bind(this))};function Fd(u){u.j.read().then(u.Pa.bind(u)).catch(u.ga.bind(u))}n.Pa=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var f=u.value?u.value:new Uint8Array(0);(f=this.v.decode(f,{stream:!u.done}))&&(this.response=this.responseText+=f)}u.done?ni(this):si(this),this.readyState==3&&Fd(this)}},n.Ra=function(u){this.g&&(this.response=this.responseText=u,ni(this))},n.Qa=function(u){this.g&&(this.response=u,ni(this))},n.ga=function(){this.g&&ni(this)};function ni(u){u.readyState=4,u.l=null,u.j=null,u.v=null,si(u)}n.setRequestHeader=function(u,f){this.u.append(u,f)},n.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],f=this.h.entries();for(var p=f.next();!p.done;)p=p.value,u.push(p[0]+": "+p[1]),p=f.next();return u.join(`\r
`)};function si(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(Dr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Bd(u){let f="";return V(u,function(p,b){f+=b,f+=":",f+=p,f+=`\r
`}),f}function Ka(u,f,p){t:{for(b in p){var b=!1;break t}b=!0}b||(p=Bd(p),typeof u=="string"?p!=null&&encodeURIComponent(String(p)):ut(u,f,p))}function bt(u){Bt.call(this),this.headers=new Map,this.o=u||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}y(bt,Bt);var l_=/^https?$/i,c_=["POST","PUT"];n=bt.prototype,n.Ha=function(u){this.J=u},n.ea=function(u,f,p,b){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);f=f?f.toUpperCase():"GET",this.D=u,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ua.g(),this.v=this.o?gd(this.o):gd(Ua),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(f,String(u),!0),this.B=!1}catch(R){jd(this,R);return}if(u=p||"",p=new Map(this.headers),b)if(Object.getPrototypeOf(b)===Object.prototype)for(var C in b)p.set(C,b[C]);else if(typeof b.keys=="function"&&typeof b.get=="function")for(const R of b.keys())p.set(R,b.get(R));else throw Error("Unknown input type for opt_headers: "+String(b));b=Array.from(p.keys()).find(R=>R.toLowerCase()=="content-type"),C=a.FormData&&u instanceof a.FormData,!(0<=Array.prototype.indexOf.call(c_,f,void 0))||b||C||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,F]of p)this.g.setRequestHeader(R,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{$d(this),this.u=!0,this.g.send(u),this.u=!1}catch(R){jd(this,R)}};function jd(u,f){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=f,u.m=5,Ud(u),Mr(u)}function Ud(u){u.A||(u.A=!0,Xt(u,"complete"),Xt(u,"error"))}n.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=u||7,Xt(this,"complete"),Xt(this,"abort"),Mr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Mr(this,!0)),bt.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?zd(this):this.bb())},n.bb=function(){zd(this)};function zd(u){if(u.h&&typeof o<"u"&&(!u.v[1]||Me(u)!=4||u.Z()!=2)){if(u.u&&Me(u)==4)ud(u.Ea,0,u);else if(Xt(u,"readystatechange"),Me(u)==4){u.h=!1;try{const F=u.Z();t:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var f=!0;break t;default:f=!1}var p;if(!(p=f)){var b;if(b=F===0){var C=String(u.D).match(Dd)[1]||null;!C&&a.self&&a.self.location&&(C=a.self.location.protocol.slice(0,-1)),b=!l_.test(C?C.toLowerCase():"")}p=b}if(p)Xt(u,"complete"),Xt(u,"success");else{u.m=6;try{var R=2<Me(u)?u.g.statusText:""}catch{R=""}u.l=R+" ["+u.Z()+"]",Ud(u)}}finally{Mr(u)}}}}function Mr(u,f){if(u.g){$d(u);const p=u.g,b=u.v[0]?()=>{}:null;u.g=null,u.v=null,f||Xt(u,"ready");try{p.onreadystatechange=b}catch{}}}function $d(u){u.I&&(a.clearTimeout(u.I),u.I=null)}n.isActive=function(){return!!this.g};function Me(u){return u.g?u.g.readyState:0}n.Z=function(){try{return 2<Me(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(u){if(this.g){var f=this.g.responseText;return u&&f.indexOf(u)==0&&(f=f.substring(u.length)),Uy(f)}};function Hd(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.H){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function u_(u){const f={};u=(u.g&&2<=Me(u)&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let b=0;b<u.length;b++){if(P(u[b]))continue;var p=T(u[b]);const C=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const R=f[C]||[];f[C]=R,R.push(p)}k(f,function(b){return b.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ii(u,f,p){return p&&p.internalChannelParams&&p.internalChannelParams[u]||f}function Wd(u){this.Aa=0,this.i=[],this.j=new Xs,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ii("failFast",!1,u),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ii("baseRetryDelayMs",5e3,u),this.cb=ii("retryDelaySeedMs",1e4,u),this.Wa=ii("forwardChannelMaxRetries",2,u),this.wa=ii("forwardChannelRequestTimeoutMs",2e4,u),this.pa=u&&u.xmlHttpFactory||void 0,this.Xa=u&&u.Tb||void 0,this.Ca=u&&u.useFetchStreams||!1,this.L=void 0,this.J=u&&u.supportsCrossDomainXhr||!1,this.K="",this.h=new Td(u&&u.concurrentRequestLimit),this.Da=new o_,this.P=u&&u.fastHandshake||!1,this.O=u&&u.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=u&&u.Rb||!1,u&&u.xa&&this.j.xa(),u&&u.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&u&&u.detectBufferingProxy||!1,this.ja=void 0,u&&u.longPollingTimeout&&0<u.longPollingTimeout&&(this.ja=u.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Wd.prototype,n.la=8,n.G=1,n.connect=function(u,f,p,b){Jt(0),this.W=u,this.H=f||{},p&&b!==void 0&&(this.H.OSID=p,this.H.OAID=b),this.F=this.X,this.I=th(this,null,this.W),Or(this)};function Ya(u){if(qd(u),u.G==3){var f=u.U++,p=De(u.I);if(ut(p,"SID",u.K),ut(p,"RID",f),ut(p,"TYPE","terminate"),ri(u,p),f=new Ze(u,u.j,f),f.L=2,f.v=Cr(De(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(f.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=f.v,p=!0),p||(f.g=eh(f.j,null),f.g.ea(f.v)),f.F=Date.now(),Ar(f)}Zd(u)}function Lr(u){u.g&&(Xa(u),u.g.cancel(),u.g=null)}function qd(u){Lr(u),u.u&&(a.clearTimeout(u.u),u.u=null),Vr(u),u.h.cancel(),u.s&&(typeof u.s=="number"&&a.clearTimeout(u.s),u.s=null)}function Or(u){if(!Ad(u.h)&&!u.s){u.s=!0;var f=u.Ga;ot||Pe(),Dt||(ot(),Dt=!0),Et.add(f,u),u.B=0}}function d_(u,f){return Sd(u.h)>=u.h.j-(u.s?1:0)?!1:u.s?(u.i=f.D.concat(u.i),!0):u.G==1||u.G==2||u.B>=(u.Va?0:u.Wa)?!1:(u.s=Qs(g(u.Ga,u,f),Jd(u,u.B)),u.B++,!0)}n.Ga=function(u){if(this.s)if(this.s=null,this.G==1){if(!u){this.U=Math.floor(1e5*Math.random()),u=this.U++;const C=new Ze(this,this.j,u);let R=this.o;if(this.S&&(R?(R=v(R),I(R,this.S)):R=this.S),this.m!==null||this.O||(C.H=R,R=null),this.P)t:{for(var f=0,p=0;p<this.i.length;p++){e:{var b=this.i[p];if("__data__"in b.map&&(b=b.map.__data__,typeof b=="string")){b=b.length;break e}b=void 0}if(b===void 0)break;if(f+=b,4096<f){f=p;break t}if(f===4096||p===this.i.length-1){f=p+1;break t}}f=1e3}else f=1e3;f=Kd(this,C,f),p=De(this.I),ut(p,"RID",u),ut(p,"CVER",22),this.D&&ut(p,"X-HTTP-Session-Id",this.D),ri(this,p),R&&(this.O?f="headers="+encodeURIComponent(String(Bd(R)))+"&"+f:this.m&&Ka(p,this.m,R)),Ga(this.h,C),this.Ua&&ut(p,"TYPE","init"),this.P?(ut(p,"$req",f),ut(p,"SID","null"),C.T=!0,$a(C,p,null)):$a(C,p,f),this.G=2}}else this.G==3&&(u?Gd(this,u):this.i.length==0||Ad(this.h)||Gd(this))};function Gd(u,f){var p;f?p=f.l:p=u.U++;const b=De(u.I);ut(b,"SID",u.K),ut(b,"RID",p),ut(b,"AID",u.T),ri(u,b),u.m&&u.o&&Ka(b,u.m,u.o),p=new Ze(u,u.j,p,u.B+1),u.m===null&&(p.H=u.o),f&&(u.i=f.D.concat(u.i)),f=Kd(u,p,1e3),p.I=Math.round(.5*u.wa)+Math.round(.5*u.wa*Math.random()),Ga(u.h,p),$a(p,b,f)}function ri(u,f){u.H&&V(u.H,function(p,b){ut(f,b,p)}),u.l&&Rd({},function(p,b){ut(f,b,p)})}function Kd(u,f,p){p=Math.min(u.i.length,p);var b=u.l?g(u.l.Na,u.l,u):null;t:{var C=u.i;let R=-1;for(;;){const F=["count="+p];R==-1?0<p?(R=C[0].g,F.push("ofs="+R)):R=0:F.push("ofs="+R);let at=!0;for(let Mt=0;Mt<p;Mt++){let et=C[Mt].g;const jt=C[Mt].map;if(et-=R,0>et)R=Math.max(0,C[Mt].g-100),at=!1;else try{a_(jt,F,"req"+et+"_")}catch{b&&b(jt)}}if(at){b=F.join("&");break t}}}return u=u.i.splice(0,p),f.D=u,b}function Yd(u){if(!u.g&&!u.u){u.Y=1;var f=u.Fa;ot||Pe(),Dt||(ot(),Dt=!0),Et.add(f,u),u.v=0}}function Qa(u){return u.g||u.u||3<=u.v?!1:(u.Y++,u.u=Qs(g(u.Fa,u),Jd(u,u.v)),u.v++,!0)}n.Fa=function(){if(this.u=null,Qd(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var u=2*this.R;this.j.info("BP detection timer enabled: "+u),this.A=Qs(g(this.ab,this),u)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Jt(10),Lr(this),Qd(this))};function Xa(u){u.A!=null&&(a.clearTimeout(u.A),u.A=null)}function Qd(u){u.g=new Ze(u,u.j,"rpc",u.Y),u.m===null&&(u.g.H=u.o),u.g.O=0;var f=De(u.qa);ut(f,"RID","rpc"),ut(f,"SID",u.K),ut(f,"AID",u.T),ut(f,"CI",u.F?"0":"1"),!u.F&&u.ja&&ut(f,"TO",u.ja),ut(f,"TYPE","xmlhttp"),ri(u,f),u.m&&u.o&&Ka(f,u.m,u.o),u.L&&(u.g.I=u.L);var p=u.g;u=u.ia,p.L=1,p.v=Cr(De(f)),p.m=null,p.P=!0,kd(p,u)}n.Za=function(){this.C!=null&&(this.C=null,Lr(this),Qa(this),Jt(19))};function Vr(u){u.C!=null&&(a.clearTimeout(u.C),u.C=null)}function Xd(u,f){var p=null;if(u.g==f){Vr(u),Xa(u),u.g=null;var b=2}else if(qa(u.h,f))p=f.D,Pd(u.h,f),b=1;else return;if(u.G!=0){if(f.o)if(b==1){p=f.m?f.m.length:0,f=Date.now()-f.F;var C=u.B;b=Er(),Xt(b,new bd(b,p)),Or(u)}else Yd(u);else if(C=f.s,C==3||C==0&&0<f.X||!(b==1&&d_(u,f)||b==2&&Qa(u)))switch(p&&0<p.length&&(f=u.h,f.i=f.i.concat(p)),C){case 1:On(u,5);break;case 4:On(u,10);break;case 3:On(u,6);break;default:On(u,2)}}}function Jd(u,f){let p=u.Ta+Math.floor(Math.random()*u.cb);return u.isActive()||(p*=2),p*f}function On(u,f){if(u.j.info("Error code "+f),f==2){var p=g(u.fb,u),b=u.Xa;const C=!b;b=new Ln(b||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Sr(b,"https"),Cr(b),C?i_(b.toString(),p):r_(b.toString(),p)}else Jt(2);u.G=0,u.l&&u.l.sa(f),Zd(u),qd(u)}n.fb=function(u){u?(this.j.info("Successfully pinged google.com"),Jt(2)):(this.j.info("Failed to ping google.com"),Jt(1))};function Zd(u){if(u.G=0,u.ka=[],u.l){const f=Cd(u.h);(f.length!=0||u.i.length!=0)&&(w(u.ka,f),w(u.ka,u.i),u.h.i.length=0,_(u.i),u.i.length=0),u.l.ra()}}function th(u,f,p){var b=p instanceof Ln?De(p):new Ln(p);if(b.g!="")f&&(b.g=f+"."+b.g),Pr(b,b.s);else{var C=a.location;b=C.protocol,f=f?f+"."+C.hostname:C.hostname,C=+C.port;var R=new Ln(null);b&&Sr(R,b),f&&(R.g=f),C&&Pr(R,C),p&&(R.l=p),b=R}return p=u.D,f=u.ya,p&&f&&ut(b,p,f),ut(b,"VER",u.la),ri(u,b),b}function eh(u,f,p){if(f&&!u.J)throw Error("Can't create secondary domain capable XhrIo object.");return f=u.Ca&&!u.pa?new bt(new Rr({eb:p})):new bt(u.pa),f.Ha(u.J),f}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function nh(){}n=nh.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Nr(){}Nr.prototype.g=function(u,f){return new se(u,f)};function se(u,f){Bt.call(this),this.g=new Wd(f),this.l=u,this.h=f&&f.messageUrlParams||null,u=f&&f.messageHeaders||null,f&&f.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=f&&f.initMessageHeaders||null,f&&f.messageContentType&&(u?u["X-WebChannel-Content-Type"]=f.messageContentType:u={"X-WebChannel-Content-Type":f.messageContentType}),f&&f.va&&(u?u["X-WebChannel-Client-Profile"]=f.va:u={"X-WebChannel-Client-Profile":f.va}),this.g.S=u,(u=f&&f.Sb)&&!P(u)&&(this.g.m=u),this.v=f&&f.supportsCrossDomainXhr||!1,this.u=f&&f.sendRawJson||!1,(f=f&&f.httpSessionIdParam)&&!P(f)&&(this.g.D=f,u=this.h,u!==null&&f in u&&(u=this.h,f in u&&delete u[f])),this.j=new cs(this)}y(se,Bt),se.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},se.prototype.close=function(){Ya(this.g)},se.prototype.o=function(u){var f=this.g;if(typeof u=="string"){var p={};p.__data__=u,u=p}else this.u&&(p={},p.__data__=Na(u),u=p);f.i.push(new Ky(f.Ya++,u)),f.G==3&&Or(f)},se.prototype.N=function(){this.g.l=null,delete this.j,Ya(this.g),delete this.g,se.aa.N.call(this)};function sh(u){Ba.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var f=u.__sm__;if(f){t:{for(const p in f){u=p;break t}u=void 0}(this.i=u)&&(u=this.i,f=f!==null&&u in f?f[u]:void 0),this.data=f}else this.data=u}y(sh,Ba);function ih(){ja.call(this),this.status=1}y(ih,ja);function cs(u){this.g=u}y(cs,nh),cs.prototype.ua=function(){Xt(this.g,"a")},cs.prototype.ta=function(u){Xt(this.g,new sh(u))},cs.prototype.sa=function(u){Xt(this.g,new ih)},cs.prototype.ra=function(){Xt(this.g,"b")},Nr.prototype.createWebChannel=Nr.prototype.g,se.prototype.send=se.prototype.o,se.prototype.open=se.prototype.m,se.prototype.close=se.prototype.close,tm=function(){return new Nr},Zp=function(){return Er()},Jp=Dn,Bl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ir.NO_ERROR=0,Ir.TIMEOUT=8,Ir.HTTP_ERROR=6,co=Ir,vd.COMPLETE="complete",Xp=vd,pd.EventType=Ks,Ks.OPEN="a",Ks.CLOSE="b",Ks.ERROR="c",Ks.MESSAGE="d",Bt.prototype.listen=Bt.prototype.K,mi=pd,bt.prototype.listenOnce=bt.prototype.L,bt.prototype.getLastError=bt.prototype.Ka,bt.prototype.getLastErrorCode=bt.prototype.Ba,bt.prototype.getStatus=bt.prototype.Z,bt.prototype.getResponseJson=bt.prototype.Oa,bt.prototype.getResponseText=bt.prototype.oa,bt.prototype.send=bt.prototype.ea,bt.prototype.setWithCredentials=bt.prototype.Ha,Qp=bt}).apply(typeof jr<"u"?jr:typeof self<"u"?self:typeof window<"u"?window:{});const Vh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Ht.UNAUTHENTICATED=new Ht(null),Ht.GOOGLE_CREDENTIALS=new Ht("google-credentials-uid"),Ht.FIRST_PARTY=new Ht("first-party-uid"),Ht.MOCK_USER=new Ht("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $s="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn=new Cc("@firebase/firestore");function oi(){return xn.logLevel}function gx(n){xn.setLogLevel(n)}function U(n,...t){if(xn.logLevel<=J.DEBUG){const e=t.map(zc);xn.debug(`Firestore (${$s}): ${n}`,...e)}}function Ye(n,...t){if(xn.logLevel<=J.ERROR){const e=t.map(zc);xn.error(`Firestore (${$s}): ${n}`,...e)}}function Ps(n,...t){if(xn.logLevel<=J.WARN){const e=t.map(zc);xn.warn(`Firestore (${$s}): ${n}`,...e)}}function zc(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H(n="Unexpected state"){const t=`FIRESTORE (${$s}) INTERNAL ASSERTION FAILED: `+n;throw Ye(t),new Error(t)}function rt(n,t){n||H()}function G(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class j extends Xe{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class px{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(Ht.UNAUTHENTICATED))}shutdown(){}}class mx{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class yx{constructor(t){this.t=t,this.currentUser=Ht.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){rt(this.o===void 0);let s=this.i;const i=l=>this.i!==s?(s=this.i,e(l)):Promise.resolve();let r=new qe;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new qe,t.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const l=r;t.enqueueRetryable(async()=>{await l.promise,await i(this.currentUser)})},a=l=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(l=>a(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?a(l):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new qe)}},0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(s=>this.i!==t?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(rt(typeof s.accessToken=="string"),new em(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return rt(t===null||typeof t=="string"),new Ht(t)}}class _x{constructor(t,e,s){this.l=t,this.h=e,this.P=s,this.type="FirstParty",this.user=Ht.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class bx{constructor(t,e,s){this.l=t,this.h=e,this.P=s}getToken(){return Promise.resolve(new _x(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(Ht.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class vx{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class wx{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){rt(this.o===void 0);const s=r=>{r.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,U("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(r.token):Promise.resolve()};this.o=r=>{t.enqueueRetryable(()=>s(r))};const i=r=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(rt(typeof e.token=="string"),this.R=e.token,new vx(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xx(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let s=0;s<n;s++)e[s]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nm{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let s="";for(;s.length<20;){const i=xx(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<e&&(s+=t.charAt(i[r]%t.length))}return s}}function nt(n,t){return n<t?-1:n>t?1:0}function Cs(n,t,e){return n.length===t.length&&n.every((s,i)=>e(s,t[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new j(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new j(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return pt.fromMillis(Date.now())}static fromDate(t){return pt.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),s=Math.floor(1e6*(t-1e3*e));return new pt(e,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?nt(this.nanoseconds,t.nanoseconds):nt(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(t){this.timestamp=t}static fromTimestamp(t){return new W(t)}static min(){return new W(new pt(0,0))}static max(){return new W(new pt(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(t,e,s){e===void 0?e=0:e>t.length&&H(),s===void 0?s=t.length-e:s>t.length-e&&H(),this.segments=t,this.offset=e,this.len=s}get length(){return this.len}isEqual(t){return ji.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof ji?t.forEach(s=>{e.push(s)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,s=this.limit();e<s;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const s=Math.min(t.length,e.length);for(let i=0;i<s;i++){const r=t.get(i),o=e.get(i);if(r<o)return-1;if(r>o)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class dt extends ji{construct(t,e,s){return new dt(t,e,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const s of t){if(s.indexOf("//")>=0)throw new j(O.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);e.push(...s.split("/").filter(i=>i.length>0))}return new dt(e)}static emptyPath(){return new dt([])}}const kx=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ot extends ji{construct(t,e,s){return new Ot(t,e,s)}static isValidIdentifier(t){return kx.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ot.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ot(["__name__"])}static fromServerFormat(t){const e=[];let s="",i=0;const r=()=>{if(s.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(s),s=""};let o=!1;for(;i<t.length;){const a=t[i];if(a==="\\"){if(i+1===t.length)throw new j(O.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const l=t[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new j(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);s+=l,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(s+=a,i++):(r(),i++)}if(r(),o)throw new j(O.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Ot(e)}static emptyPath(){return new Ot([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(t){this.path=t}static fromPath(t){return new z(dt.fromString(t))}static fromName(t){return new z(dt.fromString(t).popFirst(5))}static empty(){return new z(dt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&dt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return dt.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new z(new dt(t.slice()))}}function Ex(n,t){const e=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,i=W.fromTimestamp(s===1e9?new pt(e+1,0):new pt(e,s));return new kn(i,z.empty(),t)}function Ix(n){return new kn(n.readTime,n.key,-1)}class kn{constructor(t,e,s){this.readTime=t,this.documentKey=e,this.largestBatchId=s}static min(){return new kn(W.min(),z.empty(),-1)}static max(){return new kn(W.max(),z.empty(),-1)}}function Tx(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=z.comparator(n.documentKey,t.documentKey),e!==0?e:nt(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ax="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Sx{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cr(n){if(n.code!==O.FAILED_PRECONDITION||n.message!==Ax)throw n;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&H(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(t,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(e,r).next(s,i)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof N?e:N.resolve(e)}catch(e){return N.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):N.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):N.reject(e)}static resolve(t){return new N((e,s)=>{e(t)})}static reject(t){return new N((e,s)=>{s(t)})}static waitFor(t){return new N((e,s)=>{let i=0,r=0,o=!1;t.forEach(a=>{++i,a.next(()=>{++r,o&&r===i&&e()},l=>s(l))}),o=!0,r===i&&e()})}static or(t){let e=N.resolve(!1);for(const s of t)e=e.next(i=>i?N.resolve(i):s());return e}static forEach(t,e){const s=[];return t.forEach((i,r)=>{s.push(e.call(this,i,r))}),this.waitFor(s)}static mapArray(t,e){return new N((s,i)=>{const r=t.length,o=new Array(r);let a=0;for(let l=0;l<r;l++){const c=l;e(t[c]).next(d=>{o[c]=d,++a,a===r&&s(o)},d=>i(d))}})}static doWhile(t,e){return new N((s,i)=>{const r=()=>{t()===!0?e().next(()=>{r()},i):s()};r()})}}function Px(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function ur(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=s=>this.ie(s),this.se=s=>e.writeSequenceNumber(s))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}$c.oe=-1;function oa(n){return n==null}function Oo(n){return n===0&&1/n==-1/0}function Cx(n){return typeof n=="number"&&Number.isInteger(n)&&!Oo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nh(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function es(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function sm(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(t,e){this.comparator=t,this.root=e||Lt.EMPTY}insert(t,e){return new yt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Lt.BLACK,null,null))}remove(t){return new yt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Lt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const s=this.comparator(t,e.key);if(s===0)return e.value;s<0?e=e.left:s>0&&(e=e.right)}return null}indexOf(t){let e=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(t,s.key);if(i===0)return e+s.left.size;i<0?s=s.left:(e+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,s)=>(t(e,s),!1))}toString(){const t=[];return this.inorderTraversal((e,s)=>(t.push(`${e}:${s}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Ur(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Ur(this.root,t,this.comparator,!1)}getReverseIterator(){return new Ur(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Ur(this.root,t,this.comparator,!0)}}class Ur{constructor(t,e,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!t.isEmpty();)if(r=e?s(t.key,e):1,e&&i&&(r*=-1),r<0)t=this.isReverse?t.left:t.right;else{if(r===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Lt{constructor(t,e,s,i,r){this.key=t,this.value=e,this.color=s??Lt.RED,this.left=i??Lt.EMPTY,this.right=r??Lt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,s,i,r){return new Lt(t??this.key,e??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,s){let i=this;const r=s(t,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(t,e,s),null):r===0?i.copy(null,e,null,null,null):i.copy(null,null,null,null,i.right.insert(t,e,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Lt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let s,i=this;if(e(t,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(t,e),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),e(t,i.key)===0){if(i.right.isEmpty())return Lt.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(t,e))}return i.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Lt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Lt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw H();const t=this.left.check();if(t!==this.right.check())throw H();return t+(this.isRed()?0:1)}}Lt.EMPTY=null,Lt.RED=!0,Lt.BLACK=!1;Lt.EMPTY=new class{constructor(){this.size=0}get key(){throw H()}get value(){throw H()}get color(){throw H()}get left(){throw H()}get right(){throw H()}copy(t,e,s,i,r){return this}insert(t,e,s){return new Lt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(t){this.comparator=t,this.data=new yt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,s)=>(t(e),!1))}forEachInRange(t,e){const s=this.data.getIteratorFrom(t[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,t[1])>=0)return;e(i.key)}}forEachWhile(t,e){let s;for(s=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();s.hasNext();)if(!t(s.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Fh(this.data.getIterator())}getIteratorFrom(t){return new Fh(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(s=>{e=e.add(s)}),e}isEqual(t){if(!(t instanceof Vt)||this.size!==t.size)return!1;const e=this.data.getIterator(),s=t.data.getIterator();for(;e.hasNext();){const i=e.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Vt(this.comparator);return e.data=t,e}}class Fh{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(t){this.fields=t,t.sort(Ot.comparator)}static empty(){return new re([])}unionWith(t){let e=new Vt(Ot.comparator);for(const s of this.fields)e=e.add(s);for(const s of t)e=e.add(s);return new re(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Cs(this.fields,t.fields,(e,s)=>e.isEqual(s))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class im extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new im("Invalid base64 string: "+r):r}}(t);return new Nt(e)}static fromUint8Array(t){const e=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(t);return new Nt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const s=new Uint8Array(e.length);for(let i=0;i<e.length;i++)s[i]=e.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return nt(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Nt.EMPTY_BYTE_STRING=new Nt("");const Rx=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function En(n){if(rt(!!n),typeof n=="string"){let t=0;const e=Rx.exec(n);if(rt(!!e),e[1]){let i=e[1];i=(i+"000000000").substr(0,9),t=Number(i)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:t}}return{seconds:xt(n.seconds),nanos:xt(n.nanos)}}function xt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Qn(n){return typeof n=="string"?Nt.fromBase64String(n):Nt.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hc(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function Wc(n){const t=n.mapValue.fields.__previous_value__;return Hc(t)?Wc(t):t}function Ui(n){const t=En(n.mapValue.fields.__local_write_time__.timestampValue);return new pt(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dx{constructor(t,e,s,i,r,o,a,l,c){this.databaseId=t,this.appId=e,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=l,this.useFetchStreams=c}}class zi{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new zi("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof zi&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr={mapValue:{}};function Xn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Hc(n)?4:Lx(n)?9007199254740991:Mx(n)?10:11:H()}function Se(n,t){if(n===t)return!0;const e=Xn(n);if(e!==Xn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Ui(n).isEqual(Ui(t));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=En(i.timestampValue),a=En(r.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(i,r){return Qn(i.bytesValue).isEqual(Qn(r.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(i,r){return xt(i.geoPointValue.latitude)===xt(r.geoPointValue.latitude)&&xt(i.geoPointValue.longitude)===xt(r.geoPointValue.longitude)}(n,t);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return xt(i.integerValue)===xt(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=xt(i.doubleValue),a=xt(r.doubleValue);return o===a?Oo(o)===Oo(a):isNaN(o)&&isNaN(a)}return!1}(n,t);case 9:return Cs(n.arrayValue.values||[],t.arrayValue.values||[],Se);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},a=r.mapValue.fields||{};if(Nh(o)!==Nh(a))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(a[l]===void 0||!Se(o[l],a[l])))return!1;return!0}(n,t);default:return H()}}function $i(n,t){return(n.values||[]).find(e=>Se(e,t))!==void 0}function Rs(n,t){if(n===t)return 0;const e=Xn(n),s=Xn(t);if(e!==s)return nt(e,s);switch(e){case 0:case 9007199254740991:return 0;case 1:return nt(n.booleanValue,t.booleanValue);case 2:return function(r,o){const a=xt(r.integerValue||r.doubleValue),l=xt(o.integerValue||o.doubleValue);return a<l?-1:a>l?1:a===l?0:isNaN(a)?isNaN(l)?0:-1:1}(n,t);case 3:return Bh(n.timestampValue,t.timestampValue);case 4:return Bh(Ui(n),Ui(t));case 5:return nt(n.stringValue,t.stringValue);case 6:return function(r,o){const a=Qn(r),l=Qn(o);return a.compareTo(l)}(n.bytesValue,t.bytesValue);case 7:return function(r,o){const a=r.split("/"),l=o.split("/");for(let c=0;c<a.length&&c<l.length;c++){const d=nt(a[c],l[c]);if(d!==0)return d}return nt(a.length,l.length)}(n.referenceValue,t.referenceValue);case 8:return function(r,o){const a=nt(xt(r.latitude),xt(o.latitude));return a!==0?a:nt(xt(r.longitude),xt(o.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return jh(n.arrayValue,t.arrayValue);case 10:return function(r,o){var a,l,c,d;const h=r.fields||{},g=o.fields||{},m=(a=h.value)===null||a===void 0?void 0:a.arrayValue,y=(l=g.value)===null||l===void 0?void 0:l.arrayValue,_=nt(((c=m==null?void 0:m.values)===null||c===void 0?void 0:c.length)||0,((d=y==null?void 0:y.values)===null||d===void 0?void 0:d.length)||0);return _!==0?_:jh(m,y)}(n.mapValue,t.mapValue);case 11:return function(r,o){if(r===zr.mapValue&&o===zr.mapValue)return 0;if(r===zr.mapValue)return 1;if(o===zr.mapValue)return-1;const a=r.fields||{},l=Object.keys(a),c=o.fields||{},d=Object.keys(c);l.sort(),d.sort();for(let h=0;h<l.length&&h<d.length;++h){const g=nt(l[h],d[h]);if(g!==0)return g;const m=Rs(a[l[h]],c[d[h]]);if(m!==0)return m}return nt(l.length,d.length)}(n.mapValue,t.mapValue);default:throw H()}}function Bh(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return nt(n,t);const e=En(n),s=En(t),i=nt(e.seconds,s.seconds);return i!==0?i:nt(e.nanos,s.nanos)}function jh(n,t){const e=n.values||[],s=t.values||[];for(let i=0;i<e.length&&i<s.length;++i){const r=Rs(e[i],s[i]);if(r)return r}return nt(e.length,s.length)}function Ds(n){return jl(n)}function jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const s=En(e);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return Qn(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return z.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let s="[",i=!0;for(const r of e.values||[])i?i=!1:s+=",",s+=jl(r);return s+"]"}(n.arrayValue):"mapValue"in n?function(e){const s=Object.keys(e.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${jl(e.fields[o])}`;return i+"}"}(n.mapValue):H()}function Uh(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function Ul(n){return!!n&&"integerValue"in n}function qc(n){return!!n&&"arrayValue"in n}function zh(n){return!!n&&"nullValue"in n}function $h(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function uo(n){return!!n&&"mapValue"in n}function Mx(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="__vector__"}function Si(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const t={mapValue:{fields:{}}};return es(n.mapValue.fields,(e,s)=>t.mapValue.fields[e]=Si(s)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=Si(n.arrayValue.values[e]);return t}return Object.assign({},n)}function Lx(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t){this.value=t}static empty(){return new ee({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let s=0;s<t.length-1;++s)if(e=(e.mapValue.fields||{})[t.get(s)],!uo(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=Si(e)}setAll(t){let e=Ot.emptyPath(),s={},i=[];t.forEach((o,a)=>{if(!e.isImmediateParentOf(a)){const l=this.getFieldsMap(e);this.applyChanges(l,s,i),s={},i=[],e=a.popLast()}o?s[a.lastSegment()]=Si(o):i.push(a.lastSegment())});const r=this.getFieldsMap(e);this.applyChanges(r,s,i)}delete(t){const e=this.field(t.popLast());uo(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Se(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let s=0;s<t.length;++s){let i=e.mapValue.fields[t.get(s)];uo(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},e.mapValue.fields[t.get(s)]=i),e=i}return e.mapValue.fields}applyChanges(t,e,s){es(e,(i,r)=>t[i]=r);for(const i of s)delete t[i]}clone(){return new ee(Si(this.value))}}function rm(n){const t=[];return es(n.fields,(e,s)=>{const i=new Ot([e]);if(uo(s)){const r=rm(s.mapValue).fields;if(r.length===0)t.push(i);else for(const o of r)t.push(i.child(o))}else t.push(i)}),new re(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t,e,s,i,r,o,a){this.key=t,this.documentType=e,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=a}static newInvalidDocument(t){return new qt(t,0,W.min(),W.min(),W.min(),ee.empty(),0)}static newFoundDocument(t,e,s,i){return new qt(t,1,e,W.min(),s,i,0)}static newNoDocument(t,e){return new qt(t,2,e,W.min(),W.min(),ee.empty(),0)}static newUnknownDocument(t,e){return new qt(t,3,e,W.min(),W.min(),ee.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(W.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=ee.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=ee.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=W.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof qt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new qt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(t,e){this.position=t,this.inclusive=e}}function Hh(n,t,e){let s=0;for(let i=0;i<n.position.length;i++){const r=t[i],o=n.position[i];if(r.field.isKeyField()?s=z.comparator(z.fromName(o.referenceValue),e.key):s=Rs(o,e.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Wh(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Se(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{constructor(t,e="asc"){this.field=t,this.dir=e}}function Ox(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{}class Tt extends om{constructor(t,e,s){super(),this.field=t,this.op=e,this.value=s}static create(t,e,s){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,s):new Nx(t,e,s):e==="array-contains"?new jx(t,s):e==="in"?new Ux(t,s):e==="not-in"?new zx(t,s):e==="array-contains-any"?new $x(t,s):new Tt(t,e,s)}static createKeyFieldInFilter(t,e,s){return e==="in"?new Fx(t,s):new Bx(t,s)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(Rs(e,this.value)):e!==null&&Xn(this.value)===Xn(e)&&this.matchesComparison(Rs(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return H()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class _e extends om{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new _e(t,e)}matches(t){return am(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function am(n){return n.op==="and"}function lm(n){return Vx(n)&&am(n)}function Vx(n){for(const t of n.filters)if(t instanceof _e)return!1;return!0}function zl(n){if(n instanceof Tt)return n.field.canonicalString()+n.op.toString()+Ds(n.value);if(lm(n))return n.filters.map(t=>zl(t)).join(",");{const t=n.filters.map(e=>zl(e)).join(",");return`${n.op}(${t})`}}function cm(n,t){return n instanceof Tt?function(s,i){return i instanceof Tt&&s.op===i.op&&s.field.isEqual(i.field)&&Se(s.value,i.value)}(n,t):n instanceof _e?function(s,i){return i instanceof _e&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,a)=>r&&cm(o,i.filters[a]),!0):!1}(n,t):void H()}function um(n){return n instanceof Tt?function(e){return`${e.field.canonicalString()} ${e.op} ${Ds(e.value)}`}(n):n instanceof _e?function(e){return e.op.toString()+" {"+e.getFilters().map(um).join(" ,")+"}"}(n):"Filter"}class Nx extends Tt{constructor(t,e,s){super(t,e,s),this.key=z.fromName(s.referenceValue)}matches(t){const e=z.comparator(t.key,this.key);return this.matchesComparison(e)}}class Fx extends Tt{constructor(t,e){super(t,"in",e),this.keys=dm("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Bx extends Tt{constructor(t,e){super(t,"not-in",e),this.keys=dm("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function dm(n,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(s=>z.fromName(s.referenceValue))}class jx extends Tt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return qc(e)&&$i(e.arrayValue,this.value)}}class Ux extends Tt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&$i(this.value.arrayValue,e)}}class zx extends Tt{constructor(t,e){super(t,"not-in",e)}matches(t){if($i(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!$i(this.value.arrayValue,e)}}class $x extends Tt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!qc(e)||!e.arrayValue.values)&&e.arrayValue.values.some(s=>$i(this.value.arrayValue,s))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hx{constructor(t,e=null,s=[],i=[],r=null,o=null,a=null){this.path=t,this.collectionGroup=e,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=a,this.ue=null}}function qh(n,t=null,e=[],s=[],i=null,r=null,o=null){return new Hx(n,t,e,s,i,r,o)}function Gc(n){const t=G(n);if(t.ue===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(s=>zl(s)).join(","),e+="|ob:",e+=t.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),oa(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(s=>Ds(s)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(s=>Ds(s)).join(",")),t.ue=e}return t.ue}function Kc(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!Ox(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!cm(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!Wh(n.startAt,t.startAt)&&Wh(n.endAt,t.endAt)}function $l(n){return z.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(t,e=null,s=[],i=[],r=null,o="F",a=null,l=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=a,this.endAt=l,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Wx(n,t,e,s,i,r,o,a){return new dr(n,t,e,s,i,r,o,a)}function aa(n){return new dr(n)}function Gh(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function hm(n){return n.collectionGroup!==null}function Pi(n){const t=G(n);if(t.ce===null){t.ce=[];const e=new Set;for(const r of t.explicitOrderBy)t.ce.push(r),e.add(r.field.canonicalString());const s=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Vt(Ot.comparator);return o.filters.forEach(l=>{l.getFlattenedFilters().forEach(c=>{c.isInequality()&&(a=a.add(c.field))})}),a})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.ce.push(new No(r,s))}),e.has(Ot.keyField().canonicalString())||t.ce.push(new No(Ot.keyField(),s))}return t.ce}function Ie(n){const t=G(n);return t.le||(t.le=qx(t,Pi(n))),t.le}function qx(n,t){if(n.limitType==="F")return qh(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new No(i.field,r)});const e=n.endAt?new Vo(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Vo(n.startAt.position,n.startAt.inclusive):null;return qh(n.path,n.collectionGroup,t,n.filters,n.limit,e,s)}}function Hl(n,t){const e=n.filters.concat([t]);return new dr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Wl(n,t,e){return new dr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function la(n,t){return Kc(Ie(n),Ie(t))&&n.limitType===t.limitType}function fm(n){return`${Gc(Ie(n))}|lt:${n.limitType}`}function gs(n){return`Query(target=${function(e){let s=e.path.canonicalString();return e.collectionGroup!==null&&(s+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(s+=`, filters: [${e.filters.map(i=>um(i)).join(", ")}]`),oa(e.limit)||(s+=", limit: "+e.limit),e.orderBy.length>0&&(s+=`, orderBy: [${e.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),e.startAt&&(s+=", startAt: ",s+=e.startAt.inclusive?"b:":"a:",s+=e.startAt.position.map(i=>Ds(i)).join(",")),e.endAt&&(s+=", endAt: ",s+=e.endAt.inclusive?"a:":"b:",s+=e.endAt.position.map(i=>Ds(i)).join(",")),`Target(${s})`}(Ie(n))}; limitType=${n.limitType})`}function ca(n,t){return t.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):z.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(n,t)&&function(s,i){for(const r of Pi(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(n,t)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(n,t)&&function(s,i){return!(s.startAt&&!function(o,a,l){const c=Hh(o,a,l);return o.inclusive?c<=0:c<0}(s.startAt,Pi(s),i)||s.endAt&&!function(o,a,l){const c=Hh(o,a,l);return o.inclusive?c>=0:c>0}(s.endAt,Pi(s),i))}(n,t)}function Gx(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function gm(n){return(t,e)=>{let s=!1;for(const i of Pi(n)){const r=Kx(i,t,e);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function Kx(n,t,e){const s=n.field.isKeyField()?z.comparator(t.key,e.key):function(r,o,a){const l=o.data.field(r),c=a.data.field(r);return l!==null&&c!==null?Rs(l,c):H()}(n.field,t,e);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return H()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),s=this.inner[e];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,t))return r}}has(t){return this.get(t)!==void 0}set(t,e){const s=this.mapKeyFn(t),i=this.inner[s];if(i===void 0)return this.inner[s]=[[t,e]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],t))return void(i[r]=[t,e]);i.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),s=this.inner[e];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return s.length===1?delete this.inner[e]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(t){es(this.inner,(e,s)=>{for(const[i,r]of s)t(i,r)})}isEmpty(){return sm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yx=new yt(z.comparator);function Qe(){return Yx}const pm=new yt(z.comparator);function yi(...n){let t=pm;for(const e of n)t=t.insert(e.key,e);return t}function mm(n){let t=pm;return n.forEach((e,s)=>t=t.insert(e,s.overlayedDocument)),t}function $n(){return Ci()}function ym(){return Ci()}function Ci(){return new Hs(n=>n.toString(),(n,t)=>n.isEqual(t))}const Qx=new yt(z.comparator),Xx=new Vt(z.comparator);function Q(...n){let t=Xx;for(const e of n)t=t.add(e);return t}const Jx=new Vt(nt);function Zx(){return Jx}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Oo(t)?"-0":t}}function _m(n){return{integerValue:""+n}}function tk(n,t){return Cx(t)?_m(t):Yc(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(){this._=void 0}}function ek(n,t,e){return n instanceof Fo?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&Hc(r)&&(r=Wc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(e,t):n instanceof Hi?vm(n,t):n instanceof Wi?wm(n,t):function(i,r){const o=bm(i,r),a=Kh(o)+Kh(i.Pe);return Ul(o)&&Ul(i.Pe)?_m(a):Yc(i.serializer,a)}(n,t)}function nk(n,t,e){return n instanceof Hi?vm(n,t):n instanceof Wi?wm(n,t):e}function bm(n,t){return n instanceof Bo?function(s){return Ul(s)||function(r){return!!r&&"doubleValue"in r}(s)}(t)?t:{integerValue:0}:null}class Fo extends ua{}class Hi extends ua{constructor(t){super(),this.elements=t}}function vm(n,t){const e=xm(t);for(const s of n.elements)e.some(i=>Se(i,s))||e.push(s);return{arrayValue:{values:e}}}class Wi extends ua{constructor(t){super(),this.elements=t}}function wm(n,t){let e=xm(t);for(const s of n.elements)e=e.filter(i=>!Se(i,s));return{arrayValue:{values:e}}}class Bo extends ua{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function Kh(n){return xt(n.integerValue||n.doubleValue)}function xm(n){return qc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function sk(n,t){return n.field.isEqual(t.field)&&function(s,i){return s instanceof Hi&&i instanceof Hi||s instanceof Wi&&i instanceof Wi?Cs(s.elements,i.elements,Se):s instanceof Bo&&i instanceof Bo?Se(s.Pe,i.Pe):s instanceof Fo&&i instanceof Fo}(n.transform,t.transform)}class ik{constructor(t,e){this.version=t,this.transformResults=e}}class pe{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new pe}static exists(t){return new pe(void 0,t)}static updateTime(t){return new pe(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function ho(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class da{}function km(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new Qc(n.key,pe.none()):new hr(n.key,n.data,pe.none());{const e=n.data,s=ee.empty();let i=new Vt(Ot.comparator);for(let r of t.fields)if(!i.has(r)){let o=e.field(r);o===null&&r.length>1&&(r=r.popLast(),o=e.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new Cn(n.key,s,new re(i.toArray()),pe.none())}}function rk(n,t,e){n instanceof hr?function(i,r,o){const a=i.value.clone(),l=Qh(i.fieldTransforms,r,o.transformResults);a.setAll(l),r.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(n,t,e):n instanceof Cn?function(i,r,o){if(!ho(i.precondition,r))return void r.convertToUnknownDocument(o.version);const a=Qh(i.fieldTransforms,r,o.transformResults),l=r.data;l.setAll(Em(i)),l.setAll(a),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,t,e):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,t,e)}function Ri(n,t,e,s){return n instanceof hr?function(r,o,a,l){if(!ho(r.precondition,o))return a;const c=r.value.clone(),d=Xh(r.fieldTransforms,l,o);return c.setAll(d),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(n,t,e,s):n instanceof Cn?function(r,o,a,l){if(!ho(r.precondition,o))return a;const c=Xh(r.fieldTransforms,l,o),d=o.data;return d.setAll(Em(r)),d.setAll(c),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),a===null?null:a.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(h=>h.field))}(n,t,e,s):function(r,o,a){return ho(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(n,t,e)}function ok(n,t){let e=null;for(const s of n.fieldTransforms){const i=t.data.field(s.field),r=bm(s.transform,i||null);r!=null&&(e===null&&(e=ee.empty()),e.set(s.field,r))}return e||null}function Yh(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Cs(s,i,(r,o)=>sk(r,o))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class hr extends da{constructor(t,e,s,i=[]){super(),this.key=t,this.value=e,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Cn extends da{constructor(t,e,s,i,r=[]){super(),this.key=t,this.data=e,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function Em(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const s=n.data.field(e);t.set(e,s)}}),t}function Qh(n,t,e){const s=new Map;rt(n.length===e.length);for(let i=0;i<e.length;i++){const r=n[i],o=r.transform,a=t.data.field(r.field);s.set(r.field,nk(o,a,e[i]))}return s}function Xh(n,t,e){const s=new Map;for(const i of n){const r=i.transform,o=e.data.field(i.field);s.set(i.field,ek(r,o,t))}return s}class Qc extends da{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ak extends da{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lk{constructor(t,e,s,i){this.batchId=t,this.localWriteTime=e,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(t,e){const s=e.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(t.key)&&rk(r,t,s[i])}}applyToLocalView(t,e){for(const s of this.baseMutations)s.key.isEqual(t.key)&&(e=Ri(s,t,e,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(t.key)&&(e=Ri(s,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const s=ym();return this.mutations.forEach(i=>{const r=t.get(i.key),o=r.overlayedDocument;let a=this.applyToLocalView(o,r.mutatedFields);a=e.has(i.key)?null:a;const l=km(o,a);l!==null&&s.set(i.key,l),o.isValidDocument()||o.convertToNoDocument(W.min())}),s}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),Q())}isEqual(t){return this.batchId===t.batchId&&Cs(this.mutations,t.mutations,(e,s)=>Yh(e,s))&&Cs(this.baseMutations,t.baseMutations,(e,s)=>Yh(e,s))}}class Xc{constructor(t,e,s,i){this.batch=t,this.commitVersion=e,this.mutationResults=s,this.docVersions=i}static from(t,e,s){rt(t.mutations.length===s.length);let i=function(){return Qx}();const r=t.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new Xc(t,e,s,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ck{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uk{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var It,tt;function dk(n){switch(n){default:return H();case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0}}function Im(n){if(n===void 0)return Ye("GRPC error has no .code"),O.UNKNOWN;switch(n){case It.OK:return O.OK;case It.CANCELLED:return O.CANCELLED;case It.UNKNOWN:return O.UNKNOWN;case It.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case It.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case It.INTERNAL:return O.INTERNAL;case It.UNAVAILABLE:return O.UNAVAILABLE;case It.UNAUTHENTICATED:return O.UNAUTHENTICATED;case It.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case It.NOT_FOUND:return O.NOT_FOUND;case It.ALREADY_EXISTS:return O.ALREADY_EXISTS;case It.PERMISSION_DENIED:return O.PERMISSION_DENIED;case It.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case It.ABORTED:return O.ABORTED;case It.OUT_OF_RANGE:return O.OUT_OF_RANGE;case It.UNIMPLEMENTED:return O.UNIMPLEMENTED;case It.DATA_LOSS:return O.DATA_LOSS;default:return H()}}(tt=It||(It={}))[tt.OK=0]="OK",tt[tt.CANCELLED=1]="CANCELLED",tt[tt.UNKNOWN=2]="UNKNOWN",tt[tt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",tt[tt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",tt[tt.NOT_FOUND=5]="NOT_FOUND",tt[tt.ALREADY_EXISTS=6]="ALREADY_EXISTS",tt[tt.PERMISSION_DENIED=7]="PERMISSION_DENIED",tt[tt.UNAUTHENTICATED=16]="UNAUTHENTICATED",tt[tt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",tt[tt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",tt[tt.ABORTED=10]="ABORTED",tt[tt.OUT_OF_RANGE=11]="OUT_OF_RANGE",tt[tt.UNIMPLEMENTED=12]="UNIMPLEMENTED",tt[tt.INTERNAL=13]="INTERNAL",tt[tt.UNAVAILABLE=14]="UNAVAILABLE",tt[tt.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hk(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fk=new Wn([4294967295,4294967295],0);function Jh(n){const t=hk().encode(n),e=new Yp;return e.update(t),new Uint8Array(e.digest())}function Zh(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),s=t.getUint32(4,!0),i=t.getUint32(8,!0),r=t.getUint32(12,!0);return[new Wn([e,s],0),new Wn([i,r],0)]}class Jc{constructor(t,e,s){if(this.bitmap=t,this.padding=e,this.hashCount=s,e<0||e>=8)throw new _i(`Invalid padding: ${e}`);if(s<0)throw new _i(`Invalid hash count: ${s}`);if(t.length>0&&this.hashCount===0)throw new _i(`Invalid hash count: ${s}`);if(t.length===0&&e!==0)throw new _i(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=Wn.fromNumber(this.Ie)}Ee(t,e,s){let i=t.add(e.multiply(Wn.fromNumber(s)));return i.compare(fk)===1&&(i=new Wn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(t){return(this.bitmap[Math.floor(t/8)]&1<<t%8)!=0}mightContain(t){if(this.Ie===0)return!1;const e=Jh(t),[s,i]=Zh(e);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(t,e,s){const i=t%8==0?0:8-t%8,r=new Uint8Array(Math.ceil(t/8)),o=new Jc(r,i,e);return s.forEach(a=>o.insert(a)),o}insert(t){if(this.Ie===0)return;const e=Jh(t),[s,i]=Zh(e);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(t){const e=Math.floor(t/8),s=t%8;this.bitmap[e]|=1<<s}}class _i extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(t,e,s,i,r){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(t,e,s){const i=new Map;return i.set(t,fr.createSynthesizedTargetChangeForCurrentChange(t,e,s)),new ha(W.min(),i,new yt(nt),Qe(),Q())}}class fr{constructor(t,e,s,i,r){this.resumeToken=t,this.current=e,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(t,e,s){return new fr(s,e,Q(),Q(),Q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(t,e,s,i){this.Re=t,this.removedTargetIds=e,this.key=s,this.Ve=i}}class Tm{constructor(t,e){this.targetId=t,this.me=e}}class Am{constructor(t,e,s=Nt.EMPTY_BYTE_STRING,i=null){this.state=t,this.targetIds=e,this.resumeToken=s,this.cause=i}}class tf{constructor(){this.fe=0,this.ge=nf(),this.pe=Nt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=Q(),e=Q(),s=Q();return this.ge.forEach((i,r)=>{switch(r){case 0:t=t.add(i);break;case 2:e=e.add(i);break;case 1:s=s.add(i);break;default:H()}}),new fr(this.pe,this.ye,t,e,s)}Ce(){this.we=!1,this.ge=nf()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,rt(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class gk{constructor(t){this.Le=t,this.Be=new Map,this.ke=Qe(),this.qe=ef(),this.Qe=new yt(nt)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const s=this.Ge(e);switch(t.state){case 0:this.ze(e)&&s.De(t.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(t.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(s.Ne(),s.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),s.De(t.resumeToken));break;default:H()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((s,i)=>{this.ze(i)&&e(i)})}He(t){const e=t.targetId,s=t.me.count,i=this.Je(e);if(i){const r=i.target;if($l(r))if(s===0){const o=new z(r.path);this.Ue(e,o,qt.newNoDocument(o,W.min()))}else rt(s===1);else{const o=this.Ye(e);if(o!==s){const a=this.Ze(t),l=a?this.Xe(a,t,o):1;if(l!==0){this.je(e);const c=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,c)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=e;let o,a;try{o=Qn(s).toUint8Array()}catch(l){if(l instanceof im)return Ps("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{a=new Jc(o,i,r)}catch(l){return Ps(l instanceof _i?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return a.Ie===0?null:a}Xe(t,e,s){return e.me.count===s-this.nt(t,e.targetId)?0:2}nt(t,e){const s=this.Le.getRemoteKeysForTarget(e);let i=0;return s.forEach(r=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;t.mightContain(a)||(this.Ue(e,r,null),i++)}),i}rt(t){const e=new Map;this.Be.forEach((r,o)=>{const a=this.Je(o);if(a){if(r.current&&$l(a.target)){const l=new z(a.target.path);this.ke.get(l)!==null||this.it(o,l)||this.Ue(o,l,qt.newNoDocument(l,t))}r.be&&(e.set(o,r.ve()),r.Ce())}});let s=Q();this.qe.forEach((r,o)=>{let a=!0;o.forEachWhile(l=>{const c=this.Je(l);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(t));const i=new ha(t,e,this.Qe,this.ke,s);return this.ke=Qe(),this.qe=ef(),this.Qe=new yt(nt),i}$e(t,e){if(!this.ze(t))return;const s=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,s),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,s){if(!this.ze(t))return;const i=this.Ge(t);this.it(t,e)?i.Fe(e,1):i.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),s&&(this.ke=this.ke.insert(e,s))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new tf,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new Vt(nt),this.qe=this.qe.insert(t,e)),e}ze(t){const e=this.Je(t)!==null;return e||U("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new tf),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function ef(){return new yt(z.comparator)}function nf(){return new yt(z.comparator)}const pk={asc:"ASCENDING",desc:"DESCENDING"},mk={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},yk={and:"AND",or:"OR"};class _k{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function ql(n,t){return n.useProto3Json||oa(t)?t:{value:t}}function jo(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Sm(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function bk(n,t){return jo(n,t.toTimestamp())}function Te(n){return rt(!!n),W.fromTimestamp(function(e){const s=En(e);return new pt(s.seconds,s.nanos)}(n))}function Zc(n,t){return Gl(n,t).canonicalString()}function Gl(n,t){const e=function(i){return new dt(["projects",i.projectId,"databases",i.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Pm(n){const t=dt.fromString(n);return rt(Lm(t)),t}function Kl(n,t){return Zc(n.databaseId,t.path)}function ol(n,t){const e=Pm(t);if(e.get(1)!==n.databaseId.projectId)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new j(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new z(Rm(e))}function Cm(n,t){return Zc(n.databaseId,t)}function vk(n){const t=Pm(n);return t.length===4?dt.emptyPath():Rm(t)}function Yl(n){return new dt(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Rm(n){return rt(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function sf(n,t,e){return{name:Kl(n,t),fields:e.value.mapValue.fields}}function wk(n,t){let e;if("targetChange"in t){t.targetChange;const s=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:H()}(t.targetChange.targetChangeType||"NO_CHANGE"),i=t.targetChange.targetIds||[],r=function(c,d){return c.useProto3Json?(rt(d===void 0||typeof d=="string"),Nt.fromBase64String(d||"")):(rt(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Nt.fromUint8Array(d||new Uint8Array))}(n,t.targetChange.resumeToken),o=t.targetChange.cause,a=o&&function(c){const d=c.code===void 0?O.UNKNOWN:Im(c.code);return new j(d,c.message||"")}(o);e=new Am(s,i,r,a||null)}else if("documentChange"in t){t.documentChange;const s=t.documentChange;s.document,s.document.name,s.document.updateTime;const i=ol(n,s.document.name),r=Te(s.document.updateTime),o=s.document.createTime?Te(s.document.createTime):W.min(),a=new ee({mapValue:{fields:s.document.fields}}),l=qt.newFoundDocument(i,r,o,a),c=s.targetIds||[],d=s.removedTargetIds||[];e=new fo(c,d,l.key,l)}else if("documentDelete"in t){t.documentDelete;const s=t.documentDelete;s.document;const i=ol(n,s.document),r=s.readTime?Te(s.readTime):W.min(),o=qt.newNoDocument(i,r),a=s.removedTargetIds||[];e=new fo([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const s=t.documentRemove;s.document;const i=ol(n,s.document),r=s.removedTargetIds||[];e=new fo([],r,i,null)}else{if(!("filter"in t))return H();{t.filter;const s=t.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new uk(i,r),a=s.targetId;e=new Tm(a,o)}}return e}function xk(n,t){let e;if(t instanceof hr)e={update:sf(n,t.key,t.value)};else if(t instanceof Qc)e={delete:Kl(n,t.key)};else if(t instanceof Cn)e={update:sf(n,t.key,t.data),updateMask:Rk(t.fieldMask)};else{if(!(t instanceof ak))return H();e={verify:Kl(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(s=>function(r,o){const a=o.transform;if(a instanceof Fo)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Hi)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Wi)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Bo)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw H()}(0,s))),t.precondition.isNone||(e.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:bk(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:H()}(n,t.precondition)),e}function kk(n,t){return n&&n.length>0?(rt(t!==void 0),n.map(e=>function(i,r){let o=i.updateTime?Te(i.updateTime):Te(r);return o.isEqual(W.min())&&(o=Te(r)),new ik(o,i.transformResults||[])}(e,t))):[]}function Ek(n,t){return{documents:[Cm(n,t.path)]}}function Ik(n,t){const e={structuredQuery:{}},s=t.path;let i;t.collectionGroup!==null?(i=s,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=s.popLast(),e.structuredQuery.from=[{collectionId:s.lastSegment()}]),e.parent=Cm(n,i);const r=function(c){if(c.length!==0)return Mm(_e.create(c,"and"))}(t.filters);r&&(e.structuredQuery.where=r);const o=function(c){if(c.length!==0)return c.map(d=>function(g){return{field:ps(g.field),direction:Sk(g.dir)}}(d))}(t.orderBy);o&&(e.structuredQuery.orderBy=o);const a=ql(n,t.limit);return a!==null&&(e.structuredQuery.limit=a),t.startAt&&(e.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(t.endAt)),{_t:e,parent:i}}function Tk(n){let t=vk(n.parent);const e=n.structuredQuery,s=e.from?e.from.length:0;let i=null;if(s>0){rt(s===1);const d=e.from[0];d.allDescendants?i=d.collectionId:t=t.child(d.collectionId)}let r=[];e.where&&(r=function(h){const g=Dm(h);return g instanceof _e&&lm(g)?g.getFilters():[g]}(e.where));let o=[];e.orderBy&&(o=function(h){return h.map(g=>function(y){return new No(ms(y.field),function(w){switch(w){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(y.direction))}(g))}(e.orderBy));let a=null;e.limit&&(a=function(h){let g;return g=typeof h=="object"?h.value:h,oa(g)?null:g}(e.limit));let l=null;e.startAt&&(l=function(h){const g=!!h.before,m=h.values||[];return new Vo(m,g)}(e.startAt));let c=null;return e.endAt&&(c=function(h){const g=!h.before,m=h.values||[];return new Vo(m,g)}(e.endAt)),Wx(t,i,o,r,a,"F",l,c)}function Ak(n,t){const e=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return H()}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Dm(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const s=ms(e.unaryFilter.field);return Tt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=ms(e.unaryFilter.field);return Tt.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=ms(e.unaryFilter.field);return Tt.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ms(e.unaryFilter.field);return Tt.create(o,"!=",{nullValue:"NULL_VALUE"});default:return H()}}(n):n.fieldFilter!==void 0?function(e){return Tt.create(ms(e.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return H()}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return _e.create(e.compositeFilter.filters.map(s=>Dm(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return H()}}(e.compositeFilter.op))}(n):H()}function Sk(n){return pk[n]}function Pk(n){return mk[n]}function Ck(n){return yk[n]}function ps(n){return{fieldPath:n.canonicalString()}}function ms(n){return Ot.fromServerFormat(n.fieldPath)}function Mm(n){return n instanceof Tt?function(e){if(e.op==="=="){if($h(e.value))return{unaryFilter:{field:ps(e.field),op:"IS_NAN"}};if(zh(e.value))return{unaryFilter:{field:ps(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if($h(e.value))return{unaryFilter:{field:ps(e.field),op:"IS_NOT_NAN"}};if(zh(e.value))return{unaryFilter:{field:ps(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ps(e.field),op:Pk(e.op),value:e.value}}}(n):n instanceof _e?function(e){const s=e.getFilters().map(i=>Mm(i));return s.length===1?s[0]:{compositeFilter:{op:Ck(e.op),filters:s}}}(n):H()}function Rk(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Lm(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(t,e,s,i,r=W.min(),o=W.min(),a=Nt.EMPTY_BYTE_STRING,l=null){this.target=t,this.targetId=e,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=l}withSequenceNumber(t){return new cn(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dk{constructor(t){this.ct=t}}function Mk(n){const t=Tk({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Wl(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lk{constructor(){this.un=new Ok}addToCollectionParentIndex(t,e){return this.un.add(e),N.resolve()}getCollectionParents(t,e){return N.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return N.resolve()}deleteFieldIndex(t,e){return N.resolve()}deleteAllFieldIndexes(t){return N.resolve()}createTargetIndexes(t,e){return N.resolve()}getDocumentsMatchingTarget(t,e){return N.resolve(null)}getIndexType(t,e){return N.resolve(0)}getFieldIndexes(t,e){return N.resolve([])}getNextCollectionGroupToUpdate(t){return N.resolve(null)}getMinOffset(t,e){return N.resolve(kn.min())}getMinOffsetFromCollectionGroup(t,e){return N.resolve(kn.min())}updateCollectionGroup(t,e,s){return N.resolve()}updateIndexEntries(t,e){return N.resolve()}}class Ok{constructor(){this.index={}}add(t){const e=t.lastSegment(),s=t.popLast(),i=this.index[e]||new Vt(dt.comparator),r=!i.has(s);return this.index[e]=i.add(s),r}has(t){const e=t.lastSegment(),s=t.popLast(),i=this.index[e];return i&&i.has(s)}getEntries(t){return(this.index[t]||new Vt(dt.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ms(0)}static kn(){return new Ms(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vk{constructor(){this.changes=new Hs(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,qt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const s=this.changes.get(e);return s!==void 0?N.resolve(s):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nk{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fk{constructor(t,e,s,i){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=s,this.indexManager=i}getDocument(t,e){let s=null;return this.documentOverlayCache.getOverlay(t,e).next(i=>(s=i,this.remoteDocumentCache.getEntry(t,e))).next(i=>(s!==null&&Ri(s.mutation,i,re.empty(),pt.now()),i))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(s=>this.getLocalViewOfDocuments(t,s,Q()).next(()=>s))}getLocalViewOfDocuments(t,e,s=Q()){const i=$n();return this.populateOverlays(t,i,e).next(()=>this.computeViews(t,e,i,s).next(r=>{let o=yi();return r.forEach((a,l)=>{o=o.insert(a,l.overlayedDocument)}),o}))}getOverlayedDocuments(t,e){const s=$n();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,Q()))}populateOverlays(t,e,s){const i=[];return s.forEach(r=>{e.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(t,i).next(r=>{r.forEach((o,a)=>{e.set(o,a)})})}computeViews(t,e,s,i){let r=Qe();const o=Ci(),a=function(){return Ci()}();return e.forEach((l,c)=>{const d=s.get(c.key);i.has(c.key)&&(d===void 0||d.mutation instanceof Cn)?r=r.insert(c.key,c):d!==void 0?(o.set(c.key,d.mutation.getFieldMask()),Ri(d.mutation,c,d.mutation.getFieldMask(),pt.now())):o.set(c.key,re.empty())}),this.recalculateAndSaveOverlays(t,r).next(l=>(l.forEach((c,d)=>o.set(c,d)),e.forEach((c,d)=>{var h;return a.set(c,new Nk(d,(h=o.get(c))!==null&&h!==void 0?h:null))}),a))}recalculateAndSaveOverlays(t,e){const s=Ci();let i=new yt((o,a)=>o-a),r=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(o=>{for(const a of o)a.keys().forEach(l=>{const c=e.get(l);if(c===null)return;let d=s.get(l)||re.empty();d=a.applyToLocalView(c,d),s.set(l,d);const h=(i.get(a.batchId)||Q()).add(l);i=i.insert(a.batchId,h)})}).next(()=>{const o=[],a=i.getReverseIterator();for(;a.hasNext();){const l=a.getNext(),c=l.key,d=l.value,h=ym();d.forEach(g=>{if(!r.has(g)){const m=km(e.get(g),s.get(g));m!==null&&h.set(g,m),r=r.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(t,c,h))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(s=>this.recalculateAndSaveOverlays(t,s))}getDocumentsMatchingQuery(t,e,s,i){return function(o){return z.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):hm(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,s,i):this.getDocumentsMatchingCollectionQuery(t,e,s,i)}getNextDocuments(t,e,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,s.largestBatchId,i-r.size):N.resolve($n());let a=-1,l=r;return o.next(c=>N.forEach(c,(d,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),r.get(d)?N.resolve():this.remoteDocumentCache.getEntry(t,d).next(g=>{l=l.insert(d,g)}))).next(()=>this.populateOverlays(t,c,r)).next(()=>this.computeViews(t,l,c,Q())).next(d=>({batchId:a,changes:mm(d)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new z(e)).next(s=>{let i=yi();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(t,e,s,i){const r=e.collectionGroup;let o=yi();return this.indexManager.getCollectionParents(t,r).next(a=>N.forEach(a,l=>{const c=function(h,g){return new dr(g,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)}(e,l.child(r));return this.getDocumentsMatchingCollectionQuery(t,c,s,i).next(d=>{d.forEach((h,g)=>{o=o.insert(h,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(t,e,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,s,r,i))).next(o=>{r.forEach((l,c)=>{const d=c.getKey();o.get(d)===null&&(o=o.insert(d,qt.newInvalidDocument(d)))});let a=yi();return o.forEach((l,c)=>{const d=r.get(l);d!==void 0&&Ri(d.mutation,c,re.empty(),pt.now()),ca(e,c)&&(a=a.insert(l,c))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bk{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return N.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,function(i){return{id:i.id,version:i.version,createTime:Te(i.createTime)}}(e)),N.resolve()}getNamedQuery(t,e){return N.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,function(i){return{name:i.name,query:Mk(i.bundledQuery),readTime:Te(i.readTime)}}(e)),N.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jk{constructor(){this.overlays=new yt(z.comparator),this.Ir=new Map}getOverlay(t,e){return N.resolve(this.overlays.get(e))}getOverlays(t,e){const s=$n();return N.forEach(e,i=>this.getOverlay(t,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(t,e,s){return s.forEach((i,r)=>{this.ht(t,e,r)}),N.resolve()}removeOverlaysForBatchId(t,e,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(t,e,s){const i=$n(),r=e.length+1,o=new z(e.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const l=a.getNext().value,c=l.getKey();if(!e.isPrefixOf(c.path))break;c.path.length===r&&l.largestBatchId>s&&i.set(l.getKey(),l)}return N.resolve(i)}getOverlaysForCollectionGroup(t,e,s,i){let r=new yt((c,d)=>c-d);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===e&&c.largestBatchId>s){let d=r.get(c.largestBatchId);d===null&&(d=$n(),r=r.insert(c.largestBatchId,d)),d.set(c.getKey(),c)}}const a=$n(),l=r.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((c,d)=>a.set(c,d)),!(a.size()>=i)););return N.resolve(a)}ht(t,e,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new ck(e,s));let r=this.Ir.get(e);r===void 0&&(r=Q(),this.Ir.set(e,r)),this.Ir.set(e,r.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uk{constructor(){this.sessionToken=Nt.EMPTY_BYTE_STRING}getSessionToken(t){return N.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(){this.Tr=new Vt(Ct.Er),this.dr=new Vt(Ct.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const s=new Ct(t,e);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(t,e){t.forEach(s=>this.addReference(s,e))}removeReference(t,e){this.Vr(new Ct(t,e))}mr(t,e){t.forEach(s=>this.removeReference(s,e))}gr(t){const e=new z(new dt([])),s=new Ct(e,t),i=new Ct(e,t+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new z(new dt([])),s=new Ct(e,t),i=new Ct(e,t+1);let r=Q();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(t){const e=new Ct(t,0),s=this.Tr.firstAfterOrEqual(e);return s!==null&&t.isEqual(s.key)}}class Ct{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return z.comparator(t.key,e.key)||nt(t.wr,e.wr)}static Ar(t,e){return nt(t.wr,e.wr)||z.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zk{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new Vt(Ct.Er)}checkEmpty(t){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new lk(r,e,s,i);this.mutationQueue.push(o);for(const a of i)this.br=this.br.add(new Ct(a.key,r)),this.indexManager.addToCollectionParentIndex(t,a.key.path.popLast());return N.resolve(o)}lookupMutationBatch(t,e){return N.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const s=e+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(t){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const s=new Ct(e,0),i=new Ct(e,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const a=this.Dr(o.wr);r.push(a)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(t,e){let s=new Vt(nt);return e.forEach(i=>{const r=new Ct(i,0),o=new Ct(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],a=>{s=s.add(a.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(t,e){const s=e.path,i=s.length+1;let r=s;z.isDocumentKey(r)||(r=r.child(""));const o=new Ct(new z(r),0);let a=new Vt(nt);return this.br.forEachWhile(l=>{const c=l.key.path;return!!s.isPrefixOf(c)&&(c.length===i&&(a=a.add(l.wr)),!0)},o),N.resolve(this.Cr(a))}Cr(t){const e=[];return t.forEach(s=>{const i=this.Dr(s);i!==null&&e.push(i)}),e}removeMutationBatch(t,e){rt(this.Fr(e.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(e.mutations,i=>{const r=new Ct(i.key,e.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(t,i.key)}).next(()=>{this.br=s})}On(t){}containsKey(t,e){const s=new Ct(e,0),i=this.br.firstAfterOrEqual(s);return N.resolve(e.isEqual(i&&i.key))}performConsistencyCheck(t){return this.mutationQueue.length,N.resolve()}Fr(t,e){return this.vr(t)}vr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $k{constructor(t){this.Mr=t,this.docs=function(){return new yt(z.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const s=e.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(e);return this.docs=this.docs.insert(s,{document:e.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(t,s.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const s=this.docs.get(e);return N.resolve(s?s.document.mutableCopy():qt.newInvalidDocument(e))}getEntries(t,e){let s=Qe();return e.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():qt.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(t,e,s,i){let r=Qe();const o=e.path,a=new z(o.child("")),l=this.docs.getIteratorFrom(a);for(;l.hasNext();){const{key:c,value:{document:d}}=l.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||Tx(Ix(d),s)<=0||(i.has(d.key)||ca(e,d))&&(r=r.insert(d.key,d.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(t,e,s,i){H()}Or(t,e){return N.forEach(this.docs,s=>e(s))}newChangeBuffer(t){return new Hk(this)}getSize(t){return N.resolve(this.size)}}class Hk extends Vk{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?e.push(this.cr.addEntry(t,i)):this.cr.removeEntry(s)}),N.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wk{constructor(t){this.persistence=t,this.Nr=new Hs(e=>Gc(e),Kc),this.lastRemoteSnapshotVersion=W.min(),this.highestTargetId=0,this.Lr=0,this.Br=new tu,this.targetCount=0,this.kr=Ms.Bn()}forEachTarget(t,e){return this.Nr.forEach((s,i)=>e(i)),N.resolve()}getLastRemoteSnapshotVersion(t){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return N.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(t,e,s){return s&&(this.lastRemoteSnapshotVersion=s),e>this.Lr&&(this.Lr=e),N.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new Ms(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,N.resolve()}updateTargetData(t,e){return this.Kn(e),N.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,N.resolve()}removeTargets(t,e,s){let i=0;const r=[];return this.Nr.forEach((o,a)=>{a.sequenceNumber<=e&&s.get(a.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(t,a.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(t){return N.resolve(this.targetCount)}getTargetData(t,e){const s=this.Nr.get(e)||null;return N.resolve(s)}addMatchingKeys(t,e,s){return this.Br.Rr(e,s),N.resolve()}removeMatchingKeys(t,e,s){this.Br.mr(e,s);const i=this.persistence.referenceDelegate,r=[];return i&&e.forEach(o=>{r.push(i.markPotentiallyOrphaned(t,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),N.resolve()}getMatchingKeysForTargetId(t,e){const s=this.Br.yr(e);return N.resolve(s)}containsKey(t,e){return N.resolve(this.Br.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qk{constructor(t,e){this.qr={},this.overlays={},this.Qr=new $c(0),this.Kr=!1,this.Kr=!0,this.$r=new Uk,this.referenceDelegate=t(this),this.Ur=new Wk(this),this.indexManager=new Lk,this.remoteDocumentCache=function(i){return new $k(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new Dk(e),this.Gr=new Bk(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new jk,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let s=this.qr[t.toKey()];return s||(s=new zk(e,this.referenceDelegate),this.qr[t.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,s){U("MemoryPersistence","Starting transaction:",t);const i=new Gk(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(t,e){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(t,e)))}}class Gk extends Sx{constructor(t){super(),this.currentSequenceNumber=t}}class eu{constructor(t){this.persistence=t,this.Jr=new tu,this.Yr=null}static Zr(t){return new eu(t)}get Xr(){if(this.Yr)return this.Yr;throw H()}addReference(t,e,s){return this.Jr.addReference(s,e),this.Xr.delete(s.toString()),N.resolve()}removeReference(t,e,s){return this.Jr.removeReference(s,e),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),N.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(t,e.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=z.fromPath(s);return this.ei(t,i).next(r=>{r||e.removeEntry(i,W.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(s=>{s?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return N.or([()=>N.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(t,e,s,i){this.targetId=t,this.fromCache=e,this.$i=s,this.Ui=i}static Wi(t,e){let s=Q(),i=Q();for(const r of e.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new nu(t,e.fromCache,s,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kk{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yk{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return V_()?8:Px(Kt())>0?6:4}()}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,s,i){const r={result:null};return this.Yi(t,e).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(t,e,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new Kk;return this.Xi(t,e,o).next(a=>{if(r.result=a,this.zi)return this.es(t,e,o,a.size)})}).next(()=>r.result)}es(t,e,s,i){return s.documentReadCount<this.ji?(oi()<=J.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",gs(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(oi()<=J.DEBUG&&U("QueryEngine","Query:",gs(e),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(oi()<=J.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",gs(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ie(e))):N.resolve())}Yi(t,e){if(Gh(e))return N.resolve(null);let s=Ie(e);return this.indexManager.getIndexType(t,s).next(i=>i===0?null:(e.limit!==null&&i===1&&(e=Wl(e,null,"F"),s=Ie(e)),this.indexManager.getDocumentsMatchingTarget(t,s).next(r=>{const o=Q(...r);return this.Ji.getDocuments(t,o).next(a=>this.indexManager.getMinOffset(t,s).next(l=>{const c=this.ts(e,a);return this.ns(e,c,o,l.readTime)?this.Yi(t,Wl(e,null,"F")):this.rs(t,c,e,l)}))})))}Zi(t,e,s,i){return Gh(e)||i.isEqual(W.min())?N.resolve(null):this.Ji.getDocuments(t,s).next(r=>{const o=this.ts(e,r);return this.ns(e,o,s,i)?N.resolve(null):(oi()<=J.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),gs(e)),this.rs(t,o,e,Ex(i,-1)).next(a=>a))})}ts(t,e){let s=new Vt(gm(t));return e.forEach((i,r)=>{ca(t,r)&&(s=s.add(r))}),s}ns(t,e,s,i){if(t.limit===null)return!1;if(s.size!==e.size)return!0;const r=t.limitType==="F"?e.last():e.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(t,e,s){return oi()<=J.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",gs(e)),this.Ji.getDocumentsMatchingQuery(t,e,kn.min(),s)}rs(t,e,s,i){return this.Ji.getDocumentsMatchingQuery(t,s,i).next(r=>(e.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qk{constructor(t,e,s,i){this.persistence=t,this.ss=e,this.serializer=i,this.os=new yt(nt),this._s=new Hs(r=>Gc(r),Kc),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(s)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Fk(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function Xk(n,t,e,s){return new Qk(n,t,e,s)}async function Om(n,t){const e=G(n);return await e.persistence.runTransaction("Handle user change","readonly",s=>{let i;return e.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,e.ls(t),e.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],a=[];let l=Q();for(const c of i){o.push(c.batchId);for(const d of c.mutations)l=l.add(d.key)}for(const c of r){a.push(c.batchId);for(const d of c.mutations)l=l.add(d.key)}return e.localDocuments.getDocuments(s,l).next(c=>({hs:c,removedBatchIds:o,addedBatchIds:a}))})})}function Jk(n,t){const e=G(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=t.batch.keys(),r=e.cs.newChangeBuffer({trackRemovals:!0});return function(a,l,c,d){const h=c.batch,g=h.keys();let m=N.resolve();return g.forEach(y=>{m=m.next(()=>d.getEntry(l,y)).next(_=>{const w=c.docVersions.get(y);rt(w!==null),_.version.compareTo(w)<0&&(h.applyToRemoteDocument(_,c),_.isValidDocument()&&(_.setReadTime(c.commitVersion),d.addEntry(_)))})}),m.next(()=>a.mutationQueue.removeMutationBatch(l,h))}(e,s,t,r).next(()=>r.apply(s)).next(()=>e.mutationQueue.performConsistencyCheck(s)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(s,i,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(a){let l=Q();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(l=l.add(a.batch.mutations[c].key));return l}(t))).next(()=>e.localDocuments.getDocuments(s,i))})}function Vm(n){const t=G(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function Zk(n,t){const e=G(n),s=t.snapshotVersion;let i=e.os;return e.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=e.cs.newChangeBuffer({trackRemovals:!0});i=e.os;const a=[];t.targetChanges.forEach((d,h)=>{const g=i.get(h);if(!g)return;a.push(e.Ur.removeMatchingKeys(r,d.removedDocuments,h).next(()=>e.Ur.addMatchingKeys(r,d.addedDocuments,h)));let m=g.withSequenceNumber(r.currentSequenceNumber);t.targetMismatches.get(h)!==null?m=m.withResumeToken(Nt.EMPTY_BYTE_STRING,W.min()).withLastLimboFreeSnapshotVersion(W.min()):d.resumeToken.approximateByteSize()>0&&(m=m.withResumeToken(d.resumeToken,s)),i=i.insert(h,m),function(_,w,A){return _.resumeToken.approximateByteSize()===0||w.snapshotVersion.toMicroseconds()-_.snapshotVersion.toMicroseconds()>=3e8?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0}(g,m,d)&&a.push(e.Ur.updateTargetData(r,m))});let l=Qe(),c=Q();if(t.documentUpdates.forEach(d=>{t.resolvedLimboDocuments.has(d)&&a.push(e.persistence.referenceDelegate.updateLimboDocument(r,d))}),a.push(tE(r,o,t.documentUpdates).next(d=>{l=d.Ps,c=d.Is})),!s.isEqual(W.min())){const d=e.Ur.getLastRemoteSnapshotVersion(r).next(h=>e.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));a.push(d)}return N.waitFor(a).next(()=>o.apply(r)).next(()=>e.localDocuments.getLocalViewOfDocuments(r,l,c)).next(()=>l)}).then(r=>(e.os=i,r))}function tE(n,t,e){let s=Q(),i=Q();return e.forEach(r=>s=s.add(r)),t.getEntries(n,s).next(r=>{let o=Qe();return e.forEach((a,l)=>{const c=r.get(a);l.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(a)),l.isNoDocument()&&l.version.isEqual(W.min())?(t.removeEntry(a,l.readTime),o=o.insert(a,l)):!c.isValidDocument()||l.version.compareTo(c.version)>0||l.version.compareTo(c.version)===0&&c.hasPendingWrites?(t.addEntry(l),o=o.insert(a,l)):U("LocalStore","Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",l.version)}),{Ps:o,Is:i}})}function eE(n,t){const e=G(n);return e.persistence.runTransaction("Get next mutation batch","readonly",s=>(t===void 0&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(s,t)))}function nE(n,t){const e=G(n);return e.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return e.Ur.getTargetData(s,t).next(r=>r?(i=r,N.resolve(i)):e.Ur.allocateTargetId(s).next(o=>(i=new cn(t,o,"TargetPurposeListen",s.currentSequenceNumber),e.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=e.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(e.os=e.os.insert(s.targetId,s),e._s.set(t,s.targetId)),s})}async function Ql(n,t,e){const s=G(n),i=s.os.get(t),r=e?"readwrite":"readwrite-primary";try{e||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!ur(o))throw o;U("LocalStore",`Failed to update sequence numbers for target ${t}: ${o}`)}s.os=s.os.remove(t),s._s.delete(i.target)}function rf(n,t,e){const s=G(n);let i=W.min(),r=Q();return s.persistence.runTransaction("Execute query","readwrite",o=>function(l,c,d){const h=G(l),g=h._s.get(d);return g!==void 0?N.resolve(h.os.get(g)):h.Ur.getTargetData(c,d)}(s,o,Ie(t)).next(a=>{if(a)return i=a.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,a.targetId).next(l=>{r=l})}).next(()=>s.ss.getDocumentsMatchingQuery(o,t,e?i:W.min(),e?r:Q())).next(a=>(sE(s,Gx(t),a),{documents:a,Ts:r})))}function sE(n,t,e){let s=n.us.get(t)||W.min();e.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),n.us.set(t,s)}class of{constructor(){this.activeTargetIds=Zx()}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class iE{constructor(){this.so=new of,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,s){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,s){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new of,Promise.resolve()}handleUserChange(t,e,s){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{_o(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $r=null;function al(){return $r===null?$r=function(){return 268435456+Math.round(2147483648*Math.random())}():$r++,"0x"+$r.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aE{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt="WebChannelConnection";class lE extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const s=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+e.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(e,s,i,r,o){const a=al(),l=this.xo(e,s.toUriEncodedString());U("RestConnection",`Sending RPC '${e}' ${a}:`,l,i);const c={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(c,r,o),this.No(e,l,c,i).then(d=>(U("RestConnection",`Received RPC '${e}' ${a}: `,d),d),d=>{throw Ps("RestConnection",`RPC '${e}' ${a} failed with error: `,d,"url: ",l,"request:",i),d})}Lo(e,s,i,r,o,a){return this.Mo(e,s,i,r,o)}Oo(e,s,i){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+$s}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>e[o]=r),i&&i.headers.forEach((r,o)=>e[o]=r)}xo(e,s){const i=oE[e];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,s,i){const r=al();return new Promise((o,a)=>{const l=new Qp;l.setWithCredentials(!0),l.listenOnce(Xp.COMPLETE,()=>{try{switch(l.getLastErrorCode()){case co.NO_ERROR:const d=l.getResponseJson();U(zt,`XHR for RPC '${t}' ${r} received:`,JSON.stringify(d)),o(d);break;case co.TIMEOUT:U(zt,`RPC '${t}' ${r} timed out`),a(new j(O.DEADLINE_EXCEEDED,"Request time out"));break;case co.HTTP_ERROR:const h=l.getStatus();if(U(zt,`RPC '${t}' ${r} failed with status:`,h,"response text:",l.getResponseText()),h>0){let g=l.getResponseJson();Array.isArray(g)&&(g=g[0]);const m=g==null?void 0:g.error;if(m&&m.status&&m.message){const y=function(w){const A=w.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(A)>=0?A:O.UNKNOWN}(m.status);a(new j(y,m.message))}else a(new j(O.UNKNOWN,"Server responded with status "+l.getStatus()))}else a(new j(O.UNAVAILABLE,"Connection failed."));break;default:H()}}finally{U(zt,`RPC '${t}' ${r} completed.`)}});const c=JSON.stringify(i);U(zt,`RPC '${t}' ${r} sending request:`,i),l.send(e,"POST",c,s,15)})}Bo(t,e,s){const i=al(),r=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=tm(),a=Zp(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(l.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Oo(l.initMessageHeaders,e,s),l.encodeInitMessageHeaders=!0;const d=r.join("");U(zt,`Creating RPC '${t}' stream ${i}: ${d}`,l);const h=o.createWebChannel(d,l);let g=!1,m=!1;const y=new aE({Io:w=>{m?U(zt,`Not sending because RPC '${t}' stream ${i} is closed:`,w):(g||(U(zt,`Opening RPC '${t}' stream ${i} transport.`),h.open(),g=!0),U(zt,`RPC '${t}' stream ${i} sending:`,w),h.send(w))},To:()=>h.close()}),_=(w,A,P)=>{w.listen(A,D=>{try{P(D)}catch(L){setTimeout(()=>{throw L},0)}})};return _(h,mi.EventType.OPEN,()=>{m||(U(zt,`RPC '${t}' stream ${i} transport opened.`),y.yo())}),_(h,mi.EventType.CLOSE,()=>{m||(m=!0,U(zt,`RPC '${t}' stream ${i} transport closed`),y.So())}),_(h,mi.EventType.ERROR,w=>{m||(m=!0,Ps(zt,`RPC '${t}' stream ${i} transport errored:`,w),y.So(new j(O.UNAVAILABLE,"The operation could not be completed")))}),_(h,mi.EventType.MESSAGE,w=>{var A;if(!m){const P=w.data[0];rt(!!P);const D=P,L=D.error||((A=D[0])===null||A===void 0?void 0:A.error);if(L){U(zt,`RPC '${t}' stream ${i} received error:`,L);const M=L.status;let V=function(x){const I=It[x];if(I!==void 0)return Im(I)}(M),k=L.message;V===void 0&&(V=O.INTERNAL,k="Unknown error status: "+M+" with message "+L.message),m=!0,y.So(new j(V,k)),h.close()}else U(zt,`RPC '${t}' stream ${i} received:`,P),y.bo(P)}}),_(a,Jp.STAT_EVENT,w=>{w.stat===Bl.PROXY?U(zt,`RPC '${t}' stream ${i} detected buffering proxy`):w.stat===Bl.NOPROXY&&U(zt,`RPC '${t}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{y.wo()},0),y}}function ll(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fa(n){return new _k(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(t,e,s=1e3,i=1.5,r=6e4){this.ui=t,this.timerId=e,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,e-s);i>0&&U("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(t,e,s,i,r,o,a,l){this.ui=t,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=l,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Nm(t,e)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,t!==4?this.t_.reset():e&&e.code===O.RESOURCE_EXHAUSTED?(Ye(e.toString()),Ye("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===e&&this.P_(s,i)},s=>{t(()=>{const i=new j(O.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(t,e){const s=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return U("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class cE extends Fm{constructor(t,e,s,i,r,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,s,i,o),this.serializer=r}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=wk(this.serializer,t),s=function(r){if(!("targetChange"in r))return W.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?W.min():o.readTime?Te(o.readTime):W.min()}(t);return this.listener.d_(e,s)}A_(t){const e={};e.database=Yl(this.serializer),e.addTarget=function(r,o){let a;const l=o.target;if(a=$l(l)?{documents:Ek(r,l)}:{query:Ik(r,l)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=Sm(r,o.resumeToken);const c=ql(r,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(W.min())>0){a.readTime=jo(r,o.snapshotVersion.toTimestamp());const c=ql(r,o.expectedCount);c!==null&&(a.expectedCount=c)}return a}(this.serializer,t);const s=Ak(this.serializer,t);s&&(e.labels=s),this.a_(e)}R_(t){const e={};e.database=Yl(this.serializer),e.removeTarget=t,this.a_(e)}}class uE extends Fm{constructor(t,e,s,i,r,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return rt(!!t.streamToken),this.lastStreamToken=t.streamToken,rt(!t.writeResults||t.writeResults.length===0),this.listener.f_()}onNext(t){rt(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=kk(t.writeResults,t.commitTime),s=Te(t.commitTime);return this.listener.g_(s,e)}p_(){const t={};t.database=Yl(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(s=>xk(this.serializer,s))};this.a_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dE extends class{}{constructor(t,e,s,i){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(t,Gl(e,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new j(O.UNKNOWN,r.toString())})}Lo(t,e,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Lo(t,Gl(e,s),i,o,a,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new j(O.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class hE{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,t==="Online"&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Ye(e),this.D_=!1):U("OnlineStateTracker",e)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fE{constructor(t,e,s,i,r){this.localStore=t,this.datastore=e,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{ns(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(l){const c=G(l);c.L_.add(4),await gr(c),c.q_.set("Unknown"),c.L_.delete(4),await ga(c)}(this))})}),this.q_=new hE(s,i)}}async function ga(n){if(ns(n))for(const t of n.B_)await t(!0)}async function gr(n){for(const t of n.B_)await t(!1)}function Bm(n,t){const e=G(n);e.N_.has(t.targetId)||(e.N_.set(t.targetId,t),ou(e)?ru(e):Ws(e).r_()&&iu(e,t))}function su(n,t){const e=G(n),s=Ws(e);e.N_.delete(t),s.r_()&&jm(e,t),e.N_.size===0&&(s.r_()?s.o_():ns(e)&&e.q_.set("Unknown"))}function iu(n,t){if(n.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(W.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Ws(n).A_(t)}function jm(n,t){n.Q_.xe(t),Ws(n).R_(t)}function ru(n){n.Q_=new gk({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>n.N_.get(t)||null,tt:()=>n.datastore.serializer.databaseId}),Ws(n).start(),n.q_.v_()}function ou(n){return ns(n)&&!Ws(n).n_()&&n.N_.size>0}function ns(n){return G(n).L_.size===0}function Um(n){n.Q_=void 0}async function gE(n){n.q_.set("Online")}async function pE(n){n.N_.forEach((t,e)=>{iu(n,t)})}async function mE(n,t){Um(n),ou(n)?(n.q_.M_(t),ru(n)):n.q_.set("Unknown")}async function yE(n,t,e){if(n.q_.set("Online"),t instanceof Am&&t.state===2&&t.cause)try{await async function(i,r){const o=r.cause;for(const a of r.targetIds)i.N_.has(a)&&(await i.remoteSyncer.rejectListen(a,o),i.N_.delete(a),i.Q_.removeTarget(a))}(n,t)}catch(s){U("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),s),await Uo(n,s)}else if(t instanceof fo?n.Q_.Ke(t):t instanceof Tm?n.Q_.He(t):n.Q_.We(t),!e.isEqual(W.min()))try{const s=await Vm(n.localStore);e.compareTo(s)>=0&&await function(r,o){const a=r.Q_.rt(o);return a.targetChanges.forEach((l,c)=>{if(l.resumeToken.approximateByteSize()>0){const d=r.N_.get(c);d&&r.N_.set(c,d.withResumeToken(l.resumeToken,o))}}),a.targetMismatches.forEach((l,c)=>{const d=r.N_.get(l);if(!d)return;r.N_.set(l,d.withResumeToken(Nt.EMPTY_BYTE_STRING,d.snapshotVersion)),jm(r,l);const h=new cn(d.target,l,c,d.sequenceNumber);iu(r,h)}),r.remoteSyncer.applyRemoteEvent(a)}(n,e)}catch(s){U("RemoteStore","Failed to raise snapshot:",s),await Uo(n,s)}}async function Uo(n,t,e){if(!ur(t))throw t;n.L_.add(1),await gr(n),n.q_.set("Offline"),e||(e=()=>Vm(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await e(),n.L_.delete(1),await ga(n)})}function zm(n,t){return t().catch(e=>Uo(n,e,t))}async function pa(n){const t=G(n),e=In(t);let s=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;_E(t);)try{const i=await eE(t.localStore,s);if(i===null){t.O_.length===0&&e.o_();break}s=i.batchId,bE(t,i)}catch(i){await Uo(t,i)}$m(t)&&Hm(t)}function _E(n){return ns(n)&&n.O_.length<10}function bE(n,t){n.O_.push(t);const e=In(n);e.r_()&&e.V_&&e.m_(t.mutations)}function $m(n){return ns(n)&&!In(n).n_()&&n.O_.length>0}function Hm(n){In(n).start()}async function vE(n){In(n).p_()}async function wE(n){const t=In(n);for(const e of n.O_)t.m_(e.mutations)}async function xE(n,t,e){const s=n.O_.shift(),i=Xc.from(s,t,e);await zm(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await pa(n)}async function kE(n,t){t&&In(n).V_&&await async function(s,i){if(function(o){return dk(o)&&o!==O.ABORTED}(i.code)){const r=s.O_.shift();In(s).s_(),await zm(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await pa(s)}}(n,t),$m(n)&&Hm(n)}async function lf(n,t){const e=G(n);e.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const s=ns(e);e.L_.add(3),await gr(e),s&&e.q_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.L_.delete(3),await ga(e)}async function EE(n,t){const e=G(n);t?(e.L_.delete(2),await ga(e)):t||(e.L_.add(2),await gr(e),e.q_.set("Unknown"))}function Ws(n){return n.K_||(n.K_=function(e,s,i){const r=G(e);return r.w_(),new cE(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:gE.bind(null,n),Ro:pE.bind(null,n),mo:mE.bind(null,n),d_:yE.bind(null,n)}),n.B_.push(async t=>{t?(n.K_.s_(),ou(n)?ru(n):n.q_.set("Unknown")):(await n.K_.stop(),Um(n))})),n.K_}function In(n){return n.U_||(n.U_=function(e,s,i){const r=G(e);return r.w_(),new uE(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:vE.bind(null,n),mo:kE.bind(null,n),f_:wE.bind(null,n),g_:xE.bind(null,n)}),n.B_.push(async t=>{t?(n.U_.s_(),await pa(n)):(await n.U_.stop(),n.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(t,e,s,i,r){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new qe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,s,i,r){const o=Date.now()+s,a=new au(t,e,o,i,r);return a.start(s),a}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new j(O.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function lu(n,t){if(Ye("AsyncQueue",`${t}: ${n}`),ur(n))return new j(O.UNAVAILABLE,`${t}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(t){this.comparator=t?(e,s)=>t(e,s)||z.comparator(e.key,s.key):(e,s)=>z.comparator(e.key,s.key),this.keyedMap=yi(),this.sortedSet=new yt(this.comparator)}static emptySet(t){return new xs(t.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,s)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof xs)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),s=t.sortedSet.getIterator();for(;e.hasNext();){const i=e.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const s=new xs;return s.comparator=this.comparator,s.keyedMap=t,s.sortedSet=e,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cf{constructor(){this.W_=new yt(z.comparator)}track(t){const e=t.doc.key,s=this.W_.get(e);s?t.type!==0&&s.type===3?this.W_=this.W_.insert(e,t):t.type===3&&s.type!==1?this.W_=this.W_.insert(e,{type:s.type,doc:t.doc}):t.type===2&&s.type===2?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):t.type===2&&s.type===0?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):t.type===1&&s.type===0?this.W_=this.W_.remove(e):t.type===1&&s.type===2?this.W_=this.W_.insert(e,{type:1,doc:s.doc}):t.type===0&&s.type===1?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):H():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,s)=>{t.push(s)}),t}}class Ls{constructor(t,e,s,i,r,o,a,l,c){this.query=t,this.docs=e,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=l,this.hasCachedResults=c}static fromInitialDocuments(t,e,s,i,r){const o=[];return e.forEach(a=>{o.push({type:0,doc:a})}),new Ls(t,e,xs.emptySet(e),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&la(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,s=t.docChanges;if(e.length!==s.length)return!1;for(let i=0;i<e.length;i++)if(e[i].type!==s[i].type||!e[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IE{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class TE{constructor(){this.queries=uf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(e,s){const i=G(e),r=i.queries;i.queries=uf(),r.forEach((o,a)=>{for(const l of a.j_)l.onError(s)})})(this,new j(O.ABORTED,"Firestore shutting down"))}}function uf(){return new Hs(n=>fm(n),la)}async function cu(n,t){const e=G(n);let s=3;const i=t.query;let r=e.queries.get(i);r?!r.H_()&&t.J_()&&(s=2):(r=new IE,s=t.J_()?0:1);try{switch(s){case 0:r.z_=await e.onListen(i,!0);break;case 1:r.z_=await e.onListen(i,!1);break;case 2:await e.onFirstRemoteStoreListen(i)}}catch(o){const a=lu(o,`Initialization of query '${gs(t.query)}' failed`);return void t.onError(a)}e.queries.set(i,r),r.j_.push(t),t.Z_(e.onlineState),r.z_&&t.X_(r.z_)&&du(e)}async function uu(n,t){const e=G(n),s=t.query;let i=3;const r=e.queries.get(s);if(r){const o=r.j_.indexOf(t);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=t.J_()?0:1:!r.H_()&&t.J_()&&(i=2))}switch(i){case 0:return e.queries.delete(s),e.onUnlisten(s,!0);case 1:return e.queries.delete(s),e.onUnlisten(s,!1);case 2:return e.onLastRemoteStoreUnlisten(s);default:return}}function AE(n,t){const e=G(n);let s=!1;for(const i of t){const r=i.query,o=e.queries.get(r);if(o){for(const a of o.j_)a.X_(i)&&(s=!0);o.z_=i}}s&&du(e)}function SE(n,t,e){const s=G(n),i=s.queries.get(t);if(i)for(const r of i.j_)r.onError(e);s.queries.delete(t)}function du(n){n.Y_.forEach(t=>{t.next()})}var Xl,df;(df=Xl||(Xl={})).ea="default",df.Cache="cache";class hu{constructor(t,e,s){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(t){if(!this.options.includeMetadataChanges){const s=[];for(const i of t.docChanges)i.type!==3&&s.push(i);t=new Ls(t.query,t.docs,t.oldDocs,s,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache||!this.J_())return!0;const s=e!=="Offline";return(!this.options._a||!s)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}oa(t){t=Ls.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==Xl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(t){this.key=t}}class qm{constructor(t){this.key=t}}class PE{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Q(),this.mutatedKeys=Q(),this.Aa=gm(t),this.Ra=new xs(this.Aa)}get Va(){return this.Ta}ma(t,e){const s=e?e.fa:new cf,i=e?e.Ra:this.Ra;let r=e?e.mutatedKeys:this.mutatedKeys,o=i,a=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(t.inorderTraversal((d,h)=>{const g=i.get(d),m=ca(this.query,h)?h:null,y=!!g&&this.mutatedKeys.has(g.key),_=!!m&&(m.hasLocalMutations||this.mutatedKeys.has(m.key)&&m.hasCommittedMutations);let w=!1;g&&m?g.data.isEqual(m.data)?y!==_&&(s.track({type:3,doc:m}),w=!0):this.ga(g,m)||(s.track({type:2,doc:m}),w=!0,(l&&this.Aa(m,l)>0||c&&this.Aa(m,c)<0)&&(a=!0)):!g&&m?(s.track({type:0,doc:m}),w=!0):g&&!m&&(s.track({type:1,doc:g}),w=!0,(l||c)&&(a=!0)),w&&(m?(o=o.add(m),r=_?r.add(d):r.delete(d)):(o=o.delete(d),r=r.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),r=r.delete(d.key),s.track({type:1,doc:d})}return{Ra:o,fa:s,ns:a,mutatedKeys:r}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,s,i){const r=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const o=t.fa.G_();o.sort((d,h)=>function(m,y){const _=w=>{switch(w){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return H()}};return _(m)-_(y)}(d.type,h.type)||this.Aa(d.doc,h.doc)),this.pa(s),i=i!=null&&i;const a=e&&!i?this.ya():[],l=this.da.size===0&&this.current&&!i?1:0,c=l!==this.Ea;return this.Ea=l,o.length!==0||c?{snapshot:new Ls(this.query,t.Ra,r,o,t.mutatedKeys,l===0,c,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:a}:{wa:a}}Z_(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new cf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=Q(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const e=[];return t.forEach(s=>{this.da.has(s)||e.push(new qm(s))}),this.da.forEach(s=>{t.has(s)||e.push(new Wm(s))}),e}ba(t){this.Ta=t.Ts,this.da=Q();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return Ls.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class CE{constructor(t,e,s){this.query=t,this.targetId=e,this.view=s}}class RE{constructor(t){this.key=t,this.va=!1}}class DE{constructor(t,e,s,i,r,o){this.localStore=t,this.remoteStore=e,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Hs(a=>fm(a),la),this.Ma=new Map,this.xa=new Set,this.Oa=new yt(z.comparator),this.Na=new Map,this.La=new tu,this.Ba={},this.ka=new Map,this.qa=Ms.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function ME(n,t,e=!0){const s=Jm(n);let i;const r=s.Fa.get(t);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await Gm(s,t,e,!0),i}async function LE(n,t){const e=Jm(n);await Gm(e,t,!0,!1)}async function Gm(n,t,e,s){const i=await nE(n.localStore,Ie(t)),r=i.targetId,o=n.sharedClientState.addLocalQueryTarget(r,e);let a;return s&&(a=await OE(n,t,r,o==="current",i.resumeToken)),n.isPrimaryClient&&e&&Bm(n.remoteStore,i),a}async function OE(n,t,e,s,i){n.Ka=(h,g,m)=>async function(_,w,A,P){let D=w.view.ma(A);D.ns&&(D=await rf(_.localStore,w.query,!1).then(({documents:k})=>w.view.ma(k,D)));const L=P&&P.targetChanges.get(w.targetId),M=P&&P.targetMismatches.get(w.targetId)!=null,V=w.view.applyChanges(D,_.isPrimaryClient,L,M);return ff(_,w.targetId,V.wa),V.snapshot}(n,h,g,m);const r=await rf(n.localStore,t,!0),o=new PE(t,r.Ts),a=o.ma(r.documents),l=fr.createSynthesizedTargetChangeForCurrentChange(e,s&&n.onlineState!=="Offline",i),c=o.applyChanges(a,n.isPrimaryClient,l);ff(n,e,c.wa);const d=new CE(t,e,o);return n.Fa.set(t,d),n.Ma.has(e)?n.Ma.get(e).push(t):n.Ma.set(e,[t]),c.snapshot}async function VE(n,t,e){const s=G(n),i=s.Fa.get(t),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!la(o,t))),void s.Fa.delete(t);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await Ql(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),e&&su(s.remoteStore,i.targetId),Jl(s,i.targetId)}).catch(cr)):(Jl(s,i.targetId),await Ql(s.localStore,i.targetId,!0))}async function NE(n,t){const e=G(n),s=e.Fa.get(t),i=e.Ma.get(s.targetId);e.isPrimaryClient&&i.length===1&&(e.sharedClientState.removeLocalQueryTarget(s.targetId),su(e.remoteStore,s.targetId))}async function FE(n,t,e){const s=WE(n);try{const i=await function(o,a){const l=G(o),c=pt.now(),d=a.reduce((m,y)=>m.add(y.key),Q());let h,g;return l.persistence.runTransaction("Locally write mutations","readwrite",m=>{let y=Qe(),_=Q();return l.cs.getEntries(m,d).next(w=>{y=w,y.forEach((A,P)=>{P.isValidDocument()||(_=_.add(A))})}).next(()=>l.localDocuments.getOverlayedDocuments(m,y)).next(w=>{h=w;const A=[];for(const P of a){const D=ok(P,h.get(P.key).overlayedDocument);D!=null&&A.push(new Cn(P.key,D,rm(D.value.mapValue),pe.exists(!0)))}return l.mutationQueue.addMutationBatch(m,c,A,a)}).next(w=>{g=w;const A=w.applyToLocalDocumentSet(h,_);return l.documentOverlayCache.saveOverlays(m,w.batchId,A)})}).then(()=>({batchId:g.batchId,changes:mm(h)}))}(s.localStore,t);s.sharedClientState.addPendingMutation(i.batchId),function(o,a,l){let c=o.Ba[o.currentUser.toKey()];c||(c=new yt(nt)),c=c.insert(a,l),o.Ba[o.currentUser.toKey()]=c}(s,i.batchId,e),await pr(s,i.changes),await pa(s.remoteStore)}catch(i){const r=lu(i,"Failed to persist write");e.reject(r)}}async function Km(n,t){const e=G(n);try{const s=await Zk(e.localStore,t);t.targetChanges.forEach((i,r)=>{const o=e.Na.get(r);o&&(rt(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?rt(o.va):i.removedDocuments.size>0&&(rt(o.va),o.va=!1))}),await pr(e,s,t)}catch(s){await cr(s)}}function hf(n,t,e){const s=G(n);if(s.isPrimaryClient&&e===0||!s.isPrimaryClient&&e===1){const i=[];s.Fa.forEach((r,o)=>{const a=o.view.Z_(t);a.snapshot&&i.push(a.snapshot)}),function(o,a){const l=G(o);l.onlineState=a;let c=!1;l.queries.forEach((d,h)=>{for(const g of h.j_)g.Z_(a)&&(c=!0)}),c&&du(l)}(s.eventManager,t),i.length&&s.Ca.d_(i),s.onlineState=t,s.isPrimaryClient&&s.sharedClientState.setOnlineState(t)}}async function BE(n,t,e){const s=G(n);s.sharedClientState.updateQueryState(t,"rejected",e);const i=s.Na.get(t),r=i&&i.key;if(r){let o=new yt(z.comparator);o=o.insert(r,qt.newNoDocument(r,W.min()));const a=Q().add(r),l=new ha(W.min(),new Map,new yt(nt),o,a);await Km(s,l),s.Oa=s.Oa.remove(r),s.Na.delete(t),fu(s)}else await Ql(s.localStore,t,!1).then(()=>Jl(s,t,e)).catch(cr)}async function jE(n,t){const e=G(n),s=t.batch.batchId;try{const i=await Jk(e.localStore,t);Qm(e,s,null),Ym(e,s),e.sharedClientState.updateMutationState(s,"acknowledged"),await pr(e,i)}catch(i){await cr(i)}}async function UE(n,t,e){const s=G(n);try{const i=await function(o,a){const l=G(o);return l.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let d;return l.mutationQueue.lookupMutationBatch(c,a).next(h=>(rt(h!==null),d=h.keys(),l.mutationQueue.removeMutationBatch(c,h))).next(()=>l.mutationQueue.performConsistencyCheck(c)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(c,d,a)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,d)).next(()=>l.localDocuments.getDocuments(c,d))})}(s.localStore,t);Qm(s,t,e),Ym(s,t),s.sharedClientState.updateMutationState(t,"rejected",e),await pr(s,i)}catch(i){await cr(i)}}function Ym(n,t){(n.ka.get(t)||[]).forEach(e=>{e.resolve()}),n.ka.delete(t)}function Qm(n,t,e){const s=G(n);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(t);r&&(e?r.reject(e):r.resolve(),i=i.remove(t)),s.Ba[s.currentUser.toKey()]=i}}function Jl(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const s of n.Ma.get(t))n.Fa.delete(s),e&&n.Ca.$a(s,e);n.Ma.delete(t),n.isPrimaryClient&&n.La.gr(t).forEach(s=>{n.La.containsKey(s)||Xm(n,s)})}function Xm(n,t){n.xa.delete(t.path.canonicalString());const e=n.Oa.get(t);e!==null&&(su(n.remoteStore,e),n.Oa=n.Oa.remove(t),n.Na.delete(e),fu(n))}function ff(n,t,e){for(const s of e)s instanceof Wm?(n.La.addReference(s.key,t),zE(n,s)):s instanceof qm?(U("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,t),n.La.containsKey(s.key)||Xm(n,s.key)):H()}function zE(n,t){const e=t.key,s=e.path.canonicalString();n.Oa.get(e)||n.xa.has(s)||(U("SyncEngine","New document in limbo: "+e),n.xa.add(s),fu(n))}function fu(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const t=n.xa.values().next().value;n.xa.delete(t);const e=new z(dt.fromString(t)),s=n.qa.next();n.Na.set(s,new RE(e)),n.Oa=n.Oa.insert(e,s),Bm(n.remoteStore,new cn(Ie(aa(e.path)),s,"TargetPurposeLimboResolution",$c.oe))}}async function pr(n,t,e){const s=G(n),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((a,l)=>{o.push(s.Ka(l,t,e).then(c=>{var d;if((c||e)&&s.isPrimaryClient){const h=c?!c.fromCache:(d=e==null?void 0:e.targetChanges.get(l.targetId))===null||d===void 0?void 0:d.current;s.sharedClientState.updateQueryState(l.targetId,h?"current":"not-current")}if(c){i.push(c);const h=nu.Wi(l.targetId,c);r.push(h)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(l,c){const d=G(l);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",h=>N.forEach(c,g=>N.forEach(g.$i,m=>d.persistence.referenceDelegate.addReference(h,g.targetId,m)).next(()=>N.forEach(g.Ui,m=>d.persistence.referenceDelegate.removeReference(h,g.targetId,m)))))}catch(h){if(!ur(h))throw h;U("LocalStore","Failed to update sequence numbers: "+h)}for(const h of c){const g=h.targetId;if(!h.fromCache){const m=d.os.get(g),y=m.snapshotVersion,_=m.withLastLimboFreeSnapshotVersion(y);d.os=d.os.insert(g,_)}}}(s.localStore,r))}async function $E(n,t){const e=G(n);if(!e.currentUser.isEqual(t)){U("SyncEngine","User change. New user:",t.toKey());const s=await Om(e.localStore,t);e.currentUser=t,function(r,o){r.ka.forEach(a=>{a.forEach(l=>{l.reject(new j(O.CANCELLED,o))})}),r.ka.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,s.removedBatchIds,s.addedBatchIds),await pr(e,s.hs)}}function HE(n,t){const e=G(n),s=e.Na.get(t);if(s&&s.va)return Q().add(s.key);{let i=Q();const r=e.Ma.get(t);if(!r)return i;for(const o of r){const a=e.Fa.get(o);i=i.unionWith(a.view.Va)}return i}}function Jm(n){const t=G(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=Km.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=HE.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=BE.bind(null,t),t.Ca.d_=AE.bind(null,t.eventManager),t.Ca.$a=SE.bind(null,t.eventManager),t}function WE(n){const t=G(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=jE.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=UE.bind(null,t),t}class zo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=fa(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return Xk(this.persistence,new Yk,t.initialUser,this.serializer)}Ga(t){return new qk(eu.Zr,this.serializer)}Wa(t){return new iE}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}zo.provider={build:()=>new zo};class Zl{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>hf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=$E.bind(null,this.syncEngine),await EE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new TE}()}createDatastore(t){const e=fa(t.databaseInfo.databaseId),s=function(r){return new lE(r)}(t.databaseInfo);return function(r,o,a,l){return new dE(r,o,a,l)}(t.authCredentials,t.appCheckCredentials,s,e)}createRemoteStore(t){return function(s,i,r,o,a){return new fE(s,i,r,o,a)}(this.localStore,this.datastore,t.asyncQueue,e=>hf(this.syncEngine,e,0),function(){return af.D()?new af:new rE}())}createSyncEngine(t,e){return function(i,r,o,a,l,c,d){const h=new DE(i,r,o,a,l,c);return d&&(h.Qa=!0),h}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(i){const r=G(i);U("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await gr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Zl.provider={build:()=>new Zl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):Ye("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qE{constructor(t,e,s,i,r){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=s,this.databaseInfo=i,this.user=Ht.UNAUTHENTICATED,this.clientId=nm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{U("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(U("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new qe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const s=lu(e,"Failed to shutdown persistence");t.reject(s)}}),t.promise}}async function cl(n,t){n.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let s=e.initialUser;n.setCredentialChangeListener(async i=>{s.isEqual(i)||(await Om(t.localStore,i),s=i)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function gf(n,t){n.asyncQueue.verifyOperationInProgress();const e=await GE(n);U("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(s=>lf(t.remoteStore,s)),n.setAppCheckTokenChangeListener((s,i)=>lf(t.remoteStore,i)),n._onlineComponents=t}async function GE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await cl(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(i){return i.name==="FirebaseError"?i.code===O.FAILED_PRECONDITION||i.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(e))throw e;Ps("Error using user provided cache. Falling back to memory cache: "+e),await cl(n,new zo)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await cl(n,new zo);return n._offlineComponents}async function Zm(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await gf(n,n._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await gf(n,new Zl))),n._onlineComponents}function KE(n){return Zm(n).then(t=>t.syncEngine)}async function $o(n){const t=await Zm(n),e=t.eventManager;return e.onListen=ME.bind(null,t.syncEngine),e.onUnlisten=VE.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=LE.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=NE.bind(null,t.syncEngine),e}function YE(n,t,e={}){const s=new qe;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,a,l,c){const d=new gu({next:g=>{d.Za(),o.enqueueAndForget(()=>uu(r,h));const m=g.docs.has(a);!m&&g.fromCache?c.reject(new j(O.UNAVAILABLE,"Failed to get document because the client is offline.")):m&&g.fromCache&&l&&l.source==="server"?c.reject(new j(O.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(g)},error:g=>c.reject(g)}),h=new hu(aa(a.path),d,{includeMetadataChanges:!0,_a:!0});return cu(r,h)}(await $o(n),n.asyncQueue,t,e,s)),s.promise}function QE(n,t,e={}){const s=new qe;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,a,l,c){const d=new gu({next:g=>{d.Za(),o.enqueueAndForget(()=>uu(r,h)),g.fromCache&&l.source==="server"?c.reject(new j(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(g)},error:g=>c.reject(g)}),h=new hu(a,d,{includeMetadataChanges:!0,_a:!0});return cu(r,h)}(await $o(n),n.asyncQueue,t,e,s)),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t0(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e0(n,t,e){if(!e)throw new j(O.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function XE(n,t,e,s){if(t===!0&&s===!0)throw new j(O.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function mf(n){if(!z.isDocumentKey(n))throw new j(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function yf(n){if(z.isDocumentKey(n))throw new j(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function ma(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(s){return s.constructor?s.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":H()}function le(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new j(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=ma(n);throw new j(O.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(t){var e,s;if(t.host===void 0){if(t.ssl!==void 0)throw new j(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new j(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}XE("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=t0((s=t.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new j(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class ya{constructor(t,e,s,i){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _f({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new j(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new j(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _f(t),t.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new px;switch(s.type){case"firstParty":return new bx(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new j(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const s=pf.get(e);s&&(U("ComponentProvider","Removing Datastore"),pf.delete(e),s.terminate())}(this),Promise.resolve()}}function JE(n,t,e,s={}){var i;const r=(n=le(n,ya))._getSettings(),o=`${t}:${e}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Ps("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let a,l;if(typeof s.mockUserToken=="string")a=s.mockUserToken,l=Ht.MOCK_USER;else{a=P_(s.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const c=s.mockUserToken.sub||s.mockUserToken.user_id;if(!c)throw new j(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new Ht(c)}n._authCredentials=new mx(new em(a,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(t,e,s){this.converter=e,this._query=s,this.type="query",this.firestore=t}withConverter(t){return new ss(this.firestore,t,this._query)}}class Zt{constructor(t,e,s){this.converter=e,this._key=s,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new vn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Zt(this.firestore,t,this._key)}}class vn extends ss{constructor(t,e,s){super(t,e,aa(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Zt(this.firestore,null,new z(t))}withConverter(t){return new vn(this.firestore,t,this._path)}}function ks(n,t,...e){if(n=Pt(n),e0("collection","path",t),n instanceof ya){const s=dt.fromString(t,...e);return yf(s),new vn(n,null,s)}{if(!(n instanceof Zt||n instanceof vn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(dt.fromString(t,...e));return yf(s),new vn(n.firestore,null,s)}}function mr(n,t,...e){if(n=Pt(n),arguments.length===1&&(t=nm.newId()),e0("doc","path",t),n instanceof ya){const s=dt.fromString(t,...e);return mf(s),new Zt(n,null,new z(s))}{if(!(n instanceof Zt||n instanceof vn))throw new j(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(dt.fromString(t,...e));return mf(s),new Zt(n.firestore,n instanceof vn?n.converter:null,new z(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Nm(this,"async_queue_retry"),this.Vu=()=>{const s=ll();s&&U("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=t;const e=ll();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=ll();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new qe;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!ur(t))throw t;U("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(s);throw Ye("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=e,e}enqueueAfterDelay(t,e,s){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const i=au.createAndSchedule(this,t,e,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&H()}verifyOperationInProgress(){}async wu(){let t;do t=this.mu,await t;while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((e,s)=>e.targetTimeMs-s.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}function vf(n){return function(e,s){if(typeof e!="object"||e===null)return!1;const i=e;for(const r of s)if(r in i&&typeof i[r]=="function")return!0;return!1}(n,["next","error","complete"])}class Tn extends ya{constructor(t,e,s,i){super(t,e,s,i),this.type="firestore",this._queue=new bf,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new bf(t),this._firestoreClient=void 0,await t}}}function ZE(n,t){const e=typeof n=="object"?n:hp(),s=typeof n=="string"?n:"(default)",i=Dc(e,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=A_("firestore");r&&JE(i,...r)}return i}function _a(n){if(n._terminated)throw new j(O.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||tI(n),n._firestoreClient}function tI(n){var t,e,s;const i=n._freezeSettings(),r=function(a,l,c,d){return new Dx(a,l,c,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,t0(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((t=n._app)===null||t===void 0?void 0:t.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((e=i.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new qE(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(a){const l=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(l),_online:l}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Os(Nt.fromBase64String(t))}catch(e){throw new j(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Os(Nt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ba{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new j(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ot(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new j(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new j(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return nt(this._lat,t._lat)||nt(this._long,t._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,t._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eI=/^__.*__$/;class nI{constructor(t,e,s){this.data=t,this.fieldMask=e,this.fieldTransforms=s}toMutation(t,e){return this.fieldMask!==null?new Cn(t,this.data,this.fieldMask,e,this.fieldTransforms):new hr(t,this.data,e,this.fieldTransforms)}}class n0{constructor(t,e,s){this.data=t,this.fieldMask=e,this.fieldTransforms=s}toMutation(t,e){return new Cn(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function s0(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw H()}}class _u{constructor(t,e,s,i,r,o){this.settings=t,this.databaseId=e,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new _u(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const s=(e=this.path)===null||e===void 0?void 0:e.child(t),i=this.Fu({path:s,xu:!1});return i.Ou(t),i}Nu(t){var e;const s=(e=this.path)===null||e===void 0?void 0:e.child(t),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return Ho(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(t.length===0)throw this.Bu("Document fields must not be empty");if(s0(this.Cu)&&eI.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class sI{constructor(t,e,s){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=s||fa(t)}Qu(t,e,s,i=!1){return new _u({Cu:t,methodName:e,qu:s,path:Ot.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function bu(n){const t=n._freezeSettings(),e=fa(n._databaseId);return new sI(n._databaseId,!!t.ignoreUndefinedProperties,e)}function iI(n,t,e,s,i,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,t,e,i);vu("Data must be an object, but it was:",o,s);const a=i0(s,o);let l,c;if(r.merge)l=new re(o.fieldMask),c=o.fieldTransforms;else if(r.mergeFields){const d=[];for(const h of r.mergeFields){const g=tc(t,h,e);if(!o.contains(g))throw new j(O.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);o0(d,g)||d.push(g)}l=new re(d),c=o.fieldTransforms.filter(h=>l.covers(h.field))}else l=null,c=o.fieldTransforms;return new nI(new ee(a),l,c)}class va extends pu{_toFieldTransform(t){if(t.Cu!==2)throw t.Cu===1?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof va}}function rI(n,t,e,s){const i=n.Qu(1,t,e);vu("Data must be an object, but it was:",i,s);const r=[],o=ee.empty();es(s,(l,c)=>{const d=wu(t,l,e);c=Pt(c);const h=i.Nu(d);if(c instanceof va)r.push(d);else{const g=yr(c,h);g!=null&&(r.push(d),o.set(d,g))}});const a=new re(r);return new n0(o,a,i.fieldTransforms)}function oI(n,t,e,s,i,r){const o=n.Qu(1,t,e),a=[tc(t,s,e)],l=[i];if(r.length%2!=0)throw new j(O.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<r.length;g+=2)a.push(tc(t,r[g])),l.push(r[g+1]);const c=[],d=ee.empty();for(let g=a.length-1;g>=0;--g)if(!o0(c,a[g])){const m=a[g];let y=l[g];y=Pt(y);const _=o.Nu(m);if(y instanceof va)c.push(m);else{const w=yr(y,_);w!=null&&(c.push(m),d.set(m,w))}}const h=new re(c);return new n0(d,h,o.fieldTransforms)}function aI(n,t,e,s=!1){return yr(e,n.Qu(s?4:3,t))}function yr(n,t){if(r0(n=Pt(n)))return vu("Unsupported field value:",t,n),i0(n,t);if(n instanceof pu)return function(s,i){if(!s0(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.xu&&t.Cu!==4)throw t.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const a of s){let l=yr(a,i.Lu(o));l==null&&(l={nullValue:"NULL_VALUE"}),r.push(l),o++}return{arrayValue:{values:r}}}(n,t)}return function(s,i){if((s=Pt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return tk(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=pt.fromDate(s);return{timestampValue:jo(i.serializer,r)}}if(s instanceof pt){const r=new pt(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:jo(i.serializer,r)}}if(s instanceof mu)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Os)return{bytesValue:Sm(i.serializer,s._byteString)};if(s instanceof Zt){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:Zc(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof yu)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(l=>{if(typeof l!="number")throw a.Bu("VectorValues must only contain numeric values.");return Yc(a.serializer,l)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${ma(s)}`)}(n,t)}function i0(n,t){const e={};return sm(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):es(n,(s,i)=>{const r=yr(i,t.Mu(s));r!=null&&(e[s]=r)}),{mapValue:{fields:e}}}function r0(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof pt||n instanceof mu||n instanceof Os||n instanceof Zt||n instanceof pu||n instanceof yu)}function vu(n,t,e){if(!r0(e)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(e)){const s=ma(e);throw s==="an object"?t.Bu(n+" a custom object"):t.Bu(n+" "+s)}}function tc(n,t,e){if((t=Pt(t))instanceof ba)return t._internalPath;if(typeof t=="string")return wu(n,t);throw Ho("Field path arguments must be of type string or ",n,!1,void 0,e)}const lI=new RegExp("[~\\*/\\[\\]]");function wu(n,t,e){if(t.search(lI)>=0)throw Ho(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new ba(...t.split("."))._internalPath}catch{throw Ho(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function Ho(n,t,e,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let a=`Function ${t}() called with invalid data`;e&&(a+=" (via `toFirestore()`)"),a+=". ";let l="";return(r||o)&&(l+=" (found",r&&(l+=` in field ${s}`),o&&(l+=` in document ${i}`),l+=")"),new j(O.INVALID_ARGUMENT,a+n+l)}function o0(n,t){return n.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a0{constructor(t,e,s,i,r){this._firestore=t,this._userDataWriter=e,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Zt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new cI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(l0("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class cI extends a0{data(){return super.data()}}function l0(n,t){return typeof t=="string"?wu(n,t):t instanceof ba?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c0(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new j(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class xu{}class uI extends xu{}function u0(n,t,...e){let s=[];t instanceof xu&&s.push(t),s=s.concat(e),function(r){const o=r.filter(l=>l instanceof Eu).length,a=r.filter(l=>l instanceof ku).length;if(o>1||o>0&&a>0)throw new j(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)n=i._apply(n);return n}class ku extends uI{constructor(t,e,s){super(),this._field=t,this._op=e,this._value=s,this.type="where"}static _create(t,e,s){return new ku(t,e,s)}_apply(t){const e=this._parse(t);return d0(t._query,e),new ss(t.firestore,t.converter,Hl(t._query,e))}_parse(t){const e=bu(t.firestore);return function(r,o,a,l,c,d,h){let g;if(c.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new j(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){xf(h,d);const m=[];for(const y of h)m.push(wf(l,r,y));g={arrayValue:{values:m}}}else g=wf(l,r,h)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||xf(h,d),g=aI(a,o,h,d==="in"||d==="not-in");return Tt.create(c,d,g)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}class Eu extends xu{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Eu(t,e)}_parse(t){const e=this._queryConstraints.map(s=>s._parse(t)).filter(s=>s.getFilters().length>0);return e.length===1?e[0]:_e.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(i,r){let o=i;const a=r.getFlattenedFilters();for(const l of a)d0(o,l),o=Hl(o,l)}(t._query,e),new ss(t.firestore,t.converter,Hl(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function wf(n,t,e){if(typeof(e=Pt(e))=="string"){if(e==="")throw new j(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!hm(t)&&e.indexOf("/")!==-1)throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const s=t.path.child(dt.fromString(e));if(!z.isDocumentKey(s))throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Uh(n,new z(s))}if(e instanceof Zt)return Uh(n,e._key);throw new j(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ma(e)}.`)}function xf(n,t){if(!Array.isArray(n)||n.length===0)throw new j(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function d0(n,t){const e=function(i,r){for(const o of i)for(const a of o.getFlattenedFilters())if(r.indexOf(a.op)>=0)return a.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new j(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class dI{convertValue(t,e="none"){switch(Xn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return xt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Qn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw H()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const s={};return es(t,(i,r)=>{s[i]=this.convertValue(r,e)}),s}convertVectorValue(t){var e,s,i;const r=(i=(s=(e=t.fields)===null||e===void 0?void 0:e.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>xt(o.doubleValue));return new yu(r)}convertGeoPoint(t){return new mu(xt(t.latitude),xt(t.longitude))}convertArray(t,e){return(t.values||[]).map(s=>this.convertValue(s,e))}convertServerTimestamp(t,e){switch(e){case"previous":const s=Wc(t);return s==null?null:this.convertValue(s,e);case"estimate":return this.convertTimestamp(Ui(t));default:return null}}convertTimestamp(t){const e=En(t);return new pt(e.seconds,e.nanos)}convertDocumentKey(t,e){const s=dt.fromString(t);rt(Lm(s));const i=new zi(s.get(1),s.get(3)),r=new z(s.popFirst(5));return i.isEqual(e)||Ye(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hI(n,t,e){let s;return s=n?n.toFirestore(t):t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class h0 extends a0{constructor(t,e,s,i,r,o){super(t,e,s,i,o),this._firestore=t,this._firestoreImpl=t,this.metadata=r}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new go(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const s=this._document.data.field(l0("DocumentSnapshot.get",t));if(s!==null)return this._userDataWriter.convertValue(s,e.serverTimestamps)}}}class go extends h0{data(t={}){return super.data(t)}}class f0{constructor(t,e,s,i){this._firestore=t,this._userDataWriter=e,this._snapshot=i,this.metadata=new bi(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(s=>{t.call(e,new go(this._firestore,this._userDataWriter,s.key,s,new bi(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new j(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(a=>{const l=new go(i._firestore,i._userDataWriter,a.doc.key,a.doc,new bi(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);return a.doc,{type:"added",doc:l,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(a=>r||a.type!==3).map(a=>{const l=new go(i._firestore,i._userDataWriter,a.doc.key,a.doc,new bi(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,d=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),d=o.indexOf(a.doc.key)),{type:fI(a.type),doc:l,oldIndex:c,newIndex:d}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function fI(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return H()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gI(n){n=le(n,Zt);const t=le(n.firestore,Tn);return YE(_a(t),n._key).then(e=>m0(t,n,e))}class Iu extends dI{constructor(t){super(),this.firestore=t}convertBytes(t){return new Os(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new Zt(this.firestore,null,e)}}function ul(n){n=le(n,ss);const t=le(n.firestore,Tn),e=_a(t),s=new Iu(t);return c0(n._query),QE(e,n._query).then(i=>new f0(t,s,n,i))}function g0(n,t,e,...s){n=le(n,Zt);const i=le(n.firestore,Tn),r=bu(i);let o;return o=typeof(t=Pt(t))=="string"||t instanceof ba?oI(r,"updateDoc",n._key,t,e,s):rI(r,"updateDoc",n._key,t),Tu(i,[o.toMutation(n._key,pe.exists(!0))])}function pI(n){return Tu(le(n.firestore,Tn),[new Qc(n._key,pe.none())])}function mI(n,t){const e=le(n.firestore,Tn),s=mr(n),i=hI(n.converter,t);return Tu(e,[iI(bu(n.firestore),"addDoc",s._key,i,n.converter!==null,{}).toMutation(s._key,pe.exists(!1))]).then(()=>s)}function p0(n,...t){var e,s,i;n=Pt(n);let r={includeMetadataChanges:!1,source:"default"},o=0;typeof t[o]!="object"||vf(t[o])||(r=t[o],o++);const a={includeMetadataChanges:r.includeMetadataChanges,source:r.source};if(vf(t[o])){const h=t[o];t[o]=(e=h.next)===null||e===void 0?void 0:e.bind(h),t[o+1]=(s=h.error)===null||s===void 0?void 0:s.bind(h),t[o+2]=(i=h.complete)===null||i===void 0?void 0:i.bind(h)}let l,c,d;if(n instanceof Zt)c=le(n.firestore,Tn),d=aa(n._key.path),l={next:h=>{t[o]&&t[o](m0(c,n,h))},error:t[o+1],complete:t[o+2]};else{const h=le(n,ss);c=le(h.firestore,Tn),d=h._query;const g=new Iu(c);l={next:m=>{t[o]&&t[o](new f0(c,g,h,m))},error:t[o+1],complete:t[o+2]},c0(n._query)}return function(g,m,y,_){const w=new gu(_),A=new hu(m,w,y);return g.asyncQueue.enqueueAndForget(async()=>cu(await $o(g),A)),()=>{w.Za(),g.asyncQueue.enqueueAndForget(async()=>uu(await $o(g),A))}}(_a(c),d,a,l)}function Tu(n,t){return function(s,i){const r=new qe;return s.asyncQueue.enqueueAndForget(async()=>FE(await KE(s),i,r)),r.promise}(_a(n),t)}function m0(n,t,e){const s=e.docs.get(t._key),i=new Iu(n);return new h0(n,i,t._key,s,new bi(e.hasPendingWrites,e.fromCache),t.converter)}(function(t,e=!0){(function(i){$s=i})(js),Ts(new Kn("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),a=new Tn(new yx(s.getProvider("auth-internal")),new wx(s.getProvider("app-check-internal")),function(c,d){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new j(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zi(c.options.projectId,d)}(o,i),o);return r=Object.assign({useFetchStreams:e},r),a._setSettings(r),a},"PUBLIC").setMultipleInstances(!0)),_n(Vh,"4.7.3",t),_n(Vh,"4.7.3","esm2017")})();gx("debug");const kf=window.GLOBAL_FIREBASE_CONFIG||{};let dl,Ft,At,Au=!1;if(kf.apiKey)try{dl=dp(kf),Ft=hx(dl),At=ZE(dl),Au=!0,console.log("Firebase initialized successfully.")}catch(n){console.error("Firebase initialization error:",n)}else console.error("Firebase config not found.");function K(n,t){const e=document.getElementById("message-modal");e&&e.remove();const s=`
        <div id="message-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100">
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">確認</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${n}</p>
                </div>
                <div class="flex justify-end space-x-3">
                    <button id="msg-modal-cancel" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        キャンセル
                    </button>
                    <button id="msg-modal-ok" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",s);const i=document.getElementById("message-modal"),r=document.getElementById("msg-modal-ok"),o=document.getElementById("msg-modal-cancel"),a=()=>{i.classList.add("opacity-0"),setTimeout(()=>{i&&i.parentNode&&i.remove()},200)};r.addEventListener("click",()=>{t&&t(),a()}),o.addEventListener("click",a),i.addEventListener("click",l=>{l.target===i&&a()})}async function yI(n,t){if(!Au)throw new Error("Firebase not initialized");return await Xv(Ft,n,t)}async function _I(){Au&&await Fp(Ft)}async function bI(n){const t=Ft.currentUser;if(!t)throw K("エラー","認証されていません。"),new Error("認証されていません。");try{await Jv(t,n),K("成功","パスワードが正常に変更されました。","success")}catch(e){console.error("パスワード変更エラー:",e);let s="パスワードの変更に失敗しました。";throw e.code==="auth/requires-recent-login"&&(s="セキュリティ保護のため、パスワード変更には再ログインが必要です。一度ログアウトし、再度ログインしてから設定画面を開いてください。"),K("エラー",s),e}}function vI(n){const t=document.getElementById("login-form-container"),e=document.getElementById("user-info"),s=document.getElementById("user-display-name"),i=document.getElementById("email-input"),r=document.getElementById("password-input"),o=document.getElementById("logout-btn"),a=document.getElementById("email-login-btn");!t||!e||(n?(t.classList.add("hidden"),e.classList.remove("hidden"),e.classList.add("flex"),s&&(s.textContent=n.email||"ユーザー")):(t.classList.remove("hidden"),e.classList.add("hidden"),e.classList.remove("flex"),s&&(s.textContent=""),i&&(i.value=""),r&&(r.value="")),a&&!a.hasListener&&(a.addEventListener("click",async()=>{try{if(!i.value||!r.value){K("メールアドレスとパスワードを入力してください。",null);return}await yI(i.value,r.value)}catch(l){K("ログインエラー: "+(l.message||"失敗しました"),null)}}),a.hasListener=!0),o&&!o.hasListener&&(o.addEventListener("click",async()=>{await _I()}),o.hasListener=!0))}function wI(){localStorage.theme==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark");const n=localStorage.getItem("fontSize")||"medium";document.body.classList.remove("font-large","font-medium","font-small"),document.body.classList.add(`font-${n}`),requestAnimationFrame(()=>{Su()})}function Su(n=null){const t=document.getElementById("main-content");if(!t)return;const e=n||localStorage.getItem("background")||"none",s=document.documentElement.classList.contains("dark");t.style.backgroundImage="",t.style.backgroundSize="",t.style.backgroundPosition="",t.style.backgroundAttachment="",t.style.backgroundRepeat="",!(!s||e==="none")&&e==="haikei"&&(t.style.backgroundImage="url('/images/haikei_black_1.jpg')",t.style.backgroundSize="cover",t.style.backgroundPosition="center",t.style.backgroundAttachment="fixed",t.style.backgroundRepeat="no-repeat")}let Hr=280;function ec(n,t,e){if(!e)return;let s=!1;if(n){const a=localStorage.getItem("sidebarWidth");Hr=a?parseInt(a,10):280,n.style.width=`${Hr}px`}const i=a=>{s=!0,document.body.style.cursor="col-resize",document.body.classList.add("select-none"),document.addEventListener("mousemove",r),document.addEventListener("mouseup",o),a.preventDefault()},r=a=>{if(!s)return;let l=a.clientX;const c=150,d=500;l<c&&(l=c),l>d&&(l=d),Hr=l,n.style.width=`${l}px`},o=()=>{s=!1,document.body.style.cursor="",document.body.classList.remove("select-none"),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",o),localStorage.setItem("sidebarWidth",Hr)};e.addEventListener("mousedown",i)}const Pu=typeof window<"u"&&window.GLOBAL_APP_ID?window.GLOBAL_APP_ID:typeof __app_id<"u"?__app_id:"default-app-id",Cu=tp(),Ru=g_(),nc="currentWorkspaceId",xI="workspace-changed",Du="workspaces";let Wr=()=>{},sc=[];function Mu(n){const t=Ru.currentUser;if(!t)return console.warn("subscribeToWorkspaces: User not authenticated"),n([]),()=>{};Wr&&Wr();const e=Pn(Cu,"artifacts",Pu,"users",t.uid,Du),s=nr(e,ep("createdAt","asc"));return Wr=ta(s,async i=>{const r=i.docs.map(o=>({id:o.id,...o.data()}));sc=r,r.length===0&&!i.metadata.hasPendingWrites?await kI(n):(EI(r),n(r))},i=>{console.error("Error subscribing to workspaces:",i),n([])}),Wr}async function kI(n){try{const t=Ru.currentUser;if(!t)return;const e=Pn(Cu,"artifacts",Pu,"users",t.uid,Du);if((await m_(nr(e,y_(1)))).empty){console.log("Creating default workspace...");const i=await Lu("メイン");Vs(i.id),sc=[i],n&&n(sc)}}catch(t){console.error("Failed to ensure default workspace:",t)}}function EI(n){const t=ce();if(n.length>0){const e=n.find(s=>s.id===t);(!t||!e)&&(console.log("Current workspace invalid or missing, resetting to default."),Vs(n[0].id))}}function ce(){return localStorage.getItem(nc)}function Vs(n){if(!n||localStorage.getItem(nc)===n)return;localStorage.setItem(nc,n);const e=new CustomEvent(xI,{detail:{workspaceId:n}});document.dispatchEvent(e),console.log(`Workspace changed to: ${n}`)}async function Lu(n){const t=Ru.currentUser;if(!t)throw new Error("User not authenticated");const e=Pn(Cu,"artifacts",Pu,"users",t.uid,Du),s={name:n,createdAt:np()};return{id:(await Sc(e,s)).id,...s}}function II(n,t,e){const s=localStorage.getItem("background")||"none";return`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[85vh]">
            
            <!-- ヘッダー -->
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    設定
                </h3>
                <button id="close-settings-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                
                <!-- 1. 表示設定セクション -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden transition-all" open>
                    <summary class="flex justify-between items-center px-3 py-2.5 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            表示設定
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-3 border-t border-gray-100 dark:border-gray-700 space-y-4">
                        <!-- テーマ設定 -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">テーマ</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="app-theme" value="light" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500">
                                    <div class="ml-2 flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        <span class="text-sm text-gray-900 dark:text-white">ライト</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="app-theme" value="dark" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500">
                                    <div class="ml-2 flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                        <span class="text-sm text-gray-900 dark:text-white">ダーク</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- 文字サイズ設定 -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">文字サイズ</label>
                            <div class="grid grid-cols-3 gap-3">
                                <label class="flex items-center justify-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="font-size" value="large" class="form-radio text-blue-600 w-3.5 h-3.5 focus:ring-blue-500">
                                    <span class="ml-2 text-sm text-gray-900 dark:text-white">大</span>
                                </label>
                                <label class="flex items-center justify-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="font-size" value="medium" class="form-radio text-blue-600 w-3.5 h-3.5 focus:ring-blue-500">
                                    <span class="ml-2 text-sm text-gray-900 dark:text-white">中</span>
                                </label>
                                <label class="flex items-center justify-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="font-size" value="small" class="form-radio text-blue-600 w-3.5 h-3.5 focus:ring-blue-500">
                                    <span class="ml-2 text-sm text-gray-900 dark:text-white">小</span>
                                </label>
                            </div>
                        </div>

                        <!-- ★追加: 背景パターン設定 -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">背景パターン (ダークモードのみ)</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="bg-pattern" value="none" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500" ${s==="none"?"checked":""}>
                                    <div class="ml-2">
                                        <span class="block text-sm text-gray-900 dark:text-white">無地</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="bg-pattern" value="haikei" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500" ${s==="haikei"?"checked":""}>
                                    <div class="ml-2 flex items-center">
                                        <span class="block text-sm text-gray-900 dark:text-white">テクスチャ</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- サイドバー密度 -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">サイドバーの密度</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="sidebar-density" value="normal" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500" ${e?"":"checked"}>
                                    <div class="ml-2">
                                        <span class="block text-sm text-gray-900 dark:text-white">通常</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input type="radio" name="sidebar-density" value="compact" class="form-radio text-blue-600 w-4 h-4 focus:ring-blue-500" ${e?"checked":""}>
                                    <div class="ml-2">
                                        <span class="block text-sm text-gray-900 dark:text-white">コンパクト</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </details>

                <!-- 2. データ管理セクション -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-3 py-2.5 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            データ管理
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    <div class="p-3 border-t border-gray-100 dark:border-gray-700">
                        <button id="export-data-btn-new" class="w-full text-left px-3 py-2.5 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex justify-between items-center group border border-gray-100 dark:border-gray-700">
                            <div>
                                <div class="text-sm font-medium text-gray-800 dark:text-gray-200">バックアップを作成 (JSON)</div>
                                <div class="text-xs text-gray-500 mt-0.5">タスク・プロジェクト等の全データをDL</div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                    </div>
                </details>

                <!-- 3. アカウント設定セクション -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-3 py-2.5 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            アカウント
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-3 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold text-lg shadow-sm">
                                ${n}
                            </div>
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">ログイン中</div>
                                <div class="text-xs text-gray-600 dark:text-gray-300 font-mono">${t}</div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">パスワードの変更</label>
                            <div class="flex gap-2">
                                <input type="password" id="new-password-input-new" placeholder="新パスワード (6文字以上)" class="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                <button id="update-password-btn-new" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap">
                                    変更
                                </button>
                            </div>
                            <p class="text-xs text-gray-500">※ セキュリティのため、再ログインが必要です。</p>
                        </div>

                        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button id="logout-btn-settings" class="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-md border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-2 group text-sm">
                                <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                ログアウト
                            </button>
                        </div>
                    </div>
                </details>

            </div>

            <!-- フッター -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                <button id="close-settings-footer" class="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md font-bold text-xs transition-all shadow-sm">
                    閉じる
                </button>
            </div>
        </div>
    `}function TI(n){if(!n)return"";const t=new Date(n);if(isNaN(t.getTime()))return"";const e=new Date,s=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-s.getTime(),o=Math.ceil(r/(1e3*60*60*24));if(o===0)return"今日";if(o===1)return"明日";if(o===-1)return"昨日";const a=t.getFullYear(),l=(t.getMonth()+1).toString().padStart(2,"0"),c=t.getDate().toString().padStart(2,"0");return a!==e.getFullYear()?`${a}/${l}/${c}`:`${l}/${c}`}function AI(n){if(!n)return"text-gray-500";const t=new Date(n),e=new Date,s=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-s.getTime(),o=Math.ceil(r/(1e3*60*60*24));return o<0?"text-red-500 font-bold":o===0?"text-green-600 dark:text-green-400 font-medium":o===1?"text-orange-500 dark:text-orange-400 font-medium":"text-gray-500 dark:text-gray-400"}function SI(n,t){const e=new Date(n);if(t.type==="daily")return e.setDate(e.getDate()+1),e;if(t.type==="weekly"&&Array.isArray(t.days)&&t.days.length>0){let s=!1,i=1;const r=n.getDay();for(let o=1;o<=7;o++){const a=(r+o)%7;if(t.days.includes(a)){i=o,s=!0;break}}if(s)return e.setDate(e.getDate()+i),e}return t.type==="monthly"?(e.setMonth(e.getMonth()+1),e):null}function Ou(n){const t=new Date;if(t.setHours(0,0,0,0),!n||!n.type||n.type==="daily"||n.type==="monthly")return t;if(n.type==="weekly"&&Array.isArray(n.days)&&n.days.length>0){const e=t.getDay();let s=0;if(n.days.includes(e))s=0;else for(let r=1;r<=6;r++){const o=(e+r)%7;if(n.days.includes(o)){s=r;break}}const i=new Date(t);return i.setDate(t.getDate()+s),i}return t}let hl=null;function y0(n,t){var e,s;return{id:n,...t,createdAt:(e=t.createdAt)!=null&&e.toDate?t.createdAt.toDate():t.createdAt||Date.now(),dueDate:(s=t.dueDate)!=null&&s.toDate?t.dueDate.toDate():t.dueDate||null,recurrence:t.recurrence||null}}function Ef(n,t){if(hl&&hl(),!n){t([]);return}const s=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`,i=u0(ks(At,s));hl=p0(i,r=>{const o=r.docs.map(a=>y0(a.id,a.data()));t(o)})}async function PI(n,t){const e=window.GLOBAL_APP_ID,s=mr(At,`/artifacts/${e}/users/${n}/tasks`,t),i=await gI(s);return i.exists()?y0(i.id,i.data()):null}async function _0(n,t){const s=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`,i={...t};i.dueDate instanceof Date&&(i.dueDate=pt.fromDate(i.dueDate)),await mI(ks(At,s),{...i,ownerId:n,status:"todo",createdAt:pt.fromDate(new Date)})}async function CI(n,t,e){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`;await g0(mr(At,i,t),{status:e})}async function RI(n,t,e){const s=window.GLOBAL_APP_ID,i=mr(At,`/artifacts/${s}/users/${n}/tasks`,t),r={...e};r.dueDate&&!(r.dueDate instanceof pt)&&(r.dueDate instanceof Date?r.dueDate=pt.fromDate(r.dueDate):typeof r.dueDate=="string"||typeof r.dueDate=="number"?r.dueDate=pt.fromDate(new Date(r.dueDate)):r.dueDate===null&&(r.dueDate=null)),r.recurrence===void 0?delete r.recurrence:r.recurrence===null&&(r.recurrence=null),await g0(i,r)}async function DI(n,t){const e=window.GLOBAL_APP_ID,s=mr(At,`/artifacts/${e}/users/${n}/tasks`,t);await pI(s)}async function MI(n){if(!At)throw new Error("Firestore not initialized");const t=window.GLOBAL_APP_ID,e=ks(At,`/artifacts/${t}/users/${n}/tasks`),s=ks(At,`/artifacts/${t}/users/${n}/projects`),i=ks(At,`/artifacts/${t}/users/${n}/labels`),[r,o,a]=await Promise.all([ul(e),ul(s),ul(i)]),l=c=>c.docs.map(d=>{const h=d.data(),g={id:d.id};for(const m in h)h[m]&&h[m].toDate?g[m]=h[m].toDate().toISOString():g[m]=h[m];return g});return{version:"1.0",exportedAt:new Date().toISOString(),userId:n,tasks:l(r),projects:l(o),labels:l(a)}}function qs(){var t;const n=(t=Ft.currentUser)==null?void 0:t.uid;if(!n)throw K("操作にはログインが必要です。",null),new Error("Authentication required.");return n}async function LI(n){if(n.status!=="completed"||!n.recurrence)return;const{recurrence:t,dueDate:e}=n;if(!e||typeof t!="object"||!t.type)return;const s=SI(e,t);if(s){const i={title:n.title,description:n.description||"",status:"todo",dueDate:s,projectId:n.projectId,labelIds:n.labelIds,recurrence:n.recurrence};try{await b0(i),console.log(`Generated next recurring task for: ${n.title}, next due: ${s}`)}catch(r){console.error("Failed to generate next recurring task:",r)}}}function OI(n){var e;const t=(e=Ft.currentUser)==null?void 0:e.uid;Ef(t||null,n)}async function b0(n){const t=qs();return _0(t,n)}async function VI(n,t){const e=qs(),s=await CI(e,n,t);if(t==="completed"){const i=await PI(e,n);i&&LI(i).catch(r=>console.error("Recurring task handler failed:",r))}return s}async function vi(n,t){const e=qs();return RI(e,n,t)}async function v0(n){const t=qs();return DI(t,n)}async function NI(){const n=qs();return MI(n)}async function If(n){const t=qs(),e={title:n.title,description:n.description||"",dueDate:n.dueDate||null,projectId:n.projectId||null,labelIds:Array.isArray(n.labelIds)?n.labelIds:[],recurrence:n.recurrence||null};return _0(t,e)}let _s=[];const FI=typeof window<"u"&&window.GLOBAL_APP_ID?window.GLOBAL_APP_ID:"default-app-id";function ai(){return _s}function BI(){_s=[]}function Vu(n){const t=ce();return t?`/artifacts/${FI}/workspaces/${t}/users/${n}/filters`:null}function w0(n){var r;const t=(r=Ft.currentUser)==null?void 0:r.uid,e=ce();if(!t||!e)return _s=[],n&&n([]),()=>{};const s=Vu(t);if(!s)return _s=[],n&&n([]),()=>{};const i=nr(Pn(At,s));return ta(i,o=>{const a=o.docs.map(l=>({id:l.id,...l.data()}));_s=a,n&&n(a)},o=>{console.error("Error subscribing to filters:",o),_s=[],n&&n([])})}async function Tf(n){var r;const t=(r=Ft.currentUser)==null?void 0:r.uid;if(!t)throw K("ログインが必要です"),new Error("Authentication required");const e=Vu(t);if(!e)throw K("ワークスペースを選択してください"),new Error("Workspace selection required");const{id:s,...i}=n;await Sc(Pn(At,e),{...i,ownerId:t,createdAt:new Date().toISOString()})}async function jI(n){var s;const t=(s=Ft.currentUser)==null?void 0:s.uid;if(!t)return;const e=Vu(t);e&&await Pc(sr(At,e,n))}const Af=async(n,t)=>{const e=JSON.parse(localStorage.getItem("custom_filters")||"[]"),s=e.findIndex(i=>i.id===n);s!==-1?(e[s]=t,localStorage.setItem("custom_filters",JSON.stringify(e))):console.warn(`Filter update failed: ID ${n} not found.`)};function UI(n,t){var e,s;(e=document.getElementById("close-settings-modal"))==null||e.addEventListener("click",t),(s=document.getElementById("close-settings-footer"))==null||s.addEventListener("click",t),n.addEventListener("click",i=>{i.target===n&&t()}),zI(),HI(),$I(),WI(),qI(),GI(),KI(t)}function zI(){const n=localStorage.getItem("theme")==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.querySelectorAll('input[name="app-theme"]').forEach(e=>{e.value===n&&(e.checked=!0),e.addEventListener("change",s=>{s.target.value==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light")),Su()})})}function $I(){document.querySelectorAll('input[name="bg-pattern"]').forEach(t=>{t.addEventListener("change",e=>{const s=e.target.value;localStorage.setItem("background",s),Su()})})}function HI(){const n=localStorage.getItem("fontSize")||"medium";document.querySelectorAll('input[name="font-size"]').forEach(e=>{e.value===n&&(e.checked=!0),e.addEventListener("change",s=>{const i=s.target.value;localStorage.setItem("fontSize",i),document.body.classList.remove("font-large","font-medium","font-small"),document.body.classList.add(`font-${i}`)})})}function WI(){document.querySelectorAll('input[name="sidebar-density"]').forEach(t=>{t.addEventListener("change",e=>{const i=e.target.value==="compact";localStorage.setItem("sidebar_compact",i),window.dispatchEvent(new CustomEvent("sidebar-settings-updated",{detail:{compact:i}}))})})}function qI(){const n=document.getElementById("export-data-btn-new");n&&n.addEventListener("click",async()=>{const t=n.innerHTML;n.disabled=!0,n.innerHTML=`
            <div class="flex items-center justify-center w-full gap-2">
                <svg class="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
                </svg>
                作成中...
            </div>
        `;try{const e=await NI();YI(e,`task_manager_backup_${QI()}.json`),K("バックアップデータをダウンロードしました")}catch(e){console.error("Export Error:",e),K("データのエクスポートに失敗しました","error")}finally{n.disabled=!1,n.innerHTML=t}})}function GI(){const n=document.getElementById("update-password-btn-new"),t=document.getElementById("new-password-input-new");!n||!t||n.addEventListener("click",async()=>{const e=t.value;if(!e||e.length<6){K("パスワードは6文字以上で入力してください","error");return}try{await bI(e),K("パスワードを変更しました"),t.value=""}catch(s){console.error(s),s.code==="auth/requires-recent-login"?K("セキュリティのため、再ログインが必要です。一度ログアウトしてから再度お試しください。","error"):K("変更に失敗しました: "+s.message,"error")}})}function KI(n){const t=document.getElementById("logout-btn-settings");t&&t.addEventListener("click",async()=>{try{await Fp(Ft),n()}catch(e){console.error(e),K("ログアウトに失敗しました","error")}})}function YI(n,t){const e=JSON.stringify(n,null,2),s=new Blob([e],{type:"application/json"}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}function QI(){return new Date().toISOString().replace(/[:.]/g,"-").slice(0,19)}function x0(){document.addEventListener("click",n=>{n.target.closest("#nav-settings")&&(n.preventDefault(),wa())})}function wa(){var r,o;const n="settings-modal-dynamic";(r=document.getElementById(n))==null||r.remove();const t=localStorage.getItem("sidebar_compact")==="true",e=((o=Ft.currentUser)==null?void 0:o.email)||"匿名ユーザー",s=e[0].toUpperCase(),i=document.createElement("div");i.id=n,i.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",i.innerHTML=II(s,e,t),document.body.appendChild(i),UI(i,()=>i.remove())}function XI(){const n=document.getElementById("app");if(!n)return;n.innerHTML=`
        <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            <!-- サイドバー -->
            <aside id="sidebar" class="flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all duration-300 group z-20 fixed md:relative h-full md:translate-x-0 -translate-x-full shadow-xl md:shadow-none" style="width: 280px;">
                <!-- ロゴエリア -->
                <div class="h-12 flex items-center px-4 flex-shrink-0 justify-between">
                    <!-- ロゴ画像＋テキスト -->
                    <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition select-none">
                        <img src="/images/web-app-manifest-512x512.png" alt="TaskMg" class="h-9 w-9 rounded-lg shadow-sm">
                        <span class="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
                            Task<span class="text-blue-600 dark:text-blue-400">Mg</span>
                        </span>
                    </div>
                    <!-- サイドバー閉じるボタン (モバイル/デスクトップ共通) -->
                    <button id="sidebar-close-btn" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800" title="サイドバーを閉じる">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>
                
                <!-- サイドバーコンテンツ -->
                <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
                
                <!-- リサイズハンドル -->
                <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"></div>
            </aside>

            <!-- メインコンテンツラッパー -->
            <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                <!-- ヘッダー (Glassmorphism化) -->
                <header class="h-12 flex items-center justify-between px-4 border-b border-white/20 dark:border-gray-800/50 flex-shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md z-10">
                    <div class="flex items-center min-w-0 flex-1 mr-4">
                        <!-- サイドバーを開くボタン -->
                        <button id="sidebar-open-btn" class="mr-2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" title="サイドバーを開く">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        <!-- ワークスペース切り替えドロップダウン (★追加) -->
                        <div id="workspace-dropdown" class="relative inline-block text-left mr-3 z-20">
                            <button id="workspace-trigger" class="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1 transition-colors focus:outline-none group">
                                <span id="workspace-label" class="text-sm font-bold text-gray-800 dark:text-gray-200 max-w-[140px] truncate">読み込み中...</span>
                                <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <!-- ドロップダウンメニュー -->
                            <div id="workspace-menu" class="absolute left-0 mt-2 w-60 origin-top-left rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible scale-95 transition-all duration-150 transform pointer-events-none border border-gray-100 dark:border-gray-700">
                                <div class="py-1 max-h-[300px] overflow-y-auto custom-scrollbar" id="workspace-list">
                                    <!-- JSでここにリストを注入 -->
                                </div>
                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <div class="py-1">
                                    <button id="add-workspace-btn" class="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                        ワークスペースを追加
                                    </button>
                                    <button id="settings-workspace-btn" class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        設定
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 現在のビュータイトル -->
                        <h2 id="header-title" class="text-base font-medium truncate text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-700 pl-3">インボックス</h2>
                        <span id="header-count" class="ml-2 text-xs text-gray-500 font-normal hidden sm:inline-block"></span>
                    </div>

                    <div class="flex items-center space-x-1 sm:space-x-2">
                        <!-- ソート (カスタムドロップダウン) -->
                        <div id="custom-sort-dropdown" class="relative inline-block text-left z-10">
                            <!-- トリガー -->
                            <button 
                                id="sort-trigger"
                                type="button"
                                class="appearance-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs py-1.5 pl-2 pr-6 rounded cursor-pointer focus:outline-none flex items-center transition-colors">
                                <span id="sort-label">作成日(新しい順)</span>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </button>

                            <!-- ドロップダウンメニュー -->
                            <div 
                                id="sort-menu"
                                class="absolute right-0 mt-2 w-[180px] origin-top-right rounded-lg shadow-lg 
                                       bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
                                       opacity-0 invisible scale-95 transition-all duration-150 ease-out 
                                       pointer-events-none z-50">
                                <div class="py-1">
                                    <button data-value="createdAt_desc"  class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(新しい順)</button>
                                    <button data-value="createdAt_asc"   class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(古い順)</button>
                                    <button data-value="dueDate_asc"     class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">期限日(近い順)</button>
                                    <button data-value="timeBlockId_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">時間帯順</button>
                                    <button data-value="projectId_asc"   class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">プロジェクト名順</button>
                                    <button data-value="title_asc"       class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">タスク名順</button>
                                </div>
                            </div>
                        </div>

                        <!-- 認証UI -->
                        <div id="auth-ui" class="ml-1 flex items-center space-x-2">
                             <div id="login-form-container" class="space-x-2 flex items-center">
                                 <span class="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">未ログイン</span>
                                 <input type="email" id="email-input" placeholder="メール" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                                 <input type="password" id="password-input" placeholder="パスワード" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                                 <button id="email-login-btn" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded shadow-md transition duration-150">ログイン</button>
                             </div>
                             <div id="user-info" class="hidden items-center space-x-2">
                                 <span id="user-display-name" class="hidden text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px]"></span>
                                 <span class="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">ログイン中</span>
                             </div>
                        </div>
                    </div>
                </header>

                <!-- メインコンテンツエリア -->
                <div id="main-content" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
                    <div class="w-full max-w-4xl mx-auto">
                        <div id="task-view" class="w-full animate-fade-in transition-opacity duration-150" style="opacity: 1;"></div>
                        <div id="search-view" class="hidden w-full animate-fade-in"></div>
                        <div id="dashboard-view" class="hidden w-full animate-fade-in"></div>
                        <div id="settings-view" class="hidden w-full animate-fade-in"></div>
                    </div>
                </div>
            </main>
        </div>
        
        <div id="modal-container" class="z-50 relative"></div>
    `;const t=document.getElementById("sidebar"),e=document.querySelector("main"),s=document.getElementById("sidebar-resizer");ec&&ec(t,e,s),JI(),document.addEventListener("keydown",i=>{var r;i.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"&&(i.preventDefault(),(r=document.getElementById("page-search-input"))==null||r.focus())})}function JI(){const n=document.getElementById("workspace-trigger"),t=document.getElementById("workspace-menu"),e=document.getElementById("workspace-label"),s=document.getElementById("workspace-list"),i=document.getElementById("add-workspace-btn"),r=document.getElementById("settings-workspace-btn");if(!n||!t)return;const o=d=>{d&&(t.contains(d.target)||n.contains(d.target))&&!d.target.closest("button.workspace-option")||(t.classList.replace("opacity-100","opacity-0"),t.classList.replace("visible","invisible"),t.classList.replace("scale-100","scale-95"),t.classList.replace("pointer-events-auto","pointer-events-none"),document.removeEventListener("click",o))},a=()=>{t.classList.contains("opacity-100")?o():(t.classList.replace("opacity-0","opacity-100"),t.classList.replace("invisible","visible"),t.classList.replace("scale-95","scale-100"),t.classList.replace("pointer-events-none","pointer-events-auto"),document.addEventListener("click",o))};n.addEventListener("click",d=>{d.stopPropagation(),a()}),Mu(d=>{l(d,s),c(d,e)}),i&&i.addEventListener("click",async()=>{o();const d=window.prompt("新しいワークスペース名を入力してください:");if(d&&d.trim())try{const h=await Lu(d.trim());Vs(h.id)}catch(h){console.error("Failed to add workspace:",h),K("ワークスペースの作成に失敗しました")}}),r&&r.addEventListener("click",()=>{o(),wa()});function l(d,h){if(!h)return;h.innerHTML="";const g=ce();d.forEach(m=>{const y=m.id===g,_=document.createElement("button");_.className=`workspace-option w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${y?"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium":"text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`,_.innerHTML=`
                <span class="truncate">${m.name}</span>
                ${y?'<svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>':""}
            `,_.addEventListener("click",()=>{y||Vs(m.id),o()}),h.appendChild(_)})}function c(d,h){if(!h)return;const g=ce(),m=d.find(y=>y.id===g);m?h.textContent=m.name:h.textContent="ワークスペース"}}function Sf(n){if(!n)return"";const t=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0");return`${t}-${e}-${s}`}const ZI=tp(),tT=typeof window<"u"&&window.GLOBAL_APP_ID?window.GLOBAL_APP_ID:"default-app-id";let un=[],ds=null;const eT=[{id:"tb_morning",name:"06:00 - 09:00",start:"06:00",end:"09:00",color:"#EF4444",order:0},{id:"tb_afternoon",name:"13:00 - 17:00",start:"13:00",end:"17:00",color:"#3B82F6",order:1},{id:"tb_night",name:"20:00 - 22:00",start:"20:00",end:"22:00",color:"#8B5CF6",order:2}];function nT(){var n;return(n=Ft.currentUser)==null?void 0:n.uid}function Nu(){const n=nT(),t=ce();return!n||!t?null:Pn(ZI,"artifacts",tT,"workspaces",t,"users",n,"timeblocks")}function sT(){un=[]}function k0(n){ds&&ds();const t=Nu();if(!t)return un=[...eT],n&&n(un),()=>{};const e=nr(t,ep("order","asc"));return ds=ta(e,s=>{un=s.docs.map(r=>({id:r.id,...r.data()})),n&&n(un)},s=>{console.error("Timeblocks subscription error:",s)}),()=>{ds&&(ds(),ds=null)}}function is(){return[...un].sort((n,t)=>n.order-t.order)}function iT(n){return un.find(t=>t.id===n)}async function rT(n){const t=Nu();if(!t)throw K("ワークスペースを選択してください"),new Error("ログインまたはワークスペース選択が必要です");const e=n.id||crypto.randomUUID();let s=n.order;s===void 0&&(s=un.length);const i={name:n.name,start:n.start,end:n.end,color:n.color,order:s,updatedAt:np()};return await __(sr(t,e),i,{merge:!0}),!0}async function oT(n){const t=Nu();if(!t)throw K("ワークスペースを選択してください"),new Error("ログインまたはワークスペース選択が必要です");return await Pc(sr(t,n)),!0}function aT(n=[]){return["日","月","火","水","木","金","土"].map((e,s)=>`
        <label class="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" data-day-index="${s}" ${n.includes(s)?"checked":""} 
                    class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded">
            <span class="text-xs text-gray-700 dark:text-gray-300">${e}</span>
        </label>
    `).join("")}function lT(n){var _,w;let t=n.dueDate;const e=((_=n.recurrence)==null?void 0:_.type)||"none",s=((w=n.recurrence)==null?void 0:w.days)||[];e!=="none"&&!t&&(t=Ou({type:e,days:e==="weekly"?s:[]}));const i=t&&t.toDate?Sf(t.toDate()):t?Sf(new Date(t)):"",r=aT(s),o=is(),a=n.timeBlockId||"",l=o.map(A=>`<option value="${A.id}" ${A.id===a?"selected":""}>
            ${A.start} - ${A.end}
        </option>`).join(""),c=n.duration||"",h=[30,45,60,75,90].map(A=>`<option value="${A}" ${A==c?"selected":""}>
            ${A} min
        </option>`).join(""),m=i||e!=="none"||a||c?"":"open",y=n.description||"";return`
        <!-- ★修正: animate-fade-in と backdrop-blur-sm を削除し、瞬時に表示する -->
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]" role="dialog" aria-modal="true">
                
                <!-- ヘッダー -->
                <!-- ★修正: ヘッダーから「タスク詳細」のタイトルを削除し、タイトル入力欄をヘッダー直下に移動させるため、ヘッダーにタスク入力欄のスタイルを適用する -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <!-- タスクタイトル入力欄をヘッダーのように配置 -->
                    <input type="text" id="modal-task-title" value="${n.title}" placeholder="タスクのタイトル"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600">
                    
                    <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition ml-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- ボディ -->
                <!-- ★修正: Tailwindの警告を避けるため、flex-1を使用する際は明示的に'min-h-0'を追加する。 -->
                <div class="px-6 py-4 space-y-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col min-h-0">
                    <!-- タイトル入力欄はヘッダーに移動したため削除 -->
                    
                    <!-- メタ情報 (アコーディオン) -->
                    <!-- ★修正: overflow-hidden を削除し、開閉アニメーションを有効にする -->
                    <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30 transition-all" ${m}>
                        <summary class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors select-none list-none outline-none">
                            <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                スケジュール設定
                            </span>
                            <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </span>
                        </summary>
                        
                        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30">
                            <div class="grid grid-cols-2 gap-4">
                                <!-- 期限日 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">期限日</label>
                                    <input type="date" id="modal-task-date" value="${i}"
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm">
                                </div>
                                <!-- 繰り返し -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">繰り返し</label>
                                    <select id="modal-task-recurrence" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="none" ${e==="none"?"selected":""}>繰り返しなし</option>
                                        <option value="daily" ${e==="daily"?"selected":""}>毎日</option>
                                        <option value="weekly" ${e==="weekly"?"selected":""}>毎週</option>
                                        <option value="monthly" ${e==="monthly"?"selected":""}>毎月</option>
                                    </select>
                                </div>
                                
                                <!-- 時間帯 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">時間帯</label>
                                    <select id="modal-task-timeblock" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="">未定</option>
                                        ${l}
                                    </select>
                                </div>

                                <!-- 所要時間 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">所要時間</label>
                                    <select id="modal-task-duration" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="">指定なし</option>
                                        ${h}
                                    </select>
                                </div>
                            </div>
                            
                            <!-- 曜日選択 (weekly選択時のみ表示) -->
                            <div id="recurrence-days-container" class="${e!=="weekly"?"hidden":""} pt-2 mt-4 border-t border-gray-100 dark:border-gray-700">
                                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">繰り返す曜日</label>
                                <div id="recurrence-days-checkboxes" class="flex flex-wrap gap-x-4 gap-y-2">
                                    ${r}
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- メモ (Markdown対応) -->
                    <div>
                        <!-- ★修正: 'block' と 'flex' の競合を解消するため、blockを削除 -->
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                            <span>メモ (Markdown対応)</span>
                            <button id="toggle-memo-view" class="text-xs text-blue-500 hover:text-blue-400 font-normal underline">プレビュー</button>
                        </label>
                        
                        <!-- 入力エリア -->
                        <textarea id="modal-task-desc" rows="5" placeholder="詳細を入力... (箇条書きは*, ハイパーリンクは[テキスト](URL)で)"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 dark:text-gray-300 text-sm transition-all resize-none leading-relaxed">${y}</textarea>
                        
                        <!-- プレビューエリア (最初は非表示) -->
                        <div id="modal-task-desc-preview" class="hidden w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-all markdown-output">
                            <!-- JSによってMarkdownがレンダリングされる -->
                        </div>
                    </div>

                    <!-- ラベル関連のコードを削除したため、この位置にあった空のコメントやDOM要素は完全に除去する -->
                    
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <!-- ★修正: 削除ボタンを薄い赤（グレーベースでホバー時に赤）に変更 -->
                    <button id="delete-task-modal-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center transition px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group">
                        <svg class="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        削除
                    </button>
                    <div class="flex space-x-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                        <button id="save-task-modal-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `}function cT(n){if(!n)return"";let t=n;t=t.replace(/\[(.*?)\]\((.*?)\)/g,(r,o,a)=>`<a href="${a.replace(/"/g,"&quot;")}" target="_blank" class="text-blue-400 hover:text-blue-300 underline">${o}</a>`);const e=t.split(`
`);let s=!1,i=[];return e.forEach(r=>{const o=r.trimStart();if(o.startsWith("* ")||o.startsWith("- ")){s||(i.push('<ul class="list-disc ml-5 space-y-1">'),s=!0);const l=o.substring(2).trim();i.push(`<li>${l}</li>`)}else s&&(i.push("</ul>"),s=!1),r.trim().length>0?i.push(`<p class="mb-2">${r.replace(/\n/g,"<br>")}</p>`):i.push("")}),s&&i.push("</ul>"),t=i.filter(r=>r.trim().length>0||r.startsWith("<")).join(`
`),t}function uT(n,t,e){var s,i,r,o,a;(s=n.querySelector("#close-modal-btn"))==null||s.addEventListener("click",e),(i=n.querySelector("#cancel-modal-btn"))==null||i.addEventListener("click",e),(r=n.querySelector("div.fixed"))==null||r.addEventListener("click",l=>{l.target===l.currentTarget&&e()}),(o=n.querySelector("#save-task-modal-btn"))==null||o.addEventListener("click",async()=>{await hT(t,e)}),(a=n.querySelector("#delete-task-modal-btn"))==null||a.addEventListener("click",()=>{K("本当に削除しますか？",async()=>{await v0(t.id),e()})}),fT(),dT()}function dT(){const n=document.getElementById("modal-task-desc"),t=document.getElementById("modal-task-desc-preview"),e=document.getElementById("toggle-memo-view");if(!n||!t||!e)return;let s=!0;const i=()=>{const o=n.value;t.innerHTML=cT(o)},r=()=>{s=!s,s?(n.classList.remove("hidden"),t.classList.add("hidden"),e.textContent="プレビュー"):(i(),n.classList.add("hidden"),t.classList.remove("hidden"),e.textContent="編集")};e.addEventListener("click",r),n.addEventListener("input",i),i(),n.classList.remove("hidden"),t.classList.add("hidden"),e.textContent="プレビュー"}async function hT(n,t){const e=document.getElementById("modal-task-title").value.trim(),s=document.getElementById("modal-task-desc").value.trim(),i=document.getElementById("modal-task-date").value,r=document.getElementById("modal-task-recurrence").value,o=document.getElementById("modal-task-timeblock").value,a=document.getElementById("modal-task-duration").value;if(!e){K("タイトルを入力してください",null);return}let l=null;if(r!=="none")if(r==="weekly"){const d=Array.from(document.querySelectorAll('#recurrence-days-checkboxes input[type="checkbox"]:checked')).map(h=>parseInt(h.dataset.dayIndex,10)).sort((h,g)=>h-g);if(d.length===0){K("毎週繰り返す設定の場合、少なくとも一つ曜日を選択してください。",null);return}l={type:r,days:d}}else l={type:r};const c={title:e,description:s,dueDate:i?new Date(i):null,recurrence:l,timeBlockId:o||null,duration:a?parseInt(a,10):null};await vi(n.id,c),t()}function fT(){const n=document.getElementById("modal-task-recurrence"),t=document.getElementById("recurrence-days-container"),e=document.getElementById("modal-task-date");if(!n||!t||!e)return;const s=i=>{const r=i.target.value,o=r==="weekly";if(o?t.classList.remove("hidden"):t.classList.add("hidden"),r!=="none"){const a={type:r};if(o){Pf(e,t);const c=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(d=>parseInt(d.dataset.dayIndex,10));a.days=c}const l=Ou(a);e.value=l.toISOString().substring(0,10)}};n.addEventListener("change",s),n.value==="weekly"&&(t.classList.remove("hidden"),Pf(e,t))}function Pf(n,t){t.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.removeEventListener("change",s),i.addEventListener("change",s)});function s(){const i=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(r=>parseInt(r.dataset.dayIndex,10));if(i.length>0){const o=Ou({type:"weekly",days:i});n.value=o.toISOString().substring(0,10)}}}function gT(n,t){const s=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/labels`,i=u0(ks(At,s));return p0(i,r=>{const o=r.docs.map(a=>({id:a.id,...a.data()}));t(o)})}function pT(n){var e;const t=(e=Ft.currentUser)==null?void 0:e.uid;t&&gT(t,n)}function mT(){document.addEventListener("keydown",n=>{const t=document.getElementById("modal-container");n.key==="Escape"&&t&&t.children.length>0&&E0()})}function yT(n){let t=document.getElementById("modal-container");t||(t=document.createElement("div"),t.id="modal-container",document.body.appendChild(t)),t.innerHTML=lT(n),uT(t,n,E0)}function E0(){const n=document.getElementById("modal-container");n&&(n.innerHTML="")}/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */function _r(n){return n+.5|0}const dn=(n,t,e)=>Math.max(Math.min(n,e),t);function wi(n){return dn(_r(n*2.55),0,255)}function wn(n){return dn(_r(n*255),0,255)}function Ne(n){return dn(_r(n/2.55)/100,0,1)}function Cf(n){return dn(_r(n*100),0,100)}const oe={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},ic=[..."0123456789ABCDEF"],_T=n=>ic[n&15],bT=n=>ic[(n&240)>>4]+ic[n&15],qr=n=>(n&240)>>4===(n&15),vT=n=>qr(n.r)&&qr(n.g)&&qr(n.b)&&qr(n.a);function wT(n){var t=n.length,e;return n[0]==="#"&&(t===4||t===5?e={r:255&oe[n[1]]*17,g:255&oe[n[2]]*17,b:255&oe[n[3]]*17,a:t===5?oe[n[4]]*17:255}:(t===7||t===9)&&(e={r:oe[n[1]]<<4|oe[n[2]],g:oe[n[3]]<<4|oe[n[4]],b:oe[n[5]]<<4|oe[n[6]],a:t===9?oe[n[7]]<<4|oe[n[8]]:255})),e}const xT=(n,t)=>n<255?t(n):"";function kT(n){var t=vT(n)?_T:bT;return n?"#"+t(n.r)+t(n.g)+t(n.b)+xT(n.a,t):void 0}const ET=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function I0(n,t,e){const s=t*Math.min(e,1-e),i=(r,o=(r+n/30)%12)=>e-s*Math.max(Math.min(o-3,9-o,1),-1);return[i(0),i(8),i(4)]}function IT(n,t,e){const s=(i,r=(i+n/60)%6)=>e-e*t*Math.max(Math.min(r,4-r,1),0);return[s(5),s(3),s(1)]}function TT(n,t,e){const s=I0(n,1,.5);let i;for(t+e>1&&(i=1/(t+e),t*=i,e*=i),i=0;i<3;i++)s[i]*=1-t-e,s[i]+=t;return s}function AT(n,t,e,s,i){return n===i?(t-e)/s+(t<e?6:0):t===i?(e-n)/s+2:(n-t)/s+4}function Fu(n){const e=n.r/255,s=n.g/255,i=n.b/255,r=Math.max(e,s,i),o=Math.min(e,s,i),a=(r+o)/2;let l,c,d;return r!==o&&(d=r-o,c=a>.5?d/(2-r-o):d/(r+o),l=AT(e,s,i,d,r),l=l*60+.5),[l|0,c||0,a]}function Bu(n,t,e,s){return(Array.isArray(t)?n(t[0],t[1],t[2]):n(t,e,s)).map(wn)}function ju(n,t,e){return Bu(I0,n,t,e)}function ST(n,t,e){return Bu(TT,n,t,e)}function PT(n,t,e){return Bu(IT,n,t,e)}function T0(n){return(n%360+360)%360}function CT(n){const t=ET.exec(n);let e=255,s;if(!t)return;t[5]!==s&&(e=t[6]?wi(+t[5]):wn(+t[5]));const i=T0(+t[2]),r=+t[3]/100,o=+t[4]/100;return t[1]==="hwb"?s=ST(i,r,o):t[1]==="hsv"?s=PT(i,r,o):s=ju(i,r,o),{r:s[0],g:s[1],b:s[2],a:e}}function RT(n,t){var e=Fu(n);e[0]=T0(e[0]+t),e=ju(e),n.r=e[0],n.g=e[1],n.b=e[2]}function DT(n){if(!n)return;const t=Fu(n),e=t[0],s=Cf(t[1]),i=Cf(t[2]);return n.a<255?`hsla(${e}, ${s}%, ${i}%, ${Ne(n.a)})`:`hsl(${e}, ${s}%, ${i}%)`}const Rf={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Df={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};function MT(){const n={},t=Object.keys(Df),e=Object.keys(Rf);let s,i,r,o,a;for(s=0;s<t.length;s++){for(o=a=t[s],i=0;i<e.length;i++)r=e[i],a=a.replace(r,Rf[r]);r=parseInt(Df[o],16),n[a]=[r>>16&255,r>>8&255,r&255]}return n}let Gr;function LT(n){Gr||(Gr=MT(),Gr.transparent=[0,0,0,0]);const t=Gr[n.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:t.length===4?t[3]:255}}const OT=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;function VT(n){const t=OT.exec(n);let e=255,s,i,r;if(t){if(t[7]!==s){const o=+t[7];e=t[8]?wi(o):dn(o*255,0,255)}return s=+t[1],i=+t[3],r=+t[5],s=255&(t[2]?wi(s):dn(s,0,255)),i=255&(t[4]?wi(i):dn(i,0,255)),r=255&(t[6]?wi(r):dn(r,0,255)),{r:s,g:i,b:r,a:e}}}function NT(n){return n&&(n.a<255?`rgba(${n.r}, ${n.g}, ${n.b}, ${Ne(n.a)})`:`rgb(${n.r}, ${n.g}, ${n.b})`)}const fl=n=>n<=.0031308?n*12.92:Math.pow(n,1/2.4)*1.055-.055,hs=n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4);function FT(n,t,e){const s=hs(Ne(n.r)),i=hs(Ne(n.g)),r=hs(Ne(n.b));return{r:wn(fl(s+e*(hs(Ne(t.r))-s))),g:wn(fl(i+e*(hs(Ne(t.g))-i))),b:wn(fl(r+e*(hs(Ne(t.b))-r))),a:n.a+e*(t.a-n.a)}}function Kr(n,t,e){if(n){let s=Fu(n);s[t]=Math.max(0,Math.min(s[t]+s[t]*e,t===0?360:1)),s=ju(s),n.r=s[0],n.g=s[1],n.b=s[2]}}function A0(n,t){return n&&Object.assign(t||{},n)}function Mf(n){var t={r:0,g:0,b:0,a:255};return Array.isArray(n)?n.length>=3&&(t={r:n[0],g:n[1],b:n[2],a:255},n.length>3&&(t.a=wn(n[3]))):(t=A0(n,{r:0,g:0,b:0,a:1}),t.a=wn(t.a)),t}function BT(n){return n.charAt(0)==="r"?VT(n):CT(n)}class qi{constructor(t){if(t instanceof qi)return t;const e=typeof t;let s;e==="object"?s=Mf(t):e==="string"&&(s=wT(t)||LT(t)||BT(t)),this._rgb=s,this._valid=!!s}get valid(){return this._valid}get rgb(){var t=A0(this._rgb);return t&&(t.a=Ne(t.a)),t}set rgb(t){this._rgb=Mf(t)}rgbString(){return this._valid?NT(this._rgb):void 0}hexString(){return this._valid?kT(this._rgb):void 0}hslString(){return this._valid?DT(this._rgb):void 0}mix(t,e){if(t){const s=this.rgb,i=t.rgb;let r;const o=e===r?.5:e,a=2*o-1,l=s.a-i.a,c=((a*l===-1?a:(a+l)/(1+a*l))+1)/2;r=1-c,s.r=255&c*s.r+r*i.r+.5,s.g=255&c*s.g+r*i.g+.5,s.b=255&c*s.b+r*i.b+.5,s.a=o*s.a+(1-o)*i.a,this.rgb=s}return this}interpolate(t,e){return t&&(this._rgb=FT(this._rgb,t._rgb,e)),this}clone(){return new qi(this.rgb)}alpha(t){return this._rgb.a=wn(t),this}clearer(t){const e=this._rgb;return e.a*=1-t,this}greyscale(){const t=this._rgb,e=_r(t.r*.3+t.g*.59+t.b*.11);return t.r=t.g=t.b=e,this}opaquer(t){const e=this._rgb;return e.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Kr(this._rgb,2,t),this}darken(t){return Kr(this._rgb,2,-t),this}saturate(t){return Kr(this._rgb,1,t),this}desaturate(t){return Kr(this._rgb,1,-t),this}rotate(t){return RT(this._rgb,t),this}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */function Le(){}const jT=(()=>{let n=0;return()=>n++})();function Y(n){return n==null}function ft(n){if(Array.isArray&&Array.isArray(n))return!0;const t=Object.prototype.toString.call(n);return t.slice(0,7)==="[object"&&t.slice(-6)==="Array]"}function X(n){return n!==null&&Object.prototype.toString.call(n)==="[object Object]"}function wt(n){return(typeof n=="number"||n instanceof Number)&&isFinite(+n)}function ie(n,t){return wt(n)?n:t}function q(n,t){return typeof n>"u"?t:n}const UT=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100:+n/t,S0=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100*t:+n;function ct(n,t,e){if(n&&typeof n.call=="function")return n.apply(e,t)}function it(n,t,e,s){let i,r,o;if(ft(n))for(r=n.length,i=0;i<r;i++)t.call(e,n[i],i);else if(X(n))for(o=Object.keys(n),r=o.length,i=0;i<r;i++)t.call(e,n[o[i]],o[i])}function Wo(n,t){let e,s,i,r;if(!n||!t||n.length!==t.length)return!1;for(e=0,s=n.length;e<s;++e)if(i=n[e],r=t[e],i.datasetIndex!==r.datasetIndex||i.index!==r.index)return!1;return!0}function qo(n){if(ft(n))return n.map(qo);if(X(n)){const t=Object.create(null),e=Object.keys(n),s=e.length;let i=0;for(;i<s;++i)t[e[i]]=qo(n[e[i]]);return t}return n}function P0(n){return["__proto__","prototype","constructor"].indexOf(n)===-1}function zT(n,t,e,s){if(!P0(n))return;const i=t[n],r=e[n];X(i)&&X(r)?Gi(i,r,s):t[n]=qo(r)}function Gi(n,t,e){const s=ft(t)?t:[t],i=s.length;if(!X(n))return n;e=e||{};const r=e.merger||zT;let o;for(let a=0;a<i;++a){if(o=s[a],!X(o))continue;const l=Object.keys(o);for(let c=0,d=l.length;c<d;++c)r(l[c],n,o,e)}return n}function Di(n,t){return Gi(n,t,{merger:$T})}function $T(n,t,e){if(!P0(n))return;const s=t[n],i=e[n];X(s)&&X(i)?Di(s,i):Object.prototype.hasOwnProperty.call(t,n)||(t[n]=qo(i))}const Lf={"":n=>n,x:n=>n.x,y:n=>n.y};function HT(n){const t=n.split("."),e=[];let s="";for(const i of t)s+=i,s.endsWith("\\")?s=s.slice(0,-1)+".":(e.push(s),s="");return e}function WT(n){const t=HT(n);return e=>{for(const s of t){if(s==="")break;e=e&&e[s]}return e}}function An(n,t){return(Lf[t]||(Lf[t]=WT(t)))(n)}function Uu(n){return n.charAt(0).toUpperCase()+n.slice(1)}const Ki=n=>typeof n<"u",Sn=n=>typeof n=="function",Of=(n,t)=>{if(n.size!==t.size)return!1;for(const e of n)if(!t.has(e))return!1;return!0};function qT(n){return n.type==="mouseup"||n.type==="click"||n.type==="contextmenu"}const st=Math.PI,ht=2*st,GT=ht+st,Go=Number.POSITIVE_INFINITY,KT=st/180,kt=st/2,Vn=st/4,Vf=st*2/3,hn=Math.log10,Ae=Math.sign;function Mi(n,t,e){return Math.abs(n-t)<e}function Nf(n){const t=Math.round(n);n=Mi(n,t,n/1e3)?t:n;const e=Math.pow(10,Math.floor(hn(n))),s=n/e;return(s<=1?1:s<=2?2:s<=5?5:10)*e}function YT(n){const t=[],e=Math.sqrt(n);let s;for(s=1;s<e;s++)n%s===0&&(t.push(s),t.push(n/s));return e===(e|0)&&t.push(e),t.sort((i,r)=>i-r).pop(),t}function QT(n){return typeof n=="symbol"||typeof n=="object"&&n!==null&&!(Symbol.toPrimitive in n||"toString"in n||"valueOf"in n)}function Ns(n){return!QT(n)&&!isNaN(parseFloat(n))&&isFinite(n)}function XT(n,t){const e=Math.round(n);return e-t<=n&&e+t>=n}function C0(n,t,e){let s,i,r;for(s=0,i=n.length;s<i;s++)r=n[s][e],isNaN(r)||(t.min=Math.min(t.min,r),t.max=Math.max(t.max,r))}function ge(n){return n*(st/180)}function zu(n){return n*(180/st)}function Ff(n){if(!wt(n))return;let t=1,e=0;for(;Math.round(n*t)/t!==n;)t*=10,e++;return e}function R0(n,t){const e=t.x-n.x,s=t.y-n.y,i=Math.sqrt(e*e+s*s);let r=Math.atan2(s,e);return r<-.5*st&&(r+=ht),{angle:r,distance:i}}function rc(n,t){return Math.sqrt(Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2))}function JT(n,t){return(n-t+GT)%ht-st}function Wt(n){return(n%ht+ht)%ht}function Yi(n,t,e,s){const i=Wt(n),r=Wt(t),o=Wt(e),a=Wt(r-i),l=Wt(o-i),c=Wt(i-r),d=Wt(i-o);return i===r||i===o||s&&r===o||a>l&&c<d}function Rt(n,t,e){return Math.max(t,Math.min(e,n))}function ZT(n){return Rt(n,-32768,32767)}function $e(n,t,e,s=1e-6){return n>=Math.min(t,e)-s&&n<=Math.max(t,e)+s}function $u(n,t,e){e=e||(o=>n[o]<t);let s=n.length-1,i=0,r;for(;s-i>1;)r=i+s>>1,e(r)?i=r:s=r;return{lo:i,hi:s}}const He=(n,t,e,s)=>$u(n,e,s?i=>{const r=n[i][t];return r<e||r===e&&n[i+1][t]===e}:i=>n[i][t]<e),tA=(n,t,e)=>$u(n,e,s=>n[s][t]>=e);function eA(n,t,e){let s=0,i=n.length;for(;s<i&&n[s]<t;)s++;for(;i>s&&n[i-1]>e;)i--;return s>0||i<n.length?n.slice(s,i):n}const D0=["push","pop","shift","splice","unshift"];function nA(n,t){if(n._chartjs){n._chartjs.listeners.push(t);return}Object.defineProperty(n,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),D0.forEach(e=>{const s="_onData"+Uu(e),i=n[e];Object.defineProperty(n,e,{configurable:!0,enumerable:!1,value(...r){const o=i.apply(this,r);return n._chartjs.listeners.forEach(a=>{typeof a[s]=="function"&&a[s](...r)}),o}})})}function Bf(n,t){const e=n._chartjs;if(!e)return;const s=e.listeners,i=s.indexOf(t);i!==-1&&s.splice(i,1),!(s.length>0)&&(D0.forEach(r=>{delete n[r]}),delete n._chartjs)}function M0(n){const t=new Set(n);return t.size===n.length?n:Array.from(t)}const L0=function(){return typeof window>"u"?function(n){return n()}:window.requestAnimationFrame}();function O0(n,t){let e=[],s=!1;return function(...i){e=i,s||(s=!0,L0.call(window,()=>{s=!1,n.apply(t,e)}))}}function sA(n,t){let e;return function(...s){return t?(clearTimeout(e),e=setTimeout(n,t,s)):n.apply(this,s),t}}const Hu=n=>n==="start"?"left":n==="end"?"right":"center",$t=(n,t,e)=>n==="start"?t:n==="end"?e:(t+e)/2,iA=(n,t,e,s)=>n===(s?"left":"right")?e:n==="center"?(t+e)/2:t;function V0(n,t,e){const s=t.length;let i=0,r=s;if(n._sorted){const{iScale:o,vScale:a,_parsed:l}=n,c=n.dataset&&n.dataset.options?n.dataset.options.spanGaps:null,d=o.axis,{min:h,max:g,minDefined:m,maxDefined:y}=o.getUserBounds();if(m){if(i=Math.min(He(l,d,h).lo,e?s:He(t,d,o.getPixelForValue(h)).lo),c){const _=l.slice(0,i+1).reverse().findIndex(w=>!Y(w[a.axis]));i-=Math.max(0,_)}i=Rt(i,0,s-1)}if(y){let _=Math.max(He(l,o.axis,g,!0).hi+1,e?0:He(t,d,o.getPixelForValue(g),!0).hi+1);if(c){const w=l.slice(_-1).findIndex(A=>!Y(A[a.axis]));_+=Math.max(0,w)}r=Rt(_,i,s)-i}else r=s-i}return{start:i,count:r}}function N0(n){const{xScale:t,yScale:e,_scaleRanges:s}=n,i={xmin:t.min,xmax:t.max,ymin:e.min,ymax:e.max};if(!s)return n._scaleRanges=i,!0;const r=s.xmin!==t.min||s.xmax!==t.max||s.ymin!==e.min||s.ymax!==e.max;return Object.assign(s,i),r}const Yr=n=>n===0||n===1,jf=(n,t,e)=>-(Math.pow(2,10*(n-=1))*Math.sin((n-t)*ht/e)),Uf=(n,t,e)=>Math.pow(2,-10*n)*Math.sin((n-t)*ht/e)+1,Li={linear:n=>n,easeInQuad:n=>n*n,easeOutQuad:n=>-n*(n-2),easeInOutQuad:n=>(n/=.5)<1?.5*n*n:-.5*(--n*(n-2)-1),easeInCubic:n=>n*n*n,easeOutCubic:n=>(n-=1)*n*n+1,easeInOutCubic:n=>(n/=.5)<1?.5*n*n*n:.5*((n-=2)*n*n+2),easeInQuart:n=>n*n*n*n,easeOutQuart:n=>-((n-=1)*n*n*n-1),easeInOutQuart:n=>(n/=.5)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2),easeInQuint:n=>n*n*n*n*n,easeOutQuint:n=>(n-=1)*n*n*n*n+1,easeInOutQuint:n=>(n/=.5)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2),easeInSine:n=>-Math.cos(n*kt)+1,easeOutSine:n=>Math.sin(n*kt),easeInOutSine:n=>-.5*(Math.cos(st*n)-1),easeInExpo:n=>n===0?0:Math.pow(2,10*(n-1)),easeOutExpo:n=>n===1?1:-Math.pow(2,-10*n)+1,easeInOutExpo:n=>Yr(n)?n:n<.5?.5*Math.pow(2,10*(n*2-1)):.5*(-Math.pow(2,-10*(n*2-1))+2),easeInCirc:n=>n>=1?n:-(Math.sqrt(1-n*n)-1),easeOutCirc:n=>Math.sqrt(1-(n-=1)*n),easeInOutCirc:n=>(n/=.5)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1),easeInElastic:n=>Yr(n)?n:jf(n,.075,.3),easeOutElastic:n=>Yr(n)?n:Uf(n,.075,.3),easeInOutElastic(n){return Yr(n)?n:n<.5?.5*jf(n*2,.1125,.45):.5+.5*Uf(n*2-1,.1125,.45)},easeInBack(n){return n*n*((1.70158+1)*n-1.70158)},easeOutBack(n){return(n-=1)*n*((1.70158+1)*n+1.70158)+1},easeInOutBack(n){let t=1.70158;return(n/=.5)<1?.5*(n*n*(((t*=1.525)+1)*n-t)):.5*((n-=2)*n*(((t*=1.525)+1)*n+t)+2)},easeInBounce:n=>1-Li.easeOutBounce(1-n),easeOutBounce(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},easeInOutBounce:n=>n<.5?Li.easeInBounce(n*2)*.5:Li.easeOutBounce(n*2-1)*.5+.5};function Wu(n){if(n&&typeof n=="object"){const t=n.toString();return t==="[object CanvasPattern]"||t==="[object CanvasGradient]"}return!1}function zf(n){return Wu(n)?n:new qi(n)}function gl(n){return Wu(n)?n:new qi(n).saturate(.5).darken(.1).hexString()}const rA=["x","y","borderWidth","radius","tension"],oA=["color","borderColor","backgroundColor"];function aA(n){n.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),n.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>t!=="onProgress"&&t!=="onComplete"&&t!=="fn"}),n.set("animations",{colors:{type:"color",properties:oA},numbers:{type:"number",properties:rA}}),n.describe("animations",{_fallback:"animation"}),n.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>t|0}}}})}function lA(n){n.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})}const $f=new Map;function cA(n,t){t=t||{};const e=n+JSON.stringify(t);let s=$f.get(e);return s||(s=new Intl.NumberFormat(n,t),$f.set(e,s)),s}function br(n,t,e){return cA(t,e).format(n)}const F0={values(n){return ft(n)?n:""+n},numeric(n,t,e){if(n===0)return"0";const s=this.chart.options.locale;let i,r=n;if(e.length>1){const c=Math.max(Math.abs(e[0].value),Math.abs(e[e.length-1].value));(c<1e-4||c>1e15)&&(i="scientific"),r=uA(n,e)}const o=hn(Math.abs(r)),a=isNaN(o)?1:Math.max(Math.min(-1*Math.floor(o),20),0),l={notation:i,minimumFractionDigits:a,maximumFractionDigits:a};return Object.assign(l,this.options.ticks.format),br(n,s,l)},logarithmic(n,t,e){if(n===0)return"0";const s=e[t].significand||n/Math.pow(10,Math.floor(hn(n)));return[1,2,3,5,10,15].includes(s)||t>.8*e.length?F0.numeric.call(this,n,t,e):""}};function uA(n,t){let e=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;return Math.abs(e)>=1&&n!==Math.floor(n)&&(e=n-Math.floor(n)),e}var xa={formatters:F0};function dA(n){n.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:xa.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),n.route("scale.ticks","color","","color"),n.route("scale.grid","color","","borderColor"),n.route("scale.border","color","","borderColor"),n.route("scale.title","color","","color"),n.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&t!=="callback"&&t!=="parser",_indexable:t=>t!=="borderDash"&&t!=="tickBorderDash"&&t!=="dash"}),n.describe("scales",{_fallback:"scale"}),n.describe("scale.ticks",{_scriptable:t=>t!=="backdropPadding"&&t!=="callback",_indexable:t=>t!=="backdropPadding"})}const Jn=Object.create(null),oc=Object.create(null);function Oi(n,t){if(!t)return n;const e=t.split(".");for(let s=0,i=e.length;s<i;++s){const r=e[s];n=n[r]||(n[r]=Object.create(null))}return n}function pl(n,t,e){return typeof t=="string"?Gi(Oi(n,t),e):Gi(Oi(n,""),t)}class hA{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=s=>s.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(s,i)=>gl(i.backgroundColor),this.hoverBorderColor=(s,i)=>gl(i.borderColor),this.hoverColor=(s,i)=>gl(i.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return pl(this,t,e)}get(t){return Oi(this,t)}describe(t,e){return pl(oc,t,e)}override(t,e){return pl(Jn,t,e)}route(t,e,s,i){const r=Oi(this,t),o=Oi(this,s),a="_"+e;Object.defineProperties(r,{[a]:{value:r[e],writable:!0},[e]:{enumerable:!0,get(){const l=this[a],c=o[i];return X(l)?Object.assign({},c,l):q(l,c)},set(l){this[a]=l}}})}apply(t){t.forEach(e=>e(this))}}var gt=new hA({_scriptable:n=>!n.startsWith("on"),_indexable:n=>n!=="events",hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[aA,lA,dA]);function fA(n){return!n||Y(n.size)||Y(n.family)?null:(n.style?n.style+" ":"")+(n.weight?n.weight+" ":"")+n.size+"px "+n.family}function Ko(n,t,e,s,i){let r=t[i];return r||(r=t[i]=n.measureText(i).width,e.push(i)),r>s&&(s=r),s}function gA(n,t,e,s){s=s||{};let i=s.data=s.data||{},r=s.garbageCollect=s.garbageCollect||[];s.font!==t&&(i=s.data={},r=s.garbageCollect=[],s.font=t),n.save(),n.font=t;let o=0;const a=e.length;let l,c,d,h,g;for(l=0;l<a;l++)if(h=e[l],h!=null&&!ft(h))o=Ko(n,i,r,o,h);else if(ft(h))for(c=0,d=h.length;c<d;c++)g=h[c],g!=null&&!ft(g)&&(o=Ko(n,i,r,o,g));n.restore();const m=r.length/2;if(m>e.length){for(l=0;l<m;l++)delete i[r[l]];r.splice(0,m)}return o}function Nn(n,t,e){const s=n.currentDevicePixelRatio,i=e!==0?Math.max(e/2,.5):0;return Math.round((t-i)*s)/s+i}function Hf(n,t){!t&&!n||(t=t||n.getContext("2d"),t.save(),t.resetTransform(),t.clearRect(0,0,n.width,n.height),t.restore())}function ac(n,t,e,s){B0(n,t,e,s,null)}function B0(n,t,e,s,i){let r,o,a,l,c,d,h,g;const m=t.pointStyle,y=t.rotation,_=t.radius;let w=(y||0)*KT;if(m&&typeof m=="object"&&(r=m.toString(),r==="[object HTMLImageElement]"||r==="[object HTMLCanvasElement]")){n.save(),n.translate(e,s),n.rotate(w),n.drawImage(m,-m.width/2,-m.height/2,m.width,m.height),n.restore();return}if(!(isNaN(_)||_<=0)){switch(n.beginPath(),m){default:i?n.ellipse(e,s,i/2,_,0,0,ht):n.arc(e,s,_,0,ht),n.closePath();break;case"triangle":d=i?i/2:_,n.moveTo(e+Math.sin(w)*d,s-Math.cos(w)*_),w+=Vf,n.lineTo(e+Math.sin(w)*d,s-Math.cos(w)*_),w+=Vf,n.lineTo(e+Math.sin(w)*d,s-Math.cos(w)*_),n.closePath();break;case"rectRounded":c=_*.516,l=_-c,o=Math.cos(w+Vn)*l,h=Math.cos(w+Vn)*(i?i/2-c:l),a=Math.sin(w+Vn)*l,g=Math.sin(w+Vn)*(i?i/2-c:l),n.arc(e-h,s-a,c,w-st,w-kt),n.arc(e+g,s-o,c,w-kt,w),n.arc(e+h,s+a,c,w,w+kt),n.arc(e-g,s+o,c,w+kt,w+st),n.closePath();break;case"rect":if(!y){l=Math.SQRT1_2*_,d=i?i/2:l,n.rect(e-d,s-l,2*d,2*l);break}w+=Vn;case"rectRot":h=Math.cos(w)*(i?i/2:_),o=Math.cos(w)*_,a=Math.sin(w)*_,g=Math.sin(w)*(i?i/2:_),n.moveTo(e-h,s-a),n.lineTo(e+g,s-o),n.lineTo(e+h,s+a),n.lineTo(e-g,s+o),n.closePath();break;case"crossRot":w+=Vn;case"cross":h=Math.cos(w)*(i?i/2:_),o=Math.cos(w)*_,a=Math.sin(w)*_,g=Math.sin(w)*(i?i/2:_),n.moveTo(e-h,s-a),n.lineTo(e+h,s+a),n.moveTo(e+g,s-o),n.lineTo(e-g,s+o);break;case"star":h=Math.cos(w)*(i?i/2:_),o=Math.cos(w)*_,a=Math.sin(w)*_,g=Math.sin(w)*(i?i/2:_),n.moveTo(e-h,s-a),n.lineTo(e+h,s+a),n.moveTo(e+g,s-o),n.lineTo(e-g,s+o),w+=Vn,h=Math.cos(w)*(i?i/2:_),o=Math.cos(w)*_,a=Math.sin(w)*_,g=Math.sin(w)*(i?i/2:_),n.moveTo(e-h,s-a),n.lineTo(e+h,s+a),n.moveTo(e+g,s-o),n.lineTo(e-g,s+o);break;case"line":o=i?i/2:Math.cos(w)*_,a=Math.sin(w)*_,n.moveTo(e-o,s-a),n.lineTo(e+o,s+a);break;case"dash":n.moveTo(e,s),n.lineTo(e+Math.cos(w)*(i?i/2:_),s+Math.sin(w)*_);break;case!1:n.closePath();break}n.fill(),t.borderWidth>0&&n.stroke()}}function We(n,t,e){return e=e||.5,!t||n&&n.x>t.left-e&&n.x<t.right+e&&n.y>t.top-e&&n.y<t.bottom+e}function ka(n,t){n.save(),n.beginPath(),n.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),n.clip()}function Ea(n){n.restore()}function pA(n,t,e,s,i){if(!t)return n.lineTo(e.x,e.y);if(i==="middle"){const r=(t.x+e.x)/2;n.lineTo(r,t.y),n.lineTo(r,e.y)}else i==="after"!=!!s?n.lineTo(t.x,e.y):n.lineTo(e.x,t.y);n.lineTo(e.x,e.y)}function mA(n,t,e,s){if(!t)return n.lineTo(e.x,e.y);n.bezierCurveTo(s?t.cp1x:t.cp2x,s?t.cp1y:t.cp2y,s?e.cp2x:e.cp1x,s?e.cp2y:e.cp1y,e.x,e.y)}function yA(n,t){t.translation&&n.translate(t.translation[0],t.translation[1]),Y(t.rotation)||n.rotate(t.rotation),t.color&&(n.fillStyle=t.color),t.textAlign&&(n.textAlign=t.textAlign),t.textBaseline&&(n.textBaseline=t.textBaseline)}function _A(n,t,e,s,i){if(i.strikethrough||i.underline){const r=n.measureText(s),o=t-r.actualBoundingBoxLeft,a=t+r.actualBoundingBoxRight,l=e-r.actualBoundingBoxAscent,c=e+r.actualBoundingBoxDescent,d=i.strikethrough?(l+c)/2:c;n.strokeStyle=n.fillStyle,n.beginPath(),n.lineWidth=i.decorationWidth||2,n.moveTo(o,d),n.lineTo(a,d),n.stroke()}}function bA(n,t){const e=n.fillStyle;n.fillStyle=t.color,n.fillRect(t.left,t.top,t.width,t.height),n.fillStyle=e}function Zn(n,t,e,s,i,r={}){const o=ft(t)?t:[t],a=r.strokeWidth>0&&r.strokeColor!=="";let l,c;for(n.save(),n.font=i.string,yA(n,r),l=0;l<o.length;++l)c=o[l],r.backdrop&&bA(n,r.backdrop),a&&(r.strokeColor&&(n.strokeStyle=r.strokeColor),Y(r.strokeWidth)||(n.lineWidth=r.strokeWidth),n.strokeText(c,e,s,r.maxWidth)),n.fillText(c,e,s,r.maxWidth),_A(n,e,s,c,r),s+=Number(i.lineHeight);n.restore()}function Qi(n,t){const{x:e,y:s,w:i,h:r,radius:o}=t;n.arc(e+o.topLeft,s+o.topLeft,o.topLeft,1.5*st,st,!0),n.lineTo(e,s+r-o.bottomLeft),n.arc(e+o.bottomLeft,s+r-o.bottomLeft,o.bottomLeft,st,kt,!0),n.lineTo(e+i-o.bottomRight,s+r),n.arc(e+i-o.bottomRight,s+r-o.bottomRight,o.bottomRight,kt,0,!0),n.lineTo(e+i,s+o.topRight),n.arc(e+i-o.topRight,s+o.topRight,o.topRight,0,-kt,!0),n.lineTo(e+o.topLeft,s)}const vA=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,wA=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function xA(n,t){const e=(""+n).match(vA);if(!e||e[1]==="normal")return t*1.2;switch(n=+e[2],e[3]){case"px":return n;case"%":n/=100;break}return t*n}const kA=n=>+n||0;function qu(n,t){const e={},s=X(t),i=s?Object.keys(t):t,r=X(n)?s?o=>q(n[o],n[t[o]]):o=>n[o]:()=>n;for(const o of i)e[o]=kA(r(o));return e}function j0(n){return qu(n,{top:"y",right:"x",bottom:"y",left:"x"})}function qn(n){return qu(n,["topLeft","topRight","bottomLeft","bottomRight"])}function Yt(n){const t=j0(n);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function St(n,t){n=n||{},t=t||gt.font;let e=q(n.size,t.size);typeof e=="string"&&(e=parseInt(e,10));let s=q(n.style,t.style);s&&!(""+s).match(wA)&&(console.warn('Invalid font style specified: "'+s+'"'),s=void 0);const i={family:q(n.family,t.family),lineHeight:xA(q(n.lineHeight,t.lineHeight),e),size:e,style:s,weight:q(n.weight,t.weight),string:""};return i.string=fA(i),i}function xi(n,t,e,s){let i,r,o;for(i=0,r=n.length;i<r;++i)if(o=n[i],o!==void 0&&o!==void 0)return o}function EA(n,t,e){const{min:s,max:i}=n,r=S0(t,(i-s)/2),o=(a,l)=>e&&a===0?0:a+l;return{min:o(s,-Math.abs(r)),max:o(i,r)}}function Rn(n,t){return Object.assign(Object.create(n),t)}function Gu(n,t=[""],e,s,i=()=>n[0]){const r=e||n;typeof s>"u"&&(s=H0("_fallback",n));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:n,_rootScopes:r,_fallback:s,_getTarget:i,override:a=>Gu([a,...n],t,r,s)};return new Proxy(o,{deleteProperty(a,l){return delete a[l],delete a._keys,delete n[0][l],!0},get(a,l){return z0(a,l,()=>DA(l,t,n,a))},getOwnPropertyDescriptor(a,l){return Reflect.getOwnPropertyDescriptor(a._scopes[0],l)},getPrototypeOf(){return Reflect.getPrototypeOf(n[0])},has(a,l){return qf(a).includes(l)},ownKeys(a){return qf(a)},set(a,l,c){const d=a._storage||(a._storage=i());return a[l]=d[l]=c,delete a._keys,!0}})}function Fs(n,t,e,s){const i={_cacheable:!1,_proxy:n,_context:t,_subProxy:e,_stack:new Set,_descriptors:U0(n,s),setContext:r=>Fs(n,r,e,s),override:r=>Fs(n.override(r),t,e,s)};return new Proxy(i,{deleteProperty(r,o){return delete r[o],delete n[o],!0},get(r,o,a){return z0(r,o,()=>TA(r,o,a))},getOwnPropertyDescriptor(r,o){return r._descriptors.allKeys?Reflect.has(n,o)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(n,o)},getPrototypeOf(){return Reflect.getPrototypeOf(n)},has(r,o){return Reflect.has(n,o)},ownKeys(){return Reflect.ownKeys(n)},set(r,o,a){return n[o]=a,delete r[o],!0}})}function U0(n,t={scriptable:!0,indexable:!0}){const{_scriptable:e=t.scriptable,_indexable:s=t.indexable,_allKeys:i=t.allKeys}=n;return{allKeys:i,scriptable:e,indexable:s,isScriptable:Sn(e)?e:()=>e,isIndexable:Sn(s)?s:()=>s}}const IA=(n,t)=>n?n+Uu(t):t,Ku=(n,t)=>X(t)&&n!=="adapters"&&(Object.getPrototypeOf(t)===null||t.constructor===Object);function z0(n,t,e){if(Object.prototype.hasOwnProperty.call(n,t)||t==="constructor")return n[t];const s=e();return n[t]=s,s}function TA(n,t,e){const{_proxy:s,_context:i,_subProxy:r,_descriptors:o}=n;let a=s[t];return Sn(a)&&o.isScriptable(t)&&(a=AA(t,a,n,e)),ft(a)&&a.length&&(a=SA(t,a,n,o.isIndexable)),Ku(t,a)&&(a=Fs(a,i,r&&r[t],o)),a}function AA(n,t,e,s){const{_proxy:i,_context:r,_subProxy:o,_stack:a}=e;if(a.has(n))throw new Error("Recursion detected: "+Array.from(a).join("->")+"->"+n);a.add(n);let l=t(r,o||s);return a.delete(n),Ku(n,l)&&(l=Yu(i._scopes,i,n,l)),l}function SA(n,t,e,s){const{_proxy:i,_context:r,_subProxy:o,_descriptors:a}=e;if(typeof r.index<"u"&&s(n))return t[r.index%t.length];if(X(t[0])){const l=t,c=i._scopes.filter(d=>d!==l);t=[];for(const d of l){const h=Yu(c,i,n,d);t.push(Fs(h,r,o&&o[n],a))}}return t}function $0(n,t,e){return Sn(n)?n(t,e):n}const PA=(n,t)=>n===!0?t:typeof n=="string"?An(t,n):void 0;function CA(n,t,e,s,i){for(const r of t){const o=PA(e,r);if(o){n.add(o);const a=$0(o._fallback,e,i);if(typeof a<"u"&&a!==e&&a!==s)return a}else if(o===!1&&typeof s<"u"&&e!==s)return null}return!1}function Yu(n,t,e,s){const i=t._rootScopes,r=$0(t._fallback,e,s),o=[...n,...i],a=new Set;a.add(s);let l=Wf(a,o,e,r||e,s);return l===null||typeof r<"u"&&r!==e&&(l=Wf(a,o,r,l,s),l===null)?!1:Gu(Array.from(a),[""],i,r,()=>RA(t,e,s))}function Wf(n,t,e,s,i){for(;e;)e=CA(n,t,e,s,i);return e}function RA(n,t,e){const s=n._getTarget();t in s||(s[t]={});const i=s[t];return ft(i)&&X(e)?e:i||{}}function DA(n,t,e,s){let i;for(const r of t)if(i=H0(IA(r,n),e),typeof i<"u")return Ku(n,i)?Yu(e,s,n,i):i}function H0(n,t){for(const e of t){if(!e)continue;const s=e[n];if(typeof s<"u")return s}}function qf(n){let t=n._keys;return t||(t=n._keys=MA(n._scopes)),t}function MA(n){const t=new Set;for(const e of n)for(const s of Object.keys(e).filter(i=>!i.startsWith("_")))t.add(s);return Array.from(t)}function W0(n,t,e,s){const{iScale:i}=n,{key:r="r"}=this._parsing,o=new Array(s);let a,l,c,d;for(a=0,l=s;a<l;++a)c=a+e,d=t[c],o[a]={r:i.parse(An(d,r),c)};return o}const LA=Number.EPSILON||1e-14,Bs=(n,t)=>t<n.length&&!n[t].skip&&n[t],q0=n=>n==="x"?"y":"x";function OA(n,t,e,s){const i=n.skip?t:n,r=t,o=e.skip?t:e,a=rc(r,i),l=rc(o,r);let c=a/(a+l),d=l/(a+l);c=isNaN(c)?0:c,d=isNaN(d)?0:d;const h=s*c,g=s*d;return{previous:{x:r.x-h*(o.x-i.x),y:r.y-h*(o.y-i.y)},next:{x:r.x+g*(o.x-i.x),y:r.y+g*(o.y-i.y)}}}function VA(n,t,e){const s=n.length;let i,r,o,a,l,c=Bs(n,0);for(let d=0;d<s-1;++d)if(l=c,c=Bs(n,d+1),!(!l||!c)){if(Mi(t[d],0,LA)){e[d]=e[d+1]=0;continue}i=e[d]/t[d],r=e[d+1]/t[d],a=Math.pow(i,2)+Math.pow(r,2),!(a<=9)&&(o=3/Math.sqrt(a),e[d]=i*o*t[d],e[d+1]=r*o*t[d])}}function NA(n,t,e="x"){const s=q0(e),i=n.length;let r,o,a,l=Bs(n,0);for(let c=0;c<i;++c){if(o=a,a=l,l=Bs(n,c+1),!a)continue;const d=a[e],h=a[s];o&&(r=(d-o[e])/3,a[`cp1${e}`]=d-r,a[`cp1${s}`]=h-r*t[c]),l&&(r=(l[e]-d)/3,a[`cp2${e}`]=d+r,a[`cp2${s}`]=h+r*t[c])}}function FA(n,t="x"){const e=q0(t),s=n.length,i=Array(s).fill(0),r=Array(s);let o,a,l,c=Bs(n,0);for(o=0;o<s;++o)if(a=l,l=c,c=Bs(n,o+1),!!l){if(c){const d=c[t]-l[t];i[o]=d!==0?(c[e]-l[e])/d:0}r[o]=a?c?Ae(i[o-1])!==Ae(i[o])?0:(i[o-1]+i[o])/2:i[o-1]:i[o]}VA(n,i,r),NA(n,r,t)}function Qr(n,t,e){return Math.max(Math.min(n,e),t)}function BA(n,t){let e,s,i,r,o,a=We(n[0],t);for(e=0,s=n.length;e<s;++e)o=r,r=a,a=e<s-1&&We(n[e+1],t),r&&(i=n[e],o&&(i.cp1x=Qr(i.cp1x,t.left,t.right),i.cp1y=Qr(i.cp1y,t.top,t.bottom)),a&&(i.cp2x=Qr(i.cp2x,t.left,t.right),i.cp2y=Qr(i.cp2y,t.top,t.bottom)))}function jA(n,t,e,s,i){let r,o,a,l;if(t.spanGaps&&(n=n.filter(c=>!c.skip)),t.cubicInterpolationMode==="monotone")FA(n,i);else{let c=s?n[n.length-1]:n[0];for(r=0,o=n.length;r<o;++r)a=n[r],l=OA(c,a,n[Math.min(r+1,o-(s?0:1))%o],t.tension),a.cp1x=l.previous.x,a.cp1y=l.previous.y,a.cp2x=l.next.x,a.cp2y=l.next.y,c=a}t.capBezierPoints&&BA(n,e)}function Qu(){return typeof window<"u"&&typeof document<"u"}function Xu(n){let t=n.parentNode;return t&&t.toString()==="[object ShadowRoot]"&&(t=t.host),t}function Yo(n,t,e){let s;return typeof n=="string"?(s=parseInt(n,10),n.indexOf("%")!==-1&&(s=s/100*t.parentNode[e])):s=n,s}const Ia=n=>n.ownerDocument.defaultView.getComputedStyle(n,null);function UA(n,t){return Ia(n).getPropertyValue(t)}const zA=["top","right","bottom","left"];function Gn(n,t,e){const s={};e=e?"-"+e:"";for(let i=0;i<4;i++){const r=zA[i];s[r]=parseFloat(n[t+"-"+r+e])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}const $A=(n,t,e)=>(n>0||t>0)&&(!e||!e.shadowRoot);function HA(n,t){const e=n.touches,s=e&&e.length?e[0]:n,{offsetX:i,offsetY:r}=s;let o=!1,a,l;if($A(i,r,n.target))a=i,l=r;else{const c=t.getBoundingClientRect();a=s.clientX-c.left,l=s.clientY-c.top,o=!0}return{x:a,y:l,box:o}}function Un(n,t){if("native"in n)return n;const{canvas:e,currentDevicePixelRatio:s}=t,i=Ia(e),r=i.boxSizing==="border-box",o=Gn(i,"padding"),a=Gn(i,"border","width"),{x:l,y:c,box:d}=HA(n,e),h=o.left+(d&&a.left),g=o.top+(d&&a.top);let{width:m,height:y}=t;return r&&(m-=o.width+a.width,y-=o.height+a.height),{x:Math.round((l-h)/m*e.width/s),y:Math.round((c-g)/y*e.height/s)}}function WA(n,t,e){let s,i;if(t===void 0||e===void 0){const r=n&&Xu(n);if(!r)t=n.clientWidth,e=n.clientHeight;else{const o=r.getBoundingClientRect(),a=Ia(r),l=Gn(a,"border","width"),c=Gn(a,"padding");t=o.width-c.width-l.width,e=o.height-c.height-l.height,s=Yo(a.maxWidth,r,"clientWidth"),i=Yo(a.maxHeight,r,"clientHeight")}}return{width:t,height:e,maxWidth:s||Go,maxHeight:i||Go}}const fn=n=>Math.round(n*10)/10;function qA(n,t,e,s){const i=Ia(n),r=Gn(i,"margin"),o=Yo(i.maxWidth,n,"clientWidth")||Go,a=Yo(i.maxHeight,n,"clientHeight")||Go,l=WA(n,t,e);let{width:c,height:d}=l;if(i.boxSizing==="content-box"){const g=Gn(i,"border","width"),m=Gn(i,"padding");c-=m.width+g.width,d-=m.height+g.height}return c=Math.max(0,c-r.width),d=Math.max(0,s?c/s:d-r.height),c=fn(Math.min(c,o,l.maxWidth)),d=fn(Math.min(d,a,l.maxHeight)),c&&!d&&(d=fn(c/2)),(t!==void 0||e!==void 0)&&s&&l.height&&d>l.height&&(d=l.height,c=fn(Math.floor(d*s))),{width:c,height:d}}function Gf(n,t,e){const s=t||1,i=fn(n.height*s),r=fn(n.width*s);n.height=fn(n.height),n.width=fn(n.width);const o=n.canvas;return o.style&&(e||!o.style.height&&!o.style.width)&&(o.style.height=`${n.height}px`,o.style.width=`${n.width}px`),n.currentDevicePixelRatio!==s||o.height!==i||o.width!==r?(n.currentDevicePixelRatio=s,o.height=i,o.width=r,n.ctx.setTransform(s,0,0,s,0,0),!0):!1}const GA=function(){let n=!1;try{const t={get passive(){return n=!0,!1}};Qu()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch{}return n}();function Kf(n,t){const e=UA(n,t),s=e&&e.match(/^(\d+)(\.\d+)?px$/);return s?+s[1]:void 0}function zn(n,t,e,s){return{x:n.x+e*(t.x-n.x),y:n.y+e*(t.y-n.y)}}function KA(n,t,e,s){return{x:n.x+e*(t.x-n.x),y:s==="middle"?e<.5?n.y:t.y:s==="after"?e<1?n.y:t.y:e>0?t.y:n.y}}function YA(n,t,e,s){const i={x:n.cp2x,y:n.cp2y},r={x:t.cp1x,y:t.cp1y},o=zn(n,i,e),a=zn(i,r,e),l=zn(r,t,e),c=zn(o,a,e),d=zn(a,l,e);return zn(c,d,e)}const QA=function(n,t){return{x(e){return n+n+t-e},setWidth(e){t=e},textAlign(e){return e==="center"?e:e==="right"?"left":"right"},xPlus(e,s){return e-s},leftForLtr(e,s){return e-s}}},XA=function(){return{x(n){return n},setWidth(n){},textAlign(n){return n},xPlus(n,t){return n+t},leftForLtr(n,t){return n}}};function Es(n,t,e){return n?QA(t,e):XA()}function G0(n,t){let e,s;(t==="ltr"||t==="rtl")&&(e=n.canvas.style,s=[e.getPropertyValue("direction"),e.getPropertyPriority("direction")],e.setProperty("direction",t,"important"),n.prevTextDirection=s)}function K0(n,t){t!==void 0&&(delete n.prevTextDirection,n.canvas.style.setProperty("direction",t[0],t[1]))}function Y0(n){return n==="angle"?{between:Yi,compare:JT,normalize:Wt}:{between:$e,compare:(t,e)=>t-e,normalize:t=>t}}function Yf({start:n,end:t,count:e,loop:s,style:i}){return{start:n%e,end:t%e,loop:s&&(t-n+1)%e===0,style:i}}function JA(n,t,e){const{property:s,start:i,end:r}=e,{between:o,normalize:a}=Y0(s),l=t.length;let{start:c,end:d,loop:h}=n,g,m;if(h){for(c+=l,d+=l,g=0,m=l;g<m&&o(a(t[c%l][s]),i,r);++g)c--,d--;c%=l,d%=l}return d<c&&(d+=l),{start:c,end:d,loop:h,style:n.style}}function Q0(n,t,e){if(!e)return[n];const{property:s,start:i,end:r}=e,o=t.length,{compare:a,between:l,normalize:c}=Y0(s),{start:d,end:h,loop:g,style:m}=JA(n,t,e),y=[];let _=!1,w=null,A,P,D;const L=()=>l(i,D,A)&&a(i,D)!==0,M=()=>a(r,A)===0||l(r,D,A),V=()=>_||L(),k=()=>!_||M();for(let v=d,x=d;v<=h;++v)P=t[v%o],!P.skip&&(A=c(P[s]),A!==D&&(_=l(A,i,r),w===null&&V()&&(w=a(A,i)===0?v:x),w!==null&&k()&&(y.push(Yf({start:w,end:v,loop:g,count:o,style:m})),w=null),x=v,D=A));return w!==null&&y.push(Yf({start:w,end:h,loop:g,count:o,style:m})),y}function X0(n,t){const e=[],s=n.segments;for(let i=0;i<s.length;i++){const r=Q0(s[i],n.points,t);r.length&&e.push(...r)}return e}function ZA(n,t,e,s){let i=0,r=t-1;if(e&&!s)for(;i<t&&!n[i].skip;)i++;for(;i<t&&n[i].skip;)i++;for(i%=t,e&&(r+=i);r>i&&n[r%t].skip;)r--;return r%=t,{start:i,end:r}}function t1(n,t,e,s){const i=n.length,r=[];let o=t,a=n[t],l;for(l=t+1;l<=e;++l){const c=n[l%i];c.skip||c.stop?a.skip||(s=!1,r.push({start:t%i,end:(l-1)%i,loop:s}),t=o=c.stop?l:null):(o=l,a.skip&&(t=l)),a=c}return o!==null&&r.push({start:t%i,end:o%i,loop:s}),r}function e1(n,t){const e=n.points,s=n.options.spanGaps,i=e.length;if(!i)return[];const r=!!n._loop,{start:o,end:a}=ZA(e,i,r,s);if(s===!0)return Qf(n,[{start:o,end:a,loop:r}],e,t);const l=a<o?a+i:a,c=!!n._fullLoop&&o===0&&a===i-1;return Qf(n,t1(e,o,l,c),e,t)}function Qf(n,t,e,s){return!s||!s.setContext||!e?t:n1(n,t,e,s)}function n1(n,t,e,s){const i=n._chart.getContext(),r=Xf(n.options),{_datasetIndex:o,options:{spanGaps:a}}=n,l=e.length,c=[];let d=r,h=t[0].start,g=h;function m(y,_,w,A){const P=a?-1:1;if(y!==_){for(y+=l;e[y%l].skip;)y-=P;for(;e[_%l].skip;)_+=P;y%l!==_%l&&(c.push({start:y%l,end:_%l,loop:w,style:A}),d=A,h=_%l)}}for(const y of t){h=a?h:y.start;let _=e[h%l],w;for(g=h+1;g<=y.end;g++){const A=e[g%l];w=Xf(s.setContext(Rn(i,{type:"segment",p0:_,p1:A,p0DataIndex:(g-1)%l,p1DataIndex:g%l,datasetIndex:o}))),s1(w,d)&&m(h,g-1,y.loop,d),_=A,d=w}h<g-1&&m(h,g-1,y.loop,d)}return c}function Xf(n){return{backgroundColor:n.backgroundColor,borderCapStyle:n.borderCapStyle,borderDash:n.borderDash,borderDashOffset:n.borderDashOffset,borderJoinStyle:n.borderJoinStyle,borderWidth:n.borderWidth,borderColor:n.borderColor}}function s1(n,t){if(!t)return!1;const e=[],s=function(i,r){return Wu(r)?(e.includes(r)||e.push(r),e.indexOf(r)):r};return JSON.stringify(n,s)!==JSON.stringify(t,s)}function Xr(n,t,e){return n.options.clip?n[e]:t[e]}function i1(n,t){const{xScale:e,yScale:s}=n;return e&&s?{left:Xr(e,t,"left"),right:Xr(e,t,"right"),top:Xr(s,t,"top"),bottom:Xr(s,t,"bottom")}:t}function J0(n,t){const e=t._clip;if(e.disabled)return!1;const s=i1(t,n.chartArea);return{left:e.left===!1?0:s.left-(e.left===!0?0:e.left),right:e.right===!1?n.width:s.right+(e.right===!0?0:e.right),top:e.top===!1?0:s.top-(e.top===!0?0:e.top),bottom:e.bottom===!1?n.height:s.bottom+(e.bottom===!0?0:e.bottom)}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */class r1{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,s,i){const r=e.listeners[i],o=e.duration;r.forEach(a=>a({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(s-e.start,o)}))}_refresh(){this._request||(this._running=!0,this._request=L0.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((s,i)=>{if(!s.running||!s.items.length)return;const r=s.items;let o=r.length-1,a=!1,l;for(;o>=0;--o)l=r[o],l._active?(l._total>s.duration&&(s.duration=l._total),l.tick(t),a=!0):(r[o]=r[r.length-1],r.pop());a&&(i.draw(),this._notify(i,s,t,"progress")),r.length||(s.running=!1,this._notify(i,s,t,"complete"),s.initial=!1),e+=r.length}),this._lastDate=t,e===0&&(this._running=!1)}_getAnims(t){const e=this._charts;let s=e.get(t);return s||(s={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,s)),s}listen(t,e,s){this._getAnims(t).listeners[e].push(s)}add(t,e){!e||!e.length||this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((s,i)=>Math.max(s,i._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!(!e||!e.running||!e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const s=e.items;let i=s.length-1;for(;i>=0;--i)s[i].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var Oe=new r1;const Jf="transparent",o1={boolean(n,t,e){return e>.5?t:n},color(n,t,e){const s=zf(n||Jf),i=s.valid&&zf(t||Jf);return i&&i.valid?i.mix(s,e).hexString():t},number(n,t,e){return n+(t-n)*e}};class a1{constructor(t,e,s,i){const r=e[s];i=xi([t.to,i,r,t.from]);const o=xi([t.from,r,i]);this._active=!0,this._fn=t.fn||o1[t.type||typeof o],this._easing=Li[t.easing]||Li.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=s,this._from=o,this._to=i,this._promises=void 0}active(){return this._active}update(t,e,s){if(this._active){this._notify(!1);const i=this._target[this._prop],r=s-this._start,o=this._duration-r;this._start=s,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=r,this._loop=!!t.loop,this._to=xi([t.to,e,i,t.from]),this._from=xi([t.from,i,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,s=this._duration,i=this._prop,r=this._from,o=this._loop,a=this._to;let l;if(this._active=r!==a&&(o||e<s),!this._active){this._target[i]=a,this._notify(!0);return}if(e<0){this._target[i]=r;return}l=e/s%2,l=o&&l>1?2-l:l,l=this._easing(Math.min(1,Math.max(0,l))),this._target[i]=this._fn(r,a,l)}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,s)=>{t.push({res:e,rej:s})})}_notify(t){const e=t?"res":"rej",s=this._promises||[];for(let i=0;i<s.length;i++)s[i][e]()}}class Z0{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!X(t))return;const e=Object.keys(gt.animation),s=this._properties;Object.getOwnPropertyNames(t).forEach(i=>{const r=t[i];if(!X(r))return;const o={};for(const a of e)o[a]=r[a];(ft(r.properties)&&r.properties||[i]).forEach(a=>{(a===i||!s.has(a))&&s.set(a,o)})})}_animateOptions(t,e){const s=e.options,i=c1(t,s);if(!i)return[];const r=this._createAnimations(i,s);return s.$shared&&l1(t.options.$animations,s).then(()=>{t.options=s},()=>{}),r}_createAnimations(t,e){const s=this._properties,i=[],r=t.$animations||(t.$animations={}),o=Object.keys(e),a=Date.now();let l;for(l=o.length-1;l>=0;--l){const c=o[l];if(c.charAt(0)==="$")continue;if(c==="options"){i.push(...this._animateOptions(t,e));continue}const d=e[c];let h=r[c];const g=s.get(c);if(h)if(g&&h.active()){h.update(g,d,a);continue}else h.cancel();if(!g||!g.duration){t[c]=d;continue}r[c]=h=new a1(g,t,c,d),i.push(h)}return i}update(t,e){if(this._properties.size===0){Object.assign(t,e);return}const s=this._createAnimations(t,e);if(s.length)return Oe.add(this._chart,s),!0}}function l1(n,t){const e=[],s=Object.keys(t);for(let i=0;i<s.length;i++){const r=n[s[i]];r&&r.active()&&e.push(r.wait())}return Promise.all(e)}function c1(n,t){if(!t)return;let e=n.options;if(!e){n.options=t;return}return e.$shared&&(n.options=e=Object.assign({},e,{$shared:!1,$animations:{}})),e}function Zf(n,t){const e=n&&n.options||{},s=e.reverse,i=e.min===void 0?t:0,r=e.max===void 0?t:0;return{start:s?r:i,end:s?i:r}}function u1(n,t,e){if(e===!1)return!1;const s=Zf(n,e),i=Zf(t,e);return{top:i.end,right:s.end,bottom:i.start,left:s.start}}function d1(n){let t,e,s,i;return X(n)?(t=n.top,e=n.right,s=n.bottom,i=n.left):t=e=s=i=n,{top:t,right:e,bottom:s,left:i,disabled:n===!1}}function ty(n,t){const e=[],s=n._getSortedDatasetMetas(t);let i,r;for(i=0,r=s.length;i<r;++i)e.push(s[i].index);return e}function tg(n,t,e,s={}){const i=n.keys,r=s.mode==="single";let o,a,l,c;if(t===null)return;let d=!1;for(o=0,a=i.length;o<a;++o){if(l=+i[o],l===e){if(d=!0,s.all)continue;break}c=n.values[l],wt(c)&&(r||t===0||Ae(t)===Ae(c))&&(t+=c)}return!d&&!s.all?0:t}function h1(n,t){const{iScale:e,vScale:s}=t,i=e.axis==="x"?"x":"y",r=s.axis==="x"?"x":"y",o=Object.keys(n),a=new Array(o.length);let l,c,d;for(l=0,c=o.length;l<c;++l)d=o[l],a[l]={[i]:d,[r]:n[d]};return a}function ml(n,t){const e=n&&n.options.stacked;return e||e===void 0&&t.stack!==void 0}function f1(n,t,e){return`${n.id}.${t.id}.${e.stack||e.type}`}function g1(n){const{min:t,max:e,minDefined:s,maxDefined:i}=n.getUserBounds();return{min:s?t:Number.NEGATIVE_INFINITY,max:i?e:Number.POSITIVE_INFINITY}}function p1(n,t,e){const s=n[t]||(n[t]={});return s[e]||(s[e]={})}function eg(n,t,e,s){for(const i of t.getMatchingVisibleMetas(s).reverse()){const r=n[i.index];if(e&&r>0||!e&&r<0)return i.index}return null}function ng(n,t){const{chart:e,_cachedMeta:s}=n,i=e._stacks||(e._stacks={}),{iScale:r,vScale:o,index:a}=s,l=r.axis,c=o.axis,d=f1(r,o,s),h=t.length;let g;for(let m=0;m<h;++m){const y=t[m],{[l]:_,[c]:w}=y,A=y._stacks||(y._stacks={});g=A[c]=p1(i,d,_),g[a]=w,g._top=eg(g,o,!0,s.type),g._bottom=eg(g,o,!1,s.type);const P=g._visualValues||(g._visualValues={});P[a]=w}}function yl(n,t){const e=n.scales;return Object.keys(e).filter(s=>e[s].axis===t).shift()}function m1(n,t){return Rn(n,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}function y1(n,t,e){return Rn(n,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:e,index:t,mode:"default",type:"data"})}function li(n,t){const e=n.controller.index,s=n.vScale&&n.vScale.axis;if(s){t=t||n._parsed;for(const i of t){const r=i._stacks;if(!r||r[s]===void 0||r[s][e]===void 0)return;delete r[s][e],r[s]._visualValues!==void 0&&r[s]._visualValues[e]!==void 0&&delete r[s]._visualValues[e]}}}const _l=n=>n==="reset"||n==="none",sg=(n,t)=>t?n:Object.assign({},n),_1=(n,t,e)=>n&&!t.hidden&&t._stacked&&{keys:ty(e,!0),values:null};class me{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=ml(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&li(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,s=this.getDataset(),i=(h,g,m,y)=>h==="x"?g:h==="r"?y:m,r=e.xAxisID=q(s.xAxisID,yl(t,"x")),o=e.yAxisID=q(s.yAxisID,yl(t,"y")),a=e.rAxisID=q(s.rAxisID,yl(t,"r")),l=e.indexAxis,c=e.iAxisID=i(l,r,o,a),d=e.vAxisID=i(l,o,r,a);e.xScale=this.getScaleForId(r),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(a),e.iScale=this.getScaleForId(c),e.vScale=this.getScaleForId(d)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&Bf(this._data,this),t._stacked&&li(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),s=this._data;if(X(e)){const i=this._cachedMeta;this._data=h1(e,i)}else if(s!==e){if(s){Bf(s,this);const i=this._cachedMeta;li(i),i._parsed=[]}e&&Object.isExtensible(e)&&nA(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,s=this.getDataset();let i=!1;this._dataCheck();const r=e._stacked;e._stacked=ml(e.vScale,e),e.stack!==s.stack&&(i=!0,li(e),e.stack=s.stack),this._resyncElements(t),(i||r!==e._stacked)&&(ng(this,e._parsed),e._stacked=ml(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),s=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(s,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:s,_data:i}=this,{iScale:r,_stacked:o}=s,a=r.axis;let l=t===0&&e===i.length?!0:s._sorted,c=t>0&&s._parsed[t-1],d,h,g;if(this._parsing===!1)s._parsed=i,s._sorted=!0,g=i;else{ft(i[t])?g=this.parseArrayData(s,i,t,e):X(i[t])?g=this.parseObjectData(s,i,t,e):g=this.parsePrimitiveData(s,i,t,e);const m=()=>h[a]===null||c&&h[a]<c[a];for(d=0;d<e;++d)s._parsed[d+t]=h=g[d],l&&(m()&&(l=!1),c=h);s._sorted=l}o&&ng(this,g)}parsePrimitiveData(t,e,s,i){const{iScale:r,vScale:o}=t,a=r.axis,l=o.axis,c=r.getLabels(),d=r===o,h=new Array(i);let g,m,y;for(g=0,m=i;g<m;++g)y=g+s,h[g]={[a]:d||r.parse(c[y],y),[l]:o.parse(e[y],y)};return h}parseArrayData(t,e,s,i){const{xScale:r,yScale:o}=t,a=new Array(i);let l,c,d,h;for(l=0,c=i;l<c;++l)d=l+s,h=e[d],a[l]={x:r.parse(h[0],d),y:o.parse(h[1],d)};return a}parseObjectData(t,e,s,i){const{xScale:r,yScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,c=new Array(i);let d,h,g,m;for(d=0,h=i;d<h;++d)g=d+s,m=e[g],c[d]={x:r.parse(An(m,a),g),y:o.parse(An(m,l),g)};return c}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,s){const i=this.chart,r=this._cachedMeta,o=e[t.axis],a={keys:ty(i,!0),values:e._stacks[t.axis]._visualValues};return tg(a,o,r.index,{mode:s})}updateRangeFromParsed(t,e,s,i){const r=s[e.axis];let o=r===null?NaN:r;const a=i&&s._stacks[e.axis];i&&a&&(i.values=a,o=tg(i,r,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const s=this._cachedMeta,i=s._parsed,r=s._sorted&&t===s.iScale,o=i.length,a=this._getOtherScale(t),l=_1(e,s,this.chart),c={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:d,max:h}=g1(a);let g,m;function y(){m=i[g];const _=m[a.axis];return!wt(m[t.axis])||d>_||h<_}for(g=0;g<o&&!(!y()&&(this.updateRangeFromParsed(c,t,m,l),r));++g);if(r){for(g=o-1;g>=0;--g)if(!y()){this.updateRangeFromParsed(c,t,m,l);break}}return c}getAllParsedValues(t){const e=this._cachedMeta._parsed,s=[];let i,r,o;for(i=0,r=e.length;i<r;++i)o=e[i][t.axis],wt(o)&&s.push(o);return s}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,s=e.iScale,i=e.vScale,r=this.getParsed(t);return{label:s?""+s.getLabelForValue(r[s.axis]):"",value:i?""+i.getLabelForValue(r[i.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=d1(q(this.options.clip,u1(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,s=this._cachedMeta,i=s.data||[],r=e.chartArea,o=[],a=this._drawStart||0,l=this._drawCount||i.length-a,c=this.options.drawActiveElementsOnTop;let d;for(s.dataset&&s.dataset.draw(t,r,a,l),d=a;d<a+l;++d){const h=i[d];h.hidden||(h.active&&c?o.push(h):h.draw(t,r))}for(d=0;d<o.length;++d)o[d].draw(t,r)}getStyle(t,e){const s=e?"active":"default";return t===void 0&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(s):this.resolveDataElementOptions(t||0,s)}getContext(t,e,s){const i=this.getDataset();let r;if(t>=0&&t<this._cachedMeta.data.length){const o=this._cachedMeta.data[t];r=o.$context||(o.$context=y1(this.getContext(),t,o)),r.parsed=this.getParsed(t),r.raw=i.data[t],r.index=r.dataIndex=t}else r=this.$context||(this.$context=m1(this.chart.getContext(),this.index)),r.dataset=i,r.index=r.datasetIndex=this.index;return r.active=!!e,r.mode=s,r}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",s){const i=e==="active",r=this._cachedDataOpts,o=t+"-"+e,a=r[o],l=this.enableOptionSharing&&Ki(s);if(a)return sg(a,l);const c=this.chart.config,d=c.datasetElementScopeKeys(this._type,t),h=i?[`${t}Hover`,"hover",t,""]:[t,""],g=c.getOptionScopes(this.getDataset(),d),m=Object.keys(gt.elements[t]),y=()=>this.getContext(s,i,e),_=c.resolveNamedOptions(g,m,y,h);return _.$shared&&(_.$shared=l,r[o]=Object.freeze(sg(_,l))),_}_resolveAnimations(t,e,s){const i=this.chart,r=this._cachedDataOpts,o=`animation-${e}`,a=r[o];if(a)return a;let l;if(i.options.animation!==!1){const d=this.chart.config,h=d.datasetAnimationScopeKeys(this._type,e),g=d.getOptionScopes(this.getDataset(),h);l=d.createResolver(g,this.getContext(t,s,e))}const c=new Z0(i,l&&l.animations);return l&&l._cacheable&&(r[o]=Object.freeze(c)),c}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||_l(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const s=this.resolveDataElementOptions(t,e),i=this._sharedOptions,r=this.getSharedOptions(s),o=this.includeOptions(e,r)||r!==i;return this.updateSharedOptions(r,e,s),{sharedOptions:r,includeOptions:o}}updateElement(t,e,s,i){_l(i)?Object.assign(t,s):this._resolveAnimations(e,i).update(t,s)}updateSharedOptions(t,e,s){t&&!_l(e)&&this._resolveAnimations(void 0,e).update(t,s)}_setStyle(t,e,s,i){t.active=i;const r=this.getStyle(e,i);this._resolveAnimations(e,s,i).update(t,{options:!i&&this.getSharedOptions(r)||r})}removeHoverStyle(t,e,s){this._setStyle(t,s,"active",!1)}setHoverStyle(t,e,s){this._setStyle(t,s,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,s=this._cachedMeta.data;for(const[a,l,c]of this._syncList)this[a](l,c);this._syncList=[];const i=s.length,r=e.length,o=Math.min(r,i);o&&this.parse(0,o),r>i?this._insertElements(i,r-i,t):r<i&&this._removeElements(r,i-r)}_insertElements(t,e,s=!0){const i=this._cachedMeta,r=i.data,o=t+e;let a;const l=c=>{for(c.length+=e,a=c.length-1;a>=o;a--)c[a]=c[a-e]};for(l(r),a=t;a<o;++a)r[a]=new this.dataElementType;this._parsing&&l(i._parsed),this.parse(t,e),s&&this.updateElements(r,t,e,"reset")}updateElements(t,e,s,i){}_removeElements(t,e){const s=this._cachedMeta;if(this._parsing){const i=s._parsed.splice(t,e);s._stacked&&li(s,i)}s.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,s,i]=t;this[e](s,i)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const s=arguments.length-2;s&&this._sync(["_insertElements",t,s])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}B(me,"defaults",{}),B(me,"datasetElementType",null),B(me,"dataElementType",null);function b1(n,t){if(!n._cache.$bar){const e=n.getMatchingVisibleMetas(t);let s=[];for(let i=0,r=e.length;i<r;i++)s=s.concat(e[i].controller.getAllParsedValues(n));n._cache.$bar=M0(s.sort((i,r)=>i-r))}return n._cache.$bar}function v1(n){const t=n.iScale,e=b1(t,n.type);let s=t._length,i,r,o,a;const l=()=>{o===32767||o===-32768||(Ki(a)&&(s=Math.min(s,Math.abs(o-a)||s)),a=o)};for(i=0,r=e.length;i<r;++i)o=t.getPixelForValue(e[i]),l();for(a=void 0,i=0,r=t.ticks.length;i<r;++i)o=t.getPixelForTick(i),l();return s}function w1(n,t,e,s){const i=e.barThickness;let r,o;return Y(i)?(r=t.min*e.categoryPercentage,o=e.barPercentage):(r=i*s,o=1),{chunk:r/s,ratio:o,start:t.pixels[n]-r/2}}function x1(n,t,e,s){const i=t.pixels,r=i[n];let o=n>0?i[n-1]:null,a=n<i.length-1?i[n+1]:null;const l=e.categoryPercentage;o===null&&(o=r-(a===null?t.end-t.start:a-r)),a===null&&(a=r+r-o);const c=r-(r-Math.min(o,a))/2*l;return{chunk:Math.abs(a-o)/2*l/s,ratio:e.barPercentage,start:c}}function k1(n,t,e,s){const i=e.parse(n[0],s),r=e.parse(n[1],s),o=Math.min(i,r),a=Math.max(i,r);let l=o,c=a;Math.abs(o)>Math.abs(a)&&(l=a,c=o),t[e.axis]=c,t._custom={barStart:l,barEnd:c,start:i,end:r,min:o,max:a}}function ey(n,t,e,s){return ft(n)?k1(n,t,e,s):t[e.axis]=e.parse(n,s),t}function ig(n,t,e,s){const i=n.iScale,r=n.vScale,o=i.getLabels(),a=i===r,l=[];let c,d,h,g;for(c=e,d=e+s;c<d;++c)g=t[c],h={},h[i.axis]=a||i.parse(o[c],c),l.push(ey(g,h,r,c));return l}function bl(n){return n&&n.barStart!==void 0&&n.barEnd!==void 0}function E1(n,t,e){return n!==0?Ae(n):(t.isHorizontal()?1:-1)*(t.min>=e?1:-1)}function I1(n){let t,e,s,i,r;return n.horizontal?(t=n.base>n.x,e="left",s="right"):(t=n.base<n.y,e="bottom",s="top"),t?(i="end",r="start"):(i="start",r="end"),{start:e,end:s,reverse:t,top:i,bottom:r}}function T1(n,t,e,s){let i=t.borderSkipped;const r={};if(!i){n.borderSkipped=r;return}if(i===!0){n.borderSkipped={top:!0,right:!0,bottom:!0,left:!0};return}const{start:o,end:a,reverse:l,top:c,bottom:d}=I1(n);i==="middle"&&e&&(n.enableBorderRadius=!0,(e._top||0)===s?i=c:(e._bottom||0)===s?i=d:(r[rg(d,o,a,l)]=!0,i=c)),r[rg(i,o,a,l)]=!0,n.borderSkipped=r}function rg(n,t,e,s){return s?(n=A1(n,t,e),n=og(n,e,t)):n=og(n,t,e),n}function A1(n,t,e){return n===t?e:n===e?t:n}function og(n,t,e){return n==="start"?t:n==="end"?e:n}function S1(n,{inflateAmount:t},e){n.inflateAmount=t==="auto"?e===1?.33:0:t}class po extends me{parsePrimitiveData(t,e,s,i){return ig(t,e,s,i)}parseArrayData(t,e,s,i){return ig(t,e,s,i)}parseObjectData(t,e,s,i){const{iScale:r,vScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,c=r.axis==="x"?a:l,d=o.axis==="x"?a:l,h=[];let g,m,y,_;for(g=s,m=s+i;g<m;++g)_=e[g],y={},y[r.axis]=r.parse(An(_,c),g),h.push(ey(An(_,d),y,o,g));return h}updateRangeFromParsed(t,e,s,i){super.updateRangeFromParsed(t,e,s,i);const r=s._custom;r&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,r.min),t.max=Math.max(t.max,r.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:s,vScale:i}=e,r=this.getParsed(t),o=r._custom,a=bl(o)?"["+o.start+", "+o.end+"]":""+i.getLabelForValue(r[i.axis]);return{label:""+s.getLabelForValue(r[s.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();const t=this._cachedMeta;t.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,s,i){const r=i==="reset",{index:o,_cachedMeta:{vScale:a}}=this,l=a.getBasePixel(),c=a.isHorizontal(),d=this._getRuler(),{sharedOptions:h,includeOptions:g}=this._getSharedOptions(e,i);for(let m=e;m<e+s;m++){const y=this.getParsed(m),_=r||Y(y[a.axis])?{base:l,head:l}:this._calculateBarValuePixels(m),w=this._calculateBarIndexPixels(m,d),A=(y._stacks||{})[a.axis],P={horizontal:c,base:_.base,enableBorderRadius:!A||bl(y._custom)||o===A._top||o===A._bottom,x:c?_.head:w.center,y:c?w.center:_.head,height:c?w.size:Math.abs(_.size),width:c?Math.abs(_.size):w.size};g&&(P.options=h||this.resolveDataElementOptions(m,t[m].active?"active":i));const D=P.options||t[m].options;T1(P,D,A,o),S1(P,D,d.ratio),this.updateElement(t[m],m,P,i)}}_getStacks(t,e){const{iScale:s}=this._cachedMeta,i=s.getMatchingVisibleMetas(this._type).filter(d=>d.controller.options.grouped),r=s.options.stacked,o=[],a=this._cachedMeta.controller.getParsed(e),l=a&&a[s.axis],c=d=>{const h=d._parsed.find(m=>m[s.axis]===l),g=h&&h[d.vScale.axis];if(Y(g)||isNaN(g))return!0};for(const d of i)if(!(e!==void 0&&c(d))&&((r===!1||o.indexOf(d.stack)===-1||r===void 0&&d.stack===void 0)&&o.push(d.stack),d.index===t))break;return o.length||o.push(void 0),o}_getStackCount(t){return this._getStacks(void 0,t).length}_getAxisCount(){return this._getAxis().length}getFirstScaleIdForIndexAxis(){const t=this.chart.scales,e=this.chart.options.indexAxis;return Object.keys(t).filter(s=>t[s].axis===e).shift()}_getAxis(){const t={},e=this.getFirstScaleIdForIndexAxis();for(const s of this.chart.data.datasets)t[q(this.chart.options.indexAxis==="x"?s.xAxisID:s.yAxisID,e)]=!0;return Object.keys(t)}_getStackIndex(t,e,s){const i=this._getStacks(t,s),r=e!==void 0?i.indexOf(e):-1;return r===-1?i.length-1:r}_getRuler(){const t=this.options,e=this._cachedMeta,s=e.iScale,i=[];let r,o;for(r=0,o=e.data.length;r<o;++r)i.push(s.getPixelForValue(this.getParsed(r)[s.axis],r));const a=t.barThickness;return{min:a||v1(e),pixels:i,start:s._startPixel,end:s._endPixel,stackCount:this._getStackCount(),scale:s,grouped:t.grouped,ratio:a?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:s,index:i},options:{base:r,minBarLength:o}}=this,a=r||0,l=this.getParsed(t),c=l._custom,d=bl(c);let h=l[e.axis],g=0,m=s?this.applyStack(e,l,s):h,y,_;m!==h&&(g=m-h,m=h),d&&(h=c.barStart,m=c.barEnd-c.barStart,h!==0&&Ae(h)!==Ae(c.barEnd)&&(g=0),g+=h);const w=!Y(r)&&!d?r:g;let A=e.getPixelForValue(w);if(this.chart.getDataVisibility(t)?y=e.getPixelForValue(g+m):y=A,_=y-A,Math.abs(_)<o){_=E1(_,e,a)*o,h===a&&(A-=_/2);const P=e.getPixelForDecimal(0),D=e.getPixelForDecimal(1),L=Math.min(P,D),M=Math.max(P,D);A=Math.max(Math.min(A,M),L),y=A+_,s&&!d&&(l._stacks[e.axis]._visualValues[i]=e.getValueForPixel(y)-e.getValueForPixel(A))}if(A===e.getPixelForValue(a)){const P=Ae(_)*e.getLineWidthForValue(a)/2;A+=P,_-=P}return{size:_,base:A,head:y,center:y+_/2}}_calculateBarIndexPixels(t,e){const s=e.scale,i=this.options,r=i.skipNull,o=q(i.maxBarThickness,1/0);let a,l;const c=this._getAxisCount();if(e.grouped){const d=r?this._getStackCount(t):e.stackCount,h=i.barThickness==="flex"?x1(t,e,i,d*c):w1(t,e,i,d*c),g=this.chart.options.indexAxis==="x"?this.getDataset().xAxisID:this.getDataset().yAxisID,m=this._getAxis().indexOf(q(g,this.getFirstScaleIdForIndexAxis())),y=this._getStackIndex(this.index,this._cachedMeta.stack,r?t:void 0)+m;a=h.start+h.chunk*y+h.chunk/2,l=Math.min(o,h.chunk*h.ratio)}else a=s.getPixelForValue(this.getParsed(t)[s.axis],t),l=Math.min(o,e.min*e.ratio);return{base:a-l/2,head:a+l/2,center:a,size:l}}draw(){const t=this._cachedMeta,e=t.vScale,s=t.data,i=s.length;let r=0;for(;r<i;++r)this.getParsed(r)[e.axis]!==null&&!s[r].hidden&&s[r].draw(this._ctx)}}B(po,"id","bar"),B(po,"defaults",{datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}}),B(po,"overrides",{scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}});class mo extends me{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,s,i){const r=super.parsePrimitiveData(t,e,s,i);for(let o=0;o<r.length;o++)r[o]._custom=this.resolveDataElementOptions(o+s).radius;return r}parseArrayData(t,e,s,i){const r=super.parseArrayData(t,e,s,i);for(let o=0;o<r.length;o++){const a=e[s+o];r[o]._custom=q(a[2],this.resolveDataElementOptions(o+s).radius)}return r}parseObjectData(t,e,s,i){const r=super.parseObjectData(t,e,s,i);for(let o=0;o<r.length;o++){const a=e[s+o];r[o]._custom=q(a&&a.r&&+a.r,this.resolveDataElementOptions(o+s).radius)}return r}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let s=t.length-1;s>=0;--s)e=Math.max(e,t[s].size(this.resolveDataElementOptions(s))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:i,yScale:r}=e,o=this.getParsed(t),a=i.getLabelForValue(o.x),l=r.getLabelForValue(o.y),c=o._custom;return{label:s[t]||"",value:"("+a+", "+l+(c?", "+c:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,s,i){const r=i==="reset",{iScale:o,vScale:a}=this._cachedMeta,{sharedOptions:l,includeOptions:c}=this._getSharedOptions(e,i),d=o.axis,h=a.axis;for(let g=e;g<e+s;g++){const m=t[g],y=!r&&this.getParsed(g),_={},w=_[d]=r?o.getPixelForDecimal(.5):o.getPixelForValue(y[d]),A=_[h]=r?a.getBasePixel():a.getPixelForValue(y[h]);_.skip=isNaN(w)||isNaN(A),c&&(_.options=l||this.resolveDataElementOptions(g,m.active?"active":i),r&&(_.options.radius=0)),this.updateElement(m,g,_,i)}}resolveDataElementOptions(t,e){const s=this.getParsed(t);let i=super.resolveDataElementOptions(t,e);i.$shared&&(i=Object.assign({},i,{$shared:!1}));const r=i.radius;return e!=="active"&&(i.radius=0),i.radius+=q(s&&s._custom,r),i}}B(mo,"id","bubble"),B(mo,"defaults",{datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}}),B(mo,"overrides",{scales:{x:{type:"linear"},y:{type:"linear"}}});function P1(n,t,e){let s=1,i=1,r=0,o=0;if(t<ht){const a=n,l=a+t,c=Math.cos(a),d=Math.sin(a),h=Math.cos(l),g=Math.sin(l),m=(D,L,M)=>Yi(D,a,l,!0)?1:Math.max(L,L*e,M,M*e),y=(D,L,M)=>Yi(D,a,l,!0)?-1:Math.min(L,L*e,M,M*e),_=m(0,c,h),w=m(kt,d,g),A=y(st,c,h),P=y(st+kt,d,g);s=(_-A)/2,i=(w-P)/2,r=-(_+A)/2,o=-(w+P)/2}return{ratioX:s,ratioY:i,offsetX:r,offsetY:o}}class Hn extends me{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const s=this.getDataset().data,i=this._cachedMeta;if(this._parsing===!1)i._parsed=s;else{let r=l=>+s[l];if(X(s[t])){const{key:l="value"}=this._parsing;r=c=>+An(s[c],l)}let o,a;for(o=t,a=t+e;o<a;++o)i._parsed[o]=r(o)}}_getRotation(){return ge(this.options.rotation-90)}_getCircumference(){return ge(this.options.circumference)}_getRotationExtents(){let t=ht,e=-ht;for(let s=0;s<this.chart.data.datasets.length;++s)if(this.chart.isDatasetVisible(s)&&this.chart.getDatasetMeta(s).type===this._type){const i=this.chart.getDatasetMeta(s).controller,r=i._getRotation(),o=i._getCircumference();t=Math.min(t,r),e=Math.max(e,r+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:s}=e,i=this._cachedMeta,r=i.data,o=this.getMaxBorderWidth()+this.getMaxOffset(r)+this.options.spacing,a=Math.max((Math.min(s.width,s.height)-o)/2,0),l=Math.min(UT(this.options.cutout,a),1),c=this._getRingWeight(this.index),{circumference:d,rotation:h}=this._getRotationExtents(),{ratioX:g,ratioY:m,offsetX:y,offsetY:_}=P1(h,d,l),w=(s.width-o)/g,A=(s.height-o)/m,P=Math.max(Math.min(w,A)/2,0),D=S0(this.options.radius,P),L=Math.max(D*l,0),M=(D-L)/this._getVisibleDatasetWeightTotal();this.offsetX=y*D,this.offsetY=_*D,i.total=this.calculateTotal(),this.outerRadius=D-M*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-M*c,0),this.updateElements(r,0,r.length,t)}_circumference(t,e){const s=this.options,i=this._cachedMeta,r=this._getCircumference();return e&&s.animation.animateRotate||!this.chart.getDataVisibility(t)||i._parsed[t]===null||i.data[t].hidden?0:this.calculateCircumference(i._parsed[t]*r/ht)}updateElements(t,e,s,i){const r=i==="reset",o=this.chart,a=o.chartArea,c=o.options.animation,d=(a.left+a.right)/2,h=(a.top+a.bottom)/2,g=r&&c.animateScale,m=g?0:this.innerRadius,y=g?0:this.outerRadius,{sharedOptions:_,includeOptions:w}=this._getSharedOptions(e,i);let A=this._getRotation(),P;for(P=0;P<e;++P)A+=this._circumference(P,r);for(P=e;P<e+s;++P){const D=this._circumference(P,r),L=t[P],M={x:d+this.offsetX,y:h+this.offsetY,startAngle:A,endAngle:A+D,circumference:D,outerRadius:y,innerRadius:m};w&&(M.options=_||this.resolveDataElementOptions(P,L.active?"active":i)),A+=D,this.updateElement(L,P,M,i)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let s=0,i;for(i=0;i<e.length;i++){const r=t._parsed[i];r!==null&&!isNaN(r)&&this.chart.getDataVisibility(i)&&!e[i].hidden&&(s+=Math.abs(r))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?ht*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,i=s.data.labels||[],r=br(e._parsed[t],s.options.locale);return{label:i[t]||"",value:r}}getMaxBorderWidth(t){let e=0;const s=this.chart;let i,r,o,a,l;if(!t){for(i=0,r=s.data.datasets.length;i<r;++i)if(s.isDatasetVisible(i)){o=s.getDatasetMeta(i),t=o.data,a=o.controller;break}}if(!t)return 0;for(i=0,r=t.length;i<r;++i)l=a.resolveDataElementOptions(i),l.borderAlign!=="inner"&&(e=Math.max(e,l.borderWidth||0,l.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let s=0,i=t.length;s<i;++s){const r=this.resolveDataElementOptions(s);e=Math.max(e,r.offset||0,r.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let s=0;s<t;++s)this.chart.isDatasetVisible(s)&&(e+=this._getRingWeight(s));return e}_getRingWeight(t){return Math.max(q(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}B(Hn,"id","doughnut"),B(Hn,"defaults",{datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"}),B(Hn,"descriptors",{_scriptable:t=>t!=="spacing",_indexable:t=>t!=="spacing"&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")}),B(Hn,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data,{labels:{pointStyle:s,textAlign:i,color:r,useBorderRadius:o,borderRadius:a}}=t.legend.options;return e.labels.length&&e.datasets.length?e.labels.map((l,c)=>{const h=t.getDatasetMeta(0).controller.getStyle(c);return{text:l,fillStyle:h.backgroundColor,fontColor:r,hidden:!t.getDataVisibility(c),lineDash:h.borderDash,lineDashOffset:h.borderDashOffset,lineJoin:h.borderJoinStyle,lineWidth:h.borderWidth,strokeStyle:h.borderColor,textAlign:i,pointStyle:s,borderRadius:o&&(a||h.borderRadius),index:c}}):[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}}});class yo extends me{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:s,data:i=[],_dataset:r}=e,o=this.chart._animationsDisabled;let{start:a,count:l}=V0(e,i,o);this._drawStart=a,this._drawCount=l,N0(e)&&(a=0,l=i.length),s._chart=this.chart,s._datasetIndex=this.index,s._decimated=!!r._decimated,s.points=i;const c=this.resolveDatasetElementOptions(t);this.options.showLine||(c.borderWidth=0),c.segment=this.options.segment,this.updateElement(s,void 0,{animated:!o,options:c},t),this.updateElements(i,a,l,t)}updateElements(t,e,s,i){const r=i==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:c}=this._cachedMeta,{sharedOptions:d,includeOptions:h}=this._getSharedOptions(e,i),g=o.axis,m=a.axis,{spanGaps:y,segment:_}=this.options,w=Ns(y)?y:Number.POSITIVE_INFINITY,A=this.chart._animationsDisabled||r||i==="none",P=e+s,D=t.length;let L=e>0&&this.getParsed(e-1);for(let M=0;M<D;++M){const V=t[M],k=A?V:{};if(M<e||M>=P){k.skip=!0;continue}const v=this.getParsed(M),x=Y(v[m]),I=k[g]=o.getPixelForValue(v[g],M),T=k[m]=r||x?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,v,l):v[m],M);k.skip=isNaN(I)||isNaN(T)||x,k.stop=M>0&&Math.abs(v[g]-L[g])>w,_&&(k.parsed=v,k.raw=c.data[M]),h&&(k.options=d||this.resolveDataElementOptions(M,V.active?"active":i)),A||this.updateElement(V,M,k,i),L=v}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,s=e.options&&e.options.borderWidth||0,i=t.data||[];if(!i.length)return s;const r=i[0].size(this.resolveDataElementOptions(0)),o=i[i.length-1].size(this.resolveDataElementOptions(i.length-1));return Math.max(s,r,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}B(yo,"id","line"),B(yo,"defaults",{datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1}),B(yo,"overrides",{scales:{_index_:{type:"category"},_value_:{type:"linear"}}});class Vi extends me{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,s=this.chart,i=s.data.labels||[],r=br(e._parsed[t].r,s.options.locale);return{label:i[t]||"",value:r}}parseObjectData(t,e,s,i){return W0.bind(this)(t,e,s,i)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((s,i)=>{const r=this.getParsed(i).r;!isNaN(r)&&this.chart.getDataVisibility(i)&&(r<e.min&&(e.min=r),r>e.max&&(e.max=r))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,s=t.options,i=Math.min(e.right-e.left,e.bottom-e.top),r=Math.max(i/2,0),o=Math.max(s.cutoutPercentage?r/100*s.cutoutPercentage:1,0),a=(r-o)/t.getVisibleDatasetCount();this.outerRadius=r-a*this.index,this.innerRadius=this.outerRadius-a}updateElements(t,e,s,i){const r=i==="reset",o=this.chart,l=o.options.animation,c=this._cachedMeta.rScale,d=c.xCenter,h=c.yCenter,g=c.getIndexAngle(0)-.5*st;let m=g,y;const _=360/this.countVisibleElements();for(y=0;y<e;++y)m+=this._computeAngle(y,i,_);for(y=e;y<e+s;y++){const w=t[y];let A=m,P=m+this._computeAngle(y,i,_),D=o.getDataVisibility(y)?c.getDistanceFromCenterForValue(this.getParsed(y).r):0;m=P,r&&(l.animateScale&&(D=0),l.animateRotate&&(A=P=g));const L={x:d,y:h,innerRadius:0,outerRadius:D,startAngle:A,endAngle:P,options:this.resolveDataElementOptions(y,w.active?"active":i)};this.updateElement(w,y,L,i)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((s,i)=>{!isNaN(this.getParsed(i).r)&&this.chart.getDataVisibility(i)&&e++}),e}_computeAngle(t,e,s){return this.chart.getDataVisibility(t)?ge(this.resolveDataElementOptions(t,e).angle||s):0}}B(Vi,"id","polarArea"),B(Vi,"defaults",{dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0}),B(Vi,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:s,color:i}}=t.legend.options;return e.labels.map((r,o)=>{const l=t.getDatasetMeta(0).controller.getStyle(o);return{text:r,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:i,lineWidth:l.borderWidth,pointStyle:s,hidden:!t.getDataVisibility(o),index:o}})}return[]}},onClick(t,e,s){s.chart.toggleDataVisibility(e.index),s.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}});class lc extends Hn{}B(lc,"id","pie"),B(lc,"defaults",{cutout:0,rotation:0,circumference:360,radius:"100%"});class _o extends me{getLabelAndValue(t){const e=this._cachedMeta.vScale,s=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(s[e.axis])}}parseObjectData(t,e,s,i){return W0.bind(this)(t,e,s,i)}update(t){const e=this._cachedMeta,s=e.dataset,i=e.data||[],r=e.iScale.getLabels();if(s.points=i,t!=="resize"){const o=this.resolveDatasetElementOptions(t);this.options.showLine||(o.borderWidth=0);const a={_loop:!0,_fullLoop:r.length===i.length,options:o};this.updateElement(s,void 0,a,t)}this.updateElements(i,0,i.length,t)}updateElements(t,e,s,i){const r=this._cachedMeta.rScale,o=i==="reset";for(let a=e;a<e+s;a++){const l=t[a],c=this.resolveDataElementOptions(a,l.active?"active":i),d=r.getPointPositionForValue(a,this.getParsed(a).r),h=o?r.xCenter:d.x,g=o?r.yCenter:d.y,m={x:h,y:g,angle:d.angle,skip:isNaN(h)||isNaN(g),options:c};this.updateElement(l,a,m,i)}}}B(_o,"id","radar"),B(_o,"defaults",{datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}}),B(_o,"overrides",{aspectRatio:1,scales:{r:{type:"radialLinear"}}});class bo extends me{getLabelAndValue(t){const e=this._cachedMeta,s=this.chart.data.labels||[],{xScale:i,yScale:r}=e,o=this.getParsed(t),a=i.getLabelForValue(o.x),l=r.getLabelForValue(o.y);return{label:s[t]||"",value:"("+a+", "+l+")"}}update(t){const e=this._cachedMeta,{data:s=[]}=e,i=this.chart._animationsDisabled;let{start:r,count:o}=V0(e,s,i);if(this._drawStart=r,this._drawCount=o,N0(e)&&(r=0,o=s.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:a,_dataset:l}=e;a._chart=this.chart,a._datasetIndex=this.index,a._decimated=!!l._decimated,a.points=s;const c=this.resolveDatasetElementOptions(t);c.segment=this.options.segment,this.updateElement(a,void 0,{animated:!i,options:c},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(s,r,o,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,s,i){const r=i==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:c}=this._cachedMeta,d=this.resolveDataElementOptions(e,i),h=this.getSharedOptions(d),g=this.includeOptions(i,h),m=o.axis,y=a.axis,{spanGaps:_,segment:w}=this.options,A=Ns(_)?_:Number.POSITIVE_INFINITY,P=this.chart._animationsDisabled||r||i==="none";let D=e>0&&this.getParsed(e-1);for(let L=e;L<e+s;++L){const M=t[L],V=this.getParsed(L),k=P?M:{},v=Y(V[y]),x=k[m]=o.getPixelForValue(V[m],L),I=k[y]=r||v?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,V,l):V[y],L);k.skip=isNaN(x)||isNaN(I)||v,k.stop=L>0&&Math.abs(V[m]-D[m])>A,w&&(k.parsed=V,k.raw=c.data[L]),g&&(k.options=h||this.resolveDataElementOptions(L,M.active?"active":i)),P||this.updateElement(M,L,k,i),D=V}this.updateSharedOptions(h,i,d)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let a=0;for(let l=e.length-1;l>=0;--l)a=Math.max(a,e[l].size(this.resolveDataElementOptions(l))/2);return a>0&&a}const s=t.dataset,i=s.options&&s.options.borderWidth||0;if(!e.length)return i;const r=e[0].size(this.resolveDataElementOptions(0)),o=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(i,r,o)/2}}B(bo,"id","scatter"),B(bo,"defaults",{datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1}),B(bo,"overrides",{interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}});var C1=Object.freeze({__proto__:null,BarController:po,BubbleController:mo,DoughnutController:Hn,LineController:yo,PieController:lc,PolarAreaController:Vi,RadarController:_o,ScatterController:bo});function Fn(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class Ju{constructor(t){B(this,"options");this.options=t||{}}static override(t){Object.assign(Ju.prototype,t)}init(){}formats(){return Fn()}parse(){return Fn()}format(){return Fn()}add(){return Fn()}diff(){return Fn()}startOf(){return Fn()}endOf(){return Fn()}}var R1={_date:Ju};function D1(n,t,e,s){const{controller:i,data:r,_sorted:o}=n,a=i._cachedMeta.iScale,l=n.dataset&&n.dataset.options?n.dataset.options.spanGaps:null;if(a&&t===a.axis&&t!=="r"&&o&&r.length){const c=a._reversePixels?tA:He;if(s){if(i._sharedOptions){const d=r[0],h=typeof d.getRange=="function"&&d.getRange(t);if(h){const g=c(r,t,e-h),m=c(r,t,e+h);return{lo:g.lo,hi:m.hi}}}}else{const d=c(r,t,e);if(l){const{vScale:h}=i._cachedMeta,{_parsed:g}=n,m=g.slice(0,d.lo+1).reverse().findIndex(_=>!Y(_[h.axis]));d.lo-=Math.max(0,m);const y=g.slice(d.hi).findIndex(_=>!Y(_[h.axis]));d.hi+=Math.max(0,y)}return d}}return{lo:0,hi:r.length-1}}function Ta(n,t,e,s,i){const r=n.getSortedVisibleDatasetMetas(),o=e[t];for(let a=0,l=r.length;a<l;++a){const{index:c,data:d}=r[a],{lo:h,hi:g}=D1(r[a],t,o,i);for(let m=h;m<=g;++m){const y=d[m];y.skip||s(y,c,m)}}}function M1(n){const t=n.indexOf("x")!==-1,e=n.indexOf("y")!==-1;return function(s,i){const r=t?Math.abs(s.x-i.x):0,o=e?Math.abs(s.y-i.y):0;return Math.sqrt(Math.pow(r,2)+Math.pow(o,2))}}function vl(n,t,e,s,i){const r=[];return!i&&!n.isPointInArea(t)||Ta(n,e,t,function(a,l,c){!i&&!We(a,n.chartArea,0)||a.inRange(t.x,t.y,s)&&r.push({element:a,datasetIndex:l,index:c})},!0),r}function L1(n,t,e,s){let i=[];function r(o,a,l){const{startAngle:c,endAngle:d}=o.getProps(["startAngle","endAngle"],s),{angle:h}=R0(o,{x:t.x,y:t.y});Yi(h,c,d)&&i.push({element:o,datasetIndex:a,index:l})}return Ta(n,e,t,r),i}function O1(n,t,e,s,i,r){let o=[];const a=M1(e);let l=Number.POSITIVE_INFINITY;function c(d,h,g){const m=d.inRange(t.x,t.y,i);if(s&&!m)return;const y=d.getCenterPoint(i);if(!(!!r||n.isPointInArea(y))&&!m)return;const w=a(t,y);w<l?(o=[{element:d,datasetIndex:h,index:g}],l=w):w===l&&o.push({element:d,datasetIndex:h,index:g})}return Ta(n,e,t,c),o}function wl(n,t,e,s,i,r){return!r&&!n.isPointInArea(t)?[]:e==="r"&&!s?L1(n,t,e,i):O1(n,t,e,s,i,r)}function ag(n,t,e,s,i){const r=[],o=e==="x"?"inXRange":"inYRange";let a=!1;return Ta(n,e,t,(l,c,d)=>{l[o]&&l[o](t[e],i)&&(r.push({element:l,datasetIndex:c,index:d}),a=a||l.inRange(t.x,t.y,i))}),s&&!a?[]:r}var V1={modes:{index(n,t,e,s){const i=Un(t,n),r=e.axis||"x",o=e.includeInvisible||!1,a=e.intersect?vl(n,i,r,s,o):wl(n,i,r,!1,s,o),l=[];return a.length?(n.getSortedVisibleDatasetMetas().forEach(c=>{const d=a[0].index,h=c.data[d];h&&!h.skip&&l.push({element:h,datasetIndex:c.index,index:d})}),l):[]},dataset(n,t,e,s){const i=Un(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;let a=e.intersect?vl(n,i,r,s,o):wl(n,i,r,!1,s,o);if(a.length>0){const l=a[0].datasetIndex,c=n.getDatasetMeta(l).data;a=[];for(let d=0;d<c.length;++d)a.push({element:c[d],datasetIndex:l,index:d})}return a},point(n,t,e,s){const i=Un(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return vl(n,i,r,s,o)},nearest(n,t,e,s){const i=Un(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return wl(n,i,r,e.intersect,s,o)},x(n,t,e,s){const i=Un(t,n);return ag(n,i,"x",e.intersect,s)},y(n,t,e,s){const i=Un(t,n);return ag(n,i,"y",e.intersect,s)}}};const ny=["left","top","right","bottom"];function ci(n,t){return n.filter(e=>e.pos===t)}function lg(n,t){return n.filter(e=>ny.indexOf(e.pos)===-1&&e.box.axis===t)}function ui(n,t){return n.sort((e,s)=>{const i=t?s:e,r=t?e:s;return i.weight===r.weight?i.index-r.index:i.weight-r.weight})}function N1(n){const t=[];let e,s,i,r,o,a;for(e=0,s=(n||[]).length;e<s;++e)i=n[e],{position:r,options:{stack:o,stackWeight:a=1}}=i,t.push({index:e,box:i,pos:r,horizontal:i.isHorizontal(),weight:i.weight,stack:o&&r+o,stackWeight:a});return t}function F1(n){const t={};for(const e of n){const{stack:s,pos:i,stackWeight:r}=e;if(!s||!ny.includes(i))continue;const o=t[s]||(t[s]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=r}return t}function B1(n,t){const e=F1(n),{vBoxMaxWidth:s,hBoxMaxHeight:i}=t;let r,o,a;for(r=0,o=n.length;r<o;++r){a=n[r];const{fullSize:l}=a.box,c=e[a.stack],d=c&&a.stackWeight/c.weight;a.horizontal?(a.width=d?d*s:l&&t.availableWidth,a.height=i):(a.width=s,a.height=d?d*i:l&&t.availableHeight)}return e}function j1(n){const t=N1(n),e=ui(t.filter(c=>c.box.fullSize),!0),s=ui(ci(t,"left"),!0),i=ui(ci(t,"right")),r=ui(ci(t,"top"),!0),o=ui(ci(t,"bottom")),a=lg(t,"x"),l=lg(t,"y");return{fullSize:e,leftAndTop:s.concat(r),rightAndBottom:i.concat(l).concat(o).concat(a),chartArea:ci(t,"chartArea"),vertical:s.concat(i).concat(l),horizontal:r.concat(o).concat(a)}}function cg(n,t,e,s){return Math.max(n[e],t[e])+Math.max(n[s],t[s])}function sy(n,t){n.top=Math.max(n.top,t.top),n.left=Math.max(n.left,t.left),n.bottom=Math.max(n.bottom,t.bottom),n.right=Math.max(n.right,t.right)}function U1(n,t,e,s){const{pos:i,box:r}=e,o=n.maxPadding;if(!X(i)){e.size&&(n[i]-=e.size);const h=s[e.stack]||{size:0,count:1};h.size=Math.max(h.size,e.horizontal?r.height:r.width),e.size=h.size/h.count,n[i]+=e.size}r.getPadding&&sy(o,r.getPadding());const a=Math.max(0,t.outerWidth-cg(o,n,"left","right")),l=Math.max(0,t.outerHeight-cg(o,n,"top","bottom")),c=a!==n.w,d=l!==n.h;return n.w=a,n.h=l,e.horizontal?{same:c,other:d}:{same:d,other:c}}function z1(n){const t=n.maxPadding;function e(s){const i=Math.max(t[s]-n[s],0);return n[s]+=i,i}n.y+=e("top"),n.x+=e("left"),e("right"),e("bottom")}function $1(n,t){const e=t.maxPadding;function s(i){const r={left:0,top:0,right:0,bottom:0};return i.forEach(o=>{r[o]=Math.max(t[o],e[o])}),r}return s(n?["left","right"]:["top","bottom"])}function ki(n,t,e,s){const i=[];let r,o,a,l,c,d;for(r=0,o=n.length,c=0;r<o;++r){a=n[r],l=a.box,l.update(a.width||t.w,a.height||t.h,$1(a.horizontal,t));const{same:h,other:g}=U1(t,e,a,s);c|=h&&i.length,d=d||g,l.fullSize||i.push(a)}return c&&ki(i,t,e,s)||d}function Jr(n,t,e,s,i){n.top=e,n.left=t,n.right=t+s,n.bottom=e+i,n.width=s,n.height=i}function ug(n,t,e,s){const i=e.padding;let{x:r,y:o}=t;for(const a of n){const l=a.box,c=s[a.stack]||{placed:0,weight:1},d=a.stackWeight/c.weight||1;if(a.horizontal){const h=t.w*d,g=c.size||l.height;Ki(c.start)&&(o=c.start),l.fullSize?Jr(l,i.left,o,e.outerWidth-i.right-i.left,g):Jr(l,t.left+c.placed,o,h,g),c.start=o,c.placed+=h,o=l.bottom}else{const h=t.h*d,g=c.size||l.width;Ki(c.start)&&(r=c.start),l.fullSize?Jr(l,r,i.top,g,e.outerHeight-i.bottom-i.top):Jr(l,r,t.top+c.placed,g,h),c.start=r,c.placed+=h,r=l.right}}t.x=r,t.y=o}var Gt={addBox(n,t){n.boxes||(n.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},n.boxes.push(t)},removeBox(n,t){const e=n.boxes?n.boxes.indexOf(t):-1;e!==-1&&n.boxes.splice(e,1)},configure(n,t,e){t.fullSize=e.fullSize,t.position=e.position,t.weight=e.weight},update(n,t,e,s){if(!n)return;const i=Yt(n.options.layout.padding),r=Math.max(t-i.width,0),o=Math.max(e-i.height,0),a=j1(n.boxes),l=a.vertical,c=a.horizontal;it(n.boxes,_=>{typeof _.beforeLayout=="function"&&_.beforeLayout()});const d=l.reduce((_,w)=>w.box.options&&w.box.options.display===!1?_:_+1,0)||1,h=Object.freeze({outerWidth:t,outerHeight:e,padding:i,availableWidth:r,availableHeight:o,vBoxMaxWidth:r/2/d,hBoxMaxHeight:o/2}),g=Object.assign({},i);sy(g,Yt(s));const m=Object.assign({maxPadding:g,w:r,h:o,x:i.left,y:i.top},i),y=B1(l.concat(c),h);ki(a.fullSize,m,h,y),ki(l,m,h,y),ki(c,m,h,y)&&ki(l,m,h,y),z1(m),ug(a.leftAndTop,m,h,y),m.x+=m.w,m.y+=m.h,ug(a.rightAndBottom,m,h,y),n.chartArea={left:m.left,top:m.top,right:m.left+m.w,bottom:m.top+m.h,height:m.h,width:m.w},it(a.chartArea,_=>{const w=_.box;Object.assign(w,n.chartArea),w.update(m.w,m.h,{left:0,top:0,right:0,bottom:0})})}};class iy{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,s){}removeEventListener(t,e,s){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,s,i){return e=Math.max(0,e||t.width),s=s||t.height,{width:e,height:Math.max(0,i?Math.floor(e/i):s)}}isAttached(t){return!0}updateConfig(t){}}class H1 extends iy{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const vo="$chartjs",W1={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},dg=n=>n===null||n==="";function q1(n,t){const e=n.style,s=n.getAttribute("height"),i=n.getAttribute("width");if(n[vo]={initial:{height:s,width:i,style:{display:e.display,height:e.height,width:e.width}}},e.display=e.display||"block",e.boxSizing=e.boxSizing||"border-box",dg(i)){const r=Kf(n,"width");r!==void 0&&(n.width=r)}if(dg(s))if(n.style.height==="")n.height=n.width/(t||2);else{const r=Kf(n,"height");r!==void 0&&(n.height=r)}return n}const ry=GA?{passive:!0}:!1;function G1(n,t,e){n&&n.addEventListener(t,e,ry)}function K1(n,t,e){n&&n.canvas&&n.canvas.removeEventListener(t,e,ry)}function Y1(n,t){const e=W1[n.type]||n.type,{x:s,y:i}=Un(n,t);return{type:e,chart:t,native:n,x:s!==void 0?s:null,y:i!==void 0?i:null}}function Qo(n,t){for(const e of n)if(e===t||e.contains(t))return!0}function Q1(n,t,e){const s=n.canvas,i=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||Qo(a.addedNodes,s),o=o&&!Qo(a.removedNodes,s);o&&e()});return i.observe(document,{childList:!0,subtree:!0}),i}function X1(n,t,e){const s=n.canvas,i=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||Qo(a.removedNodes,s),o=o&&!Qo(a.addedNodes,s);o&&e()});return i.observe(document,{childList:!0,subtree:!0}),i}const Xi=new Map;let hg=0;function oy(){const n=window.devicePixelRatio;n!==hg&&(hg=n,Xi.forEach((t,e)=>{e.currentDevicePixelRatio!==n&&t()}))}function J1(n,t){Xi.size||window.addEventListener("resize",oy),Xi.set(n,t)}function Z1(n){Xi.delete(n),Xi.size||window.removeEventListener("resize",oy)}function tS(n,t,e){const s=n.canvas,i=s&&Xu(s);if(!i)return;const r=O0((a,l)=>{const c=i.clientWidth;e(a,l),c<i.clientWidth&&e()},window),o=new ResizeObserver(a=>{const l=a[0],c=l.contentRect.width,d=l.contentRect.height;c===0&&d===0||r(c,d)});return o.observe(i),J1(n,r),o}function xl(n,t,e){e&&e.disconnect(),t==="resize"&&Z1(n)}function eS(n,t,e){const s=n.canvas,i=O0(r=>{n.ctx!==null&&e(Y1(r,n))},n);return G1(s,t,i),i}class nS extends iy{acquireContext(t,e){const s=t&&t.getContext&&t.getContext("2d");return s&&s.canvas===t?(q1(t,e),s):null}releaseContext(t){const e=t.canvas;if(!e[vo])return!1;const s=e[vo].initial;["height","width"].forEach(r=>{const o=s[r];Y(o)?e.removeAttribute(r):e.setAttribute(r,o)});const i=s.style||{};return Object.keys(i).forEach(r=>{e.style[r]=i[r]}),e.width=e.width,delete e[vo],!0}addEventListener(t,e,s){this.removeEventListener(t,e);const i=t.$proxies||(t.$proxies={}),o={attach:Q1,detach:X1,resize:tS}[e]||eS;i[e]=o(t,e,s)}removeEventListener(t,e){const s=t.$proxies||(t.$proxies={}),i=s[e];if(!i)return;({attach:xl,detach:xl,resize:xl}[e]||K1)(t,e,i),s[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,s,i){return qA(t,e,s,i)}isAttached(t){const e=t&&Xu(t);return!!(e&&e.isConnected)}}function sS(n){return!Qu()||typeof OffscreenCanvas<"u"&&n instanceof OffscreenCanvas?H1:nS}class be{constructor(){B(this,"x");B(this,"y");B(this,"active",!1);B(this,"options");B(this,"$animations")}tooltipPosition(t){const{x:e,y:s}=this.getProps(["x","y"],t);return{x:e,y:s}}hasValue(){return Ns(this.x)&&Ns(this.y)}getProps(t,e){const s=this.$animations;if(!e||!s)return this;const i={};return t.forEach(r=>{i[r]=s[r]&&s[r].active()?s[r]._to:this[r]}),i}}B(be,"defaults",{}),B(be,"defaultRoutes");function iS(n,t){const e=n.options.ticks,s=rS(n),i=Math.min(e.maxTicksLimit||s,s),r=e.major.enabled?aS(t):[],o=r.length,a=r[0],l=r[o-1],c=[];if(o>i)return lS(t,c,r,o/i),c;const d=oS(r,t,i);if(o>0){let h,g;const m=o>1?Math.round((l-a)/(o-1)):null;for(Zr(t,c,d,Y(m)?0:a-m,a),h=0,g=o-1;h<g;h++)Zr(t,c,d,r[h],r[h+1]);return Zr(t,c,d,l,Y(m)?t.length:l+m),c}return Zr(t,c,d),c}function rS(n){const t=n.options.offset,e=n._tickSize(),s=n._length/e+(t?0:1),i=n._maxLength/e;return Math.floor(Math.min(s,i))}function oS(n,t,e){const s=cS(n),i=t.length/e;if(!s)return Math.max(i,1);const r=YT(s);for(let o=0,a=r.length-1;o<a;o++){const l=r[o];if(l>i)return l}return Math.max(i,1)}function aS(n){const t=[];let e,s;for(e=0,s=n.length;e<s;e++)n[e].major&&t.push(e);return t}function lS(n,t,e,s){let i=0,r=e[0],o;for(s=Math.ceil(s),o=0;o<n.length;o++)o===r&&(t.push(n[o]),i++,r=e[i*s])}function Zr(n,t,e,s,i){const r=q(s,0),o=Math.min(q(i,n.length),n.length);let a=0,l,c,d;for(e=Math.ceil(e),i&&(l=i-s,e=l/Math.floor(l/e)),d=r;d<0;)a++,d=Math.round(r+a*e);for(c=Math.max(r,0);c<o;c++)c===d&&(t.push(n[c]),a++,d=Math.round(r+a*e))}function cS(n){const t=n.length;let e,s;if(t<2)return!1;for(s=n[0],e=1;e<t;++e)if(n[e]-n[e-1]!==s)return!1;return s}const uS=n=>n==="left"?"right":n==="right"?"left":n,fg=(n,t,e)=>t==="top"||t==="left"?n[t]+e:n[t]-e,gg=(n,t)=>Math.min(t||n,n);function pg(n,t){const e=[],s=n.length/t,i=n.length;let r=0;for(;r<i;r+=s)e.push(n[Math.floor(r)]);return e}function dS(n,t,e){const s=n.ticks.length,i=Math.min(t,s-1),r=n._startPixel,o=n._endPixel,a=1e-6;let l=n.getPixelForTick(i),c;if(!(e&&(s===1?c=Math.max(l-r,o-l):t===0?c=(n.getPixelForTick(1)-l)/2:c=(l-n.getPixelForTick(i-1))/2,l+=i<t?c:-c,l<r-a||l>o+a)))return l}function hS(n,t){it(n,e=>{const s=e.gc,i=s.length/2;let r;if(i>t){for(r=0;r<i;++r)delete e.data[s[r]];s.splice(0,i)}})}function di(n){return n.drawTicks?n.tickLength:0}function mg(n,t){if(!n.display)return 0;const e=St(n.font,t),s=Yt(n.padding);return(ft(n.text)?n.text.length:1)*e.lineHeight+s.height}function fS(n,t){return Rn(n,{scale:t,type:"scale"})}function gS(n,t,e){return Rn(n,{tick:e,index:t,type:"tick"})}function pS(n,t,e){let s=Hu(n);return(e&&t!=="right"||!e&&t==="right")&&(s=uS(s)),s}function mS(n,t,e,s){const{top:i,left:r,bottom:o,right:a,chart:l}=n,{chartArea:c,scales:d}=l;let h=0,g,m,y;const _=o-i,w=a-r;if(n.isHorizontal()){if(m=$t(s,r,a),X(e)){const A=Object.keys(e)[0],P=e[A];y=d[A].getPixelForValue(P)+_-t}else e==="center"?y=(c.bottom+c.top)/2+_-t:y=fg(n,e,t);g=a-r}else{if(X(e)){const A=Object.keys(e)[0],P=e[A];m=d[A].getPixelForValue(P)-w+t}else e==="center"?m=(c.left+c.right)/2-w+t:m=fg(n,e,t);y=$t(s,o,i),h=e==="left"?-kt:kt}return{titleX:m,titleY:y,maxWidth:g,rotation:h}}class rs extends be{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:s,_suggestedMax:i}=this;return t=ie(t,Number.POSITIVE_INFINITY),e=ie(e,Number.NEGATIVE_INFINITY),s=ie(s,Number.POSITIVE_INFINITY),i=ie(i,Number.NEGATIVE_INFINITY),{min:ie(t,s),max:ie(e,i),minDefined:wt(t),maxDefined:wt(e)}}getMinMax(t){let{min:e,max:s,minDefined:i,maxDefined:r}=this.getUserBounds(),o;if(i&&r)return{min:e,max:s};const a=this.getMatchingVisibleMetas();for(let l=0,c=a.length;l<c;++l)o=a[l].controller.getMinMax(this,t),i||(e=Math.min(e,o.min)),r||(s=Math.max(s,o.max));return e=r&&e>s?s:e,s=i&&e>s?e:s,{min:ie(e,ie(s,e)),max:ie(s,ie(e,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){ct(this.options.beforeUpdate,[this])}update(t,e,s){const{beginAtZero:i,grace:r,ticks:o}=this.options,a=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=s=Object.assign({left:0,right:0,top:0,bottom:0},s),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+s.left+s.right:this.height+s.top+s.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=EA(this,r,i),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const l=a<this.ticks.length;this._convertTicksToLabels(l?pg(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||o.source==="auto")&&(this.ticks=iS(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),l&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t=this.options.reverse,e,s;this.isHorizontal()?(e=this.left,s=this.right):(e=this.top,s=this.bottom,t=!t),this._startPixel=e,this._endPixel=s,this._reversePixels=t,this._length=s-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){ct(this.options.afterUpdate,[this])}beforeSetDimensions(){ct(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){ct(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),ct(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){ct(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let s,i,r;for(s=0,i=t.length;s<i;s++)r=t[s],r.label=ct(e.callback,[r.value,s,t],this)}afterTickToLabelConversion(){ct(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){ct(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,s=gg(this.ticks.length,t.ticks.maxTicksLimit),i=e.minRotation||0,r=e.maxRotation;let o=i,a,l,c;if(!this._isVisible()||!e.display||i>=r||s<=1||!this.isHorizontal()){this.labelRotation=i;return}const d=this._getLabelSizes(),h=d.widest.width,g=d.highest.height,m=Rt(this.chart.width-h,0,this.maxWidth);a=t.offset?this.maxWidth/s:m/(s-1),h+6>a&&(a=m/(s-(t.offset?.5:1)),l=this.maxHeight-di(t.grid)-e.padding-mg(t.title,this.chart.options.font),c=Math.sqrt(h*h+g*g),o=zu(Math.min(Math.asin(Rt((d.highest.height+6)/a,-1,1)),Math.asin(Rt(l/c,-1,1))-Math.asin(Rt(g/c,-1,1)))),o=Math.max(i,Math.min(r,o))),this.labelRotation=o}afterCalculateLabelRotation(){ct(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){ct(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:s,title:i,grid:r}}=this,o=this._isVisible(),a=this.isHorizontal();if(o){const l=mg(i,e.options.font);if(a?(t.width=this.maxWidth,t.height=di(r)+l):(t.height=this.maxHeight,t.width=di(r)+l),s.display&&this.ticks.length){const{first:c,last:d,widest:h,highest:g}=this._getLabelSizes(),m=s.padding*2,y=ge(this.labelRotation),_=Math.cos(y),w=Math.sin(y);if(a){const A=s.mirror?0:w*h.width+_*g.height;t.height=Math.min(this.maxHeight,t.height+A+m)}else{const A=s.mirror?0:_*h.width+w*g.height;t.width=Math.min(this.maxWidth,t.width+A+m)}this._calculatePadding(c,d,w,_)}}this._handleMargins(),a?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,s,i){const{ticks:{align:r,padding:o},position:a}=this.options,l=this.labelRotation!==0,c=a!=="top"&&this.axis==="x";if(this.isHorizontal()){const d=this.getPixelForTick(0)-this.left,h=this.right-this.getPixelForTick(this.ticks.length-1);let g=0,m=0;l?c?(g=i*t.width,m=s*e.height):(g=s*t.height,m=i*e.width):r==="start"?m=e.width:r==="end"?g=t.width:r!=="inner"&&(g=t.width/2,m=e.width/2),this.paddingLeft=Math.max((g-d+o)*this.width/(this.width-d),0),this.paddingRight=Math.max((m-h+o)*this.width/(this.width-h),0)}else{let d=e.height/2,h=t.height/2;r==="start"?(d=0,h=t.height):r==="end"&&(d=e.height,h=0),this.paddingTop=d+o,this.paddingBottom=h+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){ct(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return e==="top"||e==="bottom"||t==="x"}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){this.beforeTickToLabelConversion(),this.generateTickLabels(t);let e,s;for(e=0,s=t.length;e<s;e++)Y(t[e].label)&&(t.splice(e,1),s--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let s=this.ticks;e<s.length&&(s=pg(s,e)),this._labelSizes=t=this._computeLabelSizes(s,s.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,s){const{ctx:i,_longestTextCache:r}=this,o=[],a=[],l=Math.floor(e/gg(e,s));let c=0,d=0,h,g,m,y,_,w,A,P,D,L,M;for(h=0;h<e;h+=l){if(y=t[h].label,_=this._resolveTickFontOptions(h),i.font=w=_.string,A=r[w]=r[w]||{data:{},gc:[]},P=_.lineHeight,D=L=0,!Y(y)&&!ft(y))D=Ko(i,A.data,A.gc,D,y),L=P;else if(ft(y))for(g=0,m=y.length;g<m;++g)M=y[g],!Y(M)&&!ft(M)&&(D=Ko(i,A.data,A.gc,D,M),L+=P);o.push(D),a.push(L),c=Math.max(D,c),d=Math.max(L,d)}hS(r,e);const V=o.indexOf(c),k=a.indexOf(d),v=x=>({width:o[x]||0,height:a[x]||0});return{first:v(0),last:v(e-1),widest:v(V),highest:v(k),widths:o,heights:a}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return ZT(this._alignToPixels?Nn(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const s=e[t];return s.$context||(s.$context=gS(this.getContext(),t,s))}return this.$context||(this.$context=fS(this.chart.getContext(),this))}_tickSize(){const t=this.options.ticks,e=ge(this.labelRotation),s=Math.abs(Math.cos(e)),i=Math.abs(Math.sin(e)),r=this._getLabelSizes(),o=t.autoSkipPadding||0,a=r?r.widest.width+o:0,l=r?r.highest.height+o:0;return this.isHorizontal()?l*s>a*i?a/s:l/i:l*i<a*s?l/s:a/i}_isVisible(){const t=this.options.display;return t!=="auto"?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,s=this.chart,i=this.options,{grid:r,position:o,border:a}=i,l=r.offset,c=this.isHorizontal(),h=this.ticks.length+(l?1:0),g=di(r),m=[],y=a.setContext(this.getContext()),_=y.display?y.width:0,w=_/2,A=function(lt){return Nn(s,lt,_)};let P,D,L,M,V,k,v,x,I,T,S,E;if(o==="top")P=A(this.bottom),k=this.bottom-g,x=P-w,T=A(t.top)+w,E=t.bottom;else if(o==="bottom")P=A(this.top),T=t.top,E=A(t.bottom)-w,k=P+w,x=this.top+g;else if(o==="left")P=A(this.right),V=this.right-g,v=P-w,I=A(t.left)+w,S=t.right;else if(o==="right")P=A(this.left),I=t.left,S=A(t.right)-w,V=P+w,v=this.left+g;else if(e==="x"){if(o==="center")P=A((t.top+t.bottom)/2+.5);else if(X(o)){const lt=Object.keys(o)[0],ot=o[lt];P=A(this.chart.scales[lt].getPixelForValue(ot))}T=t.top,E=t.bottom,k=P+w,x=k+g}else if(e==="y"){if(o==="center")P=A((t.left+t.right)/2);else if(X(o)){const lt=Object.keys(o)[0],ot=o[lt];P=A(this.chart.scales[lt].getPixelForValue(ot))}V=P-w,v=V-g,I=t.left,S=t.right}const mt=q(i.ticks.maxTicksLimit,h),Z=Math.max(1,Math.ceil(h/mt));for(D=0;D<h;D+=Z){const lt=this.getContext(D),ot=r.setContext(lt),Dt=a.setContext(lt),Et=ot.lineWidth,Pe=ot.color,os=Dt.dash||[],Qt=Dt.dashOffset,_t=ot.tickWidth,Ce=ot.tickColor,ue=ot.tickBorderDash||[],Re=ot.tickBorderDashOffset;L=dS(this,D,l),L!==void 0&&(M=Nn(s,L,Et),c?V=v=I=S=M:k=x=T=E=M,m.push({tx1:V,ty1:k,tx2:v,ty2:x,x1:I,y1:T,x2:S,y2:E,width:Et,color:Pe,borderDash:os,borderDashOffset:Qt,tickWidth:_t,tickColor:Ce,tickBorderDash:ue,tickBorderDashOffset:Re}))}return this._ticksLength=h,this._borderValue=P,m}_computeLabelItems(t){const e=this.axis,s=this.options,{position:i,ticks:r}=s,o=this.isHorizontal(),a=this.ticks,{align:l,crossAlign:c,padding:d,mirror:h}=r,g=di(s.grid),m=g+d,y=h?-d:m,_=-ge(this.labelRotation),w=[];let A,P,D,L,M,V,k,v,x,I,T,S,E="middle";if(i==="top")V=this.bottom-y,k=this._getXAxisLabelAlignment();else if(i==="bottom")V=this.top+y,k=this._getXAxisLabelAlignment();else if(i==="left"){const Z=this._getYAxisLabelAlignment(g);k=Z.textAlign,M=Z.x}else if(i==="right"){const Z=this._getYAxisLabelAlignment(g);k=Z.textAlign,M=Z.x}else if(e==="x"){if(i==="center")V=(t.top+t.bottom)/2+m;else if(X(i)){const Z=Object.keys(i)[0],lt=i[Z];V=this.chart.scales[Z].getPixelForValue(lt)+m}k=this._getXAxisLabelAlignment()}else if(e==="y"){if(i==="center")M=(t.left+t.right)/2-m;else if(X(i)){const Z=Object.keys(i)[0],lt=i[Z];M=this.chart.scales[Z].getPixelForValue(lt)}k=this._getYAxisLabelAlignment(g).textAlign}e==="y"&&(l==="start"?E="top":l==="end"&&(E="bottom"));const mt=this._getLabelSizes();for(A=0,P=a.length;A<P;++A){D=a[A],L=D.label;const Z=r.setContext(this.getContext(A));v=this.getPixelForTick(A)+r.labelOffset,x=this._resolveTickFontOptions(A),I=x.lineHeight,T=ft(L)?L.length:1;const lt=T/2,ot=Z.color,Dt=Z.textStrokeColor,Et=Z.textStrokeWidth;let Pe=k;o?(M=v,k==="inner"&&(A===P-1?Pe=this.options.reverse?"left":"right":A===0?Pe=this.options.reverse?"right":"left":Pe="center"),i==="top"?c==="near"||_!==0?S=-T*I+I/2:c==="center"?S=-mt.highest.height/2-lt*I+I:S=-mt.highest.height+I/2:c==="near"||_!==0?S=I/2:c==="center"?S=mt.highest.height/2-lt*I:S=mt.highest.height-T*I,h&&(S*=-1),_!==0&&!Z.showLabelBackdrop&&(M+=I/2*Math.sin(_))):(V=v,S=(1-T)*I/2);let os;if(Z.showLabelBackdrop){const Qt=Yt(Z.backdropPadding),_t=mt.heights[A],Ce=mt.widths[A];let ue=S-Qt.top,Re=0-Qt.left;switch(E){case"middle":ue-=_t/2;break;case"bottom":ue-=_t;break}switch(k){case"center":Re-=Ce/2;break;case"right":Re-=Ce;break;case"inner":A===P-1?Re-=Ce:A>0&&(Re-=Ce/2);break}os={left:Re,top:ue,width:Ce+Qt.width,height:_t+Qt.height,color:Z.backdropColor}}w.push({label:L,font:x,textOffset:S,options:{rotation:_,color:ot,strokeColor:Dt,strokeWidth:Et,textAlign:Pe,textBaseline:E,translation:[M,V],backdrop:os}})}return w}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-ge(this.labelRotation))return t==="top"?"left":"right";let i="center";return e.align==="start"?i="left":e.align==="end"?i="right":e.align==="inner"&&(i="inner"),i}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:s,mirror:i,padding:r}}=this.options,o=this._getLabelSizes(),a=t+r,l=o.widest.width;let c,d;return e==="left"?i?(d=this.right+r,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d+=l)):(d=this.right-a,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d=this.left)):e==="right"?i?(d=this.left+r,s==="near"?c="right":s==="center"?(c="center",d-=l/2):(c="left",d-=l)):(d=this.left+a,s==="near"?c="left":s==="center"?(c="center",d+=l/2):(c="right",d=this.right)):c="right",{textAlign:c,x:d}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;if(e==="left"||e==="right")return{top:0,left:this.left,bottom:t.height,right:this.right};if(e==="top"||e==="bottom")return{top:this.top,left:0,bottom:this.bottom,right:t.width}}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:s,top:i,width:r,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(s,i,r,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const i=this.ticks.findIndex(r=>r.value===t);return i>=0?e.setContext(this.getContext(i)).lineWidth:0}drawGrid(t){const e=this.options.grid,s=this.ctx,i=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let r,o;const a=(l,c,d)=>{!d.width||!d.color||(s.save(),s.lineWidth=d.width,s.strokeStyle=d.color,s.setLineDash(d.borderDash||[]),s.lineDashOffset=d.borderDashOffset,s.beginPath(),s.moveTo(l.x,l.y),s.lineTo(c.x,c.y),s.stroke(),s.restore())};if(e.display)for(r=0,o=i.length;r<o;++r){const l=i[r];e.drawOnChartArea&&a({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},l),e.drawTicks&&a({x:l.tx1,y:l.ty1},{x:l.tx2,y:l.ty2},{color:l.tickColor,width:l.tickWidth,borderDash:l.tickBorderDash,borderDashOffset:l.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:s,grid:i}}=this,r=s.setContext(this.getContext()),o=s.display?r.width:0;if(!o)return;const a=i.setContext(this.getContext(0)).lineWidth,l=this._borderValue;let c,d,h,g;this.isHorizontal()?(c=Nn(t,this.left,o)-o/2,d=Nn(t,this.right,a)+a/2,h=g=l):(h=Nn(t,this.top,o)-o/2,g=Nn(t,this.bottom,a)+a/2,c=d=l),e.save(),e.lineWidth=r.width,e.strokeStyle=r.color,e.beginPath(),e.moveTo(c,h),e.lineTo(d,g),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const s=this.ctx,i=this._computeLabelArea();i&&ka(s,i);const r=this.getLabelItems(t);for(const o of r){const a=o.options,l=o.font,c=o.label,d=o.textOffset;Zn(s,c,0,d,l,a)}i&&Ea(s)}drawTitle(){const{ctx:t,options:{position:e,title:s,reverse:i}}=this;if(!s.display)return;const r=St(s.font),o=Yt(s.padding),a=s.align;let l=r.lineHeight/2;e==="bottom"||e==="center"||X(e)?(l+=o.bottom,ft(s.text)&&(l+=r.lineHeight*(s.text.length-1))):l+=o.top;const{titleX:c,titleY:d,maxWidth:h,rotation:g}=mS(this,l,e,a);Zn(t,s.text,0,0,r,{color:s.color,maxWidth:h,rotation:g,textAlign:pS(a,e,i),textBaseline:"middle",translation:[c,d]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,s=q(t.grid&&t.grid.z,-1),i=q(t.border&&t.border.z,0);return!this._isVisible()||this.draw!==rs.prototype.draw?[{z:e,draw:r=>{this.draw(r)}}]:[{z:s,draw:r=>{this.drawBackground(),this.drawGrid(r),this.drawTitle()}},{z:i,draw:()=>{this.drawBorder()}},{z:e,draw:r=>{this.drawLabels(r)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),s=this.axis+"AxisID",i=[];let r,o;for(r=0,o=e.length;r<o;++r){const a=e[r];a[s]===this.id&&(!t||a.type===t)&&i.push(a)}return i}_resolveTickFontOptions(t){const e=this.options.ticks.setContext(this.getContext(t));return St(e.font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class to{constructor(t,e,s){this.type=t,this.scope=e,this.override=s,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let s;bS(e)&&(s=this.register(e));const i=this.items,r=t.id,o=this.scope+"."+r;if(!r)throw new Error("class does not have id: "+t);return r in i||(i[r]=t,yS(t,o,s),this.override&&gt.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,s=t.id,i=this.scope;s in e&&delete e[s],i&&s in gt[i]&&(delete gt[i][s],this.override&&delete Jn[s])}}function yS(n,t,e){const s=Gi(Object.create(null),[e?gt.get(e):{},gt.get(t),n.defaults]);gt.set(t,s),n.defaultRoutes&&_S(t,n.defaultRoutes),n.descriptors&&gt.describe(t,n.descriptors)}function _S(n,t){Object.keys(t).forEach(e=>{const s=e.split("."),i=s.pop(),r=[n].concat(s).join("."),o=t[e].split("."),a=o.pop(),l=o.join(".");gt.route(r,i,l,a)})}function bS(n){return"id"in n&&"defaults"in n}class vS{constructor(){this.controllers=new to(me,"datasets",!0),this.elements=new to(be,"elements"),this.plugins=new to(Object,"plugins"),this.scales=new to(rs,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,s){[...e].forEach(i=>{const r=s||this._getRegistryForType(i);s||r.isForType(i)||r===this.plugins&&i.id?this._exec(t,r,i):it(i,o=>{const a=s||this._getRegistryForType(o);this._exec(t,a,o)})})}_exec(t,e,s){const i=Uu(t);ct(s["before"+i],[],s),e[t](s),ct(s["after"+i],[],s)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const s=this._typedRegistries[e];if(s.isForType(t))return s}return this.plugins}_get(t,e,s){const i=e.get(t);if(i===void 0)throw new Error('"'+t+'" is not a registered '+s+".");return i}}var we=new vS;class wS{constructor(){this._init=void 0}notify(t,e,s,i){if(e==="beforeInit"&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install")),this._init===void 0)return;const r=i?this._descriptors(t).filter(i):this._descriptors(t),o=this._notify(r,t,e,s);return e==="afterDestroy"&&(this._notify(r,t,"stop"),this._notify(this._init,t,"uninstall"),this._init=void 0),o}_notify(t,e,s,i){i=i||{};for(const r of t){const o=r.plugin,a=o[s],l=[e,i,r.options];if(ct(a,l,o)===!1&&i.cancelable)return!1}return!0}invalidate(){Y(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const s=t&&t.config,i=q(s.options&&s.options.plugins,{}),r=xS(s);return i===!1&&!e?[]:ES(t,r,i,e)}_notifyStateChanges(t){const e=this._oldCache||[],s=this._cache,i=(r,o)=>r.filter(a=>!o.some(l=>a.plugin.id===l.plugin.id));this._notify(i(e,s),t,"stop"),this._notify(i(s,e),t,"start")}}function xS(n){const t={},e=[],s=Object.keys(we.plugins.items);for(let r=0;r<s.length;r++)e.push(we.getPlugin(s[r]));const i=n.plugins||[];for(let r=0;r<i.length;r++){const o=i[r];e.indexOf(o)===-1&&(e.push(o),t[o.id]=!0)}return{plugins:e,localIds:t}}function kS(n,t){return!t&&n===!1?null:n===!0?{}:n}function ES(n,{plugins:t,localIds:e},s,i){const r=[],o=n.getContext();for(const a of t){const l=a.id,c=kS(s[l],i);c!==null&&r.push({plugin:a,options:IS(n.config,{plugin:a,local:e[l]},c,o)})}return r}function IS(n,{plugin:t,local:e},s,i){const r=n.pluginScopeKeys(t),o=n.getOptionScopes(s,r);return e&&t.defaults&&o.push(t.defaults),n.createResolver(o,i,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function cc(n,t){const e=gt.datasets[n]||{};return((t.datasets||{})[n]||{}).indexAxis||t.indexAxis||e.indexAxis||"x"}function TS(n,t){let e=n;return n==="_index_"?e=t:n==="_value_"&&(e=t==="x"?"y":"x"),e}function AS(n,t){return n===t?"_index_":"_value_"}function yg(n){if(n==="x"||n==="y"||n==="r")return n}function SS(n){if(n==="top"||n==="bottom")return"x";if(n==="left"||n==="right")return"y"}function uc(n,...t){if(yg(n))return n;for(const e of t){const s=e.axis||SS(e.position)||n.length>1&&yg(n[0].toLowerCase());if(s)return s}throw new Error(`Cannot determine type of '${n}' axis. Please provide 'axis' or 'position' option.`)}function _g(n,t,e){if(e[t+"AxisID"]===n)return{axis:t}}function PS(n,t){if(t.data&&t.data.datasets){const e=t.data.datasets.filter(s=>s.xAxisID===n||s.yAxisID===n);if(e.length)return _g(n,"x",e[0])||_g(n,"y",e[0])}return{}}function CS(n,t){const e=Jn[n.type]||{scales:{}},s=t.scales||{},i=cc(n.type,t),r=Object.create(null);return Object.keys(s).forEach(o=>{const a=s[o];if(!X(a))return console.error(`Invalid scale configuration for scale: ${o}`);if(a._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${o}`);const l=uc(o,a,PS(o,n),gt.scales[a.type]),c=AS(l,i),d=e.scales||{};r[o]=Di(Object.create(null),[{axis:l},a,d[l],d[c]])}),n.data.datasets.forEach(o=>{const a=o.type||n.type,l=o.indexAxis||cc(a,t),d=(Jn[a]||{}).scales||{};Object.keys(d).forEach(h=>{const g=TS(h,l),m=o[g+"AxisID"]||g;r[m]=r[m]||Object.create(null),Di(r[m],[{axis:g},s[m],d[h]])})}),Object.keys(r).forEach(o=>{const a=r[o];Di(a,[gt.scales[a.type],gt.scale])}),r}function ay(n){const t=n.options||(n.options={});t.plugins=q(t.plugins,{}),t.scales=CS(n,t)}function ly(n){return n=n||{},n.datasets=n.datasets||[],n.labels=n.labels||[],n}function RS(n){return n=n||{},n.data=ly(n.data),ay(n),n}const bg=new Map,cy=new Set;function eo(n,t){let e=bg.get(n);return e||(e=t(),bg.set(n,e),cy.add(e)),e}const hi=(n,t,e)=>{const s=An(t,e);s!==void 0&&n.add(s)};class DS{constructor(t){this._config=RS(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=ly(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),ay(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return eo(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return eo(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return eo(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id,s=this.type;return eo(`${s}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const s=this._scopeCache;let i=s.get(t);return(!i||e)&&(i=new Map,s.set(t,i)),i}getOptionScopes(t,e,s){const{options:i,type:r}=this,o=this._cachedScopes(t,s),a=o.get(e);if(a)return a;const l=new Set;e.forEach(d=>{t&&(l.add(t),d.forEach(h=>hi(l,t,h))),d.forEach(h=>hi(l,i,h)),d.forEach(h=>hi(l,Jn[r]||{},h)),d.forEach(h=>hi(l,gt,h)),d.forEach(h=>hi(l,oc,h))});const c=Array.from(l);return c.length===0&&c.push(Object.create(null)),cy.has(e)&&o.set(e,c),c}chartOptionScopes(){const{options:t,type:e}=this;return[t,Jn[e]||{},gt.datasets[e]||{},{type:e},gt,oc]}resolveNamedOptions(t,e,s,i=[""]){const r={$shared:!0},{resolver:o,subPrefixes:a}=vg(this._resolverCache,t,i);let l=o;if(LS(o,e)){r.$shared=!1,s=Sn(s)?s():s;const c=this.createResolver(t,s,a);l=Fs(o,s,c)}for(const c of e)r[c]=l[c];return r}createResolver(t,e,s=[""],i){const{resolver:r}=vg(this._resolverCache,t,s);return X(e)?Fs(r,e,void 0,i):r}}function vg(n,t,e){let s=n.get(t);s||(s=new Map,n.set(t,s));const i=e.join();let r=s.get(i);return r||(r={resolver:Gu(t,e),subPrefixes:e.filter(a=>!a.toLowerCase().includes("hover"))},s.set(i,r)),r}const MS=n=>X(n)&&Object.getOwnPropertyNames(n).some(t=>Sn(n[t]));function LS(n,t){const{isScriptable:e,isIndexable:s}=U0(n);for(const i of t){const r=e(i),o=s(i),a=(o||r)&&n[i];if(r&&(Sn(a)||MS(a))||o&&ft(a))return!0}return!1}var OS="4.5.1";const VS=["top","bottom","left","right","chartArea"];function wg(n,t){return n==="top"||n==="bottom"||VS.indexOf(n)===-1&&t==="x"}function xg(n,t){return function(e,s){return e[n]===s[n]?e[t]-s[t]:e[n]-s[n]}}function kg(n){const t=n.chart,e=t.options.animation;t.notifyPlugins("afterRender"),ct(e&&e.onComplete,[n],t)}function NS(n){const t=n.chart,e=t.options.animation;ct(e&&e.onProgress,[n],t)}function uy(n){return Qu()&&typeof n=="string"?n=document.getElementById(n):n&&n.length&&(n=n[0]),n&&n.canvas&&(n=n.canvas),n}const wo={},Eg=n=>{const t=uy(n);return Object.values(wo).filter(e=>e.canvas===t).pop()};function FS(n,t,e){const s=Object.keys(n);for(const i of s){const r=+i;if(r>=t){const o=n[i];delete n[i],(e>0||r>t)&&(n[r+e]=o)}}}function BS(n,t,e,s){return!e||n.type==="mouseout"?null:s?t:n}class ae{static register(...t){we.add(...t),Ig()}static unregister(...t){we.remove(...t),Ig()}constructor(t,e){const s=this.config=new DS(e),i=uy(t),r=Eg(i);if(r)throw new Error("Canvas is already in use. Chart with ID '"+r.id+"' must be destroyed before the canvas with ID '"+r.canvas.id+"' can be reused.");const o=s.createResolver(s.chartOptionScopes(),this.getContext());this.platform=new(s.platform||sS(i)),this.platform.updateConfig(s);const a=this.platform.acquireContext(i,o.aspectRatio),l=a&&a.canvas,c=l&&l.height,d=l&&l.width;if(this.id=jT(),this.ctx=a,this.canvas=l,this.width=d,this.height=c,this._options=o,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new wS,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=sA(h=>this.update(h),o.resizeDelay||0),this._dataChanges=[],wo[this.id]=this,!a||!l){console.error("Failed to create chart: can't acquire context from the given item");return}Oe.listen(this,"complete",kg),Oe.listen(this,"progress",NS),this._initialize(),this.attached&&this.update()}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:s,height:i,_aspectRatio:r}=this;return Y(t)?e&&r?r:i?s/i:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return we}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():Gf(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return Hf(this.canvas,this.ctx),this}stop(){return Oe.stop(this),this}resize(t,e){Oe.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const s=this.options,i=this.canvas,r=s.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(i,t,e,r),a=s.devicePixelRatio||this.platform.getDevicePixelRatio(),l=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,Gf(this,a,!0)&&(this.notifyPlugins("resize",{size:o}),ct(s.onResize,[this,o],this),this.attached&&this._doResize(l)&&this.render())}ensureScalesHaveIDs(){const e=this.options.scales||{};it(e,(s,i)=>{s.id=i})}buildOrUpdateScales(){const t=this.options,e=t.scales,s=this.scales,i=Object.keys(s).reduce((o,a)=>(o[a]=!1,o),{});let r=[];e&&(r=r.concat(Object.keys(e).map(o=>{const a=e[o],l=uc(o,a),c=l==="r",d=l==="x";return{options:a,dposition:c?"chartArea":d?"bottom":"left",dtype:c?"radialLinear":d?"category":"linear"}}))),it(r,o=>{const a=o.options,l=a.id,c=uc(l,a),d=q(a.type,o.dtype);(a.position===void 0||wg(a.position,c)!==wg(o.dposition))&&(a.position=o.dposition),i[l]=!0;let h=null;if(l in s&&s[l].type===d)h=s[l];else{const g=we.getScale(d);h=new g({id:l,type:d,ctx:this.ctx,chart:this}),s[h.id]=h}h.init(a,t)}),it(i,(o,a)=>{o||delete s[a]}),it(s,o=>{Gt.configure(this,o,o.options),Gt.addBox(this,o)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,s=t.length;if(t.sort((i,r)=>i.index-r.index),s>e){for(let i=e;i<s;++i)this._destroyDatasetMeta(i);t.splice(e,s-e)}this._sortedMetasets=t.slice(0).sort(xg("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((s,i)=>{e.filter(r=>r===s._dataset).length===0&&this._destroyDatasetMeta(i)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let s,i;for(this._removeUnreferencedMetasets(),s=0,i=e.length;s<i;s++){const r=e[s];let o=this.getDatasetMeta(s);const a=r.type||this.config.type;if(o.type&&o.type!==a&&(this._destroyDatasetMeta(s),o=this.getDatasetMeta(s)),o.type=a,o.indexAxis=r.indexAxis||cc(a,this.options),o.order=r.order||0,o.index=s,o.label=""+r.label,o.visible=this.isDatasetVisible(s),o.controller)o.controller.updateIndex(s),o.controller.linkScales();else{const l=we.getController(a),{datasetElementType:c,dataElementType:d}=gt.datasets[a];Object.assign(l,{dataElementType:we.getElement(d),datasetElementType:c&&we.getElement(c)}),o.controller=new l(this,s),t.push(o.controller)}}return this._updateMetasets(),t}_resetElements(){it(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const s=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),i=this._animationsDisabled=!s.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0})===!1)return;const r=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let c=0,d=this.data.datasets.length;c<d;c++){const{controller:h}=this.getDatasetMeta(c),g=!i&&r.indexOf(h)===-1;h.buildOrUpdateElements(g),o=Math.max(+h.getMaxOverflow(),o)}o=this._minPadding=s.layout.autoPadding?o:0,this._updateLayout(o),i||it(r,c=>{c.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(xg("z","_idx"));const{_active:a,_lastEvent:l}=this;l?this._eventHandler(l,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){it(this.scales,t=>{Gt.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),s=new Set(t.events);(!Of(e,s)||!!this._responsiveListeners!==t.responsive)&&(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:s,start:i,count:r}of e){const o=s==="_removeElements"?-r:r;FS(t,i,o)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,s=r=>new Set(t.filter(o=>o[0]===r).map((o,a)=>a+","+o.splice(1).join(","))),i=s(0);for(let r=1;r<e;r++)if(!Of(i,s(r)))return;return Array.from(i).map(r=>r.split(",")).map(r=>({method:r[1],start:+r[2],count:+r[3]}))}_updateLayout(t){if(this.notifyPlugins("beforeLayout",{cancelable:!0})===!1)return;Gt.update(this,this.width,this.height,t);const e=this.chartArea,s=e.width<=0||e.height<=0;this._layers=[],it(this.boxes,i=>{s&&i.position==="chartArea"||(i.configure&&i.configure(),this._layers.push(...i._layers()))},this),this._layers.forEach((i,r)=>{i._idx=r}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})!==!1){for(let e=0,s=this.data.datasets.length;e<s;++e)this.getDatasetMeta(e).controller.configure();for(let e=0,s=this.data.datasets.length;e<s;++e)this._updateDataset(e,Sn(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const s=this.getDatasetMeta(t),i={meta:s,index:t,mode:e,cancelable:!0};this.notifyPlugins("beforeDatasetUpdate",i)!==!1&&(s.controller._update(e),i.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",i))}render(){this.notifyPlugins("beforeRender",{cancelable:!0})!==!1&&(Oe.has(this)?this.attached&&!Oe.running(this)&&Oe.start(this):(this.draw(),kg({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:s,height:i}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(s,i)}if(this.clear(),this.width<=0||this.height<=0||this.notifyPlugins("beforeDraw",{cancelable:!0})===!1)return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,s=[];let i,r;for(i=0,r=e.length;i<r;++i){const o=e[i];(!t||o.visible)&&s.push(o)}return s}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0})===!1)return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,s={meta:t,index:t.index,cancelable:!0},i=J0(this,t);this.notifyPlugins("beforeDatasetDraw",s)!==!1&&(i&&ka(e,i),t.controller.draw(),i&&Ea(e),s.cancelable=!1,this.notifyPlugins("afterDatasetDraw",s))}isPointInArea(t){return We(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,s,i){const r=V1.modes[e];return typeof r=="function"?r(this,t,s,i):[]}getDatasetMeta(t){const e=this.data.datasets[t],s=this._metasets;let i=s.filter(r=>r&&r._dataset===e).pop();return i||(i={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},s.push(i)),i}getContext(){return this.$context||(this.$context=Rn(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const s=this.getDatasetMeta(t);return typeof s.hidden=="boolean"?!s.hidden:!e.hidden}setDatasetVisibility(t,e){const s=this.getDatasetMeta(t);s.hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,s){const i=s?"show":"hide",r=this.getDatasetMeta(t),o=r.controller._resolveAnimations(void 0,i);Ki(e)?(r.data[e].hidden=!s,this.update()):(this.setDatasetVisibility(t,s),o.update(r,{visible:s}),this.update(a=>a.datasetIndex===t?i:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),Oe.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),Hf(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete wo[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,s=(r,o)=>{e.addEventListener(this,r,o),t[r]=o},i=(r,o,a)=>{r.offsetX=o,r.offsetY=a,this._eventHandler(r)};it(this.options.events,r=>s(r,i))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,s=(l,c)=>{e.addEventListener(this,l,c),t[l]=c},i=(l,c)=>{t[l]&&(e.removeEventListener(this,l,c),delete t[l])},r=(l,c)=>{this.canvas&&this.resize(l,c)};let o;const a=()=>{i("attach",a),this.attached=!0,this.resize(),s("resize",r),s("detach",o)};o=()=>{this.attached=!1,i("resize",r),this._stop(),this._resize(0,0),s("attach",a)},e.isAttached(this.canvas)?a():o()}unbindEvents(){it(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},it(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,s){const i=s?"set":"remove";let r,o,a,l;for(e==="dataset"&&(r=this.getDatasetMeta(t[0].datasetIndex),r.controller["_"+i+"DatasetHoverStyle"]()),a=0,l=t.length;a<l;++a){o=t[a];const c=o&&this.getDatasetMeta(o.datasetIndex).controller;c&&c[i+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],s=t.map(({datasetIndex:r,index:o})=>{const a=this.getDatasetMeta(r);if(!a)throw new Error("No dataset found at index "+r);return{datasetIndex:r,element:a.data[o],index:o}});!Wo(s,e)&&(this._active=s,this._lastEvent=null,this._updateHoverStyles(s,e))}notifyPlugins(t,e,s){return this._plugins.notify(this,t,e,s)}isPluginEnabled(t){return this._plugins._cache.filter(e=>e.plugin.id===t).length===1}_updateHoverStyles(t,e,s){const i=this.options.hover,r=(l,c)=>l.filter(d=>!c.some(h=>d.datasetIndex===h.datasetIndex&&d.index===h.index)),o=r(e,t),a=s?t:r(t,e);o.length&&this.updateHoverStyle(o,i.mode,!1),a.length&&i.mode&&this.updateHoverStyle(a,i.mode,!0)}_eventHandler(t,e){const s={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},i=o=>(o.options.events||this.options.events).includes(t.native.type);if(this.notifyPlugins("beforeEvent",s,i)===!1)return;const r=this._handleEvent(t,e,s.inChartArea);return s.cancelable=!1,this.notifyPlugins("afterEvent",s,i),(r||s.changed)&&this.render(),this}_handleEvent(t,e,s){const{_active:i=[],options:r}=this,o=e,a=this._getActiveElements(t,i,s,o),l=qT(t),c=BS(t,this._lastEvent,s,l);s&&(this._lastEvent=null,ct(r.onHover,[t,a,this],this),l&&ct(r.onClick,[t,a,this],this));const d=!Wo(a,i);return(d||e)&&(this._active=a,this._updateHoverStyles(a,i,e)),this._lastEvent=c,d}_getActiveElements(t,e,s,i){if(t.type==="mouseout")return[];if(!s)return e;const r=this.options.hover;return this.getElementsAtEventForMode(t,r.mode,r,i)}}B(ae,"defaults",gt),B(ae,"instances",wo),B(ae,"overrides",Jn),B(ae,"registry",we),B(ae,"version",OS),B(ae,"getChart",Eg);function Ig(){return it(ae.instances,n=>n._plugins.invalidate())}function jS(n,t,e){const{startAngle:s,x:i,y:r,outerRadius:o,innerRadius:a,options:l}=t,{borderWidth:c,borderJoinStyle:d}=l,h=Math.min(c/o,Wt(s-e));if(n.beginPath(),n.arc(i,r,o-c/2,s+h/2,e-h/2),a>0){const g=Math.min(c/a,Wt(s-e));n.arc(i,r,a+c/2,e-g/2,s+g/2,!0)}else{const g=Math.min(c/2,o*Wt(s-e));if(d==="round")n.arc(i,r,g,e-st/2,s+st/2,!0);else if(d==="bevel"){const m=2*g*g,y=-m*Math.cos(e+st/2)+i,_=-m*Math.sin(e+st/2)+r,w=m*Math.cos(s+st/2)+i,A=m*Math.sin(s+st/2)+r;n.lineTo(y,_),n.lineTo(w,A)}}n.closePath(),n.moveTo(0,0),n.rect(0,0,n.canvas.width,n.canvas.height),n.clip("evenodd")}function US(n,t,e){const{startAngle:s,pixelMargin:i,x:r,y:o,outerRadius:a,innerRadius:l}=t;let c=i/a;n.beginPath(),n.arc(r,o,a,s-c,e+c),l>i?(c=i/l,n.arc(r,o,l,e+c,s-c,!0)):n.arc(r,o,i,e+kt,s-kt),n.closePath(),n.clip()}function zS(n){return qu(n,["outerStart","outerEnd","innerStart","innerEnd"])}function $S(n,t,e,s){const i=zS(n.options.borderRadius),r=(e-t)/2,o=Math.min(r,s*t/2),a=l=>{const c=(e-Math.min(r,l))*s/2;return Rt(l,0,Math.min(r,c))};return{outerStart:a(i.outerStart),outerEnd:a(i.outerEnd),innerStart:Rt(i.innerStart,0,o),innerEnd:Rt(i.innerEnd,0,o)}}function fs(n,t,e,s){return{x:e+n*Math.cos(t),y:s+n*Math.sin(t)}}function Xo(n,t,e,s,i,r){const{x:o,y:a,startAngle:l,pixelMargin:c,innerRadius:d}=t,h=Math.max(t.outerRadius+s+e-c,0),g=d>0?d+s+e+c:0;let m=0;const y=i-l;if(s){const Z=d>0?d-s:0,lt=h>0?h-s:0,ot=(Z+lt)/2,Dt=ot!==0?y*ot/(ot+s):y;m=(y-Dt)/2}const _=Math.max(.001,y*h-e/st)/h,w=(y-_)/2,A=l+w+m,P=i-w-m,{outerStart:D,outerEnd:L,innerStart:M,innerEnd:V}=$S(t,g,h,P-A),k=h-D,v=h-L,x=A+D/k,I=P-L/v,T=g+M,S=g+V,E=A+M/T,mt=P-V/S;if(n.beginPath(),r){const Z=(x+I)/2;if(n.arc(o,a,h,x,Z),n.arc(o,a,h,Z,I),L>0){const Et=fs(v,I,o,a);n.arc(Et.x,Et.y,L,I,P+kt)}const lt=fs(S,P,o,a);if(n.lineTo(lt.x,lt.y),V>0){const Et=fs(S,mt,o,a);n.arc(Et.x,Et.y,V,P+kt,mt+Math.PI)}const ot=(P-V/g+(A+M/g))/2;if(n.arc(o,a,g,P-V/g,ot,!0),n.arc(o,a,g,ot,A+M/g,!0),M>0){const Et=fs(T,E,o,a);n.arc(Et.x,Et.y,M,E+Math.PI,A-kt)}const Dt=fs(k,A,o,a);if(n.lineTo(Dt.x,Dt.y),D>0){const Et=fs(k,x,o,a);n.arc(Et.x,Et.y,D,A-kt,x)}}else{n.moveTo(o,a);const Z=Math.cos(x)*h+o,lt=Math.sin(x)*h+a;n.lineTo(Z,lt);const ot=Math.cos(I)*h+o,Dt=Math.sin(I)*h+a;n.lineTo(ot,Dt)}n.closePath()}function HS(n,t,e,s,i){const{fullCircles:r,startAngle:o,circumference:a}=t;let l=t.endAngle;if(r){Xo(n,t,e,s,l,i);for(let c=0;c<r;++c)n.fill();isNaN(a)||(l=o+(a%ht||ht))}return Xo(n,t,e,s,l,i),n.fill(),l}function WS(n,t,e,s,i){const{fullCircles:r,startAngle:o,circumference:a,options:l}=t,{borderWidth:c,borderJoinStyle:d,borderDash:h,borderDashOffset:g,borderRadius:m}=l,y=l.borderAlign==="inner";if(!c)return;n.setLineDash(h||[]),n.lineDashOffset=g,y?(n.lineWidth=c*2,n.lineJoin=d||"round"):(n.lineWidth=c,n.lineJoin=d||"bevel");let _=t.endAngle;if(r){Xo(n,t,e,s,_,i);for(let w=0;w<r;++w)n.stroke();isNaN(a)||(_=o+(a%ht||ht))}y&&US(n,t,_),l.selfJoin&&_-o>=st&&m===0&&d!=="miter"&&jS(n,t,_),r||(Xo(n,t,e,s,_,i),n.stroke())}class Ei extends be{constructor(e){super();B(this,"circumference");B(this,"endAngle");B(this,"fullCircles");B(this,"innerRadius");B(this,"outerRadius");B(this,"pixelMargin");B(this,"startAngle");this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,e&&Object.assign(this,e)}inRange(e,s,i){const r=this.getProps(["x","y"],i),{angle:o,distance:a}=R0(r,{x:e,y:s}),{startAngle:l,endAngle:c,innerRadius:d,outerRadius:h,circumference:g}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],i),m=(this.options.spacing+this.options.borderWidth)/2,y=q(g,c-l),_=Yi(o,l,c)&&l!==c,w=y>=ht||_,A=$e(a,d+m,h+m);return w&&A}getCenterPoint(e){const{x:s,y:i,startAngle:r,endAngle:o,innerRadius:a,outerRadius:l}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],e),{offset:c,spacing:d}=this.options,h=(r+o)/2,g=(a+l+d+c)/2;return{x:s+Math.cos(h)*g,y:i+Math.sin(h)*g}}tooltipPosition(e){return this.getCenterPoint(e)}draw(e){const{options:s,circumference:i}=this,r=(s.offset||0)/4,o=(s.spacing||0)/2,a=s.circular;if(this.pixelMargin=s.borderAlign==="inner"?.33:0,this.fullCircles=i>ht?Math.floor(i/ht):0,i===0||this.innerRadius<0||this.outerRadius<0)return;e.save();const l=(this.startAngle+this.endAngle)/2;e.translate(Math.cos(l)*r,Math.sin(l)*r);const c=1-Math.sin(Math.min(st,i||0)),d=r*c;e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,HS(e,this,d,o,a),WS(e,this,d,o,a),e.restore()}}B(Ei,"id","arc"),B(Ei,"defaults",{borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0,selfJoin:!1}),B(Ei,"defaultRoutes",{backgroundColor:"backgroundColor"}),B(Ei,"descriptors",{_scriptable:!0,_indexable:e=>e!=="borderDash"});function dy(n,t,e=t){n.lineCap=q(e.borderCapStyle,t.borderCapStyle),n.setLineDash(q(e.borderDash,t.borderDash)),n.lineDashOffset=q(e.borderDashOffset,t.borderDashOffset),n.lineJoin=q(e.borderJoinStyle,t.borderJoinStyle),n.lineWidth=q(e.borderWidth,t.borderWidth),n.strokeStyle=q(e.borderColor,t.borderColor)}function qS(n,t,e){n.lineTo(e.x,e.y)}function GS(n){return n.stepped?pA:n.tension||n.cubicInterpolationMode==="monotone"?mA:qS}function hy(n,t,e={}){const s=n.length,{start:i=0,end:r=s-1}=e,{start:o,end:a}=t,l=Math.max(i,o),c=Math.min(r,a),d=i<o&&r<o||i>a&&r>a;return{count:s,start:l,loop:t.loop,ilen:c<l&&!d?s+c-l:c-l}}function KS(n,t,e,s){const{points:i,options:r}=t,{count:o,start:a,loop:l,ilen:c}=hy(i,e,s),d=GS(r);let{move:h=!0,reverse:g}=s||{},m,y,_;for(m=0;m<=c;++m)y=i[(a+(g?c-m:m))%o],!y.skip&&(h?(n.moveTo(y.x,y.y),h=!1):d(n,_,y,g,r.stepped),_=y);return l&&(y=i[(a+(g?c:0))%o],d(n,_,y,g,r.stepped)),!!l}function YS(n,t,e,s){const i=t.points,{count:r,start:o,ilen:a}=hy(i,e,s),{move:l=!0,reverse:c}=s||{};let d=0,h=0,g,m,y,_,w,A;const P=L=>(o+(c?a-L:L))%r,D=()=>{_!==w&&(n.lineTo(d,w),n.lineTo(d,_),n.lineTo(d,A))};for(l&&(m=i[P(0)],n.moveTo(m.x,m.y)),g=0;g<=a;++g){if(m=i[P(g)],m.skip)continue;const L=m.x,M=m.y,V=L|0;V===y?(M<_?_=M:M>w&&(w=M),d=(h*d+L)/++h):(D(),n.lineTo(L,M),y=V,h=0,_=w=M),A=M}D()}function dc(n){const t=n.options,e=t.borderDash&&t.borderDash.length;return!n._decimated&&!n._loop&&!t.tension&&t.cubicInterpolationMode!=="monotone"&&!t.stepped&&!e?YS:KS}function QS(n){return n.stepped?KA:n.tension||n.cubicInterpolationMode==="monotone"?YA:zn}function XS(n,t,e,s){let i=t._path;i||(i=t._path=new Path2D,t.path(i,e,s)&&i.closePath()),dy(n,t.options),n.stroke(i)}function JS(n,t,e,s){const{segments:i,options:r}=t,o=dc(t);for(const a of i)dy(n,r,a.style),n.beginPath(),o(n,t,a,{start:e,end:e+s-1})&&n.closePath(),n.stroke()}const ZS=typeof Path2D=="function";function t2(n,t,e,s){ZS&&!t.options.segment?XS(n,t,e,s):JS(n,t,e,s)}class gn extends be{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const s=this.options;if((s.tension||s.cubicInterpolationMode==="monotone")&&!s.stepped&&!this._pointsUpdated){const i=s.spanGaps?this._loop:this._fullLoop;jA(this._points,s,t,i,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=e1(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,s=t.length;return s&&e[t[s-1].end]}interpolate(t,e){const s=this.options,i=t[e],r=this.points,o=X0(this,{property:e,start:i,end:i});if(!o.length)return;const a=[],l=QS(s);let c,d;for(c=0,d=o.length;c<d;++c){const{start:h,end:g}=o[c],m=r[h],y=r[g];if(m===y){a.push(m);continue}const _=Math.abs((i-m[e])/(y[e]-m[e])),w=l(m,y,_,s.stepped);w[e]=t[e],a.push(w)}return a.length===1?a[0]:a}pathSegment(t,e,s){return dc(this)(t,this,e,s)}path(t,e,s){const i=this.segments,r=dc(this);let o=this._loop;e=e||0,s=s||this.points.length-e;for(const a of i)o&=r(t,this,a,{start:e,end:e+s-1});return!!o}draw(t,e,s,i){const r=this.options||{};(this.points||[]).length&&r.borderWidth&&(t.save(),t2(t,this,s,i),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}B(gn,"id","line"),B(gn,"defaults",{borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0}),B(gn,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"}),B(gn,"descriptors",{_scriptable:!0,_indexable:t=>t!=="borderDash"&&t!=="fill"});function Tg(n,t,e,s){const i=n.options,{[e]:r}=n.getProps([e],s);return Math.abs(t-r)<i.radius+i.hitRadius}class xo extends be{constructor(e){super();B(this,"parsed");B(this,"skip");B(this,"stop");this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,e&&Object.assign(this,e)}inRange(e,s,i){const r=this.options,{x:o,y:a}=this.getProps(["x","y"],i);return Math.pow(e-o,2)+Math.pow(s-a,2)<Math.pow(r.hitRadius+r.radius,2)}inXRange(e,s){return Tg(this,e,"x",s)}inYRange(e,s){return Tg(this,e,"y",s)}getCenterPoint(e){const{x:s,y:i}=this.getProps(["x","y"],e);return{x:s,y:i}}size(e){e=e||this.options||{};let s=e.radius||0;s=Math.max(s,s&&e.hoverRadius||0);const i=s&&e.borderWidth||0;return(s+i)*2}draw(e,s){const i=this.options;this.skip||i.radius<.1||!We(this,s,this.size(i)/2)||(e.strokeStyle=i.borderColor,e.lineWidth=i.borderWidth,e.fillStyle=i.backgroundColor,ac(e,i,this.x,this.y))}getRange(){const e=this.options||{};return e.radius+e.hitRadius}}B(xo,"id","point"),B(xo,"defaults",{borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0}),B(xo,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});function fy(n,t){const{x:e,y:s,base:i,width:r,height:o}=n.getProps(["x","y","base","width","height"],t);let a,l,c,d,h;return n.horizontal?(h=o/2,a=Math.min(e,i),l=Math.max(e,i),c=s-h,d=s+h):(h=r/2,a=e-h,l=e+h,c=Math.min(s,i),d=Math.max(s,i)),{left:a,top:c,right:l,bottom:d}}function pn(n,t,e,s){return n?0:Rt(t,e,s)}function e2(n,t,e){const s=n.options.borderWidth,i=n.borderSkipped,r=j0(s);return{t:pn(i.top,r.top,0,e),r:pn(i.right,r.right,0,t),b:pn(i.bottom,r.bottom,0,e),l:pn(i.left,r.left,0,t)}}function n2(n,t,e){const{enableBorderRadius:s}=n.getProps(["enableBorderRadius"]),i=n.options.borderRadius,r=qn(i),o=Math.min(t,e),a=n.borderSkipped,l=s||X(i);return{topLeft:pn(!l||a.top||a.left,r.topLeft,0,o),topRight:pn(!l||a.top||a.right,r.topRight,0,o),bottomLeft:pn(!l||a.bottom||a.left,r.bottomLeft,0,o),bottomRight:pn(!l||a.bottom||a.right,r.bottomRight,0,o)}}function s2(n){const t=fy(n),e=t.right-t.left,s=t.bottom-t.top,i=e2(n,e/2,s/2),r=n2(n,e/2,s/2);return{outer:{x:t.left,y:t.top,w:e,h:s,radius:r},inner:{x:t.left+i.l,y:t.top+i.t,w:e-i.l-i.r,h:s-i.t-i.b,radius:{topLeft:Math.max(0,r.topLeft-Math.max(i.t,i.l)),topRight:Math.max(0,r.topRight-Math.max(i.t,i.r)),bottomLeft:Math.max(0,r.bottomLeft-Math.max(i.b,i.l)),bottomRight:Math.max(0,r.bottomRight-Math.max(i.b,i.r))}}}}function kl(n,t,e,s){const i=t===null,r=e===null,a=n&&!(i&&r)&&fy(n,s);return a&&(i||$e(t,a.left,a.right))&&(r||$e(e,a.top,a.bottom))}function i2(n){return n.topLeft||n.topRight||n.bottomLeft||n.bottomRight}function r2(n,t){n.rect(t.x,t.y,t.w,t.h)}function El(n,t,e={}){const s=n.x!==e.x?-t:0,i=n.y!==e.y?-t:0,r=(n.x+n.w!==e.x+e.w?t:0)-s,o=(n.y+n.h!==e.y+e.h?t:0)-i;return{x:n.x+s,y:n.y+i,w:n.w+r,h:n.h+o,radius:n.radius}}class ko extends be{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:s,backgroundColor:i}}=this,{inner:r,outer:o}=s2(this),a=i2(o.radius)?Qi:r2;t.save(),(o.w!==r.w||o.h!==r.h)&&(t.beginPath(),a(t,El(o,e,r)),t.clip(),a(t,El(r,-e,o)),t.fillStyle=s,t.fill("evenodd")),t.beginPath(),a(t,El(r,e)),t.fillStyle=i,t.fill(),t.restore()}inRange(t,e,s){return kl(this,t,e,s)}inXRange(t,e){return kl(this,t,null,e)}inYRange(t,e){return kl(this,null,t,e)}getCenterPoint(t){const{x:e,y:s,base:i,horizontal:r}=this.getProps(["x","y","base","horizontal"],t);return{x:r?(e+i)/2:e,y:r?s:(s+i)/2}}getRange(t){return t==="x"?this.width/2:this.height/2}}B(ko,"id","bar"),B(ko,"defaults",{borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0}),B(ko,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});var o2=Object.freeze({__proto__:null,ArcElement:Ei,BarElement:ko,LineElement:gn,PointElement:xo});const hc=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],Ag=hc.map(n=>n.replace("rgb(","rgba(").replace(")",", 0.5)"));function gy(n){return hc[n%hc.length]}function py(n){return Ag[n%Ag.length]}function a2(n,t){return n.borderColor=gy(t),n.backgroundColor=py(t),++t}function l2(n,t){return n.backgroundColor=n.data.map(()=>gy(t++)),t}function c2(n,t){return n.backgroundColor=n.data.map(()=>py(t++)),t}function u2(n){let t=0;return(e,s)=>{const i=n.getDatasetMeta(s).controller;i instanceof Hn?t=l2(e,t):i instanceof Vi?t=c2(e,t):i&&(t=a2(e,t))}}function Sg(n){let t;for(t in n)if(n[t].borderColor||n[t].backgroundColor)return!0;return!1}function d2(n){return n&&(n.borderColor||n.backgroundColor)}function h2(){return gt.borderColor!=="rgba(0,0,0,0.1)"||gt.backgroundColor!=="rgba(0,0,0,0.1)"}var f2={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(n,t,e){if(!e.enabled)return;const{data:{datasets:s},options:i}=n.config,{elements:r}=i,o=Sg(s)||d2(i)||r&&Sg(r)||h2();if(!e.forceOverride&&o)return;const a=u2(n);s.forEach(a)}};function g2(n,t,e,s,i){const r=i.samples||s;if(r>=e)return n.slice(t,t+e);const o=[],a=(e-2)/(r-2);let l=0;const c=t+e-1;let d=t,h,g,m,y,_;for(o[l++]=n[d],h=0;h<r-2;h++){let w=0,A=0,P;const D=Math.floor((h+1)*a)+1+t,L=Math.min(Math.floor((h+2)*a)+1,e)+t,M=L-D;for(P=D;P<L;P++)w+=n[P].x,A+=n[P].y;w/=M,A/=M;const V=Math.floor(h*a)+1+t,k=Math.min(Math.floor((h+1)*a)+1,e)+t,{x:v,y:x}=n[d];for(m=y=-1,P=V;P<k;P++)y=.5*Math.abs((v-w)*(n[P].y-x)-(v-n[P].x)*(A-x)),y>m&&(m=y,g=n[P],_=P);o[l++]=g,d=_}return o[l++]=n[c],o}function p2(n,t,e,s){let i=0,r=0,o,a,l,c,d,h,g,m,y,_;const w=[],A=t+e-1,P=n[t].x,L=n[A].x-P;for(o=t;o<t+e;++o){a=n[o],l=(a.x-P)/L*s,c=a.y;const M=l|0;if(M===d)c<y?(y=c,h=o):c>_&&(_=c,g=o),i=(r*i+a.x)/++r;else{const V=o-1;if(!Y(h)&&!Y(g)){const k=Math.min(h,g),v=Math.max(h,g);k!==m&&k!==V&&w.push({...n[k],x:i}),v!==m&&v!==V&&w.push({...n[v],x:i})}o>0&&V!==m&&w.push(n[V]),w.push(a),d=M,r=0,y=_=c,h=g=m=o}}return w}function my(n){if(n._decimated){const t=n._data;delete n._decimated,delete n._data,Object.defineProperty(n,"data",{configurable:!0,enumerable:!0,writable:!0,value:t})}}function Pg(n){n.data.datasets.forEach(t=>{my(t)})}function m2(n,t){const e=t.length;let s=0,i;const{iScale:r}=n,{min:o,max:a,minDefined:l,maxDefined:c}=r.getUserBounds();return l&&(s=Rt(He(t,r.axis,o).lo,0,e-1)),c?i=Rt(He(t,r.axis,a).hi+1,s,e)-s:i=e-s,{start:s,count:i}}var y2={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(n,t,e)=>{if(!e.enabled){Pg(n);return}const s=n.width;n.data.datasets.forEach((i,r)=>{const{_data:o,indexAxis:a}=i,l=n.getDatasetMeta(r),c=o||i.data;if(xi([a,n.options.indexAxis])==="y"||!l.controller.supportsDecimation)return;const d=n.scales[l.xAxisID];if(d.type!=="linear"&&d.type!=="time"||n.options.parsing)return;let{start:h,count:g}=m2(l,c);const m=e.threshold||4*s;if(g<=m){my(i);return}Y(o)&&(i._data=c,delete i.data,Object.defineProperty(i,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(_){this._data=_}}));let y;switch(e.algorithm){case"lttb":y=g2(c,h,g,s,e);break;case"min-max":y=p2(c,h,g,s);break;default:throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)}i._decimated=y})},destroy(n){Pg(n)}};function _2(n,t,e){const s=n.segments,i=n.points,r=t.points,o=[];for(const a of s){let{start:l,end:c}=a;c=Aa(l,c,i);const d=fc(e,i[l],i[c],a.loop);if(!t.segments){o.push({source:a,target:d,start:i[l],end:i[c]});continue}const h=X0(t,d);for(const g of h){const m=fc(e,r[g.start],r[g.end],g.loop),y=Q0(a,i,m);for(const _ of y)o.push({source:_,target:g,start:{[e]:Cg(d,m,"start",Math.max)},end:{[e]:Cg(d,m,"end",Math.min)}})}}return o}function fc(n,t,e,s){if(s)return;let i=t[n],r=e[n];return n==="angle"&&(i=Wt(i),r=Wt(r)),{property:n,start:i,end:r}}function b2(n,t){const{x:e=null,y:s=null}=n||{},i=t.points,r=[];return t.segments.forEach(({start:o,end:a})=>{a=Aa(o,a,i);const l=i[o],c=i[a];s!==null?(r.push({x:l.x,y:s}),r.push({x:c.x,y:s})):e!==null&&(r.push({x:e,y:l.y}),r.push({x:e,y:c.y}))}),r}function Aa(n,t,e){for(;t>n;t--){const s=e[t];if(!isNaN(s.x)&&!isNaN(s.y))break}return t}function Cg(n,t,e,s){return n&&t?s(n[e],t[e]):n?n[e]:t?t[e]:0}function yy(n,t){let e=[],s=!1;return ft(n)?(s=!0,e=n):e=b2(n,t),e.length?new gn({points:e,options:{tension:0},_loop:s,_fullLoop:s}):null}function Rg(n){return n&&n.fill!==!1}function v2(n,t,e){let i=n[t].fill;const r=[t];let o;if(!e)return i;for(;i!==!1&&r.indexOf(i)===-1;){if(!wt(i))return i;if(o=n[i],!o)return!1;if(o.visible)return i;r.push(i),i=o.fill}return!1}function w2(n,t,e){const s=I2(n);if(X(s))return isNaN(s.value)?!1:s;let i=parseFloat(s);return wt(i)&&Math.floor(i)===i?x2(s[0],t,i,e):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function x2(n,t,e,s){return(n==="-"||n==="+")&&(e=t+e),e===t||e<0||e>=s?!1:e}function k2(n,t){let e=null;return n==="start"?e=t.bottom:n==="end"?e=t.top:X(n)?e=t.getPixelForValue(n.value):t.getBasePixel&&(e=t.getBasePixel()),e}function E2(n,t,e){let s;return n==="start"?s=e:n==="end"?s=t.options.reverse?t.min:t.max:X(n)?s=n.value:s=t.getBaseValue(),s}function I2(n){const t=n.options,e=t.fill;let s=q(e&&e.target,e);return s===void 0&&(s=!!t.backgroundColor),s===!1||s===null?!1:s===!0?"origin":s}function T2(n){const{scale:t,index:e,line:s}=n,i=[],r=s.segments,o=s.points,a=A2(t,e);a.push(yy({x:null,y:t.bottom},s));for(let l=0;l<r.length;l++){const c=r[l];for(let d=c.start;d<=c.end;d++)S2(i,o[d],a)}return new gn({points:i,options:{}})}function A2(n,t){const e=[],s=n.getMatchingVisibleMetas("line");for(let i=0;i<s.length;i++){const r=s[i];if(r.index===t)break;r.hidden||e.unshift(r.dataset)}return e}function S2(n,t,e){const s=[];for(let i=0;i<e.length;i++){const r=e[i],{first:o,last:a,point:l}=P2(r,t,"x");if(!(!l||o&&a)){if(o)s.unshift(l);else if(n.push(l),!a)break}}n.push(...s)}function P2(n,t,e){const s=n.interpolate(t,e);if(!s)return{};const i=s[e],r=n.segments,o=n.points;let a=!1,l=!1;for(let c=0;c<r.length;c++){const d=r[c],h=o[d.start][e],g=o[d.end][e];if($e(i,h,g)){a=i===h,l=i===g;break}}return{first:a,last:l,point:s}}class _y{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,s){const{x:i,y:r,radius:o}=this;return e=e||{start:0,end:ht},t.arc(i,r,o,e.end,e.start,!0),!s.bounds}interpolate(t){const{x:e,y:s,radius:i}=this,r=t.angle;return{x:e+Math.cos(r)*i,y:s+Math.sin(r)*i,angle:r}}}function C2(n){const{chart:t,fill:e,line:s}=n;if(wt(e))return R2(t,e);if(e==="stack")return T2(n);if(e==="shape")return!0;const i=D2(n);return i instanceof _y?i:yy(i,s)}function R2(n,t){const e=n.getDatasetMeta(t);return e&&n.isDatasetVisible(t)?e.dataset:null}function D2(n){return(n.scale||{}).getPointPositionForValue?L2(n):M2(n)}function M2(n){const{scale:t={},fill:e}=n,s=k2(e,t);if(wt(s)){const i=t.isHorizontal();return{x:i?s:null,y:i?null:s}}return null}function L2(n){const{scale:t,fill:e}=n,s=t.options,i=t.getLabels().length,r=s.reverse?t.max:t.min,o=E2(e,t,r),a=[];if(s.grid.circular){const l=t.getPointPositionForValue(0,r);return new _y({x:l.x,y:l.y,radius:t.getDistanceFromCenterForValue(o)})}for(let l=0;l<i;++l)a.push(t.getPointPositionForValue(l,o));return a}function Il(n,t,e){const s=C2(t),{chart:i,index:r,line:o,scale:a,axis:l}=t,c=o.options,d=c.fill,h=c.backgroundColor,{above:g=h,below:m=h}=d||{},y=i.getDatasetMeta(r),_=J0(i,y);s&&o.points.length&&(ka(n,e),O2(n,{line:o,target:s,above:g,below:m,area:e,scale:a,axis:l,clip:_}),Ea(n))}function O2(n,t){const{line:e,target:s,above:i,below:r,area:o,scale:a,clip:l}=t,c=e._loop?"angle":t.axis;n.save();let d=r;r!==i&&(c==="x"?(Dg(n,s,o.top),Tl(n,{line:e,target:s,color:i,scale:a,property:c,clip:l}),n.restore(),n.save(),Dg(n,s,o.bottom)):c==="y"&&(Mg(n,s,o.left),Tl(n,{line:e,target:s,color:r,scale:a,property:c,clip:l}),n.restore(),n.save(),Mg(n,s,o.right),d=i)),Tl(n,{line:e,target:s,color:d,scale:a,property:c,clip:l}),n.restore()}function Dg(n,t,e){const{segments:s,points:i}=t;let r=!0,o=!1;n.beginPath();for(const a of s){const{start:l,end:c}=a,d=i[l],h=i[Aa(l,c,i)];r?(n.moveTo(d.x,d.y),r=!1):(n.lineTo(d.x,e),n.lineTo(d.x,d.y)),o=!!t.pathSegment(n,a,{move:o}),o?n.closePath():n.lineTo(h.x,e)}n.lineTo(t.first().x,e),n.closePath(),n.clip()}function Mg(n,t,e){const{segments:s,points:i}=t;let r=!0,o=!1;n.beginPath();for(const a of s){const{start:l,end:c}=a,d=i[l],h=i[Aa(l,c,i)];r?(n.moveTo(d.x,d.y),r=!1):(n.lineTo(e,d.y),n.lineTo(d.x,d.y)),o=!!t.pathSegment(n,a,{move:o}),o?n.closePath():n.lineTo(e,h.y)}n.lineTo(e,t.first().y),n.closePath(),n.clip()}function Tl(n,t){const{line:e,target:s,property:i,color:r,scale:o,clip:a}=t,l=_2(e,s,i);for(const{source:c,target:d,start:h,end:g}of l){const{style:{backgroundColor:m=r}={}}=c,y=s!==!0;n.save(),n.fillStyle=m,V2(n,o,a,y&&fc(i,h,g)),n.beginPath();const _=!!e.pathSegment(n,c);let w;if(y){_?n.closePath():Lg(n,s,g,i);const A=!!s.pathSegment(n,d,{move:_,reverse:!0});w=_&&A,w||Lg(n,s,h,i)}n.closePath(),n.fill(w?"evenodd":"nonzero"),n.restore()}}function V2(n,t,e,s){const i=t.chart.chartArea,{property:r,start:o,end:a}=s||{};if(r==="x"||r==="y"){let l,c,d,h;r==="x"?(l=o,c=i.top,d=a,h=i.bottom):(l=i.left,c=o,d=i.right,h=a),n.beginPath(),e&&(l=Math.max(l,e.left),d=Math.min(d,e.right),c=Math.max(c,e.top),h=Math.min(h,e.bottom)),n.rect(l,c,d-l,h-c),n.clip()}}function Lg(n,t,e,s){const i=t.interpolate(e,s);i&&n.lineTo(i.x,i.y)}var N2={id:"filler",afterDatasetsUpdate(n,t,e){const s=(n.data.datasets||[]).length,i=[];let r,o,a,l;for(o=0;o<s;++o)r=n.getDatasetMeta(o),a=r.dataset,l=null,a&&a.options&&a instanceof gn&&(l={visible:n.isDatasetVisible(o),index:o,fill:w2(a,o,s),chart:n,axis:r.controller.options.indexAxis,scale:r.vScale,line:a}),r.$filler=l,i.push(l);for(o=0;o<s;++o)l=i[o],!(!l||l.fill===!1)&&(l.fill=v2(i,o,e.propagate))},beforeDraw(n,t,e){const s=e.drawTime==="beforeDraw",i=n.getSortedVisibleDatasetMetas(),r=n.chartArea;for(let o=i.length-1;o>=0;--o){const a=i[o].$filler;a&&(a.line.updateControlPoints(r,a.axis),s&&a.fill&&Il(n.ctx,a,r))}},beforeDatasetsDraw(n,t,e){if(e.drawTime!=="beforeDatasetsDraw")return;const s=n.getSortedVisibleDatasetMetas();for(let i=s.length-1;i>=0;--i){const r=s[i].$filler;Rg(r)&&Il(n.ctx,r,n.chartArea)}},beforeDatasetDraw(n,t,e){const s=t.meta.$filler;!Rg(s)||e.drawTime!=="beforeDatasetDraw"||Il(n.ctx,s,n.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const Og=(n,t)=>{let{boxHeight:e=t,boxWidth:s=t}=n;return n.usePointStyle&&(e=Math.min(e,t),s=n.pointStyleWidth||Math.min(s,t)),{boxWidth:s,boxHeight:e,itemHeight:Math.max(t,e)}},F2=(n,t)=>n!==null&&t!==null&&n.datasetIndex===t.datasetIndex&&n.index===t.index;class Vg extends be{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,s){this.maxWidth=t,this.maxHeight=e,this._margins=s,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=ct(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(s=>t.filter(s,this.chart.data))),t.sort&&(e=e.sort((s,i)=>t.sort(s,i,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display){this.width=this.height=0;return}const s=t.labels,i=St(s.font),r=i.size,o=this._computeTitleHeight(),{boxWidth:a,itemHeight:l}=Og(s,r);let c,d;e.font=i.string,this.isHorizontal()?(c=this.maxWidth,d=this._fitRows(o,r,a,l)+10):(d=this.maxHeight,c=this._fitCols(o,i,a,l)+10),this.width=Math.min(c,t.maxWidth||this.maxWidth),this.height=Math.min(d,t.maxHeight||this.maxHeight)}_fitRows(t,e,s,i){const{ctx:r,maxWidth:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],c=this.lineWidths=[0],d=i+a;let h=t;r.textAlign="left",r.textBaseline="middle";let g=-1,m=-d;return this.legendItems.forEach((y,_)=>{const w=s+e/2+r.measureText(y.text).width;(_===0||c[c.length-1]+w+2*a>o)&&(h+=d,c[c.length-(_>0?0:1)]=0,m+=d,g++),l[_]={left:0,top:m,row:g,width:w,height:i},c[c.length-1]+=w+a}),h}_fitCols(t,e,s,i){const{ctx:r,maxHeight:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],c=this.columnSizes=[],d=o-t;let h=a,g=0,m=0,y=0,_=0;return this.legendItems.forEach((w,A)=>{const{itemWidth:P,itemHeight:D}=B2(s,e,r,w,i);A>0&&m+D+2*a>d&&(h+=g+a,c.push({width:g,height:m}),y+=g+a,_++,g=m=0),l[A]={left:y,top:m,col:_,width:P,height:D},g=Math.max(g,P),m+=D+a}),h+=g,c.push({width:g,height:m}),h}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:s,labels:{padding:i},rtl:r}}=this,o=Es(r,this.left,this.width);if(this.isHorizontal()){let a=0,l=$t(s,this.left+i,this.right-this.lineWidths[a]);for(const c of e)a!==c.row&&(a=c.row,l=$t(s,this.left+i,this.right-this.lineWidths[a])),c.top+=this.top+t+i,c.left=o.leftForLtr(o.x(l),c.width),l+=c.width+i}else{let a=0,l=$t(s,this.top+t+i,this.bottom-this.columnSizes[a].height);for(const c of e)c.col!==a&&(a=c.col,l=$t(s,this.top+t+i,this.bottom-this.columnSizes[a].height)),c.top=l,c.left+=this.left+i,c.left=o.leftForLtr(o.x(c.left),c.width),l+=c.height+i}}isHorizontal(){return this.options.position==="top"||this.options.position==="bottom"}draw(){if(this.options.display){const t=this.ctx;ka(t,this),this._draw(),Ea(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:s,ctx:i}=this,{align:r,labels:o}=t,a=gt.color,l=Es(t.rtl,this.left,this.width),c=St(o.font),{padding:d}=o,h=c.size,g=h/2;let m;this.drawTitle(),i.textAlign=l.textAlign("left"),i.textBaseline="middle",i.lineWidth=.5,i.font=c.string;const{boxWidth:y,boxHeight:_,itemHeight:w}=Og(o,h),A=function(V,k,v){if(isNaN(y)||y<=0||isNaN(_)||_<0)return;i.save();const x=q(v.lineWidth,1);if(i.fillStyle=q(v.fillStyle,a),i.lineCap=q(v.lineCap,"butt"),i.lineDashOffset=q(v.lineDashOffset,0),i.lineJoin=q(v.lineJoin,"miter"),i.lineWidth=x,i.strokeStyle=q(v.strokeStyle,a),i.setLineDash(q(v.lineDash,[])),o.usePointStyle){const I={radius:_*Math.SQRT2/2,pointStyle:v.pointStyle,rotation:v.rotation,borderWidth:x},T=l.xPlus(V,y/2),S=k+g;B0(i,I,T,S,o.pointStyleWidth&&y)}else{const I=k+Math.max((h-_)/2,0),T=l.leftForLtr(V,y),S=qn(v.borderRadius);i.beginPath(),Object.values(S).some(E=>E!==0)?Qi(i,{x:T,y:I,w:y,h:_,radius:S}):i.rect(T,I,y,_),i.fill(),x!==0&&i.stroke()}i.restore()},P=function(V,k,v){Zn(i,v.text,V,k+w/2,c,{strikethrough:v.hidden,textAlign:l.textAlign(v.textAlign)})},D=this.isHorizontal(),L=this._computeTitleHeight();D?m={x:$t(r,this.left+d,this.right-s[0]),y:this.top+d+L,line:0}:m={x:this.left+d,y:$t(r,this.top+L+d,this.bottom-e[0].height),line:0},G0(this.ctx,t.textDirection);const M=w+d;this.legendItems.forEach((V,k)=>{i.strokeStyle=V.fontColor,i.fillStyle=V.fontColor;const v=i.measureText(V.text).width,x=l.textAlign(V.textAlign||(V.textAlign=o.textAlign)),I=y+g+v;let T=m.x,S=m.y;l.setWidth(this.width),D?k>0&&T+I+d>this.right&&(S=m.y+=M,m.line++,T=m.x=$t(r,this.left+d,this.right-s[m.line])):k>0&&S+M>this.bottom&&(T=m.x=T+e[m.line].width+d,m.line++,S=m.y=$t(r,this.top+L+d,this.bottom-e[m.line].height));const E=l.x(T);if(A(E,S,V),T=iA(x,T+y+g,D?T+I:this.right,t.rtl),P(l.x(T),S,V),D)m.x+=I+d;else if(typeof V.text!="string"){const mt=c.lineHeight;m.y+=by(V,mt)+d}else m.y+=M}),K0(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,s=St(e.font),i=Yt(e.padding);if(!e.display)return;const r=Es(t.rtl,this.left,this.width),o=this.ctx,a=e.position,l=s.size/2,c=i.top+l;let d,h=this.left,g=this.width;if(this.isHorizontal())g=Math.max(...this.lineWidths),d=this.top+c,h=$t(t.align,h,this.right-g);else{const y=this.columnSizes.reduce((_,w)=>Math.max(_,w.height),0);d=c+$t(t.align,this.top,this.bottom-y-t.labels.padding-this._computeTitleHeight())}const m=$t(a,h,h+g);o.textAlign=r.textAlign(Hu(a)),o.textBaseline="middle",o.strokeStyle=e.color,o.fillStyle=e.color,o.font=s.string,Zn(o,e.text,m,d,s)}_computeTitleHeight(){const t=this.options.title,e=St(t.font),s=Yt(t.padding);return t.display?e.lineHeight+s.height:0}_getLegendItemAt(t,e){let s,i,r;if($e(t,this.left,this.right)&&$e(e,this.top,this.bottom)){for(r=this.legendHitBoxes,s=0;s<r.length;++s)if(i=r[s],$e(t,i.left,i.left+i.width)&&$e(e,i.top,i.top+i.height))return this.legendItems[s]}return null}handleEvent(t){const e=this.options;if(!z2(t.type,e))return;const s=this._getLegendItemAt(t.x,t.y);if(t.type==="mousemove"||t.type==="mouseout"){const i=this._hoveredItem,r=F2(i,s);i&&!r&&ct(e.onLeave,[t,i,this],this),this._hoveredItem=s,s&&!r&&ct(e.onHover,[t,s,this],this)}else s&&ct(e.onClick,[t,s,this],this)}}function B2(n,t,e,s,i){const r=j2(s,n,t,e),o=U2(i,s,t.lineHeight);return{itemWidth:r,itemHeight:o}}function j2(n,t,e,s){let i=n.text;return i&&typeof i!="string"&&(i=i.reduce((r,o)=>r.length>o.length?r:o)),t+e.size/2+s.measureText(i).width}function U2(n,t,e){let s=n;return typeof t.text!="string"&&(s=by(t,e)),s}function by(n,t){const e=n.text?n.text.length:0;return t*e}function z2(n,t){return!!((n==="mousemove"||n==="mouseout")&&(t.onHover||t.onLeave)||t.onClick&&(n==="click"||n==="mouseup"))}var $2={id:"legend",_element:Vg,start(n,t,e){const s=n.legend=new Vg({ctx:n.ctx,options:e,chart:n});Gt.configure(n,s,e),Gt.addBox(n,s)},stop(n){Gt.removeBox(n,n.legend),delete n.legend},beforeUpdate(n,t,e){const s=n.legend;Gt.configure(n,s,e),s.options=e},afterUpdate(n){const t=n.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(n,t){t.replay||n.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(n,t,e){const s=t.datasetIndex,i=e.chart;i.isDatasetVisible(s)?(i.hide(s),t.hidden=!0):(i.show(s),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:n=>n.chart.options.color,boxWidth:40,padding:10,generateLabels(n){const t=n.data.datasets,{labels:{usePointStyle:e,pointStyle:s,textAlign:i,color:r,useBorderRadius:o,borderRadius:a}}=n.legend.options;return n._getSortedDatasetMetas().map(l=>{const c=l.controller.getStyle(e?0:void 0),d=Yt(c.borderWidth);return{text:t[l.index].label,fillStyle:c.backgroundColor,fontColor:r,hidden:!l.visible,lineCap:c.borderCapStyle,lineDash:c.borderDash,lineDashOffset:c.borderDashOffset,lineJoin:c.borderJoinStyle,lineWidth:(d.width+d.height)/4,strokeStyle:c.borderColor,pointStyle:s||c.pointStyle,rotation:c.rotation,textAlign:i||c.textAlign,borderRadius:o&&(a||c.borderRadius),datasetIndex:l.index}},this)}},title:{color:n=>n.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:n=>!n.startsWith("on"),labels:{_scriptable:n=>!["generateLabels","filter","sort"].includes(n)}}};class Zu extends be{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const s=this.options;if(this.left=0,this.top=0,!s.display){this.width=this.height=this.right=this.bottom=0;return}this.width=this.right=t,this.height=this.bottom=e;const i=ft(s.text)?s.text.length:1;this._padding=Yt(s.padding);const r=i*St(s.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=r:this.width=r}isHorizontal(){const t=this.options.position;return t==="top"||t==="bottom"}_drawArgs(t){const{top:e,left:s,bottom:i,right:r,options:o}=this,a=o.align;let l=0,c,d,h;return this.isHorizontal()?(d=$t(a,s,r),h=e+t,c=r-s):(o.position==="left"?(d=s+t,h=$t(a,i,e),l=st*-.5):(d=r-t,h=$t(a,e,i),l=st*.5),c=i-e),{titleX:d,titleY:h,maxWidth:c,rotation:l}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const s=St(e.font),r=s.lineHeight/2+this._padding.top,{titleX:o,titleY:a,maxWidth:l,rotation:c}=this._drawArgs(r);Zn(t,e.text,0,0,s,{color:e.color,maxWidth:l,rotation:c,textAlign:Hu(e.align),textBaseline:"middle",translation:[o,a]})}}function H2(n,t){const e=new Zu({ctx:n.ctx,options:t,chart:n});Gt.configure(n,e,t),Gt.addBox(n,e),n.titleBlock=e}var W2={id:"title",_element:Zu,start(n,t,e){H2(n,e)},stop(n){const t=n.titleBlock;Gt.removeBox(n,t),delete n.titleBlock},beforeUpdate(n,t,e){const s=n.titleBlock;Gt.configure(n,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const no=new WeakMap;var q2={id:"subtitle",start(n,t,e){const s=new Zu({ctx:n.ctx,options:e,chart:n});Gt.configure(n,s,e),Gt.addBox(n,s),no.set(n,s)},stop(n){Gt.removeBox(n,no.get(n)),no.delete(n)},beforeUpdate(n,t,e){const s=no.get(n);Gt.configure(n,s,e),s.options=e},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Ii={average(n){if(!n.length)return!1;let t,e,s=new Set,i=0,r=0;for(t=0,e=n.length;t<e;++t){const a=n[t].element;if(a&&a.hasValue()){const l=a.tooltipPosition();s.add(l.x),i+=l.y,++r}}return r===0||s.size===0?!1:{x:[...s].reduce((a,l)=>a+l)/s.size,y:i/r}},nearest(n,t){if(!n.length)return!1;let e=t.x,s=t.y,i=Number.POSITIVE_INFINITY,r,o,a;for(r=0,o=n.length;r<o;++r){const l=n[r].element;if(l&&l.hasValue()){const c=l.getCenterPoint(),d=rc(t,c);d<i&&(i=d,a=l)}}if(a){const l=a.tooltipPosition();e=l.x,s=l.y}return{x:e,y:s}}};function ve(n,t){return t&&(ft(t)?Array.prototype.push.apply(n,t):n.push(t)),n}function Ve(n){return(typeof n=="string"||n instanceof String)&&n.indexOf(`
`)>-1?n.split(`
`):n}function G2(n,t){const{element:e,datasetIndex:s,index:i}=t,r=n.getDatasetMeta(s).controller,{label:o,value:a}=r.getLabelAndValue(i);return{chart:n,label:o,parsed:r.getParsed(i),raw:n.data.datasets[s].data[i],formattedValue:a,dataset:r.getDataset(),dataIndex:i,datasetIndex:s,element:e}}function Ng(n,t){const e=n.chart.ctx,{body:s,footer:i,title:r}=n,{boxWidth:o,boxHeight:a}=t,l=St(t.bodyFont),c=St(t.titleFont),d=St(t.footerFont),h=r.length,g=i.length,m=s.length,y=Yt(t.padding);let _=y.height,w=0,A=s.reduce((L,M)=>L+M.before.length+M.lines.length+M.after.length,0);if(A+=n.beforeBody.length+n.afterBody.length,h&&(_+=h*c.lineHeight+(h-1)*t.titleSpacing+t.titleMarginBottom),A){const L=t.displayColors?Math.max(a,l.lineHeight):l.lineHeight;_+=m*L+(A-m)*l.lineHeight+(A-1)*t.bodySpacing}g&&(_+=t.footerMarginTop+g*d.lineHeight+(g-1)*t.footerSpacing);let P=0;const D=function(L){w=Math.max(w,e.measureText(L).width+P)};return e.save(),e.font=c.string,it(n.title,D),e.font=l.string,it(n.beforeBody.concat(n.afterBody),D),P=t.displayColors?o+2+t.boxPadding:0,it(s,L=>{it(L.before,D),it(L.lines,D),it(L.after,D)}),P=0,e.font=d.string,it(n.footer,D),e.restore(),w+=y.width,{width:w,height:_}}function K2(n,t){const{y:e,height:s}=t;return e<s/2?"top":e>n.height-s/2?"bottom":"center"}function Y2(n,t,e,s){const{x:i,width:r}=s,o=e.caretSize+e.caretPadding;if(n==="left"&&i+r+o>t.width||n==="right"&&i-r-o<0)return!0}function Q2(n,t,e,s){const{x:i,width:r}=e,{width:o,chartArea:{left:a,right:l}}=n;let c="center";return s==="center"?c=i<=(a+l)/2?"left":"right":i<=r/2?c="left":i>=o-r/2&&(c="right"),Y2(c,n,t,e)&&(c="center"),c}function Fg(n,t,e){const s=e.yAlign||t.yAlign||K2(n,e);return{xAlign:e.xAlign||t.xAlign||Q2(n,t,e,s),yAlign:s}}function X2(n,t){let{x:e,width:s}=n;return t==="right"?e-=s:t==="center"&&(e-=s/2),e}function J2(n,t,e){let{y:s,height:i}=n;return t==="top"?s+=e:t==="bottom"?s-=i+e:s-=i/2,s}function Bg(n,t,e,s){const{caretSize:i,caretPadding:r,cornerRadius:o}=n,{xAlign:a,yAlign:l}=e,c=i+r,{topLeft:d,topRight:h,bottomLeft:g,bottomRight:m}=qn(o);let y=X2(t,a);const _=J2(t,l,c);return l==="center"?a==="left"?y+=c:a==="right"&&(y-=c):a==="left"?y-=Math.max(d,g)+i:a==="right"&&(y+=Math.max(h,m)+i),{x:Rt(y,0,s.width-t.width),y:Rt(_,0,s.height-t.height)}}function so(n,t,e){const s=Yt(e.padding);return t==="center"?n.x+n.width/2:t==="right"?n.x+n.width-s.right:n.x+s.left}function jg(n){return ve([],Ve(n))}function Z2(n,t,e){return Rn(n,{tooltip:t,tooltipItems:e,type:"tooltip"})}function Ug(n,t){const e=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return e?n.override(e):n}const vy={beforeTitle:Le,title(n){if(n.length>0){const t=n[0],e=t.chart.data.labels,s=e?e.length:0;if(this&&this.options&&this.options.mode==="dataset")return t.dataset.label||"";if(t.label)return t.label;if(s>0&&t.dataIndex<s)return e[t.dataIndex]}return""},afterTitle:Le,beforeBody:Le,beforeLabel:Le,label(n){if(this&&this.options&&this.options.mode==="dataset")return n.label+": "+n.formattedValue||n.formattedValue;let t=n.dataset.label||"";t&&(t+=": ");const e=n.formattedValue;return Y(e)||(t+=e),t},labelColor(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:Le,afterBody:Le,beforeFooter:Le,footer:Le,afterFooter:Le};function te(n,t,e,s){const i=n[t].call(e,s);return typeof i>"u"?vy[t].call(e,s):i}class gc extends be{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,s=this.options.setContext(this.getContext()),i=s.enabled&&e.options.animation&&s.animations,r=new Z0(this.chart,i);return i._cacheable&&(this._cachedAnimations=Object.freeze(r)),r}getContext(){return this.$context||(this.$context=Z2(this.chart.getContext(),this,this._tooltipItems))}getTitle(t,e){const{callbacks:s}=e,i=te(s,"beforeTitle",this,t),r=te(s,"title",this,t),o=te(s,"afterTitle",this,t);let a=[];return a=ve(a,Ve(i)),a=ve(a,Ve(r)),a=ve(a,Ve(o)),a}getBeforeBody(t,e){return jg(te(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:s}=e,i=[];return it(t,r=>{const o={before:[],lines:[],after:[]},a=Ug(s,r);ve(o.before,Ve(te(a,"beforeLabel",this,r))),ve(o.lines,te(a,"label",this,r)),ve(o.after,Ve(te(a,"afterLabel",this,r))),i.push(o)}),i}getAfterBody(t,e){return jg(te(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:s}=e,i=te(s,"beforeFooter",this,t),r=te(s,"footer",this,t),o=te(s,"afterFooter",this,t);let a=[];return a=ve(a,Ve(i)),a=ve(a,Ve(r)),a=ve(a,Ve(o)),a}_createItems(t){const e=this._active,s=this.chart.data,i=[],r=[],o=[];let a=[],l,c;for(l=0,c=e.length;l<c;++l)a.push(G2(this.chart,e[l]));return t.filter&&(a=a.filter((d,h,g)=>t.filter(d,h,g,s))),t.itemSort&&(a=a.sort((d,h)=>t.itemSort(d,h,s))),it(a,d=>{const h=Ug(t.callbacks,d);i.push(te(h,"labelColor",this,d)),r.push(te(h,"labelPointStyle",this,d)),o.push(te(h,"labelTextColor",this,d))}),this.labelColors=i,this.labelPointStyles=r,this.labelTextColors=o,this.dataPoints=a,a}update(t,e){const s=this.options.setContext(this.getContext()),i=this._active;let r,o=[];if(!i.length)this.opacity!==0&&(r={opacity:0});else{const a=Ii[s.position].call(this,i,this._eventPosition);o=this._createItems(s),this.title=this.getTitle(o,s),this.beforeBody=this.getBeforeBody(o,s),this.body=this.getBody(o,s),this.afterBody=this.getAfterBody(o,s),this.footer=this.getFooter(o,s);const l=this._size=Ng(this,s),c=Object.assign({},a,l),d=Fg(this.chart,s,c),h=Bg(s,c,d,this.chart);this.xAlign=d.xAlign,this.yAlign=d.yAlign,r={opacity:1,x:h.x,y:h.y,width:l.width,height:l.height,caretX:a.x,caretY:a.y}}this._tooltipItems=o,this.$context=void 0,r&&this._resolveAnimations().update(this,r),t&&s.external&&s.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,s,i){const r=this.getCaretPosition(t,s,i);e.lineTo(r.x1,r.y1),e.lineTo(r.x2,r.y2),e.lineTo(r.x3,r.y3)}getCaretPosition(t,e,s){const{xAlign:i,yAlign:r}=this,{caretSize:o,cornerRadius:a}=s,{topLeft:l,topRight:c,bottomLeft:d,bottomRight:h}=qn(a),{x:g,y:m}=t,{width:y,height:_}=e;let w,A,P,D,L,M;return r==="center"?(L=m+_/2,i==="left"?(w=g,A=w-o,D=L+o,M=L-o):(w=g+y,A=w+o,D=L-o,M=L+o),P=w):(i==="left"?A=g+Math.max(l,d)+o:i==="right"?A=g+y-Math.max(c,h)-o:A=this.caretX,r==="top"?(D=m,L=D-o,w=A-o,P=A+o):(D=m+_,L=D+o,w=A+o,P=A-o),M=D),{x1:w,x2:A,x3:P,y1:D,y2:L,y3:M}}drawTitle(t,e,s){const i=this.title,r=i.length;let o,a,l;if(r){const c=Es(s.rtl,this.x,this.width);for(t.x=so(this,s.titleAlign,s),e.textAlign=c.textAlign(s.titleAlign),e.textBaseline="middle",o=St(s.titleFont),a=s.titleSpacing,e.fillStyle=s.titleColor,e.font=o.string,l=0;l<r;++l)e.fillText(i[l],c.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+a,l+1===r&&(t.y+=s.titleMarginBottom-a)}}_drawColorBox(t,e,s,i,r){const o=this.labelColors[s],a=this.labelPointStyles[s],{boxHeight:l,boxWidth:c}=r,d=St(r.bodyFont),h=so(this,"left",r),g=i.x(h),m=l<d.lineHeight?(d.lineHeight-l)/2:0,y=e.y+m;if(r.usePointStyle){const _={radius:Math.min(c,l)/2,pointStyle:a.pointStyle,rotation:a.rotation,borderWidth:1},w=i.leftForLtr(g,c)+c/2,A=y+l/2;t.strokeStyle=r.multiKeyBackground,t.fillStyle=r.multiKeyBackground,ac(t,_,w,A),t.strokeStyle=o.borderColor,t.fillStyle=o.backgroundColor,ac(t,_,w,A)}else{t.lineWidth=X(o.borderWidth)?Math.max(...Object.values(o.borderWidth)):o.borderWidth||1,t.strokeStyle=o.borderColor,t.setLineDash(o.borderDash||[]),t.lineDashOffset=o.borderDashOffset||0;const _=i.leftForLtr(g,c),w=i.leftForLtr(i.xPlus(g,1),c-2),A=qn(o.borderRadius);Object.values(A).some(P=>P!==0)?(t.beginPath(),t.fillStyle=r.multiKeyBackground,Qi(t,{x:_,y,w:c,h:l,radius:A}),t.fill(),t.stroke(),t.fillStyle=o.backgroundColor,t.beginPath(),Qi(t,{x:w,y:y+1,w:c-2,h:l-2,radius:A}),t.fill()):(t.fillStyle=r.multiKeyBackground,t.fillRect(_,y,c,l),t.strokeRect(_,y,c,l),t.fillStyle=o.backgroundColor,t.fillRect(w,y+1,c-2,l-2))}t.fillStyle=this.labelTextColors[s]}drawBody(t,e,s){const{body:i}=this,{bodySpacing:r,bodyAlign:o,displayColors:a,boxHeight:l,boxWidth:c,boxPadding:d}=s,h=St(s.bodyFont);let g=h.lineHeight,m=0;const y=Es(s.rtl,this.x,this.width),_=function(v){e.fillText(v,y.x(t.x+m),t.y+g/2),t.y+=g+r},w=y.textAlign(o);let A,P,D,L,M,V,k;for(e.textAlign=o,e.textBaseline="middle",e.font=h.string,t.x=so(this,w,s),e.fillStyle=s.bodyColor,it(this.beforeBody,_),m=a&&w!=="right"?o==="center"?c/2+d:c+2+d:0,L=0,V=i.length;L<V;++L){for(A=i[L],P=this.labelTextColors[L],e.fillStyle=P,it(A.before,_),D=A.lines,a&&D.length&&(this._drawColorBox(e,t,L,y,s),g=Math.max(h.lineHeight,l)),M=0,k=D.length;M<k;++M)_(D[M]),g=h.lineHeight;it(A.after,_)}m=0,g=h.lineHeight,it(this.afterBody,_),t.y-=r}drawFooter(t,e,s){const i=this.footer,r=i.length;let o,a;if(r){const l=Es(s.rtl,this.x,this.width);for(t.x=so(this,s.footerAlign,s),t.y+=s.footerMarginTop,e.textAlign=l.textAlign(s.footerAlign),e.textBaseline="middle",o=St(s.footerFont),e.fillStyle=s.footerColor,e.font=o.string,a=0;a<r;++a)e.fillText(i[a],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+s.footerSpacing}}drawBackground(t,e,s,i){const{xAlign:r,yAlign:o}=this,{x:a,y:l}=t,{width:c,height:d}=s,{topLeft:h,topRight:g,bottomLeft:m,bottomRight:y}=qn(i.cornerRadius);e.fillStyle=i.backgroundColor,e.strokeStyle=i.borderColor,e.lineWidth=i.borderWidth,e.beginPath(),e.moveTo(a+h,l),o==="top"&&this.drawCaret(t,e,s,i),e.lineTo(a+c-g,l),e.quadraticCurveTo(a+c,l,a+c,l+g),o==="center"&&r==="right"&&this.drawCaret(t,e,s,i),e.lineTo(a+c,l+d-y),e.quadraticCurveTo(a+c,l+d,a+c-y,l+d),o==="bottom"&&this.drawCaret(t,e,s,i),e.lineTo(a+m,l+d),e.quadraticCurveTo(a,l+d,a,l+d-m),o==="center"&&r==="left"&&this.drawCaret(t,e,s,i),e.lineTo(a,l+h),e.quadraticCurveTo(a,l,a+h,l),e.closePath(),e.fill(),i.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,s=this.$animations,i=s&&s.x,r=s&&s.y;if(i||r){const o=Ii[t.position].call(this,this._active,this._eventPosition);if(!o)return;const a=this._size=Ng(this,t),l=Object.assign({},o,this._size),c=Fg(e,t,l),d=Bg(t,l,c,e);(i._to!==d.x||r._to!==d.y)&&(this.xAlign=c.xAlign,this.yAlign=c.yAlign,this.width=a.width,this.height=a.height,this.caretX=o.x,this.caretY=o.y,this._resolveAnimations().update(this,d))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let s=this.opacity;if(!s)return;this._updateAnimationTarget(e);const i={width:this.width,height:this.height},r={x:this.x,y:this.y};s=Math.abs(s)<.001?0:s;const o=Yt(e.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&a&&(t.save(),t.globalAlpha=s,this.drawBackground(r,t,i,e),G0(t,e.textDirection),r.y+=o.top,this.drawTitle(r,t,e),this.drawBody(r,t,e),this.drawFooter(r,t,e),K0(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const s=this._active,i=t.map(({datasetIndex:a,index:l})=>{const c=this.chart.getDatasetMeta(a);if(!c)throw new Error("Cannot find a dataset at index "+a);return{datasetIndex:a,element:c.data[l],index:l}}),r=!Wo(s,i),o=this._positionChanged(i,e);(r||o)&&(this._active=i,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,s=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const i=this.options,r=this._active||[],o=this._getActiveElements(t,r,e,s),a=this._positionChanged(o,t),l=e||!Wo(o,r)||a;return l&&(this._active=o,(i.enabled||i.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),l}_getActiveElements(t,e,s,i){const r=this.options;if(t.type==="mouseout")return[];if(!i)return e.filter(a=>this.chart.data.datasets[a.datasetIndex]&&this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index)!==void 0);const o=this.chart.getElementsAtEventForMode(t,r.mode,r,s);return r.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:s,caretY:i,options:r}=this,o=Ii[r.position].call(this,t,e);return o!==!1&&(s!==o.x||i!==o.y)}}B(gc,"positioners",Ii);var tP={id:"tooltip",_element:gc,positioners:Ii,afterInit(n,t,e){e&&(n.tooltip=new gc({chart:n,options:e}))},beforeUpdate(n,t,e){n.tooltip&&n.tooltip.initialize(e)},reset(n,t,e){n.tooltip&&n.tooltip.initialize(e)},afterDraw(n){const t=n.tooltip;if(t&&t._willRender()){const e={tooltip:t};if(n.notifyPlugins("beforeTooltipDraw",{...e,cancelable:!0})===!1)return;t.draw(n.ctx),n.notifyPlugins("afterTooltipDraw",e)}},afterEvent(n,t){if(n.tooltip){const e=t.replay;n.tooltip.handleEvent(t.event,e,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(n,t)=>t.bodyFont.size,boxWidth:(n,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:vy},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:n=>n!=="filter"&&n!=="itemSort"&&n!=="external",_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},eP=Object.freeze({__proto__:null,Colors:f2,Decimation:y2,Filler:N2,Legend:$2,SubTitle:q2,Title:W2,Tooltip:tP});const nP=(n,t,e,s)=>(typeof t=="string"?(e=n.push(t)-1,s.unshift({index:e,label:t})):isNaN(t)&&(e=null),e);function sP(n,t,e,s){const i=n.indexOf(t);if(i===-1)return nP(n,t,e,s);const r=n.lastIndexOf(t);return i!==r?e:i}const iP=(n,t)=>n===null?null:Rt(Math.round(n),0,t);function zg(n){const t=this.getLabels();return n>=0&&n<t.length?t[n]:n}class pc extends rs{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const s=this.getLabels();for(const{index:i,label:r}of e)s[i]===r&&s.splice(i,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(Y(t))return null;const s=this.getLabels();return e=isFinite(e)&&s[e]===t?e:sP(s,t,q(e,t),this._addedLabels),iP(e,s.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:s,max:i}=this.getMinMax(!0);this.options.bounds==="ticks"&&(t||(s=0),e||(i=this.getLabels().length-1)),this.min=s,this.max=i}buildTicks(){const t=this.min,e=this.max,s=this.options.offset,i=[];let r=this.getLabels();r=t===0&&e===r.length-1?r:r.slice(t,e+1),this._valueRange=Math.max(r.length-(s?0:1),1),this._startValue=this.min-(s?.5:0);for(let o=t;o<=e;o++)i.push({value:o});return i}getLabelForValue(t){return zg.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return typeof t!="number"&&(t=this.parse(t)),t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}B(pc,"id","category"),B(pc,"defaults",{ticks:{callback:zg}});function rP(n,t){const e=[],{bounds:i,step:r,min:o,max:a,precision:l,count:c,maxTicks:d,maxDigits:h,includeBounds:g}=n,m=r||1,y=d-1,{min:_,max:w}=t,A=!Y(o),P=!Y(a),D=!Y(c),L=(w-_)/(h+1);let M=Nf((w-_)/y/m)*m,V,k,v,x;if(M<1e-14&&!A&&!P)return[{value:_},{value:w}];x=Math.ceil(w/M)-Math.floor(_/M),x>y&&(M=Nf(x*M/y/m)*m),Y(l)||(V=Math.pow(10,l),M=Math.ceil(M*V)/V),i==="ticks"?(k=Math.floor(_/M)*M,v=Math.ceil(w/M)*M):(k=_,v=w),A&&P&&r&&XT((a-o)/r,M/1e3)?(x=Math.round(Math.min((a-o)/M,d)),M=(a-o)/x,k=o,v=a):D?(k=A?o:k,v=P?a:v,x=c-1,M=(v-k)/x):(x=(v-k)/M,Mi(x,Math.round(x),M/1e3)?x=Math.round(x):x=Math.ceil(x));const I=Math.max(Ff(M),Ff(k));V=Math.pow(10,Y(l)?I:l),k=Math.round(k*V)/V,v=Math.round(v*V)/V;let T=0;for(A&&(g&&k!==o?(e.push({value:o}),k<o&&T++,Mi(Math.round((k+T*M)*V)/V,o,$g(o,L,n))&&T++):k<o&&T++);T<x;++T){const S=Math.round((k+T*M)*V)/V;if(P&&S>a)break;e.push({value:S})}return P&&g&&v!==a?e.length&&Mi(e[e.length-1].value,a,$g(a,L,n))?e[e.length-1].value=a:e.push({value:a}):(!P||v===a)&&e.push({value:v}),e}function $g(n,t,{horizontal:e,minRotation:s}){const i=ge(s),r=(e?Math.sin(i):Math.cos(i))||.001,o=.75*t*(""+n).length;return Math.min(t/r,o)}class Jo extends rs{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return Y(t)||(typeof t=="number"||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:s}=this.getUserBounds();let{min:i,max:r}=this;const o=l=>i=e?i:l,a=l=>r=s?r:l;if(t){const l=Ae(i),c=Ae(r);l<0&&c<0?a(0):l>0&&c>0&&o(0)}if(i===r){let l=r===0?1:Math.abs(r*.05);a(r+l),t||o(i-l)}this.min=i,this.max=r}getTickLimit(){const t=this.options.ticks;let{maxTicksLimit:e,stepSize:s}=t,i;return s?(i=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,i>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${i} ticks. Limiting to 1000.`),i=1e3)):(i=this.computeTickLimit(),e=e||11),e&&(i=Math.min(e,i)),i}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let s=this.getTickLimit();s=Math.max(2,s);const i={maxTicks:s,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:e.includeBounds!==!1},r=this._range||this,o=rP(i,r);return t.bounds==="ticks"&&C0(o,this,"value"),t.reverse?(o.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),o}configure(){const t=this.ticks;let e=this.min,s=this.max;if(super.configure(),this.options.offset&&t.length){const i=(s-e)/Math.max(t.length-1,1)/2;e-=i,s+=i}this._startValue=e,this._endValue=s,this._valueRange=s-e}getLabelForValue(t){return br(t,this.chart.options.locale,this.options.ticks.format)}}class mc extends Jo{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=wt(t)?t:0,this.max=wt(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,s=ge(this.options.ticks.minRotation),i=(t?Math.sin(s):Math.cos(s))||.001,r=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,r.lineHeight/i))}getPixelForValue(t){return t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}B(mc,"id","linear"),B(mc,"defaults",{ticks:{callback:xa.formatters.numeric}});const Ji=n=>Math.floor(hn(n)),Bn=(n,t)=>Math.pow(10,Ji(n)+t);function Hg(n){return n/Math.pow(10,Ji(n))===1}function Wg(n,t,e){const s=Math.pow(10,e),i=Math.floor(n/s);return Math.ceil(t/s)-i}function oP(n,t){const e=t-n;let s=Ji(e);for(;Wg(n,t,s)>10;)s++;for(;Wg(n,t,s)<10;)s--;return Math.min(s,Ji(n))}function aP(n,{min:t,max:e}){t=ie(n.min,t);const s=[],i=Ji(t);let r=oP(t,e),o=r<0?Math.pow(10,Math.abs(r)):1;const a=Math.pow(10,r),l=i>r?Math.pow(10,i):0,c=Math.round((t-l)*o)/o,d=Math.floor((t-l)/a/10)*a*10;let h=Math.floor((c-d)/Math.pow(10,r)),g=ie(n.min,Math.round((l+d+h*Math.pow(10,r))*o)/o);for(;g<e;)s.push({value:g,major:Hg(g),significand:h}),h>=10?h=h<15?15:20:h++,h>=20&&(r++,h=2,o=r>=0?1:o),g=Math.round((l+d+h*Math.pow(10,r))*o)/o;const m=ie(n.max,g);return s.push({value:m,major:Hg(m),significand:h}),s}class yc extends rs{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const s=Jo.prototype.parse.apply(this,[t,e]);if(s===0){this._zero=!0;return}return wt(s)&&s>0?s:null}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=wt(t)?Math.max(0,t):null,this.max=wt(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!wt(this._userMin)&&(this.min=t===Bn(this.min,0)?Bn(this.min,-1):Bn(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let s=this.min,i=this.max;const r=a=>s=t?s:a,o=a=>i=e?i:a;s===i&&(s<=0?(r(1),o(10)):(r(Bn(s,-1)),o(Bn(i,1)))),s<=0&&r(Bn(i,-1)),i<=0&&o(Bn(s,1)),this.min=s,this.max=i}buildTicks(){const t=this.options,e={min:this._userMin,max:this._userMax},s=aP(e,this);return t.bounds==="ticks"&&C0(s,this,"value"),t.reverse?(s.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),s}getLabelForValue(t){return t===void 0?"0":br(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=hn(t),this._valueRange=hn(this.max)-hn(t)}getPixelForValue(t){return(t===void 0||t===0)&&(t=this.min),t===null||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(hn(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}B(yc,"id","logarithmic"),B(yc,"defaults",{ticks:{callback:xa.formatters.logarithmic,major:{enabled:!0}}});function _c(n){const t=n.ticks;if(t.display&&n.display){const e=Yt(t.backdropPadding);return q(t.font&&t.font.size,gt.font.size)+e.height}return 0}function lP(n,t,e){return e=ft(e)?e:[e],{w:gA(n,t.string,e),h:e.length*t.lineHeight}}function qg(n,t,e,s,i){return n===s||n===i?{start:t-e/2,end:t+e/2}:n<s||n>i?{start:t-e,end:t}:{start:t,end:t+e}}function cP(n){const t={l:n.left+n._padding.left,r:n.right-n._padding.right,t:n.top+n._padding.top,b:n.bottom-n._padding.bottom},e=Object.assign({},t),s=[],i=[],r=n._pointLabels.length,o=n.options.pointLabels,a=o.centerPointLabels?st/r:0;for(let l=0;l<r;l++){const c=o.setContext(n.getPointLabelContext(l));i[l]=c.padding;const d=n.getPointPosition(l,n.drawingArea+i[l],a),h=St(c.font),g=lP(n.ctx,h,n._pointLabels[l]);s[l]=g;const m=Wt(n.getIndexAngle(l)+a),y=Math.round(zu(m)),_=qg(y,d.x,g.w,0,180),w=qg(y,d.y,g.h,90,270);uP(e,t,m,_,w)}n.setCenterPoint(t.l-e.l,e.r-t.r,t.t-e.t,e.b-t.b),n._pointLabelItems=fP(n,s,i)}function uP(n,t,e,s,i){const r=Math.abs(Math.sin(e)),o=Math.abs(Math.cos(e));let a=0,l=0;s.start<t.l?(a=(t.l-s.start)/r,n.l=Math.min(n.l,t.l-a)):s.end>t.r&&(a=(s.end-t.r)/r,n.r=Math.max(n.r,t.r+a)),i.start<t.t?(l=(t.t-i.start)/o,n.t=Math.min(n.t,t.t-l)):i.end>t.b&&(l=(i.end-t.b)/o,n.b=Math.max(n.b,t.b+l))}function dP(n,t,e){const s=n.drawingArea,{extra:i,additionalAngle:r,padding:o,size:a}=e,l=n.getPointPosition(t,s+i+o,r),c=Math.round(zu(Wt(l.angle+kt))),d=mP(l.y,a.h,c),h=gP(c),g=pP(l.x,a.w,h);return{visible:!0,x:l.x,y:d,textAlign:h,left:g,top:d,right:g+a.w,bottom:d+a.h}}function hP(n,t){if(!t)return!0;const{left:e,top:s,right:i,bottom:r}=n;return!(We({x:e,y:s},t)||We({x:e,y:r},t)||We({x:i,y:s},t)||We({x:i,y:r},t))}function fP(n,t,e){const s=[],i=n._pointLabels.length,r=n.options,{centerPointLabels:o,display:a}=r.pointLabels,l={extra:_c(r)/2,additionalAngle:o?st/i:0};let c;for(let d=0;d<i;d++){l.padding=e[d],l.size=t[d];const h=dP(n,d,l);s.push(h),a==="auto"&&(h.visible=hP(h,c),h.visible&&(c=h))}return s}function gP(n){return n===0||n===180?"center":n<180?"left":"right"}function pP(n,t,e){return e==="right"?n-=t:e==="center"&&(n-=t/2),n}function mP(n,t,e){return e===90||e===270?n-=t/2:(e>270||e<90)&&(n-=t),n}function yP(n,t,e){const{left:s,top:i,right:r,bottom:o}=e,{backdropColor:a}=t;if(!Y(a)){const l=qn(t.borderRadius),c=Yt(t.backdropPadding);n.fillStyle=a;const d=s-c.left,h=i-c.top,g=r-s+c.width,m=o-i+c.height;Object.values(l).some(y=>y!==0)?(n.beginPath(),Qi(n,{x:d,y:h,w:g,h:m,radius:l}),n.fill()):n.fillRect(d,h,g,m)}}function _P(n,t){const{ctx:e,options:{pointLabels:s}}=n;for(let i=t-1;i>=0;i--){const r=n._pointLabelItems[i];if(!r.visible)continue;const o=s.setContext(n.getPointLabelContext(i));yP(e,o,r);const a=St(o.font),{x:l,y:c,textAlign:d}=r;Zn(e,n._pointLabels[i],l,c+a.lineHeight/2,a,{color:o.color,textAlign:d,textBaseline:"middle"})}}function wy(n,t,e,s){const{ctx:i}=n;if(e)i.arc(n.xCenter,n.yCenter,t,0,ht);else{let r=n.getPointPosition(0,t);i.moveTo(r.x,r.y);for(let o=1;o<s;o++)r=n.getPointPosition(o,t),i.lineTo(r.x,r.y)}}function bP(n,t,e,s,i){const r=n.ctx,o=t.circular,{color:a,lineWidth:l}=t;!o&&!s||!a||!l||e<0||(r.save(),r.strokeStyle=a,r.lineWidth=l,r.setLineDash(i.dash||[]),r.lineDashOffset=i.dashOffset,r.beginPath(),wy(n,e,o,s),r.closePath(),r.stroke(),r.restore())}function vP(n,t,e){return Rn(n,{label:e,index:t,type:"pointLabel"})}class Ti extends Jo{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=Yt(_c(this.options)/2),e=this.width=this.maxWidth-t.width,s=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+s/2+t.top),this.drawingArea=Math.floor(Math.min(e,s)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=wt(t)&&!isNaN(t)?t:0,this.max=wt(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/_c(this.options))}generateTickLabels(t){Jo.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((e,s)=>{const i=ct(this.options.pointLabels.callback,[e,s],this);return i||i===0?i:""}).filter((e,s)=>this.chart.getDataVisibility(s))}fit(){const t=this.options;t.display&&t.pointLabels.display?cP(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,s,i){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((s-i)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,s,i))}getIndexAngle(t){const e=ht/(this._pointLabels.length||1),s=this.options.startAngle||0;return Wt(t*e+ge(s))}getDistanceFromCenterForValue(t){if(Y(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(Y(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const s=e[t];return vP(this.getContext(),t,s)}}getPointPosition(t,e,s=0){const i=this.getIndexAngle(t)-kt+s;return{x:Math.cos(i)*e+this.xCenter,y:Math.sin(i)*e+this.yCenter,angle:i}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:s,right:i,bottom:r}=this._pointLabelItems[t];return{left:e,top:s,right:i,bottom:r}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const s=this.ctx;s.save(),s.beginPath(),wy(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),s.closePath(),s.fillStyle=t,s.fill(),s.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:s,grid:i,border:r}=e,o=this._pointLabels.length;let a,l,c;if(e.pointLabels.display&&_P(this,o),i.display&&this.ticks.forEach((d,h)=>{if(h!==0||h===0&&this.min<0){l=this.getDistanceFromCenterForValue(d.value);const g=this.getContext(h),m=i.setContext(g),y=r.setContext(g);bP(this,m,l,o,y)}}),s.display){for(t.save(),a=o-1;a>=0;a--){const d=s.setContext(this.getPointLabelContext(a)),{color:h,lineWidth:g}=d;!g||!h||(t.lineWidth=g,t.strokeStyle=h,t.setLineDash(d.borderDash),t.lineDashOffset=d.borderDashOffset,l=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),c=this.getPointPosition(a,l),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(c.x,c.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,s=e.ticks;if(!s.display)return;const i=this.getIndexAngle(0);let r,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(i),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((a,l)=>{if(l===0&&this.min>=0&&!e.reverse)return;const c=s.setContext(this.getContext(l)),d=St(c.font);if(r=this.getDistanceFromCenterForValue(this.ticks[l].value),c.showLabelBackdrop){t.font=d.string,o=t.measureText(a.label).width,t.fillStyle=c.backdropColor;const h=Yt(c.backdropPadding);t.fillRect(-o/2-h.left,-r-d.size/2-h.top,o+h.width,d.size+h.height)}Zn(t,a.label,0,-r,d,{color:c.color,strokeColor:c.textStrokeColor,strokeWidth:c.textStrokeWidth})}),t.restore()}drawTitle(){}}B(Ti,"id","radialLinear"),B(Ti,"defaults",{display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:xa.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback(t){return t},padding:5,centerPointLabels:!1}}),B(Ti,"defaultRoutes",{"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"}),B(Ti,"descriptors",{angleLines:{_fallback:"grid"}});const Sa={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},ne=Object.keys(Sa);function Gg(n,t){return n-t}function Kg(n,t){if(Y(t))return null;const e=n._adapter,{parser:s,round:i,isoWeekday:r}=n._parseOpts;let o=t;return typeof s=="function"&&(o=s(o)),wt(o)||(o=typeof s=="string"?e.parse(o,s):e.parse(o)),o===null?null:(i&&(o=i==="week"&&(Ns(r)||r===!0)?e.startOf(o,"isoWeek",r):e.startOf(o,i)),+o)}function Yg(n,t,e,s){const i=ne.length;for(let r=ne.indexOf(n);r<i-1;++r){const o=Sa[ne[r]],a=o.steps?o.steps:Number.MAX_SAFE_INTEGER;if(o.common&&Math.ceil((e-t)/(a*o.size))<=s)return ne[r]}return ne[i-1]}function wP(n,t,e,s,i){for(let r=ne.length-1;r>=ne.indexOf(e);r--){const o=ne[r];if(Sa[o].common&&n._adapter.diff(i,s,o)>=t-1)return o}return ne[e?ne.indexOf(e):0]}function xP(n){for(let t=ne.indexOf(n)+1,e=ne.length;t<e;++t)if(Sa[ne[t]].common)return ne[t]}function Qg(n,t,e){if(!e)n[t]=!0;else if(e.length){const{lo:s,hi:i}=$u(e,t),r=e[s]>=t?e[s]:e[i];n[r]=!0}}function kP(n,t,e,s){const i=n._adapter,r=+i.startOf(t[0].value,s),o=t[t.length-1].value;let a,l;for(a=r;a<=o;a=+i.add(a,1,s))l=e[a],l>=0&&(t[l].major=!0);return t}function Xg(n,t,e){const s=[],i={},r=t.length;let o,a;for(o=0;o<r;++o)a=t[o],i[a]=o,s.push({value:a,major:!1});return r===0||!e?s:kP(n,s,i,e)}class Zi extends rs{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const s=t.time||(t.time={}),i=this._adapter=new R1._date(t.adapters.date);i.init(e),Di(s.displayFormats,i.formats()),this._parseOpts={parser:s.parser,round:s.round,isoWeekday:s.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return t===void 0?null:Kg(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,s=t.time.unit||"day";let{min:i,max:r,minDefined:o,maxDefined:a}=this.getUserBounds();function l(c){!o&&!isNaN(c.min)&&(i=Math.min(i,c.min)),!a&&!isNaN(c.max)&&(r=Math.max(r,c.max))}(!o||!a)&&(l(this._getLabelBounds()),(t.bounds!=="ticks"||t.ticks.source!=="labels")&&l(this.getMinMax(!1))),i=wt(i)&&!isNaN(i)?i:+e.startOf(Date.now(),s),r=wt(r)&&!isNaN(r)?r:+e.endOf(Date.now(),s)+1,this.min=Math.min(i,r-1),this.max=Math.max(i+1,r)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],s=t[t.length-1]),{min:e,max:s}}buildTicks(){const t=this.options,e=t.time,s=t.ticks,i=s.source==="labels"?this.getLabelTimestamps():this._generate();t.bounds==="ticks"&&i.length&&(this.min=this._userMin||i[0],this.max=this._userMax||i[i.length-1]);const r=this.min,o=this.max,a=eA(i,r,o);return this._unit=e.unit||(s.autoSkip?Yg(e.minUnit,this.min,this.max,this._getLabelCapacity(r)):wP(this,a.length,e.minUnit,this.min,this.max)),this._majorUnit=!s.major.enabled||this._unit==="year"?void 0:xP(this._unit),this.initOffsets(i),t.reverse&&a.reverse(),Xg(this,a,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e=0,s=0,i,r;this.options.offset&&t.length&&(i=this.getDecimalForValue(t[0]),t.length===1?e=1-i:e=(this.getDecimalForValue(t[1])-i)/2,r=this.getDecimalForValue(t[t.length-1]),t.length===1?s=r:s=(r-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;e=Rt(e,0,o),s=Rt(s,0,o),this._offsets={start:e,end:s,factor:1/(e+1+s)}}_generate(){const t=this._adapter,e=this.min,s=this.max,i=this.options,r=i.time,o=r.unit||Yg(r.minUnit,e,s,this._getLabelCapacity(e)),a=q(i.ticks.stepSize,1),l=o==="week"?r.isoWeekday:!1,c=Ns(l)||l===!0,d={};let h=e,g,m;if(c&&(h=+t.startOf(h,"isoWeek",l)),h=+t.startOf(h,c?"day":o),t.diff(s,e,o)>1e5*a)throw new Error(e+" and "+s+" are too far apart with stepSize of "+a+" "+o);const y=i.ticks.source==="data"&&this.getDataTimestamps();for(g=h,m=0;g<s;g=+t.add(g,a,o),m++)Qg(d,g,y);return(g===s||i.bounds==="ticks"||m===1)&&Qg(d,g,y),Object.keys(d).sort(Gg).map(_=>+_)}getLabelForValue(t){const e=this._adapter,s=this.options.time;return s.tooltipFormat?e.format(t,s.tooltipFormat):e.format(t,s.displayFormats.datetime)}format(t,e){const i=this.options.time.displayFormats,r=this._unit,o=e||i[r];return this._adapter.format(t,o)}_tickFormatFunction(t,e,s,i){const r=this.options,o=r.ticks.callback;if(o)return ct(o,[t,e,s],this);const a=r.time.displayFormats,l=this._unit,c=this._majorUnit,d=l&&a[l],h=c&&a[c],g=s[e],m=c&&h&&g&&g.major;return this._adapter.format(t,i||(m?h:d))}generateTickLabels(t){let e,s,i;for(e=0,s=t.length;e<s;++e)i=t[e],i.label=this._tickFormatFunction(i.value,e,t)}getDecimalForValue(t){return t===null?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,s=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+s)*e.factor)}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+s*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,s=this.ctx.measureText(t).width,i=ge(this.isHorizontal()?e.maxRotation:e.minRotation),r=Math.cos(i),o=Math.sin(i),a=this._resolveTickFontOptions(0).size;return{w:s*r+a*o,h:s*o+a*r}}_getLabelCapacity(t){const e=this.options.time,s=e.displayFormats,i=s[e.unit]||s.millisecond,r=this._tickFormatFunction(t,0,Xg(this,[t],this._majorUnit),i),o=this._getLabelSize(r),a=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return a>0?a:1}getDataTimestamps(){let t=this._cache.data||[],e,s;if(t.length)return t;const i=this.getMatchingVisibleMetas();if(this._normalized&&i.length)return this._cache.data=i[0].controller.getAllParsedValues(this);for(e=0,s=i.length;e<s;++e)t=t.concat(i[e].controller.getAllParsedValues(this));return this._cache.data=this.normalize(t)}getLabelTimestamps(){const t=this._cache.labels||[];let e,s;if(t.length)return t;const i=this.getLabels();for(e=0,s=i.length;e<s;++e)t.push(Kg(this,i[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return M0(t.sort(Gg))}}B(Zi,"id","time"),B(Zi,"defaults",{bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}});function io(n,t,e){let s=0,i=n.length-1,r,o,a,l;e?(t>=n[s].pos&&t<=n[i].pos&&({lo:s,hi:i}=He(n,"pos",t)),{pos:r,time:a}=n[s],{pos:o,time:l}=n[i]):(t>=n[s].time&&t<=n[i].time&&({lo:s,hi:i}=He(n,"time",t)),{time:r,pos:a}=n[s],{time:o,pos:l}=n[i]);const c=o-r;return c?a+(l-a)*(t-r)/c:a}class bc extends Zi{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=io(e,this.min),this._tableRange=io(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:s}=this,i=[],r=[];let o,a,l,c,d;for(o=0,a=t.length;o<a;++o)c=t[o],c>=e&&c<=s&&i.push(c);if(i.length<2)return[{time:e,pos:0},{time:s,pos:1}];for(o=0,a=i.length;o<a;++o)d=i[o+1],l=i[o-1],c=i[o],Math.round((d+l)/2)!==c&&r.push({time:c,pos:o/(a-1)});return r}_generate(){const t=this.min,e=this.max;let s=super.getDataTimestamps();return(!s.includes(t)||!s.length)&&s.splice(0,0,t),(!s.includes(e)||s.length===1)&&s.push(e),s.sort((i,r)=>i-r)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),s=this.getLabelTimestamps();return e.length&&s.length?t=this.normalize(e.concat(s)):t=e.length?e:s,t=this._cache.all=t,t}getDecimalForValue(t){return(io(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,s=this.getDecimalForPixel(t)/e.factor-e.end;return io(this._table,s*this._tableRange+this._minPos,!0)}}B(bc,"id","timeseries"),B(bc,"defaults",Zi.defaults);var EP=Object.freeze({__proto__:null,CategoryScale:pc,LinearScale:mc,LogarithmicScale:yc,RadialLinearScale:Ti,TimeScale:Zi,TimeSeriesScale:bc});const IP=[C1,o2,eP,EP];ae.register(...IP);function he(n,t=""){return`
        <div class="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/30 ${t}">
            ${n}
        </div>
    `}function xy(){const n=(i,r,o)=>`
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${r}</span>
        <span id="${i}" class="text-2xl font-bold ${o} dark:text-white font-mono tracking-tight">-</span>
    `;return`
        <div class="space-y-4 animate-fade-in p-1">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1 mb-2">ダッシュボード</h2>

            <!-- 1. サマリーカードエリア -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${he(n("today-count","今日の完了","text-blue-600"),"p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform")}
                ${he(n("weekly-count","今週の完了","text-green-600"),"p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform")}
                ${he(n("monthly-count","今月の完了","text-purple-600"),"p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform")}
                ${he(n("total-count","全期間","text-gray-600"),"p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform")}
            </div>

            <!-- 2. グラフエリア (Grid & 高さ統一) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${he(`
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 日次推移 (直近4日)
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="dailyChart"></canvas>
        </div>
    `,"p-3 h-64 flex flex-col")}
                ${he(`
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> 週次推移
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="weeklyChart"></canvas>
        </div>
    `,"p-3 h-64 flex flex-col")}
            </div>
            
            <!-- 3. 月次 (下部配置) -->
            ${he(`
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 月次推移
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="monthlyChart"></canvas>
        </div>
    `,"p-3 h-64 flex flex-col")}
        </div>
    `}function TP(n){const e=`
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">キーワード</label>
                <input type="text" id="page-search-input" placeholder="タスク名を入力..." 
                    class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 transition-colors text-sm">
            </div>
            <div class="md:w-1/3">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">プロジェクト</label>
                <select id="page-search-project" 
                    class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-colors text-sm appearance-none cursor-pointer">
                    <option value="">全てのプロジェクト</option>
                    ${n.map(s=>`<option value="${s.id}">${s.name}</option>`).join("")}
                </select>
            </div>
        </div>
    `;return`
        <div class="max-w-3xl mx-auto mt-4">
            <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 px-1">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                タスク検索
            </h2>
            
            <!-- 共通GlassCardを使用 -->
            ${he(e,"p-8 mb-8")}

            <div id="search-results-container">
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            </div>
        </div>
    `}function AP(){return`
        <div class="space-y-6">
            <!-- 共通GlassCardを使用 -->
            ${he(`
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">アカウント設定</h3>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新しいパスワード (6文字以上)</label>
                <input type="password" id="new-password-input" placeholder="新しいパスワード"
                    class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100">
            </div>
            <button id="update-password-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
                パスワードを更新
            </button>
        </div>
    `,"p-6")}
            ${he(`
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">データ管理</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">現在のすべてのタスク、プロジェクト、ラベルをJSONファイルとしてダウンロードします。</p>
        <button id="export-data-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
            データのエクスポート
        </button>
    `,"p-6")}
        </div>
    `}let Al=null,Sl=null,Pl=null;function SP(n,t){const e=document.getElementById("dashboard-view");if(!n||!ae||!e)return;e.innerHTML=xy();const s=n.filter(i=>i.status==="completed"&&i.completedAt);PP(s),CP(s),RP(s),DP(s)}function PP(n){const t=new Date,e=new Date(t);e.setHours(0,0,0,0);const s=new Date(t);s.setDate(t.getDate()-t.getDay()),s.setHours(0,0,0,0);const i=new Date(t.getFullYear(),t.getMonth(),1),r={today:0,weekly:0,monthly:0,total:n.length};n.forEach(a=>{const l=a.completedAt.toDate?a.completedAt.toDate():new Date(a.completedAt);l>=e&&r.today++,l>=s&&r.weekly++,l>=i&&r.monthly++});const o=(a,l)=>{const c=document.getElementById(a);c&&(c.textContent=l)};o("today-count",r.today),o("weekly-count",r.weekly),o("monthly-count",r.monthly),o("total-count",r.total)}function td(){return{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,ticks:{display:!1,stepSize:1},grid:{color:"rgba(156, 163, 175, 0.1)",drawBorder:!1},border:{display:!1}},x:{ticks:{color:"#9CA3AF",font:{size:10}},grid:{display:!1}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(17, 24, 39, 0.9)",padding:8,cornerRadius:4,displayColors:!1,callbacks:{title:n=>n[0].label,label:n=>`${n.raw} 件`}}},interaction:{mode:"index",intersect:!1}}}function CP(n){var r;const t=(r=document.getElementById("dailyChart"))==null?void 0:r.getContext("2d");if(!t)return;Al&&Al.destroy();const e=[],s=[],i=new Date;for(let o=3;o>=0;o--){const a=new Date;a.setDate(i.getDate()-o),a.setHours(0,0,0,0);const l=new Date(a);l.setHours(23,59,59,999),e.push(`${a.getMonth()+1}/${a.getDate()}`);const c=n.filter(d=>{const h=d.completedAt.toDate?d.completedAt.toDate():new Date(d.completedAt);return h>=a&&h<=l}).length;s.push(c)}Al=new ae(t,{type:"bar",data:{labels:e,datasets:[{data:s,backgroundColor:"#3B82F6",borderRadius:4,barThickness:20}]},options:td()})}function RP(n){var o;const t=(o=document.getElementById("weeklyChart"))==null?void 0:o.getContext("2d");if(!t)return;Sl&&Sl.destroy();const e=[],s=[],i=new Date,r=new Date(i);r.setDate(i.getDate()-i.getDay()),r.setHours(0,0,0,0);for(let a=3;a>=0;a--){const l=new Date(r);l.setDate(l.getDate()-a*7);const c=new Date(l);c.setDate(c.getDate()+6),c.setHours(23,59,59,999),e.push(`${l.getMonth()+1}/${l.getDate()}~`);const d=n.filter(h=>{const g=h.completedAt.toDate?h.completedAt.toDate():new Date(h.completedAt);return g>=l&&g<=c}).length;s.push(d)}Sl=new ae(t,{type:"bar",data:{labels:e,datasets:[{data:s,backgroundColor:"#10B981",borderRadius:4,barThickness:20}]},options:td()})}function DP(n){var r;const t=(r=document.getElementById("monthlyChart"))==null?void 0:r.getContext("2d");if(!t)return;Pl&&Pl.destroy();const e=[],s=[],i=new Date;for(let o=3;o>=0;o--){const a=new Date(i.getFullYear(),i.getMonth()-o,1),l=new Date(a),c=new Date(a.getFullYear(),a.getMonth()+1,0);c.setHours(23,59,59,999),e.push(`${l.getFullYear()}/${l.getMonth()+1}`);const d=n.filter(h=>{const g=h.completedAt.toDate?h.completedAt.toDate():new Date(h.completedAt);return g>=l&&g<=c}).length;s.push(d)}Pl=new ae(t,{type:"bar",data:{labels:e,datasets:[{data:s,backgroundColor:"#8B5CF6",borderRadius:4,barThickness:30}]},options:td()})}function ky(n,t){const e=document.createElement("ul");e.id="task-list-ul",e.className="divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:divide-gray-800 mb-2",!t||t.length===0?NP(e):(t.forEach(s=>{const i=MP(s);e.appendChild(i)}),LP(e)),n.appendChild(e)}function MP(n){const t=document.createElement("li");t.setAttribute("data-id",n.id),t.setAttribute("draggable","true");const e=n.status==="completed",s=TI(n.dueDate),i=AI(n.dueDate),r=!!n.recurrence,o=!!n.dueDate&&!r,a=is(),l=n.timeBlockId?a.find(h=>h.id===n.timeBlockId):null,c=n.duration;return t.className=`group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-default border border-transparent ${e?"opacity-60 bg-gray-50 dark:bg-gray-900/50":"hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700"}`,t.innerHTML=`
        <!-- ドラッグハンドル -->
        <div class="task-drag-handle mt-1 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hidden sm:block mr-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>

        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 cursor-pointer ${e?"bg-blue-500 border-blue-500 text-white":"border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500"}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-7 flex flex-col justify-center">
                <div class="leading-snug truncate font-medium transition-colors ${e?"line-through text-gray-500 dark:text-gray-500":"text-gray-800 dark:text-gray-200"}">${n.title}</div>
                ${n.description?`<div class="text-xs text-gray-400 truncate mt-0.5 font-light">${n.description}</div>`:""}
            </div>
            
            <!-- メタ情報エリア -->
            <div class="col-span-1 sm:col-span-5 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0 overflow-hidden">
                ${r?'<div class="text-blue-500 dark:text-blue-400 flex-shrink-0" title="繰り返し設定あり">🔁</div>':""}
                
                <!-- ★追加: 単発タスク（期限あり・繰り返しなし） -->
                ${o?'<div class="text-gray-400 dark:text-gray-500 flex-shrink-0" title="期限あり">▶️</div>':""}
                
                <!-- 時間帯バッジ -->
                ${l?`
                    <div class="flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[140px]" title="${l.start} - ${l.end}">
                        <span class="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style="background-color: ${l.color}"></span>
                        <span class="truncate font-mono text-[11px]">${l.start} - ${l.end}</span>
                    </div>
                `:""}

                <!-- 所要時間バッジ -->
                ${c?`
                    <div class="flex items-center text-gray-500 dark:text-gray-400 whitespace-nowrap" title="所要時間: ${c}分">
                        <span class="mr-0.5 text-[10px]">⏱️</span>${c}m
                    </div>
                `:""}

                ${s?`<div class="flex items-center ${i} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded flex-shrink-0"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${s}</div>`:""}
            </div>
        </div>
    `,t.addEventListener("dragstart",h=>{t.classList.add("opacity-50"),h.dataTransfer.setData("text/plain",n.id),h.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("opacity-50")}),t.querySelector(".task-checkbox").addEventListener("click",async h=>{h.stopPropagation(),await VI(n.id,e?"todo":"completed")}),t.addEventListener("click",h=>{!h.target.closest(".task-checkbox")&&!h.target.closest(".task-drag-handle")&&yT(n)}),t.addEventListener("contextmenu",h=>{h.preventDefault(),h.stopPropagation(),VP(n,h.clientX,h.clientY)}),t}function LP(n){n.addEventListener("dragover",t=>{t.preventDefault(),OP(n,t.clientY)})}function OP(n,t){return[...n.querySelectorAll("li:not(.opacity-50)")].reduce((s,i)=>{const r=i.getBoundingClientRect(),o=t-r.top-r.height/2;return o<0&&o>s.offset?{offset:o,element:i}:s},{offset:Number.NEGATIVE_INFINITY}).element}function VP(n,t,e){var r;(r=document.getElementById("task-context-menu"))==null||r.remove();const s=document.createElement("div");s.id="task-context-menu",s.className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]",s.style.left=`${t}px`,s.style.top=`${e}px`,s.innerHTML=`
        <button id="ctx-delete-task-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `,document.body.appendChild(s),document.getElementById("ctx-delete-task-btn").addEventListener("click",()=>{s.remove(),K("削除しますか？",async()=>await v0(n.id))});const i=o=>{s.contains(o.target)||(s.remove(),document.removeEventListener("click",i))};setTimeout(()=>{document.addEventListener("click",i)},0)}function NP(n){n.innerHTML='<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>'}let vc=[];function Pa(n){const t=typeof window<"u"&&window.GLOBAL_APP_ID?window.GLOBAL_APP_ID:"default-app-id",e=ce();return e?`/artifacts/${t}/workspaces/${e}/users/${n}/projects`:null}function FP(n,t){const e=Pa(n);if(!e)return console.warn("subscribeToProjectsRaw: No workspace selected or path invalid"),vc=[],t([]),()=>{};const s=nr(Pn(At,e));return ta(s,i=>{const r=i.docs.map(o=>({id:o.id,...o.data()}));vc=r,t(r)})}function BP(){return vc}async function jP(n,t){const e=Pa(n);if(!e)throw new Error("Workspace not selected");await Sc(Pn(At,e),{name:t,ownerId:n,createdAt:new Date})}async function UP(n,t,e){const s=Pa(n);if(!s)throw new Error("Workspace not selected");const i=sr(At,s,t);return b_(i,e)}async function zP(n,t){const e=Pa(n);if(!e)throw new Error("Workspace not selected");await Pc(sr(At,e,t))}function ed(){var e;const n=(e=Ft.currentUser)==null?void 0:e.uid;if(!n)throw K("操作にはログインが必要です。",null),new Error("Authentication required.");if(!ce())throw K("ワークスペースが選択されていません。",null),new Error("Workspace selection required.");return n}function Ey(n){const t=Ft.currentUser,e=ce();return!t||!e?(console.warn("User not authenticated or Workspace not selected, skipping projects subscription"),n&&n([]),()=>{}):FP(t.uid,n)}async function $P(n){const t=ed();return jP(t,n)}async function HP(n,t){const e=ed();return UP(e,n,t)}async function Iy(n){const t=ed();return zP(t,n)}let Cl=!1;function wc(n,t,e){if(!Cl)n.innerHTML=`
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 font-medium">タスクを追加</div>
            </div>
        `,n.querySelector("#show-input-btn").addEventListener("click",()=>{Cl=!0,wc(n,t,e)});else{const r=`
            <input type="text" id="inline-title-input" placeholder="タスク名 (例: 明日14時に会議 #仕事)" 
                     class="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 mb-2">
            
            <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2"
                     class="w-full text-xs bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-600 dark:text-gray-300 mb-3 resize-none"></textarea>
            
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <div class="flex space-x-2">
                    <!-- 期限日ボタン（将来拡張用） -->
                    <button class="flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600/50 transition">
                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        期限日
                    </button>
                    
                    <!-- 時間帯選択プルダウン -->
                    <div class="relative">
                        <select id="inline-timeblock-select" class="appearance-none pl-2 pr-6 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600/50 transition bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="">時間帯 (未定)</option>
                            ${is().map(h=>`<option value="${h.id}">${h.start} - ${h.end}</option>`).join("")}
                        </select>
                       <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button id="cancel-input-btn" class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition">キャンセル</button>
                    <button id="submit-task-btn" class="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                        タスクを追加
                    </button>
                </div>
            </div>
        `;n.innerHTML=he(r,"p-3 animate-fade-in-down");const o=n.querySelector("#inline-title-input"),a=n.querySelector("#inline-desc-input"),l=n.querySelector("#inline-timeblock-select"),c=n.querySelector("#submit-task-btn");o.focus(),o.addEventListener("keydown",h=>{h.key==="Enter"&&!h.isComposing&&(h.preventDefault(),o.value.trim()&&d())}),n.querySelector("#cancel-input-btn").addEventListener("click",()=>{Cl=!1,wc(n,t,e)});const d=async()=>{const h=o.value.trim(),g=a&&typeof a.value=="string"?a.value.trim():"",m=l.value,y={title:h,description:g,dueDate:null,projectId:t,labelIds:e?[e]:[],timeBlockId:m||null};if(h){c.disabled=!0,c.textContent="追加中...";try{typeof If=="function"?await If(y):await b0(y.title,y.projectId,null),o.value="",a.value="",o.focus(),c.textContent="追加しました",setTimeout(()=>{c.disabled=!1,c.textContent="タスクを追加"},1e3)}catch(_){console.error(_),_.message!=="Authentication required."&&K("タスクの追加に失敗しました","error"),c.disabled=!1}}};c.addEventListener("click",d)}}function WP(n,t){return[...n].sort((s,i)=>{var c,d;const r=(c=s.createdAt)!=null&&c.toDate?s.createdAt.toDate():new Date(s.createdAt||0),o=(d=i.createdAt)!=null&&d.toDate?i.createdAt.toDate():new Date(i.createdAt||0),a=(h,g,m="asc")=>{const y=(h||"").toString().toLowerCase(),_=(g||"").toString().toLowerCase();let w=0;return y<_?w=-1:y>_&&(w=1),m==="asc"?w:-w},l=(h,g,m)=>h==null?1:g==null?-1:m(h,g);switch(t){case"timeBlockId_asc":return l(s.timeBlockId,i.timeBlockId,(m,y)=>a(m,y,"asc"));case"projectId_asc":return l(s.projectId,i.projectId,(m,y)=>a(m,y,"asc"));case"title_asc":return a(s.title,i.title,"asc");case"createdAt_asc":return r-o;case"dueDate_asc":if(!s.dueDate)return 1;if(!i.dueDate)return-1;const h=s.dueDate.toDate?s.dueDate.toDate():new Date(s.dueDate),g=i.dueDate.toDate?i.dueDate.toDate():new Date(i.dueDate);return h-g;case"createdAt_desc":default:return o-r}})}let Jg=null,Zg=null;function qP(n,t,e=null,s=null){Jg=e,Zg=s;const i=document.getElementById("task-view");if(!i)return;GP(n.length,e,s);const r=document.getElementById("sort-select"),o=r?r.value:"createdAt_desc",a=WP(n,o);i.innerHTML="",ky(i,a);const l=document.createElement("div");l.id="inline-input-container",l.className="mt-2 pb-10",i.appendChild(l),wc(l,Jg,Zg)}function GP(n,t,e){const s=document.getElementById("header-title"),i=document.getElementById("header-count");s&&(t?s.textContent="プロジェクトタスク":e?s.textContent="ラベル付きタスク":s.textContent="インボックス"),i&&(i.textContent=`${n}件`)}function Ty(n,t){const{keyword:e,projectId:s,labelId:i,showCompleted:r}=t;return n.filter(o=>{if(!r&&o.status==="completed"||s&&o.projectId!==s||i&&(!o.labelIds||!o.labelIds.includes(i)))return!1;if(e){const a=e.toLowerCase(),l=o.title.toLowerCase().includes(a),c=(o.description||"").toLowerCase().includes(a);if(!l&&!c)return!1}return!0})}function Eo(n,t){t.forEach(e=>{e.classList.add("hidden"),e.classList.remove("animate-fade-in")}),n.classList.remove("hidden")}function Io(n){document.querySelectorAll(".sidebar-item-row").forEach(e=>{e.classList.remove("bg-blue-600","dark:bg-blue-600","text-white","dark:text-white","hover:bg-blue-700","dark:hover:bg-blue-700"),e.classList.add("text-gray-700","dark:text-gray-300","hover:bg-gray-100","dark:hover:bg-gray-800");const s=e.querySelector("svg, span");s&&(s.classList.remove("text-white","dark:text-white"),(e.id.startsWith("nav-")||e.dataset.type==="project")&&s.classList.add("text-gray-400"))});let t=null;if(n.type==="inbox"||n.type==="dashboard"||n.type==="search"||n.type==="settings")t=document.getElementById(`nav-${n.type}`);else if(n.type==="project"||n.type==="timeblock"||n.type==="duration"){const e=`.sidebar-item-row[data-type="${n.type}"][data-id="${n.id}"]`;t=document.querySelector(e)}else if(n.type==="custom"){const e=`.sidebar-item-row[data-type="filter"][data-id="${n.id}"]`;t=document.querySelector(e)}t&&KP(t)}function KP(n){n.classList.remove("text-gray-700","dark:text-gray-300","hover:bg-gray-100","dark:hover:bg-gray-800"),n.classList.add("bg-blue-600","dark:bg-blue-600","text-white","dark:text-white","hover:bg-blue-700","dark:hover:bg-blue-700");const t=n.querySelector("svg, span");t&&(t.classList.remove("text-gray-400"),t.classList.add("text-white","dark:text-white"))}function Fe(n){const t=document.getElementById("header-title");t&&(t.textContent=n)}function YP(n,t,e){if(n.type==="project"){const s=t.find(i=>i.id===n.id);Fe(s?s.name:"不明なプロジェクト")}else if(n.type==="label"){const s=e.find(i=>i.id===n.id);Fe(s?s.name:"不明なラベル")}else if(n.type==="timeblock")if(n.id==="unassigned")Fe("時間帯: 未定");else{const s=iT(n.id);Fe(s?`時間帯: ${s.start} - ${s.end}`:"時間帯: 不明")}else n.type==="duration"?Fe(`所要時間: ${n.id}分`):Fe("インボックス")}function QP(){const n=document.getElementById("task-view"),t=document.getElementById("dashboard-view"),e=document.getElementById("settings-view");n&&(n.innerHTML='<div class="p-10 text-center text-gray-400">ログインしてください</div>'),t&&(t.innerHTML=""),e&&(e.innerHTML="")}function XP(n,t,e,s,i){Eo(n,t),n.innerHTML=TP(s);const r=document.getElementById("page-search-input"),o=document.getElementById("page-search-project"),a=document.getElementById("search-results-container");r==null||r.focus();const l=()=>{const c=r.value.trim(),d=o.value;if(!c){a.innerHTML=`
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            `;return}const h=Ty(e,{keyword:c,projectId:d||null,showCompleted:!0});h.length===0?a.innerHTML='<div class="text-center text-gray-400 py-10">該当するタスクが見つかりませんでした</div>':(a.innerHTML="",ky(a,h))};r==null||r.addEventListener("input",l),o==null||o.addEventListener("change",l),Fe("検索"),Io(i)}let vt={type:"inbox",id:null};function Ni(n){vt=n}function JP(n,t,e){const s=document.getElementById("task-view"),i=document.getElementById("dashboard-view"),r=document.getElementById("search-view"),o=document.getElementById("settings-view"),a=document.getElementById("sort-trigger");if(a&&a.dataset.value,!s||!i||!o||!r)return;if(vt.type==="dashboard"){Eo(i,[s,o,r]),i.innerHTML=xy(),SP(n),Fe("ダッシュボード"),Io(vt);return}if(vt.type==="settings"){Eo(o,[s,i,r]),o.innerHTML=AP(),x0(),Fe("設定"),Io(vt);return}if(vt.type==="search"){XP(r,[s,i,o],n,t,vt);return}Eo(s,[i,o,r]);const l=document.getElementById("toggle-completed-btn");let d={keyword:"",showCompleted:(l==null?void 0:l.classList.contains("text-blue-500"))||!1,projectId:vt.type==="project"?vt.id:null,labelId:vt.type==="label"?vt.id:null},h=Ty(n,d);vt.type==="timeblock"?vt.id==="unassigned"?h=h.filter(g=>!g.timeBlockId||g.timeBlockId==="null"):h=h.filter(g=>String(g.timeBlockId)===String(vt.id)):vt.type==="duration"&&(h=h.filter(g=>Number(g.duration)===Number(vt.id))),s.style.opacity="0",requestAnimationFrame(()=>{qP(h,t,vt.type==="project"?vt.id:null,vt.type==="label"?vt.id:null),requestAnimationFrame(()=>{s.style.opacity="1",Io(vt),YP(vt,t,e)})})}function ZP(){return`
        <div class="mt-2 select-none">
            
            <!-- 1. 基本項目セクション (アコーディオン) -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="basic-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">基本項目</h3>
                </div>
            </div>
            <ul id="basic-list" class="space-y-0.5 mb-4 pl-1">
                <!-- ダッシュボード -->
                <li>
                    <!-- ★修正: text-sm を削除 (文字サイズ設定を反映させるため) -->
                    <a href="#" id="nav-dashboard" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        ダッシュボード
                    </a>
                </li>
                <!-- インボックス -->
                <li>
                    <!-- ★修正: text-sm を削除 -->
                    <a href="#" id="nav-inbox" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors drop-target" data-type="inbox">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <span class="flex-1">インボックス</span>
                        <!-- ★修正: カウント要素を追加 -->
                        <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
                    </a>
                </li>
                <!-- 検索 -->
                <li>
                    <!-- ★修正: text-sm を削除 -->
                    <a href="#" id="nav-search" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        検索
                    </a>
                </li>
                <!-- 設定 -->
                <li>
                    <!-- ★修正: text-sm を削除 -->
                    <a href="#" id="nav-settings" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        設定
                    </a>
                </li>
            </ul>

            <!-- 2. プロジェクトセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="project-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">プロジェクト</h3>
                </div>
                <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="project-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 3. 時間帯ブロックセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="timeblock-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">時間帯</h3>
                </div>
                <button id="edit-timeblocks-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="編集">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
            <ul id="timeblock-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 4. 所要時間セクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="duration-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">所要時間</h3>
                </div>
            </div>
            <ul id="duration-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 5. フィルターセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="filter-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">フィルター</h3>
                </div>
                <button id="add-filter-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="filter-list" class="space-y-0.5 pl-1"></ul>
        </div>
    `}function tC(){document.querySelectorAll(".sidebar-section-header").forEach(n=>{const t=n.dataset.target,e=document.getElementById(t),s=n.querySelector("svg");if(!e||!s)return;const i=localStorage.getItem(`sidebar:${t}-open`);(i===null?!0:i==="true")?(e.classList.remove("hidden"),s.style.transform="rotate(0deg)"):(e.classList.add("hidden"),s.style.transform="rotate(-90deg)"),n.addEventListener("click",o=>{if(o.target.closest("button"))return;e.classList.toggle("hidden");const a=!e.classList.contains("hidden");a?s.style.transform="rotate(0deg)":s.style.transform="rotate(-90deg)",localStorage.setItem(`sidebar:${t}-open`,a)})})}function tr(n,t,e=null){n&&(n.addEventListener("dragover",s=>{s.preventDefault(),n.classList.add("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400")}),n.addEventListener("dragleave",()=>{n.classList.remove("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400")}),n.addEventListener("drop",async s=>{s.preventDefault(),n.classList.remove("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400");const i=s.dataTransfer.getData("text/plain");if(i)try{if(t==="inbox")await vi(i,{projectId:null});else if(t==="project"&&e)await vi(i,{projectId:e});else if(t==="timeblock")await vi(i,{timeBlockId:e==="unassigned"||e===null?null:e});else if(t==="duration"&&e){const r=parseInt(e,10);await vi(i,{duration:r})}}catch(r){console.error("Drop Error:",r)}}))}function Ay(n=null){var h;const t="filter-creation-modal";(h=document.getElementById(t))==null||h.remove();const e=!!n,s=BP(),i=is(),r=[30,45,60,75,90];let o=[],a=[],l=[];e&&n.query&&n.query.split(" ").forEach(m=>{const[y,_]=m.split(":");if(!_)return;const w=_.split(",");y==="project"&&(o=w),y==="timeblock"&&(a=w),y==="duration"&&(l=w)});const c=document.createElement("div");c.id=t,c.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",c.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            
            <!-- ヘッダー -->
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    ${e?"カスタムフィルター編集":"カスタムフィルター作成"}
                </h3>
                <button id="close-filter-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                
                <!-- フィルター名 -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">フィルター名</label>
                    <input type="text" id="filter-name" value="${e?n.name:""}" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm" placeholder="例: 午前の重要タスク">
                </div>

                <!-- 3カラム選択エリア -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <!-- 1. プロジェクト選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-xs text-gray-700 dark:text-gray-200">プロジェクト</span>
                            <span class="text-[10px] text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-1.5 overflow-y-auto max-h-56 custom-scrollbar space-y-0.5" id="project-select-container">
                            ${s.length===0?'<div class="text-xs text-gray-400 p-2">プロジェクトがありません</div>':""}
                            ${s.map(g=>`
                                <label class="flex items-center px-2 py-1.5 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${g.id}" ${o.includes(String(g.id))?"checked":""} class="filter-project-checkbox form-checkbox h-3.5 w-3.5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-xs text-gray-700 dark:text-gray-300 truncate">${g.name}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <!-- 2. 時間帯選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-xs text-gray-700 dark:text-gray-200">時間帯</span>
                            <span class="text-[10px] text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-1.5 overflow-y-auto max-h-56 custom-scrollbar space-y-0.5">
                            <!-- 未定 -->
                            <label class="flex items-center px-2 py-1.5 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input type="checkbox" value="null" ${a.includes("null")?"checked":""} class="filter-timeblock-checkbox form-checkbox h-3.5 w-3.5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                <span class="ml-2 w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                                <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">未定</span>
                            </label>

                            ${i.map(g=>`
                                <label class="flex items-center px-2 py-1.5 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${g.id}" ${a.includes(String(g.id))?"checked":""} class="filter-timeblock-checkbox form-checkbox h-3.5 w-3.5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 w-2.5 h-2.5 rounded-full" style="background-color: ${g.color}"></span>
                                    <span class="ml-2 text-xs text-gray-700 dark:text-gray-300 truncate">${g.start} - ${g.end}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <!-- 3. 所要時間選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-xs text-gray-700 dark:text-gray-200">所要時間</span>
                            <span class="text-[10px] text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-1.5 overflow-y-auto max-h-56 custom-scrollbar space-y-0.5">
                            ${r.map(g=>`
                                <label class="flex items-center px-2 py-1.5 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${g}" ${l.includes(String(g))?"checked":""} class="filter-duration-checkbox form-checkbox h-3.5 w-3.5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">⏱️ ${g} min</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                </div>

                <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                    <p>※ 各カテゴリ内でチェックを入れると「OR」、カテゴリ間は「AND」条件になります。</p>
                    <p>※ 何もチェックしないカテゴリは条件に含まれません（指定なし扱い）。</p>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 sticky bottom-0">
                <button id="cancel-filter-btn" class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                <button id="save-filter-btn" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm hover:shadow transition-transform transform hover:-translate-y-0.5">
                    ${e?"変更を保存":"フィルターを作成"}
                </button>
            </div>
        </div>
    `,document.body.appendChild(c);const d=()=>c.remove();document.getElementById("close-filter-modal").addEventListener("click",d),document.getElementById("cancel-filter-btn").addEventListener("click",d),c.addEventListener("click",g=>{g.target===c&&d()}),document.getElementById("save-filter-btn").addEventListener("click",async()=>{const g=document.getElementById("filter-name").value.trim();if(!g){K("フィルター名を入力してください","error");return}const m=L=>Array.from(document.querySelectorAll(`.${L}:checked`)).map(M=>M.value),y=m("filter-project-checkbox"),_=m("filter-timeblock-checkbox"),w=m("filter-duration-checkbox"),A=[];if(y.length>0&&A.push(`project:${y.join(",")}`),_.length>0&&A.push(`timeblock:${_.join(",")}`),w.length>0&&A.push(`duration:${w.join(",")}`),A.length===0){K("少なくとも1つの条件を選択してください","error");return}const P=A.join(" "),D={id:e?n.id:"filter-"+Date.now(),name:g,query:P,type:"custom"};try{if(e&&typeof Af=="function")await Af(D.id,D);else if(typeof Tf=="function")await Tf(D);else{console.warn("Store function not found. Saving to localStorage manually.");const L=JSON.parse(localStorage.getItem("custom_filters")||"[]");if(e){const M=L.findIndex(V=>V.id===D.id);M!==-1&&(L[M]=D)}else L.push(D);localStorage.setItem("custom_filters",JSON.stringify(L))}document.dispatchEvent(new CustomEvent("filters-updated")),d()}catch(L){console.error(L),K("保存に失敗しました","error")}})}function eC(n=null){const t=!!n;return`
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col" role="dialog" aria-modal="true">
                
                <!-- ヘッダー（タスクモーダルと統一：入力欄を配置、×ボタンは削除） -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <input type="text" id="modal-project-name" value="${n?n.name:""}" placeholder="${t?"プロジェクト名":"新しいプロジェクト名"}"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-8 flex-1 overflow-y-auto">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        ${t?"プロジェクト名を変更します。":"新しいプロジェクトを作成します。"}
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    ${t?`
        <button id="delete-project-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center transition px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group">
            <svg class="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `:"<div></div>"}
                    <div class="flex space-x-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                        <button id="save-project-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `}function Sy(n=null){var i;const t="project-modal";(i=document.getElementById(t))==null||i.remove();const e=!n,s=document.createElement("div");s.id=t,s.className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",s.innerHTML=eC(n),document.body.appendChild(s),nC(s,n,e)}function nC(n,t,e){const s=()=>n.remove(),i=n.querySelector("#cancel-modal-btn"),r=n.querySelector("#save-project-btn"),o=n.querySelector("#modal-project-name"),a=n.querySelector("#delete-project-btn");i==null||i.addEventListener("click",s),r==null||r.addEventListener("click",async()=>{const l=o==null?void 0:o.value.trim();if(!l){K("プロジェクト名を入力してください","error");return}try{e?await $P(l):await HP(t.id,{name:l}),s()}catch(c){console.error(c),K("保存に失敗しました","error")}}),o==null||o.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),r==null||r.click())}),a&&a.addEventListener("click",()=>{K(`プロジェクト「${t.name}」を削除しますか？
（関連するタスクの紐付けも解除されます）`,async()=>{try{await Iy(t.id),s()}catch(l){console.error(l),K("削除に失敗しました","error")}})}),setTimeout(()=>o==null?void 0:o.focus(),50)}function er(n,t,e,s,i){const r=document.createElement("li"),a=localStorage.getItem("sidebar_compact")==="true"?"py-0.5":"py-1.5";r.dataset.type=t,r.dataset.id=e,r.className=`group flex items-center justify-between px-3 ${a} font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target sidebar-item-row`;let l="";t==="project"?l='<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>':l=`<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="${s?`background-color: ${s};`:"background-color: #a0aec0;"}"></span>`;const c=i>0?`<span class="text-xs text-gray-400 font-light mr-2">${i}</span>`:"";return r.innerHTML=`
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${l}
            <span class="truncate">${n}</span>
        </div>
        <div class="flex items-center">
            ${c}
        </div>
    `,r}function Py(n,t,e,s={}){var a,l;if(!["project","filter"].includes(t))return;(a=document.getElementById("sidebar-context-menu"))==null||a.remove();const i=document.createElement("div");i.id="sidebar-context-menu",i.className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[160px]",i.style.left=`${n.clientX}px`,i.style.top=`${n.clientY}px`;let r="";t==="project"?r=`
            <button id="context-edit-btn" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                編集
            </button>
        `:t==="filter"&&(r=`
            <button id="context-edit-btn" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                編集 / 名前変更
            </button>
        `),r+=`
        <button id="context-delete-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `,i.innerHTML=r,document.body.appendChild(i),(l=document.getElementById("context-edit-btn"))==null||l.addEventListener("click",()=>{i.remove(),t==="project"?Sy(e):t==="filter"&&Ay(e)}),document.getElementById("context-delete-btn").addEventListener("click",()=>{i.remove();const c=t==="project"?`${e.name} を削除しますか？
（関連するタスクのプロジェクト情報も削除されます）`:`フィルター「${e.name}」を削除しますか？`;K(c,async()=>{try{t==="project"?(await Iy(e.id),Ni({type:"inbox",id:null})):t==="filter"&&(await jI(e.id),document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"inbox"}})))}catch(d){console.error("Delete failed:",d),K("削除に失敗しました。","error")}})});const o=c=>{i.contains(c.target)||(i.remove(),document.removeEventListener("click",o))};setTimeout(()=>{document.addEventListener("click",o)},0)}function sC(n){const t=document.getElementById("inbox-count");if(t){const e=n?n.filter(s=>!s.projectId&&s.status!=="completed").length:0;t.textContent=e,e>0?t.classList.remove("hidden"):t.classList.add("hidden")}}function nd(n,t=[]){const e=document.getElementById("project-list");e&&(e.innerHTML="",n.forEach(s=>{const i=t?t.filter(o=>o.projectId===s.id&&o.status!=="completed").length:0,r=er(s.name,"project",s.id,null,i);r.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"project",id:s.id}}))}),r.addEventListener("contextmenu",o=>{o.preventDefault(),Py(o,"project",s,{})}),tr(r,"project",s.id),e.appendChild(r)}))}function sd(n=[]){const t=document.getElementById("timeblock-list");if(!t)return;t.innerHTML="",is().forEach(r=>{const o=n?n.filter(c=>String(c.timeBlockId)===String(r.id)&&c.status!=="completed").length:0,a=`${r.start} - ${r.end}`,l=er(a,"timeblock",r.id,r.color,o);l.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"timeblock",id:r.id}}))}),l.addEventListener("contextmenu",c=>{c.preventDefault(),Ry()}),tr(l,"timeblock",r.id),t.appendChild(l)});const s=n?n.filter(r=>(r.timeBlockId===null||r.timeBlockId==="null")&&r.status!=="completed").length:0,i=er("未定","timeblock","unassigned","#a0aec0",s);i.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"timeblock",id:"unassigned"}}))}),tr(i,"timeblock","unassigned"),t.appendChild(i)}function Cy(n=[]){const t=document.getElementById("duration-list");if(!t)return;t.innerHTML="",[30,45,60,75,90].forEach(s=>{const i=n?n.filter(a=>Number(a.duration)===s&&a.status!=="completed").length:0,r=er(`${s} min`,"duration",s.toString(),null,i),o=r.firstElementChild;if(o){const a=o.querySelector('span[class*="w-2.5"]');a&&a.remove();const l=document.createElement("span");l.className="mr-3 text-sm",l.textContent="⏱️",o.insertBefore(l,o.firstChild)}r.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"duration",id:s.toString()}}))}),tr(r,"duration",s.toString()),t.appendChild(r)})}function iC(n=[]){const t=document.getElementById("filter-list");t&&(t.innerHTML="",n.forEach(e=>{const s=er(e.name,"filter",e.id,null,0),i=s.firstElementChild;if(i){const r=i.querySelector('span[class*="w-2.5"]');r&&r.remove(),i.insertAdjacentHTML("afterbegin",'<svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>')}s.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"custom",id:e.id}}))}),s.addEventListener("contextmenu",r=>{r.preventDefault(),Py(r,"filter",e)}),t.appendChild(s)}))}function fi(n,t,e,s,i=[]){!n||!document.getElementById("project-list")||(nd(e,t),sd(t),Cy(t),iC(i),sC(t))}function Ry(){var s;const n="timeblock-modal";(s=document.getElementById(n))==null||s.remove();const t=is(),e=document.createElement("div");e.id=n,e.className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",e.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-4 sm:p-6 overflow-y-auto flex-1">
                <div class="mb-4">
                    <div id="tb-list" class="space-y-3">
                        <!-- ブロックリストがここに描画される -->
                    </div>
                </div>
                
                <button id="add-tb-btn" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm flex items-center justify-center gap-2" ${t.length>=5?'disabled style="opacity:0.5;cursor:not-allowed;"':""}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    新しい時間帯を追加 (最大5個)
                </button>

                <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span class="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                        <span class="font-bold mr-2">未定</span>
                        <span class="text-gray-400 text-xs">どの時間帯にも属さないタスク用のデフォルトゾーンです（削除不可）</span>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                <button id="close-tb-footer" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
                    完了
                </button>
            </div>
        </div>
    `,document.body.appendChild(e),Dy(t),document.getElementById("close-tb-modal").addEventListener("click",()=>e.remove()),document.getElementById("close-tb-footer").addEventListener("click",async()=>{document.querySelectorAll(".tb-save").forEach(r=>r.click()),setTimeout(()=>{e.remove(),document.dispatchEvent(new CustomEvent("timeblocks-updated"))},100)}),document.getElementById("add-tb-btn").addEventListener("click",()=>{My(null,document.getElementById("tb-list")),To()})}function Dy(n){const t=document.getElementById("tb-list");t.innerHTML="",n.forEach(e=>My(e,t))}function To(){const n=document.getElementById("add-tb-btn");document.querySelectorAll(".tb-row").length>=5?(n.disabled=!0,n.style.opacity="0.5",n.style.cursor="not-allowed"):(n.disabled=!1,n.style.opacity="1",n.style.cursor="pointer")}function My(n,t){const e=!n,s=n||{id:"",name:"",start:"09:00",end:"10:00",color:"#808080"},i=document.createElement("div");i.className="tb-row flex items-center gap-4 py-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 group",e||(i.dataset.id=s.id);const[r,o]=s.start.split(":"),[a,l]=s.end.split(":");i.innerHTML=`
        <div class="cursor-move text-gray-400 hover:text-gray-600 p-1 handle opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>
        
        <div class="relative">
            <input type="color" class="w-7 h-7 rounded cursor-pointer border-0 p-0 overflow-hidden" value="${s.color}">
            <div class="absolute inset-0 pointer-events-none rounded border border-gray-200 dark:border-gray-600"></div>
        </div>

        <div class="flex-1 flex items-center gap-2 pl-1">
            <!-- 開始時間: 時 + 分 -->
            <div class="flex items-center gap-0.5">
                <select class="tb-start-hour px-1 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:outline-none cursor-pointer">
                    ${Array.from({length:24},(y,_)=>{const w=String(_).padStart(2,"0");return`<option value="${w}" ${w===r?"selected":""}>${w}</option>`}).join("")}
                </select>
                <span class="text-gray-400">:</span>
                <select class="tb-start-min px-1 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:outline-none cursor-pointer">
                    ${["00","15","30","45"].map(y=>`<option value="${y}" ${o===y?"selected":""}>${y}</option>`).join("")}
                </select>
            </div>

            <span class="text-gray-400 text-sm font-bold mx-1">～</span>

            <!-- 終了時間: 時 + 分 -->
            <div class="flex items-center gap-0.5">
                <select class="tb-end-hour px-1 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:outline-none cursor-pointer">
                    ${Array.from({length:24},(y,_)=>{const w=String(_).padStart(2,"0");return`<option value="${w}" ${w===a?"selected":""}>${w}</option>`}).join("")}
                </select>
                <span class="text-gray-400">:</span>
                <select class="tb-end-min px-1 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:outline-none cursor-pointer">
                    ${["00","15","30","45"].map(y=>`<option value="${y}" ${l===y?"selected":""}>${y}</option>`).join("")}
                </select>
            </div>
        </div>

        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="tb-save p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="保存">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button class="tb-delete p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors" title="削除">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `,t.appendChild(i);const c=i.querySelector('input[type="color"]'),d=i.querySelector(".tb-save"),h=i.querySelector(".tb-delete"),g=()=>{const y=i.querySelector(".tb-start-hour").value,_=i.querySelector(".tb-start-min").value;return`${y}:${_}`},m=()=>{const y=i.querySelector(".tb-end-hour").value,_=i.querySelector(".tb-end-min").value;return`${y}:${_}`};d.addEventListener("click",async()=>{const y=g(),_=m(),w=c.value,A=`${y}-${_}`;if(y>=_)return K("終了時間は開始時間より後にしてください","error");try{if(await rT({id:e?null:s.id,name:A,start:y,end:_,color:w}),i.classList.add("bg-green-50","dark:bg-green-900/20"),setTimeout(()=>i.classList.remove("bg-green-50","dark:bg-green-900/20"),1e3),document.dispatchEvent(new CustomEvent("timeblocks-updated")),e){const P=is();Dy(P),To()}}catch(P){K(P.message,"error")}}),h.addEventListener("click",async()=>{if(e){i.remove(),To();return}K("この時間帯設定を削除しますか？",async()=>{await oT(s.id),i.remove(),To(),document.dispatchEvent(new CustomEvent("timeblocks-updated"))})})}function rC(n=[],t=[],e=[]){const s=document.getElementById("sidebar-content");if(!s)return;s.innerHTML=ZP();const i=document.getElementById("sidebar"),r=document.getElementById("sidebar-resizer");ec(i,document.querySelector("main"),r),aC(),tC(),tr(document.getElementById("nav-inbox"),"inbox"),oC(),Ey(o=>{if(i){const a=typeof ai=="function"?ai():[];fi(i,n,o,e,a)}}),w0(o=>{document.getElementById("filter-list")&&fi(i,n,t,e,o)}),k0(o=>{if(document.getElementById("timeblock-list")){const l=ai();fi(i,n,t,e,l)}}),document.addEventListener("timeblocks-updated",()=>{const o=ai();fi(document.getElementById("sidebar"),n,t,e,o)}),document.addEventListener("filters-updated",()=>{const o=ai();fi(i,n,t,e,o)}),window.addEventListener("sidebar-settings-updated",o=>{const a=o.detail.compact;document.querySelectorAll(".sidebar-item-row").forEach(c=>{a?c.classList.replace("py-1.5","py-0.5"):c.classList.replace("py-0.5","py-1.5")})}),xc(),window.addEventListener("resize",xc)}function oC(){const n=document.getElementById("workspace-trigger"),t=document.getElementById("workspace-menu"),e=document.getElementById("workspace-label"),s=document.getElementById("workspace-list"),i=document.getElementById("add-workspace-btn"),r=document.getElementById("settings-workspace-btn");if(!n||!t)return;const o=l=>{l&&(t.contains(l.target)||n.contains(l.target))||(t.classList.replace("opacity-100","opacity-0"),t.classList.replace("visible","invisible"),t.classList.replace("scale-100","scale-95"),t.classList.replace("pointer-events-auto","pointer-events-none"),document.removeEventListener("click",o))},a=()=>{t.classList.contains("opacity-100")?o():(t.classList.replace("opacity-0","opacity-100"),t.classList.replace("invisible","visible"),t.classList.replace("scale-95","scale-100"),t.classList.replace("pointer-events-none","pointer-events-auto"),document.addEventListener("click",o))};n.addEventListener("click",l=>{l.stopPropagation(),a()}),i&&i.addEventListener("click",async()=>{o();const l=window.prompt("新しいワークスペース名を入力してください:");if(l&&l.trim())try{const c=await Lu(l.trim());Vs(c.id)}catch(c){console.error("Failed to add workspace:",c),K("ワークスペースの作成に失敗しました")}}),r&&r.addEventListener("click",()=>{o(),wa()}),Mu(l=>{if(!s||!e)return;const c=ce(),d=l.find(h=>h.id===c);d?(e.textContent=d.name,e.classList.remove("text-gray-400")):(e.textContent="ワークスペースを選択",e.classList.add("text-gray-400")),s.innerHTML="",l.forEach(h=>{const g=document.createElement("button"),m=h.id===c;g.className=`w-full text-left px-4 py-2 text-sm flex items-center justify-between group transition-colors ${m?"bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium":"text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`,g.innerHTML=`
                <span class="truncate">${h.name}</span>
                ${m?'<svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>':""}
            `,g.addEventListener("click",()=>{m||Vs(h.id),o()}),s.appendChild(g)})})}function xc(){const n=document.getElementById("sidebar"),t=document.getElementById("sidebar-open-btn"),e=document.getElementById("sidebar-close-btn");if(!n||!t||!e)return;const s=n.classList.contains("sidebar-closed");if(window.innerWidth>=768){t.classList.toggle("hidden",!s),e.classList.toggle("hidden",s),n.classList.toggle("hidden",s);const i=document.getElementById("sidebar-resizer");i&&i.classList.toggle("hidden",s)}else t.classList.remove("hidden"),e.classList.remove("hidden"),n.classList.remove("hidden")}function aC(){var e,s,i,r,o,a,l,c,d,h;const n=(g,m=null)=>document.dispatchEvent(new CustomEvent("route-change",{detail:{page:g,id:m}}));(e=document.getElementById("nav-dashboard"))==null||e.addEventListener("click",g=>{g.preventDefault(),n("dashboard")}),(s=document.getElementById("nav-inbox"))==null||s.addEventListener("click",g=>{g.preventDefault(),n("inbox")}),(i=document.getElementById("nav-search"))==null||i.addEventListener("click",g=>{g.preventDefault(),n("search")}),(r=document.getElementById("nav-settings"))==null||r.addEventListener("click",g=>{g.preventDefault(),wa()}),(o=document.getElementById("add-project-btn"))==null||o.addEventListener("click",()=>{Sy()}),(a=document.getElementById("add-filter-btn"))==null||a.addEventListener("click",()=>{Ay()}),(l=document.getElementById("edit-timeblocks-btn"))==null||l.addEventListener("click",()=>{Ry()});const t=()=>{const g=document.getElementById("sidebar");if(!g)return;if(window.innerWidth<768)g.classList.toggle("-translate-x-full");else if(g.classList.toggle("sidebar-closed"),xc(),g.classList.contains("sidebar-closed"))localStorage.setItem("sidebarWidth",g.style.width.replace("px","")),g.style.width="";else{const y=localStorage.getItem("sidebarWidth")||"280";g.style.width=`${y}px`}};(c=document.getElementById("sidebar-open-btn"))==null||c.addEventListener("click",t),(d=document.getElementById("sidebar-close-btn"))==null||d.addEventListener("click",t),(h=document.getElementById("sidebar-close-mobile"))==null||h.addEventListener("click",t)}let xe=[],Is=[],Zo=[],kc,Ec,Ic,Tc,Ac,ln,id=!1;function lC(){wI(),XI(),x0(),mT(),cC();try{const n=localStorage.getItem("lastPage");if(n){const{page:t,id:e}=JSON.parse(n);Ni({type:t,id:e||null})}else Ni({type:"inbox"})}catch(n){console.error("Failed to restore page state:",n),Ni({type:"inbox"})}p_(Ft,n=>{vI(n),n?(rC(),ln||(ln=Mu(t=>{const e=ce();e&&!id&&(console.log("Workspace ready, starting data sync:",e),Ly())}))):(ln&&(ln(),ln=null),rd(),QP())})}function Ly(){rd(!1);const n=ce();if(!n){console.error("Cannot start sync: No workspace selected");return}id=!0,console.log("Starting subscriptions for workspace:",n),kc=OI(t=>{xe=t.map(e=>({id:e.id,...e})),fe()}),Ec=Ey(t=>{Is=t,nd(Is,xe),fe()}),Ic=pT(t=>{Zo=t,fe()}),Tc=k0(t=>{sd(xe),fe()}),Ac=w0(t=>{fe()})}function rd(n=!1){kc&&kc(),Ec&&Ec(),Ic&&Ic(),Tc&&Tc(),Ac&&Ac(),n&&ln&&(ln(),ln=null),sT(),BI(),xe=[],Is=[],Zo=[],id=!1,fe()}function fe(){(Is.length||xe.length)&&nd(Is,xe),Zo.length||xe.length,sd(xe),Cy(xe),JP(xe,Is,Zo)}function cC(){var n,t;document.addEventListener("workspace-changed",e=>{const s=e.detail.workspaceId;console.log("Workspace changed to:",s);const i=document.getElementById("header-title");i&&(i.textContent="読み込み中..."),Ft.currentUser&&(rd(!1),Ly(),fe())}),document.addEventListener("route-change",e=>{Ni({type:e.detail.page,id:e.detail.id}),localStorage.setItem("lastPage",JSON.stringify({page:e.detail.page,id:e.detail.id||null})),fe()}),(n=document.getElementById("search-input"))==null||n.addEventListener("input",fe),(t=document.getElementById("toggle-completed-btn"))==null||t.addEventListener("click",e=>{e.currentTarget.classList.toggle("text-blue-500"),fe()}),uC()}function uC(){const n=document.getElementById("sort-trigger"),t=document.getElementById("sort-menu"),e=document.getElementById("sort-label"),s=document.querySelectorAll(".sort-option");if(!n||!t||!e)return;const i=o=>{o&&(t.contains(o.target)||n.contains(o.target))||r(!1)},r=o=>{o?(t.classList.replace("opacity-0","opacity-100"),t.classList.replace("invisible","visible"),t.classList.replace("scale-95","scale-100"),t.classList.replace("pointer-events-none","pointer-events-auto"),document.addEventListener("click",i)):(t.classList.replace("opacity-100","opacity-0"),t.classList.replace("visible","invisible"),t.classList.replace("scale-100","scale-95"),t.classList.replace("pointer-events-auto","pointer-events-none"),document.removeEventListener("click",i))};n.addEventListener("click",o=>{o.stopPropagation();const a=t.classList.contains("opacity-100");r(!a)}),s.forEach(o=>{o.addEventListener("click",a=>{const l=o.dataset.value,c=o.textContent;e.textContent=c,n.dataset.value=l,fe(),r(!1)})}),n.dataset.value||(n.dataset.value="createdAt_desc",e.textContent="作成日(新しい順)")}document.addEventListener("DOMContentLoaded",()=>{console.log("Main: DOMContentLoaded"),(()=>{let t=document.querySelector("link[rel*='icon']");t||(t=document.createElement("link"),t.rel="icon",document.head.appendChild(t)),t.type="image/png",t.href="/images/favicon-96x96.png"})(),lC()});
