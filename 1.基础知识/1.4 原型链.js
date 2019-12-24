function Person() {}

console.log(Person.prototype);
// Object {constructor:function Person(),__proto__:Object}

Person.prototype.name = "testName";
Person.prototype.age = 29;
Person.prototype.job = "技术开发";

Person.prototype.sayName = function() {
  console.log(this.name);
};

var person1 = new Person();
person1.sayName(); //"testName"

var person2 = new Person();
person2.sayName(); //"testName"

console.log(person1.sayName == person2.sayName); //true

console.log(person1.__proto__); // {name,age,job,sayname}
