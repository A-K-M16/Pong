//final
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let scoreboard = document.getElementById('Score');
let up = false, down = false;
let w = false, s =false;
canvas.height = 540;
canvas.width = 1080;
let scoreA=0,scoreB=0;
let r=0,k=0;

//ball class
class Ball{
    constructor(x=0,y=0,radius=5,velX=0,velY=0){
        this.x = Number(x);
        this.y = Number(y);
        this.radius = Number(radius);
        this.velX = Number(velX);
        this.velY = Number(velY);
        this.bounce = 0.90
    }
    get left(){
        return this.x-this.radius;
    }
    get right(){
        return this.x+this.radius;
    } 
    get top(){
        return this.y-this.radius;
    } 
    get bottom(){
        return this.y+this.radius;
    }
    move(){
        if(this.top + this.velY/10 < 0){
            this.y = this.radius;
            this.velY *= -this.bounce;
        }
        else if(this.bottom + this.velY/10 > canvas.height){
            this.y = canvas.height - this.radius;
            this.velY *= -this.bounce;
        }
        else if(this.left + this.velX/10 < 0){
            scoreB += 1;
            scoreboard.innerHTML = `Score A:${scoreA} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Score B:${scoreB}`;
            //console.log(`Score A:${scoreA} Score B:${scoreB}`);
            return 1;
        }
        else if(this.right + this.velX/10 >= canvas.width){
            scoreA += 1;
            scoreboard.innerHTML = `Score A:${scoreA} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Score B:${scoreB}`;
            //console.log(`Score A:${scoreA} Score B:${scoreB}`);
            return 1;
        }
        
        this.x += this.velX/10;
        this.y += this.velY/10;
        return 0;
    
    }
}
// bat class
class Bat{
    constructor(x=0,y=0,width=10,height=5,velY=10){
        this.x = Number(x);
        this.y = Number(y);
        this.height = Number(height);
        this.width = Number(width);
        this.velY = Number(velY);
    }
    get left(){
        return this.x-(this.width/2);
    }
    get right(){
        return this.x+(this.width/2);
    }
    get top(){
        return this.y-(this.height/2);
    }
    get bottom(){
        return this.y+(this.height/2);
    }
    moveup(){
        if(this.top-this.velY/10>0){
            this.y-=this.velY/10;
        }
        else{
            this.y = (this.height/2);
        }
    }
    movedown(){
        if(this.bottom+this.velY/10 <canvas.height){
            this.y+=this.velY/10;
        }
        else{
            this.y = canvas.height -(bat1.height/2);
        }
    }
    

}
//draw function
function draw(ball,batA,batB){
    ctx.beginPath()
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
    ctx.rect(batA.left,batA.top,batA.width,batA.height);
    ctx.rect(batB.left,batB.top,batB.width,batB.height);
    ctx.fillStyle = "#00154F";
    ctx.fill();
}
//collision on corners now working properly;
function angle(bat,ball,corner){
    let x,y;
    if(corner==='ul'){
        x = Math.abs(ball.x-bat.left);
        y = Math.abs(ball.y-bat.top);
    }
    else if(corner==='ur'){
        x = Math.abs(ball.x-bat.right);
        y = Math.abs(ball.y-bat.top);
    }
    else if(corner==='ll'){
        x = Math.abs(ball.x-bat.left);
        y = Math.abs(ball.y-bat.bottom);
    }
    else if(corner==='lr'){
        x = Math.abs(ball.x-bat.right);
        y = Math.abs(ball.y-bat.bottom);
    }


    if(x>y){
        ball.velX = -ball.velX;
        if(ball.velX>0){
            ball.velX+=1;
        }
        else if(ball.velX<0){
            ball.velX+= 1;
        }
    }
    else if(x<y){
        ball.velY = -ball.velY;
        if(ball.velY>0){
            ball.velY +=1;
        }
        else if(ball.velY<0){
            ball.velX += -1;
        }
    }
    
}
//interaction between ball and bat
function detectcollision(ball,bat){
    if(ball.x>bat.left && ball.x<bat.right){
        if(Math.abs(bat.y-ball.y) < ball.radius+bat.height/2){
            if(bat.y>ball.y){
                ball.y = bat.y-bat.height/2-ball.radius;
                if(bat.top < 2*ball.radius){
                    bat.y = 2*ball.radius + bat.height/2;
                }
                ball.velY += -1;
            }
            if(bat.y<ball.y){
                ball.y = bat.y+bat.height/2+ball.radius;
                if(bat.bottom > canvas.height - 2*ball.radius){
                    bat.y = canvas.height - (2*ball.radius + bat.height/2);
                }
                ball.velY += 1;
            }
        }
    }
    else if(ball.y>bat.top && ball.y<bat.bottom){
        if(Math.abs(bat.x-ball.x) < ball.radius+bat.width/2){
            if(bat.x>ball.x){
                ball.x = bat.x-bat.width/2-ball.radius;
                ball.velX=-ball.velX;
                ball.velX += -1;
            }
            if(bat.x<ball.x){
                ball.x = bat.x+bat.width/2+ball.radius;
                ball.velX=-ball.velX;


                ball.velX += 1;
            }
        }
    }
    else{
        if( ball.left>bat.left && ball.left<bat.right){
            if(ball.bottom>bat.top && ball.bottom<bat.bottom){
                //console.log('collision detected:upper right corner');
                angle(bat,ball,'ur');
            }
            else if(ball.top>bat.top && ball.top<bat.bottom){
                //console.log('collision detected:lower right corner');
                angle(bat,ball,'lr');
            }
        }
        if(ball.right>bat.left && ball.right<bat.right){
            if(ball.bottom>bat.top && ball.bottom<bat.bottom){
                //console.log('collision detected:upper left corner');
                angle(bat,ball,'ul');
            }
            else if(ball.top>bat.top && ball.top<bat.bottom){
                //console.log('collision detected:lower left corner');
                angle(bat,ball,'ll');
            }
        }
    }

}

