/*Francisco_Carvalho_190100146*/

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const keys = [];
var dir = 0;
const projectiles = [];

var arrayInimigos = [];

const player = {
    x: 200,
    y: 200,
    width: 48 ,
    height: 48 ,
    frameX: 0,
    frameY: 0,
    speed: 10
};


class PlayerInimigo {
    constructor(x, y, width, height, frameX, frameY, speed, src) {
        var image = new Image();
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.frameX=frameX;
        this.frameY=frameY;
        this.speed=speed;
        this.image = image;
        this.image.src=src;
    }
    
};


const playerSprite= new Image();
playerSprite.src = "girl.png";
const background = new Image();
background.src = "background.png";

// var image = new Image();
// image.src = "girl.png";

//adicionar inimigos
for(var i=0;i<10;i++)
    arrayInimigos.push(new PlayerInimigo(
        Math.random()*(canvas.width-50), 
        Math.random()*(canvas.height-50), 33, 48, 0, 0, 10, "inimigo3.png"));

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}



function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, 48*player.frameX, 48*player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    requestAnimationFrame(animate); 
    collision(projectiles);
    
    
    var index =-1;
    arrayInimigos.forEach(inimigo => 
        {
            drawSprite(inimigo.image, 48*inimigo.frameX, 48*inimigo.frameY, inimigo.width, inimigo.height, inimigo.x, inimigo.y, inimigo.width, inimigo.height);
            if(Math.random() > 0.94 ){
                if(Math.random() > 0.5){
                    var tempX = inimigo.x + (Math.random() > 0.5 ? 2.5*inimigo.speed : -2.5*inimigo.speed);
                    if (tempX < canvas.width-50 && tempX > 0){
                        inimigo.x = tempX;
                    } 
                    
                } else {

                    var tempY = inimigo.y + (Math.random() > 0.5 ? 2.5*inimigo.speed : -2.5*inimigo.speed);
                    if (tempY < canvas.height-50 && tempY > 0){
                        inimigo.y = tempY;
                    } 
                }    
            }
        }
    );
    
    projectiles.forEach(projectile => {
        projectile.update();
        if(projectile.position.x >= canvas.width || projectile.position.x <=0 || projectile.position.y >= canvas.height || projectile.position.y <= 0){
            index = projectiles.indexOf(projectile);
            
        }
    });
    if(index != -1)
        projectiles.splice(index, 1);
}

function getDistance(x1, y1, x2, y2){
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

var score=0;

/*

    // Update the game state

    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update the fps counter
        updateFps(dt);

        if (gamestate == gamestates.ready) {

            // Game is ready for player input

        } else if (gamestate == gamestates.shootbubble) {

            // Bubble is moving

            stateShootBubble(dt);

        } else if (gamestate == gamestates.removecluster) {

            // Remove cluster and drop tiles

            stateRemoveCluster(dt);
        }
    }

    function setGameState(newgamestate) {

        gamestate = newgamestate;
        animationstate = 0;
        animationtime = 0;
    }

    function stateShootBubble(dt) {


        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));

        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));

        if (player.bubble.x <= level.x) {

            // Left edge
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x;

        } else if (player.bubble.x + level.tilewidth >= level.x + level.width) {

            // Right edge
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x + level.width - level.tilewidth;

        }

        // Collisions with the top of the level

        if (player.bubble.y <= level.y) {

            // Top collision
            player.bubble.y = level.y;
            snapBubble();
            return;
        } 
*/

function collision(projectiles){
    arrayInimigos.some((enemy)=>{
         projectiles.some((projectile)=>{
            // console.log("projectile1 " + getDistance(projectile.position.x, projectile.position.y, enemy.x, enemy.y) +
            //  " < "+ enemy.x + " m "+ enemy.width/2 +" , "+ projectile.width/2);
            if(getDistance(projectile.position.x, projectile.position.y, enemy.x+20, enemy.y+20) < enemy.width/2 + projectile.radius){
                console.log("Colisão com Projétil");
                //console.log("Tamanho inicial do array enemies: " + enemies.length);
                //Remove o Inimigo
                arrayInimigos.splice(arrayInimigos.indexOf(enemy),1);
                //Remove o Projétil 
                projectiles.splice(projectiles.indexOf(projectile), 1);
                //console.log("Tamanho final do array enemies: " + enemies.length);
                
                score += 100;
                enemy.image.src = "";
                document.getElementById("Score").innerHTML = "SCORE: " + score;

                if(arrayInimigos.length == 0) {
                    //console.log("YOU WIN!!!!");
                    if (window.confirm("YOU WIN!!!! <> Ganhou o Jogo!!!!")) {
                        document.getElementById("Resultado").innerHTML = "Fim do Jogo!";
                      } else {
                        document.getElementById("Resultado").innerHTML = "Cancelou o jogo.....";
                      }


                };
            }
         });
    });
}

animate();

window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
    // console.log("keydown " + e.keyCode + ", keys:: "+ keys);
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
    // console.log("keyup "+ ", keys:: "+ keys);
});

function movePlayer(){
    // console.log("move " + projectiles);
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