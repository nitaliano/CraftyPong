Crafty.c('Grid', {
  init: function () {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });  
  },
  
  at: function (x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height }; 
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }  
  }
});

Crafty.c('Circle', {
  Circle: function (radius, color) {
    this.radius = radius;
    this.w = this.h = radius * 2;
    this.color = color;
    return this;
  },
  
  draw: function () {
    var ctx = Crafty.canvas.context;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
});

Crafty.c('Edges', {
  init: function () {
    Object.defineProperties(this, {
      left: {
        get: function () {
          return this.x;  
        }  
      },
      right: {
        get: function () {
          return this.x + this._w;
        }
      },
      top: {
        get: function () {
          return this.y;
        }
      },
      bottom: {
        get: function () {
          return this.y + this._h;  
        }
      }
    });
    return this;
  }
})

Crafty.c('Actor', {
  init: function () {
    this.requires('2D, Canvas, Grid, Edges, Collision, Color');  
  }  
});

Crafty.c('Paddle', {
  
  config: {
    speed: 3  
  },
  
  init: function () {
    this.requires('Actor, Collision')
      .attr({ 
        w: Game.map_grid.tile.width, 
        h: 3 * Game.map_grid.tile.height,
        move: {
          up: false,
          down: false
        }
      })
      .bind('EnterFrame', function () {
        if (this.move.up) {
          this.y -= this.config.speed; 
        } else if (this.move.down) {
          this.y += this.config.speed;  
        }
        
        if (this.y < 0) {
          this.y = 0;  
        } else if (this.y > Crafty.viewport.height - this._h) {
          this.y = Crafty.viewport.height - this._h;  
        }
      })
      .collision()
      .color('green');
  },
  
  getCenter: function () {
    return {
      x: this.x + this._w / 2,
      y: this.y + this._h / 2
    };
  }
});

Crafty.c('PlayerPaddle', {
  init : function () {
    this.requires('Paddle, Keyboard')
    .bind('KeyDown', function (e) {
        if (e.keyCode === Crafty.keys.UP_ARROW) {
          this.move.up = true;  
        } else if (e.keyCode === Crafty.keys.DOWN_ARROW) {
          this.move.down = true;  
        }
      })
      .bind('KeyUp', function (e) {
        if (e.keyCode === Crafty.keys.UP_ARROW) {
          this.move.up = false;  
        } else if (e.keyCode === Crafty.keys.DOWN_ARROW) {
          this.move.down = false;  
        }  
      });
  }  
});

Crafty.c('AIPaddle', {
  
  config: {
    center: Crafty.viewport.height / 2 - this._h / 2  
  },
  
  init: function () {
    
    this.requires('Paddle')
    .bind('BallPos', function (e) {
      var ball = e.obj;
      
      if (ball.xspeed < 0) {
        var dy = this.y < this.config.center ? -1 : 1;
        while (this.y != this.config.center) {
          this.y += dy;
        }
        return;
      } 
      
      if (ball.getCenter().y < this.y) {
        this.y -= 1;
      } else if (ball.getCenter().y > this.y) {
        this.y += 1;
      }
    });
  }
});

Crafty.c('Ball', {
  init: function () {
    this.requires('Actor, Circle, Tween, Collision')
      .Circle(8, '#ffffff')
      .tween({
        x: this.x,
        y: this.y,
        radius: this.radius
      }, 30)
      .attr({
        x: Crafty.viewport.width / 2 - this._w / 2,
        y: Crafty.viewport.height / 2 - this._h / 2,
        xspeed: -2,
        yspeed: -2
      })
      .bind('EnterFrame', function () {
        if (this.x < 0) {
          this.xspeed = -this.xspeed;
        }
        if (this.x > Crafty.viewport.width - this._w) {
          this.xspeed = -this.xspeed;
        }
        if (this.y < 0) {
          this.yspeed = -this.yspeed;
        }
        if (this.y > Crafty.viewport.height - this._h) {
          this.yspeed = -this.yspeed;
        }
        this.x += this.xspeed;
        this.y += this.yspeed;
        Crafty.trigger('BallPos', { obj: this });
      })
      .collision()
      .onHit('Paddle', function (e) {
        if (e[0].normal.x !== 0) {
          this.xspeed = -this.xspeed;
        }
        if (e[0].normal.y !== 0) {
          this.yspeed = -this.yspeed;
        }
      });
  },
  
  getCenter: function () {
    return {
      x: this.x + this.radius,
      y: this.y + this.radius
    };
  }
});