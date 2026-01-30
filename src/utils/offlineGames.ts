export const SIMPLE_GAME_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offline Click Game</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background: #111;
      }
      button {
        font-size: 24px;
        padding: 16px 24px;
        border-radius: 8px;
        border: none;
        background: #4CAF50;
        color: white;
      }
    </style>
  </head>
  <body>
    <button onclick="count++; this.innerText = count">
      Click me
    </button>
    <script>
      let count = 0;
    </script>
  </body>
</html>
`;
