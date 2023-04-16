import CLIHandler from "./CLIHandler";

export default class CLIHandlerNode extends CLIHandler {
    
    constructor(){
        super();
        process.stdin.on('data', async (chunck: any) => {
            const command = chunck.toString().replace(/\n/g, '');
            await this.type(command);
        });
    }
    
    write(text: string): void {
        console.log(text);
    }

}