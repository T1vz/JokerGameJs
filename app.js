const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const socket = require("socket.io");
const path = require('path')

const app = express();

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get("port") || 5000;
const MONGOURI = config.get('mongoURI')

const standartDeck = [
  {
    class: "A",
    mast: "piky",
    priority: 1,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Aceofspades.svg/1200px-Aceofspades.svg.png",
  },
  {
    class: "A",
    mast: "kresty",
    priority: 1,
    img: "https://v-kosmose.com/wp-content/uploads/2021/01/35.png",
  },
  {
    class: "A",
    mast: "buby",
    priority: 1,
    img: "https://w7.pngwing.com/pngs/291/789/png-transparent-playing-card-card-game-poker-ace-of-spades-suit-cards-game-angle-rectangle.png",
  },
  {
    class: "A",
    mast: "chervy",
    priority: 1,
    img: "https://w7.pngwing.com/pngs/306/411/png-transparent-ace-of-heart-playing-card-playing-card-card-game-suit-ace-of-spades-cards-love-game-heart.png",
  },
  {
    class: "K",
    mast: "piky",
    priority: 2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%BF%D0%B8%D0%BA%D0%B8.jpg/167px-%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%BF%D0%B8%D0%BA%D0%B8.jpg",
  },
  {
    class: "K",
    mast: "kresty",
    priority: 2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D1%82%D1%80%D0%B5%D1%84%D1%8B.jpg/167px-%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D1%82%D1%80%D0%B5%D1%84%D1%8B.jpg",
  },
  {
    class: "K",
    mast: "buby",
    priority: 2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%B1%D1%83%D0%B1%D0%BD%D0%B8.jpg/167px-%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%B1%D1%83%D0%B1%D0%BD%D0%B8.jpg",
  },
  {
    class: "K",
    mast: "chervy",
    priority: 2,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Poker-sm-222-Kh.png/143px-Poker-sm-222-Kh.png",
  },
  {
    class: "D",
    mast: "piky",
    priority: 3,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Atlas_deck_queen_of_spades.svg/160px-Atlas_deck_queen_of_spades.svg.png",
  },
  {
    class: "D",
    mast: "kresty",
    priority: 3,
    img: "https://upload.wikimedia.org/wikipedia/commons/4/4b/%D0%90%D1%82%D0%BB%D0%B0%D1%81%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0_%D1%8D%D0%BA%D1%81%D1%82%D1%80%D0%B0_%D0%B4%D0%B0%D0%BC%D0%B0_%D0%BA%D1%80%D0%B5%D1%81%D1%82%D0%B8.jpg",
  },
  {
    class: "D",
    mast: "buby",
    priority: 3,
    img: "https://v-kosmose.com/wp-content/uploads/2021/01/28.png",
  },
  {
    class: "D",
    mast: "chervy",
    priority: 3,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Queen_of_hearts_en.svg/1200px-Queen_of_hearts_en.svg.png",
  },
  {
    class: "B",
    mast: "piky",
    priority: 4,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Atlas_deck_jack_of_spades.svg/360px-Atlas_deck_jack_of_spades.svg.png",
  },
  {
    class: "B",
    mast: "kresty",
    priority: 4,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Atlas_deck_jack_of_clubs.svg/1200px-Atlas_deck_jack_of_clubs.svg.png",
  },
  {
    class: "B",
    mast: "buby",
    priority: 4,
    img: "https://v-kosmose.com/wp-content/uploads/2021/01/22.png",
  },
  {
    class: "B",
    mast: "chervy",
    priority: 4,
    img: "https://astrometa.ru/images/winds/karty2/valet-chervei.png",
  },
  {
    class: "10",
    mast: "piky",
    priority: 5,
    img: "https://cdn.pixabay.com/photo/2015/08/11/11/55/spades-884147_960_720.png",
  },
  {
    class: "10",
    mast: "kresty",
    priority: 5,
    img: "https://astrometa.ru/images/winds/karty2/10-tref.png",
  },
  {
    class: "10",
    mast: "buby",
    priority: 5,
    img: "https://astrometa.ru/images/winds/karty2/10-buben.png",
  },
  {
    class: "10",
    mast: "chervy",
    priority: 5,
    img: "https://astrometa.ru/images/winds/karty2/10-chervei.png",
  },
  {
    class: "9",
    mast: "piky",
    priority: 6,
    img: "https://mogura.ru/components/templates/cards_tmp/img/132.png",
  },
  {
    class: "9",
    mast: "kresty",
    priority: 6,
    img: "https://v-kosmose.com/wp-content/uploads/2021/01/15.png",
  },
  {
    class: "9",
    mast: "buby",
    priority: 6,
    img: "https://astrometa.ru/images/winds/karty2/9-buben.png",
  },
  {
    class: "9",
    mast: "chervy",
    priority: 6,
    img: "https://astrometa.ru/images/winds/karty2/9-chervei.png",
  },
  {
    class: "8",
    mast: "piky",
    priority: 7,
    img: "https://astrometa.ru/images/winds/karty2/8-pik.png",
  },
  {
    class: "8",
    mast: "kresty",
    priority: 7,
    img: "https://astrometa.ru/images/winds/karty2/8-tref.png",
  },
  {
    class: "8",
    mast: "buby",
    priority: 7,
    img: "https://astrometa.ru/images/winds/karty2/8-buben.png",
  },
  {
    class: "8",
    mast: "chervy",
    priority: 7,
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Atlas_deck_8_of_hearts.svg",
  },
  {
    class: "7",
    mast: "piky",
    priority: 8,
    img: "https://astrometa.ru/images/winds/karty2/7-pik.png",
  },
  {
    class: "7",
    mast: "kresty",
    priority: 8,
    img: "https://astrometa.ru/images/winds/karty2/7-tref.png",
  },
  {
    class: "7",
    mast: "buby",
    priority: 8,
    img: "https://astrometa.ru/images/winds/karty2/7-buben.png",
  },
  {
    class: "7",
    mast: "chervy",
    priority: 8,
    img: "https://astrometa.ru/images/winds/karty2/7-chervei.png",
  },
  {
    class: "6",
    mast: "chervy",
    priority: 9,
    img: "https://astrometa.ru/images/winds/karty2/6-chervei.png",
  },
  {
    class: "6",
    mast: "buby",
    priority: 9,
    img: "https://astrometa.ru/images/winds/karty2/6-buben.png",
  },
  {
    class: "J",
    mast: "black",
    priority: 0,
    option: {taker:'my', mast:'piky'},
    img: "https://i.pinimg.com/474x/ed/32/4d/ed324dc5c4af46de43ebbf2021a487b9.jpg",
  },
  {
    class: "J",
    mast: "red",
    priority: 0,
    option: {taker:'my', mast:'piky'},
    img: "https://i.pinimg.com/474x/ed/32/4d/ed324dc5c4af46de43ebbf2021a487b9.jpg",
  },
]

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const getPlayerTurn = (turn) => {
    // const pulkaNum = Math.floor((turn - 1) / 4)
    // return  (pulkaNum + (turn -1) % 4 ) % 4
    return (turn-1) % 4
}

