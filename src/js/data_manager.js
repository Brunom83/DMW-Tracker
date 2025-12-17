// src/js/data_manager.js
import { showAlert } from './utils.js';

export class DataManager {
    constructor() {
        this.inicializarEventos();
    }

    inicializarEventos() {
        const btnExportar = document.getElementById('btnExportar');
        const btnImportar = document.getElementById('btnImportar');
        const inputFile = document.getElementById('inputFileImportar');

        if (btnExportar) btnExportar.addEventListener('click', () => this.exportarDados());
        if (btnImportar) btnImportar.addEventListener('click', () => inputFile.click());
        if (inputFile) inputFile.addEventListener('change', (e) => this.importarDados(e));
    }

    exportarDados() {
        // Coleta todos os dados do LocalStorage
        const dados = {
            moedas: JSON.parse(localStorage.getItem('dmwMoedas')),
            eggs: JSON.parse(localStorage.getItem('dmwEggs')),
            tours: JSON.parse(localStorage.getItem('dmwToursConfig')),
            meta: {
                version: '1.2',
                dataBackup: new Date().toLocaleString('pt-PT')
            }
        };

        // Cria o ficheiro JSON para download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "dmw_backup_" + new Date().toISOString().slice(0,10) + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    importarDados(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result);
                
                // Validação simples
                if (!dados.moedas && !dados.eggs && !dados.tours) {
                    throw new Error("Ficheiro inválido ou vazio.");
                }

                if(confirm(`Backup de: ${dados.meta?.dataBackup || 'Desconhecido'}\nIsto vai substituir os teus dados atuais. Continuar?`)) {
                    if(dados.moedas) localStorage.setItem('dmwMoedas', JSON.stringify(dados.moedas));
                    if(dados.eggs) localStorage.setItem('dmwEggs', JSON.stringify(dados.eggs));
                    if(dados.tours) localStorage.setItem('dmwToursConfig', JSON.stringify(dados.tours));
                    
                    showAlert("✅ Dados restaurados com sucesso!");
                    setTimeout(() => window.location.reload(), 1000); // Recarrega a página para aplicar
                }
            } catch (error) {
                console.error(error);
                showAlert("❌ Erro ao importar: " + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset para permitir importar o mesmo ficheiro se necessário
    }
}