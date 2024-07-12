const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const addButton=document.getElementById("addButton");
const rotateButton=document.getElementById("rotateButton");
const elementInput=document.getElementById("elementInput");

const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];
const centerX_num = canvas.width / 2;
const centerY_num = canvas.height / 2;
const radius_num = canvas.width*2/5;

let elements_strs=["a"];

resetUl();

//設定按鈕
addButton.onclick=()=>{
    addElementIntoArray();
    resetUl();
}
rotateButton.onclick=()=>{
    if(elements_strs.length==0){
        return;
    }
    disableButtons(false);
    let target_num=(Math.random()*360+720)*(Math.PI / 180);
    spinRoulette(target_num);
}

//控制按鈕開關功能
function disableButtons(isOpen_bool){
    addButton.disabled=!isOpen_bool;
    rotateButton.disabled =!isOpen_bool;
    let deleteButtons = document.getElementsByClassName("deleteButtons");
    for (let button of deleteButtons) {
        button.disabled = !isOpen_bool;
    }
}

//取得輸入條的文字加入元素陣列
function addElementIntoArray(){
    let temp_str=elementInput.value;
    if(temp_str==""){
        return;
    }
    elements_strs.push(temp_str);
    elementInput.value="";
}

//刪除元素
function deleteElement(index_num) {
    elements_strs.splice(index_num, 1);
    resetUl();
}

//刷新顯示html的ul
function resetUl(){
    let elementList = document.getElementById("elementList");
    elementList.innerHTML = "";
    elements_strs.forEach((element, index) => {
        let newlist = document.createElement('li');
        newlist.textContent = element;
        let deleteButton = document.createElement('button');
        deleteButton.className="deleteButtons";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            deleteElement(index);
        };
        newlist.appendChild(deleteButton);
        elementList.appendChild(newlist);
    });
    drawRoulette(0);
}

//繪製弧形(給繪製輪盤用)
function drawSector(startAngle_num, endAngle_num, color) {
    ctx.beginPath();
    ctx.moveTo(centerX_num, centerY_num);
    ctx.arc(centerX_num, centerY_num, radius_num, startAngle_num, endAngle_num);
    ctx.lineTo(centerX_num, centerY_num);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

//繪製輪盤(輸入弧度)
function drawRoulette(rotateAngle_num) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i_num = 0; i_num < elements_strs.length; i_num++) {
        let start_num = i_num * (2 * Math.PI) / elements_strs.length + rotateAngle_num;
        let end_num = (i_num + 1) * (2 * Math.PI) / elements_strs.length + rotateAngle_num;
        drawSector(start_num, end_num, colors[i_num % 8]);
        let middle_num = (start_num + end_num) / 2;
        ctx.save();
        ctx.translate(centerX_num, centerY_num);
        ctx.rotate(middle_num);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(elements_strs[i_num], radius_num - 10, 10);
        ctx.restore();
    }

    drawIndicatorTriangle();
}


function drawIndicatorTriangle() {
    let indicatorSize_num = 20;
    let triangleBase_num = -30;
    ctx.save();
    ctx.translate(centerX_num, centerY_num);
    ctx.beginPath();
    ctx.moveTo(radius_num + 10, 0);
    ctx.lineTo(radius_num + 10 - triangleBase_num, -indicatorSize_num / 2);
    ctx.lineTo(radius_num + 10 - triangleBase_num, indicatorSize_num / 2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
}

//選轉輪盤
const piDivision=500;
async function spinRoulette(targetAngle_num) {
    let angularVelocity_num = 0;
    let currentAngle_num = 0;
    let step = 0;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (step < piDivision) {
        angularVelocity_num = targetAngle_num * Math.sin(Math.PI / piDivision);
        currentAngle_num += angularVelocity_num;
        drawRoulette(currentAngle_num);
        await delay(0.001);
        step++;
    }
    disableButtons(true);
}
