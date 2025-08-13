class User {
    constructor(id, name, email, password, createdAt, updatedAt) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    static fromData(data) {
      return new User(data.id, data.name, data.email, data.password, data.createdAt, data.updatedAt);
    }
  
    toData() {
      return { id: this.id, name: this.name, email: this.email, createdAt: this.createdAt, updatedAt: this.updatedAt };
    }
  }
  
