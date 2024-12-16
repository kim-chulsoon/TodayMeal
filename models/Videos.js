// Videos.js
module.exports = (sequelize, DataTypes) => {
  const Videos = sequelize.define(
    "Videos",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      youtube_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      thumbnail_url: {
        type: DataTypes.STRING(500),
      },
    },
    {
      tableName: "Videos",
      timestamps: true,
    },
  );
  return Videos;
};
