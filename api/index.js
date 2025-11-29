let app;
export default async function handler(req, res) {
  if (!app) {
    const appModule = await import('../backend/src/app.js');
    app = appModule.default;
  }
  return app(req, res);
}