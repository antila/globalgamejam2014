"use strict";

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'phaser', {
    preload: preload,
    create: create,
    update: update,
    render: render,
});
var you;
var calibrating;
var text;
var phaser;
var phaserContext;
var firstRun = false;
var showGrid = true;
var isMask = true;

function preload() {
    game.load.image('you', 'assets/you.png');
    game.load.image('calibrating', 'assets/calibrating.png');
    game.load.image('collider', 'assets/monkey.png');
    // game.load.image('dot', 'assets/dot.png');
    game.stage.backgroundColor = 'rgba(0, 0, 0, 0)';

    game.load.atlasJSONHash('candy', 'assets/candy.png', 'assets/candy.json');

}

function update() {
    game.physics.collide(collider, emitter, collisionHandler, null, this);
    game.physics.collide(emitter, emitter, collisionHandler, null, this);
    // you.angle += 1;
    emitter.x = Math.round(Math.random() * 640);

    if (typeof positions !== 'undefined' && positions !== false) {
        you.x = 640-positions[62][0] - 290;
        you.y = positions[62][1] - 90;

        // collider.y = positions[62][1] - 150;

        var diff = positions[62][0] - positions[1][0];
        // collider.x = 320-positions[62][0] + diff;

        // collider.scale.x = Math.round(diff/40);
        // collider.scale.y = Math.round(diff/40);

        // dot1.x = 640-positions[0][0];
        // dot1.y = positions[0][1];
        // dot2.x = 640-positions[62][0];
        // dot2.y = positions[62][1];

        collider.x = 640-positions[62][0];
        collider.y = positions[62][1] + 50;
    }

    if (typeof ctrack !== 'undefined') {
        var pn = ctrack.getConvergence();
        if (pn < 0.4) {
            // switchMasks(positions);

            // drawMaskLoop();
        } else {
            // drawGridLoop();
        }
    }
}

function startGame() {
    showGrid = false;
    // realGame();
    // gameState4();
    // return;

    var t1 = game.add.tween(calibrating);
    t1.to( { alpha: 0 }, 300, Phaser.Easing.Linear.None);
    t1.onComplete.add(function() {
        game.add.tween(you).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true)
            .onComplete.add(function() {
                setTimeout(function() {
                    game.add.tween(you).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
                    .onComplete.add(function() {
                        gameState1();
                    });
                }, 3000);

            });
    }, this);
    t1.start();
}

function gameState1() {
    // switchMasks(positions);
    text.setText('\nBut who are you?');
    setTimeout(function() {
        gameState2();
    }, 3000);
}

function gameState2() {
    switchMasks(positions);
    text.setText('Someone who\nwill be remembered?');
    // gamestate = 1;
    //
    setTimeout(function() {
        gameState3();
    }, 7000);
}

function gameState3() {
    text.setText('\nSomeone famous?');
    $('#selectmask').val(1).change();
    updateMask($('#selectmask'));

    setTimeout(function() {
        gameState4();
    }, 7000);
}

function gameState4() {
    text.setText('\nSomeone with authority?');
    $('#selectmask').val(2).change();
    updateMask($('#selectmask'));

    setTimeout(function() {
        gameState5();
    }, 7000);
}

function gameState5() {
    text.setText('\nSomeone with no authority?');

    overlayCC.clearRect(0, 0, 640, 480);
    videocanvas.getContext('2d').clearRect(0, 0, 640, 480);
    newcanvas.getContext('2d').clearRect(0, 0, 640, 480);
    maskcanvas.getContext('2d').clearRect(0, 0, 640, 480);

    var isMask = true;
    $('#selectmask').val(3).change();
    updateMask($('#selectmask'));

    setTimeout(function() {
        // isMask = false;
        gameState6();
    }, 7000);
}

function gameState6() {
    text.setText('\nOr maybe...');


    setTimeout(function() {
        gameState6();
    }, 4000);
}

function gameState6() {
    text.setText('\nA T-REX!?');

    $('#selectmask').val(4).change();
    updateMask($('#selectmask'));

    setTimeout(function() {
        text.setText('\nEat the candy!');
    }, 2000);

    setTimeout(function() {
        text.setText('\n');
        realGame();
    }, 4000);
}

function realGame() {
    calibrating.alpha = 0;
    // collider.alpha = 1;

    emitter.start(false, 8000, 120);

    isMask = true;
    $('#selectmask').val(4).change();
    updateMask($('#selectmask'));

    setTimeout(function() {
        text.setText('\nNote: this goes on forever. ;)');
    }, 12000);

    setTimeout(function() {
        text.setText('\n');
    }, 18000);
}

function collisionHandler (obj1, obj2) {
    if (obj1.key === 'collider') {
        obj2.kill();
    }

}

var collider;
var dot1;
var dot2;
var emitter;

function create() {

    var style = { font: "45px Arial", fill: "#ffffff", stroke: "#000000", align: "left", strokeThickness: 3 };

    text = game.add.text(45, 350, '', style);

    you = game.add.sprite(200, 88, 'you');
    you.alpha = 0;

    collider = game.add.sprite(200, 88, 'collider');
    collider.anchor.x = 0.5;
    collider.anchor.y = 0.5;
    collider.alpha = 0;

    // dot1 = game.add.sprite(0, 0, 'dot');
    // dot2 = game.add.sprite(0, 0, 'dot');

    var frames = [];
    for (var i = 0; i <= 78; i++) {
        frames[i] = i;
    };

    emitter = game.add.emitter(game.world.centerX, 0, 250);
    emitter.makeParticles('candy', frames, 200, true, true);

    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 8;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.particleDrag.x = 10;
    emitter.angularDrag = 30;

    calibrating = game.add.sprite(game.world.centerX-200, 400, 'calibrating');
    calibrating.alpha = 0;

    vid = document.getElementById('videoel');
    overlay = document.getElementById('overlay');
    phaser = $('#phaser canvas').attr('id', 'pc').appendTo($('#container')).get(0);
    phaserContext = phaser.getContext('2d');

}

function render() {
    // game.debug.renderSpriteInfo(collider, 32, 32);
    // game.debug.renderSpriteCollision(collider, 32, 400);

    // game.debug.renderSpriteBody(collider);
}
