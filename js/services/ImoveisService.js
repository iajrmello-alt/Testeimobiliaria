import { SafeStorage } from '../utils/helpers.js';

export class ImoveisService {
    constructor() {
        this.storageKey = 'imoveis';
    }

    getAll() {
        return SafeStorage.get(this.storageKey, []);
    }

    getById(id) {
        const imoveis = this.getAll();
        return imoveis.find(imovel => imovel.id === id);
    }

    save(imoveis) {
        SafeStorage.set(this.storageKey, imoveis);
    }

    popularDadosIniciais() {
        let imoveis = this.getAll();
        if (imoveis.length === 0) {
            imoveis = [
                {
                    id: 1,
                    titulo: "Apartamento Moderno no Coração da Cidade",
                    preco: "1250000",
                    localizacao: "Centro, Cidade Exemplo",
                    tipo: "Apartamento",
                    quartos: "3",
                    banheiros: "2",
                    vagas: "2",
                    area: "120",
                    imagem: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    descricao: "Este apartamento espaçoso e moderno está localizado no coração da cidade, oferecendo acesso fácil a todas as comodidades."
                },
                // ... outros imóveis ...
            ];
            this.save(imoveis);
        }
        return imoveis;
    }
}