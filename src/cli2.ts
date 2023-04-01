import Checkout from "./application/usecase/Checkout";
import CLIController from "./CLIController";
import CLIHandlerNode from "./CLIHandlerNode";

const checkout = new Checkout();
const handler = new CLIHandlerNode();
new CLIController(handler, checkout);