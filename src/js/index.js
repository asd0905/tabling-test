import { sayHello } from "./modules/module";
import '../css/style.scss';

function myFunc() {
    sayHello("mike");
    console.log("myFunc");
}
myFunc();