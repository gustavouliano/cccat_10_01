export default abstract class CLIHandler {
    commands: any = {};

    on(command: string, callback: Function) {
        this.commands[command] = callback;
    }

    async type(text: string) {
        let [command] = text.split(' ');
        command = command.trim();
        if (!this.commands[command]) return;
        const params = text.replace(command, '').trim();
        await this.commands[command](params);
    }

    abstract write(text: string): void;

}