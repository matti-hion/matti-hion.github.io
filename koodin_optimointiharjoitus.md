# Koodin optimointiharjoitus - raportti

Osoite: https://matti-hion.github.io/public/index.html

## Webpack-konfiguraatio ja minifiointi
- **JavaScript minifiointi**: Webpack nyt pakkaa app.js tiedoston app.min.js muotoon
- **CSS minifiointi**: Tyylitiedostot pakataan styles.min.css muotoon
- **Tuotantoversio**: Webpack käyttää production-moodia optimaalista pakkausta varten

## Kuvien optimointi
- **WebP-formaatti**: Taustakuva (bgimage.webp) käyttää modernia WebP-formaattia pienemmän tiedostokoon saavuttamiseksi
- **Automaattinen kuvanpakkaus**: Package.json sisältää imagemin-skriptit kuvien optimointiin
- **Webpack asset handling**: Konfiguroitu käsittelemään kuvia ja videoita automaattisesti

## Lazy Loading ja suorituskyky
- **Video lazy loading**: Video ladataan vasta kun käyttäjä klikkaa "Show Demo Video" -nappia
- **Preload=none**: Video ei lataudu automaattisesti sivun mukana säästäen kaistanleveyttä
- **Constants caching**: fetchConstants() funktio tallentaa haetut tiedot välimuistiin välttäen tarpeettomat API-kutsut

## HTML-rakenteen parannukset
- **Täydellinen output-osio**: Lisätty kaikki tarvittavat span-elementit tilastojen näyttämiselle
- **Video toggle toiminnallisuus**: Dynaamiset näytä/piilota napit videolle
- **Semantic markup**: Parempi rakenne taulukoille ja lomakeelementeille
- **Meta tagit**: Cache-control ja viewport optimoinnit

## JavaScript-koodin parannukset
- **Async/await**: Moderni asynkroninen koodin käsittely
- **Filter & reduce**: Funktionaalinen ohjelmointi paremman suorituskyvyn saavuttamiseksi
- **Error handling**: Kattava virheenkäsittely fetch-operaatioille
- **Event delegation**: Optimoidut event listenerit DOM-valmiuden jälkeen

## Build-prosessi
- **Yksivaiheinen build:** Yksi webpack build-komento käsittelee sekä JS- että CSS-tiedostot
- **JavaScript-optimointi:** TerserPlugin minifioi koodin ja poistaa console.log-lauseet
- **CSS-käsittely:** MiniCssExtractPlugin erottaa CSS:n omaksi tiedostokseen ja CssMinimizerPlugin optimoi sen
- **Mediaoptimointi:** Erilliset komennot kuvien (imagemin) ja videon (ffmpeg) optimointiin
- **Kehitysympäristö:** Webpack Dev Server mahdollistaa nopean kehitystyön hot reload -ominaisuudella

## Suorituskykymittausten tulokset

### Website Carbon Calculator
- **Ennen optimointeja**: Arvosana **F** 2.17 g of CO2
- **Optimointien jälkeen**: Arvosana **A** 0.12 g of CO2

### PageSpeed Insights
- **Ennen optimointeja**: 93 Performance 91 Accessibility 96 Best Practices 82 SEO
- **Optimointien jälkeen**: 100 Performance 91 Accessibility 96 Best Practices 90 SEO

- Erityisesti **latausnopeus**, **FCP** ja **LCP** mittarit nousivat merkittävästi

## Yhteenveto

Toteutetut optimoinnit parantavat merkittävästi sovelluksen suorituskykyä ja käyttökokemusta. Latausnopeus on kasvanut, kaistanleveyden käyttö vähentynyt ja erityisesti mobiililaitteiden käyttökokemus parantunut huomattavasti.

### Miksi nämä muutokset tehtiin?

**Webpack-minifiointi** oli välttämätön, koska alkuperäiset JavaScript- ja CSS-tiedostot sisälsivät paljon turhaa koodia ja välilyöntejä. Minifiointi pienentää tiedostokokoja jopa 30-60%, mikä tarkoittaa nopeampaa latausaikaa.

**WebP-kuvaformaatti** valittiin JPEG/PNG:n sijaan, koska se on 25-35% pienempi tiedostokoko samalla laatutasolla. Moderni selaintuki on riittävä (95%+ selaimista). Samalla kuvan laatuasetuksia säädettiin.

**Video lazy loading** oli kriittinen, koska video olisi muuten ladannut automaattisesti jopa 19MB dataa heti sivun avauksessa. Nyt video latautuu vain tarvittaessa.

**Caching-mekanismi** fetchConstants()-funktiolle estää API-kutsujen toistamisen, mikä parantaa käyttökokemusta ja vähentää palvelimen kuormitusta.

Nykyiset optimoinnit riittävät hyvin tämän kokoiselle sovellukselle ja tarjoavat vahvan perustan tulevalle kehitykselle.

**Jatkokehitysmahdollisuudet:**
- Video voitaisiin ladata esimerkiksi hover-toiminnolla klikkauksen sijaan
- Suuremmissa toteutuksissa tarvittaisiin laajempia optimointitoimia (CDN, service workerit, jne.)


## Muuta

Asennus & hostaus lokaaliympäristössä:
````
npm install
npm run build
python3 -m http.server 8000
````
Tämän jälkeen näet sovelluksen selaimellasi osoitteessa http://localhost:8000/public/
