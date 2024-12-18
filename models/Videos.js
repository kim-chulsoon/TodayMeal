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
      youtubeUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "youtube_url",
      },
      thumbnailUrl: {
        type: DataTypes.STRING(500),
        field: "thumbnail_url",
      },
    },
    {
      tableName: "Videos",
      timestamps: true,
    },
  );
  return Videos;
};
