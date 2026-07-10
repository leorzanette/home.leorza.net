# home.leorza.net

Página inicial (portal) do servidor pessoal `leorza.net`, com cards de atalho para os serviços publicados.

## Stack

Site estático — HTML/CSS/JS puro, publicado no GitHub Pages em `home.leorza.net`.

## Como usar localmente

```bash
python -m http.server 8000
```

Ou abra `index.html` diretamente no navegador.

## Conteúdo

- `index.html` — página principal
- `assets/` — imagens e recursos
- `favicon.ico` / `favicon.svg`
- `redirect-worker/` — Worker Cloudflare que redireciona `leorza.net` → `home.leorza.net`

## Redirecionar leorza.net → home.leorza.net

Hoje `leorza.net` aponta para um Cloudflare Tunnel quebrado (erro 530). Para redirecionar o domínio raiz para o portal:

### Opção A — Regra de redirecionamento no Cloudflare (mais rápida)

1. No [dashboard Cloudflare](https://dash.cloudflare.com), abra a zona `leorza.net`.
2. Em **Zero Trust → Networks → Tunnels**, remova o hostname público `leorza.net` (e `www.leorza.net`, se existir) do tunnel atual.
3. Vá em **Rules → Redirect Rules → Create rule**.
4. Configure:
   - **Nome:** `leorza.net to home`
   - **When:** hostname equals `leorza.net` OR hostname equals `www.leorza.net`
   - **Then:** Static redirect to `https://home.leorza.net${uri.path}${uri.query}`, status **301**
5. Salve e teste: `curl -I https://leorza.net` deve retornar `301` com `Location: https://home.leorza.net/`.

### Opção B — Worker versionado neste repositório

O diretório `redirect-worker/` contém um Worker que faz redirect 301 preservando path e query string.

**Deploy manual:**

```bash
cd redirect-worker
npm ci
npx wrangler login
npm run deploy
```

Antes do deploy, remova os hostnames `leorza.net` / `www.leorza.net` do tunnel (mesmo passo da opção A).

**Deploy automático via GitHub Actions:**

1. Crie um API Token no Cloudflare com permissão **Workers Scripts Edit** na conta.
2. Adicione estes secrets no repositório:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Faça push em `master` (ou dispare o workflow **Deploy leorza.net redirect** manualmente).
