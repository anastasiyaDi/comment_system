export class User {
  id: string;
  name: { title: string; first: string; last: string };
  avatar: { large: string; medium: string; thumbnail: string };
  gender: string;
  nat: string;

  constructor(data: any) {
    this.id = data.login.uuid;
    this.name = data.name;
    this.avatar = data.picture;
    this.gender = data.gender;
    this.nat = data.nat;
  }

  getFullName(): string {
    return `${this.name.title} ${this.name.first} ${this.name.last}`;
  }
}