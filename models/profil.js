module.exports = (db, DataTypes) => {
    return  db.define('profil', {
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      discription : { type : DataTypes.STRING},
      image : { type : DataTypes.STRING},
      etat : { type : DataTypes.STRING},
    });
}