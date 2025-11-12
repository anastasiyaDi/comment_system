export class User {
    constructor(data) {
        this.id = data.login.uuid;
        this.name = data.name;
        this.avatar = data.picture;
        this.gender = data.gender;
        this.nat = data.nat;
    }
    getFullName() {
        return `${this.name.title} ${this.name.first} ${this.name.last}`;
    }
}
