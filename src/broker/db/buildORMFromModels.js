/*
    This takes a model and exposes functions that map to
    database specific methods
 */

module.exports = (Model) => {
  const save = async (data) => new Model(data).save();

  const findOneAndUpdate = async (condition, data) =>
    Model.findOneAndUpdate(condition, data, { new: true });

  const findOneAndRemove = async (condition) =>
    Model.findByIdAndRemove(condition);

  const findById = async (id) => Model.findById(id);

  const findByIdAndUpdate = async (id, data) =>
    Model.findByIdAndUpdate(id, data, { new: true });

  const find = async (condition) =>
    Model.find(condition).sort({ updatedAt: -1 });
  const populate = async (condition, data) =>
    Model.find(condition).populate(data).sort({ updatedAt: -1 });

  const count = async (condition) => Model.find(condition).countDocuments();

  const findOne = async (condition) => Model.findOne(condition);

  return {
    save,
    find,
    populate,
    findById,
    findByIdAndUpdate,
    findOne,
    findOneAndUpdate,
    findOneAndRemove,
    count,
  };
};
