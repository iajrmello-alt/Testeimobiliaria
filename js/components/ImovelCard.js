import { sanitizeInput } from '../utils/helpers.js';
import { formatCurrency } from '../utils/helpers.js';

export class ImovelCard {
    constructor(imovel) {
        this.imovel = sanitizeInput(imovel);
    }

    formatarPreco() {
        return this.imovel.preco.includes('/mês') 
            ? this.imovel.preco 
            : formatCurrency(this.imovel.preco);
    }

    render() {
        return `
            <div class="imovel-card">
                <img src="${this.imovel.imagem || 'images/placeholder.jpg'}" 
                     alt="${this.imovel.titulo}"
                     loading="lazy"
                     width="600"
                     height="400">
                <div class="imovel-card-content">
                    <h3>${this.imovel.titulo}</h3>
                    <p class="preco">${this.formatarPreco()}</p>
                    <p class="localizacao">${this.imovel.localizacao}</p>
                    <div class="imovel-card-features">
                        ${this.renderFeatures()}
                    </div>
                    <a href="detalhe-imovel.html?id=${this.imovel.id}" 
                       class="btn-detalhes"
                       aria-label="Ver detalhes de ${this.imovel.titulo}">
                        Ver Detalhes
                    </a>
                </div>
            </div>
        `;
    }

    renderFeatures() {
        const features = [
            {
                icon: 'ruler-combined',
                value: this.imovel.area,
                text: 'm²'
            },
            {
                icon: 'bed',
                value: this.imovel.quartos,
                text: 'Quartos'
            },
            {
                icon: 'bath',
                value: this.imovel.banheiros,
                text: 'Banh.'
            },
            {
                icon: 'car',
                value: this.imovel.vagas,
                text: 'Vagas'
            }
        ];

        return features
            .filter(feature => feature.value > 0)
            .map(feature => `
                <div class="card-feature-item">
                    <i class="fa-solid fa-${feature.icon}" aria-hidden="true"></i>
                    <span>${feature.value} ${feature.text}</span>
                </div>
            `).join('');
    }
}