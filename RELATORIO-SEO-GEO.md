# Relatório SEO / GEO — Dra Helem Fidélis Odontologia

**Data:** 02/07/2026
**Página auditada:** `index.html` (+ `politica-de-privacidade.html`, `termos-e-condicoes.html`)
**Executado por:** Skill SEO Specialist (auditoria on-page + implementação)

---

## ⚠️ AÇÃO CRÍTICA ANTES DE PUBLICAR

O site **ainda não tem domínio próprio** (conforme dossiê). Usei o domínio **placeholder** `https://www.drahelemfidelis.ag5agencia.site` em todos os campos que exigem URL absoluta. **Troque pelo domínio final** (com localizar/substituir) nestes 4 pontos antes de subir:

1. `index.html` → `<link rel="canonical">`, tags `og:url`, `og:image`, `twitter:image` e nos **2 blocos JSON-LD** (`url`, `image`, `@id`)
2. `robots.txt` → linha `Sitemap:`
3. `sitemap.xml` → os 3 `<loc>`
4. Cada arquivo tem um comentário `TROQUE o domínio...` sinalizando o local.

---

## ✅ O que foi implementado (on-page)

### 1. Meta tags essenciais
| Item | Antes | Depois |
|------|-------|--------|
| **Title** | "Dra Helem Fidélis — Odontologia... \| Paciência, RJ" (72 ch, marca primeiro) | **"Dentista em Paciência RJ \| Dra Helem Fidélis Odontologia"** (56 ch, palavra-chave + local no início — *front-loading*) |
| **Meta description** | 185 caracteres (longa demais) | 147 caracteres, com local + serviços + diferencial |
| **Keywords / Author / Robots** | ausentes | adicionados (`max-image-preview:large`) |
| **Canonical** | ausente | adicionado |
| **theme-color** | ausente | `#907860` (cor da marca) |

### 2. Local SEO (Geo tags)
- `geo.region` = BR-RJ · `geo.placename` = Paciência, Rio de Janeiro
- `geo.position` / `ICBM` = -22.9199083, -43.6338476 (coordenadas reais da clínica)

### 3. Redes sociais / semântica
- **Open Graph** completo (type, site_name, title, description, url, image, locale) → preview ao compartilhar no WhatsApp/Facebook
- **Twitter Cards** (summary_large_image)

### 4. Schema.org (JSON-LD) — validado ✔
- **`Dentist`** (LocalBusiness): NAP completo, geo, horário de funcionamento, `aggregateRating` 5.0 (15 avaliações), fundadora com CRO-RJ 056447, serviços e `sameAs` (Instagram, Facebook, TikTok, YouTube)
- **`FAQPage`**: as 4 perguntas frequentes → elegível a *rich snippet* no Google e citação em buscas de IA (GEO)

### 5. Performance (Core Web Vitals)
- `script.js` agora com **`defer`** (melhora INP/renderização)
- **`preconnect`** ao CDN de vídeo (`assets.cdn.filesafe.space`) → vídeos carregam antes
- Hero mantém `fetchpriority="high"` (LCP) ✔ · fontes com `display=swap` ✔ · imagens `.webp` ✔ · `loading="lazy"` abaixo da dobra ✔

### 6. Acessibilidade / estrutura semântica
- Adicionado o elemento **`<main id="conteudo">`** (não existia) envolvendo o conteúdo principal — melhora acessibilidade e leitura por crawlers
- Estrutura já tinha `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>` e apenas 1 `<h1>` ✔

### 7. Arquivos criados
- **`robots.txt`** — libera crawlers tradicionais **e de IA** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc. → GEO) + aponta o sitemap
- **`sitemap.xml`** — 3 URLs (home + política + termos)

---

## 📋 Tarefas EXTERNAS (off-page) — você precisa fazer manualmente

| # | Tarefa | Prioridade |
|---|--------|-----------|
| 1 | **Definir/registrar o domínio** e substituir o placeholder (ver "Ação Crítica" acima) | 🔴 Alta |
| 2 | **Google Meu Negócio (GMB):** verificar o perfil e garantir que o NAP seja **idêntico** ao do site (nome, endereço, telefone) | 🔴 Alta |
| 3 | **Google Search Console:** cadastrar o site, enviar o `sitemap.xml` e solicitar indexação | 🔴 Alta |
| 4 | **Imagem de compartilhamento (og:image):** criar uma versão **1200×630 px em JPG/PNG** (o WhatsApp às vezes não renderiza `.webp`). Hoje aponta para o retrato `.webp` | 🟡 Média |
| 5 | **Google Analytics / Tag Manager:** instalar o código de acompanhamento (não há tracking na página) | 🟡 Média |
| 6 | **Backlinks:** cadastrar em diretórios locais/odontológicos e parceiros da região | 🟡 Média |
| 7 | **Redes sociais:** garantir link para o site na bio do Instagram, Facebook, TikTok e YouTube | 🟢 Baixa |
| 8 | **PageSpeed Insights:** rodar teste ao vivo após publicação (pega atrasos de servidor) | 🟢 Baixa |
| 9 | **HTTPS/SSL:** garantir que a hospedagem force HTTPS | 🔴 Alta |
| 10 | **E-mail institucional:** o schema usa `drahelemfidelis@gmail.com` (provisório) — trocar por e-mail do domínio quando existir | 🟢 Baixa |

---

## 💡 Recomendações de conteúdo (próximos passos p/ ranquear mais)
- **Blog/artigos** respondendo dúvidas reais ("Quanto custa um implante?", "Faceta dói?") → forte para SEO e GEO (conteúdo citável por IA).
- Adicionar **`width`/`height` explícitos** nas `<img>` de conteúdo para blindar 100% o CLS (hoje o CSS com `aspect-ratio`/`object-fit` já reserva o espaço na maioria dos casos).
- Coletar mais **avaliações no Google** e manter o `reviewCount` do schema atualizado.

---
*Observação: fatores off-page e de servidor não podem ser corrigidos via código — por isso constam na lista manual acima.*
