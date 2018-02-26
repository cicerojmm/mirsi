export class Monitoramento {
    private batimentoPorMinuto: number;
    private temperatura: number;
    private acelerometroX: string;
    private acelerometroY: string;
    private acelerometroZ: string;
    private giroscopioX: string;
    private giroscopioY: string;
    private giroscopioZ: string;
    private timestamp: string;

    constructor(batimentoPorMinuto: number, temperatura: number, acelerometroX: string, 
                    acelerometroY: string, acelerometroZ: string, giroscopioX: string,
                    giroscopioY: string, giroscopioZ: string, timestamp: string) {
                        
        this.batimentoPorMinuto = batimentoPorMinuto;
        this.temperatura = temperatura;
        this.acelerometroX = acelerometroX;
        this.acelerometroY = acelerometroY;
        this.acelerometroZ = acelerometroZ;
        this.giroscopioX = giroscopioX;
        this.giroscopioY = giroscopioY;
        this.giroscopioZ = giroscopioZ;
        this.timestamp = timestamp;
    }


    getBatimentoPorMinuto() {
        return this.batimentoPorMinuto;
    }

    getTemperatura() {
        return this.temperatura;
    }

    getAcelerometroX() {
        this.acelerometroX;
    }

    getAcelerometroY() {
        this.acelerometroY;
    }

    getAcelerometroZ() {
        this.acelerometroZ;
    }

    getGiroscopioX() {
        this.giroscopioX;
    }

    getGiroscopioY() {
        this.giroscopioY;
    }

    getGiroscopioZ() {
        this.giroscopioZ;
    }

    getTimestamp() {
        return this.timestamp;
    }
}