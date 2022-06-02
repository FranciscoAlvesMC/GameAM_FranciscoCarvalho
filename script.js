const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const keys = [];
var dir = 0;
const projectiles = []

const player = {
    x: 200,
    y: 200,
    width: 48 ,
    height: 48 ,
    frameX: 0,
    frameY: 0,
    speed: 10
};

//adicionar inimigos????
//

const playerSprite= new Image();
playerSprite.src = "girl.png";
const background = new Image();
background.src = "background.png";

const playerSpriteInimigo= new Image();
playerSprite.src = "girl.png";


function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, 48*player.frameX, 48*player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
   
    requestAnimationFrame(animate); 
    
    var index =-1;
    projectiles.forEach(projectile => {
        projectile.update()
        if(projectile.position.x >= canvas.width || projectile.position.x <=0 || projectile.position.y >= canvas.height || projectile.position.y <= 0){
            index = projectiles.indexOf(projectile);
            
        }
    });
    if(index != -1)
        projectiles.splice(index, 1);
}
animate();

window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
    console.log("keydown " + e.keyCode + ", keys:: "+ keys);
    movePlayer();
    firedBall();

});


class Projectile {
    constructor(x,y, velocityX, velocityY) {
        this.position = {
            x: x + 24,
            y: y + 24
        }

        this.velocity = {
            x: velocityX,
            y: velocityY
        }

        this.color = "black"

        this.radius = 10
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2* Math.PI, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()

        this.position.x += this.velocity.x * 10
        this.position.y += this.velocity.y * 10

        


    }
}

function firedBall(){
    if (keys[32]){
        if(dir == 38)
            projectiles.push(new Projectile(player.x, player.y, 0, -1))
        if(dir == 40)
            projectiles.push(new Projectile(player.x, player.y, 0, 1))
        if(dir == 37)
            projectiles.push(new Projectile(player.x, player.y, -1, 0))
        if(dir == 39)
            projectiles.push(new Projectile(player.x, player.y, 1, 0))
    }

}

window.addEventListener("keyup", function(e){
    delete keys[e.keyCode];
    console.log("keyup "+ ", keys:: "+ keys);
});

function movePlayer(){
    console.log("move " + projectiles);
   
    if (keys[38] && player.y > 20){ //cima
        player.y -= player.speed;
        player.frameX += 1;
        player.frameY = 3;
        dir=38;
    }
    if (keys[40] && player.y < 450 ){ //baixo
        player.y += player.speed;
        player.frameX += 1;
        player.frameY = 0;
        dir=40;
    }
    if (keys[37] && player.x > 20){ // esq
        player.x -= player.speed;
        player.frameX += 1;
        player.frameY = 1;
        dir=37;
    }
    if (keys[39] && player.x < 750){ // dir
        player.x += player.speed;
        player.frameX += 1;
        player.frameY = 2;
        dir=39;
    }
    if(player.frameX >= 3){
        player.frameX = 0;
    }
}