const getPull = (turn) => {
  let count = 0;
  if (turn < 10) {
    count = turn;
  } else {
    if (turn == 10 || turn == 11 || turn == 12) {
      count = 9;
    } else {
      count = 21 - turn;
    }
  }
  return count;
};
const checkHandMaxMast = (mast, hand) => {
  let newHand = hand.filter((card) => card.mast === mast);
  let maxCard = { priority: 10 };
  newHand.map((elem) => {
    if (elem.priority < maxCard.priority) {
      maxCard = { ...elem };
    }
  });
  return maxCard;
};

const scoreCalculate = (game) => {
  game.players.map((elem) => {
    let resultScore = 0;
    if (elem.bet !== 0 && elem.picked === 0) {
      elem.score -= 200;
    } else {
      if (elem.bet === elem.picked) {
        elem.inARow += 1;
        if (elem.picked === 0) {
          resultScore = 50;
        } else {
          if (elem.picked === getPull(game.turn)) {
            resultScore = elem.picked * 100;
          } else {
            resultScore = (elem.picked + 1) * 50;
          }
        }
      } else {
        resultScore = elem.picked * 10;
      }
    }
    elem.score += resultScore;
    if (resultScore > elem.maxPullScore) {
      elem.maxPullScore = resultScore;
    }
  });
  if (
    game.turn === 4 ||
    game.turn === 8 ||
    game.turn === 12 ||
    game.turn === 16 ||
    game.turn === 20
  ) {
    if (game.players.filter((elem) => elem.inARow === 4).length === 1) {
      game.players.map((elem) => {
        if (elem.inARow !== 4) {
          elem.score -= elem.maxPullScore;
        } else {
          elem.score += elem.maxPullScore;
        }
        elem.inARow = 0;
        elem.maxPullScore = -201;
      });
    } else {
      if (game.players.filter((elem) => elem.inARow === 4).length > 1) {
        game.players.map((elem) => {
          if (elem.inARow !== 4) {
            elem.score -= elem.maxPullScore;
          } else {
            elem.score += elem.maxPullScore;
          }
          elem.inARow = 0;
          elem.maxPullScore = -201;
        });
      } else {
        game.players.map((elem) => {
          elem.inARow = 0;
          elem.maxPullScore = -201;
        });
      }
    }
  }
};

