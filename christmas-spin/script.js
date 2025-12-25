const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyn8Hcn2GFrS1x4WVC3hnwFpwMIIryBlbODlP4R1S6rbM1gjE4i0GAqV6qc_CzQwSqH/exec";

/* ONE PLAY ONLY */
if(localStorage.getItem("played")){
    document.body.innerHTML="<h2 style='color:white;text-align:center;margin-top:60px'>🎄 You already played. Merry Christmas 🎄 </h2>";
}

/* QUESTIONS */
const correctAnswers={q1:"Aug 8",q2:"UAE",q3:"Both"};
const answersMap={
    q1:["Aug 8","Jan 8","Feb 8"],
    q2:["Philippines","UAE","USA"],
    q3:["Church","Civil","Both"]
};

/* PRIZES */
const prizes=[
    {label:"100",color:"#c62828"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"100",color:"#2e7d32"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"100",color:"#fbc02d"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"100",color:"#c62828"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"100",color:"#2e7d32"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"200",color:"#fbc02d"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"200",color:"#c62828"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"500",color:"#2e7d32"},
	    {label:"🎄 Bonus",color:"#c62828"},
    {label:"500",color:"#fbc02d"},
    {label:"🎄 Bonus",color:"#c62828"},

];
const prizeLimits={ "100":10, "200":2, "500":2 };
let used={ "100":0, "200":0, "500":0 };

/* ELEMENTS */
const nameInput=document.getElementById("name");
const gcashInput=document.getElementById("gcash");
const submitBtn=document.getElementById("submitBtn");
const spinBtn=document.getElementById("spinBtn");
const formBox=document.getElementById("formBox");
const wheelBox=document.getElementById("wheelBox");
const wheel=document.getElementById("wheel");
const result=document.getElementById("result");
const q=document.getElementById("question");
const a=document.getElementById("answer");
const spinSound=document.getElementById("spinSound");
const winSound=document.getElementById("winSound");

/* Populate answers */
q.onchange=()=>{a.innerHTML='<option value="">Choose an answer</option>'; if(!q.value)return; answersMap[q.value].forEach(v=>a.innerHTML+=`<option>${v}</option>`);};

/* Validate form */
submitBtn.onclick=()=>{
    if(nameInput.value.trim()===""||gcashInput.value.trim()===""||q.value===""||a.value===""){ alert("Please complete all fields"); return;}
    if(a.value!==correctAnswers[q.value]){ alert("❌ Incorrect answer"); return;}

    window.player={ name:nameInput.value.trim(), gcash:gcashInput.value.trim(),
        question:q.options[q.selectedIndex].text, answer:a.value };

    formBox.classList.add("hidden");
    wheelBox.classList.remove("hidden");
};

/* Create wheel segments with visible labels */
function createWheel(){
    wheel.innerHTML='';
    const segmentAngle = 360/prizes.length;
    const radius = 130;

    prizes.forEach((p,i)=>{
        const span = document.createElement('span');
        span.textContent = p.label;
        span.style.position = "absolute";
        span.style.left = "50%";
        span.style.top = "50%";
        span.style.transformOrigin = "0 0";
        span.style.transform = `rotate(${i*segmentAngle}deg) translate(${radius}px) rotate(${segmentAngle/2}deg)`;
        span.style.color = "white";
        span.style.fontWeight = "bold";
        span.style.fontSize = "0.95rem";
        span.style.textAlign = "center";
        span.style.textShadow = "0 0 4px black";
        span.style.background = p.color;
        span.style.padding = "4px 6px";
        span.style.borderRadius = "6px";
        span.style.zIndex = "2";
        wheel.appendChild(span);
    });
}
createWheel();

/* Spin */
spinBtn.onclick=()=>{
    spinBtn.disabled=true;
    spinSound.play();
    wheel.classList.add("glow");

    let index, prize;
    do{
        index=Math.floor(Math.random()*prizes.length);
        prize=prizes[index];
    }while(prizeLimits[prize.label] && used[prize.label]>=prizeLimits[prize.label]);
    if(prizeLimits[prize.label]) used[prize.label]++;

    const segmentAngle = 360/prizes.length;
    const rotations = 6;
    const deg = rotations*360 + index*segmentAngle + segmentAngle/2;

    wheel.style.transition='transform 5s cubic-bezier(.17,.67,.25,1)';
    wheel.style.transform=`rotate(${deg}deg)`;

    setTimeout(()=>{
        wheel.classList.remove("glow");
        const segments = wheel.querySelectorAll('span');
        segments.forEach(s=>s.classList.remove('highlight'));
        segments[index].classList.add('highlight');

        result.textContent = prize.label.includes("Bonus")?"🎄 Mahal Namin Kayo ❤️":"🎉 You won "+prize.label+"!";
        result.classList.add("pop");
        winSound.play();
        confetti();
        save(prize.label);
        localStorage.setItem("played","yes");
    },5100);
};

/* Confetti */
function confetti(){
    for(let i=0;i<50;i++){
        const c=document.createElement("div");
        c.style.cssText=`position:fixed;left:${Math.random()*100}vw;
        top:-10px;width:8px;height:8px;background:hsl(${Math.random()*360},100%,50%);
        animation:fall 3s linear forwards`;
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),3000);
    }
}

/* Save to Google Sheet */
function save(prize){
    fetch(WEB_APP_URL,{
        method:"POST",
        body:JSON.stringify({...window.player, prize})
    });
}
