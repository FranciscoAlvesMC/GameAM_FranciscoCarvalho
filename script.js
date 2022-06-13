/*Francisco_Carvalho_190100146    <nova data limite dia 15 9:30>*/ 

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const keys = [];
var dir = 0;
const playerProjectiles = [];
var score=0;
var delay=10;
const danoPow= new Image();
danoPow.src = "POW.png";

var arrayInimigos = [];

var difficultyMode;

const playerSprite= new Image();
playerSprite.src = "girl.png";
const background = new Image();
background.src = "background.png";

//adicionar inimigos e pode alterar o nº de inimigos
var numberOfEnemies;
var projectilesEnemy = [];

const portallvl = {
    nivel: 1,
    x: 730,
    y: 250,
    width:39,
    height:70,
};

var ctxPlayer = canvas.getContext("2d");
const player = {
    x: 200,
    y: 200,
    width: 48 ,
    height: 48 ,
    frameX: 0,
    frameY: 0,
    speed: 10,
    health:20,
};

var atraso = 35;

class PlayerInimigo {
    constructor(x, y, width, height, frameX, frameY, speed, health, src, projectiles, delay=atraso) {
        var image = new Image();
        this.x = x;
        this.y = y;
        this.health = health;
        this.width = width;
        this.height = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = speed;
        this.image = image;
        this.image.src = src;
        this.projectiles = projectiles;
        this.delay=delay;
    }
};


function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}
var init=0;
var healthEnemy;
function animate(){
    if(init==0)
    {  
        let text;
        let diff = prompt("Escolha a dificuldade: 1=EASY 2=MEDIUM 3=HARDCORE", "1");
        if (diff == null || diff == "") {
            text = "ficou por defeito -> EASY";
            difficultyMode = '1';
        } else {
            text = "Escolheu a dificuldade " + diff;
            difficultyMode = diff;
        }
        document.getElementById("Dificuldade").innerHTML = text;
        
        switch(difficultyMode){
            case '2':
                healthEnemy=10;
                numberOfEnemies=8;
                player.health=15;
            break;
            case '3':
                healthEnemy=20;
                numberOfEnemies=15;
                player.health=10;
            break;
            default:
                healthEnemy=2;
                numberOfEnemies=1;
            break;
        }

        for(var i=0;i<numberOfEnemies;i++){
        arrayInimigos.push(new PlayerInimigo(
            Math.random()*(canvas.width-50), 
            Math.random()*(canvas.height-50), 33, 48, 0, 0, 10, healthEnemy, "inimigo3.png", []));
        }
    }





    init++;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawSprite(playerSprite, 48*player.frameX, 48*player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    
    
    ctxPlayer.font = "15px Arial";
    ctxPlayer.fillStyle = "white";
    ctxPlayer.fillText("HP: "+player.health, player.x, player.y);

    requestAnimationFrame(animate); 
    collision(playerProjectiles);
    
    
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

            //Vida inimigo
            var ctx = canvas.getContext("2d");
            ctx.font = "15px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("HP: "+inimigo.health, inimigo.x, inimigo.y);

            //projectiles inimigo

            if (player.y >= inimigo.y-20 && player.y <= inimigo.y+20){
                if(inimigo.delay<0)
                    inimigo.delay = atraso;
                  
                if(inimigo.delay == atraso) {  
                    if(player.x >= inimigo.x)
                    inimigo.projectiles.push(new Projectile(inimigo.x, inimigo.y, 1, 0));
                    else
                      inimigo.projectiles.push(new Projectile(inimigo.x, inimigo.y, -1, 0));
                }
                      inimigo.delay--;
            }; 
            if (player.x >= inimigo.x-20 && player.x <= inimigo.x+20){
                if(inimigo.delay<0)
                    inimigo.delay = atraso;

                if(inimigo.delay == atraso) {
                  if( player.y >= inimigo.y)
                    inimigo.projectiles.push(new Projectile(inimigo.x, inimigo.y, 0, 1));
                    else
                     inimigo.projectiles.push(new Projectile(inimigo.x, inimigo.y, 0, -1));
                }
                     inimigo.delay--;
                     console.log('delay '+ inimigo.delay);
            };
            

            //refresh projectiles inimigo
            inimigo.projectiles.forEach(projectile => {
                projectile.update();
                if(projectile.position.x >= canvas.width || projectile.position.x <=0 || projectile.position.y >= canvas.height || projectile.position.y <= 0){
                    index = playerProjectiles.indexOf(projectile);
                    
                }
            });
        }

    );
    
    //player projectiles
    playerProjectiles.forEach(projectile => {
        projectile.update();
        if(projectile.position.x >= canvas.width || projectile.position.x <=0 || projectile.position.y >= canvas.height || projectile.position.y <= 0){
            index = playerProjectiles.indexOf(projectile);
            
        }
    });
    if(index != -1)
        playerProjectiles.splice(index, 1);
}

