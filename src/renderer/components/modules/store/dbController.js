const db = require("./db");

let prototype = (datastore) => {
  return {
    /**
     * @param  {Object} params Параметры согласно абстрактной модели
     * @return {Object}
     */
    async create(params) {
      const result = await datastore.insert(params);
      return result;
    },

    /**
     * @param  {Object} params Оставить пустым для поиска всех записей
     * @return {Object}
     */
    async find(params) {
      const result = await datastore.find(params);
      return result;
    },
  };
};

export default {
  User: prototype(db.user),
  Settings: prototype(db.settings),
  Proxy: prototype(db.proxy),
  Fingerprint: prototype(db.fingerprint),
  Session: prototype(db.session),
};
