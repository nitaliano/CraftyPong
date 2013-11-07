var Game = {
  
 map_grid: {
    width:  24,
    height: 16,
    tile: {
      width:  16,
      height: 16
    }
  },
  
  width: function () {
    return this.map_grid.width * this.map_grid.tile.width;  
  },
  
  height: function () {
    return this.map_grid.height * this.map_grid.tile.height;   
  },
  
  start: function () {
    Crafty.init(Game.width(), Game.height());
    Crafty.background('black');
    
    var player = Crafty.e('PlayerPaddle').at(1, 1);
    var ai = Crafty.e('AIPaddle').at(22, 1)
    var ball = Crafty.e('Ball');
  }
};

