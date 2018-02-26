export class Usuario {

    constructor(public idMonitor: string = '', public nome: string= '', 
                    public peso: number = 0, public dataNascimento: string= '', 
                    public sexo: string= '',
                    public tipoSanguineo: string= '', public altura: number = 0) {

    }

    public getIdMonitor() {
        return this.idMonitor;
    }

}