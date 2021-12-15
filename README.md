# Basewar

## Init

```base
git clone git@github.com:fly04/basewar-app.git
cd basewar-app
npm install
```

Duplicate `src/environments/environment.sample.ts` to `src/environments/environment.ts` and adapt content

```typescript
export const environment = {
  production: false,
  apiUrl: "https://basewar.herokuapp.com/api",
};
```
