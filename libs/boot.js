module.exports = (app) => {
  app.db.sequelize
    .sync()
    .then(() => {
      app.listen(app.get("port"), () => {
        console.log(`NTask API - porta ${app.get("port")}`);
      });
    })
    .catch((error) => {
      console.log(`Não foi possível inicializar a aplicação: ${error}`);
    });
};
