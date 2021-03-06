// Generated by CoffeeScript 1.6.1
(function() {
  var Card, Dwarf, Elf, Game, GameRules, Hobbit, Human, Player, Warrior, shuffle,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Card = (function() {

    function Card(type, isWarrior) {
      this.type = type;
      this.isWarrior = isWarrior != null ? isWarrior : true;
    }

    return Card;

  })();

  Warrior = (function(_super) {

    __extends(Warrior, _super);

    function Warrior(type, attack, defense, energy) {
      this.attack = attack;
      this.defense = defense;
      this.energy = energy;
      Warrior.__super__.constructor.call(this, type);
    }

    return Warrior;

  })(Card);

  Dwarf = (function(_super) {

    __extends(Dwarf, _super);

    function Dwarf(energy) {
      var attack, defense;
      attack = Math.random() < 0.5 ? 2 : 3;
      defense = Math.random() < 0.5 ? 5 : 6;
      Dwarf.__super__.constructor.call(this, "Dwarf", attack, defense, energy);
    }

    return Dwarf;

  })(Warrior);

  Elf = (function(_super) {

    __extends(Elf, _super);

    function Elf(energy) {
      var attack, defense;
      attack = Math.random() < 0.5 ? 5 : 6;
      defense = Math.random() < 0.5 ? 2 : 3;
      Elf.__super__.constructor.call(this, "Elf", attack, defense, energy);
    }

    return Elf;

  })(Warrior);

  Hobbit = (function(_super) {

    __extends(Hobbit, _super);

    function Hobbit(energy) {
      var attack, defense;
      attack = Math.random() < 0.5 ? 2 : 3;
      defense = Math.random() < 0.5 ? 4 : 5;
      Hobbit.__super__.constructor.call(this, "Hobbit", attack, defense, energy);
    }

    return Hobbit;

  })(Warrior);

  Human = (function(_super) {

    __extends(Human, _super);

    function Human(energy) {
      var attack, defense;
      if (Math.random() < 0.5) {
        attack = 3;
        defense = 4;
      } else {
        attack = 4;
        defense = 3;
      }
      Human.__super__.constructor.call(this, "Human", attack, defense, energy);
    }

    return Human;

  })(Warrior);

  GameRules = (function() {

    function GameRules() {}

    GameRules.fieldSize = 5;

    GameRules.handSize = 7;

    GameRules.actionsPerTurn = 3;

    return GameRules;

  })();

  Player = (function() {
    var generateDeck;

    function Player(name, socket, data) {
      var i, _i, _ref;
      this.name = name;
      this.socket = socket;
      this.field = new Array();
      for (i = _i = 1, _ref = GameRules.fieldSize; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.field.push(null);
      }
      this.actionsLeft = GameRules.actionsPerTurn;
      this.opponent = null;
      this.hand = data.hand, this.turn = data.turn, this.deck = data.deck;
    }

    Player.prototype.sendAction = function(action) {
      throw new Error('sendAction should be overridden');
    };

    Player.prototype.updateGUI = function(action) {};

    generateDeck = function() {
      var deck, energy, _i;
      deck = [];
      for (energy = _i = 3; _i <= 8; energy = ++_i) {
        deck.push(new Elf(energy));
        deck.push(new Hobbit(energy));
        deck.push(new Dwarf(energy));
        deck.push(new Human(energy));
      }
      return shuffle(deck);
    };

    Player.prototype.performAction = function(action, result) {
      var from, removed, to;
      switch (action.type) {
        case 'draw':
          this.deck.pop();
          this.hand.push(result.card);
          break;
        case 'move':
          from = action.from;
          to = action.to;
          this.field[to] = this.field[from];
          this.field[from] = null;
          break;
        case 'attack':
          from = action.from;
          to = action.to;
          this.field[from].energy -= result.attackerHits;
          this.opponent.field[to].energy -= result.defenderHits;
          break;
        case 'play':
          from = action.from;
          to = action.to;
          removed = this.hand.splice(from, 1);
          this.field[to] = removed[0];
          break;
        default:
          throw new Error("unknown action");
      }
      return this.updateGUI(action);
    };

    Player.prototype.checkAction = function(action) {
      var from, to;
      switch (action.type) {
        case 'draw':
          return this.deck.length > 0 && this.hand.length < GameRules.handSize;
        case 'move':
          from = action.from;
          to = action.to;
          return this.field[to] === null && this.field[from] !== null;
        case 'attack':
          from = action.from;
          to = action.to;
          return this.field[from] !== null && this.opponent.field[to] !== null && (from === to || (this.field[from].type === "Elf" && Math.abs(from - to) <= 1));
        case 'play':
          from = action.from;
          to = action.to;
          return this.hand[from] !== null && this.field[to] === null;
        default:
          throw new Error("unknown action");
      }
    };

    return Player;

  })();

  /*         
  class PlayerClient extends Player
    constructor: (@name, @socket) ->
    fillServerData: (
  */


  Game = (typeof exports !== "undefined" && exports !== null) && exports || (this.Game = {});

  Game.Rules = GameRules;

  Game.Player = Player;

  shuffle = function(a) {
    var i, j, _i, _ref, _ref1;
    for (i = _i = _ref = a.length - 1; _ref <= 1 ? _i <= 1 : _i >= 1; i = _ref <= 1 ? ++_i : --_i) {
      j = Math.floor(Math.random() * (i + 1));
      _ref1 = [a[j], a[i]], a[i] = _ref1[0], a[j] = _ref1[1];
    }
    return a;
  };

}).call(this);
