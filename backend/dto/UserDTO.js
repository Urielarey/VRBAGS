/**
 * Data Transfer Object para Usuarios
 * NO expone información sensible como contraseña
 */
class UserDTO {
  constructor(user) {
    this.id = user._id || user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  /**
   * Convierte un array de usuarios a DTOs
   */
  static fromArray(users) {
    return users.map(user => new UserDTO(user));
  }
}

module.exports = UserDTO;
