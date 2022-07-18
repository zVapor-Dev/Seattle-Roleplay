module.exports = class BaseCommand {
  constructor(name, category, ownerOnly, slowdown, description, options) {
    this.name = name;
    this.category = category;
    this.ownerOnly = ownerOnly;
    this.slowdown = slowdown;
    this.description = description;
    this.options = options
  }
}