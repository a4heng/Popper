//setup the canvas
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia'
//mouse interaction
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition)
const mouse = {
    x : canvas.width/2,
    y : canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = Math.floor(event.x - canvasPosition.x);
    mouse.y = Math.floor(event.y - canvasPosition.y);
    console.log(mouse.x, mouse.y)
})

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})
//player
const playerLeft = new Image();
playerLeft.src = './asset/swim_to_left_sheet.png'
const playerRight = new Image();
playerRight.src = './asset/swim_to_right_sheet.png'
class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 25;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 256;
        this.spriteHeight = 256;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y
        if(mouse.x !== this.x){
            this.x -= dx/15;
        }
        if(mouse.y !== this.y){
            this.y -= dy/15;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.001;
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red'
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y,this.radius,10)
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-30, this.y-30, this.spriteWidth/4, this.spriteHeight/4)
        }else{
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-30, this.y-30, this.spriteWidth/4, this.spriteHeight/4)
        }

    }
}
const player = new Player();
//bubbles
const bubble = [];

class Bubble{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 25;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1': 'sound2'
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2)
        ctx.fill()
        ctx.closePath();
        ctx.stroke()
    }
}

const bubblePopSound1 = document.createElement('audio')
bubblePopSound1.src = './audio/pop1.wav'
const bubblePopSound2 = document.createElement('audio')
bubblePopSound2.src = './audio/pop3.wav'
function handleBubble(){
    if(gameFrame % 50 === 0){
        bubble.push(new Bubble())
        console.log(bubble)
    }
    for(let i = 0; i<bubble.length; i++){
        bubble[i].update();
        bubble[i].draw();
        if(bubble[i].y < 0 -bubble[i].radius*2){
            setTimeout(()=> bubble.splice(i,1),0)
        }
        if(bubble[i].distance < bubble[i].radius + player.radius){
            console.log("collision")
            if(!bubble[i].counted){
                if(bubble[i].sound == 'sound1'){
                    bubblePopSound1.play()
                }else{
                    bubblePopSound2.play()
                }
                score++;
                bubble[i].counted = true;
                bubble.splice(i,1)
            }
        }
    }
}

//animation loop
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    player.update();
    player.draw();
    gameFrame++;
    handleBubble()
    ctx.fillStyle = 'black'
    ctx.fillText(`Score: ${score}`, 0, 50)
    requestAnimationFrame(animate)
}

animate();

