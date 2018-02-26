import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Usuario } from '../../domain/usuario/usuario';

const KEY = 'avatarUrl';
const KEYUSUARIO = 'usuario';

@Injectable()
export class UsuarioDao {

    private usuarioLogado: Usuario;
    private urlAvatar: string;

    constructor(private storage: Storage) {
        this.urlAvatar = "";
    }


    salva(usuario: Usuario) {
        return this.storage.set(KEYUSUARIO, usuario);
    }

    consulta() {
        this.storage.get(KEY).then(data => {
            if(data != null)
                this.urlAvatar = data;
        });

        return this.storage.get(KEYUSUARIO).then(data => {
            let usuarioDados;
            if(data !=  null) {
                usuarioDados = new Usuario (
                    data.idMonitor,
                    data.nome,
                    data.peso, 
                    data.dataNascimento,
                    data.sexo,
                    data.tipoSanguineo,
                    data.altura
                );
            }

            this.usuarioLogado = usuarioDados;
            return usuarioDados;
        });
        
    }

    retornaUsuarioLogado() {
        return this.usuarioLogado; 
    }

    salvarAvatar(url) {
        this.storage.set(KEY, url);
    }

    retornarAvatar() {
       return this.urlAvatar;
    }

}