function getDistance(x1, y1, x2, y2){
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
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

        this.position.x += this.velocity.x * 5
        this.position.y += this.velocity.y * 5

    }
}

function firedBall(){
    if (keys[32]){
        if(dir == 38)
            playerProjectiles.push(new Projectile(player.x, player.y, 0, -1))
        if(dir == 40)
            playerProjectiles.push(new Projectile(player.x, player.y, 0, 1))
        if(dir == 37)
            playerProjectiles.push(new Projectile(player.x, player.y, -1, 0))
        if(dir == 39)
            playerProjectiles.push(new Projectile(player.x, player.y, 1, 0))
    }

}

window.addEventListener("keyup", function(e){
    delete keys[e.keyCode];
});

function movePlayer(){
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
var portalImage = new Image();
portalImage.src = "Portal2.png";

function collision(playerProjectiles){
    arrayInimigos.some((enemy)=>{
        if(getDistance(player.x, player.y, enemy.x+20, enemy.y+20) < enemy.width/2 + player.width/2){
            if(delay<0)
                delay = 10;

            if(delay == 10) {
                drawSprite(danoPow, 0, 0, player.width, player.height, player.x, player.y, player.width, player.height);
                player.health-=1;
            }
            delay--;
        }
        
        if(player.health <= 0){
            alert("Morreste!!! --> prima F5");
        };

        enemy.projectiles.some((projectile)=>{
            if (getDistance(projectile.position.x, projectile.position.y, player.x+20, player.y+20) < player.width/2 + projectile.radius) {
                player.health-=1;
                enemy.projectiles.splice(enemy.projectiles.indexOf(projectile), 1); 
            }
        })

        //projetile player
        playerProjectiles.some((projectile)=>{
            if(getDistance(projectile.position.x, projectile.position.y, enemy.x+20, enemy.y+20) < enemy.width/2 + projectile.radius){
                //Remove o Inimigo
                enemy.health-=1;
                if (enemy.health == 0){
                    arrayInimigos.splice(arrayInimigos.indexOf(enemy),1);
                    enemy.image.src = "";
                    score += 100;
                }
                //Remove o Projétil 
                playerProjectiles.splice(playerProjectiles.indexOf(projectile), 1);              
                document.getElementById("Score").innerHTML = "SCORE: " + score;
        
            }
        });
        //Verifica niveis e todos os inimigos mortos
    });

    if(arrayInimigos.length == 0 && portallvl.nivel == 3) {
        //Fim do ultimo nivel
        if (window.confirm("YOU WIN!!!! <> Ganhou o Jogo!!!!")) {
            document.getElementById("Resultado").innerHTML = "Fim do Jogo!";
          } else {
            document.getElementById("Resultado").innerHTML = "Cancelou o jogo.....";
          }
    }else if(arrayInimigos.length == 0){
        //Fim nivel e aparece porta
       
        if(getDistance(player.x, player.y, portallvl.x, portallvl.y) < portallvl.width/2 + player.width/2){
            console.log('PORTAL DESENHOU');
            //adicionar o nivel
            portallvl.nivel++;
            
            //reset nivel (, trocar imagem fundo e boss?, mostrar nivel)
            switch(difficultyMode){
                //medium
                case '2':
                    healthEnemy=10;
                    if(portallvl.nivel==3)
                        numberOfEnemies=1;
                    else
                        numberOfEnemies=8*portallvl.nivel;
                break;
                //hard
                case '3':
                    healthEnemy=20;
                    numberOfEnemies=15*portallvl.nivel;
                break;
                //easy
                default:
                    healthEnemy=2;
                    numberOfEnemies=1*portallvl.nivel;
                break;
            }
            
            for(var i=0;i<numberOfEnemies;i++){
                arrayInimigos.push(new PlayerInimigo(
                    Math.random()*(canvas.width-50), 
                    Math.random()*(canvas.height-50), 33, 48, 0, 0, 10, healthEnemy, "inimigo3.png", []));
                }

            if(portallvl.nivel==3){
                arrayInimigos.push(new PlayerInimigo(
                    Math.random()*(canvas.width-50), 
                    Math.random()*(canvas.height-50), 33, 48, 0, 0, 20, healthEnemy, "boss.png", []));
                }
        }

        ctx.drawImage(portalImage, 0, 0, portallvl.width, portallvl.height,
            portallvl.x, portallvl.y, portallvl.width, portallvl.height);

    };
}

//Executa
animate();