//key presses
document.addEventListener('keydown', (eve)=>{
    if(eve.key=='ArrowUp'){
        up = true;
    }
    if(eve.key=='ArrowDown'){
        down = true;
    }
});
document.addEventListener('keyup', (eve)=>{
    if(eve.key=='ArrowUp'){
        up = false;
    }
    if(eve.key=='ArrowDown'){
        down = false;
    }
});
document.addEventListener('keydown', (eve)=>{
    if(eve.key=='w'){
        w = true;
    }
    if(eve.key=='s'){
        s = true;
    }
});
document.addEventListener('keyup', (eve)=>{
    if(eve.key=='w'){
        w = false;
    }
    if(eve.key=='s'){
        s = false;
    }
});
//New Game
document.getElementById('button').addEventListener("click", ()=>{
    ball1 = new Ball(550,275,16,(Math.round(Math.random())*2 - 1)*5,(Math.random() - 0.5)*10);
    bat1 = new Bat(20,300,20,160,10);
    bat2 = new Bat(canvas.width-20,300,20,160,10);
    r=0;
    scoreA=0,scoreB=0;
    scoreboard.innerHTML = `Score A:${scoreA} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Score B:${scoreB}`;
    if(k==0){
        init();
    }
})

function init(){
    k=1;
    if(r==1){
        if(scoreB>4 || scoreA>4){
            k=0;
            if(scoreA>scoreB){
                alert("Game Ended, A wins");
            }
            else{
                alert("Game Ended, B wins");
            }
            return
        }
        ball1 = new Ball(550,275,16,(Math.round(Math.random())*2 - 1)*5,(Math.random() - 0.5)*10);
        r=0;
    }
    draw(ball1,bat1,bat2)
    for(let i=0;i<10;i++){
        if(ball1.move()){
            r=1;
            break;
        }
        if(up==true){
            bat2.moveup();
        }
        if(down==true){
            bat2.movedown();
        }
        if(w==true){
            bat1.moveup();
        }
        if(s==true){
            bat1.movedown();
        }
        detectcollision(ball1,bat1);
        detectcollision(ball1,bat2);
    }

    window.requestAnimationFrame(init);
}

//objects on canvas
let ball1 = new Ball(550,275,16,(Math.round(Math.random())*2 - 1)*5,(Math.random() - 0.5)*10);
let bat1 = new Bat(20,300,20,160,10);
let bat2 = new Bat(canvas.width-20,300,20,160,10);


//running main

init();
