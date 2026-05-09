const {QUESTIONS} = require('./galti_questions.js');
const dims = Array.from({length:20},()=>({count:0,min:0,max:0}));
const dimNames = ['外向','感性','冷酷','叛逆','冲动','大胆','悲观','独立','热情','自私','狡猾','散漫','玩闹','开放','灵活','坚强','务实','强势','善变','中二'];

QUESTIONS.forEach((q,qi)=>{
  const dimVals = {};
  q.opts.forEach(opt=>{
    opt.s.forEach(([d,v])=>{
      if(!dimVals[d]) dimVals[d]={max:-Infinity,min:Infinity};
      dimVals[d].max = Math.max(dimVals[d].max, v);
      dimVals[d].min = Math.min(dimVals[d].min, v);
    });
  });
  for(const d in dimVals){
    const i = parseInt(d);
    dims[i].count++;
    dims[i].max += dimVals[d].max;
    dims[i].min += dimVals[d].min;
  }
});

let allOk=true;
dims.forEach((d,i)=>{
  const range = d.max - d.min;
  const ok = d.count===5 && range>0;
  if(!ok) allOk=false;
  console.log(dimNames[i]+' | '+d.count+' | '+d.min+' | '+d.max+' | '+range+' | '+(ok?'OK':'ERR'));
});
console.log('ALL dimensions appear 5 times: '+(allOk?'YES':'NO'));

// Check duplicate pairs
const pairSet=new Set();
let pOk=true;
QUESTIONS.forEach((q,qi)=>{
  const ds=q.opts[0].s.map(x=>x[0]).sort((a,b)=>a-b).join(',');
  if(pairSet.has(ds)){console.log('DUPLICATE pair Q'+(qi+1)+': '+ds);pOk=false;}
  pairSet.add(ds);
});
console.log('No duplicate dimension pairs: '+(pOk?'YES':'NO'));