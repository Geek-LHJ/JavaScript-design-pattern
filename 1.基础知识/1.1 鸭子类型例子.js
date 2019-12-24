var duck = {
  duckSinging: function() {
    console.log("嘎嘎嘎");
  }
};

var chicken = {
  duckSinging: function() {
    console.log("嘎嘎嘎");
  }
};

var choir = [];
var joinChoir = function(animal) {
  if (animal && typeof animal.duckSinging === "function") {
    choir.push(animal);
    console.log("恭喜加入, 已有成员数量:" + choir.length);
  }
};

joinChoir(duck);
joinChoir(chicken);
