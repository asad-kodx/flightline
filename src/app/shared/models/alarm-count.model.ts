export class AlarmCount{
    activeCount: number;
    acknowledgedCount: number;
    silentCount: number

    constructor(){
        this.acknowledgedCount = 0;
        this.activeCount = 0;
        this.silentCount = 0;
    }
}