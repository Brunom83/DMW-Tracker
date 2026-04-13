import scrapy
import re
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class DmwSpider(CrawlSpider):
    name = 'dmw_spider'
    allowed_domains = ['digitalmastersworld.wiki.gg']

    # ==========================================
    # 🛑 MODO NINJA PACIFISTA (Embutido)
    # Segurança Máxima contra Bans de IP
    # ==========================================
    custom_settings = {
        'USER_AGENT': 'DMW_Theorycrafter_Bot (+https://github.com/Brunom83/DMW-Tracker)',
        'ROBOTSTXT_OBEY': True,
        'DOWNLOAD_DELAY': 3,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'DEPTH_LIMIT': 3,
        'FEED_EXPORT_ENCODING': 'utf-8',
        'AUTOTHROTTLE_ENABLED': True,
        'AUTOTHROTTLE_START_DELAY': 5,
        'AUTOTHROTTLE_MAX_DELAY': 60,
        'AUTOTHROTTLE_TARGET_CONCURRENCY': 1.0,
    }

    # 1. START URLS
    start_urls = [
        'https://digitalmastersworld.wiki.gg/wiki/Digimon_List',
        'https://digitalmastersworld.wiki.gg/wiki/Category:Systems',
        'https://digitalmastersworld.wiki.gg/wiki/Equipment_attributes',
        'https://digitalmastersworld.wiki.gg/wiki/Titles',
        'https://digitalmastersworld.wiki.gg/wiki/Deck_System',
        'https://digitalmastersworld.wiki.gg/wiki/Reborn_System',
        'https://digitalmastersworld.wiki.gg/wiki/Union_System',
        'https://digitalmastersworld.wiki.gg/wiki/Seal_Master',
        'https://digitalmastersworld.wiki.gg/wiki/Instance_Dungeons',
        'https://digitalmastersworld.wiki.gg/wiki/Digimon_Arena',
        'https://digitalmastersworld.wiki.gg/wiki/Digitamamon_(Item_Make)',
        'https://digitalmastersworld.wiki.gg/wiki/Takato_(Digital_Area_Craft)',
        'https://digitalmastersworld.wiki.gg/wiki/Taichi_(Spiral_Mountain)',
        'https://digitalmastersworld.wiki.gg/wiki/Clothing',
        'https://digitalmastersworld.wiki.gg/wiki/ChipSets',
        'https://digitalmastersworld.wiki.gg/wiki/DigiClone',
        'https://digitalmastersworld.wiki.gg/wiki/Memory_Skills',
        'https://digitalmastersworld.wiki.gg/wiki/Transcendence_System',
        'https://digitalmastersworld.wiki.gg/wiki/Rank_System',
        'https://digitalmastersworld.wiki.gg/wiki/Digimon_Attributes',
    ]

    # 2. REGRAS DE FILTRO
    rules = (
        Rule(
            LinkExtractor(
                allow=r'/wiki/',
                deny=(
                    r'/wiki/Special:',
                    r'/wiki/User:',
                    r'/wiki/User_talk:',
                    r'/wiki/Talk:',
                    r'/wiki/Category:',
                    r'/wiki/File:',
                    r'\?action=',
                    r'\&diff='
                )
            ),
            callback='parse_item',
            follow=True
        ),
    )

    def parse_item(self, response):
        url = response.url
        titulo = response.css('h1#firstHeading span::text').get()

        # ==========================================
        # 🧠 O CÉREBRO DA ARANHA (Roteamento)
        # ==========================================
        
        # 1. Se estivermos na página do REBORN SYSTEM
        if 'Reborn_System' in url:
            yield self.parse_reborn(response, titulo)
            
        # 2. Se estivermos na página do DECK SYSTEM
        elif 'Deck_System' in url:
            yield self.parse_decks(response, titulo)
            
        # 3. Se for outra página qualquer, por agora ignoramos
        # para não encher o JSON de lixo enquanto construímos a lógica.
        else:
            pass 

    # ==========================================
    # 🛠️ FUNÇÕES DE EXTRAÇÃO ESPECÍFICAS
    # ==========================================

    def parse_reborn(self, response, titulo):
        print(f"🔥 A extrair os Requisitos Lógicos do Reborn...")
        
        # 1. Apanhar todo o texto útil da página (ignorando menus laterais do MediaWiki)
        page_text = " ".join(response.css('.mw-parser-output *::text').getall())
        
        # 2. Usar RegEx para procurar os padrões numéricos no meio do texto
        # re.search procura o padrão. O \d+ significa "qualquer número".
        min_level_match = re.search(r'Level\s*(\d+)', page_text, re.IGNORECASE)
        min_size_match = re.search(r'(\d+)%', page_text)
        clone_match = re.search(r'(\d+/\d+)', page_text)
        
        # 3. Transformar o texto bruto num JSON tipado para o teu Frontend (JS) usar!
        return {
            'sistema': 'Reborn',
            'requisitos_logicos': {
                # Se encontrar o número, converte para Inteiro (int). Se não, usa um valor de segurança (fallback).
                'min_level': int(min_level_match.group(1)) if min_level_match else 120,
                'min_size_percent': int(min_size_match.group(1)) if min_size_match else 135,
                'clone_stats': clone_match.group(1) if clone_match else "75/75",
                # Lógica booleana simples: se a palavra "Transcended" ou "6/5" existir no texto, é True.
                'requires_transcendence': True if 'Transcended' in page_text or '6/5' in page_text else False
            }
        }

    def parse_decks(self, response, titulo):
        print(f"🃏 ENCONTREI O DECK SYSTEM! A analisar o HTML...")
        
        return {
            'tipo': 'sistema_colecao',
            'nome': titulo,
            'url': response.url,
            'status': 'Pendente de extração dos Digimons necessários'
        }