(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e,t,a){e.exports=a(25)},25:function(e,t,a){"use strict";a.r(t);var r=a(2),o=a.n(r),n=a(11),i=a.n(n),s=a(27),l=a(12);a(20);var d=function(){const[e,t]=Object(r.useState)([]),a=async()=>{try{const a=await s.a.get(Object({NODE_ENV:"production",PUBLIC_URL:"/SmartEnergyHub"}).API_URL);console.log("Fetched Data:",a.data),Array.isArray(a.data)?t(a.data):console.error("Invalid API response format:",a.data)}catch(e){console.error("Error fetching the response:",e)}};Object(r.useEffect)(()=>{a();const e=setInterval(()=>{a()},5e3);return()=>clearInterval(e)},[]);const n=[...e].sort((e,t)=>new Date(e.timestamp)-new Date(t.timestamp)),i=[...new Set(n.map(e=>e.timestamp))],d=e=>i.map(t=>{const a=n.find(a=>a.sensor===e&&a.timestamp===t);return a?a.value:null}),c=e.length>0?{labels:i.map(e=>new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})),datasets:[{label:"HVAC Floor 1",data:d("hvac/floor1"),spanGaps:!0,borderColor:"rgb(255, 99, 132)",backgroundColor:"rgba(255, 99, 132, 0.2)",borderWidth:3,pointRadius:5},{label:"HVAC Floor 2",data:d("hvac/floor2"),spanGaps:!0,borderColor:"rgb(54, 162, 235)",backgroundColor:"rgba(54, 162, 235, 0.2)",borderWidth:3,pointRadius:5},{label:"Lighting Floor 1",data:d("lighting/floor1"),spanGaps:!0,borderColor:"rgb(255, 206, 86)",backgroundColor:"rgba(255, 206, 86, 0.2)",borderWidth:3,pointRadius:5},{label:"Lighting Floor 2",data:d("lighting/floor2"),spanGaps:!0,borderColor:"rgb(75, 192, 192)",backgroundColor:"rgba(75, 192, 192, 0.2)",borderWidth:3,pointRadius:5}]}:{labels:[],datasets:[]};return o.a.createElement("div",{style:{textAlign:"center",padding:"20px"}},o.a.createElement("h1",null,o.a.createElement("span",{img:"\ud83d\udcca"})," Smart Energy Dashboard"),o.a.createElement("div",{style:{width:"100%",height:"500px"}},o.a.createElement(l.a,{data:c,options:{responsive:!0,maintainAspectRatio:!0,elements:{line:{tension:.2,borderWidth:3},point:{radius:5}},scales:{x:{ticks:{autoSkip:!0,maxTicksLimit:10}},y:{beginAtZero:!1}}}})))};i.a.createRoot(document.getElementById("root")).render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(d,null)))}},[[13,1,2]]]);
//# sourceMappingURL=main.8fe7b37a.chunk.js.map