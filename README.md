# Laboration 4 - frontend

Detta är frontend-delen av Laboration 4, en Single Page Application byggd med Vanilla JavaScript och Vite som kommunicerar med ett Express-API.

## Funktioner
* **Vyer:** Sömlös växling mellan registrering och inloggning, utan att ladda om sidan.
* **Sessionshantering:** Sparar JWT-token och användarnamn i `localStorage` vid lyckad inloggning.
* **Säker datahämtning:** Hämtar och visar data från backend genom att skicka med token i `Authorization`-headern.
* **Utloggning:** Rensar sparad session och återställer applikationen.

## Tekniker
* **Vite**
* **HTML5, CSS, JavaScript**