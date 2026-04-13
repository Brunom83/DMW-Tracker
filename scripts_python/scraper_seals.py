import scrapy
import re

class DmwSealsSpider(scrapy.Spider):
    name = 'seals_spider'
    allowed_domains = ['digitalmastersworld.wiki.gg']
    
    # O nosso alvo único
    start_urls = ['https://digitalmastersworld.wiki.gg/wiki/Seal_Master']

    # Modo Extração Forçada
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False, # Ignora as restrições de bots da wiki.gg
        'DOWNLOAD_DELAY': 1,
        'FEED_EXPORT_ENCODING': 'utf-8',
    }

    def parse(self, response):
        print(f"🎴 Alvo alcançado: {response.url}")
        
        # Adicionado o "SK" que estava em falta graças à tua print!
        seals_data = {
            "HP": [], "DS": [], "AT": [], "DE": [], 
            "CT": [], "EV": [], "HT": [], "BL": [], "SK": [] 
        }
        
        # Saca todas as tabelas cruas da página
        tabelas = response.xpath('//table')
        print(f"[*] A aranha detetou {len(tabelas)} tabelas no código-fonte.")
        
        for tabela in tabelas:
            # Lê o texto da tabela e o título h2/h3 que está imediatamente antes dela
            tabela_texto = " ".join(tabela.xpath('.//text()').getall()).upper()
            titulo_anterior = " ".join(tabela.xpath('./preceding::*[self::h2 or self::h3][1]//text()').getall()).upper()
            
            # Descobre a que STAT esta tabela pertence
            stat_encontrado = None
            for stat in seals_data.keys():
                # Procura padrões como "AT [" ou "AT SEALS"
                if f"{stat} [" in titulo_anterior or f"{stat} SEALS" in tabela_texto or f"{stat} SEALS" in titulo_anterior:
                    stat_encontrado = stat
                    break
                    
            if not stat_encontrado:
                continue # Se não for uma tabela de seals, salta para a próxima
                
            print(f"[+] A extrair dados da tabela: {stat_encontrado}")
            
            linhas = tabela.xpath('.//tr')
            for linha in linhas:
                colunas = linha.xpath('.//td')
                
                # As tabelas de Seals têm de ter espaço para o Digimon e os 6 marcos
                if len(colunas) >= 7:
                    
                    # As últimas 6 colunas são sempre os números
                    col_numeros = colunas[-6:]
                    
                    # O nome está nas primeiras colunas (às vezes a 1ª é a imagem, a 2ª é o nome)
                    col_nomes = colunas[:-6]
                    nome = ""
                    for c in col_nomes:
                        txt = "".join(c.xpath('.//text()').getall()).strip()
                        if len(txt) > 2: # Evita apanhar células vazias
                            nome = txt
                            break
                            
                    # Função para extrair apenas os dígitos limpos
                    def clean_val(col):
                        txt = "".join(col.xpath('.//text()').getall())
                        num = re.sub(r'[^\d]', '', txt)
                        return int(num) if num else 0

                    val_3000 = clean_val(col_numeros[5])
                    
                    # Grava se tiver um nome válido e der stats
                    if nome and val_3000 > 0:
                        seals_data[stat_encontrado].append({
                            "nome": nome.replace('\n', '').strip(),
                            "1": clean_val(col_numeros[0]),
                            "50": clean_val(col_numeros[1]),
                            "200": clean_val(col_numeros[2]),
                            "500": clean_val(col_numeros[3]),
                            "1000": clean_val(col_numeros[4]),
                            "3000": val_3000
                        })
                        
        print("✅ Raspagem concluída e formatada!")
        yield {"sistema": "Seals", "dados": seals_data}