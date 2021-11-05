const Database = require("../db/config");

module.exports = {
  async create(req, res){
    const db = await Database();
    const pass = req.body.password
    
    let roomId = "";
    let isRoom = true;

    while(isRoom){
      /* Gera o número da sala */
      for(var i = 0; i < 6; i++){
        roomId += Math.floor(Math.random() * 10).toString();
      };
      /* Verifica se o número da sala já existe */
      const roomSameIds = await db.all(`SELECT id FROM rooms`);
      isRoom = roomSameIds.some(roomSameId => roomSameId === roomId);

      if(! isRoom){
        /* Insere a sala criada no banco de dados */
        await db.run(`INSERT INTO rooms (
          id,
          pass
        ) VALUES (
          ${parseInt(roomId)},
          ${pass}
        )`);
      };
    };

    await db.close();

    res.redirect(`/room/${roomId}`);
  },

  open(req, res){
    const roomId = req.params.room;
    res.render("room", {roomId: roomId});
  }
};