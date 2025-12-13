var Iy=Object.defineProperty;var Ty=(n,t,e)=>t in n?Iy(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var B=(n,t,e)=>Ty(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();var Sh={};/**
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
 */const xg=function(n){const t=[];let e=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Ay=function(n){const t=[];let e=0,i=0;for(;e<n.length;){const s=n[e++];if(s<128)t[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=n[e++];t[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=n[e++],o=n[e++],a=n[e++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;t[i++]=String.fromCharCode(55296+(l>>10)),t[i++]=String.fromCharCode(56320+(l&1023))}else{const r=n[e++],o=n[e++];t[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return t.join("")},Eg={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){const r=n[s],o=s+1<n.length,a=o?n[s+1]:0,l=s+2<n.length,u=l?n[s+2]:0,h=r>>2,d=(r&3)<<4|a>>4;let g=(a&15)<<2|u>>6,m=u&63;l||(m=64,o||(g=64)),i.push(e[h],e[d],e[g],e[m])}return i.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(xg(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):Ay(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){const r=e[n.charAt(s++)],a=s<n.length?e[n.charAt(s)]:0;++s;const u=s<n.length?e[n.charAt(s)]:64;++s;const d=s<n.length?e[n.charAt(s)]:64;if(++s,r==null||a==null||u==null||d==null)throw new Sy;const g=r<<2|a>>4;if(i.push(g),u!==64){const m=a<<4&240|u>>2;if(i.push(m),d!==64){const y=u<<6&192|d;i.push(y)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Sy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Py=function(n){const t=xg(n);return Eg.encodeByteArray(t,!0)},fo=function(n){return Py(n).replace(/\./g,"")},kg=function(n){try{return Eg.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function Ry(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Cy=()=>Ry().__FIREBASE_DEFAULTS__,Dy=()=>{if(typeof process>"u"||typeof Sh>"u")return;const n=Sh.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},My=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&kg(n[1]);return t&&JSON.parse(t)},Uo=()=>{try{return Cy()||Dy()||My()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ig=n=>{var t,e;return(e=(t=Uo())===null||t===void 0?void 0:t.emulatorHosts)===null||e===void 0?void 0:e[n]},Ly=n=>{const t=Ig(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const i=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),i]:[t.substring(0,e),i]},Tg=()=>{var n;return(n=Uo())===null||n===void 0?void 0:n.config},Ag=n=>{var t;return(t=Uo())===null||t===void 0?void 0:t[`_${n}`]};/**
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
 */class Oy{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,i)=>{e?this.reject(e):this.resolve(i),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,i))}}}/**
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
 */function Vy(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},i=t||"demo-project",s=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[fo(JSON.stringify(e)),fo(JSON.stringify(o)),""].join(".")}/**
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
 */function Kt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ny(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Kt())}function Fy(){var n;const t=(n=Uo())===null||n===void 0?void 0:n.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function By(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Uy(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function jy(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function zy(){const n=Kt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function $y(){return!Fy()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Hy(){try{return typeof indexedDB=="object"}catch{return!1}}function Wy(){return new Promise((n,t)=>{try{let e=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var r;t(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(e){t(e)}})}/**
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
 */const qy="FirebaseError";class Ye extends Error{constructor(t,e,i){super(e),this.code=t,this.customData=i,this.name=qy,Object.setPrototypeOf(this,Ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,qs.prototype.create)}}class qs{constructor(t,e,i){this.service=t,this.serviceName=e,this.errors=i}create(t,...e){const i=e[0]||{},s=`${this.service}/${t}`,r=this.errors[t],o=r?Ky(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new Ye(s,a,i)}}function Ky(n,t){return n.replace(Gy,(e,i)=>{const s=t[i];return s!=null?String(s):`<${i}?>`})}const Gy=/\{\$([^}]+)}/g;function Yy(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function go(n,t){if(n===t)return!0;const e=Object.keys(n),i=Object.keys(t);for(const s of e){if(!i.includes(s))return!1;const r=n[s],o=t[s];if(Ph(r)&&Ph(o)){if(!go(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!e.includes(s))return!1;return!0}function Ph(n){return n!==null&&typeof n=="object"}/**
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
 */function Ks(n){const t=[];for(const[e,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(i));return t.length?"&"+t.join("&"):""}function os(n){const t={};return n.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[s,r]=i.split("=");t[decodeURIComponent(s)]=decodeURIComponent(r)}}),t}function as(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function Qy(n,t){const e=new Xy(n,t);return e.subscribe.bind(e)}class Xy{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(i=>{this.error(i)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,i){let s;if(t===void 0&&e===void 0&&i===void 0)throw new Error("Missing Observer.");Jy(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:i},s.next===void 0&&(s.next=Va),s.error===void 0&&(s.error=Va),s.complete===void 0&&(s.complete=Va);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Jy(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Va(){}/**
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
 */function At(n){return n&&n._delegate?n._delegate:n}class Wn{constructor(t,e,i){this.name=t,this.instanceFactory=e,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */const Vn="[DEFAULT]";/**
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
 */class Zy{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const i=new Oy;if(this.instancesDeferred.set(e,i),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const i=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(e=t==null?void 0:t.optional)!==null&&e!==void 0?e:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(e_(t))try{this.getOrInitializeService({instanceIdentifier:Vn})}catch{}for(const[e,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(t=Vn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Vn){return this.instances.has(t)}getOptions(t=Vn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,i=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:e});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(t,e){var i;const s=this.normalizeInstanceIdentifier(e),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(t),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&t(o,s),()=>{r.delete(t)}}invokeOnInitCallbacks(t,e){const i=this.onInitCallbacks.get(e);if(i)for(const s of i)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let i=this.instances.get(t);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:t_(t),options:e}),this.instances.set(t,i),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(i,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,i)}catch{}return i||null}normalizeInstanceIdentifier(t=Vn){return this.component?this.component.multipleInstances?t:Vn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function t_(n){return n===Vn?void 0:n}function e_(n){return n.instantiationMode==="EAGER"}/**
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
 */class n_{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Zy(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var X;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(X||(X={}));const i_={debug:X.DEBUG,verbose:X.VERBOSE,info:X.INFO,warn:X.WARN,error:X.ERROR,silent:X.SILENT},s_=X.INFO,r_={[X.DEBUG]:"log",[X.VERBOSE]:"log",[X.INFO]:"info",[X.WARN]:"warn",[X.ERROR]:"error"},o_=(n,t,...e)=>{if(t<n.logLevel)return;const i=new Date().toISOString(),s=r_[t];if(s)console[s](`[${i}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class oc{constructor(t){this.name=t,this._logLevel=s_,this._logHandler=o_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in X))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?i_[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,X.DEBUG,...t),this._logHandler(this,X.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,X.VERBOSE,...t),this._logHandler(this,X.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,X.INFO,...t),this._logHandler(this,X.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,X.WARN,...t),this._logHandler(this,X.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,X.ERROR,...t),this._logHandler(this,X.ERROR,...t)}}const a_=(n,t)=>t.some(e=>n instanceof e);let Rh,Ch;function l_(){return Rh||(Rh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function c_(){return Ch||(Ch=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Sg=new WeakMap,gl=new WeakMap,Pg=new WeakMap,Na=new WeakMap,ac=new WeakMap;function u_(n){const t=new Promise((e,i)=>{const s=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{e(dn(n.result)),s()},o=()=>{i(n.error),s()};n.addEventListener("success",r),n.addEventListener("error",o)});return t.then(e=>{e instanceof IDBCursor&&Sg.set(e,n)}).catch(()=>{}),ac.set(t,n),t}function h_(n){if(gl.has(n))return;const t=new Promise((e,i)=>{const s=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{e(),s()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});gl.set(n,t)}let pl={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return gl.get(n);if(t==="objectStoreNames")return n.objectStoreNames||Pg.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return dn(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function d_(n){pl=n(pl)}function f_(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const i=n.call(Fa(this),t,...e);return Pg.set(i,t.sort?t.sort():[t]),dn(i)}:c_().includes(n)?function(...t){return n.apply(Fa(this),t),dn(Sg.get(this))}:function(...t){return dn(n.apply(Fa(this),t))}}function g_(n){return typeof n=="function"?f_(n):(n instanceof IDBTransaction&&h_(n),a_(n,l_())?new Proxy(n,pl):n)}function dn(n){if(n instanceof IDBRequest)return u_(n);if(Na.has(n))return Na.get(n);const t=g_(n);return t!==n&&(Na.set(n,t),ac.set(t,n)),t}const Fa=n=>ac.get(n);function p_(n,t,{blocked:e,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(n,t),a=dn(o);return i&&o.addEventListener("upgradeneeded",l=>{i(dn(o.result),l.oldVersion,l.newVersion,dn(o.transaction),l)}),e&&o.addEventListener("blocked",l=>e(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",u=>s(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}const m_=["get","getKey","getAll","getAllKeys","count"],y_=["put","add","delete","clear"],Ba=new Map;function Dh(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(Ba.get(t))return Ba.get(t);const e=t.replace(/FromIndex$/,""),i=t!==e,s=y_.includes(e);if(!(e in(i?IDBIndex:IDBObjectStore).prototype)||!(s||m_.includes(e)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let u=l.store;return i&&(u=u.index(a.shift())),(await Promise.all([u[e](...a),s&&l.done]))[0]};return Ba.set(t,r),r}d_(n=>({...n,get:(t,e,i)=>Dh(t,e)||n.get(t,e,i),has:(t,e)=>!!Dh(t,e)||n.has(t,e)}));/**
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
 */class __{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(b_(e)){const i=e.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(e=>e).join(" ")}}function b_(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const ml="@firebase/app",Mh="0.10.13";/**
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
 */const We=new oc("@firebase/app"),v_="@firebase/app-compat",w_="@firebase/analytics-compat",x_="@firebase/analytics",E_="@firebase/app-check-compat",k_="@firebase/app-check",I_="@firebase/auth",T_="@firebase/auth-compat",A_="@firebase/database",S_="@firebase/data-connect",P_="@firebase/database-compat",R_="@firebase/functions",C_="@firebase/functions-compat",D_="@firebase/installations",M_="@firebase/installations-compat",L_="@firebase/messaging",O_="@firebase/messaging-compat",V_="@firebase/performance",N_="@firebase/performance-compat",F_="@firebase/remote-config",B_="@firebase/remote-config-compat",U_="@firebase/storage",j_="@firebase/storage-compat",z_="@firebase/firestore",$_="@firebase/vertexai-preview",H_="@firebase/firestore-compat",W_="firebase",q_="10.14.1";/**
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
 */const yl="[DEFAULT]",K_={[ml]:"fire-core",[v_]:"fire-core-compat",[x_]:"fire-analytics",[w_]:"fire-analytics-compat",[k_]:"fire-app-check",[E_]:"fire-app-check-compat",[I_]:"fire-auth",[T_]:"fire-auth-compat",[A_]:"fire-rtdb",[S_]:"fire-data-connect",[P_]:"fire-rtdb-compat",[R_]:"fire-fn",[C_]:"fire-fn-compat",[D_]:"fire-iid",[M_]:"fire-iid-compat",[L_]:"fire-fcm",[O_]:"fire-fcm-compat",[V_]:"fire-perf",[N_]:"fire-perf-compat",[F_]:"fire-rc",[B_]:"fire-rc-compat",[U_]:"fire-gcs",[j_]:"fire-gcs-compat",[z_]:"fire-fst",[H_]:"fire-fst-compat",[$_]:"fire-vertex","fire-js":"fire-js",[W_]:"fire-js-all"};/**
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
 */const po=new Map,G_=new Map,_l=new Map;function Lh(n,t){try{n.container.addComponent(t)}catch(e){We.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function wi(n){const t=n.name;if(_l.has(t))return We.debug(`There were multiple attempts to register component ${t}.`),!1;_l.set(t,n);for(const e of po.values())Lh(e,n);for(const e of G_.values())Lh(e,n);return!0}function lc(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function Ve(n){return n.settings!==void 0}/**
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
 */const Y_={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},fn=new qs("app","Firebase",Y_);/**
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
 */class Q_{constructor(t,e,i){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Wn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw fn.create("app-deleted",{appName:this._name})}}/**
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
 */const Li=q_;function Rg(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const i=Object.assign({name:yl,automaticDataCollectionEnabled:!1},t),s=i.name;if(typeof s!="string"||!s)throw fn.create("bad-app-name",{appName:String(s)});if(e||(e=Tg()),!e)throw fn.create("no-options");const r=po.get(s);if(r){if(go(e,r.options)&&go(i,r.config))return r;throw fn.create("duplicate-app",{appName:s})}const o=new n_(s);for(const l of _l.values())o.addComponent(l);const a=new Q_(e,i,o);return po.set(s,a),a}function Cg(n=yl){const t=po.get(n);if(!t&&n===yl&&Tg())return Rg();if(!t)throw fn.create("no-app",{appName:n});return t}function gn(n,t,e){var i;let s=(i=K_[n])!==null&&i!==void 0?i:n;e&&(s+=`-${e}`);const r=s.match(/\s|\//),o=t.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${t}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),We.warn(a.join(" "));return}wi(new Wn(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
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
 */const X_="firebase-heartbeat-database",J_=1,Ps="firebase-heartbeat-store";let Ua=null;function Dg(){return Ua||(Ua=p_(X_,J_,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Ps)}catch(e){console.warn(e)}}}}).catch(n=>{throw fn.create("idb-open",{originalErrorMessage:n.message})})),Ua}async function Z_(n){try{const e=(await Dg()).transaction(Ps),i=await e.objectStore(Ps).get(Mg(n));return await e.done,i}catch(t){if(t instanceof Ye)We.warn(t.message);else{const e=fn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});We.warn(e.message)}}}async function Oh(n,t){try{const i=(await Dg()).transaction(Ps,"readwrite");await i.objectStore(Ps).put(t,Mg(n)),await i.done}catch(e){if(e instanceof Ye)We.warn(e.message);else{const i=fn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});We.warn(i.message)}}}function Mg(n){return`${n.name}!${n.options.appId}`}/**
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
 */const tb=1024,eb=30*24*60*60*1e3;class nb{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new sb(e),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Vh();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=eb}),this._storage.overwrite(this._heartbeatsCache))}catch(i){We.warn(i)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Vh(),{heartbeatsToSend:i,unsentEntries:s}=ib(this._heartbeatsCache.heartbeats),r=fo(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return We.warn(e),""}}}function Vh(){return new Date().toISOString().substring(0,10)}function ib(n,t=tb){const e=[];let i=n.slice();for(const s of n){const r=e.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),Nh(e)>t){r.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),Nh(e)>t){e.pop();break}i=i.slice(1)}return{heartbeatsToSend:e,unsentEntries:i}}class sb{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Hy()?Wy().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Z_(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Oh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Oh(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function Nh(n){return fo(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function rb(n){wi(new Wn("platform-logger",t=>new __(t),"PRIVATE")),wi(new Wn("heartbeat",t=>new nb(t),"PRIVATE")),gn(ml,Mh,n),gn(ml,Mh,"esm2017"),gn("fire-js","")}rb("");function cc(n,t){var e={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&t.indexOf(i)<0&&(e[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,i=Object.getOwnPropertySymbols(n);s<i.length;s++)t.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(n,i[s])&&(e[i[s]]=n[i[s]]);return e}function Lg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ob=Lg,Og=new qs("auth","Firebase",Lg());/**
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
 */const mo=new oc("@firebase/auth");function ab(n,...t){mo.logLevel<=X.WARN&&mo.warn(`Auth (${Li}): ${n}`,...t)}function Wr(n,...t){mo.logLevel<=X.ERROR&&mo.error(`Auth (${Li}): ${n}`,...t)}/**
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
 */function pe(n,...t){throw uc(n,...t)}function ve(n,...t){return uc(n,...t)}function Vg(n,t,e){const i=Object.assign(Object.assign({},ob()),{[t]:e});return new qs("auth","Firebase",i).create(t,{appName:n.name})}function pn(n){return Vg(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function uc(n,...t){if(typeof n!="string"){const e=t[0],i=[...t.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(e,...i)}return Og.create(n,...t)}function $(n,t,...e){if(!n)throw uc(t,...e)}function Ne(n){const t="INTERNAL ASSERTION FAILED: "+n;throw Wr(t),new Error(t)}function qe(n,t){n||Ne(t)}/**
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
 */function bl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function lb(){return Fh()==="http:"||Fh()==="https:"}function Fh(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function cb(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(lb()||Uy()||"connection"in navigator)?navigator.onLine:!0}function ub(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Gs{constructor(t,e){this.shortDelay=t,this.longDelay=e,qe(e>t,"Short delay should be less than long delay!"),this.isMobile=Ny()||jy()}get(){return cb()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function hc(n,t){qe(n.emulator,"Emulator should always be set here");const{url:e}=n.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
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
 */class Ng{static initialize(t,e,i){this.fetchImpl=t,e&&(this.headersImpl=e),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ne("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ne("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ne("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const hb={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const db=new Gs(3e4,6e4);function Xn(n,t){return n.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:n.tenantId}):t}async function Qe(n,t,e,i,s={}){return Fg(n,s,async()=>{let r={},o={};i&&(t==="GET"?o=i:r={body:JSON.stringify(i)});const a=Ks(Object.assign({key:n.config.apiKey},o)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const u=Object.assign({method:t,headers:l},r);return By()||(u.referrerPolicy="no-referrer"),Ng.fetch()(Bg(n,n.config.apiHost,e,a),u)})}async function Fg(n,t,e){n._canInitEmulator=!1;const i=Object.assign(Object.assign({},hb),t);try{const s=new gb(n),r=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Tr(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const a=r.ok?o.errorMessage:o.error.message,[l,u]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Tr(n,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw Tr(n,"email-already-in-use",o);if(l==="USER_DISABLED")throw Tr(n,"user-disabled",o);const h=i[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Vg(n,h,u);pe(n,h)}}catch(s){if(s instanceof Ye)throw s;pe(n,"network-request-failed",{message:String(s)})}}async function jo(n,t,e,i,s={}){const r=await Qe(n,t,e,i,s);return"mfaPendingCredential"in r&&pe(n,"multi-factor-auth-required",{_serverResponse:r}),r}function Bg(n,t,e,i){const s=`${t}${e}?${i}`;return n.config.emulator?hc(n.config,s):`${n.config.apiScheme}://${s}`}function fb(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class gb{constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,i)=>{this.timer=setTimeout(()=>i(ve(this.auth,"network-request-failed")),db.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Tr(n,t,e){const i={appName:n.name};e.email&&(i.email=e.email),e.phoneNumber&&(i.phoneNumber=e.phoneNumber);const s=ve(n,t,i);return s.customData._tokenResponse=e,s}function Bh(n){return n!==void 0&&n.enterprise!==void 0}class pb{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return fb(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}}async function mb(n,t){return Qe(n,"GET","/v2/recaptchaConfig",Xn(n,t))}/**
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
 */async function yb(n,t){return Qe(n,"POST","/v1/accounts:delete",t)}async function Ug(n,t){return Qe(n,"POST","/v1/accounts:lookup",t)}/**
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
 */function bs(n){if(n)try{const t=new Date(Number(n));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function _b(n,t=!1){const e=At(n),i=await e.getIdToken(t),s=dc(i);$(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:s,token:i,authTime:bs(ja(s.auth_time)),issuedAtTime:bs(ja(s.iat)),expirationTime:bs(ja(s.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function ja(n){return Number(n)*1e3}function dc(n){const[t,e,i]=n.split(".");if(t===void 0||e===void 0||i===void 0)return Wr("JWT malformed, contained fewer than 3 sections"),null;try{const s=kg(e);return s?JSON.parse(s):(Wr("Failed to decode base64 JWT payload"),null)}catch(s){return Wr("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Uh(n){const t=dc(n);return $(t,"internal-error"),$(typeof t.exp<"u","internal-error"),$(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
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
 */async function xi(n,t,e=!1){if(e)return t;try{return await t}catch(i){throw i instanceof Ye&&bb(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function bb({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class vb{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class vl{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=bs(this.lastLoginAt),this.creationTime=bs(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function yo(n){var t;const e=n.auth,i=await n.getIdToken(),s=await xi(n,Ug(e,{idToken:i}));$(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];n._notifyReloadListener(r);const o=!((t=r.providerUserInfo)===null||t===void 0)&&t.length?jg(r.providerUserInfo):[],a=xb(n.providerData,o),l=n.isAnonymous,u=!(n.email&&r.passwordHash)&&!(a!=null&&a.length),h=l?u:!1,d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new vl(r.createdAt,r.lastLoginAt),isAnonymous:h};Object.assign(n,d)}async function wb(n){const t=At(n);await yo(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function xb(n,t){return[...n.filter(i=>!t.some(s=>s.providerId===i.providerId)),...t]}function jg(n){return n.map(t=>{var{providerId:e}=t,i=cc(t,["providerId"]);return{providerId:e,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
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
 */async function Eb(n,t){const e=await Fg(n,{},async()=>{const i=Ks({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:r}=n.config,o=Bg(n,s,"/v1/token",`key=${r}`),a=await n._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",Ng.fetch()(o,{method:"POST",headers:a,body:i})});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function kb(n,t){return Qe(n,"POST","/v2/accounts:revokeToken",Xn(n,t))}/**
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
 */class pi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){$(t.idToken,"internal-error"),$(typeof t.idToken<"u","internal-error"),$(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):Uh(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){$(t.length!==0,"internal-error");const e=Uh(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:($(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:i,refreshToken:s,expiresIn:r}=await Eb(t,e);this.updateTokensAndExpiration(i,s,Number(r))}updateTokensAndExpiration(t,e,i){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(t,e){const{refreshToken:i,accessToken:s,expirationTime:r}=e,o=new pi;return i&&($(typeof i=="string","internal-error",{appName:t}),o.refreshToken=i),s&&($(typeof s=="string","internal-error",{appName:t}),o.accessToken=s),r&&($(typeof r=="number","internal-error",{appName:t}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new pi,this.toJSON())}_performRefresh(){return Ne("not implemented")}}/**
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
 */function tn(n,t){$(typeof n=="string"||typeof n>"u","internal-error",{appName:t})}class Fe{constructor(t){var{uid:e,auth:i,stsTokenManager:s}=t,r=cc(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new vb(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=i,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new vl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(t){const e=await xi(this,this.stsTokenManager.getToken(this.auth,t));return $(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return _b(this,t)}reload(){return wb(this)}_assign(t){this!==t&&($(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Fe(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){$(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let i=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),i=!0),e&&await yo(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ve(this.auth.app))return Promise.reject(pn(this.auth));const t=await this.getIdToken();return await xi(this,yb(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var i,s,r,o,a,l,u,h;const d=(i=e.displayName)!==null&&i!==void 0?i:void 0,g=(s=e.email)!==null&&s!==void 0?s:void 0,m=(r=e.phoneNumber)!==null&&r!==void 0?r:void 0,y=(o=e.photoURL)!==null&&o!==void 0?o:void 0,v=(a=e.tenantId)!==null&&a!==void 0?a:void 0,w=(l=e._redirectEventId)!==null&&l!==void 0?l:void 0,A=(u=e.createdAt)!==null&&u!==void 0?u:void 0,R=(h=e.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:D,emailVerified:L,isAnonymous:M,providerData:V,stsTokenManager:E}=e;$(D&&E,t,"internal-error");const b=pi.fromJSON(this.name,E);$(typeof D=="string",t,"internal-error"),tn(d,t.name),tn(g,t.name),$(typeof L=="boolean",t,"internal-error"),$(typeof M=="boolean",t,"internal-error"),tn(m,t.name),tn(y,t.name),tn(v,t.name),tn(w,t.name),tn(A,t.name),tn(R,t.name);const x=new Fe({uid:D,auth:t,email:g,emailVerified:L,displayName:d,isAnonymous:M,photoURL:y,phoneNumber:m,tenantId:v,stsTokenManager:b,createdAt:A,lastLoginAt:R});return V&&Array.isArray(V)&&(x.providerData=V.map(I=>Object.assign({},I))),w&&(x._redirectEventId=w),x}static async _fromIdTokenResponse(t,e,i=!1){const s=new pi;s.updateFromServerResponse(e);const r=new Fe({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:i});return await yo(r),r}static async _fromGetAccountInfoResponse(t,e,i){const s=e.users[0];$(s.localId!==void 0,"internal-error");const r=s.providerUserInfo!==void 0?jg(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(r!=null&&r.length),a=new pi;a.updateFromIdToken(i);const l=new Fe({uid:s.localId,auth:t,stsTokenManager:a,isAnonymous:o}),u={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new vl(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(r!=null&&r.length)};return Object.assign(l,u),l}}/**
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
 */const jh=new Map;function Be(n){qe(n instanceof Function,"Expected a class definition");let t=jh.get(n);return t?(qe(t instanceof n,"Instance stored in cache mismatched with class"),t):(t=new n,jh.set(n,t),t)}/**
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
 */class zg{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}zg.type="NONE";const zh=zg;/**
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
 */function qr(n,t,e){return`firebase:${n}:${t}:${e}`}class mi{constructor(t,e,i){this.persistence=t,this.auth=e,this.userKey=i;const{config:s,name:r}=this.auth;this.fullUserKey=qr(this.userKey,s.apiKey,r),this.fullPersistenceKey=qr("persistence",s.apiKey,r),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);return t?Fe._fromJSON(this.auth,t):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,i="authUser"){if(!e.length)return new mi(Be(zh),t,i);const s=(await Promise.all(e.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let r=s[0]||Be(zh);const o=qr(i,t.config.apiKey,t.name);let a=null;for(const u of e)try{const h=await u._get(o);if(h){const d=Fe._fromJSON(t,h);u!==r&&(a=d),r=u;break}}catch{}const l=s.filter(u=>u._shouldAllowMigration);return!r._shouldAllowMigration||!l.length?new mi(r,t,i):(r=l[0],a&&await r._set(o,a.toJSON()),await Promise.all(e.map(async u=>{if(u!==r)try{await u._remove(o)}catch{}})),new mi(r,t,i))}}/**
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
 */function $h(n){const t=n.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(qg(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if($g(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Gg(t))return"Blackberry";if(Yg(t))return"Webos";if(Hg(t))return"Safari";if((t.includes("chrome/")||Wg(t))&&!t.includes("edge/"))return"Chrome";if(Kg(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(e);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function $g(n=Kt()){return/firefox\//i.test(n)}function Hg(n=Kt()){const t=n.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Wg(n=Kt()){return/crios\//i.test(n)}function qg(n=Kt()){return/iemobile/i.test(n)}function Kg(n=Kt()){return/android/i.test(n)}function Gg(n=Kt()){return/blackberry/i.test(n)}function Yg(n=Kt()){return/webos/i.test(n)}function fc(n=Kt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Ib(n=Kt()){var t;return fc(n)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function Tb(){return zy()&&document.documentMode===10}function Qg(n=Kt()){return fc(n)||Kg(n)||Yg(n)||Gg(n)||/windows phone/i.test(n)||qg(n)}/**
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
 */function Xg(n,t=[]){let e;switch(n){case"Browser":e=$h(Kt());break;case"Worker":e=`${$h(Kt())}-${n}`;break;default:e=n}const i=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Li}/${i}`}/**
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
 */class Ab{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const i=r=>new Promise((o,a)=>{try{const l=t(r);o(l)}catch(l){a(l)}});i.onAbort=e,this.queue.push(i);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const i of this.queue)await i(t),i.onAbort&&e.push(i.onAbort)}catch(i){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function Sb(n,t={}){return Qe(n,"GET","/v2/passwordPolicy",Xn(n,t))}/**
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
 */const Pb=6;class Rb{constructor(t){var e,i,s,r;const o=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=o.minPasswordLength)!==null&&e!==void 0?e:Pb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(i=t.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(r=t.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,i,s,r,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,l),this.validatePasswordCharacterOptions(t,l),l.isValid&&(l.isValid=(e=l.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),l.isValid&&(l.isValid=(i=l.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsLowercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(r=l.containsUppercaseLetter)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(t,e){const i=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;i&&(e.meetsMinPasswordLength=t.length>=i),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let i;for(let s=0;s<t.length;s++)i=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(t,e,i,s,r){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=r))}}/**
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
 */class Cb{constructor(t,e,i,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=i,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Hh(this),this.idTokenSubscription=new Hh(this),this.beforeStateQueue=new Ab(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Og,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=Be(e)),this._initializationPromise=this.queue(async()=>{var i,s;if(!this._deleted&&(this.persistenceManager=await mi.create(this,t),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await Ug(this,{idToken:t}),i=await Fe._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(i)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(Ve(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let s=i,r=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,a=s==null?void 0:s._redirectEventId,l=await this.tryRedirectSignIn(t);(!o||o===a)&&(l!=null&&l.user)&&(s=l.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return $(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await yo(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=ub()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Ve(this.app))return Promise.reject(pn(this));const e=t?At(t):null;return e&&$(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&$(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Ve(this.app)?Promise.reject(pn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Ve(this.app)?Promise.reject(pn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Be(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await Sb(this),e=new Rb(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(t){this._errorFactory=new qs("auth","Firebase",t())}onAuthStateChanged(t,e,i){return this.registerStateListener(this.authStateSubscription,t,e,i)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,i){return this.registerStateListener(this.idTokenSubscription,t,e,i)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const i=this.onAuthStateChanged(()=>{i(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(i.tenantId=this.tenantId),await kb(this,i)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const i=await this.getOrInitRedirectPersistenceManager(e);return t===null?i.removeCurrentUser():i.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&Be(t)||this._popupRedirectResolver;$(e,this,"argument-error"),this.redirectPersistenceManager=await mi.create(this,[Be(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,i;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,i,s){if(this._deleted)return()=>{};const r=typeof e=="function"?e:e.next.bind(e);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if($(a,this,"internal-error"),a.then(()=>{o||r(this.currentUser)}),typeof e=="function"){const l=t.addObserver(e,i,s);return()=>{o=!0,l()}}else{const l=t.addObserver(e);return()=>{o=!0,l()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return $(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Xg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const i=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());i&&(e["X-Firebase-Client"]=i);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&ab(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Oi(n){return At(n)}class Hh{constructor(t){this.auth=t,this.observer=null,this.addObserver=Qy(e=>this.observer=e)}get next(){return $(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let zo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Db(n){zo=n}function Jg(n){return zo.loadJS(n)}function Mb(){return zo.recaptchaEnterpriseScript}function Lb(){return zo.gapiScript}function Ob(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Vb="recaptcha-enterprise",Nb="NO_RECAPTCHA";class Fb{constructor(t){this.type=Vb,this.auth=Oi(t)}async verify(t="verify",e=!1){async function i(r){if(!e){if(r.tenantId==null&&r._agentRecaptchaConfig!=null)return r._agentRecaptchaConfig.siteKey;if(r.tenantId!=null&&r._tenantRecaptchaConfigs[r.tenantId]!==void 0)return r._tenantRecaptchaConfigs[r.tenantId].siteKey}return new Promise(async(o,a)=>{mb(r,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const u=new pb(l);return r.tenantId==null?r._agentRecaptchaConfig=u:r._tenantRecaptchaConfigs[r.tenantId]=u,o(u.siteKey)}}).catch(l=>{a(l)})})}function s(r,o,a){const l=window.grecaptcha;Bh(l)?l.enterprise.ready(()=>{l.enterprise.execute(r,{action:t}).then(u=>{o(u)}).catch(()=>{o(Nb)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((r,o)=>{i(this.auth).then(a=>{if(!e&&Bh(window.grecaptcha))s(a,r,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Mb();l.length!==0&&(l+=a),Jg(l).then(()=>{s(a,r,o)}).catch(u=>{o(u)})}}).catch(a=>{o(a)})})}}async function Wh(n,t,e,i=!1){const s=new Fb(n);let r;try{r=await s.verify(e)}catch{r=await s.verify(e,!0)}const o=Object.assign({},t);return i?Object.assign(o,{captchaResp:r}):Object.assign(o,{captchaResponse:r}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function qh(n,t,e,i){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const r=await Wh(n,t,e,e==="getOobCode");return i(n,r)}else return i(n,t).catch(async r=>{if(r.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Wh(n,t,e,e==="getOobCode");return i(n,o)}else return Promise.reject(r)})}/**
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
 */function Bb(n,t){const e=lc(n,"auth");if(e.isInitialized()){const s=e.getImmediate(),r=e.getOptions();if(go(r,t??{}))return s;pe(s,"already-initialized")}return e.initialize({options:t})}function Ub(n,t){const e=(t==null?void 0:t.persistence)||[],i=(Array.isArray(e)?e:[e]).map(Be);t!=null&&t.errorMap&&n._updateErrorMap(t.errorMap),n._initializeWithPersistence(i,t==null?void 0:t.popupRedirectResolver)}function jb(n,t,e){const i=Oi(n);$(i._canInitEmulator,i,"emulator-config-failed"),$(/^https?:\/\//.test(t),i,"invalid-emulator-scheme");const s=!1,r=Zg(t),{host:o,port:a}=zb(t),l=a===null?"":`:${a}`;i.config.emulator={url:`${r}//${o}${l}/`},i.settings.appVerificationDisabledForTesting=!0,i.emulatorConfig=Object.freeze({host:o,port:a,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:s})}),$b()}function Zg(n){const t=n.indexOf(":");return t<0?"":n.substr(0,t+1)}function zb(n){const t=Zg(n),e=/(\/\/)?([^?#/]+)/.exec(n.substr(t.length));if(!e)return{host:"",port:null};const i=e[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(i);if(s){const r=s[1];return{host:r,port:Kh(i.substr(r.length+1))}}else{const[r,o]=i.split(":");return{host:r,port:Kh(o)}}}function Kh(n){if(!n)return null;const t=Number(n);return isNaN(t)?null:t}function $b(){function n(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class gc{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return Ne("not implemented")}_getIdTokenResponse(t){return Ne("not implemented")}_linkToIdToken(t,e){return Ne("not implemented")}_getReauthenticationResolver(t){return Ne("not implemented")}}async function Hb(n,t){return Qe(n,"POST","/v1/accounts:update",t)}async function Wb(n,t){return Qe(n,"POST","/v1/accounts:signUp",t)}/**
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
 */async function qb(n,t){return jo(n,"POST","/v1/accounts:signInWithPassword",Xn(n,t))}/**
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
 */async function Kb(n,t){return jo(n,"POST","/v1/accounts:signInWithEmailLink",Xn(n,t))}async function Gb(n,t){return jo(n,"POST","/v1/accounts:signInWithEmailLink",Xn(n,t))}/**
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
 */class Rs extends gc{constructor(t,e,i,s=null){super("password",i),this._email=t,this._password=e,this._tenantId=s}static _fromEmailAndPassword(t,e){return new Rs(t,e,"password")}static _fromEmailAndCode(t,e,i=null){return new Rs(t,e,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return qh(t,e,"signInWithPassword",qb);case"emailLink":return Kb(t,{email:this._email,oobCode:this._password});default:pe(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const i={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return qh(t,i,"signUpPassword",Wb);case"emailLink":return Gb(t,{idToken:e,email:this._email,oobCode:this._password});default:pe(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
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
 */async function yi(n,t){return jo(n,"POST","/v1/accounts:signInWithIdp",Xn(n,t))}/**
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
 */const Yb="http://localhost";class qn extends gc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new qn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):pe("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:i,signInMethod:s}=e,r=cc(e,["providerId","signInMethod"]);if(!i||!s)return null;const o=new qn(i,s);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(t){const e=this.buildRequest();return yi(t,e)}_linkToIdToken(t,e){const i=this.buildRequest();return i.idToken=e,yi(t,i)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,yi(t,e)}buildRequest(){const t={requestUri:Yb,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=Ks(e)}return t}}/**
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
 */function Qb(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Xb(n){const t=os(as(n)).link,e=t?os(as(t)).deep_link_id:null,i=os(as(n)).deep_link_id;return(i?os(as(i)).link:null)||i||e||t||n}class pc{constructor(t){var e,i,s,r,o,a;const l=os(as(t)),u=(e=l.apiKey)!==null&&e!==void 0?e:null,h=(i=l.oobCode)!==null&&i!==void 0?i:null,d=Qb((s=l.mode)!==null&&s!==void 0?s:null);$(u&&h&&d,"argument-error"),this.apiKey=u,this.operation=d,this.code=h,this.continueUrl=(r=l.continueUrl)!==null&&r!==void 0?r:null,this.languageCode=(o=l.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=l.tenantId)!==null&&a!==void 0?a:null}static parseLink(t){const e=Xb(t);try{return new pc(e)}catch{return null}}}/**
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
 */class Vi{constructor(){this.providerId=Vi.PROVIDER_ID}static credential(t,e){return Rs._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const i=pc.parseLink(e);return $(i,"argument-error"),Rs._fromEmailAndCode(t,i.code,i.tenantId)}}Vi.PROVIDER_ID="password";Vi.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Vi.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class tp{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ys extends tp{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
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
 */class en extends Ys{constructor(){super("facebook.com")}static credential(t){return qn._fromParams({providerId:en.PROVIDER_ID,signInMethod:en.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return en.credentialFromTaggedObject(t)}static credentialFromError(t){return en.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return en.credential(t.oauthAccessToken)}catch{return null}}}en.FACEBOOK_SIGN_IN_METHOD="facebook.com";en.PROVIDER_ID="facebook.com";/**
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
 */class nn extends Ys{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return qn._fromParams({providerId:nn.PROVIDER_ID,signInMethod:nn.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return nn.credentialFromTaggedObject(t)}static credentialFromError(t){return nn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:i}=t;if(!e&&!i)return null;try{return nn.credential(e,i)}catch{return null}}}nn.GOOGLE_SIGN_IN_METHOD="google.com";nn.PROVIDER_ID="google.com";/**
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
 */class sn extends Ys{constructor(){super("github.com")}static credential(t){return qn._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return sn.credentialFromTaggedObject(t)}static credentialFromError(t){return sn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return sn.credential(t.oauthAccessToken)}catch{return null}}}sn.GITHUB_SIGN_IN_METHOD="github.com";sn.PROVIDER_ID="github.com";/**
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
 */class rn extends Ys{constructor(){super("twitter.com")}static credential(t,e){return qn._fromParams({providerId:rn.PROVIDER_ID,signInMethod:rn.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return rn.credentialFromTaggedObject(t)}static credentialFromError(t){return rn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:i}=t;if(!e||!i)return null;try{return rn.credential(e,i)}catch{return null}}}rn.TWITTER_SIGN_IN_METHOD="twitter.com";rn.PROVIDER_ID="twitter.com";/**
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
 */class Ei{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,i,s=!1){const r=await Fe._fromIdTokenResponse(t,i,s),o=Gh(i);return new Ei({user:r,providerId:o,_tokenResponse:i,operationType:e})}static async _forOperation(t,e,i){await t._updateTokensIfNecessary(i,!0);const s=Gh(i);return new Ei({user:t,providerId:s,_tokenResponse:i,operationType:e})}}function Gh(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class _o extends Ye{constructor(t,e,i,s){var r;super(e.code,e.message),this.operationType=i,this.user=s,Object.setPrototypeOf(this,_o.prototype),this.customData={appName:t.name,tenantId:(r=t.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:e.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(t,e,i,s){return new _o(t,e,i,s)}}function ep(n,t,e,i){return(t==="reauthenticate"?e._getReauthenticationResolver(n):e._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?_o._fromErrorAndOperation(n,r,t,i):r})}async function Jb(n,t,e=!1){const i=await xi(n,t._linkToIdToken(n.auth,await n.getIdToken()),e);return Ei._forOperation(n,"link",i)}/**
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
 */async function Zb(n,t,e=!1){const{auth:i}=n;if(Ve(i.app))return Promise.reject(pn(i));const s="reauthenticate";try{const r=await xi(n,ep(i,s,t,n),e);$(r.idToken,i,"internal-error");const o=dc(r.idToken);$(o,i,"internal-error");const{sub:a}=o;return $(n.uid===a,i,"user-mismatch"),Ei._forOperation(n,s,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&pe(i,"user-mismatch"),r}}/**
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
 */async function np(n,t,e=!1){if(Ve(n.app))return Promise.reject(pn(n));const i="signIn",s=await ep(n,i,t),r=await Ei._fromIdTokenResponse(n,i,s);return e||await n._updateCurrentUser(r.user),r}async function tv(n,t){return np(Oi(n),t)}/**
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
 */async function ev(n){const t=Oi(n);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}function nv(n,t,e){return Ve(n.app)?Promise.reject(pn(n)):tv(At(n),Vi.credential(t,e)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&ev(n),i})}function iv(n,t){return sv(At(n),null,t)}async function sv(n,t,e){const{auth:i}=n,r={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(r.password=e);const o=await xi(n,Hb(i,r));await n._updateTokensIfNecessary(o,!0)}function rv(n,t,e,i){return At(n).onIdTokenChanged(t,e,i)}function ov(n,t,e){return At(n).beforeAuthStateChanged(t,e)}function av(n,t,e,i){return At(n).onAuthStateChanged(t,e,i)}function ip(n){return At(n).signOut()}const bo="__sak";/**
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
 */class sp{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(bo,"1"),this.storage.removeItem(bo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const lv=1e3,cv=10;class rp extends sp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qg(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const i=this.storage.getItem(e),s=this.localCache[e];i!==s&&t(e,s,i)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const i=t.key;e?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(i);!e&&this.localCache[i]===o||this.notifyListeners(i,o)},r=this.storage.getItem(i);Tb()&&r!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,cv):s()}notifyListeners(t,e){this.localCache[t]=e;const i=this.listeners[t];if(i)for(const s of Array.from(i))s(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:i}),!0)})},lv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}rp.type="LOCAL";const uv=rp;/**
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
 */class op extends sp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}op.type="SESSION";const ap=op;/**
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
 */function hv(n){return Promise.all(n.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
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
 */class $o{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(s=>s.isListeningto(t));if(e)return e;const i=new $o(t);return this.receivers.push(i),i}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:i,eventType:s,data:r}=e.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;e.ports[0].postMessage({status:"ack",eventId:i,eventType:s});const a=Array.from(o).map(async u=>u(e.origin,r)),l=await hv(a);e.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:l})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}$o.receivers=[];/**
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
 */function mc(n="",t=10){let e="";for(let i=0;i<t;i++)e+=Math.floor(Math.random()*10);return n+e}/**
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
 */class dv{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,i=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let r,o;return new Promise((a,l)=>{const u=mc("",20);s.port1.start();const h=setTimeout(()=>{l(new Error("unsupported_event"))},i);o={messageChannel:s,onMessage(d){const g=d;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(h),r=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(g.data.response);break;default:clearTimeout(h),clearTimeout(r),l(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:t,eventId:u,data:e},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
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
 */function we(){return window}function fv(n){we().location.href=n}/**
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
 */function lp(){return typeof we().WorkerGlobalScope<"u"&&typeof we().importScripts=="function"}async function gv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function pv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function mv(){return lp()?self:null}/**
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
 */const cp="firebaseLocalStorageDb",yv=1,vo="firebaseLocalStorage",up="fbase_key";class Qs{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function Ho(n,t){return n.transaction([vo],t?"readwrite":"readonly").objectStore(vo)}function _v(){const n=indexedDB.deleteDatabase(cp);return new Qs(n).toPromise()}function wl(){const n=indexedDB.open(cp,yv);return new Promise((t,e)=>{n.addEventListener("error",()=>{e(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(vo,{keyPath:up})}catch(s){e(s)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(vo)?t(i):(i.close(),await _v(),t(await wl()))})})}async function Yh(n,t,e){const i=Ho(n,!0).put({[up]:t,value:e});return new Qs(i).toPromise()}async function bv(n,t){const e=Ho(n,!1).get(t),i=await new Qs(e).toPromise();return i===void 0?null:i.value}function Qh(n,t){const e=Ho(n,!0).delete(t);return new Qs(e).toPromise()}const vv=800,wv=3;class hp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await wl(),this.db)}async _withRetries(t){let e=0;for(;;)try{const i=await this._openDb();return await t(i)}catch(i){if(e++>wv)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return lp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=$o._getInstance(mv()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var t,e;if(this.activeServiceWorker=await gv(),!this.activeServiceWorker)return;this.sender=new dv(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((t=i[0])===null||t===void 0)&&t.fulfilled&&!((e=i[0])===null||e===void 0)&&e.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||pv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await wl();return await Yh(t,bo,"1"),await Qh(t,bo),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(i=>Yh(i,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(i=>bv(i,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>Qh(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const r=Ho(s,!1).getAll();return new Qs(r).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],i=new Set;if(t.length!==0)for(const{fbase_key:s,value:r}of t)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(r)&&(this.notifyListeners(s,r),e.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),e.push(s));return e}notifyListeners(t,e){this.localCache[t]=e;const i=this.listeners[t];if(i)for(const s of Array.from(i))s(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}hp.type="LOCAL";const xv=hp;new Gs(3e4,6e4);/**
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
 */function Ev(n,t){return t?Be(t):($(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class yc extends gc{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return yi(t,this._buildIdpRequest())}_linkToIdToken(t,e){return yi(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return yi(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function kv(n){return np(n.auth,new yc(n),n.bypassAuthState)}function Iv(n){const{auth:t,user:e}=n;return $(e,t,"internal-error"),Zb(e,new yc(n),n.bypassAuthState)}async function Tv(n){const{auth:t,user:e}=n;return $(e,t,"internal-error"),Jb(e,new yc(n),n.bypassAuthState)}/**
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
 */class dp{constructor(t,e,i,s,r=!1){this.auth=t,this.resolver=i,this.user=s,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:i,postBody:s,tenantId:r,error:o,type:a}=t;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:e,sessionId:i,tenantId:r||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(u){this.reject(u)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return kv;case"linkViaPopup":case"linkViaRedirect":return Tv;case"reauthViaPopup":case"reauthViaRedirect":return Iv;default:pe(this.auth,"internal-error")}}resolve(t){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Av=new Gs(2e3,1e4);class gi extends dp{constructor(t,e,i,s,r){super(t,e,s,r),this.provider=i,this.authWindow=null,this.pollId=null,gi.currentPopupAction&&gi.currentPopupAction.cancel(),gi.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return $(t,this.auth,"internal-error"),t}async onExecution(){qe(this.filter.length===1,"Popup operations only handle one event");const t=mc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(ve(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(ve(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,gi.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,i;if(!((i=(e=this.authWindow)===null||e===void 0?void 0:e.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ve(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Av.get())};t()}}gi.currentPopupAction=null;/**
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
 */const Sv="pendingRedirect",Kr=new Map;class Pv extends dp{constructor(t,e,i=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,i),this.eventId=null}async execute(){let t=Kr.get(this.auth._key());if(!t){try{const i=await Rv(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(i)}catch(e){t=()=>Promise.reject(e)}Kr.set(this.auth._key(),t)}return this.bypassAuthState||Kr.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Rv(n,t){const e=Mv(t),i=Dv(n);if(!await i._isAvailable())return!1;const s=await i._get(e)==="true";return await i._remove(e),s}function Cv(n,t){Kr.set(n._key(),t)}function Dv(n){return Be(n._redirectPersistence)}function Mv(n){return qr(Sv,n.config.apiKey,n.name)}async function Lv(n,t,e=!1){if(Ve(n.app))return Promise.reject(pn(n));const i=Oi(n),s=Ev(i,t),o=await new Pv(i,s,e).execute();return o&&!e&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,t)),o}/**
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
 */const Ov=10*60*1e3;class Vv{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(t,i)&&(e=!0,this.sendToConsumer(t,i),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!Nv(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var i;if(t.error&&!fp(t)){const s=((i=t.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";e.onError(ve(this.auth,s))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const i=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&i}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=Ov&&this.cachedEventUids.clear(),this.cachedEventUids.has(Xh(t))}saveEventToCache(t){this.cachedEventUids.add(Xh(t)),this.lastProcessedEventTime=Date.now()}}function Xh(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(t=>t).join("-")}function fp({type:n,error:t}){return n==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function Nv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fp(n);default:return!1}}/**
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
 */async function Fv(n,t={}){return Qe(n,"GET","/v1/projects",t)}/**
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
 */const Bv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Uv=/^https?/;async function jv(n){if(n.config.emulator)return;const{authorizedDomains:t}=await Fv(n);for(const e of t)try{if(zv(e))return}catch{}pe(n,"unauthorized-domain")}function zv(n){const t=bl(),{protocol:e,hostname:i}=new URL(t);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&i===""?e==="chrome-extension:"&&n.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&o.hostname===i}if(!Uv.test(e))return!1;if(Bv.test(n))return i===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}/**
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
 */const $v=new Gs(3e4,6e4);function Jh(){const n=we().___jsl;if(n!=null&&n.H){for(const t of Object.keys(n.H))if(n.H[t].r=n.H[t].r||[],n.H[t].L=n.H[t].L||[],n.H[t].r=[...n.H[t].L],n.CP)for(let e=0;e<n.CP.length;e++)n.CP[e]=null}}function Hv(n){return new Promise((t,e)=>{var i,s,r;function o(){Jh(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Jh(),e(ve(n,"network-request-failed"))},timeout:$v.get()})}if(!((s=(i=we().gapi)===null||i===void 0?void 0:i.iframes)===null||s===void 0)&&s.Iframe)t(gapi.iframes.getContext());else if(!((r=we().gapi)===null||r===void 0)&&r.load)o();else{const a=Ob("iframefcb");return we()[a]=()=>{gapi.load?o():e(ve(n,"network-request-failed"))},Jg(`${Lb()}?onload=${a}`).catch(l=>e(l))}}).catch(t=>{throw Gr=null,t})}let Gr=null;function Wv(n){return Gr=Gr||Hv(n),Gr}/**
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
 */const qv=new Gs(5e3,15e3),Kv="__/auth/iframe",Gv="emulator/auth/iframe",Yv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Qv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Xv(n){const t=n.config;$(t.authDomain,n,"auth-domain-config-required");const e=t.emulator?hc(t,Gv):`https://${n.config.authDomain}/${Kv}`,i={apiKey:t.apiKey,appName:n.name,v:Li},s=Qv.get(n.config.apiHost);s&&(i.eid=s);const r=n._getFrameworks();return r.length&&(i.fw=r.join(",")),`${e}?${Ks(i).slice(1)}`}async function Jv(n){const t=await Wv(n),e=we().gapi;return $(e,n,"internal-error"),t.open({where:document.body,url:Xv(n),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Yv,dontclear:!0},i=>new Promise(async(s,r)=>{await i.restyle({setHideOnLeave:!1});const o=ve(n,"network-request-failed"),a=we().setTimeout(()=>{r(o)},qv.get());function l(){we().clearTimeout(a),s(i)}i.ping(l).then(l,()=>{r(o)})}))}/**
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
 */const Zv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},tw=500,ew=600,nw="_blank",iw="http://localhost";class Zh{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function sw(n,t,e,i=tw,s=ew){const r=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let a="";const l=Object.assign(Object.assign({},Zv),{width:i.toString(),height:s.toString(),top:r,left:o}),u=Kt().toLowerCase();e&&(a=Wg(u)?nw:e),$g(u)&&(t=t||iw,l.scrollbars="yes");const h=Object.entries(l).reduce((g,[m,y])=>`${g}${m}=${y},`,"");if(Ib(u)&&a!=="_self")return rw(t||"",a),new Zh(null);const d=window.open(t||"",a,h);$(d,n,"popup-blocked");try{d.focus()}catch{}return new Zh(d)}function rw(n,t){const e=document.createElement("a");e.href=n,e.target=t;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(i)}/**
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
 */const ow="__/auth/handler",aw="emulator/auth/handler",lw=encodeURIComponent("fac");async function td(n,t,e,i,s,r){$(n.config.authDomain,n,"auth-domain-config-required"),$(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:e,redirectUrl:i,v:Li,eventId:s};if(t instanceof tp){t.setDefaultLanguage(n.languageCode),o.providerId=t.providerId||"",Yy(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[h,d]of Object.entries({}))o[h]=d}if(t instanceof Ys){const h=t.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const l=await n._getAppCheckToken(),u=l?`#${lw}=${encodeURIComponent(l)}`:"";return`${cw(n)}?${Ks(a).slice(1)}${u}`}function cw({config:n}){return n.emulator?hc(n,aw):`https://${n.authDomain}/${ow}`}/**
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
 */const za="webStorageSupport";class uw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ap,this._completeRedirectFn=Lv,this._overrideRedirectResult=Cv}async _openPopup(t,e,i,s){var r;qe((r=this.eventManagers[t._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await td(t,e,i,bl(),s);return sw(t,o,mc())}async _openRedirect(t,e,i,s){await this._originValidation(t);const r=await td(t,e,i,bl(),s);return fv(r),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:s,promise:r}=this.eventManagers[e];return s?Promise.resolve(s):(qe(r,"If manager is not set, promise should be"),r)}const i=this.initAndGetManager(t);return this.eventManagers[e]={promise:i},i.catch(()=>{delete this.eventManagers[e]}),i}async initAndGetManager(t){const e=await Jv(t),i=new Vv(t);return e.register("authEvent",s=>($(s==null?void 0:s.authEvent,t,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:i},this.iframes[t._key()]=e,i}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(za,{type:za},s=>{var r;const o=(r=s==null?void 0:s[0])===null||r===void 0?void 0:r[za];o!==void 0&&e(!!o),pe(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=jv(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Qg()||Hg()||fc()}}const hw=uw;var ed="@firebase/auth",nd="1.7.9";/**
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
 */class dw{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(i=>{t((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){$(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function fw(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function gw(n){wi(new Wn("auth",(t,{options:e})=>{const i=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),r=t.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=i.options;$(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const l={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Xg(n)},u=new Cb(i,s,r,l);return Ub(u,e),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,i)=>{t.getProvider("auth-internal").initialize()})),wi(new Wn("auth-internal",t=>{const e=Oi(t.getProvider("auth").getImmediate());return(i=>new dw(i))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),gn(ed,nd,fw(n)),gn(ed,nd,"esm2017")}/**
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
 */const pw=5*60,mw=Ag("authIdTokenMaxAge")||pw;let id=null;const yw=n=>async t=>{const e=t&&await t.getIdTokenResult(),i=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(i&&i>mw)return;const s=e==null?void 0:e.token;id!==s&&(id=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function _w(n=Cg()){const t=lc(n,"auth");if(t.isInitialized())return t.getImmediate();const e=Bb(n,{popupRedirectResolver:hw,persistence:[xv,uv,ap]}),i=Ag("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(i,location.origin);if(location.origin===r.origin){const o=yw(r.toString());ov(e,o,()=>o(e.currentUser)),rv(e,a=>o(a))}}const s=Ig("auth");return s&&jb(e,`http://${s}`),e}function bw(){var n,t;return(t=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&t!==void 0?t:document}Db({loadJS(n){return new Promise((t,e)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=t,i.onerror=s=>{const r=ve("internal-error");r.customData=s,e(r)},i.type="text/javascript",i.charset="UTF-8",bw().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});gw("Browser");var vw="firebase",ww="10.14.1";/**
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
 */gn(vw,ww,"app");var sd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zn,gp;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,b){function x(){}x.prototype=b.prototype,E.D=b.prototype,E.prototype=new x,E.prototype.constructor=E,E.C=function(I,T,S){for(var k=Array(arguments.length-2),mt=2;mt<arguments.length;mt++)k[mt-2]=arguments[mt];return b.prototype[T].apply(I,k)}}function e(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(i,e),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,b,x){x||(x=0);var I=Array(16);if(typeof b=="string")for(var T=0;16>T;++T)I[T]=b.charCodeAt(x++)|b.charCodeAt(x++)<<8|b.charCodeAt(x++)<<16|b.charCodeAt(x++)<<24;else for(T=0;16>T;++T)I[T]=b[x++]|b[x++]<<8|b[x++]<<16|b[x++]<<24;b=E.g[0],x=E.g[1],T=E.g[2];var S=E.g[3],k=b+(S^x&(T^S))+I[0]+3614090360&4294967295;b=x+(k<<7&4294967295|k>>>25),k=S+(T^b&(x^T))+I[1]+3905402710&4294967295,S=b+(k<<12&4294967295|k>>>20),k=T+(x^S&(b^x))+I[2]+606105819&4294967295,T=S+(k<<17&4294967295|k>>>15),k=x+(b^T&(S^b))+I[3]+3250441966&4294967295,x=T+(k<<22&4294967295|k>>>10),k=b+(S^x&(T^S))+I[4]+4118548399&4294967295,b=x+(k<<7&4294967295|k>>>25),k=S+(T^b&(x^T))+I[5]+1200080426&4294967295,S=b+(k<<12&4294967295|k>>>20),k=T+(x^S&(b^x))+I[6]+2821735955&4294967295,T=S+(k<<17&4294967295|k>>>15),k=x+(b^T&(S^b))+I[7]+4249261313&4294967295,x=T+(k<<22&4294967295|k>>>10),k=b+(S^x&(T^S))+I[8]+1770035416&4294967295,b=x+(k<<7&4294967295|k>>>25),k=S+(T^b&(x^T))+I[9]+2336552879&4294967295,S=b+(k<<12&4294967295|k>>>20),k=T+(x^S&(b^x))+I[10]+4294925233&4294967295,T=S+(k<<17&4294967295|k>>>15),k=x+(b^T&(S^b))+I[11]+2304563134&4294967295,x=T+(k<<22&4294967295|k>>>10),k=b+(S^x&(T^S))+I[12]+1804603682&4294967295,b=x+(k<<7&4294967295|k>>>25),k=S+(T^b&(x^T))+I[13]+4254626195&4294967295,S=b+(k<<12&4294967295|k>>>20),k=T+(x^S&(b^x))+I[14]+2792965006&4294967295,T=S+(k<<17&4294967295|k>>>15),k=x+(b^T&(S^b))+I[15]+1236535329&4294967295,x=T+(k<<22&4294967295|k>>>10),k=b+(T^S&(x^T))+I[1]+4129170786&4294967295,b=x+(k<<5&4294967295|k>>>27),k=S+(x^T&(b^x))+I[6]+3225465664&4294967295,S=b+(k<<9&4294967295|k>>>23),k=T+(b^x&(S^b))+I[11]+643717713&4294967295,T=S+(k<<14&4294967295|k>>>18),k=x+(S^b&(T^S))+I[0]+3921069994&4294967295,x=T+(k<<20&4294967295|k>>>12),k=b+(T^S&(x^T))+I[5]+3593408605&4294967295,b=x+(k<<5&4294967295|k>>>27),k=S+(x^T&(b^x))+I[10]+38016083&4294967295,S=b+(k<<9&4294967295|k>>>23),k=T+(b^x&(S^b))+I[15]+3634488961&4294967295,T=S+(k<<14&4294967295|k>>>18),k=x+(S^b&(T^S))+I[4]+3889429448&4294967295,x=T+(k<<20&4294967295|k>>>12),k=b+(T^S&(x^T))+I[9]+568446438&4294967295,b=x+(k<<5&4294967295|k>>>27),k=S+(x^T&(b^x))+I[14]+3275163606&4294967295,S=b+(k<<9&4294967295|k>>>23),k=T+(b^x&(S^b))+I[3]+4107603335&4294967295,T=S+(k<<14&4294967295|k>>>18),k=x+(S^b&(T^S))+I[8]+1163531501&4294967295,x=T+(k<<20&4294967295|k>>>12),k=b+(T^S&(x^T))+I[13]+2850285829&4294967295,b=x+(k<<5&4294967295|k>>>27),k=S+(x^T&(b^x))+I[2]+4243563512&4294967295,S=b+(k<<9&4294967295|k>>>23),k=T+(b^x&(S^b))+I[7]+1735328473&4294967295,T=S+(k<<14&4294967295|k>>>18),k=x+(S^b&(T^S))+I[12]+2368359562&4294967295,x=T+(k<<20&4294967295|k>>>12),k=b+(x^T^S)+I[5]+4294588738&4294967295,b=x+(k<<4&4294967295|k>>>28),k=S+(b^x^T)+I[8]+2272392833&4294967295,S=b+(k<<11&4294967295|k>>>21),k=T+(S^b^x)+I[11]+1839030562&4294967295,T=S+(k<<16&4294967295|k>>>16),k=x+(T^S^b)+I[14]+4259657740&4294967295,x=T+(k<<23&4294967295|k>>>9),k=b+(x^T^S)+I[1]+2763975236&4294967295,b=x+(k<<4&4294967295|k>>>28),k=S+(b^x^T)+I[4]+1272893353&4294967295,S=b+(k<<11&4294967295|k>>>21),k=T+(S^b^x)+I[7]+4139469664&4294967295,T=S+(k<<16&4294967295|k>>>16),k=x+(T^S^b)+I[10]+3200236656&4294967295,x=T+(k<<23&4294967295|k>>>9),k=b+(x^T^S)+I[13]+681279174&4294967295,b=x+(k<<4&4294967295|k>>>28),k=S+(b^x^T)+I[0]+3936430074&4294967295,S=b+(k<<11&4294967295|k>>>21),k=T+(S^b^x)+I[3]+3572445317&4294967295,T=S+(k<<16&4294967295|k>>>16),k=x+(T^S^b)+I[6]+76029189&4294967295,x=T+(k<<23&4294967295|k>>>9),k=b+(x^T^S)+I[9]+3654602809&4294967295,b=x+(k<<4&4294967295|k>>>28),k=S+(b^x^T)+I[12]+3873151461&4294967295,S=b+(k<<11&4294967295|k>>>21),k=T+(S^b^x)+I[15]+530742520&4294967295,T=S+(k<<16&4294967295|k>>>16),k=x+(T^S^b)+I[2]+3299628645&4294967295,x=T+(k<<23&4294967295|k>>>9),k=b+(T^(x|~S))+I[0]+4096336452&4294967295,b=x+(k<<6&4294967295|k>>>26),k=S+(x^(b|~T))+I[7]+1126891415&4294967295,S=b+(k<<10&4294967295|k>>>22),k=T+(b^(S|~x))+I[14]+2878612391&4294967295,T=S+(k<<15&4294967295|k>>>17),k=x+(S^(T|~b))+I[5]+4237533241&4294967295,x=T+(k<<21&4294967295|k>>>11),k=b+(T^(x|~S))+I[12]+1700485571&4294967295,b=x+(k<<6&4294967295|k>>>26),k=S+(x^(b|~T))+I[3]+2399980690&4294967295,S=b+(k<<10&4294967295|k>>>22),k=T+(b^(S|~x))+I[10]+4293915773&4294967295,T=S+(k<<15&4294967295|k>>>17),k=x+(S^(T|~b))+I[1]+2240044497&4294967295,x=T+(k<<21&4294967295|k>>>11),k=b+(T^(x|~S))+I[8]+1873313359&4294967295,b=x+(k<<6&4294967295|k>>>26),k=S+(x^(b|~T))+I[15]+4264355552&4294967295,S=b+(k<<10&4294967295|k>>>22),k=T+(b^(S|~x))+I[6]+2734768916&4294967295,T=S+(k<<15&4294967295|k>>>17),k=x+(S^(T|~b))+I[13]+1309151649&4294967295,x=T+(k<<21&4294967295|k>>>11),k=b+(T^(x|~S))+I[4]+4149444226&4294967295,b=x+(k<<6&4294967295|k>>>26),k=S+(x^(b|~T))+I[11]+3174756917&4294967295,S=b+(k<<10&4294967295|k>>>22),k=T+(b^(S|~x))+I[2]+718787259&4294967295,T=S+(k<<15&4294967295|k>>>17),k=x+(S^(T|~b))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+b&4294967295,E.g[1]=E.g[1]+(T+(k<<21&4294967295|k>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+S&4294967295}i.prototype.u=function(E,b){b===void 0&&(b=E.length);for(var x=b-this.blockSize,I=this.B,T=this.h,S=0;S<b;){if(T==0)for(;S<=x;)s(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<b;)if(I[T++]=E.charCodeAt(S++),T==this.blockSize){s(this,I),T=0;break}}else for(;S<b;)if(I[T++]=E[S++],T==this.blockSize){s(this,I),T=0;break}}this.h=T,this.o+=b},i.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var b=1;b<E.length-8;++b)E[b]=0;var x=8*this.o;for(b=E.length-8;b<E.length;++b)E[b]=x&255,x/=256;for(this.u(E),E=Array(16),b=x=0;4>b;++b)for(var I=0;32>I;I+=8)E[x++]=this.g[b]>>>I&255;return E};function r(E,b){var x=a;return Object.prototype.hasOwnProperty.call(x,E)?x[E]:x[E]=b(E)}function o(E,b){this.h=b;for(var x=[],I=!0,T=E.length-1;0<=T;T--){var S=E[T]|0;I&&S==b||(x[T]=S,I=!1)}this.g=x}var a={};function l(E){return-128<=E&&128>E?r(E,function(b){return new o([b|0],0>b?-1:0)}):new o([E|0],0>E?-1:0)}function u(E){if(isNaN(E)||!isFinite(E))return d;if(0>E)return w(u(-E));for(var b=[],x=1,I=0;E>=x;I++)b[I]=E/x|0,x*=4294967296;return new o(b,0)}function h(E,b){if(E.length==0)throw Error("number format error: empty string");if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(E.charAt(0)=="-")return w(h(E.substring(1),b));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var x=u(Math.pow(b,8)),I=d,T=0;T<E.length;T+=8){var S=Math.min(8,E.length-T),k=parseInt(E.substring(T,T+S),b);8>S?(S=u(Math.pow(b,S)),I=I.j(S).add(u(k))):(I=I.j(x),I=I.add(u(k)))}return I}var d=l(0),g=l(1),m=l(16777216);n=o.prototype,n.m=function(){if(v(this))return-w(this).m();for(var E=0,b=1,x=0;x<this.g.length;x++){var I=this.i(x);E+=(0<=I?I:4294967296+I)*b,b*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(y(this))return"0";if(v(this))return"-"+w(this).toString(E);for(var b=u(Math.pow(E,6)),x=this,I="";;){var T=L(x,b).g;x=A(x,T.j(b));var S=((0<x.g.length?x.g[0]:x.h)>>>0).toString(E);if(x=T,y(x))return S+I;for(;6>S.length;)S="0"+S;I=S+I}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function y(E){if(E.h!=0)return!1;for(var b=0;b<E.g.length;b++)if(E.g[b]!=0)return!1;return!0}function v(E){return E.h==-1}n.l=function(E){return E=A(this,E),v(E)?-1:y(E)?0:1};function w(E){for(var b=E.g.length,x=[],I=0;I<b;I++)x[I]=~E.g[I];return new o(x,~E.h).add(g)}n.abs=function(){return v(this)?w(this):this},n.add=function(E){for(var b=Math.max(this.g.length,E.g.length),x=[],I=0,T=0;T<=b;T++){var S=I+(this.i(T)&65535)+(E.i(T)&65535),k=(S>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);I=k>>>16,S&=65535,k&=65535,x[T]=k<<16|S}return new o(x,x[x.length-1]&-2147483648?-1:0)};function A(E,b){return E.add(w(b))}n.j=function(E){if(y(this)||y(E))return d;if(v(this))return v(E)?w(this).j(w(E)):w(w(this).j(E));if(v(E))return w(this.j(w(E)));if(0>this.l(m)&&0>E.l(m))return u(this.m()*E.m());for(var b=this.g.length+E.g.length,x=[],I=0;I<2*b;I++)x[I]=0;for(I=0;I<this.g.length;I++)for(var T=0;T<E.g.length;T++){var S=this.i(I)>>>16,k=this.i(I)&65535,mt=E.i(T)>>>16,J=E.i(T)&65535;x[2*I+2*T]+=k*J,R(x,2*I+2*T),x[2*I+2*T+1]+=S*J,R(x,2*I+2*T+1),x[2*I+2*T+1]+=k*mt,R(x,2*I+2*T+1),x[2*I+2*T+2]+=S*mt,R(x,2*I+2*T+2)}for(I=0;I<b;I++)x[I]=x[2*I+1]<<16|x[2*I];for(I=b;I<2*b;I++)x[I]=0;return new o(x,0)};function R(E,b){for(;(E[b]&65535)!=E[b];)E[b+1]+=E[b]>>>16,E[b]&=65535,b++}function D(E,b){this.g=E,this.h=b}function L(E,b){if(y(b))throw Error("division by zero");if(y(E))return new D(d,d);if(v(E))return b=L(w(E),b),new D(w(b.g),w(b.h));if(v(b))return b=L(E,w(b)),new D(w(b.g),b.h);if(30<E.g.length){if(v(E)||v(b))throw Error("slowDivide_ only works with positive integers.");for(var x=g,I=b;0>=I.l(E);)x=M(x),I=M(I);var T=V(x,1),S=V(I,1);for(I=V(I,2),x=V(x,2);!y(I);){var k=S.add(I);0>=k.l(E)&&(T=T.add(x),S=k),I=V(I,1),x=V(x,1)}return b=A(E,T.j(b)),new D(T,b)}for(T=d;0<=E.l(b);){for(x=Math.max(1,Math.floor(E.m()/b.m())),I=Math.ceil(Math.log(x)/Math.LN2),I=48>=I?1:Math.pow(2,I-48),S=u(x),k=S.j(b);v(k)||0<k.l(E);)x-=I,S=u(x),k=S.j(b);y(S)&&(S=g),T=T.add(S),E=A(E,k)}return new D(T,E)}n.A=function(E){return L(this,E).h},n.and=function(E){for(var b=Math.max(this.g.length,E.g.length),x=[],I=0;I<b;I++)x[I]=this.i(I)&E.i(I);return new o(x,this.h&E.h)},n.or=function(E){for(var b=Math.max(this.g.length,E.g.length),x=[],I=0;I<b;I++)x[I]=this.i(I)|E.i(I);return new o(x,this.h|E.h)},n.xor=function(E){for(var b=Math.max(this.g.length,E.g.length),x=[],I=0;I<b;I++)x[I]=this.i(I)^E.i(I);return new o(x,this.h^E.h)};function M(E){for(var b=E.g.length+1,x=[],I=0;I<b;I++)x[I]=E.i(I)<<1|E.i(I-1)>>>31;return new o(x,E.h)}function V(E,b){var x=b>>5;b%=32;for(var I=E.g.length-x,T=[],S=0;S<I;S++)T[S]=0<b?E.i(S+x)>>>b|E.i(S+x+1)<<32-b:E.i(S+x);return new o(T,E.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,gp=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=h,zn=o}).apply(typeof sd<"u"?sd:typeof self<"u"?self:typeof window<"u"?window:{});var Ar=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pp,ls,mp,Yr,xl,yp,_p,bp;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(c,f,p){return c==Array.prototype||c==Object.prototype||(c[f]=p.value),c};function e(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ar=="object"&&Ar];for(var f=0;f<c.length;++f){var p=c[f];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var i=e(this);function s(c,f){if(f)t:{var p=i;c=c.split(".");for(var _=0;_<c.length-1;_++){var P=c[_];if(!(P in p))break t;p=p[P]}c=c[c.length-1],_=p[c],f=f(_),f!=_&&f!=null&&t(p,c,{configurable:!0,writable:!0,value:f})}}function r(c,f){c instanceof String&&(c+="");var p=0,_=!1,P={next:function(){if(!_&&p<c.length){var C=p++;return{value:f(C,c[C]),done:!1}}return _=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}s("Array.prototype.values",function(c){return c||function(){return r(this,function(f,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(c){var f=typeof c;return f=f!="object"?f:c?Array.isArray(c)?"array":f:"null",f=="array"||f=="object"&&typeof c.length=="number"}function u(c){var f=typeof c;return f=="object"&&c!=null||f=="function"}function h(c,f,p){return c.call.apply(c.bind,arguments)}function d(c,f,p){if(!c)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,_),c.apply(f,P)}}return function(){return c.apply(f,arguments)}}function g(c,f,p){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:d,g.apply(null,arguments)}function m(c,f){var p=Array.prototype.slice.call(arguments,1);return function(){var _=p.slice();return _.push.apply(_,arguments),c.apply(this,_)}}function y(c,f){function p(){}p.prototype=f.prototype,c.aa=f.prototype,c.prototype=new p,c.prototype.constructor=c,c.Qb=function(_,P,C){for(var F=Array(arguments.length-2),at=2;at<arguments.length;at++)F[at-2]=arguments[at];return f.prototype[P].apply(_,F)}}function v(c){const f=c.length;if(0<f){const p=Array(f);for(let _=0;_<f;_++)p[_]=c[_];return p}return[]}function w(c,f){for(let p=1;p<arguments.length;p++){const _=arguments[p];if(l(_)){const P=c.length||0,C=_.length||0;c.length=P+C;for(let F=0;F<C;F++)c[P+F]=_[F]}else c.push(_)}}class A{constructor(f,p){this.i=f,this.j=p,this.h=0,this.g=null}get(){let f;return 0<this.h?(this.h--,f=this.g,this.g=f.next,f.next=null):f=this.i(),f}}function R(c){return/^[\s\xa0]*$/.test(c)}function D(){var c=a.navigator;return c&&(c=c.userAgent)?c:""}function L(c){return L[" "](c),c}L[" "]=function(){};var M=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function V(c,f,p){for(const _ in c)f.call(p,c[_],_,c)}function E(c,f){for(const p in c)f.call(void 0,c[p],p,c)}function b(c){const f={};for(const p in c)f[p]=c[p];return f}const x="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(c,f){let p,_;for(let P=1;P<arguments.length;P++){_=arguments[P];for(p in _)c[p]=_[p];for(let C=0;C<x.length;C++)p=x[C],Object.prototype.hasOwnProperty.call(_,p)&&(c[p]=_[p])}}function T(c){var f=1;c=c.split(":");const p=[];for(;0<f&&c.length;)p.push(c.shift()),f--;return c.length&&p.push(c.join(":")),p}function S(c){a.setTimeout(()=>{throw c},0)}function k(){var c=kt;let f=null;return c.g&&(f=c.g,c.g=c.g.next,c.g||(c.h=null),f.next=null),f}class mt{constructor(){this.h=this.g=null}add(f,p){const _=J.get();_.set(f,p),this.h?this.h.next=_:this.g=_,this.h=_}}var J=new A(()=>new lt,c=>c.reset());class lt{constructor(){this.next=this.g=this.h=null}set(f,p){this.h=f,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let ot,Ct=!1,kt=new mt,Te=()=>{const c=a.Promise.resolve(void 0);ot=()=>{c.then(si)}};var si=()=>{for(var c;c=k();){try{c.h.call(c.g)}catch(p){S(p)}var f=J;f.j(c),100>f.h&&(f.h++,c.next=f.g,f.g=c)}Ct=!1};function Yt(){this.s=this.s,this.C=this.C}Yt.prototype.s=!1,Yt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Yt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function _t(c,f){this.type=c,this.g=this.target=f,this.defaultPrevented=!1}_t.prototype.h=function(){this.defaultPrevented=!0};var Ae=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var c=!1,f=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const p=()=>{};a.addEventListener("test",p,f),a.removeEventListener("test",p,f)}catch{}return c}();function ce(c,f){if(_t.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c){var p=this.type=c.type,_=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;if(this.target=c.target||c.srcElement,this.g=f,f=c.relatedTarget){if(M){t:{try{L(f.nodeName);var P=!0;break t}catch{}P=!1}P||(f=null)}}else p=="mouseover"?f=c.fromElement:p=="mouseout"&&(f=c.toElement);this.relatedTarget=f,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=typeof c.pointerType=="string"?c.pointerType:Se[c.pointerType]||"",this.state=c.state,this.i=c,c.defaultPrevented&&ce.aa.h.call(this)}}y(ce,_t);var Se={2:"touch",3:"pen",4:"mouse"};ce.prototype.h=function(){ce.aa.h.call(this);var c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var ar="closure_listenable_"+(1e6*Math.random()|0),G0=0;function Y0(c,f,p,_,P){this.listener=c,this.proxy=null,this.src=f,this.type=p,this.capture=!!_,this.ha=P,this.key=++G0,this.da=this.fa=!1}function lr(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function cr(c){this.src=c,this.g={},this.h=0}cr.prototype.add=function(c,f,p,_,P){var C=c.toString();c=this.g[C],c||(c=this.g[C]=[],this.h++);var F=ga(c,f,_,P);return-1<F?(f=c[F],p||(f.fa=!1)):(f=new Y0(f,this.src,C,!!_,P),f.fa=p,c.push(f)),f};function fa(c,f){var p=f.type;if(p in c.g){var _=c.g[p],P=Array.prototype.indexOf.call(_,f,void 0),C;(C=0<=P)&&Array.prototype.splice.call(_,P,1),C&&(lr(f),c.g[p].length==0&&(delete c.g[p],c.h--))}}function ga(c,f,p,_){for(var P=0;P<c.length;++P){var C=c[P];if(!C.da&&C.listener==f&&C.capture==!!p&&C.ha==_)return P}return-1}var pa="closure_lm_"+(1e6*Math.random()|0),ma={};function Pu(c,f,p,_,P){if(Array.isArray(f)){for(var C=0;C<f.length;C++)Pu(c,f[C],p,_,P);return null}return p=Du(p),c&&c[ar]?c.K(f,p,u(_)?!!_.capture:!1,P):Q0(c,f,p,!1,_,P)}function Q0(c,f,p,_,P,C){if(!f)throw Error("Invalid event type");var F=u(P)?!!P.capture:!!P,at=_a(c);if(at||(c[pa]=at=new cr(c)),p=at.add(f,p,_,F,C),p.proxy)return p;if(_=X0(),p.proxy=_,_.src=c,_.listener=p,c.addEventListener)Ae||(P=F),P===void 0&&(P=!1),c.addEventListener(f.toString(),_,P);else if(c.attachEvent)c.attachEvent(Cu(f.toString()),_);else if(c.addListener&&c.removeListener)c.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return p}function X0(){function c(p){return f.call(c.src,c.listener,p)}const f=J0;return c}function Ru(c,f,p,_,P){if(Array.isArray(f))for(var C=0;C<f.length;C++)Ru(c,f[C],p,_,P);else _=u(_)?!!_.capture:!!_,p=Du(p),c&&c[ar]?(c=c.i,f=String(f).toString(),f in c.g&&(C=c.g[f],p=ga(C,p,_,P),-1<p&&(lr(C[p]),Array.prototype.splice.call(C,p,1),C.length==0&&(delete c.g[f],c.h--)))):c&&(c=_a(c))&&(f=c.g[f.toString()],c=-1,f&&(c=ga(f,p,_,P)),(p=-1<c?f[c]:null)&&ya(p))}function ya(c){if(typeof c!="number"&&c&&!c.da){var f=c.src;if(f&&f[ar])fa(f.i,c);else{var p=c.type,_=c.proxy;f.removeEventListener?f.removeEventListener(p,_,c.capture):f.detachEvent?f.detachEvent(Cu(p),_):f.addListener&&f.removeListener&&f.removeListener(_),(p=_a(f))?(fa(p,c),p.h==0&&(p.src=null,f[pa]=null)):lr(c)}}}function Cu(c){return c in ma?ma[c]:ma[c]="on"+c}function J0(c,f){if(c.da)c=!0;else{f=new ce(f,this);var p=c.listener,_=c.ha||c.src;c.fa&&ya(c),c=p.call(_,f)}return c}function _a(c){return c=c[pa],c instanceof cr?c:null}var ba="__closure_events_fn_"+(1e9*Math.random()>>>0);function Du(c){return typeof c=="function"?c:(c[ba]||(c[ba]=function(f){return c.handleEvent(f)}),c[ba])}function Ft(){Yt.call(this),this.i=new cr(this),this.M=this,this.F=null}y(Ft,Yt),Ft.prototype[ar]=!0,Ft.prototype.removeEventListener=function(c,f,p,_){Ru(this,c,f,p,_)};function Qt(c,f){var p,_=c.F;if(_)for(p=[];_;_=_.F)p.push(_);if(c=c.M,_=f.type||f,typeof f=="string")f=new _t(f,c);else if(f instanceof _t)f.target=f.target||c;else{var P=f;f=new _t(_,c),I(f,P)}if(P=!0,p)for(var C=p.length-1;0<=C;C--){var F=f.g=p[C];P=ur(F,_,!0,f)&&P}if(F=f.g=c,P=ur(F,_,!0,f)&&P,P=ur(F,_,!1,f)&&P,p)for(C=0;C<p.length;C++)F=f.g=p[C],P=ur(F,_,!1,f)&&P}Ft.prototype.N=function(){if(Ft.aa.N.call(this),this.i){var c=this.i,f;for(f in c.g){for(var p=c.g[f],_=0;_<p.length;_++)lr(p[_]);delete c.g[f],c.h--}}this.F=null},Ft.prototype.K=function(c,f,p,_){return this.i.add(String(c),f,!1,p,_)},Ft.prototype.L=function(c,f,p,_){return this.i.add(String(c),f,!0,p,_)};function ur(c,f,p,_){if(f=c.i.g[String(f)],!f)return!0;f=f.concat();for(var P=!0,C=0;C<f.length;++C){var F=f[C];if(F&&!F.da&&F.capture==p){var at=F.listener,Dt=F.ha||F.src;F.fa&&fa(c.i,F),P=at.call(Dt,_)!==!1&&P}}return P&&!_.defaultPrevented}function Mu(c,f,p){if(typeof c=="function")p&&(c=g(c,p));else if(c&&typeof c.handleEvent=="function")c=g(c.handleEvent,c);else throw Error("Invalid listener argument");return 2147483647<Number(f)?-1:a.setTimeout(c,f||0)}function Lu(c){c.g=Mu(()=>{c.g=null,c.i&&(c.i=!1,Lu(c))},c.l);const f=c.h;c.h=null,c.m.apply(null,f)}class Z0 extends Yt{constructor(f,p){super(),this.m=f,this.l=p,this.h=null,this.i=!1,this.g=null}j(f){this.h=arguments,this.g?this.i=!0:Lu(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ji(c){Yt.call(this),this.h=c,this.g={}}y(ji,Yt);var Ou=[];function Vu(c){V(c.g,function(f,p){this.g.hasOwnProperty(p)&&ya(f)},c),c.g={}}ji.prototype.N=function(){ji.aa.N.call(this),Vu(this)},ji.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var va=a.JSON.stringify,ty=a.JSON.parse,ey=class{stringify(c){return a.JSON.stringify(c,void 0)}parse(c){return a.JSON.parse(c,void 0)}};function wa(){}wa.prototype.h=null;function Nu(c){return c.h||(c.h=c.i())}function Fu(){}var zi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function xa(){_t.call(this,"d")}y(xa,_t);function Ea(){_t.call(this,"c")}y(Ea,_t);var Sn={},Bu=null;function hr(){return Bu=Bu||new Ft}Sn.La="serverreachability";function Uu(c){_t.call(this,Sn.La,c)}y(Uu,_t);function $i(c){const f=hr();Qt(f,new Uu(f))}Sn.STAT_EVENT="statevent";function ju(c,f){_t.call(this,Sn.STAT_EVENT,c),this.stat=f}y(ju,_t);function Xt(c){const f=hr();Qt(f,new ju(f,c))}Sn.Ma="timingevent";function zu(c,f){_t.call(this,Sn.Ma,c),this.size=f}y(zu,_t);function Hi(c,f){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){c()},f)}function Wi(){this.g=!0}Wi.prototype.xa=function(){this.g=!1};function ny(c,f,p,_,P,C){c.info(function(){if(c.g)if(C)for(var F="",at=C.split("&"),Dt=0;Dt<at.length;Dt++){var et=at[Dt].split("=");if(1<et.length){var Bt=et[0];et=et[1];var Ut=Bt.split("_");F=2<=Ut.length&&Ut[1]=="type"?F+(Bt+"="+et+"&"):F+(Bt+"=redacted&")}}else F=null;else F=C;return"XMLHTTP REQ ("+_+") [attempt "+P+"]: "+f+`
`+p+`
`+F})}function iy(c,f,p,_,P,C,F){c.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+P+"]: "+f+`
`+p+`
`+C+" "+F})}function ri(c,f,p,_){c.info(function(){return"XMLHTTP TEXT ("+f+"): "+ry(c,p)+(_?" "+_:"")})}function sy(c,f){c.info(function(){return"TIMEOUT: "+f})}Wi.prototype.info=function(){};function ry(c,f){if(!c.g)return f;if(!f)return null;try{var p=JSON.parse(f);if(p){for(c=0;c<p.length;c++)if(Array.isArray(p[c])){var _=p[c];if(!(2>_.length)){var P=_[1];if(Array.isArray(P)&&!(1>P.length)){var C=P[0];if(C!="noop"&&C!="stop"&&C!="close")for(var F=1;F<P.length;F++)P[F]=""}}}}return va(p)}catch{return f}}var dr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},$u={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ka;function fr(){}y(fr,wa),fr.prototype.g=function(){return new XMLHttpRequest},fr.prototype.i=function(){return{}},ka=new fr;function Xe(c,f,p,_){this.j=c,this.i=f,this.l=p,this.R=_||1,this.U=new ji(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Hu}function Hu(){this.i=null,this.g="",this.h=!1}var Wu={},Ia={};function Ta(c,f,p){c.L=1,c.v=yr(Pe(f)),c.m=p,c.P=!0,qu(c,null)}function qu(c,f){c.F=Date.now(),gr(c),c.A=Pe(c.v);var p=c.A,_=c.R;Array.isArray(_)||(_=[String(_)]),oh(p.i,"t",_),c.C=0,p=c.j.J,c.h=new Hu,c.g=kh(c.j,p?f:null,!c.m),0<c.O&&(c.M=new Z0(g(c.Y,c,c.g),c.O)),f=c.U,p=c.g,_=c.ca;var P="readystatechange";Array.isArray(P)||(P&&(Ou[0]=P.toString()),P=Ou);for(var C=0;C<P.length;C++){var F=Pu(p,P[C],_||f.handleEvent,!1,f.h||f);if(!F)break;f.g[F.key]=F}f=c.H?b(c.H):{},c.m?(c.u||(c.u="POST"),f["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.A,c.u,c.m,f)):(c.u="GET",c.g.ea(c.A,c.u,null,f)),$i(),ny(c.i,c.u,c.A,c.l,c.R,c.m)}Xe.prototype.ca=function(c){c=c.target;const f=this.M;f&&Re(c)==3?f.j():this.Y(c)},Xe.prototype.Y=function(c){try{if(c==this.g)t:{const Ut=Re(this.g);var f=this.g.Ba();const li=this.g.Z();if(!(3>Ut)&&(Ut!=3||this.g&&(this.h.h||this.g.oa()||fh(this.g)))){this.J||Ut!=4||f==7||(f==8||0>=li?$i(3):$i(2)),Aa(this);var p=this.g.Z();this.X=p;e:if(Ku(this)){var _=fh(this.g);c="";var P=_.length,C=Re(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Pn(this),qi(this);var F="";break e}this.h.i=new a.TextDecoder}for(f=0;f<P;f++)this.h.h=!0,c+=this.h.i.decode(_[f],{stream:!(C&&f==P-1)});_.length=0,this.h.g+=c,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=p==200,iy(this.i,this.u,this.A,this.l,this.R,Ut,p),this.o){if(this.T&&!this.K){e:{if(this.g){var at,Dt=this.g;if((at=Dt.g?Dt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!R(at)){var et=at;break e}}et=null}if(p=et)ri(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Sa(this,p);else{this.o=!1,this.s=3,Xt(12),Pn(this),qi(this);break t}}if(this.P){p=!0;let ue;for(;!this.J&&this.C<F.length;)if(ue=oy(this,F),ue==Ia){Ut==4&&(this.s=4,Xt(14),p=!1),ri(this.i,this.l,null,"[Incomplete Response]");break}else if(ue==Wu){this.s=4,Xt(15),ri(this.i,this.l,F,"[Invalid Chunk]"),p=!1;break}else ri(this.i,this.l,ue,null),Sa(this,ue);if(Ku(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ut!=4||F.length!=0||this.h.h||(this.s=1,Xt(16),p=!1),this.o=this.o&&p,!p)ri(this.i,this.l,F,"[Invalid Chunked Response]"),Pn(this),qi(this);else if(0<F.length&&!this.W){this.W=!0;var Bt=this.j;Bt.g==this&&Bt.ba&&!Bt.M&&(Bt.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),La(Bt),Bt.M=!0,Xt(11))}}else ri(this.i,this.l,F,null),Sa(this,F);Ut==4&&Pn(this),this.o&&!this.J&&(Ut==4?vh(this.j,this):(this.o=!1,gr(this)))}else Ey(this.g),p==400&&0<F.indexOf("Unknown SID")?(this.s=3,Xt(12)):(this.s=0,Xt(13)),Pn(this),qi(this)}}}catch{}finally{}};function Ku(c){return c.g?c.u=="GET"&&c.L!=2&&c.j.Ca:!1}function oy(c,f){var p=c.C,_=f.indexOf(`
`,p);return _==-1?Ia:(p=Number(f.substring(p,_)),isNaN(p)?Wu:(_+=1,_+p>f.length?Ia:(f=f.slice(_,_+p),c.C=_+p,f)))}Xe.prototype.cancel=function(){this.J=!0,Pn(this)};function gr(c){c.S=Date.now()+c.I,Gu(c,c.I)}function Gu(c,f){if(c.B!=null)throw Error("WatchDog timer not null");c.B=Hi(g(c.ba,c),f)}function Aa(c){c.B&&(a.clearTimeout(c.B),c.B=null)}Xe.prototype.ba=function(){this.B=null;const c=Date.now();0<=c-this.S?(sy(this.i,this.A),this.L!=2&&($i(),Xt(17)),Pn(this),this.s=2,qi(this)):Gu(this,this.S-c)};function qi(c){c.j.G==0||c.J||vh(c.j,c)}function Pn(c){Aa(c);var f=c.M;f&&typeof f.ma=="function"&&f.ma(),c.M=null,Vu(c.U),c.g&&(f=c.g,c.g=null,f.abort(),f.ma())}function Sa(c,f){try{var p=c.j;if(p.G!=0&&(p.g==c||Pa(p.h,c))){if(!c.K&&Pa(p.h,c)&&p.G==3){try{var _=p.Da.g.parse(f)}catch{_=null}if(Array.isArray(_)&&_.length==3){var P=_;if(P[0]==0){t:if(!p.u){if(p.g)if(p.g.F+3e3<c.F)Er(p),wr(p);else break t;Ma(p),Xt(18)}}else p.za=P[1],0<p.za-p.T&&37500>P[2]&&p.F&&p.v==0&&!p.C&&(p.C=Hi(g(p.Za,p),6e3));if(1>=Xu(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else Cn(p,11)}else if((c.K||p.g==c)&&Er(p),!R(f))for(P=p.Da.g.parse(f),f=0;f<P.length;f++){let et=P[f];if(p.T=et[0],et=et[1],p.G==2)if(et[0]=="c"){p.K=et[1],p.ia=et[2];const Bt=et[3];Bt!=null&&(p.la=Bt,p.j.info("VER="+p.la));const Ut=et[4];Ut!=null&&(p.Aa=Ut,p.j.info("SVER="+p.Aa));const li=et[5];li!=null&&typeof li=="number"&&0<li&&(_=1.5*li,p.L=_,p.j.info("backChannelRequestTimeoutMs_="+_)),_=p;const ue=c.g;if(ue){const Ir=ue.g?ue.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ir){var C=_.h;C.g||Ir.indexOf("spdy")==-1&&Ir.indexOf("quic")==-1&&Ir.indexOf("h2")==-1||(C.j=C.l,C.g=new Set,C.h&&(Ra(C,C.h),C.h=null))}if(_.D){const Oa=ue.g?ue.g.getResponseHeader("X-HTTP-Session-Id"):null;Oa&&(_.ya=Oa,ut(_.I,_.D,Oa))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-c.F,p.j.info("Handshake RTT: "+p.R+"ms")),_=p;var F=c;if(_.qa=Eh(_,_.J?_.ia:null,_.W),F.K){Ju(_.h,F);var at=F,Dt=_.L;Dt&&(at.I=Dt),at.B&&(Aa(at),gr(at)),_.g=F}else _h(_);0<p.i.length&&xr(p)}else et[0]!="stop"&&et[0]!="close"||Cn(p,7);else p.G==3&&(et[0]=="stop"||et[0]=="close"?et[0]=="stop"?Cn(p,7):Da(p):et[0]!="noop"&&p.l&&p.l.ta(et),p.v=0)}}$i(4)}catch{}}var ay=class{constructor(c,f){this.g=c,this.map=f}};function Yu(c){this.l=c||10,a.PerformanceNavigationTiming?(c=a.performance.getEntriesByType("navigation"),c=0<c.length&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Qu(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function Xu(c){return c.h?1:c.g?c.g.size:0}function Pa(c,f){return c.h?c.h==f:c.g?c.g.has(f):!1}function Ra(c,f){c.g?c.g.add(f):c.h=f}function Ju(c,f){c.h&&c.h==f?c.h=null:c.g&&c.g.has(f)&&c.g.delete(f)}Yu.prototype.cancel=function(){if(this.i=Zu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function Zu(c){if(c.h!=null)return c.i.concat(c.h.D);if(c.g!=null&&c.g.size!==0){let f=c.i;for(const p of c.g.values())f=f.concat(p.D);return f}return v(c.i)}function ly(c){if(c.V&&typeof c.V=="function")return c.V();if(typeof Map<"u"&&c instanceof Map||typeof Set<"u"&&c instanceof Set)return Array.from(c.values());if(typeof c=="string")return c.split("");if(l(c)){for(var f=[],p=c.length,_=0;_<p;_++)f.push(c[_]);return f}f=[],p=0;for(_ in c)f[p++]=c[_];return f}function cy(c){if(c.na&&typeof c.na=="function")return c.na();if(!c.V||typeof c.V!="function"){if(typeof Map<"u"&&c instanceof Map)return Array.from(c.keys());if(!(typeof Set<"u"&&c instanceof Set)){if(l(c)||typeof c=="string"){var f=[];c=c.length;for(var p=0;p<c;p++)f.push(p);return f}f=[],p=0;for(const _ in c)f[p++]=_;return f}}}function th(c,f){if(c.forEach&&typeof c.forEach=="function")c.forEach(f,void 0);else if(l(c)||typeof c=="string")Array.prototype.forEach.call(c,f,void 0);else for(var p=cy(c),_=ly(c),P=_.length,C=0;C<P;C++)f.call(void 0,_[C],p&&p[C],c)}var eh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function uy(c,f){if(c){c=c.split("&");for(var p=0;p<c.length;p++){var _=c[p].indexOf("="),P=null;if(0<=_){var C=c[p].substring(0,_);P=c[p].substring(_+1)}else C=c[p];f(C,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Rn(c){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,c instanceof Rn){this.h=c.h,pr(this,c.j),this.o=c.o,this.g=c.g,mr(this,c.s),this.l=c.l;var f=c.i,p=new Yi;p.i=f.i,f.g&&(p.g=new Map(f.g),p.h=f.h),nh(this,p),this.m=c.m}else c&&(f=String(c).match(eh))?(this.h=!1,pr(this,f[1]||"",!0),this.o=Ki(f[2]||""),this.g=Ki(f[3]||"",!0),mr(this,f[4]),this.l=Ki(f[5]||"",!0),nh(this,f[6]||"",!0),this.m=Ki(f[7]||"")):(this.h=!1,this.i=new Yi(null,this.h))}Rn.prototype.toString=function(){var c=[],f=this.j;f&&c.push(Gi(f,ih,!0),":");var p=this.g;return(p||f=="file")&&(c.push("//"),(f=this.o)&&c.push(Gi(f,ih,!0),"@"),c.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&c.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&c.push("/"),c.push(Gi(p,p.charAt(0)=="/"?fy:dy,!0))),(p=this.i.toString())&&c.push("?",p),(p=this.m)&&c.push("#",Gi(p,py)),c.join("")};function Pe(c){return new Rn(c)}function pr(c,f,p){c.j=p?Ki(f,!0):f,c.j&&(c.j=c.j.replace(/:$/,""))}function mr(c,f){if(f){if(f=Number(f),isNaN(f)||0>f)throw Error("Bad port number "+f);c.s=f}else c.s=null}function nh(c,f,p){f instanceof Yi?(c.i=f,my(c.i,c.h)):(p||(f=Gi(f,gy)),c.i=new Yi(f,c.h))}function ut(c,f,p){c.i.set(f,p)}function yr(c){return ut(c,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),c}function Ki(c,f){return c?f?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function Gi(c,f,p){return typeof c=="string"?(c=encodeURI(c).replace(f,hy),p&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function hy(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var ih=/[#\/\?@]/g,dy=/[#\?:]/g,fy=/[#\?]/g,gy=/[#\?@]/g,py=/#/g;function Yi(c,f){this.h=this.g=null,this.i=c||null,this.j=!!f}function Je(c){c.g||(c.g=new Map,c.h=0,c.i&&uy(c.i,function(f,p){c.add(decodeURIComponent(f.replace(/\+/g," ")),p)}))}n=Yi.prototype,n.add=function(c,f){Je(this),this.i=null,c=oi(this,c);var p=this.g.get(c);return p||this.g.set(c,p=[]),p.push(f),this.h+=1,this};function sh(c,f){Je(c),f=oi(c,f),c.g.has(f)&&(c.i=null,c.h-=c.g.get(f).length,c.g.delete(f))}function rh(c,f){return Je(c),f=oi(c,f),c.g.has(f)}n.forEach=function(c,f){Je(this),this.g.forEach(function(p,_){p.forEach(function(P){c.call(f,P,_,this)},this)},this)},n.na=function(){Je(this);const c=Array.from(this.g.values()),f=Array.from(this.g.keys()),p=[];for(let _=0;_<f.length;_++){const P=c[_];for(let C=0;C<P.length;C++)p.push(f[_])}return p},n.V=function(c){Je(this);let f=[];if(typeof c=="string")rh(this,c)&&(f=f.concat(this.g.get(oi(this,c))));else{c=Array.from(this.g.values());for(let p=0;p<c.length;p++)f=f.concat(c[p])}return f},n.set=function(c,f){return Je(this),this.i=null,c=oi(this,c),rh(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[f]),this.h+=1,this},n.get=function(c,f){return c?(c=this.V(c),0<c.length?String(c[0]):f):f};function oh(c,f,p){sh(c,f),0<p.length&&(c.i=null,c.g.set(oi(c,f),v(p)),c.h+=p.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],f=Array.from(this.g.keys());for(var p=0;p<f.length;p++){var _=f[p];const C=encodeURIComponent(String(_)),F=this.V(_);for(_=0;_<F.length;_++){var P=C;F[_]!==""&&(P+="="+encodeURIComponent(String(F[_]))),c.push(P)}}return this.i=c.join("&")};function oi(c,f){return f=String(f),c.j&&(f=f.toLowerCase()),f}function my(c,f){f&&!c.j&&(Je(c),c.i=null,c.g.forEach(function(p,_){var P=_.toLowerCase();_!=P&&(sh(this,_),oh(this,P,p))},c)),c.j=f}function yy(c,f){const p=new Wi;if(a.Image){const _=new Image;_.onload=m(Ze,p,"TestLoadImage: loaded",!0,f,_),_.onerror=m(Ze,p,"TestLoadImage: error",!1,f,_),_.onabort=m(Ze,p,"TestLoadImage: abort",!1,f,_),_.ontimeout=m(Ze,p,"TestLoadImage: timeout",!1,f,_),a.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=c}else f(!1)}function _y(c,f){const p=new Wi,_=new AbortController,P=setTimeout(()=>{_.abort(),Ze(p,"TestPingServer: timeout",!1,f)},1e4);fetch(c,{signal:_.signal}).then(C=>{clearTimeout(P),C.ok?Ze(p,"TestPingServer: ok",!0,f):Ze(p,"TestPingServer: server error",!1,f)}).catch(()=>{clearTimeout(P),Ze(p,"TestPingServer: error",!1,f)})}function Ze(c,f,p,_,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),_(p)}catch{}}function by(){this.g=new ey}function vy(c,f,p){const _=p||"";try{th(c,function(P,C){let F=P;u(P)&&(F=va(P)),f.push(_+C+"="+encodeURIComponent(F))})}catch(P){throw f.push(_+"type="+encodeURIComponent("_badmap")),P}}function _r(c){this.l=c.Ub||null,this.j=c.eb||!1}y(_r,wa),_r.prototype.g=function(){return new br(this.l,this.j)},_r.prototype.i=function(c){return function(){return c}}({});function br(c,f){Ft.call(this),this.D=c,this.o=f,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}y(br,Ft),n=br.prototype,n.open=function(c,f){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=c,this.A=f,this.readyState=1,Xi(this)},n.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const f={headers:this.u,method:this.B,credentials:this.m,cache:void 0};c&&(f.body=c),(this.D||a).fetch(new Request(this.A,f)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Qi(this)),this.readyState=0},n.Sa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,Xi(this)),this.g&&(this.readyState=3,Xi(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ah(this)}else c.text().then(this.Ra.bind(this),this.ga.bind(this))};function ah(c){c.j.read().then(c.Pa.bind(c)).catch(c.ga.bind(c))}n.Pa=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var f=c.value?c.value:new Uint8Array(0);(f=this.v.decode(f,{stream:!c.done}))&&(this.response=this.responseText+=f)}c.done?Qi(this):Xi(this),this.readyState==3&&ah(this)}},n.Ra=function(c){this.g&&(this.response=this.responseText=c,Qi(this))},n.Qa=function(c){this.g&&(this.response=c,Qi(this))},n.ga=function(){this.g&&Qi(this)};function Qi(c){c.readyState=4,c.l=null,c.j=null,c.v=null,Xi(c)}n.setRequestHeader=function(c,f){this.u.append(c,f)},n.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],f=this.h.entries();for(var p=f.next();!p.done;)p=p.value,c.push(p[0]+": "+p[1]),p=f.next();return c.join(`\r
`)};function Xi(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(br.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function lh(c){let f="";return V(c,function(p,_){f+=_,f+=":",f+=p,f+=`\r
`}),f}function Ca(c,f,p){t:{for(_ in p){var _=!1;break t}_=!0}_||(p=lh(p),typeof c=="string"?p!=null&&encodeURIComponent(String(p)):ut(c,f,p))}function bt(c){Ft.call(this),this.headers=new Map,this.o=c||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}y(bt,Ft);var wy=/^https?$/i,xy=["POST","PUT"];n=bt.prototype,n.Ha=function(c){this.J=c},n.ea=function(c,f,p,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);f=f?f.toUpperCase():"GET",this.D=c,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ka.g(),this.v=this.o?Nu(this.o):Nu(ka),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(f,String(c),!0),this.B=!1}catch(C){ch(this,C);return}if(c=p||"",p=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var P in _)p.set(P,_[P]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const C of _.keys())p.set(C,_.get(C));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(p.keys()).find(C=>C.toLowerCase()=="content-type"),P=a.FormData&&c instanceof a.FormData,!(0<=Array.prototype.indexOf.call(xy,f,void 0))||_||P||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[C,F]of p)this.g.setRequestHeader(C,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{dh(this),this.u=!0,this.g.send(c),this.u=!1}catch(C){ch(this,C)}};function ch(c,f){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=f,c.m=5,uh(c),vr(c)}function uh(c){c.A||(c.A=!0,Qt(c,"complete"),Qt(c,"error"))}n.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=c||7,Qt(this,"complete"),Qt(this,"abort"),vr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),vr(this,!0)),bt.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?hh(this):this.bb())},n.bb=function(){hh(this)};function hh(c){if(c.h&&typeof o<"u"&&(!c.v[1]||Re(c)!=4||c.Z()!=2)){if(c.u&&Re(c)==4)Mu(c.Ea,0,c);else if(Qt(c,"readystatechange"),Re(c)==4){c.h=!1;try{const F=c.Z();t:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var f=!0;break t;default:f=!1}var p;if(!(p=f)){var _;if(_=F===0){var P=String(c.D).match(eh)[1]||null;!P&&a.self&&a.self.location&&(P=a.self.location.protocol.slice(0,-1)),_=!wy.test(P?P.toLowerCase():"")}p=_}if(p)Qt(c,"complete"),Qt(c,"success");else{c.m=6;try{var C=2<Re(c)?c.g.statusText:""}catch{C=""}c.l=C+" ["+c.Z()+"]",uh(c)}}finally{vr(c)}}}}function vr(c,f){if(c.g){dh(c);const p=c.g,_=c.v[0]?()=>{}:null;c.g=null,c.v=null,f||Qt(c,"ready");try{p.onreadystatechange=_}catch{}}}function dh(c){c.I&&(a.clearTimeout(c.I),c.I=null)}n.isActive=function(){return!!this.g};function Re(c){return c.g?c.g.readyState:0}n.Z=function(){try{return 2<Re(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(c){if(this.g){var f=this.g.responseText;return c&&f.indexOf(c)==0&&(f=f.substring(c.length)),ty(f)}};function fh(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.H){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function Ey(c){const f={};c=(c.g&&2<=Re(c)&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<c.length;_++){if(R(c[_]))continue;var p=T(c[_]);const P=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const C=f[P]||[];f[P]=C,C.push(p)}E(f,function(_){return _.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ji(c,f,p){return p&&p.internalChannelParams&&p.internalChannelParams[c]||f}function gh(c){this.Aa=0,this.i=[],this.j=new Wi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ji("failFast",!1,c),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ji("baseRetryDelayMs",5e3,c),this.cb=Ji("retryDelaySeedMs",1e4,c),this.Wa=Ji("forwardChannelMaxRetries",2,c),this.wa=Ji("forwardChannelRequestTimeoutMs",2e4,c),this.pa=c&&c.xmlHttpFactory||void 0,this.Xa=c&&c.Tb||void 0,this.Ca=c&&c.useFetchStreams||!1,this.L=void 0,this.J=c&&c.supportsCrossDomainXhr||!1,this.K="",this.h=new Yu(c&&c.concurrentRequestLimit),this.Da=new by,this.P=c&&c.fastHandshake||!1,this.O=c&&c.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=c&&c.Rb||!1,c&&c.xa&&this.j.xa(),c&&c.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&c&&c.detectBufferingProxy||!1,this.ja=void 0,c&&c.longPollingTimeout&&0<c.longPollingTimeout&&(this.ja=c.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=gh.prototype,n.la=8,n.G=1,n.connect=function(c,f,p,_){Xt(0),this.W=c,this.H=f||{},p&&_!==void 0&&(this.H.OSID=p,this.H.OAID=_),this.F=this.X,this.I=Eh(this,null,this.W),xr(this)};function Da(c){if(ph(c),c.G==3){var f=c.U++,p=Pe(c.I);if(ut(p,"SID",c.K),ut(p,"RID",f),ut(p,"TYPE","terminate"),Zi(c,p),f=new Xe(c,c.j,f),f.L=2,f.v=yr(Pe(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(f.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=f.v,p=!0),p||(f.g=kh(f.j,null),f.g.ea(f.v)),f.F=Date.now(),gr(f)}xh(c)}function wr(c){c.g&&(La(c),c.g.cancel(),c.g=null)}function ph(c){wr(c),c.u&&(a.clearTimeout(c.u),c.u=null),Er(c),c.h.cancel(),c.s&&(typeof c.s=="number"&&a.clearTimeout(c.s),c.s=null)}function xr(c){if(!Qu(c.h)&&!c.s){c.s=!0;var f=c.Ga;ot||Te(),Ct||(ot(),Ct=!0),kt.add(f,c),c.B=0}}function ky(c,f){return Xu(c.h)>=c.h.j-(c.s?1:0)?!1:c.s?(c.i=f.D.concat(c.i),!0):c.G==1||c.G==2||c.B>=(c.Va?0:c.Wa)?!1:(c.s=Hi(g(c.Ga,c,f),wh(c,c.B)),c.B++,!0)}n.Ga=function(c){if(this.s)if(this.s=null,this.G==1){if(!c){this.U=Math.floor(1e5*Math.random()),c=this.U++;const P=new Xe(this,this.j,c);let C=this.o;if(this.S&&(C?(C=b(C),I(C,this.S)):C=this.S),this.m!==null||this.O||(P.H=C,C=null),this.P)t:{for(var f=0,p=0;p<this.i.length;p++){e:{var _=this.i[p];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break e}_=void 0}if(_===void 0)break;if(f+=_,4096<f){f=p;break t}if(f===4096||p===this.i.length-1){f=p+1;break t}}f=1e3}else f=1e3;f=yh(this,P,f),p=Pe(this.I),ut(p,"RID",c),ut(p,"CVER",22),this.D&&ut(p,"X-HTTP-Session-Id",this.D),Zi(this,p),C&&(this.O?f="headers="+encodeURIComponent(String(lh(C)))+"&"+f:this.m&&Ca(p,this.m,C)),Ra(this.h,P),this.Ua&&ut(p,"TYPE","init"),this.P?(ut(p,"$req",f),ut(p,"SID","null"),P.T=!0,Ta(P,p,null)):Ta(P,p,f),this.G=2}}else this.G==3&&(c?mh(this,c):this.i.length==0||Qu(this.h)||mh(this))};function mh(c,f){var p;f?p=f.l:p=c.U++;const _=Pe(c.I);ut(_,"SID",c.K),ut(_,"RID",p),ut(_,"AID",c.T),Zi(c,_),c.m&&c.o&&Ca(_,c.m,c.o),p=new Xe(c,c.j,p,c.B+1),c.m===null&&(p.H=c.o),f&&(c.i=f.D.concat(c.i)),f=yh(c,p,1e3),p.I=Math.round(.5*c.wa)+Math.round(.5*c.wa*Math.random()),Ra(c.h,p),Ta(p,_,f)}function Zi(c,f){c.H&&V(c.H,function(p,_){ut(f,_,p)}),c.l&&th({},function(p,_){ut(f,_,p)})}function yh(c,f,p){p=Math.min(c.i.length,p);var _=c.l?g(c.l.Na,c.l,c):null;t:{var P=c.i;let C=-1;for(;;){const F=["count="+p];C==-1?0<p?(C=P[0].g,F.push("ofs="+C)):C=0:F.push("ofs="+C);let at=!0;for(let Dt=0;Dt<p;Dt++){let et=P[Dt].g;const Bt=P[Dt].map;if(et-=C,0>et)C=Math.max(0,P[Dt].g-100),at=!1;else try{vy(Bt,F,"req"+et+"_")}catch{_&&_(Bt)}}if(at){_=F.join("&");break t}}}return c=c.i.splice(0,p),f.D=c,_}function _h(c){if(!c.g&&!c.u){c.Y=1;var f=c.Fa;ot||Te(),Ct||(ot(),Ct=!0),kt.add(f,c),c.v=0}}function Ma(c){return c.g||c.u||3<=c.v?!1:(c.Y++,c.u=Hi(g(c.Fa,c),wh(c,c.v)),c.v++,!0)}n.Fa=function(){if(this.u=null,bh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var c=2*this.R;this.j.info("BP detection timer enabled: "+c),this.A=Hi(g(this.ab,this),c)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Xt(10),wr(this),bh(this))};function La(c){c.A!=null&&(a.clearTimeout(c.A),c.A=null)}function bh(c){c.g=new Xe(c,c.j,"rpc",c.Y),c.m===null&&(c.g.H=c.o),c.g.O=0;var f=Pe(c.qa);ut(f,"RID","rpc"),ut(f,"SID",c.K),ut(f,"AID",c.T),ut(f,"CI",c.F?"0":"1"),!c.F&&c.ja&&ut(f,"TO",c.ja),ut(f,"TYPE","xmlhttp"),Zi(c,f),c.m&&c.o&&Ca(f,c.m,c.o),c.L&&(c.g.I=c.L);var p=c.g;c=c.ia,p.L=1,p.v=yr(Pe(f)),p.m=null,p.P=!0,qu(p,c)}n.Za=function(){this.C!=null&&(this.C=null,wr(this),Ma(this),Xt(19))};function Er(c){c.C!=null&&(a.clearTimeout(c.C),c.C=null)}function vh(c,f){var p=null;if(c.g==f){Er(c),La(c),c.g=null;var _=2}else if(Pa(c.h,f))p=f.D,Ju(c.h,f),_=1;else return;if(c.G!=0){if(f.o)if(_==1){p=f.m?f.m.length:0,f=Date.now()-f.F;var P=c.B;_=hr(),Qt(_,new zu(_,p)),xr(c)}else _h(c);else if(P=f.s,P==3||P==0&&0<f.X||!(_==1&&ky(c,f)||_==2&&Ma(c)))switch(p&&0<p.length&&(f=c.h,f.i=f.i.concat(p)),P){case 1:Cn(c,5);break;case 4:Cn(c,10);break;case 3:Cn(c,6);break;default:Cn(c,2)}}}function wh(c,f){let p=c.Ta+Math.floor(Math.random()*c.cb);return c.isActive()||(p*=2),p*f}function Cn(c,f){if(c.j.info("Error code "+f),f==2){var p=g(c.fb,c),_=c.Xa;const P=!_;_=new Rn(_||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||pr(_,"https"),yr(_),P?yy(_.toString(),p):_y(_.toString(),p)}else Xt(2);c.G=0,c.l&&c.l.sa(f),xh(c),ph(c)}n.fb=function(c){c?(this.j.info("Successfully pinged google.com"),Xt(2)):(this.j.info("Failed to ping google.com"),Xt(1))};function xh(c){if(c.G=0,c.ka=[],c.l){const f=Zu(c.h);(f.length!=0||c.i.length!=0)&&(w(c.ka,f),w(c.ka,c.i),c.h.i.length=0,v(c.i),c.i.length=0),c.l.ra()}}function Eh(c,f,p){var _=p instanceof Rn?Pe(p):new Rn(p);if(_.g!="")f&&(_.g=f+"."+_.g),mr(_,_.s);else{var P=a.location;_=P.protocol,f=f?f+"."+P.hostname:P.hostname,P=+P.port;var C=new Rn(null);_&&pr(C,_),f&&(C.g=f),P&&mr(C,P),p&&(C.l=p),_=C}return p=c.D,f=c.ya,p&&f&&ut(_,p,f),ut(_,"VER",c.la),Zi(c,_),_}function kh(c,f,p){if(f&&!c.J)throw Error("Can't create secondary domain capable XhrIo object.");return f=c.Ca&&!c.pa?new bt(new _r({eb:p})):new bt(c.pa),f.Ha(c.J),f}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ih(){}n=Ih.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function kr(){}kr.prototype.g=function(c,f){return new ne(c,f)};function ne(c,f){Ft.call(this),this.g=new gh(f),this.l=c,this.h=f&&f.messageUrlParams||null,c=f&&f.messageHeaders||null,f&&f.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=f&&f.initMessageHeaders||null,f&&f.messageContentType&&(c?c["X-WebChannel-Content-Type"]=f.messageContentType:c={"X-WebChannel-Content-Type":f.messageContentType}),f&&f.va&&(c?c["X-WebChannel-Client-Profile"]=f.va:c={"X-WebChannel-Client-Profile":f.va}),this.g.S=c,(c=f&&f.Sb)&&!R(c)&&(this.g.m=c),this.v=f&&f.supportsCrossDomainXhr||!1,this.u=f&&f.sendRawJson||!1,(f=f&&f.httpSessionIdParam)&&!R(f)&&(this.g.D=f,c=this.h,c!==null&&f in c&&(c=this.h,f in c&&delete c[f])),this.j=new ai(this)}y(ne,Ft),ne.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ne.prototype.close=function(){Da(this.g)},ne.prototype.o=function(c){var f=this.g;if(typeof c=="string"){var p={};p.__data__=c,c=p}else this.u&&(p={},p.__data__=va(c),c=p);f.i.push(new ay(f.Ya++,c)),f.G==3&&xr(f)},ne.prototype.N=function(){this.g.l=null,delete this.j,Da(this.g),delete this.g,ne.aa.N.call(this)};function Th(c){xa.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var f=c.__sm__;if(f){t:{for(const p in f){c=p;break t}c=void 0}(this.i=c)&&(c=this.i,f=f!==null&&c in f?f[c]:void 0),this.data=f}else this.data=c}y(Th,xa);function Ah(){Ea.call(this),this.status=1}y(Ah,Ea);function ai(c){this.g=c}y(ai,Ih),ai.prototype.ua=function(){Qt(this.g,"a")},ai.prototype.ta=function(c){Qt(this.g,new Th(c))},ai.prototype.sa=function(c){Qt(this.g,new Ah)},ai.prototype.ra=function(){Qt(this.g,"b")},kr.prototype.createWebChannel=kr.prototype.g,ne.prototype.send=ne.prototype.o,ne.prototype.open=ne.prototype.m,ne.prototype.close=ne.prototype.close,bp=function(){return new kr},_p=function(){return hr()},yp=Sn,xl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},dr.NO_ERROR=0,dr.TIMEOUT=8,dr.HTTP_ERROR=6,Yr=dr,$u.COMPLETE="complete",mp=$u,Fu.EventType=zi,zi.OPEN="a",zi.CLOSE="b",zi.ERROR="c",zi.MESSAGE="d",Ft.prototype.listen=Ft.prototype.K,ls=Fu,bt.prototype.listenOnce=bt.prototype.L,bt.prototype.getLastError=bt.prototype.Ka,bt.prototype.getLastErrorCode=bt.prototype.Ba,bt.prototype.getStatus=bt.prototype.Z,bt.prototype.getResponseJson=bt.prototype.Oa,bt.prototype.getResponseText=bt.prototype.oa,bt.prototype.send=bt.prototype.ea,bt.prototype.setWithCredentials=bt.prototype.Ha,pp=bt}).apply(typeof Ar<"u"?Ar:typeof self<"u"?self:typeof window<"u"?window:{});const rd="@firebase/firestore";/**
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
 */class $t{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}$t.UNAUTHENTICATED=new $t(null),$t.GOOGLE_CREDENTIALS=new $t("google-credentials-uid"),$t.FIRST_PARTY=new $t("first-party-uid"),$t.MOCK_USER=new $t("mock-user");/**
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
 */let Ni="10.14.0";/**
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
 */const bn=new oc("@firebase/firestore");function ts(){return bn.logLevel}function xw(n){bn.setLogLevel(n)}function j(n,...t){if(bn.logLevel<=X.DEBUG){const e=t.map(_c);bn.debug(`Firestore (${Ni}): ${n}`,...e)}}function Ke(n,...t){if(bn.logLevel<=X.ERROR){const e=t.map(_c);bn.error(`Firestore (${Ni}): ${n}`,...e)}}function ki(n,...t){if(bn.logLevel<=X.WARN){const e=t.map(_c);bn.warn(`Firestore (${Ni}): ${n}`,...e)}}function _c(n){if(typeof n=="string")return n;try{/**
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
 */function H(n="Unexpected state"){const t=`FIRESTORE (${Ni}) INTERNAL ASSERTION FAILED: `+n;throw Ke(t),new Error(t)}function rt(n,t){n||H()}function K(n,t){return n}/**
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
 */const O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends Ye{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class $e{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
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
 */class vp{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Ew{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e($t.UNAUTHENTICATED))}shutdown(){}}class kw{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class Iw{constructor(t){this.t=t,this.currentUser=$t.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){rt(this.o===void 0);let i=this.i;const s=l=>this.i!==i?(i=this.i,e(l)):Promise.resolve();let r=new $e;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new $e,t.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const l=r;t.enqueueRetryable(async()=>{await l.promise,await s(this.currentUser)})},a=l=>{j("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(l=>a(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?a(l):(j("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new $e)}},0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(i=>this.i!==t?(j("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(rt(typeof i.accessToken=="string"),new vp(i.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return rt(t===null||typeof t=="string"),new $t(t)}}class Tw{constructor(t,e,i){this.l=t,this.h=e,this.P=i,this.type="FirstParty",this.user=$t.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Aw{constructor(t,e,i){this.l=t,this.h=e,this.P=i}getToken(){return Promise.resolve(new Tw(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e($t.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Sw{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Pw{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){rt(this.o===void 0);const i=r=>{r.error!=null&&j("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,j("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(r.token):Promise.resolve()};this.o=r=>{t.enqueueRetryable(()=>i(r))};const s=r=>{j("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>s(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?s(r):j("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(rt(typeof e.token=="string"),this.R=e.token,new Sw(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Rw(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let i=0;i<n;i++)e[i]=Math.floor(256*Math.random());return e}/**
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
 */class wp{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let i="";for(;i.length<20;){const s=Rw(40);for(let r=0;r<s.length;++r)i.length<20&&s[r]<e&&(i+=t.charAt(s[r]%t.length))}return i}}function nt(n,t){return n<t?-1:n>t?1:0}function Ii(n,t,e){return n.length===t.length&&n.every((i,s)=>e(i,t[s]))}/**
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
 */class pt{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new U(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new U(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new U(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new U(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return pt.fromMillis(Date.now())}static fromDate(t){return pt.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),i=Math.floor(1e6*(t-1e3*e));return new pt(e,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?nt(this.nanoseconds,t.nanoseconds):nt(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class Cs{constructor(t,e,i){e===void 0?e=0:e>t.length&&H(),i===void 0?i=t.length-e:i>t.length-e&&H(),this.segments=t,this.offset=e,this.len=i}get length(){return this.len}isEqual(t){return Cs.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Cs?t.forEach(i=>{e.push(i)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,i=this.limit();e<i;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const i=Math.min(t.length,e.length);for(let s=0;s<i;s++){const r=t.get(s),o=e.get(s);if(r<o)return-1;if(r>o)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class ht extends Cs{construct(t,e,i){return new ht(t,e,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const i of t){if(i.indexOf("//")>=0)throw new U(O.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);e.push(...i.split("/").filter(s=>s.length>0))}return new ht(e)}static emptyPath(){return new ht([])}}const Cw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Lt extends Cs{construct(t,e,i){return new Lt(t,e,i)}static isValidIdentifier(t){return Cw.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Lt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Lt(["__name__"])}static fromServerFormat(t){const e=[];let i="",s=0;const r=()=>{if(i.length===0)throw new U(O.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(i),i=""};let o=!1;for(;s<t.length;){const a=t[s];if(a==="\\"){if(s+1===t.length)throw new U(O.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const l=t[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new U(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);i+=l,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(i+=a,s++):(r(),s++)}if(r(),o)throw new U(O.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Lt(e)}static emptyPath(){return new Lt([])}}/**
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
 */class z{constructor(t){this.path=t}static fromPath(t){return new z(ht.fromString(t))}static fromName(t){return new z(ht.fromString(t).popFirst(5))}static empty(){return new z(ht.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&ht.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return ht.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new z(new ht(t.slice()))}}function Dw(n,t){const e=n.toTimestamp().seconds,i=n.toTimestamp().nanoseconds+1,s=W.fromTimestamp(i===1e9?new pt(e+1,0):new pt(e,i));return new vn(s,z.empty(),t)}function Mw(n){return new vn(n.readTime,n.key,-1)}class vn{constructor(t,e,i){this.readTime=t,this.documentKey=e,this.largestBatchId=i}static min(){return new vn(W.min(),z.empty(),-1)}static max(){return new vn(W.max(),z.empty(),-1)}}function Lw(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=z.comparator(n.documentKey,t.documentKey),e!==0?e:nt(n.largestBatchId,t.largestBatchId))}/**
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
 */const Ow="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Vw{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
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
 */async function Xs(n){if(n.code!==O.FAILED_PRECONDITION||n.message!==Ow)throw n;j("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class N{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&H(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new N((i,s)=>{this.nextCallback=r=>{this.wrapSuccess(t,r).next(i,s)},this.catchCallback=r=>{this.wrapFailure(e,r).next(i,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof N?e:N.resolve(e)}catch(e){return N.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):N.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):N.reject(e)}static resolve(t){return new N((e,i)=>{e(t)})}static reject(t){return new N((e,i)=>{i(t)})}static waitFor(t){return new N((e,i)=>{let s=0,r=0,o=!1;t.forEach(a=>{++s,a.next(()=>{++r,o&&r===s&&e()},l=>i(l))}),o=!0,r===s&&e()})}static or(t){let e=N.resolve(!1);for(const i of t)e=e.next(s=>s?N.resolve(s):i());return e}static forEach(t,e){const i=[];return t.forEach((s,r)=>{i.push(e.call(this,s,r))}),this.waitFor(i)}static mapArray(t,e){return new N((i,s)=>{const r=t.length,o=new Array(r);let a=0;for(let l=0;l<r;l++){const u=l;e(t[u]).next(h=>{o[u]=h,++a,a===r&&i(o)},h=>s(h))}})}static doWhile(t,e){return new N((i,s)=>{const r=()=>{t()===!0?e().next(()=>{r()},s):i()};r()})}}function Nw(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Js(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class bc{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=i=>this.ie(i),this.se=i=>e.writeSequenceNumber(i))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}bc.oe=-1;function Wo(n){return n==null}function wo(n){return n===0&&1/n==-1/0}function Fw(n){return typeof n=="number"&&Number.isInteger(n)&&!wo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function od(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function Jn(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function xp(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
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
 */class yt{constructor(t,e){this.comparator=t,this.root=e||Mt.EMPTY}insert(t,e){return new yt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Mt.BLACK,null,null))}remove(t){return new yt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Mt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const i=this.comparator(t,e.key);if(i===0)return e.value;i<0?e=e.left:i>0&&(e=e.right)}return null}indexOf(t){let e=0,i=this.root;for(;!i.isEmpty();){const s=this.comparator(t,i.key);if(s===0)return e+i.left.size;s<0?i=i.left:(e+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,i)=>(t(e,i),!1))}toString(){const t=[];return this.inorderTraversal((e,i)=>(t.push(`${e}:${i}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Sr(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Sr(this.root,t,this.comparator,!1)}getReverseIterator(){return new Sr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Sr(this.root,t,this.comparator,!0)}}class Sr{constructor(t,e,i,s){this.isReverse=s,this.nodeStack=[];let r=1;for(;!t.isEmpty();)if(r=e?i(t.key,e):1,e&&s&&(r*=-1),r<0)t=this.isReverse?t.left:t.right;else{if(r===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Mt{constructor(t,e,i,s,r){this.key=t,this.value=e,this.color=i??Mt.RED,this.left=s??Mt.EMPTY,this.right=r??Mt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,i,s,r){return new Mt(t??this.key,e??this.value,i??this.color,s??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,i){let s=this;const r=i(t,s.key);return s=r<0?s.copy(null,null,null,s.left.insert(t,e,i),null):r===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,i)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Mt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let i,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return Mt.EMPTY;i=s.right.min(),s=s.copy(i.key,i.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Mt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Mt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw H();const t=this.left.check();if(t!==this.right.check())throw H();return t+(this.isRed()?0:1)}}Mt.EMPTY=null,Mt.RED=!0,Mt.BLACK=!1;Mt.EMPTY=new class{constructor(){this.size=0}get key(){throw H()}get value(){throw H()}get color(){throw H()}get left(){throw H()}get right(){throw H()}copy(t,e,i,s,r){return this}insert(t,e,i){return new Mt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Vt{constructor(t){this.comparator=t,this.data=new yt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,i)=>(t(e),!1))}forEachInRange(t,e){const i=this.data.getIteratorFrom(t[0]);for(;i.hasNext();){const s=i.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let i;for(i=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();i.hasNext();)if(!t(i.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new ad(this.data.getIterator())}getIteratorFrom(t){return new ad(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(i=>{e=e.add(i)}),e}isEqual(t){if(!(t instanceof Vt)||this.size!==t.size)return!1;const e=this.data.getIterator(),i=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,r=i.getNext().key;if(this.comparator(s,r)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Vt(this.comparator);return e.data=t,e}}class ad{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class se{constructor(t){this.fields=t,t.sort(Lt.comparator)}static empty(){return new se([])}unionWith(t){let e=new Vt(Lt.comparator);for(const i of this.fields)e=e.add(i);for(const i of t)e=e.add(i);return new se(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Ii(this.fields,t.fields,(e,i)=>e.isEqual(i))}}/**
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
 */class Ep extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Nt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Ep("Invalid base64 string: "+r):r}}(t);return new Nt(e)}static fromUint8Array(t){const e=function(s){let r="";for(let o=0;o<s.length;++o)r+=String.fromCharCode(s[o]);return r}(t);return new Nt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const i=new Uint8Array(e.length);for(let s=0;s<e.length;s++)i[s]=e.charCodeAt(s);return i}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return nt(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Nt.EMPTY_BYTE_STRING=new Nt("");const Bw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function wn(n){if(rt(!!n),typeof n=="string"){let t=0;const e=Bw.exec(n);if(rt(!!e),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const i=new Date(n);return{seconds:Math.floor(i.getTime()/1e3),nanos:t}}return{seconds:xt(n.seconds),nanos:xt(n.nanos)}}function xt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Kn(n){return typeof n=="string"?Nt.fromBase64String(n):Nt.fromUint8Array(n)}/**
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
 */function vc(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function wc(n){const t=n.mapValue.fields.__previous_value__;return vc(t)?wc(t):t}function Ds(n){const t=wn(n.mapValue.fields.__local_write_time__.timestampValue);return new pt(t.seconds,t.nanos)}/**
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
 */class Uw{constructor(t,e,i,s,r,o,a,l,u){this.databaseId=t,this.appId=e,this.persistenceKey=i,this.host=s,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=l,this.useFetchStreams=u}}class Ms{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new Ms("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof Ms&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const Pr={mapValue:{}};function Gn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?vc(n)?4:zw(n)?9007199254740991:jw(n)?10:11:H()}function Ie(n,t){if(n===t)return!0;const e=Gn(n);if(e!==Gn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Ds(n).isEqual(Ds(t));case 3:return function(s,r){if(typeof s.timestampValue=="string"&&typeof r.timestampValue=="string"&&s.timestampValue.length===r.timestampValue.length)return s.timestampValue===r.timestampValue;const o=wn(s.timestampValue),a=wn(r.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,r){return Kn(s.bytesValue).isEqual(Kn(r.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,r){return xt(s.geoPointValue.latitude)===xt(r.geoPointValue.latitude)&&xt(s.geoPointValue.longitude)===xt(r.geoPointValue.longitude)}(n,t);case 2:return function(s,r){if("integerValue"in s&&"integerValue"in r)return xt(s.integerValue)===xt(r.integerValue);if("doubleValue"in s&&"doubleValue"in r){const o=xt(s.doubleValue),a=xt(r.doubleValue);return o===a?wo(o)===wo(a):isNaN(o)&&isNaN(a)}return!1}(n,t);case 9:return Ii(n.arrayValue.values||[],t.arrayValue.values||[],Ie);case 10:case 11:return function(s,r){const o=s.mapValue.fields||{},a=r.mapValue.fields||{};if(od(o)!==od(a))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(a[l]===void 0||!Ie(o[l],a[l])))return!1;return!0}(n,t);default:return H()}}function Ls(n,t){return(n.values||[]).find(e=>Ie(e,t))!==void 0}function Ti(n,t){if(n===t)return 0;const e=Gn(n),i=Gn(t);if(e!==i)return nt(e,i);switch(e){case 0:case 9007199254740991:return 0;case 1:return nt(n.booleanValue,t.booleanValue);case 2:return function(r,o){const a=xt(r.integerValue||r.doubleValue),l=xt(o.integerValue||o.doubleValue);return a<l?-1:a>l?1:a===l?0:isNaN(a)?isNaN(l)?0:-1:1}(n,t);case 3:return ld(n.timestampValue,t.timestampValue);case 4:return ld(Ds(n),Ds(t));case 5:return nt(n.stringValue,t.stringValue);case 6:return function(r,o){const a=Kn(r),l=Kn(o);return a.compareTo(l)}(n.bytesValue,t.bytesValue);case 7:return function(r,o){const a=r.split("/"),l=o.split("/");for(let u=0;u<a.length&&u<l.length;u++){const h=nt(a[u],l[u]);if(h!==0)return h}return nt(a.length,l.length)}(n.referenceValue,t.referenceValue);case 8:return function(r,o){const a=nt(xt(r.latitude),xt(o.latitude));return a!==0?a:nt(xt(r.longitude),xt(o.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return cd(n.arrayValue,t.arrayValue);case 10:return function(r,o){var a,l,u,h;const d=r.fields||{},g=o.fields||{},m=(a=d.value)===null||a===void 0?void 0:a.arrayValue,y=(l=g.value)===null||l===void 0?void 0:l.arrayValue,v=nt(((u=m==null?void 0:m.values)===null||u===void 0?void 0:u.length)||0,((h=y==null?void 0:y.values)===null||h===void 0?void 0:h.length)||0);return v!==0?v:cd(m,y)}(n.mapValue,t.mapValue);case 11:return function(r,o){if(r===Pr.mapValue&&o===Pr.mapValue)return 0;if(r===Pr.mapValue)return 1;if(o===Pr.mapValue)return-1;const a=r.fields||{},l=Object.keys(a),u=o.fields||{},h=Object.keys(u);l.sort(),h.sort();for(let d=0;d<l.length&&d<h.length;++d){const g=nt(l[d],h[d]);if(g!==0)return g;const m=Ti(a[l[d]],u[h[d]]);if(m!==0)return m}return nt(l.length,h.length)}(n.mapValue,t.mapValue);default:throw H()}}function ld(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return nt(n,t);const e=wn(n),i=wn(t),s=nt(e.seconds,i.seconds);return s!==0?s:nt(e.nanos,i.nanos)}function cd(n,t){const e=n.values||[],i=t.values||[];for(let s=0;s<e.length&&s<i.length;++s){const r=Ti(e[s],i[s]);if(r)return r}return nt(e.length,i.length)}function Ai(n){return El(n)}function El(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const i=wn(e);return`time(${i.seconds},${i.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return Kn(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return z.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let i="[",s=!0;for(const r of e.values||[])s?s=!1:i+=",",i+=El(r);return i+"]"}(n.arrayValue):"mapValue"in n?function(e){const i=Object.keys(e.fields||{}).sort();let s="{",r=!0;for(const o of i)r?r=!1:s+=",",s+=`${o}:${El(e.fields[o])}`;return s+"}"}(n.mapValue):H()}function ud(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function kl(n){return!!n&&"integerValue"in n}function xc(n){return!!n&&"arrayValue"in n}function hd(n){return!!n&&"nullValue"in n}function dd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Qr(n){return!!n&&"mapValue"in n}function jw(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="__vector__"}function vs(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const t={mapValue:{fields:{}}};return Jn(n.mapValue.fields,(e,i)=>t.mapValue.fields[e]=vs(i)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=vs(n.arrayValue.values[e]);return t}return Object.assign({},n)}function zw(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class te{constructor(t){this.value=t}static empty(){return new te({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let i=0;i<t.length-1;++i)if(e=(e.mapValue.fields||{})[t.get(i)],!Qr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=vs(e)}setAll(t){let e=Lt.emptyPath(),i={},s=[];t.forEach((o,a)=>{if(!e.isImmediateParentOf(a)){const l=this.getFieldsMap(e);this.applyChanges(l,i,s),i={},s=[],e=a.popLast()}o?i[a.lastSegment()]=vs(o):s.push(a.lastSegment())});const r=this.getFieldsMap(e);this.applyChanges(r,i,s)}delete(t){const e=this.field(t.popLast());Qr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Ie(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let i=0;i<t.length;++i){let s=e.mapValue.fields[t.get(i)];Qr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(i)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,i){Jn(e,(s,r)=>t[s]=r);for(const s of i)delete t[s]}clone(){return new te(vs(this.value))}}function kp(n){const t=[];return Jn(n.fields,(e,i)=>{const s=new Lt([e]);if(Qr(i)){const r=kp(i.mapValue).fields;if(r.length===0)t.push(s);else for(const o of r)t.push(s.child(o))}else t.push(s)}),new se(t)}/**
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
 */class Wt{constructor(t,e,i,s,r,o,a){this.key=t,this.documentType=e,this.version=i,this.readTime=s,this.createTime=r,this.data=o,this.documentState=a}static newInvalidDocument(t){return new Wt(t,0,W.min(),W.min(),W.min(),te.empty(),0)}static newFoundDocument(t,e,i,s){return new Wt(t,1,e,W.min(),i,s,0)}static newNoDocument(t,e){return new Wt(t,2,e,W.min(),W.min(),te.empty(),0)}static newUnknownDocument(t,e){return new Wt(t,3,e,W.min(),W.min(),te.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(W.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=te.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=te.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=W.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Wt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Wt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class xo{constructor(t,e){this.position=t,this.inclusive=e}}function fd(n,t,e){let i=0;for(let s=0;s<n.position.length;s++){const r=t[s],o=n.position[s];if(r.field.isKeyField()?i=z.comparator(z.fromName(o.referenceValue),e.key):i=Ti(o,e.data.field(r.field)),r.dir==="desc"&&(i*=-1),i!==0)break}return i}function gd(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Ie(n.position[e],t.position[e]))return!1;return!0}/**
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
 */class Eo{constructor(t,e="asc"){this.field=t,this.dir=e}}function $w(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
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
 */class Ip{}class Tt extends Ip{constructor(t,e,i){super(),this.field=t,this.op=e,this.value=i}static create(t,e,i){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,i):new Ww(t,e,i):e==="array-contains"?new Gw(t,i):e==="in"?new Yw(t,i):e==="not-in"?new Qw(t,i):e==="array-contains-any"?new Xw(t,i):new Tt(t,e,i)}static createKeyFieldInFilter(t,e,i){return e==="in"?new qw(t,i):new Kw(t,i)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(Ti(e,this.value)):e!==null&&Gn(this.value)===Gn(e)&&this.matchesComparison(Ti(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return H()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class me extends Ip{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new me(t,e)}matches(t){return Tp(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Tp(n){return n.op==="and"}function Ap(n){return Hw(n)&&Tp(n)}function Hw(n){for(const t of n.filters)if(t instanceof me)return!1;return!0}function Il(n){if(n instanceof Tt)return n.field.canonicalString()+n.op.toString()+Ai(n.value);if(Ap(n))return n.filters.map(t=>Il(t)).join(",");{const t=n.filters.map(e=>Il(e)).join(",");return`${n.op}(${t})`}}function Sp(n,t){return n instanceof Tt?function(i,s){return s instanceof Tt&&i.op===s.op&&i.field.isEqual(s.field)&&Ie(i.value,s.value)}(n,t):n instanceof me?function(i,s){return s instanceof me&&i.op===s.op&&i.filters.length===s.filters.length?i.filters.reduce((r,o,a)=>r&&Sp(o,s.filters[a]),!0):!1}(n,t):void H()}function Pp(n){return n instanceof Tt?function(e){return`${e.field.canonicalString()} ${e.op} ${Ai(e.value)}`}(n):n instanceof me?function(e){return e.op.toString()+" {"+e.getFilters().map(Pp).join(" ,")+"}"}(n):"Filter"}class Ww extends Tt{constructor(t,e,i){super(t,e,i),this.key=z.fromName(i.referenceValue)}matches(t){const e=z.comparator(t.key,this.key);return this.matchesComparison(e)}}class qw extends Tt{constructor(t,e){super(t,"in",e),this.keys=Rp("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Kw extends Tt{constructor(t,e){super(t,"not-in",e),this.keys=Rp("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Rp(n,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(i=>z.fromName(i.referenceValue))}class Gw extends Tt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return xc(e)&&Ls(e.arrayValue,this.value)}}class Yw extends Tt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Ls(this.value.arrayValue,e)}}class Qw extends Tt{constructor(t,e){super(t,"not-in",e)}matches(t){if(Ls(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!Ls(this.value.arrayValue,e)}}class Xw extends Tt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!xc(e)||!e.arrayValue.values)&&e.arrayValue.values.some(i=>Ls(this.value.arrayValue,i))}}/**
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
 */class Jw{constructor(t,e=null,i=[],s=[],r=null,o=null,a=null){this.path=t,this.collectionGroup=e,this.orderBy=i,this.filters=s,this.limit=r,this.startAt=o,this.endAt=a,this.ue=null}}function pd(n,t=null,e=[],i=[],s=null,r=null,o=null){return new Jw(n,t,e,i,s,r,o)}function Ec(n){const t=K(n);if(t.ue===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(i=>Il(i)).join(","),e+="|ob:",e+=t.orderBy.map(i=>function(r){return r.field.canonicalString()+r.dir}(i)).join(","),Wo(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(i=>Ai(i)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(i=>Ai(i)).join(",")),t.ue=e}return t.ue}function kc(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!$w(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!Sp(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!gd(n.startAt,t.startAt)&&gd(n.endAt,t.endAt)}function Tl(n){return z.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Zs{constructor(t,e=null,i=[],s=[],r=null,o="F",a=null,l=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=i,this.filters=s,this.limit=r,this.limitType=o,this.startAt=a,this.endAt=l,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Zw(n,t,e,i,s,r,o,a){return new Zs(n,t,e,i,s,r,o,a)}function qo(n){return new Zs(n)}function md(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Cp(n){return n.collectionGroup!==null}function ws(n){const t=K(n);if(t.ce===null){t.ce=[];const e=new Set;for(const r of t.explicitOrderBy)t.ce.push(r),e.add(r.field.canonicalString());const i=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Vt(Lt.comparator);return o.filters.forEach(l=>{l.getFlattenedFilters().forEach(u=>{u.isInequality()&&(a=a.add(u.field))})}),a})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.ce.push(new Eo(r,i))}),e.has(Lt.keyField().canonicalString())||t.ce.push(new Eo(Lt.keyField(),i))}return t.ce}function xe(n){const t=K(n);return t.le||(t.le=tx(t,ws(n))),t.le}function tx(n,t){if(n.limitType==="F")return pd(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const r=s.dir==="desc"?"asc":"desc";return new Eo(s.field,r)});const e=n.endAt?new xo(n.endAt.position,n.endAt.inclusive):null,i=n.startAt?new xo(n.startAt.position,n.startAt.inclusive):null;return pd(n.path,n.collectionGroup,t,n.filters,n.limit,e,i)}}function Al(n,t){const e=n.filters.concat([t]);return new Zs(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Sl(n,t,e){return new Zs(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function Ko(n,t){return kc(xe(n),xe(t))&&n.limitType===t.limitType}function Dp(n){return`${Ec(xe(n))}|lt:${n.limitType}`}function hi(n){return`Query(target=${function(e){let i=e.path.canonicalString();return e.collectionGroup!==null&&(i+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(i+=`, filters: [${e.filters.map(s=>Pp(s)).join(", ")}]`),Wo(e.limit)||(i+=", limit: "+e.limit),e.orderBy.length>0&&(i+=`, orderBy: [${e.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),e.startAt&&(i+=", startAt: ",i+=e.startAt.inclusive?"b:":"a:",i+=e.startAt.position.map(s=>Ai(s)).join(",")),e.endAt&&(i+=", endAt: ",i+=e.endAt.inclusive?"a:":"b:",i+=e.endAt.position.map(s=>Ai(s)).join(",")),`Target(${i})`}(xe(n))}; limitType=${n.limitType})`}function Go(n,t){return t.isFoundDocument()&&function(i,s){const r=s.key.path;return i.collectionGroup!==null?s.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(r):z.isDocumentKey(i.path)?i.path.isEqual(r):i.path.isImmediateParentOf(r)}(n,t)&&function(i,s){for(const r of ws(i))if(!r.field.isKeyField()&&s.data.field(r.field)===null)return!1;return!0}(n,t)&&function(i,s){for(const r of i.filters)if(!r.matches(s))return!1;return!0}(n,t)&&function(i,s){return!(i.startAt&&!function(o,a,l){const u=fd(o,a,l);return o.inclusive?u<=0:u<0}(i.startAt,ws(i),s)||i.endAt&&!function(o,a,l){const u=fd(o,a,l);return o.inclusive?u>=0:u>0}(i.endAt,ws(i),s))}(n,t)}function ex(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Mp(n){return(t,e)=>{let i=!1;for(const s of ws(n)){const r=nx(s,t,e);if(r!==0)return r;i=i||s.field.isKeyField()}return 0}}function nx(n,t,e){const i=n.field.isKeyField()?z.comparator(t.key,e.key):function(r,o,a){const l=o.data.field(r),u=a.data.field(r);return l!==null&&u!==null?Ti(l,u):H()}(n.field,t,e);switch(n.dir){case"asc":return i;case"desc":return-1*i;default:return H()}}/**
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
 */class Fi{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),i=this.inner[e];if(i!==void 0){for(const[s,r]of i)if(this.equalsFn(s,t))return r}}has(t){return this.get(t)!==void 0}set(t,e){const i=this.mapKeyFn(t),s=this.inner[i];if(s===void 0)return this.inner[i]=[[t,e]],void this.innerSize++;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],t))return void(s[r]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),i=this.inner[e];if(i===void 0)return!1;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],t))return i.length===1?delete this.inner[e]:i.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Jn(this.inner,(e,i)=>{for(const[s,r]of i)t(s,r)})}isEmpty(){return xp(this.inner)}size(){return this.innerSize}}/**
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
 */const ix=new yt(z.comparator);function Ge(){return ix}const Lp=new yt(z.comparator);function cs(...n){let t=Lp;for(const e of n)t=t.insert(e.key,e);return t}function Op(n){let t=Lp;return n.forEach((e,i)=>t=t.insert(e,i.overlayedDocument)),t}function Bn(){return xs()}function Vp(){return xs()}function xs(){return new Fi(n=>n.toString(),(n,t)=>n.isEqual(t))}const sx=new yt(z.comparator),rx=new Vt(z.comparator);function Y(...n){let t=rx;for(const e of n)t=t.add(e);return t}const ox=new Vt(nt);function ax(){return ox}/**
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
 */function Ic(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:wo(t)?"-0":t}}function Np(n){return{integerValue:""+n}}function lx(n,t){return Fw(t)?Np(t):Ic(n,t)}/**
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
 */class Yo{constructor(){this._=void 0}}function cx(n,t,e){return n instanceof ko?function(s,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return r&&vc(r)&&(r=wc(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(e,t):n instanceof Os?Bp(n,t):n instanceof Vs?Up(n,t):function(s,r){const o=Fp(s,r),a=yd(o)+yd(s.Pe);return kl(o)&&kl(s.Pe)?Np(a):Ic(s.serializer,a)}(n,t)}function ux(n,t,e){return n instanceof Os?Bp(n,t):n instanceof Vs?Up(n,t):e}function Fp(n,t){return n instanceof Io?function(i){return kl(i)||function(r){return!!r&&"doubleValue"in r}(i)}(t)?t:{integerValue:0}:null}class ko extends Yo{}class Os extends Yo{constructor(t){super(),this.elements=t}}function Bp(n,t){const e=jp(t);for(const i of n.elements)e.some(s=>Ie(s,i))||e.push(i);return{arrayValue:{values:e}}}class Vs extends Yo{constructor(t){super(),this.elements=t}}function Up(n,t){let e=jp(t);for(const i of n.elements)e=e.filter(s=>!Ie(s,i));return{arrayValue:{values:e}}}class Io extends Yo{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function yd(n){return xt(n.integerValue||n.doubleValue)}function jp(n){return xc(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function hx(n,t){return n.field.isEqual(t.field)&&function(i,s){return i instanceof Os&&s instanceof Os||i instanceof Vs&&s instanceof Vs?Ii(i.elements,s.elements,Ie):i instanceof Io&&s instanceof Io?Ie(i.Pe,s.Pe):i instanceof ko&&s instanceof ko}(n.transform,t.transform)}class dx{constructor(t,e){this.version=t,this.transformResults=e}}class fe{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new fe}static exists(t){return new fe(void 0,t)}static updateTime(t){return new fe(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Xr(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class Qo{}function zp(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new Tc(n.key,fe.none()):new tr(n.key,n.data,fe.none());{const e=n.data,i=te.empty();let s=new Vt(Lt.comparator);for(let r of t.fields)if(!s.has(r)){let o=e.field(r);o===null&&r.length>1&&(r=r.popLast(),o=e.field(r)),o===null?i.delete(r):i.set(r,o),s=s.add(r)}return new Tn(n.key,i,new se(s.toArray()),fe.none())}}function fx(n,t,e){n instanceof tr?function(s,r,o){const a=s.value.clone(),l=bd(s.fieldTransforms,r,o.transformResults);a.setAll(l),r.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(n,t,e):n instanceof Tn?function(s,r,o){if(!Xr(s.precondition,r))return void r.convertToUnknownDocument(o.version);const a=bd(s.fieldTransforms,r,o.transformResults),l=r.data;l.setAll($p(s)),l.setAll(a),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,t,e):function(s,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,t,e)}function Es(n,t,e,i){return n instanceof tr?function(r,o,a,l){if(!Xr(r.precondition,o))return a;const u=r.value.clone(),h=vd(r.fieldTransforms,l,o);return u.setAll(h),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(n,t,e,i):n instanceof Tn?function(r,o,a,l){if(!Xr(r.precondition,o))return a;const u=vd(r.fieldTransforms,l,o),h=o.data;return h.setAll($p(r)),h.setAll(u),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(d=>d.field))}(n,t,e,i):function(r,o,a){return Xr(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(n,t,e)}function gx(n,t){let e=null;for(const i of n.fieldTransforms){const s=t.data.field(i.field),r=Fp(i.transform,s||null);r!=null&&(e===null&&(e=te.empty()),e.set(i.field,r))}return e||null}function _d(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(i,s){return i===void 0&&s===void 0||!(!i||!s)&&Ii(i,s,(r,o)=>hx(r,o))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class tr extends Qo{constructor(t,e,i,s=[]){super(),this.key=t,this.value=e,this.precondition=i,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Tn extends Qo{constructor(t,e,i,s,r=[]){super(),this.key=t,this.data=e,this.fieldMask=i,this.precondition=s,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function $p(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const i=n.data.field(e);t.set(e,i)}}),t}function bd(n,t,e){const i=new Map;rt(n.length===e.length);for(let s=0;s<e.length;s++){const r=n[s],o=r.transform,a=t.data.field(r.field);i.set(r.field,ux(o,a,e[s]))}return i}function vd(n,t,e){const i=new Map;for(const s of n){const r=s.transform,o=e.data.field(s.field);i.set(s.field,cx(r,o,t))}return i}class Tc extends Qo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class px extends Qo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class mx{constructor(t,e,i,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=i,this.mutations=s}applyToRemoteDocument(t,e){const i=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const r=this.mutations[s];r.key.isEqual(t.key)&&fx(r,t,i[s])}}applyToLocalView(t,e){for(const i of this.baseMutations)i.key.isEqual(t.key)&&(e=Es(i,t,e,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(t.key)&&(e=Es(i,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const i=Vp();return this.mutations.forEach(s=>{const r=t.get(s.key),o=r.overlayedDocument;let a=this.applyToLocalView(o,r.mutatedFields);a=e.has(s.key)?null:a;const l=zp(o,a);l!==null&&i.set(s.key,l),o.isValidDocument()||o.convertToNoDocument(W.min())}),i}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),Y())}isEqual(t){return this.batchId===t.batchId&&Ii(this.mutations,t.mutations,(e,i)=>_d(e,i))&&Ii(this.baseMutations,t.baseMutations,(e,i)=>_d(e,i))}}class Ac{constructor(t,e,i,s){this.batch=t,this.commitVersion=e,this.mutationResults=i,this.docVersions=s}static from(t,e,i){rt(t.mutations.length===i.length);let s=function(){return sx}();const r=t.mutations;for(let o=0;o<r.length;o++)s=s.insert(r[o].key,i[o].version);return new Ac(t,e,i,s)}}/**
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
 */class yx{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class _x{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
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
 */var It,Z;function bx(n){switch(n){default:return H();case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0}}function Hp(n){if(n===void 0)return Ke("GRPC error has no .code"),O.UNKNOWN;switch(n){case It.OK:return O.OK;case It.CANCELLED:return O.CANCELLED;case It.UNKNOWN:return O.UNKNOWN;case It.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case It.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case It.INTERNAL:return O.INTERNAL;case It.UNAVAILABLE:return O.UNAVAILABLE;case It.UNAUTHENTICATED:return O.UNAUTHENTICATED;case It.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case It.NOT_FOUND:return O.NOT_FOUND;case It.ALREADY_EXISTS:return O.ALREADY_EXISTS;case It.PERMISSION_DENIED:return O.PERMISSION_DENIED;case It.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case It.ABORTED:return O.ABORTED;case It.OUT_OF_RANGE:return O.OUT_OF_RANGE;case It.UNIMPLEMENTED:return O.UNIMPLEMENTED;case It.DATA_LOSS:return O.DATA_LOSS;default:return H()}}(Z=It||(It={}))[Z.OK=0]="OK",Z[Z.CANCELLED=1]="CANCELLED",Z[Z.UNKNOWN=2]="UNKNOWN",Z[Z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Z[Z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Z[Z.NOT_FOUND=5]="NOT_FOUND",Z[Z.ALREADY_EXISTS=6]="ALREADY_EXISTS",Z[Z.PERMISSION_DENIED=7]="PERMISSION_DENIED",Z[Z.UNAUTHENTICATED=16]="UNAUTHENTICATED",Z[Z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Z[Z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Z[Z.ABORTED=10]="ABORTED",Z[Z.OUT_OF_RANGE=11]="OUT_OF_RANGE",Z[Z.UNIMPLEMENTED=12]="UNIMPLEMENTED",Z[Z.INTERNAL=13]="INTERNAL",Z[Z.UNAVAILABLE=14]="UNAVAILABLE",Z[Z.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function vx(){return new TextEncoder}/**
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
 */const wx=new zn([4294967295,4294967295],0);function wd(n){const t=vx().encode(n),e=new gp;return e.update(t),new Uint8Array(e.digest())}function xd(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),i=t.getUint32(4,!0),s=t.getUint32(8,!0),r=t.getUint32(12,!0);return[new zn([e,i],0),new zn([s,r],0)]}class Sc{constructor(t,e,i){if(this.bitmap=t,this.padding=e,this.hashCount=i,e<0||e>=8)throw new us(`Invalid padding: ${e}`);if(i<0)throw new us(`Invalid hash count: ${i}`);if(t.length>0&&this.hashCount===0)throw new us(`Invalid hash count: ${i}`);if(t.length===0&&e!==0)throw new us(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=zn.fromNumber(this.Ie)}Ee(t,e,i){let s=t.add(e.multiply(zn.fromNumber(i)));return s.compare(wx)===1&&(s=new zn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(t){return(this.bitmap[Math.floor(t/8)]&1<<t%8)!=0}mightContain(t){if(this.Ie===0)return!1;const e=wd(t),[i,s]=xd(e);for(let r=0;r<this.hashCount;r++){const o=this.Ee(i,s,r);if(!this.de(o))return!1}return!0}static create(t,e,i){const s=t%8==0?0:8-t%8,r=new Uint8Array(Math.ceil(t/8)),o=new Sc(r,s,e);return i.forEach(a=>o.insert(a)),o}insert(t){if(this.Ie===0)return;const e=wd(t),[i,s]=xd(e);for(let r=0;r<this.hashCount;r++){const o=this.Ee(i,s,r);this.Ae(o)}}Ae(t){const e=Math.floor(t/8),i=t%8;this.bitmap[e]|=1<<i}}class us extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Xo{constructor(t,e,i,s,r){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=i,this.documentUpdates=s,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(t,e,i){const s=new Map;return s.set(t,er.createSynthesizedTargetChangeForCurrentChange(t,e,i)),new Xo(W.min(),s,new yt(nt),Ge(),Y())}}class er{constructor(t,e,i,s,r){this.resumeToken=t,this.current=e,this.addedDocuments=i,this.modifiedDocuments=s,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(t,e,i){return new er(i,e,Y(),Y(),Y())}}/**
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
 */class Jr{constructor(t,e,i,s){this.Re=t,this.removedTargetIds=e,this.key=i,this.Ve=s}}class Wp{constructor(t,e){this.targetId=t,this.me=e}}class qp{constructor(t,e,i=Nt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=i,this.cause=s}}class Ed{constructor(){this.fe=0,this.ge=Id(),this.pe=Nt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=Y(),e=Y(),i=Y();return this.ge.forEach((s,r)=>{switch(r){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:i=i.add(s);break;default:H()}}),new er(this.pe,this.ye,t,e,i)}Ce(){this.we=!1,this.ge=Id()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,rt(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class xx{constructor(t){this.Le=t,this.Be=new Map,this.ke=Ge(),this.qe=kd(),this.Qe=new yt(nt)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const i=this.Ge(e);switch(t.state){case 0:this.ze(e)&&i.De(t.resumeToken);break;case 1:i.Oe(),i.Se||i.Ce(),i.De(t.resumeToken);break;case 2:i.Oe(),i.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(i.Ne(),i.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),i.De(t.resumeToken));break;default:H()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((i,s)=>{this.ze(s)&&e(s)})}He(t){const e=t.targetId,i=t.me.count,s=this.Je(e);if(s){const r=s.target;if(Tl(r))if(i===0){const o=new z(r.path);this.Ue(e,o,Wt.newNoDocument(o,W.min()))}else rt(i===1);else{const o=this.Ye(e);if(o!==i){const a=this.Ze(t),l=a?this.Xe(a,t,o):1;if(l!==0){this.je(e);const u=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,u)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:i="",padding:s=0},hashCount:r=0}=e;let o,a;try{o=Kn(i).toUint8Array()}catch(l){if(l instanceof Ep)return ki("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{a=new Sc(o,s,r)}catch(l){return ki(l instanceof us?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return a.Ie===0?null:a}Xe(t,e,i){return e.me.count===i-this.nt(t,e.targetId)?0:2}nt(t,e){const i=this.Le.getRemoteKeysForTarget(e);let s=0;return i.forEach(r=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;t.mightContain(a)||(this.Ue(e,r,null),s++)}),s}rt(t){const e=new Map;this.Be.forEach((r,o)=>{const a=this.Je(o);if(a){if(r.current&&Tl(a.target)){const l=new z(a.target.path);this.ke.get(l)!==null||this.it(o,l)||this.Ue(o,l,Wt.newNoDocument(l,t))}r.be&&(e.set(o,r.ve()),r.Ce())}});let i=Y();this.qe.forEach((r,o)=>{let a=!0;o.forEachWhile(l=>{const u=this.Je(l);return!u||u.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(i=i.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(t));const s=new Xo(t,e,this.Qe,this.ke,i);return this.ke=Ge(),this.qe=kd(),this.Qe=new yt(nt),s}$e(t,e){if(!this.ze(t))return;const i=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,i),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,i){if(!this.ze(t))return;const s=this.Ge(t);this.it(t,e)?s.Fe(e,1):s.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),i&&(this.ke=this.ke.insert(e,i))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new Ed,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new Vt(nt),this.qe=this.qe.insert(t,e)),e}ze(t){const e=this.Je(t)!==null;return e||j("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new Ed),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function kd(){return new yt(z.comparator)}function Id(){return new yt(z.comparator)}const Ex={asc:"ASCENDING",desc:"DESCENDING"},kx={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ix={and:"AND",or:"OR"};class Tx{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Pl(n,t){return n.useProto3Json||Wo(t)?t:{value:t}}function To(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Kp(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function Ax(n,t){return To(n,t.toTimestamp())}function Ee(n){return rt(!!n),W.fromTimestamp(function(e){const i=wn(e);return new pt(i.seconds,i.nanos)}(n))}function Pc(n,t){return Rl(n,t).canonicalString()}function Rl(n,t){const e=function(s){return new ht(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Gp(n){const t=ht.fromString(n);return rt(Zp(t)),t}function Cl(n,t){return Pc(n.databaseId,t.path)}function $a(n,t){const e=Gp(t);if(e.get(1)!==n.databaseId.projectId)throw new U(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new U(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new z(Qp(e))}function Yp(n,t){return Pc(n.databaseId,t)}function Sx(n){const t=Gp(n);return t.length===4?ht.emptyPath():Qp(t)}function Dl(n){return new ht(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Qp(n){return rt(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Td(n,t,e){return{name:Cl(n,t),fields:e.value.mapValue.fields}}function Px(n,t){let e;if("targetChange"in t){t.targetChange;const i=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:H()}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],r=function(u,h){return u.useProto3Json?(rt(h===void 0||typeof h=="string"),Nt.fromBase64String(h||"")):(rt(h===void 0||h instanceof Buffer||h instanceof Uint8Array),Nt.fromUint8Array(h||new Uint8Array))}(n,t.targetChange.resumeToken),o=t.targetChange.cause,a=o&&function(u){const h=u.code===void 0?O.UNKNOWN:Hp(u.code);return new U(h,u.message||"")}(o);e=new qp(i,s,r,a||null)}else if("documentChange"in t){t.documentChange;const i=t.documentChange;i.document,i.document.name,i.document.updateTime;const s=$a(n,i.document.name),r=Ee(i.document.updateTime),o=i.document.createTime?Ee(i.document.createTime):W.min(),a=new te({mapValue:{fields:i.document.fields}}),l=Wt.newFoundDocument(s,r,o,a),u=i.targetIds||[],h=i.removedTargetIds||[];e=new Jr(u,h,l.key,l)}else if("documentDelete"in t){t.documentDelete;const i=t.documentDelete;i.document;const s=$a(n,i.document),r=i.readTime?Ee(i.readTime):W.min(),o=Wt.newNoDocument(s,r),a=i.removedTargetIds||[];e=new Jr([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const i=t.documentRemove;i.document;const s=$a(n,i.document),r=i.removedTargetIds||[];e=new Jr([],r,s,null)}else{if(!("filter"in t))return H();{t.filter;const i=t.filter;i.targetId;const{count:s=0,unchangedNames:r}=i,o=new _x(s,r),a=i.targetId;e=new Wp(a,o)}}return e}function Rx(n,t){let e;if(t instanceof tr)e={update:Td(n,t.key,t.value)};else if(t instanceof Tc)e={delete:Cl(n,t.key)};else if(t instanceof Tn)e={update:Td(n,t.key,t.data),updateMask:Bx(t.fieldMask)};else{if(!(t instanceof px))return H();e={verify:Cl(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(i=>function(r,o){const a=o.transform;if(a instanceof ko)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Os)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Vs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Io)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw H()}(0,i))),t.precondition.isNone||(e.currentDocument=function(s,r){return r.updateTime!==void 0?{updateTime:Ax(s,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:H()}(n,t.precondition)),e}function Cx(n,t){return n&&n.length>0?(rt(t!==void 0),n.map(e=>function(s,r){let o=s.updateTime?Ee(s.updateTime):Ee(r);return o.isEqual(W.min())&&(o=Ee(r)),new dx(o,s.transformResults||[])}(e,t))):[]}function Dx(n,t){return{documents:[Yp(n,t.path)]}}function Mx(n,t){const e={structuredQuery:{}},i=t.path;let s;t.collectionGroup!==null?(s=i,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=i.popLast(),e.structuredQuery.from=[{collectionId:i.lastSegment()}]),e.parent=Yp(n,s);const r=function(u){if(u.length!==0)return Jp(me.create(u,"and"))}(t.filters);r&&(e.structuredQuery.where=r);const o=function(u){if(u.length!==0)return u.map(h=>function(g){return{field:di(g.field),direction:Vx(g.dir)}}(h))}(t.orderBy);o&&(e.structuredQuery.orderBy=o);const a=Pl(n,t.limit);return a!==null&&(e.structuredQuery.limit=a),t.startAt&&(e.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(t.endAt)),{_t:e,parent:s}}function Lx(n){let t=Sx(n.parent);const e=n.structuredQuery,i=e.from?e.from.length:0;let s=null;if(i>0){rt(i===1);const h=e.from[0];h.allDescendants?s=h.collectionId:t=t.child(h.collectionId)}let r=[];e.where&&(r=function(d){const g=Xp(d);return g instanceof me&&Ap(g)?g.getFilters():[g]}(e.where));let o=[];e.orderBy&&(o=function(d){return d.map(g=>function(y){return new Eo(fi(y.field),function(w){switch(w){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(y.direction))}(g))}(e.orderBy));let a=null;e.limit&&(a=function(d){let g;return g=typeof d=="object"?d.value:d,Wo(g)?null:g}(e.limit));let l=null;e.startAt&&(l=function(d){const g=!!d.before,m=d.values||[];return new xo(m,g)}(e.startAt));let u=null;return e.endAt&&(u=function(d){const g=!d.before,m=d.values||[];return new xo(m,g)}(e.endAt)),Zw(t,s,o,r,a,"F",l,u)}function Ox(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return H()}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Xp(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const i=fi(e.unaryFilter.field);return Tt.create(i,"==",{doubleValue:NaN});case"IS_NULL":const s=fi(e.unaryFilter.field);return Tt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=fi(e.unaryFilter.field);return Tt.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=fi(e.unaryFilter.field);return Tt.create(o,"!=",{nullValue:"NULL_VALUE"});default:return H()}}(n):n.fieldFilter!==void 0?function(e){return Tt.create(fi(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return H()}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return me.create(e.compositeFilter.filters.map(i=>Xp(i)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return H()}}(e.compositeFilter.op))}(n):H()}function Vx(n){return Ex[n]}function Nx(n){return kx[n]}function Fx(n){return Ix[n]}function di(n){return{fieldPath:n.canonicalString()}}function fi(n){return Lt.fromServerFormat(n.fieldPath)}function Jp(n){return n instanceof Tt?function(e){if(e.op==="=="){if(dd(e.value))return{unaryFilter:{field:di(e.field),op:"IS_NAN"}};if(hd(e.value))return{unaryFilter:{field:di(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(dd(e.value))return{unaryFilter:{field:di(e.field),op:"IS_NOT_NAN"}};if(hd(e.value))return{unaryFilter:{field:di(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:di(e.field),op:Nx(e.op),value:e.value}}}(n):n instanceof me?function(e){const i=e.getFilters().map(s=>Jp(s));return i.length===1?i[0]:{compositeFilter:{op:Fx(e.op),filters:i}}}(n):H()}function Bx(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Zp(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class on{constructor(t,e,i,s,r=W.min(),o=W.min(),a=Nt.EMPTY_BYTE_STRING,l=null){this.target=t,this.targetId=e,this.purpose=i,this.sequenceNumber=s,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=l}withSequenceNumber(t){return new on(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new on(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new on(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new on(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class Ux{constructor(t){this.ct=t}}function jx(n){const t=Lx({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Sl(t,t.limit,"L"):t}/**
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
 */class zx{constructor(){this.un=new $x}addToCollectionParentIndex(t,e){return this.un.add(e),N.resolve()}getCollectionParents(t,e){return N.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return N.resolve()}deleteFieldIndex(t,e){return N.resolve()}deleteAllFieldIndexes(t){return N.resolve()}createTargetIndexes(t,e){return N.resolve()}getDocumentsMatchingTarget(t,e){return N.resolve(null)}getIndexType(t,e){return N.resolve(0)}getFieldIndexes(t,e){return N.resolve([])}getNextCollectionGroupToUpdate(t){return N.resolve(null)}getMinOffset(t,e){return N.resolve(vn.min())}getMinOffsetFromCollectionGroup(t,e){return N.resolve(vn.min())}updateCollectionGroup(t,e,i){return N.resolve()}updateIndexEntries(t,e){return N.resolve()}}class $x{constructor(){this.index={}}add(t){const e=t.lastSegment(),i=t.popLast(),s=this.index[e]||new Vt(ht.comparator),r=!s.has(i);return this.index[e]=s.add(i),r}has(t){const e=t.lastSegment(),i=t.popLast(),s=this.index[e];return s&&s.has(i)}getEntries(t){return(this.index[t]||new Vt(ht.comparator)).toArray()}}/**
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
 */class Si{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new Si(0)}static kn(){return new Si(-1)}}/**
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
 */class Hx{constructor(){this.changes=new Fi(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Wt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const i=this.changes.get(e);return i!==void 0?N.resolve(i):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class Wx{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
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
 */class qx{constructor(t,e,i,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=i,this.indexManager=s}getDocument(t,e){let i=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(i=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(i!==null&&Es(i.mutation,s,se.empty(),pt.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(i=>this.getLocalViewOfDocuments(t,i,Y()).next(()=>i))}getLocalViewOfDocuments(t,e,i=Y()){const s=Bn();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,i).next(r=>{let o=cs();return r.forEach((a,l)=>{o=o.insert(a,l.overlayedDocument)}),o}))}getOverlayedDocuments(t,e){const i=Bn();return this.populateOverlays(t,i,e).next(()=>this.computeViews(t,e,i,Y()))}populateOverlays(t,e,i){const s=[];return i.forEach(r=>{e.has(r)||s.push(r)}),this.documentOverlayCache.getOverlays(t,s).next(r=>{r.forEach((o,a)=>{e.set(o,a)})})}computeViews(t,e,i,s){let r=Ge();const o=xs(),a=function(){return xs()}();return e.forEach((l,u)=>{const h=i.get(u.key);s.has(u.key)&&(h===void 0||h.mutation instanceof Tn)?r=r.insert(u.key,u):h!==void 0?(o.set(u.key,h.mutation.getFieldMask()),Es(h.mutation,u,h.mutation.getFieldMask(),pt.now())):o.set(u.key,se.empty())}),this.recalculateAndSaveOverlays(t,r).next(l=>(l.forEach((u,h)=>o.set(u,h)),e.forEach((u,h)=>{var d;return a.set(u,new Wx(h,(d=o.get(u))!==null&&d!==void 0?d:null))}),a))}recalculateAndSaveOverlays(t,e){const i=xs();let s=new yt((o,a)=>o-a),r=Y();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(o=>{for(const a of o)a.keys().forEach(l=>{const u=e.get(l);if(u===null)return;let h=i.get(l)||se.empty();h=a.applyToLocalView(u,h),i.set(l,h);const d=(s.get(a.batchId)||Y()).add(l);s=s.insert(a.batchId,d)})}).next(()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const l=a.getNext(),u=l.key,h=l.value,d=Vp();h.forEach(g=>{if(!r.has(g)){const m=zp(e.get(g),i.get(g));m!==null&&d.set(g,m),r=r.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(t,u,d))}return N.waitFor(o)}).next(()=>i)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(i=>this.recalculateAndSaveOverlays(t,i))}getDocumentsMatchingQuery(t,e,i,s){return function(o){return z.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Cp(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,i,s):this.getDocumentsMatchingCollectionQuery(t,e,i,s)}getNextDocuments(t,e,i,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,i,s).next(r=>{const o=s-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,i.largestBatchId,s-r.size):N.resolve(Bn());let a=-1,l=r;return o.next(u=>N.forEach(u,(h,d)=>(a<d.largestBatchId&&(a=d.largestBatchId),r.get(h)?N.resolve():this.remoteDocumentCache.getEntry(t,h).next(g=>{l=l.insert(h,g)}))).next(()=>this.populateOverlays(t,u,r)).next(()=>this.computeViews(t,l,u,Y())).next(h=>({batchId:a,changes:Op(h)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new z(e)).next(i=>{let s=cs();return i.isFoundDocument()&&(s=s.insert(i.key,i)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,i,s){const r=e.collectionGroup;let o=cs();return this.indexManager.getCollectionParents(t,r).next(a=>N.forEach(a,l=>{const u=function(d,g){return new Zs(g,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)}(e,l.child(r));return this.getDocumentsMatchingCollectionQuery(t,u,i,s).next(h=>{h.forEach((d,g)=>{o=o.insert(d,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(t,e,i,s){let r;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,i.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,i,r,s))).next(o=>{r.forEach((l,u)=>{const h=u.getKey();o.get(h)===null&&(o=o.insert(h,Wt.newInvalidDocument(h)))});let a=cs();return o.forEach((l,u)=>{const h=r.get(l);h!==void 0&&Es(h.mutation,u,se.empty(),pt.now()),Go(e,u)&&(a=a.insert(l,u))}),a})}}/**
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
 */class Kx{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return N.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Ee(s.createTime)}}(e)),N.resolve()}getNamedQuery(t,e){return N.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,function(s){return{name:s.name,query:jx(s.bundledQuery),readTime:Ee(s.readTime)}}(e)),N.resolve()}}/**
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
 */class Gx{constructor(){this.overlays=new yt(z.comparator),this.Ir=new Map}getOverlay(t,e){return N.resolve(this.overlays.get(e))}getOverlays(t,e){const i=Bn();return N.forEach(e,s=>this.getOverlay(t,s).next(r=>{r!==null&&i.set(s,r)})).next(()=>i)}saveOverlays(t,e,i){return i.forEach((s,r)=>{this.ht(t,e,r)}),N.resolve()}removeOverlaysForBatchId(t,e,i){const s=this.Ir.get(i);return s!==void 0&&(s.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(i)),N.resolve()}getOverlaysForCollection(t,e,i){const s=Bn(),r=e.length+1,o=new z(e.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const l=a.getNext().value,u=l.getKey();if(!e.isPrefixOf(u.path))break;u.path.length===r&&l.largestBatchId>i&&s.set(l.getKey(),l)}return N.resolve(s)}getOverlaysForCollectionGroup(t,e,i,s){let r=new yt((u,h)=>u-h);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===e&&u.largestBatchId>i){let h=r.get(u.largestBatchId);h===null&&(h=Bn(),r=r.insert(u.largestBatchId,h)),h.set(u.getKey(),u)}}const a=Bn(),l=r.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((u,h)=>a.set(u,h)),!(a.size()>=s)););return N.resolve(a)}ht(t,e,i){const s=this.overlays.get(i.key);if(s!==null){const o=this.Ir.get(s.largestBatchId).delete(i.key);this.Ir.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new yx(e,i));let r=this.Ir.get(e);r===void 0&&(r=Y(),this.Ir.set(e,r)),this.Ir.set(e,r.add(i.key))}}/**
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
 */class Yx{constructor(){this.sessionToken=Nt.EMPTY_BYTE_STRING}getSessionToken(t){return N.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,N.resolve()}}/**
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
 */class Rc{constructor(){this.Tr=new Vt(Pt.Er),this.dr=new Vt(Pt.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const i=new Pt(t,e);this.Tr=this.Tr.add(i),this.dr=this.dr.add(i)}Rr(t,e){t.forEach(i=>this.addReference(i,e))}removeReference(t,e){this.Vr(new Pt(t,e))}mr(t,e){t.forEach(i=>this.removeReference(i,e))}gr(t){const e=new z(new ht([])),i=new Pt(e,t),s=new Pt(e,t+1),r=[];return this.dr.forEachInRange([i,s],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new z(new ht([])),i=new Pt(e,t),s=new Pt(e,t+1);let r=Y();return this.dr.forEachInRange([i,s],o=>{r=r.add(o.key)}),r}containsKey(t){const e=new Pt(t,0),i=this.Tr.firstAfterOrEqual(e);return i!==null&&t.isEqual(i.key)}}class Pt{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return z.comparator(t.key,e.key)||nt(t.wr,e.wr)}static Ar(t,e){return nt(t.wr,e.wr)||z.comparator(t.key,e.key)}}/**
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
 */class Qx{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new Vt(Pt.Er)}checkEmpty(t){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,i,s){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new mx(r,e,i,s);this.mutationQueue.push(o);for(const a of s)this.br=this.br.add(new Pt(a.key,r)),this.indexManager.addToCollectionParentIndex(t,a.key.path.popLast());return N.resolve(o)}lookupMutationBatch(t,e){return N.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const i=e+1,s=this.vr(i),r=s<0?0:s;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(t){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const i=new Pt(e,0),s=new Pt(e,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([i,s],o=>{const a=this.Dr(o.wr);r.push(a)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(t,e){let i=new Vt(nt);return e.forEach(s=>{const r=new Pt(s,0),o=new Pt(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],a=>{i=i.add(a.wr)})}),N.resolve(this.Cr(i))}getAllMutationBatchesAffectingQuery(t,e){const i=e.path,s=i.length+1;let r=i;z.isDocumentKey(r)||(r=r.child(""));const o=new Pt(new z(r),0);let a=new Vt(nt);return this.br.forEachWhile(l=>{const u=l.key.path;return!!i.isPrefixOf(u)&&(u.length===s&&(a=a.add(l.wr)),!0)},o),N.resolve(this.Cr(a))}Cr(t){const e=[];return t.forEach(i=>{const s=this.Dr(i);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){rt(this.Fr(e.batchId,"removed")===0),this.mutationQueue.shift();let i=this.br;return N.forEach(e.mutations,s=>{const r=new Pt(s.key,e.batchId);return i=i.delete(r),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.br=i})}On(t){}containsKey(t,e){const i=new Pt(e,0),s=this.br.firstAfterOrEqual(i);return N.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,N.resolve()}Fr(t,e){return this.vr(t)}vr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
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
 */class Xx{constructor(t){this.Mr=t,this.docs=function(){return new yt(z.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const i=e.key,s=this.docs.get(i),r=s?s.size:0,o=this.Mr(e);return this.docs=this.docs.insert(i,{document:e.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(t,i.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const i=this.docs.get(e);return N.resolve(i?i.document.mutableCopy():Wt.newInvalidDocument(e))}getEntries(t,e){let i=Ge();return e.forEach(s=>{const r=this.docs.get(s);i=i.insert(s,r?r.document.mutableCopy():Wt.newInvalidDocument(s))}),N.resolve(i)}getDocumentsMatchingQuery(t,e,i,s){let r=Ge();const o=e.path,a=new z(o.child("")),l=this.docs.getIteratorFrom(a);for(;l.hasNext();){const{key:u,value:{document:h}}=l.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||Lw(Mw(h),i)<=0||(s.has(h.key)||Go(e,h))&&(r=r.insert(h.key,h.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(t,e,i,s){H()}Or(t,e){return N.forEach(this.docs,i=>e(i))}newChangeBuffer(t){return new Jx(this)}getSize(t){return N.resolve(this.size)}}class Jx extends Hx{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((i,s)=>{s.isValidDocument()?e.push(this.cr.addEntry(t,s)):this.cr.removeEntry(i)}),N.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}/**
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
 */class Zx{constructor(t){this.persistence=t,this.Nr=new Fi(e=>Ec(e),kc),this.lastRemoteSnapshotVersion=W.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Rc,this.targetCount=0,this.kr=Si.Bn()}forEachTarget(t,e){return this.Nr.forEach((i,s)=>e(s)),N.resolve()}getLastRemoteSnapshotVersion(t){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return N.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(t,e,i){return i&&(this.lastRemoteSnapshotVersion=i),e>this.Lr&&(this.Lr=e),N.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new Si(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,N.resolve()}updateTargetData(t,e){return this.Kn(e),N.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,N.resolve()}removeTargets(t,e,i){let s=0;const r=[];return this.Nr.forEach((o,a)=>{a.sequenceNumber<=e&&i.get(a.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(t,a.targetId)),s++)}),N.waitFor(r).next(()=>s)}getTargetCount(t){return N.resolve(this.targetCount)}getTargetData(t,e){const i=this.Nr.get(e)||null;return N.resolve(i)}addMatchingKeys(t,e,i){return this.Br.Rr(e,i),N.resolve()}removeMatchingKeys(t,e,i){this.Br.mr(e,i);const s=this.persistence.referenceDelegate,r=[];return s&&e.forEach(o=>{r.push(s.markPotentiallyOrphaned(t,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),N.resolve()}getMatchingKeysForTargetId(t,e){const i=this.Br.yr(e);return N.resolve(i)}containsKey(t,e){return N.resolve(this.Br.containsKey(e))}}/**
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
 */class tE{constructor(t,e){this.qr={},this.overlays={},this.Qr=new bc(0),this.Kr=!1,this.Kr=!0,this.$r=new Yx,this.referenceDelegate=t(this),this.Ur=new Zx(this),this.indexManager=new zx,this.remoteDocumentCache=function(s){return new Xx(s)}(i=>this.referenceDelegate.Wr(i)),this.serializer=new Ux(e),this.Gr=new Kx(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Gx,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let i=this.qr[t.toKey()];return i||(i=new Qx(e,this.referenceDelegate),this.qr[t.toKey()]=i),i}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,i){j("MemoryPersistence","Starting transaction:",t);const s=new eE(this.Qr.next());return this.referenceDelegate.zr(),i(s).next(r=>this.referenceDelegate.jr(s).next(()=>r)).toPromise().then(r=>(s.raiseOnCommittedEvent(),r))}Hr(t,e){return N.or(Object.values(this.qr).map(i=>()=>i.containsKey(t,e)))}}class eE extends Vw{constructor(t){super(),this.currentSequenceNumber=t}}class Cc{constructor(t){this.persistence=t,this.Jr=new Rc,this.Yr=null}static Zr(t){return new Cc(t)}get Xr(){if(this.Yr)return this.Yr;throw H()}addReference(t,e,i){return this.Jr.addReference(i,e),this.Xr.delete(i.toString()),N.resolve()}removeReference(t,e,i){return this.Jr.removeReference(i,e),this.Xr.add(i.toString()),N.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),N.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(s=>this.Xr.add(s.toString()));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(r=>this.Xr.add(r.toString()))}).next(()=>i.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,i=>{const s=z.fromPath(i);return this.ei(t,s).next(r=>{r||e.removeEntry(s,W.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(i=>{i?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return N.or([()=>N.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}/**
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
 */class Dc{constructor(t,e,i,s){this.targetId=t,this.fromCache=e,this.$i=i,this.Ui=s}static Wi(t,e){let i=Y(),s=Y();for(const r of e.docChanges)switch(r.type){case 0:i=i.add(r.doc.key);break;case 1:s=s.add(r.doc.key)}return new Dc(t,e.fromCache,i,s)}}/**
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
 */class nE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class iE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return $y()?8:Nw(Kt())>0?6:4}()}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,i,s){const r={result:null};return this.Yi(t,e).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(t,e,s,i).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new nE;return this.Xi(t,e,o).next(a=>{if(r.result=a,this.zi)return this.es(t,e,o,a.size)})}).next(()=>r.result)}es(t,e,i,s){return i.documentReadCount<this.ji?(ts()<=X.DEBUG&&j("QueryEngine","SDK will not create cache indexes for query:",hi(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(ts()<=X.DEBUG&&j("QueryEngine","Query:",hi(e),"scans",i.documentReadCount,"local documents and returns",s,"documents as results."),i.documentReadCount>this.Hi*s?(ts()<=X.DEBUG&&j("QueryEngine","The SDK decides to create cache indexes for query:",hi(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,xe(e))):N.resolve())}Yi(t,e){if(md(e))return N.resolve(null);let i=xe(e);return this.indexManager.getIndexType(t,i).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Sl(e,null,"F"),i=xe(e)),this.indexManager.getDocumentsMatchingTarget(t,i).next(r=>{const o=Y(...r);return this.Ji.getDocuments(t,o).next(a=>this.indexManager.getMinOffset(t,i).next(l=>{const u=this.ts(e,a);return this.ns(e,u,o,l.readTime)?this.Yi(t,Sl(e,null,"F")):this.rs(t,u,e,l)}))})))}Zi(t,e,i,s){return md(e)||s.isEqual(W.min())?N.resolve(null):this.Ji.getDocuments(t,i).next(r=>{const o=this.ts(e,r);return this.ns(e,o,i,s)?N.resolve(null):(ts()<=X.DEBUG&&j("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),hi(e)),this.rs(t,o,e,Dw(s,-1)).next(a=>a))})}ts(t,e){let i=new Vt(Mp(t));return e.forEach((s,r)=>{Go(t,r)&&(i=i.add(r))}),i}ns(t,e,i,s){if(t.limit===null)return!1;if(i.size!==e.size)return!0;const r=t.limitType==="F"?e.last():e.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(s)>0)}Xi(t,e,i){return ts()<=X.DEBUG&&j("QueryEngine","Using full collection scan to execute query:",hi(e)),this.Ji.getDocumentsMatchingQuery(t,e,vn.min(),i)}rs(t,e,i,s){return this.Ji.getDocumentsMatchingQuery(t,i,s).next(r=>(e.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
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
 */class sE{constructor(t,e,i,s){this.persistence=t,this.ss=e,this.serializer=s,this.os=new yt(nt),this._s=new Fi(r=>Ec(r),kc),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(i)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new qx(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function rE(n,t,e,i){return new sE(n,t,e,i)}async function tm(n,t){const e=K(n);return await e.persistence.runTransaction("Handle user change","readonly",i=>{let s;return e.mutationQueue.getAllMutationBatches(i).next(r=>(s=r,e.ls(t),e.mutationQueue.getAllMutationBatches(i))).next(r=>{const o=[],a=[];let l=Y();for(const u of s){o.push(u.batchId);for(const h of u.mutations)l=l.add(h.key)}for(const u of r){a.push(u.batchId);for(const h of u.mutations)l=l.add(h.key)}return e.localDocuments.getDocuments(i,l).next(u=>({hs:u,removedBatchIds:o,addedBatchIds:a}))})})}function oE(n,t){const e=K(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",i=>{const s=t.batch.keys(),r=e.cs.newChangeBuffer({trackRemovals:!0});return function(a,l,u,h){const d=u.batch,g=d.keys();let m=N.resolve();return g.forEach(y=>{m=m.next(()=>h.getEntry(l,y)).next(v=>{const w=u.docVersions.get(y);rt(w!==null),v.version.compareTo(w)<0&&(d.applyToRemoteDocument(v,u),v.isValidDocument()&&(v.setReadTime(u.commitVersion),h.addEntry(v)))})}),m.next(()=>a.mutationQueue.removeMutationBatch(l,d))}(e,i,t,r).next(()=>r.apply(i)).next(()=>e.mutationQueue.performConsistencyCheck(i)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(i,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,function(a){let l=Y();for(let u=0;u<a.mutationResults.length;++u)a.mutationResults[u].transformResults.length>0&&(l=l.add(a.batch.mutations[u].key));return l}(t))).next(()=>e.localDocuments.getDocuments(i,s))})}function em(n){const t=K(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function aE(n,t){const e=K(n),i=t.snapshotVersion;let s=e.os;return e.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=e.cs.newChangeBuffer({trackRemovals:!0});s=e.os;const a=[];t.targetChanges.forEach((h,d)=>{const g=s.get(d);if(!g)return;a.push(e.Ur.removeMatchingKeys(r,h.removedDocuments,d).next(()=>e.Ur.addMatchingKeys(r,h.addedDocuments,d)));let m=g.withSequenceNumber(r.currentSequenceNumber);t.targetMismatches.get(d)!==null?m=m.withResumeToken(Nt.EMPTY_BYTE_STRING,W.min()).withLastLimboFreeSnapshotVersion(W.min()):h.resumeToken.approximateByteSize()>0&&(m=m.withResumeToken(h.resumeToken,i)),s=s.insert(d,m),function(v,w,A){return v.resumeToken.approximateByteSize()===0||w.snapshotVersion.toMicroseconds()-v.snapshotVersion.toMicroseconds()>=3e8?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0}(g,m,h)&&a.push(e.Ur.updateTargetData(r,m))});let l=Ge(),u=Y();if(t.documentUpdates.forEach(h=>{t.resolvedLimboDocuments.has(h)&&a.push(e.persistence.referenceDelegate.updateLimboDocument(r,h))}),a.push(lE(r,o,t.documentUpdates).next(h=>{l=h.Ps,u=h.Is})),!i.isEqual(W.min())){const h=e.Ur.getLastRemoteSnapshotVersion(r).next(d=>e.Ur.setTargetsMetadata(r,r.currentSequenceNumber,i));a.push(h)}return N.waitFor(a).next(()=>o.apply(r)).next(()=>e.localDocuments.getLocalViewOfDocuments(r,l,u)).next(()=>l)}).then(r=>(e.os=s,r))}function lE(n,t,e){let i=Y(),s=Y();return e.forEach(r=>i=i.add(r)),t.getEntries(n,i).next(r=>{let o=Ge();return e.forEach((a,l)=>{const u=r.get(a);l.isFoundDocument()!==u.isFoundDocument()&&(s=s.add(a)),l.isNoDocument()&&l.version.isEqual(W.min())?(t.removeEntry(a,l.readTime),o=o.insert(a,l)):!u.isValidDocument()||l.version.compareTo(u.version)>0||l.version.compareTo(u.version)===0&&u.hasPendingWrites?(t.addEntry(l),o=o.insert(a,l)):j("LocalStore","Ignoring outdated watch update for ",a,". Current version:",u.version," Watch version:",l.version)}),{Ps:o,Is:s}})}function cE(n,t){const e=K(n);return e.persistence.runTransaction("Get next mutation batch","readonly",i=>(t===void 0&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(i,t)))}function uE(n,t){const e=K(n);return e.persistence.runTransaction("Allocate target","readwrite",i=>{let s;return e.Ur.getTargetData(i,t).next(r=>r?(s=r,N.resolve(s)):e.Ur.allocateTargetId(i).next(o=>(s=new on(t,o,"TargetPurposeListen",i.currentSequenceNumber),e.Ur.addTargetData(i,s).next(()=>s))))}).then(i=>{const s=e.os.get(i.targetId);return(s===null||i.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.os=e.os.insert(i.targetId,i),e._s.set(t,i.targetId)),i})}async function Ml(n,t,e){const i=K(n),s=i.os.get(t),r=e?"readwrite":"readwrite-primary";try{e||await i.persistence.runTransaction("Release target",r,o=>i.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Js(o))throw o;j("LocalStore",`Failed to update sequence numbers for target ${t}: ${o}`)}i.os=i.os.remove(t),i._s.delete(s.target)}function Ad(n,t,e){const i=K(n);let s=W.min(),r=Y();return i.persistence.runTransaction("Execute query","readwrite",o=>function(l,u,h){const d=K(l),g=d._s.get(h);return g!==void 0?N.resolve(d.os.get(g)):d.Ur.getTargetData(u,h)}(i,o,xe(t)).next(a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,i.Ur.getMatchingKeysForTargetId(o,a.targetId).next(l=>{r=l})}).next(()=>i.ss.getDocumentsMatchingQuery(o,t,e?s:W.min(),e?r:Y())).next(a=>(hE(i,ex(t),a),{documents:a,Ts:r})))}function hE(n,t,e){let i=n.us.get(t)||W.min();e.forEach((s,r)=>{r.readTime.compareTo(i)>0&&(i=r.readTime)}),n.us.set(t,i)}class Sd{constructor(){this.activeTargetIds=ax()}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class dE{constructor(){this.so=new Sd,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,i){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,i){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new Sd,Promise.resolve()}handleUserChange(t,e,i){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class fE{_o(t){}shutdown(){}}/**
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
 */class Pd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){j("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){j("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Rr=null;function Ha(){return Rr===null?Rr=function(){return 268435456+Math.round(2147483648*Math.random())}():Rr++,"0x"+Rr.toString(16)}/**
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
 */const gE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class pE{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}/**
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
 */const jt="WebChannelConnection";class mE extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const i=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=i+"://"+e.host,this.vo=`projects/${s}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${r}`}get Fo(){return!1}Mo(e,i,s,r,o){const a=Ha(),l=this.xo(e,i.toUriEncodedString());j("RestConnection",`Sending RPC '${e}' ${a}:`,l,s);const u={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(u,r,o),this.No(e,l,u,s).then(h=>(j("RestConnection",`Received RPC '${e}' ${a}: `,h),h),h=>{throw ki("RestConnection",`RPC '${e}' ${a} failed with error: `,h,"url: ",l,"request:",s),h})}Lo(e,i,s,r,o,a){return this.Mo(e,i,s,r,o)}Oo(e,i,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ni}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),i&&i.headers.forEach((r,o)=>e[o]=r),s&&s.headers.forEach((r,o)=>e[o]=r)}xo(e,i){const s=gE[e];return`${this.Do}/v1/${i}:${s}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,i,s){const r=Ha();return new Promise((o,a)=>{const l=new pp;l.setWithCredentials(!0),l.listenOnce(mp.COMPLETE,()=>{try{switch(l.getLastErrorCode()){case Yr.NO_ERROR:const h=l.getResponseJson();j(jt,`XHR for RPC '${t}' ${r} received:`,JSON.stringify(h)),o(h);break;case Yr.TIMEOUT:j(jt,`RPC '${t}' ${r} timed out`),a(new U(O.DEADLINE_EXCEEDED,"Request time out"));break;case Yr.HTTP_ERROR:const d=l.getStatus();if(j(jt,`RPC '${t}' ${r} failed with status:`,d,"response text:",l.getResponseText()),d>0){let g=l.getResponseJson();Array.isArray(g)&&(g=g[0]);const m=g==null?void 0:g.error;if(m&&m.status&&m.message){const y=function(w){const A=w.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(A)>=0?A:O.UNKNOWN}(m.status);a(new U(y,m.message))}else a(new U(O.UNKNOWN,"Server responded with status "+l.getStatus()))}else a(new U(O.UNAVAILABLE,"Connection failed."));break;default:H()}}finally{j(jt,`RPC '${t}' ${r} completed.`)}});const u=JSON.stringify(s);j(jt,`RPC '${t}' ${r} sending request:`,s),l.send(e,"POST",u,i,15)})}Bo(t,e,i){const s=Ha(),r=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=bp(),a=_p(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Oo(l.initMessageHeaders,e,i),l.encodeInitMessageHeaders=!0;const h=r.join("");j(jt,`Creating RPC '${t}' stream ${s}: ${h}`,l);const d=o.createWebChannel(h,l);let g=!1,m=!1;const y=new pE({Io:w=>{m?j(jt,`Not sending because RPC '${t}' stream ${s} is closed:`,w):(g||(j(jt,`Opening RPC '${t}' stream ${s} transport.`),d.open(),g=!0),j(jt,`RPC '${t}' stream ${s} sending:`,w),d.send(w))},To:()=>d.close()}),v=(w,A,R)=>{w.listen(A,D=>{try{R(D)}catch(L){setTimeout(()=>{throw L},0)}})};return v(d,ls.EventType.OPEN,()=>{m||(j(jt,`RPC '${t}' stream ${s} transport opened.`),y.yo())}),v(d,ls.EventType.CLOSE,()=>{m||(m=!0,j(jt,`RPC '${t}' stream ${s} transport closed`),y.So())}),v(d,ls.EventType.ERROR,w=>{m||(m=!0,ki(jt,`RPC '${t}' stream ${s} transport errored:`,w),y.So(new U(O.UNAVAILABLE,"The operation could not be completed")))}),v(d,ls.EventType.MESSAGE,w=>{var A;if(!m){const R=w.data[0];rt(!!R);const D=R,L=D.error||((A=D[0])===null||A===void 0?void 0:A.error);if(L){j(jt,`RPC '${t}' stream ${s} received error:`,L);const M=L.status;let V=function(x){const I=It[x];if(I!==void 0)return Hp(I)}(M),E=L.message;V===void 0&&(V=O.INTERNAL,E="Unknown error status: "+M+" with message "+L.message),m=!0,y.So(new U(V,E)),d.close()}else j(jt,`RPC '${t}' stream ${s} received:`,R),y.bo(R)}}),v(a,yp.STAT_EVENT,w=>{w.stat===xl.PROXY?j(jt,`RPC '${t}' stream ${s} detected buffering proxy`):w.stat===xl.NOPROXY&&j(jt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{y.wo()},0),y}}function Wa(){return typeof document<"u"?document:null}/**
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
 */function Jo(n){return new Tx(n,!0)}/**
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
 */class nm{constructor(t,e,i=1e3,s=1.5,r=6e4){this.ui=t,this.timerId=e,this.ko=i,this.qo=s,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),i=Math.max(0,Date.now()-this.Uo),s=Math.max(0,e-i);s>0&&j("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${i} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class im{constructor(t,e,i,s,r,o,a,l){this.ui=t,this.Ho=i,this.Jo=s,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=l,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new nm(t,e)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,t!==4?this.t_.reset():e&&e.code===O.RESOURCE_EXHAUSTED?(Ke(e.toString()),Ke("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([i,s])=>{this.Yo===e&&this.P_(i,s)},i=>{t(()=>{const s=new U(O.UNKNOWN,"Fetching auth token failed: "+i.message);return this.I_(s)})})}P_(t,e){const i=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{i(()=>this.listener.Eo())}),this.stream.Ro(()=>{i(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{i(()=>this.I_(s))}),this.stream.onMessage(s=>{i(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return j("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(j("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class yE extends im{constructor(t,e,i,s,r,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,i,s,o),this.serializer=r}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=Px(this.serializer,t),i=function(r){if(!("targetChange"in r))return W.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?W.min():o.readTime?Ee(o.readTime):W.min()}(t);return this.listener.d_(e,i)}A_(t){const e={};e.database=Dl(this.serializer),e.addTarget=function(r,o){let a;const l=o.target;if(a=Tl(l)?{documents:Dx(r,l)}:{query:Mx(r,l)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=Kp(r,o.resumeToken);const u=Pl(r,o.expectedCount);u!==null&&(a.expectedCount=u)}else if(o.snapshotVersion.compareTo(W.min())>0){a.readTime=To(r,o.snapshotVersion.toTimestamp());const u=Pl(r,o.expectedCount);u!==null&&(a.expectedCount=u)}return a}(this.serializer,t);const i=Ox(this.serializer,t);i&&(e.labels=i),this.a_(e)}R_(t){const e={};e.database=Dl(this.serializer),e.removeTarget=t,this.a_(e)}}class _E extends im{constructor(t,e,i,s,r,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,i,s,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return rt(!!t.streamToken),this.lastStreamToken=t.streamToken,rt(!t.writeResults||t.writeResults.length===0),this.listener.f_()}onNext(t){rt(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=Cx(t.writeResults,t.commitTime),i=Ee(t.commitTime);return this.listener.g_(i,e)}p_(){const t={};t.database=Dl(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(i=>Rx(this.serializer,i))};this.a_(e)}}/**
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
 */class bE extends class{}{constructor(t,e,i,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=i,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new U(O.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(t,Rl(e,i),s,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new U(O.UNKNOWN,r.toString())})}Lo(t,e,i,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Lo(t,Rl(e,i),s,o,a,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new U(O.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class vE{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,t==="Online"&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Ke(e),this.D_=!1):j("OnlineStateTracker",e)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class wE{constructor(t,e,i,s,r){this.localStore=t,this.datastore=e,this.asyncQueue=i,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{i.enqueueAndForget(async()=>{Zn(this)&&(j("RemoteStore","Restarting streams for network reachability change."),await async function(l){const u=K(l);u.L_.add(4),await nr(u),u.q_.set("Unknown"),u.L_.delete(4),await Zo(u)}(this))})}),this.q_=new vE(i,s)}}async function Zo(n){if(Zn(n))for(const t of n.B_)await t(!0)}async function nr(n){for(const t of n.B_)await t(!1)}function sm(n,t){const e=K(n);e.N_.has(t.targetId)||(e.N_.set(t.targetId,t),Vc(e)?Oc(e):Bi(e).r_()&&Lc(e,t))}function Mc(n,t){const e=K(n),i=Bi(e);e.N_.delete(t),i.r_()&&rm(e,t),e.N_.size===0&&(i.r_()?i.o_():Zn(e)&&e.q_.set("Unknown"))}function Lc(n,t){if(n.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(W.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Bi(n).A_(t)}function rm(n,t){n.Q_.xe(t),Bi(n).R_(t)}function Oc(n){n.Q_=new xx({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>n.N_.get(t)||null,tt:()=>n.datastore.serializer.databaseId}),Bi(n).start(),n.q_.v_()}function Vc(n){return Zn(n)&&!Bi(n).n_()&&n.N_.size>0}function Zn(n){return K(n).L_.size===0}function om(n){n.Q_=void 0}async function xE(n){n.q_.set("Online")}async function EE(n){n.N_.forEach((t,e)=>{Lc(n,t)})}async function kE(n,t){om(n),Vc(n)?(n.q_.M_(t),Oc(n)):n.q_.set("Unknown")}async function IE(n,t,e){if(n.q_.set("Online"),t instanceof qp&&t.state===2&&t.cause)try{await async function(s,r){const o=r.cause;for(const a of r.targetIds)s.N_.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.N_.delete(a),s.Q_.removeTarget(a))}(n,t)}catch(i){j("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),i),await Ao(n,i)}else if(t instanceof Jr?n.Q_.Ke(t):t instanceof Wp?n.Q_.He(t):n.Q_.We(t),!e.isEqual(W.min()))try{const i=await em(n.localStore);e.compareTo(i)>=0&&await function(r,o){const a=r.Q_.rt(o);return a.targetChanges.forEach((l,u)=>{if(l.resumeToken.approximateByteSize()>0){const h=r.N_.get(u);h&&r.N_.set(u,h.withResumeToken(l.resumeToken,o))}}),a.targetMismatches.forEach((l,u)=>{const h=r.N_.get(l);if(!h)return;r.N_.set(l,h.withResumeToken(Nt.EMPTY_BYTE_STRING,h.snapshotVersion)),rm(r,l);const d=new on(h.target,l,u,h.sequenceNumber);Lc(r,d)}),r.remoteSyncer.applyRemoteEvent(a)}(n,e)}catch(i){j("RemoteStore","Failed to raise snapshot:",i),await Ao(n,i)}}async function Ao(n,t,e){if(!Js(t))throw t;n.L_.add(1),await nr(n),n.q_.set("Offline"),e||(e=()=>em(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{j("RemoteStore","Retrying IndexedDB access"),await e(),n.L_.delete(1),await Zo(n)})}function am(n,t){return t().catch(e=>Ao(n,e,t))}async function ta(n){const t=K(n),e=xn(t);let i=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;TE(t);)try{const s=await cE(t.localStore,i);if(s===null){t.O_.length===0&&e.o_();break}i=s.batchId,AE(t,s)}catch(s){await Ao(t,s)}lm(t)&&cm(t)}function TE(n){return Zn(n)&&n.O_.length<10}function AE(n,t){n.O_.push(t);const e=xn(n);e.r_()&&e.V_&&e.m_(t.mutations)}function lm(n){return Zn(n)&&!xn(n).n_()&&n.O_.length>0}function cm(n){xn(n).start()}async function SE(n){xn(n).p_()}async function PE(n){const t=xn(n);for(const e of n.O_)t.m_(e.mutations)}async function RE(n,t,e){const i=n.O_.shift(),s=Ac.from(i,t,e);await am(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await ta(n)}async function CE(n,t){t&&xn(n).V_&&await async function(i,s){if(function(o){return bx(o)&&o!==O.ABORTED}(s.code)){const r=i.O_.shift();xn(i).s_(),await am(i,()=>i.remoteSyncer.rejectFailedWrite(r.batchId,s)),await ta(i)}}(n,t),lm(n)&&cm(n)}async function Rd(n,t){const e=K(n);e.asyncQueue.verifyOperationInProgress(),j("RemoteStore","RemoteStore received new credentials");const i=Zn(e);e.L_.add(3),await nr(e),i&&e.q_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.L_.delete(3),await Zo(e)}async function DE(n,t){const e=K(n);t?(e.L_.delete(2),await Zo(e)):t||(e.L_.add(2),await nr(e),e.q_.set("Unknown"))}function Bi(n){return n.K_||(n.K_=function(e,i,s){const r=K(e);return r.w_(),new yE(i,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)}(n.datastore,n.asyncQueue,{Eo:xE.bind(null,n),Ro:EE.bind(null,n),mo:kE.bind(null,n),d_:IE.bind(null,n)}),n.B_.push(async t=>{t?(n.K_.s_(),Vc(n)?Oc(n):n.q_.set("Unknown")):(await n.K_.stop(),om(n))})),n.K_}function xn(n){return n.U_||(n.U_=function(e,i,s){const r=K(e);return r.w_(),new _E(i,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:SE.bind(null,n),mo:CE.bind(null,n),f_:PE.bind(null,n),g_:RE.bind(null,n)}),n.B_.push(async t=>{t?(n.U_.s_(),await ta(n)):(await n.U_.stop(),n.O_.length>0&&(j("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Nc{constructor(t,e,i,s,r){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=i,this.op=s,this.removalCallback=r,this.deferred=new $e,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,i,s,r){const o=Date.now()+i,a=new Nc(t,e,o,s,r);return a.start(i),a}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(O.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Fc(n,t){if(Ke("AsyncQueue",`${t}: ${n}`),Js(n))return new U(O.UNAVAILABLE,`${t}: ${n}`);throw n}/**
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
 */class _i{constructor(t){this.comparator=t?(e,i)=>t(e,i)||z.comparator(e.key,i.key):(e,i)=>z.comparator(e.key,i.key),this.keyedMap=cs(),this.sortedSet=new yt(this.comparator)}static emptySet(t){return new _i(t.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,i)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof _i)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),i=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,r=i.getNext().key;if(!s.isEqual(r))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const i=new _i;return i.comparator=this.comparator,i.keyedMap=t,i.sortedSet=e,i}}/**
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
 */class Cd{constructor(){this.W_=new yt(z.comparator)}track(t){const e=t.doc.key,i=this.W_.get(e);i?t.type!==0&&i.type===3?this.W_=this.W_.insert(e,t):t.type===3&&i.type!==1?this.W_=this.W_.insert(e,{type:i.type,doc:t.doc}):t.type===2&&i.type===2?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):t.type===2&&i.type===0?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):t.type===1&&i.type===0?this.W_=this.W_.remove(e):t.type===1&&i.type===2?this.W_=this.W_.insert(e,{type:1,doc:i.doc}):t.type===0&&i.type===1?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):H():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,i)=>{t.push(i)}),t}}class Pi{constructor(t,e,i,s,r,o,a,l,u){this.query=t,this.docs=e,this.oldDocs=i,this.docChanges=s,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=l,this.hasCachedResults=u}static fromInitialDocuments(t,e,i,s,r){const o=[];return e.forEach(a=>{o.push({type:0,doc:a})}),new Pi(t,e,_i.emptySet(e),o,i,s,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Ko(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,i=t.docChanges;if(e.length!==i.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==i[s].type||!e[s].doc.isEqual(i[s].doc))return!1;return!0}}/**
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
 */class ME{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class LE{constructor(){this.queries=Dd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(e,i){const s=K(e),r=s.queries;s.queries=Dd(),r.forEach((o,a)=>{for(const l of a.j_)l.onError(i)})})(this,new U(O.ABORTED,"Firestore shutting down"))}}function Dd(){return new Fi(n=>Dp(n),Ko)}async function Bc(n,t){const e=K(n);let i=3;const s=t.query;let r=e.queries.get(s);r?!r.H_()&&t.J_()&&(i=2):(r=new ME,i=t.J_()?0:1);try{switch(i){case 0:r.z_=await e.onListen(s,!0);break;case 1:r.z_=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(o){const a=Fc(o,`Initialization of query '${hi(t.query)}' failed`);return void t.onError(a)}e.queries.set(s,r),r.j_.push(t),t.Z_(e.onlineState),r.z_&&t.X_(r.z_)&&jc(e)}async function Uc(n,t){const e=K(n),i=t.query;let s=3;const r=e.queries.get(i);if(r){const o=r.j_.indexOf(t);o>=0&&(r.j_.splice(o,1),r.j_.length===0?s=t.J_()?0:1:!r.H_()&&t.J_()&&(s=2))}switch(s){case 0:return e.queries.delete(i),e.onUnlisten(i,!0);case 1:return e.queries.delete(i),e.onUnlisten(i,!1);case 2:return e.onLastRemoteStoreUnlisten(i);default:return}}function OE(n,t){const e=K(n);let i=!1;for(const s of t){const r=s.query,o=e.queries.get(r);if(o){for(const a of o.j_)a.X_(s)&&(i=!0);o.z_=s}}i&&jc(e)}function VE(n,t,e){const i=K(n),s=i.queries.get(t);if(s)for(const r of s.j_)r.onError(e);i.queries.delete(t)}function jc(n){n.Y_.forEach(t=>{t.next()})}var Ll,Md;(Md=Ll||(Ll={})).ea="default",Md.Cache="cache";class zc{constructor(t,e,i){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=i||{}}X_(t){if(!this.options.includeMetadataChanges){const i=[];for(const s of t.docChanges)s.type!==3&&i.push(s);t=new Pi(t.query,t.docs,t.oldDocs,i,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache||!this.J_())return!0;const i=e!=="Offline";return(!this.options._a||!i)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}oa(t){t=Pi.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==Ll.Cache}}/**
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
 */class um{constructor(t){this.key=t}}class hm{constructor(t){this.key=t}}class NE{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Y(),this.mutatedKeys=Y(),this.Aa=Mp(t),this.Ra=new _i(this.Aa)}get Va(){return this.Ta}ma(t,e){const i=e?e.fa:new Cd,s=e?e.Ra:this.Ra;let r=e?e.mutatedKeys:this.mutatedKeys,o=s,a=!1;const l=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,u=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((h,d)=>{const g=s.get(h),m=Go(this.query,d)?d:null,y=!!g&&this.mutatedKeys.has(g.key),v=!!m&&(m.hasLocalMutations||this.mutatedKeys.has(m.key)&&m.hasCommittedMutations);let w=!1;g&&m?g.data.isEqual(m.data)?y!==v&&(i.track({type:3,doc:m}),w=!0):this.ga(g,m)||(i.track({type:2,doc:m}),w=!0,(l&&this.Aa(m,l)>0||u&&this.Aa(m,u)<0)&&(a=!0)):!g&&m?(i.track({type:0,doc:m}),w=!0):g&&!m&&(i.track({type:1,doc:g}),w=!0,(l||u)&&(a=!0)),w&&(m?(o=o.add(m),r=v?r.add(h):r.delete(h)):(o=o.delete(h),r=r.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),r=r.delete(h.key),i.track({type:1,doc:h})}return{Ra:o,fa:i,ns:a,mutatedKeys:r}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,i,s){const r=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const o=t.fa.G_();o.sort((h,d)=>function(m,y){const v=w=>{switch(w){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return H()}};return v(m)-v(y)}(h.type,d.type)||this.Aa(h.doc,d.doc)),this.pa(i),s=s!=null&&s;const a=e&&!s?this.ya():[],l=this.da.size===0&&this.current&&!s?1:0,u=l!==this.Ea;return this.Ea=l,o.length!==0||u?{snapshot:new Pi(this.query,t.Ra,r,o,t.mutatedKeys,l===0,u,!1,!!i&&i.resumeToken.approximateByteSize()>0),wa:a}:{wa:a}}Z_(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Cd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=Y(),this.Ra.forEach(i=>{this.Sa(i.key)&&(this.da=this.da.add(i.key))});const e=[];return t.forEach(i=>{this.da.has(i)||e.push(new hm(i))}),this.da.forEach(i=>{t.has(i)||e.push(new um(i))}),e}ba(t){this.Ta=t.Ts,this.da=Y();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return Pi.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class FE{constructor(t,e,i){this.query=t,this.targetId=e,this.view=i}}class BE{constructor(t){this.key=t,this.va=!1}}class UE{constructor(t,e,i,s,r,o){this.localStore=t,this.remoteStore=e,this.eventManager=i,this.sharedClientState=s,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Fi(a=>Dp(a),Ko),this.Ma=new Map,this.xa=new Set,this.Oa=new yt(z.comparator),this.Na=new Map,this.La=new Rc,this.Ba={},this.ka=new Map,this.qa=Si.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function jE(n,t,e=!0){const i=ym(n);let s;const r=i.Fa.get(t);return r?(i.sharedClientState.addLocalQueryTarget(r.targetId),s=r.view.Da()):s=await dm(i,t,e,!0),s}async function zE(n,t){const e=ym(n);await dm(e,t,!0,!1)}async function dm(n,t,e,i){const s=await uE(n.localStore,xe(t)),r=s.targetId,o=n.sharedClientState.addLocalQueryTarget(r,e);let a;return i&&(a=await $E(n,t,r,o==="current",s.resumeToken)),n.isPrimaryClient&&e&&sm(n.remoteStore,s),a}async function $E(n,t,e,i,s){n.Ka=(d,g,m)=>async function(v,w,A,R){let D=w.view.ma(A);D.ns&&(D=await Ad(v.localStore,w.query,!1).then(({documents:E})=>w.view.ma(E,D)));const L=R&&R.targetChanges.get(w.targetId),M=R&&R.targetMismatches.get(w.targetId)!=null,V=w.view.applyChanges(D,v.isPrimaryClient,L,M);return Od(v,w.targetId,V.wa),V.snapshot}(n,d,g,m);const r=await Ad(n.localStore,t,!0),o=new NE(t,r.Ts),a=o.ma(r.documents),l=er.createSynthesizedTargetChangeForCurrentChange(e,i&&n.onlineState!=="Offline",s),u=o.applyChanges(a,n.isPrimaryClient,l);Od(n,e,u.wa);const h=new FE(t,e,o);return n.Fa.set(t,h),n.Ma.has(e)?n.Ma.get(e).push(t):n.Ma.set(e,[t]),u.snapshot}async function HE(n,t,e){const i=K(n),s=i.Fa.get(t),r=i.Ma.get(s.targetId);if(r.length>1)return i.Ma.set(s.targetId,r.filter(o=>!Ko(o,t))),void i.Fa.delete(t);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(s.targetId),i.sharedClientState.isActiveQueryTarget(s.targetId)||await Ml(i.localStore,s.targetId,!1).then(()=>{i.sharedClientState.clearQueryState(s.targetId),e&&Mc(i.remoteStore,s.targetId),Ol(i,s.targetId)}).catch(Xs)):(Ol(i,s.targetId),await Ml(i.localStore,s.targetId,!0))}async function WE(n,t){const e=K(n),i=e.Fa.get(t),s=e.Ma.get(i.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(i.targetId),Mc(e.remoteStore,i.targetId))}async function qE(n,t,e){const i=ZE(n);try{const s=await function(o,a){const l=K(o),u=pt.now(),h=a.reduce((m,y)=>m.add(y.key),Y());let d,g;return l.persistence.runTransaction("Locally write mutations","readwrite",m=>{let y=Ge(),v=Y();return l.cs.getEntries(m,h).next(w=>{y=w,y.forEach((A,R)=>{R.isValidDocument()||(v=v.add(A))})}).next(()=>l.localDocuments.getOverlayedDocuments(m,y)).next(w=>{d=w;const A=[];for(const R of a){const D=gx(R,d.get(R.key).overlayedDocument);D!=null&&A.push(new Tn(R.key,D,kp(D.value.mapValue),fe.exists(!0)))}return l.mutationQueue.addMutationBatch(m,u,A,a)}).next(w=>{g=w;const A=w.applyToLocalDocumentSet(d,v);return l.documentOverlayCache.saveOverlays(m,w.batchId,A)})}).then(()=>({batchId:g.batchId,changes:Op(d)}))}(i.localStore,t);i.sharedClientState.addPendingMutation(s.batchId),function(o,a,l){let u=o.Ba[o.currentUser.toKey()];u||(u=new yt(nt)),u=u.insert(a,l),o.Ba[o.currentUser.toKey()]=u}(i,s.batchId,e),await ir(i,s.changes),await ta(i.remoteStore)}catch(s){const r=Fc(s,"Failed to persist write");e.reject(r)}}async function fm(n,t){const e=K(n);try{const i=await aE(e.localStore,t);t.targetChanges.forEach((s,r)=>{const o=e.Na.get(r);o&&(rt(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.va=!0:s.modifiedDocuments.size>0?rt(o.va):s.removedDocuments.size>0&&(rt(o.va),o.va=!1))}),await ir(e,i,t)}catch(i){await Xs(i)}}function Ld(n,t,e){const i=K(n);if(i.isPrimaryClient&&e===0||!i.isPrimaryClient&&e===1){const s=[];i.Fa.forEach((r,o)=>{const a=o.view.Z_(t);a.snapshot&&s.push(a.snapshot)}),function(o,a){const l=K(o);l.onlineState=a;let u=!1;l.queries.forEach((h,d)=>{for(const g of d.j_)g.Z_(a)&&(u=!0)}),u&&jc(l)}(i.eventManager,t),s.length&&i.Ca.d_(s),i.onlineState=t,i.isPrimaryClient&&i.sharedClientState.setOnlineState(t)}}async function KE(n,t,e){const i=K(n);i.sharedClientState.updateQueryState(t,"rejected",e);const s=i.Na.get(t),r=s&&s.key;if(r){let o=new yt(z.comparator);o=o.insert(r,Wt.newNoDocument(r,W.min()));const a=Y().add(r),l=new Xo(W.min(),new Map,new yt(nt),o,a);await fm(i,l),i.Oa=i.Oa.remove(r),i.Na.delete(t),$c(i)}else await Ml(i.localStore,t,!1).then(()=>Ol(i,t,e)).catch(Xs)}async function GE(n,t){const e=K(n),i=t.batch.batchId;try{const s=await oE(e.localStore,t);pm(e,i,null),gm(e,i),e.sharedClientState.updateMutationState(i,"acknowledged"),await ir(e,s)}catch(s){await Xs(s)}}async function YE(n,t,e){const i=K(n);try{const s=await function(o,a){const l=K(o);return l.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let h;return l.mutationQueue.lookupMutationBatch(u,a).next(d=>(rt(d!==null),h=d.keys(),l.mutationQueue.removeMutationBatch(u,d))).next(()=>l.mutationQueue.performConsistencyCheck(u)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(u,h,a)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,h)).next(()=>l.localDocuments.getDocuments(u,h))})}(i.localStore,t);pm(i,t,e),gm(i,t),i.sharedClientState.updateMutationState(t,"rejected",e),await ir(i,s)}catch(s){await Xs(s)}}function gm(n,t){(n.ka.get(t)||[]).forEach(e=>{e.resolve()}),n.ka.delete(t)}function pm(n,t,e){const i=K(n);let s=i.Ba[i.currentUser.toKey()];if(s){const r=s.get(t);r&&(e?r.reject(e):r.resolve(),s=s.remove(t)),i.Ba[i.currentUser.toKey()]=s}}function Ol(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const i of n.Ma.get(t))n.Fa.delete(i),e&&n.Ca.$a(i,e);n.Ma.delete(t),n.isPrimaryClient&&n.La.gr(t).forEach(i=>{n.La.containsKey(i)||mm(n,i)})}function mm(n,t){n.xa.delete(t.path.canonicalString());const e=n.Oa.get(t);e!==null&&(Mc(n.remoteStore,e),n.Oa=n.Oa.remove(t),n.Na.delete(e),$c(n))}function Od(n,t,e){for(const i of e)i instanceof um?(n.La.addReference(i.key,t),QE(n,i)):i instanceof hm?(j("SyncEngine","Document no longer in limbo: "+i.key),n.La.removeReference(i.key,t),n.La.containsKey(i.key)||mm(n,i.key)):H()}function QE(n,t){const e=t.key,i=e.path.canonicalString();n.Oa.get(e)||n.xa.has(i)||(j("SyncEngine","New document in limbo: "+e),n.xa.add(i),$c(n))}function $c(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const t=n.xa.values().next().value;n.xa.delete(t);const e=new z(ht.fromString(t)),i=n.qa.next();n.Na.set(i,new BE(e)),n.Oa=n.Oa.insert(e,i),sm(n.remoteStore,new on(xe(qo(e.path)),i,"TargetPurposeLimboResolution",bc.oe))}}async function ir(n,t,e){const i=K(n),s=[],r=[],o=[];i.Fa.isEmpty()||(i.Fa.forEach((a,l)=>{o.push(i.Ka(l,t,e).then(u=>{var h;if((u||e)&&i.isPrimaryClient){const d=u?!u.fromCache:(h=e==null?void 0:e.targetChanges.get(l.targetId))===null||h===void 0?void 0:h.current;i.sharedClientState.updateQueryState(l.targetId,d?"current":"not-current")}if(u){s.push(u);const d=Dc.Wi(l.targetId,u);r.push(d)}}))}),await Promise.all(o),i.Ca.d_(s),await async function(l,u){const h=K(l);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",d=>N.forEach(u,g=>N.forEach(g.$i,m=>h.persistence.referenceDelegate.addReference(d,g.targetId,m)).next(()=>N.forEach(g.Ui,m=>h.persistence.referenceDelegate.removeReference(d,g.targetId,m)))))}catch(d){if(!Js(d))throw d;j("LocalStore","Failed to update sequence numbers: "+d)}for(const d of u){const g=d.targetId;if(!d.fromCache){const m=h.os.get(g),y=m.snapshotVersion,v=m.withLastLimboFreeSnapshotVersion(y);h.os=h.os.insert(g,v)}}}(i.localStore,r))}async function XE(n,t){const e=K(n);if(!e.currentUser.isEqual(t)){j("SyncEngine","User change. New user:",t.toKey());const i=await tm(e.localStore,t);e.currentUser=t,function(r,o){r.ka.forEach(a=>{a.forEach(l=>{l.reject(new U(O.CANCELLED,o))})}),r.ka.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,i.removedBatchIds,i.addedBatchIds),await ir(e,i.hs)}}function JE(n,t){const e=K(n),i=e.Na.get(t);if(i&&i.va)return Y().add(i.key);{let s=Y();const r=e.Ma.get(t);if(!r)return s;for(const o of r){const a=e.Fa.get(o);s=s.unionWith(a.view.Va)}return s}}function ym(n){const t=K(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=fm.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=JE.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=KE.bind(null,t),t.Ca.d_=OE.bind(null,t.eventManager),t.Ca.$a=VE.bind(null,t.eventManager),t}function ZE(n){const t=K(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=GE.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=YE.bind(null,t),t}class So{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Jo(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return rE(this.persistence,new iE,t.initialUser,this.serializer)}Ga(t){return new tE(Cc.Zr,this.serializer)}Wa(t){return new dE}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}So.provider={build:()=>new So};class Vl{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Ld(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=XE.bind(null,this.syncEngine),await DE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new LE}()}createDatastore(t){const e=Jo(t.databaseInfo.databaseId),i=function(r){return new mE(r)}(t.databaseInfo);return function(r,o,a,l){return new bE(r,o,a,l)}(t.authCredentials,t.appCheckCredentials,i,e)}createRemoteStore(t){return function(i,s,r,o,a){return new wE(i,s,r,o,a)}(this.localStore,this.datastore,t.asyncQueue,e=>Ld(this.syncEngine,e,0),function(){return Pd.D()?new Pd:new fE}())}createSyncEngine(t,e){return function(s,r,o,a,l,u,h){const d=new UE(s,r,o,a,l,u);return h&&(d.Qa=!0),d}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const r=K(s);j("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await nr(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Vl.provider={build:()=>new Vl};/**
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
 */class Hc{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):Ke("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
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
 */class tk{constructor(t,e,i,s,r){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=i,this.databaseInfo=s,this.user=$t.UNAUTHENTICATED,this.clientId=wp.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(i,async o=>{j("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(i,o=>(j("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new $e;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const i=Fc(e,"Failed to shutdown persistence");t.reject(i)}}),t.promise}}async function qa(n,t){n.asyncQueue.verifyOperationInProgress(),j("FirestoreClient","Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let i=e.initialUser;n.setCredentialChangeListener(async s=>{i.isEqual(s)||(await tm(t.localStore,s),i=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function Vd(n,t){n.asyncQueue.verifyOperationInProgress();const e=await ek(n);j("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(i=>Rd(t.remoteStore,i)),n.setAppCheckTokenChangeListener((i,s)=>Rd(t.remoteStore,s)),n._onlineComponents=t}async function ek(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){j("FirestoreClient","Using user provided OfflineComponentProvider");try{await qa(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===O.FAILED_PRECONDITION||s.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;ki("Error using user provided cache. Falling back to memory cache: "+e),await qa(n,new So)}}else j("FirestoreClient","Using default OfflineComponentProvider"),await qa(n,new So);return n._offlineComponents}async function _m(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(j("FirestoreClient","Using user provided OnlineComponentProvider"),await Vd(n,n._uninitializedComponentsProvider._online)):(j("FirestoreClient","Using default OnlineComponentProvider"),await Vd(n,new Vl))),n._onlineComponents}function nk(n){return _m(n).then(t=>t.syncEngine)}async function Po(n){const t=await _m(n),e=t.eventManager;return e.onListen=jE.bind(null,t.syncEngine),e.onUnlisten=HE.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=zE.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=WE.bind(null,t.syncEngine),e}function ik(n,t,e={}){const i=new $e;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,a,l,u){const h=new Hc({next:g=>{h.Za(),o.enqueueAndForget(()=>Uc(r,d));const m=g.docs.has(a);!m&&g.fromCache?u.reject(new U(O.UNAVAILABLE,"Failed to get document because the client is offline.")):m&&g.fromCache&&l&&l.source==="server"?u.reject(new U(O.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(g)},error:g=>u.reject(g)}),d=new zc(qo(a.path),h,{includeMetadataChanges:!0,_a:!0});return Bc(r,d)}(await Po(n),n.asyncQueue,t,e,i)),i.promise}function sk(n,t,e={}){const i=new $e;return n.asyncQueue.enqueueAndForget(async()=>function(r,o,a,l,u){const h=new Hc({next:g=>{h.Za(),o.enqueueAndForget(()=>Uc(r,d)),g.fromCache&&l.source==="server"?u.reject(new U(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(g)},error:g=>u.reject(g)}),d=new zc(a,h,{includeMetadataChanges:!0,_a:!0});return Bc(r,d)}(await Po(n),n.asyncQueue,t,e,i)),i.promise}/**
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
 */function bm(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
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
 */const Nd=new Map;/**
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
 */function vm(n,t,e){if(!e)throw new U(O.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function rk(n,t,e,i){if(t===!0&&i===!0)throw new U(O.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function Fd(n){if(!z.isDocumentKey(n))throw new U(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Bd(n){if(z.isDocumentKey(n))throw new U(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function ea(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(i){return i.constructor?i.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":H()}function le(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new U(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=ea(n);throw new U(O.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
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
 */class Ud{constructor(t){var e,i;if(t.host===void 0){if(t.ssl!==void 0)throw new U(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new U(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}rk("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=bm((i=t.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new U(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new U(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new U(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(i,s){return i.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class na{constructor(t,e,i,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=i,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ud({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new U(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ud(t),t.credentials!==void 0&&(this._authCredentials=function(i){if(!i)return new Ew;switch(i.type){case"firstParty":return new Aw(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new U(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const i=Nd.get(e);i&&(j("ComponentProvider","Removing Datastore"),Nd.delete(e),i.terminate())}(this),Promise.resolve()}}function ok(n,t,e,i={}){var s;const r=(n=le(n,na))._getSettings(),o=`${t}:${e}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&ki("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),i.mockUserToken){let a,l;if(typeof i.mockUserToken=="string")a=i.mockUserToken,l=$t.MOCK_USER;else{a=Vy(i.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const u=i.mockUserToken.sub||i.mockUserToken.user_id;if(!u)throw new U(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new $t(u)}n._authCredentials=new kw(new vp(a,l))}}/**
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
 */class ti{constructor(t,e,i){this.converter=e,this._query=i,this.type="query",this.firestore=t}withConverter(t){return new ti(this.firestore,t,this._query)}}class Jt{constructor(t,e,i){this.converter=e,this._key=i,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new mn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Jt(this.firestore,t,this._key)}}class mn extends ti{constructor(t,e,i){super(t,e,qo(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Jt(this.firestore,null,new z(t))}withConverter(t){return new mn(this.firestore,t,this._path)}}function He(n,t,...e){if(n=At(n),vm("collection","path",t),n instanceof na){const i=ht.fromString(t,...e);return Bd(i),new mn(n,null,i)}{if(!(n instanceof Jt||n instanceof mn))throw new U(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(ht.fromString(t,...e));return Bd(i),new mn(n.firestore,null,i)}}function ei(n,t,...e){if(n=At(n),arguments.length===1&&(t=wp.newId()),vm("doc","path",t),n instanceof na){const i=ht.fromString(t,...e);return Fd(i),new Jt(n,null,new z(i))}{if(!(n instanceof Jt||n instanceof mn))throw new U(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(ht.fromString(t,...e));return Fd(i),new Jt(n.firestore,n instanceof mn?n.converter:null,new z(i))}}/**
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
 */class jd{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new nm(this,"async_queue_retry"),this.Vu=()=>{const i=Wa();i&&j("AsyncQueue","Visibility state changed to "+i.visibilityState),this.t_.jo()},this.mu=t;const e=Wa();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=Wa();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new $e;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!Js(t))throw t;j("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(i=>{this.Eu=i,this.du=!1;const s=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(i);throw Ke("INTERNAL UNHANDLED ERROR: ",s),i}).then(i=>(this.du=!1,i))));return this.mu=e,e}enqueueAfterDelay(t,e,i){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const s=Nc.createAndSchedule(this,t,e,i,r=>this.yu(r));return this.Tu.push(s),s}fu(){this.Eu&&H()}verifyOperationInProgress(){}async wu(){let t;do t=this.mu,await t;while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((e,i)=>e.targetTimeMs-i.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}function zd(n){return function(e,i){if(typeof e!="object"||e===null)return!1;const s=e;for(const r of i)if(r in s&&typeof s[r]=="function")return!0;return!1}(n,["next","error","complete"])}class En extends na{constructor(t,e,i,s){super(t,e,i,s),this.type="firestore",this._queue=new jd,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new jd(t),this._firestoreClient=void 0,await t}}}function ak(n,t){const e=typeof n=="object"?n:Cg(),i=typeof n=="string"?n:"(default)",s=lc(e,"firestore").getImmediate({identifier:i});if(!s._initialized){const r=Ly("firestore");r&&ok(s,...r)}return s}function ia(n){if(n._terminated)throw new U(O.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||lk(n),n._firestoreClient}function lk(n){var t,e,i;const s=n._freezeSettings(),r=function(a,l,u,h){return new Uw(a,l,u,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,bm(h.experimentalLongPollingOptions),h.useFetchStreams)}(n._databaseId,((t=n._app)===null||t===void 0?void 0:t.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((e=s.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((i=s.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new tk(n._authCredentials,n._appCheckCredentials,n._queue,r,n._componentsProvider&&function(a){const l=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(l),_online:l}}(n._componentsProvider))}/**
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
 */class Ri{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Ri(Nt.fromBase64String(t))}catch(e){throw new U(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Ri(Nt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
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
 */class sa{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new U(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Lt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class Wc{constructor(t){this._methodName=t}}/**
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
 */class qc{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new U(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new U(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return nt(this._lat,t._lat)||nt(this._long,t._long)}}/**
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
 */class Kc{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(i,s){if(i.length!==s.length)return!1;for(let r=0;r<i.length;++r)if(i[r]!==s[r])return!1;return!0}(this._values,t._values)}}/**
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
 */const ck=/^__.*__$/;class uk{constructor(t,e,i){this.data=t,this.fieldMask=e,this.fieldTransforms=i}toMutation(t,e){return this.fieldMask!==null?new Tn(t,this.data,this.fieldMask,e,this.fieldTransforms):new tr(t,this.data,e,this.fieldTransforms)}}class wm{constructor(t,e,i){this.data=t,this.fieldMask=e,this.fieldTransforms=i}toMutation(t,e){return new Tn(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function xm(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw H()}}class Gc{constructor(t,e,i,s,r,o){this.settings=t,this.databaseId=e,this.serializer=i,this.ignoreUndefinedProperties=s,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new Gc(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const i=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:i,xu:!1});return s.Ou(t),s}Nu(t){var e;const i=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:i,xu:!1});return s.vu(),s}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return Ro(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(t.length===0)throw this.Bu("Document fields must not be empty");if(xm(this.Cu)&&ck.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class hk{constructor(t,e,i){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=i||Jo(t)}Qu(t,e,i,s=!1){return new Gc({Cu:t,methodName:e,qu:i,path:Lt.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Yc(n){const t=n._freezeSettings(),e=Jo(n._databaseId);return new hk(n._databaseId,!!t.ignoreUndefinedProperties,e)}function dk(n,t,e,i,s,r={}){const o=n.Qu(r.merge||r.mergeFields?2:0,t,e,s);Qc("Data must be an object, but it was:",o,i);const a=Em(i,o);let l,u;if(r.merge)l=new se(o.fieldMask),u=o.fieldTransforms;else if(r.mergeFields){const h=[];for(const d of r.mergeFields){const g=Nl(t,d,e);if(!o.contains(g))throw new U(O.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Im(h,g)||h.push(g)}l=new se(h),u=o.fieldTransforms.filter(d=>l.covers(d.field))}else l=null,u=o.fieldTransforms;return new uk(new te(a),l,u)}class ra extends Wc{_toFieldTransform(t){if(t.Cu!==2)throw t.Cu===1?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof ra}}function fk(n,t,e,i){const s=n.Qu(1,t,e);Qc("Data must be an object, but it was:",s,i);const r=[],o=te.empty();Jn(i,(l,u)=>{const h=Xc(t,l,e);u=At(u);const d=s.Nu(h);if(u instanceof ra)r.push(h);else{const g=sr(u,d);g!=null&&(r.push(h),o.set(h,g))}});const a=new se(r);return new wm(o,a,s.fieldTransforms)}function gk(n,t,e,i,s,r){const o=n.Qu(1,t,e),a=[Nl(t,i,e)],l=[s];if(r.length%2!=0)throw new U(O.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<r.length;g+=2)a.push(Nl(t,r[g])),l.push(r[g+1]);const u=[],h=te.empty();for(let g=a.length-1;g>=0;--g)if(!Im(u,a[g])){const m=a[g];let y=l[g];y=At(y);const v=o.Nu(m);if(y instanceof ra)u.push(m);else{const w=sr(y,v);w!=null&&(u.push(m),h.set(m,w))}}const d=new se(u);return new wm(h,d,o.fieldTransforms)}function pk(n,t,e,i=!1){return sr(e,n.Qu(i?4:3,t))}function sr(n,t){if(km(n=At(n)))return Qc("Unsupported field value:",t,n),Em(n,t);if(n instanceof Wc)return function(i,s){if(!xm(s.Cu))throw s.Bu(`${i._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${i._methodName}() is not currently supported inside arrays`);const r=i._toFieldTransform(s);r&&s.fieldTransforms.push(r)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.xu&&t.Cu!==4)throw t.Bu("Nested arrays are not supported");return function(i,s){const r=[];let o=0;for(const a of i){let l=sr(a,s.Lu(o));l==null&&(l={nullValue:"NULL_VALUE"}),r.push(l),o++}return{arrayValue:{values:r}}}(n,t)}return function(i,s){if((i=At(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return lx(s.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const r=pt.fromDate(i);return{timestampValue:To(s.serializer,r)}}if(i instanceof pt){const r=new pt(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:To(s.serializer,r)}}if(i instanceof qc)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof Ri)return{bytesValue:Kp(s.serializer,i._byteString)};if(i instanceof Jt){const r=s.databaseId,o=i.firestore._databaseId;if(!o.isEqual(r))throw s.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:Pc(i.firestore._databaseId||s.databaseId,i._key.path)}}if(i instanceof Kc)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(l=>{if(typeof l!="number")throw a.Bu("VectorValues must only contain numeric values.");return Ic(a.serializer,l)})}}}}}}(i,s);throw s.Bu(`Unsupported field value: ${ea(i)}`)}(n,t)}function Em(n,t){const e={};return xp(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Jn(n,(i,s)=>{const r=sr(s,t.Mu(i));r!=null&&(e[i]=r)}),{mapValue:{fields:e}}}function km(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof pt||n instanceof qc||n instanceof Ri||n instanceof Jt||n instanceof Wc||n instanceof Kc)}function Qc(n,t,e){if(!km(e)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(e)){const i=ea(e);throw i==="an object"?t.Bu(n+" a custom object"):t.Bu(n+" "+i)}}function Nl(n,t,e){if((t=At(t))instanceof sa)return t._internalPath;if(typeof t=="string")return Xc(n,t);throw Ro("Field path arguments must be of type string or ",n,!1,void 0,e)}const mk=new RegExp("[~\\*/\\[\\]]");function Xc(n,t,e){if(t.search(mk)>=0)throw Ro(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new sa(...t.split("."))._internalPath}catch{throw Ro(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function Ro(n,t,e,i,s){const r=i&&!i.isEmpty(),o=s!==void 0;let a=`Function ${t}() called with invalid data`;e&&(a+=" (via `toFirestore()`)"),a+=". ";let l="";return(r||o)&&(l+=" (found",r&&(l+=` in field ${i}`),o&&(l+=` in document ${s}`),l+=")"),new U(O.INVALID_ARGUMENT,a+n+l)}function Im(n,t){return n.some(e=>e.isEqual(t))}/**
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
 */class Tm{constructor(t,e,i,s,r){this._firestore=t,this._userDataWriter=e,this._key=i,this._document=s,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Jt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new yk(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Am("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class yk extends Tm{data(){return super.data()}}function Am(n,t){return typeof t=="string"?Xc(n,t):t instanceof sa?t._internalPath:t._delegate._internalPath}/**
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
 */function Sm(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new U(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Jc{}class _k extends Jc{}function Zc(n,t,...e){let i=[];t instanceof Jc&&i.push(t),i=i.concat(e),function(r){const o=r.filter(l=>l instanceof eu).length,a=r.filter(l=>l instanceof tu).length;if(o>1||o>0&&a>0)throw new U(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(i);for(const s of i)n=s._apply(n);return n}class tu extends _k{constructor(t,e,i){super(),this._field=t,this._op=e,this._value=i,this.type="where"}static _create(t,e,i){return new tu(t,e,i)}_apply(t){const e=this._parse(t);return Pm(t._query,e),new ti(t.firestore,t.converter,Al(t._query,e))}_parse(t){const e=Yc(t.firestore);return function(r,o,a,l,u,h,d){let g;if(u.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new U(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Hd(d,h);const m=[];for(const y of d)m.push($d(l,r,y));g={arrayValue:{values:m}}}else g=$d(l,r,d)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Hd(d,h),g=pk(a,o,d,h==="in"||h==="not-in");return Tt.create(u,h,g)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}class eu extends Jc{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new eu(t,e)}_parse(t){const e=this._queryConstraints.map(i=>i._parse(t)).filter(i=>i.getFilters().length>0);return e.length===1?e[0]:me.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,r){let o=s;const a=r.getFlattenedFilters();for(const l of a)Pm(o,l),o=Al(o,l)}(t._query,e),new ti(t.firestore,t.converter,Al(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function $d(n,t,e){if(typeof(e=At(e))=="string"){if(e==="")throw new U(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Cp(t)&&e.indexOf("/")!==-1)throw new U(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const i=t.path.child(ht.fromString(e));if(!z.isDocumentKey(i))throw new U(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return ud(n,new z(i))}if(e instanceof Jt)return ud(n,e._key);throw new U(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ea(e)}.`)}function Hd(n,t){if(!Array.isArray(n)||n.length===0)throw new U(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Pm(n,t){const e=function(s,r){for(const o of s)for(const a of o.getFlattenedFilters())if(r.indexOf(a.op)>=0)return a.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new U(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new U(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class bk{convertValue(t,e="none"){switch(Gn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return xt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Kn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw H()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const i={};return Jn(t,(s,r)=>{i[s]=this.convertValue(r,e)}),i}convertVectorValue(t){var e,i,s;const r=(s=(i=(e=t.fields)===null||e===void 0?void 0:e.value.arrayValue)===null||i===void 0?void 0:i.values)===null||s===void 0?void 0:s.map(o=>xt(o.doubleValue));return new Kc(r)}convertGeoPoint(t){return new qc(xt(t.latitude),xt(t.longitude))}convertArray(t,e){return(t.values||[]).map(i=>this.convertValue(i,e))}convertServerTimestamp(t,e){switch(e){case"previous":const i=wc(t);return i==null?null:this.convertValue(i,e);case"estimate":return this.convertTimestamp(Ds(t));default:return null}}convertTimestamp(t){const e=wn(t);return new pt(e.seconds,e.nanos)}convertDocumentKey(t,e){const i=ht.fromString(t);rt(Zp(i));const s=new Ms(i.get(1),i.get(3)),r=new z(i.popFirst(5));return s.isEqual(e)||Ke(`Document ${r} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),r}}/**
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
 */function vk(n,t,e){let i;return i=n?n.toFirestore(t):t,i}/**
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
 */class hs{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Rm extends Tm{constructor(t,e,i,s,r,o){super(t,e,i,s,o),this._firestore=t,this._firestoreImpl=t,this.metadata=r}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Zr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const i=this._document.data.field(Am("DocumentSnapshot.get",t));if(i!==null)return this._userDataWriter.convertValue(i,e.serverTimestamps)}}}class Zr extends Rm{data(t={}){return super.data(t)}}class Cm{constructor(t,e,i,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new hs(s.hasPendingWrites,s.fromCache),this.query=i}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(i=>{t.call(e,new Zr(this._firestore,this._userDataWriter,i.key,i,new hs(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new U(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,r){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(a=>{const l=new Zr(s._firestore,s._userDataWriter,a.doc.key,a.doc,new hs(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:l,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(a=>r||a.type!==3).map(a=>{const l=new Zr(s._firestore,s._userDataWriter,a.doc.key,a.doc,new hs(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let u=-1,h=-1;return a.type!==0&&(u=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),h=o.indexOf(a.doc.key)),{type:wk(a.type),doc:l,oldIndex:u,newIndex:h}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function wk(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return H()}}/**
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
 */function xk(n){n=le(n,Jt);const t=le(n.firestore,En);return ik(ia(t),n._key).then(e=>Mm(t,n,e))}class nu extends bk{constructor(t){super(),this.firestore=t}convertBytes(t){return new Ri(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new Jt(this.firestore,null,e)}}function Ka(n){n=le(n,ti);const t=le(n.firestore,En),e=ia(t),i=new nu(t);return Sm(n._query),sk(e,n._query).then(s=>new Cm(t,i,n,s))}function iu(n,t,e,...i){n=le(n,Jt);const s=le(n.firestore,En),r=Yc(s);let o;return o=typeof(t=At(t))=="string"||t instanceof sa?gk(r,"updateDoc",n._key,t,e,i):fk(r,"updateDoc",n._key,t),ou(s,[o.toMutation(n._key,fe.exists(!0))])}function Dm(n){return ou(le(n.firestore,En),[new Tc(n._key,fe.none())])}function su(n,t){const e=le(n.firestore,En),i=ei(n),s=vk(n.converter,t);return ou(e,[dk(Yc(n.firestore),"addDoc",i._key,s,n.converter!==null,{}).toMutation(i._key,fe.exists(!1))]).then(()=>i)}function ru(n,...t){var e,i,s;n=At(n);let r={includeMetadataChanges:!1,source:"default"},o=0;typeof t[o]!="object"||zd(t[o])||(r=t[o],o++);const a={includeMetadataChanges:r.includeMetadataChanges,source:r.source};if(zd(t[o])){const d=t[o];t[o]=(e=d.next)===null||e===void 0?void 0:e.bind(d),t[o+1]=(i=d.error)===null||i===void 0?void 0:i.bind(d),t[o+2]=(s=d.complete)===null||s===void 0?void 0:s.bind(d)}let l,u,h;if(n instanceof Jt)u=le(n.firestore,En),h=qo(n._key.path),l={next:d=>{t[o]&&t[o](Mm(u,n,d))},error:t[o+1],complete:t[o+2]};else{const d=le(n,ti);u=le(d.firestore,En),h=d._query;const g=new nu(u);l={next:m=>{t[o]&&t[o](new Cm(u,g,d,m))},error:t[o+1],complete:t[o+2]},Sm(n._query)}return function(g,m,y,v){const w=new Hc(v),A=new zc(m,w,y);return g.asyncQueue.enqueueAndForget(async()=>Bc(await Po(g),A)),()=>{w.Za(),g.asyncQueue.enqueueAndForget(async()=>Uc(await Po(g),A))}}(ia(u),h,a,l)}function ou(n,t){return function(i,s){const r=new $e;return i.asyncQueue.enqueueAndForget(async()=>qE(await nk(i),s,r)),r.promise}(ia(n),t)}function Mm(n,t,e){const i=e.docs.get(t._key),s=new nu(n);return new Rm(n,s,t._key,i,new hs(e.hasPendingWrites,e.fromCache),t.converter)}(function(t,e=!0){(function(s){Ni=s})(Li),wi(new Wn("firestore",(i,{instanceIdentifier:s,options:r})=>{const o=i.getProvider("app").getImmediate(),a=new En(new Iw(i.getProvider("auth-internal")),new Pw(i.getProvider("app-check-internal")),function(u,h){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new U(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ms(u.options.projectId,h)}(o,s),o);return r=Object.assign({useFetchStreams:e},r),a._setSettings(r),a},"PUBLIC").setMultipleInstances(!0)),gn(rd,"4.7.3",t),gn(rd,"4.7.3","esm2017")})();xw("debug");const Wd=window.GLOBAL_FIREBASE_CONFIG||{};let Ga,re,Ot,au=!1;if(Wd.apiKey)try{Ga=Rg(Wd),re=_w(Ga),Ot=ak(Ga),au=!0,console.log("Firebase initialized successfully.")}catch(n){console.error("Firebase initialization error:",n)}else console.error("Firebase config not found.");function tt(n,t){const e=document.getElementById("message-modal");e&&e.remove();const i=`
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
    `;document.body.insertAdjacentHTML("beforeend",i);const s=document.getElementById("message-modal"),r=document.getElementById("msg-modal-ok"),o=document.getElementById("msg-modal-cancel"),a=()=>{s.classList.add("opacity-0"),setTimeout(()=>{s&&s.parentNode&&s.remove()},200)};r.addEventListener("click",()=>{t&&t(),a()}),o.addEventListener("click",a),s.addEventListener("click",l=>{l.target===s&&a()})}async function Ek(n,t){if(!au)throw new Error("Firebase not initialized");return await nv(re,n,t)}async function kk(){au&&await ip(re)}async function Ik(n){const t=re.currentUser;if(!t)throw tt("エラー","認証されていません。"),new Error("認証されていません。");try{await iv(t,n),tt("成功","パスワードが正常に変更されました。","success")}catch(e){console.error("パスワード変更エラー:",e);let i="パスワードの変更に失敗しました。";throw e.code==="auth/requires-recent-login"&&(i="セキュリティ保護のため、パスワード変更には再ログインが必要です。一度ログアウトし、再度ログインしてから設定画面を開いてください。"),tt("エラー",i),e}}function Tk(n){const t=document.getElementById("login-form-container"),e=document.getElementById("user-info"),i=document.getElementById("user-display-name"),s=document.getElementById("email-input"),r=document.getElementById("password-input"),o=document.getElementById("logout-btn"),a=document.getElementById("email-login-btn");!t||!e||(n?(t.classList.add("hidden"),e.classList.remove("hidden"),e.classList.add("flex"),i&&(i.textContent=n.email||"ユーザー")):(t.classList.remove("hidden"),e.classList.add("hidden"),e.classList.remove("flex"),i&&(i.textContent=""),s&&(s.value=""),r&&(r.value="")),a&&!a.hasListener&&(a.addEventListener("click",async()=>{try{if(!s.value||!r.value){tt("メールアドレスとパスワードを入力してください。",null);return}await Ek(s.value,r.value)}catch(l){tt("ログインエラー: "+(l.message||"失敗しました"),null)}}),a.hasListener=!0),o&&!o.hasListener&&(o.addEventListener("click",async()=>{await kk()}),o.hasListener=!0))}function Lm(){localStorage.theme==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),Ak()}function Ak(){const n=document.getElementById("theme-toggle-icon");n&&(document.documentElement.classList.contains("dark")?(n.classList.remove("fa-sun"),n.classList.add("fa-moon")):(n.classList.remove("fa-moon"),n.classList.add("fa-sun")))}let Cr=280;function Fl(n,t,e){if(!e)return;let i=!1;if(n){const a=localStorage.getItem("sidebarWidth");Cr=a?parseInt(a,10):280,n.style.width=`${Cr}px`}const s=a=>{i=!0,document.body.style.cursor="col-resize",document.body.classList.add("select-none"),document.addEventListener("mousemove",r),document.addEventListener("mouseup",o),a.preventDefault()},r=a=>{if(!i)return;let l=a.clientX;const u=150,h=500;l<u&&(l=u),l>h&&(l=h),Cr=l,n.style.width=`${l}px`},o=()=>{i=!1,document.body.style.cursor="",document.body.classList.remove("select-none"),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",o),localStorage.setItem("sidebarWidth",Cr)};e.addEventListener("mousedown",s)}function Sk(){const n=document.getElementById("app");if(!n)return;Lm(),n.innerHTML=`
        <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            <!-- サイドバー -->
            <!-- ★修正: 開閉制御用にカスタムクラス 'sidebar-closed' を追加/削除する -->
            <!-- デフォルトで開いている状態のクラスを設定 -->
            <aside id="sidebar" class="flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all duration-300 group z-20 fixed md:relative h-full md:translate-x-0 -translate-x-full shadow-xl md:shadow-none" style="width: 280px;">
                <!-- ロゴエリア -->
                <div class="h-12 flex items-center px-4 flex-shrink-0 justify-between">
                    <div class="flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg cursor-pointer hover:opacity-80 transition select-none">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        TaskMg
                    </div>
                    <!-- サイドバー閉じるボタン (モバイル/デスクトップ共通) -->
                    <button id="sidebar-close-btn" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800" title="サイドバーを閉じる">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>
                
                <!-- サイドバーコンテンツ -->
                <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
                
                <!-- フッター (設定ボタン) - ★削除: 検索項目に統合されたため削除する -->
                <!-- リサイズハンドル -->
                <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"></div>
            </aside>

            <!-- メインコンテンツラッパー -->
            <!-- ★修正: 開閉制御用にカスタムクラス 'sidebar-closed' に応じてメインコンテンツの幅を制御したい場合は、このmainタグに'flex-1'だけを設定しておく -->
            <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                <!-- ヘッダー -->
                <header class="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900 z-10">
                    <div class="flex items-center min-w-0 flex-1 mr-4">
                        <!-- サイドバーを開くボタン -->
                        <!-- ★修正: PCでも開閉ボタンは常に存在させ、ロジックで表示/非表示を切り替える -->
                        <button id="sidebar-open-btn" class="mr-3 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" title="サイドバーを開く">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        
                        <h2 id="header-title" class="text-base font-bold truncate text-gray-800 dark:text-gray-100">インボックス</h2>
                        <span id="header-count" class="ml-2 text-xs text-gray-500 font-normal hidden sm:inline-block"></span>
                    </div>

                    <div class="flex items-center space-x-1 sm:space-x-2">
                        <!-- ソート (カスタムドロップダウンに置き換え) -->
                        <div id="custom-sort-dropdown" class="relative inline-block text-left z-10">
                            <!-- トリガー（ボタン） -->
                            <!-- デフォルトの選択肢に合わせて、初期値を 'createdAt_desc' に設定 -->
                            <button 
                                id="sort-trigger"
                                type="button"
                                class="appearance-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs py-1.5 pl-2 pr-6 rounded cursor-pointer focus:outline-none flex items-center">
                                <span id="sort-label">作成日(新しい順)</span>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </button>

                            <!-- ドロップダウンメニュー（初期は非表示） -->
                            <div 
                                id="sort-menu"
                                class="absolute right-0 mt-2 w-[180px] origin-top-right rounded-lg shadow-lg 
                                       bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
                                       opacity-0 invisible scale-95 transition-all duration-150 ease-out 
                                       pointer-events-none z-50">
                                <div class="py-1">
                                    <!-- data-valueはsrc/logic/sort.jsで定義されたcriteriaに一致させる -->
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
                        <!-- ★修正: task-viewコンテナにトランジションクラスを追加 -->
                        <div id="task-view" class="w-full animate-fade-in transition-opacity duration-150" style="opacity: 1;"></div>
                        <div id="search-view" class="hidden w-full animate-fade-in"></div>
                        <div id="dashboard-view" class="hidden w-full animate-fade-in"></div>
                        <div id="settings-view" class="hidden w-full animate-fade-in"></div>
                    </div>
                </div>
            </main>
        </div>
        
        <div id="modal-container" class="z-50 relative"></div>
    `;const t=document.getElementById("sidebar"),e=document.querySelector("main"),i=document.getElementById("sidebar-resizer");Fl&&Fl(t,e,i),document.addEventListener("keydown",s=>{var r;s.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"&&(s.preventDefault(),(r=document.getElementById("page-search-input"))==null||r.focus())})}function Pk(n){if(!n)return"";const t=new Date(n);if(isNaN(t.getTime()))return"";const e=new Date,i=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-i.getTime(),o=Math.ceil(r/(1e3*60*60*24));if(o===0)return"今日";if(o===1)return"明日";if(o===-1)return"昨日";const a=t.getFullYear(),l=(t.getMonth()+1).toString().padStart(2,"0"),u=t.getDate().toString().padStart(2,"0");return a!==e.getFullYear()?`${a}/${l}/${u}`:`${l}/${u}`}function Rk(n){if(!n)return"text-gray-500";const t=new Date(n),e=new Date,i=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-i.getTime(),o=Math.ceil(r/(1e3*60*60*24));return o<0?"text-red-500 font-bold":o===0?"text-green-600 dark:text-green-400 font-medium":o===1?"text-orange-500 dark:text-orange-400 font-medium":"text-gray-500 dark:text-gray-400"}function Ck(n,t){const e=new Date(n);if(t.type==="daily")return e.setDate(e.getDate()+1),e;if(t.type==="weekly"&&Array.isArray(t.days)&&t.days.length>0){let i=!1,s=1;const r=n.getDay();for(let o=1;o<=7;o++){const a=(r+o)%7;if(t.days.includes(a)){s=o,i=!0;break}}if(i)return e.setDate(e.getDate()+s),e}return t.type==="monthly"?(e.setMonth(e.getMonth()+1),e):null}function lu(n){const t=new Date;if(t.setHours(0,0,0,0),!n||!n.type||n.type==="daily"||n.type==="monthly")return t;if(n.type==="weekly"&&Array.isArray(n.days)&&n.days.length>0){const e=t.getDay();let i=0;if(n.days.includes(e))i=0;else for(let r=1;r<=6;r++){const o=(e+r)%7;if(n.days.includes(o)){i=r;break}}const s=new Date(t);return s.setDate(t.getDate()+i),s}return t}let Ya=null;function Om(n,t){var e,i;return{id:n,...t,createdAt:(e=t.createdAt)!=null&&e.toDate?t.createdAt.toDate():t.createdAt||Date.now(),dueDate:(i=t.dueDate)!=null&&i.toDate?t.dueDate.toDate():t.dueDate||null,recurrence:t.recurrence||null}}function qd(n,t){if(Ya&&Ya(),!n){t([]);return}const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`,s=Zc(He(Ot,i));Ya=ru(s,r=>{const o=r.docs.map(a=>Om(a.id,a.data()));t(o)})}async function Dk(n,t){const e=window.GLOBAL_APP_ID,i=ei(Ot,`/artifacts/${e}/users/${n}/tasks`,t),s=await xk(i);return s.exists()?Om(s.id,s.data()):null}async function Vm(n,t){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`,s={...t};s.dueDate instanceof Date&&(s.dueDate=pt.fromDate(s.dueDate)),await su(He(Ot,i),{...s,ownerId:n,status:"todo",createdAt:pt.fromDate(new Date)})}async function Mk(n,t,e){const s=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/tasks`;await iu(ei(Ot,s,t),{status:e})}async function Lk(n,t,e){const i=window.GLOBAL_APP_ID,s=ei(Ot,`/artifacts/${i}/users/${n}/tasks`,t),r={...e};r.dueDate&&!(r.dueDate instanceof pt)&&(r.dueDate instanceof Date?r.dueDate=pt.fromDate(r.dueDate):typeof r.dueDate=="string"||typeof r.dueDate=="number"?r.dueDate=pt.fromDate(new Date(r.dueDate)):r.dueDate===null&&(r.dueDate=null)),r.recurrence===void 0?delete r.recurrence:r.recurrence===null&&(r.recurrence=null),await iu(s,r)}async function Ok(n,t){const e=window.GLOBAL_APP_ID,i=ei(Ot,`/artifacts/${e}/users/${n}/tasks`,t);await Dm(i)}async function Vk(n){if(!Ot)throw new Error("Firestore not initialized");const t=window.GLOBAL_APP_ID,e=He(Ot,`/artifacts/${t}/users/${n}/tasks`),i=He(Ot,`/artifacts/${t}/users/${n}/projects`),s=He(Ot,`/artifacts/${t}/users/${n}/labels`),[r,o,a]=await Promise.all([Ka(e),Ka(i),Ka(s)]),l=u=>u.docs.map(h=>{const d=h.data(),g={id:h.id};for(const m in d)d[m]&&d[m].toDate?g[m]=d[m].toDate().toISOString():g[m]=d[m];return g});return{version:"1.0",exportedAt:new Date().toISOString(),userId:n,tasks:l(r),projects:l(o),labels:l(a)}}function Ui(){var t;const n=(t=re.currentUser)==null?void 0:t.uid;if(!n)throw tt("操作にはログインが必要です。",null),new Error("Authentication required.");return n}async function Nk(n){if(n.status!=="completed"||!n.recurrence)return;const{recurrence:t,dueDate:e}=n;if(!e||typeof t!="object"||!t.type)return;const i=Ck(e,t);if(i){const s={title:n.title,description:n.description||"",status:"todo",dueDate:i,projectId:n.projectId,labelIds:n.labelIds,recurrence:n.recurrence};try{await Bk(s),console.log(`Generated next recurring task for: ${n.title}, next due: ${i}`)}catch(r){console.error("Failed to generate next recurring task:",r)}}}function Fk(n){var e;const t=(e=re.currentUser)==null?void 0:e.uid;qd(t||null,n)}async function Bk(n){const t=Ui();return Vm(t,n)}async function Uk(n,t){const e=Ui(),i=await Mk(e,n,t);if(t==="completed"){const s=await Dk(e,n);s&&Nk(s).catch(r=>console.error("Recurring task handler failed:",r))}return i}async function ds(n,t){const e=Ui();return Lk(e,n,t)}async function Nm(n){const t=Ui();return Ok(t,n)}async function jk(){const n=Ui();return Vk(n)}async function zk(n){const t=Ui(),e={title:n.title,description:n.description||"",dueDate:null,projectId:n.projectId||null,labelIds:Array.isArray(n.labelIds)?n.labelIds:[],recurrence:n.recurrence||null};return Vm(t,e)}async function Kd(n){var o;const t=(o=re.currentUser)==null?void 0:o.uid;if(!t)throw tt("ログインが必要です"),new Error("Authentication required");const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${t}/filters`,{id:s,...r}=n;await su(He(Ot,i),{...r,ownerId:t,createdAt:new Date().toISOString()})}function Gd(n){if(!n)return"";const t=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0");return`${t}-${e}-${i}`}let he=[{id:"tb_morning",name:"朝集中",start:"06:00",end:"09:00",color:"#EF4444",order:0},{id:"tb_afternoon",name:"午後作業",start:"13:00",end:"17:00",color:"#3B82F6",order:1},{id:"tb_night",name:"夜ルーティン",start:"20:00",end:"22:00",color:"#8B5CF6",order:2}];function ni(){return[...he].sort((n,t)=>n.order-t.order)}async function $k(n){const t=he.findIndex(e=>e.id===n.id);if(t>=0)he[t]={...he[t],...n};else{if(he.length>=5)throw new Error("最大5個までです");const e={...n,id:n.id||crypto.randomUUID(),order:he.length};he.push(e)}return!0}async function Hk(n){return he=he.filter(t=>t.id!==n),he.forEach((t,e)=>t.order=e),!0}function Wk(n){return he.find(t=>t.id===n)}function qk(n=[]){return["日","月","火","水","木","金","土"].map((e,i)=>`
        <label class="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" data-day-index="${i}" ${n.includes(i)?"checked":""} 
                    class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded">
            <span class="text-xs text-gray-700 dark:text-gray-300">${e}</span>
        </label>
    `).join("")}function Kk(n){var v,w;let t=n.dueDate;const e=((v=n.recurrence)==null?void 0:v.type)||"none",i=((w=n.recurrence)==null?void 0:w.days)||[];e!=="none"&&!t&&(t=lu({type:e,days:e==="weekly"?i:[]}));const s=t&&t.toDate?Gd(t.toDate()):t?Gd(new Date(t)):"",r=qk(i),o=ni(),a=n.timeBlockId||"",l=o.map(A=>`<option value="${A.id}" ${A.id===a?"selected":""}>
            ${A.start} - ${A.end}
        </option>`).join(""),u=n.duration||"",d=[30,45,60,75,90].map(A=>`<option value="${A}" ${A==u?"selected":""}>
            ${A} min
        </option>`).join(""),m=s||e!=="none"||a||u?"":"open",y=n.description||"";return`
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
                                    <input type="date" id="modal-task-date" value="${s}"
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
                                        ${d}
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
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 flex justify-between items-center">
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
    `}function Gk(n){if(!n)return"";let t=n;t=t.replace(/\[(.*?)\]\((.*?)\)/g,(r,o,a)=>`<a href="${a.replace(/"/g,"&quot;")}" target="_blank" class="text-blue-400 hover:text-blue-300 underline">${o}</a>`);const e=t.split(`
`);let i=!1,s=[];return e.forEach(r=>{const o=r.trimStart();if(o.startsWith("* ")||o.startsWith("- ")){i||(s.push('<ul class="list-disc ml-5 space-y-1">'),i=!0);const l=o.substring(2).trim();s.push(`<li>${l}</li>`)}else i&&(s.push("</ul>"),i=!1),r.trim().length>0?s.push(`<p class="mb-2">${r.replace(/\n/g,"<br>")}</p>`):s.push("")}),i&&s.push("</ul>"),t=s.filter(r=>r.trim().length>0||r.startsWith("<")).join(`
`),t}function Yk(n,t,e){var i,s,r,o,a;(i=n.querySelector("#close-modal-btn"))==null||i.addEventListener("click",e),(s=n.querySelector("#cancel-modal-btn"))==null||s.addEventListener("click",e),(r=n.querySelector("div.fixed"))==null||r.addEventListener("click",l=>{l.target===l.currentTarget&&e()}),(o=n.querySelector("#save-task-modal-btn"))==null||o.addEventListener("click",async()=>{await Xk(t,e)}),(a=n.querySelector("#delete-task-modal-btn"))==null||a.addEventListener("click",()=>{tt("本当に削除しますか？",async()=>{await Nm(t.id),e()})}),Jk(),Qk()}function Qk(){const n=document.getElementById("modal-task-desc"),t=document.getElementById("modal-task-desc-preview"),e=document.getElementById("toggle-memo-view");if(!n||!t||!e)return;let i=!0;const s=()=>{const o=n.value;t.innerHTML=Gk(o)},r=()=>{i=!i,i?(n.classList.remove("hidden"),t.classList.add("hidden"),e.textContent="プレビュー"):(s(),n.classList.add("hidden"),t.classList.remove("hidden"),e.textContent="編集")};e.addEventListener("click",r),n.addEventListener("input",s),s(),n.classList.remove("hidden"),t.classList.add("hidden"),e.textContent="プレビュー"}async function Xk(n,t){const e=document.getElementById("modal-task-title").value.trim(),i=document.getElementById("modal-task-desc").value.trim(),s=document.getElementById("modal-task-date").value,r=document.getElementById("modal-task-recurrence").value,o=document.getElementById("modal-task-timeblock").value,a=document.getElementById("modal-task-duration").value;if(!e){tt("タイトルを入力してください",null);return}let l=null;if(r!=="none")if(r==="weekly"){const h=Array.from(document.querySelectorAll('#recurrence-days-checkboxes input[type="checkbox"]:checked')).map(d=>parseInt(d.dataset.dayIndex,10)).sort((d,g)=>d-g);if(h.length===0){tt("毎週繰り返す設定の場合、少なくとも一つ曜日を選択してください。",null);return}l={type:r,days:h}}else l={type:r};const u={title:e,description:i,dueDate:s?new Date(s):null,recurrence:l,timeBlockId:o||null,duration:a?parseInt(a,10):null};await ds(n.id,u),t()}function Jk(){const n=document.getElementById("modal-task-recurrence"),t=document.getElementById("recurrence-days-container"),e=document.getElementById("modal-task-date");if(!n||!t||!e)return;const i=s=>{const r=s.target.value,o=r==="weekly";if(o?t.classList.remove("hidden"):t.classList.add("hidden"),r!=="none"){const a={type:r};if(o){Yd(e,t);const u=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(h=>parseInt(h.dataset.dayIndex,10));a.days=u}const l=lu(a);e.value=l.toISOString().substring(0,10)}};n.addEventListener("change",i),n.value==="weekly"&&(t.classList.remove("hidden"),Yd(e,t))}function Yd(n,t){t.querySelectorAll('input[type="checkbox"]').forEach(s=>{s.removeEventListener("change",i),s.addEventListener("change",i)});function i(){const s=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(r=>parseInt(r.dataset.dayIndex,10));if(s.length>0){const o=lu({type:"weekly",days:s});n.value=o.toISOString().substring(0,10)}}}let Fm=[];function Zk(n,t){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/projects`,s=Zc(He(Ot,i));return ru(s,r=>{const o=r.docs.map(a=>({id:a.id,...a.data()}));Fm=o,t(o)})}function tI(){return Fm}async function eI(n,t){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/projects`;await su(He(Ot,i),{name:t,ownerId:n,createdAt:new Date})}async function nI(n,t,e){const s=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/projects`,r=ei(Ot,s,t);return iu(r,e)}async function iI(n,t){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/projects`;await Dm(ei(Ot,i,t))}function cu(){var t;const n=(t=re.currentUser)==null?void 0:t.uid;if(!n)throw tt("操作にはログインが必要です。",null),new Error("Authentication required.");return n}function sI(n){var e;const t=(e=re.currentUser)==null?void 0:e.uid;t&&Zk(t,n)}async function rI(n){const t=cu();return eI(t,n)}async function oI(n,t){const e=cu();return nI(e,n,t)}async function aI(n){const t=cu();return iI(t,n)}function lI(n,t){const i=`/artifacts/${window.GLOBAL_APP_ID}/users/${n}/labels`,s=Zc(He(Ot,i));return ru(s,r=>{const o=r.docs.map(a=>({id:a.id,...a.data()}));t(o)})}function cI(n){var e;const t=(e=re.currentUser)==null?void 0:e.uid;t&&lI(t,n)}function Bm(n=null,t=[]){const e=n===null,i=e?"新しいプロジェクト名を入力してください":`プロジェクト「${n.name}」を編集`,s=e?"":n.name,r=prompt(i,s);!r||r.trim()===s||(e?rI(r.trim()).then(()=>tt("プロジェクトを作成しました")).catch(o=>{console.error(o),tt("作成に失敗しました","error")}):oI(n.id,{name:r.trim()}).then(()=>tt("プロジェクトを更新しました")).catch(o=>{console.error(o),tt("更新に失敗しました","error")}))}function uI(){document.addEventListener("keydown",n=>{const t=document.getElementById("modal-container");n.key==="Escape"&&t&&t.children.length>0&&Um()})}function hI(n){let t=document.getElementById("modal-container");t||(t=document.createElement("div"),t.id="modal-container",document.body.appendChild(t)),t.innerHTML=Kk(n),Yk(t,n,Um)}function Um(){const n=document.getElementById("modal-container");n&&(n.innerHTML="")}/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */function rr(n){return n+.5|0}const an=(n,t,e)=>Math.max(Math.min(n,e),t);function fs(n){return an(rr(n*2.55),0,255)}function yn(n){return an(rr(n*255),0,255)}function Le(n){return an(rr(n/2.55)/100,0,1)}function Qd(n){return an(rr(n*100),0,100)}const oe={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Bl=[..."0123456789ABCDEF"],dI=n=>Bl[n&15],fI=n=>Bl[(n&240)>>4]+Bl[n&15],Dr=n=>(n&240)>>4===(n&15),gI=n=>Dr(n.r)&&Dr(n.g)&&Dr(n.b)&&Dr(n.a);function pI(n){var t=n.length,e;return n[0]==="#"&&(t===4||t===5?e={r:255&oe[n[1]]*17,g:255&oe[n[2]]*17,b:255&oe[n[3]]*17,a:t===5?oe[n[4]]*17:255}:(t===7||t===9)&&(e={r:oe[n[1]]<<4|oe[n[2]],g:oe[n[3]]<<4|oe[n[4]],b:oe[n[5]]<<4|oe[n[6]],a:t===9?oe[n[7]]<<4|oe[n[8]]:255})),e}const mI=(n,t)=>n<255?t(n):"";function yI(n){var t=gI(n)?dI:fI;return n?"#"+t(n.r)+t(n.g)+t(n.b)+mI(n.a,t):void 0}const _I=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function jm(n,t,e){const i=t*Math.min(e,1-e),s=(r,o=(r+n/30)%12)=>e-i*Math.max(Math.min(o-3,9-o,1),-1);return[s(0),s(8),s(4)]}function bI(n,t,e){const i=(s,r=(s+n/60)%6)=>e-e*t*Math.max(Math.min(r,4-r,1),0);return[i(5),i(3),i(1)]}function vI(n,t,e){const i=jm(n,1,.5);let s;for(t+e>1&&(s=1/(t+e),t*=s,e*=s),s=0;s<3;s++)i[s]*=1-t-e,i[s]+=t;return i}function wI(n,t,e,i,s){return n===s?(t-e)/i+(t<e?6:0):t===s?(e-n)/i+2:(n-t)/i+4}function uu(n){const e=n.r/255,i=n.g/255,s=n.b/255,r=Math.max(e,i,s),o=Math.min(e,i,s),a=(r+o)/2;let l,u,h;return r!==o&&(h=r-o,u=a>.5?h/(2-r-o):h/(r+o),l=wI(e,i,s,h,r),l=l*60+.5),[l|0,u||0,a]}function hu(n,t,e,i){return(Array.isArray(t)?n(t[0],t[1],t[2]):n(t,e,i)).map(yn)}function du(n,t,e){return hu(jm,n,t,e)}function xI(n,t,e){return hu(vI,n,t,e)}function EI(n,t,e){return hu(bI,n,t,e)}function zm(n){return(n%360+360)%360}function kI(n){const t=_I.exec(n);let e=255,i;if(!t)return;t[5]!==i&&(e=t[6]?fs(+t[5]):yn(+t[5]));const s=zm(+t[2]),r=+t[3]/100,o=+t[4]/100;return t[1]==="hwb"?i=xI(s,r,o):t[1]==="hsv"?i=EI(s,r,o):i=du(s,r,o),{r:i[0],g:i[1],b:i[2],a:e}}function II(n,t){var e=uu(n);e[0]=zm(e[0]+t),e=du(e),n.r=e[0],n.g=e[1],n.b=e[2]}function TI(n){if(!n)return;const t=uu(n),e=t[0],i=Qd(t[1]),s=Qd(t[2]);return n.a<255?`hsla(${e}, ${i}%, ${s}%, ${Le(n.a)})`:`hsl(${e}, ${i}%, ${s}%)`}const Xd={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Jd={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};function AI(){const n={},t=Object.keys(Jd),e=Object.keys(Xd);let i,s,r,o,a;for(i=0;i<t.length;i++){for(o=a=t[i],s=0;s<e.length;s++)r=e[s],a=a.replace(r,Xd[r]);r=parseInt(Jd[o],16),n[a]=[r>>16&255,r>>8&255,r&255]}return n}let Mr;function SI(n){Mr||(Mr=AI(),Mr.transparent=[0,0,0,0]);const t=Mr[n.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:t.length===4?t[3]:255}}const PI=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;function RI(n){const t=PI.exec(n);let e=255,i,s,r;if(t){if(t[7]!==i){const o=+t[7];e=t[8]?fs(o):an(o*255,0,255)}return i=+t[1],s=+t[3],r=+t[5],i=255&(t[2]?fs(i):an(i,0,255)),s=255&(t[4]?fs(s):an(s,0,255)),r=255&(t[6]?fs(r):an(r,0,255)),{r:i,g:s,b:r,a:e}}}function CI(n){return n&&(n.a<255?`rgba(${n.r}, ${n.g}, ${n.b}, ${Le(n.a)})`:`rgb(${n.r}, ${n.g}, ${n.b})`)}const Qa=n=>n<=.0031308?n*12.92:Math.pow(n,1/2.4)*1.055-.055,ci=n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4);function DI(n,t,e){const i=ci(Le(n.r)),s=ci(Le(n.g)),r=ci(Le(n.b));return{r:yn(Qa(i+e*(ci(Le(t.r))-i))),g:yn(Qa(s+e*(ci(Le(t.g))-s))),b:yn(Qa(r+e*(ci(Le(t.b))-r))),a:n.a+e*(t.a-n.a)}}function Lr(n,t,e){if(n){let i=uu(n);i[t]=Math.max(0,Math.min(i[t]+i[t]*e,t===0?360:1)),i=du(i),n.r=i[0],n.g=i[1],n.b=i[2]}}function $m(n,t){return n&&Object.assign(t||{},n)}function Zd(n){var t={r:0,g:0,b:0,a:255};return Array.isArray(n)?n.length>=3&&(t={r:n[0],g:n[1],b:n[2],a:255},n.length>3&&(t.a=yn(n[3]))):(t=$m(n,{r:0,g:0,b:0,a:1}),t.a=yn(t.a)),t}function MI(n){return n.charAt(0)==="r"?RI(n):kI(n)}class Ns{constructor(t){if(t instanceof Ns)return t;const e=typeof t;let i;e==="object"?i=Zd(t):e==="string"&&(i=pI(t)||SI(t)||MI(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=$m(this._rgb);return t&&(t.a=Le(t.a)),t}set rgb(t){this._rgb=Zd(t)}rgbString(){return this._valid?CI(this._rgb):void 0}hexString(){return this._valid?yI(this._rgb):void 0}hslString(){return this._valid?TI(this._rgb):void 0}mix(t,e){if(t){const i=this.rgb,s=t.rgb;let r;const o=e===r?.5:e,a=2*o-1,l=i.a-s.a,u=((a*l===-1?a:(a+l)/(1+a*l))+1)/2;r=1-u,i.r=255&u*i.r+r*s.r+.5,i.g=255&u*i.g+r*s.g+.5,i.b=255&u*i.b+r*s.b+.5,i.a=o*i.a+(1-o)*s.a,this.rgb=i}return this}interpolate(t,e){return t&&(this._rgb=DI(this._rgb,t._rgb,e)),this}clone(){return new Ns(this.rgb)}alpha(t){return this._rgb.a=yn(t),this}clearer(t){const e=this._rgb;return e.a*=1-t,this}greyscale(){const t=this._rgb,e=rr(t.r*.3+t.g*.59+t.b*.11);return t.r=t.g=t.b=e,this}opaquer(t){const e=this._rgb;return e.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Lr(this._rgb,2,t),this}darken(t){return Lr(this._rgb,2,-t),this}saturate(t){return Lr(this._rgb,1,t),this}desaturate(t){return Lr(this._rgb,1,-t),this}rotate(t){return II(this._rgb,t),this}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */function Ce(){}const LI=(()=>{let n=0;return()=>n++})();function G(n){return n==null}function ft(n){if(Array.isArray&&Array.isArray(n))return!0;const t=Object.prototype.toString.call(n);return t.slice(0,7)==="[object"&&t.slice(-6)==="Array]"}function Q(n){return n!==null&&Object.prototype.toString.call(n)==="[object Object]"}function wt(n){return(typeof n=="number"||n instanceof Number)&&isFinite(+n)}function ie(n,t){return wt(n)?n:t}function q(n,t){return typeof n>"u"?t:n}const OI=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100:+n/t,Hm=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100*t:+n;function ct(n,t,e){if(n&&typeof n.call=="function")return n.apply(e,t)}function st(n,t,e,i){let s,r,o;if(ft(n))for(r=n.length,s=0;s<r;s++)t.call(e,n[s],s);else if(Q(n))for(o=Object.keys(n),r=o.length,s=0;s<r;s++)t.call(e,n[o[s]],o[s])}function Co(n,t){let e,i,s,r;if(!n||!t||n.length!==t.length)return!1;for(e=0,i=n.length;e<i;++e)if(s=n[e],r=t[e],s.datasetIndex!==r.datasetIndex||s.index!==r.index)return!1;return!0}function Do(n){if(ft(n))return n.map(Do);if(Q(n)){const t=Object.create(null),e=Object.keys(n),i=e.length;let s=0;for(;s<i;++s)t[e[s]]=Do(n[e[s]]);return t}return n}function Wm(n){return["__proto__","prototype","constructor"].indexOf(n)===-1}function VI(n,t,e,i){if(!Wm(n))return;const s=t[n],r=e[n];Q(s)&&Q(r)?Fs(s,r,i):t[n]=Do(r)}function Fs(n,t,e){const i=ft(t)?t:[t],s=i.length;if(!Q(n))return n;e=e||{};const r=e.merger||VI;let o;for(let a=0;a<s;++a){if(o=i[a],!Q(o))continue;const l=Object.keys(o);for(let u=0,h=l.length;u<h;++u)r(l[u],n,o,e)}return n}function ks(n,t){return Fs(n,t,{merger:NI})}function NI(n,t,e){if(!Wm(n))return;const i=t[n],s=e[n];Q(i)&&Q(s)?ks(i,s):Object.prototype.hasOwnProperty.call(t,n)||(t[n]=Do(s))}const tf={"":n=>n,x:n=>n.x,y:n=>n.y};function FI(n){const t=n.split("."),e=[];let i="";for(const s of t)i+=s,i.endsWith("\\")?i=i.slice(0,-1)+".":(e.push(i),i="");return e}function BI(n){const t=FI(n);return e=>{for(const i of t){if(i==="")break;e=e&&e[i]}return e}}function kn(n,t){return(tf[t]||(tf[t]=BI(t)))(n)}function fu(n){return n.charAt(0).toUpperCase()+n.slice(1)}const Bs=n=>typeof n<"u",In=n=>typeof n=="function",ef=(n,t)=>{if(n.size!==t.size)return!1;for(const e of n)if(!t.has(e))return!1;return!0};function UI(n){return n.type==="mouseup"||n.type==="click"||n.type==="contextmenu"}const it=Math.PI,dt=2*it,jI=dt+it,Mo=Number.POSITIVE_INFINITY,zI=it/180,Et=it/2,Dn=it/4,nf=it*2/3,ln=Math.log10,ke=Math.sign;function Is(n,t,e){return Math.abs(n-t)<e}function sf(n){const t=Math.round(n);n=Is(n,t,n/1e3)?t:n;const e=Math.pow(10,Math.floor(ln(n))),i=n/e;return(i<=1?1:i<=2?2:i<=5?5:10)*e}function $I(n){const t=[],e=Math.sqrt(n);let i;for(i=1;i<e;i++)n%i===0&&(t.push(i),t.push(n/i));return e===(e|0)&&t.push(e),t.sort((s,r)=>s-r).pop(),t}function HI(n){return typeof n=="symbol"||typeof n=="object"&&n!==null&&!(Symbol.toPrimitive in n||"toString"in n||"valueOf"in n)}function Ci(n){return!HI(n)&&!isNaN(parseFloat(n))&&isFinite(n)}function WI(n,t){const e=Math.round(n);return e-t<=n&&e+t>=n}function qm(n,t,e){let i,s,r;for(i=0,s=n.length;i<s;i++)r=n[i][e],isNaN(r)||(t.min=Math.min(t.min,r),t.max=Math.max(t.max,r))}function de(n){return n*(it/180)}function gu(n){return n*(180/it)}function rf(n){if(!wt(n))return;let t=1,e=0;for(;Math.round(n*t)/t!==n;)t*=10,e++;return e}function Km(n,t){const e=t.x-n.x,i=t.y-n.y,s=Math.sqrt(e*e+i*i);let r=Math.atan2(i,e);return r<-.5*it&&(r+=dt),{angle:r,distance:s}}function Ul(n,t){return Math.sqrt(Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2))}function qI(n,t){return(n-t+jI)%dt-it}function Ht(n){return(n%dt+dt)%dt}function Us(n,t,e,i){const s=Ht(n),r=Ht(t),o=Ht(e),a=Ht(r-s),l=Ht(o-s),u=Ht(s-r),h=Ht(s-o);return s===r||s===o||i&&r===o||a>l&&u<h}function Rt(n,t,e){return Math.max(t,Math.min(e,n))}function KI(n){return Rt(n,-32768,32767)}function Ue(n,t,e,i=1e-6){return n>=Math.min(t,e)-i&&n<=Math.max(t,e)+i}function pu(n,t,e){e=e||(o=>n[o]<t);let i=n.length-1,s=0,r;for(;i-s>1;)r=s+i>>1,e(r)?s=r:i=r;return{lo:s,hi:i}}const je=(n,t,e,i)=>pu(n,e,i?s=>{const r=n[s][t];return r<e||r===e&&n[s+1][t]===e}:s=>n[s][t]<e),GI=(n,t,e)=>pu(n,e,i=>n[i][t]>=e);function YI(n,t,e){let i=0,s=n.length;for(;i<s&&n[i]<t;)i++;for(;s>i&&n[s-1]>e;)s--;return i>0||s<n.length?n.slice(i,s):n}const Gm=["push","pop","shift","splice","unshift"];function QI(n,t){if(n._chartjs){n._chartjs.listeners.push(t);return}Object.defineProperty(n,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),Gm.forEach(e=>{const i="_onData"+fu(e),s=n[e];Object.defineProperty(n,e,{configurable:!0,enumerable:!1,value(...r){const o=s.apply(this,r);return n._chartjs.listeners.forEach(a=>{typeof a[i]=="function"&&a[i](...r)}),o}})})}function of(n,t){const e=n._chartjs;if(!e)return;const i=e.listeners,s=i.indexOf(t);s!==-1&&i.splice(s,1),!(i.length>0)&&(Gm.forEach(r=>{delete n[r]}),delete n._chartjs)}function Ym(n){const t=new Set(n);return t.size===n.length?n:Array.from(t)}const Qm=function(){return typeof window>"u"?function(n){return n()}:window.requestAnimationFrame}();function Xm(n,t){let e=[],i=!1;return function(...s){e=s,i||(i=!0,Qm.call(window,()=>{i=!1,n.apply(t,e)}))}}function XI(n,t){let e;return function(...i){return t?(clearTimeout(e),e=setTimeout(n,t,i)):n.apply(this,i),t}}const mu=n=>n==="start"?"left":n==="end"?"right":"center",zt=(n,t,e)=>n==="start"?t:n==="end"?e:(t+e)/2,JI=(n,t,e,i)=>n===(i?"left":"right")?e:n==="center"?(t+e)/2:t;function Jm(n,t,e){const i=t.length;let s=0,r=i;if(n._sorted){const{iScale:o,vScale:a,_parsed:l}=n,u=n.dataset&&n.dataset.options?n.dataset.options.spanGaps:null,h=o.axis,{min:d,max:g,minDefined:m,maxDefined:y}=o.getUserBounds();if(m){if(s=Math.min(je(l,h,d).lo,e?i:je(t,h,o.getPixelForValue(d)).lo),u){const v=l.slice(0,s+1).reverse().findIndex(w=>!G(w[a.axis]));s-=Math.max(0,v)}s=Rt(s,0,i-1)}if(y){let v=Math.max(je(l,o.axis,g,!0).hi+1,e?0:je(t,h,o.getPixelForValue(g),!0).hi+1);if(u){const w=l.slice(v-1).findIndex(A=>!G(A[a.axis]));v+=Math.max(0,w)}r=Rt(v,s,i)-s}else r=i-s}return{start:s,count:r}}function Zm(n){const{xScale:t,yScale:e,_scaleRanges:i}=n,s={xmin:t.min,xmax:t.max,ymin:e.min,ymax:e.max};if(!i)return n._scaleRanges=s,!0;const r=i.xmin!==t.min||i.xmax!==t.max||i.ymin!==e.min||i.ymax!==e.max;return Object.assign(i,s),r}const Or=n=>n===0||n===1,af=(n,t,e)=>-(Math.pow(2,10*(n-=1))*Math.sin((n-t)*dt/e)),lf=(n,t,e)=>Math.pow(2,-10*n)*Math.sin((n-t)*dt/e)+1,Ts={linear:n=>n,easeInQuad:n=>n*n,easeOutQuad:n=>-n*(n-2),easeInOutQuad:n=>(n/=.5)<1?.5*n*n:-.5*(--n*(n-2)-1),easeInCubic:n=>n*n*n,easeOutCubic:n=>(n-=1)*n*n+1,easeInOutCubic:n=>(n/=.5)<1?.5*n*n*n:.5*((n-=2)*n*n+2),easeInQuart:n=>n*n*n*n,easeOutQuart:n=>-((n-=1)*n*n*n-1),easeInOutQuart:n=>(n/=.5)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2),easeInQuint:n=>n*n*n*n*n,easeOutQuint:n=>(n-=1)*n*n*n*n+1,easeInOutQuint:n=>(n/=.5)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2),easeInSine:n=>-Math.cos(n*Et)+1,easeOutSine:n=>Math.sin(n*Et),easeInOutSine:n=>-.5*(Math.cos(it*n)-1),easeInExpo:n=>n===0?0:Math.pow(2,10*(n-1)),easeOutExpo:n=>n===1?1:-Math.pow(2,-10*n)+1,easeInOutExpo:n=>Or(n)?n:n<.5?.5*Math.pow(2,10*(n*2-1)):.5*(-Math.pow(2,-10*(n*2-1))+2),easeInCirc:n=>n>=1?n:-(Math.sqrt(1-n*n)-1),easeOutCirc:n=>Math.sqrt(1-(n-=1)*n),easeInOutCirc:n=>(n/=.5)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1),easeInElastic:n=>Or(n)?n:af(n,.075,.3),easeOutElastic:n=>Or(n)?n:lf(n,.075,.3),easeInOutElastic(n){return Or(n)?n:n<.5?.5*af(n*2,.1125,.45):.5+.5*lf(n*2-1,.1125,.45)},easeInBack(n){return n*n*((1.70158+1)*n-1.70158)},easeOutBack(n){return(n-=1)*n*((1.70158+1)*n+1.70158)+1},easeInOutBack(n){let t=1.70158;return(n/=.5)<1?.5*(n*n*(((t*=1.525)+1)*n-t)):.5*((n-=2)*n*(((t*=1.525)+1)*n+t)+2)},easeInBounce:n=>1-Ts.easeOutBounce(1-n),easeOutBounce(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},easeInOutBounce:n=>n<.5?Ts.easeInBounce(n*2)*.5:Ts.easeOutBounce(n*2-1)*.5+.5};function yu(n){if(n&&typeof n=="object"){const t=n.toString();return t==="[object CanvasPattern]"||t==="[object CanvasGradient]"}return!1}function cf(n){return yu(n)?n:new Ns(n)}function Xa(n){return yu(n)?n:new Ns(n).saturate(.5).darken(.1).hexString()}const ZI=["x","y","borderWidth","radius","tension"],tT=["color","borderColor","backgroundColor"];function eT(n){n.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),n.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>t!=="onProgress"&&t!=="onComplete"&&t!=="fn"}),n.set("animations",{colors:{type:"color",properties:tT},numbers:{type:"number",properties:ZI}}),n.describe("animations",{_fallback:"animation"}),n.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>t|0}}}})}function nT(n){n.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})}const uf=new Map;function iT(n,t){t=t||{};const e=n+JSON.stringify(t);let i=uf.get(e);return i||(i=new Intl.NumberFormat(n,t),uf.set(e,i)),i}function or(n,t,e){return iT(t,e).format(n)}const t0={values(n){return ft(n)?n:""+n},numeric(n,t,e){if(n===0)return"0";const i=this.chart.options.locale;let s,r=n;if(e.length>1){const u=Math.max(Math.abs(e[0].value),Math.abs(e[e.length-1].value));(u<1e-4||u>1e15)&&(s="scientific"),r=sT(n,e)}const o=ln(Math.abs(r)),a=isNaN(o)?1:Math.max(Math.min(-1*Math.floor(o),20),0),l={notation:s,minimumFractionDigits:a,maximumFractionDigits:a};return Object.assign(l,this.options.ticks.format),or(n,i,l)},logarithmic(n,t,e){if(n===0)return"0";const i=e[t].significand||n/Math.pow(10,Math.floor(ln(n)));return[1,2,3,5,10,15].includes(i)||t>.8*e.length?t0.numeric.call(this,n,t,e):""}};function sT(n,t){let e=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;return Math.abs(e)>=1&&n!==Math.floor(n)&&(e=n-Math.floor(n)),e}var oa={formatters:t0};function rT(n){n.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:oa.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),n.route("scale.ticks","color","","color"),n.route("scale.grid","color","","borderColor"),n.route("scale.border","color","","borderColor"),n.route("scale.title","color","","color"),n.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&t!=="callback"&&t!=="parser",_indexable:t=>t!=="borderDash"&&t!=="tickBorderDash"&&t!=="dash"}),n.describe("scales",{_fallback:"scale"}),n.describe("scale.ticks",{_scriptable:t=>t!=="backdropPadding"&&t!=="callback",_indexable:t=>t!=="backdropPadding"})}const Yn=Object.create(null),jl=Object.create(null);function As(n,t){if(!t)return n;const e=t.split(".");for(let i=0,s=e.length;i<s;++i){const r=e[i];n=n[r]||(n[r]=Object.create(null))}return n}function Ja(n,t,e){return typeof t=="string"?Fs(As(n,t),e):Fs(As(n,""),t)}class oT{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=i=>i.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(i,s)=>Xa(s.backgroundColor),this.hoverBorderColor=(i,s)=>Xa(s.borderColor),this.hoverColor=(i,s)=>Xa(s.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return Ja(this,t,e)}get(t){return As(this,t)}describe(t,e){return Ja(jl,t,e)}override(t,e){return Ja(Yn,t,e)}route(t,e,i,s){const r=As(this,t),o=As(this,i),a="_"+e;Object.defineProperties(r,{[a]:{value:r[e],writable:!0},[e]:{enumerable:!0,get(){const l=this[a],u=o[s];return Q(l)?Object.assign({},u,l):q(l,u)},set(l){this[a]=l}}})}apply(t){t.forEach(e=>e(this))}}var gt=new oT({_scriptable:n=>!n.startsWith("on"),_indexable:n=>n!=="events",hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[eT,nT,rT]);function aT(n){return!n||G(n.size)||G(n.family)?null:(n.style?n.style+" ":"")+(n.weight?n.weight+" ":"")+n.size+"px "+n.family}function Lo(n,t,e,i,s){let r=t[s];return r||(r=t[s]=n.measureText(s).width,e.push(s)),r>i&&(i=r),i}function lT(n,t,e,i){i=i||{};let s=i.data=i.data||{},r=i.garbageCollect=i.garbageCollect||[];i.font!==t&&(s=i.data={},r=i.garbageCollect=[],i.font=t),n.save(),n.font=t;let o=0;const a=e.length;let l,u,h,d,g;for(l=0;l<a;l++)if(d=e[l],d!=null&&!ft(d))o=Lo(n,s,r,o,d);else if(ft(d))for(u=0,h=d.length;u<h;u++)g=d[u],g!=null&&!ft(g)&&(o=Lo(n,s,r,o,g));n.restore();const m=r.length/2;if(m>e.length){for(l=0;l<m;l++)delete s[r[l]];r.splice(0,m)}return o}function Mn(n,t,e){const i=n.currentDevicePixelRatio,s=e!==0?Math.max(e/2,.5):0;return Math.round((t-s)*i)/i+s}function hf(n,t){!t&&!n||(t=t||n.getContext("2d"),t.save(),t.resetTransform(),t.clearRect(0,0,n.width,n.height),t.restore())}function zl(n,t,e,i){e0(n,t,e,i,null)}function e0(n,t,e,i,s){let r,o,a,l,u,h,d,g;const m=t.pointStyle,y=t.rotation,v=t.radius;let w=(y||0)*zI;if(m&&typeof m=="object"&&(r=m.toString(),r==="[object HTMLImageElement]"||r==="[object HTMLCanvasElement]")){n.save(),n.translate(e,i),n.rotate(w),n.drawImage(m,-m.width/2,-m.height/2,m.width,m.height),n.restore();return}if(!(isNaN(v)||v<=0)){switch(n.beginPath(),m){default:s?n.ellipse(e,i,s/2,v,0,0,dt):n.arc(e,i,v,0,dt),n.closePath();break;case"triangle":h=s?s/2:v,n.moveTo(e+Math.sin(w)*h,i-Math.cos(w)*v),w+=nf,n.lineTo(e+Math.sin(w)*h,i-Math.cos(w)*v),w+=nf,n.lineTo(e+Math.sin(w)*h,i-Math.cos(w)*v),n.closePath();break;case"rectRounded":u=v*.516,l=v-u,o=Math.cos(w+Dn)*l,d=Math.cos(w+Dn)*(s?s/2-u:l),a=Math.sin(w+Dn)*l,g=Math.sin(w+Dn)*(s?s/2-u:l),n.arc(e-d,i-a,u,w-it,w-Et),n.arc(e+g,i-o,u,w-Et,w),n.arc(e+d,i+a,u,w,w+Et),n.arc(e-g,i+o,u,w+Et,w+it),n.closePath();break;case"rect":if(!y){l=Math.SQRT1_2*v,h=s?s/2:l,n.rect(e-h,i-l,2*h,2*l);break}w+=Dn;case"rectRot":d=Math.cos(w)*(s?s/2:v),o=Math.cos(w)*v,a=Math.sin(w)*v,g=Math.sin(w)*(s?s/2:v),n.moveTo(e-d,i-a),n.lineTo(e+g,i-o),n.lineTo(e+d,i+a),n.lineTo(e-g,i+o),n.closePath();break;case"crossRot":w+=Dn;case"cross":d=Math.cos(w)*(s?s/2:v),o=Math.cos(w)*v,a=Math.sin(w)*v,g=Math.sin(w)*(s?s/2:v),n.moveTo(e-d,i-a),n.lineTo(e+d,i+a),n.moveTo(e+g,i-o),n.lineTo(e-g,i+o);break;case"star":d=Math.cos(w)*(s?s/2:v),o=Math.cos(w)*v,a=Math.sin(w)*v,g=Math.sin(w)*(s?s/2:v),n.moveTo(e-d,i-a),n.lineTo(e+d,i+a),n.moveTo(e+g,i-o),n.lineTo(e-g,i+o),w+=Dn,d=Math.cos(w)*(s?s/2:v),o=Math.cos(w)*v,a=Math.sin(w)*v,g=Math.sin(w)*(s?s/2:v),n.moveTo(e-d,i-a),n.lineTo(e+d,i+a),n.moveTo(e+g,i-o),n.lineTo(e-g,i+o);break;case"line":o=s?s/2:Math.cos(w)*v,a=Math.sin(w)*v,n.moveTo(e-o,i-a),n.lineTo(e+o,i+a);break;case"dash":n.moveTo(e,i),n.lineTo(e+Math.cos(w)*(s?s/2:v),i+Math.sin(w)*v);break;case!1:n.closePath();break}n.fill(),t.borderWidth>0&&n.stroke()}}function ze(n,t,e){return e=e||.5,!t||n&&n.x>t.left-e&&n.x<t.right+e&&n.y>t.top-e&&n.y<t.bottom+e}function aa(n,t){n.save(),n.beginPath(),n.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),n.clip()}function la(n){n.restore()}function cT(n,t,e,i,s){if(!t)return n.lineTo(e.x,e.y);if(s==="middle"){const r=(t.x+e.x)/2;n.lineTo(r,t.y),n.lineTo(r,e.y)}else s==="after"!=!!i?n.lineTo(t.x,e.y):n.lineTo(e.x,t.y);n.lineTo(e.x,e.y)}function uT(n,t,e,i){if(!t)return n.lineTo(e.x,e.y);n.bezierCurveTo(i?t.cp1x:t.cp2x,i?t.cp1y:t.cp2y,i?e.cp2x:e.cp1x,i?e.cp2y:e.cp1y,e.x,e.y)}function hT(n,t){t.translation&&n.translate(t.translation[0],t.translation[1]),G(t.rotation)||n.rotate(t.rotation),t.color&&(n.fillStyle=t.color),t.textAlign&&(n.textAlign=t.textAlign),t.textBaseline&&(n.textBaseline=t.textBaseline)}function dT(n,t,e,i,s){if(s.strikethrough||s.underline){const r=n.measureText(i),o=t-r.actualBoundingBoxLeft,a=t+r.actualBoundingBoxRight,l=e-r.actualBoundingBoxAscent,u=e+r.actualBoundingBoxDescent,h=s.strikethrough?(l+u)/2:u;n.strokeStyle=n.fillStyle,n.beginPath(),n.lineWidth=s.decorationWidth||2,n.moveTo(o,h),n.lineTo(a,h),n.stroke()}}function fT(n,t){const e=n.fillStyle;n.fillStyle=t.color,n.fillRect(t.left,t.top,t.width,t.height),n.fillStyle=e}function Qn(n,t,e,i,s,r={}){const o=ft(t)?t:[t],a=r.strokeWidth>0&&r.strokeColor!=="";let l,u;for(n.save(),n.font=s.string,hT(n,r),l=0;l<o.length;++l)u=o[l],r.backdrop&&fT(n,r.backdrop),a&&(r.strokeColor&&(n.strokeStyle=r.strokeColor),G(r.strokeWidth)||(n.lineWidth=r.strokeWidth),n.strokeText(u,e,i,r.maxWidth)),n.fillText(u,e,i,r.maxWidth),dT(n,e,i,u,r),i+=Number(s.lineHeight);n.restore()}function js(n,t){const{x:e,y:i,w:s,h:r,radius:o}=t;n.arc(e+o.topLeft,i+o.topLeft,o.topLeft,1.5*it,it,!0),n.lineTo(e,i+r-o.bottomLeft),n.arc(e+o.bottomLeft,i+r-o.bottomLeft,o.bottomLeft,it,Et,!0),n.lineTo(e+s-o.bottomRight,i+r),n.arc(e+s-o.bottomRight,i+r-o.bottomRight,o.bottomRight,Et,0,!0),n.lineTo(e+s,i+o.topRight),n.arc(e+s-o.topRight,i+o.topRight,o.topRight,0,-Et,!0),n.lineTo(e+o.topLeft,i)}const gT=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,pT=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function mT(n,t){const e=(""+n).match(gT);if(!e||e[1]==="normal")return t*1.2;switch(n=+e[2],e[3]){case"px":return n;case"%":n/=100;break}return t*n}const yT=n=>+n||0;function _u(n,t){const e={},i=Q(t),s=i?Object.keys(t):t,r=Q(n)?i?o=>q(n[o],n[t[o]]):o=>n[o]:()=>n;for(const o of s)e[o]=yT(r(o));return e}function n0(n){return _u(n,{top:"y",right:"x",bottom:"y",left:"x"})}function $n(n){return _u(n,["topLeft","topRight","bottomLeft","bottomRight"])}function Gt(n){const t=n0(n);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function St(n,t){n=n||{},t=t||gt.font;let e=q(n.size,t.size);typeof e=="string"&&(e=parseInt(e,10));let i=q(n.style,t.style);i&&!(""+i).match(pT)&&(console.warn('Invalid font style specified: "'+i+'"'),i=void 0);const s={family:q(n.family,t.family),lineHeight:mT(q(n.lineHeight,t.lineHeight),e),size:e,style:i,weight:q(n.weight,t.weight),string:""};return s.string=aT(s),s}function gs(n,t,e,i){let s,r,o;for(s=0,r=n.length;s<r;++s)if(o=n[s],o!==void 0&&o!==void 0)return o}function _T(n,t,e){const{min:i,max:s}=n,r=Hm(t,(s-i)/2),o=(a,l)=>e&&a===0?0:a+l;return{min:o(i,-Math.abs(r)),max:o(s,r)}}function An(n,t){return Object.assign(Object.create(n),t)}function bu(n,t=[""],e,i,s=()=>n[0]){const r=e||n;typeof i>"u"&&(i=o0("_fallback",n));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:n,_rootScopes:r,_fallback:i,_getTarget:s,override:a=>bu([a,...n],t,r,i)};return new Proxy(o,{deleteProperty(a,l){return delete a[l],delete a._keys,delete n[0][l],!0},get(a,l){return s0(a,l,()=>TT(l,t,n,a))},getOwnPropertyDescriptor(a,l){return Reflect.getOwnPropertyDescriptor(a._scopes[0],l)},getPrototypeOf(){return Reflect.getPrototypeOf(n[0])},has(a,l){return ff(a).includes(l)},ownKeys(a){return ff(a)},set(a,l,u){const h=a._storage||(a._storage=s());return a[l]=h[l]=u,delete a._keys,!0}})}function Di(n,t,e,i){const s={_cacheable:!1,_proxy:n,_context:t,_subProxy:e,_stack:new Set,_descriptors:i0(n,i),setContext:r=>Di(n,r,e,i),override:r=>Di(n.override(r),t,e,i)};return new Proxy(s,{deleteProperty(r,o){return delete r[o],delete n[o],!0},get(r,o,a){return s0(r,o,()=>vT(r,o,a))},getOwnPropertyDescriptor(r,o){return r._descriptors.allKeys?Reflect.has(n,o)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(n,o)},getPrototypeOf(){return Reflect.getPrototypeOf(n)},has(r,o){return Reflect.has(n,o)},ownKeys(){return Reflect.ownKeys(n)},set(r,o,a){return n[o]=a,delete r[o],!0}})}function i0(n,t={scriptable:!0,indexable:!0}){const{_scriptable:e=t.scriptable,_indexable:i=t.indexable,_allKeys:s=t.allKeys}=n;return{allKeys:s,scriptable:e,indexable:i,isScriptable:In(e)?e:()=>e,isIndexable:In(i)?i:()=>i}}const bT=(n,t)=>n?n+fu(t):t,vu=(n,t)=>Q(t)&&n!=="adapters"&&(Object.getPrototypeOf(t)===null||t.constructor===Object);function s0(n,t,e){if(Object.prototype.hasOwnProperty.call(n,t)||t==="constructor")return n[t];const i=e();return n[t]=i,i}function vT(n,t,e){const{_proxy:i,_context:s,_subProxy:r,_descriptors:o}=n;let a=i[t];return In(a)&&o.isScriptable(t)&&(a=wT(t,a,n,e)),ft(a)&&a.length&&(a=xT(t,a,n,o.isIndexable)),vu(t,a)&&(a=Di(a,s,r&&r[t],o)),a}function wT(n,t,e,i){const{_proxy:s,_context:r,_subProxy:o,_stack:a}=e;if(a.has(n))throw new Error("Recursion detected: "+Array.from(a).join("->")+"->"+n);a.add(n);let l=t(r,o||i);return a.delete(n),vu(n,l)&&(l=wu(s._scopes,s,n,l)),l}function xT(n,t,e,i){const{_proxy:s,_context:r,_subProxy:o,_descriptors:a}=e;if(typeof r.index<"u"&&i(n))return t[r.index%t.length];if(Q(t[0])){const l=t,u=s._scopes.filter(h=>h!==l);t=[];for(const h of l){const d=wu(u,s,n,h);t.push(Di(d,r,o&&o[n],a))}}return t}function r0(n,t,e){return In(n)?n(t,e):n}const ET=(n,t)=>n===!0?t:typeof n=="string"?kn(t,n):void 0;function kT(n,t,e,i,s){for(const r of t){const o=ET(e,r);if(o){n.add(o);const a=r0(o._fallback,e,s);if(typeof a<"u"&&a!==e&&a!==i)return a}else if(o===!1&&typeof i<"u"&&e!==i)return null}return!1}function wu(n,t,e,i){const s=t._rootScopes,r=r0(t._fallback,e,i),o=[...n,...s],a=new Set;a.add(i);let l=df(a,o,e,r||e,i);return l===null||typeof r<"u"&&r!==e&&(l=df(a,o,r,l,i),l===null)?!1:bu(Array.from(a),[""],s,r,()=>IT(t,e,i))}function df(n,t,e,i,s){for(;e;)e=kT(n,t,e,i,s);return e}function IT(n,t,e){const i=n._getTarget();t in i||(i[t]={});const s=i[t];return ft(s)&&Q(e)?e:s||{}}function TT(n,t,e,i){let s;for(const r of t)if(s=o0(bT(r,n),e),typeof s<"u")return vu(n,s)?wu(e,i,n,s):s}function o0(n,t){for(const e of t){if(!e)continue;const i=e[n];if(typeof i<"u")return i}}function ff(n){let t=n._keys;return t||(t=n._keys=AT(n._scopes)),t}function AT(n){const t=new Set;for(const e of n)for(const i of Object.keys(e).filter(s=>!s.startsWith("_")))t.add(i);return Array.from(t)}function a0(n,t,e,i){const{iScale:s}=n,{key:r="r"}=this._parsing,o=new Array(i);let a,l,u,h;for(a=0,l=i;a<l;++a)u=a+e,h=t[u],o[a]={r:s.parse(kn(h,r),u)};return o}const ST=Number.EPSILON||1e-14,Mi=(n,t)=>t<n.length&&!n[t].skip&&n[t],l0=n=>n==="x"?"y":"x";function PT(n,t,e,i){const s=n.skip?t:n,r=t,o=e.skip?t:e,a=Ul(r,s),l=Ul(o,r);let u=a/(a+l),h=l/(a+l);u=isNaN(u)?0:u,h=isNaN(h)?0:h;const d=i*u,g=i*h;return{previous:{x:r.x-d*(o.x-s.x),y:r.y-d*(o.y-s.y)},next:{x:r.x+g*(o.x-s.x),y:r.y+g*(o.y-s.y)}}}function RT(n,t,e){const i=n.length;let s,r,o,a,l,u=Mi(n,0);for(let h=0;h<i-1;++h)if(l=u,u=Mi(n,h+1),!(!l||!u)){if(Is(t[h],0,ST)){e[h]=e[h+1]=0;continue}s=e[h]/t[h],r=e[h+1]/t[h],a=Math.pow(s,2)+Math.pow(r,2),!(a<=9)&&(o=3/Math.sqrt(a),e[h]=s*o*t[h],e[h+1]=r*o*t[h])}}function CT(n,t,e="x"){const i=l0(e),s=n.length;let r,o,a,l=Mi(n,0);for(let u=0;u<s;++u){if(o=a,a=l,l=Mi(n,u+1),!a)continue;const h=a[e],d=a[i];o&&(r=(h-o[e])/3,a[`cp1${e}`]=h-r,a[`cp1${i}`]=d-r*t[u]),l&&(r=(l[e]-h)/3,a[`cp2${e}`]=h+r,a[`cp2${i}`]=d+r*t[u])}}function DT(n,t="x"){const e=l0(t),i=n.length,s=Array(i).fill(0),r=Array(i);let o,a,l,u=Mi(n,0);for(o=0;o<i;++o)if(a=l,l=u,u=Mi(n,o+1),!!l){if(u){const h=u[t]-l[t];s[o]=h!==0?(u[e]-l[e])/h:0}r[o]=a?u?ke(s[o-1])!==ke(s[o])?0:(s[o-1]+s[o])/2:s[o-1]:s[o]}RT(n,s,r),CT(n,r,t)}function Vr(n,t,e){return Math.max(Math.min(n,e),t)}function MT(n,t){let e,i,s,r,o,a=ze(n[0],t);for(e=0,i=n.length;e<i;++e)o=r,r=a,a=e<i-1&&ze(n[e+1],t),r&&(s=n[e],o&&(s.cp1x=Vr(s.cp1x,t.left,t.right),s.cp1y=Vr(s.cp1y,t.top,t.bottom)),a&&(s.cp2x=Vr(s.cp2x,t.left,t.right),s.cp2y=Vr(s.cp2y,t.top,t.bottom)))}function LT(n,t,e,i,s){let r,o,a,l;if(t.spanGaps&&(n=n.filter(u=>!u.skip)),t.cubicInterpolationMode==="monotone")DT(n,s);else{let u=i?n[n.length-1]:n[0];for(r=0,o=n.length;r<o;++r)a=n[r],l=PT(u,a,n[Math.min(r+1,o-(i?0:1))%o],t.tension),a.cp1x=l.previous.x,a.cp1y=l.previous.y,a.cp2x=l.next.x,a.cp2y=l.next.y,u=a}t.capBezierPoints&&MT(n,e)}function xu(){return typeof window<"u"&&typeof document<"u"}function Eu(n){let t=n.parentNode;return t&&t.toString()==="[object ShadowRoot]"&&(t=t.host),t}function Oo(n,t,e){let i;return typeof n=="string"?(i=parseInt(n,10),n.indexOf("%")!==-1&&(i=i/100*t.parentNode[e])):i=n,i}const ca=n=>n.ownerDocument.defaultView.getComputedStyle(n,null);function OT(n,t){return ca(n).getPropertyValue(t)}const VT=["top","right","bottom","left"];function Hn(n,t,e){const i={};e=e?"-"+e:"";for(let s=0;s<4;s++){const r=VT[s];i[r]=parseFloat(n[t+"-"+r+e])||0}return i.width=i.left+i.right,i.height=i.top+i.bottom,i}const NT=(n,t,e)=>(n>0||t>0)&&(!e||!e.shadowRoot);function FT(n,t){const e=n.touches,i=e&&e.length?e[0]:n,{offsetX:s,offsetY:r}=i;let o=!1,a,l;if(NT(s,r,n.target))a=s,l=r;else{const u=t.getBoundingClientRect();a=i.clientX-u.left,l=i.clientY-u.top,o=!0}return{x:a,y:l,box:o}}function Nn(n,t){if("native"in n)return n;const{canvas:e,currentDevicePixelRatio:i}=t,s=ca(e),r=s.boxSizing==="border-box",o=Hn(s,"padding"),a=Hn(s,"border","width"),{x:l,y:u,box:h}=FT(n,e),d=o.left+(h&&a.left),g=o.top+(h&&a.top);let{width:m,height:y}=t;return r&&(m-=o.width+a.width,y-=o.height+a.height),{x:Math.round((l-d)/m*e.width/i),y:Math.round((u-g)/y*e.height/i)}}function BT(n,t,e){let i,s;if(t===void 0||e===void 0){const r=n&&Eu(n);if(!r)t=n.clientWidth,e=n.clientHeight;else{const o=r.getBoundingClientRect(),a=ca(r),l=Hn(a,"border","width"),u=Hn(a,"padding");t=o.width-u.width-l.width,e=o.height-u.height-l.height,i=Oo(a.maxWidth,r,"clientWidth"),s=Oo(a.maxHeight,r,"clientHeight")}}return{width:t,height:e,maxWidth:i||Mo,maxHeight:s||Mo}}const cn=n=>Math.round(n*10)/10;function UT(n,t,e,i){const s=ca(n),r=Hn(s,"margin"),o=Oo(s.maxWidth,n,"clientWidth")||Mo,a=Oo(s.maxHeight,n,"clientHeight")||Mo,l=BT(n,t,e);let{width:u,height:h}=l;if(s.boxSizing==="content-box"){const g=Hn(s,"border","width"),m=Hn(s,"padding");u-=m.width+g.width,h-=m.height+g.height}return u=Math.max(0,u-r.width),h=Math.max(0,i?u/i:h-r.height),u=cn(Math.min(u,o,l.maxWidth)),h=cn(Math.min(h,a,l.maxHeight)),u&&!h&&(h=cn(u/2)),(t!==void 0||e!==void 0)&&i&&l.height&&h>l.height&&(h=l.height,u=cn(Math.floor(h*i))),{width:u,height:h}}function gf(n,t,e){const i=t||1,s=cn(n.height*i),r=cn(n.width*i);n.height=cn(n.height),n.width=cn(n.width);const o=n.canvas;return o.style&&(e||!o.style.height&&!o.style.width)&&(o.style.height=`${n.height}px`,o.style.width=`${n.width}px`),n.currentDevicePixelRatio!==i||o.height!==s||o.width!==r?(n.currentDevicePixelRatio=i,o.height=s,o.width=r,n.ctx.setTransform(i,0,0,i,0,0),!0):!1}const jT=function(){let n=!1;try{const t={get passive(){return n=!0,!1}};xu()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch{}return n}();function pf(n,t){const e=OT(n,t),i=e&&e.match(/^(\d+)(\.\d+)?px$/);return i?+i[1]:void 0}function Fn(n,t,e,i){return{x:n.x+e*(t.x-n.x),y:n.y+e*(t.y-n.y)}}function zT(n,t,e,i){return{x:n.x+e*(t.x-n.x),y:i==="middle"?e<.5?n.y:t.y:i==="after"?e<1?n.y:t.y:e>0?t.y:n.y}}function $T(n,t,e,i){const s={x:n.cp2x,y:n.cp2y},r={x:t.cp1x,y:t.cp1y},o=Fn(n,s,e),a=Fn(s,r,e),l=Fn(r,t,e),u=Fn(o,a,e),h=Fn(a,l,e);return Fn(u,h,e)}const HT=function(n,t){return{x(e){return n+n+t-e},setWidth(e){t=e},textAlign(e){return e==="center"?e:e==="right"?"left":"right"},xPlus(e,i){return e-i},leftForLtr(e,i){return e-i}}},WT=function(){return{x(n){return n},setWidth(n){},textAlign(n){return n},xPlus(n,t){return n+t},leftForLtr(n,t){return n}}};function bi(n,t,e){return n?HT(t,e):WT()}function c0(n,t){let e,i;(t==="ltr"||t==="rtl")&&(e=n.canvas.style,i=[e.getPropertyValue("direction"),e.getPropertyPriority("direction")],e.setProperty("direction",t,"important"),n.prevTextDirection=i)}function u0(n,t){t!==void 0&&(delete n.prevTextDirection,n.canvas.style.setProperty("direction",t[0],t[1]))}function h0(n){return n==="angle"?{between:Us,compare:qI,normalize:Ht}:{between:Ue,compare:(t,e)=>t-e,normalize:t=>t}}function mf({start:n,end:t,count:e,loop:i,style:s}){return{start:n%e,end:t%e,loop:i&&(t-n+1)%e===0,style:s}}function qT(n,t,e){const{property:i,start:s,end:r}=e,{between:o,normalize:a}=h0(i),l=t.length;let{start:u,end:h,loop:d}=n,g,m;if(d){for(u+=l,h+=l,g=0,m=l;g<m&&o(a(t[u%l][i]),s,r);++g)u--,h--;u%=l,h%=l}return h<u&&(h+=l),{start:u,end:h,loop:d,style:n.style}}function d0(n,t,e){if(!e)return[n];const{property:i,start:s,end:r}=e,o=t.length,{compare:a,between:l,normalize:u}=h0(i),{start:h,end:d,loop:g,style:m}=qT(n,t,e),y=[];let v=!1,w=null,A,R,D;const L=()=>l(s,D,A)&&a(s,D)!==0,M=()=>a(r,A)===0||l(r,D,A),V=()=>v||L(),E=()=>!v||M();for(let b=h,x=h;b<=d;++b)R=t[b%o],!R.skip&&(A=u(R[i]),A!==D&&(v=l(A,s,r),w===null&&V()&&(w=a(A,s)===0?b:x),w!==null&&E()&&(y.push(mf({start:w,end:b,loop:g,count:o,style:m})),w=null),x=b,D=A));return w!==null&&y.push(mf({start:w,end:d,loop:g,count:o,style:m})),y}function f0(n,t){const e=[],i=n.segments;for(let s=0;s<i.length;s++){const r=d0(i[s],n.points,t);r.length&&e.push(...r)}return e}function KT(n,t,e,i){let s=0,r=t-1;if(e&&!i)for(;s<t&&!n[s].skip;)s++;for(;s<t&&n[s].skip;)s++;for(s%=t,e&&(r+=s);r>s&&n[r%t].skip;)r--;return r%=t,{start:s,end:r}}function GT(n,t,e,i){const s=n.length,r=[];let o=t,a=n[t],l;for(l=t+1;l<=e;++l){const u=n[l%s];u.skip||u.stop?a.skip||(i=!1,r.push({start:t%s,end:(l-1)%s,loop:i}),t=o=u.stop?l:null):(o=l,a.skip&&(t=l)),a=u}return o!==null&&r.push({start:t%s,end:o%s,loop:i}),r}function YT(n,t){const e=n.points,i=n.options.spanGaps,s=e.length;if(!s)return[];const r=!!n._loop,{start:o,end:a}=KT(e,s,r,i);if(i===!0)return yf(n,[{start:o,end:a,loop:r}],e,t);const l=a<o?a+s:a,u=!!n._fullLoop&&o===0&&a===s-1;return yf(n,GT(e,o,l,u),e,t)}function yf(n,t,e,i){return!i||!i.setContext||!e?t:QT(n,t,e,i)}function QT(n,t,e,i){const s=n._chart.getContext(),r=_f(n.options),{_datasetIndex:o,options:{spanGaps:a}}=n,l=e.length,u=[];let h=r,d=t[0].start,g=d;function m(y,v,w,A){const R=a?-1:1;if(y!==v){for(y+=l;e[y%l].skip;)y-=R;for(;e[v%l].skip;)v+=R;y%l!==v%l&&(u.push({start:y%l,end:v%l,loop:w,style:A}),h=A,d=v%l)}}for(const y of t){d=a?d:y.start;let v=e[d%l],w;for(g=d+1;g<=y.end;g++){const A=e[g%l];w=_f(i.setContext(An(s,{type:"segment",p0:v,p1:A,p0DataIndex:(g-1)%l,p1DataIndex:g%l,datasetIndex:o}))),XT(w,h)&&m(d,g-1,y.loop,h),v=A,h=w}d<g-1&&m(d,g-1,y.loop,h)}return u}function _f(n){return{backgroundColor:n.backgroundColor,borderCapStyle:n.borderCapStyle,borderDash:n.borderDash,borderDashOffset:n.borderDashOffset,borderJoinStyle:n.borderJoinStyle,borderWidth:n.borderWidth,borderColor:n.borderColor}}function XT(n,t){if(!t)return!1;const e=[],i=function(s,r){return yu(r)?(e.includes(r)||e.push(r),e.indexOf(r)):r};return JSON.stringify(n,i)!==JSON.stringify(t,i)}function Nr(n,t,e){return n.options.clip?n[e]:t[e]}function JT(n,t){const{xScale:e,yScale:i}=n;return e&&i?{left:Nr(e,t,"left"),right:Nr(e,t,"right"),top:Nr(i,t,"top"),bottom:Nr(i,t,"bottom")}:t}function g0(n,t){const e=t._clip;if(e.disabled)return!1;const i=JT(t,n.chartArea);return{left:e.left===!1?0:i.left-(e.left===!0?0:e.left),right:e.right===!1?n.width:i.right+(e.right===!0?0:e.right),top:e.top===!1?0:i.top-(e.top===!0?0:e.top),bottom:e.bottom===!1?n.height:i.bottom+(e.bottom===!0?0:e.bottom)}}/*!
 * Chart.js v4.5.1
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */class ZT{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,s){const r=e.listeners[s],o=e.duration;r.forEach(a=>a({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(i-e.start,o)}))}_refresh(){this._request||(this._running=!0,this._request=Qm.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((i,s)=>{if(!i.running||!i.items.length)return;const r=i.items;let o=r.length-1,a=!1,l;for(;o>=0;--o)l=r[o],l._active?(l._total>i.duration&&(i.duration=l._total),l.tick(t),a=!0):(r[o]=r[r.length-1],r.pop());a&&(s.draw(),this._notify(s,i,t,"progress")),r.length||(i.running=!1,this._notify(s,i,t,"complete"),i.initial=!1),e+=r.length}),this._lastDate=t,e===0&&(this._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){!e||!e.length||this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((i,s)=>Math.max(i,s._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!(!e||!e.running||!e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let s=i.length-1;for(;s>=0;--s)i[s].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var De=new ZT;const bf="transparent",tA={boolean(n,t,e){return e>.5?t:n},color(n,t,e){const i=cf(n||bf),s=i.valid&&cf(t||bf);return s&&s.valid?s.mix(i,e).hexString():t},number(n,t,e){return n+(t-n)*e}};class eA{constructor(t,e,i,s){const r=e[i];s=gs([t.to,s,r,t.from]);const o=gs([t.from,r,s]);this._active=!0,this._fn=t.fn||tA[t.type||typeof o],this._easing=Ts[t.easing]||Ts.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=o,this._to=s,this._promises=void 0}active(){return this._active}update(t,e,i){if(this._active){this._notify(!1);const s=this._target[this._prop],r=i-this._start,o=this._duration-r;this._start=i,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=r,this._loop=!!t.loop,this._to=gs([t.to,e,s,t.from]),this._from=gs([t.from,s,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,i=this._duration,s=this._prop,r=this._from,o=this._loop,a=this._to;let l;if(this._active=r!==a&&(o||e<i),!this._active){this._target[s]=a,this._notify(!0);return}if(e<0){this._target[s]=r;return}l=e/i%2,l=o&&l>1?2-l:l,l=this._easing(Math.min(1,Math.max(0,l))),this._target[s]=this._fn(r,a,l)}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,i)=>{t.push({res:e,rej:i})})}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let s=0;s<i.length;s++)i[s][e]()}}class p0{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!Q(t))return;const e=Object.keys(gt.animation),i=this._properties;Object.getOwnPropertyNames(t).forEach(s=>{const r=t[s];if(!Q(r))return;const o={};for(const a of e)o[a]=r[a];(ft(r.properties)&&r.properties||[s]).forEach(a=>{(a===s||!i.has(a))&&i.set(a,o)})})}_animateOptions(t,e){const i=e.options,s=iA(t,i);if(!s)return[];const r=this._createAnimations(s,i);return i.$shared&&nA(t.options.$animations,i).then(()=>{t.options=i},()=>{}),r}_createAnimations(t,e){const i=this._properties,s=[],r=t.$animations||(t.$animations={}),o=Object.keys(e),a=Date.now();let l;for(l=o.length-1;l>=0;--l){const u=o[l];if(u.charAt(0)==="$")continue;if(u==="options"){s.push(...this._animateOptions(t,e));continue}const h=e[u];let d=r[u];const g=i.get(u);if(d)if(g&&d.active()){d.update(g,h,a);continue}else d.cancel();if(!g||!g.duration){t[u]=h;continue}r[u]=d=new eA(g,t,u,h),s.push(d)}return s}update(t,e){if(this._properties.size===0){Object.assign(t,e);return}const i=this._createAnimations(t,e);if(i.length)return De.add(this._chart,i),!0}}function nA(n,t){const e=[],i=Object.keys(t);for(let s=0;s<i.length;s++){const r=n[i[s]];r&&r.active()&&e.push(r.wait())}return Promise.all(e)}function iA(n,t){if(!t)return;let e=n.options;if(!e){n.options=t;return}return e.$shared&&(n.options=e=Object.assign({},e,{$shared:!1,$animations:{}})),e}function vf(n,t){const e=n&&n.options||{},i=e.reverse,s=e.min===void 0?t:0,r=e.max===void 0?t:0;return{start:i?r:s,end:i?s:r}}function sA(n,t,e){if(e===!1)return!1;const i=vf(n,e),s=vf(t,e);return{top:s.end,right:i.end,bottom:s.start,left:i.start}}function rA(n){let t,e,i,s;return Q(n)?(t=n.top,e=n.right,i=n.bottom,s=n.left):t=e=i=s=n,{top:t,right:e,bottom:i,left:s,disabled:n===!1}}function m0(n,t){const e=[],i=n._getSortedDatasetMetas(t);let s,r;for(s=0,r=i.length;s<r;++s)e.push(i[s].index);return e}function wf(n,t,e,i={}){const s=n.keys,r=i.mode==="single";let o,a,l,u;if(t===null)return;let h=!1;for(o=0,a=s.length;o<a;++o){if(l=+s[o],l===e){if(h=!0,i.all)continue;break}u=n.values[l],wt(u)&&(r||t===0||ke(t)===ke(u))&&(t+=u)}return!h&&!i.all?0:t}function oA(n,t){const{iScale:e,vScale:i}=t,s=e.axis==="x"?"x":"y",r=i.axis==="x"?"x":"y",o=Object.keys(n),a=new Array(o.length);let l,u,h;for(l=0,u=o.length;l<u;++l)h=o[l],a[l]={[s]:h,[r]:n[h]};return a}function Za(n,t){const e=n&&n.options.stacked;return e||e===void 0&&t.stack!==void 0}function aA(n,t,e){return`${n.id}.${t.id}.${e.stack||e.type}`}function lA(n){const{min:t,max:e,minDefined:i,maxDefined:s}=n.getUserBounds();return{min:i?t:Number.NEGATIVE_INFINITY,max:s?e:Number.POSITIVE_INFINITY}}function cA(n,t,e){const i=n[t]||(n[t]={});return i[e]||(i[e]={})}function xf(n,t,e,i){for(const s of t.getMatchingVisibleMetas(i).reverse()){const r=n[s.index];if(e&&r>0||!e&&r<0)return s.index}return null}function Ef(n,t){const{chart:e,_cachedMeta:i}=n,s=e._stacks||(e._stacks={}),{iScale:r,vScale:o,index:a}=i,l=r.axis,u=o.axis,h=aA(r,o,i),d=t.length;let g;for(let m=0;m<d;++m){const y=t[m],{[l]:v,[u]:w}=y,A=y._stacks||(y._stacks={});g=A[u]=cA(s,h,v),g[a]=w,g._top=xf(g,o,!0,i.type),g._bottom=xf(g,o,!1,i.type);const R=g._visualValues||(g._visualValues={});R[a]=w}}function tl(n,t){const e=n.scales;return Object.keys(e).filter(i=>e[i].axis===t).shift()}function uA(n,t){return An(n,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}function hA(n,t,e){return An(n,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:e,index:t,mode:"default",type:"data"})}function es(n,t){const e=n.controller.index,i=n.vScale&&n.vScale.axis;if(i){t=t||n._parsed;for(const s of t){const r=s._stacks;if(!r||r[i]===void 0||r[i][e]===void 0)return;delete r[i][e],r[i]._visualValues!==void 0&&r[i]._visualValues[e]!==void 0&&delete r[i]._visualValues[e]}}}const el=n=>n==="reset"||n==="none",kf=(n,t)=>t?n:Object.assign({},n),dA=(n,t,e)=>n&&!t.hidden&&t._stacked&&{keys:m0(e,!0),values:null};class ge{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=Za(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&es(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,i=this.getDataset(),s=(d,g,m,y)=>d==="x"?g:d==="r"?y:m,r=e.xAxisID=q(i.xAxisID,tl(t,"x")),o=e.yAxisID=q(i.yAxisID,tl(t,"y")),a=e.rAxisID=q(i.rAxisID,tl(t,"r")),l=e.indexAxis,u=e.iAxisID=s(l,r,o,a),h=e.vAxisID=s(l,o,r,a);e.xScale=this.getScaleForId(r),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(a),e.iScale=this.getScaleForId(u),e.vScale=this.getScaleForId(h)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&of(this._data,this),t._stacked&&es(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),i=this._data;if(Q(e)){const s=this._cachedMeta;this._data=oA(e,s)}else if(i!==e){if(i){of(i,this);const s=this._cachedMeta;es(s),s._parsed=[]}e&&Object.isExtensible(e)&&QI(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,i=this.getDataset();let s=!1;this._dataCheck();const r=e._stacked;e._stacked=Za(e.vScale,e),e.stack!==i.stack&&(s=!0,es(e),e.stack=i.stack),this._resyncElements(t),(s||r!==e._stacked)&&(Ef(this,e._parsed),e._stacked=Za(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),i=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(i,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:i,_data:s}=this,{iScale:r,_stacked:o}=i,a=r.axis;let l=t===0&&e===s.length?!0:i._sorted,u=t>0&&i._parsed[t-1],h,d,g;if(this._parsing===!1)i._parsed=s,i._sorted=!0,g=s;else{ft(s[t])?g=this.parseArrayData(i,s,t,e):Q(s[t])?g=this.parseObjectData(i,s,t,e):g=this.parsePrimitiveData(i,s,t,e);const m=()=>d[a]===null||u&&d[a]<u[a];for(h=0;h<e;++h)i._parsed[h+t]=d=g[h],l&&(m()&&(l=!1),u=d);i._sorted=l}o&&Ef(this,g)}parsePrimitiveData(t,e,i,s){const{iScale:r,vScale:o}=t,a=r.axis,l=o.axis,u=r.getLabels(),h=r===o,d=new Array(s);let g,m,y;for(g=0,m=s;g<m;++g)y=g+i,d[g]={[a]:h||r.parse(u[y],y),[l]:o.parse(e[y],y)};return d}parseArrayData(t,e,i,s){const{xScale:r,yScale:o}=t,a=new Array(s);let l,u,h,d;for(l=0,u=s;l<u;++l)h=l+i,d=e[h],a[l]={x:r.parse(d[0],h),y:o.parse(d[1],h)};return a}parseObjectData(t,e,i,s){const{xScale:r,yScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,u=new Array(s);let h,d,g,m;for(h=0,d=s;h<d;++h)g=h+i,m=e[g],u[h]={x:r.parse(kn(m,a),g),y:o.parse(kn(m,l),g)};return u}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const s=this.chart,r=this._cachedMeta,o=e[t.axis],a={keys:m0(s,!0),values:e._stacks[t.axis]._visualValues};return wf(a,o,r.index,{mode:i})}updateRangeFromParsed(t,e,i,s){const r=i[e.axis];let o=r===null?NaN:r;const a=s&&i._stacks[e.axis];s&&a&&(s.values=a,o=wf(s,r,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const i=this._cachedMeta,s=i._parsed,r=i._sorted&&t===i.iScale,o=s.length,a=this._getOtherScale(t),l=dA(e,i,this.chart),u={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:h,max:d}=lA(a);let g,m;function y(){m=s[g];const v=m[a.axis];return!wt(m[t.axis])||h>v||d<v}for(g=0;g<o&&!(!y()&&(this.updateRangeFromParsed(u,t,m,l),r));++g);if(r){for(g=o-1;g>=0;--g)if(!y()){this.updateRangeFromParsed(u,t,m,l);break}}return u}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let s,r,o;for(s=0,r=e.length;s<r;++s)o=e[s][t.axis],wt(o)&&i.push(o);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,s=e.vScale,r=this.getParsed(t);return{label:i?""+i.getLabelForValue(r[i.axis]):"",value:s?""+s.getLabelForValue(r[s.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=rA(q(this.options.clip,sA(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,i=this._cachedMeta,s=i.data||[],r=e.chartArea,o=[],a=this._drawStart||0,l=this._drawCount||s.length-a,u=this.options.drawActiveElementsOnTop;let h;for(i.dataset&&i.dataset.draw(t,r,a,l),h=a;h<a+l;++h){const d=s[h];d.hidden||(d.active&&u?o.push(d):d.draw(t,r))}for(h=0;h<o.length;++h)o[h].draw(t,r)}getStyle(t,e){const i=e?"active":"default";return t===void 0&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const s=this.getDataset();let r;if(t>=0&&t<this._cachedMeta.data.length){const o=this._cachedMeta.data[t];r=o.$context||(o.$context=hA(this.getContext(),t,o)),r.parsed=this.getParsed(t),r.raw=s.data[t],r.index=r.dataIndex=t}else r=this.$context||(this.$context=uA(this.chart.getContext(),this.index)),r.dataset=s,r.index=r.datasetIndex=this.index;return r.active=!!e,r.mode=i,r}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const s=e==="active",r=this._cachedDataOpts,o=t+"-"+e,a=r[o],l=this.enableOptionSharing&&Bs(i);if(a)return kf(a,l);const u=this.chart.config,h=u.datasetElementScopeKeys(this._type,t),d=s?[`${t}Hover`,"hover",t,""]:[t,""],g=u.getOptionScopes(this.getDataset(),h),m=Object.keys(gt.elements[t]),y=()=>this.getContext(i,s,e),v=u.resolveNamedOptions(g,m,y,d);return v.$shared&&(v.$shared=l,r[o]=Object.freeze(kf(v,l))),v}_resolveAnimations(t,e,i){const s=this.chart,r=this._cachedDataOpts,o=`animation-${e}`,a=r[o];if(a)return a;let l;if(s.options.animation!==!1){const h=this.chart.config,d=h.datasetAnimationScopeKeys(this._type,e),g=h.getOptionScopes(this.getDataset(),d);l=h.createResolver(g,this.getContext(t,i,e))}const u=new p0(s,l&&l.animations);return l&&l._cacheable&&(r[o]=Object.freeze(u)),u}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||el(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const i=this.resolveDataElementOptions(t,e),s=this._sharedOptions,r=this.getSharedOptions(i),o=this.includeOptions(e,r)||r!==s;return this.updateSharedOptions(r,e,i),{sharedOptions:r,includeOptions:o}}updateElement(t,e,i,s){el(s)?Object.assign(t,i):this._resolveAnimations(e,s).update(t,i)}updateSharedOptions(t,e,i){t&&!el(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,s){t.active=s;const r=this.getStyle(e,s);this._resolveAnimations(e,i,s).update(t,{options:!s&&this.getSharedOptions(r)||r})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,i=this._cachedMeta.data;for(const[a,l,u]of this._syncList)this[a](l,u);this._syncList=[];const s=i.length,r=e.length,o=Math.min(r,s);o&&this.parse(0,o),r>s?this._insertElements(s,r-s,t):r<s&&this._removeElements(r,s-r)}_insertElements(t,e,i=!0){const s=this._cachedMeta,r=s.data,o=t+e;let a;const l=u=>{for(u.length+=e,a=u.length-1;a>=o;a--)u[a]=u[a-e]};for(l(r),a=t;a<o;++a)r[a]=new this.dataElementType;this._parsing&&l(s._parsed),this.parse(t,e),i&&this.updateElements(r,t,e,"reset")}updateElements(t,e,i,s){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const s=i._parsed.splice(t,e);i._stacked&&es(i,s)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,s]=t;this[e](i,s)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const i=arguments.length-2;i&&this._sync(["_insertElements",t,i])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}B(ge,"defaults",{}),B(ge,"datasetElementType",null),B(ge,"dataElementType",null);function fA(n,t){if(!n._cache.$bar){const e=n.getMatchingVisibleMetas(t);let i=[];for(let s=0,r=e.length;s<r;s++)i=i.concat(e[s].controller.getAllParsedValues(n));n._cache.$bar=Ym(i.sort((s,r)=>s-r))}return n._cache.$bar}function gA(n){const t=n.iScale,e=fA(t,n.type);let i=t._length,s,r,o,a;const l=()=>{o===32767||o===-32768||(Bs(a)&&(i=Math.min(i,Math.abs(o-a)||i)),a=o)};for(s=0,r=e.length;s<r;++s)o=t.getPixelForValue(e[s]),l();for(a=void 0,s=0,r=t.ticks.length;s<r;++s)o=t.getPixelForTick(s),l();return i}function pA(n,t,e,i){const s=e.barThickness;let r,o;return G(s)?(r=t.min*e.categoryPercentage,o=e.barPercentage):(r=s*i,o=1),{chunk:r/i,ratio:o,start:t.pixels[n]-r/2}}function mA(n,t,e,i){const s=t.pixels,r=s[n];let o=n>0?s[n-1]:null,a=n<s.length-1?s[n+1]:null;const l=e.categoryPercentage;o===null&&(o=r-(a===null?t.end-t.start:a-r)),a===null&&(a=r+r-o);const u=r-(r-Math.min(o,a))/2*l;return{chunk:Math.abs(a-o)/2*l/i,ratio:e.barPercentage,start:u}}function yA(n,t,e,i){const s=e.parse(n[0],i),r=e.parse(n[1],i),o=Math.min(s,r),a=Math.max(s,r);let l=o,u=a;Math.abs(o)>Math.abs(a)&&(l=a,u=o),t[e.axis]=u,t._custom={barStart:l,barEnd:u,start:s,end:r,min:o,max:a}}function y0(n,t,e,i){return ft(n)?yA(n,t,e,i):t[e.axis]=e.parse(n,i),t}function If(n,t,e,i){const s=n.iScale,r=n.vScale,o=s.getLabels(),a=s===r,l=[];let u,h,d,g;for(u=e,h=e+i;u<h;++u)g=t[u],d={},d[s.axis]=a||s.parse(o[u],u),l.push(y0(g,d,r,u));return l}function nl(n){return n&&n.barStart!==void 0&&n.barEnd!==void 0}function _A(n,t,e){return n!==0?ke(n):(t.isHorizontal()?1:-1)*(t.min>=e?1:-1)}function bA(n){let t,e,i,s,r;return n.horizontal?(t=n.base>n.x,e="left",i="right"):(t=n.base<n.y,e="bottom",i="top"),t?(s="end",r="start"):(s="start",r="end"),{start:e,end:i,reverse:t,top:s,bottom:r}}function vA(n,t,e,i){let s=t.borderSkipped;const r={};if(!s){n.borderSkipped=r;return}if(s===!0){n.borderSkipped={top:!0,right:!0,bottom:!0,left:!0};return}const{start:o,end:a,reverse:l,top:u,bottom:h}=bA(n);s==="middle"&&e&&(n.enableBorderRadius=!0,(e._top||0)===i?s=u:(e._bottom||0)===i?s=h:(r[Tf(h,o,a,l)]=!0,s=u)),r[Tf(s,o,a,l)]=!0,n.borderSkipped=r}function Tf(n,t,e,i){return i?(n=wA(n,t,e),n=Af(n,e,t)):n=Af(n,t,e),n}function wA(n,t,e){return n===t?e:n===e?t:n}function Af(n,t,e){return n==="start"?t:n==="end"?e:n}function xA(n,{inflateAmount:t},e){n.inflateAmount=t==="auto"?e===1?.33:0:t}class to extends ge{parsePrimitiveData(t,e,i,s){return If(t,e,i,s)}parseArrayData(t,e,i,s){return If(t,e,i,s)}parseObjectData(t,e,i,s){const{iScale:r,vScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,u=r.axis==="x"?a:l,h=o.axis==="x"?a:l,d=[];let g,m,y,v;for(g=i,m=i+s;g<m;++g)v=e[g],y={},y[r.axis]=r.parse(kn(v,u),g),d.push(y0(kn(v,h),y,o,g));return d}updateRangeFromParsed(t,e,i,s){super.updateRangeFromParsed(t,e,i,s);const r=i._custom;r&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,r.min),t.max=Math.max(t.max,r.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:s}=e,r=this.getParsed(t),o=r._custom,a=nl(o)?"["+o.start+", "+o.end+"]":""+s.getLabelForValue(r[s.axis]);return{label:""+i.getLabelForValue(r[i.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();const t=this._cachedMeta;t.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,s){const r=s==="reset",{index:o,_cachedMeta:{vScale:a}}=this,l=a.getBasePixel(),u=a.isHorizontal(),h=this._getRuler(),{sharedOptions:d,includeOptions:g}=this._getSharedOptions(e,s);for(let m=e;m<e+i;m++){const y=this.getParsed(m),v=r||G(y[a.axis])?{base:l,head:l}:this._calculateBarValuePixels(m),w=this._calculateBarIndexPixels(m,h),A=(y._stacks||{})[a.axis],R={horizontal:u,base:v.base,enableBorderRadius:!A||nl(y._custom)||o===A._top||o===A._bottom,x:u?v.head:w.center,y:u?w.center:v.head,height:u?w.size:Math.abs(v.size),width:u?Math.abs(v.size):w.size};g&&(R.options=d||this.resolveDataElementOptions(m,t[m].active?"active":s));const D=R.options||t[m].options;vA(R,D,A,o),xA(R,D,h.ratio),this.updateElement(t[m],m,R,s)}}_getStacks(t,e){const{iScale:i}=this._cachedMeta,s=i.getMatchingVisibleMetas(this._type).filter(h=>h.controller.options.grouped),r=i.options.stacked,o=[],a=this._cachedMeta.controller.getParsed(e),l=a&&a[i.axis],u=h=>{const d=h._parsed.find(m=>m[i.axis]===l),g=d&&d[h.vScale.axis];if(G(g)||isNaN(g))return!0};for(const h of s)if(!(e!==void 0&&u(h))&&((r===!1||o.indexOf(h.stack)===-1||r===void 0&&h.stack===void 0)&&o.push(h.stack),h.index===t))break;return o.length||o.push(void 0),o}_getStackCount(t){return this._getStacks(void 0,t).length}_getAxisCount(){return this._getAxis().length}getFirstScaleIdForIndexAxis(){const t=this.chart.scales,e=this.chart.options.indexAxis;return Object.keys(t).filter(i=>t[i].axis===e).shift()}_getAxis(){const t={},e=this.getFirstScaleIdForIndexAxis();for(const i of this.chart.data.datasets)t[q(this.chart.options.indexAxis==="x"?i.xAxisID:i.yAxisID,e)]=!0;return Object.keys(t)}_getStackIndex(t,e,i){const s=this._getStacks(t,i),r=e!==void 0?s.indexOf(e):-1;return r===-1?s.length-1:r}_getRuler(){const t=this.options,e=this._cachedMeta,i=e.iScale,s=[];let r,o;for(r=0,o=e.data.length;r<o;++r)s.push(i.getPixelForValue(this.getParsed(r)[i.axis],r));const a=t.barThickness;return{min:a||gA(e),pixels:s,start:i._startPixel,end:i._endPixel,stackCount:this._getStackCount(),scale:i,grouped:t.grouped,ratio:a?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:i,index:s},options:{base:r,minBarLength:o}}=this,a=r||0,l=this.getParsed(t),u=l._custom,h=nl(u);let d=l[e.axis],g=0,m=i?this.applyStack(e,l,i):d,y,v;m!==d&&(g=m-d,m=d),h&&(d=u.barStart,m=u.barEnd-u.barStart,d!==0&&ke(d)!==ke(u.barEnd)&&(g=0),g+=d);const w=!G(r)&&!h?r:g;let A=e.getPixelForValue(w);if(this.chart.getDataVisibility(t)?y=e.getPixelForValue(g+m):y=A,v=y-A,Math.abs(v)<o){v=_A(v,e,a)*o,d===a&&(A-=v/2);const R=e.getPixelForDecimal(0),D=e.getPixelForDecimal(1),L=Math.min(R,D),M=Math.max(R,D);A=Math.max(Math.min(A,M),L),y=A+v,i&&!h&&(l._stacks[e.axis]._visualValues[s]=e.getValueForPixel(y)-e.getValueForPixel(A))}if(A===e.getPixelForValue(a)){const R=ke(v)*e.getLineWidthForValue(a)/2;A+=R,v-=R}return{size:v,base:A,head:y,center:y+v/2}}_calculateBarIndexPixels(t,e){const i=e.scale,s=this.options,r=s.skipNull,o=q(s.maxBarThickness,1/0);let a,l;const u=this._getAxisCount();if(e.grouped){const h=r?this._getStackCount(t):e.stackCount,d=s.barThickness==="flex"?mA(t,e,s,h*u):pA(t,e,s,h*u),g=this.chart.options.indexAxis==="x"?this.getDataset().xAxisID:this.getDataset().yAxisID,m=this._getAxis().indexOf(q(g,this.getFirstScaleIdForIndexAxis())),y=this._getStackIndex(this.index,this._cachedMeta.stack,r?t:void 0)+m;a=d.start+d.chunk*y+d.chunk/2,l=Math.min(o,d.chunk*d.ratio)}else a=i.getPixelForValue(this.getParsed(t)[i.axis],t),l=Math.min(o,e.min*e.ratio);return{base:a-l/2,head:a+l/2,center:a,size:l}}draw(){const t=this._cachedMeta,e=t.vScale,i=t.data,s=i.length;let r=0;for(;r<s;++r)this.getParsed(r)[e.axis]!==null&&!i[r].hidden&&i[r].draw(this._ctx)}}B(to,"id","bar"),B(to,"defaults",{datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}}),B(to,"overrides",{scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}});class eo extends ge{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,i,s){const r=super.parsePrimitiveData(t,e,i,s);for(let o=0;o<r.length;o++)r[o]._custom=this.resolveDataElementOptions(o+i).radius;return r}parseArrayData(t,e,i,s){const r=super.parseArrayData(t,e,i,s);for(let o=0;o<r.length;o++){const a=e[i+o];r[o]._custom=q(a[2],this.resolveDataElementOptions(o+i).radius)}return r}parseObjectData(t,e,i,s){const r=super.parseObjectData(t,e,i,s);for(let o=0;o<r.length;o++){const a=e[i+o];r[o]._custom=q(a&&a.r&&+a.r,this.resolveDataElementOptions(o+i).radius)}return r}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let i=t.length-1;i>=0;--i)e=Math.max(e,t[i].size(this.resolveDataElementOptions(i))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),l=r.getLabelForValue(o.y),u=o._custom;return{label:i[t]||"",value:"("+a+", "+l+(u?", "+u:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a}=this._cachedMeta,{sharedOptions:l,includeOptions:u}=this._getSharedOptions(e,s),h=o.axis,d=a.axis;for(let g=e;g<e+i;g++){const m=t[g],y=!r&&this.getParsed(g),v={},w=v[h]=r?o.getPixelForDecimal(.5):o.getPixelForValue(y[h]),A=v[d]=r?a.getBasePixel():a.getPixelForValue(y[d]);v.skip=isNaN(w)||isNaN(A),u&&(v.options=l||this.resolveDataElementOptions(g,m.active?"active":s),r&&(v.options.radius=0)),this.updateElement(m,g,v,s)}}resolveDataElementOptions(t,e){const i=this.getParsed(t);let s=super.resolveDataElementOptions(t,e);s.$shared&&(s=Object.assign({},s,{$shared:!1}));const r=s.radius;return e!=="active"&&(s.radius=0),s.radius+=q(i&&i._custom,r),s}}B(eo,"id","bubble"),B(eo,"defaults",{datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}}),B(eo,"overrides",{scales:{x:{type:"linear"},y:{type:"linear"}}});function EA(n,t,e){let i=1,s=1,r=0,o=0;if(t<dt){const a=n,l=a+t,u=Math.cos(a),h=Math.sin(a),d=Math.cos(l),g=Math.sin(l),m=(D,L,M)=>Us(D,a,l,!0)?1:Math.max(L,L*e,M,M*e),y=(D,L,M)=>Us(D,a,l,!0)?-1:Math.min(L,L*e,M,M*e),v=m(0,u,d),w=m(Et,h,g),A=y(it,u,d),R=y(it+Et,h,g);i=(v-A)/2,s=(w-R)/2,r=-(v+A)/2,o=-(w+R)/2}return{ratioX:i,ratioY:s,offsetX:r,offsetY:o}}class Un extends ge{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,s=this._cachedMeta;if(this._parsing===!1)s._parsed=i;else{let r=l=>+i[l];if(Q(i[t])){const{key:l="value"}=this._parsing;r=u=>+kn(i[u],l)}let o,a;for(o=t,a=t+e;o<a;++o)s._parsed[o]=r(o)}}_getRotation(){return de(this.options.rotation-90)}_getCircumference(){return de(this.options.circumference)}_getRotationExtents(){let t=dt,e=-dt;for(let i=0;i<this.chart.data.datasets.length;++i)if(this.chart.isDatasetVisible(i)&&this.chart.getDatasetMeta(i).type===this._type){const s=this.chart.getDatasetMeta(i).controller,r=s._getRotation(),o=s._getCircumference();t=Math.min(t,r),e=Math.max(e,r+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:i}=e,s=this._cachedMeta,r=s.data,o=this.getMaxBorderWidth()+this.getMaxOffset(r)+this.options.spacing,a=Math.max((Math.min(i.width,i.height)-o)/2,0),l=Math.min(OI(this.options.cutout,a),1),u=this._getRingWeight(this.index),{circumference:h,rotation:d}=this._getRotationExtents(),{ratioX:g,ratioY:m,offsetX:y,offsetY:v}=EA(d,h,l),w=(i.width-o)/g,A=(i.height-o)/m,R=Math.max(Math.min(w,A)/2,0),D=Hm(this.options.radius,R),L=Math.max(D*l,0),M=(D-L)/this._getVisibleDatasetWeightTotal();this.offsetX=y*D,this.offsetY=v*D,s.total=this.calculateTotal(),this.outerRadius=D-M*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-M*u,0),this.updateElements(r,0,r.length,t)}_circumference(t,e){const i=this.options,s=this._cachedMeta,r=this._getCircumference();return e&&i.animation.animateRotate||!this.chart.getDataVisibility(t)||s._parsed[t]===null||s.data[t].hidden?0:this.calculateCircumference(s._parsed[t]*r/dt)}updateElements(t,e,i,s){const r=s==="reset",o=this.chart,a=o.chartArea,u=o.options.animation,h=(a.left+a.right)/2,d=(a.top+a.bottom)/2,g=r&&u.animateScale,m=g?0:this.innerRadius,y=g?0:this.outerRadius,{sharedOptions:v,includeOptions:w}=this._getSharedOptions(e,s);let A=this._getRotation(),R;for(R=0;R<e;++R)A+=this._circumference(R,r);for(R=e;R<e+i;++R){const D=this._circumference(R,r),L=t[R],M={x:h+this.offsetX,y:d+this.offsetY,startAngle:A,endAngle:A+D,circumference:D,outerRadius:y,innerRadius:m};w&&(M.options=v||this.resolveDataElementOptions(R,L.active?"active":s)),A+=D,this.updateElement(L,R,M,s)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let i=0,s;for(s=0;s<e.length;s++){const r=t._parsed[s];r!==null&&!isNaN(r)&&this.chart.getDataVisibility(s)&&!e[s].hidden&&(i+=Math.abs(r))}return i}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?dt*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=or(e._parsed[t],i.options.locale);return{label:s[t]||"",value:r}}getMaxBorderWidth(t){let e=0;const i=this.chart;let s,r,o,a,l;if(!t){for(s=0,r=i.data.datasets.length;s<r;++s)if(i.isDatasetVisible(s)){o=i.getDatasetMeta(s),t=o.data,a=o.controller;break}}if(!t)return 0;for(s=0,r=t.length;s<r;++s)l=a.resolveDataElementOptions(s),l.borderAlign!=="inner"&&(e=Math.max(e,l.borderWidth||0,l.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let i=0,s=t.length;i<s;++i){const r=this.resolveDataElementOptions(i);e=Math.max(e,r.offset||0,r.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(q(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}B(Un,"id","doughnut"),B(Un,"defaults",{datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"}),B(Un,"descriptors",{_scriptable:t=>t!=="spacing",_indexable:t=>t!=="spacing"&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")}),B(Un,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data,{labels:{pointStyle:i,textAlign:s,color:r,useBorderRadius:o,borderRadius:a}}=t.legend.options;return e.labels.length&&e.datasets.length?e.labels.map((l,u)=>{const d=t.getDatasetMeta(0).controller.getStyle(u);return{text:l,fillStyle:d.backgroundColor,fontColor:r,hidden:!t.getDataVisibility(u),lineDash:d.borderDash,lineDashOffset:d.borderDashOffset,lineJoin:d.borderJoinStyle,lineWidth:d.borderWidth,strokeStyle:d.borderColor,textAlign:s,pointStyle:i,borderRadius:o&&(a||d.borderRadius),index:u}}):[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}}});class no extends ge{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:i,data:s=[],_dataset:r}=e,o=this.chart._animationsDisabled;let{start:a,count:l}=Jm(e,s,o);this._drawStart=a,this._drawCount=l,Zm(e)&&(a=0,l=s.length),i._chart=this.chart,i._datasetIndex=this.index,i._decimated=!!r._decimated,i.points=s;const u=this.resolveDatasetElementOptions(t);this.options.showLine||(u.borderWidth=0),u.segment=this.options.segment,this.updateElement(i,void 0,{animated:!o,options:u},t),this.updateElements(s,a,l,t)}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:u}=this._cachedMeta,{sharedOptions:h,includeOptions:d}=this._getSharedOptions(e,s),g=o.axis,m=a.axis,{spanGaps:y,segment:v}=this.options,w=Ci(y)?y:Number.POSITIVE_INFINITY,A=this.chart._animationsDisabled||r||s==="none",R=e+i,D=t.length;let L=e>0&&this.getParsed(e-1);for(let M=0;M<D;++M){const V=t[M],E=A?V:{};if(M<e||M>=R){E.skip=!0;continue}const b=this.getParsed(M),x=G(b[m]),I=E[g]=o.getPixelForValue(b[g],M),T=E[m]=r||x?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,b,l):b[m],M);E.skip=isNaN(I)||isNaN(T)||x,E.stop=M>0&&Math.abs(b[g]-L[g])>w,v&&(E.parsed=b,E.raw=u.data[M]),d&&(E.options=h||this.resolveDataElementOptions(M,V.active?"active":s)),A||this.updateElement(V,M,E,s),L=b}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,i=e.options&&e.options.borderWidth||0,s=t.data||[];if(!s.length)return i;const r=s[0].size(this.resolveDataElementOptions(0)),o=s[s.length-1].size(this.resolveDataElementOptions(s.length-1));return Math.max(i,r,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}B(no,"id","line"),B(no,"defaults",{datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1}),B(no,"overrides",{scales:{_index_:{type:"category"},_value_:{type:"linear"}}});class Ss extends ge{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=or(e._parsed[t].r,i.options.locale);return{label:s[t]||"",value:r}}parseObjectData(t,e,i,s){return a0.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((i,s)=>{const r=this.getParsed(s).r;!isNaN(r)&&this.chart.getDataVisibility(s)&&(r<e.min&&(e.min=r),r>e.max&&(e.max=r))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,i=t.options,s=Math.min(e.right-e.left,e.bottom-e.top),r=Math.max(s/2,0),o=Math.max(i.cutoutPercentage?r/100*i.cutoutPercentage:1,0),a=(r-o)/t.getVisibleDatasetCount();this.outerRadius=r-a*this.index,this.innerRadius=this.outerRadius-a}updateElements(t,e,i,s){const r=s==="reset",o=this.chart,l=o.options.animation,u=this._cachedMeta.rScale,h=u.xCenter,d=u.yCenter,g=u.getIndexAngle(0)-.5*it;let m=g,y;const v=360/this.countVisibleElements();for(y=0;y<e;++y)m+=this._computeAngle(y,s,v);for(y=e;y<e+i;y++){const w=t[y];let A=m,R=m+this._computeAngle(y,s,v),D=o.getDataVisibility(y)?u.getDistanceFromCenterForValue(this.getParsed(y).r):0;m=R,r&&(l.animateScale&&(D=0),l.animateRotate&&(A=R=g));const L={x:h,y:d,innerRadius:0,outerRadius:D,startAngle:A,endAngle:R,options:this.resolveDataElementOptions(y,w.active?"active":s)};this.updateElement(w,y,L,s)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((i,s)=>{!isNaN(this.getParsed(s).r)&&this.chart.getDataVisibility(s)&&e++}),e}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?de(this.resolveDataElementOptions(t,e).angle||i):0}}B(Ss,"id","polarArea"),B(Ss,"defaults",{dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0}),B(Ss,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map((r,o)=>{const l=t.getDatasetMeta(0).controller.getStyle(o);return{text:r,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:s,lineWidth:l.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(o),index:o}})}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}});class $l extends Un{}B($l,"id","pie"),B($l,"defaults",{cutout:0,rotation:0,circumference:360,radius:"100%"});class io extends ge{getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}parseObjectData(t,e,i,s){return a0.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta,i=e.dataset,s=e.data||[],r=e.iScale.getLabels();if(i.points=s,t!=="resize"){const o=this.resolveDatasetElementOptions(t);this.options.showLine||(o.borderWidth=0);const a={_loop:!0,_fullLoop:r.length===s.length,options:o};this.updateElement(i,void 0,a,t)}this.updateElements(s,0,s.length,t)}updateElements(t,e,i,s){const r=this._cachedMeta.rScale,o=s==="reset";for(let a=e;a<e+i;a++){const l=t[a],u=this.resolveDataElementOptions(a,l.active?"active":s),h=r.getPointPositionForValue(a,this.getParsed(a).r),d=o?r.xCenter:h.x,g=o?r.yCenter:h.y,m={x:d,y:g,angle:h.angle,skip:isNaN(d)||isNaN(g),options:u};this.updateElement(l,a,m,s)}}}B(io,"id","radar"),B(io,"defaults",{datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}}),B(io,"overrides",{aspectRatio:1,scales:{r:{type:"radialLinear"}}});class so extends ge{getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),l=r.getLabelForValue(o.y);return{label:i[t]||"",value:"("+a+", "+l+")"}}update(t){const e=this._cachedMeta,{data:i=[]}=e,s=this.chart._animationsDisabled;let{start:r,count:o}=Jm(e,i,s);if(this._drawStart=r,this._drawCount=o,Zm(e)&&(r=0,o=i.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:a,_dataset:l}=e;a._chart=this.chart,a._datasetIndex=this.index,a._decimated=!!l._decimated,a.points=i;const u=this.resolveDatasetElementOptions(t);u.segment=this.options.segment,this.updateElement(a,void 0,{animated:!s,options:u},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(i,r,o,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:u}=this._cachedMeta,h=this.resolveDataElementOptions(e,s),d=this.getSharedOptions(h),g=this.includeOptions(s,d),m=o.axis,y=a.axis,{spanGaps:v,segment:w}=this.options,A=Ci(v)?v:Number.POSITIVE_INFINITY,R=this.chart._animationsDisabled||r||s==="none";let D=e>0&&this.getParsed(e-1);for(let L=e;L<e+i;++L){const M=t[L],V=this.getParsed(L),E=R?M:{},b=G(V[y]),x=E[m]=o.getPixelForValue(V[m],L),I=E[y]=r||b?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,V,l):V[y],L);E.skip=isNaN(x)||isNaN(I)||b,E.stop=L>0&&Math.abs(V[m]-D[m])>A,w&&(E.parsed=V,E.raw=u.data[L]),g&&(E.options=d||this.resolveDataElementOptions(L,M.active?"active":s)),R||this.updateElement(M,L,E,s),D=V}this.updateSharedOptions(d,s,h)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let a=0;for(let l=e.length-1;l>=0;--l)a=Math.max(a,e[l].size(this.resolveDataElementOptions(l))/2);return a>0&&a}const i=t.dataset,s=i.options&&i.options.borderWidth||0;if(!e.length)return s;const r=e[0].size(this.resolveDataElementOptions(0)),o=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(s,r,o)/2}}B(so,"id","scatter"),B(so,"defaults",{datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1}),B(so,"overrides",{interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}});var kA=Object.freeze({__proto__:null,BarController:to,BubbleController:eo,DoughnutController:Un,LineController:no,PieController:$l,PolarAreaController:Ss,RadarController:io,ScatterController:so});function Ln(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class ku{constructor(t){B(this,"options");this.options=t||{}}static override(t){Object.assign(ku.prototype,t)}init(){}formats(){return Ln()}parse(){return Ln()}format(){return Ln()}add(){return Ln()}diff(){return Ln()}startOf(){return Ln()}endOf(){return Ln()}}var IA={_date:ku};function TA(n,t,e,i){const{controller:s,data:r,_sorted:o}=n,a=s._cachedMeta.iScale,l=n.dataset&&n.dataset.options?n.dataset.options.spanGaps:null;if(a&&t===a.axis&&t!=="r"&&o&&r.length){const u=a._reversePixels?GI:je;if(i){if(s._sharedOptions){const h=r[0],d=typeof h.getRange=="function"&&h.getRange(t);if(d){const g=u(r,t,e-d),m=u(r,t,e+d);return{lo:g.lo,hi:m.hi}}}}else{const h=u(r,t,e);if(l){const{vScale:d}=s._cachedMeta,{_parsed:g}=n,m=g.slice(0,h.lo+1).reverse().findIndex(v=>!G(v[d.axis]));h.lo-=Math.max(0,m);const y=g.slice(h.hi).findIndex(v=>!G(v[d.axis]));h.hi+=Math.max(0,y)}return h}}return{lo:0,hi:r.length-1}}function ua(n,t,e,i,s){const r=n.getSortedVisibleDatasetMetas(),o=e[t];for(let a=0,l=r.length;a<l;++a){const{index:u,data:h}=r[a],{lo:d,hi:g}=TA(r[a],t,o,s);for(let m=d;m<=g;++m){const y=h[m];y.skip||i(y,u,m)}}}function AA(n){const t=n.indexOf("x")!==-1,e=n.indexOf("y")!==-1;return function(i,s){const r=t?Math.abs(i.x-s.x):0,o=e?Math.abs(i.y-s.y):0;return Math.sqrt(Math.pow(r,2)+Math.pow(o,2))}}function il(n,t,e,i,s){const r=[];return!s&&!n.isPointInArea(t)||ua(n,e,t,function(a,l,u){!s&&!ze(a,n.chartArea,0)||a.inRange(t.x,t.y,i)&&r.push({element:a,datasetIndex:l,index:u})},!0),r}function SA(n,t,e,i){let s=[];function r(o,a,l){const{startAngle:u,endAngle:h}=o.getProps(["startAngle","endAngle"],i),{angle:d}=Km(o,{x:t.x,y:t.y});Us(d,u,h)&&s.push({element:o,datasetIndex:a,index:l})}return ua(n,e,t,r),s}function PA(n,t,e,i,s,r){let o=[];const a=AA(e);let l=Number.POSITIVE_INFINITY;function u(h,d,g){const m=h.inRange(t.x,t.y,s);if(i&&!m)return;const y=h.getCenterPoint(s);if(!(!!r||n.isPointInArea(y))&&!m)return;const w=a(t,y);w<l?(o=[{element:h,datasetIndex:d,index:g}],l=w):w===l&&o.push({element:h,datasetIndex:d,index:g})}return ua(n,e,t,u),o}function sl(n,t,e,i,s,r){return!r&&!n.isPointInArea(t)?[]:e==="r"&&!i?SA(n,t,e,s):PA(n,t,e,i,s,r)}function Sf(n,t,e,i,s){const r=[],o=e==="x"?"inXRange":"inYRange";let a=!1;return ua(n,e,t,(l,u,h)=>{l[o]&&l[o](t[e],s)&&(r.push({element:l,datasetIndex:u,index:h}),a=a||l.inRange(t.x,t.y,s))}),i&&!a?[]:r}var RA={modes:{index(n,t,e,i){const s=Nn(t,n),r=e.axis||"x",o=e.includeInvisible||!1,a=e.intersect?il(n,s,r,i,o):sl(n,s,r,!1,i,o),l=[];return a.length?(n.getSortedVisibleDatasetMetas().forEach(u=>{const h=a[0].index,d=u.data[h];d&&!d.skip&&l.push({element:d,datasetIndex:u.index,index:h})}),l):[]},dataset(n,t,e,i){const s=Nn(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;let a=e.intersect?il(n,s,r,i,o):sl(n,s,r,!1,i,o);if(a.length>0){const l=a[0].datasetIndex,u=n.getDatasetMeta(l).data;a=[];for(let h=0;h<u.length;++h)a.push({element:u[h],datasetIndex:l,index:h})}return a},point(n,t,e,i){const s=Nn(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return il(n,s,r,i,o)},nearest(n,t,e,i){const s=Nn(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return sl(n,s,r,e.intersect,i,o)},x(n,t,e,i){const s=Nn(t,n);return Sf(n,s,"x",e.intersect,i)},y(n,t,e,i){const s=Nn(t,n);return Sf(n,s,"y",e.intersect,i)}}};const _0=["left","top","right","bottom"];function ns(n,t){return n.filter(e=>e.pos===t)}function Pf(n,t){return n.filter(e=>_0.indexOf(e.pos)===-1&&e.box.axis===t)}function is(n,t){return n.sort((e,i)=>{const s=t?i:e,r=t?e:i;return s.weight===r.weight?s.index-r.index:s.weight-r.weight})}function CA(n){const t=[];let e,i,s,r,o,a;for(e=0,i=(n||[]).length;e<i;++e)s=n[e],{position:r,options:{stack:o,stackWeight:a=1}}=s,t.push({index:e,box:s,pos:r,horizontal:s.isHorizontal(),weight:s.weight,stack:o&&r+o,stackWeight:a});return t}function DA(n){const t={};for(const e of n){const{stack:i,pos:s,stackWeight:r}=e;if(!i||!_0.includes(s))continue;const o=t[i]||(t[i]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=r}return t}function MA(n,t){const e=DA(n),{vBoxMaxWidth:i,hBoxMaxHeight:s}=t;let r,o,a;for(r=0,o=n.length;r<o;++r){a=n[r];const{fullSize:l}=a.box,u=e[a.stack],h=u&&a.stackWeight/u.weight;a.horizontal?(a.width=h?h*i:l&&t.availableWidth,a.height=s):(a.width=i,a.height=h?h*s:l&&t.availableHeight)}return e}function LA(n){const t=CA(n),e=is(t.filter(u=>u.box.fullSize),!0),i=is(ns(t,"left"),!0),s=is(ns(t,"right")),r=is(ns(t,"top"),!0),o=is(ns(t,"bottom")),a=Pf(t,"x"),l=Pf(t,"y");return{fullSize:e,leftAndTop:i.concat(r),rightAndBottom:s.concat(l).concat(o).concat(a),chartArea:ns(t,"chartArea"),vertical:i.concat(s).concat(l),horizontal:r.concat(o).concat(a)}}function Rf(n,t,e,i){return Math.max(n[e],t[e])+Math.max(n[i],t[i])}function b0(n,t){n.top=Math.max(n.top,t.top),n.left=Math.max(n.left,t.left),n.bottom=Math.max(n.bottom,t.bottom),n.right=Math.max(n.right,t.right)}function OA(n,t,e,i){const{pos:s,box:r}=e,o=n.maxPadding;if(!Q(s)){e.size&&(n[s]-=e.size);const d=i[e.stack]||{size:0,count:1};d.size=Math.max(d.size,e.horizontal?r.height:r.width),e.size=d.size/d.count,n[s]+=e.size}r.getPadding&&b0(o,r.getPadding());const a=Math.max(0,t.outerWidth-Rf(o,n,"left","right")),l=Math.max(0,t.outerHeight-Rf(o,n,"top","bottom")),u=a!==n.w,h=l!==n.h;return n.w=a,n.h=l,e.horizontal?{same:u,other:h}:{same:h,other:u}}function VA(n){const t=n.maxPadding;function e(i){const s=Math.max(t[i]-n[i],0);return n[i]+=s,s}n.y+=e("top"),n.x+=e("left"),e("right"),e("bottom")}function NA(n,t){const e=t.maxPadding;function i(s){const r={left:0,top:0,right:0,bottom:0};return s.forEach(o=>{r[o]=Math.max(t[o],e[o])}),r}return i(n?["left","right"]:["top","bottom"])}function ps(n,t,e,i){const s=[];let r,o,a,l,u,h;for(r=0,o=n.length,u=0;r<o;++r){a=n[r],l=a.box,l.update(a.width||t.w,a.height||t.h,NA(a.horizontal,t));const{same:d,other:g}=OA(t,e,a,i);u|=d&&s.length,h=h||g,l.fullSize||s.push(a)}return u&&ps(s,t,e,i)||h}function Fr(n,t,e,i,s){n.top=e,n.left=t,n.right=t+i,n.bottom=e+s,n.width=i,n.height=s}function Cf(n,t,e,i){const s=e.padding;let{x:r,y:o}=t;for(const a of n){const l=a.box,u=i[a.stack]||{placed:0,weight:1},h=a.stackWeight/u.weight||1;if(a.horizontal){const d=t.w*h,g=u.size||l.height;Bs(u.start)&&(o=u.start),l.fullSize?Fr(l,s.left,o,e.outerWidth-s.right-s.left,g):Fr(l,t.left+u.placed,o,d,g),u.start=o,u.placed+=d,o=l.bottom}else{const d=t.h*h,g=u.size||l.width;Bs(u.start)&&(r=u.start),l.fullSize?Fr(l,r,s.top,g,e.outerHeight-s.bottom-s.top):Fr(l,r,t.top+u.placed,g,d),u.start=r,u.placed+=d,r=l.right}}t.x=r,t.y=o}var qt={addBox(n,t){n.boxes||(n.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},n.boxes.push(t)},removeBox(n,t){const e=n.boxes?n.boxes.indexOf(t):-1;e!==-1&&n.boxes.splice(e,1)},configure(n,t,e){t.fullSize=e.fullSize,t.position=e.position,t.weight=e.weight},update(n,t,e,i){if(!n)return;const s=Gt(n.options.layout.padding),r=Math.max(t-s.width,0),o=Math.max(e-s.height,0),a=LA(n.boxes),l=a.vertical,u=a.horizontal;st(n.boxes,v=>{typeof v.beforeLayout=="function"&&v.beforeLayout()});const h=l.reduce((v,w)=>w.box.options&&w.box.options.display===!1?v:v+1,0)||1,d=Object.freeze({outerWidth:t,outerHeight:e,padding:s,availableWidth:r,availableHeight:o,vBoxMaxWidth:r/2/h,hBoxMaxHeight:o/2}),g=Object.assign({},s);b0(g,Gt(i));const m=Object.assign({maxPadding:g,w:r,h:o,x:s.left,y:s.top},s),y=MA(l.concat(u),d);ps(a.fullSize,m,d,y),ps(l,m,d,y),ps(u,m,d,y)&&ps(l,m,d,y),VA(m),Cf(a.leftAndTop,m,d,y),m.x+=m.w,m.y+=m.h,Cf(a.rightAndBottom,m,d,y),n.chartArea={left:m.left,top:m.top,right:m.left+m.w,bottom:m.top+m.h,height:m.h,width:m.w},st(a.chartArea,v=>{const w=v.box;Object.assign(w,n.chartArea),w.update(m.w,m.h,{left:0,top:0,right:0,bottom:0})})}};class v0{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,s){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,s?Math.floor(e/s):i)}}isAttached(t){return!0}updateConfig(t){}}class FA extends v0{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const ro="$chartjs",BA={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Df=n=>n===null||n==="";function UA(n,t){const e=n.style,i=n.getAttribute("height"),s=n.getAttribute("width");if(n[ro]={initial:{height:i,width:s,style:{display:e.display,height:e.height,width:e.width}}},e.display=e.display||"block",e.boxSizing=e.boxSizing||"border-box",Df(s)){const r=pf(n,"width");r!==void 0&&(n.width=r)}if(Df(i))if(n.style.height==="")n.height=n.width/(t||2);else{const r=pf(n,"height");r!==void 0&&(n.height=r)}return n}const w0=jT?{passive:!0}:!1;function jA(n,t,e){n&&n.addEventListener(t,e,w0)}function zA(n,t,e){n&&n.canvas&&n.canvas.removeEventListener(t,e,w0)}function $A(n,t){const e=BA[n.type]||n.type,{x:i,y:s}=Nn(n,t);return{type:e,chart:t,native:n,x:i!==void 0?i:null,y:s!==void 0?s:null}}function Vo(n,t){for(const e of n)if(e===t||e.contains(t))return!0}function HA(n,t,e){const i=n.canvas,s=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||Vo(a.addedNodes,i),o=o&&!Vo(a.removedNodes,i);o&&e()});return s.observe(document,{childList:!0,subtree:!0}),s}function WA(n,t,e){const i=n.canvas,s=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||Vo(a.removedNodes,i),o=o&&!Vo(a.addedNodes,i);o&&e()});return s.observe(document,{childList:!0,subtree:!0}),s}const zs=new Map;let Mf=0;function x0(){const n=window.devicePixelRatio;n!==Mf&&(Mf=n,zs.forEach((t,e)=>{e.currentDevicePixelRatio!==n&&t()}))}function qA(n,t){zs.size||window.addEventListener("resize",x0),zs.set(n,t)}function KA(n){zs.delete(n),zs.size||window.removeEventListener("resize",x0)}function GA(n,t,e){const i=n.canvas,s=i&&Eu(i);if(!s)return;const r=Xm((a,l)=>{const u=s.clientWidth;e(a,l),u<s.clientWidth&&e()},window),o=new ResizeObserver(a=>{const l=a[0],u=l.contentRect.width,h=l.contentRect.height;u===0&&h===0||r(u,h)});return o.observe(s),qA(n,r),o}function rl(n,t,e){e&&e.disconnect(),t==="resize"&&KA(n)}function YA(n,t,e){const i=n.canvas,s=Xm(r=>{n.ctx!==null&&e($A(r,n))},n);return jA(i,t,s),s}class QA extends v0{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(UA(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e[ro])return!1;const i=e[ro].initial;["height","width"].forEach(r=>{const o=i[r];G(o)?e.removeAttribute(r):e.setAttribute(r,o)});const s=i.style||{};return Object.keys(s).forEach(r=>{e.style[r]=s[r]}),e.width=e.width,delete e[ro],!0}addEventListener(t,e,i){this.removeEventListener(t,e);const s=t.$proxies||(t.$proxies={}),o={attach:HA,detach:WA,resize:GA}[e]||YA;s[e]=o(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),s=i[e];if(!s)return;({attach:rl,detach:rl,resize:rl}[e]||zA)(t,e,s),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,s){return UT(t,e,i,s)}isAttached(t){const e=t&&Eu(t);return!!(e&&e.isConnected)}}function XA(n){return!xu()||typeof OffscreenCanvas<"u"&&n instanceof OffscreenCanvas?FA:QA}class ye{constructor(){B(this,"x");B(this,"y");B(this,"active",!1);B(this,"options");B(this,"$animations")}tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return Ci(this.x)&&Ci(this.y)}getProps(t,e){const i=this.$animations;if(!e||!i)return this;const s={};return t.forEach(r=>{s[r]=i[r]&&i[r].active()?i[r]._to:this[r]}),s}}B(ye,"defaults",{}),B(ye,"defaultRoutes");function JA(n,t){const e=n.options.ticks,i=ZA(n),s=Math.min(e.maxTicksLimit||i,i),r=e.major.enabled?e1(t):[],o=r.length,a=r[0],l=r[o-1],u=[];if(o>s)return n1(t,u,r,o/s),u;const h=t1(r,t,s);if(o>0){let d,g;const m=o>1?Math.round((l-a)/(o-1)):null;for(Br(t,u,h,G(m)?0:a-m,a),d=0,g=o-1;d<g;d++)Br(t,u,h,r[d],r[d+1]);return Br(t,u,h,l,G(m)?t.length:l+m),u}return Br(t,u,h),u}function ZA(n){const t=n.options.offset,e=n._tickSize(),i=n._length/e+(t?0:1),s=n._maxLength/e;return Math.floor(Math.min(i,s))}function t1(n,t,e){const i=i1(n),s=t.length/e;if(!i)return Math.max(s,1);const r=$I(i);for(let o=0,a=r.length-1;o<a;o++){const l=r[o];if(l>s)return l}return Math.max(s,1)}function e1(n){const t=[];let e,i;for(e=0,i=n.length;e<i;e++)n[e].major&&t.push(e);return t}function n1(n,t,e,i){let s=0,r=e[0],o;for(i=Math.ceil(i),o=0;o<n.length;o++)o===r&&(t.push(n[o]),s++,r=e[s*i])}function Br(n,t,e,i,s){const r=q(i,0),o=Math.min(q(s,n.length),n.length);let a=0,l,u,h;for(e=Math.ceil(e),s&&(l=s-i,e=l/Math.floor(l/e)),h=r;h<0;)a++,h=Math.round(r+a*e);for(u=Math.max(r,0);u<o;u++)u===h&&(t.push(n[u]),a++,h=Math.round(r+a*e))}function i1(n){const t=n.length;let e,i;if(t<2)return!1;for(i=n[0],e=1;e<t;++e)if(n[e]-n[e-1]!==i)return!1;return i}const s1=n=>n==="left"?"right":n==="right"?"left":n,Lf=(n,t,e)=>t==="top"||t==="left"?n[t]+e:n[t]-e,Of=(n,t)=>Math.min(t||n,n);function Vf(n,t){const e=[],i=n.length/t,s=n.length;let r=0;for(;r<s;r+=i)e.push(n[Math.floor(r)]);return e}function r1(n,t,e){const i=n.ticks.length,s=Math.min(t,i-1),r=n._startPixel,o=n._endPixel,a=1e-6;let l=n.getPixelForTick(s),u;if(!(e&&(i===1?u=Math.max(l-r,o-l):t===0?u=(n.getPixelForTick(1)-l)/2:u=(l-n.getPixelForTick(s-1))/2,l+=s<t?u:-u,l<r-a||l>o+a)))return l}function o1(n,t){st(n,e=>{const i=e.gc,s=i.length/2;let r;if(s>t){for(r=0;r<s;++r)delete e.data[i[r]];i.splice(0,s)}})}function ss(n){return n.drawTicks?n.tickLength:0}function Nf(n,t){if(!n.display)return 0;const e=St(n.font,t),i=Gt(n.padding);return(ft(n.text)?n.text.length:1)*e.lineHeight+i.height}function a1(n,t){return An(n,{scale:t,type:"scale"})}function l1(n,t,e){return An(n,{tick:e,index:t,type:"tick"})}function c1(n,t,e){let i=mu(n);return(e&&t!=="right"||!e&&t==="right")&&(i=s1(i)),i}function u1(n,t,e,i){const{top:s,left:r,bottom:o,right:a,chart:l}=n,{chartArea:u,scales:h}=l;let d=0,g,m,y;const v=o-s,w=a-r;if(n.isHorizontal()){if(m=zt(i,r,a),Q(e)){const A=Object.keys(e)[0],R=e[A];y=h[A].getPixelForValue(R)+v-t}else e==="center"?y=(u.bottom+u.top)/2+v-t:y=Lf(n,e,t);g=a-r}else{if(Q(e)){const A=Object.keys(e)[0],R=e[A];m=h[A].getPixelForValue(R)-w+t}else e==="center"?m=(u.left+u.right)/2-w+t:m=Lf(n,e,t);y=zt(i,o,s),d=e==="left"?-Et:Et}return{titleX:m,titleY:y,maxWidth:g,rotation:d}}class ii extends ye{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:s}=this;return t=ie(t,Number.POSITIVE_INFINITY),e=ie(e,Number.NEGATIVE_INFINITY),i=ie(i,Number.POSITIVE_INFINITY),s=ie(s,Number.NEGATIVE_INFINITY),{min:ie(t,i),max:ie(e,s),minDefined:wt(t),maxDefined:wt(e)}}getMinMax(t){let{min:e,max:i,minDefined:s,maxDefined:r}=this.getUserBounds(),o;if(s&&r)return{min:e,max:i};const a=this.getMatchingVisibleMetas();for(let l=0,u=a.length;l<u;++l)o=a[l].controller.getMinMax(this,t),s||(e=Math.min(e,o.min)),r||(i=Math.max(i,o.max));return e=r&&e>i?i:e,i=s&&e>i?e:i,{min:ie(e,ie(i,e)),max:ie(i,ie(e,i))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){ct(this.options.beforeUpdate,[this])}update(t,e,i){const{beginAtZero:s,grace:r,ticks:o}=this.options,a=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+i.left+i.right:this.height+i.top+i.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=_T(this,r,s),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const l=a<this.ticks.length;this._convertTicksToLabels(l?Vf(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||o.source==="auto")&&(this.ticks=JA(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),l&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t=this.options.reverse,e,i;this.isHorizontal()?(e=this.left,i=this.right):(e=this.top,i=this.bottom,t=!t),this._startPixel=e,this._endPixel=i,this._reversePixels=t,this._length=i-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){ct(this.options.afterUpdate,[this])}beforeSetDimensions(){ct(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){ct(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),ct(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){ct(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let i,s,r;for(i=0,s=t.length;i<s;i++)r=t[i],r.label=ct(e.callback,[r.value,i,t],this)}afterTickToLabelConversion(){ct(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){ct(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,i=Of(this.ticks.length,t.ticks.maxTicksLimit),s=e.minRotation||0,r=e.maxRotation;let o=s,a,l,u;if(!this._isVisible()||!e.display||s>=r||i<=1||!this.isHorizontal()){this.labelRotation=s;return}const h=this._getLabelSizes(),d=h.widest.width,g=h.highest.height,m=Rt(this.chart.width-d,0,this.maxWidth);a=t.offset?this.maxWidth/i:m/(i-1),d+6>a&&(a=m/(i-(t.offset?.5:1)),l=this.maxHeight-ss(t.grid)-e.padding-Nf(t.title,this.chart.options.font),u=Math.sqrt(d*d+g*g),o=gu(Math.min(Math.asin(Rt((h.highest.height+6)/a,-1,1)),Math.asin(Rt(l/u,-1,1))-Math.asin(Rt(g/u,-1,1)))),o=Math.max(s,Math.min(r,o))),this.labelRotation=o}afterCalculateLabelRotation(){ct(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){ct(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:i,title:s,grid:r}}=this,o=this._isVisible(),a=this.isHorizontal();if(o){const l=Nf(s,e.options.font);if(a?(t.width=this.maxWidth,t.height=ss(r)+l):(t.height=this.maxHeight,t.width=ss(r)+l),i.display&&this.ticks.length){const{first:u,last:h,widest:d,highest:g}=this._getLabelSizes(),m=i.padding*2,y=de(this.labelRotation),v=Math.cos(y),w=Math.sin(y);if(a){const A=i.mirror?0:w*d.width+v*g.height;t.height=Math.min(this.maxHeight,t.height+A+m)}else{const A=i.mirror?0:v*d.width+w*g.height;t.width=Math.min(this.maxWidth,t.width+A+m)}this._calculatePadding(u,h,w,v)}}this._handleMargins(),a?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,i,s){const{ticks:{align:r,padding:o},position:a}=this.options,l=this.labelRotation!==0,u=a!=="top"&&this.axis==="x";if(this.isHorizontal()){const h=this.getPixelForTick(0)-this.left,d=this.right-this.getPixelForTick(this.ticks.length-1);let g=0,m=0;l?u?(g=s*t.width,m=i*e.height):(g=i*t.height,m=s*e.width):r==="start"?m=e.width:r==="end"?g=t.width:r!=="inner"&&(g=t.width/2,m=e.width/2),this.paddingLeft=Math.max((g-h+o)*this.width/(this.width-h),0),this.paddingRight=Math.max((m-d+o)*this.width/(this.width-d),0)}else{let h=e.height/2,d=t.height/2;r==="start"?(h=0,d=t.height):r==="end"&&(h=e.height,d=0),this.paddingTop=h+o,this.paddingBottom=d+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){ct(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return e==="top"||e==="bottom"||t==="x"}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){this.beforeTickToLabelConversion(),this.generateTickLabels(t);let e,i;for(e=0,i=t.length;e<i;e++)G(t[e].label)&&(t.splice(e,1),i--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let i=this.ticks;e<i.length&&(i=Vf(i,e)),this._labelSizes=t=this._computeLabelSizes(i,i.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,i){const{ctx:s,_longestTextCache:r}=this,o=[],a=[],l=Math.floor(e/Of(e,i));let u=0,h=0,d,g,m,y,v,w,A,R,D,L,M;for(d=0;d<e;d+=l){if(y=t[d].label,v=this._resolveTickFontOptions(d),s.font=w=v.string,A=r[w]=r[w]||{data:{},gc:[]},R=v.lineHeight,D=L=0,!G(y)&&!ft(y))D=Lo(s,A.data,A.gc,D,y),L=R;else if(ft(y))for(g=0,m=y.length;g<m;++g)M=y[g],!G(M)&&!ft(M)&&(D=Lo(s,A.data,A.gc,D,M),L+=R);o.push(D),a.push(L),u=Math.max(D,u),h=Math.max(L,h)}o1(r,e);const V=o.indexOf(u),E=a.indexOf(h),b=x=>({width:o[x]||0,height:a[x]||0});return{first:b(0),last:b(e-1),widest:b(V),highest:b(E),widths:o,heights:a}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return KI(this._alignToPixels?Mn(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const i=e[t];return i.$context||(i.$context=l1(this.getContext(),t,i))}return this.$context||(this.$context=a1(this.chart.getContext(),this))}_tickSize(){const t=this.options.ticks,e=de(this.labelRotation),i=Math.abs(Math.cos(e)),s=Math.abs(Math.sin(e)),r=this._getLabelSizes(),o=t.autoSkipPadding||0,a=r?r.widest.width+o:0,l=r?r.highest.height+o:0;return this.isHorizontal()?l*i>a*s?a/i:l/s:l*s<a*i?l/i:a/s}_isVisible(){const t=this.options.display;return t!=="auto"?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,i=this.chart,s=this.options,{grid:r,position:o,border:a}=s,l=r.offset,u=this.isHorizontal(),d=this.ticks.length+(l?1:0),g=ss(r),m=[],y=a.setContext(this.getContext()),v=y.display?y.width:0,w=v/2,A=function(lt){return Mn(i,lt,v)};let R,D,L,M,V,E,b,x,I,T,S,k;if(o==="top")R=A(this.bottom),E=this.bottom-g,x=R-w,T=A(t.top)+w,k=t.bottom;else if(o==="bottom")R=A(this.top),T=t.top,k=A(t.bottom)-w,E=R+w,x=this.top+g;else if(o==="left")R=A(this.right),V=this.right-g,b=R-w,I=A(t.left)+w,S=t.right;else if(o==="right")R=A(this.left),I=t.left,S=A(t.right)-w,V=R+w,b=this.left+g;else if(e==="x"){if(o==="center")R=A((t.top+t.bottom)/2+.5);else if(Q(o)){const lt=Object.keys(o)[0],ot=o[lt];R=A(this.chart.scales[lt].getPixelForValue(ot))}T=t.top,k=t.bottom,E=R+w,x=E+g}else if(e==="y"){if(o==="center")R=A((t.left+t.right)/2);else if(Q(o)){const lt=Object.keys(o)[0],ot=o[lt];R=A(this.chart.scales[lt].getPixelForValue(ot))}V=R-w,b=V-g,I=t.left,S=t.right}const mt=q(s.ticks.maxTicksLimit,d),J=Math.max(1,Math.ceil(d/mt));for(D=0;D<d;D+=J){const lt=this.getContext(D),ot=r.setContext(lt),Ct=a.setContext(lt),kt=ot.lineWidth,Te=ot.color,si=Ct.dash||[],Yt=Ct.dashOffset,_t=ot.tickWidth,Ae=ot.tickColor,ce=ot.tickBorderDash||[],Se=ot.tickBorderDashOffset;L=r1(this,D,l),L!==void 0&&(M=Mn(i,L,kt),u?V=b=I=S=M:E=x=T=k=M,m.push({tx1:V,ty1:E,tx2:b,ty2:x,x1:I,y1:T,x2:S,y2:k,width:kt,color:Te,borderDash:si,borderDashOffset:Yt,tickWidth:_t,tickColor:Ae,tickBorderDash:ce,tickBorderDashOffset:Se}))}return this._ticksLength=d,this._borderValue=R,m}_computeLabelItems(t){const e=this.axis,i=this.options,{position:s,ticks:r}=i,o=this.isHorizontal(),a=this.ticks,{align:l,crossAlign:u,padding:h,mirror:d}=r,g=ss(i.grid),m=g+h,y=d?-h:m,v=-de(this.labelRotation),w=[];let A,R,D,L,M,V,E,b,x,I,T,S,k="middle";if(s==="top")V=this.bottom-y,E=this._getXAxisLabelAlignment();else if(s==="bottom")V=this.top+y,E=this._getXAxisLabelAlignment();else if(s==="left"){const J=this._getYAxisLabelAlignment(g);E=J.textAlign,M=J.x}else if(s==="right"){const J=this._getYAxisLabelAlignment(g);E=J.textAlign,M=J.x}else if(e==="x"){if(s==="center")V=(t.top+t.bottom)/2+m;else if(Q(s)){const J=Object.keys(s)[0],lt=s[J];V=this.chart.scales[J].getPixelForValue(lt)+m}E=this._getXAxisLabelAlignment()}else if(e==="y"){if(s==="center")M=(t.left+t.right)/2-m;else if(Q(s)){const J=Object.keys(s)[0],lt=s[J];M=this.chart.scales[J].getPixelForValue(lt)}E=this._getYAxisLabelAlignment(g).textAlign}e==="y"&&(l==="start"?k="top":l==="end"&&(k="bottom"));const mt=this._getLabelSizes();for(A=0,R=a.length;A<R;++A){D=a[A],L=D.label;const J=r.setContext(this.getContext(A));b=this.getPixelForTick(A)+r.labelOffset,x=this._resolveTickFontOptions(A),I=x.lineHeight,T=ft(L)?L.length:1;const lt=T/2,ot=J.color,Ct=J.textStrokeColor,kt=J.textStrokeWidth;let Te=E;o?(M=b,E==="inner"&&(A===R-1?Te=this.options.reverse?"left":"right":A===0?Te=this.options.reverse?"right":"left":Te="center"),s==="top"?u==="near"||v!==0?S=-T*I+I/2:u==="center"?S=-mt.highest.height/2-lt*I+I:S=-mt.highest.height+I/2:u==="near"||v!==0?S=I/2:u==="center"?S=mt.highest.height/2-lt*I:S=mt.highest.height-T*I,d&&(S*=-1),v!==0&&!J.showLabelBackdrop&&(M+=I/2*Math.sin(v))):(V=b,S=(1-T)*I/2);let si;if(J.showLabelBackdrop){const Yt=Gt(J.backdropPadding),_t=mt.heights[A],Ae=mt.widths[A];let ce=S-Yt.top,Se=0-Yt.left;switch(k){case"middle":ce-=_t/2;break;case"bottom":ce-=_t;break}switch(E){case"center":Se-=Ae/2;break;case"right":Se-=Ae;break;case"inner":A===R-1?Se-=Ae:A>0&&(Se-=Ae/2);break}si={left:Se,top:ce,width:Ae+Yt.width,height:_t+Yt.height,color:J.backdropColor}}w.push({label:L,font:x,textOffset:S,options:{rotation:v,color:ot,strokeColor:Ct,strokeWidth:kt,textAlign:Te,textBaseline:k,translation:[M,V],backdrop:si}})}return w}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-de(this.labelRotation))return t==="top"?"left":"right";let s="center";return e.align==="start"?s="left":e.align==="end"?s="right":e.align==="inner"&&(s="inner"),s}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:i,mirror:s,padding:r}}=this.options,o=this._getLabelSizes(),a=t+r,l=o.widest.width;let u,h;return e==="left"?s?(h=this.right+r,i==="near"?u="left":i==="center"?(u="center",h+=l/2):(u="right",h+=l)):(h=this.right-a,i==="near"?u="right":i==="center"?(u="center",h-=l/2):(u="left",h=this.left)):e==="right"?s?(h=this.left+r,i==="near"?u="right":i==="center"?(u="center",h-=l/2):(u="left",h-=l)):(h=this.left+a,i==="near"?u="left":i==="center"?(u="center",h+=l/2):(u="right",h=this.right)):u="right",{textAlign:u,x:h}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;if(e==="left"||e==="right")return{top:0,left:this.left,bottom:t.height,right:this.right};if(e==="top"||e==="bottom")return{top:this.top,left:0,bottom:this.bottom,right:t.width}}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:s,width:r,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,s,r,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const s=this.ticks.findIndex(r=>r.value===t);return s>=0?e.setContext(this.getContext(s)).lineWidth:0}drawGrid(t){const e=this.options.grid,i=this.ctx,s=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let r,o;const a=(l,u,h)=>{!h.width||!h.color||(i.save(),i.lineWidth=h.width,i.strokeStyle=h.color,i.setLineDash(h.borderDash||[]),i.lineDashOffset=h.borderDashOffset,i.beginPath(),i.moveTo(l.x,l.y),i.lineTo(u.x,u.y),i.stroke(),i.restore())};if(e.display)for(r=0,o=s.length;r<o;++r){const l=s[r];e.drawOnChartArea&&a({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},l),e.drawTicks&&a({x:l.tx1,y:l.ty1},{x:l.tx2,y:l.ty2},{color:l.tickColor,width:l.tickWidth,borderDash:l.tickBorderDash,borderDashOffset:l.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:i,grid:s}}=this,r=i.setContext(this.getContext()),o=i.display?r.width:0;if(!o)return;const a=s.setContext(this.getContext(0)).lineWidth,l=this._borderValue;let u,h,d,g;this.isHorizontal()?(u=Mn(t,this.left,o)-o/2,h=Mn(t,this.right,a)+a/2,d=g=l):(d=Mn(t,this.top,o)-o/2,g=Mn(t,this.bottom,a)+a/2,u=h=l),e.save(),e.lineWidth=r.width,e.strokeStyle=r.color,e.beginPath(),e.moveTo(u,d),e.lineTo(h,g),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const i=this.ctx,s=this._computeLabelArea();s&&aa(i,s);const r=this.getLabelItems(t);for(const o of r){const a=o.options,l=o.font,u=o.label,h=o.textOffset;Qn(i,u,0,h,l,a)}s&&la(i)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:s}}=this;if(!i.display)return;const r=St(i.font),o=Gt(i.padding),a=i.align;let l=r.lineHeight/2;e==="bottom"||e==="center"||Q(e)?(l+=o.bottom,ft(i.text)&&(l+=r.lineHeight*(i.text.length-1))):l+=o.top;const{titleX:u,titleY:h,maxWidth:d,rotation:g}=u1(this,l,e,a);Qn(t,i.text,0,0,r,{color:i.color,maxWidth:d,rotation:g,textAlign:c1(a,e,s),textBaseline:"middle",translation:[u,h]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,i=q(t.grid&&t.grid.z,-1),s=q(t.border&&t.border.z,0);return!this._isVisible()||this.draw!==ii.prototype.draw?[{z:e,draw:r=>{this.draw(r)}}]:[{z:i,draw:r=>{this.drawBackground(),this.drawGrid(r),this.drawTitle()}},{z:s,draw:()=>{this.drawBorder()}},{z:e,draw:r=>{this.drawLabels(r)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),i=this.axis+"AxisID",s=[];let r,o;for(r=0,o=e.length;r<o;++r){const a=e[r];a[i]===this.id&&(!t||a.type===t)&&s.push(a)}return s}_resolveTickFontOptions(t){const e=this.options.ticks.setContext(this.getContext(t));return St(e.font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class Ur{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let i;f1(e)&&(i=this.register(e));const s=this.items,r=t.id,o=this.scope+"."+r;if(!r)throw new Error("class does not have id: "+t);return r in s||(s[r]=t,h1(t,o,i),this.override&&gt.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,s=this.scope;i in e&&delete e[i],s&&i in gt[s]&&(delete gt[s][i],this.override&&delete Yn[i])}}function h1(n,t,e){const i=Fs(Object.create(null),[e?gt.get(e):{},gt.get(t),n.defaults]);gt.set(t,i),n.defaultRoutes&&d1(t,n.defaultRoutes),n.descriptors&&gt.describe(t,n.descriptors)}function d1(n,t){Object.keys(t).forEach(e=>{const i=e.split("."),s=i.pop(),r=[n].concat(i).join("."),o=t[e].split("."),a=o.pop(),l=o.join(".");gt.route(r,s,l,a)})}function f1(n){return"id"in n&&"defaults"in n}class g1{constructor(){this.controllers=new Ur(ge,"datasets",!0),this.elements=new Ur(ye,"elements"),this.plugins=new Ur(Object,"plugins"),this.scales=new Ur(ii,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){[...e].forEach(s=>{const r=i||this._getRegistryForType(s);i||r.isForType(s)||r===this.plugins&&s.id?this._exec(t,r,s):st(s,o=>{const a=i||this._getRegistryForType(o);this._exec(t,a,o)})})}_exec(t,e,i){const s=fu(t);ct(i["before"+s],[],i),e[t](i),ct(i["after"+s],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const s=e.get(t);if(s===void 0)throw new Error('"'+t+'" is not a registered '+i+".");return s}}var be=new g1;class p1{constructor(){this._init=void 0}notify(t,e,i,s){if(e==="beforeInit"&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install")),this._init===void 0)return;const r=s?this._descriptors(t).filter(s):this._descriptors(t),o=this._notify(r,t,e,i);return e==="afterDestroy"&&(this._notify(r,t,"stop"),this._notify(this._init,t,"uninstall"),this._init=void 0),o}_notify(t,e,i,s){s=s||{};for(const r of t){const o=r.plugin,a=o[i],l=[e,s,r.options];if(ct(a,l,o)===!1&&s.cancelable)return!1}return!0}invalidate(){G(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,s=q(i.options&&i.options.plugins,{}),r=m1(i);return s===!1&&!e?[]:_1(t,r,s,e)}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,s=(r,o)=>r.filter(a=>!o.some(l=>a.plugin.id===l.plugin.id));this._notify(s(e,i),t,"stop"),this._notify(s(i,e),t,"start")}}function m1(n){const t={},e=[],i=Object.keys(be.plugins.items);for(let r=0;r<i.length;r++)e.push(be.getPlugin(i[r]));const s=n.plugins||[];for(let r=0;r<s.length;r++){const o=s[r];e.indexOf(o)===-1&&(e.push(o),t[o.id]=!0)}return{plugins:e,localIds:t}}function y1(n,t){return!t&&n===!1?null:n===!0?{}:n}function _1(n,{plugins:t,localIds:e},i,s){const r=[],o=n.getContext();for(const a of t){const l=a.id,u=y1(i[l],s);u!==null&&r.push({plugin:a,options:b1(n.config,{plugin:a,local:e[l]},u,o)})}return r}function b1(n,{plugin:t,local:e},i,s){const r=n.pluginScopeKeys(t),o=n.getOptionScopes(i,r);return e&&t.defaults&&o.push(t.defaults),n.createResolver(o,s,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function Hl(n,t){const e=gt.datasets[n]||{};return((t.datasets||{})[n]||{}).indexAxis||t.indexAxis||e.indexAxis||"x"}function v1(n,t){let e=n;return n==="_index_"?e=t:n==="_value_"&&(e=t==="x"?"y":"x"),e}function w1(n,t){return n===t?"_index_":"_value_"}function Ff(n){if(n==="x"||n==="y"||n==="r")return n}function x1(n){if(n==="top"||n==="bottom")return"x";if(n==="left"||n==="right")return"y"}function Wl(n,...t){if(Ff(n))return n;for(const e of t){const i=e.axis||x1(e.position)||n.length>1&&Ff(n[0].toLowerCase());if(i)return i}throw new Error(`Cannot determine type of '${n}' axis. Please provide 'axis' or 'position' option.`)}function Bf(n,t,e){if(e[t+"AxisID"]===n)return{axis:t}}function E1(n,t){if(t.data&&t.data.datasets){const e=t.data.datasets.filter(i=>i.xAxisID===n||i.yAxisID===n);if(e.length)return Bf(n,"x",e[0])||Bf(n,"y",e[0])}return{}}function k1(n,t){const e=Yn[n.type]||{scales:{}},i=t.scales||{},s=Hl(n.type,t),r=Object.create(null);return Object.keys(i).forEach(o=>{const a=i[o];if(!Q(a))return console.error(`Invalid scale configuration for scale: ${o}`);if(a._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${o}`);const l=Wl(o,a,E1(o,n),gt.scales[a.type]),u=w1(l,s),h=e.scales||{};r[o]=ks(Object.create(null),[{axis:l},a,h[l],h[u]])}),n.data.datasets.forEach(o=>{const a=o.type||n.type,l=o.indexAxis||Hl(a,t),h=(Yn[a]||{}).scales||{};Object.keys(h).forEach(d=>{const g=v1(d,l),m=o[g+"AxisID"]||g;r[m]=r[m]||Object.create(null),ks(r[m],[{axis:g},i[m],h[d]])})}),Object.keys(r).forEach(o=>{const a=r[o];ks(a,[gt.scales[a.type],gt.scale])}),r}function E0(n){const t=n.options||(n.options={});t.plugins=q(t.plugins,{}),t.scales=k1(n,t)}function k0(n){return n=n||{},n.datasets=n.datasets||[],n.labels=n.labels||[],n}function I1(n){return n=n||{},n.data=k0(n.data),E0(n),n}const Uf=new Map,I0=new Set;function jr(n,t){let e=Uf.get(n);return e||(e=t(),Uf.set(n,e),I0.add(e)),e}const rs=(n,t,e)=>{const i=kn(t,e);i!==void 0&&n.add(i)};class T1{constructor(t){this._config=I1(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=k0(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),E0(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return jr(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return jr(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return jr(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id,i=this.type;return jr(`${i}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const i=this._scopeCache;let s=i.get(t);return(!s||e)&&(s=new Map,i.set(t,s)),s}getOptionScopes(t,e,i){const{options:s,type:r}=this,o=this._cachedScopes(t,i),a=o.get(e);if(a)return a;const l=new Set;e.forEach(h=>{t&&(l.add(t),h.forEach(d=>rs(l,t,d))),h.forEach(d=>rs(l,s,d)),h.forEach(d=>rs(l,Yn[r]||{},d)),h.forEach(d=>rs(l,gt,d)),h.forEach(d=>rs(l,jl,d))});const u=Array.from(l);return u.length===0&&u.push(Object.create(null)),I0.has(e)&&o.set(e,u),u}chartOptionScopes(){const{options:t,type:e}=this;return[t,Yn[e]||{},gt.datasets[e]||{},{type:e},gt,jl]}resolveNamedOptions(t,e,i,s=[""]){const r={$shared:!0},{resolver:o,subPrefixes:a}=jf(this._resolverCache,t,s);let l=o;if(S1(o,e)){r.$shared=!1,i=In(i)?i():i;const u=this.createResolver(t,i,a);l=Di(o,i,u)}for(const u of e)r[u]=l[u];return r}createResolver(t,e,i=[""],s){const{resolver:r}=jf(this._resolverCache,t,i);return Q(e)?Di(r,e,void 0,s):r}}function jf(n,t,e){let i=n.get(t);i||(i=new Map,n.set(t,i));const s=e.join();let r=i.get(s);return r||(r={resolver:bu(t,e),subPrefixes:e.filter(a=>!a.toLowerCase().includes("hover"))},i.set(s,r)),r}const A1=n=>Q(n)&&Object.getOwnPropertyNames(n).some(t=>In(n[t]));function S1(n,t){const{isScriptable:e,isIndexable:i}=i0(n);for(const s of t){const r=e(s),o=i(s),a=(o||r)&&n[s];if(r&&(In(a)||A1(a))||o&&ft(a))return!0}return!1}var P1="4.5.1";const R1=["top","bottom","left","right","chartArea"];function zf(n,t){return n==="top"||n==="bottom"||R1.indexOf(n)===-1&&t==="x"}function $f(n,t){return function(e,i){return e[n]===i[n]?e[t]-i[t]:e[n]-i[n]}}function Hf(n){const t=n.chart,e=t.options.animation;t.notifyPlugins("afterRender"),ct(e&&e.onComplete,[n],t)}function C1(n){const t=n.chart,e=t.options.animation;ct(e&&e.onProgress,[n],t)}function T0(n){return xu()&&typeof n=="string"?n=document.getElementById(n):n&&n.length&&(n=n[0]),n&&n.canvas&&(n=n.canvas),n}const oo={},Wf=n=>{const t=T0(n);return Object.values(oo).filter(e=>e.canvas===t).pop()};function D1(n,t,e){const i=Object.keys(n);for(const s of i){const r=+s;if(r>=t){const o=n[s];delete n[s],(e>0||r>t)&&(n[r+e]=o)}}}function M1(n,t,e,i){return!e||n.type==="mouseout"?null:i?t:n}class ae{static register(...t){be.add(...t),qf()}static unregister(...t){be.remove(...t),qf()}constructor(t,e){const i=this.config=new T1(e),s=T0(t),r=Wf(s);if(r)throw new Error("Canvas is already in use. Chart with ID '"+r.id+"' must be destroyed before the canvas with ID '"+r.canvas.id+"' can be reused.");const o=i.createResolver(i.chartOptionScopes(),this.getContext());this.platform=new(i.platform||XA(s)),this.platform.updateConfig(i);const a=this.platform.acquireContext(s,o.aspectRatio),l=a&&a.canvas,u=l&&l.height,h=l&&l.width;if(this.id=LI(),this.ctx=a,this.canvas=l,this.width=h,this.height=u,this._options=o,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new p1,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=XI(d=>this.update(d),o.resizeDelay||0),this._dataChanges=[],oo[this.id]=this,!a||!l){console.error("Failed to create chart: can't acquire context from the given item");return}De.listen(this,"complete",Hf),De.listen(this,"progress",C1),this._initialize(),this.attached&&this.update()}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:s,_aspectRatio:r}=this;return G(t)?e&&r?r:s?i/s:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return be}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():gf(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return hf(this.canvas,this.ctx),this}stop(){return De.stop(this),this}resize(t,e){De.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this.options,s=this.canvas,r=i.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(s,t,e,r),a=i.devicePixelRatio||this.platform.getDevicePixelRatio(),l=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,gf(this,a,!0)&&(this.notifyPlugins("resize",{size:o}),ct(i.onResize,[this,o],this),this.attached&&this._doResize(l)&&this.render())}ensureScalesHaveIDs(){const e=this.options.scales||{};st(e,(i,s)=>{i.id=s})}buildOrUpdateScales(){const t=this.options,e=t.scales,i=this.scales,s=Object.keys(i).reduce((o,a)=>(o[a]=!1,o),{});let r=[];e&&(r=r.concat(Object.keys(e).map(o=>{const a=e[o],l=Wl(o,a),u=l==="r",h=l==="x";return{options:a,dposition:u?"chartArea":h?"bottom":"left",dtype:u?"radialLinear":h?"category":"linear"}}))),st(r,o=>{const a=o.options,l=a.id,u=Wl(l,a),h=q(a.type,o.dtype);(a.position===void 0||zf(a.position,u)!==zf(o.dposition))&&(a.position=o.dposition),s[l]=!0;let d=null;if(l in i&&i[l].type===h)d=i[l];else{const g=be.getScale(h);d=new g({id:l,type:h,ctx:this.ctx,chart:this}),i[d.id]=d}d.init(a,t)}),st(s,(o,a)=>{o||delete i[a]}),st(i,o=>{qt.configure(this,o,o.options),qt.addBox(this,o)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,i=t.length;if(t.sort((s,r)=>s.index-r.index),i>e){for(let s=e;s<i;++s)this._destroyDatasetMeta(s);t.splice(e,i-e)}this._sortedMetasets=t.slice(0).sort($f("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((i,s)=>{e.filter(r=>r===i._dataset).length===0&&this._destroyDatasetMeta(s)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let i,s;for(this._removeUnreferencedMetasets(),i=0,s=e.length;i<s;i++){const r=e[i];let o=this.getDatasetMeta(i);const a=r.type||this.config.type;if(o.type&&o.type!==a&&(this._destroyDatasetMeta(i),o=this.getDatasetMeta(i)),o.type=a,o.indexAxis=r.indexAxis||Hl(a,this.options),o.order=r.order||0,o.index=i,o.label=""+r.label,o.visible=this.isDatasetVisible(i),o.controller)o.controller.updateIndex(i),o.controller.linkScales();else{const l=be.getController(a),{datasetElementType:u,dataElementType:h}=gt.datasets[a];Object.assign(l,{dataElementType:be.getElement(h),datasetElementType:u&&be.getElement(u)}),o.controller=new l(this,i),t.push(o.controller)}}return this._updateMetasets(),t}_resetElements(){st(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const i=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),s=this._animationsDisabled=!i.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0})===!1)return;const r=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let u=0,h=this.data.datasets.length;u<h;u++){const{controller:d}=this.getDatasetMeta(u),g=!s&&r.indexOf(d)===-1;d.buildOrUpdateElements(g),o=Math.max(+d.getMaxOverflow(),o)}o=this._minPadding=i.layout.autoPadding?o:0,this._updateLayout(o),s||st(r,u=>{u.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort($f("z","_idx"));const{_active:a,_lastEvent:l}=this;l?this._eventHandler(l,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){st(this.scales,t=>{qt.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),i=new Set(t.events);(!ef(e,i)||!!this._responsiveListeners!==t.responsive)&&(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:i,start:s,count:r}of e){const o=i==="_removeElements"?-r:r;D1(t,s,o)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,i=r=>new Set(t.filter(o=>o[0]===r).map((o,a)=>a+","+o.splice(1).join(","))),s=i(0);for(let r=1;r<e;r++)if(!ef(s,i(r)))return;return Array.from(s).map(r=>r.split(",")).map(r=>({method:r[1],start:+r[2],count:+r[3]}))}_updateLayout(t){if(this.notifyPlugins("beforeLayout",{cancelable:!0})===!1)return;qt.update(this,this.width,this.height,t);const e=this.chartArea,i=e.width<=0||e.height<=0;this._layers=[],st(this.boxes,s=>{i&&s.position==="chartArea"||(s.configure&&s.configure(),this._layers.push(...s._layers()))},this),this._layers.forEach((s,r)=>{s._idx=r}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})!==!1){for(let e=0,i=this.data.datasets.length;e<i;++e)this.getDatasetMeta(e).controller.configure();for(let e=0,i=this.data.datasets.length;e<i;++e)this._updateDataset(e,In(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this.getDatasetMeta(t),s={meta:i,index:t,mode:e,cancelable:!0};this.notifyPlugins("beforeDatasetUpdate",s)!==!1&&(i.controller._update(e),s.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",s))}render(){this.notifyPlugins("beforeRender",{cancelable:!0})!==!1&&(De.has(this)?this.attached&&!De.running(this)&&De.start(this):(this.draw(),Hf({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:i,height:s}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(i,s)}if(this.clear(),this.width<=0||this.height<=0||this.notifyPlugins("beforeDraw",{cancelable:!0})===!1)return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let s,r;for(s=0,r=e.length;s<r;++s){const o=e[s];(!t||o.visible)&&i.push(o)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0})===!1)return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,i={meta:t,index:t.index,cancelable:!0},s=g0(this,t);this.notifyPlugins("beforeDatasetDraw",i)!==!1&&(s&&aa(e,s),t.controller.draw(),s&&la(e),i.cancelable=!1,this.notifyPlugins("afterDatasetDraw",i))}isPointInArea(t){return ze(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,i,s){const r=RA.modes[e];return typeof r=="function"?r(this,t,i,s):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let s=i.filter(r=>r&&r._dataset===e).pop();return s||(s={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(s)),s}getContext(){return this.$context||(this.$context=An(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return typeof i.hidden=="boolean"?!i.hidden:!e.hidden}setDatasetVisibility(t,e){const i=this.getDatasetMeta(t);i.hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const s=i?"show":"hide",r=this.getDatasetMeta(t),o=r.controller._resolveAnimations(void 0,s);Bs(e)?(r.data[e].hidden=!i,this.update()):(this.setDatasetVisibility(t,i),o.update(r,{visible:i}),this.update(a=>a.datasetIndex===t?s:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),De.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),hf(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete oo[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,i=(r,o)=>{e.addEventListener(this,r,o),t[r]=o},s=(r,o,a)=>{r.offsetX=o,r.offsetY=a,this._eventHandler(r)};st(this.options.events,r=>i(r,s))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,i=(l,u)=>{e.addEventListener(this,l,u),t[l]=u},s=(l,u)=>{t[l]&&(e.removeEventListener(this,l,u),delete t[l])},r=(l,u)=>{this.canvas&&this.resize(l,u)};let o;const a=()=>{s("attach",a),this.attached=!0,this.resize(),i("resize",r),i("detach",o)};o=()=>{this.attached=!1,s("resize",r),this._stop(),this._resize(0,0),i("attach",a)},e.isAttached(this.canvas)?a():o()}unbindEvents(){st(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},st(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,i){const s=i?"set":"remove";let r,o,a,l;for(e==="dataset"&&(r=this.getDatasetMeta(t[0].datasetIndex),r.controller["_"+s+"DatasetHoverStyle"]()),a=0,l=t.length;a<l;++a){o=t[a];const u=o&&this.getDatasetMeta(o.datasetIndex).controller;u&&u[s+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],i=t.map(({datasetIndex:r,index:o})=>{const a=this.getDatasetMeta(r);if(!a)throw new Error("No dataset found at index "+r);return{datasetIndex:r,element:a.data[o],index:o}});!Co(i,e)&&(this._active=i,this._lastEvent=null,this._updateHoverStyles(i,e))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}isPluginEnabled(t){return this._plugins._cache.filter(e=>e.plugin.id===t).length===1}_updateHoverStyles(t,e,i){const s=this.options.hover,r=(l,u)=>l.filter(h=>!u.some(d=>h.datasetIndex===d.datasetIndex&&h.index===d.index)),o=r(e,t),a=i?t:r(t,e);o.length&&this.updateHoverStyle(o,s.mode,!1),a.length&&s.mode&&this.updateHoverStyle(a,s.mode,!0)}_eventHandler(t,e){const i={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},s=o=>(o.options.events||this.options.events).includes(t.native.type);if(this.notifyPlugins("beforeEvent",i,s)===!1)return;const r=this._handleEvent(t,e,i.inChartArea);return i.cancelable=!1,this.notifyPlugins("afterEvent",i,s),(r||i.changed)&&this.render(),this}_handleEvent(t,e,i){const{_active:s=[],options:r}=this,o=e,a=this._getActiveElements(t,s,i,o),l=UI(t),u=M1(t,this._lastEvent,i,l);i&&(this._lastEvent=null,ct(r.onHover,[t,a,this],this),l&&ct(r.onClick,[t,a,this],this));const h=!Co(a,s);return(h||e)&&(this._active=a,this._updateHoverStyles(a,s,e)),this._lastEvent=u,h}_getActiveElements(t,e,i,s){if(t.type==="mouseout")return[];if(!i)return e;const r=this.options.hover;return this.getElementsAtEventForMode(t,r.mode,r,s)}}B(ae,"defaults",gt),B(ae,"instances",oo),B(ae,"overrides",Yn),B(ae,"registry",be),B(ae,"version",P1),B(ae,"getChart",Wf);function qf(){return st(ae.instances,n=>n._plugins.invalidate())}function L1(n,t,e){const{startAngle:i,x:s,y:r,outerRadius:o,innerRadius:a,options:l}=t,{borderWidth:u,borderJoinStyle:h}=l,d=Math.min(u/o,Ht(i-e));if(n.beginPath(),n.arc(s,r,o-u/2,i+d/2,e-d/2),a>0){const g=Math.min(u/a,Ht(i-e));n.arc(s,r,a+u/2,e-g/2,i+g/2,!0)}else{const g=Math.min(u/2,o*Ht(i-e));if(h==="round")n.arc(s,r,g,e-it/2,i+it/2,!0);else if(h==="bevel"){const m=2*g*g,y=-m*Math.cos(e+it/2)+s,v=-m*Math.sin(e+it/2)+r,w=m*Math.cos(i+it/2)+s,A=m*Math.sin(i+it/2)+r;n.lineTo(y,v),n.lineTo(w,A)}}n.closePath(),n.moveTo(0,0),n.rect(0,0,n.canvas.width,n.canvas.height),n.clip("evenodd")}function O1(n,t,e){const{startAngle:i,pixelMargin:s,x:r,y:o,outerRadius:a,innerRadius:l}=t;let u=s/a;n.beginPath(),n.arc(r,o,a,i-u,e+u),l>s?(u=s/l,n.arc(r,o,l,e+u,i-u,!0)):n.arc(r,o,s,e+Et,i-Et),n.closePath(),n.clip()}function V1(n){return _u(n,["outerStart","outerEnd","innerStart","innerEnd"])}function N1(n,t,e,i){const s=V1(n.options.borderRadius),r=(e-t)/2,o=Math.min(r,i*t/2),a=l=>{const u=(e-Math.min(r,l))*i/2;return Rt(l,0,Math.min(r,u))};return{outerStart:a(s.outerStart),outerEnd:a(s.outerEnd),innerStart:Rt(s.innerStart,0,o),innerEnd:Rt(s.innerEnd,0,o)}}function ui(n,t,e,i){return{x:e+n*Math.cos(t),y:i+n*Math.sin(t)}}function No(n,t,e,i,s,r){const{x:o,y:a,startAngle:l,pixelMargin:u,innerRadius:h}=t,d=Math.max(t.outerRadius+i+e-u,0),g=h>0?h+i+e+u:0;let m=0;const y=s-l;if(i){const J=h>0?h-i:0,lt=d>0?d-i:0,ot=(J+lt)/2,Ct=ot!==0?y*ot/(ot+i):y;m=(y-Ct)/2}const v=Math.max(.001,y*d-e/it)/d,w=(y-v)/2,A=l+w+m,R=s-w-m,{outerStart:D,outerEnd:L,innerStart:M,innerEnd:V}=N1(t,g,d,R-A),E=d-D,b=d-L,x=A+D/E,I=R-L/b,T=g+M,S=g+V,k=A+M/T,mt=R-V/S;if(n.beginPath(),r){const J=(x+I)/2;if(n.arc(o,a,d,x,J),n.arc(o,a,d,J,I),L>0){const kt=ui(b,I,o,a);n.arc(kt.x,kt.y,L,I,R+Et)}const lt=ui(S,R,o,a);if(n.lineTo(lt.x,lt.y),V>0){const kt=ui(S,mt,o,a);n.arc(kt.x,kt.y,V,R+Et,mt+Math.PI)}const ot=(R-V/g+(A+M/g))/2;if(n.arc(o,a,g,R-V/g,ot,!0),n.arc(o,a,g,ot,A+M/g,!0),M>0){const kt=ui(T,k,o,a);n.arc(kt.x,kt.y,M,k+Math.PI,A-Et)}const Ct=ui(E,A,o,a);if(n.lineTo(Ct.x,Ct.y),D>0){const kt=ui(E,x,o,a);n.arc(kt.x,kt.y,D,A-Et,x)}}else{n.moveTo(o,a);const J=Math.cos(x)*d+o,lt=Math.sin(x)*d+a;n.lineTo(J,lt);const ot=Math.cos(I)*d+o,Ct=Math.sin(I)*d+a;n.lineTo(ot,Ct)}n.closePath()}function F1(n,t,e,i,s){const{fullCircles:r,startAngle:o,circumference:a}=t;let l=t.endAngle;if(r){No(n,t,e,i,l,s);for(let u=0;u<r;++u)n.fill();isNaN(a)||(l=o+(a%dt||dt))}return No(n,t,e,i,l,s),n.fill(),l}function B1(n,t,e,i,s){const{fullCircles:r,startAngle:o,circumference:a,options:l}=t,{borderWidth:u,borderJoinStyle:h,borderDash:d,borderDashOffset:g,borderRadius:m}=l,y=l.borderAlign==="inner";if(!u)return;n.setLineDash(d||[]),n.lineDashOffset=g,y?(n.lineWidth=u*2,n.lineJoin=h||"round"):(n.lineWidth=u,n.lineJoin=h||"bevel");let v=t.endAngle;if(r){No(n,t,e,i,v,s);for(let w=0;w<r;++w)n.stroke();isNaN(a)||(v=o+(a%dt||dt))}y&&O1(n,t,v),l.selfJoin&&v-o>=it&&m===0&&h!=="miter"&&L1(n,t,v),r||(No(n,t,e,i,v,s),n.stroke())}class ms extends ye{constructor(e){super();B(this,"circumference");B(this,"endAngle");B(this,"fullCircles");B(this,"innerRadius");B(this,"outerRadius");B(this,"pixelMargin");B(this,"startAngle");this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,e&&Object.assign(this,e)}inRange(e,i,s){const r=this.getProps(["x","y"],s),{angle:o,distance:a}=Km(r,{x:e,y:i}),{startAngle:l,endAngle:u,innerRadius:h,outerRadius:d,circumference:g}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],s),m=(this.options.spacing+this.options.borderWidth)/2,y=q(g,u-l),v=Us(o,l,u)&&l!==u,w=y>=dt||v,A=Ue(a,h+m,d+m);return w&&A}getCenterPoint(e){const{x:i,y:s,startAngle:r,endAngle:o,innerRadius:a,outerRadius:l}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],e),{offset:u,spacing:h}=this.options,d=(r+o)/2,g=(a+l+h+u)/2;return{x:i+Math.cos(d)*g,y:s+Math.sin(d)*g}}tooltipPosition(e){return this.getCenterPoint(e)}draw(e){const{options:i,circumference:s}=this,r=(i.offset||0)/4,o=(i.spacing||0)/2,a=i.circular;if(this.pixelMargin=i.borderAlign==="inner"?.33:0,this.fullCircles=s>dt?Math.floor(s/dt):0,s===0||this.innerRadius<0||this.outerRadius<0)return;e.save();const l=(this.startAngle+this.endAngle)/2;e.translate(Math.cos(l)*r,Math.sin(l)*r);const u=1-Math.sin(Math.min(it,s||0)),h=r*u;e.fillStyle=i.backgroundColor,e.strokeStyle=i.borderColor,F1(e,this,h,o,a),B1(e,this,h,o,a),e.restore()}}B(ms,"id","arc"),B(ms,"defaults",{borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0,selfJoin:!1}),B(ms,"defaultRoutes",{backgroundColor:"backgroundColor"}),B(ms,"descriptors",{_scriptable:!0,_indexable:e=>e!=="borderDash"});function A0(n,t,e=t){n.lineCap=q(e.borderCapStyle,t.borderCapStyle),n.setLineDash(q(e.borderDash,t.borderDash)),n.lineDashOffset=q(e.borderDashOffset,t.borderDashOffset),n.lineJoin=q(e.borderJoinStyle,t.borderJoinStyle),n.lineWidth=q(e.borderWidth,t.borderWidth),n.strokeStyle=q(e.borderColor,t.borderColor)}function U1(n,t,e){n.lineTo(e.x,e.y)}function j1(n){return n.stepped?cT:n.tension||n.cubicInterpolationMode==="monotone"?uT:U1}function S0(n,t,e={}){const i=n.length,{start:s=0,end:r=i-1}=e,{start:o,end:a}=t,l=Math.max(s,o),u=Math.min(r,a),h=s<o&&r<o||s>a&&r>a;return{count:i,start:l,loop:t.loop,ilen:u<l&&!h?i+u-l:u-l}}function z1(n,t,e,i){const{points:s,options:r}=t,{count:o,start:a,loop:l,ilen:u}=S0(s,e,i),h=j1(r);let{move:d=!0,reverse:g}=i||{},m,y,v;for(m=0;m<=u;++m)y=s[(a+(g?u-m:m))%o],!y.skip&&(d?(n.moveTo(y.x,y.y),d=!1):h(n,v,y,g,r.stepped),v=y);return l&&(y=s[(a+(g?u:0))%o],h(n,v,y,g,r.stepped)),!!l}function $1(n,t,e,i){const s=t.points,{count:r,start:o,ilen:a}=S0(s,e,i),{move:l=!0,reverse:u}=i||{};let h=0,d=0,g,m,y,v,w,A;const R=L=>(o+(u?a-L:L))%r,D=()=>{v!==w&&(n.lineTo(h,w),n.lineTo(h,v),n.lineTo(h,A))};for(l&&(m=s[R(0)],n.moveTo(m.x,m.y)),g=0;g<=a;++g){if(m=s[R(g)],m.skip)continue;const L=m.x,M=m.y,V=L|0;V===y?(M<v?v=M:M>w&&(w=M),h=(d*h+L)/++d):(D(),n.lineTo(L,M),y=V,d=0,v=w=M),A=M}D()}function ql(n){const t=n.options,e=t.borderDash&&t.borderDash.length;return!n._decimated&&!n._loop&&!t.tension&&t.cubicInterpolationMode!=="monotone"&&!t.stepped&&!e?$1:z1}function H1(n){return n.stepped?zT:n.tension||n.cubicInterpolationMode==="monotone"?$T:Fn}function W1(n,t,e,i){let s=t._path;s||(s=t._path=new Path2D,t.path(s,e,i)&&s.closePath()),A0(n,t.options),n.stroke(s)}function q1(n,t,e,i){const{segments:s,options:r}=t,o=ql(t);for(const a of s)A0(n,r,a.style),n.beginPath(),o(n,t,a,{start:e,end:e+i-1})&&n.closePath(),n.stroke()}const K1=typeof Path2D=="function";function G1(n,t,e,i){K1&&!t.options.segment?W1(n,t,e,i):q1(n,t,e,i)}class un extends ye{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this.options;if((i.tension||i.cubicInterpolationMode==="monotone")&&!i.stepped&&!this._pointsUpdated){const s=i.spanGaps?this._loop:this._fullLoop;LT(this._points,i,t,s,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=YT(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this.options,s=t[e],r=this.points,o=f0(this,{property:e,start:s,end:s});if(!o.length)return;const a=[],l=H1(i);let u,h;for(u=0,h=o.length;u<h;++u){const{start:d,end:g}=o[u],m=r[d],y=r[g];if(m===y){a.push(m);continue}const v=Math.abs((s-m[e])/(y[e]-m[e])),w=l(m,y,v,i.stepped);w[e]=t[e],a.push(w)}return a.length===1?a[0]:a}pathSegment(t,e,i){return ql(this)(t,this,e,i)}path(t,e,i){const s=this.segments,r=ql(this);let o=this._loop;e=e||0,i=i||this.points.length-e;for(const a of s)o&=r(t,this,a,{start:e,end:e+i-1});return!!o}draw(t,e,i,s){const r=this.options||{};(this.points||[]).length&&r.borderWidth&&(t.save(),G1(t,this,i,s),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}B(un,"id","line"),B(un,"defaults",{borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0}),B(un,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"}),B(un,"descriptors",{_scriptable:!0,_indexable:t=>t!=="borderDash"&&t!=="fill"});function Kf(n,t,e,i){const s=n.options,{[e]:r}=n.getProps([e],i);return Math.abs(t-r)<s.radius+s.hitRadius}class ao extends ye{constructor(e){super();B(this,"parsed");B(this,"skip");B(this,"stop");this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,e&&Object.assign(this,e)}inRange(e,i,s){const r=this.options,{x:o,y:a}=this.getProps(["x","y"],s);return Math.pow(e-o,2)+Math.pow(i-a,2)<Math.pow(r.hitRadius+r.radius,2)}inXRange(e,i){return Kf(this,e,"x",i)}inYRange(e,i){return Kf(this,e,"y",i)}getCenterPoint(e){const{x:i,y:s}=this.getProps(["x","y"],e);return{x:i,y:s}}size(e){e=e||this.options||{};let i=e.radius||0;i=Math.max(i,i&&e.hoverRadius||0);const s=i&&e.borderWidth||0;return(i+s)*2}draw(e,i){const s=this.options;this.skip||s.radius<.1||!ze(this,i,this.size(s)/2)||(e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.fillStyle=s.backgroundColor,zl(e,s,this.x,this.y))}getRange(){const e=this.options||{};return e.radius+e.hitRadius}}B(ao,"id","point"),B(ao,"defaults",{borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0}),B(ao,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});function P0(n,t){const{x:e,y:i,base:s,width:r,height:o}=n.getProps(["x","y","base","width","height"],t);let a,l,u,h,d;return n.horizontal?(d=o/2,a=Math.min(e,s),l=Math.max(e,s),u=i-d,h=i+d):(d=r/2,a=e-d,l=e+d,u=Math.min(i,s),h=Math.max(i,s)),{left:a,top:u,right:l,bottom:h}}function hn(n,t,e,i){return n?0:Rt(t,e,i)}function Y1(n,t,e){const i=n.options.borderWidth,s=n.borderSkipped,r=n0(i);return{t:hn(s.top,r.top,0,e),r:hn(s.right,r.right,0,t),b:hn(s.bottom,r.bottom,0,e),l:hn(s.left,r.left,0,t)}}function Q1(n,t,e){const{enableBorderRadius:i}=n.getProps(["enableBorderRadius"]),s=n.options.borderRadius,r=$n(s),o=Math.min(t,e),a=n.borderSkipped,l=i||Q(s);return{topLeft:hn(!l||a.top||a.left,r.topLeft,0,o),topRight:hn(!l||a.top||a.right,r.topRight,0,o),bottomLeft:hn(!l||a.bottom||a.left,r.bottomLeft,0,o),bottomRight:hn(!l||a.bottom||a.right,r.bottomRight,0,o)}}function X1(n){const t=P0(n),e=t.right-t.left,i=t.bottom-t.top,s=Y1(n,e/2,i/2),r=Q1(n,e/2,i/2);return{outer:{x:t.left,y:t.top,w:e,h:i,radius:r},inner:{x:t.left+s.l,y:t.top+s.t,w:e-s.l-s.r,h:i-s.t-s.b,radius:{topLeft:Math.max(0,r.topLeft-Math.max(s.t,s.l)),topRight:Math.max(0,r.topRight-Math.max(s.t,s.r)),bottomLeft:Math.max(0,r.bottomLeft-Math.max(s.b,s.l)),bottomRight:Math.max(0,r.bottomRight-Math.max(s.b,s.r))}}}}function ol(n,t,e,i){const s=t===null,r=e===null,a=n&&!(s&&r)&&P0(n,i);return a&&(s||Ue(t,a.left,a.right))&&(r||Ue(e,a.top,a.bottom))}function J1(n){return n.topLeft||n.topRight||n.bottomLeft||n.bottomRight}function Z1(n,t){n.rect(t.x,t.y,t.w,t.h)}function al(n,t,e={}){const i=n.x!==e.x?-t:0,s=n.y!==e.y?-t:0,r=(n.x+n.w!==e.x+e.w?t:0)-i,o=(n.y+n.h!==e.y+e.h?t:0)-s;return{x:n.x+i,y:n.y+s,w:n.w+r,h:n.h+o,radius:n.radius}}class lo extends ye{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:i,backgroundColor:s}}=this,{inner:r,outer:o}=X1(this),a=J1(o.radius)?js:Z1;t.save(),(o.w!==r.w||o.h!==r.h)&&(t.beginPath(),a(t,al(o,e,r)),t.clip(),a(t,al(r,-e,o)),t.fillStyle=i,t.fill("evenodd")),t.beginPath(),a(t,al(r,e)),t.fillStyle=s,t.fill(),t.restore()}inRange(t,e,i){return ol(this,t,e,i)}inXRange(t,e){return ol(this,t,null,e)}inYRange(t,e){return ol(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:s,horizontal:r}=this.getProps(["x","y","base","horizontal"],t);return{x:r?(e+s)/2:e,y:r?i:(i+s)/2}}getRange(t){return t==="x"?this.width/2:this.height/2}}B(lo,"id","bar"),B(lo,"defaults",{borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0}),B(lo,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});var tS=Object.freeze({__proto__:null,ArcElement:ms,BarElement:lo,LineElement:un,PointElement:ao});const Kl=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],Gf=Kl.map(n=>n.replace("rgb(","rgba(").replace(")",", 0.5)"));function R0(n){return Kl[n%Kl.length]}function C0(n){return Gf[n%Gf.length]}function eS(n,t){return n.borderColor=R0(t),n.backgroundColor=C0(t),++t}function nS(n,t){return n.backgroundColor=n.data.map(()=>R0(t++)),t}function iS(n,t){return n.backgroundColor=n.data.map(()=>C0(t++)),t}function sS(n){let t=0;return(e,i)=>{const s=n.getDatasetMeta(i).controller;s instanceof Un?t=nS(e,t):s instanceof Ss?t=iS(e,t):s&&(t=eS(e,t))}}function Yf(n){let t;for(t in n)if(n[t].borderColor||n[t].backgroundColor)return!0;return!1}function rS(n){return n&&(n.borderColor||n.backgroundColor)}function oS(){return gt.borderColor!=="rgba(0,0,0,0.1)"||gt.backgroundColor!=="rgba(0,0,0,0.1)"}var aS={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(n,t,e){if(!e.enabled)return;const{data:{datasets:i},options:s}=n.config,{elements:r}=s,o=Yf(i)||rS(s)||r&&Yf(r)||oS();if(!e.forceOverride&&o)return;const a=sS(n);i.forEach(a)}};function lS(n,t,e,i,s){const r=s.samples||i;if(r>=e)return n.slice(t,t+e);const o=[],a=(e-2)/(r-2);let l=0;const u=t+e-1;let h=t,d,g,m,y,v;for(o[l++]=n[h],d=0;d<r-2;d++){let w=0,A=0,R;const D=Math.floor((d+1)*a)+1+t,L=Math.min(Math.floor((d+2)*a)+1,e)+t,M=L-D;for(R=D;R<L;R++)w+=n[R].x,A+=n[R].y;w/=M,A/=M;const V=Math.floor(d*a)+1+t,E=Math.min(Math.floor((d+1)*a)+1,e)+t,{x:b,y:x}=n[h];for(m=y=-1,R=V;R<E;R++)y=.5*Math.abs((b-w)*(n[R].y-x)-(b-n[R].x)*(A-x)),y>m&&(m=y,g=n[R],v=R);o[l++]=g,h=v}return o[l++]=n[u],o}function cS(n,t,e,i){let s=0,r=0,o,a,l,u,h,d,g,m,y,v;const w=[],A=t+e-1,R=n[t].x,L=n[A].x-R;for(o=t;o<t+e;++o){a=n[o],l=(a.x-R)/L*i,u=a.y;const M=l|0;if(M===h)u<y?(y=u,d=o):u>v&&(v=u,g=o),s=(r*s+a.x)/++r;else{const V=o-1;if(!G(d)&&!G(g)){const E=Math.min(d,g),b=Math.max(d,g);E!==m&&E!==V&&w.push({...n[E],x:s}),b!==m&&b!==V&&w.push({...n[b],x:s})}o>0&&V!==m&&w.push(n[V]),w.push(a),h=M,r=0,y=v=u,d=g=m=o}}return w}function D0(n){if(n._decimated){const t=n._data;delete n._decimated,delete n._data,Object.defineProperty(n,"data",{configurable:!0,enumerable:!0,writable:!0,value:t})}}function Qf(n){n.data.datasets.forEach(t=>{D0(t)})}function uS(n,t){const e=t.length;let i=0,s;const{iScale:r}=n,{min:o,max:a,minDefined:l,maxDefined:u}=r.getUserBounds();return l&&(i=Rt(je(t,r.axis,o).lo,0,e-1)),u?s=Rt(je(t,r.axis,a).hi+1,i,e)-i:s=e-i,{start:i,count:s}}var hS={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(n,t,e)=>{if(!e.enabled){Qf(n);return}const i=n.width;n.data.datasets.forEach((s,r)=>{const{_data:o,indexAxis:a}=s,l=n.getDatasetMeta(r),u=o||s.data;if(gs([a,n.options.indexAxis])==="y"||!l.controller.supportsDecimation)return;const h=n.scales[l.xAxisID];if(h.type!=="linear"&&h.type!=="time"||n.options.parsing)return;let{start:d,count:g}=uS(l,u);const m=e.threshold||4*i;if(g<=m){D0(s);return}G(o)&&(s._data=u,delete s.data,Object.defineProperty(s,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(v){this._data=v}}));let y;switch(e.algorithm){case"lttb":y=lS(u,d,g,i,e);break;case"min-max":y=cS(u,d,g,i);break;default:throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)}s._decimated=y})},destroy(n){Qf(n)}};function dS(n,t,e){const i=n.segments,s=n.points,r=t.points,o=[];for(const a of i){let{start:l,end:u}=a;u=ha(l,u,s);const h=Gl(e,s[l],s[u],a.loop);if(!t.segments){o.push({source:a,target:h,start:s[l],end:s[u]});continue}const d=f0(t,h);for(const g of d){const m=Gl(e,r[g.start],r[g.end],g.loop),y=d0(a,s,m);for(const v of y)o.push({source:v,target:g,start:{[e]:Xf(h,m,"start",Math.max)},end:{[e]:Xf(h,m,"end",Math.min)}})}}return o}function Gl(n,t,e,i){if(i)return;let s=t[n],r=e[n];return n==="angle"&&(s=Ht(s),r=Ht(r)),{property:n,start:s,end:r}}function fS(n,t){const{x:e=null,y:i=null}=n||{},s=t.points,r=[];return t.segments.forEach(({start:o,end:a})=>{a=ha(o,a,s);const l=s[o],u=s[a];i!==null?(r.push({x:l.x,y:i}),r.push({x:u.x,y:i})):e!==null&&(r.push({x:e,y:l.y}),r.push({x:e,y:u.y}))}),r}function ha(n,t,e){for(;t>n;t--){const i=e[t];if(!isNaN(i.x)&&!isNaN(i.y))break}return t}function Xf(n,t,e,i){return n&&t?i(n[e],t[e]):n?n[e]:t?t[e]:0}function M0(n,t){let e=[],i=!1;return ft(n)?(i=!0,e=n):e=fS(n,t),e.length?new un({points:e,options:{tension:0},_loop:i,_fullLoop:i}):null}function Jf(n){return n&&n.fill!==!1}function gS(n,t,e){let s=n[t].fill;const r=[t];let o;if(!e)return s;for(;s!==!1&&r.indexOf(s)===-1;){if(!wt(s))return s;if(o=n[s],!o)return!1;if(o.visible)return s;r.push(s),s=o.fill}return!1}function pS(n,t,e){const i=bS(n);if(Q(i))return isNaN(i.value)?!1:i;let s=parseFloat(i);return wt(s)&&Math.floor(s)===s?mS(i[0],t,s,e):["origin","start","end","stack","shape"].indexOf(i)>=0&&i}function mS(n,t,e,i){return(n==="-"||n==="+")&&(e=t+e),e===t||e<0||e>=i?!1:e}function yS(n,t){let e=null;return n==="start"?e=t.bottom:n==="end"?e=t.top:Q(n)?e=t.getPixelForValue(n.value):t.getBasePixel&&(e=t.getBasePixel()),e}function _S(n,t,e){let i;return n==="start"?i=e:n==="end"?i=t.options.reverse?t.min:t.max:Q(n)?i=n.value:i=t.getBaseValue(),i}function bS(n){const t=n.options,e=t.fill;let i=q(e&&e.target,e);return i===void 0&&(i=!!t.backgroundColor),i===!1||i===null?!1:i===!0?"origin":i}function vS(n){const{scale:t,index:e,line:i}=n,s=[],r=i.segments,o=i.points,a=wS(t,e);a.push(M0({x:null,y:t.bottom},i));for(let l=0;l<r.length;l++){const u=r[l];for(let h=u.start;h<=u.end;h++)xS(s,o[h],a)}return new un({points:s,options:{}})}function wS(n,t){const e=[],i=n.getMatchingVisibleMetas("line");for(let s=0;s<i.length;s++){const r=i[s];if(r.index===t)break;r.hidden||e.unshift(r.dataset)}return e}function xS(n,t,e){const i=[];for(let s=0;s<e.length;s++){const r=e[s],{first:o,last:a,point:l}=ES(r,t,"x");if(!(!l||o&&a)){if(o)i.unshift(l);else if(n.push(l),!a)break}}n.push(...i)}function ES(n,t,e){const i=n.interpolate(t,e);if(!i)return{};const s=i[e],r=n.segments,o=n.points;let a=!1,l=!1;for(let u=0;u<r.length;u++){const h=r[u],d=o[h.start][e],g=o[h.end][e];if(Ue(s,d,g)){a=s===d,l=s===g;break}}return{first:a,last:l,point:i}}class L0{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:s,y:r,radius:o}=this;return e=e||{start:0,end:dt},t.arc(s,r,o,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:s}=this,r=t.angle;return{x:e+Math.cos(r)*s,y:i+Math.sin(r)*s,angle:r}}}function kS(n){const{chart:t,fill:e,line:i}=n;if(wt(e))return IS(t,e);if(e==="stack")return vS(n);if(e==="shape")return!0;const s=TS(n);return s instanceof L0?s:M0(s,i)}function IS(n,t){const e=n.getDatasetMeta(t);return e&&n.isDatasetVisible(t)?e.dataset:null}function TS(n){return(n.scale||{}).getPointPositionForValue?SS(n):AS(n)}function AS(n){const{scale:t={},fill:e}=n,i=yS(e,t);if(wt(i)){const s=t.isHorizontal();return{x:s?i:null,y:s?null:i}}return null}function SS(n){const{scale:t,fill:e}=n,i=t.options,s=t.getLabels().length,r=i.reverse?t.max:t.min,o=_S(e,t,r),a=[];if(i.grid.circular){const l=t.getPointPositionForValue(0,r);return new L0({x:l.x,y:l.y,radius:t.getDistanceFromCenterForValue(o)})}for(let l=0;l<s;++l)a.push(t.getPointPositionForValue(l,o));return a}function ll(n,t,e){const i=kS(t),{chart:s,index:r,line:o,scale:a,axis:l}=t,u=o.options,h=u.fill,d=u.backgroundColor,{above:g=d,below:m=d}=h||{},y=s.getDatasetMeta(r),v=g0(s,y);i&&o.points.length&&(aa(n,e),PS(n,{line:o,target:i,above:g,below:m,area:e,scale:a,axis:l,clip:v}),la(n))}function PS(n,t){const{line:e,target:i,above:s,below:r,area:o,scale:a,clip:l}=t,u=e._loop?"angle":t.axis;n.save();let h=r;r!==s&&(u==="x"?(Zf(n,i,o.top),cl(n,{line:e,target:i,color:s,scale:a,property:u,clip:l}),n.restore(),n.save(),Zf(n,i,o.bottom)):u==="y"&&(tg(n,i,o.left),cl(n,{line:e,target:i,color:r,scale:a,property:u,clip:l}),n.restore(),n.save(),tg(n,i,o.right),h=s)),cl(n,{line:e,target:i,color:h,scale:a,property:u,clip:l}),n.restore()}function Zf(n,t,e){const{segments:i,points:s}=t;let r=!0,o=!1;n.beginPath();for(const a of i){const{start:l,end:u}=a,h=s[l],d=s[ha(l,u,s)];r?(n.moveTo(h.x,h.y),r=!1):(n.lineTo(h.x,e),n.lineTo(h.x,h.y)),o=!!t.pathSegment(n,a,{move:o}),o?n.closePath():n.lineTo(d.x,e)}n.lineTo(t.first().x,e),n.closePath(),n.clip()}function tg(n,t,e){const{segments:i,points:s}=t;let r=!0,o=!1;n.beginPath();for(const a of i){const{start:l,end:u}=a,h=s[l],d=s[ha(l,u,s)];r?(n.moveTo(h.x,h.y),r=!1):(n.lineTo(e,h.y),n.lineTo(h.x,h.y)),o=!!t.pathSegment(n,a,{move:o}),o?n.closePath():n.lineTo(e,d.y)}n.lineTo(e,t.first().y),n.closePath(),n.clip()}function cl(n,t){const{line:e,target:i,property:s,color:r,scale:o,clip:a}=t,l=dS(e,i,s);for(const{source:u,target:h,start:d,end:g}of l){const{style:{backgroundColor:m=r}={}}=u,y=i!==!0;n.save(),n.fillStyle=m,RS(n,o,a,y&&Gl(s,d,g)),n.beginPath();const v=!!e.pathSegment(n,u);let w;if(y){v?n.closePath():eg(n,i,g,s);const A=!!i.pathSegment(n,h,{move:v,reverse:!0});w=v&&A,w||eg(n,i,d,s)}n.closePath(),n.fill(w?"evenodd":"nonzero"),n.restore()}}function RS(n,t,e,i){const s=t.chart.chartArea,{property:r,start:o,end:a}=i||{};if(r==="x"||r==="y"){let l,u,h,d;r==="x"?(l=o,u=s.top,h=a,d=s.bottom):(l=s.left,u=o,h=s.right,d=a),n.beginPath(),e&&(l=Math.max(l,e.left),h=Math.min(h,e.right),u=Math.max(u,e.top),d=Math.min(d,e.bottom)),n.rect(l,u,h-l,d-u),n.clip()}}function eg(n,t,e,i){const s=t.interpolate(e,i);s&&n.lineTo(s.x,s.y)}var CS={id:"filler",afterDatasetsUpdate(n,t,e){const i=(n.data.datasets||[]).length,s=[];let r,o,a,l;for(o=0;o<i;++o)r=n.getDatasetMeta(o),a=r.dataset,l=null,a&&a.options&&a instanceof un&&(l={visible:n.isDatasetVisible(o),index:o,fill:pS(a,o,i),chart:n,axis:r.controller.options.indexAxis,scale:r.vScale,line:a}),r.$filler=l,s.push(l);for(o=0;o<i;++o)l=s[o],!(!l||l.fill===!1)&&(l.fill=gS(s,o,e.propagate))},beforeDraw(n,t,e){const i=e.drawTime==="beforeDraw",s=n.getSortedVisibleDatasetMetas(),r=n.chartArea;for(let o=s.length-1;o>=0;--o){const a=s[o].$filler;a&&(a.line.updateControlPoints(r,a.axis),i&&a.fill&&ll(n.ctx,a,r))}},beforeDatasetsDraw(n,t,e){if(e.drawTime!=="beforeDatasetsDraw")return;const i=n.getSortedVisibleDatasetMetas();for(let s=i.length-1;s>=0;--s){const r=i[s].$filler;Jf(r)&&ll(n.ctx,r,n.chartArea)}},beforeDatasetDraw(n,t,e){const i=t.meta.$filler;!Jf(i)||e.drawTime!=="beforeDatasetDraw"||ll(n.ctx,i,n.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const ng=(n,t)=>{let{boxHeight:e=t,boxWidth:i=t}=n;return n.usePointStyle&&(e=Math.min(e,t),i=n.pointStyleWidth||Math.min(i,t)),{boxWidth:i,boxHeight:e,itemHeight:Math.max(t,e)}},DS=(n,t)=>n!==null&&t!==null&&n.datasetIndex===t.datasetIndex&&n.index===t.index;class ig extends ye{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){this.maxWidth=t,this.maxHeight=e,this._margins=i,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=ct(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(i=>t.filter(i,this.chart.data))),t.sort&&(e=e.sort((i,s)=>t.sort(i,s,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display){this.width=this.height=0;return}const i=t.labels,s=St(i.font),r=s.size,o=this._computeTitleHeight(),{boxWidth:a,itemHeight:l}=ng(i,r);let u,h;e.font=s.string,this.isHorizontal()?(u=this.maxWidth,h=this._fitRows(o,r,a,l)+10):(h=this.maxHeight,u=this._fitCols(o,s,a,l)+10),this.width=Math.min(u,t.maxWidth||this.maxWidth),this.height=Math.min(h,t.maxHeight||this.maxHeight)}_fitRows(t,e,i,s){const{ctx:r,maxWidth:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],u=this.lineWidths=[0],h=s+a;let d=t;r.textAlign="left",r.textBaseline="middle";let g=-1,m=-h;return this.legendItems.forEach((y,v)=>{const w=i+e/2+r.measureText(y.text).width;(v===0||u[u.length-1]+w+2*a>o)&&(d+=h,u[u.length-(v>0?0:1)]=0,m+=h,g++),l[v]={left:0,top:m,row:g,width:w,height:s},u[u.length-1]+=w+a}),d}_fitCols(t,e,i,s){const{ctx:r,maxHeight:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],u=this.columnSizes=[],h=o-t;let d=a,g=0,m=0,y=0,v=0;return this.legendItems.forEach((w,A)=>{const{itemWidth:R,itemHeight:D}=MS(i,e,r,w,s);A>0&&m+D+2*a>h&&(d+=g+a,u.push({width:g,height:m}),y+=g+a,v++,g=m=0),l[A]={left:y,top:m,col:v,width:R,height:D},g=Math.max(g,R),m+=D+a}),d+=g,u.push({width:g,height:m}),d}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:i,labels:{padding:s},rtl:r}}=this,o=bi(r,this.left,this.width);if(this.isHorizontal()){let a=0,l=zt(i,this.left+s,this.right-this.lineWidths[a]);for(const u of e)a!==u.row&&(a=u.row,l=zt(i,this.left+s,this.right-this.lineWidths[a])),u.top+=this.top+t+s,u.left=o.leftForLtr(o.x(l),u.width),l+=u.width+s}else{let a=0,l=zt(i,this.top+t+s,this.bottom-this.columnSizes[a].height);for(const u of e)u.col!==a&&(a=u.col,l=zt(i,this.top+t+s,this.bottom-this.columnSizes[a].height)),u.top=l,u.left+=this.left+s,u.left=o.leftForLtr(o.x(u.left),u.width),l+=u.height+s}}isHorizontal(){return this.options.position==="top"||this.options.position==="bottom"}draw(){if(this.options.display){const t=this.ctx;aa(t,this),this._draw(),la(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:i,ctx:s}=this,{align:r,labels:o}=t,a=gt.color,l=bi(t.rtl,this.left,this.width),u=St(o.font),{padding:h}=o,d=u.size,g=d/2;let m;this.drawTitle(),s.textAlign=l.textAlign("left"),s.textBaseline="middle",s.lineWidth=.5,s.font=u.string;const{boxWidth:y,boxHeight:v,itemHeight:w}=ng(o,d),A=function(V,E,b){if(isNaN(y)||y<=0||isNaN(v)||v<0)return;s.save();const x=q(b.lineWidth,1);if(s.fillStyle=q(b.fillStyle,a),s.lineCap=q(b.lineCap,"butt"),s.lineDashOffset=q(b.lineDashOffset,0),s.lineJoin=q(b.lineJoin,"miter"),s.lineWidth=x,s.strokeStyle=q(b.strokeStyle,a),s.setLineDash(q(b.lineDash,[])),o.usePointStyle){const I={radius:v*Math.SQRT2/2,pointStyle:b.pointStyle,rotation:b.rotation,borderWidth:x},T=l.xPlus(V,y/2),S=E+g;e0(s,I,T,S,o.pointStyleWidth&&y)}else{const I=E+Math.max((d-v)/2,0),T=l.leftForLtr(V,y),S=$n(b.borderRadius);s.beginPath(),Object.values(S).some(k=>k!==0)?js(s,{x:T,y:I,w:y,h:v,radius:S}):s.rect(T,I,y,v),s.fill(),x!==0&&s.stroke()}s.restore()},R=function(V,E,b){Qn(s,b.text,V,E+w/2,u,{strikethrough:b.hidden,textAlign:l.textAlign(b.textAlign)})},D=this.isHorizontal(),L=this._computeTitleHeight();D?m={x:zt(r,this.left+h,this.right-i[0]),y:this.top+h+L,line:0}:m={x:this.left+h,y:zt(r,this.top+L+h,this.bottom-e[0].height),line:0},c0(this.ctx,t.textDirection);const M=w+h;this.legendItems.forEach((V,E)=>{s.strokeStyle=V.fontColor,s.fillStyle=V.fontColor;const b=s.measureText(V.text).width,x=l.textAlign(V.textAlign||(V.textAlign=o.textAlign)),I=y+g+b;let T=m.x,S=m.y;l.setWidth(this.width),D?E>0&&T+I+h>this.right&&(S=m.y+=M,m.line++,T=m.x=zt(r,this.left+h,this.right-i[m.line])):E>0&&S+M>this.bottom&&(T=m.x=T+e[m.line].width+h,m.line++,S=m.y=zt(r,this.top+L+h,this.bottom-e[m.line].height));const k=l.x(T);if(A(k,S,V),T=JI(x,T+y+g,D?T+I:this.right,t.rtl),R(l.x(T),S,V),D)m.x+=I+h;else if(typeof V.text!="string"){const mt=u.lineHeight;m.y+=O0(V,mt)+h}else m.y+=M}),u0(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,i=St(e.font),s=Gt(e.padding);if(!e.display)return;const r=bi(t.rtl,this.left,this.width),o=this.ctx,a=e.position,l=i.size/2,u=s.top+l;let h,d=this.left,g=this.width;if(this.isHorizontal())g=Math.max(...this.lineWidths),h=this.top+u,d=zt(t.align,d,this.right-g);else{const y=this.columnSizes.reduce((v,w)=>Math.max(v,w.height),0);h=u+zt(t.align,this.top,this.bottom-y-t.labels.padding-this._computeTitleHeight())}const m=zt(a,d,d+g);o.textAlign=r.textAlign(mu(a)),o.textBaseline="middle",o.strokeStyle=e.color,o.fillStyle=e.color,o.font=i.string,Qn(o,e.text,m,h,i)}_computeTitleHeight(){const t=this.options.title,e=St(t.font),i=Gt(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){let i,s,r;if(Ue(t,this.left,this.right)&&Ue(e,this.top,this.bottom)){for(r=this.legendHitBoxes,i=0;i<r.length;++i)if(s=r[i],Ue(t,s.left,s.left+s.width)&&Ue(e,s.top,s.top+s.height))return this.legendItems[i]}return null}handleEvent(t){const e=this.options;if(!VS(t.type,e))return;const i=this._getLegendItemAt(t.x,t.y);if(t.type==="mousemove"||t.type==="mouseout"){const s=this._hoveredItem,r=DS(s,i);s&&!r&&ct(e.onLeave,[t,s,this],this),this._hoveredItem=i,i&&!r&&ct(e.onHover,[t,i,this],this)}else i&&ct(e.onClick,[t,i,this],this)}}function MS(n,t,e,i,s){const r=LS(i,n,t,e),o=OS(s,i,t.lineHeight);return{itemWidth:r,itemHeight:o}}function LS(n,t,e,i){let s=n.text;return s&&typeof s!="string"&&(s=s.reduce((r,o)=>r.length>o.length?r:o)),t+e.size/2+i.measureText(s).width}function OS(n,t,e){let i=n;return typeof t.text!="string"&&(i=O0(t,e)),i}function O0(n,t){const e=n.text?n.text.length:0;return t*e}function VS(n,t){return!!((n==="mousemove"||n==="mouseout")&&(t.onHover||t.onLeave)||t.onClick&&(n==="click"||n==="mouseup"))}var NS={id:"legend",_element:ig,start(n,t,e){const i=n.legend=new ig({ctx:n.ctx,options:e,chart:n});qt.configure(n,i,e),qt.addBox(n,i)},stop(n){qt.removeBox(n,n.legend),delete n.legend},beforeUpdate(n,t,e){const i=n.legend;qt.configure(n,i,e),i.options=e},afterUpdate(n){const t=n.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(n,t){t.replay||n.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(n,t,e){const i=t.datasetIndex,s=e.chart;s.isDatasetVisible(i)?(s.hide(i),t.hidden=!0):(s.show(i),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:n=>n.chart.options.color,boxWidth:40,padding:10,generateLabels(n){const t=n.data.datasets,{labels:{usePointStyle:e,pointStyle:i,textAlign:s,color:r,useBorderRadius:o,borderRadius:a}}=n.legend.options;return n._getSortedDatasetMetas().map(l=>{const u=l.controller.getStyle(e?0:void 0),h=Gt(u.borderWidth);return{text:t[l.index].label,fillStyle:u.backgroundColor,fontColor:r,hidden:!l.visible,lineCap:u.borderCapStyle,lineDash:u.borderDash,lineDashOffset:u.borderDashOffset,lineJoin:u.borderJoinStyle,lineWidth:(h.width+h.height)/4,strokeStyle:u.borderColor,pointStyle:i||u.pointStyle,rotation:u.rotation,textAlign:s||u.textAlign,borderRadius:o&&(a||u.borderRadius),datasetIndex:l.index}},this)}},title:{color:n=>n.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:n=>!n.startsWith("on"),labels:{_scriptable:n=>!["generateLabels","filter","sort"].includes(n)}}};class Iu extends ye{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this.options;if(this.left=0,this.top=0,!i.display){this.width=this.height=this.right=this.bottom=0;return}this.width=this.right=t,this.height=this.bottom=e;const s=ft(i.text)?i.text.length:1;this._padding=Gt(i.padding);const r=s*St(i.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=r:this.width=r}isHorizontal(){const t=this.options.position;return t==="top"||t==="bottom"}_drawArgs(t){const{top:e,left:i,bottom:s,right:r,options:o}=this,a=o.align;let l=0,u,h,d;return this.isHorizontal()?(h=zt(a,i,r),d=e+t,u=r-i):(o.position==="left"?(h=i+t,d=zt(a,s,e),l=it*-.5):(h=r-t,d=zt(a,e,s),l=it*.5),u=s-e),{titleX:h,titleY:d,maxWidth:u,rotation:l}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const i=St(e.font),r=i.lineHeight/2+this._padding.top,{titleX:o,titleY:a,maxWidth:l,rotation:u}=this._drawArgs(r);Qn(t,e.text,0,0,i,{color:e.color,maxWidth:l,rotation:u,textAlign:mu(e.align),textBaseline:"middle",translation:[o,a]})}}function FS(n,t){const e=new Iu({ctx:n.ctx,options:t,chart:n});qt.configure(n,e,t),qt.addBox(n,e),n.titleBlock=e}var BS={id:"title",_element:Iu,start(n,t,e){FS(n,e)},stop(n){const t=n.titleBlock;qt.removeBox(n,t),delete n.titleBlock},beforeUpdate(n,t,e){const i=n.titleBlock;qt.configure(n,i,e),i.options=e},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const zr=new WeakMap;var US={id:"subtitle",start(n,t,e){const i=new Iu({ctx:n.ctx,options:e,chart:n});qt.configure(n,i,e),qt.addBox(n,i),zr.set(n,i)},stop(n){qt.removeBox(n,zr.get(n)),zr.delete(n)},beforeUpdate(n,t,e){const i=zr.get(n);qt.configure(n,i,e),i.options=e},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const ys={average(n){if(!n.length)return!1;let t,e,i=new Set,s=0,r=0;for(t=0,e=n.length;t<e;++t){const a=n[t].element;if(a&&a.hasValue()){const l=a.tooltipPosition();i.add(l.x),s+=l.y,++r}}return r===0||i.size===0?!1:{x:[...i].reduce((a,l)=>a+l)/i.size,y:s/r}},nearest(n,t){if(!n.length)return!1;let e=t.x,i=t.y,s=Number.POSITIVE_INFINITY,r,o,a;for(r=0,o=n.length;r<o;++r){const l=n[r].element;if(l&&l.hasValue()){const u=l.getCenterPoint(),h=Ul(t,u);h<s&&(s=h,a=l)}}if(a){const l=a.tooltipPosition();e=l.x,i=l.y}return{x:e,y:i}}};function _e(n,t){return t&&(ft(t)?Array.prototype.push.apply(n,t):n.push(t)),n}function Me(n){return(typeof n=="string"||n instanceof String)&&n.indexOf(`
`)>-1?n.split(`
`):n}function jS(n,t){const{element:e,datasetIndex:i,index:s}=t,r=n.getDatasetMeta(i).controller,{label:o,value:a}=r.getLabelAndValue(s);return{chart:n,label:o,parsed:r.getParsed(s),raw:n.data.datasets[i].data[s],formattedValue:a,dataset:r.getDataset(),dataIndex:s,datasetIndex:i,element:e}}function sg(n,t){const e=n.chart.ctx,{body:i,footer:s,title:r}=n,{boxWidth:o,boxHeight:a}=t,l=St(t.bodyFont),u=St(t.titleFont),h=St(t.footerFont),d=r.length,g=s.length,m=i.length,y=Gt(t.padding);let v=y.height,w=0,A=i.reduce((L,M)=>L+M.before.length+M.lines.length+M.after.length,0);if(A+=n.beforeBody.length+n.afterBody.length,d&&(v+=d*u.lineHeight+(d-1)*t.titleSpacing+t.titleMarginBottom),A){const L=t.displayColors?Math.max(a,l.lineHeight):l.lineHeight;v+=m*L+(A-m)*l.lineHeight+(A-1)*t.bodySpacing}g&&(v+=t.footerMarginTop+g*h.lineHeight+(g-1)*t.footerSpacing);let R=0;const D=function(L){w=Math.max(w,e.measureText(L).width+R)};return e.save(),e.font=u.string,st(n.title,D),e.font=l.string,st(n.beforeBody.concat(n.afterBody),D),R=t.displayColors?o+2+t.boxPadding:0,st(i,L=>{st(L.before,D),st(L.lines,D),st(L.after,D)}),R=0,e.font=h.string,st(n.footer,D),e.restore(),w+=y.width,{width:w,height:v}}function zS(n,t){const{y:e,height:i}=t;return e<i/2?"top":e>n.height-i/2?"bottom":"center"}function $S(n,t,e,i){const{x:s,width:r}=i,o=e.caretSize+e.caretPadding;if(n==="left"&&s+r+o>t.width||n==="right"&&s-r-o<0)return!0}function HS(n,t,e,i){const{x:s,width:r}=e,{width:o,chartArea:{left:a,right:l}}=n;let u="center";return i==="center"?u=s<=(a+l)/2?"left":"right":s<=r/2?u="left":s>=o-r/2&&(u="right"),$S(u,n,t,e)&&(u="center"),u}function rg(n,t,e){const i=e.yAlign||t.yAlign||zS(n,e);return{xAlign:e.xAlign||t.xAlign||HS(n,t,e,i),yAlign:i}}function WS(n,t){let{x:e,width:i}=n;return t==="right"?e-=i:t==="center"&&(e-=i/2),e}function qS(n,t,e){let{y:i,height:s}=n;return t==="top"?i+=e:t==="bottom"?i-=s+e:i-=s/2,i}function og(n,t,e,i){const{caretSize:s,caretPadding:r,cornerRadius:o}=n,{xAlign:a,yAlign:l}=e,u=s+r,{topLeft:h,topRight:d,bottomLeft:g,bottomRight:m}=$n(o);let y=WS(t,a);const v=qS(t,l,u);return l==="center"?a==="left"?y+=u:a==="right"&&(y-=u):a==="left"?y-=Math.max(h,g)+s:a==="right"&&(y+=Math.max(d,m)+s),{x:Rt(y,0,i.width-t.width),y:Rt(v,0,i.height-t.height)}}function $r(n,t,e){const i=Gt(e.padding);return t==="center"?n.x+n.width/2:t==="right"?n.x+n.width-i.right:n.x+i.left}function ag(n){return _e([],Me(n))}function KS(n,t,e){return An(n,{tooltip:t,tooltipItems:e,type:"tooltip"})}function lg(n,t){const e=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return e?n.override(e):n}const V0={beforeTitle:Ce,title(n){if(n.length>0){const t=n[0],e=t.chart.data.labels,i=e?e.length:0;if(this&&this.options&&this.options.mode==="dataset")return t.dataset.label||"";if(t.label)return t.label;if(i>0&&t.dataIndex<i)return e[t.dataIndex]}return""},afterTitle:Ce,beforeBody:Ce,beforeLabel:Ce,label(n){if(this&&this.options&&this.options.mode==="dataset")return n.label+": "+n.formattedValue||n.formattedValue;let t=n.dataset.label||"";t&&(t+=": ");const e=n.formattedValue;return G(e)||(t+=e),t},labelColor(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:Ce,afterBody:Ce,beforeFooter:Ce,footer:Ce,afterFooter:Ce};function Zt(n,t,e,i){const s=n[t].call(e,i);return typeof s>"u"?V0[t].call(e,i):s}class Yl extends ye{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,i=this.options.setContext(this.getContext()),s=i.enabled&&e.options.animation&&i.animations,r=new p0(this.chart,s);return s._cacheable&&(this._cachedAnimations=Object.freeze(r)),r}getContext(){return this.$context||(this.$context=KS(this.chart.getContext(),this,this._tooltipItems))}getTitle(t,e){const{callbacks:i}=e,s=Zt(i,"beforeTitle",this,t),r=Zt(i,"title",this,t),o=Zt(i,"afterTitle",this,t);let a=[];return a=_e(a,Me(s)),a=_e(a,Me(r)),a=_e(a,Me(o)),a}getBeforeBody(t,e){return ag(Zt(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:i}=e,s=[];return st(t,r=>{const o={before:[],lines:[],after:[]},a=lg(i,r);_e(o.before,Me(Zt(a,"beforeLabel",this,r))),_e(o.lines,Zt(a,"label",this,r)),_e(o.after,Me(Zt(a,"afterLabel",this,r))),s.push(o)}),s}getAfterBody(t,e){return ag(Zt(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:i}=e,s=Zt(i,"beforeFooter",this,t),r=Zt(i,"footer",this,t),o=Zt(i,"afterFooter",this,t);let a=[];return a=_e(a,Me(s)),a=_e(a,Me(r)),a=_e(a,Me(o)),a}_createItems(t){const e=this._active,i=this.chart.data,s=[],r=[],o=[];let a=[],l,u;for(l=0,u=e.length;l<u;++l)a.push(jS(this.chart,e[l]));return t.filter&&(a=a.filter((h,d,g)=>t.filter(h,d,g,i))),t.itemSort&&(a=a.sort((h,d)=>t.itemSort(h,d,i))),st(a,h=>{const d=lg(t.callbacks,h);s.push(Zt(d,"labelColor",this,h)),r.push(Zt(d,"labelPointStyle",this,h)),o.push(Zt(d,"labelTextColor",this,h))}),this.labelColors=s,this.labelPointStyles=r,this.labelTextColors=o,this.dataPoints=a,a}update(t,e){const i=this.options.setContext(this.getContext()),s=this._active;let r,o=[];if(!s.length)this.opacity!==0&&(r={opacity:0});else{const a=ys[i.position].call(this,s,this._eventPosition);o=this._createItems(i),this.title=this.getTitle(o,i),this.beforeBody=this.getBeforeBody(o,i),this.body=this.getBody(o,i),this.afterBody=this.getAfterBody(o,i),this.footer=this.getFooter(o,i);const l=this._size=sg(this,i),u=Object.assign({},a,l),h=rg(this.chart,i,u),d=og(i,u,h,this.chart);this.xAlign=h.xAlign,this.yAlign=h.yAlign,r={opacity:1,x:d.x,y:d.y,width:l.width,height:l.height,caretX:a.x,caretY:a.y}}this._tooltipItems=o,this.$context=void 0,r&&this._resolveAnimations().update(this,r),t&&i.external&&i.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,i,s){const r=this.getCaretPosition(t,i,s);e.lineTo(r.x1,r.y1),e.lineTo(r.x2,r.y2),e.lineTo(r.x3,r.y3)}getCaretPosition(t,e,i){const{xAlign:s,yAlign:r}=this,{caretSize:o,cornerRadius:a}=i,{topLeft:l,topRight:u,bottomLeft:h,bottomRight:d}=$n(a),{x:g,y:m}=t,{width:y,height:v}=e;let w,A,R,D,L,M;return r==="center"?(L=m+v/2,s==="left"?(w=g,A=w-o,D=L+o,M=L-o):(w=g+y,A=w+o,D=L-o,M=L+o),R=w):(s==="left"?A=g+Math.max(l,h)+o:s==="right"?A=g+y-Math.max(u,d)-o:A=this.caretX,r==="top"?(D=m,L=D-o,w=A-o,R=A+o):(D=m+v,L=D+o,w=A+o,R=A-o),M=D),{x1:w,x2:A,x3:R,y1:D,y2:L,y3:M}}drawTitle(t,e,i){const s=this.title,r=s.length;let o,a,l;if(r){const u=bi(i.rtl,this.x,this.width);for(t.x=$r(this,i.titleAlign,i),e.textAlign=u.textAlign(i.titleAlign),e.textBaseline="middle",o=St(i.titleFont),a=i.titleSpacing,e.fillStyle=i.titleColor,e.font=o.string,l=0;l<r;++l)e.fillText(s[l],u.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+a,l+1===r&&(t.y+=i.titleMarginBottom-a)}}_drawColorBox(t,e,i,s,r){const o=this.labelColors[i],a=this.labelPointStyles[i],{boxHeight:l,boxWidth:u}=r,h=St(r.bodyFont),d=$r(this,"left",r),g=s.x(d),m=l<h.lineHeight?(h.lineHeight-l)/2:0,y=e.y+m;if(r.usePointStyle){const v={radius:Math.min(u,l)/2,pointStyle:a.pointStyle,rotation:a.rotation,borderWidth:1},w=s.leftForLtr(g,u)+u/2,A=y+l/2;t.strokeStyle=r.multiKeyBackground,t.fillStyle=r.multiKeyBackground,zl(t,v,w,A),t.strokeStyle=o.borderColor,t.fillStyle=o.backgroundColor,zl(t,v,w,A)}else{t.lineWidth=Q(o.borderWidth)?Math.max(...Object.values(o.borderWidth)):o.borderWidth||1,t.strokeStyle=o.borderColor,t.setLineDash(o.borderDash||[]),t.lineDashOffset=o.borderDashOffset||0;const v=s.leftForLtr(g,u),w=s.leftForLtr(s.xPlus(g,1),u-2),A=$n(o.borderRadius);Object.values(A).some(R=>R!==0)?(t.beginPath(),t.fillStyle=r.multiKeyBackground,js(t,{x:v,y,w:u,h:l,radius:A}),t.fill(),t.stroke(),t.fillStyle=o.backgroundColor,t.beginPath(),js(t,{x:w,y:y+1,w:u-2,h:l-2,radius:A}),t.fill()):(t.fillStyle=r.multiKeyBackground,t.fillRect(v,y,u,l),t.strokeRect(v,y,u,l),t.fillStyle=o.backgroundColor,t.fillRect(w,y+1,u-2,l-2))}t.fillStyle=this.labelTextColors[i]}drawBody(t,e,i){const{body:s}=this,{bodySpacing:r,bodyAlign:o,displayColors:a,boxHeight:l,boxWidth:u,boxPadding:h}=i,d=St(i.bodyFont);let g=d.lineHeight,m=0;const y=bi(i.rtl,this.x,this.width),v=function(b){e.fillText(b,y.x(t.x+m),t.y+g/2),t.y+=g+r},w=y.textAlign(o);let A,R,D,L,M,V,E;for(e.textAlign=o,e.textBaseline="middle",e.font=d.string,t.x=$r(this,w,i),e.fillStyle=i.bodyColor,st(this.beforeBody,v),m=a&&w!=="right"?o==="center"?u/2+h:u+2+h:0,L=0,V=s.length;L<V;++L){for(A=s[L],R=this.labelTextColors[L],e.fillStyle=R,st(A.before,v),D=A.lines,a&&D.length&&(this._drawColorBox(e,t,L,y,i),g=Math.max(d.lineHeight,l)),M=0,E=D.length;M<E;++M)v(D[M]),g=d.lineHeight;st(A.after,v)}m=0,g=d.lineHeight,st(this.afterBody,v),t.y-=r}drawFooter(t,e,i){const s=this.footer,r=s.length;let o,a;if(r){const l=bi(i.rtl,this.x,this.width);for(t.x=$r(this,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=l.textAlign(i.footerAlign),e.textBaseline="middle",o=St(i.footerFont),e.fillStyle=i.footerColor,e.font=o.string,a=0;a<r;++a)e.fillText(s[a],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+i.footerSpacing}}drawBackground(t,e,i,s){const{xAlign:r,yAlign:o}=this,{x:a,y:l}=t,{width:u,height:h}=i,{topLeft:d,topRight:g,bottomLeft:m,bottomRight:y}=$n(s.cornerRadius);e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.beginPath(),e.moveTo(a+d,l),o==="top"&&this.drawCaret(t,e,i,s),e.lineTo(a+u-g,l),e.quadraticCurveTo(a+u,l,a+u,l+g),o==="center"&&r==="right"&&this.drawCaret(t,e,i,s),e.lineTo(a+u,l+h-y),e.quadraticCurveTo(a+u,l+h,a+u-y,l+h),o==="bottom"&&this.drawCaret(t,e,i,s),e.lineTo(a+m,l+h),e.quadraticCurveTo(a,l+h,a,l+h-m),o==="center"&&r==="left"&&this.drawCaret(t,e,i,s),e.lineTo(a,l+d),e.quadraticCurveTo(a,l,a+d,l),e.closePath(),e.fill(),s.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,i=this.$animations,s=i&&i.x,r=i&&i.y;if(s||r){const o=ys[t.position].call(this,this._active,this._eventPosition);if(!o)return;const a=this._size=sg(this,t),l=Object.assign({},o,this._size),u=rg(e,t,l),h=og(t,l,u,e);(s._to!==h.x||r._to!==h.y)&&(this.xAlign=u.xAlign,this.yAlign=u.yAlign,this.width=a.width,this.height=a.height,this.caretX=o.x,this.caretY=o.y,this._resolveAnimations().update(this,h))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let i=this.opacity;if(!i)return;this._updateAnimationTarget(e);const s={width:this.width,height:this.height},r={x:this.x,y:this.y};i=Math.abs(i)<.001?0:i;const o=Gt(e.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&a&&(t.save(),t.globalAlpha=i,this.drawBackground(r,t,s,e),c0(t,e.textDirection),r.y+=o.top,this.drawTitle(r,t,e),this.drawBody(r,t,e),this.drawFooter(r,t,e),u0(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this._active,s=t.map(({datasetIndex:a,index:l})=>{const u=this.chart.getDatasetMeta(a);if(!u)throw new Error("Cannot find a dataset at index "+a);return{datasetIndex:a,element:u.data[l],index:l}}),r=!Co(i,s),o=this._positionChanged(s,e);(r||o)&&(this._active=s,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,i=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const s=this.options,r=this._active||[],o=this._getActiveElements(t,r,e,i),a=this._positionChanged(o,t),l=e||!Co(o,r)||a;return l&&(this._active=o,(s.enabled||s.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),l}_getActiveElements(t,e,i,s){const r=this.options;if(t.type==="mouseout")return[];if(!s)return e.filter(a=>this.chart.data.datasets[a.datasetIndex]&&this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index)!==void 0);const o=this.chart.getElementsAtEventForMode(t,r.mode,r,i);return r.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:i,caretY:s,options:r}=this,o=ys[r.position].call(this,t,e);return o!==!1&&(i!==o.x||s!==o.y)}}B(Yl,"positioners",ys);var GS={id:"tooltip",_element:Yl,positioners:ys,afterInit(n,t,e){e&&(n.tooltip=new Yl({chart:n,options:e}))},beforeUpdate(n,t,e){n.tooltip&&n.tooltip.initialize(e)},reset(n,t,e){n.tooltip&&n.tooltip.initialize(e)},afterDraw(n){const t=n.tooltip;if(t&&t._willRender()){const e={tooltip:t};if(n.notifyPlugins("beforeTooltipDraw",{...e,cancelable:!0})===!1)return;t.draw(n.ctx),n.notifyPlugins("afterTooltipDraw",e)}},afterEvent(n,t){if(n.tooltip){const e=t.replay;n.tooltip.handleEvent(t.event,e,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(n,t)=>t.bodyFont.size,boxWidth:(n,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:V0},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:n=>n!=="filter"&&n!=="itemSort"&&n!=="external",_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},YS=Object.freeze({__proto__:null,Colors:aS,Decimation:hS,Filler:CS,Legend:NS,SubTitle:US,Title:BS,Tooltip:GS});const QS=(n,t,e,i)=>(typeof t=="string"?(e=n.push(t)-1,i.unshift({index:e,label:t})):isNaN(t)&&(e=null),e);function XS(n,t,e,i){const s=n.indexOf(t);if(s===-1)return QS(n,t,e,i);const r=n.lastIndexOf(t);return s!==r?e:s}const JS=(n,t)=>n===null?null:Rt(Math.round(n),0,t);function cg(n){const t=this.getLabels();return n>=0&&n<t.length?t[n]:n}class Ql extends ii{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const i=this.getLabels();for(const{index:s,label:r}of e)i[s]===r&&i.splice(s,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(G(t))return null;const i=this.getLabels();return e=isFinite(e)&&i[e]===t?e:XS(i,t,q(e,t),this._addedLabels),JS(e,i.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:i,max:s}=this.getMinMax(!0);this.options.bounds==="ticks"&&(t||(i=0),e||(s=this.getLabels().length-1)),this.min=i,this.max=s}buildTicks(){const t=this.min,e=this.max,i=this.options.offset,s=[];let r=this.getLabels();r=t===0&&e===r.length-1?r:r.slice(t,e+1),this._valueRange=Math.max(r.length-(i?0:1),1),this._startValue=this.min-(i?.5:0);for(let o=t;o<=e;o++)s.push({value:o});return s}getLabelForValue(t){return cg.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return typeof t!="number"&&(t=this.parse(t)),t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}B(Ql,"id","category"),B(Ql,"defaults",{ticks:{callback:cg}});function ZS(n,t){const e=[],{bounds:s,step:r,min:o,max:a,precision:l,count:u,maxTicks:h,maxDigits:d,includeBounds:g}=n,m=r||1,y=h-1,{min:v,max:w}=t,A=!G(o),R=!G(a),D=!G(u),L=(w-v)/(d+1);let M=sf((w-v)/y/m)*m,V,E,b,x;if(M<1e-14&&!A&&!R)return[{value:v},{value:w}];x=Math.ceil(w/M)-Math.floor(v/M),x>y&&(M=sf(x*M/y/m)*m),G(l)||(V=Math.pow(10,l),M=Math.ceil(M*V)/V),s==="ticks"?(E=Math.floor(v/M)*M,b=Math.ceil(w/M)*M):(E=v,b=w),A&&R&&r&&WI((a-o)/r,M/1e3)?(x=Math.round(Math.min((a-o)/M,h)),M=(a-o)/x,E=o,b=a):D?(E=A?o:E,b=R?a:b,x=u-1,M=(b-E)/x):(x=(b-E)/M,Is(x,Math.round(x),M/1e3)?x=Math.round(x):x=Math.ceil(x));const I=Math.max(rf(M),rf(E));V=Math.pow(10,G(l)?I:l),E=Math.round(E*V)/V,b=Math.round(b*V)/V;let T=0;for(A&&(g&&E!==o?(e.push({value:o}),E<o&&T++,Is(Math.round((E+T*M)*V)/V,o,ug(o,L,n))&&T++):E<o&&T++);T<x;++T){const S=Math.round((E+T*M)*V)/V;if(R&&S>a)break;e.push({value:S})}return R&&g&&b!==a?e.length&&Is(e[e.length-1].value,a,ug(a,L,n))?e[e.length-1].value=a:e.push({value:a}):(!R||b===a)&&e.push({value:b}),e}function ug(n,t,{horizontal:e,minRotation:i}){const s=de(i),r=(e?Math.sin(s):Math.cos(s))||.001,o=.75*t*(""+n).length;return Math.min(t/r,o)}class Fo extends ii{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return G(t)||(typeof t=="number"||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:i}=this.getUserBounds();let{min:s,max:r}=this;const o=l=>s=e?s:l,a=l=>r=i?r:l;if(t){const l=ke(s),u=ke(r);l<0&&u<0?a(0):l>0&&u>0&&o(0)}if(s===r){let l=r===0?1:Math.abs(r*.05);a(r+l),t||o(s-l)}this.min=s,this.max=r}getTickLimit(){const t=this.options.ticks;let{maxTicksLimit:e,stepSize:i}=t,s;return i?(s=Math.ceil(this.max/i)-Math.floor(this.min/i)+1,s>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${s} ticks. Limiting to 1000.`),s=1e3)):(s=this.computeTickLimit(),e=e||11),e&&(s=Math.min(e,s)),s}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let i=this.getTickLimit();i=Math.max(2,i);const s={maxTicks:i,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:e.includeBounds!==!1},r=this._range||this,o=ZS(s,r);return t.bounds==="ticks"&&qm(o,this,"value"),t.reverse?(o.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),o}configure(){const t=this.ticks;let e=this.min,i=this.max;if(super.configure(),this.options.offset&&t.length){const s=(i-e)/Math.max(t.length-1,1)/2;e-=s,i+=s}this._startValue=e,this._endValue=i,this._valueRange=i-e}getLabelForValue(t){return or(t,this.chart.options.locale,this.options.ticks.format)}}class Xl extends Fo{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=wt(t)?t:0,this.max=wt(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,i=de(this.options.ticks.minRotation),s=(t?Math.sin(i):Math.cos(i))||.001,r=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,r.lineHeight/s))}getPixelForValue(t){return t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}B(Xl,"id","linear"),B(Xl,"defaults",{ticks:{callback:oa.formatters.numeric}});const $s=n=>Math.floor(ln(n)),On=(n,t)=>Math.pow(10,$s(n)+t);function hg(n){return n/Math.pow(10,$s(n))===1}function dg(n,t,e){const i=Math.pow(10,e),s=Math.floor(n/i);return Math.ceil(t/i)-s}function t2(n,t){const e=t-n;let i=$s(e);for(;dg(n,t,i)>10;)i++;for(;dg(n,t,i)<10;)i--;return Math.min(i,$s(n))}function e2(n,{min:t,max:e}){t=ie(n.min,t);const i=[],s=$s(t);let r=t2(t,e),o=r<0?Math.pow(10,Math.abs(r)):1;const a=Math.pow(10,r),l=s>r?Math.pow(10,s):0,u=Math.round((t-l)*o)/o,h=Math.floor((t-l)/a/10)*a*10;let d=Math.floor((u-h)/Math.pow(10,r)),g=ie(n.min,Math.round((l+h+d*Math.pow(10,r))*o)/o);for(;g<e;)i.push({value:g,major:hg(g),significand:d}),d>=10?d=d<15?15:20:d++,d>=20&&(r++,d=2,o=r>=0?1:o),g=Math.round((l+h+d*Math.pow(10,r))*o)/o;const m=ie(n.max,g);return i.push({value:m,major:hg(m),significand:d}),i}class Jl extends ii{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=Fo.prototype.parse.apply(this,[t,e]);if(i===0){this._zero=!0;return}return wt(i)&&i>0?i:null}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=wt(t)?Math.max(0,t):null,this.max=wt(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!wt(this._userMin)&&(this.min=t===On(this.min,0)?On(this.min,-1):On(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let i=this.min,s=this.max;const r=a=>i=t?i:a,o=a=>s=e?s:a;i===s&&(i<=0?(r(1),o(10)):(r(On(i,-1)),o(On(s,1)))),i<=0&&r(On(s,-1)),s<=0&&o(On(i,1)),this.min=i,this.max=s}buildTicks(){const t=this.options,e={min:this._userMin,max:this._userMax},i=e2(e,this);return t.bounds==="ticks"&&qm(i,this,"value"),t.reverse?(i.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),i}getLabelForValue(t){return t===void 0?"0":or(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=ln(t),this._valueRange=ln(this.max)-ln(t)}getPixelForValue(t){return(t===void 0||t===0)&&(t=this.min),t===null||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(ln(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}B(Jl,"id","logarithmic"),B(Jl,"defaults",{ticks:{callback:oa.formatters.logarithmic,major:{enabled:!0}}});function Zl(n){const t=n.ticks;if(t.display&&n.display){const e=Gt(t.backdropPadding);return q(t.font&&t.font.size,gt.font.size)+e.height}return 0}function n2(n,t,e){return e=ft(e)?e:[e],{w:lT(n,t.string,e),h:e.length*t.lineHeight}}function fg(n,t,e,i,s){return n===i||n===s?{start:t-e/2,end:t+e/2}:n<i||n>s?{start:t-e,end:t}:{start:t,end:t+e}}function i2(n){const t={l:n.left+n._padding.left,r:n.right-n._padding.right,t:n.top+n._padding.top,b:n.bottom-n._padding.bottom},e=Object.assign({},t),i=[],s=[],r=n._pointLabels.length,o=n.options.pointLabels,a=o.centerPointLabels?it/r:0;for(let l=0;l<r;l++){const u=o.setContext(n.getPointLabelContext(l));s[l]=u.padding;const h=n.getPointPosition(l,n.drawingArea+s[l],a),d=St(u.font),g=n2(n.ctx,d,n._pointLabels[l]);i[l]=g;const m=Ht(n.getIndexAngle(l)+a),y=Math.round(gu(m)),v=fg(y,h.x,g.w,0,180),w=fg(y,h.y,g.h,90,270);s2(e,t,m,v,w)}n.setCenterPoint(t.l-e.l,e.r-t.r,t.t-e.t,e.b-t.b),n._pointLabelItems=a2(n,i,s)}function s2(n,t,e,i,s){const r=Math.abs(Math.sin(e)),o=Math.abs(Math.cos(e));let a=0,l=0;i.start<t.l?(a=(t.l-i.start)/r,n.l=Math.min(n.l,t.l-a)):i.end>t.r&&(a=(i.end-t.r)/r,n.r=Math.max(n.r,t.r+a)),s.start<t.t?(l=(t.t-s.start)/o,n.t=Math.min(n.t,t.t-l)):s.end>t.b&&(l=(s.end-t.b)/o,n.b=Math.max(n.b,t.b+l))}function r2(n,t,e){const i=n.drawingArea,{extra:s,additionalAngle:r,padding:o,size:a}=e,l=n.getPointPosition(t,i+s+o,r),u=Math.round(gu(Ht(l.angle+Et))),h=u2(l.y,a.h,u),d=l2(u),g=c2(l.x,a.w,d);return{visible:!0,x:l.x,y:h,textAlign:d,left:g,top:h,right:g+a.w,bottom:h+a.h}}function o2(n,t){if(!t)return!0;const{left:e,top:i,right:s,bottom:r}=n;return!(ze({x:e,y:i},t)||ze({x:e,y:r},t)||ze({x:s,y:i},t)||ze({x:s,y:r},t))}function a2(n,t,e){const i=[],s=n._pointLabels.length,r=n.options,{centerPointLabels:o,display:a}=r.pointLabels,l={extra:Zl(r)/2,additionalAngle:o?it/s:0};let u;for(let h=0;h<s;h++){l.padding=e[h],l.size=t[h];const d=r2(n,h,l);i.push(d),a==="auto"&&(d.visible=o2(d,u),d.visible&&(u=d))}return i}function l2(n){return n===0||n===180?"center":n<180?"left":"right"}function c2(n,t,e){return e==="right"?n-=t:e==="center"&&(n-=t/2),n}function u2(n,t,e){return e===90||e===270?n-=t/2:(e>270||e<90)&&(n-=t),n}function h2(n,t,e){const{left:i,top:s,right:r,bottom:o}=e,{backdropColor:a}=t;if(!G(a)){const l=$n(t.borderRadius),u=Gt(t.backdropPadding);n.fillStyle=a;const h=i-u.left,d=s-u.top,g=r-i+u.width,m=o-s+u.height;Object.values(l).some(y=>y!==0)?(n.beginPath(),js(n,{x:h,y:d,w:g,h:m,radius:l}),n.fill()):n.fillRect(h,d,g,m)}}function d2(n,t){const{ctx:e,options:{pointLabels:i}}=n;for(let s=t-1;s>=0;s--){const r=n._pointLabelItems[s];if(!r.visible)continue;const o=i.setContext(n.getPointLabelContext(s));h2(e,o,r);const a=St(o.font),{x:l,y:u,textAlign:h}=r;Qn(e,n._pointLabels[s],l,u+a.lineHeight/2,a,{color:o.color,textAlign:h,textBaseline:"middle"})}}function N0(n,t,e,i){const{ctx:s}=n;if(e)s.arc(n.xCenter,n.yCenter,t,0,dt);else{let r=n.getPointPosition(0,t);s.moveTo(r.x,r.y);for(let o=1;o<i;o++)r=n.getPointPosition(o,t),s.lineTo(r.x,r.y)}}function f2(n,t,e,i,s){const r=n.ctx,o=t.circular,{color:a,lineWidth:l}=t;!o&&!i||!a||!l||e<0||(r.save(),r.strokeStyle=a,r.lineWidth=l,r.setLineDash(s.dash||[]),r.lineDashOffset=s.dashOffset,r.beginPath(),N0(n,e,o,i),r.closePath(),r.stroke(),r.restore())}function g2(n,t,e){return An(n,{label:e,index:t,type:"pointLabel"})}class _s extends Fo{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=Gt(Zl(this.options)/2),e=this.width=this.maxWidth-t.width,i=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+i/2+t.top),this.drawingArea=Math.floor(Math.min(e,i)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=wt(t)&&!isNaN(t)?t:0,this.max=wt(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Zl(this.options))}generateTickLabels(t){Fo.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((e,i)=>{const s=ct(this.options.pointLabels.callback,[e,i],this);return s||s===0?s:""}).filter((e,i)=>this.chart.getDataVisibility(i))}fit(){const t=this.options;t.display&&t.pointLabels.display?i2(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,i,s){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((i-s)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,i,s))}getIndexAngle(t){const e=dt/(this._pointLabels.length||1),i=this.options.startAngle||0;return Ht(t*e+de(i))}getDistanceFromCenterForValue(t){if(G(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(G(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const i=e[t];return g2(this.getContext(),t,i)}}getPointPosition(t,e,i=0){const s=this.getIndexAngle(t)-Et+i;return{x:Math.cos(s)*e+this.xCenter,y:Math.sin(s)*e+this.yCenter,angle:s}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:s,bottom:r}=this._pointLabelItems[t];return{left:e,top:i,right:s,bottom:r}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const i=this.ctx;i.save(),i.beginPath(),N0(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),i.closePath(),i.fillStyle=t,i.fill(),i.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:i,grid:s,border:r}=e,o=this._pointLabels.length;let a,l,u;if(e.pointLabels.display&&d2(this,o),s.display&&this.ticks.forEach((h,d)=>{if(d!==0||d===0&&this.min<0){l=this.getDistanceFromCenterForValue(h.value);const g=this.getContext(d),m=s.setContext(g),y=r.setContext(g);f2(this,m,l,o,y)}}),i.display){for(t.save(),a=o-1;a>=0;a--){const h=i.setContext(this.getPointLabelContext(a)),{color:d,lineWidth:g}=h;!g||!d||(t.lineWidth=g,t.strokeStyle=d,t.setLineDash(h.borderDash),t.lineDashOffset=h.borderDashOffset,l=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),u=this.getPointPosition(a,l),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(u.x,u.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,i=e.ticks;if(!i.display)return;const s=this.getIndexAngle(0);let r,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(s),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((a,l)=>{if(l===0&&this.min>=0&&!e.reverse)return;const u=i.setContext(this.getContext(l)),h=St(u.font);if(r=this.getDistanceFromCenterForValue(this.ticks[l].value),u.showLabelBackdrop){t.font=h.string,o=t.measureText(a.label).width,t.fillStyle=u.backdropColor;const d=Gt(u.backdropPadding);t.fillRect(-o/2-d.left,-r-h.size/2-d.top,o+d.width,h.size+d.height)}Qn(t,a.label,0,-r,h,{color:u.color,strokeColor:u.textStrokeColor,strokeWidth:u.textStrokeWidth})}),t.restore()}drawTitle(){}}B(_s,"id","radialLinear"),B(_s,"defaults",{display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:oa.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback(t){return t},padding:5,centerPointLabels:!1}}),B(_s,"defaultRoutes",{"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"}),B(_s,"descriptors",{angleLines:{_fallback:"grid"}});const da={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},ee=Object.keys(da);function gg(n,t){return n-t}function pg(n,t){if(G(t))return null;const e=n._adapter,{parser:i,round:s,isoWeekday:r}=n._parseOpts;let o=t;return typeof i=="function"&&(o=i(o)),wt(o)||(o=typeof i=="string"?e.parse(o,i):e.parse(o)),o===null?null:(s&&(o=s==="week"&&(Ci(r)||r===!0)?e.startOf(o,"isoWeek",r):e.startOf(o,s)),+o)}function mg(n,t,e,i){const s=ee.length;for(let r=ee.indexOf(n);r<s-1;++r){const o=da[ee[r]],a=o.steps?o.steps:Number.MAX_SAFE_INTEGER;if(o.common&&Math.ceil((e-t)/(a*o.size))<=i)return ee[r]}return ee[s-1]}function p2(n,t,e,i,s){for(let r=ee.length-1;r>=ee.indexOf(e);r--){const o=ee[r];if(da[o].common&&n._adapter.diff(s,i,o)>=t-1)return o}return ee[e?ee.indexOf(e):0]}function m2(n){for(let t=ee.indexOf(n)+1,e=ee.length;t<e;++t)if(da[ee[t]].common)return ee[t]}function yg(n,t,e){if(!e)n[t]=!0;else if(e.length){const{lo:i,hi:s}=pu(e,t),r=e[i]>=t?e[i]:e[s];n[r]=!0}}function y2(n,t,e,i){const s=n._adapter,r=+s.startOf(t[0].value,i),o=t[t.length-1].value;let a,l;for(a=r;a<=o;a=+s.add(a,1,i))l=e[a],l>=0&&(t[l].major=!0);return t}function _g(n,t,e){const i=[],s={},r=t.length;let o,a;for(o=0;o<r;++o)a=t[o],s[a]=o,i.push({value:a,major:!1});return r===0||!e?i:y2(n,i,s,e)}class Hs extends ii{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const i=t.time||(t.time={}),s=this._adapter=new IA._date(t.adapters.date);s.init(e),ks(i.displayFormats,s.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return t===void 0?null:pg(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,i=t.time.unit||"day";let{min:s,max:r,minDefined:o,maxDefined:a}=this.getUserBounds();function l(u){!o&&!isNaN(u.min)&&(s=Math.min(s,u.min)),!a&&!isNaN(u.max)&&(r=Math.max(r,u.max))}(!o||!a)&&(l(this._getLabelBounds()),(t.bounds!=="ticks"||t.ticks.source!=="labels")&&l(this.getMinMax(!1))),s=wt(s)&&!isNaN(s)?s:+e.startOf(Date.now(),i),r=wt(r)&&!isNaN(r)?r:+e.endOf(Date.now(),i)+1,this.min=Math.min(s,r-1),this.max=Math.max(s+1,r)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this.options,e=t.time,i=t.ticks,s=i.source==="labels"?this.getLabelTimestamps():this._generate();t.bounds==="ticks"&&s.length&&(this.min=this._userMin||s[0],this.max=this._userMax||s[s.length-1]);const r=this.min,o=this.max,a=YI(s,r,o);return this._unit=e.unit||(i.autoSkip?mg(e.minUnit,this.min,this.max,this._getLabelCapacity(r)):p2(this,a.length,e.minUnit,this.min,this.max)),this._majorUnit=!i.major.enabled||this._unit==="year"?void 0:m2(this._unit),this.initOffsets(s),t.reverse&&a.reverse(),_g(this,a,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e=0,i=0,s,r;this.options.offset&&t.length&&(s=this.getDecimalForValue(t[0]),t.length===1?e=1-s:e=(this.getDecimalForValue(t[1])-s)/2,r=this.getDecimalForValue(t[t.length-1]),t.length===1?i=r:i=(r-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;e=Rt(e,0,o),i=Rt(i,0,o),this._offsets={start:e,end:i,factor:1/(e+1+i)}}_generate(){const t=this._adapter,e=this.min,i=this.max,s=this.options,r=s.time,o=r.unit||mg(r.minUnit,e,i,this._getLabelCapacity(e)),a=q(s.ticks.stepSize,1),l=o==="week"?r.isoWeekday:!1,u=Ci(l)||l===!0,h={};let d=e,g,m;if(u&&(d=+t.startOf(d,"isoWeek",l)),d=+t.startOf(d,u?"day":o),t.diff(i,e,o)>1e5*a)throw new Error(e+" and "+i+" are too far apart with stepSize of "+a+" "+o);const y=s.ticks.source==="data"&&this.getDataTimestamps();for(g=d,m=0;g<i;g=+t.add(g,a,o),m++)yg(h,g,y);return(g===i||s.bounds==="ticks"||m===1)&&yg(h,g,y),Object.keys(h).sort(gg).map(v=>+v)}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}format(t,e){const s=this.options.time.displayFormats,r=this._unit,o=e||s[r];return this._adapter.format(t,o)}_tickFormatFunction(t,e,i,s){const r=this.options,o=r.ticks.callback;if(o)return ct(o,[t,e,i],this);const a=r.time.displayFormats,l=this._unit,u=this._majorUnit,h=l&&a[l],d=u&&a[u],g=i[e],m=u&&d&&g&&g.major;return this._adapter.format(t,s||(m?d:h))}generateTickLabels(t){let e,i,s;for(e=0,i=t.length;e<i;++e)s=t[e],s.label=this._tickFormatFunction(s.value,e,t)}getDecimalForValue(t){return t===null?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,i=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+i)*e.factor)}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+i*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,i=this.ctx.measureText(t).width,s=de(this.isHorizontal()?e.maxRotation:e.minRotation),r=Math.cos(s),o=Math.sin(s),a=this._resolveTickFontOptions(0).size;return{w:i*r+a*o,h:i*o+a*r}}_getLabelCapacity(t){const e=this.options.time,i=e.displayFormats,s=i[e.unit]||i.millisecond,r=this._tickFormatFunction(t,0,_g(this,[t],this._majorUnit),s),o=this._getLabelSize(r),a=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return a>0?a:1}getDataTimestamps(){let t=this._cache.data||[],e,i;if(t.length)return t;const s=this.getMatchingVisibleMetas();if(this._normalized&&s.length)return this._cache.data=s[0].controller.getAllParsedValues(this);for(e=0,i=s.length;e<i;++e)t=t.concat(s[e].controller.getAllParsedValues(this));return this._cache.data=this.normalize(t)}getLabelTimestamps(){const t=this._cache.labels||[];let e,i;if(t.length)return t;const s=this.getLabels();for(e=0,i=s.length;e<i;++e)t.push(pg(this,s[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return Ym(t.sort(gg))}}B(Hs,"id","time"),B(Hs,"defaults",{bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}});function Hr(n,t,e){let i=0,s=n.length-1,r,o,a,l;e?(t>=n[i].pos&&t<=n[s].pos&&({lo:i,hi:s}=je(n,"pos",t)),{pos:r,time:a}=n[i],{pos:o,time:l}=n[s]):(t>=n[i].time&&t<=n[s].time&&({lo:i,hi:s}=je(n,"time",t)),{time:r,pos:a}=n[i],{time:o,pos:l}=n[s]);const u=o-r;return u?a+(l-a)*(t-r)/u:a}class tc extends Hs{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=Hr(e,this.min),this._tableRange=Hr(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:i}=this,s=[],r=[];let o,a,l,u,h;for(o=0,a=t.length;o<a;++o)u=t[o],u>=e&&u<=i&&s.push(u);if(s.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(o=0,a=s.length;o<a;++o)h=s[o+1],l=s[o-1],u=s[o],Math.round((h+l)/2)!==u&&r.push({time:u,pos:o/(a-1)});return r}_generate(){const t=this.min,e=this.max;let i=super.getDataTimestamps();return(!i.includes(t)||!i.length)&&i.splice(0,0,t),(!i.includes(e)||i.length===1)&&i.push(e),i.sort((s,r)=>s-r)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),i=this.getLabelTimestamps();return e.length&&i.length?t=this.normalize(e.concat(i)):t=e.length?e:i,t=this._cache.all=t,t}getDecimalForValue(t){return(Hr(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return Hr(this._table,i*this._tableRange+this._minPos,!0)}}B(tc,"id","timeseries"),B(tc,"defaults",Hs.defaults);var _2=Object.freeze({__proto__:null,CategoryScale:Ql,LinearScale:Xl,LogarithmicScale:Jl,RadialLinearScale:_s,TimeScale:Hs,TimeSeriesScale:tc});const b2=[kA,tS,YS,_2];ae.register(...b2);let ul=null,hl=null,dl=null;function v2(n,t){if(!n||!ae)return;const e=n.filter(i=>i.status==="completed"&&i.completedAt);w2(e),x2(e),E2(e)}function w2(n){var r;const t=(r=document.getElementById("dailyChart"))==null?void 0:r.getContext("2d");if(!t)return;ul&&ul.destroy();const e=[],i=[],s=new Date;for(let o=3;o>=0;o--){const a=new Date;a.setDate(s.getDate()-o),a.setHours(0,0,0,0);const l=new Date(a);l.setHours(23,59,59,999);const u=`${a.getMonth()+1}/${a.getDate()}`;e.push(u);const h=n.filter(d=>{const g=d.completedAt.toDate?d.completedAt.toDate():new Date(d.completedAt);return g>=a&&g<=l}).length;i.push(h)}ul=new ae(t,{type:"bar",data:{labels:e,datasets:[{label:"完了タスク数",data:i,backgroundColor:"#3B82F6",borderRadius:4}]},options:Tu()})}function x2(n){var o;const t=(o=document.getElementById("weeklyChart"))==null?void 0:o.getContext("2d");if(!t)return;hl&&hl.destroy();const e=[],i=[],s=new Date,r=new Date(s);r.setDate(s.getDate()-s.getDay()),r.setHours(0,0,0,0);for(let a=3;a>=0;a--){const l=new Date(r);l.setDate(l.getDate()-a*7);const u=new Date(l);u.setDate(u.getDate()+6),u.setHours(23,59,59,999);const h=`${l.getMonth()+1}/${l.getDate()}~`;e.push(h);const d=n.filter(g=>{const m=g.completedAt.toDate?g.completedAt.toDate():new Date(g.completedAt);return m>=l&&m<=u}).length;i.push(d)}hl=new ae(t,{type:"bar",data:{labels:e,datasets:[{label:"完了タスク数",data:i,backgroundColor:"#10B981",borderRadius:4}]},options:Tu()})}function E2(n){var r;const t=(r=document.getElementById("monthlyChart"))==null?void 0:r.getContext("2d");if(!t)return;dl&&dl.destroy();const e=[],i=[],s=new Date;for(let o=3;o>=0;o--){const a=new Date(s.getFullYear(),s.getMonth()-o,1),l=new Date(a),u=new Date(a.getFullYear(),a.getMonth()+1,0);u.setHours(23,59,59,999);const h=`${l.getFullYear()}/${l.getMonth()+1}`;e.push(h);const d=n.filter(g=>{const m=g.completedAt.toDate?g.completedAt.toDate():new Date(g.completedAt);return m>=l&&m<=u}).length;i.push(d)}dl=new ae(t,{type:"bar",data:{labels:e,datasets:[{label:"完了タスク数",data:i,backgroundColor:"#8B5CF6",borderRadius:4}]},options:Tu()})}function Tu(){return{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,ticks:{stepSize:1,color:"#9CA3AF"},grid:{color:"rgba(156, 163, 175, 0.1)"}},x:{ticks:{color:"#9CA3AF"},grid:{display:!1}}},plugins:{legend:{display:!1}}}}function F0(n,t){const e=document.createElement("ul");e.id="task-list-ul",e.className="divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:divide-gray-800 mb-2",!t||t.length===0?S2(e):(t.forEach(i=>{const s=k2(i);e.appendChild(s)}),I2(e)),n.appendChild(e)}function k2(n){const t=document.createElement("li");t.setAttribute("data-id",n.id),t.setAttribute("draggable","true");const e=n.status==="completed",i=Pk(n.dueDate),s=Rk(n.dueDate),r=!!n.recurrence,o=!!n.dueDate&&!r,a=ni(),l=n.timeBlockId?a.find(d=>d.id===n.timeBlockId):null,u=n.duration;return t.className=`group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-default border border-transparent ${e?"opacity-60 bg-gray-50 dark:bg-gray-900/50":"hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700"}`,t.innerHTML=`
        <!-- ドラッグハンドル -->
        <div class="task-drag-handle mt-1 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hidden sm:block mr-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>

        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 cursor-pointer ${e?"bg-blue-500 border-blue-500 text-white":"border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500"}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-7 flex flex-col justify-center">
                <div class="text-[0.93rem] leading-snug truncate font-medium transition-colors ${e?"line-through text-gray-500 dark:text-gray-500":"text-gray-800 dark:text-gray-200"}">${n.title}</div>
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
                ${u?`
                    <div class="flex items-center text-gray-500 dark:text-gray-400 whitespace-nowrap" title="所要時間: ${u}分">
                        <span class="mr-0.5 text-[10px]">⏱️</span>${u}m
                    </div>
                `:""}

                ${i?`<div class="flex items-center ${s} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded flex-shrink-0"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${i}</div>`:""}
            </div>
        </div>
    `,t.addEventListener("dragstart",d=>{t.classList.add("opacity-50"),d.dataTransfer.setData("text/plain",n.id),d.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("opacity-50")}),t.querySelector(".task-checkbox").addEventListener("click",async d=>{d.stopPropagation(),await Uk(n.id,e?"todo":"completed")}),t.addEventListener("click",d=>{!d.target.closest(".task-checkbox")&&!d.target.closest(".task-drag-handle")&&hI(n)}),t.addEventListener("contextmenu",d=>{d.preventDefault(),d.stopPropagation(),A2(n,d.clientX,d.clientY)}),t}function I2(n){n.addEventListener("dragover",t=>{t.preventDefault(),T2(n,t.clientY)})}function T2(n,t){return[...n.querySelectorAll("li:not(.opacity-50)")].reduce((i,s)=>{const r=s.getBoundingClientRect(),o=t-r.top-r.height/2;return o<0&&o>i.offset?{offset:o,element:s}:i},{offset:Number.NEGATIVE_INFINITY}).element}function A2(n,t,e){var r;(r=document.getElementById("task-context-menu"))==null||r.remove();const i=document.createElement("div");i.id="task-context-menu",i.className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]",i.style.left=`${t}px`,i.style.top=`${e}px`,i.innerHTML=`
        <button id="ctx-delete-task-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `,document.body.appendChild(i),document.getElementById("ctx-delete-task-btn").addEventListener("click",()=>{i.remove(),tt("削除しますか？",async()=>await Nm(n.id))});const s=o=>{i.contains(o.target)||(i.remove(),document.removeEventListener("click",s))};setTimeout(()=>{document.addEventListener("click",s)},0)}function S2(n){n.innerHTML='<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>'}let fl=!1;function ec(n,t,e){if(!fl)n.innerHTML=`
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 font-medium">タスクを追加</div>
            </div>
        `,n.querySelector("#show-input-btn").addEventListener("click",()=>{fl=!0,ec(n,t,e)});else{const s=ni().map(h=>`<option value="${h.id}">${h.start} - ${h.end}</option>`).join("");n.innerHTML=`
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-lg animate-fade-in-down">
                <input type="text" id="inline-title-input" placeholder="タスク名 (例: 明日14時に会議 #仕事)" 
                         class="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 mb-2">
                
                <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2"
                         class="w-full text-xs bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-600 dark:text-gray-300 mb-3 resize-none"></textarea>
                
                <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div class="flex space-x-2">
                        <!-- 期限日ボタン（将来拡張用） -->
                        <button class="flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition">
                            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            期限日
                        </button>
                        
                        <!-- ★追加: 時間帯選択プルダウン -->
                        <div class="relative">
                            <select id="inline-timeblock-select" class="appearance-none pl-2 pr-6 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="">時間帯 (未定)</option>
                                ${s}
                            </select>
                           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button id="cancel-input-btn" class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">キャンセル</button>
                        <button id="submit-task-btn" class="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                            タスクを追加
                        </button>
                    </div>
                </div>
            </div>
        `;const r=n.querySelector("#inline-title-input"),o=n.querySelector("#inline-desc-input"),a=n.querySelector("#inline-timeblock-select"),l=n.querySelector("#submit-task-btn");r.focus(),r.addEventListener("keydown",h=>{h.key==="Enter"&&!h.isComposing&&(h.preventDefault(),r.value.trim()&&u())}),n.querySelector("#cancel-input-btn").addEventListener("click",()=>{fl=!1,ec(n,t,e)});const u=async()=>{const h=r.value.trim(),d=o&&typeof o.value=="string"?o.value.trim():"",g=a.value,m={title:h,description:d,dueDate:null,projectId:t,labelIds:e?[e]:[],timeBlockId:g||null};if(h){l.disabled=!0,l.textContent="追加中...";try{await zk(m),r.value="",o.value="",r.focus(),l.textContent="追加しました",setTimeout(()=>{l.disabled=!1,l.textContent="タスクを追加"},1e3)}catch(y){console.error(y),y.message!=="Authentication required."&&console.error("Task addition failed unexpectedly:",y),l.disabled=!1}}};l.addEventListener("click",u)}}function P2(n,t){return[...n].sort((i,s)=>{var u,h;const r=(u=i.createdAt)!=null&&u.toDate?i.createdAt.toDate():new Date(i.createdAt||0),o=(h=s.createdAt)!=null&&h.toDate?s.createdAt.toDate():new Date(s.createdAt||0),a=(d,g,m="asc")=>{const y=(d||"").toString().toLowerCase(),v=(g||"").toString().toLowerCase();let w=0;return y<v?w=-1:y>v&&(w=1),m==="asc"?w:-w},l=(d,g,m)=>d==null?1:g==null?-1:m(d,g);switch(t){case"timeBlockId_asc":return l(i.timeBlockId,s.timeBlockId,(m,y)=>a(m,y,"asc"));case"projectId_asc":return l(i.projectId,s.projectId,(m,y)=>a(m,y,"asc"));case"title_asc":return a(i.title,s.title,"asc");case"createdAt_asc":return r-o;case"dueDate_asc":if(!i.dueDate)return 1;if(!s.dueDate)return-1;const d=i.dueDate.toDate?i.dueDate.toDate():new Date(i.dueDate),g=s.dueDate.toDate?s.dueDate.toDate():new Date(s.dueDate);return d-g;case"createdAt_desc":default:return o-r}})}let bg=null,vg=null;function R2(n,t,e=null,i=null){bg=e,vg=i;const s=document.getElementById("task-view");if(!s)return;C2(n.length,e,i);const r=document.getElementById("sort-select"),o=r?r.value:"createdAt_desc",a=P2(n,o);s.innerHTML="",F0(s,a);const l=document.createElement("div");l.id="inline-input-container",l.className="mt-2 pb-10",s.appendChild(l),ec(l,bg,vg)}function C2(n,t,e){const i=document.getElementById("header-title"),s=document.getElementById("header-count");i&&(t?i.textContent="プロジェクトタスク":e?i.textContent="ラベル付きタスク":i.textContent="インボックス"),s&&(s.textContent=`${n}件`)}function D2(n,t,e){return`
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            
            <!-- ヘッダー -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    設定
                </h3>
                <button id="close-settings-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                
                <!-- 1. 表示設定セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            表示設定
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <!-- テーマ設定 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">テーマ</label>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="app-theme" value="light" class="form-radio text-blue-600 focus:ring-blue-500">
                                    <div class="ml-3 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">ライト</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="app-theme" value="dark" class="form-radio text-blue-600 focus:ring-blue-500">
                                    <div class="ml-3 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">ダーク</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- サイドバー密度 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">サイドバーの密度</label>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="sidebar-density" value="normal" class="form-radio text-blue-600 focus:ring-blue-500" ${e?"":"checked"}>
                                    <div class="ml-3">
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">通常</span>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400">標準的な行間です</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="sidebar-density" value="compact" class="form-radio text-blue-600 focus:ring-blue-500" ${e?"checked":""}>
                                    <div class="ml-3">
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">コンパクト</span>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400">行間を狭くして多く表示します</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </details>

                <!-- 2. データ管理セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            データ管理
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="space-y-3">
                            <button id="export-data-btn-new" class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex justify-between items-center group border border-gray-100 dark:border-gray-700">
                                <div>
                                    <div class="text-sm font-medium text-gray-800 dark:text-gray-200">バックアップを作成 (JSON)</div>
                                    <div class="text-xs text-gray-500">現在のタスク、プロジェクト、ラベル等のデータをダウンロードします</div>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            </button>
                        </div>
                    </div>
                </details>

                <!-- 3. アカウント設定セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            アカウント
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold text-xl shadow-sm">
                                ${n}
                            </div>
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">ログイン中</div>
                                <div class="text-xs text-gray-600 dark:text-gray-300 font-mono">${t}</div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">パスワードの変更</label>
                            <div class="flex gap-2">
                                <input type="password" id="new-password-input-new" placeholder="新しいパスワード (6文字以上)" class="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                <button id="update-password-btn-new" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                                    変更
                                </button>
                            </div>
                            <p class="text-xs text-gray-500">※ セキュリティのため、再ログインが必要になる場合があります。</p>
                        </div>

                        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <button id="logout-btn-settings" class="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-2 group">
                                <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                ログアウト
                            </button>
                        </div>
                    </div>
                </details>

            </div>

            <!-- フッター -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                <button id="close-settings-footer" class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold text-sm transition-all shadow-sm">
                    閉じる
                </button>
            </div>
        </div>
    `}function M2(n,t){var e,i;(e=document.getElementById("close-settings-modal"))==null||e.addEventListener("click",t),(i=document.getElementById("close-settings-footer"))==null||i.addEventListener("click",t),n.addEventListener("click",s=>{s.target===n&&t()}),L2(),O2(),V2(),N2(),F2(t)}function L2(){const n=localStorage.getItem("theme")==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.querySelectorAll('input[name="app-theme"]').forEach(e=>{e.value===n&&(e.checked=!0),e.addEventListener("change",i=>{i.target.value==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))})})}function O2(){document.querySelectorAll('input[name="sidebar-density"]').forEach(t=>{t.addEventListener("change",e=>{const s=e.target.value==="compact";localStorage.setItem("sidebar_compact",s),window.dispatchEvent(new CustomEvent("sidebar-settings-updated",{detail:{compact:s}}))})})}function V2(){const n=document.getElementById("export-data-btn-new");n&&n.addEventListener("click",async()=>{const t=n.innerHTML;n.disabled=!0,n.innerHTML=`
            <div class="flex items-center justify-center w-full gap-2">
                <svg class="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
                </svg>
                作成中...
            </div>
        `;try{const e=await jk();B2(e,`task_manager_backup_${U2()}.json`),tt("バックアップデータをダウンロードしました")}catch(e){console.error("Export Error:",e),tt("データのエクスポートに失敗しました","error")}finally{n.disabled=!1,n.innerHTML=t}})}function N2(){const n=document.getElementById("update-password-btn-new"),t=document.getElementById("new-password-input-new");!n||!t||n.addEventListener("click",async()=>{const e=t.value;if(!e||e.length<6){tt("パスワードは6文字以上で入力してください","error");return}try{await Ik(e),tt("パスワードを変更しました"),t.value=""}catch(i){console.error(i),i.code==="auth/requires-recent-login"?tt("セキュリティのため、再ログインが必要です。一度ログアウトしてから再度お試しください。","error"):tt("変更に失敗しました: "+i.message,"error")}})}function F2(n){const t=document.getElementById("logout-btn-settings");t&&t.addEventListener("click",async()=>{try{await ip(re),n()}catch(e){console.error(e),tt("ログアウトに失敗しました","error")}})}function B2(n,t){const e=JSON.stringify(n,null,2),i=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(i),r=document.createElement("a");r.href=s,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s)}function U2(){return new Date().toISOString().replace(/[:.]/g,"-").slice(0,19)}function B0(){document.addEventListener("click",n=>{n.target.closest("#settings-btn")&&(n.preventDefault(),j2())})}function j2(){var r,o;const n="settings-modal-dynamic";(r=document.getElementById(n))==null||r.remove();const t=localStorage.getItem("sidebar_compact")==="true",e=((o=re.currentUser)==null?void 0:o.email)||"匿名ユーザー",i=e[0].toUpperCase(),s=document.createElement("div");s.id=n,s.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",s.innerHTML=D2(i,e,t),document.body.appendChild(s),M2(s,()=>s.remove())}function U0(n,t){const{keyword:e,projectId:i,labelId:s,showCompleted:r}=t;return n.filter(o=>{if(!r&&o.status==="completed"||i&&o.projectId!==i||s&&(!o.labelIds||!o.labelIds.includes(s)))return!1;if(e){const a=e.toLowerCase(),l=o.title.toLowerCase().includes(a),u=(o.description||"").toLowerCase().includes(a);if(!l&&!u)return!1}return!0})}function z2(){return`
        <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1">ダッシュボード</h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- 1. 直近4日間の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </span>
                        日次完了数 (直近4日)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="dailyChart"></canvas>
                    </div>
                </div>

                <!-- 2. 直近4週間の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </span>
                        週間完了数 (直近4週 / 日曜起算)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <!-- 3. 直近4ヶ月の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        </span>
                        月次完了数 (直近4ヶ月)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="monthlyChart"></canvas>
                    </div>
                </div>

            </div>
        </div>
    `}function $2(n){return`
        <div class="max-w-3xl mx-auto mt-4">
            <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 px-1">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                タスク検索
            </h2>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">キーワード</label>
                        <input type="text" id="page-search-input" placeholder="タスク名を入力..." 
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 transition-colors text-sm">
                    </div>
                    <div class="md:w-1/3">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">プロジェクト</label>
                        <select id="page-search-project" 
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-colors text-sm appearance-none cursor-pointer">
                            <option value="">全てのプロジェクト</option>
                            ${n.map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
                        </select>
                    </div>
                </div>
            </div>

            <div id="search-results-container">
                <!-- 検索結果がここに表示されます -->
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            </div>
        </div>
    `}function H2(){return`
        <div class="space-y-6">
            <!-- パスワード更新 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
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
            </div>

            <!-- データエクスポート -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">データ管理</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">現在のすべてのタスク、プロジェクト、ラベルをJSONファイルとしてダウンロードします。</p>
                <button id="export-data-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
                    データのエクスポート
                </button>
            </div>
        </div>
    `}function co(n,t){t.forEach(e=>{e.classList.add("hidden"),e.classList.remove("animate-fade-in")}),n.classList.remove("hidden")}function uo(n){document.querySelectorAll(".sidebar-item-row").forEach(e=>{e.classList.remove("bg-blue-600","dark:bg-blue-600","text-white","dark:text-white","hover:bg-blue-700","dark:hover:bg-blue-700"),e.classList.add("text-gray-700","dark:text-gray-300","hover:bg-gray-100","dark:hover:bg-gray-800");const i=e.querySelector("svg, span");i&&(i.classList.remove("text-white","dark:text-white"),(e.id.startsWith("nav-")||e.dataset.type==="project")&&i.classList.add("text-gray-400"))});let t=null;if(n.type==="inbox"||n.type==="dashboard"||n.type==="search"||n.type==="settings")t=document.getElementById(`nav-${n.type}`);else if(n.type==="project"||n.type==="timeblock"||n.type==="duration"){const e=`.sidebar-item-row[data-type="${n.type}"][data-id="${n.id}"]`;t=document.querySelector(e)}else if(n.type==="custom"){const e=`.sidebar-item-row[data-type="filter"][data-id="${n.id}"]`;t=document.querySelector(e)}t&&W2(t)}function W2(n){n.classList.remove("text-gray-700","dark:text-gray-300","hover:bg-gray-100","dark:hover:bg-gray-800"),n.classList.add("bg-blue-600","dark:bg-blue-600","text-white","dark:text-white","hover:bg-blue-700","dark:hover:bg-blue-700");const t=n.querySelector("svg, span");t&&(t.classList.remove("text-gray-400"),t.classList.add("text-white","dark:text-white"))}function Oe(n){const t=document.getElementById("header-title");t&&(t.textContent=n)}function q2(n,t,e){if(n.type==="project"){const i=t.find(s=>s.id===n.id);Oe(i?i.name:"不明なプロジェクト")}else if(n.type==="label"){const i=e.find(s=>s.id===n.id);Oe(i?i.name:"不明なラベル")}else if(n.type==="timeblock")if(n.id==="unassigned")Oe("時間帯: 未定");else{const i=Wk(n.id);Oe(i?`時間帯: ${i.start} - ${i.end}`:"時間帯: 不明")}else n.type==="duration"?Oe(`所要時間: ${n.id}分`):Oe("インボックス")}function K2(){const n=document.getElementById("task-view"),t=document.getElementById("dashboard-view"),e=document.getElementById("settings-view");n&&(n.innerHTML='<div class="p-10 text-center text-gray-400">ログインしてください</div>'),t&&(t.innerHTML=""),e&&(e.innerHTML="")}function G2(n,t,e,i,s){co(n,t),n.innerHTML=$2(i);const r=document.getElementById("page-search-input"),o=document.getElementById("page-search-project"),a=document.getElementById("search-results-container");r==null||r.focus();const l=()=>{const u=r.value.trim(),h=o.value;if(!u){a.innerHTML=`
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            `;return}const d=U0(e,{keyword:u,projectId:h||null,showCompleted:!0});d.length===0?a.innerHTML='<div class="text-center text-gray-400 py-10">該当するタスクが見つかりませんでした</div>':(a.innerHTML="",F0(a,d))};r==null||r.addEventListener("input",l),o==null||o.addEventListener("change",l),Oe("検索"),uo(s)}let vt={type:"inbox",id:null};function j0(n){vt=n}function Y2(n,t,e){const i=document.getElementById("task-view"),s=document.getElementById("dashboard-view"),r=document.getElementById("search-view"),o=document.getElementById("settings-view"),a=document.getElementById("sort-trigger");if(a&&a.dataset.value,!i||!s||!o||!r)return;if(vt.type==="dashboard"){co(s,[i,o,r]),s.innerHTML=z2(),v2(n),Oe("ダッシュボード"),uo(vt);return}if(vt.type==="settings"){co(o,[i,s,r]),o.innerHTML=H2(),B0(),Oe("設定"),uo(vt);return}if(vt.type==="search"){G2(r,[i,s,o],n,t,vt);return}co(i,[s,o,r]);const l=document.getElementById("toggle-completed-btn");let h={keyword:"",showCompleted:(l==null?void 0:l.classList.contains("text-blue-500"))||!1,projectId:vt.type==="project"?vt.id:null,labelId:vt.type==="label"?vt.id:null},d=U0(n,h);vt.type==="timeblock"?vt.id==="unassigned"?d=d.filter(g=>!g.timeBlockId||g.timeBlockId==="null"):d=d.filter(g=>String(g.timeBlockId)===String(vt.id)):vt.type==="duration"&&(d=d.filter(g=>Number(g.duration)===Number(vt.id))),i.style.opacity="0",requestAnimationFrame(()=>{R2(d,t,vt.type==="project"?vt.id:null,vt.type==="label"?vt.id:null),requestAnimationFrame(()=>{i.style.opacity="1",uo(vt),q2(vt,t,e)})})}function Q2(){return`
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
                    <a href="#" id="nav-dashboard" class="sidebar-item-row group flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        ダッシュボード
                    </a>
                </li>
                <!-- インボックス -->
                <li>
                    <a href="#" id="nav-inbox" class="sidebar-item-row group flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors drop-target" data-type="inbox">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <span class="flex-1">インボックス</span>
                        <!-- ★修正: カウント要素を追加 -->
                        <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
                    </a>
                </li>
                <!-- 検索 -->
                <li>
                    <a href="#" id="nav-search" class="sidebar-item-row group flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        検索
                    </a>
                </li>
                <!-- 設定 -->
                <li>
                    <a href="#" id="nav-settings" class="sidebar-item-row group flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
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
    `}function X2(){document.querySelectorAll(".sidebar-section-header").forEach(n=>{n.addEventListener("click",t=>{if(t.target.closest("button"))return;const e=n.dataset.target,i=document.getElementById(e),s=n.querySelector("svg");i&&(i.classList.toggle("hidden"),i.classList.contains("hidden")?s.style.transform="rotate(-90deg)":s.style.transform="rotate(0deg)")})})}function Ws(n,t,e=null){n&&(n.addEventListener("dragover",i=>{i.preventDefault(),n.classList.add("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400")}),n.addEventListener("dragleave",()=>{n.classList.remove("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400")}),n.addEventListener("drop",async i=>{i.preventDefault(),n.classList.remove("bg-blue-100","dark:bg-blue-900","ring-2","ring-blue-400");const s=i.dataTransfer.getData("text/plain");if(s)try{if(t==="inbox")await ds(s,{projectId:null});else if(t==="project"&&e)await ds(s,{projectId:e});else if(t==="timeblock")await ds(s,{timeBlockId:e==="unassigned"||e===null?null:e});else if(t==="duration"&&e){const r=parseInt(e,10);await ds(s,{duration:r})}}catch(r){console.error("Drop Error:",r)}}))}function Bo(n,t,e,i,s){const r=document.createElement("li"),a=localStorage.getItem("sidebar_compact")==="true"?"py-0.5":"py-1.5";r.dataset.type=t,r.dataset.id=e,r.className=`group flex items-center justify-between px-3 ${a} text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target sidebar-item-row`;let l="";t==="project"?l='<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>':l=`<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="${i?`background-color: ${i};`:"background-color: #a0aec0;"}"></span>`;const u=s>0?`<span class="text-xs text-gray-400 font-light mr-2">${s}</span>`:"";return r.innerHTML=`
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${l}
            <span class="truncate">${n}</span>
        </div>
        <div class="flex items-center">
            ${u}
        </div>
    `,r}function J2(n,t,e,i){var o;(o=document.getElementById("sidebar-context-menu"))==null||o.remove();const s=document.createElement("div");s.id="sidebar-context-menu",s.className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]",s.style.left=`${n.clientX}px`,s.style.top=`${n.clientY}px`,s.innerHTML=`
        <button id="context-edit-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            編集
        </button>
        <button id="context-delete-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `,document.body.appendChild(s),document.getElementById("context-edit-btn").addEventListener("click",()=>{s.remove(),Bm(e,i)}),document.getElementById("context-delete-btn").addEventListener("click",()=>{s.remove(),tt(`${e.name} を削除しますか？
（関連するタスクのプロジェクト情報も削除されます）`,async()=>{try{await aI(e.id),j0({type:"inbox",id:null}),tt(`${e.name} を削除しました。`)}catch(a){console.error("Delete failed:",a),tt("削除に失敗しました。","error")}})});const r=a=>{s.contains(a.target)||(s.remove(),document.removeEventListener("click",r))};setTimeout(()=>{document.addEventListener("click",r)},0)}function Z2(){var o;const n="filter-creation-modal";(o=document.getElementById(n))==null||o.remove();const t=tI(),e=ni(),i=[30,45,60,75,90],s=document.createElement("div");s.id=n,s.className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",s.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            
            <!-- ヘッダー -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    カスタムフィルター作成
                </h3>
                <button id="close-filter-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                <!-- フィルター名 -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">フィルター名</label>
                    <input type="text" id="filter-name" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400" placeholder="例: 午前の重要タスク">
                </div>

                <!-- 3カラム選択エリア -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- 1. プロジェクト選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">プロジェクト</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1" id="project-select-container">
                            ${t.length===0?'<div class="text-xs text-gray-400 p-2">プロジェクトがありません</div>':""}
                            ${t.map(a=>`
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${a.id}" class="filter-project-checkbox form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">${a.name}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <!-- 2. 時間帯選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">時間帯</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1">
                            <!-- 未定（ID: null/unassigned） -->
                            <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input type="checkbox" value="null" class="filter-timeblock-checkbox form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                <span class="ml-2 w-3 h-3 rounded-full bg-gray-400"></span>
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">未定</span>
                            </label>

                            ${e.map(a=>`
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${a.id}" class="filter-timeblock-checkbox form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 w-3 h-3 rounded-full" style="background-color: ${a.color}"></span>
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">${a.start} - ${a.end}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <!-- 3. 所要時間選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">所要時間</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1">
                            ${i.map(a=>`
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${a}" class="filter-duration-checkbox form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">⏱️ ${a} min</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <p>※ 各カテゴリ内でチェックを入れると「OR（いずれか）」、カテゴリ間は「AND（かつ）」条件になります。</p>
                    <p>※ 何もチェックしないカテゴリは条件に含まれません（指定なし扱い）。</p>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                <button id="cancel-filter-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                <!-- ★修正: 紫色(bg-purple-600)から青色(bg-blue-600)に変更 -->
                <button id="save-filter-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                    フィルターを作成
                </button>
            </div>
        </div>
    `,document.body.appendChild(s);const r=()=>s.remove();document.getElementById("close-filter-modal").addEventListener("click",r),document.getElementById("cancel-filter-btn").addEventListener("click",r),s.addEventListener("click",a=>{a.target===s&&r()}),document.getElementById("save-filter-btn").addEventListener("click",async()=>{const a=document.getElementById("filter-name").value.trim();if(!a){tt("フィルター名を入力してください","error");return}const l=v=>Array.from(document.querySelectorAll(`.${v}:checked`)).map(w=>w.value),u=l("filter-project-checkbox"),h=l("filter-timeblock-checkbox"),d=l("filter-duration-checkbox"),g=[];if(u.length>0&&g.push(`project:${u.join(",")}`),h.length>0&&g.push(`timeblock:${h.join(",")}`),d.length>0&&g.push(`duration:${d.join(",")}`),g.length===0){tt("少なくとも1つの条件を選択してください","error");return}const m=g.join(" "),y={id:"filter-"+Date.now(),name:a,query:m,type:"custom"};try{if(typeof Kd=="function")await Kd(y);else{console.warn("addFilter function not found in store. Saving to localStorage manually.");const v=JSON.parse(localStorage.getItem("custom_filters")||"[]");v.push(y),localStorage.setItem("custom_filters",JSON.stringify(v)),document.dispatchEvent(new CustomEvent("filters-updated"))}tt("フィルターを作成しました"),r()}catch(v){console.error(v),tt("保存に失敗しました","error")}})}function tP(n){const t=document.getElementById("inbox-count");if(t){const e=n?n.filter(i=>!i.projectId&&i.status!=="completed").length:0;t.textContent=e,e>0?t.classList.remove("hidden"):t.classList.add("hidden")}}function Au(n,t=[]){const e=document.getElementById("project-list");e&&(e.innerHTML="",n.forEach(i=>{const s=t?t.filter(o=>o.projectId===i.id&&o.status!=="completed").length:0,r=Bo(i.name,"project",i.id,null,s);r.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"project",id:i.id}}))}),r.addEventListener("contextmenu",o=>{o.preventDefault(),J2(o,"project",i,n)}),Ws(r,"project",i.id),e.appendChild(r)}))}function z0(n=[]){const t=document.getElementById("timeblock-list");if(!t)return;t.innerHTML="",ni().forEach(r=>{const o=n?n.filter(u=>String(u.timeBlockId)===String(r.id)&&u.status!=="completed").length:0,a=`${r.start} - ${r.end}`,l=Bo(a,"timeblock",r.id,r.color,o);l.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"timeblock",id:r.id}}))}),l.addEventListener("contextmenu",u=>{u.preventDefault(),H0()}),Ws(l,"timeblock",r.id),t.appendChild(l)});const i=n?n.filter(r=>(r.timeBlockId===null||r.timeBlockId==="null")&&r.status!=="completed").length:0,s=Bo("未定","timeblock","unassigned","#a0aec0",i);s.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"timeblock",id:"unassigned"}}))}),Ws(s,"timeblock","unassigned"),t.appendChild(s)}function $0(n=[]){const t=document.getElementById("duration-list");if(!t)return;t.innerHTML="",[30,45,60,75,90].forEach(i=>{const s=n?n.filter(a=>Number(a.duration)===i&&a.status!=="completed").length:0,r=Bo(`${i} min`,"duration",i.toString(),null,s),o=r.firstElementChild;if(o){const a=o.querySelector('span[class*="w-2.5"]');a&&a.remove();const l=document.createElement("span");l.className="mr-3 text-sm",l.textContent="⏱️",o.insertBefore(l,o.firstChild)}r.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("route-change",{detail:{page:"duration",id:i.toString()}}))}),Ws(r,"duration",i.toString()),t.appendChild(r)})}function wg(n,t,e,i){n&&(Au(e,t),z0(t),$0(t),tP(t))}function H0(){var i;const n="timeblock-modal";(i=document.getElementById(n))==null||i.remove();const t=ni(),e=document.createElement("div");e.id=n,e.className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4",e.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
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
    `,document.body.appendChild(e),W0(t),document.getElementById("close-tb-modal").addEventListener("click",()=>e.remove()),document.getElementById("close-tb-footer").addEventListener("click",()=>{e.remove();const s=new CustomEvent("timeblocks-updated");document.dispatchEvent(s)}),document.getElementById("add-tb-btn").addEventListener("click",()=>{q0(null,document.getElementById("tb-list")),ho()})}function W0(n){const t=document.getElementById("tb-list");t.innerHTML="",n.forEach(e=>q0(e,t))}function ho(){const n=document.getElementById("add-tb-btn");document.querySelectorAll(".tb-row").length>=5?(n.disabled=!0,n.style.opacity="0.5",n.style.cursor="not-allowed"):(n.disabled=!1,n.style.opacity="1",n.style.cursor="pointer")}function q0(n,t){const e=!n,i=n||{id:"",name:"",start:"09:00",end:"10:00",color:"#808080"},s=document.createElement("div");s.className="tb-row flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-all hover:shadow-md group",e||(s.dataset.id=i.id),s.innerHTML=`
        <div class="cursor-move text-gray-400 hover:text-gray-600 p-1 handle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>
        
        <div class="relative">
            <input type="color" class="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden" value="${i.color}">
            <div class="absolute inset-0 pointer-events-none rounded border border-gray-200 dark:border-gray-600"></div>
        </div>

        <!-- ★修正: 名前入力欄を削除し、時間入力をメイン配置に -->
        <div class="flex-1 flex items-center gap-3 pl-2">
            <input type="time" class="tb-start px-3 py-2 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value="${i.start}">
            <span class="text-gray-400 font-bold">～</span>
            <input type="time" class="tb-end px-3 py-2 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value="${i.end}">
        </div>

        <div class="flex items-center gap-1">
            <button class="tb-save p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="保存">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button class="tb-delete p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `,t.appendChild(s);const r=s.querySelector(".tb-start"),o=s.querySelector(".tb-end"),a=s.querySelector('input[type="color"]'),l=s.querySelector(".tb-save"),u=s.querySelector(".tb-delete");l.addEventListener("click",async()=>{const h=r.value,d=o.value,g=a.value,m=`${h}-${d}`;if(h>=d)return tt("終了時間は開始時間より後にしてください","error");try{if(await $k({id:e?null:i.id,name:m,start:h,end:d,color:g}),s.classList.add("ring-2","ring-green-500","ring-opacity-50"),setTimeout(()=>s.classList.remove("ring-2","ring-green-500","ring-opacity-50"),1e3),e){const y=ni();W0(y),ho()}}catch(y){tt(y.message,"error")}}),u.addEventListener("click",async()=>{if(e){s.remove(),ho();return}tt("この時間帯設定を削除しますか？",async()=>{await Hk(i.id),s.remove(),ho()})})}function eP(n=[],t=[],e=[]){const i=document.getElementById("sidebar-content");if(!i)return;i.innerHTML=Q2();const s=document.getElementById("sidebar"),r=document.getElementById("sidebar-resizer");Fl(s,document.querySelector("main"),r),nP(),X2(),Ws(document.getElementById("nav-inbox"),"inbox"),wg(s,n,t),document.addEventListener("timeblocks-updated",()=>{wg(document.getElementById("sidebar"),n,t)}),window.addEventListener("sidebar-settings-updated",o=>{const a=o.detail.compact;document.querySelectorAll(".sidebar-item-row").forEach(u=>{a?u.classList.replace("py-1.5","py-0.5"):u.classList.replace("py-0.5","py-1.5")})}),nc(),window.addEventListener("resize",nc)}function nc(){const n=document.getElementById("sidebar"),t=document.getElementById("sidebar-open-btn"),e=document.getElementById("sidebar-close-btn");if(!n||!t||!e)return;const i=n.classList.contains("sidebar-closed");if(window.innerWidth>=768){t.classList.toggle("hidden",!i),e.classList.toggle("hidden",i),n.classList.toggle("hidden",i);const s=document.getElementById("sidebar-resizer");s&&s.classList.toggle("hidden",i)}else t.classList.remove("hidden"),e.classList.remove("hidden"),n.classList.remove("hidden")}function nP(){var e,i,s,r,o,a,l,u,h;const n=(d,g=null)=>document.dispatchEvent(new CustomEvent("route-change",{detail:{page:d,id:g}}));(e=document.getElementById("nav-dashboard"))==null||e.addEventListener("click",d=>{d.preventDefault(),n("dashboard")}),(i=document.getElementById("nav-inbox"))==null||i.addEventListener("click",d=>{d.preventDefault(),n("inbox")}),(s=document.getElementById("nav-search"))==null||s.addEventListener("click",d=>{d.preventDefault(),n("search")}),(r=document.getElementById("add-project-btn"))==null||r.addEventListener("click",()=>{Bm(null,[])}),(o=document.getElementById("add-filter-btn"))==null||o.addEventListener("click",()=>{Z2()}),(a=document.getElementById("edit-timeblocks-btn"))==null||a.addEventListener("click",()=>{H0()});const t=()=>{const d=document.getElementById("sidebar");if(!d)return;if(window.innerWidth<768)d.classList.toggle("-translate-x-full");else if(d.classList.toggle("sidebar-closed"),nc(),d.classList.contains("sidebar-closed"))localStorage.setItem("sidebarWidth",d.style.width.replace("px","")),d.style.width="";else{const m=localStorage.getItem("sidebarWidth")||"280";d.style.width=`${m}px`}};(l=document.getElementById("sidebar-open-btn"))==null||l.addEventListener("click",t),(u=document.getElementById("sidebar-close-btn"))==null||u.addEventListener("click",t),(h=document.getElementById("sidebar-close-mobile"))==null||h.addEventListener("click",t)}let jn=[],vi=[],Su=[],ic,sc,rc;function iP(){Lm(),Sk(),B0(),uI(),rP(),av(re,n=>{Tk(n),n?sP():(K0(),K2())})}function sP(){K0(),ic=Fk(n=>{jn=n.map(t=>({id:t.id,...t})),_n()}),sc=sI(n=>{vi=n,Au(vi,jn),_n()}),rc=cI(n=>{Su=n,_n()}),eP()}function K0(){ic&&ic(),sc&&sc(),rc&&rc(),jn=[],vi=[],Su=[],_n()}function _n(){vi.length&&Au(vi,jn),z0(jn),$0(jn),Y2(jn,vi,Su)}function rP(){var n,t;document.addEventListener("route-change",e=>{j0({type:e.detail.page,id:e.detail.id}),_n()}),(n=document.getElementById("search-input"))==null||n.addEventListener("input",_n),(t=document.getElementById("toggle-completed-btn"))==null||t.addEventListener("click",e=>{e.currentTarget.classList.toggle("text-blue-500"),_n()}),oP()}function oP(){const n=document.getElementById("sort-trigger"),t=document.getElementById("sort-menu"),e=document.getElementById("sort-label"),i=document.querySelectorAll(".sort-option");if(!n||!t||!e)return;const s=o=>{o&&(t.contains(o.target)||n.contains(o.target))||r(!1)},r=o=>{o?(t.classList.replace("opacity-0","opacity-100"),t.classList.replace("invisible","visible"),t.classList.replace("scale-95","scale-100"),t.classList.replace("pointer-events-none","pointer-events-auto"),document.addEventListener("click",s)):(t.classList.replace("opacity-100","opacity-0"),t.classList.replace("visible","invisible"),t.classList.replace("scale-100","scale-95"),t.classList.replace("pointer-events-auto","pointer-events-none"),document.removeEventListener("click",s))};n.addEventListener("click",o=>{o.stopPropagation();const a=t.classList.contains("opacity-100");r(!a)}),i.forEach(o=>{o.addEventListener("click",a=>{const l=o.dataset.value,u=o.textContent;e.textContent=u,n.dataset.value=l,_n(),r(!1)})}),n.dataset.value||(n.dataset.value="createdAt_desc",e.textContent="作成日(新しい順)")}document.addEventListener("DOMContentLoaded",()=>{console.log("Main: DOMContentLoaded"),iP()});
