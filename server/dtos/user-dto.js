module.exports = class UserDto {
  email;
  id;
  isActivated;
  isBlocked;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.isBlocked = model.isBlocked;
  }
};