const newTurn = (game) => {
  scoreCalculate(game);
  game.turn += 1;
  game.deck = shuffleDeck(standartDeck);
  cardCount = getPull(game.turn);
  for (i = 0; i < game.players.length; i++) {
    game.players[i].hand = game.deck.slice(
      i * cardCount,
      i * cardCount + cardCount
    );
    game.players[i].bet = -1;
    game.players[i].picked = 0;
  }
  game.playerTurn = getPlayerTurn(game.turn)
  game.playerBetTurn = game.playerTurn;
  game.betPhase = true;
  game.board = [];
  if (game.turn == 21) {
    console.log("game finished");
    game = {
      players: [],
      playerTurn: -1,
      turn: 0,
      messages: [],
      started: false,
      deck: [],
      playerBetTurn: -1,
      board: [],
      betPhase: false,
    };
  }
};

const sendMessageToUser = (socket, message) => {
  socket.emit("message", { message, from: "system" });
};

async function start() {
  try {
    mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const server = app.listen(PORT, () => {
      console.log(`App has been started on port - ${PORT}`);
    });

    const io = socket(server);

    let game = {
      players: [],
      playerTurn: -1,
      turn: 0,
      messages: [],
      started: false,
      deck: [],
      playerBetTurn: -1,
      board: [],
      betPhase: false,
    };

    io.on("connection", (socket) => {

      socket.emit("personal-id", socket.id.toString());

      socket.on('auth', ({userId, name})=>{
        socket.id = userId
        console.log("User connected", userId);
      })

      socket.on("join-game", (name) => {
        console.log("User connected to the game", socket.id);
        if (game.players.length < 4) {
          game.players.push({
            name,
            socket,
            hand: [],
            score: 200,
            bet: -1,
            picked: 0,
            maxPullScore: -201,
            inARow: 0,
          });
          socket.emit('alert', {message: "вы успешно подключились", isJoined:true})
          let playersInfo = [
            ...game.players.map((elem) => {
              elemCopy = { ...elem };
              const id = elem.socket.id.toString();
              delete elemCopy.socket;
              delete elemCopy.hand;
              delete elemCopy.bet;
              delete elemCopy.score;
              elemCopy.id = id;
              return elemCopy;
            }),
          ];
          game.players.map((player)=>{
            // player.socket.emit("game-players-start-status", { players: playersInfo })
            player.socket.emit("game", {
              players: playersInfo,
              hand: player.hand,
              betPhase: game.betPhase,
              playerBetTurn: game.playerBetTurn,
              board: game.board,
              turn: game.turn,
              playerTurn: game.playerTurn,
              messages: game.messages,
              started: game.started
            });
          })
          socket.on("game-start", () => {
            if (game.players.length == 4) {
              game.started = true;
              newTurn(game);
              game.players.map((player) => {
                player.socket.emit("game-alert", "started");
                let playersInfo = [
                  ...game.players.map((elem) => {
                    elemCopy = { ...elem };
                    const id = elem.socket.id.toString();
                    delete elemCopy.socket;
                    elemCopy.hand = elem.hand.length;
                    elemCopy.id = id;
                    return elemCopy;
                  }),
                ];
                player.socket.emit("game", {
                  players: playersInfo,
                  hand: player.hand,
                  betPhase: game.betPhase,
                  playerBetTurn: game.playerBetTurn,
                  board: game.board,
                  turn: game.turn,
                  playerTurn: game.playerTurn,
                  messages: game.messages,
                  started: game.started
                });
              });
              console.log("Game started");
              sendMessageToUser(
                game.players[game.playerTurn].socket,
                "Your Turn"
              );
            } else {
              console.log("Недостаточно игроков");
            }
          });
          socket.on("game-bet", (count) => {
            if (game.betPhase){
                if (socket.id === game.players[game.playerBetTurn].socket.id) {
                    game.players[game.playerBetTurn].bet = count;
                    if (
                      game.players.filter((player) => player.bet === -1).length === 0
                    ) {
                      game.playerBetTurn = -1;
                      game.betPhase = false;
                    } else {
                      if (game.playerBetTurn + 1 === game.players.length) {
                        game.playerBetTurn = 0;
                      } else {
                        game.playerBetTurn += 1;
                      }
                    }
                    game.players.map((player) => {
                      let playersInfo = [
                        ...game.players.map((elem) => {
                          elemCopy = { ...elem };
                          const id = elem.socket.id.toString();
                          delete elemCopy.socket;
                          elemCopy.hand = elem.hand.length;
                          elemCopy.id = id;
                          return elemCopy;
                        }),
                      ];
                      player.socket.emit("game", {
                        players: playersInfo,
                        hand: player.hand,
                        betPhase: game.betPhase,
                        playerBetTurn: game.playerBetTurn,
                        board: game.board,
                        turn: game.turn,
                        playerTurn: game.playerTurn,
                        messages: game.messages,
                        started: game.started
                      });
                    });
                  }
            }
          });
          socket.on("game-turn", (card) => {
            if (
              socket.id === game.players[game.playerTurn].socket.id &&
              !game.betPhase &&
              (!game.board[0] ||
                card.class === "J" ||
                game.board[0].mast === card.mast ||
                game.players[game.playerTurn].hand.filter(
                  (e) => e.mast === game.board[0].mast
                ).length === 0)
            ) {
              if (
                game.board[0]?.class === "J" &&
                ((game.board[0].option.mast === card.mast &&
                  checkHandMaxMast(
                    card.mast,
                    game.players[game.playerTurn].hand
                  ).class === card.class) ||
                  card.class === "J" ||
                  game.players[game.playerTurn].hand.filter(
                    (e) => e.mast === game.board[0].option.mast
                  ).length === 0)
              ) {
                game.players[game.playerTurn].hand = game.players[
                    game.playerTurn
                  ].hand.filter(
                    (elem) =>
                      elem.mast !== card.mast || elem.class !== card.class
                  );
                  game.board.push({ ...card, owner: socket.id });
                  if (game.board.length === 4) {
                    let taker = "";
                    let highest = 10;
                    if (game.board[0].class === "J") {
                      if (game.board[0].option.taker === "my") {
                        game.board.map((elem) => {
                            if (
                                elem.class === "J" && elem.option.taker === "my"
                            ) {
                              taker = elem.owner;
                              highest = elem.priority;
                            }
                          });
                      } else {
                          game.board[0].priority = 10
                        game.board.map((elem) => {
                            if (
                              elem.priority <= highest &&
                              (elem.mast === game.board[0].mast ||
                                (elem.class === "J" && elem.option.taker === "my"))
                            ) {
                              taker = elem.owner;
                              highest = elem.priority;
                            }
                          });
                      }
                    } else {
                      game.board.map((elem) => {
                        if (
                          elem.priority <= highest &&
                          (elem.mast === game.board[0].mast ||
                            (elem.class === "J" && elem.option.taker === "my"))
                        ) {
                          taker = elem.owner;
                          highest = elem.priority;
                        }
                      });
                    }
                    game.players.map((elem, index) => {
                      if (elem.socket.id === taker) {
                        elem.picked += 1;
                        game.playerTurn = index;
                      }
                    });
                    game.board = [];
                  }
                  if (
                    game.players.filter((player) => player.hand.length !== 0)
                      .length === 0
                  ) {
                    newTurn(game);
                  } else {
                    if (game.board.length !== 0) {
                      if (game.playerTurn + 1 === game.players.length) {
                        game.playerTurn = 0;
                      } else {
                        game.playerTurn += 1;
                      }
                    }
                  }
                  game.players.map((player) => {
                    let playersInfo = [
                      ...game.players.map((elem) => {
                        elemCopy = { ...elem };
                        const id = elem.socket.id.toString();
                        delete elemCopy.socket;
                        elemCopy.hand = elem.hand.length;
                        elemCopy.id = id;
                        return elemCopy;
                      }),
                    ];
                    player.socket.emit("game", {
                      players: playersInfo,
                      hand: player.hand,
                      betPhase: game.betPhase,
                      playerBetTurn: game.playerBetTurn,
                      board: game.board,
                      turn: game.turn,
                      playerTurn: game.playerTurn,
                      messages: game.messages,
                      started: game.started
                    });
                  });
              } else {
                if (game.board[0]?.class !== "J") {
                  game.players[game.playerTurn].hand = game.players[
                    game.playerTurn
                  ].hand.filter(
                    (elem) =>
                      elem.mast !== card.mast || elem.class !== card.class
                  );
                  game.board.push({ ...card, owner: socket.id });
                  if (game.board.length === 4) {
                    let taker = "";
                    let highest = 10;
                    if (game.board[0].class === "J") {
                      if (game.board[0].option.taker === "my") {
                        game.board.map((elem) => {
                            if (
                                elem.class === "J" && elem.option.taker === "my"
                            ) {
                              taker = elem.owner;
                              highest = elem.priority;
                            }
                          });
                      } else {
                          game.board[0].priority = 10
                        game.board.map((elem) => {
                            if (
                              elem.priority <= highest &&
                              (elem.mast === game.board[0].mast ||
                                (elem.class === "J" && elem.option.taker === "my"))
                            ) {
                              taker = elem.owner;
                              highest = elem.priority;
                            }
                          });
                      }
                    } else {
                      game.board.map((elem) => {
                        if (
                          elem.priority <= highest &&
                          (elem.mast === game.board[0].mast ||
                            (elem.class === "J" && elem.option.taker === "my"))
                        ) {
                          taker = elem.owner;
                          highest = elem.priority;
                        }
                      });
                    }
                    game.players.map((elem, index) => {
                      if (elem.socket.id === taker) {
                        elem.picked += 1;
                        game.playerTurn = index;
                      }
                    });
                    game.board = [];
                  }
                  if (
                    game.players.filter((player) => player.hand.length !== 0)
                      .length === 0
                  ) {
                    newTurn(game);
                  } else {
                    if (game.board.length !== 0) {
                      if (game.playerTurn + 1 === game.players.length) {
                        game.playerTurn = 0;
                      } else {
                        game.playerTurn += 1;
                      }
                    }
                  }
                  game.players.map((player) => {
                    let playersInfo = [
                      ...game.players.map((elem) => {
                        elemCopy = { ...elem };
                        const id = elem.socket.id.toString();
                        delete elemCopy.socket;
                        elemCopy.hand = elem.hand.length;
                        elemCopy.id = id;
                        return elemCopy;
                      }),
                    ];
                    player.socket.emit("game", {
                      players: playersInfo,
                      hand: player.hand,
                      betPhase: game.betPhase,
                      playerBetTurn: game.playerBetTurn,
                      board: game.board,
                      turn: game.turn,
                      playerTurn: game.playerTurn,
                      messages: game.messages,
                      started: game.started
                    });
                  });
                }
              }
            }
          });
        } else {
          console.log("Перебор людей в лобби");
          socket.emit('alert', {message: "Вам не удалось подключиться", isJoined:false})
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
  } catch (e) {
    console.log("Server Error", e.message);
  }
}

start();
